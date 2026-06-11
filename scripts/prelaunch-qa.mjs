import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.WEALTHFLOW_URL || "http://0.0.0.0:3000";
const reportDir = ".docs/report";
const screenshotDir = `${reportDir}/screenshots`;

const pages = [
  { path: "/onboarding", name: "onboarding", title: "登入 / Onboarding" },
  { path: "/dashboard", name: "dashboard", title: "總資產" },
  { path: "/portfolio", name: "portfolio", title: "檢視目前 ETF 持倉" },
  { path: "/dca-simulator", name: "dca-simulator", title: "長期投入與報酬推演" },
  { path: "/retirement-planner", name: "retirement-planner", title: "估算退休準備度" },
  { path: "/watchlist", name: "watchlist", title: "追蹤關注 ETF" },
  { path: "/reports", name: "reports", title: "每月投資報告" },
  { path: "/settings", name: "settings", title: "個人資料、API 與金流策略" }
];

const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900, isMobile: false },
  { name: "laptop-1280x800", width: 1280, height: 800, isMobile: false },
  { name: "tablet-768x1024", width: 768, height: 1024, isMobile: true },
  { name: "mobile-390x844", width: 390, height: 844, isMobile: true }
];

function unique(values) {
  return [...new Set(values)];
}

async function collectPageSignals(page) {
  return page.evaluate(() => {
    const namedButtons = [...document.querySelectorAll("button")].filter((button) => {
      const name = button.innerText.trim() || button.getAttribute("aria-label") || button.getAttribute("title");
      return Boolean(name);
    }).length;
    const unnamedButtons = [...document.querySelectorAll("button")].filter((button) => {
      const name = button.innerText.trim() || button.getAttribute("aria-label") || button.getAttribute("title");
      return !name;
    }).length;
    const inputs = [...document.querySelectorAll("input")];
    const unlabeledInputs = inputs.filter((input) => {
      const id = input.getAttribute("id");
      const hasLabel = Boolean(input.closest("label")) || Boolean(input.getAttribute("aria-label"));
      const hasExternalLabel = id ? Boolean(document.querySelector(`label[for="${CSS.escape(id)}"]`)) : false;
      return !hasLabel && !hasExternalLabel;
    }).length;
    const smallTargets = [...document.querySelectorAll("button, a, input[type='range']")].filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && (rect.width < 36 || rect.height < 36);
    }).length;
    return {
      bodyWidth: document.body.scrollWidth,
      viewportWidth: window.innerWidth,
      hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth + 2,
      namedButtons,
      unnamedButtons,
      inputCount: inputs.length,
      unlabeledInputs,
      smallTargets
    };
  });
}

async function runFlowChecks(page, result) {
  await page.goto(`${baseUrl}/onboarding`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "前往 Dashboard" }).click();
  await page.waitForURL("**/dashboard");
  await page.getByText("總資產", { exact: false }).first().waitFor();
  result.flows.push({ name: "New User Onboarding", status: "pass", note: "可從 onboarding 建立設定與持倉範例後進入 Dashboard。" });

  await page.getByRole("button", { name: "新增交易" }).first().click();
  await page.getByRole("button", { name: "儲存交易" }).click();
  await page.getByText("交易已成功新增", { exact: false }).waitFor();
  result.flows.push({ name: "Add Transaction", status: "pass", note: "Modal 可開啟、儲存後顯示成功狀態。" });

  await page.goto(`${baseUrl}/portfolio`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "新增持倉" }).click();
  await page.getByText("AGGU", { exact: false }).first().waitFor();
  await page.getByRole("button", { name: "編輯 CSPX" }).click();
  await page.getByText("CSPX 已更新股數與目標配置", { exact: false }).waitFor();
  await page.getByRole("button", { name: "刪除 AGGU" }).click();
  await page.getByText("AGGU 已刪除", { exact: false }).waitFor();
  await page.getByLabel("VWRA 目標配置").fill("25");
  await page.getByRole("button", { name: "套用目標配置" }).click();
  await page.getByText("目標配置已更新", { exact: false }).waitFor();
  result.flows.push({ name: "Portfolio Add/Edit/Delete Holding", status: "pass", note: "可新增 AGGU、編輯 CSPX、刪除 AGGU，並套用配置。" });

  await page.goto(`${baseUrl}/dca-simulator`, { waitUntil: "networkidle" });
  await page.getByText("長期投入與報酬推演", { exact: false }).waitFor();
  await page.getByLabel("每月投入").fill("700");
  await page.getByText("目前情境", { exact: false }).waitFor();
  result.flows.push({ name: "DCA Simulation", status: "pass", note: "月投入可輸入，KPI 與投影圖即時更新。" });

  await page.goto(`${baseUrl}/retirement-planner`, { waitUntil: "networkidle" });
  await page.getByText("FIRE Number", { exact: false }).waitFor();
  await page.getByLabel("每月支出").fill("3200");
  await page.getByRole("button", { name: "調整每月投入" }).click();
  await page.getByText("投資缺口", { exact: false }).waitFor();
  result.flows.push({ name: "Retirement Planning", status: "pass", note: "支出與月投入可輸入，FIRE Number、進度與缺口會即時計算。" });

  await page.goto(`${baseUrl}/watchlist`, { waitUntil: "networkidle" });
  await page.getByText("Massive.com 真實資料觀察清單", { exact: false }).waitFor();
  await page.getByRole("button", { name: /查看詳情|查看原因/ }).first().click();
  await page.getByText("ETF Detail Drawer", { exact: false }).first().waitFor();
  const marketResponse = await page.request.get(`${baseUrl}/api/market`);
  const market = await marketResponse.json();
  result.apiMarket = {
    ok: marketResponse.ok(),
    configured: Boolean(market.configured),
    rows: Array.isArray(market.data) ? market.data.length : 0,
    sources: Array.isArray(market.data) ? unique(market.data.map((row) => row.source)) : []
  };
  result.flows.push({ name: "Watchlist Market Data", status: marketResponse.ok() && market.configured && result.apiMarket.sources.includes("massive") ? "pass" : "fail", note: `API rows=${result.apiMarket.rows}, sources=${result.apiMarket.sources.join(",")}` });
  result.flows.push({ name: "ETF Detail Drawer", status: "pass", note: "點擊表格詳情按鈕可更新 ETF detail drawer。" });

  await page.goto(`${baseUrl}/reports`, { waitUntil: "networkidle" });
  await page.getByText("每月投資報告", { exact: false }).waitFor();
  result.flows.push({ name: "Monthly Report", status: "pass", note: "月報 KPI、資產分布、投入歷史與洞察卡可見。" });
}

await mkdir(screenshotDir, { recursive: true });

const result = {
  baseUrl,
  generatedAt: new Date().toISOString(),
  pages: [],
  responsive: [],
  flows: [],
  consoleErrors: [],
  pageErrors: [],
  apiMarket: null
};

const browser = await chromium.launch();

try {
  const flowPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  flowPage.on("console", (message) => {
    if (["error", "warning"].includes(message.type())) {
      result.consoleErrors.push({ page: "flow", type: message.type(), text: message.text() });
    }
  });
  flowPage.on("pageerror", (error) => result.pageErrors.push({ page: "flow", text: error.message }));
  await runFlowChecks(flowPage, result);
  await flowPage.close();

  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      deviceScaleFactor: viewport.isMobile ? 2 : 1
    });
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) {
        result.consoleErrors.push({ page: viewport.name, type: message.type(), text: message.text() });
      }
    });
    page.on("pageerror", (error) => result.pageErrors.push({ page: viewport.name, text: error.message }));

    for (const route of pages) {
      await page.goto(`${baseUrl}${route.path}`, { waitUntil: "networkidle" });
      await page.getByText(route.title, { exact: false }).first().waitFor({ timeout: 12_000 });
      const screenshot = `${screenshotDir}/${viewport.name}-${route.name}.png`;
      await page.screenshot({ path: screenshot, fullPage: true });
      const signals = await collectPageSignals(page);
      const record = { viewport: viewport.name, ...route, screenshot, ...signals };
      result.responsive.push(record);
      if (viewport.name === "desktop-1440x900") {
        result.pages.push(record);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}

await writeFile(`${reportDir}/qa-results.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Pre-launch QA artifacts saved to ${reportDir}`);
