export type InvestmentProfile = {
  age: number;
  retirementAge: number;
  monthlyInvestment: number;
  monthlyExpense: number;
  style: "保守" | "均衡" | "成長";
};

export type AccountHolding = {
  etf: string;
  name: string;
  asset: string;
  shares: number;
  avg: number;
  current: number;
  target: number;
  currency: string;
};

export type AccountState = {
  userId: string;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  profile: InvestmentProfile | null;
  holdings: AccountHolding[];
  watchlist: Array<{
    symbol: string;
    name: string;
    market: string;
    assetClass: string;
  }>;
  transactions: Array<{
    date: string;
    type: string;
    symbol: string;
    amount: string;
    price: string;
    status: string;
  }>;
  settings: {
    profile: Record<string, string>;
    assumptions: Record<string, string>;
    display: Record<string, string>;
  };
};

export const accountStorageKey = "wealthflow:legacy-cache";

export const emptyAccountState: AccountState = {
  userId: "",
  isAuthenticated: false,
  onboardingComplete: false,
  profile: null,
  holdings: [],
  watchlist: [],
  transactions: [],
  settings: {
    profile: {},
    assumptions: {},
    display: {}
  }
};

export async function readAccountState(): Promise<AccountState> {
  const response = await fetch("/api/account", { cache: "no-store" });
  if (response.status === 401) return emptyAccountState;
  if (!response.ok) throw new Error("account load failed");
  return normalizeAccount(await response.json());
}

export async function writeAccountState(next: AccountState): Promise<AccountState> {
  const response = await fetch("/api/account", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(next)
  });
  if (!response.ok) throw new Error("account save failed");
  const saved = normalizeAccount(await response.json());
  window.dispatchEvent(new CustomEvent("wealthflow:account-updated"));
  return saved;
}

export async function loginAccount(email: string): Promise<AccountState> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  if (!response.ok) throw new Error("login failed");
  const account = normalizeAccount(await response.json());
  window.dispatchEvent(new CustomEvent("wealthflow:account-updated"));
  return account;
}

export async function clearAccountState() {
  await fetch("/api/logout", { method: "POST" });
  window.dispatchEvent(new CustomEvent("wealthflow:account-updated"));
}

export function isProfileValid(profile: InvestmentProfile | null) {
  if (!profile) return false;
  return (
    Number.isFinite(profile.age) &&
    Number.isFinite(profile.retirementAge) &&
    Number.isFinite(profile.monthlyInvestment) &&
    Number.isFinite(profile.monthlyExpense) &&
    profile.age > 0 &&
    profile.retirementAge > profile.age &&
    profile.monthlyInvestment >= 0 &&
    profile.monthlyExpense > 0
  );
}

export function isHoldingValid(holding: AccountHolding) {
  return (
    holding.etf.trim().length > 0 &&
    holding.name.trim().length > 0 &&
    Number.isFinite(holding.shares) &&
    Number.isFinite(holding.avg) &&
    Number.isFinite(holding.target) &&
    holding.shares > 0 &&
    holding.avg >= 0 &&
    holding.target > 0 &&
    holding.target <= 100
  );
}

export function canEnterDashboard(account: AccountState) {
  return (
    account.isAuthenticated &&
    account.onboardingComplete &&
    isProfileValid(account.profile) &&
    account.holdings.some(isHoldingValid)
  );
}

function normalizeAccount(input: Partial<AccountState>): AccountState {
  return {
    ...emptyAccountState,
    ...input,
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
