import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const WATCHLIST_API_URL = `${getBackendApiBaseUrl()}/api/watchlist`;

async function forwardRequest(request: NextRequest, method: "GET" | "POST" | "DELETE") {
  const body = method === "GET" ? undefined : await request.json().catch(() => ({}));

  const response = await fetch(WATCHLIST_API_URL, {
    method,
    headers: {
      ...(method !== "GET" ? { "Content-Type": "application/json" } : {}),
      ...(request.headers.get("x-trade-session")
        ? { "x-trade-session": request.headers.get("x-trade-session") as string }
        : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse watchlist response."
  }));

  return NextResponse.json(payload, { status: response.status });
}

export async function GET(request: NextRequest) {
  return forwardRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return forwardRequest(request, "POST");
}

export async function DELETE(request: NextRequest) {
  return forwardRequest(request, "DELETE");
}
