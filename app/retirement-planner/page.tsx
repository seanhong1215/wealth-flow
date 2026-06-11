import { AppShell } from "@/components/wealth/app-shell";
import { RetirementPlanner } from "@/components/wealth/retirement-planner";
import { PageHeading } from "@/components/wealth/primitives";

export default function RetirementPlannerPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="退休規劃" title="估算退休準備度" description="以每月支出、通膨率與 4% 提領率估算所需退休資產。" />
      <RetirementPlanner />
    </AppShell>
  );
}
