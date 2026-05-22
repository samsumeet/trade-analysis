import { ReactNode } from "react";
import { ShieldAlert, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockAnalysisData } from "@/types/stock";

interface SampleReportProps {
  analysis: StockAnalysisData;
  actions?: ReactNode;
  eyebrow?: string;
  title?: string;
}

export function SampleReport({
  analysis,
  actions,
  eyebrow = "Live Analysis Brief",
  title
}: SampleReportProps) {
  return (
    <Card
      id="analysis-brief"
      className="overflow-hidden rounded-[28px] border-slate-200/70 dark:border-slate-800"
    >
      <CardHeader className="border-b border-slate-100 bg-slate-950 text-white dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-blue-300">
              {eyebrow}
            </p>
            <CardTitle className="mt-2 text-2xl text-white">
              {title ?? `${analysis.symbol} Executive Trade Brief`}
            </CardTitle>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
            {actions}
            <Badge variant="bullish">AI confidence {analysis.confidenceScore}/100</Badge>
            <Badge variant="default" className="bg-white/10 text-slate-100">
              Analyst terminal format
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-300">
              <Sparkles className="h-4 w-4 text-blue-600" />
              Executive summary
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
              {analysis.executiveSummary}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {analysis.reportSections.map((section) => (
              <div
                key={section.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">{section.label}</p>
                <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{section.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-500/20 dark:bg-blue-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
              Current setup
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{analysis.currentSetup}</p>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
              Momentum read
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{analysis.momentumRead}</p>
          </div>
          <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-rose-700">
              <ShieldAlert className="h-4 w-4" />
              Risk notes
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">{analysis.riskNotes}</p>
          </div>
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-400">
            This is not financial advice. Market analysis is for informational
            purposes only and should be used as one input in a broader research
            process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
