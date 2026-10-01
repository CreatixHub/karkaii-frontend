export type PassStatus =
  | 'Active' | 'Returned' | 'Expired' | 'Scheduled' | 'Pending Approval' | 'Revoked';

export type PassType =
  | 'Visitor Pass' | 'Vehicle Pass' | 'Student Exit Pass'
  | 'Staff Pass' | 'Contractor Pass' | 'Temporary Pass';

export type PersonType = 'Visitor' | 'Guardian' | 'Student' | 'Staff' | 'Vendor' | 'Contractor';

export type IdState = 'Verified' | 'Pending' | 'Failed';

export type CheckState = 'Passed' | 'Pending' | 'Failed';

export interface VerificationCheck {
  label: string;
  state: CheckState;
}

/** A reader or desk scan on the pass's history. */
export interface ScanEntry {
  title: string;
  meta: string;
}

export interface PassDocument {
  name: string;
  meta: string;
}

export interface Vehicle {
  type: string;
  registration: string;
  details: string;
  barrierAccess: string;
}

export interface GatePass {
  id: string;
  passType: PassType;
  /** Tabler icon for the pass-type cell, with its own tint. */
  icon: string;
  tint: string;

  holder: string;
  /** "ViewPro Systems Ltd · TECH-VP-078". */
  reference: string;
  personType: PersonType;
  contact: string;
  idProof: string;
  idNumber: string;

  gate: string;
  /** "Reception desk · Lane 1". */
  lane: string;
  /** "31 Jul 2026" — the day the window belongs to. */
  date: string;
  validFrom: string;
  validUntil: string;
  /** Empty until the holder hands the pass back. */
  returnedAt: string;

  issuedBy: string;
  issuerRole: string;
  host: string;
  hostRole: string;
  department: string;
  purpose: string;
  accessZones: string;

  vehicle: Vehicle | null;

  /** Set while the pass is still a draft awaiting a host decision. */
  pendingApproval: boolean;
  /** Set when the pass was pulled; it outranks the window. */
  revoked: boolean;
  /** "14:05" — when it was pulled. */
  revokedAt: string;

  checks: VerificationCheck[];
  scans: ScanEntry[];
  documents: PassDocument[];
  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const passTypeBadge: Record<PassType, string> = {
  'Visitor Pass': 'badge badge-soft-primary',
  'Vehicle Pass': 'badge badge-soft-warning',
  'Student Exit Pass': 'badge badge-soft-info',
  'Staff Pass': 'badge badge-soft-success',
  'Contractor Pass': 'badge badge-soft-secondary',
  'Temporary Pass': 'badge badge-soft-purple',
};

export const personBadge: Record<PersonType, string> = {
  Visitor: 'badge badge-soft-primary',
  Guardian: 'badge badge-soft-warning',
  Student: 'badge badge-soft-info',
  Staff: 'badge badge-soft-success',
  Vendor: 'badge badge-soft-purple',
  Contractor: 'badge badge-soft-secondary',
};

export const statusPill: Record<PassStatus, string> = {
  Active: 'is-active',
  Returned: 'is-completed',
  Expired: 'is-blocked',
  Scheduled: 'is-pending',
  'Pending Approval': 'is-review',
  Revoked: 'is-suspended',
};

export const statusBadge: Record<PassStatus, string> = {
  Active: 'badge badge-soft-success',
  Returned: 'badge badge-soft-secondary',
  Expired: 'badge badge-soft-danger',
  Scheduled: 'badge badge-soft-warning',
  'Pending Approval': 'badge badge-soft-info',
  Revoked: 'badge badge-soft-dark',
};

export const idBadge: Record<IdState, string> = {
  Verified: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
};

/** The security-notes chip, which names the state. */
export const idChip: Record<IdState, string> = {
  Verified: 'ID Verified',
  Pending: 'ID Pending',
  Failed: 'ID Failed',
};

export const checkBadge: Record<CheckState, string> = {
  Passed: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
};

export const checkIcon: Record<CheckState, string> = {
  Passed: 'ti ti-circle-check',
  Pending: 'ti ti-clock',
  Failed: 'ti ti-circle-x',
};

/* ------------------------------ Filter options ------------------------------ */

export const passTypeOptions: PassType[] = [
  'Visitor Pass', 'Vehicle Pass', 'Student Exit Pass',
  'Staff Pass', 'Contractor Pass', 'Temporary Pass',
];

export const personTypeOptions: PersonType[] = [
  'Visitor', 'Guardian', 'Student', 'Staff', 'Vendor', 'Contractor',
];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const statusOptions: PassStatus[] = [
  'Active', 'Returned', 'Expired', 'Scheduled', 'Pending Approval', 'Revoked',
];

export const verificationOptions: IdState[] = ['Verified', 'Pending', 'Failed'];

export const expiringOptions = [
  'Within 30 minutes', 'Within 1 hour', 'Already expired', 'Not yet valid',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const issueTypeOptions = ['Visitor', 'Vehicle', 'Student', 'Temporary'];

export const zoneOptions = [
  'Main Block · Admission Office', 'Main Block · all floors',
  'Service corridor and stores', 'North Block only', 'Exit only',
];

export const hostChoices = [
  'Mr. Alan Pierce · Estates Manager',
  'Ms. Dana Ruiz · Admission Counsellor',
  'Mrs. Alice Ray · Chief Warden',
  'Mrs. Ellen Cruz · Class Teacher',
  'Ms. Rosa Klein · Cafeteria Manager',
];

export const vehicleTypeOptions = [
  'None · on foot', 'Private Car', 'Two Wheeler', 'Delivery Van', 'Official Car',
];

export const idProofOptions = [
  'National ID', 'Driving Licence', 'Company ID', 'Student ID', 'Staff ID Card',
];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const decisionOptions = ['Approve', 'Hold', 'Reject'];

export const verifyMethodOptions = ['QR Scan', 'ID Check', 'Biometric'];

export const readerOptions = [
  'Main Gate · reader MG-01', 'North Gate · reader NG-01',
  'Service Gate · barrier SG-01', 'Kitchen Store · CAM-KS-01',
];

export const resultOptions = [
  'Valid · access granted', 'Valid · escort required',
  'Invalid · outside the window', 'Invalid · zone not permitted',
];

export const extensionOptions = ['30 min', '1 hour', '2 hours', 'End of day'];

export const extensionAuthorityOptions = ['Security Supervisor', 'Chief Warden', 'Admission Office'];

export const extensionReasonOptions = [
  'Host meeting ran late', 'Waiting for the host', 'Return scan not registered', 'Under review',
];

export const revokeScopeOptions = ['This Pass', 'All Holder Passes', 'Vehicle Only'];

export const revokeAuthorityOptions = ['Security Supervisor', 'Chief Warden', 'Estates Manager'];

export const revokeReasonOptions = [
  'Host approval withdrawn', 'Outside permitted zone', 'Identity in question',
  'Security incident', 'Visit cancelled',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 240 → "4h 00m"; under an hour drops the hours. */
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

/** The window's own length. */
export const windowOf = (row: GatePass): number =>
  Math.max(0, minutesOf(row.validUntil) - minutesOf(row.validFrom));

/** "4h 00m window" — the line under the pass type. */
export const windowLabelOf = (row: GatePass): string => `${durationText(windowOf(row))} window`;

/** Positive before the window closes, negative once it has. */
export const minutesToExpiryOf = (row: GatePass): number =>
  minutesOf(row.validUntil) - minutesOf(REGISTER_TIME);

/** Positive while the window has not opened yet. */
export const minutesToOpenOf = (row: GatePass): number =>
  minutesOf(row.validFrom) - minutesOf(REGISTER_TIME);

/**
 * The pill the Pass Status column prints. A revocation outranks the window, and
 * a draft that has not been approved never becomes Active on the clock alone.
 */
export const statusOf = (row: GatePass): PassStatus => {
  if (row.revoked) return 'Revoked';
  if (row.pendingApproval) return 'Pending Approval';
  if (row.returnedAt) return 'Returned';
  if (minutesToOpenOf(row) > 0) return 'Scheduled';
  return minutesToExpiryOf(row) < 0 ? 'Expired' : 'Active';
};

/** What the Valid Until cell itself shows. */
export const validUntilLabelOf = (row: GatePass): string =>
  row.pendingApproval ? DASH : row.validUntil;

/** The line under it. */
export const validUntilSubLabelOf = (row: GatePass): string => {
  if (row.revoked) return `Revoked ${row.revokedAt}`;
  if (row.pendingApproval) return 'Set on approval';
  if (row.returnedAt) return `Returned ${row.returnedAt}`;
  const toOpen = minutesToOpenOf(row);
  if (toOpen > 0) return `Opens in ${durationText(toOpen)}`;
  const toExpiry = minutesToExpiryOf(row);
  return toExpiry < 0
    ? `Expired ${durationText(-toExpiry)} ago`
    : `Expires in ${durationText(toExpiry)}`;
};

export const validUntilTintOf = (row: GatePass): string => {
  if (row.revoked) return 'text-danger';
  if (row.pendingApproval) return 'text-warning';
  if (row.returnedAt) return 'text-success';
  if (minutesToOpenOf(row) > 0) return 'text-muted';
  return minutesToExpiryOf(row) < 0 ? 'text-danger' : 'text-warning';
};

/* ------------------------------- The checks --------------------------------- */

export const passedCountOf = (row: GatePass): number =>
  row.checks.filter((check) => check.state === 'Passed').length;

export const failedCountOf = (row: GatePass): number =>
  row.checks.filter((check) => check.state === 'Failed').length;

export const pendingCountOf = (row: GatePass): number =>
  row.checks.filter((check) => check.state === 'Pending').length;

/** "3 of 3 checks passed". */
export const checkSummaryOf = (row: GatePass): string =>
  `${passedCountOf(row)} of ${row.checks.length} checks passed`;

export const idStateOf = (row: GatePass): IdState => {
  if (failedCountOf(row) > 0) return 'Failed';
  return pendingCountOf(row) > 0 ? 'Pending' : 'Verified';
};

export interface Pair {
  label: string;
  value: string;
}

export const passPairsOf = (row: GatePass): Pair[] => [
  { label: 'Pass ID', value: row.id },
  { label: 'Pass Type', value: row.passType },
  { label: 'Gate', value: row.gate },
  { label: 'Issued By', value: row.issuedBy },
  { label: 'Issuer Role', value: row.issuerRole },
];

export const holderPairsOf = (row: GatePass): Pair[] => [
  { label: 'Holder', value: row.holder },
  { label: 'Person Type', value: row.personType },
  { label: 'Reference', value: row.reference },
  { label: 'ID Proof', value: `${row.idProof} · ${row.idNumber}` },
  { label: 'Contact', value: row.contact },
];

export const vehiclePairsOf = (row: GatePass): Pair[] =>
  row.vehicle
    ? [
      { label: 'Vehicle Type', value: row.vehicle.type },
      { label: 'Registration', value: row.vehicle.registration },
      { label: 'Details', value: row.vehicle.details },
      { label: 'Barrier', value: row.lane },
      { label: 'Barrier Access', value: row.vehicle.barrierAccess },
    ]
    : [];

export const hostPairsOf = (row: GatePass): Pair[] => [
  { label: 'Host', value: row.host },
  { label: 'Role', value: row.hostRole },
  { label: 'Department', value: row.department },
  { label: 'Purpose', value: row.purpose },
  { label: 'Access Zones', value: row.accessZones },
];

/** The View dialog's window block. */
export const windowPairsOf = (row: GatePass): Pair[] => [
  { label: 'Valid From', value: row.validFrom },
  { label: 'Valid Until', value: validUntilLabelOf(row) },
  { label: 'Window', value: durationText(windowOf(row)) },
  { label: 'Returned', value: row.returnedAt || (row.revoked ? 'Revoked' : 'Not returned') },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The validity trail. Every line is dated off the window, the return and the two
 * flags, so extending or revoking a pass redraws it.
 */
export const timelineOf = (row: GatePass): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-ticket', tint: 'primary',
      title: 'Validity window opens', meta: `${row.validFrom} · ${row.date}`,
    },
    {
      icon: 'ti ti-clock', tint: 'info',
      title: 'Window length', meta: durationText(windowOf(row)),
    },
  ];
  if (row.revoked) {
    entries.push({
      icon: 'ti ti-shield-x', tint: 'danger',
      title: 'Pass revoked at the gate', meta: `${row.revokedAt} · access withdrawn`,
    });
    return entries;
  }
  if (row.pendingApproval) {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Window applies once approved', meta: 'Draft times shown',
    });
    return entries;
  }
  if (row.returnedAt) {
    const early = minutesOf(row.validUntil) - minutesOf(row.returnedAt);
    entries.push({
      icon: 'ti ti-check', tint: 'success',
      title: 'Pass returned at the gate',
      meta: early > 0
        ? `${row.returnedAt} · ${durationText(early)} before expiry`
        : `${row.returnedAt} · ${durationText(-early)} after expiry`,
    });
    return entries;
  }
  const toOpen = minutesToOpenOf(row);
  if (toOpen > 0) {
    entries.push({
      icon: 'ti ti-calendar-event', tint: 'warning',
      title: 'Window not yet open', meta: `Opens in ${durationText(toOpen)}`,
    });
    return entries;
  }
  const toExpiry = minutesToExpiryOf(row);
  entries.push(
    toExpiry < 0
      ? {
        icon: 'ti ti-alert-triangle', tint: 'danger',
        title: 'Window closed with no return scan',
        meta: `${row.validUntil} · ${durationText(-toExpiry)} ago`,
      }
      : {
        icon: 'ti ti-clock', tint: 'warning',
        title: 'Pass in use now', meta: `${REGISTER_TIME} · expires in ${durationText(toExpiry)}`,
      },
  );
  return entries;
};

/** The panel's audit trail, built from the same facts. */
export const auditOf = (row: GatePass): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: row.pendingApproval ? 'Pass drafted against the booking' : 'Pass issued at the gate',
    meta: `${row.validFrom} · ${row.issuedBy}`,
  },
  {
    icon: 'ti ti-shield-check', tint: idStateOf(row) === 'Failed' ? 'danger' : idStateOf(row) === 'Pending' ? 'warning' : 'success',
    title: `Verification ${idStateOf(row).toLowerCase()}`, meta: checkSummaryOf(row),
  },
  row.returnedAt
    ? {
      icon: 'ti ti-checks', tint: 'success',
      title: 'Pass returned and closed', meta: `${row.returnedAt} · ${row.gate}`,
    }
    : {
      icon: 'ti ti-clock', tint: row.revoked ? 'danger' : 'warning',
      title: row.revoked ? 'Pass blocked at every reader' : 'Pass still open',
      meta: `${row.revoked ? row.revokedAt : REGISTER_TIME} · security desk`,
    },
];

/* --------------------------------- Filters ---------------------------------- */

/** The expiry bands overlap, so this is a predicate rather than one band. */
export const matchesExpiring = (row: GatePass, band: string): boolean => {
  if (row.revoked || row.returnedAt) return false;
  const toExpiry = minutesToExpiryOf(row);
  const toOpen = minutesToOpenOf(row);
  switch (band) {
    case 'Within 30 minutes': return toOpen <= 0 && toExpiry >= 0 && toExpiry <= 30;
    case 'Within 1 hour': return toOpen <= 0 && toExpiry >= 0 && toExpiry <= 60;
    case 'Already expired': return toOpen <= 0 && toExpiry < 0;
    case 'Not yet valid': return toOpen > 0;
    default: return true;
  }
};

export const searchIndexOf = (row: GatePass): string =>
  [
    row.id, row.passType, row.holder, row.reference, row.personType, row.gate, row.lane,
    row.issuedBy, row.host, row.department, row.purpose, row.accessZones,
    statusOf(row), idStateOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole register — 77 passes against the eight this page
 * lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  active: 27,
  issuedToday: 68,
  expired: 9,
  inside: 24,
  vehicles: 19,
};

export const VIEW_TOTALS = {
  all: 77,
  active: 27,
  expired: 9,
  vehicles: 19,
  revoked: 3,
};

export const QUICK_TOTALS = {
  all: 77,
  active: 27,
  returned: 32,
  expired: 9,
  pending: 6,
  revoked: 3,
};

/** The template's one committed chip — the date the register is showing. */
export const REGISTER_FROM = '31-07-2026';
export const REGISTER_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const gatePasses: GatePass[] = [
  {
    id: 'VP-2026-0841', passType: 'Visitor Pass', icon: 'ti ti-ticket', tint: 'primary',
    holder: 'Ms. Hannah Lee', reference: 'ViewPro Systems Ltd · TECH-VP-078',
    personType: 'Contractor', contact: '+1 55 2214 8890',
    idProof: 'Company ID', idNumber: 'VP-078••••12',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', date: '31 Jul 2026',
    validFrom: '09:10', validUntil: '13:10', returnedAt: '12:35',
    issuedBy: 'Mr. Samuel Roy', issuerRole: 'Gate Officer · SEC-014',
    host: 'Mr. Alan Pierce', hostRole: 'Estates Manager', department: 'Estates Office',
    purpose: 'Smart board calibration · SRV-2026-0424',
    accessZones: 'Main Block · Room 204, Estates Office',
    vehicle: null,
    pendingApproval: false, revoked: false, revokedAt: '',
    checks: [
      { label: 'Photo ID checked against the vendor register', state: 'Passed' },
      { label: 'Host confirmed the appointment by phone', state: 'Passed' },
      { label: 'Bag and tool case screened at the desk', state: 'Passed' },
    ],
    scans: [
      { title: 'Issued at the reception desk', meta: '09:10 · Mr. Samuel Roy' },
      { title: 'Verified at the Room 204 corridor reader', meta: '09:24 · CAM-MB-04' },
      { title: 'Returned at the reception desk', meta: '12:35 · Mr. Imran Qadir' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0841.pdf', meta: 'Issued 09:10 · returned 12:35 · 42 KB' },
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0424 · 74 KB' },
    ],
    notes: 'Returned 35 minutes before the window closed. Regular vendor on the approved access list.',
  },
  {
    id: 'VP-2026-0847', passType: 'Visitor Pass', icon: 'ti ti-ticket', tint: 'primary',
    holder: 'Mrs. Janet Gourley', reference: 'Guardian of Lisa Gourley · II B',
    personType: 'Guardian', contact: '+1 55 7712 4409',
    idProof: 'Driving Licence', idNumber: 'DL-44••••71',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', date: '31 Jul 2026',
    validFrom: '10:25', validUntil: '12:25', returnedAt: '11:25',
    issuedBy: 'Mr. Samuel Roy', issuerRole: 'Gate Officer · SEC-014',
    host: 'Mrs. Ellen Cruz', hostRole: 'Class Teacher · II B', department: 'Class Teacher',
    purpose: 'Guardian meeting · device return',
    accessZones: 'Main Block · Room A-104, Library desk',
    vehicle: {
      type: 'Private Car', registration: 'KA-05-MJ-2218',
      details: 'Silver hatchback · Visitor Bay 4', barrierAccess: 'Granted',
    },
    pendingApproval: false, revoked: false, revokedAt: '',
    checks: [
      { label: 'Driving licence checked and photographed', state: 'Passed' },
      { label: 'Guardian relationship confirmed on the student record', state: 'Passed' },
      { label: 'Vehicle registration logged at the barrier', state: 'Passed' },
    ],
    scans: [
      { title: 'Issued at the reception desk', meta: '10:25 · Mr. Samuel Roy' },
      { title: 'Verified at the Room A-104 reader', meta: '10:34 · CAM-MB-02' },
      { title: 'Returned at the reception desk', meta: '11:25 · Mr. Samuel Roy' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0847.pdf', meta: 'Issued 10:25 · returned 11:25 · 40 KB' },
      { name: 'Early Exit Authorisation.pdf', meta: 'Signed by the class teacher · 56 KB' },
    ],
    notes: 'Collected Lisa Gourley on exit pass SP-2026-0362 and returned the loaned Chromebook.',
  },
  {
    id: 'VP-2026-0859', passType: 'Vehicle Pass', icon: 'ti ti-car', tint: 'warning',
    holder: 'Mr. Dinesh Varma', reference: 'FreshLine Foods · SUP-2023-008',
    personType: 'Vendor', contact: '+1 55 9925 4417',
    idProof: 'Company ID', idNumber: 'FL-221••••08',
    gate: 'Service Gate', lane: 'Rear service road · Dock 2', date: '31 Jul 2026',
    validFrom: '14:15', validUntil: '16:15', returnedAt: '',
    issuedBy: 'Ms. Fiona Marsh', issuerRole: 'Gate Officer · SEC-031',
    host: 'Ms. Rosa Klein', hostRole: 'Cafeteria Manager', department: 'Cafeteria',
    purpose: 'Kitchen delivery · weekly replenishment',
    accessZones: 'Service corridor and the dry store',
    vehicle: {
      type: 'Delivery Van', registration: 'TN-09-DL-3312',
      details: 'Refrigerated van · Dock 2', barrierAccess: 'Granted',
    },
    pendingApproval: false, revoked: false, revokedAt: '',
    checks: [
      { label: 'Delivery challan matched against the open order', state: 'Passed' },
      { label: 'Driver ID checked against the supplier register', state: 'Passed' },
      { label: 'Vehicle inspected at the service barrier', state: 'Passed' },
    ],
    scans: [
      { title: 'Issued at the service barrier', meta: '14:15 · Ms. Fiona Marsh' },
      { title: 'Verified at the dry store reader', meta: '14:32 · CAM-KS-01' },
      { title: 'Return scan not recorded', meta: 'Pass still with the holder' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0859.pdf', meta: 'Issued 14:15 · active · 41 KB' },
      { name: 'Delivery Challan.pdf', meta: 'FreshLine Foods · 68 KB' },
    ],
    notes: 'Access restricted to the service corridor and the dry store while unloading at Dock 2.',
  },
  {
    id: 'VP-2026-0871', passType: 'Visitor Pass', icon: 'ti ti-ticket', tint: 'primary',
    holder: 'Mr. Victor Hale', reference: 'Walk in · no prior appointment',
    personType: 'Visitor', contact: '+1 55 6620 1187',
    idProof: 'National ID', idNumber: 'NID-77••••34',
    gate: 'North Gate', lane: 'North reception · Lane 1', date: '31 Jul 2026',
    validFrom: '13:15', validUntil: '14:15', returnedAt: '',
    issuedBy: 'Ms. Fiona Marsh', issuerRole: 'Gate Officer · SEC-031',
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    purpose: 'Admission enquiry · prospectus collection',
    accessZones: 'North Block · Admission Office',
    vehicle: null,
    pendingApproval: false, revoked: false, revokedAt: '',
    checks: [
      { label: 'National ID checked and photographed', state: 'Passed' },
      { label: 'Admission office confirmed a walk in slot', state: 'Passed' },
      { label: 'Pass return not logged at either gate', state: 'Pending' },
    ],
    scans: [
      { title: 'Issued at the north reception', meta: '13:15 · Ms. Fiona Marsh' },
      { title: 'Verified at the admission office reader', meta: '13:22 · CAM-NB-01' },
      { title: 'Return scan not recorded', meta: 'Window closed at 14:15' },
    ],
    documents: [
      { name: 'Visitor Pass VP-2026-0871.pdf', meta: 'Issued 13:15 · expired 14:15 · 39 KB' },
    ],
    notes: 'One hour pass has run out with no exit scan. North gate asked to locate the holder.',
  },
  {
    id: 'SP-2026-0362', passType: 'Student Exit Pass', icon: 'ti ti-school', tint: 'info',
    holder: 'Lisa Gourley', reference: 'II B · AD9892431',
    personType: 'Student', contact: '+1 55 7712 4409',
    idProof: 'Student ID', idNumber: 'AD9892431',
    gate: 'Main Gate', lane: 'Reception desk · Lane 2', date: '31 Jul 2026',
    validFrom: '11:10', validUntil: '11:30', returnedAt: '11:20',
    issuedBy: 'Mrs. Ellen Cruz', issuerRole: 'Class Teacher · II B',
    host: 'Mrs. Janet Gourley', hostRole: 'Guardian · collecting', department: 'Class Teacher',
    purpose: 'Early exit · medical appointment',
    accessZones: 'Main Gate · exit only',
    vehicle: {
      type: 'Private Car', registration: 'KA-05-MJ-2218',
      details: 'Guardian vehicle · Visitor Bay 4', barrierAccess: 'Granted',
    },
    pendingApproval: false, revoked: false, revokedAt: '',
    checks: [
      { label: 'Exit slip signed by the class teacher', state: 'Passed' },
      { label: 'Guardian identity matched the student record', state: 'Passed' },
      { label: 'Handover recorded in the movement register', state: 'Passed' },
    ],
    scans: [
      { title: 'Issued by the class teacher', meta: '11:10 · Mrs. Ellen Cruz' },
      { title: 'Exit scan at the main gate', meta: '11:20 · Mr. Samuel Roy' },
      { title: 'Pass returned at the desk', meta: '11:20 · Main Gate' },
    ],
    documents: [
      { name: 'Student Gate Pass SP-2026-0362.pdf', meta: 'Issued 11:10 · used 11:20 · 38 KB' },
      { name: 'Exit Slip.pdf', meta: 'Counter signed by the guardian · 34 KB' },
    ],
    notes: 'Twenty minute window for the handover at the reception desk. Used with ten minutes to spare.',
  },
  {
    id: 'SP-2026-0364', passType: 'Staff Pass', icon: 'ti ti-id-badge-2', tint: 'success',
    holder: 'Ms. Carla Mendes', reference: 'Assistant Warden · EMP-2024-088',
    personType: 'Staff', contact: '+1 55 3341 7726',
    idProof: 'Staff ID Card', idNumber: 'EMP-088••••64',
    gate: 'Main Gate', lane: 'Staff turnstile · Lane 3', date: '31 Jul 2026',
    validFrom: '16:00', validUntil: '18:00', returnedAt: '',
    issuedBy: 'Mrs. Alice Ray', issuerRole: 'Chief Warden · Administration',
    host: 'Mrs. Alice Ray', hostRole: 'Chief Warden', department: 'Library',
    purpose: 'Half day leave · second half',
    accessZones: 'Main Gate · exit only',
    vehicle: null,
    pendingApproval: false, revoked: false, revokedAt: '',
    checks: [
      { label: 'Leave approval on the HR record', state: 'Passed' },
      { label: 'Staff ID card checked at the desk', state: 'Passed' },
      { label: 'Turnstile scan on departure', state: 'Pending' },
    ],
    scans: [
      { title: 'Issued at the administration office', meta: '09:45 · Mrs. Alice Ray' },
      { title: 'Not yet presented at the turnstile', meta: 'Window opens 16:00' },
      { title: 'Return scan not recorded', meta: 'No return due today' },
    ],
    documents: [
      { name: 'Exit Pass SP-2026-0364.pdf', meta: 'Issued 09:45 · not used · 36 KB' },
      { name: 'Leave Approval.pdf', meta: 'HR record · 52 KB' },
    ],
    notes: 'Half day leave from 16:00. The pass closes at the end of the working day with no return due.',
  },
  {
    id: 'VP-2026-0889', passType: 'Visitor Pass', icon: 'ti ti-ticket', tint: 'primary',
    holder: 'Ms. Beatriz Alonso', reference: 'Prospective parent · Grade VI enquiry',
    personType: 'Guardian', contact: '+1 55 3372 9908',
    idProof: 'National ID', idNumber: 'NID-52••••19',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', date: '31 Jul 2026',
    validFrom: '16:30', validUntil: '18:30', returnedAt: '',
    issuedBy: 'Ms. Dana Ruiz', issuerRole: 'Admission Counsellor',
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    purpose: 'Admission interview · ADM-2026-0742',
    accessZones: 'Main Block · Admission Office',
    vehicle: null,
    pendingApproval: true, revoked: false, revokedAt: '',
    checks: [
      { label: 'National ID checked and photographed', state: 'Passed' },
      { label: 'Appointment booking reference verified', state: 'Passed' },
      { label: 'Host confirmation', state: 'Pending' },
    ],
    scans: [
      { title: 'Pass drafted against the booking', meta: '14:50 · Admission Office' },
      { title: 'Awaiting the counsellor confirmation', meta: '15:40 · in the queue' },
      { title: 'Not yet issued at the gate', meta: 'No scan recorded' },
    ],
    documents: [
      { name: 'Appointment Booking.pdf', meta: 'Raised 28 Jul 2026 · 46 KB' },
    ],
    notes: 'Drafted against ADM-2026-0742. The window applies once the admission counsellor confirms.',
  },
  {
    id: 'VP-2026-0883', passType: 'Vehicle Pass', icon: 'ti ti-car', tint: 'warning',
    holder: 'Mr. Owen Blake', reference: 'Walk in · hostel block',
    personType: 'Visitor', contact: '+1 55 3341 7726',
    idProof: 'National ID', idNumber: 'NID-31••••90',
    gate: 'Hostel Gate', lane: 'Everest Hostel · Barrier 1', date: '31 Jul 2026',
    validFrom: '14:05', validUntil: '16:05', returnedAt: '',
    issuedBy: 'Mr. Imran Qadir', issuerRole: 'Gate Officer · SEC-022',
    host: 'Not confirmed', hostRole: 'No warden approval on record', department: 'Hostel Office',
    purpose: 'Unscheduled hostel visit · outside visiting hours',
    accessZones: 'None granted',
    vehicle: {
      type: 'Private Car', registration: 'AP-16-OB-5590',
      details: 'Blue sedan · turned away at the barrier', barrierAccess: 'Refused',
    },
    pendingApproval: false, revoked: true, revokedAt: '14:05',
    checks: [
      { label: 'National ID checked at the barrier', state: 'Passed' },
      { label: 'Visit falls outside the hostel visiting window', state: 'Failed' },
      { label: 'No warden approval found on the visitor register', state: 'Failed' },
    ],
    scans: [
      { title: 'Requested at the hostel barrier', meta: '14:05 · Mr. Imran Qadir' },
      { title: 'Revoked before issue', meta: '14:05 · no host approval' },
      { title: 'Blocked at every gate and corridor reader', meta: '14:06 · security desk' },
    ],
    documents: [
      { name: 'Access Denial Report.pdf', meta: 'Raised 14:05 · 52 KB' },
    ],
    notes: 'Revoked at the point of request. Advised to book through the hostel office within visiting hours.',
  },
];
