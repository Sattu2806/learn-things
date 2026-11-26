#!/usr/bin/env node
/**
 * Renders the lesson film to a video file with a headless browser, frame by
 * frame, then saves the subtitles and a voiceover script next to it.
 *
 *   npm run render                                  1080p, 30 fps, no captions
 *   npm run render -- --fps 60 --captions --out film.mp4
 *   npm run render -- --from 50 --to 70             just that stretch, in seconds
 *
 * Needs a Chromium for Playwright: `npx playwright install chromium` once.
 */
import { writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { preview } from 'vite';

const args = process.argv.slice(2);
const has = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const fps = Number(value('fps', '30'));
const captions = has('captions');
const from = value('from', undefined);
const to = value('to', undefined);
let out = value('out', 'living-equations.mp4');

const server = await preview({ preview: { port: 4174, strictPort: false, open: false }, logLevel: 'warn' });
const url = server.resolvedUrls?.local[0];
if (!url) throw new Error('Could not start the preview server. Run `npm run build` first.');

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ acceptDownloads: true });
  page.on('console', (m) => {
    const text = m.text();
    if (text.startsWith('frame ')) process.stdout.write(`\rRendering ${text.slice(6)} frames   `);
  });
  page.on('pageerror', (e) => console.error('\nPage error:', e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__lesson?.ready === true);
  const [download, info] = await Promise.all([
    page.waitForEvent('download', { timeout: 0 }),
    page.evaluate((o) => window.__lesson.renderVideo(o), { fps, captions, from: from && Number(from), to: to && Number(to) }),
  ]);
  const ext = `.${info.extension}`;
  if (!out.endsWith(ext)) out = out.replace(/\.[a-z0-9]+$/i, '') + ext;
  await download.saveAs(out);
  if (from || to) {
    // Subtitles are timed for the whole film, so they only come with a full render.
    console.log(`\nSaved ${out} (${info.codec}, ${info.frames} frames at ${fps} fps)`);
  } else {
    const base = out.replace(/\.[a-z0-9]+$/i, '');
    await writeFile(`${base}.srt`, await page.evaluate(() => window.__lesson.srt()));
    await writeFile(`${base}-voiceover.txt`, await page.evaluate(() => window.__lesson.script()));
    console.log(`\nSaved ${out} (${info.codec}, ${info.frames} frames at ${fps} fps), ${base}.srt and ${base}-voiceover.txt`);
  }
} finally {
  await browser.close();
  await server.close();
}
