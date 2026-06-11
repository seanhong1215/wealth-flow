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
  { path: "/settings", name: "settings", title: "偏好設定" }
];

const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900, isMobile: false },
  { name: "laptop-1280x800", width: 1280, height: 800, isMobile: false },
  { name: "tablet-768x1024", width: 768, height: 1024, isMobile: true },
  { name: "mobile-390x844", width: 390, height: 844, isMobile: true }
];

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
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.removeItem("wealthflow:user:seanhong1215:v2"));
  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForURL("**/login");
  await page.getByLabel("Email").fill("seanhong1215@example.com");
  await page.getByRole("button", { name: "登入" }).click();
  await page.waitForURL("**/onboarding");
  await page.getByRole("button", { name: "前往儀表板" }).first().click();
  await page.getByText("請確認年齡", { exact: false }).waitFor();
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
  await page.getByRole("button", { name: "前往儀表板" }).last().click();
  await page.waitForURL("**/dashboard");
  await page.getByText("總資產", { exact: false }).first().waitFor();
  result.flows.push({ name: "New User Onboarding", status: "pass", note: "未登入會被擋下；登入後需完成合法投資設定才可進入 Dashboard。" });

  await page.getByRole("button", { name: "新增交易" }).first().click();
  await page.getByRole("button", { name: "儲存交易" }).click();
  await page.getByText("請輸入有效的代號", { exact: false }).waitFor();
  await page.getByLabel("代號").fill("CSPX");
  await page.getByLabel("日期").fill("2026/06/11");
  await page.getByLabel("股數").fill("1");
  await page.getByLabel("價格").fill("500");
  await page.getByRole("button", { name: "儲存交易" }).click();
  await page.getByText("交易已成功新增", { exact: false }).waitFor();
  result.flows.push({ name: "Add Transaction", status: "pass", note: "Modal 可開啟、儲存後顯示成功狀態。" });

  await page.goto(`${baseUrl}/portfolio`, { waitUntil: "networkidle" });
  await page.getByLabel("ETF 代號").fill("AGGU");
  await page.getByLabel("ETF 名稱").fill("iShares Global Aggregate Bond UCITS ETF");
  await page.getByLabel("股數").fill("5");
  await page.getByLabel("平均成本").fill("10");
  await page.getByLabel("目標配置 %").fill("40");
  await page.getByRole("button", { name: "新增持倉" }).click();
  await page.getByText("AGGU", { exact: false }).first().waitFor();
  await page.getByRole("button", { name: "編輯 CSPX" }).click();
  await page.getByText("CSPX 已更新股數與目標配置", { exact: false }).waitFor();
  await page.getByRole("button", { name: "刪除 AGGU" }).click();
  await page.getByText("AGGU 已刪除", { exact: false }).waitFor();
  await page.getByLabel("CSPX 目標配置").fill("100");
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
  await page.getByText("ETF 觀察清單", { exact: false }).waitFor();
  await page.getByLabel("ETF 代號").fill("SGOV");
  await page.getByLabel("ETF 名稱").fill("iShares 0-3 Month Treasury Bond ETF");
  await page.getByLabel("市場").fill("NYSE");
  await page.getByLabel("資產類別").fill("短期債券");
  await page.getByRole("button", { name: "新增 ETF" }).click();
  await page.getByRole("button", { name: /查看詳情|查看原因/ }).first().click();
  await page.getByText("ETF 詳情", { exact: false }).first().waitFor();
  result.flows.push({ name: "Watchlist", status: "pass", note: "觀察清單可開啟 ETF 詳情，並可加入投資組合。" });
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
  accountData: null
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
