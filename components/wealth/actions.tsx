"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Plus, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { watchSymbols } from "@/lib/wealth-data";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => watchSymbols.filter((symbol) => symbol.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="relative hidden md:block">
      <div className="flex h-10 items-center gap-2 rounded-md border border-border bg-white px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜尋 ETF"
          className="w-36 bg-transparent text-sm outline-none"
        />
      </div>
      {query ? (
        <Card className="absolute right-0 top-12 z-40 w-64 p-2 shadow-panel">
          {results.length ? results.map((symbol) => (
            <a key={symbol} href={`/watchlist?symbol=${symbol}`} className="block rounded-md px-3 py-2 text-sm hover:bg-slate-50">
              {symbol}
            </a>
          )) : <p className="px-3 py-2 text-sm text-muted-foreground">找不到符合的 ETF</p>}
        </Card>
      ) : null}
    </div>
  );
}

export function SyncPricesButton({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function sync() {
    setState("loading");
    try {
      const response = await fetch("/api/market", { cache: "no-store" });
      if (!response.ok) throw new Error("sync failed");
      setState("done");
      window.dispatchEvent(new CustomEvent("wealthflow:market-sync"));
      setTimeout(() => setState("idle"), 1800);
    } catch {
      setState("error");
      setTimeout(() => setState("idle"), 2400);
    }
  }

  return (
    <Button onClick={sync} className="gap-2" disabled={state === "loading"}>
      {state === "loading" ? <RefreshCw className="h-4 w-4 animate-spin" /> : state === "done" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <RefreshCw className="h-4 w-4" />}
      {compact ? "" : state === "done" ? "已同步" : state === "error" ? "同步失敗" : "同步價格"}
    </Button>
  );
}

export function AddTransactionButton() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function submit() {
    setSaved(true);
    setTimeout(() => {
      setOpen(false);
      setSaved(false);
    }, 1200);
  }

  return (
    <>
      <Button variant="primary" className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        新增交易
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4">
          <Card className="w-full max-w-2xl p-5 shadow-panel">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">新增交易</h3>
                <p className="text-sm text-muted-foreground">支援買入、賣出與股息紀錄。</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="關閉">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            {saved ? (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-success">
                交易已成功新增。
              </div>
            ) : (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  {["交易類型：買入", "代號：SGOV", "日期：2026/06/10", "股數：10", "價格：100.47", "手續費：1.00", "幣別：USD", "備註：每月再平衡"].map((label) => (
                    <label key={label} className="block">
                      <span className="mb-1 block text-sm font-medium">{label.split("：")[0]}</span>
                      <input defaultValue={label.split("：")[1]} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                    </label>
                  ))}
                </div>
                <div className="mt-5 flex justify-end gap-2">
                  <Button onClick={() => setOpen(false)}>取消</Button>
                  <Button variant="primary" onClick={submit}>儲存交易</Button>
                </div>
              </>
            )}
          </Card>
        </div>
      ) : null}
    </>
  );
}
