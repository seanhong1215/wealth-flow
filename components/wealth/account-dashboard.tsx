"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { readAccountState, AccountState } from "@/lib/account-store";
import { months } from "@/lib/wealth-data";
import { EmptyState, KpiCard, ProgressBar, TableHeader } from "./primitives";

export function AccountDashboard() {
  const [account, setAccount] = useState<AccountState>(() => readAccountState());

  useEffect(() => {
    function load() {
      setAccount(readAccountState());
    }
    load();
    window.addEventListener("wealthflow:account-updated", load);
    return () => window.removeEventListener("wealthflow:account-updated", load);
  }, []);

  const totalCost = useMemo(() => account.holdings.reduce((sum, item) => sum + item.shares * item.avg, 0), [account.holdings]);
  const marketValue = totalCost;
  const monthly = account.profile?.monthlyInvestment ?? 0;
  const retirementValue = monthly > 0 ? monthly * 12 * 25 + marketValue : 0;
  const progress = retirementValue ? Math.min((marketValue / 1_920_000) * 100, 100) : 0;
  const chartValues = useMemo(() => Array.from({ length: 12 }, (_, index) => Math.max(8, (marketValue + monthly * (index + 1)) / 1000)), [marketValue, monthly]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="總資產" value={formatCurrency(marketValue)} trend={account.holdings.length ? "已建立" : "空資料"} note={account.holdings.length ? "依目前帳號持倉計算" : "尚未新增任何持倉"} />
        <KpiCard label="每月投入" value={formatCurrency(monthly)} trend={account.profile ? account.profile.style : "未設定"} note="來自目前帳號投資設定" />
        <KpiCard label="退休時預估價值" value={formatCurrency(retirementValue)} trend="25 年" note="以目前月投入推算" />
        <KpiCard label="退休進度" value={`${progress.toFixed(0)}%`} trend="目前帳號" note="距 FIRE 目標仍需補足" />
      </div>
      {!account.holdings.length ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">資產配置</h3>
                <p className="text-sm text-muted-foreground">目前帳號持倉</p>
              </div>
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-3">
              {account.holdings.map((item) => (
                <div key={item.etf} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-blue-600" />
                    <span className="text-sm font-medium">{item.etf} · {item.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.target}%</span>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">投資組合成長</h3>
                <p className="text-sm text-muted-foreground">依目前設定推算</p>
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <Chart values={chartValues} labels={months} />
          </Card>
        </div>
      )}
      <div className="grid gap-4">
        <TransactionsTable rows={account.transactions} />
      </div>
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">退休進度</h3>
            <p className="text-sm text-muted-foreground">目前帳號資產相對於 FIRE Number</p>
          </div>
          <p className="text-2xl font-semibold">{progress.toFixed(0)}%</p>
        </div>
        <ProgressBar value={progress} />
      </Card>
    </>
  );
}

function Chart({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div>
      <div className="flex h-64 items-end gap-2 border-b border-l border-border px-2">
        {values.map((value, index) => (
          <div key={index} className="flex flex-1 items-end">
            <div className="w-full rounded-t-md bg-primary" style={{ height: `${value * 1.55}px` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1 text-center text-xs text-muted-foreground md:grid-cols-12">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}

function TransactionsTable({ rows }: { rows: AccountState["transactions"] }) {
  return (
    <Card className="overflow-hidden">
      <TableHeader title="近期交易" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr>{["日期", "類型", "代號", "金額", "價格", "狀態"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((item) => (
              <tr key={`${item.date}-${item.symbol}-${item.amount}`} className="border-t border-border">
                <td className="px-5 py-4">{item.date}</td><td className="px-5 py-4">{item.type}</td><td className="px-5 py-4 font-semibold">{item.symbol}</td><td className="px-5 py-4">{item.amount}</td><td className="px-5 py-4">{item.price}</td><td className="px-5 py-4"><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-success">{item.status}</span></td>
              </tr>
            )) : <tr><td className="px-5 py-8 text-muted-foreground" colSpan={6}>尚未新增任何交易。</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
