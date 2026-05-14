import { DashboardPage } from "@/components/dashboard-page";
import { normalizeAnalysisTicker } from "@/data/mock-analysis";

interface DashboardRouteProps {
  searchParams?: {
    ticker?: string;
  };
}

export const dynamic = "force-dynamic";

export default function Page({ searchParams }: DashboardRouteProps) {
  const initialTicker = normalizeAnalysisTicker(searchParams?.ticker);

  return <DashboardPage initialTicker={initialTicker} />;
}
