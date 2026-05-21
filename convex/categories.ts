import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { query } from "./_generated/server";
import { canonicalPathForPostDoc } from "./lib/canonicalPathForPostDoc";
import {
  parsePostContentDoc,
  type PostWithParsedContentAndCanonicalPath,
} from "./lib/parsePostContent";

export type { PostWithParsedContentAndCanonicalPath };

export const getCategoryByPathKey = query({
  args: { pathKey: v.string() },
  handler: async (ctx, { pathKey }) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_path_key", (q) => q.eq("pathKey", pathKey))
      .unique();
  },
});

export type CategoryBreadcrumb = {
  label: string;
  href: string;
};

export const getCategoryBreadcrumbs = query({
  args: { pathKey: v.string() },
  handler: async (ctx, { pathKey }): Promise<CategoryBreadcrumb[]> => {
    const segments = pathKey.split("/").filter(Boolean);
    if (segments.length === 0) {
      return [];
    }

    const prefixes = segments.map((_, i) => segments.slice(0, i + 1).join("/"));

    const rows = await Promise.all(
      prefixes.map((prefix) =>
        ctx.db
          .query("categories")
          .withIndex("by_path_key", (q) => q.eq("pathKey", prefix))
          .unique(),
      ),
    );

    return prefixes.map((prefix, i) => {
      const row = rows[i];
      const label = row?.name ?? segments[i].replace(/-/g, " ");
      return {
        label,
        href: `/category/${prefix}`,
      };
    });
  },
});

export const listPostsByCategory = query({
  args: {
    categoryOriginalId: v.number(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { categoryOriginalId, paginationOpts }) => {
    const result = await ctx.db
      .query("postCategories")
      .withIndex("by_category_and_post_updated_at", (q) =>
        q.eq("categoryOriginalId", categoryOriginalId),
      )
      .order("desc")
      .paginate(paginationOpts);

    const enriched: PostWithParsedContentAndCanonicalPath[] = [];

    for (const link of result.page) {
      const post = await ctx.db.get(link.postId);

      if (!post) {
        continue;
      }

      const parsed = parsePostContentDoc(post);

      if (!parsed) {
        continue;
      }

      const path = await canonicalPathForPostDoc(ctx, post);

      if (!path) {
        continue;
      }

      enriched.push({
        ...parsed,
        canonicalPath: path,
      });
    }

    return {
      page: enriched,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export {
  createCategory,
  createCategoryEndpoint,
} from "./categories/createCategory";
export {
  removeCategory,
  removeCategoryEndpoint,
} from "./categories/removeCategory";
export {
  updateCategory,
  updateCategoryEndpoint,
} from "./categories/updateCategory";
