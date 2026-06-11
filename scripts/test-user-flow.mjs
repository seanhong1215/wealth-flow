import { chromium } from "playwright";

const baseUrl = process.env.WEALTHFLOW_URL || "http://0.0.0.0:3000";

async function expectText(page, text) {
  await page.getByText(text, { exact: false }).first().waitFor({ timeout: 12_000 });
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const steps = [];
  const email = `wealthflow-test-${Date.now()}@example.com`;

  try {
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
    await page.waitForURL("**/login");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "登入" }).click();
    await page.waitForURL("**/onboarding");
    await expectText(page, "登入 / Onboarding");
    await expectText(page, "建立投資設定");
    await expectText(page, "加入 ETF 持倉");
    await page.getByRole("button", { name: "前往儀表板" }).first().click();
    await expectText(page, "請確認年齡");
    await page.getByLabel("目前年齡").fill("35");
    await page.getByLabel("退休目標年齡").fill("60");
    await page.getByLabel("每月投資金額").fill("500");
    await page.getByLabel("每月生活支出").fill("2800");
    await page.getByLabel("ETF 代號").fill("CSPX");
    await page.getByLabel("ETF 名稱").fill("iShares Core S&P 500 UCITS ETF");
    await page.getByLabel("股數").fill("10");
    await page.getByLabel("平均成本").fill("500");
    await page.getByLabel("目標配置 %").fill("60");
    await page.getByRole("button", { name: "加入持倉" }).click();
    await expectText(page, "ETF 持倉已加入目前帳號");
    await page.getByRole("button", { name: "前往儀表板" }).last().click();
    await page.waitForURL("**/dashboard");
    await expectText(page, "總資產");
    steps.push("登入 / Onboarding -> Dashboard");

    await page.getByRole("button", { name: "新增交易" }).first().click();
    await expectText(page, "支援買入、賣出與股息紀錄");
    await page.getByRole("button", { name: "儲存交易" }).click();
    await expectText(page, "請輸入有效的代號");
    await page.getByLabel("代號").fill("CSPX");
    await page.getByLabel("日期").fill("2026/06/11");
    await page.getByLabel("股數").fill("1");
    await page.getByLabel("價格").fill("500");
    await page.getByRole("button", { name: "儲存交易" }).click();
    await expectText(page, "交易已成功新增");
    steps.push("新增交易流程");

    await page.goto(`${baseUrl}/portfolio`, { waitUntil: "networkidle" });
    await expectText(page, "檢視目前 ETF 持倉");
    await expectText(page, "CSPX");
    await page.getByLabel("ETF 代號").fill("VWRA");
    await page.getByLabel("ETF 名稱").fill("Vanguard FTSE All-World UCITS ETF");
    await page.getByLabel("股數").fill("8");
    await page.getByLabel("平均成本").fill("110");
    await page.getByLabel("目標配置 %").fill("40");
    await page.getByRole("button", { name: "新增持倉" }).click();
    await expectText(page, "持倉已新增到目前帳號");
    const slider = page.getByLabel("VWRA 目標配置");
    await slider.fill("40");
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
    await page.getByLabel("ETF 代號").fill("SGOV");
    await page.getByLabel("ETF 名稱").fill("iShares 0-3 Month Treasury Bond ETF");
    await page.getByLabel("市場").fill("NYSE");
    await page.getByLabel("資產類別").fill("短期債券");
    await page.getByRole("button", { name: "新增 ETF" }).click();
    await page.getByRole("button", { name: "查看詳情" }).first().click();
    await expectText(page, "ETF 詳情");
    await page.getByRole("button", { name: "加入投資組合" }).click();
    steps.push("ETF Watchlist");

    await page.goto(`${baseUrl}/reports`, { waitUntil: "networkidle" });
    await expectText(page, "每月投資報告");
    await expectText(page, "洞察");
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
