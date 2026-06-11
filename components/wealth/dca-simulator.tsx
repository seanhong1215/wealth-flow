"use client";

import { useMemo, useState } from "react";
import { BarChart3, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { KpiCard } from "./primitives";

type DcaInput = {
  initial: number;
  monthly: number;
  annualReturn: number;
  years: number;
  frequency: "monthly" | "quarterly";
  currency: "USD" | "TWD";
};

const defaults: DcaInput = {
  initial: 0,
  monthly: 0,
  annualReturn: 0,
  years: 0,
  frequency: "monthly",
  currency: "USD"
};

export function DcaSimulator() {
  const [input, setInput] = useState<DcaInput>(defaults);
  const errors = validate(input);
  const projection = useMemo(() => calculateProjection(input), [input]);
  const last = projection[projection.length - 1];
  const totalContribution = input.initial + contributionPerMonth(input) * input.years * 12;
  const gain = Math.max(last.value - totalContribution, 0);

  function setNumber(field: keyof Pick<DcaInput, "initial" | "monthly" | "annualReturn" | "years">, value: string) {
    setInput((current) => ({ ...current, [field]: Number(value) }));
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">輸入條件</h3>
            <Calculator className="h-5 w-5 text-primary" />
          </div>
          <div className="grid gap-3">
            <NumberField label="初始投入" value={input.initial} error={errors.initial} onChange={(value) => setNumber("initial", value)} />
            <NumberField label="每月投入" value={input.monthly} error={errors.monthly} onChange={(value) => setNumber("monthly", value)} />
            <NumberField label="預期年化報酬 %" value={input.annualReturn} error={errors.annualReturn} onChange={(value) => setNumber("annualReturn", value)} />
            <NumberField label="投資期間 年" value={input.years} error={errors.years} onChange={(value) => setNumber("years", value)} />
            <label className="block">
              <span className="mb-1 block text-sm font-medium">投入頻率</span>
              <select
                value={input.frequency}
                onChange={(event) => setInput((current) => ({ ...current, frequency: event.target.value as DcaInput["frequency"] }))}
                className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="monthly">每月</option>
                <option value="quarterly">每季</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium">幣別</span>
              <select
                value={input.currency}
                onChange={(event) => setInput((current) => ({ ...current, currency: event.target.value as DcaInput["currency"] }))}
                className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              >
                <option value="USD">USD</option>
                <option value="TWD">TWD</option>
              </select>
            </label>
          </div>
          <Button className="mt-5 w-full" variant="primary" onClick={() => setInput(defaults)}>清空條件</Button>
        </Card>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="最終資產" value={formatMoney(last.value, input.currency)} trend={input.years ? `+${input.annualReturn}% 年化` : "未設定"} note="輸入條件後開始試算" />
            <KpiCard label="總投入" value={formatMoney(totalContribution, input.currency)} trend={input.years ? `${input.years} 年` : "未設定"} note="本金合計" />
            <KpiCard label="預估收益" value={formatMoney(gain, input.currency)} trend={`+${Math.round((gain / Math.max(totalContribution, 1)) * 100)}%`} note="稅費前估算" />
            <KpiCard label="年化報酬" value={`${input.annualReturn.toFixed(1)}%`} trend="目前情境" note="輸入後即時計算" />
          </div>
          <Card className="p-5">
            <div className="mb-5 flex items-center justify-between">
              <div><h3 className="font-semibold">投入本金 vs 投資組合價值</h3><p className="text-sm text-muted-foreground">藍色為資產價值，灰色為累積投入本金。</p></div>
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex h-64 items-end gap-2 border-b border-l border-border px-2">
              {projection.map((point) => {
                const max = Math.max(...projection.map((item) => item.value), 1);
                return (
                  <div key={point.year} className="relative flex flex-1 items-end">
                    <div className="absolute bottom-0 w-full rounded-t-sm bg-slate-300 opacity-50" style={{ height: `${(point.contribution / max) * 230}px` }} />
                    <div className="relative w-full rounded-t-md bg-primary" style={{ height: `${(point.value / max) * 230}px` }} />
                  </div>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-6 gap-1 text-center text-xs text-muted-foreground md:grid-cols-12">{projection.map((point) => <span key={point.year}>{point.year}</span>)}</div>
          </Card>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[5, 8, 10].map((rate) => {
          const scenario = calculateProjection({ ...input, annualReturn: rate }).at(-1);
          return (
            <Card key={rate} className="p-5">
              <p className="text-sm text-muted-foreground">{rate === 5 ? "保守" : rate === 8 ? "均衡" : "成長"}情境 {rate}%</p>
              <p className="mt-2 text-xl font-semibold">{formatMoney(scenario?.value ?? 0, input.currency)}</p>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function NumberField({ label, value, error, onChange }: { label: string; value: number; error?: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        type="number"
        value={Number.isNaN(value) || value === 0 ? "" : value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        aria-invalid={Boolean(error)}
      />
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

function validate(input: DcaInput) {
  return {
    initial: input.initial < 0 || Number.isNaN(input.initial) ? "初始投入不可為負數或空白" : "",
    monthly: input.monthly < 0 || Number.isNaN(input.monthly) ? "每月投入不可為負數或空白" : "",
    annualReturn: input.annualReturn < -50 || input.annualReturn > 50 || Number.isNaN(input.annualReturn) ? "年化報酬需介於 -50% 到 50%" : "",
    years: input.years < 0 || input.years > 80 || Number.isNaN(input.years) ? "期間需介於 1 到 80 年" : ""
  };
}

function contributionPerMonth(input: DcaInput) {
  return input.frequency === "monthly" ? input.monthly : input.monthly / 3;
}

function calculateProjection(input: DcaInput) {
  const years = Number.isFinite(input.years) && input.years > 0 ? Math.min(Math.round(input.years), 80) : 1;
  const monthlyRate = Math.max(input.annualReturn, -50) / 100 / 12;
  const monthlyContribution = Math.max(contributionPerMonth(input), 0);
  let value = Math.max(input.initial, 0);
  const points = [];
  for (let year = 1; year <= years; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      value = value * (1 + monthlyRate) + monthlyContribution;
    }
    points.push({
      year,
      value,
      contribution: Math.max(input.initial, 0) + monthlyContribution * year * 12
    });
  }
  return points;
}

function formatMoney(value: number, currency: DcaInput["currency"]) {
  return new Intl.NumberFormat(currency === "TWD" ? "zh-TW" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}
