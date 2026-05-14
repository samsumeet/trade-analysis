export interface AuthUser {
  id: string;
  email: string;
  name: string;
  provider: "credentials" | "google";
  accountTier: "free" | "paid";
  subscriptionStatus: "inactive" | "active";
  subscriptionPlan: "pro-monthly" | null;
  dailyAnalysisLimit: number | null;
}

export interface GuestUsage {
  guestKey: string;
  firstTicker: string;
  accessCount: number;
  freeAnalysisUsed: boolean;
  remainingAnalyses: number;
}

export interface AnalysisAllowance {
  accountTier: "guest" | "free" | "paid";
  dailyAnalysisLimit: number | null;
  remainingAnalyses: number | null;
  analysesUsedToday: number;
}

export interface WatchlistItem {
  ticker: string;
  addedAt: string;
}

export interface AnalysisHistoryItem {
  ticker: string;
  companyName: string;
  currentPrice: number | null;
  trendBias: string;
  confidenceScore: number | null;
  analysisCount: number;
  firstAnalyzedAt: string;
  lastAnalyzedAt: string;
}

export interface DashboardSummary {
  allowance: AnalysisAllowance;
  watchlist: WatchlistItem[];
  history: AnalysisHistoryItem[];
  watchlistLimit: number;
  historyLimit: number;
}

export interface AuthSuccessResponse {
  token: string;
  user: AuthUser;
  allowance?: AnalysisAllowance | null;
}

export interface PaymentCheckoutPreview {
  checkoutId: string;
  plan: "pro-monthly";
  amountCents: number;
  currency: "USD";
  cardLast4: string;
  status: "pending" | "paid";
}
