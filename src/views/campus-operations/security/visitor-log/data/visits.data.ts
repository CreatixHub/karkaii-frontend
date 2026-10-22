export type VisitStatus =
  | 'Completed' | 'In Progress' | 'Overstayed' | 'Scheduled' | 'Cancelled';

export type VisitorType = 'Visitor' | 'Guardian' | 'Vendor' | 'Contractor' | 'Official';

export type HostDepartment =
  | 'Estates Office' | 'Admission Office' | 'Administration' | 'Class Teacher'
  | 'Cafeteria' | 'Transport' | 'Hostel Office' | 'Principal Office';

/** One of the visitor's earlier visits, shown in the expander. */
export interface PastVisit {
  date: string;
  purpose: string;
  checkIn: string;
  checkOut: string;
}

export interface VisitDocument {
  name: string;
  meta: string;
}

export interface Visit {
  id: string;
  name: string;
  icon: string;
  tint: string;
  /** "ViewPro Systems Ltd · TECH-VP-078". */
  reference: string;
  visitorType: VisitorType;
  phone: string;
  email: string;
  /** "Private Car · KA-05-MJ-2218", or empty when the visitor walked in. */
  vehicle: string;

  host: string;
  hostRole: string;
  department: HostDepartment;
  purpose: string;
  detail: string;

  gate: string;
  /** "Reception desk · Lane 1". */
  lane: string;
  gateOfficer: string;

  /** "31 Jul 2026" — the day the visit belongs to. */
  date: string;
  /** Empty until the visitor arrives. */
  checkIn: string;
  /** Empty until they leave. */
  checkOut: string;
  /** Empty on a scheduled visit that has not started. */
  passNumber: string;
  passUntil: string;
  /** Set on a refusal, which outranks the times on the pill. */
  refused: boolean;
  /** "14:05" — when they were turned away. */
  refusedAt: string;
  /** The slot a scheduled visit is booked for. */
  expected: string;

  idProof: string;
  idNumber: string;
  verification: string;
  gateRegister: string;
  escort: string;

  /** How many visits this person has on the register, including this one. */
  visitsOnRecord: number;
  pastVisits: PastVisit[];
  documents: VisitDocument[];
  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const visitorBadge: Record<VisitorType, string> = {
  Visitor: 'badge badge-soft-primary',
  Guardian: 'badge badge-soft-warning',
  Vendor: 'badge badge-soft-purple',
  Contractor: 'badge badge-soft-secondary',
  Official: 'badge badge-soft-info',
};

export const departmentBadge: Record<HostDepartment, string> = {
  'Estates Office': 'badge badge-soft-primary',
  'Admission Office': 'badge badge-soft-info',
  Administration: 'badge badge-soft-primary',
  'Class Teacher': 'badge badge-soft-success',
  Cafeteria: 'badge badge-soft-warning',
  Transport: 'badge badge-soft-purple',
  'Hostel Office': 'badge badge-soft-danger',
  'Principal Office': 'badge badge-soft-secondary',
};

export const statusPill: Record<VisitStatus, string> = {
  Completed: 'is-completed',
  'In Progress': 'is-active',
  Overstayed: 'is-blocked',
  Scheduled: 'is-pending',
  Cancelled: 'is-suspended',
};

export const statusBadge: Record<VisitStatus, string> = {
  Completed: 'badge badge-soft-secondary',
  'In Progress': 'badge badge-soft-success',
  Overstayed: 'badge badge-soft-danger',
  Scheduled: 'badge badge-soft-warning',
  Cancelled: 'badge badge-soft-dark',
};

/* ------------------------------ Filter options ------------------------------ */

export const visitorTypeOptions: VisitorType[] = [
  'Visitor', 'Guardian', 'Vendor', 'Contractor', 'Official',
];

export const departmentOptions: HostDepartment[] = [
  'Estates Office', 'Admission Office', 'Administration', 'Class Teacher',
  'Cafeteria', 'Transport', 'Hostel Office', 'Principal Office',
];

export const purposeOptions = [
  'Guardian meeting', 'Admission enquiry', 'Admission interview',
  'Kitchen delivery', 'Vehicle inspection', 'Annual inspection', 'Service visit',
];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const statusOptions: VisitStatus[] = [
  'Completed', 'In Progress', 'Overstayed', 'Scheduled', 'Cancelled',
];

export const frequencyOptions = ['First visit', 'Repeat visitor', 'More than 5 visits'];

/* --------------------------- Dialog option lists ----------------------------- */

export const logTypeOptions = ['Live Entry', 'Backdated', 'Scheduled'];

export const hostChoices = [
  'Mr. Alan Pierce · Estates Manager',
  'Ms. Dana Ruiz · Admission Counsellor',
  'Mrs. Alice Ray · Chief Warden',
  'Mrs. Ellen Cruz · Class Teacher',
  'Ms. Rosa Klein · Cafeteria Manager',
  'Mr. Arjun Nair · Transport Supervisor',
];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const idProofOptions = [
  'National ID', 'Driving Licence', 'Company ID', 'Passport', 'Government Letter',
];

export const verificationOptions = ['ID Proof', 'QR Invite', 'Biometric'];

export const validityOptions = ['1 hour', '2 hours', '4 hours', 'Full day'];

export const escortOptions = ['Escort required', 'Escort not required'];

export const returnOptions = ['Returned', 'Lost', 'Damaged'];

export const overstayReasonOptions = [
  'Host meeting ran late', 'Waiting for the host', 'Pass return not scanned', 'Under review',
];

export const printFormatOptions = ['Badge', 'Slip', 'A4 Record'];

export const printerOptions = [
  'Reception Desk · Badge Printer', 'North Reception · Badge Printer', 'Security Office · A4',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 205 → "3h 25m"; under an hour drops the hours. */
export const durationText = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return hours === 0 ? `${mins}m` : `${hours}h ${String(mins).padStart(2, '0')}m`;
};

export const addMinutes = (time: string, minutes: number): string => {
  const total = (minutesOf(time) + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** Check-in to check-out, or to now while the visitor is still on site. */
export const durationOf = (row: Visit): number => {
  if (!row.checkIn) return 0;
  return Math.max(0, minutesOf(row.checkOut || REGISTER_TIME) - minutesOf(row.checkIn));
};

/** How far past the pass window an open visit has run. */
export const overstayOf = (row: Visit): number => {
  if (row.checkOut || !row.checkIn || !row.passUntil) return 0;
  // Only today's visits can still be running against the register clock.
  if (dateKey(row.date) !== dateKey(REGISTER_DATE)) return 0;
  return Math.max(0, minutesOf(REGISTER_TIME) - minutesOf(row.passUntil));
};

/**
 * The pill the Visit Status column prints. A refusal outranks the clock — the
 * turned-away visitor never entered, so the visit reads Cancelled.
 */
export const statusOf = (row: Visit): VisitStatus => {
  if (row.refused) return 'Cancelled';
  if (!row.checkIn) return 'Scheduled';
  if (row.checkOut) return 'Completed';
  return overstayOf(row) > 0 ? 'Overstayed' : 'In Progress';
};

export const checkInLabelOf = (row: Visit): string => {
  if (row.refused) return 'Not admitted';
  return row.checkIn || 'Not arrived';
};

export const checkInSubLabelOf = (row: Visit): string => {
  if (row.refused) return `Attempt ${row.refusedAt}`;
  if (!row.checkIn) return row.expected ? `Due ${row.expected}` : 'Not booked';
  return row.date;
};

export const checkOutLabelOf = (row: Visit): string => {
  if (row.refused || !row.checkIn) return DASH;
  if (row.checkOut) return row.checkOut;
  return overstayOf(row) > 0 ? 'Not scanned' : 'Still inside';
};

export const checkOutSubLabelOf = (row: Visit): string => {
  if (row.refused || !row.checkIn) return 'No movement';
  if (row.checkOut) return row.date;
  return overstayOf(row) > 0 ? `Pass ended ${row.passUntil}` : `Pass to ${row.passUntil}`;
};

/** The Visit Duration cell itself. */
export const durationCellOf = (row: Visit): string =>
  row.checkIn && !row.refused ? durationText(durationOf(row)) : DASH;

/** The line under it. */
export const durationLabelOf = (row: Visit): string => {
  const status = statusOf(row);
  if (status === 'Cancelled') return 'Entry refused';
  if (status === 'Scheduled') return 'Not started';
  if (status === 'Completed') return 'Closed on exit scan';
  if (status === 'Overstayed') return `Over by ${durationText(overstayOf(row))}`;
  return 'Running now';
};

export const durationTintOf = (row: Visit): string => {
  const status = statusOf(row);
  if (status === 'Overstayed') return 'text-danger';
  if (status === 'In Progress') return 'text-warning';
  if (status === 'Completed') return 'text-success';
  return 'text-muted';
};

/** "First visit" / "Repeat · 3 visits". */
export const frequencyLabelOf = (row: Visit): string =>
  row.visitsOnRecord <= 1 ? 'First visit' : `Repeat · ${row.visitsOnRecord} visits`;

export const isRepeat = (row: Visit): boolean => row.visitsOnRecord > 1;

/** "09:10 – 12:35" — the window the Print Pass dialog shows. */
export const windowOf = (row: Visit): string => {
  if (!row.checkIn) return 'Not started';
  return `${row.checkIn} – ${row.checkOut || REGISTER_TIME}`;
};

export interface Pair {
  label: string;
  value: string;
}

export const profilePairsOf = (row: Visit): Pair[] => [
  { label: 'Visit ID', value: row.id },
  { label: 'Visitor Type', value: row.visitorType },
  { label: 'Reference', value: row.reference },
  { label: 'Verification', value: row.verification },
  { label: 'Visits On Record', value: String(row.visitsOnRecord) },
];

export const contactPairsOf = (row: Visit): Pair[] => [
  { label: 'Phone', value: row.phone },
  { label: 'Email', value: row.email },
  { label: 'Vehicle', value: row.vehicle || 'On foot' },
  { label: 'Gate', value: `${row.gate} · ${row.lane}` },
  { label: 'Gate Officer', value: row.gateOfficer || 'Not assigned' },
];

export const identityPairsOf = (row: Visit): Pair[] => [
  { label: 'ID Proof', value: row.idProof },
  { label: 'ID Number', value: row.idNumber },
  { label: 'Pass Number', value: row.passNumber || 'Not issued' },
  { label: 'Gate Register', value: row.gateRegister || 'Not linked' },
  { label: 'Escort', value: row.escort },
];

export const hostPairsOf = (row: Visit): Pair[] => [
  { label: 'Host', value: row.host },
  { label: 'Role', value: row.hostRole },
  { label: 'Department', value: row.department },
  { label: 'Purpose', value: row.purpose },
  { label: 'Detail', value: row.detail },
];

/** The View dialog's visit block. */
export const visitPairsOf = (row: Visit): Pair[] => [
  { label: 'Check-In', value: checkInLabelOf(row) },
  { label: 'Check-Out', value: checkOutLabelOf(row) },
  { label: 'Duration', value: durationCellOf(row) },
  { label: 'Pass', value: row.passNumber || 'Not issued' },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The entry-and-exit trail. Every line is dated off the stored stamps, so a
 * check-in or a check-out redraws it.
 */
export const timelineOf = (row: Visit): TimelineEntry[] => {
  if (row.refused) {
    return [
      { icon: 'ti ti-shield-x', tint: 'danger', title: 'Stopped at the barrier', meta: `${row.refusedAt} · ${row.gate}` },
      { icon: 'ti ti-shield-x', tint: 'danger', title: 'Entry refused by the gate officer', meta: `${row.refusedAt} · ${row.gateOfficer}` },
      { icon: 'ti ti-link', tint: 'secondary', title: `Verification ${row.verification} raised`, meta: 'Checks recorded against the refusal' },
    ];
  }
  if (!row.checkIn) {
    return [
      { icon: 'ti ti-calendar-event', tint: 'info', title: 'Visit booked in advance', meta: `${row.department}` },
      { icon: 'ti ti-user-check', tint: 'primary', title: `Verification ${row.verification} raised`, meta: 'ID checks on file' },
      { icon: 'ti ti-clock', tint: 'warning', title: 'Arrival expected', meta: `${row.expected} · ${row.date}` },
    ];
  }
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-door-enter', tint: 'success',
      title: 'Checked in at the gate', meta: `${row.checkIn} · ${row.gateOfficer}`,
    },
  ];
  if (row.passNumber) {
    entries.push({
      icon: 'ti ti-ticket', tint: 'primary',
      title: `Pass ${row.passNumber} issued`, meta: `${row.checkIn} · valid to ${row.passUntil}`,
    });
  }
  if (row.checkOut) {
    entries.push({
      icon: 'ti ti-door-exit', tint: 'info',
      title: 'Checked out at the gate',
      meta: `${row.checkOut} · on site ${durationText(durationOf(row))}`,
    });
    entries.push({
      icon: 'ti ti-check', tint: 'success',
      title: 'Pass returned at the desk', meta: `${row.checkOut} · ${row.gate}`,
    });
  } else if (overstayOf(row) > 0) {
    entries.push({
      icon: 'ti ti-alert-triangle', tint: 'danger',
      title: 'Pass expired with no exit scan',
      meta: `${row.passUntil} · over by ${durationText(overstayOf(row))}`,
    });
  } else {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'On campus now', meta: `${REGISTER_TIME} · on site ${durationText(durationOf(row))}`,
    });
  }
  return entries;
};

/** The panel's audit trail, built from the same stamps. */
export const auditOf = (row: Visit): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Visit record created',
    meta: row.checkIn ? `${row.checkIn} · ${row.gate}` : `Booked · ${row.department}`,
  },
  {
    icon: 'ti ti-link', tint: 'info',
    title: `Linked to verification ${row.verification}`, meta: 'Identity checks on file',
  },
  row.checkOut
    ? {
      icon: 'ti ti-checks', tint: 'success',
      title: 'Visit closed on the exit scan', meta: `${row.checkOut} · ${row.gateOfficer}`,
    }
    : {
      icon: 'ti ti-clock', tint: row.refused ? 'danger' : 'warning',
      title: row.refused ? 'Visit closed as refused' : 'Visit still open',
      meta: `${row.refused ? row.refusedAt : REGISTER_TIME} · security desk`,
    },
];

/* --------------------------------- Filters ---------------------------------- */

export const matchesFrequency = (row: Visit, band: string): boolean => {
  if (band === 'First visit') return row.visitsOnRecord <= 1;
  if (band === 'Repeat visitor') return row.visitsOnRecord > 1;
  if (band === 'More than 5 visits') return row.visitsOnRecord > 5;
  return true;
};

export const searchIndexOf = (row: Visit): string =>
  [
    row.id, row.name, row.reference, row.visitorType, row.host, row.hostRole, row.department,
    row.purpose, row.detail, row.gate, row.passNumber, row.verification, row.gateRegister,
    statusOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole session — 1,284 visits against the eight this page
 * lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  total: 1284,
  today: 62,
  inside: 34,
  completed: 1186,
  repeat: 218,
};

export const VIEW_TOTALS = {
  all: 1284,
  today: 62,
  inside: 34,
  repeat: 218,
  overstayed: 9,
  cancelled: 41,
};

/** The template's one committed chip is the July window it opens on. */
export const PERIOD_FROM = '01-07-2026';
export const PERIOD_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const visits: Visit[] = [
  {
    id: 'VST-2026-1841', name: 'Ms. Hannah Lee', icon: 'ti ti-tool', tint: 'secondary',
    reference: 'ViewPro Systems Ltd · TECH-VP-078', visitorType: 'Contractor',
    phone: '+1 55 2214 8890', email: 'h.lee@viewprosystems.example', vehicle: '',
    host: 'Mr. Alan Pierce', hostRole: 'Estates Manager', department: 'Estates Office',
    purpose: 'Smart board calibration', detail: 'SRV-2026-0424 · Room 204',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: 'Mr. Samuel Roy · SEC-014',
    date: '31 Jul 2026', checkIn: '09:10', checkOut: '12:35',
    passNumber: 'VP-2026-0841', passUntil: '13:10',
    refused: false, refusedAt: '', expected: '',
    idProof: 'Company ID', idNumber: 'VP-078••••12',
    verification: 'VVR-2026-0611', gateRegister: 'GT-2026-0841',
    escort: 'Escorted to Room 204 by the estates assistant',
    visitsOnRecord: 3,
    pastVisits: [
      { date: '28 Jan 2026', purpose: 'Calibration', checkIn: '10:05', checkOut: '13:20' },
      { date: '14 Sep 2024', purpose: 'Warranty repair', checkIn: '09:40', checkOut: '16:15' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0841.pdf', meta: 'Issued 09:10 · returned 12:35 · 42 KB' },
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0424 · 74 KB' },
    ],
    notes: 'Regular vendor on the approved list. Signed the estates desk register on arrival and departure.',
  },
  {
    id: 'VST-2026-1847', name: 'Mrs. Janet Gourley', icon: 'ti ti-users', tint: 'warning',
    reference: 'Guardian of Lisa Gourley · II B', visitorType: 'Guardian',
    phone: '+1 55 7712 4409', email: 'janet.gourley@example.com',
    vehicle: 'Private Car · KA-05-MJ-2218',
    host: 'Mrs. Ellen Cruz', hostRole: 'Class Teacher · II B', department: 'Class Teacher',
    purpose: 'Guardian meeting', detail: 'Device return · early collection',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: 'Mr. Samuel Roy · SEC-014',
    date: '31 Jul 2026', checkIn: '10:25', checkOut: '11:25',
    passNumber: 'VP-2026-0847', passUntil: '12:25',
    refused: false, refusedAt: '', expected: '',
    idProof: 'Driving Licence', idNumber: 'DL-44••••71',
    verification: 'VVR-2026-0617', gateRegister: 'GT-2026-0847',
    escort: 'Escorted to Room A-104 and back to the gate',
    visitsOnRecord: 3,
    pastVisits: [
      { date: '12 Jun 2026', purpose: 'Parent meeting', checkIn: '15:10', checkOut: '15:55' },
      { date: '18 Apr 2026', purpose: 'Term review', checkIn: '11:20', checkOut: '12:05' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0847.pdf', meta: 'Issued 10:25 · returned 11:25 · 40 KB' },
      { name: 'Early Exit Authorisation.pdf', meta: 'Signed by the class teacher · 56 KB' },
    ],
    notes: 'Returned the loaned Chromebook to the library desk and collected Lisa Gourley on the same visit.',
  },
  {
    id: 'VST-2026-1859', name: 'Mr. Dinesh Varma', icon: 'ti ti-truck-delivery', tint: 'purple',
    reference: 'FreshLine Foods · SUP-2023-008', visitorType: 'Vendor',
    phone: '+1 55 9925 4417', email: 'orders@freshline.example',
    vehicle: 'Delivery Van · TN-09-DL-3312',
    host: 'Ms. Rosa Klein', hostRole: 'Cafeteria Manager', department: 'Cafeteria',
    purpose: 'Kitchen delivery', detail: 'Weekly replenishment · Kitchen Store',
    gate: 'Service Gate', lane: 'Rear service road · Dock 2', gateOfficer: 'Ms. Fiona Marsh · SEC-031',
    date: '31 Jul 2026', checkIn: '14:15', checkOut: '',
    passNumber: 'VP-2026-0859', passUntil: '16:15',
    refused: false, refusedAt: '', expected: '',
    idProof: 'Company ID', idNumber: 'FL-221••••08',
    verification: 'VVR-2026-0623', gateRegister: 'GT-2026-0859',
    escort: 'Restricted to the service corridor and the dry store',
    visitsOnRecord: 3,
    pastVisits: [
      { date: '24 Jul 2026', purpose: 'Kitchen delivery', checkIn: '14:05', checkOut: '15:50' },
      { date: '17 Jul 2026', purpose: 'Kitchen delivery', checkIn: '14:20', checkOut: '16:00' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0859.pdf', meta: 'Issued 14:15 · active · 41 KB' },
      { name: 'Delivery Challan.pdf', meta: 'FreshLine Foods · 68 KB' },
    ],
    notes: 'Weekly kitchen run. Unloading at Dock 2 with the store office supervising the goods inward note.',
  },
  {
    id: 'VST-2026-1871', name: 'Mr. Victor Hale', icon: 'ti ti-user', tint: 'primary',
    reference: 'Walk in · no prior appointment', visitorType: 'Visitor',
    phone: '+1 55 6620 1187', email: 'v.hale@example.com', vehicle: '',
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    purpose: 'Admission enquiry', detail: 'Walk in · prospectus collection',
    gate: 'North Gate', lane: 'North reception · Lane 1', gateOfficer: 'Ms. Fiona Marsh · SEC-031',
    date: '31 Jul 2026', checkIn: '13:15', checkOut: '',
    passNumber: 'VP-2026-0871', passUntil: '14:15',
    refused: false, refusedAt: '', expected: '',
    idProof: 'National ID', idNumber: 'NID-77••••34',
    verification: 'VVR-2026-0629', gateRegister: 'GT-2026-0871',
    escort: 'Directed to the admission office at the north block',
    visitsOnRecord: 1,
    pastVisits: [],
    documents: [
      { name: 'Visitor Pass VP-2026-0871.pdf', meta: 'Issued 13:15 · expired 14:15 · 39 KB' },
    ],
    notes: 'One hour pass lapsed with no exit scan. North gate asked to locate the visitor and recover the pass.',
  },
  {
    id: 'VST-2026-1826', name: 'Mr. Rajesh Kumar', icon: 'ti ti-tool', tint: 'secondary',
    reference: 'Volvo Commercial Services · TECH-VC-114', visitorType: 'Contractor',
    phone: '+1 55 4176 2280', email: 'service@volvocommercial.example',
    vehicle: 'Service Van · KA-09-VC-1140',
    host: 'Mr. Arjun Nair', hostRole: 'Transport Supervisor', department: 'Transport',
    purpose: 'Vehicle inspection', detail: 'Pre service survey · SRV-2026-0412',
    gate: 'Service Gate', lane: 'Transport yard · Bay 3', gateOfficer: 'Mr. Imran Qadir · SEC-022',
    date: '30 Jul 2026', checkIn: '08:30', checkOut: '16:10',
    passNumber: 'VP-2026-0812', passUntil: '17:00',
    refused: false, refusedAt: '', expected: '',
    idProof: 'Company ID', idNumber: 'VC-114••••82',
    verification: 'VVR-2026-0598', gateRegister: 'GT-2026-0812',
    escort: 'Restricted to the transport yard',
    visitsOnRecord: 5,
    pastVisits: [
      { date: '08 May 2026', purpose: 'Quarterly service', checkIn: '08:15', checkOut: '17:20' },
      { date: '06 Feb 2026', purpose: 'Tyre rotation', checkIn: '09:00', checkOut: '14:40' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0812.pdf', meta: 'Issued 08:30 · returned 16:10 · 43 KB' },
      { name: 'Pre Service Survey.pdf', meta: 'SRV-2026-0412 · 88 KB' },
    ],
    notes: 'Longest standing contract vendor on the register. Pre service survey ahead of the 08 Aug bus service.',
  },
  {
    id: 'VST-2026-1812', name: 'Ms. Priya Sundaram', icon: 'ti ti-school', tint: 'info',
    reference: 'District Education Office · Inspector', visitorType: 'Official',
    phone: '+1 55 8801 3344', email: 'inspection@district.example', vehicle: '',
    host: 'Mrs. Alice Ray', hostRole: 'Chief Warden', department: 'Principal Office',
    purpose: 'Annual inspection', detail: 'Hostel and safety compliance',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: 'Mr. Samuel Roy · SEC-014',
    date: '29 Jul 2026', checkIn: '10:00', checkOut: '13:45',
    passNumber: 'VP-2026-0788', passUntil: '18:00',
    refused: false, refusedAt: '', expected: '',
    idProof: 'Government Letter', idNumber: 'DEO-2026••••11',
    verification: 'VVR-2026-0571', gateRegister: 'GT-2026-0788',
    escort: 'Escorted by the chief warden throughout',
    visitsOnRecord: 1,
    pastVisits: [],
    documents: [
      { name: 'Visitor Pass VP-2026-0788.pdf', meta: 'Issued 10:00 · returned 13:45 · 44 KB' },
      { name: 'Inspection Order.pdf', meta: 'District Education Office · 102 KB' },
    ],
    notes: 'Unescorted access not granted. A full day pass was issued but the inspection closed at 13:45.',
  },
  {
    id: 'VST-2026-1883', name: 'Ms. Beatriz Alonso', icon: 'ti ti-users', tint: 'warning',
    reference: 'Prospective parent · Grade VI enquiry', visitorType: 'Guardian',
    phone: '+1 55 3372 9908', email: 'b.alonso@example.com', vehicle: '',
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    purpose: 'Admission interview', detail: 'Grade VI intake · 2027 session',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: '',
    date: '31 Jul 2026', checkIn: '', checkOut: '',
    passNumber: '', passUntil: '',
    refused: false, refusedAt: '', expected: '16:30',
    idProof: 'National ID', idNumber: 'NID-52••••19',
    verification: 'VVR-2026-0641', gateRegister: '',
    escort: 'To be escorted from the reception desk',
    visitsOnRecord: 1,
    pastVisits: [],
    documents: [
      { name: 'Appointment Booking.pdf', meta: 'Raised 28 Jul 2026 · 46 KB' },
    ],
    notes: 'Booked against ADM-2026-0742. The pass is issued once the admission counsellor confirms the slot.',
  },
  {
    id: 'VST-2026-1895', name: 'Mr. Owen Blake', icon: 'ti ti-user', tint: 'primary',
    reference: 'Walk in · hostel block', visitorType: 'Visitor',
    phone: '+1 55 3341 7726', email: 'Not provided',
    vehicle: 'Private Car · AP-16-OB-5590',
    host: 'Not confirmed', hostRole: 'No warden approval on record', department: 'Hostel Office',
    purpose: 'Unscheduled hostel visit', detail: 'Outside visiting hours · no host',
    gate: 'Hostel Gate', lane: 'Everest Hostel · Barrier 1', gateOfficer: 'Mr. Imran Qadir · SEC-022',
    date: '31 Jul 2026', checkIn: '', checkOut: '',
    passNumber: '', passUntil: '',
    refused: true, refusedAt: '14:05', expected: '',
    idProof: 'National ID', idNumber: 'NID-31••••90',
    verification: 'VVR-2026-0653', gateRegister: '',
    escort: 'Not admitted · turned away at the barrier',
    visitsOnRecord: 1,
    pastVisits: [],
    documents: [
      { name: 'Access Denial Report.pdf', meta: 'Raised 14:05 · 52 KB' },
    ],
    notes: 'Hostel visiting hours are 16:00 to 18:00 with warden approval. Advised to book through the hostel office.',
  },
];
