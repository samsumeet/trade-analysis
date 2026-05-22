"use client";

import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  ArrowUpRight,
  Building2,
  CandlestickChart,
  CircleDollarSign,
  Gauge,
  ScanSearch
} from "lucide-react";

import { BullBearCase } from "@/components/bull-bear-case";
import { IndicatorCard } from "@/components/indicator-card";
import { KeyLevelsTable } from "@/components/key-levels-table";
import { PriceChart } from "@/components/price-chart";
import { TradePlanCard } from "@/components/trade-plan-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import { StockAnalysisData } from "@/types/stock";

interface AnalysisDashboardProps {
  analysis: StockAnalysisData;
  mode?: "preview" | "full";
}

const statCards = [
  { key: "open", label: "Open", icon: CandlestickChart },
  { key: "dayRange", label: "Range", icon: Gauge },
  { key: "fiftyTwoWeekRange", label: "52-week range", icon: ScanSearch },
  { key: "marketCap", label: "Market cap", icon: Building2 }
] as const;

function getStatValue(
  analysis: StockAnalysisData,
  key: (typeof statCards)[number]["key"]
) {
  switch (key) {
    case "open":
      return formatCurrency(analysis.open);
    case "dayRange":
      return analysis.dayRange;
    case "fiftyTwoWeekRange":
      return analysis.fiftyTwoWeekRange;
    case "marketCap":
      return `$${formatCompactNumber(analysis.marketCap)}`;
    default:
      return "";
  }
}

export function AnalysisDashboard({
  analysis,
  mode = "preview"
}: AnalysisDashboardProps) {
  const isFull = mode === "full";

  return (
    <section id="analysis-dashboard" className="scroll-mt-10">
      <Card className="overflow-hidden rounded-[32px] border-slate-200/70 bg-white/90 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
        <CardHeader className="border-b border-slate-100 bg-slate-950 text-white dark:border-slate-800">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-blue-300">
                {isFull ? "Live analysis dashboard" : "Interactive analysis preview"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div>
                  <h3 className="text-2xl font-semibold sm:text-3xl">
                    {analysis.symbol}
                    <span className="ml-0 mt-1 block text-base font-medium text-slate-400 sm:ml-3 sm:mt-0 sm:inline">
                      {analysis.companyName}
                    </span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-400">
                    {isFull
                      ? "Built as a full workspace for traders who need structure before acting"
                      : "Built for traders who need clarity before entering a position"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-400">Current price</p>
                <p className="mt-1 text-3xl font-semibold">
                  {formatCurrency(analysis.currentPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Daily change</p>
                <Badge
                  variant={analysis.dailyChangePct >= 0 ? "bullish" : "bearish"}
                  className="mt-2 w-fit"
                >
                  {analysis.dailyChangePct >= 0 ? "+" : ""}
                  {analysis.dailyChangePct.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ key, label, icon: Icon }) => (
              <Card key={key} className="rounded-2xl border-slate-200/70 bg-slate-50/80 shadow-none dark:border-slate-800 dark:bg-slate-950/60">
                <CardContent className="flex items-center justify-between p-5">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                    <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-slate-50">
                      {getStatValue(analysis, key)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-2 text-blue-600 dark:bg-slate-900">
                    <Icon className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
            <motion.div layout className="dashboard-panel overflow-hidden rounded-[28px] p-4 sm:p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    Price structure and moving averages
                  </h4>
                  <p className="text-sm text-slate-400">
                    Supertrend, EMA 21, EMA 55, and 200-day moving average
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300 sm:text-xs">
                  {[
                    ["Price", "bg-blue-400"],
                    ["Supertrend Bull", "bg-emerald-400"],
                    ["Supertrend Bear", "bg-amber-400"],
                    ["EMA 21", "bg-purple-400"],
                    ["EMA 55", "bg-orange-400"],
                    ["200-day MA", "bg-slate-200"]
                  ].map(([label, color]) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1"
                    >
                      <span className={`h-2 w-2 rounded-full ${color}`} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/[0.03] px-2 py-3 sm:px-3">
                <PriceChart data={analysis.priceSeries} />
              </div>
            </motion.div>

            <div className="grid gap-4">
              {analysis.indicators.map((indicator) => (
                <IndicatorCard key={indicator.name} indicator={indicator} />
              ))}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[28px] border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950/80">
              <CardHeader>
                <CardTitle className="text-slate-950 dark:text-slate-50">MACD histogram preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] sm:h-[260px] pt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysis.macdSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(148,163,184,0.2)"
                      }}
                    />
                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                      fill="#60a5fa"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-[28px] border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-950/80">
              <CardHeader>
                <CardTitle className="text-slate-950 dark:text-slate-50">RSI line preview</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px] sm:h-[260px] pt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysis.rsiSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      domain={[20, 80]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 16,
                        border: "1px solid rgba(148,163,184,0.2)"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-950 sm:text-xl">
                      Live key levels
                    </h4>
                    <p className="text-sm text-slate-500">
                      Support, resistance, and invalidation mapped for execution
                    </p>
                  </div>
                </div>
                <KeyLevelsTable levels={analysis.keyLevels} />
              </div>

              <Card className="rounded-[28px] border-slate-200/70 bg-slate-50/80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-950">
                    <CircleDollarSign className="h-5 w-5 text-blue-600" />
                    AI summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm leading-7 text-slate-700">{analysis.aiSummary}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-950 sm:text-xl">
                      Entry and exit trade plan
                    </h4>
                    <p className="text-sm text-slate-500">
                      Structured levels for entries, exits, targets, and risk
                    </p>
                  </div>
                  <Badge variant="info" className="hidden sm:inline-flex">
                    Risk-aware planning
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {analysis.tradePlan.map((item) => (
                    <TradePlanCard key={item.label} item={item} />
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <BullBearCase scenario={analysis.bullCase} tone="bull" />
                <BullBearCase scenario={analysis.bearCase} tone="bear" />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-blue-600">
                  trade-analysis signal
                </p>
                <h4 className="mt-2 text-2xl font-semibold text-slate-950">
                  {analysis.trendBias}
                </h4>
              </div>
              <div className="rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Confidence score {analysis.confidenceScore}/100
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <ArrowUpRight className="mt-0.5 h-4 w-4 text-blue-600" />
              <p className="text-sm leading-7 text-slate-700">
                AI analysis does not replace your judgment — it enhances your
                research workflow. Use these levels and scenarios as a structured
                decision support layer, not a promise of returns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
