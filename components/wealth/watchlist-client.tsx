"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { emptyAccountState, readAccountState, writeAccountState } from "@/lib/account-store";
import { EmptyState, SummaryTile, Ticker } from "@/components/wealth/primitives";

type WatchItem = {
  symbol: string;
  name: string;
  market: string;
  assetClass: string;
};

export function WatchlistClient() {
  const [items, setItems] = useState<WatchItem[]>([]);
  const [selected, setSelected] = useState<WatchItem | null>(null);
  const [draft, setDraft] = useState({ symbol: "", name: "", market: "", assetClass: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    function load() {
      readAccountState()
        .then((account) => setItems(account.watchlist))
        .catch(() => setItems([]));
    }
    load();
    window.addEventListener("wealthflow:account-updated", load);
    return () => window.removeEventListener("wealthflow:account-updated", load);
  }, []);

  async function addWatchItem() {
    if (!draft.symbol || !draft.name) {
      setMessage("請輸入 ETF 代號與名稱。");
      return;
    }
    const next = {
      symbol: draft.symbol.toUpperCase(),
      name: draft.name,
      market: draft.market || "-",
      assetClass: draft.assetClass || "-"
    };
    const nextItems = [...items.filter((item) => item.symbol !== next.symbol), next];
    const account = await readAccountState().catch(() => emptyAccountState);
    await writeAccountState({ ...account, watchlist: nextItems });
    setItems(nextItems);
    setSelected(next);
    setDraft({ symbol: "", name: "", market: "", assetClass: "" });
    setMessage(`${next.symbol} 已加入觀察清單。`);
  }

  async function addToPortfolio(item: WatchItem) {
    const account = await readAccountState().catch(() => emptyAccountState);
    if (account.holdings.some((holding) => holding.etf === item.symbol)) {
      setMessage(`${item.symbol} 已在投資組合中。`);
      return;
    }
    await writeAccountState({
      ...account,
      holdings: [...account.holdings, {
        etf: item.symbol,
        name: item.name,
        asset: item.assetClass,
        shares: 0,
        avg: 0,
        current: 0,
        target: 0,
        currency: "USD"
      }]
    });
    setMessage(`${item.symbol} 已加入投資組合。`);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold">ETF 觀察清單</h3>
            {message ? <p className="mt-1 text-sm text-success" role="status">{message}</p> : null}
          </div>
          <Button className="gap-2" variant="primary" onClick={addWatchItem}>
            <Plus className="h-4 w-4" />
            新增 ETF
          </Button>
        </div>
        <div className="grid gap-3 border-b border-border p-5 md:grid-cols-4">
          <Field label="ETF 代號" value={draft.symbol} onChange={(value) => setDraft((current) => ({ ...current, symbol: value }))} />
          <Field label="ETF 名稱" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
          <Field label="市場" value={draft.market} onChange={(value) => setDraft((current) => ({ ...current, market: value }))} />
          <Field label="資產類別" value={draft.assetClass} onChange={(value) => setDraft((current) => ({ ...current, assetClass: value }))} />
        </div>
        {items.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-muted-foreground">
                <tr>{["代號", "名稱", "市場", "資產類別", "操作"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.symbol} className="border-t border-border">
                    <td className="px-5 py-4 font-semibold">{item.symbol}</td>
                    <td className="px-5 py-4">{item.name}</td>
                    <td className="px-5 py-4">{item.market}</td>
                    <td className="px-5 py-4">{item.assetClass}</td>
                    <td className="px-5 py-4"><Button className="h-10 px-3" onClick={() => setSelected(item)}>查看詳情</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-5"><EmptyState onAction={() => setMessage("請先輸入 ETF 代號與名稱。")} /></div>
        )}
      </Card>
      <Card className="p-5">
        {selected ? (
          <>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ETF 詳情</p>
                <h3 className="text-xl font-semibold">{selected.symbol}</h3>
                <p className="text-sm text-muted-foreground">{selected.name}</p>
              </div>
              <Ticker symbol={selected.symbol} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SummaryTile label="市場" value={selected.market} />
              <SummaryTile label="資產類別" value={selected.assetClass} />
              <SummaryTile label="價格" value="-" />
              <SummaryTile label="狀態" value="待更新" />
            </div>
            <Button className="mt-5 w-full" variant="primary" onClick={() => addToPortfolio(selected)}>加入投資組合</Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">新增或選擇 ETF 後顯示詳情。</p>
        )}
      </Card>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
    </label>
  );
}
