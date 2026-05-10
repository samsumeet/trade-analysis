import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const PROFILE_API_URL = `${getBackendApiBaseUrl()}/api/profile`;

export async function GET(request: NextRequest) {
  const response = await fetch(PROFILE_API_URL, {
    method: "GET",
    headers: {
      ...(request.headers.get("x-trade-session")
        ? { "x-trade-session": request.headers.get("x-trade-session") as string }
        : {})
    },
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse profile response."
  }));

  return NextResponse.json(payload, { status: response.status });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  const response = await fetch(PROFILE_API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(request.headers.get("x-trade-session")
        ? { "x-trade-session": request.headers.get("x-trade-session") as string }
        : {})
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse profile response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
