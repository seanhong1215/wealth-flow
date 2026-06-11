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
