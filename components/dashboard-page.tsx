"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookmarkPlus,
  BrainCircuit,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  Clock3,
  Infinity as InfinityIcon,
  Newspaper,
  Trash2,
  ShieldCheck,
  Star,
  Target
} from "lucide-react";

import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { AuthModal } from "@/components/auth-modal";
import { useAuth } from "@/components/auth-provider";
import { DashboardLoader } from "@/components/dashboard-loader";
import { DashboardStatus } from "@/components/dashboard-status";
import { Footer } from "@/components/footer";
import { SampleReport } from "@/components/sample-report";
import { SiteHeader } from "@/components/site-header";
import { TickerSearch } from "@/components/ticker-search";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  AnalysisAllowance,
  AnalysisHistoryItem,
  DashboardSummary,
  GuestUsage,
  WatchlistItem
} from "@/types/auth";
import { StockAnalysisData } from "@/types/stock";

interface DashboardPageProps {
  initialTicker: string;
}

interface AnalysisApiResponse {
  analysis: StockAnalysisData | null;
  error?: string;
  isLive: boolean;
  authRequired?: boolean;
  paywallRequired?: boolean;
  code?: string;
  guestUsage?: GuestUsage;
  allowance?: AnalysisAllowance;
}

interface DashboardApiResponse extends Partial<DashboardSummary> {
  error?: string;
}

interface WatchlistApiResponse {
  watchlist?: WatchlistItem[];
  limit?: number;
  error?: string;
}

interface NewsItem {
  title: string;
  link: string;
  publishedAt: string | null;
  source: string | null;
}

interface NewsApiResponse {
  items?: NewsItem[];
  error?: string;
}

const GUEST_WATCHLIST_STORAGE_KEY = "trade-analysis:guest-watchlist";
const GUEST_HISTORY_STORAGE_KEY = "trade-analysis:guest-history";
const DEFAULT_WATCHLIST_LIMIT = 5;
const DEFAULT_HISTORY_LIMIT = 8;

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

function parseTickerList(value: string | null, limit: number) {
  if (!value) {
    return [] as string[];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => (typeof item === "string" ? item.toUpperCase() : null))
      .filter((item): item is string => Boolean(item))
      .slice(0, limit);
  } catch {
    return [];
  }
}

function parseGuestHistory(value: string | null, limit: number) {
  if (!value) {
    return [] as AnalysisHistoryItem[];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((item): item is AnalysisHistoryItem => {
        if (!item || typeof item !== "object") {
          return false;
        }

        const candidate = item as Partial<AnalysisHistoryItem>;
        return (
          typeof candidate.ticker === "string" &&
          typeof candidate.companyName === "string" &&
          typeof candidate.lastAnalyzedAt === "string" &&
          typeof candidate.firstAnalyzedAt === "string" &&
          typeof candidate.analysisCount === "number"
        );
      })
      .slice(0, limit);
  } catch {
    return [];
  }
}

function createHistoryItem(analysis: StockAnalysisData): AnalysisHistoryItem {
  const timestamp = new Date().toISOString();

  return {
    ticker: analysis.symbol,
    companyName: analysis.companyName || analysis.symbol,
    currentPrice: Number.isFinite(analysis.currentPrice) ? analysis.currentPrice : null,
    trendBias: analysis.trendBias,
    confidenceScore: Number.isFinite(analysis.confidenceScore) ? analysis.confidenceScore : null,
    analysisCount: 1,
    firstAnalyzedAt: timestamp,
    lastAnalyzedAt: timestamp
  };
}

function mergeHistoryItem(history: AnalysisHistoryItem[], item: AnalysisHistoryItem, limit: number) {
  const existing = history.find((entry) => entry.ticker === item.ticker);
  const nextItem: AnalysisHistoryItem = existing
    ? {
        ...existing,
        companyName: item.companyName,
        currentPrice: item.currentPrice,
        trendBias: item.trendBias,
        confidenceScore: item.confidenceScore,
        analysisCount: existing.analysisCount + 1,
        lastAnalyzedAt: item.lastAnalyzedAt
      }
    : item;

  return [nextItem, ...history.filter((entry) => entry.ticker !== item.ticker)].slice(0, limit);
}

export function DashboardPage({ initialTicker }: DashboardPageProps) {
  const {
    guestId,
    guestUsage,
    isAuthenticated,
    allowance,
    setAllowance,
    setGuestUsage,
    token,
    user
  } = useAuth();
  const [activeTicker, setActiveTicker] = useState(initialTicker);
  const [analysis, setAnalysis] = useState<StockAnalysisData | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
  const [watchlistLimit, setWatchlistLimit] = useState(DEFAULT_WATCHLIST_LIMIT);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [requiresUpgrade, setRequiresUpgrade] = useState(false);
  const [requestMode, setRequestMode] = useState<"live" | "history">("live");
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [newsError, setNewsError] = useState<string | undefined>(undefined);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setWatchlist(
      parseTickerList(
        window.localStorage.getItem(GUEST_WATCHLIST_STORAGE_KEY),
        DEFAULT_WATCHLIST_LIMIT
      ).map((ticker) => ({
        ticker,
        addedAt: new Date().toISOString()
      }))
    );
    setHistory(
      parseGuestHistory(
        window.localStorage.getItem(GUEST_HISTORY_STORAGE_KEY),
        DEFAULT_HISTORY_LIMIT
      )
    );
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    window.localStorage.setItem(
      GUEST_WATCHLIST_STORAGE_KEY,
      JSON.stringify(watchlist.map((item) => item.ticker))
    );
  }, [isAuthenticated, watchlist]);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }

    window.localStorage.setItem(
      GUEST_HISTORY_STORAGE_KEY,
      JSON.stringify(history.slice(0, DEFAULT_HISTORY_LIMIT))
    );
  }, [history, isAuthenticated]);

  useEffect(() => {
    setActiveTicker(initialTicker);
    setRequestMode("live");
  }, [initialTicker]);

  useEffect(() => {
    if (!token || !isAuthenticated) {
      setWatchlist(
        parseTickerList(
          window.localStorage.getItem(GUEST_WATCHLIST_STORAGE_KEY),
          DEFAULT_WATCHLIST_LIMIT
        ).map((ticker) => ({
          ticker,
          addedAt: new Date().toISOString()
        }))
      );
      setHistory(
        parseGuestHistory(
          window.localStorage.getItem(GUEST_HISTORY_STORAGE_KEY),
          DEFAULT_HISTORY_LIMIT
        )
      );
      setWatchlistLimit(DEFAULT_WATCHLIST_LIMIT);
      return;
    }

    let isCancelled = false;

    async function loadDashboardSummary() {
      const response = await fetch("/api/dashboard", {
        headers: token
          ? {
              "x-trade-session": token
            }
          : undefined,
        cache: "no-store"
      });

      const payload = (await response.json().catch(() => ({}))) as DashboardApiResponse;

      if (isCancelled || !response.ok) {
        return;
      }

      setWatchlist(payload.watchlist ?? []);
      setHistory(payload.history ?? []);
      setWatchlistLimit(payload.watchlistLimit ?? DEFAULT_WATCHLIST_LIMIT);

      if (payload.allowance) {
        setAllowance(payload.allowance);
      }
    }

    void loadDashboardSummary();

    return () => {
      isCancelled = true;
    };
  }, [isAuthenticated, setAllowance, token]);

  useEffect(() => {
    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    async function loadAnalysis() {
      if (!guestId) {
        return;
      }

      if (!activeTicker) {
        setAnalysis(null);
        setError(undefined);
        setIsLive(false);
        setRequiresAuth(false);
        setRequiresUpgrade(false);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(undefined);
      setRequiresAuth(false);
      setRequiresUpgrade(false);

      try {
        const sharedHeaders = {
          "x-trade-guest-id": guestId,
          ...(token ? { "x-trade-session": token } : {})
        };
        const response =
          requestMode === "history"
            ? await fetch(`/api/analyze?ticker=${encodeURIComponent(activeTicker)}&mode=history`, {
                method: "GET",
                headers: sharedHeaders,
                cache: "no-store",
                signal: controller.signal
              })
            : await fetch(`/api/analyze`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  ...sharedHeaders
                },
                body: JSON.stringify({ ticker: activeTicker }),
                cache: "no-store",
                signal: controller.signal
              });

        const payload = (await response.json()) as AnalysisApiResponse;

        if (requestId !== requestIdRef.current) {
          return;
        }

        if (payload.guestUsage) {
          setGuestUsage(payload.guestUsage);
        }

        if (payload.allowance) {
          setAllowance(payload.allowance);
        }

        if (!response.ok || payload.authRequired || payload.paywallRequired) {
          setAnalysis(null);
          setError(payload.error ?? `Request failed with ${response.status}`);
          setIsLive(false);
          setRequiresAuth(Boolean(payload.authRequired));
          setRequiresUpgrade(Boolean(payload.paywallRequired));

          if (payload.paywallRequired) {
            // Daily limit exhausted — always show upgrade prompt
            setIsUpgradeModalOpen(true);
          } else if (payload.authRequired) {
            if (isAuthenticated) {
              // User is already logged in but hit a limit — show upgrade, not login
              setRequiresUpgrade(true);
              setIsUpgradeModalOpen(true);
            } else {
              setIsAuthModalOpen(true);
            }
          }

          return;
        }

        setAnalysis(payload.analysis);
        setError(payload.error);
        setIsLive(payload.isLive);

        if (payload.analysis && requestMode === "live") {
          const nextHistoryItem = createHistoryItem(payload.analysis);
          setHistory((current) => mergeHistoryItem(current, nextHistoryItem, DEFAULT_HISTORY_LIMIT));
        }
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
  }, [activeTicker, guestId, reloadKey, requestMode, setAllowance, setGuestUsage, token]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNews() {
      if (!activeTicker) {
        setNewsItems([]);
        setNewsError(undefined);
        setIsNewsLoading(false);
        return;
      }

      setIsNewsLoading(true);
      setNewsError(undefined);

      try {
        const response = await fetch(`/api/news?ticker=${encodeURIComponent(activeTicker)}`, {
          cache: "no-store",
          signal: controller.signal
        });
        const payload = (await response.json().catch(() => ({}))) as NewsApiResponse;

        if (!response.ok) {
          setNewsItems([]);
          setNewsError(payload.error ?? "Unable to load stock news.");
          return;
        }

        setNewsItems(payload.items ?? []);
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setNewsItems([]);
        setNewsError(fetchError instanceof Error ? fetchError.message : "Unable to load stock news.");
      } finally {
        if (!controller.signal.aborted) {
          setIsNewsLoading(false);
        }
      }
    }

    void loadNews();

    return () => controller.abort();
  }, [activeTicker]);

  const selectTicker = (ticker: string) => {
    if (ticker === activeTicker) {
      return;
    }

    setRequestMode("live");
    setActiveTicker(ticker);
    setAnalysis(null);
    setIsLoading(true);
    window.history.replaceState(null, "", `/dashboard?ticker=${ticker}`);
  };

  const refreshTicker = (ticker: string) => {
    setRequestMode("live");
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

  const viewHistoryTicker = (ticker: string) => {
    setRequestMode("history");
    setActiveTicker(ticker);
    setAnalysis(null);
    setError(undefined);
    setIsLive(false);
    setIsLoading(true);
    window.history.replaceState(null, "", `/dashboard?ticker=${ticker}`);
  };

  const watchlistTickers = watchlist.map((item) => item.ticker);
  const isWatchlisted = watchlistTickers.includes(activeTicker);
  const canAddWatchlist = isWatchlisted || watchlist.length < watchlistLimit;

  const toggleWatchlist = async () => {
    if (isAuthenticated && token) {
      const response = await fetch("/api/watchlist", {
        method: isWatchlisted ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-trade-session": token
        },
        body: JSON.stringify({ ticker: activeTicker })
      });

      const payload = (await response.json().catch(() => ({}))) as WatchlistApiResponse;

      if (!response.ok) {
        setError(payload.error ?? "Unable to update watchlist.");
        return;
      }

      setWatchlist(payload.watchlist ?? []);
      setWatchlistLimit(payload.limit ?? DEFAULT_WATCHLIST_LIMIT);
      return;
    }

    setWatchlist((current) => {
      if (current.some((item) => item.ticker === activeTicker)) {
        return current.filter((item) => item.ticker !== activeTicker);
      }

      if (current.length >= watchlistLimit) {
        return current;
      }

      return [{ ticker: activeTicker, addedAt: new Date().toISOString() }, ...current].slice(
        0,
        watchlistLimit
      );
    });
  };

  const removeWatchlistTicker = async (ticker: string) => {
    if (isAuthenticated && token) {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-trade-session": token
        },
        body: JSON.stringify({ ticker })
      });

      const payload = (await response.json().catch(() => ({}))) as WatchlistApiResponse;

      if (!response.ok) {
        setError(payload.error ?? "Unable to update watchlist.");
        return;
      }

      setWatchlist(payload.watchlist ?? []);
      setWatchlistLimit(payload.limit ?? DEFAULT_WATCHLIST_LIMIT);
      return;
    }

    setWatchlist((current) => current.filter((item) => item.ticker !== ticker));
  };

  const handleAuthSuccess = () => {
    setRequiresAuth(false);
    setRequiresUpgrade(false);
    setError(undefined);
    setReloadKey((current) => current + 1);
  };

  const usageLimit = allowance?.dailyAnalysisLimit ?? (allowance?.accountTier === "guest" ? 1 : null);
  const usageRemaining = allowance?.remainingAnalyses ?? null;
  const usageUsed = allowance?.analysesUsedToday ?? 0;
  const usageProgress =
    usageLimit && usageLimit > 0 ? Math.min((usageUsed / usageLimit) * 100, 100) : 100;
  const usageHeading =
    allowance?.accountTier === "paid"
      ? "Unlimited analysis capacity"
      : allowance?.accountTier === "free"
        ? `${usageRemaining ?? 0} of ${usageLimit ?? 0} analyses left today`
        : guestUsage?.freeAnalysisUsed
          ? `Guest access locked to ${guestUsage.firstTicker}`
          : "One guest stock analysis is available";
  const usageCaption =
    allowance?.accountTier === "paid"
      ? "Paid accounts can run unlimited analyses and keep a full watchlist."
      : allowance?.accountTier === "free"
        ? "Daily usage resets automatically with your free plan."
        : guestUsage?.freeAnalysisUsed
          ? "Sign in to unlock five fresh analyses each day."
          : "Your first analysis works without an account.";

  return (
    <>
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
                {activeTicker
                  ? `Dedicated analysis workspace for ${activeTicker}`
                  : "Dedicated analysis workspace"}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                {activeTicker
                  ? "The landing-page preview now expands into a full dashboard with the same visual system, a routed analysis flow, and a deeper workspace for signals, trade planning, and report review."
                  : "Search a stock ticker to open the live analysis workspace. The dashboard now stays idle until you choose what to analyze."}
              </p>

              <div className="mt-8">
                <TickerSearch
                  activeTicker={activeTicker}
                  setActiveTicker={setActiveTicker}
                  onAnalyze={refreshTicker}
                  onTickerSelect={selectTicker}
                  sampleReportTargetId="analysis-brief"
                  quickTickers={watchlistTickers}
                  quickTickersLabel="Watchlist"
                  analysisLoading={isLoading}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {!isAuthenticated ? (
                  <Badge variant="warning">
                    {guestUsage?.freeAnalysisUsed
                      ? `Guest access used. Sign in to unlock 5 analyses per day.`
                      : "One guest stock analysis available without login."}
                  </Badge>
                ) : null}
                {user ? (
                  <Badge variant={user.accountTier === "paid" ? "bullish" : "info"}>
                    {user.accountTier === "paid" ? "Paid account" : "Free account"}: {user.name}
                  </Badge>
                ) : null}
                {allowance?.accountTier === "free" ? (
                  <Badge variant="default">
                    {allowance.remainingAnalyses} of {allowance.dailyAnalysisLimit} analyses left today
                  </Badge>
                ) : null}
                {allowance?.accountTier === "paid" ? (
                  <Badge variant="bullish">Unlimited analyses enabled</Badge>
                ) : null}
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Usage meter
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                        {usageHeading}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {usageCaption}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/60">
                      {allowance?.accountTier === "paid" ? (
                        <InfinityIcon className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <ChartNoAxesColumn className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      )}
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full transition-all ${
                          allowance?.accountTier === "paid"
                            ? "w-full bg-emerald-500"
                            : usageProgress >= 100
                              ? "bg-amber-500"
                              : "bg-blue-600"
                        }`}
                        style={{
                          width: `${allowance?.accountTier === "paid" ? 100 : Math.max(usageProgress, 8)}%`
                        }}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <span>
                        Used today: <span className="font-semibold text-slate-900 dark:text-slate-100">{usageUsed}</span>
                      </span>
                      {usageLimit ? (
                        <span>
                          Limit: <span className="font-semibold text-slate-900 dark:text-slate-100">{usageLimit}</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-emerald-600 dark:text-emerald-300">
                          No limit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[24px] border border-slate-200/70 bg-white/85 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Watchlist
                        </p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                          {watchlist.length} of {watchlistLimit} saved
                        </p>
                      </div>
                      <Badge variant="default" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {watchlist.length}/{watchlistLimit}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/50">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Current stock
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="truncate text-base font-semibold text-slate-950 dark:text-slate-50">
                            {activeTicker || "No ticker selected"}
                          </span>
                          {isWatchlisted ? (
                            <Star className="h-4 w-4 fill-current text-amber-500" />
                          ) : null}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Button
                          type="button"
                          variant={isWatchlisted ? "secondary" : "default"}
                          size="sm"
                          onClick={() => void toggleWatchlist()}
                          disabled={!activeTicker || !canAddWatchlist}
                          className="gap-2"
                        >
                          <BookmarkPlus className="h-4 w-4" />
                          {isWatchlisted ? "Added" : "Add"}
                        </Button>
                      </div>
                    </div>
                    {activeTicker && !canAddWatchlist && !isWatchlisted ? (
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Your watchlist is full. Remove one ticker to add another.
                      </p>
                    ) : null}

                    <div className="mt-3 space-y-2">
                      {watchlist.length > 0 ? (
                        watchlist.map((item) => {
                          const active = item.ticker === activeTicker;

                          return (
                            <div
                              key={item.ticker}
                              className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition ${
                                active
                                  ? "border-slate-900 bg-slate-900 text-white dark:border-blue-500 dark:bg-blue-500"
                                  : "border-slate-200/80 bg-slate-50/80 text-slate-900 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-100"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => selectTicker(item.ticker)}
                                className="min-w-0 flex-1 text-left"
                              >
                                <p className="text-sm font-semibold">{item.ticker}</p>
                              </button>
                              <Button
                                type="button"
                                size="icon"
                                variant={active ? "ghost" : "secondary"}
                                onClick={() => void removeWatchlistTicker(item.ticker)}
                                className={active ? "h-8 w-8 text-white hover:bg-white/10 dark:hover:bg-white/10" : "h-8 w-8"}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Saved stocks will appear here.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                          Analysis history
                        </p>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          Recent work stays ready to reopen.
                        </p>
                      </div>
                      <Clock3 className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>

                    <div className="mt-4 space-y-3">
                      {history.length > 0 ? (
                        history.slice(0, DEFAULT_HISTORY_LIMIT).map((item) => (
                          <button
                            key={item.ticker}
                            type="button"
                            onClick={() => viewHistoryTicker(item.ticker)}
                            className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3 text-left transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                                  {item.ticker}
                                </span>
                                {item.trendBias ? (
                                  <Badge variant="default" className="px-2 py-0.5 text-[10px]">
                                    {item.trendBias}
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="mt-1 truncate text-sm text-slate-600 dark:text-slate-300">
                                {item.companyName}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {item.currentPrice !== null ? formatCurrency(item.currentPrice) : "Live"}
                              </p>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {formatRelativeTime(item.lastAnalyzedAt)}
                              </p>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Recent analyses will appear here after you run them.
                        </p>
                      )}
                    </div>
                  </div>
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
                ) : activeTicker ? (
                  <Badge variant="default" className="bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Waiting for live server response
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-white/80 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    Search for a stock to begin
                  </Badge>
                )}
              </div>
            </div>

            <Card className="glass-panel rounded-[32px] border-white/70 shadow-soft dark:border-slate-800">
              <CardContent className="p-5 sm:p-6">
                <div className="space-y-5">
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
                        <h2 className="mt-3 text-3xl font-semibold">
                          {activeTicker || "Pick a stock"}
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
                          {activeTicker
                            ? "No live analysis is available right now. Retry the request and the dashboard will populate as soon as the server responds."
                            : "Enter a ticker above to load live analysis, technical structure, and the trade brief into this workspace."}
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
                      {activeTicker ? (
                        <Button
                          type="button"
                          onClick={() => refreshTicker(activeTicker)}
                          className="w-fit"
                        >
                          Retry Live Analysis
                        </Button>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900/85">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                        Latest news
                      </p>
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        Three recent Stock News headlines for {activeTicker || "your next stock"}.
                      </p>
                    </div>
                    <Newspaper className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>

                  <div className="mt-4 space-y-3">
                    {isNewsLoading ? (
                      Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/50"
                        >
                          <div className="h-3.5 w-24 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="mt-3 h-4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                          <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
                        </div>
                      ))
                    ) : newsItems.length > 0 ? (
                      newsItems.map((item) => (
                        <a
                          key={`${item.link}-${item.title}`}
                          href={item.link}
                          target="_blank"
                          rel="noreferrer"
                          className="block rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold leading-6 text-slate-950 dark:text-slate-50">
                                {item.title}
                              </p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                                {item.source ? <span>{item.source}</span> : null}
                                {item.publishedAt ? (
                                  <span>{formatRelativeTime(item.publishedAt)}</span>
                                ) : null}
                              </div>
                            </div>
                            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
                          </div>
                        </a>
                      ))
                    ) : newsError ? (
                      <p className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                        {newsError}
                      </p>
                    ) : (
                      <p className="rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-400">
                        Pick a stock to load related headlines.
                      </p>
                    )}
                  </div>
                </div>
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
        ) : requiresUpgrade ? (
          <Card className="overflow-hidden rounded-[32px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Daily free limit reached
                </p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                  Your free account has used all 5 analyses for today
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  Upgrade to the paid plan to remove the daily cap and analyze any
                  number of stocks.
                </p>
                <div className="mt-8 flex justify-center">
                  <Button type="button" onClick={() => setIsUpgradeModalOpen(true)}>
                    Upgrade to Paid
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : requiresAuth ? (
          <Card className="overflow-hidden rounded-[32px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto max-w-3xl text-center">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                      Daily free limit reached
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                      Your free account has used all 5 analyses for today
                    </h3>
                    <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                      Upgrade to the paid plan to remove the daily cap and analyze any
                      number of stocks.
                    </p>
                    <div className="mt-8 flex justify-center">
                      <Button type="button" onClick={() => setIsUpgradeModalOpen(true)}>
                        Upgrade to Paid
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                      Authentication required
                    </p>
                    <h3 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                      Your free guest analysis has already been used
                    </h3>
                    <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                      Sign in with Gmail or create an account to unlock unlimited live
                      stock analysis beyond {guestUsage?.firstTicker ?? "your first ticker"}.
                    </p>
                    <div className="mt-8 flex justify-center">
                      <Button type="button" onClick={() => setIsAuthModalOpen(true)}>
                        Continue to Sign In
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ) : activeTicker ? (
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
        ) : (
          <Card className="overflow-hidden rounded-[32px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
            <CardContent className="p-8 sm:p-10">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  Ready when you are
                </p>
                <h3 className="mt-4 text-3xl font-semibold text-slate-950 dark:text-slate-50">
                  Choose a stock to start the dashboard
                </h3>
                <p className="mt-4 text-base leading-8 text-slate-600 dark:text-slate-300">
                  We no longer auto-run NVDA here. Search any US stock above and the live analysis view will load on demand.
                </p>
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
