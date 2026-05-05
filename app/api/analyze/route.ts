import { NextRequest, NextResponse } from "next/server";

import { getAnalysisTicker } from "@/data/mock-analysis";
import { fetchLiveAnalysis } from "@/lib/live-analysis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const ticker = getAnalysisTicker(request.nextUrl.searchParams.get("ticker") ?? undefined);
  const result = await fetchLiveAnalysis(ticker);

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as { ticker?: string };
  const ticker = getAnalysisTicker(body.ticker);
  const result = await fetchLiveAnalysis(ticker);

  return NextResponse.json(result);
}
