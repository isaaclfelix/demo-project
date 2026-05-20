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
  textDecoration: z.enum(["underline", "line-through"]).nullable(),
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

/** Nested list inside a list item (no blockName or block-level styles). */
type NestedList = {
  ordered: boolean;
  reversed: boolean;
  start: number | null;
  type: string | null;
  items: ListItem[];
};

const nestedListSchema: z.ZodType<NestedList> = z.lazy(() =>
  z.object({
    ordered: z.boolean(),
    reversed: z.boolean(),
    start: z.number().nullable(),
    type: z.string().nullable(),
    items: z.array(listItemSchema),
  }),
);

type ListItem = {
  content: InlineNode[];
  nested: NestedList | null;
};

const listItemSchema: z.ZodType<ListItem> = z.lazy(() =>
  z.object({
    content: z.array(inlineNodeSchema),
    nested: nestedListSchema.nullable(),
  }),
);

export const listBlockSchema = z.object({
  blockName: z.literal("core/list"),
  ordered: z.boolean(),
  reversed: z.boolean(),
  start: z.number().nullable(),
  type: z.string().nullable(),
  colors: colorsSchema,
  typography: typographySchema,
  spacing: spacingSchema,
  items: z.array(listItemSchema),
});

export const blockSchema = z.discriminatedUnion("blockName", [
  headingBlockSchema,
  paragraphBlockSchema,
  listBlockSchema,
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
export type ListBlock = z.infer<typeof listBlockSchema>;

export type Block = z.infer<typeof blockSchema>;
export type PostContent = z.infer<typeof postContentSchema>;
export type { InlineNode, ListItem, NestedList };
