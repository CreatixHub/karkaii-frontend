export type EntryStatus =
  | 'Inside Campus' | 'Checked Out' | 'Late Arrival'
  | 'Missing Check-Out' | 'Override Granted' | 'Not Reported';

export type Department =
  | 'Administration' | 'Academic' | 'Science' | 'Security' | 'Cafeteria' | 'Transport';

export type Shift = 'Morning' | 'Day' | 'Evening' | 'Night';

export type Verification = 'ID card scan' | 'Biometric scan' | 'Manual override' | 'Not recorded';

export interface HistoryEntry {
  title: string;
  meta: string;
}

/** A previous day on the same staff record. */
export interface PastEntry {
  date: string;
  checkIn: string;
  checkOut: string;
  gate: string;
}

export interface AccessZone {
  zone: string;
  allowed: boolean;
}

export interface StaffEntry {
  id: string;
  staffId: string;
  name: string;
  /** Teachers carry a photo; the gate officer, cook and driver carry an icon. */
  avatar?: string;
  icon: string;
  tint: string;
  /** "Hostel administration" — what the person is on campus to do. */
  responsibility: string;
  department: Department;
  designation: string;
  contact: string;
  /** "EMP-014••••92" — masked on the register. */
  card: string;
  vehicle: string;

  gate: string;
  /** "Staff turnstile · Lane 3". */
  lane: string;

  shift: Shift;
  /** "07:30" — when the roster says the shift starts. */
  shiftStart: string;
  /** "16:30"; earlier than the start on the night shift, which crosses midnight. */
  shiftEnd: string;

  /** Empty when the person never scanned in. */
  checkIn: string;
  /** Prefix printed before the check-in on an overnight shift. */
  checkInDate: string;
  /** Empty until the exit scan. */
  checkOut: string;

  verification: Verification;
  /** Set when the reader was bypassed; it outranks the times on the pill. */
  override: boolean;
  overrideTicket: string;
  officer: string;
  gateRegister: string;
  camera: string;

  history: HistoryEntry[];
  /** The attendance card's own four figures. */
  daysPresent: number;
  daysInMonth: number;
  monthLate: number;
  monthMissing: number;
  averageIn: string;
  averageOut: string;

  pastEntries: PastEntry[];
  zones: AccessZone[];
  reportsTo: string;
  officeLocation: string;
  notes: string;
}

/* --------------------------------- Tints ----------------------------------- */

export const departmentBadge: Record<Department, string> = {
  Administration: 'badge badge-soft-primary',
  Academic: 'badge badge-soft-success',
  Science: 'badge badge-soft-info',
  Security: 'badge badge-soft-danger',
  Cafeteria: 'badge badge-soft-warning',
  Transport: 'badge badge-soft-purple',
};

export const shiftBadge: Record<Shift, string> = {
  Morning: 'badge badge-soft-success',
  Day: 'badge badge-soft-primary',
  Evening: 'badge badge-soft-warning',
  Night: 'badge badge-soft-purple',
};

export const statusPill: Record<EntryStatus, string> = {
  'Inside Campus': 'is-active',
  'Checked Out': 'is-completed',
  'Late Arrival': 'is-pending',
  'Missing Check-Out': 'is-blocked',
  'Override Granted': 'is-review',
  'Not Reported': 'is-suspended',
};

export const statusBadge: Record<EntryStatus, string> = {
  'Inside Campus': 'badge badge-soft-success',
  'Checked Out': 'badge badge-soft-secondary',
  'Late Arrival': 'badge badge-soft-warning',
  'Missing Check-Out': 'badge badge-soft-danger',
  'Override Granted': 'badge badge-soft-info',
  'Not Reported': 'badge badge-soft-danger',
};

export const verificationIcon: Record<Verification, string> = {
  'ID card scan': 'ti ti-qrcode',
  'Biometric scan': 'ti ti-fingerprint',
  'Manual override': 'ti ti-shield-check',
  'Not recorded': 'ti ti-scan',
};

/* ------------------------------ Filter options ------------------------------ */

export const departmentOptions: Department[] = [
  'Administration', 'Academic', 'Science', 'Security', 'Cafeteria', 'Transport',
];

export const roleOptions = [
  'Chief Warden', 'Assistant Warden', 'Junior Warden', 'Senior Teacher',
  'Class Teacher', 'Gate Officer', 'Cafeteria Manager', 'Bus Driver',
];

export const shiftOptions: Shift[] = ['Morning', 'Day', 'Evening', 'Night'];

export const gateOptions = ['Main Gate', 'North Gate', 'Service Gate', 'Hostel Gate'];

export const statusOptions: EntryStatus[] = [
  'Inside Campus', 'Checked Out', 'Late Arrival',
  'Missing Check-Out', 'Override Granted', 'Not Reported',
];

export const verificationOptions: Verification[] = [
  'ID card scan', 'Biometric scan', 'Manual override', 'Not recorded',
];

/* --------------------------- Dialog option lists ----------------------------- */

export const movementOptions = ['Check-In', 'Check-Out', 'Full Shift'];

export const staffChoices = [
  'Mrs. Alice Ray · EMP-2019-014',
  'Ms. Priya Raman · EMP-2021-046',
  'Mr. Ethan Brooks · EMP-2023-071',
  'Mr. David Kim · EMP-2020-033',
  'Mrs. Ellen Cruz · EMP-2022-052',
  'Mr. Samuel Roy · SEC-2021-014',
  'Ms. Rosa Klein · EMP-2021-067',
  'Mr. Arjun Nair · EMP-2024-093',
];

/** Each option carries its own window, so the form cannot pick a stray one. */
export const shiftChoices: { shift: Shift; label: string; start: string; end: string }[] = [
  { shift: 'Morning', label: 'Morning · 07:30 to 16:30', start: '07:30', end: '16:30' },
  { shift: 'Day', label: 'Day · 08:30 to 17:00', start: '08:30', end: '17:00' },
  { shift: 'Evening', label: 'Evening · 13:00 to 21:00', start: '13:00', end: '21:00' },
  { shift: 'Night', label: 'Night · 21:00 to 06:00', start: '21:00', end: '06:00' },
];

export const methodOptions: Verification[] = ['ID card scan', 'Biometric scan', 'Manual override'];

export const officerOptions = [
  'Mr. Samuel Roy · SEC-014', 'Mr. Imran Qadir · SEC-022', 'Ms. Fiona Marsh · SEC-031',
];

export const checkInMethodOptions = ['ID Card', 'Biometric', 'Manual'];

export const lateReasonOptions = [
  'Traffic delay', 'Personal emergency', 'Prior approval', 'Reason not given',
];

export const exitVerificationOptions = ['ID Card', 'CCTV', 'Register'];

export const approverOptions = ['Security Supervisor', 'Chief Warden', 'Administration'];

export const overrideScopeOptions = ['Single Entry', 'Today Only', 'Until Reissue'];

export const overrideReasonOptions = [
  'Card demagnetised', 'Card lost or misplaced', 'Reader fault', 'New joiner · card pending',
];

export const zoneOptions = [
  'Same as the staff profile', 'Restricted · own department only', 'Escorted access only',
];

/* ------------------------------- Derivations -------------------------------- */

export const DASH = '—';

export const REGISTER_TIME = '15:40';
export const REGISTER_DATE = '31 Jul 2026';

/** The roster allows ten minutes before an arrival counts as late. */
export const GRACE_MINUTES = 10;

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** 500 → "8h 20m"; under an hour drops the hours. */
export const durationLabel = (minutes: number): string => {
  const safe = Math.max(0, minutes);
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  return hours === 0 ? `${mins}m` : `${hours}h ${String(mins).padStart(2, '0')}m`;
};

export const addMinutes = (time: string, minutes: number): string => {
  const total = (minutesOf(time) + minutes + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

/** A shift whose end time is earlier than its start runs through midnight. */
export const isOvernight = (row: StaffEntry): boolean =>
  minutesOf(row.shiftEnd) <= minutesOf(row.shiftStart);

/** The shift's own length, which is 9h either side of midnight. */
export const rosteredOf = (row: StaffEntry): number => {
  const span = minutesOf(row.shiftEnd) - minutesOf(row.shiftStart);
  return span > 0 ? span : span + 1440;
};

/** Positive is early, negative is late — the shift start less the check-in. */
export const punctualityOf = (row: StaffEntry): number => {
  if (!row.checkIn) return 0;
  return minutesOf(row.shiftStart) - minutesOf(row.checkIn);
};

export const isLate = (row: StaffEntry): boolean =>
  Boolean(row.checkIn) && punctualityOf(row) < -GRACE_MINUTES;

/** Check-in to check-out, or to now while the shift is still running. */
export const onSiteOf = (row: StaffEntry): number => {
  if (!row.checkIn) return 0;
  const span = minutesOf(row.checkOut || REGISTER_TIME) - minutesOf(row.checkIn);
  return span >= 0 ? span : span + 1440;
};

/** Minutes since the shift's own end; zero while it is still running. */
export const sinceShiftEndOf = (row: StaffEntry): number => {
  const end = minutesOf(row.shiftEnd);
  const now = minutesOf(REGISTER_TIME);
  if (isOvernight(row)) return now >= end ? now - end : 0;
  return now > end ? now - end : 0;
};

/** How far past the shift start an unreported staff member has run. */
export const pastShiftStartOf = (row: StaffEntry): number => {
  if (row.checkIn) return 0;
  const started = minutesOf(REGISTER_TIME) - minutesOf(row.shiftStart);
  return Math.max(0, started);
};

/**
 * The pill the Status column prints. An override outranks the clock, and a shift
 * that has ended without an exit scan reads Missing Check-Out rather than
 * staying Inside Campus.
 */
export const statusOf = (row: StaffEntry): EntryStatus => {
  if (!row.checkIn) return 'Not Reported';
  if (row.override) return 'Override Granted';
  if (row.checkOut) return 'Checked Out';
  if (sinceShiftEndOf(row) > 0) return 'Missing Check-Out';
  return isLate(row) ? 'Late Arrival' : 'Inside Campus';
};

/** The line under the Check-In column. */
export const punctualityLabelOf = (row: StaffEntry): string => {
  if (!row.checkIn) return `${durationLabel(pastShiftStartOf(row))} overdue`;
  const variance = punctualityOf(row);
  if (variance === 0) return 'On time';
  return variance > 0 ? `${durationLabel(variance)} early` : `${durationLabel(-variance)} late`;
};

export const punctualityTintOf = (row: StaffEntry): string => {
  if (!row.checkIn) return 'text-danger';
  return isLate(row) ? 'text-warning' : 'text-success';
};

/** The line under the Check-Out column. */
export const movementLabelOf = (row: StaffEntry): string => {
  if (!row.checkIn) return 'No movement';
  if (!row.checkOut && sinceShiftEndOf(row) > 0) {
    return `Shift ended ${durationLabel(sinceShiftEndOf(row))} ago`;
  }
  return `On site ${durationLabel(onSiteOf(row))}`;
};

/**
 * Green while the entry runs to plan, amber once the arrival was late or the
 * time on site has passed the rostered hours, red when a scan is missing.
 */
export const movementTintOf = (row: StaffEntry): string => {
  if (!row.checkIn) return 'text-muted';
  if (!row.checkOut && sinceShiftEndOf(row) > 0) return 'text-danger';
  if (isLate(row) || onSiteOf(row) > rosteredOf(row)) return 'text-warning';
  return 'text-success';
};

export const checkInLabelOf = (row: StaffEntry): string => {
  if (!row.checkIn) return 'Not scanned';
  return row.checkInDate ? `${row.checkInDate} ${row.checkIn}` : row.checkIn;
};

export const checkOutLabelOf = (row: StaffEntry): string => {
  if (!row.checkIn) return DASH;
  if (row.checkOut) return row.checkOut;
  return sinceShiftEndOf(row) > 0 ? 'Not scanned' : 'Still inside';
};

/** "07:30 – 16:30". */
export const shiftWindowOf = (row: StaffEntry): string => `${row.shiftStart} – ${row.shiftEnd}`;

/** "Morning · 07:30 to 16:30" — the way the dialogs name a shift. */
export const shiftLabelOf = (row: StaffEntry): string =>
  `${row.shift} · ${row.shiftStart} to ${row.shiftEnd}`;

export const onSiteLabelOf = (row: StaffEntry): string =>
  row.checkIn ? durationLabel(onSiteOf(row)) : DASH;

export interface Pair {
  label: string;
  value: string;
}

export const profilePairsOf = (row: StaffEntry): Pair[] => [
  { label: 'Staff ID', value: row.staffId },
  { label: 'Designation', value: row.designation },
  { label: 'Department', value: row.department },
  { label: 'Responsibility', value: row.responsibility },
  { label: 'Entry ID', value: row.id },
];

export const shiftPairsOf = (row: StaffEntry): Pair[] => [
  { label: 'Shift', value: row.shift },
  { label: 'Shift Window', value: shiftWindowOf(row) },
  { label: 'Rostered Hours', value: durationLabel(rosteredOf(row)) },
  { label: 'Grace Window', value: `${GRACE_MINUTES} minutes` },
  { label: 'Gate', value: `${row.gate} · ${row.lane}` },
];

export const attendancePairsOf = (row: StaffEntry): Pair[] => [
  { label: 'This Month', value: `${row.daysPresent} of ${row.daysInMonth} days` },
  { label: 'Late Arrivals', value: String(row.monthLate) },
  { label: 'Missing Check-Outs', value: String(row.monthMissing) },
  { label: 'Average In', value: row.averageIn },
  { label: 'Average Out', value: row.averageOut },
];

/** The View dialog's entry block. */
export const entryPairsOf = (row: StaffEntry): Pair[] => [
  { label: 'Gate', value: `${row.gate} · ${row.lane.split('·').pop()?.trim()}` },
  { label: 'Department', value: row.department },
  { label: 'Gate Officer', value: row.officer.split('·')[0].trim() || 'Not assigned' },
  { label: 'Gate Register', value: row.gateRegister || 'Not linked' },
];

/** The panel's staff block. */
export const panelStaffPairsOf = (row: StaffEntry): Pair[] => [
  { label: 'Designation', value: row.designation },
  { label: 'Contact', value: row.contact },
  { label: 'Card', value: row.card },
  { label: 'Vehicle', value: row.vehicle || 'On foot' },
];

/** The panel's verification block, read off the entry's own facts. */
export const verificationPairsOf = (row: StaffEntry): Pair[] => [
  { label: 'Card Scan', value: row.verification === 'Not recorded' ? 'Not scanned' : 'Passed' },
  { label: 'Roster', value: row.checkIn ? 'Matched' : 'Awaiting scan' },
  { label: 'Override', value: row.override ? `Granted · ${row.overrideTicket}` : 'None' },
];

export interface TimelineEntry {
  icon: string;
  tint: string;
  title: string;
  meta: string;
}

/**
 * The entry-and-exit trail. Every line is dated off the two scans and the shift
 * window, so a check-out or an override redraws it.
 */
export const timelineOf = (row: StaffEntry): TimelineEntry[] => {
  if (!row.checkIn) {
    return [
      {
        icon: 'ti ti-calendar-event', tint: 'info',
        title: 'Shift start', meta: `${row.shiftStart} · ${row.shift} shift`,
      },
      {
        icon: 'ti ti-alert-triangle', tint: 'danger',
        title: 'No check-in scan recorded',
        meta: `${durationLabel(pastShiftStartOf(row))} past the shift start`,
      },
    ];
  }
  const entries: TimelineEntry[] = [
    {
      icon: 'ti ti-door-enter', tint: 'success',
      title: 'Checked in at the gate',
      meta: `${checkInLabelOf(row)} · ${isLate(row) ? punctualityLabelOf(row) : 'within the grace window'}`,
    },
  ];
  if (row.override) {
    entries.push({
      icon: 'ti ti-shield-check', tint: 'info',
      title: 'Manual override granted', meta: `${row.checkIn} · ${row.officer}`,
    });
  }
  if (row.checkOut) {
    entries.push({
      icon: 'ti ti-door-exit', tint: 'info',
      title: 'Checked out at the gate',
      meta: `${row.checkOut} · on site ${durationLabel(onSiteOf(row))}`,
    });
  } else if (sinceShiftEndOf(row) > 0) {
    entries.push({
      icon: 'ti ti-alert-triangle', tint: 'danger',
      title: 'Shift ended with no exit scan',
      meta: `${row.shiftEnd} · ${durationLabel(sinceShiftEndOf(row))} ago`,
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

/** The panel's audit trail, built from the same stamps. */
export const auditOf = (row: StaffEntry): TimelineEntry[] => [
  {
    icon: 'ti ti-plus', tint: 'primary',
    title: 'Entry record created',
    meta: `${checkInLabelOf(row)} · ${row.officer || row.gate}`,
  },
  {
    icon: 'ti ti-edit', tint: 'info',
    title: row.gateRegister ? `Linked to gate register ${row.gateRegister}` : `Roster matched for ${REGISTER_DATE}`,
    meta: `${row.shiftStart} · ${row.shift} shift`,
  },
  row.checkOut
    ? {
      icon: 'ti ti-checks', tint: 'success',
      title: 'Entry closed on the exit scan', meta: `${row.checkOut} · ${row.officer}`,
    }
    : {
      icon: 'ti ti-clock', tint: 'warning',
      title: 'Entry still open', meta: `${REGISTER_TIME} · security desk`,
    },
];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: StaffEntry): string =>
  [
    row.id, row.staffId, row.name, row.department, row.designation, row.responsibility,
    row.gate, row.lane, row.shift, row.verification, statusOf(row), row.gateRegister,
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
 * The strip counts the whole day at every gate — 97 staff records against the
 * eight this page lists — so the template's figures stand and the roster moves
 * them.
 */
export const SUMMARY_TOTALS = {
  today: 94,
  inside: 58,
  checkedOut: 33,
  late: 6,
  missing: 3,
};

export const VIEW_TOTALS = {
  all: 97,
  inside: 58,
  late: 6,
  missing: 3,
  night: 12,
};

export const QUICK_TOTALS = {
  all: 97,
  inside: 58,
  checkedOut: 33,
  late: 6,
  missing: 3,
  notReported: 3,
};

/** The template's one committed chip — the date the register is showing. */
export const REGISTER_FROM = '31-07-2026';
export const REGISTER_TO = '31-07-2026';

/* ---------------------------------- Rows ------------------------------------ */

export const staffEntries: StaffEntry[] = [
  {
    id: 'STE-2026-0912', staffId: 'EMP-2019-014', name: 'Mrs. Alice Ray',
    avatar: 'assets/img/teachers/teacher-01.jpg', icon: 'ti ti-user', tint: 'primary',
    responsibility: 'Hostel administration', department: 'Administration',
    designation: 'Chief Warden', contact: '+1 55 4409 3312',
    card: 'EMP-014••••92', vehicle: 'KL-07-AR-1902',
    gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    shift: 'Morning', shiftStart: '07:30', shiftEnd: '16:30',
    checkIn: '07:20', checkInDate: '', checkOut: '',
    verification: 'ID card scan', override: false, overrideTicket: '',
    officer: 'Mr. Samuel Roy · SEC-014', gateRegister: 'GT-2026-0864', camera: 'CAM-MG-03',
    history: [
      { title: 'Checked in at the staff turnstile', meta: '07:20 · on time' },
      { title: 'Vehicle sticker read at the barrier', meta: '07:19 · Staff Bay 11' },
      { title: 'Duty roster matched for 31 Jul 2026', meta: '07:20 · morning shift' },
    ],
    daysPresent: 22, daysInMonth: 22, monthLate: 0, monthMissing: 0,
    averageIn: '07:22', averageOut: '16:38',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '07:24', checkOut: '16:41', gate: 'Main Gate' },
      { date: '29 Jul 2026', checkIn: '07:18', checkOut: '16:35', gate: 'Main Gate' },
      { date: '28 Jul 2026', checkIn: '07:26', checkOut: '16:52', gate: 'Main Gate' },
    ],
    zones: [
      { zone: 'Main Block · all floors', allowed: true },
      { zone: 'Everest Hostel · Block A and B', allowed: true },
      { zone: 'Server Room · IT Block', allowed: false },
    ],
    reportsTo: 'Reports to Principal', officeLocation: 'Main Block · Admin Office',
    notes: 'Full attendance this month. Holds the hostel master key set and signs the night register.',
  },
  {
    id: 'STE-2026-0918', staffId: 'EMP-2021-046', name: 'Ms. Priya Raman',
    avatar: 'assets/img/teachers/teacher-06.jpg', icon: 'ti ti-user', tint: 'success',
    responsibility: 'Class VI to VIII supervision', department: 'Academic',
    designation: 'Assistant Warden', contact: '+1 55 2214 8890',
    card: 'EMP-046••••18', vehicle: '',
    gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    shift: 'Day', shiftStart: '08:30', shiftEnd: '17:00',
    checkIn: '08:52', checkInDate: '', checkOut: '',
    verification: 'ID card scan', override: false, overrideTicket: '',
    officer: 'Mr. Samuel Roy · SEC-014', gateRegister: 'GT-2026-0871', camera: 'CAM-MG-03',
    history: [
      { title: 'Checked in at the staff turnstile', meta: '08:52 · 22m late' },
      { title: 'Late arrival flagged to administration', meta: '08:52 · automated' },
      { title: 'Reason recorded at the desk', meta: '08:55 · transport delay' },
    ],
    daysPresent: 21, daysInMonth: 22, monthLate: 3, monthMissing: 0,
    averageIn: '08:41', averageOut: '17:06',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '08:34', checkOut: '17:12', gate: 'Main Gate' },
      { date: '29 Jul 2026', checkIn: '08:47', checkOut: '17:04', gate: 'Main Gate' },
    ],
    zones: [
      { zone: 'Main Block · all floors', allowed: true },
      { zone: 'Nightingale Hostel · Block A', allowed: true },
      { zone: 'Server Room · IT Block', allowed: false },
    ],
    reportsTo: 'Reports to Chief Warden', officeLocation: 'Main Block · Room 204',
    notes: 'Third late arrival this month. Administration has asked for a written explanation.',
  },
  {
    id: 'STE-2026-0924', staffId: 'EMP-2023-071', name: 'Mr. Ethan Brooks',
    avatar: 'assets/img/teachers/teacher-05.jpg', icon: 'ti ti-user', tint: 'success',
    responsibility: 'Sports coordination', department: 'Academic',
    designation: 'Junior Warden', contact: '+1 55 4453 6621',
    card: 'EMP-071••••35', vehicle: '',
    gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    shift: 'Day', shiftStart: '08:30', shiftEnd: '17:00',
    checkIn: '08:05', checkInDate: '', checkOut: '12:00',
    verification: 'ID card scan', override: false, overrideTicket: '',
    officer: 'Mr. Imran Qadir · SEC-022', gateRegister: 'GT-2026-0855', camera: 'CAM-MG-03',
    history: [
      { title: 'Checked in at the staff turnstile', meta: '08:05 · on time' },
      { title: 'Exit pass EXP-2026-0437 approved', meta: '11:15 · Mrs. Alice Ray' },
      { title: 'Checked out on an approved exit pass', meta: '12:00 · personal errand' },
    ],
    daysPresent: 20, daysInMonth: 22, monthLate: 1, monthMissing: 1,
    averageIn: '08:12', averageOut: '16:52',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '08:10', checkOut: '16:55', gate: 'Main Gate' },
      { date: '29 Jul 2026', checkIn: '08:14', checkOut: '16:48', gate: 'Main Gate' },
    ],
    zones: [
      { zone: 'Sports Ground · all areas', allowed: true },
      { zone: 'Main Block · ground floor', allowed: true },
      { zone: 'Server Room · IT Block', allowed: false },
    ],
    reportsTo: 'Reports to Chief Warden', officeLocation: 'Sports Ground · Store 2',
    notes: 'Left on exit pass EXP-2026-0437 with an expected return of 14:00. Return scan still outstanding.',
  },
  {
    id: 'STE-2026-0931', staffId: 'EMP-2020-033', name: 'Mr. David Kim',
    avatar: 'assets/img/teachers/teacher-04.jpg', icon: 'ti ti-user', tint: 'info',
    responsibility: 'Physics and lab supervision', department: 'Science',
    designation: 'Senior Teacher', contact: '+1 55 7708 3325',
    card: 'EMP-033••••74', vehicle: '',
    gate: 'Main Gate', lane: 'Staff turnstile · Lane 3',
    shift: 'Day', shiftStart: '08:30', shiftEnd: '17:00',
    checkIn: '07:40', checkInDate: '', checkOut: '',
    verification: 'ID card scan', override: false, overrideTicket: '',
    officer: 'Mr. Samuel Roy · SEC-014', gateRegister: 'GT-2026-0836', camera: 'CAM-MG-03',
    history: [
      { title: 'Checked in at the staff turnstile', meta: '07:40 · 50m early' },
      { title: 'Left on exit pass EXP-2026-0424', meta: '09:15 · examination board' },
      { title: 'Returned and re-scanned at the turnstile', meta: '12:40 · 20m ahead of the expected time' },
    ],
    daysPresent: 22, daysInMonth: 22, monthLate: 0, monthMissing: 0,
    averageIn: '07:46', averageOut: '17:12',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '07:44', checkOut: '17:15', gate: 'Main Gate' },
      { date: '29 Jul 2026', checkIn: '07:50', checkOut: '17:08', gate: 'Main Gate' },
    ],
    zones: [
      { zone: 'Science Block · all labs', allowed: true },
      { zone: 'Main Block · all floors', allowed: true },
      { zone: 'Server Room · IT Block', allowed: false },
    ],
    reportsTo: 'Reports to Head of Science', officeLocation: 'Science Block · Lab 1',
    notes: 'Official duty exit and return both scanned. Substitution was arranged for periods 2 to 5.',
  },
  {
    id: 'STE-2026-0937', staffId: 'EMP-2022-052', name: 'Mrs. Ellen Cruz',
    avatar: 'assets/img/teachers/teacher-08.jpg', icon: 'ti ti-user', tint: 'success',
    responsibility: 'Primary section', department: 'Academic',
    designation: 'Class Teacher · II B', contact: '+1 55 3341 7726',
    card: 'EMP-052••••61', vehicle: '',
    gate: 'North Gate', lane: 'North reception · Lane 2',
    shift: 'Day', shiftStart: '08:30', shiftEnd: '17:00',
    checkIn: '08:18', checkInDate: '', checkOut: '',
    verification: 'Manual override', override: true, overrideTicket: 'ACC-2026-0118',
    officer: 'Ms. Fiona Marsh · SEC-031', gateRegister: 'GT-2026-0828', camera: 'CAM-NG-01',
    history: [
      { title: 'Card reader rejected the staff card', meta: '08:16 · North Gate reader NG-01' },
      { title: 'Manual override granted by the gate officer', meta: '08:18 · Ms. Fiona Marsh' },
      { title: 'Replacement card raised with administration', meta: '08:30 · ticket ACC-2026-0118' },
    ],
    daysPresent: 22, daysInMonth: 22, monthLate: 0, monthMissing: 0,
    averageIn: '08:21', averageOut: '17:04',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '08:22', checkOut: '17:02', gate: 'North Gate' },
      { date: '29 Jul 2026', checkIn: '08:19', checkOut: '17:06', gate: 'North Gate' },
    ],
    zones: [
      { zone: 'Main Block · primary wing', allowed: true },
      { zone: 'North Block · all floors', allowed: true },
      { zone: 'Server Room · IT Block', allowed: false },
    ],
    reportsTo: 'Reports to Head of Section', officeLocation: 'Main Block · Room A-104',
    notes: 'Card demagnetised. Override is valid for today only; a replacement card is due from administration.',
  },
  {
    id: 'STE-2026-0943', staffId: 'SEC-2021-014', name: 'Mr. Samuel Roy',
    icon: 'ti ti-shield-check', tint: 'danger',
    responsibility: 'Main gate · night duty', department: 'Security',
    designation: 'Gate Officer', contact: '+1 55 4176 2280',
    card: 'SEC-014••••07', vehicle: '',
    gate: 'Main Gate', lane: 'Security post · Gate house',
    shift: 'Night', shiftStart: '21:00', shiftEnd: '06:00',
    checkIn: '20:48', checkInDate: '30 Jul', checkOut: '',
    verification: 'Biometric scan', override: false, overrideTicket: '',
    officer: 'Mr. Imran Qadir · SEC-022', gateRegister: 'GT-2026-0801', camera: 'CAM-MG-01',
    history: [
      { title: 'Checked in for the night shift', meta: '20:48 · 30 Jul 2026' },
      { title: 'Handover taken from the evening officer', meta: '21:00 · gate register signed' },
      { title: 'Shift ended with no exit scan', meta: '06:00 · 31 Jul 2026' },
    ],
    daysPresent: 21, daysInMonth: 22, monthLate: 0, monthMissing: 2,
    averageIn: '20:52', averageOut: '06:08',
    pastEntries: [
      { date: '29 Jul 2026', checkIn: '20:55', checkOut: '06:10', gate: 'Main Gate' },
      { date: '28 Jul 2026', checkIn: '20:50', checkOut: '06:04', gate: 'Main Gate' },
    ],
    zones: [
      { zone: 'All gates and barriers', allowed: true },
      { zone: 'Security control room', allowed: true },
      { zone: 'Hostel blocks · escorted only', allowed: false },
    ],
    reportsTo: 'Reports to Security Supervisor', officeLocation: 'Main Gate · Gate house',
    notes: 'Handover was signed but the exit scan was missed. The security supervisor is closing the entry manually.',
  },
  {
    id: 'STE-2026-0949', staffId: 'EMP-2021-067', name: 'Ms. Rosa Klein',
    icon: 'ti ti-chef-hat', tint: 'warning',
    responsibility: 'Kitchen and dining hall', department: 'Cafeteria',
    designation: 'Cafeteria Manager', contact: '+1 55 9925 4417',
    card: 'EMP-067••••44', vehicle: '',
    gate: 'Service Gate', lane: 'Rear service road · Dock 1',
    shift: 'Morning', shiftStart: '06:00', shiftEnd: '14:00',
    checkIn: '05:52', checkInDate: '', checkOut: '14:12',
    verification: 'ID card scan', override: false, overrideTicket: '',
    officer: 'Ms. Fiona Marsh · SEC-031', gateRegister: 'GT-2026-0806', camera: 'CAM-SG-01',
    history: [
      { title: 'Checked in at the service gate', meta: '05:52 · 8m early' },
      { title: 'Received the FreshLine kitchen delivery', meta: '14:15 · supervised by the store office' },
      { title: 'Checked out after the lunch service', meta: '14:12 · shift completed' },
    ],
    daysPresent: 22, daysInMonth: 22, monthLate: 0, monthMissing: 0,
    averageIn: '05:56', averageOut: '14:08',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '05:58', checkOut: '14:05', gate: 'Service Gate' },
      { date: '29 Jul 2026', checkIn: '05:54', checkOut: '14:10', gate: 'Service Gate' },
    ],
    zones: [
      { zone: 'Main Block · kitchen and dining', allowed: true },
      { zone: 'Kitchen Store · dry store', allowed: true },
      { zone: 'Main Block · admin wing', allowed: false },
    ],
    reportsTo: 'Reports to Administration', officeLocation: 'Main Block · Kitchen',
    notes: 'Opens the kitchen for breakfast prep. Holds the dry store key and signs the daily consumption register.',
  },
  {
    id: 'STE-2026-0955', staffId: 'EMP-2024-093', name: 'Mr. Arjun Nair',
    icon: 'ti ti-bus', tint: 'purple',
    responsibility: 'Route 4 · afternoon run', department: 'Transport',
    designation: 'Bus Driver · BUS-03', contact: '+1 55 4176 2280',
    card: 'EMP-093••••28', vehicle: 'BUS-03',
    gate: 'Service Gate', lane: 'Transport yard · Bay 3',
    shift: 'Evening', shiftStart: '13:00', shiftEnd: '21:00',
    checkIn: '', checkInDate: '', checkOut: '',
    verification: 'Not recorded', override: false, overrideTicket: '',
    officer: '', gateRegister: '', camera: 'CAM-SG-02',
    history: [
      { title: 'Rostered for the evening shift', meta: '13:00 · Route 4' },
      { title: 'No check-in scan recorded', meta: '15:40 · 2h 40m past shift start' },
      { title: 'Transport supervisor notified', meta: '13:20 · relief driver placed on standby' },
    ],
    daysPresent: 19, daysInMonth: 22, monthLate: 4, monthMissing: 1,
    averageIn: '13:12', averageOut: '21:04',
    pastEntries: [
      { date: '30 Jul 2026', checkIn: '13:08', checkOut: '21:02', gate: 'Service Gate' },
      { date: '29 Jul 2026', checkIn: '13:18', checkOut: '21:06', gate: 'Service Gate' },
    ],
    zones: [
      { zone: 'Transport yard · all bays', allowed: true },
      { zone: 'Service Gate · barrier', allowed: true },
      { zone: 'Main Block · teaching areas', allowed: false },
    ],
    reportsTo: 'Reports to Transport Supervisor', officeLocation: 'Transport Yard · Bay 3',
    notes: 'Relief driver placed on standby for the Route 4 afternoon run. Awaiting contact from the supervisor.',
  },
];
