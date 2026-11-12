export type PricePoint = { date: string; close: number };
export type StockData = {
  ticker: string;
  source: "synthetic" | "finnhub";
  quote: { currentPrice: number; priceChangePercentage: number };
  info: { marketCap: number | null; pe: number | null; eps: number | null; dividendYield: number | null; averageVolume: number | null };
  historical: PricePoint[];
  prediction: number | null;
  historyNote?: string;
};
