import z from "zod";

export const verifySchema = z.object({
  code: z.string(),
});

export type VerifySchema = z.infer<typeof verifySchema>;
