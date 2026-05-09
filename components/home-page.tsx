"use client";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CandlestickChart,
  Layers3,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert
} from "lucide-react";

import { FeatureCard } from "@/components/feature-card";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/hero";
import { Pricing } from "@/components/pricing";
import { SectionHeading } from "@/components/section-heading";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent } from "@/components/ui/card";

const infrastructureFeatures = [
  {
    icon: BrainCircuit,
    title: "Modern AI infrastructure",
    description:
      "Multi-layer analysis pipelines synthesize technical structure, momentum, and scenario risk into one research surface."
  },
  {
    icon: CandlestickChart,
    title: "Multi-factor technical analysis",
    description:
      "Track supertrend, moving averages, RSI, MACD, price structure, and key market context in one pass."
  },
  {
    icon: Activity,
    title: "Live market-aware insights",
    description:
      "Designed around how active traders interpret setup strength, weakness, and tactical timing."
  },
  {
    icon: ShieldCheck,
    title: "Risk-aware trade planning",
    description:
      "Entry, stop-loss, and target zones are framed alongside invalidation logic instead of hype."
  },
  {
    icon: Radar,
    title: "Indicator-based decision support",
    description:
      "Surface signal quality across momentum, trend alignment, and execution readiness."
  },
  {
    icon: Layers3,
    title: "Bull and bear case generation",
    description:
      "AI-generated scenarios help traders pressure-test setups before capital is committed."
  }
];

const howItWorks = [
  {
    step: "01",
    title: "Enter a ticker",
    description:
      "Start with symbols like HIMS, NVDA, TSLA, or AAPL to launch a structured AI analysis flow."
  },
  {
    step: "02",
    title: "AI maps the setup",
    description:
      "Price action, indicators, catalysts, and risk zones are synthesized into an actionable view."
  },
  {
    step: "03",
    title: "Receive a complete trade plan",
    description:
      "Get entries, exits, targets, stop-loss levels, and scenario framing in seconds."
  }
];

const featureGrid = [
  { icon: BarChart3, title: "Technical indicator analysis" },
  { icon: Sparkles, title: "AI-generated trade thesis" },
  { icon: TrendingUp, title: "Bull and bear case breakdown" },
  { icon: ShieldCheck, title: "Risk and stop-loss planning" },
  { icon: TriangleAlert, title: "Pre-earnings analysis" },
  { icon: Activity, title: "Momentum and trend detection" },
  { icon: Target, title: "Support and resistance mapping" },
  { icon: Layers3, title: "Long-term outlook" },
  { icon: CandlestickChart, title: "Options strategy preview" },
  { icon: Radar, title: "Market catalyst detection" }
];

export function HomePage() {
  const [activeTicker, setActiveTicker] = useState("NVDA");

  return (
    <main className="pb-10">
      <SiteHeader
        navItems={[
          { href: "#features", label: "Features" },
          { href: "#workflow-overview", label: "Workflow" },
          { href: "#pricing", label: "Pricing" }
        ]}
      />

      <Hero
        activeTicker={activeTicker}
        setActiveTicker={setActiveTicker}
      />

      <section className="container mt-24">
        <SectionHeading
          eyebrow="Infrastructure"
          title="Sophisticated analysis infrastructure designed for active decision-making"
          description="trade-analysis is built to translate raw ticker context into a complete technical and risk-aware research workflow."
          align="center"
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {infrastructureFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section id="workflow-overview" className="container mt-24">
        <SectionHeading
          eyebrow="Live Workflow"
          title="A cleaner live-analysis workflow built around real server data"
          description="Open the dashboard, load a live ticker analysis, review indicators, key levels, scenario framing, and trade structure in one place."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Instant loading state",
              description: "A stock-themed full-screen loader appears immediately while the server prepares the analysis."
            },
            {
              title: "Live dashboard only",
              description: "The dashboard now waits for real backend output instead of filling the screen with seeded demo analysis."
            },
            {
              title: "Readable research layout",
              description: "Signals, risk, scenario notes, and favorites are arranged for faster scanning and cleaner navigation."
            }
          ].map((item) => (
            <Card key={item.title} className="rounded-[28px] border-slate-200/70 bg-white/90">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mt-24">
        <SectionHeading
          eyebrow="How It Works"
          title="From ticker to full trade plan in seconds"
          description="A simple workflow, shaped like a modern research terminal instead of a generic finance content site."
          align="center"
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {howItWorks.map((item) => (
            <Card key={item.step} className="rounded-[28px] border-slate-200/70 bg-white/85">
              <CardContent className="p-6">
                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                  {item.step}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="features" className="container mt-24">
        <SectionHeading
          eyebrow="Feature Grid"
          title="Built for traders who want depth without clutter"
          description="Every module is designed to increase clarity: technical indicators, catalysts, risk zones, and AI-generated scenarios in one workflow."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {featureGrid.map((feature) => (
            <Card key={feature.title} className="rounded-[24px] border-slate-200/70 bg-white/85">
              <CardContent className="space-y-4 p-5">
                <div className="w-fit rounded-2xl bg-slate-100 p-3 text-blue-600">
                  <feature.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium leading-6 text-slate-800">
                  {feature.title}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="container mt-24">
        <SectionHeading
          eyebrow="Pricing"
          title="Choose the level of analysis workflow that matches your pace"
          description="Simple pricing presentation for the product journey today. No payment flow is implemented in this preview."
          align="center"
        />
        <div className="mt-10">
          <Pricing />
        </div>
      </section>

      <section className="container mt-24">
        <Card className="overflow-hidden rounded-[32px] border-slate-200/70 bg-[linear-gradient(135deg,#0f172a,#1e3a8a,#0f766e)] text-white">
          <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm uppercase tracking-[0.16em] text-blue-200">
                Final CTA
              </p>
              <h3 className="mt-3 text-3xl font-semibold">
                Analyze any stock with sophisticated AI infrastructure
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-200">
                Technical indicators, catalysts, risk zones, and AI-generated
                scenarios for traders who need a cleaner workflow before acting.
              </p>
            </div>
            <div className="rounded-[28px] border border-white/15 bg-white/10 px-6 py-5 text-sm leading-7 text-slate-100 backdrop-blur">
              AI analysis does not replace your judgment — it enhances your
              research workflow.
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="container mt-20">
        <Footer />
      </div>
    </main>
  );
}
