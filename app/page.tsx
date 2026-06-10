"use client";

import {
  ArrowUpRight,
  Bell,
  Calculator,
  CandlestickChart,
  CircleDollarSign,
  Flame,
  LineChart,
  Menu,
  PieChart,
  Plus,
  Search,
  Settings,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TimeRange, useWealthStore } from "@/lib/wealth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", icon: LineChart },
  { label: "Portfolio", icon: WalletCards },
  { label: "Simulator", icon: Calculator },
  { label: "Retirement", icon: Flame },
  { label: "Watchlist", icon: CandlestickChart }
];

const allocation = [
  { label: "US ETF", value: 48, color: "bg-blue-600" },
  { label: "Global ETF", value: 24, color: "bg-cyan-500" },
  { label: "Bond ETF", value: 18, color: "bg-emerald-500" },
  { label: "Cash", value: 10, color: "bg-slate-400" }
];

const holdings = [
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", value: "$42,850", gain: "+12.4%" },
  { ticker: "VT", name: "Total World Stock ETF", value: "$28,420", gain: "+8.1%" },
  { ticker: "BND", name: "Total Bond Market ETF", value: "$15,300", gain: "+2.2%" }
];

const transactions = [
  { date: "Jun 05", action: "Buy", target: "VOO", amount: "$1,200" },
  { date: "May 20", action: "DCA", target: "VT", amount: "$900" },
  { date: "May 08", action: "Dividend", target: "BND", amount: "$78" }
];

const watchlist = [
  { ticker: "QQQM", price: "$183.22", move: "+1.8%", volume: "2.1M" },
  { ticker: "SCHD", price: "$78.04", move: "+0.7%", volume: "4.8M" },
  { ticker: "VTI", price: "$268.91", move: "-0.2%", volume: "3.2M" }
];

const performanceBars = [42, 56, 48, 68, 74, 71, 86, 82, 91, 96, 103, 118];
const ranges: TimeRange[] = ["1M", "6M", "1Y", "5Y"];

export default function Home() {
  const {
    range,
    monthlyContribution,
    retirementAge,
    setRange,
    setMonthlyContribution,
    setRetirementAge
  } = useWealthStore();

  const projectedValue = Math.round(monthlyContribution * 12 * 18 * 1.72);
  const fireProgress = Math.min(82, Math.round((projectedValue / 12000000) * 100));

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-white px-5 py-6 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
              <CircleDollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold">WealthFlow</p>
              <p className="text-xs text-muted-foreground">ETF FIRE Console</p>
            </div>
          </div>
          <nav className="space-y-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={`#${item.label.toLowerCase()}`}
                  className={cn(
                    "flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-slate-50 hover:text-foreground",
                    index === 0 && "bg-blue-50 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0">
          <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button className="h-10 w-10 px-0 lg:hidden" aria-label="Open navigation">
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-xl font-semibold md:text-2xl">WealthFlow</h1>
                  <p className="hidden text-sm text-muted-foreground sm:block">
                    Personal investment dashboard for long-term ETF investors
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button className="hidden gap-2 md:inline-flex">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button className="h-10 w-10 px-0" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button className="h-10 w-10 px-0" aria-label="Settings">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <div className="space-y-8 px-4 py-6 md:px-8">
            <section id="dashboard" className="space-y-5">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
                  <p className="text-sm text-muted-foreground">
                    Track allocation, performance, and FIRE readiness in one workspace.
                  </p>
                </div>
                <div className="flex rounded-lg border border-border bg-white p-1">
                  {ranges.map((item) => (
                    <button
                      key={item}
                      onClick={() => setRange(item)}
                      className={cn(
                        "h-8 min-w-12 rounded-md px-3 text-sm font-medium text-muted-foreground",
                        range === item && "bg-primary text-white"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Total Net Worth" value="$186,420" change="+9.8%" />
                <MetricCard label="Monthly DCA" value="$2,500" change="+$300" />
                <MetricCard label="Annual Return" value="11.6%" change="+1.4%" />
                <MetricCard label="FIRE Progress" value={`${fireProgress}%`} change="+5%" />
              </div>

              <div className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
                <Card className="p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Performance</h3>
                      <p className="text-sm text-muted-foreground">Portfolio growth over {range}</p>
                    </div>
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex h-64 items-end gap-2">
                    {performanceBars.map((height, index) => (
                      <div
                        key={index}
                        className="flex flex-1 items-end rounded-t-md bg-blue-100"
                        style={{ height: `${Math.max(24, height * 1.8)}px` }}
                      >
                        <div
                          className="w-full rounded-t-md bg-primary"
                          style={{ height: `${Math.max(20, height * 1.22)}px` }}
                        />
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Asset Allocation</h3>
                      <p className="text-sm text-muted-foreground">Current target mix</p>
                    </div>
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-4">
                    {allocation.map((item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{item.value}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className={cn("h-2 rounded-full", item.color)}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </section>

            <section id="portfolio" className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
              <Card className="p-5">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Portfolio Holdings</h2>
                    <p className="text-sm text-muted-foreground">Core ETF positions</p>
                  </div>
                  <Button variant="primary" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
                <div className="space-y-3">
                  {holdings.map((item) => (
                    <div
                      key={item.ticker}
                      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border p-3"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 font-semibold text-primary">
                        {item.ticker}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value}</p>
                      </div>
                      <p className="text-sm font-semibold text-success">{item.gain}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="mb-1 text-xl font-semibold">Transactions</h2>
                <p className="mb-5 text-sm text-muted-foreground">Recent activity</p>
                <div className="space-y-3">
                  {transactions.map((item) => (
                    <div key={`${item.date}-${item.target}`} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.action} {item.target}</p>
                        <p className="text-sm text-muted-foreground">{item.date}</p>
                      </div>
                      <p className="font-semibold">{item.amount}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </section>

            <section id="simulator" className="grid gap-4 xl:grid-cols-2">
              <Card className="p-5">
                <h2 className="text-xl font-semibold">DCA Simulator</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Estimate future value from recurring ETF contributions.
                </p>
                <label className="text-sm font-medium" htmlFor="monthlyContribution">
                  Monthly contribution
                </label>
                <input
                  id="monthlyContribution"
                  type="range"
                  min="5000"
                  max="80000"
                  step="1000"
                  value={monthlyContribution}
                  onChange={(event) => setMonthlyContribution(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <SummaryTile label="Monthly" value={`$${monthlyContribution.toLocaleString()}`} />
                  <SummaryTile label="Projected" value={`$${projectedValue.toLocaleString()}`} />
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="text-xl font-semibold">Lump Sum Comparison</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Compare immediate deployment against staged investing.
                </p>
                <div className="space-y-4">
                  <ComparisonRow label="Lump Sum" value="68%" />
                  <ComparisonRow label="12M DCA" value="58%" />
                  <ComparisonRow label="24M DCA" value="49%" />
                </div>
              </Card>
            </section>

            <section id="retirement" className="grid gap-4 xl:grid-cols-[0.85fr_1fr]">
              <Card className="p-5">
                <h2 className="text-xl font-semibold">Retirement Calculator</h2>
                <p className="mb-6 text-sm text-muted-foreground">Plan your FIRE target age.</p>
                <label className="text-sm font-medium" htmlFor="retirementAge">
                  Target retirement age
                </label>
                <input
                  id="retirementAge"
                  type="range"
                  min="40"
                  max="70"
                  value={retirementAge}
                  onChange={(event) => setRetirementAge(Number(event.target.value))}
                  className="mt-4 w-full accent-primary"
                />
                <div className="mt-5 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-muted-foreground">Estimated age</p>
                  <p className="text-3xl font-semibold">{retirementAge}</p>
                </div>
              </Card>

              <Card className="p-5">
                <h2 className="text-xl font-semibold">FIRE Path</h2>
                <p className="mb-6 text-sm text-muted-foreground">Capital needed at 4% withdrawal rate.</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <SummaryTile label="Annual Spend" value="$48,000" />
                  <SummaryTile label="FIRE Number" value="$1.2M" />
                  <SummaryTile label="Years Left" value={`${Math.max(0, retirementAge - 34)}`} />
                </div>
              </Card>
            </section>

            <section id="watchlist">
              <Card className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">ETF Watchlist</h2>
                    <p className="text-sm text-muted-foreground">Monitor candidates before adding to portfolio.</p>
                  </div>
                  <Button className="gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="text-muted-foreground">
                      <tr className="border-b border-border">
                        <th className="py-3 font-medium">Ticker</th>
                        <th className="py-3 font-medium">Price</th>
                        <th className="py-3 font-medium">Move</th>
                        <th className="py-3 font-medium">Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {watchlist.map((item) => (
                        <tr key={item.ticker} className="border-b border-border last:border-0">
                          <td className="py-4 font-semibold">{item.ticker}</td>
                          <td className="py-4">{item.price}</td>
                          <td
                            className={cn(
                              "py-4 font-medium",
                              item.move.startsWith("-") ? "text-danger" : "text-success"
                            )}
                          >
                            {item.move}
                          </td>
                          <td className="py-4 text-muted-foreground">{item.volume}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  change
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold">{value}</p>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-success">
          {change}
        </span>
      </div>
    </Card>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

function ComparisonRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}</span>
      </div>
      <div className="h-3 rounded-full bg-slate-100">
        <div className="h-3 rounded-full bg-primary" style={{ width: value }} />
      </div>
    </div>
  );
}

