import { StockAnalysisData } from "@/types/stock";

export const stockAnalyses: Record<string, StockAnalysisData> = {
  HIMS: {
    symbol: "HIMS",
    companyName: "Hims & Hers Health, Inc.",
    currentPrice: 26.43,
    dailyChangePct: 2.81,
    open: 25.92,
    dayRange: "$25.61 - $26.88",
    fiftyTwoWeekRange: "$11.18 - $36.72",
    marketCap: 5800000000,
    trendBias: "Cautious Buy",
    confidenceScore: 72,
    priceSeries: [
      { label: "Apr 4", price: 22.6, ema21: 23.3, ema55: 24.9, ma200: 38.1, supertrendBull: 22.4, supertrendBear: null },
      { label: "Apr 8", price: 23.1, ema21: 23.5, ema55: 24.7, ma200: 38.0, supertrendBull: 22.7, supertrendBear: null },
      { label: "Apr 12", price: 24.4, ema21: 23.9, ema55: 24.5, ma200: 37.9, supertrendBull: 23.1, supertrendBear: null },
      { label: "Apr 16", price: 25.3, ema21: 24.4, ema55: 24.4, ma200: 37.8, supertrendBull: 23.5, supertrendBear: null },
      { label: "Apr 20", price: 24.8, ema21: 24.7, ema55: 24.3, ma200: 37.7, supertrendBull: 23.8, supertrendBear: null },
      { label: "Apr 24", price: 26.1, ema21: 25.0, ema55: 24.4, ma200: 37.6, supertrendBull: 24.0, supertrendBear: null },
      { label: "Apr 28", price: 25.7, ema21: 25.2, ema55: 24.6, ma200: 37.5, supertrendBull: 24.1, supertrendBear: null },
      { label: "May 2", price: 26.43, ema21: 25.5, ema55: 24.9, ma200: 37.9, supertrendBull: 24.2, supertrendBear: 29.4 }
    ],
    macdSeries: [
      { label: "Apr 4", value: -0.42 },
      { label: "Apr 8", value: -0.21 },
      { label: "Apr 12", value: 0.12 },
      { label: "Apr 16", value: 0.33 },
      { label: "Apr 20", value: 0.24 },
      { label: "Apr 24", value: 0.18 },
      { label: "Apr 28", value: 0.09 },
      { label: "May 2", value: 0.04 }
    ],
    rsiSeries: [
      { label: "Apr 4", value: 43 },
      { label: "Apr 8", value: 46 },
      { label: "Apr 12", value: 51 },
      { label: "Apr 16", value: 56 },
      { label: "Apr 20", value: 54 },
      { label: "Apr 24", value: 53 },
      { label: "Apr 28", value: 50 },
      { label: "May 2", value: 52 }
    ],
    indicators: [
      { name: "Supertrend", value: "Bullish", tone: "bullish", description: "Price is holding above the active supertrend support band." },
      { name: "MACD", value: "Fading", tone: "warning", description: "Momentum remains positive, but histogram strength is cooling." },
      { name: "RSI", value: "Neutral", tone: "neutral", description: "RSI near 52 suggests balanced conditions rather than exhaustion." },
      { name: "EMA Cross", value: "Bullish", tone: "bullish", description: "21 EMA is reclaiming control above the 55 EMA." },
      { name: "Trend Bias", value: "Cautious Buy", tone: "warning", description: "Constructive setup with room to improve if resistance clears." }
    ],
    keyLevels: [
      { label: "Hard resistance", value: "$31.80", context: "Breakout trigger for momentum continuation" },
      { label: "Resistance shelf", value: "$28.60 - $29.20", context: "Near-term supply zone" },
      { label: "Current price", value: "$26.43", context: "Trading above short-term trend support" },
      { label: "Intraday support", value: "$25.40", context: "Must-hold level for short-term structure" },
      { label: "Supertrend bull line", value: "$24.20", context: "Trend guardrail for pullback entries" },
      { label: "Daily support shelf", value: "$23.50 - $24.00", context: "Primary demand area" },
      { label: "Hard stop-loss", value: "$20.50 - $21.00", context: "Invalidation zone for swing thesis" }
    ],
    tradePlan: [
      { label: "Ideal entry zone", range: "$24.00 - $25.50", note: "Wait for pullbacks into trend support or reclaimed intraday bases." },
      { label: "Aggressive entry zone", range: "$26.60 - $27.20", note: "Only on expanding volume and a clean break above resistance shelf." },
      { label: "Stop-loss", range: "$20.50 - $21.00", note: "Keep risk defined below the daily support shelf and failed trend line." },
      { label: "Target 1 swing", range: "$29.00 - $32.00", note: "First scale zone if momentum improves and short-term overhead supply clears." },
      { label: "Target 2 medium term", range: "$35.00 - $38.00", note: "Aligns with the 200-day moving average recovery window." },
      { label: "Target 3 long term", range: "$50.00 - $55.00", note: "Requires a full macro re-rating and trend expansion." }
    ],
    bullCase: {
      title: "Bull Case",
      summary: "The setup improves if HIMS keeps defending the mid-$24 area while buyers build pressure beneath $29 resistance.",
      bullets: [
        "RSI can push into expansion without already being overbought.",
        "A volume-backed break through $29 opens a path toward the 200-day moving average near $38.",
        "Momentum stays constructive if higher lows continue above the supertrend line."
      ]
    },
    bearCase: {
      title: "Bear Case",
      summary: "The risk rises if price loses the supertrend support zone and momentum rolls from neutral into distribution.",
      bullets: [
        "Weakness below $24 increases the odds of revisiting $23.50 support quickly.",
        "Failure to reclaim $28 to $29 may turn the current move into a dead-cat bounce structure.",
        "A decisive loss of $21 invalidates the swing thesis and shifts bias back to defense."
      ]
    },
    aiSummary:
      "HIMS is showing an improving but not fully confirmed rebound profile. The technical posture favors patient accumulation on pullbacks instead of chasing. Momentum is still positive, though MACD has started to fade, so the best risk-adjusted setup comes from entries near support with a predefined invalidation below $21.",
    executiveSummary:
      "HIMS is in a technically constructive recovery phase with improving short-term trend structure, but it has not yet cleared the resistance shelf that would confirm a stronger upside leg.",
    currentSetup:
      "Short-term structure is stabilizing above support while the 21 EMA starts to reclaim leadership. The stock remains below its long-term average, which keeps the thesis tactical rather than fully trend-following.",
    momentumRead:
      "Momentum has recovered from depressed levels and sits near neutral-positive. RSI is balanced, while MACD suggests buyers still have control but less urgency than earlier in the move.",
    riskNotes:
      "Respect the gap between current price and hard invalidation. This setup is better for traders who can scale entries and size positions around defined risk.",
    reportSections: [
      { label: "Executive summary", value: "Constructive rebound with improving structure, but resistance overhead keeps the bias measured." },
      { label: "Current setup", value: "Above trend support, below long-term trend recovery line, and forming a tactical swing window." },
      { label: "Momentum read", value: "RSI 52 and fading MACD support a patient approach rather than aggressive breakout chasing." },
      { label: "Key levels", value: "Support at $23.50 to $24.00, breakout shelf near $29, invalidation under $21." },
      { label: "Trade plan", value: "Accumulate on pullbacks, define risk under support, and scale at $29 to $32 first." },
      { label: "Risk notes", value: "A failed reclaim can trap late buyers; position sizing matters because the stop is wide." }
    ]
  },
  NVDA: {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    currentPrice: 1124.2,
    dailyChangePct: 1.64,
    open: 1108.3,
    dayRange: "$1,108 - $1,129",
    fiftyTwoWeekRange: "$711 - $1,198",
    marketCap: 2760000000000,
    trendBias: "Hold",
    confidenceScore: 78,
    priceSeries: [
      { label: "Apr 4", price: 1022, ema21: 1014, ema55: 988, ma200: 824, supertrendBull: 998, supertrendBear: null },
      { label: "Apr 8", price: 1048, ema21: 1028, ema55: 995, ma200: 829, supertrendBull: 1006, supertrendBear: null },
      { label: "Apr 12", price: 1062, ema21: 1039, ema55: 1003, ma200: 834, supertrendBull: 1018, supertrendBear: null },
      { label: "Apr 16", price: 1089, ema21: 1056, ema55: 1016, ma200: 839, supertrendBull: 1034, supertrendBear: null },
      { label: "Apr 20", price: 1096, ema21: 1070, ema55: 1031, ma200: 844, supertrendBull: 1049, supertrendBear: null },
      { label: "Apr 24", price: 1114, ema21: 1085, ema55: 1049, ma200: 851, supertrendBull: 1066, supertrendBear: null },
      { label: "Apr 28", price: 1108, ema21: 1094, ema55: 1063, ma200: 858, supertrendBull: 1078, supertrendBear: null },
      { label: "May 2", price: 1124.2, ema21: 1103, ema55: 1078, ma200: 864, supertrendBull: 1089, supertrendBear: 1160 }
    ],
    macdSeries: [
      { label: "Apr 4", value: 8 },
      { label: "Apr 8", value: 12 },
      { label: "Apr 12", value: 14 },
      { label: "Apr 16", value: 16 },
      { label: "Apr 20", value: 14 },
      { label: "Apr 24", value: 11 },
      { label: "Apr 28", value: 7 },
      { label: "May 2", value: 6 }
    ],
    rsiSeries: [
      { label: "Apr 4", value: 58 },
      { label: "Apr 8", value: 61 },
      { label: "Apr 12", value: 63 },
      { label: "Apr 16", value: 65 },
      { label: "Apr 20", value: 62 },
      { label: "Apr 24", value: 59 },
      { label: "Apr 28", value: 57 },
      { label: "May 2", value: 60 }
    ],
    indicators: [
      { name: "Supertrend", value: "Bullish", tone: "bullish", description: "Trend remains intact with strong institutional support." },
      { name: "MACD", value: "Rising", tone: "bullish", description: "Momentum has cooled from extremes but remains supportive." },
      { name: "RSI", value: "Neutral", tone: "neutral", description: "Momentum sits in a sustainable zone for trend continuation." },
      { name: "EMA Cross", value: "Bullish", tone: "bullish", description: "Fast averages still lead the tape." },
      { name: "Trend Bias", value: "Hold", tone: "neutral", description: "Trend is strong, but current extension favors disciplined adds." }
    ],
    keyLevels: [
      { label: "Hard resistance", value: "$1,165", context: "Extension zone" },
      { label: "Resistance shelf", value: "$1,145 - $1,152", context: "Near-term overhead supply" },
      { label: "Current price", value: "$1,124", context: "Within trend continuation channel" },
      { label: "Intraday support", value: "$1,108", context: "First defense level" },
      { label: "Supertrend bull line", value: "$1,089", context: "Trend guardrail" },
      { label: "Daily support shelf", value: "$1,060 - $1,075", context: "Ideal reload area" },
      { label: "Hard stop-loss", value: "$1,018", context: "Swing invalidation" }
    ],
    tradePlan: [
      { label: "Ideal entry zone", range: "$1,060 - $1,085", note: "Best pullback location for favorable swing structure." },
      { label: "Aggressive entry zone", range: "$1,145 - $1,152", note: "Breakout continuation entry with volume confirmation." },
      { label: "Stop-loss", range: "$1,018", note: "Protects against failed trend continuation." },
      { label: "Target 1 swing", range: "$1,165 - $1,190", note: "Trend extension zone." },
      { label: "Target 2 medium term", range: "$1,220 - $1,260", note: "Continuation target on AI sector strength." },
      { label: "Target 3 long term", range: "$1,320+", note: "Requires broad market support." }
    ],
    bullCase: {
      title: "Bull Case",
      summary: "Leadership persists if the stock stays above $1,089 and reclaims the upper resistance shelf.",
      bullets: ["Semiconductor leadership remains intact.", "Strong earnings expectations can sustain premium multiples.", "Trend structure remains orderly."]
    },
    bearCase: {
      title: "Bear Case",
      summary: "High expectations create downside air pockets if growth signals weaken.",
      bullets: ["Extension risk remains elevated after multi-quarter momentum.", "Breaks below $1,060 would shift control.", "Macro rotation can hit high-beta leaders fast."]
    },
    aiSummary: "NVDA remains structurally strong, but the current zone is better for disciplined holds or pullback planning than fresh emotional chasing.",
    executiveSummary: "Trend leader with strong internals, though current positioning is less asymmetric than earlier pullbacks.",
    currentSetup: "Trading near the upper part of the recent range with constructive moving-average alignment.",
    momentumRead: "Momentum is healthy and still trend-positive, but not at a fresh acceleration point.",
    riskNotes: "Positioning risk is mostly about entry quality; avoid oversized buys into extended strength.",
    reportSections: [
      { label: "Executive summary", value: "Institutional leadership remains visible, but timing matters." },
      { label: "Current setup", value: "Strong trend, modest extension, and clean pullback references." },
      { label: "Momentum read", value: "Positive and orderly rather than explosive." },
      { label: "Key levels", value: "$1,089 trend line, $1,145 shelf, $1,018 invalidation." },
      { label: "Trade plan", value: "Prefer pullback entries or breakout confirmation with strict sizing." },
      { label: "Risk notes", value: "Premium names punish late entries when market breadth narrows." }
    ]
  },
  TSLA: {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    currentPrice: 176.84,
    dailyChangePct: -1.12,
    open: 178.7,
    dayRange: "$175.96 - $180.14",
    fiftyTwoWeekRange: "$138.80 - $299.29",
    marketCap: 563000000000,
    trendBias: "Sell",
    confidenceScore: 64,
    priceSeries: [
      { label: "Apr 4", price: 186, ema21: 193, ema55: 204, ma200: 223, supertrendBull: null, supertrendBear: 196 },
      { label: "Apr 8", price: 181, ema21: 191, ema55: 202, ma200: 222, supertrendBull: null, supertrendBear: 194 },
      { label: "Apr 12", price: 179, ema21: 188, ema55: 199, ma200: 221, supertrendBull: null, supertrendBear: 191 },
      { label: "Apr 16", price: 174, ema21: 185, ema55: 197, ma200: 220, supertrendBull: null, supertrendBear: 188 },
      { label: "Apr 20", price: 171, ema21: 182, ema55: 194, ma200: 219, supertrendBull: null, supertrendBear: 186 },
      { label: "Apr 24", price: 177, ema21: 180, ema55: 191, ma200: 218, supertrendBull: null, supertrendBear: 184 },
      { label: "Apr 28", price: 179, ema21: 179, ema55: 189, ma200: 217, supertrendBull: null, supertrendBear: 182 },
      { label: "May 2", price: 176.84, ema21: 178, ema55: 187, ma200: 216, supertrendBull: 168, supertrendBear: 181 }
    ],
    macdSeries: [
      { label: "Apr 4", value: -6 },
      { label: "Apr 8", value: -5 },
      { label: "Apr 12", value: -4.2 },
      { label: "Apr 16", value: -3.6 },
      { label: "Apr 20", value: -4.1 },
      { label: "Apr 24", value: -2.2 },
      { label: "Apr 28", value: -1.1 },
      { label: "May 2", value: -1.8 }
    ],
    rsiSeries: [
      { label: "Apr 4", value: 39 },
      { label: "Apr 8", value: 37 },
      { label: "Apr 12", value: 36 },
      { label: "Apr 16", value: 34 },
      { label: "Apr 20", value: 33 },
      { label: "Apr 24", value: 41 },
      { label: "Apr 28", value: 45 },
      { label: "May 2", value: 42 }
    ],
    indicators: [
      { name: "Supertrend", value: "Warning", tone: "warning", description: "Recovery attempts are not yet enough to fully repair trend damage." },
      { name: "MACD", value: "Bearish", tone: "bearish", description: "Momentum remains fragile and prone to rollover." },
      { name: "RSI", value: "Neutral", tone: "neutral", description: "Not oversold enough to call a durable base." },
      { name: "EMA Cross", value: "Bearish", tone: "bearish", description: "Fast trend remains below medium-term structure." },
      { name: "Trend Bias", value: "Sell", tone: "bearish", description: "Risk still outweighs reward until major repair levels reclaim." }
    ],
    keyLevels: [
      { label: "Hard resistance", value: "$188", context: "Major reclaim threshold" },
      { label: "Resistance shelf", value: "$181 - $183", context: "Near-term seller zone" },
      { label: "Current price", value: "$176.84", context: "Testing weak recovery range" },
      { label: "Intraday support", value: "$174.20", context: "Immediate defense level" },
      { label: "Supertrend bull line", value: "$168", context: "Support only if recovery persists" },
      { label: "Daily support shelf", value: "$162 - $165", context: "Last major demand band" },
      { label: "Hard stop-loss", value: "$158", context: "Breakdown continuation trigger" }
    ],
    tradePlan: [
      { label: "Ideal entry zone", range: "$163 - $168", note: "Only for tactical bounce traders." },
      { label: "Aggressive entry zone", range: "$183 - $188", note: "Requires structural reclaim and momentum confirmation." },
      { label: "Stop-loss", range: "$158", note: "Tight invalidation for rebound attempts." },
      { label: "Target 1 swing", range: "$188 - $194", note: "First recovery objective." },
      { label: "Target 2 medium term", range: "$204 - $210", note: "Requires trend repair." },
      { label: "Target 3 long term", range: "$228+", note: "Only on full sentiment reset." }
    ],
    bullCase: {
      title: "Bull Case",
      summary: "TSLA can stabilize if buyers defend the mid-$160s and rebuild above the EMA cluster.",
      bullets: ["Volatility can reward tight tactical entries.", "Short covering can accelerate a reclaim move.", "A macro risk-on tape helps beta names rebound."]
    },
    bearCase: {
      title: "Bear Case",
      summary: "The stock remains vulnerable if rallies keep failing into overhead resistance.",
      bullets: ["Lower highs still define the structure.", "Weak momentum can drag price back into support quickly.", "A break of $158 reopens trend continuation lower."]
    },
    aiSummary: "TSLA is a higher-risk tactical setup. Traders need cleaner confirmation before treating it as a dependable swing long.",
    executiveSummary: "Rebound attempts are underway, but the broader trend remains damaged.",
    currentSetup: "Below major moving averages with fragile recovery momentum.",
    momentumRead: "Momentum has improved from oversold conditions but is still not convincingly bullish.",
    riskNotes: "Expect wide intraday movement and fast sentiment shifts.",
    reportSections: [
      { label: "Executive summary", value: "Tactical only until real trend repair arrives." },
      { label: "Current setup", value: "Weak recovery under overhead supply." },
      { label: "Momentum read", value: "Improved from lows, but not enough for conviction." },
      { label: "Key levels", value: "$163 support, $183 reclaim, $158 invalidation." },
      { label: "Trade plan", value: "Favor patience and strict risk rules." },
      { label: "Risk notes", value: "High-beta behavior can invalidate setups quickly." }
    ]
  },
  AAPL: {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 193.14,
    dailyChangePct: 0.68,
    open: 191.92,
    dayRange: "$191.44 - $193.88",
    fiftyTwoWeekRange: "$164.08 - $199.62",
    marketCap: 2980000000000,
    trendBias: "Hold",
    confidenceScore: 74,
    priceSeries: [
      { label: "Apr 4", price: 184, ema21: 183, ema55: 181, ma200: 186, supertrendBull: 181, supertrendBear: null },
      { label: "Apr 8", price: 185.4, ema21: 183.4, ema55: 181.6, ma200: 186.1, supertrendBull: 181.6, supertrendBear: null },
      { label: "Apr 12", price: 187.8, ema21: 184.3, ema55: 182.4, ma200: 186.2, supertrendBull: 182.7, supertrendBear: null },
      { label: "Apr 16", price: 189.2, ema21: 185.7, ema55: 183.5, ma200: 186.3, supertrendBull: 184.0, supertrendBear: null },
      { label: "Apr 20", price: 188.6, ema21: 186.6, ema55: 184.4, ma200: 186.4, supertrendBull: 184.8, supertrendBear: null },
      { label: "Apr 24", price: 191.1, ema21: 187.8, ema55: 185.5, ma200: 186.5, supertrendBull: 185.7, supertrendBear: null },
      { label: "Apr 28", price: 192.2, ema21: 189.0, ema55: 186.6, ma200: 186.7, supertrendBull: 186.9, supertrendBear: null },
      { label: "May 2", price: 193.14, ema21: 190.2, ema55: 187.7, ma200: 186.9, supertrendBull: 188.0, supertrendBear: 196.5 }
    ],
    macdSeries: [
      { label: "Apr 4", value: 0.8 },
      { label: "Apr 8", value: 1.1 },
      { label: "Apr 12", value: 1.6 },
      { label: "Apr 16", value: 1.8 },
      { label: "Apr 20", value: 1.5 },
      { label: "Apr 24", value: 1.3 },
      { label: "Apr 28", value: 1.1 },
      { label: "May 2", value: 1.0 }
    ],
    rsiSeries: [
      { label: "Apr 4", value: 51 },
      { label: "Apr 8", value: 54 },
      { label: "Apr 12", value: 58 },
      { label: "Apr 16", value: 60 },
      { label: "Apr 20", value: 57 },
      { label: "Apr 24", value: 59 },
      { label: "Apr 28", value: 61 },
      { label: "May 2", value: 60 }
    ],
    indicators: [
      { name: "Supertrend", value: "Bullish", tone: "bullish", description: "Trend support remains intact." },
      { name: "MACD", value: "Rising", tone: "bullish", description: "Momentum remains supportive though not explosive." },
      { name: "RSI", value: "Neutral", tone: "neutral", description: "Healthy momentum without immediate exhaustion." },
      { name: "EMA Cross", value: "Bullish", tone: "bullish", description: "Fast averages remain aligned." },
      { name: "Trend Bias", value: "Hold", tone: "neutral", description: "Strong quality setup, but upside is more incremental here." }
    ],
    keyLevels: [
      { label: "Hard resistance", value: "$196.50", context: "Upper range breakout" },
      { label: "Resistance shelf", value: "$194.20 - $195.00", context: "Immediate overhead zone" },
      { label: "Current price", value: "$193.14", context: "Near recent highs" },
      { label: "Intraday support", value: "$191.80", context: "First demand shelf" },
      { label: "Supertrend bull line", value: "$188.00", context: "Trend line support" },
      { label: "Daily support shelf", value: "$186.20 - $187.20", context: "Preferred reload band" },
      { label: "Hard stop-loss", value: "$183.80", context: "Invalidation" }
    ],
    tradePlan: [
      { label: "Ideal entry zone", range: "$186.20 - $188.50", note: "Best risk-adjusted adds." },
      { label: "Aggressive entry zone", range: "$194.20 - $196.50", note: "Only if range expansion confirms." },
      { label: "Stop-loss", range: "$183.80", note: "Risk boundary for tactical swing entries." },
      { label: "Target 1 swing", range: "$198 - $202", note: "First continuation band." },
      { label: "Target 2 medium term", range: "$206 - $210", note: "Requires sustained trend support." },
      { label: "Target 3 long term", range: "$220+", note: "Longer-term continuation scenario." }
    ],
    bullCase: {
      title: "Bull Case",
      summary: "AAPL remains one of the cleaner large-cap trend structures if it keeps respecting the high-$180s.",
      bullets: ["Quality leadership supports calmer swing structures.", "Trend support is clearly defined.", "Breakouts can grind rather than spike, which helps execution."]
    },
    bearCase: {
      title: "Bear Case",
      summary: "Near highs, upside can compress if the stock fails to push through the upper shelf.",
      bullets: ["A failed breakout can drag price back into the reload zone.", "Momentum is healthy but not stretched enough to force continuation.", "Broad market weakness would likely slow the tape first rather than trigger instant breakdowns."]
    },
    aiSummary: "AAPL offers a cleaner quality-trend profile than many momentum names, but the current reward improves meaningfully on measured pullbacks rather than immediate chasing.",
    executiveSummary: "Stable large-cap trend with clearly defined support and moderate continuation potential.",
    currentSetup: "Price is near the top of its recent range while trend support remains orderly underneath.",
    momentumRead: "Momentum is healthy and stable, without signaling either panic or euphoric extension.",
    riskNotes: "Execution edge comes from patience more than aggression.",
    reportSections: [
      { label: "Executive summary", value: "High-quality trend structure with manageable volatility." },
      { label: "Current setup", value: "Near highs, above support, and suitable for measured planning." },
      { label: "Momentum read", value: "Supportive but not urgent." },
      { label: "Key levels", value: "$188 trend support, $195 shelf, $183.80 invalidation." },
      { label: "Trade plan", value: "Prefer pullback adds or confirmed range expansion." },
      { label: "Risk notes", value: "Expect lower drama but smaller tactical dislocations than high-beta names." }
    ]
  }
};

export const featuredSymbols = Object.keys(stockAnalyses);

export function getFallbackAnalysis(ticker?: string) {
  const normalized = getAnalysisTicker(ticker);
  const existing = stockAnalyses[normalized];

  if (existing) {
    return existing;
  }

  return {
    ...stockAnalyses.NVDA,
    symbol: normalized,
    companyName: `${normalized} analysis pending live data`,
    aiSummary: `Waiting for live backend analysis for ${normalized}.`,
    executiveSummary: `Live analysis for ${normalized} is not available yet, so this dashboard is holding a neutral fallback shell.`,
    currentSetup: `The dashboard is ready to display the live technical setup for ${normalized} as soon as the analysis service responds.`,
    momentumRead: `Momentum and indicator readings will appear here once the backend returns data for ${normalized}.`,
    riskNotes: `Use this view as a placeholder until live analysis is available for ${normalized}.`,
    reportSections: [
      {
        label: "Status",
        value: `Live analysis for ${normalized} is pending.`
      }
    ]
  };
}

export function getAnalysisTicker(ticker?: string) {
  const normalized = ticker?.trim().toUpperCase();

  if (normalized && /^[A-Z.\-]{1,10}$/.test(normalized)) {
    return normalized;
  }

  return "NVDA";
}

export function normalizeAnalysisTicker(ticker?: string) {
  const normalized = ticker?.trim().toUpperCase();

  if (normalized && /^[A-Z.\-]{1,10}$/.test(normalized)) {
    return normalized;
  }

  return "";
}
