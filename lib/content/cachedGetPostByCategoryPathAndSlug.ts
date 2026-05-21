import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { PostProjection } from "@/convex/posts";

export const cachedGetPostByCategoryPathAndSlug = cache(
  async (pathKey: string, slug: string): Promise<PostProjection | null> => {
    return await fetchQuery(api.posts.getPostByCategoryPathAndSlug, {
      pathKey,
      slug,
    });
  },
);
