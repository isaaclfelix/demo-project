import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { removePostEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";

export const removePost = internalMutation({
  args: {
    _id: v.id("posts"),
  },
  handler: async (ctx, args): Promise<Id<"posts"> | Error> => {
    try {
      await ctx.db.delete(args._id);
    } catch (error) {
      return error as Error;
    }

    return args._id;
  },
});

export const removePostEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const requestBody = await req.json();

  const parsedRequestBody = removePostEndpointSchema.safeParse(requestBody);

  if (!parsedRequestBody.success) {
    return new Response(
      JSON.stringify({ error: parsedRequestBody.error.issues }),
      {
        status: 400,
      },
    );
  }

  const { _id: postId } = parsedRequestBody.data;

  const mutationResponse: Id<"posts"> | Error = await ctx.runMutation(
    internal.posts.removePost,
    {
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
