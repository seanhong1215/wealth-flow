"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { canEnterDashboard, loginAccount } from "@/lib/account-store";

export function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  async function login() {
    if (!email.includes("@")) {
      setError("請輸入有效的 Email。");
      return;
    }
    try {
      const account = await loginAccount(email);
      router.push(canEnterDashboard(account) ? "/dashboard" : "/onboarding");
    } catch {
      setError("登入失敗，請稍後再試。");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
            <CircleDollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xl font-semibold">WealthFlow</p>
            <p className="text-sm text-muted-foreground">登入你的投資儀表板</p>
          </div>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" />
        </label>
        {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
        <Button className="mt-5 w-full" variant="primary" onClick={login}>登入</Button>
      </Card>
    </main>
  );
}
