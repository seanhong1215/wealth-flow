import { AppShell } from "@/components/wealth/app-shell";
import { AccountDashboard } from "@/components/wealth/account-dashboard";
import { AddTransactionButton, SyncPricesButton } from "@/components/wealth/actions";
import { PageHeading } from "@/components/wealth/primitives";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeading
        eyebrow="儀表板"
        title="Dashboard"
        description="目前畫面讀取登入帳號資料；新帳號會先顯示空狀態。"
        actions={
          <div className="flex gap-2">
            <AddTransactionButton />
            <SyncPricesButton />
          </div>
        }
      />
      <AccountDashboard />
    </AppShell>
  );
}
