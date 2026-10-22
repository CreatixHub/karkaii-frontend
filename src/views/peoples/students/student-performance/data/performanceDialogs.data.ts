import type { DetailStat } from './studentPerformance.data';

export interface StatTile {
  id: string;
  tint: string;
  icon: string;
  label: string;
  value: string;
}

export interface ViewSubjectRow {
  subject: string;
  marks: string;
  max: string;
  grade: string;
  gradeBadge: string;
  percentage: string;
  total?: boolean;
}

export interface ViewRemarkRow {
  date: string;
  teacher: string;
  subject: string;
}

/* ------------------------------ View Performance ------------------------------ */

export const viewHeader = {
  name: 'Ananya Rao',
  meta: 'AD9887402  •  Class X B  •  Term 1 Exam  •  2026-2027',
  roll: 'Roll 14 · Mrs. Ellen Cruz',
  evaluated: 'Evaluated 27 Jul 2026 · report ACR-2026-0341',
  level: 'Excellent',
};

export const viewTiles: StatTile[] = [
  { id: 'score', tint: 'bg-info-transparent text-info', icon: 'ti ti-percentage', label: 'Overall Score', value: '91.7%' },
  { id: 'grade', tint: 'bg-success-transparent text-success', icon: 'ti ti-badge', label: 'Grade', value: 'A+ · Outstanding' },
  { id: 'rank', tint: 'bg-purple-transparent text-purple', icon: 'ti ti-medal', label: 'Class Rank', value: '1 of 46' },
  {
    id: 'attendance',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-calendar-event',
    label: 'Attendance',
    value: '96.9%',
  },
];

export const viewSubjectRows: ViewSubjectRow[] = [
  { subject: 'English', marks: '90', max: '100', grade: 'A', gradeBadge: 'badge badge-soft-success', percentage: '90.0%' },
  { subject: 'Mathematics', marks: '96', max: '100', grade: 'A+', gradeBadge: 'badge badge-soft-success', percentage: '96.0%' },
  { subject: 'Science', marks: '93', max: '100', grade: 'A+', gradeBadge: 'badge badge-soft-success', percentage: '93.0%' },
  { subject: 'Social Science', marks: '89', max: '100', grade: 'A', gradeBadge: 'badge badge-soft-success', percentage: '89.0%' },
  { subject: 'Hindi', marks: '85', max: '100', grade: 'A', gradeBadge: 'badge badge-soft-success', percentage: '85.0%' },
  { subject: 'Computer Science', marks: '97', max: '100', grade: 'A+', gradeBadge: 'badge badge-soft-success', percentage: '97.0%' },
  { subject: 'Total', marks: '550', max: '600', grade: 'A+', gradeBadge: 'badge badge-soft-success', percentage: '91.7%', total: true },
];

export const viewGrowthStats: DetailStat[] = [
  { label: 'Unit Test 1', value: '88.3% · rank 2' },
  { label: 'Term 1 Exam', value: '91.7% · rank 1' },
  { label: 'Change', value: '+3.3 points', badge: 'badge badge-soft-success', badgeIcon: 'ti ti-trending-up' },
  { label: 'Trend', value: 'Improving' },
];

export const viewAttendanceStats: DetailStat[] = [
  { label: 'Present', value: '93 of 96 days' },
  { label: 'Absent', value: '3 days' },
  { label: 'Teaching Lost', value: '18 periods' },
  { label: 'Band', value: 'Regular', badge: 'badge badge-soft-success' },
];

export const viewRemarkRows: ViewRemarkRow[] = [
  { date: '27 Jul 2026', teacher: 'Mrs. Ellen Cruz', subject: 'Class Teacher' },
  { date: '26 Jul 2026', teacher: 'Mr. Vikram Sethi', subject: 'Science' },
  { date: '25 Jul 2026', teacher: 'Mrs. Sofia Alvarez', subject: 'Hindi' },
];

export const viewNote =
  'Merit certificate GEN-2026-0455 was raised from this result and collected on 26 Jul.';

/* ------------------------------ Compare Performance ------------------------------ */

export interface RadioOption {
  id: string;
  label: string;
}

export const compareBasisOptions: RadioOption[] = [
  { id: 'cmpExam', label: 'Previous Exam' },
  { id: 'cmpSection', label: 'Section Mean' },
  { id: 'cmpPeer', label: 'Another Student' },
];

export const compareStudents = [
  'Ananya Rao · AD9887402',
  'Rohan Desai · AD9889014',
  'Aarav Kumar · AD9891255',
  'Tanvi Sharma · AD9893712',
];

export const compareWithOptions = [
  'Unit Test 1 · EXM-2026-011',
  'Term 1 Exam · EXM-2026-014',
  'Class X B section mean',
];

export interface CompareRow {
  assessment: string;
  percentage: string;
  percentageMuted?: boolean;
  grade: string;
  gradeBadge?: string;
  gradeMuted?: boolean;
  rank: string;
  rankMuted?: boolean;
  change: string;
  changeBadge?: string;
  changeIcon?: string;
  changeMuted?: boolean;
}

export const compareRows: CompareRow[] = [
  {
    assessment: 'Unit Test 1',
    percentage: '88.3%',
    grade: 'A',
    gradeBadge: 'badge badge-soft-success',
    rank: '2 of 46',
    change: '—',
    changeMuted: true,
  },
  {
    assessment: 'Term 1 Exam',
    percentage: '91.7%',
    grade: 'A+',
    gradeBadge: 'badge badge-soft-success',
    rank: '1 of 46',
    change: '+3.3',
    changeBadge: 'badge badge-soft-success',
    changeIcon: 'ti ti-trending-up',
  },
  {
    assessment: 'Unit Test 2',
    percentage: 'Awaiting marks',
    percentageMuted: true,
    grade: '—',
    gradeMuted: true,
    rank: '—',
    rankMuted: true,
    change: '—',
    changeMuted: true,
  },
];

export interface SubjectMovementRow {
  subject: string;
  unitTest: string;
  term: string;
  change: string;
}

export const subjectMovementRows: SubjectMovementRow[] = [
  { subject: 'Mathematics', unitTest: '92', term: '96', change: '4' },
  { subject: 'Science', unitTest: '89', term: '93', change: '4' },
  { subject: 'Computer Science', unitTest: '93', term: '97', change: '4' },
  { subject: 'English', unitTest: '87', term: '90', change: '3' },
  { subject: 'Social Science', unitTest: '86', term: '89', change: '3' },
  { subject: 'Hindi', unitTest: '83', term: '85', change: '2' },
];

export const compareSummary: DetailStat[] = [
  { label: 'Papers Improved', value: '6 of 6' },
  { label: 'Smallest Gain', value: 'Hindi · 2 marks' },
  { label: 'Overall Movement', value: '88.3% to 91.7%' },
];

/* ------------------------------ Add Teacher Remarks ------------------------------ */

export const remarkStudent = {
  name: 'Kabir Shah',
  meta: 'AD9892008 · Class VI B · Roll 12',
  level: 'Under Review',
  stats: [
    { label: 'Subjects In', value: '5 of 6' },
    { label: 'Provisional Score', value: '70.8%' },
  ] as DetailStat[],
  footLabel: 'Attendance',
  footValue: '84.4% · Concern',
};

export const remarkTeachers = [
  'Ms. Meera Nair · Class Teacher',
  'Mr. Vikram Sethi · Science',
  'Mr. Ethan Brooks · Mathematics',
  'Mrs. Kalpana Menon · Academic Coordinator',
];

export const remarkAreas = [
  'Class Teacher',
  'Mathematics',
  'Science',
  'Hindi',
  'Attendance',
  'Conduct',
];

export const remarkExams = ['Term 1 Exam · EXM-2026-014', 'Unit Test 1 · EXM-2026-011'];

export const remarkTones = ['Encouraging', 'Neutral', 'Concern'];

/* ------------------------------ Improvement Plan ------------------------------ */

export const planStudent = {
  name: 'Ishaan Verma',
  meta: 'AD9894107 · Class IV A · IMP-2026-0074',
  level: 'Needs Improvement',
  stats: [
    { label: 'Overall Score', value: '54.6% · rank 34 of 40' },
    { label: 'Attendance', value: '78.1% · 21 days missed' },
    { label: 'Weakest Paper', value: 'Mathematics 41' },
  ] as DetailStat[],
  footLabel: 'Plan Target',
  footValue: 'Reach 55 in Mathematics and 85% attendance by the Half Yearly',
};

export const planStateOptions: RadioOption[] = [
  { id: 'planActive', label: 'Active' },
  { id: 'planProposed', label: 'Proposed' },
  { id: 'planClosed', label: 'Closed' },
];

export const planOwners = [
  'Ms. Meera Nair · Class Teacher',
  'Mr. Ethan Brooks · Mathematics',
  'Mrs. Kalpana Menon · Academic Coordinator',
];

export const planMeasuredAt = ['Half Yearly Examination', 'Unit Test 2', 'End of Term 2'];

export const planSupport =
  'Saturday problem clinic with Mr. Ethan Brooks, fortnightly attendance note to the guardians and a counsellor review on record as MV-2026-0331.';

/* ------------------------------ Generate Report Card ------------------------------ */

export const reportScopeOptions: RadioOption[] = [
  { id: 'rcOne', label: 'This Student' },
  { id: 'rcSel', label: 'Selected (8)' },
  { id: 'rcSection', label: 'Whole Section' },
];

export const reportSummary: DetailStat[] = [
  { label: 'Student', value: 'Ananya Rao · AD9887402' },
  { label: 'Overall Score', value: '91.7% · A+' },
  { label: 'Existing Report', value: 'ACR-2026-0341 · published' },
];

export const reportTemplates = [
  'Term report card, A4 portrait',
  'Junior progress report, A4 portrait',
  'Consolidated term report, A4 landscape',
];

export const reportGeneratedBy = [
  'Mrs. Ellen Cruz · Class Teacher',
  'Mrs. Kalpana Menon · Academic Coordinator',
];

export interface SwitchField {
  id: string;
  label: string;
  checked: boolean;
}

export const reportSwitches: SwitchField[] = [
  { id: 'rcRank', label: 'Print the class rank and the movement', checked: true },
  { id: 'rcAtt', label: 'Print the attendance summary', checked: true },
  { id: 'rcRem', label: 'Print the teacher remarks', checked: true },
  { id: 'rcSkip', label: 'Skip any student with an open subject', checked: true },
];

export const remarkSwitches: SwitchField[] = [
  { id: 'remPrint', label: 'Print this remark on the report card', checked: true },
  { id: 'remGuard', label: 'Notify the guardians on the portal', checked: false },
];

export const planSwitches: SwitchField[] = [
  { id: 'planMeet', label: 'Book a guardian meeting when the plan is saved', checked: true },
  { id: 'planHold', label: 'Hold the report card until the plan review', checked: true },
  { id: 'planClose', label: 'Close the plan automatically once both targets are met', checked: true },
];

export const shareSwitches: SwitchField[] = [
  { id: 'shpPlan', label: 'Attach the improvement plan if one is open', checked: true },
  { id: 'shpAck', label: 'Ask the guardian to acknowledge', checked: true },
];

/* ------------------------------ Share Performance Report ------------------------------ */

export const shareStudent = {
  name: 'Aarav Kumar',
  meta: 'AD9891255 · Class VII A · ACR-2026-0347',
  level: 'Average',
  stats: [{ label: 'Overall Score', value: '73.2% · rank 11 of 44' }] as DetailStat[],
  footLabel: 'Report Card',
  footValue: 'Pending Review · not yet shareable',
};

export const shareAudienceOptions: RadioOption[] = [
  { id: 'shpGuard', label: 'Guardians' },
  { id: 'shpTeacher', label: 'Class Teacher' },
  { id: 'shpCoord', label: 'Coordinator' },
];

export const shareChannels = ['Parent portal', 'Email', 'SMS link'];

export const shareExpiry = ['30 days', '7 days', 'End of the term'];

export const shareInclude = [
  'Score, grade, rank and attendance',
  'Score and grade only',
  'Full report card with remarks',
];

export const shareMessage =
  'The Term 1 performance summary is ready. The report card follows once the Academic Coordinator has signed it off.';

/* ------------------------------ Performance Details panel ------------------------------ */

export const panelStudent = {
  name: 'Ananya Rao',
  meta: 'AD9887402 · Class X B',
  level: 'Excellent',
};

export const panelStudentStats: DetailStat[] = [
  { label: 'Roll Number', value: '14' },
  { label: 'Class Teacher', value: 'Mrs. Ellen Cruz' },
  { label: 'Section Strength', value: '46 students' },
  { label: 'Academic Year', value: '2026-2027' },
];

export interface PanelEntry {
  id: string;
  tint: string;
  icon: string;
  title: string;
  meta: string;
}

export const panelTimeline: PanelEntry[] = [
  {
    id: 't1',
    tint: 'bg-secondary-transparent text-secondary',
    icon: 'ti ti-clock',
    title: 'Unit Test 1 results placed',
    meta: '19 Jun 2026 · 88.3% · rank 2',
  },
  {
    id: 't2',
    tint: 'bg-info-transparent text-info',
    icon: 'ti ti-book',
    title: 'Term 1 Exam written',
    meta: '6 Jul – 17 Jul 2026 · six papers',
  },
  {
    id: 't3',
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-circle-check',
    title: 'Performance evaluated',
    meta: '27 Jul 2026 · Mrs. Ellen Cruz',
  },
  {
    id: 't4',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-calendar-time',
    title: 'Unit Test 2 in progress',
    meta: '27 Jul – 31 Jul 2026 · marks close 4 Aug',
  },
];

export interface PanelTile {
  id: string;
  label: string;
  value: string;
  valueClass: string;
}

export const panelTiles: PanelTile[] = [
  { id: 'score', label: 'Score', value: '91.7%', valueClass: 'fs-14 mb-0 text-success' },
  { id: 'grade', label: 'Grade', value: 'A+', valueClass: 'fs-14 mb-0 text-success' },
  { id: 'rank', label: 'Rank', value: '1 / 46', valueClass: 'fs-14 mb-0' },
];

export const panelSummaryStats: DetailStat[] = [
  { label: 'Marks Obtained', value: '550 of 600' },
  { label: 'Best Paper', value: 'Computer Science 97' },
  { label: 'Weakest Paper', value: 'Hindi 85' },
  { label: 'Attendance', value: '96.9% · Regular' },
];

export interface ExamHistoryRow {
  exam: string;
  score: string;
  rank: string;
}

export const panelExamHistory: ExamHistoryRow[] = [
  { exam: 'Unit Test 1', score: '88.3%', rank: '2 of 46' },
  { exam: 'Term 1 Exam', score: '91.7%', rank: '1 of 46' },
  { exam: 'Unit Test 2', score: 'Awaiting marks', rank: '—' },
];

export const panelProgressStats: DetailStat[] = [
  {
    label: 'Change Since Unit Test 1',
    value: '+3.3 points',
    badge: 'badge badge-soft-success',
    badgeIcon: 'ti ti-trending-up',
  },
  { label: 'Rank Movement', value: '2 to 1' },
  { label: 'Trend', value: 'Improving' },
  { label: 'Improvement Plan', value: 'Not required' },
];

export const panelRecommendations: PanelEntry[] = [
  {
    id: 'rec1',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-bulb',
    title: 'Keep the Hindi reading practice',
    meta: 'Hindi 85 is the only paper under ninety',
  },
  {
    id: 'rec2',
    tint: 'bg-success-transparent text-success',
    icon: 'ti ti-award',
    title: 'Put forward for the Science Olympiad',
    meta: 'Mr. Vikram Sethi · 26 Jul 2026',
  },
  {
    id: 'rec3',
    tint: 'bg-info-transparent text-info',
    icon: 'ti ti-checklist',
    title: 'No improvement plan needed',
    meta: 'Level is Excellent and every paper is above the pass mark',
  },
];

export const panelAudit: PanelEntry[] = [
  {
    id: 'a1',
    tint: 'bg-secondary-transparent text-secondary',
    icon: 'ti ti-lock',
    title: 'Marks closed for all six subjects',
    meta: '24 Jul 2026 · Mrs. Kalpana Menon',
  },
  {
    id: 'a2',
    tint: 'bg-info-transparent text-info',
    icon: 'ti ti-user-check',
    title: 'Performance evaluated and level placed',
    meta: '27 Jul 2026 · Mrs. Ellen Cruz',
  },
  {
    id: 'a3',
    tint: 'bg-purple-transparent text-purple',
    icon: 'ti ti-report',
    title: 'Report card ACR-2026-0341 published',
    meta: '29 Jul 2026 · shared with 2 guardians',
  },
  {
    id: 'a4',
    tint: 'bg-warning-transparent text-warning',
    icon: 'ti ti-link',
    title: 'Merit certificate raised',
    meta: 'GEN-2026-0455 · collected 26 Jul 2026',
  },
];
