export const CHART_COLORS = {
  green: '#0ca678',
  red: '#e7515a',
  yellow: '#f39c12',
  blue: '#3577f1',
};

export const students = [
  'Janet Daniel (AD9892434)',
  'George Kettut (AD9892421)',
  'Aaralyn Maria (AD100234)',
];
export const academicYears = ['2024 / 2025', '2023 / 2024'];
export const classes = ['III', 'II', 'I'];
export const sections = ['A', 'B'];
export const months = ['July 2026', 'June 2026', 'May 2026'];

export interface StatCard {
  id: string;
  variant: string;
  icon: string;
  iconClass: string;
  badge?: { icon: string; label: string; className: string };
  value: string;
  label: string;
  labelClass: string;
  progress?: { width: string; className: string };
}

export const statCards: StatCard[] = [
  {
    id: 'today',
    variant: 'stat-primary',
    icon: 'ti ti-calendar-check',
    iconClass: 'bg-primary-transparent text-primary',
    badge: { icon: 'ti ti-circle-check', label: '08:45 AM', className: 'badge-soft-success' },
    value: 'Present',
    label: "Today's Attendance",
    labelClass: 'mb-0',
  },
  {
    id: 'monthly',
    variant: 'stat-info',
    icon: 'ti ti-calendar-month',
    iconClass: 'bg-info-transparent text-info',
    badge: { icon: 'ti ti-calendar', label: 'Days', className: 'badge-soft-info' },
    value: '21 / 23',
    label: 'Monthly Attendance',
    labelClass: 'mb-0',
  },
  {
    id: 'present',
    variant: 'stat-success',
    icon: 'ti ti-circle-check',
    iconClass: 'bg-success-transparent text-success',
    value: '91.3%',
    label: 'Present %',
    labelClass: 'mb-1',
    progress: { width: '91%', className: 'bg-success' },
  },
  {
    id: 'absent',
    variant: 'stat-danger',
    icon: 'ti ti-circle-x',
    iconClass: 'bg-danger-transparent text-danger',
    value: '8.7%',
    label: 'Absent %',
    labelClass: 'mb-1',
    progress: { width: '9%', className: 'bg-danger' },
  },
  {
    id: 'late',
    variant: 'stat-warning',
    icon: 'ti ti-clock-exclamation',
    iconClass: 'bg-warning-transparent text-warning',
    badge: { icon: 'ti ti-calendar-month', label: 'Month', className: 'badge-soft-warning' },
    value: '2',
    label: 'Late',
    labelClass: 'mb-0',
  },
  {
    id: 'leave',
    variant: 'stat-secondary',
    icon: 'ti ti-plane-departure',
    iconClass: 'bg-secondary-transparent text-secondary',
    badge: { icon: 'ti ti-check', label: 'Approved', className: 'badge-soft-info' },
    value: '1',
    label: 'Leave',
    labelClass: 'mb-0',
  },
];

/** One entry per calendar cell; `muted` cells sit outside the month. */
export interface CalendarCell {
  day: string;
  status?: 'present' | 'absent' | 'late' | 'leave';
}

export const calendarWeeks: CalendarCell[][] = [
  [
    { day: '29' }, { day: '30' }, { day: '1', status: 'present' }, { day: '2', status: 'present' },
    { day: '3', status: 'late' }, { day: '4', status: 'present' }, { day: '5' },
  ],
  [
    { day: '6' }, { day: '7', status: 'present' }, { day: '8', status: 'present' },
    { day: '9', status: 'absent' }, { day: '10', status: 'present' }, { day: '11', status: 'present' },
    { day: '12' },
  ],
  [
    { day: '13' }, { day: '14', status: 'present' }, { day: '15', status: 'leave' },
    { day: '16', status: 'present' }, { day: '17', status: 'present' }, { day: '18', status: 'late' },
    { day: '19' },
  ],
  [
    { day: '20' }, { day: '21', status: 'present' }, { day: '22', status: 'present' },
    { day: '23', status: 'present' }, { day: '24', status: 'present' }, { day: '25', status: 'present' },
    { day: '26' },
  ],
  [
    { day: '27' }, { day: '28', status: 'present' }, { day: '29', status: 'present' },
    { day: '30', status: 'present' }, { day: '31', status: 'present' }, { day: '1' }, { day: '2' },
  ],
];

export const calendarLegend = [
  { label: 'Present', className: 'text-success' },
  { label: 'Absent', className: 'text-danger' },
  { label: 'Late', className: 'text-warning' },
  { label: 'Leave', className: 'text-info' },
];

export const monthTotals = [
  { label: 'Present', className: 'text-success', value: '21' },
  { label: 'Absent', className: 'text-danger', value: '2' },
  { label: 'Late', className: 'text-warning', value: '2' },
  { label: 'Leave', className: 'text-info', value: '1' },
];

export interface AttendanceRow {
  id: string;
  date: string;
  className: string;
  section: string;
  subject: string;
  status: { label: string; className: string };
  timeIn: string;
  timeOut: string;
  teacher: string;
  remarks: string;
}

export const attendanceRows: AttendanceRow[] = [
  { id: 'r1', date: '04 Jul 2026', className: 'III', section: 'A', subject: 'Maths', status: { label: 'Present', className: 'badge-soft-success' }, timeIn: '08:45 AM', timeOut: '03:30 PM', teacher: 'Teena Mathew', remarks: '—' },
  { id: 'r2', date: '03 Jul 2026', className: 'III', section: 'A', subject: 'Science', status: { label: 'Late', className: 'badge-soft-warning' }, timeIn: '09:20 AM', timeOut: '03:30 PM', teacher: 'Daniel Josua', remarks: 'Traffic delay' },
  { id: 'r3', date: '02 Jul 2026', className: 'III', section: 'A', subject: 'English', status: { label: 'Present', className: 'badge-soft-success' }, timeIn: '08:40 AM', timeOut: '03:30 PM', teacher: 'Hellana Robert', remarks: '—' },
  { id: 'r4', date: '01 Jul 2026', className: 'III', section: 'A', subject: 'Maths', status: { label: 'Present', className: 'badge-soft-success' }, timeIn: '08:42 AM', timeOut: '03:30 PM', teacher: 'Teena Mathew', remarks: '—' },
  { id: 'r5', date: '15 Jun 2026', className: 'III', section: 'A', subject: '—', status: { label: 'Leave', className: 'badge-soft-info' }, timeIn: '—', timeOut: '—', teacher: '—', remarks: 'Medical leave (approved)' },
  { id: 'r6', date: '09 Jun 2026', className: 'III', section: 'A', subject: '—', status: { label: 'Absent', className: 'badge-soft-danger' }, timeIn: '—', timeOut: '—', teacher: '—', remarks: 'No intimation' },
];

export const timelineEntries = [
  { id: 't1', tint: 'bg-success', icon: 'ti ti-check', title: '04 Jul 2026 — Present', detail: 'Maths · In 08:45 AM · Out 03:30 PM · Teena Mathew', heading: 'h5' },
  { id: 't2', tint: 'bg-warning', icon: 'ti ti-clock', title: '03 Jul 2026 — Late', detail: 'Science · In 09:20 AM · Traffic delay', heading: 'h6' },
  { id: 't3', tint: 'bg-info', icon: 'ti ti-plane-departure', title: '15 Jun 2026 — Leave', detail: 'Medical leave (approved)', heading: 'h6' },
  { id: 't4', tint: 'bg-danger', icon: 'ti ti-x', title: '09 Jun 2026 — Absent', detail: 'No intimation', heading: 'h6', last: true },
];

export const filterSubjects = ['All', 'Maths', 'Science', 'English'];
export const filterStatuses = ['All', 'Present', 'Absent', 'Late', 'Leave'];
