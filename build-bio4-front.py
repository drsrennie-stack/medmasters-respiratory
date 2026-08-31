#!/usr/bin/env python3
"""
The two front doors for BIO 004 Human Anatomy, Fall 2026.

    python3 build-bio4-front.py

Writes two files into the new-build-bio4-solano repo:

    home.html          the site front door, opened in a browser
    canvas-start.html  the same five cards, sized for the Canvas iframe

ONE SOURCE, TWO PAGES, ON PURPOSE
The five cards are defined once, below. A link that changes changes in one
place. Two hand-kept copies of the same five links is how a course ends up
telling a student two different things.

WHAT IS ALREADY THERE, AND WHY THIS IS NOT A SIXTH FRONT DOOR
welcome.html is the course home and stays the course home. Every card here
opens something that already exists:

    Enter the course      welcome.html
    Lab                   lab-sprints.html
    Lecture               course-materials.html
    Study                 mastery-os-fall-2026.html
    Syllabus and schedule fall-2026-syllabus.html, which sends each student
                          to their own section's syllabus

canvas-enter.html is the current Canvas card and it still works. canvas-start
is the same idea with the four other doors added, so a student who wants the
lab list on a Tuesday night does not have to go through the course home to
reach it.

WHY THE TWO PAGES OPEN LINKS DIFFERENTLY
home.html is a normal page, so its links use target="_top".

canvas-start.html runs inside the Canvas iframe, and its links open in a NEW
TAB instead. That is the decision already documented in canvas-enter.html and
it is right for three reasons that cannot be fixed from inside the frame:
Canvas strips script from page content so nothing embedded can size itself,
localStorage inside the frame is third-party storage and Safari blocks it, and
dialogs get clipped. Opening in a new tab also leaves Canvas where the student
left it.

SECTIONS
Three sections, three different sets of dates, so the syllabus card has to know
which one a student is in. It reads ?sec= from the URL first, then the saved
choice in localStorage. Inside Canvas the URL parameter is the only one that
can be relied on, so bake it into the embed. With neither, the card goes to the
section chooser, which is the correct place to land rather than a wrong guess.

NO STUDENT DATA
Nothing here stores or sends anything about a student. The section choice is a
course section, not a person.
"""
import io, os, re, sys

REPO = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'bio4')
BASE = 'https://drsrennie-stack.github.io/new-build-bio4-solano/'

SECTIONS = {
    'mw':     ('Class 1, Mon / Wed afternoon',  'CRN 80650', 'syllabus-class1.html'),
    'tr-am':  ('Class 2, Tue / Thu morning',    'CRN 80654', 'syllabus-class2.html'),
    'tr-eve': ('Class 3, Tue / Thu evening',    'CRN 80655', 'syllabus-class3.html'),
}

# Stroke icons lifted from bio004-dock.js so the front door draws in the same
# hand as the dock a student meets on every other page. `door` is new; the
# other four are the dock's own.
ICONS = {
    'door':  '<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8"/>'
             '<path d="M11 12h10"/><path d="M17.5 8.5 21 12l-3.5 3.5"/>',
    'flask': '<path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3"/>'
             '<path d="M6.5 15h11"/>',
    'doc':   '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>'
             '<path d="M14 3v5h5M9 13h6M9 17h6"/>',
    'cards': '<rect x="3" y="6" width="13" height="14" rx="2"/>'
             '<path d="M7 11h5M7 15h3"/>'
             '<path d="M8 3h9a2 2 0 0 1 2 2v11"/>',
    'cal':   '<rect x="3" y="5" width="18" height="16" rx="2"/>'
             '<path d="M3 10h18M8 3v4M16 3v4"/>',
}

# The five doors, in the order she asked for them. `sec` marks a link that
# should carry the section along; `secpick` marks the one that can go straight
# to a section's own page once the section is known.
CARDS = [
    {'key': 'enter', 'lead': True, 'icon': 'door',
     'name': 'Enter the course',
     'sub': 'Your course home. This week, your materials, and every tool, '
            'in one place.',
     'go': 'Go to the course home',
     'href': 'welcome.html', 'sec': True},

    {'key': 'lab', 'icon': 'flask',
     'name': 'Lab',
     'sub': 'Lab sprints: every structure you are responsible for on the '
            'models, station by station.',
     'go': 'Open the lab sprints',
     'href': 'lab-sprints.html'},

    {'key': 'lecture', 'icon': 'doc',
     'name': 'Lecture',
     'sub': 'Notes, pre-work sheets, concept videos, workbooks and slide '
            'decks, sorted by module.',
     'go': 'Open the course materials',
     'href': 'course-materials.html'},

    {'key': 'study', 'icon': 'cards',
     'name': 'Study',
     'sub': 'Mastery OS: your recall cards, the structures you keep missing, '
            'and a plan built around them.',
     'go': 'Open Mastery OS',
     'href': 'mastery-os-fall-2026.html', 'sec': True},

    {'key': 'syllabus', 'icon': 'cal',
     'name': 'Syllabus and schedule',
     'sub': 'Your section’s syllabus, your five exam dates, grading, and '
            'the full term calendar.',
     'go': 'Open your syllabus',
     'href': 'fall-2026-syllabus.html', 'secpick': True},
]

LOGO = (
    '<svg viewBox="40 10 125 148" width="46" height="55" aria-hidden="true" '
    'focusable="false"><g transform="translate(0,18)">'
    '<g transform="translate(60,0) rotate(8 0 130)"><circle cx="0" cy="20" r="10" fill="#FFFFFF"/>'
    '<path d="M 0,32 C -10,32 -16,36 -16,42 C -16,55 -13,68 -11,82 C -10,100 -12,118 -14,130 '
    'L 14,130 C 12,118 10,100 11,82 C 13,68 16,55 16,42 C 16,36 10,32 0,32 Z" fill="#FFFFFF"/></g>'
    '<g transform="translate(100,0)"><circle cx="0" cy="10" r="11" fill="#C2734D"/>'
    '<path d="M 0,22 C -11,22 -17,26 -17,34 C -17,52 -14,70 -12,86 C -11,108 -13,122 -15,132 '
    'L 15,132 C 13,122 11,108 12,86 C 14,70 17,52 17,34 C 17,26 11,22 0,22 Z" fill="#C2734D"/></g>'
    '<g transform="translate(140,0) rotate(-8 0 130)"><circle cx="0" cy="20" r="10" fill="#DCB45C"/>'
    '<path d="M 0,32 C -10,32 -16,36 -16,42 C -16,55 -13,68 -11,82 C -10,100 -12,118 -14,130 '
    'L 14,130 C 12,118 10,100 11,82 C 13,68 16,55 16,42 C 16,36 10,32 0,32 Z" fill="#DCB45C"/></g>'
    '</g></svg>')


def icon(key):
    return ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" '
            'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'
            + ICONS[key] + '</svg>')


def cards_html(target):
    """target is the value for the anchors: _top on the site, _blank inside Canvas."""
    rel = ' rel="noopener"' if target == '_blank' else ''
    lead, rest = '', ''
    for c in CARDS:
        attrs = ''
        if c.get('sec'):
            attrs += ' data-sec="1"'
        if c.get('secpick'):
            attrs += ' data-secpick="1"'
        block = (
            '<a class="card%s" id="card-%s" href="%s" target="%s"%s%s>'
            '<span class="ic">%s</span>'
            '<span class="nm">%s</span>'
            '<span class="sb">%s</span>'
            '<span class="go">%s <span class="arrow" aria-hidden="true">&rarr;</span></span>'
            '</a>'
            % (' primary' if c.get('lead') else '', c['key'], c['href'], target, rel, attrs,
               icon(c['icon']), c['name'], c['sub'], c['go']))
        if c.get('lead'):
            lead = block
        else:
            rest += block
    return lead, rest


CSS = '''
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);
  font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;
  line-height:1.6;-webkit-font-smoothing:antialiased}
:root{
  /* Measured against the page, not declared. Every pair below is at AAA.
     bg #08101F is the same ground as canvas-enter.html. */
  --bg:#08101F;            /* white on this: 19.02:1 */
  --card:#101B31;          /* white on this: 17.17:1 */
  --fg:#FFFFFF;
  --soft:#D6DCE6;          /* on card 12.46:1, on page 13.79:1 */
  --gold:#DCB45C;          /* on card 8.77:1, on page 9.71:1 */
  --gold-solid:#C9A14A;    /* card fill; ink on it 7.86:1 */
  --terra:#C2734D;
  --ink:#08101F;
  --line:#8C90A0;          /* borders, 5.99:1 on page, clears 1.4.11 */
  --r:16px;
}
.skip{position:absolute;left:-9999px;top:0;z-index:99;background:var(--gold);color:var(--ink);
  font-weight:800;padding:14px 20px;border-radius:0 0 10px 0;text-decoration:none}
.skip:focus{left:0}
.wrap{max-width:1000px;margin:0 auto;padding:0 max(18px,4vw)}
a{color:var(--gold)}
:focus-visible{outline:3px solid var(--gold);outline-offset:3px;border-radius:6px}

.head{padding:44px 0 8px;text-align:center}
.head .mark{display:block;margin:0 auto 14px}
.eyebrow{font-size:11.5px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;
  color:var(--gold);margin:0 0 12px}
h1{font-size:clamp(28px,4.6vw,42px);font-weight:800;letter-spacing:-.025em;line-height:1.12;
  margin:0 0 14px}
h1 .a{color:var(--terra)}
.lead{font-size:16.5px;color:var(--soft);margin:0 auto;max-width:56ch}
[hidden]{display:none !important}
.sec{display:inline-block;background:var(--gold-solid);color:var(--ink);font-size:11.5px;
  font-weight:800;letter-spacing:.1em;text-transform:uppercase;border-radius:999px;
  padding:7px 16px;margin:0 0 18px}

.grid{display:grid;gap:16px;margin:32px 0 0}
.two{grid-template-columns:repeat(2,minmax(0,1fr))}
@media (max-width:660px){.two{grid-template-columns:1fr}}

.card{position:relative;display:flex;flex-direction:column;gap:9px;
  background:var(--card);border:1px solid var(--line);border-radius:var(--r);
  padding:24px 22px 20px;min-height:190px;text-decoration:none;color:var(--fg);
  transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease}
.card:hover{transform:translateY(-3px);border-color:var(--gold);
  box-shadow:0 20px 40px -18px rgba(0,0,0,.9)}
.card .ic{display:flex;align-items:center;justify-content:center;width:48px;height:48px;
  border-radius:13px;background:rgba(220,180,92,.16);color:var(--gold);flex:0 0 auto}
.card .ic svg{width:25px;height:25px}
.card .nm{font-size:19px;font-weight:800;letter-spacing:-.015em;line-height:1.25;margin:4px 0 0}
.card .sb{font-size:14.5px;color:var(--soft);flex:1 1 auto}
.card .go{font-size:13px;font-weight:800;color:var(--gold);letter-spacing:.02em;
  display:inline-flex;align-items:center;gap:7px;min-height:24px}
.card .arrow{transition:transform .2s ease}
.card:hover .arrow{transform:translateX(4px)}

/* The first door is the big one. Solid gold, dark ink, spanning the row. */
.card.primary{background:var(--gold-solid);border-color:var(--gold-solid);color:var(--ink);
  min-height:0;padding:28px 26px 24px}
.card.primary:hover{border-color:var(--ink);box-shadow:0 22px 44px -18px rgba(0,0,0,.9)}
.card.primary .ic{background:rgba(8,16,31,.14);color:var(--ink)}
.card.primary .nm{font-size:23px}
.card.primary .sb{color:var(--ink);max-width:52ch}
.card.primary .go{color:var(--ink)}

.foot{padding:34px 0 44px;text-align:center}
.foot p{margin:0 0 6px;font-size:13.5px;color:var(--soft)}
.foot .sig{font-weight:800;color:var(--gold)}
.note{font-size:13.5px;color:var(--soft);margin:26px auto 0;max-width:52ch;text-align:center}

/* Canvas variant. Same cards, less air.

   A Canvas iframe is one fixed height for every device, and this page wants
   1345px on a phone and 818px on a laptop. The height has to be the taller
   one or phones get a scrollbar inside the frame, which leaves a laptop
   looking at 500px of empty navy underneath.

   So the content centres itself in whatever height the frame is given. The
   spare space becomes even padding above and below instead of a gap at the
   bottom, and the page reads as designed rather than as something that
   stopped early. `safe` centring falls back to top-aligned when the content
   is taller than the frame, so nothing is ever pushed off the top. */
body.compact{min-height:100vh;display:grid;align-content:safe center}
body.compact .head{padding:26px 0 4px}
body.compact .mark svg{width:38px;height:45px}
body.compact h1{font-size:clamp(24px,4vw,32px);margin:0 0 10px}
body.compact p.lead{display:none}
body.compact .grid{margin:20px 0 0;gap:12px}
body.compact .card{min-height:0;padding:18px 18px 16px;gap:7px}
body.compact .card .ic{width:40px;height:40px;border-radius:11px}
body.compact .card .ic svg{width:21px;height:21px}
body.compact .card .nm{font-size:17px;margin:2px 0 0}
body.compact .card.primary{padding:20px 20px 18px}
body.compact .card.primary .nm{font-size:20px}
body.compact .card .sb{font-size:14px}
body.compact .foot{padding:22px 0 26px}
body.compact .note{margin:18px auto 0}
@media (min-width:520px){body.compact .two{grid-template-columns:repeat(2,minmax(0,1fr))}}

@media (prefers-reduced-motion:reduce){
  .card,.card .arrow{transition:none}
  .card:hover{transform:none}
}
@media print{
  body{background:#fff;color:#000}
  .card{border:1px solid #000;background:#fff;color:#000;break-inside:avoid}
  .card .sb,.foot p,.lead{color:#000}
}
'''

# The section script. Same contract as fall-2026-syllabus.html and the dock:
# ?sec= wins, then localStorage, and an unrecognised value is treated as none.
SCRIPT = '''
(function () {
  'use strict';
  var SEC = {
    'mw':     { label: 'Class 1, Mon / Wed afternoon, CRN 80650', syllabus: 'syllabus-class1.html' },
    'tr-am':  { label: 'Class 2, Tue / Thu morning, CRN 80654',   syllabus: 'syllabus-class2.html' },
    'tr-eve': { label: 'Class 3, Tue / Thu evening, CRN 80655',   syllabus: 'syllabus-class3.html' }
  };

  var sec = null;
  try {
    var m = location.search.match(/[?&]sec=([^&#]+)/);
    if (m) { sec = decodeURIComponent(m[1]); }
  } catch (e) {}
  /* Inside the Canvas frame this read is third-party storage and Safari
     refuses it, which is why the embed should carry ?sec= in the URL. The
     try/catch is not decoration: without it the whole script stops here and
     no card gets its link. */
  if (!SEC[sec]) {
    try { sec = localStorage.getItem('bio004-section'); } catch (e) { sec = null; }
  }
  if (!SEC[sec]) { sec = null; }

  var q = sec ? ('?sec=' + encodeURIComponent(sec)) : '';

  if (sec) {
    var pill = document.getElementById('sec');
    if (pill) { pill.textContent = SEC[sec].label; pill.hidden = false; }
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-sec]'), function (a) {
    a.href = a.getAttribute('href').split('?')[0] + q;
  });

  /* The syllabus card. With a known section it goes straight to that
     section's syllabus. Without one it goes to the chooser, which is the
     right place to land: three sections have three different exam dates and
     guessing wrong is worse than asking. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-secpick]'), function (a) {
    if (sec) {
      a.href = SEC[sec].syllabus + q;
    }
  });
}());
'''

# Her standing rule for anything that can end up in an iframe.
HEIGHT = '''
(function () {
  var ID = '__ID__';
  function send() {
    try {
      parent.postMessage({ id: ID, frameId: ID, height: Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight) }, '*');
    } catch (e) {}
  }
  window.addEventListener('load', send);
  window.addEventListener('resize', send);
  if (window.ResizeObserver) { new ResizeObserver(send).observe(document.body); }
  send();
}());
'''

PAGE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<meta name="description" content="__DESC__">
__ROBOTS__<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
__COMMENT__
<style>__CSS__</style>
</head>
<body__BODYCLASS__>

<a class="skip" href="#doors">Skip to the course links</a>

<div class="wrap">

<header class="head">
  <span class="mark">__LOGO__</span>
  <p class="eyebrow">BIO 004 &middot; Human Anatomy &middot; Fall 2026</p>
  <p class="sec" id="sec" hidden></p>
  <h1>Welcome to <span class="a">Human Anatomy</span>.</h1>
  <p class="lead">__LEAD__</p>
</header>

<main id="doors">
  <h2 class="vh">Where to go</h2>
  <div class="grid">__LEADCARD__</div>
  <div class="grid two">__RESTCARDS__</div>
  __NOTE__
</main>

<footer class="foot">
  <p>Questions about anything on this page, bring them to class or to office hours.</p>
  <p class="sig">Dr. Sharilyn Rennie</p>
</footer>

</div>

<script>__SCRIPT__</script>
<script>__HEIGHT__</script>
</body>
</html>
'''

# The heading over the card grid is for structure, not decoration: a screen
# reader user gets a landmark and a name for what the five links are.
VH = ('.vh{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;'
      'clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0}')


def page(which):
    canvas = (which == 'canvas')
    target = '_blank' if canvas else '_top'
    lead, rest = cards_html(target)

    if canvas:
        comment = '''<!--
  ============================================================
  BIO 004 Human Anatomy, Fall 2026
  canvas-start.html

  THE CANVAS FRONT DOOR, WITH THE FOUR OTHER DOORS ON IT.

  canvas-enter.html holds one button. This holds five: the course
  home first, then Lab, Lecture, Study, and Syllabus and schedule.
  A student who wants the lab list on a Tuesday night should not
  have to go through the course home to reach it.

  USE
  ---
  One snippet on the Canvas home page, per section:

    <p><iframe src="BASEcanvas-start.html?sec=mw"
      width="100%" height="1610" style="border:0;width:100%"
      title="BIO 004 Human Anatomy course links"></iframe></p>

  sec=  mw | tr-am | tr-eve. BAKE IT IN. Inside the Canvas frame,
        localStorage is third-party storage and Safari blocks it,
        so the URL parameter is the only thing that reliably tells
        this page which section is looking at it. Without it the
        syllabus card goes to the section chooser, which still
        works, it is just one extra click every time.

  EVERY LINK OPENS IN A NEW TAB, on purpose. Same reasoning as
  canvas-enter.html: Canvas strips script from page content so
  nothing embedded can size itself, localStorage inside the frame
  is blocked in Safari, and dialogs get clipped. Opening full
  screen also leaves Canvas where the student left it.

  The height sender at the bottom is there for any Canvas theme
  that listens for it. Canvas core does not, which is why the
  snippet above still carries a hard height.
  ============================================================
-->'''.replace('BASE', BASE)
        title = 'BIO 004 Human Anatomy, course links'
        desc = ('BIO 004 Human Anatomy, Fall 2026. Enter the course, or go straight to lab, '
                'lecture, study or your syllabus.')
        robots = '<meta name="robots" content="noindex">\n'
        leadp = ('Everything for this course lives in one place. Start with the course home, '
                 'or go straight to what you need tonight.')
        note = ('<p class="note">Every link here opens in a new tab, so Canvas stays where '
                'you left it.</p>')
        hid = 'bio004-canvas-start'
    else:
        comment = '''<!--
  ============================================================
  BIO 004 Human Anatomy, Fall 2026
  home.html

  THE SITE FRONT DOOR. Five cards: the course home first, then
  Lab, Lecture, Study, and Syllabus and schedule.

  This is not a second course home. welcome.html is the course
  home and the first card goes there. This page exists so the
  four things students ask for most are one click from the front
  of the site instead of two.

  NOTE ON index.html: at the time this was built, index.html in
  this repo served the Teaching Resources page, which is an
  instructor page, not a student one. That means the plain repo
  URL opened on the wrong thing. If you want this page to be
  what that URL opens, copy it over index.html. Nothing here
  depends on that either way.

  Built by the same script as canvas-start.html, so the five
  links cannot drift apart. See build-bio4-front.py.
  ============================================================
-->'''
        title = 'BIO 004 Human Anatomy, Fall 2026'
        desc = ('BIO 004 Human Anatomy at Solano Community College, Fall 2026. Course home, '
                'lab, lecture, study tools, syllabus and schedule.')
        robots = ''
        leadp = ('Everything for this course lives in one place. Start with the course home, '
                 'or go straight to what you need tonight.')
        note = ''
        hid = 'bio004-home'

    out = (PAGE
           .replace('__BODYCLASS__', ' class="compact"' if canvas else '')
           .replace('__TITLE__', title)
           .replace('__DESC__', desc)
           .replace('__ROBOTS__', robots)
           .replace('__COMMENT__', comment)
           .replace('__CSS__', CSS + VH)
           .replace('__LOGO__', LOGO)
           .replace('__LEAD__', leadp)
           .replace('__LEADCARD__', lead)
           .replace('__RESTCARDS__', rest)
           .replace('__NOTE__', note)
           .replace('__SCRIPT__', SCRIPT)
           .replace('__HEIGHT__', HEIGHT.replace('__ID__', hid)))
    return out


def main():
    if not os.path.isdir(REPO):
        raise SystemExit('cannot find the repo at ' + REPO)
    for which, name in (('home', 'home.html'), ('canvas', 'canvas-start.html')):
        out = page(which)
        if '—' in out or '–' in out:
            raise SystemExit('em or en dash in ' + name)
        # Every internal link has to say where it opens. A card that silently
        # replaces the Canvas frame is the bug this rule exists to prevent.
        for href in re.findall(r'<a class="card[^"]*"[^>]*>', out):
            if 'target=' not in href:
                raise SystemExit('a card link with no target in ' + name)
        path = os.path.join(REPO, name)
        io.open(path, 'w', encoding='utf-8').write(out)
        print('%-22s %6.1f KB   %d cards' % (name, len(out) / 1024.0, len(CARDS)))


if __name__ == '__main__':
    main()
