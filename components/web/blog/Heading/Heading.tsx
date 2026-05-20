import { HeadingBlock } from "@/lib/schemas/blocks";

import { InlineContent } from "../InlineContent";
import { variants } from "./variants";

type HeadingProps = {
  block: HeadingBlock;
};

export function Heading({ block }: HeadingProps) {
  const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag
      className={variants({
        level: `level-${block.level}`,
        textAlign: block.textAlign,
        decoration: block.typography.textDecoration,
      })}
    >
      <InlineContent nodes={block.content} />
    </Tag>
  );
}
