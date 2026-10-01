/**
 * `Archived` is the one status with no counterpart in the template's markup: no
 * row carries it, but the row menu and the bulk bar both offer an Archive
 * action, and the other five statuses are all live states for it to land in.
 */
export type PlayerStatus =
  | 'Active' | 'Available' | 'In Training' | 'Injured' | 'Suspended' | 'Graduated' | 'Archived';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type MedicalStatus = 'Cleared' | 'Pending' | 'Not Cleared';
export type Availability = 'Available' | 'Limited' | 'Unavailable';

export interface Player {
  id: string;
  /** The template's `dt-adm`, e.g. "AD202409". */
  admission: string;
  name: string;
  avatar: string;
  roll: number;
  /** Roman numeral only — the badge reads "Class X-A". */
  classLevel: string;
  section: string;
  gender: 'Boys' | 'Girls';
  sport: string;
  team: string;
  position: string;
  /** Two digits, as the template prints it: "#09". */
  jersey: string;
  coach: string;
  coachAvatar: string;
  skill: SkillLevel;
  /** Training attendance, in percent. */
  attendance: number;
  medical: MedicalStatus;
  achievements: number;
  availability: Availability;
  academicYear: string;
  status: PlayerStatus;
}

export const statusPill: Record<PlayerStatus, string> = {
  Active: 'is-active',
  Available: 'is-new',
  'In Training': 'is-pending',
  Injured: 'is-emergency',
  Suspended: 'is-archived',
  Graduated: 'is-exam',
  Archived: 'is-archived',
};

/** Only Active draws the plain dot. Null means "render the dot". */
export const statusIcon: Record<PlayerStatus, string | null> = {
  Active: null,
  Available: 'ti ti-circle-check',
  'In Training': 'ti ti-run',
  Injured: 'ti ti-first-aid-kit',
  Suspended: 'ti ti-player-pause',
  Graduated: 'ti ti-school',
  Archived: 'ti ti-archive',
};

/* ------------------------------ Filter options ------------------------------ */

export const sportOptions = [
  'Football', 'Basketball', 'Badminton', 'Cricket', 'Swimming',
  'Athletics', 'Table Tennis', 'Volleyball', 'Chess', 'Kabaddi',
];

export const teamOptions = [
  'Senior XI', 'Hoopsters', 'Shuttlers', 'Strikers XI', 'Aqua Team',
  'Track Squad', 'Paddlers', 'Spikers', 'Grandmasters', 'Raiders',
];

/** The filter select lists the numerals alone, as the template does. */
export const classOptions = ['X', 'XI', 'XII', 'IX', 'VII'];

export const sectionOptions = ['A', 'B', 'C'];

export const coachOptions = [
  'Aariv Kumar', 'Marcus Lee', 'Erickson Poe', 'Ramsey Fox', 'Hendrita Ray',
  'Teresa Vale', 'Mori Sato', 'Joseph Ray', 'James Kirk', 'Morgan Hale',
];

export const genderOptions: Player['gender'][] = ['Boys', 'Girls'];

export const skillOptions: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

export const availabilityOptions: Availability[] = ['Available', 'Limited', 'Unavailable'];

export const medicalOptions: MedicalStatus[] = ['Cleared', 'Pending', 'Not Cleared'];

export const academicYearOptions = ['2024/2025', '2023/2024'];

export const statusOptions: PlayerStatus[] = [
  'Active', 'Available', 'In Training', 'Injured', 'Suspended', 'Graduated', 'Archived',
];

export const fitnessOptions = ['Fit', 'Recovering', 'Unfit'];

export const importModes = [
  'Create new players', 'Update existing by admission no', 'Create and update',
];

/** The Team Assignment dialog's list, sport and team in one string. */
export const teamChoices = [
  'Football — Senior XI', 'Basketball — Hoopsters', 'Badminton — Shuttlers',
  'Cricket — Strikers XI', 'Swimming — Aqua Team', 'Athletics — Track Squad',
  'Table Tennis — Paddlers', 'Volleyball — Spikers', 'Chess — Grandmasters',
  'Kabaddi — Raiders',
];

/* ------------------------------- Derivations -------------------------------- */

/** The row's sport badge carries the same icon on all ten rows. */
export const SPORT_ICON = 'ti ti-ball-football';

export const classLabelOf = (row: Player): string => `${row.classLevel}-${row.section}`;

/** "Andrew Fischer — AD202409", the read-only Player field every dialog opens with. */
export const playerFieldOf = (row: Player): string => `${row.name} — ${row.admission}`;

/** "Football — Senior XI", the Team Assignment dialog's own label. */
export const teamLabelOf = (row: Player): string => `${row.sport} — ${row.team}`;

export interface Fitness {
  label: string;
  icon: string;
  tint: string;
}

/** Clearance and fitness move together on every row of the template. */
export const fitnessOf = (medical: MedicalStatus): Fitness => {
  switch (medical) {
    case 'Pending':
      return { label: 'Recovering', icon: 'ti ti-heart-plus', tint: 'warning' };
    case 'Not Cleared':
      return { label: 'Unfit', icon: 'ti ti-heart-broken', tint: 'danger' };
    case 'Cleared':
    default:
      return { label: 'Fit', icon: 'ti ti-heart', tint: 'success' };
  }
};

export const medicalIcon: Record<MedicalStatus, string> = {
  Cleared: 'ti ti-discount',
  Pending: 'ti ti-clock',
  'Not Cleared': 'ti ti-alert-triangle',
};

export const medicalTint: Record<MedicalStatus, string> = {
  Cleared: 'success',
  Pending: 'warning',
  'Not Cleared': 'danger',
};

/** 85% and above reads success, 70–84 warning, below that danger. */
export const attendanceTint = (attendance: number): string => {
  if (attendance >= 85) return 'success';
  if (attendance >= 70) return 'warning';
  return 'danger';
};

/** The row meter is the skill bar: Advanced 90%, Intermediate 65%, Beginner 35%. */
export const skillWidth: Record<SkillLevel, number> = {
  Advanced: 90,
  Intermediate: 65,
  Beginner: 35,
};

export const skillTint: Record<SkillLevel, string> = {
  Advanced: 'success',
  Intermediate: 'primary',
  Beginner: 'warning',
};

export const studentLineOf = (row: Player): string =>
  `Class ${classLabelOf(row)} · Roll ${row.roll} · ${row.gender}`;

export const sportsProfileOf = (row: Player): string =>
  `${row.sport} · ${row.team} · ${row.position} · Jersey #${row.jersey} · Coach ${row.coach}.`;

/** The View dialog drops the sport and team, which its sub-line already names. */
export const shortProfileOf = (row: Player): string =>
  `${row.position} · Jersey #${row.jersey} · Coach ${row.coach}.`;

export const summaryOf = (row: Player): string =>
  `${row.admission} · Class ${classLabelOf(row)} · Roll ${row.roll} · ${row.sport} · ${row.team}`;

export const performanceLineOf = (row: Player): string =>
  `${row.skill} · ${row.attendance}% attendance · ${row.achievements} achievements`;

export const achievementsLineOf = (row: Player): string =>
  `medals & titles in ${row.sport}.`;

/** Status first, then skill — the rule behind all ten Coach Remarks lines. */
export const remarksOf = (row: Player): string => {
  if (row.status === 'Injured') return `${row.coach}: On recovery protocol — cleared to return soon.`;
  if (row.status === 'Suspended') return `${row.coach}: Suspended pending disciplinary review.`;
  return row.skill === 'Advanced'
    ? `${row.coach}: Exceptional player — leadership potential.`
    : `${row.coach}: Consistent and improving each session.`;
};

/** The template prints the same guardian line on every row. */
export const PARENT_NOTE = 'Guardian supportive of training schedule and travel for matches.';

/* ---------------------------- Generated dialogs ------------------------------ */

export interface PerformanceMetric {
  metric: string;
  season: string;
  value: string;
  /** Set on the rating row, which the template renders as a badge. */
  badge?: string;
}

/**
 * The template's four metrics, hard-coded to Andrew Fischer's season. Derived
 * here so a player's matches, points, attendance and rating follow the row: the
 * rating is the skill bar and the attendance averaged onto a ten-point scale,
 * and it colours itself the way the attendance figure does.
 */
export const performanceOf = (row: Player): PerformanceMetric[] => {
  const matches = Math.max(1, Math.round(row.attendance / 5));
  const points = matches + row.achievements * 3;
  const rating = ((skillWidth[row.skill] + row.attendance) / 20).toFixed(1);
  return [
    { metric: 'Matches Played', season: row.academicYear, value: String(matches) },
    { metric: 'Goals / Points', season: row.academicYear, value: String(points) },
    { metric: 'Training Attendance', season: row.academicYear, value: `${row.attendance}%` },
    { metric: 'Player Rating', season: row.academicYear, value: `${rating} / 10`, badge: attendanceTint(row.attendance) },
  ];
};

export interface AchievementEntry {
  title: string;
  event: string;
  year: string;
  medal: 'Gold' | 'Silver' | 'Bronze' | 'Trophy';
  icon: string;
  tint: string;
}

const achievementTitles = [
  'Top Scorer', 'Best Striker', 'Team Champion', 'Most Valuable Player',
  'Best Newcomer', 'Fair Play Award',
];

const events = ['Inter-School League', 'District Championship', 'State Cup', 'Annual Sports Meet'];

const medals: { medal: AchievementEntry['medal']; icon: string; tint: string }[] = [
  { medal: 'Gold', icon: 'ti ti-trophy', tint: 'warning' },
  { medal: 'Silver', icon: 'ti ti-medal', tint: 'secondary' },
  { medal: 'Trophy', icon: 'ti ti-award', tint: 'warning' },
  { medal: 'Bronze', icon: 'ti ti-medal-2', tint: 'info' },
];

/** As many rows as the grid's achievement badge counts. */
export const achievementsOf = (row: Player): AchievementEntry[] =>
  Array.from({ length: row.achievements }, (_, index) => ({
    title: achievementTitles[index % achievementTitles.length],
    event: events[index % events.length],
    year: String(2023 - Math.floor(index / 3)),
    ...medals[index % medals.length],
  }));

/** The two badges the View dialog prints, or none when the player has no wins. */
export const achievementBadgesOf = (row: Player): string[] =>
  achievementsOf(row)
    .slice(0, 2)
    .map((entry) => `${entry.title} ${entry.year}`);

/* --------------------------------- Sorting ---------------------------------- */

/** Mirrors the template's `data-search` attribute. */
export const searchIndexOf = (row: Player): string =>
  [
    row.name, row.admission, `class ${row.classLevel}`, `sec ${row.section}`, `roll ${row.roll}`,
    row.gender, row.sport, row.team, row.position, row.coach, row.skill, row.status,
    row.availability, row.medical, row.academicYear,
  ]
    .join(' ')
    .toLowerCase();

/**
 * The template's ten rows are already in "recently updated" order and carry no
 * timestamp, so the roster order is the recency order: the index stands in for
 * the missing field, and rows added later sort to the front.
 */
export const recencyKey = (row: Player): number => {
  const index = players.findIndex((entry) => entry.id === row.id);
  return index === -1 ? -1 : index;
};

/* ---------------------------------- Rows ------------------------------------ */

export const players: Player[] = [
  {
    id: 'AD202409', admission: 'AD202409', name: 'Andrew Fischer',
    avatar: 'assets/img/students/student-09.jpg', roll: 14, classLevel: 'X', section: 'A',
    gender: 'Boys', sport: 'Football', team: 'Senior XI', position: 'Striker', jersey: '09',
    coach: 'Aariv Kumar', coachAvatar: 'assets/img/teachers/teacher-09.jpg',
    skill: 'Advanced', attendance: 94, medical: 'Cleared', achievements: 5,
    availability: 'Available', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'AD202406', admission: 'AD202406', name: 'Ralph Claudia',
    avatar: 'assets/img/students/student-06.jpg', roll: 17, classLevel: 'XI', section: 'A',
    gender: 'Boys', sport: 'Basketball', team: 'Hoopsters', position: 'Point Guard', jersey: '07',
    coach: 'Marcus Lee', coachAvatar: 'assets/img/teachers/teacher-06.jpg',
    skill: 'Intermediate', attendance: 88, medical: 'Cleared', achievements: 3,
    availability: 'Available', academicYear: '2024/2025', status: 'Available',
  },
  {
    id: 'AD202402', admission: 'AD202402', name: 'Joann Michael',
    avatar: 'assets/img/students/student-02.jpg', roll: 13, classLevel: 'X', section: 'A',
    gender: 'Girls', sport: 'Badminton', team: 'Shuttlers', position: 'Singles', jersey: '03',
    coach: 'Erickson Poe', coachAvatar: 'assets/img/teachers/teacher-01.jpg',
    skill: 'Advanced', attendance: 96, medical: 'Cleared', achievements: 7,
    availability: 'Available', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'AD202404', admission: 'AD202404', name: 'Gifford Ramsey',
    avatar: 'assets/img/students/student-04.jpg', roll: 21, classLevel: 'XII', section: 'A',
    gender: 'Boys', sport: 'Cricket', team: 'Strikers XI', position: 'All-Rounder', jersey: '18',
    coach: 'Ramsey Fox', coachAvatar: 'assets/img/teachers/teacher-08.jpg',
    skill: 'Advanced', attendance: 72, medical: 'Pending', achievements: 9,
    availability: 'Limited', academicYear: '2024/2025', status: 'Injured',
  },
  {
    id: 'AD202405', admission: 'AD202405', name: 'Lisa Gourley',
    avatar: 'assets/img/students/student-05.jpg', roll: 5, classLevel: 'XII', section: 'C',
    gender: 'Girls', sport: 'Swimming', team: 'Aqua Team', position: 'Freestyle', jersey: '12',
    coach: 'Hendrita Ray', coachAvatar: 'assets/img/teachers/teacher-06.jpg',
    skill: 'Intermediate', attendance: 90, medical: 'Cleared', achievements: 4,
    availability: 'Available', academicYear: '2024/2025', status: 'In Training',
  },
  {
    id: 'AD202403', admission: 'AD202403', name: 'Kathleen Nolan',
    avatar: 'assets/img/students/student-03.jpg', roll: 8, classLevel: 'IX', section: 'B',
    gender: 'Girls', sport: 'Athletics', team: 'Track Squad', position: 'Sprinter', jersey: '22',
    coach: 'Teresa Vale', coachAvatar: 'assets/img/teachers/teacher-05.jpg',
    skill: 'Beginner', attendance: 85, medical: 'Cleared', achievements: 2,
    availability: 'Available', academicYear: '2024/2025', status: 'In Training',
  },
  {
    id: 'AD202401', admission: 'AD202401', name: 'Janet Daniel',
    avatar: 'assets/img/students/student-01.jpg', roll: 12, classLevel: 'X', section: 'A',
    gender: 'Girls', sport: 'Table Tennis', team: 'Paddlers', position: 'Singles', jersey: '05',
    coach: 'Mori Sato', coachAvatar: 'assets/img/teachers/teacher-02.jpg',
    skill: 'Intermediate', attendance: 91, medical: 'Cleared', achievements: 3,
    availability: 'Available', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'AD202410', admission: 'AD202410', name: 'Karen Robinson',
    avatar: 'assets/img/students/student-10.jpg', roll: 6, classLevel: 'VII', section: 'B',
    gender: 'Girls', sport: 'Volleyball', team: 'Spikers', position: 'Setter', jersey: '11',
    coach: 'Joseph Ray', coachAvatar: 'assets/img/teachers/teacher-03.jpg',
    skill: 'Beginner', attendance: 60, medical: 'Not Cleared', achievements: 1,
    availability: 'Unavailable', academicYear: '2024/2025', status: 'Suspended',
  },
  {
    id: 'AD202408', admission: 'AD202408', name: 'Hellen Warner',
    avatar: 'assets/img/students/student-08.jpg', roll: 9, classLevel: 'XI', section: 'A',
    gender: 'Girls', sport: 'Chess', team: 'Grandmasters', position: 'Board 1', jersey: '01',
    coach: 'James Kirk', coachAvatar: 'assets/img/teachers/teacher-04.jpg',
    skill: 'Advanced', attendance: 97, medical: 'Cleared', achievements: 8,
    availability: 'Available', academicYear: '2024/2025', status: 'Active',
  },
  {
    id: 'AD202411', admission: 'AD202411', name: 'George Kelly',
    avatar: 'assets/img/profiles/avatar-25.jpg', roll: 2, classLevel: 'XII', section: 'B',
    gender: 'Boys', sport: 'Kabaddi', team: 'Raiders', position: 'Raider', jersey: '10',
    coach: 'Morgan Hale', coachAvatar: 'assets/img/teachers/teacher-10.jpg',
    skill: 'Advanced', attendance: 80, medical: 'Cleared', achievements: 6,
    availability: 'Available', academicYear: '2023/2024', status: 'Graduated',
  },
];
