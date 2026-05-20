import { v } from "convex/values";

import { internal } from "../_generated/api";
import { httpAction, internalMutation } from "../_generated/server";
import { removeTagEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
import { mutationErrorResponse } from "../lib/mutationErrorResponse";

export const removeTag = internalMutation({
  args: {
    originalId: v.number(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("tags")
      .withIndex("by_original_id", (q) => q.eq("originalId", args.originalId))
      .unique();

    if (!doc) {
      return;
    }

    const links = await ctx.db
      .query("postTags")
      .withIndex("by_tag", (q) => q.eq("tagOriginalId", args.originalId))
      .collect();

    for (const link of links) {
      await ctx.db.delete(link._id);
    }

    await ctx.db.delete(doc._id);
  },
});

export const removeTagEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const body = await req.json();
  const parsed = removeTagEndpointSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.issues }), {
      status: 400,
    });
  }

  try {
    await ctx.runMutation(internal.tags.removeTag, parsed.data);
  } catch (error) {
    return mutationErrorResponse(error);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
