export type MarketTicker = {
  symbol: string;
  dataSymbol: string;
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
  note?: string;
};

const massiveBaseUrl = "https://api.massive.com";

const metadata: Record<string, Omit<MarketTicker, "price" | "changePercent" | "ytdReturn" | "source">> = {
  CSPX: { symbol: "CSPX", dataSymbol: "IVV", name: "iShares Core S&P 500 UCITS ETF", market: "LSE", expenseRatio: "0.07%", assetClass: "美國股票", currency: "USD", note: "Massive 免費資料未涵蓋 CSPX.L，使用 IVV 作為 S&P 500 真實價格 proxy。" },
  VWRA: { symbol: "VWRA", dataSymbol: "VT", name: "Vanguard FTSE All-World UCITS ETF", market: "LSE", expenseRatio: "0.22%", assetClass: "全球股票", currency: "USD", note: "Massive 免費資料未涵蓋 VWRA.L，使用 VT 作為全球股票真實價格 proxy。" },
  "0050": { symbol: "0050", dataSymbol: "EWT", name: "元大台灣 50", market: "TWSE", expenseRatio: "0.32%", assetClass: "台灣股票", currency: "USD", note: "Massive 免費資料未涵蓋台股 0050，使用 EWT 作為台灣股票真實價格 proxy。" },
  SGOV: { symbol: "SGOV", dataSymbol: "SGOV", name: "iShares 0-3 Month Treasury Bond ETF", market: "NYSE", expenseRatio: "0.09%", assetClass: "短期債券", currency: "USD" },
  EQQQ: { symbol: "EQQQ", dataSymbol: "QQQ", name: "Invesco NASDAQ 100 UCITS ETF", market: "LSE", expenseRatio: "0.30%", assetClass: "科技股票", currency: "USD", note: "Massive 免費資料未涵蓋 EQQQ.L，使用 QQQ 作為 Nasdaq 100 真實價格 proxy。" },
  AGGU: { symbol: "AGGU", dataSymbol: "AGG", name: "iShares Core Global Aggregate Bond", market: "LSE", expenseRatio: "0.10%", assetClass: "全球債券", currency: "USD", note: "Massive 免費資料未涵蓋 AGGU.L，使用 AGG 作為債券真實價格 proxy。" }
};

function normalizeTicker(symbol: string) {
  return metadata[symbol]?.dataSymbol ?? symbol;
}

export function hasMassiveKey() {
  return Boolean(process.env.MASSIVE_API_KEY);
}

function getPreviousWeekday() {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - 1);
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6) {
    date.setUTCDate(date.getUTCDate() - 1);
  }
  return date.toISOString().slice(0, 10);
}

function buildUnavailable(symbol: string, error: string): MarketTicker {
  const base = metadata[symbol] ?? {
    symbol,
    dataSymbol: symbol,
    name: symbol,
    market: "UNKNOWN",
    expenseRatio: "-",
    assetClass: "ETF",
    currency: "USD"
  };

  return {
    ...base,
    price: null,
    changePercent: null,
    ytdReturn: null,
    source: "unavailable",
    error
  };
}

export async function fetchTicker(symbol: string): Promise<MarketTicker> {
  const base = metadata[symbol] ?? {
    symbol,
    dataSymbol: symbol,
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
      cache: "no-store",
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
  const apiKey = process.env.MASSIVE_API_KEY;
  if (!apiKey) {
    return symbols.map((symbol) => buildUnavailable(symbol, "尚未設定 MASSIVE_API_KEY"));
  }

  try {
    const date = getPreviousWeekday();
    const url = new URL(`/v2/aggs/grouped/locale/us/market/stocks/${date}`, massiveBaseUrl);
    url.searchParams.set("adjusted", "true");
    url.searchParams.set("apiKey", apiKey);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4500);
    const response = await fetch(url, {
      cache: "no-store",
      signal: controller.signal
    }).finally(() => clearTimeout(timeout));

    if (!response.ok) {
      throw new Error(response.status === 429 ? "Massive 免費 API 已達每分鐘請求上限，請稍後重試。" : `Massive 回應 ${response.status}`);
    }

    const data = await response.json();
    const byTicker = new Map<string, { T: string; c?: number; o?: number }>();
    for (const result of data?.results ?? []) {
      if (typeof result?.T === "string") byTicker.set(result.T, result);
    }

    return symbols.map((symbol) => {
      const base = metadata[symbol];
      const result = byTicker.get(base.dataSymbol);
      if (!result || typeof result.c !== "number") {
        return buildUnavailable(symbol, `${base.dataSymbol} 在 ${date} grouped data 中沒有價格。`);
      }

      const close = result.c;
      const open = typeof result.o === "number" ? result.o : null;
      const changePercent = open ? ((close - open) / open) * 100 : null;

      return {
        ...base,
        price: close,
        changePercent,
        ytdReturn: null,
        source: "massive" as const
      };
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Massive API 讀取失敗";
    return symbols.map((symbol) => buildUnavailable(symbol, message));
  }
}
