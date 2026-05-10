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
