"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SyncPricesButton } from "./actions";

export type MarketRow = {
  symbol: string;
  dataSymbol: string;
  name: string;
  market: string;
  price: number | null;
  changePercent: number | null;
  ytdReturn: number | null;
  expenseRatio: string;
  assetClass: string;
  currency: string;
  source: "massive" | "unavailable";
  error?: string;
  note?: string;
};

export function MarketTable({ onSelect }: { onSelect?: (row: MarketRow) => void }) {
  const [rows, setRows] = useState<MarketRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch("/api/market");
        if (!response.ok) throw new Error("資料暫時無法更新");
        const payload = await response.json();
        setRows(payload.data);
      } catch (event) {
        setError(event instanceof Error ? event.message : "讀取失敗");
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
    window.addEventListener("wealthflow:market-sync", load);
    return () => window.removeEventListener("wealthflow:market-sync", load);
  }, [load]);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <h3 className="font-semibold">ETF 觀察清單</h3>
        <SyncPricesButton />
      </div>
      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          目前無法更新價格。
          <Button className="ml-3 h-9 px-3" onClick={load}>重試</Button>
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr>
              {["代號", "名稱", "市場", "價格", "1D 漲跌", "YTD 報酬", "費用率", "資產類別", "操作"].map((head) => (
                <th key={head} className="px-5 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-8 text-muted-foreground" colSpan={9}>資料更新中...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-5 py-8 text-muted-foreground" colSpan={9}>尚未加入任何 ETF 觀察標的。</td></tr>
            ) : rows.map((item) => (
              <Fragment key={item.symbol}>
                <tr className="border-t border-border hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold">{item.symbol}</td>
                  <td className="px-5 py-4">{item.name}</td>
                  <td className="px-5 py-4">{item.market}</td>
                  <td className="px-5 py-4 font-medium">{formatPrice(item)}</td>
                  <td className="px-5 py-4 font-semibold">{formatPercent(item.changePercent)}</td>
                  <td className="px-5 py-4">{formatPercent(item.ytdReturn)}</td>
                  <td className="px-5 py-4">{item.expenseRatio}</td>
                  <td className="px-5 py-4">{item.assetClass}</td>
                  <td className="px-5 py-4">
                    <Button
                      className="h-10 px-3"
                      onClick={() =>
                        onSelect?.(item)
                      }
                    >
                      查看詳情
                    </Button>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function formatPrice(item: MarketRow) {
  if (item.price === null) return "-";
  const prefix = item.currency === "TWD" ? "NT$" : "$";
  return `${prefix}${item.price.toFixed(2)}`;
}

function formatPercent(value: number | null) {
  if (value === null) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
