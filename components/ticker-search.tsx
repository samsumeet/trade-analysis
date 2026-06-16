"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CandlestickChart, Search, TrendingUp } from "lucide-react";

import nyseTickers from "@/data/nyse_tickers.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getTraderStyleLabel, TRADER_STYLE_OPTIONS } from "@/lib/trader-style";
import type { TraderStyle } from "@/types/stock";

interface TickerSearchProps {
  activeTicker: string;
  setActiveTicker: Dispatch<SetStateAction<string>>;
  traderStyle: TraderStyle | null;
  setTraderStyle: Dispatch<SetStateAction<TraderStyle | null>>;
  onAnalyze?: (ticker: string, traderStyle: TraderStyle) => void;
  onTickerSelect?: (ticker: string) => void;
  sampleReportTargetId?: string;
  quickTickers?: string[];
  quickTickersLabel?: string;
  analysisLoading?: boolean;
}

const overlayBars = [48, 74, 66, 94, 78, 112, 88, 124, 96];
const MAX_SUGGESTIONS = 8;
const AVAILABLE_TICKERS = (nyseTickers as string[]).filter((ticker) =>
  /^[A-Z.\-]{1,10}$/.test(ticker)
);

export function TickerSearch({
  activeTicker,
  setActiveTicker,
  traderStyle,
  setTraderStyle,
  onAnalyze,
  onTickerSelect,
  sampleReportTargetId = "analysis-brief",
  quickTickers = [],
  quickTickersLabel = "Quick access",
  analysisLoading = false
}: TickerSearchProps) {
  const [query, setQuery] = useState(activeTicker);
  const [error, setError] = useState("");
  const [pendingTicker, setPendingTicker] = useState("");
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useEffect(() => {
    setQuery(activeTicker);
  }, [activeTicker]);

  useEffect(() => {
    if (!analysisLoading) {
      setPendingTicker("");
    }
  }, [analysisLoading]);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery) {
      return AVAILABLE_TICKERS.slice(0, MAX_SUGGESTIONS);
    }

    return AVAILABLE_TICKERS
      .filter((ticker) => ticker.includes(normalizedQuery))
      .slice(0, MAX_SUGGESTIONS);
  }, [query]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  const triggerAnalysis = (ticker: string) => {
    if (!traderStyle) {
      setError("Choose whether you are a day/swing trader or a long-term trader first.");
      return;
    }

    setError("");
    setPendingTicker(ticker);
    setIsAutocompleteOpen(false);
    setHighlightedIndex(0);
    setQuery(ticker);
    setActiveTicker(ticker);

    window.setTimeout(() => {
      if (onAnalyze) {
        onAnalyze(ticker, traderStyle);
        return;
      }

      const dashboard = document.getElementById("analysis-dashboard");
      dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingTicker("");
    }, 80);
  };

  const selectSuggestion = (ticker: string) => {
    setQuery(ticker);
    setActiveTicker(ticker);
    setError("");
    setIsAutocompleteOpen(false);
    setHighlightedIndex(0);
    onTickerSelect?.(ticker);
  };

  const handleAnalyze = () => {
    if (!traderStyle) {
      setError("Choose your trader type first so we can tailor the analysis.");
      return;
    }

    const normalized = query.trim().toUpperCase();
    if (!/^[A-Z.\-]{1,10}$/.test(normalized)) {
      setError("Enter a valid US stock ticker, for example NVDA or AAPL.");
      return;
    }

    triggerAnalysis(normalized);
  };

  const handleSampleReport = () => {
    document.getElementById(sampleReportTargetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="space-y-4">
      {pendingTicker || analysisLoading ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/70 p-0 backdrop-blur-xl sm:items-center sm:p-4">
          <Card className="h-[92dvh] w-full overflow-hidden rounded-t-[28px] border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.97),rgba(15,23,42,0.92),rgba(30,64,175,0.88))] text-white shadow-2xl sm:h-auto sm:max-h-[92vh] sm:max-w-5xl sm:rounded-[28px]">
            <CardContent className="h-full overflow-y-auto p-4 pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.85rem))] overscroll-contain sm:max-h-[92vh] sm:p-8 lg:p-10">
              <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8">
                <div>
                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.2em]">
                    Launching live stock analysis
                  </div>
                  <div className="mt-4 flex items-center gap-3 sm:mt-6 sm:gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      className="rounded-3xl border border-white/10 bg-white/10 p-3 text-cyan-200 sm:p-4"
                    >
                      <BrainCircuit className="h-6 w-6 sm:h-8 sm:w-8" />
                    </motion.div>
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-slate-300 sm:text-sm sm:tracking-[0.18em]">
                        Preparing dashboard for
                      </p>
                      <h3 className="mt-1 break-words text-[1.7rem] font-semibold tracking-tight sm:mt-2 sm:text-4xl">
                        {pendingTicker || activeTicker}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 max-w-2xl text-[13px] leading-6 text-slate-200 sm:mt-6 sm:text-base sm:leading-8">
                    Streaming market context, technical structure, trade levels, and
                    AI scenario framing into a live research terminal for{" "}
                    {getTraderStyleLabel(traderStyle ?? "day-swing").toLowerCase()}s.
                  </p>

                  <div className="mt-5 grid gap-3 sm:mt-8 sm:grid-cols-3">
                    {[
                      { icon: CandlestickChart, label: "Price action map" },
                      { icon: TrendingUp, label: "Momentum scan" },
                      { icon: BrainCircuit, label: "AI trade thesis" }
                    ].map(({ icon: Icon, label }, index) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0.45, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: index * 0.1 }}
                        className="rounded-2xl border border-white/10 bg-white/10 p-3 sm:p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="text-[13px] font-medium text-white sm:text-sm">{label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[26px] border border-white/10 bg-slate-950/75 p-4 sm:rounded-[30px] sm:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-[11px] uppercase tracking-[0.16em] text-blue-300 sm:text-sm">
                        Market engine
                      </p>
                      <p className="mt-1 text-sm font-medium text-white sm:mt-2 sm:text-lg">
                        Building a stock-specific setup
                      </p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-200 sm:px-4 sm:py-2 sm:text-sm"
                    >
                      In progress
                    </motion.div>
                  </div>

                  <div className="chart-surface mt-4 rounded-[24px] border border-white/10 p-3 sm:mt-6 sm:rounded-[28px] sm:p-5">
                    <div className="flex h-28 items-end gap-1.5 sm:h-52 sm:gap-2">
                      {overlayBars.map((height, index) => (
                        <motion.div
                          key={`${height}-${index}`}
                          animate={{ opacity: [0.35, 1, 0.35], y: [6, -3, 6] }}
                          transition={{
                            duration: 1.9,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.08
                          }}
                          className="flex-1 rounded-t-full bg-gradient-to-t from-blue-500 via-cyan-400 to-emerald-300"
                          style={{ height: `${Math.max(height * 0.62, 26)}px` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2.5 sm:mt-6 sm:space-y-3">
                    {[
                      "Checking trend structure",
                      "Calculating support and resistance",
                      "Drafting bull and bear scenarios"
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        animate={{ opacity: [0.45, 1, 0.45] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.22 }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] text-slate-200 sm:px-4 sm:py-3 sm:text-sm"
                      >
                        {item}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="rounded-[24px] border border-white/70 bg-white/75 p-3 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <Input
            aria-label="Stock ticker"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value.toUpperCase());
              setIsAutocompleteOpen(true);
              if (error) {
                setError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setIsAutocompleteOpen(true);
                setHighlightedIndex((current) =>
                  suggestions.length === 0 ? 0 : (current + 1) % suggestions.length
                );
                return;
              }

              if (event.key === "ArrowUp") {
                event.preventDefault();
                setIsAutocompleteOpen(true);
                setHighlightedIndex((current) =>
                  suggestions.length === 0 ? 0 : (current - 1 + suggestions.length) % suggestions.length
                );
                return;
              }

              if (event.key === "Enter") {
                event.preventDefault();
                if (isAutocompleteOpen && suggestions[highlightedIndex]) {
                  triggerAnalysis(suggestions[highlightedIndex]);
                  return;
                }
                handleAnalyze();
                return;
              }

              if (event.key === "Escape") {
                setIsAutocompleteOpen(false);
              }
            }}
            onFocus={() => setIsAutocompleteOpen(true)}
            onBlur={() => {
              window.setTimeout(() => setIsAutocompleteOpen(false), 120);
            }}
            placeholder="Search any US stock ticker, for example NVDA or AAPL"
            className="h-13 sm:h-14 border-white/80 bg-white pl-11 text-base dark:border-slate-700 dark:bg-slate-900"
          />
          {isAutocompleteOpen && suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-30 overflow-hidden rounded-[24px] border border-slate-200/80 bg-white/95 p-2 shadow-2xl backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
              <div className="mb-1 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                Matching stocks
              </div>
              <div className="space-y-1">
                {suggestions.map((entry, index) => {
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <button
                      key={entry}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        selectSuggestion(entry);
                        triggerAnalysis(entry);
                      }}
                      className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left transition ${
                        isHighlighted
                          ? "bg-slate-900 text-white dark:bg-blue-500"
                          : "bg-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
                      }`}
                    >
                      <p className="text-sm font-semibold">{entry}</p>
                      <ArrowRight
                        className={`h-4 w-4 shrink-0 ${
                          isHighlighted ? "text-white" : "text-slate-400 dark:text-slate-500"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0">
            <Button
              size="lg"
              className="w-full gap-2 sm:w-auto"
              onClick={handleAnalyze}
              disabled={analysisLoading || !traderStyle}
            >
              Analyze a Stock
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleSampleReport}>
              View Analysis Brief
            </Button>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-2 rounded-[20px] border border-slate-200/80 bg-slate-50/80 px-3 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
              Trader type
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Choose your analysis profile first
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {TRADER_STYLE_OPTIONS.map((option) => {
              const active = traderStyle === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setTraderStyle(option.value);
                    if (error) {
                      setError("");
                    }
                  }}
                  className={`rounded-2xl border px-3 py-2.5 text-left transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white dark:border-blue-500 dark:bg-blue-500"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-slate-700"
                  }`}
                >
                  <p className="text-sm font-semibold">{option.shortLabel}</p>
                  <p
                    className={`mt-1 text-[12px] leading-5 ${
                      active ? "text-white/80" : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {error ? <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p> : null}
      {quickTickers.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            {quickTickersLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {quickTickers.map((ticker) => {
              const isActive = ticker === activeTicker;
              return (
                <button
                  key={ticker}
                  type="button"
                  onClick={() => {
                    setQuery(ticker);
                    setActiveTicker(ticker);
                    setError("");
                    setIsAutocompleteOpen(false);
                    onTickerSelect?.(ticker);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-white dark:bg-blue-500"
                      : "bg-white/80 text-slate-600 hover:bg-white dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {ticker}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
