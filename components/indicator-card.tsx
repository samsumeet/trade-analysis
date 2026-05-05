import { Activity, AlertTriangle, MinusCircle, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { IndicatorStatus } from "@/types/stock";

const toneStyles = {
  bullish: {
    icon: TrendingUp,
    badge: "bullish" as const,
    iconClass: "text-emerald-500"
  },
  warning: {
    icon: AlertTriangle,
    badge: "warning" as const,
    iconClass: "text-amber-500"
  },
  bearish: {
    icon: MinusCircle,
    badge: "bearish" as const,
    iconClass: "text-rose-500"
  },
  neutral: {
    icon: Activity,
    badge: "default" as const,
    iconClass: "text-slate-500"
  }
};

interface IndicatorCardProps {
  indicator: IndicatorStatus;
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  const { icon: Icon, badge, iconClass } = toneStyles[indicator.tone];

  return (
    <Card className="rounded-2xl border-slate-200/70 bg-white/80">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-slate-500">{indicator.name}</p>
            <p className="mt-1 text-lg font-semibold text-slate-950">
              {indicator.value}
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-2">
            <Icon className={`h-4 w-4 ${iconClass}`} />
          </div>
        </div>
        <Badge variant={badge}>{indicator.value}</Badge>
        <p className="text-sm leading-6 text-slate-600">{indicator.description}</p>
      </CardContent>
    </Card>
  );
}
