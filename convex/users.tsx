import { ConvexError, v } from "convex/values";

import { mutation } from "./_generated/server";

export const store = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, { email }) => {
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
      email,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});
