"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { AccountState, emptyAccountState, readAccountState } from "@/lib/account-store";
import { EmptyState, KpiCard } from "./primitives";

export function ReportsClient() {
  const [account, setAccount] = useState<AccountState>(emptyAccountState);

  useEffect(() => {
    function load() {
      readAccountState().then(setAccount).catch(() => setAccount(emptyAccountState));
    }
    load();
    window.addEventListener("wealthflow:account-updated", load);
    return () => window.removeEventListener("wealthflow:account-updated", load);
  }, []);

  const invested = useMemo(() => account.transactions.reduce((sum, item) => {
    const amount = Number(item.amount.replace(/[^0-9.-]/g, ""));
    return sum + (Number.isFinite(amount) ? amount : 0);
  }, 0), [account.transactions]);

  if (!account.holdings.length && !account.transactions.length) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="本月投入" value={formatCurrency(invested)} trend={account.transactions.length ? `${account.transactions.length} 筆` : "0 筆"} note="依目前交易紀錄計算" />
        <KpiCard label="組合報酬" value="-" trend="待更新" note="輸入最新價格後顯示" />
        <KpiCard label="最佳表現" value="-" trend="待更新" note="需要完整價格資料" />
        <KpiCard label="最弱表現" value="-" trend="待更新" note="需要完整價格資料" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">資產類別分布</h3>
          {account.holdings.map((item) => <p key={item.etf} className="mb-3 rounded-md border border-border bg-slate-50 p-3 text-sm">{item.asset} · {item.etf}</p>)}
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">每月投入歷史</h3>
          <div className="flex h-64 items-end gap-2">
            {Array.from({ length: 12 }, (_, index) => {
              const value = index === 11 ? invested : 0;
              return (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-md bg-primary" style={{ height: `${invested ? (value / invested) * 210 : 4}px` }} />
                  <span className="text-[10px] text-muted-foreground">{index + 1}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <h3 className="font-semibold">洞察</h3>
        <p className="mt-2 text-sm text-muted-foreground">累積更多持倉與交易後，這裡會顯示資產配置與投入節奏建議。</p>
      </Card>
    </>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
