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

export async function recomputeCategoryPathKey(
  ctx: MutationCtx,
  originalId: number,
): Promise<void> {
  const cat = await ctx.db
    .query("categories")
    .withIndex("by_original_id", (q) => q.eq("originalId", originalId))
    .unique();
  if (!cat) {
    return;
  }

  const slugs: string[] = [];
  let current: Doc<"categories"> | null = cat;
  const visited = new Set<number>();

  while (current) {
    if (visited.has(current.originalId)) {
      break;
    }
    visited.add(current.originalId);
    slugs.unshift(current.slug);
    if (current.parentOriginalId === undefined) {
      break;
    }
    const parentId: number = current.parentOriginalId;
    current = await ctx.db
      .query("categories")
      .withIndex("by_original_id", (q) => q.eq("originalId", parentId))
      .unique();
  }

  const pathKey = slugs.join("/");
  if (cat.pathKey !== pathKey) {
    await ctx.db.patch(cat._id, { pathKey });
  }

  const children = await ctx.db
    .query("categories")
    .withIndex("by_parent_original_id", (q) =>
      q.eq("parentOriginalId", originalId),
    )
    .collect();

  for (const child of children) {
    await recomputeCategoryPathKey(ctx, child.originalId);
  }
}

export async function upsertCategory(
  ctx: MutationCtx,
  term: CategoryTermInput,
): Promise<void> {
  const existing = await ctx.db
    .query("categories")
    .withIndex("by_original_id", (q) => q.eq("originalId", term.originalId))
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      name: term.name,
      slug: term.slug,
      parentOriginalId: term.parentOriginalId,
    });
  } else {
    await ctx.db.insert("categories", {
      originalId: term.originalId,
      name: term.name,
      slug: term.slug,
      parentOriginalId: term.parentOriginalId,
      pathKey: term.slug,
    });
  }

  await recomputeCategoryPathKey(ctx, term.originalId);
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
  await clearPostCategoryLinks(ctx, postId);
  for (const term of terms) {
    await upsertCategory(ctx, term);
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
  await clearPostTagLinks(ctx, postId);
  for (const term of terms) {
    await upsertTag(ctx, term);
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
  permalinkCategoryOriginalId: number | undefined,
): Promise<string | null> {
  if (permalinkCategoryOriginalId === undefined) {
    return null;
  }
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
    permalinkCategoryOriginalId?: number;
    updatedAt: string;
  },
): Promise<void> {
  await syncPostCategories(ctx, postId, args.categories, args.updatedAt);
  await syncPostTags(ctx, postId, args.tags);

  if (args.permalinkCategoryOriginalId !== undefined) {
    const err = await assertPermalinkCategoryValid(
      ctx,
      args.permalinkCategoryOriginalId,
    );
    if (err) {
      throw new Error(err);
    }
  }
}
