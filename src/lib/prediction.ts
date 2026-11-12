import { RandomForestRegression } from "ml-random-forest";
import type { PricePoint } from "./types";

/** One-step experiment: previous close -> next observed close. No backtest. */
export function predictNextClose(history: PricePoint[]): number | null {
  if (history.length < 30 || history.some(p => !Number.isFinite(p.close) || p.close <= 0)) return null;
  const x = history.slice(0, -1).map(p => [p.close]);
  const y = history.slice(1).map(p => p.close);
  const model = new RandomForestRegression({ nEstimators: 100, seed: 42, maxFeatures: 1, replacement: true });
  model.train(x, y);
  const result = model.predict([[history[history.length - 1].close]])[0];
  return Number.isFinite(result) ? result : null;
}
