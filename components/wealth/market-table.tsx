"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TableHeader } from "./primitives";

type MarketRow = {
  symbol: string;
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
};

export function MarketTable() {
  const [rows, setRows] = useState<MarketRow[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/market");
        if (!response.ok) throw new Error(`API 回應 ${response.status}`);
        const payload = await response.json();
        setRows(payload.data);
        setConfigured(payload.configured);
      } catch (event) {
        setError(event instanceof Error ? event.message : "讀取失敗");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Card className="overflow-hidden">
      <TableHeader title="Massive.com 真實資料觀察清單" action="新增 ETF" />
      {!configured ? (
        <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-900">
          尚未設定 `MASSIVE_API_KEY`。請建立 `.env.local` 並填入 Massive 免費 API key，重新啟動 dev server 後即可讀取真實資料。
        </div>
      ) : null}
      {error ? (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700">
          無法讀取 Massive API：{error}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr>
              {["代號", "名稱", "市場", "價格", "1D 漲跌", "YTD 報酬", "費用率", "資產類別", "狀態"].map((head) => (
                <th key={head} className="px-5 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-5 py-8 text-muted-foreground" colSpan={9}>正在同步 Massive.com 資料...</td></tr>
            ) : rows.map((item) => (
              <tr key={item.symbol} className="border-t border-border">
                <td className="px-5 py-4 font-semibold">{item.symbol}</td>
                <td className="px-5 py-4">{item.name}</td>
                <td className="px-5 py-4">{item.market}</td>
                <td className="px-5 py-4 font-medium">{formatPrice(item)}</td>
                <td className="px-5 py-4 font-semibold">{formatPercent(item.changePercent)}</td>
                <td className="px-5 py-4">{formatPercent(item.ytdReturn)}</td>
                <td className="px-5 py-4">{item.expenseRatio}</td>
                <td className="px-5 py-4">{item.assetClass}</td>
                <td className="px-5 py-4">
                  <Button className="h-8 px-3">{item.source === "massive" ? "已同步" : "需設定"}</Button>
                </td>
              </tr>
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
