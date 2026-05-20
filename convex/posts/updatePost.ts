import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { updatePostEndpointSchema } from "../../lib/schemas/api";
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

export const updatePost = internalMutation({
  args: {
    _id: v.id("posts"),
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
    const convexId = args._id;

    const {
      _id: _discard,
      categories,
      tags,
      permalinkCategoryOriginalId,
      ...postPatch
    } = args;

    await ctx.db.patch(convexId, {
      ...postPatch,
      permalinkCategoryOriginalId,
    });

    await syncPostTaxonomy(ctx, convexId, {
      categories,
      tags,
      permalinkCategoryOriginalId,
      updatedAt: args.updatedAt,
    });

    return convexId;
  },
});

export const updatePostEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const requestBody = await req.json();

  const parsedRequestBody = updatePostEndpointSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return new Response(
      JSON.stringify({ error: parsedRequestBody.error.issues }),
      {
        status: 400,
      },
    );
  }

  const { _id: postId, ...postFields } = parsedRequestBody.data;

  try {
    const id = await ctx.runMutation(internal.posts.updatePost, {
      ...postFields,
      _id: postId as Id<"posts">,
    });

    return new Response(JSON.stringify({ id }), {
      status: 200,
    });
  } catch (error) {
    return mutationErrorResponse(error);
  }
});
