/* ------------------------------- The register ------------------------------ */

export const REGISTER_TOTAL = 1842;
export const ACADEMIC_YEAR = '2026-2027';
export const EXAM = 'Term 1 Exam';
export const EXAM_REF = 'EXM-2026-014';
export const EXAM_WINDOW = '6 Jul – 17 Jul 2026';
export const SCALE_NAME = 'A+ to E · 8 point';
export const PASS_MARK = 33;

/** The scale config the Grade Scale dialog states. */
export const DISTINCTION_AT = 75;
export const ATTENDANCE_POLICY = 75;

/**
 * The grading scale.
 *
 * Ordered high to low; the first floor a mark clears is its grade. See the file
 * header for why these bands and not the round ones the dialog's table prints.
 */
export const GRADE_SCALE: { grade: string; floor: number; point: number; remark: string }[] = [
  { grade: 'A+', floor: 91, point: 10, remark: 'Outstanding' },
  { grade: 'A', floor: 83, point: 9, remark: 'Excellent' },
  { grade: 'B+', floor: 72, point: 8, remark: 'Very Good' },
  { grade: 'B', floor: 66, point: 7, remark: 'Good' },
  { grade: 'C+', floor: 60, point: 6, remark: 'Above Average' },
  { grade: 'C', floor: 50, point: 5, remark: 'Average' },
  { grade: 'D', floor: 40, point: 4, remark: 'Satisfactory' },
  { grade: 'E', floor: 0, point: 0, remark: 'Needs Improvement' },
];

/** What each grade means on the Performance Level column. */
export const LEVEL_OF_GRADE: Record<string, PerformanceLevel> = {
  'A+': 'Outstanding',
  A: 'Very Good',
  'B+': 'Good',
  B: 'Good',
  'C+': 'Satisfactory',
  C: 'Satisfactory',
  D: 'Needs Support',
  E: 'Needs Support',
};

/* --------------------------------- Shapes ---------------------------------- */

export type PerformanceLevel = 'Outstanding' | 'Very Good' | 'Good' | 'Satisfactory' | 'Needs Support';

export type ResultStatus = 'Published' | 'Pending Review' | 'Draft' | 'Withheld';

export type SubjectKind = 'Core subject' | 'Elective' | 'Second language';

export interface SubjectRow {
  subject: string;
  marks: number;
  /** The section's mean on this paper, where the record carries one. */
  sectionMean?: number;
  teacher?: string;
}

export interface ListEntry {
  title: string;
  detail: string;
}

export interface RemarkEntry {
  author: string;
  role: string;
  date: string;
  body: string;
}

export interface GradeEntry {
  id: string;
  student: string;
  image: string;
  admission: string;
  admitted: string;
  roll: string;
  classTeacher: string;

  className: string;
  section: string;
  sectionStrength: number;
  scheme: string;

  /** The subject this row grades, and what kind of paper it is. */
  subject: string;
  subjectKind: SubjectKind;

  /** The student's whole sheet. The row's marks are this subject's entry. */
  subjects: SubjectRow[];
  /** Above the section mean on this many papers. */
  aboveSectionMean: number;

  rank: number;
  previousRank: number;
  gradeRank: number;
  gradeRankOf: number;

  /** The school's own point figure for this student on this exam. */
  gpa: number;
  previousGpa: number;
  cumulativeGpa: number;
  cumulativeExams: number;
  previousPct: number;

  attendancePct: number;

  submitted: boolean;
  reviewer?: string;
  recheckRequested?: boolean;
  publishedOn?: string;
  statusNote: string;

  strengths: string[];
  improvements: string[];
  remarks: RemarkEntry[];
  awards: ListEntry[];
  awardsNote: ListEntry[];
  meetings: ListEntry[];
  nextMeeting: string;
  audit: ListEntry[];
}

/* --------------------------------- The rows -------------------------------- */

export const gradeEntries: GradeEntry[] = [
  {
    id: 'AD9887402-MAT',
    student: 'Ananya Rao',
    image: 'assets/img/students/student-01.jpg',
    admission: 'AD9887402',
    admitted: 'Admitted Jun 2019',
    roll: 'Roll 14',
    classTeacher: 'Mrs. Ellen Cruz',
    className: 'Class X',
    section: 'B',
    sectionStrength: 46,
    scheme: 'Science · 6 subjects',
    subject: 'Mathematics',
    subjectKind: 'Core subject',
    subjects: [
      { subject: 'Computer Science', marks: 97, sectionMean: 78.4, teacher: 'Mr. Vikram Sethi' },
      { subject: 'Mathematics', marks: 96, sectionMean: 68.4, teacher: 'Mrs. Ellen Cruz' },
      { subject: 'Science', marks: 93, sectionMean: 76.8, teacher: 'Mr. Vikram Sethi' },
      { subject: 'English', marks: 90, sectionMean: 78.2, teacher: 'Mrs. Sofia Alvarez' },
      { subject: 'Social Science', marks: 89, sectionMean: 74.6, teacher: 'Mr. Arjun Kale' },
      { subject: 'Hindi', marks: 85, sectionMean: 71.9, teacher: 'Mrs. Sofia Alvarez' },
    ],
    aboveSectionMean: 6,
    rank: 1,
    previousRank: 2,
    gradeRank: 1,
    gradeRankOf: 138,
    gpa: 10.0,
    previousGpa: 9.6,
    cumulativeGpa: 9.4,
    cumulativeExams: 6,
    previousPct: 88.3,
    attendancePct: 96.9,
    submitted: true,
    publishedOn: '29 Jul 2026',
    statusNote: '29 Jul 2026',
    strengths: ['Algebra', 'Programming logic', 'Lab practicals'],
    improvements: ['Hindi comprehension', 'Essay structure'],
    remarks: [
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Mathematics',
        date: '28 Jul 2026',
        body: 'Full marks on both the algebra and geometry sections. Ready for olympiad coaching.',
      },
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Hindi',
        date: '27 Jul 2026',
        body: 'Weakest of the six papers at 85. Comprehension answers need more detail.',
      },
    ],
    awards: [
      { title: 'Subject topper — Mathematics', detail: 'Term 1 Exam · 96 of 100' },
      { title: 'Merit certificate', detail: 'GEN-2026-0455 · collected 26 Jul' },
    ],
    awardsNote: [{ title: 'Awards This Year', detail: '4' }],
    meetings: [
      { title: 'Term 1 result meeting', detail: '30 Jul 2026 · attended · Mr. Rakesh Rao' },
      { title: 'Stream counselling', detail: '12 Jun 2026 · attended' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'Marks closed for all six subjects', detail: '24 Jul 2026 · Mrs. Kalpana Menon' },
      { title: 'Result published to guardians', detail: '29 Jul 2026 · parent portal' },
    ],
  },

  {
    id: 'AD9893660-SCI',
    student: 'Meera Iyer',
    image: 'assets/img/students/student-03.jpg',
    admission: 'AD9893660',
    admitted: 'Admitted Jun 2022',
    roll: 'Roll 21',
    classTeacher: 'Ms. Grace Otieno',
    className: 'Class V',
    section: 'A',
    sectionStrength: 38,
    scheme: 'Junior · 5 subjects',
    subject: 'Science',
    subjectKind: 'Core subject',
    subjects: [
      { subject: 'Mathematics', marks: 92 },
      { subject: 'Science', marks: 91 },
      { subject: 'EVS', marks: 90 },
      { subject: 'English', marks: 88 },
      { subject: 'Hindi', marks: 86 },
    ],
    aboveSectionMean: 5,
    rank: 1,
    previousRank: 1,
    gradeRank: 2,
    gradeRankOf: 114,
    gpa: 9.6,
    previousGpa: 9.4,
    cumulativeGpa: 9.2,
    cumulativeExams: 5,
    previousPct: 87.6,
    attendancePct: 100,
    submitted: true,
    publishedOn: '29 Jul 2026',
    statusNote: '29 Jul 2026',
    strengths: ['Observation skills', 'Mental arithmetic', 'Diagram work'],
    improvements: ['Hindi handwriting'],
    remarks: [
      {
        author: 'Ms. Grace Otieno',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'Steady across all five papers. Full attendance for a second term running.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Science',
        date: '27 Jul 2026',
        body: 'Best diagram work in the section. Suggested for the junior science club.',
      },
    ],
    awards: [
      { title: 'Section topper', detail: 'Term 1 Exam · Class V A' },
      { title: 'Perfect attendance shield', detail: 'Term 1 · 96 of 96 days' },
    ],
    awardsNote: [{ title: 'Awards This Year', detail: '3' }],
    meetings: [
      { title: 'Term 1 result meeting', detail: '30 Jul 2026 · attended · Mrs. Lakshmi Iyer' },
      { title: 'Open house', detail: '20 Jun 2026 · attended' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'Marks closed for all five subjects', detail: '24 Jul 2026 · Mrs. Kalpana Menon' },
      { title: 'Result published to guardians', detail: '29 Jul 2026 · parent portal' },
    ],
  },

  {
    id: 'AD9893712-ENG',
    student: 'Tanvi Sharma',
    image: 'assets/img/students/student-07.jpg',
    admission: 'AD9893712',
    admitted: 'Admitted Jun 2020',
    roll: 'Roll 05',
    classTeacher: 'Mrs. Sofia Alvarez',
    className: 'Class VIII',
    section: 'A',
    sectionStrength: 44,
    scheme: 'Middle · 6 subjects',
    subject: 'English',
    subjectKind: 'Core subject',
    subjects: [
      { subject: 'Social Science', marks: 87 },
      { subject: 'Hindi', marks: 86 },
      { subject: 'English', marks: 84 },
      { subject: 'Computer Science', marks: 82 },
      { subject: 'Science', marks: 80 },
      { subject: 'Mathematics', marks: 77 },
    ],
    aboveSectionMean: 5,
    rank: 4,
    previousRank: 7,
    gradeRank: 11,
    gradeRankOf: 132,
    gpa: 8.8,
    previousGpa: 8.6,
    cumulativeGpa: 8.4,
    cumulativeExams: 6,
    previousPct: 79.8,
    attendancePct: 100,
    submitted: true,
    publishedOn: '29 Jul 2026',
    statusNote: '29 Jul 2026',
    strengths: ['Essay writing', 'Comprehension', 'Civics'],
    improvements: ['Word problems', 'Numerical physics'],
    remarks: [
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'English',
        date: '28 Jul 2026',
        body: 'Strongest essay in the section. Moved up three places since the unit test.',
      },
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Mathematics',
        date: '27 Jul 2026',
        body: 'At 77 mathematics is the only paper below 80. Word problems cost the marks.',
      },
    ],
    awards: [
      { title: 'Best essay — junior category', detail: 'School literary week · Jun 2026' },
      { title: 'Most improved — Term 1', detail: 'Up 3 ranks and one grade band' },
    ],
    awardsNote: [{ title: 'Awards This Year', detail: '2' }],
    meetings: [
      { title: 'Term 1 result meeting', detail: '30 Jul 2026 · attended · Mrs. Priya Sharma' },
      { title: 'Mathematics support review', detail: '4 Jul 2026 · attended' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'English marks revised 82 to 84', detail: '26 Jul 2026 · recheck · Mrs. Sofia Alvarez' },
      { title: 'Result published to guardians', detail: '29 Jul 2026 · parent portal' },
    ],
  },

  {
    id: 'AD9893745-SOC',
    student: 'Kabir Nair',
    image: 'assets/img/students/student-04.jpg',
    admission: 'AD9893745',
    admitted: 'Admitted Jun 2021',
    roll: 'Roll 07',
    classTeacher: 'Mr. Arjun Kale',
    className: 'Class VII',
    section: 'B',
    sectionStrength: 41,
    scheme: 'Middle · 6 subjects',
    subject: 'Social Science',
    subjectKind: 'Core subject',
    subjects: [
      { subject: 'Computer Science', marks: 84 },
      { subject: 'Science', marks: 76 },
      { subject: 'Social Science', marks: 72 },
      { subject: 'Hindi', marks: 72 },
      { subject: 'English', marks: 71 },
      { subject: 'Mathematics', marks: 68 },
    ],
    aboveSectionMean: 2,
    rank: 12,
    previousRank: 15,
    gradeRank: 38,
    gradeRankOf: 124,
    gpa: 7.4,
    previousGpa: 7.0,
    cumulativeGpa: 7.1,
    cumulativeExams: 6,
    previousPct: 70.2,
    attendancePct: 89.6,
    submitted: true,
    reviewer: 'Mrs. Kalpana Menon',
    statusNote: 'Mrs. Kalpana Menon',
    strengths: ['Programming', 'Map work'],
    improvements: ['Long answers', 'Fractions', 'Punctuality'],
    remarks: [
      {
        author: 'Mr. Arjun Kale',
        role: 'Social Science',
        date: '28 Jul 2026',
        body: 'Map work is strong but the long answers stop short of the full mark scheme.',
      },
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Mathematics',
        date: '27 Jul 2026',
        body: '68 is the lowest of the six. Nine late arrivals cost him the first period.',
      },
    ],
    awards: [{ title: 'District athletics — second place', detail: '8 – 9 Jul 2026 · duty leave granted' }],
    awardsNote: [
      { title: 'Academic Awards', detail: 'None this year' },
      { title: 'Nominations', detail: 'Sports colours' },
    ],
    meetings: [
      { title: 'Punctuality discussion', detail: '28 Jul 2026 · attended · Mr. Suresh Nair' },
      { title: 'Open house', detail: '20 Jun 2026 · attended' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'Marks closed for all six subjects', detail: '24 Jul 2026 · Mrs. Kalpana Menon' },
      { title: 'Sent for coordinator review', detail: '29 Jul 2026 · Mr. Arjun Kale' },
    ],
  },

  {
    id: 'AD9892518-MAT',
    student: 'Rohan Verma',
    image: 'assets/img/students/student-02.jpg',
    admission: 'AD9892518',
    admitted: 'Admitted Jun 2020',
    roll: 'Roll 09',
    classTeacher: 'Mr. Arjun Kale',
    className: 'Class IX',
    section: 'C',
    sectionStrength: 42,
    scheme: 'Senior · 6 subjects',
    subject: 'Mathematics',
    subjectKind: 'Core subject',
    subjects: [
      { subject: 'Computer Science', marks: 68 },
      { subject: 'English', marks: 56 },
      { subject: 'Social Science', marks: 52 },
      { subject: 'Science', marks: 44 },
      { subject: 'Mathematics', marks: 41 },
      { subject: 'Hindi', marks: 28 },
    ],
    aboveSectionMean: 0,
    rank: 38,
    previousRank: 31,
    gradeRank: 118,
    gradeRankOf: 126,
    gpa: 4.2,
    previousGpa: 5.0,
    cumulativeGpa: 5.4,
    cumulativeExams: 6,
    previousPct: 54.6,
    attendancePct: 74.0,
    submitted: true,
    statusNote: 'Attendance below 75%',
    strengths: ['Practical computing'],
    improvements: ['Hindi grammar', 'Algebra', 'Numerical science', 'Attendance'],
    remarks: [
      {
        author: 'Mr. Arjun Kale',
        role: 'Class Teacher',
        date: '29 Jul 2026',
        body: 'Eighteen absences this term. The Hindi paper at 28 is below the pass mark.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '30 Jul 2026',
        body: 'Result withheld until the attendance shortfall is cleared. Remedial classes assigned.',
      },
    ],
    awards: [],
    awardsNote: [
      { title: 'No awards this year', detail: 'Not eligible while the result is withheld' },
      { title: 'Previous Year', detail: '1 · Sports' },
    ],
    meetings: [
      { title: 'Academic warning meeting', detail: '22 Jul 2026 · attended · Mrs. Sunita Verma' },
      { title: 'Counsellor referral', detail: '30 Jul 2026 · scheduled' },
    ],
    nextMeeting: '7 Aug 2026',
    audit: [
      { title: 'Result withheld', detail: '30 Jul 2026 · Mrs. Kalpana Menon' },
      { title: 'Remedial classes assigned', detail: '31 Jul 2026 · Hindi and Mathematics' },
    ],
  },

  {
    id: 'AD9892434-CS',
    student: 'Aaradhya Sharma',
    image: 'assets/img/students/student-06.jpg',
    admission: 'AD9892434',
    admitted: 'Admitted Jun 2019',
    roll: 'Roll 18',
    classTeacher: 'Mrs. Ellen Cruz',
    className: 'Class X',
    section: 'B',
    sectionStrength: 46,
    scheme: 'Science · 6 subjects',
    subject: 'Computer Science',
    subjectKind: 'Elective',
    subjects: [
      { subject: 'Mathematics', marks: 90 },
      { subject: 'Computer Science', marks: 88 },
      { subject: 'Science', marks: 87 },
      { subject: 'English', marks: 85 },
      { subject: 'Hindi', marks: 85 },
      { subject: 'Social Science', marks: 84 },
    ],
    aboveSectionMean: 6,
    rank: 3,
    previousRank: 3,
    gradeRank: 8,
    gradeRankOf: 138,
    gpa: 9.0,
    previousGpa: 8.8,
    cumulativeGpa: 8.7,
    cumulativeExams: 6,
    previousPct: 85.1,
    attendancePct: 96.9,
    submitted: true,
    publishedOn: '29 Jul 2026',
    statusNote: '29 Jul 2026',
    strengths: ['Consistency', 'Coordinate geometry', 'Lab record'],
    improvements: ['Database queries', 'Map-based history'],
    remarks: [
      {
        author: 'Mrs. Ellen Cruz',
        role: 'Class Teacher',
        date: '28 Jul 2026',
        body: 'The most consistent sheet in the section. Every paper landed in the A band.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Computer Science',
        date: '27 Jul 2026',
        body: 'Two marks short of the A+ band. The database question was the only gap.',
      },
    ],
    awards: [
      { title: 'Merit certificate', detail: 'GEN-2026-0461 · issued 27 Jul 2026' },
      { title: 'Coding club — runner up', detail: 'Inter-house contest · Jun 2026' },
    ],
    awardsNote: [{ title: 'Awards This Year', detail: '2' }],
    meetings: [
      { title: 'Term 1 result meeting', detail: '30 Jul 2026 · attended · Mr. Rakesh Sharma' },
      { title: 'Board exam briefing', detail: '18 Jul 2026 · attended' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'Marks closed for all six subjects', detail: '24 Jul 2026 · Mrs. Kalpana Menon' },
      { title: 'Result published to guardians', detail: '29 Jul 2026 · parent portal' },
    ],
  },

  {
    id: 'AD9893801-HIN',
    student: 'Ishaan Gupta',
    image: 'assets/img/students/student-09.jpg',
    admission: 'AD9893801',
    admitted: 'Admitted Jun 2020',
    roll: 'Roll 26',
    classTeacher: 'Mrs. Sofia Alvarez',
    className: 'Class IX',
    section: 'A',
    sectionStrength: 45,
    scheme: 'Senior · 6 subjects',
    subject: 'Hindi',
    subjectKind: 'Second language',
    subjects: [
      { subject: 'Science', marks: 74 },
      { subject: 'Mathematics', marks: 71 },
      { subject: 'Social Science', marks: 68 },
      { subject: 'Computer Science', marks: 65 },
      { subject: 'Hindi', marks: 63 },
      { subject: 'English', marks: 62 },
    ],
    aboveSectionMean: 1,
    rank: 24,
    previousRank: 21,
    gradeRank: 71,
    gradeRankOf: 126,
    gpa: 6.4,
    previousGpa: 6.6,
    cumulativeGpa: 6.5,
    cumulativeExams: 6,
    previousPct: 68.4,
    attendancePct: 92.7,
    submitted: true,
    recheckRequested: true,
    statusNote: 'Recheck requested',
    strengths: ['Biology', 'Diagram labelling'],
    improvements: ['Hindi composition', 'English grammar', 'Time management'],
    remarks: [
      {
        author: 'Mrs. Sofia Alvarez',
        role: 'Hindi',
        date: '29 Jul 2026',
        body: 'Recheck requested for the Hindi paper. Section C of the answer sheet was not totalled.',
      },
      {
        author: 'Mr. Vikram Sethi',
        role: 'Science',
        date: '27 Jul 2026',
        body: 'Science at 74 is the strongest paper. Worth pushing towards the A band next term.',
      },
    ],
    awards: [{ title: 'Science fair — participation', detail: 'School exhibition · May 2026' }],
    awardsNote: [
      { title: 'Awards This Year', detail: '1' },
      { title: 'Nominations', detail: 'None' },
    ],
    meetings: [
      { title: 'Term 1 result meeting', detail: '30 Jul 2026 · attended · Mr. Anil Gupta' },
      { title: 'Language support review', detail: '11 Jul 2026 · attended' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'Recheck requested for Hindi', detail: '29 Jul 2026 · Mrs. Sofia Alvarez' },
      { title: 'Publishing held pending recheck', detail: '30 Jul 2026 · Mrs. Kalpana Menon' },
    ],
  },

  {
    id: 'AD9893866-SCI',
    student: 'Diya Menon',
    image: 'assets/img/students/student-10.jpg',
    admission: 'AD9893866',
    admitted: 'Admitted Jun 2021',
    roll: 'Roll 11',
    classTeacher: 'Mr. Vikram Sethi',
    className: 'Class VII',
    section: 'A',
    sectionStrength: 40,
    scheme: 'Middle · 6 subjects',
    subject: 'Science',
    subjectKind: 'Core subject',
    subjects: [
      { subject: 'English', marks: 83 },
      { subject: 'Hindi', marks: 81 },
      { subject: 'Science', marks: 79 },
      { subject: 'Social Science', marks: 78 },
      { subject: 'Computer Science', marks: 76 },
      { subject: 'Mathematics', marks: 73 },
    ],
    aboveSectionMean: 5,
    rank: 7,
    previousRank: 11,
    gradeRank: 19,
    gradeRankOf: 124,
    gpa: 8.0,
    previousGpa: 7.6,
    cumulativeGpa: 7.5,
    cumulativeExams: 6,
    previousPct: 74.6,
    attendancePct: 97.9,
    submitted: false,
    statusNote: 'Not yet submitted',
    strengths: ['Reading comprehension', 'Consistency'],
    improvements: ['Geometry', 'Numerical reasoning'],
    remarks: [
      {
        author: 'Mr. Vikram Sethi',
        role: 'Science',
        date: '29 Jul 2026',
        body: 'Up four ranks. One more mark in science moves the whole sheet into the A band.',
      },
      {
        author: 'Mrs. Kalpana Menon',
        role: 'Academic Coordinator',
        date: '31 Jul 2026',
        body: 'Still a draft. Class teacher has to submit before the 3 Aug publishing window.',
      },
    ],
    awards: [{ title: 'Most improved — nominated', detail: 'Term 1 · pending coordinator approval' }],
    awardsNote: [
      { title: 'Awards This Year', detail: '1' },
      { title: 'Nominations', detail: '1 open' },
    ],
    meetings: [
      { title: 'Open house', detail: '20 Jun 2026 · attended · Mrs. Radha Menon' },
      { title: 'Term 1 result meeting', detail: 'Not scheduled · result still a draft' },
    ],
    nextMeeting: '14 Aug 2026',
    audit: [
      { title: 'Draft created from the mark sheet', detail: '28 Jul 2026 · Mr. Vikram Sethi' },
      { title: 'Submission reminder sent', detail: '31 Jul 2026 · due 3 Aug 2026' },
    ],
  },
];

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

export const gradeOf = (marks: number) =>
  GRADE_SCALE.find((step) => marks >= step.floor) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

export const gradeTint = (grade: string) => {
  if (grade === 'A+' || grade === 'A') return 'success';
  if (grade === 'B+' || grade === 'B') return 'info';
  if (grade === 'C+' || grade === 'C') return 'warning';
  return 'danger';
};

/** The paper this row grades, out of the student's whole sheet. */
export const paperOf = (row: GradeEntry) =>
  row.subjects.find((subject) => subject.subject === row.subject) ?? row.subjects[0];

export const marksOf = (row: GradeEntry) => paperOf(row).marks;

export const entryGradeOf = (row: GradeEntry) => gradeOf(marksOf(row));

export const levelOf = (row: GradeEntry): PerformanceLevel =>
  LEVEL_OF_GRADE[entryGradeOf(row).grade] ?? 'Needs Support';

export const levelPill: Record<PerformanceLevel, string> = {
  Outstanding: 'is-completed',
  'Very Good': 'is-active',
  Good: 'is-pending',
  Satisfactory: 'is-review',
  'Needs Support': 'is-blocked',
};

/** The student's percentage across the whole sheet. */
export const overallPctOf = (row: GradeEntry) =>
  round1(row.subjects.reduce((total, subject) => total + subject.marks, 0) / row.subjects.length);

export const overallGradeOf = (row: GradeEntry) => gradeOf(Math.round(overallPctOf(row)));

export const subjectsAtPassOf = (row: GradeEntry) =>
  row.subjects.filter((subject) => subject.marks >= PASS_MARK).length;

/** How the sheet's grades are spread, for the panel's breakdown list. */
export const breakdownOf = (row: GradeEntry) => {
  const counts = new Map<string, number>();
  row.subjects.forEach((subject) => {
    const grade = gradeOf(subject.marks).grade;
    counts.set(grade, (counts.get(grade) ?? 0) + 1);
  });
  return GRADE_SCALE.filter((step) => counts.has(step.grade)).map((step) => ({
    grade: step.grade,
    count: counts.get(step.grade) as number,
  }));
};

export const bestPaperOf = (row: GradeEntry) =>
  row.subjects.reduce((best, subject) => (subject.marks > best.marks ? subject : best));

export const weakestPaperOf = (row: GradeEntry) =>
  row.subjects.reduce((worst, subject) => (subject.marks < worst.marks ? subject : worst));

export const spreadLabelOf = (row: GradeEntry) =>
  `${weakestPaperOf(row).marks} to ${bestPaperOf(row).marks}`;

/* ---------------------------------- Status --------------------------------- */

/**
 * The result's own state.
 *
 * Attendance below the policy line withholds it whatever else is true; an
 * unsubmitted sheet is a draft; a submitted one waits on review until it is
 * published.
 */
export const statusOf = (row: GradeEntry): ResultStatus => {
  if (row.attendancePct < ATTENDANCE_POLICY) return 'Withheld';
  if (!row.submitted) return 'Draft';
  if (row.publishedOn) return 'Published';
  return 'Pending Review';
};

export const statusPill: Record<ResultStatus, string> = {
  Published: 'is-completed',
  'Pending Review': 'is-review',
  Draft: 'is-pending',
  Withheld: 'is-blocked',
};

/* ---------------------------- Rank and movement ---------------------------- */

export const rankMovementOf = (row: GradeEntry) => {
  const moved = row.previousRank - row.rank;
  if (moved === 0) return { label: `Held rank ${row.rank}`, tint: 'secondary', icon: 'ti ti-minus' };
  return moved > 0
    ? { label: `Up ${moved}`, tint: 'success', icon: 'ti ti-arrow-up' }
    : { label: `Down ${-moved}`, tint: 'danger', icon: 'ti ti-arrow-down' };
};

/**
 * Where the rank sits in the section, in the words the grid uses.
 *
 * First place is called out by name; the rest read against the section — the
 * top fifth is above the mean, the next sixth is at it, the rest below.
 */
export const rankNoteOf = (row: GradeEntry) => {
  if (row.rank === 1) return 'Top of the section';
  const share = (row.rank / row.sectionStrength) * 100;
  if (share <= 20) return 'Above section mean';
  if (share <= 35) return 'At section mean';
  return 'Below section mean';
};

export const growthOf = (row: GradeEntry) => round1(overallPctOf(row) - row.previousPct);

export const gpaChangeOf = (row: GradeEntry) => round1(row.gpa - row.previousGpa);

/** Whether this exam moved the student across a grade band. */
export const movedGradeOf = (row: GradeEntry) =>
  gradeOf(Math.round(overallPctOf(row))).grade !== gradeOf(Math.round(row.previousPct)).grade;

/* --------------------------------- Badging --------------------------------- */

export const isDistinction = (row: GradeEntry) => overallPctOf(row) >= DISTINCTION_AT;

export const isBelowPass = (row: GradeEntry) => marksOf(row) < PASS_MARK;

export const needsSupportOf = (row: GradeEntry) => levelOf(row) === 'Needs Support';

/** The badge the grid puts beside a student's name, where it puts one. */
export const nameBadgeOf = (row: GradeEntry) => {
  if (needsSupportOf(row)) return { label: 'Needs Support', tint: 'danger' };
  if (isDistinction(row)) return { label: 'Distinction', tint: 'success' };
  return null;
};

/* -------------------------------- The filters ------------------------------- */

export const classLabelOf = (row: GradeEntry) => `${row.className} ${row.section}`;

export const searchIndexOf = (row: GradeEntry) =>
  [row.student, row.admission, classLabelOf(row), row.subject, row.classTeacher, row.roll]
    .join(' ')
    .toLowerCase();

export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const examOptions = [
  'Term 1 Exam',
  'Unit Test 1',
  'Unit Test 2',
  'Half Yearly',
  'Term 2 Exam',
  'Annual Exam',
];
export const scaleOptions = ['A+ to E · 8 point', 'A to D · 5 point', 'GPA 10 point', 'Descriptive bands'];
export const gradeOptions = GRADE_SCALE.map((step) => step.grade);
export const classOptions = ['Class V', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];
export const sectionOptions = ['A', 'B', 'C', 'D'];
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
  'Mr. Vikram Sethi',
  'Mrs. Sofia Alvarez',
  'Mr. Arjun Kale',
  'Ms. Grace Otieno',
];
export const statusOptions: ResultStatus[] = ['Published', 'Pending Review', 'Draft', 'Withheld'];
export const levelOptions: PerformanceLevel[] = [
  'Outstanding',
  'Very Good',
  'Good',
  'Satisfactory',
  'Needs Support',
];
export const gpaBandOptions = ['9.0 and above', '8.0 – 9.0', '7.0 – 8.0', '6.0 – 7.0', 'Below 6.0'];

export const gpaBandOf = (row: GradeEntry) => {
  if (row.gpa >= 9) return '9.0 and above';
  if (row.gpa >= 8) return '8.0 – 9.0';
  if (row.gpa >= 7) return '7.0 – 8.0';
  if (row.gpa >= 6) return '6.0 – 7.0';
  return 'Below 6.0';
};
