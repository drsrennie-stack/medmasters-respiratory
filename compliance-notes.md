# Compliance Notes: ABG Interpretation Trainer

## 1. Project, files, date

- **Project:** ABG Interpretation Trainer (MedMasters Collaborative, AI product portfolio)
- **Files covered:** `abg-interpretation-trainer.html`
- **Date:** September 28, 2026
- **Brand:** MedMasters Collaborative tokens from the live course site (navy #08101F, maroon #7A2A22, maroon-dark #5E201A, gold #DCB45C, straw #E8CE85, off-white text #F4EFE8 on navy only, page #FAFAF9, white cards). Plus Jakarta Sans throughout. Three-figure logo mark.

## 2. WCAG version and level achieved

Target: WCAG 2.2 AA minimum, AAA where achievable. Result: **AA met throughout, and AAA text contrast (1.4.6) met on every screen.** axe-core found 0 AA violations and 0 AAA contrast violations across 9 screen states.

| Criterion | Level | Status | How it is met |
|---|---|---|---|
| 1.1.1 Non-text content | A | Pass | Logo figures, capnogram trace, aurora glow, and progress dots are decorative and `aria-hidden`. Progress is also given in text. |
| 1.3.1 Info and relationships | A | Pass | One h1 per screen (intro, level menu, trainer). Steps use `fieldset` and `legend` with an h2 inside. The ABG values are a `<dl>`. The normal ranges are a `<table>` with `scope`. |
| 1.3.1 Tic-tac-toe grid | A | Pass | The grid is a real `<table>` with a hidden caption, column headers, and row headers. Each filled cell includes hidden text ("placed here" or "your current pick"), so screen reader users get the same information as the color and dashed-border styling. Filled cells are white text on navy (19:1), and tentative picks are navy text on navy-tint (16.5:1). |
| 1.4.1 Use of color | A | Pass | Every state has text: "Correct.", "Not yet.", "Correct answer", "Your answer", "Completed", "Recommended". Help and wrong states also use a dashed border. |
| 1.4.3 / 1.4.6 Contrast | AA / AAA | Pass | Every text pair is 7:1 or higher (section 3). |
| 1.4.10 Reflow | AA | Pass | No horizontal scroll at 320 px or 390 px on the intro, menu, or trainer. |
| 1.4.11 Non-text contrast | AA | Pass | Option borders are #767C8C (4.2:1 on white). The focus ring is maroon on light (9.6:1) and gold on navy (9.7:1). |
| 2.1.1 Keyboard | A | Pass | Native buttons and radios everywhere. The Normal ranges panel is a native `<dialog>`, so Esc closes it and focus returns to the button that opened it. |
| 2.2.2 Pause, stop, hide | A | Pass | The intro typing runs about 7 seconds and has a "Skip intro" button. The looping glow and trace have a "Pause motion" button on the intro and the menu. |
| 2.3.3 Animation from interactions | AAA | Pass | With `prefers-reduced-motion`, all motion is off: the intro shows its final state immediately, and cards and steps appear without movement. |
| 2.4.1 Bypass blocks | A | Pass | There is a skip link. |
| 2.4.3 Focus order | A | Pass | Focus moves to the menu heading, then to each new step's heading. After Check, it moves to Next step. It moves to the review result when the review opens. |
| 2.4.7 Focus visible | AA | Pass | There is a 3 px outline on every control, including the styled radio options and level cards. |
| 2.5.8 Target size | AA | Pass | All targets are 40 px or larger. Most are 48 to 54 px. |
| 3.3.1 Error identification | A | Pass | Blank answers are named in text, and focus moves to the first blank. |
| 4.1.2 Name, role, value | A | Pass | The hint button uses `aria-expanded` and `aria-controls`. The locked review button uses `aria-disabled` with a text note. Pause motion uses `aria-pressed`. |
| 4.1.3 Status messages | AA | Pass | Step feedback has `role="status"`. A polite live region reads each new case's values and announces level completion. |

## 3. Color contrast audit

| Foreground | Background | Ratio | AA | AAA |
|---|---|---|---|---|
| Navy #08101F (body text, values on light) | White | 19.02:1 | Pass | Pass |
| Navy #08101F | Page #FAFAF9 | 18.21:1 | Pass | Pass |
| Navy #08101F | Navy-tint #ECEFF4 (correct and completed states) | 16.50:1 | Pass | Pass |
| Maroon #7A2A22 (eyebrows, step count, "Not yet", tip label) | White | 9.63:1 | Pass | Pass |
| Maroon #7A2A22 | Navy-tint #ECEFF4 | 8.35:1 | Pass | Pass |
| White (primary buttons, revealed answer) | Maroon #7A2A22 | 9.63:1 | Pass | Pass |
| White (button hover) | Maroon-dark #5E201A | 12.37:1 | Pass | Pass |
| Ink-muted #4A5468 (secondary text) | White | 7.61:1 | Pass | Pass |
| Gold #DCB45C (labels, streak, headings on navy) | Navy #08101F | 9.71:1 | Pass | Pass |
| Gold #DCB45C | Raised navy #121B30 (value tiles) | 8.75:1 | Pass | Pass |
| Navy #08101F (gold buttons, selected mode) | Gold #DCB45C | 9.71:1 | Pass | Pass |
| Straw #E8CE85 (level-up line) | Navy | 12.31:1 | Pass | Pass |
| Off-white #F4EFE8 (text on navy) | Navy | 16.63:1 | Pass | Pass |
| Mist #B9BFCC (secondary text on navy) | Navy | 10.31:1 | Pass | Pass |
| Control border #767C8C (non-text) | White | 4.17:1 | Pass (3:1) | n/a |

Gold never carries text or borders on a light surface.

## 4. Keyboard navigation (verified in Chromium with Playwright)

**Intro:** skip link, Pause motion, Skip intro, then Choose where to start and Continue.

**Level menu:** mode radio group (arrow keys switch between Guided and On my own), then six level cards, Reset my progress, and Pause motion. Reset needs a second press to confirm, so a single keypress can't erase progress.

**Trainer:** Levels, Normal ranges (opens a dialog that traps focus and closes with Esc), New case, then the step's radio group, Check, Show a hint, and Next step. Nothing traps focus.

## 5. Screen reader testing

- **Automated:** axe-core with the WCAG 2.0, 2.1, and 2.2 A/AA rules plus best practices, and the AAA enhanced-contrast rule. It ran on 9 screen states: intro, menu, guided step, guided wrong answer, guided review, clean review with level-up, reference dialog, On my own at Level 5, and On my own review. Result: 0 violations.
- **Typed intro:** the animated text is `aria-hidden`. Screen readers get the real h1 and description, so they never hear it one letter at a time.
- **Not yet done:** a hands-on pass with VoiceOver and NVDA. This is recommended before the portfolio launch, focusing on the case announcement, the step-to-step focus moves, and how HCO<sub>3</sub><sup>−</sup> is read aloud.

## 6. Known limitations and remediation plan

1. **Hands-on screen reader testing is still needed** (section 5).
2. **Progress lives in the student's own browser** (`localStorage`: level, streak, and counts only, no names or identifiers). It does not follow a student to another device. If storage is blocked, the trainer still works for that visit.
3. **Every level is open from the menu,** so students can pick where to start. Completing a level is tracked and the next one is marked "Recommended," but nothing is locked.
4. **Fonts load from Google Fonts** because this is a single-file portfolio build. For the course repos, point it at the self-hosted font file.

## 7. Accuracy verification

- The case bank covers every whole-number PaCO<sub>2</sub> (18 to 80) and HCO<sub>3</sub><sup>−</sup> (8 to 45) pair, with pH from Henderson-Hasselbalch. That gives 941 valid cases across 15 case types.
- An independent second grader re-graded every case. There were 0 disagreements.
- Compensated cases must fit the standard expected-compensation rules:
  - Metabolic acidosis: Winter's formula.
  - Metabolic alkalosis: 0.7 mmHg per mEq/L.
  - Respiratory acidosis: 1 (acute) and 3.5 (chronic) per 10 mmHg.
  - Respiratory alkalosis: 2 (acute) and 4 to 5 (chronic) per 10 mmHg.
- Base excess uses the Van Slyke equation and was recalculated independently for every case. Cases where base excess and HCO<sub>3</sub><sup>−</sup> would disagree are excluded.
- Every teaching sentence and every explanation for each wrong choice was generated for every case and checked for missing or broken values. 0 problems were found.
- The intro readout (pH 7.30, PaCO<sub>2</sub> 55, HCO<sub>3</sub><sup>−</sup> 26) is a real, internally consistent uncompensated respiratory acidosis.

## 8. Reviewer

Automated build and review: Claude, September 28, 2026. Human review: Dr. Sharilyn Rennie (pending).
