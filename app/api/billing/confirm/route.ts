import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const BILLING_CONFIRM_URL = `${getBackendApiBaseUrl()}/api/billing/confirm`;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const response = await fetch(BILLING_CONFIRM_URL, {
    method: "POST",
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
    error: "Unable to parse billing confirmation response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
