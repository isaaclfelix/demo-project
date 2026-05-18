import { v } from "convex/values";

import { PostContent, postContentSchema } from "../lib/schemas/blocks";
import { Doc } from "./_generated/dataModel";
import { query } from "./_generated/server";

type PostWithParsedContent = Omit<Doc<"posts">, "content"> & {
  content: PostContent;
};

type GetPostsResult = PostWithParsedContent[];

export const getPosts = query({
  args: {
    limit: v.number(),
    offset: v.number(),
  },
  handler: async (ctx, args): Promise<GetPostsResult> => {
    const posts = await ctx.db.query("posts").collect();

    const paginatedPosts = posts.slice(args.offset, args.offset + args.limit);

    return paginatedPosts.flatMap((post): GetPostsResult => {
      let parsedJson: PostContent = [];

      try {
        parsedJson = JSON.parse(post.content);
      } catch (error) {
        console.error(error);
        return [];
      }

      const parsedContent = postContentSchema.safeParse(parsedJson);
      if (!parsedContent.success) {
        console.error(
          `Invalid post content from Convex. Skipping post ${post._id}.`,
          parsedContent.error.issues,
        );
        return [];
      }

      return [
        {
          ...post,
          content: parsedContent.data,
        },
      ];
    });
  },
});

export { createPost, createPostEndpoint } from "./posts/createPost";
export { updatePost, updatePostEndpoint } from "./posts/updatePost";
export { removePost, removePostEndpoint } from "./posts/removePost";
