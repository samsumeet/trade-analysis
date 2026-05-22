"use client";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CandlestickChart, Search, TrendingUp } from "lucide-react";

import nyseTickers from "@/data/nyse_tickers.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface TickerSearchProps {
  activeTicker: string;
  setActiveTicker: Dispatch<SetStateAction<string>>;
  onAnalyze?: (ticker: string) => void;
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
    setError("");
    setPendingTicker(ticker);
    setIsAutocompleteOpen(false);
    setHighlightedIndex(0);
    setQuery(ticker);
    setActiveTicker(ticker);

    window.setTimeout(() => {
      if (onAnalyze) {
        onAnalyze(ticker);
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
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xl">
          <Card className="w-full max-w-5xl overflow-hidden rounded-[36px] border-white/10 bg-[linear-gradient(145deg,rgba(15,23,42,0.97),rgba(15,23,42,0.92),rgba(30,64,175,0.88))] text-white shadow-2xl">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div>
                  <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                    Launching live stock analysis
                  </div>
                  <div className="mt-6 flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                      className="rounded-3xl border border-white/10 bg-white/10 p-4 text-cyan-200"
                    >
                      <BrainCircuit className="h-8 w-8" />
                    </motion.div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-slate-300">
                        Preparing dashboard for
                      </p>
                      <h3 className="mt-2 text-4xl font-semibold tracking-tight">
                        {pendingTicker || activeTicker}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-slate-200">
                    Streaming market context, technical structure, trade levels, and
                    AI scenario framing into a live research terminal.
                  </p>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
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
                        className="rounded-2xl border border-white/10 bg-white/10 p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-white/10 p-2 text-cyan-200">
                            <Icon className="h-4 w-4" />
                          </div>
                          <p className="text-sm font-medium text-white">{label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[30px] border border-white/10 bg-slate-950/75 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm uppercase tracking-[0.16em] text-blue-300">
                        Market engine
                      </p>
                      <p className="mt-2 text-lg font-medium text-white">
                        Building a stock-specific setup
                      </p>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.12, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200"
                    >
                      In progress
                    </motion.div>
                  </div>

                  <div className="chart-surface mt-6 rounded-[28px] border border-white/10 p-5">
                    <div className="flex h-52 items-end gap-2">
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
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {[
                      "Checking trend structure",
                      "Calculating support and resistance",
                      "Drafting bull and bear scenarios"
                    ].map((item, index) => (
                      <motion.div
                        key={item}
                        animate={{ opacity: [0.45, 1, 0.45] }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: index * 0.22 }}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
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

      <div className="flex flex-col gap-3 rounded-[24px] border border-white/70 bg-white/75 p-3 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 xl:flex-row">
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
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="w-full gap-2 sm:w-auto" onClick={handleAnalyze}>
            Analyze a Stock
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto" onClick={handleSampleReport}>
            View Analysis Brief
          </Button>
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
