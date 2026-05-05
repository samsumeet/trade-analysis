import { DashboardPage } from "@/components/dashboard-page";
import { getAnalysisTicker } from "@/data/mock-analysis";

interface DashboardRouteProps {
  searchParams?: {
    ticker?: string;
  };
}

export const dynamic = "force-dynamic";

export default function Page({ searchParams }: DashboardRouteProps) {
  const initialTicker = getAnalysisTicker(searchParams?.ticker);

  return <DashboardPage initialTicker={initialTicker} />;
}
