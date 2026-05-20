import z from "zod";

export const categoryTermSchema = z.object({
  originalId: z.number(),
  name: z.string(),
  slug: z.string(),
  parentOriginalId: z.number().optional(),
});

export const tagTermSchema = z.object({
  originalId: z.number(),
  name: z.string(),
  slug: z.string(),
});

export type CategoryTerm = z.infer<typeof categoryTermSchema>;
export type TagTerm = z.infer<typeof tagTermSchema>;
