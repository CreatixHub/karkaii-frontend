export type ChannelId = 'bulk-sms' | 'bulk-whatsapp' | 'push' | 'parent';

export interface RecipientGroup {
  label: string;
  count: number;
}

export interface RecentSend {
  title: string;
  note: string;
  state: 'Sent' | 'Scheduled' | 'Failed';
}

export interface ChannelConfig {
  id: ChannelId;
  /** Page title and breadcrumb leaf. */
  title: string;
  /** What the summary's Channel row reads. */
  channel: string;
  icon: string;
  tint: string;
  /** Copy under the compose card's heading. */
  note: string;
  /** How much of a message fits in one billable unit. */
  unitSize: number;
  unitName: string;
  /** Credits charged per unit per recipient; zero for the free channels. */
  ratePerUnit: number;
  /** The wallet this channel draws on; zero when nothing is billed. */
  balance: number;
  /** Whether the composer offers a subject line. */
  hasSubject: boolean;
  subjectLabel: string;
  recentSends: RecentSend[];
}

export const recipientGroups: RecipientGroup[] = [
  { label: 'All Students', count: 1286 },
  { label: 'All Parents', count: 1240 },
  { label: 'All Teachers', count: 184 },
  { label: 'Staff', count: 96 },
  { label: 'Grade 10 · A', count: 42 },
];

export const templateOptions = [
  '— None —', 'Fee Reminder', 'Exam Notice', 'Holiday Announcement', 'Welcome Message',
];

/** The wording each template starts the composer with. */
export const templateBodies: Record<string, { subject: string; body: string }> = {
  'Fee Reminder': {
    subject: 'Term fee due',
    body: 'The term fee is due on 10 August. Payment can be made through the parent portal or at the accounts counter. A late fee applies after the due date.',
  },
  'Exam Notice': {
    subject: 'Examination schedule',
    body: 'Term-2 examinations begin on 12 August. The datesheet and seating plan are on the portal. Please report twenty minutes before each paper with your ID card.',
  },
  'Holiday Announcement': {
    subject: 'School closed',
    body: 'The school will remain closed on 15 August for Independence Day. Classes resume on the following working day and buses run to the usual timetable.',
  },
  'Welcome Message': {
    subject: 'Welcome to Preskool',
    body: 'Welcome to Preskool. Your portal account is active — sign in to see the timetable, fee statement and school calendar for the term.',
  },
};

export const channels: Record<ChannelId, ChannelConfig> = {
  'bulk-sms': {
    id: 'bulk-sms',
    title: 'Bulk SMS',
    channel: 'Bulk SMS',
    icon: 'ti ti-message-2',
    tint: 'primary',
    note: 'One credit per segment per recipient. A message over 160 characters is billed twice.',
    unitSize: 160,
    unitName: 'segment',
    ratePerUnit: 1,
    balance: 8540,
    hasSubject: true,
    subjectLabel: 'Subject (internal reference)',
    recentSends: [
      { title: 'Fee Reminder', note: 'Sent to 320 parents · 03 Jun 2026', state: 'Sent' },
      { title: 'Exam Notice', note: 'Sent to 640 students · 24 Jun 2026', state: 'Sent' },
      { title: 'Holiday Announcement', note: 'Scheduled · 09 Jul 2026', state: 'Scheduled' },
    ],
  },
  'bulk-whatsapp': {
    id: 'bulk-whatsapp',
    title: 'Bulk WhatsApp',
    channel: 'Bulk WhatsApp',
    icon: 'ti ti-brand-whatsapp',
    tint: 'success',
    note: 'One conversation credit per recipient. Template messages must be registered before they can be sent.',
    unitSize: 1024,
    unitName: 'message',
    ratePerUnit: 1,
    balance: 4200,
    hasSubject: true,
    subjectLabel: 'Template name',
    recentSends: [
      { title: 'Fee Reminder', note: 'Sent to 320 parents · 03 Jun 2026', state: 'Sent' },
      { title: 'Exam Notice', note: 'Sent to 640 students · 24 Jun 2026', state: 'Sent' },
      { title: 'Holiday Announcement', note: 'Scheduled · 09 Jul 2026', state: 'Scheduled' },
    ],
  },
  push: {
    id: 'push',
    title: 'Push Notifications',
    channel: 'Push Notification',
    icon: 'ti ti-bell',
    tint: 'info',
    note: 'Delivered to opted-in devices at no cost. A payload over 178 characters is truncated on the lock screen.',
    unitSize: 178,
    unitName: 'payload',
    ratePerUnit: 0,
    balance: 0,
    hasSubject: true,
    subjectLabel: 'Notification title',
    recentSends: [
      { title: 'Fee Reminder', note: 'Sent to 320 parents · 03 Jun 2026', state: 'Sent' },
      { title: 'Exam Notice', note: 'Sent to 640 students · 24 Jun 2026', state: 'Sent' },
      { title: 'Holiday Announcement', note: 'Scheduled · 09 Jul 2026', state: 'Scheduled' },
    ],
  },
  parent: {
    id: 'parent',
    title: 'Parent Communication',
    channel: 'Parent Communication',
    icon: 'ti ti-users',
    tint: 'purple',
    note: 'Written to the parent portal inbox and emailed. Nothing is billed; every message is kept on the child’s record.',
    unitSize: 2000,
    unitName: 'message',
    ratePerUnit: 0,
    balance: 0,
    hasSubject: true,
    subjectLabel: 'Subject',
    recentSends: [
      { title: 'Fee Reminder', note: 'Sent to 320 parents · 03 Jun 2026', state: 'Sent' },
      { title: 'Exam Notice', note: 'Sent to 640 students · 24 Jun 2026', state: 'Sent' },
      { title: 'Holiday Announcement', note: 'Scheduled · 09 Jul 2026', state: 'Scheduled' },
    ],
  },
};

/* ------------------------------- Derivations -------------------------------- */

export const countOf = (group: string): number =>
  recipientGroups.find((entry) => entry.label === group)?.count ?? 0;

/** An empty message is still one unit once it is sent. */
export const unitsOf = (body: string, config: ChannelConfig): number =>
  Math.max(1, Math.ceil(body.length / config.unitSize));

export const creditsOf = (body: string, group: string, config: ChannelConfig): number =>
  countOf(group) * unitsOf(body, config) * config.ratePerUnit;

/** What is left in the wallet once this send has gone. */
export const balanceAfterOf = (body: string, group: string, config: ChannelConfig): number =>
  config.balance - creditsOf(body, group, config);

export const isFree = (config: ChannelConfig): boolean => config.ratePerUnit === 0;

export const recentStateBadge: Record<RecentSend['state'], string> = {
  Sent: 'badge badge-soft-success',
  Scheduled: 'badge badge-soft-warning',
  Failed: 'badge badge-soft-danger',
};

export const recentStateIcon: Record<RecentSend['state'], string> = {
  Sent: 'ti ti-check',
  Scheduled: 'ti ti-clock',
  Failed: 'ti ti-x',
};
