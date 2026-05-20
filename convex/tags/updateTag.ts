import { v } from "convex/values";

import { internal } from "../_generated/api";
import { httpAction, internalMutation } from "../_generated/server";
import { updateTagEndpointSchema } from "../../lib/schemas/api";
import { verifyBearerToken } from "../httpAuth";
import { upsertTag } from "../lib/syncTaxonomy";

export const updateTag = internalMutation({
  args: {
    originalId: v.number(),
    name: v.string(),
    slug: v.string(),
  },
  handler: async (ctx, args) => {
    await upsertTag(ctx, args);
    return args.originalId;
  },
});

export const updateTagEndpoint = httpAction(async (ctx, req) => {
  const authError = verifyBearerToken(req);
  if (authError) {
    return authError;
  }

  const body = await req.json();
  const parsed = updateTagEndpointSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.issues }), {
      status: 400,
    });
  }

  try {
    await ctx.runMutation(internal.tags.updateTag, parsed.data);
  } catch (e) {
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Failed" }),
      { status: 500 },
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
