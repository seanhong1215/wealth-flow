import { NextResponse } from "next/server";
import { fetchMarketData, hasMassiveKey } from "@/lib/massive";
import { watchSymbols } from "@/lib/wealth-data";

export async function GET() {
  const data = await fetchMarketData(watchSymbols);

  return NextResponse.json({
    provider: "Massive.com",
    configured: hasMassiveKey(),
    updatedAt: new Date().toISOString(),
    data
  });
}
