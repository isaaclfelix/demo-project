import { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { postCanonicalPath } from "../../lib/content/postPath";
import { PostContent, postContentSchema } from "../../lib/schemas/blocks";

export type PostWithParsedContent = Omit<Doc<"posts">, "content"> & {
  content: PostContent;
  canonicalPath: string | null;
};

export function parsePostContentDoc(
  post: Doc<"posts">,
  canonicalPath: string | null,
): PostWithParsedContent | null {
  let parsedJson: PostContent = [];

  try {
    parsedJson = JSON.parse(post.content);
  } catch (error) {
    console.error(error);
    return null;
  }

  const parsedContent = postContentSchema.safeParse(parsedJson);
  if (!parsedContent.success) {
    console.error(
      `Invalid post content from Convex. Skipping post ${post._id}.`,
      parsedContent.error.issues,
    );
    return null;
  }

  return {
    ...post,
    content: parsedContent.data,
    canonicalPath,
  };
}

export async function canonicalPathForPostDoc(
  ctx: QueryCtx,
  post: Doc<"posts">,
): Promise<string | null> {
  if (post.permalinkCategoryOriginalId === undefined) {
    return null;
  }
  const cat = await ctx.db
    .query("categories")
    .withIndex("by_original_id", (q) =>
      q.eq("originalId", post.permalinkCategoryOriginalId!),
    )
    .unique();
  if (!cat) {
    return null;
  }
  return postCanonicalPath({ slug: post.slug, pathKey: cat.pathKey });
}
