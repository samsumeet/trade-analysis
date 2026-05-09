"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  ShieldCheck,
  Star,
  Target
} from "lucide-react";

import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { DashboardLoader } from "@/components/dashboard-loader";
import { DashboardStatus } from "@/components/dashboard-status";
import { Footer } from "@/components/footer";
import { SampleReport } from "@/components/sample-report";
import { SiteHeader } from "@/components/site-header";
import { TickerSearch } from "@/components/ticker-search";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { StockAnalysisData } from "@/types/stock";

interface DashboardPageProps {
  initialTicker: string;
}

interface AnalysisApiResponse {
  analysis: StockAnalysisData | null;
  error?: string;
  isLive: boolean;
}

const FAVORITES_STORAGE_KEY = "trade-analysis:favorites";
const MAX_FAVORITES = 5;

const dashboardCards = [
  {
    icon: BrainCircuit,
    label: "AI posture",
    getValue: (analysis: StockAnalysisData) => analysis.trendBias
  },
  {
    icon: ShieldCheck,
    label: "Confidence",
    getValue: (analysis: StockAnalysisData) => `${analysis.confidenceScore}/100`
  },
  {
    icon: Target,
    label: "Ideal entry",
    getValue: (analysis: StockAnalysisData) => analysis.tradePlan[0]?.range ?? "N/A"
  },
  {
    icon: BriefcaseBusiness,
    label: "Current price",
    getValue: (analysis: StockAnalysisData) => formatCurrency(analysis.currentPrice)
  }
];

export function DashboardPage({ initialTicker }: DashboardPageProps) {
  const [activeTicker, setActiveTicker] = useState(initialTicker);
  const [analysis, setAnalysis] = useState<StockAnalysisData | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const requestIdRef = useRef(0);

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!cached) {
        return;
      }

      const parsed = JSON.parse(cached) as unknown;
      if (!Array.isArray(parsed)) {
        return;
      }

      const validFavorites = parsed
        .map((item) => (typeof item === "string" ? item.toUpperCase() : null))
        .filter((item): item is string => Boolean(item))
        .slice(0, MAX_FAVORITES);

      setFavorites(validFavorites);
    } catch {
      setFavorites([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setActiveTicker(initialTicker);
  }, [initialTicker]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    async function loadAnalysis() {
      setIsLoading(true);
      setError(undefined);

      try {
        const response = await fetch(`/api/analyze?ticker=${activeTicker}`, {
          cache: "no-store",
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`Request failed with ${response.status}`);
        }

        const payload = (await response.json()) as AnalysisApiResponse;

        if (requestId !== requestIdRef.current) {
          return;
        }

        setAnalysis(payload.analysis);
        setError(payload.error);
        setIsLive(payload.isLive);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        if (requestId !== requestIdRef.current) {
          return;
        }

        setAnalysis(null);
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load analysis");
        setIsLive(false);
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    }

    void loadAnalysis();

    return () => controller.abort();
  }, [activeTicker, reloadKey]);

  const selectTicker = (ticker: string) => {
    if (ticker === activeTicker) {
      return;
    }

    setActiveTicker(ticker);
    setAnalysis(null);
    setIsLoading(true);
    window.history.replaceState(null, "", `/dashboard?ticker=${ticker}`);
  };

  const refreshTicker = (ticker: string) => {
    if (ticker === activeTicker) {
      setIsLoading(true);
      setAnalysis(null);
      setError(undefined);
      setIsLive(false);
      setReloadKey((current) => current + 1);
      window.history.replaceState(null, "", `/dashboard?ticker=${ticker}`);
      return;
    }

    selectTicker(ticker);
  };

  const isFavorite = favorites.includes(activeTicker);
  const canAddFavorite = isFavorite || favorites.length < MAX_FAVORITES;

  const toggleFavorite = () => {
    setFavorites((current) => {
      if (current.includes(activeTicker)) {
        return current.filter((ticker) => ticker !== activeTicker);
      }

      if (current.length >= MAX_FAVORITES) {
        return current;
      }

      return [activeTicker, ...current].slice(0, MAX_FAVORITES);
    });
  };

  return (
    <main className="pb-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_left,rgba(16,185,129,0.12),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.86),rgba(248,250,252,1))] dark:bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.22),transparent_28%),radial-gradient(circle_at_left,rgba(16,185,129,0.14),transparent_24%),linear-gradient(to_bottom,rgba(2,6,23,0.92),rgba(2,8,23,1))]" />
        <SiteHeader
          navItems={[
            { href: "/", label: "Home" },
            { href: "#dashboard", label: "Dashboard" },
            { href: "#report", label: "Report" }
          ]}
          ctaHref="/"
          ctaLabel="Back Home"
        />

        <section className="container pb-8 pt-6 sm:pb-12">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div>
              <Badge variant="info" className="w-fit">
                Full analysis dashboard
              </Badge>
              <div className="mt-4">
                <DashboardStatus error={error} isLive={isLive} />
              </div>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight text-slate-950 dark:text-slate-50 sm:text-5xl">
                Dedicated analysis workspace for {activeTicker}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                The landing-page preview now expands into a full dashboard with the
                same visual system, a routed analysis flow, and a deeper workspace
                for signals, trade planning, and report review.
              </p>

              <div className="mt-8">
                <TickerSearch
                  activeTicker={activeTicker}
                  setActiveTicker={setActiveTicker}
                  onAnalyze={refreshTicker}
                  onTickerSelect={selectTicker}
                  sampleReportTargetId="analysis-brief"
                  quickTickers={favorites}
                  quickTickersLabel="Favorites"
                  analysisLoading={isLoading}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button
                  type="button"
                  variant={isFavorite ? "default" : "secondary"}
                  size="sm"
                  onClick={toggleFavorite}
                  disabled={!canAddFavorite}
                  className="gap-2"
                >
                  <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved to favorites" : "Add to favorites"}
                </Button>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Save up to {MAX_FAVORITES} favorite stocks in your browser.
                </p>
              </div>

              <div className="mt-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Favorite stocks
                </p>
                <div className="flex flex-wrap gap-2">
                  {favorites.length > 0 ? (
                    favorites.map((ticker) => {
                      const active = ticker === activeTicker;

                      return (
                        <button
                          key={ticker}
                          type="button"
                          onClick={() => selectTicker(ticker)}
                          className={`rounded-full px-3 py-1.5 text-sm transition ${
                            active
                              ? "bg-slate-900 text-white dark:bg-blue-500"
                              : "bg-white/80 text-slate-600 hover:bg-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                          }`}
                        >
                          {ticker}
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-full bg-white/80 px-3 py-1.5 text-sm text-slate-500 dark:bg-slate-900 dark:text-slate-400">
                      No favorites saved yet
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {analysis ? (
                  <>
                    <Badge variant={analysis.dailyChangePct >= 0 ? "bullish" : "bearish"}>
                      {analysis.dailyChangePct >= 0 ? "+" : ""}
                      {analysis.dailyChangePct.toFixed(2)}% today
                    </Badge>
                    <Badge variant="default" className="bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                      {analysis.companyName}
                    </Badge>
                  </>
                ) : (
                  <Badge variant="default" className="bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Waiting for live server response
                  </Badge>
                )}
              </div>
            </div>

            <Card className="glass-panel rounded-[32px] border-white/70 shadow-soft dark:border-slate-800">
              <CardContent className="p-5 sm:p-6">
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-5 text-white">
                  {analysis ? (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm uppercase tracking-[0.16em] text-blue-300">
                            Live workspace
                          </p>
                          <h2 className="mt-3 text-3xl font-semibold">{analysis.symbol}</h2>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {analysis.aiSummary}
                          </p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                          Confidence {analysis.confidenceScore}/100
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        {dashboardCards.map(({ icon: Icon, label, getValue }) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4"
                          >
                            <div className="flex items-center gap-3">
                              <div className="rounded-2xl bg-white/10 p-2">
                                <Icon className="h-4 w-4 text-blue-300" />
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">
                                  {label}
                                </p>
                                <p className="mt-1 text-sm font-medium text-white">
                                  {getValue(analysis)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="flex items-start gap-3">
                          <ArrowUpRight className="mt-0.5 h-4 w-4 text-emerald-300" />
                          <p className="text-sm leading-7 text-slate-200">
                            Execution focus: {analysis.tradePlan[0]?.note}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-5">
                      <div>
                        <p className="text-sm uppercase tracking-[0.16em] text-blue-300">
                          Live workspace
                        </p>
                        <h2 className="mt-3 text-3xl font-semibold">{activeTicker}</h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                          No live analysis is available right now. Retry the request and the
                          dashboard will populate as soon as the server responds.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {["Price structure", "Risk levels", "Momentum", "Trade thesis"].map((item) => (
                          <div
                            key={item}
                            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300"
                          >
                            {item} will appear when live data arrives.
                          </div>
                        ))}
                      </div>
                      <Button
                        type="button"
                        onClick={() => refreshTicker(activeTicker)}
                        className="w-fit"
                      >
                        Retry Live Analysis
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <section id="dashboard" className="container mt-8 scroll-mt-10">
        {isLoading ? (
          <DashboardLoader ticker={activeTicker} />
        ) : analysis ? (
          <AnalysisDashboard analysis={analysis} mode="full" />
        ) : (
          <Card className="overflow-hidden rounded-[32px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Live data required
                </p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                  We couldn&apos;t load live analysis for {activeTicker}
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  The dashboard only displays real analysis from the server. Try the
                  request again once the backend is available.
                </p>
                <div className="mt-8 flex justify-center">
                  <Button type="button" onClick={() => refreshTicker(activeTicker)}>
                    Retry Live Analysis
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {analysis ? (
      <section id="report" className="container mt-24 scroll-mt-10">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          {isLoading ? (
            <Card className="overflow-hidden rounded-[28px] border-slate-200/70 dark:border-slate-800">
              <CardContent className="space-y-5 p-6">
                <div className="h-5 w-40 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                <div className="h-10 w-3/4 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/60"
                    >
                      <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                      <div className="h-20 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <SampleReport analysis={analysis} />
          )}
          <div className="space-y-6">
            <Card className="rounded-[28px] border-slate-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-900/85">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Execution checklist
                </p>
                <div className="mt-5 space-y-4">
                  {isLoading
                    ? Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="h-4 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                          </div>
                          <div className="mt-3 h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
                        </div>
                      ))
                    : analysis.keyLevels.slice(0, 4).map((level) => (
                        <div
                          key={level.label}
                          className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{level.label}</p>
                            <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{level.value}</p>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{level.context}</p>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200/70 bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#0f766e)] text-white">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-200">
                  AI trade brief
                </p>
                {isLoading ? (
                  <>
                    <div className="mt-3 h-8 w-40 animate-pulse rounded-full bg-white/15" />
                    <div className="mt-4 h-24 animate-pulse rounded-3xl bg-white/10" />
                  </>
                ) : (
                  <>
                    <h3 className="mt-3 text-2xl font-semibold">{analysis.trendBias}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-100">
                      {analysis.executiveSummary}
                    </p>
                  </>
                )}
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                      Momentum read
                    </p>
                    {isLoading ? (
                      <div className="mt-2 h-20 animate-pulse rounded-2xl bg-white/10" />
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-white">
                        {analysis.momentumRead}
                      </p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                      Risk note
                    </p>
                    {isLoading ? (
                      <div className="mt-2 h-20 animate-pulse rounded-2xl bg-white/10" />
                    ) : (
                      <p className="mt-2 text-sm leading-6 text-white">
                        {analysis.riskNotes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200/70 bg-white/90 dark:border-slate-800 dark:bg-slate-900/85">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Indicator stack
                </p>
                <div className="mt-5 space-y-3">
                  {isLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="h-4 w-28 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                          </div>
                          <div className="mt-3 h-12 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900" />
                        </div>
                      ))
                    : analysis.indicators.map((indicator) => (
                        <div
                          key={indicator.name}
                          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{indicator.name}</p>
                            <Badge variant="default" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                              {indicator.value}
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {indicator.description}
                          </p>
                        </div>
                      ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      ) : null}

      <div className="container mt-20">
        <Footer />
      </div>
    </main>
  );
}
