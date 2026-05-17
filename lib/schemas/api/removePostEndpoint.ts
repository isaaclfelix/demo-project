import z from "zod";

export const removePostEndpointSchema = z.strictObject({
  _id: z.string(),
});

export type RemovePostEndpointSchema = z.infer<typeof removePostEndpointSchema>;
