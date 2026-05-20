import z from "zod";

import { categoryTermSchema } from "./taxonomy";

export const createCategoryEndpointSchema = categoryTermSchema;

export const updateCategoryEndpointSchema = categoryTermSchema;

export const removeCategoryEndpointSchema = z.strictObject({
  originalId: z.number(),
});

export type CreateCategoryEndpointSchema = z.infer<
  typeof createCategoryEndpointSchema
>;
export type UpdateCategoryEndpointSchema = z.infer<
  typeof updateCategoryEndpointSchema
>;
export type RemoveCategoryEndpointSchema = z.infer<
  typeof removeCategoryEndpointSchema
>;
