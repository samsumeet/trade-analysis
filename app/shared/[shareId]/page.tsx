import { ArrowUpRight, Clock3, FileDown } from "lucide-react";
import { notFound } from "next/navigation";

import { AutoPrint } from "@/components/auto-print";
import { SampleReport } from "@/components/sample-report";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBackendApiBaseUrl } from "@/lib/backend-api";
import { formatCurrency } from "@/lib/utils";
import { StockAnalysisData } from "@/types/stock";

interface SharedReportPageProps {
  params: {
    shareId: string;
  };
  searchParams?: {
    print?: string;
  };
}

interface SharedReportApiResponse {
  shareId?: string;
  ticker?: string;
  analysis?: StockAnalysisData;
  createdAt?: string;
  error?: string;
}

export const dynamic = "force-dynamic";

async function getSharedReport(shareId: string) {
  const response = await fetch(
    `${getBackendApiBaseUrl()}/api/share-reports/${encodeURIComponent(shareId)}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json().catch(() => ({}))) as SharedReportApiResponse;

  if (!payload.analysis || !payload.shareId) {
    return null;
  }

  return payload;
}

export default async function SharedReportPage({
  params,
  searchParams
}: SharedReportPageProps) {
  const payload = await getSharedReport(params.shareId);

  if (!payload?.analysis) {
    notFound();
  }

  const analysis = payload.analysis;
  const printMode = searchParams?.print === "1";

  return (
    <main className="min-h-screen bg-slate-50 py-10 text-slate-950 dark:bg-slate-950 dark:text-slate-100 print:bg-white print:py-0">
      <AutoPrint enabled={printMode} />
      <div className="container max-w-6xl space-y-6 print:max-w-none print:space-y-4">
        <Card className="print-hidden overflow-hidden rounded-[28px] border-slate-200/70 bg-white/95 shadow-soft dark:border-slate-800 dark:bg-slate-900/90">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <Badge variant="info" className="w-fit">
                  Read-only shared report
                </Badge>
                <h1 className="mt-4 text-3xl font-semibold">
                  {analysis.symbol} live analysis snapshot
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Shared for review in a read-only format. You can export this view as a PDF
                  or open the full dashboard to run a fresh live analysis.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="secondary" className="gap-2">
                  <a href={`/shared/${payload.shareId}?print=1`} target="_blank" rel="noreferrer">
                    <FileDown className="h-4 w-4" />
                    Export PDF
                  </a>
                </Button>
                <Button asChild className="gap-2">
                  <a href={`/dashboard?ticker=${analysis.symbol}`}>
                    Open live dashboard
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Current price
                </p>
                <p className="mt-2 text-2xl font-semibold">{formatCurrency(analysis.currentPrice)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  Trend bias
                </p>
                <p className="mt-2 text-2xl font-semibold">{analysis.trendBias}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                  <Clock3 className="h-3.5 w-3.5" />
                  Shared snapshot
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">
                  {payload.createdAt
                    ? new Date(payload.createdAt).toLocaleString()
                    : "Recent report snapshot"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <SampleReport
          analysis={analysis}
          eyebrow="Shared Analysis Brief"
          title={`${analysis.symbol} Read-Only Report`}
        />
      </div>
    </main>
  );
}
