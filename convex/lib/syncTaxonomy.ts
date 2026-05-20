import { ConvexError } from "convex/values";

import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

export type CategoryTermInput = {
  originalId: number;
  name: string;
  slug: string;
  parentOriginalId?: number;
};

export type TagTermInput = {
  originalId: number;
  name: string;
  slug: string;
};

/** Memoizes category rows by `originalId` across upserts and recomputes in one sync/mutation. */
export type CategoryCache = Map<number, Doc<"categories"> | null>;

export function createCategoryCache(): CategoryCache {
  return new Map();
}

async function getCategoryByOriginalId(
  ctx: MutationCtx,
  cache: CategoryCache,
  originalId: number,
): Promise<Doc<"categories"> | null> {
  if (cache.has(originalId)) {
    return cache.get(originalId) ?? null;
  }

  const row = await ctx.db
    .query("categories")
    .withIndex("by_original_id", (q) => q.eq("originalId", originalId))
    .unique();

  cache.set(originalId, row ?? null);
  return row;
}

/**
 * Rebuild `pathKey` for one category and every descendant.
 *
 * `pathKey` is the slash-separated slug path used in URLs (e.g. `programming/javascript`).
 * Categories only store `parentOriginalId`, not the full path, so we derive pathKey by
 * walking up the parent chain. When this node's slug or parent changes, every descendant's
 * pathKey is stale too — we fix this node first, then recurse into each direct child.
 *
 * A shared `cache` avoids re-querying rows already loaded while walking the tree or
 * upserting multiple categories in one batch (e.g. `programming` is fetched once).
 *
 * Called from `upsertCategory` after insert/patch; entry `originalId` is the node that changed.
 */
export async function recomputeCategoryPathKey(
  ctx: MutationCtx,
  originalId: number,
  cache: CategoryCache,
): Promise<void> {
  const cat = await getCategoryByOriginalId(ctx, cache, originalId);

  if (!cat) {
    return;
  }

  // --- Phase 1: compute this node's pathKey (iterative walk UP the tree) ---
  //
  // We start at `cat` and follow `parentOriginalId` until there is no parent (root).
  // Example tree:  programming → javascript → react
  //   If `originalId` is javascript, the loop visits:
  //     current = javascript → programming → (no parent, stop)
  //   We need slugs in root→leaf order for the URL: ["programming", "javascript"].

  const slugs: string[] = [];
  let current: Doc<"categories"> | null = cat;
  const visited = new Set<number>();

  while (current) {
    // parentOriginalId should form a DAG, but bad sync data can create a cycle (A→B→A).
    if (visited.has(current.originalId)) {
      break;
    }

    visited.add(current.originalId);

    // We discover nodes leaf→root, but pathKey is root→leaf. unshift prepends each slug:
    //   after javascript:  ["javascript"]
    //   after programming: ["programming", "javascript"]
    slugs.unshift(current.slug);

    if (current.parentOriginalId === undefined) {
      // Reached root; path is complete for this branch.
      break;
    }

    const parentId: number = current.parentOriginalId;

    // Uses cache so siblings/descendants do not re-query the same ancestors.
    current = await getCategoryByOriginalId(ctx, cache, parentId);
  }

  const pathKey = slugs.join("/");

  if (cat.pathKey !== pathKey) {
    await ctx.db.patch(cat._id, { pathKey });
    cache.set(originalId, { ...cat, pathKey });
  }

  // --- Phase 2: propagate to descendants (recursive walk DOWN the tree) ---
  //
  // A child's pathKey is parent.pathKey + "/" + child.slug (e.g. …/javascript/react).
  // Changing an ancestor slug invalidates every descendant, so each child reruns phase 1
  // (re-walks from itself up to root) and then phase 2 for its own children — depth-first.

  const children = await ctx.db
    .query("categories")
    .withIndex("by_parent_original_id", (q) =>
      q.eq("parentOriginalId", originalId),
    )
    .collect();

  for (const child of children) {
    cache.set(child.originalId, child);
    await recomputeCategoryPathKey(ctx, child.originalId, cache);
  }
}

export async function upsertCategory(
  ctx: MutationCtx,
  term: CategoryTermInput,
  cache: CategoryCache = createCategoryCache(),
): Promise<void> {
  const existing = await getCategoryByOriginalId(ctx, cache, term.originalId);

  if (existing) {
    await ctx.db.patch(existing._id, {
      name: term.name,
      slug: term.slug,
      parentOriginalId: term.parentOriginalId,
    });
    cache.set(term.originalId, {
      ...existing,
      name: term.name,
      slug: term.slug,
      parentOriginalId: term.parentOriginalId,
    });
  } else {
    // pathKey is derived server-side; "" satisfies the schema until recompute runs below.
    const id = await ctx.db.insert("categories", {
      originalId: term.originalId,
      name: term.name,
      slug: term.slug,
      parentOriginalId: term.parentOriginalId,
      pathKey: "",
    });

    const inserted = await ctx.db.get(id);

    if (inserted) {
      cache.set(term.originalId, inserted);
    }
  }

  await recomputeCategoryPathKey(ctx, term.originalId, cache);
}

export async function upsertTag(
  ctx: MutationCtx,
  term: TagTermInput,
): Promise<void> {
  const existing = await ctx.db
    .query("tags")
    .withIndex("by_original_id", (q) => q.eq("originalId", term.originalId))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      name: term.name,
      slug: term.slug,
    });
  } else {
    await ctx.db.insert("tags", {
      originalId: term.originalId,
      name: term.name,
      slug: term.slug,
    });
  }
}

export async function clearPostCategoryLinks(
  ctx: MutationCtx,
  postId: Id<"posts">,
): Promise<void> {
  const links = await ctx.db
    .query("postCategories")
    .withIndex("by_post", (q) => q.eq("postId", postId))
    .collect();

  for (const link of links) {
    await ctx.db.delete(link._id);
  }
}

export async function clearPostTagLinks(
  ctx: MutationCtx,
  postId: Id<"posts">,
): Promise<void> {
  const links = await ctx.db
    .query("postTags")
    .withIndex("by_post", (q) => q.eq("postId", postId))
    .collect();

  for (const link of links) {
    await ctx.db.delete(link._id);
  }
}

export async function syncPostCategories(
  ctx: MutationCtx,
  postId: Id<"posts">,
  terms: CategoryTermInput[],
  postUpdatedAt: string,
): Promise<void> {
  // Clear existing links.
  await clearPostCategoryLinks(ctx, postId);

  const categoryCache = createCategoryCache();

  for (const term of terms) {
    await upsertCategory(ctx, term, categoryCache);

    // Create link.
    await ctx.db.insert("postCategories", {
      postId,
      categoryOriginalId: term.originalId,
      postUpdatedAt,
    });
  }
}

export async function syncPostTags(
  ctx: MutationCtx,
  postId: Id<"posts">,
  terms: TagTermInput[],
): Promise<void> {
  // Clear existing links.
  await clearPostTagLinks(ctx, postId);

  for (const term of terms) {
    await upsertTag(ctx, term);

    // Create link.
    await ctx.db.insert("postTags", {
      postId,
      tagOriginalId: term.originalId,
    });
  }
}

/**
 * After taxonomy sync, ensure stored permalink category has a two-segment pathKey.
 */
export async function assertPermalinkCategoryValid(
  ctx: MutationCtx,
  permalinkCategoryOriginalId: number,
): Promise<string | null> {
  const row = await ctx.db
    .query("categories")
    .withIndex("by_original_id", (q) =>
      q.eq("originalId", permalinkCategoryOriginalId),
    )
    .unique();

  if (!row) {
    return "Permalink category was not found after sync.";
  }

  if (row.parentOriginalId === undefined) {
    return "Permalink category must be a subcategory (has parent).";
  }

  if (row.pathKey.split("/").length !== 2) {
    return "Permalink category pathKey must have exactly two segments.";
  }

  return null;
}

export async function syncPostTaxonomy(
  ctx: MutationCtx,
  postId: Id<"posts">,
  args: {
    categories: CategoryTermInput[];
    tags: TagTermInput[];
    permalinkCategoryOriginalId: number;
    updatedAt: string;
  },
): Promise<void> {
  await syncPostCategories(ctx, postId, args.categories, args.updatedAt);
  await syncPostTags(ctx, postId, args.tags);

  const err = await assertPermalinkCategoryValid(
    ctx,
    args.permalinkCategoryOriginalId,
  );

  if (err) {
    throw new ConvexError(err);
  }
}
