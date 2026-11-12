import type { StockData } from "./types";
import { demoStock } from "./demo";
import { predictNextClose } from "./prediction";

export function normalizeTicker(value: string): string | null {
  const ticker = value.trim().toUpperCase();
  return /^[A-Z][A-Z0-9.-]{0,14}$/.test(ticker) ? ticker : null;
}
const numberOrNull = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null;

async function finnhub(endpoint: string, params: Record<string, string>) {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) throw new Error("Live mode requires FINNHUB_API_KEY in .env.local.");
  const url = new URL(`https://finnhub.io/api/v1/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  // Credentials stay in a server-side header, never a URL or client bundle.
  const response = await fetch(url, { headers: { "X-Finnhub-Token": key }, signal: AbortSignal.timeout(10000), cache: "no-store" });
  if (!response.ok) throw new Error(response.status === 429 ? "Market provider rate limit reached. Try again later." : "Market provider request failed. Check your account access.");
  const data = await response.json();
  if (data.error) throw new Error("Market provider rejected the request.");
  return data;
}

export async function getStock(ticker: string): Promise<StockData> {
  if (process.env.STOCK_DATA_MODE !== "live") return demoStock(ticker);
  const [quote, metrics] = await Promise.all([finnhub("quote", { symbol: ticker }), finnhub("stock/metric", { symbol: ticker, metric: "all" })]);
  if (!Number.isFinite(quote.c) || quote.c <= 0) throw new Error("No quote was found for this symbol.");
  let historical: StockData["historical"] = [];
  let historyNote: string | undefined;
  try {
    const end = Math.floor(Date.now() / 1000);
    const candles = await finnhub("stock/candle", { symbol: ticker, resolution: "D", from: String(end - 180 * 86400), to: String(end) });
    if (candles.s === "ok" && Array.isArray(candles.t) && Array.isArray(candles.c)) {
      historical = candles.t.map((time: number, i: number) => ({ date: new Date(time * 1000).toISOString().slice(0, 10), close: candles.c[i] })).filter((p: {close: number}) => Number.isFinite(p.close) && p.close > 0);
    }
    if (!historical.length) historyNote = "No historical candles were returned for this symbol.";
  } catch {
    historyNote = "Historical candles are unavailable; your data plan may not include this endpoint. Quotes and metrics can still be viewed.";
  }
  const m = metrics.metric || {};
  return { ticker, source: "finnhub", historical, historyNote,
    quote: { currentPrice: quote.c, priceChangePercentage: numberOrNull(quote.dp) ?? 0 },
    info: { marketCap: numberOrNull(m.marketCapitalization), pe: numberOrNull(m.peTTM), eps: numberOrNull(m.epsTTM), dividendYield: numberOrNull(m.dividendYieldIndicatedAnnual), averageVolume: numberOrNull(m["10DayAverageTradingVolume"]) },
    prediction: predictNextClose(historical),
  };
}

export async function searchSymbols(query: string) {
  if (process.env.STOCK_DATA_MODE !== "live") return ["AAPL", "MSFT", "GOOGL", "NVDA", "TSLA"].filter(s => s.includes(query.toUpperCase())).map(symbol => ({ symbol, description: "Synthetic demo symbol" }));
  const result = await finnhub("search", { q: query });
  return (result.result || []).slice(0, 10).map((item: { displaySymbol: string; description: string }) => ({ symbol: item.displaySymbol, description: item.description }));
}
