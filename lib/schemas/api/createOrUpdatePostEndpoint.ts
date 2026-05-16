import z from "zod";

export const createOrUpdatePostEndpoint = z.strictObject({
  _id: z.string().optional(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  type: z.string(),
  status: z.string(),
  commentStatus: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  originalId: z.number(),
  authorId: z.number(),
  categoryIds: z.array(z.number()),
  tagIds: z.array(z.number()),
});

export type CreateOrUpdatePostEndpoint = z.infer<
  typeof createOrUpdatePostEndpoint
>;
