import { v } from "convex/values";

import { internal } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { httpAction, internalMutation } from "../_generated/server";
import { removePostEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
import { mutationErrorResponse } from "../lib/mutationErrorResponse";
import { clearPostCategoryLinks, clearPostTagLinks } from "../lib/syncTaxonomy";

export const removePost = internalMutation({
  args: {
    _id: v.id("posts"),
  },
  handler: async (ctx, args): Promise<Id<"posts">> => {
    await clearPostCategoryLinks(ctx, args._id);
    await clearPostTagLinks(ctx, args._id);
    await ctx.db.delete(args._id);

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

  try {
    const id = await ctx.runMutation(internal.posts.removePost, {
      _id: postId as Id<"posts">,
    });

    return new Response(JSON.stringify({ id }), {
      status: 200,
    });
  } catch (error) {
    return mutationErrorResponse(error);
  }
});
