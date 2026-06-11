import { AppShell } from "@/components/wealth/app-shell";
import { DcaSimulator } from "@/components/wealth/dca-simulator";
import { PageHeading } from "@/components/wealth/primitives";

export default function DcaSimulatorPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="定期定額模擬" title="長期投入與報酬推演" description="預設初始投入 $8,000、月投入 $500、年化 8%、期間 25 年。" />
      <DcaSimulator />
    </AppShell>
  );
}
