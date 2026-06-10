import { chromium } from "playwright";

const baseUrl = process.env.WEALTHFLOW_URL || "http://0.0.0.0:3000";

async function expectText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 12_000 });
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const steps = [];

  try {
    await page.goto(`${baseUrl}/onboarding`, { waitUntil: "networkidle" });
    await expectText(page, "登入 / Onboarding");
    await expectText(page, "建立投資設定");
    await expectText(page, "加入 ETF 持倉");
    await page.getByRole("link", { name: "前往 Dashboard" }).click();
    await page.waitForURL("**/dashboard");
    await expectText(page, "總資產");
    steps.push("登入 / Onboarding -> Dashboard");

    await page.getByRole("button", { name: "新增交易" }).first().click();
    await expectText(page, "支援買入、賣出與股息紀錄");
    await page.getByRole("button", { name: "儲存交易" }).click();
    await expectText(page, "交易已成功新增");
    steps.push("新增交易流程");

    await page.goto(`${baseUrl}/portfolio`, { waitUntil: "networkidle" });
    await expectText(page, "檢視目前 ETF 持倉");
    const slider = page.getByLabel("VWRA 目標配置");
    await slider.fill("25");
    await page.getByRole("button", { name: "套用目標配置" }).click();
    await expectText(page, "目標配置已更新");
    steps.push("調整資產配置");

    await page.goto(`${baseUrl}/dca-simulator`, { waitUntil: "networkidle" });
    await expectText(page, "長期投入與報酬推演");
    await expectText(page, "成長情境 10%");
    steps.push("DCA 模擬");

    await page.goto(`${baseUrl}/retirement-planner`, { waitUntil: "networkidle" });
    await expectText(page, "估算退休準備度");
    await expectText(page, "FIRE Number");
    steps.push("退休試算");

    await page.goto(`${baseUrl}/watchlist`, { waitUntil: "networkidle" });
    await expectText(page, "追蹤關注 ETF");
    await expectText(page, "CSPX");
    await page.getByRole("button", { name: "加入投資組合" }).click();
    steps.push("ETF Watchlist");

    const marketResponse = await page.request.get(`${baseUrl}/api/market`);
    if (!marketResponse.ok()) {
      throw new Error(`/api/market 回應失敗：${marketResponse.status()}`);
    }
    const market = await marketResponse.json();
    if (!market.configured || !Array.isArray(market.data) || market.data.length < 4) {
      throw new Error("/api/market 未回傳可用的真實市場資料");
    }
    steps.push("Massive API 市場資料");

    await page.goto(`${baseUrl}/reports`, { waitUntil: "networkidle" });
    await expectText(page, "每月投資報告");
    await expectText(page, "洞察 1");
    steps.push("Monthly Report");

    console.log(`流程測試完成：${steps.join(" -> ")}`);
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
