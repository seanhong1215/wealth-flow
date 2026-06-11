"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AccountHolding, readAccountState, writeAccountState } from "@/lib/account-store";
import { EmptyState, KpiCard, ProgressBar } from "./primitives";

export function PortfolioManager() {
  const [rows, setRows] = useState<AccountHolding[]>([]);
  const [editing, setEditing] = useState("");
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState({ etf: "", name: "", shares: "", avg: "", currency: "USD", target: "" });

  useEffect(() => {
    function load() {
      setRows(readAccountState().holdings);
    }
    load();
    window.addEventListener("wealthflow:account-updated", load);
    return () => window.removeEventListener("wealthflow:account-updated", load);
  }, []);

  const summary = useMemo(() => {
    const totalCost = rows.reduce((sum, item) => sum + item.shares * item.avg, 0);
    return {
      marketValue: totalCost,
      totalCost,
      gain: 0,
      dividend: 0
    };
  }, [rows]);

  function persist(nextRows: AccountHolding[]) {
    const current = readAccountState();
    writeAccountState({ ...current, holdings: nextRows });
    setRows(nextRows);
  }

  function addHolding() {
    if (!draft.etf || !draft.name) {
      setMessage("請先輸入 ETF 代號與名稱。");
      return;
    }
    const symbol = draft.etf.toUpperCase();
    const nextRows = [
      ...rows.filter((item) => item.etf !== symbol),
      {
        etf: symbol,
        name: draft.name,
        asset: "自訂 ETF",
        shares: Number(draft.shares || 0),
        avg: Number(draft.avg || 0),
        current: 0,
        target: Number(draft.target || 0),
        currency: draft.currency
      }
    ];
    persist(nextRows);
    setDraft({ etf: "", name: "", shares: "", avg: "", currency: "USD", target: "" });
    setMessage("持倉已新增到目前帳號。");
  }

  function editHolding(symbol: string) {
    persist(rows.map((item) => item.etf === symbol ? { ...item, target: Math.min(item.target + 1, 80), shares: Number((item.shares + 1).toFixed(2)) } : item));
    setEditing(symbol);
    setMessage(`${symbol} 已更新股數與目標配置。`);
  }

  function deleteHolding(symbol: string) {
    persist(rows.filter((item) => item.etf !== symbol));
    setMessage(`${symbol} 已刪除。`);
  }

  function clearHoldings() {
    persist([]);
    setMessage("所有持倉已清空。");
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="市場價值" value={formatCurrency(summary.marketValue)} trend={rows.length ? "已建立" : "空資料"} note="依目前輸入資料計算" />
        <KpiCard label="總成本" value={formatCurrency(summary.totalCost)} trend={rows.length ? `${rows.length} 檔` : "0 檔"} note="目前帳號持倉成本" />
        <KpiCard label="未實現損益" value={formatCurrency(summary.gain)} trend="待更新" note="尚未輸入最新價格" />
        <KpiCard label="預估年度股息" value={formatCurrency(summary.dividend)} trend="待更新" note="尚未輸入股息資料" />
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
          </div>
        </div>
        <div className="grid gap-3 border-b border-border p-5 md:grid-cols-3 xl:grid-cols-6">
          <InlineField label="ETF 代號" value={draft.etf} onChange={(value) => setDraft((current) => ({ ...current, etf: value }))} />
          <InlineField label="ETF 名稱" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
          <InlineField label="股數" value={draft.shares} onChange={(value) => setDraft((current) => ({ ...current, shares: value }))} />
          <InlineField label="平均成本" value={draft.avg} onChange={(value) => setDraft((current) => ({ ...current, avg: value }))} />
          <InlineField label="幣別" value={draft.currency} onChange={(value) => setDraft((current) => ({ ...current, currency: value }))} />
          <InlineField label="目標配置 %" value={draft.target} onChange={(value) => setDraft((current) => ({ ...current, target: value }))} />
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
                    <td className="px-5 py-4 text-muted-foreground">待更新</td>
                    <td className="px-5 py-4 font-medium">{formatCurrency(item.shares * item.avg)}</td>
                    <td className="px-5 py-4 font-semibold text-muted-foreground">{formatCurrency(0)}</td>
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

function AllocationPlanner({ rows, onMessage }: { rows: AccountHolding[]; onMessage: (message: string) => void }) {
  const [targets, setTargets] = useState<Record<string, number>>({});
  const visibleRows = rows;

  const targetTotal = useMemo(() => visibleRows.reduce((sum, item) => sum + (targets[item.etf] ?? item.target), 0), [targets, visibleRows]);

  function updateTarget(symbol: string, value: number) {
    setTargets((current) => ({ ...current, [symbol]: value }));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <Card className="p-5">
        <h3 className="font-semibold">配置比較與目標調整</h3>
        <p className="mt-1 text-sm text-muted-foreground">拖曳各 ETF 目標比例後套用，總和需維持 100%。</p>
        {visibleRows.length ? (
          <>
            <div className="mt-5 space-y-5">
              {visibleRows.map((item) => {
                const target = targets[item.etf] ?? item.target;
                return (
                  <div key={item.etf}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium">{item.etf} · {item.name}</span>
                      <span className="text-muted-foreground">目前 {item.current}% / 目標 {target}%</span>
                    </div>
                    <div className="grid gap-2 md:grid-cols-[1fr_160px] md:items-center">
                      <div className="grid grid-cols-2 gap-2">
                        <ProgressBar value={item.current} />
                        <ProgressBar value={target} subtle />
                      </div>
                      <input
                        aria-label={`${item.etf} 目標配置`}
                        type="range"
                        min="0"
                        max="100"
                        value={target}
                        onChange={(event) => updateTarget(item.etf, Number(event.target.value))}
                        className="h-11 w-full accent-blue-600"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-slate-50 p-3 text-sm">
              <span className={targetTotal === 100 ? "font-medium text-success" : "font-medium text-danger"}>目標配置總和：{targetTotal}%</span>
              <Button variant="primary" disabled={targetTotal !== 100} onClick={() => onMessage("目標配置已更新。")}>
                套用目標配置
              </Button>
            </div>
          </>
        ) : (
          <p className="mt-5 rounded-md border border-border bg-slate-50 p-4 text-sm text-muted-foreground">新增持倉後即可設定目標配置。</p>
        )}
      </Card>
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">再平衡建議</h3>
        {visibleRows.length ? (
          <div className="space-y-3 text-sm">
            {visibleRows.map((item) => (
              <p key={item.etf} className="rounded-lg border border-border bg-slate-50 p-3">
                {item.etf} 目前配置 {item.current}%，目標配置 {targets[item.etf] ?? item.target}%。
              </p>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-border bg-slate-50 p-3 text-sm text-muted-foreground">新增持倉後會顯示再平衡建議。</p>
        )}
      </Card>
    </div>
  );
}

function InlineField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
    </label>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
