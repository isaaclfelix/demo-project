import { ConvexError, v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { createPostEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
import { mutationErrorResponse } from "../lib/mutationErrorResponse";
import { syncPostTaxonomy } from "../lib/syncTaxonomy";

const categoryTerm = v.object({
  originalId: v.number(),
  name: v.string(),
  slug: v.string(),
  parentOriginalId: v.optional(v.number()),
});

const tagTerm = v.object({
  originalId: v.number(),
  name: v.string(),
  slug: v.string(),
});

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
    categories: v.array(categoryTerm),
    tags: v.array(tagTerm),
    permalinkCategoryOriginalId: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"posts">> => {
    const existingPost = await ctx.db
      .query("posts")
      .withIndex("by_original_id", (q) => q.eq("originalId", args.originalId))
      .unique();

    if (existingPost) {
      throw new ConvexError(
        "Trying to insert a post with an originalId that already exists",
      );
    }

    const { categories, tags, permalinkCategoryOriginalId, ...postFields } =
      args;

    const postId = await ctx.db.insert("posts", {
      ...postFields,
      permalinkCategoryOriginalId,
    });

    try {
      await syncPostTaxonomy(ctx, postId, {
        categories,
        tags,
        permalinkCategoryOriginalId,
        updatedAt: args.updatedAt,
      });
    } catch (error) {
      await ctx.db.delete(postId);
      throw error;
    }

    return postId;
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

  try {
    const postId = await ctx.runMutation(
      internal.posts.createPost,
      parsedRequestBody.data,
    );

    return new Response(JSON.stringify({ id: postId }), {
      status: 200,
    });
  } catch (error) {
    return mutationErrorResponse(error);
  }
});
