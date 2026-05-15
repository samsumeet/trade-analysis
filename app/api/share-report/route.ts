import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

const SHARE_REPORT_API_URL = `${getBackendApiBaseUrl()}/api/share-reports`;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const response = await fetch(SHARE_REPORT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const payload = await response.json().catch(() => ({
    error: "Unable to parse shared report response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
