import { Doc } from "../_generated/dataModel";
import type { QueryCtx } from "../_generated/server";
import { postCanonicalPath } from "../../lib/content/postPath";

export async function canonicalPathForPostDoc(
  ctx: QueryCtx,
  post: Doc<"posts">,
): Promise<string | null> {
  const cat = await ctx.db
    .query("categories")
    .withIndex("by_original_id", (q) =>
      q.eq("originalId", post.permalinkCategoryOriginalId),
    )
    .unique();

  if (!cat) {
    return null;
  }

  return postCanonicalPath({ slug: post.slug, pathKey: cat.pathKey });
}
