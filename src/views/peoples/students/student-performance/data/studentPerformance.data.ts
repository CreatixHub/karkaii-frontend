export type PerformanceModalId =
  | 'view'
  | 'compare'
  | 'remarks'
  | 'plan'
  | 'reportCard'
  | 'share';

export type ReportTypeId =
  | 'repOverall'
  | 'repSubject'
  | 'repAttendance'
  | 'repGrowth'
  | 'repRisk';

export type QuickFilterId = 'all' | 'excellent' | 'good' | 'average' | 'needs' | 'risk';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type SortId = 'score' | 'name' | 'rank' | 'attendance' | 'growth';

export type ColumnId =
  | 'student'
  | 'admission'
  | 'class'
  | 'exam'
  | 'score'
  | 'grade'
  | 'rank'
  | 'attendance'
  | 'level';

export interface IconLabel {
  id: string;
  icon: string;
  label: string;
}

export interface ReportType {
  id: ReportTypeId;
  icon: string;
  label: string;
}

export const reportTypes: ReportType[] = [
  { id: 'repOverall', icon: 'ti ti-chart-arrows', label: 'Overall' },
  { id: 'repSubject', icon: 'ti ti-book', label: 'Subject' },
  { id: 'repAttendance', icon: 'ti ti-calendar-check', label: 'Attendance' },
  { id: 'repGrowth', icon: 'ti ti-trending-up', label: 'Growth' },
  { id: 'repRisk', icon: 'ti ti-lifebuoy', label: 'At Risk' },
];

/** The native `form-select` fields inside the collapsed Filters accordion. */
export interface FilterField {
  id: string;
  label: string;
  col: string;
  options: string[];
  /** The template marked one option `selected`; blank means the first option. */
  selected?: string;
}

export const filterFields: FilterField[] = [
  {
    id: 'academic-year',
    label: 'Academic Year',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: ['2026-2027', '2025-2026', '2024-2025'],
  },
  {
    id: 'exam-term',
    label: 'Exam / Term',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: ['Unit Test 1', 'Term 1 Exam', 'Unit Test 2', 'Half Yearly'],
    selected: 'Term 1 Exam',
  },
  {
    id: 'class',
    label: 'Class',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: [
      'All Classes',
      'Class II',
      'Class IV',
      'Class V',
      'Class VI',
      'Class VII',
      'Class IX',
      'Class X',
    ],
  },
  {
    id: 'section',
    label: 'Section',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: ['All Sections', 'A', 'B', 'C'],
  },
  {
    id: 'performance-level',
    label: 'Performance Level',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: [
      'All Levels',
      'Excellent',
      'Good',
      'Average',
      'Needs Improvement',
      'At Risk',
      'Under Review',
    ],
  },
  {
    id: 'grade',
    label: 'Grade',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: ['All Grades', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E'],
  },
  {
    id: 'attendance-band',
    label: 'Attendance Band',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: ['All Bands', 'Regular', 'Watch', 'Concern'],
  },
  {
    id: 'improvement-plan',
    label: 'Improvement Plan',
    col: 'col-xxl-2 col-lg-4 col-md-6',
    options: ['All', 'Active', 'Proposed', 'Closed', 'Not required'],
  },
];

/** The extra fields behind the "More Filters" dropdown. */
export interface MoreFilterField {
  id: string;
  label: string;
  options: string[];
}

export const moreFilterFields: MoreFilterField[] = [
  { id: 'class-rank', label: 'Class Rank', options: ['Any', 'Top 10', 'Top 25', 'Bottom 25', 'Bottom 10'] },
  {
    id: 'growth-since-unit-test-1',
    label: 'Growth Since Unit Test 1',
    options: ['Any', 'Improved', 'Steady', 'Declined'],
  },
  {
    id: 'subjects-below-pass',
    label: 'Subjects Below Pass',
    options: ['Any', 'None', '1 subject', '2 subjects', '3 or more'],
  },
  {
    id: 'class-teacher',
    label: 'Class Teacher',
    options: ['Anyone', 'Ms. Priya Sundaram', 'Mr. Deepak Bhat', 'Mrs. Anjali Rao'],
  },
];

export interface SavedView {
  id: string;
  icon: string;
  label: string;
  count: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', icon: 'ti ti-layout-list', label: 'All Students', count: '1186' },
  { id: 'top', icon: 'ti ti-medal', label: 'Top Performers', count: '38' },
  { id: 'needs', icon: 'ti ti-alert-triangle', label: 'Needs Improvement', count: '152' },
  { id: 'risk', icon: 'ti ti-urgent', label: 'At Risk', count: '33' },
  { id: 'plans', icon: 'ti ti-progress-check', label: 'Improvement Plans', count: '118' },
  { id: 'attendance', icon: 'ti ti-calendar-off', label: 'Attendance Concern', count: '96' },
];

export interface ColumnToggle {
  id: ColumnId;
  label: string;
}

export const columnToggles: ColumnToggle[] = [
  { id: 'student', label: 'Student' },
  { id: 'admission', label: 'Admission No.' },
  { id: 'class', label: 'Class' },
  { id: 'exam', label: 'Exam / Term' },
  { id: 'score', label: 'Overall Score' },
  { id: 'grade', label: 'Grade' },
  { id: 'rank', label: 'Rank' },
  { id: 'attendance', label: 'Attendance %' },
  { id: 'level', label: 'Performance Level' },
];

export interface SortOption {
  id: SortId;
  icon: string;
  label: string;
}

export const sortOptions: SortOption[] = [
  { id: 'score', icon: 'ti ti-percentage', label: 'Overall score' },
  { id: 'name', icon: 'ti ti-abc', label: 'Student (A–Z)' },
  { id: 'rank', icon: 'ti ti-medal', label: 'Class rank' },
  { id: 'attendance', icon: 'ti ti-calendar-event', label: 'Attendance' },
  { id: 'growth', icon: 'ti ti-trending-up', label: 'Growth since Unit Test 1' },
];

export interface DensityOption {
  id: DensityId;
  icon: string;
  title: string;
  ariaLabel: string;
}

export const densityOptions: DensityOption[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact', ariaLabel: 'Compact rows' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default', ariaLabel: 'Default rows' },
  {
    id: 'comfortable',
    icon: 'ti ti-baseline-density-large',
    title: 'Comfortable',
    ariaLabel: 'Comfortable rows',
  },
];

export interface QuickFilter {
  id: QuickFilterId;
  icon: string;
  label: string;
  count: string;
  /** The performance level the chip narrows the grid down to. */
  level?: string;
}

export const quickFilters: QuickFilter[] = [
  { id: 'all', icon: 'ti ti-layout-list', label: 'All', count: '1186' },
  { id: 'excellent', icon: 'ti ti-star', label: 'Excellent', count: '284', level: 'Excellent' },
  { id: 'good', icon: 'ti ti-circle-check', label: 'Good', count: '305', level: 'Good' },
  { id: 'average', icon: 'ti ti-chart-dots', label: 'Average', count: '412', level: 'Average' },
  {
    id: 'needs',
    icon: 'ti ti-alert-triangle',
    label: 'Needs Improvement',
    count: '152',
    level: 'Needs Improvement',
  },
  { id: 'risk', icon: 'ti ti-urgent', label: 'At Risk', count: '33', level: 'At Risk' },
];

export interface SummaryCard {
  id: string;
  accent: string;
  icon: string;
  value: string;
  label: string;
}

export const summaryCards: SummaryCard[] = [
  { id: 'evaluated', accent: 'accent-primary', icon: 'ti ti-users', value: '1,186', label: 'Students Evaluated' },
  { id: 'excellent', accent: 'accent-success', icon: 'ti ti-star', value: '284', label: 'Excellent' },
  { id: 'good', accent: 'accent-info', icon: 'ti ti-circle-check', value: '305', label: 'Good' },
  { id: 'average', accent: 'accent-teal', icon: 'ti ti-chart-dots', value: '412', label: 'Average' },
  {
    id: 'needs',
    accent: 'accent-warning',
    icon: 'ti ti-alert-triangle',
    value: '152',
    label: 'Needs Improvement',
  },
  { id: 'risk', accent: 'accent-danger', icon: 'ti ti-urgent', value: '33', label: 'At Risk' },
  { id: 'top', accent: 'accent-purple', icon: 'ti ti-medal', value: '38', label: 'Top Performers' },
  {
    id: 'plans',
    accent: 'accent-slate',
    icon: 'ti ti-progress-check',
    value: '118',
    label: 'Improvement Plans',
  },
];

export interface BulkAction {
  id: string;
  icon: string;
  label: string;
  modal?: PerformanceModalId;
}

export const bulkActions: BulkAction[] = [
  { id: 'pdf', icon: 'ti ti-file-type-pdf', label: 'Bulk Export PDF' },
  { id: 'xls', icon: 'ti ti-file-type-xls', label: 'Bulk Export Excel' },
  { id: 'cards', icon: 'ti ti-file-certificate', label: 'Generate Report Cards', modal: 'reportCard' },
  { id: 'plan', icon: 'ti ti-progress-check', label: 'Improvement Plan', modal: 'plan' },
  { id: 'share', icon: 'ti ti-share', label: 'Share', modal: 'share' },
];

export interface TableColumn {
  id: ColumnId;
  label: string;
  sortable: boolean;
  /** The template pre-sorts the Student column ascending. */
  sorted?: boolean;
}

export const tableColumns: TableColumn[] = [
  { id: 'student', label: 'Student', sortable: true, sorted: true },
  { id: 'admission', label: 'Admission No.', sortable: true },
  { id: 'class', label: 'Class', sortable: true },
  { id: 'exam', label: 'Exam / Term', sortable: false },
  { id: 'score', label: 'Overall Score', sortable: true },
  { id: 'grade', label: 'Grade', sortable: true },
  { id: 'rank', label: 'Rank', sortable: true },
  { id: 'attendance', label: 'Attendance %', sortable: true },
  { id: 'level', label: 'Performance Level', sortable: false },
];

/** One `label / value` line inside an expanded row. */
export interface DetailStat {
  label: string;
  value: string;
  /** When set the value renders as a badge with this class. */
  badge?: string;
  /** Tabler icon rendered inside the badge, e.g. "ti ti-trending-up". */
  badgeIcon?: string;
}

export interface SubjectMark {
  subject: string;
  marks?: string;
  max?: string;
  grade?: string;
  gradeBadge?: string;
  /** Row 8's Science paper, which shows a badge instead of a mark. */
  missingBadge?: string;
  missingLabel?: string;
}

export interface Chip {
  badge: string;
  label: string;
}

export interface RemarkEntry {
  id: string;
  tint: string;
  teacher: string;
  meta: string;
  text: string;
}

export interface MeetingEntry {
  id: string;
  tint: string;
  icon: string;
  title: string;
  meta: string;
  status: string;
  statusBadge: string;
  text: string;
}

export interface DetailAction {
  label: string;
  icon: string;
  className: string;
  modal?: PerformanceModalId;
  panel?: boolean;
}

export interface PerformanceDetail {
  profile: DetailStat[];
  subjects: SubjectMark[];
  bestWeakest: string;
  gradeChips: Chip[];
  gradeStats: DetailStat[];
  attendanceStats: DetailStat[];
  remarks: RemarkEntry[];
  strengths: string[];
  improvements: string[];
  focusStats: DetailStat[];
  meetings: MeetingEntry[];
  meetingsHeld: string;
  noteChips: string[];
  note: string;
  actions: DetailAction[];
}

export interface RankMove {
  badge: string;
  icon: string;
  label: string;
}

export interface PerformanceRow {
  id: string;
  avatar: string;
  name: string;
  sub: string;
  admissionNo: string;
  roll: string;
  classBadge: string;
  classMeta: string;
  exam: string;
  examMeta: string;
  score: string;
  scoreMarks: string;
  scoreDelta: string;
  grade: string;
  gradeBadge: string;
  gradeRemark: string;
  rank: string;
  rankMeta: string;
  rankMove?: RankMove;
  attendance: string;
  attendanceDays: string;
  attendanceBand: string;
  attendanceBandBadge: string;
  levelPill: string;
  level: string;
  levelMeta: string;
  detail: PerformanceDetail;
}

const PASS_MARK: DetailStat = { label: 'Pass Mark', value: '33% of the paper' };

export const performanceRows: PerformanceRow[] = [
  {
    id: 'sp_01',
    avatar: 'bg-primary-transparent text-primary',
    name: 'Ananya Rao',
    sub: 'Roll 14 · Mrs. Ellen Cruz',
    admissionNo: 'AD9887402',
    roll: 'Roll 14',
    classBadge: 'Class X B',
    classMeta: '46 students · Mrs. Ellen Cruz',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '91.7%',
    scoreMarks: '550 of 600 marks',
    scoreDelta: '+3.3 vs Unit Test 1',
    grade: 'A+',
    gradeBadge: 'badge badge-soft-success',
    gradeRemark: 'Outstanding',
    rank: '1 of 46',
    rankMeta: 'Class X B',
    rankMove: { badge: 'badge badge-soft-success', icon: 'ti ti-trending-up', label: 'Up 1' },
    attendance: '96.9%',
    attendanceDays: '93 of 96 days',
    attendanceBand: 'Regular',
    attendanceBandBadge: 'badge badge-soft-success',
    levelPill: 'dt-pill is-completed',
    level: 'Excellent',
    levelMeta: 'Improving · 4 days ago',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9887402' },
        { label: 'Class / Section', value: 'Class X B' },
        { label: 'Roll Number', value: '14' },
        { label: 'Class Teacher', value: 'Mrs. Ellen Cruz' },
        { label: 'Section Strength', value: '46 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '90', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Mathematics', marks: '96', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Science', marks: '93', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Social Science', marks: '89', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Hindi', marks: '85', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Computer Science', marks: '97', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
      ],
      bestWeakest: 'Computer Science 97 · Hindi 85',
      gradeChips: [
        { badge: 'badge badge-soft-success', label: 'A+ · 3 subjects' },
        { badge: 'badge badge-soft-success', label: 'A · 3 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'A+', badge: 'badge badge-soft-success' },
        { label: 'Remark', value: 'Outstanding' },
        { label: 'Performance Level', value: 'Excellent', badge: 'badge badge-soft-success' },
        { label: 'Subjects at Pass Mark', value: '6 of 6' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '93 days' },
        { label: 'Absent', value: '3 days' },
        { label: 'Late Marks', value: '1' },
        { label: 'Attendance', value: '96.9%', badge: 'badge badge-soft-success' },
        { label: 'Band', value: 'Regular' },
        { label: 'Teaching Lost', value: '18 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-success-transparent text-success',
          teacher: 'Mrs. Ellen Cruz',
          meta: 'Class Teacher · 27 Jul 2026',
          text: 'Consistent across every paper and first in the section for the second year running.',
        },
        {
          id: 'r2',
          tint: 'bg-info-transparent text-info',
          teacher: 'Mr. Vikram Sethi',
          meta: 'Science · 26 Jul 2026',
          text: 'Practical record is the best in Class X. Put forward for the Science Olympiad panel.',
        },
        {
          id: 'r3',
          tint: 'bg-warning-transparent text-warning',
          teacher: 'Mrs. Sofia Alvarez',
          meta: 'Hindi · 25 Jul 2026',
          text: 'Hindi at 85 is the weakest of the six. Comprehension answers need more detail.',
        },
      ],
      strengths: ['Mathematics and Computer Science', 'Laboratory work', 'Written presentation'],
      improvements: ['Hindi comprehension', 'Time spent on the second language'],
      focusStats: [
        { label: 'Improvement Plan', value: 'Not required' },
        {
          label: 'Growth',
          value: 'Improving',
          badge: 'badge badge-soft-success',
          badgeIcon: 'ti ti-trending-up',
        },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Term 1 review',
          meta: '29 Jul 2026 · Mrs. Ellen Cruz',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Guardians acknowledged the report card on the portal the same evening.',
        },
        {
          id: 'm2',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Unit Test 1 review',
          meta: '24 Jun 2026 · Mrs. Ellen Cruz',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Agreed to keep Hindi reading practice at thirty minutes a day.',
        },
      ],
      meetingsHeld: '2 held',
      noteChips: ['Top of the section', 'Science Olympiad panel'],
      note: 'Merit certificate GEN-2026-0455 was raised from this result and collected on 26 Jul.',
      actions: [
        { label: 'Generate Report Card', icon: 'ti ti-report', className: 'btn btn-primary btn-sm', modal: 'reportCard' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_02',
    avatar: 'bg-info-transparent text-info',
    name: 'Rohan Desai',
    sub: 'Roll 9 · Mr. Arjun Kale',
    admissionNo: 'AD9889014',
    roll: 'Roll 9',
    classBadge: 'Class IX C',
    classMeta: '42 students · Mr. Arjun Kale',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '88.3%',
    scoreMarks: '530 of 600 marks',
    scoreDelta: '+3.2 vs Unit Test 1',
    grade: 'A',
    gradeBadge: 'badge badge-soft-success',
    gradeRemark: 'Excellent',
    rank: '1 of 42',
    rankMeta: 'Class IX C',
    rankMove: { badge: 'badge badge-soft-success', icon: 'ti ti-trending-up', label: 'Up 1' },
    attendance: '94.8%',
    attendanceDays: '91 of 96 days',
    attendanceBand: 'Regular',
    attendanceBandBadge: 'badge badge-soft-success',
    levelPill: 'dt-pill is-completed',
    level: 'Excellent',
    levelMeta: 'Improving · 3 days ago',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9889014' },
        { label: 'Class / Section', value: 'Class IX C' },
        { label: 'Roll Number', value: '9' },
        { label: 'Class Teacher', value: 'Mr. Arjun Kale' },
        { label: 'Section Strength', value: '42 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '86', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Mathematics', marks: '91', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Science', marks: '89', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Social Science', marks: '84', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Hindi', marks: '88', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Computer Science', marks: '92', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
      ],
      bestWeakest: 'Computer Science 92 · Social Science 84',
      gradeChips: [
        { badge: 'badge badge-soft-success', label: 'A+ · 2 subjects' },
        { badge: 'badge badge-soft-success', label: 'A · 4 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'A', badge: 'badge badge-soft-success' },
        { label: 'Remark', value: 'Excellent' },
        { label: 'Performance Level', value: 'Excellent', badge: 'badge badge-soft-success' },
        { label: 'Subjects at Pass Mark', value: '6 of 6' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '91 days' },
        { label: 'Absent', value: '5 days' },
        { label: 'Late Marks', value: '2' },
        { label: 'Attendance', value: '94.8%', badge: 'badge badge-soft-success' },
        { label: 'Band', value: 'Regular' },
        { label: 'Teaching Lost', value: '30 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-success-transparent text-success',
          teacher: 'Mr. Arjun Kale',
          meta: 'Class Teacher · 28 Jul 2026',
          text: 'Top of IX C and the only student above ninety in Mathematics this term.',
        },
        {
          id: 'r2',
          tint: 'bg-info-transparent text-info',
          teacher: 'Ms. Deepa Rawat',
          meta: 'Computer Science · 27 Jul 2026',
          text: 'Project work was the strongest submission in the section.',
        },
      ],
      strengths: ['Mathematics', 'Computer Science project work', 'Steady attendance'],
      improvements: ['Social Science answer length', 'Handwriting under time pressure'],
      focusStats: [
        { label: 'Improvement Plan', value: 'Not required' },
        {
          label: 'Growth',
          value: 'Improving',
          badge: 'badge badge-soft-success',
          badgeIcon: 'ti ti-trending-up',
        },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Term 1 review',
          meta: '30 Jul 2026 · Mr. Arjun Kale',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Section report is still held for the Mathematics remedial plan, so only the personal sheet was shared.',
        },
      ],
      meetingsHeld: '1 held',
      noteChips: ['Section topper', 'Steady growth'],
      note: 'Named as top performer in the Class IX C summary ACR-2026-0344, which is reviewed but not yet published.',
      actions: [
        { label: 'Generate Report Card', icon: 'ti ti-report', className: 'btn btn-primary btn-sm', modal: 'reportCard' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_03',
    avatar: 'bg-success-transparent text-success',
    name: 'Meera Iyer',
    sub: 'Roll 4 · Ms. Grace Otieno',
    admissionNo: 'AD9893660',
    roll: 'Roll 4',
    classBadge: 'Class V A',
    classMeta: '38 students · Ms. Grace Otieno',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '89.6%',
    scoreMarks: '448 of 500 marks',
    scoreDelta: '−1.2 vs Unit Test 1',
    grade: 'A',
    gradeBadge: 'badge badge-soft-success',
    gradeRemark: 'Excellent',
    rank: '1 of 38',
    rankMeta: 'Class V A',
    rankMove: { badge: 'badge badge-soft-secondary', icon: 'ti ti-minus', label: 'No change' },
    attendance: '95.8%',
    attendanceDays: '92 of 96 days',
    attendanceBand: 'Regular',
    attendanceBandBadge: 'badge badge-soft-success',
    levelPill: 'dt-pill is-completed',
    level: 'Excellent',
    levelMeta: 'Steady · 2 days ago',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9893660' },
        { label: 'Class / Section', value: 'Class V A' },
        { label: 'Roll Number', value: '4' },
        { label: 'Class Teacher', value: 'Ms. Grace Otieno' },
        { label: 'Section Strength', value: '38 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '91', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Mathematics', marks: '87', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'EVS', marks: '94', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Hindi', marks: '85', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Computer Science', marks: '91', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
      ],
      bestWeakest: 'EVS 94 · Hindi 85',
      gradeChips: [
        { badge: 'badge badge-soft-success', label: 'A+ · 3 subjects' },
        { badge: 'badge badge-soft-success', label: 'A · 2 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'A', badge: 'badge badge-soft-success' },
        { label: 'Remark', value: 'Excellent' },
        { label: 'Performance Level', value: 'Excellent', badge: 'badge badge-soft-success' },
        { label: 'Subjects at Pass Mark', value: '5 of 5' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '92 days' },
        { label: 'Absent', value: '4 days' },
        { label: 'Late Marks', value: '0' },
        { label: 'Attendance', value: '95.8%', badge: 'badge badge-soft-success' },
        { label: 'Band', value: 'Regular' },
        { label: 'Teaching Lost', value: '24 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-success-transparent text-success',
          teacher: 'Ms. Grace Otieno',
          meta: 'Class Teacher · 29 Jul 2026',
          text: 'First in V A for the third assessment running. EVS project was read out at assembly.',
        },
        {
          id: 'r2',
          tint: 'bg-warning-transparent text-warning',
          teacher: 'Ms. Grace Otieno',
          meta: 'Hindi · 29 Jul 2026',
          text: 'Slight dip of one point overall. Hindi at 85 is the only subject below the section mean gap.',
        },
      ],
      strengths: ['EVS and English', 'Class participation', 'Full attendance record'],
      improvements: ['Hindi writing speed', 'Mathematics word problems'],
      focusStats: [
        { label: 'Improvement Plan', value: 'Not required' },
        { label: 'Growth', value: 'Steady', badge: 'badge badge-soft-info', badgeIcon: 'ti ti-minus' },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-warning-transparent text-warning',
          icon: 'ti ti-calendar-event',
          title: 'Term 1 review',
          meta: '30 Jul 2026 · Ms. Grace Otieno',
          status: 'Scheduled',
          statusBadge: 'badge badge-soft-warning',
          text: 'Set for 1 Aug with the consolidated report ACR-2026-0356 once it is generated.',
        },
      ],
      meetingsHeld: '0 held',
      noteChips: ['Section topper', 'Full attendance'],
      note: 'Bonafide certificate REQ-2026-0159 was raised for her scholarship application on 24 Jul.',
      actions: [
        { label: 'Generate Report Card', icon: 'ti ti-report', className: 'btn btn-primary btn-sm', modal: 'reportCard' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_04',
    avatar: 'bg-purple-transparent text-purple',
    name: 'Lisa Gourley',
    sub: 'Roll 21 · Ms. Grace Otieno',
    admissionNo: 'AD9892431',
    roll: 'Roll 21',
    classBadge: 'Class II B',
    classMeta: '41 students · Ms. Grace Otieno',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '90.5%',
    scoreMarks: '362 of 400 marks',
    scoreDelta: '+3.3 vs Unit Test 1',
    grade: 'A',
    gradeBadge: 'badge badge-soft-success',
    gradeRemark: 'Excellent',
    rank: '3 of 41',
    rankMeta: 'Class II B',
    rankMove: { badge: 'badge badge-soft-success', icon: 'ti ti-trending-up', label: 'Up 2' },
    attendance: '94.8%',
    attendanceDays: '91 of 96 days',
    attendanceBand: 'Regular',
    attendanceBandBadge: 'badge badge-soft-success',
    levelPill: 'dt-pill is-completed',
    level: 'Excellent',
    levelMeta: 'Improving · 6 days ago',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9892431' },
        { label: 'Class / Section', value: 'Class II B' },
        { label: 'Roll Number', value: '21' },
        { label: 'Class Teacher', value: 'Ms. Grace Otieno' },
        { label: 'Section Strength', value: '41 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '92', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Mathematics', marks: '89', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'EVS', marks: '94', max: '/ 100', grade: 'A+', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Hindi', marks: '87', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
      ],
      bestWeakest: 'EVS 94 · Hindi 87',
      gradeChips: [
        { badge: 'badge badge-soft-success', label: 'A+ · 2 subjects' },
        { badge: 'badge badge-soft-success', label: 'A · 2 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'A', badge: 'badge badge-soft-success' },
        { label: 'Remark', value: 'Excellent' },
        { label: 'Performance Level', value: 'Excellent', badge: 'badge badge-soft-success' },
        { label: 'Subjects at Pass Mark', value: '4 of 4' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '91 days' },
        { label: 'Absent', value: '5 days' },
        { label: 'Late Marks', value: '0' },
        { label: 'Attendance', value: '94.8%', badge: 'badge badge-soft-success' },
        { label: 'Band', value: 'Regular' },
        { label: 'Teaching Lost', value: '30 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-success-transparent text-success',
          teacher: 'Ms. Grace Otieno',
          meta: 'Class Teacher · 25 Jul 2026',
          text: 'Two places up from Unit Test 1. Reading fluency is well ahead of the section.',
        },
        {
          id: 'r2',
          tint: 'bg-info-transparent text-info',
          teacher: 'Ms. Fatima Sheikh',
          meta: 'Library · 22 Jul 2026',
          text: 'Completed the Junior Reading Challenge. Participation certificate is in job GEN-2026-0451.',
        },
      ],
      strengths: ['Reading fluency', 'EVS observation work', 'Neat written work'],
      improvements: ['Hindi letter formation', 'Mental arithmetic speed'],
      focusStats: [
        { label: 'Improvement Plan', value: 'Not required' },
        {
          label: 'Growth',
          value: 'Improving',
          badge: 'badge badge-soft-success',
          badgeIcon: 'ti ti-trending-up',
        },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Term 1 review',
          meta: '28 Jul 2026 · Ms. Grace Otieno',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Junior section reports carry a descriptive band rather than a grade point. Explained to both guardians.',
        },
      ],
      meetingsHeld: '1 held',
      noteChips: ['Junior section', 'Improving'],
      note: 'No grade point is printed for the junior section. The letter grade here is for staff use only.',
      actions: [
        { label: 'Generate Report Card', icon: 'ti ti-report', className: 'btn btn-primary btn-sm', modal: 'reportCard' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_05',
    avatar: 'bg-info-transparent text-info',
    name: 'Tanvi Sharma',
    sub: 'Roll 27 · Ms. Grace Otieno',
    admissionNo: 'AD9893712',
    roll: 'Roll 27',
    classBadge: 'Class V A',
    classMeta: '38 students · Ms. Grace Otieno',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '78.4%',
    scoreMarks: '392 of 500 marks',
    scoreDelta: '+3.8 vs Unit Test 1',
    grade: 'B+',
    gradeBadge: 'badge badge-soft-info',
    gradeRemark: 'Very Good',
    rank: '9 of 38',
    rankMeta: 'Class V A',
    rankMove: { badge: 'badge badge-soft-success', icon: 'ti ti-trending-up', label: 'Up 4' },
    attendance: '88.5%',
    attendanceDays: '85 of 96 days',
    attendanceBand: 'Watch',
    attendanceBandBadge: 'badge badge-soft-warning',
    levelPill: 'dt-pill is-active',
    level: 'Good',
    levelMeta: 'Improving · 2 days ago',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9893712' },
        { label: 'Class / Section', value: 'Class V A' },
        { label: 'Roll Number', value: '27' },
        { label: 'Class Teacher', value: 'Ms. Grace Otieno' },
        { label: 'Section Strength', value: '38 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '82', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Mathematics', marks: '71', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'EVS', marks: '84', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
        { subject: 'Hindi', marks: '76', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Computer Science', marks: '79', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
      ],
      bestWeakest: 'EVS 84 · Mathematics 71',
      gradeChips: [
        { badge: 'badge badge-soft-success', label: 'A · 2 subjects' },
        { badge: 'badge badge-soft-info', label: 'B+ · 3 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'B+', badge: 'badge badge-soft-info' },
        { label: 'Remark', value: 'Very Good' },
        { label: 'Performance Level', value: 'Good', badge: 'badge badge-soft-info' },
        { label: 'Subjects at Pass Mark', value: '5 of 5' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '85 days' },
        { label: 'Absent', value: '11 days' },
        { label: 'Late Marks', value: '5' },
        { label: 'Attendance', value: '88.5%', badge: 'badge badge-soft-warning' },
        { label: 'Band', value: 'Watch' },
        { label: 'Teaching Lost', value: '66 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-success-transparent text-success',
          teacher: 'Ms. Grace Otieno',
          meta: 'Class Teacher · 29 Jul 2026',
          text: 'Four places up and the improvement plan target was met. Plan closed on 29 Jul.',
        },
        {
          id: 'r2',
          tint: 'bg-warning-transparent text-warning',
          teacher: 'Ms. Grace Otieno',
          meta: 'Attendance · 20 Jul 2026',
          text: 'Eleven days missed and five late marks. Worth watching in Term 2.',
        },
      ],
      strengths: ['EVS and English', 'Response to the improvement plan'],
      improvements: ['Punctuality', 'Mathematics accuracy under time pressure'],
      focusStats: [
        { label: 'Improvement Plan', value: 'IMP-2026-0061', badge: 'badge badge-soft-success' },
        { label: 'Plan Status', value: 'Closed' },
        { label: 'Target', value: 'Reach 70 in Mathematics by the end of Term 1' },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Improvement plan closure',
          meta: '29 Jul 2026 · Ms. Grace Otieno',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Plan IMP-2026-0061 closed after the Mathematics target of 70 was met at 71.',
        },
        {
          id: 'm2',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Improvement plan opening',
          meta: '18 May 2026 · Ms. Grace Otieno',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Plan opened after Unit Test 1. Weekly problem sets agreed with both guardians.',
        },
      ],
      meetingsHeld: '2 held',
      noteChips: ['Plan met its target', 'Attendance watch'],
      note: 'Improvement plan IMP-2026-0061 ran for ten weeks and closed on 29 Jul with the Mathematics target met.',
      actions: [
        { label: 'Generate Report Card', icon: 'ti ti-report', className: 'btn btn-primary btn-sm', modal: 'reportCard' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_06',
    avatar: 'bg-warning-transparent text-warning',
    name: 'Aarav Kumar',
    sub: 'Roll 18 · Mrs. Sofia Alvarez',
    admissionNo: 'AD9891255',
    roll: 'Roll 18',
    classBadge: 'Class VII A',
    classMeta: '44 students · Mrs. Sofia Alvarez',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '73.2%',
    scoreMarks: '439 of 600 marks',
    scoreDelta: '−2.6 vs Unit Test 1',
    grade: 'B+',
    gradeBadge: 'badge badge-soft-info',
    gradeRemark: 'Very Good',
    rank: '11 of 44',
    rankMeta: 'Class VII A',
    rankMove: { badge: 'badge badge-soft-danger', icon: 'ti ti-trending-down', label: 'Down 2' },
    attendance: '91.7%',
    attendanceDays: '88 of 96 days',
    attendanceBand: 'Regular',
    attendanceBandBadge: 'badge badge-soft-success',
    levelPill: 'dt-pill is-review',
    level: 'Average',
    levelMeta: 'Declining · yesterday',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9891255' },
        { label: 'Class / Section', value: 'Class VII A' },
        { label: 'Roll Number', value: '18' },
        { label: 'Class Teacher', value: 'Mrs. Sofia Alvarez' },
        { label: 'Section Strength', value: '44 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '74', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Mathematics', marks: '68', max: '/ 100', grade: 'B', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Science', marks: '79', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Social Science', marks: '71', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Hindi', marks: '66', max: '/ 100', grade: 'B', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Computer Science', marks: '81', max: '/ 100', grade: 'A', gradeBadge: 'badge badge-soft-success ms-1' },
      ],
      bestWeakest: 'Computer Science 81 · Hindi 66',
      gradeChips: [
        { badge: 'badge badge-soft-success', label: 'A · 1 subject' },
        { badge: 'badge badge-soft-info', label: 'B+ · 3 subjects' },
        { badge: 'badge badge-soft-info', label: 'B · 2 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'B+', badge: 'badge badge-soft-info' },
        { label: 'Remark', value: 'Very Good' },
        { label: 'Performance Level', value: 'Average', badge: 'badge badge-soft-warning' },
        { label: 'Subjects at Pass Mark', value: '6 of 6' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '88 days' },
        { label: 'Absent', value: '8 days' },
        { label: 'Late Marks', value: '4' },
        { label: 'Attendance', value: '91.7%', badge: 'badge badge-soft-success' },
        { label: 'Band', value: 'Regular' },
        { label: 'Teaching Lost', value: '48 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-warning-transparent text-warning',
          teacher: 'Mrs. Sofia Alvarez',
          meta: 'Class Teacher · 30 Jul 2026',
          text: 'Slipped two places. Eight absences in the term show in the Hindi score.',
        },
        {
          id: 'r2',
          tint: 'bg-danger-transparent text-danger',
          teacher: 'Mr. Ethan Brooks',
          meta: 'Mathematics · 29 Jul 2026',
          text: 'Sixty-eight is below the section mean. Recommended for the Saturday problem clinic.',
        },
      ],
      strengths: ['Computer Science', 'Science practical work'],
      improvements: ['Mathematics', 'Hindi', 'Attendance in the second half of the term'],
      focusStats: [
        { label: 'Improvement Plan', value: 'IMP-2026-0088', badge: 'badge badge-soft-info' },
        { label: 'Plan Status', value: 'Proposed' },
        { label: 'Target', value: 'Reach the section mean in both papers by the Half Yearly' },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-warning-transparent text-warning',
          icon: 'ti ti-calendar-event',
          title: 'Improvement plan proposal',
          meta: '3 Aug 2026 · Mr. Ethan Brooks',
          status: 'Scheduled',
          statusBadge: 'badge badge-soft-warning',
          text: 'Plan IMP-2026-0088 goes to the guardians on 3 Aug, before the Half Yearly scheme is set.',
        },
      ],
      meetingsHeld: '0 held',
      noteChips: ['Declining', 'Plan proposed'],
      note: 'Report card ACR-2026-0347 is still with the Academic Coordinator, so nothing has been shared with the guardians yet.',
      actions: [
        { label: 'Improvement Plan', icon: 'ti ti-target', className: 'btn btn-primary btn-sm', modal: 'plan' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_07',
    avatar: 'bg-danger-transparent text-danger',
    name: 'Ishaan Verma',
    sub: 'Roll 33 · Ms. Meera Nair',
    admissionNo: 'AD9894107',
    roll: 'Roll 33',
    classBadge: 'Class IV A',
    classMeta: '40 students · Ms. Meera Nair',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '54.6%',
    scoreMarks: '273 of 500 marks',
    scoreDelta: '−3.6 vs Unit Test 1',
    grade: 'C+',
    gradeBadge: 'badge badge-soft-warning',
    gradeRemark: 'Satisfactory',
    rank: '34 of 40',
    rankMeta: 'Class IV A',
    rankMove: { badge: 'badge badge-soft-danger', icon: 'ti ti-trending-down', label: 'Down 3' },
    attendance: '78.1%',
    attendanceDays: '75 of 96 days',
    attendanceBand: 'Concern',
    attendanceBandBadge: 'badge badge-soft-danger',
    levelPill: 'dt-pill is-pending',
    level: 'Needs Improvement',
    levelMeta: 'Declining · 3 days ago',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9894107' },
        { label: 'Class / Section', value: 'Class IV A' },
        { label: 'Roll Number', value: '33' },
        { label: 'Class Teacher', value: 'Ms. Meera Nair' },
        { label: 'Section Strength', value: '40 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '58', max: '/ 100', grade: 'C+', gradeBadge: 'badge badge-soft-warning ms-1' },
        { subject: 'Mathematics', marks: '41', max: '/ 100', grade: 'C', gradeBadge: 'badge badge-soft-warning ms-1' },
        { subject: 'EVS', marks: '62', max: '/ 100', grade: 'B', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Hindi', marks: '51', max: '/ 100', grade: 'C+', gradeBadge: 'badge badge-soft-warning ms-1' },
        { subject: 'Computer Science', marks: '61', max: '/ 100', grade: 'B', gradeBadge: 'badge badge-soft-info ms-1' },
      ],
      bestWeakest: 'EVS 62 · Mathematics 41',
      gradeChips: [
        { badge: 'badge badge-soft-info', label: 'B · 2 subjects' },
        { badge: 'badge badge-soft-warning', label: 'C+ · 2 subjects' },
        { badge: 'badge badge-soft-warning', label: 'C · 1 subject' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'C+', badge: 'badge badge-soft-warning' },
        { label: 'Remark', value: 'Satisfactory' },
        { label: 'Performance Level', value: 'Needs Improvement', badge: 'badge badge-soft-danger' },
        { label: 'Subjects at Pass Mark', value: '5 of 5' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '75 days' },
        { label: 'Absent', value: '21 days' },
        { label: 'Late Marks', value: '9' },
        { label: 'Attendance', value: '78.1%', badge: 'badge badge-soft-danger' },
        { label: 'Band', value: 'Concern' },
        { label: 'Teaching Lost', value: '126 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-danger-transparent text-danger',
          teacher: 'Ms. Meera Nair',
          meta: 'Class Teacher · 28 Jul 2026',
          text: 'Twenty-one days missed. Mathematics at 41 is the lowest in the section.',
        },
        {
          id: 'r2',
          tint: 'bg-warning-transparent text-warning',
          teacher: 'Mr. Ethan Brooks',
          meta: 'Mathematics · 27 Jul 2026',
          text: 'Attends the Saturday clinic but the gap from Unit Test 1 has widened.',
        },
        {
          id: 'r3',
          tint: 'bg-info-transparent text-info',
          teacher: 'Ms. Meera Nair',
          meta: 'Counselling · 15 Jul 2026',
          text: 'Referred to the counsellor after the third guardian meeting. MV-2026-0331 on record.',
        },
      ],
      strengths: ['EVS observation work', 'Willingness at the Saturday clinic'],
      improvements: ['Mathematics', 'Hindi', 'Attendance', 'Punctuality'],
      focusStats: [
        { label: 'Improvement Plan', value: 'IMP-2026-0074', badge: 'badge badge-soft-warning' },
        { label: 'Plan Status', value: 'Active' },
        { label: 'Target', value: 'Reach 55 in Mathematics and 85% attendance by the Half Yearly' },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Term 1 review',
          meta: '28 Jul 2026 · Ms. Meera Nair',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Third meeting this term. Attendance plan reviewed with the guardians and the counsellor.',
        },
        {
          id: 'm2',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Improvement plan opening',
          meta: '26 Jun 2026 · Ms. Meera Nair',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Plan IMP-2026-0074 opened with a Mathematics target of 55 and an attendance target of 85%.',
        },
        {
          id: 'm3',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Attendance concern',
          meta: '21 May 2026 · Ms. Meera Nair',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'First formal meeting after nine days missed in May.',
        },
      ],
      meetingsHeld: '3 held',
      noteChips: ['Improvement plan active', 'Attendance concern'],
      note: 'Report card is held until the improvement plan review on 7 Aug so the plan and the result go out together.',
      actions: [
        { label: 'Improvement Plan', icon: 'ti ti-target', className: 'btn btn-primary btn-sm', modal: 'plan' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
  {
    id: 'sp_08',
    avatar: 'bg-secondary-transparent text-secondary',
    name: 'Kabir Shah',
    sub: 'Roll 12 · Ms. Meera Nair',
    admissionNo: 'AD9892008',
    roll: 'Roll 12',
    classBadge: 'Class VI B',
    classMeta: '43 students · Ms. Meera Nair',
    exam: 'Term 1 Exam',
    examMeta: 'EXM-2026-014 · 6 Jul – 17 Jul 2026',
    score: '70.8%',
    scoreMarks: '354 of 500 marks',
    scoreDelta: 'provisional, Science not entered',
    grade: 'Withheld',
    gradeBadge: 'badge badge-soft-secondary',
    gradeRemark: 'a subject is still open',
    rank: '—',
    rankMeta: 'Unit Test 1 was 19',
    attendance: '84.4%',
    attendanceDays: '81 of 96 days',
    attendanceBand: 'Concern',
    attendanceBandBadge: 'badge badge-soft-danger',
    levelPill: 'dt-pill is-inactive',
    level: 'Under Review',
    levelMeta: '5 of 6 subjects in',
    detail: {
      profile: [
        { label: 'Admission No.', value: 'AD9892008' },
        { label: 'Class / Section', value: 'Class VI B' },
        { label: 'Roll Number', value: '12' },
        { label: 'Class Teacher', value: 'Ms. Meera Nair' },
        { label: 'Section Strength', value: '43 students' },
        { label: 'Academic Year', value: '2026-2027' },
        { label: 'Exam / Term', value: 'Term 1 Exam' },
      ],
      subjects: [
        { subject: 'English', marks: '71', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Mathematics', marks: '63', max: '/ 100', grade: 'B', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Science', missingBadge: 'badge badge-soft-danger', missingLabel: 'Not entered' },
        { subject: 'Social Science', marks: '69', max: '/ 100', grade: 'B', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Hindi', marks: '74', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
        { subject: 'Computer Science', marks: '77', max: '/ 100', grade: 'B+', gradeBadge: 'badge badge-soft-info ms-1' },
      ],
      bestWeakest: 'Computer Science 77 · Mathematics 63',
      gradeChips: [
        { badge: 'badge badge-soft-info', label: 'B+ · 3 subjects' },
        { badge: 'badge badge-soft-info', label: 'B · 2 subjects' },
      ],
      gradeStats: [
        { label: 'Overall Grade', value: 'Withheld', badge: 'badge badge-soft-secondary' },
        { label: 'Remark', value: 'Placed once every subject is in' },
        { label: 'Performance Level', value: 'Under Review', badge: 'badge badge-soft-secondary' },
        { label: 'Subjects at Pass Mark', value: '5 of 5' },
        PASS_MARK,
      ],
      attendanceStats: [
        { label: 'Working Days', value: '96' },
        { label: 'Present', value: '81 days' },
        { label: 'Absent', value: '15 days' },
        { label: 'Late Marks', value: '6' },
        { label: 'Attendance', value: '84.4%', badge: 'badge badge-soft-danger' },
        { label: 'Band', value: 'Concern' },
        { label: 'Teaching Lost', value: '90 periods' },
      ],
      remarks: [
        {
          id: 'r1',
          tint: 'bg-warning-transparent text-warning',
          teacher: 'Mrs. Kalpana Menon',
          meta: 'Academic Coordinator · 30 Jul 2026',
          text: 'No level can be placed while a subject is missing. Marks entry MRK-2026-0218 has been open since 21 Jul.',
        },
        {
          id: 'r2',
          tint: 'bg-info-transparent text-info',
          teacher: 'Ms. Meera Nair',
          meta: 'Class Teacher · 22 Jul 2026',
          text: 'Fifteen days missed in the term. Guardian meeting recorded on 22 Jul.',
        },
      ],
      strengths: ['Computer Science', 'Hindi'],
      improvements: ['Mathematics', 'Attendance'],
      focusStats: [
        { label: 'Improvement Plan', value: 'Not required' },
        {
          label: 'Growth',
          value: 'Not Placed',
          badge: 'badge badge-soft-secondary',
          badgeIcon: 'ti ti-minus',
        },
      ],
      meetings: [
        {
          id: 'm1',
          tint: 'bg-success-transparent text-success',
          icon: 'ti ti-calendar-check',
          title: 'Attendance review',
          meta: '22 Jul 2026 · Ms. Meera Nair',
          status: 'Held',
          statusBadge: 'badge badge-soft-success',
          text: 'Fifteen days missed. Guardians agreed to a fortnightly attendance note.',
        },
      ],
      meetingsHeld: '1 held',
      noteChips: ['1 subject missing', 'Level withheld'],
      note: 'Mr. Vikram Sethi holds the Class VI B practical register. The Science entry MRK-2026-0218 blocks both the report card and the level.',
      actions: [
        { label: 'Add Remark', icon: 'ti ti-writing', className: 'btn btn-primary btn-sm', modal: 'remarks' },
        { label: 'View Performance', icon: 'ti ti-eye', className: 'btn btn-outline-light bg-white btn-sm', modal: 'view' },
        { label: 'Performance Panel', icon: 'ti ti-chart-arrows', className: 'btn btn-outline-light bg-white btn-sm', panel: true },
      ],
    },
  },
];

/** The row-level icon buttons in the Actions column. */
export const rowActions: { id: string; icon: string; label: string; modal: PerformanceModalId; className: string }[] = [
  { id: 'view', icon: 'ti ti-eye', label: 'View performance', modal: 'view', className: 'dt-ib' },
  { id: 'compare', icon: 'ti ti-git-compare', label: 'Compare performance', modal: 'compare', className: 'dt-ib' },
  { id: 'remark', icon: 'ti ti-writing', label: 'Add teacher remark', modal: 'remarks', className: 'dt-ib' },
  { id: 'plan', icon: 'ti ti-target', label: 'Create improvement plan', modal: 'plan', className: 'dt-ib success' },
  { id: 'report', icon: 'ti ti-report', label: 'Generate report card', modal: 'reportCard', className: 'dt-ib' },
];

export const rowsPerPageOptions = ['8', '25', '50', '100'];

export const pageNumbers = ['1', '2', '3'];

export const lastPage = '149';
