import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.WEALTHFLOW_URL ?? "http://localhost:3000";
const outputDir = ".docs/stitch";

const desktopPages = [
  ["/dashboard", "02-main-dashboard.png"],
  ["/portfolio", "03-portfolio-page.png"],
  ["/dca-simulator", "05-dca-simulator.png"],
  ["/retirement-planner", "06-retirement-planner.png"],
  ["/watchlist", "07-etf-watchlist.png"],
  ["/reports", "08-reports-page.png"],
  ["/settings", "09-settings-page.png"]
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();

try {
  const desktop = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1
  });
  for (const [path, filename] of desktopPages) {
    await desktop.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
    await desktop.screenshot({
      path: `${outputDir}/${filename}`,
      fullPage: true
    });
  }

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 1200 },
    deviceScaleFactor: 2,
    isMobile: true
  });
  await mobile.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
  await mobile.screenshot({
    path: `${outputDir}/11-mobile-flow.png`,
    fullPage: true
  });
} finally {
  await browser.close();
}

console.log(`Screenshots saved to ${outputDir}`);
