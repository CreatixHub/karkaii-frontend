export type ReportStatus = 'Ready' | 'Generating' | 'Scheduled' | 'Failed' | 'Archived';

export type ReportType =
  | 'Book Inventory'
  | 'Issued Books'
  | 'Returned Books'
  | 'Overdue Books'
  | 'Lost Books'
  | 'Fine Collection'
  | 'Popular Books'
  | 'Member Activity';

export type ReportFormat = 'PDF' | 'Excel' | 'CSV';

export interface Pair {
  label: string;
  value: string;
}

/** One entry of the expander's Download History block. */
export interface Download {
  who: string;
  /** The template's second line, e.g. "31 Jul 2026 · Excel". */
  meta: string;
}

export interface LibraryReport {
  id: string;
  name: string;
  type: ReportType;
  /** Printed twice — the Date Range cell and the name's `dt-sub`. */
  dateRange: string;
  generatedBy: string;
  generatedRole: string;
  generatedDate: string;
  generatedTime: string;
  format: ReportFormat;
  status: ReportStatus;
  /** Catalogue categories this run covers; drives the Category filter. */
  categories: string[];
  /** Member types this run covers; empty for runs that are not member-scoped. */
  memberTypes: string[];
  summary: Pair[];
  appliedFilters: Pair[];
  stats: Pair[];
  downloads: Download[];
  /** The Scheduled Reports badge — "Monthly", "Quarterly", "Paused". */
  scheduleBadge: string;
  scheduleBadgeTint: string;
  /** The clause after the badge, e.g. "on the last day at 06:00 PM". */
  scheduleWhen: string;
  /** The trailing "· next …" date, null where the template omits it. */
  scheduleNext: string | null;
  notes: string;
  /** Preview-panel figures. */
  pages: number;
  fileSize: string;
}

/* --------------------------------- Vocabulary -------------------------------- */

export const statusPill: Record<ReportStatus, string> = {
  Ready: 'is-active',
  Generating: 'is-pending',
  Scheduled: 'is-review',
  Failed: 'is-blocked',
  Archived: 'is-archived',
};

/**
 * `dt-pill` leads with either a dot or an icon and it differs per status across
 * the library pages. On this one the template gives every status a dot, so
 * every entry is null — the branch stays so the map can grow.
 */
export const statusIcon: Record<ReportStatus, string | null> = {
  Ready: null,
  Generating: null,
  Scheduled: null,
  Failed: null,
  Archived: null,
};

export const statusBadge: Record<ReportStatus, string> = {
  Ready: 'badge badge-soft-success',
  Generating: 'badge badge-soft-warning',
  Scheduled: 'badge badge-soft-info',
  Failed: 'badge badge-soft-danger',
  Archived: 'badge badge-soft-secondary',
};

/** Shared by the report-category card, the row avatar and the type badge. */
export const typeTint: Record<ReportType, string> = {
  'Book Inventory': 'primary',
  'Issued Books': 'success',
  'Returned Books': 'info',
  'Overdue Books': 'warning',
  'Lost Books': 'danger',
  'Fine Collection': 'purple',
  'Popular Books': 'pink',
  'Member Activity': 'secondary',
};

export const typeIcon: Record<ReportType, string> = {
  'Book Inventory': 'ti ti-books',
  'Issued Books': 'ti ti-book',
  'Returned Books': 'ti ti-arrow-back-up',
  'Overdue Books': 'ti ti-alert-triangle',
  'Lost Books': 'ti ti-alert-octagon',
  'Fine Collection': 'ti ti-cash',
  'Popular Books': 'ti ti-star',
  'Member Activity': 'ti ti-users',
};

export const typeBadge = (type: ReportType): string => `badge badge-soft-${typeTint[type]}`;

export const formatIcon: Record<ReportFormat, string> = {
  PDF: 'ti ti-file-type-pdf',
  Excel: 'ti ti-file-type-xls',
  CSV: 'ti ti-file-type-csv',
};

export const formatTint: Record<ReportFormat, string> = {
  PDF: 'danger',
  Excel: 'success',
  CSV: 'info',
};

/* ------------------------------ Filter options ------------------------------ */

export const reportTypeOptions: ReportType[] = [
  'Book Inventory', 'Issued Books', 'Returned Books', 'Overdue Books',
  'Lost Books', 'Fine Collection', 'Popular Books', 'Member Activity',
];

export const categoryOptions = [
  'Academic Books', 'Reference Books', 'Fiction', 'Non-Fiction',
  'Digital Resources', 'Journals', 'Magazines',
];

export const statusOptions: ReportStatus[] = ['Ready', 'Generating', 'Scheduled', 'Failed', 'Archived'];

export const formatOptions: ReportFormat[] = ['PDF', 'Excel', 'CSV'];

export const generatedByOptions = ['Mary Winsler', 'Anita Rao', 'Scheduler'];

export const memberTypeOptions = ['Students', 'Teaching Staff', 'Support Staff'];

/** The three report types the "Circulation" quick filter covers. */
export const CIRCULATION_TYPES: ReportType[] = ['Issued Books', 'Returned Books', 'Overdue Books'];

/* -------------------------------- Derivations ------------------------------- */

export const isCirculation = (row: LibraryReport): boolean => CIRCULATION_TYPES.includes(row.type);

/** "Monthly on the last day at 06:00 PM · next 31 Aug 2026". */
export const scheduleLine = (row: LibraryReport): string =>
  row.scheduleNext ? `${row.scheduleWhen} · next ${row.scheduleNext}` : row.scheduleWhen;

/** The Schedule dialog's "Currently quarterly at period close" line. */
export const scheduleSummary = (row: LibraryReport): string =>
  `Currently ${row.scheduleBadge.toLowerCase()} ${row.scheduleWhen}`;

export const pairValue = (pairs: Pair[], label: string): string =>
  pairs.find((pair) => pair.label === label)?.value ?? '—';

export const searchIndexOf = (row: LibraryReport): string =>
  `${row.name} ${row.type} ${row.generatedBy} ${row.generatedRole} ${row.dateRange} ${row.format} ${row.status}`
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "31 Jul 2026" → 20260731. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** The filter panel's `datetimepicker` format, "01-07-2026" → 20260701. */
export const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-');
  if (!day || !month || !year) return 0;
  return Number(year) * 10000 + Number(month) * 100 + Number(day);
};

/** "06:40 PM" → 1240, so the newest-first sort separates same-day runs. */
const minuteKey = (value: string): number => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/.exec(value.trim());
  if (!match) return 0;
  const hour = Number(match[1]) % 12 + (match[3] === 'PM' ? 12 : 0);
  return hour * 100 + Number(match[2]);
};

export const generatedKey = (row: LibraryReport): number =>
  dateKey(row.generatedDate) * 10000 + minuteKey(row.generatedTime);

/** "06:00" from the Schedule dialog's `<input type="time">` → "06:00 AM". */
export const to12Hour = (value: string): string => {
  const [rawHour, minute] = value.split(':');
  const hour = Number(rawHour);
  if (Number.isNaN(hour)) return value;
  const suffix = hour < 12 ? 'AM' : 'PM';
  const shown = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(shown).padStart(2, '0')}:${minute ?? '00'} ${suffix}`;
};

/* ------------------------- The catalogue the reports read ------------------------ */

export interface CatalogueRow {
  category: string;
  code: string;
  shelf: string;
  tint: string;
  icon: string;
  total: number;
  /** Null where the template prints an em dash. */
  available: number | null;
  issued: number | null;
  overdue: number | null;
}

/**
 * The eight-category breakdown the View Report dialog prints for the Book
 * Inventory run, and the source of the preview panel's Included Records block.
 */
export const catalogueRows: CatalogueRow[] = [
  { category: 'Academic Books', code: 'CAT-001', shelf: 'A1 – A6', tint: 'primary', icon: 'ti ti-book', total: 1842, available: 1516, issued: 326, overdue: 18 },
  { category: 'Reference Books', code: 'CAT-002', shelf: 'B1 – B3', tint: 'info', icon: 'ti ti-bookmarks', total: 624, available: 612, issued: 12, overdue: null },
  { category: 'Fiction', code: 'CAT-003', shelf: 'C1 – C5', tint: 'success', icon: 'ti ti-books', total: 968, available: 704, issued: 264, overdue: 24 },
  { category: 'Non-Fiction', code: 'CAT-004', shelf: 'C6 – C8', tint: 'warning', icon: 'ti ti-file-text', total: 712, available: 598, issued: 114, overdue: 6 },
  { category: 'Digital Resources', code: 'CAT-005', shelf: 'Digital', tint: 'purple', icon: 'ti ti-world', total: 386, available: 386, issued: null, overdue: null },
  { category: 'Journals', code: 'CAT-006', shelf: 'B2', tint: 'pink', icon: 'ti ti-news', total: 148, available: 142, issued: 6, overdue: null },
  { category: 'Magazines', code: 'CAT-007', shelf: 'B3', tint: 'secondary', icon: 'ti ti-report', total: 92, available: 78, issued: 14, overdue: 4 },
  { category: 'Rare & Archived', code: 'CAT-008', shelf: 'Vault', tint: 'danger', icon: 'ti ti-archive', total: 214, available: null, issued: null, overdue: null },
];

const sum = (pick: (entry: CatalogueRow) => number | null): number =>
  catalogueRows.reduce((running, entry) => running + (pick(entry) ?? 0), 0);

/** The template's Total row, summed rather than repeated. */
export const catalogueTotals = {
  total: sum((entry) => entry.total),
  available: sum((entry) => entry.available),
  issued: sum((entry) => entry.issued),
  overdue: sum((entry) => entry.overdue),
};

export const catalogueEntry = (label: string): CatalogueRow | undefined =>
  catalogueRows.find((entry) => entry.category === label);

export const count = (value: number): string => value.toLocaleString('en-US');

/** The template's em dash for a figure the report never produced. */
export const figure = (value: number | null): string => (value === null ? '—' : count(value));

/* --------------------------- The report category cards -------------------------- */

export interface ReportTile {
  type: ReportType;
  /** The card's second line — the period the headline figure covers. */
  sub: string;
  /**
   * The headline figure. Seven of the eight repeat a figure from the matching
   * report's Report Summary; "Returned Books" has none, because the only
   * returned-books run in the roster failed before it produced one.
   */
  value: string;
}

export const reportTiles: ReportTile[] = [
  { type: 'Book Inventory', sub: 'As on 31 Jul', value: '4,986 titles' },
  { type: 'Issued Books', sub: 'Jul 2026', value: '1,150 issues' },
  { type: 'Returned Books', sub: 'Jul 2026', value: '1,098 returns' },
  { type: 'Overdue Books', sub: 'As on 31 Jul', value: '52 overdue' },
  { type: 'Lost Books', sub: 'FY 2026 – 27', value: '18 declared' },
  { type: 'Fine Collection', sub: 'Jul 2026', value: '$486 collected' },
  { type: 'Popular Books', sub: 'Jul 2026', value: 'Top 50 titles' },
  { type: 'Member Activity', sub: 'Jul 2026', value: '862 members' },
];

/** The three rows of the preview panel's Export Formats block. */
export const exportFormats: { format: ReportFormat; label: string; note: string }[] = [
  { format: 'Excel', label: 'Excel Workbook', note: 'Editable catalogue' },
  { format: 'PDF', label: 'PDF Document', note: 'Formatted for print' },
  { format: 'CSV', label: 'CSV File', note: 'Raw data for import' },
];

/* ----------------------------------- Rows ----------------------------------- */

const ALL_CATEGORIES = categoryOptions;
const ALL_MEMBERS = memberTypeOptions;

export const libraryReports: LibraryReport[] = [
  {
    id: 'LR-001',
    name: 'Book Inventory — Full Catalogue',
    type: 'Book Inventory',
    dateRange: 'As on 31 Jul 2026',
    generatedBy: 'Mary Winsler',
    generatedRole: 'Head Librarian',
    generatedDate: '31 Jul 2026',
    generatedTime: '06:40 PM',
    format: 'Excel',
    status: 'Ready',
    categories: ALL_CATEGORIES,
    memberTypes: [],
    summary: [
      { label: 'Total Titles', value: '4,986' },
      { label: 'Total Copies', value: '6,142' },
      { label: 'Available Copies', value: '4,894' },
      { label: 'Categories Covered', value: '32' },
    ],
    appliedFilters: [
      { label: 'Category', value: 'All' },
      { label: 'Status', value: 'All' },
      { label: 'Shelf', value: 'All racks' },
      { label: 'Include Archived', value: 'Yes' },
    ],
    stats: [
      { label: 'Academic Books', value: '1,842' },
      { label: 'Fiction', value: '968' },
      { label: 'Non-Fiction', value: '712' },
      { label: 'Reference & Digital', value: '1,010' },
    ],
    downloads: [
      { who: 'mary.winsler@school.edu', meta: '31 Jul 2026 · Excel' },
      { who: 'accounts@school.edu', meta: '31 Jul 2026 · PDF' },
    ],
    scheduleBadge: 'Monthly',
    scheduleBadgeTint: 'info',
    scheduleWhen: 'on the last day at 06:00 PM',
    scheduleNext: '31 Aug 2026',
    notes: 'Annual stock verification scheduled for 15 Sep 2026. This snapshot is the opening baseline.',
    pages: 18,
    fileSize: '642 KB',
  },
  {
    id: 'LR-002',
    name: 'Issued Books — July 2026',
    type: 'Issued Books',
    dateRange: '01 – 31 Jul 2026',
    generatedBy: 'Anita Rao',
    generatedRole: 'Librarian',
    generatedDate: '31 Jul 2026',
    generatedTime: '05:15 PM',
    format: 'PDF',
    status: 'Ready',
    categories: ['Academic Books', 'Fiction', 'Non-Fiction', 'Magazines'],
    memberTypes: ALL_MEMBERS,
    summary: [
      { label: 'Books Issued', value: '1,150' },
      { label: 'Unique Members', value: '648' },
      { label: 'Avg Loan Period', value: '11 days' },
      { label: 'Renewals', value: '186' },
    ],
    appliedFilters: [
      { label: 'Category', value: 'All' },
      { label: 'Member Type', value: 'Students & Staff' },
      { label: 'Class', value: 'All' },
      { label: 'Grouped By', value: 'Category' },
    ],
    stats: [
      { label: 'Fiction', value: '412 issues' },
      { label: 'Academic Books', value: '486 issues' },
      { label: 'Non-Fiction', value: '188 issues' },
      { label: 'Magazines', value: '64 issues' },
    ],
    downloads: [{ who: 'anita.rao@school.edu', meta: '31 Jul 2026 · PDF' }],
    scheduleBadge: 'Weekly',
    scheduleBadgeTint: 'info',
    scheduleWhen: 'every Monday at 07:00 AM',
    scheduleNext: '03 Aug 2026',
    notes: 'Fiction remains the highest circulating category, consistent with the June figures.',
    pages: 12,
    fileSize: '486 KB',
  },
  {
    id: 'LR-003',
    name: 'Overdue Books — Ageing',
    type: 'Overdue Books',
    dateRange: 'As on 31 Jul 2026',
    generatedBy: 'Anita Rao',
    generatedRole: 'Librarian',
    generatedDate: '31 Jul 2026',
    generatedTime: '09:20 AM',
    format: 'Excel',
    status: 'Ready',
    categories: ALL_CATEGORIES,
    memberTypes: ALL_MEMBERS,
    summary: [
      { label: 'Books Overdue', value: '52' },
      { label: 'Members Affected', value: '44' },
      { label: 'Fine Accrued', value: '$318' },
      { label: 'Longest Overdue', value: '38 days' },
    ],
    appliedFilters: [
      { label: 'Ageing Buckets', value: '1–7, 8–15, 16–30, 30+' },
      { label: 'Category', value: 'All' },
      { label: 'Member Type', value: 'All' },
      { label: 'Grouped By', value: 'Ageing Bucket' },
    ],
    stats: [
      { label: '1 – 7 days', value: '18 books' },
      { label: '8 – 15 days', value: '16 books' },
      { label: '16 – 30 days', value: '12 books' },
      { label: 'Over 30 days', value: '6 books' },
    ],
    downloads: [
      { who: 'anita.rao@school.edu', meta: '31 Jul 2026 · Excel' },
      { who: 'front.office@school.edu', meta: '31 Jul 2026 · Excel' },
    ],
    scheduleBadge: 'Weekly',
    scheduleBadgeTint: 'info',
    scheduleWhen: 'every Friday at 05:00 PM',
    scheduleNext: '31 Jul 2026',
    notes: 'Used for the weekly reminder run. Fiction accounts for 24 of the 52 overdue titles.',
    pages: 6,
    fileSize: '218 KB',
  },
  {
    id: 'LR-004',
    name: 'Fine Collection — July 2026',
    type: 'Fine Collection',
    dateRange: '01 – 31 Jul 2026',
    generatedBy: 'Mary Winsler',
    generatedRole: 'Head Librarian',
    generatedDate: '30 Jul 2026',
    generatedTime: '04:50 PM',
    format: 'PDF',
    status: 'Ready',
    categories: ALL_CATEGORIES,
    memberTypes: [],
    summary: [
      { label: 'Fines Raised', value: '$564' },
      { label: 'Fines Collected', value: '$486' },
      { label: 'Fines Waived', value: '$60' },
      { label: 'Outstanding', value: '$18' },
    ],
    appliedFilters: [
      { label: 'Fine Type', value: 'Overdue & damage' },
      { label: 'Category', value: 'All' },
      { label: 'Payment Method', value: 'All' },
      { label: 'Include Waivers', value: 'Yes' },
    ],
    stats: [
      { label: 'Overdue Fines', value: '$438' },
      { label: 'Damage Charges', value: '$126' },
      { label: 'Waived on Appeal', value: '$60' },
      { label: 'Receipts Issued', value: '96' },
    ],
    downloads: [
      { who: 'mary.winsler@school.edu', meta: '30 Jul 2026 · PDF' },
      { who: 'accounts@school.edu', meta: '30 Jul 2026 · PDF' },
    ],
    scheduleBadge: 'Monthly',
    scheduleBadgeTint: 'info',
    scheduleWhen: 'on the 1st at 08:00 AM',
    scheduleNext: '01 Aug 2026',
    notes: 'Reconciled with the accounts fine register. The $60 waiver relates to receipt RCP-2026-0514.',
    pages: 8,
    fileSize: '312 KB',
  },
  {
    id: 'LR-005',
    name: 'Popular Books — Top 50',
    type: 'Popular Books',
    dateRange: '01 Apr – 31 Jul 2026',
    generatedBy: 'Scheduler',
    generatedRole: 'Automated',
    generatedDate: '30 Jul 2026',
    generatedTime: '06:00 AM',
    format: 'CSV',
    status: 'Scheduled',
    categories: ALL_CATEGORIES,
    memberTypes: [],
    summary: [
      { label: 'Titles Ranked', value: '50' },
      { label: 'Total Issues', value: '2,486' },
      { label: 'Top Category', value: 'Fiction' },
      { label: 'Never Issued', value: '318 titles' },
    ],
    appliedFilters: [
      { label: 'Ranking By', value: 'Issue count' },
      { label: 'Minimum Issues', value: '5' },
      { label: 'Category', value: 'All' },
      { label: 'Include Digital', value: 'Yes' },
    ],
    stats: [
      { label: 'Percy Jackson Series', value: '186 issues' },
      { label: 'The Hobbit', value: '142 issues' },
      { label: 'Concepts of Physics', value: '128 issues' },
      { label: 'Sapiens', value: '96 issues' },
    ],
    downloads: [{ who: 'mary.winsler@school.edu', meta: '30 Jul 2026 · CSV' }],
    scheduleBadge: 'Quarterly',
    scheduleBadgeTint: 'info',
    scheduleWhen: 'at period close',
    scheduleNext: '30 Sep 2026',
    notes: 'Feeds the acquisitions shortlist. 318 titles have not been issued this year and need review.',
    pages: 4,
    fileSize: '128 KB',
  },
  {
    id: 'LR-006',
    name: 'Member Activity — July 2026',
    type: 'Member Activity',
    dateRange: '01 – 31 Jul 2026',
    generatedBy: 'Anita Rao',
    generatedRole: 'Librarian',
    generatedDate: '30 Jul 2026',
    generatedTime: '03:35 PM',
    format: 'Excel',
    status: 'Ready',
    categories: ALL_CATEGORIES,
    memberTypes: ALL_MEMBERS,
    summary: [
      { label: 'Active Members', value: '862' },
      { label: 'New Members', value: '46' },
      { label: 'Inactive 90+ Days', value: '124' },
      { label: 'Avg Books / Member', value: '1.8' },
    ],
    appliedFilters: [
      { label: 'Member Type', value: 'Students & Staff' },
      { label: 'Class', value: 'All' },
      { label: 'Activity', value: 'All' },
      { label: 'Grouped By', value: 'Member Type' },
    ],
    stats: [
      { label: 'Students', value: '742 members' },
      { label: 'Teaching Staff', value: '96 members' },
      { label: 'Support Staff', value: '24 members' },
      { label: 'Suspended', value: '8 members' },
    ],
    downloads: [{ who: 'anita.rao@school.edu', meta: '30 Jul 2026 · Excel' }],
    scheduleBadge: 'Monthly',
    scheduleBadgeTint: 'info',
    scheduleWhen: 'on the 1st at 08:00 AM',
    scheduleNext: '01 Aug 2026',
    notes: '124 members inactive for over 90 days. Reading-drive shortlist to be shared with class teachers.',
    pages: 10,
    fileSize: '394 KB',
  },
  {
    id: 'LR-007',
    name: 'Lost & Damaged Books',
    type: 'Lost Books',
    dateRange: '01 Apr – 31 Jul 2026',
    generatedBy: 'Mary Winsler',
    generatedRole: 'Head Librarian',
    generatedDate: '28 Jul 2026',
    generatedTime: '11:05 AM',
    format: 'PDF',
    status: 'Archived',
    categories: ['Academic Books', 'Fiction', 'Reference Books', 'Magazines'],
    memberTypes: [],
    summary: [
      { label: 'Declared Lost', value: '18' },
      { label: 'Damaged — Repairable', value: '72' },
      { label: 'Written Off', value: '12' },
      { label: 'Recovery Value', value: '$1,240' },
    ],
    appliedFilters: [
      { label: 'Condition', value: 'Lost & damaged' },
      { label: 'Category', value: 'All' },
      { label: 'Recovery Status', value: 'All' },
      { label: 'Include Written Off', value: 'Yes' },
    ],
    stats: [
      { label: 'Academic Books', value: '8 lost' },
      { label: 'Fiction', value: '6 lost' },
      { label: 'Reference', value: '2 lost' },
      { label: 'Magazines', value: '2 lost' },
    ],
    downloads: [{ who: 'mary.winsler@school.edu', meta: '28 Jul 2026 · PDF' }],
    scheduleBadge: 'Quarterly',
    scheduleBadgeTint: 'secondary',
    scheduleWhen: 'at period close',
    scheduleNext: '30 Sep 2026',
    notes: 'Damaged titles sit in the Rare & Archived repair queue. Binding vendor review due in August.',
    pages: 5,
    fileSize: '164 KB',
  },
  {
    id: 'LR-008',
    name: 'Returned Books — June 2026',
    type: 'Returned Books',
    dateRange: '01 – 30 Jun 2026',
    generatedBy: 'Scheduler',
    generatedRole: 'Automated',
    generatedDate: '01 Jul 2026',
    generatedTime: '06:02 AM',
    format: 'Excel',
    status: 'Failed',
    categories: ALL_CATEGORIES,
    memberTypes: ALL_MEMBERS,
    summary: [
      { label: 'Books Returned', value: '—' },
      { label: 'On-Time Returns', value: '—' },
      { label: 'Error Stage', value: 'Data extract' },
      { label: 'Retry Attempts', value: '2 of 3' },
    ],
    appliedFilters: [
      { label: 'Category', value: 'All' },
      { label: 'Return Condition', value: 'All' },
      { label: 'Member Type', value: 'All' },
      { label: 'Grouped By', value: 'Category' },
    ],
    stats: [
      { label: 'Extract Started', value: '01 Jul 2026 · 06:00 AM' },
      { label: 'Failed At', value: 'Circulation join' },
      { label: 'Records Processed', value: '0' },
      { label: 'Next Retry', value: 'Manual only' },
    ],
    downloads: [{ who: '—', meta: 'Not generated' }],
    scheduleBadge: 'Paused',
    scheduleBadgeTint: 'danger',
    scheduleWhen: 'after 2 failed attempts · manual run required',
    scheduleNext: null,
    notes: 'Extract failed while the June circulation log was mid-close. Re-run once the period lock is released.',
    pages: 0,
    fileSize: '—',
  },
];
