"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingState, StateCard } from "./primitives";
import { paymentRecommendations } from "@/lib/wealth-data";

const groups = [
  {
    title: "個人資料",
    fields: [
      ["姓名", "Sean Hong"],
      ["基準幣別", "USD"],
      ["國家", "Taiwan"],
      ["時區", "Asia/Taipei"]
    ]
  },
  {
    title: "投資假設",
    fields: [
      ["預期報酬", "8%"],
      ["通膨率", "2.5%"],
      ["提領率", "4%"],
      ["稅率", "10%"]
    ]
  },
  {
    title: "顯示偏好",
    fields: [
      ["貨幣格式", "USD"],
      ["主題", "Light"],
      ["圖表樣式", "Compact"],
      ["資料同步", "Manual"]
    ]
  }
];

export function SettingsPanel() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.title} className="p-5">
            <h3 className="mb-4 font-semibold">{group.title}</h3>
            <div className="space-y-3">
              {group.fields.map(([label, value]) => (
                <label key={label} className="block">
                  <span className="mb-1 block text-sm font-medium">{label}</span>
                  <input defaultValue={value} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </label>
              ))}
            </div>
            <Button className="mt-5 w-full" variant="primary" onClick={() => setSaved(true)}>儲存{group.title}</Button>
          </Card>
        ))}
      </div>
      {saved ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-success" role="status">
          <CheckCircle2 className="h-4 w-4" />
          設定已儲存。
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EmptyState />
        <LoadingState />
        <StateCard type="error" title="API 錯誤" message="無法同步市場價格，請檢查 MASSIVE_API_KEY 後重試。" action="再試一次" />
        <StateCard type="success" title="正常狀態" message="Massive API 已設定，市場價格可同步。" action="查看儀表板" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {paymentRecommendations.map((item) => (
          <Card key={item.title} className="p-5">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
