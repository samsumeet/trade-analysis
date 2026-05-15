import { NextRequest, NextResponse } from "next/server";

import { getBackendApiBaseUrl } from "@/lib/backend-api";

export async function GET(
  _request: NextRequest,
  context: { params: { shareId: string } }
) {
  const response = await fetch(
    `${getBackendApiBaseUrl()}/api/share-reports/${encodeURIComponent(context.params.shareId)}`,
    {
      method: "GET",
      cache: "no-store"
    }
  );

  const payload = await response.json().catch(() => ({
    error: "Unable to parse shared report response."
  }));

  return NextResponse.json(payload, { status: response.status });
}
