import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { postCanonicalPath } from "../lib/content/postPath";
import { query } from "./_generated/server";
import { canonicalPathForPostDoc } from "./lib/canonicalPathForPostDoc";
import {
  parsePostContentDoc,
  type PostWithParsedContentAndCanonicalPath,
} from "./lib/parsePostContent";

export type { PostWithParsedContentAndCanonicalPath };

export const getPosts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const result = await ctx.db
      .query("posts")
      .withIndex("by_updated_at")
      .order("desc")
      .paginate(paginationOpts);

    const enriched: PostWithParsedContentAndCanonicalPath[] = [];

    for (const post of result.page) {
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

export const getPost = query({
  args: {
    id: v.id("posts"),
  },
  handler: async (
    ctx,
    args,
  ): Promise<PostWithParsedContentAndCanonicalPath | null> => {
    const post = await ctx.db.get(args.id);

    if (!post) {
      return null;
    }

    const parsed = parsePostContentDoc(post);

    if (!parsed) {
      return null;
    }

    const canonicalPath = await canonicalPathForPostDoc(ctx, post);

    if (!canonicalPath) {
      return null;
    }

    return {
      ...parsed,
      canonicalPath,
    };
  },
});

export const getPostByCategoryPathAndSlug = query({
  args: {
    pathKey: v.string(),
    slug: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<PostWithParsedContentAndCanonicalPath | null> => {
    if (args.pathKey.split("/").length !== 2) {
      return null;
    }

    const category = await ctx.db
      .query("categories")
      .withIndex("by_path_key", (q) => q.eq("pathKey", args.pathKey))
      .unique();

    if (!category || category.parentOriginalId === undefined) {
      return null;
    }

    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();

    if (!post) {
      return null;
    }

    if (post.permalinkCategoryOriginalId !== category.originalId) {
      return null;
    }

    const canonicalPath = postCanonicalPath({
      slug: post.slug,
      pathKey: category.pathKey,
    });

    const parsed = parsePostContentDoc(post);

    if (!parsed) {
      return null;
    }

    return {
      ...parsed,
      canonicalPath,
    };
  },
});

export { createPost, createPostEndpoint } from "./posts/createPost";
export { updatePost, updatePostEndpoint } from "./posts/updatePost";
export { removePost, removePostEndpoint } from "./posts/removePost";
