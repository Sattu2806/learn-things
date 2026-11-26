#!/usr/bin/env node
/**
 * Screenshots every section of a chapter, for checking it by eye.
 *   node scripts/shoot.cjs <chapter-id> <out-dir>
 * Needs the dev server on http://127.0.0.1:5173 (npm run dev).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const [id, out = '/tmp/shots'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://127.0.0.1:5173/#/${id}`);
  await page.waitForSelector('.t-section');
  await page.evaluate(() => document.fonts.ready);
  const ids = await page.evaluate(() => [...document.querySelectorAll('.t-section')].map((s) => s.id));
  let i = 0;
  for (const sid of ids) {
    await page.evaluate((sid) => document.getElementById(sid).scrollIntoView({ block: 'start' }), sid);
    await page.waitForTimeout(1800);
    const file = `${out}/${String(++i).padStart(2, '0')}-${sid}.png`;
    await page.screenshot({ path: file });
    console.log(file);
  }
  const figs = page.locator('.t-figure, .mistake-fig');
  console.log('figures:', await figs.count());
  console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'no console errors');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
