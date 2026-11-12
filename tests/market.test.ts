import test from "node:test";
import assert from "node:assert/strict";
import { normalizeTicker, getStock } from "../src/lib/market-data";
import { demoStock } from "../src/lib/demo";
import { predictNextClose } from "../src/lib/prediction";

test("ticker normalization rejects URLs and malformed symbols", () => {
  assert.equal(normalizeTicker(" brk.b "), "BRK.B");
  assert.equal(normalizeTicker("https://localhost"), null);
  assert.equal(normalizeTicker("../secret"), null);
});
test("demo is deterministic and needs no key", async () => {
  process.env.STOCK_DATA_MODE = "demo";
  delete process.env.FINNHUB_API_KEY;
  assert.deepEqual(await getStock("AAPL"), demoStock("AAPL"));
  assert.equal((await getStock("AAPL")).source, "synthetic");
});
test("prediction handles missing data and uses latest close", () => {
  assert.equal(predictNextClose([]), null);
  const points = Array.from({length: 50}, (_, i) => ({date: String(i), close: i === 49 ? 100 : 100 + i}));
  // The latest close resets to 100; using the penultimate 148 would give a different result.
  assert.ok(predictNextClose(points)! < 110);
});
test("live mode fails clearly without credentials", async () => {
  process.env.STOCK_DATA_MODE = "live";
  delete process.env.FINNHUB_API_KEY;
  await assert.rejects(getStock("AAPL"), /FINNHUB_API_KEY/);
  process.env.STOCK_DATA_MODE = "demo";
});
