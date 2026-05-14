import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  posts: defineTable({
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
  })
    .index("by_original_id", ["originalId"])
    .index("by_slug", ["slug"]),
  authors: defineTable({
    name: v.string(),
    slug: v.string(),
    bio: v.string(),
    avatarUrl: v.string(),
    originalId: v.number(),
  }).index("by_original_id", ["originalId"]),
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    originalId: v.number(),
  }).index("by_original_id", ["originalId"]),
  tags: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    originalId: v.number(),
  }).index("by_original_id", ["originalId"]),
});
