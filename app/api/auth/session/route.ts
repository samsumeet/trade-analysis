import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const AUTH_SESSION_URL = `${getBackendApiBaseUrl()}/api/auth/session`;

export async function GET(request: NextRequest) {
  const response = await fetch(AUTH_SESSION_URL, {
    method: "GET",
    headers: {
      ...(request.headers.get("x-trade-session")
        ? { "x-trade-session": request.headers.get("x-trade-session") as string }
        : {})
    },
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse session response."
  }));

  return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(request: NextRequest) {
  const response = await fetch(AUTH_SESSION_URL, {
    method: "DELETE",
    headers: {
      ...(request.headers.get("x-trade-session")
        ? { "x-trade-session": request.headers.get("x-trade-session") as string }
        : {})
    },
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse logout response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
