import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const BILLING_CHECKOUT_URL = `${getBackendApiBaseUrl()}/api/billing/checkout`;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const response = await fetch(BILLING_CHECKOUT_URL, {
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
    error: "Unable to parse checkout response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
