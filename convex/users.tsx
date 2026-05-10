import { ConvexError, v } from "convex/values";

import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

export const store = mutation({
  args: {},
  handler: async (ctx: MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Called storeUser without authentication present");
    }

    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();

    // If we've seen this identity before return user id.
    if (user) {
      return user._id;
    }

    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      email: identity.email ?? "",
      emailVerified: identity.emailVerified ?? false,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const currentUser = query({
  args: {},
  handler: async (ctx: QueryCtx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError(
        "Called currentUser without authentication present",
      );
    }

    // Search for the user by their token identifier.
    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
  },
});
