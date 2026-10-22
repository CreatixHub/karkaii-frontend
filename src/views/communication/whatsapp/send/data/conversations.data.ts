export type Direction = 'in' | 'out';

export type MessageKind = 'text' | 'template' | 'file' | 'voice' | 'image';

export type Receipt = 'sent' | 'delivered' | 'read';

export type ConversationState =
  | 'Open' | 'Awaiting reply' | 'Assigned' | 'Snoozed' | 'Resolved' | 'Archived';

export interface Message {
  id: string;
  direction: Direction;
  kind: MessageKind;
  /** The words, or the caption on a file. */
  text: string;
  /** Set on a template message. */
  templateName: string;
  /** Set on a file or voice note. */
  fileName: string;
  fileMeta: string;
  /** "07:30". */
  at: string;
  receipt: Receipt;
  /** The date separator this message sits under. */
  day: string;
}

export interface SharedFile {
  icon: string;
  kind: string;
  name: string;
  meta: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  /** "Parent of Aarav Menon, 7-B". */
  relation: string;
  /** "Parent · 7-B" — the line under the preview in the list. */
  meta: string;
  audience: string;
  className: string;
  section: string;
  department: string;

  label: string;
  state: ConversationState;
  assignedTo: string;
  pinned: boolean;
  unread: number;
  online: boolean;
  optedInOn: string;

  /** The list's right-hand timestamp: "09:42", "Yesterday", "31 Jul". */
  lastAt: string;
  /** Which day group the conversation sits in. */
  group: string;
  /** The preview line and the icon in front of it. */
  previewIcon: string;
  preview: string;

  /**
   * When the contact last wrote in, as a day offset and a clock time. The
   * session window runs 24 hours from here; an empty time means they have
   * never written, so no session is open.
   */
  lastInboundDay: number;
  lastInboundAt: string;

  messages: Message[];
  totalMessages: number;
  sharedMedia: SharedFile[];
}

/* --------------------------------- Tints ----------------------------------- */

export const stateBadge: Record<ConversationState, string> = {
  Open: 'badge badge-soft-primary',
  'Awaiting reply': 'badge badge-soft-warning',
  Assigned: 'badge badge-soft-info',
  Snoozed: 'badge badge-soft-secondary',
  Resolved: 'badge badge-soft-success',
  Archived: 'badge badge-soft-secondary',
};

export const labelBadge: Record<string, string> = {
  'Fee query': 'badge badge-soft-warning',
  Admission: 'badge badge-soft-primary',
  Transport: 'badge badge-soft-info',
  Complaint: 'badge badge-soft-danger',
  'Follow-up': 'badge badge-soft-purple',
  Resolved: 'badge badge-soft-success',
  Teacher: 'badge badge-soft-secondary',
};

/* ------------------------------ Filter options ------------------------------ */

export const audienceOptions = [
  'Parents', 'Students', 'Teachers', 'Staff',
  'Transport Users', 'Hostel Students', 'Library Members',
];

export const classOptions = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

export const sectionOptions = ['A', 'B', 'C', 'D'];

export const departmentOptions = [
  'Accounts', 'Admissions', 'Transport', 'Library', 'Science', 'Administration',
];

export const labelOptions = [
  'Fee query', 'Admission', 'Transport', 'Complaint', 'Follow-up', 'Resolved',
];

export const stateOptions: ConversationState[] = [
  'Open', 'Awaiting reply', 'Assigned', 'Snoozed', 'Resolved', 'Archived',
];

export const sessionOptions = ['Open — free replies', 'Closed — template only'];

export const assigneeOptions = ['Me', 'Ms. Latha Rao', 'Mr. Arun Prakash', 'Unassigned'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';
/** 12:40, which is what makes the fee thread's session read 21 hours. */
export const REGISTER_MINUTES = 12 * 60 + 40;

/** The window the API allows for free-form replies. */
export const SESSION_HOURS = 24;

export const minutesOf = (time: string): number => {
  const [hours, mins] = time.split(':').map(Number);
  return Number.isFinite(hours) && Number.isFinite(mins) ? hours * 60 + mins : 0;
};

/** Minutes from the contact's last message to now; days back count backwards. */
export const sessionMinutesLeftOf = (row: Conversation): number => {
  if (!row.lastInboundAt) return 0;
  const since = row.lastInboundDay * 1440 + (REGISTER_MINUTES - minutesOf(row.lastInboundAt));
  return Math.max(0, SESSION_HOURS * 60 - since);
};

export const sessionHoursLeftOf = (row: Conversation): number =>
  Math.floor(sessionMinutesLeftOf(row) / 60);

export const isSessionOpen = (row: Conversation): boolean => sessionMinutesLeftOf(row) > 0;

/** The badge beside the contact's name. */
export const sessionLabelOf = (row: Conversation): string =>
  (isSessionOpen(row)
    ? `Session open · ${sessionHoursLeftOf(row)}h left`
    : 'Session closed · template only');

/** Whether the reply box may send words rather than a registered template. */
export const canSendFreeForm = (row: Conversation): boolean => isSessionOpen(row);

export const unreadOf = (rows: Conversation[]): number =>
  rows.reduce((total, row) => total + (row.unread > 0 ? 1 : 0), 0);

export const isUnread = (row: Conversation): boolean => row.unread > 0;

export const isAwaiting = (row: Conversation): boolean => row.state === 'Awaiting reply';

export const isArchived = (row: Conversation): boolean => row.state === 'Archived';

export const isAssignedToMe = (row: Conversation): boolean => row.assignedTo === 'Me';

export const searchIndexOf = (row: Conversation): string =>
  [row.name, row.phone, row.relation, row.meta, row.label, row.state, row.preview]
    .join(' ')
    .toLowerCase();

/** The receipt tick a sent message shows. */
export const receiptIcon: Record<Receipt, string> = {
  sent: 'ti ti-check',
  delivered: 'ti ti-checks',
  read: 'ti ti-checks is-read',
};

export interface Pair {
  label: string;
  value: string;
}

export const contactPairsOf = (row: Conversation): Pair[] => [
  { label: 'Number', value: row.phone },
  { label: 'Relation', value: row.relation },
  { label: 'Label', value: row.label },
  { label: 'Assigned to', value: row.assignedTo },
  { label: 'Opted in', value: row.optedInOn },
  { label: 'Session', value: sessionLabelOf(row) },
];

/* -------------------------------- Quick replies ------------------------------ */

export const quickReplies = [
  "Thanks, we'll check and revert",
  'Share the payment link',
  'Office hours are 9 am – 2 pm',
];

/* --------------------------------- Summary ---------------------------------- */

/** The inbox holds 214 conversations; this page lists nine of them. */
export const TOTAL_CONVERSATIONS = 214;

export const QUICK_TOTALS = {
  unread: 6,
  pinned: 2,
  assigned: 4,
  awaiting: 3,
  sessionOpen: 11,
  archived: 58,
};

/* ------------------------------- The inbox ---------------------------------- */

const feeThread: Message[] = [
  {
    id: 'M1', direction: 'out', kind: 'template',
    text: 'Dear Rahul Menon, the term-2 fee of Rs. 18,500 for Aarav Menon (7-B) is due on 10 Aug. Pay via the parent portal to avoid a late fee. – Karkaii',
    templateName: 'Fee Reminder', fileName: '', fileMeta: '',
    at: '07:30', receipt: 'read', day: 'Yesterday',
  },
  {
    id: 'M2', direction: 'in', kind: 'text',
    text: 'Thank you for the reminder. Is the portal the only way to pay, or can I still pay at the counter?',
    templateName: '', fileName: '', fileMeta: '',
    at: '08:12', receipt: 'read', day: 'Yesterday',
  },
  {
    id: 'M3', direction: 'out', kind: 'text',
    text: 'Either works. The accounts counter is open 9:00 am to 2:00 pm on working days, and receipts are issued immediately in both cases.',
    templateName: '', fileName: '', fileMeta: '',
    at: '08:20', receipt: 'read', day: 'Yesterday',
  },
  {
    id: 'M4', direction: 'in', kind: 'text',
    text: 'Could I pay the term-2 fee in two instalments? The second one would be around the twentieth.',
    templateName: '', fileName: '', fileMeta: '',
    at: '09:40', receipt: 'read', day: 'Today',
  },
  {
    id: 'M5', direction: 'in', kind: 'file',
    text: '', templateName: '', fileName: 'salary-slip-july.pdf', fileMeta: 'PDF · 214 KB',
    at: '09:41', receipt: 'read', day: 'Today',
  },
  {
    id: 'M6', direction: 'in', kind: 'voice',
    text: '', templateName: '', fileName: 'Voice note', fileMeta: '0:18',
    at: '09:42', receipt: 'read', day: 'Today',
  },
  {
    id: 'M7', direction: 'out', kind: 'text',
    text: "Thank you — I've passed this to the accounts office. A two-instalment plan needs the principal's approval, and you'll have an answer before the tenth.",
    templateName: '', fileName: '', fileMeta: '',
    at: '09:48', receipt: 'delivered', day: 'Today',
  },
];

export const conversations: Conversation[] = [
  {
    id: 'WA-001', name: 'Rahul Menon', avatar: 'assets/img/profiles/avatar-01.jpg',
    phone: '+91 98765 43210', relation: 'Parent of Aarav Menon, 7-B', meta: 'Parent · 7-B',
    audience: 'Parents', className: 'Grade 7', section: 'B', department: 'Accounts',
    label: 'Fee query', state: 'Open', assignedTo: 'Me', pinned: true, unread: 2, online: true,
    optedInOn: '12 Apr 2026',
    lastAt: '09:42', group: 'Pinned',
    previewIcon: 'ti ti-corner-up-left',
    preview: 'Could I pay the term-2 fee in two instalments?',
    lastInboundDay: 0, lastInboundAt: '09:40',
    messages: feeThread, totalMessages: 148,
    sharedMedia: [
      { icon: 'ti ti-file-type-pdf', kind: 'PDF', name: 'salary-slip-july.pdf', meta: '214 KB · received today' },
      { icon: 'ti ti-microphone', kind: 'Voice', name: 'Voice note 0:18', meta: 'Received today, 09:42' },
    ],
  },
  {
    id: 'WA-002', name: 'Sneha Iyer', avatar: 'assets/img/profiles/avatar-02.jpg',
    phone: '+91 90123 45617', relation: 'Parent of Diya Iyer, 4-A', meta: 'Parent · 4-A',
    audience: 'Parents', className: 'Grade 6', section: 'A', department: 'Administration',
    label: 'Follow-up', state: 'Open', assignedTo: 'Me', pinned: true, unread: 1, online: false,
    optedInOn: '08 Mar 2026',
    lastAt: '09:15', group: 'Pinned',
    previewIcon: 'ti ti-photo', preview: "Photo · Diya's medical certificate",
    lastInboundDay: 0, lastInboundAt: '09:15',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'image',
        text: "Diya's medical certificate", templateName: '',
        fileName: 'medical-certificate.jpg', fileMeta: 'JPG · 186 KB',
        at: '09:15', receipt: 'read', day: 'Today',
      },
    ],
    totalMessages: 26,
    sharedMedia: [
      { icon: 'ti ti-photo', kind: 'Image', name: 'medical-certificate.jpg', meta: '186 KB · received today' },
    ],
  },
  {
    id: 'WA-003', name: 'Vikram Rao', avatar: 'assets/img/profiles/avatar-03.jpg',
    phone: '+91 99887 76658', relation: 'Parent of Ishaan Rao, 10-C', meta: 'Parent · 10-C',
    audience: 'Parents', className: 'Grade 10', section: 'C', department: 'Transport',
    label: 'Transport', state: 'Open', assignedTo: 'Mr. Arun Prakash', pinned: false, unread: 3,
    online: false, optedInOn: '02 Feb 2026',
    lastAt: '08:58', group: 'Today',
    previewIcon: 'ti ti-corner-up-left', preview: 'Is the bus running on Route 11 tomorrow?',
    lastInboundDay: 0, lastInboundAt: '08:58',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'text',
        text: 'Is the bus running on Route 11 tomorrow?',
        templateName: '', fileName: '', fileMeta: '',
        at: '08:58', receipt: 'read', day: 'Today',
      },
    ],
    totalMessages: 41,
    sharedMedia: [],
  },
  {
    id: 'WA-004', name: 'Ms. Divya Nair', avatar: 'assets/img/profiles/avatar-04.jpg',
    phone: '+91 91234 50098', relation: 'Academic Coordinator', meta: 'Teacher',
    audience: 'Teachers', className: '', section: '', department: 'Administration',
    label: 'Teacher', state: 'Resolved', assignedTo: 'Ms. Latha Rao', pinned: false, unread: 0,
    online: false, optedInOn: '15 Jan 2026',
    lastAt: '08:31', group: 'Today',
    previewIcon: 'ti ti-checks', preview: "Thanks, I've updated the slot list.",
    lastInboundDay: 0, lastInboundAt: '08:31',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'text',
        text: "Thanks, I've updated the slot list.",
        templateName: '', fileName: '', fileMeta: '',
        at: '08:31', receipt: 'read', day: 'Today',
      },
    ],
    totalMessages: 63,
    sharedMedia: [],
  },
  {
    id: 'WA-005', name: 'Fatima Sheikh', avatar: 'assets/img/profiles/avatar-05.jpg',
    phone: '+91 87654 32102', relation: 'Parent of Zoya Sheikh, 6-B', meta: 'Parent · 6-B',
    audience: 'Parents', className: 'Grade 6', section: 'B', department: 'Admissions',
    label: 'Admission', state: 'Open', assignedTo: 'Unassigned', pinned: false, unread: 1,
    online: false, optedInOn: '20 May 2026',
    lastAt: '08:04', group: 'Today',
    previewIcon: 'ti ti-file-text', preview: 'Document · transfer-certificate.pdf',
    lastInboundDay: 0, lastInboundAt: '08:04',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'file',
        text: '', templateName: '', fileName: 'transfer-certificate.pdf', fileMeta: 'PDF · 92 KB',
        at: '08:04', receipt: 'read', day: 'Today',
      },
    ],
    totalMessages: 12,
    sharedMedia: [
      { icon: 'ti ti-file-type-pdf', kind: 'PDF', name: 'transfer-certificate.pdf', meta: '92 KB · received today' },
    ],
  },
  {
    id: 'WA-006', name: 'Joseph Thomas', avatar: 'assets/img/profiles/avatar-06.jpg',
    phone: '+91 94567 89076', relation: 'Parent of Ann Thomas, 9-A', meta: 'Parent · 9-A',
    audience: 'Parents', className: 'Grade 9', section: 'A', department: 'Administration',
    label: 'Follow-up', state: 'Awaiting reply', assignedTo: 'Unassigned', pinned: false,
    unread: 0, online: false, optedInOn: '11 Jun 2026',
    lastAt: 'Yesterday', group: 'Yesterday',
    previewIcon: 'ti ti-microphone', preview: 'Voice note · 0:34',
    lastInboundDay: 1, lastInboundAt: '16:20',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'voice',
        text: '', templateName: '', fileName: 'Voice note', fileMeta: '0:34',
        at: '16:20', receipt: 'read', day: 'Yesterday',
      },
    ],
    totalMessages: 8,
    sharedMedia: [
      { icon: 'ti ti-microphone', kind: 'Voice', name: 'Voice note 0:34', meta: 'Received yesterday, 16:20' },
    ],
  },
  {
    id: 'WA-007', name: 'Mr. Suresh Babu', avatar: 'assets/img/profiles/avatar-07.jpg',
    phone: '+91 93456 78012', relation: 'Librarian', meta: 'Staff · Library',
    audience: 'Staff', className: '', section: '', department: 'Library',
    label: 'Follow-up', state: 'Assigned', assignedTo: 'Ms. Latha Rao', pinned: false, unread: 1,
    online: false, optedInOn: '05 Jan 2026',
    lastAt: 'Yesterday', group: 'Yesterday',
    previewIcon: 'ti ti-corner-up-left', preview: 'The library migration finishes on the eighth.',
    lastInboundDay: 1, lastInboundAt: '11:05',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'text',
        text: 'The library migration finishes on the eighth.',
        templateName: '', fileName: '', fileMeta: '',
        at: '11:05', receipt: 'read', day: 'Yesterday',
      },
    ],
    totalMessages: 19,
    sharedMedia: [],
  },
  {
    id: 'WA-008', name: 'Ayesha Khan', avatar: 'assets/img/profiles/avatar-08.jpg',
    phone: '+91 87012 34509', relation: 'Student, 12-A', meta: 'Student · 12-A',
    audience: 'Students', className: 'Grade 12', section: 'A', department: 'Examinations',
    label: 'Resolved', state: 'Resolved', assignedTo: 'Unassigned', pinned: false, unread: 0,
    online: false, optedInOn: '18 Apr 2026',
    lastAt: '31 Jul', group: 'Earlier',
    previewIcon: 'ti ti-checks', preview: 'Received the hall ticket, thank you.',
    /* Two days back, so the session has long since closed. */
    lastInboundDay: 2, lastInboundAt: '14:10',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'text',
        text: 'Received the hall ticket, thank you.',
        templateName: '', fileName: '', fileMeta: '',
        at: '14:10', receipt: 'read', day: '31 Jul',
      },
    ],
    totalMessages: 33,
    sharedMedia: [],
  },
  {
    id: 'WA-009', name: 'Priya Nambiar', avatar: 'assets/img/profiles/avatar-09.jpg',
    phone: '+91 90876 54321', relation: 'Parent of Nila Nambiar, 3-C', meta: 'Parent · 3-C',
    audience: 'Parents', className: 'Grade 6', section: 'C', department: 'Administration',
    label: 'Resolved', state: 'Resolved', assignedTo: 'Ms. Latha Rao', pinned: false, unread: 0,
    online: false, optedInOn: '27 Feb 2026',
    lastAt: '30 Jul', group: 'Earlier',
    previewIcon: 'ti ti-checks', preview: "Understood about Thursday's closure.",
    lastInboundDay: 3, lastInboundAt: '18:45',
    messages: [
      {
        id: 'M1', direction: 'in', kind: 'text',
        text: "Understood about Thursday's closure.",
        templateName: '', fileName: '', fileMeta: '',
        at: '18:45', receipt: 'read', day: '30 Jul',
      },
    ],
    totalMessages: 21,
    sharedMedia: [],
  },
];

/** The order the inbox groups its conversations in. */
export const groupOrder = ['Pinned', 'Today', 'Yesterday', 'Earlier'];
