import type { Block } from "@/lib/schemas/blocks";

export function generateBlockKey(block: Block, seen: Set<string>): string {
  const base = `block:${block.blockName}`;

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
