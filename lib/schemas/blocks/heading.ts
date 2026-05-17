import z from "zod";

export const headingBlockSchema = z.strictObject({
  blockName: z.literal("core/heading"),
  level: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
  content: z.string(),
});

export type HeadingBlockSchema = z.infer<typeof headingBlockSchema>;
