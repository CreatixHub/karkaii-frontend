export type ResultStatus =
  | 'Published'
  | 'Pending'
  | 'Draft'
  | 'Passed'
  | 'Failed'
  | 'Absent'
  | 'Under Review';

export type ToneId = 'success' | 'primary' | 'warning' | 'danger' | 'secondary';

export type ColumnId = 'student' | 'exam' | 'result' | 'status';

export type DensityId = 'compact' | 'default' | 'comfortable';

export type FilterKey =
  | 'year'
  | 'exam'
  | 'class'
  | 'section'
  | 'subject'
  | 'student'
  | 'status'
  | 'grade'
  | 'marks'
  | 'date';

export type SortKey = 'name' | 'marks' | 'rank' | 'date' | 'status' | 'recent';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

/** `add_result`, `edit_result`, `view_result`, `results_import` and `delete-modal`. */
export type ResultModalId = 'add' | 'edit' | 'view' | 'import' | 'delete';

/** Everything the expanded `dt-detail` panel prints for a row. */
export interface ResultDetail {
  theoryObtained: number;
  theoryMax: number;
  practicalObtained: number;
  practicalMax: number;
  internal: number;
  internalMax: number;
  /** "Present · 92% term attendance." or, for the absentee, its own sentence. */
  attendance: string;
  teacherRemark: string;
  parentRemark: string;
  previousTerm: number;
  trend: string;
}

export interface ResultRow {
  /** The admission number, unique across the ten rows, used as the row key. */
  id: string;
  name: string;
  avatar: string;
  admissionNo: string;
  roll: number;
  className: string;
  section: string;
  exam: string;
  subject: string;
  year: string;
  date: string;
  teacher: { name: string; avatar: string };
  obtained: number;
  max: number;
  percentage: number;
  /** Colours the percentage text and the grade badge — they always agree. */
  tone: ToneId;
  /** The meter tints one step cooler than the text on the "D" row, so it is its own field. */
  meterTone: ToneId;
  grade: string;
  gradePoint: string;
  /** "#1" for a ranked result, "—" where none was awarded. */
  rank: string;
  /** The engine parsed the rank badge with `parseFloat`, so "—" sorts as 0. */
  rankValue: number;
  status: ResultStatus;
  pillClass: string;
  /** Published and Draft show a dot; the rest carry an icon. */
  pillIcon: string | null;
  detail: ResultDetail;
  /** The template's `data-search` haystack, verbatim. */
  search: string;
}

const PILLS: Record<ResultStatus, { pillClass: string; pillIcon: string | null }> = {
  Published: { pillClass: 'is-active', pillIcon: null },
  Pending: { pillClass: 'is-pending', pillIcon: 'ti ti-clock' },
  Draft: { pillClass: 'is-inactive', pillIcon: null },
  Passed: { pillClass: 'is-new', pillIcon: 'ti ti-circle-check' },
  Failed: { pillClass: 'is-emergency', pillIcon: 'ti ti-x' },
  Absent: { pillClass: 'is-archived', pillIcon: 'ti ti-user-off' },
  'Under Review': { pillClass: 'is-exam', pillIcon: 'ti ti-loader' },
};

/** Publishing a row from the bulk bar or its menu has to restyle its pill too. */
export const statusPill = (status: ResultStatus) => PILLS[status];

interface ResultSeed {
  name: string;
  avatarNo: string;
  admissionNo: string;
  roll: number;
  className: string;
  section: string;
  exam: string;
  subject: string;
  date: string;
  teacherName: string;
  teacherNo: string;
  obtained: number;
  max: number;
  percentage: number;
  tone: ToneId;
  meterTone: ToneId;
  grade: string;
  gradePoint: string;
  rank: string;
  status: ResultStatus;
  detail: ResultDetail;
  search: string;
}

const ACADEMIC_YEAR = '2024/2025';

const row = (seed: ResultSeed): ResultRow => ({
  id: seed.admissionNo,
  name: seed.name,
  avatar: `assets/img/students/student-${seed.avatarNo}.jpg`,
  admissionNo: seed.admissionNo,
  roll: seed.roll,
  className: seed.className,
  section: seed.section,
  exam: seed.exam,
  subject: seed.subject,
  year: ACADEMIC_YEAR,
  date: seed.date,
  teacher: { name: seed.teacherName, avatar: `assets/img/teachers/teacher-${seed.teacherNo}.jpg` },
  obtained: seed.obtained,
  max: seed.max,
  percentage: seed.percentage,
  tone: seed.tone,
  meterTone: seed.meterTone,
  grade: seed.grade,
  gradePoint: seed.gradePoint,
  rank: seed.rank,
  rankValue: Number.parseFloat(seed.rank.replace(/[^\d.]/g, '')) || 0,
  status: seed.status,
  ...PILLS[seed.status],
  detail: seed.detail,
  search: seed.search,
});

const PRESENT = 'Present · 92% term attendance.';
const GUARDIAN = 'Acknowledged by guardian · will support home revision.';

export const resultRows: ResultRow[] = [
  row({
    name: 'Janet Daniel',
    avatarNo: '01',
    admissionNo: 'AD202401',
    roll: 12,
    className: 'X',
    section: 'A',
    exam: 'Midterm Examination',
    subject: 'Mathematics',
    date: '13 May 2024',
    teacherName: 'Mori',
    teacherNo: '02',
    obtained: 92,
    max: 100,
    percentage: 92,
    tone: 'success',
    meterTone: 'success',
    grade: 'A+',
    gradePoint: '10.0',
    rank: '#1',
    status: 'Published',
    detail: {
      theoryObtained: 64,
      theoryMax: 70,
      practicalObtained: 28,
      practicalMax: 30,
      internal: 18,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Excellent, consistent performance.',
      parentRemark: GUARDIAN,
      previousTerm: 88,
      trend: 'improving',
    },
    search:
      'janet daniel ad202401 class x sec a roll 12 midterm examination mathematics mori published grade a+ 92% 13 may 2024',
  }),
  row({
    name: 'Joann Michael',
    avatarNo: '02',
    admissionNo: 'AD202402',
    roll: 13,
    className: 'X',
    section: 'A',
    exam: 'Midterm Examination',
    subject: 'Mathematics',
    date: '13 May 2024',
    teacherName: 'Mori',
    teacherNo: '02',
    obtained: 84,
    max: 100,
    percentage: 84,
    tone: 'success',
    meterTone: 'success',
    grade: 'A',
    gradePoint: '9.0',
    rank: '#3',
    status: 'Published',
    detail: {
      theoryObtained: 59,
      theoryMax: 70,
      practicalObtained: 25,
      practicalMax: 30,
      internal: 17,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Excellent, consistent performance.',
      parentRemark: GUARDIAN,
      previousTerm: 80,
      trend: 'improving',
    },
    search:
      'joann michael ad202402 class x sec a roll 13 midterm examination mathematics mori published grade a 84% 13 may 2024',
  }),
  row({
    name: 'Kathleen Nolan',
    avatarNo: '03',
    admissionNo: 'AD202403',
    roll: 8,
    className: 'IX',
    section: 'B',
    exam: 'Unit Test 3',
    subject: 'English',
    date: '09 May 2024',
    teacherName: 'Erickson',
    teacherNo: '01',
    obtained: 38,
    max: 50,
    percentage: 76,
    tone: 'primary',
    meterTone: 'primary',
    grade: 'B+',
    gradePoint: '8.0',
    rank: '#5',
    status: 'Passed',
    detail: {
      theoryObtained: 27,
      theoryMax: 35,
      practicalObtained: 11,
      practicalMax: 15,
      internal: 15,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Satisfactory — can improve with practice.',
      parentRemark: GUARDIAN,
      previousTerm: 72,
      trend: 'improving',
    },
    search:
      'kathleen nolan ad202403 class ix sec b roll 8 unit test 3 english erickson passed grade b+ 76% 09 may 2024',
  }),
  row({
    name: 'Gifford Ramsey',
    avatarNo: '04',
    admissionNo: 'AD202404',
    roll: 21,
    className: 'XII',
    section: 'A',
    exam: 'Final Examination',
    subject: 'Physics',
    date: '18 Jul 2024',
    teacherName: 'Joseph',
    teacherNo: '03',
    obtained: 0,
    max: 100,
    percentage: 0,
    tone: 'secondary',
    meterTone: 'secondary',
    grade: '—',
    gradePoint: '0.0',
    rank: '—',
    status: 'Absent',
    detail: {
      theoryObtained: 0,
      theoryMax: 70,
      practicalObtained: 0,
      practicalMax: 30,
      internal: 0,
      internalMax: 20,
      attendance: 'Absent for this examination.',
      teacherRemark: 'No marks recorded — student absent.',
      parentRemark: GUARDIAN,
      previousTerm: 0,
      trend: 'steady',
    },
    search:
      'gifford ramsey ad202404 class xii sec a roll 21 final examination physics joseph absent grade — 0% 18 jul 2024',
  }),
  row({
    name: 'Lisa Gourley',
    avatarNo: '05',
    admissionNo: 'AD202405',
    roll: 5,
    className: 'XII',
    section: 'C',
    exam: 'Practical Examination',
    subject: 'Biology',
    date: '07 May 2024',
    teacherName: 'Teresa',
    teacherNo: '05',
    obtained: 27,
    max: 30,
    percentage: 90,
    tone: 'success',
    meterTone: 'success',
    grade: 'A',
    gradePoint: '9.0',
    rank: '#2',
    status: 'Published',
    detail: {
      theoryObtained: 19,
      theoryMax: 21,
      practicalObtained: 8,
      practicalMax: 9,
      internal: 18,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Excellent, consistent performance.',
      parentRemark: GUARDIAN,
      previousTerm: 86,
      trend: 'improving',
    },
    search:
      'lisa gourley ad202405 class xii sec c roll 5 practical examination biology teresa published grade a 90% 07 may 2024',
  }),
  row({
    name: 'Ralph Claudia',
    avatarNo: '06',
    admissionNo: 'AD202406',
    roll: 17,
    className: 'XI',
    section: 'A',
    exam: 'Chapter Test — Acids & Bases',
    subject: 'Chemistry',
    date: '20 May 2024',
    teacherName: 'James',
    teacherNo: '04',
    obtained: 18,
    max: 40,
    percentage: 45,
    tone: 'warning',
    meterTone: 'primary',
    grade: 'D',
    gradePoint: '4.0',
    rank: '#9',
    status: 'Under Review',
    detail: {
      theoryObtained: 13,
      theoryMax: 28,
      practicalObtained: 5,
      practicalMax: 12,
      internal: 9,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Satisfactory — can improve with practice.',
      parentRemark: GUARDIAN,
      previousTerm: 41,
      trend: 'steady',
    },
    search:
      'ralph claudia ad202406 class xi sec a roll 17 chapter test — acids & bases chemistry james under review grade d 45% 20 may 2024',
  }),
  row({
    name: 'Julie Scott',
    avatarNo: '07',
    admissionNo: 'AD202407',
    roll: 3,
    className: 'VIII',
    section: 'B',
    exam: 'Half Yearly Examination',
    subject: 'Geography',
    date: '15 Nov 2024',
    teacherName: 'Jacquelin',
    teacherNo: '07',
    obtained: 61,
    max: 80,
    percentage: 76,
    tone: 'primary',
    meterTone: 'primary',
    grade: 'B+',
    gradePoint: '8.0',
    rank: '#4',
    status: 'Pending',
    detail: {
      theoryObtained: 43,
      theoryMax: 56,
      practicalObtained: 18,
      practicalMax: 24,
      internal: 15,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Satisfactory — can improve with practice.',
      parentRemark: GUARDIAN,
      previousTerm: 72,
      trend: 'improving',
    },
    search:
      'julie scott ad202407 class viii sec b roll 3 half yearly examination geography jacquelin pending grade b+ 76% 15 nov 2024',
  }),
  row({
    name: 'Hellen Warner',
    avatarNo: '08',
    admissionNo: 'AD202408',
    roll: 9,
    className: 'XI',
    section: 'A',
    exam: 'Annual Examination',
    subject: 'Economics',
    date: '10 Mar 2025',
    teacherName: 'Ramsey',
    teacherNo: '08',
    obtained: 74,
    max: 100,
    percentage: 74,
    tone: 'primary',
    meterTone: 'primary',
    grade: 'B+',
    gradePoint: '8.0',
    rank: '#6',
    status: 'Draft',
    detail: {
      theoryObtained: 52,
      theoryMax: 70,
      practicalObtained: 22,
      practicalMax: 30,
      internal: 15,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Satisfactory — can improve with practice.',
      parentRemark: GUARDIAN,
      previousTerm: 70,
      trend: 'improving',
    },
    search:
      'hellen warner ad202408 class xi sec a roll 9 annual examination economics ramsey draft grade b+ 74% 10 mar 2025',
  }),
  row({
    name: 'Andrew Fischer',
    avatarNo: '09',
    admissionNo: 'AD202409',
    roll: 14,
    className: 'X',
    section: 'A',
    exam: 'Quarterly Examination',
    subject: 'Computer Science',
    date: '26 Aug 2024',
    teacherName: 'Hendrita',
    teacherNo: '06',
    obtained: 29,
    max: 100,
    percentage: 29,
    tone: 'danger',
    meterTone: 'danger',
    grade: 'F',
    gradePoint: '0.0',
    rank: '—',
    status: 'Failed',
    detail: {
      theoryObtained: 20,
      theoryMax: 70,
      practicalObtained: 9,
      practicalMax: 30,
      internal: 6,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Needs remedial support before the next assessment.',
      parentRemark: GUARDIAN,
      previousTerm: 25,
      trend: 'steady',
    },
    search:
      'andrew fischer ad202409 class x sec a roll 14 quarterly examination computer science hendrita failed grade f 29% 26 aug 2024',
  }),
  row({
    name: 'Karen Robinson',
    avatarNo: '10',
    admissionNo: 'AD202410',
    roll: 6,
    className: 'VII',
    section: 'B',
    exam: 'Oral Test — Civilisations',
    subject: 'History',
    date: '03 Jul 2024',
    teacherName: 'Morgan',
    teacherNo: '10',
    obtained: 20,
    max: 25,
    percentage: 80,
    tone: 'success',
    meterTone: 'success',
    grade: 'A',
    gradePoint: '9.0',
    rank: '#2',
    status: 'Published',
    detail: {
      theoryObtained: 14,
      theoryMax: 18,
      practicalObtained: 6,
      practicalMax: 8,
      internal: 16,
      internalMax: 20,
      attendance: PRESENT,
      teacherRemark: 'Excellent, consistent performance.',
      parentRemark: GUARDIAN,
      previousTerm: 76,
      trend: 'improving',
    },
    search:
      'karen robinson ad202410 class vii sec b roll 6 oral test — civilisations history morgan published grade a 80% 03 jul 2024',
  }),
];

/* -------------------------------------------------------------------------- */
/*                       Copy the template wrote per row                      */
/* -------------------------------------------------------------------------- */

export const internalCopy = (row: ResultRow) =>
  `Continuous assessment: ${row.detail.internal}/${row.detail.internalMax} · Assignments submitted on time.`;

export const practicalCopy = (row: ResultRow) =>
  `Lab/practical component: ${row.detail.practicalObtained} of ${row.detail.practicalMax} marks.`;

export const teacherRemarkCopy = (row: ResultRow) => `${row.teacher.name}: ${row.detail.teacherRemark}`;

export const historyCopy = (row: ResultRow) =>
  `Previous term: ${row.detail.previousTerm}% · trend ${row.detail.trend}.`;

export const componentsCopy = (row: ResultRow) =>
  `Theory ${row.detail.theoryObtained}/${row.detail.theoryMax} · Practical ${row.detail.practicalObtained}/${row.detail.practicalMax} · Internal ${row.detail.internal}/${row.detail.internalMax}.`;

export const marksSummary = (row: ResultRow) =>
  `${row.obtained} / ${row.max} · ${row.percentage}% · Grade ${row.grade} · GP ${row.gradePoint} · Rank ${row.rank}`;

export const studentMeta = (row: ResultRow) =>
  `${row.admissionNo} · Class ${row.className}-${row.section} · Roll ${row.roll} · ${row.exam} · ${row.subject}`;

/** The View dialog widens the teacher remark; the template spelled out the longer form. */
export const modalRemarkCopy = (row: ResultRow) =>
  row.detail.teacherRemark === 'Excellent, consistent performance.'
    ? 'Excellent, consistent performance across all components.'
    : row.detail.teacherRemark;

/* -------------------------------------------------------------------------- */
/*                                  Toolbar                                   */
/* -------------------------------------------------------------------------- */

export interface SavedView {
  id: string;
  label: string;
  icon: string;
}

export const savedViews: SavedView[] = [
  { id: 'all', label: 'All Results', icon: 'ti ti-layout-list' },
  { id: 'Published', label: 'Published', icon: 'ti ti-send' },
  { id: 'Pending', label: 'Pending', icon: 'ti ti-clock' },
  { id: 'Passed', label: 'Passed', icon: 'ti ti-circle-check' },
  { id: 'Failed', label: 'Failed', icon: 'ti ti-alert-triangle' },
  { id: 'Under Review', label: 'Under Review', icon: 'ti ti-loader' },
];

export const quickFilters: SavedView[] = savedViews.slice(1);

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterField {
  key: FilterKey;
  /** Short name used on the removable chip. */
  label: string;
  /** The `<label>` above the select in the filter panel. */
  panelLabel: string;
  /** Page-slugged so the ids stay unique once several pages share one SPA. */
  domId: string;
  /** Two of the selects open on "Any" rather than "All". */
  allLabel: string;
  options: FilterOption[];
}

const plain = (values: string[]): FilterOption[] => values.map((value) => ({ value, label: value }));

export const examOptions = [
  'Midterm Examination',
  'Unit Test 3',
  'Final Examination',
  'Practical Examination',
  'Chapter Test — Acids & Bases',
  'Half Yearly Examination',
  'Annual Examination',
  'Quarterly Examination',
  'Oral Test — Civilisations',
];

export const subjectOptions = [
  'Mathematics',
  'English',
  'Physics',
  'Biology',
  'Chemistry',
  'Geography',
  'Economics',
  'Computer Science',
  'History',
];

export const studentOptions = [
  'Janet Daniel',
  'Joann Michael',
  'Kathleen Nolan',
  'Gifford Ramsey',
  'Lisa Gourley',
  'Ralph Claudia',
  'Julie Scott',
  'Hellen Warner',
  'Andrew Fischer',
  'Karen Robinson',
];

/** Filter-panel and Edit-dialog order. */
export const resultStatuses: ResultStatus[] = [
  'Published',
  'Pending',
  'Draft',
  'Passed',
  'Failed',
  'Absent',
  'Under Review',
];

/** The Add dialog opens on Draft, so its list leads with it. */
export const addStatusOptions: ResultStatus[] = [
  'Draft',
  'Pending',
  'Published',
  'Passed',
  'Failed',
  'Absent',
  'Under Review',
];

export const examDateOptions = [
  '13 May 2024',
  '09 May 2024',
  '18 Jul 2024',
  '07 May 2024',
  '20 May 2024',
  '15 Nov 2024',
  '10 Mar 2025',
  '26 Aug 2024',
  '03 Jul 2024',
];

export const advancedFilters: FilterField[] = [
  {
    key: 'year',
    label: 'Year',
    panelLabel: 'Academic Year',
    domId: 'er-academic-year',
    allLabel: 'All',
    options: plain(['2024/2025', '2023/2024']),
  },
  {
    key: 'exam',
    label: 'Exam',
    panelLabel: 'Examination',
    domId: 'er-examination',
    allLabel: 'All',
    options: plain(examOptions),
  },
  {
    key: 'class',
    label: 'Class',
    panelLabel: 'Class',
    domId: 'er-class',
    allLabel: 'All',
    options: [
      { value: 'class x', label: 'X' },
      { value: 'class ix', label: 'IX' },
      { value: 'class xii', label: 'XII' },
      { value: 'class xi', label: 'XI' },
      { value: 'class viii', label: 'VIII' },
      { value: 'class vii', label: 'VII' },
    ],
  },
  {
    key: 'section',
    label: 'Section',
    panelLabel: 'Section',
    domId: 'er-section',
    allLabel: 'All',
    options: [
      { value: 'sec a', label: 'A' },
      { value: 'sec b', label: 'B' },
      { value: 'sec c', label: 'C' },
    ],
  },
  {
    key: 'subject',
    label: 'Subject',
    panelLabel: 'Subject',
    domId: 'er-subject',
    allLabel: 'All',
    options: plain(subjectOptions),
  },
  {
    key: 'student',
    label: 'Student',
    panelLabel: 'Student',
    domId: 'er-student',
    allLabel: 'All',
    options: plain(studentOptions),
  },
  {
    key: 'status',
    label: 'Status',
    panelLabel: 'Result Status',
    domId: 'er-result-status',
    allLabel: 'All',
    options: plain(resultStatuses),
  },
  {
    key: 'grade',
    label: 'Grade',
    panelLabel: 'Grade',
    domId: 'er-grade',
    allLabel: 'All',
    options: [
      { value: 'grade a+', label: 'A+' },
      { value: 'grade a', label: 'A' },
      { value: 'grade b+', label: 'B+' },
      { value: 'grade d', label: 'D' },
      { value: 'grade f', label: 'F' },
    ],
  },
  {
    key: 'marks',
    label: 'Marks',
    panelLabel: 'Marks Range',
    domId: 'er-marks-range',
    allLabel: 'Any',
    options: [
      { value: '90%', label: '90% and above' },
      { value: '80%', label: '80% and above' },
      { value: '40%', label: '40% and above' },
    ],
  },
  {
    key: 'date',
    label: 'Date',
    panelLabel: 'Exam Date',
    domId: 'er-exam-date',
    allLabel: 'Any date',
    options: plain(examDateOptions),
  },
];

export const columnDefs: { id: ColumnId; label: string }[] = [
  { id: 'student', label: 'Student' },
  { id: 'exam', label: 'Exam Details' },
  { id: 'result', label: 'Result' },
  { id: 'status', label: 'Status' },
];

export const allColumns: Record<ColumnId, boolean> = {
  student: true,
  exam: true,
  result: true,
  status: true,
};

export const densityOptions: { id: DensityId; icon: string; title: string }[] = [
  { id: 'compact', icon: 'ti ti-baseline-density-small', title: 'Compact' },
  { id: 'default', icon: 'ti ti-baseline-density-medium', title: 'Default' },
  { id: 'comfortable', icon: 'ti ti-baseline-density-large', title: 'Comfortable' },
];

export const sortOptions: { id: SortKey; label: string; icon: string }[] = [
  { id: 'name', label: 'Student Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'marks', label: 'Percentage', icon: 'ti ti-percentage' },
  { id: 'rank', label: 'Rank', icon: 'ti ti-trophy' },
  { id: 'date', label: 'Exam Date', icon: 'ti ti-calendar' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** Every header on this page is sortable; the key each one carries is the template's. */
export const tableHeaders: { id: ColumnId; label: string; sort: SortKey }[] = [
  { id: 'student', label: 'Student', sort: 'name' },
  { id: 'exam', label: 'Exam Details', sort: 'date' },
  { id: 'result', label: 'Result', sort: 'marks' },
  { id: 'status', label: 'Status', sort: 'status' },
];

export const pageSizes = ['10', '25', '50'];

/* -------------------------------------------------------------------------- */
/*                          Header, bulk bar and menus                        */
/* -------------------------------------------------------------------------- */

export const exportActions: { id: string; label: string; icon: string }[] = [
  { id: 'export_pdf', label: 'Export as PDF', icon: 'ti ti-file-type-pdf' },
  { id: 'export_excel', label: 'Export as Excel', icon: 'ti ti-file-type-xls' },
  { id: 'export_csv', label: 'Export as CSV', icon: 'ti ti-file-type-csv' },
];

export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  modal?: ResultModalId;
  danger?: boolean;
}

export const bulkActions: BulkAction[] = [
  { id: 'publish_results', label: 'Publish Results', icon: 'ti ti-send' },
  { id: 'recalculate', label: 'Recalculate Grades', icon: 'ti ti-calculator' },
  { id: 'export_csv', label: 'Export Selected', icon: 'ti ti-file-export' },
  { id: 'generate_marksheet', label: 'Generate Marksheet', icon: 'ti ti-file-download' },
  { id: 'print', label: 'Print', icon: 'ti ti-printer' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash', modal: 'delete', danger: true },
];

export interface RowMenuItem {
  id: string;
  label: string;
  icon: string;
  route?: string;
  modal?: ResultModalId;
  danger?: boolean;
  divider?: boolean;
}

export const rowMenuItems: RowMenuItem[] = [
  { id: 'view', label: 'View Result', icon: 'ti ti-eye', modal: 'view' },
  { id: 'edit', label: 'Edit Marks', icon: 'ti ti-edit', modal: 'edit' },
  { id: 'publish', label: 'Publish Result', icon: 'ti ti-send' },
  { id: 'analysis', label: 'Result Analysis', icon: 'ti ti-report-analytics' },
  { id: 'profile', label: 'Student Profile', icon: 'ti ti-user', route: 'studentDetail' },
  { id: 'answer_sheet', label: 'Answer Sheet', icon: 'ti ti-file-text' },
  { id: 'remarks', label: 'Remarks', icon: 'ti ti-message-2' },
  { id: 'download_marksheet', label: 'Download Marksheet', icon: 'ti ti-download' },
  { id: 'print', label: 'Print Result', icon: 'ti ti-printer' },
  { id: 'recalculate', label: 'Recalculate Grade', icon: 'ti ti-calculator', divider: true },
  { id: 'promote_review', label: 'Promote for Review', icon: 'ti ti-flag' },
  { id: 'duplicate', label: 'Duplicate', icon: 'ti ti-copy' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash-x', modal: 'delete', danger: true },
];

/** The CSV columns are `tables.js` L589–596, in the order the engine wrote them. */
export const csvColumns: { label: string; value: (row: ResultRow) => string }[] = [
  { label: 'Student', value: (row) => row.name },
  { label: 'Admission No', value: (row) => row.admissionNo },
  { label: 'Class', value: (row) => row.className },
  { label: 'Roll', value: (row) => String(row.roll) },
  { label: 'Exam', value: (row) => row.exam },
  { label: 'Subject', value: (row) => row.subject },
  { label: 'Obtained', value: (row) => String(row.obtained) },
  { label: 'Max', value: (row) => String(row.max) },
  { label: 'Percentage', value: (row) => String(row.percentage) },
  { label: 'Grade', value: (row) => row.grade },
  { label: 'Rank', value: (row) => row.rank },
  { label: 'Status', value: (row) => row.status },
];

/** `tables.js` L597–618, plus the three the engine hard-codes for itself (L400–447). */
export const actionToasts: Record<string, string> = {
  refresh: 'Results list refreshed.',
  save_view: 'Current filters saved as a new view.',
  view: 'Result details opened.',
  publish: 'Selected results published.',
  publish_results: 'Selected results published to portals.',
  analysis: 'Result analysis opened.',
  profile: 'Student profile opened.',
  answer_sheet: 'Answer sheet opened.',
  remarks: 'Remarks opened for this result.',
  download_marksheet: 'Marksheet queued for download.',
  generate_marksheet: 'Marksheets queued for generation.',
  recalculate: 'Grades recalculated for the selection.',
  promote_review: 'Result promoted for review.',
  duplicate: 'Result duplicated as a draft.',
  reports: 'Result report opened.',
  print: 'Sending the result to the printer…',
  archive: 'Selected results archived.',
  export_excel: 'Excel workbook queued for download.',
  export_pdf: 'PDF export queued for download.',
  export_csv: 'Preparing export…',
  page: 'Loading the selected page…',
  clear_filters: 'Filters cleared.',
  reset_columns: 'All columns restored.',
};

/** `tables.js` L620 — the engine's per-page wording, in its order of use. */
export const strings = {
  recentSort: 'Showing the most recently updated exams first.',
  filterMatch: ' exams match the current filters.',
  viewMatch: ' exams in “',
  csvFile: 'exam-results.csv',
};

/** The `data-success` copy on each dialog's submit button. */
export const formToasts = {
  add: 'Result saved successfully.',
  edit: 'Marks updated successfully.',
  import: 'File queued — 10 results validated.',
};
