# trade-analysis

trade-analysis is a premium frontend for an AI-powered stock analysis platform built for active traders and retail investors. It combines a polished marketing site with an interactive analysis dashboard, giving users a structured view of price action, technical indicators, trade plans, key levels, and AI-generated bull/bear scenarios. The project is built with Next.js, TypeScript, Tailwind CSS, Recharts, and Framer Motion, with all market data mocked for a production-style product experience.

## Stack

- Next.js 14+
- TypeScript
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide React
- shadcn/ui-style component architecture

## Features

- Landing page built for retail investors, swing traders, and active traders
- Interactive ticker switching for `HIMS`, `NVDA`, `TSLA`, and `AAPL`
- AI analysis dashboard preview with:
  - Main price chart
  - Supertrend bull and bear lines
  - EMA 21, EMA 55, and 200-day moving average
  - Indicator cards
  - MACD histogram preview
  - RSI line preview
  - Key levels table
  - Trade plan cards
  - Bull and bear case sections
  - AI summary and sample report
- Pricing section and compliance-friendly disclaimers

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local app in your browser:

```text
http://localhost:3000
```

## Project structure

```text
app/
  globals.css
  layout.tsx
  page.tsx
components/
  analysis-dashboard.tsx
  bull-bear-case.tsx
  feature-card.tsx
  footer.tsx
  hero.tsx
  home-page.tsx
  indicator-card.tsx
  key-levels-table.tsx
  price-chart.tsx
  pricing.tsx
  sample-report.tsx
  section-heading.tsx
  ticker-search.tsx
  trade-plan-card.tsx
  ui/
    badge.tsx
    button.tsx
    card.tsx
    input.tsx
data/
  mock-analysis.ts
lib/
  utils.ts
types/
  stock.ts
```

## Notes

- All market data is mocked and structured for easy API replacement later.
- This project intentionally does not include a backend or payment flow.
- The UI is production-style, but the analysis outputs are illustrative and not financial advice.
