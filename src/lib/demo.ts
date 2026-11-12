import type { StockData } from "./types";
import { predictNextClose } from "./prediction";

export function demoStock(ticker: string): StockData {
  const offset = [...ticker].reduce((total, c) => total + c.charCodeAt(0), 0) % 60;
  const historical = Array.from({ length: 120 }, (_, i) => ({
    date: new Date(Date.UTC(2025, 0, 1 + i)).toISOString().slice(0, 10),
    close: Math.round((80 + offset + i * 0.12 + 5 * Math.sin(i / 8) + 1.7 * Math.cos(i / 3)) * 100) / 100,
  }));
  const currentPrice = historical.at(-1)!.close;
  const previous = historical.at(-2)!.close;
  return { ticker, source: "synthetic", historical,
    quote: { currentPrice, priceChangePercentage: (currentPrice / previous - 1) * 100 },
    info: { marketCap: 15000 + offset * 100, pe: 24.3, eps: 4.2, dividendYield: 1.2, averageVolume: 12.5 },
    prediction: predictNextClose(historical),
    historyNote: "Illustrative daily samples include weekends; these are not exchange records.",
  };
}
