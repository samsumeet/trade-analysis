import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Free Preview",
    price: "$0",
    description: "Fast AI-backed previews for one ticker at a time.",
    features: [
      "Ticker dashboard preview",
      "Indicator snapshot",
      "Bull and bear case summary",
      "Basic trade plan outline"
    ]
  },
  {
    name: "Pro Trader",
    price: "$39/mo",
    description: "Built for active traders who want structured entries, exits, and risk maps.",
    featured: true,
    features: [
      "Full trade-plan breakdown",
      "Expanded indicator stack",
      "Pre-earnings and catalyst view",
      "Watchlist-ready AI summaries",
      "Confidence scoring and scenario ranking"
    ]
  },
  {
    name: "AI Research Desk",
    price: "$149/mo",
    description: "Advanced multi-scenario research workflows for serious retail operators.",
    features: [
      "Deep multi-timeframe analysis",
      "Long-term outlook and options preview",
      "Institutional-style report formatting",
      "Priority model access",
      "Custom alert and workflow hooks"
    ]
  }
];

export function Pricing() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={`rounded-[28px] border-slate-200/70 ${
            tier.featured
              ? "relative bg-slate-950 text-white shadow-panel"
              : "bg-white/90 dark:border-slate-800 dark:bg-slate-900/85"
          }`}
        >
          <CardHeader>
            <CardTitle className={tier.featured ? "text-white" : "text-slate-950 dark:text-slate-50"}>
              {tier.name}
            </CardTitle>
            <p className={tier.featured ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}>
              {tier.description}
            </p>
            <div className="pt-2 text-4xl font-semibold">{tier.price}</div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li
                  key={feature}
                  className={`flex items-start gap-3 text-sm leading-6 ${
                    tier.featured ? "text-slate-200" : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <span
                    className={`mt-0.5 rounded-full p-1 ${
                      tier.featured
                        ? "bg-white/10 text-blue-300"
                        : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={tier.featured ? "default" : "secondary"}
              className={`w-full ${tier.featured ? "bg-white text-slate-950 hover:bg-slate-100" : ""}`}
            >
              Choose {tier.name}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
