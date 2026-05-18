import { renderBlock } from "@/lib/content/renderBlock";
import type { Block, PostContent } from "@/lib/schemas/blocks";

type PostContentProps = {
  postContent: PostContent;
};

export function PostContent({
  postContent,
}: PostContentProps): React.ReactNode[] {
  const seen = new Set<string>();
  return postContent.map((block: Block) => renderBlock(block, seen));
}
