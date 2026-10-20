/* ============================================================
   BIO 004 Human Anatomy, Fall 2026
   bio004-day-card.js

   ONE DAY CARD, USED BY EVERY PAGE THAT SHOWS A DAY.

   WHY THIS FILE EXISTS
   --------------------
   The course calendar and the Today page were each drawing their own
   version of the same thing: what happens in class, what the pre-work
   is, what to open in what order. Two renderers over the same day is
   two chances to disagree, and the student is the one who finds out.
   The day data, the styling and the markup now live here, and both
   pages call in.

   THE PRE-WORK ORDER IS LOAD-BEARING
   ----------------------------------
   Worksheet with the notes and the reading open FIRST, then the
   concept video, then spaced retrieval later in the week. Not
   video-first. The notes packet sits WITH the worksheet, not before
   it and not as a separate step.

   HOW TO USE IT
   -------------
     <script src="session-links.js"></script>
     <script src="bio004-day-card.js"></script>
     ...
     BIO004_DAY_CARD.styles();                       // once per page
     el.innerHTML = BIO004_DAY_CARD.render(isoDate, sectionKey);

   sectionKey is 'mw', 'tr-am' or 'tr-eve', the same keys the rest of
   the course uses. It also accepts the calendar's older 'class1',
   'class2', 'class3'.

   Returns '' when that date is not a class day for that section, so a
   caller can test the return value rather than the calendar.
   ============================================================ */
(function () {
  'use strict';
  if (window.BIO004_DAY_CARD) return;

  var SESS_MW = [
  {d:"2026-08-17", lec:"Intro to Course; Team Formation & Canvas Resources", lm:"orientation", tag:"Welcome", lab:"Intro to Anatomy Lab, Lab Safety & Introduction to Histology", pw:{t:"Course orientation video, syllabus & Canvas setup", l:""}}, {d:"2026-08-19", lec:"Guided DITKI Cell Activity Lecture", lm:"interactive", tag:"Brain dump", lab:"Epithelial Tissues", pw:{t:"Cell anatomy concept lecture + guided notes", l:""}}, {d:"2026-08-24", lec:"TBL 1: Cell Anatomy", lm:"tbl", tag:"TBL 1", lab:"Connective Tissue I", pw:{t:"Finish cell anatomy lectures, come ready for TBL 1", l:""}}, {d:"2026-08-26", lec:"Interactive Histology Lecture", lm:"interactive", tag:"Brain dump", lab:"Connective Tissue II", pw:{t:"Histology (epithelium) concept lecture + guided notes", l:""}}, {d:"2026-08-31", lec:"TBL 2: Histology", lm:"tbl", tag:"TBL 2", lab:"Muscle Tissue & Nervous Tissue", pw:{t:"Finish histology lectures, come ready for TBL 2", l:""}}, {d:"2026-09-02", lec:"Exam 1 Review Game", lm:"game", tag:"Review", lab:"Integumentary", pw:{t:"Review Units 1–2 for the Exam 1 review game", l:""}}, {d:"2026-09-07", lec:"Labor Day, No Class", lm:"holiday", tag:"Labor Day", lab:null, pw:null}, {d:"2026-09-09", lec:"Exam 1", lm:"exam", tag:"Exam 1", lab:"Exam 1", pw:{t:"Study for Exam 1 (Cell + Histology)", l:""}}, {d:"2026-09-14", lec:"Exam 1 Rebuttals; Guided DITKI Long Bone Anatomy & Bone Microanatomy", lm:"interactive", tag:"Brain dump", lab:"Bone Tissue, Long Bone & Microanatomy", pw:{t:"Long bone anatomy & bone microanatomy concept lecture + notes", l:""}}, {d:"2026-09-16", lec:"Skull Walk-Through Lecture", lm:"interactive", tag:"Brain dump", lab:"Axial Skeleton: Skull", pw:{t:"Axial skeleton, skull concept lecture + notes", l:""}}, {d:"2026-09-21", lec:"Spine Walk-Through Lecture", lm:"interactive", tag:"Brain dump", lab:"Axial Skeleton: Vertebrae & Ribs", pw:{t:"Axial skeleton, spine concept lecture + notes", l:""}}, {d:"2026-09-23", lec:"TBL 3: Bone Tissue, Cartilage & Microanatomy", lm:"tbl", tag:"TBL 3", lab:"Upper Extremity", pw:{t:"Bone tissue & cartilage, come ready for TBL 3", l:""}}, {d:"2026-09-28", lec:"Kahoot Review: Bone & Bone Details", lm:"game", tag:"Kahoot", lab:"Lower Extremity", pw:{t:"Review bone & skeletal details for the Kahoot", l:""}}, {d:"2026-09-30", lec:"Exam 2", lm:"exam", tag:"Exam 2", lab:"Exam 2", pw:{t:"Study for Exam 2 (Skeletal)", l:""}}, {d:"2026-10-05", lec:"Exam 2 Rebuttals; Interactive Heart Lecture; Cardiac Conduction", lm:"interactive", tag:"Brain dump", lab:"Thoracic Anatomy (Heart); BV Histology & Anatomy", pw:{t:"Heart anatomy + cardiac conduction concept lecture + notes", l:""}}, {d:"2026-10-07", lec:"Lecture TBL 4: Muscle Microanatomy and the Sarcomere", lm:"tbl", tag:"TBL 4", lab:"Muscle Microanatomy, and Muscles of the Upper Trunk and Arm", pw:{t:"Pre-read for Lecture TBL 4: Muscle microanatomy", l:"bio004-preread.html?day=2026-10-07"}}, {d:"2026-10-12", lec:"Lecture TBL 5: Heart Anatomy and Cardiac Conduction", lm:"tbl", tag:"TBL 5", lab:"The Heart and Blood Cells", pw:{t:"Pre-read for Lecture TBL 5: Heart and conduction", l:"bio004-preread.html?day=2026-10-12"}}, {d:"2026-10-14", lec:"Blood Vessel Anatomy Lecture", lm:"interactive", tag:"Lab TBL 1", lab:"Lab TBL 1 (first 1.5 hours): Muscles and NAV of the Anterior Forearm. Then: Muscles and NAV of the Anterior Forearm", pw:{t:"Pre-read: start Blood vessels; prep the lab", l:"bio004-preread.html?day=2026-10-14"}}, {d:"2026-10-19", lec:"Lecture TBL 6: Blood", lm:"tbl", tag:"TBL 6", lab:"Muscles and NAV of the Posterior Forearm", pw:{t:"Pre-read for Lecture TBL 6: Blood", l:"bio004-preread.html?day=2026-10-19"}}, {d:"2026-10-21", lec:"Exam 3", lm:"exam", tag:"Exam 3", lab:"Exam 3", pw:{t:"Study for Exam 3 (Muscle micro, heart, blood vessels, blood)", l:""}}, {d:"2026-10-26", lec:"Lecture TBL 7: Respiratory Anatomy and Histology", lm:"tbl", tag:"TBL 7", lab:"Thoracic Anatomy (Respiratory) and Respiratory Histology (models)", pw:{t:"Pre-read for Lecture TBL 7: Respiratory", l:"bio004-preread.html?day=2026-10-26"}}, {d:"2026-10-28", lec:"Respiratory System Lecture", lm:"interactive", tag:"Brain dump", lab:"Thoracic Anatomy (Respiratory) and Respiratory Histology (cadaver)", pw:{t:"Pre-read: start Lymphatic system; prep the lab", l:"bio004-preread.html?day=2026-10-28"}}, {d:"2026-11-02", lec:"Lecture TBL 8: Endocrine System", lm:"tbl", tag:"TBL 8", lab:"Muscles, Nerves and Vessels of the Lower Limb (models)", pw:{t:"Pre-read for Lecture TBL 8: Endocrine", l:"bio004-preread.html?day=2026-11-02"}}, {d:"2026-11-04", lec:"Guided DITKI GI Map Activity I and II", lm:"interactive", tag:"Brain dump", lab:"Muscles, Nerves and Vessels of the Lower Limb (cadaver)", pw:{t:"Pre-read: start GI; prep the lab", l:"bio004-preread.html?day=2026-11-04"}}, {d:"2026-11-09", lec:"Lecture TBL 9: GI System", lm:"tbl", tag:"TBL 9", lab:"GI Organs, Primary and Accessory (models, then cadaver)", pw:{t:"Pre-read for Lecture TBL 9: GI", l:"bio004-preread.html?day=2026-11-09"}}, {d:"2026-11-11", lec:"Veteran's Day, No Class", lm:"holiday", tag:"Veterans", lab:null, pw:null}, {d:"2026-11-16", lec:"Exam 4", lm:"exam", tag:"Exam 4", lab:"Exam 4", pw:{t:"Study for Exam 4 (Respiratory, lymphatic, endocrine, GI). Both parts today, lecture exam and lab practical. Note the Monday.", l:""}}, {d:"2026-11-18", lec:"Exam 4 Rebuttals; Guided Renal Map", lm:"interactive", tag:"Brain dump", lab:"Urinary and Reproductive Organs (models)", pw:{t:"Pre-read: start Renal; prep the lab", l:"bio004-preread.html?day=2026-11-18"}}, {d:"2026-11-23", lec:"Lecture TBL 10: Reproductive Anatomy", lm:"tbl", tag:"TBL 10", lab:"Urinary and Reproductive Organs (cadaver)", pw:{t:"Pre-read for Lecture TBL 10: Reproductive", l:"bio004-preread.html?day=2026-11-23"}}, {d:"2026-11-25", lec:"Travel Day, No Class", lm:"holiday", tag:"Travel Day", lab:null, pw:null}, {d:"2026-11-30", lec:"Lecture TBL 11: Brain, Brainstem, Meninges and CSF", lm:"tbl", tag:"TBL 11", lab:"Brain, Brainstem, Spinal Cord and Cranial Nerves (models)", pw:{t:"Pre-read for Lecture TBL 11: Brain, brainstem, meninges and CSF", l:"bio004-preread.html?day=2026-11-30"}}, {d:"2026-12-02", lec:"Cranial Nerves and Spinal Cord, with Cranial Nerve Exam Stations", lm:"interactive", tag:"Brain dump", lab:"Brain, Brainstem, Spinal Cord and Cranial Nerves (cadaver)", pw:{t:"Pre-read: start Cranial nerves and spinal cord; prep the lab", l:"bio004-preread.html?day=2026-12-02"}}, {d:"2026-12-07", lec:"Lecture TBL 12: Autonomic Nervous System", lm:"tbl", tag:"TBL 12", lab:"Module 5 lab review. Work on what you need", pw:{t:"Pre-read for Lecture TBL 12: Autonomic nervous system", l:"bio004-preread.html?day=2026-12-07"}}, {d:"2026-12-09", lec:"Exam 5", lm:"exam", tag:"Exam 5", lab:"Exam 5", pw:{t:"Study for Exam 5 (Renal, Repro, Neuro)", l:""}}, ];
  var SESS_TR = [
  {d:"2026-08-18", lec:"Intro to Course; Team Formation & Canvas Resources", lm:"orientation", tag:"Welcome", lab:"Intro to Anatomy Lab, Lab Safety & Introduction to Histology", pw:{t:"Course orientation video, syllabus & Canvas setup", l:""}}, {d:"2026-08-20", lec:"Guided DITKI Cell Activity Lecture", lm:"interactive", tag:"Brain dump", lab:"Epithelial Tissues", pw:{t:"Cell anatomy concept lecture + guided notes", l:""}}, {d:"2026-08-25", lec:"TBL 1: Cell Anatomy", lm:"tbl", tag:"TBL 1", lab:"Connective Tissue I", pw:{t:"Finish cell anatomy lectures, come ready for TBL 1", l:""}}, {d:"2026-08-27", lec:"Interactive Histology Lecture", lm:"interactive", tag:"Brain dump", lab:"Connective Tissue II", pw:{t:"Histology (epithelium) concept lecture + guided notes", l:""}}, {d:"2026-09-01", lec:"TBL 2: Histology", lm:"tbl", tag:"TBL 2", lab:"Muscle & Nervous Tissue", pw:{t:"Finish histology lectures, come ready for TBL 2", l:""}}, {d:"2026-09-03", lec:"Exam 1 Review Game", lm:"game", tag:"Review", lab:"Integumentary", pw:{t:"Review Units 1–2 for the Exam 1 review game", l:""}}, {d:"2026-09-08", lec:"Exam 1", lm:"exam", tag:"Exam 1", lab:"Exam 1", pw:{t:"Study for Exam 1 (Cell + Histology)", l:""}}, {d:"2026-09-10", lec:"Exam 1 Rebuttals; Guided DITKI Long Bone Anatomy & Bone Microanatomy", lm:"interactive", tag:"Brain dump", lab:"Bone Tissue, Long Bone & Microanatomy", pw:{t:"Long bone anatomy & bone microanatomy concept lecture + notes", l:""}}, {d:"2026-09-15", lec:"Skull Walk-Through Lecture", lm:"interactive", tag:"Brain dump", lab:"Axial Skeleton: Skull", pw:{t:"Axial skeleton, skull concept lecture + notes", l:""}}, {d:"2026-09-17", lec:"Spine Walk-Through Lecture", lm:"interactive", tag:"Brain dump", lab:"Axial Skeleton: Vertebrae & Ribs", pw:{t:"Axial skeleton, spine concept lecture + notes", l:""}}, {d:"2026-09-22", lec:"TBL 3: Bone Tissue, Cartilage & Microanatomy", lm:"tbl", tag:"TBL 3", lab:"Upper Extremity", pw:{t:"Bone tissue & cartilage, come ready for TBL 3", l:""}}, {d:"2026-09-24", lec:"Kahoot Review: Bone & Bone Details", lm:"game", tag:"Kahoot", lab:"Lower Extremity", pw:{t:"Review bone & skeletal details for the Kahoot", l:""}}, {d:"2026-09-29", lec:"Exam 2", lm:"exam", tag:"Exam 2", lab:"Exam 2", pw:{t:"Study for Exam 2 (Skeletal)", l:""}}, {d:"2026-10-01", lec:"Exam 2 Rebuttals; Interactive Heart Lecture; Cardiac Conduction", lm:"interactive", tag:"Brain dump", lab:"Thoracic Anatomy (Heart); BV Histology & Anatomy", pw:{t:"Heart anatomy + cardiac conduction concept lecture + notes", l:""}}, {d:"2026-10-06", lec:"DITKI Guided Interactive Muscle Microanatomy & Sarcomere Lecture", lm:"interactive", tag:"Brain dump", lab:"Muscle Microanatomy & Sarcomere", pw:{t:"Muscle microanatomy & sarcomere concept lecture + notes", l:""}}, {d:"2026-10-08", lec:"Lecture TBL 4: Heart, Cardiac Conduction and Muscle Microanatomy", lm:"tbl", tag:"TBL 4", lab:"Cadaver: Muscles, Nerves and Vessels of the Trunk and Upper Limb, and the Heart. Models: Muscles and NAV of the Anterior Forearm", pw:{t:"Pre-read for Lecture TBL 4: Heart and conduction and Muscle microanatomy", l:"bio004-preread.html?day=2026-10-08"}}, {d:"2026-10-13", lec:"Professional Development, No Class", lm:"holiday", tag:"Prof Dev", lab:null, pw:null}, {d:"2026-10-15", lec:"Blood Vessel Anatomy Lecture", lm:"interactive", tag:"Lab TBL 1", lab:"Lab TBL 1 (first 1.5 hours): Muscle Microanatomy and the Sarcomere + Trunk, Upper Limb, Heart and Anterior Forearm. Then: Cadaver: Trunk, Upper Limb, Heart and Anterior Forearm. Models: Muscles and NAV of the Posterior Forearm", pw:{t:"Pre-read: start Blood vessels; prep the lab", l:"bio004-preread.html?day=2026-10-15"}}, {d:"2026-10-20", lec:"Lecture TBL 5: Blood", lm:"tbl", tag:"TBL 5", lab:"Module 3 lab review (everything). Work on what you need", pw:{t:"Pre-read for Lecture TBL 5: Blood", l:"bio004-preread.html?day=2026-10-20"}}, {d:"2026-10-22", lec:"Exam 3", lm:"exam", tag:"Exam 3", lab:"Exam 3", pw:{t:"Study for Exam 3 (Muscle micro, heart, blood vessels, blood)", l:""}}, {d:"2026-10-27", lec:"Lecture TBL 6: Respiratory Anatomy and Histology", lm:"tbl", tag:"TBL 6", lab:"Thoracic Anatomy (Respiratory) and Respiratory Histology (models)", pw:{t:"Pre-read for Lecture TBL 6: Respiratory", l:"bio004-preread.html?day=2026-10-27"}}, {d:"2026-10-29", lec:"Lymphatic System Lecture", lm:"interactive", tag:"Brain dump", lab:"Thoracic Anatomy (Respiratory) and Respiratory Histology (cadaver)", pw:{t:"Pre-read: start Lymphatic system; prep the lab", l:"bio004-preread.html?day=2026-10-29"}}, {d:"2026-11-03", lec:"Lecture TBL 7: Endocrine System", lm:"tbl", tag:"TBL 7", lab:"Muscles, Nerves and Vessels of the Lower Limb (models)", pw:{t:"Pre-read for Lecture TBL 7: Endocrine", l:"bio004-preread.html?day=2026-11-03"}}, {d:"2026-11-05", lec:"Endocrine Mind Map Activity", lm:"interactive", tag:"Brain dump", lab:"Muscles, Nerves and Vessels of the Lower Limb (cadaver)", pw:{t:"Pre-read: start Endocrine; prep the lab", l:"bio004-preread.html?day=2026-11-05"}}, {d:"2026-11-10", lec:"Lecture TBL 8: GI System", lm:"tbl", tag:"TBL 8", lab:"GI Organs, Primary and Accessory (models)", pw:{t:"Pre-read for Lecture TBL 8: GI", l:"bio004-preread.html?day=2026-11-10"}}, {d:"2026-11-12", lec:"Guided DITKI GI Map Activity II", lm:"interactive", tag:"Brain dump", lab:"GI Organs, Primary and Accessory (cadaver)", pw:{t:"Pre-read: start GI; prep the lab", l:"bio004-preread.html?day=2026-11-12"}}, {d:"2026-11-17", lec:"Exam 4", lm:"exam", tag:"Exam 4", lab:"Exam 4", pw:{t:"Study for Exam 4 (Respiratory, lymphatic, endocrine, GI)", l:""}}, {d:"2026-11-19", lec:"Guided Renal Map", lm:"interactive", tag:"Brain dump", lab:"Urinary and Reproductive Organs (models)", pw:{t:"Pre-read: start Renal; prep the lab", l:"bio004-preread.html?day=2026-11-19"}}, {d:"2026-11-24", lec:"Lecture TBL 9: Reproductive Anatomy", lm:"tbl", tag:"TBL 9", lab:"Urinary and Reproductive Organs (cadaver)", pw:{t:"Pre-read for Lecture TBL 9: Reproductive", l:"bio004-preread.html?day=2026-11-24"}}, {d:"2026-11-26", lec:"Thanksgiving, No Class", lm:"holiday", tag:"Thanksgiving", lab:null, pw:null}, {d:"2026-12-01", lec:"Lecture TBL 10: Brain, Brainstem, Meninges and CSF", lm:"tbl", tag:"TBL 10", lab:"Brain, Brainstem, Spinal Cord and Cranial Nerves (models)", pw:{t:"Pre-read for Lecture TBL 10: Brain, brainstem, meninges and CSF", l:"bio004-preread.html?day=2026-12-01"}}, {d:"2026-12-03", lec:"Cranial Nerves and Spinal Cord, with Cranial Nerve Exam Stations", lm:"interactive", tag:"Brain dump", lab:"Brain, Brainstem, Spinal Cord and Cranial Nerves (cadaver)", pw:{t:"Pre-read: start Cranial nerves and spinal cord; prep the lab", l:"bio004-preread.html?day=2026-12-03"}}, {d:"2026-12-08", lec:"Lecture TBL 11: Autonomic Nervous System", lm:"tbl", tag:"TBL 11", lab:"Module 5 lab review. Work on what you need", pw:{t:"Pre-read for Lecture TBL 11: Autonomic nervous system", l:"bio004-preread.html?day=2026-12-08"}}, {d:"2026-12-10", lec:"Exam 5", lm:"exam", tag:"Exam 5", lab:"Exam 5", pw:{t:"Study for Exam 5 (Renal, Repro, Neuro)", l:""}}, ];
  var SECTIONS = {
  class1:{lecT:"12:30–1:50 pm · VC 118", labT:"2:00–4:50 pm · VC 1137", sess:SESS_MW}, class2:{lecT:"9:30–10:45 am · VC 212", labT:"11:00 am–1:50 pm · VC 1137", sess:SESS_TR}, class3:{lecT:"5:30–6:45 pm · VC 118", labT:"7:00–9:50 pm · VC 1137", sess:SESS_TR}, };

  /* The rest of the course says mw / tr-am / tr-eve. The calendar grew up
     saying class1 / class2 / class3. Accept both rather than make every
     caller remember which page it is on. */
  var ALIAS = { 'mw':'class1', 'tr-am':'class2', 'tr-eve':'class3',
                'class1':'class1', 'class2':'class2', 'class3':'class3' };

  var DOWL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function parse(s){ var p=String(s).split('-'); return new Date(+p[0], +p[1]-1, +p[2]); }
  function esc(s){ return String(s==null?'':s); }

  function sessionFor(iso, key){
    var sec = SECTIONS[ALIAS[key]];
    if(!sec) return null;
    for(var i=0;i<sec.sess.length;i++){ if(sec.sess[i].d===iso) return sec.sess[i]; }
    return null;
  }

  /* ----------------------------------------------------------
     TICKING THINGS OFF

     Every row on a day is a task, and until now none of them could be
     marked done. A student working through Tuesday's pre-work over two
     evenings had no way to see, on Wednesday, which of the four items
     they had already finished, so the honest options were to redo it or
     to guess.

     Each row now carries a real checkbox, as a SIBLING of the link
     rather than inside it. Nested inside, the browser swallows the tick
     and follows the link instead, which is the failure mode this file
     is careful to avoid. Side by side, ticking and opening are two
     separate targets and both work from the keyboard.

     State is keyed by date and URL, not by position, so it survives the
     calendar re-rendering, a change of section, and material being
     added to a day later in the term.
  ---------------------------------------------------------- */

  /* ----------------------------------------------------------
     The checkbox styling injects itself rather than living in styles().

     Not every host calls styles(): the course calendar carries its own
     copy of the card CSS inline, so anything added to the styles() string
     alone is simply never applied there. The checkbox arrived that way and
     rendered as a bare 0px-wide label, present in the markup and
     impossible to click. These rules are small, scoped to classes only
     this file emits, and safe to add on any page.
  ---------------------------------------------------------- */
  var CHECK_CSS = "\n  .mrow{display:flex;align-items:center;gap:9px;}\n  .mrow > a{flex:1 1 auto;min-width:0;}\n  .mchk{position:absolute;opacity:0;width:1px;height:1px;pointer-events:none;}\n  .mchk-l{flex:0 0 auto;width:26px;height:26px;border-radius:7px;border:2px solid var(--navy-tint, #ECEFF4);background:#fff;cursor:pointer;display:inline-block;position:relative;transition:var(--t, background 160ms ease, border-color 160ms ease);}\n  .mchk-l::after{content:'';position:absolute;left:8px;top:3px;width:6px;height:12px;border:solid #fff;border-width:0 2.5px 2.5px 0;transform:rotate(45deg) scale(0);transition:transform 160ms ease;}\n  .mchk:checked + .mchk-l{background:var(--navy, #08101F);border-color:var(--navy, #08101F);}\n  .mchk:checked + .mchk-l::after{transform:rotate(45deg) scale(1);}\n  .mchk:focus-visible + .mchk-l{outline:3px solid var(--gold, #B8924A);outline-offset:2px;}\n  .mrow.is-done > a{opacity:.58;}\n  .d-card.prework .mchk-l{background:rgba(0,0,0,.18);border-color:rgba(244,239,232,.55);}\n  .d-card.prework .mchk:checked + .mchk-l{background:#F2E2B8;border-color:#F2E2B8;}\n  .d-card.prework .mchk:checked + .mchk-l::after{border-color:#7A2A22;}\n  .pw-prog{margin:9px 0 0;font-family:var(--font-eyebrow, 'Plus Jakarta Sans',-apple-system,sans-serif);font-weight:700;font-size:.62rem;letter-spacing:.09em;text-transform:uppercase;color:var(--terra-dark, #6B1616);}\n  .d-card.prework .pw-prog{color:#F2E2B8;}\n  .d-card.all-done .pw-prog::after{content:'  \\2713  all done';}\n  @media (prefers-reduced-motion:reduce){.mchk-l,.mchk-l::after{transition:none;}}";
  function ensureCheckCss(){
    if(document.getElementById('bio004-daycard-check-css')) return;
    var el = document.createElement('style');
    el.id = 'bio004-daycard-check-css';
    el.textContent = CHECK_CSS;
    (document.head || document.documentElement).appendChild(el);
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensureCheckCss);
  } else { ensureCheckCss(); }

  /* THE SAME KEY THE REST OF THE COURSE ALREADY USES.

     today.html has always written localStorage['bio004-done'], keyed
     "YYYY-MM-DD|file.html", and marking a step done there ticks every material
     that step linked to. The first cut of these checkboxes invented
     'bio004-day-done-v1' instead, so the calendar and Today each kept their own
     private list and neither could see the other's. Tick the worksheet on
     Today, open the calendar, and it was still blank.

     Same key, same key format, so a tick anywhere is a tick everywhere. */
  var DKEY = 'bio004-done';
  function doneMap(){
    try { return JSON.parse(localStorage.getItem(DKEY) || '{}'); } catch(e){ return {}; }
  }
  function doneSet(k, on){
    var m = doneMap();
    if(on) m[k] = 1; else delete m[k];
    try { localStorage.setItem(DKEY, JSON.stringify(m)); } catch(e){}
  }
  var ROWN = 0;
  function row(href, icon, title, kind, iso, blank){
    if(!href) return '';
    var key = iso + '|' + href;
    var id  = 'dcx-' + iso.replace(/-/g,'') + '-' + (++ROWN);
    var on  = !!doneMap()[key];
    var tgt = blank ? ' target="_blank" rel="noopener"' : ' target="_top"';
    return '<div class="mrow' + (on ? ' is-done' : '') + '">' +
      /* the name is on the input as aria-label rather than as clipped text in
         the label: clipped text is still rendered text, and a contrast check
         has no way to know nobody can see it */
      '<input type="checkbox" class="mchk" id="' + id + '" data-dc-check="' + esc(key) + '"' +
        ' aria-label="Mark done: ' + esc(title).replace(/"/g,'&quot;') + '"' +
        (on ? ' checked' : '') + '>' +
      '<label class="mchk-l" for="' + id + '"></label>' +
      '<a href="' + esc(href) + '"' + tgt + '><span class="mi" aria-hidden="true">' + icon + '</span>' +
      '<span>' + esc(title) + '</span><span class="mk">' + kind + '</span></a></div>';
  }
  function matLink(o, icon, kind, iso){
    if(!o) return '';
    return row(o.u, icon, o.t, kind, iso);
  }
  function many(list, icon, kind, iso){
    return (list||[]).map(function(o){ return matLink(o, icon, kind, iso); }).join('');
  }

  /* One delegated listener for the whole document, wired once, so it
     keeps working after any caller replaces the card's HTML. */
  function progress(scope){
    var boxes = scope.querySelectorAll('.mchk');
    var done = scope.querySelectorAll('.mchk:checked').length;
    var out = scope.querySelector('[data-dc-prog]');
    if(out) out.textContent = boxes.length ? (done + ' of ' + boxes.length + ' done') : '';
    scope.classList.toggle('all-done', boxes.length > 0 && done === boxes.length);
  }
  if(!window.__bio004DayCardWired){
    window.__bio004DayCardWired = true;
    /* another tab, or Today in the same tab, changing the shared store */
    window.addEventListener('storage', function(e){
      if(e.key && e.key !== DKEY) return;
      var m = doneMap();
      var boxes = document.querySelectorAll('[data-dc-check]');
      for(var i=0;i<boxes.length;i++){
        var on = !!m[boxes[i].getAttribute('data-dc-check')];
        boxes[i].checked = on;
        var r = boxes[i].closest ? boxes[i].closest('.mrow') : null;
        if(r) r.classList.toggle('is-done', on);
      }
      sweep();
    });
    document.addEventListener('change', function(e){
      var b = e.target;
      if(!b || !b.getAttribute || !b.getAttribute('data-dc-check')) return;
      doneSet(b.getAttribute('data-dc-check'), b.checked);
      var r = b.closest ? b.closest('.mrow') : null;
      if(r) r.classList.toggle('is-done', b.checked);
      var card = b.closest ? b.closest('.d-card') : null;
      if(card) progress(card);
    });
  }

  /* render() returns a string, so the counts cannot be filled in until the
     caller has put that string in the document. Rather than making every
     caller remember a second call, this sweeps once on the next tick. */
  function sweep(){
    var cards = document.querySelectorAll('.d-card');
    for(var i=0;i<cards.length;i++) progress(cards[i]);
  }
  function render(iso, key, opts){
    opts = opts || {};
    ROWN = 0;
    setTimeout(sweep, 0);
    var s = sessionFor(iso, key);
    if(!s) return '';
    var sec = SECTIONS[ALIAS[key]];
    var dt = parse(s.d);
    var html = '';

    /* heading:false is for a caller that already says the date and the room
       times in its own header, the Today page being the one that does. The
       exam and holiday titles still render, because those are the content,
       not a repeat of the page heading. */
    var withHead = opts.heading !== false;
    if(withHead){
      html += '<p class="d-date">'+DOWL[dt.getDay()]+' &middot; '+MONTHS[dt.getMonth()]+' '+dt.getDate()+'</p>';
    }

    if(s.lm==='holiday'){
      html += '<h3 class="d-title">No Class</h3>';
      html += '<div class="d-holiday"><p class="dh-emoji">'+esc(s.lec).replace(/, No Class/,'')+'</p>'+
              '<p class="d-empty" style="text-align:center;">Campus holiday, no lecture or lab. Enjoy the day off.</p></div>';
      return html;
    }

    var nb = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()-1);
    var nbLabel = DOWL[nb.getDay()].slice(0,3)+' '+MON3[nb.getMonth()]+' '+nb.getDate();
    var isExam = s.lm==='exam';

    if(withHead || isExam) html += '<h3 class="d-title">'+(isExam?esc(s.lec):'Class Day')+'</h3>';
    if(withHead) html += '<p class="d-meet">Lecture '+sec.lecT+' &nbsp;&middot;&nbsp; Lab '+sec.labT+'</p>';

    var M = (window.BIO004_SESSION_LINKS||{})[s.d] || {};

    if(s.pw){
      html += '<div class="d-card prework"><div class="dc-k">Pre-work (not graded)<span class="dc-when">by '+nbLabel+' night</span></div>';
      html += '<div class="dc-t">'+esc(s.pw.t)+'</div>';
      var step1 = many(M.sheets,'&#9998;','Pre-work',s.d) + many(M.notes,'&#9776;','Notes',s.d) + many(M.workbooks,'&#9636;','Workbook',s.d);
      var step2 = many(M.videos,'&#9658;','Video',s.d);
      var pw = '';
      /* Two minutes closed book first, then the reading. And the video is
         named as the answer key rather than as a second thing to watch,
         because a pretest whose feedback waits until class is the weakest
         version of this. */
      if(step1) pw += '<div class="stephead"><span class="step-n">1</span>Two minutes closed book, then work the sheet with these open</div>'+step1;
      if(step2) pw += '<div class="stephead"><span class="step-n">2</span>Then mark your own sheet against the video</div>'+step2;
      if(step1||step2) pw += '<div class="stephead"><span class="step-n">3</span>Then spaced retrieval, later in the week</div>'+
        row('mastery-os-fall-2026.html#s-recall','&#9673;','Mastery OS, spaced recall for this topic','Recall',s.d);
      if(pw){ html += '<div class="mat">'+pw+'</div><p class="pw-prog" data-dc-prog aria-live="polite"></p>'; }
      else if(s.pw.l){ html += '<a class="pw-link" href="'+esc(s.pw.l)+'" target="_blank" rel="noopener">Open pre-work &#8599;</a>'; }
      /* The only days that reach here are the exam-prep days, whose pre-work
         is "Study for Exam N". There is no new material to link, so promising
         a link that is coming is a lie. Send them to the pages that are
         actually the right answer for that night instead. */
      else if(/^Study for Exam/i.test(s.pw.t||'')){
        html += '<div class="mat">'+
          row('bio004-exam-modules.html','&#9636;','What this exam covers','Scope',s.d)+
          row('mastery-os-fall-2026.html#s-recall','&#9673;','Mastery OS, spaced recall','Recall',s.d)+
          row('mastery-os-fall-2026.html#s-weak','&#9678;','Your weakest topics first','Weak spots',s.d)+
          '</div><p class="pw-prog" data-dc-prog aria-live="polite"></p>';
      }
      else{ html += '<span class="pw-link pending">Link coming soon</span>'; }
      html += '</div>';
    }

    if(isExam){
      html += '<div class="d-card lecture"><div class="dc-k">Exam</div><div class="dc-t">'+esc(s.lec)+'</div>'+
              '<div class="dc-sub">Covers the unit since the last exam. Lecture and lab time both used for the exam.</div>'+
              '<span class="checkbadge cb-exam">Exam</span>';
      html += '<div class="mat"><a href="mastery-os-fall-2026.html" target="_top"><span class="mi" aria-hidden="true">&#9673;</span><span>Mastery OS, build a cram plan</span><span class="mk">Study</span></a>'+
              '<a href="bio004-exam-modules.html" target="_top"><span class="mi" aria-hidden="true">&#9636;</span><span>What this exam covers</span><span class="mk">Scope</span></a></div>';
      html += '</div>';
      return html;
    }

    var badge = {interactive:['cb-icheck','Brain dump'], tbl:['cb-tbl','IRAT &rarr; TRAT &middot; TBL'],
                 game:['cb-game','Review game'], orientation:['cb-orient','Welcome &amp; setup']}[s.lm] || ['cb-orient',''];
    html += '<div class="d-card lecture"><div class="dc-k">Lecture<span class="dc-when">'+sec.lecT.split(' \u00b7 ')[0]+'</span></div>';
    html += '<div class="dc-t">'+esc(s.lec)+'</div>';
    if(badge[1]) html += '<span class="checkbadge '+badge[0]+'">'+badge[1]+'</span>';
    var lec = matLink(M.slides,'&#9635;','Slides',s.d);
    if(lec) html += '<div class="mat">'+lec+'</div>';
    html += '</div>';

    if(s.lab){
      html += '<div class="d-card lab"><div class="dc-k">Lab<span class="dc-when">'+sec.labT.split(' \u00b7 ')[0]+'</span></div>';
      html += '<div class="dc-t">'+esc(s.lab)+'</div>';
      var labs = many(M.lab,'&#9679;','Lab sprint',s.d);
      if(labs) html += '<div class="mat">'+labs+'</div>';
      html += '</div>';
    }

    html += '<div class="mat" style="margin-top:14px;">'+
      '<a href="'+((window.BIO004_LINKS&&window.BIO004_LINKS.loops)?window.BIO004_LINKS.loops.url:'mastery-os-fall-2026.html#s-loops')+'" '+
      'target="_blank" rel="noopener"><span class="mi" aria-hidden="true">&#8635;</span>'+
      '<span>Loops, quick visual practice</span><span class="mk">Practice</span></a></div>';

    return html;
  }

  /* Every custom property carries its own fallback, so this file styles
     itself correctly on a page that does not define the course variables.
     The Today page does not define all nine. */
  var CSS = "  .detail .d-date{font-family:var(--font-eyebrow, 'Plus Jakarta Sans',-apple-system,sans-serif);font-weight:700;font-size:.66rem;letter-spacing:.12em;text-transform:uppercase;color:var(--terra-dark, #6B1616);}\n  .detail .d-title{font-family:var(--font-display, 'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif);font-weight:800;font-size:1.5rem;color:var(--navy, #08101F);margin:4px 0 2px;line-height:1.1;}\n  .detail .d-meet{font-size:.86rem;color:var(--navy, #08101F);opacity:.7;}\n  .d-card{border:1px solid var(--navy-tint, #ECEFF4);border-radius:8px;padding:13px 14px;margin-top:12px;}\n  .d-card.prework{background:#7A2A22;border-color:#7A2A22;}\n  .d-card.prework .dc-k{color:#F2E2B8;} .d-card.prework .dc-t{color:#F4EFE8;} .d-card.prework .dc-when{color:#F4EFE8;opacity:1;}\n  .d-card.prework .pw-link{color:#F4EFE8;border-color:rgba(244,239,232,.6);} .d-card.prework .pw-link:hover{background:#fff;color:#7A2A22;}\n  .d-card.prework .pw-link.pending{color:#F4EFE8;opacity:1;border-color:rgba(244,239,232,.65);}\n  .d-card.lecture .dc-k{color:var(--navy, #08101F);}\n  .d-card.lab .dc-k{color:var(--terra-dark, #6B1616);}\n  .d-card .dc-k{font-family:var(--font-eyebrow, 'Plus Jakarta Sans',-apple-system,sans-serif);font-weight:700;font-size:.62rem;letter-spacing:.09em;text-transform:uppercase;color:var(--terra-dark, #6B1616);display:flex;align-items:center;gap:8px;}\n  .d-card .dc-when{font-weight:600;font-size:.72rem;color:var(--navy, #08101F);opacity:.7;margin-left:auto;text-transform:none;letter-spacing:0;}\n  .d-card .dc-t{font-family:var(--font-display, 'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif);font-weight:700;font-size:1.02rem;color:var(--navy, #08101F);margin:5px 0 0;line-height:1.25;}\n  .d-card .dc-sub{font-size:.83rem;color:var(--navy, #08101F);opacity:.72;margin-top:3px;}\n  .checkbadge{display:inline-block;margin-top:8px;font-family:var(--font-eyebrow, 'Plus Jakarta Sans',-apple-system,sans-serif);font-weight:700;font-size:.6rem;letter-spacing:.05em;text-transform:uppercase;padding:4px 10px;border-radius:999px;}\n  .cb-icheck{background:var(--terra, #8B1D1D);color:#fff;}\n  .cb-tbl{background:var(--navy, #08101F);color:#fff;}\n  .cb-exam{background:var(--terra-dark, #6B1616);color:#fff;}\n  .cb-game{background:#4A545C;color:#fff;}\n  .cb-orient{background:var(--navy-tint, #ECEFF4);color:var(--navy, #08101F);}\n  .pw-link{display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-family:var(--font-display, 'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif);font-weight:700;font-size:.88rem;color:var(--terra-dark, #6B1616);text-decoration:none;border:1.5px solid var(--terra-dark, #6B1616);border-radius:7px;padding:6px 12px;transition:var(--t, transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease);}\n  .pw-link:hover{background:var(--terra-dark, #6B1616);color:#fff;}\n  .mat{display:flex;flex-direction:column;gap:6px;margin-top:9px;}\n  .step-n{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:19px;height:19px;border-radius:50%;font-family:var(--font-display, 'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif);font-weight:800;font-size:.66rem;background:#F2E2B8;color:#7A2A22;}\n  .mat .stephead{display:flex;align-items:center;gap:7px;font-family:var(--font-eyebrow, 'Plus Jakarta Sans',-apple-system,sans-serif);font-weight:700;font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;color:#F2E2B8;margin-top:4px;}\n  .mat .stephead:first-child{margin-top:0;}\n  .mat a{display:flex;align-items:center;gap:8px;font-size:.86rem;font-weight:600;color:var(--navy, #08101F);text-decoration:none;background:#fff;border:1px solid var(--navy-tint, #ECEFF4);border-radius:7px;padding:8px 11px;transition:var(--t, transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease);}\n  .mat a:hover{border-color:var(--terra-dark, #6B1616);transform:translateY(-1px);box-shadow:var(--shadow-rest, 0 1px 3px rgba(0,0,0,0.08));}\n  .mat a .mi{flex:0 0 auto;font-size:.9rem;color:var(--terra-dark, #6B1616);}\n  .mat a .mk{font-family:var(--font-eyebrow, 'Plus Jakarta Sans',-apple-system,sans-serif);font-weight:700;font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:var(--terra-dark, #6B1616);margin-left:auto;white-space:nowrap;}\n  .d-card.prework .mat a{background:rgba(0,0,0,.18);border-color:rgba(244,239,232,.5);color:#F4EFE8;}\n  .d-card.prework .mat a:hover{background:#fff;color:#7A2A22;}\n  .d-card.prework .mat a .mi,.d-card.prework .mat a .mk{color:#F2E2B8;}\n  .d-card.prework .mat a:hover .mi,.d-card.prework .mat a:hover .mk{color:#7A2A22;}\n  .pw-link.pending{border-style:dashed;color:var(--navy, #08101F);opacity:.6;border-color:var(--gray-light, #D1D5DB);pointer-events:none;}\n  .d-holiday{text-align:center;padding:24px 8px;}\n  .d-holiday .dh-emoji{font-family:var(--font-display, 'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,sans-serif);font-weight:800;font-size:1.3rem;color:var(--navy, #08101F);}\n  .d-empty{color:var(--navy, #08101F);opacity:.75;font-size:.92rem;padding:12px 2px;}";

  function styles(){
    if(document.getElementById('bio004-day-card-css')) return;
    var st = document.createElement('style');
    st.id = 'bio004-day-card-css';
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }

  /* How many tickable things a day holds, and how many are ticked.
     The calendar shows a term at a glance and needs this for 34 days at
     once, which is far too many cards to put on a page. Rendering into a
     detached node means the count comes from the same renderer the card
     uses, so the grid and the card can never disagree, and nothing lands
     in the document for sweep() to find.

     Returns {total, done}. total is 0 for a day with no material and for
     a date that is not a class day in that section. */
  function counts(iso, key){
    var out = { total:0, done:0 };
    var html = render(iso, key);
    if(!html) return out;
    var box = document.createElement('div');
    box.innerHTML = html;
    out.total = box.querySelectorAll('.mchk').length;
    out.done  = box.querySelectorAll('.mchk:checked').length;
    return out;
  }

  window.BIO004_DAY_CARD = {
    render: render,
    counts: counts,
    /* call this if you inject the card yourself and want the counts filled
       in without waiting a tick */
    hydrate: sweep,
    styles: styles,
    sessionFor: sessionFor,
    sessions: function(key){ var s = SECTIONS[ALIAS[key]]; return s ? s.sess.slice() : []; },
    times: function(key){ var s = SECTIONS[ALIAS[key]]; return s ? {lecT:s.lecT, labT:s.labT} : null; }
  };
})();
