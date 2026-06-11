"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SummaryTile, Ticker } from "@/components/wealth/primitives";
import { MarketRow, MarketTable } from "./market-table";

const fallback: MarketRow = {
  symbol: "CSPX",
  dataSymbol: "IVV",
  name: "iShares Core S&P 500 UCITS ETF",
  market: "LSE proxy",
  price: null,
  changePercent: null,
  ytdReturn: null,
  expenseRatio: "0.07%",
  assetClass: "美國股票",
  currency: "USD",
  source: "unavailable"
};

export function WatchlistClient() {
  const [selected, setSelected] = useState<MarketRow | null>(fallback);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selected) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSelected(null);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selected]);

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <MarketTable onSelect={(row) => setSelected(row)} />
      <Card className="hidden p-5 xl:block">
        <DetailContent row={selected ?? fallback} onClose={() => setSelected(null)} closeRef={closeRef} />
      </Card>
      {selected ? (
        <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 xl:hidden" role="presentation">
          <Card role="dialog" aria-modal="true" aria-labelledby="etf-detail-title" className="ml-auto h-full w-full max-w-sm overflow-y-auto p-5 shadow-panel">
            <DetailContent row={selected} onClose={() => setSelected(null)} closeRef={closeRef} />
          </Card>
        </div>
      ) : null}
    </div>
  );
}

function DetailContent({ row, onClose, closeRef }: { row: MarketRow; onClose: () => void; closeRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">ETF Detail Drawer</p>
          <h3 id="etf-detail-title" className="text-xl font-semibold">{row.symbol}</h3>
          <p className="text-sm text-muted-foreground">{row.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Ticker symbol={row.symbol} />
          <button ref={closeRef} className="xl:hidden" onClick={onClose} aria-label="關閉 ETF 詳情">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="flex h-28 items-end gap-1 rounded-lg border border-border bg-slate-50 p-3">
        {[32, 44, 38, 51, 49, 63, 71, 69, 78, 85, 82, 92].map((value, index) => (
          <div key={index} className="flex flex-1 items-end"><div className="w-full rounded-t-sm bg-primary" style={{ height: `${value}px` }} /></div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <SummaryTile label="價格" value={row.price === null ? "-" : `${row.currency === "TWD" ? "NT$" : "$"}${row.price.toFixed(2)}`} />
        <SummaryTile label="1D 漲跌" value={row.changePercent === null ? "-" : `${row.changePercent.toFixed(2)}%`} />
        <SummaryTile label="費用率" value={row.expenseRatio} />
        <SummaryTile label="風險等級" value={row.assetClass.includes("債") ? "中低" : "中高"} />
        <SummaryTile label="主要持股" value={row.assetClass.includes("債") ? "短天期債券" : "大型股票"} />
        <SummaryTile label="資料來源" value={row.source === "massive" ? "Massive" : "待同步"} />
      </div>
      <Button className="mt-5 w-full" variant="primary" onClick={() => alert(`${row.symbol} 已加入投資組合。`)}>加入投資組合</Button>
    </>
  );
}
