import { cache } from "react";

import { fetchQuery } from "convex/nextjs";

import { getAuthToken } from "@/lib/auth";
import { api } from "@/convex/_generated/api";

export const getCurrentConvexUser = cache(async () => {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  return await fetchQuery(api.users.currentUser, {}, { token });
});
