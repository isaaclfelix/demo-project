import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";

export const cachedGetCategoryByPathKey = cache(
  async (pathKey: string): Promise<Doc<"categories"> | null> => {
    return await fetchQuery(api.categories.getCategoryByPathKey, {
      pathKey,
    });
  },
);
