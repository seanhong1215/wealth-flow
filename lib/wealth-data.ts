import {
  BarChart3,
  Calculator,
  FileBarChart,
  Flame,
  Home,
  LineChart,
  Settings,
  WalletCards
} from "lucide-react";

export const routes = [
  { label: "儀表板", href: "/dashboard", icon: Home },
  { label: "投資組合", href: "/portfolio", icon: WalletCards },
  { label: "定期定額模擬", href: "/dca-simulator", icon: Calculator },
  { label: "退休規劃", href: "/retirement-planner", icon: Flame },
  { label: "ETF 觀察清單", href: "/watchlist", icon: LineChart },
  { label: "報表", href: "/reports", icon: FileBarChart },
  { label: "設定", href: "/settings", icon: Settings }
];

export const mobileRoutes = [
  { label: "首頁", href: "/dashboard", icon: Home },
  { label: "組合", href: "/portfolio", icon: WalletCards },
  { label: "模擬", href: "/dca-simulator", icon: Calculator },
  { label: "觀察", href: "/watchlist", icon: LineChart },
  { label: "設定", href: "/settings", icon: Settings }
];

export const watchSymbols = ["CSPX", "VWRA", "0050", "SGOV", "EQQQ", "AGGU"];

export const holdings = [
  {
    etf: "CSPX",
    name: "iShares Core S&P 500 UCITS ETF",
    asset: "美國股票",
    shares: 42.8,
    avg: 482.1,
    current: 55,
    target: 50,
    currency: "USD"
  },
  {
    etf: "VWRA",
    name: "Vanguard FTSE All-World UCITS ETF",
    asset: "全球股票",
    shares: 108,
    avg: 104.4,
    current: 22,
    target: 25,
    currency: "USD"
  },
  {
    etf: "0050",
    name: "元大台灣 50",
    asset: "台灣股票",
    shares: 70,
    avg: 156.2,
    current: 14,
    target: 15,
    currency: "TWD"
  },
  {
    etf: "SGOV",
    name: "iShares 0-3 Month Treasury Bond ETF",
    asset: "短期債券",
    shares: 194,
    avg: 100.31,
    current: 9,
    target: 10,
    currency: "USD"
  }
];

export const allocations = [
  { symbol: "CSPX", label: "美股核心", value: 50, color: "bg-blue-600", hex: "#2563EB" },
  { symbol: "VWRA", label: "全球股票", value: 25, color: "bg-cyan-500", hex: "#06B6D4" },
  { symbol: "0050", label: "台灣股票", value: 15, color: "bg-emerald-500", hex: "#16A34A" },
  { symbol: "SGOV", label: "短債現金", value: 10, color: "bg-amber-500", hex: "#F59E0B" }
];

export const transactions = [
  { date: "2026/06/05", type: "買入", symbol: "CSPX", amount: "$1,200", price: "$548.32", status: "已完成" },
  { date: "2026/06/03", type: "股息", symbol: "SGOV", amount: "$86", price: "-", status: "已入帳" },
  { date: "2026/05/20", type: "買入", symbol: "VWRA", amount: "$500", price: "$121.15", status: "已完成" },
  { date: "2026/05/10", type: "買入", symbol: "0050", amount: "NT$12,000", price: "NT$184.7", status: "已完成" }
];

export const growth = [22, 28, 34, 42, 50, 57, 66, 73, 81, 94, 108, 124];
export const contribution = [18, 23, 28, 33, 38, 43, 48, 53, 58, 63, 68, 73];
export const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export const paymentRecommendations = [
  {
    title: "不建議把金流放在第一版核心流程",
    text: "WealthFlow 目前定位是投資追蹤與規劃工具，金流會增加法遵、退款、KYC/AML、發票稅務與客訴成本。"
  },
  {
    title: "適合呈現為訂閱升級，而非代操或入金",
    text: "如果要收費，建議做 Pro 訂閱：進階報表、更多 watchlist、自動同步、匯出與情境模擬。"
  },
  {
    title: "避免處理使用者投資資金",
    text: "不要在產品內收取投資本金或代下單。這會讓產品從 SaaS 工具接近金融服務，需要更高監管與安全門檻。"
  }
];

export const reportInsights = [
  "目前股票資產約 91%，若接近退休可逐步提高短債比例。",
  "SGOV 與 AGGU 可用於降低波動，目標配置建議提高至 12%。",
  "若月投入提升至 $1,180，60 歲達標機率會明顯提高。"
];

export const chartIcon = BarChart3;
