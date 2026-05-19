import { Fragment } from "react";

import { Anchor } from "@/components/web/blog/Anchor";
import { InlineNode } from "@/lib/schemas/blocks";

import { generateInlineNodeKey } from "./generateInlineNodeKey";

export function renderInlineNode(
  node: InlineNode,
  seen: Set<string>,
): React.ReactNode {
  const key = generateInlineNodeKey(node, seen);

  if (node.type === "text") {
    return <Fragment key={key}>{node.text}</Fragment>;
  }

  const children = node.children.map((child) => renderInlineNode(child, seen));

  switch (node.type) {
    case "strong":
      return <strong key={key}>{children}</strong>;
    case "em":
      return <em key={key}>{children}</em>;
    case "link":
      return (
        <Anchor
          key={key}
          href={node.attrs.href}
          target={node.attrs.target}
          rel={node.attrs.rel}
        >
          {children}
        </Anchor>
      );
    case "mark":
      return <mark key={key}>{children}</mark>;
  }
}
