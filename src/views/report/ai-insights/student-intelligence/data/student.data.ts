import { addDays, daysBetween } from '../../data/dates';
import { LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE };

const round = (value: number) => Math.round(value);

/* ------------------------------------------------------------------ *
 * The student                                                        *
 * ------------------------------------------------------------------ */

export const STUDENT = {
  id: 'STU-2078',
  name: 'Sophia Reyes',
  image: 'assets/img/students/student-03.jpg',
  className: 'VIII-A',
  roll: 14,
  house: 'Emerald',
  teacher: 'Leela Nambiar',
  guardian: 'Mr. & Mrs. Reyes',
  admittedOn: '12 Apr 2023',
  admittedInto: 'Class VI-A',
};

/** The engine's overall reading of the student, out of a hundred. */
export const INTELLIGENCE_SCORE = 86;
/** How far it moved this term. */
export const SCORE_CHANGE = 7;
/** The engine's confidence in this profile. */
export const PROFILE_CONFIDENCE = 93;

/** Segments in the hero's score column. */
export const SCORE_SEGMENTS = 20;

/** The score column: one lit segment per twentieth of the score. */
export const scoreColumn = () => {
  const lit = round((INTELLIGENCE_SCORE / 100) * SCORE_SEGMENTS);
  return Array.from({ length: SCORE_SEGMENTS }, (_, index) => (index < lit ? 'on' : ''));
};

/** The academic-health words that go with the score. */
export const HEALTH_SCALE = [
  { floor: 85, label: 'Good' },
  { floor: 70, label: 'Fair' },
  { floor: 55, label: 'Watch' },
  { floor: 0, label: 'Concern' },
];

export const healthLabelOf = (score: number) =>
  (HEALTH_SCALE.find((band) => score >= band.floor) ?? HEALTH_SCALE[HEALTH_SCALE.length - 1]).label;

/* ------------------------------------------------------------------ *
 * Standing over six terms                                            *
 * ------------------------------------------------------------------ */

/** Overall percentile at the close of each term, oldest first. */
export const PERCENTILES = [62, 65, 71, 73, 74, 78];

export const FIRST_PERCENTILE = PERCENTILES[0];
export const CURRENT_PERCENTILE = PERCENTILES[PERCENTILES.length - 1];
export const TERMS_ON_RECORD = PERCENTILES.length;

/** The movement the hero, the workspace and the growth story all quote. */
export const PERCENTILE_GROWTH = CURRENT_PERCENTILE - FIRST_PERCENTILE;

/** Where she is projected to land next term. */
export const TARGET_PERCENTILE = 82;

/** The term a threshold was first crossed, or null if it never was. */
export const crossedAt = (threshold: number) => {
  const index = PERCENTILES.findIndex((value) => value > threshold);
  return index === -1 ? null : index + 1;
};

/** Ordinal suffix, for "the 78th percentile". */
export const ordinal = (value: number) => {
  const tens = value % 100;
  if (tens >= 11 && tens <= 13) return `${value}th`;
  return `${value}${['th', 'st', 'nd', 'rd'][value % 10] ?? 'th'}`;
};

/* ------------------------------------------------------------------ *
 * Attendance and assignments                                         *
 * ------------------------------------------------------------------ */

export const ATTENDANCE = {
  now: 96,
  dipTo: 74,
  dipWeeks: 6,
  dipFrom: '19 Jun 2026',
  route: 'Route 04',
  correctedOn: '22 Jun 2026',
  recoveredOn: '29 Jul 2026',
};

/** Whole weeks between the route correction and the register clock. */
export const CLEAR_WEEKS = Math.round(daysBetween(ATTENDANCE.correctedOn, RUN_DATE) / 7);

export const ASSIGNMENTS = {
  onTimePct: 94,
  earlyThisTerm: 12,
  late: 4,
  lateSubject: 'algebra',
  missed: 0,
  quality: 'Band A–B',
};

/* ------------------------------------------------------------------ *
 * The subjects                                                       *
 * ------------------------------------------------------------------ */

/** The letter band a mark falls in. */
export const BAND_SCALE = [
  { floor: 85, band: 'A' },
  { floor: 70, band: 'B' },
  { floor: 55, band: 'C' },
  { floor: 0, band: 'D' },
];

export const bandOf = (mark: number) =>
  (BAND_SCALE.find((entry) => mark >= entry.floor) ?? BAND_SCALE[BAND_SCALE.length - 1]).band;

export interface Subject {
  id: string;
  label: string;
  mark: number;
  improving: boolean;
}

export const SUBJECTS: Subject[] = [
  { id: 'reading', label: 'Reading & comprehension', mark: 91, improving: true },
  { id: 'science', label: 'Science', mark: 88, improving: true },
  { id: 'languages', label: 'Languages', mark: 79, improving: true },
  { id: 'social', label: 'Social studies', mark: 76, improving: true },
  { id: 'maths-words', label: 'Mathematics · word problems', mark: 82, improving: true },
  { id: 'maths-symbolic', label: 'Mathematics · symbolic algebra', mark: 41, improving: false },
];

/** The two marks the algebra finding turns on. */
export const WORD_PROBLEM_MARK =
  SUBJECTS.find((subject) => subject.id === 'maths-words')?.mark ?? 0;
export const SYMBOLIC_MARK =
  SUBJECTS.find((subject) => subject.id === 'maths-symbolic')?.mark ?? 0;

export const SUBJECTS_IMPROVING = SUBJECTS.filter((subject) => subject.improving).length;

/* ------------------------------------------------------------------ *
 * The digital twin: ten dimensions                                   *
 * ------------------------------------------------------------------ */

/** Segments in a dimension's strand. */
export const STRAND_SEGMENTS = 6;

export interface Dimension {
  id: string;
  title: string;
  verdict: string;
  note: string;
  /** Strength, over `STRAND_SEGMENTS`. */
  level: number;
  tone: '' | 'is-up' | 'is-down' | 'is-alert';
}

export const DIMENSIONS: Dimension[] = [
  {
    id: 'academic-dna',
    title: 'Academic DNA',
    verdict: 'Consolidator',
    note: 'Builds slowly then holds. Retention at eight weeks is well above her cohort, so revisiting old ground costs her less than it costs her peers.',
    level: 5,
    tone: '',
  },
  {
    id: 'learning-style',
    title: 'Learning Style',
    verdict: 'Visual & practical',
    note: 'Scores rise sharply on diagram-led and lab-based material and fall on dense text. Worked examples outperform written explanation by a wide margin.',
    level: 4,
    tone: '',
  },
  {
    id: 'strengths',
    title: 'Strength Profile',
    verdict: 'Reading & science',
    note: 'Comprehension and inference sit two bands above class median. Science practicals are her most consistent scores across four terms.',
    level: 5,
    tone: 'is-up',
  },
  {
    id: 'weakness',
    title: 'Weakness Profile',
    verdict: 'Abstract mathematics',
    note: 'Arithmetic is sound; the drop begins precisely at symbolic algebra. This is a representation gap, not a numeracy gap.',
    level: 2,
    tone: 'is-alert',
  },
  {
    id: 'communication',
    title: 'Communication Style',
    verdict: 'Considered',
    note: 'Rarely first to speak but her contributions are taken up by others. Written responses are markedly stronger than spoken ones.',
    level: 4,
    tone: '',
  },
  {
    id: 'attendance',
    title: 'Attendance Behaviour',
    verdict: 'Recovered',
    note: 'A six-week dip in June traced to a transport change. Since the route was fixed she has not missed a day.',
    level: 4,
    tone: 'is-up',
  },
  {
    id: 'participation',
    title: 'Participation Level',
    verdict: 'Rising',
    note: 'Volunteered contributions tripled after group seating changed in May. She engages far more in pairs than in whole-class settings.',
    level: 4,
    tone: 'is-up',
  },
  {
    id: 'discipline',
    title: 'Assignment Discipline',
    verdict: 'Reliable',
    note: 'Ninety-four percent submitted on time. The four late submissions were all mathematics, matching the weakness profile.',
    level: 5,
    tone: 'is-up',
  },
  {
    id: 'wellbeing',
    title: 'Emotional Wellbeing',
    verdict: 'Stable',
    note: 'No pastoral flags this year. Counsellor notes describe her as settled, with mild anxiety reported before mathematics assessments only.',
    level: 4,
    tone: '',
  },
  {
    id: 'leadership',
    title: 'Leadership Traits',
    verdict: 'Emerging',
    note: 'Chosen twice as group recorder by peers rather than by staff. Organises well; has not yet taken a role that requires speaking for the group.',
    level: 3,
    tone: '',
  },
];

/** A strand: one lit segment per level. */
export const strandOf = (dimension: Dimension) =>
  Array.from({ length: STRAND_SEGMENTS }, (_, index) => (index < dimension.level ? 'on' : ''));

/** Dimensions the engine has not flagged. */
export const SIGNALS_STEADY = DIMENSIONS.filter((entry) => entry.tone !== 'is-alert').length;
/** Dimensions it has. */
export const OPEN_CONCERNS = DIMENSIONS.length - SIGNALS_STEADY;

/* ------------------------------------------------------------------ *
 * The findings                                                       *
 * ------------------------------------------------------------------ */

/** Dots in a confidence rail. */
export const DOT_COUNT = 5;

/** A confidence rail: one lit dot per fifth. */
export const dotsFor = (confidence: number) => {
  const lit = round((confidence / 100) * DOT_COUNT);
  return Array.from({ length: DOT_COUNT }, (_, index) => (index < lit ? 'on' : ''));
};

export interface Finding {
  id: string;
  icon: string;
  tone: 'is-up' | 'is-down' | 'is-alert';
  observation: string;
  status: string;
  statusTag: 'is-up' | 'is-down' | 'is-alert';
  why: string;
  evidence: { icon: string; text: string }[];
  confidence: number;
  outcome: string;
  action: string;
  modal: string;
  /** Findings the workspace also plots as a confidence meter carry a label. */
  meterLabel?: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'reading',
    icon: 'ti ti-book-2',
    tone: 'is-up',
    observation: 'Reading improving',
    status: 'Confirmed',
    statusTag: 'is-up',
    why: 'Comprehension scores rose across five consecutive assessments, and the gain is concentrated in inference questions rather than in recall. That pattern indicates genuine skill growth rather than familiarity with the paper format.',
    evidence: [
      { icon: 'ti ti-arrow-up-right', text: 'Five consecutive gains, +14 marks' },
      { icon: 'ti ti-target', text: 'Inference items up 22%, recall flat' },
      { icon: 'ti ti-library', text: 'Library borrowing tripled since March' },
    ],
    confidence: 96,
    outcome: 'Sustains the gain into next term',
    action: 'Move her to the extension reading set',
    modal: 'learning_plan',
    meterLabel: 'Reading improvement',
  },
  {
    id: 'algebra',
    icon: 'ti ti-math-symbols',
    tone: 'is-alert',
    observation: 'Mathematics requires attention',
    status: 'Priority',
    statusTag: 'is-alert',
    why: 'Performance is sound through arithmetic and collapses at symbolic algebra. She solves the same problems correctly when they are written in words, which places the difficulty in notation rather than in reasoning.',
    evidence: [
      {
        icon: 'ti ti-chart-arrows',
        text: `Word problems ${WORD_PROBLEM_MARK}%, symbolic ${SYMBOLIC_MARK}%`,
      },
      { icon: 'ti ti-calendar-x', text: 'Four late submissions, all algebra' },
      { icon: 'ti ti-clock', text: 'Time per question doubled' },
    ],
    confidence: 94,
    outcome: '+12 marks within one term',
    action: 'Assign notation-focused practice, twice weekly',
    modal: 'learning_plan',
    meterLabel: 'Algebra notation gap',
  },
  {
    id: 'attendance',
    icon: 'ti ti-calendar-stats',
    tone: 'is-down',
    observation: 'Attendance declined, then recovered',
    status: 'Resolved',
    statusTag: 'is-down',
    why: 'A six-week dip in June aligned exactly with a change to Route 04 and did not recur once the schedule was corrected. No academic scores fell during the dip, so the impact was contained.',
    evidence: [
      { icon: 'ti ti-bus', text: 'Route 04 rescheduled 22 Jun' },
      { icon: 'ti ti-check', text: 'No absence in six weeks since' },
      { icon: 'ti ti-shield-check', text: 'No corresponding score drop' },
    ],
    confidence: 91,
    outcome: 'Confirms the recovery is durable',
    action: 'Keep the monitoring flag until term end',
    modal: 'learning_plan',
    meterLabel: 'Attendance recovery',
  },
  {
    id: 'homework',
    icon: 'ti ti-clock-exclamation',
    tone: 'is-down',
    observation: 'Homework delayed',
    status: 'Watch',
    statusTag: 'is-down',
    why: 'Late submissions cluster entirely in mathematics and entirely on topics involving symbolic notation. Every other subject is submitted early. This is avoidance of a specific difficulty, not a workload problem.',
    evidence: [
      { icon: 'ti ti-percentage', text: '94% on time overall' },
      { icon: 'ti ti-filter', text: '4 of 4 late items were algebra' },
      { icon: 'ti ti-mood-neutral', text: 'No workload complaint recorded' },
    ],
    confidence: 88,
    outcome: 'Removes the avoidance trigger',
    action: 'Pair the algebra homework with a worked example',
    modal: 'learning_plan',
  },
  {
    id: 'participation',
    icon: 'ti ti-messages',
    tone: 'is-up',
    observation: 'Class participation increased',
    status: 'Confirmed',
    statusTag: 'is-up',
    why: 'Volunteered contributions tripled after the May seating change placed her in a smaller working group. The rise held for eleven weeks, which is long enough to treat as a change in behaviour rather than novelty.',
    evidence: [
      { icon: 'ti ti-users', text: 'Group of four, from a group of nine' },
      { icon: 'ti ti-chart-line', text: 'Contributions 3x, held 11 weeks' },
      { icon: 'ti ti-microphone', text: 'Still rare in whole-class settings' },
    ],
    confidence: 89,
    outcome: 'Protects the participation gain',
    action: 'Keep the current grouping next term',
    modal: 'learning_plan',
    meterLabel: 'Participation rise',
  },
  {
    id: 'science',
    icon: 'ti ti-flask',
    tone: 'is-up',
    observation: 'Science performance stable',
    status: 'Confirmed',
    statusTag: 'is-up',
    why: 'Science has varied by less than four marks across eight assessments, the tightest band of any subject. Practical work sits consistently above written work, matching the visual and practical learning style.',
    evidence: [
      { icon: 'ti ti-ruler', text: 'Variance under 4 marks, 8 papers' },
      { icon: 'ti ti-microscope', text: 'Practicals 11 marks above written' },
      { icon: 'ti ti-award', text: 'Top quartile in three of four terms' },
    ],
    confidence: 92,
    outcome: 'Opens a scholarship pathway',
    action: 'Nominate for the regional science fair',
    modal: 'learning_plan',
  },
];

/** The findings the workspace plots as confidence meters, strongest first. */
export const CONFIDENCE_METERS = FINDINGS.filter((finding) => finding.meterLabel).sort(
  (a, b) => b.confidence - a.confidence,
);

/** What the findings add up to, as the workspace summarises them. */
export const STRENGTHS = [
  'Inference & evaluation',
  'Practical science',
  'Knowledge retention',
  'Applied creativity',
  'Submission discipline',
];

export const WEAKNESSES = [
  'Symbolic notation',
  'Whole-class speaking',
  'Help-seeking on hard topics',
  'Pre-assessment anxiety',
];

/** Students the engine matched her against, and on what. */
export const SIMILAR = [
  {
    name: 'Nathan Cole',
    className: 'VII-A',
    note: 'same notation gap, closed in one term with worked-example drills',
  },
  {
    name: 'Iris Kapoor',
    className: 'VIII-C',
    note: 'same visual learning profile, same science trajectory',
  },
  { name: 'Zara Ahmed', className: 'V-C', note: 'same small-group participation pattern' },
];

/* ------------------------------------------------------------------ *
 * Learning intelligence                                              *
 * ------------------------------------------------------------------ */

export interface LearningRead {
  id: string;
  icon: string;
  title: string;
  verdict: string;
  note: string;
  /** Strength, over `DOT_COUNT`. */
  level: number;
  tone: '' | 'is-up' | 'is-down';
}

export const LEARNING: LearningRead[] = [
  {
    id: 'speed',
    icon: 'ti ti-rocket',
    title: 'Learning Speed',
    verdict: 'Deliberate',
    note: 'Slower than cohort on first exposure, faster than cohort on the second. Front-loading new material costs her time she recovers later.',
    level: 3,
    tone: '',
  },
  {
    id: 'retention',
    icon: 'ti ti-brain',
    title: 'Knowledge Retention',
    verdict: 'Exceptional',
    note: 'Eight weeks after teaching she retains what most of the class retains after two. Spaced revision is largely wasted effort for her.',
    level: 5,
    tone: 'is-up',
  },
  {
    id: 'consistency',
    icon: 'ti ti-checkbox',
    title: 'Assignment Consistency',
    verdict: 'Reliable',
    note: 'Submits early in every subject except mathematics, where four of four late items involved symbolic notation.',
    level: 5,
    tone: 'is-up',
  },
  {
    id: 'exam',
    icon: 'ti ti-file-certificate',
    title: 'Exam Readiness',
    verdict: 'Ready, with one gap',
    note: 'Prepared across reading, science and languages. Algebra sections remain the only area where practice has not converged.',
    level: 4,
    tone: '',
  },
  {
    id: 'confidence',
    icon: 'ti ti-mood-smile',
    title: 'Subject Confidence',
    verdict: 'Uneven',
    note: 'Volunteers freely in science and reading, never in mathematics. Confidence tracks the notation gap almost exactly.',
    level: 3,
    tone: 'is-down',
  },
  {
    id: 'collaboration',
    icon: 'ti ti-users',
    title: 'Collaboration',
    verdict: 'Strong in small groups',
    note: 'Contributions tripled in a group of four and remain rare in a class of thirty. Group size is the operative variable.',
    level: 4,
    tone: 'is-up',
  },
  {
    id: 'creativity',
    icon: 'ti ti-bulb',
    title: 'Creativity',
    verdict: 'Applied',
    note: 'Original in practical and design tasks rather than in open-ended writing. Her science exhibition entry was her own design.',
    level: 4,
    tone: '',
  },
  {
    id: 'critical',
    icon: 'ti ti-scale',
    title: 'Critical Thinking',
    verdict: 'Advanced',
    note: 'Inference and evaluation questions are her strongest item type across every subject, including mathematics word problems.',
    level: 5,
    tone: 'is-up',
  },
  {
    id: 'self',
    icon: 'ti ti-book',
    title: 'Self Learning',
    verdict: 'Developing',
    note: 'Library borrowing tripled unprompted, but she does not yet seek help on the topics she avoids. Independence is subject-selective.',
    level: 3,
    tone: '',
  },
];

/** A dot rail at a stated level rather than from a percentage. */
export const dotsAt = (level: number) =>
  Array.from({ length: DOT_COUNT }, (_, index) => (index < level ? 'on' : ''));

/* ------------------------------------------------------------------ *
 * The recommendations                                                *
 * ------------------------------------------------------------------ */

export interface Recommendation {
  id: string;
  title: string;
  note: string;
  confidence: number;
  /** What it would do to her standing, on the engine's own scale. */
  impact: number;
  /** Staff hours a week it costs — the other half of the stated ranking. */
  effort: number;
  expected: string;
  timeline: string;
  owner: string;
  modal: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'maths-practice',
    title: 'Extra Mathematics Practice',
    note: 'Twice-weekly notation drills targeted at symbolic algebra, using the worked-example format she already responds to. This is the single highest-yield action available.',
    confidence: 96,
    impact: 96,
    effort: 1,
    expected: '+12 marks',
    timeline: 'One term',
    owner: 'Class teacher',
    modal: 'learning_plan',
  },
  {
    id: 'peer-learning',
    title: 'Peer Learning',
    note: 'Pair her with Nathan Cole for mathematics. He cleared the same notation gap last term and her contributions triple in groups of four or fewer.',
    confidence: 93,
    impact: 78,
    effort: 0.9,
    expected: '+8 marks',
    timeline: 'Six weeks',
    owner: 'Class teacher',
    modal: 'assign_mentor',
  },
  {
    id: 'weekly-assessment',
    title: 'Weekly Assessment',
    note: 'A short weekly algebra check would surface the notation gap closing or holding, rather than waiting for the term paper to reveal it.',
    confidence: 91,
    impact: 55,
    effort: 0.7,
    expected: 'Earlier detection',
    timeline: 'Ongoing',
    owner: 'Class teacher',
    modal: 'learning_plan',
  },
  {
    id: 'parent-meeting',
    title: 'Parent Meeting',
    note: 'Guardians have not been briefed since the attendance recovery. A short meeting would set expectations for the mathematics plan before term begins.',
    confidence: 89,
    impact: 45,
    effort: 0.75,
    expected: 'Aligned support',
    timeline: 'Within 2 weeks',
    owner: 'Class teacher',
    modal: 'parent_meeting',
  },
  {
    id: 'leadership',
    title: 'Leadership Activity',
    note: 'Twice chosen as group recorder by her peers. A role requiring her to speak for the group would extend a trait that is already emerging.',
    confidence: 87,
    impact: 30,
    effort: 0.55,
    expected: 'Confidence growth',
    timeline: 'Next term',
    owner: 'Class teacher',
    modal: 'assign_mentor',
  },
  {
    id: 'scholarship',
    title: 'Scholarship Opportunity',
    note: 'Her science record meets the criteria for the regional STEM scholarship. Applications close in six weeks and require a teacher nomination.',
    confidence: 86,
    impact: 40,
    effort: 0.8,
    expected: 'Funded place',
    timeline: 'Six weeks',
    owner: 'Class teacher',
    modal: 'student_summary',
  },
  {
    id: 'career',
    title: 'Career Guidance',
    note: 'The combination of applied creativity, practical science and strong inference points toward laboratory and design pathways worth naming early.',
    confidence: 84,
    impact: 25,
    effort: 0.6,
    expected: 'Direction set',
    timeline: 'This term',
    owner: 'Class teacher',
    modal: 'student_summary',
  },
  {
    id: 'counselling',
    title: 'Counselling',
    note: 'Mild pre-assessment anxiety is reported for mathematics only. One session before the term paper would likely be sufficient.',
    confidence: 82,
    impact: 20,
    effort: 0.6,
    expected: 'Reduced anxiety',
    timeline: 'Before exams',
    owner: 'Class teacher',
    modal: 'parent_meeting',
  },
];

/** Expected gain against the effort it costs — what the list says it ranks on. */
export const yieldOf = (row: Recommendation) => row.impact / row.effort;

export const RECOMMENDATIONS = [...recommendations].sort((a, b) => yieldOf(b) - yieldOf(a));

/** The priority a recommendation carries, which follows from where it ranks. */
export const PRIORITY_BANDS = [
  { upTo: 1, band: 'Critical', card: 'is-critical', tag: 'is-alert' },
  { upTo: 3, band: 'High', card: 'is-high', tag: 'is-down' },
  { upTo: Infinity, band: 'Normal', card: 'is-normal', tag: 'is-flat' },
];

export const priorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/** The four the workspace shows, which are the four that rank highest. */
export const TOP_RECOMMENDATIONS = RECOMMENDATIONS.slice(0, 4);

/** The marks the mathematics plan is written against. */
export const PLAN_TARGET_MARKS = 12;

/* ------------------------------------------------------------------ *
 * The journey                                                        *
 * ------------------------------------------------------------------ */

export interface JourneyLeg {
  id: string;
  on: string;
  term: string;
  icon: string;
  title: string;
  note: string;
  tone: '' | 'is-good' | 'is-alert' | 'is-warn' | 'is-now';
}

const journey: JourneyLeg[] = [
  {
    id: 'admission',
    on: STUDENT.admittedOn,
    term: 'Term 1',
    icon: 'ti ti-door-enter',
    title: 'Admission',
    note: `Joined ${STUDENT.admittedInto} mid-year on transfer. Baseline placement put her in the third band for mathematics and the first for reading.`,
    tone: '',
  },
  {
    id: 'first-assessment',
    on: '02 Jun 2023',
    term: 'Term 1',
    icon: 'ti ti-clipboard-text',
    title: 'First Assessment',
    note: `Overall ${ordinal(FIRST_PERCENTILE)} percentile. Reading already two bands above cohort; mathematics already the outlier.`,
    tone: '',
  },
  {
    id: 'improvement',
    on: '18 Nov 2024',
    term: 'Term 3',
    icon: 'ti ti-trending-up',
    title: 'Academic Improvement',
    note: `Moved from the ${ordinal(FIRST_PERCENTILE)} to the ${ordinal(PERCENTILES[2])} percentile after the extension reading set was introduced. Science followed within one term.`,
    tone: 'is-good',
  },
  {
    id: 'award',
    on: '24 Feb 2025',
    term: 'Term 4',
    icon: 'ti ti-award',
    title: 'Award Received',
    note: 'Second place, inter-house science exhibition. First formal recognition and the point at which participation began to rise.',
    tone: 'is-good',
  },
  {
    id: 'warning',
    on: ATTENDANCE.dipFrom,
    term: 'Term 6',
    icon: 'ti ti-alert-triangle',
    title: 'Attendance Warning',
    note: `Attendance fell to ${ATTENDANCE.dipTo}% over ${ATTENDANCE.dipWeeks} weeks. Cause traced to a change in the ${ATTENDANCE.route} schedule rather than to anything at school.`,
    tone: 'is-alert',
  },
  {
    id: 'meeting',
    on: '02 Jul 2026',
    term: 'Term 6',
    icon: 'ti ti-users',
    title: 'Parent Meeting',
    note: 'Guardians met the class teacher and the transport office. Route corrected the same week and a four-week monitoring plan opened.',
    tone: 'is-warn',
  },
  {
    id: 'recovery',
    on: ATTENDANCE.recoveredOn,
    term: 'Term 6',
    icon: 'ti ti-heart-handshake',
    title: 'Recovery',
    note: `Attendance returned to ${ATTENDANCE.now}% and held. No academic score was lost during the dip; the monitoring plan closed successfully.`,
    tone: 'is-good',
  },
  {
    id: 'now',
    on: RUN_DATE,
    term: 'Today',
    icon: 'ti ti-sparkles',
    title: 'Current Status',
    note: `${ordinal(CURRENT_PERCENTILE)} percentile overall and rising. Mathematics remains the single constraint; every other signal is stable or improving.`,
    tone: 'is-now',
  },
];

export const JOURNEY = journey;

/** The legs the workspace's progress timeline shows: everything since the rise. */
export const PROGRESS_LEGS = journey.filter((leg) => leg.tone !== '');

/* ------------------------------------------------------------------ *
 * The growth story, the feed and the opportunities                   *
 * ------------------------------------------------------------------ */

export const GROWTH_STORY = [
  {
    id: 'achievements',
    icon: 'ti ti-award',
    title: 'Achievements',
    tone: 'is-good',
    text: 'Second place at the inter-house science exhibition with an entry she designed herself, and a place in the extension reading set held for four consecutive terms.',
  },
  {
    id: 'milestones',
    icon: 'ti ti-flag',
    title: 'Milestones',
    tone: 'is-good',
    text: `Crossed the 70th percentile in Term ${crossedAt(70)} and the 75th in Term ${crossedAt(75)}. Both crossings followed a change in how she was taught rather than how much.`,
  },
  {
    id: 'positive',
    icon: 'ti ti-trending-up',
    title: 'Positive Changes',
    tone: 'is-good',
    text: 'Volunteered contributions tripled after the May seating change and have held for eleven weeks. Library borrowing tripled without prompting.',
  },
  {
    id: 'improved',
    icon: 'ti ti-arrow-up-right',
    title: 'Areas Improved',
    tone: '',
    text: `Attendance recovered from ${ATTENDANCE.dipTo}% to ${ATTENDANCE.now}% once the transport cause was fixed. Assignment punctuality now sits at ${ASSIGNMENTS.onTimePct}% across all subjects.`,
  },
  {
    id: 'challenges',
    icon: 'ti ti-alert-circle',
    title: 'Current Challenges',
    tone: 'is-warn',
    text: 'Symbolic algebra remains unresolved and is now the only signal holding her overall standing down. Confidence in mathematics tracks it closely.',
  },
  {
    id: 'goals',
    icon: 'ti ti-target-arrow',
    title: 'Future Goals',
    tone: '',
    text: 'Close the notation gap by term end, secure a regional STEM scholarship nomination, and take one role that requires speaking for a group.',
  },
];

export interface FeedEntry {
  id: string;
  /** Days before the register clock. */
  daysAgo: number;
  at: string;
  icon: string;
  tone: '' | 'is-good' | 'is-warn';
  title: string;
  note: string;
}

const feed: FeedEntry[] = [
  {
    id: 'reading-gain',
    daysAgo: 0,
    at: LAST_RUN,
    icon: 'ti ti-sparkles',
    tone: 'is-good',
    title: 'AI detected improvement in reading comprehension',
    note: 'Fifth consecutive gain. The engine raised her reading band and flagged the extension set as working.',
  },
  {
    id: 'teacher-note',
    daysAgo: 0,
    at: '08:40',
    icon: 'ti ti-user-star',
    tone: '',
    title: `Teacher recommendation added by ${STUDENT.teacher}`,
    note: '“Pair her with Nathan for algebra — he cleared the same gap last term and they work well together.”',
  },
  {
    id: 'early-submission',
    daysAgo: 1,
    at: '16:20',
    icon: 'ti ti-checkbox',
    tone: 'is-good',
    title: 'Assignment completed ahead of deadline',
    note: `Science practical write-up submitted two days early. Twelfth early submission this term.`,
  },
  {
    id: 'attendance',
    daysAgo: 3,
    at: '09:05',
    icon: 'ti ti-calendar-check',
    tone: 'is-good',
    title: `Attendance improved to ${ATTENDANCE.now}%`,
    note: `${CLEAR_WEEKS} clear weeks since the ${ATTENDANCE.route} correction. The monitoring plan closed successfully.`,
  },
  {
    id: 'achievement',
    daysAgo: 8,
    at: '14:30',
    icon: 'ti ti-award',
    tone: 'is-good',
    title: 'New achievement recorded',
    note: 'Placed in the top quartile for science for the third term in four.',
  },
  {
    id: 'behaviour',
    daysAgo: 14,
    at: '11:15',
    icon: 'ti ti-mood-smile',
    tone: '',
    title: 'Behaviour improvement noted',
    note: 'Volunteered contributions have held at three times the previous rate for eleven weeks.',
  },
  {
    id: 'parent',
    daysAgo: 20,
    at: '17:45',
    icon: 'ti ti-message-2',
    tone: 'is-warn',
    title: 'Parent feedback received',
    note: '“She is more settled since the bus was sorted, but still says she dreads maths tests.”',
  },
];

/** The feed, dated back from the register clock and labelled the way it reads. */
export const FEED = feed.map((entry) => {
  const on = addDays(RUN_DATE, -entry.daysAgo);
  const when =
    entry.daysAgo === 0
      ? 'Today'
      : entry.daysAgo === 1
        ? 'Yesterday'
        : on.split(' ').slice(0, 2).join(' ');
  return { ...entry, on, when };
});

/** How far back the feed reaches, in whole weeks. */
export const FEED_WEEKS = Math.round(Math.max(...feed.map((entry) => entry.daysAgo)) / 7);

export const OPPORTUNITIES = [
  {
    id: 'science-fair',
    cap: '',
    icon: 'ti ti-trophy',
    kind: 'Competitions',
    title: 'Regional Science Exhibition',
    note: 'Entries close 12 Sep. Her exhibition record meets the nomination bar.',
  },
  {
    id: 'stem',
    cap: 'is-teal',
    icon: 'ti ti-coin',
    kind: 'Scholarships',
    title: 'STEM Merit Scholarship',
    note: 'Applications close in six weeks. Requires one teacher nomination.',
  },
  {
    id: 'rep',
    cap: 'is-amber',
    icon: 'ti ti-crown',
    kind: 'Leadership Roles',
    title: 'Class Science Representative',
    note: 'Chosen twice as group recorder by peers. A natural next step.',
  },
  {
    id: 'athletics',
    cap: 'is-green',
    icon: 'ti ti-ball-football',
    kind: 'Sports',
    title: 'Inter-house Athletics',
    note: 'Attendance at practice is consistent; no competitive entry yet.',
  },
  {
    id: 'robotics',
    cap: '',
    icon: 'ti ti-users',
    kind: 'Clubs',
    title: 'Robotics & Design Club',
    note: 'Matches the applied-creativity signal. Eight places remain.',
  },
  {
    id: 'reading-buddy',
    cap: 'is-teal',
    icon: 'ti ti-heart-handshake',
    kind: 'Volunteer Activities',
    title: 'Junior Reading Buddy',
    note: 'Reading strength plus small-group preference make this a close fit.',
  },
  {
    id: 'career',
    cap: 'is-amber',
    icon: 'ti ti-compass',
    kind: 'Career Suggestions',
    title: 'Laboratory & Design Pathways',
    note: 'Practical science, applied creativity and strong inference point here.',
  },
  {
    id: 'extension',
    cap: 'is-green',
    icon: 'ti ti-school',
    kind: 'Enrichment',
    title: 'Extension Reading Set',
    note: 'Already placed. Held for four consecutive terms without a drop.',
  },
];

export const COPILOT = [
  {
    icon: 'ti ti-file-text',
    title: 'Generate Progress Summary',
    note: 'One page for the teacher, written from the record',
    modal: 'student_summary',
  },
  {
    icon: 'ti ti-mail-star',
    title: 'Generate Parent Letter',
    note: 'Plain language, no jargon, ready to send',
    modal: 'parent_report',
  },
  {
    icon: 'ti ti-notes',
    title: 'Generate Teacher Notes',
    note: 'Handover notes for the incoming class teacher',
    modal: 'student_summary',
  },
  {
    icon: 'ti ti-compass',
    title: 'Generate Career Guidance',
    note: 'Pathways matched to her strongest signals',
    modal: 'student_summary',
  },
  {
    icon: 'ti ti-users-group',
    title: 'Compare Similar Students',
    note: 'Students who closed the same notation gap',
    modal: 'compare_students',
  },
  {
    icon: 'ti ti-route',
    title: 'Generate Learning Plan',
    note: 'A term plan with owners and checkpoints',
    modal: 'learning_plan',
  },
  {
    icon: 'ti ti-file-certificate',
    title: 'Generate Exam Strategy',
    note: 'Paper-by-paper approach for the term exams',
    modal: 'learning_plan',
  },
  {
    icon: 'ti ti-file-export',
    title: 'Export Student Intelligence',
    note: 'Full record with reasoning, to PDF or XLSX',
    modal: 'export_intelligence',
  },
];

/* ------------------------------------------------------------------ *
 * The cohort, and the plan                                           *
 * ------------------------------------------------------------------ */

/** The students the page can switch between, and match her against. */
export const COHORT = [
  { name: STUDENT.name, className: STUDENT.className, note: 'this record' },
  { name: 'Nathan Cole', className: 'VII-A', note: 'closed the same gap' },
  { name: 'Iris Kapoor', className: 'VIII-C', note: 'same learning profile' },
  { name: 'Ethan Brooks', className: 'X-B', note: 'plan still open' },
];

/** Who the mentor dialog proposes: the one who cleared this gap. */
export const PROPOSED_MENTOR = COHORT.find((entry) => entry.note === 'closed the same gap');

/** The eight-week plan the recommendations add up to. */
export const PLAN_WEEKS = [
  { span: 'Week 1–2', work: 'Notation drills, 2x weekly' },
  { span: 'Week 3–4', work: 'Paired work with mentor' },
  { span: 'Week 5–6', work: 'Short weekly algebra check' },
  { span: 'Week 7–8', work: 'Full paper under timing' },
];

export const TEACHER_ACTIONS = [
  { label: 'Notation drills', value: 'Twice weekly' },
  { label: 'Pair seating', value: 'Keep group of four' },
  { label: 'Weekly check', value: 'Friday, 10 min' },
  { label: 'Nomination', value: 'STEM scholarship' },
];

export const PARENT_ACTIONS = [
  { label: 'Briefing', value: 'Before term begins' },
  { label: 'Home routine', value: 'No change needed' },
  { label: 'Exam anxiety', value: 'One counselling session' },
  { label: 'Reading', value: 'Continue library visits' },
];

export const COMPLETED_GOALS = [
  { label: 'Attendance recovery', value: `Closed ${ATTENDANCE.recoveredOn.slice(0, 6)}` },
  { label: 'Extension reading set', value: 'Held 4 terms' },
  { label: 'Science exhibition', value: 'Second place' },
  { label: 'Participation target', value: 'Exceeded' },
];

/** The dates the dialogs propose, offset from the register clock. */
export const MENTOR_START = addDays(RUN_DATE, 9);
export const MEETING_ON = addDays(RUN_DATE, 13);
export const PLAN_REVIEW = addDays(RUN_DATE, 60);
/** Weeks until the scholarship applications close. */
export const SCHOLARSHIP_WEEKS = 6;
