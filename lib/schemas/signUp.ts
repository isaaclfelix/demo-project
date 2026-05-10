import z from "zod";

export const signUpSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(100),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
