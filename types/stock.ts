export type SignalTone = "bullish" | "warning" | "bearish" | "neutral";
export type TraderStyle = "day-swing" | "long-term";

export interface PricePoint {
  label: string;
  price: number;
  ema21: number;
  ema55: number;
  ma200: number;
  supertrendBull: number | null;
  supertrendBear: number | null;
}

export interface HistogramPoint {
  label: string;
  value: number;
}

export interface LinePoint {
  label: string;
  value: number;
}

export interface IndicatorStatus {
  name: string;
  value: string;
  tone: SignalTone;
  description: string;
}

export interface KeyLevel {
  label: string;
  value: string;
  context: string;
}

export interface TradeLevel {
  label: string;
  range: string;
  note: string;
}

export interface Scenario {
  title: string;
  summary: string;
  bullets: string[];
}

export interface SampleReportSection {
  label: string;
  value: string;
}

export interface StockAnalysisData {
  symbol: string;
  companyName: string;
  traderStyle: TraderStyle;
  currentPrice: number;
  dailyChangePct: number;
  open: number;
  dayRange: string;
  fiftyTwoWeekRange: string;
  marketCap: number;
  trendBias: string;
  confidenceScore: number;
  priceSeries: PricePoint[];
  macdSeries: HistogramPoint[];
  rsiSeries: LinePoint[];
  indicators: IndicatorStatus[];
  keyLevels: KeyLevel[];
  tradePlan: TradeLevel[];
  bullCase: Scenario;
  bearCase: Scenario;
  aiSummary: string;
  executiveSummary: string;
  currentSetup: string;
  momentumRead: string;
  riskNotes: string;
  reportSections: SampleReportSection[];
}
