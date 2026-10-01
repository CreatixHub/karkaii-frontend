import { addDays } from '../../data/dates';
import { LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE };

const mean = (values: number[]) =>
  values.length ? Math.round(values.reduce((total, value) => total + value, 0) / values.length) : 0;

/* ------------------------------------------------------------------ *
 * The draft                                                          *
 * ------------------------------------------------------------------ */

export const OPTIMIZATION_ID = 'OPT-0417';

/** What the engine evaluated. */
export const PERIOD_ASSIGNMENTS = 1240;
export const CLASSES_IN_SCOPE = 18;
export const TEACHERS = 14;
export const ROOMS = 12;
export const LABS = 2;

/** The shape of a teaching week. */
export const PERIODS_PER_DAY = 8;
export const TEACHING_DAYS = 5;

/** The policy ceiling a timetable is measured against. */
export const PERIOD_CEILING = 26;

/** The engine's confidence in this pass. */
export const OPTIMIZATION_CONFIDENCE = 94;

/** Periods the plan moves, of everything in scope. */
export const PERIODS_MOVED = 18;
export const ROOMS_REASSIGNED = 6;
export const TEACHER_REASSIGNMENTS = 3;

/** The terms the picker offers. */
export const TERMS = ['Term 2 · 2026', 'Term 3 · 2026', 'Next academic year'];

/* ------------------------------------------------------------------ *
 * The six dimensions                                                 *
 * ------------------------------------------------------------------ */

export interface Dimension {
  id: string;
  title: string;
  verdict: string;
  finding: string;
  suggestion: string;
  impact: string;
  /** Where it stands, and where the plan takes it. */
  current: number;
  optimized: number;
  confidence: number;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: 'workload',
    title: 'Teacher Workload Balance',
    verdict: 'Unbalanced',
    finding:
      'Four teachers carry 28 or more periods while six carry fewer than 18. The spread is twice what the staffing policy allows.',
    suggestion: 'Move three periods from Meera Joshi and Daniel Josua to the two lightest timetables.',
    impact: 'balance points',
    current: 61,
    optimized: 88,
    confidence: 96,
  },
  {
    id: 'rooms',
    title: 'Room Utilization',
    verdict: 'Uneven',
    finding:
      'Rooms 204 and 207 sit empty for 22 of 40 periods while the two science labs run at capacity every day.',
    suggestion: 'Relocate four theory sessions out of the labs into the two underused rooms.',
    impact: 'utilization',
    current: 58,
    optimized: 84,
    confidence: 93,
  },
  {
    id: 'quality',
    title: 'Schedule Quality',
    verdict: 'Good, with gaps',
    finding:
      'Overall quality is sound. The losses are concentrated in seven conflicts rather than spread across the week.',
    suggestion: 'Resolve the two critical clashes first; the remaining five are low-cost swaps.',
    impact: 'quality score',
    current: 82,
    optimized: 94,
    confidence: 94,
  },
  {
    id: 'distribution',
    title: 'Subject Distribution',
    verdict: 'Front-loaded',
    finding:
      'Mathematics and physics fall in consecutive morning blocks for four of five classes, against the cognitive-load guidance.',
    suggestion: 'Rotate one of the two into an afternoon slot for Classes VII and VIII.',
    impact: 'distribution',
    current: 54,
    optimized: 81,
    confidence: 91,
  },
  {
    id: 'gaps',
    title: 'Student Schedule Balance',
    verdict: 'Gap-heavy',
    finding:
      'Class IX-C carries three free periods on Wednesday, two of them consecutive and neither usable for supervised study.',
    suggestion: 'Merge the two consecutive gaps by pulling the afternoon language period forward.',
    impact: 'balance',
    current: 67,
    optimized: 89,
    confidence: 89,
  },
  {
    id: 'resources',
    title: 'Resource Allocation',
    verdict: 'Concentrated',
    finding:
      'Both science laboratories run at capacity while the music room is unused every afternoon after period five.',
    suggestion: 'Move the two non-practical sessions out of the labs and open the music room for study.',
    impact: 'allocation',
    current: 63,
    optimized: 86,
    confidence: 90,
  },
];

/** The gain a dimension carries. */
export const gainOf = (row: Dimension) => row.optimized - row.current;

/**
 * Schedule health is the Schedule Quality dimension — the page prints it in
 * five places and it is one reading, not an average of the six.
 */
export const QUALITY = DIMENSIONS.find((row) => row.id === 'quality') as Dimension;

export const SCHEDULE_HEALTH = QUALITY.current;
export const OPTIMIZED_HEALTH = QUALITY.optimized;
export const HEALTH_GAIN = gainOf(QUALITY);

/** The mean across every dimension, which is a different and lower figure. */
export const DIMENSION_MEAN = mean(DIMENSIONS.map((row) => row.current));

/* ------------------------------------------------------------------ *
 * The conflicts                                                      *
 * ------------------------------------------------------------------ */

export type Severity = 'Critical' | 'High' | 'Medium';

export interface Conflict {
  id: string;
  /** The two things that collide, and where. */
  subject: string;
  where: string;
  against: string;
  kind: string;
  severity: Severity;
  owner: string;
  ownerLabel: string;
  /** The shared resource the clash is over — what the headline counts. */
  resource: string;
  /** Where it sits in the week, when it sits anywhere. */
  day?: number;
  period?: number;
  resolution: string;
  gain: number;
  confidence: number;
}

export const CONFLICTS: Conflict[] = [
  {
    id: 'room-204',
    subject: 'Room 204',
    where: 'Tue · P5',
    against: 'Class VII-B & VIII-A',
    kind: 'Room double-booking',
    severity: 'Critical',
    owner: 'Meera Joshi',
    ownerLabel: 'Teacher',
    resource: 'Room 204',
    day: 1,
    period: 4,
    resolution: 'Move Class VIII-A to Room 207, free in the same slot and on the same corridor.',
    gain: 9,
    confidence: 96,
  },
  {
    id: 'lab-2',
    subject: 'Lab 2',
    where: 'Thu · P3',
    against: 'Class IX-A & IX-C',
    kind: 'Laboratory clash',
    severity: 'Critical',
    owner: 'Daniel Josua',
    ownerLabel: 'Teacher',
    resource: 'Lab 2',
    day: 3,
    period: 2,
    resolution: 'Move the physics practical to Lab 1; chemistry must keep the fume extraction.',
    gain: 8,
    confidence: 94,
  },
  {
    id: 'overload',
    subject: 'Meera Joshi',
    where: '31 periods',
    against: 'Excess 5 periods',
    kind: 'Teacher overload',
    severity: 'High',
    owner: `Limit ${PERIOD_CEILING} periods`,
    ownerLabel: 'Policy',
    resource: 'Room 204',
    resolution: 'Reassign the Thursday and Friday language blocks to Rakesh Sharma.',
    gain: 7,
    confidence: 96,
  },
  {
    id: 'analytical',
    subject: 'Maths → Physics',
    where: 'Mon · P1–P2',
    against: 'Repeats twice weekly',
    kind: 'Consecutive analytical blocks',
    severity: 'High',
    owner: 'Classes VII-A, VII-B',
    ownerLabel: 'Classes',
    resource: 'Room 204',
    day: 0,
    period: 0,
    resolution: 'Rotate physics to the Monday afternoon slot and bring art forward.',
    gain: 6,
    confidence: 92,
  },
  {
    id: 'dining',
    subject: 'Dining hall',
    where: '12:10 & 12:50',
    against: 'Demand 380 students',
    kind: 'Dining hall overlap',
    severity: 'High',
    owner: 'Capacity 240 seats',
    ownerLabel: 'Capacity',
    resource: 'Lab 2',
    resolution: 'Stagger the middle-school break to 12:30 for a third sitting.',
    gain: 5,
    confidence: 90,
  },
  {
    id: 'gap-cluster',
    subject: 'Class IX-C',
    where: 'Wed · P4–P6',
    against: 'Consecutive 2',
    kind: 'Student gap cluster',
    severity: 'Medium',
    owner: 'Free periods 3 in a day',
    ownerLabel: 'Load',
    resource: 'Room 204',
    resolution: 'Pull the afternoon language period forward to merge the two gaps.',
    gain: 4,
    confidence: 89,
  },
  {
    id: 'travel',
    subject: 'Corridor transitions',
    where: 'Daily',
    against: '6 teachers affected',
    kind: 'Teacher travel time',
    severity: 'Medium',
    owner: 'Between blocks A and C',
    ownerLabel: 'Route',
    resource: 'Lab 2',
    resolution: 'Group each affected teacher into one corridor where the syllabus allows.',
    gain: 3,
    confidence: 88,
  },
];

/** How a severity is chipped. */
export const severityToneOf = (severity: Severity) =>
  severity === 'Critical' ? 'is-crit' : severity === 'High' ? 'is-warn' : 'is-info';

/** Conflicts that stop the timetable being published. */
export const BLOCKING = CONFLICTS.filter((row) => row.severity === 'Critical');

/** The distinct resources the conflicts collide over. */
export const CONFLICT_RESOURCES = [...new Set(CONFLICTS.map((row) => row.resource))];

/** The headline: how few resources account for how many clashes. */
export const RESOURCE_HEADLINE = `${CONFLICT_RESOURCES.length} rooms account for all ${CONFLICTS.length} conflicts`;

/** Total health the conflict list is holding back. */
export const CONFLICT_GAIN = CONFLICTS.reduce((total, row) => total + row.gain, 0);

/* ------------------------------------------------------------------ *
 * The week grid                                                      *
 * ------------------------------------------------------------------ */

/** How the week reads, one cell per period. */
export const WEEK_SHAPE = [
  'g,g,f,f,g,x,f,f',
  'f,g,g,f,f,f,w,g',
  'g,f,x,g,g,f,f,o',
  'f,f,g,w,f,g,g,f',
  'g,g,f,f,x,f,o,f',
];

/**
 * The week's cells, with the conflicts marked from the register rather than by
 * hand — so a resolved clash clears its cell.
 */
export const weekCells = () => {
  const clashes = new Set(
    CONFLICTS.filter((row) => row.day !== undefined && row.period !== undefined).map(
      (row) => `${row.day}-${row.period}`,
    ),
  );
  return WEEK_SHAPE.flatMap((day, dayIndex) =>
    day.split(',').map((state, periodIndex) => ({
      key: `${dayIndex}-${periodIndex}`,
      state: clashes.has(`${dayIndex}-${periodIndex}`) ? 'x' : state === 'x' ? 'g' : state,
    })),
  );
};

/** Cells the grid marks as a clash. */
export const gridClashes = () => weekCells().filter((cell) => cell.state === 'x').length;

export const GRID_LEGEND = [
  { state: 'f', label: 'Light load' },
  { state: 'g', label: 'Full' },
  { state: 'x', label: 'Conflict' },
  { state: 'o', label: 'Optimized' },
];

/* ------------------------------------------------------------------ *
 * The explainable findings                                           *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  tone: 'is-crit' | 'is-warn' | 'is-info';
  title: string;
  label: string;
  confidence: number;
  why: string;
  evidence: { label: string; value: string }[];
  before: { label: string; value: string }[];
  fix: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'overload',
    icon: 'ti ti-user-exclamation',
    tone: 'is-crit',
    title: 'Teacher overloaded',
    label: 'Critical',
    confidence: 96,
    why: `Meera Joshi is assigned 31 periods against a policy ceiling of ${PERIOD_CEILING}. Five of those fall in consecutive afternoon blocks, which is where marking quality drops most sharply in the department review.`,
    evidence: [
      { label: 'Periods assigned', value: '31' },
      { label: 'Policy ceiling', value: String(PERIOD_CEILING) },
      { label: 'Consecutive afternoons', value: '5' },
      { label: 'Teachers under 18 periods', value: '6' },
    ],
    before: [
      { label: 'Meera Joshi', value: '31 → 26' },
      { label: 'Rakesh Sharma', value: '17 → 22' },
      { label: 'Balance score', value: '61 → 88' },
    ],
    fix: 'Reassign the Thursday and Friday afternoon language blocks to Rakesh Sharma, who has capacity on both days and teaches the same syllabus.',
  },
  {
    id: 'room',
    icon: 'ti ti-alert-octagon',
    tone: 'is-crit',
    title: 'Room conflict detected',
    label: 'Critical',
    confidence: 95,
    why: 'Room 204 is double-booked on Tuesday period 5. Class VII-B and Class VIII-A are both assigned there, and neither has an alternative room recorded for that slot.',
    evidence: [
      { label: 'Slot', value: 'Tue · P5' },
      { label: 'Classes assigned', value: '2' },
      { label: 'Alternatives recorded', value: 'None' },
      { label: 'Room 207 that slot', value: 'Free' },
    ],
    before: [
      { label: 'Class VII-B', value: 'Room 204' },
      { label: 'Class VIII-A', value: '204 → 207' },
      { label: 'Conflicts', value: '7 → 6' },
    ],
    fix: 'Move Class VIII-A to Room 207, which is free in that slot, sits on the same corridor and seats the full class.',
  },
  {
    id: 'analytical',
    icon: 'ti ti-brain',
    tone: 'is-warn',
    title: 'Consecutive difficult subjects',
    label: 'High',
    confidence: 92,
    why: 'Four of five classes have mathematics immediately followed by physics on Monday and Wednesday mornings. Assessment scores in the second of two consecutive analytical subjects sit measurably below the same subject taught after a break.',
    evidence: [
      { label: 'Classes affected', value: '4 of 5' },
      { label: 'Days it repeats', value: 'Mon, Wed' },
      { label: 'Guidance', value: 'One per morning' },
      { label: 'Score gap in the second', value: 'Measurable' },
    ],
    before: [
      { label: 'Mon P2', value: 'Physics → Art' },
      { label: 'Mon P6', value: 'Art → Physics' },
      { label: 'Distribution', value: '54 → 81' },
    ],
    fix: 'Exchange Monday period 2 physics with period 6 art for Classes VII-A and VII-B, breaking the pairing without moving anything else.',
  },
  {
    id: 'underused',
    icon: 'ti ti-building-warehouse',
    tone: 'is-info',
    title: 'Classroom underutilized',
    label: 'Medium',
    confidence: 89,
    why: 'Rooms 204 and 207 are unoccupied for 22 of 40 periods while the two science laboratories run at capacity. Four sessions currently held in the labs require no laboratory equipment.',
    evidence: [
      { label: 'Idle periods', value: '22 of 40' },
      { label: 'Labs at capacity', value: 'Both' },
      { label: 'Sessions needing no lab', value: '4' },
      { label: 'Music room afternoons', value: 'Unused' },
    ],
    before: [
      { label: 'Room utilization', value: '58 → 84' },
      { label: 'Lab pressure', value: 'High → Normal' },
      { label: 'Sessions relocated', value: '4' },
    ],
    fix: 'Relocate the four theory sessions out of the laboratories into Rooms 204 and 207.',
  },
  {
    id: 'lab',
    icon: 'ti ti-flask',
    tone: 'is-crit',
    title: 'Laboratory clash',
    label: 'Critical',
    confidence: 94,
    why: 'Physics and chemistry practicals are both scheduled in Lab 2 on Thursday period 3. The chemistry group requires fume extraction, which Lab 1 does not have, so the physics group is the one that must move.',
    evidence: [
      { label: 'Slot', value: 'Thu · P3' },
      { label: 'Groups assigned', value: '2' },
      { label: 'Fume extraction', value: 'Lab 2 only' },
      { label: 'Lab 1 that slot', value: 'Free' },
    ],
    before: [
      { label: 'Chemistry', value: 'Lab 2 · stays' },
      { label: 'Physics', value: 'Lab 2 → Lab 1' },
      { label: 'Blocking conflicts', value: '2 → 1' },
    ],
    fix: 'Move the Thursday period 3 physics practical to Lab 1 and leave chemistry where the extraction is.',
  },
  {
    id: 'dining',
    icon: 'ti ti-tools-kitchen-2',
    tone: 'is-warn',
    title: 'Lunch gap imbalance',
    label: 'High',
    confidence: 90,
    why: 'Junior classes break at 12:10 and senior classes at 12:50, but the dining hall seats 240 against a peak demand of 380. The overlap creates a 20 minute queue three days a week.',
    evidence: [
      { label: 'Seats', value: '240' },
      { label: 'Peak demand', value: '380' },
      { label: 'Queue', value: '20 minutes' },
      { label: 'Days affected', value: '3' },
    ],
    before: [
      { label: 'Sittings', value: '2 → 3' },
      { label: 'Peak demand', value: '380 → 190' },
      { label: 'Queue', value: '20 min → 5 min' },
    ],
    fix: 'Move the middle-school break to 12:30, creating a third sitting and splitting demand across the hour.',
  },
];

/* ------------------------------------------------------------------ *
 * The opportunities                                                  *
 * ------------------------------------------------------------------ */

export interface Opportunity {
  id: string;
  icon: string;
  title: string;
  note: string;
  gain: number;
  unit: string;
  /** Periods that have to move to get it. */
  effort: number;
}

const opportunities: Opportunity[] = [
  { id: 'balance', icon: 'ti ti-scale-outline', title: 'Balance Teacher Load', note: 'Move 3 periods from the two heaviest timetables', gain: 27, unit: 'balance', effort: 3 },
  { id: 'rooms', icon: 'ti ti-building', title: 'Optimize Classroom Usage', note: 'Relocate 4 theory sessions out of the science labs', gain: 26, unit: 'usage', effort: 4 },
  { id: 'gaps', icon: 'ti ti-layout-rows', title: 'Reduce Student Gaps', note: 'Merge 6 consecutive free periods across 3 classes', gain: 22, unit: 'balance', effort: 6 },
  { id: 'labs', icon: 'ti ti-flask', title: 'Improve Lab Scheduling', note: 'Split the Thursday double booking across both labs', gain: 18, unit: 'lab use', effort: 2 },
  { id: 'merge', icon: 'ti ti-arrows-join', title: 'Merge Free Periods', note: 'Combine 9 isolated gaps into supervised study blocks', gain: 15, unit: 'usable time', effort: 9 },
  { id: 'travel', icon: 'ti ti-walk', title: 'Reduce Teacher Travel', note: 'Group each teacher into one corridor where possible', gain: 12, unit: 'transitions', effort: 5 },
  { id: 'rotation', icon: 'ti ti-rotate', title: 'Improve Subject Rotation', note: 'Break the maths-then-physics pairing for 4 classes', gain: 11, unit: 'distribution', effort: 4 },
  { id: 'sports', icon: 'ti ti-ball-football', title: 'Optimize Sports Schedule', note: 'Shift Friday sports one period earlier', gain: 7, unit: 'ground use', effort: 1 },
];

/** Points returned per period moved — how the list orders itself. */
export const yieldOf = (row: Opportunity) => row.gain / row.effort;

export const OPPORTUNITIES = [...opportunities].sort((a, b) => b.gain - a.gain);

/** The same list, ranked by what each returns for the disruption it causes. */
export const BY_YIELD = [...opportunities].sort((a, b) => yieldOf(b) - yieldOf(a));

/* ------------------------------------------------------------------ *
 * The intelligence, the copilot and the resources                    *
 * ------------------------------------------------------------------ */

export const INTELLIGENCE = [
  {
    id: 'best',
    title: 'Best Performing Timetable',
    text: 'Class VI-A scores 94 on schedule quality. Its pattern of one analytical subject per morning is worth copying across the year group.',
  },
  {
    id: 'allocation',
    title: 'Most Efficient Teacher Allocation',
    text: 'Leela Nambiar teaches 24 periods across two corridors with no gaps. Hers is the allocation the optimizer treats as the reference.',
  },
  {
    id: 'unused',
    title: 'Unused Resources',
    text: 'Rooms 204 and 207 sit idle for 22 of 40 periods. The music room is unused every afternoon after period 5.',
  },
  {
    id: 'peak',
    title: 'Peak Classroom Usage',
    text: 'Tuesday and Thursday periods 3 to 5 run at 96% occupancy. Every remaining clash sits inside that window.',
  },
  {
    id: 'distribution',
    title: 'Subject Distribution Analysis',
    text: 'Analytical subjects cluster in mornings for four of five classes, against the guidance of one per morning block.',
  },
  {
    id: 'availability',
    title: 'Teacher Availability Insights',
    text: 'Six teachers have three or more free periods on Friday afternoon, the single largest pool of unused capacity in the week.',
  },
  {
    id: 'hidden',
    title: 'Hidden Scheduling Patterns',
    text: `Every conflict this term involves either ${CONFLICT_RESOURCES.join(' or ')}. No other room appears in the list even once.`,
  },
];

export const COPILOT = [
  { key: 'G', title: 'Generate New Timetable', note: 'Builds a full week from constraints, not from the current draft', modal: 'generate_timetable' },
  { key: 'O', title: 'Optimize Current Schedule', note: 'Keeps the existing shape and resolves conflicts in place', modal: 'run_optimization' },
  { key: 'C', title: 'Compare Timetables', note: 'Sets the current draft against the optimized alternative', modal: 'export_timetable' },
  { key: 'R', title: 'Generate Conflict Report', note: 'Every clash with its cause, owner and proposed fix', modal: 'optimization_report' },
  { key: 'W', title: 'Generate Teacher Workload Summary', note: 'Periods, gaps and corridor transitions for every teacher', modal: 'optimization_report' },
  { key: 'U', title: 'Generate Classroom Utilization Report', note: 'Room-by-room occupancy across all forty periods', modal: 'optimization_report' },
  { key: 'S', title: 'Generate Optimization Summary', note: 'One page on what changed, why, and what it gained', modal: 'optimization_report' },
];

export interface Resource {
  id: string;
  name: string;
  scale: string;
  note: string;
  /** Load across the eight periods, 0 free to 3 over capacity. */
  load: number[];
}

export const RESOURCES: Resource[] = [
  { id: 'teachers', name: 'Teacher Availability', scale: `${TEACHERS} teaching staff`, note: '6 free periods Friday', load: [2, 2, 3, 3, 2, 1, 1, 0] },
  { id: 'rooms', name: 'Room Availability', scale: `${ROOMS} classrooms`, note: '22 idle periods', load: [2, 3, 3, 2, 2, 1, 0, 0] },
  { id: 'labs', name: 'Laboratory Usage', scale: `${LABS} science labs`, note: 'At capacity, 2 clashes', load: [2, 3, 3, 3, 3, 2, 1, 1] },
  { id: 'ground', name: 'Sports Ground Allocation', scale: '1 main ground', note: 'Friday PM available', load: [1, 1, 2, 2, 2, 2, 1, 0] },
  { id: 'transport', name: 'Transport Timing', scale: '9 routes', note: 'Aligned to both bells', load: [3, 0, 0, 0, 0, 0, 0, 3] },
  { id: 'exams', name: 'Exam Scheduling', scale: 'Term exams, 6 weeks out', note: 'Hall free mornings', load: [0, 0, 1, 2, 2, 2, 1, 1] },
  { id: 'holidays', name: 'Holiday Impact', scale: '3 closures this term', note: '4 periods to redistribute', load: [1, 1, 1, 1, 1, 1, 1, 1] },
];

export const LOAD_LEGEND = [
  { level: 0, label: 'Free' },
  { level: 1, label: 'Light' },
  { level: 2, label: 'Busy' },
  { level: 3, label: 'Over capacity' },
];

/* ------------------------------------------------------------------ *
 * The recommendations                                                *
 * ------------------------------------------------------------------ */

export interface Recommendation {
  id: string;
  title: string;
  note: string;
  confidence: number;
  benefit: string;
  /** Health points it returns. */
  gain: number;
  /** Periods it moves to get them. */
  effort: number;
  timeline: string;
  modal: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'assign-teacher',
    title: 'Assign Alternate Teacher',
    note: 'Reassign the Thursday and Friday afternoon language blocks from Meera Joshi to Rakesh Sharma, who has capacity on both days and already teaches the same syllabus.',
    confidence: 96,
    benefit: '+27 balance',
    gain: 27,
    effort: 2,
    timeline: 'Immediate',
    modal: 'assign_teacher',
  },
  {
    id: 'move-lab',
    title: 'Move Physics Lab',
    note: 'Relocate the Thursday period 3 physics practical from Lab 2 to Lab 1. Chemistry must keep Lab 2 for its fume extraction.',
    confidence: 94,
    benefit: '+8 health',
    gain: 8,
    effort: 1,
    timeline: 'Immediate',
    modal: 'resolve_conflict',
  },
  {
    id: 'lunch',
    title: 'Shift Lunch Break',
    note: 'Move the middle-school break to 12:30, creating a third sitting and splitting peak dining demand across the hour.',
    confidence: 90,
    benefit: '15 min returned',
    gain: 5,
    effort: 1,
    timeline: 'Next week',
    modal: 'resolve_conflict',
  },
  {
    id: 'swap',
    title: 'Swap Periods',
    note: 'Exchange Monday period 2 physics with period 6 art for Classes VII-A and VII-B, breaking the consecutive analytical pairing.',
    confidence: 92,
    benefit: '+11 distribution',
    gain: 11,
    effort: 4,
    timeline: 'Next week',
    modal: 'resolve_conflict',
  },
  {
    id: 'merge',
    title: 'Merge Sessions',
    note: 'Combine the two consecutive Wednesday gaps in Class IX-C into one supervised study block by pulling the language period forward.',
    confidence: 89,
    benefit: '+22 balance',
    gain: 22,
    effort: 9,
    timeline: 'Two weeks',
    modal: 'allocate_classroom',
  },
];

/** Health returned per period moved. */
export const recYieldOf = (row: Recommendation) => row.gain / row.effort;

export const RECOMMENDATIONS = [...recommendations].sort(
  (a, b) => recYieldOf(b) - recYieldOf(a),
);

export const PRIORITY_BANDS = [
  { upTo: 2, band: 'Critical', tone: 'is-crit' },
  { upTo: 4, band: 'High', tone: 'is-warn' },
  { upTo: Infinity, band: 'Normal', tone: 'is-info' },
];

export const priorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/* ------------------------------------------------------------------ *
 * The timeline                                                       *
 * ------------------------------------------------------------------ */

export interface Stop {
  id: string;
  title: string;
  icon: string;
  /** Days after the draft was created, or null when it has not happened. */
  offsetDays: number | null;
  note: string;
}

/** The day the term's draft was built. */
export const DRAFT_CREATED = '02 Jul 2026';

export const TIMELINE: Stop[] = [
  { id: 'created', title: 'Schedule Created', icon: 'ti ti-file-plus', offsetDays: 0, note: 'Draft built from last term with staffing changes applied.' },
  { id: 'detected', title: 'Conflict Detected', icon: 'ti ti-alert-triangle', offsetDays: 2, note: `${CONFLICTS.length} conflicts surfaced, ${BLOCKING.length} of them critical room clashes.` },
  { id: 'optimized', title: 'AI Optimization Started', icon: 'ti ti-sparkles', offsetDays: 4, note: `Engine evaluated ${PERIOD_ASSIGNMENTS.toLocaleString('en-US')} assignments against every constraint.` },
  { id: 'review', title: 'Teacher Review', icon: 'ti ti-users', offsetDays: 29, note: 'Nine of fourteen teachers have signed off on their changes.' },
  { id: 'approval', title: 'Principal Approval', icon: 'ti ti-stamp', offsetDays: null, note: 'Awaiting the final workload summary before sign-off.' },
  { id: 'published', title: 'Timetable Published', icon: 'ti ti-send', offsetDays: null, note: 'Publishes to portals, notice boards and parent accounts.' },
  { id: 'complete', title: 'Optimization Complete', icon: 'ti ti-circle-check', offsetDays: null, note: 'Version archived and the next review scheduled.' },
];

/** The timeline, dated from the day the draft was built. */
export const timelineStops = () =>
  TIMELINE.map((stop) => ({
    ...stop,
    on: stop.offsetDays === null ? 'Pending' : addDays(DRAFT_CREATED, stop.offsetDays),
    done: stop.offsetDays !== null,
  }));

/** The versions the draft has been through. */
export const VERSIONS = [
  { id: 'v1.0', on: '02 Jul', note: 'Initial draft', health: 70, conflicts: 14 },
  { id: 'v1.1', on: '04 Jul', note: 'Conflicts logged', health: 72, conflicts: 12 },
  { id: 'v1.2', on: '06 Jul', note: 'AI pass one', health: 74, conflicts: 11 },
  { id: 'v1.3', on: '22 Jul', note: 'Staffing update', health: 76, conflicts: 11 },
  { id: 'v1.4', on: '31 Jul', note: 'Current draft', health: SCHEDULE_HEALTH, conflicts: CONFLICTS.length },
];

/** Where the plan would take it. */
export const PROPOSED_VERSION = {
  id: 'v2.0',
  note: 'Proposed',
  health: OPTIMIZED_HEALTH,
  conflicts: 0,
};

/** Teacher sign-off. */
export const SIGNED_OFF = 9;
export const QUERIED = 2;

/** The dates the dialogs propose, offset from the register clock. */
export const EFFECTIVE_FROM = addDays(RUN_DATE, 9);
export const APPROVAL_TARGET = addDays(RUN_DATE, 4);
