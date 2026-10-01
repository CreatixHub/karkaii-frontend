export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'On Leave' | 'Half Day' | 'Pending';

/** `.dt-pill` modifier the template gives each status. */
export const statusPill: Record<AttendanceStatus, string> = {
  Present: 'is-active',
  Late: 'is-pending',
  Pending: 'is-pending',
  Absent: 'is-inactive',
  'Half Day': 'is-archived',
  'On Leave': 'is-new',
};

export interface PeriodItem {
  code: string;
  /** Everything after the period code, e.g. "08:00 · 10-A · Algebra". */
  text: string;
  badge: { label: string; className: string };
}

export interface InfoRow {
  label: string;
  value: string;
}

export interface AttendanceTimeline {
  checkIn: string;
  /** Copy for the middle node, e.g. "45m total". */
  breakTotal: string;
  checkOut: string;
}

export interface AttendanceDetail {
  /** Null renders the template's "No check-in recorded for this date." line. */
  timeline: AttendanceTimeline | null;
  periodMeta: string;
  periods: PeriodItem[];
  breakOvertime: InfoRow[];
  device: InfoRow[];
  notes: string;
  /**
   * The first row's panel uses `<h4 class="fs-13 mb-2 fw-medium">` for the
   * timeline heading and `<h5>` for Check-In where every other row uses `<h6>`.
   * Kept so the port stays element-for-element with the template.
   */
  timelineHeadingTag?: 'h4' | 'h6';
  timelineHeadingClass?: string;
  checkInTag?: 'h5' | 'h6';
}

export interface TeacherAttendanceRow {
  /** Employee id, e.g. `EMP-T01`. */
  id: string;
  name: string;
  avatar: string;
  department: string;
  subjects: string;
  /** The `.badge-soft-secondary` classes cell, e.g. "10-A, 11-B". */
  classes: string;
  designation: string;
  campus: string;
  checkIn: string;
  checkOut: string;
  workingHours: string;
  breakTime: string;
  overtime: string;
  /** The second row paints its overtime `text-warning`. */
  overtimeClass?: string;
  status: AttendanceStatus;
  method: { label: string; icon: string };
  recordedBy: string;
  lastUpdated: string;
  detail: AttendanceDetail;
}

const HELD = { label: 'Held', className: 'badge badge-soft-success' };
const FREE = { label: 'Free', className: 'badge badge-soft-secondary' };

/** Every row runs the same P1–P4 shape, only the class and subject change. */
const periods = (slot: string): PeriodItem[] => [
  { code: 'P1', text: `08:00 · ${slot}`, badge: HELD },
  { code: 'P2', text: '08:45 · Free Period', badge: FREE },
  { code: 'P3', text: `09:30 · ${slot}`, badge: HELD },
  { code: 'P4', text: '10:15 · Free Period', badge: FREE },
];

const NORMAL_NOTES = 'Attendance recorded normally.';

export const teachers: TeacherAttendanceRow[] = [
  {
    id: 'EMP-T01',
    name: 'Grace Lee',
    avatar: 'assets/img/profiles/avatar-27.jpg',
    department: 'Mathematics',
    subjects: 'Algebra, Calculus',
    classes: '10-A, 11-B',
    designation: 'Senior Teacher',
    campus: 'Main Campus',
    checkIn: '08:02 AM',
    checkOut: '03:32 PM',
    workingHours: '7h 30m',
    breakTime: '45m',
    overtime: '0h',
    status: 'Present',
    method: { label: 'Biometric', icon: 'ti ti-fingerprint' },
    recordedBy: 'System',
    lastUpdated: '08:02 AM',
    detail: {
      timeline: { checkIn: '08:02 AM', breakTotal: '45m total', checkOut: '03:32 PM' },
      periodMeta: '4 held · 2 free',
      periods: periods('10-A · Algebra'),
      breakOvertime: [
        { label: 'Total Break', value: '45m' },
        { label: 'Overtime', value: '0h' },
        { label: 'Classes Conducted', value: '4' },
        { label: 'Free Periods', value: '2' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'Biometric' },
        { label: 'Device', value: 'Staff Room Bio-02' },
        { label: 'Recorded By', value: 'System' },
      ],
      notes: NORMAL_NOTES,
      timelineHeadingTag: 'h4',
      timelineHeadingClass: 'fs-13 mb-2 fw-medium',
      checkInTag: 'h5',
    },
  },
  {
    id: 'EMP-T02',
    name: 'Hassan Ali',
    avatar: 'assets/img/profiles/avatar-23.jpg',
    department: 'Science',
    subjects: 'Physics',
    classes: '11-A, 12-A',
    designation: 'Senior Teacher',
    campus: 'Main Campus',
    checkIn: '08:10 AM',
    checkOut: '04:10 PM',
    workingHours: '8h 00m',
    breakTime: '40m',
    overtime: '30m',
    overtimeClass: 'text-warning',
    status: 'Present',
    method: { label: 'RFID', icon: 'ti ti-nfc' },
    recordedBy: 'System',
    lastUpdated: '08:10 AM',
    detail: {
      timeline: { checkIn: '08:10 AM', breakTotal: '40m total', checkOut: '04:10 PM' },
      periodMeta: '4 held · 2 free',
      periods: periods('11-A · Physics'),
      breakOvertime: [
        { label: 'Total Break', value: '40m' },
        { label: 'Overtime', value: '30m' },
        { label: 'Classes Conducted', value: '4' },
        { label: 'Free Periods', value: '2' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'RFID' },
        { label: 'Device', value: 'Staff Room Bio-02' },
        { label: 'Recorded By', value: 'System' },
      ],
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-T03',
    name: 'Olivia Park',
    avatar: 'assets/img/profiles/avatar-25.jpg',
    department: 'Languages',
    subjects: 'English Lit.',
    classes: '9-A, 9-B',
    designation: 'Assistant Teacher',
    campus: 'Main Campus',
    checkIn: '08:25 AM',
    checkOut: '03:35 PM',
    workingHours: '7h 10m',
    breakTime: '45m',
    overtime: '0h',
    status: 'Late',
    method: { label: 'Biometric', icon: 'ti ti-fingerprint' },
    recordedBy: 'System',
    lastUpdated: '08:25 AM',
    detail: {
      timeline: { checkIn: '08:25 AM', breakTotal: '45m total', checkOut: '03:35 PM' },
      periodMeta: '4 held · 2 free',
      periods: periods('9-A · English Lit.'),
      breakOvertime: [
        { label: 'Total Break', value: '45m' },
        { label: 'Overtime', value: '0h' },
        { label: 'Classes Conducted', value: '4' },
        { label: 'Free Periods', value: '2' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'Biometric' },
        { label: 'Device', value: 'Staff Room Bio-02' },
        { label: 'Recorded By', value: 'System' },
      ],
      notes: 'Arrived late — informed HOD in advance.',
    },
  },
  {
    id: 'EMP-T04',
    name: 'Rohan Das',
    avatar: 'assets/img/profiles/avatar-01.jpg',
    department: 'Science',
    subjects: 'Biology',
    classes: '11-A',
    designation: 'Assistant Teacher',
    campus: 'North Campus',
    checkIn: '—',
    checkOut: '—',
    workingHours: '0h',
    breakTime: '—',
    overtime: '—',
    status: 'Absent',
    method: { label: 'Manual', icon: 'ti ti-writing' },
    recordedBy: 'K. Larry',
    lastUpdated: '09:15 AM',
    detail: {
      timeline: null,
      periodMeta: '4 held · 2 free',
      periods: periods('11-A · Biology'),
      breakOvertime: [
        { label: 'Total Break', value: '—' },
        { label: 'Overtime', value: '—' },
        { label: 'Classes Conducted', value: '0' },
        { label: 'Free Periods', value: '—' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'Manual' },
        { label: 'Device', value: 'Manual Entry' },
        { label: 'Recorded By', value: 'K. Larry' },
      ],
      notes: 'No intimation received. Substitute arranged.',
    },
  },
  {
    id: 'EMP-T05',
    name: 'Ivy Chen',
    avatar: 'assets/img/profiles/avatar-02.jpg',
    department: 'Computer Science',
    subjects: 'Python, Java',
    classes: '10-B',
    designation: 'Assistant Teacher',
    campus: 'North Campus',
    checkIn: '09:00 AM',
    checkOut: '01:00 PM',
    workingHours: '4h 00m',
    breakTime: '0m',
    overtime: '0h',
    status: 'Half Day',
    method: { label: 'Manual', icon: 'ti ti-writing' },
    recordedBy: 'S. Reddy',
    lastUpdated: '01:05 PM',
    detail: {
      timeline: { checkIn: '09:00 AM', breakTotal: '0m total', checkOut: '01:00 PM' },
      periodMeta: '4 held · 2 free',
      periods: periods('10-B · Python'),
      breakOvertime: [
        { label: 'Total Break', value: '0m' },
        { label: 'Overtime', value: '0h' },
        { label: 'Classes Conducted', value: '4' },
        { label: 'Free Periods', value: '2' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'Manual' },
        { label: 'Device', value: 'Manual Entry' },
        { label: 'Recorded By', value: 'S. Reddy' },
      ],
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-T06',
    name: 'Liam Scott',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    department: 'Humanities',
    subjects: 'History',
    classes: '12-A',
    designation: 'Senior Teacher',
    campus: 'Main Campus',
    checkIn: '08:05 AM',
    checkOut: '03:30 PM',
    workingHours: '7h 25m',
    breakTime: '45m',
    overtime: '0h',
    status: 'Present',
    method: { label: 'Biometric', icon: 'ti ti-fingerprint' },
    recordedBy: 'System',
    lastUpdated: '08:05 AM',
    detail: {
      timeline: { checkIn: '08:05 AM', breakTotal: '45m total', checkOut: '03:30 PM' },
      periodMeta: '4 held · 2 free',
      periods: periods('12-A · History'),
      breakOvertime: [
        { label: 'Total Break', value: '45m' },
        { label: 'Overtime', value: '0h' },
        { label: 'Classes Conducted', value: '4' },
        { label: 'Free Periods', value: '2' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'Biometric' },
        { label: 'Device', value: 'Staff Room Bio-02' },
        { label: 'Recorded By', value: 'System' },
      ],
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-T07',
    name: 'Maria Gomez',
    avatar: 'assets/img/profiles/avatar-11.jpg',
    department: 'Arts',
    subjects: 'Fine Arts',
    classes: '8-A, 8-B',
    designation: 'Assistant Teacher',
    campus: 'North Campus',
    checkIn: '—',
    checkOut: '—',
    workingHours: '0h',
    breakTime: '—',
    overtime: '—',
    status: 'On Leave',
    method: { label: 'Manual', icon: 'ti ti-writing' },
    recordedBy: 'S. Reddy',
    lastUpdated: '26 Jul 2026',
    detail: {
      timeline: null,
      periodMeta: '4 held · 2 free',
      periods: periods('8-A · Fine Arts'),
      breakOvertime: [
        { label: 'Total Break', value: '—' },
        { label: 'Overtime', value: '—' },
        { label: 'Classes Conducted', value: '0' },
        { label: 'Free Periods', value: '—' },
        { label: 'Leave Type', value: 'Casual Leave' },
      ],
      device: [
        { label: 'Method', value: 'Manual' },
        { label: 'Device', value: 'Manual Entry' },
        { label: 'Recorded By', value: 'S. Reddy' },
      ],
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-T08',
    name: 'Noah Bennett',
    avatar: 'assets/img/profiles/avatar-16.jpg',
    department: 'Physical Ed.',
    subjects: 'Sports',
    classes: '9-A',
    designation: 'Assistant Teacher',
    campus: 'Main Campus',
    checkIn: '08:58 AM',
    checkOut: '—',
    workingHours: '—',
    breakTime: '—',
    overtime: '—',
    status: 'Pending',
    method: { label: 'RFID', icon: 'ti ti-nfc' },
    recordedBy: 'System',
    lastUpdated: '08:58 AM',
    detail: {
      timeline: { checkIn: '08:58 AM', breakTotal: '— total', checkOut: '—' },
      periodMeta: '4 held · 2 free',
      periods: periods('9-A · Sports'),
      breakOvertime: [
        { label: 'Total Break', value: '—' },
        { label: 'Overtime', value: '—' },
        { label: 'Classes Conducted', value: '4' },
        { label: 'Free Periods', value: '2' },
        { label: 'Leave Type', value: '—' },
      ],
      device: [
        { label: 'Method', value: 'RFID' },
        { label: 'Device', value: 'Staff Room Bio-02' },
        { label: 'Recorded By', value: 'System' },
      ],
      notes: NORMAL_NOTES,
    },
  },
];

/** "08:02 AM" → minutes since midnight; "—" sorts last. */
export const checkInMinutes = (value: string): number => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return Number.MAX_SAFE_INTEGER;
  const hour = Number(match[1]) % 12;
  const offset = match[3].toUpperCase() === 'PM' ? 12 : 0;
  return (hour + offset) * 60 + Number(match[2]);
};

/** "7h 30m" / "0h" → minutes; "—" sorts last. */
export const workedMinutes = (value: string): number => {
  if (!/\d/.test(value)) return -1;
  const hours = /(\d+)\s*h/.exec(value);
  const minutes = /(\d+)\s*m/.exec(value);
  return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
};

/** Derived from the punches, so the Check-in Status filter is real. */
export const checkInState = (row: TeacherAttendanceRow): string => {
  const hasIn = row.checkIn !== '—';
  const hasOut = row.checkOut !== '—';
  if (hasIn && hasOut) return 'Checked Out';
  if (hasIn) return 'Checked In';
  return 'Not Checked In';
};
