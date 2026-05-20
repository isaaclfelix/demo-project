import z from "zod";

import { tagTermSchema } from "./taxonomy";

export const createTagEndpointSchema = tagTermSchema;

export const updateTagEndpointSchema = tagTermSchema;

export const removeTagEndpointSchema = z.strictObject({
  originalId: z.number(),
});

export type CreateTagEndpointSchema = z.infer<typeof createTagEndpointSchema>;
export type UpdateTagEndpointSchema = z.infer<typeof updateTagEndpointSchema>;
export type RemoveTagEndpointSchema = z.infer<typeof removeTagEndpointSchema>;
