import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { updatePostEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";

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
    categoryIds: v.array(v.number()),
    tagIds: v.array(v.number()),
  },
  handler: async (ctx, args): Promise<Id<"posts"> | Error> => {
    const convexId = args._id;

    delete (args._id as { _id?: Id<"posts"> })._id;

    try {
      await ctx.db.patch(convexId, args);
    } catch (error) {
      return error as Error;
    }

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

  const mutationResponse: Id<"posts"> | Error = await ctx.runMutation(
    internal.posts.updatePost,
    {
      ...postFields,
      _id: postId as Id<"posts">,
    },
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
