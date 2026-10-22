export type Tone = 'up' | 'down' | 'flat';
export type RowTone = 'g' | 'w' | 'd';

export interface SelectOption {
  value: string;
  label: string;
}

/* ---------------------------------- KPIs --------------------------------- */

export interface KpiTile {
  id: string;
  tone: string;
  icon: string;
  label: string;
  kind: 'year' | 'count' | 'text';
  count?: number;
  suffix?: string;
  yearSuffix?: string;
  text?: string;
  footSub?: string;
  delta?: { label: string; icon: string; tone: Tone };
  barWidth?: number;
  sparkline?: boolean;
}

export const kpiTiles: KpiTile[] = [
  {
    id: 'year',
    tone: 'promotion-tone-primary',
    icon: 'ti ti-calendar-stats',
    label: 'Academic Year',
    kind: 'year',
    text: '2024',
    yearSuffix: '/25',
    footSub: 'Session: Term-end Promotion',
    delta: { label: 'Active', icon: 'ti ti-clock', tone: 'flat' },
  },
  {
    id: 'eligible',
    tone: 'promotion-tone-info',
    icon: 'ti ti-users',
    label: 'Total Eligible',
    kind: 'count',
    count: 1102,
    barWidth: 89,
  },
  {
    id: 'completed',
    tone: 'promotion-tone-success',
    icon: 'ti ti-checks',
    label: 'Promotion Completed',
    kind: 'count',
    count: 847,
    footSub: 'of 1,102 eligible',
    delta: { label: '+12%', icon: 'ti ti-trending-up', tone: 'up' },
  },
  {
    id: 'pending',
    tone: 'promotion-tone-warning',
    icon: 'ti ti-clipboard-list',
    label: 'Pending Review',
    kind: 'count',
    count: 169,
    footSub: 'Awaiting decision',
    delta: { label: '-4%', icon: 'ti ti-trending-down', tone: 'down' },
  },
  {
    id: 'detained',
    tone: 'promotion-tone-danger',
    icon: 'ti ti-user-x',
    label: 'Students Detained',
    kind: 'count',
    count: 86,
    footSub: 'Held back this term',
    delta: { label: '0%', icon: 'ti ti-minus', tone: 'flat' },
  },
  {
    id: 'graduation',
    tone: 'promotion-tone-purple',
    icon: 'ti ti-school',
    label: 'Graduation Eligible',
    kind: 'count',
    count: 132,
    footSub: 'Grade XII cohort',
    delta: { label: '+6%', icon: 'ti ti-trending-up', tone: 'up' },
  },
  {
    id: 'success',
    tone: 'promotion-tone-success',
    icon: 'ti ti-percentage',
    label: 'Promotion Success',
    kind: 'count',
    count: 92.4,
    suffix: '%',
    barWidth: 92,
  },
  {
    id: 'trend',
    tone: 'promotion-tone-info',
    icon: 'ti ti-chart-line',
    label: 'Trend (6 sessions)',
    kind: 'text',
    text: 'Rising',
    sparkline: true,
  },
];

/* --------------------------------- Wizard --------------------------------- */

export interface WizardStepDef {
  step: number;
  title: string;
  sub: string;
}

export const wizardSteps: WizardStepDef[] = [
  { step: 1, title: 'Academic Year', sub: 'Select session' },
  { step: 2, title: 'Class & Section', sub: 'Map classes' },
  { step: 3, title: 'Review Students', sub: 'Eligibility' },
  { step: 4, title: 'Confirm', sub: 'Finalize' },
];

export interface YearCard {
  id: string;
  label: string;
  sub: string;
  current?: boolean;
}

export const yearCards: YearCard[] = [
  { id: '2024-26', label: '2024 - 2025', sub: 'Current session · promote from here', current: true },
  { id: '2023-24', label: '2023 - 2024', sub: 'Previous session · archived' },
  { id: '2025-26', label: '2025 - 2026', sub: 'Target session · new enrollment' },
];

export const fromClassOptions = ['Grade III', 'Grade IV', 'Grade V'];
export const fromSectionOptions = ['A', 'B', 'C'];
export const toClassOptions = ['Grade IV', 'Grade V', 'Grade VI'];
export const toSectionOptions = ['Auto-assign', 'A', 'B', 'C'];

/* ---------------------------- Class overview ------------------------------ */

export interface OverviewBlock {
  id: string;
  tone: string;
  icon: string;
  value: string;
  label: string;
}

export const overviewBlocks: OverviewBlock[] = [
  { id: 'strength', tone: 'promotion-tone-primary', icon: 'ti ti-users', value: '42', label: 'Current Strength' },
  { id: 'seats', tone: 'promotion-tone-success', icon: 'ti ti-door', value: '8', label: 'Available Seats' },
  { id: 'capacity', tone: 'promotion-tone-info', icon: 'ti ti-stack-2', value: '50', label: 'Promotion Capacity' },
  { id: 'teacher', tone: 'promotion-tone-warning', icon: 'ti ti-user-star', value: 'Ms. Teresa Susan', label: 'Class Teacher' },
  { id: 'ay', tone: 'promotion-tone-purple', icon: 'ti ti-calendar', value: '2024-26', label: 'Academic Year' },
  { id: 'avgperf', tone: 'promotion-tone-success', icon: 'ti ti-award', value: '84%', label: 'Avg Performance' },
  { id: 'attendance', tone: 'promotion-tone-info', icon: 'ti ti-calendar-check', value: '91%', label: 'Attendance' },
  { id: 'target', tone: 'promotion-tone-primary', icon: 'ti ti-arrow-badge-up', value: 'Grade IV', label: 'Target Class' },
  { id: 'feepending', tone: 'promotion-tone-warning', icon: 'ti ti-alert-triangle', value: '3', label: 'Fee Pending' },
  { id: 'atrisk', tone: 'promotion-tone-danger', icon: 'ti ti-user-x', value: '2', label: 'At Risk' },
];

export const readinessScore = 88;
export const readinessText =
  '37 of 42 students meet all promotion criteria. 3 need fee clearance, 2 flagged for academic review.';

/* ------------------------------- AI insights ------------------------------ */

export interface AiInsightCard {
  id: string;
  tone: string;
  icon: string;
  title: string;
  text: string;
}

export const aiInsightCards: AiInsightCard[] = [
  {
    id: 'prediction',
    tone: 'promotion-tone-success',
    icon: 'ti ti-chart-arrows-vertical',
    title: 'Promotion Prediction',
    text: '37 of 42 students predicted to promote successfully (88% confidence).',
  },
  {
    id: 'atrisk',
    tone: 'promotion-tone-danger',
    icon: 'ti ti-alert-hexagon',
    title: 'Students at Risk',
    text: '2 students below academic threshold — Daniel & Aaron need remedial review.',
  },
  {
    id: 'top',
    tone: 'promotion-tone-primary',
    icon: 'ti ti-star',
    title: 'Top Performers',
    text: 'Janet, Joann & Emeley rank in the top 10% — recommend honor section.',
  },
  {
    id: 'attendance',
    tone: 'promotion-tone-warning',
    icon: 'ti ti-calendar-x',
    title: 'Attendance Warning',
    text: '1 student below 75% attendance — Aaron at 68%, requires review.',
  },
  {
    id: 'fees',
    tone: 'promotion-tone-danger',
    icon: 'ti ti-cash-off',
    title: 'Fee Defaulters',
    text: '3 students with pending dues totalling $4,200 — block auto-promotion.',
  },
  {
    id: 'trends',
    tone: 'promotion-tone-info',
    icon: 'ti ti-trending-up',
    title: 'Academic Trends',
    text: 'Class average up 6% vs last term; Mathematics leads the improvement.',
  },
];

export interface AiAction {
  id: string;
  icon: string;
  text: string;
  buttonLabel: string;
  buttonIcon: string;
  primary?: boolean;
  action: string;
}

export const aiActions: AiAction[] = [
  {
    id: 'autoselect',
    icon: 'ti ti-wand',
    text: 'Auto-select all eligible students (37) and set target class to Grade IV.',
    buttonLabel: 'Apply',
    buttonIcon: 'ti ti-check',
    primary: true,
    action: 'ai_autoselect',
  },
  {
    id: 'notify',
    icon: 'ti ti-mail-forward',
    text: 'Notify parents of 3 fee-pending students before promotion.',
    buttonLabel: 'Send',
    buttonIcon: 'ti ti-send',
    action: 'notify',
  },
];

/* --------------------------------- Filters --------------------------------- */

export type WiredFilter = 'att' | 'perf' | 'fee' | 'status';

export interface FilterField {
  id: string;
  label: string;
  options: SelectOption[];
  wired?: WiredFilter;
}

export const filterFields: FilterField[] = [
  {
    id: 'academic-year',
    label: 'Academic Year',
    options: [
      { value: '2024 - 2025', label: '2024 - 2025' },
      { value: '2023 - 2024', label: '2023 - 2024' },
    ],
  },
  {
    id: 'current-class',
    label: 'Current Class',
    options: [
      { value: 'Grade III', label: 'Grade III' },
      { value: 'Grade IV', label: 'Grade IV' },
    ],
  },
  {
    id: 'target-class',
    label: 'Target Class',
    options: [
      { value: 'Grade IV', label: 'Grade IV' },
      { value: 'Grade V', label: 'Grade V' },
    ],
  },
  {
    id: 'section',
    label: 'Section',
    options: [
      { value: 'All Sections', label: 'All Sections' },
      { value: 'A', label: 'A' },
      { value: 'B', label: 'B' },
    ],
  },
  {
    id: 'attendance-range',
    label: 'Attendance Range',
    wired: 'att',
    options: [
      { value: 'all', label: 'All' },
      { value: 'high', label: 'Above 90%' },
      { value: 'mid', label: '75-90%' },
      { value: 'low', label: 'Below 75%' },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    wired: 'perf',
    options: [
      { value: 'all', label: 'All' },
      { value: 'top', label: 'Top' },
      { value: 'avg', label: 'Average' },
      { value: 'risk', label: 'At Risk' },
    ],
  },
  {
    id: 'fee-status',
    label: 'Fee Status',
    wired: 'fee',
    options: [
      { value: 'all', label: 'All' },
      { value: 'paid', label: 'Paid' },
      { value: 'pending', label: 'Pending' },
    ],
  },
  {
    id: 'promotion-status',
    label: 'Promotion Status',
    wired: 'status',
    options: [
      { value: 'all', label: 'All' },
      { value: 'eligible', label: 'Eligible' },
      { value: 'review', label: 'Needs Review' },
      { value: 'detained', label: 'Detained' },
    ],
  },
  {
    id: 'house',
    label: 'House',
    options: [
      { value: 'All Houses', label: 'All Houses' },
      { value: 'Red', label: 'Red' },
      { value: 'Blue', label: 'Blue' },
      { value: 'Green', label: 'Green' },
      { value: 'Yellow', label: 'Yellow' },
    ],
  },
  {
    id: 'scholarship',
    label: 'Scholarship',
    options: [
      { value: 'All', label: 'All' },
      { value: 'Scholarship', label: 'Scholarship' },
      { value: 'Non-Scholarship', label: 'Non-Scholarship' },
    ],
  },
];

/* ------------------------------ Student roster ----------------------------- */

export type RecommendationTone = 'eligible' | 'review' | 'risk' | 'lowatt' | 'graduated' | 'transfer';

export interface StudentRow {
  id: string;
  name: string;
  roll: string;
  house: string;
  img: string;
  currentClass: string;
  attendancePct: number;
  attendanceTone: RowTone;
  academicLabel: string;
  academicPct: number;
  academicTone: RowTone;
  behaviorLabel: string;
  behaviorPct: number;
  behaviorTone: RowTone;
  feeLabel: string;
  feeIcon: string;
  feeTone: 'eligible' | 'fee';
  recommendationLabel: string;
  recommendationIcon: string;
  recommendationTone: RecommendationTone;
  targetOptions: string[];
  defaultTargetIndex: number;
  dataAtt: 'high' | 'mid' | 'low';
  dataPerf: 'top' | 'avg' | 'risk';
  dataFee: 'paid' | 'pending';
  dataStatus: 'eligible' | 'fee' | 'risk' | 'lowatt' | 'graduated' | 'transfer';
}

export const studentRows: StudentRow[] = [
  {
    id: 'AD9892434',
    name: 'Janet Daniel',
    roll: '35013',
    house: 'Red House',
    img: 'assets/img/students/student-01.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 96,
    attendanceTone: 'g',
    academicLabel: 'A+ · 94',
    academicPct: 94,
    academicTone: 'g',
    behaviorLabel: 'Excellent',
    behaviorPct: 95,
    behaviorTone: 'g',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Promote',
    recommendationIcon: 'ti ti-arrow-up',
    recommendationTone: 'eligible',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 0,
    dataAtt: 'high',
    dataPerf: 'top',
    dataFee: 'paid',
    dataStatus: 'eligible',
  },
  {
    id: 'AD9892433',
    name: 'Joann Michael',
    roll: '35014',
    house: 'Blue House',
    img: 'assets/img/students/student-02.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 93,
    attendanceTone: 'g',
    academicLabel: 'A · 89',
    academicPct: 89,
    academicTone: 'g',
    behaviorLabel: 'Very Good',
    behaviorPct: 88,
    behaviorTone: 'g',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Promote',
    recommendationIcon: 'ti ti-arrow-up',
    recommendationTone: 'eligible',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 0,
    dataAtt: 'high',
    dataPerf: 'top',
    dataFee: 'paid',
    dataStatus: 'eligible',
  },
  {
    id: 'AD9892430',
    name: 'Emeley Karen',
    roll: '35015',
    house: 'Green House',
    img: 'assets/img/students/student-05.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 88,
    attendanceTone: 'w',
    academicLabel: 'B+ · 81',
    academicPct: 81,
    academicTone: 'w',
    behaviorLabel: 'Good',
    behaviorPct: 82,
    behaviorTone: 'g',
    feeLabel: '$1,400 Due',
    feeIcon: 'ti ti-cash-off',
    feeTone: 'fee',
    recommendationLabel: 'Needs Review',
    recommendationIcon: 'ti ti-alert-triangle',
    recommendationTone: 'review',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 0,
    dataAtt: 'mid',
    dataPerf: 'avg',
    dataFee: 'pending',
    dataStatus: 'fee',
  },
  {
    id: 'AD9892428',
    name: 'Daniel Josh',
    roll: '35016',
    house: 'Yellow House',
    img: 'assets/img/students/student-07.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 79,
    attendanceTone: 'w',
    academicLabel: 'D · 52',
    academicPct: 52,
    academicTone: 'd',
    behaviorLabel: 'Fair',
    behaviorPct: 64,
    behaviorTone: 'w',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Academic Risk',
    recommendationIcon: 'ti ti-alert-hexagon',
    recommendationTone: 'risk',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 1,
    dataAtt: 'mid',
    dataPerf: 'risk',
    dataFee: 'paid',
    dataStatus: 'risk',
  },
  {
    id: 'AD9892421',
    name: 'Aaron Kessler',
    roll: '35017',
    house: 'Red House',
    img: 'assets/img/students/student-09.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 68,
    attendanceTone: 'd',
    academicLabel: 'C · 61',
    academicPct: 61,
    academicTone: 'w',
    behaviorLabel: 'Fair',
    behaviorPct: 60,
    behaviorTone: 'w',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Low Attendance',
    recommendationIcon: 'ti ti-calendar-x',
    recommendationTone: 'lowatt',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 1,
    dataAtt: 'low',
    dataPerf: 'risk',
    dataFee: 'paid',
    dataStatus: 'lowatt',
  },
  {
    id: 'AD9892418',
    name: 'Ella Simpson',
    roll: '35018',
    house: 'Blue House',
    img: 'assets/img/students/student-11.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 94,
    attendanceTone: 'g',
    academicLabel: 'B · 77',
    academicPct: 77,
    academicTone: 'w',
    behaviorLabel: 'Good',
    behaviorPct: 84,
    behaviorTone: 'g',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Promote',
    recommendationIcon: 'ti ti-arrow-up',
    recommendationTone: 'eligible',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 0,
    dataAtt: 'high',
    dataPerf: 'avg',
    dataFee: 'paid',
    dataStatus: 'eligible',
  },
  {
    id: 'AD9892415',
    name: 'Marcus Lee',
    roll: '35019',
    house: 'Green House',
    img: 'assets/img/students/student-13.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 97,
    attendanceTone: 'g',
    academicLabel: 'A+ · 96',
    academicPct: 96,
    academicTone: 'g',
    behaviorLabel: 'Excellent',
    behaviorPct: 97,
    behaviorTone: 'g',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Graduated',
    recommendationIcon: 'ti ti-school',
    recommendationTone: 'graduated',
    targetOptions: ['Grade IV', 'Retain III'],
    defaultTargetIndex: 0,
    dataAtt: 'high',
    dataPerf: 'top',
    dataFee: 'paid',
    dataStatus: 'graduated',
  },
  {
    id: 'AD9892410',
    name: 'Sophia Ray',
    roll: '35020',
    house: 'Yellow House',
    img: 'assets/img/students/student-03.jpg',
    currentClass: 'Grade III-A',
    attendancePct: 85,
    attendanceTone: 'w',
    academicLabel: 'B · 78',
    academicPct: 78,
    academicTone: 'w',
    behaviorLabel: 'Good',
    behaviorPct: 80,
    behaviorTone: 'g',
    feeLabel: 'Paid',
    feeIcon: 'ti ti-circle-check',
    feeTone: 'eligible',
    recommendationLabel: 'Transfer',
    recommendationIcon: 'ti ti-transfer',
    recommendationTone: 'transfer',
    targetOptions: ['Grade IV', 'Transfer Out'],
    defaultTargetIndex: 1,
    dataAtt: 'mid',
    dataPerf: 'avg',
    dataFee: 'paid',
    dataStatus: 'transfer',
  },
];

/** A roster row plus the per-row state the table mutates (selection, target class, remark). */
export interface PromotionRowState extends StudentRow {
  selected: boolean;
  target: string;
  remark: string;
}

export const toPromotionRowState = (row: StudentRow): PromotionRowState => ({
  ...row,
  selected: false,
  target: row.targetOptions[row.defaultTargetIndex] ?? row.targetOptions[0],
  remark: '',
});

export const tableHeaders = [
  'Student',
  'Admission No',
  'Roll No',
  'Current Class',
  'Attendance',
  'Academic',
  'Behavior',
  'Fee Status',
  'Recommendation',
  'Target Class',
  'Remarks',
  'Action',
];

/* -------------------------------- Bulk bar --------------------------------- */

export interface BulkAction {
  id: string;
  action: string;
  label: string;
  icon: string;
  variant: 'go' | 'stop' | 'default';
}

export const bulkActions: BulkAction[] = [
  { id: 'promote', action: 'bulk_promote', label: 'Promote', icon: 'ti ti-arrow-up', variant: 'go' },
  { id: 'detain', action: 'bulk_detain', label: 'Detain', icon: 'ti ti-user-x', variant: 'stop' },
  { id: 'section', action: 'assign_section', label: 'Assign Section', icon: 'ti ti-layout-grid', variant: 'default' },
  { id: 'house', action: 'assign_house', label: 'Assign House', icon: 'ti ti-home', variant: 'default' },
  { id: 'roll', action: 'assign_roll', label: 'Roll Numbers', icon: 'ti ti-list-numbers', variant: 'default' },
  { id: 'ids', action: 'gen_ids', label: 'Student IDs', icon: 'ti ti-id', variant: 'default' },
  { id: 'export', action: 'export', label: 'Export', icon: 'ti ti-file-export', variant: 'default' },
  { id: 'print', action: 'print', label: 'Print', icon: 'ti ti-printer', variant: 'default' },
  { id: 'notify', action: 'notify', label: 'Notify Parents', icon: 'ti ti-bell', variant: 'default' },
];

/* -------------------------------- Analytics --------------------------------- */

export const donutPromotionPct = 92;
export const donutDetainedPct = 8;

export interface BarItem {
  label: string;
  value: number;
  alt?: boolean;
}

export const classWiseBars: BarItem[] = [
  { label: 'III', value: 96, alt: true },
  { label: 'IV', value: 92 },
  { label: 'V', value: 89, alt: true },
  { label: 'VI', value: 94 },
  { label: 'VII', value: 90, alt: true },
];

export interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

export const genderDistribution: DistributionItem[] = [
  { label: 'Boys', value: 91, color: '#3d5ee1' },
  { label: 'Girls', value: 94, color: '#7b61ff' },
];

export const performanceDistribution: DistributionItem[] = [
  { label: 'Distinction', value: 28, color: '#16a34a' },
  { label: 'First Class', value: 46, color: '#0891b2' },
  { label: 'Pass', value: 18, color: '#d97706' },
  { label: 'At Risk', value: 8, color: '#dc2626' },
];

/* --------------------------------- Step 4 ----------------------------------- */

export const step4Checklist: string[] = [
  'All fee-pending students reviewed & parents notified',
  'Target class capacity verified',
  'Academic-risk students flagged for retention',
  'Section & roll-number mapping confirmed',
];

export const confirmModalChecklist: { icon: string; text: string }[] = [
  { icon: 'ti ti-door', text: 'Seat availability confirmed — 8 seats free in Grade IV (capacity 50)' },
  { icon: 'ti ti-users', text: 'Promotion summary: 37 promoted, 2 retained, 3 flagged' },
  { icon: 'ti ti-bell', text: 'Parent notifications will be sent automatically' },
];

/* ---------------------------- Recent promotions ----------------------------- */

export type TimelineCategory = 'promoted' | 'graduated' | 'detained';

export interface TimelineEntry {
  id: string;
  cat: TimelineCategory;
  tone: string;
  icon: string;
  title: string;
  route: string;
  badge: { label: string; tone: 'eligible' | 'graduated' | 'review'; icon: string };
  avatars: string[];
  extra: string;
  approvedLabel: string;
  approvedBy: string;
  num: string;
  date: string;
}

export const timelineFilters: { id: 'all' | TimelineCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'promoted', label: 'Promoted' },
  { id: 'graduated', label: 'Graduated' },
  { id: 'detained', label: 'Detained' },
];

export const timelineEntries: TimelineEntry[] = [
  {
    id: 'tl-1',
    cat: 'promoted',
    tone: 'promotion-tone-success',
    icon: 'ti ti-arrow-up',
    title: 'Batch of 57 students',
    route: 'III-A → IV-A',
    badge: { label: 'Completed', tone: 'eligible', icon: 'ti ti-circle-check' },
    avatars: [
      'assets/img/students/student-01.jpg',
      'assets/img/students/student-02.jpg',
      'assets/img/students/student-05.jpg',
    ],
    extra: '+54',
    approvedLabel: 'Approved by',
    approvedBy: 'Kevin Larry',
    num: '57',
    date: 'Today, 10:24 AM',
  },
  {
    id: 'tl-2',
    cat: 'promoted',
    tone: 'promotion-tone-info',
    icon: 'ti ti-arrow-up',
    title: 'Batch of 44 students',
    route: 'IV-B → V-B',
    badge: { label: 'Completed', tone: 'eligible', icon: 'ti ti-circle-check' },
    avatars: [
      'assets/img/students/student-07.jpg',
      'assets/img/students/student-09.jpg',
      'assets/img/students/student-11.jpg',
    ],
    extra: '+41',
    approvedLabel: 'Approved by',
    approvedBy: 'Teresa Susan',
    num: '44',
    date: 'Yesterday, 03:10 PM',
  },
  {
    id: 'tl-3',
    cat: 'graduated',
    tone: 'promotion-tone-purple',
    icon: 'ti ti-school',
    title: 'Batch of 132 students',
    route: 'Grade XII → Graduated',
    badge: { label: 'Graduated', tone: 'graduated', icon: 'ti ti-award' },
    avatars: [
      'assets/img/students/student-13.jpg',
      'assets/img/students/student-03.jpg',
      'assets/img/students/student-01.jpg',
    ],
    extra: '+129',
    approvedLabel: 'Approved by',
    approvedBy: 'Admin Office',
    num: '132',
    date: '18 Nov, 09:00 AM',
  },
  {
    id: 'tl-4',
    cat: 'detained',
    tone: 'promotion-tone-warning',
    icon: 'ti ti-user-x',
    title: '6 students detained',
    route: 'VII-A retained',
    badge: { label: 'Under Review', tone: 'review', icon: 'ti ti-clock' },
    avatars: ['assets/img/students/student-02.jpg', 'assets/img/students/student-05.jpg'],
    extra: '+4',
    approvedLabel: 'Flagged by',
    approvedBy: 'Rita Owen',
    num: '6',
    date: '15 Nov, 11:45 AM',
  },
  {
    id: 'tl-5',
    cat: 'promoted',
    tone: 'promotion-tone-success',
    icon: 'ti ti-arrow-up',
    title: 'Batch of 39 students',
    route: 'V-A → VI-A',
    badge: { label: 'Completed', tone: 'eligible', icon: 'ti ti-circle-check' },
    avatars: ['assets/img/students/student-09.jpg', 'assets/img/students/student-13.jpg'],
    extra: '+37',
    approvedLabel: 'Approved by',
    approvedBy: 'Kevin Larry',
    num: '39',
    date: '12 Nov, 02:30 PM',
  },
];

export const reportSummary = [
  { id: 'batches', tone: 'promotion-tone-primary', icon: 'ti ti-stack-2', count: 18, label: 'Batches Processed' },
  { id: 'promoted', tone: 'promotion-tone-success', icon: 'ti ti-arrow-up', count: 847, label: 'Students Promoted' },
  { id: 'graduated', tone: 'promotion-tone-purple', icon: 'ti ti-school', count: 132, label: 'Graduated' },
  { id: 'detained', tone: 'promotion-tone-warning', icon: 'ti ti-user-x', count: 86, label: 'Detained' },
];

/* ---------------------------------- Toasts ---------------------------------- */

export type ToastTone = 'success' | 'danger' | 'info' | 'warning';

export const actionToasts: Record<string, { message: (n: number) => string; tone: ToastTone }> = {
  ai_autoselect: { message: () => 'AI auto-selected all eligible students.', tone: 'success' },
  bulk_promote: { message: (n) => `${n} student(s) marked for promotion.`, tone: 'success' },
  bulk_detain: { message: (n) => `${n} student(s) marked as detained.`, tone: 'warning' },
  assign_section: { message: (n) => `Section assigned to ${n} student(s).`, tone: 'info' },
  assign_house: { message: (n) => `House assigned to ${n} student(s).`, tone: 'info' },
  assign_roll: { message: (n) => `Roll numbers generated for ${n} student(s).`, tone: 'success' },
  gen_ids: { message: (n) => `Student ID cards generated for ${n} student(s).`, tone: 'success' },
  notify: { message: () => 'Parent notifications sent.', tone: 'success' },
  report: { message: () => 'Generating promotion report…', tone: 'info' },
  export: { message: () => 'Exporting promotion list…', tone: 'info' },
  import: { message: () => 'Opening student import…', tone: 'info' },
  reset_filters: { message: () => 'Filters reset.', tone: 'info' },
  finalize: { message: () => 'Promotion completed — students enrolled into 2025-2026.', tone: 'success' },
};
