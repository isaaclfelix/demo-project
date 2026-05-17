import { v } from "convex/values";

import { query } from "./_generated/server";

export const getPosts = query({
  args: {
    limit: v.number(),
    offset: v.number(),
  },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("posts").collect();

    const paginatedPosts = posts.slice(args.offset, args.offset + args.limit);

    return paginatedPosts;
  },
});

export { createPost, createPostEndpoint } from "./posts/createPost";
export { updatePost, updatePostEndpoint } from "./posts/updatePost";
export { removePost, removePostEndpoint } from "./posts/removePost";
