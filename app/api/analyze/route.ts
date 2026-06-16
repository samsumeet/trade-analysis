import { NextRequest, NextResponse } from "next/server";

import { getAnalysisTicker } from "@/data/mock-analysis";
import { DEFAULT_TRADER_STYLE, normalizeTraderStyle } from "@/lib/trader-style";
import { fetchLiveAnalysis, fetchSavedAnalysis } from "@/lib/live-analysis";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

export async function GET(request: NextRequest) {
  const ticker = getAnalysisTicker(request.nextUrl.searchParams.get("ticker") ?? undefined);
  const mode = request.nextUrl.searchParams.get("mode");
  const traderStyle =
    normalizeTraderStyle(request.nextUrl.searchParams.get("traderStyle")) ?? DEFAULT_TRADER_STYLE;
  const sharedOptions = {
    sessionToken: request.headers.get("x-trade-session") ?? undefined,
    guestId: request.headers.get("x-trade-guest-id") ?? undefined
  };
  const result =
    mode === "history"
      ? await fetchSavedAnalysis(ticker, traderStyle, sharedOptions)
      : await fetchLiveAnalysis(ticker, traderStyle, sharedOptions);

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => ({}))) as {
    ticker?: string;
    traderStyle?: string;
  };
  const ticker = getAnalysisTicker(body.ticker);
  const traderStyle = normalizeTraderStyle(body.traderStyle) ?? DEFAULT_TRADER_STYLE;
  const result = await fetchLiveAnalysis(ticker, traderStyle, {
    sessionToken: request.headers.get("x-trade-session") ?? undefined,
    guestId: request.headers.get("x-trade-guest-id") ?? undefined
  });

  return NextResponse.json(result);
}
