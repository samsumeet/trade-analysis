import { ArrowUpRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { TradeLevel } from "@/types/stock";

interface TradePlanCardProps {
  item: TradeLevel;
}

export function TradePlanCard({ item }: TradePlanCardProps) {
  return (
    <Card className="rounded-2xl border-slate-200/70 bg-white">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-slate-500">{item.label}</p>
          <ArrowUpRight className="h-4 w-4 text-slate-300" />
        </div>
        <p className="mt-2 text-xl font-semibold text-slate-950">{item.range}</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{item.note}</p>
      </CardContent>
    </Card>
  );
}
