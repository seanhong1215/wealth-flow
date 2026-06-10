import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.WEALTHFLOW_URL ?? "http://localhost:3000";
const outputDir = ".docs";

const desktopSections = [
  ["onboarding", "01-onboarding-flow.png"],
  ["dashboard", "02-main-dashboard.png"],
  ["portfolio", "03-portfolio-page.png"],
  ["transaction", "04-add-transaction-flow.png"],
  ["simulator", "05-dca-simulator.png"],
  ["retirement", "06-retirement-planner.png"],
  ["watchlist", "07-etf-watchlist.png"],
  ["reports", "08-reports-page.png"],
  ["settings", "09-settings-page.png"],
  ["states", "10-ui-states.png"]
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1
  });
  await desktop.goto(baseUrl, { waitUntil: "networkidle" });

  for (const [id, filename] of desktopSections) {
    const section = desktop.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await section.screenshot({
      path: `${outputDir}/${filename}`
    });
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 1200 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.screenshot({
    path: `${outputDir}/11-mobile-flow.png`,
    fullPage: true
  });
} finally {
  await browser.close();
}

console.log(`Screenshots saved to ${outputDir}`);
