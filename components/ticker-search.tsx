"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TickerSearchProps {
  symbols: string[];
  activeTicker: string;
  setActiveTicker: Dispatch<SetStateAction<string>>;
  onAnalyze?: (ticker: string) => void;
  onTickerSelect?: (ticker: string) => void;
  sampleReportTargetId?: string;
}

export function TickerSearch({
  symbols,
  activeTicker,
  setActiveTicker,
  onAnalyze,
  onTickerSelect,
  sampleReportTargetId = "sample-report"
}: TickerSearchProps) {
  const [query, setQuery] = useState(activeTicker);

  useEffect(() => {
    setQuery(activeTicker);
  }, [activeTicker]);

  const handleAnalyze = () => {
    const normalized = query.trim().toUpperCase();
    if (symbols.includes(normalized)) {
      setActiveTicker(normalized);
      if (onAnalyze) {
        onAnalyze(normalized);
        return;
      }

      const dashboard = document.getElementById("analysis-dashboard");
      dashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
            onChange={(event) => setQuery(event.target.value.toUpperCase())}
            placeholder="Enter ticker: HIMS, NVDA, TSLA, AAPL"
            className="h-14 border-white/80 bg-white pl-11 text-base"
          />
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
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => {
          const isActive = symbol === activeTicker;
          return (
            <button
              key={symbol}
              type="button"
              onClick={() => {
                setQuery(symbol);
                setActiveTicker(symbol);
                onTickerSelect?.(symbol);
              }}
              className={`rounded-full px-3 py-1.5 text-sm transition ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "bg-white/80 text-slate-600 hover:bg-white"
              }`}
            >
              {symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}
