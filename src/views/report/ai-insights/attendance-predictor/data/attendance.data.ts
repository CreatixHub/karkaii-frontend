import { addDays, daysBetween } from '../../data/dates';
import { RUN_DATE, STUDENTS_ENROLLED } from '../../data/registers';

export type AttendanceBand = 'Critical' | 'High' | 'Watch';

const round1 = (value: number) => Math.round(value * 10) / 10;
const mean = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

/* ------------------------------------------------------------------ *
 * The school, and the run                                            *
 * ------------------------------------------------------------------ */

/** Weekly school-wide attendance, in teaching-week order. */
export const HEALTH_WEEKS = [
  92.8, 93.6, 84.0, 72.0, 82.0, 92.7, 93.7, 93.0, 94.0, 94.0, 92.0, 93.0, 94.0, 93.0, 94.0, 94.2,
  94.6, 95.0, 95.0,
];

/** Teaching weeks in the term. The five past `HEALTH_WEEKS` are not yet taught. */
export const TERM_WEEKS = 24;

/** The meter's own scale, printed beneath it. */
export const HEALTH_SCALE = [
  { state: 'is-on', label: 'Healthy', note: 'above 85%', floor: 85 },
  { state: 'is-warn', label: 'Watch', note: '75–85%', floor: 75 },
  { state: 'is-bad', label: 'Critical', note: 'below 75%', floor: 0 },
];

/** Where a school-wide reading sits on the meter's scale. */
export const healthStateOf = (reading: number) =>
  (HEALTH_SCALE.find((band) => reading >= band.floor) ?? HEALTH_SCALE[HEALTH_SCALE.length - 1])
    .state;

/** Attendance health, school-wide: the term's readings so far. */
export const SCHOOL_HEALTH = round1(mean(HEALTH_WEEKS));

/** The month's movement: the last four taught weeks against the four before. */
export const HEALTH_CHANGE = round1(
  mean(HEALTH_WEEKS.slice(-4)) - mean(HEALTH_WEEKS.slice(-8, -4)),
);

/**
 * The meter band: one segment per teaching week, sorted best first so the bar
 * reads as a distribution against the scale beneath it. Weeks not yet taught
 * stay unlit.
 */
export const healthBand = (): string[] => {
  const taught = [...HEALTH_WEEKS].sort((a, b) => b - a).map(healthStateOf);
  const remaining = Math.max(0, TERM_WEEKS - taught.length);
  return [...taught, ...(Array(remaining).fill('') as string[])];
};

/** Predicted school-wide attendance at term end. */
export const PREDICTED_TERM_END = 89.2;

/** How far the prediction sits below today. */
export const PREDICTED_GAP = round1(SCHOOL_HEALTH - PREDICTED_TERM_END);

/** Students the engine placed under observation. */
export const UNDER_OBSERVATION = 58;

/** Signals the model reads. Six of them contribute to the worst case. */
export const SIGNAL_COUNT = 14;

/** The engine's confidence in this run. */
export const MODEL_CONFIDENCE = 94.6;

/** The window every prediction on the page is made over. */
export const PREDICTION_WINDOW_DAYS = 30;

/** The statutory floor a case is measured against. */
export const STATUTORY_THRESHOLD = 75;

export const LAST_RUN = '06:15';
export const NEXT_RUN_IN = 'in 4 hours';
export const RUN_DURATION = '3m 41s';

/** Students this run scored, from the school the whole engine reads. */
export const STUDENTS_SCORED = STUDENTS_ENROLLED;

/** The date every prediction on this run lands on. */
export const PREDICTED_BY = addDays(RUN_DATE, PREDICTION_WINDOW_DAYS);

export { RUN_DATE };

/* ------------------------------------------------------------------ *
 * Bands                                                              *
 * ------------------------------------------------------------------ */

/**
 * The band a case carries, read off its predicted figure — which is what the
 * queue is about, and what reproduces all six of the template's own bands.
 *
 * This is not the meter's scale above it. That one reads the school as a whole
 * against the statutory floor; this one reads where a single student is headed.
 */
export const PREDICTION_BANDS: { band: AttendanceBand; floor: number; pill: string }[] = [
  { band: 'Watch', floor: 80, pill: 'is-watch' },
  { band: 'High', floor: 70, pill: 'is-high' },
  { band: 'Critical', floor: 0, pill: 'is-critical' },
];

export const bandOf = (predicted: number): AttendanceBand =>
  (PREDICTION_BANDS.find((entry) => predicted >= entry.floor) ?? PREDICTION_BANDS[2]).band;

export const bandPill = (band: AttendanceBand) =>
  PREDICTION_BANDS.find((entry) => entry.band === band)?.pill ?? 'is-watch';

/** The seven steps of the twelve-week heat strip, blue healthy to red missed. */
export const HEAT_BANDS = [
  { floor: 95, cls: 'h4' },
  { floor: 90, cls: 'h3' },
  { floor: 85, cls: 'h2' },
  { floor: 80, cls: 'h1' },
  { floor: 75, cls: 'm1' },
  { floor: 70, cls: 'm2' },
  { floor: 0, cls: 'm3' },
];

export const heatClassOf = (reading: number) =>
  (HEAT_BANDS.find((band) => reading >= band.floor) ?? HEAT_BANDS[HEAT_BANDS.length - 1]).cls;

/* ------------------------------------------------------------------ *
 * A case                                                             *
 * ------------------------------------------------------------------ */

export interface Evidence {
  /** Present days before and after the decline, out of the same total. */
  presentBefore: number;
  presentAfter: number;
  ofDays: number;
  declineWeeks: number;
  /** Late arrivals a month, before and now. */
  lateBefore: number;
  lateNow: number;
  /** The route carrying most of them, and what it costs. */
  route: string;
  routeLateMarks: number;
  routeOverrunMinutes: number;
  /** Absences falling on a Monday. */
  mondayAbsences: number;
  /** A late week preceded an absent week this often, of this many. */
  lateThenAbsent: [number, number];
  /** Cohort cases where this late slope preceded a full absence. */
  slopePrecedes: [number, number];
  /** Terms the first days back have been absent, and how many days. */
  breakTerms: number;
  breakDays: number;
  /** Medical leave filed this term, of which certified, against the class median. */
  medicalLeaves: number;
  medicalCertified: number;
  classMedianLeaves: number;
  /** Absence against assignment due dates. */
  correlation: number;
  missedSubmissions: number;
  /** Students who recovered from the same pattern. */
  similarCases: number;
}

export interface ReasoningNode {
  id: string;
  icon: string;
  observation: string;
  why: string;
  band: AttendanceBand;
  confidence: number;
  /** Attendance points this link is worth if acted on. */
  gain: number;
  signals: { icon: string; text: string }[];
  action: string;
}

export interface CaseRecommendation {
  id: string;
  title: string;
  band: AttendanceBand;
  note: string;
  confidence: number;
  gain: number;
  modal: string;
}

export interface PlanWeek {
  week: number;
  reading: number;
  note: string;
}

export interface TimelineShape {
  id: string;
  icon: string;
  title: string;
  /** Days after the case opened. */
  offsetDays: number;
  at: string;
  note: string;
  tone: '' | 'is-bad' | 'is-warn' | 'is-good';
}

export interface AttendanceCase {
  id: string;
  student: string;
  studentImage: string;
  className: string;
  /** The class without its "Class " prefix, as the queue table prints it. */
  classShort: string;
  teacher: string;
  /** Attendance to date, and where the run says it lands in the window. */
  current: number;
  predicted: number;
  confidence: number;
  /** Twelve weekly readings, oldest first. */
  weekly: number[];
  /** The teaching week the strip starts at, for its axis. */
  weekFrom: number;
  /** What the trend note says beyond the run itself. */
  cause: string;
  updated: string;
  openedOn: string;
  guardian?: string;
  successProbability?: number;
  /** Only the case the page explains in full carries the rest. */
  evidence?: Evidence;
  similar?: { name: string; className: string; note: string; done: boolean }[];
  decisions?: { title: string; note: string; done: boolean }[];
  plan?: { openedOn: string; weeks: number; target: number; weekly: PlanWeek[] };
}

/** The six cases the page ships, before ordering. */
const seeded: AttendanceCase[] = [
  {
    id: 'ATN-2041',
    student: 'Liam Walker',
    studentImage: 'assets/img/students/student-04.jpg',
    className: 'Class IV-B',
    classShort: 'IV-B',
    teacher: 'Teena Mathew',
    guardian: 'Mr. J. Walker',
    current: 71,
    predicted: 63,
    confidence: 96,
    weekly: [96, 94, 92, 88, 84, 78, 74, 70, 66, 63, 61, 58],
    weekFrom: 16,
    cause: 'Chronic absence forming',
    updated: '12 minutes ago',
    openedOn: '02 Jul 2026',
    successProbability: 78,
    evidence: {
      presentBefore: 24,
      presentAfter: 17,
      ofDays: 25,
      declineWeeks: 6,
      lateBefore: 2,
      lateNow: 11,
      route: 'Route 04',
      routeLateMarks: 9,
      routeOverrunMinutes: 22,
      mondayAbsences: 7,
      lateThenAbsent: [4, 5],
      slopePrecedes: [8, 10],
      breakTerms: 4,
      breakDays: 2,
      medicalLeaves: 6,
      medicalCertified: 5,
      classMedianLeaves: 2,
      correlation: 0.71,
      missedSubmissions: 7,
      similarCases: 8,
    },
    similar: [
      {
        name: 'Nathan Cole',
        className: 'VII-A',
        note: 'Same transport pattern · recovered to 89% in 5 weeks',
        done: true,
      },
      {
        name: 'Zara Ahmed',
        className: 'V-C',
        note: 'Same Monday signature · recovered to 86% in 4 weeks',
        done: true,
      },
      {
        name: 'Ethan Brooks',
        className: 'X-B',
        note: 'Same avoidance signature · plan still open',
        done: false,
      },
    ],
    decisions: [
      { title: 'Parent letter approved', note: 'By Admin', done: true },
      { title: 'Transport review approved', note: 'By Admin', done: true },
      { title: 'Parent meeting declined', note: 'Deferred pending transport outcome', done: false },
    ],
    plan: {
      openedOn: '06 Jul 2026',
      weeks: 4,
      target: 85,
      weekly: [
        { week: 1, reading: 74, note: 'Letter delivered, transport raised' },
        { week: 2, reading: 78, note: 'Route 04 rescheduled, late marks fell to 2' },
        { week: 3, reading: 81, note: 'No Monday absence for the first time this term' },
        { week: 4, reading: 84, note: 'One point from target, monitoring continues' },
      ],
    },
  },
  {
    id: 'ATN-1876',
    student: 'Kabir Sethi',
    studentImage: 'assets/img/students/student-02.jpg',
    className: 'Class VIII-A',
    classShort: 'VIII-A',
    teacher: 'Meera Joshi',
    current: 76,
    predicted: 68,
    confidence: 94,
    weekly: [88, 84, 80, 78, 76, 76, 74, 71, 68, 65, 62, 58],
    weekFrom: 16,
    cause: 'Monday absence pattern',
    updated: '36 minutes ago',
    openedOn: '09 Jul 2026',
  },
  {
    id: 'ATN-1655',
    student: 'George Kettut',
    studentImage: 'assets/img/students/student-06.jpg',
    className: 'Class II-A',
    classShort: 'II-A',
    teacher: 'Daniel Josua',
    current: 79,
    predicted: 74,
    confidence: 91,
    weekly: [84, 82, 80, 82, 84, 82, 80, 78, 78, 76, 73, 70],
    weekFrom: 16,
    cause: 'Late arrivals compounding',
    updated: '1 hour ago',
    openedOn: '14 Jul 2026',
  },
  {
    id: 'ATN-1420',
    student: 'Sophia Reyes',
    studentImage: 'assets/img/students/student-03.jpg',
    className: 'Class III-A',
    classShort: 'III-A',
    teacher: 'Leela Nambiar',
    current: 82,
    predicted: 77,
    confidence: 89,
    weekly: [90, 88, 86, 88, 90, 88, 86, 84, 82, 82, 79, 75],
    weekFrom: 16,
    cause: 'Post-holiday drop-off',
    updated: '2 hours ago',
    openedOn: '18 Jul 2026',
  },
  {
    id: 'ATN-1198',
    student: 'Aarav Menon',
    studentImage: 'assets/img/students/student-05.jpg',
    className: 'Class VI-B',
    classShort: 'VI-B',
    teacher: 'Priya Sundaram',
    current: 85,
    predicted: 81,
    confidence: 87,
    weekly: [92, 90, 88, 90, 88, 86, 88, 86, 84, 84, 84, 84],
    weekFrom: 16,
    cause: 'Transport delay exposure',
    updated: '4 hours ago',
    openedOn: '21 Jul 2026',
  },
  {
    id: 'ATN-1042',
    student: 'Maria Fernandes',
    studentImage: 'assets/img/students/student-07.jpg',
    className: 'Class IX-C',
    classShort: 'IX-C',
    teacher: 'Rakesh Sharma',
    current: 88,
    predicted: 85,
    confidence: 84,
    weekly: [92, 90, 86, 82, 78, 74, 76, 78, 80, 83, 86, 89],
    weekFrom: 16,
    cause: 'Medical leave frequency',
    updated: '6 hours ago',
    openedOn: '24 Jul 2026',
  },
];

/* ------------------------------------------------------------------ *
 * What a case knows about itself                                     *
 * ------------------------------------------------------------------ */

/** Points the prediction sits below today's figure. */
export const dropOf = (row: AttendanceCase) => row.current - row.predicted;

/** The heat strip, one step per weekly reading. */
export const heatOf = (row: AttendanceCase) => row.weekly.map(heatClassOf);

/** Teaching weeks the strip spans, for its axis. */
export const weekAxisOf = (row: AttendanceCase) => {
  const last = row.weekFrom + row.weekly.length - 1;
  return [row.weekFrom, Math.round((row.weekFrom + last) / 2), last];
};

/** The trailing run in the weekly series: which direction, and for how long. */
export const trendOf = (row: AttendanceCase) => {
  const steps = row.weekly.slice(1).map((value, index) => value - row.weekly[index]);
  const last = steps[steps.length - 1] ?? 0;
  const direction = last > 0 ? 'up' : last < 0 ? 'down' : 'flat';
  let weeks = 0;
  for (let index = steps.length - 1; index >= 0; index -= 1) {
    const step = steps[index];
    const matches =
      direction === 'up' ? step > 0 : direction === 'down' ? step < 0 : step === 0;
    if (!matches) break;
    weeks += 1;
  }
  return { direction, weeks };
};

/** The sentence under the heat strip. */
export const trendNoteOf = (row: AttendanceCase) => {
  const { direction, weeks } = trendOf(row);
  const lead =
    direction === 'up'
      ? 'Recovering'
      : direction === 'down'
        ? `Falling ${weeks} weeks`
        : `Flat ${weeks} weeks`;
  return `${lead} · ${row.cause}`;
};

/** The first week the series fell below the statutory floor, or null. */
export const belowThresholdWeekOf = (row: AttendanceCase) => {
  const index = row.weekly.findIndex((reading) => reading < STATUTORY_THRESHOLD);
  return index === -1 ? null : index + 1;
};

/** Days the case has been open, against the register clock. */
export const caseAgeOf = (row: AttendanceCase) => daysBetween(row.openedOn, RUN_DATE);

/**
 * Days left before the prediction carries the student under the statutory
 * floor, or null when the student is already beneath it.
 */
export const daysToBreachOf = (row: AttendanceCase) => {
  const drop = dropOf(row);
  if (drop <= 0 || row.current < STATUTORY_THRESHOLD) return null;
  const perDay = drop / PREDICTION_WINDOW_DAYS;
  return Math.max(0, Math.round((row.current - STATUTORY_THRESHOLD) / perDay));
};

/**
 * What the prediction panel can say about the floor.
 *
 * The template asks one question — how long until the threshold breaks — and
 * asks it of a student who broke it five weeks ago. Which question applies
 * depends on which side of the floor the student is standing on.
 */
export const thresholdStatusOf = (row: AttendanceCase) => {
  const week = belowThresholdWeekOf(row);
  if (row.current < STATUTORY_THRESHOLD && week !== null) {
    return { label: 'Days below threshold', value: `${(row.weekly.length - week) * 7} days` };
  }
  const days = daysToBreachOf(row);
  return {
    label: 'Days to threshold breach',
    value: days === null ? 'Not in window' : `${days} days`,
  };
};

/** Absences behind the decline: the present days it lost. */
export const absencesOf = (evidence: Evidence) => evidence.ofDays - evidence.presentAfter;

/** The rise in late arrivals, as the slope the reasoning chain quotes. */
export const lateSlopeOf = (evidence: Evidence) =>
  Math.round(((evidence.lateNow - evidence.lateBefore) / evidence.lateBefore) * 100);

/** The share of late marks the route carries. */
export const routeShareOf = (evidence: Evidence) =>
  Math.round((evidence.routeLateMarks / evidence.lateNow) * 100);

/** Medical leave against the class median. */
export const medicalMultipleOf = (evidence: Evidence) =>
  Math.round(evidence.medicalLeaves / evidence.classMedianLeaves);

/** The share of the plan's target gap closed since it opened. */
export const planRecoveryOf = (row: AttendanceCase) => {
  const plan = row.plan;
  if (!plan || plan.weekly.length === 0) return null;
  const first = plan.weekly[0].reading;
  const now = plan.weekly[plan.weekly.length - 1].reading;
  const gap = plan.target - first;
  return gap <= 0 ? 100 : Math.min(100, Math.round(((now - first) / gap) * 100));
};

/** Where the plan stands, and what it reads now. */
export const planNowOf = (row: AttendanceCase) =>
  row.plan?.weekly[row.plan.weekly.length - 1]?.reading ?? row.current;

/** The date the plan's closing checkpoint falls due. */
export const planCheckpointOf = (row: AttendanceCase) =>
  row.plan ? addDays(row.plan.openedOn, row.plan.weeks * 7) : null;

/* ------------------------------------------------------------------ *
 * The reasoning chain                                                *
 * ------------------------------------------------------------------ */

/**
 * The six links behind the featured case, written from its evidence.
 *
 * The template prints this chain twice — once in full on the page and once
 * compressed inside the workspace — and prints its supporting signals a third
 * time as a panel. All three read this.
 */
export const reasoningOf = (row: AttendanceCase): ReasoningNode[] => {
  const evidence = row.evidence;
  if (!evidence) return [];
  const absences = absencesOf(evidence);
  const slope = lateSlopeOf(evidence);
  const routeShare = routeShareOf(evidence);
  const multiple = medicalMultipleOf(evidence);

  return [
    {
      id: 'decline',
      icon: 'ti ti-trending-down',
      observation: 'Attendance dropped',
      why: `Present days fell from ${evidence.presentBefore} of ${evidence.ofDays} to ${evidence.presentAfter} of ${evidence.ofDays} across ${evidence.declineWeeks} weeks. The decline is monotonic, not episodic, which separates it from ordinary illness absence.`,
      band: 'Critical',
      confidence: 96,
      gain: 9,
      signals: [
        { icon: 'ti ti-calendar-x', text: `${absences} absences in ${evidence.declineWeeks} weeks` },
        { icon: 'ti ti-chart-line', text: 'No recovery week' },
        { icon: 'ti ti-alert-triangle', text: `Below ${STATUTORY_THRESHOLD}% threshold` },
      ],
      action: 'Open a recovery plan before the statutory threshold',
    },
    {
      id: 'late',
      icon: 'ti ti-clock-exclamation',
      observation: 'Late arrivals increasing',
      why: `Arrivals after the bell rose from ${evidence.lateBefore} to ${evidence.lateNow} per month. In this cohort a late-arrival slope of this size precedes a full absence within four weeks in ${evidence.slopePrecedes[0]} of ${evidence.slopePrecedes[1]} cases.`,
      band: 'Critical',
      confidence: 94,
      gain: 6,
      signals: [
        { icon: 'ti ti-clock', text: `${evidence.lateNow} late marks this month` },
        { icon: 'ti ti-arrow-up-right', text: `Slope +${slope}%` },
        { icon: 'ti ti-users', text: `Matches ${evidence.similarCases} similar cases` },
      ],
      action: 'Confirm the morning routine with the parent',
    },
    {
      id: 'transport',
      icon: 'ti ti-bus',
      observation: 'Transport delays',
      why: `${evidence.routeLateMarks} of ${evidence.lateNow} late marks fall on ${evidence.route}. The route logged an average ${evidence.routeOverrunMinutes} minute overrun on the same days, so the cause sits outside the household.`,
      band: 'High',
      confidence: 91,
      gain: 5,
      signals: [
        { icon: 'ti ti-map-pin', text: evidence.route },
        { icon: 'ti ti-clock-hour-4', text: `Avg ${evidence.routeOverrunMinutes} min overrun` },
        { icon: 'ti ti-percentage', text: `${routeShare}% of late marks` },
      ],
      action: 'Send the route to transport for a schedule review',
    },
    {
      id: 'holiday',
      icon: 'ti ti-beach',
      observation: 'Holiday return absence',
      why: `The first ${evidence.breakDays} days after every break are absent for this student in ${evidence.breakTerms} consecutive terms. The pattern is calendar-driven rather than health-driven.`,
      band: 'High',
      confidence: 89,
      gain: 4,
      signals: [
        { icon: 'ti ti-calendar-event', text: `${evidence.breakTerms} terms running` },
        { icon: 'ti ti-repeat', text: `First ${evidence.breakDays} days each break` },
        { icon: 'ti ti-heart', text: 'No medical note' },
      ],
      action: 'Schedule a return-to-school check-in call',
    },
    {
      id: 'medical',
      icon: 'ti ti-stethoscope',
      observation: 'Medical leave frequency',
      why: `${evidence.medicalLeaves} medical leaves were filed this term against a class median of ${evidence.classMedianLeaves}. ${evidence.medicalCertified} carry a certificate, so the leave is legitimate but the frequency is itself the signal.`,
      band: 'Watch',
      confidence: 86,
      gain: 3,
      signals: [
        {
          icon: 'ti ti-file-check',
          text: `${evidence.medicalCertified} of ${evidence.medicalLeaves} certified`,
        },
        { icon: 'ti ti-chart-bar', text: `${multiple}x class median` },
        { icon: 'ti ti-calendar', text: 'Clustered Mondays' },
      ],
      action: 'Refer to the school nurse for a wellbeing review',
    },
    {
      id: 'avoidance',
      icon: 'ti ti-notebook',
      observation: 'Assignment absenteeism',
      why: `Absences correlate with assignment due dates at ${evidence.correlation}. The student is present for practical periods and absent for submission days, which points to avoidance rather than illness.`,
      band: 'Watch',
      confidence: 84,
      gain: 4,
      signals: [
        { icon: 'ti ti-link', text: `Correlation ${evidence.correlation}` },
        { icon: 'ti ti-book', text: `${evidence.missedSubmissions} missed submissions` },
        { icon: 'ti ti-mood-sad', text: 'Avoidance signature' },
      ],
      action: 'Assign a teacher follow-up on workload',
    },
  ];
};

/** The patterns the class registers do not show, read off the same evidence. */
export const patternsOf = (row: AttendanceCase) => {
  const evidence = row.evidence;
  if (!evidence) return [];
  const absences = absencesOf(evidence);
  return [
    {
      icon: 'ti ti-calendar-repeat',
      title: 'Monday absence',
      note: `${evidence.mondayAbsences} of ${absences} absences fall on a Monday`,
    },
    {
      icon: 'ti ti-clock-exclamation',
      title: 'Late then absent',
      note: `A late week precedes an absent week in ${evidence.lateThenAbsent[0]} of ${evidence.lateThenAbsent[1]} cases`,
    },
    {
      icon: 'ti ti-beach',
      title: 'First day back',
      note: `Absent on the first day after every break, ${evidence.breakTerms} terms running`,
    },
    {
      icon: 'ti ti-notebook',
      title: 'Submission avoidance',
      note: `Absence correlates with due dates at ${evidence.correlation}`,
    },
  ];
};

/** The supporting-signal chips, gathered from the same evidence. */
export const supportingSignalsOf = (row: AttendanceCase) => {
  const evidence = row.evidence;
  if (!evidence) return [];
  return [
    {
      icon: 'ti ti-calendar-x',
      text: `${absencesOf(evidence)} absences in ${evidence.declineWeeks} weeks`,
    },
    { icon: 'ti ti-clock', text: `${evidence.lateNow} late marks` },
    { icon: 'ti ti-bus', text: `${evidence.route} overrun` },
    { icon: 'ti ti-file-check', text: `${evidence.medicalCertified} certified leaves` },
    { icon: 'ti ti-notebook', text: `${evidence.missedSubmissions} missed submissions` },
    { icon: 'ti ti-users', text: `${evidence.similarCases} similar cases` },
  ];
};

/* ------------------------------------------------------------------ *
 * The case's own recommendations, and its audit trail                *
 * ------------------------------------------------------------------ */

export const caseRecommendationsOf = (row: AttendanceCase): CaseRecommendation[] => {
  if (!row.evidence) return [];
  const list: CaseRecommendation[] = [
    {
      id: 'notify_parent',
      title: 'Notify parent',
      band: 'Critical',
      note: `Delivered letter, acknowledged ${addDays(row.openedOn, 1)}`,
      confidence: 96,
      gain: 7,
      modal: 'notify_parent',
    },
    {
      id: 'transport_review',
      title: 'Transport review',
      band: 'High',
      note: `${row.evidence.route} schedule under review`,
      confidence: 91,
      gain: 5,
      modal: 'recovery_plan',
    },
    {
      id: 'parent_meeting',
      title: 'Parent meeting',
      band: 'High',
      note: 'Not yet scheduled',
      confidence: 89,
      gain: 9,
      modal: 'parent_meeting',
    },
    {
      id: 'teacher_followup',
      title: 'Teacher follow-up',
      band: 'Watch',
      note: 'Owner confirmed the cause',
      confidence: 86,
      gain: 4,
      modal: 'assign_teacher',
    },
  ];
  // The panel says "ranked by expected gain", so it is.
  return [...list].sort((a, b) => b.gain - a.gain);
};

/** How the case's history runs, as offsets from the day it opened. */
export const TIMELINE_SHAPE: TimelineShape[] = [
  {
    id: 'declined',
    icon: 'ti ti-trending-down',
    title: 'Attendance Declined',
    offsetDays: 0,
    at: '09:12',
    note: `Present days fell below ${STATUTORY_THRESHOLD}% for the first time this term.`,
    tone: 'is-bad',
  },
  {
    id: 'predicted',
    icon: 'ti ti-sparkles',
    title: 'AI Prediction Generated',
    offsetDays: 0,
    at: '09:15',
    note: '',
    tone: '',
  },
  {
    id: 'assigned',
    icon: 'ti ti-user-star',
    title: 'Teacher Assigned',
    offsetDays: 0,
    at: '11:40',
    note: '',
    tone: '',
  },
  {
    id: 'notified',
    icon: 'ti ti-mail-fast',
    title: 'Parent Notified',
    offsetDays: 1,
    at: '08:05',
    note: 'Predicted-decline letter delivered and acknowledged by the guardian.',
    tone: 'is-warn',
  },
  {
    id: 'recovery',
    icon: 'ti ti-route',
    title: 'Recovery Started',
    offsetDays: 4,
    at: '10:00',
    note: 'Four-week plan opened with a transport review and a weekly checkpoint.',
    tone: '',
  },
  {
    id: 'improved',
    icon: 'ti ti-trending-up',
    title: 'Attendance Improved',
    offsetDays: 28,
    at: '16:30',
    note: '',
    tone: 'is-good',
  },
  {
    id: 'closed',
    icon: 'ti ti-circle-check',
    title: 'Case Closed',
    offsetDays: 41,
    at: '12:00',
    note: 'Three consecutive stable weeks recorded. Case closed with a monitoring flag.',
    tone: 'is-good',
  },
];

/** The case's history, dated from its own opening and marked past or projected. */
export const timelineOf = (row: AttendanceCase) => {
  const now = planNowOf(row);
  return TIMELINE_SHAPE.map((event) => {
    const on = addDays(row.openedOn, event.offsetDays);
    const projected = daysBetween(on, RUN_DATE) < 0;
    let note = event.note;
    if (event.id === 'predicted') {
      note = `Engine predicted ${row.predicted}% by ${PREDICTED_BY} at ${row.confidence}% confidence and opened case ${row.id}.`;
    }
    if (event.id === 'assigned') {
      note = `${row.teacher} accepted ownership and confirmed the transport cause.`;
    }
    if (event.id === 'improved') {
      note = `Attendance recovered to ${now}%, ${now - row.predicted} points above the predicted floor.`;
    }
    return { ...event, on, projected, note };
  });
};

/** The actions the case has written to the record. */
export const completedOf = (row: AttendanceCase) => {
  if (!row.plan) return [];
  return [
    { title: 'Teacher assigned', note: `${row.teacher} · ${row.openedOn}`, done: true },
    {
      title: 'Parent letter delivered',
      note: `Acknowledged · ${addDays(row.openedOn, 1)}`,
      done: true,
    },
    {
      title: 'Transport review raised',
      note: `${row.evidence?.route ?? 'Route'} · ${addDays(row.openedOn, 4)}`,
      done: true,
    },
    { title: 'Recovery plan opened', note: `${row.plan.weeks} weeks · ${row.plan.openedOn}`, done: true },
    { title: 'Parent meeting', note: 'Not yet scheduled', done: false },
    {
      title: `Week ${row.plan.weeks} checkpoint`,
      note: `Due ${planCheckpointOf(row)}`,
      done: false,
    },
  ];
};

/** The case's decision history, dated from the case itself. */
export const decisionsOf = (row: AttendanceCase) =>
  (row.decisions ?? []).map((decision, index) => ({
    ...decision,
    note: decision.done
      ? `${decision.note} · ${addDays(row.openedOn, index === 0 ? 1 : 4)}`
      : decision.note,
  }));

/* ------------------------------------------------------------------ *
 * The queue                                                          *
 * ------------------------------------------------------------------ */

/** The cases, in the page's own stated order: furthest predicted drop first. */
export const attendanceCases: AttendanceCase[] = [...seeded].sort(
  (a, b) => dropOf(b) - dropOf(a) || b.confidence - a.confidence,
);

/** The case the page explains in full. */
export const FEATURED_CASE = attendanceCases.find((row) => row.evidence) ?? attendanceCases[0];

/** How many of the given cases carry each band. */
export const countByBand = (rows: AttendanceCase[], band: AttendanceBand) =>
  rows.filter((row) => bandOf(row.predicted) === band).length;

/* ------------------------------------------------------------------ *
 * The recovery track                                                 *
 * ------------------------------------------------------------------ */

export const RECOVERY_TRACK = [
  { n: '01', label: 'Attendance Risk', count: UNDER_OBSERVATION, note: 'detected' },
  { n: '02', label: 'Teacher Review', count: 52, note: 'reviewed' },
  { n: '03', label: 'Parent Contact', count: 47, note: 'contacted' },
  { n: '04', label: 'Recovery Plan', count: 31, note: 'active' },
  { n: '05', label: 'Weekly Monitoring', count: 24, note: 'tracked' },
  { n: '06', label: 'Attendance Improved', count: 19, note: 'improving' },
  { n: '07', label: 'Case Closed', count: 12, note: 'closed' },
];

/** Where the track has reached this morning. */
export const CURRENT_STATION = '04';

export const stationStateOf = (n: string) =>
  n < CURRENT_STATION ? 'is-done' : n === CURRENT_STATION ? 'is-now' : '';

/** The station the track is waiting at. */
export const WAITING_STATION =
  RECOVERY_TRACK.find((station) => station.n === CURRENT_STATION) ?? RECOVERY_TRACK[3];

/** Cases closed: the last station on the track. */
export const CLOSED_CASES = RECOVERY_TRACK[RECOVERY_TRACK.length - 1].count;

/** A plan opened this soon after detection outperforms a late start. */
export const EARLY_START_DAYS = 5;
export const EARLY_START_ADVANTAGE = 21;
/** Of those waiting, this many were detected before the early-start window. */
export const LATE_STARTS = 11;

/* ------------------------------------------------------------------ *
 * The recommendation center                                          *
 * ------------------------------------------------------------------ */

export interface Recommendation {
  id: string;
  title: string;
  band: AttendanceBand;
  note: string;
  confidence: number;
  /** Attendance points expected across the students it reaches. */
  gain: number;
  /** Students, households or cases it touches. */
  reach: number;
  /** Staff hours it costs, which is what the list is ranked on. */
  staffHours: number;
  timeline: string;
  modal: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'notify_parent',
    title: 'Notify Parent',
    band: 'Critical',
    note: 'Send the predicted-decline letter to {reach} households flagged this morning.',
    confidence: 96,
    gain: 7,
    reach: 14,
    staffHours: 2,
    timeline: 'Today',
    modal: 'notify_parent',
  },
  {
    id: 'parent_meeting',
    title: 'Parent Meeting',
    band: 'Critical',
    note: 'Book a 20 minute call for the {reach} cases where a letter has already gone unanswered.',
    confidence: 93,
    gain: 9,
    reach: 6,
    staffHours: 2.8,
    timeline: 'Within 3 days',
    modal: 'parent_meeting',
  },
  {
    id: 'teacher_followup',
    title: 'Teacher Follow-up',
    band: 'High',
    note: 'Ask the class teacher to confirm the cause for {reach} students showing avoidance signals.',
    confidence: 91,
    gain: 5,
    reach: 11,
    staffHours: 1.8,
    timeline: 'This week',
    modal: 'assign_teacher',
  },
  {
    id: 'recovery_plan',
    title: 'Recovery Plan',
    band: 'High',
    note: `Open a four-week structured plan for the {reach} students below the ${STATUTORY_THRESHOLD}% threshold.`,
    confidence: 90,
    gain: 11,
    reach: 9,
    staffHours: 4.5,
    timeline: '4 weeks',
    modal: 'recovery_plan',
  },
  {
    id: 'transport_review',
    title: 'Transport Review',
    band: 'High',
    note: 'Route 04 accounts for {routeShare}% of late marks in Block B. Send it for a schedule review.',
    confidence: 88,
    gain: 5,
    reach: 5,
    staffHours: 2.5,
    timeline: 'Within 5 days',
    modal: 'recovery_plan',
  },
  {
    id: 'medical_followup',
    title: 'Medical Follow-up',
    band: 'Watch',
    note: '{reach} students filed leave three times above the class median. Refer for a wellbeing check.',
    confidence: 86,
    gain: 3,
    reach: 6,
    staffHours: 2,
    timeline: 'Within 7 days',
    modal: 'recovery_plan',
  },
  {
    id: 'attendance_reward',
    title: 'Attendance Reward',
    band: 'Watch',
    note: 'Recognise the {reach} students who moved from Watch to Good this month.',
    confidence: 84,
    gain: 2,
    reach: 23,
    staffHours: 1.6,
    timeline: 'End of month',
    modal: 'attendance_reward',
  },
  {
    id: 'student_counseling',
    title: 'Student Counseling',
    band: 'Watch',
    note: '{reach} students show an avoidance signature tied to submission days.',
    confidence: 82,
    gain: 6,
    reach: 4,
    staffHours: 5,
    timeline: 'Within 10 days',
    modal: 'assign_teacher',
  },
];

/** Attendance points per hour of staff time — what the list says it ranks on. */
export const gainPerHourOf = (row: Recommendation) => row.gain / row.staffHours;

export const RECOMMENDATIONS = [...recommendations].sort(
  (a, b) => gainPerHourOf(b) - gainPerHourOf(a),
);

const reachOf = (id: string) => recommendations.find((row) => row.id === id)?.reach ?? 0;

/** Households the letter goes to, which is also the count flagged overnight. */
export const NEWLY_FLAGGED = reachOf('notify_parent');
/** Students recognised, which is also the count that improved this month. */
export const IMPROVED_THIS_MONTH = reachOf('attendance_reward');
/** Plans to open, which is also the count sitting below the statutory floor. */
export const CRITICAL_CASES = reachOf('recovery_plan');
/** Cases the route review would lift at once. */
export const ROUTE_CASES = reachOf('transport_review');
/** Households that have not answered a first letter. */
export const UNANSWERED_LETTERS = reachOf('parent_meeting');
/** Students filing leave above the class median. */
export const MEDICAL_REFERRALS = reachOf('medical_followup');
/** Students showing the avoidance signature. */
export const AVOIDANCE_CASES = reachOf('student_counseling');

/** Students the top three recommendations between them would reach. */
export const TOP_THREE_REACH = RECOMMENDATIONS.slice(0, 3).reduce(
  (total, row) => total + row.reach,
  0,
);

/** A recommendation's sentence, with its own figures written in. */
export const recommendationNoteOf = (row: Recommendation, routeShare: number) =>
  row.note.replace('{reach}', String(row.reach)).replace('{routeShare}', String(routeShare));

/* ------------------------------------------------------------------ *
 * What the engine noticed, and where it worked                       *
 * ------------------------------------------------------------------ */

/** Of those newly flagged, the ones sharing a Monday signature. */
export const MONDAY_SIGNATURE = 11;
/** The median gain after a parent contact, and how long it took. */
export const MEDIAN_GAIN = 7;
export const MEDIAN_GAIN_DAYS = 18;
/** Months a chronic absentee has held below the floor. */
export const CHRONIC_MONTHS = 3;
/** Recovery plans opened this year, and the share that reached target. */
export const PLANS_OPENED = 48;
export const PLAN_SUCCESS_RATE = 64;
/** Plans that reached their target figure. */
export const SUCCESSFUL_PLANS = Math.round((PLANS_OPENED * PLAN_SUCCESS_RATE) / 100);
/** Teachers closing their loops inside two days. */
export const FAST_CLOSING_TEACHERS = 6;
export const FAST_CLOSE_HOURS = 48;
/** Students who held the full term, and the class that leads it. */
export const ATTENDANCE_CHAMPIONS = 46;
export const BEST_CLASS = { name: 'VII-A', reading: 97.4 };

/** Patterns that were not visible in the class registers. */
export const HIDDEN_PATTERNS = [
  'assignment-day avoidance',
  'first-day-back absence',
  'a Route 04 late cluster',
];

/** The route the engine keeps returning to. */
export const ROUTE = {
  name: 'Route 04',
  block: 'Block B',
  shareOfLateMarks: routeShareOf(seeded[0].evidence as Evidence),
  shareOfStudents: 19,
};

/* ------------------------------------------------------------------ *
 * The copilot, the resources and the people                          *
 * ------------------------------------------------------------------ */

/** The copilot's six drafts. Everything it writes arrives for review. */
export const COPILOT = [
  {
    icon: 'ti ti-route',
    title: 'Generate Attendance Recovery Plan',
    note: 'A four-week plan with owners, checkpoints and a target figure.',
    modal: 'recovery_plan',
  },
  {
    icon: 'ti ti-mail-fast',
    title: 'Generate Parent Letter',
    note: 'Plain-language letter explaining the prediction and the next step.',
    modal: 'parent_letter',
  },
  {
    icon: 'ti ti-file-text',
    title: 'Generate Weekly Summary',
    note: 'One page for the leadership review, written from this week’s cases.',
    modal: 'export_summary',
  },
  {
    icon: 'ti ti-users-group',
    title: 'Compare Similar Students',
    note: 'Match a case against students who recovered from the same pattern.',
    modal: 'compare_students',
  },
  {
    icon: 'ti ti-bulb',
    title: 'Explain Prediction',
    note: 'Walk the full signal chain behind any predicted attendance figure.',
    modal: 'explain_prediction',
  },
  {
    icon: 'ti ti-download',
    title: 'Export AI Insights',
    note: 'Send the current queue and reasoning to CSV, XLSX or PDF.',
    modal: 'export_summary',
  },
];

/** The six things the workspace's Recover stage can start. */
export const RECOVER_ACTIONS = [
  {
    icon: 'ti ti-mail-fast',
    title: 'Notify Parent',
    note: 'Send the predicted-decline letter',
    modal: 'notify_parent',
  },
  {
    icon: 'ti ti-user-star',
    title: 'Assign Teacher',
    note: 'Hand ownership to a class teacher',
    modal: 'assign_teacher',
  },
  {
    icon: 'ti ti-route',
    title: 'Recovery Plan',
    note: 'Open a structured four-week plan',
    modal: 'recovery_plan',
  },
  {
    icon: 'ti ti-heart-handshake',
    title: 'Counseling',
    note: 'Refer for a wellbeing conversation',
    modal: 'assign_teacher',
  },
  {
    icon: 'ti ti-bus',
    title: 'Transport Review',
    note: 'Send the route for a schedule review',
    modal: 'recovery_plan',
  },
  {
    icon: 'ti ti-stethoscope',
    title: 'Medical Review',
    note: 'Refer to the school nurse',
    modal: 'recovery_plan',
  },
];

export const RESOURCES = [
  { icon: 'ti ti-template', title: 'Attendance Templates', note: '18 letters and call scripts' },
  {
    icon: 'ti ti-route',
    title: 'Recovery Plans',
    note: `${CRITICAL_CASES} structured four-week plans`,
  },
  { icon: 'ti ti-adjustments', title: 'Smart Rules', note: '24 thresholds and triggers' },
  { icon: 'ti ti-sparkles', title: 'AI Recommendations', note: 'How suggestions are ranked' },
  { icon: 'ti ti-book', title: 'AI Documentation', note: 'Signals, weights and limits' },
  { icon: 'ti ti-settings', title: 'AI Settings', note: 'Schedule, scope and confidence floor' },
];

/** Teachers who can take a case, with the load they already carry. */
export const TEACHER_LOAD = [
  { name: 'Teena Mathew', open: 3 },
  { name: 'Meera Joshi', open: 5 },
  { name: 'Daniel Josua', open: 4 },
  { name: 'Leela Nambiar', open: 2 },
];

/** The lightest caseload, which is who the assign dialog proposes. */
export const LIGHTEST_LOAD = [...TEACHER_LOAD].sort((a, b) => a.open - b.open)[0];

/** The dates the dialogs propose, all of them offsets from the register clock. */
export const REVIEW_BY = addDays(RUN_DATE, 4);
export const MEETING_ON = addDays(RUN_DATE, 4);
export const AWARD_ON = addDays(RUN_DATE, 6);
export const RESPONSE_DUE = addDays(RUN_DATE, 11);
