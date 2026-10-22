import type { DetailAccent } from './attendanceRegister.data';

export const weeklyTrendAxis = [
  { day: 'Mon', pct: '94.1%' },
  { day: 'Tue', pct: '95.6%' },
  { day: 'Wed', pct: '92.8%' },
  { day: 'Thu', pct: '96.2%' },
  { day: 'Fri', pct: '96.8%' },
];

export interface LateBar {
  count: number;
  height: number;
  label: string;
  peak?: boolean;
}

export const lateArrivalBars: LateBar[] = [
  { count: 2, height: 20, label: '<5m' },
  { count: 6, height: 55, label: '5–10m' },
  { count: 9, height: 88, label: '10–20m', peak: true },
  { count: 4, height: 38, label: '20–30m' },
  { count: 1, height: 12, label: '>30m' },
];

export interface LeaveCompareRow {
  variant: DetailAccent;
  label: string;
  pct: number;
}

export const leaveAnalysisRows: LeaveCompareRow[] = [
  { variant: 'leave', label: 'Medical', pct: 54 },
  { variant: 'info', label: 'Family', pct: 23 },
  { variant: 'violet', label: 'Emergency', pct: 12 },
  { variant: 'muted', label: 'Other', pct: 11 },
];

export interface LeaveTotalStat {
  variant: 'late' | 'present' | 'absent';
  count: number;
  label: string;
}

export const leaveAnalysisStats: LeaveTotalStat[] = [
  { variant: 'late', count: 18, label: 'Pending' },
  { variant: 'present', count: 126, label: 'Approved' },
  { variant: 'absent', count: 9, label: 'Rejected' },
];

export interface TimelineRow {
  variant: DetailAccent;
  time: string;
  title: string;
  subtitle: string;
}

export const timelineRows: TimelineRow[] = [
  { variant: 'present', time: '07:41', title: 'Gate check-in opened', subtitle: 'Face recognition · Gates 1 & 2' },
  { variant: 'late', time: '08:34', title: '5 late arrivals recorded', subtitle: 'Route 07 delay · 19 min average' },
  { variant: 'info', time: '08:45', title: 'Class attendance marked', subtitle: '42 of 42 sections · period 1–2' },
  { variant: 'violet', time: '10:05', title: 'Medical room visit', subtitle: 'Emeley Karen · sent home at 10:40' },
];

export type InsightSegment = string | { bold: string };

export interface InsightCard {
  id: string;
  variant: DetailAccent;
  icon: string;
  title: string;
  badge: string;
  badgeVariant: DetailAccent;
  paragraph: InsightSegment[];
  confidence: number;
  footerNote: string;
  footerButton: { label: string; kind: 'action' | 'modal'; value: string };
}

export const insightCards: InsightCard[] = [
  {
    id: 'low-attendance',
    variant: 'absent',
    icon: 'ti ti-user-x',
    title: 'Low Attendance Students',
    badge: '8',
    badgeVariant: 'absent',
    paragraph: [
      { bold: '8 students' },
      ' are below the 75% exam-eligibility threshold. Six of them sit in ',
      { bold: 'Grade VI-B' },
      '.',
    ],
    confidence: 74,
    footerNote: 'Eligibility at risk',
    footerButton: { label: 'Open list', kind: 'action', value: 'risk' },
  },
  {
    id: 'prediction',
    variant: 'present',
    icon: 'ti ti-chart-dots',
    title: 'Attendance Prediction',
    badge: 'Next week',
    badgeVariant: 'present',
    paragraph: ['Projected attendance of ', { bold: '96.2%' }, ' next week. Wednesday remains the weakest day at an expected 93%.'],
    confidence: 91,
    footerNote: 'Confidence: high',
    footerButton: { label: 'Explain', kind: 'action', value: 'explain' },
  },
  {
    id: 'late-arrivals',
    variant: 'late',
    icon: 'ti ti-clock-exclamation',
    title: 'Frequent Late Arrivals',
    badge: '22',
    badgeVariant: 'late',
    paragraph: [
      { bold: 'Route 07' },
      ' drives 14 of 22 late arrivals. Joann Michael has been late ',
      { bold: '9 times' },
      ' this term.',
    ],
    confidence: 64,
    footerNote: 'Transport-linked',
    footerButton: { label: 'Adjust route', kind: 'action', value: 'reschedule' },
  },
  {
    id: 'leave-pattern',
    variant: 'violet',
    icon: 'ti ti-wave-square',
    title: 'Leave Pattern Analysis',
    badge: 'Behaviour',
    badgeVariant: 'violet',
    paragraph: [
      'Leave requests cluster on ',
      { bold: 'Mondays and Fridays' },
      ', and spike the week before each exam block.',
    ],
    confidence: 78,
    footerNote: 'Seasonal pattern',
    footerButton: { label: 'Review leave', kind: 'modal', value: 'att_leave' },
  },
  {
    id: 'improvement',
    variant: 'info',
    icon: 'ti ti-bulb',
    title: 'Improvement Suggestions',
    badge: '3 actions',
    badgeVariant: 'info',
    paragraph: [
      'Move Route 07 pickup ',
      { bold: '10 minutes earlier' },
      ', run a Grade VI-B guardian meeting, and enable same-day SMS alerts.',
    ],
    confidence: 86,
    footerNote: 'Est. +2.1% attendance',
    footerButton: { label: 'Apply plan', kind: 'action', value: 'apply_plan' },
  },
  {
    id: 'parent-notification',
    variant: 'warn',
    icon: 'ti ti-message-2',
    title: 'Parent Notification',
    badge: '12 due',
    badgeVariant: 'late',
    paragraph: [
      { bold: '12 guardians' },
      " have not been notified of today's absence. Response rate is highest when sent before 10:00.",
    ],
    confidence: 58,
    footerNote: 'Send window closing',
    footerButton: { label: 'Send now', kind: 'modal', value: 'att_notify' },
  },
];

export interface LeaveRequestLine {
  img: string;
  name: string;
  when: string;
}

export const leaveRequestLines: LeaveRequestLine[] = [
  { img: 'assets/img/students/student-05.jpg', name: 'Emeley Karen · Medical', when: '22–24 Jul · certificate attached' },
  { img: 'assets/img/students/student-11.jpg', name: 'Ella Simpson · Family', when: '24 Jul · wedding' },
  { img: 'assets/img/students/student-09.jpg', name: 'Daniel Josh · Emergency', when: 'Today · no document' },
  { img: 'assets/img/students/student-03.jpg', name: 'Sophia Ray · Medical', when: '25–26 Jul · dental' },
];

export const leaveTabs: { id: 'pending' | 'approved' | 'rejected'; label: string; count: string }[] = [
  { id: 'pending', label: 'Pending', count: '18' },
  { id: 'approved', label: 'Approved', count: '126' },
  { id: 'rejected', label: 'Rejected', count: '9' },
];

export interface ActivityLine {
  img: string;
  segments: InsightSegment[];
  when: string;
  badge: string;
  badgeVariant: DetailAccent;
}

export const activityLines: ActivityLine[] = [
  {
    img: 'assets/img/teachers/teacher-01.jpg',
    segments: [{ bold: 'Ms. Teresa Susan' }, ' recorded attendance for ', { bold: 'Grade III-A' }],
    when: 'Today · 08:45',
    badge: 'Recorded',
    badgeVariant: 'present',
  },
  {
    img: 'assets/img/profiles/avatar-27.jpg',
    segments: [{ bold: 'Robert Daniel' }, ' approved medical leave for ', { bold: 'Emeley Karen' }],
    when: 'Today · 13:20',
    badge: 'Approved',
    badgeVariant: 'present',
  },
  {
    img: 'assets/img/students/student-02.jpg',
    segments: [{ bold: 'Joann Michael' }, ' marked late — ', { bold: '19 minutes' }],
    when: 'Today · 08:34',
    badge: 'Late',
    badgeVariant: 'late',
  },
  {
    img: 'assets/img/teachers/teacher-02.jpg',
    segments: [{ bold: 'Mr. John Doe' }, ' updated status for ', { bold: 'Aaron Kessler' }],
    when: 'Today · 09:12',
    badge: 'Updated',
    badgeVariant: 'info',
  },
  {
    img: 'assets/img/profiles/avatar-25.jpg',
    segments: ['SMS sent to ', { bold: '12 guardians' }, " about today's absence"],
    when: 'Today · 09:30',
    badge: 'Notified',
    badgeVariant: 'violet',
  },
];

export interface NotificationLine {
  icon: string;
  variant: DetailAccent;
  title: string;
  subtitle: string;
  badge: string;
  badgeVariant: DetailAccent;
}

export const notificationGroups: { label: string; items: NotificationLine[] }[] = [
  {
    label: 'Needs attention',
    items: [
      {
        icon: 'ti ti-user-x',
        variant: 'absent',
        title: 'Low attendance alert',
        subtitle: '8 students below the 75% threshold',
        badge: '8',
        badgeVariant: 'absent',
      },
      {
        icon: 'ti ti-clock-exclamation',
        variant: 'late',
        title: 'Late arrival alert',
        subtitle: '5 students late · Route 07 delay',
        badge: '5',
        badgeVariant: 'late',
      },
      {
        icon: 'ti ti-help-circle',
        variant: 'warn',
        title: 'Missing attendance',
        subtitle: '14 sections unmarked for period 3',
        badge: '14',
        badgeVariant: 'late',
      },
    ],
  },
  {
    label: 'Awaiting action',
    items: [
      {
        icon: 'ti ti-calendar-off',
        variant: 'violet',
        title: 'Pending leave requests',
        subtitle: '18 requests · oldest waiting 3 days',
        badge: '18',
        badgeVariant: 'violet',
      },
      {
        icon: 'ti ti-message-2',
        variant: 'info',
        title: 'Parent responses',
        subtitle: '7 guardians replied to absence SMS',
        badge: '7',
        badgeVariant: 'info',
      },
    ],
  },
];
