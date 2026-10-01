export type ExamTypeStatus = 'Active' | 'Draft' | 'Archived';

export type AssessmentCategory =
  | 'Formative'
  | 'Summative'
  | 'Practical'
  | 'Continuous'
  | 'Oral'
  | 'Internal'
  | 'Remedial';

/**
 * The template's dialog ids — `config_settings`, `edit_config`, `add_item`, `edit_item` and
 * `delete_modal` — normalised into one union.
 */
export type ExamTypeModalId = 'add' | 'edit' | 'config' | 'editConfig' | 'delete';

export type GroupByKey = 'category' | 'term' | 'classGroup' | 'status';

export type SortKey = 'name' | 'code' | 'weightage' | 'category' | 'recent';

export type QuickFilterId = 'active' | 'summative' | 'formative' | 'practical' | 'draft' | 'archived';

export type FilterKey =
  | 'academicYear'
  | 'assessmentCategory'
  | 'status'
  | 'term'
  | 'applicableClasses'
  | 'weightage'
  | 'gradingSystem'
  | 'practicalComponent';

export interface ExamType {
  id: string;
  name: string;
  /** The `badge-soft-bordered` pill under the title, e.g. "QE-04". */
  code: string;
  /** The avatar's tone pair, e.g. "bg-primary-transparent text-primary". */
  avatarClass: string;
  icon: string;
  /** The weightage bar's colour. Assignment pairs a light avatar with `bg-dark`. */
  barClass: string;
  status: ExamTypeStatus;
  statusBadge: string;
  /** The muted line under the pills, e.g. "Formative Assessment". */
  categoryLabel: string;
  category: AssessmentCategory;
  /** The template pads the stat trio — "09", not "9". */
  totalMarks: string;
  passMarks: string;
  duration: string;
  weightage: number;
  /** Also padded — "05%", not "5%". */
  weightageLabel: string;
  academicYear: string;
  term: string;
  classGroup: string;
  gradingSystem: string;
  practicalComponent: string;
  /** Seeds the Edit Exam Type dialog's textarea; the fourth card's copy is the template's. */
  description: string;
  /** Lower-cased haystack the search box matches against. */
  search: string;
}

const haystack = (row: Omit<ExamType, 'search'>) =>
  [
    row.name,
    row.code,
    row.categoryLabel,
    row.status,
    row.term,
    row.classGroup,
    row.gradingSystem,
    row.duration,
    row.description,
  ]
    .join(' ')
    .toLowerCase();

const withSearch = (rows: Omit<ExamType, 'search'>[]): ExamType[] =>
  rows.map((row) => ({ ...row, search: haystack(row) }));

export const examTypes: ExamType[] = withSearch([
  {
    id: 'et_01',
    name: 'Unit Test',
    code: 'UT-01',
    avatarClass: 'bg-primary-transparent text-primary',
    icon: 'ti ti-pencil-check',
    barClass: 'bg-primary',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Formative Assessment',
    category: 'Formative',
    totalMarks: '25',
    passMarks: '09',
    duration: '45m',
    weightage: 10,
    weightageLabel: '10%',
    academicYear: '2026 / 2027',
    term: 'Full Year',
    classGroup: 'Middle (VI – VIII)',
    gradingSystem: 'Percentage',
    practicalComponent: 'Not applicable',
    description: 'Short chapter-level check conducted at the close of every teaching unit.',
  },
  {
    id: 'et_02',
    name: 'Weekly Test',
    code: 'WT-02',
    avatarClass: 'bg-info-transparent text-info',
    icon: 'ti ti-calendar-week',
    barClass: 'bg-info',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Continuous Assessment',
    category: 'Continuous',
    totalMarks: '20',
    passMarks: '07',
    duration: '30m',
    weightage: 5,
    weightageLabel: '05%',
    academicYear: '2026 / 2027',
    term: 'Full Year',
    classGroup: 'Primary (I – V)',
    gradingSystem: 'Percentage',
    practicalComponent: 'Not applicable',
    description: 'Weekly recap of the topics covered in class, marked by the subject teacher.',
  },
  {
    id: 'et_03',
    name: 'Monthly Test',
    code: 'MT-03',
    avatarClass: 'bg-warning-transparent text-warning',
    icon: 'ti ti-calendar-month',
    barClass: 'bg-warning',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Formative Assessment',
    category: 'Formative',
    totalMarks: '50',
    passMarks: '18',
    duration: '1h 30m',
    weightage: 10,
    weightageLabel: '10%',
    academicYear: '2026 / 2027',
    term: 'Full Year',
    classGroup: 'Middle (VI – VIII)',
    gradingSystem: 'Percentage',
    practicalComponent: 'Not applicable',
    description: 'Consolidated monthly assessment covering the syllabus taught that month.',
  },
  {
    id: 'et_04',
    name: 'Quarterly Exam',
    code: 'QE-04',
    avatarClass: 'bg-purple-transparent text-purple',
    icon: 'ti ti-clipboard-text',
    barClass: 'bg-purple',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Summative Assessment',
    category: 'Summative',
    totalMarks: '100',
    passMarks: '35',
    duration: '3h',
    weightage: 15,
    weightageLabel: '15%',
    academicYear: '2026 / 2027',
    term: 'Term I',
    classGroup: 'Secondary (IX – X)',
    gradingSystem: 'CBSE 8-Point',
    practicalComponent: 'Required',
    /* The Edit Exam Type dialog ships this sentence — `exam-types.html` L2955. */
    description: 'Term-end summative assessment conducted at the close of the first quarter.',
  },
  {
    id: 'et_05',
    name: 'Half-Yearly Exam',
    code: 'HY-05',
    avatarClass: 'bg-teal-transparent text-teal',
    icon: 'ti ti-book-2',
    barClass: 'bg-teal',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Summative Assessment',
    category: 'Summative',
    totalMarks: '100',
    passMarks: '35',
    duration: '3h',
    weightage: 20,
    weightageLabel: '20%',
    academicYear: '2026 / 2027',
    term: 'Term I',
    classGroup: 'Secondary (IX – X)',
    gradingSystem: 'CBSE 8-Point',
    practicalComponent: 'Required',
    description: 'Mid-session examination covering the first half of the annual syllabus.',
  },
  {
    id: 'et_06',
    name: 'Annual Examination',
    code: 'AE-06',
    avatarClass: 'bg-danger-transparent text-danger',
    icon: 'ti ti-certificate',
    barClass: 'bg-danger',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Summative Assessment',
    category: 'Summative',
    totalMarks: '100',
    passMarks: '35',
    duration: '3h',
    weightage: 25,
    weightageLabel: '25%',
    academicYear: '2026 / 2027',
    term: 'Term II',
    classGroup: 'Senior (XI – XII)',
    gradingSystem: 'CBSE 8-Point',
    practicalComponent: 'Required',
    description: 'Final examination of the session, decisive for promotion to the next grade.',
  },
  {
    id: 'et_07',
    name: 'Practical Exam',
    code: 'PE-07',
    avatarClass: 'bg-skyblue-transparent text-skyblue',
    icon: 'ti ti-flask',
    barClass: 'bg-skyblue',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Practical Assessment',
    category: 'Practical',
    totalMarks: '30',
    passMarks: '12',
    duration: '2h',
    weightage: 10,
    weightageLabel: '10%',
    academicYear: '2026 / 2027',
    term: 'Term II',
    classGroup: 'Senior (XI – XII)',
    gradingSystem: 'Percentage',
    practicalComponent: 'Required',
    description: 'Laboratory assessment held under an external examiner with a record book.',
  },
  {
    id: 'et_08',
    name: 'Viva Voce',
    code: 'VV-08',
    avatarClass: 'bg-pink-transparent text-pink',
    icon: 'ti ti-microphone-2',
    barClass: 'bg-pink',
    status: 'Draft',
    statusBadge: 'badge-soft-warning',
    categoryLabel: 'Oral Assessment',
    category: 'Oral',
    totalMarks: '20',
    passMarks: '08',
    duration: '15m',
    weightage: 5,
    weightageLabel: '05%',
    academicYear: '2026 / 2027',
    term: 'Term II',
    classGroup: 'Senior (XI – XII)',
    gradingSystem: 'Pass / Fail',
    practicalComponent: 'Optional',
    description: 'Oral examination conducted alongside the practical to test understanding.',
  },
  {
    id: 'et_09',
    name: 'Project Evaluation',
    code: 'PJ-09',
    avatarClass: 'bg-secondary-transparent text-secondary',
    icon: 'ti ti-presentation',
    barClass: 'bg-secondary',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Internal Assessment',
    category: 'Internal',
    totalMarks: '40',
    passMarks: '16',
    duration: 'Term',
    weightage: 5,
    weightageLabel: '05%',
    academicYear: '2026 / 2027',
    term: 'Full Year',
    classGroup: 'Middle (VI – VIII)',
    gradingSystem: 'Percentage',
    practicalComponent: 'Optional',
    description: 'Term-long project marked on submission, presentation and portfolio work.',
  },
  {
    id: 'et_10',
    name: 'Assignment',
    code: 'AS-10',
    avatarClass: 'bg-light-transparent text-dark',
    icon: 'ti ti-notebook',
    barClass: 'bg-dark',
    status: 'Archived',
    statusBadge: 'badge-soft-danger',
    categoryLabel: 'Continuous Assessment',
    category: 'Continuous',
    totalMarks: '10',
    passMarks: '04',
    duration: 'Weekly',
    weightage: 5,
    weightageLabel: '05%',
    academicYear: '2026 / 2027',
    term: 'Full Year',
    classGroup: 'Primary (I – V)',
    gradingSystem: 'Pass / Fail',
    practicalComponent: 'Not applicable',
    description: 'Homework assignment retired from the current session in favour of portfolios.',
  },
  {
    id: 'et_11',
    name: 'Pre-Board Exam',
    code: 'PB-11',
    avatarClass: 'bg-success-transparent text-success',
    icon: 'ti ti-clipboard-list',
    barClass: 'bg-success',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Summative Assessment',
    category: 'Summative',
    totalMarks: '100',
    passMarks: '35',
    duration: '3h',
    weightage: 15,
    weightageLabel: '15%',
    academicYear: '2026 / 2027',
    term: 'Term II',
    classGroup: 'Senior (XI – XII)',
    gradingSystem: 'CBSE 8-Point',
    practicalComponent: 'Required',
    description: 'Board pattern rehearsal held before the external examination.',
  },
  {
    id: 'et_12',
    name: 'Remedial Test',
    code: 'RT-12',
    avatarClass: 'bg-primary-transparent text-primary',
    icon: 'ti ti-repeat',
    barClass: 'bg-primary',
    status: 'Active',
    statusBadge: 'badge-soft-success',
    categoryLabel: 'Remedial Assessment',
    category: 'Remedial',
    totalMarks: '25',
    passMarks: '10',
    duration: '1h',
    weightage: 5,
    weightageLabel: '05%',
    academicYear: '2026 / 2027',
    term: 'Full Year',
    classGroup: 'Secondary (IX – X)',
    gradingSystem: 'Pass / Fail',
    practicalComponent: 'Not applicable',
    description: 'Re-assessment offered to students who fall short of the pass mark.',
  },
]);

/* -------------------------------------------------------------------------- */
/*                                   Toolbar                                  */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  /** `null` is the unfiltered "All Exam Types" entry. */
  id: QuickFilterId | null;
  label: string;
  icon: string;
}

/** `exam-types.html` L1486–1493. */
export const savedViews: SavedView[] = [
  { id: null, label: 'All Exam Types', icon: 'ti ti-layout-list' },
  { id: 'active', label: 'Active Types', icon: 'ti ti-circle-check' },
  { id: 'summative', label: 'Summative Only', icon: 'ti ti-scale' },
  { id: 'draft', label: 'Drafts', icon: 'ti ti-pencil' },
  { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
];

export interface QuickFilter {
  id: QuickFilterId;
  label: string;
  icon: string;
}

/** `exam-types.html` L1593–1598. */
export const quickFilters: QuickFilter[] = [
  { id: 'active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'summative', label: 'Summative', icon: 'ti ti-scale' },
  { id: 'formative', label: 'Formative', icon: 'ti ti-progress' },
  { id: 'practical', label: 'Practical', icon: 'ti ti-flask' },
  { id: 'draft', label: 'Draft', icon: 'ti ti-pencil' },
  { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
];

/** Three of the quick filters read the status pill, three read the assessment category. */
export const matchesQuickFilter = (row: ExamType, id: QuickFilterId): boolean => {
  switch (id) {
    case 'active':
      return row.status === 'Active';
    case 'draft':
      return row.status === 'Draft';
    case 'archived':
      return row.status === 'Archived';
    case 'summative':
      return row.category === 'Summative';
    case 'formative':
      return row.category === 'Formative';
    case 'practical':
      return row.category === 'Practical';
    default:
      return true;
  }
};

export interface FilterField {
  key: FilterKey;
  label: string;
  domId: string;
  /** The Academic Year select is the one facet the template ships without an "All" option. */
  hasAll: boolean;
  options: string[];
}

/** `exam-types.html` L1504–1535. */
export const filterFields: FilterField[] = [
  {
    key: 'academicYear',
    label: 'Academic Year',
    domId: 'et-flt-academic-year',
    hasAll: false,
    options: ['2026 / 2027', '2025 / 2026', '2024 / 2025'],
  },
  {
    key: 'assessmentCategory',
    label: 'Assessment Category',
    domId: 'et-flt-assessment-category',
    hasAll: true,
    options: ['Formative', 'Summative', 'Practical', 'Continuous'],
  },
  {
    key: 'status',
    label: 'Status',
    domId: 'et-flt-status',
    hasAll: true,
    options: ['Active', 'Draft', 'Archived'],
  },
  {
    key: 'term',
    label: 'Term',
    domId: 'et-flt-term',
    hasAll: true,
    options: ['Term I', 'Term II', 'Full Year'],
  },
  {
    key: 'applicableClasses',
    label: 'Applicable Classes',
    domId: 'et-flt-applicable-classes',
    hasAll: true,
    options: ['Primary (I – V)', 'Middle (VI – VIII)', 'Secondary (IX – X)', 'Senior (XI – XII)'],
  },
  {
    key: 'weightage',
    label: 'Weightage',
    domId: 'et-flt-weightage',
    hasAll: true,
    options: ['Under 10%', '10% – 20%', 'Over 20%'],
  },
  {
    key: 'gradingSystem',
    label: 'Grading System',
    domId: 'et-flt-grading-system',
    hasAll: true,
    options: ['CBSE 8-Point', 'Percentage', 'Pass / Fail'],
  },
  {
    key: 'practicalComponent',
    label: 'Practical Component',
    domId: 'et-flt-practical-component',
    hasAll: true,
    options: ['Required', 'Optional', 'Not applicable'],
  },
];

/** The Weightage facet is a band rather than a value, so the row's percentage is bucketed. */
export const weightageBand = (weightage: number): string => {
  if (weightage < 10) return 'Under 10%';
  if (weightage <= 20) return '10% – 20%';
  return 'Over 20%';
};

export const matchesFilter = (row: ExamType, key: FilterKey, value: string): boolean => {
  switch (key) {
    case 'academicYear':
      return row.academicYear === value;
    case 'assessmentCategory':
      return row.category === value;
    case 'status':
      return row.status === value;
    case 'term':
      return row.term === value;
    case 'applicableClasses':
      return row.classGroup === value;
    case 'weightage':
      return weightageBand(row.weightage) === value;
    case 'gradingSystem':
      return row.gradingSystem === value;
    case 'practicalComponent':
      return row.practicalComponent === value;
    default:
      return true;
  }
};

/** The chips the template ships already applied — `exam-types.html` L1618–1619. */
export const initialFilters: Partial<Record<FilterKey, string>> = {
  academicYear: '2026 / 2027',
  status: 'Active',
};

export interface GroupByOption {
  key: GroupByKey;
  label: string;
  icon: string;
}

/** `exam-types.html` L1554–1557. Assessment Category ships marked active. */
export const groupByOptions: GroupByOption[] = [
  { key: 'category', label: 'Assessment Category', icon: 'ti ti-category' },
  { key: 'term', label: 'Term', icon: 'ti ti-calendar-stats' },
  { key: 'classGroup', label: 'Class Group', icon: 'ti ti-school' },
  { key: 'status', label: 'Status', icon: 'ti ti-circle-check' },
];

/** The heading a row falls under for the chosen grouping. */
export const groupValue = (row: ExamType, key: GroupByKey): string => {
  switch (key) {
    case 'category':
      return row.categoryLabel;
    case 'term':
      return row.term;
    case 'classGroup':
      return row.classGroup;
    case 'status':
      return row.status;
    default:
      return '';
  }
};

export interface SortOption {
  key: SortKey;
  label: string;
  icon: string;
}

/** `exam-types.html` L1607–1611. "Recently updated" ships marked active. */
export const sortOptions: SortOption[] = [
  { key: 'name', label: 'Exam type name (A–Z)', icon: 'ti ti-abc' },
  { key: 'code', label: 'Short code', icon: 'ti ti-hash' },
  { key: 'weightage', label: 'Weightage', icon: 'ti ti-chart-pie' },
  { key: 'category', label: 'Assessment category', icon: 'ti ti-category' },
  { key: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

export interface ExportAction {
  id: string;
  label: string;
  icon: string;
}

/** `exam-types.html` L1573–1575. */
export const exportActions: ExportAction[] = [
  { id: 'export_pdf', label: 'PDF Document', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Excel Workbook', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'CSV File', icon: 'ti ti-file-type-csv' },
];

export interface CardMenuItem {
  id: string;
  label: string;
  icon: string;
  modal?: ExamTypeModalId;
  danger?: boolean;
  /** The template puts a divider above the last entry. */
  divider?: boolean;
}

/** `exam-types.html` L1659–1664 — repeated verbatim on all twelve cards. */
export const cardMenuItems: CardMenuItem[] = [
  { id: 'view', label: 'View Exam Type', icon: 'ti ti-eye', modal: 'config' },
  { id: 'edit', label: 'Edit', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive', modal: 'delete', danger: true, divider: true },
];

export const actionToasts: Record<string, string> = {
  refresh: 'Exam type list refreshed.',
  save_view: 'Current filters saved as a new view.',
  apply_filters: 'Filters applied.',
  clear_filters: 'Filters cleared.',
  group_by: 'Exam types regrouped.',
  clear_grouping: 'Grouping cleared.',
  duplicate: 'Exam type duplicated as a draft.',
  print: 'Sending the exam types to the printer…',
  import: 'Choose a file to import exam types from.',
  export_pdf: 'PDF export queued for download.',
  export_excel: 'Excel workbook queued for download.',
  export_csv: 'Preparing export…',
  catalogue: 'Opening the exam type catalogue…',
  config_print: 'Sending the configuration sheet to the printer…',
  created: 'Exam type created.',
  updated: 'Exam type updated.',
  deleted: 'Exam type deleted.',
  config_saved: 'Configuration saved. 18 linked examinations were updated.',
};

export const strings = {
  /** The filter menu's live match line — `exam-types.html` L1538. */
  filterMatchSuffix: ' exam types match',
  recentSort: 'Showing the most recently updated exam types first.',
};

/* -------------------------------------------------------------------------- */
/*                            Configuration sheet                             */
/* -------------------------------------------------------------------------- */

export interface ConfigRow {
  label: string;
  value: string;
  /** When set, the value renders as a badge instead of muted text. */
  badgeClass?: string;
}

export interface GradeBand {
  grade: string;
  range: string;
  badgeClass: string;
}

export interface WeightageComponent {
  label: string;
  percent: number;
  barClass: string;
}

export interface ExamTypeConfig {
  general: ConfigRow[];
  marks: ConfigRow[];
  grading: {
    badge: string;
    scale: string;
    bands: GradeBand[];
    gradePoints: string;
    cgpa: string;
  };
  passing: ConfigRow[];
  weightage: {
    badge: string;
    components: WeightageComponent[];
    contribution: string;
  };
  practical: ConfigRow[];
  internal: ConfigRow[];
  attendance: {
    minimum: number;
    rows: ConfigRow[];
  };
  publishing: ConfigRow[];
  promotion: ConfigRow[];
}

/** The template pads every mark under ten — "05", not "5". */
const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);

/**
 * The sheet's Weightage card states theory 70 %, practical 20 % and internal 10 % of the total,
 * so the Marks Configuration split is derived from it rather than stored twelve times. On a
 * 100-mark exam this returns the template's own 70 / 20 / 10.
 */
const splitMarks = (total: number) => {
  const theory = Math.round((total * 70) / 100);
  const practical = Math.round((total * 20) / 100);
  return { theory, practical, internal: total - theory - practical };
};

/** Overall pass is 35 % of the total in the template, and each component minimum tracks it. */
const componentMinimum = (component: number) => Math.floor(component * 0.35);

/** `exam-types.html` L2371–2378 — kept verbatim; this is the institution's grade scale. */
export const gradeBands: GradeBand[] = [
  { grade: 'A1', range: '91-100', badgeClass: 'badge-soft-success' },
  { grade: 'A2', range: '81-90', badgeClass: 'badge-soft-success' },
  { grade: 'B1', range: '71-80', badgeClass: 'badge-soft-info' },
  { grade: 'B2', range: '61-70', badgeClass: 'badge-soft-info' },
  { grade: 'C1', range: '51-60', badgeClass: 'badge-soft-warning' },
  { grade: 'C2', range: '41-50', badgeClass: 'badge-soft-warning' },
  { grade: 'D', range: '33-40', badgeClass: 'badge-soft-secondary' },
  { grade: 'E', range: 'Below 33', badgeClass: 'badge-soft-danger' },
];

const statusBadgeFor = (status: ExamTypeStatus) =>
  status === 'Active' ? 'badge-soft-success' : status === 'Draft' ? 'badge-soft-warning' : 'badge-soft-danger';

/** Builds the read-only sheet for one exam type — `exam-types.html` L2317–2553. */
export const buildConfig = (row: ExamType): ExamTypeConfig => {
  const total = Number(row.totalMarks) || 0;
  const { theory, practical, internal } = splitMarks(total);
  const practicalEnabled = row.practicalComponent !== 'Not applicable';

  return {
    general: [
      { label: 'Exam Type Name', value: row.name },
      { label: 'Short Code', value: row.code },
      { label: 'Assessment Category', value: row.category },
      { label: 'Academic Year', value: row.academicYear },
      { label: 'Term', value: row.term },
      { label: 'Status', value: row.status, badgeClass: statusBadgeFor(row.status) },
    ],
    marks: [
      { label: 'Total Marks', value: row.totalMarks },
      { label: 'Theory Marks', value: pad(theory) },
      { label: 'Practical Marks', value: pad(practical) },
      { label: 'Internal Marks', value: pad(internal) },
      { label: 'Decimal Places', value: '2' },
      { label: 'Rounding Method', value: 'Round Half Up' },
    ],
    grading: {
      badge: 'CBSE 8-Point',
      scale: 'A1 – E',
      bands: gradeBands,
      gradePoints: 'Yes',
      cgpa: 'Weighted Average',
    },
    passing: [
      { label: 'Overall Pass Mark', value: `${row.passMarks} / ${row.totalMarks}` },
      { label: 'Theory Minimum', value: `${pad(componentMinimum(theory))} / ${pad(theory)}` },
      { label: 'Practical Minimum', value: `${pad(componentMinimum(practical))} / ${pad(practical)}` },
      { label: 'Subject Wise Pass', value: 'Mandatory', badgeClass: 'badge-soft-success' },
      { label: 'Aggregate Pass', value: '40%' },
      { label: 'Grace Marks Limit', value: '05 Marks' },
    ],
    weightage: {
      badge: 'Total 100%',
      components: [
        { label: 'Theory Component', percent: 70, barClass: 'bg-primary' },
        { label: 'Practical Component', percent: 20, barClass: 'bg-info' },
        { label: 'Internal Assessment', percent: 10, barClass: 'bg-success' },
      ],
      contribution: row.weightageLabel,
    },
    practical: [
      {
        label: 'Practical Enabled',
        value: practicalEnabled ? 'Enabled' : 'Disabled',
        badgeClass: practicalEnabled ? 'badge-soft-success' : 'badge-soft-secondary',
      },
      { label: 'Applicable Subjects', value: 'Science, Computer' },
      { label: 'Lab Session Duration', value: '2 Hours' },
      {
        label: 'External Examiner',
        value: row.practicalComponent === 'Required' ? 'Required' : 'Optional',
        badgeClass: row.practicalComponent === 'Required' ? 'badge-soft-info' : 'badge-soft-secondary',
      },
      { label: 'Record Book Marks', value: '05' },
      { label: 'Viva Component', value: '05' },
    ],
    internal: [
      { label: 'Included in Result', value: 'Yes', badgeClass: 'badge-soft-success' },
      { label: 'Class Participation', value: '03 Marks' },
      { label: 'Homework & Assignment', value: '04 Marks' },
      { label: 'Portfolio Submission', value: '03 Marks' },
      { label: 'Evaluated By', value: 'Subject Teacher' },
      { label: 'Entry Deadline', value: '3 Days Before' },
    ],
    attendance: {
      minimum: 75,
      rows: [
        { label: 'Medical Exemption', value: 'Allowed', badgeClass: 'badge-soft-success' },
        { label: 'Condonation Limit', value: '10%' },
        { label: 'Approval Authority', value: 'Principal' },
        { label: 'Shortage Notification', value: 'Auto Alert', badgeClass: 'badge-soft-warning' },
      ],
    },
    publishing: [
      { label: 'Publishing Mode', value: 'Scheduled' },
      { label: 'Publish Date', value: '28 Sep 2026' },
      { label: 'Approval Workflow', value: '2 Level', badgeClass: 'badge-soft-info' },
      { label: 'Parent Portal Visibility', value: 'Enabled', badgeClass: 'badge-soft-success' },
      { label: 'SMS & Email Alert', value: 'Enabled', badgeClass: 'badge-soft-success' },
      { label: 'Report Card Template', value: 'Standard Term' },
    ],
    promotion: [
      { label: 'Counts Toward Promotion', value: 'Yes', badgeClass: 'badge-soft-success' },
      { label: 'Minimum Aggregate', value: '40%' },
      { label: 'Maximum Failed Subjects', value: '02' },
      { label: 'Compartment Exam', value: 'Permitted', badgeClass: 'badge-soft-info' },
      { label: 'Detention Policy', value: 'After 2 Attempts' },
      { label: 'Promotion Committee', value: 'Review Required', badgeClass: 'badge-soft-warning' },
    ],
  };
};

/** The audit line both dialogs put in their footer — `exam-types.html` L2557, L2903. */
export const configAuditNote = 'Last updated on 12 Jul 2026 by Kevin Larry';

/* -------------------------------------------------------------------------- */
/*                          Edit Configuration form                           */
/* -------------------------------------------------------------------------- */

export type EditFieldKey =
  | 'examTypeName'
  | 'shortCode'
  | 'assessmentCategory'
  | 'academicYear'
  | 'term'
  | 'status'
  | 'totalMarks'
  | 'theoryMarks'
  | 'practicalMarks'
  | 'internalMarks'
  | 'decimalPlaces'
  | 'roundingMethod'
  | 'gradeScale'
  | 'cgpaCalculation'
  | 'highestGradeBoundary'
  | 'lowestGradeBoundary'
  | 'overallPassMark'
  | 'aggregatePass'
  | 'theoryMinimum'
  | 'practicalMinimum'
  | 'graceMarksLimit'
  | 'theoryComponent'
  | 'practicalComponent'
  | 'internalAssessment'
  | 'contributionToFinalResult'
  | 'applicableSubjects'
  | 'labSessionDuration'
  | 'recordBookMarks'
  | 'vivaComponent'
  | 'classParticipation'
  | 'homework'
  | 'portfolio'
  | 'evaluatedBy'
  | 'entryDeadline'
  | 'minimumAttendance'
  | 'condonationLimit'
  | 'approvalAuthority'
  | 'shortageNotification'
  | 'publishingMode'
  | 'publishDate'
  | 'approvalWorkflow'
  | 'reportCardTemplate'
  | 'minimumAggregate'
  | 'maximumFailedSubjects'
  | 'detentionPolicy'
  | 'compartmentExam';

export type EditConfigValues = Record<EditFieldKey, string>;

/** Option lists for the Edit Configuration selects — `exam-types.html` L2601–2829. */
export const editOptions = {
  assessmentCategory: ['Summative', 'Formative', 'Practical', 'Continuous'],
  academicYear: ['2026 / 2027', '2025 / 2026'],
  term: ['Term I', 'Term II', 'Full Year'],
  status: ['Active', 'Draft', 'Archived'],
  decimalPlaces: ['0', '1', '2'],
  roundingMethod: ['Round Half Up', 'Round Half Down', 'Truncate'],
  gradeScale: ['CBSE 8-Point (A1 – E)', 'Percentage', 'Pass / Fail'],
  cgpaCalculation: ['Weighted Average', 'Simple Average', 'Best of Five'],
  applicableSubjects: ['Science, Computer', 'Science Only', 'All Subjects'],
  labSessionDuration: ['1 Hour', '2 Hours', '3 Hours'],
  evaluatedBy: ['Subject Teacher', 'Class Teacher', 'Department Head'],
  entryDeadline: ['1 Day Before', '3 Days Before', '7 Days Before'],
  approvalAuthority: ['Principal', 'Vice Principal', 'Class Teacher'],
  shortageNotification: ['Auto Alert', 'Manual', 'Disabled'],
  publishingMode: ['Scheduled', 'Immediate', 'Manual'],
  approvalWorkflow: ['Single Level', '2 Level', '3 Level'],
  reportCardTemplate: ['Standard Term', 'Detailed Term', 'Consolidated'],
  detentionPolicy: ['After 1 Attempt', 'After 2 Attempts', 'Not Applicable'],
  compartmentExam: ['Permitted', 'Not Permitted'],
} as const;

/** Seeds the Edit Configuration form from the same sheet the read-only preview renders. */
export const buildEditValues = (row: ExamType): EditConfigValues => {
  const total = Number(row.totalMarks) || 0;
  const { theory, practical, internal } = splitMarks(total);

  return {
    examTypeName: row.name,
    shortCode: row.code,
    assessmentCategory: row.category,
    academicYear: row.academicYear,
    term: row.term,
    status: row.status,
    totalMarks: row.totalMarks,
    theoryMarks: pad(theory),
    practicalMarks: pad(practical),
    internalMarks: pad(internal),
    decimalPlaces: '2',
    roundingMethod: 'Round Half Up',
    gradeScale: 'CBSE 8-Point (A1 – E)',
    cgpaCalculation: 'Weighted Average',
    highestGradeBoundary: '91 - 100',
    lowestGradeBoundary: 'Below 33',
    overallPassMark: row.passMarks,
    aggregatePass: '40',
    theoryMinimum: pad(componentMinimum(theory)),
    practicalMinimum: pad(componentMinimum(practical)),
    graceMarksLimit: '05',
    theoryComponent: '70',
    practicalComponent: '20',
    internalAssessment: '10',
    contributionToFinalResult: `${row.weightage}`,
    applicableSubjects: 'Science, Computer',
    labSessionDuration: '2 Hours',
    recordBookMarks: '05',
    vivaComponent: '05',
    classParticipation: '03',
    homework: '04',
    portfolio: '03',
    evaluatedBy: 'Subject Teacher',
    entryDeadline: '3 Days Before',
    minimumAttendance: '75',
    condonationLimit: '10',
    approvalAuthority: 'Principal',
    shortageNotification: 'Auto Alert',
    publishingMode: 'Scheduled',
    publishDate: '28-09-2026',
    approvalWorkflow: '2 Level',
    reportCardTemplate: 'Standard Term',
    minimumAggregate: '40',
    maximumFailedSubjects: '02',
    detentionPolicy: 'After 2 Attempts',
    compartmentExam: 'Permitted',
  };
};

/**
 * The sixteen `cfg_*` switches. Ten sit inside a section card; the last six make up the
 * page-wide Examination Rules card. All ship checked.
 */
export type CfgToggleKey =
  | 'cfg_grade_points'
  | 'cfg_subject_pass'
  | 'cfg_practical'
  | 'cfg_external'
  | 'cfg_internal'
  | 'cfg_medical'
  | 'cfg_parent_portal'
  | 'cfg_alerts'
  | 'cfg_promotion'
  | 'cfg_committee'
  | 'cfg_grace'
  | 'cfg_retest'
  | 'cfg_improvement'
  | 'cfg_revaluation'
  | 'cfg_practical_mandatory'
  | 'cfg_malpractice';

export interface CfgToggle {
  key: CfgToggleKey;
  label: string;
}

/** `exam-types.html` L2859–2894 — the six-switch Examination Rules card. */
export const examinationRuleToggles: CfgToggle[] = [
  { key: 'cfg_grace', label: 'Grace marks allowed' },
  { key: 'cfg_retest', label: 'Retest allowed' },
  { key: 'cfg_improvement', label: 'Improvement exam' },
  { key: 'cfg_revaluation', label: 'Revaluation on request' },
  { key: 'cfg_practical_mandatory', label: 'Practical mandatory' },
  { key: 'cfg_malpractice', label: 'Strict malpractice policy' },
];

export const toggleLabels: Record<CfgToggleKey, string> = {
  cfg_grade_points: 'Enable grade points on report cards',
  cfg_subject_pass: 'Subject wise pass mandatory',
  cfg_practical: 'Practical enabled',
  cfg_external: 'External examiner required',
  cfg_internal: 'Include internal assessment in final result',
  cfg_medical: 'Allow medical exemption',
  cfg_parent_portal: 'Parent portal visibility',
  cfg_alerts: 'SMS & email alerts',
  cfg_promotion: 'Counts toward promotion',
  cfg_committee: 'Promotion committee review',
  cfg_grace: 'Grace marks allowed',
  cfg_retest: 'Retest allowed',
  cfg_improvement: 'Improvement exam',
  cfg_revaluation: 'Revaluation on request',
  cfg_practical_mandatory: 'Practical mandatory',
  cfg_malpractice: 'Strict malpractice policy',
};

export const defaultToggles: Record<CfgToggleKey, boolean> = {
  cfg_grade_points: true,
  cfg_subject_pass: true,
  cfg_practical: true,
  cfg_external: true,
  cfg_internal: true,
  cfg_medical: true,
  cfg_parent_portal: true,
  cfg_alerts: true,
  cfg_promotion: true,
  cfg_committee: true,
  cfg_grace: true,
  cfg_retest: true,
  cfg_improvement: true,
  cfg_revaluation: true,
  cfg_practical_mandatory: true,
  cfg_malpractice: true,
};

/**
 * The Practical Assessment switches follow the row rather than the sheet, so an exam type with
 * no practical component opens with both of its switches off.
 */
export const buildToggles = (row: ExamType): Record<CfgToggleKey, boolean> => ({
  ...defaultToggles,
  cfg_practical: row.practicalComponent !== 'Not applicable',
  cfg_external: row.practicalComponent === 'Required',
  cfg_practical_mandatory: row.practicalComponent === 'Required',
});

/* -------------------------------------------------------------------------- */
/*                        Add / Edit Exam Type dialogs                        */
/* -------------------------------------------------------------------------- */

/** `exam-types.html` L2923–2929 — shared by both of the small dialogs. */
export const itemOptions = {
  assessmentCategory: ['Formative', 'Summative', 'Practical', 'Continuous'],
  academicYear: ['2026 / 2027', '2025 / 2026'],
  status: ['Active', 'Draft', 'Archived'],
} as const;

export interface ExamTypeFormValues {
  name: string;
  code: string;
  category: string;
  academicYear: string;
  totalMarks: string;
  passMarks: string;
  duration: string;
  weightage: string;
  status: string;
  description: string;
}

export const emptyForm: ExamTypeFormValues = {
  name: '',
  code: '',
  category: itemOptions.assessmentCategory[0],
  academicYear: itemOptions.academicYear[0],
  totalMarks: '',
  passMarks: '',
  duration: '',
  weightage: '',
  status: itemOptions.status[0],
  description: '',
};

/** The palette the template cycles through; a new exam type picks the next tone in order. */
export const cardTones: { avatarClass: string; barClass: string; icon: string }[] = [
  { avatarClass: 'bg-primary-transparent text-primary', barClass: 'bg-primary', icon: 'ti ti-pencil-check' },
  { avatarClass: 'bg-info-transparent text-info', barClass: 'bg-info', icon: 'ti ti-calendar-week' },
  { avatarClass: 'bg-warning-transparent text-warning', barClass: 'bg-warning', icon: 'ti ti-calendar-month' },
  { avatarClass: 'bg-purple-transparent text-purple', barClass: 'bg-purple', icon: 'ti ti-clipboard-text' },
  { avatarClass: 'bg-teal-transparent text-teal', barClass: 'bg-teal', icon: 'ti ti-book-2' },
  { avatarClass: 'bg-skyblue-transparent text-skyblue', barClass: 'bg-skyblue', icon: 'ti ti-flask' },
];
