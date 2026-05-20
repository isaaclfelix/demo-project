import z from "zod";

import { categoryTermSchema, tagTermSchema } from "./taxonomy";

export const updatePostEndpointSchema = z
  .strictObject({
    _id: z.string(),
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
    categories: z.array(categoryTermSchema),
    tags: z.array(tagTermSchema),
    permalinkCategoryOriginalId: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.permalinkCategoryOriginalId === undefined) {
      return;
    }
    if (
      !data.categories.some(
        (c) => c.originalId === data.permalinkCategoryOriginalId,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "permalinkCategoryOriginalId must appear in the categories array.",
        path: ["permalinkCategoryOriginalId"],
      });
      return;
    }
    const leaf = data.categories.find(
      (c) => c.originalId === data.permalinkCategoryOriginalId,
    );
    if (leaf?.parentOriginalId === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Permalink category must be a subcategory (parentOriginalId required on that term).",
        path: ["permalinkCategoryOriginalId"],
      });
    }
  });

export type UpdatePostEndpointSchema = z.infer<typeof updatePostEndpointSchema>;
