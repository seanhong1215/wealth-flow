import { AppShell } from "@/components/wealth/app-shell";
import { PortfolioManager } from "@/components/wealth/portfolio-manager";
import { PageHeading } from "@/components/wealth/primitives";

export default function PortfolioPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="投資組合" title="檢視目前 ETF 持倉" description="比較市值、成本、未實現損益與目標配置，找出再平衡方向。" />
      <PortfolioManager />
    </AppShell>
  );
}
