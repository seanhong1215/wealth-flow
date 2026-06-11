import {
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
export const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
