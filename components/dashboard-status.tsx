import { Activity, WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface DashboardStatusProps {
  error?: string;
  isLive: boolean;
}

export function DashboardStatus({ error, isLive }: DashboardStatusProps) {
  if (isLive) {
    return (
      <Badge variant="bullish" className="gap-2">
        <Activity className="h-3.5 w-3.5" />
        Live API connected
      </Badge>
    );
  }

  return (
    <Badge
      variant="warning"
      className="max-w-full gap-2 whitespace-normal text-left leading-5"
    >
      <WifiOff className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      Using fallback data{error ? `: ${error}` : ""}
    </Badge>
  );
}
