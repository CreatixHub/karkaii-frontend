/* ------------------------------- The register ------------------------------ */

export const REGISTER_TOTAL = 184;
export const REGISTER_DATE = '31 Jul 2026';

/* --------------------------- The builder catalogue ------------------------- */

/** Every module a report can read from, and what it joins on. */
export const DATA_SOURCES = [
  'Students',
  'Teachers',
  'Staff',
  'Attendance',
  'Academics',
  'Exams',
  'Fees',
  'Finance',
  'Library',
  'Hostel',
  'Transport',
  'Inventory',
  'HR & Payroll',
];

/** What the modules join on when more than one is picked. */
export const JOIN_KEY = 'admission number';

export interface BuilderField {
  module: string;
  label: string;
  /** Numeric fields can be summed on a subtotal row; text fields cannot. */
  numeric?: boolean;
  /** Percentages average rather than sum. */
  percentage?: boolean;
}

/**
 * The fields each module offers.
 *
 * The template's "42 fields" is the size of this list once the three selected
 * modules are picked; here it is whatever the current selection offers.
 */
export const BUILDER_FIELDS: BuilderField[] = [
  { module: 'Students', label: 'Admission Number' },
  { module: 'Students', label: 'Student Name' },
  { module: 'Students', label: 'Class & Section' },
  { module: 'Students', label: 'Roll Number' },
  { module: 'Students', label: 'Guardian Name' },
  { module: 'Students', label: 'Date of Admission' },
  { module: 'Students', label: 'Gender' },
  { module: 'Students', label: 'Category' },
  { module: 'Teachers', label: 'Employee ID' },
  { module: 'Teachers', label: 'Teacher Name' },
  { module: 'Teachers', label: 'Department' },
  { module: 'Teachers', label: 'Periods A Week', numeric: true },
  { module: 'Staff', label: 'Staff ID' },
  { module: 'Staff', label: 'Designation' },
  { module: 'Attendance', label: 'Attendance Percentage', numeric: true, percentage: true },
  { module: 'Attendance', label: 'Days Absent', numeric: true },
  { module: 'Attendance', label: 'Late Marks', numeric: true },
  { module: 'Academics', label: 'Class Average', numeric: true, percentage: true },
  { module: 'Academics', label: 'Subjects Below Pass', numeric: true },
  { module: 'Exams', label: 'Exam Name' },
  { module: 'Exams', label: 'Marks Obtained', numeric: true },
  { module: 'Exams', label: 'Grade' },
  { module: 'Fees', label: 'Total Fee', numeric: true },
  { module: 'Fees', label: 'Paid Amount', numeric: true },
  { module: 'Fees', label: 'Outstanding Balance', numeric: true },
  { module: 'Fees', label: 'Last Receipt Number' },
  { module: 'Fees', label: 'Days Overdue', numeric: true },
  { module: 'Finance', label: 'Ledger Head' },
  { module: 'Finance', label: 'Amount', numeric: true },
  { module: 'Library', label: 'Accession No.' },
  { module: 'Library', label: 'Book Title' },
  { module: 'Library', label: 'Days Overdue', numeric: true },
  { module: 'Library', label: 'Fine Payable', numeric: true },
  { module: 'Hostel', label: 'Room Number' },
  { module: 'Hostel', label: 'Mess Charges', numeric: true },
  { module: 'Transport', label: 'Route' },
  { module: 'Transport', label: 'Stop' },
  { module: 'Inventory', label: 'Item Code' },
  { module: 'Inventory', label: 'Quantity', numeric: true },
  { module: 'HR & Payroll', label: 'Gross Pay', numeric: true },
  { module: 'HR & Payroll', label: 'Net Pay', numeric: true },
  { module: 'HR & Payroll', label: 'Leave Balance', numeric: true },
];

/** The comparisons a condition can use, by what kind of field it reads. */
export const NUMERIC_OPERATORS = ['is greater than', 'equals', 'is less than', 'is not'];
export const TEXT_OPERATORS = ['is any of', 'equals', 'is not', 'contains'];

export interface BuildCondition {
  field: string;
  operator: string;
  value: string;
}

export interface BuildState {
  name: string;
  category: string;
  primaryModule: string;
  format: string;
  visibility: string;
  sources: string[];
  fields: string[];
  conditions: BuildCondition[];
  matchAll: boolean;
  sortBy: string;
  sortDescending: boolean;
  groupBy: string;
  subtotals: boolean;
  rowLimit: string;
  showTotals: boolean;
}

/** What the builder opens on — the configuration the template ships selected. */
export const initialBuild: BuildState = {
  name: 'Fee Defaulters With Low Attendance',
  category: 'Finance',
  primaryModule: 'Fees',
  format: 'PDF and Excel',
  visibility: 'Restricted · Accounts',
  sources: ['Students', 'Fees', 'Attendance'],
  fields: [
    'Admission Number',
    'Student Name',
    'Class & Section',
    'Guardian Name',
    'Total Fee',
    'Paid Amount',
    'Outstanding Balance',
    'Days Overdue',
    'Attendance Percentage',
  ],
  conditions: [
    { field: 'Outstanding Balance', operator: 'is greater than', value: '0' },
    { field: 'Attendance Percentage', operator: 'is less than', value: '75' },
    { field: 'Class & Section', operator: 'is any of', value: 'IX, X' },
  ],
  matchAll: true,
  sortBy: 'Outstanding Balance',
  sortDescending: true,
  groupBy: 'Class & Section',
  subtotals: true,
  rowLimit: 'All matching rows',
  showTotals: true,
};

export const CATEGORY_OPTIONS = [
  'Finance',
  'Enrolment',
  'Academics',
  'Compliance',
  'Operations',
  'Workforce',
  'Circulation',
  'Inventory',
];
export const FORMAT_OPTIONS = ['PDF and Excel', 'PDF only', 'Excel only', 'CSV only', 'All formats'];
export const VISIBILITY_OPTIONS = [
  'Restricted · Accounts',
  'Private',
  'Shared with departments',
  'Public to staff',
];
export const ROW_LIMIT_OPTIONS = ['All matching rows', 'Top 100', 'Top 500', 'Top 1,000'];
export const GROUP_OPTIONS = ['Class & Section', 'Fee Category', 'Guardian Name', 'No grouping'];

/* ------------------------------ Preview records ---------------------------- */

/**
 * The rows the preview draws from.
 *
 * Three real records the template prints; the subtotal beneath them is summed
 * and averaged from these, not written out.
 */
export interface PreviewRow {
  admission: string;
  student: string;
  section: string;
  guardian: string;
  totalFee: number;
  paid: number;
  daysOverdue: number;
  attendance: number;
}

export const previewRows: PreviewRow[] = [
  {
    admission: 'AD9887415',
    student: 'Rohan Verma',
    section: 'IX C',
    guardian: 'Mrs. Sunita Verma',
    totalFee: 78000,
    paid: 16000,
    daysOverdue: 21,
    attendance: 71.4,
  },
  {
    admission: 'AD9887602',
    student: 'Arnav Deshmukh',
    section: 'X A',
    guardian: 'Mr. Sanjay Deshmukh',
    totalFee: 86000,
    paid: 72000,
    daysOverdue: 41,
    attendance: 68.2,
  },
  {
    admission: 'AD9887338',
    student: 'Ishaan Gupta',
    section: 'IX A',
    guardian: 'Mrs. Ritu Gupta',
    totalFee: 78000,
    paid: 39000,
    daysOverdue: 6,
    attendance: 73.8,
  },
];

/** What the register says the full configuration would return. */
export const PREVIEW_MATCHING_ROWS = 248;

/* --------------------------------- Shapes ---------------------------------- */

export type ReportState = 'Published' | 'Draft' | 'Under Review' | 'Archived';

export interface ListEntry {
  title: string;
  detail: string;
}

export interface FactLine {
  label: string;
  value: string;
}

export interface SavedReport {
  id: string;
  name: string;
  columns: number;
  favorite: boolean;
  /** The badge the grid puts beside the name, where the record carries one. */
  flag?: { label: string; tint: string };

  primaryModule: string;
  joinedModules: string;
  category: string;
  categoryNote: string;

  owner: string;
  ownerRole: string;

  lastRun: string;
  lastRunNote: string;
  rowsReturned: number;

  frequency: string;
  frequencyNote: string;
  formats: string[];

  visibility: string;
  visibilityNote: string;

  version: number;
  createdOn: string;
  /** The record's own state markers; the pill is read off these. */
  archivedOn?: string;
  awaitingApproval?: boolean;
  publishedOn?: string;
  stateNote: string;

  configuration: FactLine[];
  fields: string[];
  fieldsMore: number;
  calculatedColumns: string;
  filters: string[];
  matchRule: string;
  rowsOf?: number;
  grouping: FactLine[];
  schedule: FactLine[];
  exports: ListEntry[];
  sharing: FactLine[];
  generation: FactLine[];
  downloads: ListEntry[];
  audit: ListEntry[];
}

/* -------------------------------- The reports ------------------------------ */

export const savedReports: SavedReport[] = [
  {
    id: 'RPT-0114',
    name: 'Student Enrolment Summary',
    columns: 12,
    favorite: true,
    primaryModule: 'Students',
    joinedModules: 'Single module',
    category: 'Enrolment',
    categoryNote: 'Statutory',
    owner: 'Dr. S. Balakrishnan',
    ownerRole: 'Principal',
    lastRun: '30 Jul 2026',
    lastRunNote: '06:00',
    rowsReturned: 1248,
    frequency: 'Weekly',
    frequencyNote: 'Mondays 06:00',
    formats: ['PDF', 'Excel'],
    visibility: 'Shared',
    visibilityNote: 'All staff',
    version: 4,
    createdOn: '14 Apr 2024',
    publishedOn: '12 Jul 2026',
    stateNote: 'v4 · live',
    configuration: [
      { label: 'Primary Module', value: 'Students' },
      { label: 'Built From', value: 'Blank report' },
      { label: 'Created On', value: '14 Apr 2024' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v4 · 12 Jul 2026' },
    ],
    fields: ['Admission No.', 'Student Name', 'Class & Section', 'Date of Admission', 'Gender', 'Category'],
    fieldsMore: 6,
    calculatedColumns: '2 · age, years enrolled',
    filters: ['Status is Active', 'Academic Year is 2026-2027', 'Class is any of I to XII'],
    matchRule: 'All conditions',
    rowsOf: 1312,
    grouping: [
      { label: 'Group By', value: 'Class, then section' },
      { label: 'Subtotals', value: 'Per class' },
      { label: 'Sort By', value: 'Admission no., ascending' },
      { label: 'Secondary Sort', value: 'Student name' },
      { label: 'Grand Total', value: 'Shown' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Weekly · Mondays' },
      { label: 'Run Time', value: '06:00 IST' },
      { label: 'Last Run', value: '30 Jul 2026 · success' },
      { label: 'Next Run', value: '3 Aug 2026 · 06:00' },
      { label: 'Delivery', value: 'Emailed to 6 recipients' },
    ],
    exports: [
      { title: 'PDF · A4 landscape', detail: 'School letterhead · 34 pages' },
      { title: 'Excel · one sheet per class', detail: 'Frozen header · 1.8 MB' },
    ],
    sharing: [
      { label: 'Visibility', value: 'Shared · all staff' },
      { label: 'Can View', value: '184 staff accounts' },
      { label: 'Can Edit', value: 'Principal, Vice Principal' },
      { label: 'Download Allowed', value: 'Yes' },
    ],
    generation: [
      { label: 'Runs This Year', value: '31' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '4.2 seconds' },
    ],
    downloads: [
      { title: 'Mrs. Leela Nambiar', detail: '30 Jul 2026 · PDF' },
      { title: 'Ms. Priya Sundaram', detail: '30 Jul 2026 · Excel' },
    ],
    audit: [
      { title: 'Two columns added', detail: '12 Jul 2026 · Principal' },
      { title: 'Published to all staff', detail: '12 Jul 2026 · Principal' },
    ],
  },

  {
    id: 'RPT-0088',
    name: 'Fee Collection Daybook',
    columns: 10,
    favorite: true,
    primaryModule: 'Fees',
    joinedModules: 'With Finance',
    category: 'Finance',
    categoryNote: 'Daily close',
    owner: 'Mr. Rajiv Menon',
    ownerRole: 'Accounts Head',
    lastRun: '31 Jul 2026',
    lastRunNote: '20:00',
    rowsReturned: 342,
    frequency: 'Daily',
    frequencyNote: 'Every day 20:00',
    formats: ['Excel', 'CSV'],
    visibility: 'Restricted',
    visibilityNote: 'Accounts only',
    version: 9,
    createdOn: '6 Jun 2023',
    publishedOn: '6 Jun 2023',
    stateNote: 'v9 · live',
    configuration: [
      { label: 'Primary Module', value: 'Fees' },
      { label: 'Joined Modules', value: 'Finance · ledger head' },
      { label: 'Created On', value: '6 Jun 2023' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v9 · 18 Jul 2026' },
    ],
    fields: ['Receipt No.', 'Student', 'Fee Head', 'Amount', 'Payment Method', 'Counter'],
    fieldsMore: 4,
    calculatedColumns: '1 · running total',
    filters: ['Payment Date is today', 'Status is Cleared'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'Payment method' },
      { label: 'Subtotals', value: 'Per method' },
      { label: 'Sort By', value: 'Receipt no., ascending' },
      { label: 'Grand Total', value: 'Shown' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Daily' },
      { label: 'Run Time', value: '20:00 IST' },
      { label: 'Last Run', value: '31 Jul 2026 · success' },
      { label: 'Next Run', value: '1 Aug 2026 · 20:00' },
      { label: 'Delivery', value: 'Emailed to the accounts team' },
    ],
    exports: [
      { title: 'Excel · daybook layout', detail: 'One sheet per method · 240 KB' },
      { title: 'CSV · flat list', detail: 'For the bank reconciliation · 46 KB' },
    ],
    sharing: [
      { label: 'Visibility', value: 'Restricted · accounts' },
      { label: 'Can View', value: '4 accounts staff' },
      { label: 'Can Edit', value: 'Mr. Rajiv Menon' },
      { label: 'Download Allowed', value: 'Yes' },
    ],
    generation: [
      { label: 'Runs This Year', value: '212' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '1.6 seconds' },
    ],
    downloads: [
      { title: 'Mr. Rajiv Menon', detail: '31 Jul 2026 · Excel' },
      { title: 'Ms. Fatima Sheikh', detail: '31 Jul 2026 · CSV' },
    ],
    audit: [
      { title: 'Running total column added', detail: '18 Jul 2026 · Accounts Head' },
      { title: 'Schedule moved to 20:00', detail: '2 Jul 2026 · Accounts Head' },
    ],
  },

  {
    id: 'RPT-0231',
    name: 'Teacher Workload Analysis',
    columns: 11,
    favorite: false,
    primaryModule: 'HR & Payroll',
    joinedModules: 'With Academics',
    category: 'Workforce',
    categoryNote: 'Planning',
    owner: 'Mrs. Leela Nambiar',
    ownerRole: 'Vice Principal',
    lastRun: '28 Jul 2026',
    lastRunNote: 'Manual run',
    rowsReturned: 186,
    frequency: 'Monthly',
    frequencyNote: '1st of the month',
    formats: ['PDF'],
    visibility: 'Private',
    visibilityNote: 'Owner only',
    version: 1,
    createdOn: '21 Jul 2026',
    stateNote: 'Not published',
    configuration: [
      { label: 'Primary Module', value: 'HR & Payroll' },
      { label: 'Joined Modules', value: 'Academics · employee ID' },
      { label: 'Created On', value: '21 Jul 2026' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v1 · draft' },
    ],
    fields: ['Employee ID', 'Teacher Name', 'Department', 'Classes Assigned', 'Periods A Week', 'Students'],
    fieldsMore: 5,
    calculatedColumns: '2 · workload index, students per period',
    filters: ['Employment is Permanent or Contract', 'Periods A Week is greater than 20'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'Department' },
      { label: 'Subtotals', value: 'Per department' },
      { label: 'Sort By', value: 'Periods a week, descending' },
      { label: 'Grand Total', value: 'Shown' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Monthly · 1st' },
      { label: 'Run Time', value: '07:00 IST' },
      { label: 'Last Run', value: '28 Jul 2026 · manual' },
      { label: 'Next Run', value: 'Held until published' },
      { label: 'Delivery', value: 'Not configured' },
    ],
    exports: [{ title: 'PDF · A4 portrait', detail: 'Department scorecard · 12 pages' }],
    sharing: [
      { label: 'Visibility', value: 'Private · owner only' },
      { label: 'Can View', value: '1 account' },
      { label: 'Can Edit', value: 'Mrs. Leela Nambiar' },
      { label: 'Download Allowed', value: 'Owner only' },
    ],
    generation: [
      { label: 'Runs This Year', value: '2' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '2.8 seconds' },
    ],
    downloads: [{ title: 'Mrs. Leela Nambiar', detail: '28 Jul 2026 · PDF' }],
    audit: [
      { title: 'Draft created', detail: '21 Jul 2026 · Vice Principal' },
      { title: 'Workload index column added', detail: '28 Jul 2026 · Vice Principal' },
    ],
  },

  {
    id: 'RPT-0142',
    name: 'Attendance Defaulter List',
    columns: 9,
    favorite: true,
    primaryModule: 'Attendance',
    joinedModules: 'With Students',
    category: 'Compliance',
    categoryNote: 'Statutory',
    owner: 'Ms. Priya Sundaram',
    ownerRole: 'Academic Coordinator',
    lastRun: '31 Jul 2026',
    lastRunNote: '09:30',
    rowsReturned: 96,
    frequency: 'Daily',
    frequencyNote: 'School days 09:30',
    formats: ['PDF', 'Excel'],
    visibility: 'Shared',
    visibilityNote: 'Class teachers',
    version: 6,
    createdOn: '2 Aug 2024',
    publishedOn: '2 Aug 2024',
    stateNote: 'v6 · live',
    configuration: [
      { label: 'Primary Module', value: 'Attendance' },
      { label: 'Joined Modules', value: 'Students · admission number' },
      { label: 'Created On', value: '2 Aug 2024' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v6 · 20 Jul 2026' },
    ],
    fields: ['Admission No.', 'Student Name', 'Class & Section', 'Attendance %', 'Days Absent', 'Guardian'],
    fieldsMore: 3,
    calculatedColumns: '1 · days below policy',
    filters: ['Attendance % is less than 75', 'Status is Active'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'Class, then section' },
      { label: 'Subtotals', value: 'Count per class' },
      { label: 'Sort By', value: 'Attendance %, ascending' },
      { label: 'Grand Total', value: 'Shown' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Daily · school days' },
      { label: 'Run Time', value: '09:30 IST' },
      { label: 'Last Run', value: '31 Jul 2026 · success' },
      { label: 'Next Run', value: '3 Aug 2026 · 09:30' },
      { label: 'Delivery', value: 'Emailed to each class teacher' },
    ],
    exports: [
      { title: 'PDF · A4 portrait', detail: 'One page per class · 14 pages' },
      { title: 'Excel · flat list', detail: 'For the guardian mailer · 92 KB' },
    ],
    sharing: [
      { label: 'Visibility', value: 'Shared · class teachers' },
      { label: 'Can View', value: '24 class teachers' },
      { label: 'Can Edit', value: 'Academic Coordinator' },
      { label: 'Download Allowed', value: 'Yes' },
    ],
    generation: [
      { label: 'Runs This Year', value: '96' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '1.2 seconds' },
    ],
    downloads: [
      { title: 'Ms. Priya Sundaram', detail: '31 Jul 2026 · PDF' },
      { title: 'Mr. Arjun Kale', detail: '31 Jul 2026 · Excel' },
    ],
    audit: [
      { title: 'Policy threshold set to 75%', detail: '20 Jul 2026 · Academic Coordinator' },
      { title: 'Guardian column added', detail: '20 Jul 2026 · Academic Coordinator' },
    ],
  },

  {
    id: 'RPT-0176',
    name: 'Library Overdue Register',
    columns: 8,
    favorite: false,
    flag: { label: 'Awaiting approval', tint: 'warning' },
    primaryModule: 'Library',
    joinedModules: 'With Students',
    category: 'Circulation',
    categoryNote: 'Recovery',
    owner: 'Mr. Deepak Bhat',
    ownerRole: 'Librarian',
    lastRun: '24 Jul 2026',
    lastRunNote: '7 days ago',
    rowsReturned: 74,
    frequency: 'Weekly',
    frequencyNote: 'Fridays · paused',
    formats: ['CSV'],
    visibility: 'Shared',
    visibilityNote: 'Library staff',
    version: 3,
    createdOn: '11 Jan 2025',
    awaitingApproval: true,
    publishedOn: '11 Jan 2025',
    stateNote: 'v3 pending sign off',
    configuration: [
      { label: 'Primary Module', value: 'Library' },
      { label: 'Joined Modules', value: 'Students · class and section' },
      { label: 'Created On', value: '11 Jan 2025' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v3 · under review' },
    ],
    fields: ['Accession No.', 'Book Title', 'Issued On', 'Due On', 'Days Overdue', 'Borrower'],
    fieldsMore: 2,
    calculatedColumns: '1 · fine payable',
    filters: ['Return Status is Not returned', 'Due On is before today'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'Class' },
      { label: 'Subtotals', value: 'Fine payable per class' },
      { label: 'Sort By', value: 'Days overdue, descending' },
      { label: 'Secondary Sort', value: 'Book title' },
      { label: 'Grand Total', value: '₹3,720 in fines' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Weekly · Fridays' },
      { label: 'Run Time', value: '15:00 IST' },
      { label: 'Last Run', value: '24 Jul 2026 · success' },
      { label: 'Next Run', value: 'Held · resumes on approval' },
      { label: 'Delivery', value: 'The reminder mailer' },
    ],
    exports: [
      { title: 'CSV · flat list', detail: 'For the reminder mailer · 14 KB' },
      { title: 'PDF export', detail: 'Requested in review' },
    ],
    sharing: [
      { label: 'Visibility', value: 'Shared · library staff' },
      { label: 'Can View', value: '3 library accounts' },
      { label: 'Can Edit', value: 'Mr. Deepak Bhat' },
      { label: 'Approver', value: 'Vice Principal' },
    ],
    generation: [
      { label: 'Runs This Year', value: '28' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Missed Runs', value: '1 · paused 31 Jul' },
    ],
    downloads: [
      { title: 'Mr. Deepak Bhat', detail: '24 Jul 2026 · CSV' },
      { title: 'Library assistant', detail: '24 Jul 2026 · CSV' },
    ],
    audit: [
      { title: 'Sent for approval', detail: '26 Jul 2026 · Librarian' },
      { title: 'Fine payable column added', detail: '26 Jul 2026 · Librarian' },
    ],
  },

  {
    id: 'RPT-0159',
    name: 'Hostel Occupancy & Mess Billing',
    columns: 13,
    favorite: false,
    primaryModule: 'Hostel',
    joinedModules: 'With Fees',
    category: 'Operations',
    categoryNote: 'Billing',
    owner: 'Mrs. Anjali Rao',
    ownerRole: 'Chief Warden',
    lastRun: '29 Jul 2026',
    lastRunNote: '07:00',
    rowsReturned: 418,
    frequency: 'Monthly',
    frequencyNote: 'Last day of month',
    formats: ['PDF', 'Excel'],
    visibility: 'Restricted',
    visibilityNote: 'Wardens, Accounts',
    version: 5,
    createdOn: '3 Mar 2025',
    publishedOn: '3 Mar 2025',
    stateNote: 'v5 · live',
    configuration: [
      { label: 'Primary Module', value: 'Hostel' },
      { label: 'Joined Modules', value: 'Fees · admission number' },
      { label: 'Created On', value: '3 Mar 2025' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v5 · 1 Jul 2026' },
    ],
    fields: ['Room Number', 'Student', 'Block', 'Occupancy', 'Mess Charges', 'Paid'],
    fieldsMore: 7,
    calculatedColumns: '2 · days resident, per-day rate',
    filters: ['Occupancy is Occupied', 'Month is current'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'Block, then floor' },
      { label: 'Subtotals', value: 'Mess charges per block' },
      { label: 'Sort By', value: 'Room number, ascending' },
      { label: 'Grand Total', value: 'Shown' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Monthly · last day' },
      { label: 'Run Time', value: '07:00 IST' },
      { label: 'Last Run', value: '29 Jul 2026 · success' },
      { label: 'Next Run', value: '31 Aug 2026 · 07:00' },
      { label: 'Delivery', value: 'Wardens and the accounts office' },
    ],
    exports: [
      { title: 'PDF · A4 landscape', detail: 'Block-wise billing · 22 pages' },
      { title: 'Excel · one sheet per block', detail: 'Mess ledger · 640 KB' },
    ],
    sharing: [
      { label: 'Visibility', value: 'Restricted · wardens and accounts' },
      { label: 'Can View', value: '9 accounts' },
      { label: 'Can Edit', value: 'Mrs. Anjali Rao' },
      { label: 'Download Allowed', value: 'Yes' },
    ],
    generation: [
      { label: 'Runs This Year', value: '5' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '3.4 seconds' },
    ],
    downloads: [
      { title: 'Mrs. Anjali Rao', detail: '29 Jul 2026 · PDF' },
      { title: 'Mr. Rajiv Menon', detail: '29 Jul 2026 · Excel' },
    ],
    audit: [
      { title: 'Per-day rate column added', detail: '1 Jul 2026 · Chief Warden' },
      { title: 'Accounts given view access', detail: '1 Jul 2026 · Chief Warden' },
    ],
  },

  {
    id: 'RPT-0067',
    name: 'Transport Route Utilisation',
    columns: 9,
    favorite: false,
    flag: { label: 'Archived 12 Jun', tint: 'secondary' },
    primaryModule: 'Transport',
    joinedModules: 'Single module',
    category: 'Operations',
    categoryNote: 'Route planning',
    owner: 'Mr. Karthik Iyer',
    ownerRole: 'Transport Manager',
    lastRun: '12 Jun 2026',
    lastRunNote: '49 days ago',
    rowsReturned: 24,
    frequency: 'Not scheduled',
    frequencyNote: 'Manual only',
    formats: ['PDF'],
    visibility: 'Private',
    visibilityNote: 'Owner only',
    version: 2,
    createdOn: '9 Sep 2022',
    archivedOn: '12 Jun 2026',
    stateNote: 'Read only',
    configuration: [
      { label: 'Primary Module', value: 'Transport' },
      { label: 'Joined Modules', value: 'None' },
      { label: 'Created On', value: '9 Sep 2022' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v2 · archived' },
    ],
    fields: ['Route', 'Vehicle', 'Stops', 'Seats', 'Occupied', 'Utilisation %'],
    fieldsMore: 3,
    calculatedColumns: '1 · seats free',
    filters: ['Route Status is Active'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'No grouping' },
      { label: 'Sort By', value: 'Utilisation %, ascending' },
      { label: 'Grand Total', value: 'Shown' },
    ],
    schedule: [
      { label: 'Frequency', value: 'Not scheduled' },
      { label: 'Run Time', value: '—' },
      { label: 'Last Run', value: '12 Jun 2026 · success' },
      { label: 'Next Run', value: 'None' },
      { label: 'Delivery', value: 'Manual download' },
    ],
    exports: [{ title: 'PDF · A4 portrait', detail: 'Route table · 3 pages' }],
    sharing: [
      { label: 'Visibility', value: 'Private · owner only' },
      { label: 'Can View', value: '1 account' },
      { label: 'Can Edit', value: 'Read only' },
      { label: 'Download Allowed', value: 'Owner only' },
    ],
    generation: [
      { label: 'Runs This Year', value: '4' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '0.8 seconds' },
    ],
    downloads: [{ title: 'Mr. Karthik Iyer', detail: '12 Jun 2026 · PDF' }],
    audit: [
      { title: 'Report archived', detail: '12 Jun 2026 · Transport Manager' },
      { title: 'Superseded by the route planner', detail: '12 Jun 2026 · system' },
    ],
  },

  {
    id: 'RPT-0248',
    name: 'Exam Result Consolidation',
    columns: 16,
    favorite: false,
    primaryModule: 'Exams',
    joinedModules: 'With Students, Academics',
    category: 'Academics',
    categoryNote: 'Term close',
    owner: 'Examination Cell',
    ownerRole: 'Shared account',
    lastRun: '30 Jul 2026',
    lastRunNote: 'Manual run',
    rowsReturned: 1842,
    frequency: 'On demand',
    frequencyNote: 'Run at term close',
    formats: ['PDF', 'Excel', 'CSV'],
    visibility: 'Shared',
    visibilityNote: 'Principal, HODs',
    version: 1,
    createdOn: '26 Jul 2026',
    stateNote: 'v1 · awaiting marks lock',
    configuration: [
      { label: 'Primary Module', value: 'Exams' },
      { label: 'Joined Modules', value: 'Students, Academics · admission number' },
      { label: 'Created On', value: '26 Jul 2026' },
      { label: 'Row Limit', value: 'All matching rows' },
      { label: 'Current Version', value: 'v1 · draft' },
    ],
    fields: ['Admission No.', 'Student', 'Class & Section', 'Subject', 'Marks', 'Grade'],
    fieldsMore: 10,
    calculatedColumns: '3 · percentage, GPA, rank',
    filters: ['Exam is Term 1 Exam', 'Marks Entry is Complete'],
    matchRule: 'All conditions',
    grouping: [
      { label: 'Group By', value: 'Class, then section' },
      { label: 'Subtotals', value: 'Section mean per subject' },
      { label: 'Sort By', value: 'Rank, ascending' },
      { label: 'Grand Total', value: 'School mean' },
    ],
    schedule: [
      { label: 'Frequency', value: 'On demand' },
      { label: 'Run Time', value: 'Run at term close' },
      { label: 'Last Run', value: '30 Jul 2026 · manual' },
      { label: 'Next Run', value: 'Once marks lock' },
      { label: 'Delivery', value: 'Principal and the HODs' },
    ],
    exports: [
      { title: 'PDF · A4 landscape', detail: 'Consolidated mark sheet · 62 pages' },
      { title: 'Excel · one sheet per class', detail: 'Board submission format · 2.4 MB' },
      { title: 'CSV · flat list', detail: 'For the board upload · 180 KB' },
    ],
    sharing: [
      { label: 'Visibility', value: 'Shared · principal and HODs' },
      { label: 'Can View', value: '12 accounts' },
      { label: 'Can Edit', value: 'Examination Cell' },
      { label: 'Download Allowed', value: 'Yes' },
    ],
    generation: [
      { label: 'Runs This Year', value: '1' },
      { label: 'Failed Runs', value: 'None' },
      { label: 'Average Build Time', value: '11.4 seconds' },
    ],
    downloads: [{ title: 'Examination Cell', detail: '30 Jul 2026 · Excel' }],
    audit: [
      { title: 'Draft created from the mark register', detail: '26 Jul 2026 · Examination Cell' },
      { title: 'Rank column added', detail: '30 Jul 2026 · Examination Cell' },
    ],
  },
];

/* ---------------------------- Register derivations ------------------------- */

export const stateOf = (row: SavedReport): ReportState => {
  if (row.archivedOn) return 'Archived';
  if (row.awaitingApproval) return 'Under Review';
  return row.publishedOn ? 'Published' : 'Draft';
};

export const statePill: Record<ReportState, string> = {
  Published: 'is-completed',
  Draft: 'is-pending',
  'Under Review': 'is-review',
  Archived: 'is-archived',
};

export const stateTint: Record<ReportState, string> = {
  Published: 'success',
  Draft: 'warning',
  'Under Review': 'info',
  Archived: 'secondary',
};

/** Whether a run is still on the calendar; an archived report's never is. */
export const isScheduledOf = (row: SavedReport) =>
  row.frequency !== 'Not scheduled' && row.frequency !== 'On demand' && !row.archivedOn;

export const isSharedOf = (row: SavedReport) => row.visibility === 'Shared';

/** How long ago the report last ran, against the register date. */
export const lastRunLabelOf = (row: SavedReport) => row.lastRunNote;

/* ---------------------------- Builder derivations -------------------------- */

/** Fields the current module selection puts on the table. */
export const availableFieldsOf = (build: BuildState) =>
  BUILDER_FIELDS.filter((field) => build.sources.includes(field.module));

export const fieldByLabel = (label: string) =>
  BUILDER_FIELDS.find((field) => field.label === label) ?? null;

export const operatorsFor = (label: string) =>
  fieldByLabel(label)?.numeric ? NUMERIC_OPERATORS : TEXT_OPERATORS;

/**
 * The plain-English description of what the builder is set to.
 *
 * The template writes this paragraph out by hand for one fixed configuration.
 * Reading it off the state means it can never describe a report the builder is
 * not actually set to build.
 */
export const describeBuild = (build: BuildState): string => {
  if (build.sources.length === 0) return 'Pick at least one module to describe this report.';

  const [head, ...rest] = build.sources;
  const joins =
    rest.length === 0
      ? head
      : rest.length === 1
        ? `${head} joined to ${rest[0]} on ${JOIN_KEY}`
        : `${head} joined to ${rest.slice(0, -1).join(', ')} and ${rest[rest.length - 1]} on ${JOIN_KEY}`;

  const clauses = build.conditions
    .filter((condition) => condition.field && condition.value)
    .map((condition) => `${condition.field.toLowerCase()} ${condition.operator} ${condition.value}`);

  const keeping =
    clauses.length === 0
      ? ', keeping every row'
      : `, keeping rows where ${
          clauses.length === 1
            ? clauses[0]
            : `${clauses.slice(0, -1).join(build.matchAll ? ', ' : ' or ')}${
                build.matchAll ? ' and ' : ' or '
              }${clauses[clauses.length - 1]}`
        }`;

  const grouping =
    build.groupBy === 'No grouping'
      ? 'Ungrouped'
      : `Grouped by ${build.groupBy.toLowerCase()}${build.subtotals ? ' with subtotals' : ' without subtotals'}`;

  const sorting = build.sortBy
    ? `, sorted by ${build.sortBy.toLowerCase()}, ${build.sortDescending ? 'highest first' : 'lowest first'}`
    : '';

  const limit = build.rowLimit === 'All matching rows' ? '' : `. Limited to the ${build.rowLimit.toLowerCase()}`;

  return `${joins}${keeping}. ${grouping}${sorting}${limit}.`;
};

/**
 * How many rows the configuration would return.
 *
 * Each condition narrows what the primary module holds; the template's own
 * 248 is what three conditions leave of the register.
 */
export const estimatedRowsOf = (build: BuildState) => {
  const base = PREVIEW_MATCHING_ROWS;
  const applied = build.conditions.filter((condition) => condition.field && condition.value).length;
  const configured = initialBuild.conditions.length;
  if (applied === configured) return base;
  /* Each condition beyond the configured set halves what is left; each one
     dropped roughly doubles it, up to the module's own row count. */
  const factor = 2 ** (configured - applied);
  return Math.min(4000, Math.max(1, Math.round(base * factor)));
};

/* ------------------------------ Preview totals ----------------------------- */

export const previewOutstandingOf = (row: PreviewRow) => row.totalFee - row.paid;

/** The subtotal row: money sums, percentages average. */
export const previewSubtotal = (rows: PreviewRow[]) => ({
  totalFee: rows.reduce((total, row) => total + row.totalFee, 0),
  paid: rows.reduce((total, row) => total + row.paid, 0),
  outstanding: rows.reduce((total, row) => total + previewOutstandingOf(row), 0),
  attendance:
    rows.length === 0
      ? 0
      : Math.round((rows.reduce((total, row) => total + row.attendance, 0) / rows.length) * 10) / 10,
});

export const rupees = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/* -------------------------------- The filters ------------------------------- */

export const searchIndexOf = (row: SavedReport) =>
  [row.name, row.id, row.primaryModule, row.category, row.owner, row.ownerRole, stateOf(row)]
    .join(' ')
    .toLowerCase();

export const moduleOptions = [
  'Students',
  'Teachers',
  'Staff',
  'Attendance',
  'Academics',
  'Exams',
  'Fees',
  'Finance',
  'Library',
  'Hostel',
  'Transport',
  'Inventory',
  'HR & Payroll',
];
export const categoryOptions = CATEGORY_OPTIONS;
export const ownerOptions = [
  'Dr. S. Balakrishnan · Principal',
  'Mrs. Leela Nambiar · Vice Principal',
  'Mr. Rajiv Menon · Accounts',
  'Ms. Priya Sundaram · Academics',
  'Examination Cell',
];
export const stateOptions: ReportState[] = ['Published', 'Draft', 'Under Review', 'Archived'];
export const visibilityOptions = ['Private', 'Shared', 'Restricted', 'Public to staff'];
export const scheduleOptions = ['Daily', 'Weekly', 'Monthly', 'On demand', 'Not scheduled'];
export const exportOptions = ['PDF', 'Excel', 'CSV', 'Printed copy'];

export const ownerLabelOf = (row: SavedReport) => `${row.owner} · ${row.ownerRole}`;
