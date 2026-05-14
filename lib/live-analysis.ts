import { getAnalysisTicker } from "@/data/mock-analysis";
import {
  HistogramPoint,
  IndicatorStatus,
  KeyLevel,
  LinePoint,
  PricePoint,
  SampleReportSection,
  Scenario,
  SignalTone,
  StockAnalysisData,
  TradeLevel
} from "@/types/stock";
import { AnalysisAllowance, AuthUser, GuestUsage } from "@/types/auth";
import { getBackendApiBaseUrl } from "@/lib/backend-api";

const ANALYZE_API_URL = `${getBackendApiBaseUrl()}/api/analyze`;

function getAnalyzeApiTimeoutMs() {
  const configured = Number(
    process.env.TRADE_ANALYSIS_API_TIMEOUT_MS ??
      process.env.NEXT_PUBLIC_TRADE_ANALYSIS_API_TIMEOUT_MS
  );

  if (Number.isFinite(configured) && configured >= 1000) {
    return configured;
  }

  return 120000;
}

const ANALYZE_API_TIMEOUT_MS = getAnalyzeApiTimeoutMs();

export interface FetchAnalysisResult {
  analysis: StockAnalysisData | null;
  error?: string;
  isLive: boolean;
  authRequired?: boolean;
  paywallRequired?: boolean;
  code?: string;
  user?: AuthUser | null;
  guestUsage?: GuestUsage;
  allowance?: AnalysisAllowance;
}

export function createEmptyAnalysis(ticker: string): StockAnalysisData {
  const normalizedTicker = getAnalysisTicker(ticker);

  return {
    symbol: normalizedTicker,
    companyName: "",
    currentPrice: 0,
    dailyChangePct: 0,
    open: 0,
    dayRange: "",
    fiftyTwoWeekRange: "",
    marketCap: 0,
    trendBias: "",
    confidenceScore: 0,
    priceSeries: [],
    macdSeries: [],
    rsiSeries: [],
    indicators: [],
    keyLevels: [],
    tradePlan: [],
    bullCase: {
      title: "Bullish scenario",
      summary: "",
      bullets: []
    },
    bearCase: {
      title: "Bearish scenario",
      summary: "",
      bullets: []
    },
    aiSummary: "",
    executiveSummary: "",
    currentSetup: "",
    momentumRead: "",
    riskNotes: "",
    reportSections: []
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[$,%\s,]/g, "");
    const parsed = Number(normalized);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}

function asString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function asGuestUsage(value: unknown): GuestUsage | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const guestKey = asString(value.guestKey);
  const firstTicker = asString(value.firstTicker);
  const accessCount = asNumber(value.accessCount);
  const remainingAnalyses = asNumber(value.remainingAnalyses);
  const freeAnalysisUsed = typeof value.freeAnalysisUsed === "boolean"
    ? value.freeAnalysisUsed
    : undefined;

  if (
    !guestKey ||
    !firstTicker ||
    accessCount === undefined ||
    remainingAnalyses === undefined ||
    freeAnalysisUsed === undefined
  ) {
    return undefined;
  }

  return {
    guestKey,
    firstTicker,
    accessCount,
    freeAnalysisUsed,
    remainingAnalyses
  };
}

function asAuthUser(value: unknown): AuthUser | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const id = asString(value.id);
  const email = asString(value.email);
  const name = asString(value.name);
  const provider =
    value.provider === "credentials" || value.provider === "google"
      ? value.provider
      : undefined;
  const accountTier =
    value.accountTier === "free" || value.accountTier === "paid"
      ? value.accountTier
      : undefined;
  const subscriptionStatus =
    value.subscriptionStatus === "inactive" || value.subscriptionStatus === "active"
      ? value.subscriptionStatus
      : undefined;
  const subscriptionPlan =
    value.subscriptionPlan === null || value.subscriptionPlan === "pro-monthly"
      ? value.subscriptionPlan
      : undefined;
  const dailyAnalysisLimit =
    value.dailyAnalysisLimit === null
      ? null
      : asNumber(value.dailyAnalysisLimit);

  if (
    !id ||
    !email ||
    !name ||
    !provider ||
    !accountTier ||
    !subscriptionStatus ||
    subscriptionPlan === undefined ||
    dailyAnalysisLimit === undefined
  ) {
    return undefined;
  }

  return {
    id,
    email,
    name,
    provider,
    accountTier,
    subscriptionStatus,
    subscriptionPlan,
    dailyAnalysisLimit
  };
}

function asAnalysisAllowance(value: unknown): AnalysisAllowance | undefined {
  if (!isObject(value)) {
    return undefined;
  }

  const accountTier =
    value.accountTier === "guest" || value.accountTier === "free" || value.accountTier === "paid"
      ? value.accountTier
      : undefined;
  const analysesUsedToday = asNumber(value.analysesUsedToday);
  const dailyAnalysisLimit =
    value.dailyAnalysisLimit === null ? null : asNumber(value.dailyAnalysisLimit);
  const remainingAnalyses =
    value.remainingAnalyses === null ? null : asNumber(value.remainingAnalyses);

  if (
    !accountTier ||
    analysesUsedToday === undefined ||
    dailyAnalysisLimit === undefined ||
    remainingAnalyses === undefined
  ) {
    return undefined;
  }

  return {
    accountTier,
    dailyAnalysisLimit,
    remainingAnalyses,
    analysesUsedToday
  };
}

function firstDefined<T>(...values: Array<T | undefined>) {
  return values.find((value) => value !== undefined);
}

function inferTone(value: string, fallback: SignalTone = "neutral"): SignalTone {
  const normalized = value.toLowerCase();

  if (
    normalized.includes("bull") ||
    normalized.includes("buy") ||
    normalized.includes("strong")
  ) {
    return "bullish";
  }

  if (
    normalized.includes("bear") ||
    normalized.includes("sell") ||
    normalized.includes("weak")
  ) {
    return "bearish";
  }

  if (
    normalized.includes("warn") ||
    normalized.includes("caut") ||
    normalized.includes("fade")
  ) {
    return "warning";
  }

  return fallback;
}

function formatRange(low?: unknown, high?: unknown) {
  const lowNumber = asNumber(low);
  const highNumber = asNumber(high);

  if (lowNumber !== undefined && highNumber !== undefined) {
    return `$${lowNumber.toLocaleString("en-US")} - $${highNumber.toLocaleString("en-US")}`;
  }

  return undefined;
}

function normalizePriceSeries(
  value: unknown,
  fallback: PricePoint[]
): PricePoint[] {
  const points = asArray(value)
    .map((point, index) => {
      if (!isObject(point)) {
        return null;
      }

      return {
        label:
          asString(
            firstDefined(point.label, point.date, point.time, point.timestamp)
          ) ?? `Point ${index + 1}`,
        price:
          asNumber(
            firstDefined(point.price, point.close, point.currentPrice, point.value)
          ) ?? fallback[index]?.price ?? 0,
        ema21:
          asNumber(
            firstDefined(point.ema21, point.ema_21, point.emaFast, point.fastEma)
          ) ?? fallback[index]?.ema21 ?? 0,
        ema55:
          asNumber(
            firstDefined(point.ema55, point.ema_55, point.emaSlow, point.slowEma)
          ) ?? fallback[index]?.ema55 ?? 0,
        ma200:
          asNumber(
            firstDefined(point.ma200, point.ma_200, point.sma200, point.movingAverage200)
          ) ?? fallback[index]?.ma200 ?? 0,
        supertrendBull:
          firstDefined(
            asNumber(firstDefined(point.supertrendBull, point.supertrend_bull)),
            fallback[index]?.supertrendBull
          ) ?? null,
        supertrendBear:
          firstDefined(
            asNumber(firstDefined(point.supertrendBear, point.supertrend_bear)),
            fallback[index]?.supertrendBear
          ) ?? null
      } satisfies PricePoint;
    })
    .filter((point): point is PricePoint => point !== null);

  return points.length > 0 ? points : fallback;
}

function normalizeSimpleSeries<T extends HistogramPoint | LinePoint>(
  value: unknown,
  fallback: T[]
): T[] {
  const points = asArray(value)
    .map((point, index) => {
      if (!isObject(point)) {
        return null;
      }

      return {
        label:
          asString(
            firstDefined(point.label, point.date, point.time, point.timestamp)
          ) ?? fallback[index]?.label ?? `Point ${index + 1}`,
        value:
          asNumber(firstDefined(point.value, point.histogram, point.rsi, point.macd)) ??
          fallback[index]?.value ??
          0
      } as T;
    })
    .filter((point): point is T => point !== null);

  return points.length > 0 ? points : fallback;
}

function normalizeIndicators(
  value: unknown,
  fallback: IndicatorStatus[]
): IndicatorStatus[] {
  const indicators = asArray(value)
    .map((indicator) => {
      if (!isObject(indicator)) {
        return null;
      }

      const name = asString(firstDefined(indicator.name, indicator.label, indicator.title));
      const currentValue = asString(
        firstDefined(indicator.value, indicator.signal, indicator.status)
      );

      if (!name || !currentValue) {
        return null;
      }

      return {
        name,
        value: currentValue,
        tone: inferTone(
          asString(indicator.tone) ?? currentValue,
          "neutral"
        ),
        description:
          asString(
            firstDefined(indicator.description, indicator.summary, indicator.context)
          ) ?? ""
      } satisfies IndicatorStatus;
    })
    .filter((indicator): indicator is IndicatorStatus => indicator !== null);

  return indicators.length > 0 ? indicators : fallback;
}

function normalizeKeyLevels(value: unknown, fallback: KeyLevel[]): KeyLevel[] {
  const levels = asArray(value)
    .map((level) => {
      if (!isObject(level)) {
        return null;
      }

      const label = asString(firstDefined(level.label, level.name, level.title));
      const currentValue = firstDefined(
        asString(level.value),
        formatRange(level.low, level.high),
        asString(level.price)
      );

      if (!label || !currentValue) {
        return null;
      }

      return {
        label,
        value: currentValue,
        context:
          asString(firstDefined(level.context, level.description, level.note)) ?? ""
      } satisfies KeyLevel;
    })
    .filter((level): level is KeyLevel => level !== null);

  return levels.length > 0 ? levels : fallback;
}

function normalizeTradePlan(value: unknown, fallback: TradeLevel[]): TradeLevel[] {
  const plan = asArray(value)
    .map((item) => {
      if (!isObject(item)) {
        return null;
      }

      const label = asString(firstDefined(item.label, item.name, item.title));
      const range = firstDefined(
        asString(item.range),
        formatRange(item.low, item.high),
        asString(item.value)
      );

      if (!label || !range) {
        return null;
      }

      return {
        label,
        range,
        note: asString(firstDefined(item.note, item.description, item.context)) ?? ""
      } satisfies TradeLevel;
    })
    .filter((item): item is TradeLevel => item !== null);

  return plan.length > 0 ? plan : fallback;
}

function normalizeScenario(value: unknown, fallback: Scenario): Scenario {
  if (!isObject(value)) {
    return fallback;
  }

  const bullets = asArray(firstDefined(value.bullets, value.points, value.reasons))
    .map((item) => asString(item))
    .filter((item): item is string => Boolean(item));

  return {
    title: asString(firstDefined(value.title, value.label)) ?? fallback.title,
    summary: asString(firstDefined(value.summary, value.description, value.thesis)) ?? fallback.summary,
    bullets: bullets.length > 0 ? bullets : fallback.bullets
  };
}

function normalizeReportSections(
  value: unknown,
  fallback: SampleReportSection[]
): SampleReportSection[] {
  const sections = asArray(value)
    .map((section) => {
      if (!isObject(section)) {
        return null;
      }

      const label = asString(firstDefined(section.label, section.name, section.title));
      const currentValue = asString(firstDefined(section.value, section.summary, section.description));

      if (!label || !currentValue) {
        return null;
      }

      return { label, value: currentValue } satisfies SampleReportSection;
    })
    .filter((section): section is SampleReportSection => section !== null);

  return sections.length > 0 ? sections : fallback;
}

function normalizeAnalysis(ticker: string, raw: unknown): StockAnalysisData {
  const normalizedTicker = getAnalysisTicker(ticker);
  const fallback = createEmptyAnalysis(normalizedTicker);
  const payloadSource = isObject(raw)
    ? isObject(raw.data)
      ? isObject(raw.data[normalizedTicker])
        ? raw.data[normalizedTicker]
        : isObject(raw.data[normalizedTicker.toUpperCase()])
          ? raw.data[normalizedTicker.toUpperCase()]
          : isObject(raw.data.analysis)
            ? raw.data.analysis
            : isObject(raw.data.result)
              ? raw.data.result
              : raw.data
      : isObject(raw.analysis)
        ? raw.analysis
        : isObject(raw.result)
        ? raw.result
          : raw
    : {};
  const payload = isObject(payloadSource) ? payloadSource : {};

  const liveSymbol =
    asString(firstDefined(payload.symbol, payload.ticker)) ?? normalizedTicker;

  return {
    symbol: liveSymbol,
    companyName:
      asString(
        firstDefined(payload.companyName, payload.company_name, payload.company, payload.name)
      ) ?? fallback.companyName,
    currentPrice:
      asNumber(
        firstDefined(
          payload.currentPrice,
          payload.current_price,
          payload.price,
          isObject(payload.quote) ? payload.quote.price : undefined
        )
      ) ?? fallback.currentPrice,
    dailyChangePct:
      asNumber(
        firstDefined(
          payload.dailyChangePct,
          payload.daily_change_pct,
          payload.changePercent,
          payload.change_percent,
          isObject(payload.quote) ? payload.quote.changePercent : undefined
        )
      ) ?? fallback.dailyChangePct,
    open:
      asNumber(firstDefined(payload.open, isObject(payload.quote) ? payload.quote.open : undefined)) ??
      fallback.open,
    dayRange:
      asString(firstDefined(payload.dayRange, payload.day_range)) ??
      formatRange(payload.dayLow, payload.dayHigh) ??
      fallback.dayRange,
    fiftyTwoWeekRange:
      asString(firstDefined(payload.fiftyTwoWeekRange, payload.fifty_two_week_range, payload.yearRange)) ??
      formatRange(payload.week52Low, payload.week52High) ??
      fallback.fiftyTwoWeekRange,
    marketCap: asNumber(firstDefined(payload.marketCap, payload.market_cap)) ?? fallback.marketCap,
    trendBias:
      asString(
        firstDefined(payload.trendBias, payload.trend_bias, payload.bias, payload.recommendation)
      ) ?? fallback.trendBias,
    confidenceScore:
      asNumber(firstDefined(payload.confidenceScore, payload.confidence_score, payload.confidence, payload.score)) ??
      fallback.confidenceScore,
    priceSeries: normalizePriceSeries(
      firstDefined(payload.priceSeries, payload.price_series, payload.chart, payload.history),
      fallback.priceSeries
    ),
    macdSeries: normalizeSimpleSeries(
      firstDefined(payload.macdSeries, payload.macd_series, payload.macdHistogram, payload.macd),
      fallback.macdSeries
    ),
    rsiSeries: normalizeSimpleSeries(
      firstDefined(payload.rsiSeries, payload.rsi_series, payload.rsi),
      fallback.rsiSeries
    ),
    indicators: normalizeIndicators(payload.indicators, fallback.indicators),
    keyLevels: normalizeKeyLevels(
      firstDefined(payload.keyLevels, payload.key_levels, payload.levels),
      fallback.keyLevels
    ),
    tradePlan: normalizeTradePlan(
      firstDefined(payload.tradePlan, payload.trade_plan, payload.plan),
      fallback.tradePlan
    ),
    bullCase: normalizeScenario(
      firstDefined(
        payload.bullCase,
        payload.bull_case,
        isObject(payload.scenarios) ? payload.scenarios.bull : undefined
      ),
      fallback.bullCase
    ),
    bearCase: normalizeScenario(
      firstDefined(
        payload.bearCase,
        payload.bear_case,
        isObject(payload.scenarios) ? payload.scenarios.bear : undefined
      ),
      fallback.bearCase
    ),
    aiSummary:
      asString(firstDefined(payload.aiSummary, payload.ai_summary, payload.summary)) ??
      fallback.aiSummary,
    executiveSummary:
      asString(firstDefined(payload.executiveSummary, payload.executive_summary)) ??
      fallback.executiveSummary,
    currentSetup:
      asString(firstDefined(payload.currentSetup, payload.current_setup)) ??
      fallback.currentSetup,
    momentumRead:
      asString(firstDefined(payload.momentumRead, payload.momentum_read)) ??
      fallback.momentumRead,
    riskNotes:
      asString(firstDefined(payload.riskNotes, payload.risk_notes)) ??
      fallback.riskNotes,
    reportSections: normalizeReportSections(
      firstDefined(payload.reportSections, payload.report_sections),
      fallback.reportSections
    )
  };
}

export async function fetchLiveAnalysis(
  ticker: string,
  options?: { sessionToken?: string; guestId?: string }
): Promise<FetchAnalysisResult> {
  const normalizedTicker = getAnalysisTicker(ticker);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ANALYZE_API_TIMEOUT_MS);

  try {
    const response = await fetch(ANALYZE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(options?.sessionToken ? { "x-trade-session": options.sessionToken } : {}),
        ...(options?.guestId ? { "x-trade-guest-id": options.guestId } : {})
      },
      body: JSON.stringify({ ticker: normalizedTicker }),
      cache: "no-store",
      signal: controller.signal
    });

    const payload = (await response.json()) as unknown;
    clearTimeout(timeoutId);

    if (!response.ok) {
      const payloadObject = isObject(payload) ? payload : {};

      return {
        analysis: null,
        error:
          asString(firstDefined(payloadObject.error, payloadObject.details)) ??
          `API responded with ${response.status}`,
        isLive: false,
        authRequired: Boolean(payloadObject.authRequired),
        paywallRequired: Boolean(payloadObject.paywallRequired),
        code: asString(payloadObject.code),
        guestUsage: asGuestUsage(payloadObject.guestUsage),
        allowance: asAnalysisAllowance(payloadObject.allowance)
      };
    }

    const payloadObject = isObject(payload) ? payload : {};
    const authObject = isObject(payloadObject.auth) ? payloadObject.auth : undefined;

    return {
      analysis: normalizeAnalysis(normalizedTicker, payload),
      isLive: true,
      user: asAuthUser(authObject?.user) ?? null,
      guestUsage: asGuestUsage(authObject?.guestUsage),
      allowance: asAnalysisAllowance(authObject?.allowance)
    };
  } catch (error) {
    clearTimeout(timeoutId);

    const message =
      error instanceof Error && error.name === "AbortError"
        ? `API timed out after ${ANALYZE_API_TIMEOUT_MS / 1000}s`
        : error instanceof Error
          ? error.message
          : "Unknown API error";

    return {
      analysis: null,
      error: message,
      isLive: false
    };
  }
}
