"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { allocations, holdings } from "@/lib/wealth-data";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./primitives";

export function AllocationPlanner() {
  const [targets, setTargets] = useState(() => allocations.map((item) => item.value));
  const [saved, setSaved] = useState(false);
  const total = useMemo(() => targets.reduce((sum, value) => sum + value, 0), [targets]);

  function updateTarget(index: number, value: number) {
    setSaved(false);
    setTargets((current) => current.map((target, targetIndex) => targetIndex === index ? value : target));
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
      <Card className="p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-semibold">配置比較與目標調整</h3>
            <p className="mt-1 text-sm text-muted-foreground">拖曳各 ETF 目標比例後套用，總和需維持 100%。</p>
          </div>
          <SlidersHorizontal className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-5">
          {allocations.map((item, index) => (
            <div key={item.symbol}>
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium">{item.symbol} · {item.label}</span>
                <span className="text-muted-foreground">目前 {holdings[index].current}% / 目標 {targets[index]}%</span>
              </div>
              <div className="grid gap-2 md:grid-cols-[1fr_150px] md:items-center">
                <div className="grid grid-cols-2 gap-2">
                  <ProgressBar value={holdings[index].current} />
                  <ProgressBar value={targets[index]} subtle />
                </div>
                <input
                  aria-label={`${item.symbol} 目標配置`}
                  type="range"
                  min="0"
                  max="80"
                  value={targets[index]}
                  onChange={(event) => updateTarget(index, Number(event.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-slate-50 p-3 text-sm">
          <span className={cn("font-medium", total === 100 ? "text-success" : "text-danger")}>目標配置總和：{total}%</span>
          <Button variant="primary" disabled={total !== 100} onClick={() => setSaved(true)}>
            套用目標配置
          </Button>
        </div>
        {saved ? (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-success">
            <CheckCircle2 className="h-4 w-4" />
            目標配置已更新。
          </div>
        ) : null}
      </Card>
      <Card className="p-5">
        <h3 className="mb-4 font-semibold">再平衡建議</h3>
        <div className="space-y-3 text-sm">
          <p className="rounded-lg border border-border bg-amber-50 p-3">CSPX 超配 5%，下次投入可暫緩增加。</p>
          <p className="rounded-lg border border-border bg-emerald-50 p-3">VWRA 低配 3%，建議下一筆定期定額優先補足。</p>
          <p className="rounded-lg border border-border bg-slate-50 p-3">SGOV 落在目標區間內，維持現有配置。</p>
        </div>
      </Card>
    </div>
  );
}
