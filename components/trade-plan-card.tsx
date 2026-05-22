import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TradeLevel } from "@/types/stock";

interface TradePlanCardProps {
  item: TradeLevel;
}

export function TradePlanCard({ item }: TradePlanCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200/70 bg-white">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="min-w-0 text-sm font-medium leading-6 text-slate-500">{item.label}</p>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
        </div>
        <p className="mt-2 break-words text-lg font-semibold text-slate-950 sm:text-xl">
          {item.range}
        </p>
        <p className="mt-3 break-words text-sm leading-6 text-slate-600">{item.note}</p>
      </CardContent>
    </Card>
  );
}
