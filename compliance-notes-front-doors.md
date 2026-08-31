# Accessibility compliance notes, BIO 004 front doors

## 1. What this covers

| | |
|---|---|
| Project | BIO 004 Human Anatomy, Fall 2026, Solano Community College |
| Files | `home.html`, `canvas-start.html` |
| Built by | `build-bio4-front.py`, one source for both pages |
| Date | August 31, 2026 |
| Standard | WCAG 2.2, Level AA required, Level AAA targeted |
| Reviewer | Dr. Sharilyn Rennie |

These are the two front doors. `home.html` is the site front door.
`canvas-start.html` is the same five cards, sized for the Canvas iframe. Both
come out of one script, so the five links cannot drift apart.

**This record is generated, not written.** Every number comes from
`a11y-report.js` driving Chromium against these exact files. If a colour
changes and a ratio drops, the next run says so without anyone remembering to
look.

---

## 2. Result

| File | axe violations | axe checks passed | Colour pairs | Lowest ratio | Interactive targets | Under 44px |
|---|---|---|---|---|---|---|
| `home.html` | 0 | 26 | 13 | 5.30:1 | 5 | 0 |
| `canvas-start.html` | 0 | 26 | 12 | 5.30:1 | 5 | 0 |

axe-core ran at the full tag set: `wcag2a`, `wcag2aa`, `wcag2aaa`, `wcag21a`,
`wcag21aa`, `wcag22aa` and `best-practice`. Not the legal floor, the whole
thing.

---

## 3. Colour contrast, measured on the rendered page

Ratios come from what the browser painted, with transparency composited down
the ancestor stack. Declared values are not trusted: a colour at 16 percent
opacity over a card over a page is not the colour anyone wrote down.

| Foreground | Background | Size / weight | Ratio | Size class | Level |
|---|---|---|---|---|---|
| `#C2734D` | `#08101F` | 42px / 800 | **5.30:1** | large | AAA |
| `#08101F` | `#C9A14A` | 23px / 800 | **7.86:1** | large | AAA |
| `#08101F` | `#C9A14A` | 14.5px / 400 | **7.86:1** | normal | AAA |
| `#DCB45C` | `#101B31` | 13px / 800 | **8.77:1** | normal | AAA |
| `#08101F` | `#DCB45C` | 16px / 800 | **9.71:1** | normal | AAA |
| `#DCB45C` | `#08101F` | 11.5px / 800 | **9.71:1** | normal | AAA |
| `#D6DCE6` | `#101B31` | 14.5px / 400 | **12.46:1** | normal | AAA |
| `#D6DCE6` | `#08101F` | 16.5px / 400 | **13.80:1** | normal | AAA |
| `#FFFFFF` | `#101B31` | 19px / 800 | **17.17:1** | large | AAA |
| `#FFFFFF` | `#101B31` | 17px / 800 | **17.17:1** | normal | AAA |
| `#FFFFFF` | `#08101F` | 42px / 800 | **19.02:1** | large | AAA |

### The one to watch

`#C2734D` on `#08101F` is the terracotta in the words "Human Anatomy" in the
headline, and it measures **5.30:1**. That clears AAA, because the text is
42px at weight 800 and the AAA threshold for large text is 4.5:1. It does not
clear AAA at body size, which needs 7:1.

So that pairing is right where it is used and nowhere else. It is the
established BIO 004 accent and it was not changed to chase a number. If it is
ever moved onto normal-size text it fails, and this note exists so that
decision gets made on purpose rather than by copy and paste.

Everything else on both pages clears AAA for its own size class, most of it by
a wide margin. White on the page ground is 19.02:1.

### Non-text contrast, 1.4.11

- Card borders, `#8C90A0` on `#08101F`: **5.99:1**, against a 3:1 requirement.
- Focus ring, `#DCB45C` on `#08101F`: **9.71:1**, 3px solid, 3px offset.

---

## 4. Colour is never the only signal, 1.4.1

The first card is gold and the other four are dark, but the difference is
stated in words too: it is the only card that says "Enter the course" and "Go
to the course home". Nothing here is distinguished by colour alone.

---

## 5. Target size

**Every interactive element on both pages is at least 44 by 44 CSS pixels.**

The whole card is the target, not just the link text at the bottom, so the
smallest tap area is a full card. That clears 2.5.8 Target Size Minimum at AA
(24px) and 2.5.5 Target Size Enhanced at AAA (44px) with room to spare.

This measurement caught a real bug. On an earlier build the target count came
back as four on the Canvas page and five on the site page. The Canvas rule
that hides the intro paragraph, `.lead`, was also hiding the "Enter the
course" card, because the card modifier used the same class name. The card was
rendering at 0 by 0. The modifier is now `.primary` and the two cannot collide
again.

---

## 6. Keyboard

- Tab 1 lands on the skip link, off screen until focused, then gold on navy.
- Tabs 2 to 6 move through the five cards in the order they are read.
- No positive `tabindex` anywhere, so tab order is document order.
- Nothing is removed from the tab order.
- The focus indicator was verified by comparing pixels before and after focus,
  not by reading the CSS: 3px solid `#DCB45C` at 3px offset, on every card.
- No keyboard trap. Nothing on either page takes focus and holds it: no
  dialogs, no menus, no carousel.

---

## 7. Screen reader

Chromium's accessibility tree was dumped for both pages. That is the tree a
reader is handed, so what is recorded is what gets announced.

- **Landmarks**: one `banner`, one `main`, one `contentinfo` per page.
- **Headings**: one `h1`, correct order, and the card grid carries a
  visually hidden `h2`, "Where to go", so the five links are announced as a
  named group rather than as five loose links.
- **Accessible names**: every card announces its name, its description and
  where it goes. Zero controls without a name.
- **Decoration is hidden**: the logo and all five icons carry
  `aria-hidden="true"` and `focusable="false"`, so a card is announced once
  rather than once for the icon and again for the text.
- **The arrow** after each link label is `aria-hidden`. "Right arrow" read
  aloud after "Open the lab sprints" is noise.

**A human pass with a real screen reader has not been run.** The tree is
strong evidence and catches most defects, but it is not the same as listening.
About fifteen minutes with NVDA and Firefox, or VoiceOver and Safari: tab the
five cards and confirm each announces its name, its description and its
destination. That is the whole script.

---

## 8. Reflow, zoom and text spacing

| Test | Requirement | Result |
|---|---|---|
| 1.4.10 Reflow | No horizontal scrolling at 320px | Passes, both pages |
| Zoom | No horizontal scrolling at 400 percent | Passes, both pages |
| 1.4.12 Text Spacing | No clipping or overlap with the spacing bump applied | Passes, nothing clipped |

The four secondary cards go from two columns to one at 660px. The Canvas
variant switches at 520px, because inside an embed the frame is often
narrower than the device it is on.

---

## 9. Motion

`prefers-reduced-motion: reduce` removes the card lift, the shadow change and
the arrow slide. Nothing moves on its own, so there is no 2.2.2 Pause, Stop,
Hide obligation to meet.

---

## 10. The Canvas frame, and the one thing it cannot do

Both pages carry the height sender before the closing body tag, per the house
rule. Canvas core does not listen for it, so the embed snippet still needs a
fixed height.

That height is **1610px, measured rather than guessed**. `node
canvas-height.js` loads the page at eleven widths and reports the tallest:
1605px at 320px wide, down to 1014px on a laptop. 1610 means no width from
320px up gets a scrollbar inside the frame.

The cost is about 600px of spare height on a laptop. The page centres its
content in whatever height it is given, using `safe` centring, so that spare
height reads as even padding above and below rather than a gap at the bottom,
and a device narrower than expected is top-aligned rather than pushed off the
top of the frame.

`height="1080"` is the alternative: it fits every width from 560px up, with no
laptop padding, and phones scroll a little inside the frame. Both are
defensible. The tall one shipped because a nested scrollbar on a phone is easy
to miss and can hide the last two cards.

**Every link on `canvas-start.html` opens in a new tab**, `target="_blank"`
with `rel="noopener"`, rather than the usual `target="_top"`. That is the
decision already documented in `canvas-enter.html`, and it holds for reasons
that cannot be fixed from inside the frame: Canvas strips script from page
content, `localStorage` inside the frame is third-party storage and Safari
blocks it, and dialogs get clipped. Opening full screen also leaves Canvas
where the student left it. `home.html`, which is not framed, uses
`target="_top"`.

The audit was taught this distinction rather than being worked around. It used
to require `target="_top"` on every internal link. It now accepts either
`_top` or `_blank` with `noopener`, because both leave the frame, and flags a
link with neither, which is the actual defect: a page that loads inside a
560px embed and traps the student there.

---

## 11. Sections and privacy

Three sections with three different sets of exam dates, so the syllabus card
has to know which one is looking at it. It reads `?sec=` from the URL first,
then the saved choice in `localStorage`. Inside the Canvas frame that storage
read is third-party and Safari refuses it, which is why the embed snippet
carries `?sec=` and why the read is wrapped in try/catch: without the catch,
the script would stop there and no card would get its link.

With no section known, the syllabus card goes to the section chooser. That is
the right place to land. Three sections have three different exam dates and
guessing wrong is worse than asking.

**Nothing on either page stores or transmits anything about a student.** The
section is a course section, not a person. No name, no ID, no analytics, no
network request beyond the font stylesheet.

---

## 12. Known limitations

1. **No human screen reader pass yet.** Section 7 has the script. This is the
   only thing genuinely outstanding.
2. **`#C2734D` is AAA only at headline size.** Section 3 explains. Fine where
   it is, must not be reused on body text.
3. **The Canvas height is fixed at 1610px.** A device narrower than 320px
   would scroll inside the frame. Nothing is cut off, it just scrolls.
4. **These two pages only.** The rest of the repo has its own accessibility
   history and is not covered here. `node a11y-report.js <file>` audits any of
   it.

---

Dr. Sharilyn Rennie
