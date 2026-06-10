import { AlertTriangle, PieChart, RefreshCw, TrendingUp, Plus } from "lucide-react";
import { AppShell } from "@/components/wealth/app-shell";
import { KpiCard, PageHeading, ProgressBar, TableHeader, Ticker } from "@/components/wealth/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { allocations, growth, months, transactions } from "@/lib/wealth-data";

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 md:flex-row md:items-center">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
          <div>
            <p className="text-sm font-semibold">真實市場資料</p>
            <p className="text-sm text-muted-foreground">
              價格由 `/api/market` 透過 Massive.com 伺服器代理取得；未設定 API key 時會顯示設定提醒。
            </p>
          </div>
        </div>
        <Button className="gap-2 bg-white">
          <RefreshCw className="h-4 w-4" />
          同步價格
        </Button>
      </div>
      <PageHeading
        eyebrow="主產品畫面"
        title="儀表板"
        description="最後更新時間會依 Massive API 回應更新，核心資料以真實市場價格為準。"
        actions={
          <div className="flex gap-2">
            <Button variant="primary" className="gap-2"><Plus className="h-4 w-4" />新增交易</Button>
            <Button className="gap-2"><RefreshCw className="h-4 w-4" />同步價格</Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="總資產" value="$128,450" trend="+8.4% 今年" note="含 CSPX、VWRA、0050、SGOV" />
        <KpiCard label="每月投入" value="$500" trend="+$50 較上月" note="定期定額執行中" />
        <KpiCard label="退休時預估價值" value="$742,800" trend="+12.6% 預估" note="以 8% 年化報酬估算" />
        <KpiCard label="退休進度" value="42%" trend="+3% 本季" note="距 FIRE 目標仍需 $1.7M" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">資產配置</h3>
              <p className="text-sm text-muted-foreground">CSPX / VWRA / 0050 / SGOV</p>
            </div>
            <PieChart className="h-5 w-5 text-primary" />
          </div>
          <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
            <div className="mx-auto h-44 w-44 rounded-full" style={{ background: "conic-gradient(#2563EB 0 50%, #06B6D4 50% 75%, #16A34A 75% 90%, #F59E0B 90% 100%)" }}>
              <div className="flex h-full items-center justify-center rounded-full p-7">
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
                  <p className="text-2xl font-semibold">4</p>
                  <p className="text-xs text-muted-foreground">核心 ETF</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {allocations.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm font-medium">{item.symbol} · {item.label}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">投資組合成長</h3>
              <p className="text-sm text-muted-foreground">歷史價值與預估退休價值</p>
            </div>
            <TrendingUp className="h-5 w-5 text-success" />
          </div>
          <Chart values={growth} labels={months} />
        </Card>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <TransactionsTable />
        <MarketPreview />
      </div>
      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">退休進度</h3>
            <p className="text-sm text-muted-foreground">目前資產相對於 4% 法則所需 FIRE Number</p>
          </div>
          <p className="text-2xl font-semibold">42%</p>
        </div>
        <ProgressBar value={42} />
      </Card>
    </AppShell>
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

function TransactionsTable() {
  return (
    <Card className="overflow-hidden">
      <TableHeader title="近期交易" action="新增交易" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr>{["日期", "類型", "代號", "金額", "價格", "狀態"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={`${item.date}-${item.symbol}`} className="border-t border-border">
                <td className="px-5 py-4">{item.date}</td><td className="px-5 py-4">{item.type}</td><td className="px-5 py-4 font-semibold">{item.symbol}</td><td className="px-5 py-4">{item.amount}</td><td className="px-5 py-4">{item.price}</td><td className="px-5 py-4"><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-success">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function MarketPreview() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold">真實價格預覽</h3>
      <p className="mb-4 text-sm text-muted-foreground">前端會呼叫 `/api/market`，由伺服器向 Massive.com 取得資料。</p>
      {["CSPX", "VWRA", "0050", "SGOV"].map((symbol) => (
        <div key={symbol} className="mb-3 grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border p-3">
          <Ticker symbol={symbol} />
          <div><p className="text-sm font-semibold">{symbol}</p><p className="text-xs text-muted-foreground">等待 Massive API 同步</p></div>
          <span className="text-sm text-muted-foreground">/api/market</span>
        </div>
      ))}
    </Card>
  );
}
