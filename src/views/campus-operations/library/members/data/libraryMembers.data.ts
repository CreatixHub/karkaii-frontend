export type MemberStatus = 'Active' | 'Inactive' | 'Expired' | 'Suspended' | 'Blocked';

export type MemberType = 'Student' | 'Teacher' | 'Staff';

export interface Member {
  /** The library card doubles as the row id — it is unique across the roster. */
  id: string;
  name: string;
  /** Template path, rendered through `ImageWithBasePath`. */
  avatar: string;
  /** The template's `dt-card`, e.g. "LIB-0012". */
  card: string;
  /** The template's `dt-mid` — admission or employee number. */
  memberId: string;
  type: MemberType;
  /** Students only: the class level ("X") and section ("A"). */
  classLevel?: string;
  section?: string;
  /** Teachers and staff only: the department printed as "Dept …". */
  department?: string;
  registered: string;
  expires: string;
  issued: number;
  returned: number;
  overdue: number;
  /** Whole dollars, as the template prints them ("$24"). */
  fine: number;
  lastVisit: string;
  status: MemberStatus;
}

export const statusPill: Record<MemberStatus, string> = {
  Active: 'is-active',
  Inactive: 'is-inactive',
  Expired: 'is-pending',
  Suspended: 'is-archived',
  Blocked: 'is-emergency',
};

/**
 * Active and Inactive draw the plain dot; the three exception statuses lead
 * their pill with an icon instead. Null means "render the dot".
 */
export const statusIcon: Record<MemberStatus, string | null> = {
  Active: null,
  Inactive: null,
  Expired: 'ti ti-calendar-x',
  Suspended: 'ti ti-player-pause',
  Blocked: 'ti ti-ban',
};

export const statusBadge: Record<MemberStatus, string> = {
  Active: 'badge badge-soft-success',
  Inactive: 'badge badge-soft-secondary',
  Expired: 'badge badge-soft-warning',
  Suspended: 'badge badge-soft-info',
  Blocked: 'badge badge-soft-danger',
};

/** The `dt-mtype` badge: one tint and one icon per member type. */
export const typeBadge: Record<MemberType, string> = {
  Student: 'badge badge-soft-primary',
  Teacher: 'badge badge-soft-success',
  Staff: 'badge badge-soft-info',
};

export const typeIcon: Record<MemberType, string> = {
  Student: 'ti ti-school',
  Teacher: 'ti ti-users',
  Staff: 'ti ti-users-group',
};

/* ------------------------------ Filter options ------------------------------ */

export const memberTypeOptions: MemberType[] = ['Student', 'Teacher', 'Staff'];

export const libraryCardOptions = [
  'LIB-0012', 'LIB-0013', 'LIB-0201', 'LIB-0014', 'LIB-0305',
  'LIB-0015', 'LIB-0016', 'LIB-0202', 'LIB-0017', 'LIB-0018',
];

export const classOptions = ['X', 'IX', 'XI', 'VIII', 'VII'];

export const sectionOptions = ['A', 'B'];

export const statusOptions: MemberStatus[] = ['Active', 'Inactive', 'Expired', 'Suspended', 'Blocked'];

export const borrowingOptions = ['Has Overdue', 'No Overdue'];

export const registrationDateOptions = [
  '12 Apr 2023', '01 Jun 2021', '10 Apr 2022', '15 Aug 2022',
  '18 Apr 2023', '20 Apr 2023', '01 Jun 2020', '05 Apr 2023',
];

export const departmentOptions = ['English', 'Mathematics', 'Administration', 'Science', 'Library'];

/** The six titles the template's Issue / Return selects offer. */
export const bookOptions = [
  'The Silent Patient',
  'A Brief History of Time',
  'To Kill a Mockingbird',
  'Sapiens',
  'The Great Gatsby',
  'Introduction to Algorithms',
];

/* -------------------------------- Derivations ------------------------------- */

/** "Class X-A" for students, the department for everyone else. */
export const academicLabel = (row: Member): string =>
  row.type === 'Student' ? `Class ${row.classLevel}-${row.section}` : row.department ?? '—';

/** The academic line's leading word and icon differ for students vs staff. */
export const academicTerm = (row: Member): string => (row.type === 'Student' ? 'Class' : 'Dept');

export const academicIcon = (row: Member): string =>
  row.type === 'Student' ? 'ti ti-school' : 'ti ti-building';

/** The panel prints "Class X-A · Registered …" but "English · Registered …". */
export const academicSummary = (row: Member): string => academicLabel(row);

/** Only an Expired membership reddens its expiry badge — see the header note. */
export const expiryTint = (row: Member): string =>
  row.status === 'Expired' ? 'badge badge-soft-danger' : 'badge badge-soft-secondary';

export const overdueTint = (row: Member): string =>
  row.overdue > 0 ? 'badge badge-soft-danger' : 'badge badge-soft-secondary';

export const fineTint = (row: Member): string =>
  row.fine > 0 ? 'badge badge-soft-danger' : 'badge badge-soft-success';

/** The Book Borrowing Status filter's two options. */
export const borrowingStatusOf = (row: Member): string =>
  row.overdue > 0 ? 'Has Overdue' : 'No Overdue';

export const currentBorrowedOf = (row: Member): string => {
  if (row.issued === 0) return 'No books currently issued.';
  return row.overdue > 0
    ? `${row.issued} book(s) currently issued · ${row.overdue} overdue.`
    : `${row.issued} book(s) currently issued.`;
};

/** Both Teachers hold two reference-section reservations; nobody else does. */
export const reservationsOf = (row: Member): string =>
  row.type === 'Teacher' ? '2 active reservations · reference section.' : 'No active reservations.';

export const FINE_PER_DAY = 2;

export const fineDetailOf = (row: Member): string =>
  row.fine === 0
    ? 'No outstanding fines.'
    : `$${row.fine} outstanding — $${FINE_PER_DAY}/day overdue penalty on ${row.overdue} book(s).`;

/** The word the activity and panel sentences use for each membership state. */
export const standingOf = (row: Member): string => {
  switch (row.status) {
    case 'Expired':
      return 'expired';
    case 'Suspended':
      return 'suspended';
    case 'Inactive':
      return 'inactive';
    case 'Blocked':
      return 'blocked';
    default:
      return 'in good standing';
  }
};

export const activityOf = (row: Member): string =>
  `Last visit ${row.lastVisit} · membership ${standingOf(row)}.`;

/** One note per status, exactly as the template writes them. */
export const notesOf = (row: Member): string => {
  switch (row.status) {
    case 'Expired':
      return 'Membership expired — renewal required.';
    case 'Suspended':
      return 'Suspended pending fine settlement.';
    case 'Inactive':
      return 'Inactive — no recent borrowing activity.';
    case 'Blocked':
      return 'Blocked for repeated overdue returns — clear fines to reactivate.';
    default:
      return 'Member in good standing.';
  }
};

export interface Attachment {
  label: string;
  badge: string;
  icon: string;
}

/** Everyone carries a card; only a member with a fine carries the fine slip. */
export const attachmentsOf = (row: Member): Attachment[] => {
  const files: Attachment[] = [
    { label: 'LibraryCard.pdf', badge: 'badge badge-soft-primary', icon: 'ti ti-id' },
  ];
  if (row.fine > 0) {
    files.push({ label: 'FineSlip.pdf', badge: 'badge badge-soft-danger', icon: 'ti ti-file-dollar' });
  }
  return files;
};

/** The View dialog's one-line borrowing summary. */
export const borrowingSummaryOf = (row: Member): string =>
  `${row.issued} issued · ${row.returned} returned · ${row.overdue} overdue · ${
    row.fine === 0 ? 'no fine' : `$${row.fine} fine`
  }.`;

export const membershipSummaryOf = (row: Member): string =>
  `Registered ${row.registered} · Expires ${row.expires}.`;

export const identityLineOf = (row: Member): string =>
  `${row.card} · ${row.memberId} · ${row.type} · ${academicSummary(row)}`;

/** One line of the Outstanding Fine dialog's table. */
export interface FineLine {
  book: string;
  days: number;
  amount: number;
}

/**
 * The template hard-codes two $12 lines totalling $24 — Ralph Claudia's fine,
 * with everyone else's dialog showing his numbers. The lines are built from the
 * row instead: the fine is split across the overdue books (the remainder lands
 * on the first) and the days follow at $2/day, so the total always equals the
 * grid's fine badge. Karen Robinson's $45 across 3 books is the one figure the
 * template's own $2/day rule cannot divide evenly — the days round up.
 */
export const fineLinesOf = (row: Member): FineLine[] => {
  if (row.fine === 0 || row.overdue === 0) return [];
  const base = Math.floor(row.fine / row.overdue);
  const remainder = row.fine - base * row.overdue;
  const offset = Number(row.card.replace(/\D/g, '')) % bookOptions.length;
  return Array.from({ length: row.overdue }, (_, index) => {
    const amount = index === 0 ? base + remainder : base;
    return {
      book: bookOptions[(offset + index) % bookOptions.length],
      days: Math.ceil(amount / FINE_PER_DAY),
      amount,
    };
  });
};

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: Member): string =>
  [
    row.name,
    row.card,
    row.memberId,
    row.type,
    row.type === 'Student' ? `class ${row.classLevel} sec ${row.section}` : row.department ?? '',
    row.status,
    row.overdue > 0 ? 'has overdue borrowed' : 'no overdue',
    row.registered,
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "12 Apr 2023" dates. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

export const formatDate = (day: number, month: number, year: number): string =>
  `${String(day).padStart(2, '0')} ${months[month]} ${year}`;

export const renewalPeriods = ['1 Year', '2 Years', '6 Months'];

/**
 * The template shows "11 Apr 2026" against an 11 Apr 2025 expiry and a 1-Year
 * period, so the new expiry is the old one pushed by the chosen period. The day
 * is clamped to the target month's length so a 31 May expiry cannot roll over.
 */
export const expiryAfter = (expiry: string, period: string): string => {
  const [dayText, monthText, yearText] = expiry.split(' ');
  const monthIndex = months.indexOf(monthText);
  if (monthIndex === -1) return expiry;
  const day = Number(dayText);
  const year = Number(yearText);
  const addedMonths = period === '2 Years' ? 24 : period === '6 Months' ? 6 : 12;
  const total = monthIndex + addedMonths;
  const newYear = year + Math.floor(total / 12);
  const newMonth = total % 12;
  const lastDay = new Date(newYear, newMonth + 1, 0).getDate();
  return formatDate(Math.min(day, lastDay), newMonth, newYear);
};

/* ---------------------------------- Rows ------------------------------------ */

export const libraryMembers: Member[] = [
  {
    id: 'LIB-0012', card: 'LIB-0012', name: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg',
    memberId: 'AD202401', type: 'Student', classLevel: 'X', section: 'A',
    registered: '12 Apr 2023', expires: '11 Apr 2025',
    issued: 3, returned: 14, overdue: 0, fine: 0, lastVisit: '08 May 2024', status: 'Active',
  },
  {
    id: 'LIB-0013', card: 'LIB-0013', name: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg',
    memberId: 'AD202402', type: 'Student', classLevel: 'X', section: 'A',
    registered: '12 Apr 2023', expires: '11 Apr 2025',
    issued: 2, returned: 9, overdue: 1, fine: 8, lastVisit: '07 May 2024', status: 'Active',
  },
  {
    id: 'LIB-0201', card: 'LIB-0201', name: 'Teressa Bize', avatar: 'assets/img/teachers/teacher-01.jpg',
    memberId: 'EMP1041', type: 'Teacher', department: 'English',
    registered: '01 Jun 2021', expires: '31 May 2026',
    issued: 5, returned: 120, overdue: 0, fine: 0, lastVisit: '08 May 2024', status: 'Active',
  },
  {
    id: 'LIB-0014', card: 'LIB-0014', name: 'Kathleen Nolan', avatar: 'assets/img/students/student-03.jpg',
    memberId: 'AD202403', type: 'Student', classLevel: 'IX', section: 'B',
    registered: '10 Apr 2022', expires: '09 Apr 2024',
    issued: 0, returned: 22, overdue: 0, fine: 0, lastVisit: '22 Mar 2024', status: 'Expired',
  },
  {
    id: 'LIB-0305', card: 'LIB-0305', name: 'George Kelly', avatar: 'assets/img/profiles/avatar-25.jpg',
    memberId: 'EMP1088', type: 'Staff', department: 'Administration',
    registered: '15 Aug 2022', expires: '14 Aug 2025',
    issued: 1, returned: 18, overdue: 0, fine: 0, lastVisit: '06 May 2024', status: 'Active',
  },
  {
    id: 'LIB-0015', card: 'LIB-0015', name: 'Ralph Claudia', avatar: 'assets/img/students/student-06.jpg',
    memberId: 'AD202406', type: 'Student', classLevel: 'XI', section: 'A',
    registered: '18 Apr 2023', expires: '17 Apr 2025',
    issued: 4, returned: 6, overdue: 2, fine: 24, lastVisit: '05 May 2024', status: 'Suspended',
  },
  {
    id: 'LIB-0016', card: 'LIB-0016', name: 'Julie Scott', avatar: 'assets/img/students/student-07.jpg',
    memberId: 'AD202407', type: 'Student', classLevel: 'VIII', section: 'B',
    registered: '20 Apr 2023', expires: '19 Apr 2025',
    issued: 2, returned: 11, overdue: 0, fine: 0, lastVisit: '09 May 2024', status: 'Active',
  },
  {
    id: 'LIB-0202', card: 'LIB-0202', name: 'Elisa Gardner', avatar: 'assets/img/profiles/avatar-01.jpg',
    memberId: 'EMP1052', type: 'Teacher', department: 'Mathematics',
    registered: '01 Jun 2020', expires: '31 May 2025',
    issued: 6, returned: 210, overdue: 1, fine: 12, lastVisit: '08 May 2024', status: 'Active',
  },
  {
    id: 'LIB-0017', card: 'LIB-0017', name: 'Andrew Fischer', avatar: 'assets/img/students/student-09.jpg',
    memberId: 'AD202409', type: 'Student', classLevel: 'X', section: 'A',
    registered: '05 Apr 2023', expires: '04 Apr 2025',
    issued: 0, returned: 3, overdue: 0, fine: 0, lastVisit: '18 Feb 2024', status: 'Inactive',
  },
  {
    id: 'LIB-0018', card: 'LIB-0018', name: 'Karen Robinson', avatar: 'assets/img/students/student-10.jpg',
    memberId: 'AD202410', type: 'Student', classLevel: 'VII', section: 'B',
    registered: '10 Apr 2022', expires: '09 Apr 2024',
    issued: 3, returned: 5, overdue: 3, fine: 45, lastVisit: '12 Apr 2024', status: 'Blocked',
  },
];

/** The Issue / Return dialogs' member select, in the template's own order. */
export const memberOptionsFrom = (rows: Member[]): string[] =>
  rows.map((row) => `${row.name} — ${row.card}`);
