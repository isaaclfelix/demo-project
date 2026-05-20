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
    permalinkCategoryOriginalId: v.optional(v.number()),
  })
    .index("by_original_id", ["originalId"])
    .index("by_slug", ["slug"])
    .index("by_updated_at", ["updatedAt"])
    .index("by_permalink_category", ["permalinkCategoryOriginalId"]),
  categories: defineTable({
    originalId: v.number(),
    name: v.string(),
    slug: v.string(),
    parentOriginalId: v.optional(v.number()),
    pathKey: v.string(),
  })
    .index("by_original_id", ["originalId"])
    .index("by_slug", ["slug"])
    .index("by_path_key", ["pathKey"])
    .index("by_parent_original_id", ["parentOriginalId"]),
  tags: defineTable({
    originalId: v.number(),
    name: v.string(),
    slug: v.string(),
  })
    .index("by_original_id", ["originalId"])
    .index("by_slug", ["slug"]),
  postCategories: defineTable({
    postId: v.id("posts"),
    categoryOriginalId: v.number(),
    postUpdatedAt: v.string(),
  })
    .index("by_post", ["postId"])
    .index("by_category", ["categoryOriginalId"])
    .index("by_category_and_post_updated_at", [
      "categoryOriginalId",
      "postUpdatedAt",
    ]),
  postTags: defineTable({
    postId: v.id("posts"),
    tagOriginalId: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_tag", ["tagOriginalId"]),
});
