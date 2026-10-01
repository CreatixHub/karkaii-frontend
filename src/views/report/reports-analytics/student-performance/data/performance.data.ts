/* ------------------------------- The register ------------------------------ */

export const REGISTER_TOTAL = 1186;
export const ACADEMIC_YEAR = '2026-2027';
export const EXAM = 'Term 1 Exam';
export const EXAM_REF = 'EXM-2026-014';
export const EXAM_WINDOW = '6 Jul – 17 Jul 2026';
export const PREVIOUS_EXAM = 'Unit Test 1';
export const PASS_MARK = 33;
export const WORKING_DAYS = 96;

/** Periods a student misses for each day away, as every panel's figure implies. */
export const PERIODS_PER_DAY = 6;

/**
 * The school's grading scale. Same floors as the Academic Reports page, which
 * prints them in full; the C+ remark is the word this page uses.
 */
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

/** Where a score places a student. Under Review sits outside the ladder. */
export const LEVEL_SCALE: { level: PerformanceLevel; floor: number }[] = [
  { level: 'Excellent', floor: 85 },
  { level: 'Good', floor: 75 },
  { level: 'Average', floor: 60 },
  { level: 'Needs Improvement', floor: 40 },
  { level: 'At Risk', floor: 0 },
];

/** Attendance bands, as the More Filters panel offers them. */
export const ATTENDANCE_BANDS: { band: AttendanceBand; floor: number }[] = [
  { band: 'Regular', floor: 90 },
  { band: 'Watch', floor: 85 },
  { band: 'Concern', floor: 0 },
];

/** A change of this many points or more is a direction rather than noise. */
export const TREND_THRESHOLD = 2;

/* --------------------------------- Shapes ---------------------------------- */

export type PerformanceLevel =
  | 'Excellent'
  | 'Good'
  | 'Average'
  | 'Needs Improvement'
  | 'At Risk'
  | 'Under Review';

export type AttendanceBand = 'Regular' | 'Watch' | 'Concern';

export type PlanState = 'Active' | 'Proposed' | 'Closed' | 'Not required';

export interface SubjectMark {
  subject: string;
  marks: number | null;
  /** Where the template gives the same paper's previous mark, for the compare. */
  previous?: number;
}

export interface MeetingEntry {
  title: string;
  date: string;
  by: string;
  held: 'Held' | 'Scheduled';
  note: string;
}

export interface RemarkEntry {
  author: string;
  role: string;
  date: string;
  body: string;
}

export interface ImprovementPlan {
  reference?: string;
  state: PlanState;
  target?: string;
}

export interface StudentPerformance {
  id: string;
  name: string;
  image: string;
  roll: number;
  classTeacher: string;
  className: string;
  section: string;
  sectionStrength: number;

  subjects: SubjectMark[];
  /** Previous total marks, out of the same maximum. Drives the growth figure. */
  previousObtained: number;

  rank: number | null;
  previousRank: number | null;

  present: number;
  lateMarks: number;

  /** Days since the assessment was evaluated, against the 31 Jul register. */
  evaluatedDaysAgo: number;
  reportRef?: string;
  reportState?: string;

  plan: ImprovementPlan;
  strengths: string[];
  improvements: string[];
  remarks: RemarkEntry[];
  meetings: MeetingEntry[];
  noteTags: string[];
  note: string;
}

/* --------------------------------- The rows -------------------------------- */

export const studentPerformances: StudentPerformance[] = [
  {
    id: 'AD9887402',
    name: 'Ananya Rao',
    image: 'assets/img/students/student-01.jpg',
    roll: 14,
    classTeacher: 'Mrs. Ellen Cruz',
    className: 'Class X',
    section: 'B',
    sectionStrength: 46,
    subjects: [
      { subject: 'English', marks: 90, previous: 87 },
      { subject: 'Mathematics', marks: 96, previous: 92 },
      { subject: 'Science', marks: 93, previous: 89 },
      { subject: 'Social Science', marks: 89, previous: 86 },
      { subject: 'Hindi', marks: 85, previous: 83 },
      { subject: 'Computer Science', marks: 97, previous: 93 },
    ],
    previousObtained: 530,
    rank: 1,
    previousRank: 2,
    present: 93,
    lateMarks: 1,
    evaluatedDaysAgo: 4,
    reportRef: 'ACR-2026-0341',
    reportState: 'published',
    plan: { state: 'Not required' },
    strengths: ['Mathematics and Computer Science', 'Laboratory work', 'Written presentation'],
    improvements: ['Hindi comprehension', 'Time spent on the second language'],
    remarks: [
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Class Teacher',
        date: '27 Jul 2026',
        body: 'Consistent across every paper and first in the section for the second year running.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Science',
        date: '26 Jul 2026',
        body: 'Practical record is the best in Class X. Put forward for the Science Olympiad panel.',
      },
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Hindi',
        date: '25 Jul 2026',
        body: 'Hindi at 85 is the weakest of the six. Comprehension answers need more detail.',
      },
    ],
    meetings: [
      {
        title: 'Term 1 review',
        date: '29 Jul 2026',
        by: 'Mrs. Ellen Cruz',
        held: 'Held',
        note: 'Guardians acknowledged the report card on the portal the same evening.',
      },
      {
        title: 'Unit Test 1 review',
        date: '24 Jun 2026',
        by: 'Mrs. Ellen Cruz',
        held: 'Held',
        note: 'Agreed to keep Hindi reading practice at thirty minutes a day.',
      },
    ],
    noteTags: ['Top of the section', 'Science Olympiad panel'],
    note: 'Merit certificate GEN-2026-0455 was raised from this result and collected on 26 Jul.',
  },

  {
    id: 'AD9889014',
    name: 'Rohan Desai',
    image: 'assets/img/students/student-05.jpg',
    roll: 9,
    classTeacher: 'Mr. Arjun Kale',
    className: 'Class IX',
    section: 'C',
    sectionStrength: 42,
    subjects: [
      { subject: 'English', marks: 86 },
      { subject: 'Mathematics', marks: 91 },
      { subject: 'Science', marks: 89 },
      { subject: 'Social Science', marks: 84 },
      { subject: 'Hindi', marks: 88 },
      { subject: 'Computer Science', marks: 92 },
    ],
    previousObtained: 511,
    rank: 1,
    previousRank: 2,
    present: 91,
    lateMarks: 2,
    evaluatedDaysAgo: 3,
    reportRef: 'ACR-2026-0344',
    reportState: 'reviewed, not published',
    plan: { state: 'Not required' },
    strengths: ['Mathematics', 'Computer Science project work', 'Steady attendance'],
    improvements: ['Social Science answer length', 'Handwriting under time pressure'],
    remarks: [
      {
        author: 'Mr. Arjun Kale',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'Top of IX C and the only student above ninety in Mathematics this term.',
      },
      {
        author: 'Ms. Deepa Rawat',
        role: 'Computer Science',
        date: '27 Jul 2026',
        body: 'Project work was the strongest submission in the section.',
      },
    ],
    meetings: [
      {
        title: 'Term 1 review',
        date: '30 Jul 2026',
        by: 'Mr. Arjun Kale',
        held: 'Held',
        note: 'Section report is still held for the Mathematics remedial plan, so only the personal sheet was shared.',
      },
    ],
    noteTags: ['Section topper', 'Steady growth'],
    note:
      'Named as top performer in the Class IX C summary ACR-2026-0344, which is reviewed but not yet published.',
  },

  {
    id: 'AD9893660',
    name: 'Meera Iyer',
    image: 'assets/img/students/student-03.jpg',
    roll: 4,
    classTeacher: 'Ms. Grace Otieno',
    className: 'Class V',
    section: 'A',
    sectionStrength: 38,
    subjects: [
      { subject: 'English', marks: 91 },
      { subject: 'Mathematics', marks: 87 },
      { subject: 'EVS', marks: 94 },
      { subject: 'Hindi', marks: 85 },
      { subject: 'Computer Science', marks: 91 },
    ],
    previousObtained: 454,
    rank: 1,
    previousRank: 1,
    present: 92,
    lateMarks: 0,
    evaluatedDaysAgo: 2,
    reportRef: 'ACR-2026-0356',
    reportState: 'ready to generate',
    plan: { state: 'Not required' },
    strengths: ['EVS and English', 'Class participation', 'Full attendance record'],
    improvements: ['Hindi writing speed', 'Mathematics word problems'],
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '29 Jul 2026',
        body: 'First in V A for the third assessment running. EVS project was read out at assembly.',
      },
      {
        author: 'Ms. Grace Otieno',
        role: 'Hindi',
        date: '29 Jul 2026',
        body: 'Slight dip of one point overall. Hindi at 85 is the only subject below the section mean gap.',
      },
    ],
    meetings: [
      {
        title: 'Term 1 review',
        date: '30 Jul 2026',
        by: 'Ms. Grace Otieno',
        held: 'Scheduled',
        note: 'Set for 1 Aug with the consolidated report ACR-2026-0356 once it is generated.',
      },
    ],
    noteTags: ['Section topper', 'Full attendance'],
    note: 'Bonafide certificate REQ-2026-0159 was raised for her scholarship application on 24 Jul.',
  },

  {
    id: 'AD9892431',
    name: 'Lisa Gourley',
    image: 'assets/img/students/student-06.jpg',
    roll: 21,
    classTeacher: 'Ms. Grace Otieno',
    className: 'Class II',
    section: 'B',
    sectionStrength: 41,
    subjects: [
      { subject: 'English', marks: 92 },
      { subject: 'Mathematics', marks: 89 },
      { subject: 'EVS', marks: 94 },
      { subject: 'Hindi', marks: 87 },
    ],
    previousObtained: 349,
    rank: 3,
    previousRank: 5,
    present: 91,
    lateMarks: 0,
    evaluatedDaysAgo: 6,
    reportRef: 'ACR-2026-0362',
    reportState: 'published',
    plan: { state: 'Not required' },
    strengths: ['Reading fluency', 'EVS observation work', 'Neat written work'],
    improvements: ['Hindi letter formation', 'Mental arithmetic speed'],
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '25 Jul 2026',
        body: 'Two places up from Unit Test 1. Reading fluency is well ahead of the section.',
      },
      {
        author: 'Ms. Fatima Sheikh',
        role: 'Library',
        date: '22 Jul 2026',
        body: 'Completed the Junior Reading Challenge. Participation certificate is in job GEN-2026-0451.',
      },
    ],
    meetings: [
      {
        title: 'Term 1 review',
        date: '28 Jul 2026',
        by: 'Ms. Grace Otieno',
        held: 'Held',
        note: 'Junior section reports carry a descriptive band rather than a grade point. Explained to both guardians.',
      },
    ],
    noteTags: ['Junior section', 'Improving'],
    note: 'No grade point is printed for the junior section. The letter grade here is for staff use only.',
  },

  {
    id: 'AD9893712',
    name: 'Tanvi Sharma',
    image: 'assets/img/students/student-07.jpg',
    roll: 27,
    classTeacher: 'Ms. Grace Otieno',
    className: 'Class V',
    section: 'A',
    sectionStrength: 38,
    subjects: [
      { subject: 'English', marks: 82 },
      { subject: 'Mathematics', marks: 71 },
      { subject: 'EVS', marks: 84 },
      { subject: 'Hindi', marks: 76 },
      { subject: 'Computer Science', marks: 79 },
    ],
    previousObtained: 373,
    rank: 9,
    previousRank: 13,
    present: 85,
    lateMarks: 5,
    evaluatedDaysAgo: 2,
    plan: {
      reference: 'IMP-2026-0061',
      state: 'Closed',
      target: 'Reach 70 in Mathematics by the end of Term 1',
    },
    strengths: ['EVS and English', 'Response to the improvement plan'],
    improvements: ['Punctuality', 'Mathematics accuracy under time pressure'],
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '29 Jul 2026',
        body: 'Four places up and the improvement plan target was met. Plan closed on 29 Jul.',
      },
      {
        author: 'Ms. Grace Otieno',
        role: 'Attendance',
        date: '20 Jul 2026',
        body: 'Eleven days missed and five late marks. Worth watching in Term 2.',
      },
    ],
    meetings: [
      {
        title: 'Improvement plan closure',
        date: '29 Jul 2026',
        by: 'Ms. Grace Otieno',
        held: 'Held',
        note: 'Plan IMP-2026-0061 closed after the Mathematics target of 70 was met at 71.',
      },
      {
        title: 'Improvement plan opening',
        date: '18 May 2026',
        by: 'Ms. Grace Otieno',
        held: 'Held',
        note: 'Plan opened after Unit Test 1. Weekly problem sets agreed with both guardians.',
      },
    ],
    noteTags: ['Plan met its target', 'Attendance watch'],
    note:
      'Improvement plan IMP-2026-0061 ran for ten weeks and closed on 29 Jul with the Mathematics target met.',
  },

  {
    id: 'AD9891255',
    name: 'Aarav Kumar',
    image: 'assets/img/students/student-08.jpg',
    roll: 18,
    classTeacher: 'Mrs. Sofia Alvarez',
    className: 'Class VII',
    section: 'A',
    sectionStrength: 44,
    subjects: [
      { subject: 'English', marks: 74 },
      { subject: 'Mathematics', marks: 68 },
      { subject: 'Science', marks: 79 },
      { subject: 'Social Science', marks: 71 },
      { subject: 'Hindi', marks: 66 },
      { subject: 'Computer Science', marks: 81 },
    ],
    previousObtained: 455,
    rank: 11,
    previousRank: 9,
    present: 88,
    lateMarks: 4,
    evaluatedDaysAgo: 1,
    reportRef: 'ACR-2026-0347',
    reportState: 'pending review',
    plan: {
      reference: 'IMP-2026-0088',
      state: 'Proposed',
      target: 'Reach the section mean in both papers by the Half Yearly',
    },
    strengths: ['Computer Science', 'Science practical work'],
    improvements: ['Mathematics', 'Hindi', 'Attendance in the second half of the term'],
    remarks: [
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Class Teacher',
        date: '30 Jul 2026',
        body: 'Slipped two places. Eight absences in the term show in the Hindi score.',
      },
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        date: '29 Jul 2026',
        body: 'Sixty-eight is below the section mean. Recommended for the Saturday problem clinic.',
      },
    ],
    meetings: [
      {
        title: 'Improvement plan proposal',
        date: '3 Aug 2026',
        by: 'Mr. Ethan Brooks',
        held: 'Scheduled',
        note: 'Plan IMP-2026-0088 goes to the guardians on 3 Aug, before the Half Yearly scheme is set.',
      },
    ],
    noteTags: ['Declining', 'Plan proposed'],
    note:
      'Report card ACR-2026-0347 is still with the Academic Coordinator, so nothing has been shared with the guardians yet.',
  },

  {
    id: 'AD9894107',
    name: 'Ishaan Verma',
    image: 'assets/img/students/student-09.jpg',
    roll: 33,
    classTeacher: 'Ms. Meera Nair',
    className: 'Class IV',
    section: 'A',
    sectionStrength: 40,
    subjects: [
      { subject: 'English', marks: 58 },
      { subject: 'Mathematics', marks: 41 },
      { subject: 'EVS', marks: 62 },
      { subject: 'Hindi', marks: 51 },
      { subject: 'Computer Science', marks: 61 },
    ],
    previousObtained: 291,
    rank: 34,
    previousRank: 31,
    present: 75,
    lateMarks: 9,
    evaluatedDaysAgo: 3,
    plan: {
      reference: 'IMP-2026-0074',
      state: 'Active',
      target: 'Reach 55 in Mathematics and 85% attendance by the Half Yearly',
    },
    strengths: ['EVS observation work', 'Willingness at the Saturday clinic'],
    improvements: ['Mathematics', 'Hindi', 'Attendance', 'Punctuality'],
    remarks: [
      {
        author: 'Ms. Meera Nair',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'Twenty-one days missed. Mathematics at 41 is the lowest in the section.',
      },
      {
        author: 'Mr. Ethan Brooks',
        role: 'Mathematics',
        date: '27 Jul 2026',
        body: 'Attends the Saturday clinic but the gap from Unit Test 1 has widened.',
      },
      {
        author: 'Ms. Meera Nair',
        role: 'Counselling',
        date: '15 Jul 2026',
        body: 'Referred to the counsellor after the third guardian meeting. MV-2026-0331 on record.',
      },
    ],
    meetings: [
      {
        title: 'Term 1 review',
        date: '28 Jul 2026',
        by: 'Ms. Meera Nair',
        held: 'Held',
        note: 'Third meeting this term. Attendance plan reviewed with the guardians and the counsellor.',
      },
      {
        title: 'Improvement plan opening',
        date: '26 Jun 2026',
        by: 'Ms. Meera Nair',
        held: 'Held',
        note: 'Plan IMP-2026-0074 opened with a Mathematics target of 55 and an attendance target of 85%.',
      },
      {
        title: 'Attendance concern',
        date: '21 May 2026',
        by: 'Ms. Meera Nair',
        held: 'Held',
        note: 'First formal meeting after nine days missed in May.',
      },
    ],
    noteTags: ['Improvement plan active', 'Attendance concern'],
    note:
      'Report card is held until the improvement plan review on 7 Aug so the plan and the result go out together.',
  },

  {
    id: 'AD9892008',
    name: 'Kabir Shah',
    image: 'assets/img/students/student-10.jpg',
    roll: 12,
    classTeacher: 'Ms. Meera Nair',
    className: 'Class VI',
    section: 'B',
    sectionStrength: 43,
    subjects: [
      { subject: 'English', marks: 71 },
      { subject: 'Mathematics', marks: 63 },
      { subject: 'Science', marks: null },
      { subject: 'Social Science', marks: 69 },
      { subject: 'Hindi', marks: 74 },
      { subject: 'Computer Science', marks: 77 },
    ],
    previousObtained: 358,
    rank: null,
    previousRank: 19,
    present: 81,
    lateMarks: 6,
    evaluatedDaysAgo: 1,
    reportRef: 'ACR-2026-0353',
    reportState: 'awaiting marks',
    plan: { state: 'Not required' },
    strengths: ['Computer Science', 'Hindi'],
    improvements: ['Mathematics', 'Attendance'],
    remarks: [
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'No level can be placed while a subject is missing. Marks entry MRK-2026-0218 has been open since 21 Jul.',
      },
      {
        author: 'Ms. Meera Nair',
        role: 'Class Teacher',
        date: '22 Jul 2026',
        body: 'Fifteen days missed in the term. Guardian meeting recorded on 22 Jul.',
      },
    ],
    meetings: [
      {
        title: 'Attendance review',
        date: '22 Jul 2026',
        by: 'Ms. Meera Nair',
        held: 'Held',
        note: 'Fifteen days missed. Guardians agreed to a fortnightly attendance note.',
      },
    ],
    noteTags: ['1 subject missing', 'Level withheld'],
    note:
      'Mr. Vikram Sethi holds the Class VI B practical register. The Science entry MRK-2026-0218 blocks both the report card and the level.',
  },
];

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

const marked = (row: StudentPerformance) => row.subjects.filter((subject) => subject.marks !== null);

export const papersOf = (row: StudentPerformance) => marked(row).length;

export const isCompleteOf = (row: StudentPerformance) =>
  row.subjects.every((subject) => subject.marks !== null);

export const obtainedOf = (row: StudentPerformance) =>
  marked(row).reduce((total, subject) => total + (subject.marks as number), 0);

export const maximumOf = (row: StudentPerformance) => papersOf(row) * 100;

export const scoreOf = (row: StudentPerformance) => round1((obtainedOf(row) / maximumOf(row)) * 100);

export const previousScoreOf = (row: StudentPerformance) =>
  round1((row.previousObtained / maximumOf(row)) * 100);

/** The growth figure, computed from both totals rather than written beside them. */
export const growthOf = (row: StudentPerformance) =>
  round1((obtainedOf(row) / maximumOf(row)) * 100 - (row.previousObtained / maximumOf(row)) * 100);

export const gradeOf = (score: number) =>
  GRADE_SCALE.find((step) => score >= step.floor) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

export const subjectGradeOf = (subject: SubjectMark) =>
  subject.marks === null ? null : gradeOf(subject.marks).grade;

/** Withheld while a paper is still open, as the coordinator's remark says. */
export const overallGradeOf = (row: StudentPerformance) =>
  isCompleteOf(row) ? gradeOf(scoreOf(row)) : null;

export const gradeTint = (grade: string) => {
  if (grade === 'A+' || grade === 'A') return 'success';
  if (grade === 'B+' || grade === 'B') return 'info';
  if (grade === 'C+' || grade === 'C') return 'warning';
  return 'danger';
};

export const breakdownOf = (row: StudentPerformance) => {
  const counts = new Map<string, number>();
  row.subjects.forEach((subject) => {
    const grade = subjectGradeOf(subject);
    if (grade) counts.set(grade, (counts.get(grade) ?? 0) + 1);
  });
  return GRADE_SCALE.filter((step) => counts.has(step.grade)).map((step) => ({
    grade: step.grade,
    count: counts.get(step.grade) as number,
  }));
};

export const bestPaperOf = (row: StudentPerformance) => {
  const list = marked(row);
  return list.length === 0
    ? null
    : list.reduce((best, subject) => ((subject.marks as number) > (best.marks as number) ? subject : best));
};

export const weakestPaperOf = (row: StudentPerformance) => {
  const list = marked(row);
  return list.length === 0
    ? null
    : list.reduce((worst, subject) => ((subject.marks as number) < (worst.marks as number) ? subject : worst));
};

export const atPassMarkOf = (row: StudentPerformance) =>
  marked(row).filter((subject) => (subject.marks as number) >= PASS_MARK).length;

export const belowPassOf = (row: StudentPerformance) => papersOf(row) - atPassMarkOf(row);

/* -------------------------------- Attendance ------------------------------- */

export const absentOf = (row: StudentPerformance) => WORKING_DAYS - row.present;

export const attendancePctOf = (row: StudentPerformance) => round1((row.present / WORKING_DAYS) * 100);

/** Six periods for every day away, which is what every panel's figure comes to. */
export const periodsLostOf = (row: StudentPerformance) => absentOf(row) * PERIODS_PER_DAY;

export const attendanceBandOf = (row: StudentPerformance): AttendanceBand => {
  const pct = attendancePctOf(row);
  return (ATTENDANCE_BANDS.find((step) => pct >= step.floor) ?? ATTENDANCE_BANDS[2]).band;
};

export const bandTint: Record<AttendanceBand, string> = {
  Regular: 'success',
  Watch: 'warning',
  Concern: 'danger',
};

/* ------------------------------ Level and trend ---------------------------- */

/** A level cannot be placed while a paper is open, so it reads Under Review. */
export const levelOf = (row: StudentPerformance): PerformanceLevel => {
  if (!isCompleteOf(row)) return 'Under Review';
  const score = scoreOf(row);
  return (LEVEL_SCALE.find((step) => score >= step.floor) ?? LEVEL_SCALE[LEVEL_SCALE.length - 1]).level;
};

export const levelPill: Record<PerformanceLevel, string> = {
  Excellent: 'is-completed',
  Good: 'is-active',
  Average: 'is-pending',
  'Needs Improvement': 'is-review',
  'At Risk': 'is-blocked',
  'Under Review': 'is-inactive',
};

export type Trend = 'Improving' | 'Steady' | 'Declining' | 'Not Placed';

/** A move of under two points either way is noise rather than a direction. */
export const trendOf = (row: StudentPerformance): Trend => {
  if (!isCompleteOf(row)) return 'Not Placed';
  const growth = growthOf(row);
  if (growth >= TREND_THRESHOLD) return 'Improving';
  if (growth <= -TREND_THRESHOLD) return 'Declining';
  return 'Steady';
};

export const trendTint: Record<Trend, string> = {
  Improving: 'success',
  Steady: 'secondary',
  Declining: 'danger',
  'Not Placed': 'secondary',
};

/** Up 2 / Down 3 / No change, from the two ranks. */
export const rankMovementOf = (row: StudentPerformance) => {
  if (row.rank === null || row.previousRank === null) return null;
  const moved = row.previousRank - row.rank;
  if (moved === 0) return { label: 'No change', tint: 'secondary', icon: 'ti ti-minus' };
  return moved > 0
    ? { label: `Up ${moved}`, tint: 'success', icon: 'ti ti-arrow-up' }
    : { label: `Down ${-moved}`, tint: 'danger', icon: 'ti ti-arrow-down' };
};

/** How long ago the assessment was evaluated, against the 31 Jul register. */
export const evaluatedLabel = (row: StudentPerformance) => {
  const days = row.evaluatedDaysAgo;
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
};

/* ------------------------------ Subject movement --------------------------- */

/** The compare dialog's paper-by-paper change, where both marks are known. */
export const movementOf = (row: StudentPerformance) =>
  row.subjects
    .filter((subject) => subject.marks !== null && subject.previous !== undefined)
    .map((subject) => ({
      subject: subject.subject,
      previous: subject.previous as number,
      current: subject.marks as number,
      change: (subject.marks as number) - (subject.previous as number),
    }))
    .sort((a, b) => b.change - a.change || b.current - a.current);

/* -------------------------------- The filters ------------------------------- */

export const classLabelOf = (row: StudentPerformance) => `${row.className} ${row.section}`;

export const searchIndexOf = (row: StudentPerformance) =>
  [row.name, row.id, classLabelOf(row), row.classTeacher, `Roll ${row.roll}`].join(' ').toLowerCase();

export const classOptions = [
  'Class II',
  'Class IV',
  'Class V',
  'Class VI',
  'Class VII',
  'Class IX',
  'Class X',
];
export const sectionOptions = ['A', 'B', 'C'];
export const levelOptions: PerformanceLevel[] = [
  'Excellent',
  'Good',
  'Average',
  'Needs Improvement',
  'At Risk',
  'Under Review',
];
export const gradeOptions = GRADE_SCALE.map((step) => step.grade);
export const bandOptions: AttendanceBand[] = ['Regular', 'Watch', 'Concern'];
export const planOptions: PlanState[] = ['Active', 'Proposed', 'Closed', 'Not required'];
export const examOptions = ['Unit Test 1', 'Term 1 Exam', 'Unit Test 2', 'Half Yearly'];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const rankFilterOptions = ['Top 10', 'Top 25', 'Bottom 25', 'Bottom 10'];
export const growthOptions = ['Improved', 'Steady', 'Declined'];
export const belowPassOptions = ['None', '1 subject', '2 subjects', '3 or more'];
export const teacherOptions = [
  'Ms. Priya Sundaram',
  'Mr. Deepak Bhat',
  'Mrs. Anjali Rao',
  'Mrs. Ellen Cruz',
  'Mr. Arjun Kale',
  'Ms. Grace Otieno',
  'Mrs. Sofia Alvarez',
  'Ms. Meera Nair',
];

/** Where the student sits in the section, for the Class Rank filter. */
export const rankBandOf = (row: StudentPerformance) => {
  if (row.rank === null) return '';
  const share = (row.rank / row.sectionStrength) * 100;
  if (share <= 10) return 'Top 10';
  if (share <= 25) return 'Top 25';
  if (share >= 90) return 'Bottom 10';
  if (share >= 75) return 'Bottom 25';
  return '';
};

export const belowPassLabelOf = (row: StudentPerformance) => {
  const count = belowPassOf(row);
  if (count === 0) return 'None';
  if (count === 1) return '1 subject';
  if (count === 2) return '2 subjects';
  return '3 or more';
};

export const growthLabelOf = (row: StudentPerformance) => {
  const trend = trendOf(row);
  if (trend === 'Improving') return 'Improved';
  if (trend === 'Declining') return 'Declined';
  return 'Steady';
};

/** A student needing academic attention: below Good, or off the attendance line. */
export const needsAttentionOf = (row: StudentPerformance) => {
  const level = levelOf(row);
  return (
    level === 'Average' ||
    level === 'Needs Improvement' ||
    level === 'At Risk' ||
    level === 'Under Review' ||
    attendanceBandOf(row) !== 'Regular'
  );
};

/** The rail's top performers: an A or better, on the same line as the grade. */
export const isTopPerformer = (row: StudentPerformance) => {
  const grade = overallGradeOf(row);
  return grade !== null && grade.floor >= 81;
};
