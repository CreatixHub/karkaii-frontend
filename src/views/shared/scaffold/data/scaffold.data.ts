/* ------------------------------------------------------------------ *
 * The stat strip                                                     *
 * ------------------------------------------------------------------ */

export const TOTAL_RECORDS = 1248;
export const ACTIVE_RECORDS = 1120;
export const PENDING_RECORDS = 86;
export const THIS_MONTH_RECORDS = 214;

export interface Stat {
  id: string;
  label: string;
  value: string;
  icon: string;
  tint: string;
}

export const STATS: Stat[] = [
  {
    id: 'total',
    label: 'Total Records',
    value: TOTAL_RECORDS.toLocaleString('en-US'),
    icon: 'ti ti-settings-cog',
    tint: 'primary',
  },
  {
    id: 'active',
    label: 'Active',
    value: ACTIVE_RECORDS.toLocaleString('en-US'),
    icon: 'ti ti-circle-check',
    tint: 'success',
  },
  {
    id: 'pending',
    label: 'Pending',
    value: PENDING_RECORDS.toLocaleString('en-US'),
    icon: 'ti ti-clock',
    tint: 'warning',
  },
  {
    id: 'month',
    label: 'This Month',
    value: THIS_MONTH_RECORDS.toLocaleString('en-US'),
    icon: 'ti ti-calendar',
    tint: 'info',
  },
];

/* ------------------------------------------------------------------ *
 * The generated sequences                                            *
 * ------------------------------------------------------------------ */

export type RecordStatus = 'Active' | 'Pending' | 'Completed' | 'Inactive' | 'Scheduled';

/** The status the template cycles through, in order. */
export const STATUS_CYCLE: RecordStatus[] = [
  'Active',
  'Pending',
  'Completed',
  'Active',
  'Inactive',
  'Scheduled',
];

export const STATUS_TINT: Record<RecordStatus, string> = {
  Active: 'success',
  Pending: 'warning',
  Completed: 'info',
  Inactive: 'danger',
  Scheduled: 'secondary',
};

/** The avatar tints cycle by position, not by status — the template's own order. */
export const AVATAR_TINTS = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

const REFERENCE_BASE = 74820;
const MEMBERS_BASE = 120;
const MEMBERS_STEP = 40;

/** The dates the cards carry, in order. */
export const UPDATED_ON = [
  '12 May 2026',
  '03 Jun 2026',
  '18 Jun 2026',
  '24 Jun 2026',
  '01 Jul 2026',
  '09 Jul 2026',
];

export interface RecordCard {
  id: string;
  name: string;
  reference: string;
  members: number;
  updatedOn: string;
  status: RecordStatus;
  tint: string;
}

/** The six cards a records page shows, named after whatever the page manages. */
export const recordsFor = (noun: string, count = UPDATED_ON.length): RecordCard[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${noun}-${index + 1}`,
    name: `${noun} ${index + 1}`,
    reference: `PRE${REFERENCE_BASE + index}`,
    members: MEMBERS_BASE + index * MEMBERS_STEP,
    updatedOn: UPDATED_ON[index % UPDATED_ON.length],
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    tint: AVATAR_TINTS[index % AVATAR_TINTS.length],
  }));

/* ------------------------------------------------------------------ *
 * The branch table                                                   *
 * ------------------------------------------------------------------ */

const BRANCH_NAMES = [
  'Aaron Cooper',
  'Bianca Reid',
  'Carlos Mendez',
  'Dana White',
  'Ethan Brooks',
  'Fatima Noor',
  'Grace Lee',
  'Hassan Ali',
];

const STUDENTS_BASE = 12;
const STUDENTS_STEP = 7;
const REVENUE_BASE = 1200;
const REVENUE_STEP = 137;

export interface Branch {
  id: string;
  name: string;
  students: number;
  /** The template prints the same figure for students and staff. */
  staff: number;
  revenue: number;
  status: RecordStatus;
  tint: string;
}

export const BRANCHES: Branch[] = BRANCH_NAMES.map((name, index) => {
  const students = STUDENTS_BASE + index * STUDENTS_STEP;
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    students,
    staff: students,
    revenue: REVENUE_BASE + index * REVENUE_STEP,
    status: STATUS_CYCLE[index % STATUS_CYCLE.length],
    tint: AVATAR_TINTS[index % AVATAR_TINTS.length],
  };
});

/** Branches on the register, against the eight the table shows. */
export const BRANCH_TOTAL = 48;

export const money = (amount: number) => `$${amount.toLocaleString('en-US')}`;

/* ------------------------------------------------------------------ *
 * The settings form                                                  *
 * ------------------------------------------------------------------ */

export const INSTITUTIONS = ['Global International', 'Sunrise Public School', 'Riverside Academy'];

export const ACADEMIC_YEARS = ['2024 / 2025', '2023 / 2024'];

export const STATUS_OPTIONS: RecordStatus[] = ['Active', 'Pending', 'Inactive'];

/**
 * The three switches every settings page carries. The first names the page, so
 * it is built from the title rather than repeated ten times.
 */
export const switchesFor = (title: string) => [
  {
    id: 'enable',
    label: `Enable ${title}`,
    note: 'Turn this configuration on or off for the institution',
  },
  {
    id: 'notify',
    label: 'Send notifications',
    note: 'Notify administrators when this configuration changes',
  },
  {
    id: 'approve',
    label: 'Require approval',
    note: 'Changes must be approved before they take effect',
  },
];

/* ------------------------------------------------------------------ *
 * The log table                                                      *
 * ------------------------------------------------------------------ */

/**
 * The three log pages — Activity Logs, Login Activity, System Logs — print the
 * same eight rows, and print action words in both the User and the IP column.
 * That is the template's own generation quirk, kept here rather than corrected
 * so the pages match what ships; the two columns run on different offsets into
 * the same list, which is why they never agree.
 */
const LOG_ACTIONS = ['Update', 'Export', 'Delete', 'Create', 'Login'];

/** The dates the log rows carry — the card dates, run on two more. */
export const LOG_DATES = [...UPDATED_ON, '15 Jul 2026', '21 Jul 2026'];

export interface LogRow {
  id: string;
  event: string;
  user: string;
  date: string;
  ip: string;
  status: RecordStatus;
  tint: string;
}

export const LOG_ROWS: LogRow[] = BRANCH_NAMES.map((name, index) => ({
  id: `log-${index + 1}`,
  event: name,
  user: LOG_ACTIONS[index % LOG_ACTIONS.length],
  date: LOG_DATES[index % LOG_DATES.length],
  ip: LOG_ACTIONS[(index + 2) % LOG_ACTIONS.length],
  status: STATUS_CYCLE[index % STATUS_CYCLE.length],
  tint: AVATAR_TINTS[index % AVATAR_TINTS.length],
}));

/** Entries on the register, against the eight the table shows. */
export const LOG_TOTAL = 48;
