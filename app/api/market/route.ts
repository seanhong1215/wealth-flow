import { NextResponse } from "next/server";
import { fetchMarketData } from "@/lib/massive";
import { watchSymbols } from "@/lib/wealth-data";

export async function GET() {
  const data = await fetchMarketData(watchSymbols);

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    data
  });
}
