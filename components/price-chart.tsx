"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { PricePoint } from "@/types/stock";

interface PriceChartProps {
  data: PricePoint[];
}

export function PriceChart({ data }: PriceChartProps) {
  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.16)" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["dataMin - 2", "dataMax + 4"]}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: "1px solid rgba(148,163,184,0.2)",
              background: "rgba(2, 6, 23, 0.92)",
              color: "#f8fafc"
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#60a5fa"
            strokeWidth={3}
            dot={false}
            name="Price"
          />
          <Line
            type="monotone"
            dataKey="supertrendBull"
            stroke="#34d399"
            strokeWidth={2.3}
            dot={false}
            connectNulls={false}
            name="Supertrend Bull"
          />
          <Line
            type="monotone"
            dataKey="supertrendBear"
            stroke="#f59e0b"
            strokeWidth={2.3}
            dot={false}
            connectNulls={false}
            name="Supertrend Bear"
          />
          <Line
            type="monotone"
            dataKey="ema21"
            stroke="#c084fc"
            strokeWidth={2}
            dot={false}
            name="EMA 21"
          />
          <Line
            type="monotone"
            dataKey="ema55"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            name="EMA 55"
          />
          <Line
            type="monotone"
            dataKey="ma200"
            stroke="#e2e8f0"
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={false}
            name="200-day MA"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
