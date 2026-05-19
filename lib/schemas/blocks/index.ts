import { z } from "zod";

const presetSchema = z.object({
  token: z.string().nullable(),
  resolved: z.string().nullable(),
});

const spacingSidesSchema = z.object({
  top: presetSchema.nullable(),
  right: presetSchema.nullable(),
  bottom: presetSchema.nullable(),
  left: presetSchema.nullable(),
});

const textNodeSchema = z.object({
  type: z.literal("text"),
  text: z.string(),
});

const linkAttrsSchema = z.object({
  href: z.string(),
  target: z.string().optional(),
  rel: z.string().optional(),
});

const markAttrsSchema = z.object({
  style: z
    .object({
      backgroundColor: z.string().optional(),
      color: z.string().optional(),
    })
    .optional(),
  hasInlineColor: z.boolean(),
});

// Recursive: declare the TS type, then annotate the schema with z.ZodType<T>.
type InlineNode =
  | { type: "text"; text: string }
  | { type: "strong"; children: InlineNode[] }
  | { type: "em"; children: InlineNode[] }
  | {
      type: "link";
      attrs: z.infer<typeof linkAttrsSchema>;
      children: InlineNode[];
    }
  | {
      type: "mark";
      attrs: z.infer<typeof markAttrsSchema>;
      children: InlineNode[];
    };

const inlineNodeSchema: z.ZodType<InlineNode> = z.lazy(() =>
  z.discriminatedUnion("type", [
    textNodeSchema,
    z.object({
      type: z.literal("strong"),
      children: z.array(inlineNodeSchema),
    }),
    z.object({
      type: z.literal("em"),
      children: z.array(inlineNodeSchema),
    }),
    z.object({
      type: z.literal("link"),
      attrs: linkAttrsSchema,
      children: z.array(inlineNodeSchema),
    }),
    z.object({
      type: z.literal("mark"),
      attrs: markAttrsSchema,
      children: z.array(inlineNodeSchema),
    }),
  ]),
);

const colorsSchema = z.object({
  text: presetSchema.nullable(),
  background: presetSchema.nullable(),
  link: presetSchema.nullable(),
});

const typographySchema = z.object({
  fontSize: presetSchema.nullable(),
  fontStyle: z.string().nullable(),
  fontWeight: z.string().nullable(),
  lineHeight: z.string().nullable(),
  letterSpacing: z.string().nullable(),
  textDecoration: z.string().nullable(),
  textTransform: z.string().nullable(),
  writingMode: z.string().nullable(),
});

const spacingSchema = z.object({
  padding: spacingSidesSchema.nullable(),
  margin: spacingSidesSchema.nullable(),
});

/** Shared fields for blocks with rich inline content (heading, paragraph, …). */
export const richTextBlockFieldsSchema = z.object({
  textAlign: z.enum(["left", "center", "right"]).nullable(),
  colors: colorsSchema,
  typography: typographySchema,
  spacing: spacingSchema,
  content: z.array(inlineNodeSchema),
});

export const headingBlockSchema = richTextBlockFieldsSchema.extend({
  blockName: z.literal("core/heading"),
  level: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
  ]),
  align: z.enum(["wide", "full"]).nullable(),
});

export const paragraphBlockSchema = richTextBlockFieldsSchema.extend({
  blockName: z.literal("core/paragraph"),
  dropCap: z.boolean(),
});

export const blockSchema = z.discriminatedUnion("blockName", [
  headingBlockSchema,
  paragraphBlockSchema,
]);
export const postContentSchema = z.array(blockSchema);

// Single source of truth — replace the manual types above by deriving them.
export type Preset = z.infer<typeof presetSchema>;
export type SpacingSides = z.infer<typeof spacingSidesSchema>;
export type Colors = z.infer<typeof colorsSchema>;
export type Typography = z.infer<typeof typographySchema>;
export type Spacing = z.infer<typeof spacingSchema>;
export type RichTextBlockFields = z.infer<typeof richTextBlockFieldsSchema>;

export type HeadingBlock = z.infer<typeof headingBlockSchema>;
export type ParagraphBlock = z.infer<typeof paragraphBlockSchema>;

export type Block = z.infer<typeof blockSchema>;
export type PostContent = z.infer<typeof postContentSchema>;
export type { InlineNode };
