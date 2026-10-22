export interface RoutineSlot {
  id: string;
  /** Rendered as `Room No:104` inside the red badge. */
  room: string;
  /** Rendered as `Class : III, A`. */
  classSection: string;
  /** Rendered as `Subject : Spanish`. */
  subject: string;
  time: string;
  /**
   * The template's very first cell (Monday, 09:45) uses
   * `<span class="text-dark d-block py-2">` + a plain `<p class="text-dark">`,
   * while every other cell uses `<p class="… m-0">`. Kept so the port stays
   * byte-faithful rather than tidied.
   */
  spanMarkup?: boolean;
}

export interface RoutineDay {
  id: string;
  label: string;
  /** Monday ships an `h5.fs-15`; Tuesday–Saturday ship a bare `h6`. */
  headingLevel: 'h5' | 'h6';
  slots: RoutineSlot[];
}

export const routineWeek: RoutineDay[] = [
  {
    id: 'monday',
    label: 'Monday',
    headingLevel: 'h5',
    slots: [
      {
        id: 'mon-1',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
        spanMarkup: true,
      },
      {
        id: 'mon-2',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'mon-3',
        room: 'Room No:108',
        classSection: 'I, A',
        subject: 'Spanish',
        time: '03:15 - 04:00 AM',
      },
      {
        id: 'mon-4',
        room: 'Room No:107',
        classSection: 'V, A',
        subject: 'English',
        time: '11:30 - 12:15 AM',
      },
      {
        id: 'mon-5',
        room: 'Room No:108',
        classSection: 'IV, B',
        subject: 'Spanish',
        time: '02:15 - 03:00 AM',
      },
      {
        id: 'mon-6',
        room: 'Room No:106',
        classSection: 'IV, A',
        subject: 'English',
        time: '10:45 - 11:30 AM',
      },
      {
        id: 'mon-7',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
    ],
  },
  {
    id: 'tuesday',
    label: 'Tuesday',
    headingLevel: 'h6',
    slots: [
      {
        id: 'tue-1',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'tue-2',
        room: 'Room No:108',
        classSection: 'IV, B',
        subject: 'Spanish',
        time: '02:15 - 03:00 AM',
      },
      {
        id: 'tue-3',
        room: 'Room No:107',
        classSection: 'V, A',
        subject: 'English',
        time: '11:30 - 12:15 AM',
      },
      {
        id: 'tue-4',
        room: 'Room No:106',
        classSection: 'IV, A',
        subject: 'English',
        time: '10:45 - 11:30 AM',
      },
      {
        id: 'tue-5',
        room: 'Room No:108',
        classSection: 'I, A',
        subject: 'Spanish',
        time: '03:15 - 04:00 AM',
      },
      {
        id: 'tue-6',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'tue-7',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
    ],
  },
  {
    id: 'wednesday',
    label: 'Wednesday',
    headingLevel: 'h6',
    slots: [
      {
        id: 'wed-1',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Computer',
        time: '09:00 - 09:45 AM',
      },
      {
        id: 'wed-2',
        room: 'Room No:106',
        classSection: 'II, A',
        subject: 'Science',
        time: '09:45 - 10:30 AM',
      },
      {
        id: 'wed-3',
        room: 'Room No:106',
        classSection: 'III, B',
        subject: 'Maths',
        time: '10:45 - 11:30 AM',
      },
      {
        id: 'wed-4',
        room: 'Room No:108',
        classSection: 'IV, A',
        subject: 'Chemistry',
        time: '11:30 - 12:15 AM',
      },
      {
        id: 'wed-5',
        room: 'Room No:106',
        classSection: 'III, A',
        subject: 'Physics',
        time: '01:30 - 02:15 PM',
      },
      {
        id: 'wed-6',
        room: 'Room No:101',
        classSection: 'III, A',
        subject: 'Englishh',
        time: '02:15 - 03:00 AM',
      },
      {
        id: 'wed-7',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '03:15 - 04:00 AM',
      },
    ],
  },
  {
    id: 'thursday',
    label: 'Thursday',
    headingLevel: 'h6',
    slots: [
      {
        id: 'thu-1',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:00 - 09:45 AM',
      },
      {
        id: 'thu-2',
        room: 'Room No:106',
        classSection: 'III, A',
        subject: 'Physics',
        time: '09:45 - 10:30 AM',
      },
      {
        id: 'thu-3',
        room: 'Room No:108',
        classSection: 'II, B',
        subject: 'English',
        time: '10:45 - 11:30 AM',
      },
      {
        id: 'thu-4',
        room: 'Room No:106',
        classSection: 'IV, A',
        subject: 'Science',
        time: '11:30 - 12:15 AM',
      },
      {
        id: 'thu-5',
        room: 'Room No:104',
        classSection: 'I, A',
        subject: 'Spanish',
        time: '01:30 - 02:15 PM',
      },
      {
        id: 'thu-6',
        room: 'Room No:101',
        classSection: 'III, B',
        subject: 'Chemistry',
        time: '02:15 - 03:00 AM',
      },
      {
        id: 'thu-7',
        room: 'Room No:108',
        classSection: 'III, A',
        subject: 'Maths',
        time: '03:15 - 04:00 AM',
      },
    ],
  },
  {
    id: 'friday',
    label: 'Friday',
    headingLevel: 'h6',
    slots: [
      {
        id: 'fri-1',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'fri-2',
        room: 'Room No:106',
        classSection: 'IV, A',
        subject: 'English',
        time: '10:45 - 11:30 AM',
      },
      {
        id: 'fri-3',
        room: 'Room No:107',
        classSection: 'V, A',
        subject: 'English',
        time: '11:30 - 12:15 AM',
      },
      {
        id: 'fri-4',
        room: 'Room No:108',
        classSection: 'IV, B',
        subject: 'Spanish',
        time: '02:15 - 03:00 AM',
      },
      {
        id: 'fri-5',
        room: 'Room No:108',
        classSection: 'I, A',
        subject: 'Spanish',
        time: '03:15 - 04:00 AM',
      },
      {
        id: 'fri-6',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'fri-7',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
    ],
  },
  {
    id: 'saturday',
    label: 'Saturday',
    headingLevel: 'h6',
    slots: [
      {
        id: 'sat-1',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'sat-2',
        room: 'Room No:106',
        classSection: 'IV, A',
        subject: 'English',
        time: '10:45 - 11:30 AM',
      },
      {
        id: 'sat-3',
        room: 'Room No:107',
        classSection: 'V, A',
        subject: 'English',
        time: '11:30 - 12:15 AM',
      },
      {
        id: 'sat-4',
        room: 'Room No:108',
        classSection: 'IV, B',
        subject: 'Spanish',
        time: '02:15 - 03:00 AM',
      },
      {
        id: 'sat-5',
        room: 'Room No:108',
        classSection: 'I, A',
        subject: 'Spanish',
        time: '03:15 - 04:00 AM',
      },
      {
        id: 'sat-6',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
      {
        id: 'sat-7',
        room: 'Room No:104',
        classSection: 'III, A',
        subject: 'Spanish',
        time: '09:45 -10:30 AM',
      },
    ],
  },
];

/* --------------------------------- Breaks ---------------------------------- */

export interface RoutineBreak {
  id: string;
  label: string;
  time: string;
  /** The first column carries an extra `col-xl-4` in the template. */
  colClassName: string;
  badgeClassName: string;
  bodyClassName: string;
}

export const routineBreaks: RoutineBreak[] = [
  {
    id: 'morning',
    label: 'Morning Break',
    time: '10:30 to 10 :45 AM',
    colClassName: 'col-lg-4 col-xxl-4 col-xl-4 d-flex',
    badgeClassName: 'bg-primary',
    bodyClassName: 'bg-transparent-primary',
  },
  {
    id: 'lunch',
    label: 'Lunch',
    time: '10:30 to 10 :45 AM',
    colClassName: 'col-lg-4 col-xxl-4 d-flex',
    badgeClassName: 'bg-warning',
    bodyClassName: 'bg-transparent-warning',
  },
  {
    id: 'evening',
    label: 'Evening Break',
    time: '03:30 PM to 03:45 PM',
    colClassName: 'col-lg-4 col-xxl-4 d-flex',
    badgeClassName: 'bg-info',
    bodyClassName: 'bg-transparent-info',
  },
];

/* -------------------------------- Stat tiles ------------------------------- */

export interface RoutineStatCard {
  id: string;
  initials: [string, string, string];
  icon: string;
  variant: string;
  value: string;
  label: string;
  barWidth: string;
}

/** Every distinct room the week touches — 104, 108, 107, 106, 101. */
export const roomsUsed = (week: RoutineDay[]): number =>
  new Set(week.flatMap((day) => day.slots.map((slot) => slot.room))).size;

/**
 * The template's four tiles. Only "Rooms Used" is reproducible from the grid it
 * ships beside (5, exactly), so that one is counted; the other three figures
 * disagree with the grid the template itself renders (it draws 42 periods, 8
 * distinct subjects and 8 distinct classes against the stated 36 / 4 / 6), so
 * they stay as the template shipped them rather than being silently corrected.
 */
export const buildRoutineStats = (week: RoutineDay[]): RoutineStatCard[] => [
  {
    id: 'periods',
    initials: ['T', 'C', 'H'],
    icon: 'ti ti-calendar-event',
    variant: 'stats-primary',
    value: '36',
    label: 'Total Periods / Week',
    barWidth: '72%',
  },
  {
    id: 'subjects',
    initials: ['S', 'U', 'B'],
    icon: 'ti ti-book',
    variant: 'stats-success',
    value: '4',
    label: 'Subjects Taught',
    barWidth: '50%',
  },
  {
    id: 'classes',
    initials: ['C', 'L', 'S'],
    icon: 'ti ti-users',
    variant: 'stats-warning',
    value: '6',
    label: 'Classes Assigned',
    barWidth: '60%',
  },
  {
    id: 'rooms',
    initials: ['R', 'O', 'M'],
    icon: 'ti ti-door',
    variant: 'stats-info',
    value: String(roomsUsed(week)),
    label: 'Rooms Used',
    barWidth: '45%',
  },
];

/* ------------------------------- Period menu ------------------------------- */

export const routinePeriods = ['This Year', 'This Month', 'This Week'] as const;

export type RoutinePeriod = (typeof routinePeriods)[number];

/* ------------------------------- Apply Leave ------------------------------- */

export const leaveTypes = [
  'Select',
  'Medical Leave',
  'Casual Leave',
  'Special Leave',
  'Maternity Leave',
];

export const leaveDayOptions = ['Full day', 'First Half', 'Second Half'] as const;

export type LeaveDayOption = (typeof leaveDayOptions)[number];

/* ------------------------------ Login Details ------------------------------ */

export interface RoutineLoginCredential {
  userType: string;
  userName: string;
  password: string;
}

/**
 * `routine-teachers.html` reuses the student template's dialog verbatim — it
 * shows Janet and a student avatar even on a teacher's page. Kept as shipped.
 */
export const routineLoginProfile = {
  avatar: 'assets/img/students/student-01.jpg',
  name: 'Janet',
  classSection: 'III, A',
};

export const routineLoginCredentials: RoutineLoginCredential[] = [
  { userType: 'Parent', userName: 'parent53', password: 'parent@53' },
  { userType: 'Student', userName: 'student20', password: 'stdt@53' },
];
