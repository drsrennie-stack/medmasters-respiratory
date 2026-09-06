# BIO 005 handoff, September 2 2026

Five files plus this note. Everything drops into the repo root. Built against
HEAD ea4b05e, which is unchanged as of tonight.

## What is in the drop

| File | What it is |
|---|---|
| `syllabus-fall2026.html` | The Fall 2026 syllabus, on the BIO 004 document architecture: cover, contents, 16 numbered sections, signed final word. MedMasters tokens, light hero, flat hairline boxes, no em or en dashes anywhere. Two "not posted yet" flags remain: the midterm windows (Sections 07, 09, 14) and nothing else. |
| `competency-packet-fall2026.html` | The regenerated Competency Packet. Three parts at the real seams: Midterm 1, Weeks 1 to 5, 99 competencies. Midterm 2, Weeks 6 to 10, 75. Midterm 3, Weeks 11 to 15, 94. All 268 present exactly once, grouped by week in teaching order, entry expectations retagged by midterm block. Replaces `competency-packet.html` and the PDF. |
| `bio005-competencies-3midterms.csv` | Machine-readable retag: new display number, midterm, week, week title, unchanged id, old number. Everything keyed to `w1-*` ids or old numbering migrates with a lookup, not a rewrite. |
| `physioex-lab-map-fall2026.md` | The lab decision of record. PhysioEx 10.0 assigned weekly, all 12 exercises used, four split across two weeks each. Resolves PLACEHOLDERS Group 1 item 1. Custom builds remaining: Week 5 sensory and reflex home lab, plus three one-page worksheets. |
| `stanford25-video-map-fall2026.md` | Clinical Correlations: 19 Stanford Medicine 25 exams across 8 weeks with observation questions, copyright and caption rules, the answerable-from-text accessibility rule, and the standing exclusion of the pelvic, rectal and breast exams. |

## Decisions of record made September 2

1. **Grade model.** Note sheets 20 (five graded for accuracy, rest for completion),
   three draw-and-teach midterms 50, PhysioEx lab 15, book problems 15.
   Supersedes the Aug 23 BIO005_GRADING weights.
2. **Three midterms, not five unit exams.** Blocks at weeks 5, 10, 15.
3. **Everything due Sunday night.** 0 to 24 hours late is an automatic 50 percent,
   after 24 hours a zero, no exceptions including emergencies. The cushion is
   the weeks-ahead posting, in front of the deadline rather than behind it.
4. **Labs run on PhysioEx**, purchased through Access Pearson in Canvas with the
   Silverthorn 9e eText included. Lab skills are verified on the midterm
   teach-backs, not in the auto-graded lab category.
5. **Workload framing.** 14 hours a week is stated as the Carnegie floor.
   The syllabus tells students to plan 16 to 20, and 20 to 30 for the A or B
   that health programs require, more if anatomy is missing or concurrent.
6. **Office hours** Wednesdays 9:00 to 10:00 am on Zoom.
7. **Clinical Correlation** is the official name of the bedside-video element.
8. **Excluded by decision:** pelvic, rectal and breast exams, never assigned
   or linked.
9. **No Scholar Points in BIO 005.** The syllabus carries no Scholar Points
   section and the no-extra-credit policy has no carve-out. Scholar Points
   remain a BIO 004 feature only.

## The ripple list, nothing here blocks Monday

- `competency-packet.html` and `BIO005-Fall2026-Competency-Packet.pdf` come
  down when the new packet goes up.
- The Mastery OS and `unit-0*.html` pages still group by the five modules.
  Cards and ids are untouched, so this is presentation only. Migrate with the
  CSV lookup when there is time.
- `bio005-schedule-fall2026.js` still carries `BIO005_GRADING` from Aug 23 and
  the pre-LANGUAGE week title for Week 9. Regenerate.
- `silverthorn-chapter-map.md` weeks 3 to 8 do not match the schedule of
  record. Redistribute the chapter halves before those week pages are built.
- `start-here.html` says 14 hours a week and defaults its slider to 14.
  Move it to the floor-versus-realistic framing so it stops arguing with the
  syllabus.
- `tools/language-audit.py` currently flags `course-schedule.html` for
  "Asynchronous online". One string.
- `bio005-credit-model.js` still describes Scholar Points as sitting on top
  of the suggested weights. Strip them when the credit model is regenerated
  to the adopted 20/50/15/15.

## Compliance notes, for the two student-facing pages

Audited September 2, in-session, results below. Late in the session the
tokens were realigned to the live medmasterscollaborative.com values pulled
from the medmasters-site repo: navy #0B1530 (the course card CSS had deepened
this to #040711; the site itself never did, and these two documents now follow
the site, worth standardizing one way across the repo), gold #C9A14A, cream
#F5F1E8 as the dark-band text tone, Plus Jakarta Sans as the only family.
Following the precedent in medmasters-cards.css, one derived value was
adjusted to hold the floor: muted text is rgba(11,21,48,.75), the lightest
alpha on the #0B1530 base that clears 7:1. Full pair table recomputed on the
new tokens: worst ratio anywhere 7.33:1, every pair AAA. Repeat with `hard-audit.js`
against the live pages after upload, same as everything else, and log it.

**axe-core 4.13.0, WCAG 2.0/2.1 A and AA rule set: 0 violations on both
pages.** Run under jsdom, which cannot execute the visual rules, so color
contrast was verified separately by computation (below) and the two
"incomplete" items it reports (landmark-one-main, page-has-heading-one) are
jsdom layout limitations, both satisfied in the markup: one main landmark, one
h1 per page.

**Contrast, computed from the tokens, every pair in both documents.** Lowest
ratio anywhere: 7.33:1 (terra on offwhite). Every pair clears the 7:1 AAA
floor this course holds, not just AA. Highlights: body navy on white 20.12:1,
muted navy-70 on offwhite 7.71:1, terra eyebrows 7.66:1, links 10.26:1, every
grade-bar segment 7.66:1 or better, gold segment carries navy text at
10.28:1, table headers 17.18:1, exam and not-posted-yet rows 17.54:1.

**Hardening applied during the audit:** the syllabus cover is a header
landmark, so all content sits in landmarks; the 34 key cells in the data
tables are true row headers (th scope="row"); lists styled with
list-style:none carry role="list" so VoiceOver keeps announcing them as
lists; the grade bar is a single labeled image so its segments never rely on
color alone; forced-colors rules give every box a real border; focus is the
navy outline with the gold ring on every interactive element; both pages have
a skip link, print cleanly with no ink blocks, and reflow at narrow widths.

**Tagged PDFs, generated September 2.** `syllabus-fall2026.pdf` (18 pages) and
`competency-packet-fall2026.pdf` (34 pages), rendered from the audited HTML
with WeasyPrint as PDF/UA-1. Verified with pikepdf: Marked true,
StructTreeRoot present, document language en, DisplayDocTitle on, real
document titles, and full semantic tag trees (the syllabus carries 1,274
structure elements including H1/H2/H3 heading levels, 7 tables with TH cells,
15 lists, and tagged links; the packet carries 4,116). Both use the brand
fonts embedded, the BIO 004 running footer (course line left, college and
Page N of N right, none on the cover), and a live contents page whose entries
carry real page numbers. The HTML pages remain the online version; the PDFs
are the print and download version, one source for both.


## The welcome experience, ported September 2

`welcome.html` is the BIO 004 welcome, ported whole to BIO 005: the
multilingual greeting that lands on Welcome, the rising three-figure mark, the
guided tour, the progress checkmarks, the returning-student screen with the
week gate, and Hootie. Per the anatomy repo's course-design-system.md, which
is hereby adopted as the BIO 005 design authority.

What changed inside: one section (Sutter Internet, no picker), the eight tour
cards are now Course tools, Syllabus, Competency Packet, Mastery OS, This
week's videos, Course schedule, Labs in PhysioEx, and Anatomy refresher. The
week gate runs three Parts on the Sep 8 calendar with Midterms at weeks 5, 10
and 15. Hootie's whole answer engine was rewritten: grading now answers
20/50/15/15, exams answer draw-and-teach, TBL became note sheets, contacts are
Yuba (srennie@yccd.edu, DSPS, tutoring), and his intent keywords match the new
course. Zero anatomy-course residue remains, verified by scrub.

Tour link targets, all verified against the repo root or this drop:
home.html, mastery-physio-os-standalone.html, concept-videos-week01.html,
course-schedule.html, anatomy-review.html exist in the repo;
syllabus-fall2026.html and competency-packet-fall2026.html ship in this
bundle. The page needs a live browser for its animation and tour; the intro
was visually verified in a static render.

Experience chain as it now stands: Canvas card, canvas-home.html,
welcome.html (this port), home.html dashboard, with the dock on every page.
Next fixes in the walk: bring canvas-home and home.html up to the
design-system doc, and align start-here.html's hours framing.

## Wired and organized for cognitive load, September 2, late

Weeks 2 to 15 regenerated. Every already-built asset is now hooked into its
week: the osmosis and IV fluids lab (Week 3), the membranes and membrane
potential workbooks (Weeks 3 and 4, mapped by content, their filenames carry
the old week numbers), the CBC and PCR lab (Week 11), the pulmonary function
lab (Week 13), and the patient case file (Week 15). Six dead wires in
existing pages fixed (three in the Mastery OS, three in index.html), and
start-here now tells the same hours story as the syllabus.

The load design: every week page carries its orientation in the eyebrow
(Part, week N of 15), and knows its own open date. Before a week opens, a
student who clicks ahead sees one calm line, this week opens on its Monday
and nothing is due, with zero warning chips. After it opens, the chips appear
only where content is genuinely still pending. The five steps read as bare
rust numerals on hairline rows, one action per row, one link per action.

Final crawl: 31 pages, zero dead wires. The wiring map (wiring-map.html) is
the review surface; the gold content flags on it are the build list, which is
note sheets, weekly videos and problem numbers, the Week 5 home lab, the
hormone cycle worksheet, and the ECG strip packet.

## Week 1 split for cognitive load, September 5

week-01.html is now the one to do page: the same five step hub as every other
week, the Week 1 dates (everything due Sunday September 13 at 10:00 pm, the
introduce yourself post by Friday the 11th), and nothing else. The 232KB
notes page moved whole to week-01-notes.html, reachable from step 2, with the
dock removed so it is only the notes and their own contents list. Every week
hub footer trimmed to three links: Course home, Schedule, Syllabus. The
Mastery OS link lives inline in the Practice step where it is used. Note: the
version of week-01 with the at a glance card grid in the screenshot is local
and not in the repo; this split was rebuilt from the repo page plus the dates
visible in the screenshot. Crawl after the split: zero dead links.

## Standing deadline rule, September 5

Course-wide time of day is 10:00 pm. Everything is due Sunday at 10:00 pm.
Discussions run ahead: the initial post is due Friday at 10:00 pm, peer
replies Sunday at 10:00 pm. Week 15 closes Wednesday, December 16 at 10:00
pm with the term. Applied to the syllabus (sections 01, 05, 12, PDF
regenerated and re-verified tagged), all fifteen week hubs, and the welcome
page including Hootie.

## Adopted from the September 5 repo update

The updated course model, taken from BIO005-Fall2026-Syllabus-and-Schedule.pdf
and competencies-by-week.html, supersedes the September 2 decisions where they
differ. Grade model is now five components: note sheets 20, three midterms 40,
lab 15, book problems 15, discussions 10. Discussions are one weekly post
carrying both the physiology and the student's own thinking, initial post
Friday 10:00 pm, replies Sunday 10:00 pm. Midterm windows are set: Midterm 1,
Mon Oct 12 8:00 am to Sun Oct 18 10:00 pm. Midterm 2, Mon Nov 16 8:00 am to
Sun Nov 22 10:00 pm, closing the day after the W deadline. Midterm 3, Mon Dec
14 8:00 am to Wed Dec 16 10:00 pm, with the term.

Applied: the syllabus HTML and tagged PDF (five-segment grade bar, discussions
subsection in her wording, windows in sections 07, 09 and 14, both remaining
not-posted-yet flags cleared, rhythm table now six steps), and all fifteen
week hubs (Discuss inserted as step 3, real windows in the Part-closing
banners on weeks 5, 10 and 15, window-open banners on weeks 6 and 11).
welcome.html and home.html were removed from this bundle: the repo versions
are current, welcome already carries the 40 percent model, and this drop must
not roll them back. Zero not-posted-yet flags remain anywhere in the syllabus;
the course has no unset dates left.

## Lab credit rule, September 5

Running PhysioEx is not the credit. The graded work each week is the
completed worksheet and data record, plus the clinical correlation questions
in weeks that carry them. Stated in the syllabus laboratory section (HTML and
tagged PDF), in the Lab step of all fifteen week hubs (mentioning the
clinical correlations only on weeks that have them), and in the lab map.
One line for Hootie's labs answer in welcome.html, which lives ahead in the
repo and is not in this bundle: Running the simulation is not the credit,
your worksheet and the clinical correlation questions are.

## 250 questions, answered, September 5

course-questions.html is the student-facing page: every question filtered
live by a search box, grouped in 14 sections, each answer written from the
decided course facts with working links. bio005-faq.js is the same 250 in
machine-readable form, the feed for Hootie or any future helper, so his brain
and the page never drift apart. Standing expectation: whenever a course rule
changes, both files get updated in the same pass as the syllabus.

Suggested wiring, one link each: from the home page footer (Questions?
Start here) and from Hootie's fallback answer. The page carries no dock and
does one job.

Categories: getting started, navigating, grading, note sheets, discussions,
midterms, labs and PhysioEx, deadlines, time and workload, studying, tech and
submitting, help and support, enrollment and transfer, and succeeding online
anywhere, which is the general online-course survival guidance. Zero dash
violations, zero dead internal links, four external links, all live services.

## Success advice folded in, September 5, from her success program repo

Six thin questions retired, six added from her program, terminology stripped
as directed: the error log method (log every miss, retry cold a week later,
retire a row only when the whole type is solid), the exam wrapper (classify
every lost point by error type, each type has a different fix), spacing
versus cramming at equal hours, the active versus passive honesty scale,
why effective studying feels strange at first, and plans as hypotheses with
a weekly assess, work, revise cycle. Four existing answers enriched with the
same material. Still exactly 250, zero dashes, zero program terminology,
zero dead links. Her standalone error log tool exists in that repo and could
be ported into this course later if she wants it as a page.

## Hootie eats the 250, September 5

welcome.html now loads bio005-faq.js and routes unmatched questions through
it: hand-tuned intent answers first, then a scored search of all 250
questions and answers, then the fallback, which now also links the questions
page. Matcher tested against natural student phrasings, question-word hits
weighted over answer-word hits, minimum score gate so nonsense still gets
the graceful fallback. The two files to keep in lockstep on any course
change: bio005-faq.js and course-questions.html, same data, two doors.
Deploy note: welcome.html and bio005-faq.js travel together.

## Week 2 built, September 5, late

week-02-notesheet-prompts.html: seven competencies from the sheet data of
record (assets/bio005-sheet-data.js), two prompts each in her Week 1 format,
cloned whole from week-01-notesheet-prompts.html: same progress ticks, same
two pass color doctrine, same rubric, storage key bio005-w2. The enzyme
assay prompt points at the amylase lab data. enzyme-amylase-lab.html: the
Week 2 lab sheet, predictions, PhysioEx data tables, the pancreatitis
serum amylase and lipase correlation, look back. Both wired into
week-02.html, whose prepare chip is cleared.

FLAG, needs her decision: competencies-by-week.html re-titles weeks 4 to 8
and 13 to 15 (nervous system split across 4 to 6, muscle at 7, hormones and
reproduction merged at 8, pH levers renamed at 13 and 15). The generated
week hubs 4 to 8, 13 and 15 carry the older titles and lab mapping and need
reconciling to the new map before those weeks open. Weeks 1 to 3 agree.

## The Canvas assignment kit, September 5, late

canvas-kit.html, instructor tool: pick any week 1 to 15, get every embed
snippet for that week with a copy button, in her exact iframe convention and
Pages base URL, wired to her own parameterized assignment pages
(assignment-notesheet, discussion, bookproblems, physioex, ai-work-log, all
?week=N), plus the week hub and the built extras (Week 1 prompts and lab
case; Week 2 prompts and enzyme lab). Header section: the five weighted
Canvas assignment groups (20/40/15/15/10), naming convention, 10:00 pm
times, Pearson note. Static section: course home card, welcome, syllabus,
schedule, and the questions page. Discussion prompts written for Weeks 2 to
4 in her physiology-plus-honest-thinking formula, Week 1 pointing at her
vision board page. Simulated for Week 2: all eight snippets correct.

## assignment-notesheet.html rebuilt lean, September 6

Her page hardcoded Week 1 links regardless of ?week and ran 1,249 words. The
rebuild is 157 words and fully week-driven: three instructions in the color
method, two buttons (Print your sheet, straight to that week's PDF in
sheets/, which exists for all fifteen weeks; Open the competencies, to
week-NN-notesheet-prompts.html, live for Weeks 1 and 2, the naming contract
for the rest), the due date computed per week including the Wednesday close
for Week 15, and the three-step upload box. Height sender included so the
Canvas iframe sizes itself. The prompts pages must ship for each future week
before its assignment goes live; the kit and wiring map both track that.

## Week 1 lab and the week-aware lab assignment page, September 6

fluid-homeostasis-lab.html: Week 1's lab in the clinical five-part format,
wrapping her existing homeostasis case (part 2 links the workbook) with
predictions, the failed thirst loop and mass balance ledger, the
hypernatremia panel correlation (serum sodium 156, osmolality 322, the
elderly blunted-thirst patient), and the look back. No Pearson in Week 1,
stated plainly.

assignment-physioex.html rebuilt lean and week-aware: weeks 1, 5 and 8
render their no-Pearson labs with the right link and never mention
completing PhysioEx; Pearson weeks render the PhysioEx-first order, the
two-part credit rule, and the built worksheet button where one exists
(weeks 2, 3, 11, 13, 15). Week 1 hub Lab step now opens the fluid balance
lab; the kit's Week 1 extras carry it; the lab map records it.

## course-materials.html Week 1 lab step, September 6

Her live Course Tools page's lab step assumed PhysioEx in Week 1, linked raw
pearson.com against the buy-one-way rule, and pointed its clinical
correlations button at Week 3's osmosis lab. Rewritten for Week 1: label
says no PhysioEx this week, the step is the standards and ranges lab (where
reference ranges come from), with the fluid balance case second, the lab
grading page, and the manual. The generic PhysioEx text belongs to Pearson
weeks; when she makes this page week-switched, weeks 2 and up get the
PhysioEx version back with Access Pearson in Canvas as the path, never
pearson.com. Note: the step's old text said lab is ungraded for points,
which contradicts Lab 15 percent in the syllabus; the rewrite stays silent
on points and defers to the grading page, but she should reconcile that
sentence wherever else it appears.

## Week 1 competencies 15 to 20 removed, September 6

The six chemistry items (water, pH and buffers, protein structure, enzyme
activity, ATP coupling, enzyme assay) are out of week-01-notesheet-prompts:
the page now carries fourteen competencies with every count updated, and
those six live where they belong, in week-02-notesheet-prompts. The
printable week-01-competencies page needed no change; it already excludes
chemistry by design and says so in its own header. The sheet data file was
left untouched.

FLAG, needs one decision: the week 1 count now differs across sources. The
prompts sheet says 14. assets/bio005-sheet-data.js and the printable
competencies page carry 18, the extra four being the chapter 6 signaling
item, receptor modulation, plus the three skills items, experimental
design, measurement error, and graphing. The static PDF in sheets/ predates
all of this. Say which set is the canonical Week 1 and everything, data,
printable, hub count, PDF, gets aligned to it in one pass.

## One source for the note sheet, September 6

The prompts pages (weeks 1 and 2) now open with Your sheet, two ways: print
the built sheet, which prints boxes only because note-sheet.html's print
styles already strip every direction panel, or rule your own, no printer
needed, with the labeling requirements anchored on the same page. The rules
are stated on the cards: printed and hand drawn only, no typing on it and no
stylus on the PDF; ruled sheets must carry the full box labeling. The
assignment page's Print your sheet button now opens note-sheet.html?week=N,
the single live source, instead of the static PDFs in sheets/, which can go
stale. Course Tools step 01 dropped its third button; the prompts page is
the competency source. week-01-competencies.html still exists for anyone
holding an old link but nothing routes to it.

## Book problems page rebuilt, September 6

assignment-bookproblems.html is now lean and week-aware, matching the note
sheet and lab pages. Week 1 assigns Silverthorn Chapter 1, questions 1 to
19, by number only; the questions themselves are Pearson's and stay in the
eText, never on the public site. The AI work log is embedded in the same
page per week (ai-work-log.html?week=N, with a height listener so it sizes
itself), with an open-in-tab link. The turn in rule is two part: hand
worked answers plus the completed AI worksheet, one PDF, answers first,
submitted on the assignment in Canvas. Weeks without decided numbers tell
students the list is on the Canvas assignment itself, which is where she
can type numbers per week without touching the page. Chapter 6 numbers for
Week 1, if any, still needed from her.

## The assignment page standard, September 6

Locked in for every assignment: the Canvas page carries directions and the
assigned work only, plus one link or button to the HTML that produces the
printable PDF. Nothing interactive gets embedded for on screen work; the
AI worksheet embed was already replaced with an open to print link. Own
paper is always allowed and now says so on every assignment page, with the
labeling requirement: name, week, question or part number, and a few words
on what the question asked, above each answer. The kit gained link type
snippets for worksheet pages (anchor opening a new tab, never an iframe)
and the Week 2 learning lab, Reading a Physiology Figure or Graph, is
wired that way as the first example.
