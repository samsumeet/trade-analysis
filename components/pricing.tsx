"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { AuthModal } from "@/components/auth-modal";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
  {
    name: "Free Preview",
    price: "$0",
    description: "One guest analysis, then up to 3 stock analyses per day after sign-in.",
    features: [
      "1 stock analysis without login",
      "3 stock analyses per day on free account",
      "Indicator snapshot",
      "Bull and bear case summary",
      "Basic trade plan outline"
    ]
  },
  {
    name: "Pro Trader",
    price: "$20/mo",
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
    price: "Custom",
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
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <>
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
                onClick={() => {
                  if (tier.featured) {
                    if (isAuthenticated) {
                      setIsUpgradeModalOpen(true);
                    } else {
                      setIsAuthModalOpen(true);
                    }
                    return;
                  }

                  if (tier.name === "AI Research Desk") {
                    window.location.href = "mailto:sales@aistockanalyses.com";
                  }
                }}
              >
                {tier.featured
                  ? user?.accountTier === "paid"
                    ? "Manage Plan"
                    : "Upgrade to Paid"
                  : tier.name === "AI Research Desk"
                    ? "Contact Sales"
                    : "Start Free"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          setIsUpgradeModalOpen(true);
        }}
        title="Create a free account before upgrading"
        description="Guests can view one analysis only. Create a free account to unlock 3 daily analyses, then upgrade to paid for unlimited access."
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </>
  );
}
