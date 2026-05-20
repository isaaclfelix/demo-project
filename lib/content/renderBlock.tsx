import { Heading } from "@/components/web/blog/Heading";
import { List } from "@/components/web/blog/List";
import { Paragraph } from "@/components/web/blog/Paragraph";
import type { Block } from "@/lib/schemas/blocks";

import { generateBlockKey } from "./generateBlockKey";

export function renderBlock(block: Block, seen: Set<string>): React.ReactNode {
  const key = generateBlockKey(block, seen);

  switch (block.blockName) {
    case "core/heading":
      return <Heading key={key} block={block} />;
    case "core/paragraph":
      return <Paragraph key={key} block={block} />;
    case "core/list":
      return <List key={key} block={block} />;
  }
}
