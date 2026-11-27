#!/usr/bin/env node
/**
 * Screenshots a chapter's film at the start of each shot (plus a few seconds in).
 *   node scripts/shoot-film.cjs <chapter-id> <out-dir>
 * Needs the dev server on http://127.0.0.1:5173 (npm run dev).
 */
const { chromium } = require('playwright');
const fs = require('fs');
const [id, out = '/tmp/film-shots'] = process.argv.slice(2);
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(`http://127.0.0.1:5173/#/${id}`);
  await page.waitForSelector('canvas.stage');
  await page.evaluate(() => document.fonts.ready);
  const starts = await page.evaluate(() => [...document.querySelectorAll('.chapters .chapter-t')].map((e) => { const [m, s] = e.textContent.split(':'); return +m * 60 + +s; }));
  starts.push(await page.evaluate(() => +document.querySelector('.seek').max));
  let i = 0;
  for (let k = 0; k < starts.length - 1; k++) {
    for (const f of [0.35, 0.8]) {
      const t = starts[k] + (starts[k + 1] - starts[k]) * f;
      await page.evaluate((t) => {
        const el = document.querySelector('.seek');
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(t));
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }, t);
      await page.waitForTimeout(150);
      const file = `${out}/${String(++i).padStart(2, '0')}.png`;
      await page.locator('canvas.stage').screenshot({ path: file });
    }
  }
  console.log(i, 'shots', errors.length ? 'ERRORS: ' + errors.join('\n') : 'no errors');
  await browser.close();
})();
