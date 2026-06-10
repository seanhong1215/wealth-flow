"use client";

import Link from "next/link";
import { CheckCircle2, CircleDollarSign, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const profileFields = [
  ["目前年齡", "35"],
  ["退休目標年齡", "60"],
  ["每月投資金額", "500"],
  ["每月生活支出", "2,800"]
];

const holdings = [
  ["CSPX", "iShares Core S&P 500 UCITS ETF", "42.8", "482.1", "USD", "50"],
  ["VWRA", "Vanguard FTSE All-World UCITS ETF", "108", "104.4", "USD", "25"],
  ["0050", "元大台灣 50", "70", "156.2", "TWD", "15"],
  ["SGOV", "iShares 0-3 Month Treasury Bond ETF", "194", "100.31", "USD", "10"]
];

export default function OnboardingPage() {
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
            用單一流程建立投資設定、加入 ETF 持倉，接著進入 Dashboard 追蹤資產、模擬 DCA 與退休進度。
          </p>
          <div className="mt-6 grid gap-3 text-sm">
            {["API key 僅保留於伺服器端", "支援 CSPX、VWRA、0050、SGOV", "可延伸訂閱金流，不處理投資本金"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-md border border-border bg-slate-50 px-3 py-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#profile" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-blue-700">
              開始建立
            </a>
            <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-white px-4 text-sm font-medium hover:bg-slate-50">
              查看 Demo Dashboard
            </Link>
          </div>
        </Card>

        <div className="space-y-6">
          <Card id="profile" className="p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Step 1</p>
                <h2 className="mt-1 text-xl font-semibold">建立投資設定</h2>
                <p className="mt-1 text-sm text-muted-foreground">設定年齡、退休目標、月投入與投資風格。</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-success" />
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {profileFields.map(([label, value]) => (
                <label key={label} className="block">
                  <span className="mb-1 block text-sm font-medium">{label}</span>
                  <input defaultValue={value} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </label>
              ))}
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {["保守", "均衡", "成長"].map((style) => (
                <button key={style} className={`h-10 rounded-md border text-sm font-medium ${style === "均衡" ? "border-primary bg-blue-50 text-primary" : "border-border bg-white"}`}>
                  {style}
                </button>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Step 2</p>
                <h2 className="mt-1 text-xl font-semibold">加入 ETF 持倉</h2>
              </div>
              <Button className="gap-2" variant="primary">
                <Plus className="h-4 w-4" />
                加入持倉
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-slate-50 text-muted-foreground">
                  <tr>{["ETF 代號", "ETF 名稱", "股數", "平均成本", "幣別", "目標配置 %"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr>
                </thead>
                <tbody>
                  {holdings.map((row) => (
                    <tr key={row[0]} className="border-t border-border">
                      {row.map((cell) => <td key={cell} className="px-5 py-4">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-border px-5 py-4">
              <Link href="/dashboard" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-blue-700">
                前往 Dashboard
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
