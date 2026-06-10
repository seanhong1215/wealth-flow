import { create } from "zustand";

export type TimeRange = "1M" | "6M" | "1Y" | "5Y";

type WealthState = {
  range: TimeRange;
  monthlyContribution: number;
  retirementAge: number;
  setRange: (range: TimeRange) => void;
  setMonthlyContribution: (amount: number) => void;
  setRetirementAge: (age: number) => void;
};

export const useWealthStore = create<WealthState>((set) => ({
  range: "1Y",
  monthlyContribution: 25000,
  retirementAge: 55,
  setRange: (range) => set({ range }),
  setMonthlyContribution: (monthlyContribution) => set({ monthlyContribution }),
  setRetirementAge: (retirementAge) => set({ retirementAge })
}));

