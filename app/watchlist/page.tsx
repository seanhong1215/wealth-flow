import { AppShell } from "@/components/wealth/app-shell";
import { WatchlistClient } from "@/components/wealth/watchlist-client";
import { PageHeading } from "@/components/wealth/primitives";

export default function WatchlistPage() {
  return (
    <AppShell>
      <PageHeading eyebrow="ETF 觀察清單" title="追蹤關注 ETF" description="價格透過 Massive.com REST API，由 Next server route 安全代理。" />
      <WatchlistClient />
    </AppShell>
  );
}
