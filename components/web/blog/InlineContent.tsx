import { renderInlineNode } from "@/lib/content";
import { InlineNode } from "@/lib/schemas/blocks";

type InlineContentProps = {
  nodes: InlineNode[];
};

export function InlineContent({
  nodes,
}: InlineContentProps): React.ReactNode[] {
  const seen = new Set<string>();
  return nodes.map((node) => renderInlineNode(node, seen));
}
