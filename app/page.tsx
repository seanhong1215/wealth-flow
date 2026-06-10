"use client";

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileBarChart,
  Flame,
  Home as HomeIcon,
  LineChart,
  Loader2,
  PieChart,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWealthStore } from "@/lib/wealth-store";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "儀表板", href: "#dashboard", icon: HomeIcon },
  { label: "投資組合", href: "#portfolio", icon: WalletCards },
  { label: "定期定額模擬", href: "#simulator", icon: Calculator },
  { label: "退休規劃", href: "#retirement", icon: Flame },
  { label: "ETF 觀察清單", href: "#watchlist", icon: LineChart },
  { label: "報表", href: "#reports", icon: FileBarChart },
  { label: "設定", href: "#settings", icon: Settings }
];

const mobileNav = [
  { label: "首頁", icon: HomeIcon },
  { label: "組合", icon: WalletCards },
  { label: "模擬", icon: Calculator },
  { label: "觀察", icon: LineChart },
  { label: "設定", icon: Settings }
];

const kpis = [
  { label: "總資產", value: "$128,450", trend: "+8.4% 今年", note: "含 CSPX、VWRA、0050、SGOV" },
  { label: "每月投入", value: "$500", trend: "+$50 較上月", note: "定期定額執行中" },
  { label: "退休時預估價值", value: "$742,800", trend: "+12.6% 預估", note: "以 8% 年化報酬估算" },
  { label: "退休進度", value: "42%", trend: "+3% 本季", note: "距 FIRE 目標仍需 $1.7M" }
];

const allocations = [
  { symbol: "CSPX", label: "美股核心", value: 50, color: "bg-blue-600", hex: "#2563EB" },
  { symbol: "VWRA", label: "全球股票", value: 25, color: "bg-cyan-500", hex: "#06B6D4" },
  { symbol: "0050", label: "台灣股票", value: 15, color: "bg-emerald-500", hex: "#16A34A" },
  { symbol: "SGOV", label: "短債現金", value: 10, color: "bg-amber-500", hex: "#F59E0B" }
];

const holdings = [
  {
    etf: "CSPX",
    name: "iShares Core S&P 500",
    asset: "美國股票",
    shares: "42.8",
    avg: "$482.10",
    price: "$548.32",
    value: "$23,468",
    gain: "+13.7%",
    current: "55%",
    target: "50%"
  },
  {
    etf: "VWRA",
    name: "Vanguard FTSE All-World",
    asset: "全球股票",
    shares: "108.0",
    avg: "$104.40",
    price: "$121.15",
    value: "$13,084",
    gain: "+16.0%",
    current: "22%",
    target: "25%"
  },
  {
    etf: "0050",
    name: "元大台灣 50",
    asset: "台灣股票",
    shares: "70",
    avg: "NT$156.2",
    price: "NT$184.7",
    value: "$12,718",
    gain: "+18.2%",
    current: "14%",
    target: "15%"
  },
  {
    etf: "SGOV",
    name: "iShares 0-3 Month Treasury",
    asset: "短期債券",
    shares: "194.0",
    avg: "$100.31",
    price: "$100.52",
    value: "$19,501",
    gain: "+0.2%",
    current: "9%",
    target: "10%"
  }
];

const transactions = [
  { date: "2026/06/05", type: "買入", symbol: "CSPX", amount: "$1,200", price: "$548.32", status: "已完成" },
  { date: "2026/06/03", type: "股息", symbol: "SGOV", amount: "$86", price: "-", status: "已入帳" },
  { date: "2026/05/20", type: "買入", symbol: "VWRA", amount: "$500", price: "$121.15", status: "已完成" },
  { date: "2026/05/10", type: "買入", symbol: "0050", amount: "NT$12,000", price: "NT$184.7", status: "已完成" }
];

const watchlist = [
  { symbol: "CSPX", name: "iShares Core S&P 500", market: "LSE", price: "$548.32", day: "+0.8%", ytd: "+12.4%", fee: "0.07%", asset: "美國股票" },
  { symbol: "VWRA", name: "Vanguard FTSE All-World", market: "LSE", price: "$121.15", day: "+0.4%", ytd: "+9.1%", fee: "0.22%", asset: "全球股票" },
  { symbol: "0050", name: "元大台灣 50", market: "TWSE", price: "NT$184.7", day: "-0.3%", ytd: "+18.7%", fee: "0.32%", asset: "台灣股票" },
  { symbol: "SGOV", name: "0-3 Month Treasury Bond", market: "NYSE", price: "$100.52", day: "+0.0%", ytd: "+2.4%", fee: "0.09%", asset: "短期債券" },
  { symbol: "EQQQ", name: "Invesco NASDAQ 100", market: "LSE", price: "$438.10", day: "+1.2%", ytd: "+16.2%", fee: "0.30%", asset: "科技股票" },
  { symbol: "AGGU", name: "iShares Global Aggregate Bond", market: "LSE", price: "$5.31", day: "-0.1%", ytd: "+1.8%", fee: "0.10%", asset: "全球債券" }
];

const growth = [22, 28, 34, 42, 50, 57, 66, 73, 81, 94, 108, 124];
const contribution = [18, 23, 28, 33, 38, 43, 48, 53, 58, 63, 68, 73];
const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const sectionClassName = "scroll-mt-28 space-y-4";
const workflowSteps = [
  "新手引導",
  "主儀表板",
  "投資組合",
  "交易流程",
  "定期定額",
  "退休規劃",
  "觀察清單",
  "報表",
  "設定"
];

export default function Home() {
  const { monthlyContribution, retirementAge, setMonthlyContribution, setRetirementAge } =
    useWealthStore();

  const finalValue = Math.round(8000 * 1.08 ** 25 + monthlyContribution * 12 * 25 * 1.85);
  const fireProgress = 42;

  return (
    <main className="min-h-screen bg-background pb-20 text-foreground lg:pb-0">
      <div className="grid min-h-screen lg:grid-cols-[272px_1fr]">
        <Sidebar />
        <section className="min-w-0">
          <Topbar />
          <div className="mx-auto max-w-[1440px] space-y-8 px-4 py-6 md:px-8">
            <AlertBanner />
            <WorkflowRail />
            <OnboardingFlow />
            <Dashboard fireProgress={fireProgress} />
            <Portfolio />
            <TransactionFlow />
            <DcaSimulator
              finalValue={finalValue}
              monthlyContribution={monthlyContribution}
              setMonthlyContribution={setMonthlyContribution}
            />
            <RetirementPlanner
              retirementAge={retirementAge}
              setRetirementAge={setRetirementAge}
            />
            <Watchlist />
            <Reports />
            <SettingsPanel />
            <UiStates />
          </div>
        </section>
      </div>
      <MobileBottomNav />
    </main>
  );
}

function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen border-r border-border bg-white px-5 py-6 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-white">
          <CircleDollarSign className="h-6 w-6" />
        </div>
        <div>
          <p className="text-lg font-semibold">WealthFlow</p>
          <p className="text-xs text-muted-foreground">長期 ETF 財富中樞</p>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={item.href}
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
      <Card className="mt-8 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="h-4 w-4 text-success" />
          資料安全
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          僅同步市場價格與投資紀錄，不儲存券商登入密碼。
        </p>
      </Card>
      <Card className="mt-4 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">本月進度</p>
        <div className="mt-3 space-y-3">
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>定期定額</span>
              <span>$500 / $500</span>
            </div>
            <ProgressBar value={100} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs">
              <span>FIRE 進度</span>
              <span>42%</span>
            </div>
            <ProgressBar value={42} subtle />
          </div>
        </div>
      </Card>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold md:text-2xl">WealthFlow 投資儀表板</h1>
          <p className="hidden text-sm text-muted-foreground sm:block">
            追蹤 ETF 資產、模擬長期報酬、估算退休準備度
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-muted-foreground xl:flex">
            <Clock3 className="h-4 w-4 text-primary" />
            2026/06/10 14:42 已同步
          </div>
          <Button className="hidden gap-2 md:inline-flex">
            <Search className="h-4 w-4" />
            搜尋 ETF
          </Button>
          <Button className="h-10 w-10 px-0" aria-label="通知">
            <Bell className="h-4 w-4" />
          </Button>
          <Button className="h-10 w-10 px-0" aria-label="偏好設定">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function WorkflowRail() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Stitch 切版流程</p>
          <h2 className="mt-1 text-lg font-semibold">完整 ETF 財務規劃工作流</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            對照 `.docs/stitch` 設計稿，將所有核心流程集中在同一個可掃描的 SaaS 工作台。
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3 xl:w-[620px]">
          {workflowSteps.map((step, index) => (
            <div key={step} className="flex items-center gap-2 rounded-md border border-border bg-slate-50 px-3 py-2 text-sm">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-white">
                {index + 1}
              </span>
              <span className="truncate">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function AlertBanner() {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 md:flex-row md:items-center">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-warning" />
        <div>
          <p className="text-sm font-semibold">價格同步提醒</p>
          <p className="text-sm text-muted-foreground">SGOV 最新殖利率資料延遲，請稍後重試同步市場價格。</p>
        </div>
      </div>
      <Button className="gap-2 bg-white">
        <RefreshCw className="h-4 w-4" />
        重試
      </Button>
    </div>
  );
}

function OnboardingFlow() {
  return (
    <section id="onboarding" className={sectionClassName}>
      <SectionHeading
        eyebrow="新手引導"
        title="建立長期財富計畫"
        description="從財務輪廓、投資風格到 ETF 持倉設定，讓使用者快速進入可用的儀表板。"
      />
      <Stepper steps={["歡迎", "財務輪廓", "投資組合設定"]} activeIndex={2} />
      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="p-5">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-primary">
            <CircleDollarSign className="h-7 w-7" />
          </div>
          <h3 className="text-xl font-semibold">打造你的長期財富計畫</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            WealthFlow 協助你追蹤 ETF、規劃月投入、模擬退休資產，讓 FIRE 進度清楚可控。
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="primary">開始設定</Button>
            <Button>查看示範儀表板</Button>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 text-lg font-semibold">財務輪廓</h3>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            <Field label="目前年齡" value="35" />
            <Field label="目標退休年齡" value="60" />
            <Field label="每月投資金額" value="$500" />
            <Field label="每月生活費" value="$2,800" />
            <div>
              <p className="mb-2 text-sm font-medium">投資風格</p>
              <div className="grid grid-cols-3 gap-2">
                {["保守", "均衡", "成長"].map((style) => (
                  <button
                    key={style}
                    className={cn(
                      "h-9 rounded-md border border-border text-sm",
                      style === "均衡" && "border-primary bg-blue-50 text-primary"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">投資組合設定</h3>
            <Button className="gap-2" variant="primary">
              <Plus className="h-4 w-4" />
              新增持倉
            </Button>
          </div>
          <div className="space-y-3">
            {holdings.map((item) => (
              <div key={item.etf} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border p-3">
                <Ticker symbol={item.etf} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-muted-foreground">股數 {item.shares} · 目標 {item.target}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
          <Button className="mt-4 w-full" variant="primary">前往儀表板</Button>
        </Card>
      </div>
    </section>
  );
}

function Dashboard({ fireProgress }: { fireProgress: number }) {
  return (
    <section id="dashboard" className={sectionClassName}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="主產品畫面"
          title="儀表板"
          description="最後更新：2026/06/10 14:42，市場價格已同步至最新可用資料。"
        />
        <div className="flex gap-2">
          <Button variant="primary" className="gap-2">
            <Plus className="h-4 w-4" />
            新增交易
          </Button>
          <Button className="gap-2">
            <RefreshCw className="h-4 w-4" />
            同步價格
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((item) => (
          <KpiCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <DonutChartCard />
        <LineChartCard />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <TransactionsTable />
        <WatchlistPreview />
      </div>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">退休進度</h3>
            <p className="text-sm text-muted-foreground">目前資產相對於 4% 法則所需 FIRE Number</p>
          </div>
          <p className="text-2xl font-semibold">{fireProgress}%</p>
        </div>
        <ProgressBar value={fireProgress} />
      </Card>
    </section>
  );
}

function Portfolio() {
  return (
    <section id="portfolio" className={sectionClassName}>
      <SectionHeading
        eyebrow="投資組合"
        title="檢視目前 ETF 持倉"
        description="比較市值、成本、未實現損益與目標配置，找出再平衡方向。"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="市場價值" value="$128,450" trend="+8.4%" note="依最新價格估算" />
        <KpiCard label="總成本" value="$111,920" trend="+$5,000" note="今年新增投入" />
        <KpiCard label="未實現損益" value="$16,530" trend="+14.8%" note="未含股息稅費" />
        <KpiCard label="預估年度股息" value="$3,120" trend="2.43%" note="以近 12 個月殖利率估算" />
      </div>
      <Card className="overflow-hidden">
        <TableHeader title="持倉明細" action="編輯目標配置" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-muted-foreground">
              <tr>
                {["ETF", "資產類別", "股數", "平均成本", "現價", "市場價值", "損益", "目前配置", "目標配置"].map((head) => (
                  <th key={head} className="px-5 py-3 font-medium">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((item) => (
                <tr key={item.etf} className="border-t border-border">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{item.etf}</p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </td>
                  <td className="px-5 py-4">{item.asset}</td>
                  <td className="px-5 py-4">{item.shares}</td>
                  <td className="px-5 py-4">{item.avg}</td>
                  <td className="px-5 py-4">{item.price}</td>
                  <td className="px-5 py-4 font-medium">{item.value}</td>
                  <td className="px-5 py-4 font-semibold text-success">{item.gain}</td>
                  <td className="px-5 py-4">{item.current}</td>
                  <td className="px-5 py-4">{item.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">配置比較</h3>
          <div className="space-y-4">
            {allocations.map((item, index) => (
              <div key={item.symbol}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium">{item.symbol}</span>
                  <span className="text-muted-foreground">目前 {holdings[index].current} / 目標 {item.value}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <ProgressBar value={Number.parseInt(holdings[index].current)} />
                  <ProgressBar value={item.value} subtle />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">再平衡建議</h3>
          <div className="space-y-3">
            <Suggestion tone="warning" text="CSPX 超配 5%，下次投入可暫緩增加。" />
            <Suggestion tone="success" text="VWRA 低配 3%，建議下一筆定期定額優先補足。" />
            <Suggestion tone="neutral" text="SGOV 落在目標區間內，維持現有配置。" />
          </div>
        </Card>
      </div>
    </section>
  );
}

function TransactionFlow() {
  return (
    <section id="transaction" className={sectionClassName}>
      <SectionHeading
        eyebrow="交易流程"
        title="新增交易表單"
        description="支援買入、賣出、股息，包含空白、驗證錯誤與成功狀態。"
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">新增交易</h3>
            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-primary">表單狀態：草稿</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="交易類型" value="買入" />
            <Field label="ETF 代號" value="VWRA" />
            <Field label="日期" value="2026/06/10" />
            <Field label="股數" value="4.12" />
            <Field label="價格" value="$121.15" />
            <Field label="手續費" value="$1.00" />
            <Field label="幣別" value="USD" />
            <Field label="備註" value="每月定期定額" />
          </div>
          <div className="mt-5 flex gap-2">
            <Button variant="primary">儲存交易</Button>
            <Button>取消</Button>
          </div>
        </Card>
        <div className="grid gap-4">
          <StateCard type="error" title="驗證錯誤" message="股數與價格不可為空，請確認交易日期與幣別。" action="修正欄位" />
          <StateCard type="success" title="交易已成功新增" message="交易已成功新增，投資組合配置與成本已同步更新。" action="查看交易紀錄" />
        </div>
      </div>
    </section>
  );
}

function DcaSimulator({
  finalValue,
  monthlyContribution,
  setMonthlyContribution
}: {
  finalValue: number;
  monthlyContribution: number;
  setMonthlyContribution: (amount: number) => void;
}) {
  return (
    <section id="simulator" className={sectionClassName}>
      <SectionHeading
        eyebrow="定期定額模擬"
        title="長期投入與報酬推演"
        description="預設初始投入 $8,000、月投入 $500、年化 8%、期間 25 年。"
      />
      <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">輸入條件</h3>
          <div className="space-y-4">
            <Field label="初始投入" value="$8,000" />
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">每月投入</span>
                <span className="text-muted-foreground">${monthlyContribution.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="100"
                max="3000"
                step="50"
                value={monthlyContribution}
                onChange={(event) => setMonthlyContribution(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <Field label="預期年化報酬" value="8%" />
            <Field label="投資期間" value="25 年" />
            <Field label="投入頻率" value="每月" />
            <Field label="幣別" value="USD" />
          </div>
        </Card>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="最終資產" value={`$${finalValue.toLocaleString()}`} trend="+8% 年化" note="含複利效果" />
            <KpiCard label="總投入" value="$158,000" trend="25 年" note="本金合計" />
            <KpiCard label="預估收益" value="$214,500" trend="+136%" note="稅費前估算" />
            <KpiCard label="年化報酬" value="8.0%" trend="均衡情境" note="可於設定調整" />
          </div>
          <AreaChartCard />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <ScenarioCard title="保守情境" rate="5%" value="$286,900" />
        <ScenarioCard title="均衡情境" rate="8%" value="$372,500" active />
        <ScenarioCard title="成長情境" rate="10%" value="$449,200" />
      </div>
    </section>
  );
}

function RetirementPlanner({
  retirementAge,
  setRetirementAge
}: {
  retirementAge: number;
  setRetirementAge: (age: number) => void;
}) {
  return (
    <section id="retirement" className={sectionClassName}>
      <SectionHeading
        eyebrow="退休規劃"
        title="估算退休準備度"
        description="以每月支出、通膨率與 4% 提領率估算所需退休資產。"
      />
      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">退休輸入</h3>
          <div className="space-y-4">
            <Field label="目前年齡" value="35" />
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-medium">退休年齡</span>
                <span className="text-muted-foreground">{retirementAge} 歲</span>
              </div>
              <input
                type="range"
                min="45"
                max="70"
                value={retirementAge}
                onChange={(event) => setRetirementAge(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>
            <Field label="每月支出" value="$2,800" />
            <Field label="通膨率" value="2.5%" />
            <Field label="提領率" value="4%" />
            <Field label="目前投資組合" value="$128,450" />
          </div>
        </Card>
        <div className="grid gap-4">
          <Card className="p-5">
            <p className="text-sm text-muted-foreground">FIRE Number</p>
            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-4xl font-semibold">$1,920,000</p>
                <p className="mt-2 text-sm text-muted-foreground">依 4% 法則與通膨調整後年支出估算</p>
              </div>
              <Target className="h-10 w-10 text-primary" />
            </div>
            <div className="mt-5">
              <ProgressBar value={42} />
            </div>
          </Card>
          <div className="grid gap-4 md:grid-cols-3">
            <TimelineCard age="35" title="目前" text="累積 $128,450" />
            <TimelineCard age="45" title="中繼點" text="目標 $620,000" />
            <TimelineCard age={`${retirementAge}`} title="退休目標" text="目標 $1,920,000" />
          </div>
          <Card className="p-5">
            <h3 className="mb-4 font-semibold">缺口分析</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <SummaryTile label="所需月投入" value="$1,180" />
              <SummaryTile label="目前月投入" value="$500" />
              <SummaryTile label="投資缺口" value="$680" danger />
            </div>
            <Button className="mt-5 gap-2" variant="primary">
              <SlidersHorizontal className="h-4 w-4" />
              調整每月投入
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Watchlist() {
  return (
    <section id="watchlist" className={sectionClassName}>
      <SectionHeading
        eyebrow="ETF 觀察清單"
        title="追蹤關注 ETF"
        description="觀察價格、日漲跌、YTD 報酬、費用率與資產類別。"
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card className="overflow-hidden">
          <TableHeader title="觀察清單" action="新增 ETF" />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-muted-foreground">
                <tr>
                  {["代號", "名稱", "市場", "價格", "1D 漲跌", "YTD 報酬", "費用率", "資產類別", "操作"].map((head) => (
                    <th key={head} className="px-5 py-3 font-medium">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => (
                  <tr key={item.symbol} className="border-t border-border">
                    <td className="px-5 py-4 font-semibold">{item.symbol}</td>
                    <td className="px-5 py-4">{item.name}</td>
                    <td className="px-5 py-4">{item.market}</td>
                    <td className="px-5 py-4 font-medium">{item.price}</td>
                    <td className={cn("px-5 py-4 font-semibold", item.day.startsWith("-") ? "text-danger" : "text-success")}>{item.day}</td>
                    <td className="px-5 py-4">{item.ytd}</td>
                    <td className="px-5 py-4">{item.fee}</td>
                    <td className="px-5 py-4">{item.asset}</td>
                    <td className="px-5 py-4"><Button className="h-8 px-3">查看</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ETF Detail Drawer</p>
              <h3 className="text-xl font-semibold">CSPX</h3>
              <p className="text-sm text-muted-foreground">iShares Core S&P 500 UCITS ETF</p>
            </div>
            <Ticker symbol="CSPX" />
          </div>
          <MiniLineChart />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <SummaryTile label="費用率" value="0.07%" />
            <SummaryTile label="風險等級" value="中高" />
            <SummaryTile label="主要持股" value="Apple" />
            <SummaryTile label="52W 區間" value="$431-$552" />
          </div>
          <Button className="mt-5 w-full" variant="primary">加入投資組合</Button>
        </Card>
      </div>
    </section>
  );
}

function Reports() {
  return (
    <section id="reports" className={sectionClassName}>
      <SectionHeading
        eyebrow="月報"
        title="每月投資報告"
        description="彙整本月投入、組合報酬、資產類別與可執行洞察。"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="本月投入" value="$1,786" trend="+12%" note="含 SGOV 股息再投入" />
        <KpiCard label="組合報酬" value="+2.8%" trend="跑贏基準" note="MSCI ACWI +2.1%" />
        <KpiCard label="最佳表現" value="0050" trend="+4.6%" note="台股權重貢獻最高" />
        <KpiCard label="最弱表現" value="SGOV" trend="+0.1%" note="防禦性現金部位" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">資產類別分布</h3>
          <div className="space-y-4">
            {["美國股票", "全球股票", "台灣股票", "債券", "現金"].map((item, index) => (
              <ComparisonBar key={item} label={item} value={[50, 25, 15, 8, 2][index]} />
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="mb-4 font-semibold">每月投入歷史</h3>
          <BarChart values={[420, 500, 500, 650, 500, 780, 500, 500, 900, 500, 700, 1786]} />
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <InsightCard title="股票比重偏高" text="目前股票資產約 91%，若接近退休可逐步提高短債比例。" />
        <InsightCard title="債券配置偏低" text="SGOV 與 AGGU 可用於降低波動，目標配置建議提高至 12%。" />
        <InsightCard title="退休目標可達成" text="若月投入提升至 $1,180，60 歲達標機率會明顯提高。" />
      </div>
    </section>
  );
}

function SettingsPanel() {
  return (
    <section id="settings" className={sectionClassName}>
      <SectionHeading
        eyebrow="設定"
        title="個人資料與投資假設"
        description="管理基準幣別、所在國家、時區、預期報酬與顯示偏好。"
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <SettingsCard title="個人資料" fields={[["姓名", "Sean Hong"], ["基準幣別", "USD"], ["國家", "Taiwan"], ["時區", "Asia/Taipei"]]} />
        <SettingsCard title="投資假設" fields={[["預期報酬", "8%"], ["通膨率", "2.5%"], ["提領率", "4%"], ["稅率", "10%"]]} />
        <SettingsCard title="顯示偏好" fields={[["貨幣格式", "$1,234.56"], ["主題", "淺色"], ["圖表樣式", "專業簡潔"], ["資料密度", "標準"]]} />
      </div>
    </section>
  );
}

function UiStates() {
  return (
    <section id="states" className={sectionClassName}>
      <SectionHeading
        eyebrow="UI 狀態"
        title="主要頁面狀態範例"
        description="每個主要頁面需具備正常、空狀態、載入中與錯誤狀態。"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <EmptyState />
        <LoadingState />
        <StateCard type="error" title="API 錯誤" message="無法同步市場價格，請檢查連線後重試。" action="再試一次" />
        <StateCard type="success" title="正常狀態" message="資料已同步，所有儀表板卡片可正常顯示。" action="查看儀表板" />
      </div>
    </section>
  );
}

function KpiCard({ label, value, trend, note }: { label: string; value: string; trend: string; note: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-2xl font-semibold">{value}</p>
        <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-success">{trend}</span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{note}</p>
    </Card>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
      <h2 className="mt-1 text-2xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Stepper({ steps, activeIndex }: { steps: string[]; activeIndex: number }) {
  return (
    <Card className="p-4">
      <div className="grid gap-3 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border bg-slate-50 p-3",
              index <= activeIndex && "border-blue-100 bg-blue-50"
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-sm font-semibold text-muted-foreground",
                index <= activeIndex && "bg-primary text-white"
              )}
            >
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-semibold">{step}</p>
              <p className="text-xs text-muted-foreground">
                {index < activeIndex ? "已完成" : index === activeIndex ? "目前步驟" : "待設定"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function DonutChartCard() {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">資產配置</h3>
          <p className="text-sm text-muted-foreground">CSPX / VWRA / 0050 / SGOV</p>
        </div>
        <PieChart className="h-5 w-5 text-primary" />
      </div>
      <div className="grid gap-6 sm:grid-cols-[180px_1fr] sm:items-center">
        <div
          className="mx-auto h-44 w-44 rounded-full"
          style={{ background: "conic-gradient(#2563EB 0 50%, #06B6D4 50% 75%, #16A34A 75% 90%, #F59E0B 90% 100%)" }}
        >
          <div className="flex h-full items-center justify-center rounded-full p-7">
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white text-center">
              <p className="text-2xl font-semibold">4</p>
              <p className="text-xs text-muted-foreground">核心 ETF</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          {allocations.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={cn("h-3 w-3 rounded-full", item.color)} />
                <span className="text-sm font-medium">{item.symbol} · {item.label}</span>
              </div>
              <span className="text-sm text-muted-foreground">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function LineChartCard() {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">投資組合成長</h3>
          <p className="text-sm text-muted-foreground">歷史價值與預估退休價值</p>
        </div>
        <TrendingUp className="h-5 w-5 text-success" />
      </div>
      <ChartGrid values={growth} labels={months} />
    </Card>
  );
}

function AreaChartCard() {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">投入本金 vs 投資組合價值</h3>
          <p className="text-sm text-muted-foreground">藍色為資產價值，灰色為累積投入本金。</p>
        </div>
        <BarChart3 className="h-5 w-5 text-primary" />
      </div>
      <div className="relative">
        <ChartGrid values={growth} labels={months} />
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex h-56 items-end gap-2 opacity-40">
          {contribution.map((value, index) => (
            <div key={index} className="flex flex-1 items-end">
              <div className="w-full rounded-t-sm bg-slate-400" style={{ height: `${value * 1.2}px` }} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function ChartGrid({ values, labels }: { values: number[]; labels: string[] }) {
  return (
    <div>
      <div className="flex h-64 items-end gap-2 border-b border-l border-border px-2">
        {values.map((value, index) => (
          <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
            <div className="w-full rounded-t-md bg-blue-100">
              <div className="w-full rounded-t-md bg-primary" style={{ height: `${value * 1.55}px` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-6 gap-1 text-center text-xs text-muted-foreground md:grid-cols-12">
        {labels.map((label) => <span key={label}>{label}</span>)}
      </div>
    </div>
  );
}

function TransactionsTable() {
  return (
    <Card className="overflow-hidden">
      <TableHeader title="近期交易" action="新增交易" />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-muted-foreground">
            <tr>
              {["日期", "類型", "代號", "金額", "價格", "狀態"].map((head) => (
                <th key={head} className="px-5 py-3 font-medium">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((item) => (
              <tr key={`${item.date}-${item.symbol}`} className="border-t border-border">
                <td className="px-5 py-4">{item.date}</td>
                <td className="px-5 py-4">{item.type}</td>
                <td className="px-5 py-4 font-semibold">{item.symbol}</td>
                <td className="px-5 py-4">{item.amount}</td>
                <td className="px-5 py-4">{item.price}</td>
                <td className="px-5 py-4"><span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-success">{item.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function WatchlistPreview() {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold">觀察清單預覽</h3>
      <div className="space-y-3">
        {watchlist.slice(0, 4).map((item) => (
          <div key={item.symbol} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border border-border p-3">
            <Ticker symbol={item.symbol} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-muted-foreground">52W 區間依券商資料同步</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{item.price}</p>
              <p className={cn("text-xs font-semibold", item.day.startsWith("-") ? "text-danger" : "text-success")}>{item.day}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input className="h-10 w-full rounded-md border border-border bg-white px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10" defaultValue={value} />
    </label>
  );
}

function TableHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
      <h3 className="font-semibold">{title}</h3>
      <Button className="gap-2" variant="primary">
        <Plus className="h-4 w-4" />
        {action}
      </Button>
    </div>
  );
}

function ProgressBar({ value, subtle = false }: { value: number; subtle?: boolean }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div className={cn("h-full rounded-full", subtle ? "bg-slate-400" : "bg-primary")} style={{ width: `${value}%` }} />
    </div>
  );
}

function SummaryTile({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-xl font-semibold", danger && "text-danger")}>{value}</p>
    </div>
  );
}

function ScenarioCard({ title, rate, value, active = false }: { title: string; rate: string; value: string; active?: boolean }) {
  return (
    <Card className={cn("p-5", active && "border-primary bg-blue-50")}>
      <p className="text-sm text-muted-foreground">{title}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-semibold">{value}</p>
        <span className="rounded-md bg-white px-2 py-1 text-sm font-semibold text-primary">{rate}</span>
      </div>
    </Card>
  );
}

function TimelineCard({ age, title, text }: { age: string; title: string; text: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">Age {age}</p>
      <p className="mt-2 font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    </Card>
  );
}

function Suggestion({ text, tone }: { text: string; tone: "success" | "warning" | "neutral" }) {
  return (
    <div className="rounded-lg border border-border bg-slate-50 p-3 text-sm">
      <span className={cn("mr-2 inline-block h-2 w-2 rounded-full", tone === "success" && "bg-success", tone === "warning" && "bg-warning", tone === "neutral" && "bg-slate-400")} />
      {text}
    </div>
  );
}

function ComparisonBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <ProgressBar value={value} />
    </div>
  );
}

function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <div className="flex h-64 items-end gap-2">
      {values.map((value, index) => (
        <div key={index} className="flex flex-1 flex-col items-center gap-2">
          <div className="w-full rounded-t-md bg-primary" style={{ height: `${(value / max) * 210}px` }} />
          <span className="text-[10px] text-muted-foreground">{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

function InsightCard({ title, text }: { title: string; text: string }) {
  return (
    <Card className="p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-primary">
        <CheckCircle2 className="h-5 w-5" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
    </Card>
  );
}

function SettingsCard({ title, fields }: { title: string; fields: string[][] }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 font-semibold">{title}</h3>
      <div className="space-y-3">
        {fields.map(([label, value]) => <Field key={label} label={label} value={value} />)}
      </div>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center p-5 text-center">
      <WalletCards className="mb-4 h-10 w-10 text-muted-foreground" />
      <h3 className="font-semibold">尚未新增任何持倉</h3>
      <p className="mt-2 text-sm text-muted-foreground">你尚未加入 ETF，新增第一筆持倉後即可看到配置與損益。</p>
      <Button className="mt-5" variant="primary">新增第一檔 ETF</Button>
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="min-h-64 p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        儀表板載入中
      </div>
      <div className="space-y-3">
        <div className="h-10 rounded-md bg-slate-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-md bg-slate-100" />
          <div className="h-20 rounded-md bg-slate-100" />
        </div>
        <div className="h-24 rounded-md bg-slate-100" />
      </div>
    </Card>
  );
}

function StateCard({ type, title, message, action }: { type: "success" | "error"; title: string; message: string; action: string }) {
  const Icon = type === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <Card className="p-5">
      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-md", type === "success" ? "bg-emerald-50 text-success" : "bg-red-50 text-danger")}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>
      <Button className="mt-5">{action}</Button>
    </Card>
  );
}

function Ticker({ symbol }: { symbol: string }) {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-xs font-semibold text-primary">
      {symbol}
    </div>
  );
}

function MiniLineChart() {
  return (
    <div className="flex h-28 items-end gap-1 rounded-lg border border-border bg-slate-50 p-3">
      {[32, 44, 38, 51, 49, 63, 71, 69, 78, 85, 82, 92].map((value, index) => (
        <div key={index} className="flex flex-1 items-end">
          <div className="w-full rounded-t-sm bg-primary" style={{ height: `${value}px` }} />
        </div>
      ))}
    </div>
  );
}

function MobileBottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-white px-2 py-2 lg:hidden">
      {mobileNav.map((item, index) => {
        const Icon = item.icon;
        return (
          <button key={item.label} className={cn("flex flex-col items-center gap-1 text-[11px] text-muted-foreground", index === 0 && "text-primary")}>
            <Icon className="h-5 w-5" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
