import type { PricePoint } from "@/lib/types";
export function PriceChart({ points, prediction }: { points: PricePoint[]; prediction: number | null }) {
  if (points.length < 2) return <p>At least two historical samples are needed for the chart.</p>;
  const prices = [...points.map(p => p.close), ...(prediction === null ? [] : [prediction])];
  const min = Math.min(...prices), range = Math.max(...prices) - min || 1;
  const count = prices.length - 1;
  const x = (i: number) => 65 + i / count * 790;
  const y = (value: number) => 225 - (value - min) / range * 180;
  const path = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.close)}`).join(" ");
  return <figure><svg viewBox="0 0 920 280" role="img" aria-label={`Closing price history from ${points[0].date} to ${points.at(-1)!.date}; ${prediction === null ? "no prediction" : "one-step model estimate shown as a separate orange dot"}`}>
    {[0, 0.5, 1].map(t => <g key={t}><line x1="65" x2="870" y1={225-t*180} y2={225-t*180} stroke="#dbe4e4"/><text x="5" y={230-t*180} fontSize="12" fill="#607073">${(min+t*range).toFixed(0)}</text></g>)}
    <path d={path} fill="none" stroke="#087f74" strokeWidth="3"/>
    {prediction !== null && <circle cx={x(prices.length-1)} cy={y(prediction)} r="6" fill="#dc7b2d"/>}
    <text x="65" y="265" fontSize="12" fill="#607073">{points[0].date}</text><text x="870" y="265" textAnchor="end" fontSize="12" fill="#607073">{points.at(-1)!.date}{prediction !== null ? " → next observation" : ""}</text>
  </svg><figcaption>Closing prices · orange dot: one-step model estimate. Horizontal spacing is by observation, not elapsed calendar time.</figcaption></figure>;
}
