import { AppShell } from "@/components/wealth/app-shell";
import { EmptyState, LoadingState, PageHeading, StateCard } from "@/components/wealth/primitives";
import { Card } from "@/components/ui/card";
import { paymentRecommendations } from "@/lib/wealth-data";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="設定" title="個人資料、API 與金流策略" description="管理投資假設、顯示偏好、Massive API key 設定方式，以及金流是否適合放進產品。" />
      <div className="grid gap-4 xl:grid-cols-3">
        <SettingsCard title="個人資料" fields={["姓名 Sean Hong", "基準幣別 USD", "國家 Taiwan", "時區 Asia/Taipei"]} />
        <SettingsCard title="投資假設" fields={["預期報酬 8%", "通膨率 2.5%", "提領率 4%", "稅率 10%"]} />
        <SettingsCard title="Massive API" fields={["環境變數 MASSIVE_API_KEY", "伺服器代理 /api/market", "前端不暴露 key", "快取 300 秒"]} />
      </div>
 
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EmptyState />
        <LoadingState />
        <StateCard type="error" title="API 錯誤" message="無法同步市場價格，請檢查 MASSIVE_API_KEY 後重試。" action="再試一次" />
        <StateCard type="success" title="正常狀態" message="Massive API 已設定，市場價格可同步。" action="查看儀表板" />
      </div>
    </AppShell>
  );
}

function SettingsCard({ title, fields }: { title: string; fields: string[] }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="space-y-3">
        {fields.map((field) => <div key={field} className="rounded-md border border-border bg-white px-3 py-2 text-sm">{field}</div>)}
      </div>
    </Card>
  );
}
