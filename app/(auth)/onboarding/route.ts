import { NextRequest, NextResponse } from "next/server";

import { fetchMutation } from "convex/nextjs";

import { getAuthToken } from "@/lib/auth/getAuthToken";
import { api } from "@/convex/_generated/api";

export async function GET(request: NextRequest) {
  const redirectToHome = NextResponse.redirect(new URL("/", request.url));

  const token = await getAuthToken();

  if (!token) {
    return redirectToHome;
  }

  const searchParams = request.nextUrl.searchParams;

  const email = searchParams.get("email") ?? "";

  await fetchMutation(api.users.store, { email }, { token });

  return redirectToHome;
}
