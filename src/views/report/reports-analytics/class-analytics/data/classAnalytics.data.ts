/* ------------------------------- The register ------------------------------ */

export const TOTAL_SECTIONS = 24;
export const ACADEMIC_YEAR = '2026-2027';
export const EXAM = 'Term 1 Exam';
export const EXAM_REF = 'EXM-2026-014';
export const WORKING_DAYS = 96;
export const PASS_MARK = 33;
export const PERIODS_PER_DAY = 6;

/** The line below which a section is flagged as requiring attention. */
export const ATTENTION_LINE = 60;

/** A move of this many marks or more is a direction rather than noise. */
export const TREND_THRESHOLD = 1.5;

export const GRADE_SCALE: { grade: string; floor: number; remark: string }[] = [
  { grade: 'A+', floor: 91, remark: 'Outstanding' },
  { grade: 'A', floor: 81, remark: 'Excellent' },
  { grade: 'B+', floor: 71, remark: 'Very Good' },
  { grade: 'B', floor: 61, remark: 'Good' },
  { grade: 'C+', floor: 51, remark: 'Satisfactory' },
  { grade: 'C', floor: 41, remark: 'Average' },
  { grade: 'D', floor: PASS_MARK, remark: 'Below Average' },
  { grade: 'E', floor: 0, remark: 'Needs Improvement' },
];

export const LEVEL_SCALE: { level: SectionLevel; floor: number }[] = [
  { level: 'Excellent', floor: 85 },
  { level: 'Good', floor: 75 },
  { level: 'Average', floor: 60 },
  { level: 'Needs Improvement', floor: 40 },
  { level: 'At Risk', floor: 0 },
];

export const ATTENDANCE_BANDS: { band: AttendanceBand; floor: number }[] = [
  { band: 'Regular', floor: 90 },
  { band: 'Watch', floor: 85 },
  { band: 'Concern', floor: 0 },
];

/* --------------------------------- Shapes ---------------------------------- */

export type SectionLevel =
  | 'Excellent'
  | 'Good'
  | 'Average'
  | 'Needs Improvement'
  | 'At Risk'
  | 'Under Review';

export type AttendanceBand = 'Regular' | 'Watch' | 'Concern';

export type ActionState = 'Active' | 'Proposed' | 'Closed';

export interface SubjectMean {
  subject: string;
  mean: number | null;
}

export interface Performer {
  name: string;
  score: number;
  rank: number | null;
}

export interface RemarkEntry {
  author: string;
  role: string;
  date: string;
  body: string;
}

export interface ActionEntry {
  title: string;
  owner: string;
  opened: string;
  state: ActionState;
  note: string;
}

export interface ClassSection {
  id: string;
  grade: string;
  section: string;
  teacher: string;
  students: number;
  /** The section report this analysis feeds, where one has been raised. */
  reportRef?: string;

  subjects: SubjectMean[];
  previousMean: number;
  rank: number | null;
  previousRank: number;
  /** Students at or above the pass mark; null while a subject is open. */
  cleared: number | null;
  attendancePct: number;

  marksClosedOn: string;
  evaluatedOn?: string;
  evaluatedDaysAgo?: number;
  /** What blocks the evaluation, where one is blocked. */
  blockedBy?: string;

  top: Performer[];
  bottom: Performer[];
  remarks: RemarkEntry[];
  actions: ActionEntry[];
  noteTags: string[];
  note: string;
}

/* -------------------------------- The sections ----------------------------- */

export const classSections: ClassSection[] = [
  {
    id: 'II-B',
    grade: 'Class II',
    section: 'B',
    teacher: 'Ms. Grace Otieno',
    students: 41,
    reportRef: 'ACR-2026-0362',
    subjects: [
      { subject: 'English', mean: 87.4 },
      { subject: 'Mathematics', mean: 84.6 },
      { subject: 'EVS', mean: 88.2 },
      { subject: 'Hindi', mean: 82.1 },
    ],
    previousMean: 84.2,
    rank: 2,
    previousRank: 2,
    cleared: 41,
    attendancePct: 95.4,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '25 Jul 2026',
    evaluatedDaysAgo: 6,
    top: [
      { name: 'Aditi Sharma', score: 93.8, rank: 1 },
      { name: 'Neel Kapoor', score: 91.2, rank: 2 },
      { name: 'Lisa Gourley', score: 90.5, rank: 3 },
    ],
    bottom: [
      { name: 'Vihaan Rao', score: 68.4, rank: 41 },
      { name: 'Sara Fernandes', score: 70.6, rank: 40 },
    ],
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '25 Jul 2026',
        body: 'Every child cleared the pass mark. Reading fluency across the section is well ahead of Grade II.',
      },
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Library',
        date: '22 Jul 2026',
        body: 'Thirty-one of the forty-one took part in the Junior Reading Challenge.',
      },
    ],
    actions: [
      {
        title: 'Hindi handwriting drill',
        owner: 'Ms. Grace Otieno',
        opened: '8 Jun 2026',
        state: 'Closed',
        note: 'Ten week drill closed on 24 Jul. Hindi mean rose from 78.6 to 82.1.',
      },
    ],
    noteTags: ['Highest section mean', 'Full pass rate'],
    note:
      'Junior section reports carry a descriptive band. The letter grade shown here is for staff use only.',
  },

  {
    id: 'X-B',
    grade: 'Class X',
    section: 'B',
    teacher: 'Mrs. Ellen Cruz',
    students: 46,
    reportRef: 'ACR-2026-0341',
    subjects: [
      { subject: 'English', mean: 78.6 },
      { subject: 'Mathematics', mean: 81.2 },
      { subject: 'Science', mean: 79.4 },
      { subject: 'Social Science', mean: 75.8 },
      { subject: 'Hindi', mean: 74.2 },
      { subject: 'Computer Science', mean: 83.6 },
    ],
    previousMean: 76.4,
    rank: 5,
    previousRank: 7,
    cleared: 45,
    attendancePct: 93.6,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '27 Jul 2026',
    evaluatedDaysAgo: 4,
    top: [
      { name: 'Ananya Rao', score: 91.7, rank: 1 },
      { name: 'Ira Bhatt', score: 89.4, rank: 2 },
      { name: 'Yash Malhotra', score: 87.9, rank: 3 },
    ],
    bottom: [
      { name: 'Dev Ahuja', score: 41.2, rank: 46 },
      { name: 'Nisha Pillai', score: 52.8, rank: 45 },
    ],
    remarks: [
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Class Teacher',
        date: '27 Jul 2026',
        body: 'Two places up on the board. Computer Science and Mathematics carry the section.',
      },
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Hindi',
        date: '26 Jul 2026',
        body: 'Hindi at 74.2 is the weakest paper and the only one under seventy five.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Science',
        date: '26 Jul 2026',
        body: 'Practical scores lifted the Science mean by four marks across the section.',
      },
    ],
    actions: [
      {
        title: 'Hindi comprehension clinic',
        owner: 'Mrs. Sofia Alvarez',
        opened: '28 Jul 2026',
        state: 'Active',
        note: 'Weekly clinic for the eleven students below seventy in Hindi. Reviewed at the Half Yearly.',
      },
    ],
    noteTags: ['Board year', 'Improving'],
    note:
      'One student remains below the pass mark. Dev Ahuja is on an individual plan with the Mathematics department.',
  },

  {
    id: 'V-A',
    grade: 'Class V',
    section: 'A',
    teacher: 'Ms. Grace Otieno',
    students: 38,
    reportRef: 'ACR-2026-0356',
    subjects: [
      { subject: 'English', mean: 76.8 },
      { subject: 'Mathematics', mean: 72.4 },
      { subject: 'EVS', mean: 79.6 },
      { subject: 'Hindi', mean: 74.1 },
      { subject: 'Computer Science', mean: 81.2 },
    ],
    previousMean: 75.1,
    rank: 7,
    previousRank: 8,
    cleared: 37,
    attendancePct: 94.1,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '29 Jul 2026',
    evaluatedDaysAgo: 2,
    top: [
      { name: 'Meera Iyer', score: 89.6, rank: 1 },
      { name: 'Aryan Gupta', score: 84.2, rank: 2 },
      { name: 'Tanvi Sharma', score: 78.4, rank: 9 },
    ],
    bottom: [
      { name: 'Rehan Qureshi', score: 31.8, rank: 38 },
      { name: 'Pooja Nanda', score: 48.6, rank: 37 },
    ],
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '29 Jul 2026',
        body: 'All five subject means are above seventy two. Only one student is below the pass mark.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'Marks closed on 24 Jul. Consolidated report ACR-2026-0356 is cleared but not yet generated.',
      },
    ],
    actions: [
      {
        title: 'Mathematics word problem plan',
        owner: 'Ms. Grace Otieno',
        opened: '29 Jul 2026',
        state: 'Closed',
        note: 'Section plan closed after the Mathematics mean passed seventy. Nine students took part.',
      },
    ],
    noteTags: ['Cleared to report', 'Improving'],
    note:
      'Consolidated report ACR-2026-0356 is held one day so it goes out with the guardian meeting notes on 1 Aug.',
  },

  {
    id: 'VII-A',
    grade: 'Class VII',
    section: 'A',
    teacher: 'Mrs. Sofia Alvarez',
    students: 44,
    reportRef: 'ACR-2026-0347',
    subjects: [
      { subject: 'English', mean: 71.8 },
      { subject: 'Mathematics', mean: 66.4 },
      { subject: 'Science', mean: 74.2 },
      { subject: 'Social Science', mean: 69.6 },
      { subject: 'Hindi', mean: 68.4 },
      { subject: 'Computer Science', mean: 76.8 },
    ],
    previousMean: 73.6,
    rank: 11,
    previousRank: 9,
    cleared: 40,
    attendancePct: 91.2,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '30 Jul 2026',
    evaluatedDaysAgo: 1,
    top: [
      { name: 'Sneha Menon', score: 86.4, rank: 1 },
      { name: 'Kunal Joshi', score: 82.1, rank: 2 },
      { name: 'Aarav Kumar', score: 73.2, rank: 11 },
    ],
    bottom: [
      { name: 'Farhan Ali', score: 34.6, rank: 44 },
      { name: 'Ritika Bose', score: 39.2, rank: 43 },
    ],
    remarks: [
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Class Teacher',
        date: '30 Jul 2026',
        body: 'Down two places. Mathematics at 66.4 and Hindi at 68.4 pull the section mean below the grade line.',
      },
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        date: '29 Jul 2026',
        body: 'Four students under the pass mark. All four now attend the Saturday problem clinic.',
      },
    ],
    actions: [
      {
        title: 'Saturday problem clinic',
        owner: 'Mr. Ethan Brooks',
        opened: '29 Jul 2026',
        state: 'Active',
        note: 'Nine students across VII A and VIII A. Measured at the Half Yearly Examination.',
      },
      {
        title: 'Second language reading plan',
        owner: 'Mrs. Sofia Alvarez',
        opened: 'not opened',
        state: 'Proposed',
        note: 'Goes to the coordinator on 3 Aug with the Hindi department.',
      },
    ],
    noteTags: ['Declining', 'Two plans open'],
    note:
      'Report cards for this section are still with the Academic Coordinator, so nothing has gone to the guardians.',
  },

  {
    id: 'IX-C',
    grade: 'Class IX',
    section: 'C',
    teacher: 'Mr. Arjun Kale',
    students: 42,
    reportRef: 'ACR-2026-0344',
    subjects: [
      { subject: 'English', mean: 72.4 },
      { subject: 'Mathematics', mean: 64.8 },
      { subject: 'Science', mean: 70.1 },
      { subject: 'Social Science', mean: 68.5 },
      { subject: 'Hindi', mean: 73.2 },
      { subject: 'Computer Science', mean: 77.9 },
    ],
    previousMean: 69.8,
    rank: 12,
    previousRank: 13,
    cleared: 39,
    attendancePct: 92.4,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '28 Jul 2026',
    evaluatedDaysAgo: 3,
    top: [
      { name: 'Rohan Desai', score: 88.3, rank: 1 },
      { name: 'Aisha Khan', score: 85.6, rank: 2 },
      { name: 'Manav Trivedi', score: 83.4, rank: 3 },
    ],
    bottom: [
      { name: 'Zoya Sheikh', score: 28.4, rank: 42 },
      { name: 'Karan Bhalla', score: 30.6, rank: 41 },
    ],
    remarks: [
      {
        author: 'Mr. Arjun Kale',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'Mathematics pulls the section mean down. Three students carry the only failures.',
      },
      {
        author: 'Ms. Deepa Rawat',
        role: 'Computer Science',
        date: '27 Jul 2026',
        body: 'Best paper in the section at 77.9. Project work lifted the mean by four marks.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'Holding publication of ACR-2026-0344 until the Mathematics remedial plan is attached.',
      },
    ],
    actions: [
      {
        title: 'Mathematics remedial plan',
        owner: 'Mr. Arjun Kale',
        opened: 'not opened',
        state: 'Proposed',
        note:
          'Required before ACR-2026-0344 can be published. Covers the three students below the pass mark.',
      },
    ],
    noteTags: ['Report held', 'Plan required'],
    note: 'Publication of the section summary is blocked until the Mathematics remedial plan is attached.',
  },

  {
    id: 'VIII-A',
    grade: 'Class VIII',
    section: 'A',
    teacher: 'Mr. Ethan Brooks',
    students: 46,
    reportRef: 'ACR-2026-0350',
    subjects: [
      { subject: 'English', mean: 68.4 },
      { subject: 'Mathematics', mean: 63.5 },
      { subject: 'Science', mean: 66.2 },
      { subject: 'Social Science', mean: 64.8 },
      { subject: 'Hindi', mean: 70.4 },
      { subject: 'Computer Science', mean: 72.6 },
    ],
    previousMean: 69.2,
    rank: 17,
    previousRank: 15,
    cleared: 41,
    attendancePct: 89.8,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '26 Jul 2026',
    evaluatedDaysAgo: 5,
    top: [
      { name: 'Devika Raman', score: 84.8, rank: 1 },
      { name: 'Om Prakash', score: 81.6, rank: 2 },
      { name: 'Alisha Dutt', score: 79.2, rank: 3 },
    ],
    bottom: [
      { name: 'Rahul Nayar', score: 26.8, rank: 46 },
      { name: 'Simran Kaur', score: 31.4, rank: 45 },
    ],
    remarks: [
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        date: '26 Jul 2026',
        body: 'Weakest Mathematics mean of the six sections analysed at 63.5. Algebra carries most of the loss.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Head of Department',
        date: '27 Jul 2026',
        body: 'Tabled at the department meeting on 3 Aug alongside subject analysis ACR-2026-0350.',
      },
    ],
    actions: [
      {
        title: 'Algebra recovery block',
        owner: 'Mr. Ethan Brooks',
        opened: '27 Jul 2026',
        state: 'Active',
        note: 'Three periods a week from 3 Aug. Fourteen students in scope.',
      },
    ],
    noteTags: ['Declining', 'Department review'],
    note:
      'Named as the weakest section in the Mathematics subject analysis ACR-2026-0350, published on 28 Jul.',
  },

  {
    id: 'IV-A',
    grade: 'Class IV',
    section: 'A',
    teacher: 'Ms. Meera Nair',
    students: 40,
    subjects: [
      { subject: 'English', mean: 61.4 },
      { subject: 'Mathematics', mean: 52.6 },
      { subject: 'EVS', mean: 64.8 },
      { subject: 'Hindi', mean: 57.2 },
      { subject: 'Computer Science', mean: 63.4 },
    ],
    previousMean: 62.4,
    rank: 22,
    previousRank: 19,
    cleared: 31,
    attendancePct: 84.6,
    marksClosedOn: '24 Jul 2026',
    evaluatedOn: '28 Jul 2026',
    evaluatedDaysAgo: 3,
    top: [
      { name: 'Naina Kulkarni', score: 79.4, rank: 1 },
      { name: 'Arjun Pillai', score: 76.2, rank: 2 },
      { name: 'Rhea Sood', score: 74.8, rank: 3 },
    ],
    bottom: [
      { name: 'Ishaan Verma', score: 54.6, rank: 34 },
      { name: 'Vivaan Shetty', score: 22.4, rank: 40 },
    ],
    remarks: [
      {
        author: 'Ms. Meera Nair',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'Nine students below the pass mark and the lowest attendance of the eight sections at 84.6 per cent.',
      },
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        date: '27 Jul 2026',
        body: 'Mathematics mean of 52.6 is the only subject under the satisfactory line.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '29 Jul 2026',
        body: 'Section flagged for attention. Report cards held until the plan review on 7 Aug.',
      },
    ],
    actions: [
      {
        title: 'Section improvement plan',
        owner: 'Ms. Meera Nair',
        opened: '26 Jun 2026',
        state: 'Active',
        note: 'Mathematics target of 60 and an attendance target of 90 per cent, measured at the Half Yearly.',
      },
      {
        title: 'Attendance follow up',
        owner: 'Ms. Meera Nair',
        opened: '21 May 2026',
        state: 'Active',
        note: 'Fortnightly note to the guardians of the fourteen students under ninety per cent.',
      },
    ],
    noteTags: ['Requires attention', 'Attendance concern'],
    note:
      'Report cards for the section are held until the improvement plan review on 7 Aug so the plan and the results go out together.',
  },

  {
    id: 'VI-B',
    grade: 'Class VI',
    section: 'B',
    teacher: 'Ms. Meera Nair',
    students: 43,
    reportRef: 'ACR-2026-0353',
    subjects: [
      { subject: 'English', mean: 70.2 },
      { subject: 'Mathematics', mean: 62.8 },
      { subject: 'Science', mean: null },
      { subject: 'Social Science', mean: 67.4 },
      { subject: 'Hindi', mean: 71.6 },
      { subject: 'Computer Science', mean: 74.8 },
    ],
    previousMean: 68.9,
    rank: null,
    previousRank: 16,
    cleared: null,
    attendancePct: 88.7,
    marksClosedOn: '24 Jul 2026',
    blockedBy: 'Science · MRK-2026-0218',
    top: [
      { name: 'Aarohi Sen', score: 87.2, rank: 1 },
      { name: 'Yuvan Reddy', score: 84.6, rank: 2 },
    ],
    bottom: [
      { name: 'Kabir Shah', score: 70.8, rank: null },
      { name: 'Tara Menon', score: 38.2, rank: null },
    ],
    remarks: [
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'No section mean can be placed while a subject is open. MRK-2026-0218 has been open since 21 Jul.',
      },
      {
        author: 'Ms. Meera Nair',
        role: 'Class Teacher',
        date: '22 Jul 2026',
        body: 'Attendance at 88.7 per cent. Six guardian meetings held this term.',
      },
    ],
    actions: [
      {
        title: 'Science practical catch up',
        owner: 'Mr. Vikram Sethi',
        opened: 'not opened',
        state: 'Proposed',
        note: 'Cannot start until the practical register is entered and the section mean is placed.',
      },
    ],
    noteTags: ['1 subject open', 'Rank withheld'],
    note:
      'Mr. Vikram Sethi holds the Class VI B practical register. Marks entry MRK-2026-0218 blocks the section mean, the rank and the level.',
  },
];

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

const entered = (row: ClassSection) => row.subjects.filter((subject) => subject.mean !== null);

export const isCompleteOf = (row: ClassSection) => row.subjects.every((subject) => subject.mean !== null);

export const papersOf = (row: ClassSection) => entered(row).length;

/** The section mean: the average of its subject means, as the panel prints it. */
export const meanOf = (row: ClassSection) => {
  const list = entered(row);
  return list.length === 0
    ? 0
    : round1(list.reduce((total, subject) => total + (subject.mean as number), 0) / list.length);
};

export const strongestOf = (row: ClassSection) => {
  const list = entered(row);
  return list.length === 0
    ? null
    : list.reduce((best, subject) => ((subject.mean as number) > (best.mean as number) ? subject : best));
};

export const weakestOf = (row: ClassSection) => {
  const list = entered(row);
  return list.length === 0
    ? null
    : list.reduce((worst, subject) => ((subject.mean as number) < (worst.mean as number) ? subject : worst));
};

export const spreadOf = (row: ClassSection) => {
  const high = strongestOf(row);
  const low = weakestOf(row);
  return high && low ? round1((high.mean as number) - (low.mean as number)) : null;
};

/** Papers clear of the seventy-five line, as the analytics panel counts them. */
export const papersAboveOf = (row: ClassSection, line = 75) =>
  entered(row).filter((subject) => (subject.mean as number) >= line).length;

export const gradeOf = (mean: number) =>
  GRADE_SCALE.find((step) => mean >= step.floor) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

export const subjectGradeOf = (subject: SubjectMean) =>
  subject.mean === null ? null : gradeOf(subject.mean).grade;

export const overallGradeOf = (row: ClassSection) => (isCompleteOf(row) ? gradeOf(meanOf(row)) : null);

export const gradeTint = (grade: string) => {
  if (grade === 'A+' || grade === 'A') return 'success';
  if (grade === 'B+' || grade === 'B') return 'info';
  if (grade === 'C+' || grade === 'C') return 'warning';
  return 'danger';
};

/* ------------------------------ Pass and level ----------------------------- */

export const passPctOf = (row: ClassSection) =>
  row.cleared === null ? null : round1((row.cleared / row.students) * 100);

export const belowPassOf = (row: ClassSection) =>
  row.cleared === null ? null : row.students - row.cleared;

/** A level cannot be placed while a subject is open, as the coordinator says. */
export const levelOf = (row: ClassSection): SectionLevel => {
  if (!isCompleteOf(row)) return 'Under Review';
  const mean = meanOf(row);
  return (LEVEL_SCALE.find((step) => mean >= step.floor) ?? LEVEL_SCALE[LEVEL_SCALE.length - 1]).level;
};

export const levelPill: Record<SectionLevel, string> = {
  Excellent: 'is-completed',
  Good: 'is-active',
  Average: 'is-pending',
  'Needs Improvement': 'is-review',
  'At Risk': 'is-blocked',
  'Under Review': 'is-inactive',
};

/** Sections under the attention line, which is what the summary card counts. */
export const needsAttentionOf = (row: ClassSection) =>
  isCompleteOf(row) ? meanOf(row) < ATTENTION_LINE : false;

/* -------------------------------- Attendance ------------------------------- */

export const avgPresentOf = (row: ClassSection) =>
  Math.round((WORKING_DAYS * row.attendancePct) / 100);

export const avgAbsentOf = (row: ClassSection) => WORKING_DAYS - avgPresentOf(row);

/**
 * Periods a student in this section lost, on average.
 *
 * Six periods for every day away — the same figure the Student Performance
 * page implies — applied to the section's exact average absence rather than
 * the rounded day count, which is what reproduces the template's numbers.
 */
export const teachingLostOf = (row: ClassSection) =>
  Math.round((WORKING_DAYS - (WORKING_DAYS * row.attendancePct) / 100) * PERIODS_PER_DAY);

export const attendanceBandOf = (row: ClassSection): AttendanceBand =>
  (ATTENDANCE_BANDS.find((step) => row.attendancePct >= step.floor) ?? ATTENDANCE_BANDS[2]).band;

export const bandTint: Record<AttendanceBand, string> = {
  Regular: 'success',
  Watch: 'warning',
  Concern: 'danger',
};

/* -------------------------------- Movement --------------------------------- */

export const growthOf = (row: ClassSection) =>
  isCompleteOf(row) ? round1(meanOf(row) - row.previousMean) : null;

export type Trend = 'Improving' | 'Steady' | 'Declining' | 'Not placed';

export const trendOf = (row: ClassSection): Trend => {
  const growth = growthOf(row);
  if (growth === null) return 'Not placed';
  if (growth >= TREND_THRESHOLD) return 'Improving';
  if (growth <= -TREND_THRESHOLD) return 'Declining';
  return 'Steady';
};

export const trendTint: Record<Trend, string> = {
  Improving: 'success',
  Steady: 'secondary',
  Declining: 'danger',
  'Not placed': 'secondary',
};

export const rankMovementOf = (row: ClassSection) => {
  if (row.rank === null) return null;
  const moved = row.previousRank - row.rank;
  if (moved === 0) return { label: 'No change', tint: 'secondary', icon: 'ti ti-minus' };
  return moved > 0
    ? { label: `Up ${moved}`, tint: 'success', icon: 'ti ti-arrow-up' }
    : { label: `Down ${-moved}`, tint: 'danger', icon: 'ti ti-arrow-down' };
};

export const evaluatedLabel = (row: ClassSection) => {
  if (!row.evaluatedDaysAgo) return 'Blocked';
  if (row.evaluatedDaysAgo === 1) return 'yesterday';
  return `${row.evaluatedDaysAgo} days ago`;
};

/** Actions still open on the section, which is what the panel counts. */
export const openActionsOf = (row: ClassSection) =>
  row.actions.filter((action) => action.state === 'Active').length;

export const actionTint: Record<ActionState, string> = {
  Active: 'warning',
  Proposed: 'info',
  Closed: 'success',
};

/* -------------------------------- The filters ------------------------------- */

export const labelOf = (row: ClassSection) => `${row.grade} ${row.section}`;

export const searchIndexOf = (row: ClassSection) =>
  [labelOf(row), row.teacher, row.reportRef ?? '', row.grade, row.section].join(' ').toLowerCase();

export const gradeOptions = [
  'Class II',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class VIII',
  'Class IX',
  'Class X',
];
export const sectionOptions = ['A', 'B', 'C'];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const examOptions = ['Unit Test 1', 'Term 1 Exam', 'Unit Test 2', 'Half Yearly'];
export const subjectOptions = [
  'English',
  'Mathematics',
  'Science',
  'Social Science',
  'Hindi',
  'Computer Science',
  'EVS',
];
export const teacherOptions = [
  'Mrs. Ellen Cruz',
  'Mr. Arjun Kale',
  'Ms. Grace Otieno',
  'Mrs. Sofia Alvarez',
  'Mr. Ethan Brooks',
  'Ms. Meera Nair',
];
export const levelOptions: SectionLevel[] = [
  'Excellent',
  'Good',
  'Average',
  'Needs Improvement',
  'At Risk',
  'Under Review',
];
export const bandOptions: AttendanceBand[] = ['Regular', 'Watch', 'Concern'];
