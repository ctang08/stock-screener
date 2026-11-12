import { NextResponse } from "next/server";
import { getStock, normalizeTicker } from "@/lib/market-data";
export async function GET(_request: Request, { params }: { params: Promise<{ ticker: string }> }) {
  const ticker = normalizeTicker((await params).ticker);
  if (!ticker) return NextResponse.json({ error: "Enter a valid ticker (letters, numbers, periods or hyphens)." }, { status: 400 });
  try { return NextResponse.json(await getStock(ticker)); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load market data." }, { status: 502 }); }
}
