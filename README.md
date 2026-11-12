# Stock Screener

**Christopher Tang · FOPL Sprint 2, portfolio edition**

A stock dashboard for inspecting individual tickers, historical closing prices and company metrics, with a small random-forest forecasting experiment. It runs immediately with deterministic **synthetic demo data**, so no account or API key is required to explore the interface.

## Features

- Ticker lookup, price chart and key company metrics.
- Optional Finnhub quotes, financial metrics and daily candles using a server-only key.
- A one-step random-forest estimate based on the previous closing price.
- Clear loading, error and unavailable-data states.
- Synthetic data visibly labeled throughout the demo.

Despite the project name, this version is a **single-ticker dashboard**. Multi-stock filters, ranking and portfolio management are not implemented.

## Quick start

Use Node.js 22+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000, enter a ticker (for example `AAPL`) and select **Look up ticker**. Demo data is generated locally and is not downloaded market history. Synthetic daily dates include weekends.

## Optional live mode

In your untracked `.env.local`, set `STOCK_DATA_MODE=live` and supply your own `FINNHUB_API_KEY`. Restart the development server. The key is sent only from server code in a request header. Never prefix it with `NEXT_PUBLIC_`.

Live mode uses Finnhub’s `/quote`, `/stock/metric`, `/stock/candle` and `/search` endpoints. Availability, delays and historical-candle access depend on your provider plan. When history is unavailable, the dashboard still shows available quotes/metrics and explains why there is no chart or prediction. Live provider calls were not tested with a real credential in the portfolio preparation.

## Structure

```text
src/app/                 Page, layout, styles and server API routes
src/components/          Accessible SVG price chart
src/lib/market-data.ts   Provider adapter and ticker validation
src/lib/demo.ts          Deterministic synthetic dataset
src/lib/prediction.ts    One-step random-forest experiment
src/lib/types.ts         Shared response types
tests/                   Model, input and configuration checks
docs/origin.md           Original project and cleanup notes
.env.example             Placeholder-only configuration
```

`GET /api/stock/AAPL` returns quote, metrics, history, prediction, source and availability notes. `GET /api/search?query=AA` returns matching symbols. Search is exposed as an API; the interface accepts tickers directly.

## Model and limitations

For a series of closing prices, training examples are `[close(t−1)] → close(t)`. A 100-tree random forest (seed 42) predicts from the latest close. It estimates the **next observation**, not a one-month return. The chart places this estimate after the observed samples without inventing a future trading date.

There is no time-based holdout, transaction-cost model, uncertainty interval or evidence that this beats a last-price baseline. Estimates are educational and are not investment advice. Charts use equal observation spacing rather than calendar-time spacing. Market capitalization and average trading volume retain the provider’s million-unit conventions. Missing metrics appear as unavailable.

## Verify and build

```sh
npm test
npm run typecheck
npm run build
npm start
```

Before exposing live mode publicly, add authentication, request rate limits and appropriate monitoring; otherwise visitors can consume your data-provider quota. This repository does not include a paid service account or production deployment.

## Origin and attribution

Extracted from Christopher Tang’s FOPL stock project. The original HeroUI starter license remains in `LICENSE`; unused template pages and UI dependencies were removed. The portfolio edition separates data access, modeling and presentation, removes hardcoded keys, and corrects the original prediction input/horizon. See [origin notes](docs/origin.md).
