/* ------------------------------- The register ------------------------------ */

export const REGISTER_TOTAL = 186;
export const ACADEMIC_YEAR = '2026-2027';
export const PERIOD = 'Term 1 · Apr – Jul 2026';
export const WORKING_DAYS = 112;

/** The timetable ceiling every workload is read against. */
export const MAX_PERIODS = 32;

/** What the development programme requires of every teacher each year. */
export const REQUIRED_HOURS = 30;
export const REQUIRED_MODULES = 5;

/** Where a score places a teacher on the appraisal scale. */
export const RATING_SCALE: { rating: Rating; floor: number }[] = [
  { rating: 'Outstanding', floor: 4.5 },
  { rating: 'Exceeds Expectations', floor: 4.3 },
  { rating: 'Meets Expectations', floor: 3.5 },
  { rating: 'Needs Improvement', floor: 2.0 },
  { rating: 'Unsatisfactory', floor: 0 },
];

/**
 * The grade a class average earns on the subject panel.
 *
 * Read off the twelve subject rows the template grades: 91.2 is A+, 86.4 an A,
 * 74.6 a C+, 68.4 a C and 65.4 a D+.
 */
export const CLASS_GRADE_SCALE: { grade: string; floor: number }[] = [
  { grade: 'A+', floor: 91 },
  { grade: 'A', floor: 81 },
  { grade: 'B+', floor: 80 },
  { grade: 'B', floor: 76 },
  { grade: 'C+', floor: 70 },
  { grade: 'C', floor: 66 },
  { grade: 'D+', floor: 60 },
  { grade: 'D', floor: 50 },
  { grade: 'E', floor: 0 },
];

/** How full a timetable has to be before it stops being balanced. */
export const WORKLOAD_BANDS: { index: WorkloadIndex; floor: number }[] = [
  { index: 'Overloaded', floor: 0.95 },
  { index: 'Heavy', floor: 0.9 },
  { index: 'Balanced', floor: 0.78 },
  { index: 'Light', floor: 0 },
];

/* --------------------------------- Shapes ---------------------------------- */

export type Rating =
  | 'Outstanding'
  | 'Exceeds Expectations'
  | 'Meets Expectations'
  | 'Needs Improvement'
  | 'Unsatisfactory';

export type EvaluationStatus = 'Completed' | 'In Review' | 'Pending' | 'Improvement Plan';

export type Employment = 'Permanent' | 'Contract' | 'Probation' | 'Visiting Faculty' | 'On Leave';

export type WorkloadIndex = 'Overloaded' | 'Heavy' | 'Balanced' | 'Light';

export interface SubjectClass {
  label: string;
  average: number;
}

export interface Observation {
  label: string;
  score: number;
  date: string;
  by: string;
}

export interface ListEntry {
  title: string;
  detail: string;
}

export interface EvaluationEntry {
  period: string;
  score: number | null;
  rating: string;
  studentAverage?: number;
  attendance?: number;
  reviewer?: string;
}

export interface ImprovementPlan {
  state: 'Active' | 'Development goals only' | 'No active plan';
  window?: string;
  goals: string[];
  mentor?: string;
  reviewPoints?: string;
  goalsMet: number;
  goalsTotal: number;
  openGoal?: string;
  target?: string;
}

export interface Teacher {
  id: string;
  name: string;
  image: string;
  designation: string;
  role: string;
  experience: number;
  experienceHere: number;
  qualification: string;
  employment: Employment;
  employmentNote?: string;
  reportsTo: string;
  /** The badge the grid puts beside the name, where the record carries one. */
  flag?: { label: string; tint: string };

  department: string;
  departmentRole: string;
  subject: string;
  classRange: string;
  classes: number;
  students: number;
  periods: number;
  classTeacherOf: string;
  extraDuties: string;

  subjectClasses: SubjectClass[];
  /** The teacher's own average across every class, not only those listed. */
  classAverage: number;
  passRate: number;
  above90: number;
  resultFacts: ListEntry[];

  /** The one stored attendance figure; days present and leave both derive. */
  attendancePct: number;
  lateArrivals: number;
  periodsMissed: number;
  periodsMissedNote: string;
  leaveNote: string;

  /** The appraisal score for the cycle, out of five. */
  score: number;
  observations: Observation[];
  observationCount: number;

  modulesCompleted: number;
  trainingHours: number;
  latestModule: ListEntry;

  awards: ListEntry[];
  awardFacts: ListEntry[];

  remarkBy: string;
  remarkRole: string;
  remarkDate: string;
  remark: string;
  remarkTags: string[];

  plan: ImprovementPlan;
  history: EvaluationEntry[];
  audit: ListEntry[];

  /** The appraisal's own state, which the status derives from. */
  reviewHeldOn?: string;
  signedOffOn?: string;
  signedOffBy?: string;
  reviewDueOn?: string;
  statusNote: string;
}

/* -------------------------------- The records ------------------------------ */

export const teachers: Teacher[] = [
  {
    id: 'TCH-2018-014',
    name: 'Dr. Anita Krishnan',
    image: 'assets/img/teachers/teacher-01.jpg',
    designation: 'Senior Teacher',
    role: 'Senior Teacher · PGT',
    experience: 14,
    experienceHere: 8,
    qualification: 'M.Sc, Ph.D Physics',
    employment: 'Permanent',
    reportsTo: 'Head of Science',
    department: 'Science',
    departmentRole: 'Lab in-charge',
    subject: 'Physics',
    classRange: 'Classes VIII – XI',
    classes: 6,
    students: 214,
    periods: 28,
    classTeacherOf: 'Class X · A',
    extraDuties: 'Physics lab, science club',
    subjectClasses: [
      { label: 'Physics · XI A', average: 86.4 },
      { label: 'Physics · X A', average: 91.2 },
      { label: 'Physics · X B', average: 89.4 },
      { label: 'Physics · IX A', average: 88.6 },
    ],
    classAverage: 88.4,
    passRate: 100,
    above90: 68,
    resultFacts: [
      { title: 'Board Result 2025-26', detail: '96.4% distinction' },
      { title: 'Year On Year', detail: 'Up 4.2 points' },
    ],
    attendancePct: 98.2,
    lateArrivals: 0,
    periodsMissed: 4,
    periodsMissedNote: 'all covered',
    leaveNote: 'casual',
    score: 4.8,
    observations: [
      { label: 'Class X A', score: 4.9, date: '2 Jul 2026', by: 'Principal' },
      { label: 'Class IX A', score: 4.7, date: '18 Jun 2026', by: 'Head of Science' },
    ],
    observationCount: 4,
    modulesCompleted: 5,
    trainingHours: 42,
    latestModule: { title: 'Inquiry based science teaching', detail: 'Completed 20 Jun 2026 · 16 hours' },
    awards: [
      { title: 'Teacher of the Year 2025-26', detail: 'School level · Mar 2026' },
      { title: 'Best Science Exhibit mentor', detail: 'District level · Jan 2026' },
    ],
    awardFacts: [
      { title: 'Awards', detail: '3' },
      { title: 'Publications', detail: '2' },
    ],
    remarkBy: 'Dr. S. Balakrishnan',
    remarkRole: 'Principal',
    remarkDate: '12 Jul 2026',
    remark:
      'Consistently the strongest science result in the senior school. Mentoring two probationary teachers from next term.',
    remarkTags: ['Recommended for promotion', 'Mentor'],
    plan: {
      state: 'No active plan',
      goals: [],
      goalsMet: 3,
      goalsTotal: 3,
      openGoal: 'Lead CBSE Physics workshop',
      target: 'Nov 2026',
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 4.8, rating: 'Outstanding', studentAverage: 88.4, attendance: 98.2, reviewer: 'Principal' },
      { period: 'Annual · 2025-26', score: 4.7, rating: 'Outstanding', studentAverage: 86.2, attendance: 97.4, reviewer: 'Principal' },
      { period: 'Annual · 2024-26', score: 4.5, rating: 'Outstanding', studentAverage: 84.6, attendance: 96.8, reviewer: 'Vice Principal' },
    ],
    audit: [
      { title: 'Evaluation signed off', detail: '12 Jul 2026 · Principal' },
      { title: 'Observation recorded', detail: '2 Jul 2026 · Principal' },
    ],
    reviewHeldOn: '12 Jul 2026',
    signedOffOn: '12 Jul 2026',
    signedOffBy: 'Dr. S. Balakrishnan',
    statusNote: 'Signed off',
  },

  {
    id: 'TCH-2016-007',
    name: 'Rakesh Sharma',
    image: 'assets/img/teachers/teacher-02.jpg',
    designation: 'Head of Mathematics',
    role: 'Head of Department',
    experience: 17,
    experienceHere: 10,
    qualification: 'M.Sc Mathematics, B.Ed',
    employment: 'Permanent',
    reportsTo: 'Vice Principal',
    department: 'Mathematics',
    departmentRole: 'Department head',
    subject: 'Mathematics',
    classRange: 'Classes IX – XII',
    classes: 7,
    students: 268,
    periods: 30,
    classTeacherOf: 'Class XII · A',
    extraDuties: 'Department head, timetable',
    subjectClasses: [
      { label: 'Maths · XII A', average: 88.2 },
      { label: 'Maths · XI A', average: 85.6 },
      { label: 'Maths · X A', average: 83.4 },
      { label: 'Maths · IX B', average: 79.2 },
    ],
    classAverage: 84.1,
    passRate: 98.9,
    above90: 74,
    resultFacts: [
      { title: 'Board Result 2025-26', detail: '94.1% distinction' },
      { title: 'Year On Year', detail: 'Up 2.6 points' },
    ],
    attendancePct: 96.8,
    lateArrivals: 1,
    periodsMissed: 9,
    periodsMissedNote: 'all covered',
    leaveNote: '2 casual, 2 duty',
    score: 4.6,
    observations: [
      { label: 'Class XII A', score: 4.8, date: '30 Jun 2026', by: 'Principal' },
      { label: 'Class IX B', score: 4.2, date: '14 Jun 2026', by: 'Vice Principal' },
    ],
    observationCount: 3,
    modulesCompleted: 4,
    trainingHours: 34,
    latestModule: { title: 'Leading an academic department', detail: 'Completed 12 Jun 2026 · 12 hours' },
    awards: [
      { title: 'Best Board Result mentor', detail: 'School level · May 2026' },
      { title: 'State Maths Olympiad coach', detail: 'State level · Dec 2025' },
    ],
    awardFacts: [
      { title: 'Awards', detail: '4' },
      { title: 'Recognition', detail: 'Olympiad coach' },
    ],
    remarkBy: 'Dr. S. Balakrishnan',
    remarkRole: 'Principal',
    remarkDate: '10 Jul 2026',
    remark:
      'Excellent senior school results. Workload is heavy at 30 periods; two Class IX sections move to a new hire next term.',
    remarkTags: ['Workload review', 'Department head'],
    plan: {
      state: 'Development goals only',
      goals: [],
      goalsMet: 2,
      goalsTotal: 3,
      openGoal: 'Lift Class IX B to 84%',
      target: 'Term 2 · Nov 2026',
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 4.6, rating: 'Outstanding', studentAverage: 84.1, attendance: 96.8, reviewer: 'Principal' },
      { period: 'Annual · 2025-26', score: 4.5, rating: 'Outstanding', studentAverage: 82.4, attendance: 96.2, reviewer: 'Principal' },
      { period: 'Annual · 2024-26', score: 4.3, rating: 'Exceeds', studentAverage: 81.1, attendance: 95.8, reviewer: 'Vice Principal' },
    ],
    audit: [
      { title: 'Evaluation signed off', detail: '10 Jul 2026 · Principal' },
      { title: 'Workload flagged for review', detail: '10 Jul 2026 · Vice Principal' },
    ],
    reviewHeldOn: '10 Jul 2026',
    signedOffOn: '10 Jul 2026',
    signedOffBy: 'Dr. S. Balakrishnan',
    statusNote: 'Signed off',
  },

  {
    id: 'TCH-2020-041',
    name: 'Meera Joshi',
    image: 'assets/img/teachers/teacher-03.jpg',
    designation: 'Teacher · TGT',
    role: 'Teacher · TGT',
    experience: 9,
    experienceHere: 6,
    qualification: 'M.A English, B.Ed',
    employment: 'Permanent',
    reportsTo: 'Head of Languages',
    department: 'Languages',
    departmentRole: 'Literary club',
    subject: 'English',
    classRange: 'Classes VII – X',
    classes: 6,
    students: 232,
    periods: 26,
    classTeacherOf: 'Class VIII · B',
    extraDuties: 'Literary club, magazine',
    subjectClasses: [
      { label: 'English · X B', average: 82.4 },
      { label: 'English · IX A', average: 80.8 },
      { label: 'English · VIII B', average: 78.6 },
      { label: 'English · VII A', average: 76.4 },
    ],
    classAverage: 79.6,
    passRate: 97.4,
    above90: 28,
    resultFacts: [
      { title: 'Writing Skill Index', detail: '74.2%' },
      { title: 'Year On Year', detail: 'Up 1.8 points' },
    ],
    attendancePct: 95.4,
    lateArrivals: 2,
    periodsMissed: 11,
    periodsMissedNote: 'all covered',
    leaveNote: '3 casual, 2 medical',
    score: 4.1,
    observations: [
      { label: 'Class X B', score: 4.3, date: '26 Jun 2026', by: 'Head of Languages' },
      { label: 'Class VII A', score: 3.9, date: '10 Jun 2026', by: 'Vice Principal' },
    ],
    observationCount: 3,
    modulesCompleted: 4,
    trainingHours: 31,
    latestModule: { title: 'Teaching creative writing', detail: 'Completed 28 May 2026 · 10 hours' },
    awards: [{ title: 'Inter-school debate coach', detail: 'Zonal winners · Feb 2026' }],
    awardFacts: [
      { title: 'Awards', detail: '1' },
      { title: 'Recognition', detail: 'School magazine editor' },
    ],
    remarkBy: 'Mrs. Leela Nambiar',
    remarkRole: 'Vice Principal',
    remarkDate: '8 Jul 2026',
    remark:
      'Steady classroom practice and strong co-curricular contribution. Middle school scores would benefit from more structured reading work.',
    remarkTags: ['On track', 'Club lead'],
    plan: {
      state: 'Development goals only',
      goals: [],
      goalsMet: 2,
      goalsTotal: 3,
      openGoal: 'Guided reading in VII A',
      target: 'Term 2 · Nov 2026',
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 4.1, rating: 'Meets', studentAverage: 79.6, attendance: 95.4, reviewer: 'Vice Principal' },
      { period: 'Annual · 2025-26', score: 4.0, rating: 'Meets', studentAverage: 77.8, attendance: 95.1, reviewer: 'Vice Principal' },
      { period: 'Annual · 2024-26', score: 3.8, rating: 'Meets', studentAverage: 76.4, attendance: 94.6, reviewer: 'Head of Languages' },
    ],
    audit: [
      { title: 'Evaluation signed off', detail: '8 Jul 2026 · Vice Principal' },
      { title: 'Training module logged', detail: '28 May 2026 · HR' },
    ],
    reviewHeldOn: '8 Jul 2026',
    signedOffOn: '8 Jul 2026',
    signedOffBy: 'Mrs. Leela Nambiar',
    statusNote: 'Signed off',
  },

  {
    id: 'TCH-2021-058',
    name: 'Vikram Patel',
    image: 'assets/img/teachers/teacher-04.jpg',
    designation: 'Teacher · TGT',
    role: 'Teacher · TGT',
    experience: 5,
    experienceHere: 5,
    qualification: 'M.A History, B.Ed',
    employment: 'Contract',
    employmentNote: 'Contract to Mar 2027',
    reportsTo: 'Head of Social Science',
    flag: { label: 'Review action open', tint: 'warning' },
    department: 'Social Science',
    departmentRole: 'Field trips',
    subject: 'History & Civics',
    classRange: 'Classes VI – IX',
    classes: 5,
    students: 186,
    periods: 22,
    classTeacherOf: 'Not assigned',
    extraDuties: 'Field trip coordination',
    subjectClasses: [
      { label: 'History · IX A', average: 74.6 },
      { label: 'History · VIII A', average: 72.8 },
      { label: 'Civics · VII B', average: 68.4 },
      { label: 'History · VI A', average: 69.2 },
    ],
    classAverage: 71.2,
    passRate: 91.4,
    above90: 9,
    resultFacts: [
      { title: 'Below Pass Mark', detail: '16 students' },
      { title: 'Year On Year', detail: 'Down 3.4 points' },
    ],
    attendancePct: 91.2,
    lateArrivals: 7,
    periodsMissed: 22,
    periodsMissedNote: '6 uncovered',
    leaveNote: '6 unplanned',
    score: 2.9,
    observations: [
      { label: 'Class VII B', score: 2.6, date: '28 Jun 2026', by: 'lesson pacing weak' },
      { label: 'Class IX A', score: 3.2, date: '12 Jun 2026', by: 'low student response' },
    ],
    observationCount: 4,
    modulesCompleted: 2,
    trainingHours: 14,
    latestModule: { title: 'Classroom management', detail: 'In progress · due 30 Sep 2026' },
    awards: [],
    awardFacts: [
      { title: 'Awards', detail: 'None' },
      { title: 'Recognition', detail: 'Field trip organiser' },
    ],
    remarkBy: 'Dr. S. Balakrishnan',
    remarkRole: 'Principal',
    remarkDate: '14 Jul 2026',
    remark:
      'Scores have slipped for a second term and unplanned leave is high. A formal improvement plan runs to November before the contract is reviewed.',
    remarkTags: ['Improvement plan active', 'Contract review'],
    plan: {
      state: 'Active',
      window: 'Jul to Nov 2026',
      goals: ['Class average to 78%', 'Observation score to 3.8', 'Complete 3 training modules'],
      mentor: 'Dr. Anita Krishnan',
      goalsMet: 0,
      goalsTotal: 3,
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 2.9, rating: 'Needs work', studentAverage: 71.2, attendance: 91.2, reviewer: 'Principal' },
      { period: 'Annual · 2025-26', score: 3.2, rating: 'Below par', studentAverage: 74.6, attendance: 93.1, reviewer: 'Vice Principal' },
      { period: 'Annual · 2024-26', score: 3.6, rating: 'Meets', studentAverage: 76.2, attendance: 94.4, reviewer: 'Vice Principal' },
    ],
    audit: [
      { title: 'Improvement plan opened', detail: '14 Jul 2026 · Principal' },
      { title: 'Observation flagged', detail: '28 Jun 2026 · Vice Principal' },
    ],
    reviewHeldOn: '14 Jul 2026',
    statusNote: 'Awaiting sign off',
  },

  {
    id: 'TCH-2015-003',
    name: 'Sunita Reddy',
    image: 'assets/img/teachers/teacher-05.jpg',
    designation: 'Head of Science',
    role: 'Head of Department',
    experience: 19,
    experienceHere: 11,
    qualification: 'M.Sc Chemistry, M.Ed',
    employment: 'Permanent',
    reportsTo: 'Principal',
    department: 'Science',
    departmentRole: 'Department head',
    subject: 'Chemistry',
    classRange: 'Classes IX – XII',
    classes: 6,
    students: 224,
    periods: 27,
    classTeacherOf: 'Class XI · B',
    extraDuties: 'Department head, exam cell',
    subjectClasses: [
      { label: 'Chemistry · XII B', average: 89.6 },
      { label: 'Chemistry · XI B', average: 87.2 },
      { label: 'Chemistry · X A', average: 86.4 },
      { label: 'Chemistry · IX A', average: 84.2 },
    ],
    classAverage: 86.8,
    passRate: 100,
    above90: 61,
    resultFacts: [
      { title: 'Board Result 2025-26', detail: '95.2% distinction' },
      { title: 'Year On Year', detail: 'Up 1.4 points' },
    ],
    attendancePct: 97.6,
    lateArrivals: 0,
    periodsMissed: 7,
    periodsMissedNote: 'all covered',
    leaveNote: 'all planned',
    score: 4.7,
    observations: [
      { label: 'Class XII B', score: 4.9, date: '4 Jul 2026', by: 'Principal' },
      { label: 'Lab session', score: 4.6, date: '20 Jun 2026', by: 'Vice Principal' },
    ],
    observationCount: 4,
    modulesCompleted: 5,
    trainingHours: 38,
    latestModule: { title: 'Lab safety and assessment design', detail: 'Completed 6 Jun 2026 · 14 hours' },
    awards: [
      { title: 'Best Department 2025-26', detail: 'School level · Apr 2026' },
      { title: 'CBSE resource person', detail: 'National panel · 2024 onward' },
    ],
    awardFacts: [
      { title: 'Awards', detail: '5' },
      { title: 'Recognition', detail: 'Resource person' },
    ],
    remarkBy: 'Dr. S. Balakrishnan',
    remarkRole: 'Principal',
    remarkDate: '9 Jul 2026',
    remark:
      'Runs the strongest department in the school. Asked to lead the peer observation programme across all departments from Term 2.',
    remarkTags: ['Leadership track', 'Department head'],
    plan: {
      state: 'No active plan',
      goals: [],
      goalsMet: 3,
      goalsTotal: 3,
      openGoal: 'Run peer observation cycle',
      target: 'Dec 2026',
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 4.7, rating: 'Outstanding', studentAverage: 86.8, attendance: 97.6, reviewer: 'Principal' },
      { period: 'Annual · 2025-26', score: 4.6, rating: 'Outstanding', studentAverage: 85.4, attendance: 97.2, reviewer: 'Principal' },
      { period: 'Annual · 2024-26', score: 4.6, rating: 'Outstanding', studentAverage: 84.8, attendance: 96.9, reviewer: 'Principal' },
    ],
    audit: [
      { title: 'Evaluation signed off', detail: '9 Jul 2026 · Principal' },
      { title: 'Assigned peer observation lead', detail: '9 Jul 2026 · Principal' },
    ],
    reviewHeldOn: '9 Jul 2026',
    signedOffOn: '9 Jul 2026',
    signedOffBy: 'Dr. S. Balakrishnan',
    statusNote: 'Signed off',
  },

  {
    id: 'TCH-2022-076',
    name: 'Arjun Nair',
    image: 'assets/img/teachers/teacher-06.jpg',
    designation: 'Teacher · PGT',
    role: 'Teacher · PGT',
    experience: 6,
    experienceHere: 4,
    qualification: 'M.C.A, B.Ed',
    employment: 'Permanent',
    reportsTo: 'Vice Principal',
    department: 'Computer Science',
    departmentRole: 'Robotics club',
    subject: 'Computer Science',
    classRange: 'Classes VI – XII',
    classes: 8,
    students: 296,
    periods: 31,
    classTeacherOf: 'Class IX · C',
    extraDuties: 'Robotics club, IT support',
    subjectClasses: [
      { label: 'Comp Sci · XII A', average: 86.2 },
      { label: 'Comp Sci · XI A', average: 84.6 },
      { label: 'Comp Sci · IX C', average: 80.8 },
      { label: 'Comp Sci · VI A', average: 78.4 },
    ],
    classAverage: 82.4,
    passRate: 99.3,
    above90: 58,
    resultFacts: [
      { title: 'Project Submission', detail: '98.6% on time' },
      { title: 'Year On Year', detail: 'Up 2.2 points' },
    ],
    attendancePct: 94.1,
    lateArrivals: 3,
    periodsMissed: 18,
    periodsMissedNote: '4 uncovered',
    leaveNote: '5 medical',
    score: 4.0,
    observations: [
      { label: 'Class XI A', score: 4.4, date: '24 Jun 2026', by: 'Vice Principal' },
      { label: 'Class VI A', score: 3.7, date: '8 Jun 2026', by: 'Head of Department' },
    ],
    observationCount: 2,
    modulesCompleted: 5,
    trainingHours: 46,
    latestModule: { title: 'AI and robotics in the classroom', detail: 'Completed 2 Jul 2026 · 20 hours' },
    awards: [{ title: 'State Robotics Challenge', detail: 'Runners up mentor · Mar 2026' }],
    awardFacts: [
      { title: 'Awards', detail: '2' },
      { title: 'Recognition', detail: 'Robotics club lead' },
    ],
    remarkBy: 'Mrs. Leela Nambiar',
    remarkRole: 'Vice Principal',
    remarkDate: '28 Mar 2026',
    remark:
      'Strong senior school teaching and excellent club work. Carrying 8 classes across seven grades; Term 1 evaluation is still to be scheduled.',
    remarkTags: ['Evaluation pending', 'Workload high'],
    plan: {
      state: 'Development goals only',
      goals: [],
      goalsMet: 2,
      goalsTotal: 3,
      openGoal: 'Middle school pacing plan',
      target: 'Term 2 · Nov 2026',
    },
    history: [
      { period: 'Term 1 · 2026-27', score: null, rating: 'Pending', reviewer: 'Due 5 Aug' },
      { period: 'Annual · 2025-26', score: 4.0, rating: 'Meets', studentAverage: 80.2, attendance: 94.8, reviewer: 'Vice Principal' },
      { period: 'Annual · 2024-26', score: 3.9, rating: 'Meets', studentAverage: 78.6, attendance: 94.2, reviewer: 'Head of Department' },
    ],
    audit: [
      { title: 'Term 1 review scheduled', detail: '5 Aug 2026 · Vice Principal' },
      { title: 'Training module logged', detail: '2 Jul 2026 · HR' },
    ],
    reviewDueOn: '5 Aug 2026',
    statusNote: 'Due 5 Aug 2026',
  },

  {
    id: 'TCH-2023-092',
    name: 'Kavita Menon',
    image: 'assets/img/teachers/teacher-07.jpg',
    designation: 'Teacher · TGT',
    role: 'Teacher · TGT',
    experience: 2,
    experienceHere: 2,
    qualification: 'B.Sc, B.Ed',
    employment: 'Probation',
    employmentNote: 'Probation to Mar 2027',
    reportsTo: 'Rakesh Sharma',
    flag: { label: 'Probation', tint: 'danger' },
    department: 'Mathematics',
    departmentRole: 'Remedial classes',
    subject: 'Mathematics',
    classRange: 'Classes VI – VIII',
    classes: 5,
    students: 178,
    periods: 24,
    classTeacherOf: 'Not assigned',
    extraDuties: 'Remedial maths',
    subjectClasses: [
      { label: 'Maths · VIII C', average: 71.6 },
      { label: 'Maths · VII C', average: 68.2 },
      { label: 'Maths · VI B', average: 66.8 },
      { label: 'Maths · VI C', average: 65.4 },
    ],
    classAverage: 68.4,
    passRate: 88.2,
    above90: 6,
    resultFacts: [
      { title: 'Below Pass Mark', detail: '21 students' },
      { title: 'Department Average', detail: '80.2% · 11.8 behind' },
    ],
    attendancePct: 88.6,
    lateArrivals: 11,
    periodsMissed: 31,
    periodsMissedNote: '12 uncovered',
    leaveNote: '9 unplanned',
    score: 2.6,
    observations: [
      { label: 'Class VI C', score: 2.3, date: '6 Jul 2026', by: 'weak concept delivery' },
      { label: 'Class VII C', score: 2.8, date: '16 Jun 2026', by: 'class control' },
    ],
    observationCount: 5,
    modulesCompleted: 1,
    trainingHours: 8,
    latestModule: { title: 'Foundation teaching skills', detail: 'In progress · due 31 Oct 2026' },
    awards: [],
    awardFacts: [
      { title: 'Awards', detail: 'None' },
      { title: 'Recognition', detail: 'Remedial support' },
    ],
    remarkBy: 'Dr. S. Balakrishnan',
    remarkRole: 'Principal',
    remarkDate: '16 Jul 2026',
    remark:
      'Probation extended by two terms. Weekly mentoring with the Head of Mathematics starts in August; confirmation depends on the March 2027 review.',
    remarkTags: ['Probation extended', 'Weekly mentoring'],
    plan: {
      state: 'Active',
      window: 'Jul 2026 to Mar 2027',
      goals: ['Class average to 76%', 'Observation score to 3.5', 'Attendance above 95%'],
      mentor: 'Rakesh Sharma',
      reviewPoints: 'Nov 2026, Mar 2027',
      goalsMet: 0,
      goalsTotal: 3,
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 2.6, rating: 'Needs work', studentAverage: 68.4, attendance: 88.6, reviewer: 'Principal' },
      { period: 'Annual · 2025-26', score: 2.8, rating: 'Needs work', studentAverage: 69.8, attendance: 90.2, reviewer: 'Principal' },
      { period: 'Induction · 2024-26', score: 3.0, rating: 'Below par', studentAverage: 71.4, attendance: 92.6, reviewer: 'Head of Department' },
    ],
    audit: [
      { title: 'Probation extended', detail: '16 Jul 2026 · Principal' },
      { title: 'Mentor assigned', detail: '16 Jul 2026 · Head of Mathematics' },
    ],
    reviewHeldOn: '16 Jul 2026',
    statusNote: 'Probation extended',
  },

  {
    id: 'TCH-2014-002',
    name: 'Prakash Iyer',
    image: 'assets/img/teachers/teacher-08.jpg',
    designation: 'Senior Teacher',
    role: 'Senior Teacher · TGT',
    experience: 21,
    experienceHere: 12,
    qualification: 'M.A Hindi, Sanskrit Acharya',
    employment: 'Permanent',
    reportsTo: 'Head of Languages',
    department: 'Languages',
    departmentRole: 'Cultural committee',
    subject: 'Hindi & Sanskrit',
    classRange: 'Classes VI – X',
    classes: 6,
    students: 208,
    periods: 25,
    classTeacherOf: 'Class VII · A',
    extraDuties: 'Cultural committee',
    subjectClasses: [
      { label: 'Sanskrit · X A', average: 86.4 },
      { label: 'Hindi · X A', average: 83.2 },
      { label: 'Hindi · VIII A', average: 79.8 },
      { label: 'Hindi · VI B', average: 77.4 },
    ],
    classAverage: 81.2,
    passRate: 99.0,
    above90: 34,
    resultFacts: [
      { title: 'Board Result 2025-26', detail: '92.8% distinction' },
      { title: 'Year On Year', detail: 'Steady' },
    ],
    attendancePct: 96.2,
    lateArrivals: 1,
    periodsMissed: 9,
    periodsMissedNote: 'all covered',
    leaveNote: 'all planned',
    score: 4.2,
    observations: [
      { label: 'Class X A', score: 4.5, date: '22 Jun 2026', by: 'Head of Languages' },
      { label: 'Class VI B', score: 3.9, date: '4 Jun 2026', by: 'Vice Principal' },
    ],
    observationCount: 3,
    modulesCompleted: 5,
    trainingHours: 33,
    latestModule: { title: 'Digital tools for language teaching', detail: 'Completed 14 Jun 2026 · 12 hours' },
    awards: [
      { title: 'Long Service Award · 20 years', detail: 'School level · Sep 2025' },
      { title: 'Annual day production lead', detail: 'School level · Nov 2025' },
    ],
    awardFacts: [
      { title: 'Awards', detail: '3' },
      { title: 'Recognition', detail: 'Cultural lead' },
    ],
    remarkBy: 'Mrs. Leela Nambiar',
    remarkRole: 'Vice Principal',
    remarkDate: '6 Jul 2026',
    remark:
      'Dependable results year after year and the anchor of the cultural calendar. Encouraged to bring the new digital tools into the middle school classes.',
    remarkTags: ['On track', 'Long service'],
    plan: {
      state: 'No active plan',
      goals: [],
      goalsMet: 3,
      goalsTotal: 3,
      openGoal: 'Digital content for Classes VI – VIII',
      target: 'Jan 2027',
    },
    history: [
      { period: 'Term 1 · 2026-27', score: 4.2, rating: 'Meets', studentAverage: 81.2, attendance: 96.2, reviewer: 'Vice Principal' },
      { period: 'Annual · 2025-26', score: 4.2, rating: 'Meets', studentAverage: 80.8, attendance: 96.4, reviewer: 'Vice Principal' },
      { period: 'Annual · 2024-26', score: 4.1, rating: 'Meets', studentAverage: 80.2, attendance: 95.8, reviewer: 'Head of Languages' },
    ],
    audit: [
      { title: 'Evaluation signed off', detail: '6 Jul 2026 · Vice Principal' },
      { title: 'Training module logged', detail: '14 Jun 2026 · HR' },
    ],
    reviewHeldOn: '6 Jul 2026',
    signedOffOn: '6 Jul 2026',
    signedOffBy: 'Mrs. Leela Nambiar',
    statusNote: 'Signed off',
  },
];

/* ------------------------------- Derivations ------------------------------- */

const round1 = (value: number) => Math.round(value * 10) / 10;

/* --------------------------------- Attendance ------------------------------ */

/** Days present in the cycle, from the one stored rate. */
export const presentOf = (row: Teacher) => Math.round((WORKING_DAYS * row.attendancePct) / 100);

/** Days taken as leave — the rest of the cycle. */
export const leaveTakenOf = (row: Teacher) => WORKING_DAYS - presentOf(row);

/* --------------------------------- Workload -------------------------------- */

export const workloadIndexOf = (row: Teacher): WorkloadIndex => {
  const share = row.periods / MAX_PERIODS;
  return (WORKLOAD_BANDS.find((band) => share >= band.floor) ?? WORKLOAD_BANDS[3]).index;
};

export const workloadTint: Record<WorkloadIndex, string> = {
  Overloaded: 'danger',
  Heavy: 'warning',
  Balanced: 'success',
  Light: 'info',
};

/* ----------------------------- Classes and results ------------------------- */

export const classGradeOf = (average: number) =>
  (CLASS_GRADE_SCALE.find((step) => average >= step.floor) ?? CLASS_GRADE_SCALE[CLASS_GRADE_SCALE.length - 1])
    .grade;

export const gradeTint = (grade: string) => {
  if (grade.startsWith('A')) return 'success';
  if (grade.startsWith('B')) return 'info';
  if (grade.startsWith('C')) return 'warning';
  return 'danger';
};

export const strongestClassOf = (row: Teacher) =>
  row.subjectClasses.reduce((best, item) => (item.average > best.average ? item : best));

export const weakestClassOf = (row: Teacher) =>
  row.subjectClasses.reduce((worst, item) => (item.average < worst.average ? item : worst));

export const spreadOf = (row: Teacher) =>
  round1(strongestClassOf(row).average - weakestClassOf(row).average);

/** Whether the panel calls out the best class or the weakest one. */
export const classCalloutOf = (row: Teacher) =>
  row.classAverage >= 80
    ? { label: 'Strongest Class', item: strongestClassOf(row) }
    : { label: 'Weakest Class', item: weakestClassOf(row) };

/* ------------------------------ Rating and status -------------------------- */

export const ratingOf = (row: Teacher): Rating =>
  (RATING_SCALE.find((step) => row.score >= step.floor) ?? RATING_SCALE[RATING_SCALE.length - 1]).rating;

export const ratingPill: Record<Rating, string> = {
  Outstanding: 'is-completed',
  'Exceeds Expectations': 'is-active',
  'Meets Expectations': 'is-pending',
  'Needs Improvement': 'is-review',
  Unsatisfactory: 'is-blocked',
};

export const ratingTint: Record<Rating, string> = {
  Outstanding: 'success',
  'Exceeds Expectations': 'info',
  'Meets Expectations': 'primary',
  'Needs Improvement': 'warning',
  Unsatisfactory: 'danger',
};

/**
 * The appraisal's own state.
 *
 * An open improvement plan overrides everything; without one, a review that has
 * not been held is Pending, one held without a sign-off is In Review, and a
 * signed-off review is Completed.
 */
export const statusOf = (row: Teacher): EvaluationStatus => {
  if (row.plan.state === 'Active') return 'Improvement Plan';
  if (!row.reviewHeldOn) return 'Pending';
  return row.signedOffOn ? 'Completed' : 'In Review';
};

export const statusPill: Record<EvaluationStatus, string> = {
  Completed: 'is-completed',
  'In Review': 'is-review',
  Pending: 'is-pending',
  'Improvement Plan': 'is-blocked',
};

/* ------------------------------- Development ------------------------------- */

/**
 * Where the teacher stands against the year's training requirement.
 *
 * Every module done and the hours cleared is full compliance; a module or two
 * in with the hours still short is behind; barely started is the mandatory-due
 * state the probation records carry.
 */
export const trainingStatusOf = (row: Teacher) => {
  if (row.modulesCompleted >= REQUIRED_MODULES && row.trainingHours >= REQUIRED_HOURS)
    return 'Fully compliant';
  if (row.trainingHours >= REQUIRED_HOURS) return `${REQUIRED_MODULES - row.modulesCompleted} module pending`;
  if (row.modulesCompleted >= 2) return 'Behind requirement';
  return 'Mandatory training due';
};

export const trainingTint = (row: Teacher) => {
  const status = trainingStatusOf(row);
  if (status === 'Fully compliant') return 'success';
  if (status === 'Mandatory training due') return 'danger';
  return 'warning';
};

export const observationAverageOf = (row: Teacher) =>
  row.observations.length === 0
    ? null
    : round1(row.observations.reduce((total, item) => total + item.score, 0) / row.observations.length);

/** How the career average reads on the history dialog. */
export const careerAverageOf = (row: Teacher) => {
  const scored = row.history.filter((entry) => entry.score !== null);
  return scored.length === 0
    ? null
    : Math.round((scored.reduce((total, entry) => total + (entry.score as number), 0) / scored.length) * 100) /
        100;
};

/* -------------------------------- The filters ------------------------------- */

export const searchIndexOf = (row: Teacher) =>
  [row.name, row.id, row.department, row.subject, row.designation, row.classRange]
    .join(' ')
    .toLowerCase();

export const departmentOptions = [
  'Science',
  'Mathematics',
  'Languages',
  'Social Science',
  'Computer Science',
  'Commerce',
  'Arts & Music',
  'Physical Education',
];
export const subjectOptions = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'English',
  'Hindi & Sanskrit',
  'History & Civics',
  'Computer Science',
];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];
export const periodOptions = [
  'Term 1 · Apr – Jul 2026',
  'Term 2 · Aug – Nov 2026',
  'Half yearly · 2026-2027',
  'Annual · 2025-2026',
];
export const ratingOptions: Rating[] = [
  'Outstanding',
  'Exceeds Expectations',
  'Meets Expectations',
  'Needs Improvement',
  'Unsatisfactory',
];
export const employmentOptions: Employment[] = [
  'Permanent',
  'Contract',
  'Probation',
  'Visiting Faculty',
  'On Leave',
];
export const statusOptions: EvaluationStatus[] = ['Completed', 'In Review', 'Pending', 'Improvement Plan'];
export const reviewerOptions = [
  'Dr. S. Balakrishnan · Principal',
  'Mrs. Leela Nambiar · Vice Principal',
  'Department heads',
];
export const attendanceBelowOptions = ['95%', '90%', '85%', '80%'];
export const classesOptions = ['Up to 4 classes', '5 – 6 classes', '7 classes or more'];
export const experienceOptions = ['Under 2 years', '2 – 5 years', '6 – 10 years', 'Over 10 years'];
export const developmentOptions = ['All modules completed', 'In progress', 'Not started'];

export const classesBandOf = (row: Teacher) => {
  if (row.classes <= 4) return 'Up to 4 classes';
  if (row.classes <= 6) return '5 – 6 classes';
  return '7 classes or more';
};

export const experienceBandOf = (row: Teacher) => {
  if (row.experience < 2) return 'Under 2 years';
  if (row.experience <= 5) return '2 – 5 years';
  if (row.experience <= 10) return '6 – 10 years';
  return 'Over 10 years';
};

export const developmentBandOf = (row: Teacher) => {
  if (row.modulesCompleted >= REQUIRED_MODULES) return 'All modules completed';
  return row.modulesCompleted > 0 ? 'In progress' : 'Not started';
};

/** A teacher carrying something the reviewer still has to close. */
export const hasOpenActionOf = (row: Teacher) =>
  row.plan.state === 'Active' || statusOf(row) !== 'Completed';

/** Who signed the review off, for the Evaluated By filter. */
export const reviewerOf = (row: Teacher) => {
  if (!row.signedOffBy) return '';
  return reviewerOptions.find((option) => option.startsWith(row.signedOffBy as string)) ?? '';
};
