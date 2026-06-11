"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleDollarSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mobileRoutes, routes } from "@/lib/wealth-data";
import { cn } from "@/lib/utils";
import { SearchBox } from "./actions";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-background pb-20 text-foreground lg:pb-0">
      <div className="grid min-h-screen lg:grid-cols-[272px_1fr]">
        <Sidebar />
        <section className="min-w-0">
          <Topbar />
          <div className="mx-auto max-w-[1440px] space-y-6 px-4 py-6 md:px-8">
            {children}
          </div>
        </section>
      </div>
      <MobileBottomNav />
    </main>
  );
}

function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen border-r border-border bg-white px-5 py-6 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
          <CircleDollarSign className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold">WealthFlow</p>
          <p className="text-xs text-muted-foreground">長期 ETF 財富中樞</p>
        </div>
      </div>
      <nav className="space-y-1">
        {routes.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-slate-50 hover:text-foreground",
                active && "bg-blue-50 text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold md:text-2xl">WealthFlow 投資儀表板</h1>
          <p className="hidden text-sm text-muted-foreground sm:block">
            路由式 ETF 資產追蹤、長期模擬與退休規劃
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBox />
          <Link href="/settings" className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-white text-foreground hover:bg-slate-50" aria-label="偏好設定">
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-white px-2 py-2 lg:hidden">
      {mobileRoutes.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("flex flex-col items-center gap-1 text-[11px] text-muted-foreground", active && "text-primary")}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
