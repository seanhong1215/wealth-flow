import { SlidersHorizontal, Target } from "lucide-react";
import { AppShell } from "@/components/wealth/app-shell";
import { PageHeading, ProgressBar, SummaryTile } from "@/components/wealth/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RetirementPlannerPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="退休規劃" title="估算退休準備度" description="以每月支出、通膨率與 4% 提領率估算所需退休資產。" />
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">退休輸入</h3>
          <div className="space-y-3 text-sm">
            {["目前年齡 35", "退休年齡 60", "每月支出 $2,800", "通膨率 2.5%", "提領率 4%", "目前投資組合 $128,450"].map((item) => <div key={item} className="rounded-md border border-border bg-white px-3 py-2">{item}</div>)}
          </div>
        </Card>
        <div className="grid gap-4">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">FIRE Number</p>
            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div><p className="text-4xl font-semibold">$1,920,000</p><p className="mt-2 text-sm text-muted-foreground">依 4% 法則與通膨調整後年支出估算</p></div>
              <Target className="h-10 w-10 text-primary" />
            </div>
            <div className="mt-5"><ProgressBar value={42} /></div>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            {["Age 35 目前 $128,450", "Age 45 中繼點 $620,000", "Age 60 退休目標 $1,920,000"].map((item) => <Card key={item} className="p-5 font-semibold">{item}</Card>)}
          </div>
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">缺口分析</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryTile label="所需月投入" value="$1,180" />
              <SummaryTile label="目前月投入" value="$500" />
              <SummaryTile label="投資缺口" value="$680" danger />
            </div>
            <Button className="mt-5 gap-2" variant="primary"><SlidersHorizontal className="h-4 w-4" />調整每月投入</Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
