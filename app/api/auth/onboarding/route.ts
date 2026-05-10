import { NextRequest, NextResponse } from "next/server";

import { fetchMutation } from "convex/nextjs";

import { getAuthToken } from "@/lib/auth";
import { api } from "@/convex/_generated/api";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");

  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const token = await getAuthToken();

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await fetchMutation(api.users.store, {}, { token });

    return NextResponse.json(
      { message: "User stored successfully" },
      { status: 200 },
    );
  } catch (error) {
    // For now just send the error to the console.
    console.error("Failed to store user in Convex", error);

    return NextResponse.json(
      { error: `Request failed with error: ${JSON.stringify(error)}` },
      { status: 500 },
    );
  }
}
