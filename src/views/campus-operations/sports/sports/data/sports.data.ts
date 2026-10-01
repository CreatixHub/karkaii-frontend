export type SportStatus =
  | 'Active' | 'Upcoming' | 'In Progress' | 'Completed' | 'Inactive' | 'Archived';

export interface Sport {
  id: string;
  /** The template's `dt-code`, e.g. "SP-01". */
  code: string;
  name: string;
  /** Tabler icon in the row avatar, e.g. "ti ti-ball-football". */
  icon: string;
  /** Bootstrap tint stem shared by the avatar and the category badge. */
  tint: string;
  category: 'Team Sport' | 'Individual' | 'Racquet' | 'Indoor';
  gender: 'Boys' | 'Girls' | 'Mixed';
  team: string;
  coach: string;
  coachAvatar: string;
  assistant: string;
  /** "Mon, Wed, Fri · 04:00 PM" — days and start time in one string. */
  schedule: string;
  venue: string;
  students: number;
  events: number;
  achievements: number;
  competition: string;
  academicYear: string;
  /** The template's "Last activity 2h ago"; drives the recency sort. */
  lastActivity: string;
  status: SportStatus;
  /** Classes the squad draws from — see the note at the top of this file. */
  classes: string[];
  sections: string[];
}

export const statusPill: Record<SportStatus, string> = {
  Active: 'is-active',
  Upcoming: 'is-new',
  'In Progress': 'is-pending',
  Completed: 'is-exam',
  Inactive: 'is-inactive',
  Archived: 'is-archived',
};

/**
 * Active and Inactive draw the plain dot; the other four lead their pill with
 * an icon. Null means "render the dot".
 */
export const statusIcon: Record<SportStatus, string | null> = {
  Active: null,
  Upcoming: 'ti ti-calendar-event',
  'In Progress': 'ti ti-progress',
  Completed: 'ti ti-trophy',
  Inactive: null,
  Archived: 'ti ti-archive',
};

/* ------------------------------ Filter options ------------------------------ */

export const categoryOptions: Sport['category'][] = ['Team Sport', 'Individual', 'Racquet', 'Indoor'];

export const teamOptions = [
  'Senior XI', 'Hoopsters', 'Strikers XI', 'Track Squad', 'Aqua Team',
  'Shuttlers', 'Paddlers', 'Spikers', 'Grandmasters', 'Raiders',
];

export const coachOptions = [
  'Aariv Kumar', 'Marcus Lee', 'Ramsey Fox', 'Teresa Vale', 'Hendrita Ray',
  'Erickson Poe', 'Mori Sato', 'Joseph Ray', 'James Kirk', 'Morgan Hale',
];

export const classOptions = ['Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X'];

export const sectionOptions = ['A', 'B', 'C'];

export const genderOptions: Sport['gender'][] = ['Boys', 'Girls', 'Mixed'];

export const competitionOptions = [
  'Inter-School League', 'District Championship', 'State Cup',
  'Annual Sports Meet', 'Regional Meet', 'Inter-House Tournament',
];

export const statusOptions: SportStatus[] = [
  'Active', 'Upcoming', 'In Progress', 'Completed', 'Inactive', 'Archived',
];

export const academicYearOptions = ['2024/2025', '2023/2024'];

/** The Practice Schedule dialog's venue list, in the template's order. */
export const venueOptions = [
  'Main Ground', 'Indoor Court', 'Cricket Ground', 'Athletics Track', 'Swimming Pool',
  'Indoor Court 2', 'Recreation Hall', 'Volleyball Court', 'Library Annexe', 'Ground B',
];

/** The four admissions the Assign Students dialog offers. */
export const studentOptions = [
  'Janet Daniel — AD202401',
  'Joann Michael — AD202402',
  'Andrew Fischer — AD202409',
  'Ralph Claudia — AD202406',
];

export const importModes = ['Create new sports', 'Update existing by code', 'Create and update'];

/** The Practice Days row: Mon, Wed and Fri on in the template. */
export const practiceDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ------------------------------- Derivations -------------------------------- */

export const descriptionOf = (row: Sport): string =>
  `${row.name} — a ${row.category.toLowerCase()} for ${row.gender.toLowerCase()}, competing in the `
  + `${row.competition} (${row.academicYear}).`;

export const trainingOf = (row: Sport): string => `${row.schedule} at ${row.venue}.`;

export const competitionsInfoOf = (row: Sport): string =>
  row.events === 0
    ? 'No upcoming events scheduled.'
    : `${row.events} event(s) scheduled · next: ${row.competition}.`;

export const equipmentOf = (row: Sport): string =>
  `Standard ${row.category.toLowerCase()} kit · ${row.venue} equipment maintained by the sports department.`;

/** The Notes paragraph is a function of the status alone in all ten rows. */
export const notesOf = (row: Sport): string => {
  switch (row.status) {
    case 'Upcoming':
      return 'Upcoming — trials and selection in progress.';
    case 'In Progress':
      return 'In progress — matches underway this term.';
    case 'Completed':
      return 'Season completed — results published.';
    case 'Inactive':
      return 'Inactive — no active roster this term.';
    case 'Archived':
      return 'Archived — season concluded, retained for records.';
    case 'Active':
    default:
      return 'Active roster training regularly.';
  }
};

/** The View Sport dialog's sub-line. */
export const summaryOf = (row: Sport): string =>
  `${row.code} · ${row.category} · ${row.gender} · ${row.competition} · ${row.academicYear}`;

export const coachingOf = (row: Sport): string =>
  `${row.coach} (Head) · ${row.assistant} (Assistant).`;

export const trainingLineOf = (row: Sport): string => `${row.schedule} · ${row.venue}.`;

export const participationOf = (row: Sport): string =>
  `${row.students} students · ${row.events} upcoming events · ${row.achievements} achievements.`;

/** "Football — Senior XI", the Assign Students dialog's own label. */
export const teamLabelOf = (row: Sport): string => `${row.name} — ${row.team}`;

/** The read-only Sport field the assignment dialogs open with. */
export const sportFieldOf = (row: Sport): string => `${row.name} — ${row.code}`;

/* ------------------------------ Schedule parts ------------------------------ */

/**
 * The days half of `schedule`, expanded to the checkbox list the Practice
 * Schedule dialog renders. "Daily" and "Mon–Sat" both mean the full week.
 */
export const daysOf = (row: Sport): string[] => {
  const [days] = row.schedule.split('·');
  const text = days.trim();
  if (/daily/i.test(text) || /mon\s*[–-]\s*sat/i.test(text)) return [...practiceDays];
  return practiceDays.filter((day) => text.includes(day));
};

/** The time half of `schedule`, e.g. "04:00 PM". */
export const startTimeOf = (row: Sport): string => {
  const parts = row.schedule.split('·');
  return parts.length > 1 ? parts[1].trim() : '';
};

/** "04:00 PM" plus n minutes, in the template's 12-hour format. */
export const addMinutes = (time: string, minutes: number): string => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return time;
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === 'PM') hour += 12;
  const total = (hour * 60 + Number(match[2]) + minutes) % (24 * 60);
  const h24 = Math.floor(total / 60);
  const suffix = h24 < 12 ? 'AM' : 'PM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${String(h12).padStart(2, '0')}:${String(total % 60).padStart(2, '0')} ${suffix}`;
};

/** The template's session runs 90 minutes — 04:00 PM to 05:30 PM. */
export const endTimeOf = (row: Sport): string => addMinutes(startTimeOf(row), 90);

/** Rebuilds `schedule` after the Practice Schedule dialog saves. */
export const scheduleOf = (days: string[], startTime: string): string => {
  const ordered = practiceDays.filter((day) => days.includes(day));
  const label = ordered.length === practiceDays.length ? 'Mon–Sat' : ordered.join(', ');
  return `${label || 'Unscheduled'} · ${startTime}`;
};

/* ---------------------------- Generated calendars ---------------------------- */

export interface CompetitionEntry {
  competition: string;
  date: string;
  venue: string;
  stage: 'Scheduled' | 'Registration' | 'Upcoming';
}

const competitionDates = ['18 May 2024', '02 Jun 2024', '20 Jun 2024', '06 Jul 2024', '19 Jul 2024'];
const competitionVenues = ['City Stadium', 'Regional Arena', 'District Grounds', 'Central Complex'];
const stages: CompetitionEntry['stage'][] = ['Scheduled', 'Registration', 'Upcoming'];

/**
 * The template's calendar is three fixed rows shown for every sport, including
 * the archived one the grid credits with no events. Generated from the row
 * instead: the first entry is the sport's own competition at its own venue, and
 * the list is exactly as long as the `events` count.
 */
export const competitionsOf = (row: Sport): CompetitionEntry[] =>
  Array.from({ length: row.events }, (_, index) => ({
    competition:
      index === 0
        ? row.competition
        : competitionOptions[(competitionOptions.indexOf(row.competition) + index) % competitionOptions.length],
    date: competitionDates[index % competitionDates.length],
    venue: index === 0 ? row.venue : competitionVenues[(index - 1) % competitionVenues.length],
    stage: stages[index % stages.length],
  }));

export interface AchievementEntry {
  title: string;
  competition: string;
  year: string;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Trophy';
  icon: string;
  tint: string;
}

const achievementTitles = ['Champions', 'Runners-up', 'Best Team', 'Third Place', 'Fair Play Award', 'Best Squad'];
const medals: { medal: AchievementEntry['medal']; icon: string; tint: string }[] = [
  { medal: 'Gold', icon: 'ti ti-trophy', tint: 'warning' },
  { medal: 'Silver', icon: 'ti ti-medal', tint: 'secondary' },
  { medal: 'Trophy', icon: 'ti ti-award', tint: 'warning' },
  { medal: 'Bronze', icon: 'ti ti-medal-2', tint: 'info' },
];

/** Same rule as the calendar: as many rows as the grid's achievement count. */
export const achievementsOf = (row: Sport): AchievementEntry[] =>
  Array.from({ length: row.achievements }, (_, index) => ({
    title: achievementTitles[index % achievementTitles.length],
    competition:
      index === 0
        ? row.competition
        : competitionOptions[(competitionOptions.indexOf(row.competition) + index) % competitionOptions.length],
    year: String(2023 - Math.floor(index / 3)),
    ...medals[index % medals.length],
  }));

/** The two badges the View Sport dialog prints, or none when there are no wins. */
export const achievementBadgesOf = (row: Sport): string[] =>
  achievementsOf(row)
    .slice(0, 2)
    .map((entry) => `${entry.competition} ${entry.year}`);

/* --------------------------------- Sorting ---------------------------------- */

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: Sport): string =>
  [
    row.name, row.code, row.category, row.team, row.coach, row.assistant,
    row.venue, row.gender, row.competition, row.status, row.academicYear,
  ]
    .join(' ')
    .toLowerCase();

/**
 * "2h ago" / "1d ago" / "1w ago" as elapsed minutes, so the template's
 * "Recently updated" sort orders the ten rows the way it reads them.
 */
export const activityKey = (value: string): number => {
  const match = /^(\d+)\s*([hdw])/i.exec(value.trim());
  if (!match) return Number.MAX_SAFE_INTEGER;
  const amount = Number(match[1]);
  switch (match[2].toLowerCase()) {
    case 'h': return amount * 60;
    case 'd': return amount * 60 * 24;
    default: return amount * 60 * 24 * 7;
  }
};

/* ---------------------------------- Rows ------------------------------------ */

export const sports: Sport[] = [
  {
    id: 'SP-01', code: 'SP-01', name: 'Football', icon: 'ti ti-ball-football', tint: 'primary',
    category: 'Team Sport', gender: 'Boys', team: 'Senior XI',
    coach: 'Aariv Kumar', coachAvatar: 'assets/img/teachers/teacher-09.jpg', assistant: 'Marcus Lee',
    schedule: 'Mon, Wed, Fri · 04:00 PM', venue: 'Main Ground',
    students: 28, events: 3, achievements: 6,
    competition: 'Inter-School League', academicYear: '2024/2025', lastActivity: '2h ago',
    status: 'Active', classes: ['Class IX', 'Class X'], sections: ['A', 'B'],
  },
  {
    id: 'SP-02', code: 'SP-02', name: 'Basketball', icon: 'ti ti-ball-basketball', tint: 'warning',
    category: 'Team Sport', gender: 'Mixed', team: 'Hoopsters',
    coach: 'Marcus Lee', coachAvatar: 'assets/img/teachers/teacher-06.jpg', assistant: 'Hendrita Ray',
    schedule: 'Tue, Thu · 03:30 PM', venue: 'Indoor Court',
    students: 20, events: 2, achievements: 4,
    competition: 'District Championship', academicYear: '2024/2025', lastActivity: '5h ago',
    status: 'In Progress', classes: ['Class VIII', 'Class IX'], sections: ['A', 'C'],
  },
  {
    id: 'SP-03', code: 'SP-03', name: 'Cricket', icon: 'ti ti-cricket', tint: 'success',
    category: 'Team Sport', gender: 'Boys', team: 'Strikers XI',
    coach: 'Ramsey Fox', coachAvatar: 'assets/img/teachers/teacher-08.jpg', assistant: 'Joseph Ray',
    schedule: 'Mon–Sat · 06:30 AM', venue: 'Cricket Ground',
    students: 22, events: 4, achievements: 9,
    competition: 'State Cup', academicYear: '2024/2025', lastActivity: '1d ago',
    status: 'Active', classes: ['Class IX', 'Class X'], sections: ['A', 'B', 'C'],
  },
  {
    id: 'SP-04', code: 'SP-04', name: 'Athletics (Track)', icon: 'ti ti-run', tint: 'danger',
    category: 'Individual', gender: 'Mixed', team: 'Track Squad',
    coach: 'Teresa Vale', coachAvatar: 'assets/img/teachers/teacher-05.jpg', assistant: 'Elisa Gardner',
    schedule: 'Daily · 05:30 AM', venue: 'Athletics Track',
    students: 34, events: 5, achievements: 12,
    competition: 'Annual Sports Meet', academicYear: '2024/2025', lastActivity: '3h ago',
    status: 'Upcoming', classes: ['Class VI', 'Class VII', 'Class VIII'], sections: ['A', 'B'],
  },
  {
    id: 'SP-05', code: 'SP-05', name: 'Swimming', icon: 'ti ti-swimming', tint: 'info',
    category: 'Individual', gender: 'Mixed', team: 'Aqua Team',
    coach: 'Hendrita Ray', coachAvatar: 'assets/img/teachers/teacher-06.jpg', assistant: 'Teresa Vale',
    schedule: 'Tue, Thu, Sat · 04:30 PM', venue: 'Swimming Pool',
    students: 16, events: 2, achievements: 5,
    competition: 'Regional Meet', academicYear: '2024/2025', lastActivity: '6h ago',
    status: 'Active', classes: ['Class VII', 'Class VIII'], sections: ['B'],
  },
  {
    id: 'SP-06', code: 'SP-06', name: 'Badminton', icon: 'ti ti-ball-tennis', tint: 'purple',
    category: 'Racquet', gender: 'Girls', team: 'Shuttlers',
    coach: 'Erickson Poe', coachAvatar: 'assets/img/teachers/teacher-01.jpg', assistant: 'Mori Sato',
    schedule: 'Wed, Fri · 03:00 PM', venue: 'Indoor Court 2',
    students: 18, events: 1, achievements: 3,
    competition: 'Inter-House Tournament', academicYear: '2024/2025', lastActivity: '1d ago',
    status: 'Completed', classes: ['Class VIII', 'Class IX'], sections: ['A'],
  },
  {
    id: 'SP-07', code: 'SP-07', name: 'Table Tennis', icon: 'ti ti-ball-tennis', tint: 'teal',
    category: 'Racquet', gender: 'Mixed', team: 'Paddlers',
    coach: 'Mori Sato', coachAvatar: 'assets/img/teachers/teacher-02.jpg', assistant: 'Erickson Poe',
    schedule: 'Mon, Thu · 03:30 PM', venue: 'Recreation Hall',
    students: 14, events: 1, achievements: 2,
    competition: 'Inter-House Tournament', academicYear: '2024/2025', lastActivity: '4h ago',
    status: 'In Progress', classes: ['Class VI', 'Class VII'], sections: ['B', 'C'],
  },
  {
    id: 'SP-08', code: 'SP-08', name: 'Volleyball', icon: 'ti ti-ball-volleyball', tint: 'pink',
    category: 'Team Sport', gender: 'Boys', team: 'Spikers',
    coach: 'Joseph Ray', coachAvatar: 'assets/img/teachers/teacher-03.jpg', assistant: 'Ramsey Fox',
    schedule: 'Tue, Fri · 04:00 PM', venue: 'Volleyball Court',
    students: 24, events: 2, achievements: 4,
    competition: 'District Championship', academicYear: '2024/2025', lastActivity: '8h ago',
    status: 'Active', classes: ['Class IX', 'Class X'], sections: ['A', 'C'],
  },
  {
    id: 'SP-09', code: 'SP-09', name: 'Chess', icon: 'ti ti-chess', tint: 'dark',
    category: 'Indoor', gender: 'Mixed', team: 'Grandmasters',
    coach: 'James Kirk', coachAvatar: 'assets/img/teachers/teacher-04.jpg', assistant: 'Mori Sato',
    schedule: 'Sat · 10:00 AM', venue: 'Library Annexe',
    students: 12, events: 1, achievements: 7,
    competition: 'State Cup', academicYear: '2024/2025', lastActivity: '2d ago',
    status: 'Inactive', classes: ['Class VI', 'Class VII', 'Class VIII', 'Class IX'], sections: ['A', 'B'],
  },
  {
    id: 'SP-10', code: 'SP-10', name: 'Kabaddi', icon: 'ti ti-friends', tint: 'secondary',
    category: 'Team Sport', gender: 'Boys', team: 'Raiders',
    coach: 'Morgan Hale', coachAvatar: 'assets/img/teachers/teacher-10.jpg', assistant: 'Aariv Kumar',
    schedule: 'Mon, Wed · 05:00 PM', venue: 'Ground B',
    students: 20, events: 0, achievements: 3,
    competition: 'Annual Sports Meet', academicYear: '2023/2024', lastActivity: '1w ago',
    status: 'Archived', classes: ['Class X'], sections: ['B'],
  },
];
