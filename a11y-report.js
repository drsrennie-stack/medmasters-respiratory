/*
 * BIO 005 accessibility auditor.
 *
 *   node a11y-report.js index.html week-01.html ...
 *
 * Runs more than the AA floor:
 *   - axe-core at wcag2a/aa/aaa, wcag21, wcag22, plus best-practice
 *   - measured contrast for every visible text node, reported against the
 *     AA threshold AND the AAA threshold, with the failing pairs named
 *   - target size for every interactive element, against the AAA 44px rule
 *     rather than the AA 24px one
 *   - reflow at 320px, and at 400% zoom (1.4.10)
 *   - the 1.4.12 text-spacing bump, checking nothing clips or overflows
 *   - keyboard: every interactive element reachable, and a focus indicator
 *     that actually changes pixels
 *   - heading order, landmarks, page title, lang
 *
 * Writes a11y-report.json for the compliance notes to read.
 */
const { chromium } = require('playwright');
const fs = require('fs');

const FILES = process.argv.slice(2);
if (!FILES.length) { console.error('usage: node a11y-report.js <files...>'); process.exit(1); }

const MEASURE = `(() => {
  function srgb(c){ c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055,2.4); }
  function lum(rgb){ return 0.2126*srgb(rgb[0])+0.7152*srgb(rgb[1])+0.0722*srgb(rgb[2]); }
  function parse(s){
    var m = s.match(/rgba?\\(([^)]+)\\)/); if(!m) return null;
    var p = m[1].split(',').map(function(x){return parseFloat(x);});
    return { c:[p[0],p[1],p[2]], a: p.length>3 ? p[3] : 1 };
  }
  function over(fg, bg){ // fg with alpha composited on bg
    return [0,1,2].map(function(i){ return fg.c[i]*fg.a + bg[i]*(1-fg.a); });
  }
  function bgOf(el){
    var stack = [], n = el;
    while (n && n.nodeType === 1) {
      var p = parse(getComputedStyle(n).backgroundColor);
      if (p && p.a > 0) { stack.push(p); if (p.a === 1) break; }
      n = n.parentElement;
    }
    var base = [255,255,255];
    for (var i = stack.length - 1; i >= 0; i--) base = over(stack[i], base);
    return base;
  }
  function ratio(a,b){ var L1=lum(a),L2=lum(b); if(L1<L2){var t=L1;L1=L2;L2=t;} return (L1+0.05)/(L2+0.05); }

  var out = [], seen = {};
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  var t;
  while ((t = walker.nextNode())) {
    var txt = (t.nodeValue || '').trim();
    if (!txt) continue;
    var el = t.parentElement;
    if (!el || el.closest('.vh, [aria-hidden="true"], script, style, svg')) continue;
    var cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) continue;
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    var fg = parse(cs.color); if (!fg) continue;
    var bg = bgOf(el);
    var fgc = over(fg, bg);
    var px = parseFloat(cs.fontSize);
    var w = parseInt(cs.fontWeight, 10) || 400;
    var large = px >= 24 || (px >= 18.66 && w >= 700);
    var cr = ratio(fgc, bg);
    var key = cs.color + '|' + bg.join(',') + '|' + px + '|' + w;
    if (seen[key]) continue;
    seen[key] = 1;
    out.push({
      sample: txt.slice(0, 46), color: cs.color,
      bg: 'rgb(' + bg.map(Math.round).join(', ') + ')',
      px: px, weight: w, large: large,
      ratio: Math.round(cr * 100) / 100,
      aa: cr >= (large ? 3 : 4.5), aaa: cr >= (large ? 4.5 : 7),
      where: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).join('.') : '')
    });
  }
  return out;
})()`;

const TARGETS = `(() => {
  var sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
  var out = [];
  document.querySelectorAll(sel).forEach(function (el) {
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return;
    var r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    if (el.classList.contains('skip')) return; // off-screen until focused
    // The target is whatever a pointer can hit. A checkbox inside a label,
    // or an <a> inside a linked wrapper, is as big as that wrapper.
    var lab = el.closest('label') || (el.id && document.querySelector('label[for="' + el.id + '"]'));
    if (lab) {
      var lr = lab.getBoundingClientRect();
      if (lr.width * lr.height > r.width * r.height) r = lr;
    }
    // inline links inside a paragraph are exempt from 2.5.8
    var inline = cs.display === 'inline' && el.closest('p, li, td:not(.inwk), figcaption');
    out.push({
      tag: el.tagName.toLowerCase(),
      name: (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40),
      w: Math.round(r.width), h: Math.round(r.height), inline: !!inline,
      ok24: inline || (r.width >= 24 && r.height >= 24),
      ok44: inline || (r.width >= 44 && r.height >= 44)
    });
  });
  return out;
})()`;

const SPACING = `
  * { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
  p, li, h1, h2, h3, h4 { margin-bottom: 2em !important; }
`;

const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const report = { generated: new Date().toISOString(), pages: [] };
  let issues = 0;

  for (const f of FILES) {
    const rec = { file: f };
    const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
    const errs = [];
    p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
    p.on('console', m => { if (m.type() === 'error' && !/net::|favicon/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
    await p.goto('file://' + require('path').resolve(f));
    await p.waitForTimeout(800);

    // --- axe, full tag set -------------------------------------------------
    await p.addScriptTag({ path: require.resolve('axe-core') });
    const axeRes = await p.evaluate(async (tags) => await axe.run(document, { runOnly: tags }), AXE_TAGS);
    rec.axe = axeRes.violations.map(v => ({
      id: v.id, impact: v.impact, tags: v.tags.filter(t => /^wcag|best/.test(t)),
      n: v.nodes.length, html: (v.nodes[0] || {}).html ? v.nodes[0].html.slice(0, 120) : ''
    }));
    rec.axePasses = axeRes.passes.length;

    // --- structure ---------------------------------------------------------
    rec.structure = await p.evaluate(() => {
      const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => +h.tagName[1]);
      let order = true;
      for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) order = false;
      return {
        lang: document.documentElement.lang || null,
        title: document.title,
        h1: document.querySelectorAll('h1').length,
        headingOrder: order,
        landmarks: {
          banner: document.querySelectorAll('header, [role=banner]').length,
          nav: document.querySelectorAll('nav, [role=navigation]').length,
          main: document.querySelectorAll('main, [role=main]').length,
          contentinfo: document.querySelectorAll('footer, [role=contentinfo]').length
        },
        skipLink: !!document.querySelector('a.skip[href^="#"]'),
        imgNoAlt: [...document.querySelectorAll('img')].filter(i => i.alt === null || i.alt === undefined).length,
        svgNoName: [...document.querySelectorAll('svg[role=img]')].filter(s => !s.getAttribute('aria-label') && !s.querySelector('title')).length,
        externalNoRel: [...document.querySelectorAll('a[target=_blank]')].filter(a => !/noopener/.test(a.rel || '')).length,
        /* An internal link inside a Canvas iframe has to leave the frame,
           or it loads the next page inside the embed and the student is
           stuck in a 560px window. target=_top does that. So does
           target=_blank with rel=noopener, which canvas-enter.html chose
           deliberately so Canvas keeps its place. Both are fine. A link
           with NEITHER is the actual bug, and that is what this counts. */
        internalNoTop: [...document.querySelectorAll('a[href]')].filter(a => {
          const h = a.getAttribute('href') || '';
          if (!/\.html($|[?#])/.test(h)) return false;
          const t = a.getAttribute('target');
          if (t === '_top') return false;
          if (t === '_blank' && /noopener/.test(a.rel || '')) return false;
          return true;
        }).length
      };
    });

    // --- contrast ----------------------------------------------------------
    const contrast = await p.evaluate(MEASURE);
    rec.contrast = {
      pairs: contrast.length,
      failAA: contrast.filter(c => !c.aa),
      failAAA: contrast.filter(c => c.aa && !c.aaa),
      min: contrast.length ? Math.min(...contrast.map(c => c.ratio)) : null,
      all: contrast
    };

    // --- target size -------------------------------------------------------
    const tgt = await p.evaluate(TARGETS);
    rec.targets = {
      n: tgt.length,
      under24: tgt.filter(t => !t.ok24),
      under44: tgt.filter(t => t.ok24 && !t.ok44)
    };

    // --- keyboard ----------------------------------------------------------
    rec.keyboard = await p.evaluate(() => {
      const sel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [tabindex]:not([tabindex="-1"])';
      const all = [...document.querySelectorAll(sel)].filter(el => {
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
      });
      const trapped = all.filter(el => el.tabIndex < 0).length;
      const positive = all.filter(el => el.tabIndex > 0).length;
      return { focusable: all.length, removedFromOrder: trapped, positiveTabindex: positive };
    });

    // real focus ring check: tab through and confirm pixels change
    const focusProbe = await (async () => {
      const before = await p.screenshot({ clip: { x: 0, y: 0, width: 900, height: 620 } });
      await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
      const after = await p.screenshot({ clip: { x: 0, y: 0, width: 900, height: 620 } });
      const focused = await p.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        const cs = getComputedStyle(a);
        return { tag: a.tagName.toLowerCase(), outlineWidth: cs.outlineWidth, outlineColor: cs.outlineColor };
      });
      return { changed: !before.equals(after), focused };
    })();
    rec.focus = focusProbe;

    // --- reflow 320 --------------------------------------------------------
    await p.setViewportSize({ width: 320, height: 800 });
    await p.waitForTimeout(350);
    rec.reflow320 = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      widest: Math.max(...[...document.querySelectorAll('body *')].map(e => Math.round(e.getBoundingClientRect().right)))
    }));

    // --- 400% zoom equivalent (1.4.10) ------------------------------------
    await p.setViewportSize({ width: 1280, height: 1024 });
    await p.evaluate(() => { document.documentElement.style.zoom = ''; });
    const zp = await b.newPage({ viewport: { width: 320, height: 256 }, deviceScaleFactor: 1 });
    await zp.goto('file://' + require('path').resolve(f));
    await zp.waitForTimeout(400);
    rec.zoom400 = await zp.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    await zp.close();

    // --- 1.4.12 text spacing ----------------------------------------------
    await p.setViewportSize({ width: 1280, height: 1000 });
    await p.addStyleTag({ content: SPACING });
    await p.waitForTimeout(400);
    rec.textSpacing = await p.evaluate(() => {
      const clipped = [...document.querySelectorAll('body *')].filter(e => {
        if (e.closest('.vh')) return false;      // visually-hidden by design
        const cs = getComputedStyle(e);
        if (cs.overflow === 'visible' && cs.overflowY === 'visible') return false;
        if (!e.textContent.trim()) return false;
        return e.scrollHeight > e.clientHeight + 3 && cs.overflowY !== 'auto' && cs.overflowY !== 'scroll';
      }).map(e => e.tagName.toLowerCase() + '.' + String(e.className).trim().split(/\s+/)[0]);
      return { horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1, clipped: [...new Set(clipped)] };
    });

    rec.consoleErrors = errs;

    // --- verdict -----------------------------------------------------------
    const fails = [];
    if (rec.axe.length) fails.push(rec.axe.length + ' axe violations');
    if (rec.contrast.failAA.length) fails.push(rec.contrast.failAA.length + ' contrast pairs under AA');
    if (rec.targets.under24.length) fails.push(rec.targets.under24.length + ' targets under 24px');
    if (rec.reflow320.overflow) fails.push('320px overflow');
    if (rec.zoom400) fails.push('400% zoom overflow');
    if (rec.textSpacing.horizontalOverflow || rec.textSpacing.clipped.length) fails.push('text-spacing clip');
    if (rec.structure.h1 !== 1) fails.push('h1 count ' + rec.structure.h1);
    if (!rec.structure.headingOrder) fails.push('heading order skips');
    if (rec.structure.externalNoRel) fails.push('external link missing noopener');
    if (rec.structure.internalNoTop) fails.push(rec.structure.internalNoTop + ' internal links that stay inside the frame');
    if (!rec.focus.changed) fails.push('no visible focus change on Tab');
    if (errs.length) fails.push(errs.length + ' console errors');
    rec.fails = fails;
    issues += fails.length;

    console.log('\n=== ' + f);
    console.log('  axe          ' + rec.axe.length + ' violations, ' + rec.axePasses + ' checks passed');
    rec.axe.forEach(v => console.log('     - ' + v.id + ' [' + v.impact + '] x' + v.n + '  ' + v.tags.join(',')));
    console.log('  contrast     ' + rec.contrast.pairs + ' pairs, min ' + rec.contrast.min + ':1, AA fails ' +
                rec.contrast.failAA.length + ', below AAA ' + rec.contrast.failAAA.length);
    rec.contrast.failAA.forEach(c => console.log('     x ' + c.ratio + ':1  ' + c.where + '  "' + c.sample + '"'));
    rec.contrast.failAAA.forEach(c => console.log('     ~ ' + c.ratio + ':1  ' + c.where + '  "' + c.sample + '"'));
    console.log('  targets      ' + rec.targets.n + ' interactive, <24px ' + rec.targets.under24.length +
                ', 24-44px ' + rec.targets.under44.length);
    rec.targets.under44.forEach(t => console.log('     ~ ' + t.w + 'x' + t.h + '  ' + t.tag + '  "' + t.name + '"'));
    console.log('  reflow       320px overflow ' + rec.reflow320.overflow + ', 400% zoom overflow ' + rec.zoom400);
    console.log('  text spacing overflow ' + rec.textSpacing.horizontalOverflow + ', clipped ' + rec.textSpacing.clipped.length);
    console.log('  focus        visible change ' + rec.focus.changed + ' on ' + (rec.focus.focused ? rec.focus.focused.tag : 'nothing'));
    console.log('  structure    h1 ' + rec.structure.h1 + ', order ' + rec.structure.headingOrder +
                ', landmarks ' + JSON.stringify(rec.structure.landmarks) + ', skip ' + rec.structure.skipLink);
    if (errs.length) errs.forEach(e => console.log('     ! ' + e.slice(0, 120)));
    console.log(fails.length ? '  VERDICT      ' + fails.join('; ') : '  VERDICT      clean');

    report.pages.push(rec);
    await p.close();
  }

  await b.close();
  fs.writeFileSync('a11y-report.json', JSON.stringify(report, null, 1));
  console.log('\n' + (issues ? 'TOTAL ISSUES: ' + issues : 'ALL CLEAN') + '   (a11y-report.json written)');
})();
