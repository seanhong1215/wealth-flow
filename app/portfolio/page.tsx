import { AppShell } from "@/components/wealth/app-shell";
import { AllocationPlanner } from "@/components/wealth/allocation-planner";
import { KpiCard, PageHeading, TableHeader } from "@/components/wealth/primitives";
import { Card } from "@/components/ui/card";
import { holdings } from "@/lib/wealth-data";

export default function PortfolioPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="投資組合" title="檢視目前 ETF 持倉" description="比較市值、成本、未實現損益與目標配置，找出再平衡方向。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="市場價值" value="$128,450" trend="+8.4%" note="依 Massive 價格同步後估算" />
        <KpiCard label="總成本" value="$111,920" trend="+$5,000" note="今年新增投入" />
        <KpiCard label="未實現損益" value="$16,530" trend="+14.8%" note="未含股息稅費" />
        <KpiCard label="預估年度股息" value="$3,120" trend="2.43%" note="以近 12 個月殖利率估算" />
      </div>
      <Card className="overflow-hidden">
        <TableHeader title="持倉明細" action="編輯目標配置" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-muted-foreground">
              <tr>{["ETF", "資產類別", "股數", "平均成本", "現價", "市場價值", "損益", "目前配置", "目標配置"].map((head) => <th key={head} className="px-5 py-3 font-medium">{head}</th>)}</tr>
            </thead>
            <tbody>
              {holdings.map((item) => (
                <tr key={item.etf} className="border-t border-border">
                  <td className="px-5 py-4"><p className="font-semibold">{item.etf}</p><p className="text-xs text-muted-foreground">{item.name}</p></td>
                  <td className="px-5 py-4">{item.asset}</td>
                  <td className="px-5 py-4">{item.shares}</td>
                  <td className="px-5 py-4">{item.currency === "TWD" ? "NT$" : "$"}{item.avg}</td>
                  <td className="px-5 py-4 text-muted-foreground">由 API 同步</td>
                  <td className="px-5 py-4 font-medium">由 API 估算</td>
                  <td className="px-5 py-4 font-semibold text-success">同步後計算</td>
                  <td className="px-5 py-4">{item.current}%</td>
                  <td className="px-5 py-4">{item.target}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <AllocationPlanner />
    </AppShell>
  );
}
