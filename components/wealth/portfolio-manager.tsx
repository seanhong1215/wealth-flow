"use client";

import { useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { allocations, holdings as seedHoldings } from "@/lib/wealth-data";
import { EmptyState, KpiCard, ProgressBar } from "./primitives";

type Holding = {
  etf: string;
  name: string;
  asset: string;
  shares: number;
  avg: number;
  current: number;
  target: number;
  currency: string;
};

const draftHolding: Holding = {
  etf: "AGGU",
  name: "iShares Global Aggregate Bond UCITS ETF",
  asset: "全球債券",
  shares: 25,
  avg: 5.1,
  current: 3,
  target: 5,
  currency: "USD"
};

export function PortfolioManager() {
  const [rows, setRows] = useState<Holding[]>(seedHoldings);
  const [editing, setEditing] = useState("");
  const [message, setMessage] = useState("");
  const summary = useMemo(() => {
    const totalCost = rows.reduce((sum, item) => sum + item.shares * item.avg, 0);
    return {
      marketValue: totalCost * 1.148,
      totalCost,
      gain: totalCost * 0.148,
      dividend: totalCost * 0.027
    };
  }, [rows]);

  function addHolding() {
    setRows((current) => current.some((item) => item.etf === draftHolding.etf) ? current : [...current, draftHolding]);
    setMessage("持倉已新增。");
  }

  function editHolding(symbol: string) {
    setRows((current) => current.map((item) => item.etf === symbol ? { ...item, target: Math.min(item.target + 1, 80), shares: Number((item.shares + 1).toFixed(2)) } : item));
    setEditing(symbol);
    setMessage(`${symbol} 已更新股數與目標配置。`);
  }

  function deleteHolding(symbol: string) {
    setRows((current) => current.filter((item) => item.etf !== symbol));
    setMessage(`${symbol} 已刪除。`);
  }

  function resetHoldings() {
    setRows(seedHoldings);
    setMessage("已還原範例持倉。");
  }

  function clearHoldings() {
    setRows([]);
    setMessage("所有持倉已清空。");
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="市場價值" value={formatCurrency(summary.marketValue)} trend="+8.4%" note="依 Massive 價格同步後估算" />
        <KpiCard label="總成本" value={formatCurrency(summary.totalCost)} trend="+$5,000" note="今年新增投入" />
        <KpiCard label="未實現損益" value={formatCurrency(summary.gain)} trend="+14.8%" note="未含股息稅費" />
        <KpiCard label="預估年度股息" value={formatCurrency(summary.dividend)} trend="2.7%" note="以近 12 個月殖利率估算" />
      </div>
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold">持倉明細</h3>
            {message ? <p className="mt-1 text-sm text-success" role="status">{message}</p> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2" variant="primary" onClick={addHolding}>
              <Plus className="h-4 w-4" />
              新增持倉
            </Button>
            <Button onClick={clearHoldings}>清空持倉</Button>
            <Button onClick={resetHoldings}>還原範例</Button>
          </div>
        </div>
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-slate-50 text-muted-foreground">
                <tr>{["ETF", "資產類別", "股數", "平均成本", "現價", "市場價值", "損益", "目前配置", "目標配置", "操作"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr>
              </thead>
              <tbody>
                {rows.map((item) => (
                  <tr key={item.etf} className="border-t border-border">
                    <td className="px-5 py-4"><p className="font-semibold">{item.etf}</p><p className="text-xs text-muted-foreground">{item.name}</p></td>
                    <td className="px-5 py-4">{item.asset}</td>
                    <td className="px-5 py-4">{item.shares}</td>
                    <td className="px-5 py-4">{item.currency === "TWD" ? "NT$" : "$"}{item.avg}</td>
                    <td className="px-5 py-4 text-muted-foreground">由 API 同步</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(item.shares * item.avg * 1.148)}</td>
                    <td className="px-5 py-4 font-semibold text-success">{formatCurrency(item.shares * item.avg * 0.148)}</td>
                    <td className="px-5 py-4">{item.current}%</td>
                    <td className="px-5 py-4">{item.target}%</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button className="h-10 gap-2 px-3" onClick={() => editHolding(item.etf)} aria-label={`編輯 ${item.etf}`}>
                          <Edit3 className="h-4 w-4" />
                          編輯
                        </Button>
                        <Button className="h-10 gap-2 px-3" onClick={() => deleteHolding(item.etf)} aria-label={`刪除 ${item.etf}`}>
                          <Trash2 className="h-4 w-4" />
                          刪除
                        </Button>
                      </div>
                      {editing === item.etf ? <p className="mt-2 text-xs text-success">已更新</p> : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5">
            <EmptyState onAction={addHolding} />
          </div>
        )}
      </Card>
      <AllocationPlanner rows={rows} onMessage={setMessage} />
    </>
  );
}

function AllocationPlanner({ rows, onMessage }: { rows: Holding[]; onMessage: (message: string) => void }) {
  const [targets, setTargets] = useState(() => allocations.map((item) => item.value));
  const total = useMemo(() => targets.reduce((sum, value) => sum + value, 0), [targets]);

  function updateTarget(index: number, value: number) {
    setTargets((current) => current.map((target, targetIndex) => targetIndex === index ? value : target));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <Card className="p-5">
        <h3 className="font-semibold">配置比較與目標調整</h3>
        <p className="mt-1 text-sm text-muted-foreground">拖曳各 ETF 目標比例後套用，總和需維持 100%。</p>
        <div className="mt-5 space-y-5">
          {allocations.map((item, index) => {
            const row = rows.find((holding) => holding.etf === item.symbol);
            return (
              <div key={item.symbol}>
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-medium">{item.symbol} · {item.label}</span>
                  <span className="text-muted-foreground">目前 {row?.current ?? 0}% / 目標 {targets[index]}%</span>
                </div>
                <div className="grid gap-2 md:grid-cols-[1fr_160px] md:items-center">
                  <div className="grid grid-cols-2 gap-2">
                    <ProgressBar value={row?.current ?? 0} />
                    <ProgressBar value={targets[index]} subtle />
                  </div>
                  <input
                    aria-label={`${item.symbol} 目標配置`}
                    type="range"
                    min="0"
                    max="80"
                    value={targets[index]}
                    onChange={(event) => updateTarget(index, Number(event.target.value))}
                    className="h-11 w-full accent-blue-600"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-slate-50 p-3 text-sm">
          <span className={total === 100 ? "font-medium text-success" : "font-medium text-danger"}>目標配置總和：{total}%</span>
          <Button variant="primary" disabled={total !== 100} onClick={() => onMessage("目標配置已更新。")}>
            套用目標配置
          </Button>
        </div>
      </Card>
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">再平衡建議</h3>
        <div className="space-y-3 text-sm">
          <p className="rounded-lg border border-border bg-amber-50 p-3">CSPX 超配 5%，下次投入可暫緩增加。</p>
          <p className="rounded-lg border border-border bg-emerald-50 p-3">VWRA 低配 3%，建議下一筆定期定額優先補足。</p>
          <p className="rounded-lg border border-border bg-slate-50 p-3">SGOV 落在目標區間內，維持現有配置。</p>
        </div>
      </Card>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
