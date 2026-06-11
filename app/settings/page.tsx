import { AppShell } from "@/components/wealth/app-shell";
import { SettingsPanel } from "@/components/wealth/settings-panel";
import { PageHeading } from "@/components/wealth/primitives";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="設定" title="個人資料、API 與金流策略" description="管理投資假設、顯示偏好、Massive API key 設定方式，以及金流是否適合放進產品。" />
      <SettingsPanel />
    </AppShell>
  );
}
