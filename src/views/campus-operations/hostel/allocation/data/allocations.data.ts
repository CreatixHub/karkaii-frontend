export type AllocationStatus =
  | 'Allocated' | 'Pending Approval' | 'Transfer Requested' | 'Waiting List' | 'Fee Hold' | 'Checked Out';

export type RoomType = 'Single Room' | 'Double Sharing' | 'Triple Sharing' | 'Four Sharing' | 'Dormitory';

export interface Pair {
  label: string;
  value: string;
}

export interface Person {
  name: string;
  /** "III A · bed B1" — the class and the bed in one line. */
  detail: string;
}

export interface HistoryEntry {
  title: string;
  meta: string;
}

export interface Allocation {
  id: string;
  student: string;
  avatar: string;
  /** "II B" — the template prints class and section together. */
  classSection: string;
  roll: string;
  admission: string;
  /** Short hostel name as the badge prints it, or '' for a waiting-list row. */
  hostel: string;
  block: string;
  floor: string;
  room: string;
  bed: string;
  roomType: RoomType;
  checkIn: string;
  academicYear: string;
  status: AllocationStatus;

  bloodGroup: string;
  homeTown: string;
  guardian: string;
  relation: string;
  mobile: string;
  email: string;
  emergency: string;

  /** Beds in the room, and how many of them are taken. */
  capacity: number;
  occupied: number;

  /** The panel's Hostel Details, Room & Bed and Fee sections, verbatim. */
  hostelPairs: Pair[];
  roomPairs: Pair[];
  feePairs: Pair[];

  roommates: Person[];
  /** Printed instead of the roommate cards when there are none. */
  roommatesEmpty?: string;
  history: HistoryEntry[];
  notes: string;

  /** Annual hostel fee in dollars, for the View dialog's invoice strip. */
  annualFee: number;
  invoice: string;
  /** The invoice strip's sub-line, e.g. "Term I refunded · Term II $1,050 due". */
  invoiceNote: string;
  checkOut: string;
  nights: number;
}

export const statusPill: Record<AllocationStatus, string> = {
  Allocated: 'is-active',
  'Pending Approval': 'is-pending',
  'Transfer Requested': 'is-review',
  'Waiting List': 'is-suspended',
  'Fee Hold': 'is-blocked',
  'Checked Out': 'is-completed',
};

/** The View dialog and the offcanvas print the status as a soft badge instead. */
export const statusBadge: Record<AllocationStatus, string> = {
  Allocated: 'badge badge-soft-success',
  'Pending Approval': 'badge badge-soft-warning',
  'Transfer Requested': 'badge badge-soft-info',
  'Waiting List': 'badge badge-soft-secondary',
  'Fee Hold': 'badge badge-soft-danger',
  'Checked Out': 'badge badge-soft-dark',
};

/** Room type badges carry their own tint in the grid. */
export const roomTypeTint: Record<RoomType, string> = {
  'Single Room': 'warning',
  'Double Sharing': 'info',
  'Triple Sharing': 'success',
  'Four Sharing': 'primary',
  Dormitory: 'secondary',
};

/* --------------------------------- Hostels ---------------------------------- */

export interface HostelInfo {
  /** Short name, as the grid badge prints it. */
  name: string;
  full: string;
  gender: 'Girls' | 'Boys';
  tint: string;
  warden: string;
  /**
   * The template prints a warden line only once, in the View dialog, for
   * Nightingale; Everest's follows the same extension series.
   */
  wardenContact: string;
  rooms: number;
  mess: string;
}

export const hostels: HostelInfo[] = [
  {
    name: 'Nightingale', full: 'Nightingale Hostel', gender: 'Girls', tint: 'purple',
    warden: 'Mrs. Alice Ray', wardenContact: '+1 546 8548 301', rooms: 48,
    mess: 'Vegetarian & regular',
  },
  {
    name: 'Everest', full: 'Everest Hostel', gender: 'Boys', tint: 'primary',
    warden: 'Mr. David Kim', wardenContact: '+1 546 8548 302', rooms: 48,
    mess: 'Regular',
  },
];

export const hostelInfoOf = (name: string): HostelInfo | undefined =>
  hostels.find((entry) => entry.name === name);

/* ------------------------------ Filter options ------------------------------ */

export const hostelOptions = [
  'Nightingale Hostel · Girls', 'Everest Hostel · Boys', 'Not assigned',
];

export const blockFloorOptions = [
  'Block A · Ground', 'Block A · 1st Floor', 'Block A · 2nd Floor',
  'Block B · 1st Floor', 'Block B · 2nd Floor',
  'Block C · Ground', 'Block C · 1st Floor',
];

export const roomTypeOptions: RoomType[] = [
  'Single Room', 'Double Sharing', 'Triple Sharing', 'Four Sharing', 'Dormitory',
];

export const roomOptions = [
  'A-104', 'A-214', 'B-118', 'B-208', 'C-012', 'C-115', 'Rooms with free beds',
];

export const statusOptions: AllocationStatus[] = [
  'Allocated', 'Pending Approval', 'Transfer Requested', 'Waiting List', 'Fee Hold', 'Checked Out',
];

export const academicYearOptions = ['2026 / 2027', '2025 / 2026'];

export const bedAvailabilityOptions = ['Room full', '1 bed free', '2 or more free', 'Room vacant'];

export const hostelFeeOptions = [
  'Paid in full', 'Partially paid', 'Overdue', 'Concession applied', 'Not billed',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const studentChoices = [
  'Kathleen Dison · AD9892432',
  'Ralph Claudia · AD9892430',
  'Emily Clark · AD9892435',
  'Jacob Ryan · AD9892436',
];

export const hostelChoices = [
  'Nightingale Hostel · Girls · 18 beds free',
  'Everest Hostel · Boys · 16 beds free',
];

export const blockOptions = ['Block A', 'Block B', 'Block C'];

export const floorOptions = ['Ground Floor', '1st Floor', '2nd Floor'];

export const roomChoices = [
  'A-104 · 1 bed free', 'A-207 · 1 bed free', 'A-214 · 1 bed free', 'C-118 · 2 beds free',
];

export const bedChoices = ['Auto-assign next free bed', 'B1', 'B2', 'B3', 'B4'];

export const changeReasonOptions = [
  'Guardian request', 'Medical grounds', 'Room maintenance', 'Occupancy rebalancing', 'Disciplinary',
];

export const bedReasonOptions = ['Student request', 'Medical grounds', 'Bed repair', 'Warden decision'];

export const transferTargets = [
  'Everest Hostel · Boys · 16 beds free',
  'Nightingale Annexe · Girls · 6 beds free',
];

export const transferRoomOptions = ['Auto-assign on arrival', 'D-102 · 2 beds free', 'D-108 · 1 bed free'];

export const transferReasonOptions = [
  'Guardian request', 'Capacity rebalancing', 'Block under renovation', 'Medical grounds',
];

export const vacateReasonOptions = [
  'Fee overdue — privileges withdrawn', 'Moved to day scholar', 'Student withdrawn from school',
  'End of academic year', 'Disciplinary action',
];

export const roomConditionOptions = ['Good', 'Minor wear', 'Damage — fine to be raised'];

export const releaseBedOptions = ['Waiting list · next in queue', 'Hold for 30 days', 'Keep vacant'];

/* ------------------------------- Derivations -------------------------------- */

/** The template's em dash, used wherever a row has no room or bed yet. */
export const DASH = '—';

export const isWaiting = (row: Allocation): boolean => row.status === 'Waiting List';

export const hostelLabelOf = (row: Allocation): string => {
  const info = hostelInfoOf(row.hostel);
  return info ? info.full : 'Not assigned';
};

export const hostelTintOf = (row: Allocation): string => hostelInfoOf(row.hostel)?.tint ?? 'secondary';

export const hostelGenderOf = (row: Allocation): string =>
  hostelInfoOf(row.hostel) ? `${hostelInfoOf(row.hostel)!.gender} Hostel` : 'Not assigned';

export const wardenOf = (row: Allocation): string => hostelInfoOf(row.hostel)?.warden ?? DASH;

export const wardenContactOf = (row: Allocation): string =>
  hostelInfoOf(row.hostel)?.wardenContact ?? DASH;

export const blockFloorOf = (row: Allocation): string =>
  row.block ? `${row.block} · ${row.floor}` : DASH;

export const bedsFreeOf = (row: Allocation): number => Math.max(0, row.capacity - row.occupied);

export const occupancyOf = (row: Allocation): string => `${row.occupied} of ${row.capacity}`;

/** The View dialog's sub-line, under the allocation id. */
export const summaryOf = (row: Allocation): string =>
  row.room
    ? `${hostelLabelOf(row)}  •  ${row.room} · bed ${row.bed}  •  ${row.academicYear}`
    : `${hostelLabelOf(row)}  •  awaiting a bed  •  ${row.academicYear}`;

/** "II B · Roll 35204 · AD9892431" — the student line the dialogs print. */
export const studentLineOf = (row: Allocation): string =>
  `${row.classSection} · Roll ${row.roll} · ${row.admission}`;

/** "Nightingale · A-104 · bed B2" — the compact placement line. */
export const placementOf = (row: Allocation): string =>
  row.room ? `${row.hostel} · ${row.room} · bed ${row.bed}` : `${row.hostel || 'Unassigned'} · awaiting a bed`;

/** The Student Profile section, which is the same five labels on every row. */
export const profilePairsOf = (row: Allocation): Pair[] => [
  { label: 'Roll No', value: row.roll },
  { label: 'Class & Section', value: row.classSection },
  { label: 'Admission No', value: row.admission },
  { label: 'Blood Group', value: row.bloodGroup },
  { label: 'Home Town', value: row.homeTown },
];

/** The Guardian Information section, likewise. */
export const guardianPairsOf = (row: Allocation): Pair[] => [
  { label: 'Guardian', value: row.guardian },
  { label: 'Relation', value: row.relation },
  { label: 'Mobile', value: row.mobile },
  { label: 'Email', value: row.email },
  { label: 'Emergency', value: row.emergency },
];

export interface BedSlot {
  label: string;
  occupant: string;
  /** The row's own student, highlighted in the template's bed grid. */
  self: boolean;
}

/**
 * The bed grid the Change Bed dialog and the offcanvas draw. Beds come from the
 * room's capacity; the occupants come from the roommate list, which names the
 * bed each one is in ("III A · bed B1"), and the row's own bed is marked.
 */
export const bedsOf = (row: Allocation): BedSlot[] => {
  const byBed = new Map<string, string>();
  row.roommates.forEach((mate) => {
    const match = /bed\s+(B\d+)/i.exec(mate.detail);
    if (match) byBed.set(match[1].toUpperCase(), mate.name);
  });

  return Array.from({ length: row.capacity }, (_, index) => {
    const label = `B${index + 1}`;
    const self = label === row.bed;
    return { label, occupant: self ? row.student : byBed.get(label) ?? 'Vacant', self };
  });
};

/** The Change Bed dialog offers the other beds, naming who would be swapped. */
export const swapChoicesOf = (row: Allocation): string[] =>
  bedsOf(row)
    .filter((slot) => !slot.self)
    .map((slot) => (slot.occupant === 'Vacant' ? `${slot.label} · free` : `${slot.label} · swap with ${slot.occupant}`));

export const money = (value: number): string => `$${value.toLocaleString('en-US')}`;

/* --------------------------------- Sorting ---------------------------------- */

export const searchIndexOf = (row: Allocation): string =>
  [
    row.id, row.student, row.admission, row.classSection, `roll ${row.roll}`,
    hostelLabelOf(row), row.block, row.floor, row.room, row.bed, row.roomType,
    row.status, row.academicYear, row.guardian,
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Sortable key for the template's "01 Jun 2026" dates; blank sorts last. */
export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return Number.MAX_SAFE_INTEGER;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** The Bed Availability filter, as the four bands the template names. */
export const bedBandOf = (row: Allocation): string => {
  if (!row.room) return 'Room vacant';
  const free = bedsFreeOf(row);
  if (free === 0) return 'Room full';
  if (free === 1) return '1 bed free';
  return '2 or more free';
};

/** The Hostel Fee filter reads the fee section the panel prints. */
export const feeBandOf = (row: Allocation): string => {
  const text = row.feePairs.map((pair) => pair.value).join(' ').toLowerCase();
  if (text.includes('concession')) return 'Concession applied';
  if (text.includes('not billed')) return 'Not billed';
  if (text.includes('unpaid')) return 'Overdue';
  if (text.includes('due')) return 'Partially paid';
  return 'Paid in full';
};

/** "Block A · 1st Floor", the shape the Block / Floor filter names. */
export const blockFloorKeyOf = (row: Allocation): string =>
  row.block ? `${row.block} · ${row.floor.replace(' Floor', '') === 'Ground' ? 'Ground' : row.floor}` : '';

/* --------------------------------- Summary ---------------------------------- */

/**
 * The summary strip counts the whole register, not the eight rows on this page —
 * the footer says "1–8 of 42" and the saved views count 268 — so the template's
 * own figures are kept, with the waiting-list tile the one the roster can move.
 */
export const SUMMARY_TOTALS = {
  allocations: 268,
  hostels: 2,
  occupiedRooms: 84,
  totalRooms: 96,
  availableBeds: 34,
  vacantRooms: 12,
  underMaintenance: 4,
  waiting: 9,
};

/* ---------------------------------- Rows ------------------------------------ */

export const allocations: Allocation[] = [
  {
    id: 'ALC-2026-0118', student: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg',
    classSection: 'II B', roll: '35204', admission: 'AD9892431',
    hostel: 'Nightingale', block: 'Block A', floor: '1st Floor', room: 'A-104', bed: 'B2',
    roomType: 'Four Sharing', checkIn: '01 Jun 2026', academicYear: '2026 / 2027', status: 'Allocated',
    bloodGroup: 'AB+', homeTown: 'Hillside',
    guardian: 'Janet Gourley', relation: 'Mother', mobile: '+1 546 8548 894',
    email: 'janet.g@example.com', emergency: '+1 546 8548 889',
    capacity: 4, occupied: 4,
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Warden', value: 'Mrs. Alice Ray' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'A-104' },
      { label: 'Bed No', value: 'B2' },
      { label: 'Room Type', value: 'Four Sharing' },
      { label: 'Floor', value: '1st Floor · Block A' },
      { label: 'Occupancy', value: '4 of 4' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$2,100' },
      { label: 'Term I', value: '$1,050 · refunded' },
      { label: 'Term II', value: '$1,050 · due 05 Aug' },
      { label: 'Invoice', value: 'INV-2026-0429' },
    ],
    roommates: [
      { name: 'Emily Clark', detail: 'III A · bed B1' },
      { name: 'Sophia Miller', detail: 'II A · bed B3' },
      { name: 'Grace Hall', detail: 'II B · bed B4' },
    ],
    history: [
      { title: 'Allocated to A-104 · bed B2', meta: '01 Jun 2026 · Warden' },
      { title: 'Room damage fine raised', meta: '26 Jul 2026 · FN-2026-0225' },
    ],
    notes: 'Duplicate Term I payment refunded via REF-2026-0042. Room damage fine of $120 still open.',
    annualFee: 2100, invoice: 'INV-2026-0429',
    invoiceNote: 'Term I refunded · Term II $1,050 due 05 Aug 2026',
    checkOut: 'Not scheduled', nights: 60,
  },
  {
    id: 'ALC-2026-0121', student: 'Julie Scott', avatar: 'assets/img/students/student-06.jpg',
    classSection: 'VI A', roll: '35606', admission: 'AD9892429',
    hostel: 'Nightingale', block: 'Block B', floor: '2nd Floor', room: 'B-208', bed: 'B1',
    roomType: 'Double Sharing', checkIn: '01 Jun 2026', academicYear: '2026 / 2027', status: 'Allocated',
    bloodGroup: 'B-', homeTown: 'Market Town',
    guardian: 'Andrew Scott', relation: 'Father', mobile: '+1 546 8548 896',
    email: 'andrew.s@example.com', emergency: '+1 546 8548 885',
    capacity: 2, occupied: 2,
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Warden', value: 'Mrs. Alice Ray' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'B-208' },
      { label: 'Bed No', value: 'B1' },
      { label: 'Room Type', value: 'Double Sharing' },
      { label: 'Floor', value: '2nd Floor · Block B' },
      { label: 'Occupancy', value: '2 of 2' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$2,600' },
      { label: 'Term I', value: '$1,300 · paid' },
      { label: 'Term II', value: '$1,300 · due 05 Aug' },
      { label: 'Invoice', value: 'INV-2026-0466' },
    ],
    roommates: [{ name: 'Nina Patel', detail: 'VI B · bed B2' }],
    history: [{ title: 'Allocated to B-208 · bed B1', meta: '01 Jun 2026 · Warden' }],
    notes: 'Senior wing allocation. Requested a quieter room near the study hall and was accommodated.',
    annualFee: 2600, invoice: 'INV-2026-0466',
    invoiceNote: 'Term I paid · Term II $1,300 due 05 Aug 2026',
    checkOut: 'Not scheduled', nights: 60,
  },
  {
    id: 'ALC-2026-0125', student: 'Richard Soley', avatar: 'assets/img/students/student-08.jpg',
    classSection: 'V B', roll: '35508', admission: 'AD9892427',
    hostel: 'Everest', block: 'Block C', floor: 'Ground Floor', room: 'C-012', bed: 'B3',
    roomType: 'Triple Sharing', checkIn: '01 Jun 2026', academicYear: '2026 / 2027', status: 'Fee Hold',
    bloodGroup: 'O+', homeTown: 'Fern Hill',
    guardian: 'Helen Soley', relation: 'Mother', mobile: '+1 546 8548 898',
    email: 'helen.s@example.com', emergency: '+1 546 8548 881',
    capacity: 3, occupied: 3,
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Warden', value: 'Mr. David Kim' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'C-012' },
      { label: 'Bed No', value: 'B3' },
      { label: 'Room Type', value: 'Triple Sharing' },
      { label: 'Floor', value: 'Ground · Block C' },
      { label: 'Occupancy', value: '3 of 3' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$1,800' },
      { label: 'Term I', value: '$900 · unpaid' },
      { label: 'Term II', value: '$900 · unpaid' },
      { label: 'Invoice', value: 'INV-2026-0474' },
    ],
    roommates: [
      { name: 'Jacob Ryan', detail: 'V A · bed B1' },
      { name: 'Aaron Blake', detail: 'V B · bed B2' },
    ],
    history: [
      { title: 'Allocated to C-012 · bed B3', meta: '01 Jun 2026 · Warden' },
      { title: 'Placed on fee hold', meta: '26 Jul 2026 · Accounts' },
    ],
    notes: 'Hostel privileges on hold pending clearance of $1,800. Bed retained for 30 days before release.',
    annualFee: 1800, invoice: 'INV-2026-0474',
    invoiceNote: 'Term I and Term II unpaid · $1,800 outstanding',
    checkOut: 'Not scheduled', nights: 60,
  },
  {
    id: 'ALC-2026-0131', student: 'Ralph Claudia', avatar: 'assets/img/students/student-05.jpg',
    classSection: 'V A', roll: '35505', admission: 'AD9892430',
    hostel: 'Everest', block: 'Block A', floor: '2nd Floor', room: 'A-214', bed: 'B1',
    roomType: 'Double Sharing', checkIn: '', academicYear: '2026 / 2027', status: 'Pending Approval',
    bloodGroup: 'O-', homeTown: 'Central Square',
    guardian: 'Claudia Ralph', relation: 'Mother', mobile: '+1 546 8548 895',
    email: 'claudia.r@example.com', emergency: '+1 546 8548 887',
    capacity: 2, occupied: 1,
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Warden', value: 'Mr. David Kim' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'A-214 · reserved' },
      { label: 'Bed No', value: 'B1 · held' },
      { label: 'Room Type', value: 'Double Sharing' },
      { label: 'Floor', value: '2nd Floor · Block A' },
      { label: 'Occupancy', value: '1 of 2' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$2,600' },
      { label: 'Term I', value: 'Not billed' },
      { label: 'Term II', value: 'Not billed' },
      { label: 'Invoice', value: 'Raised on approval' },
    ],
    roommates: [{ name: 'Owen Fisher', detail: 'V A · bed B2' }],
    history: [
      { title: 'Application submitted', meta: '28 Jul 2026 · Parent portal' },
      { title: 'Bed A-214 / B1 held pending approval', meta: '29 Jul 2026 · Warden' },
    ],
    notes: 'Bed held for 7 days. Approve before 05 Aug or the hold is released to the waiting list.',
    annualFee: 2600, invoice: 'Raised on approval',
    invoiceNote: 'Not billed · invoice raised on approval',
    checkOut: 'Not scheduled', nights: 0,
  },
  {
    id: 'ALC-2026-0134', student: 'Joann Michael', avatar: 'assets/img/students/student-02.jpg',
    classSection: 'IV B', roll: '35102', admission: 'AD9892433',
    hostel: 'Everest', block: 'Block B', floor: '1st Floor', room: 'B-118', bed: 'B4',
    roomType: 'Four Sharing', checkIn: '15 Jun 2026', academicYear: '2026 / 2027',
    status: 'Transfer Requested',
    bloodGroup: 'B+', homeTown: 'Lakeview',
    guardian: 'Peter Michael', relation: 'Father', mobile: '+1 546 8548 892',
    email: 'peter.m@example.com', emergency: '+1 546 8548 883',
    capacity: 4, occupied: 4,
    hostelPairs: [
      { label: 'Hostel', value: 'Everest Hostel' },
      { label: 'Type', value: 'Boys' },
      { label: 'Warden', value: 'Mr. David Kim' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'B-118' },
      { label: 'Bed No', value: 'B4' },
      { label: 'Room Type', value: 'Four Sharing' },
      { label: 'Floor', value: '1st Floor · Block B' },
      { label: 'Occupancy', value: '4 of 4' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$2,100' },
      { label: 'Term I', value: '$1,050 · paid' },
      { label: 'Term II', value: '$1,050 · due 05 Aug' },
      { label: 'Invoice', value: 'INV-2026-0481' },
    ],
    roommates: [
      { name: 'Mark Levine', detail: 'IV A · bed B1' },
      { name: 'Tom Harper', detail: 'IV B · bed B2' },
      { name: 'Ryan Cole', detail: 'IV A · bed B3' },
    ],
    history: [
      { title: 'Allocated to B-118 · bed B4', meta: '15 Jun 2026 · Warden' },
      { title: 'Transfer to Block A requested', meta: '30 Jul 2026 · guardian request' },
    ],
    notes: 'Requested a move to Block A to be nearer the science wing. One bed free in A-207.',
    annualFee: 2100, invoice: 'INV-2026-0481',
    invoiceNote: 'Term I paid · Term II $1,050 due 05 Aug 2026',
    checkOut: 'Not scheduled', nights: 46,
  },
  {
    id: 'ALC-2026-0108', student: 'Susan Boswell', avatar: 'assets/img/students/student-07.jpg',
    classSection: 'IV A', roll: '35407', admission: 'AD9892428',
    hostel: 'Nightingale', block: 'Block A', floor: 'Ground Floor', room: 'A-006', bed: 'B2',
    roomType: 'Triple Sharing', checkIn: '01 Jun 2026', academicYear: '2026 / 2027',
    status: 'Checked Out',
    bloodGroup: 'A-', homeTown: 'Old Mill',
    guardian: 'Mark Boswell', relation: 'Father', mobile: '+1 546 8548 897',
    email: 'mark.b@example.com', emergency: '+1 546 8548 882',
    capacity: 3, occupied: 2,
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Warden', value: 'Mrs. Alice Ray' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'A-006 · released' },
      { label: 'Bed No', value: 'B2 · vacant' },
      { label: 'Room Type', value: 'Triple Sharing' },
      { label: 'Floor', value: 'Ground · Block A' },
      { label: 'Occupancy', value: '2 of 3' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$1,800' },
      { label: 'Term I', value: '$900 · paid' },
      { label: 'Term II', value: 'Not applicable' },
      { label: 'Refund Due', value: '$900 pro-rata' },
    ],
    roommates: [
      { name: 'Rita Owen', detail: 'IV A · bed B1' },
      { name: 'Carla Reed', detail: 'IV B · bed B3' },
    ],
    history: [
      { title: 'Allocated to A-006 · bed B2', meta: '01 Jun 2026 · Warden' },
      { title: 'Checked out — day scholar', meta: '28 Jul 2026 · Warden' },
    ],
    notes: 'Moved to day scholar from Term II. Pro-rata hostel refund to be raised with accounts.',
    annualFee: 1800, invoice: 'Refund pending',
    invoiceNote: 'Term I paid · $900 pro-rata refund due',
    checkOut: '28 Jul 2026', nights: 57,
  },
  {
    id: 'ALC-2026-0136', student: 'Kathleen Dison', avatar: 'assets/img/students/student-03.jpg',
    classSection: 'III A', roll: '35013', admission: 'AD9892432',
    hostel: '', block: '', floor: '', room: '', bed: '',
    roomType: 'Four Sharing', checkIn: '', academicYear: '2026 / 2027', status: 'Waiting List',
    bloodGroup: 'A+', homeTown: 'Riverside',
    guardian: 'Robert Dison', relation: 'Father', mobile: '+1 546 8548 893',
    email: 'robert.d@example.com', emergency: '+1 546 8548 884',
    capacity: 0, occupied: 0,
    hostelPairs: [
      { label: 'Preferred Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Warden', value: 'Mrs. Alice Ray' },
      { label: 'Queue Position', value: '2 of 9' },
      { label: 'Requested On', value: '26 Jul 2026' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'Not assigned' },
      { label: 'Bed No', value: 'Not assigned' },
      { label: 'Preferred Type', value: 'Four Sharing' },
      { label: 'Floor Preference', value: 'Ground or 1st' },
      { label: 'Beds Free', value: '0 in preferred type' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$2,100 · estimated' },
      { label: 'Concession', value: 'Need-based · under review' },
      { label: 'Term I', value: 'Not billed' },
      { label: 'Invoice', value: 'Raised on allocation' },
    ],
    roommates: [],
    roommatesEmpty: 'No roommates yet — awaiting a bed.',
    history: [
      { title: 'Added to waiting list', meta: '26 Jul 2026 · Warden' },
      { title: 'Moved to position 2', meta: '30 Jul 2026 · System' },
    ],
    notes: 'Need-based concession under review with accounts. Next four-sharing bed frees on 05 Aug.',
    annualFee: 2100, invoice: 'Raised on allocation',
    invoiceNote: 'Estimated $2,100 · concession under review',
    checkOut: 'Not scheduled', nights: 0,
  },
  {
    id: 'ALC-2026-0112', student: 'Janet Daniel', avatar: 'assets/img/students/student-01.jpg',
    classSection: 'III A', roll: '35011', admission: 'AD9892434',
    hostel: 'Nightingale', block: 'Block C', floor: '1st Floor', room: 'C-115', bed: 'B1',
    roomType: 'Single Room', checkIn: '01 Jun 2026', academicYear: '2026 / 2027', status: 'Allocated',
    bloodGroup: 'O+', homeTown: 'Green Park',
    guardian: 'Thomas Daniel', relation: 'Father', mobile: '+1 546 8548 891',
    email: 'thomas.d@example.com', emergency: '+1 546 8548 890',
    capacity: 1, occupied: 1,
    hostelPairs: [
      { label: 'Hostel', value: 'Nightingale Hostel' },
      { label: 'Type', value: 'Girls' },
      { label: 'Warden', value: 'Mrs. Alice Ray' },
      { label: 'Total Rooms', value: '48' },
      { label: 'Mess', value: 'Vegetarian & regular' },
    ],
    roomPairs: [
      { label: 'Room No', value: 'C-115' },
      { label: 'Bed No', value: 'B1' },
      { label: 'Room Type', value: 'Single Room' },
      { label: 'Floor', value: '1st Floor · Block C' },
      { label: 'Occupancy', value: '1 of 1' },
    ],
    feePairs: [
      { label: 'Annual Hostel Fee', value: '$3,400' },
      { label: 'Term I', value: '$1,700 · paid' },
      { label: 'Term II', value: '$1,700 · due 05 Aug' },
      { label: 'Invoice', value: 'INV-2026-0455' },
    ],
    roommates: [],
    roommatesEmpty: 'Single occupancy — no roommates.',
    history: [
      { title: 'Allocated to C-115 · bed B1', meta: '01 Jun 2026 · Warden' },
      { title: 'Medical single-room approval', meta: '01 Jun 2026 · School Nurse' },
    ],
    notes: 'Single room approved on medical grounds. Review the arrangement at the start of each session.',
    annualFee: 3400, invoice: 'INV-2026-0455',
    invoiceNote: 'Term I paid · Term II $1,700 due 05 Aug 2026',
    checkOut: 'Not scheduled', nights: 60,
  },
];
