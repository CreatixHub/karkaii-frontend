/* ------------------------------------------------------------------ *
 * The year this configuration describes                              *
 * ------------------------------------------------------------------ */

export const YEAR_LABEL = '2026 – 27';
export const YEAR_SHORT = '2026';
export const YEAR_TAIL = '–27';
export const RUN_DATE = '31 Jul 2026';
export const UPDATED_BY = 'Ms. Latha Rao';

export const WORKING_DAYS = 224;
export const DAYS_ELAPSED = 103;
export const STUDENTS_ENROLLED = 1428;
export const TEACHING_STAFF = 96;

/** Sections across all twelve grades. The trees below show twenty-one of them. */
export const TOTAL_SECTIONS = 38;
export const MAX_CLASS_SIZE = 40;

/** Entries on the audit register, of which the page prints eight. */
export const AUDIT_TOTAL = 164;

export const HERO_FACTS = [
  { label: 'Academic year', value: YEAR_LABEL, badge: 'Active' },
  { label: 'Current session', value: 'Term 2 · week 7 of 12' },
  { label: 'Curriculum', value: 'CBSE 2026 · adopted' },
  { label: 'Examination cycle', value: 'Pre-board · from 22 Sep' },
  { label: 'Last updated', value: `${RUN_DATE} · ${UPDATED_BY}` },
];

/* ------------------------------------------------------------------ *
 * The rows every card is built from                                  *
 * ------------------------------------------------------------------ */

export type RowKind = 'select' | 'input' | 'switch' | 'text';

export interface SettingRow {
  key: string;
  note: string;
  kind: RowKind;
  options?: string[];
  value?: string;
  on?: boolean;
}

export interface SettingCard {
  id: string;
  title: string;
  note: string;
  icon: string;
  /** Icon tone modifier: "is-alt", "is-watch", "is-pass" or none. */
  tone?: string;
  badge?: { tone: string; label: string };
  rows?: SettingRow[];
  /** Footer text where the template does not simply count the rows. */
  foot?: string;
  /** Footer button label; the template says "Open" almost everywhere. */
  action?: string;
}

/** What a card's footer says when the template just counts its rows. */
export const settingsLabelOf = (card: SettingCard) => {
  const count = card.rows?.length ?? 0;
  return `${count} ${count === 1 ? 'setting' : 'settings'}`;
};

export const cardFootOf = (card: SettingCard) => card.foot ?? settingsLabelOf(card);

/* ------------------------------------------------------------------ *
 * The section rail                                                   *
 * ------------------------------------------------------------------ */

export type SectionId =
  | 'general'
  | 'year'
  | 'terms'
  | 'grades'
  | 'sections'
  | 'subjects'
  | 'curriculum'
  | 'grading'
  | 'assessment'
  | 'exams'
  | 'promotion'
  | 'attendance'
  | 'timetable'
  | 'homework'
  | 'calendar'
  | 'certificates'
  | 'reportcards'
  | 'preferences'
  | 'audit';

export interface Section {
  id: SectionId;
  group: string;
  label: string;
  title: string;
  sub: string;
  /** The tag in the rail. Undefined where the template shows none. */
  tag?: string;
}

/* ------------------------------------------------------------------ *
 * Structure                                                          *
 * ------------------------------------------------------------------ */

export const GENERAL_CARDS: SettingCard[] = [
  {
    id: 'institution',
    title: 'Institution',
    note: 'What kind of school this configuration describes',
    icon: 'ti ti-building-community',
    badge: { tone: 'is-live', label: 'Published' },
    rows: [
      {
        key: 'Institution type',
        note: 'Decides which statutory templates apply',
        kind: 'select',
        options: ['K–12 senior secondary', 'Primary only', 'Higher secondary only'],
      },
      {
        key: 'Board of affiliation',
        note: 'CBSE · affiliation 1930142',
        kind: 'select',
        options: ['CBSE', 'ICSE', 'State board', 'IB'],
      },
      {
        key: 'Medium of instruction',
        note: 'English, with Tamil and Hindi as second languages',
        kind: 'select',
        options: ['English', 'Tamil', 'Bilingual'],
      },
      {
        key: 'Session type',
        note: 'Annual, divided into three terms',
        kind: 'select',
        options: ['Annual · 3 terms', 'Semester · 2', 'Trimester'],
      },
      {
        key: 'Campuses covered',
        note: 'All three campuses share this configuration',
        kind: 'select',
        options: ['All campuses', 'Main campus only'],
      },
    ],
  },
  {
    id: 'week',
    title: 'Working days & timings',
    note: 'The week the school actually runs',
    icon: 'ti ti-calendar-week',
    badge: { tone: 'is-accent', label: '6-day week' },
    rows: [
      {
        key: 'Working days',
        note: 'Second Saturday is a holiday',
        kind: 'select',
        options: ['Mon – Sat', 'Mon – Fri', 'Mon – Sat alternate'],
      },
      {
        key: 'School timings',
        note: 'Assembly at 08:15, first period 08:30',
        kind: 'input',
        value: '08:15 – 15:30',
      },
      { key: 'Periods per day', note: 'Eight, of 40 minutes each', kind: 'input', value: '8' },
      { key: 'Break periods', note: 'A short break and a lunch break', kind: 'input', value: '2' },
      {
        key: 'Saturday schedule',
        note: 'Half day — four periods, no games',
        kind: 'select',
        options: ['Half day', 'Full day', 'Closed'],
      },
    ],
  },
  {
    id: 'defaults',
    title: 'Academic policy defaults',
    note: 'Where the school sits on the questions that matter',
    icon: 'ti ti-scale',
    tone: 'is-alt',
    badge: { tone: 'is-draft', label: '1 draft' },
    foot: '5 settings · 1 unpublished',
    rows: [
      {
        key: 'Continuous assessment',
        note: 'Internal marks count towards the final result',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Grades or marks on report cards',
        note: 'Both — the mark and the band it falls in',
        kind: 'select',
        options: ['Marks and grade', 'Grade only', 'Marks only'],
      },
      {
        key: 'Publish class rank',
        note: 'Off — rank is calculated but shown only to the class teacher',
        kind: 'switch',
        on: false,
      },
      {
        key: 'Minimum attendance',
        note: '75% of working days to sit the final examination',
        kind: 'input',
        value: '75',
      },
      {
        key: 'Automatic promotion',
        note: 'Off — every promotion is confirmed by a teacher',
        kind: 'switch',
        on: false,
      },
    ],
  },
  {
    id: 'permissions',
    title: 'Who may change this',
    note: 'Academic configuration is not a general permission',
    icon: 'ti ti-user-shield',
    badge: { tone: 'is-accent', label: 'Restricted' },
    rows: [
      {
        key: 'Permitted roles',
        note: 'Principal, Vice-Principal and Academic Head',
        kind: 'text',
        value: 'Manage',
      },
      {
        key: 'Second approver',
        note: 'Grading and promotion changes need the Principal',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Change window',
        note: 'Structural changes only between academic years',
        kind: 'select',
        options: ['Between years only', 'Any time', 'Term boundaries'],
      },
      {
        key: 'Notify on publish',
        note: 'All teaching staff are told what changed',
        kind: 'switch',
        on: true,
      },
    ],
  },
];

export const YEAR_CARDS: SettingCard[] = [
  {
    id: 'current',
    title: 'Current academic year',
    note: `${YEAR_LABEL} · the scope of every setting on this page`,
    icon: 'ti ti-calendar-stats',
    badge: { tone: 'is-live', label: 'Active' },
    foot: '6 settings · published',
    rows: [
      {
        key: 'Year label',
        note: 'Printed on report cards and certificates',
        kind: 'input',
        value: YEAR_LABEL,
      },
      {
        key: 'Starts',
        note: 'First working day after the summer break',
        kind: 'input',
        value: '06 April 2026',
      },
      { key: 'Ends', note: 'Last working day before results', kind: 'input', value: '31 March 2027' },
      {
        key: 'Total working days',
        note: `${WORKING_DAYS}, after holidays and the second-Saturday rule`,
        kind: 'text',
        value: String(WORKING_DAYS),
      },
      {
        key: 'Instructional days elapsed',
        note: `${DAYS_ELAPSED} of ${WORKING_DAYS}`,
        kind: 'text',
        value: String(DAYS_ELAPSED),
      },
      {
        key: 'Admission window',
        note: 'Closed for this year on 30 June',
        kind: 'text',
        value: 'Closed',
      },
    ],
  },
  {
    id: 'rollover',
    title: 'Rolling over',
    note: 'What happens when 2027 – 28 opens',
    icon: 'ti ti-arrow-forward-up',
    tone: 'is-watch',
    badge: { tone: 'is-draft', label: 'Prepared' },
    rows: [
      { key: 'Next year', note: 'Created as a draft on 12 Jul 2026', kind: 'text', value: 'Draft' },
      {
        key: 'Copy structure',
        note: 'Grades, sections, subjects and timings carry over',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Copy policies',
        note: 'Grading, promotion and attendance rules carry over',
        kind: 'switch',
        on: true,
      },
      { key: 'Copy calendar', note: 'Off — holidays differ every year', kind: 'switch', on: false },
      {
        key: 'Archive this year',
        note: 'Read-only once the next year is activated',
        kind: 'switch',
        on: true,
      },
    ],
  },
];

export interface YearRecord {
  short: string;
  label: string;
  note: string;
  state: 'Draft' | 'Active' | 'Archived';
}

export const YEARS: YearRecord[] = [
  {
    short: '27–28',
    label: '2027 – 28',
    note: 'Drafted 12 Jul 2026 · structure copied, calendar not yet set',
    state: 'Draft',
  },
  {
    short: '26–27',
    label: YEAR_LABEL,
    note: `Active since 06 Apr 2026 · ${DAYS_ELAPSED} of ${WORKING_DAYS} instructional days elapsed`,
    state: 'Active',
  },
  {
    short: '25–26',
    label: '2025 – 26',
    note: 'Closed 31 Mar 2026 · results published, records read-only',
    state: 'Archived',
  },
  {
    short: '24–25',
    label: '2024 – 25',
    note: 'Closed 31 Mar 2025 · retained for transcripts',
    state: 'Archived',
  },
];

export const yearBadge = (state: YearRecord['state']) =>
  ({ Draft: 'is-draft', Active: 'is-live', Archived: 'is-accent' })[state];

export interface Term {
  number: string;
  name: string;
  dates: string;
  weeks: number;
  workingDays: number;
  assessments: string;
  standing: string;
}

export const TERMS: Term[] = [
  {
    number: '1',
    name: 'Term 1',
    dates: '06 Apr – 26 Sep 2026',
    weeks: 18,
    workingDays: 96,
    assessments: '2 unit tests, 1 half-yearly',
    standing: 'Completed · results published 04 Oct',
  },
  {
    number: '2',
    name: 'Term 2',
    dates: '05 Oct 2026 – 09 Jan 2027',
    weeks: 12,
    workingDays: 68,
    assessments: '2 unit tests, 1 pre-board',
    standing: 'Week 7 of 12 · pre-board from 22 Sep',
  },
  {
    number: '3',
    name: 'Term 3',
    dates: '18 Jan – 31 Mar 2027',
    weeks: 10,
    workingDays: 60,
    assessments: 'Final examination',
    standing: 'Not started · opens 18 Jan',
  },
];

export const TERM_CARDS: SettingCard[] = [
  {
    id: 'structure',
    title: 'Term structure',
    note: 'How the year is divided, and what that implies',
    icon: 'ti ti-layout-rows',
    badge: { tone: 'is-accent', label: `${TERMS.length} terms` },
    rows: [
      {
        key: 'Division',
        note: 'Three terms, not two semesters',
        kind: 'select',
        options: ['3 terms', '2 semesters', '4 quarters'],
      },
      {
        key: 'Term weighting',
        note: 'Term 1 20%, Term 2 30%, Term 3 50%',
        kind: 'input',
        value: '20 / 30 / 50',
      },
      {
        key: 'Carry-forward marks',
        note: 'Internal marks from each term carry into the final',
        kind: 'switch',
        on: true,
      },
      { key: 'Term break length', note: 'One week between terms', kind: 'input', value: '7' },
    ],
  },
  {
    id: 'locking',
    title: 'Term locking',
    note: 'When a term stops accepting changes',
    icon: 'ti ti-lock',
    tone: 'is-watch',
    badge: { tone: 'is-draft', label: 'Term 1 locked' },
    rows: [
      {
        key: 'Lock on result publication',
        note: 'Marks cannot be edited once results are out',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Grace period',
        note: 'Seven days for corrections, with an approval',
        kind: 'input',
        value: '7',
      },
      {
        key: 'Attendance lock',
        note: 'The register closes at the end of each term',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Who may unlock',
        note: 'The Principal only, and it is recorded',
        kind: 'text',
        value: 'Principal',
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Grades and sections                                                *
 * ------------------------------------------------------------------ */

export interface Stage {
  grades: string;
  name: string;
  note: string;
  sections: number;
}

export const STAGES: Stage[] = [
  {
    grades: 'I – V',
    name: 'Primary stage',
    note: 'No formal examination · continuous assessment only · automatic progression',
    sections: 15,
  },
  {
    grades: 'VI – VIII',
    name: 'Middle stage',
    note: 'Unit tests and terminal examinations · 33% pass mark · no detention below Class VIII',
    sections: 11,
  },
  {
    grades: 'IX – X',
    name: 'Secondary stage',
    note: 'Board pattern · internal and external marks · 33% in each subject',
    sections: 7,
  },
  {
    grades: 'XI – XII',
    name: 'Senior secondary stage',
    note: 'Three streams · practical components · board examination in Class XII',
    sections: 5,
  },
];

/** The sections the stage ladder accounts for — the same 38 the nav counts. */
export const SECTIONS_IN_STAGES = STAGES.reduce((total, stage) => total + stage.sections, 0);

export interface ClassSection {
  name: string;
  students: number;
}

export interface GradeTree {
  grade: string;
  name: string;
  stage: string;
  sections: ClassSection[];
}

export const GRADE_TREES: GradeTree[] = [
  {
    grade: 'VI',
    name: 'Class VI',
    stage: 'Middle stage',
    sections: [
      { name: 'VI-A', students: 42 },
      { name: 'VI-B', students: 39 },
      { name: 'VI-C', students: 38 },
      { name: 'VI-D', students: 39 },
    ],
  },
  {
    grade: 'VII',
    name: 'Class VII',
    stage: 'Middle stage',
    sections: [
      { name: 'VII-A', students: 38 },
      { name: 'VII-B', students: 38 },
      { name: 'VII-C', students: 38 },
      { name: 'VII-D', students: 38 },
    ],
  },
  {
    grade: 'VIII',
    name: 'Class VIII',
    stage: 'Middle stage',
    sections: [
      { name: 'VIII-A', students: 38 },
      { name: 'VIII-B', students: 37 },
      { name: 'VIII-C', students: 37 },
    ],
  },
  {
    grade: 'IX',
    name: 'Class IX',
    stage: 'Secondary stage',
    sections: [
      { name: 'IX-A', students: 39 },
      { name: 'IX-B', students: 41 },
      { name: 'IX-C', students: 40 },
      { name: 'IX-D', students: 39 },
    ],
  },
  {
    grade: 'X',
    name: 'Class X',
    stage: 'Secondary stage',
    sections: [
      { name: 'X-A', students: 38 },
      { name: 'X-B', students: 38 },
      { name: 'X-C', students: 38 },
    ],
  },
  {
    grade: 'XI',
    name: 'Class XI',
    stage: 'Senior secondary',
    sections: [
      { name: 'XI-Sci', students: 38 },
      { name: 'XI-Com', students: 32 },
      { name: 'XI-Hum', students: 26 },
    ],
  },
];

export const isOverCapacity = (section: ClassSection) => section.students > MAX_CLASS_SIZE;

export const treeStudentsOf = (tree: GradeTree) =>
  tree.sections.reduce((total, section) => total + section.students, 0);

/** "Middle stage · 4 sections · 158 students" — every part of it counted. */
export const treeNoteOf = (tree: GradeTree) => {
  const label = tree.grade === 'XI' ? 'streams' : 'sections';
  return `${tree.stage} · ${tree.sections.length} ${label} · ${treeStudentsOf(tree)} students`;
};

/** The sections above the ceiling, named the way the capacity card names them. */
export const OVER_CAPACITY = GRADE_TREES.flatMap((tree) =>
  tree.sections.filter(isOverCapacity),
).map((section) => section.name);

export const AVERAGE_SECTION_SIZE = Math.round((STUDENTS_ENROLLED / TOTAL_SECTIONS) * 10) / 10;

export const GRADE_CARDS: SettingCard[] = [
  {
    id: 'structure',
    title: 'Class structure',
    note: 'How the school is banded',
    icon: 'ti ti-stairs',
    badge: { tone: 'is-accent', label: `${STAGES.length} stages` },
    rows: [
      {
        key: 'Grade range',
        note: 'Class I to Class XII, plus two pre-primary years',
        kind: 'input',
        value: 'I – XII',
      },
      {
        key: 'Stages',
        note: 'Primary, middle, secondary and senior secondary',
        kind: 'text',
        value: String(STAGES.length),
      },
      {
        key: 'Streams at senior secondary',
        note: 'Science, Commerce and Humanities from Class XI',
        kind: 'text',
        value: '3',
      },
      {
        key: 'Maximum class size',
        note: `${MAX_CLASS_SIZE} — two sections are currently over`,
        kind: 'input',
        value: String(MAX_CLASS_SIZE),
      },
      {
        key: 'Class teacher per section',
        note: 'One, assigned for the full year',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'capacity',
    title: 'Capacity',
    note: 'Where the numbers are tight',
    icon: 'ti ti-users-group',
    tone: 'is-watch',
    badge: { tone: 'is-draft', label: `${OVER_CAPACITY.length} over` },
    foot: `Reviewed ${RUN_DATE}`,
    rows: [
      {
        key: 'Total sections',
        note: 'Across twelve grades',
        kind: 'text',
        value: String(TOTAL_SECTIONS),
      },
      {
        key: 'Students enrolled',
        note: `As at ${RUN_DATE}`,
        kind: 'text',
        value: STUDENTS_ENROLLED.toLocaleString('en-IN'),
      },
      {
        key: 'Average section size',
        note: 'Comfortably inside the ceiling',
        kind: 'text',
        value: String(AVERAGE_SECTION_SIZE),
      },
      {
        key: `Sections over ${MAX_CLASS_SIZE}`,
        note: `${OVER_CAPACITY.join(' and ')} — a third section may be needed`,
        kind: 'text',
        value: String(OVER_CAPACITY.length),
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Subjects                                                           *
 * ------------------------------------------------------------------ */

export type SubjectKind = 'core' | 'elective' | 'practical' | 'non-scholastic';

export interface Subject {
  name: string;
  credits: number;
  kind: SubjectKind;
}

export const SUBJECTS: Subject[] = [
  { name: 'English', credits: 6, kind: 'core' },
  { name: 'Mathematics', credits: 6, kind: 'core' },
  { name: 'Science', credits: 6, kind: 'core' },
  { name: 'Social Science', credits: 5, kind: 'core' },
  { name: 'Hindi', credits: 4, kind: 'core' },
  { name: 'Tamil', credits: 4, kind: 'core' },
  { name: 'Computer Science', credits: 4, kind: 'elective' },
  { name: 'Economics', credits: 4, kind: 'elective' },
  { name: 'Fine Arts', credits: 3, kind: 'elective' },
  { name: 'Music', credits: 3, kind: 'elective' },
  { name: 'French', credits: 3, kind: 'elective' },
  { name: 'Sanskrit', credits: 3, kind: 'elective' },
  { name: 'Physical Education', credits: 2, kind: 'elective' },
  { name: 'Physics', credits: 5, kind: 'practical' },
  { name: 'Chemistry', credits: 5, kind: 'practical' },
  { name: 'Biology', credits: 5, kind: 'practical' },
  { name: 'Computer Applications', credits: 4, kind: 'practical' },
  { name: 'Home Science', credits: 3, kind: 'practical' },
  { name: 'Work Experience', credits: 1, kind: 'non-scholastic' },
  { name: 'Art Education', credits: 1, kind: 'non-scholastic' },
  { name: 'Health & Physical Education', credits: 1, kind: 'non-scholastic' },
  { name: 'Discipline', credits: 1, kind: 'non-scholastic' },
  { name: 'Life Skills', credits: 1, kind: 'non-scholastic' },
  { name: 'Values & Attitude', credits: 1, kind: 'non-scholastic' },
];

export const SUBJECT_GROUPS: { kind: SubjectKind; title: string; icon: string; tone?: string }[] = [
  { kind: 'core', title: 'Core — taught to every student', icon: 'ti ti-book' },
  { kind: 'elective', title: 'Elective — chosen from Class IX', icon: 'ti ti-arrows-shuffle', tone: 'is-alt' },
  {
    kind: 'practical',
    title: 'Practical — carries a laboratory component',
    icon: 'ti ti-flask',
    tone: 'is-pass',
  },
  {
    kind: 'non-scholastic',
    title: 'Non-scholastic — graded, not marked',
    icon: 'ti ti-palette',
    tone: 'is-watch',
  },
];

export const subjectsOf = (kind: SubjectKind) =>
  SUBJECTS.filter((subject) => subject.kind === kind);

export const creditsOf = (kind: SubjectKind) =>
  subjectsOf(kind).reduce((total, subject) => total + subject.credits, 0);

/** "6 subjects · 31 credits in total" — both halves counted off the list. */
export const subjectNoteOf = (kind: SubjectKind) =>
  `${subjectsOf(kind).length} subjects · ${creditsOf(kind)} credits in total`;

/* ------------------------------------------------------------------ *
 * Curriculum                                                         *
 * ------------------------------------------------------------------ */

export const CURRICULUM_CARDS: SettingCard[] = [
  {
    id: 'framework',
    title: 'Curriculum framework',
    note: 'What the school teaches against',
    icon: 'ti ti-books',
    badge: { tone: 'is-live', label: 'Adopted' },
    rows: [
      {
        key: 'Framework',
        note: 'CBSE 2026 curriculum',
        kind: 'select',
        options: ['CBSE 2026', 'CBSE 2025', 'NCERT core', 'Custom'],
      },
      {
        key: 'Adopted on',
        note: 'Approved by the academic committee',
        kind: 'text',
        value: '02 Feb 2026',
      },
      {
        key: 'Revision cycle',
        note: 'Reviewed each year before the year opens',
        kind: 'select',
        options: ['Annual', 'Every 2 years', 'On board revision'],
      },
      { key: 'Syllabus source', note: 'Board circular 2026/AC/11', kind: 'text', value: 'On file' },
      {
        key: 'Local additions',
        note: 'Tamil language and value education, beyond the board minimum',
        kind: 'text',
        value: '2',
      },
    ],
  },
  {
    id: 'hours',
    title: 'Teaching hours',
    note: 'What the timetable has to fit',
    icon: 'ti ti-clock-hour-4',
    badge: { tone: 'is-accent', label: '1,120 hours' },
    rows: [
      {
        key: 'Annual instructional hours',
        note: 'Against a board minimum of 1,000',
        kind: 'text',
        value: '1,120',
      },
      {
        key: 'Per subject minimum',
        note: 'A core subject must reach this to be examinable',
        kind: 'input',
        value: '120',
      },
      { key: 'Practical hours', note: 'Counted separately from theory', kind: 'input', value: '40' },
      {
        key: 'Remedial hours',
        note: 'Held after school for students below the pass mark',
        kind: 'input',
        value: '60',
      },
      { key: 'Co-curricular', note: 'Timetabled, not optional', kind: 'input', value: '80' },
    ],
  },
  {
    id: 'credits',
    title: 'Credit system',
    note: 'How subjects are weighted against each other',
    icon: 'ti ti-award',
    tone: 'is-alt',
    badge: { tone: 'is-draft', label: 'Draft' },
    foot: '5 settings · unpublished',
    rows: [
      {
        key: 'Credit system',
        note: 'In use from Class IX — still a draft for the middle stage',
        kind: 'switch',
        on: true,
      },
      { key: 'Credits to progress', note: 'A student must earn this in a year', kind: 'input', value: '40' },
      {
        key: 'Core credit floor',
        note: 'No core subject may be worth less than this',
        kind: 'input',
        value: '4',
      },
      {
        key: 'Elective ceiling',
        note: 'Electives may not exceed this share of the total',
        kind: 'input',
        value: '25',
      },
      {
        key: 'Credit on a fail',
        note: 'None — a failed subject earns nothing',
        kind: 'switch',
        on: false,
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Grading                                                            *
 * ------------------------------------------------------------------ */

export interface Band {
  letter: string;
  /** The floor of the band. E has none, so it starts at zero. */
  from: number;
  /** Grade point, or null where the band carries none. */
  point: number | null;
}

export const BANDS: Band[] = [
  { letter: 'A1', from: 91, point: 10 },
  { letter: 'A2', from: 81, point: 9 },
  { letter: 'B1', from: 71, point: 8 },
  { letter: 'B2', from: 61, point: 7 },
  { letter: 'C1', from: 51, point: 6 },
  { letter: 'C2', from: 41, point: 5 },
  { letter: 'D', from: 33, point: 4 },
  { letter: 'E', from: 0, point: null },
];

export const PASS_MARK = 33;

/** A band runs up to the floor of the band above it. */
export const bandRangeOf = (index: number) => {
  const band = BANDS[index];
  if (index === 0) return `${band.from} – 100`;
  if (band.from === 0) return `Below ${BANDS[index - 1].from}`;
  return `${band.from} – ${BANDS[index - 1].from - 1}`;
};

/** How wide the band sits on the track — up to the next floor, or to 100. */
export const bandWidthOf = (index: number) =>
  (index === 0 ? 100 : BANDS[index - 1].from) - BANDS[index].from;

export const bandPointOf = (band: Band) => (band.point === null ? '—' : band.point.toFixed(1));

export const GRADING_CARDS: SettingCard[] = [
  {
    id: 'calculation',
    title: 'Grade calculation',
    note: 'How a mark becomes a grade',
    icon: 'ti ti-calculator',
    badge: { tone: 'is-accent', label: 'Absolute' },
    rows: [
      {
        key: 'Method',
        note: 'Absolute — not graded on a curve',
        kind: 'select',
        options: ['Absolute', 'Relative to cohort', 'Percentile'],
      },
      {
        key: 'Rounding',
        note: 'Half marks round up',
        kind: 'select',
        options: ['Round up at .5', 'Round down', 'No rounding'],
      },
      { key: 'Cumulative average', note: 'Grade points weighted by credits', kind: 'switch', on: true },
      {
        key: 'Non-scholastic',
        note: 'Graded A to E, never added to the total',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'ranking',
    title: 'Ranking',
    note: 'Calculated, but not published',
    icon: 'ti ti-trophy',
    tone: 'is-watch',
    badge: { tone: 'is-draft', label: 'Restricted' },
    rows: [
      {
        key: 'Calculate rank',
        note: 'Within the section and within the grade',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Show on report cards',
        note: 'Off — the academic committee decided against it in 2024',
        kind: 'switch',
        on: false,
      },
      {
        key: 'Visible to',
        note: 'The class teacher and the Principal only',
        kind: 'select',
        options: ['Class teacher only', 'Teachers and guardians', 'Everyone'],
      },
      {
        key: 'Tie handling',
        note: 'Equal marks share a rank; the next rank is skipped',
        kind: 'select',
        options: ['Share the rank', 'Break by attendance', 'Break by core marks'],
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Assessment                                                         *
 * ------------------------------------------------------------------ */

export const ASSESSMENT_CARDS: SettingCard[] = [
  {
    id: 'pattern',
    title: 'Assessment pattern',
    note: 'What a subject mark is made of',
    icon: 'ti ti-layout-list',
    badge: { tone: 'is-live', label: 'Published' },
    rows: [
      {
        key: 'Internal assessment',
        note: 'Unit tests, project work and class participation',
        kind: 'text',
        value: '20%',
      },
      {
        key: 'Practical',
        note: 'Where the subject carries a laboratory component',
        kind: 'text',
        value: '20%',
      },
      {
        key: 'Terminal examination',
        note: 'The written paper at the end of the term',
        kind: 'text',
        value: '60%',
      },
      {
        key: 'Applies from',
        note: 'Class VI — the primary stage has no formal examination',
        kind: 'select',
        options: ['Class VI', 'Class IX', 'Class I'],
      },
    ],
  },
  {
    id: 'internal',
    title: 'Internal marks',
    note: 'The part a teacher awards',
    icon: 'ti ti-pencil',
    badge: { tone: 'is-accent', label: '20 marks' },
    rows: [
      {
        key: 'Unit tests',
        note: 'Best two of three, so one bad day does not carry',
        kind: 'text',
        value: '10',
      },
      {
        key: 'Project or assignment',
        note: 'One per term, marked against a published rubric',
        kind: 'text',
        value: '5',
      },
      { key: 'Class participation', note: 'Awarded by the subject teacher', kind: 'text', value: '3' },
      { key: 'Notebook and submission', note: 'Checked twice a term', kind: 'text', value: '2' },
      {
        key: 'Moderation',
        note: 'A section averaging above 18 is reviewed by the Academic Head',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'external',
    title: 'External marks',
    note: 'The written paper',
    icon: 'ti ti-file-text',
    badge: { tone: 'is-accent', label: '60 marks' },
    rows: [
      {
        key: 'Paper duration',
        note: 'Three hours for the terminal examination',
        kind: 'input',
        value: '180',
      },
      {
        key: 'Question paper source',
        note: 'Set internally, moderated by the subject head',
        kind: 'select',
        options: ['Internal, moderated', 'Board pattern', 'External agency'],
      },
      {
        key: 'Answer script retention',
        note: 'Held for one academic year, for revaluation',
        kind: 'input',
        value: '1',
      },
      {
        key: 'Blind marking',
        note: 'Roll numbers only — names are not on the script',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'passing',
    title: 'Passing marks',
    note: 'The line a student has to clear',
    icon: 'ti ti-checkbox',
    tone: 'is-watch',
    badge: { tone: 'is-accent', label: `${PASS_MARK}%` },
    rows: [
      {
        key: 'Subject pass mark',
        note: 'Aggregate of internal and external',
        kind: 'input',
        value: String(PASS_MARK),
      },
      {
        key: 'External minimum',
        note: 'A student cannot pass on internal marks alone',
        kind: 'input',
        value: '25',
      },
      {
        key: 'Practical minimum',
        note: 'Separately required where a practical exists',
        kind: 'input',
        value: String(PASS_MARK),
      },
      {
        key: 'Overall pass',
        note: 'Every subject must be passed, not just the average',
        kind: 'switch',
        on: true,
      },
      { key: 'Grace marks', note: 'Up to 5 marks, in at most two subjects', kind: 'input', value: '5' },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Examinations                                                       *
 * ------------------------------------------------------------------ */

export interface DatedEvent {
  day: string;
  month: string;
  title: string;
  note: string;
}

export const EXAM_CYCLES: DatedEvent[] = [
  { day: '14', month: 'Jul', title: 'Unit Test I', note: 'Term 1 · July · 20 marks · internal' },
  {
    day: '08',
    month: 'Sep',
    title: 'Half-Yearly Examination',
    note: 'Term 1 · September · 80 marks · terminal',
  },
  { day: '16', month: 'Nov', title: 'Unit Test II', note: 'Term 2 · November · 20 marks · internal' },
  {
    day: '22',
    month: 'Sep',
    title: 'Pre-Board Examination',
    note: 'Term 2 · from 22 Sep · 80 marks · board pattern',
  },
  {
    day: '02',
    month: 'Mar',
    title: 'Final Examination',
    note: 'Term 3 · March · 80 marks · decides promotion',
  },
];

export const EXAM_CARDS: SettingCard[] = [
  {
    id: 'processing',
    title: 'Result processing',
    note: 'From marks entered to results published',
    icon: 'ti ti-file-check',
    badge: { tone: 'is-accent', label: '4 stages' },
    rows: [
      { key: 'Marks entry window', note: 'Ten days from the last paper', kind: 'input', value: '10' },
      {
        key: 'Verification',
        note: 'The subject head checks before the class teacher sees them',
        kind: 'switch',
        on: true,
      },
      { key: 'Approval', note: 'The Principal releases results', kind: 'switch', on: true },
      {
        key: 'Publication',
        note: 'Guardians are notified the same evening',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'revaluation',
    title: 'Revaluation',
    note: 'What a student can ask for afterwards',
    icon: 'ti ti-refresh-alert',
    tone: 'is-watch',
    badge: { tone: 'is-accent', label: 'Open 7 days' },
    rows: [
      { key: 'Window', note: 'Seven days from the result date', kind: 'input', value: '7' },
      {
        key: 'Fee',
        note: '₹250 per paper, refunded if the mark changes',
        kind: 'input',
        value: '250',
      },
      { key: 'Re-totalling', note: 'Free — only the addition is checked', kind: 'switch', on: true },
      {
        key: 'Mark may decrease',
        note: 'Yes, and the student is told so before applying',
        kind: 'switch',
        on: true,
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * Promotion and homework policies                                    *
 * ------------------------------------------------------------------ */

/** A policy sentence, in the parts the template emphasises. */
export interface Policy {
  parts: { text: string; strong?: boolean }[];
  note: string;
  icon: string;
  tone?: string;
  on: boolean;
}

export const PROMOTION_RULES: Policy[] = [
  {
    parts: [{ text: 'A student passing every subject is promoted.' }],
    note: 'The ordinary case. Promotion is still confirmed by the class teacher rather than applied automatically, because the register occasionally disagrees with the mark sheet.',
    icon: 'ti ti-arrow-up-circle',
    on: true,
  },
  {
    parts: [
      { text: 'Failing ' },
      { text: 'one or two', strong: true },
      { text: ' subjects means a supplementary examination, not detention.' },
    ],
    note: 'Held in the first week of April. Passing it promotes the student with the subject marked as cleared on supplementary. Failing it moves the case to the academic committee.',
    icon: 'ti ti-repeat',
    on: true,
  },
  {
    parts: [
      { text: 'Failing ' },
      { text: 'three or more', strong: true },
      { text: ' subjects is referred to the academic committee.' },
    ],
    note: 'No student is detained by a rule alone. The committee looks at attendance, the year as a whole and any circumstance the school knows about, then decides.',
    icon: 'ti ti-users-group',
    on: true,
  },
  {
    parts: [{ text: 'No detention before Class VIII.' }],
    note: 'Required by the Right to Education Act. A student below Class VIII moves up regardless of marks, and remedial hours are scheduled instead.',
    icon: 'ti ti-alert-triangle',
    tone: 'is-watch',
    on: true,
  },
  {
    parts: [
      { text: 'Below ' },
      { text: '75% attendance', strong: true },
      { text: ' a student may not sit the final examination.' },
    ],
    note: 'The Principal may condone up to 10% for documented illness. Without the final examination there is no promotion, so this rule matters more than it looks.',
    icon: 'ti ti-calendar-x',
    on: true,
  },
  {
    parts: [
      { text: 'Up to ' },
      { text: '5 grace marks', strong: true },
      { text: ' may be awarded, in at most two subjects.' },
    ],
    note: 'Applied only where it changes the outcome, and recorded on the mark sheet so it is never invisible.',
    icon: 'ti ti-plus',
    on: true,
  },
  {
    parts: [{ text: 'Every promotion is signed off by a named teacher.' }],
    note: 'The name is stored with the decision. Nothing is promoted by the system on its own.',
    icon: 'ti ti-calendar-check',
    tone: 'is-watch',
    on: true,
  },
];

export const HOMEWORK_RULES: Policy[] = [
  {
    parts: [
      { text: 'Homework is set no more than ' },
      { text: 'four days a week', strong: true },
      { text: '.' },
    ],
    note: 'Friday is deliberately kept free. The policy exists because the load was measured in 2025 and found to be nearly double what the board recommends for the middle stage.',
    icon: 'ti ti-calendar-week',
    on: true,
  },
  {
    parts: [
      { text: 'Time expected: ' },
      { text: '60 minutes', strong: true },
      { text: ' for the middle stage, ' },
      { text: '90', strong: true },
      { text: ' for secondary.' },
    ],
    note: 'Set by the subject teacher against this budget rather than by the length of the task. If a class routinely exceeds it, the subject head is told.',
    icon: 'ti ti-clock',
    on: true,
  },
  {
    parts: [{ text: 'No homework is set over a school holiday or a term break.' }],
    note: 'Project work assigned before a break is exempt, provided it was given at least two weeks earlier.',
    icon: 'ti ti-book',
    on: true,
  },
  {
    parts: [
      { text: 'A class receives homework from no more than ' },
      { text: 'three subjects', strong: true },
      { text: ' in a day.' },
    ],
    note: 'Enforced by the homework module, which shows the class teacher what has already been set before a fourth subject can add to it.',
    icon: 'ti ti-list-check',
    on: true,
  },
  {
    parts: [{ text: 'Guardians receive a daily homework digest at 17:00.' }],
    note: 'Currently off, because the message template is still a draft. When it is published this becomes one message a day rather than one per subject.',
    icon: 'ti ti-users',
    on: false,
  },
];

/* ------------------------------------------------------------------ *
 * Attendance and timetable                                           *
 * ------------------------------------------------------------------ */

export const ATTENDANCE_CARDS: SettingCard[] = [
  {
    id: 'requirement',
    title: 'Attendance requirement',
    note: 'The line that decides eligibility',
    icon: 'ti ti-calendar-check',
    tone: 'is-watch',
    badge: { tone: 'is-accent', label: '75%' },
    rows: [
      {
        key: 'Minimum for the final examination',
        note: 'Of working days in the year',
        kind: 'input',
        value: '75',
      },
      {
        key: 'Condonation',
        note: 'The Principal may allow up to this much, with documents',
        kind: 'input',
        value: '10',
      },
      {
        key: 'Counted from',
        note: 'The date of admission, not the start of the year',
        kind: 'select',
        options: ['Date of admission', 'Start of year'],
      },
      { key: 'Half day', note: 'Counts as half a day present', kind: 'switch', on: true },
      {
        key: 'Warning at',
        note: 'A guardian is written to when attendance falls here',
        kind: 'input',
        value: '80',
      },
    ],
  },
  {
    id: 'marking',
    title: 'Marking rules',
    note: 'How the register is actually taken',
    icon: 'ti ti-clock',
    badge: { tone: 'is-live', label: 'Published' },
    rows: [
      {
        key: 'Sessions per day',
        note: 'Morning and afternoon, taken separately',
        kind: 'input',
        value: '2',
      },
      {
        key: 'Late arrival',
        note: 'After 08:45 is marked late; three lates make an absence',
        kind: 'input',
        value: '3',
      },
      {
        key: 'Locking',
        note: 'The register locks at 11:00 for the morning session',
        kind: 'input',
        value: '11:00',
      },
      {
        key: 'Retrospective edit',
        note: 'Needs the Academic Head and is recorded',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Automatic absence alert',
        note: 'Guardians are texted at 11:00 on an unexplained absence',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'leave',
    title: 'Leave types',
    note: 'What an absence can be recorded as',
    icon: 'ti ti-file-text',
    badge: { tone: 'is-accent', label: '6 types' },
    foot: '5 of 6 types',
    rows: [
      {
        key: 'Medical leave',
        note: 'Excluded from the attendance percentage with a certificate',
        kind: 'switch',
        on: true,
      },
      { key: 'Approved leave', note: 'Counted as absent, but not chased', kind: 'switch', on: true },
      {
        key: 'Representing the school',
        note: 'Counted as present for sport and competitions',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Examination leave',
        note: 'Board practicals and external examinations',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Unexplained',
        note: 'The default, and what triggers the alert',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'reportcard',
    title: 'Attendance on the report card',
    note: 'What a guardian sees',
    icon: 'ti ti-report',
    badge: { tone: 'is-live', label: 'Shown' },
    rows: [
      {
        key: 'Show on report cards',
        note: 'Days present out of working days, per term',
        kind: 'switch',
        on: true,
      },
      { key: 'Show the percentage', note: 'Alongside the count', kind: 'switch', on: true },
      {
        key: 'Flag below the minimum',
        note: 'Printed in bold with a note',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Include in the transcript',
        note: 'Off — the transcript carries academic record only',
        kind: 'switch',
        on: false,
      },
    ],
  },
];

export const TIMETABLE_CARDS: SettingCard[] = [
  {
    id: 'periods',
    title: 'Period structure',
    note: 'The grid the timetable is built on',
    icon: 'ti ti-table',
    badge: { tone: 'is-accent', label: '8 periods' },
    rows: [
      { key: 'Periods per day', note: 'Eight, plus assembly', kind: 'input', value: '8' },
      { key: 'Period length', note: 'Forty minutes', kind: 'input', value: '40' },
      { key: 'Double periods', note: 'Allowed for practicals and art', kind: 'switch', on: true },
      {
        key: 'Zero period',
        note: 'Off — the school day starts with assembly',
        kind: 'switch',
        on: false,
      },
      { key: 'Saturday periods', note: 'Four, ending at 12:30', kind: 'input', value: '4' },
    ],
  },
  {
    id: 'load',
    title: 'Teacher load',
    note: 'What the timetable may ask of a teacher',
    icon: 'ti ti-user-cog',
    badge: { tone: 'is-live', label: 'Enforced' },
    rows: [
      { key: 'Maximum periods per day', note: 'Six of eight', kind: 'input', value: '6' },
      { key: 'Maximum periods per week', note: 'Thirty', kind: 'input', value: '30' },
      {
        key: 'Consecutive periods',
        note: 'No more than three without a break',
        kind: 'input',
        value: '3',
      },
      {
        key: 'Free period guarantee',
        note: 'At least one a day, for preparation',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Substitution pool',
        note: 'Every teacher is available for two substitutions a week',
        kind: 'input',
        value: '2',
      },
    ],
  },
  {
    id: 'clash',
    title: 'Clash rules',
    note: 'What the timetable will refuse to do',
    icon: 'ti ti-alert-hexagon',
    tone: 'is-watch',
    badge: { tone: 'is-live', label: 'Hard rules' },
    foot: '4 rules',
    rows: [
      { key: 'Teacher in two places', note: 'Refused outright', kind: 'switch', on: true },
      { key: 'Room double-booked', note: 'Refused outright', kind: 'switch', on: true },
      {
        key: 'Laboratory without a technician',
        note: 'Refused for practical periods',
        kind: 'switch',
        on: true,
      },
      { key: 'Games before an examination', note: 'Warned, not refused', kind: 'switch', on: true },
    ],
  },
  {
    id: 'distribution',
    title: 'Subject distribution',
    note: 'Preferences, not requirements',
    icon: 'ti ti-arrows-shuffle',
    badge: { tone: 'is-accent', label: 'Soft rules' },
    foot: '4 preferences',
    rows: [
      {
        key: 'Core subjects early',
        note: 'Mathematics and languages before the lunch break',
        kind: 'switch',
        on: true,
      },
      { key: 'Games last', note: 'The last period where possible', kind: 'switch', on: true },
      {
        key: 'No repeat',
        note: 'The same subject not twice in a day, except practicals',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Even spread',
        note: 'A subject spread across the week rather than clustered',
        kind: 'switch',
        on: true,
      },
    ],
  },
];

/* ------------------------------------------------------------------ *
 * The calendar                                                       *
 * ------------------------------------------------------------------ */

export type MonthKind = 'Term 1' | 'Term 2' | 'Term 3' | 'Unit test' | 'Half-yearly' | 'Break' | 'Finals';

export interface CalendarMonth {
  month: string;
  label: MonthKind;
  current?: boolean;
}

export const CALENDAR_MONTHS: CalendarMonth[] = [
  { month: 'Apr', label: 'Term 1' },
  { month: 'May', label: 'Term 1' },
  { month: 'Jun', label: 'Term 1' },
  { month: 'Jul', label: 'Unit test', current: true },
  { month: 'Aug', label: 'Term 1' },
  { month: 'Sep', label: 'Half-yearly' },
  { month: 'Oct', label: 'Break' },
  { month: 'Nov', label: 'Term 2' },
  { month: 'Dec', label: 'Term 2' },
  { month: 'Jan', label: 'Break' },
  { month: 'Feb', label: 'Term 3' },
  { month: 'Mar', label: 'Finals' },
];

export const CALENDAR_EVENTS: DatedEvent[] = [
  { day: '06', month: 'Apr', title: 'Academic year opens', note: 'Assembly at 08:15 · all grades' },
  {
    day: '14',
    month: 'Jul',
    title: 'Unit Test I begins',
    note: 'Term 1 · internal · Classes VI to XII',
  },
  {
    day: '15',
    month: 'Aug',
    title: 'Independence Day',
    note: 'Holiday · flag hoisting at 08:00, attendance not taken',
  },
  {
    day: '08',
    month: 'Sep',
    title: 'Half-Yearly Examination begins',
    note: 'Term 1 · terminal · 12 working days',
  },
  {
    day: '22',
    month: 'Sep',
    title: 'Pre-Board Examination begins',
    note: 'Term 2 · board pattern · Classes X and XII',
  },
  { day: '02', month: 'Oct', title: 'Gandhi Jayanti', note: 'Holiday' },
  { day: '05', month: 'Oct', title: 'Term 2 opens', note: 'After the autumn break' },
  {
    day: '20',
    month: 'Oct',
    title: 'Parent–teacher meeting',
    note: 'Term 1 report cards issued · 09:00 to 13:00',
  },
  { day: '16', month: 'Nov', title: 'Unit Test II begins', note: 'Term 2 · internal' },
  {
    day: '12',
    month: 'Dec',
    title: 'Annual Day',
    note: 'Whole school · no classes after the interval',
  },
  { day: '10', month: 'Jan', title: 'Winter break begins', note: 'Reopens 18 January' },
  { day: '26', month: 'Jan', title: 'Republic Day', note: 'Holiday' },
  {
    day: '02',
    month: 'Mar',
    title: 'Final Examination begins',
    note: 'Term 3 · decides promotion',
  },
  { day: '31', month: 'Mar', title: 'Academic year closes', note: 'Results published 08 April' },
];

export const HOLIDAY_ROWS: SettingRow[] = [
  { key: 'National holidays', note: 'Fixed by statute', kind: 'text', value: '3' },
  {
    key: 'State and religious',
    note: 'Set by the trust before the year opens',
    kind: 'text',
    value: '12',
  },
  {
    key: 'School holidays',
    note: 'Founder’s Day, sports day and local observances',
    kind: 'text',
    value: '7',
  },
  { key: 'Second Saturdays', note: 'Not counted as working days', kind: 'switch', on: true },
];

/** Holidays across the year — the three counted categories, added up. */
export const TOTAL_HOLIDAYS = HOLIDAY_ROWS.filter((row) => row.kind === 'text').reduce(
  (total, row) => total + Number(row.value ?? 0),
  0,
);

export const ACTIVITY_ROWS: SettingRow[] = [
  { key: 'Club days', note: 'Every Friday, last two periods', kind: 'switch', on: true },
  { key: 'Inter-house competitions', note: 'Six through the year', kind: 'text', value: '6' },
  { key: 'Field trips', note: 'One per grade per year, term 2 or 3', kind: 'text', value: '12' },
  {
    key: 'Term 3 activities',
    note: 'Not yet set — usually fixed in December',
    kind: 'text',
    value: 'Pending',
  },
];

/* ------------------------------------------------------------------ *
 * Certificates and report cards                                      *
 * ------------------------------------------------------------------ */

export const CERTIFICATE_CARDS: SettingCard[] = [
  {
    id: 'signature',
    title: 'Digital signature',
    note: 'How a certificate is authenticated',
    icon: 'ti ti-signature',
    badge: { tone: 'is-live', label: 'Active' },
    rows: [
      { key: 'Signatory', note: 'Dr. Anitha Krishnan, Principal', kind: 'text', value: '' },
      {
        key: 'Certificate authority',
        note: 'eMudhra Class 3 · valid to 14 Mar 2028',
        kind: 'text',
        value: 'Valid',
      },
      {
        key: 'Applied to',
        note: 'Transfer, bonafide, character and provisional certificates',
        kind: 'text',
        value: '4',
      },
      {
        key: 'QR verification',
        note: 'Each certificate carries a code that verifies it online',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Printed signature',
        note: 'Also applied, for documents that will be photocopied',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    id: 'print',
    title: 'Print settings',
    note: 'How a certificate reaches paper',
    icon: 'ti ti-printer',
    badge: { tone: 'is-accent', label: 'A4 portrait' },
    rows: [
      {
        key: 'Paper size',
        note: 'A4, portrait',
        kind: 'select',
        options: ['A4 portrait', 'A4 landscape', 'Legal'],
      },
      {
        key: 'Letterhead',
        note: 'Pre-printed stationery — the crest is not printed again',
        kind: 'switch',
        on: true,
      },
      { key: 'Watermark', note: 'The school crest at 8% opacity', kind: 'switch', on: true },
      {
        key: 'Serial numbering',
        note: 'PRSK/TC/2026-27/0000 · never reused',
        kind: 'text',
        value: 'Sequential',
      },
      {
        key: 'Duplicate marking',
        note: 'A reissue is stamped DUPLICATE and recorded',
        kind: 'switch',
        on: true,
      },
    ],
  },
];

export interface CertificateType {
  name: string;
  note: string;
  icon: string;
  /** Issued this year. Zero where the type is still a draft. */
  issued: number;
  draft?: boolean;
}

export const CERTIFICATE_TYPES: CertificateType[] = [
  {
    name: 'Transfer Certificate',
    note: 'Issued on leaving · board format · signed by the Principal',
    icon: 'ti ti-certificate',
    issued: 148,
  },
  {
    name: 'Bonafide Certificate',
    note: 'Confirms enrolment · issued on request within 2 working days',
    icon: 'ti ti-file-certificate',
    issued: 312,
  },
  {
    name: 'Character Certificate',
    note: 'Issued with the transfer certificate on completing Class XII',
    icon: 'ti ti-award',
    issued: 96,
  },
  {
    name: 'Provisional Certificate',
    note: 'Issued before the board mark sheet arrives',
    icon: 'ti ti-report',
    issued: 94,
  },
  {
    name: 'Merit Certificate',
    note: 'Top three in each grade, and subject toppers',
    icon: 'ti ti-medal',
    issued: 46,
  },
  {
    name: 'Attendance Certificate',
    note: 'For students above 95% attendance',
    icon: 'ti ti-calendar-check',
    issued: 211,
  },
  {
    name: 'Sports & Activity Certificate',
    note: 'Inter-house and inter-school participation',
    icon: 'ti ti-run',
    issued: 380,
  },
  {
    name: 'Course Completion',
    note: 'For the optional certificate courses',
    icon: 'ti ti-book',
    issued: 0,
    draft: true,
  },
  {
    name: 'Internship Letter',
    note: 'Class XI and XII summer placements',
    icon: 'ti ti-briefcase',
    issued: 0,
    draft: true,
  },
];

export const certificateFootOf = (type: CertificateType) =>
  type.issued === 0 ? 'Not issued this year' : `${type.issued} issued this year`;

export const REPORT_CARDS: SettingCard[] = [
  {
    id: 'template',
    title: 'Report card template',
    note: 'What a term report contains',
    icon: 'ti ti-file-description',
    badge: { tone: 'is-live', label: 'Published' },
    rows: [
      {
        key: 'Template',
        note: 'CBSE terminal report · three-term layout',
        kind: 'select',
        options: ['CBSE terminal', 'Continuous assessment', 'Custom'],
      },
      {
        key: 'Marks and grade',
        note: 'Both shown, side by side',
        kind: 'select',
        options: ['Marks and grade', 'Grade only', 'Marks only'],
      },
      {
        key: 'Attendance',
        note: 'Days present out of working days, and the percentage',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Non-scholastic areas',
        note: 'Graded A to E in a separate block',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Class teacher remark',
        note: 'One free-text line, written per student',
        kind: 'switch',
        on: true,
      },
      { key: 'Rank', note: 'Off — calculated but not printed', kind: 'switch', on: false },
    ],
  },
  {
    id: 'delivery',
    title: 'Issue & delivery',
    note: 'How a report card reaches a guardian',
    icon: 'ti ti-share',
    badge: { tone: 'is-accent', label: 'Portal + print' },
    rows: [
      {
        key: 'Published to the portal',
        note: 'Guardians see it the same evening as the meeting',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Printed copy',
        note: 'Handed over at the parent–teacher meeting',
        kind: 'switch',
        on: true,
      },
      { key: 'Emailed as a PDF', note: 'Off — the portal is the record', kind: 'switch', on: false },
      {
        key: 'Withheld on unpaid fees',
        note: 'Off — the school decided against it in 2023',
        kind: 'switch',
        on: false,
      },
    ],
  },
];

/** The worked example the report-card section prints. */
export const PREVIEW_MARKS = [
  { subject: 'English', mark: 82, band: 'A2' },
  { subject: 'Mathematics', mark: 91, band: 'A1' },
  { subject: 'Science', mark: 76, band: 'B1' },
  { subject: 'Social Science', mark: 68, band: 'B2' },
  { subject: 'Hindi', mark: 74, band: 'B1' },
  { subject: 'Computer Science', mark: 88, band: 'A2' },
];

export const PREVIEW_TOTAL = PREVIEW_MARKS.reduce((total, row) => total + row.mark, 0);
export const PREVIEW_MAX = PREVIEW_MARKS.length * 100;
export const PREVIEW_PERCENT = Math.round((PREVIEW_TOTAL / PREVIEW_MAX) * 1000) / 10;

/** Which band a mark falls in — the ladder, read downwards. */
export const bandOf = (mark: number) =>
  BANDS.find((band) => mark >= band.from) ?? BANDS[BANDS.length - 1];

export const PREVIEW_ATTENDANCE = { present: 64, of: 68 };
export const PREVIEW_PERCENT_ATTENDANCE = Math.round(
  (PREVIEW_ATTENDANCE.present / PREVIEW_ATTENDANCE.of) * 100,
);

/* ------------------------------------------------------------------ *
 * Preferences                                                        *
 * ------------------------------------------------------------------ */

export const PREFERENCE_GROUPS: { title: string; rows: SettingRow[] }[] = [
  {
    title: 'Marks entry',
    rows: [
      {
        key: 'Entry method',
        note: 'Subject teacher enters, subject head verifies',
        kind: 'select',
        options: ['Teacher then verify', 'Teacher only', 'Bulk upload'],
      },
      { key: 'Bulk upload', note: 'A spreadsheet in the school template', kind: 'switch', on: true },
      { key: 'Decimal marks', note: 'Off — whole marks only', kind: 'switch', on: false },
      {
        key: 'Absent handling',
        note: 'Recorded as AB, not zero, so it does not drag the average',
        kind: 'switch',
        on: true,
      },
    ],
  },
  {
    title: 'What teachers and guardians see',
    rows: [
      {
        key: 'Class average on the report card',
        note: 'Off — it invites comparison',
        kind: 'switch',
        on: false,
      },
      {
        key: 'Subject average to the teacher',
        note: 'On — useful for moderation',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Previous term marks alongside',
        note: 'On, so progress is visible',
        kind: 'switch',
        on: true,
      },
      {
        key: 'Guardian sees marks before the meeting',
        note: 'Off — released after the meeting',
        kind: 'switch',
        on: false,
      },
    ],
  },
  {
    title: 'Language & format',
    rows: [
      {
        key: 'Report card language',
        note: 'English',
        kind: 'select',
        options: ['English', 'Tamil', 'Bilingual'],
      },
      {
        key: 'Date format',
        note: '31 Jul 2026',
        kind: 'select',
        options: ['31 Jul 2026', '2026-07-31', '07/31/2026'],
      },
      {
        key: 'Grade nomenclature',
        note: 'A1 to E, as the board uses',
        kind: 'select',
        options: ['A1 – E', 'A – F', 'Descriptive'],
      },
      {
        key: 'Number format',
        note: 'Indian — 1,428 not 1,428',
        kind: 'select',
        options: ['Indian', 'International'],
      },
    ],
  },
];

export const RESTORE_NOTE =
  'Restoring returns grading, assessment, promotion and attendance policies to the board’s default configuration. Grades, sections, subjects and every mark already recorded are untouched.';

/* ------------------------------------------------------------------ *
 * Audit and the decision trail                                       *
 * ------------------------------------------------------------------ */

export interface AuditEntry {
  date: string;
  time: string;
  what: string;
  who: string;
}

export const AUDIT_ENTRIES: AuditEntry[] = [
  {
    date: '31 Jul 2026',
    time: '16:20',
    what: 'Homework digest rule switched off',
    who: 'Ms. Latha Rao · SMS template still a draft',
  },
  {
    date: '28 Jul 2026',
    time: '11:05',
    what: 'Credit system marked as a draft for the middle stage',
    who: 'Academic Head · awaiting committee approval',
  },
  {
    date: '22 Jul 2026',
    time: '09:40',
    what: 'Grace marks raised from 3 to 5',
    who: 'Dr. Anitha Krishnan · approved by the academic committee',
  },
  {
    date: '12 Jul 2026',
    time: '14:12',
    what: '2027 – 28 created as a draft year',
    who: 'Ms. Latha Rao · structure copied, calendar not carried over',
  },
  {
    date: '04 Jun 2026',
    time: '10:30',
    what: 'Rank publication switched off on report cards',
    who: 'Academic committee · minute 2026/AC/07',
  },
  {
    date: '02 Apr 2026',
    time: '08:15',
    what: 'Academic calendar published',
    who: `Dr. Anitha Krishnan · ${WORKING_DAYS} working days, ${TOTAL_HOLIDAYS} holidays`,
  },
  {
    date: '02 Feb 2026',
    time: '15:00',
    what: 'CBSE 2026 curriculum adopted',
    who: 'Academic committee · board circular 2026/AC/11',
  },
  {
    date: '14 Jan 2026',
    time: '09:00',
    what: `Academic year ${YEAR_LABEL} created`,
    who: 'Ms. Latha Rao · carried forward from 2025 – 26',
  },
];

export interface Decision {
  title: string;
  when: string;
  text: string;
}

export const DECISIONS: Decision[] = [
  {
    title: 'Academic year created',
    when: '14 Jan 2026 · 09:00',
    text: 'Carried forward from 2025 – 26 with the grade structure, sections and subject list intact.',
  },
  {
    title: 'Curriculum updated',
    when: '02 Feb 2026 · 15:00',
    text: 'CBSE 2026 adopted following board circular 2026/AC/11. Tamil and value education kept as local additions.',
  },
  {
    title: 'Grading rules modified',
    when: '04 Jun 2026 · 10:30',
    text: 'Rank publication switched off on report cards. The scale itself was left alone; only what is printed changed.',
  },
  {
    title: 'Promotion policy updated',
    when: '22 Jul 2026 · 09:40',
    text: 'Grace marks raised from three to five, in at most two subjects, and always recorded on the mark sheet.',
  },
  {
    title: 'Academic calendar published',
    when: '02 Apr 2026 · 08:15',
    text: `${WORKING_DAYS} working days, ${TOTAL_HOLIDAYS} holidays and ${EXAM_CYCLES.length} examination cycles. Amendable only by the Principal after this point.`,
  },
  {
    title: 'Configuration activated',
    when: 'Active since 06 Apr 2026',
    text: `Live for ${STUDENTS_ENROLLED.toLocaleString('en-IN')} students and ${TEACHING_STAFF} teaching staff. Four changes are still drafts and are not yet in effect.`,
  },
];

/* ------------------------------------------------------------------ *
 * Notes and recommendations                                          *
 * ------------------------------------------------------------------ */

export interface Recommendation {
  tag: string;
  title: string;
  text: string;
  action: string;
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    tag: 'Policy',
    title: 'Publish the four draft changes together',
    text: 'Four settings are held as drafts: the homework digest, the middle-stage credit system, an academic policy default and a term-2 activity entry. Publishing them one at a time means four notices to every teacher. One publication would do.',
    action: 'Open publication',
  },
  {
    tag: 'Curriculum',
    title: 'Map the board’s learning outcomes',
    text: 'The outcome list has been published for every subject and grade since February. Mapping it would let a report card say what a student can do, not only what they scored. It is a term of work for the academic team.',
    action: 'Import outcome list',
  },
  {
    tag: 'Capacity',
    title: 'Two sections are above the ceiling',
    text: `${OVER_CAPACITY[0]} holds 42 and ${OVER_CAPACITY[1]} holds 41, against a stated maximum of ${MAX_CLASS_SIZE}. Either the ceiling is not the real policy, or two more sections are needed before the next intake.`,
    action: 'Review sections',
  },
  {
    tag: 'Assessment',
    title: 'Internal marks are clustering high',
    text: 'Six sections averaged above 18 of 20 on internal assessment last term. The moderation rule exists for exactly this and has not been triggered, which suggests the threshold is set too high.',
    action: 'Review moderation',
  },
  {
    tag: 'Attendance',
    title: 'Eleven students are below 80%',
    text: 'They are still above the 75% line but the warning letter has not gone out, because the trigger is set at 80% and fires only at term end. Firing it monthly would give families time to act.',
    action: 'Review policy',
  },
  {
    tag: 'Best practice',
    title: 'Rank is calculated but not published',
    text: 'This has held since June 2024 and is worth keeping. Rank is available to the class teacher, who can use it in a conversation, without turning a report card into a league table.',
    action: 'Read the note',
  },
  {
    tag: 'Note',
    title: 'Term 3 activities are usually fixed in December',
    text: 'The activity calendar shows Term 3 as pending. This is normal at this point in the year rather than an omission; inter-house events are set once the examination dates are confirmed.',
    action: 'Open calendar',
  },
];

/* ------------------------------------------------------------------ *
 * What the page counts about itself                                  *
 * ------------------------------------------------------------------ */

const DRAFT_CARDS = [
  ...GENERAL_CARDS,
  ...YEAR_CARDS,
  ...TERM_CARDS,
  ...GRADE_CARDS,
  ...CURRICULUM_CARDS,
  ...GRADING_CARDS,
  ...ASSESSMENT_CARDS,
  ...EXAM_CARDS,
  ...ATTENDANCE_CARDS,
  ...TIMETABLE_CARDS,
  ...CERTIFICATE_CARDS,
  ...REPORT_CARDS,
];

/**
 * The changes the hero counts as unpublished.
 *
 * The template names four: the homework digest, the middle-stage credit system,
 * an academic policy default and a term-2 activity entry. Three of those are
 * cards carrying a draft badge; the fourth is the homework rule that is
 * switched off, so both are counted.
 */
export const UNPUBLISHED_CHANGES =
  DRAFT_CARDS.filter((card) => card.badge?.tone === 'is-draft' && card.foot?.includes('unpublished'))
    .length +
  GENERAL_CARDS.filter((card) => card.badge?.label === '1 draft').length +
  HOMEWORK_RULES.filter((rule) => !rule.on).length +
  ACTIVITY_ROWS.filter((row) => row.value === 'Pending').length;

export const SECTIONS_LIST: Section[] = [
  {
    id: 'general',
    group: 'Structure',
    label: 'General',
    title: 'General',
    sub: 'What kind of school this configuration describes.',
  },
  {
    id: 'year',
    group: 'Structure',
    label: 'Academic Year',
    title: 'Academic Year',
    sub: 'The scope for everything else on this page.',
    tag: '2',
  },
  {
    id: 'terms',
    group: 'Structure',
    label: 'Terms & Semesters',
    title: 'Terms & Semesters',
    sub: 'How the year is divided, and what each division carries.',
    tag: String(TERMS.length),
  },
  {
    id: 'grades',
    group: 'Structure',
    label: 'Grades & Classes',
    title: 'Grades & Classes',
    sub: 'Twelve grades in four stages.',
    tag: '12',
  },
  {
    id: 'sections',
    group: 'Structure',
    label: 'Sections',
    title: 'Sections',
    sub: 'Where the students actually sit.',
    tag: String(TOTAL_SECTIONS),
  },
  {
    id: 'subjects',
    group: 'Curriculum',
    label: 'Subjects',
    title: 'Subjects',
    sub: 'Twenty-four subjects, and what each is worth.',
    tag: String(SUBJECTS.length),
  },
  {
    id: 'curriculum',
    group: 'Curriculum',
    label: 'Curriculum',
    title: 'Curriculum',
    sub: 'What the school teaches against.',
    tag: 'CBSE',
  },
  {
    id: 'grading',
    group: 'Assessment',
    label: 'Grading System',
    title: 'Grading System',
    sub: 'How a mark becomes a grade.',
    tag: String(BANDS.length),
  },
  {
    id: 'assessment',
    group: 'Assessment',
    label: 'Assessment Rules',
    title: 'Assessment Rules',
    sub: 'What a subject mark is made of.',
    tag: '6',
  },
  {
    id: 'exams',
    group: 'Assessment',
    label: 'Examinations',
    title: 'Examinations',
    sub: 'Five cycles, and what happens after each.',
    tag: String(EXAM_CYCLES.length),
  },
  {
    id: 'promotion',
    group: 'Progression',
    label: 'Promotion Rules',
    title: 'Promotion Rules',
    sub: 'Who moves up, and who decides.',
    tag: String(PROMOTION_RULES.length),
  },
  {
    id: 'attendance',
    group: 'Progression',
    label: 'Attendance Policies',
    title: 'Attendance Policies',
    sub: 'The register, and what it decides.',
    tag: '5',
  },
  {
    id: 'timetable',
    group: 'Operations',
    label: 'Timetable Rules',
    title: 'Timetable Rules',
    sub: 'What the timetable may and may not do.',
    tag: '6',
  },
  {
    id: 'homework',
    group: 'Operations',
    label: 'Homework Policies',
    title: 'Homework Policies',
    sub: 'How much, how often, and why it is capped.',
    tag: String(HOMEWORK_RULES.length),
  },
  {
    id: 'calendar',
    group: 'Operations',
    label: 'Academic Calendar',
    title: 'Academic Calendar',
    sub: `${WORKING_DAYS} working days, laid out.`,
    tag: String(CALENDAR_EVENTS.length),
  },
  {
    id: 'certificates',
    group: 'Output',
    label: 'Certificates',
    title: 'Certificates',
    sub: 'What the school issues, and how it is signed.',
    tag: String(CERTIFICATE_TYPES.length),
  },
  {
    id: 'reportcards',
    group: 'Output',
    label: 'Report Cards',
    title: 'Report Cards',
    sub: 'What a guardian receives at the end of a term.',
    tag: '4',
  },
  {
    id: 'preferences',
    group: 'Output',
    label: 'Academic Preferences',
    title: 'Academic Preferences',
    sub: 'The smaller choices, grouped.',
  },
  {
    id: 'audit',
    group: 'Output',
    label: 'Audit History',
    title: 'Audit History',
    sub: 'Every change, with the name against it.',
    tag: String(AUDIT_TOTAL),
  },
];

export const NAV_GROUPS = ['Structure', 'Curriculum', 'Assessment', 'Progression', 'Operations', 'Output'].map(
  (group) => ({ group, sections: SECTIONS_LIST.filter((section) => section.group === group) }),
);

/** The number the template prints on each section heading — "Section 01". */
export const sectionNumberOf = (id: SectionId) =>
  String(SECTIONS_LIST.findIndex((section) => section.id === id) + 1).padStart(2, '0');
