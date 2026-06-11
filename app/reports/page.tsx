import { AppShell } from "@/components/wealth/app-shell";
import { ReportsClient } from "@/components/wealth/reports-client";
import { PageHeading } from "@/components/wealth/primitives";

export default function ReportsPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="月報" title="每月投資報告" description="有交易與持倉後，系統會整理本月投資表現。" />
      <ReportsClient />
    </AppShell>
  );
}
