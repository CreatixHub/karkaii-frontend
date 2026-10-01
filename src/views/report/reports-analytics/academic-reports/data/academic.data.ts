/* ------------------------------- The register ------------------------------ */

export const REGISTER_TOTAL = 507;
export const ACADEMIC_YEAR = '2026-2027';
export const PASS_MARK = 33;

/**
 * The grading scale, printed in full on the Grade Distribution report.
 * Ordered high to low; the first floor a percentage clears is its grade.
 */
export const GRADE_SCALE: { grade: string; floor: number; remark: string }[] = [
  { grade: 'A+', floor: 91, remark: 'Outstanding' },
  { grade: 'A', floor: 81, remark: 'Excellent' },
  { grade: 'B+', floor: 71, remark: 'Very Good' },
  { grade: 'B', floor: 61, remark: 'Good' },
  { grade: 'C+', floor: 51, remark: 'Above Average' },
  { grade: 'C', floor: 41, remark: 'Average' },
  { grade: 'D', floor: PASS_MARK, remark: 'Below Average' },
  { grade: 'E', floor: 0, remark: 'Needs Improvement' },
];

/* --------------------------------- Shapes ---------------------------------- */

export type ReportType =
  | 'Student Report Card'
  | 'Class Performance Report'
  | 'Subject Analysis Report'
  | 'Term Consolidated Report'
  | 'Grade Distribution Report'
  | 'Progress Report';

export type ReportStatus =
  | 'Published'
  | 'Reviewed'
  | 'Pending Review'
  | 'Ready to Generate'
  | 'Awaiting Marks'
  | 'Scheduled';

/** One line of the performance panel: a subject, or a section on the analysis. */
export interface MarkLine {
  label: string;
  /** null where the mark has not been entered. */
  marks: number | null;
}

export interface RemarkEntry {
  author: string;
  role: string;
  body: string;
}

export interface ListEntry {
  title: string;
  detail: string;
}

/** The attendance block, which reads differently per scope. */
export interface AttendanceBlock {
  workingDays?: number;
  present?: number;
  lateMarks?: number;
  /** Class and section reports print a strength and a section rate instead. */
  strength?: number;
  sectionAttendance?: number;
  atPassMark?: number;
  /** The subject analysis counts students across sections. */
  studentsCovered?: number;
  sections?: number;
  /** What a scheduled report says in place of a figure. */
  note?: string;
  term: string;
}

export interface RankBlock {
  rank?: number;
  outOf?: number;
  /** "Class X B" or "Grade IX sections". */
  cohort?: string;
  previousRank?: number;
  previousExam?: string;
  gradeRank?: number;
  gradeOutOf?: number;
  /** Set where a rank cannot be placed; the panel prints this instead. */
  withheld?: string;
}

export interface AcademicReport {
  id: string;
  year: string;
  name: string;
  type: ReportType;
  scope: string;
  scopeNote: string;
  exam: string;
  examRef: string;
  examWindow: string;

  /** The "N subjects" figure on the grid, which is not always the line count. */
  subjectCount: number;
  /** Subjects on most reports; the compared sections on a subject analysis. */
  lines: MarkLine[];
  lineNoun: 'subject' | 'section';

  generatedOn?: string;
  generatedBy?: string;
  sentOn?: string;
  reviewedBy?: string;
  reviewedOn?: string;
  sharedOn?: string;
  sharedNote?: string;
  scheduledFor?: string;
  scheduledNote?: string;
  marksClosedOn?: string;

  rank: RankBlock;
  attendance: AttendanceBlock;
  remarks: RemarkEntry[];
  exports: ListEntry[];
  noteTags: string[];
  note: string;
  template: string;
  gradingScale: string;
}

/* --------------------------------- The rows -------------------------------- */

export const academicReports: AcademicReport[] = [
  {
    id: 'ACR-2026-0341',
    year: ACADEMIC_YEAR,
    name: 'Ananya Rao — Term 1 Report Card',
    type: 'Student Report Card',
    scope: 'Ananya Rao',
    scopeNote: 'AD9887402 · Class X B',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 6,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: 90 },
      { label: 'Mathematics', marks: 96 },
      { label: 'Science', marks: 93 },
      { label: 'Social Science', marks: 89 },
      { label: 'Hindi', marks: 85 },
      { label: 'Computer Science', marks: 97 },
    ],
    marksClosedOn: '24 Jul 2026',
    generatedOn: '27 Jul 2026',
    generatedBy: 'Mrs. Ellen Cruz',
    reviewedBy: 'Mrs. Kalpana Menon',
    reviewedOn: '28 Jul 2026',
    sharedOn: '29 Jul 2026',
    sharedNote: 'Shared 29 Jul',
    rank: { rank: 1, outOf: 46, cohort: 'Class X B', previousRank: 2, previousExam: 'Unit Test 1', gradeRank: 1, gradeOutOf: 138 },
    attendance: { workingDays: 96, present: 93, lateMarks: 1, term: '6 Jul - 17 Jul 2026' },
    remarks: [
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Class Teacher',
        body: 'Consistent across every paper. Moved up one place from the Unit Test 1 position.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Science',
        body: 'Practical record is the best in the section. Suggested for the Science Olympiad panel.',
      },
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Hindi',
        body: 'Weakest of the six papers at 85. Comprehension answers need more detail.',
      },
    ],
    exports: [
      { title: 'Shared with guardians', detail: '29 Jul 2026 · Parent portal · Mrs. Ellen Cruz' },
      { title: 'Exported as PDF', detail: '29 Jul 2026 · Term report card, A4 portrait · 214 KB' },
      { title: 'Printed', detail: '30 Jul 2026 · 1 copy · school office counter 2' },
    ],
    noteTags: ['Top of the section', 'Shared with guardians'],
    note: 'Certificate GEN-2026-0455 was raised from this result and collected on 26 Jul.',
    template: 'Term report card, A4 portrait',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0344',
    year: ACADEMIC_YEAR,
    name: 'Class IX C — Term 1 Performance Summary',
    type: 'Class Performance Report',
    scope: 'Class IX C',
    scopeNote: '42 students · Grade IX',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 6,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: 72.4 },
      { label: 'Mathematics', marks: 64.8 },
      { label: 'Science', marks: 70.1 },
      { label: 'Social Science', marks: 68.5 },
      { label: 'Hindi', marks: 73.2 },
      { label: 'Computer Science', marks: 77.9 },
    ],
    marksClosedOn: '24 Jul 2026',
    generatedOn: '28 Jul 2026',
    generatedBy: 'Mr. Arjun Kale',
    sentOn: '30 Jul 2026',
    reviewedBy: 'Mrs. Kalpana Menon',
    reviewedOn: '30 Jul 2026',
    rank: { rank: 2, outOf: 3, cohort: 'Grade IX sections', previousRank: 3, previousExam: 'Unit Test 1' },
    attendance: {
      workingDays: 96,
      strength: 42,
      sectionAttendance: 92.4,
      atPassMark: 39,
      term: '6 Jul - 17 Jul 2026',
    },
    remarks: [
      {
        author: 'Mr. Arjun Kale',
        role: 'Class Teacher',
        body: 'Mathematics pulls the section mean down. Three students carry the only failures.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        body: 'Reviewed on 30 Jul. Holding publication until the Mathematics remedial plan is attached.',
      },
      {
        author: 'Ms. Deepa Rawat',
        role: 'Computer Science',
        body: 'Best paper in the section at 77.9. Project work lifted the mean by four marks.',
      },
    ],
    exports: [
      { title: 'Exported as Excel', detail: '30 Jul 2026 · Section mark sheet · 96 KB' },
      { title: 'Sent for review', detail: '30 Jul 2026 · Academic Coordinator' },
    ],
    noteTags: ['Reviewed, not published', 'Remedial plan pending'],
    note:
      'Publication is held until Mr. Arjun Kale attaches the Mathematics remedial plan for the three students below the pass mark.',
    template: 'Section mark sheet, A4 landscape',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0347',
    year: ACADEMIC_YEAR,
    name: 'Aarav Kumar — Term 1 Report Card',
    type: 'Student Report Card',
    scope: 'Aarav Kumar',
    scopeNote: 'AD9891255 · Class VII A',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 6,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: 74 },
      { label: 'Mathematics', marks: 68 },
      { label: 'Science', marks: 79 },
      { label: 'Social Science', marks: 71 },
      { label: 'Hindi', marks: 66 },
      { label: 'Computer Science', marks: 81 },
    ],
    marksClosedOn: '24 Jul 2026',
    generatedOn: '30 Jul 2026',
    generatedBy: 'Mrs. Sofia Alvarez',
    sentOn: '30 Jul 2026',
    rank: { rank: 11, outOf: 44, cohort: 'Class VII A', previousRank: 9, previousExam: 'Unit Test 1', gradeRank: 28, gradeOutOf: 132 },
    attendance: { workingDays: 96, present: 88, lateMarks: 4, term: '6 Jul - 17 Jul 2026' },
    remarks: [
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Class Teacher',
        body: 'Steady work but slipped two places. Eight absences in the term show in the Hindi score.',
      },
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        body: 'Sixty-eight is below the section mean. Recommended for the Saturday problem clinic.',
      },
    ],
    exports: [{ title: 'Sent for review', detail: '30 Jul 2026 · Academic Coordinator' }],
    noteTags: ['Awaiting review', 'Attendance flagged'],
    note: 'Cannot be shared with guardians until the Academic Coordinator signs off. Sent for review on 30 Jul.',
    template: 'Term report card, A4 portrait',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0350',
    year: ACADEMIC_YEAR,
    name: 'Mathematics — Classes VI to VIII Subject Analysis',
    type: 'Subject Analysis Report',
    scope: 'Classes VI to VIII',
    scopeNote: '6 sections · 262 students',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 1,
    lineNoun: 'section',
    lines: [
      { label: 'Class VI A', marks: 68.2 },
      { label: 'Class VI B', marks: 65.7 },
      { label: 'Class VII A', marks: 71.4 },
      { label: 'Class VII B', marks: 69.8 },
      { label: 'Class VIII A', marks: 63.5 },
      { label: 'Class VIII B', marks: 66.9 },
    ],
    marksClosedOn: '24 Jul 2026',
    generatedOn: '26 Jul 2026',
    generatedBy: 'Mr. Vikram Sethi',
    reviewedBy: 'Mrs. Kalpana Menon',
    reviewedOn: '28 Jul 2026',
    sharedOn: '28 Jul 2026',
    sharedNote: 'Shared 28 Jul',
    rank: {},
    attendance: { studentsCovered: 262, atPassMark: 231, sections: 6, term: '6 Jul - 17 Jul 2026' },
    remarks: [
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        body: 'Class VIII A at 63.5 is the weakest of the six. Algebra carries most of the loss.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Head of Department',
        body: 'Class VII A at 71.4 is the only section above the B+ line. Same paper across all six.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        body: 'Published to the subject panel on 28 Jul for the department meeting on 3 Aug.',
      },
    ],
    exports: [
      { title: 'Exported as PDF', detail: '28 Jul 2026 · Subject analysis, A4 landscape · 188 KB' },
      { title: 'Shared with the subject panel', detail: '28 Jul 2026 · Staff portal · 9 teachers' },
      { title: 'Exported as Excel', detail: '29 Jul 2026 · Section comparison · 74 KB' },
    ],
    noteTags: ['Department review', 'Published'],
    note:
      'Tabled at the Mathematics department meeting on 3 Aug 2026 along with the Class VIII A remedial proposal.',
    template: 'Subject analysis, A4 landscape',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0353',
    year: ACADEMIC_YEAR,
    name: 'Kabir Shah — Term 1 Report Card',
    type: 'Student Report Card',
    scope: 'Kabir Shah',
    scopeNote: 'AD9892008 · Class VI B',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 6,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: 71 },
      { label: 'Mathematics', marks: 63 },
      { label: 'Science', marks: null },
      { label: 'Social Science', marks: 69 },
      { label: 'Hindi', marks: 74 },
      { label: 'Computer Science', marks: 77 },
    ],
    rank: {
      withheld: 'A rank cannot be placed while a subject is missing. Unit Test 1 position was 19.',
    },
    attendance: { workingDays: 96, present: 81, lateMarks: 6, term: '6 Jul - 17 Jul 2026' },
    remarks: [
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        body: 'Report card cannot be generated with a subject missing. Rank is withheld for the same reason.',
      },
      {
        author: 'Ms. Meera Nair',
        role: 'Class Teacher',
        body: 'Fifteen absences in the term. Guardian meeting recorded on 22 Jul.',
      },
    ],
    exports: [],
    noteTags: ['1 subject missing', 'Rank withheld'],
    note:
      'Mr. Vikram Sethi has the Class VI B practical register. Marks entry MRK-2026-0218 has been open since 21 Jul.',
    template: 'Term report card, A4 portrait',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0356',
    year: ACADEMIC_YEAR,
    name: 'Class V A — Consolidated Term Report',
    type: 'Term Consolidated Report',
    scope: 'Class V A',
    scopeNote: '38 students · Grade V',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 5,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: 76.8 },
      { label: 'Mathematics', marks: 72.4 },
      { label: 'EVS', marks: 79.6 },
      { label: 'Hindi', marks: 74.1 },
      { label: 'Computer Science', marks: 81.2 },
    ],
    marksClosedOn: '24 Jul 2026',
    rank: { rank: 1, outOf: 2, cohort: 'Grade V sections', previousRank: 1, previousExam: 'Unit Test 1' },
    attendance: {
      workingDays: 96,
      strength: 38,
      sectionAttendance: 94.1,
      atPassMark: 37,
      term: '6 Jul - 17 Jul 2026',
    },
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        body: 'All five subject means are above 72. Only one student is below the pass mark.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        body: 'Marks closed on 30 Jul. Cleared to run once the guardian meeting list is attached.',
      },
    ],
    exports: [],
    noteTags: ['Marks complete', 'Not yet run'],
    note:
      'Every subject was signed off on 30 Jul. Held one day so the consolidated report and the guardian meeting notes go out together on 1 Aug.',
    template: 'Consolidated term sheet, A4 portrait',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0359',
    year: ACADEMIC_YEAR,
    name: 'Grade Distribution — Classes IX and X',
    type: 'Grade Distribution Report',
    scope: 'Classes IX and X',
    scopeNote: '5 sections · 218 students',
    exam: 'Unit Test 2',
    examRef: 'EXM-2026-017',
    examWindow: '27 Jul - 31 Jul 2026',
    subjectCount: 6,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: null },
      { label: 'Mathematics', marks: null },
      { label: 'Science', marks: null },
      { label: 'Social Science', marks: null },
      { label: 'Hindi', marks: null },
      { label: 'Computer Science', marks: null },
    ],
    scheduledFor: '5 Aug 2026',
    scheduledNote: '5 Aug · 8:00 AM',
    rank: { withheld: 'Ranks are placed once Unit Test 2 marks are published.' },
    attendance: {
      studentsCovered: 218,
      sections: 5,
      note: 'Compiled with the run',
      term: '27 Jul - 31 Jul 2026',
    },
    remarks: [
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        body:
          'Standing schedule. The run is skipped automatically if any section still has open marks entry.',
      },
    ],
    exports: [],
    noteTags: ['Scheduled run', 'Waiting on the exam'],
    note: 'Unit Test 2 finishes on 31 Jul and marks close on 4 Aug. The run is set for the morning after.',
    template: 'Grade distribution, A4 landscape',
    gradingScale: 'A+ to E · 8 point',
  },

  {
    id: 'ACR-2026-0362',
    year: ACADEMIC_YEAR,
    name: 'Lisa Gourley — Progress Report',
    type: 'Progress Report',
    scope: 'Lisa Gourley',
    scopeNote: 'AD9892431 · Class II B',
    exam: 'Term 1 Exam',
    examRef: 'EXM-2026-014',
    examWindow: '6 Jul - 17 Jul 2026',
    subjectCount: 4,
    lineNoun: 'subject',
    lines: [
      { label: 'English', marks: 92 },
      { label: 'Mathematics', marks: 89 },
      { label: 'EVS', marks: 94 },
      { label: 'Hindi', marks: 87 },
    ],
    marksClosedOn: '24 Jul 2026',
    generatedOn: '25 Jul 2026',
    generatedBy: 'Ms. Grace Otieno',
    reviewedBy: 'Mrs. Kalpana Menon',
    reviewedOn: '26 Jul 2026',
    sharedOn: '27 Jul 2026',
    sharedNote: 'Shared 27 Jul',
    rank: { rank: 3, outOf: 41, cohort: 'Class II B', previousRank: 5, previousExam: 'Unit Test 1', gradeRank: 7, gradeOutOf: 82 },
    attendance: { workingDays: 96, present: 91, lateMarks: 0, term: '6 Jul - 17 Jul 2026' },
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        body: 'Two places up from Unit Test 1. Reading fluency is well ahead of the section.',
      },
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Library',
        body: 'Completed the Junior Reading Challenge. Participation certificate is in job GEN-2026-0451.',
      },
    ],
    exports: [
      { title: 'Shared with guardians', detail: '27 Jul 2026 · Parent portal · Ms. Grace Otieno' },
      { title: 'Exported as PDF', detail: '27 Jul 2026 · Junior progress report · 162 KB' },
    ],
    noteTags: ['Junior section', 'Shared with guardians'],
    note:
      'No grade point is printed for the junior section. Marks are shown against a descriptive band only.',
    template: 'Junior progress report, A4 portrait',
    gradingScale: 'Descriptive bands',
  },
];

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

/** Lines carrying a mark. A report with fewer than its subjects is incomplete. */
export const enteredOf = (row: AcademicReport) => row.lines.filter((line) => line.marks !== null).length;

export const isCompleteOf = (row: AcademicReport) => enteredOf(row) === row.lines.length;

export const obtainedOf = (row: AcademicReport) =>
  round1(row.lines.reduce((total, line) => total + (line.marks ?? 0), 0));

/** Each paper is out of a hundred, so the total follows the lines entered. */
export const totalOf = (row: AcademicReport) => enteredOf(row) * 100;

/** The panel's "Average per Subject", which is also its Percentage. */
export const averageOf = (row: AcademicReport) => {
  const entered = enteredOf(row);
  return entered === 0 ? null : round1(obtainedOf(row) / entered);
};

export const gradeOf = (percentage: number) =>
  GRADE_SCALE.find((step) => percentage >= step.floor) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

/** Applied to a single line; the same scale the overall grade uses. */
export const lineGradeOf = (line: MarkLine) => (line.marks === null ? null : gradeOf(line.marks).grade);

/**
 * The overall grade, or Withheld.
 *
 * A grade cannot be placed while a subject is missing — Kabir Shah's panel
 * says so in as many words — and a report whose exam has not been marked has
 * nothing to grade at all.
 */
export const overallGradeOf = (row: AcademicReport) => {
  const average = averageOf(row);
  if (average === null || !isCompleteOf(row)) return null;
  return gradeOf(average);
};

export const gradeTint = (grade: string) => {
  if (grade === 'A+' || grade === 'A') return 'success';
  if (grade === 'B+' || grade === 'B') return 'info';
  if (grade === 'C+' || grade === 'C') return 'warning';
  return 'danger';
};

/** The panel's grade breakdown: how many lines landed on each grade. */
export const breakdownOf = (row: AcademicReport) => {
  const counts = new Map<string, number>();
  row.lines.forEach((line) => {
    const grade = lineGradeOf(line);
    if (grade) counts.set(grade, (counts.get(grade) ?? 0) + 1);
  });
  return GRADE_SCALE.filter((step) => counts.has(step.grade)).map((step) => ({
    grade: step.grade,
    count: counts.get(step.grade) as number,
  }));
};

const marked = (row: AcademicReport) => row.lines.filter((line) => line.marks !== null);

export const highestOf = (row: AcademicReport) => {
  const list = marked(row);
  return list.length === 0
    ? null
    : list.reduce((best, line) => ((line.marks ?? 0) > (best.marks ?? 0) ? line : best));
};

export const lowestOf = (row: AcademicReport) => {
  const list = marked(row);
  return list.length === 0
    ? null
    : list.reduce((worst, line) => ((line.marks ?? 0) < (worst.marks ?? 0) ? line : worst));
};

/** The spread between the strongest and weakest line, as the analysis prints it. */
export const spreadOf = (row: AcademicReport) => {
  const high = highestOf(row);
  const low = lowestOf(row);
  return high && low ? round1((high.marks ?? 0) - (low.marks ?? 0)) : null;
};

export const atPassMarkOf = (row: AcademicReport) =>
  marked(row).filter((line) => (line.marks ?? 0) >= PASS_MARK).length;

/* --------------------------------- Status ---------------------------------- */

/**
 * The report's own state, read off what has happened to it.
 *
 * Scheduled runs come first because their exam has not been sat. A subject
 * missing holds the report at Awaiting Marks; a complete one that has never
 * run is Ready to Generate; once it has run it is Pending Review until someone
 * reviews it, and Published once it has been shared.
 */
export const statusOf = (row: AcademicReport): ReportStatus => {
  if (row.scheduledFor) return 'Scheduled';
  if (!isCompleteOf(row)) return 'Awaiting Marks';
  if (!row.generatedOn) return 'Ready to Generate';
  if (row.sharedOn) return 'Published';
  if (row.reviewedBy && row.reviewedOn) return 'Reviewed';
  return 'Pending Review';
};

export const statusPill: Record<ReportStatus, string> = {
  Published: 'is-completed',
  Reviewed: 'is-active',
  'Pending Review': 'is-review',
  'Ready to Generate': 'is-pending',
  'Awaiting Marks': 'is-blocked',
  Scheduled: 'is-inactive',
};

/** The second line of the Report Status cell. */
export const statusNoteOf = (row: AcademicReport) => {
  switch (statusOf(row)) {
    case 'Published':
      return row.sharedNote ?? `Shared ${row.sharedOn}`;
    case 'Reviewed':
      return `${row.reviewedBy} · ${row.reviewedOn?.replace(' 2026', '')}`;
    case 'Pending Review':
      return `Sent ${row.sentOn?.replace(' 2026', '')}`;
    case 'Ready to Generate':
      return `Marks closed ${row.marksClosedOn?.replace(' 2026', '')}`;
    case 'Awaiting Marks':
      return `${enteredOf(row)} of ${row.lines.length} subjects in`;
    default:
      return row.scheduledNote ?? '';
  }
};

/* -------------------------- The grid's middle cells ------------------------- */

/** "6 of 6 marks entered", "6 sections compared", or nothing published yet. */
export const subjectNoteOf = (row: AcademicReport) => {
  if (row.lineNoun === 'section') return `${row.lines.length} sections compared`;
  if (enteredOf(row) === 0) return 'marks not published';
  return `${enteredOf(row)} of ${row.lines.length} marks entered`;
};

/** "550 of 600 marks", "42 students · 71.1% mean", or why there are none. */
export const marksNoteOf = (row: AcademicReport) => {
  if (enteredOf(row) === 0) return 'source exam not held';
  if (row.attendance.strength) return `${row.attendance.strength} students · ${averageOf(row)}% mean`;
  if (row.lineNoun === 'section') return `${row.lines.length} sections · ${averageOf(row)}% mean`;
  if (!isCompleteOf(row)) return `provisional, ${enteredOf(row)} of ${row.lines.length} subjects`;
  return `${obtainedOf(row)} of ${totalOf(row)} marks`;
};

/** How the Generated On cell reads, given the report may never have run. */
export const generatedNoteOf = (row: AcademicReport, today = 31) => {
  if (row.scheduledFor) {
    const day = Number(row.scheduledFor.split(' ')[0]);
    /* The schedule sits in August, so the gap runs past the end of July. */
    const days = day + 31 - today;
    return { value: '—', note: `runs ${row.scheduledFor.replace(' 2026', '')}`, ago: `in ${days} days` };
  }
  if (!row.generatedOn) return { value: '—', note: 'cleared, not run', ago: '' };
  const day = Number(row.generatedOn.split(' ')[0]);
  const gap = today - day;
  const ago = gap === 0 ? 'today' : gap === 1 ? 'yesterday' : `${gap} days ago`;
  return { value: row.generatedOn, note: row.generatedBy ?? '', ago };
};

/* -------------------------------- Rank block -------------------------------- */

/** Up 1 / Down 2 / No change, from the two ranks rather than beside them. */
export const movementOf = (rank: RankBlock) => {
  if (rank.rank === undefined || rank.previousRank === undefined) return null;
  const moved = rank.previousRank - rank.rank;
  if (moved === 0) return { label: 'No change', tint: 'secondary', icon: 'ti ti-minus' };
  return moved > 0
    ? { label: `Up ${moved}`, tint: 'success', icon: 'ti ti-arrow-up' }
    : { label: `Down ${-moved}`, tint: 'danger', icon: 'ti ti-arrow-down' };
};

/* ----------------------------- Attendance block ----------------------------- */

export const attendancePctOf = (block: AttendanceBlock) =>
  block.workingDays && block.present !== undefined
    ? round1((block.present / block.workingDays) * 100)
    : null;

export const passPctOf = (block: AttendanceBlock) => {
  const size = block.strength ?? block.studentsCovered;
  return size && block.atPassMark !== undefined ? round1((block.atPassMark / size) * 100) : null;
};

/* -------------------------------- The filters ------------------------------- */

export const searchIndexOf = (row: AcademicReport) =>
  [row.id, row.name, row.scope, row.scopeNote, row.type, row.exam, row.examRef].join(' ').toLowerCase();

export const reportTypeOptions: ReportType[] = [
  'Student Report Card',
  'Class Performance Report',
  'Subject Analysis Report',
  'Term Consolidated Report',
  'Grade Distribution Report',
  'Progress Report',
];

export const examOptions = ['Unit Test 1', 'Term 1 Exam', 'Unit Test 2', 'Half Yearly'];
export const classOptions = [
  'Class II',
  'Class V',
  'Class VI',
  'Class VII',
  'Class VIII',
  'Class IX',
  'Class X',
];
export const sectionOptions = ['A', 'B', 'C'];
export const subjectOptions = [
  'English',
  'Mathematics',
  'Science',
  'Social Science',
  'Hindi',
  'Computer Science',
  'EVS',
];
export const statusOptions: ReportStatus[] = [
  'Awaiting Marks',
  'Ready to Generate',
  'Pending Review',
  'Reviewed',
  'Published',
  'Scheduled',
];
export const gradeOptions = GRADE_SCALE.map((step) => step.grade);
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const generatedByOptions = ['Class teachers', 'Examination cell', 'Scheduled run'];
export const templateOptions = [
  'Standard report card',
  'Detailed subject analysis',
  'Consolidated term sheet',
];
export const deliveryOptions = ['Emailed to parents', 'Printed', 'Portal only', 'Not delivered'];
export const marksEntryOptions = ['Complete', 'Partial', 'Not started'];

/** Which class a report reads on, for the Class filter. */
export const classOfReport = (row: AcademicReport) => {
  const match = row.scopeNote.match(/Class ([IVX]+)/) ?? row.scope.match(/Class ([IVX]+)/);
  return match ? `Class ${match[1]}` : '';
};

export const sectionOfReport = (row: AcademicReport) => {
  const match = row.scopeNote.match(/Class [IVX]+ ([ABC])/) ?? row.scope.match(/Class [IVX]+ ([ABC])/);
  return match ? match[1] : '';
};

/** Marks entry state, as the More Filters panel offers it. */
export const marksEntryOf = (row: AcademicReport) => {
  const entered = enteredOf(row);
  if (entered === 0) return 'Not started';
  return entered === row.lines.length ? 'Complete' : 'Partial';
};

/** How the report reached whoever holds it, for the Delivery filter. */
export const deliveryOf = (row: AcademicReport) => {
  if (row.exports.some((item) => item.title.includes('Shared'))) return 'Emailed to parents';
  if (row.exports.some((item) => item.title === 'Printed')) return 'Printed';
  if (row.exports.length > 0) return 'Portal only';
  return 'Not delivered';
};

/** A report still needing an action is anything not yet published. */
export const needsActionOf = (row: AcademicReport) => statusOf(row) !== 'Published';

/** The strip's Top Performers count, on the same A-and-above line the rail uses. */
export const isTopPerformer = (row: AcademicReport) => {
  const grade = overallGradeOf(row);
  return grade !== null && grade.floor >= 81;
};
