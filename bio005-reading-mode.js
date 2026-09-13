/* ============================================================
   BIO 005 Human Physiology, Fall 2026
   bio005-reading-mode.js

   ONE READING FORMAT, EVERY LONG PAGE.

   WHY
   ---
   The notes packets run 17,000 to 27,000 words. On a phone that is
   over a hundred screens of continuous text with no way to tell how
   far in you are or how much is left. Students do not fail to read
   it because it is hard. They stop opening it because it does not
   look like it ends.

   This turns a long page into its own sections, opens the first
   one, and puts a complete contents list at the top with a time
   estimate against every section.

   THE RULE THIS FILE IS BUILT AROUND
   ----------------------------------
   NOTHING IS EVER HIDDEN, REMOVED, GATED OR LOCKED.

   A closed section is closed the way a drawer is closed, not the
   way a door is locked. Specifically, all four of these are always
   true, in every mode, on every page:

     1. The contents list at the top names EVERY section on the
        page, whether it is open or shut. A student can always see
        the full shape of what is there.
     2. "Open everything" is one click, always visible, never
        buried in a menu.
     3. Find in page still works. Closed sections carry
        hidden="until-found" where the browser supports it, and the
        built-in search opens any section that matches regardless.
     4. Landing on a #link opens the section it points at.

   That matters more than the tidiness does. A student who feels
   they are being kept from something will not trust the page
   again, and they are right not to.

   WORDING
   -------
   This is a reading preference, not a category of person. The
   control says "Reading format" and "Show everything". It never
   describes who it is for, because it is for anyone who wants it
   and nobody has to explain themselves to use it.

   DEFAULT
   -------
   Reading format is ON by default. A student who wants the old
   continuous page clicks "Show everything" once and it is
   remembered on every page from then on.

   WHERE IT DOES NOT RUN
   ---------------------
   Slide decks, timers, quizzes, drawing tools and anything that
   already paginates itself. Those pages set their own pace and
   chopping them up would break them. See SKIP below.
   ============================================================ */
(function () {
  'use strict';

  if (window.__BIO005_READING__) return;

  /* Sep 13 2026. ONE FOLDER PER PAGE.
     bio005-collapse.js folds the same headings this does. When both ran,
     each heading ended up with a b5c-btn wrapping an rm-head button, a
     button inside a button, and a click landed on neither reliably, so
     sections would not open. Whichever folder gets there first owns the
     page; this one stands down. */
  if (document.querySelector('.b5c-btn')) return;

  window.__BIO005_READING__ = true;

  var STORE   = 'bio005-reading-format';   /* 'sections' (default) | 'everything' */
  var MIN_SECTIONS = 4;                    /* below this a page is short enough already */
  var MIN_WORDS    = 1200;                 /* short pages are left alone ... */
  var MIN_HEIGHT   = 6000;                 /* ... unless they are simply very tall.
                                              Structure lists and lab sprints carry
                                              few words and many rows, and scrolling
                                              them is the thing that hurts. */
  var WPM = 200;                           /* reading speed used for the estimates */

  /* ---------- pages that opt out ---------- */
  function skip() {
    var b = document.body;
    if (!b) return true;
    if (b.hasAttribute('data-no-reading-mode')) return true;
    /* anything that already paginates or runs its own clock.
       Deliberately specific: an early version used a bare ".wt" here and it
       matched a stray element on the syllabus pages, so the longest page a
       first-year student reads was silently excluded. Keep these narrow. */
    if (document.querySelector('.deck, .slides, .slide-stage, [data-timer], .card-stage')) return true;
    /* the pages whose whole job is a single interaction */
    var f = (location.pathname.split('/').pop() || '').toLowerCase();
    var deny = [
      'today.html', 'welcome.html', 'welcome-tour.html', 'course-start.html', 'index.html', 'canvas-enter.html', 'canvas-home.html',
      'bio005-spaced-recall.html', 'card-gap-finder.html', 'bio005-room-map-timer.html',
      'bio005-braindump-selector-fall2026.html', 'atlas-coloring-book.html', 'bio005-draw.html',
      'grade-calculator.html',
      /* A SIGNED FORM MUST NEVER BE COLLAPSED.
         The device policy agreement is filled in and then saved as a PDF.
         Collapsed sections do not print, so a student who completed all 11
         initials, all 4 acknowledgments and the signature got a 3-page PDF
         containing the hero, one initial and the footer, and no way to tell
         it was wrong. Both pages are excluded outright. */
      'digital-device-policy-agreement.html', 'digital-device-policy.html'
    ];
    if (deny.indexOf(f) !== -1) return true;
    /* A STUDY GUIDE IS A CHECKLIST, NOT AN ARTICLE.
       Whether one got collapsed depended only on its length: four of the
       sixteen cross the 1,200-word line and turned into accordions while
       the other twelve did not, so the same kind of page behaved two
       different ways for no reason a student could see. Collapsed
       sections also do not print, and these are printed. All sixteen are
       left open. */
    if (/-study-guide\.html$/.test(f)) return true;
    /* A CHECK IS NOT AN ARTICLE EITHER.
       before-you-start is two boxes a student is meant to see and act on
       in the first thirty seconds. anatomy-review mounts a card deck.
       Collapsing either one hides the thing the page exists for. */
    if (f === 'before-you-start.html' || f === 'anatomy-review.html') return true;
    /* THE WEEK PAGES ARE THE COURSE MATERIAL.
       A student who opens week 1 has come to read week 1. Collapsing it
       means the page they land on is a list of nine headings and none of
       the teaching, and the collapsed parts do not print, so a student
       who prints the week gets the headings and nothing under them. The
       sidebar contents already does the navigating that the accordion
       was there for. */
    if (/^week-\d\d/.test(f)) return true;   /* week-01.html and week-01-standalone.html */
    if (/^mastery-os|^mastery-physio-os|^histology-escape-room|^slides-|-concept-videos\.html$/.test(f)) return true;
    return false;
  }

  function pref() {
    try { return window.localStorage.getItem(STORE) || 'sections'; }
    catch (e) { return 'sections'; }
  }
  function setPref(v) {
    try { window.localStorage.setItem(STORE, v); } catch (e) {}
  }

  function words(el) {
    return ((el.innerText || el.textContent || '').trim().match(/\S+/g) || []).length;
  }
  function mins(n) {
    var m = Math.max(1, Math.round(n / WPM));
    return m < 60 ? m + ' min' : Math.floor(m / 60) + ' hr ' + (m % 60) + ' min';
  }

  /* ---------- find the sections ---------- */
  function root() {
    return document.querySelector('main') || document.querySelector('.wrap') || document.body;
  }

  function headings(scope) {
    return Array.prototype.filter.call(scope.querySelectorAll('h2'), function (h) {
      /* skip headings that are already inside a collapsible or a nav */
      if (h.closest('summary, details, nav, .daystrip, .rm-bar, .rm-toc')) return false;
      /* skip anything visually hidden */
      if (h.offsetParent === null && h.getBoundingClientRect().height === 0) return false;
      return true;
    });
  }

  /* ---------- build ----------

     Headings in this repo are not siblings. In the module packets every h2
     sits inside its own wrapper (section.divider, div.panel-head, and so on),
     so walking nextSibling from the heading captures almost nothing and the
     page silently keeps its full height.

     So: partition the CONTAINER's children instead. A child that holds a
     heading opens a section, and every child after it that holds no heading
     belongs to that section. A child holding more than one heading is
     partitioned the same way one level down. That handles flat pages and
     nested ones with the same rule, and no node is ever left behind, which
     is the property that actually matters here.
  */
  var SECTIONS = [];

  /* the lowest element that contains every heading */
  function lca(nodes) {
    var a = nodes[0];
    for (var i = 1; i < nodes.length; i++) {
      var b = nodes[i];
      while (a && !a.contains(b)) a = a.parentElement;
    }
    return a || root();
  }

  function partition(container, hs) {
    var groups = [], cur = null;
    Array.prototype.slice.call(container.children).forEach(function (kid) {
      var inside = hs.filter(function (h) { return kid === h || kid.contains(h); });
      if (inside.length === 1) {
        cur = { head: inside[0], nodes: [kid] };
        groups.push(cur);
      } else if (inside.length > 1) {
        var sub = partition(kid, inside);
        if (sub.length) {
          sub.forEach(function (g) { groups.push(g); });
          cur = groups[groups.length - 1];
        } else {
          /* could not split it further, keep it whole under the first heading */
          cur = { head: inside[0], nodes: [kid] };
          groups.push(cur);
        }
      } else if (cur) {
        cur.nodes.push(kid);
      }
      /* content before the first heading stays exactly where it is */
    });
    return groups;
  }

  function build() {
    var scope = root();
    var hs = headings(scope);
    if (hs.length < MIN_SECTIONS) return false;

    var tall = (document.body.scrollHeight || 0) >= MIN_HEIGHT;
    if (words(scope) < MIN_WORDS && !tall) return false;

    var groups = partition(lca(hs), hs);
    if (groups.length < MIN_SECTIONS) return false;

    groups.forEach(function (g, i) {
      var h = g.head;

      var sec = document.createElement('section');
      sec.className = 'rm-sec';
      sec.id = 'rm-sec-' + i;

      var body = document.createElement('div');
      body.className = 'rm-body';
      body.id = 'rm-body-' + i;
      body.setAttribute('role', 'region');
      body.setAttribute('aria-labelledby', 'rm-head-' + i);

      /* park the section where the group starts, then move the group into it */
      g.nodes[0].parentNode.insertBefore(sec, g.nodes[0]);
      g.nodes.forEach(function (n) { body.appendChild(n); });

      /* The heading becomes the control, which is the accessible pattern:
         the button lives INSIDE the h2, so the heading stays in the heading
         map and screen reader users can still jump between sections. Any
         id already on the heading is left alone, so existing #anchors and
         the packet's own contents list keep working. */
      var title = h.textContent.trim();
      var head = document.createElement('button');
      head.type = 'button';
      head.className = 'rm-head';
      head.id = 'rm-head-' + i;
      head.setAttribute('aria-expanded', 'false');
      head.setAttribute('aria-controls', 'rm-body-' + i);
      head.innerHTML =
        '<span class="rm-chev" aria-hidden="true"></span>' +
        '<span class="rm-h"></span>' +
        '<span class="rm-mins"></span>';
      head.querySelector('.rm-h').textContent = title;

      var hostH = document.createElement(h.tagName);
      hostH.className = 'rm-hd';
      hostH.appendChild(head);
      sec.appendChild(hostH);
      sec.appendChild(body);

      /* the original heading stays in the flow but goes quiet, so it is not
         announced twice and not seen twice */
      h.classList.add('rm-orig');
      h.setAttribute('aria-hidden', 'true');

      var w = words(body);
      head.querySelector('.rm-mins').textContent = mins(w);

      SECTIONS.push({ i: i, title: title, sec: sec, head: head, body: body, words: w });
    });

    return SECTIONS.length >= MIN_SECTIONS;
  }

  /* ---------- open / close ---------- */
  function open(s, on) {
    s.head.setAttribute('aria-expanded', String(on));
    s.sec.classList.toggle('is-open', on);
    if (on) {
      s.body.removeAttribute('hidden');
    } else {
      /* hidden="until-found" keeps find-in-page working in browsers that
         support it. Browsers that do not fall back to a plain hide, and the
         search box below covers them. */
      try { s.body.setAttribute('hidden', 'until-found'); }
      catch (e) { s.body.setAttribute('hidden', ''); }
    }
  }
  function openAll(on) {
    SECTIONS.forEach(function (s) { open(s, on); });
    announce(on ? 'All sections open.' : 'Sections closed. The contents list above still shows every one.');
  }

  var live;
  function announce(msg) { if (live) live.textContent = msg; }

  /* ---------- the bar and the contents list ---------- */
  function chrome() {
    var scope = root();

    var bar = document.createElement('div');
    bar.className = 'rm-bar';
    bar.innerHTML =
      '<div class="rm-bar-in">' +
        '<p class="rm-stat" id="rm-stat"></p>' +
        '<div class="rm-actions">' +
          '<button type="button" class="rm-btn" id="rm-openall">Open everything</button>' +
          '<button type="button" class="rm-btn" id="rm-mode" aria-pressed="false"></button>' +
        '</div>' +
      '</div>' +
      '<p class="rm-explain" id="rm-explain"></p>';

    var toc = document.createElement('nav');
    toc.className = 'rm-toc';
    toc.setAttribute('aria-labelledby', 'rm-toc-h');
    toc.innerHTML =
      '<p class="rm-toc-h" id="rm-toc-h">What is on this page</p>' +
      '<p class="rm-toc-note">Every section on the page is listed here, open or not. ' +
        'Nothing on this page is hidden from you.</p>' +
      '<label class="rm-find"><span class="rm-find-l">Search this page</span>' +
        '<input type="search" id="rm-find" placeholder="Type a word, for example osteon" ' +
        'autocomplete="off" spellcheck="false"></label>' +
      '<p class="rm-find-out" id="rm-find-out" role="status" aria-live="polite"></p>' +
      '<ol class="rm-toc-list" id="rm-toc-list"></ol>';

    scope.insertBefore(toc, scope.firstChild);
    scope.insertBefore(bar, scope.firstChild);

    live = document.createElement('p');
    live.className = 'rm-sr';
    live.setAttribute('role', 'status');
    live.setAttribute('aria-live', 'polite');
    scope.insertBefore(live, scope.firstChild);

    document.getElementById('rm-toc-list').innerHTML = SECTIONS.map(function (s) {
      return '<li><a href="#rm-sec-' + s.i + '" data-goto="' + s.i + '">' +
             '<span class="rm-toc-t">' + s.title.replace(/[<>&]/g, '') + '</span>' +
             '<span class="rm-toc-m">' + mins(s.words) + '</span></a></li>';
    }).join('');

    var total = SECTIONS.reduce(function (a, s) { return a + s.words; }, 0);
    document.getElementById('rm-stat').textContent =
      SECTIONS.length + ' sections, about ' + mins(total) + ' of reading in total.';

    /* jump to a section, opening it on the way */
    document.getElementById('rm-toc-list').addEventListener('click', function (e) {
      var a = e.target.closest('[data-goto]');
      if (!a) return;
      e.preventDefault();
      var s = SECTIONS[+a.getAttribute('data-goto')];
      open(s, true);
      s.sec.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' });
      s.head.focus();
    });

    document.getElementById('rm-openall').addEventListener('click', function () {
      openAll(true);
      syncMode();
    });

    var modeBtn = document.getElementById('rm-mode');
    modeBtn.addEventListener('click', function () {
      var next = pref() === 'sections' ? 'everything' : 'sections';
      setPref(next);
      apply(next);
      syncMode();
    });

    /* search: opens every section that matches, so a closed section can
       never keep a student from finding something */
    var find = document.getElementById('rm-find');
    var out  = document.getElementById('rm-find-out');
    var t;
    find.addEventListener('input', function () {
      clearTimeout(t);
      t = setTimeout(function () {
        var q = find.value.trim().toLowerCase();
        SECTIONS.forEach(function (s) { s.sec.classList.remove('is-hit'); });
        if (q.length < 2) { out.textContent = ''; return; }
        var hits = SECTIONS.filter(function (s) {
          return (s.body.textContent || '').toLowerCase().indexOf(q) !== -1 ||
                 s.title.toLowerCase().indexOf(q) !== -1;
        });
        hits.forEach(function (s) { open(s, true); s.sec.classList.add('is-hit'); });
        out.textContent = hits.length
          ? hits.length + (hits.length === 1 ? ' section' : ' sections') + ' mention that, and they are open now.'
          : 'Nothing on this page mentions that.';
        if (hits.length) {
          hits[0].sec.scrollIntoView({ block: 'start', behavior: motionOK() ? 'smooth' : 'auto' });
        }
      }, 220);
    });
  }

  function motionOK() {
    try { return !window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return true; }
  }

  function syncMode() {
    var btn = document.getElementById('rm-mode');
    var ex  = document.getElementById('rm-explain');
    if (!btn) return;
    var everything = pref() === 'everything';
    btn.setAttribute('aria-pressed', String(everything));
    btn.textContent = everything ? 'Use the reading format' : 'Show everything, always';
    ex.textContent = everything
      ? 'You are seeing the whole page at once, here and on every other page. Press Use the reading format to go back to one section at a time.'
      : 'This page opens one section at a time. To see the whole page at once instead, press Show everything, always. It will stay that way on every page until you switch it back.';
  }

  function apply(mode) {
    if (mode === 'everything') { openAll(true); return; }
    var openAll = document.body.getAttribute('data-collapse') === 'open'
               || document.documentElement.getAttribute('data-collapse') === 'open';
    SECTIONS.forEach(function (s, i) { open(s, openAll || i === 0); });
  }

  /* an incoming #anchor always wins over the default */
  function honourHash() {
    var h = location.hash;
    if (!h || h.length < 2) return;
    var target = document.querySelector(h) || document.getElementById(h.slice(1));
    if (!target) return;
    var s = SECTIONS.filter(function (x) { return x.sec.contains(target) || x.sec === target; })[0];
    if (s) {
      open(s, true);
      setTimeout(function () {
        s.sec.scrollIntoView({ block: 'start', behavior: 'auto' });
      }, 0);
    }
  }

  /* ---------- styles ---------- */
  function styles() {
    var css = [
      '.rm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
      '.rm-bar{margin:0 0 14px;padding:14px 16px;background:#0B1530;border-radius:12px;color:#fff}',
      '.rm-bar-in{display:flex;flex-wrap:wrap;gap:12px;align-items:center}',
      '.rm-stat{margin:0;font-size:14px;font-weight:600;color:#F2E2B8}',
      '.rm-actions{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}',
      '.rm-btn{font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;padding:9px 14px;',
      'min-height:40px;border-radius:999px;border:1px solid rgba(255,255,255,.34);',
      'background:transparent;color:#fff}',
      '.rm-btn:hover{background:rgba(255,255,255,.12)}',
      '.rm-btn:focus-visible{outline:3px solid #C9A14A;outline-offset:2px}',
      '.rm-explain{margin:10px 0 0;font-size:13px;line-height:1.5;color:#C6CFDC;max-width:70ch}',

      '.rm-toc{margin:0 0 22px;padding:18px 20px;background:#fff;border:1px solid rgba(11,21,48,.14);',
      'border-radius:12px;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
      '.rm-toc-h{margin:0 0 4px;font-size:11.5px;font-weight:800;letter-spacing:.13em;',
      'text-transform:uppercase;color:#6E2D24}',
      '.rm-toc-note{margin:0 0 14px;font-size:13.5px;color:#3D4757;max-width:60ch}',
      '.rm-find{display:block;margin:0 0 10px}',
      '.rm-find-l{display:block;font-size:12.5px;font-weight:700;color:#3D4757;margin:0 0 5px}',
      '#rm-find{width:100%;max-width:420px;font:inherit;font-size:15px;padding:10px 12px;min-height:44px;',
      'border:1px solid rgba(11,21,48,.28);border-radius:9px;background:#FAFAF9;color:#0B1530}',
      '#rm-find:focus-visible{outline:3px solid #6E2D24;outline-offset:2px}',
      '.rm-find-out{margin:0 0 12px;font-size:13.5px;color:#6E2D24;font-weight:600;min-height:1.2em}',
      '.rm-toc-list{list-style:none;margin:0;padding:0;counter-reset:rmc}',
      '.rm-toc-list li{margin:0 0 6px}',
      '.rm-toc-list a{display:flex;gap:12px;align-items:baseline;text-decoration:none;',
      'padding:9px 12px;border-radius:9px;border:1px solid transparent;color:#0B1530}',
      '.rm-toc-list a:hover{background:#FAFAF9;border-color:rgba(11,21,48,.14)}',
      '.rm-toc-list a:focus-visible{outline:3px solid #6E2D24;outline-offset:2px}',
      '.rm-toc-list a::before{counter-increment:rmc;content:counter(rmc);font-size:12px;font-weight:800;',
      'color:#6E2D24;min-width:1.4em}',
      '.rm-toc-t{flex:1 1 auto;font-size:15px;font-weight:600;line-height:1.4}',
      '.rm-toc-m{flex:0 0 auto;font-size:12.5px;color:#3D4757;font-weight:600}',

      '.rm-sec{border:1px solid rgba(11,21,48,.14);border-radius:12px;background:#fff;',
      'margin:0 0 10px;box-shadow:0 1px 3px rgba(0,0,0,.08)}',
      '.rm-sec.is-open{border-color:rgba(11,21,48,.28)}',
      '.rm-sec.is-hit{border-color:#C9A14A;border-width:2px}',
      '.rm-hd{margin:0;padding:0;font-size:inherit;font-weight:inherit}\n.rm-head{display:flex;width:100%;gap:12px;align-items:center;text-align:left;font:inherit;',
      'cursor:pointer;background:none;border:0;padding:16px 18px;min-height:44px;color:#0B1530;border-radius:12px}',
      '.rm-head:hover{background:#FAFAF9}',
      '.rm-head:focus-visible{outline:3px solid #6E2D24;outline-offset:-3px}',
      '.rm-h{flex:1 1 auto;font-size:16.5px;font-weight:700;letter-spacing:-.005em;line-height:1.35}',
      '.rm-mins{flex:0 0 auto;font-size:12.5px;font-weight:600;color:#3D4757}',
      '.rm-chev{flex:0 0 auto;width:10px;height:10px;border-right:2px solid #6E2D24;',
      'border-bottom:2px solid #6E2D24;transform:rotate(-45deg);transition:transform 180ms ease}',
      '.rm-sec.is-open .rm-chev{transform:rotate(45deg)}',
      '.rm-body{padding:0 18px 18px}',
      '.rm-orig{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;white-space:nowrap!important;margin:0!important;padding:0!important;border:0!important}',
      '@media (prefers-reduced-motion:reduce){.rm-chev{transition:none}}',
      /* PRINT MUST NOT LOSE THE PAGE.
         display:block was not enough. hidden="until-found" sets
         content-visibility:hidden-matchable, which display cannot undo, so a
         collapsed section printed as nothing. A syllabus printed 5 pages and
         821 words where the open page is 31 pages and 5,920 words: 86 per
         cent of it missing, with no sign on the paper that anything was. */
      '@media print{.rm-bar,.rm-toc{display:none!important}',
      '.rm-body,.rm-body[hidden],.rm-body[hidden="until-found"]{display:block!important;',
      'content-visibility:visible!important;visibility:visible!important;height:auto!important;',
      'max-height:none!important;overflow:visible!important}',
      '.rm-sec{border:0;box-shadow:none;break-inside:auto}',
      '.rm-chev{display:none}',
      '.rm-head{padding:10px 0}}'
    ].join('');
    var st = document.createElement('style');
    st.id = 'bio005-reading-css';
    st.textContent = css;
    document.head.appendChild(st);
  }

  /* ---------- go ---------- */
  function init() {
    if (skip()) return;
    if (!build()) return;
    styles();
    chrome();
    apply(pref());
    syncMode();
    honourHash();

    document.addEventListener('click', function (e) {
      var h = e.target.closest('.rm-head');
      if (!h) return;
      var s = SECTIONS.filter(function (x) { return x.head === h; })[0];
      if (s) open(s, h.getAttribute('aria-expanded') !== 'true');
    });

    /* a browser that auto-reveals a closed section for find-in-page tells
       us so, and we mark it open rather than leaving the control lying */
    SECTIONS.forEach(function (s) {
      s.body.addEventListener('beforematch', function () { open(s, true); });
    });

    window.addEventListener('hashchange', honourHash);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
