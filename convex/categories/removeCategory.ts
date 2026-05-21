import { v } from "convex/values";

import { internal } from "../_generated/api";
import { httpAction, internalMutation } from "../_generated/server";
import { removeCategoryEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
import { mutationErrorResponse } from "../lib/mutationErrorResponse";

export const removeCategory = internalMutation({
  args: {
    originalId: v.number(),
  },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("categories")
      .withIndex("by_original_id", (q) => q.eq("originalId", args.originalId))
      .unique();

    if (!doc) {
      return;
    }

    const links = await ctx.db
      .query("postCategories")
      .withIndex("by_category", (q) =>
        q.eq("categoryOriginalId", args.originalId),
      )
      .collect();

    for (const link of links) {
      await ctx.db.delete(link._id);
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_permalink_category", (q) =>
        q.eq("permalinkCategoryOriginalId", args.originalId),
      )
      .collect();

    for (const post of posts) {
      await ctx.db.patch(post._id, {
        permalinkCategoryOriginalId: 0,
      });
    }

    await ctx.db.delete(doc._id);
  },
});

export const removeCategoryEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const body = await req.json();
  const parsed = removeCategoryEndpointSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.issues }), {
      status: 400,
    });
  }

  try {
    await ctx.runMutation(internal.categories.removeCategory, parsed.data);
  } catch (error) {
    return mutationErrorResponse(error);
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
