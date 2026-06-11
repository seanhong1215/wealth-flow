import { AppShell } from "@/components/wealth/app-shell";
import { WatchlistClient } from "@/components/wealth/watchlist-client";
import { PageHeading } from "@/components/wealth/primitives";

export default function WatchlistPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="ETF 觀察清單" title="追蹤關注 ETF" description="整理你關注的 ETF，快速查看價格與基本資訊。" />
      <WatchlistClient />
    </AppShell>
  );
}
