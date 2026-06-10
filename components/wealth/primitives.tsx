"use client";

import { AlertTriangle, CheckCircle2, Loader2, Plus, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {actions}
    </div>
  );
}

export function KpiCard({ label, value, trend, note }: { label: string; value: string; trend: string; note: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-2xl font-semibold">{value}</p>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-success">{trend}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{note}</p>
    </Card>
  );
}

export function ProgressBar({ value, subtle = false }: { value: number; subtle?: boolean }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full", subtle ? "bg-slate-400" : "bg-primary")} style={{ width: `${value}%` }} />
    </div>
  );
}

export function SummaryTile({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-xl font-semibold", danger && "text-danger")}>{value}</p>
    </div>
  );
}

export function TableHeader({ title, action }: { title: string; action?: string }) {
  function handleAction() {
    alert(`${action} 功能已觸發。`);
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
      <h3 className="font-semibold">{title}</h3>
      {action ? (
        <Button className="gap-2" variant="primary" onClick={handleAction}>
          <Plus className="h-4 w-4" />
          {action}
        </Button>
      ) : null}
    </div>
  );
}

export function Ticker({ symbol }: { symbol: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-primary">
      {symbol}
    </div>
  );
}

export function StateCard({ type, title, message, action }: { type: "success" | "error"; title: string; message: string; action: string }) {
  const Icon = type === "success" ? CheckCircle2 : AlertTriangle;
  function handleAction() {
    alert(`${action} 功能已觸發。`);
  }

  return (
    <Card className="p-5">
      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-md", type === "success" ? "bg-emerald-50 text-success" : "bg-red-50 text-danger")}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      <Button className="mt-5" onClick={handleAction}>{action}</Button>
    </Card>
  );
}

export function EmptyState() {
  function handleAdd() {
    alert("請前往投資組合頁新增第一檔 ETF。");
  }

  return (
    <Card className="flex min-h-64 flex-col items-center justify-center p-5 text-center">
      <WalletCards className="mb-4 h-10 w-10 text-muted-foreground" />
      <h3 className="font-semibold">尚未新增任何持倉</h3>
      <p className="mt-2 text-sm text-muted-foreground">新增第一筆 ETF 後即可看到配置與損益。</p>
      <Button className="mt-5" variant="primary" onClick={handleAdd}>新增第一檔 ETF</Button>
    </Card>
  );
}

export function LoadingState() {
  return (
    <Card className="min-h-64 p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        資料載入中
      </div>
      <div className="space-y-3">
        <div className="h-10 rounded-md bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-md bg-slate-100" />
          <div className="h-20 rounded-md bg-slate-100" />
        </div>
        <div className="h-24 rounded-md bg-slate-100" />
      </div>
    </Card>
  );
}
