export type Channel = 'WhatsApp' | 'SMS' | 'In-App';

export type Status = 'Waiting' | 'Answered' | 'Resolved' | 'Snoozed' | 'Archived';

export type SlaState = 'Within target' | 'Due soon' | 'Breached' | 'Not applicable';

export interface Thread {
  id: string;
  contact: string;
  avatar: string;
  phone: string;
  /** "Parent of Aarav Menon, 7-B". */
  relation: string;
  audience: string;
  className: string;
  section: string;

  channel: Channel;
  label: string;
  assignedTo: string;
  team: string;

  /** The last message from the contact: how many minutes ago it arrived. */
  inboundAgo: number;
  /**
   * Minutes from that message to the first reply. `-1` when nobody has
   * answered yet, which is what makes the thread count as waiting.
   */
  replyAfter: number;

  messages: number;
  /** The last line, for the register's preview column. */
  preview: string;
  previewIcon: string;

  resolved: boolean;
  snoozedUntil: string;
  archived: boolean;
  /** Threads a supervisor has flagged for review. */
  flagged: boolean;
}

/* --------------------------------- Tints ----------------------------------- */

export const statusBadge: Record<Status, string> = {
  Waiting: 'badge badge-soft-warning',
  Answered: 'badge badge-soft-info',
  Resolved: 'badge badge-soft-success',
  Snoozed: 'badge badge-soft-secondary',
  Archived: 'badge badge-soft-secondary',
};

export const statusPill: Record<Status, string> = {
  Waiting: 'is-pending',
  Answered: 'is-active',
  Resolved: 'is-completed',
  Snoozed: 'is-review',
  Archived: 'is-suspended',
};

export const slaBadge: Record<SlaState, string> = {
  'Within target': 'badge badge-soft-success',
  'Due soon': 'badge badge-soft-warning',
  Breached: 'badge badge-soft-danger',
  'Not applicable': 'badge badge-soft-secondary',
};

export const channelBadge: Record<Channel, string> = {
  WhatsApp: 'badge badge-soft-success',
  SMS: 'badge badge-soft-primary',
  'In-App': 'badge badge-soft-info',
};

export const channelIcon: Record<Channel, string> = {
  WhatsApp: 'ti ti-brand-whatsapp',
  SMS: 'ti ti-message-2',
  'In-App': 'ti ti-app-window',
};

export const labelBadge: Record<string, string> = {
  'Fee query': 'badge badge-soft-warning',
  Admission: 'badge badge-soft-primary',
  Transport: 'badge badge-soft-info',
  Complaint: 'badge badge-soft-danger',
  'Follow-up': 'badge badge-soft-purple',
  Academic: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const channelOptions: Channel[] = ['WhatsApp', 'SMS', 'In-App'];

export const statusOptions: Status[] = ['Waiting', 'Answered', 'Resolved', 'Snoozed', 'Archived'];

export const slaOptions: SlaState[] = ['Within target', 'Due soon', 'Breached'];

export const labelOptions = [
  'Fee query', 'Admission', 'Transport', 'Complaint', 'Follow-up', 'Academic',
];

export const assigneeOptions = [
  'Ms. Latha Rao', 'Mr. Arun Prakash', 'Ms. Divya Nair', 'Unassigned',
];

export const teamOptions = ['Front office', 'Accounts', 'Transport', 'Academics'];

export const audienceOptions = ['Parents', 'Students', 'Teachers', 'Staff'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';
export const REGISTER_TIME = '12:40';

/** The reply target the front office works to. */
export const SLA_MINUTES = 4 * 60;

/** The platform's free-reply window. */
export const SESSION_MINUTES = 24 * 60;

export const durationText = (minutes: number): string => {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) return `${safe}m`;
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  if (hours < 24) return mins === 0 ? `${hours}h` : `${hours}h ${String(mins).padStart(2, '0')}m`;
  const days = Math.floor(hours / 24);
  return `${days}d ${hours % 24}h`;
};

export const hasReplied = (row: Thread): boolean => row.replyAfter >= 0;

/** Nobody is waiting once someone has answered. */
export const waitingMinutesOf = (row: Thread): number =>
  (hasReplied(row) || row.resolved ? 0 : row.inboundAgo);

export const firstResponseOf = (row: Thread): number => (hasReplied(row) ? row.replyAfter : -1);

export const firstResponseLabelOf = (row: Thread): string =>
  (hasReplied(row) ? durationText(row.replyAfter) : 'No reply yet');

export const statusOf = (row: Thread): Status => {
  if (row.archived) return 'Archived';
  if (row.resolved) return 'Resolved';
  if (row.snoozedUntil) return 'Snoozed';
  return hasReplied(row) ? 'Answered' : 'Waiting';
};

/**
 * Against the four-hour target. A thread nobody has answered is measured on how
 * long it has waited; an answered one on how long it took.
 */
export const slaStateOf = (row: Thread): SlaState => {
  if (row.resolved || row.archived) return 'Not applicable';
  const elapsed = hasReplied(row) ? row.replyAfter : row.inboundAgo;
  if (elapsed > SLA_MINUTES) return 'Breached';
  return SLA_MINUTES - elapsed <= 60 ? 'Due soon' : 'Within target';
};

export const slaSubLabelOf = (row: Thread): string => {
  const state = slaStateOf(row);
  if (state === 'Not applicable') return 'Thread closed';
  const elapsed = hasReplied(row) ? row.replyAfter : row.inboundAgo;
  if (state === 'Breached') return `${durationText(elapsed - SLA_MINUTES)} over target`;
  return `${durationText(SLA_MINUTES - elapsed)} left of 4h`;
};

export const sessionMinutesLeftOf = (row: Thread): number =>
  Math.max(0, SESSION_MINUTES - row.inboundAgo);

export const isSessionOpen = (row: Thread): boolean =>
  row.channel !== 'WhatsApp' || sessionMinutesLeftOf(row) > 0;

export const sessionLabelOf = (row: Thread): string => {
  if (row.channel !== 'WhatsApp') return 'No window on this channel';
  const left = sessionMinutesLeftOf(row);
  return left > 0 ? `${durationText(left)} left` : 'Closed — template only';
};

export const isWaiting = (row: Thread): boolean => statusOf(row) === 'Waiting';

export const isBreached = (row: Thread): boolean => slaStateOf(row) === 'Breached';

export const isUnassigned = (row: Thread): boolean => row.assignedTo === 'Unassigned';

export const lastActivityLabelOf = (row: Thread): string => `${durationText(row.inboundAgo)} ago`;

export interface Pair {
  label: string;
  value: string;
}

export const contactPairsOf = (row: Thread): Pair[] => [
  { label: 'Contact', value: row.contact },
  { label: 'Number', value: row.phone },
  { label: 'Relation', value: row.relation },
  { label: 'Channel', value: row.channel },
  { label: 'Label', value: row.label },
  { label: 'Messages', value: String(row.messages) },
];

export const servicePairsOf = (row: Thread): Pair[] => [
  { label: 'Status', value: statusOf(row) },
  { label: 'Waiting', value: waitingMinutesOf(row) > 0 ? durationText(waitingMinutesOf(row)) : 'Not waiting' },
  { label: 'First response', value: firstResponseLabelOf(row) },
  { label: 'Against target', value: slaSubLabelOf(row) },
  { label: 'Session window', value: sessionLabelOf(row) },
];

export const ownerPairsOf = (row: Thread): Pair[] => [
  { label: 'Assigned to', value: row.assignedTo },
  { label: 'Team', value: row.team },
  { label: 'Last activity', value: lastActivityLabelOf(row) },
  { label: 'Snoozed until', value: row.snoozedUntil || 'Not snoozed' },
  { label: 'Flagged', value: row.flagged ? 'Yes — for review' : 'No' },
];

export const searchIndexOf = (row: Thread): string =>
  [row.id, row.contact, row.phone, row.relation, row.label, row.assignedTo, row.team, statusOf(row)]
    .join(' ')
    .toLowerCase();

/* --------------------------------- Summary ---------------------------------- */

/** The inbox holds 214 threads; this page lists the ten that are open. */
export const TOTAL_THREADS = 214;

export const SUMMARY_TOTALS = {
  open: 24,
  waiting: 9,
  breached: 3,
  unassigned: 5,
};

/* ---------------------------------- Rows ------------------------------------ */

export const threads: Thread[] = [
  {
    id: 'THR-2041', contact: 'Rahul Menon', avatar: 'assets/img/profiles/avatar-01.jpg',
    phone: '+91 98765 43210', relation: 'Parent of Aarav Menon, 7-B',
    audience: 'Parents', className: 'Grade 7', section: 'B',
    channel: 'WhatsApp', label: 'Fee query', assignedTo: 'Ms. Latha Rao', team: 'Accounts',
    /* Wrote at 09:40, answered at 09:48. */
    inboundAgo: 180, replyAfter: 8,
    messages: 148, preview: 'Could I pay the term-2 fee in two instalments?',
    previewIcon: 'ti ti-corner-up-left',
    resolved: false, snoozedUntil: '', archived: false, flagged: false,
  },
  {
    id: 'THR-2044', contact: 'Sneha Iyer', avatar: 'assets/img/profiles/avatar-02.jpg',
    phone: '+91 90123 45617', relation: 'Parent of Diya Iyer, 4-A',
    audience: 'Parents', className: 'Grade 6', section: 'A',
    channel: 'WhatsApp', label: 'Follow-up', assignedTo: 'Ms. Latha Rao', team: 'Front office',
    /* Sent a photo three and a quarter hours ago; nobody has answered. */
    inboundAgo: 205, replyAfter: -1,
    messages: 26, preview: "Photo · Diya's medical certificate",
    previewIcon: 'ti ti-photo',
    resolved: false, snoozedUntil: '', archived: false, flagged: false,
  },
  {
    id: 'THR-2047', contact: 'Vikram Rao', avatar: 'assets/img/profiles/avatar-03.jpg',
    phone: '+91 99887 76658', relation: 'Parent of Ishaan Rao, 10-C',
    audience: 'Parents', className: 'Grade 10', section: 'C',
    channel: 'WhatsApp', label: 'Transport', assignedTo: 'Mr. Arun Prakash', team: 'Transport',
    inboundAgo: 222, replyAfter: -1,
    messages: 41, preview: 'Is the bus running on Route 11 tomorrow?',
    previewIcon: 'ti ti-corner-up-left',
    resolved: false, snoozedUntil: '', archived: false, flagged: false,
  },
  {
    id: 'THR-2031', contact: 'Fatima Sheikh', avatar: 'assets/img/profiles/avatar-05.jpg',
    phone: '+91 87654 32102', relation: 'Parent of Zoya Sheikh, 6-B',
    audience: 'Parents', className: 'Grade 6', section: 'B',
    channel: 'WhatsApp', label: 'Admission', assignedTo: 'Unassigned', team: 'Front office',
    /* Nearly five hours with no owner and no reply — past the four-hour target. */
    inboundAgo: 276, replyAfter: -1,
    messages: 12, preview: 'Document · transfer-certificate.pdf',
    previewIcon: 'ti ti-file-text',
    resolved: false, snoozedUntil: '', archived: false, flagged: true,
  },
  {
    id: 'THR-2019', contact: 'Joseph Thomas', avatar: 'assets/img/profiles/avatar-06.jpg',
    phone: '+91 94567 89076', relation: 'Parent of Ann Thomas, 9-A',
    audience: 'Parents', className: 'Grade 9', section: 'A',
    channel: 'WhatsApp', label: 'Complaint', assignedTo: 'Unassigned', team: 'Front office',
    /* Left a voice note yesterday afternoon and is still waiting. */
    inboundAgo: 1220, replyAfter: -1,
    messages: 8, preview: 'Voice note · 0:34',
    previewIcon: 'ti ti-microphone',
    resolved: false, snoozedUntil: '', archived: false, flagged: true,
  },
  {
    id: 'THR-2026', contact: 'Mr. Suresh Babu', avatar: 'assets/img/profiles/avatar-07.jpg',
    phone: '+91 93456 78012', relation: 'Librarian',
    audience: 'Staff', className: '', section: '',
    channel: 'In-App', label: 'Follow-up', assignedTo: 'Ms. Divya Nair', team: 'Academics',
    inboundAgo: 1535, replyAfter: 95,
    messages: 19, preview: 'The library migration finishes on the eighth.',
    previewIcon: 'ti ti-corner-up-left',
    resolved: false, snoozedUntil: '8 Aug 2026', archived: false, flagged: false,
  },
  {
    id: 'THR-2008', contact: 'Priya Nambiar', avatar: 'assets/img/profiles/avatar-09.jpg',
    phone: '+91 90876 54321', relation: 'Parent of Nila Nambiar, 3-C',
    audience: 'Parents', className: 'Grade 6', section: 'C',
    channel: 'SMS', label: 'Academic', assignedTo: 'Ms. Divya Nair', team: 'Academics',
    inboundAgo: 4315, replyAfter: 42,
    messages: 21, preview: "Understood about Thursday's closure.",
    previewIcon: 'ti ti-checks',
    resolved: true, snoozedUntil: '', archived: false, flagged: false,
  },
  {
    id: 'THR-2012', contact: 'Ayesha Khan', avatar: 'assets/img/profiles/avatar-08.jpg',
    phone: '+91 87012 34509', relation: 'Student, 12-A',
    audience: 'Students', className: 'Grade 12', section: 'A',
    channel: 'WhatsApp', label: 'Academic', assignedTo: 'Ms. Divya Nair', team: 'Academics',
    /* Two days back, so the WhatsApp window has long since closed. */
    inboundAgo: 2870, replyAfter: 18,
    messages: 33, preview: 'Received the hall ticket, thank you.',
    previewIcon: 'ti ti-checks',
    resolved: true, snoozedUntil: '', archived: false, flagged: false,
  },
  {
    id: 'THR-2003', contact: 'Mrs. Kavita Rao', avatar: 'assets/img/profiles/avatar-10.jpg',
    phone: '+91 99001 22334', relation: 'Parent of Ananya Rao, 10-B',
    audience: 'Parents', className: 'Grade 10', section: 'B',
    channel: 'WhatsApp', label: 'Complaint', assignedTo: 'Ms. Latha Rao', team: 'Front office',
    /* Answered nine hours after she wrote — well past the target. */
    inboundAgo: 2160, replyAfter: 545,
    messages: 17, preview: 'The laboratory injury report has not reached us.',
    previewIcon: 'ti ti-corner-up-left',
    resolved: false, snoozedUntil: '', archived: false, flagged: true,
  },
  {
    id: 'THR-1998', contact: 'Mr. Nikhil Desai', avatar: 'assets/img/profiles/avatar-11.jpg',
    phone: '+91 55774 51102', relation: 'Parent of Rohan Desai, 9-C',
    audience: 'Parents', className: 'Grade 9', section: 'C',
    channel: 'WhatsApp', label: 'Follow-up', assignedTo: 'Ms. Latha Rao', team: 'Front office',
    inboundAgo: 5760, replyAfter: 6,
    messages: 52, preview: 'Thank you for calling about Rohan this morning.',
    previewIcon: 'ti ti-checks',
    resolved: false, snoozedUntil: '', archived: true, flagged: false,
  },
];
