"use client";

import { motion } from "framer-motion";
import { Activity, BrainCircuit, CandlestickChart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardLoaderProps {
  ticker: string;
}

const shimmerHeights = [62, 88, 72, 104, 82, 118, 96, 128];

export function DashboardLoader({ ticker }: DashboardLoaderProps) {
  return (
    <Card className="overflow-hidden rounded-[32px] border-white/70 bg-white/80 shadow-soft backdrop-blur">
      <CardContent className="p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge variant="info" className="w-fit">
              Loading live analysis
            </Badge>
            <div className="mt-5 flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                className="rounded-2xl bg-blue-100 p-3 text-blue-700"
              >
                <BrainCircuit className="h-6 w-6" />
              </motion.div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Analyzing ticker
                </p>
                <h2 className="mt-1 text-3xl font-semibold text-slate-950">{ticker}</h2>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Pulling price structure, indicator context, key levels, and AI trade
              framing in the background so the dashboard can hydrate with live data.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { icon: CandlestickChart, label: "Price structure" },
                { icon: Activity, label: "Momentum signals" },
                { icon: BrainCircuit, label: "AI thesis" }
              ].map(({ icon: Icon, label }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0.45, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white p-2 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">{label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-panel">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.16em] text-blue-300">
                  Live model pipeline
                </p>
                <p className="mt-2 text-lg font-medium text-slate-200">
                  Building the {ticker} research surface
                </p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
              >
                In progress
              </motion.div>
            </div>

            <div className="chart-surface mt-6 rounded-3xl border border-white/10 p-5">
              <div className="flex h-44 items-end gap-2">
                {shimmerHeights.map((height, index) => (
                  <motion.div
                    key={`${height}-${index}`}
                    animate={{ opacity: [0.35, 0.95, 0.35], y: [4, -2, 4] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: index * 0.08,
                      ease: "easeInOut"
                    }}
                    className="flex-1 rounded-t-full bg-gradient-to-t from-blue-500 via-cyan-400 to-emerald-300"
                    style={{ height }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {["Mapping indicators", "Scoring trade setup", "Drafting bull/bear cases"].map(
                (step, index) => (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      delay: index * 0.22
                    }}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                  >
                    {step}
                  </motion.div>
                )
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
