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
  handler: async (ctx, args): Promise<GetPostsResult | Error> => {
    let posts: Doc<"posts">[] = [];

    try {
      posts = await ctx.db.query("posts").collect();
    } catch (error) {
      return error as Error;
    }

    if (posts.length === 0) {
      return [];
    }

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

    let parsedJson: PostContent = [];

    try {
      parsedJson = JSON.parse(post.content);
    } catch (error) {
      console.error(error);
      return error as Error;
    }

    const parsedContent = postContentSchema.safeParse(parsedJson);

    if (!parsedContent.success) {
      console.error(
        `Invalid post content from Convex on post ${post._id}.`,
        parsedContent.error.issues,
      );
      return new Error("Invalid post content");
    }

    const postWithParsedContent: PostWithParsedContent = {
      ...post,
      content: parsedContent.data,
    };

    return postWithParsedContent;
  },
});

export { createPost, createPostEndpoint } from "./posts/createPost";
export { updatePost, updatePostEndpoint } from "./posts/updatePost";
export { removePost, removePostEndpoint } from "./posts/removePost";
