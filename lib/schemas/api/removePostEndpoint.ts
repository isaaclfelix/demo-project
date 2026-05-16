import z from "zod";

export const removePostEndpoint = z.strictObject({
  _id: z.string(),
});

export type RemovePostEndpoint = z.infer<typeof removePostEndpoint>;
