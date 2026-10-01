export type PassStatus =
  | 'Pending Approval' | 'Approved' | 'Active' | 'Closed' | 'Expired' | 'Rejected';

export type ReturnStatus =
  | 'Not Started' | 'Awaiting Return' | 'Returned On Time' | 'Returned Late'
  | 'Overdue' | 'Not Applicable';

export type PersonType = 'Student' | 'Teacher' | 'Staff';

export type ExitReason =
  | 'Medical' | 'Sports Fixture' | 'Official Duty'
  | 'Guardian Request' | 'Personal' | 'Half Day Leave';

export interface Guardian {
  name: string;
  relationship: string;
  contact: string;
  method: string;
  /** "11:15" or "Not received". */
  recorded: string;
}

export interface PassDocument {
  name: string;
  meta: string;
}

export interface ExitPass {
  id: string;
  name: string;
  avatar: string;
  /** "II B · AD9892431". */
  reference: string;
  personType: PersonType;
  /** "Class II B" / "Science" / "Library". */
  department: string;
  /** "Room A-104". */
  baseLocation: string;

  reason: ExitReason;
  /** "Specialist appointment · out of station". */
  detail: string;
  /** "09:40" or "30 Jul 15:20". */
  requestedAt: string;

  /** Who signed it off; empty while the decision is outstanding. */
  approver: string;
  approvingAuthority: string;
  /** "10:55" or "29 Jul 14:25"; empty until a decision is taken. */
  approvedAt: string;
  /** Set when the request was turned down; it outranks everything else. */
  rejected: boolean;
  rejectedAt: string;

  /** Empty on a rejected or approved-but-unused pass. */
  passNumber: string;
  gate: string;
  /** "Reception desk · Lane 2". */
  lane: string;

  /** Empty until the person actually leaves. */
  exitTime: string;
  /** When the pass says they intend to go, on an approved-but-unused pass. */
  plannedExit: string;
  /** Empty on the same day; "3 Aug 2026" when the return is a later date. */
  expectedDate: string;
  /** Empty when no return is due at all — a half-day leave closes itself. */
  expectedTime: string;
  /** Empty until the person comes back. */
  actualReturn: string;

  guardian: Guardian | null;
  /** The gate entry this pass is linked to. */
  gateRegister: string;
  exitOfficer: string;
  returnOfficer: string;
  documents: PassDocument[];
  notes: string;
  /** The panel's own attendance line. */
  attendance: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const personBadge: Record<PersonType, string> = {
  Student: 'badge badge-soft-info',
  Teacher: 'badge badge-soft-primary',
  Staff: 'badge badge-soft-success',
};

export const reasonBadge: Record<ExitReason, string> = {
  Medical: 'badge badge-soft-danger',
  'Sports Fixture': 'badge badge-soft-warning',
  'Official Duty': 'badge badge-soft-primary',
  'Guardian Request': 'badge badge-soft-info',
  Personal: 'badge badge-soft-secondary',
  'Half Day Leave': 'badge badge-soft-purple',
};

export const reasonIcon: Record<ExitReason, string> = {
  Medical: 'ti ti-first-aid-kit',
  'Sports Fixture': 'ti ti-ball-football',
  'Official Duty': 'ti ti-briefcase',
  'Guardian Request': 'ti ti-users',
  Personal: 'ti ti-user',
  'Half Day Leave': 'ti ti-clock',
};

export const statusPill: Record<PassStatus, string> = {
  'Pending Approval': 'is-pending',
  Approved: 'is-review',
  Active: 'is-active',
  Closed: 'is-completed',
  Expired: 'is-blocked',
  Rejected: 'is-suspended',
};

export const statusBadge: Record<PassStatus, string> = {
  'Pending Approval': 'badge badge-soft-warning',
  Approved: 'badge badge-soft-info',
  Active: 'badge badge-soft-success',
  Closed: 'badge badge-soft-secondary',
  Expired: 'badge badge-soft-danger',
  Rejected: 'badge badge-soft-dark',
};

export const returnBadge: Record<ReturnStatus, string> = {
  'Not Started': 'badge badge-soft-secondary',
  'Awaiting Return': 'badge badge-soft-info',
  'Returned On Time': 'badge badge-soft-success',
  'Returned Late': 'badge badge-soft-warning',
  Overdue: 'badge badge-soft-danger',
  'Not Applicable': 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const personTypeOptions: PersonType[] = ['Student', 'Teacher', 'Staff'];

export const reasonOptions: ExitReason[] = [
  'Medical', 'Sports Fixture', 'Official Duty', 'Guardian Request', 'Personal', 'Half Day Leave',
];

export const statusOptions: PassStatus[] = [
  'Pending Approval', 'Approved', 'Active', 'Closed', 'Expired', 'Rejected',
];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const returnStatusOptions = [
  'Awaiting Return', 'Returned On Time', 'Returned Late', 'Overdue',
];

export const consentOptions = ['Received', 'Not received', 'Not applicable'];

/* --------------------------- Dialog option lists ----------------------------- */

export const holderOptions = ['Student', 'Teacher', 'Staff'];

export const personChoices = [
  'Lisa Gourley · II B',
  'Rohan Mehta · VIII A',
  'Mr. David Kim · Science',
  'Aarav Sharma · X C',
  'Mr. Ethan Brooks · Junior Warden',
  'Ananya Rao · VI A',
  'Kabir Anand · IX B',
  'Ms. Carla Mendes · Assistant Warden',
];

export const authorityOptions = [
  'Mrs. Ellen Cruz · Class Teacher',
  'Mr. Alan Pierce · Head of Section',
  'Mrs. Alice Ray · Chief Warden',
  'Ms. Dana Ruiz · School Nurse',
  'Mr. Ethan Brooks · Sports Coordinator',
];

export const consentMethodOptions = [
  'In person at the reception desk',
  'SMS confirmation with one time code',
  'Telephone confirmation',
  'Written request',
  'Not applicable · staff pass',
];

export const returnExpectedOptions = [
  'Same day', 'Next working day', 'Specific date', 'No return due',
];

export const decisionOptions = ['Approve', 'Hold', 'Reject'];

export const verificationOptions = ['QR Scan', 'ID Card', 'Biometric'];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const returnConditionOptions = ['On Time', 'Late', 'Not Returned'];

export const delayReasonOptions = [
  'Traffic delay', 'Appointment ran late', 'Personal emergency', 'Reason not given',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 3905 → "2d 17h 05m"; 100 → "1h 40m"; 20 → "20m". */
export const durationLabel = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const days = Math.floor(safe / 1440);
  const hours = Math.floor((safe % 1440) / 60);
  const mins = safe % 60;
  if (days > 0) return `${days}d ${hours}h ${String(mins).padStart(2, '0')}m`;
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

/** Whole days between two of the template's dates. */
export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

/** Minutes from the register clock to a return that may fall on a later day. */
export const minutesUntilReturn = (row: ExitPass): number => {
  if (!row.expectedTime) return 0;
  const dayOffset = row.expectedDate
    // "3 Aug 2026" against today's register date.
    ? daysBetween(REGISTER_DATE, row.expectedDate) * 1440
    : 0;
  return dayOffset + minutesOf(row.expectedTime) - minutesOf(REGISTER_TIME);
};

/** Exit to return, or exit to now while the person is still off campus. */
export const offCampusOf = (row: ExitPass): number => {
  if (!row.exitTime) return 0;
  return Math.max(0, minutesOf(row.actualReturn || REGISTER_TIME) - minutesOf(row.exitTime));
};

/**
 * The pill the Pass Status column prints. A rejection outranks everything, and a
 * pass with no return due closes itself at the end of the day rather than
 * expiring.
 */
export const statusOf = (row: ExitPass): PassStatus => {
  if (row.rejected) return 'Rejected';
  if (!row.approvedAt) return 'Pending Approval';
  if (!row.exitTime) return 'Approved';
  if (row.actualReturn) return 'Closed';
  if (!row.expectedTime) return 'Active';
  return minutesUntilReturn(row) < 0 ? 'Expired' : 'Active';
};

/** The same facts read from the return's side. */
export const returnStatusOf = (row: ExitPass): ReturnStatus => {
  if (row.rejected) return 'Not Applicable';
  if (!row.exitTime) return 'Not Started';
  if (row.actualReturn) {
    if (!row.expectedTime) return 'Returned On Time';
    return minutesOf(row.actualReturn) > minutesOf(row.expectedTime)
      ? 'Returned Late' : 'Returned On Time';
  }
  if (!row.expectedTime) return 'Awaiting Return';
  return minutesUntilReturn(row) < 0 ? 'Overdue' : 'Awaiting Return';
};

/** Signed minutes: negative is late, positive is early or still to come. */
export const varianceOf = (row: ExitPass): number => {
  if (!row.expectedTime) return 0;
  if (row.actualReturn) return minutesOf(row.expectedTime) - minutesOf(row.actualReturn);
  return minutesUntilReturn(row);
};

/** The Return Information card's own line. */
export const varianceLabelOf = (row: ExitPass): string => {
  if (row.rejected) return 'Not applicable';
  if (!row.exitTime) return 'Not started';
  if (!row.expectedTime) return 'No return due';
  const variance = varianceOf(row);
  if (row.actualReturn) {
    if (variance === 0) return 'On time';
    return variance > 0 ? `${durationLabel(variance)} early` : `${durationLabel(-variance)} late`;
  }
  return variance < 0 ? `${durationLabel(-variance)} overdue` : `${durationLabel(variance)} remaining`;
};

/** The second line under the Expected Return column. */
export const returnLabelOf = (row: ExitPass): string => {
  if (row.rejected) return 'Not applicable';
  if (!row.exitTime) return row.expectedTime ? 'Not started' : 'Closes end of day';
  if (!row.expectedTime) return 'Closes end of day';
  const variance = varianceOf(row);
  if (row.actualReturn) {
    if (variance === 0) return 'Returned on time';
    return variance > 0
      ? `Returned ${durationLabel(variance)} early`
      : `Returned ${durationLabel(-variance)} late`;
  }
  return variance < 0 ? `Late by ${durationLabel(-variance)}` : `Due in ${durationLabel(variance)}`;
};

export const returnTintOf = (row: ExitPass): string => {
  if (row.rejected || !row.exitTime) return 'text-muted';
  const status = returnStatusOf(row);
  if (status === 'Overdue') return 'text-danger';
  if (status === 'Returned Late') return 'text-warning';
  if (status === 'Returned On Time') return 'text-success';
  return 'text-warning';
};

/** What the Expected Return cell itself shows. */
export const expectedLabelOf = (row: ExitPass): string => {
  if (row.rejected) return DASH;
  if (!row.expectedTime) return 'No return due';
  return row.expectedDate
    ? `${row.expectedDate.split(' ').slice(0, 2).join(' ')} ${row.expectedTime}`
    : row.expectedTime;
};

/** What the Exit Time cell shows, and the muted line under it. */
export const exitLabelOf = (row: ExitPass): string => {
  if (row.rejected) return DASH;
  if (row.exitTime) return row.exitTime;
  return row.plannedExit ? `Planned ${row.plannedExit}` : DASH;
};

export const exitSubLabelOf = (row: ExitPass): string => {
  if (row.rejected) return 'Request rejected';
  if (row.exitTime) return REGISTER_DATE;
  return row.approvedAt ? 'Not checked out' : 'Awaiting approval';
};

/** "Approved 10:55" / "Rejected 13:30" / "Raised 14:50". */
export const decisionLabelOf = (row: ExitPass): string => {
  if (row.rejected) return `Rejected ${row.rejectedAt}`;
  if (row.approvedAt) return `Approved ${row.approvedAt}`;
  return `Raised ${row.requestedAt}`;
};

export const approverLabelOf = (row: ExitPass): string =>
  row.approver || (row.rejected ? 'Rejected' : 'Awaiting decision');

export interface Pair {
  label: string;
  value: string;
}

export const personPairsOf = (row: ExitPass): Pair[] => [
  { label: 'Pass ID', value: row.id },
  { label: 'Person Type', value: row.personType },
  { label: 'Reference', value: row.reference },
  { label: 'Department / Class', value: row.department },
  { label: 'Base Location', value: row.baseLocation },
];

export const requestPairsOf = (row: ExitPass): Pair[] => [
  { label: 'Exit Reason', value: row.reason },
  { label: 'Detail', value: row.detail },
  { label: 'Requested At', value: row.requestedAt },
  { label: 'Approving Authority', value: row.approvingAuthority || 'Not assigned' },
  { label: 'Pass Number', value: row.passNumber || 'Not issued' },
];

export const guardianPairsOf = (row: ExitPass): Pair[] =>
  row.guardian
    ? [
      { label: 'Guardian', value: row.guardian.name },
      { label: 'Relationship', value: row.guardian.relationship },
      { label: 'Contact', value: row.guardian.contact },
      { label: 'Consent Method', value: row.guardian.method },
      { label: 'Recorded', value: row.guardian.recorded },
    ]
    : [];

export const returnPairsOf = (row: ExitPass): Pair[] => [
  { label: 'Exit Time', value: row.exitTime || (row.rejected ? 'Not applicable' : 'Not checked out') },
  { label: 'Expected Return', value: expectedLabelOf(row) },
  { label: 'Actual Return', value: row.actualReturn || (row.rejected ? 'Not applicable' : 'Not recorded') },
  { label: 'Variance', value: varianceLabelOf(row) },
  { label: 'Return Status', value: returnStatusOf(row) },
];

/** The View dialog's approval block. */
export const approvalPairsOf = (row: ExitPass): Pair[] => [
  { label: 'Requested At', value: row.requestedAt },
  { label: row.rejected ? 'Rejected By' : 'Approved By', value: approverLabelOf(row) },
  { label: row.rejected ? 'Rejected At' : 'Approved At', value: row.rejectedAt || row.approvedAt || 'Pending' },
  { label: 'Authority', value: row.approvingAuthority || 'Not assigned' },
];

/** The panel's pass block. */
export const panelPassPairsOf = (row: ExitPass): Pair[] => [
  { label: 'Pass Number', value: row.passNumber || 'Not issued' },
  { label: 'Exit Reason', value: row.reason },
  { label: 'Exit Time', value: row.exitTime ? `${row.exitTime} · ${row.gate}` : exitLabelOf(row) },
  { label: 'Expected Return', value: expectedLabelOf(row) },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The approval trail. Every line is dated off the stored stamps, so a decision
 * or a return redraws it rather than leaving a stale copy.
 */
export const timelineOf = (row: ExitPass): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-file-text', tint: 'info',
      title: 'Exit request raised', meta: `${row.requestedAt} · ${row.department}`,
    },
  ];
  if (row.guardian && row.guardian.recorded !== 'Not received') {
    entries.push({
      icon: 'ti ti-users', tint: 'warning',
      title: 'Guardian authorisation recorded',
      meta: `${row.guardian.recorded} · ${row.guardian.name}`,
    });
  }
  if (row.rejected) {
    entries.push({
      icon: 'ti ti-circle-x', tint: 'danger',
      title: `Rejected by ${row.approver}`, meta: `${row.rejectedAt} · ${row.approvingAuthority}`,
    });
    return entries;
  }
  if (!row.approvedAt) {
    entries.push({
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Awaiting the approving authority',
      meta: `${durationLabel(Math.max(0, minutesOf(REGISTER_TIME) - minutesOf(row.requestedAt)))} in the queue`,
    });
    return entries;
  }
  entries.push({
    icon: 'ti ti-circle-check', tint: 'success',
    title: `Approved by ${row.approver}`, meta: `${row.approvedAt} · ${row.approvingAuthority}`,
  });
  if (row.passNumber) {
    entries.push({
      icon: 'ti ti-ticket', tint: 'primary',
      title: `Exit pass ${row.passNumber} issued`, meta: `${row.approvedAt} · security desk`,
    });
  }
  if (row.exitTime) {
    entries.push({
      icon: 'ti ti-door-exit', tint: 'info',
      title: `Exit scan at the ${row.gate.toLowerCase()}`, meta: `${row.exitTime} · ${row.exitOfficer}`,
    });
  }
  if (row.actualReturn) {
    entries.push({
      icon: 'ti ti-door-enter', tint: 'success',
      title: `Return scan at the ${row.gate.toLowerCase()}`,
      meta: `${row.actualReturn} · ${row.returnOfficer}`,
    });
  } else if (row.exitTime && row.expectedTime) {
    entries.push({
      icon: 'ti ti-clock', tint: minutesUntilReturn(row) < 0 ? 'danger' : 'warning',
      title: 'Return awaited', meta: `Expected ${expectedLabelOf(row)}`,
    });
  }
  return entries;
};

/** The panel's own five-stage table. */
export const stagesOf = (row: ExitPass): { stage: string; time: string; by: string }[] => {
  const stages = [
    { stage: 'Request raised', time: row.requestedAt, by: row.department },
    {
      stage: row.rejected ? 'Rejected' : 'Approved',
      time: row.rejectedAt || row.approvedAt || 'Pending',
      by: approverLabelOf(row),
    },
    { stage: 'Pass issued', time: row.passNumber ? row.approvedAt : 'Not issued', by: 'Security desk' },
    { stage: 'Exit scan', time: row.exitTime || 'Not recorded', by: row.exitTime ? row.exitOfficer.split('·')[0].trim() : DASH },
    {
      stage: 'Return scan',
      time: row.actualReturn || (row.expectedTime ? 'Awaited' : 'Not due'),
      by: row.actualReturn ? row.returnOfficer.split('·')[0].trim() : expectedLabelOf(row),
    },
  ];
  return stages;
};

/** The panel's audit trail, built from the same stamps. */
export const auditOf = (row: ExitPass): TimelineEntry[] => {
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-plus', tint: 'primary',
      title: 'Exit request created', meta: `${row.requestedAt} · School Office`,
    },
  ];
  if (row.approvedAt) {
    entries.push({
      icon: 'ti ti-edit', tint: 'info',
      title: row.expectedDate
        ? `Return date set to ${row.expectedDate}`
        : `Return time set to ${row.expectedTime || 'end of day'}`,
      meta: `${row.approvedAt} · ${row.approver}`,
    });
  }
  if (row.exitTime) {
    entries.push({
      icon: 'ti ti-checks', tint: 'success',
      title: 'Handover signed at the reception desk',
      meta: `${row.exitTime} · ${row.exitOfficer}`,
    });
  }
  if (row.rejected) {
    entries.push({
      icon: 'ti ti-circle-x', tint: 'danger',
      title: 'Request closed as rejected', meta: `${row.rejectedAt} · ${row.approver}`,
    });
  }
  return entries;
};

/* --------------------------------- Filters ---------------------------------- */

export const consentBandOf = (row: ExitPass): string => {
  if (!row.guardian) return 'Not applicable';
  return row.guardian.recorded === 'Not received' ? 'Not received' : 'Received';
};

export const searchIndexOf = (row: ExitPass): string =>
  [
    row.id, row.name, row.reference, row.personType, row.department, row.baseLocation,
    row.reason, row.detail, row.approver, row.passNumber, row.gate,
    statusOf(row), returnStatusOf(row),
  ]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/**
 * The strip counts the whole day — 56 passes against the eight this page lists —
 * so the template's figures stand and the roster moves them.
 */
export const SUMMARY_TOTALS = {
  active: 18,
  approvedToday: 46,
  pending: 7,
  returned: 24,
  overdue: 4,
};

export const VIEW_TOTALS = {
  all: 56,
  active: 18,
  pending: 7,
  overdue: 4,
  students: 39,
};

export const QUICK_TOTALS = {
  all: 56,
  active: 18,
  pending: 7,
  returned: 24,
  overdue: 4,
  rejected: 3,
};

/** The template's one committed chip — the date the register is showing. */
export const REGISTER_FROM = '31-07-2026';
export const REGISTER_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const passes: ExitPass[] = [
  {
    id: 'EXP-2026-0412', name: 'Lisa Gourley', avatar: 'assets/img/students/student-04.jpg',
    reference: 'II B · AD9892431', personType: 'Student',
    department: 'Class II B', baseLocation: 'Room A-104',
    reason: 'Medical', detail: 'Specialist appointment · out of station', requestedAt: '09:40',
    approver: 'Mrs. Ellen Cruz', approvingAuthority: 'Class Teacher · II B', approvedAt: '10:55',
    rejected: false, rejectedAt: '',
    passNumber: 'SP-2026-0362', gate: 'Main Gate', lane: 'Reception desk · Lane 2',
    exitTime: '11:20', plannedExit: '',
    expectedDate: '3 Aug 2026', expectedTime: '08:45', actualReturn: '',
    guardian: {
      name: 'Mrs. Janet Gourley', relationship: 'Guardian · mother',
      contact: '+1 55 7712 4409', method: 'In person at the reception desk', recorded: '11:15',
    },
    gateRegister: 'GT-2026-0852',
    exitOfficer: 'Mr. Samuel Roy · SEC-014', returnOfficer: 'Mr. Samuel Roy · SEC-014',
    documents: [
      { name: 'Exit Pass SP-2026-0362.pdf', meta: 'Issued 11:10 · used 11:20 · 38 KB' },
      { name: 'Medical Appointment Letter.pdf', meta: 'Uploaded 30 Jul 2026 · 96 KB' },
    ],
    notes: 'Guardian collected the student in person and returned the loaned Chromebook on the same visit.',
    attendance: 'Present 07:45',
  },
  {
    id: 'EXP-2026-0418', name: 'Rohan Mehta', avatar: 'assets/img/students/student-11.jpg',
    reference: 'VIII A · AD9891204', personType: 'Student',
    department: 'Class VIII A', baseLocation: 'Room B-207',
    reason: 'Sports Fixture', detail: 'Inter school football · away fixture',
    requestedAt: '30 Jul 15:20',
    approver: 'Mr. Ethan Brooks', approvingAuthority: 'Sports Coordinator', approvedAt: '30 Jul 17:05',
    rejected: false, rejectedAt: '',
    passNumber: 'SP-2026-0344', gate: 'Main Gate', lane: 'Reception desk · Lane 2',
    exitTime: '08:30', plannedExit: '',
    expectedDate: '', expectedTime: '16:30', actualReturn: '',
    guardian: {
      name: 'Mr. Suresh Mehta', relationship: 'Guardian · father',
      contact: '+1 55 8804 6612', method: 'SMS confirmation with one time code',
      recorded: '30 Jul 16:40',
    },
    gateRegister: 'GT-2026-0819',
    exitOfficer: 'Mr. Samuel Roy · SEC-014', returnOfficer: 'Mr. Samuel Roy · SEC-014',
    documents: [
      { name: 'Exit Pass SP-2026-0344.pdf', meta: 'Issued 08:20 · active · 37 KB' },
      { name: 'Fixture Consent Form.pdf', meta: 'Signed by the guardian · 62 KB' },
    ],
    notes: 'Travelling with the school team and a staff escort. Return by the team bus at the main gate.',
    attendance: 'Present 07:55',
  },
  {
    id: 'EXP-2026-0424', name: 'Mr. David Kim', avatar: 'assets/img/teachers/teacher-04.jpg',
    reference: 'Science · EMP-2020-033', personType: 'Teacher',
    department: 'Science', baseLocation: 'Science Block · Lab 1',
    reason: 'Official Duty', detail: 'Examination board meeting · district office',
    requestedAt: '29 Jul 11:10',
    approver: 'Mrs. Alice Ray', approvingAuthority: 'Chief Warden · Administration',
    approvedAt: '29 Jul 14:25',
    rejected: false, rejectedAt: '',
    passNumber: 'SP-2026-0351', gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    exitTime: '09:15', plannedExit: '',
    expectedDate: '', expectedTime: '13:00', actualReturn: '12:40',
    guardian: null,
    gateRegister: 'GT-2026-0836',
    exitOfficer: 'Mr. Imran Qadir · SEC-022', returnOfficer: 'Mr. Imran Qadir · SEC-022',
    documents: [
      { name: 'Exit Pass SP-2026-0351.pdf', meta: 'Issued 09:05 · returned 12:40 · 36 KB' },
      { name: 'Board Meeting Invitation.pdf', meta: 'District office · 84 KB' },
    ],
    notes: 'Substitution arranged for periods 2 to 5. Returned ahead of the expected time.',
    attendance: 'Present 08:05',
  },
  {
    id: 'EXP-2026-0431', name: 'Aarav Sharma', avatar: 'assets/img/students/student-07.jpg',
    reference: 'X C · AD9890877', personType: 'Student',
    department: 'Class X C', baseLocation: 'Room C-302',
    reason: 'Medical', detail: 'Unwell in class · sent home', requestedAt: '09:50',
    approver: 'Ms. Dana Ruiz', approvingAuthority: 'School Nurse · Medical Room', approvedAt: '10:00',
    rejected: false, rejectedAt: '',
    passNumber: 'SP-2026-0357', gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    exitTime: '10:05', plannedExit: '',
    expectedDate: '', expectedTime: '13:05', actualReturn: '14:20',
    guardian: {
      name: 'Mrs. Radha Sharma', relationship: 'Guardian · mother',
      contact: '+1 55 6690 2213', method: 'Telephone confirmation to the medical room',
      recorded: '09:55',
    },
    gateRegister: 'GT-2026-0843',
    exitOfficer: 'Mr. Samuel Roy · SEC-014', returnOfficer: 'Mr. Samuel Roy · SEC-014',
    documents: [
      { name: 'Exit Pass SP-2026-0357.pdf', meta: 'Issued 10:00 · returned 14:20 · 35 KB' },
      { name: 'Medical Room Note.pdf', meta: 'School nurse · 41 KB' },
    ],
    notes: 'Returned later than expected. Guardian informed the medical room that the clinic ran behind.',
    attendance: 'Present 07:50',
  },
  {
    id: 'EXP-2026-0437', name: 'Mr. Ethan Brooks', avatar: 'assets/img/teachers/teacher-05.jpg',
    reference: 'Junior Warden · EMP-2023-071', personType: 'Staff',
    department: 'Academic', baseLocation: 'Sports Ground · Store 2',
    reason: 'Personal', detail: 'Short personal errand · approved slot', requestedAt: '10:30',
    approver: 'Mrs. Alice Ray', approvingAuthority: 'Chief Warden · Administration',
    approvedAt: '11:15',
    rejected: false, rejectedAt: '',
    passNumber: 'SP-2026-0359', gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    exitTime: '12:00', plannedExit: '',
    expectedDate: '', expectedTime: '14:00', actualReturn: '',
    guardian: null,
    gateRegister: 'GT-2026-0855',
    exitOfficer: 'Mr. Imran Qadir · SEC-022', returnOfficer: 'Mr. Imran Qadir · SEC-022',
    documents: [
      { name: 'Exit Pass SP-2026-0359.pdf', meta: 'Issued 11:50 · expired 14:00 · 36 KB' },
    ],
    notes: 'No return scan at the staff turnstile. The security desk has raised an overdue alert with administration.',
    attendance: 'Present 07:40',
  },
  {
    id: 'EXP-2026-0443', name: 'Ananya Rao', avatar: 'assets/img/students/student-02.jpg',
    reference: 'VI A · AD9892118', personType: 'Student',
    department: 'Class VI A', baseLocation: 'Room B-101',
    reason: 'Guardian Request', detail: 'Family function · half day', requestedAt: '14:50',
    approver: '', approvingAuthority: '', approvedAt: '',
    rejected: false, rejectedAt: '',
    passNumber: '', gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    exitTime: '', plannedExit: '',
    expectedDate: '', expectedTime: '16:00', actualReturn: '',
    guardian: {
      name: 'Mr. Anil Rao', relationship: 'Guardian · father',
      contact: '+1 55 4417 8830', method: 'Written request submitted at the office',
      recorded: '14:45',
    },
    gateRegister: '',
    exitOfficer: '', returnOfficer: '',
    documents: [
      { name: 'Guardian Request Letter.pdf', meta: 'Submitted 14:45 · 58 KB' },
    ],
    notes: 'Awaiting the class teacher recommendation before the head of section takes the decision.',
    attendance: 'Present 07:48',
  },
  {
    id: 'EXP-2026-0449', name: 'Kabir Anand', avatar: 'assets/img/students/student-09.jpg',
    reference: 'IX B · AD9891560', personType: 'Student',
    department: 'Class IX B', baseLocation: 'Room C-208',
    reason: 'Personal', detail: 'Off campus tuition · during class hours', requestedAt: '12:40',
    approver: 'Mr. Alan Pierce', approvingAuthority: 'Head of Section · Senior School',
    approvedAt: '',
    rejected: true, rejectedAt: '13:30',
    passNumber: '', gate: 'Main Gate', lane: 'Reception desk · Lane 1',
    exitTime: '', plannedExit: '',
    expectedDate: '', expectedTime: '', actualReturn: '',
    guardian: {
      name: 'Mrs. Priya Anand', relationship: 'Guardian · mother',
      contact: '+1 55 9930 4471', method: 'Guardian consent not received', recorded: 'Not received',
    },
    gateRegister: '',
    exitOfficer: '', returnOfficer: '',
    documents: [
      { name: 'Rejection Note.pdf', meta: 'Raised 13:30 · 44 KB' },
    ],
    notes: 'Rejected because the reason falls outside the approved exit categories during teaching hours.',
    attendance: 'Present 07:52',
  },
  {
    id: 'EXP-2026-0455', name: 'Ms. Carla Mendes', avatar: 'assets/img/teachers/teacher-10.jpg',
    reference: 'Assistant Warden · EMP-2024-088', personType: 'Staff',
    department: 'Library', baseLocation: 'Library · Ground Floor',
    reason: 'Half Day Leave', detail: 'Second half leave · approved', requestedAt: '30 Jul 16:15',
    approver: 'Mrs. Alice Ray', approvingAuthority: 'Chief Warden · Administration',
    approvedAt: '09:40',
    rejected: false, rejectedAt: '',
    passNumber: 'SP-2026-0364', gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    exitTime: '', plannedExit: '16:00',
    expectedDate: '', expectedTime: '', actualReturn: '',
    guardian: null,
    gateRegister: '',
    exitOfficer: 'Ms. Fiona Marsh · SEC-031', returnOfficer: '',
    documents: [
      { name: 'Exit Pass SP-2026-0364.pdf', meta: 'Issued 09:45 · not used · 36 KB' },
      { name: 'Leave Approval.pdf', meta: 'HR record · 52 KB' },
    ],
    notes: 'Half day leave from 16:00. No return is due today; the pass closes at the end of the working day.',
    attendance: 'Present 07:35',
  },
];
