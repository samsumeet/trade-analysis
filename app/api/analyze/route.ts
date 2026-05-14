import { NextRequest, NextResponse } from "next/server";

import { getAnalysisTicker } from "@/data/mock-analysis";
import { fetchLiveAnalysis } from "@/lib/live-analysis";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

export async function GET(request: NextRequest) {
  const ticker = getAnalysisTicker(request.nextUrl.searchParams.get("ticker") ?? undefined);
  const result = await fetchLiveAnalysis(ticker, {
    sessionToken: request.headers.get("x-trade-session") ?? undefined,
    guestId: request.headers.get("x-trade-guest-id") ?? undefined
  });

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { ticker?: string };
  const ticker = getAnalysisTicker(body.ticker);
  const result = await fetchLiveAnalysis(ticker, {
    sessionToken: request.headers.get("x-trade-session") ?? undefined,
    guestId: request.headers.get("x-trade-guest-id") ?? undefined
  });

  return NextResponse.json(result);
}
