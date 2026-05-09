"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, CandlestickChart, Search, TrendingUp } from "lucide-react";

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

export function TickerSearch({
  activeTicker,
  setActiveTicker,
  onAnalyze,
  onTickerSelect,
  sampleReportTargetId = "sample-report",
  quickTickers = [],
  quickTickersLabel = "Quick access",
  analysisLoading = false
}: TickerSearchProps) {
  const [query, setQuery] = useState(activeTicker);
  const [error, setError] = useState("");
  const [pendingTicker, setPendingTicker] = useState("");

  useEffect(() => {
    setQuery(activeTicker);
  }, [activeTicker]);

  useEffect(() => {
    if (!analysisLoading) {
      setPendingTicker("");
    }
  }, [analysisLoading]);

  const handleAnalyze = () => {
    const normalized = query.trim().toUpperCase();
    if (!/^[A-Z.\-]{1,10}$/.test(normalized)) {
      setError("Enter a valid US stock ticker, for example NVDA or AAPL.");
      return;
    }

    setError("");
    setPendingTicker(normalized);
    setActiveTicker(normalized);
    window.setTimeout(() => {
      if (onAnalyze) {
        onAnalyze(normalized);
        return;
      }

      const dashboard = document.getElementById("analysis-dashboard");
      dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingTicker("");
    }, 80);
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

      <div className="flex flex-col gap-3 rounded-[28px] border border-white/70 bg-white/75 p-3 shadow-soft backdrop-blur xl:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            aria-label="Stock ticker"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value.toUpperCase());
              if (error) {
                setError("");
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAnalyze();
              }
            }}
            placeholder="Search any US stock ticker, for example NVDA or AAPL"
            className="h-14 border-white/80 bg-white pl-11 text-base"
            list="ticker-suggestions"
          />
          <datalist id="ticker-suggestions">
            {quickTickers.map((ticker) => (
              <option key={ticker} value={ticker} />
            ))}
          </datalist>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gap-2" onClick={handleAnalyze}>
            Analyze a Stock
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="lg" onClick={handleSampleReport}>
            View Sample Report
          </Button>
        </div>
      </div>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {quickTickers.length > 0 ? (
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
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
                    onTickerSelect?.(ticker);
                  }}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "bg-white/80 text-slate-600 hover:bg-white"
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
