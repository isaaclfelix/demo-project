import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Doc, Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { createPostEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
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
    permalinkCategoryOriginalId: v.optional(v.number()),
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

    const { categories, tags, permalinkCategoryOriginalId, ...postFields } =
      args;

    let postId: Id<"posts">;

    try {
      postId = await ctx.db.insert("posts", {
        ...postFields,
        permalinkCategoryOriginalId,
      });
    } catch (error) {
      return error as Error;
    }

    try {
      await syncPostTaxonomy(ctx, postId, {
        categories,
        tags,
        permalinkCategoryOriginalId,
        updatedAt: args.updatedAt,
      });
    } catch (error) {
      await ctx.db.delete(postId);
      return error as Error;
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

  const mutationResponse: Id<"posts"> | Error = await ctx.runMutation(
    internal.posts.createPost,
    parsedRequestBody.data,
  );

  if (mutationResponse instanceof Error) {
    const isClient = mutationResponse.message.includes("Permalink category");
    return new Response(JSON.stringify({ error: mutationResponse.message }), {
      status: isClient ? 400 : 500,
    });
  }

  return new Response(JSON.stringify({ id: mutationResponse }), {
    status: 200,
  });
});
