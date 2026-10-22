export type IssueStatus = 'Issued' | 'Due Soon' | 'Overdue' | 'Returned' | 'Renewed' | 'Lost';

export type MemberType = 'Student' | 'Teacher' | 'Staff';

export interface BookIssue {
  /** Card plus book code — one member may hold several titles. */
  id: string;
  member: string;
  /** The template's `dt-card`, e.g. "LIB-0012". */
  card: string;
  /** The template's `dt-mid` — admission number or employee id. */
  memberId: string;
  memberType: MemberType;
  /** Roman class, blank for teachers and staff. */
  className: string;
  /** Section letter, blank for teachers and staff. */
  section: string;
  photo: string;
  title: string;
  isbn: string;
  /** The template's `dt-bcode`, e.g. "BK-1001". */
  bookCode: string;
  category: string;
  /** From `library-books.html`; the dialogs print it, the grid does not. */
  shelf: string;
  issuedOn: string;
  dueOn: string;
  /** Null while the copy is still out; the grid prints an em dash. */
  returnedOn: string | null;
  issuedBy: string;
  renewals: number;
  fine: number;
  status: IssueStatus;
}

export const statusPill: Record<IssueStatus, string> = {
  Issued: 'is-new',
  'Due Soon': 'is-pending',
  Overdue: 'is-emergency',
  Returned: 'is-active',
  Renewed: 'is-exam',
  Lost: 'is-archived',
};

/**
 * Only Returned draws the plain dot; every other status leads its pill with an
 * icon instead. Null means "render the dot".
 */
export const statusIcon: Record<IssueStatus, string | null> = {
  Issued: 'ti ti-book',
  'Due Soon': 'ti ti-clock',
  Overdue: 'ti ti-alert-triangle',
  Returned: null,
  Renewed: 'ti ti-refresh',
  Lost: 'ti ti-alert-octagon',
};

export const statusBadge: Record<IssueStatus, string> = {
  Issued: 'badge badge-soft-primary',
  'Due Soon': 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  Returned: 'badge badge-soft-success',
  Renewed: 'badge badge-soft-info',
  Lost: 'badge badge-soft-secondary',
};

export const memberTypeBadge: Record<MemberType, string> = {
  Student: 'badge badge-soft-primary',
  Teacher: 'badge badge-soft-success',
  Staff: 'badge badge-soft-info',
};

export const memberTypeIcon: Record<MemberType, string> = {
  Student: 'ti ti-school',
  Teacher: 'ti ti-users',
  Staff: 'ti ti-users-group',
};

/* -------------------------------- Constants -------------------------------- */

/** The overdue penalty the template quotes in every fine sentence. */
export const FINE_RATE = 2;

/** The page's own "today" — the date its Issue and Return dialogs open on. */
export const TODAY = '08 May 2024';

export const memberTypeOptions: MemberType[] = ['Student', 'Teacher', 'Staff'];

export const statusOptions: IssueStatus[] = [
  'Issued', 'Due Soon', 'Overdue', 'Returned', 'Renewed', 'Lost',
];

export const librarianOptions = ['Teressa', 'George'];

/* ---------------------------------- Dates ---------------------------------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DAY_MS = 24 * 60 * 60 * 1000;

const toDate = (value: string): Date => {
  const [day, month, year] = value.split(' ');
  return new Date(Number(year), Math.max(0, months.indexOf(month)), Number(day));
};

/** Sortable key for the template's "24 Apr 2024" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

export const formatDate = (date: Date): string =>
  `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;

/** Whole days from `from` to `to`; negative when `to` is the earlier date. */
export const daysBetween = (from: string, to: string): number =>
  Math.round((toDate(to).getTime() - toDate(from).getTime()) / DAY_MS);

export const addDays = (value: string, days: number): string => {
  const date = toDate(value);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

/** Accepts both "08 May 2024" and the dialogs' "08/05/2024". */
export const parseDialogDate = (value: string): string => {
  const slashed = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!slashed) return value.trim();
  const [, day, month, year] = slashed;
  return `${day.padStart(2, '0')} ${months[Number(month) - 1] ?? 'Jan'} ${year}`;
};

/** The dialogs' date inputs use the template's `dd/mm/yyyy` spelling. */
export const toDialogDate = (value: string): string => {
  const date = toDate(value);
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

/* ------------------------------- Derivations -------------------------------- */

/** "Class X-A" for a student, blank for a teacher or a staff member. */
export const classLabelOf = (row: BookIssue): string =>
  row.className ? `Class ${row.className}-${row.section}` : '';

/** Red once overdue, amber while the return is near, grey otherwise. */
export const dueBadgeOf = (row: BookIssue): string => {
  if (row.status === 'Overdue') return 'badge badge-soft-danger';
  if (row.status === 'Due Soon') return 'badge badge-soft-warning';
  return 'badge badge-soft-secondary';
};

export const returnBadgeOf = (row: BookIssue): string =>
  row.returnedOn ? 'badge badge-soft-success' : 'badge badge-soft-light';

export const returnLabelOf = (row: BookIssue): string => row.returnedOn ?? '—';

export const fineBadgeOf = (row: BookIssue): string =>
  row.fine > 0 ? 'badge badge-soft-danger' : 'badge badge-soft-success';

export const fineLabelOf = (row: BookIssue): string => `$${row.fine}`;

export type FineKind = 'none' | 'overdue' | 'replacement';

/** A Lost copy is billed for replacement; everything else accrues by the day. */
export const fineKindOf = (row: BookIssue): FineKind => {
  if (row.fine === 0) return 'none';
  return row.status === 'Lost' ? 'replacement' : 'overdue';
};

/** Calendar days between the due date and the page's "today", never negative. */
export const daysPastDue = (row: BookIssue): number =>
  Math.max(0, daysBetween(row.dueOn, TODAY));

/**
 * Days the fine has been accruing. See the file header: for an accruing loan
 * this is the fine divided by the daily rate, which is the only reading the
 * template's own Calculate Fine dialog agrees with.
 */
export const daysOverdueOf = (row: BookIssue): number =>
  fineKindOf(row) === 'overdue' ? Math.round(row.fine / FINE_RATE) : daysPastDue(row);

/** Only an Overdue loan puts a member in the queue in the template's panels. */
export const reservationCountOf = (row: BookIssue): number => (row.status === 'Overdue' ? 1 : 0);

export const isOpenLoan = (row: BookIssue): boolean =>
  row.status !== 'Returned' && row.status !== 'Lost';

/* ----------------------------- Panel sentences ------------------------------ */

export const memberLineOf = (row: BookIssue): string =>
  row.className
    ? `Card ${row.card} · ID ${row.memberId} · ${classLabelOf(row)}`
    : `Card ${row.card} · ID ${row.memberId}`;

export const bookInfoOf = (row: BookIssue): string =>
  `${row.title} · ${row.category} · ${row.bookCode} · ISBN ${row.isbn}.`;

export const renewalHistoryOf = (row: BookIssue): string =>
  row.renewals === 0
    ? 'No renewals on this loan.'
    : `${row.renewals} renewal(s) · last extended by ${row.issuedBy}.`;

export const fineDetailsOf = (row: BookIssue): string =>
  row.fine === 0
    ? 'No fine on this record.'
    : `$${row.fine} outstanding — $${FINE_RATE}/day overdue penalty.`;

export const reservationQueueOf = (row: BookIssue): string =>
  reservationCountOf(row) === 0
    ? 'No active reservations for this copy.'
    : `${reservationCountOf(row)} member waiting — send a return reminder.`;

/** One note per status, exactly as the template writes them. */
export const librarianNoteOf = (row: BookIssue): string => {
  switch (row.status) {
    case 'Returned':
      return 'Returned in good condition.';
    case 'Overdue':
      return 'Overdue — fine accruing, reminder due.';
    case 'Due Soon':
      return 'Due soon — courtesy reminder scheduled.';
    case 'Renewed':
      return 'Renewed on member request.';
    case 'Lost':
      return 'Reported lost — replacement charge applied.';
    case 'Issued':
    default:
      return 'Issued and in circulation.';
  }
};

/** `IssueSlip.pdf` always; `FineSlip.pdf` only where a fine stands. */
export interface Attachment {
  label: string;
  icon: string;
  badge: string;
}

export const attachmentsOf = (row: BookIssue): Attachment[] => {
  const files: Attachment[] = [
    { label: 'IssueSlip.pdf', icon: 'ti ti-file', badge: 'badge badge-soft-primary' },
  ];
  if (row.fine > 0) {
    files.push({ label: 'FineSlip.pdf', icon: 'ti ti-file-dollar', badge: 'badge badge-soft-danger' });
  }
  return files;
};

export const timelineOf = (row: BookIssue): string =>
  row.returnedOn
    ? `Issued ${row.issuedOn} · Due ${row.dueOn} · Returned ${row.returnedOn}.`
    : `Issued ${row.issuedOn} · Due ${row.dueOn} · not yet returned.`;

export const circulationOf = (row: BookIssue): string =>
  `Issued by ${row.issuedBy} · ${row.renewals} renewals · ${row.fine === 0 ? 'no fine' : `$${row.fine} fine`}.`;

export const shelfLineOf = (row: BookIssue): string =>
  `${row.title} · ISBN ${row.isbn} · Shelf ${row.shelf}.`;

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: BookIssue): string =>
  [
    row.member, row.card, row.memberId, row.memberType,
    row.className ? `class ${row.className} sec ${row.section}` : '',
    row.title, row.isbn, row.bookCode, row.category, row.status, row.dueOn, row.issuedOn,
  ]
    .join(' ')
    .toLowerCase();

/* ---------------------------------- Rows ------------------------------------ */

export const bookIssues: BookIssue[] = [
  {
    id: 'LIB-0012-BK-1001',
    member: 'Janet Daniel', card: 'LIB-0012', memberId: 'AD202401', memberType: 'Student',
    className: 'X', section: 'A', photo: 'assets/img/students/student-01.jpg',
    title: 'The Silent Patient', isbn: '978-1250301697', bookCode: 'BK-1001',
    category: 'Fiction', shelf: 'A1-04',
    issuedOn: '24 Apr 2024', dueOn: '08 May 2024', returnedOn: '06 May 2024',
    issuedBy: 'Teressa', renewals: 0, fine: 0, status: 'Returned',
  },
  {
    id: 'LIB-0013-BK-1002',
    member: 'Joann Michael', card: 'LIB-0013', memberId: 'AD202402', memberType: 'Student',
    className: 'X', section: 'A', photo: 'assets/img/students/student-02.jpg',
    title: 'A Brief History of Time', isbn: '978-0553380163', bookCode: 'BK-1002',
    category: 'Science', shelf: 'C2-11',
    issuedOn: '28 Apr 2024', dueOn: '12 May 2024', returnedOn: null,
    issuedBy: 'Teressa', renewals: 1, fine: 0, status: 'Issued',
  },
  {
    id: 'LIB-0014-BK-1003',
    member: 'Kathleen Nolan', card: 'LIB-0014', memberId: 'AD202403', memberType: 'Student',
    className: 'IX', section: 'B', photo: 'assets/img/students/student-03.jpg',
    title: 'To Kill a Mockingbird', isbn: '978-0061120084', bookCode: 'BK-1003',
    category: 'Fiction', shelf: 'A1-09',
    issuedOn: '20 Apr 2024', dueOn: '04 May 2024', returnedOn: null,
    issuedBy: 'George', renewals: 0, fine: 8, status: 'Overdue',
  },
  {
    id: 'LIB-0201-BK-1005',
    member: 'Teressa Bize', card: 'LIB-0201', memberId: 'EMP1041', memberType: 'Teacher',
    className: '', section: '', photo: 'assets/img/teachers/teacher-01.jpg',
    title: 'Introduction to Algorithms', isbn: '978-0262033848', bookCode: 'BK-1005',
    category: 'Computer Science', shelf: 'E1-15',
    issuedOn: '01 May 2024', dueOn: '29 May 2024', returnedOn: null,
    issuedBy: 'George', renewals: 0, fine: 0, status: 'Issued',
  },
  {
    id: 'LIB-0305-BK-1004',
    member: 'George Kelly', card: 'LIB-0305', memberId: 'EMP1088', memberType: 'Staff',
    className: '', section: '', photo: 'assets/img/profiles/avatar-25.jpg',
    title: 'Sapiens: A Brief History', isbn: '978-0062316097', bookCode: 'BK-1004',
    category: 'History', shelf: 'D3-02',
    issuedOn: '30 Apr 2024', dueOn: '10 May 2024', returnedOn: null,
    issuedBy: 'Teressa', renewals: 0, fine: 0, status: 'Due Soon',
  },
  {
    id: 'LIB-0015-BK-1007',
    member: 'Ralph Claudia', card: 'LIB-0015', memberId: 'AD202406', memberType: 'Student',
    className: 'XI', section: 'A', photo: 'assets/img/students/student-06.jpg',
    title: 'The Great Gatsby', isbn: '978-0743273565', bookCode: 'BK-1007',
    category: 'Fiction', shelf: 'A1-12',
    issuedOn: '10 Apr 2024', dueOn: '24 Apr 2024', returnedOn: null,
    issuedBy: 'George', renewals: 2, fine: 24, status: 'Overdue',
  },
  {
    id: 'LIB-0016-BK-1008',
    member: 'Julie Scott', card: 'LIB-0016', memberId: 'AD202407', memberType: 'Student',
    className: 'VIII', section: 'B', photo: 'assets/img/students/student-07.jpg',
    title: 'Cosmos', isbn: '978-0345539434', bookCode: 'BK-1008',
    category: 'Science', shelf: 'C2-03',
    issuedOn: '26 Apr 2024', dueOn: '10 May 2024', returnedOn: null,
    issuedBy: 'Teressa', renewals: 1, fine: 0, status: 'Renewed',
  },
  {
    id: 'LIB-0202-BK-1009',
    member: 'Elisa Gardner', card: 'LIB-0202', memberId: 'EMP1052', memberType: 'Teacher',
    className: '', section: '', photo: 'assets/img/profiles/avatar-01.jpg',
    title: 'Wings of Fire', isbn: '978-8173711466', bookCode: 'BK-1009',
    category: 'Biography', shelf: 'B1-08',
    issuedOn: '18 Apr 2024', dueOn: '02 May 2024', returnedOn: '30 Apr 2024',
    issuedBy: 'George', renewals: 0, fine: 0, status: 'Returned',
  },
  {
    id: 'LIB-0017-BK-1006',
    member: 'Andrew Fischer', card: 'LIB-0017', memberId: 'AD202409', memberType: 'Student',
    className: 'X', section: 'A', photo: 'assets/img/students/student-09.jpg',
    title: 'Le Petit Prince', isbn: '978-2070612758', bookCode: 'BK-1006',
    category: 'Fiction', shelf: 'A2-07',
    issuedOn: '02 May 2024', dueOn: '16 May 2024', returnedOn: null,
    issuedBy: 'Teressa', renewals: 0, fine: 0, status: 'Issued',
  },
  {
    id: 'LIB-0018-BK-1010',
    member: 'Karen Robinson', card: 'LIB-0018', memberId: 'AD202410', memberType: 'Student',
    className: 'VII', section: 'B', photo: 'assets/img/students/student-10.jpg',
    title: 'Panchatantra Tales', isbn: '978-8175994980', bookCode: 'BK-1010',
    category: 'Children', shelf: 'F2-01',
    issuedOn: '05 Apr 2024', dueOn: '19 Apr 2024', returnedOn: null,
    issuedBy: 'George', renewals: 0, fine: 45, status: 'Lost',
  },
];

/* ------------------------------ Filter options ------------------------------ */

/** First appearance wins, which is the order the template's `<option>`s use. */
const unique = (values: string[]): string[] =>
  values.filter((value, index) => value !== '' && values.indexOf(value) === index);

export const memberOptions = unique(bookIssues.map((row) => row.member));

export const classOptions = unique(bookIssues.map((row) => row.className));

export const sectionOptions = unique(bookIssues.map((row) => row.section));

export const categoryOptions = unique(bookIssues.map((row) => row.category));

export const bookOptions = unique(bookIssues.map((row) => row.title));

export const dueDateOptions = unique(bookIssues.map((row) => row.dueOn));

export const issueDateOptions = unique(bookIssues.map((row) => row.issuedOn));

/* ------------------------------- Directories -------------------------------- */

/**
 * The Issue Book dialog's two selects. Both list every member and every title
 * the roster knows, in roster order — which is exactly the template's own
 * option order, so they are read off the rows rather than transcribed.
 */
export interface MemberProfile {
  member: string;
  card: string;
  memberId: string;
  memberType: MemberType;
  className: string;
  section: string;
  photo: string;
}

export interface BookProfile {
  title: string;
  isbn: string;
  bookCode: string;
  category: string;
  shelf: string;
}

export const memberDirectory: MemberProfile[] = bookIssues.map((row) => ({
  member: row.member,
  card: row.card,
  memberId: row.memberId,
  memberType: row.memberType,
  className: row.className,
  section: row.section,
  photo: row.photo,
}));

export const bookDirectory: BookProfile[] = bookIssues.map((row) => ({
  title: row.title,
  isbn: row.isbn,
  bookCode: row.bookCode,
  category: row.category,
  shelf: row.shelf,
}));

/** "Janet Daniel — LIB-0012", as the dialog spells it. */
export const memberSelectOptions = memberDirectory.map((entry) => `${entry.member} — ${entry.card}`);

export const bookSelectOptions = bookDirectory.map((entry) => `${entry.title} — ${entry.bookCode}`);

export const memberByOption = (option: string): MemberProfile | undefined =>
  memberDirectory.find((entry) => `${entry.member} — ${entry.card}` === option);

export const bookByOption = (option: string): BookProfile | undefined =>
  bookDirectory.find((entry) => `${entry.title} — ${entry.bookCode}` === option);
