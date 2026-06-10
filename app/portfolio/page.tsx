import { AppShell } from "@/components/wealth/app-shell";
import { KpiCard, PageHeading, ProgressBar, TableHeader } from "@/components/wealth/primitives";
import { Card } from "@/components/ui/card";
import { allocations, holdings } from "@/lib/wealth-data";

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
      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">配置比較</h3>
          <div className="space-y-4">
            {allocations.map((item, index) => (
              <div key={item.symbol}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{item.symbol}</span>
                  <span className="text-muted-foreground">目前 {holdings[index].current}% / 目標 {item.value}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ProgressBar value={holdings[index].current} />
                  <ProgressBar value={item.value} subtle />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">再平衡建議</h3>
          <div className="space-y-3 text-sm">
            <p className="rounded-lg border border-border bg-amber-50 p-3">CSPX 超配 5%，下次投入可暫緩增加。</p>
            <p className="rounded-lg border border-border bg-emerald-50 p-3">VWRA 低配 3%，建議下一筆定期定額優先補足。</p>
            <p className="rounded-lg border border-border bg-slate-50 p-3">SGOV 落在目標區間內，維持現有配置。</p>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
