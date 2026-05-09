"use client";

import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { Activity, BrainCircuit, CandlestickChart, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TickerSearch } from "@/components/ticker-search";

interface HeroProps {
  activeTicker: string;
  setActiveTicker: Dispatch<SetStateAction<string>>;
}

const heroStats = [
  {
    icon: BrainCircuit,
    label: "AI inference layers",
    value: "12+ models"
  },
  {
    icon: CandlestickChart,
    label: "Trade signals tracked",
    value: "40+ factors"
  },
  {
    icon: ShieldCheck,
    label: "Risk zones mapped",
    value: "Entry to stop"
  },
  {
    icon: Activity,
    label: "Scenario outputs",
    value: "Bull / bear / neutral"
  }
];

export function Hero({ activeTicker, setActiveTicker }: HeroProps) {
  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.14),transparent_26%),radial-gradient(circle_at_left,rgba(16,185,129,0.12),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.86),rgba(248,250,252,1))]" />
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <Badge variant="info" className="mb-5 w-fit">
              Sophisticated AI infrastructure for stock analysis
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl"
            >
              AI-Powered Trade Analysis for Smarter Stock Decisions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-600"
            >
              Analyze any ticker with technical indicators, catalysts, momentum,
              risk zones, and AI-generated scenarios. From ticker to full trade
              plan in seconds for traders who need clarity before entering a
              position.
            </motion.p>
            <div className="mt-8">
              <TickerSearch
                activeTicker={activeTicker}
                setActiveTicker={setActiveTicker}
                onAnalyze={(ticker) => {
                  window.location.href = `/dashboard?ticker=${ticker}`;
                }}
                sampleReportTargetId="workflow-overview"
                quickTickers={["NVDA", "AAPL", "MSFT", "AMZN", "TSLA"]}
                quickTickersLabel="Popular large-cap tickers"
              />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Technical indicators, catalysts, risk zones, and AI-generated
              scenarios. AI analysis does not replace your judgment — it
              enhances your research workflow.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="relative"
          >
            <Card className="glass-panel rounded-[32px] border-white/70 shadow-soft">
              <CardContent className="p-4 sm:p-6">
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-5 text-slate-50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-400">Live AI terminal preview</p>
                      <h2 className="mt-2 text-2xl font-semibold">{activeTicker}</h2>
                      <p className="text-sm text-slate-400">
                        Multi-factor trade analysis preview
                      </p>
                    </div>
                    <Badge variant="bullish">Trend monitored</Badge>
                  </div>
                  <div className="chart-surface mt-6 grid h-56 rounded-3xl border border-white/10 p-4">
                    <div className="flex items-end gap-2">
                      {[36, 58, 44, 72, 60, 84, 68, 92, 80, 104, 96, 120].map(
                        (height, index) => (
                          <div
                            key={`${height}-${index}`}
                            className="flex-1 rounded-t-full bg-gradient-to-t from-blue-500 via-cyan-400 to-emerald-300 opacity-90"
                            style={{ height }}
                          />
                        )
                      )}
                    </div>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {heroStats.map(({ icon: Icon, label, value }) => (
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
                            <p className="mt-1 text-sm font-medium text-white">{value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
