import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AccountState } from "@/lib/account-store";
import { getAccount, saveAccount } from "@/lib/server-account-db";

export async function GET() {
  const userId = await currentUser();
  if (!userId) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  return NextResponse.json(getAccount(userId));
}

export async function PUT(request: Request) {
  const userId = await currentUser();
  if (!userId) return NextResponse.json({ message: "unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({})) as AccountState;
  return NextResponse.json(saveAccount(userId, body));
}

async function currentUser() {
  const store = await cookies();
  return store.get("wealthflow_user")?.value ?? "";
}
