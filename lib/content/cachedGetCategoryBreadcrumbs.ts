import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { api } from "@/convex/_generated/api";
import type { CategoryBreadcrumb } from "@/convex/categories";

export const cachedGetCategoryBreadcrumbs = cache(
  async (pathKey: string): Promise<CategoryBreadcrumb[]> => {
    return await fetchQuery(api.categories.getCategoryBreadcrumbs, {
      pathKey,
    });
  },
);
