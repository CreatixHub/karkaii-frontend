/* -------------------------------------------------------------------------- */
/*                              Selection options                             */
/* -------------------------------------------------------------------------- */

export type YearId = '2026-2027' | '2025-2026';
export type ExamId = 'half-yearly' | 'quarterly' | 'annual';
export type ClassId = 'grade-10' | 'grade-9' | 'grade-11';
export type SectionId = 'section-a' | 'section-b';

export interface SelectOption<Id extends string> {
  id: Id;
  label: string;
}

/** `report-cards.html` L1481–1484. */
export const academicYears: SelectOption<YearId>[] = [
  { id: '2026-2027', label: '2026 / 2027' },
  { id: '2025-2026', label: '2025 / 2026' },
];

export interface ExamOption extends SelectOption<ExamId> {
  /** The short form the preview badge uses — "Half-Yearly · 2026 / 2027" (L1559). */
  short: string;
  /** The sitting the masthead prints — "Half-Yearly Examination · Dec 2026" (L1575). */
  period: string;
}

/** `report-cards.html` L1489–1491; the Dec 2026 sitting is L1575. */
export const exams: ExamOption[] = [
  { id: 'half-yearly', label: 'Half-Yearly Examination', short: 'Half-Yearly', period: 'Dec 2026' },
  { id: 'quarterly', label: 'Quarterly Examination', short: 'Quarterly', period: 'Sep 2026' },
  { id: 'annual', label: 'Annual Examination', short: 'Annual', period: 'Mar 2027' },
];

/** `report-cards.html` L1497–1499. */
export const classes: SelectOption<ClassId>[] = [
  { id: 'grade-10', label: 'Grade 10' },
  { id: 'grade-9', label: 'Grade 9' },
  { id: 'grade-11', label: 'Grade 11' },
];

/** `report-cards.html` L1505–1506. */
export const sections: SelectOption<SectionId>[] = [
  { id: 'section-a', label: 'Section A' },
  { id: 'section-b', label: 'Section B' },
];

/** The batch the template ships is the 2026 / 2027 Half-Yearly for Grade 10 · Section A. */
export const defaultSelection = {
  year: '2026-2027' as YearId,
  exam: 'half-yearly' as ExamId,
  classId: 'grade-10' as ClassId,
  sectionId: 'section-a' as SectionId,
};

export const labelOf = <Id extends string>(options: SelectOption<Id>[], id: Id): string =>
  options.find((option) => option.id === id)?.label ?? '';

/* -------------------------------------------------------------------------- */
/*                                  Masthead                                  */
/* -------------------------------------------------------------------------- */

/** `report-cards.html` L1567–1571. */
export const school = {
  name: 'Global International School',
  address: '128 Riverside Avenue, Springfield, CA 94040',
  logo: 'assets/img/logo.svg',
};

export interface Signatory {
  name: string;
  role: string;
  signature: string;
}

/** `report-cards.html` L1653–1664. */
export const signatories: Signatory[] = [
  { name: 'Teresa Getto', role: 'Class Teacher', signature: 'assets/img/icons/signature.svg' },
  { name: 'Dr. Marcus Bennett', role: 'Principal', signature: 'assets/img/icons/signature.svg' },
];

/** The cohort behind "04 of 42" (L1637) and "42 of 42 report cards ready" (L1519). */
export const COHORT_SIZE = 42;

/* -------------------------------------------------------------------------- */
/*                                Grading scale                               */
/* -------------------------------------------------------------------------- */

/** `marks-entry.html` L1566–1570: 100 maximum, 33 to pass. */
export const MAX_MARKS = 100;
export const PASS_MARKS = 33;

export interface GradeBand {
  grade: string;
  /** Lowest mark that earns the band. */
  min: number;
  /** Grade points, used for the aggregate grade. */
  points: number;
  badge: string;
}

/**
 * The CBSE 8-point scale named on `marks-entry.html` L1605. Every grade badge printed by
 * either page falls out of it: 82→A2, 78→B1, 88→A2, 74→B1, 69→B2, 91→A1 on the report
 * card, and 64→B2, 29→E on the marks sheet. The `badge-soft-*` tone for A/B/E is the
 * template's own; C and D reuse the warning tone, which neither page had cause to print.
 */
export const gradeScale: GradeBand[] = [
  { grade: 'A1', min: 91, points: 10, badge: 'badge-soft-success' },
  { grade: 'A2', min: 81, points: 9, badge: 'badge-soft-success' },
  { grade: 'B1', min: 71, points: 8, badge: 'badge-soft-info' },
  { grade: 'B2', min: 61, points: 7, badge: 'badge-soft-info' },
  { grade: 'C1', min: 51, points: 6, badge: 'badge-soft-warning' },
  { grade: 'C2', min: 41, points: 5, badge: 'badge-soft-warning' },
  { grade: 'D', min: 33, points: 4, badge: 'badge-soft-warning' },
  { grade: 'E', min: 0, points: 0, badge: 'badge-soft-danger' },
];

/** The band a mark falls into. The last band starts at 0, so a match always exists. */
export const gradeFor = (marks: number): GradeBand =>
  gradeScale.find((band) => marks >= band.min) ?? gradeScale[gradeScale.length - 1];

/** `marks-entry.html` L1736 prints AB for an absentee, on the secondary tone. */
export const ABSENT_BAND: GradeBand = {
  grade: 'AB',
  min: 0,
  points: 0,
  badge: 'badge-soft-secondary',
};

/* -------------------------------------------------------------------------- */
/*                                  Subjects                                  */
/* -------------------------------------------------------------------------- */

export interface SubjectMeta {
  id: string;
  name: string;
  icon: string;
  /** Drives `bg-{tone}-transparent text-{tone}` on the subject tile. */
  tone: string;
}

/** The six subjects and their tiles — `report-cards.html` L1695–1734. */
export const subjects: SubjectMeta[] = [
  { id: 'english', name: 'English Language', icon: 'ti ti-abc', tone: 'primary' },
  { id: 'mathematics', name: 'Mathematics', icon: 'ti ti-math-function', tone: 'info' },
  { id: 'science', name: 'Science', icon: 'ti ti-atom-2', tone: 'success' },
  { id: 'social-science', name: 'Social Science', icon: 'ti ti-world', tone: 'warning' },
  { id: 'hindi', name: 'Hindi', icon: 'ti ti-language', tone: 'purple' },
  { id: 'computer-science', name: 'Computer Science', icon: 'ti ti-device-laptop', tone: 'skyblue' },
];

export interface SubjectResult {
  subjectId: string;
  maxMarks: number;
  /** `null` when the student was absent or the mark was never entered. */
  marks: number | null;
  remark: string;
}

/** One student's marks, given in `subjects` order as `[marks, remark]`. */
type MarkSheet = [number | null, string][];

const sheet = (entries: MarkSheet): SubjectResult[] =>
  subjects.map((subject, index) => ({
    subjectId: subject.id,
    maxMarks: MAX_MARKS,
    marks: entries[index][0],
    remark: entries[index][1],
  }));

/* -------------------------------------------------------------------------- */
/*                              Report card records                           */
/* -------------------------------------------------------------------------- */

export interface ReportCardRecord {
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  rollNo: string;
  parentName: string;
  year: YearId;
  exam: ExamId;
  classId: ClassId;
  sectionId: SectionId;
  /** Term attendance, printed as-is. */
  attendance: string;
  /** Position in the cohort of `COHORT_SIZE`. */
  rank: number;
  /** The class teacher's paragraph at the foot of the document. */
  remarks: string;
  results: SubjectResult[];
  /** Haystack the toolbar's student search matches against. */
  search: string;
}

const record = (
  entry: Omit<ReportCardRecord, 'year' | 'exam' | 'classId' | 'sectionId' | 'search'>,
): ReportCardRecord => ({
  ...entry,
  ...defaultSelection,
  search: `${entry.name} ${entry.rollNo} ${entry.admissionNo}`.toLowerCase(),
});

export const reportCards: ReportCardRecord[] = [
  record({
    id: 'rc-748210',
    name: 'Aaron Cooper',
    avatar: 'assets/img/students/student-01.jpg',
    admissionNo: 'PRE748210',
    rollNo: '10A-021',
    parentName: 'Daniel Cooper',
    attendance: '94.5%',
    rank: 4,
    remarks:
      'Aaron has shown steady improvement across all subjects this term, with particularly strong work in Computer Science and Science. Continued attention to Hindi comprehension will lift the overall aggregate further.',
    results: sheet([
      [82, 'Confident written expression'],
      [78, 'Good improvement in algebra'],
      [88, 'Excellent practical work'],
      [74, 'Revise map work'],
      [69, 'Needs comprehension practice'],
      [91, 'Outstanding project submission'],
    ]),
  }),
  record({
    id: 'rc-748214',
    name: 'Bianca Reid',
    avatar: 'assets/img/students/student-02.jpg',
    admissionNo: 'PRE748214',
    rollNo: '10A-022',
    parentName: 'Marianne Reid',
    attendance: '97.2%',
    rank: 1,
    remarks:
      'Bianca leads the section on aggregate and sets the standard for written work. A little more time on Hindi vocabulary is the only gap left between her and a clean sweep of A grades.',
    results: sheet([
      [89, 'Articulate and well structured'],
      [91, 'Excellent'],
      [94, 'Top of the section in practicals'],
      [86, 'Strong source analysis'],
      [78, 'Vocabulary needs widening'],
      [96, 'Exceptional programming logic'],
    ]),
  }),
  record({
    id: 'rc-748219',
    name: 'Carlos Mendez',
    avatar: 'assets/img/students/student-03.jpg',
    admissionNo: 'PRE748219',
    rollNo: '10A-023',
    parentName: 'Hector Mendez',
    attendance: '88.0%',
    rank: 22,
    remarks:
      'Carlos missed the Mathematics paper on medical grounds and will sit the make-up session before results are published. His remaining papers are steady and show no loss of ground.',
    results: sheet([
      [71, 'Reads widely, writes clearly'],
      [null, 'Medical leave'],
      [66, 'Solid grasp of the theory'],
      [74, 'Confident with timelines'],
      [62, 'Grammar drills would help'],
      [70, 'Neat, methodical practical work'],
    ]),
  }),
  record({
    id: 'rc-748223',
    name: 'Danielle Fox',
    avatar: 'assets/img/students/student-04.jpg',
    admissionNo: 'PRE748223',
    rollNo: '10A-024',
    parentName: 'Gregory Fox',
    attendance: '91.3%',
    rank: 18,
    remarks:
      'Danielle is consistent across the board without yet standing out in any one subject. Targeted practice in Social Science and Science would move a cluster of B2 grades up a band.',
    results: sheet([
      [72, 'Clear, if brief, answers'],
      [64, ''],
      [68, 'Diagrams need more labelling'],
      [66, 'Revise the case studies'],
      [70, 'Comfortable with prose'],
      [75, 'Good use of functions'],
    ]),
  }),
  record({
    id: 'rc-748227',
    name: 'Ethan Brooks',
    avatar: 'assets/img/students/student-05.jpg',
    admissionNo: 'PRE748227',
    rollNo: '10A-025',
    parentName: 'Alicia Brooks',
    attendance: '82.6%',
    rank: 31,
    remarks:
      'Ethan’s Mathematics mark has not reached the office and the card cannot be finalised until it does. Attendance is the wider concern and has been raised with the family.',
    results: sheet([
      [58, 'Ideas outrun the structure'],
      [null, ''],
      [61, 'Attend the extra lab sessions'],
      [55, 'Map work incomplete'],
      [52, 'Reading practice required'],
      [64, 'Project submitted late'],
    ]),
  }),
  record({
    id: 'rc-748231',
    name: 'Farah Siddiqui',
    avatar: 'assets/img/students/student-06.jpg',
    admissionNo: 'PRE748231',
    rollNo: '10A-026',
    parentName: 'Imran Siddiqui',
    attendance: '96.0%',
    rank: 3,
    remarks:
      'Farah has held an A band in five of six subjects and her attendance is among the best in the section. Hindi is the single subject still short of that standard.',
    results: sheet([
      [84, 'Thoughtful comprehension answers'],
      [88, 'Consistent performer'],
      [90, 'Precise, well recorded experiments'],
      [81, 'Strong on civics'],
      [76, 'Improving steadily'],
      [87, 'Clean, well documented code'],
    ]),
  }),
  record({
    id: 'rc-748235',
    name: 'George Nelson',
    avatar: 'assets/img/students/student-07.jpg',
    admissionNo: 'PRE748235',
    rollNo: '10A-027',
    parentName: 'Patricia Nelson',
    attendance: '79.4%',
    rank: 26,
    remarks:
      'George represented the school at the state sports meet during the Mathematics paper and will sit the make-up session. The papers he did sit are in line with last term.',
    results: sheet([
      [63, 'Answers need more detail'],
      [null, 'State sports meet'],
      [70, 'Good recall of definitions'],
      [68, 'Enjoys the discussion work'],
      [59, 'Handwriting affects clarity'],
      [72, 'Confident with the practical'],
    ]),
  }),
  record({
    id: 'rc-748239',
    name: 'Hannah Lopez',
    avatar: 'assets/img/students/student-08.jpg',
    admissionNo: 'PRE748239',
    rollNo: '10A-028',
    parentName: 'Miguel Lopez',
    attendance: '71.8%',
    rank: 40,
    remarks:
      'Hannah has fallen below the pass mark in Mathematics and is close to it in two further subjects. She has been enrolled in the remedial programme and a parent meeting is scheduled.',
    results: sheet([
      [45, 'Struggles with longer passages'],
      [29, 'Needs remedial support'],
      [38, 'Revisit the fundamentals'],
      [41, 'Incomplete answers'],
      [36, 'Attend the reading clinic'],
      [52, 'Best paper of the term'],
    ]),
  }),
];

/* -------------------------------------------------------------------------- */
/*                            Derived report summary                          */
/* -------------------------------------------------------------------------- */

export type ResultStatus = 'Passed' | 'Failed' | 'Pending';

export interface SubjectRow extends SubjectResult {
  name: string;
  icon: string;
  tone: string;
  band: GradeBand;
  /** "82 / 100", or an em dash when the paper was not sat. */
  marksLabel: string;
}

export interface ReportSummary {
  rows: SubjectRow[];
  /** Marks obtained across the *graded* subjects. */
  total: number;
  /** Maximum across the graded subjects, so an absence does not depress the percentage. */
  max: number;
  /** "482 / 600" */
  totalLabel: string;
  percentage: number;
  /** "80.33%" */
  percentageLabel: string;
  /** Percentage on the ten-point scale — "8.0". */
  gpa: string;
  /** Aggregate of the subject grade points, rounded to the nearest band. */
  overall: GradeBand;
  /** Subjects still without a mark. */
  pending: number;
  status: ResultStatus;
  statusBadge: string;
  statusIcon: string;
}

const STATUS_BADGE: Record<ResultStatus, string> = {
  Passed: 'badge-soft-success',
  Failed: 'badge-soft-danger',
  Pending: 'badge-soft-warning',
};

const STATUS_ICON: Record<ResultStatus, string> = {
  Passed: 'ti ti-circle-check',
  Failed: 'ti ti-alert-triangle',
  Pending: 'ti ti-clock-hour-4',
};

/**
 * Everything the document prints below the marks table.
 *
 * Aaron Cooper's card is the check: 82+78+88+74+69+91 = 482 of 600 → 80.33% → GPA 8.0,
 * and grade points 9+8+9+8+7+10 = 51 over six subjects → 8.5 → A2. All four match the
 * template's own figures (L1625–1637).
 */
export const summarise = (entry: ReportCardRecord): ReportSummary => {
  const rows: SubjectRow[] = entry.results.map((result, index) => {
    const subject = subjects[index];
    return {
      ...result,
      name: subject.name,
      icon: subject.icon,
      tone: subject.tone,
      band: result.marks === null ? ABSENT_BAND : gradeFor(result.marks),
      marksLabel: result.marks === null ? '—' : `${result.marks} / ${result.maxMarks}`,
    };
  });

  const graded = rows.filter((row) => row.marks !== null);
  const total = graded.reduce((sum, row) => sum + (row.marks ?? 0), 0);
  const max = graded.reduce((sum, row) => sum + row.maxMarks, 0);
  const percentage = max === 0 ? 0 : (total / max) * 100;

  const points = graded.reduce((sum, row) => sum + row.band.points, 0);
  const mean = graded.length === 0 ? 0 : Math.round(points / graded.length);
  const overall =
    gradeScale.find((band) => band.points === mean) ?? gradeScale[gradeScale.length - 1];

  const pending = rows.length - graded.length;
  const failed = graded.some((row) => (row.marks ?? 0) < PASS_MARKS);
  const status: ResultStatus = pending > 0 ? 'Pending' : failed ? 'Failed' : 'Passed';

  return {
    rows,
    total,
    max,
    totalLabel: `${total} / ${max}`,
    percentage,
    percentageLabel: `${percentage.toFixed(2)}%`,
    gpa: (percentage / 10).toFixed(1),
    overall,
    pending,
    status,
    statusBadge: STATUS_BADGE[status],
    statusIcon: STATUS_ICON[status],
  };
};

/** The template prints counts zero-padded — "04 of 42", "06 Subjects". */
export const pad2 = (value: number): string => String(value).padStart(2, '0');

/** "24 Jul 2026 at 11:05 AM", the format of the toolbar footer's stamp (L1519). */
export const formatStamp = (date: Date): string => {
  const day = pad2(date.getDate());
  const month = date.toLocaleString('en-GB', { month: 'short' });
  const time = date
    .toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    .toUpperCase();
  return `${day} ${month} ${date.getFullYear()} at ${time}`;
};

/** The stamp the template ships with. */
export const initialStamp = '24 Jul 2026 at 11:05 AM';

/* -------------------------------------------------------------------------- */
/*                                   Toasts                                   */
/* -------------------------------------------------------------------------- */

/**
 * `report-cards.html` loads no page script, so there is no `PAGE_CONFIG` entry to copy.
 * This copy mirrors the phrasing the other Academic workspaces use for the same actions.
 */
export const actionToasts: Record<string, string> = {
  generate: 'Report card generated.',
  print: 'Sending the report card to the printer…',
  download: 'PDF export queued for download.',
  publish: 'Report card published to the parent portal.',
  published_locked: 'This report card is already published and locked for the term.',
  reset: 'Selection reset to the generated batch.',
  no_cards: 'No report cards have been generated for this selection.',
};
