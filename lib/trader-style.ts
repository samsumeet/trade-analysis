import type { TraderStyle } from "@/types/stock";

export const DEFAULT_TRADER_STYLE: TraderStyle = "day-swing";

export const TRADER_STYLE_OPTIONS: Array<{
  value: TraderStyle;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    value: "day-swing",
    label: "Day / Swing Trader",
    shortLabel: "Day / Swing",
    description: "Faster entries, tighter risk, and short-to-medium holding windows."
  },
  {
    value: "long-term",
    label: "Long-Term Trader",
    shortLabel: "Long-Term",
    description: "Position-building, trend durability, and multi-month to multi-year framing."
  }
];

export function isTraderStyle(value: string | null | undefined): value is TraderStyle {
  return value === "day-swing" || value === "long-term";
}

export function normalizeTraderStyle(value: string | null | undefined) {
  return isTraderStyle(value) ? value : undefined;
}

export function getTraderStyleLabel(style: TraderStyle) {
  return TRADER_STYLE_OPTIONS.find((option) => option.value === style)?.label ?? "Day / Swing Trader";
}
