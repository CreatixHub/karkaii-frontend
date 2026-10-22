export type Category =
  | 'Academic' | 'Examination' | 'Fees' | 'Events'
  | 'Emergency' | 'Holiday' | 'Admissions' | 'Newsletter';

export type Priority = 'Urgent' | 'High' | 'Normal';

/** What the record holds. `Expired` is not stored — it is read off the expiry. */
export type Lifecycle = 'Draft' | 'Scheduled' | 'Published' | 'Archived';

/** What the card shows. */
export type Status = 'Draft' | 'Scheduled' | 'Published' | 'Expired' | 'Archived';

export type Channel =
  | 'In-App' | 'Email' | 'SMS' | 'WhatsApp' | 'Push notification' | 'Website banner';

export interface Delivery {
  channel: Channel;
  /** "06:12 pm" — empty while the channel is chosen but nothing has gone out. */
  at: string;
  /** How many the channel actually reached; the list size when not narrowed. */
  delivered: number;
}

export interface Segment {
  label: string;
  note: string;
  count: number;
}

export interface Attachment {
  name: string;
  meta: string;
  icon: string;
}

export interface Comment {
  author: string;
  role: string;
  at: string;
  body: string;
  avatar: string;
}

export interface BodyBlock {
  heading: string;
  paragraphs: string[];
  bullets: string[];
}

export interface Announcement {
  /** Never printed; the template shows no reference on a card or in the reader. */
  id: string;
  title: string;
  summary: string;
  body: BodyBlock[];

  category: Category;
  priority: Priority;
  lifecycle: Lifecycle;

  author: string;
  authorRole: string;

  /** "29 Jul 2026" — the day it went out, was drafted, or is queued for. */
  dated: string;
  /** "06:12 pm" — the clock beside it. */
  datedAt: string;
  /** "31 Jul 2026", empty when the notice does not expire. */
  expires: string;
  expiresAt: string;

  audienceLabel: string;
  audienceTotal: number;
  /** The reader's breakdown; empty where the template prints none. */
  segments: Segment[];

  deliveries: Delivery[];

  /** Zero until something has been delivered. */
  readers: number;
  acknowledged: number;
  ackRequired: boolean;
  allowComments: boolean;

  cover: string;
  coverAlt: string;
  attachments: Attachment[];
  comments: Comment[];
}

/* --------------------------------- Tints ----------------------------------- */

export const statusBadge: Record<Status, string> = {
  Published: 'message-status-badge is-live',
  Scheduled: 'message-status-badge is-scheduled',
  Draft: 'message-status-badge is-draft',
  Expired: 'message-status-badge is-expired',
  Archived: 'message-status-badge is-draft',
};

export const priorityBadge: Record<Priority, string> = {
  Urgent: 'message-status-badge is-urgent',
  High: 'message-status-badge is-high',
  Normal: 'message-status-badge is-accent',
};

export const priorityIcon: Record<Priority, string> = {
  Urgent: 'ti ti-alert-triangle',
  High: 'ti ti-flame',
  Normal: 'ti ti-point',
};

export const channelIcon: Record<Channel, string> = {
  'In-App': 'ti ti-app-window',
  Email: 'ti ti-mail',
  SMS: 'ti ti-message-2',
  WhatsApp: 'ti ti-brand-whatsapp',
  'Push notification': 'ti ti-bell',
  'Website banner': 'ti ti-layout-navbar',
};

/** The pip's tooltip, which shortens the two long channel names. */
export const channelShort: Record<Channel, string> = {
  'In-App': 'In-App',
  Email: 'Email',
  SMS: 'SMS',
  WhatsApp: 'WhatsApp',
  'Push notification': 'Push',
  'Website banner': 'Website banner',
};

export const categoryIcon: Record<Category, string> = {
  Academic: 'ti ti-school',
  Examination: 'ti ti-clipboard-text',
  Fees: 'ti ti-report-money',
  Events: 'ti ti-confetti',
  Emergency: 'ti ti-alert-triangle',
  Holiday: 'ti ti-flag',
  Admissions: 'ti ti-user-plus',
  Newsletter: 'ti ti-news',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'Academic', 'Examination', 'Fees', 'Events',
  'Emergency', 'Holiday', 'Admissions', 'Newsletter',
];

export const audienceOptions = [
  'Entire school', 'Students', 'Parents', 'Teachers',
  'Staff', 'Departments', 'Specific classes',
];

export const priorityOptions: Priority[] = ['Urgent', 'High', 'Normal'];

export const statusOptions: Status[] = ['Published', 'Scheduled', 'Draft', 'Expired', 'Archived'];

export const channelOptions: Channel[] = [
  'In-App', 'Email', 'SMS', 'WhatsApp', 'Push notification', 'Website banner',
];

export const acknowledgementOptions = ['Required', 'Not required'];

export const authorOptions = ['Ms. Latha Rao', 'Mr. Arun Prakash', 'Ms. Divya Nair'];

/* --------------------------- Dialog option lists ----------------------------- */

export const timeZoneOptions = ['IST (UTC +5:30)', 'GST (UTC +4:00)', 'UTC'];

export const templateCategoryOptions: Category[] = [
  'Holiday', 'Academic', 'Examination', 'Fees', 'Events', 'Emergency', 'Admissions', 'Newsletter',
];

export const templateAudienceOptions = ['Entire school', 'Students', 'Parents', 'Teachers', 'Staff'];

/* ------------------------------- Derivations -------------------------------- */

export const REGISTER_DATE = '2 Aug 2026';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

const dayNumber = (value: string): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Math.round(Date.UTC(Number(year), index, Number(day)) / 86_400_000);
};

export const daysBetween = (from: string, to: string): number => dayNumber(to) - dayNumber(from);

/** "29 Jul 2026" → "29 Jul", the way a card abbreviates a date. */
export const shortDate = (value: string): string =>
  value ? value.split(' ').slice(0, 2).join(' ') : '';

/** The card's status, which is the lifecycle until the expiry overtakes it. */
export const statusOf = (row: Announcement): Status => {
  if (row.lifecycle !== 'Published') return row.lifecycle;
  if (!row.expires) return 'Published';
  return dateKey(row.expires) < dateKey(REGISTER_DATE) ? 'Expired' : 'Published';
};

export const isLive = (row: Announcement): boolean => statusOf(row) === 'Published';

/* --------------------------------- Reach ------------------------------------ */

/** Nothing has gone out until a channel carries a delivery time. */
export const releasedOf = (row: Announcement): Delivery[] =>
  row.deliveries.filter((delivery) => delivery.at !== '');

export const isDelivered = (row: Announcement, channel: Channel): boolean =>
  row.deliveries.some((delivery) => delivery.channel === channel && delivery.at !== '');

export const readRateOf = (row: Announcement): number =>
  row.audienceTotal > 0 && row.readers > 0
    ? Math.round((row.readers / row.audienceTotal) * 100)
    : 0;

export const unreadOf = (row: Announcement): number => Math.max(0, row.audienceTotal - row.readers);

/**
 * The theme ships width utilities in steps of four, so the bar snaps to the
 * nearest one rather than carrying the exact percentage.
 */
export const barWidthOf = (row: Announcement): number => {
  const rate = readRateOf(row);
  if (rate === 0) return 4;
  return Math.min(100, Math.max(4, Math.round(rate / 4) * 4));
};

/**
 * The bar's tint, which the template sets by hand and not quite consistently:
 * 78 %, 81 % and up read `is-live`, 69 % and 53 % read `is-warn`, and 72 – 73 %
 * are left plain. One rule covers all of them bar the sports card, which is
 * left plain at 63 % here and reads `is-warn`.
 */
export const rateTone = (rate: number): string => {
  if (rate === 0) return '';
  if (rate >= 75) return ' is-live';
  return rate < 70 ? ' is-warn' : '';
};

export const rateToneOf = (row: Announcement): string => rateTone(readRateOf(row));

/** The nearest width utility to a bare percentage, for the reference sections. */
export const barWidth = (rate: number): number =>
  rate === 0 ? 4 : Math.min(100, Math.max(4, Math.round(rate / 4) * 4));

/** The line above the bar, which a draft and a queued notice word differently. */
export const reachLabelOf = (row: Announcement): string => {
  const status = statusOf(row);
  if (status === 'Draft') return 'Not yet delivered';
  if (status === 'Scheduled') return `Queued for ${row.audienceTotal.toLocaleString()} recipients`;
  return `Read by ${row.readers.toLocaleString()} of ${row.audienceTotal.toLocaleString()}`;
};

/** The figure at its right; an em dash until something has been read. */
export const reachValueOf = (row: Announcement): string =>
  readRateOf(row) > 0 ? `${readRateOf(row)}%` : '—';

/* ---------------------------------- Facts ----------------------------------- */

/** The Published / Drafted / Goes out fact; the card bolds the date after it. */
export const sentVerbOf = (row: Announcement): string => {
  const status = statusOf(row);
  if (status === 'Draft') return 'Drafted';
  return status === 'Scheduled' ? 'Goes out' : 'Published';
};

export const sentLabelOf = (row: Announcement): string =>
  `${sentVerbOf(row)} ${shortDate(row.dated)}`;

export const sentIconOf = (row: Announcement): string => {
  const status = statusOf(row);
  if (status === 'Draft') return 'ti ti-pencil';
  return status === 'Scheduled' ? 'ti ti-clock' : 'ti ti-send';
};

export const expiryVerbOf = (row: Announcement): string => {
  if (!row.expires) return 'No expiry';
  return dateKey(row.expires) < dateKey(REGISTER_DATE) ? 'Expired' : 'Expires';
};

export const expiryLabelOf = (row: Announcement): string =>
  row.expires ? `${expiryVerbOf(row)} ${shortDate(row.expires)}` : 'No expiry';

export const attachmentLabelOf = (row: Announcement): string => {
  const count = row.attachments.length;
  if (count === 0) return 'No attachments';
  return `${count} ${count === 1 ? 'attachment' : 'attachments'}`;
};

/** The `.message-post` modifier: urgency first, then a notice still in draft. */
export const postModifierOf = (row: Announcement): string => {
  if (row.priority === 'Urgent') return ' is-urgent';
  if (row.priority === 'High') return ' is-high';
  return statusOf(row) === 'Draft' ? ' is-draft' : '';
};

/* ---------------------------------- Reader ---------------------------------- */

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: Announcement): Pair[] => [
  { label: 'Category', value: row.category },
  { label: 'Priority', value: row.priority },
  {
    label: statusOf(row) === 'Scheduled' ? 'Scheduled' : statusOf(row) === 'Draft' ? 'Drafted' : 'Published',
    value: `${row.dated}, ${row.datedAt}`,
  },
  { label: 'Expires', value: row.expires ? `${row.expires}, ${row.expiresAt}` : 'No expiry' },
  { label: 'Acknowledgement', value: row.ackRequired ? 'Required' : 'Not required' },
  { label: 'Author', value: row.author },
];

export const readPairsOf = (row: Announcement): Pair[] => [
  { label: 'Read', value: row.readers.toLocaleString() },
  { label: 'Unread', value: unreadOf(row).toLocaleString() },
  { label: 'Acknowledged', value: row.ackRequired ? row.acknowledged.toLocaleString() : 'Not required' },
];

/** The sentence under the read figures, which counts the families still to open it. */
export const chaseLineOf = (row: Announcement): string => {
  if (statusOf(row) === 'Draft') return 'Nothing has been delivered yet.';
  if (statusOf(row) === 'Scheduled') return `Queued for ${row.audienceTotal.toLocaleString()} recipients.`;
  const unread = unreadOf(row);
  return unread === 0
    ? 'Every recipient has opened the notice.'
    : `Class teachers are calling the ${unread.toLocaleString()} families who have not opened the notice.`;
};

/** The audience breakdown, falling back to the list size where none is stored. */
export const segmentsOf = (row: Announcement): Segment[] =>
  row.segments.length > 0
    ? row.segments
    : [{ label: row.audienceLabel, note: 'On the distribution list', count: row.audienceTotal }];

/* --------------------------------- Filters ---------------------------------- */

export const searchIndexOf = (row: Announcement): string =>
  [row.title, row.summary, row.category, row.audienceLabel, row.author, statusOf(row), row.priority]
    .join(' ')
    .toLowerCase();

/** The Audience filter's options against the audiences a notice actually names. */
export const matchesAudience = (row: Announcement, choice: string): boolean => {
  const label = row.audienceLabel.toLowerCase();
  if (choice === 'Entire school') return label.includes('entire school');
  if (choice === 'Specific classes') return label.includes('class');
  if (choice === 'Departments') return label.includes('department');
  return label.includes(choice.toLowerCase());
};

export const usesChannel = (row: Announcement, channel: string): boolean =>
  row.deliveries.some((delivery) => delivery.channel === channel);

/* --------------------------------- Summary ---------------------------------- */

/**
 * The rail counts the whole term — 34 announcements against the eight this page
 * lists — so the template's figures stand and the register moves them.
 */
export const QUICK_TOTALS = {
  live: 6,
  scheduled: 4,
  drafts: 3,
  urgent: 1,
  needsAck: 3,
  expired: 2,
};

export const TOTAL_COUNT = 34;

/** The template's one honest committed chip is the window it opens on. */
export const PERIOD = '01 Jul 2026 - 02 Aug 2026';

/* ---------------------------------- Rows ------------------------------------ */

export const announcements: Announcement[] = [
  {
    id: 'ANN-2026-0142',
    title: 'School closed Thursday due to heavy rainfall',
    summary: 'The district administration has declared a holiday for all schools on 30 July. Buses will not run and the hostel mess will operate on a holiday schedule.',
    body: [
      {
        heading: '',
        paragraphs: [
          "Following the district administration's advisory issued this evening, the school will remain closed on Thursday, 30 July 2026. The decision applies to all sections, Nursery through Grade 12, and to the hostel day programme.",
        ],
        bullets: [],
      },
      {
        heading: 'What this means',
        paragraphs: [],
        bullets: [
          'No school buses will run on any route. Please do not send children to pickup points.',
          'The hostel mess will operate on a holiday schedule; boarders remain on campus.',
          'The Grade 9 unit test scheduled for Thursday moves to Monday, 3 August, same period.',
          'Administrative offices stay closed. Fee payments due Thursday may be made without penalty until Friday.',
        ],
      },
      {
        heading: 'Reopening',
        paragraphs: [
          'We expect to reopen on Friday, 31 July, on the regular timetable. Should the advisory be extended, a further announcement will be sent by 6:00 pm on Thursday through the same channels.',
          'Parents are requested to acknowledge this notice in the portal so we know it has been seen. Class teachers will follow up by phone with families who have not acknowledged by Thursday morning.',
        ],
        bullets: [],
      },
    ],
    category: 'Emergency', priority: 'Urgent', lifecycle: 'Published',
    author: 'Ms. Latha Rao', authorRole: 'Administrator',
    dated: '29 Jul 2026', datedAt: '06:12 pm',
    expires: '31 Jul 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Entire school', audienceTotal: 2940,
    segments: [
      { label: 'Students', note: 'All sections', count: 1286 },
      { label: 'Parents', note: 'Primary guardian', count: 1240 },
      { label: 'Teachers', note: '', count: 184 },
      { label: 'Staff', note: 'Including transport', count: 230 },
    ],
    deliveries: [
      { channel: 'In-App', at: '06:12 pm', delivered: 2940 },
      { channel: 'Email', at: '06:12 pm', delivered: 2922 },
      { channel: 'SMS', at: '06:14 pm', delivered: 2908 },
      { channel: 'Push notification', at: '06:12 pm', delivered: 2104 },
    ],
    readers: 2684, acknowledged: 2411, ackRequired: true, allowComments: true,
    cover: 'assets/img/blogs/blog-01.jpg', coverAlt: 'Heavy rainfall closure notice',
    attachments: [
      { name: 'District advisory 29-07-2026.pdf', meta: 'PDF · 412 KB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [
      {
        author: 'Rahul Menon', role: 'Parent · Grade 7 B', at: '29 Jul, 06:40 pm',
        body: 'Will the Thursday swimming coaching also be cancelled, or is that being run separately by the sports department?',
        avatar: 'assets/img/profiles/avatar-01.jpg',
      },
      {
        author: 'Ms. Latha Rao', role: 'Administrator', at: '29 Jul, 06:52 pm',
        body: 'All coaching, including swimming, is cancelled for Thursday. The sports department will confirm the make-up session on Friday.',
        avatar: 'assets/img/profiles/avatar-02.jpg',
      },
      {
        author: 'Sneha Iyer', role: 'Parent · Grade 4 A', at: '29 Jul, 07:15 pm',
        body: 'Acknowledged. Thank you for sending this on SMS as well — the network here has been poor all evening.',
        avatar: 'assets/img/profiles/avatar-03.jpg',
      },
      {
        author: 'Mr. Arun Prakash', role: 'Transport in-charge', at: '29 Jul, 07:31 pm',
        body: 'Route supervisors have been informed and will call families on routes 3, 7 and 11 who have not acknowledged by morning.',
        avatar: 'assets/img/profiles/avatar-04.jpg',
      },
    ],
  },
  {
    id: 'ANN-2026-0138',
    title: 'Term-2 examination circular and seating plan',
    summary: 'Examinations begin 12 August. Hall tickets are available in the parent portal from Monday; seating plans are attached class by class.',
    body: [
      {
        heading: '',
        paragraphs: [
          'Term-2 examinations begin on Wednesday, 12 August and run to Friday, 21 August. The detailed timetable, seating plan and hall ticket for each class are attached.',
        ],
        bullets: [],
      },
      {
        heading: 'Before the first paper',
        paragraphs: [],
        bullets: [
          'Hall tickets are downloadable from the parent portal from Monday, 3 August.',
          'Students report to the examination hall fifteen minutes before each paper.',
          'Only a transparent pencil case, a non-programmable calculator and the hall ticket are permitted.',
        ],
      },
    ],
    category: 'Examination', priority: 'High', lifecycle: 'Published',
    author: 'Ms. Divya Nair', authorRole: 'Examination Officer',
    dated: '26 Jul 2026', datedAt: '11:20 am',
    expires: '20 Aug 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Students, Parents', audienceTotal: 1920,
    segments: [],
    deliveries: [
      { channel: 'In-App', at: '11:20 am', delivered: 1920 },
      { channel: 'Email', at: '11:20 am', delivered: 1904 },
      { channel: 'SMS', at: '', delivered: 0 },
      { channel: 'WhatsApp', at: '11:22 am', delivered: 1863 },
    ],
    readers: 1406, acknowledged: 1180, ackRequired: true, allowComments: true,
    cover: 'assets/img/blogs/blog-02.jpg', coverAlt: 'Examination circular',
    attachments: [
      { name: 'Term-2 timetable.pdf', meta: 'PDF · 128 KB', icon: 'ti ti-file-type-pdf' },
      { name: 'Seating plan Grades 6-10.pdf', meta: 'PDF · 246 KB', icon: 'ti ti-file-type-pdf' },
      { name: 'Examination rules.pdf', meta: 'PDF · 64 KB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [
      {
        author: 'Priya Nambiar', role: 'Parent · Grade 8 A', at: '26 Jul, 12:05 pm',
        body: 'Is the hall ticket needed in print, or is the portal copy on a phone acceptable at the door?',
        avatar: 'assets/img/profiles/avatar-05.jpg',
      },
      {
        author: 'Ms. Divya Nair', role: 'Examination Officer', at: '26 Jul, 12:18 pm',
        body: 'A phone copy is accepted at the door. Please keep the brightness up so the invigilator can read the barcode.',
        avatar: 'assets/img/profiles/avatar-06.jpg',
      },
    ],
  },
  {
    id: 'ANN-2026-0134',
    title: 'Second term fee due by 10 August',
    summary: 'Payment can be made online or at the accounts counter. A late fee applies from 11 August; concession holders are unaffected.',
    body: [
      {
        heading: '',
        paragraphs: [
          'The second term fee is payable by Monday, 10 August. The amount for each class is on the fee annexure attached, and the portal shows the exact balance for your ward.',
        ],
        bullets: [],
      },
      {
        heading: 'How to pay',
        paragraphs: [],
        bullets: [
          'Online through the parent portal, by card, net banking or UPI.',
          'At the accounts counter between 9:00 am and 1:00 pm on working days.',
          'A late fee of 2% a week applies from 11 August. Concession holders are unaffected.',
        ],
      },
    ],
    category: 'Fees', priority: 'High', lifecycle: 'Published',
    author: 'Mr. Arun Prakash', authorRole: 'Accounts Officer',
    dated: '24 Jul 2026', datedAt: '09:40 am',
    expires: '11 Aug 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Parents', audienceTotal: 1240,
    segments: [],
    deliveries: [
      { channel: 'In-App', at: '09:40 am', delivered: 1240 },
      { channel: 'Email', at: '09:40 am', delivered: 1232 },
      { channel: 'SMS', at: '09:41 am', delivered: 1228 },
      { channel: 'WhatsApp', at: '09:44 am', delivered: 1201 },
    ],
    readers: 892, acknowledged: 0, ackRequired: false, allowComments: true,
    cover: 'assets/img/blogs/blog-03.jpg', coverAlt: 'Fee due notice',
    attachments: [
      { name: 'Fee annexure term 2.pdf', meta: 'PDF · 88 KB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [],
  },
  {
    id: 'ANN-2026-0129',
    title: 'Annual sports meet — house registrations open',
    summary: 'Track, field and team events across three days in September. Students register through their house captain by 15 August.',
    body: [
      {
        heading: '',
        paragraphs: [
          'The annual sports meet runs from 9 to 11 September on the main ground. Registrations are open now and close on 15 August.',
        ],
        bullets: [],
      },
      {
        heading: 'Registering',
        paragraphs: [],
        bullets: [
          'Students register through their house captain, not directly with the games department.',
          'A student may enter at most two track events and one field event.',
          'Team entries close a week earlier, on 8 August, so heats can be drawn.',
        ],
      },
    ],
    category: 'Events', priority: 'Normal', lifecycle: 'Published',
    author: 'Mr. Arun Prakash', authorRole: 'Games Department',
    dated: '21 Jul 2026', datedAt: '03:15 pm',
    expires: '15 Aug 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Students, Teachers', audienceTotal: 1760,
    segments: [],
    deliveries: [
      { channel: 'In-App', at: '03:15 pm', delivered: 1760 },
      { channel: 'Email', at: '', delivered: 0 },
      { channel: 'SMS', at: '', delivered: 0 },
      { channel: 'Website banner', at: '03:20 pm', delivered: 1760 },
    ],
    readers: 1102, acknowledged: 0, ackRequired: false, allowComments: true,
    cover: 'assets/img/events/event-01.jpg', coverAlt: 'Annual sports meet',
    attachments: [
      { name: 'Event list 2026.pdf', meta: 'PDF · 74 KB', icon: 'ti ti-file-type-pdf' },
      { name: 'House registration form.pdf', meta: 'PDF · 42 KB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [],
  },
  {
    id: 'ANN-2026-0146',
    title: 'Admissions open for the 2027 – 2028 session',
    summary: "Applications for Nursery through Grade 9 open in September. Awaiting the principal's sign-off on the fee annexure before publishing.",
    body: [
      {
        heading: '',
        paragraphs: [
          'Applications for the 2027 – 2028 session open on 1 September for Nursery through Grade 9. The prospectus and the fee annexure are attached in draft.',
        ],
        bullets: [],
      },
      {
        heading: 'Still to settle',
        paragraphs: [],
        bullets: [
          'The fee annexure is with the principal for sign-off.',
          'Sibling priority wording needs a line from the admissions committee.',
          'The website banner artwork has not been supplied yet.',
        ],
      },
    ],
    category: 'Admissions', priority: 'Normal', lifecycle: 'Draft',
    author: 'Ms. Latha Rao', authorRole: 'Administrator',
    dated: '1 Aug 2026', datedAt: '04:05 pm',
    expires: '', expiresAt: '',
    audienceLabel: 'Website, Parents', audienceTotal: 1240,
    segments: [],
    deliveries: [
      { channel: 'In-App', at: '', delivered: 0 },
      { channel: 'Email', at: '', delivered: 0 },
      { channel: 'Website banner', at: '', delivered: 0 },
    ],
    readers: 0, acknowledged: 0, ackRequired: false, allowComments: false,
    cover: 'assets/img/blogs/blog-04.jpg', coverAlt: 'Admissions notice',
    attachments: [
      { name: 'Prospectus draft.pdf', meta: 'PDF · 1.2 MB', icon: 'ti ti-file-type-pdf' },
      { name: 'Fee annexure draft.pdf', meta: 'PDF · 96 KB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [],
  },
  {
    id: 'ANN-2026-0145',
    title: 'Independence Day — flag hoisting at 8:00 am',
    summary: 'Attendance is optional for students but expected for house captains and the band. Regular classes resume the following day.',
    body: [
      {
        heading: '',
        paragraphs: [
          'The school will observe Independence Day on Friday, 15 August. Flag hoisting begins promptly at 8:00 am on the main ground, followed by the house march past and a short cultural programme.',
        ],
        bullets: [],
      },
      {
        heading: 'Who should attend',
        paragraphs: [],
        bullets: [
          'House captains, the band and the NCC contingent are expected in full uniform by 7:30 am.',
          'Attendance is optional for all other students; parents are welcome.',
          'Buses will run a single morning trip at 7:00 am and a return trip at 10:30 am.',
          'Regular classes resume on Monday, 18 August, on the usual timetable.',
        ],
      },
    ],
    category: 'Holiday', priority: 'Normal', lifecycle: 'Scheduled',
    author: 'Ms. Latha Rao', authorRole: 'Administrator',
    dated: '12 Aug 2026', datedAt: '08:00 am',
    expires: '16 Aug 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Entire school', audienceTotal: 2940,
    segments: [
      { label: 'Students', note: 'All sections', count: 1286 },
      { label: 'Parents', note: 'Primary guardian', count: 1240 },
      { label: 'Teachers', note: '', count: 184 },
      { label: 'Staff', note: 'Including transport', count: 230 },
    ],
    deliveries: [
      { channel: 'In-App', at: '', delivered: 0 },
      { channel: 'Email', at: '', delivered: 0 },
      { channel: 'Push notification', at: '', delivered: 0 },
    ],
    readers: 0, acknowledged: 0, ackRequired: false, allowComments: true,
    cover: 'assets/img/events/event-02.jpg', coverAlt: 'Independence Day flag hoisting',
    attachments: [],
    comments: [],
  },
  {
    id: 'ANN-2026-0121',
    title: 'Parent–teacher meeting slots for Grades 6 to 10',
    summary: 'Twenty-minute slots on 09 August. Book through the parent portal; unbooked slots are released to walk-ins after 11:00 am.',
    body: [
      {
        heading: '',
        paragraphs: [
          'Parent–teacher meetings for Grades 6 to 10 are on Sunday, 9 August between 9:00 am and 1:00 pm. Each slot is twenty minutes with the class teacher, and subject teachers are available in the hall throughout.',
        ],
        bullets: [],
      },
      {
        heading: 'Booking',
        paragraphs: [],
        bullets: [
          'Slots open in the parent portal on 2 August at 9:00 am.',
          'One slot per family; siblings in different grades may book separately.',
          'Unbooked slots are released to walk-ins after 11:00 am.',
        ],
      },
    ],
    category: 'Academic', priority: 'Normal', lifecycle: 'Published',
    author: 'Ms. Divya Nair', authorRole: 'Academic Coordinator',
    dated: '18 Jul 2026', datedAt: '10:05 am',
    expires: '9 Aug 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Parents · 5 classes', audienceTotal: 720,
    segments: [],
    deliveries: [
      { channel: 'In-App', at: '10:05 am', delivered: 720 },
      { channel: 'Email', at: '10:05 am', delivered: 716 },
      { channel: 'WhatsApp', at: '10:08 am', delivered: 702 },
    ],
    readers: 604, acknowledged: 561, ackRequired: true, allowComments: true,
    cover: 'assets/img/blogs/blog-05.jpg', coverAlt: 'Parent teacher meeting',
    attachments: [
      { name: 'Slot chart Grades 6-10.pdf', meta: 'PDF · 58 KB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [
      {
        author: 'Anil Kurup', role: 'Parent · Grade 10 C', at: '18 Jul, 11:12 am',
        body: 'Can both parents attend the same slot, or is it one guardian per booking?',
        avatar: 'assets/img/profiles/avatar-07.jpg',
      },
    ],
  },
  {
    id: 'ANN-2026-0108',
    title: 'July newsletter — library week and reading challenge',
    summary: 'Results of the summer reading challenge, new arrivals in the senior library, and a note from the librarian on overdue returns.',
    body: [
      {
        heading: '',
        paragraphs: [
          'The July newsletter carries the results of the summer reading challenge, the new arrivals in the senior library and a note from the librarian on overdue returns.',
        ],
        bullets: [],
      },
      {
        heading: 'In this issue',
        paragraphs: [],
        bullets: [
          'Reading challenge results, house by house, with the winning shelf list.',
          'Forty-one new titles in the senior library, catalogued and on the shelves.',
          'Overdue returns: 63 books are out past their date; please return them this week.',
        ],
      },
    ],
    category: 'Newsletter', priority: 'Normal', lifecycle: 'Published',
    author: 'Ms. Divya Nair', authorRole: 'Librarian',
    dated: '2 Jul 2026', datedAt: '05:00 pm',
    expires: '31 Jul 2026', expiresAt: '11:59 pm',
    audienceLabel: 'Entire school', audienceTotal: 2940,
    segments: [
      { label: 'Students', note: 'All sections', count: 1286 },
      { label: 'Parents', note: 'Primary guardian', count: 1240 },
      { label: 'Teachers', note: '', count: 184 },
      { label: 'Staff', note: 'Including transport', count: 230 },
    ],
    deliveries: [
      { channel: 'In-App', at: '05:00 pm', delivered: 2940 },
      { channel: 'Email', at: '05:00 pm', delivered: 2918 },
      { channel: 'SMS', at: '', delivered: 0 },
    ],
    readers: 1548, acknowledged: 0, ackRequired: false, allowComments: true,
    cover: 'assets/img/blogs/blog-06.jpg', coverAlt: 'July newsletter',
    attachments: [
      { name: 'July newsletter.pdf', meta: 'PDF · 2.1 MB', icon: 'ti ti-file-type-pdf' },
    ],
    comments: [],
  },
];
