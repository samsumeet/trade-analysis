import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const AUTH_REGISTER_URL = `${getBackendApiBaseUrl()}/api/auth/register`;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const response = await fetch(AUTH_REGISTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse authentication response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
