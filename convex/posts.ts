import { v } from "convex/values";

import { createPostEndpointSchema } from "../lib/schemas/api";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { httpAction, internalMutation } from "./_generated/server";

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
  handler: async (ctx, args): Promise<Id<"posts"> | false> => {
    const existingPost = await ctx.db
      .query("posts")
      .withIndex("by_original_id", (q) => q.eq("originalId", args.originalId))
      .unique();

    if (existingPost) {
      return false;
    }

    return await ctx.db.insert("posts", { ...args });
  },
});

export const createPostEndpoint = httpAction(async (ctx, req) => {
  const unauthorizedResponse = new Response(
    JSON.stringify({ error: "Unauthorized" }),
    {
      status: 401,
    },
  );

  const authorizationHeader = req.headers.get("Authorization");
  if (!authorizationHeader) {
    return unauthorizedResponse;
  }

  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme !== "Bearer" || !token) {
    return unauthorizedResponse;
  }

  const expectedToken = process.env.POST_TO_CONVEX_SECRET;
  if (!expectedToken) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }

  if (token !== expectedToken) {
    return unauthorizedResponse;
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

  const {
    title,
    slug,
    content,
    excerpt,
    type,
    status,
    commentStatus,
    createdAt,
    updatedAt,
    originalId,
    authorId,
    categoryIds,
    tagIds,
  } = parsedRequestBody.data;

  const newPostId = await ctx.runMutation(internal.posts.createPost, {
    title,
    slug,
    content,
    excerpt,
    type,
    status,
    commentStatus,
    createdAt,
    updatedAt,
    originalId,
    authorId,
    categoryIds,
    tagIds,
  });

  if (!newPostId) {
    return new Response(JSON.stringify({ error: "Post already exists" }), {
      status: 400,
    });
  }

  return new Response(JSON.stringify({ id: newPostId }), {
    status: 200,
  });
});
