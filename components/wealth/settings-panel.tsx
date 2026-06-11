"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { emptyAccountState, readAccountState, writeAccountState } from "@/lib/account-store";

const groups = [
  {
    title: "個人資料",
    fields: [
      ["姓名", ""],
      ["基準幣別", ""],
      ["國家", ""],
      ["時區", ""]
    ]
  },
  {
    title: "投資假設",
    fields: [
      ["預期報酬", ""],
      ["通膨率", ""],
      ["提領率", ""],
      ["稅率", ""]
    ]
  },
  {
    title: "顯示偏好",
    fields: [
      ["貨幣格式", ""],
      ["主題", ""],
      ["圖表樣式", ""],
      ["更新方式", ""]
    ]
  }
];

export function SettingsPanel() {
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState({
    profile: {} as Record<string, string>,
    assumptions: {} as Record<string, string>,
    display: {} as Record<string, string>
  });

  useEffect(() => {
    readAccountState()
      .then((account) => setValues(account.settings))
      .catch(() => setValues(emptyAccountState.settings));
  }, []);

  function update(section: keyof typeof values, label: string, value: string) {
    setValues((current) => ({
      ...current,
      [section]: { ...current[section], [label]: value }
    }));
  }

  async function saveSettings() {
    const account = await readAccountState().catch(() => emptyAccountState);
    await writeAccountState({ ...account, settings: values });
    setSaved(true);
  }

  return (
    <>
      <div className="grid gap-4 xl:grid-cols-3">
        {groups.map((group) => {
          const key = group.title === "個人資料" ? "profile" : group.title === "投資假設" ? "assumptions" : "display";
          return (
          <Card key={group.title} className="p-5">
            <h3 className="mb-4 font-semibold">{group.title}</h3>
            <div className="space-y-3">
              {group.fields.map(([label, value]) => (
                <label key={label} className="block">
                  <span className="mb-1 block text-sm font-medium">{label}</span>
                  <input value={values[key][label] ?? value} onChange={(event) => update(key, label, event.target.value)} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
                </label>
              ))}
            </div>
            <Button className="mt-5 w-full" variant="primary" onClick={saveSettings}>儲存{group.title}</Button>
          </Card>
        );})}
      </div>
      {saved ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-success" role="status">
          <CheckCircle2 className="h-4 w-4" />
          設定已儲存。
        </div>
      ) : null}
    </>
  );
}
