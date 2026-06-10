import { AppShell } from "@/components/wealth/app-shell";
import { KpiCard, PageHeading } from "@/components/wealth/primitives";
import { Card } from "@/components/ui/card";
import { reportInsights } from "@/lib/wealth-data";

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="月報" title="每月投資報告" description="彙整本月投入、組合報酬、資產類別與可執行洞察。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="本月投入" value="$1,786" trend="+12%" note="含 SGOV 股息再投入" />
        <KpiCard label="組合報酬" value="+2.8%" trend="跑贏基準" note="MSCI ACWI +2.1%" />
        <KpiCard label="最佳表現" value="0050" trend="+4.6%" note="台股權重貢獻最高" />
        <KpiCard label="最弱表現" value="SGOV" trend="+0.1%" note="防禦性現金部位" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">資產類別分布</h3>
          {["美國股票 50%", "全球股票 25%", "台灣股票 15%", "債券 8%", "現金 2%"].map((item) => <p key={item} className="mb-3 rounded-md border border-border bg-slate-50 p-3 text-sm">{item}</p>)}
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">每月投入歷史</h3>
          <div className="flex h-64 items-end gap-2">
            {[420, 500, 500, 650, 500, 780, 500, 500, 900, 500, 700, 1786].map((value, index, list) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-2">
                <div className="w-full rounded-t-md bg-primary" style={{ height: `${(value / Math.max(...list)) * 210}px` }} />
                <span className="text-[10px] text-muted-foreground">{index + 1}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {reportInsights.map((text, index) => <Card key={text} className="p-5"><h3 className="font-semibold">洞察 {index + 1}</h3><p className="mt-2 text-sm text-muted-foreground">{text}</p></Card>)}
      </div>
    </AppShell>
  );
}
