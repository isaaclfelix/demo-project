import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { createPostEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";

export const createPost = internalMutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    excerpt: v.string(),
    type: v.string(),
    status: v.string(),
    commentStatus: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
    originalId: v.number(),
    authorId: v.number(),
    categoryIds: v.array(v.number()),
    tagIds: v.array(v.number()),
  },
  handler: async (ctx, args): Promise<Id<"posts"> | Error> => {
    let existingPost: Doc<"posts"> | null = null;

    try {
      existingPost = await ctx.db
        .query("posts")
        .withIndex("by_original_id", (q) => q.eq("originalId", args.originalId))
        .unique();
    } catch (error) {
      return error as Error;
    }

    if (existingPost) {
      return new Error(
        "Trying to insert a post with an originalId that already exists",
      );
    }

    let insertResponse;

    try {
      insertResponse = await ctx.db.insert("posts", args);
    } catch (error) {
      return error as Error;
    }

    return insertResponse;
  },
});

export const createPostEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const requestBody = await req.json();

  const parsedRequestBody = createPostEndpointSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return new Response(
      JSON.stringify({ error: parsedRequestBody.error.issues }),
      {
        status: 400,
      },
    );
  }

  const mutationResponse: Id<"posts"> | Error = await ctx.runMutation(
    internal.posts.createPost,
    parsedRequestBody.data,
  );

  if (mutationResponse instanceof Error) {
    return new Response(JSON.stringify({ error: mutationResponse.message }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ id: mutationResponse }), {
    status: 200,
  });
});
