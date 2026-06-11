"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Plus, RefreshCw, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { readAccountState, writeAccountState } from "@/lib/account-store";
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
          aria-label="搜尋 ETF"
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
  const [form, setForm] = useState({
    type: "買入",
    symbol: "",
    date: "2026/06/11",
    shares: "",
    price: "",
    fee: "",
    currency: "USD",
    notes: ""
  });
  const modalRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSaved(false);
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function submit() {
    const current = readAccountState();
    writeAccountState({
      ...current,
      transactions: [
        {
          date: form.date,
          type: form.type,
          symbol: form.symbol.toUpperCase() || "-",
          amount: `${form.currency} ${Number(form.shares || 0) * Number(form.price || 0)}`,
          price: form.price || "-",
          status: "已完成"
        },
        ...current.transactions
      ]
    });
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4" role="presentation">
          <Card ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="transaction-title" className="w-full max-w-2xl p-5 shadow-panel">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 id="transaction-title" className="text-lg font-semibold">新增交易</h3>
                <p className="text-sm text-muted-foreground">支援買入、賣出與股息紀錄。</p>
              </div>
              <button ref={closeRef} onClick={() => setOpen(false)} aria-label="關閉">
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
                  <ModalField label="交易類型" value={form.type} onChange={(value) => setForm((current) => ({ ...current, type: value }))} />
                  <ModalField label="代號" value={form.symbol} onChange={(value) => setForm((current) => ({ ...current, symbol: value }))} />
                  <ModalField label="日期" value={form.date} onChange={(value) => setForm((current) => ({ ...current, date: value }))} />
                  <ModalField label="股數" value={form.shares} onChange={(value) => setForm((current) => ({ ...current, shares: value }))} />
                  <ModalField label="價格" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: value }))} />
                  <ModalField label="手續費" value={form.fee} onChange={(value) => setForm((current) => ({ ...current, fee: value }))} />
                  <ModalField label="幣別" value={form.currency} onChange={(value) => setForm((current) => ({ ...current, currency: value }))} />
                  <ModalField label="備註" value={form.notes} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />
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

function ModalField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
    </label>
  );
}
