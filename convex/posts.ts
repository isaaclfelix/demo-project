import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { postCanonicalPath } from "../lib/content/postPath";
import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";
import {
  canonicalPathForPostDoc,
  parsePostContentDoc,
  type PostWithParsedContent,
} from "./lib/parsePostContent";

export type { PostWithParsedContent };

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

    const enriched: PostWithParsedContent[] = [];

    for (const post of result.page) {
      const path = await canonicalPathForPostDoc(ctx, post);
      const parsed = parsePostContentDoc(post, path);
      if (parsed) {
        enriched.push(parsed);
      }
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
  handler: async (ctx, args): Promise<PostWithParsedContent | Error> => {
    let post: Doc<"posts"> | null = null;

    try {
      post = await ctx.db.get(args.id);
    } catch (error) {
      return error as Error;
    }

    if (!post) {
      return new Error("Post not found");
    }

    const canonicalPath = await canonicalPathForPostDoc(ctx, post);

    const parsed = parsePostContentDoc(post, canonicalPath);
    if (!parsed) {
      return new Error("Invalid post content");
    }

    return parsed;
  },
});

export const getPostByCategoryPathAndSlug = query({
  args: {
    pathKey: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args): Promise<PostWithParsedContent | Error | null> => {
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

    const parsed = parsePostContentDoc(post, canonicalPath);
    if (!parsed) {
      return new Error("Invalid post content");
    }

    return parsed;
  },
});

export { createPost, createPostEndpoint } from "./posts/createPost";
export { updatePost, updatePostEndpoint } from "./posts/updatePost";
export { removePost, removePostEndpoint } from "./posts/removePost";
