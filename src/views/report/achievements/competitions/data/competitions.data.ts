import { addDays, daysBetween } from '../../../ai-insights/data/dates';
import { RUN_DATE } from '../../../ai-insights/data/registers';

export { RUN_DATE };

/** The year the register is filtered to. */
export const ACADEMIC_YEAR = '2026-2027';

/** Competitions on the register school-wide, of which this page shows a page. */
export const TOTAL_COMPETITIONS = 34;

/**
 * The rest of the summary strip.
 *
 * These count the whole calendar of 34 events, and the grid carries eight of
 * them, so they cannot come off `competitions`. What the strip prints *about*
 * them still derives — the completed share is read against the total rather
 * than typed a second time.
 */
export const UPCOMING_EVENTS = 7;
export const ONGOING_EVENTS = 2;
export const COMPLETED_EVENTS = 21;
export const TOTAL_PARTICIPANTS = 1486;

export type Category = 'Science' | 'Sports' | 'Cultural' | 'Literary' | 'Technology' | 'Academic';
export type EventType = 'Individual' | 'Team' | 'Inter-House' | 'Inter-School' | 'Online';
export type Status =
  | 'Draft'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Ongoing'
  | 'Results Awaited'
  | 'Completed'
  | 'Cancelled';

export interface Placement {
  place: string;
  student: string;
  className: string;
  score: number;
  outOf: number;
}

export interface Competition {
  id: string;
  name: string;
  note?: string;
  category: Category;
  eventType: EventType;
  /** The first and last day it runs. */
  startsOn: string;
  endsOn: string;
  /** The hours it runs, when it is a single-day event. */
  window?: string;
  venue: string;
  venueNote: string;
  /** Places available, and entrants registered. */
  places: number | null;
  entrants: number | null;
  /** Groups that entered. */
  groups: number;
  coordinator: string;
  coordinatorRole: string;
  /** The day registration closes, when one is set. */
  registrationClosesOn?: string;
  /** Results, once they exist. */
  placements: Placement[];
  /** The two states no date can imply. */
  state?: 'Draft' | 'Cancelled';
  stateNote?: string;
  /** Set when results are recorded but not yet published. */
  resultsHeld?: boolean;
}

const seeded: Competition[] = [
  {
    id: 'COMP-2026-0071',
    name: 'Annual Science Exhibition 2026',
    category: 'Science',
    eventType: 'Inter-House',
    startsOn: '16 Jul 2026',
    endsOn: '17 Jul 2026',
    venue: 'Science Block, Laboratories 1 to 3',
    venueNote: 'Seats 180 · four exhibit halls',
    places: 120,
    entrants: 94,
    groups: 4,
    coordinator: 'Mr. Vikram Sethi',
    coordinatorRole: 'Science Teacher · Physics and Chemistry',
    registrationClosesOn: '10 Jul 2026',
    placements: [
      { place: 'Winner', student: 'Ananya Rao', className: 'X B', score: 94, outOf: 100 },
      { place: 'Runner-Up', student: 'Rohan Desai', className: 'IX C', score: 89, outOf: 100 },
      { place: 'Third Place', student: 'Nikhil Menon', className: 'XI A', score: 86, outOf: 100 },
    ],
  },
  {
    id: 'COMP-2026-0074',
    name: 'Inter-House Chess Tournament 2026',
    category: 'Sports',
    eventType: 'Inter-House',
    startsOn: '30 Jul 2026',
    endsOn: '30 Jul 2026',
    window: '08:30 – 16:30',
    venue: 'Activity Hall, Boards 1 to 16',
    venueNote: 'Sixteen boards · two rounds',
    places: 64,
    entrants: 52,
    groups: 4,
    coordinator: 'Mr. Arjun Kale',
    coordinatorRole: 'Games Department · Indoor sports',
    registrationClosesOn: '24 Jul 2026',
    placements: [
      { place: 'Winner', student: 'Kabir Sethi', className: 'VIII A', score: 9, outOf: 9 },
      { place: 'Runner-Up', student: 'Iris Kapoor', className: 'VIII C', score: 8, outOf: 9 },
    ],
    resultsHeld: true,
  },
  {
    id: 'COMP-2026-0078',
    name: 'Junior Reading Challenge, Term 2',
    category: 'Literary',
    eventType: 'Individual',
    startsOn: '01 Jun 2026',
    endsOn: '29 Jul 2026',
    venue: 'School Library, reading corner',
    venueNote: 'Rolling entry · logged by the librarian',
    places: 160,
    entrants: 122,
    groups: 4,
    coordinator: 'Ms. Fatima Sheikh',
    coordinatorRole: 'Librarian · Reading programmes',
    registrationClosesOn: '10 Jun 2026',
    placements: [
      { place: 'Winner', student: 'Sophia Reyes', className: 'VIII A', score: 41, outOf: 45 },
      { place: 'Runner-Up', student: 'Liam Walker', className: 'IV B', score: 38, outOf: 45 },
      { place: 'Third Place', student: 'Maria Fernandes', className: 'IX C', score: 36, outOf: 45 },
    ],
  },
  {
    id: 'COMP-2026-0084',
    name: 'Inter-School Quiz Championship',
    category: 'Academic',
    eventType: 'Inter-School',
    startsOn: '31 Jul 2026',
    endsOn: '01 Aug 2026',
    window: '09:00 – 17:00',
    venue: 'Main Auditorium, Stage and Green Room',
    venueNote: 'Six visiting schools · seats 300',
    places: 48,
    entrants: 42,
    groups: 3,
    coordinator: 'Mr. Ethan Brooks',
    coordinatorRole: 'Class Teacher · Quiz club',
    registrationClosesOn: '25 Jul 2026',
    placements: [],
  },
  {
    id: 'COMP-2026-0081',
    name: 'Annual Sports Meet 2026',
    category: 'Sports',
    eventType: 'Inter-House',
    startsOn: '03 Aug 2026',
    endsOn: '05 Aug 2026',
    venue: 'Municipal Athletics Stadium, Track and Field',
    venueNote: 'Eight lanes · seats 1,200',
    places: 400,
    entrants: 354,
    groups: 4,
    coordinator: 'Ms. Deepa Rawat',
    coordinatorRole: 'Physical Education · Athletics',
    registrationClosesOn: '29 Jul 2026',
    placements: [],
  },
  {
    id: 'COMP-2026-0087',
    name: 'Junior Art Contest, school round',
    category: 'Cultural',
    eventType: 'Individual',
    startsOn: '12 Aug 2026',
    endsOn: '14 Aug 2026',
    venue: 'Art Room and Exhibition Corridor',
    venueNote: 'Three sessions · materials provided',
    places: 90,
    entrants: 44,
    groups: 3,
    coordinator: 'Mrs. Kalpana Menon',
    coordinatorRole: 'Cultural Coordinator · Visual arts',
    registrationClosesOn: '08 Aug 2026',
    placements: [],
  },
  {
    id: 'COMP-2026-0090',
    name: 'Robotics Challenge 2026',
    category: 'Technology',
    eventType: 'Team',
    startsOn: '24 Sep 2026',
    endsOn: '25 Sep 2026',
    venue: 'Computer Laboratory 2 and Innovation Room',
    venueNote: 'Twelve benches · kits on loan',
    places: null,
    entrants: null,
    groups: 0,
    coordinator: 'Mr. Vikram Sethi',
    coordinatorRole: 'Science Teacher · Physics and Chemistry',
    placements: [],
    state: 'Draft',
    stateNote: 'Awaiting budget approval',
  },
  {
    id: 'COMP-2026-0068',
    name: 'District Spell Bee, school selection',
    category: 'Literary',
    eventType: 'Individual',
    startsOn: '12 Jul 2026',
    endsOn: '12 Jul 2026',
    window: '10:00 – 13:00',
    venue: 'Room A-104, Main Block',
    venueNote: 'Seats 40 · single round',
    places: 40,
    entrants: 12,
    groups: 2,
    coordinator: 'Mrs. Ellen Cruz',
    coordinatorRole: 'Class Teacher · English',
    registrationClosesOn: '08 Jul 2026',
    placements: [],
    state: 'Cancelled',
    stateNote: 'Called off 10 Jul',
  },
];

export const competitions: Competition[] = seeded;

/* ------------------------------------------------------------------ *
 * What a competition knows about itself                              *
 * ------------------------------------------------------------------ */

/** Days the event runs, counting both ends. */
export const durationOf = (row: Competition) => daysBetween(row.startsOn, row.endsOn) + 1;

/** The date line the grid prints. */
export const dateLabelOf = (row: Competition) => {
  const [startDay, startMonth] = row.startsOn.split(' ');
  if (row.startsOn === row.endsOn) return `${Number(startDay)} ${startMonth} ${row.endsOn.split(' ')[2]}`;
  return `${Number(startDay)} ${startMonth} – ${Number(row.endsOn.split(' ')[0])} ${row.endsOn.split(' ').slice(1).join(' ')}`;
};

/** How long it runs, said the way the grid says it. */
export const durationLabelOf = (row: Competition) => {
  const days = durationOf(row);
  if (days === 1) return row.window ?? 'Single day';
  return `${days} day event`;
};

/** Where the event sits against today. */
export const relativeLabelOf = (row: Competition) => {
  const sinceEnd = daysBetween(row.endsOn, RUN_DATE);
  if (sinceEnd > 0) return `${sinceEnd} days ago`;
  const untilStart = daysBetween(RUN_DATE, row.startsOn);
  if (untilStart > 0) return `in ${untilStart} days`;
  return 'today';
};

/** Entrants against places, as a percentage. */
export const capacityPctOf = (row: Competition) =>
  row.places && row.entrants !== null ? Math.round((row.entrants / row.places) * 100) : null;

/** The participants line. */
export const participantsLabelOf = (row: Competition) =>
  row.entrants === null || row.places === null ? '—' : `${row.entrants} of ${row.places}`;

/**
 * The status, read off the dates.
 *
 * Draft and Cancelled are stored, because no date implies them. Everything else
 * follows from where today sits against the registration window and the event.
 */
export const statusOf = (row: Competition): Status => {
  if (row.state) return row.state;
  const started = daysBetween(row.startsOn, RUN_DATE) >= 0;
  const finished = daysBetween(row.endsOn, RUN_DATE) > 0;
  if (finished) return row.placements.length > 0 && !row.resultsHeld ? 'Completed' : 'Results Awaited';
  if (started) return 'Ongoing';
  if (row.resultsHeld) return 'Results Awaited';
  if (row.registrationClosesOn && daysBetween(row.registrationClosesOn, RUN_DATE) > 0) {
    return 'Registration Closed';
  }
  return 'Registration Open';
};

/** The pill class a status carries. */
export const statusPill = (status: Status) =>
  ({
    Draft: 'is-inactive',
    'Registration Open': 'is-active',
    'Registration Closed': 'is-pending',
    Ongoing: 'is-new',
    'Results Awaited': 'is-review',
    Completed: 'is-completed',
    Cancelled: 'is-blocked',
  })[status];

/** The line beneath the status pill, which differs by state. */
export const statusNoteOf = (row: Competition) => {
  const status = statusOf(row);
  if (row.stateNote) return row.stateNote;
  if (status === 'Completed') return `${row.placements.length} placed of ${row.entrants}`;
  if (status === 'Results Awaited') return 'Scores with the coordinator';
  if (status === 'Ongoing') return 'Running at the venue now';
  if (status === 'Registration Closed') return `Entries closed ${row.registrationClosesOn}`;
  if (status === 'Registration Open' && row.registrationClosesOn) {
    return `Closes ${row.registrationClosesOn.split(' ').slice(0, 2).join(' ')}`;
  }
  return '';
};

/** Whether the event is still to come. */
export const isUpcomingOf = (row: Competition) =>
  !row.state && daysBetween(RUN_DATE, row.startsOn) > 0;

/** The icon and tint each category carries. */
export const CATEGORY_META: Record<Category, { icon: string; tint: string }> = {
  Science: { icon: 'ti ti-flask', tint: 'info' },
  Sports: { icon: 'ti ti-ball-football', tint: 'success' },
  Cultural: { icon: 'ti ti-palette', tint: 'purple' },
  Literary: { icon: 'ti ti-book', tint: 'warning' },
  Technology: { icon: 'ti ti-cpu', tint: 'primary' },
  Academic: { icon: 'ti ti-school', tint: 'teal' },
};

/** Everything the search box should reach. */
export const searchIndexOf = (row: Competition) =>
  [row.id, row.name, row.category, row.eventType, row.venue, row.coordinator, statusOf(row)]
    .join(' ')
    .toLowerCase();

/* ------------------------------------------------------------------ *
 * The filter options, read off the register                          *
 * ------------------------------------------------------------------ */

const distinct = (values: string[]) => [...new Set(values)].sort();

export const categoryOptions = distinct(competitions.map((row) => row.category));
export const eventTypeOptions = distinct(competitions.map((row) => row.eventType));
export const venueOptions = distinct(competitions.map((row) => row.venue.split(',')[0]));
export const coordinatorOptions = distinct(competitions.map((row) => row.coordinator));
export const statusOptions: Status[] = [
  'Draft',
  'Registration Open',
  'Registration Closed',
  'Ongoing',
  'Results Awaited',
  'Completed',
  'Cancelled',
];
export const academicYearOptions = ['2026-2027', '2025-2026', '2024-2025'];

/** How many of the register carry each status. */
export const countByStatus = (rows: Competition[], status: Status) =>
  rows.filter((row) => statusOf(row) === status).length;

/** Entrants across the register, and the places they were drawn from. */
export const totalEntrants = (rows: Competition[]) =>
  rows.reduce((total, row) => total + (row.entrants ?? 0), 0);
export const totalPlaces = (rows: Competition[]) =>
  rows.reduce((total, row) => total + (row.places ?? 0), 0);

/** Students who placed, across everything with results. */
export const totalPlaced = (rows: Competition[]) =>
  rows.reduce((total, row) => total + row.placements.length, 0);

/** The dates the dialogs propose. */
export const NEXT_EVENT_ON = addDays(RUN_DATE, 2);
export const REGISTRATION_CLOSES = addDays(RUN_DATE, 7);
