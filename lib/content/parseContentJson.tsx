import React from "react";

import {
  headingBlockSchema,
  HeadingBlockSchema,
} from "../schemas/blocks/heading";

type HeadingBlockProps = {
  block: HeadingBlockSchema;
};

function HeadingBlock({ block }: HeadingBlockProps): React.ReactNode {
  const HeadingTag: keyof React.JSX.IntrinsicElements =
    block.level > 0 ? `h${block.level}` : "h2";

  return <HeadingTag>{block.content}</HeadingTag>;
}

export function parseContentJson(content: string): React.ReactNode[] {
  try {
    const parsedContent = JSON.parse(content);

    console.log(parsedContent);

    if (Array.isArray(parsedContent)) {
      return parsedContent.map((item, index) => {
        if (item.blockName === "core/heading") {
          const parsedHeadingBlock = headingBlockSchema.safeParse(item);

          if (parsedHeadingBlock.success) {
            return (
              <HeadingBlock
                key={`${item.blockName}-${index}`}
                block={parsedHeadingBlock.data}
              />
            );
          }
        }
      });
    }

    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
}
