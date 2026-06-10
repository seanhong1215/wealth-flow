export type MarketTicker = {
  symbol: string;
  name: string;
  market: string;
  price: number | null;
  changePercent: number | null;
  ytdReturn: number | null;
  expenseRatio: string;
  assetClass: string;
  currency: string;
  source: "massive" | "unavailable";
  error?: string;
};

const massiveBaseUrl = "https://api.massive.com";

const metadata: Record<string, Omit<MarketTicker, "price" | "changePercent" | "ytdReturn" | "source">> = {
  CSPX: { symbol: "CSPX", name: "iShares Core S&P 500 UCITS ETF", market: "LSE", expenseRatio: "0.07%", assetClass: "美國股票", currency: "USD" },
  VWRA: { symbol: "VWRA", name: "Vanguard FTSE All-World UCITS ETF", market: "LSE", expenseRatio: "0.22%", assetClass: "全球股票", currency: "USD" },
  "0050": { symbol: "0050", name: "元大台灣 50", market: "TWSE", expenseRatio: "0.32%", assetClass: "台灣股票", currency: "TWD" },
  SGOV: { symbol: "SGOV", name: "iShares 0-3 Month Treasury Bond ETF", market: "NYSE", expenseRatio: "0.09%", assetClass: "短期債券", currency: "USD" },
  EQQQ: { symbol: "EQQQ", name: "Invesco NASDAQ 100 UCITS ETF", market: "LSE", expenseRatio: "0.30%", assetClass: "科技股票", currency: "USD" },
  AGGU: { symbol: "AGGU", name: "iShares Core Global Aggregate Bond", market: "LSE", expenseRatio: "0.10%", assetClass: "全球債券", currency: "USD" }
};

function normalizeTicker(symbol: string) {
  if (symbol === "0050") return "0050.TW";
  return symbol;
}

export function hasMassiveKey() {
  return Boolean(process.env.MASSIVE_API_KEY);
}

export async function fetchTicker(symbol: string): Promise<MarketTicker> {
  const base = metadata[symbol] ?? {
    symbol,
    name: symbol,
    market: "UNKNOWN",
    expenseRatio: "-",
    assetClass: "ETF",
    currency: "USD"
  };

  const apiKey = process.env.MASSIVE_API_KEY;
  if (!apiKey) {
    return {
      ...base,
      price: null,
      changePercent: null,
      ytdReturn: null,
      source: "unavailable",
      error: "尚未設定 MASSIVE_API_KEY"
    };
  }

  try {
    const ticker = normalizeTicker(symbol);
    const url = new URL(`/v2/aggs/ticker/${ticker}/prev`, massiveBaseUrl);
    url.searchParams.set("adjusted", "true");
    url.searchParams.set("apiKey", apiKey);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);

    const response = await fetch(url, {
      next: { revalidate: 300 },
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));
    if (!response.ok) {
      throw new Error(`Massive 回應 ${response.status}`);
    }

    const data = await response.json();
    const result = data?.results?.[0];
    if (!result) {
      throw new Error("Massive 未回傳前一交易日資料");
    }

    const close = typeof result.c === "number" ? result.c : null;
    const open = typeof result.o === "number" ? result.o : null;
    const changePercent = close !== null && open ? ((close - open) / open) * 100 : null;

    return {
      ...base,
      price: close,
      changePercent,
      ytdReturn: null,
      source: "massive"
    };
  } catch (error) {
    return {
      ...base,
      price: null,
      changePercent: null,
      ytdReturn: null,
      source: "unavailable",
      error: error instanceof Error ? error.message : "Massive API 讀取失敗"
    };
  }
}

export async function fetchMarketData(symbols: string[]) {
  return Promise.all(symbols.map((symbol) => fetchTicker(symbol)));
}
