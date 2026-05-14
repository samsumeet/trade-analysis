import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const DASHBOARD_API_URL = `${getBackendApiBaseUrl()}/api/dashboard`;

export async function GET(request: NextRequest) {
  const response = await fetch(DASHBOARD_API_URL, {
    method: "GET",
    headers: {
      ...(request.headers.get("x-trade-session")
        ? { "x-trade-session": request.headers.get("x-trade-session") as string }
        : {})
    },
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse dashboard response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
