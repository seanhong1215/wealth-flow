import { BarChart3 } from "lucide-react";
import { AppShell } from "@/components/wealth/app-shell";
import { KpiCard, PageHeading } from "@/components/wealth/primitives";
import { Card } from "@/components/ui/card";
import { contribution, growth, months } from "@/lib/wealth-data";

export default function DcaSimulatorPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="定期定額模擬" title="長期投入與報酬推演" description="預設初始投入 $8,000、月投入 $500、年化 8%、期間 25 年。" />
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">輸入條件</h3>
          <div className="grid gap-3">
            {["初始投入 $8,000", "每月投入 $500", "預期年化報酬 8%", "投資期間 25 年", "投入頻率 每月", "幣別 USD"].map((text) => (
              <div key={text} className="rounded-md border border-border bg-white px-3 py-2 text-sm">{text}</div>
            ))}
          </div>
        </Card>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="最終資產" value="$372,500" trend="+8% 年化" note="含複利效果" />
            <KpiCard label="總投入" value="$158,000" trend="25 年" note="本金合計" />
            <KpiCard label="預估收益" value="$214,500" trend="+136%" note="稅費前估算" />
            <KpiCard label="年化報酬" value="8.0%" trend="均衡情境" note="可於設定調整" />
          </div>
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div><h3 className="font-semibold">投入本金 vs 投資組合價值</h3><p className="text-sm text-muted-foreground">藍色為資產價值，灰色為累積投入本金。</p></div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex h-64 items-end gap-2 border-b border-l border-border px-2">
              {growth.map((value, index) => (
                <div key={index} className="relative flex flex-1 items-end">
                  <div className="absolute bottom-0 w-full rounded-t-sm bg-slate-300 opacity-50" style={{ height: `${contribution[index] * 1.2}px` }} />
                  <div className="relative w-full rounded-t-md bg-primary" style={{ height: `${value * 1.55}px` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1 text-center text-xs text-muted-foreground md:grid-cols-12">{months.map((m) => <span key={m}>{m}</span>)}</div>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["保守情境 5% $286,900", "均衡情境 8% $372,500", "成長情境 10% $449,200"].map((item) => (
          <Card key={item} className="p-5"><p className="text-xl font-semibold">{item}</p></Card>
        ))}
      </div>
    </AppShell>
  );
}
