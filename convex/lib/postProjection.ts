import { Doc } from "../_generated/dataModel";
import type { PostContent } from "../../lib/schemas/blocks";

/**
 * A post document after server-side processing of the raw Convex `posts` row.
 *
 * This is not the stored schema (`Doc<"posts">`) and not a WordPress post type.
 * Public post queries build a projection by:
 * 1. Parsing `content` from JSON into validated block content
 * 2. Resolving `canonicalPath` from slug + permalink category
 *
 * Use {@link PostProjection} for query results; use {@link PostSchemaParsed}
 * only as the intermediate shape after step 1.
 */

/** Post row after content schema parsing; canonical path not attached yet. */
export type PostSchemaParsed = Omit<Doc<"posts">, "content"> & {
  content: PostContent;
};

/** Post row after full projection pipeline (parsed content + canonical path). */
export type PostProjection = PostSchemaParsed & {
  canonicalPath: string;
};
