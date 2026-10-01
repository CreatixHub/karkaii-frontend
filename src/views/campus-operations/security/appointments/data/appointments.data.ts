export type ApprovalStatus =
  | 'Pending Approval' | 'Approved' | 'Completed' | 'Rejected' | 'Rescheduled' | 'Cancelled';

export type PassStatus =
  | 'Issued' | 'Ready to Issue' | 'Draft Prepared' | 'Not Issued' | 'Returned' | 'Blocked';

export type AppointmentType =
  | 'Parent Meeting' | 'Admission Interview' | 'Vendor Visit'
  | 'Official Visit' | 'Campus Tour' | 'Staff Interview';

export type HostDepartment =
  | 'Admission Office' | 'Administration' | 'Class Teacher'
  | 'Estates Office' | 'Cafeteria' | 'Hostel Office' | 'Human Resources';

export type CheckState = 'Passed' | 'Pending' | 'Failed';

export type IdState = 'Verified' | 'Pending' | 'Failed';

export interface IdentityCheck {
  label: string;
  detail: string;
  state: CheckState;
}

export interface RequestDocument {
  name: string;
  meta: string;
}

export interface AppointmentRequest {
  id: string;
  visitor: string;
  /** "ViewPro Systems Ltd · TECH-VP-078". */
  reference: string;
  personType: string;
  contact: string;
  idProof: string;
  idNumber: string;

  appointmentType: AppointmentType;
  /** How many people are coming, and whether they need an escort. */
  partySize: number;
  escortRequired: boolean;

  host: string;
  hostRole: string;
  department: HostDepartment;
  extension: string;

  /** "31 Jul 2026" — the day of the slot. */
  visitDate: string;
  slotFrom: string;
  slotUntil: string;
  purpose: string;
  /** "Service SRV-2026-0424". */
  purposeDetail: string;

  /** "28 Jul 2026" — when the request came in. */
  requestedOn: string;
  requestedAt: string;

  /** Who took the decision; empty while the request is still waiting. */
  decidedBy: string;
  decidedOn: string;
  /** The decision itself; empty means the host has not answered. */
  decision: '' | 'approved' | 'rejected' | 'cancelled';
  /** Set when the slot was moved, which is what makes it Rescheduled. */
  movedFrom: string;

  passStatus: PassStatus;
  passNumber: string;
  gate: string;

  checks: IdentityCheck[];
  documents: RequestDocument[];
  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const typeBadge: Record<AppointmentType, string> = {
  'Parent Meeting': 'badge badge-soft-warning',
  'Admission Interview': 'badge badge-soft-primary',
  'Vendor Visit': 'badge badge-soft-purple',
  'Official Visit': 'badge badge-soft-info',
  'Campus Tour': 'badge badge-soft-success',
  'Staff Interview': 'badge badge-soft-secondary',
};

export const typeIcon: Record<AppointmentType, string> = {
  'Parent Meeting': 'ti ti-users',
  'Admission Interview': 'ti ti-school',
  'Vendor Visit': 'ti ti-package',
  'Official Visit': 'ti ti-building',
  'Campus Tour': 'ti ti-map-pin',
  'Staff Interview': 'ti ti-briefcase',
};

export const departmentBadge: Record<HostDepartment, string> = {
  'Admission Office': 'badge badge-soft-info',
  Administration: 'badge badge-soft-success',
  'Class Teacher': 'badge badge-soft-warning',
  'Estates Office': 'badge badge-soft-primary',
  Cafeteria: 'badge badge-soft-purple',
  'Hostel Office': 'badge badge-soft-danger',
  'Human Resources': 'badge badge-soft-secondary',
};

export const statusPill: Record<ApprovalStatus, string> = {
  'Pending Approval': 'is-review',
  Approved: 'is-active',
  Completed: 'is-completed',
  Rejected: 'is-blocked',
  Rescheduled: 'is-pending',
  Cancelled: 'is-suspended',
};

export const statusBadge: Record<ApprovalStatus, string> = {
  'Pending Approval': 'badge badge-soft-warning',
  Approved: 'badge badge-soft-success',
  Completed: 'badge badge-soft-secondary',
  Rejected: 'badge badge-soft-danger',
  Rescheduled: 'badge badge-soft-info',
  Cancelled: 'badge badge-soft-dark',
};

export const passBadge: Record<PassStatus, string> = {
  Issued: 'badge badge-soft-success',
  'Ready to Issue': 'badge badge-soft-info',
  'Draft Prepared': 'badge badge-soft-warning',
  'Not Issued': 'badge badge-soft-secondary',
  Returned: 'badge badge-soft-secondary',
  Blocked: 'badge badge-soft-danger',
};

export const idBadge: Record<IdState, string> = {
  Verified: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
};

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

export const departmentOptions: HostDepartment[] = [
  'Admission Office', 'Administration', 'Class Teacher',
  'Estates Office', 'Cafeteria', 'Hostel Office', 'Human Resources',
];

export const typeOptions: AppointmentType[] = [
  'Parent Meeting', 'Admission Interview', 'Vendor Visit',
  'Official Visit', 'Campus Tour', 'Staff Interview',
];

export const statusOptions: ApprovalStatus[] = [
  'Pending Approval', 'Approved', 'Completed', 'Rejected', 'Rescheduled', 'Cancelled',
];

export const passStatusOptions: PassStatus[] = [
  'Issued', 'Ready to Issue', 'Draft Prepared', 'Not Issued', 'Returned', 'Blocked',
];

export const requestedBetweenOptions = [
  'Last 7 days', 'Last 30 days', 'This term', 'Custom range',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const hostChoices = [
  'Mr. Alan Pierce · Estates Manager',
  'Ms. Dana Ruiz · Admission Counsellor',
  'Mrs. Alice Ray · Chief Warden',
  'Mrs. Ellen Cruz · Class Teacher',
  'Ms. Rosa Klein · Cafeteria Manager',
  'Mr. Ethan Brooks · Class Teacher',
];

export const personTypeOptions = [
  'Visitor', 'Guardian', 'Vendor', 'Contractor', 'Official', 'Candidate',
];

export const idProofOptions = [
  'National ID', 'Driving Licence', 'Company ID', 'Passport', 'Government Letter',
];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const decisionOptions = ['Approve', 'Hold', 'Reject'];

export const rejectReasonOptions = [
  'Outside visiting hours', 'Host unavailable', 'Identity checks failed',
  'Duplicate request', 'Not authorised',
];

export const rescheduleReasonOptions = [
  'Host unavailable', 'Visitor requested', 'Clash with another slot', 'Campus event',
];

export const escortOptions = ['Escort required', 'Escort not required'];

export const passZoneOptions = [
  'Main Block · all floors', 'Main Block · Admission Office',
  'Service corridor and stores', 'North Block only', 'Escorted · all blocks',
];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const notifyOptions = ['Email', 'SMS', 'Both'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/**
 * "2d 18h" once it runs past a day, "4h 00m" inside one and "50m" under an
 * hour — the three shapes the template uses.
 */
export const durationText = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const days = Math.floor(safe / 1440);
  const hours = Math.floor((safe % 1440) / 60);
  const mins = safe % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${String(mins).padStart(2, '0')}m`;
  return `${mins}m`;
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

/** Minutes from the register clock to a moment on a possibly different day. */
const minutesTo = (date: string, time: string): number =>
  daysBetween(REGISTER_DATE, date) * 1440 + minutesOf(time) - minutesOf(REGISTER_TIME);

/** The slot's own length. */
export const durationOf = (row: AppointmentRequest): number =>
  Math.max(0, minutesOf(row.slotUntil) - minutesOf(row.slotFrom));

export const minutesToStartOf = (row: AppointmentRequest): number =>
  minutesTo(row.visitDate, row.slotFrom);

export const minutesToEndOf = (row: AppointmentRequest): number =>
  minutesTo(row.visitDate, row.slotUntil);

/**
 * The pill the Approval Status column prints. A move outranks an approval, and
 * an approved request becomes Completed once its slot has run.
 */
export const statusOf = (row: AppointmentRequest): ApprovalStatus => {
  if (row.decision === 'rejected') return 'Rejected';
  if (row.decision === 'cancelled') return 'Cancelled';
  if (row.movedFrom) return 'Rescheduled';
  if (row.decision !== 'approved') return 'Pending Approval';
  return minutesToEndOf(row) < 0 ? 'Completed' : 'Approved';
};

/** "31 Jul 2026" plus the slot — the Visit Date & Time cell. */
export const slotLabelOf = (row: AppointmentRequest): string =>
  `${row.slotFrom} – ${row.slotUntil} · ${durationText(durationOf(row))}`;

/** The line under it. */
export const slotSubLabelOf = (row: AppointmentRequest): string => {
  if (row.decision === 'rejected') return 'Not admitted';
  if (row.decision === 'cancelled') return 'Slot released';
  const toStart = minutesToStartOf(row);
  if (toStart > 0) return `Starts in ${durationText(toStart)}`;
  const toEnd = minutesToEndOf(row);
  return toEnd >= 0 ? `Ends in ${durationText(toEnd)}` : `Ended ${durationText(-toEnd)} ago`;
};

export const slotTintOf = (row: AppointmentRequest): string => {
  if (row.decision === 'rejected' || row.decision === 'cancelled') return 'text-danger';
  if (minutesToStartOf(row) > 0) return 'text-info';
  return minutesToEndOf(row) >= 0 ? 'text-warning' : 'text-muted';
};

/** "3 days ago" past a day, "23h 10m ago" inside one. */
export const requestedAgoOf = (row: AppointmentRequest): string => {
  const since = -minutesTo(row.requestedOn, row.requestedAt);
  if (since < 0) return 'Just raised';
  if (since < 1440) return `${durationText(since)} ago`;
  const days = Math.floor(since / 1440);
  return `${days} ${days === 1 ? 'day' : 'days'} ago`;
};

/** "11:20 · 3 days ago". */
export const requestedSubLabelOf = (row: AppointmentRequest): string =>
  `${row.requestedAt} · ${requestedAgoOf(row)}`;

/** The line under the Approval Status pill. */
export const decisionLabelOf = (row: AppointmentRequest): string => {
  if (row.movedFrom) return `Moved from ${row.movedFrom}`;
  if (!row.decision) {
    const since = -minutesTo(row.requestedOn, row.requestedAt);
    const days = Math.floor(Math.max(0, since) / 1440);
    return days > 0 ? `Waiting ${days} ${days === 1 ? 'day' : 'days'}` : 'Waiting for a decision';
  }
  return `${row.decidedBy} · ${row.decidedOn}`;
};

/** The line under the Gate Pass Status badge. */
export const passLabelOf = (row: AppointmentRequest): string => {
  if (row.passNumber) return row.passNumber;
  if (row.passStatus === 'Draft Prepared') return 'Prints on approval';
  if (row.passStatus === 'Blocked') return 'No pass raised';
  return 'Raised on the visit day';
};

/* ------------------------------- The checks --------------------------------- */

export const passedCountOf = (row: AppointmentRequest): number =>
  row.checks.filter((check) => check.state === 'Passed').length;

export const failedCountOf = (row: AppointmentRequest): number =>
  row.checks.filter((check) => check.state === 'Failed').length;

export const pendingCountOf = (row: AppointmentRequest): number =>
  row.checks.filter((check) => check.state === 'Pending').length;

export const checkSummaryOf = (row: AppointmentRequest): string =>
  `${passedCountOf(row)} of ${row.checks.length} checks passed`;

export const idStateOf = (row: AppointmentRequest): IdState => {
  if (failedCountOf(row) > 0) return 'Failed';
  return pendingCountOf(row) > 0 ? 'Pending' : 'Verified';
};

/** "1 visitor · escort required". */
export const partyLabelOf = (row: AppointmentRequest): string =>
  `${row.partySize} ${row.partySize === 1 ? 'visitor' : 'visitors'} · escort ${row.escortRequired ? 'required' : 'not required'}`;

export interface Pair {
  label: string;
  value: string;
}

export const visitorPairsOf = (row: AppointmentRequest): Pair[] => [
  { label: 'Visitor', value: row.visitor },
  { label: 'Person Type', value: row.personType },
  { label: 'Reference', value: row.reference },
  { label: 'ID Proof', value: `${row.idProof} · ${row.idNumber}` },
  { label: 'Contact', value: row.contact },
];

export const appointmentPairsOf = (row: AppointmentRequest): Pair[] => [
  { label: 'Request ID', value: row.id },
  { label: 'Appointment Type', value: row.appointmentType },
  { label: 'Visit Date', value: row.visitDate },
  { label: 'Time Slot', value: `${row.slotFrom} – ${row.slotUntil}` },
  { label: 'Duration', value: durationText(durationOf(row)) },
];

export const hostPairsOf = (row: AppointmentRequest): Pair[] => [
  { label: 'Host', value: row.host },
  { label: 'Role', value: row.hostRole },
  { label: 'Department', value: row.department },
  { label: 'Extension', value: row.extension },
  { label: 'Purpose', value: row.purpose },
];

export const passPairsOf = (row: AppointmentRequest): Pair[] => [
  { label: 'Pass Status', value: row.passStatus },
  { label: 'Pass Number', value: row.passNumber || 'Not issued' },
  { label: 'Gate', value: row.gate },
  { label: 'Party Size', value: `${row.partySize} ${row.partySize === 1 ? 'person' : 'people'}` },
  { label: 'Escort', value: row.escortRequired ? 'Required' : 'Not required' },
];

/** The View dialog's decision block. */
export const decisionPairsOf = (row: AppointmentRequest): Pair[] => [
  { label: 'Requested On', value: `${row.requestedOn} · ${row.requestedAt}` },
  { label: 'Status', value: statusOf(row) },
  { label: 'Decided By', value: row.decidedBy || 'Awaiting a decision' },
  { label: 'Decided On', value: row.decidedOn || DASH },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The approval trail. Every line follows from the request stamp, the decision
 * and the slot, so approving or moving a request redraws it.
 */
export const timelineOf = (row: AppointmentRequest): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-calendar-plus', tint: 'primary',
      title: 'Request raised', meta: `${row.requestedAt} · ${row.requestedOn}`,
    },
  ];
  if (row.movedFrom) {
    entries.push({
      icon: 'ti ti-calendar-time', tint: 'info',
      title: `Slot moved from ${row.movedFrom}`, meta: `${row.decidedOn} · ${row.decidedBy}`,
    });
  }
  if (row.decision === 'rejected') {
    entries.push({
      icon: 'ti ti-circle-x', tint: 'danger',
      title: 'Request rejected', meta: `${row.decidedOn} · ${row.decidedBy}`,
    });
    return entries;
  }
  if (row.decision === 'cancelled') {
    entries.push({
      icon: 'ti ti-ban', tint: 'danger',
      title: 'Request cancelled', meta: `${row.decidedOn} · ${row.decidedBy}`,
    });
    return entries;
  }
  if (!row.decision) {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Awaiting the host decision', meta: requestedAgoOf(row).replace(' ago', ' in the queue'),
    });
    return entries;
  }
  entries.push({
    icon: 'ti ti-circle-check', tint: 'success',
    title: 'Approved by the host', meta: `${row.decidedOn} · ${row.decidedBy}`,
  });
  if (minutesToEndOf(row) < 0) {
    entries.push({
      icon: 'ti ti-checks', tint: 'success',
      title: 'Visit completed',
      meta: row.passNumber ? `Pass ${row.passNumber} · ${row.visitDate}` : row.visitDate,
    });
  } else if (minutesToStartOf(row) <= 0) {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Visit in progress', meta: `Ends in ${durationText(minutesToEndOf(row))}`,
    });
  } else {
    entries.push({
      icon: 'ti ti-calendar-event', tint: 'info',
      title: 'Visit scheduled', meta: `${row.visitDate} · ${row.slotFrom}`,
    });
  }
  return entries;
};

/** The panel's audit trail, built from the same stamps. */
export const auditOf = (row: AppointmentRequest): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Request record created', meta: `${row.requestedAt} · ${row.requestedOn}`,
  },
  {
    icon: 'ti ti-shield-check',
    tint: idStateOf(row) === 'Failed' ? 'danger' : idStateOf(row) === 'Pending' ? 'warning' : 'success',
    title: `Identity checks ${idStateOf(row).toLowerCase()}`, meta: checkSummaryOf(row),
  },
  {
    icon: 'ti ti-checks',
    tint: statusOf(row) === 'Rejected' || statusOf(row) === 'Cancelled' ? 'danger' : 'success',
    title: `Decision recorded · ${statusOf(row)}`,
    meta: row.decidedBy ? `${row.decidedOn} · ${row.decidedBy}` : `${REGISTER_TIME} · awaiting the host`,
  },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: AppointmentRequest): string =>
  [
    row.id, row.visitor, row.reference, row.appointmentType, row.host, row.hostRole,
    row.department, row.purpose, row.purposeDetail, row.passNumber, row.gate,
    statusOf(row), row.passStatus,
  ]
    .join(' ')
    .toLowerCase();

/** The window the Requested Between select stands for, in days back from today. */
export const matchesRequestedBetween = (row: AppointmentRequest, band: string): boolean => {
  const daysBack = daysBetween(row.requestedOn, REGISTER_DATE);
  switch (band) {
    case 'Last 7 days': return daysBack <= 7;
    case 'Last 30 days': return daysBack <= 30;
    case 'This term': return daysBack <= 120;
    default: return true;
  }
};

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole term — 146 requests against the eight this page
 * lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  total: 146,
  pending: 18,
  approved: 104,
  approvedShare: 71,
  rejected: 11,
  rejectedBreakdown: '8 rescheduled, 5 cancelled',
  today: 24,
};

export const VIEW_TOTALS = {
  all: 146,
  pending: 18,
  today: 24,
  noPass: 31,
  rejected: 11,
};

export const QUICK_TOTALS = {
  all: 146,
  pending: 18,
  approved: 104,
  rescheduled: 8,
  rejected: 11,
  today: 24,
};

/** The template's one committed chip is the request window it opens on. */
export const REQUESTED_FROM = '25-07-2026';
export const REQUESTED_TO = '07-08-2026';
export const VISIT_DATE = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const appointments: AppointmentRequest[] = [
  {
    id: 'APT-2026-0718', visitor: 'Ms. Hannah Lee',
    reference: 'ViewPro Systems Ltd · TECH-VP-078', personType: 'Contractor',
    contact: '+1 55 2214 8890', idProof: 'Company ID', idNumber: 'VP-078••••12',
    appointmentType: 'Vendor Visit', partySize: 1, escortRequired: true,
    host: 'Mr. Alan Pierce', hostRole: 'Estates Manager', department: 'Estates Office',
    extension: 'Ext. 214 · +1 55 2214 0100',
    visitDate: '31 Jul 2026', slotFrom: '09:00', slotUntil: '13:00',
    purpose: 'Smart board calibration', purposeDetail: 'Service SRV-2026-0424',
    requestedOn: '28 Jul 2026', requestedAt: '11:20',
    decidedBy: 'Mr. Alan Pierce', decidedOn: '28 Jul 2026', decision: 'approved', movedFrom: '',
    passStatus: 'Returned', passNumber: 'VP-2026-0841', gate: 'Main Gate',
    checks: [
      { label: 'Company ID card', detail: 'Checked against the vendor register', state: 'Passed' },
      { label: 'Vendor agreement', detail: 'SUP-2022-014 · valid to 31 Mar 2027', state: 'Passed' },
      { label: 'Tool case declaration', detail: 'Screened at the reception desk', state: 'Passed' },
    ],
    documents: [
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0424 · 74 KB' },
      { name: 'Visitor Pass VP-2026-0841.pdf', meta: 'Issued 09:10 · returned 12:35 · 42 KB' },
    ],
    notes: 'Recurring quarterly service call. Vendor is on the approved access list, so only the tool case needs screening.',
  },
  {
    id: 'APT-2026-0724', visitor: 'Mrs. Janet Gourley',
    reference: 'Guardian of Lisa Gourley · II B', personType: 'Guardian',
    contact: '+1 55 7712 4409', idProof: 'Driving Licence', idNumber: 'DL-44••••71',
    appointmentType: 'Parent Meeting', partySize: 1, escortRequired: false,
    host: 'Mrs. Ellen Cruz', hostRole: 'Class Teacher · II B', department: 'Class Teacher',
    extension: 'Ext. 118 · +1 55 2214 0118',
    visitDate: '31 Jul 2026', slotFrom: '10:30', slotUntil: '11:30',
    purpose: 'Term progress review', purposeDetail: 'Early collection requested',
    requestedOn: '29 Jul 2026', requestedAt: '09:45',
    decidedBy: 'Mrs. Ellen Cruz', decidedOn: '29 Jul 2026', decision: 'approved', movedFrom: '',
    passStatus: 'Returned', passNumber: 'VP-2026-0847', gate: 'Main Gate',
    checks: [
      { label: 'Driving licence', detail: 'Checked and photographed at the desk', state: 'Passed' },
      { label: 'Guardian record match', detail: 'Student AD9892431', state: 'Passed' },
      { label: 'Vehicle registration', detail: 'KA-05-MJ-2218 logged at the barrier', state: 'Passed' },
    ],
    documents: [
      { name: 'Early Exit Authorisation.pdf', meta: 'Signed by the class teacher · 56 KB' },
      { name: 'Visitor Pass VP-2026-0847.pdf', meta: 'Issued 10:25 · returned 11:25 · 40 KB' },
    ],
    notes: 'Collected Lisa Gourley on the same visit and returned the loaned Chromebook to the library desk.',
  },
  {
    id: 'APT-2026-0731', visitor: 'Mr. Dinesh Varma',
    reference: 'FreshLine Foods · SUP-2023-008', personType: 'Vendor',
    contact: '+1 55 9925 4417', idProof: 'Company ID', idNumber: 'FL-221••••08',
    appointmentType: 'Vendor Visit', partySize: 2, escortRequired: false,
    host: 'Ms. Rosa Klein', hostRole: 'Cafeteria Manager', department: 'Cafeteria',
    extension: 'Ext. 340 · +1 55 2214 0340',
    visitDate: '31 Jul 2026', slotFrom: '14:15', slotUntil: '16:15',
    purpose: 'Weekly kitchen replenishment', purposeDetail: 'Order PO-2026-0219',
    requestedOn: '30 Jul 2026', requestedAt: '16:30',
    decidedBy: 'Ms. Rosa Klein', decidedOn: '30 Jul 2026', decision: 'approved', movedFrom: '',
    passStatus: 'Issued', passNumber: 'VP-2026-0859', gate: 'Service Gate',
    checks: [
      { label: 'Company ID card', detail: 'Checked against the supplier register', state: 'Passed' },
      { label: 'Delivery challan', detail: 'Matched against the open order', state: 'Passed' },
      { label: 'Vehicle inspection', detail: 'TN-09-DL-3312 at the service barrier', state: 'Passed' },
    ],
    documents: [
      { name: 'Delivery Challan.pdf', meta: 'FreshLine Foods · 68 KB' },
      { name: 'Visitor Pass VP-2026-0859.pdf', meta: 'Issued 14:15 · active · 41 KB' },
    ],
    notes: 'Access is limited to the service corridor and the dry store. Goods inward note is due before the window closes.',
  },
  {
    id: 'APT-2026-0742', visitor: 'Ms. Beatriz Alonso',
    reference: 'Prospective parent · Grade VI enquiry', personType: 'Guardian',
    contact: '+1 55 3372 9908', idProof: 'National ID', idNumber: 'NID-52••••19',
    appointmentType: 'Admission Interview', partySize: 2, escortRequired: true,
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    extension: 'Ext. 102 · +1 55 2214 0102',
    visitDate: '31 Jul 2026', slotFrom: '16:30', slotUntil: '18:30',
    purpose: 'Grade VI intake interview', purposeDetail: 'Booking ADM-2026-0742',
    requestedOn: '28 Jul 2026', requestedAt: '10:15',
    decidedBy: '', decidedOn: '', decision: '', movedFrom: '',
    passStatus: 'Draft Prepared', passNumber: '', gate: 'Main Gate',
    checks: [
      { label: 'National ID', detail: 'NID-52••••19 checked and photographed', state: 'Passed' },
      { label: 'Appointment booking reference', detail: 'ADM-2026-0742', state: 'Passed' },
      { label: 'Host confirmation', detail: 'Awaiting the admission counsellor', state: 'Pending' },
    ],
    documents: [
      { name: 'Appointment Booking.pdf', meta: 'Raised 28 Jul 2026 · 46 KB' },
    ],
    notes: 'Identity checks are complete. The gate pass is drafted and prints as soon as the counsellor confirms the 16:30 slot.',
  },
  {
    id: 'APT-2026-0746', visitor: 'Ms. Priya Sundaram',
    reference: 'District Education Office · Inspector', personType: 'Official',
    contact: '+1 55 8801 3344', idProof: 'Government Letter', idNumber: 'DEO-2026••••11',
    appointmentType: 'Official Visit', partySize: 3, escortRequired: true,
    host: 'Mrs. Alice Ray', hostRole: 'Chief Warden · Administration', department: 'Administration',
    extension: 'Ext. 101 · +1 55 2214 0101',
    visitDate: '3 Aug 2026', slotFrom: '10:00', slotUntil: '13:00',
    purpose: 'Annual safety inspection', purposeDetail: 'Notice DEO-2026-118',
    requestedOn: '27 Jul 2026', requestedAt: '15:10',
    decidedBy: 'Mrs. Alice Ray', decidedOn: '27 Jul 2026', decision: 'approved', movedFrom: '',
    passStatus: 'Ready to Issue', passNumber: 'VP-2026-0912', gate: 'Main Gate',
    checks: [
      { label: 'Government letter', detail: 'DEO-2026-118 verified with the district office', state: 'Passed' },
      { label: 'Officer identity list', detail: 'Three names confirmed in advance', state: 'Passed' },
      { label: 'Inspection notice', detail: 'Filed with the principal office', state: 'Passed' },
    ],
    documents: [
      { name: 'Inspection Order.pdf', meta: 'District Education Office · 102 KB' },
      { name: 'Officer List.pdf', meta: 'Three names · 38 KB' },
    ],
    notes: 'Three officers expected. Passes are pre-printed and held at the reception desk for collection on the day.',
  },
  {
    id: 'APT-2026-0709', visitor: 'Mr. Rajesh Kumar',
    reference: 'Guardian of Aarav Kumar · VII A', personType: 'Guardian',
    contact: '+1 55 4176 2280', idProof: 'National ID', idNumber: 'NID-88••••42',
    appointmentType: 'Parent Meeting', partySize: 1, escortRequired: false,
    host: 'Mr. Ethan Brooks', hostRole: 'Class Teacher · VII A', department: 'Class Teacher',
    extension: 'Ext. 126 · +1 55 2214 0126',
    visitDate: '4 Aug 2026', slotFrom: '11:00', slotUntil: '11:45',
    purpose: 'Discuss half yearly results', purposeDetail: 'Follow up on term feedback',
    requestedOn: '26 Jul 2026', requestedAt: '13:25',
    decidedBy: 'Mr. Ethan Brooks', decidedOn: '29 Jul 2026', decision: 'approved',
    movedFrom: '30 Jul 2026',
    passStatus: 'Not Issued', passNumber: '', gate: 'Main Gate',
    checks: [
      { label: 'National ID', detail: 'NID-88••••42 on the guardian record', state: 'Passed' },
      { label: 'Guardian record match', detail: 'Student AD9891844', state: 'Passed' },
      { label: 'Photograph on arrival', detail: 'To be captured at the desk', state: 'Pending' },
    ],
    documents: [
      { name: 'Reschedule Notice.pdf', meta: 'Sent 29 Jul 2026 · 32 KB' },
    ],
    notes: 'Moved from 30 Jul because the class teacher was on an away fixture. The pass is raised on the visit day.',
  },
  {
    id: 'APT-2026-0737', visitor: 'Mr. Owen Blake',
    reference: 'Walk in request · Everest Hostel', personType: 'Visitor',
    contact: '+1 55 3341 7726', idProof: 'National ID', idNumber: 'NID-31••••90',
    appointmentType: 'Campus Tour', partySize: 1, escortRequired: true,
    host: 'Not confirmed', hostRole: 'No warden approval on record', department: 'Hostel Office',
    extension: 'Ext. 402 · +1 55 2214 0402',
    visitDate: '31 Jul 2026', slotFrom: '14:00', slotUntil: '16:00',
    purpose: 'Unscheduled hostel visit', purposeDetail: 'Outside the 16:00 to 18:00 window',
    requestedOn: '31 Jul 2026', requestedAt: '13:40',
    decidedBy: 'Mrs. Alice Ray', decidedOn: '31 Jul 2026', decision: 'rejected', movedFrom: '',
    passStatus: 'Blocked', passNumber: '', gate: 'Hostel Gate',
    checks: [
      { label: 'National ID', detail: 'NID-31••••90 checked at the barrier', state: 'Passed' },
      { label: 'Hostel visiting window', detail: 'Visit falls outside 16:00 to 18:00', state: 'Failed' },
      { label: 'Warden approval', detail: 'Not found on the visitor register', state: 'Failed' },
    ],
    documents: [
      { name: 'Access Denial Report.pdf', meta: 'Raised 14:05 · 52 KB' },
    ],
    notes: 'Rejected before any pass was raised. Advised to book through the hostel office inside visiting hours.',
  },
  {
    id: 'APT-2026-0715', visitor: 'Mr. Victor Hale',
    reference: 'Candidate · teaching post', personType: 'Candidate',
    contact: '+1 55 6620 1187', idProof: 'National ID', idNumber: 'NID-77••••34',
    appointmentType: 'Staff Interview', partySize: 1, escortRequired: false,
    host: 'Mrs. Alice Ray', hostRole: 'Chief Warden · Administration', department: 'Human Resources',
    extension: 'Ext. 155 · +1 55 2214 0155',
    visitDate: '31 Jul 2026', slotFrom: '11:00', slotUntil: '12:00',
    purpose: 'Teaching post interview', purposeDetail: 'Vacancy HR-2026-0044',
    requestedOn: '27 Jul 2026', requestedAt: '09:05',
    decidedBy: 'Mrs. Alice Ray', decidedOn: '27 Jul 2026', decision: 'cancelled', movedFrom: '',
    passStatus: 'Blocked', passNumber: '', gate: 'Main Gate',
    checks: [
      { label: 'National ID', detail: 'NID-77••••34 on the application', state: 'Passed' },
      { label: 'Application reference', detail: 'HR-2026-0044 verified', state: 'Passed' },
      { label: 'Attendance at the slot', detail: 'Candidate withdrew before the interview', state: 'Failed' },
    ],
    documents: [
      { name: 'Cancellation Note.pdf', meta: 'Raised 08:00 · 30 KB' },
    ],
    notes: 'Cancelled by the candidate three hours before the slot. Walked in later the same day on a separate admission enquiry.',
  },
];
