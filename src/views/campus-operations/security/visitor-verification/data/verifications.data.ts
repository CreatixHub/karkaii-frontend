export type VisitorType = 'Visitor' | 'Guardian' | 'Vendor' | 'Contractor' | 'Official';

export type IdState = 'Verified' | 'Pending' | 'Failed' | 'Not Submitted';

export type Approval = 'Approved' | 'Auto-Approved' | 'Pending Host' | 'Rejected';

export type GateState =
  | 'Checked In' | 'Checked Out' | 'Awaiting Arrival' | 'Pass Expired' | 'Not Authorized';

export type CheckState = 'Passed' | 'Pending' | 'Failed';

export type HostDepartment =
  | 'Estates Office' | 'Admission Office' | 'Administration'
  | 'Class Teacher' | 'Cafeteria' | 'Store Office' | 'Hostel Office';

export interface IdentityCheck {
  label: string;
  detail: string;
  state: CheckState;
}

export interface VerificationDocument {
  name: string;
  meta: string;
}

export interface Verification {
  id: string;
  name: string;
  icon: string;
  tint: string;
  /** "ViewPro Systems Ltd · TECH-VP-078". */
  reference: string;
  visitorType: VisitorType;
  contact: string;
  email: string;

  host: string;
  hostRole: string;
  department: HostDepartment;
  gate: string;
  /** "Reception desk · Lane 1". */
  lane: string;
  gateOfficer: string;

  purpose: string;
  /** "SRV-2026-0424 · Room 204". */
  detail: string;
  /** Empty on a walk-in, which is what "No appointment" means. */
  appointmentTime: string;
  /** Empty when the slot is today; "12 Aug 2026" for a later booking. */
  appointmentDate: string;
  /** Empty until the visitor turns up. */
  arrival: string;
  /** Empty until they leave. */
  departure: string;

  checks: IdentityCheck[];
  /** The host's own answer; a failed check overrules it. */
  approval: Approval;

  /** Empty when no pass has been issued. */
  passNumber: string;
  passFrom: string;
  passUntil: string;
  gateRegister: string;
  /** "Standard · escorted" / "Not granted". */
  clearance: string;
  /** "Tool case screened at the desk". */
  screening: string;

  documents: VerificationDocument[];
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
  'Store Office': 'badge badge-soft-purple',
  'Hostel Office': 'badge badge-soft-danger',
};

export const idBadge: Record<IdState, string> = {
  Verified: 'badge badge-soft-success',
  Pending: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
  'Not Submitted': 'badge badge-soft-secondary',
};

/** The security-notes chip, which names the state rather than repeating it. */
export const idChip: Record<IdState, string> = {
  Verified: 'ID Verified',
  Pending: 'ID Pending',
  Failed: 'ID Failed',
  'Not Submitted': 'ID Not Submitted',
};

export const approvalPill: Record<Approval, string> = {
  Approved: 'is-active',
  'Auto-Approved': 'is-review',
  'Pending Host': 'is-pending',
  Rejected: 'is-suspended',
};

export const approvalBadge: Record<Approval, string> = {
  Approved: 'badge badge-soft-success',
  'Auto-Approved': 'badge badge-soft-info',
  'Pending Host': 'badge badge-soft-warning',
  Rejected: 'badge badge-soft-danger',
};

export const gateBadge: Record<GateState, string> = {
  'Checked In': 'badge badge-soft-success',
  'Checked Out': 'badge badge-soft-secondary',
  'Awaiting Arrival': 'badge badge-soft-info',
  'Pass Expired': 'badge badge-soft-warning',
  'Not Authorized': 'badge badge-soft-danger',
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

export const idStateOptions: IdState[] = ['Verified', 'Pending', 'Failed', 'Not Submitted'];

export const purposeOptions = [
  'Guardian meeting', 'Admission enquiry', 'Admission interview',
  'Kitchen delivery', 'Stationery delivery', 'Service visit',
];

export const departmentOptions: HostDepartment[] = [
  'Estates Office', 'Admission Office', 'Administration',
  'Class Teacher', 'Cafeteria', 'Store Office', 'Hostel Office',
];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const approvalOptions: Approval[] = [
  'Approved', 'Auto-Approved', 'Pending Host', 'Rejected',
];

export const visitorTypeOptions: VisitorType[] = [
  'Visitor', 'Guardian', 'Vendor', 'Contractor', 'Official',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const methodOptions = ['ID Proof', 'QR Invite', 'Biometric', 'Manual'];

export const idProofOptions = [
  'National ID', 'Driving Licence', 'Company ID', 'Passport', 'Government Letter',
];

export const hostChoices = [
  'Mr. Alan Pierce · Estates Manager',
  'Ms. Dana Ruiz · Admission Counsellor',
  'Mrs. Alice Ray · Chief Warden',
  'Mrs. Ellen Cruz · Class Teacher',
  'Ms. Rosa Klein · Cafeteria Manager',
];

export const decisionOptions = ['Approve', 'Hold', 'Reject'];

export const confirmationOptions = [
  'Telephone', 'Email reply', 'In person at the desk', 'Booking system',
];

export const clearanceOptions = [
  'Standard · escorted', 'Restricted · single area', 'Unescorted · approved list',
];

export const passTypeOptions = ['Standard', 'Escorted', 'Vehicle', 'Full Day'];

export const zoneOptions = [
  'North block only', 'Main block only', 'Admission office only', 'Escorted · all blocks',
];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const checkCompletionOptions = ['ID and Photo', 'ID Only', 'Waived'];

export const validityOptions = ['1 hour', '2 hours', '4 hours', 'Full day'];

export const escortOptions = ['Escort required', 'Escort not required'];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 16880 → "11d 17h 20m"; 85 → "1h 25m"; 50 → "50m". */
export const durationLabel = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const days = Math.floor(safe / 1440);
  const hours = Math.floor((safe % 1440) / 60);
  const mins = safe % 60;
  if (days > 0) return `${days}d ${hours}h ${String(mins).padStart(2, '0')}m`;
  if (hours > 0) return `${hours}h ${String(mins).padStart(2, '0')}m`;
  return `${mins}m`;
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

const dayNumber = (value: string): number => {
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

/* ------------------------------- The checks --------------------------------- */

export const passedCountOf = (row: Verification): number =>
  row.checks.filter((check) => check.state === 'Passed').length;

export const failedCountOf = (row: Verification): number =>
  row.checks.filter((check) => check.state === 'Failed').length;

export const pendingCountOf = (row: Verification): number =>
  row.checks.filter((check) => check.state === 'Pending').length;

/** "3 of 3 checks passed". */
export const checkSummaryOf = (row: Verification): string =>
  `${passedCountOf(row)} of ${row.checks.length} checks passed`;

/** The badge in the ID Verification column, read off the list. */
export const idStateOf = (row: Verification): IdState => {
  if (row.checks.length === 0) return 'Not Submitted';
  if (failedCountOf(row) > 0) return 'Failed';
  return pendingCountOf(row) > 0 ? 'Pending' : 'Verified';
};

/** A failed check overrules the host — the gate cannot let that visitor in. */
export const approvalOf = (row: Verification): Approval =>
  failedCountOf(row) > 0 ? 'Rejected' : row.approval;

/* ---------------------------- The appointment ------------------------------- */

/** Minutes from the register clock to a slot that may fall on a later day. */
export const minutesUntilSlot = (row: Verification): number => {
  if (!row.appointmentTime) return 0;
  const dayOffset = row.appointmentDate
    ? daysBetween(REGISTER_DATE, row.appointmentDate) * 1440
    : 0;
  return dayOffset + minutesOf(row.appointmentTime) - minutesOf(REGISTER_TIME);
};

/** Positive is early, negative is late — the slot less the arrival. */
export const arrivalVarianceOf = (row: Verification): number => {
  if (!row.arrival || !row.appointmentTime) return 0;
  return minutesOf(row.appointmentTime) - minutesOf(row.arrival);
};

/** What the Appointment Time cell itself shows. */
export const appointmentLabelOf = (row: Verification): string => {
  if (!row.appointmentTime) return 'Walk in';
  return row.appointmentDate
    ? `${row.appointmentDate.split(' ').slice(0, 2).join(' ')} ${row.appointmentTime}`
    : row.appointmentTime;
};

/** The line under it. */
export const appointmentSubLabelOf = (row: Verification): string => {
  if (!row.appointmentTime) return 'No appointment';
  if (row.arrival) {
    const variance = arrivalVarianceOf(row);
    if (variance === 0) return 'Arrived on time';
    return variance > 0
      ? `Arrived ${durationLabel(variance)} early`
      : `Arrived ${durationLabel(-variance)} late`;
  }
  const until = minutesUntilSlot(row);
  if (until < 0) {
    return approvalOf(row) === 'Rejected'
      ? `${durationLabel(-until)} ago · refused`
      : `${durationLabel(-until)} ago · no arrival`;
  }
  return `In ${durationLabel(until)}`;
};

export const appointmentTintOf = (row: Verification): string => {
  if (!row.appointmentTime) return 'text-muted';
  if (row.arrival) return arrivalVarianceOf(row) < 0 ? 'text-warning' : 'text-success';
  return minutesUntilSlot(row) < 0 ? 'text-danger' : 'text-muted';
};

/* ------------------------------- The gate ----------------------------------- */

/** How long the visitor has been inside, or was inside. */
export const onSiteOf = (row: Verification): number => {
  if (!row.arrival) return 0;
  return Math.max(0, minutesOf(row.departure || REGISTER_TIME) - minutesOf(row.arrival));
};

/** How far past the pass window an open visit has run. */
export const overstayOf = (row: Verification): number => {
  if (row.departure || !row.arrival || !row.passUntil) return 0;
  return Math.max(0, minutesOf(REGISTER_TIME) - minutesOf(row.passUntil));
};

export const gateStateOf = (row: Verification): GateState => {
  if (approvalOf(row) === 'Rejected') return 'Not Authorized';
  if (!row.arrival) return 'Awaiting Arrival';
  if (row.departure) return 'Checked Out';
  return overstayOf(row) > 0 ? 'Pass Expired' : 'Checked In';
};

/** The line under the Gate Status badge. */
export const gateLabelOf = (row: Verification): string => {
  const state = gateStateOf(row);
  if (state === 'Not Authorized') return 'Entry refused at the gate';
  if (state === 'Awaiting Arrival') return `${row.gate} · pass on arrival`;
  if (state === 'Checked Out') {
    return `${row.arrival} – ${row.departure} · ${durationLabel(onSiteOf(row))}`;
  }
  if (state === 'Pass Expired') {
    return `Pass ended ${row.passUntil} · over by ${durationLabel(overstayOf(row))}`;
  }
  return `${row.arrival} · on site ${durationLabel(onSiteOf(row))}`;
};

/** The pass's own state, which the panel prints. */
export const passStateOf = (row: Verification): string => {
  if (!row.passNumber) return approvalOf(row) === 'Rejected' ? 'Refused' : 'Not issued';
  if (row.departure) return 'Returned';
  return overstayOf(row) > 0 ? 'Expired' : 'Active';
};

export interface Pair {
  label: string;
  value: string;
}

export const profilePairsOf = (row: Verification): Pair[] => [
  { label: 'Verification ID', value: row.id },
  { label: 'Visitor Type', value: row.visitorType },
  { label: 'Reference', value: row.reference },
  { label: 'Contact', value: row.contact },
  { label: 'Email', value: row.email },
];

export const hostPairsOf = (row: Verification): Pair[] => [
  { label: 'Host', value: row.host },
  { label: 'Role', value: row.hostRole },
  { label: 'Department', value: row.department },
  { label: 'Gate', value: `${row.gate} · ${row.lane}` },
  { label: 'Gate Officer', value: row.gateOfficer || 'Not assigned' },
];

export const appointmentPairsOf = (row: Verification): Pair[] => [
  { label: 'Visit Purpose', value: row.purpose },
  { label: 'Detail', value: row.detail },
  { label: 'Appointment', value: row.appointmentTime ? appointmentLabelOf(row) : 'Walk in · none' },
  { label: 'Arrival', value: row.arrival || 'Not arrived' },
  { label: 'Departure', value: row.departure || 'Not recorded' },
];

export const passPairsOf = (row: Verification): Pair[] => [
  { label: 'Pass Number', value: row.passNumber },
  { label: 'Issued At', value: row.passFrom },
  { label: 'Valid Until', value: row.passUntil },
  { label: 'Gate Register', value: row.gateRegister },
  { label: 'Pass State', value: passStateOf(row) },
];

/** The panel's own verification block. */
export const panelVerificationPairsOf = (row: Verification): Pair[] => [
  { label: 'Identity', value: `${idStateOf(row)} · ${checkSummaryOf(row)}` },
  { label: 'Approval', value: approvalOf(row) },
  { label: 'Clearance', value: row.clearance },
  { label: 'Screening', value: row.screening },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The verification trail. Every line follows from the checks, the host's answer
 * and the pass, so completing a check or issuing a pass redraws it.
 */
export const timelineOf = (row: Verification): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-file-text', tint: 'info',
      title: 'Verification request raised',
      meta: row.appointmentTime
        ? `${appointmentLabelOf(row)} · ${row.department}`
        : 'Walk in · raised at the gate',
    },
  ];
  const failed = failedCountOf(row);
  const pending = pendingCountOf(row);
  if (failed > 0) {
    entries.push({
      icon: 'ti ti-circle-x', tint: 'danger',
      title: 'Identity verification failed', meta: `${failed} check(s) failed`,
    });
  } else if (pending > 0) {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Identity checks outstanding', meta: `${pending} check(s) awaiting completion`,
    });
  } else {
    entries.push({
      icon: 'ti ti-id', tint: 'success',
      title: 'Identity documents verified', meta: checkSummaryOf(row),
    });
  }

  const approval = approvalOf(row);
  if (approval === 'Rejected') {
    entries.push({
      icon: 'ti ti-shield-x', tint: 'danger',
      title: 'Access request rejected',
      meta: `${row.gateOfficer || 'Security desk'} · ${row.gate}`,
    });
    return entries;
  }
  if (approval === 'Pending Host') {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Awaiting host confirmation', meta: `${row.host} · ${row.hostRole}`,
    });
  } else if (approval === 'Auto-Approved') {
    entries.push({
      icon: 'ti ti-shield-check', tint: 'info',
      title: 'Auto approved at the desk', meta: 'Walk in enquiry rule · 1 hour pass',
    });
  } else {
    entries.push({
      icon: 'ti ti-circle-check', tint: 'success',
      title: `Host confirmed by ${row.host}`, meta: `${row.hostRole} · ${row.department}`,
    });
  }

  if (row.passNumber) {
    entries.push({
      icon: 'ti ti-ticket', tint: 'primary',
      title: `Visitor pass ${row.passNumber} issued`,
      meta: `${row.passFrom} · valid to ${row.passUntil}`,
    });
  }
  if (row.departure) {
    entries.push({
      icon: 'ti ti-door-exit', tint: 'info',
      title: 'Checked out and pass returned',
      meta: `${row.departure} · on site ${durationLabel(onSiteOf(row))}`,
    });
  }
  return entries;
};

/** The panel's audit trail, built from the same facts. */
export const auditOf = (row: Verification): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Verification record created',
    meta: row.appointmentTime ? `${appointmentLabelOf(row)} · ${row.department}` : `${row.gate} · walk in`,
  },
  {
    icon: 'ti ti-edit', tint: failedCountOf(row) > 0 ? 'danger' : pendingCountOf(row) > 0 ? 'warning' : 'info',
    title: failedCountOf(row) > 0 ? 'Identity checks failed'
      : pendingCountOf(row) > 0 ? 'Identity checks pending' : 'Identity checks verified',
    meta: checkSummaryOf(row),
  },
  {
    icon: 'ti ti-checks', tint: approvalOf(row) === 'Rejected' ? 'danger' : 'success',
    title: `Decision recorded · ${approvalOf(row)}`,
    meta: `${row.gateOfficer || 'Not assigned'} · ${row.gate}`,
  },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: Verification): string =>
  [
    row.id, row.name, row.reference, row.visitorType, row.host, row.hostRole, row.department,
    row.purpose, row.detail, row.gate, row.passNumber, row.gateRegister,
    idStateOf(row), approvalOf(row), gateStateOf(row),
  ]
    .join(' ')
    .toLowerCase();

/** The date this record belongs to — the appointment day, or today. */
export const recordDateOf = (row: Verification): string =>
  row.appointmentDate || REGISTER_DATE;

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole register — 75 records against the eight this page
 * lists — so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  pending: 9,
  verified: 62,
  rejected: 4,
  inside: 34,
  appointments: 41,
};

export const VIEW_TOTALS = {
  all: 75,
  pending: 9,
  rejected: 4,
  appointments: 41,
  inside: 34,
};

/** The template's one committed chip is the date; the window runs to 12 Aug. */
export const REGISTER_FROM = '31-07-2026';
export const REGISTER_TO = '12-08-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const verifications: Verification[] = [
  {
    id: 'VVR-2026-0611', name: 'Ms. Hannah Lee', icon: 'ti ti-tool', tint: 'secondary',
    reference: 'ViewPro Systems Ltd · TECH-VP-078', visitorType: 'Contractor',
    contact: '+1 55 2214 8890', email: 'h.lee@viewprosystems.example',
    host: 'Mr. Alan Pierce', hostRole: 'Estates Manager', department: 'Estates Office',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: 'Mr. Samuel Roy · SEC-014',
    purpose: 'Smart board calibration', detail: 'SRV-2026-0424 · Room 204',
    appointmentTime: '09:00', appointmentDate: '', arrival: '09:10', departure: '12:35',
    checks: [
      { label: 'Company ID', detail: 'VP-078••••12', state: 'Passed' },
      { label: 'Photograph captured at the desk', detail: 'CAM-MG-02 · 09:10', state: 'Passed' },
      { label: 'Vendor register cross check', detail: 'Approved vendor list', state: 'Passed' },
    ],
    approval: 'Approved',
    passNumber: 'VP-2026-0841', passFrom: '09:10', passUntil: '13:10',
    gateRegister: 'GT-2026-0841', clearance: 'Standard · escorted',
    screening: 'Tool case screened at the desk',
    documents: [
      { name: 'Visitor Pass VP-2026-0841.pdf', meta: 'Issued 09:10 · returned 12:35 · 42 KB' },
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0424 · 74 KB' },
    ],
    notes: 'Regular vendor on the approved list. Host confirmed the appointment by phone before the pass was issued.',
  },
  {
    id: 'VVR-2026-0617', name: 'Mrs. Janet Gourley', icon: 'ti ti-users', tint: 'warning',
    reference: 'Guardian of Lisa Gourley · II B', visitorType: 'Guardian',
    contact: '+1 55 7712 4409', email: 'janet.gourley@example.com',
    host: 'Mrs. Ellen Cruz', hostRole: 'Class Teacher · II B', department: 'Class Teacher',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: 'Mr. Samuel Roy · SEC-014',
    purpose: 'Guardian meeting', detail: 'Device return · early collection',
    appointmentTime: '10:30', appointmentDate: '', arrival: '10:25', departure: '11:25',
    checks: [
      { label: 'Driving Licence', detail: 'DL-44••••71', state: 'Passed' },
      { label: 'Guardian record match', detail: 'Student AD9892431', state: 'Passed' },
      { label: 'Vehicle registration logged', detail: 'KA-05-MJ-2218', state: 'Passed' },
    ],
    approval: 'Approved',
    passNumber: 'VP-2026-0847', passFrom: '10:25', passUntil: '12:25',
    gateRegister: 'GT-2026-0847', clearance: 'Standard · escorted',
    screening: 'No bag declared',
    documents: [
      { name: 'Visitor Pass VP-2026-0847.pdf', meta: 'Issued 10:25 · returned 11:25 · 40 KB' },
      { name: 'Early Exit Authorisation.pdf', meta: 'Signed by the class teacher · 56 KB' },
    ],
    notes: 'Guardian relationship confirmed on the student record before the pass was issued at the reception desk.',
  },
  {
    id: 'VVR-2026-0623', name: 'Mr. Dinesh Varma', icon: 'ti ti-truck-delivery', tint: 'purple',
    reference: 'FreshLine Foods · SUP-2023-008', visitorType: 'Vendor',
    contact: '+1 55 9925 4417', email: 'orders@freshline.example',
    host: 'Ms. Rosa Klein', hostRole: 'Cafeteria Manager', department: 'Cafeteria',
    gate: 'Service Gate', lane: 'Rear service road · Dock 2', gateOfficer: 'Ms. Fiona Marsh · SEC-031',
    purpose: 'Kitchen delivery', detail: 'Weekly replenishment · Kitchen Store',
    appointmentTime: '14:00', appointmentDate: '', arrival: '14:15', departure: '',
    checks: [
      { label: 'Company ID', detail: 'FL-221••••08', state: 'Passed' },
      { label: 'Delivery challan against the open order', detail: 'FreshLine Foods', state: 'Passed' },
      { label: 'Vehicle inspection at the barrier', detail: 'TN-09-DL-3312', state: 'Passed' },
    ],
    approval: 'Approved',
    passNumber: 'VP-2026-0859', passFrom: '14:15', passUntil: '16:15',
    gateRegister: 'GT-2026-0859', clearance: 'Restricted · service corridor only',
    screening: 'Delivery crates checked at Dock 2',
    documents: [
      { name: 'Visitor Pass VP-2026-0859.pdf', meta: 'Issued 14:15 · active · 41 KB' },
      { name: 'Delivery Challan.pdf', meta: 'FreshLine Foods · 68 KB' },
    ],
    notes: 'Access restricted to the service corridor and the dry store. Goods inward note due before the pass expires.',
  },
  {
    id: 'VVR-2026-0629', name: 'Mr. Victor Hale', icon: 'ti ti-user', tint: 'primary',
    reference: 'Walk in · no prior appointment', visitorType: 'Visitor',
    contact: '+1 55 6620 1187', email: 'v.hale@example.com',
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    gate: 'North Gate', lane: 'North reception · Lane 1', gateOfficer: 'Ms. Fiona Marsh · SEC-031',
    purpose: 'Admission enquiry', detail: 'Walk in · prospectus collection',
    appointmentTime: '', appointmentDate: '', arrival: '13:15', departure: '',
    checks: [
      { label: 'National ID', detail: 'NID-77••••34', state: 'Passed' },
      { label: 'Photograph captured at the desk', detail: 'CAM-NG-01 · 13:15', state: 'Passed' },
      { label: 'Admission office walk in slot', detail: 'Confirmed at the desk', state: 'Passed' },
    ],
    approval: 'Auto-Approved',
    passNumber: 'VP-2026-0871', passFrom: '13:15', passUntil: '14:15',
    gateRegister: 'GT-2026-0871', clearance: 'Standard · north block only',
    screening: 'No bag declared',
    documents: [
      { name: 'Visitor Pass VP-2026-0871.pdf', meta: 'Issued 13:15 · expired 14:15 · 39 KB' },
    ],
    notes: 'Auto approved under the walk in enquiry rule. One hour pass has lapsed with no exit scan recorded.',
  },
  {
    id: 'VVR-2026-0635', name: 'Ms. Nadia Fern', icon: 'ti ti-tool', tint: 'secondary',
    reference: 'Dell Technologies · TECH-DL-093', visitorType: 'Contractor',
    contact: '+1 55 8830 2145', email: 'prosupport@dell.example',
    host: 'Mrs. Alice Ray', hostRole: 'Chief Warden', department: 'Administration',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: '',
    purpose: 'Laptop battery service', detail: 'SRV-2026-0453 · Admin Office',
    appointmentTime: '09:00', appointmentDate: '12 Aug 2026', arrival: '', departure: '',
    checks: [
      { label: 'Pre registration by the estates office', detail: 'Raised 24 Jul 2026', state: 'Passed' },
      { label: 'Company ID', detail: 'DL-093••••27', state: 'Pending' },
      { label: 'Photograph on arrival', detail: 'To be captured at the desk', state: 'Pending' },
    ],
    approval: 'Approved',
    passNumber: '', passFrom: '', passUntil: '',
    gateRegister: '', clearance: 'Standard · escorted',
    screening: 'Tool kit to be declared on arrival',
    documents: [
      { name: 'Pre Registration Form.pdf', meta: 'Raised 24 Jul 2026 · 48 KB' },
      { name: 'Vendor Job Sheet.pdf', meta: 'SRV-2026-0453 · 71 KB' },
    ],
    notes: 'Host approval is on record. ID checks complete at the gate on the day of the visit.',
  },
  {
    id: 'VVR-2026-0641', name: 'Ms. Beatriz Alonso', icon: 'ti ti-users', tint: 'warning',
    reference: 'Prospective parent · Grade VI enquiry', visitorType: 'Guardian',
    contact: '+1 55 3372 9908', email: 'b.alonso@example.com',
    host: 'Ms. Dana Ruiz', hostRole: 'Admission Counsellor', department: 'Admission Office',
    gate: 'Main Gate', lane: 'Reception desk · Lane 1', gateOfficer: '',
    purpose: 'Admission interview', detail: 'Grade VI intake · 2027 session',
    appointmentTime: '16:30', appointmentDate: '', arrival: '', departure: '',
    checks: [
      { label: 'National ID', detail: 'NID-52••••19', state: 'Passed' },
      { label: 'Appointment booking reference', detail: 'ADM-2026-0742', state: 'Passed' },
      { label: 'Host confirmation', detail: 'Awaiting the admission counsellor', state: 'Pending' },
    ],
    approval: 'Pending Host',
    passNumber: '', passFrom: '', passUntil: '',
    gateRegister: '', clearance: 'Standard · escorted',
    screening: 'No bag declared',
    documents: [
      { name: 'Appointment Booking.pdf', meta: 'Raised 28 Jul 2026 · 46 KB' },
    ],
    notes: 'ID checks are complete. The pass will be issued once the admission counsellor confirms the slot.',
  },
  {
    id: 'VVR-2026-0647', name: 'Mr. Karan Mehta', icon: 'ti ti-truck-delivery', tint: 'purple',
    reference: 'Global Paper Mills · SUP-2019-004', visitorType: 'Vendor',
    contact: '+1 55 2240 6611', email: 'orders@globalpaper.example',
    host: 'Mr. Alan Pierce', hostRole: 'Store Manager', department: 'Store Office',
    gate: 'Service Gate', lane: 'Rear service road · Dock 1', gateOfficer: 'Ms. Fiona Marsh · SEC-031',
    purpose: 'Stationery delivery', detail: 'PO-2026-0188 · Main Store',
    appointmentTime: '11:00', appointmentDate: '', arrival: '', departure: '',
    checks: [
      { label: 'Company ID', detail: 'Expired 30 Jun 2026', state: 'Failed' },
      { label: 'Delivery challan', detail: 'Order number did not match', state: 'Failed' },
      { label: 'Supplier register cross check', detail: 'Driver not on the register', state: 'Pending' },
    ],
    approval: 'Rejected',
    passNumber: '', passFrom: '', passUntil: '',
    gateRegister: '', clearance: 'Not granted',
    screening: 'Not screened · entry refused',
    documents: [
      { name: 'Verification Failure Report.pdf', meta: 'Raised 11:10 · 54 KB' },
    ],
    notes: 'Expired company ID and a challan that did not match PO-2026-0188. Supplier asked to send a registered driver.',
  },
  {
    id: 'VVR-2026-0653', name: 'Mr. Owen Blake', icon: 'ti ti-user', tint: 'primary',
    reference: 'Walk in · hostel block', visitorType: 'Visitor',
    contact: '+1 55 3341 7726', email: 'Not provided',
    host: 'Not confirmed', hostRole: 'No warden approval on record', department: 'Hostel Office',
    gate: 'Hostel Gate', lane: 'Everest Hostel · Barrier 1', gateOfficer: 'Mr. Imran Qadir · SEC-022',
    purpose: 'Unscheduled hostel visit', detail: 'Outside visiting hours · no host',
    appointmentTime: '', appointmentDate: '', arrival: '', departure: '',
    checks: [
      { label: 'National ID', detail: 'NID-31••••90', state: 'Passed' },
      { label: 'Hostel visiting window', detail: 'Visit falls outside 16:00 to 18:00', state: 'Failed' },
      { label: 'Warden approval', detail: 'Not found on the visitor register', state: 'Failed' },
    ],
    approval: 'Rejected',
    passNumber: '', passFrom: '', passUntil: '',
    gateRegister: '', clearance: 'Not granted',
    screening: 'Not screened · turned away',
    documents: [
      { name: 'Access Denial Report.pdf', meta: 'Raised 14:05 · 52 KB' },
    ],
    notes: 'Hostel visiting hours are 16:00 to 18:00 with warden approval. Advised to book through the hostel office.',
  },
];
