/*
 * What height does the Canvas iframe actually need?
 *
 *   node canvas-height.js
 *
 * A Canvas embed gets one fixed height for every device. Too short and phones
 * scroll inside the frame; too tall and laptops look at empty navy. This
 * measures the real content height across the widths a student might load it
 * at, and reports the smallest height that gives nobody a scrollbar.
 *
 * Run it after any change to canvas-start.html, then put the number in the
 * embed snippet. A guessed height is a number that goes stale silently.
 */
const { chromium } = require('playwright');
const path = require('path');
const WIDTHS = [320, 360, 390, 430, 480, 560, 660, 760, 900, 1100, 1400];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let max = 0, at = 0;
  console.log('width   content height');
  for (const w of WIDTHS) {
    const p = await (await b.newContext({ viewport: { width: w, height: 400 } })).newPage();
    await p.goto('file://' + path.resolve('bio4/canvas-start.html') + '?sec=mw');
    await p.waitForTimeout(500);
    const h = await p.evaluate(() =>
      Math.max(document.body.scrollHeight, document.documentElement.scrollHeight));
    if (h > max) { max = h; at = w; }
    console.log(`${String(w).padStart(5)}px  ${String(h).padStart(5)}px`);
  }
  const rec = Math.ceil(max / 10) * 10;
  console.log(`\ntallest ${max}px at ${at}px wide  ->  use height="${rec}"`);
  // prove it
  const p = await (await b.newContext({ viewport: { width: at, height: rec } })).newPage();
  await p.goto('file://' + path.resolve('bio4/canvas-start.html') + '?sec=mw');
  await p.waitForTimeout(500);
  const scrolls = await p.evaluate(() =>
    document.documentElement.scrollHeight > window.innerHeight + 1);
  console.log(`checked at ${at} x ${rec}: inner scrollbar ${scrolls ? 'YES, still too short' : 'no'}`);
  await b.close();
})();
