import { cache } from "react";

import { auth } from "@clerk/nextjs/server";

export const isAuthenticated = cache(async () => {
  const { isAuthenticated: isClerkAuthenticated } = await auth();

  return isClerkAuthenticated;
});
