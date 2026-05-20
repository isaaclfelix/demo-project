import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { PostWithParsedContentAndCanonicalPath } from "@/convex/posts";

export const cachedGetPostByCategoryPathAndSlug = cache(
  async (
    pathKey: string,
    slug: string,
  ): Promise<PostWithParsedContentAndCanonicalPath | null> => {
    return await fetchQuery(api.posts.getPostByCategoryPathAndSlug, {
      pathKey,
      slug,
    });
  },
);
