/* ------------------------------------------------------------------ *
 * The month this page shows                                          *
 * ------------------------------------------------------------------ */

export const MONTH_LABEL = 'July 2026';
export const MONTH = 6; // July, zero-based
export const YEAR = 2026;

/** Faces the avatar row shows before it starts counting. */
export const AVATARS_SHOWN = 4;

export const PARTICIPANT_FACES = [
  'assets/img/profiles/avatar-01.jpg',
  'assets/img/profiles/avatar-02.jpg',
  'assets/img/profiles/avatar-03.jpg',
  'assets/img/profiles/avatar-05.jpg',
];

/* ------------------------------------------------------------------ *
 * What an event is                                                   *
 * ------------------------------------------------------------------ */

export type RegistrationState = 'Open' | 'Closing Soon' | 'Full' | 'Invite Only';

export interface SchoolEvent {
  id: string;
  title: string;
  /** The category drives the accent class and the banner badge. */
  category: string;
  categoryKey: string;
  icon: string;
  type: string;
  audience: string;
  organizer: string;
  venue: string;
  description: string;
  /** The day of the month the event falls on — the calendar reads this. */
  day: number;
  date: string;
  time: string;
  deadline: string;
  contact: string;
  registered: number;
  capacity: number;
  /** What the register says, before capacity is taken into account. */
  state: Exclude<RegistrationState, 'Full'>;
}

export const EVENTS: SchoolEvent[] = [
  {
    id: 'EVT-501',
    title: 'Robotics & AI Workshop',
    category: 'Workshop',
    categoryKey: 'workshop',
    icon: 'ti ti-tools',
    type: 'Workshop',
    audience: 'Students',
    organizer: 'STEM Club',
    venue: 'Innovation Lab',
    description:
      'A hands-on workshop introducing students to robotics kits and applied AI concepts through guided build-and-code challenges.',
    day: 10,
    date: '10 Jul 2026',
    time: '10:00 AM – 01:00 PM',
    deadline: '08 Jul 2026',
    contact: 'Mr. Alan Poe · +1 675 340 1120',
    registered: 64,
    capacity: 80,
    state: 'Closing Soon',
  },
  {
    id: 'EVT-502',
    title: 'Annual Sports Day 2026',
    category: 'Sports',
    categoryKey: 'sports',
    icon: 'ti ti-run',
    type: 'Sports',
    audience: 'All',
    organizer: 'Sports Department',
    venue: 'Main Ground',
    description:
      'The flagship athletics meet featuring track and field, relays and inter-house team events, with parents warmly invited to attend.',
    day: 12,
    date: '12 Jul 2026',
    time: '08:00 AM – 04:00 PM',
    deadline: '06 Jul 2026',
    contact: 'Mr. John Doe · +1 675 340 1188',
    registered: 420,
    capacity: 500,
    state: 'Open',
  },
  {
    id: 'EVT-503',
    title: 'Science Exhibition — Innovate',
    category: 'Academic',
    categoryKey: 'academic',
    icon: 'ti ti-school',
    type: 'Academic',
    audience: 'Students',
    organizer: 'Science Faculty',
    venue: 'Assembly Hall',
    description:
      'Students present working models and research projects across physics, biology and environmental science before a panel of judges.',
    day: 15,
    date: '15 Jul 2026',
    time: '09:30 AM – 02:00 PM',
    deadline: '11 Jul 2026',
    contact: 'Ms. Rita Owen · +1 675 340 1044',
    registered: 180,
    capacity: 200,
    state: 'Open',
  },
  {
    id: 'EVT-504',
    title: 'Cultural Fest — Rhythms',
    category: 'Cultural',
    categoryKey: 'cultural',
    icon: 'ti ti-masks-theater',
    type: 'Cultural',
    audience: 'All',
    organizer: 'Cultural Committee',
    venue: 'Auditorium',
    description:
      "An evening of music, dance and drama performances celebrating the school's diverse talent across all houses and grades.",
    day: 18,
    date: '18 Jul 2026',
    time: '05:00 PM – 09:00 PM',
    deadline: '12 Jul 2026',
    contact: 'Ms. Nina Patel · +1 675 340 1077',
    registered: 512,
    capacity: 600,
    state: 'Closing Soon',
  },
  {
    id: 'EVT-505',
    title: 'Parent–Teacher Meeting',
    category: 'Parent Meeting',
    categoryKey: 'meeting',
    icon: 'ti ti-users',
    type: 'Parent Meeting',
    audience: 'Parents',
    organizer: 'Academic Office',
    venue: 'Classrooms · Block B',
    description:
      'Scheduled one-on-one slots for parents of Grades 5–8 to discuss academic progress and well-being with subject teachers.',
    day: 19,
    date: '19 Jul 2026',
    time: '09:00 AM – 01:00 PM',
    deadline: '17 Jul 2026',
    contact: 'Ms. Carla Reed · +1 675 340 1201',
    registered: 240,
    capacity: 300,
    state: 'Open',
  },
  {
    id: 'EVT-506',
    title: 'Inter-School Quiz Championship',
    category: 'Competition',
    categoryKey: 'competition',
    icon: 'ti ti-trophy',
    type: 'Competition',
    audience: 'Students',
    organizer: 'Literary Society',
    venue: 'Seminar Hall',
    description:
      'Eight schools compete across science, history and current-affairs rounds in a fast-paced buzzer championship.',
    day: 22,
    date: '22 Jul 2026',
    time: '11:00 AM – 03:00 PM',
    deadline: '18 Jul 2026',
    contact: 'Mr. Alan Poe · +1 675 340 1120',
    registered: 48,
    capacity: 48,
    state: 'Open',
  },
  {
    id: 'EVT-507',
    title: 'Career Guidance Seminar',
    category: 'Seminar',
    categoryKey: 'seminar',
    icon: 'ti ti-presentation',
    type: 'Seminar',
    audience: 'Students',
    organizer: 'Counselling Cell',
    venue: 'Auditorium',
    description:
      'Industry mentors and alumni share pathways into engineering, medicine, design and entrepreneurship, followed by an open Q&A.',
    day: 25,
    date: '25 Jul 2026',
    time: '10:00 AM – 12:30 PM',
    deadline: '23 Jul 2026',
    contact: 'Ms. Carla Reed · +1 675 340 1201',
    registered: 150,
    capacity: 250,
    state: 'Open',
  },
  {
    id: 'EVT-508',
    title: 'Independence Day Celebration',
    category: 'School Event',
    categoryKey: 'school',
    icon: 'ti ti-confetti',
    type: 'School Event',
    audience: 'All',
    organizer: "Principal's Office",
    venue: 'Main Ground',
    description:
      'Flag hoisting, cultural tributes and a march-past honouring the nation, followed by prize distribution for the term.',
    day: 28,
    date: '28 Jul 2026',
    time: '08:00 AM – 10:30 AM',
    deadline: '26 Jul 2026',
    contact: 'Front Office · +1 675 340 1000',
    registered: 600,
    capacity: 700,
    state: 'Invite Only',
  },
];

/* ------------------------------------------------------------------ *
 * What an event knows about itself                                   *
 * ------------------------------------------------------------------ */

/** A full event is full whatever the register last called it. */
export const registrationOf = (event: SchoolEvent): RegistrationState =>
  event.registered >= event.capacity ? 'Full' : event.state;

export const registrationTint = (state: RegistrationState) =>
  ({ Open: 'success', 'Closing Soon': 'warning', Full: 'danger', 'Invite Only': 'info' })[state];

/** "64/80" — the two numbers, never written out separately. */
export const capacityLabelOf = (event: SchoolEvent) =>
  `${event.registered}/${event.capacity}`;

/** The registrations the avatar row stands in for. */
export const moreParticipantsOf = (event: SchoolEvent) =>
  Math.max(0, event.registered - AVATARS_SHOWN);

export const participantsLabelOf = (event: SchoolEvent) => `${event.registered} participants`;

/** The banner's stacked date: the day over the month. */
export const bannerDateOf = (event: SchoolEvent) => ({
  day: String(event.day).padStart(2, '0'),
  month: event.date.split(' ')[1],
});

export const searchIndexOf = (event: SchoolEvent) =>
  [
    event.id,
    event.title,
    event.category,
    event.venue,
    event.organizer,
    event.audience,
    registrationOf(event),
  ]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The month grid                                                     *
 * ------------------------------------------------------------------ */

export interface CalendarCell {
  /** The number printed in the cell. */
  day: number;
  /** Days from the months either side, which the template greys out. */
  outside: boolean;
  events: SchoolEvent[];
}

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

/**
 * The month as the template lays it out: a Sunday-first grid padded with the
 * tail of the previous month and the head of the next, so every row is seven
 * cells. The template writes all 42 out by hand; here the month builds itself.
 */
export const buildMonth = (events: SchoolEvent[]): CalendarCell[] => {
  const firstWeekday = new Date(YEAR, MONTH, 1).getDay();
  const thisMonth = daysInMonth(YEAR, MONTH);
  const lastMonth = daysInMonth(YEAR, MONTH - 1);

  const cells: CalendarCell[] = [];

  for (let i = firstWeekday - 1; i >= 0; i -= 1) {
    cells.push({ day: lastMonth - i, outside: true, events: [] });
  }
  for (let day = 1; day <= thisMonth; day += 1) {
    cells.push({ day, outside: false, events: events.filter((event) => event.day === day) });
  }
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 42) {
    cells.push({ day: next, outside: true, events: [] });
    next += 1;
    if (cells.length >= 42) break;
  }
  return cells;
};

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ------------------------------------------------------------------ *
 * The filter options                                                 *
 * ------------------------------------------------------------------ */

const distinct = (values: string[]) => [...new Set(values)];

export const categoryOptions = [
  'School Event',
  'Academic',
  'Sports',
  'Cultural',
  'Competition',
  'Parent Meeting',
  'Workshop',
  'Seminar',
  'Holiday Event',
];

export const typeOptions = ['Academic', 'Sports', 'Cultural', 'Competition', 'Workshop', 'Seminar'];
export const audienceOptions = ['Students', 'Teachers', 'Parents', 'Staff', 'All'];
export const organizerOptions = distinct(EVENTS.map((event) => event.organizer));
export const venueOptions = distinct(EVENTS.map((event) => event.venue));
export const branchOptions = ['Main Campus', 'North Branch'];
export const academicYearOptions = ['2025 / 2026', '2024 / 2025'];
export const monthOptions = ['July 2026', 'August 2026'];

/** The quick rail, which filters by category. */
export const QUICK_CATEGORIES = [
  { id: 'sports', label: 'Sports', icon: 'ti ti-run' },
  { id: 'academic', label: 'Academic', icon: 'ti ti-school' },
  { id: 'cultural', label: 'Cultural', icon: 'ti ti-masks-theater' },
  { id: 'competition', label: 'Competition', icon: 'ti ti-trophy' },
  { id: 'workshop', label: 'Workshop', icon: 'ti ti-tools' },
  { id: 'seminar', label: 'Seminar', icon: 'ti ti-presentation' },
];

export const countByCategory = (events: SchoolEvent[], key: string) =>
  events.filter((event) => event.categoryKey === key).length;

/* ------------------------------------------------------------------ *
 * The dialogs                                                        *
 * ------------------------------------------------------------------ */

/** The row of actions every event card and dropdown offers. */
export const EVENT_ACTIONS = [
  { id: 'duplicate', label: 'Duplicate Event', icon: 'ti ti-copy' },
  { id: 'participants', label: 'View Participants', icon: 'ti ti-users' },
  { id: 'attendees', label: 'Download Attendee List', icon: 'ti ti-download' },
  { id: 'agenda', label: 'Agenda Preview', icon: 'ti ti-list-details' },
  { id: 'print', label: 'Print Event', icon: 'ti ti-printer' },
  { id: 'share', label: 'Share Event', icon: 'ti ti-share' },
  { id: 'remind', label: 'Send Reminder', icon: 'ti ti-bell' },
  { id: 'archive', label: 'Archive', icon: 'ti ti-archive' },
  { id: 'delete', label: 'Delete', icon: 'ti ti-trash' },
];

export interface Participant {
  name: string;
  photo: string;
  className: string;
  state: string;
}

export const PARTICIPANTS: Participant[] = [
  {
    name: 'Janet Daniel',
    photo: 'assets/img/profiles/avatar-01.jpg',
    className: 'III-A',
    state: 'Confirmed',
  },
  {
    name: 'George Kettut',
    photo: 'assets/img/profiles/avatar-02.jpg',
    className: 'II-A',
    state: 'Confirmed',
  },
  {
    name: 'Sophia Reyes',
    photo: 'assets/img/profiles/avatar-03.jpg',
    className: 'III-A',
    state: 'Waitlisted',
  },
  {
    name: 'Liam Walker',
    photo: 'assets/img/profiles/avatar-05.jpg',
    className: 'IV-B',
    state: 'Confirmed',
  },
];

export interface AgendaSlot {
  time: string;
  title: string;
  detail: string;
}

export const AGENDA: AgendaSlot[] = [
  { time: '10:00 AM', title: 'Welcome and kit handout', detail: 'Innovation Lab · all teams' },
  { time: '10:30 AM', title: 'Build challenge', detail: 'Guided assembly in pairs' },
  { time: '12:00 PM', title: 'Code and test', detail: 'Applied AI concepts' },
  { time: '12:45 PM', title: 'Showcase and close', detail: 'Teams demonstrate their builds' },
];

export interface Attachment {
  name: string;
  meta: string;
  icon: string;
}

export const ATTACHMENTS: Attachment[] = [
  { name: 'Event Brief.pdf', meta: 'PDF · 240 KB', icon: 'ti ti-file-type-pdf' },
  { name: 'Consent Form.docx', meta: 'DOCX · 88 KB', icon: 'ti ti-file-type-doc' },
  { name: 'Venue Layout.png', meta: 'PNG · 1.1 MB', icon: 'ti ti-photo' },
];

/**
 * The Event Progress rail the detail panel ends with.
 *
 * The template writes six fixed steps with `is-done`, `is-current` and
 * `is-muted` typed in. Here the state follows from where the event has got to,
 * so a completed event reads all six done rather than three.
 */
export interface ProgressStep {
  id: string;
  icon: string;
  title: string;
  /** What the step says when it has happened. */
  meta: string;
  /** What it says before it has. */
  pending: string;
}

export const PROGRESS: ProgressStep[] = [
  { id: 'planning', icon: 'ti ti-clipboard-list', title: 'Planning Started', meta: '20 Jun 2026', pending: 'Not started' },
  { id: 'registration', icon: 'ti ti-lock-open', title: 'Registration Opened', meta: '28 Jun 2026', pending: 'Not opened' },
  { id: 'reminder', icon: 'ti ti-bell-ringing', title: 'Reminder Sent', meta: 'Today', pending: 'Not sent' },
  { id: 'started', icon: 'ti ti-player-play', title: 'Event Started', meta: 'Under way', pending: 'Scheduled' },
  { id: 'completed', icon: 'ti ti-checks', title: 'Event Completed', meta: 'Closed', pending: 'Pending' },
  { id: 'certificates', icon: 'ti ti-certificate', title: 'Certificates Issued', meta: 'Issued', pending: 'Pending' },
];

/** How far along an event is: the index of the step it is currently at. */
export const REACHED = 2;

export const progressToneOf = (index: number) => {
  if (index < REACHED) return 'is-done';
  if (index === REACHED) return 'is-current';
  return 'is-muted';
};
