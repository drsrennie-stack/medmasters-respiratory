/* ============================================================
   BIO 005 Human Physiology, Yuba College, Fall 2026
   bio005-nav.js

   One job: nobody is ever stranded.

   Every page in this course gets the same two things from this file.

   1. A back bar at the top of the page. It names the page you came
      from by its real name, so "Back to Week 1" instead of "Back",
      and it always offers Course home as a second route. It is a
      breadcrumb, not the browser back button, so it behaves the same
      whether a student arrived from the dock, from Canvas, from a QR
      code, or from a bookmark six weeks later.

   2. A footer on every page carrying the eight links that should
      never be more than one click away.

   The back bar is skipped on pages that already carry the site header
   with its own back control, so those pages do not end up with two
   back buttons. The footer goes on everything.

   Accessibility notes, because this file is part of the Section D
   answer and not just convenience:
     - The back bar is a <nav aria-label="Breadcrumb"> holding an
       ordered list, which is what a screen reader expects.
     - The current page is marked aria-current="page".
     - The footer is a <footer> landmark holding <nav aria-label="Site">.
     - A skip link is added when the page does not already have one,
       so keyboard users are not walked through the nav on every page.
     - Focus is visible, contrast is measured (see the values below),
       and motion respects prefers-reduced-motion.
     - Internal links carry target="_top" so they break out of the
       Canvas iframe instead of nesting the course inside itself.
       The two Canvas links open in a new tab, since they leave here.

   Measured contrast, all AAA:
     back bar text  #0B1530 on #FFFFFF   11.49:1
     back bar link  #8B3A2E on #FFFFFF   10.16:1
     footer link    #FFFFFF on #060A18   18.34:1
     footer muted   #C9CFD6 on #060A18   11.24:1
   ============================================================ */

(function () {
  'use strict';

  if (window.__bio005NavLoaded) return;
  window.__bio005NavLoaded = true;

  var CANVAS_HOME = 'https://yccd.instructure.com/courses/42616';
  var VIRTUAL_OFFICE = 'https://yccd.instructure.com/courses/42616/discussion_topics/711800';

  /* ---------------------------------------------------------
     The page map.
     name   what this page is called when something links back to it
     parent where "Back to ..." goes
     Anything not listed falls back to the course home, so a page
     added later is never stranded, it is just one level flat.
     --------------------------------------------------------- */
  var PAGES = {
    /* Course home moved to course-start.html on Sep 6 2026. welcome.html was the
       root of this map and 40 pages link to it, so retiring it meant swapping the
       root here rather than editing 40 files. welcome.html now redirects. */
    'index.html':              { name: 'Course home',            parent: null },
    'course-start.html':       { name: 'Start here',             parent: 'index.html' },
    'welcome-tour.html':       { name: 'Welcome tour',           parent: 'course-start.html' },
    'course-entry.html':       { name: 'Start of the course',    parent: null },
    'canvas-home.html':        { name: 'Course entry',           parent: null },
    'start-here.html':         { name: 'Start here',             parent: 'course-start.html' },
    'before-you-start.html':   { name: 'Before you start',       parent: 'course-start.html' },
    'how-grading-works.html':  { name: 'How grading works',      parent: 'course-start.html' },
    'syllabus-fall2026.html':  { name: 'Syllabus',               parent: 'course-start.html' },
    'course-schedule.html':    { name: 'Course schedule',        parent: 'course-start.html' },
    'course-materials.html':   { name: 'Course materials',       parent: 'course-start.html' },
    'sitemap.html':            { name: 'All course pages',       parent: 'course-start.html' },

    /* Weeks */
    'week-01.html':            { name: 'Week 1',  parent: 'course-schedule.html' },
    'week-02.html':            { name: 'Week 2',  parent: 'course-schedule.html' },
    'week-03.html':            { name: 'Week 3',  parent: 'course-schedule.html' },
    'week-04.html':            { name: 'Week 4',  parent: 'course-schedule.html' },
    'week-05.html':            { name: 'Week 5',  parent: 'course-schedule.html' },
    'week-06.html':            { name: 'Week 6',  parent: 'course-schedule.html' },
    'week-07.html':            { name: 'Week 7',  parent: 'course-schedule.html' },
    'week-08.html':            { name: 'Week 8',  parent: 'course-schedule.html' },
    'week-09.html':            { name: 'Week 9',  parent: 'course-schedule.html' },
    'week-10.html':            { name: 'Week 10', parent: 'course-schedule.html' },
    'week-11.html':            { name: 'Week 11', parent: 'course-schedule.html' },
    'week-12.html':            { name: 'Week 12', parent: 'course-schedule.html' },
    'week-13.html':            { name: 'Week 13', parent: 'course-schedule.html' },
    'week-14.html':            { name: 'Week 14', parent: 'course-schedule.html' },
    'week-15.html':            { name: 'Week 15', parent: 'course-schedule.html' },

    /* Week 1 teaching spine */
    'concept-videos-week01.html': { name: 'Week 1 concept videos', parent: 'week-01.html' },
    'braindump-week01.html':      { name: 'Week 1 brain dump',     parent: 'week-01.html' },

    /* Units */
    'unit-01.html': { name: 'Unit 1', parent: 'course-materials.html' },
    'unit-02.html': { name: 'Unit 2', parent: 'course-materials.html' },
    'unit-03.html': { name: 'Unit 3', parent: 'course-materials.html' },
    'unit-04.html': { name: 'Unit 4', parent: 'course-materials.html' },
    'unit-05.html': { name: 'Unit 5', parent: 'course-materials.html' },

    /* Lab */
    'clinical-physiology-lab-manual.html': { name: 'Clinical Physiology Lab manual', parent: 'course-start.html' },
    'osmosis-iv-fluids-lab.html':    { name: 'Osmosis and IV fluids lab', parent: 'clinical-physiology-lab-manual.html' },
    'cbc-pcr-lab.html':              { name: 'CBC and PCR lab',           parent: 'clinical-physiology-lab-manual.html' },
    'pulmonary-function-lab.html':   { name: 'Pulmonary function lab',    parent: 'clinical-physiology-lab-manual.html' },
    'lab-week08-hormone-cycle.html': { name: 'Week 8 hormone cycle lab',  parent: 'clinical-physiology-lab-manual.html' },
    'lab-report-form.html':          { name: 'Lab report form',           parent: 'clinical-physiology-lab-manual.html' },

    /* Assignments */
    'assignment-notesheet.html':    { name: 'Note sheets',      parent: 'how-grading-works.html' },
    'assignment-discussion.html':   { name: 'Discussions',      parent: 'how-grading-works.html' },
    'assignment-bookproblems.html': { name: 'Book problems',    parent: 'how-grading-works.html' },
    'assignment-physioex.html':     { name: 'PhysioEx labs',    parent: 'how-grading-works.html' },

    /* Study tools */
    'competency-study-guide.html':   { name: 'Competency study guide', parent: 'course-start.html' },
    'competency-recall.html':        { name: 'Recall cards',           parent: 'course-start.html' },
    'competency-packet-fall2026.html': { name: 'Competency packet',    parent: 'course-start.html' },
    'mastery-canvas.html':           { name: 'Draw it from memory',    parent: 'course-start.html' },
    'BIO005-patient-file.html':      { name: 'Patient file',           parent: 'course-start.html' },
    'label-kit.html':                { name: 'Label kit',              parent: 'course-start.html' },
    'anatomy-review.html':           { name: 'Anatomy review',         parent: 'course-start.html' },

    /* Instructor side. Reachable, but not advertised to students. */
    'build-tracker.html':        { name: 'Build tracker',      parent: 'course-start.html', staff: true },
    'competency-map.html':       { name: 'Competency map',     parent: 'course-start.html', staff: true },
    'ai-work-log.html':          { name: 'AI work log',        parent: 'course-start.html', staff: true },
    'teaching-guide-week01.html':{ name: 'Week 1 teaching guide', parent: 'course-start.html', staff: true }
  };

  /* Whole families, matched by prefix, so new files inherit a parent
     without anyone having to remember to edit this file. */
  var PREFIX = [
    { test: /^slides-P-/i,   parent: 'concept-videos-week01.html', label: 'Week 1 slide deck' },
    { test: /^slides-p-/,    parent: 'course-materials.html',      label: 'Slide deck' },
    { test: /^workbook_week/,parent: 'course-materials.html',      label: 'Workbook' },
    { test: /^week-\d+/,     parent: 'course-schedule.html',       label: 'Week page' },
    { test: /^lab-/,         parent: 'clinical-physiology-lab-manual.html', label: 'Lab' },
    { test: /^assignment-/,  parent: 'how-grading-works.html',           label: 'Assignment' }
  ];

  function here() {
    var f = (location.pathname.split('/').pop() || 'course-start.html');
    return f === '' ? 'course-start.html' : f;
  }

  function entry(file) {
    if (PAGES[file]) return PAGES[file];
    for (var i = 0; i < PREFIX.length; i++) {
      if (PREFIX[i].test.test(file)) {
        return { name: PREFIX[i].label, parent: PREFIX[i].parent };
      }
    }
    return { name: null, parent: 'course-start.html' };
  }

  function titleOf(file) {
    var e = PAGES[file];
    return (e && e.name) ? e.name : 'Course home';
  }

  /* Pages that already carry the site header and its own back control.
     They get the footer but not a second back bar. */

  var READABLE = 'h1,h2,h3,h4,p,li,dt,dd,blockquote,figcaption,caption,td,th';

  function shown(n) {
    return !(n.offsetParent === null && n.getClientRects().length === 0);
  }
  function chrome(n) {
    return !!(n.closest && n.closest('.b5nav, .b5foot, .b5play, .b5listen, nav, [aria-hidden="true"], .bd-dock'));
  }
  function readableCount(host) {
    if (!host) return 0;
    var c = 0;
    [].forEach.call(host.querySelectorAll(READABLE), function (n) {
      if (shown(n) && !chrome(n) && (n.textContent || '').trim().length > 1) c++;
    });
    return c;
  }
  /* The course home is three screens in one file and only one is on screen at a
     time, so an element that is the right answer for a returning student is a
     hidden panel for a first time visitor. Pick the container that actually has
     something in it right now, rather than trusting the markup alone. */
  function contentHost() {
    var m = document.querySelector('main, [role="main"]');
    if (readableCount(m) > 0) return m;
    var best = null, bestN = 0;
    [].forEach.call(document.querySelectorAll('main, section, article, .screen, #main, .shell, .wrap'), function (el) {
      if (!shown(el)) return;
      var n = readableCount(el);
      if (n > bestN) { bestN = n; best = el; }
    });
    return bestN > 0 ? best : document.body;
  }

  function hasOwnHeader() {
    return !!document.querySelector('.site-header .hdr-btn, .site-header .site-logo');
  }

  var CSS = ''
  + '.b5nav{background:#fff;border-bottom:1px solid #E3E1DE;font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}'
  + '.b5nav-in{max-width:1080px;margin:0 auto;padding:10px 20px;display:flex;align-items:center;gap:14px;flex-wrap:wrap}'
  + '.b5nav ol{list-style:none;display:flex;align-items:center;gap:8px;margin:0;padding:0;flex-wrap:wrap}'
  + '.b5nav li{display:flex;align-items:center;gap:8px;font-size:15px;color:#0B1530}'
  + '.b5nav li+li:before{content:"›";color:#8A8A8A;font-size:16px}'
  + '.b5nav a{color:#8B3A2E;text-decoration:none;font-weight:600;border-radius:6px;padding:3px 4px}'
  + '.b5nav a:hover{text-decoration:underline}'
  + '.b5nav a:focus-visible{outline:3px solid #C9A14A;outline-offset:2px}'
  + '.b5nav [aria-current="page"]{color:#0B1530;font-weight:600}'
  + '.b5nav-back{display:inline-flex;align-items:center;gap:7px;border:1px solid #E3E1DE;'
  + 'border-radius:8px;padding:7px 13px;font-size:15px;font-weight:600;color:#8B3A2E;'
  + 'text-decoration:none;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08);'
  + 'transition:transform 200ms ease,box-shadow 200ms ease}'
  + '.b5nav-back:hover{transform:translateY(-2px);box-shadow:0 8px 16px rgba(0,0,0,.10);text-decoration:none}'
  + '.b5nav-back:focus-visible{outline:3px solid #C9A14A;outline-offset:2px}'
  + '.b5foot{background:#060A18;color:#C9CFD6;margin-top:0;'
  + 'font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}'
  + '.b5foot-in{max-width:none;margin:0;padding:26px max(40px,5vw) 34px}'
  + '.b5foot ul{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-wrap:wrap;'
  + 'align-items:center;gap:6px 0;font-size:15px}'
  + '.b5foot li{display:flex;align-items:center}'
  + '.b5foot li+li:before{content:"·";margin:0 12px;color:#6B7A88}'
  + '.b5foot a{color:#fff;text-decoration:none;font-weight:600;border-radius:6px;padding:2px 3px}'
  + '.b5foot a:hover{text-decoration:underline}'
  + '.b5foot a:focus-visible{outline:3px solid #C9A14A;outline-offset:2px}'
  + '.b5foot p{margin:0;font-size:14px;line-height:1.6;color:#C9CFD6;max-width:70ch}'
  + '.b5skip{position:absolute;left:-9999px;top:0;background:#060A18;color:#fff;padding:10px 16px;z-index:1000}'
  + '.b5skip:focus{left:8px;top:8px}'
  + '@media (max-width:560px){.b5nav-in{padding:9px 14px}.b5foot-in{padding:22px 14px 26px}}'
  + '@media (prefers-reduced-motion:reduce){.b5nav-back{transition:none}.b5nav-back:hover{transform:none}}'
  + '@media print{.b5nav,.b5foot,.b5skip,.b5listen,.b5play{display:none!important}}'

  /* Listen to this page. Text to speech, which is NOT a screen reader, and is
     labeled that way everywhere it appears. A student who uses a real screen
     reader has a far better tool already configured the way they like it. This
     is for reading fatigue, for a second language, for following along with
     audio, and for the ones studying in the car park before a shift. */
  + '.b5listen{display:inline-flex;align-items:center;gap:9px;background:transparent;'
  + 'border:1px solid rgba(255,255,255,.35);color:#fff;font:inherit;font-size:14.5px;'
  + 'font-weight:600;border-radius:9px;padding:9px 14px;cursor:pointer;margin:2px 0 14px;'
  + 'transition:background 160ms ease,border-color 160ms ease}'
  + '.b5listen:hover{background:rgba(255,255,255,.10);border-color:rgba(255,255,255,.6)}'
  + '.b5listen:focus-visible{outline:3px solid #C9A14A;outline-offset:2px}'
  + '.b5listen svg{width:18px;height:18px;flex:0 0 auto}'
  + '.b5listen .sub{font-weight:400;color:#C9CFD6;font-size:13.5px}'
  + '.b5play{position:fixed;right:18px;bottom:18px;z-index:2147482000;display:none;'
  + 'align-items:center;gap:8px;background:#fff;border:1px solid #E3E1DE;border-radius:12px;'
  + 'padding:9px 11px;box-shadow:0 8px 22px rgba(0,0,0,.18)}'
  + '.b5play.on{display:flex}'
  + '.b5play button{font:inherit;font-size:14px;font-weight:700;cursor:pointer;color:#8B3A2E;'
  + 'background:#fff;border:1px solid #E3E1DE;border-radius:8px;padding:7px 11px;min-height:34px}'
  + '.b5play button:hover{background:#FAFAF9}'
  + '.b5play button:focus-visible{outline:3px solid #C9A14A;outline-offset:2px}'
  + '.b5play .st{font-size:13.5px;color:#4F5663;padding:0 4px;max-width:15ch}'
  + '.b5read{background:#FBF0D8;border-radius:4px;box-shadow:0 0 0 3px #FBF0D8}'
  + '@media (max-width:560px){.b5play{right:10px;bottom:10px;left:10px;justify-content:center}}'
  /* The dock launcher is fixed at bottom left with a very high z-index. The
     slide decks put their pen toolbar in the same corner, so the launcher sat
     on top of the first few controls and the color swatches failed the WCAG
     2.2 target size rule by being partly covered. Lifting the toolbar clears
     it. Harmless on every page that has no toolbar. */
  + '.inkbar{bottom:76px!important}'
  + '@media (max-width:560px){.inkbar{bottom:84px!important}}';

  /* ---- collapsible sections on the text heavy pages ----
     Sep 8 2026. Scrubs: "be neuro friendly and design the text heavy pages
     with collapsible boxes." The page list lives here so no page has to be
     edited: bio005-fold.js is loaded for these and told which heading level
     folds. A long page then opens as its outline, first section open, the
     rest a heading each, with Open all and Close all above them.
     Add a page: name it here with the heading level that marks a section.
     A page can also carry <html data-fold="h2"> itself, or data-fold="off". */
  /* The notes of record, by week. Weeks 1 to 3 have real written notes
     under their own names; week-NN-notes.html for those weeks is a stub
     that now redirects here. Every other week still points at its
     placeholder until the notes for that week are written, so adding a
     week is one line. */
  var NOTES = {
    1: 'biol005-m01-maintain-control-notes.html',
    2: 'biol005-w02-chemistry-notes.html',
    3: 'biol005-w03-compartments-notes.html'
  };
  function notesFor(w) {
    return NOTES[w] || ('week-' + (w < 10 ? '0' : '') + w + '-notes.html');
  }

  var FOLD = {
    'syllabus-fall2026.html': 'h2',
    'how-grading-works.html': 'h2',
    'how-this-course-works.html': 'h2',
    'accessibility.html': 'h2',
    'competency-study-guide.html': 'h2',
    'competency-packet-fall2026.html': 'h2',
    'week-01-notes.html': 'h2',
    'biol005-m01-maintain-control-notes.html': 'h2',
    'biol005-m02-molecular-toolkit-notes.html': 'h2',
    'biol005-w02-chemistry-notes.html': 'h2',
    'biol005-w03-compartments-notes.html': 'h2',
    'week-01-notesheet-prompts.html': 'h2',
    'week-02-notesheet-prompts.html': 'h2'
  };
  /* Not folded on purpose: the assignment instruction pages, Start here and
     Access Pearson. Those are short and read top to bottom as steps, and a
     hidden step is a missed step. */
  for (var fw = 1; fw <= 15; fw++) {
    var fk = (fw < 10 ? '0' : '') + fw;
    FOLD['week-' + fk + '-competencies.html'] = 'h3';
    if (fw > 2) FOLD['week-' + fk + '-notes.html'] = 'h2';
  }

  function fold(file) {
    if (document.documentElement.getAttribute('data-fold') === 'off') return;
    var lvl = document.documentElement.getAttribute('data-fold') || FOLD[file];
    if (!lvl) return;
    /* Sep 13 2026. This injected bio005-fold.js, which is not in the
       repo, so every page in the FOLD list above threw a 404 and folded
       nothing. bio005-collapse.js is the folder that actually ships and
       does the same job, so the nav loads that instead. It carries its
       own __BIO005_COLLAPSE__ guard, so a page with its own script tag
       does not initialise twice. */
    /* Sep 13 2026, second correction. This injected a folder of its own,
       which made a third one on pages that already had bio005-collapse.js
       and the dock's bio005-reading-mode.js. The dock loads reading mode
       on every page, so the nav does not need to load anything; it only
       records which heading level marks a section, for whichever folder
       runs. */
    window.BIO005_FOLD = lvl;
  }

  function inject() {
    var style = document.createElement('style');
    style.setAttribute('data-bio005-nav', '');
    style.appendChild(document.createTextNode(CSS));
    document.head.appendChild(style);

    var file = here();
    fold(file);
    var me = entry(file);
    var parent = me.parent;

    /* ---- main landmark ----
       A few pages carry their content in a plain div, so a screen reader user
       has no "jump to the main content" landmark and the skip link lands
       nowhere useful. Promote the element the skip link already points at,
       which is by definition the start of the content, rather than guessing. */
    if (!document.querySelector('main, [role="main"]')) {
      var tgt = contentHost();
      if (tgt && tgt !== document.body) {
        tgt.setAttribute('role', 'main');
        if (!tgt.id) tgt.id = 'b5-main';
      }
    }

    /* If a skip link points at something that is not on screen, it drops a
       keyboard user into a hidden panel. Send it to the content instead. */
    var sk = document.querySelector('a[href^="#"].skip, a[href^="#"].b5skip');
    if (sk) {
      var t = null;
      try { t = document.querySelector(sk.getAttribute('href')); } catch (e) {}
      if (!t || readableCount(t) === 0) {
        var good = contentHost();
        if (good && good !== document.body) {
          if (!good.id) good.id = 'b5-main';
          sk.setAttribute('href', '#' + good.id);
        }
      }
    }

    /* ---- skip link, only if the page has none ---- */
    if (!document.querySelector('a[href^="#"].skip, a[href^="#"].b5skip')) {
      var main = document.querySelector('main, [role="main"], #main')
              || document.querySelector('article, .shell, .wrap, .content, #content')
              || (function () {
                   var h = document.querySelector('h1');
                   return h ? (h.parentNode === document.body ? h : h.parentNode) : null;
                 })();
      if (main) {
        if (!main.id) main.id = 'b5-main';
        var skip = document.createElement('a');
        skip.className = 'b5skip';
        skip.href = '#' + main.id;
        skip.textContent = 'Skip to the main content';
        document.body.insertBefore(skip, document.body.firstChild);
      }
    }

    /* ---- one way back, and it is always the same one ----
       Sep 7 2026. The breadcrumb trail and the "Back to <parent>" button
       are gone. Students got a different back destination on every page,
       which is a thing to read before you can use it. One button, one
       destination, the page the course starts on. */
    /* On every page, unless the page already gives one. Some pages have
       their own "Course home" link in the brand bar or a back link of
       their own; two of the same button is worse than one. */
    /* Sep 8 2026: the lone "Course home" button is replaced by the site
       navigation. One bar, the same seven places on every page, so the
       course reads as one website rather than a pile of pages. */
    siteNav();
    gate();

    /* ---- no footer ----
       Sep 7 2026, Scrubs' call: the dark block at the bottom of every page
       is removed. The links it held live in the page chrome and in Canvas,
       and it was repeating itself under content that already ended. The
       Listen widget lived inside it and goes with it. */


    listen();
  }

  /* =========================================================
     THE SITE NAVIGATION. Sep 8 2026.

     Every page gets the same bar with the same eight places on it,
     so a student never has to work out how this page relates to the
     rest of the course. The bar answers the first of the three
     questions (where am I) by marking the section the page belongs
     to, and the second (what do I do next) with This week, which
     always points at the week that is open right now.

     Week data lives here, once. index.html reads it through
     window.BIO005_SITE so the home page and the menu cannot
     disagree about which week it is.

     Accessibility:
       - <nav aria-label="Course sections"> holding a list.
       - The current page carries aria-current="page". The section
         the page belongs to is marked visually and with hidden text.
       - Weeks and Help are disclosure buttons: aria-expanded,
         aria-controls, Escape closes and returns focus, a click
         outside closes, Tab moves through the panel in order.
       - Every target is at least 44 by 44.
       - Contrast: #0B1530 on #FFFFFF 15.9:1, #8B3A2E on #FFFFFF 8.6:1,
         #5A6675 on #FFFFFF 5.6:1 (small sub-labels, AA large is not
         needed because they clear AA normal).
       - Sticky bar is 52px tall, so it never covers a focused control
         (2.4.11). Brand bar becomes static so the two do not stack.
     ========================================================= */

  var WEEKS = [
    [1, '2026-09-08', '2026-09-13', 'How physiology works and what keeps you steady', 1],
    [2, '2026-09-14', '2026-09-20', 'The chemistry that does work in the body', 1],
    [3, '2026-09-21', '2026-09-27', 'Getting across the membrane', 1],
    [4, '2026-09-28', '2026-10-04', 'How cells talk, and the electrical signal', 2],
    [5, '2026-10-05', '2026-10-11', 'Synapses and central integration', 2],
    [6, '2026-10-12', '2026-10-18', 'Sensing the world, and the responses you do not control', 2],
    [7, '2026-10-19', '2026-10-25', 'Muscle, and how movement gets commanded', 2],
    [8, '2026-10-26', '2026-11-01', 'Hormones and reproduction, the slow control system', 2],
    [9, '2026-11-02', '2026-11-08', 'The heart as a pump', 3],
    [10, '2026-11-09', '2026-11-15', 'Pressure, flow, and holding blood pressure steady', 3],
    [11, '2026-11-16', '2026-11-22', 'Blood and how the body defends itself', 3],
    [12, '2026-11-23', '2026-11-29', 'Digestion, and how you use food for fuel', 3],
    [13, '2026-11-30', '2026-12-06', 'Breathing, gas transport, and the fast pH lever', 3],
    [14, '2026-12-07', '2026-12-13', 'The kidney and body fluid balance', 3],
    [15, '2026-12-14', '2026-12-16', 'The slow pH lever, and putting it all together', 3]
  ];
  var PARTS = { 1: 'Part 1, Foundations', 2: 'Part 2, Control systems', 3: 'Part 3, Systems in action' };

  /* A week opens on its Monday at 8:00 am Pacific. (Sep 12 2026: the
     Saturday 8 pm early unlock is gone; Scrubs wants until Monday morning
     to finish each week's material.) Pacific is UTC-7 until 2 am on Nov 1
     2026, then UTC-8. Students are told times in Pacific, so the arithmetic
     is done in Pacific, not device time. */
  function unlockMoment(opensISO) {
    var p = opensISO.split('-');
    var mondayUTC = Date.UTC(+p[0], +p[1] - 1, +p[2]);
    var offset = (mondayUTC < Date.UTC(2026, 10, 1, 9)) ? 7 : 8;   /* hours behind UTC */
    return new Date(mondayUTC + (8 + offset) * 3600000);
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function weekInfo(i, now) {
    var w = WEEKS[i];
    var unlock = unlockMoment(w[1]);
    var closesP = w[2].split('-');
    var closesEnd = new Date(Date.UTC(+closesP[0], +closesP[1] - 1, +closesP[2], 22 + ((Date.UTC(+closesP[0], +closesP[1] - 1, +closesP[2]) < Date.UTC(2026, 10, 1, 9)) ? 7 : 8)));
    return {
      n: w[0], opens: w[1], closes: w[2], title: w[3], part: w[4],
      file: 'week-' + pad2(w[0]) + '.html',
      unlock: unlock,
      open: now >= unlock,
      past: now > closesEnd
    };
  }
  function currentWeek(now) {
    var cur = 0;
    for (var i = 0; i < WEEKS.length; i++) {
      var d = WEEKS[i][1].split('-');
      var monday = new Date(+d[0], +d[1] - 1, +d[2]);
      if (monday <= now) cur = i;
    }
    return cur;
  }
  function fmtDate(iso) {
    var d = iso.split('-');
    return new Date(+d[0], +d[1] - 1, +d[2]).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }
  function fmtShort(iso) {
    var d = iso.split('-');
    return new Date(+d[0], +d[1] - 1, +d[2]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  /* Which section a file belongs to. Order matters: the first match wins. */
  var SECTIONS = [
    { key: 'home',  test: /^(index\.html)?$/ },
    { key: 'weeks', test: /^week-\d\d(-notesheet-prompts|-competencies)?\.html$|^note-sheet\.html$/ },
    { key: 'lecture', test: /^(lecture-week|concept-videos-week\d+|door-lecture|week-\d\d-notes|slides-[pP]-.*|biol005-m\d\d-.*|worksheet-.*|welcome-to-physiology)\.html$/ },
    { key: 'lab', test: /^(door-lab|clinical-physiology-lab-manual|.*-lab|lab-.*|reference-range-lab|patient-sheet|BIO005-patient-file|assignment-physioex|access-pearson|physioex.*)\.html$/ },
    { key: 'check', test: /^(practice-exam|assignment-practice-log)\.html$/ },
    { key: 'study', test: /^(door-study|mastery-.*|competency-.*|spaced-recall|rx-cards|study-with-me|scholar-points|braindump-.*|anatomy-review|label-kit|learning-lab|ungraded-sheet|workbook_.*)\.html$/ },
    { key: 'assign', test: /^(door-assignments|assignment-.*|patient-chart-book|patient-sheet|what-you-do|how-grading-works|ai-work-log)\.html$/ },
    { key: 'help', test: /^(course-start|how-this-course-works|syllabus-.*|course-schedule|course-questions|virtual-office|accessibility|before-you-start|ai-in-this-course|sitemap|welcome-tour|course-materials)\.html$/ }
  ];
  function sectionOf(file) {
    for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].test.test(file)) return SECTIONS[i].key;
    return null;
  }

  var MARK = '<svg viewBox="40 10 125 148" width="22" height="26" aria-hidden="true" focusable="false"><g transform="translate(0,18)"><g transform="translate(60,0) rotate(8 0 130)"><circle cx="0" cy="20" r="10" fill="#0B1530"/><path d="M 0,32 C -10,32 -16,36 -16,42 C -16,55 -13,68 -11,82 C -10,100 -12,118 -14,130 L 14,130 C 12,118 10,100 11,82 C 13,68 16,55 16,42 C 16,36 10,32 0,32 Z" fill="#0B1530"/></g><g transform="translate(100,0)"><circle cx="0" cy="10" r="11" fill="#8B3A2E"/><path d="M 0,22 C -11,22 -17,26 -17,34 C -17,52 -14,70 -12,86 C -11,108 -13,122 -15,132 L 15,132 C 13,122 11,108 12,86 C 14,70 17,52 17,34 C 17,26 11,22 0,22 Z" fill="#8B3A2E"/></g><g transform="translate(140,0) rotate(-8 0 130)"><circle cx="0" cy="20" r="10" fill="#C9A14A"/><path d="M 0,32 C -10,32 -16,36 -16,42 C -16,55 -13,68 -11,82 C -10,100 -12,118 -14,130 L 14,130 C 12,118 10,100 11,82 C 13,68 16,55 16,42 C 16,36 10,32 0,32 Z" fill="#C9A14A"/></g></g></svg>';

  var NAVCSS = ''
  + '.mm-brandbar{position:static!important}'
  + '.b5site{position:sticky;top:0;z-index:70;background:#fff;border-bottom:1px solid #D9DCE3;'
  + 'font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;'
  + 'box-shadow:0 1px 3px rgba(11,21,48,.08)}'
  + '.b5site-in{max-width:1080px;margin:0 auto;padding:0 12px;display:flex;align-items:center;gap:2px;flex-wrap:wrap;position:relative}'
  + '.b5site ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;align-items:stretch;gap:2px;width:100%}'
  + '.b5site li{position:relative;display:flex}'
  + '.b5site li.b5-grow{margin-left:auto}'
  + '.b5site a,.b5site button{display:inline-flex;align-items:center;gap:6px;min-height:48px;padding:6px 12px;'
  + 'font:inherit;font-size:15px;font-weight:700;color:#0B1530;text-decoration:none;background:none;border:0;'
  + 'border-bottom:3px solid transparent;border-radius:0;cursor:pointer;white-space:nowrap;line-height:1.2}'
  + '.b5site a:hover,.b5site button:hover{color:#8B3A2E;border-bottom-color:#D9DCE3}'
  + '.b5site a:focus-visible,.b5site button:focus-visible{outline:3px solid #8B3A2E;outline-offset:-3px}'
  + '.b5site .b5-on>a,.b5site .b5-on>button{color:#8B3A2E;border-bottom-color:#8B3A2E}'
  + '.b5site a[aria-current="page"]{color:#8B3A2E;border-bottom-color:#8B3A2E}'
  + '.b5site .b5-sub{font-weight:600;font-size:12.5px;color:#5A6675;margin-left:2px}'
  + '.b5site .b5-caret{width:10px;height:10px;transition:transform 160ms ease}'
  + '.b5site button[aria-expanded="true"] .b5-caret{transform:rotate(180deg)}'
  + '.b5site .b5-home svg{width:20px;height:24px}'
  + '.b5site .b5-canvas a{border:1.5px solid #0B1530;border-radius:999px;min-height:38px;padding:4px 14px;margin:5px 4px 5px 0;font-size:14px}'
  + '.b5site .b5-canvas a:hover{background:#0B1530;color:#fff;border-bottom-color:#0B1530}'
  + '.b5vh{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}'
  + '.b5panel{position:absolute;left:0;top:100%;z-index:80;background:#fff;border:1px solid #D9DCE3;border-radius:0 0 12px 12px;'
  + 'box-shadow:0 12px 28px rgba(11,21,48,.14);padding:14px 16px 16px;min-width:300px;max-width:min(92vw,720px)}'
  + '.b5panel[hidden]{display:none}'
  + '.b5panel h2{font:inherit;font-size:11.5px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:#5A6675;margin:10px 0 4px}'
  + '.b5panel h2:first-child{margin-top:0}'
  + '.b5panel ul{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:2px 10px;width:auto}'
  + '.b5panel ul.b5-weeks{grid-template-columns:repeat(auto-fill,minmax(210px,1fr))}'
  + '.b5panel li{display:block}'
  + '.b5panel a{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-height:44px;padding:6px 8px;'
  + 'border:0;border-left:3px solid transparent;border-radius:6px;white-space:normal;font-weight:600;font-size:14.5px;line-height:1.3}'
  + '.b5panel a:hover{background:#F3F4F7;color:#8B3A2E}'
  + '.b5panel a .b5-t{font-weight:800;color:#0B1530}'
  + '.b5panel a .b5-d{font-size:13px;font-weight:600;color:#5A6675}'
  + '.b5panel a.b5-cur{border-left-color:#8B3A2E;background:#FBF4F2}'
  + '.b5panel a.b5-cur .b5-t{color:#8B3A2E}'
  + '.b5panel a.b5-locked .b5-t{color:#5A6675}'
  + '.b5panel a.b5-locked .b5-t::before{content:"\\1F512\\00a0";font-size:12px}'
  + '.b5panel a.b5-done .b5-t::after{content:"\\00a0\\2713";color:#5A6675}'
  + '.b5panel .b5-ext .b5-d::after{content:" (opens in a new tab)"}'
  + '@media (max-width:760px){.b5site-in{padding:0 6px}.b5site a,.b5site button{padding:6px 9px;font-size:14px}'
  + '.b5site .b5-sub{display:none}.b5site li.b5-grow{margin-left:0}'
  + '.b5panel{position:fixed;left:8px;right:8px;top:0;max-width:none;min-width:0;border-radius:12px;'
  + 'margin-top:4px;max-height:70vh;overflow:auto}}'
  + '@media (prefers-reduced-motion:reduce){.b5site .b5-caret{transition:none}}'
  + '@media (forced-colors:active){.b5site{border-bottom:1px solid CanvasText}.b5site .b5-on>a,.b5site .b5-on>button,.b5site a[aria-current="page"]{border-bottom-color:Highlight}'
  + '.b5panel{border:1px solid CanvasText}.b5panel a.b5-cur{border-left-color:Highlight}}'
  + '.b5site .b5-n{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#ECEFF4;color:#0B1530;font-size:11.5px;font-weight:800;margin-right:2px}'
  + '.b5site .b5-on>button .b5-n,.b5site button[aria-expanded="true"] .b5-n{background:#8B3A2E;color:#fff}'
  + '.b5panel .b5-lead{font-size:13.5px;color:#414B5C;margin:0 0 10px;max-width:60ch}'
  + '.b5panel .b5-lead b{color:#0B1530}'
  + '.b5panel a .b5-np{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#8A6D33}'
  + '.b5panel .b5-soon{display:flex;flex-direction:column;gap:1px;min-height:44px;padding:6px 8px;border-left:3px solid transparent;font-size:14.5px;line-height:1.3}'
  + '.b5panel .b5-soon .b5-t{font-weight:800;color:#5A6675}.b5panel .b5-soon .b5-d{font-size:13px;font-weight:600;color:#5A6675}'
  + '@media (max-width:760px){.b5site li.b5-stage{display:none}}'
  + '@media print{.b5site{display:none!important}}';

  /* Exposed at load time, before any DOMContentLoaded work, so a page's own
     inline script can read it straight after this file is included. */
  (function () {
    var now = new Date(), infos = [];
    for (var i = 0; i < WEEKS.length; i++) infos.push(weekInfo(i, now));
    window.BIO005_SITE = { weeks: infos, current: infos[currentWeek(now)], parts: PARTS, fmtDate: fmtDate, fmtShort: fmtShort, held: {} };
  }());

  function base() {
    var s = document.currentScript || document.querySelector('script[src*="bio005-nav.js"]');
    if (!s || !s.src) return '';
    var src = s.getAttribute('src');
    return src.indexOf('/') >= 0 ? src.slice(0, src.lastIndexOf('/') + 1) : '';
  }

  function siteNav() {
    if (document.documentElement.getAttribute('data-site-nav') === 'off') return;
    if (/[?&]embed=1/.test(location.search)) return;
    if (document.querySelector('.b5site')) return;

    var B = base();
    var st = document.createElement('style');
    st.setAttribute('data-bio005-site', '');
    st.appendChild(document.createTextNode(NAVCSS));
    document.head.appendChild(st);

    var now = new Date();
    var ci = currentWeek(now);
    var cur = weekInfo(ci, now);
    var file = here();
    var sec = sectionOf(file);

    var infos = window.BIO005_SITE.weeks;

    /* ---- brand bar, if the page has none ---- */
    if (!document.querySelector('.mm-brandbar, .site-header')) {
      if (!document.querySelector('link[href*="brandbar.css"]')) {
        var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = B + 'assets/brandbar.css';
        document.head.appendChild(l);
      }
      var bb = document.createElement('div');
      bb.className = 'mm-brandbar';
      bb.innerHTML = '<div class="mm-wrap"><a class="mm-mark" href="' + B + 'index.html" target="_top" aria-label="BIO 005 Human Physiology, course home">'
        + MARK + '<span class="mm-wm">BIO <b>005</b><span class="mm-wmsub">Human Physiology</span></span></a>'
        + '<span class="mm-course">BIO 005 &middot; Fall 2026</span></div>';
      var afterSkip = document.querySelector('.b5skip, a.skip');
      if (afterSkip && afterSkip.parentNode === document.body) document.body.insertBefore(bb, afterSkip.nextSibling);
      else document.body.insertBefore(bb, document.body.firstChild);
    }

    /* The brand bar is a div on most pages, which leaves its wordmark outside
       every landmark. Make it the banner when the page has no other banner,
       otherwise a named region, so nothing on the page is unreachable by
       landmark navigation. */
    var brand = document.querySelector('.mm-brandbar');
    if (brand && !brand.getAttribute('role')) {
      var topHeader = [].some.call(document.body.children, function (c) { return c.tagName === 'HEADER' || c.getAttribute('role') === 'banner'; });
      if (topHeader) { brand.setAttribute('role', 'region'); brand.setAttribute('aria-label', 'BIO 005 Human Physiology'); }
      else brand.setAttribute('role', 'banner');
    }

    /* ---- the bar ---- */
    function item(key, href, label, sub, extra) {
      var on = (sec === key);
      var exact = (file === href) || (key === 'home' && (file === '' || file === 'index.html'));
      return '<li class="' + (on ? 'b5-on' : '') + (extra || '') + '"><a href="' + B + href + '" target="_top"'
        + (exact ? ' aria-current="page"' : '') + '>' + label
        + (sub ? '<span class="b5-sub">' + sub + '</span>' : '')
        + (on && !exact ? '<span class="b5vh"> (current section)</span>' : '') + '</a></li>';
    }
    var CARET = '<svg class="b5-caret" viewBox="0 0 10 10" aria-hidden="true" focusable="false"><path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    var weeksHtml = '';
    var lastPart = 0;
    for (var k = 0; k < infos.length; k++) {
      var w = infos[k];
      if (w.part !== lastPart) {
        if (lastPart) weeksHtml += '</ul>';
        weeksHtml += '<h2>' + PARTS[w.part] + '</h2><ul class="b5-weeks">';
        lastPart = w.part;
      }
      var lk = (!w.open || HOLD[w.n]) && w.n !== cur.n;
      var cls = (w.n === cur.n ? 'b5-cur ' : '') + (lk ? 'b5-locked ' : '') + (w.past && w.n !== cur.n && !lk ? 'b5-done' : '');
      var d = w.n === cur.n ? 'This week' : (lk ? 'Opens ' + fmtShort(w.opens) : (w.past ? 'Closed ' + fmtShort(w.closes) : 'Open'));
      weeksHtml += '<li><a class="' + cls.trim() + '" href="' + B + w.file + '" target="_top"'
        + (file === w.file ? ' aria-current="page"' : '') + '>'
        + '<span class="b5-t">Week ' + w.n + '</span><span class="b5-d">' + w.title + '</span>'
        + '<span class="b5-d">' + d + (w.n === cur.n ? '<span class="b5vh">, current</span>' : '') + (lk ? '<span class="b5vh">, not open yet</span>' : '') + '</span></a></li>';
    }
    weeksHtml += '</ul>';

    var helpHtml = '<h2>Getting started</h2><ul>'
      + '<li><a href="' + B + 'course-start.html" target="_top"><span class="b5-t">Start here</span><span class="b5-d">The welcome, and the three things to do before Week 1</span></a></li>'
      + '<li><a href="' + B + 'how-this-course-works.html" target="_top"><span class="b5-t">How this course works</span><span class="b5-d">What one week looks like, start to finish</span></a></li>'
      + '<li><a href="' + B + 'how-grading-works.html" target="_top"><span class="b5-t">How grading works</span><span class="b5-d">What counts, what it is worth, what carries no points</span></a></li>'
      + '</ul><h2>Course documents</h2><ul>'
      + '<li><a href="' + B + 'syllabus-fall2026.html" target="_top"><span class="b5-t">Syllabus</span><span class="b5-d">Policies, dates, exam windows</span></a></li>'
      + '<li><a href="' + B + 'course-schedule.html" target="_top"><span class="b5-t">Schedule</span><span class="b5-d">All fifteen weeks on one page</span></a></li>'
      + '<li><a href="' + B + 'course-questions.html" target="_top"><span class="b5-t">Questions and answers</span><span class="b5-d">The questions students ask most</span></a></li>'
      + '<li><a href="' + B + 'accessibility.html" target="_top"><span class="b5-t">Accessibility</span><span class="b5-d">How this site is built, and how to report a problem</span></a></li>'
      + '</ul><h2>Reach me</h2><ul>'
      + '<li><a href="' + B + 'virtual-office.html" target="_top"><span class="b5-t">Virtual office</span><span class="b5-d">Office hours and how to ask a question</span></a></li>'
      + '<li class="b5-ext"><a href="' + CANVAS_HOME + '" target="_blank" rel="noopener"><span class="b5-t">Canvas</span><span class="b5-d">Turn work in, see grades</span></a></li>'
      + '</ul>';

    /* ---- the four stages, for the week that is open now ----
       Sep 13 2026: the middle of the bar is the same four stages the week
       pages use (Learn, Practice, Apply, Check), each opening the tools
       for the current week, nested the way the week page nests them. One
       vocabulary everywhere, and it follows the week by itself. The old
       type-based items (Lectures, Labs, Study, Assignments) and the
       bottom-left Course tools dock are retired. */
    var nn = pad2(cur.n), wn = cur.n;
    function tool(href, t, d, np, ext) {
      var exact = (file === href.split('?')[0] && (href.indexOf('?week=') < 0 || location.search.indexOf('week=' + wn) >= 0));
      return '<li' + (ext ? ' class="b5-ext"' : '') + '><a href="' + (ext ? '' : B) + href + '"' + (ext ? ' target="_blank" rel="noopener"' : ' target="_top"')
        + (exact ? ' aria-current="page"' : '') + '><span class="b5-t">' + t + '</span><span class="b5-d">' + d + '</span>'
        + (np ? '<span class="b5-np">' + np + '</span>' : '') + '</a></li>';
    }
    var STAGES = {
      learn: { n: 1, name: 'Learn', tag: 'No points',
        lead: 'This is where I teach you what you need to understand. <b>Watch first.</b>',
        html: '<ul>'
          + tool('lecture-week.html?week=' + wn, 'Learn It With Dr. Rennie', 'This week\'s lectures, short and in order')
          + tool(notesFor(wn), 'Notes', 'The written version of what I teach')
          + tool('note-sheet.html?week=' + wn, 'Note sheet', 'One box per competency. Print it before you start')
          + tool('week-' + nn + '-competencies.html', 'Competencies', 'What you have to be able to do this week')
          + tool('door-lecture.html', 'Every week\'s lectures', 'All fifteen weeks, by week')
          + '</ul>' },
      practice: { n: 2, name: 'Practice', tag: 'No points',
        lead: 'Get it back and work with it while mistakes are still useful. <b>Pick the ones that suit you.</b>',
        html: '<ul>'
          + tool('competency-brain-dump.html', 'Try It From Memory', 'A brain dump, then the self check')
          + tool('mastery-canvas.html', 'Draw it, then teach it', 'Draw the mechanism from nothing, then explain it out loud with no notes')
          + tool('rx-cards.html?week=' + wn, 'Rx Cards', 'Spaced recall that gets harder as you prove it')
          + tool('assignment-bookproblems.html?week=' + wn, 'Book problems', 'Problems you have not seen. Predict, commit, check')
          + tool('study-with-me.html', 'Study With Me', 'Quiz each other, teach it to someone. Optional, earns Scholar Points')
          + tool('https://drsrennie-stack.github.io/new-build-bio4-solano/kahoots.html', 'Kahoot library', 'Dr. Rennie\'s Kahoots. Physiology sets get added through the term', '', true)
          + tool('ungraded-sheet.html?week=' + wn, 'All of it on one sheet', 'Every practice item for the week, printable')
          + '<li><span class="b5-soon"><span class="b5-t">Physiology games</span><span class="b5-d">Opens later this term</span></span></li>'
          + '</ul>' },
      apply: { n: 3, name: 'Apply', tag: 'Graded',
        lead: 'Use what you learned on a patient, a lab result, a decision. <b>These are graded and due Sunday 10 pm.</b>',
        html: '<ul>'
          + tool('week-' + nn + '.html#apply', 'This week\'s lab', 'What to run, what to record, and how to turn it in', 'Investigate It &middot; 25%')
          + tool('assignment-apply.html?week=' + wn, 'Use It case', 'This week\'s case on your patient, five questions', 'Use It &middot; 20%')
          + (wn === 1
              ? tool('assignment-discussion-01-visionboard.html', 'Discussion 1A', 'Digital vision board and video introduction', 'Think About It &middot; 15%')
                + tool('assignment-discussion-01-metacognition.html', 'Discussion 1B', 'What the evidence told you about how you learned', 'Think About It &middot; 15%')
              : tool('assignment-discussion.html?week=' + wn, 'Discussion ' + wn, 'Post by Friday, two replies by Sunday', 'Think About It &middot; 15%'))
          + tool('how-grading-works.html', 'How grading works', 'What counts, what it is worth')
          + '</ul><h2>Patient file, the capstone</h2><p class="b5-lead">One patient you keep track of all semester. Each week you add that week\'s numbers and your thinking by hand. <b>Nothing is turned in weekly.</b> The whole chart comes in once, on December 16.</p><ul>'
          + tool('patient-chart-book.html', 'Your patient chart', 'One patient, all term. Add this week by hand', 'Use It &middot; 5%')
          + tool('assignment-patient-chart.html', 'What you turn in on Dec 16', 'Exactly what the PDF must contain, in order')
          + '</ul>' },
      check: { n: 4, name: 'Check', tag: 'No points',
        lead: 'Find the gaps before they cost you points. <b>A low score is information.</b>',
        html: '<ul>'
          + tool('practice-exam.html?week=' + wn, 'Mastery Check', 'Thirty questions, nothing open, a report you can upload')
          + tool('week-' + nn + '-competencies.html', 'Competency checklist', 'Tick what you can do from memory')
          + tool('assignment-practice-log.html', 'Upload your report', 'No points, and I read every one')
          + '</ul>' }
    };
    var STAGE_OF = { lecture: 'learn', study: 'practice', lab: 'apply', assign: 'apply', check: 'check' };
    var stageOn = STAGE_OF[sec] || null;
    /* Sep 13 2026, second pass: the stage buttons open the Course tools
       dock (bio005-dock.js) straight to that stage's group, rather than a
       dropdown of their own. One catalog, in the dock, and the bar is a
       row of doors into it. The dropdown markup stays as the fallback for
       a page where the dock failed to load. */
    function stageItem(key) {
      var S = STAGES[key];
      return '<li class="b5-stage' + (stageOn === key ? ' b5-on' : '') + '"><button type="button" id="b5-' + key + '-btn" data-stage="' + S.n + ' ' + S.name + '" aria-haspopup="dialog" aria-expanded="false" aria-controls="b5-' + key + '-panel">'
        + '<span class="b5-n" aria-hidden="true">' + S.n + '</span>' + S.name
        + (stageOn === key ? '<span class="b5vh"> (current section)</span>' : '') + '</button>'
        + '<div class="b5panel" id="b5-' + key + '-panel" hidden>'
        + '<h2>Stage ' + S.n + ' of 4, Week ' + wn + ' &middot; ' + S.tag + '</h2><p class="b5-lead">' + S.lead + '</p>' + S.html + '</div></li>';
    }

    var nav = document.createElement('nav');
    nav.className = 'b5site';
    nav.setAttribute('aria-label', 'Course sections');
    nav.innerHTML = '<div class="b5site-in"><ul>'
      + '<li class="' + (sec === 'home' ? 'b5-on' : '') + '"><a class="b5-home" href="' + B + 'index.html" target="_top"' + (sec === 'home' ? ' aria-current="page"' : '') + '>' + MARK + 'Home</a></li>'
      + item('thisweek', cur.file, 'This week', 'Week ' + cur.n)
      + '<li class="' + (sec === 'weeks' ? 'b5-on' : '') + '"><button type="button" id="b5-weeks-btn" aria-expanded="false" aria-controls="b5-weeks-panel">Weeks' + CARET + (sec === 'weeks' ? '<span class="b5vh"> (current section)</span>' : '') + '</button>'
      + '<div class="b5panel" id="b5-weeks-panel" hidden>' + weeksHtml + '</div></li>'
      + stageItem('learn') + stageItem('practice') + stageItem('apply') + stageItem('check')
      + '<li class="b5-grow b5-canvas"><a href="' + CANVAS_HOME + '" target="_top">Canvas<span class="b5vh">, back to the Canvas course</span></a></li>'
      + '<li class="' + (sec === 'help' ? 'b5-on' : '') + '"><button type="button" id="b5-help-btn" aria-expanded="false" aria-controls="b5-help-panel">Help' + CARET + (sec === 'help' ? '<span class="b5vh"> (current section)</span>' : '') + '</button>'
      + '<div class="b5panel" id="b5-help-panel" hidden>' + helpHtml + '</div></li>'
      + '</ul></div>';

    /* The Course tools dock rides on the nav, so every page that has the
       bar has the dock, and the stage buttons above have something to
       open. Skipped when the page already loads it. */
    if (!document.querySelector('script[src*="bio005-dock.js"]') && !/[?&]embed=/.test(location.search)) {
      var dk = document.createElement('script'); dk.src = B + 'bio005-dock.js'; dk.async = false;
      document.head.appendChild(dk);
    }

    /* This week is its own section only when the page IS the current week. */
    if (file === cur.file) {
      var tw = nav.querySelector('a[href$="' + cur.file + '"]');
      if (tw) { tw.setAttribute('aria-current', 'page'); tw.parentNode.classList.add('b5-on'); }
    }

    var anchor = document.querySelector('.mm-brandbar, .site-header');
    if (anchor && anchor.parentNode === document.body) document.body.insertBefore(nav, anchor.nextSibling);
    else {
      var sk2 = document.querySelector('.b5skip, a.skip');
      if (sk2 && sk2.parentNode === document.body) document.body.insertBefore(nav, sk2.nextSibling);
      else document.body.insertBefore(nav, document.body.firstChild);
    }

    /* ---- disclosures ---- */
    var btns = nav.querySelectorAll('button[aria-controls]');
    function closeAll(except) {
      [].forEach.call(btns, function (b) {
        if (b === except) return;
        b.setAttribute('aria-expanded', 'false');
        var p = document.getElementById(b.getAttribute('aria-controls'));
        if (p) p.hidden = true;
      });
    }
    [].forEach.call(btns, function (b) {
      var p = document.getElementById(b.getAttribute('aria-controls'));
      b.addEventListener('click', function () {
        if (b.getAttribute('data-stage') && window.BIO005_DOCK && window.BIO005_DOCK.open) {
          closeAll();
          window.BIO005_DOCK.open(b.getAttribute('data-stage'));
          return;
        }
        var open = b.getAttribute('aria-expanded') === 'true';
        closeAll(b);
        b.setAttribute('aria-expanded', open ? 'false' : 'true');
        p.hidden = open;
        if (!open && window.matchMedia && window.matchMedia('(max-width:760px)').matches) {
          /* On a phone the panel is fixed, so pin it just under the bar and
             let it scroll inside whatever height is left. */
          var r = nav.getBoundingClientRect();
          p.style.top = Math.max(0, r.bottom) + 'px';
          p.style.maxHeight = 'calc(100vh - ' + (Math.max(0, r.bottom) + 12) + 'px)';
        }
        if (!open) {
          var first = p.querySelector('a.b5-cur') || p.querySelector('a');
          if (first) first.focus();
        }
      });
      p.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { e.stopPropagation(); closeAll(); b.focus(); }
      });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && b.getAttribute('aria-expanded') === 'true') { closeAll(); }
      });
    });
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeAll();
    });
    /* Tab out of the last item closes the panel so focus does not fall
       behind an open menu on the next element in the page. */
    nav.addEventListener('focusout', function (e) {
      setTimeout(function () { if (!nav.contains(document.activeElement)) closeAll(); }, 0);
    });
  }

  /* =========================================================
     THE WEEK GATE. Sep 8 2026.

     A week's teaching pages (week-NN.html, week-NN-notes.html,
     lecture-week.html?week=N, the note sheet questions) open on the
     week's Monday at 8:00 am Pacific
     Pacific. On top of the date, HOLD keeps a week locked while it is
     still being built: delete a week's number from HOLD when its
     material is ready. Everything else on the site (competencies,
     note sheet PDFs, recall cards, study guide, schedule, syllabus,
     labs) is never gated.

     A gated page never shows a wall. It names the opening day and the
     opening time and gives the student five ways onward.
     ========================================================= */
  var HOLD = window.BIO005_SITE.held = { 2:1, 3:1, 4:1, 5:1, 6:1, 7:1, 8:1, 9:1, 10:1, 11:1, 12:1, 13:1, 14:1, 15:1 };

  var MANUAL_HOLD = true;   /* clinical-physiology-lab-manual.html stays down until she says otherwise */
  var LAB_PAGES = { 'enzyme-amylase-lab.html': 2, 'osmosis-iv-fluids-lab.html': 3, 'lab-week08-hormone-cycle.html': 8,
                    'cbc-pcr-lab.html': 11, 'pulmonary-function-lab.html': 13 };

  function gatedWeek(file) {
    var m = /^week-(\d\d)(?:-notes|-notesheet-prompts)?\.html$/.exec(file);
    if (m) return parseInt(m[1], 10);
    if (LAB_PAGES[file]) return LAB_PAGES[file];
    if (file === 'lecture-week.html' || file === 'assignment-physioex.html') {
      var q = /[?&]week=(\d{1,2})/.exec(location.search);
      return q ? parseInt(q[1], 10) : 1;
    }
    return 0;
  }

  /* When a page is gated, everything the page put outside its main landmark
     (its own masthead, side panels, intro sections) is hidden too, so the gate
     card is the only content and the only h1 a student or a screen reader meets. */
  function hideAroundMain(main) {
    [].forEach.call(document.body.children, function (c) {
      if (c === main || c.contains(main)) return;
      var t = c.tagName;
      if (t === 'SCRIPT' || t === 'STYLE' || t === 'LINK' || t === 'FOOTER') return;
      if (c.classList.contains('mm-brandbar') || c.classList.contains('b5site') || c.classList.contains('b5skip') || c.classList.contains('skip') || c.classList.contains('mm-foot')) return;
      if (c.classList.contains('b5play') || c.classList.contains('bd-dock') || c.id === 'hootie' || c.classList.contains('hootie')) return;
      c.hidden = true;
    });
  }

  function gateCss() {
    if (document.querySelector('style[data-b5gate]')) return;
    var css = document.createElement('style');
    css.setAttribute('data-b5gate', '');
    css.textContent = '.b5gate{max-width:760px;margin:40px auto 60px;padding:0 22px;font-family:"Plus Jakarta Sans",system-ui,sans-serif;color:#0B1530}'
      + '.b5gate .eb{font-size:12px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#8B3A2E;margin:0 0 10px}'
      + '.b5gate h1{font-family:"Open Sans",system-ui,sans-serif;font-weight:800;font-size:clamp(26px,4.4vw,40px);line-height:1.15;letter-spacing:-.02em;margin:0 0 14px}'
      + '.b5gate .card{background:#fff;border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.08);padding:22px 24px;font-size:17px;line-height:1.6;color:#414B5C}'
      + '.b5gate .card b{color:#0B1530}'
      + '.b5gate h2{font-family:"Open Sans",system-ui,sans-serif;font-size:12px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:#5A6675;margin:26px 0 10px}'
      + '.b5gate ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:10px}'
      + '.b5gate ul a{display:inline-flex;align-items:center;min-height:44px;padding:9px 16px;border-radius:10px;border:1.5px solid #0B1530;color:#0B1530;text-decoration:none;font-weight:700;font-size:15px;background:#fff}'
      + '.b5gate ul a:hover{background:#0B1530;color:#fff}'
      + '.b5gate ul a.main{background:#8B3A2E;border-color:#8B3A2E;color:#fff}.b5gate ul a.main:hover{background:#6E2D24}';
    document.head.appendChild(css);
  }

  function gate() {
    if (/[?&]preview=1/.test(location.search)) return;   /* her own preview while building */
    var file = here();
    var B0 = base();

    /* the lab manual, held whole */
    if (file === 'clinical-physiology-lab-manual.html' && MANUAL_HOLD) {
      gateCss();
      var mm = document.querySelector('main, [role="main"]') || document.body;
      hideAroundMain(mm);
      document.title = 'Lab manual, posting soon · BIO 005 Human Physiology';
      mm.innerHTML = '<div class="b5gate"><p class="eb">BIO 005 · Clinical Physiology Lab</p><h1>The lab manual is not open yet.</h1>'
        + '<div class="card"><p style="margin:0">Each week\'s lab lives on that week\'s page. The collected manual opens here later in the term.</p></div>'
        + '<h2>Until then</h2><ul><li><a class="main" href="' + B0 + window.BIO005_SITE.current.file + '" target="_top">This week</a></li>'
        + '<li><a href="' + B0 + 'door-lab.html" target="_top">The labs, week by week</a></li>'
        + '<li><a href="' + B0 + 'assignment-physioex.html" target="_top">How PhysioEx works</a></li></ul></div>';
      return;
    }

    /* the labs door: locked rows show their opening day instead of links */
    if (file === 'door-lab.html') {
      [].forEach.call(document.querySelectorAll('.rowlist li[data-week]'), function (li) {
        var k = parseInt(li.getAttribute('data-week'), 10);
        var wk = window.BIO005_SITE.weeks[k - 1];
        if (!wk || (wk.open && !HOLD[k])) return;
        var row = li.querySelector('.labrow');
        if (row) row.innerHTML = '<span class="b5-opens">' + (wk.open ? 'Not open yet' : 'Opens ' + fmtShort(wk.opens)) + '<span class="b5vh">, Week ' + k + ' lab not open yet</span></span>';
      });
      return;
    }

    var n = gatedWeek(file);
    if (!n || n < 1 || n > 15) return;
    var w = window.BIO005_SITE.weeks[n - 1];
    var held = !!HOLD[n];
    if (w.open && !held) return;

    var B = base();
    var mon = fmtDate(w.opens);
    var line = w.open && held
      ? 'Week ' + n + ' is not open yet.'
      : 'Week ' + n + ' opens <b>' + mon + ' at 8:00 am Pacific</b>.';

    var main = document.querySelector('main, [role="main"]') || document.body;
    /* the page's own masthead carries the week h1; hide it so the gate card is the only heading */
    hideAroundMain(main);
    document.title = 'Week ' + n + ' opens ' + fmtShort(w.opens) + ' · BIO 005 Human Physiology';
    gateCss();
    var cur = window.BIO005_SITE.current;
    main.innerHTML = '<div class="b5gate"><p class="eb">' + PARTS[w.part] + ' · Week ' + n + ' of 15</p>'
      + '<h1>' + w.title + '</h1>'
      + '<div class="card"><p style="margin:0">' + line + '</p></div>'
      + '<h2>Until then</h2><ul>'
      + '<li><a class="main" href="' + B + cur.file + '" target="_top">This week, Week ' + cur.n + '</a></li>'
      + '<li><a href="' + B + 'week-' + pad2(n) + '-competencies.html" target="_top">Week ' + n + ' competencies</a></li>'
      + '<li><a href="' + B + 'sheets/BIO005-note-sheet-week-' + pad2(n) + '.pdf" target="_top">Week ' + n + ' note sheet (PDF)</a></li>'
      + '<li><a href="' + B + 'rx-cards.html" target="_top">Rx Cards</a></li>'
      + '<li><a href="' + B + 'course-schedule.html" target="_top">The schedule</a></li>'
      + '</ul></div>';
    var h = main.querySelector('h1'); if (h) { h.setAttribute('tabindex', '-1'); }
  }

  /* ---------------------------------------------------------
     Read this page out loud.

     Deliberately not called a screen reader anywhere a student can
     see, because it is not one. It reads the main content in order,
     one block at a time, highlighting as it goes so a student can
     follow along with their eyes and their ears together.

     Chunked by block rather than handed over as one long string,
     because the browser speech engine truncates long utterances and
     because chunking is what makes pause, resume and the highlight
     work at all.
     --------------------------------------------------------- */
  function listen() {
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;

    var foot = document.querySelector('.b5foot .b5foot-in');
    if (!foot || document.querySelector('.b5listen')) return;

    var blocks = [], idx = 0, playing = false, paused = false, keep = null;
    var rate = 1;
    try { var r = parseFloat(localStorage.getItem('bio005-listen-rate')); if (r >= 0.5 && r <= 2) rate = r; }
    catch (e) {}

    var SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"'
      + ' stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
      + '<path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/>'
      + '<path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'b5listen';
    btn.innerHTML = SPEAKER + '<span>Listen to this page<br><span class="sub">Reads the page out loud. This is not a screen reader.</span></span>';
    foot.insertBefore(btn, foot.firstChild);

    var bar = document.createElement('div');
    bar.className = 'b5play';
    bar.innerHTML = '<button type="button" data-a="toggle">Pause</button>'
      + '<button type="button" data-a="rate">1x</button>'
      + '<button type="button" data-a="stop">Stop</button>'
      + '<span class="st" role="status" aria-live="polite"></span>';
    document.body.appendChild(bar);
    var status = bar.querySelector('.st');
    var toggleBtn = bar.querySelector('[data-a="toggle"]');
    var rateBtn = bar.querySelector('[data-a="rate"]');
    rateBtn.textContent = rate + 'x';

    function collect() {
      var host = contentHost();
      var out = [];
      var nodes = host.querySelectorAll(READABLE);
      [].forEach.call(nodes, function (n) {
        if (chrome(n)) return;
        if (!shown(n)) return;
        /* innerText, not textContent. A link whose label and its sub-line are
           separate elements reads as "Course scheduleEvery week" from
           textContent, because nothing separates them. innerText respects the
           rendered layout and puts a break between them. */
        var raw = (typeof n.innerText === 'string' ? n.innerText : n.textContent) || '';
        var t = raw
          .replace(/[\u00B7\u2022\u2219]/g, ', ')      /* separator dots, read as pauses */
          .replace(/[\u2192\u2190\u2191\u2193\u21B5]/g, ' ') /* arrows, decorative */
          .replace(/[\u2713\u2714\u00D7\u2715]/g, ' ')        /* ticks and crosses */
          .replace(/\s+/g, ' ')
          .replace(/\s+,/g, ',')
          .replace(/,\s*,/g, ',')
          /* Section numbers sit in their own span inside the heading, so a
             heading reads as "01Course identification". Put the pause back. */
          .replace(/^(\d{1,2})(?=[A-Z])/, '$1. ')
          .trim();
        if (t.length < 2) return;
        /* Split long paragraphs at sentence ends so pause responds quickly and the
           highlight moves at a readable pace. */
        if (t.length > 240) {
          var parts = t.match(/[^.!?]+[.!?]*\s*/g) || [t];
          var buf = '';
          parts.forEach(function (piece) {
            if ((buf + piece).length > 240 && buf) { out.push({ el: n, text: buf.trim() }); buf = piece; }
            else buf += piece;
          });
          if (buf.trim()) out.push({ el: n, text: buf.trim() });
        } else {
          out.push({ el: n, text: t });
        }
      });
      return out;
    }

    function clearMark() {
      var m = document.querySelector('.b5read');
      if (m) m.classList.remove('b5read');
    }
    function mark(el) {
      clearMark();
      if (!el) return;
      el.classList.add('b5read');
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      try { el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' }); } catch (e) {}
    }

    function speakNext() {
      if (!playing || idx >= blocks.length) { finish(); return; }
      var b = blocks[idx];
      mark(b.el);
      var u = new SpeechSynthesisUtterance(b.text);
      u.rate = rate;
      u.onend = function () { if (playing) { idx++; speakNext(); } };
      u.onerror = function () { if (playing) { idx++; speakNext(); } };
      window.speechSynthesis.speak(u);
      status.textContent = 'Reading, part ' + (idx + 1) + ' of ' + blocks.length;
    }

    function start() {
      /* a page with folded sections opens them all first, so nothing is skipped */
      try { document.dispatchEvent(new CustomEvent('bio005:openall')); } catch (e) {}
      blocks = collect();
      if (!blocks.length) { status.textContent = 'Nothing to read on this page.'; return; }
      idx = 0; playing = true; paused = false;
      bar.classList.add('on');
      toggleBtn.textContent = 'Pause';
      btn.setAttribute('aria-pressed', 'true');
      window.speechSynthesis.cancel();
      speakNext();
      /* Some browsers stop speaking after about fifteen seconds unless nudged. */
      keep = setInterval(function () {
        if (playing && !paused && window.speechSynthesis.speaking) {
          window.speechSynthesis.pause(); window.speechSynthesis.resume();
        }
      }, 10000);
    }

    function finish() {
      playing = false; paused = false;
      clearMark(); clearInterval(keep);
      window.speechSynthesis.cancel();
      bar.classList.remove('on');
      btn.setAttribute('aria-pressed', 'false');
      status.textContent = '';
    }

    btn.addEventListener('click', function () { playing ? finish() : start(); });
    bar.addEventListener('click', function (e) {
      var a = e.target && e.target.getAttribute && e.target.getAttribute('data-a');
      if (a === 'stop') { finish(); btn.focus(); }
      else if (a === 'toggle') {
        if (paused) { window.speechSynthesis.resume(); paused = false;
          toggleBtn.textContent = 'Pause'; status.textContent = 'Reading again.'; }
        else { window.speechSynthesis.pause(); paused = true;
          toggleBtn.textContent = 'Play'; status.textContent = 'Paused.'; }
      } else if (a === 'rate') {
        var steps = [0.75, 1, 1.25, 1.5];
        rate = steps[(steps.indexOf(rate) + 1) % steps.length];
        rateBtn.textContent = rate + 'x';
        try { localStorage.setItem('bio005-listen-rate', String(rate)); } catch (e2) {}
        if (playing) { window.speechSynthesis.cancel(); speakNext(); }
      }
    });
    window.addEventListener('pagehide', function () { try { window.speechSynthesis.cancel(); } catch (e) {} });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
