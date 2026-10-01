export type Category =
  | 'Emergency' | 'Important' | 'Holiday' | 'Examination' | 'Event' | 'Circular' | 'General';

export type Priority = 'High' | 'Medium' | 'Low';

export type Audience = 'Students' | 'Teachers' | 'Parents' | 'Staff' | 'All';

export type NoticeStatus = 'Published' | 'Draft' | 'Archived';

export interface NoticeFile {
  name: string;
  meta: string;
  icon: string;
}

export interface NoticeComment {
  author: string;
  at: string;
  body: string;
  avatar: string;
}

export interface Notice {
  id: string;
  title: string;
  /** The card's two-line summary. */
  desc: string;
  /** The panel's full text. */
  full: string;

  category: Category;
  priority: Priority;
  audience: Audience;
  department: string;
  classes: string;
  branch: string;
  status: NoticeStatus;

  publisher: string;
  publisherRole: string;
  avatar: string;

  published: string;
  expiry: string;

  /** Kept in step with `files`; the card prints the count. */
  attachments: number;
  files: NoticeFile[];

  reads: number;
  /** Share of this notice's own recipients that opened it. */
  readPct: number;

  pinned: boolean;
  comments: NoticeComment[];
}

/* --------------------------------- Tints ----------------------------------- */

export const categoryBadge: Record<Category, string> = {
  Emergency: 'badge badge-soft-danger',
  Important: 'badge badge-soft-warning',
  Holiday: 'badge badge-soft-success',
  Examination: 'badge badge-soft-secondary',
  Event: 'badge badge-soft-info',
  Circular: 'badge badge-soft-secondary',
  General: 'badge badge-soft-primary',
};

export const categoryIcon: Record<Category, string> = {
  Emergency: 'ti ti-alert-triangle',
  Important: 'ti ti-star',
  Holiday: 'ti ti-beach',
  Examination: 'ti ti-file-certificate',
  Event: 'ti ti-confetti',
  Circular: 'ti ti-file-text',
  General: 'ti ti-bell',
};

/** The `pri-*` modifier the card carries; General has no colour of its own. */
export const cardToneOf = (row: Notice): string =>
  row.category === 'General' ? 'pri-normal' : `pri-${row.category.toLowerCase()}`;

export const statusBadge: Record<NoticeStatus, string> = {
  Published: 'badge badge-soft-success',
  Draft: 'badge badge-soft-warning',
  Archived: 'badge badge-soft-secondary',
};

export const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Category[] = [
  'Emergency', 'Important', 'Holiday', 'Examination', 'Event', 'Circular', 'General',
];

/**
 * The template's Audience select lists "All" twice — once as the blank option
 * and once as a value. Only the value is kept here; the shell draws the blank.
 */
export const audienceOptions: Audience[] = ['Students', 'Teachers', 'Parents', 'Staff', 'All'];

export const priorityOptions: Priority[] = ['High', 'Medium', 'Low'];

export const departmentOptions = [
  'Administration', 'Examinations', 'Sports', 'Accounts', 'Academics', 'Library', 'HR',
];

export const classOptions = ['All Classes', 'Grade 6-10', 'Grade 5-8'];

export const branchOptions = ['Main Campus', 'North Branch'];

export const publisherOptions = [
  "Principal's Office", 'Examination Cell', 'Safety Office', 'Sports Department',
  'Finance Office', 'Academic Coordinator', 'Library Department', 'HR Department',
  'Discipline Committee',
];

export const dateRangeOptions = ['Jul 2026', 'Jun 2026'];

/* --------------------------- Dialog option lists ----------------------------- */

export const composerAudienceOptions = ['Students', 'Teachers', 'Parents', 'Staff'];

export const composerClassOptions = ['All Classes', 'Grade 5-8', 'Grade 6-10'];

export const statusOptions: NoticeStatus[] = ['Published', 'Draft', 'Archived'];

export const channelOptions = [
  'Email & App Push', 'Email only', 'App Push only', 'Email, SMS & App',
];

/* ------------------------------- Derivations -------------------------------- */

/** The composer's own default publish date is the day the board stands on. */
export const REGISTER_DATE = '25 Jul 2026';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const dateKey = (value: string): number => {
  if (!value) return 0;
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  if (index === -1) return 0;
  return Number(year) * 10000 + (index + 1) * 100 + Number(day);
};

/** "25/07/2026" — the format the dialogs' date inputs carry. */
export const toSlashDate = (value: string): string => {
  if (!value) return '';
  const [day, month, year] = value.split(' ');
  const index = months.indexOf(month);
  return index === -1 ? '' : `${day.padStart(2, '0')}/${String(index + 1).padStart(2, '0')}/${year}`;
};

export const fromSlashDate = (value: string): string => {
  if (!value) return '';
  const [day, month, year] = value.split('/');
  return months[Number(month) - 1] ? `${Number(day)} ${months[Number(month) - 1]} ${year}` : value;
};

export const pinnedOf = (rows: Notice[]): Notice[] => rows.filter((row) => row.pinned);

export const unpinnedOf = (rows: Notice[]): Notice[] => rows.filter((row) => !row.pinned);

/** The panel's read bar, as a percentage width. */
export const readBarOf = (row: Notice): string => `${Math.min(100, Math.max(0, row.readPct))}%`;

/** The share link the dialog offers, built from the notice's own reference. */
export const shareLinkOf = (row: Notice): string =>
  `https://preskool.edu/notices/${row.id}`;

export interface Pair {
  label: string;
  value: string;
}

export const detailPairsOf = (row: Notice): Pair[] => [
  { label: 'Published', value: row.published },
  { label: 'Expires', value: row.expiry },
  { label: 'Audience', value: row.audience },
  { label: 'Departments', value: row.department },
  { label: 'Classes', value: row.classes },
  { label: 'Attachments', value: `${row.attachments} files` },
];

/** `data-search`, rebuilt from the fields it was made of. */
export const searchIndexOf = (row: Notice): string =>
  [
    row.id, row.title, row.category, row.priority, row.audience,
    row.department, row.classes, row.branch, row.publisher, row.desc,
  ]
    .join(' ')
    .toLowerCase();

/* ---------------------------------- Rows ------------------------------------ */

export const notices: Notice[] = [
  {
    id: 'NTC-201',
    title: 'Campus Closed — Regional Public Holiday',
    desc: 'The school will remain closed on 15 July 2026 in observance of the regional public holiday. Classes resume on 16 July.',
    full: 'The school will remain closed on Wednesday, 15 July 2026, in observance of the regional public holiday. All academic and administrative activities are suspended for the day. Regular classes and office hours resume on Thursday, 16 July 2026. Transport services will operate as per the normal schedule from the resumption day.',
    category: 'Holiday', priority: 'Medium', audience: 'All',
    department: 'Administration', classes: 'All Classes', branch: 'Main Campus',
    status: 'Published',
    publisher: "Principal's Office", publisherRole: 'Administration', avatar: 'assets/img/profiles/avatar-27.jpg',
    published: '08 Jul 2026', expiry: '16 Jul 2026',
    attachments: 1,
    files: [
      { name: 'Holiday-Circular.pdf', meta: 'PDF · 248 KB · 08 Jul 2026', icon: 'ti ti-file-type-pdf' },
    ],
    reads: 842, readPct: 78, pinned: true,
    comments: [
      {
        author: 'Ricky Anderson', at: '2h ago',
        body: 'Thank you for the timely update. Noted the reporting time.',
        avatar: 'assets/img/profiles/avatar-01.jpg',
      },
      {
        author: 'Sylvia Green', at: '5h ago',
        body: 'Will the transport schedule change as well?',
        avatar: 'assets/img/profiles/avatar-02.jpg',
      },
    ],
  },
  {
    id: 'NTC-202',
    title: 'Term 1 Examination Schedule Released',
    desc: 'The Term 1 examination timetable for Grades 6–10 is now available. Please review the datesheet and reporting instructions.',
    full: 'The Term 1 examination timetable for Grades 6 to 10 has been published. Examinations commence on 28 July 2026. Students must report to their allotted halls 20 minutes before each session with valid ID cards. The detailed datesheet and seating plan are attached. Parents are requested to ensure timely preparation and attendance.',
    category: 'Examination', priority: 'High', audience: 'Students',
    department: 'Examinations', classes: 'Grade 6-10', branch: 'Main Campus',
    status: 'Published',
    publisher: 'Examination Cell', publisherRole: 'Academics', avatar: 'assets/img/profiles/avatar-23.jpg',
    published: '06 Jul 2026', expiry: '05 Aug 2026',
    attachments: 2,
    files: [
      { name: 'Notice-Circular.pdf', meta: 'PDF · 248 KB · 06 Jul 2026', icon: 'ti ti-file-type-pdf' },
      { name: 'Datesheet.jpg', meta: 'Image · 96 KB · 06 Jul 2026', icon: 'ti ti-photo' },
    ],
    reads: 1203, readPct: 92, pinned: true,
    comments: [
      {
        author: 'Ricky Anderson', at: '2h ago',
        body: 'Thank you for the timely update. Noted the reporting time.',
        avatar: 'assets/img/profiles/avatar-01.jpg',
      },
      {
        author: 'Sylvia Green', at: '5h ago',
        body: 'Will the transport schedule change as well?',
        avatar: 'assets/img/profiles/avatar-02.jpg',
      },
    ],
  },
  {
    id: 'NTC-203',
    title: 'Emergency: Early Dismissal Due to Weather',
    desc: 'Due to a severe weather warning, the school will dismiss early at 12:30 PM today. Transport has been rescheduled.',
    full: 'Owing to a severe weather advisory issued by local authorities, the school will conduct an early dismissal at 12:30 PM today. All bus routes have been rescheduled accordingly and parents opting for self pick-up are requested to arrive by 12:15 PM. Student safety is our priority; please monitor official channels for further updates.',
    category: 'Emergency', priority: 'High', audience: 'Parents',
    department: 'Administration', classes: 'All Classes', branch: 'Main Campus',
    status: 'Published',
    publisher: 'Safety Office', publisherRole: 'Administration', avatar: 'assets/img/profiles/avatar-25.jpg',
    published: '09 Jul 2026', expiry: '10 Jul 2026',
    attachments: 0, files: [],
    reads: 1560, readPct: 96, pinned: true,
    comments: [
      {
        author: 'Sylvia Green', at: '5h ago',
        body: 'Will the transport schedule change as well?',
        avatar: 'assets/img/profiles/avatar-02.jpg',
      },
    ],
  },
  {
    id: 'NTC-204',
    title: 'Annual Sports Day — Call for Registration',
    desc: 'Registrations for the Annual Sports Day are now open. Students can enrol for track and field events through their class teachers.',
    full: 'The Annual Sports Day will be held on 12 August 2026 at the main ground. Students may register for track and field, relay and team events through their respective class teachers before 22 July. Practice sessions begin next week. Parents are warmly invited to attend and cheer for the houses.',
    category: 'Event', priority: 'Medium', audience: 'Students',
    department: 'Sports', classes: 'All Classes', branch: 'Main Campus',
    status: 'Published',
    publisher: 'Sports Department', publisherRole: 'Co-curricular', avatar: 'assets/img/profiles/avatar-01.jpg',
    published: '05 Jul 2026', expiry: '22 Jul 2026',
    attachments: 1,
    files: [
      { name: 'Sports-Day-Events.pdf', meta: 'PDF · 164 KB · 05 Jul 2026', icon: 'ti ti-file-type-pdf' },
    ],
    reads: 640, readPct: 61, pinned: false,
    comments: [],
  },
  {
    id: 'NTC-205',
    title: 'Fee Payment Circular — Term 1 Instalment',
    desc: 'The Term 1 fee instalment is due by 20 July 2026. Kindly complete the payment via the parent portal.',
    full: 'This circular is to remind parents that the Term 1 fee instalment is due on or before 20 July 2026. Payments can be made through the parent portal or at the accounts office. A late fee applies after the due date. For any billing queries, please contact the Finance Office during working hours.',
    category: 'Circular', priority: 'Medium', audience: 'Parents',
    department: 'Accounts', classes: 'All Classes', branch: 'Main Campus',
    status: 'Published',
    publisher: 'Finance Office', publisherRole: 'Accounts', avatar: 'assets/img/profiles/avatar-05.jpg',
    published: '04 Jul 2026', expiry: '20 Jul 2026',
    attachments: 1,
    files: [
      { name: 'Fee-Structure-Term-1.pdf', meta: 'PDF · 118 KB · 04 Jul 2026', icon: 'ti ti-file-type-pdf' },
    ],
    reads: 988, readPct: 74, pinned: false,
    comments: [],
  },
  {
    id: 'NTC-206',
    title: 'Parent–Teacher Meeting — Grade 5 to 8',
    desc: 'The PTM for Grades 5–8 is scheduled for 19 July 2026. Slot bookings are open on the parent portal.',
    full: 'The Parent–Teacher Meeting for Grades 5 to 8 will be conducted on 19 July 2026 from 9:00 AM to 1:00 PM. Parents can book preferred time slots through the parent portal. This session offers an opportunity to discuss academic progress and well-being with subject teachers.',
    category: 'Important', priority: 'High', audience: 'Parents',
    department: 'Academics', classes: 'Grade 5-8', branch: 'Main Campus',
    status: 'Published',
    publisher: 'Academic Coordinator', publisherRole: 'Academics', avatar: 'assets/img/profiles/avatar-12.jpg',
    published: '03 Jul 2026', expiry: '18 Jul 2026',
    attachments: 1,
    files: [
      { name: 'PTM-Slot-Chart.pdf', meta: 'PDF · 72 KB · 03 Jul 2026', icon: 'ti ti-file-type-pdf' },
    ],
    reads: 712, readPct: 69, pinned: false,
    comments: [],
  },
  {
    id: 'NTC-207',
    title: 'Library Week — Book Fair & Reading Challenge',
    desc: 'Celebrate Library Week with a book fair and a school-wide reading challenge. Exciting prizes to be won.',
    full: 'Library Week runs from 10 to 14 July 2026, featuring a book fair, author interactions and a school-wide reading challenge. Students who complete the reading challenge will receive certificates and prizes. Visit the library during the week to explore new titles and participate.',
    category: 'Event', priority: 'Low', audience: 'Students',
    department: 'Library', classes: 'All Classes', branch: 'North Branch',
    status: 'Published',
    publisher: 'Library Department', publisherRole: 'Academics', avatar: 'assets/img/profiles/avatar-06.jpg',
    published: '02 Jul 2026', expiry: '14 Jul 2026',
    attachments: 2,
    files: [
      { name: 'Library-Week-Programme.pdf', meta: 'PDF · 96 KB · 02 Jul 2026', icon: 'ti ti-file-type-pdf' },
      { name: 'Reading-Challenge.jpg', meta: 'Image · 84 KB · 02 Jul 2026', icon: 'ti ti-photo' },
    ],
    reads: 430, readPct: 52, pinned: false,
    comments: [],
  },
  {
    id: 'NTC-208',
    title: 'Staff Development Workshop — Digital Tools',
    desc: 'A professional development workshop on digital classroom tools is scheduled for teaching staff this Saturday.',
    full: 'A professional development workshop on digital classroom tools and blended learning strategies will be held this Saturday from 10:00 AM to 1:00 PM in the seminar hall. All teaching staff are requested to attend. Please carry your laptops for the hands-on session.',
    category: 'General', priority: 'Low', audience: 'Teachers',
    department: 'HR', classes: '—', branch: 'Main Campus',
    status: 'Published',
    publisher: 'HR Department', publisherRole: 'Human Resources', avatar: 'assets/img/profiles/avatar-13.jpg',
    published: '01 Jul 2026', expiry: '12 Jul 2026',
    attachments: 1,
    files: [
      { name: 'Workshop-Agenda.pdf', meta: 'PDF · 58 KB · 01 Jul 2026', icon: 'ti ti-file-type-pdf' },
    ],
    reads: 186, readPct: 44, pinned: false,
    comments: [],
  },
  {
    id: 'NTC-209',
    title: 'Uniform & Grooming Guidelines Reminder',
    desc: 'A gentle reminder to adhere to the school uniform and grooming guidelines from the start of the term.',
    full: 'With the new term underway, students are reminded to adhere to the school uniform and grooming guidelines at all times. Proper uniform, footwear and identity cards are mandatory. Class teachers will conduct periodic checks. Your cooperation in maintaining discipline is appreciated.',
    category: 'Circular', priority: 'Low', audience: 'Students',
    department: 'Administration', classes: 'All Classes', branch: 'Main Campus',
    status: 'Published',
    publisher: 'Discipline Committee', publisherRole: 'Administration', avatar: 'assets/img/profiles/avatar-25.jpg',
    published: '30 Jun 2026', expiry: '30 Jul 2026',
    attachments: 0, files: [],
    reads: 388, readPct: 47, pinned: false,
    comments: [],
  },
];
