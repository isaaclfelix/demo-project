import { HeadingBlock, SpacingSides } from "@/lib/schemas/blocks";

import { InlineContent } from "./InlineContent";

type HeadingProps = {
  block: HeadingBlock;
};

export function Heading({ block }: HeadingProps) {
  const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag>
      <InlineContent nodes={block.content} />
    </Tag>
  );

  /*
  return (
    <Tag className={buildClassName(block)} style={buildStyle(block)}>
      <InlineContent nodes={block.content} />
    </Tag>
  );
  */
}

/*
function buildClassName(b: HeadingBlock): string {
  const cls = ["wp-block-heading"];
  if (b.align) cls.push(`align${b.align}`);
  if (b.textAlign) cls.push(`has-text-align-${b.textAlign}`);
  if (b.colors.text?.token) cls.push(`has-${b.colors.text.token}-color`);
  if (b.colors.background?.token)
    cls.push(`has-${b.colors.background.token}-background-color`);
  if (b.colors.text) cls.push("has-text-color");
  if (b.colors.background) cls.push("has-background");
  if (b.colors.link) cls.push("has-link-color");
  if (b.typography.fontSize?.token)
    cls.push(`has-${b.typography.fontSize.token}-font-size`);
  return cls.join(" ");
}

function buildStyle(b: HeadingBlock): React.CSSProperties {
  const s: React.CSSProperties = {};
  const t = b.typography;

  // Custom (token-less) font size emits an inline style; preset font sizes are class-based.
  if (t.fontSize?.resolved && !t.fontSize.token)
    s.fontSize = t.fontSize.resolved;
  if (t.fontStyle) s.fontStyle = t.fontStyle;
  if (t.fontWeight) s.fontWeight = t.fontWeight;
  if (t.lineHeight) s.lineHeight = t.lineHeight;
  if (t.letterSpacing) s.letterSpacing = t.letterSpacing;
  if (t.textDecoration) s.textDecoration = t.textDecoration;
  if (t.textTransform) s.textTransform = t.textTransform;
  if (t.writingMode) (s as any).writingMode = t.writingMode;

  applySpacing(s, "padding", b.spacing.padding);
  applySpacing(s, "margin", b.spacing.margin);

  return s;
}

function applySpacing(
  s: React.CSSProperties,
  prop: "padding" | "margin",
  sides: SpacingSides | null,
) {
  if (!sides) return;
  for (const side of ["top", "right", "bottom", "left"] as const) {
    const v = sides[side];
    if (!v) continue;
    // Prefer resolved CSS; fall back to a CSS var() for the preset slug.
    const css =
      v.resolved ?? (v.token ? `var(--wp--preset--spacing--${v.token})` : null);
    if (css)
      (s as any)[`${prop}${side[0].toUpperCase()}${side.slice(1)}`] = css;
  }
}
*/
