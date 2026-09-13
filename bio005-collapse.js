/* ============================================================
   BIO 005 Human Physiology, Fall 2026
   bio005-collapse.js

   LONG PAGES, OPENED ONE PIECE AT A TIME.

   WHY
   ---
   Several pages in this course are long because the content is
   long: the syllabus, a week page with seven stages, the Pearson
   walkthrough. A student who opens one of those on a phone gets a
   wall of text and no sense of how much is left, and the usual
   response to a wall of text is to skim it or close it. Neither
   is what any of it was written for.

   This turns each long section into a heading you press. The page
   becomes a short list of what is on it, and the student opens the
   part they need. Nothing is removed and nothing is summarized;
   the whole page is still there, one press away.

   WHAT IT TOUCHES, AND WHAT IT LEAVES ALONE
   -----------------------------------------
   Only a section that is genuinely long gets folded. The
   threshold is measured in characters rather than guessed at, and
   a section under it stays exactly as it was, because collapsing
   three sentences adds a click and saves nothing.

   The first section is left open. A page that opens fully closed
   looks broken, and the student cannot tell whether the content
   loaded.

   Pages opt out with:

       <body data-collapse="off">

   which is set on anything meant to be printed and filled in by
   hand, and on pages that already fold their own content.

   PRINT
   -----
   Everything opens for printing. A student who prints a page with
   half of it folded away gets half a page, which would make this
   a bug rather than a feature.

   MEMORY
   ------
   Which sections a student left open is remembered per page in
   this browser. Coming back to a page they were part way through
   should not mean opening the same four things again. The key is
   prefixed bio005- because this site shares an origin with BIO
   004 and an unprefixed key would collide with it.

   ACCESSIBILITY
   -------------
   The heading stays a heading; the button goes inside it, which is
   the pattern screen readers announce correctly ("heading level 2,
   button, collapsed"). aria-expanded tracks state, aria-controls
   points at the region, the region is hidden with the hidden
   property rather than display:none in a stylesheet so nothing can
   leave it visible to a screen reader while invisible on screen,
   and every control is reachable and operable from the keyboard
   with a visible focus ring. Motion respects
   prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';
  if (window.__BIO005_COLLAPSE__) return;

  window.__BIO005_COLLAPSE__ = true;

  /* WHOLE PAGE, OR NONE OF IT.

     The first version folded only sections over a length threshold,
     which left a syllabus where section 01 had a chevron, 02 did not,
     03 did. A student cannot learn a control that appears on some
     headings and not others, and the ones without it read as broken.
     So the threshold decides whether the PAGE is long enough to be
     worth folding, and then every section on it folds. */
  var PAGE_MIN_CHARS = 4000;
  var MIN_SECTIONS = 3;

  /* Print sheets and worksheets. Folding a page a student is about to
     print and write on would hide the thing they came for. */
  var OPT_OUT = [
    'note-sheet.html', 'patient-sheet.html', 'ungraded-sheet.html',
    'competency-sheet-print.html', 'competency-packet.html',
    'competency-packet-fall2026.html', 'mastery-canvas.html',
    'practice-exam.html', 'mastery-physio-os.html',
    'mastery-physio-os-standalone.html', 'course-questions.html'
  ];

  /* THE WEEK COMPETENCY PAGES ARE DELIBERATELY NOT FOLDED.

     They were not folding anyway, because each competency wraps its
     heading in a div and the check looks for a heading that is a direct
     child of its section. That was an accident, but the right answer is
     the same as the accident: a competency page is a list you scan, and
     one section per competency would turn twelve scannable items into
     twelve closed boxes. The competency packet is opted out above for
     exactly this reason. Making it explicit so the next person to read
     this file does not "fix" it. */
  for (var ow = 1; ow <= 15; ow++) {
    OPT_OUT.push('week-' + (ow < 10 ? '0' : '') + ow + '-competencies.html');
  }

  function fileName() {
    var p = location.pathname, i = p.lastIndexOf('/');
    return (i < 0 ? p : p.slice(i + 1)) || 'index.html';
  }

  var KEY = 'bio005-open-' + fileName();

  function readState() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function writeState(st) {
    try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {}
  }

  var CSS = [
    '.b5c-h{cursor:pointer;position:relative}',
    '.b5c-btn{all:unset;box-sizing:border-box;display:flex;align-items:flex-start;gap:12px;',
    '  width:100%;cursor:pointer;font:inherit;color:inherit;padding:2px 0}',
    '.b5c-btn:focus-visible{outline:3px solid #8B3A2E;outline-offset:4px;border-radius:4px}',
    '.b5c-chev{flex:0 0 auto;width:22px;height:22px;margin-top:.18em;color:#8B3A2E;',
    '  transition:transform 180ms ease}',
    '.b5c-btn[aria-expanded="true"] .b5c-chev{transform:rotate(90deg)}',
    '.b5c-txt{flex:1 1 auto;min-width:0}',
    '.b5c-count{display:block;font-family:inherit;font-size:12.5px;font-weight:600;',
    '  letter-spacing:0;text-transform:none;color:#5A6675;margin-top:4px}',
    '.b5c-btn[aria-expanded="true"] .b5c-count{display:none}',
    /* the bar of controls at the top of the page */
    '.b5c-bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 18px}',
    '.b5c-all{font:inherit;font-size:13px;font-weight:700;cursor:pointer;',
    '  background:#fff;color:#0B1530;border:1.5px solid rgba(11,21,48,.18);',
    '  border-radius:999px;padding:9px 16px;min-height:38px}',
    '.b5c-all:hover{border-color:#8B3A2E;color:#8B3A2E}',
    '.b5c-all:focus-visible{outline:3px solid #8B3A2E;outline-offset:3px}',
    '.b5c-note{font-size:12.5px;color:#5A6675;font-weight:600}',
    '@media print{',
    '  .b5c-bar{display:none!important}',
    '  .b5c-chev{display:none!important}',
    '  .b5c-count{display:none!important}',
    '  [data-b5c-region][hidden]{display:block!important}}',
    '@media (prefers-reduced-motion:reduce){.b5c-chev{transition:none}}'
  ].join('');

  var CHEV = '<svg class="b5c-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M9 5l7 7-7 7"/></svg>';

  /* Roughly how long the section is, in a unit a student would
     recognize. 200 words a minute is the usual reading estimate and it
     is close enough for a hint. */
  function minutes(chars) {
    var m = Math.round(chars / 5 / 200);
    return m < 1 ? 'under a minute' : m + ' min';
  }

  function candidates() {
    var out = [], seen = [];
    var mains = document.querySelectorAll('main, [role="main"]');
    var scope = mains.length ? mains : [document.body];
    for (var s = 0; s < scope.length; s++) {
      var hs = scope[s].querySelectorAll('section > h2, section > h3');
      for (var i = 0; i < hs.length; i++) {
        var h = hs[i], sec = h.parentNode;
        if (seen.indexOf(sec) > -1) continue;
        /* Only the first heading in a section owns that section. */
        if (sec.querySelector('h2, h3') !== h) continue;
        /* Something must follow the heading, and enough of it. */
        var body = [], n = h.nextElementSibling, chars = 0;
        while (n) { body.push(n); chars += (n.textContent || '').length; n = n.nextElementSibling; }
        if (!body.length) continue;
        /* Never fold a section that holds a form the student types into,
           or an iframe that would reload each time it reopened. */
        if (sec.querySelector('input, textarea, select, iframe, canvas')) continue;
        seen.push(sec);
        out.push({ head: h, body: body, chars: chars });
      }
    }
    return out;
  }

  function build() {
    if (document.body.getAttribute('data-collapse') === 'off') return;

    /* Sep 13 2026. ONE FOLDER PER PAGE. bio005-reading-mode.js, which the
       dock loads course wide, folds the same headings and can section a
       page whose headings are not already in sections, which this one
       cannot. When both ran, each heading ended up with one folder's
       button inside the other's, which is invalid markup, and a click
       opened neither. This runs after load, so by now reading mode has
       had its chance: if it took the page, leave it alone. */
    if (document.querySelector('.rm-head') || window.__BIO005_READING__) return;
    if (OPT_OUT.indexOf(fileName()) > -1) return;

    /* FORCING IT ON.

           <body data-collapse="on">

       A length threshold cannot tell dense from long. how-this-course-works
       runs seven stages of instruction and measures 3,852 characters, which
       put it 148 short of the cutoff, so the one page that explains how the
       whole course works was the one page that would not fold. Rather than
       drop the threshold for all 132 pages and find out later which short
       pages started folding for no reason, a page that should always fold
       says so itself. Two sections are still the floor: a page with one
       thing on it has nothing to fold. */
    var forced = document.body.getAttribute('data-collapse') === 'on';

    var items = candidates();
    if (items.length < (forced ? 2 : MIN_SECTIONS)) return;
    var total = 0;
    items.forEach(function (it) { total += it.chars; });
    if (!forced && total < PAGE_MIN_CHARS) return;

    var st = document.createElement('style');
    st.setAttribute('data-bio005-collapse', '');
    st.textContent = CSS;
    document.head.appendChild(st);

    var saved = readState(), toggles = [];

    items.forEach(function (it, i) {
      var id = 'b5c-r' + i;
      var region = document.createElement('div');
      region.id = id;
      region.setAttribute('data-b5c-region', '');
      it.body.forEach(function (el) { region.appendChild(el); });
      it.head.parentNode.appendChild(region);

      /* The button goes inside the heading so the heading level is kept. */
      var label = it.head.innerHTML;
      it.head.classList.add('b5c-h');
      it.head.innerHTML = '';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'b5c-btn';
      btn.setAttribute('aria-controls', id);
      btn.innerHTML = CHEV + '<span class="b5c-txt">' + label +
        '<span class="b5c-count">' + minutes(it.chars) + '</span></span>';
      it.head.appendChild(btn);

      /* A page can ask for everything open. Notes pages are meant to be
         read front to back, and fifteen closed drawers reads as a page
         with nothing on it. A student's own toggles still win, because
         saved state is checked first. */
      var openAll = document.body.getAttribute('data-collapse') === 'open';
      var open = saved.hasOwnProperty(id) ? !!saved[id] : (openAll || i === 0);
      set(btn, region, open);
      btn.addEventListener('click', function () {
        var now = btn.getAttribute('aria-expanded') !== 'true';
        set(btn, region, now);
        var s2 = readState(); s2[id] = now; writeState(s2);
        tell();
      });
      toggles.push({ btn: btn, region: region, id: id });
    });

    /* Expand all, collapse all. */
    var bar = document.createElement('div');
    bar.className = 'b5c-bar';
    var all = document.createElement('button');
    all.type = 'button';
    all.className = 'b5c-all';
    var note = document.createElement('span');
    note.className = 'b5c-note';
    note.textContent = 'Press a heading to open that part.';
    bar.appendChild(all);
    bar.appendChild(note);

    function anyClosed() {
      return toggles.some(function (t) { return t.btn.getAttribute('aria-expanded') !== 'true'; });
    }
    function label() { all.textContent = anyClosed() ? 'Open everything' : 'Close everything'; }
    all.addEventListener('click', function () {
      var target = anyClosed(), s2 = readState();
      toggles.forEach(function (t) { set(t.btn, t.region, target); s2[t.id] = target; });
      writeState(s2); label(); tell();
    });
    toggles.forEach(function (t) { t.btn.addEventListener('click', label); });
    label();

    var first = items[0].head.closest('section');
    if (first && first.parentNode) first.parentNode.insertBefore(bar, first);

    wireJumps();
    tell();
  }

  /* A JUMP LINK MUST OPEN WHAT IT JUMPS TO.

     Every week page has a stage nav across the top, and the syllabus has
     a contents card. Both are anchor links into sections that may now be
     folded, and landing on a closed section looks exactly like a dead
     link. So anything targeted by the address bar or by a click inside
     the page gets opened first, then scrolled to. */
  function openRegion(r) {
    if (!r || !r.hidden) return false;
    var btn = document.querySelector('[aria-controls="' + r.id + '"]');
    if (!btn) return false;
    set(btn, r, true);
    return true;
  }

  function openContaining(el) {
    var opened = false;
    /* The anchor is often the SECTION itself, in which case the folded
       region is inside it rather than above it. Look both ways. */
    if (el.querySelectorAll) {
      var inner = el.querySelectorAll('[data-b5c-region]');
      for (var i = 0; i < inner.length; i++) if (openRegion(inner[i])) opened = true;
    }
    var up = el;
    while (up && up !== document.body) {
      if (up.hasAttribute && up.hasAttribute('data-b5c-region')) {
        if (openRegion(up)) opened = true;
      }
      up = up.parentNode;
    }
    return opened;
  }

  function openHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var t = document.getElementById(id) ||
            document.querySelector('[name="' + id.replace(/"/g, '\\"') + '"]');
    if (!t) return;
    if (openContaining(t)) {
      tell();
      /* The layout only settles after the region is shown, so scroll on
         the next frame rather than into the position it used to have. */
      requestAnimationFrame(function () {
        t.scrollIntoView({ block: 'start',
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      });
    }
  }

  function wireJumps() {
    window.addEventListener('hashchange', openHash);
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var t = document.getElementById(id);
      if (t && openContaining(t)) { tell(); }
    }, true);
    openHash();
  }

  function set(btn, region, open) {
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    region.hidden = !open;
  }

  /* Canvas sizes these pages from a posted height, so a fold that
     changes the page length has to say so or the frame keeps the old
     height and leaves a band of empty space or a cut off page. */
  function tell() {
    try {
      var id = document.title.replace(/\W+/g, '-').toLowerCase();
      parent.postMessage({ frame: id, height: document.documentElement.scrollHeight }, '*');
    } catch (e) {}
  }

  /* Opening everything before the browser prints, so a printed page is
     the whole page. Restored afterwards. */
  function beforePrint() {
    document.querySelectorAll('[data-b5c-region]').forEach(function (r) {
      if (r.hidden) { r.hidden = false; r.setAttribute('data-b5c-was', '1'); }
    });
  }
  function afterPrint() {
    document.querySelectorAll('[data-b5c-region][data-b5c-was]').forEach(function (r) {
      r.hidden = true; r.removeAttribute('data-b5c-was');
    });
  }
  window.addEventListener('beforeprint', beforePrint);
  window.addEventListener('afterprint', afterPrint);

  /* WAIT FOR THE PAGE TO FINISH BUILDING ITSELF.

     The first version ran once, 200ms after load, and then stopped. That
     is fine for a page whose sections are typed into the HTML, and wrong
     for every page that renders itself from a data file. The fifteen week
     competency pages are the worst case: each one builds twelve sections
     and about twelve thousand characters out of bio005-competencies.js,
     and on anything slower than a fast laptop that render finishes after
     the 200ms had already elapsed. The check ran against an empty page,
     found no sections, and returned. Those are the longest pages in the
     course and the ones Scrubs was looking at when she asked for
     collapsible boxes, and they were the ones not getting them.

     So the page is watched instead of sampled. Every time the DOM stops
     changing for a beat, the check runs again. The first run that finds
     enough to fold does the work and disconnects the watcher. If nothing
     ever qualifies, the watcher gives up on a deadline rather than
     observing for the life of the page. build() is guarded so a second
     run cannot double-fold. */
  var built = false;
  var buildOnce = (function () {
    var inner = build;
    return function () {
      if (built) return true;
      if (document.querySelector('[data-b5c-region]')) { built = true; return true; }
      inner();
      built = !!document.querySelector('[data-b5c-region]');
      return built;
    };
  }());

  var WATCH_MS = 6000;   /* stop watching after this */
  var SETTLE_MS = 180;   /* quiet period that counts as "finished rendering" */

  function start() {
    if (buildOnce()) return;
    if (!window.MutationObserver) { setTimeout(buildOnce, 1200); return; }

    var timer = null, obs = null, deadline = null;
    function stop() {
      if (timer) clearTimeout(timer);
      if (deadline) clearTimeout(deadline);
      if (obs) obs.disconnect();
    }
    function settled() { if (buildOnce()) stop(); }

    obs = new MutationObserver(function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(settled, SETTLE_MS);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    deadline = setTimeout(function () { settled(); stop(); }, WATCH_MS);
  }

  if (document.readyState === 'complete') setTimeout(start, 200);
  else window.addEventListener('load', function () { setTimeout(start, 200); });
}());
