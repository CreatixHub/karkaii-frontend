import type { Category, Channel } from './announcements.data';

export interface Audience {
  icon: string;
  name: string;
  note: string;
  count: string;
  unit: string;
  delivery: string;
  deliveryTone: string;
  readRate: number;
  last: string;
}

export const audiences: Audience[] = [
  {
    icon: 'ti ti-school', name: 'Students', note: 'All enrolled, Nursery to Grade 12',
    count: '1,286', unit: 'recipients',
    delivery: '1,281 delivered', deliveryTone: 'is-live',
    readRate: 78, last: 'Term-2 examination circular, 26 Jul',
  },
  {
    icon: 'ti ti-users', name: 'Parents', note: 'Primary guardian per student',
    count: '1,240', unit: 'recipients',
    delivery: '18 bounced', deliveryTone: 'is-high',
    readRate: 72, last: 'Second term fee due, 24 Jul',
  },
  {
    icon: 'ti ti-chalkboard', name: 'Teachers', note: 'Teaching faculty, all departments',
    count: '184', unit: 'recipients',
    delivery: '184 delivered', deliveryTone: 'is-live',
    readRate: 94, last: 'Sports meet registrations, 21 Jul',
  },
  {
    icon: 'ti ti-id-badge-2', name: 'Staff', note: 'Administration, support and transport',
    count: '96', unit: 'recipients',
    delivery: '96 delivered', deliveryTone: 'is-live',
    readRate: 88, last: 'Rainfall closure, 29 Jul',
  },
  {
    icon: 'ti ti-building-arch', name: 'Entire school', note: 'Every group at once, deduplicated',
    count: '2,940', unit: 'recipients',
    delivery: '2,918 delivered', deliveryTone: 'is-live',
    readRate: 81, last: 'Rainfall closure, 29 Jul',
  },
  {
    icon: 'ti ti-sitemap', name: 'Departments', note: '12 departments, addressable singly',
    count: '12', unit: 'groups · 268 people',
    delivery: 'Healthy', deliveryTone: 'is-live',
    readRate: 91, last: 'Lab safety refresher, 17 Jul',
  },
  {
    icon: 'ti ti-users-group', name: 'Specific classes', note: 'Pick any section, or a set of them',
    count: '42', unit: 'sections',
    delivery: 'Healthy', deliveryTone: 'is-live',
    readRate: 84, last: 'PTM slots, Grades 6–10, 18 Jul',
  },
  {
    icon: 'ti ti-bus', name: 'Transport users', note: 'Families on a bus route',
    count: '612', unit: 'recipients',
    delivery: '6 unreachable', deliveryTone: 'is-high',
    readRate: 69, last: 'Route 7 timing change, 22 Jul',
  },
];

export interface Template {
  preview: string;
  /** The three rules under the preview line, as width utilities. */
  lines: number[];
  category: Category;
  name: string;
  note: string;
  audience: string;
}

export const templates: Template[] = [
  {
    preview: 'School will remain closed on…', lines: [92, 72, 84],
    category: 'Holiday', name: 'Holiday Notice',
    note: 'Closure date, reason, and what happens to buses, the mess and scheduled tests.',
    audience: 'Entire school',
  },
  {
    preview: 'Term examinations begin on…', lines: [84, 96, 60],
    category: 'Examination', name: 'Exam Circular',
    note: 'Datesheet, hall ticket instructions, reporting time and prohibited items.',
    audience: 'Students, Parents',
  },
  {
    preview: 'Fee for the term is due by…', lines: [76, 88, 52],
    category: 'Fees', name: 'Fee Reminder',
    note: 'Amount, due date, payment routes and the late fee that follows.',
    audience: 'Parents',
  },
  {
    preview: 'Immediate notice to all families', lines: [96, 64, 80],
    category: 'Emergency', name: 'Emergency Notice',
    note: 'Short, acknowledged, and sent on every channel at once including SMS.',
    audience: 'Entire school',
  },
  {
    preview: 'Registrations are open for…', lines: [68, 92, 76],
    category: 'Events', name: 'Sports Event',
    note: 'Event list, house allocation, kit requirements and the registration cut-off.',
    audience: 'Students, Teachers',
  },
  {
    preview: 'Admissions open for the session', lines: [88, 56, 84],
    category: 'Admissions', name: 'Admission Notice',
    note: 'Grades open, application window, documents required and the fee annexure.',
    audience: 'Website, Parents',
  },
  {
    preview: 'This month at the school', lines: [92, 80, 64],
    category: 'Newsletter', name: 'Newsletter',
    note: 'A monthly round-up with sections for academics, sports, library and staff notes.',
    audience: 'Entire school',
  },
  {
    preview: 'Meeting slots are now open', lines: [72, 96, 60],
    category: 'Academic', name: 'Parent Meeting',
    note: 'Slot booking window, venue, and what parents should bring with them.',
    audience: 'Parents',
  },
];

export type Approval = 'Approved' | 'Awaiting approval' | 'Draft · not approved';

export interface Queued {
  day: string;
  month: string;
  time: string;
  category: Category;
  title: string;
  approval: Approval;
  audience: string;
  count: string;
  /** Empty when the notice does not auto-expire. */
  expires: string;
  channels: Channel[];
}

export const approvalBadge: Record<Approval, string> = {
  Approved: 'message-status-badge is-live',
  'Awaiting approval': 'message-status-badge is-high',
  'Draft · not approved': 'message-status-badge is-draft',
};

export const approvalIcon: Record<Approval, string> = {
  Approved: 'ti ti-circle-check',
  'Awaiting approval': 'ti ti-clock-hour-4',
  'Draft · not approved': 'ti ti-pencil',
};

/** The second button on a queued announcement, read off its approval state. */
export const queueActionOf = (row: Queued): string => {
  if (row.approval === 'Approved') return 'Reschedule';
  return row.approval === 'Awaiting approval' ? 'Approve' : 'Edit';
};

export const queue: Queued[] = [
  {
    day: '12', month: 'Aug', time: '08:00 am', category: 'Holiday',
    title: 'Independence Day — flag hoisting at 8:00 am',
    approval: 'Approved', audience: 'Entire school', count: '2,940',
    expires: '16 Aug', channels: ['In-App', 'Email', 'Push notification'],
  },
  {
    day: '05', month: 'Aug', time: '07:30 am', category: 'Fees',
    title: 'Final reminder — second term fee closes in five days',
    approval: 'Awaiting approval', audience: 'Parents with dues', count: '318',
    expires: '11 Aug', channels: ['In-App', 'Email', 'SMS', 'WhatsApp'],
  },
  {
    day: '08', month: 'Aug', time: '04:00 pm', category: 'Academic',
    title: 'Reminder — parent–teacher meeting is tomorrow',
    approval: 'Approved', audience: 'Parents, Grades 6–10', count: '720',
    expires: '09 Aug', channels: ['In-App', 'Push notification', 'WhatsApp'],
  },
  {
    day: '01', month: 'Sep', time: '09:00 am', category: 'Admissions',
    title: 'Admissions open for the 2027 – 2028 session',
    approval: 'Draft · not approved', audience: 'Website, Parents', count: '1,240',
    expires: '', channels: ['In-App', 'Email', 'Website banner'],
  },
];

export type ChannelState = 'Active' | 'Template review' | 'Paused';

export interface ChannelCard {
  channel: Channel;
  note: string;
  state: ChannelState;
  lastDelivery: string;
  footer: string;
}

export const channelStateBadge: Record<ChannelState, string> = {
  Active: 'message-status-badge is-live',
  'Template review': 'message-status-badge is-high',
  Paused: 'message-status-badge is-draft',
};

export const channelCards: ChannelCard[] = [
  {
    channel: 'In-App', note: 'Portal and mobile app inbox', state: 'Active',
    lastDelivery: '29 Jul, 06:12 pm', footer: 'No credits used',
  },
  {
    channel: 'Email', note: 'SMTP · mail.school.edu', state: 'Active',
    lastDelivery: '29 Jul, 06:12 pm', footer: '18 bounced this month',
  },
  {
    channel: 'SMS', note: 'Reserved for urgent notices', state: 'Active',
    lastDelivery: '29 Jul, 06:14 pm', footer: '8,540 credits left',
  },
  {
    channel: 'WhatsApp', note: 'Business API · template messages', state: 'Template review',
    lastDelivery: '26 Jul, 09:30 am', footer: '2 templates pending',
  },
  {
    channel: 'Push notification', note: 'Mobile app, opted-in devices', state: 'Active',
    lastDelivery: '29 Jul, 06:12 pm', footer: '2,104 devices',
  },
  {
    channel: 'Website banner', note: 'Public site, above the fold', state: 'Paused',
    lastDelivery: '21 Jul, 11:05 am', footer: 'Resumes with admissions',
  },
];
