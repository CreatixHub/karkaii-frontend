export type LessonStatus = 'Published' | 'In Review' | 'Draft' | 'Archived';

export type LessonCategory = 'core' | 'elective';

export type LayoutView = 'grid' | 'list';

/** The nine dialogs of L2227–2400, normalised off their template ids. */
export type LessonModalId =
  | 'add'
  | 'edit'
  | 'details'
  | 'addActivity'
  | 'addResource'
  | 'assignTeacher'
  | 'publish'
  | 'import'
  | 'delete';

/** The eight `#lp_struct` accordion panels of L2104–2135, in the template's order. */
export type StructureKey =
  | 'intro'
  | 'objectives'
  | 'materials'
  | 'classroom'
  | 'practical'
  | 'assessment'
  | 'homework'
  | 'reflection';

export interface MethodBadge {
  label: string;
  badgeClass: string;
}

export interface TimelineEntry {
  /** Matches a `timelineStages` title — that is where the icon and tone come from. */
  stage: string;
  minutes: number;
  note: string;
}

export interface LessonResource {
  name: string;
  /** "1.8 MB · PDF" — size and kind, as the template writes it. */
  meta: string;
  icon: string;
  tone: string;
  /** The first action button; links and video open rather than preview. */
  openIcon: string;
  openLabel: string;
  /** External links carry no download button in the template. */
  downloadable: boolean;
}

export interface LessonPlan {
  id: string;
  /** Derived: the template prints `LP-2025-0031` for the first plan only. */
  code: string;
  title: string;
  subject: string;
  grade: string;
  /** "A" — what the toolbar's Class facet compares against. */
  classLetter: string;
  /** "Sec A" — the card meta line. */
  sectionLabel: string;
  /** "Section A" — the modals' spelling. */
  className: string;
  /** Morning / Afternoon — the toolbar's Section facet. */
  daypart: string;
  teacher: string;
  /** Minutes; the cards render it as "45 min", the panel as "45 Minutes". */
  duration: number;
  week: string;
  weekNumber: number;
  /** Derived from the week, on the Term 1 calendar the date filter is captioned with. */
  scheduledOn: string;
  year: string;
  term: string;
  planType: string;
  category: LessonCategory;
  typeLabel: string;
  status: LessonStatus;
  statusBadge: string;
  icon: string;
  tone: string;
  percent: number;
  barClass: string;
  objectives: number;
  activities: number;
  resourceCount: number;
  teachingMethod: string;
  homeworkStatus: string;
  updated: string;
  summary: string;
  methods: MethodBadge[];
  homeworkNote: string;
  notes: string;
  structure: Record<StructureKey, string>;
  /** Six subtitles, one per card of the Goals tab. */
  goals: string[];
  /** Seven entries, one per stage of the Flow tab. */
  timeline: TimelineEntry[];
  resources: LessonResource[];
  /** Lower-cased haystack the toolbar search matches against. */
  search: string;
}

const rawPlans: Omit<LessonPlan, 'search'>[] = [
  {
    id: 'lp_1',
    code: 'LP-2025-0031',
    title: 'Introduction to Algebra',
    subject: 'Mathematics',
    grade: 'Grade 10',
    classLetter: 'A',
    sectionLabel: 'Sec A',
    className: 'Section A',
    daypart: 'Morning',
    teacher: 'Grace Lee',
    duration: 45,
    week: 'Week 3',
    weekNumber: 3,
    scheduledOn: '2024/07/15',
    year: '2024 / 2025',
    term: 'Term 1',
    planType: 'Weekly Plans',
    category: 'core',
    typeLabel: 'Core',
    status: 'Published',
    statusBadge: 'badge-soft-success',
    icon: 'ti ti-math',
    tone: 'primary',
    percent: 72,
    barClass: 'bg-success',
    objectives: 5,
    activities: 6,
    resourceCount: 4,
    teachingMethod: 'Inquiry-based',
    homeworkStatus: 'Assigned',
    updated: '2h ago',
    summary:
      'This lesson introduces the fundamentals of algebra including variables, expressions and simple equations, building a foundation for problem solving.',
    methods: [
      { label: 'Inquiry-based', badgeClass: 'badge-soft-primary' },
      { label: 'Collaborative', badgeClass: 'badge-soft-info' },
      { label: 'Problem Solving', badgeClass: 'badge-soft-secondary' },
    ],
    homeworkNote:
      'Complete Exercise 3.1 (Q1–Q10) and prepare a short note on real-life uses of variables.',
    notes:
      'Keep worked examples visual; pair weaker students with peers during the group activity.',
    structure: {
      intro:
        'Recap of prior knowledge and a hook question to spark curiosity about patterns and unknowns.',
      objectives: 'Define a variable, form simple expressions and evaluate them for given values.',
      materials: 'Whiteboard, projector slides, algebra tiles and the printed worksheet set.',
      classroom: 'Guided examples on the board followed by think-pair-share on expression building.',
      practical: 'Hands-on algebra tiles to model expressions in small groups.',
      assessment: 'Exit ticket with three evaluation questions to check understanding.',
      homework: 'Exercise 3.1 (Q1–Q10) with a short reflective note.',
      reflection: 'What worked, misconceptions observed and adjustments for the next session.',
    },
    goals: [
      'Understand variables',
      'Build expressions',
      'Model with tiles',
      'Reason with unknowns',
      'Peer problem solving',
      'Rubric-based scoring',
    ],
    timeline: [
      { stage: 'Warm-up', minutes: 5, note: 'Quick recap quiz' },
      { stage: 'Introduction', minutes: 5, note: 'Hook question' },
      { stage: 'Main Activity', minutes: 15, note: 'Guided examples' },
      { stage: 'Group Activity', minutes: 8, note: 'Think-pair-share' },
      { stage: 'Practical Session', minutes: 7, note: 'Algebra tiles' },
      { stage: 'Assessment', minutes: 3, note: 'Exit ticket' },
      { stage: 'Homework', minutes: 2, note: 'Assign Exercise 3.1' },
    ],
    resources: [
      {
        name: 'Algebra Basics.pdf',
        meta: '1.8 MB · PDF',
        icon: 'ti ti-file-type-pdf',
        tone: 'danger',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Intro Slides.pptx',
        meta: '4.2 MB · PowerPoint',
        icon: 'ti ti-file-type-ppt',
        tone: 'warning',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Worksheet 3.1.docx',
        meta: '320 KB · Word',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Variables Explained.mp4',
        meta: '86 MB · Video',
        icon: 'ti ti-video',
        tone: 'primary',
        openIcon: 'ti ti-player-play',
        openLabel: 'Open',
        downloadable: true,
      },
      {
        name: 'Khan Academy · Algebra',
        meta: 'External Link',
        icon: 'ti ti-link',
        tone: 'success',
        openIcon: 'ti ti-external-link',
        openLabel: 'Open',
        downloadable: false,
      },
    ],
  },
  {
    id: 'lp_2',
    code: 'LP-2025-0032',
    title: 'Forces and Motion',
    subject: 'Physics',
    grade: 'Grade 11',
    classLetter: 'B',
    sectionLabel: 'Sec B',
    className: 'Section B',
    daypart: 'Afternoon',
    teacher: 'Hassan Ali',
    duration: 50,
    week: 'Week 4',
    weekNumber: 4,
    scheduledOn: '2024/07/22',
    year: '2024 / 2025',
    term: 'Term 1',
    planType: 'Weekly Plans',
    category: 'core',
    typeLabel: 'Core',
    status: 'Draft',
    statusBadge: 'badge-soft-secondary',
    icon: 'ti ti-atom',
    tone: 'info',
    percent: 40,
    barClass: 'bg-warning',
    objectives: 4,
    activities: 5,
    resourceCount: 3,
    teachingMethod: 'Inquiry-based',
    homeworkStatus: 'Assigned',
    updated: '5h ago',
    summary:
      'This lesson builds on everyday experience of movement to introduce Newton’s laws, balanced and unbalanced forces, and the acceleration that follows from them.',
    methods: [
      { label: 'Inquiry-based', badgeClass: 'badge-soft-primary' },
      { label: 'Experimental', badgeClass: 'badge-soft-info' },
      { label: 'Problem Solving', badgeClass: 'badge-soft-secondary' },
    ],
    homeworkNote:
      'Complete problem set 4.2 (Q1–Q8) and write a one-paragraph prediction for the next experiment.',
    notes: 'Check the ticker-tape timers before the bell; two of them jammed last session.',
    structure: {
      intro:
        'Quick demonstration of a rolling trolley to surface everyday ideas about push, pull and motion.',
      objectives:
        'State Newton’s three laws and identify the balanced and unbalanced forces acting on a body.',
      materials: 'Dynamics trolley, spring balance, ticker-tape timer and the projector slide deck.',
      classroom: 'Board derivation of force, mass and acceleration followed by free-body diagrams.',
      practical: 'Trolley and pulley experiment measuring acceleration against added mass.',
      assessment: 'Three-question exit ticket on identifying the net force in given scenarios.',
      homework: 'Problem set 4.2 (Q1–Q8) plus a written prediction for the next experiment.',
      reflection: 'Which misconceptions about friction persisted and how to reframe them next week.',
    },
    goals: [
      'Explain the three laws',
      'Draw free-body diagrams',
      'Run the trolley experiment',
      'Predict the outcome',
      'Work in lab pairs',
      'Practical write-up',
    ],
    timeline: [
      { stage: 'Warm-up', minutes: 5, note: 'Rolling trolley demo' },
      { stage: 'Introduction', minutes: 5, note: 'What forces are at play' },
      { stage: 'Main Activity', minutes: 15, note: 'Deriving force and acceleration' },
      { stage: 'Group Activity', minutes: 8, note: 'Free-body diagram pairs' },
      { stage: 'Practical Session', minutes: 12, note: 'Trolley and pulley run' },
      { stage: 'Assessment', minutes: 3, note: 'Exit ticket' },
      { stage: 'Homework', minutes: 2, note: 'Assign problem set 4.2' },
    ],
    resources: [
      {
        name: 'Newton’s Laws.pdf',
        meta: '2.4 MB · PDF',
        icon: 'ti ti-file-type-pdf',
        tone: 'danger',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Trolley Experiment.docx',
        meta: '280 KB · Word',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'PhET · Forces and Motion',
        meta: 'External Link',
        icon: 'ti ti-link',
        tone: 'success',
        openIcon: 'ti ti-external-link',
        openLabel: 'Open',
        downloadable: false,
      },
    ],
  },
  {
    id: 'lp_3',
    code: 'LP-2025-0033',
    title: 'Creative Writing',
    subject: 'English',
    grade: 'Grade 9',
    classLetter: 'A',
    sectionLabel: 'Sec A',
    className: 'Section A',
    daypart: 'Morning',
    teacher: 'Olivia Park',
    duration: 40,
    week: 'Week 2',
    weekNumber: 2,
    scheduledOn: '2024/07/08',
    year: '2024 / 2025',
    term: 'Term 1',
    planType: 'Weekly Plans',
    category: 'core',
    typeLabel: 'Core',
    status: 'Published',
    statusBadge: 'badge-soft-success',
    icon: 'ti ti-book',
    tone: 'success',
    percent: 88,
    barClass: 'bg-success',
    objectives: 6,
    activities: 4,
    resourceCount: 5,
    teachingMethod: 'Inquiry-based',
    homeworkStatus: 'Assigned',
    updated: '1d ago',
    summary:
      'This lesson works on narrative openings: how a first paragraph establishes character, setting and tone, and how redrafting sharpens all three.',
    methods: [
      { label: 'Modelled Writing', badgeClass: 'badge-soft-primary' },
      { label: 'Collaborative', badgeClass: 'badge-soft-info' },
      { label: 'Peer Review', badgeClass: 'badge-soft-secondary' },
    ],
    homeworkNote:
      'Extend the opening to 300 words and annotate three choices made about voice or pace.',
    notes: 'Read two openings aloud at the end — hearing them lands better than marking them.',
    structure: {
      intro: 'A one-minute free write from a picture prompt to warm up voice and imagination.',
      objectives: 'Craft an opening paragraph that establishes character, setting and tone.',
      materials: 'Prompt cards, sample extracts, writing journals and the shared feedback rubric.',
      classroom: 'Modelled writing on the board, then paired reading of each other’s openings.',
      practical: 'Redraft the opening twice, changing the narrator’s point of view each time.',
      assessment: 'Peer review against the rubric with two stars and a wish per piece.',
      homework: 'Extend the opening to 300 words and annotate the choices made.',
      reflection: 'Which prompts unlocked the strongest writing and which fell flat.',
    },
    goals: [
      'Recognise narrative voice',
      'Shape an opening',
      'Redraft twice',
      'Justify word choice',
      'Paired critique',
      'Rubric-based scoring',
    ],
    timeline: [
      { stage: 'Warm-up', minutes: 4, note: 'Picture-prompt free write' },
      { stage: 'Introduction', minutes: 4, note: 'Reading a model opening' },
      { stage: 'Main Activity', minutes: 12, note: 'Modelled writing' },
      { stage: 'Group Activity', minutes: 8, note: 'Paired read-aloud' },
      { stage: 'Practical Session', minutes: 8, note: 'Point-of-view redraft' },
      { stage: 'Assessment', minutes: 2, note: 'Two stars and a wish' },
      { stage: 'Homework', minutes: 2, note: 'Assign the 300-word extension' },
    ],
    resources: [
      {
        name: 'Opening Lines Pack.pdf',
        meta: '900 KB · PDF',
        icon: 'ti ti-file-type-pdf',
        tone: 'danger',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Narrative Voice.pptx',
        meta: '3.1 MB · PowerPoint',
        icon: 'ti ti-file-type-ppt',
        tone: 'warning',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Writing Rubric.docx',
        meta: '180 KB · Word',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Show Don’t Tell.mp4',
        meta: '42 MB · Video',
        icon: 'ti ti-video',
        tone: 'primary',
        openIcon: 'ti ti-player-play',
        openLabel: 'Open',
        downloadable: true,
      },
      {
        name: 'BBC Bitesize · Creative Writing',
        meta: 'External Link',
        icon: 'ti ti-link',
        tone: 'success',
        openIcon: 'ti ti-external-link',
        openLabel: 'Open',
        downloadable: false,
      },
    ],
  },
  {
    id: 'lp_4',
    code: 'LP-2025-0034',
    title: 'Cell Biology',
    subject: 'Biology',
    grade: 'Grade 11',
    classLetter: 'A',
    sectionLabel: 'Sec A',
    className: 'Section A',
    daypart: 'Morning',
    teacher: 'Rohan Das',
    duration: 45,
    week: 'Week 5',
    weekNumber: 5,
    scheduledOn: '2024/07/29',
    year: '2024 / 2025',
    term: 'Term 1',
    planType: 'Weekly Plans',
    category: 'core',
    typeLabel: 'Core',
    status: 'In Review',
    statusBadge: 'badge-soft-warning',
    icon: 'ti ti-dna',
    tone: 'teal',
    percent: 55,
    barClass: 'bg-warning',
    objectives: 5,
    activities: 6,
    resourceCount: 4,
    teachingMethod: 'Inquiry-based',
    homeworkStatus: 'Assigned',
    updated: '2d ago',
    summary:
      'This lesson maps the major organelles of plant and animal cells and links each structure to the job it does, ending with a prepared slide of the students’ own.',
    methods: [
      { label: 'Inquiry-based', badgeClass: 'badge-soft-primary' },
      { label: 'Practical', badgeClass: 'badge-soft-info' },
      { label: 'Visual Learning', badgeClass: 'badge-soft-secondary' },
    ],
    homeworkNote: 'Complete the organelle function table and read pages 88–92 of the textbook.',
    notes: 'Pre-cut the onion samples — slide preparation ran ten minutes over last time.',
    structure: {
      intro: 'Recap of last week’s microscope skills and a puzzle image of an unknown cell.',
      objectives: 'Label the major organelles and explain how each structure supports its function.',
      materials: 'Light microscopes, prepared slides, onion samples, stains and the label worksheet.',
      classroom:
        'Guided annotation of a plant and an animal cell, then a compare-and-contrast table.',
      practical: 'Prepare and stain an onion epidermis slide, then sketch what is observed.',
      assessment: 'Labelled diagram checked against the mark scheme before the bell.',
      homework: 'Organelle function table plus the assigned reading.',
      reflection: 'Slide preparation was slow — pre-cut samples for the parallel section.',
    },
    goals: [
      'Name the organelles',
      'Prepare a slide',
      'Stain and sketch',
      'Link structure to function',
      'Work with a bench partner',
      'Diagram accuracy',
    ],
    timeline: [
      { stage: 'Warm-up', minutes: 5, note: 'Microscope skills recap' },
      { stage: 'Introduction', minutes: 4, note: 'Unknown cell puzzle' },
      { stage: 'Main Activity', minutes: 14, note: 'Annotating both cell types' },
      { stage: 'Group Activity', minutes: 7, note: 'Compare-and-contrast table' },
      { stage: 'Practical Session', minutes: 10, note: 'Onion slide preparation' },
      { stage: 'Assessment', minutes: 3, note: 'Diagram check' },
      { stage: 'Homework', minutes: 2, note: 'Assign the organelle table' },
    ],
    resources: [
      {
        name: 'Cell Structures.pdf',
        meta: '2.2 MB · PDF',
        icon: 'ti ti-file-type-pdf',
        tone: 'danger',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Microscope Slides.pptx',
        meta: '5.6 MB · PowerPoint',
        icon: 'ti ti-file-type-ppt',
        tone: 'warning',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Organelle Table.docx',
        meta: '240 KB · Word',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Onion Cell Prep.mp4',
        meta: '64 MB · Video',
        icon: 'ti ti-video',
        tone: 'primary',
        openIcon: 'ti ti-player-play',
        openLabel: 'Open',
        downloadable: true,
      },
    ],
  },
  {
    id: 'lp_5',
    code: 'LP-2025-0035',
    title: 'Introduction to Python',
    subject: 'Computer Science',
    grade: 'Grade 10',
    classLetter: 'B',
    sectionLabel: 'Sec B',
    className: 'Section B',
    daypart: 'Afternoon',
    teacher: 'Ivy Chen',
    duration: 60,
    week: 'Week 1',
    weekNumber: 1,
    scheduledOn: '2024/07/01',
    year: '2024 / 2025',
    term: 'Term 1',
    planType: 'Weekly Plans',
    category: 'elective',
    typeLabel: 'Elective',
    status: 'Draft',
    statusBadge: 'badge-soft-secondary',
    icon: 'ti ti-code',
    tone: 'warning',
    percent: 30,
    barClass: 'bg-danger',
    objectives: 4,
    activities: 5,
    resourceCount: 6,
    teachingMethod: 'Inquiry-based',
    homeworkStatus: 'Assigned',
    updated: '3d ago',
    summary:
      'This lesson gets every student running their first Python program — variables, input and formatted output — and finishes with a small unit converter built in the lab.',
    methods: [
      { label: 'Live Coding', badgeClass: 'badge-soft-primary' },
      { label: 'Collaborative', badgeClass: 'badge-soft-info' },
      { label: 'Project-based', badgeClass: 'badge-soft-secondary' },
    ],
    homeworkNote: 'Finish the unit converter and add one extra unit of your own choosing.',
    notes: 'Open the starter notebook on every machine before the class arrives.',
    structure: {
      intro: 'Show a five-line program that does something surprising, then ask how it works.',
      objectives: 'Write and run a program that uses variables, input and formatted output.',
      materials: 'Lab machines with Python 3, the starter notebook and a printed syntax card.',
      classroom: 'Live coding on the projector with students typing along on their own machines.',
      practical: 'Lab task — build a small unit converter and test it against three inputs.',
      assessment: 'Automated checks on the converter plus a short trace-the-code quiz.',
      homework: 'Finish the converter and add one extra unit.',
      reflection: 'Setup ate ten minutes — pre-open the notebook on every machine next time.',
    },
    goals: [
      'Read simple code',
      'Write a first program',
      'Run it in the lab',
      'Trace and debug',
      'Pair programming',
      'Automated tests',
    ],
    timeline: [
      { stage: 'Warm-up', minutes: 5, note: 'Surprising five-line program' },
      { stage: 'Introduction', minutes: 5, note: 'How does it work' },
      { stage: 'Main Activity', minutes: 18, note: 'Live coding along' },
      { stage: 'Group Activity', minutes: 8, note: 'Pair the converter design' },
      { stage: 'Practical Session', minutes: 18, note: 'Lab build and test' },
      { stage: 'Assessment', minutes: 4, note: 'Trace-the-code quiz' },
      { stage: 'Homework', minutes: 2, note: 'Assign the extra unit' },
    ],
    resources: [
      {
        name: 'Python Syntax Card.pdf',
        meta: '640 KB · PDF',
        icon: 'ti ti-file-type-pdf',
        tone: 'danger',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Starter Notebook.ipynb',
        meta: '120 KB · Notebook',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Lesson Slides.pptx',
        meta: '2.8 MB · PowerPoint',
        icon: 'ti ti-file-type-ppt',
        tone: 'warning',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Unit Converter Brief.docx',
        meta: '210 KB · Word',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'First Program Walkthrough.mp4',
        meta: '58 MB · Video',
        icon: 'ti ti-video',
        tone: 'primary',
        openIcon: 'ti ti-player-play',
        openLabel: 'Open',
        downloadable: true,
      },
      {
        name: 'Python Docs · Getting Started',
        meta: 'External Link',
        icon: 'ti ti-link',
        tone: 'success',
        openIcon: 'ti ti-external-link',
        openLabel: 'Open',
        downloadable: false,
      },
    ],
  },
  {
    id: 'lp_6',
    code: 'LP-2025-0036',
    title: 'World War II',
    subject: 'History',
    grade: 'Grade 12',
    classLetter: 'A',
    sectionLabel: 'Sec A',
    className: 'Section A',
    daypart: 'Morning',
    teacher: 'Liam Scott',
    duration: 45,
    week: 'Week 6',
    weekNumber: 6,
    scheduledOn: '2024/08/05',
    year: '2024 / 2025',
    term: 'Term 1',
    planType: 'Weekly Plans',
    category: 'elective',
    typeLabel: 'Elective',
    status: 'Draft',
    statusBadge: 'badge-soft-secondary',
    icon: 'ti ti-clock-hour-4',
    tone: 'danger',
    percent: 12,
    barClass: 'bg-danger',
    objectives: 5,
    activities: 3,
    resourceCount: 4,
    teachingMethod: 'Inquiry-based',
    homeworkStatus: 'Assigned',
    updated: '4d ago',
    summary:
      'This lesson works through the causes of the war from the 1919 settlement onwards, and asks students to rank them and defend the order they chose.',
    methods: [
      { label: 'Source-based', badgeClass: 'badge-soft-primary' },
      { label: 'Discussion', badgeClass: 'badge-soft-info' },
      { label: 'Critical Thinking', badgeClass: 'badge-soft-secondary' },
    ],
    homeworkNote: 'Plan the causes essay using the frame and gather two supporting sources.',
    notes: 'Cap the ranking debate at ten minutes — it ran long with the parallel group.',
    structure: {
      intro: 'Timeline card sort covering 1919 to 1939 to surface what students already know.',
      objectives: 'Explain the main causes of the war and weigh their relative importance.',
      materials: 'Source pack, wall timeline, atlas maps and the essay planning frame.',
      classroom: 'Source analysis in fours, then a whole-class ranking of the causes on the board.',
      practical: 'Build an annotated wall timeline from the printed event cards.',
      assessment: 'Verbal justification of the ranking, marked against the reasoning ladder.',
      homework: 'Essay plan using the frame plus two gathered sources.',
      reflection: 'The ranking debate ran long — bank the extra time for the essay clinic.',
    },
    goals: [
      'Order the key events',
      'Analyse a source',
      'Build the timeline',
      'Weigh the causes',
      'Group ranking',
      'Reasoning ladder',
    ],
    timeline: [
      { stage: 'Warm-up', minutes: 6, note: 'Timeline card sort' },
      { stage: 'Introduction', minutes: 4, note: 'What caused it' },
      { stage: 'Main Activity', minutes: 12, note: 'Source analysis in fours' },
      { stage: 'Group Activity', minutes: 9, note: 'Ranking the causes' },
      { stage: 'Practical Session', minutes: 8, note: 'Wall timeline build' },
      { stage: 'Assessment', minutes: 4, note: 'Justify the ranking' },
      { stage: 'Homework', minutes: 2, note: 'Assign the essay plan' },
    ],
    resources: [
      {
        name: 'Causes of WWII.pdf',
        meta: '3.4 MB · PDF',
        icon: 'ti ti-file-type-pdf',
        tone: 'danger',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Source Pack.docx',
        meta: '460 KB · Word',
        icon: 'ti ti-file-type-doc',
        tone: 'info',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Timeline Slides.pptx',
        meta: '6.1 MB · PowerPoint',
        icon: 'ti ti-file-type-ppt',
        tone: 'warning',
        openIcon: 'ti ti-eye',
        openLabel: 'Preview',
        downloadable: true,
      },
      {
        name: 'Imperial War Museums · WWII',
        meta: 'External Link',
        icon: 'ti ti-link',
        tone: 'success',
        openIcon: 'ti ti-external-link',
        openLabel: 'Open',
        downloadable: false,
      },
    ],
  },
];

/** Everything the search box should match — the template had no `data-search` to copy. */
const buildSearch = (plan: Omit<LessonPlan, 'search'>): string =>
  [
    plan.title,
    plan.code,
    plan.subject,
    plan.grade,
    plan.sectionLabel,
    plan.teacher,
    plan.week,
    plan.status,
    plan.typeLabel,
    plan.term,
  ]
    .join(' ')
    .toLowerCase();

export const lessonPlans: LessonPlan[] = rawPlans.map((plan) => ({
  ...plan,
  search: buildSearch(plan),
}));

/* -------------------------------------------------------------------------- */
/*                          Detail panel scaffolding                          */
/* -------------------------------------------------------------------------- */

export interface StructureSection {
  key: StructureKey;
  title: string;
  icon: string;
}

/** `#lp_struct`, L2104–2135 — headings and icons are fixed, bodies come from the record. */
export const structureSections: StructureSection[] = [
  { key: 'intro', title: 'Introduction', icon: 'ti ti-flag' },
  { key: 'objectives', title: 'Learning Objectives', icon: 'ti ti-target' },
  { key: 'materials', title: 'Teaching Materials', icon: 'ti ti-books' },
  { key: 'classroom', title: 'Classroom Activities', icon: 'ti ti-users' },
  { key: 'practical', title: 'Practical Activities', icon: 'ti ti-flask' },
  { key: 'assessment', title: 'Assessment', icon: 'ti ti-clipboard-check' },
  { key: 'homework', title: 'Homework', icon: 'ti ti-notebook' },
  { key: 'reflection', title: 'Reflection', icon: 'ti ti-bulb' },
];

export interface GoalCard {
  title: string;
  icon: string;
  tone: string;
  /**
   * The template varies the heading level across these six cards (h3 … h6) and adds
   * `fw-medium` to the first two, so the class is carried rather than the tag.
   */
  headingClass: string;
}

/** The Goals tab, L2139–2146. */
export const goalCards: GoalCard[] = [
  { title: 'Knowledge Goals', icon: 'ti ti-bulb', tone: 'primary', headingClass: 'fs-13 mb-0 fw-medium' },
  { title: 'Skill Development', icon: 'ti ti-tool', tone: 'success', headingClass: 'fs-13 mb-0 fw-medium' },
  { title: 'Practical Learning', icon: 'ti ti-flask-2', tone: 'info', headingClass: 'fs-13 mb-0' },
  { title: 'Critical Thinking', icon: 'ti ti-brain', tone: 'warning', headingClass: 'fs-13 mb-0' },
  { title: 'Collaboration', icon: 'ti ti-users', tone: 'teal', headingClass: 'fs-13 mb-0' },
  { title: 'Assessment Criteria', icon: 'ti ti-clipboard-check', tone: 'danger', headingClass: 'fs-13 mb-0' },
];

export interface TimelineStage {
  title: string;
  icon: string;
  tone: string;
}

/** The Flow tab, L2158–2209 — seven stages, the last one drawn without a connector. */
export const timelineStages: TimelineStage[] = [
  { title: 'Warm-up', icon: 'ti ti-flame', tone: 'warning' },
  { title: 'Introduction', icon: 'ti ti-flag', tone: 'primary' },
  { title: 'Main Activity', icon: 'ti ti-presentation', tone: 'info' },
  { title: 'Group Activity', icon: 'ti ti-users', tone: 'teal' },
  { title: 'Practical Session', icon: 'ti ti-flask', tone: 'success' },
  { title: 'Assessment', icon: 'ti ti-clipboard-check', tone: 'danger' },
  { title: 'Homework', icon: 'ti ti-notebook', tone: 'secondary' },
];

export type DetailTabId = 'overview' | 'structure' | 'goals' | 'files' | 'flow';

export interface DetailTab {
  id: DetailTabId;
  label: string;
  /** The template's own pane id, kept so the markup still reads like the source. */
  paneId: string;
}

/** The five nav-pills of L2077–2083. */
export const detailTabs: DetailTab[] = [
  { id: 'overview', label: 'Overview', paneId: 'lp_ov' },
  { id: 'structure', label: 'Structure', paneId: 'lp_str' },
  { id: 'goals', label: 'Goals', paneId: 'lp_obj' },
  { id: 'files', label: 'Files', paneId: 'lp_res' },
  { id: 'flow', label: 'Flow', paneId: 'lp_tl' },
];

/* -------------------------------------------------------------------------- */
/*                                   Actions                                  */
/* -------------------------------------------------------------------------- */

export interface LessonAction {
  id: string;
  label: string;
  icon: string;
  modal?: LessonModalId;
  danger?: boolean;
  /** Renders a `<hr class="dropdown-divider">` above the entry. */
  divider?: boolean;
}

/** The kebab menu shared by every grid card and list row, L1653. */
export const cardMenuItems: LessonAction[] = [
  { id: 'view', label: 'View', icon: 'ti ti-eye', modal: 'details' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', modal: 'assignTeacher' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-discount', modal: 'publish', divider: true },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

/** The detail panel's quick-action row, L2058–2066. */
export const detailActions: LessonAction[] = [
  { id: 'view', label: 'View', icon: 'ti ti-eye', modal: 'details' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'assign_class', label: 'Assign Class', icon: 'ti ti-users', modal: 'assignTeacher' },
  { id: 'assign_teacher', label: 'Assign Teacher', icon: 'ti ti-user-plus', modal: 'assignTeacher' },
  { id: 'publish', label: 'Publish', icon: 'ti ti-discount', modal: 'publish' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'download', label: 'Download PDF', icon: 'ti ti-download' },
];

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                  */
/* -------------------------------------------------------------------------- */

export type ToolbarMenu = 'filters' | 'sort' | 'views' | 'export' | null;

export type FilterKey =
  | 'year'
  | 'grade'
  | 'class'
  | 'section'
  | 'subject'
  | 'teacher'
  | 'status'
  | 'lessonType'
  | 'week'
  | 'dateRange';

export interface FilterField {
  key: FilterKey;
  label: string;
  /** Prefixed with the page slug: the bare template ids collide across pages in one SPA. */
  domId: string;
  options: string[];
  /** The template gives every facet but Academic Year an `<option value="">All</option>`. */
  includeAll: boolean;
}

/** The filter menu of L1490–1501; Date Range is rendered separately as a range picker. */
export const advancedFilters: FilterField[] = [
  { key: 'year', label: 'Academic Year', domId: 'lp-academic-year', options: ['2024 / 2025', '2023 / 2024'], includeAll: false },
  { key: 'grade', label: 'Grade', domId: 'lp-grade', options: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'], includeAll: true },
  { key: 'class', label: 'Class', domId: 'lp-class', options: ['A', 'B'], includeAll: true },
  { key: 'section', label: 'Section', domId: 'lp-section', options: ['Morning', 'Afternoon'], includeAll: true },
  { key: 'subject', label: 'Subject', domId: 'lp-subject', options: ['Mathematics', 'Physics', 'English', 'Biology'], includeAll: true },
  { key: 'teacher', label: 'Teacher', domId: 'lp-teacher', options: ['Grace Lee', 'Hassan Ali', 'Olivia Park'], includeAll: true },
  { key: 'status', label: 'Status', domId: 'lp-status', options: ['Published', 'In Review', 'Draft', 'Archived'], includeAll: true },
  { key: 'lessonType', label: 'Lesson Type', domId: 'lp-lesson-type', options: ['Core', 'Elective'], includeAll: true },
  { key: 'week', label: 'Week', domId: 'lp-week', options: ['Week 1', 'Week 2', 'Week 3'], includeAll: true },
];

/** The chip row of L1541–1547; the label prefix per facet. */
export const filterChipLabels: Record<FilterKey, string> = {
  year: 'Academic Year',
  grade: 'Grade',
  class: 'Class',
  section: 'Section',
  subject: 'Subject',
  teacher: 'Teacher',
  status: 'Status',
  lessonType: 'Lesson Type',
  week: 'Week',
  dateRange: 'Date Range',
};

/** The template colours the first three chips primary / info / success. */
export const filterChipTones: Partial<Record<FilterKey | 'term', string>> = {
  year: 'primary',
  status: 'success',
  term: 'info',
};

export type SortKey = 'title' | 'week' | 'completion' | 'recent';

export interface SortOption {
  id: SortKey;
  label: string;
  icon: string;
}

/** The Sort menu of L1507–1513. */
export const sortOptions: SortOption[] = [
  { id: 'title', label: 'Title (A–Z)', icon: 'ti ti-abc' },
  { id: 'week', label: 'Week', icon: 'ti ti-calendar-week' },
  { id: 'completion', label: 'Completion', icon: 'ti ti-progress' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

export type SavedViewId = 'all' | 'published' | 'drafts';

export interface SavedView {
  id: SavedViewId;
  label: string;
  icon: string;
}

/** The Saved Views menu of L1517–1524. */
export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Lessons', icon: 'ti ti-layout-grid' },
  { id: 'published', label: 'Published', icon: 'ti ti-discount' },
  { id: 'drafts', label: 'My Drafts', icon: 'ti ti-pencil' },
];

export interface ExportAction {
  id: string;
  label: string;
  icon: string;
}

/** The export menu of L1535. */
export const exportActions: ExportAction[] = [
  { id: 'pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
];

/* -------------------------------------------------------------------------- */
/*                                 Filter rail                                */
/* -------------------------------------------------------------------------- */

export type RailGroupKey =
  | 'year'
  | 'term'
  | 'grade'
  | 'class'
  | 'daypart'
  | 'subject'
  | 'category'
  | 'planType'
  | 'library';

export interface RailItem {
  id: string;
  label: string;
  icon: string;
  /** Grade, category and library entries carry a live count badge. */
  badgeClass?: string;
}

export interface RailGroup {
  key: RailGroupKey;
  title: string;
  /** The template opens the rail with an `h5` and continues with `h6`s. */
  headingTag: 'h5' | 'h6';
  items: RailItem[];
  /**
   * Year, Term and Lesson Categories behave like radios in the template — one is always
   * `.active`. The rest toggle off when the active entry is clicked again.
   */
  required: boolean;
}

/** The `#lp_left` rail, L1560–1631. */
export const railGroups: RailGroup[] = [
  {
    key: 'year',
    title: 'Academic Year',
    headingTag: 'h5',
    required: true,
    items: [
      { id: '2024 / 2025', label: '2024 / 2025', icon: 'ti ti-calendar-star' },
      { id: '2023 / 2024', label: '2023 / 2024', icon: 'ti ti-calendar' },
    ],
  },
  {
    key: 'term',
    title: 'Terms',
    headingTag: 'h6',
    required: true,
    items: [
      { id: 'Term 1', label: 'Term 1', icon: 'ti ti-calendar-event' },
      { id: 'Term 2', label: 'Term 2', icon: 'ti ti-calendar-event' },
      { id: 'Term 3', label: 'Term 3', icon: 'ti ti-calendar-event' },
    ],
  },
  {
    key: 'grade',
    title: 'Grade',
    headingTag: 'h6',
    required: false,
    items: [
      { id: 'Grade 9', label: 'Grade 9', icon: 'ti ti-number-9-small', badgeClass: 'badge-soft-secondary' },
      { id: 'Grade 10', label: 'Grade 10', icon: 'ti ti-number-0', badgeClass: 'badge-soft-secondary' },
      { id: 'Grade 11', label: 'Grade 11', icon: 'ti ti-number-1', badgeClass: 'badge-soft-secondary' },
      { id: 'Grade 12', label: 'Grade 12', icon: 'ti ti-number-2', badgeClass: 'badge-soft-secondary' },
    ],
  },
  {
    key: 'class',
    title: 'Class',
    headingTag: 'h6',
    required: false,
    items: [
      { id: 'A', label: 'Section A', icon: 'ti ti-users-group' },
      { id: 'B', label: 'Section B', icon: 'ti ti-users-group' },
    ],
  },
  {
    key: 'daypart',
    title: 'Section',
    headingTag: 'h6',
    required: false,
    items: [
      { id: 'Morning', label: 'Morning', icon: 'ti ti-sun' },
      { id: 'Afternoon', label: 'Afternoon', icon: 'ti ti-sunset' },
    ],
  },
  {
    key: 'subject',
    title: 'Subject',
    headingTag: 'h6',
    required: false,
    items: [
      { id: 'Mathematics', label: 'Mathematics', icon: 'ti ti-math' },
      { id: 'Physics', label: 'Physics', icon: 'ti ti-atom' },
      { id: 'English', label: 'English', icon: 'ti ti-book' },
      { id: 'Biology', label: 'Biology', icon: 'ti ti-dna' },
    ],
  },
  {
    key: 'category',
    title: 'Lesson Categories',
    headingTag: 'h6',
    required: true,
    items: [
      { id: 'all', label: 'All Lessons', icon: 'ti ti-stack-2', badgeClass: 'badge-soft-primary' },
      { id: 'core', label: 'Core', icon: 'ti ti-book-2', badgeClass: 'badge-soft-secondary' },
      { id: 'elective', label: 'Elective', icon: 'ti ti-bulb', badgeClass: 'badge-soft-secondary' },
    ],
  },
  {
    key: 'planType',
    title: 'Plan Type',
    headingTag: 'h6',
    required: false,
    items: [
      { id: 'Weekly Plans', label: 'Weekly Plans', icon: 'ti ti-calendar-week' },
      { id: 'Monthly Plans', label: 'Monthly Plans', icon: 'ti ti-calendar-month' },
    ],
  },
  {
    key: 'library',
    title: 'Library',
    headingTag: 'h6',
    required: false,
    items: [
      { id: 'saved', label: 'Saved Plans', icon: 'ti ti-bookmark', badgeClass: 'badge-soft-secondary' },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', badgeClass: 'badge-soft-secondary' },
      { id: 'published', label: 'Published Plans', icon: 'ti ti-discount', badgeClass: 'badge-soft-secondary' },
    ],
  },
];

/** The rail selections the page boots with — the `.active` entries of L1564–1613. */
export const initialRail: Partial<Record<RailGroupKey, string>> = {
  year: '2024 / 2025',
  term: 'Term 1',
  category: 'all',
};

/* -------------------------------------------------------------------------- */
/*                                   Toasts                                   */
/* -------------------------------------------------------------------------- */

/**
 * `lesson-planning.html` loads no page script and so ships no toast copy; this mirrors the
 * phrasing the other Academic workspaces use for the same actions.
 */
export const actionToasts: Record<string, string> = {
  refresh: 'Lesson plans refreshed.',
  view: 'Opening the lesson plan…',
  duplicate: 'Lesson plan duplicated as a draft.',
  archive: 'Lesson plan archived.',
  publish: 'Lesson plan published.',
  print: 'Sending the lesson plan to the printer…',
  download: 'PDF export queued for download.',
  assign_teacher: 'Teacher assignment opened for this lesson plan.',
  assign_class: 'Class assignment opened for this lesson plan.',
  apply_filters: 'Filters applied.',
  clear_filters: 'Filters cleared.',
  save_view: 'Current filters saved as a new view.',
  pdf: 'PDF export started — the file will download shortly.',
  excel: 'Excel export started — the file will download shortly.',
  preview: 'Opening the resource preview…',
  resource_download: 'Resource download started.',
  resource_open: 'Opening the resource in a new tab…',
  sample_template: 'Sample import template downloaded.',
  created: 'Lesson plan created.',
  updated: 'Lesson plan updated.',
  deleted: 'Lesson plan deleted.',
  activity_added: 'Activity added to the lesson flow.',
  resource_added: 'Resource added to the lesson plan.',
  assigned: 'Teacher and class assigned.',
  imported: 'Lesson plans imported.',
};
