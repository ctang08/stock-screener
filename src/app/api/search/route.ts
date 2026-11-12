import { NextResponse } from "next/server";
import { searchSymbols } from "@/lib/market-data";
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("query")?.trim() || "";
  if (!query || query.length > 60) return NextResponse.json({ error: "Enter a search between 1 and 60 characters." }, { status: 400 });
  try { return NextResponse.json(await searchSymbols(query)); }
  catch { return NextResponse.json({ error: "Symbol search is unavailable." }, { status: 502 }); }
}
