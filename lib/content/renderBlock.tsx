import { Heading } from "@/components/web/blog/HeadingBlock";
import type { Block } from "@/lib/schemas/blocks";

import { generateBlockKey } from "./generateBlockKey";

export function renderBlock(block: Block, seen: Set<string>): React.ReactNode {
  const key = generateBlockKey(block, seen);

  switch (block.blockName) {
    case "core/heading":
      return <Heading key={key} block={block} />;
  }
}
