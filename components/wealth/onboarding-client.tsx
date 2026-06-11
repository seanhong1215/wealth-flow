"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCircle2, CircleDollarSign, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { readAccountState, writeAccountState } from "@/lib/account-store";

const blankHolding = {
  etf: "",
  name: "",
  shares: "",
  avg: "",
  currency: "USD",
  target: ""
};

export function OnboardingClient() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    age: "35",
    retirementAge: "60",
    monthlyInvestment: "500",
    monthlyExpense: "2800",
    style: "均衡" as "保守" | "均衡" | "成長"
  });
  const [holding, setHolding] = useState(blankHolding);
  const [message, setMessage] = useState("");

  function saveProfile() {
    const current = readAccountState();
    writeAccountState({
      ...current,
      profile: {
        age: Number(profile.age),
        retirementAge: Number(profile.retirementAge),
        monthlyInvestment: Number(profile.monthlyInvestment),
        monthlyExpense: Number(profile.monthlyExpense),
        style: profile.style
      }
    });
    setMessage("投資設定已綁定到目前帳號。");
  }

  function addHolding() {
    if (!holding.etf || !holding.name) {
      setMessage("請輸入 ETF 代號與名稱。");
      return;
    }
    const current = readAccountState();
    writeAccountState({
      ...current,
      holdings: [
        ...current.holdings.filter((item) => item.etf !== holding.etf.toUpperCase()),
        {
          etf: holding.etf.toUpperCase(),
          name: holding.name,
          asset: "自訂 ETF",
          shares: Number(holding.shares || 0),
          avg: Number(holding.avg || 0),
          current: 0,
          target: Number(holding.target || 0),
          currency: holding.currency
        }
      ]
    });
    setHolding(blankHolding);
    setMessage("ETF 持倉已加入目前帳號。");
  }

  function continueToDashboard() {
    saveProfile();
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto grid min-h-screen max-w-[1180px] gap-6 px-4 py-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-center lg:px-8">
        <Card className="p-6 lg:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white">
              <CircleDollarSign className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xl font-semibold">WealthFlow</p>
              <p className="text-sm text-muted-foreground">長期 ETF 財富中樞</p>
            </div>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">登入 / Onboarding</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight md:text-4xl">建立你的長期財富計畫</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            建立投資設定與 ETF 持倉，開始追蹤你的長期投資進度。
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            {["設定退休目標", "規劃每月投入", "建立 ETF 持倉"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md border border-border bg-slate-50 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                {item}
              </div>
            ))}
          </div>
          {message ? <p className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-success" role="status">{message}</p> : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#profile" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-blue-700">
              開始建立
            </a>
            <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium hover:bg-slate-50">
              前往儀表板
            </Link>
          </div>
        </Card>

        <div className="space-y-6">
          <Card id="profile" className="p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Step 1</p>
                <h2 className="mt-1 text-xl font-semibold">建立投資設定</h2>
                <p className="mt-1 text-sm text-muted-foreground">依照你的退休目標與投入能力建立計畫。</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="目前年齡" value={profile.age} onChange={(value) => setProfile((current) => ({ ...current, age: value }))} />
              <Field label="退休目標年齡" value={profile.retirementAge} onChange={(value) => setProfile((current) => ({ ...current, retirementAge: value }))} />
              <Field label="每月投資金額" value={profile.monthlyInvestment} onChange={(value) => setProfile((current) => ({ ...current, monthlyInvestment: value }))} />
              <Field label="每月生活支出" value={profile.monthlyExpense} onChange={(value) => setProfile((current) => ({ ...current, monthlyExpense: value }))} />
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {["保守", "均衡", "成長"].map((style) => (
                <button key={style} onClick={() => setProfile((current) => ({ ...current, style: style as typeof profile.style }))} className={`h-10 rounded-md border text-sm font-medium ${style === profile.style ? "border-primary bg-blue-50 text-primary" : "border-border bg-white"}`}>
                  {style}
                </button>
              ))}
            </div>
            <Button className="mt-5" variant="primary" onClick={saveProfile}>儲存投資設定</Button>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Step 2</p>
                <h2 className="mt-1 text-xl font-semibold">加入 ETF 持倉</h2>
                <p className="mt-1 text-sm text-muted-foreground">加入你已持有或準備追蹤的 ETF。</p>
              </div>
              <Button className="gap-2" variant="primary" onClick={addHolding}>
                <Plus className="h-4 w-4" />
                加入持倉
              </Button>
            </div>
            <div className="grid gap-3 p-5 md:grid-cols-2">
              <Field label="ETF 代號" value={holding.etf} onChange={(value) => setHolding((current) => ({ ...current, etf: value }))} />
              <Field label="ETF 名稱" value={holding.name} onChange={(value) => setHolding((current) => ({ ...current, name: value }))} />
              <Field label="股數" value={holding.shares} onChange={(value) => setHolding((current) => ({ ...current, shares: value }))} />
              <Field label="平均成本" value={holding.avg} onChange={(value) => setHolding((current) => ({ ...current, avg: value }))} />
              <Field label="幣別" value={holding.currency} onChange={(value) => setHolding((current) => ({ ...current, currency: value }))} />
              <Field label="目標配置 %" value={holding.target} onChange={(value) => setHolding((current) => ({ ...current, target: value }))} />
            </div>
            <div className="flex justify-end border-t border-border px-5 py-4">
              <Button variant="primary" onClick={continueToDashboard}>前往 Dashboard</Button>
            </div>
          </Card>
        </div>
      </section>
    </main>
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
