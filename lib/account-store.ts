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
  transactions: Array<{
    date: string;
    type: string;
    symbol: string;
    amount: string;
    price: string;
    status: string;
  }>;
};

export const accountStorageKey = "wealthflow:user:seanhong1215:v2";

export const emptyAccountState: AccountState = {
  userId: "seanhong1215",
  isAuthenticated: false,
  onboardingComplete: false,
  profile: null,
  holdings: [],
  transactions: []
};

export function readAccountState(): AccountState {
  if (typeof window === "undefined") return emptyAccountState;
  try {
    const raw = window.localStorage.getItem(accountStorageKey);
    if (!raw) return emptyAccountState;
    return { ...emptyAccountState, ...JSON.parse(raw) };
  } catch {
    return emptyAccountState;
  }
}

export function writeAccountState(next: AccountState) {
  window.localStorage.setItem(accountStorageKey, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("wealthflow:account-updated"));
}

export function clearAccountState() {
  window.localStorage.removeItem(accountStorageKey);
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
