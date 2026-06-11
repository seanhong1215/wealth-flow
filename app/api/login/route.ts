import { NextResponse } from "next/server";
import { getAccount, isValidEmail, normalizeEmail } from "@/lib/server-account-db";

const sessionCookie = "wealthflow_user";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = normalizeEmail(String(body.email ?? ""));

  if (!isValidEmail(email)) {
    return NextResponse.json({ message: "invalid email" }, { status: 400 });
  }

  const account = getAccount(email);
  const response = NextResponse.json(account);
  response.cookies.set(sessionCookie, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
