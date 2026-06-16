import { DashboardPage } from "@/components/dashboard-page";
import { normalizeAnalysisTicker } from "@/data/mock-analysis";
import { normalizeTraderStyle } from "@/lib/trader-style";

interface DashboardRouteProps {
  searchParams?: {
    ticker?: string;
    style?: string;
  };
}

export const dynamic = "force-dynamic";

export default function Page({ searchParams }: DashboardRouteProps) {
  const initialTicker = normalizeAnalysisTicker(searchParams?.ticker);
  const initialTraderStyle = normalizeTraderStyle(searchParams?.style);

  return <DashboardPage initialTicker={initialTicker} initialTraderStyle={initialTraderStyle} />;
}
