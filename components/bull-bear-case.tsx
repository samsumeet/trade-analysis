import { TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scenario } from "@/types/stock";

interface BullBearCaseProps {
  scenario: Scenario;
  tone: "bull" | "bear";
}

export function BullBearCase({ scenario, tone }: BullBearCaseProps) {
  const isBull = tone === "bull";
  const Icon = isBull ? TrendingUp : TrendingDown;

  return (
    <Card
      className={`rounded-2xl border ${
        isBull
          ? "border-emerald-100 bg-emerald-50/70"
          : "border-rose-100 bg-rose-50/60"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div
            className={`rounded-2xl p-2 ${
              isBull ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <CardTitle>{scenario.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-slate-700">{scenario.summary}</p>
        <ul className="space-y-3 text-sm leading-6 text-slate-600">
          {scenario.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-current opacity-60" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
