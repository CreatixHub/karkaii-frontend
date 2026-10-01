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
  breakOvertime: InfoRow[];
  leaveCorrections: InfoRow[];
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

export interface StaffAttendanceRow {
  /** Employee id, e.g. `EMP-1001`. */
  id: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  shift: string;
  /** Filter-only facet; the template offers Teaching / Administrative / Support. */
  staffType: string;
  /** Filter-only facet. */
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

const BIOMETRIC = { label: 'Biometric', icon: 'ti ti-fingerprint' };
const RFID = { label: 'RFID', icon: 'ti ti-nfc' };
const MANUAL = { label: 'Manual', icon: 'ti ti-writing' };

const NORMAL_NOTES = 'Attendance recorded normally.';

const GATE_DEVICE = 'Main Gate Bio-01';
const MANUAL_DEVICE = 'Manual Entry';

/** Every panel's third column runs the same three labels. */
const leave = (leaveType: string, approvedBy: string): InfoRow[] => [
  { label: 'Leave Type', value: leaveType },
  { label: 'Corrections', value: '0' },
  { label: 'Approved By', value: approvedBy },
];

/** …and its fourth column the same three. */
const device = (method: string, deviceName: string, recordedBy: string): InfoRow[] => [
  { label: 'Method', value: method },
  { label: 'Device', value: deviceName },
  { label: 'Recorded By', value: recordedBy },
];

const breakOvertime = (
  totalBreak: string,
  overtime: string,
  workingHours: string,
  shift: string,
): InfoRow[] => [
  { label: 'Total Break', value: totalBreak },
  { label: 'Overtime', value: overtime },
  { label: 'Working Hours', value: workingHours },
  { label: 'Shift', value: shift },
];

export const staffRoster: StaffAttendanceRow[] = [
  {
    id: 'EMP-1001',
    name: 'Grace Lee',
    avatar: 'assets/img/profiles/avatar-27.jpg',
    department: 'Mathematics',
    designation: 'Senior Teacher',
    shift: 'Morning',
    staffType: 'Teaching',
    campus: 'Main Campus',
    checkIn: '08:02 AM',
    checkOut: '03:32 PM',
    workingHours: '7h 30m',
    breakTime: '45m',
    overtime: '0h',
    status: 'Present',
    method: BIOMETRIC,
    recordedBy: 'System',
    lastUpdated: '08:02 AM',
    detail: {
      timeline: { checkIn: '08:02 AM', breakTotal: '45m total', checkOut: '03:32 PM' },
      breakOvertime: breakOvertime('45m', '0h', '7h 30m', 'Morning'),
      leaveCorrections: leave('—', 'System'),
      device: device('Biometric', GATE_DEVICE, 'System'),
      notes: NORMAL_NOTES,
      timelineHeadingTag: 'h4',
      timelineHeadingClass: 'fs-13 mb-2 fw-medium',
      checkInTag: 'h5',
    },
  },
  {
    id: 'EMP-1002',
    name: 'Hassan Ali',
    avatar: 'assets/img/profiles/avatar-23.jpg',
    department: 'Science',
    designation: 'Physics Teacher',
    shift: 'Morning',
    staffType: 'Teaching',
    campus: 'Main Campus',
    checkIn: '08:10 AM',
    checkOut: '04:10 PM',
    workingHours: '8h 00m',
    breakTime: '40m',
    overtime: '30m',
    overtimeClass: 'text-warning',
    status: 'Present',
    method: RFID,
    recordedBy: 'System',
    lastUpdated: '08:10 AM',
    detail: {
      timeline: { checkIn: '08:10 AM', breakTotal: '40m total', checkOut: '04:10 PM' },
      breakOvertime: breakOvertime('40m', '30m', '8h 00m', 'Morning'),
      leaveCorrections: leave('—', 'System'),
      device: device('RFID', GATE_DEVICE, 'System'),
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-1003',
    name: 'Olivia Park',
    avatar: 'assets/img/profiles/avatar-25.jpg',
    department: 'Languages',
    designation: 'English Teacher',
    shift: 'Morning',
    staffType: 'Teaching',
    campus: 'Main Campus',
    checkIn: '08:25 AM',
    checkOut: '03:35 PM',
    workingHours: '7h 10m',
    breakTime: '45m',
    overtime: '0h',
    status: 'Late',
    method: BIOMETRIC,
    recordedBy: 'System',
    lastUpdated: '08:25 AM',
    detail: {
      timeline: { checkIn: '08:25 AM', breakTotal: '45m total', checkOut: '03:35 PM' },
      breakOvertime: breakOvertime('45m', '0h', '7h 10m', 'Morning'),
      leaveCorrections: leave('—', 'System'),
      device: device('Biometric', GATE_DEVICE, 'System'),
      notes: 'Arrived 25 min late — traffic delay noted.',
    },
  },
  {
    id: 'EMP-1004',
    name: 'Rohan Das',
    avatar: 'assets/img/profiles/avatar-01.jpg',
    department: 'Science',
    designation: 'Biology Teacher',
    shift: 'Morning',
    staffType: 'Teaching',
    campus: 'Main Campus',
    checkIn: '—',
    checkOut: '—',
    workingHours: '0h',
    breakTime: '—',
    overtime: '—',
    status: 'Absent',
    method: MANUAL,
    recordedBy: 'K. Larry',
    lastUpdated: '09:15 AM',
    detail: {
      timeline: null,
      breakOvertime: breakOvertime('—', '—', '0h', 'Morning'),
      leaveCorrections: leave('—', 'K. Larry'),
      device: device('Manual', MANUAL_DEVICE, 'K. Larry'),
      notes: 'No intimation received. Follow-up required.',
    },
  },
  {
    id: 'EMP-1005',
    name: 'Ivy Chen',
    avatar: 'assets/img/profiles/avatar-02.jpg',
    department: 'Finance',
    designation: 'Accountant',
    shift: 'General',
    staffType: 'Administrative',
    campus: 'Main Campus',
    checkIn: '09:00 AM',
    checkOut: '01:00 PM',
    workingHours: '4h 00m',
    breakTime: '0m',
    overtime: '0h',
    status: 'Half Day',
    method: MANUAL,
    recordedBy: 'S. Reddy',
    lastUpdated: '01:05 PM',
    detail: {
      timeline: { checkIn: '09:00 AM', breakTotal: '0m total', checkOut: '01:00 PM' },
      breakOvertime: breakOvertime('0m', '0h', '4h 00m', 'General'),
      leaveCorrections: leave('—', 'S. Reddy'),
      device: device('Manual', MANUAL_DEVICE, 'S. Reddy'),
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-1006',
    name: 'Liam Scott',
    avatar: 'assets/img/profiles/avatar-05.jpg',
    department: 'Humanities',
    designation: 'History Teacher',
    shift: 'Morning',
    staffType: 'Teaching',
    campus: 'North Campus',
    checkIn: '08:05 AM',
    checkOut: '03:30 PM',
    workingHours: '7h 25m',
    breakTime: '45m',
    overtime: '0h',
    status: 'Present',
    method: BIOMETRIC,
    recordedBy: 'System',
    lastUpdated: '08:05 AM',
    detail: {
      timeline: { checkIn: '08:05 AM', breakTotal: '45m total', checkOut: '03:30 PM' },
      breakOvertime: breakOvertime('45m', '0h', '7h 25m', 'Morning'),
      leaveCorrections: leave('—', 'System'),
      device: device('Biometric', GATE_DEVICE, 'System'),
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-1007',
    name: 'Maria Gomez',
    avatar: 'assets/img/profiles/avatar-11.jpg',
    department: 'Library',
    designation: 'Librarian',
    shift: 'Morning',
    staffType: 'Support',
    campus: 'Main Campus',
    checkIn: '—',
    checkOut: '—',
    workingHours: '0h',
    breakTime: '—',
    overtime: '—',
    status: 'On Leave',
    method: MANUAL,
    recordedBy: 'S. Reddy',
    lastUpdated: '26 Jul 2026',
    detail: {
      timeline: null,
      breakOvertime: breakOvertime('—', '—', '0h', 'Morning'),
      leaveCorrections: leave('Casual Leave', 'S. Reddy'),
      device: device('Manual', MANUAL_DEVICE, 'S. Reddy'),
      notes: NORMAL_NOTES,
    },
  },
  {
    id: 'EMP-1008',
    name: 'Noah Bennett',
    avatar: 'assets/img/profiles/avatar-16.jpg',
    department: 'HR',
    designation: 'HR Executive',
    shift: 'General',
    staffType: 'Administrative',
    campus: 'Main Campus',
    checkIn: '08:58 AM',
    checkOut: '—',
    workingHours: '—',
    breakTime: '—',
    overtime: '—',
    status: 'Pending',
    method: RFID,
    recordedBy: 'System',
    lastUpdated: '08:58 AM',
    detail: {
      timeline: { checkIn: '08:58 AM', breakTotal: '— total', checkOut: '—' },
      breakOvertime: breakOvertime('—', '—', '—', 'General'),
      leaveCorrections: leave('—', 'System'),
      device: device('RFID', GATE_DEVICE, 'System'),
      notes: NORMAL_NOTES,
    },
  },
];

/* -------------------------------- Derivations ------------------------------- */

/** "08:02 AM" → 482. Rows with no punch sort last. */
export const checkInMinutes = (value: string): number => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(value.trim());
  if (!match) return Number.MAX_SAFE_INTEGER;

  const [, rawHour, minutes, meridiem] = match;
  let hour = Number(rawHour) % 12;
  if (meridiem.toUpperCase() === 'PM') hour += 12;
  return hour * 60 + Number(minutes);
};

/** "7h 30m" → 450, so the Working Hours sort can order on it. */
export const workedMinutes = (value: string): number => {
  const hours = /(\d+)\s*h/i.exec(value);
  const minutes = /(\d+)\s*m/i.exec(value);
  if (!hours && !minutes) return 0;
  return Number(hours?.[1] ?? 0) * 60 + Number(minutes?.[1] ?? 0);
};

/** Backs the template's "Check-in Status" filter, which has no column of its own. */
export const checkInState = (row: StaffAttendanceRow): string => {
  if (row.checkIn === '—') return 'Not Checked In';
  return row.checkOut === '—' ? 'Checked In' : 'Checked Out';
};
