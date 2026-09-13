/* ============================================================
   BIO 005 Human Physiology, Yuba College, Fall 2026
   Section BIOL-5-D9286, Sutter Internet (NET)
   FULLY ASYNCHRONOUS ONLINE, lecture and lab.

   Schedule scaffold. Built AFTER the competency map, so every week
   here exists to carry a specific set of competencies rather than a
   chapter number. Read bio005-competencies.js first.

   ------------------------------------------------------------
   WHAT IS CONFIRMED AND WHAT IS A PLACEHOLDER
   ------------------------------------------------------------
   CONFIRMED, from the section listing:
     Term runs 9/8/2026 to 12/16/2026
     Lecture asynchronous online, lab asynchronous online
     Census 9/27/2026
     Last day to drop 11/21/2026
     Capacity 30, waitlist 10

   PLACEHOLDER, needs Scrubs to confirm:
     Whether proctoring is required (gates the whole assessment model)
     Whether Yuba requires a separately stated lab percentage
     Yuba holiday observances for Fall 2026

   RESOLVED:
     Competency set stays at 268, ids unchanged, sensory un-merged (Aug 24)
     Week ORDER adopted Aug 23. Titles stay in student language (Aug 24)
     Grading weights, assessment model adopted Aug 23
     Lab delivery, the lab sits inside the weekly cycle
     Textbook, OpenStax free link, no required purchase

   ------------------------------------------------------------
   ASYNCHRONOUS DESIGN RULES BAKED INTO THIS SCHEDULE
   ------------------------------------------------------------
   1. A week is a container with an open and a close, not a meeting.
      Every week opens Monday 12:00 am and closes Sunday 11:59 pm,
      except Week 1 (opens Tue Sep 8) and Week 15 (closes Wed Dec 16).
   2. Every week has the same shape so students never have to relearn
      the container. The shape is the four stages the whole site uses,
      1 Learn, 2 Practice, 3 Apply, 4 Check, and the six steps below sit
      inside them. An earlier version of this comment named four beats
      called Prime, Build, Practice and Prove, which never matched the
      steps in the data underneath it.
   3. Nothing requires the instructor to be present at a moment.
   4. Checkpoints replace attendance. Each week has one low-stakes
      graded checkpoint that closes on time.
   5. Exams are windows. An exam that opens Friday and closes Monday
      night works for students on night shift, which is most of a
      physiology cohort headed for nursing.
   ============================================================ */

window.BIO005_TERM = {
  course:   'BIO 005 Human Physiology',
  section:  'BIOL-5-D9286',
  college:  'Yuba College',
  campus:   'Sutter Internet (NET)',
  term:     'Fall 2026',
  delivery: 'Asynchronous online, lecture and lab',
  start:    '2026-09-08',
  end:      '2026-12-16',
  census:   '2026-09-27',
  lastDrop: '2026-11-21',
  weeklyOpen:  'Monday 12:00 am',
  weeklyClose: 'Sunday 11:59 pm',
  instructor:  'Dr. Sharilyn Rennie',

  /* Assumed from the standard California community college calendar.
     CONFIRM against the Yuba 2026-2027 academic calendar. In an
     asynchronous course these do not cancel a class meeting, but
     nothing graded should be due on them. */
  observances: [
    { date:'2026-11-11', day:'Wed', name:'Veterans Day',  status:'assumed' },
    { date:'2026-11-26', day:'Thu', name:'Thanksgiving',  status:'assumed' },
    { date:'2026-11-27', day:'Fri', name:'Day after Thanksgiving', status:'assumed' }
  ]
};

/* ============================================================
   THE WEEKLY CONTAINER
   Same four beats every week. Students learn the container once.
   ============================================================ */

window.BIO005_WEEK_SHAPE = [
  { beat:'Step 1. Prime', stage:'1 Learn', when:'Opens Monday', minutes:20,
    what:'Read the Start Here checklist and the competency list without looking anything up, then predict three answers in your head. Being wrong first is what makes the teaching stick.',
    graded:'ungraded, completion tracked' },
  { beat:'Step 2. Teach', stage:'1 Learn', when:'Monday to Wednesday', minutes:196,
    what:'Concept video with the slide page open beside it, then the week page, then the red terms. Stop at every concept check and answer it before opening the answer.',
    graded:'ungraded' },
  { beat:'Step 3. Practice', stage:'2 Practice', when:'Wednesday', minutes:90,
    what:'Knowledge check in Canvas, AI open, then the day\'s recall stack in the Mastery OS. Under 70 sends you back to Step 2, but only to the sections the missed questions came from.',
    graded:'10 points across the term, two lowest dropped' },
  { beat:'Step 4. Lab', stage:'3 Apply', when:'Wednesday to Friday', minutes:216,
    what:'Run the week\'s lab exercise and record your data. This is where your patient\'s numbers come from, so it happens before the chart entry, not after.',
    graded:'20 points' },
  { beat:'Step 5. Chart entry', stage:'3 Apply', when:'Saturday', minutes:90,
    what:'Your patient\'s week. Draw the loop by hand on paper, answer the written questions, log your AI use. AI closed.',
    graded:'20 points' },
  { beat:'Step 6. Close', stage:'4 Check', when:'Sunday', minutes:20,
    what:'Tick what you can now do on the Start Here checklist. Anything still untickable goes on your miss list.',
    graded:'ungraded' },
  { beat:'Independent study', stage:'2 Practice', when:'Across the week', minutes:232,
    what:'Re-reading, redrawing from memory, working problems, the choice branch, and the textbook. Not assigned and not submitted, and it is the largest single block of the week.',
    graded:'not submitted' }
];

/* ============================================================
   WEEK BY WEEK
   competencies: the exact ids from bio005-competencies.js that this
   week is responsible for. This is the link that lets the schedule
   page, the exam blueprint, and the gap finder stay in sync.
   ============================================================ */

window.BIO005_WEEKS = [
  { wk:1, module:1, opens:'2026-09-08', closes:'2026-09-13', short:true,
    title:"How physiology works and what keeps you steady",
    note:"Short week, term opens on a Tuesday. Front-load orientation, not content.",
    extras:["Start Here module", "Syllabus quiz", "Vision board discussion", "Tech check and Canvas tour"],
    competencies:["w1-levels-function", "w1-structure-function", "w1-homeostasis", "w1-feedback-components", "w1-feedback-types", "w1-feedforward", "w1-control-pathways", "w1-mass-balance", "w1-units-conversion", "w1-lab-graphing", "w1-lab-experimental-design", "w1-lab-measurement-error"] },

  { wk:2, module:1, opens:'2026-09-14', closes:'2026-09-20',
    title:"The chemistry that does work in the body",
    competencies:["w1-water-properties", "w1-ph-buffers", "w1-protein-function", "w1-enzyme-function", "w1-atp-energy", "w1-lab-enzyme-assay", "w14-atp-pathways"] },

  { wk:3, module:1, opens:'2026-09-21', closes:'2026-09-27',
    title:"Getting across the membrane",
    note:"Census is Sun Sep 27, the same day this week closes.",
    competencies:["w1-fluid-compartments", "w1-compartment-shifts", "w2-membrane-structure", "w2-permeability", "w2-fick-diffusion", "w2-osmolarity-tonicity", "w2-osmosis-cell-volume", "w2-lab-diffusion-osmosis", "w2-lab-rbc-tonicity", "w2-facilitated-diffusion", "w2-primary-active-transport", "w2-secondary-active-transport", "w2-transport-maximum", "w2-vesicular-transport", "w2-transepithelial-transport", "w2-lab-transport-sim"] },

  { wk:4, module:2, opens:'2026-09-28', closes:'2026-10-04',
    title:"How cells talk, and the electrical signal",
    competencies:["w2-electrochemical-gradient", "w2-nernst", "w2-resting-potential", "w2-ion-channels", "w2-potential-terms", "w2-lab-membrane-potential", "w4-neuron-classes", "w4-neuron-regions", "w4-glia-functions", "w4-myelin", "w4-axonal-transport", "w4-graded-potentials", "w4-action-potential", "w4-threshold", "w4-intensity-coding", "w4-refractory", "w4-conduction-velocity", "w4-ion-disturbance", "w4-lab-ap-simulation", "w4-lab-nerve-conduction"] },

  { wk:5, module:2, opens:'2026-10-05', closes:'2026-10-11',
    title:"Synapses and central integration",
    note:"Heaviest week in the course, 35 competencies. Sensory and special senses sit here un-merged.",
    competencies:["w5-synaptic-sequence", "w5-neurotransmitters", "w5-neurotransmitter-removal", "w5-postsynaptic-potentials", "w5-summation-integration", "w5-presynaptic-modulation", "w5-synaptic-plasticity", "w5-electrical-synapses", "w5-lab-synapse-sim", "w5-reflex-arc", "w5-stretch-reflex", "w5-golgi-tendon", "w5-withdrawal-reflex", "w5-spinal-pathways", "w5-csf-bbb", "w5-lab-reflex-testing"] },

  { wk:6, module:2, opens:'2026-10-12', closes:'2026-10-18',
    title:"Sensing the world, and the responses you do not control",
    competencies:["w7-transduction", "w7-receptor-classes", "w7-stimulus-coding", "w7-receptive-fields", "w7-receptor-adaptation", "w7-somatosensory-pathways", "w7-pain-modulation", "w7-lab-tactile-mapping", "w7-vision-optics", "w7-phototransduction", "w7-visual-processing", "w7-vision-clinical", "w7-hearing-transduction", "w7-hearing-clinical", "w7-equilibrium", "w7-chemical-senses", "w7-lab-vision-tests", "w7-lab-hearing-tests", "w8-ans-organization", "w8-ans-divisions", "w8-ans-receptors", "w8-ans-tone", "w8-ans-pharmacology", "w8-lab-autonomic-testing"] },

  { wk:7, module:2, opens:'2026-10-19', closes:'2026-10-25',
    title:"Muscle, and how movement gets commanded",
    competencies:["w6-nmj", "w6-ec-coupling", "w6-crossbridge-cycle", "w6-calcium-regulation", "w6-relaxation", "w6-twitch", "w6-summation-tetanus", "w6-motor-units", "w6-length-tension", "w6-contraction-types", "w6-fiber-types", "w6-muscle-energetics", "w6-fatigue", "w6-muscle-adaptation", "w6-lab-emg-fatigue", "w6-lab-muscle-sim", "w6-smooth-muscle", "w6-smooth-regulation", "w6-cardiac-muscle", "w6-muscle-comparison", "w8-motor-hierarchy", "w8-corticospinal", "w8-cerebellum-basal-ganglia", "w8-umn-lmn"] },

  { wk:8, module:2, opens:'2026-10-26', closes:'2026-11-01',
    title:"Hormones and reproduction, the slow control system",
    note:"Midterm checkpoint due Sun Nov 1, the day this week closes.",
    extras:["Midterm checkpoint"],
    competencies:["w3-signal-types", "w3-receptor-location", "w3-gpcr-pathway", "w3-second-messengers", "w3-catalytic-intracellular-receptors", "w3-signal-amplification", "w3-receptor-modulation", "w3-signal-termination", "w3-lab-dose-response", "w9-hormone-classes", "w9-hormone-transport", "w9-hormone-receptors", "w9-hormone-interactions", "w9-hormone-release", "w9-hypothalamic-pituitary", "w9-endocrine-pathology", "w9-posterior-pituitary", "w9-lab-hormone-assay", "w15-hpg-axis", "w15-male-reproductive", "w15-ovarian-cycle", "w15-uterine-cycle", "w15-pregnancy-hormones", "w15-parturition-lactation", "w15-lab-cycle-graphs"] },

  { wk:9, module:3, opens:'2026-11-02', closes:'2026-11-08',
    title:"The heart as a pump",
    competencies:["w8-adrenal-medulla", "w10-pacemaker-potential", "w10-cardiac-ap", "w10-conduction-system", "w10-cardiac-refractory", "w10-ecg-basics", "w10-ecg-interpretation", "w10-lab-ecg", "w11-cardiac-cycle", "w11-pv-loop", "w11-heart-sounds", "w11-stroke-volume", "w11-cardiac-output", "w11-frank-starling", "w11-preload-afterload", "w11-cardiac-regulation", "w11-lab-heart-sounds"] },

  { wk:10, module:3, opens:'2026-11-09', closes:'2026-11-15',
    title:"Pressure, flow, and holding blood pressure steady",
    note:"Veterans Day falls Wed Nov 11. Yuba observance still to confirm.",
    competencies:["w9-adrenal-cortex", "w11-flow-resistance", "w11-vessel-function", "w11-blood-pressure", "w11-local-blood-flow", "w11-capillary-exchange", "w11-edema", "w11-venous-return", "w11-lab-bp-measurement", "w11-baroreflex", "w11-cv-hormonal", "w11-exercise-cv", "w11-shock-compensation"] },

  { wk:11, module:3, opens:'2026-11-16', closes:'2026-11-22',
    title:"Blood and how the body defends itself",
    note:"Last day to drop with a grade is Sat Nov 21.",
    competencies:["w10-plasma", "w10-hematocrit", "w10-rbc-hemoglobin", "w10-erythropoiesis", "w10-rbc-destruction", "w10-leukocytes", "w10-hemostasis", "w10-coagulation", "w10-fibrinolysis", "w10-blood-types", "w10-lab-hematocrit", "w10-lab-blood-typing", "w11-lymph-return", "w15-innate-immunity", "w15-inflammation", "w15-adaptive-immunity", "w15-antibodies", "w15-immune-memory", "w15-immune-dysfunction"] },

  { wk:12, module:3, opens:'2026-11-23', closes:'2026-11-29',
    title:"Digestion, and how you use food for fuel",
    note:"Thanksgiving Nov 26 and 27. Digestion is here on purpose: the holiday meal is this week's disturbance.",
    competencies:["w9-growth-hormone", "w9-thyroid", "w9-stress-response", "w9-islet-hormones", "w9-diabetes", "w9-lab-glucose-tolerance", "w14-digestive-processes", "w14-gi-motility", "w14-gi-regulation", "w14-digestive-phases", "w14-gastric-secretion", "w14-pancreatic-bile-secretion", "w14-carb-protein-absorption", "w14-lipid-absorption", "w14-liver-function", "w14-large-intestine", "w14-lab-digestion-enzymes", "w14-absorptive-state", "w14-postabsorptive-state", "w14-glucose-regulation", "w14-metabolic-rate", "w14-thermoregulation", "w14-lab-metabolic-rate"] },

  { wk:13, module:3, opens:'2026-11-30', closes:'2026-12-06',
    title:"Breathing, gas transport, and the fast pH lever",
    competencies:["w12-respiratory-functions", "w12-ventilation-mechanics", "w12-intrapleural-pressure", "w12-compliance", "w12-surfactant", "w12-airway-resistance", "w12-lung-volumes", "w12-spirometry-patterns", "w12-dead-space", "w12-lab-spirometry", "w12-partial-pressures", "w12-gas-diffusion", "w12-va-q-matching", "w12-oxygen-transport", "w12-hb-curve-shifts", "w12-co2-transport", "w12-bohr-haldane", "w12-oxygen-content", "w12-respiratory-centers", "w12-chemoreceptors", "w12-ventilation-adaptation", "w12-lab-ventilation-response", "w13-buffer-systems", "w13-respiratory-ph-control"] },

  { wk:14, module:3, opens:'2026-12-07', closes:'2026-12-13',
    title:"The kidney and body fluid balance",
    competencies:["w9-calcium-homeostasis", "w13-kidney-functions", "w13-nephron-function", "w13-renal-processes", "w13-filtration-membrane", "w13-gfr-forces", "w13-gfr-regulation", "w13-renal-clearance", "w13-clearance-inference", "w13-proximal-reabsorption", "w13-renal-threshold", "w13-tubular-secretion", "w13-countercurrent", "w13-adh-water-balance", "w13-raas", "w13-natriuretic-peptides", "w13-potassium-handling", "w13-micturition", "w13-lab-urinalysis", "w13-lab-renal-calculation", "w13-volume-osmolarity"] },

  { wk:15, module:3, opens:'2026-12-14', closes:'2026-12-16', short:true,
    title:"The slow pH lever, and putting it all together",
    note:"Three days only, Dec 14 to 16. Case conference and the final patient file are due Wed Dec 16.",
    extras:["Case conference recording", "Final patient file"],
    competencies:["w13-renal-ph-control", "w13-acid-base-disorders", "w13-acid-base-compensation", "w13-lab-abg-interpretation", "w15-integration-case", "w15-exercise-integration", "w15-drawing-synthesis"] }
];

/* ============================================================
   GRADING SKELETON
   All weights are PLACEHOLDERS. The categories are chosen to work
   without the instructor present, which is the async constraint.
   ============================================================ */

/* Credit model. BIO 005 is 4 units: 3 lecture plus 1 lab.
   Title 5 standard, 54 student hours per unit:
     lecture contact  3 x 1 x 18 =  54 hours
     lecture outside  3 x 2 x 18 = 108 hours
     lab contact      1 x 3 x 18 =  54 hours
                                   ---------
                                   216 hours
   Over this 15 week term that is 14.4 hours per week: 3.6 lecture
   equivalent, 3.6 lab, 7.2 outside work. The steps above total 864
   minutes, which is that 14.4 hours exactly. Only 632 of those minutes
   are assigned work. The remaining 232 are genuine independent study,
   and the syllabus has to say so rather than pretend the week is
   lighter than the units require.

   FLAG: lab time has elsewhere been described as 6 to 8 hours a week.
   One lab unit funds 3.6. Confirm against the course outline of record. */
window.BIO005_CREDIT = {
  units: 4, lectureUnits: 3, labUnits: 1,
  semesterHours: 216, weeks: 15, hoursPerWeek: 14.4,
  lectureEquivalent: 3.6, lab: 3.6, outsideWork: 7.2,
  assignedMinutes: 632, independentStudyMinutes: 232, totalMinutes: 864
};


window.BIO005_GRADING = {
  status: 'GRADE MODEL OF RECORD, corrected Sep 7 2026 against the published ' +
          'syllabus-fall2026.html and how-grading-works.html. Four categories, two midterms. ' +
          'THE PREVIOUS CONTENT OF THIS BLOCK WAS WRONG: it called itself the model of record ' +
          'while carrying the retired five component model, note sheets 20, midterms 40, lab 15, ' +
          'book problems 15, discussions 10. Nothing reads this object today, which is the only ' +
          'reason no page repeated those numbers to a student.',
  note:   'Sorted by weight. The note sheets, the practice items, the book problems and the ' +
          'Mastery Check carry no points at all, on purpose: they are where a student finds out ' +
          'what they do not know, and grading them rewards looking finished over being honest.',
  categories: [
    { key:'exams',       name:'Show Me What You Know', weight:35, n:2,
      ai:'closed', note:'Two midterms, 17.5 percent each. Draw a physiological pathway and teach it ' +
                        'on video, out loud, no notes.' },
    { key:'lab',         name:'Investigate It', weight:25, n:15,
      ai:'open for setup, closed for interpretation',
      note:'The weekly labs, written up as question, prediction, evidence, interpretation, conclusion. ' +
           'Where a week uses PhysioEx it must show complete in Pearson, and the points live on the worksheet.' },
    { key:'apply',       name:'Use It', weight:25, n:15,
      ai:'open, with disclosure',
      note:'20 percent: the weekly application case, chosen from three or four set in different rooms, ' +
           'turned in each Sunday. 5 percent: the patient chart, kept by hand all term and turned in once, ' +
           'Wed Dec 16, as the capstone. Weekly chart work is expected but not collected.' },
    { key:'discussions', name:'Think About It', weight:15, n:15,
      ai:'closed',
      note:'One post a week carrying the physiology and the thinking about it together. Initial post ' +
           'Friday 10:00 pm, replies Sunday 10:00 pm.' }
  ],
  ungraded: [
    'Competency note sheets', 'Retrieval practice', 'Practice items',
    'Book problems', 'Mastery Check', 'Weekly practice log'
  ],
  exams: [
    { n:1, covers:[1,2,3,4,5,6,7],       opens:'2026-10-26', closes:'2026-10-28', weight:17.5 },
    { n:2, covers:[8,9,10,11,12,13,14],  opens:'2026-12-14', closes:'2026-12-16', weight:17.5 }
  ],
  retired: 'Retired as of Sep 7 2026: three midterms covering 1-5, 6-10 and 11-15; five unit exams; ' +
           'the Aug 23 categories; and the five component model with graded note sheets and book ' +
           'problems. Week 15 is not on an exam; it closes with the synthesis work.'
};
/* ============================================================
   OPEN DECISIONS THAT CHANGE THE SCHEDULE
   These are the ones that would force a rebuild if answered late.
   ============================================================ */

window.BIO005_OPEN_DECISIONS = [
  { id:'exam-proctoring',
    q:'Does Yuba DE policy or nursing articulation require proctored assessment?',
    affects:'Gates the entire assessment model. If yes, the model of record is moot and you build to the requirement.' },
  { id:'lab-percentage',
    q:'Does Yuba require a separately stated lab percentage?',
    affects:'If yes it is the 20 points on the weekly lab exercise and nothing changes.' },
  { id:'lab-hours',
    q:'Lab has been described at 6 to 8 hours a week. One lab unit funds 3.6. Which is right?',
    affects:'The syllabus hours statement and the DE addendum.' },
  { id:'holidays',
    q:'Confirm Yuba observed holidays: Veterans Day Nov 11, Thanksgiving Nov 26 to 27.',
    affects:'Weeks 10 and 12 as coded.' },
  { id:'cadence',
    q:'Monday to Sunday, as coded, or the Friday to Friday cadence you were considering?',
    affects:'Every week boundary and all fifteen sets of dates. Decide before the schedule page goes to students.' },
  { id:'week-one-page',
    q:'week-01.html or week-01-foundations.html. Two Week 1 pages exist.',
    affects:'Which page welcome.html links to.' }
];
