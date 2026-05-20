import { v } from "convex/values";

import { internal } from "../_generated/api";
import { httpAction, internalMutation } from "../_generated/server";
import { updateCategoryEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
import { upsertCategory } from "../lib/syncTaxonomy";

export const updateCategory = internalMutation({
  args: {
    originalId: v.number(),
    name: v.string(),
    slug: v.string(),
    parentOriginalId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await upsertCategory(ctx, args);
    return args.originalId;
  },
});

export const updateCategoryEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const body = await req.json();
  const parsed = updateCategoryEndpointSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.issues }), {
      status: 400,
    });
  }

  try {
    await ctx.runMutation(internal.categories.updateCategory, parsed.data);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed" }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
