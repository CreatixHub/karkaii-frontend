export type ReservationStatus =
  | 'Ready for Pickup'
  | 'Waiting'
  | 'Pending Approval'
  | 'Expired'
  | 'Completed'
  | 'Cancelled';

export type MemberType = 'Student' | 'Teaching Staff' | 'Support Staff';

export interface Pair {
  label: string;
  value: string;
}

/** One card in the expander's Timeline / Notification History rails. */
export interface FeedItem {
  title: string;
  meta: string;
}

/** One member on a title's waiting list. */
export interface QueueEntry {
  name: string;
  /** Null when the template prints the entry without a number. */
  position: number | null;
  /** Trailing clause the expander prints, e.g. "reserved 29 Jul". */
  note: string;
  /** Full date the panel prints, e.g. "29 Jul 2026"; null when undated. */
  reserved: string | null;
}

export interface Reservation {
  id: string;

  /* Book */
  book: string;
  author: string;
  category: string;
  categoryCode: string;
  accession: string;
  /** Theme colour behind the row's book avatar. */
  bookTint: string;
  shelf: string;
  totalCopies: number;
  availableNow: number;
  /** Printed in the panel; "—" where the template has no date. */
  nextReturnDue: string;

  /* Member */
  member: string;
  /** The row's second line, e.g. "III A · AD9892434". */
  memberMeta: string;
  memberId: string;
  memberType: MemberType;
  booksHeld: number;
  booksAllowed: number;
  overdueItems: number;
  contact: string;

  /* Reservation */
  reservedOn: string;
  /** Null where the template prints an em dash in the Pickup Deadline cell. */
  pickupDeadline: string | null;
  status: ReservationStatus;
  /** Null when the reservation is not sitting in a queue. */
  queuePosition: number | null;
  /** Null renders the template's "— / Unassigned" pair. */
  librarian: string | null;
  librarianRole: string;
  approvedBy: string | null;
  allocatedOn: string | null;

  /* Pickup */
  pickupPoint: string;
  availableFrom: string;
  /** e.g. "02 Aug 2026 · 04:00 PM", "Set on allocation", "—". */
  deadlineTime: string;
  holdDuration: string;
  /** Set once the copy is collected; drives the Completed label pair. */
  collectedOn: string | null;
  issuedUntil: string | null;
  /** The panel's hold-shelf slot, e.g. "Slot H-14". */
  holdShelf: string;

  /* Rails */
  waitingList: QueueEntry[];
  /** Printed in place of the waiting list when it is empty. */
  waitingNote: string;
  timeline: FeedItem[];
  notifications: FeedItem[];
  notes: string;
}

/* --------------------------------- Pills ---------------------------------- */

export const statusPill: Record<ReservationStatus, string> = {
  'Ready for Pickup': 'is-active',
  Waiting: 'is-review',
  'Pending Approval': 'is-pending',
  Expired: 'is-inactive',
  Completed: 'is-completed',
  Cancelled: 'is-blocked',
};

/**
 * Every pill on this page leads with a dot, so every entry is null. The map is
 * still exported — and still branched on — because it varies per status on the
 * sibling pages and the grid should not have to know which page it is.
 */
export const statusIcon: Record<ReservationStatus, string | null> = {
  'Ready for Pickup': null,
  Waiting: null,
  'Pending Approval': null,
  Expired: null,
  Completed: null,
  Cancelled: null,
};

export const statusBadge: Record<ReservationStatus, string> = {
  'Ready for Pickup': 'badge badge-soft-success',
  Waiting: 'badge badge-soft-info',
  'Pending Approval': 'badge badge-soft-warning',
  Expired: 'badge badge-soft-secondary',
  Completed: 'badge badge-soft-primary',
  Cancelled: 'badge badge-soft-danger',
};

/** The short form the offcanvas header prints, e.g. "Ready". */
export const statusShort: Record<ReservationStatus, string> = {
  'Ready for Pickup': 'Ready',
  Waiting: 'Waiting',
  'Pending Approval': 'Pending',
  Expired: 'Expired',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
};

export const memberTypeBadge: Record<MemberType, string> = {
  Student: 'badge badge-soft-primary',
  'Teaching Staff': 'badge badge-soft-info',
  'Support Staff': 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ----------------------------- */

export const statusOptions: ReservationStatus[] = [
  'Pending Approval', 'Waiting', 'Ready for Pickup', 'Completed', 'Expired', 'Cancelled',
];

export const categoryOptions = [
  'Academic Books', 'Reference Books', 'Fiction', 'Non-Fiction', 'Digital Resources',
  'Journals', 'Magazines',
];

export const memberTypeOptions: MemberType[] = ['Student', 'Teaching Staff', 'Support Staff'];

export const UNASSIGNED = 'Unassigned';

export const librarianOptions = ['Mary Winsler', 'Anita Rao', UNASSIGNED];

export const NO_QUEUE = 'Allocated — no queue';

export const queueOptions = [NO_QUEUE, 'Position 1', 'Position 2 – 3', 'Beyond position 3'];

export const deadlineOptions = ['Expiring today', 'Within 48 hours', 'This week', 'Already expired'];

/* --------------------------------- Dates ----------------------------------- */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** The day the template renders — its Add dialog opens on 31-07-2026. */
export const TODAY = '31 Jul 2026';

/** Sortable integer for a "28 Jul 2026" date; 0 when the value is not a date. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const toDate = (value: string): Date | null => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return null;
  return new Date(Date.UTC(Number(year), index, Number(day)));
};

/** Whole days between two "28 Jul 2026" dates; null when either is not a date. */
export const dayDiff = (from: string, to: string): number | null => {
  const a = toDate(from);
  const b = toDate(to);
  if (!a || !b) return null;
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
};

/** "02-08-2026" (what the dialogs' date inputs carry) → "02 Aug 2026". */
export const fromInputDate = (value: string): string => {
  const [day, month, year] = value.split('-');
  const index = Number(month) - 1;
  if (!day || !months[index] || !year) return value;
  return `${day.padStart(2, '0')} ${months[index]} ${year}`;
};

/** "02 Aug 2026" → "02-08-2026", for seeding a dialog's date input. */
export const toInputDate = (value: string): string => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return value;
  return [day.padStart(2, '0'), String(index + 1).padStart(2, '0'), year].join('-');
};

/** Shifts a "30-07-2026" input value by whole days, staying in input form. */
export const addDaysInput = (value: string, days: number): string => {
  const date = toDate(fromInputDate(value));
  if (!date) return value;
  date.setUTCDate(date.getUTCDate() + days);
  return toInputDate(
    `${String(date.getUTCDate()).padStart(2, '0')} ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`,
  );
};

/**
 * The dialogs' hold and loan pickers are worded in hours or days; both come
 * back as a whole number of days so a deadline or due date can be stamped.
 */
export const spanDays = (label: string): number => {
  const match = label.match(/(\d+)\s*(hour|day)/i);
  if (!match) return 0;
  const value = Number(match[1]);
  return match[2].toLowerCase() === 'hour' ? Math.round(value / 24) : value;
};

/* ------------------------------- Derivations ------------------------------- */

/** A reservation still moving through the queue, as the summary tiles count it. */
export const isOpen = (row: Reservation): boolean =>
  row.status === 'Ready for Pickup' || row.status === 'Waiting' || row.status === 'Pending Approval';

/**
 * Days between today and the pickup deadline. Null when the reservation has no
 * deadline yet, or once it has been collected or cancelled.
 */
export const daysLeft = (row: Reservation): number | null => {
  if (!row.pickupDeadline) return null;
  if (row.status === 'Completed' || row.status === 'Cancelled') return null;
  return dayDiff(row.pickupDeadline, TODAY);
};

export interface Note {
  text: string;
  /** Bootstrap text tint stem, e.g. "success". */
  tone: string;
}

/**
 * The Pickup Deadline cell's second line. The countdown counts the deadline day
 * itself and the overdue figure does not — both are the template's own wording.
 */
export const deadlineNote = (row: Reservation): Note => {
  switch (row.status) {
    case 'Completed': return { text: 'Collected', tone: 'success' };
    case 'Cancelled': return { text: 'Cancelled', tone: 'muted' };
    case 'Pending Approval': return { text: 'Needs approval', tone: 'muted' };
    case 'Waiting': return { text: 'Awaiting copy', tone: 'muted' };
    default: {
      const days = daysLeft(row);
      if (days === null) return { text: 'Awaiting copy', tone: 'muted' };
      if (days < 0) {
        const ago = Math.abs(days);
        return { text: `Expired ${ago} ${ago === 1 ? 'day' : 'days'} ago`, tone: 'danger' };
      }
      const left = days + 1;
      return { text: `${left} ${left === 1 ? 'day' : 'days'} left`, tone: left >= 3 ? 'success' : 'warning' };
    }
  }
};

/** The panel's "3 days remaining", from the same figure the grid prints. */
export const remainingLabel = (row: Reservation): string => {
  const days = daysLeft(row);
  if (days === null) return '—';
  if (days < 0) {
    const ago = Math.abs(days);
    return `Expired ${ago} ${ago === 1 ? 'day' : 'days'} ago`;
  }
  const left = days + 1;
  return `${left} ${left === 1 ? 'day' : 'days'} remaining`;
};

/** The View dialog's "Time Remaining" badge, e.g. "3 days". */
export const remainingBadge = (row: Reservation): string => {
  const days = daysLeft(row);
  if (days === null) return '—';
  if (days < 0) return 'Expired';
  const left = days + 1;
  return `${left} ${left === 1 ? 'day' : 'days'}`;
};

/** The Queue Position cell's second line, which follows the number or status. */
export const queueNote = (row: Reservation): string => {
  if (row.queuePosition !== null) {
    if (row.queuePosition === 1) return 'Next in line';
    const behind = row.queuePosition - 1;
    return `Behind ${behind} ${behind === 1 ? 'member' : 'members'}`;
  }
  switch (row.status) {
    case 'Ready for Pickup': return 'Ready';
    case 'Pending Approval': return 'Not queued';
    case 'Expired': return 'Released';
    case 'Completed': return 'Fulfilled';
    case 'Cancelled': return 'Removed';
    default: return 'Queued';
  }
};

/** The View dialog's Queue Position badge. */
export const queueBadge = (row: Reservation): { label: string; badge: string } => {
  if (row.queuePosition !== null) {
    return { label: `Position ${row.queuePosition}`, badge: 'badge badge-soft-warning' };
  }
  if (row.status === 'Ready for Pickup') {
    return { label: 'Allocated', badge: 'badge badge-soft-success' };
  }
  return { label: queueNote(row), badge: 'badge badge-soft-secondary' };
};

/** A Ready-for-Pickup reservation is physically holding one copy. */
export const onHold = (row: Reservation): number => (row.status === 'Ready for Pickup' ? 1 : 0);

/** Total, less what is on the shelf and what this hold is keeping back. */
export const currentlyIssued = (row: Reservation): number =>
  Math.max(0, row.totalCopies - row.availableNow - onHold(row));

export const booksHeldLabel = (row: Reservation): string => `${row.booksHeld} of ${row.booksAllowed}`;

/** True when the member is already at the borrowing limit. */
export const atLimit = (row: Reservation): boolean => row.booksHeld >= row.booksAllowed;

/**
 * The expander's Pickup Information block. A live hold reports its deadline and
 * hold duration; a collected one reports when it was picked up and when it is
 * due back — the labels the template swaps between.
 */
export const pickupInfo = (row: Reservation): Pair[] => [
  { label: 'Pickup Point', value: row.pickupPoint },
  { label: 'Available From', value: row.availableFrom },
  ...(row.status === 'Completed'
    ? [
        { label: 'Collected On', value: row.collectedOn ?? '—' },
        { label: 'Issued Until', value: row.issuedUntil ?? '—' },
      ]
    : [
        { label: 'Deadline', value: row.deadlineTime },
        { label: 'Hold Duration', value: row.holdDuration },
      ]),
];

/** Which footer buttons the expander offers, following the reservation's state. */
export type ExpanderAction = 'complete' | 'approve' | 'view';

export const expanderAction = (row: Reservation): ExpanderAction => {
  if (row.status === 'Ready for Pickup') return 'complete';
  if (row.status === 'Pending Approval') return 'approve';
  return 'view';
};

/* ------------------------------ Filter bands ------------------------------- */

export const queueBand = (row: Reservation): string => {
  if (row.queuePosition === null) return NO_QUEUE;
  if (row.queuePosition === 1) return 'Position 1';
  if (row.queuePosition <= 3) return 'Position 2 – 3';
  return 'Beyond position 3';
};

/**
 * The Pickup Deadline filter. Only a reservation that is still running against
 * its clock — or one that already lost the race — is in scope; a collected or
 * cancelled hold has no deadline left to fall due.
 */
export const matchesDeadline = (row: Reservation, band: string): boolean => {
  if (!isOpen(row) && row.status !== 'Expired') return false;
  const days = daysLeft(row);
  if (days === null) return false;
  switch (band) {
    case 'Expiring today': return days === 0;
    case 'Within 48 hours': return days >= 0 && days <= 2;
    case 'This week': return days >= 0 && days <= 7;
    case 'Already expired': return days < 0;
    default: return true;
  }
};

export const expiringToday = (row: Reservation): boolean => matchesDeadline(row, 'Expiring today');

export const librarianLabel = (row: Reservation): string => row.librarian ?? UNASSIGNED;

export const searchIndexOf = (row: Reservation): string =>
  `${row.id} ${row.book} ${row.author} ${row.category} ${row.accession} ${row.member} ${row.memberId} ${row.memberMeta} ${librarianLabel(row)}`.toLowerCase();

/* ---------------------------- Member photographs --------------------------- */

/**
 * The waiting-list and queue rails print a face beside a name, so the photo is
 * looked up from the roster rather than repeated on every card that names a
 * member.
 */
export const memberPhotos: Record<string, string> = {
  'Janet Daniel': 'assets/img/students/student-01.jpg',
  'Susan Boswell': 'assets/img/students/student-07.jpg',
  'Kathleen Dison': 'assets/img/students/student-03.jpg',
  'Joann Michael': 'assets/img/students/student-02.jpg',
  'Ralph Claudia': 'assets/img/students/student-05.jpg',
  'Teresa Susan': 'assets/img/teachers/teacher-01.jpg',
  'Julie Scott': 'assets/img/students/student-06.jpg',
  'Richard Soley': 'assets/img/students/student-08.jpg',
};

const FALLBACK_PHOTO = 'assets/img/students/student-04.jpg';

export const photoOf = (name: string): string => memberPhotos[name] ?? FALLBACK_PHOTO;

/** The expander's waiting-list sub-line. */
export const queueEntryMeta = (entry: QueueEntry): string =>
  entry.position === null ? entry.note : `Position ${entry.position} · ${entry.note}`;

/** The panel's waiting-list sub-line, which prints the full date. */
export const queueEntryPanelMeta = (entry: QueueEntry): string =>
  entry.reserved ? `Reserved ${entry.reserved}` : entry.note.charAt(0).toUpperCase() + entry.note.slice(1);

/* ------------------------------ Dialog choices ----------------------------- */

/** The Add dialog's Book Title list, carrying what a new reservation needs. */
export interface BookChoice {
  label: string;
  title: string;
  author: string;
  category: string;
  categoryCode: string;
  accession: string;
  tint: string;
  shelf: string;
  totalCopies: number;
  availableNow: number;
}

export const SELECT_BOOK = 'Select book';

export const bookChoices: BookChoice[] = [
  {
    label: 'Percy Jackson Series · ACC-0912', title: 'Percy Jackson Series', author: 'Rick Riordan',
    category: 'Fiction', categoryCode: 'CAT-003', accession: 'ACC-0912', tint: 'success',
    shelf: 'C1 – C5', totalCopies: 20, availableNow: 1,
  },
  {
    label: 'The Hobbit · ACC-0778', title: 'The Hobbit', author: 'J. R. R. Tolkien',
    category: 'Fiction', categoryCode: 'CAT-003', accession: 'ACC-0778', tint: 'success',
    shelf: 'C1 – C5', totalCopies: 14, availableNow: 3,
  },
  {
    label: 'Concepts of Physics — Vol I · ACC-0341', title: 'Concepts of Physics — Vol I',
    author: 'H. C. Verma', category: 'Academic Books', categoryCode: 'CAT-001',
    accession: 'ACC-0341', tint: 'primary', shelf: 'A1 – A6', totalCopies: 18, availableNow: 0,
  },
  {
    label: 'Sapiens · ACC-1188', title: 'Sapiens', author: 'Yuval Noah Harari',
    category: 'Non-Fiction', categoryCode: 'CAT-004', accession: 'ACC-1188', tint: 'warning',
    shelf: 'C6 – C8', totalCopies: 8, availableNow: 4,
  },
  {
    label: 'Advanced Algebra Workbook · ACC-0455', title: 'Advanced Algebra Workbook',
    author: 'S. L. Loney', category: 'Academic Books', categoryCode: 'CAT-001',
    accession: 'ACC-0455', tint: 'primary', shelf: 'A1 – A6', totalCopies: 24, availableNow: 2,
  },
];

/** The Add dialog's Member list. */
export interface MemberChoice {
  label: string;
  name: string;
  memberId: string;
  memberType: MemberType;
  meta: string;
  booksHeld: number;
  booksAllowed: number;
  overdueItems: number;
  contact: string;
}

export const SELECT_MEMBER = 'Select member';

export const memberChoices: MemberChoice[] = [
  {
    label: 'Janet Daniel · LIB-2041', name: 'Janet Daniel', memberId: 'LIB-2041',
    memberType: 'Student', meta: 'III A · AD9892434', booksHeld: 2, booksAllowed: 3,
    overdueItems: 0, contact: '+1 546 8548 891',
  },
  {
    label: 'Joann Michael · LIB-2052', name: 'Joann Michael', memberId: 'LIB-2052',
    memberType: 'Student', meta: 'IV B · AD9892433', booksHeld: 1, booksAllowed: 3,
    overdueItems: 0, contact: '+1 546 8548 892',
  },
  {
    label: 'Kathleen Dison · LIB-2088', name: 'Kathleen Dison', memberId: 'LIB-2088',
    memberType: 'Student', meta: 'III A · AD9892432', booksHeld: 3, booksAllowed: 3,
    overdueItems: 0, contact: '+1 546 8548 893',
  },
  {
    label: 'Susan Boswell · LIB-2107', name: 'Susan Boswell', memberId: 'LIB-2107',
    memberType: 'Student', meta: 'IV A · AD9892428', booksHeld: 1, booksAllowed: 3,
    overdueItems: 0, contact: '+1 546 8548 897',
  },
  {
    label: 'Teresa Susan · LIB-1008', name: 'Teresa Susan', memberId: 'LIB-1008',
    memberType: 'Teaching Staff', meta: 'Staff · STF-2001', booksHeld: 4, booksAllowed: 6,
    overdueItems: 0, contact: '+1 546 8548 801',
  },
];

export const LEAVE_UNASSIGNED = 'Leave unassigned';

/** "Mary Winsler · Head Librarian" — the dialogs' librarian pickers. */
export const librarianChoices = ['Mary Winsler · Head Librarian', 'Anita Rao · Librarian'];

export const assignChoices = [...librarianChoices, LEAVE_UNASSIGNED];

export const holdDurationOptions = ['48 hours', '72 hours', '5 days'];

export const pickupPointOptions = ['Library front desk', 'Staff counter', 'Reading room desk'];

export const queuePlacementOptions = [
  'Allocate now — copy available', 'Add to waiting list', 'Priority hold',
];

export const issuedByChoices = ['Anita Rao · Librarian', 'Mary Winsler · Head Librarian'];

export const loanPeriodOptions = ['14 days', '21 days — Fiction', '7 days'];

export const conditionOptions = ['Good', 'Minor wear', 'Damaged — noted'];

export const cancellationReasons = [
  'Requested by member', 'Not collected in time', 'Book withdrawn from catalogue',
  'Borrowing limit reached', 'Duplicate reservation',
];

export const cancelledByChoices = [
  'Anita Rao · Librarian', 'Mary Winsler · Head Librarian', 'Member self-service',
];

/** "Anita Rao · Librarian" → { name: "Anita Rao", role: "Librarian" }. */
export const splitLibrarian = (choice: string): { name: string | null; role: string } => {
  if (choice === LEAVE_UNASSIGNED) return { name: null, role: UNASSIGNED };
  const [name, role] = choice.split(' · ');
  return { name: name ?? choice, role: role ?? 'Librarian' };
};

/* ----------------------------------- Rows ---------------------------------- */

export const reservations: Reservation[] = [
  {
    id: 'RSV-2026-0184',
    book: 'Percy Jackson Series', author: 'Rick Riordan',
    category: 'Fiction', categoryCode: 'CAT-003', accession: 'ACC-0912', bookTint: 'success',
    shelf: 'C1 – C5', totalCopies: 20, availableNow: 1, nextReturnDue: '03 Aug 2026',
    member: 'Janet Daniel', memberMeta: 'III A · AD9892434', memberId: 'LIB-2041',
    memberType: 'Student', booksHeld: 2, booksAllowed: 3, overdueItems: 0,
    contact: '+1 546 8548 891',
    reservedOn: '28 Jul 2026', pickupDeadline: '02 Aug 2026', status: 'Ready for Pickup',
    queuePosition: null, librarian: 'Anita Rao', librarianRole: 'Librarian',
    approvedBy: 'Anita Rao', allocatedOn: '30 Jul 2026',
    pickupPoint: 'Library front desk', availableFrom: '30 Jul 2026',
    deadlineTime: '02 Aug 2026 · 04:00 PM', holdDuration: '72 hours',
    collectedOn: null, issuedUntil: null, holdShelf: 'Slot H-14',
    waitingList: [
      { name: 'Joann Michael', position: 1, note: 'reserved 29 Jul', reserved: '29 Jul 2026' },
      { name: 'Susan Boswell', position: 2, note: 'reserved 30 Jul', reserved: '30 Jul 2026' },
    ],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '28 Jul 2026 · 10:12 AM · Parent portal' },
      { title: 'Approved by librarian', meta: '28 Jul 2026 · Anita Rao' },
      { title: 'Copy returned and allocated', meta: '30 Jul 2026 · ACC-0912' },
    ],
    notifications: [
      { title: 'Ready-for-pickup email sent', meta: '30 Jul 2026 · 11:02 AM' },
      { title: 'SMS reminder sent', meta: '31 Jul 2026 · 09:00 AM' },
    ],
    notes: 'Highest-demand title in the library. Two members waiting — release the hold promptly if not collected.',
  },
  {
    id: 'RSV-2026-0186',
    book: 'Concepts of Physics — Vol I', author: 'H. C. Verma',
    category: 'Academic Books', categoryCode: 'CAT-001', accession: 'ACC-0341', bookTint: 'primary',
    shelf: 'A1 – A6', totalCopies: 18, availableNow: 0, nextReturnDue: '04 Aug 2026',
    member: 'Susan Boswell', memberMeta: 'IV A · AD9892428', memberId: 'LIB-2107',
    memberType: 'Student', booksHeld: 1, booksAllowed: 3, overdueItems: 0,
    contact: '+1 546 8548 897',
    reservedOn: '30 Jul 2026', pickupDeadline: null, status: 'Waiting',
    queuePosition: 1, librarian: 'Mary Winsler', librarianRole: 'Head Librarian',
    approvedBy: 'Mary Winsler', allocatedOn: null,
    pickupPoint: 'Library front desk', availableFrom: 'Expected 04 Aug 2026',
    deadlineTime: 'Set on allocation', holdDuration: '72 hours',
    collectedOn: null, issuedUntil: null, holdShelf: '—',
    waitingList: [
      { name: 'Ralph Claudia', position: 2, note: 'reserved 30 Jul', reserved: '30 Jul 2026' },
    ],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '30 Jul 2026 · 02:40 PM · Library desk' },
      { title: 'Approved by librarian', meta: '30 Jul 2026 · Mary Winsler' },
      { title: 'Queued — all copies issued', meta: '30 Jul 2026 · expected 04 Aug' },
    ],
    notifications: [
      { title: 'Reservation confirmed email', meta: '30 Jul 2026 · 02:42 PM' },
    ],
    notes: 'All 18 copies issued. Earliest return due 04 Aug 2026; member will be notified automatically.',
  },
  {
    id: 'RSV-2026-0188',
    book: 'Sapiens', author: 'Yuval Noah Harari',
    category: 'Non-Fiction', categoryCode: 'CAT-004', accession: 'ACC-1188', bookTint: 'warning',
    shelf: 'C6 – C8', totalCopies: 8, availableNow: 4, nextReturnDue: '—',
    member: 'Kathleen Dison', memberMeta: 'III A · AD9892432', memberId: 'LIB-2088',
    memberType: 'Student', booksHeld: 3, booksAllowed: 3, overdueItems: 0,
    contact: '+1 546 8548 893',
    reservedOn: '31 Jul 2026', pickupDeadline: null, status: 'Pending Approval',
    queuePosition: null, librarian: null, librarianRole: 'Unassigned',
    approvedBy: null, allocatedOn: null,
    pickupPoint: 'Library front desk', availableFrom: 'On approval',
    deadlineTime: 'Set on approval', holdDuration: '72 hours',
    collectedOn: null, issuedUntil: null, holdShelf: '—',
    waitingList: [],
    waitingNote: 'No waiting list — copies are available.',
    timeline: [
      { title: 'Reservation placed', meta: '31 Jul 2026 · 09:18 AM · Parent portal' },
      { title: 'Held for approval — borrowing limit reached', meta: '31 Jul 2026 · System' },
    ],
    notifications: [
      { title: 'Reservation received email', meta: '31 Jul 2026 · 09:20 AM' },
    ],
    notes: 'Member already holds 3 of 3 permitted books. Approve only if a return is recorded first.',
  },
  {
    id: 'RSV-2026-0179',
    book: 'The Hobbit', author: 'J. R. R. Tolkien',
    category: 'Fiction', categoryCode: 'CAT-003', accession: 'ACC-0778', bookTint: 'success',
    shelf: 'C1 – C5', totalCopies: 14, availableNow: 3, nextReturnDue: '—',
    member: 'Joann Michael', memberMeta: 'IV B · AD9892433', memberId: 'LIB-2052',
    memberType: 'Student', booksHeld: 1, booksAllowed: 3, overdueItems: 0,
    contact: '+1 546 8548 892',
    reservedOn: '24 Jul 2026', pickupDeadline: '29 Jul 2026', status: 'Expired',
    queuePosition: null, librarian: 'Anita Rao', librarianRole: 'Librarian',
    approvedBy: 'Anita Rao', allocatedOn: '26 Jul 2026',
    pickupPoint: 'Library front desk', availableFrom: '26 Jul 2026',
    deadlineTime: '29 Jul 2026 · 04:00 PM', holdDuration: '72 hours',
    collectedOn: null, issuedUntil: null, holdShelf: '—',
    waitingList: [
      { name: 'Julie Scott', position: 1, note: 'hold released to this member', reserved: null },
    ],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '24 Jul 2026 · 11:30 AM · Library desk' },
      { title: 'Marked ready for pickup', meta: '26 Jul 2026 · Anita Rao' },
      { title: 'Expired — not collected', meta: '29 Jul 2026 · System' },
    ],
    notifications: [
      { title: 'Ready-for-pickup email sent', meta: '26 Jul 2026 · 03:15 PM' },
      { title: 'Final reminder SMS sent', meta: '29 Jul 2026 · 09:00 AM' },
      { title: 'Expiry notice sent', meta: '29 Jul 2026 · 04:05 PM' },
    ],
    notes: 'Hold expired and passed to the next member in the queue. Member may re-reserve at any time.',
  },
  {
    id: 'RSV-2026-0182',
    book: 'Advanced Algebra Workbook', author: 'S. L. Loney',
    category: 'Academic Books', categoryCode: 'CAT-001', accession: 'ACC-0455', bookTint: 'primary',
    shelf: 'A1 – A6', totalCopies: 24, availableNow: 2, nextReturnDue: '—',
    member: 'Ralph Claudia', memberMeta: 'V A · AD9892430', memberId: 'LIB-2094',
    memberType: 'Student', booksHeld: 2, booksAllowed: 3, overdueItems: 0,
    contact: '+1 546 8548 895',
    reservedOn: '27 Jul 2026', pickupDeadline: '01 Aug 2026', status: 'Ready for Pickup',
    queuePosition: null, librarian: 'Mary Winsler', librarianRole: 'Head Librarian',
    approvedBy: 'Mary Winsler', allocatedOn: '29 Jul 2026',
    pickupPoint: 'Library front desk', availableFrom: '29 Jul 2026',
    deadlineTime: '01 Aug 2026 · 04:00 PM', holdDuration: '72 hours',
    collectedOn: null, issuedUntil: null, holdShelf: '—',
    waitingList: [],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '27 Jul 2026 · 01:05 PM · Library desk' },
      { title: 'Approved by librarian', meta: '27 Jul 2026 · Mary Winsler' },
      { title: 'Copy allocated and held', meta: '29 Jul 2026 · ACC-0455' },
    ],
    notifications: [
      { title: 'Ready-for-pickup email sent', meta: '29 Jul 2026 · 10:40 AM' },
    ],
    notes: 'Requested ahead of the Term II mathematics assessment. Reminder scheduled for 31 Jul.',
  },
  {
    id: 'RSV-2026-0175',
    book: 'World History Companion', author: 'Editorial Board',
    category: 'Academic Books', categoryCode: 'CAT-001', accession: 'ACC-0602', bookTint: 'primary',
    shelf: 'A1 – A6', totalCopies: 16, availableNow: 11, nextReturnDue: '—',
    member: 'Teresa Susan', memberMeta: 'Staff · STF-2001', memberId: 'LIB-1008',
    memberType: 'Teaching Staff', booksHeld: 4, booksAllowed: 6, overdueItems: 0,
    contact: '+1 546 8548 801',
    // The grid prints 25 Jul as the pickup-by date; the expander stamps the
    // collection at 24 Jul. Both are the template's, so both are kept.
    reservedOn: '22 Jul 2026', pickupDeadline: '25 Jul 2026', status: 'Completed',
    queuePosition: null, librarian: 'Anita Rao', librarianRole: 'Librarian',
    approvedBy: 'Anita Rao', allocatedOn: '23 Jul 2026',
    pickupPoint: 'Staff counter', availableFrom: '23 Jul 2026',
    deadlineTime: '25 Jul 2026 · 04:00 PM', holdDuration: '72 hours',
    collectedOn: '24 Jul 2026 · 02:20 PM', issuedUntil: '07 Aug 2026', holdShelf: '—',
    waitingList: [],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '22 Jul 2026 · 09:45 AM · Library desk' },
      { title: 'Marked ready for pickup', meta: '23 Jul 2026 · Anita Rao' },
      { title: 'Collected and issued', meta: '24 Jul 2026 · due 07 Aug 2026' },
    ],
    notifications: [
      { title: 'Ready-for-pickup email sent', meta: '23 Jul 2026 · 04:10 PM' },
      { title: 'Issue confirmation sent', meta: '24 Jul 2026 · 02:22 PM' },
    ],
    notes: 'Reserved for the Grade VIII history unit. Staff loan period of 14 days applied.',
  },
  {
    id: 'RSV-2026-0187',
    book: 'To Kill a Mockingbird', author: 'Harper Lee',
    category: 'Fiction', categoryCode: 'CAT-003', accession: 'ACC-0821', bookTint: 'success',
    shelf: 'C1 – C5', totalCopies: 12, availableNow: 0, nextReturnDue: '06 Aug 2026',
    member: 'Julie Scott', memberMeta: 'VI A · AD9892429', memberId: 'LIB-2066',
    memberType: 'Student', booksHeld: 2, booksAllowed: 3, overdueItems: 1,
    contact: '+1 546 8548 896',
    reservedOn: '30 Jul 2026', pickupDeadline: null, status: 'Waiting',
    queuePosition: 2, librarian: 'Anita Rao', librarianRole: 'Librarian',
    approvedBy: 'Anita Rao', allocatedOn: null,
    pickupPoint: 'Library front desk', availableFrom: 'Expected 06 Aug 2026',
    deadlineTime: 'Set on allocation', holdDuration: '72 hours',
    collectedOn: null, issuedUntil: null, holdShelf: '—',
    waitingList: [
      { name: 'Richard Soley', position: 1, note: 'reserved 29 Jul', reserved: '29 Jul 2026' },
      { name: 'Julie Scott', position: 2, note: 'this reservation', reserved: '30 Jul 2026' },
    ],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '30 Jul 2026 · 03:52 PM · Parent portal' },
      { title: 'Approved by librarian', meta: '30 Jul 2026 · Anita Rao' },
      { title: 'Queued at position 2', meta: '30 Jul 2026 · expected 06 Aug' },
    ],
    notifications: [
      { title: 'Reservation confirmed email', meta: '30 Jul 2026 · 03:54 PM' },
    ],
    notes: 'Member has 1 overdue item. Allocation will be blocked until the overdue title is returned.',
  },
  {
    id: 'RSV-2026-0181',
    book: 'Young Explorer Monthly', author: 'Periodical',
    category: 'Magazines', categoryCode: 'CAT-007', accession: 'ACC-1402', bookTint: 'secondary',
    shelf: 'B3', totalCopies: 12, availableNow: 9, nextReturnDue: '—',
    member: 'Richard Soley', memberMeta: 'V B · AD9892427', memberId: 'LIB-2073',
    memberType: 'Student', booksHeld: 0, booksAllowed: 3, overdueItems: 0,
    contact: '+1 546 8548 898',
    reservedOn: '26 Jul 2026', pickupDeadline: null, status: 'Cancelled',
    queuePosition: null, librarian: 'Anita Rao', librarianRole: 'Librarian',
    approvedBy: null, allocatedOn: null,
    pickupPoint: '—', availableFrom: '—',
    deadlineTime: '—', holdDuration: '—',
    collectedOn: null, issuedUntil: null, holdShelf: '—',
    waitingList: [],
    waitingNote: 'No waiting list for this title.',
    timeline: [
      { title: 'Reservation placed', meta: '26 Jul 2026 · 12:15 PM · Library desk' },
      { title: 'Cancelled by member', meta: '27 Jul 2026 · 10:05 AM' },
    ],
    notifications: [
      { title: 'Reservation confirmed email', meta: '26 Jul 2026 · 12:17 PM' },
      { title: 'Cancellation confirmation sent', meta: '27 Jul 2026 · 10:06 AM' },
    ],
    notes: 'Cancelled by the member the following day. Issue reverted to the open shelf.',
  },
];
