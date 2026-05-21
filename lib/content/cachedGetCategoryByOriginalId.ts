import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

export const cachedGetCategoryByOriginalId = cache(
  async (originalId: number): Promise<Doc<"categories"> | null> => {
    return await fetchQuery(api.categories.getCategoryByOriginalId, {
      originalId,
    });
  },
);
