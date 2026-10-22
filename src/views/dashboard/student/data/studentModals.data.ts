import type { InfoRow } from '../../shared/types';
import type { TimelineEntry } from './studentDashboard.data';

const TERTIARY = 'bg-body-tertiary';
const ICON_WRAP = 'info-list-icon';
const ICON_MUTED = 'bg-body-secondary text-body-secondary';
const ICON_DANGER = 'bg-danger-transparent text-danger';

function iconRow(
  id: string,
  icon: string,
  title: string,
  subtitle: string,
  extra: Partial<InfoRow> = {},
): InfoRow {
  return {
    id,
    icon,
    iconWrapClass: ICON_WRAP,
    iconClass: ICON_MUTED,
    itemClass: TERTIARY,
    title,
    subtitle,
    ...extra,
  };
}

/* --------------------------------- Timetable ------------------------------- */

export interface ModalLesson {
  id: string;
  time: string;
  duration: string;
  subject: string;
  borderClass: string;
  teacher: string;
  room: string;
  status: { label: string; className: string; icon?: string };
  live?: boolean;
}

export const timetableLessons: ModalLesson[] = [
  { id: 'tl1', time: '08:00', duration: '45 min', subject: 'Mathematics', borderClass: 'border-success', teacher: 'Ms. Teresa Susan', room: 'Room 204', status: { label: 'Done', className: 'badge badge-soft-secondary', icon: 'ti ti-check' } },
  { id: 'tl2', time: '09:00', duration: '45 min', subject: 'Science — Physics', borderClass: 'border-danger', teacher: 'Mr. John Doe', room: 'Lab 02', status: { label: 'Live', className: 'badge badge-danger' }, live: true },
  { id: 'tl3', time: '10:15', duration: '45 min', subject: 'English', borderClass: 'border-warning', teacher: 'Ms. Rita Owen', room: 'Room 108', status: { label: 'Next', className: 'badge badge-soft-warning' } },
  { id: 'tl4', time: '11:15', duration: '45 min', subject: 'Geography', borderClass: 'border-info', teacher: 'Mr. Alan Poe', room: 'Room 110', status: { label: '11:15', className: 'badge badge-soft-warning' } },
  { id: 'tl5', time: '13:00', duration: '45 min', subject: 'Computer Science', borderClass: 'border-purple', teacher: 'Ms. Nina Patel', room: 'Lab 01', status: { label: '13:00', className: 'badge badge-soft-warning' } },
  { id: 'tl6', time: '14:00', duration: '45 min', subject: 'Physical Education', borderClass: 'border-teal', teacher: 'Mr. Ray Cole', room: 'Ground', status: { label: '14:00', className: 'badge badge-soft-warning' } },
];

/* -------------------------------- Assignment ------------------------------- */

export const assignmentOptions = [
  'Algebra Worksheet 4 — Maths',
  'Essay: My Favourite Season — English',
  'Map Study — Geography',
  'Scratch Animation — Computer',
];

export const pendingAssignments: InfoRow[] = [
  iconRow('pa1', 'ti ti-math-symbols', 'Algebra Worksheet 4', 'Maths · due today', { endBadge: { label: 'Pending', className: 'badge-soft-warning' } }),
  iconRow('pa2', 'ti ti-book', 'Essay: My Favourite Season', 'English · due tomorrow', { endBadge: { label: 'Pending', className: 'badge-soft-warning' } }),
];

/* ---------------------------------- Results -------------------------------- */

export const resultTiles = [
  { id: 'marks', value: '460/500', label: 'Unit Test II', borderClass: 'border-success' },
  { id: 'grade', value: 'A+', label: 'Grade', borderClass: 'border-primary' },
  { id: 'rank', value: '3rd', label: 'Class Rank', borderClass: 'border-warning' },
];

export const resultSubjects = [
  { id: 'maths', name: 'Mathematics', percent: '94%', width: '94%', barClass: 'bg-success', grade: 'A+', gradeClass: 'bg-success-transparent text-success' },
  { id: 'science', name: 'Science', percent: '91%', width: '91%', barClass: 'bg-success', grade: 'A', gradeClass: 'bg-success-transparent text-success' },
  { id: 'geography', name: 'Geography', percent: '85%', width: '85%', barClass: 'bg-info', grade: 'B+', gradeClass: 'bg-info-transparent text-info' },
  { id: 'english', name: 'English', percent: '68%', width: '68%', barClass: 'bg-warning', grade: 'C+', gradeClass: 'bg-warning-transparent text-warning' },
];

/* ------------------------------------ Pay ---------------------------------- */

export const paymentMethods = ['Credit / Debit Card', 'Net Banking', 'UPI'];

/* ---------------------------------- Message -------------------------------- */

export const messageRecipients = [
  'Ms. Teresa Susan — Mathematics',
  'Mr. John Doe — Science',
  'Ms. Rita Owen — English',
  'Ms. Nina Patel — Computer',
];

/* ----------------------------------- Leave --------------------------------- */

export const leaveTypes = ['Sick Leave', 'Family Function', 'Medical', 'Other'];

/* ------------------------------------ Join --------------------------------- */

export const joinDetails: InfoRow[] = [
  iconRow('jd1', 'ti ti-clock', '09:00 — 09:45 AM', '18 minutes remaining'),
  iconRow('jd2', 'ti ti-users', '32 students joined', 'You have not joined yet'),
  iconRow('jd3', 'ti ti-notebook', 'Topic: Laws of Motion', 'Chapter 4 · slides shared'),
];

/* ------------------------------------ Notes -------------------------------- */

export const classNotes: InfoRow[] = [
  iconRow('cn1', 'ti ti-math-symbols', 'Mathematics — Algebra Basics', 'Ms. Teresa Susan · 6 pages · PDF'),
  iconRow('cn2', 'ti ti-flask', 'Science — Laws of Motion', 'Mr. John Doe · slides + worksheet', { iconClass: ICON_DANGER, itemClass: `border-danger ${TERTIARY}` }),
  iconRow('cn3', 'ti ti-book', 'English — Descriptive Writing', 'Ms. Rita Owen · 4 pages'),
  iconRow('cn4', 'ti ti-map-2', 'Geography — Continents', 'Mr. Alan Poe · map pack'),
];

export const recordedLessons: InfoRow[] = [
  iconRow('rl1', 'ti ti-player-play', 'Fractions Explained', 'Mathematics · 12:40 min'),
  iconRow('rl2', 'ti ti-player-play', 'Plant Life Cycle', 'Science · 09:15 min'),
];

/* ---------------------------------- Feedback ------------------------------- */

export const feedbackComments: InfoRow[] = [
  { id: 'fc1', avatar: 'assets/img/teachers/teacher-01.jpg', itemClass: TERTIARY, title: 'Ms. Teresa Susan · Mathematics', subtitle: 'Excellent working. Show each step for word problems to score full marks.' },
  { id: 'fc2', avatar: 'assets/img/teachers/teacher-02.jpg', itemClass: `border-danger ${TERTIARY}`, title: 'Mr. John Doe · Science', subtitle: 'Good diagrams. Label the axes on every graph next time.' },
  { id: 'fc3', avatar: 'assets/img/teachers/teacher-03.jpg', itemClass: TERTIARY, title: 'Ms. Rita Owen · English', subtitle: 'Your reading log needs more detail — add a short summary per book.' },
];

/* ------------------------------------ Goal --------------------------------- */

export const goalTypes = [
  'Attendance',
  'Subject Score',
  'Overall GPA',
  'Weekly Study Hours',
  'Reading Challenge',
];

/* ---------------------------------- Meeting -------------------------------- */

export const meetingRecipients = [
  'Ms. Teresa Susan — Mathematics',
  'Mr. John Doe — Science',
  'Ms. Rita Owen — English',
  'Ms. Carla Reed — Class Teacher',
  'School Counsellor',
];

export const meetingSlots: InfoRow[] = [
  iconRow('ms1', 'ti ti-clock', 'Tue · 03:30–04:15 PM', 'Ms. Teresa Susan · Room 204', { endBadge: { label: 'Open', className: 'badge-soft-success' } }),
  iconRow('ms2', 'ti ti-clock', 'Wed · 02:00–03:00 PM', 'Mr. John Doe · Lab 02', { endBadge: { label: 'Full', className: 'badge-soft-warning' } }),
  iconRow('ms3', 'ti ti-clock', 'Fri · 03:30–04:30 PM', 'Ms. Rita Owen · Room 108', { endBadge: { label: 'Open', className: 'badge-soft-success' } }),
];

/* ----------------------------------- Renew --------------------------------- */

export const renewBook: InfoRow = iconRow(
  'rn0',
  'ti ti-book-2',
  'The Solar System',
  'Issued 10 Jul · due 24 Jul',
  { endBadge: { label: '2 days left', className: 'badge-soft-warning' } },
);

export const renewDetails: InfoRow[] = [
  iconRow('rn1', 'ti ti-calendar-plus', 'New due date', '07 Aug · 14 days added'),
  iconRow('rn2', 'ti ti-refresh', 'Renewals used', '1 of 2 allowed for this title'),
  iconRow('rn3', 'ti ti-users', 'No reservations', 'Nobody is waiting for this book'),
];

/* ----------------------------------- Track --------------------------------- */

export const busStops: TimelineEntry[] = [
  { id: 'bs1', icon: 'ti ti-school', iconClass: 'bg-success-transparent text-success', title: 'School Gate', detail: 'Departed on time', time: '07:20' },
  { id: 'bs2', icon: 'ti ti-map-pin-check', iconClass: 'bg-success-transparent text-success', title: 'Oak Avenue', detail: '6 students picked up', time: '07:32' },
  { id: 'bs3', icon: 'ti ti-map-pin', iconClass: 'bg-primary-transparent text-primary', title: 'Maple Street — your stop', detail: 'Arriving in about 6 minutes', time: '07:41' },
  { id: 'bs4', icon: 'ti ti-home', iconClass: 'bg-info-transparent text-info', title: 'Riverside Colony', detail: 'Final stop of the route', time: '07:52' },
];

export const busCrew: InfoRow[] = [
  iconRow('bc1', 'ti ti-steering-wheel', 'Michael Doe', 'Driver · 8 years experience'),
  iconRow('bc2', 'ti ti-user-shield', 'Anita Sharma', 'Bus attendant · +1 4587 331'),
];

/* ---------------------------------- Library -------------------------------- */

export const issuedBooks: InfoRow[] = [
  iconRow('ib1', 'ti ti-book-2', 'The Solar System', 'Issued 10 Jul · due 24 Jul'),
  iconRow('ib2', 'ti ti-book-2', "Grimm's Fairy Tales", 'Issued 18 Jul · due 02 Aug', { endBadge: { label: 'On time', className: 'badge-soft-success' } }),
  iconRow('ib3', 'ti ti-book-2', 'Encyclopedia of Science', 'Issued 15 Jul · due 05 Aug', { endBadge: { label: 'On time', className: 'badge-soft-success' } }),
];

export const recommendedBooks: InfoRow[] = [
  iconRow('rc1', 'ti ti-book', 'Atlas of the World', 'Geography · reserved'),
  iconRow('rc2', 'ti ti-book', 'Young Scientist Handbook', 'Science · available'),
];

/* ---------------------------------- ID card -------------------------------- */

export const idCardDetails: InfoRow[] = [
  iconRow('ic1', 'ti ti-id-badge-2', 'Student ID', 'AD1256589'),
  iconRow('ic2', 'ti ti-flag', 'House', 'Red House'),
  iconRow('ic3', 'ti ti-bus', 'Transport', 'Route 12 · BUS-04'),
];
