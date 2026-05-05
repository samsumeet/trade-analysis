"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BrainCircuit,
  BriefcaseBusiness,
  ShieldCheck,
  Target
} from "lucide-react";

import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { Footer } from "@/components/footer";
import { SampleReport } from "@/components/sample-report";
import { SiteHeader } from "@/components/site-header";
import { TickerSearch } from "@/components/ticker-search";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { featuredSymbols, stockAnalyses } from "@/data/mock-analysis";
import { formatCurrency } from "@/lib/utils";

interface DashboardPageProps {
  initialTicker: string;
}

const dashboardCards = [
  {
    icon: BrainCircuit,
    label: "AI posture",
    getValue: (analysisSymbol: string) => stockAnalyses[analysisSymbol].trendBias
  },
  {
    icon: ShieldCheck,
    label: "Confidence",
    getValue: (analysisSymbol: string) =>
      `${stockAnalyses[analysisSymbol].confidenceScore}/100`
  },
  {
    icon: Target,
    label: "Ideal entry",
    getValue: (analysisSymbol: string) =>
      stockAnalyses[analysisSymbol].tradePlan[0]?.range ?? "N/A"
  },
  {
    icon: BriefcaseBusiness,
    label: "Current price",
    getValue: (analysisSymbol: string) =>
      formatCurrency(stockAnalyses[analysisSymbol].currentPrice)
  }
];

export function DashboardPage({ initialTicker }: DashboardPageProps) {
  const [activeTicker, setActiveTicker] = useState(initialTicker);

  useEffect(() => {
    setActiveTicker(initialTicker);
  }, [initialTicker]);

  const analysis = useMemo(
    () => stockAnalyses[activeTicker] ?? stockAnalyses.HIMS,
    [activeTicker]
  );

  const syncTicker = (ticker: string) => {
    setActiveTicker(ticker);
    window.history.replaceState(null, "", `/dashboard?ticker=${ticker}`);
  };

  return (
    <main className="pb-10">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.16),transparent_28%),radial-gradient(circle_at_left,rgba(16,185,129,0.12),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.86),rgba(248,250,252,1))]" />
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
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl">
                Dedicated analysis workspace for {analysis.symbol}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                The landing-page preview now expands into a full dashboard with the
                same visual system, a routed analysis flow, and a deeper workspace
                for signals, trade planning, and report review.
              </p>

              <div className="mt-8">
                <TickerSearch
                  symbols={featuredSymbols}
                  activeTicker={activeTicker}
                  setActiveTicker={setActiveTicker}
                  onAnalyze={syncTicker}
                  onTickerSelect={syncTicker}
                  sampleReportTargetId="report"
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Badge variant={analysis.dailyChangePct >= 0 ? "bullish" : "bearish"}>
                  {analysis.dailyChangePct >= 0 ? "+" : ""}
                  {analysis.dailyChangePct.toFixed(2)}% today
                </Badge>
                <Badge variant="default" className="bg-white/80 text-slate-700">
                  {analysis.companyName}
                </Badge>
              </div>
            </div>

            <Card className="glass-panel rounded-[32px] border-white/70 shadow-soft">
              <CardContent className="p-5 sm:p-6">
                <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-5 text-white">
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
                              {getValue(analysis.symbol)}
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
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      <section id="dashboard" className="container mt-8 scroll-mt-10">
        <AnalysisDashboard analysis={analysis} mode="full" />
      </section>

      <section id="report" className="container mt-24 scroll-mt-10">
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <SampleReport analysis={analysis} />
          <div className="space-y-6">
            <Card className="rounded-[28px] border-slate-200/70 bg-white/90">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Execution checklist
                </p>
                <div className="mt-5 space-y-4">
                  {analysis.keyLevels.slice(0, 4).map((level) => (
                    <div
                      key={level.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-slate-900">{level.label}</p>
                        <p className="text-sm font-semibold text-slate-950">{level.value}</p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{level.context}</p>
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
                <h3 className="mt-3 text-2xl font-semibold">{analysis.trendBias}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-100">
                  {analysis.executiveSummary}
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                      Momentum read
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white">
                      {analysis.momentumRead}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-300">
                      Risk note
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white">
                      {analysis.riskNotes}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200/70 bg-white/90">
              <CardContent className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
                  Indicator stack
                </p>
                <div className="mt-5 space-y-3">
                  {analysis.indicators.map((indicator) => (
                    <div
                      key={indicator.name}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-slate-900">{indicator.name}</p>
                        <Badge variant="default" className="bg-slate-100 text-slate-700">
                          {indicator.value}
                        </Badge>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-500">
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

      <div className="container mt-20">
        <Footer />
      </div>
    </main>
  );
}
