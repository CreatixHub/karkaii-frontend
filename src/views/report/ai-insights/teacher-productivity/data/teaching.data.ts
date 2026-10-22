import { addDays } from '../../data/dates';
import { LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE };

const mean = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

/* ------------------------------------------------------------------ *
 * The review                                                         *
 * ------------------------------------------------------------------ */

/** Teachers this run reviewed. The hub's "teachers reviewed" tile reads this. */
export const TEACHERS_REVIEWED = 42;
/** What it read to do it. */
export const LESSON_RECORDS = 1840;
export const OBSERVATIONS = 96;

/** The school's own productivity reading, and the two means beneath it. */
export const PRODUCTIVITY_HEALTH = 88;
export const EFFECTIVENESS_MEAN = 91;
export const COACHING_PLANS_OPEN = 11;

/** The timetable a period count is measured against. */
export const PERIOD_CEILING = 26;
/** The most any timetable can carry, which is what the workload index is of. */
export const PERIOD_MAX = 33;
/** Teachers school-wide sitting above the ceiling. */
export const OVER_CEILING = 4;

/** Teachers who file complete plans ahead of the week they teach. */
export const PLANS_AHEAD = 38;
/** Teachers who finished their training this year. */
export const TRAINING_COMPLETED = 28;

/** A share of the reviewed staff, floored — a rate nobody has yet reached. */
export const shareOfStaff = (count: number) => Math.floor((count / TEACHERS_REVIEWED) * 100);

export const PLANS_AHEAD_PCT = shareOfStaff(PLANS_AHEAD);
export const TRAINING_COMPLETION_PCT = shareOfStaff(TRAINING_COMPLETED);
export const PLANS_LATE = TEACHERS_REVIEWED - PLANS_AHEAD;

/* ------------------------------------------------------------------ *
 * The engagement wave                                                *
 * ------------------------------------------------------------------ */

/** Classroom engagement, one reading a week across the term. */
export const ENGAGEMENT_WAVE = [
  42, 55, 61, 58, 70, 82, 76, 88, 94, 71, 63, 55, 68, 79, 86, 92, 84, 73, 66, 58, 64, 77, 89, 96,
];

/** The teaching week the wave starts at. */
export const WAVE_FROM = 4;

/**
 * Weeks the wave peaked at — higher than the week either side of them.
 *
 * The closing week is excluded: it is the week still running, so a reading
 * above the one before it has nothing after it to be confirmed against.
 */
export const wavePeaks = () => {
  const peaks: number[] = [];
  for (let index = 1; index < ENGAGEMENT_WAVE.length - 1; index += 1) {
    if (
      ENGAGEMENT_WAVE[index] > ENGAGEMENT_WAVE[index - 1] &&
      ENGAGEMENT_WAVE[index] > ENGAGEMENT_WAVE[index + 1]
    ) {
      peaks.push(index);
    }
  }
  return peaks;
};

/**
 * Weeks the wave dipped at.
 *
 * The opening week counts: the term begins after a break, so its low is bounded
 * by the break rather than by a week the engine can read.
 */
export const waveDips = () => {
  const dips: number[] = [];
  if (ENGAGEMENT_WAVE[0] < ENGAGEMENT_WAVE[1]) dips.push(0);
  for (let index = 1; index < ENGAGEMENT_WAVE.length - 1; index += 1) {
    if (
      ENGAGEMENT_WAVE[index] < ENGAGEMENT_WAVE[index - 1] &&
      ENGAGEMENT_WAVE[index] < ENGAGEMENT_WAVE[index + 1]
    ) {
      dips.push(index);
    }
  }
  return dips;
};

/** The wave's own movement: the last eight weeks against the first eight. */
export const WAVE_CHANGE = Math.round(
  mean(ENGAGEMENT_WAVE.slice(-8)) - mean(ENGAGEMENT_WAVE.slice(0, 8)),
);

/** The wave's axis, three marks across the weeks it spans. */
export const waveAxis = () => {
  const last = WAVE_FROM + ENGAGEMENT_WAVE.length - 1;
  return [WAVE_FROM, Math.round((WAVE_FROM + last) / 2), last];
};

/** The class each bar carries: peaks and dips are marked, the rest are plain. */
export const waveBars = () => {
  const peaks = new Set(wavePeaks());
  const dips = new Set(waveDips());
  return ENGAGEMENT_WAVE.map((value, index) => ({
    value,
    tone: peaks.has(index) ? 'is-peak' : dips.has(index) ? 'is-dip' : '',
  }));
};

export const WAVE_CONFIDENCE = 93;

/* ------------------------------------------------------------------ *
 * The teachers                                                       *
 * ------------------------------------------------------------------ */

export interface Teacher {
  id: string;
  name: string;
  image: string;
  department: string;
  subjects: string;
  style: string;
  /** The engine's composite reading of the teacher, out of a hundred. */
  score: number;
  engagement: number;
  planning: number;
  assessment: number;
  /** Class-to-class consistency, which only the workspace shows. */
  consistency: number;
  /** The timetable weight, as an index of `PERIOD_MAX`. */
  workload: number;
  confidence: number;
  reviewedDaysAgo: number;
  /** The one line the card prints under the profile. */
  headline: string;
  joinedOn: string;
  classes: number;
}

const seeded: Teacher[] = [
  {
    id: 'TCH-0141',
    name: 'Teena Mathew',
    image: 'assets/img/teachers/teacher-01.jpg',
    department: 'Mathematics',
    subjects: 'Algebra, Geometry',
    style: 'Worked example first',
    score: 94,
    engagement: 95,
    planning: 92,
    assessment: 90,
    consistency: 88,
    workload: 68,
    confidence: 96,
    reviewedDaysAgo: 0,
    headline: 'Highest engagement in the school',
    joinedOn: '14 Jun 2021',
    classes: 4,
  },
  {
    id: 'TCH-0206',
    name: 'Meera Joshi',
    image: 'assets/img/teachers/teacher-02.jpg',
    department: 'Languages',
    subjects: 'English, Literature',
    style: 'Discussion led',
    score: 89,
    engagement: 91,
    planning: 86,
    assessment: 88,
    consistency: 84,
    workload: 94,
    confidence: 94,
    reviewedDaysAgo: 0,
    headline: 'Carrying {periods} periods against a {ceiling} ceiling',
    joinedOn: '03 Aug 2019',
    classes: 6,
  },
  {
    id: 'TCH-0318',
    name: 'Daniel Josua',
    image: 'assets/img/teachers/teacher-03.jpg',
    department: 'Science',
    subjects: 'Physics, Chemistry',
    style: 'Practical first',
    score: 86,
    engagement: 88,
    planning: 84,
    assessment: 79,
    consistency: 81,
    workload: 86,
    confidence: 92,
    reviewedDaysAgo: 1,
    headline: 'Assignment reviews running eight days late',
    joinedOn: '11 Jan 2020',
    classes: 5,
  },
  {
    id: 'TCH-0427',
    name: 'Leela Nambiar',
    image: 'assets/img/teachers/teacher-04.jpg',
    department: 'Science',
    subjects: 'Biology',
    style: 'Enquiry based',
    score: 83,
    engagement: 79,
    planning: 88,
    assessment: 85,
    consistency: 90,
    workload: 61,
    confidence: 90,
    reviewedDaysAgo: 1,
    headline: 'Strongest lesson planning, {rank}-lightest timetable',
    joinedOn: '19 Jul 2022',
    classes: 4,
  },
  {
    id: 'TCH-0534',
    name: 'Priya Sundaram',
    image: 'assets/img/teachers/teacher-05.jpg',
    department: 'Mathematics',
    subjects: 'Statistics',
    style: 'Structured drill',
    score: 78,
    engagement: 71,
    planning: 82,
    assessment: 86,
    consistency: 77,
    workload: 79,
    confidence: 88,
    reviewedDaysAgo: 2,
    headline: 'Participation below department median',
    joinedOn: '02 Sep 2023',
    classes: 5,
  },
  {
    id: 'TCH-0662',
    name: 'Rakesh Sharma',
    image: 'assets/img/teachers/teacher-06.jpg',
    department: 'Humanities',
    subjects: 'History, Civics',
    style: 'Narrative led',
    score: 74,
    engagement: 76,
    planning: 68,
    assessment: 72,
    consistency: 70,
    workload: 52,
    confidence: 86,
    reviewedDaysAgo: 3,
    headline: 'Lesson plans filed late in nine of twelve weeks',
    joinedOn: '05 Jun 2024',
    classes: 4,
  },
];

/** The roster, in the order the page shows it: strongest composite first. */
export const TEACHERS: Teacher[] = [...seeded].sort((a, b) => b.score - a.score);

/** The teacher the page's findings and workspace are written about. */
export const FEATURED_TEACHER = TEACHERS[0];

/** Periods a teacher carries, read off the workload index. */
export const periodsOf = (teacher: Teacher) => Math.round((teacher.workload / 100) * PERIOD_MAX);

/** Periods left inside the ceiling, or none when it is already exceeded. */
export const freePeriodsOf = (teacher: Teacher) =>
  Math.max(0, PERIOD_CEILING - periodsOf(teacher));

/** How far past the ceiling a timetable runs. */
export const overCeilingOf = (teacher: Teacher) =>
  Math.max(0, periodsOf(teacher) - PERIOD_CEILING);

/**
 * The workload bar's tone. It reads the other way from the rest: a heavy
 * timetable is the finding, not a light one.
 */
export const workloadToneOf = (teacher: Teacher) => {
  const over = overCeilingOf(teacher);
  return over > 4 ? 'is-low' : over > 0 ? 'is-mid' : '';
};

/** Where a timetable ranks among the roster, lightest first. */
export const timetableRankOf = (teacher: Teacher) =>
  [...TEACHERS].sort((a, b) => periodsOf(a) - periodsOf(b)).findIndex((row) => row.id === teacher.id) +
  1;

/** One scale for the three facets where a higher reading is a better one. */
export const facetToneOf = (value: number) => (value >= 88 ? 'is-high' : value < 80 ? 'is-mid' : '');

/** The four facets a card shows, in the order it shows them. */
export const facetsOf = (teacher: Teacher) => [
  { label: 'Engagement', value: teacher.engagement, tone: facetToneOf(teacher.engagement) },
  { label: 'Lesson planning', value: teacher.planning, tone: facetToneOf(teacher.planning) },
  { label: 'Assessment', value: teacher.assessment, tone: facetToneOf(teacher.assessment) },
  { label: 'Workload', value: teacher.workload, tone: workloadToneOf(teacher) },
];

/** The card's own headline, with the teacher's figures written into it. */
export const headlineOf = (teacher: Teacher) => {
  const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth'];
  return teacher.headline
    .replace('{periods}', String(periodsOf(teacher)))
    .replace('{ceiling}', String(PERIOD_CEILING))
    .replace('{rank}', ordinals[timetableRankOf(teacher)] ?? 'lightest');
};

/** When the teacher was last reviewed, said the way the card says it. */
export const reviewedLabelOf = (teacher: Teacher) =>
  teacher.reviewedDaysAgo === 0
    ? 'Today'
    : teacher.reviewedDaysAgo === 1
      ? 'Yesterday'
      : `${teacher.reviewedDaysAgo} days ago`;

/** Classroom engagement across the roster — the hero's own mean. */
export const ENGAGEMENT_MEAN = Math.round(mean(TEACHERS.map((row) => row.engagement)));

/** The teachers holding the strongest engagement, named in the insight notes. */
export const topEngagement = (count: number) =>
  [...TEACHERS].sort((a, b) => b.engagement - a.engagement).slice(0, count);

/** The departments the roster covers, for the filters. */
export const DEPARTMENTS = [...new Set(seeded.map((row) => row.department))].sort();
/** The teaching styles it covers. */
export const STYLES = TEACHERS.map((row) => row.style);

/** Teachers sharing the featured teacher's structure, school-wide. */
export const SHARE_THE_STRUCTURE = 4;

/* ------------------------------------------------------------------ *
 * The findings                                                       *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  observation: string;
  tone: 'is-high' | 'is-mid' | 'is-low';
  label: string;
  confidence: number;
  why: string;
  evidence: string[];
  impact: string;
  action: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'engagement',
    icon: 'ti ti-flame',
    observation: 'Excellent classroom engagement',
    tone: 'is-high',
    label: 'Strength',
    confidence: 96,
    why: 'Volunteered student contributions in Teena Mathew’s classes run at three times the department median and have held for nineteen weeks. The rise began the week she moved to a worked-example-first structure, not at the start of a term, which rules out a calendar effect.',
    evidence: [
      'Contributions 3x department median',
      'Held for 19 consecutive weeks',
      'Rise begins at the method change, not the term',
      'Same pattern across all four of her classes',
    ],
    impact: 'Whole-department lift if adopted',
    action:
      'Ask her to run a twenty-minute session on the worked-example structure at the next department meeting.',
  },
  {
    id: 'workload',
    icon: 'ti ti-weight',
    observation: 'Heavy teaching workload',
    tone: 'is-low',
    label: 'Priority',
    confidence: 95,
    why: 'Meera Joshi holds 31 periods against a 26-period ceiling, and five of those fall in consecutive afternoon blocks. Her marking turnaround has lengthened from two days to six over the same period, while her engagement scores have not moved.',
    evidence: [
      '31 periods, ceiling is 26',
      'Five consecutive afternoon blocks',
      'Marking turnaround 2 days to 6',
      'Engagement unchanged — quality is absorbing the load',
    ],
    impact: 'Sustainability risk, not a quality problem',
    action:
      'Move the Thursday and Friday afternoon blocks to Rakesh Sharma, who has capacity on both days.',
  },
  {
    id: 'reviews',
    icon: 'ti ti-clock-exclamation',
    observation: 'Delayed assignment reviews',
    tone: 'is-mid',
    label: 'Improve',
    confidence: 92,
    why: 'Daniel Josua returns work an average of eight days after submission against a department norm of three. The delay is concentrated entirely in practical write-ups, which take him four times as long to mark as theory work.',
    evidence: [
      'Eight day average, norm is three',
      'Delay is entirely in practical write-ups',
      'Theory returned within two days',
      'No delay before the new lab format',
    ],
    impact: 'Students lose the feedback window',
    action:
      'Introduce a short structured rubric for practical write-ups, as used by the biology department.',
  },
  {
    id: 'participation',
    icon: 'ti ti-messages',
    observation: 'High student participation',
    tone: 'is-high',
    label: 'Strength',
    confidence: 91,
    why: 'Across the four teachers using small-group seating, participation sits eighteen points above those using rows. The effect appears within three weeks of the change and is independent of subject or year group.',
    evidence: [
      '18 points above row seating',
      'Effect appears within 3 weeks',
      'Independent of subject and year group',
      'Four teachers, eleven classes',
    ],
    impact: 'Repeatable across the school',
    action: 'Trial small-group seating in the two humanities classrooms next term.',
  },
  {
    id: 'planning',
    icon: 'ti ti-layout-grid',
    observation: 'Balanced lesson planning',
    tone: 'is-high',
    label: 'Strength',
    confidence: 89,
    why: 'Leela Nambiar files complete plans a week ahead in every observed cycle, and her plans carry the clearest learning objectives in the school. Her classes show the least variance in assessment outcomes of any cohort.',
    evidence: [
      'Plans filed one week ahead, every cycle',
      'Clearest stated objectives in review',
      'Lowest outcome variance in the school',
      '{leelaTimetable}',
    ],
    impact: 'Model worth publishing internally',
    action: 'Publish her planning template as the department standard and give her a mentoring role.',
  },
  {
    id: 'assessment',
    icon: 'ti ti-checkbox',
    observation: 'Strong assessment quality',
    tone: 'is-high',
    label: 'Strength',
    confidence: 88,
    why: 'Assessments set by the mathematics department discriminate well across the ability range: no question was answered correctly by everyone or by nobody. That is unusual and indicates papers built deliberately rather than reused.',
    evidence: [
      'No question at 0% or 100% correct',
      'Full spread across the ability range',
      'Papers rebuilt each term, not reused',
      'Marking rubrics published in advance',
    ],
    impact: 'Sets the internal benchmark',
    action: 'Use the mathematics papers as the worked example in the next assessment-design workshop.',
  },
];

/** Evidence lines that name a figure the register holds get it written in. */
export const evidenceOf = (finding: Finding) => {
  const leela = TEACHERS.find((row) => row.name === 'Leela Nambiar');
  const ordinals = ['', 'lightest', 'second-lightest', 'third-lightest'];
  return finding.evidence.map((line) =>
    line.replace(
      '{leelaTimetable}',
      leela
        ? `Timetable of ${periodsOf(leela)} periods, ${
            ordinals[timetableRankOf(leela)] ?? 'well inside the ceiling'
          } in the school`
        : '',
    ),
  );
};

/* ------------------------------------------------------------------ *
 * The nine dimensions                                                *
 * ------------------------------------------------------------------ */

export interface Dimension {
  id: string;
  title: string;
  reading: number;
  finding: string;
  suggestion: string;
  impact: string;
  outcome: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: 'planning',
    title: 'Lesson Planning',
    reading: 92,
    finding:
      'Thirty-eight of forty-two teachers file plans ahead of the week. The four who do not are all in humanities.',
    suggestion: 'Adopt the biology planning template across humanities.',
    impact: 'Lower outcome variance within one term.',
    outcome: 'Plans filed on time rise from 90% to an expected 100%.',
  },
  {
    id: 'engagement',
    title: 'Classroom Engagement',
    reading: 84,
    finding:
      'Engagement is at its highest all year, but four teachers account for most of the gain.',
    suggestion: 'Spread the worked-example structure beyond mathematics.',
    impact: 'Raises the floor rather than the ceiling.',
    outcome: 'Department median moves from 76 to an expected 84.',
  },
  {
    id: 'reviews',
    title: 'Assignment Review Quality',
    reading: 68,
    finding:
      'Turnaround has lengthened from three days to five across the school, driven entirely by practical work.',
    suggestion: 'Introduce structured rubrics for practical write-ups.',
    impact: 'Restores the feedback window students act within.',
    outcome: 'Turnaround returns to three days.',
  },
  {
    id: 'interaction',
    title: 'Student Interaction',
    reading: 81,
    finding: 'Small-group seating outperforms rows by eighteen points, independent of subject.',
    suggestion: 'Trial small-group seating in the two humanities rooms.',
    impact: 'Participation rises fastest where it is currently lowest.',
    outcome: '+18 points in the trial classes.',
  },
  {
    id: 'assessment',
    title: 'Assessment Quality',
    reading: 88,
    finding:
      'Mathematics papers discriminate cleanly across the ability range. Two departments still reuse last year’s papers.',
    suggestion: 'Run an assessment-design workshop using the maths papers.',
    impact: 'Better data on what students actually know.',
    outcome: 'All departments building papers fresh by next term.',
  },
  {
    id: 'consistency',
    title: 'Teaching Consistency',
    reading: 79,
    finding: 'Six teachers vary by more than fifteen points between their strongest and weakest class.',
    suggestion: 'Pair each with an observation in their weakest class.',
    impact: 'Narrows the gap between a teacher’s best and worst.',
    outcome: 'Variance halves within two terms.',
  },
  {
    id: 'innovation',
    title: 'Innovation',
    reading: 73,
    finding: 'Nine teachers changed method this year; all nine saw engagement rise. The rest changed nothing.',
    suggestion: 'Fund one method experiment per department per term.',
    impact: 'Turns nine isolated wins into a school habit.',
    outcome: 'Method changes rise from 9 to an expected 21.',
  },
  {
    id: 'development',
    title: 'Professional Development',
    reading: 66,
    finding:
      'Training completion sits at 66%. The gap is concentrated in teachers carrying the heaviest timetables.',
    suggestion: 'Protect two training periods for the four heaviest loads.',
    impact: 'Removes workload as the reason for non-completion.',
    outcome: 'Completion rises from 66% to 90%.',
  },
  {
    id: 'time',
    title: 'Time Management',
    reading: 71,
    finding:
      'Marking, planning and admin consume nine hours a week beyond contact time for the median teacher.',
    suggestion: 'Move attendance and report admin into the bulk tools.',
    impact: 'Returns roughly three hours a week to teaching.',
    outcome: 'Non-contact load falls from 9 hours to 6.',
  },
];

/** A dimension's ring tone: one scale, read the same way as the facets. */
export const ringToneOf = (reading: number) => (reading >= 80 ? 'is-high' : 'is-mid');

/** The engagement dimension is the hero's own mean, so it reads it. */
export const dimensionReadingOf = (dimension: Dimension) =>
  dimension.id === 'development' ? TRAINING_COMPLETION_PCT : dimension.reading;

/* ------------------------------------------------------------------ *
 * The coaching centre                                                *
 * ------------------------------------------------------------------ */

export interface Coaching {
  id: string;
  icon: string;
  title: string;
  note: string;
  confidence: number;
  /** Points of school-wide gain the engine expects. */
  returnValue: number;
  /** Hours a week it asks of a teacher — the other half of the stated ranking. */
  teacherHours: number;
  expected: string;
  timeline: string;
  modal: string;
}

const coaching: Coaching[] = [
  {
    id: 'workload',
    icon: 'ti ti-weight',
    title: 'Reduce Weekly Workload',
    note: 'Move five periods off the four timetables above the {ceiling}-period ceiling and onto the six below eighteen.',
    confidence: 96,
    returnValue: 12,
    teacherHours: 0.5,
    expected: '+12 sustainability',
    timeline: 'Immediate',
    modal: 'coaching_plan',
  },
  {
    id: 'interaction',
    icon: 'ti ti-messages',
    title: 'Improve Student Interaction',
    note: 'Trial small-group seating in the two humanities rooms, where participation is currently lowest.',
    confidence: 93,
    returnValue: 18,
    teacherHours: 1,
    expected: '+18 participation',
    timeline: '3 weeks',
    modal: 'coaching_plan',
  },
  {
    id: 'practical',
    icon: 'ti ti-flask',
    title: 'Increase Practical Activities',
    note: 'Two science classes have had no practical session in five weeks. Both sit below their own engagement average.',
    confidence: 91,
    returnValue: 9,
    teacherHours: 0.8,
    expected: '+9 engagement',
    timeline: 'Next term',
    modal: 'coaching_plan',
  },
  {
    id: 'training',
    icon: 'ti ti-school',
    title: 'Schedule Professional Training',
    note: 'Protect two training periods a term for the four teachers whose completion is blocked by workload.',
    confidence: 90,
    returnValue: 24,
    teacherHours: 3,
    expected: '{completion}% to 90% completion',
    timeline: 'This term',
    modal: 'assign_training',
  },
  {
    id: 'plans',
    icon: 'ti ti-layout-grid',
    title: 'Review Lesson Plans',
    note: 'Four humanities teachers file plans late. Adopting the biology template would close the gap without extra work.',
    confidence: 89,
    returnValue: 10,
    teacherHours: 1.5,
    expected: 'Lower variance',
    timeline: '2 weeks',
    modal: 'coaching_plan',
  },
  {
    id: 'observation',
    icon: 'ti ti-eye',
    title: 'Peer Observation',
    note: 'Pair the six teachers with the widest class-to-class variance with an observation in their weakest class.',
    confidence: 87,
    returnValue: 8,
    teacherHours: 2,
    expected: 'Variance halved',
    timeline: '6 weeks',
    modal: 'observation',
  },
  {
    id: 'innovation',
    icon: 'ti ti-bulb',
    title: 'Teaching Innovation',
    note: 'Fund one method experiment per department per term. All nine changes made this year raised engagement.',
    confidence: 86,
    returnValue: 13.5,
    teacherHours: 4,
    expected: '+9 to +18 each',
    timeline: 'Next term',
    modal: 'coaching_plan',
  },
  {
    id: 'leadership',
    icon: 'ti ti-crown',
    title: 'Leadership Opportunity',
    note: '{mentors} both meet the mentoring criteria and have capacity in their timetables.',
    confidence: 88,
    returnValue: 6,
    teacherHours: 2.5,
    expected: '{mentorCount} mentors added',
    timeline: 'This term',
    modal: 'development_plan',
  },
];

/** What an offer returns against the time it asks — the stated ranking. */
export const yieldOf = (row: Coaching) => row.returnValue / row.teacherHours;

export const COACHING = [...coaching].sort((a, b) => yieldOf(b) - yieldOf(a));

/** The priority an offer carries, which follows from where it ranks. */
export const PRIORITY_BANDS = [
  { upTo: 1, band: 'Critical', pill: 'is-low' },
  { upTo: 4, band: 'High', pill: 'is-mid' },
  { upTo: Infinity, band: 'Normal', pill: 'is-note' },
];

export const priorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/** Teachers the engine names as ready to mentor. */
export const MENTOR_CANDIDATES = ['Leela Nambiar', 'Teena Mathew'];

/** An offer's sentence and expectation, with the register's figures written in. */
export const coachingTextOf = (row: Coaching, field: 'note' | 'expected') =>
  row[field]
    .replace('{ceiling}', String(PERIOD_CEILING))
    .replace('{completion}', String(TRAINING_COMPLETION_PCT))
    .replace('{mentors}', MENTOR_CANDIDATES.join(' and '))
    .replace('{mentorCount}', String(MENTOR_CANDIDATES.length));

/* ------------------------------------------------------------------ *
 * Classroom intelligence, the copilot, growth and the notes          *
 * ------------------------------------------------------------------ */

export const TILES = [
  {
    id: 'balance',
    icon: 'ti ti-scale-outline',
    title: 'Teaching Balance',
    text: 'Four teachers carry more than a quarter of all contact periods while six carry less than a sixth. The spread is twice what the staffing policy allows and it is widening.',
  },
  {
    id: 'participation',
    icon: 'ti ti-hand-click',
    title: 'Classroom Participation',
    text: 'Participation is set by seating, not by subject. Small-group rooms beat rows by eighteen points regardless of who teaches or what is taught.',
  },
  {
    id: 'engagement',
    icon: 'ti ti-flame',
    title: 'Learning Engagement',
    text: 'Engagement peaks in weeks with a practical session and dips in the week after every public holiday. The dips recover without intervention; the peaks do not repeat without one.',
  },
  {
    id: 'assessment',
    icon: 'ti ti-checkbox',
    title: 'Assessment Consistency',
    text: 'Mathematics and biology build papers fresh each term and get a clean spread of results. Two departments reuse last year’s papers and get a compressed one.',
  },
  {
    id: 'homework',
    icon: 'ti ti-clock-exclamation',
    title: 'Homework Review Quality',
    text: 'Turnaround has slipped from three days to five, and the whole slip sits in practical write-ups. Theory work is still returned within two days.',
  },
  {
    id: 'feedback',
    icon: 'ti ti-message-2',
    title: 'Student Feedback',
    text: 'Students name the same three teachers when asked who explains things clearly. All three use worked examples before exercises rather than after.',
  },
  {
    id: 'strengths',
    icon: 'ti ti-star',
    title: 'Teaching Strengths',
    text: 'The school’s strongest asset is planning discipline: {plansAhead} of {reviewed} teachers file complete plans ahead of the week they teach.',
  },
  {
    id: 'growth',
    icon: 'ti ti-seedling',
    title: 'Growth Opportunities',
    text: 'The largest single gain available is not a teaching change at all: returning three admin hours a week to the median teacher would fund every other recommendation.',
  },
];

export const COPILOT = [
  {
    n: '01',
    title: 'Generate Teaching Summary',
    note: 'One page per teacher, written from the observation record',
    modal: 'teaching_summary',
  },
  {
    n: '02',
    title: 'Generate Classroom Review',
    note: 'Observation notes structured against the review framework',
    modal: 'observation',
  },
  {
    n: '03',
    title: 'Generate Professional Development Plan',
    note: 'A term of training matched to the open coaching findings',
    modal: 'development_plan',
  },
  {
    n: '04',
    title: 'Generate Student Feedback Summary',
    note: 'What students said, grouped by theme rather than by teacher',
    modal: 'teaching_summary',
  },
  {
    n: '05',
    title: 'Compare Teaching Methods',
    note: 'Sets worked-example against discussion-led across the same year group',
    modal: 'compare_teachers',
  },
  {
    n: '06',
    title: 'Generate Weekly Productivity Review',
    note: 'The week in one page for the leadership meeting',
    modal: 'export_report',
  },
  {
    n: '07',
    title: 'Create Improvement Strategy',
    note: 'What to change school-wide, ordered by what it returns',
    modal: 'coaching_plan',
  },
];

export interface JourneyLeg {
  id: string;
  n: string;
  title: string;
  on: string | null;
  note: string;
  state: 'is-done' | 'is-now' | '';
}

export const JOURNEY: JourneyLeg[] = [
  {
    id: 'joined',
    n: '01',
    title: 'Teacher Joined',
    on: '14 Jun 2021',
    note: 'Teena Mathew joined the mathematics department from a sister school, carrying 18 periods in her first term.',
    state: 'is-done',
  },
  {
    id: 'review',
    n: '02',
    title: 'AI Review Started',
    on: '02 Feb 2026',
    note: 'First full engine review across all {reviewed} teaching timetables and {observations} observation records.',
    state: 'is-done',
  },
  {
    id: 'analysis',
    n: '03',
    title: 'Teaching Analysis',
    on: '09 Feb 2026',
    note: 'Worked-example structure identified as the driver behind her engagement scores, not class composition.',
    state: 'is-done',
  },
  {
    id: 'suggested',
    n: '04',
    title: 'Coaching Suggested',
    on: '16 Feb 2026',
    note: 'Engine proposed she lead a department session rather than receive coaching herself.',
    state: 'is-done',
  },
  {
    id: 'plan',
    n: '05',
    title: 'Improvement Plan',
    on: '02 Mar 2026',
    note: 'Department-wide plan opened: four teachers adopting the structure, six-week review cycle.',
    state: 'is-done',
  },
  {
    id: 'classroom',
    n: '06',
    title: 'Classroom Review',
    on: null,
    note: 'Second observation cycle under way. Three of four adopters already above their previous best.',
    state: 'is-now',
  },
  {
    id: 'improved',
    n: '07',
    title: 'Performance Improved',
    on: null,
    note: 'Closes when all four adopters hold the gain across two consecutive review cycles.',
    state: '',
  },
];

/** The journey, with today's leg dated from the register clock. */
export const journeyLegs = () =>
  JOURNEY.map((leg) => ({
    ...leg,
    on: leg.state === 'is-now' ? RUN_DATE : leg.state === '' ? 'Pending' : (leg.on as string),
    note: leg.note
      .replace('{reviewed}', String(TEACHERS_REVIEWED))
      .replace('{observations}', String(OBSERVATIONS)),
  }));

export const BADGES = [
  {
    id: 'training',
    icon: 'ti ti-certificate',
    figure: TRAINING_COMPLETED,
    title: 'Completed Training',
    note: `of ${TEACHERS_REVIEWED} teachers, this academic year`,
  },
  {
    id: 'certifications',
    icon: 'ti ti-award',
    figure: 17,
    title: 'Teaching Certifications',
    note: 'active certifications across 6 departments',
  },
  {
    id: 'leadership',
    icon: 'ti ti-crown',
    figure: 4,
    title: 'Leadership Programmes',
    note: 'teachers enrolled, 2 completing this term',
  },
  {
    id: 'innovation',
    icon: 'ti ti-trophy',
    figure: 9,
    title: 'Innovation Awards',
    note: 'method experiments recognised this year',
  },
  {
    id: 'research',
    icon: 'ti ti-microscope',
    figure: 3,
    title: 'Research Activities',
    note: 'action-research projects under way',
  },
  {
    id: 'mentorship',
    icon: 'ti ti-users',
    figure: COACHING_PLANS_OPEN,
    title: 'Mentorship',
    note: `mentoring pairs, ${MENTOR_CANDIDATES.length} more recommended`,
  },
  {
    id: 'promotion',
    icon: 'ti ti-stairs-up',
    figure: 5,
    title: 'Promotion Readiness',
    note: 'teachers meeting every published criterion',
  },
  {
    id: 'growth',
    icon: 'ti ti-route',
    figure: 19,
    title: 'Career Growth',
    note: 'teachers with an active growth plan',
  },
];

export const NOTES = [
  {
    id: 'engaging',
    icon: 'ti ti-flame',
    title: 'Most Engaging Teachers',
    text: '{topThree} hold the top three engagement scores. All three moved to a worked-example or practical-first structure within the last year.',
  },
  {
    id: 'excellence',
    icon: 'ti ti-star',
    title: 'Teaching Excellence',
    text: 'Leela Nambiar files complete plans a week ahead in every cycle and has the lowest outcome variance in the school. Her template is the one worth publishing.',
  },
  {
    id: 'challenges',
    icon: 'ti ti-alert-circle',
    title: 'Emerging Challenges',
    text: 'Assignment turnaround has slipped from three days to five across the school. The entire slip sits in practical write-ups, not in theory work.',
  },
  {
    id: 'workload',
    icon: 'ti ti-weight',
    title: 'High Workload Alerts',
    text: '{overCeiling} teachers exceed the {ceiling}-period ceiling; one by {worstOverload} periods. Their engagement has not fallen, which means quality is currently absorbing the overload.',
  },
  {
    id: 'trends',
    icon: 'ti ti-trending-up',
    title: 'Teaching Trends',
    text: 'Nine teachers changed method this year and all nine saw engagement rise. Not one method change reduced it, which makes experimentation unusually low-risk here.',
  },
  {
    id: 'development',
    icon: 'ti ti-school',
    title: 'Professional Growth Opportunities',
    text: 'Training completion is blocked by workload rather than by willingness. The {overCeiling} teachers furthest behind are the same {overCeiling} above the period ceiling.',
  },
  {
    id: 'departments',
    icon: 'ti ti-building',
    title: 'Department Highlights',
    text: 'Mathematics leads on engagement and assessment design. Humanities leads on nothing yet, and is the department where a single seating change would move the most.',
  },
];

/** Prose that names a figure the register holds gets it written in. */
export const fillIn = (text: string) => {
  const worst = Math.max(...TEACHERS.map(overCeilingOf));
  return text
    .replace('{topThree}', topEngagement(3).map((row) => row.name).join(', '))
    .replace(/\{overCeiling\}/g, String(OVER_CEILING))
    .replace('{ceiling}', String(PERIOD_CEILING))
    .replace('{worstOverload}', String(worst))
    .replace('{plansAhead}', String(PLANS_AHEAD))
    .replace('{reviewed}', String(TEACHERS_REVIEWED));
};

/* ------------------------------------------------------------------ *
 * The featured teacher's workspace                                   *
 * ------------------------------------------------------------------ */

/** The confidences the workspace lists, and the mean it prints above them. */
export const FINDING_CONFIDENCE = [
  { label: 'Engagement driver', value: 96 },
  { label: 'Planning discipline', value: 94 },
  { label: 'Assessment design', value: 92 },
  { label: 'Workload headroom', value: 95 },
  { label: 'Mentoring readiness', value: 91 },
];

export const FINDING_CONFIDENCE_MEAN = Math.round(
  mean(FINDING_CONFIDENCE.map((entry) => entry.value)),
);

/** The featured teacher's strongest and weakest class, and the gap between. */
export const CLASS_SPREAD = {
  strongest: { name: 'VII-A', reading: 98 },
  weakest: { name: 'VIII-C', reading: 91 },
};

export const CLASS_VARIANCE = CLASS_SPREAD.strongest.reading - CLASS_SPREAD.weakest.reading;

/** The classes the observation dialog can book. */
export const CLASSES = ['VII-A · Algebra', 'VIII-C · Geometry', 'VI-B · Algebra', 'IX-A · Geometry'];

/** Adopters of the featured teacher's structure, and how many are already ahead. */
export const ADOPTERS = 4;
export const ADOPTERS_AHEAD = 3;
/** How long the gain has held. */
export const GAIN_WEEKS = 19;

/** The dates the dialogs propose, offset from the register clock. */
export const PLAN_REVIEW = addDays(RUN_DATE, 60);
export const TRAINING_START = addDays(RUN_DATE, 44);
export const OBSERVATION_ON = addDays(RUN_DATE, 11);
