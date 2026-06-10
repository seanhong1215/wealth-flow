import { AppShell } from "@/components/wealth/app-shell";
import { MarketTable } from "@/components/wealth/market-table";
import { PageHeading, SummaryTile, Ticker } from "@/components/wealth/primitives";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function WatchlistPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="ETF 觀察清單" title="追蹤關注 ETF" description="價格透過 Massive.com REST API，由 Next server route 安全代理。" />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <MarketTable />
        <Card className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ETF Detail Drawer</p>
              <h3 className="text-xl font-semibold">CSPX</h3>
              <p className="text-sm text-muted-foreground">iShares Core S&P 500 UCITS ETF</p>
            </div>
            <Ticker symbol="CSPX" />
          </div>
          <div className="flex h-28 items-end gap-1 rounded-lg border border-border bg-slate-50 p-3">
            {[32, 44, 38, 51, 49, 63, 71, 69, 78, 85, 82, 92].map((value, index) => (
              <div key={index} className="flex flex-1 items-end"><div className="w-full rounded-t-sm bg-primary" style={{ height: `${value}px` }} /></div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <SummaryTile label="費用率" value="0.07%" />
            <SummaryTile label="風險等級" value="中高" />
            <SummaryTile label="主要持股" value="Apple" />
            <SummaryTile label="資料來源" value="Massive" />
          </div>
          <Button className="mt-5 w-full" variant="primary">加入投資組合</Button>
        </Card>
      </div>
    </AppShell>
  );
}
