import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { AccountState, emptyAccountState } from "@/lib/account-store";

const dataDir = path.join(process.cwd(), ".data");
const dbPath = path.join(dataDir, "wealthflow.sqlite");

let db: DatabaseSync | null = null;

type AccountRow = {
  data: string;
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function getAccount(email: string): AccountState {
  const userId = normalizeEmail(email);
  const row = database().prepare("select data from accounts where user_id = ?").get(userId) as AccountRow | undefined;
  if (!row) return createAccount(userId);
  return normalizeAccount(JSON.parse(row.data), userId);
}

export function saveAccount(email: string, account: AccountState): AccountState {
  const userId = normalizeEmail(email);
  const clean = normalizeAccount(account, userId);
  database()
    .prepare("insert into accounts (user_id, data, updated_at) values (?, ?, datetime('now')) on conflict(user_id) do update set data = excluded.data, updated_at = datetime('now')")
    .run(userId, JSON.stringify(clean));
  return clean;
}

function createAccount(userId: string): AccountState {
  const account = normalizeAccount({ ...emptyAccountState, userId, isAuthenticated: true }, userId);
  database()
    .prepare("insert into accounts (user_id, data, updated_at) values (?, ?, datetime('now')) on conflict(user_id) do nothing")
    .run(userId, JSON.stringify(account));
  return account;
}

function database() {
  if (db) return db;
  mkdirSync(dataDir, { recursive: true });
  db = new DatabaseSync(dbPath);
  db.exec(`
    create table if not exists accounts (
      user_id text primary key,
      data text not null,
      updated_at text not null
    );
  `);
  return db;
}

function normalizeAccount(input: Partial<AccountState>, userId: string): AccountState {
  return {
    ...emptyAccountState,
    ...input,
    userId,
    isAuthenticated: true,
    holdings: Array.isArray(input.holdings) ? input.holdings : [],
    watchlist: Array.isArray(input.watchlist) ? input.watchlist : [],
    transactions: Array.isArray(input.transactions) ? input.transactions : [],
    settings: {
      profile: input.settings?.profile ?? {},
      assumptions: input.settings?.assumptions ?? {},
      display: input.settings?.display ?? {}
    }
  };
}
