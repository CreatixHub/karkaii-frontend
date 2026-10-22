export type EntryStatus =
  | 'Inside Campus' | 'Exited' | 'Overstayed' | 'Pending Verification' | 'Access Denied';

export type PassStatus = 'Active' | 'Returned' | 'Expired' | 'Not Issued';

export type PersonType = 'Visitor' | 'Student' | 'Staff' | 'Guardian' | 'Vendor' | 'Contractor';

export type EntryType =
  | 'Visitor Entry' | 'Student Exit' | 'Staff Entry' | 'Vehicle Entry' | 'Delivery';

export type CheckState = 'Verified' | 'Cleared' | 'Pending' | 'Failed';

export interface SecurityCheck {
  label: string;
  state: CheckState;
}

export interface EntryDocument {
  name: string;
  meta: string;
}

export interface Vehicle {
  type: string;
  registration: string;
  details: string;
  parking: string;
}

/** A previous visit by the same person, shown in the panel. */
export interface PastVisit {
  date: string;
  checkIn: string;
  checkOut: string;
  gate: string;
}

export interface GateEntry {
  id: string;
  name: string;
  /** Tabler icon for the name cell, or an avatar when the person has a photo. */
  icon: string;
  tint: string;
  avatar?: string;
  /** "ViewPro Systems Ltd · TECH-VP-078". */
  reference: string;
  contact: string;
  personType: PersonType;
  entryType: EntryType;

  gate: string;
  /** "Reception desk · Lane 1". */
  lane: string;
  /** Empty until the person actually arrives. */
  checkIn: string;
  /** Empty until they leave. */
  checkOut: string;
  /** The date the entry belongs to. */
  date: string;

  purpose: string;
  /** "SRV-2026-0424 · Room 204". */
  purposeDetail: string;

  idProof: string;
  idNumber: string;

  host: string;
  hostContact: string;
  hostLocation: string;
  hostConfirmation: string;

  vehicle: Vehicle | null;

  /** Empty when no pass was issued — staff scans and refusals. */
  passNumber: string;
  validFrom: string;
  validUntil: string;
  escort: string;

  /** Set when the gate turned the person away; it outranks the times. */
  denied: boolean;
  /** "Attempt 14:05" — when they were stopped. */
  deniedAt: string;
  /** Expected arrival on a pre-registered entry. */
  expected: string;

  checks: SecurityCheck[];
  documents: EntryDocument[];
  notes: string;
  pastVisits: PastVisit[];
  /** The officers named on the audit trail. */
  openedBy: string;
  closedBy: string;
  camera: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const personBadge: Record<PersonType, string> = {
  Visitor: 'badge badge-soft-primary',
  Student: 'badge badge-soft-info',
  Staff: 'badge badge-soft-success',
  Guardian: 'badge badge-soft-warning',
  Vendor: 'badge badge-soft-purple',
  Contractor: 'badge badge-soft-secondary',
};

export const entryBadge: Record<EntryType, string> = {
  'Visitor Entry': 'badge badge-soft-primary',
  'Student Exit': 'badge badge-soft-info',
  'Staff Entry': 'badge badge-soft-success',
  'Vehicle Entry': 'badge badge-soft-warning',
  Delivery: 'badge badge-soft-secondary',
};

export const passBadge: Record<PassStatus, string> = {
  Active: 'badge badge-soft-success',
  Returned: 'badge badge-soft-secondary',
  Expired: 'badge badge-soft-danger',
  'Not Issued': 'badge badge-soft-warning',
};

export const statusPill: Record<EntryStatus, string> = {
  'Inside Campus': 'is-active',
  Exited: 'is-completed',
  Overstayed: 'is-blocked',
  'Pending Verification': 'is-pending',
  'Access Denied': 'is-suspended',
};

export const statusBadge: Record<EntryStatus, string> = {
  'Inside Campus': 'badge badge-soft-success',
  Exited: 'badge badge-soft-secondary',
  Overstayed: 'badge badge-soft-danger',
  'Pending Verification': 'badge badge-soft-warning',
  'Access Denied': 'badge badge-soft-dark',
};

export const checkBadge: Record<CheckState, string> = {
  Verified: 'badge badge-soft-success',
  Cleared: 'badge badge-soft-info',
  Pending: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
};

export const checkIcon: Record<CheckState, string> = {
  Verified: 'ti ti-circle-check',
  Cleared: 'ti ti-shield-check',
  Pending: 'ti ti-clock',
  Failed: 'ti ti-circle-x',
};

/* ------------------------------ Filter options ------------------------------ */

export const entryTypeOptions: EntryType[] = [
  'Visitor Entry', 'Student Exit', 'Staff Entry', 'Vehicle Entry', 'Delivery',
];

export const personTypeOptions: PersonType[] = [
  'Visitor', 'Student', 'Staff', 'Guardian', 'Vendor', 'Contractor',
];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const statusOptions: EntryStatus[] = [
  'Inside Campus', 'Exited', 'Overstayed', 'Pending Verification', 'Access Denied',
];

export const passStatusOptions: PassStatus[] = ['Active', 'Returned', 'Expired', 'Not Issued'];

export const vehicleOptions = [
  'With vehicle', 'On foot', 'Delivery vehicle', 'Staff vehicle',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const whoOptions = ['Visitor', 'Student', 'Staff', 'Vendor'];

export const idProofOptions = [
  'National ID', 'Driving Licence', 'Company ID', 'Staff ID Card', 'Student ID', 'Passport',
];

export const hostOptions = [
  'Estates Office', 'Admission Office', 'Administration', 'Class Teacher · II B',
  'Cafeteria Department', 'Hostel Office', 'Store Office',
];

export const vehicleTypeOptions = [
  'None · on foot', 'Private Car', 'Two Wheeler', 'Delivery Van', 'Staff Car',
];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const validityOptions = ['1 hour', '2 hours', '4 hours', 'Full day'];

export const escortOptions = ['Escort required', 'Escort not required'];

export const verificationOptions = ['ID Proof', 'QR Code', 'Biometric'];

export const returnOptions = ['Returned', 'Lost', 'Damaged'];

export const overstayReasonOptions = [
  'Host meeting ran late', 'Waiting for the host', 'Pass return not scanned', 'Under review',
];

export const passTypeOptions = ['Visitor', 'Student', 'Vehicle', 'Temporary'];

export const approverOptions = ['Class Teacher', 'Principal', 'Hostel Warden', 'Estates Manager'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

/** The clock the register was captured at. */
export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

/** "09:10" → minutes past midnight, so two times can be subtracted. */
export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 205 → "3h 25m"; under an hour drops the hours. */
export const durationLabel = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return hours === 0 ? `${mins}m` : `${hours}h ${String(mins).padStart(2, '0')}m`;
};

/** Adds minutes to one of the template's times. */
export const addMinutes = (time: string, minutes: number): string => {
  const total = (minutesOf(time) + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** Check-in to check-out, or to now while the person is still inside. */
export const onSiteOf = (row: GateEntry): number => {
  if (!row.checkIn) return 0;
  return Math.max(0, minutesOf(row.checkOut || REGISTER_TIME) - minutesOf(row.checkIn));
};

/** How far past the pass window an entry has run; zero once it is closed. */
export const overstayOf = (row: GateEntry): number => {
  if (row.checkOut || !row.checkIn || !row.validUntil) return 0;
  return Math.max(0, minutesOf(REGISTER_TIME) - minutesOf(row.validUntil));
};

/**
 * The pill the Security Status column prints. A refusal outranks the clock — the
 * turned-away vehicle never entered, so it is Access Denied, not Pending.
 */
export const statusOf = (row: GateEntry): EntryStatus => {
  if (row.denied) return 'Access Denied';
  if (!row.checkIn) return 'Pending Verification';
  if (row.checkOut) return 'Exited';
  return overstayOf(row) > 0 ? 'Overstayed' : 'Inside Campus';
};

/** The pass follows the same four facts. */
export const passStatusOf = (row: GateEntry): PassStatus => {
  if (!row.passNumber) return 'Not Issued';
  if (row.checkOut) return 'Returned';
  return overstayOf(row) > 0 ? 'Expired' : 'Active';
};

/** The line under the Check-Out column. */
export const movementLabelOf = (row: GateEntry): string => {
  if (row.denied) return `Attempt ${row.deniedAt}`;
  if (!row.checkIn) return row.expected ? `Due ${row.expected}` : 'Not arrived';
  const overstay = overstayOf(row);
  if (overstay > 0) return `Over by ${durationLabel(overstay)}`;
  return `On site ${durationLabel(onSiteOf(row))}`;
};

export const movementTintOf = (row: GateEntry): string => {
  if (row.denied) return 'text-danger';
  if (!row.checkIn) return 'text-muted';
  if (overstayOf(row) > 0) return 'text-danger';
  return row.checkOut ? 'text-success' : 'text-warning';
};

/** What the Check-Out cell itself shows. */
export const checkOutLabelOf = (row: GateEntry): string => {
  if (row.denied || !row.checkIn) return DASH;
  return row.checkOut || 'Still inside';
};

export const checkInLabelOf = (row: GateEntry): string => {
  if (row.denied) return 'Not admitted';
  return row.checkIn || 'Not arrived';
};

/** "VP-2026-0841 · 09:10 – 13:10", or what stands in for it. */
export const passLineOf = (row: GateEntry): string => {
  if (row.denied) return 'Entry refused';
  if (!row.passNumber) {
    if (row.personType === 'Staff') return 'Staff ID card scanned';
    return 'Issued on arrival';
  }
  return `${row.passNumber} · ${row.validFrom} – ${row.validUntil}`;
};

export const onSiteLabelOf = (row: GateEntry): string =>
  row.checkIn ? durationLabel(onSiteOf(row)) : DASH;

export interface Pair {
  label: string;
  value: string;
}

export const personPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Entry ID', value: row.id },
  { label: 'Person Type', value: row.personType },
  { label: 'Reference', value: row.reference },
  { label: 'Contact', value: row.contact },
  { label: 'Gate', value: row.gate },
];

export const visitorPairsOf = (row: GateEntry): Pair[] => [
  { label: 'ID Proof', value: row.idProof },
  { label: 'ID Number', value: row.idNumber },
  { label: 'Entry Type', value: row.entryType },
  { label: 'Purpose', value: row.purpose },
  { label: 'Detail', value: row.purposeDetail },
];

export const hostPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Host', value: row.host },
  { label: 'Contact Person', value: row.hostContact },
  { label: 'Gate Lane', value: row.lane },
  { label: 'Check-In', value: checkInLabelOf(row) },
  { label: 'Check-Out', value: row.checkOut || 'Not recorded' },
];

export const vehiclePairsOf = (row: GateEntry): Pair[] =>
  row.vehicle
    ? [
      { label: 'Vehicle Type', value: row.vehicle.type },
      { label: 'Registration', value: row.vehicle.registration },
      { label: 'Details', value: row.vehicle.details },
      { label: 'Barrier', value: row.lane },
      { label: 'Parking', value: row.vehicle.parking },
    ]
    : [];

export const passPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Pass Number', value: row.passNumber || 'Not issued' },
  { label: 'Valid From', value: row.validFrom || DASH },
  { label: 'Valid Until', value: row.validUntil || DASH },
  { label: 'Pass Status', value: passStatusOf(row) },
  { label: 'Escort', value: row.escort },
];

/** The View dialog's visit block. */
export const visitPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Entry Type', value: row.entryType },
  { label: 'Gate', value: `${row.gate} · ${row.lane.split('·').pop()?.trim()}` },
  { label: 'Purpose', value: row.purposeDetail.split('·')[0].trim() || row.purpose },
  { label: 'Vehicle', value: row.vehicle ? row.vehicle.type : 'On foot' },
];

export const viewHostPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Department', value: row.host },
  { label: 'Contact Person', value: row.hostContact.split('·')[0].trim() },
  { label: 'Location', value: row.hostLocation },
  { label: 'Confirmation', value: row.hostConfirmation },
];

/** The panel's own person block. */
export const panelPersonPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Organisation', value: row.reference.split('·')[0].trim() },
  { label: 'Reference', value: row.reference.split('·').pop()?.trim() ?? row.reference },
  { label: 'ID Proof', value: `${row.idProof} · ${row.idNumber}` },
  { label: 'Contact', value: row.contact },
];

export const panelVisitPairsOf = (row: GateEntry): Pair[] => [
  { label: 'Entry Type', value: row.entryType },
  { label: 'Purpose', value: row.purpose },
  { label: 'Reference', value: row.purposeDetail },
  { label: 'Gate', value: `${row.gate} · ${row.lane.split('·').pop()?.trim()}` },
];

/** The panel's verification card, read off the recorded checks. */
export const verificationPairsOf = (row: GateEntry): Pair[] => {
  const idCheck = row.checks.find((check) => /id|licence|photo/i.test(check.label));
  const screen = row.checks.find((check) => check.state === 'Cleared');
  return [
    { label: 'ID Check', value: idCheck ? (idCheck.state === 'Verified' ? 'Passed' : idCheck.state) : 'Not recorded' },
    { label: 'Bag Screen', value: screen ? screen.state : 'Not recorded' },
    { label: 'Escort', value: /not required|not admitted/i.test(row.escort) ? 'No' : 'Yes' },
  ];
};

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The entry-and-exit trail. Every line is dated off the four stored facts, so a
 * check-out or a pass extension redraws it rather than leaving a stale copy.
 */
export const timelineOf = (row: GateEntry): TimelineEntry[] => {
  if (row.denied) {
    return [
      { icon: 'ti ti-shield-x', tint: 'danger', title: 'Stopped at the barrier', meta: `${row.deniedAt} · ${row.gate}` },
      { icon: 'ti ti-shield-x', tint: 'danger', title: 'Entry refused by the gate officer', meta: `${row.deniedAt} · no host approval` },
      { icon: 'ti ti-shield-x', tint: 'danger', title: 'Denial report raised', meta: `${row.deniedAt} · security desk` },
    ];
  }
  if (!row.checkIn) {
    return [
      { icon: 'ti ti-calendar-event', tint: 'info', title: 'Pre registration accepted', meta: `${row.date} · ${row.host}` },
      { icon: 'ti ti-calendar-event', tint: 'primary', title: 'Arrival expected', meta: `${row.expected} · 09:00` },
    ];
  }
  const entries: TimelineEntry[] = [
    { icon: 'ti ti-door-enter', tint: 'success', title: 'Checked in at the gate', meta: `${row.checkIn} · ${row.gate}` },
  ];
  if (row.passNumber) {
    entries.push({
      icon: 'ti ti-id-badge-2', tint: 'primary',
      title: `Gate pass ${row.passNumber} issued`,
      meta: `${row.validFrom} · valid to ${row.validUntil}`,
    });
  }
  if (row.checkOut) {
    entries.push({
      icon: 'ti ti-door-exit', tint: 'info',
      title: 'Checked out at the gate',
      meta: `${row.checkOut} · on site ${durationLabel(onSiteOf(row))}`,
    });
    if (row.passNumber) {
      entries.push({
        icon: 'ti ti-check', tint: 'success',
        title: 'Gate pass returned', meta: `${row.checkOut} · ${row.gate}`,
      });
    }
  } else if (overstayOf(row) > 0) {
    entries.push({
      icon: 'ti ti-alert-triangle', tint: 'danger',
      title: 'Pass expired with no exit scan',
      meta: `${row.validUntil} · over by ${durationLabel(overstayOf(row))}`,
    });
  } else {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'On campus now',
      meta: `${REGISTER_TIME} · on site ${durationLabel(onSiteOf(row))}`,
    });
  }
  return entries;
};

/** The panel's audit trail, named from the officers on the entry. */
export const auditOf = (row: GateEntry): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-plus', tint: 'primary',
      title: row.denied ? 'Refusal recorded at the gate' : 'Entry created at the gate',
      meta: `${row.checkIn || row.deniedAt || row.date} · ${row.openedBy}`,
    },
  ];
  if (row.checkIn) {
    entries.push({
      icon: 'ti ti-edit', tint: 'info',
      title: 'Host confirmation recorded',
      meta: `${addMinutes(row.checkIn, 2)} · ${row.host}`,
    });
  }
  if (row.checkOut) {
    entries.push({
      icon: 'ti ti-checks', tint: 'success',
      title: row.passNumber ? 'Entry closed on pass return' : 'Entry closed at the turnstile',
      meta: `${row.checkOut} · ${row.closedBy}`,
    });
  }
  return entries;
};

/* --------------------------------- Filters ---------------------------------- */

export const vehicleBandOf = (row: GateEntry): string => {
  if (!row.vehicle) return 'On foot';
  if (/delivery/i.test(row.vehicle.type)) return 'Delivery vehicle';
  if (/staff/i.test(row.vehicle.type)) return 'Staff vehicle';
  return 'With vehicle';
};

/** "With vehicle" covers the delivery and staff bands too. */
export const matchesVehicle = (row: GateEntry, band: string): boolean => {
  if (band === 'With vehicle') return row.vehicle !== null;
  return vehicleBandOf(row) === band;
};

export const searchIndexOf = (row: GateEntry): string =>
  [
    row.id, row.name, row.reference, row.personType, row.entryType, row.gate, row.lane,
    row.purpose, row.purposeDetail, row.host, row.hostContact, row.passNumber,
    statusOf(row), passStatusOf(row),
  ]
    .join(' ')
    .toLowerCase();

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole day at every gate — 218 entries against the eight
 * this page lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  today: 218,
  visitorsInside: 34,
  visitorEntries: 62,
  studentMovements: 62,
  staffEntries: 94,
  vehicleEntries: 41,
  deliveries: 9,
};

export const VIEW_TOTALS = {
  all: 218,
  inside: 34,
  overstayed: 3,
  vehicles: 41,
  denied: 2,
};

export const QUICK_TOTALS = {
  all: 218,
  inside: 34,
  exited: 179,
  overstayed: 3,
  pending: 5,
  denied: 2,
};

/** The template's one committed chip — the date the register is showing. */
export const REGISTER_FROM = '31-07-2026';
export const REGISTER_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const entries: GateEntry[] = [
  {
    id: 'GT-2026-0841', name: 'Ms. Hannah Lee', icon: 'ti ti-tool', tint: 'secondary',
    reference: 'ViewPro Systems Ltd · TECH-VP-078', contact: '+1 55 2214 8890',
    personType: 'Contractor', entryType: 'Visitor Entry',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    checkIn: '09:10', checkOut: '12:35', date: '31 Jul 2026',
    purpose: 'Smart board calibration', purposeDetail: 'SRV-2026-0424 · Room 204',
    idProof: 'Company ID', idNumber: 'VP-078••••12',
    host: 'Estates Office', hostContact: 'Mr. Alan Pierce · Estates Manager',
    hostLocation: 'Main Block · Room 204', hostConfirmation: 'By phone',
    vehicle: null,
    passNumber: 'VP-2026-0841', validFrom: '09:10', validUntil: '13:10',
    escort: 'Escorted by the estates assistant to Room 204',
    denied: false, deniedAt: '', expected: '',
    checks: [
      { label: 'Photo ID checked against the vendor register', state: 'Verified' },
      { label: 'Host confirmed the appointment by phone', state: 'Verified' },
      { label: 'Bag and tool case screened at the desk', state: 'Cleared' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0841.pdf', meta: 'Issued 09:10 · returned 12:35 · 42 KB' },
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0424 · 74 KB' },
    ],
    notes: 'Regular vendor on the approved list. Signed the estates desk register on arrival and departure.',
    pastVisits: [
      { date: '28 Jan 2026', checkIn: '10:05', checkOut: '13:20', gate: 'Main Gate' },
      { date: '14 Sep 2024', checkIn: '09:40', checkOut: '16:15', gate: 'Main Gate' },
    ],
    openedBy: 'Mr. Samuel Roy · SEC-014', closedBy: 'Mr. Imran Qadir · SEC-022',
    camera: 'CAM-MG-02',
  },
  {
    id: 'GT-2026-0847', name: 'Mrs. Janet Gourley', icon: 'ti ti-users', tint: 'warning',
    reference: 'Guardian of Lisa Gourley · II B', contact: '+1 55 7712 4409',
    personType: 'Guardian', entryType: 'Visitor Entry',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    checkIn: '10:25', checkOut: '11:25', date: '31 Jul 2026',
    purpose: 'Guardian meeting', purposeDetail: 'Device loan return · early collection',
    idProof: 'Driving Licence', idNumber: 'DL-44••••71',
    host: 'Class Teacher · II B', hostContact: 'Mrs. Ellen Cruz · Room A-104',
    hostLocation: 'Main Block · Room A-104', hostConfirmation: 'In person',
    vehicle: {
      type: 'Private Car', registration: 'KA-05-MJ-2218',
      details: 'Silver hatchback · Visitor Bay 4', parking: 'Logged at entry',
    },
    passNumber: 'VP-2026-0847', validFrom: '10:25', validUntil: '12:25',
    escort: 'Escorted to Room A-104 and back to the gate',
    denied: false, deniedAt: '', expected: '',
    checks: [
      { label: 'Driving licence checked and photographed', state: 'Verified' },
      { label: 'Guardian relationship confirmed on the student record', state: 'Verified' },
      { label: 'Vehicle registration logged at the barrier', state: 'Cleared' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0847.pdf', meta: 'Issued 10:25 · returned 11:25 · 40 KB' },
      { name: 'Early Exit Authorisation.pdf', meta: 'Signed by the class teacher · 56 KB' },
    ],
    notes: 'Returned the loaned Chromebook to the library desk and collected Lisa Gourley on the same visit.',
    pastVisits: [
      { date: '15 Jun 2026', checkIn: '09:30', checkOut: '10:10', gate: 'Main Gate' },
    ],
    openedBy: 'Mr. Samuel Roy · SEC-014', closedBy: 'Mr. Samuel Roy · SEC-014',
    camera: 'CAM-MG-02',
  },
  {
    id: 'GT-2026-0852', name: 'Lisa Gourley', icon: 'ti ti-school', tint: 'info',
    avatar: 'assets/img/students/student-04.jpg',
    reference: 'II B · AD9892431', contact: '+1 55 7712 4409',
    personType: 'Student', entryType: 'Student Exit',
    gate: 'Main Gate', lane: 'Reception desk · Lane 2',
    checkIn: '07:45', checkOut: '11:20', date: '31 Jul 2026',
    purpose: 'Early exit', purposeDetail: 'Collected by the guardian',
    idProof: 'Student ID', idNumber: 'AD9892431',
    host: 'Class Teacher · II B', hostContact: 'Mrs. Ellen Cruz · Room A-104',
    hostLocation: 'Main Block · Room A-104', hostConfirmation: 'Exit slip signed',
    vehicle: {
      type: 'Private Car', registration: 'KA-05-MJ-2218',
      details: 'Guardian vehicle · Visitor Bay 4', parking: 'Logged at entry',
    },
    passNumber: 'SP-2026-0362', validFrom: '11:10', validUntil: '11:30',
    escort: 'Handed over to Mrs. Janet Gourley at the reception desk',
    denied: false, deniedAt: '', expected: '',
    checks: [
      { label: 'Exit slip signed by the class teacher', state: 'Verified' },
      { label: 'Guardian identity matched the student record', state: 'Verified' },
      { label: 'Handover recorded in the movement register', state: 'Cleared' },
    ],
    documents: [
      { name: 'Student Gate Pass SP-2026-0362.pdf', meta: 'Issued 11:10 · used 11:20 · 38 KB' },
      { name: 'Exit Slip.pdf', meta: 'Counter signed by the guardian · 34 KB' },
    ],
    notes: 'Morning attendance recorded at 07:45. Exit approved on the same day; return expected on 03 Aug.',
    pastVisits: [],
    openedBy: 'Ms. Fiona Marsh · SEC-031', closedBy: 'Mr. Samuel Roy · SEC-014',
    camera: 'CAM-MG-03',
  },
  {
    id: 'GT-2026-0859', name: 'Mr. Dinesh Varma', icon: 'ti ti-building-store', tint: 'purple',
    reference: 'FreshLine Foods · SUP-2023-008', contact: '+1 55 9925 4417',
    personType: 'Vendor', entryType: 'Delivery',
    gate: 'Service Gate', lane: 'Rear service road · Dock 2',
    checkIn: '14:15', checkOut: '', date: '31 Jul 2026',
    purpose: 'Kitchen delivery', purposeDetail: 'Weekly replenishment · Kitchen Store',
    idProof: 'Company ID', idNumber: 'FL-221••••08',
    host: 'Cafeteria Department', hostContact: 'Ms. Rosa Klein · Cafeteria Manager',
    hostLocation: 'Main Block · Kitchen', hostConfirmation: 'By phone',
    vehicle: {
      type: 'Delivery Van', registration: 'TN-09-DL-3312',
      details: 'Refrigerated van · Dock 2', parking: 'Logged at entry',
    },
    passNumber: 'VP-2026-0859', validFrom: '14:15', validUntil: '16:15',
    escort: 'Restricted to the service corridor and the dry store',
    denied: false, deniedAt: '', expected: '',
    checks: [
      { label: 'Delivery challan matched against the open order', state: 'Verified' },
      { label: 'Driver ID checked against the supplier register', state: 'Verified' },
      { label: 'Vehicle inspected at the service barrier', state: 'Cleared' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0859.pdf', meta: 'Issued 14:15 · active · 41 KB' },
      { name: 'Delivery Challan.pdf', meta: 'FreshLine Foods · 68 KB' },
    ],
    notes: 'Unloading at Dock 2. Goods inward note to be raised by the store office before the pass expires.',
    pastVisits: [
      { date: '24 Jul 2026', checkIn: '14:05', checkOut: '15:50', gate: 'Service Gate' },
      { date: '17 Jul 2026', checkIn: '14:20', checkOut: '16:00', gate: 'Service Gate' },
    ],
    openedBy: 'Mr. Imran Qadir · SEC-022', closedBy: '',
    camera: 'CAM-SG-01',
  },
  {
    id: 'GT-2026-0864', name: 'Mrs. Alice Ray', icon: 'ti ti-id-badge-2', tint: 'success',
    avatar: 'assets/img/teachers/teacher-01.jpg',
    reference: 'Chief Warden · EMP-2019-014', contact: '+1 55 4409 3312',
    personType: 'Staff', entryType: 'Staff Entry',
    gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    checkIn: '07:20', checkOut: '', date: '31 Jul 2026',
    purpose: 'Duty shift', purposeDetail: 'Morning shift · 07:30 to 16:30',
    idProof: 'Staff ID Card', idNumber: 'EMP-2019-014',
    host: 'Administration', hostContact: 'Own department · Admin Office',
    hostLocation: 'Main Block · Admin Office', hostConfirmation: 'Roster matched',
    vehicle: {
      type: 'Staff Car', registration: 'KL-07-AR-1902',
      details: 'White sedan · Staff Bay 11', parking: 'Logged at entry',
    },
    passNumber: '', validFrom: '', validUntil: '',
    escort: 'Not required · staff access',
    denied: false, deniedAt: '', expected: '',
    checks: [
      { label: 'Staff ID card scanned at the turnstile', state: 'Verified' },
      { label: 'Shift roster matched for 31 Jul 2026', state: 'Verified' },
      { label: 'Vehicle sticker read at the barrier', state: 'Cleared' },
    ],
    documents: [
      { name: 'Duty Roster July 2026.pdf', meta: 'Hostel administration · 92 KB' },
    ],
    notes: 'No visitor pass is issued for staff. The turnstile scan is the entry record of account.',
    pastVisits: [
      { date: '30 Jul 2026', checkIn: '07:18', checkOut: '16:40', gate: 'Main Gate' },
      { date: '29 Jul 2026', checkIn: '07:22', checkOut: '16:35', gate: 'Main Gate' },
    ],
    openedBy: 'Mr. Samuel Roy · SEC-014', closedBy: '',
    camera: 'CAM-MG-04',
  },
  {
    id: 'GT-2026-0871', name: 'Mr. Victor Hale', icon: 'ti ti-user', tint: 'primary',
    reference: 'Walk in · no prior appointment', contact: '+1 55 6620 1187',
    personType: 'Visitor', entryType: 'Visitor Entry',
    gate: 'North Gate', lane: 'North reception · Lane 1',
    checkIn: '13:15', checkOut: '', date: '31 Jul 2026',
    purpose: 'Admission enquiry', purposeDetail: 'Walk in · prospectus collection',
    idProof: 'National ID', idNumber: 'NID-77••••34',
    host: 'Admission Office', hostContact: 'Ms. Dana Ruiz · Admission Counsellor',
    hostLocation: 'North Block · Admission Office', hostConfirmation: 'Walk in slot',
    vehicle: null,
    passNumber: 'VP-2026-0871', validFrom: '13:15', validUntil: '14:15',
    escort: 'Directed to the admission office at the north block',
    denied: false, deniedAt: '', expected: '',
    checks: [
      { label: 'National ID checked and photographed', state: 'Verified' },
      { label: 'Admission office confirmed a walk in slot', state: 'Verified' },
      { label: 'Pass return not logged at either gate', state: 'Pending' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0871.pdf', meta: 'Issued 13:15 · expired 14:15 · 39 KB' },
    ],
    notes: 'One hour pass has run out with no exit scan. North gate asked to locate the visitor and recover the pass.',
    pastVisits: [],
    openedBy: 'Ms. Fiona Marsh · SEC-031', closedBy: '',
    camera: 'CAM-NG-01',
  },
  {
    id: 'GT-2026-0877', name: 'Ms. Nadia Fern', icon: 'ti ti-tool', tint: 'secondary',
    reference: 'Dell Technologies · TECH-DL-093', contact: '+1 55 8830 2145',
    personType: 'Contractor', entryType: 'Visitor Entry',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    checkIn: '', checkOut: '', date: '24 Jul 2026',
    purpose: 'Laptop battery service', purposeDetail: 'SRV-2026-0453 · Admin Office',
    idProof: 'Company ID', idNumber: 'DL-093••••27',
    host: 'Administration', hostContact: 'Mrs. Alice Ray · Chief Warden',
    hostLocation: 'Main Block · Admin Office', hostConfirmation: 'Pre registered',
    vehicle: null,
    passNumber: '', validFrom: '', validUntil: '',
    escort: 'To be escorted to the Admin Office on arrival',
    denied: false, deniedAt: '', expected: '12 Aug 2026',
    checks: [
      { label: 'Pre registered by the estates office', state: 'Verified' },
      { label: 'Photo ID to be checked on arrival', state: 'Pending' },
      { label: 'Host confirmation to be taken at the desk', state: 'Pending' },
    ],
    documents: [
      { name: 'Pre Registration Form.pdf', meta: 'Raised 24 Jul 2026 · 48 KB' },
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0453 · 71 KB' },
    ],
    notes: 'Pre registered against the 12 Aug service visit. No pass is issued until the visitor reports at the gate.',
    pastVisits: [
      { date: '12 Feb 2026', checkIn: '09:50', checkOut: '11:30', gate: 'Main Gate' },
    ],
    openedBy: 'Mr. Samuel Roy · SEC-014', closedBy: '',
    camera: 'CAM-MG-02',
  },
  {
    id: 'GT-2026-0883', name: 'Mr. Owen Blake', icon: 'ti ti-user', tint: 'primary',
    reference: 'Walk in · hostel block', contact: '+1 55 3341 7726',
    personType: 'Visitor', entryType: 'Vehicle Entry',
    gate: 'Hostel Gate', lane: 'Everest Hostel · Barrier 1',
    checkIn: '', checkOut: '', date: '31 Jul 2026',
    purpose: 'Unscheduled hostel visit', purposeDetail: 'Outside visiting hours · no host',
    idProof: 'National ID', idNumber: 'NID-31••••90',
    host: 'Not confirmed', hostContact: 'No warden approval on record',
    hostLocation: 'Everest Hostel', hostConfirmation: 'None',
    vehicle: {
      type: 'Private Car', registration: 'AP-16-OB-5590',
      details: 'Blue sedan · turned away at the barrier', parking: 'Logged at entry',
    },
    passNumber: '', validFrom: '', validUntil: '',
    escort: 'Not admitted · turned away at the barrier',
    denied: true, deniedAt: '14:05', expected: '',
    checks: [
      { label: 'Visit falls outside the hostel visiting window', state: 'Failed' },
      { label: 'No warden approval found on the visitor register', state: 'Failed' },
      { label: 'Details recorded and the vehicle turned away', state: 'Cleared' },
    ],
    documents: [
      { name: 'Access Denial Report.pdf', meta: 'Raised 14:05 · 52 KB' },
    ],
    notes: 'Hostel visiting hours are 16:00 to 18:00 with warden approval. Advised to book through the hostel office.',
    pastVisits: [],
    openedBy: 'Mr. Imran Qadir · SEC-022', closedBy: '',
    camera: 'CAM-HG-01',
  },
];
