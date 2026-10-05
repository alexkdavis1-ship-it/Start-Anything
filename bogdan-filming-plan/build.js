// Renders plan.html -> Bogdan-Filming-Plan.pdf (and page PNGs for review with --png)
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  await page.goto('file://' + path.join(__dirname, 'plan.html'), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  if (process.argv.includes('--png')) {
    const n = await page.locator('.page').count();
    for (let i = 0; i < n; i++) {
      await page.locator('.page').nth(i).screenshot({ path: path.join(process.argv[3] || __dirname, `p${String(i + 1).padStart(2, '0')}.png`) });
    }
  }
  await page.pdf({ path: path.join(__dirname, 'Bogdan-Filming-Plan.pdf'), width: '540px', height: '960px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
})();
