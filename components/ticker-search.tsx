"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TickerSearchProps {
  activeTicker: string;
  setActiveTicker: Dispatch<SetStateAction<string>>;
  onAnalyze?: (ticker: string) => void;
  onTickerSelect?: (ticker: string) => void;
  sampleReportTargetId?: string;
  quickTickers?: string[];
  quickTickersLabel?: string;
}

export function TickerSearch({
  activeTicker,
  setActiveTicker,
  onAnalyze,
  onTickerSelect,
  sampleReportTargetId = "sample-report",
  quickTickers = [],
  quickTickersLabel = "Quick access"
}: TickerSearchProps) {
  const [query, setQuery] = useState(activeTicker);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuery(activeTicker);
  }, [activeTicker]);

  const handleAnalyze = () => {
    const normalized = query.trim().toUpperCase();
    if (!/^[A-Z.\-]{1,10}$/.test(normalized)) {
      setError("Enter a valid US stock ticker, for example NVDA or AAPL.");
      return;
    }

    setError("");
    setActiveTicker(normalized);
    if (onAnalyze) {
      onAnalyze(normalized);
      return;
    }

    const dashboard = document.getElementById("analysis-dashboard");
    dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSampleReport = () => {
    document.getElementById(sampleReportTargetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="space-y-4">
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
