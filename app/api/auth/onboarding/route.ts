import { NextRequest, NextResponse } from "next/server";

import { fetchMutation } from "convex/nextjs";

import { getAuthToken } from "@/lib/auth";
import { api } from "@/convex/_generated/api";

type RequestBody = {
  email?: string;
};

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
    const requestBody = (await request.json()) as RequestBody;

    const { email = null } = requestBody;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await fetchMutation(api.users.store, { email }, { token });

    return NextResponse.json(
      { message: "User stored successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Request failed with error: ${JSON.stringify(error)}` },
      { status: 500 },
    );
  }
}
