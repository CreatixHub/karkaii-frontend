export type ReturnStatus =
  | 'Returned' | 'Late Return' | 'Overdue' | 'Pending Return' | 'Damaged' | 'Lost';

export type MemberType = 'Student' | 'Teacher' | 'Staff';

export type Condition = 'Good' | 'Fair' | 'Damaged' | 'Lost' | 'Not inspected';

/** What has happened to the assessed fine. */
export type Settlement = 'Unpaid' | 'Collected' | 'Waived';

export interface BookReturn {
  id: string;
  member: string;
  /** The template's `dt-card`, e.g. "LIB-0012". */
  card: string;
  /** The template's `dt-mid` — admission no for students, employee no otherwise. */
  memberId: string;
  memberType: MemberType;
  /** Students only; teachers and staff carry no class badge. */
  classLabel: string | null;
  section: string | null;
  avatar: string;
  bookTitle: string;
  isbn: string;
  bookCode: string;
  category: string;
  issuedOn: string;
  dueOn: string;
  /** Null while the copy is still out — the template prints an em dash. */
  returnDate: string | null;
  /** The librarian who took the copy back. */
  receivedBy: string | null;
  condition: Condition;
  /** Inspect Book / Damage Assessment charge; adds to the overdue penalty. */
  repairFee: number;
  /** Lost Book Report's flat charge; replaces the penalty when above zero. */
  replacementCharge: number;
  settlement: Settlement;
  status: ReturnStatus;
}

export const statusPill: Record<ReturnStatus, string> = {
  Returned: 'is-active',
  'Late Return': 'is-pending',
  Overdue: 'is-emergency',
  'Pending Return': 'is-new',
  Damaged: 'is-exam',
  Lost: 'is-archived',
};

/**
 * Only Returned draws the plain dot; every other status leads its pill with an
 * icon instead. Null means "render the dot".
 */
export const statusIcon: Record<ReturnStatus, string | null> = {
  Returned: null,
  'Late Return': 'ti ti-clock-exclamation',
  Overdue: 'ti ti-alert-triangle',
  'Pending Return': 'ti ti-clock',
  Damaged: 'ti ti-tool',
  Lost: 'ti ti-alert-octagon',
};

export const statusBadge: Record<ReturnStatus, string> = {
  Returned: 'badge badge-soft-success',
  'Late Return': 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  'Pending Return': 'badge badge-soft-primary',
  Damaged: 'badge badge-soft-warning',
  Lost: 'badge badge-soft-danger',
};

/** The member-type badge, tinted and iconed as the template has it. */
export const memberBadge: Record<MemberType, { className: string; icon: string }> = {
  Student: { className: 'badge badge-soft-primary dt-mtype', icon: 'ti ti-school' },
  Teacher: { className: 'badge badge-soft-success dt-mtype', icon: 'ti ti-users' },
  Staff: { className: 'badge badge-soft-info dt-mtype', icon: 'ti ti-users-group' },
};

/**
 * The condition badge. `label` is what the grid cell prints, `panelLabel` what
 * the expander prints — they differ only for an uninspected copy, which the
 * template calls "Not inspected" in the row and "Awaiting inspection" below it.
 */
export const conditionBadge: Record<
  Condition,
  { className: string; icon: string; label: string; panelLabel: string }
> = {
  Good: {
    className: 'badge badge-soft-success', icon: 'ti ti-circle-check',
    label: 'Good', panelLabel: 'Good',
  },
  Fair: {
    className: 'badge badge-soft-info', icon: 'ti ti-circle-check',
    label: 'Fair', panelLabel: 'Fair',
  },
  Damaged: {
    className: 'badge badge-soft-warning', icon: 'ti ti-tool',
    label: 'Damaged', panelLabel: 'Damaged',
  },
  Lost: {
    className: 'badge badge-soft-danger', icon: 'ti ti-alert-octagon',
    label: 'Lost', panelLabel: 'Lost',
  },
  'Not inspected': {
    className: 'badge badge-soft-light', icon: 'ti ti-minus',
    label: 'Not inspected', panelLabel: 'Awaiting inspection',
  },
};

/* ------------------------------ Filter options ------------------------------ */

export const memberTypeOptions: MemberType[] = ['Student', 'Teacher', 'Staff'];

export const memberNameOptions = [
  'Janet Daniel', 'Joann Michael', 'Kathleen Nolan', 'Teressa Bize', 'George Kelly',
  'Ralph Claudia', 'Julie Scott', 'Elisa Gardner', 'Andrew Fischer', 'Karen Robinson',
];

export const classOptions = ['X', 'IX', 'XI', 'VIII', 'VII'];

export const sectionOptions = ['A', 'B'];

export const categoryOptions = [
  'Fiction', 'Science', 'Computer Science', 'History', 'Biography', 'Children',
];

export const bookOptions = [
  'The Silent Patient', 'A Brief History of Time', 'To Kill a Mockingbird',
  'Introduction to Algorithms', 'Sapiens: A Brief History', 'The Great Gatsby',
  'Cosmos', 'Wings of Fire', 'Le Petit Prince', 'Panchatantra Tales',
];

export const statusOptions: ReturnStatus[] = [
  'Returned', 'Pending Return', 'Overdue', 'Late Return', 'Damaged', 'Lost',
];

export const fineStatusOptions = ['Fine Pending', 'No Fine / Paid'];

export const returnDateOptions = [
  '06 May 2024', '14 May 2024', '05 May 2024', '09 May 2024', '30 Apr 2024', '08 May 2024',
];

/** The Process Return dialog's member select — card number and all. */
export const memberSelectOptions = [
  'Janet Daniel — LIB-0012',
  'Joann Michael — LIB-0013',
  'Kathleen Nolan — LIB-0014',
  'Teressa Bize — LIB-0201',
  'George Kelly — LIB-0305',
  'Ralph Claudia — LIB-0015',
  'Julie Scott — LIB-0016',
  'Elisa Gardner — LIB-0202',
  'Andrew Fischer — LIB-0017',
  'Karen Robinson — LIB-0018',
];

export const processConditionOptions: Condition[] = ['Good', 'Damaged', 'Lost'];
export const inspectConditionOptions: Condition[] = ['Good', 'Fair', 'Damaged'];
export const receivedByOptions = ['Teressa', 'George'];
export const paymentMethodOptions = ['Cash', 'UPI', 'Card'];
export const pagesIntactOptions = ['Yes', 'No'];
export const coverConditionOptions = ['Intact', 'Torn', 'Stained'];
export const damageTypeOptions = ['Water Damage', 'Torn Pages', 'Broken Spine'];
export const severityOptions = ['Minor', 'Moderate', 'Severe'];
export const importModes = [
  'Create new records', 'Update existing by card + book', 'Create and update',
];

/* -------------------------------- Date maths -------------------------------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The clock both the Process Return and Lost Book Report dialogs default to. */
export const TODAY = '08 May 2024';

export const FINE_PER_DAY = 2;

/** Sortable key for the template's "24 Apr 2024" dates; unreturned sorts last. */
export const dateKey = (value: string | null): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Whole days since the epoch, so two dates can be subtracted. */
const serialOf = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

/** "08/05/2024" (the dialogs' input format) to "08 May 2024" (the grid's). */
export const fromInputDate = (value: string): string | null => {
  const parts = value.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  const index = Number(month) - 1;
  if (index < 0 || index > 11) return null;
  return `${day.padStart(2, '0')} ${months[index]} ${year}`;
};

/** The reverse, for seeding a dialog from a record. */
export const toInputDate = (value: string | null): string => {
  if (!value) return '';
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return '';
  return `${day}/${String(index + 1).padStart(2, '0')}/${year}`;
};

/* ------------------------------- Derivations -------------------------------- */

/** Days past the due date, counted to the return or to the library clock. */
export const daysOverdueOf = (row: BookReturn): number =>
  Math.max(0, serialOf(row.returnDate ?? TODAY) - serialOf(row.dueOn));

/** The template's "$2/day overdue penalty". */
export const overdueFineOf = (row: BookReturn): number => daysOverdueOf(row) * FINE_PER_DAY;

/** A replacement charge stands in for the penalty; a repair fee adds to it. */
export const fineOf = (row: BookReturn): number =>
  row.replacementCharge > 0 ? row.replacementCharge : overdueFineOf(row) + row.repairFee;

/** What is still owed — nothing once the fine is collected or waived. */
export const fineDueOf = (row: BookReturn): number =>
  row.settlement === 'Unpaid' ? fineOf(row) : 0;

export const fineStatusOf = (row: BookReturn): string =>
  fineDueOf(row) > 0 ? 'Fine Pending' : 'No Fine / Paid';

export const isReturned = (row: BookReturn): boolean => row.returnDate !== null;

/** The due badge only reddens on a record the grid itself calls Overdue. */
export const dueTint = (row: BookReturn): string =>
  row.status === 'Overdue' ? 'danger' : 'secondary';

export const returnTint = (row: BookReturn): string => (isReturned(row) ? 'success' : 'light');

export const fineTint = (row: BookReturn): string => (fineDueOf(row) > 0 ? 'danger' : 'success');

export const classBadgeOf = (row: BookReturn): string | null =>
  row.classLabel ? `Class ${row.classLabel}-${row.section}` : null;

export const firstNameOf = (row: BookReturn): string => row.member.split(' ')[0];

/** "Card LIB-0012 · ID AD202401 · Class X-A", the panel's second member line. */
export const memberLineOf = (row: BookReturn): string => {
  const badge = classBadgeOf(row);
  return `Card ${row.card} · ID ${row.memberId}${badge ? ` · ${badge}` : ''}`;
};

export const bookInfoOf = (row: BookReturn): string =>
  `${row.bookTitle} · ${row.category} · ${row.bookCode} · ISBN ${row.isbn}.`;

export const fineSentenceOf = (row: BookReturn): string => {
  const fine = fineOf(row);
  if (fine === 0) return 'No fine on this return.';
  if (row.settlement === 'Collected') return `$${fine} — collected in full.`;
  if (row.settlement === 'Waived') return `$${fine} — waived by the librarian.`;
  return `$${fine} — $${FINE_PER_DAY}/day overdue penalty.`;
};

export const historyOf = (row: BookReturn): string =>
  `${firstNameOf(row)} has returned 8 of the last 10 loans on time.`;

/** One note per status, exactly as the template writes them. */
export const notesOf = (row: BookReturn): string => {
  switch (row.status) {
    case 'Returned':
      return 'Returned in good condition and reshelved.';
    case 'Late Return':
      return `Returned late — fine $${fineOf(row)} applied.`;
    case 'Overdue':
      return 'Not yet returned — overdue fine accruing.';
    case 'Pending Return':
      return 'Awaiting return — within due window.';
    case 'Damaged':
      return 'Returned damaged — repair fee assessed.';
    case 'Lost':
    default:
      return 'Reported lost — replacement charge applied.';
  }
};

/** A fine slip rides along on exactly the records carrying a fine. */
export const attachmentsOf = (row: BookReturn): { label: string; className: string; icon: string }[] => {
  const list = [
    { label: 'ReturnReceipt.pdf', className: 'badge badge-soft-primary', icon: 'ti ti-file' },
  ];
  if (fineOf(row) > 0) {
    list.push({ label: 'FineSlip.pdf', className: 'badge badge-soft-danger', icon: 'ti ti-file-dollar' });
  }
  return list;
};

export const timelineSentenceOf = (row: BookReturn): string =>
  `Issued ${row.issuedOn} · Due ${row.dueOn} · Returned ${row.returnDate ?? '—'}.`;

export const processedSentenceOf = (row: BookReturn): string => {
  const fine = fineDueOf(row);
  return `Returned to ${row.receivedBy ?? '—'} · ${fine === 0 ? 'no fine' : `$${fine} fine`} · condition ${row.condition}.`;
};

/** Where a record lands once a return is processed. */
export const statusAfterReturn = (
  condition: Condition,
  dueOn: string,
  returnDate: string,
): ReturnStatus => {
  if (condition === 'Lost') return 'Lost';
  if (condition === 'Damaged') return 'Damaged';
  return serialOf(returnDate) > serialOf(dueOn) ? 'Late Return' : 'Returned';
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: BookReturn): string =>
  [
    row.member, row.card, row.memberId, row.memberType,
    row.classLabel ? `Class ${row.classLabel}` : '',
    row.section ? `Sec ${row.section}` : '',
    row.bookTitle, row.isbn, row.bookCode, row.category, row.status,
    fineStatusOf(row),
    row.returnDate ?? '—',
    isReturned(row) ? row.condition : '—',
  ]
    .join(' ')
    .toLowerCase();

/* ------------------------------ Book catalogue ------------------------------ */

/**
 * The Book Details dialog is hard-coded to BK-1001 in the template, so it can
 * only ever describe the first row. These are the ten titles as
 * `library-books.html` catalogues them, keyed by book code, so the dialog
 * describes whichever record opened it.
 */
export interface BookMeta {
  author: string;
  publisher: string;
  language: string;
  shelf: string;
  total: number;
  available: number;
  issued: number;
}

export const bookCatalogue: Record<string, BookMeta> = {
  'BK-1001': { author: 'Alex Michaelides', publisher: 'Celadon Books', language: 'English', shelf: 'A1-04', total: 6, available: 4, issued: 2 },
  'BK-1002': { author: 'Stephen Hawking', publisher: 'Bantam', language: 'English', shelf: 'C2-11', total: 5, available: 0, issued: 5 },
  'BK-1003': { author: 'Harper Lee', publisher: 'Harper Perennial', language: 'English', shelf: 'A1-09', total: 8, available: 3, issued: 4 },
  'BK-1004': { author: 'Yuval Noah Harari', publisher: 'Harper', language: 'English', shelf: 'D3-02', total: 7, available: 5, issued: 2 },
  'BK-1005': { author: 'Thomas H. Cormen', publisher: 'MIT Press', language: 'English', shelf: 'E1-15', total: 4, available: 0, issued: 3 },
  'BK-1006': { author: 'Antoine de Saint-Exupéry', publisher: 'Gallimard', language: 'French', shelf: 'A2-07', total: 3, available: 2, issued: 1 },
  'BK-1007': { author: 'F. Scott Fitzgerald', publisher: 'Scribner', language: 'English', shelf: 'A1-12', total: 6, available: 0, issued: 0 },
  'BK-1008': { author: 'Carl Sagan', publisher: 'Ballantine', language: 'English', shelf: 'C2-03', total: 5, available: 3, issued: 2 },
  'BK-1009': { author: 'A.P.J. Abdul Kalam', publisher: 'Universities Press', language: 'English', shelf: 'B1-08', total: 10, available: 7, issued: 3 },
  'BK-1010': { author: 'Vishnu Sharma', publisher: 'Om Books', language: 'Hindi', shelf: 'F2-01', total: 12, available: 0, issued: 0 },
};

export const metaOf = (row: BookReturn): BookMeta =>
  bookCatalogue[row.bookCode] ?? {
    author: '—', publisher: '—', language: '—', shelf: '—', total: 0, available: 0, issued: 0,
  };

/* ---------------------------------- Rows ------------------------------------ */

export const bookReturns: BookReturn[] = [
  {
    id: 'LIB-0012-BK-1001',
    member: 'Janet Daniel', card: 'LIB-0012', memberId: 'AD202401', memberType: 'Student',
    classLabel: 'X', section: 'A', avatar: 'assets/img/students/student-01.jpg',
    bookTitle: 'The Silent Patient', isbn: '978-1250301697', bookCode: 'BK-1001', category: 'Fiction',
    issuedOn: '24 Apr 2024', dueOn: '08 May 2024', returnDate: '06 May 2024', receivedBy: 'Teressa',
    condition: 'Good', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Returned',
  },
  {
    id: 'LIB-0013-BK-1002',
    member: 'Joann Michael', card: 'LIB-0013', memberId: 'AD202402', memberType: 'Student',
    classLabel: 'X', section: 'A', avatar: 'assets/img/students/student-02.jpg',
    bookTitle: 'A Brief History of Time', isbn: '978-0553380163', bookCode: 'BK-1002', category: 'Science',
    issuedOn: '28 Apr 2024', dueOn: '12 May 2024', returnDate: '14 May 2024', receivedBy: 'Teressa',
    condition: 'Good', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Late Return',
  },
  {
    id: 'LIB-0014-BK-1003',
    member: 'Kathleen Nolan', card: 'LIB-0014', memberId: 'AD202403', memberType: 'Student',
    classLabel: 'IX', section: 'B', avatar: 'assets/img/students/student-03.jpg',
    bookTitle: 'To Kill a Mockingbird', isbn: '978-0061120084', bookCode: 'BK-1003', category: 'Fiction',
    issuedOn: '20 Apr 2024', dueOn: '04 May 2024', returnDate: null, receivedBy: null,
    condition: 'Not inspected', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Overdue',
  },
  {
    id: 'LIB-0201-BK-1005',
    member: 'Teressa Bize', card: 'LIB-0201', memberId: 'EMP1041', memberType: 'Teacher',
    classLabel: null, section: null, avatar: 'assets/img/teachers/teacher-01.jpg',
    bookTitle: 'Introduction to Algorithms', isbn: '978-0262033848', bookCode: 'BK-1005',
    category: 'Computer Science',
    issuedOn: '01 May 2024', dueOn: '15 May 2024', returnDate: null, receivedBy: null,
    condition: 'Not inspected', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid',
    status: 'Pending Return',
  },
  {
    id: 'LIB-0305-BK-1004',
    member: 'George Kelly', card: 'LIB-0305', memberId: 'EMP1088', memberType: 'Staff',
    classLabel: null, section: null, avatar: 'assets/img/profiles/avatar-25.jpg',
    bookTitle: 'Sapiens: A Brief History', isbn: '978-0062316097', bookCode: 'BK-1004', category: 'History',
    issuedOn: '20 Apr 2024', dueOn: '04 May 2024', returnDate: '05 May 2024', receivedBy: 'George',
    condition: 'Damaged', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Damaged',
  },
  {
    id: 'LIB-0015-BK-1007',
    member: 'Ralph Claudia', card: 'LIB-0015', memberId: 'AD202406', memberType: 'Student',
    classLabel: 'XI', section: 'A', avatar: 'assets/img/students/student-06.jpg',
    bookTitle: 'The Great Gatsby', isbn: '978-0743273565', bookCode: 'BK-1007', category: 'Fiction',
    issuedOn: '10 Apr 2024', dueOn: '24 Apr 2024', returnDate: null, receivedBy: null,
    // The template prints $45 here — the replacement charge, not the day count.
    condition: 'Not inspected', repairFee: 0, replacementCharge: 45, settlement: 'Unpaid', status: 'Lost',
  },
  {
    id: 'LIB-0016-BK-1008',
    member: 'Julie Scott', card: 'LIB-0016', memberId: 'AD202407', memberType: 'Student',
    classLabel: 'VIII', section: 'B', avatar: 'assets/img/students/student-07.jpg',
    bookTitle: 'Cosmos', isbn: '978-0345539434', bookCode: 'BK-1008', category: 'Science',
    issuedOn: '26 Apr 2024', dueOn: '10 May 2024', returnDate: '09 May 2024', receivedBy: 'Teressa',
    condition: 'Good', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Returned',
  },
  {
    id: 'LIB-0202-BK-1009',
    member: 'Elisa Gardner', card: 'LIB-0202', memberId: 'EMP1052', memberType: 'Teacher',
    classLabel: null, section: null, avatar: 'assets/img/profiles/avatar-01.jpg',
    bookTitle: 'Wings of Fire', isbn: '978-8173711466', bookCode: 'BK-1009', category: 'Biography',
    issuedOn: '18 Apr 2024', dueOn: '02 May 2024', returnDate: '30 Apr 2024', receivedBy: 'George',
    condition: 'Good', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Returned',
  },
  {
    id: 'LIB-0017-BK-1006',
    member: 'Andrew Fischer', card: 'LIB-0017', memberId: 'AD202409', memberType: 'Student',
    classLabel: 'X', section: 'A', avatar: 'assets/img/students/student-09.jpg',
    bookTitle: 'Le Petit Prince', isbn: '978-2070612758', bookCode: 'BK-1006', category: 'Fiction',
    issuedOn: '02 May 2024', dueOn: '16 May 2024', returnDate: null, receivedBy: null,
    condition: 'Not inspected', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid',
    status: 'Pending Return',
  },
  {
    id: 'LIB-0018-BK-1010',
    member: 'Karen Robinson', card: 'LIB-0018', memberId: 'AD202410', memberType: 'Student',
    classLabel: 'VII', section: 'B', avatar: 'assets/img/students/student-10.jpg',
    bookTitle: 'Panchatantra Tales', isbn: '978-8175994980', bookCode: 'BK-1010', category: 'Children',
    issuedOn: '12 Apr 2024', dueOn: '26 Apr 2024', returnDate: '08 May 2024', receivedBy: 'George',
    condition: 'Good', repairFee: 0, replacementCharge: 0, settlement: 'Unpaid', status: 'Late Return',
  },
];
