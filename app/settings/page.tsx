import { AppShell } from "@/components/wealth/app-shell";
import { SettingsPanel } from "@/components/wealth/settings-panel";
import { PageHeading } from "@/components/wealth/primitives";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="設定" title="個人資料與偏好設定" description="管理個人資料、投資假設與顯示偏好。" />
      <SettingsPanel />
    </AppShell>
  );
}
