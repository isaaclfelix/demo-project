"use client";

import { ParagraphBlock } from "@/lib/schemas/blocks";

import { InlineContent } from "../InlineContent";
import { variants } from "./variants";

type HeadingProps = {
  block: ParagraphBlock;
};

export function Paragraph({ block }: HeadingProps) {
  return (
    <p
      className={variants({
        textAlign: block.textAlign,
        decoration: block.typography.textDecoration,
      })}
    >
      <InlineContent nodes={block.content} />
    </p>
  );
}
