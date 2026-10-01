export type PaymentStatus =
  | 'Paid' | 'Pending' | 'Partially Paid' | 'Overdue' | 'Refund Due' | 'Not Billed' | 'Concession Review';

export type RoomType = 'Single Room' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing' | 'Dormitory';

export interface Pair {
  label: string;
  value: string;
}

export interface PaymentEntry {
  /** "Term I — $1,050". */
  title: string;
  /** "05 Jun 2026 · refunded". */
  meta: string;
}

export interface FineEntry {
  title: string;
  meta: string;
}

export interface HostelFee {
  id: string;
  student: string;
  avatar: string;
  classSection: string;
  roll: string;
  admission: string;
  guardian: string;
  mobile: string;

  /** Short hostel name as the badge prints it, or '' when unassigned. */
  hostel: string;
  room: string;
  roomType: RoomType;
  plan: string;
  fee: number;
  /**
   * Outstanding amount. Negative is a refund the school owes; null is the
   * template's em dash, printed when nothing has been billed yet.
   */
  due: number | null;
  /** "05 Aug 2026", "Refund pending", or '' for the em dash. */
  dueDate: string;
  status: PaymentStatus;
  academicYear: string;
  concession: string;

  /** The panel's Hostel & Room Details section, verbatim. */
  hostelPairs: Pair[];
  breakdown: { rent: number; mess: number; maintenance: number; laundry: number };
  deposit: number;
  payments: PaymentEntry[];
  /** Printed instead of the payment list when nothing has been billed. */
  paymentsEmpty?: string;
  discount: string;
  fines: FineEntry[];
  finesEmpty?: string;
  notes: string;
  invoice: string;
  paymentTerm: string;
}

export const statusPill: Record<PaymentStatus, string> = {
  Paid: 'is-active',
  Pending: 'is-pending',
  'Partially Paid': 'is-review',
  Overdue: 'is-blocked',
  'Refund Due': 'is-completed',
  'Not Billed': 'is-inactive',
  'Concession Review': 'is-suspended',
};

/** The View dialog and the panel print the status as a soft badge instead. */
export const statusBadge: Record<PaymentStatus, string> = {
  Paid: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  'Partially Paid': 'badge badge-soft-info',
  Overdue: 'badge badge-soft-danger',
  'Refund Due': 'badge badge-soft-primary',
  'Not Billed': 'badge badge-soft-secondary',
  'Concession Review': 'badge badge-soft-dark',
};

export const roomTypeTint: Record<RoomType, string> = {
  'Single Room': 'warning',
  'Double Sharing': 'info',
  'Triple Sharing': 'success',
  'Four Sharing': 'primary',
  Dormitory: 'secondary',
};

export const hostelTint: Record<string, string> = {
  Nightingale: 'purple',
  Everest: 'primary',
};

export const hostelGender: Record<string, string> = {
  Nightingale: 'Girls Hostel',
  Everest: 'Boys Hostel',
};

/* ------------------------------ Filter options ------------------------------ */

export const hostelOptions = [
  'Nightingale Hostel · Girls', 'Everest Hostel · Boys', 'Not assigned',
];

export const roomTypeOptions: RoomType[] = [
  'Single Room', 'Double Sharing', 'Triple Sharing', 'Four Sharing', 'Dormitory',
];

export const feePlanOptions = [
  'Standard Four Sharing · $2,100', 'Premium Double Sharing · $2,600',
  'Economy Triple Sharing · $1,800', 'Single Room Deluxe · $3,400', 'Dormitory Basic · $1,200',
];

export const statusOptions: PaymentStatus[] = [
  'Paid', 'Partially Paid', 'Pending', 'Overdue', 'Refund Due', 'Not Billed',
];

export const academicYearOptions = ['2026 / 2027', '2025 / 2026'];

export const paymentTermOptions = ['Term I', 'Term II', 'Annual · one instalment'];

export const dueAmountOptions = ['Nothing due', 'Up to $1,000', '$1,000 – $2,000', 'Over $2,000'];

export const concessionOptions = [
  'Need-based', 'Sibling concession', 'Merit scholarship', 'Staff ward', 'None',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const planHostelOptions = ['All hostels', 'Nightingale Hostel · Girls', 'Everest Hostel · Boys'];

export const planTermOptions = ['Two instalments', 'Annual · one instalment', 'Monthly'];

export const planChoices = [
  'Premium Double Sharing · $2,600', 'Standard Four Sharing · $2,100',
  'Economy Triple Sharing · $1,800', 'Single Room Deluxe · $3,400', 'Dormitory Basic · $1,200',
];

export const concessionChoices = [
  'None', 'Need-based', 'Sibling concession', 'Merit scholarship', 'Staff ward',
];

export const paymentMethodOptions = ['Bank Transfer', 'Card', 'UPI', 'Cash', 'Cheque'];

export const recordTermOptions = ['Term II', 'Term I', 'Annual'];

export const collectedByOptions = ['Accounts Office', 'Hostel Warden', 'Online Gateway'];

export const receiptFormatOptions = ['A4 · PDF', 'Thermal · 80mm', 'Email · HTML'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const money = (value: number): string => `$${Math.abs(value).toLocaleString('en-US')}`;

/** A refund prints as the template's "−$900". */
export const dueLabel = (row: HostelFee): string => {
  if (row.due === null) return DASH;
  return row.due < 0 ? `−${money(row.due)}` : money(row.due);
};

export const dueTint = (row: HostelFee): string => {
  if (row.due === null) return 'muted';
  if (row.due < 0) return 'info';
  if (row.due === 0) return 'success';
  return row.status === 'Overdue' ? 'danger' : 'warning';
};

export const breakdownTotal = (row: HostelFee): number =>
  row.breakdown.rent + row.breakdown.mess + row.breakdown.maintenance + row.breakdown.laundry;

export const hostelTintOf = (row: HostelFee): string => hostelTint[row.hostel] ?? 'secondary';

export const studentLineOf = (row: HostelFee): string =>
  `${row.classSection} · Roll ${row.roll} · ${row.admission}`;

/** "Standard Four Sharing  •  2026 / 2027  •  Two instalments". */
export const planLineOf = (row: HostelFee): string =>
  `${row.plan}  •  ${row.academicYear}  •  ${row.paymentTerm}`;

/** "Nightingale · A-104 · Four Sharing", the line the dialogs print. */
export const placementOf = (row: HostelFee): string =>
  row.room ? `${row.hostel} · ${row.room} · ${row.roomType}` : `Unassigned · ${row.roomType}`;

export const chargePairsOf = (row: HostelFee): Pair[] => [
  { label: 'Room Rent', value: money(row.breakdown.rent) },
  { label: 'Mess Charges', value: money(row.breakdown.mess) },
  { label: 'Maintenance', value: money(row.breakdown.maintenance) },
  { label: 'Laundry', value: money(row.breakdown.laundry) },
];

export const studentPairsOf = (row: HostelFee): Pair[] => [
  { label: 'Roll No', value: row.roll },
  { label: 'Class & Section', value: row.classSection },
  { label: 'Admission No', value: row.admission },
  { label: 'Guardian', value: row.guardian },
  { label: 'Mobile', value: row.mobile },
];

/** Open fines, which the panel and the balance section both total. */
export const openFinesOf = (row: HostelFee): number =>
  row.fines.reduce((total, fine) => {
    const match = /\$([0-9,]+)/.exec(fine.meta);
    return total + (match ? Number(match[1].replace(/,/g, '')) : 0);
  }, 0);

/**
 * The Payment Term filter names an instalment, not a billing cycle: a row
 * belongs to the first instalment it has not settled, or to its last one when
 * everything is paid. Rows with nothing billed belong to no term.
 */
export const termOf = (row: HostelFee): string => {
  if (row.payments.length === 0) return '';
  const unpaid = row.payments.find((entry) => !/paid/i.test(entry.meta));
  const title = (unpaid ?? row.payments[row.payments.length - 1]).title;
  if (/term i\b/i.test(title)) return 'Term I';
  if (/term ii/i.test(title)) return 'Term II';
  return 'Annual · one instalment';
};

export const dueBandOf = (row: HostelFee): string => {
  if (row.due === null || row.due <= 0) return 'Nothing due';
  if (row.due <= 1000) return 'Up to $1,000';
  if (row.due <= 2000) return '$1,000 – $2,000';
  return 'Over $2,000';
};

/** The Fee Plan filter names the plan and its rate together. */
export const planKeyOf = (row: HostelFee): string => `${row.plan} · ${money(row.fee)}`;

export const hostelKeyOf = (row: HostelFee): string =>
  row.hostel ? `${row.hostel} Hostel · ${hostelGender[row.hostel]?.replace(' Hostel', '')}` : 'Not assigned';

export const searchIndexOf = (row: HostelFee): string =>
  [
    row.student, row.admission, row.classSection, row.hostel, row.room, row.roomType,
    row.plan, row.status, row.invoice, row.concession, row.academicYear, dueLabel(row),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for "05 Aug 2026"; anything else sorts last. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return Number.MAX_SAFE_INTEGER;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole register — 186 paid students against the eight
 * rows this page holds — so the template's figures stand.
 */
export const SUMMARY_TOTALS = {
  plans: 5,
  hostels: 2,
  paid: 186,
  paidShare: 71,
  pending: 62,
  overdue: 14,
  outstanding: 21400,
  collected: 486300,
};

/* ---------------------------------- Rows ------------------------------------ */

export const hostelFees: HostelFee[] = [
  {
    id: 'HF-01', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg',
    classSection: 'II B', roll: '35204', admission: 'AD9892431',
    guardian: 'Janet Gourley', mobile: '+1 546 8548 894',
    hostel: 'Nightingale', room: 'A-104', roomType: 'Four Sharing',
    plan: 'Standard Four Sharing', fee: 2100, due: 1050, dueDate: '05 Aug 2026',
    status: 'Pending', academicYear: '2026 / 2027', concession: 'None',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Room No', value: 'A-104' },
      { label: 'Bed No', value: 'B2' },
      { label: 'Block & Floor', value: 'Block A · 1st Floor' },
      { label: 'Allocation', value: 'ALC-2026-0118' },
    ],
    breakdown: { rent: 1200, mess: 600, maintenance: 150, laundry: 150 }, deposit: 200,
    payments: [
      { title: 'Term I — $1,050', meta: '05 Jun 2026 · refunded' },
      { title: 'Term II — $1,050', meta: 'Due 05 Aug 2026' },
    ],
    discount: 'No concession applied. Full plan rate billed for 2026 / 2027.',
    fines: [{ title: 'FN-2026-0225 · Room damage', meta: '$120 · open' }],
    notes: 'Duplicate Term I payment refunded via REF-2026-0042. Invoice INV-2026-0429.',
    invoice: 'INV-2026-0429', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-02', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg',
    classSection: 'VI A', roll: '35606', admission: 'AD9892429',
    guardian: 'Andrew Scott', mobile: '+1 546 8548 896',
    hostel: 'Nightingale', room: 'B-208', roomType: 'Double Sharing',
    plan: 'Premium Double Sharing', fee: 2600, due: 1300, dueDate: '05 Aug 2026',
    status: 'Partially Paid', academicYear: '2026 / 2027', concession: 'None',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Room No', value: 'B-208' },
      { label: 'Bed No', value: 'B1' },
      { label: 'Block & Floor', value: 'Block B · 2nd Floor' },
      { label: 'Allocation', value: 'ALC-2026-0121' },
    ],
    breakdown: { rent: 1600, mess: 600, maintenance: 200, laundry: 200 }, deposit: 200,
    payments: [
      { title: 'Term I — $1,300', meta: '05 Jun 2026 · paid' },
      { title: 'Term II — $1,300', meta: 'Due 05 Aug 2026' },
    ],
    discount: 'No concession applied. Senior wing plan rate.',
    fines: [], finesEmpty: 'No fines raised against this student.',
    notes: 'Invoice INV-2026-0466. Term I settled by bank transfer on 05 Jun 2026.',
    invoice: 'INV-2026-0466', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-03', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg',
    classSection: 'V B', roll: '35508', admission: 'AD9892427',
    guardian: 'Helen Soley', mobile: '+1 546 8548 898',
    hostel: 'Everest', room: 'C-012', roomType: 'Triple Sharing',
    plan: 'Economy Triple Sharing', fee: 1800, due: 1800, dueDate: '05 Jul 2026',
    status: 'Overdue', academicYear: '2026 / 2027', concession: 'None',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Room No', value: 'C-012' },
      { label: 'Bed No', value: 'B3' },
      { label: 'Block & Floor', value: 'Block C · Ground' },
      { label: 'Allocation', value: 'ALC-2026-0125' },
    ],
    breakdown: { rent: 1000, mess: 550, maintenance: 125, laundry: 125 }, deposit: 200,
    payments: [
      { title: 'Term I — $900', meta: 'Overdue since 05 Jul 2026' },
      { title: 'Term II — $900', meta: 'Due 05 Aug 2026' },
    ],
    discount: 'No concession applied. Concession request declined on 12 Jun 2026.',
    fines: [{ title: 'Late payment charge', meta: '$45 · open' }],
    notes: 'Hostel privileges on hold pending clearance of INV-2026-0474. Bed held 30 days.',
    invoice: 'INV-2026-0474', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-04', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg',
    classSection: 'IV B', roll: '35102', admission: 'AD9892433',
    guardian: 'Peter Michael', mobile: '+1 546 8548 892',
    hostel: 'Everest', room: 'B-118', roomType: 'Four Sharing',
    plan: 'Standard Four Sharing', fee: 2100, due: 1050, dueDate: '05 Aug 2026',
    status: 'Partially Paid', academicYear: '2026 / 2027', concession: 'Sibling concession',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Room No', value: 'B-118' },
      { label: 'Bed No', value: 'B4' },
      { label: 'Block & Floor', value: 'Block B · 1st Floor' },
      { label: 'Allocation', value: 'ALC-2026-0134' },
    ],
    breakdown: { rent: 1200, mess: 600, maintenance: 150, laundry: 150 }, deposit: 200,
    payments: [
      { title: 'Term I — $1,050', meta: '18 Jun 2026 · paid' },
      { title: 'Term II — $1,050', meta: 'Due 05 Aug 2026' },
    ],
    discount: 'Sibling concession of 5% applied to the mess charge from Term II.',
    fines: [], finesEmpty: 'No fines raised against this student.',
    notes: 'Invoice INV-2026-0481. Transfer to Block A requested — plan rate is unchanged.',
    invoice: 'INV-2026-0481', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-05', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg',
    classSection: 'III A', roll: '35011', admission: 'AD9892434',
    guardian: 'Thomas Daniel', mobile: '+1 546 8548 891',
    hostel: 'Nightingale', room: 'C-115', roomType: 'Single Room',
    plan: 'Single Room Deluxe', fee: 3400, due: 0, dueDate: '05 Aug 2026',
    status: 'Paid', academicYear: '2026 / 2027', concession: 'None',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Room No', value: 'C-115' },
      { label: 'Bed No', value: 'B1' },
      { label: 'Block & Floor', value: 'Block C · 1st Floor' },
      { label: 'Allocation', value: 'ALC-2026-0112' },
    ],
    breakdown: { rent: 2300, mess: 700, maintenance: 200, laundry: 200 }, deposit: 200,
    payments: [
      { title: 'Term I — $1,700', meta: '02 Jun 2026 · paid' },
      { title: 'Term II — $1,700', meta: '24 Jul 2026 · paid early' },
    ],
    discount: 'No concession applied. Single room approved on medical grounds at full rate.',
    fines: [], finesEmpty: 'No fines raised against this student.',
    notes: 'Invoice INV-2026-0455 settled in full. Receipt RCP-2026-0318 issued.',
    invoice: 'INV-2026-0455', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-06', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg',
    classSection: 'IV A', roll: '35407', admission: 'AD9892428',
    guardian: 'Mark Boswell', mobile: '+1 546 8548 897',
    hostel: 'Nightingale', room: 'A-006', roomType: 'Triple Sharing',
    plan: 'Economy Triple Sharing', fee: 1800, due: -900, dueDate: 'Refund pending',
    status: 'Refund Due', academicYear: '2026 / 2027', concession: 'None',
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Room No', value: 'A-006 · released' },
      { label: 'Bed No', value: 'B2 · vacant' },
      { label: 'Block & Floor', value: 'Block A · Ground' },
      { label: 'Allocation', value: 'ALC-2026-0108' },
    ],
    breakdown: { rent: 1000, mess: 550, maintenance: 125, laundry: 125 }, deposit: 200,
    payments: [
      { title: 'Term I — $900', meta: '04 Jun 2026 · paid' },
      { title: 'Pro-rata refund — $900', meta: 'Pending accounts approval' },
    ],
    discount: 'No concession applied. Term II not billed following check-out.',
    fines: [], finesEmpty: 'No fines raised against this student.',
    notes: 'Moved to day scholar from Term II. Pro-rata refund of $900 awaiting approval.',
    invoice: 'Refund pending', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-07', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg',
    classSection: 'V A', roll: '35505', admission: 'AD9892430',
    guardian: 'Claudia Ralph', mobile: '+1 546 8548 895',
    hostel: 'Everest', room: 'A-214', roomType: 'Double Sharing',
    plan: 'Premium Double Sharing', fee: 2600, due: null, dueDate: '',
    status: 'Not Billed', academicYear: '2026 / 2027', concession: 'None',
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Room No', value: 'A-214 · reserved' },
      { label: 'Bed No', value: 'B1 · held' },
      { label: 'Block & Floor', value: 'Block A · 2nd Floor' },
      { label: 'Allocation', value: 'ALC-2026-0131' },
    ],
    breakdown: { rent: 1600, mess: 600, maintenance: 200, laundry: 200 }, deposit: 200,
    payments: [], paymentsEmpty: 'No payments recorded — the invoice is raised on allocation approval.',
    discount: 'Not assessed yet. Concession eligibility is reviewed at billing.',
    fines: [], finesEmpty: 'No fines raised against this student.',
    notes: 'Allocation pending approval. Bed held until 05 Aug 2026 before the plan is billed.',
    invoice: 'Raised on approval', paymentTerm: 'Two instalments',
  },
  {
    id: 'HF-08', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg',
    classSection: 'III A', roll: '35013', admission: 'AD9892432',
    guardian: 'Robert Dison', mobile: '+1 546 8548 893',
    hostel: '', room: '', roomType: 'Four Sharing',
    plan: 'Standard Four Sharing', fee: 2100, due: null, dueDate: '',
    status: 'Concession Review', academicYear: '2026 / 2027', concession: 'Need-based',
    hostelPairs: [
      { label: 'Preferred Hostel', value: 'Nightingale Hostel' },
      { label: 'Room No', value: 'Not assigned' },
      { label: 'Bed No', value: 'Not assigned' },
      { label: 'Queue Position', value: '2 of 9' },
      { label: 'Allocation', value: 'ALC-2026-0136' },
    ],
    breakdown: { rent: 1200, mess: 600, maintenance: 150, laundry: 150 }, deposit: 200,
    payments: [], paymentsEmpty: 'No payments recorded — billing starts once a bed is allocated.',
    discount: 'Need-based concession of up to 40% under review with accounts.',
    fines: [], finesEmpty: 'No fines raised against this student.',
    notes: 'On the hostel waiting list. Next four-sharing bed frees on 05 Aug 2026.',
    invoice: 'Raised on allocation', paymentTerm: 'Two instalments',
  },
];
