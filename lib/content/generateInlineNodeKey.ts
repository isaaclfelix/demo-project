import type { InlineNode } from "@/lib/schemas/blocks";

export function generateInlineNodeKey(
  node: InlineNode,
  seen: Set<string>,
): string {
  const base = `node:${node.type}`;

  if (!seen.has(base)) {
    seen.add(base);
    return base;
  }

  let count = 1;
  while (true) {
    const key = `${base}:dupe:${count}`;
    if (!seen.has(key)) {
      seen.add(key);
      return key;
    }
    count++;
  }
}
