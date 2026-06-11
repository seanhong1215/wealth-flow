"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar, SummaryTile } from "./primitives";

type RetirementInput = {
  currentAge: number;
  retirementAge: number;
  monthlyExpense: number;
  inflationRate: number;
  withdrawalRate: number;
  currentPortfolio: number;
  currentMonthlyInvestment: number;
  expectedReturn: number;
};

const defaults: RetirementInput = {
  currentAge: 35,
  retirementAge: 60,
  monthlyExpense: 2800,
  inflationRate: 2.5,
  withdrawalRate: 4,
  currentPortfolio: 128450,
  currentMonthlyInvestment: 500,
  expectedReturn: 8
};

export function RetirementPlanner() {
  const [input, setInput] = useState(defaults);
  const errors = validate(input);
  const result = useMemo(() => calculate(input), [input]);

  function setNumber(field: keyof RetirementInput, value: string) {
    setInput((current) => ({ ...current, [field]: Number(value) }));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">退休輸入</h3>
        <div className="space-y-3 text-sm">
          <NumberField label="目前年齡" value={input.currentAge} error={errors.currentAge} onChange={(value) => setNumber("currentAge", value)} />
          <NumberField label="退休年齡" value={input.retirementAge} error={errors.retirementAge} onChange={(value) => setNumber("retirementAge", value)} />
          <NumberField label="每月支出" value={input.monthlyExpense} error={errors.monthlyExpense} onChange={(value) => setNumber("monthlyExpense", value)} />
          <NumberField label="通膨率 %" value={input.inflationRate} error={errors.inflationRate} onChange={(value) => setNumber("inflationRate", value)} />
          <NumberField label="提領率 %" value={input.withdrawalRate} error={errors.withdrawalRate} onChange={(value) => setNumber("withdrawalRate", value)} />
          <NumberField label="目前投資組合" value={input.currentPortfolio} error={errors.currentPortfolio} onChange={(value) => setNumber("currentPortfolio", value)} />
          <NumberField label="目前月投入" value={input.currentMonthlyInvestment} error={errors.currentMonthlyInvestment} onChange={(value) => setNumber("currentMonthlyInvestment", value)} />
        </div>
        <Button className="mt-5 w-full" onClick={() => setInput(defaults)}>還原預設值</Button>
      </Card>
      <div className="grid gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">FIRE Number</p>
          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-4xl font-semibold">{formatMoney(result.fireNumber)}</p>
              <p className="mt-2 text-sm text-muted-foreground">依提領率與通膨調整後退休年支出估算</p>
            </div>
            <Target className="h-10 w-10 text-primary" />
          </div>
          <div className="mt-5"><ProgressBar value={Math.min(result.progress, 100)} /></div>
          <p className="mt-2 text-sm text-muted-foreground">目前達成率 {result.progress.toFixed(1)}%</p>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 font-semibold">Age {input.currentAge} 目前 {formatMoney(input.currentPortfolio)}</Card>
          <Card className="p-5 font-semibold">Age {Math.round((input.currentAge + input.retirementAge) / 2)} 中繼點 {formatMoney(result.midpointTarget)}</Card>
          <Card className="p-5 font-semibold">Age {input.retirementAge} 退休目標 {formatMoney(result.fireNumber)}</Card>
        </div>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">缺口分析</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <SummaryTile label="所需月投入" value={formatMoney(result.requiredMonthly)} />
            <SummaryTile label="目前月投入" value={formatMoney(input.currentMonthlyInvestment)} />
            <SummaryTile label="投資缺口" value={formatMoney(Math.max(result.requiredMonthly - input.currentMonthlyInvestment, 0))} danger />
          </div>
          <Button className="mt-5 gap-2" variant="primary" onClick={() => setInput((current) => ({ ...current, currentMonthlyInvestment: Math.ceil(result.requiredMonthly) }))}>
            <SlidersHorizontal className="h-4 w-4" />
            調整每月投入
          </Button>
        </Card>
      </div>
    </div>
  );
}

function NumberField({ label, value, error, onChange }: { label: string; value: number; error?: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        type="number"
        value={Number.isNaN(value) ? "" : value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
        aria-invalid={Boolean(error)}
      />
      {error ? <span className="mt-1 block text-xs text-danger">{error}</span> : null}
    </label>
  );
}

function validate(input: RetirementInput) {
  return {
    currentAge: input.currentAge <= 0 || Number.isNaN(input.currentAge) ? "目前年齡需大於 0" : "",
    retirementAge: input.retirementAge <= input.currentAge || Number.isNaN(input.retirementAge) ? "退休年齡需大於目前年齡" : "",
    monthlyExpense: input.monthlyExpense <= 0 || Number.isNaN(input.monthlyExpense) ? "每月支出需大於 0" : "",
    inflationRate: input.inflationRate < 0 || input.inflationRate > 20 || Number.isNaN(input.inflationRate) ? "通膨率需介於 0 到 20%" : "",
    withdrawalRate: input.withdrawalRate <= 0 || input.withdrawalRate > 10 || Number.isNaN(input.withdrawalRate) ? "提領率需介於 0 到 10%" : "",
    currentPortfolio: input.currentPortfolio < 0 || Number.isNaN(input.currentPortfolio) ? "目前資產不可為負數" : "",
    currentMonthlyInvestment: input.currentMonthlyInvestment < 0 || Number.isNaN(input.currentMonthlyInvestment) ? "月投入不可為負數" : ""
  };
}

function calculate(input: RetirementInput) {
  const years = Math.max(input.retirementAge - input.currentAge, 1);
  const inflationAdjustedMonthlyExpense = input.monthlyExpense * (1 + input.inflationRate / 100) ** years;
  const fireNumber = (inflationAdjustedMonthlyExpense * 12) / Math.max(input.withdrawalRate / 100, 0.001);
  const progress = (Math.max(input.currentPortfolio, 0) / fireNumber) * 100;
  const monthlyRate = input.expectedReturn / 100 / 12;
  const months = years * 12;
  const futureCurrent = input.currentPortfolio * (1 + monthlyRate) ** months;
  const requiredMonthly = monthlyRate === 0
    ? Math.max((fireNumber - futureCurrent) / months, 0)
    : Math.max((fireNumber - futureCurrent) * monthlyRate / ((1 + monthlyRate) ** months - 1), 0);
  return {
    fireNumber,
    progress,
    midpointTarget: fireNumber / 2,
    requiredMonthly
  };
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}
