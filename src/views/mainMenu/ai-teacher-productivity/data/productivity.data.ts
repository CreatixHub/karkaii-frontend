import type { TeacherModalId } from './modals.data';

/* ------------------------- 1. AI Teaching Command Center ------------------- */

export interface StageStat {
  label: string;
  value: string;
  /** The `<small>` suffix inside the figure. */
  suffix: string;
}

export const stageStats: StageStat[] = [
  { label: 'Productivity health', value: '88', suffix: '/100' },
  { label: 'Teaching effectiveness', value: '91', suffix: '% mean' },
  { label: 'Classroom engagement', value: '84', suffix: '% mean' },
  { label: 'AI coaching', value: '11', suffix: ' plans open' },
  { label: 'Last AI review', value: '06:15', suffix: ' today' },
];

export interface StageAction {
  label: string;
  icon: string;
  className: string;
  /** A dialog id, or `workspace` for the reusable offcanvas. */
  target: TeacherModalId | 'workspace';
}

export const stageActions: StageAction[] = [
  {
    label: 'Run AI Analysis',
    icon: 'ti ti-player-play',
    className: 'btn btn-primary d-inline-flex align-items-center',
    target: 'run_analysis',
  },
  {
    label: 'Generate Teaching Summary',
    icon: 'ti ti-file-text',
    className: 'btn btn-outline-light bg-white d-inline-flex align-items-center',
    target: 'teaching_summary',
  },
  {
    label: 'Explain AI Insights',
    icon: 'ti ti-bulb',
    className: 'btn btn-outline-light bg-white d-inline-flex align-items-center',
    target: 'workspace',
  },
  {
    label: 'Export Productivity Report',
    icon: 'ti ti-file-export',
    className: 'btn btn-outline-light bg-white d-inline-flex align-items-center',
    target: 'export_report',
  },
];

export interface WavePoint {
  /** Drives `--p` through `.aix-p-*`. */
  p: number;
  /** `is-dip` / `is-peak`, or bare. */
  tone: '' | 'is-dip' | 'is-peak';
}

/** 24 weeks of classroom engagement, exactly as the template's `<i>` run. */
export const engagementWave: WavePoint[] = [
  { p: 42, tone: 'is-dip' },
  { p: 55, tone: 'is-dip' },
  { p: 61, tone: '' },
  { p: 58, tone: '' },
  { p: 70, tone: '' },
  { p: 82, tone: '' },
  { p: 76, tone: '' },
  { p: 88, tone: '' },
  { p: 94, tone: 'is-peak' },
  { p: 71, tone: '' },
  { p: 63, tone: '' },
  { p: 55, tone: 'is-dip' },
  { p: 68, tone: '' },
  { p: 79, tone: '' },
  { p: 86, tone: '' },
  { p: 92, tone: 'is-peak' },
  { p: 84, tone: '' },
  { p: 73, tone: '' },
  { p: 66, tone: '' },
  { p: 58, tone: '' },
  { p: 64, tone: '' },
  { p: 77, tone: '' },
  { p: 89, tone: '' },
  { p: 96, tone: 'is-peak' },
];

/* ------------------------------ 3. Explainable AI -------------------------- */

export interface AiRecord {
  id: string;
  tone: 'is-high' | 'is-mid' | 'is-low';
  icon: string;
  observation: string;
  /** Strength / Priority / Improve, with the matching pill tint. */
  verdict: string;
  verdictTone: 'is-high' | 'is-mid' | 'is-low';
  confidence: number;
  reasoning: string;
  evidence: string[];
  impact: string;
  improvement: string;
}

export const aiRecords: AiRecord[] = [
  {
    id: 'engagement',
    tone: 'is-high',
    icon: 'ti ti-flame',
    observation: 'Excellent classroom engagement',
    verdict: 'Strength',
    verdictTone: 'is-high',
    confidence: 96,
    reasoning:
      'Volunteered student contributions in Teena Mathew’s classes run at three times the department median and have held for nineteen weeks. The rise began the week she moved to a worked-example-first structure, not at the start of a term, which rules out a calendar effect.',
    evidence: [
      'Contributions 3x department median',
      'Held for 19 consecutive weeks',
      'Rise begins at the method change, not the term',
      'Same pattern across all four of her classes',
    ],
    impact: 'Whole-department lift if adopted',
    improvement:
      'Ask her to run a twenty-minute session on the worked-example structure at the next department meeting.',
  },
  {
    id: 'workload',
    tone: 'is-low',
    icon: 'ti ti-weight',
    observation: 'Heavy teaching workload',
    verdict: 'Priority',
    verdictTone: 'is-low',
    confidence: 95,
    reasoning:
      'Meera Joshi holds 31 periods against a 26-period ceiling, and five of those fall in consecutive afternoon blocks. Her marking turnaround has lengthened from two days to six over the same period, while her engagement scores have not moved.',
    evidence: [
      '31 periods, ceiling is 26',
      'Five consecutive afternoon blocks',
      'Marking turnaround 2 days to 6',
      'Engagement unchanged — quality is absorbing the load',
    ],
    impact: 'Sustainability risk, not a quality problem',
    improvement:
      'Move the Thursday and Friday afternoon blocks to Rakesh Sharma, who has capacity on both days.',
  },
  {
    id: 'reviews',
    tone: 'is-mid',
    icon: 'ti ti-clock-exclamation',
    observation: 'Delayed assignment reviews',
    verdict: 'Improve',
    verdictTone: 'is-mid',
    confidence: 92,
    reasoning:
      'Daniel Josua returns work an average of eight days after submission against a department norm of three. The delay is concentrated entirely in practical write-ups, which take him four times as long to mark as theory work.',
    evidence: [
      'Eight day average, norm is three',
      'Delay is entirely in practical write-ups',
      'Theory returned within two days',
      'No delay before the new lab format',
    ],
    impact: 'Students lose the feedback window',
    improvement:
      'Introduce a short structured rubric for practical write-ups, as used by the biology department.',
  },
  {
    id: 'participation',
    tone: 'is-high',
    icon: 'ti ti-messages',
    observation: 'High student participation',
    verdict: 'Strength',
    verdictTone: 'is-high',
    confidence: 91,
    reasoning:
      'Across the four teachers using small-group seating, participation sits eighteen points above those using rows. The effect appears within three weeks of the change and is independent of subject or year group.',
    evidence: [
      '18 points above row seating',
      'Effect appears within 3 weeks',
      'Independent of subject and year group',
      'Four teachers, eleven classes',
    ],
    impact: 'Repeatable across the school',
    improvement: 'Trial small-group seating in the two humanities classrooms next term.',
  },
  {
    id: 'planning',
    tone: 'is-high',
    icon: 'ti ti-layout-grid',
    observation: 'Balanced lesson planning',
    verdict: 'Strength',
    verdictTone: 'is-high',
    confidence: 89,
    reasoning:
      'Leela Nambiar files complete plans a week ahead in every observed cycle, and her plans carry the clearest learning objectives in the school. Her classes show the least variance in assessment outcomes of any cohort.',
    evidence: [
      'Plans filed one week ahead, every cycle',
      'Clearest stated objectives in review',
      'Lowest outcome variance in the school',
      'Lightest timetable at 22 periods',
    ],
    impact: 'Model worth publishing internally',
    improvement: 'Publish her planning template as the department standard and give her a mentoring role.',
  },
  {
    id: 'assessment',
    tone: 'is-high',
    icon: 'ti ti-checkbox',
    observation: 'Strong assessment quality',
    verdict: 'Strength',
    verdictTone: 'is-high',
    confidence: 88,
    reasoning:
      'Assessments set by the mathematics department discriminate well across the ability range: no question was answered correctly by everyone or by nobody. That is unusual and indicates papers built deliberately rather than reused.',
    evidence: [
      'No question at 0% or 100% correct',
      'Full spread across the ability range',
      'Papers rebuilt each term, not reused',
      'Marking rubrics published in advance',
    ],
    impact: 'Sets the internal benchmark',
    improvement: 'Use the mathematics papers as the worked example in the next assessment-design workshop.',
  },
];

/* ------------------------ 4. Teaching Intelligence Center ------------------ */

export interface DimensionCard {
  id: string;
  icon: string;
  tone: 'is-high' | 'is-mid' | 'is-low';
  /** Ring fill, carried by `.aix-p-*`. */
  score: number;
  title: string;
  finding: string;
  suggestion: string;
  impact: string;
  outcome: string;
}

export const dimensionCards: DimensionCard[] = [
  {
    id: 'lesson-planning',
    icon: 'ti ti-layout-grid',
    tone: 'is-high',
    score: 92,
    title: 'Lesson Planning',
    finding:
      'Thirty-eight of forty-two teachers file plans ahead of the week. The four who do not are all in humanities.',
    suggestion: 'Adopt the biology planning template across humanities.',
    impact: 'Lower outcome variance within one term.',
    outcome: 'Plans filed on time rise from 90% to an expected 100%.',
  },
  {
    id: 'classroom-engagement',
    icon: 'ti ti-flame',
    tone: 'is-high',
    score: 84,
    title: 'Classroom Engagement',
    finding: 'Engagement is at its highest all year, but four teachers account for most of the gain.',
    suggestion: 'Spread the worked-example structure beyond mathematics.',
    impact: 'Raises the floor rather than the ceiling.',
    outcome: 'Department median moves from 76 to an expected 84.',
  },
  {
    id: 'assignment-review',
    icon: 'ti ti-clock-exclamation',
    tone: 'is-mid',
    score: 68,
    title: 'Assignment Review Quality',
    finding:
      'Turnaround has lengthened from three days to five across the school, driven entirely by practical work.',
    suggestion: 'Introduce structured rubrics for practical write-ups.',
    impact: 'Restores the feedback window students act within.',
    outcome: 'Turnaround returns to three days.',
  },
  {
    id: 'student-interaction',
    icon: 'ti ti-messages',
    tone: 'is-high',
    score: 81,
    title: 'Student Interaction',
    finding: 'Small-group seating outperforms rows by eighteen points, independent of subject.',
    suggestion: 'Trial small-group seating in the two humanities rooms.',
    impact: 'Participation rises fastest where it is currently lowest.',
    outcome: '+18 points in the trial classes.',
  },
  {
    id: 'assessment-quality',
    icon: 'ti ti-checkbox',
    tone: 'is-high',
    score: 88,
    title: 'Assessment Quality',
    finding:
      'Mathematics papers discriminate cleanly across the ability range. Two departments still reuse last year’s papers.',
    suggestion: 'Run an assessment-design workshop using the maths papers.',
    impact: 'Better data on what students actually know.',
    outcome: 'All departments building papers fresh by next term.',
  },
  {
    id: 'teaching-consistency',
    icon: 'ti ti-repeat',
    tone: 'is-mid',
    score: 79,
    title: 'Teaching Consistency',
    finding: 'Six teachers vary by more than fifteen points between their strongest and weakest class.',
    suggestion: 'Pair each with an observation in their weakest class.',
    impact: 'Narrows the gap between a teacher’s best and worst.',
    outcome: 'Variance halves within two terms.',
  },
  {
    id: 'innovation',
    icon: 'ti ti-bulb',
    tone: 'is-mid',
    score: 73,
    title: 'Innovation',
    finding: 'Nine teachers changed method this year; all nine saw engagement rise. The rest changed nothing.',
    suggestion: 'Fund one method experiment per department per term.',
    impact: 'Turns nine isolated wins into a school habit.',
    outcome: 'Method changes rise from 9 to an expected 21.',
  },
  {
    id: 'professional-development',
    icon: 'ti ti-school',
    tone: 'is-mid',
    score: 66,
    title: 'Professional Development',
    finding:
      'Training completion sits at 66%. The gap is concentrated in teachers carrying the heaviest timetables.',
    suggestion: 'Protect two training periods for the four heaviest loads.',
    impact: 'Removes workload as the reason for non-completion.',
    outcome: 'Completion rises from 66% to 90%.',
  },
  {
    id: 'time-management',
    icon: 'ti ti-hourglass',
    tone: 'is-mid',
    score: 71,
    title: 'Time Management',
    finding:
      'Marking, planning and admin consume nine hours a week beyond contact time for the median teacher.',
    suggestion: 'Move attendance and report admin into the bulk tools.',
    impact: 'Returns roughly three hours a week to teaching.',
    outcome: 'Non-contact load falls from 9 hours to 6.',
  },
];

/* ----------------------------- 5. AI Coaching Center ----------------------- */

export interface CoachingCard {
  id: string;
  icon: string;
  tone: 'is-low' | 'is-mid' | 'is-note';
  title: string;
  summary: string;
  priority: string;
  confidence: number;
  expected: string;
  timeline: string;
  target: TeacherModalId;
}

export const coachingCards: CoachingCard[] = [
  {
    id: 'reduce-workload',
    icon: 'ti ti-weight',
    tone: 'is-low',
    title: 'Reduce Weekly Workload',
    summary:
      'Move five periods off the four timetables above the 26-period ceiling and onto the six below eighteen.',
    priority: 'Critical',
    confidence: 96,
    expected: '+12 sustainability',
    timeline: 'Immediate',
    target: 'coaching_plan',
  },
  {
    id: 'student-interaction',
    icon: 'ti ti-messages',
    tone: 'is-mid',
    title: 'Improve Student Interaction',
    summary:
      'Trial small-group seating in the two humanities rooms, where participation is currently lowest.',
    priority: 'High',
    confidence: 93,
    expected: '+18 participation',
    timeline: '3 weeks',
    target: 'coaching_plan',
  },
  {
    id: 'practical-activities',
    icon: 'ti ti-flask',
    tone: 'is-mid',
    title: 'Increase Practical Activities',
    summary:
      'Two science classes have had no practical session in five weeks. Both sit below their own engagement average.',
    priority: 'High',
    confidence: 91,
    expected: '+9 engagement',
    timeline: 'Next term',
    target: 'coaching_plan',
  },
  {
    id: 'professional-training',
    icon: 'ti ti-school',
    tone: 'is-mid',
    title: 'Schedule Professional Training',
    summary:
      'Protect two training periods a term for the four teachers whose completion is blocked by workload.',
    priority: 'High',
    confidence: 90,
    expected: '66% to 90% completion',
    timeline: 'This term',
    target: 'assign_training',
  },
  {
    id: 'review-lesson-plans',
    icon: 'ti ti-layout-grid',
    tone: 'is-note',
    title: 'Review Lesson Plans',
    summary:
      'Four humanities teachers file plans late. Adopting the biology template would close the gap without extra work.',
    priority: 'Normal',
    confidence: 89,
    expected: 'Lower variance',
    timeline: '2 weeks',
    target: 'coaching_plan',
  },
  {
    id: 'peer-observation',
    icon: 'ti ti-eye',
    tone: 'is-note',
    title: 'Peer Observation',
    summary:
      'Pair the six teachers with the widest class-to-class variance with an observation in their weakest class.',
    priority: 'Normal',
    confidence: 87,
    expected: 'Variance halved',
    timeline: '6 weeks',
    target: 'observation',
  },
  {
    id: 'teaching-innovation',
    icon: 'ti ti-bulb',
    tone: 'is-note',
    title: 'Teaching Innovation',
    summary:
      'Fund one method experiment per department per term. All nine changes made this year raised engagement.',
    priority: 'Normal',
    confidence: 86,
    expected: '+9 to +18 each',
    timeline: 'Next term',
    target: 'coaching_plan',
  },
  {
    id: 'leadership-opportunity',
    icon: 'ti ti-crown',
    tone: 'is-note',
    title: 'Leadership Opportunity',
    summary:
      'Leela Nambiar and Teena Mathew both meet the mentoring criteria and have capacity in their timetables.',
    priority: 'Normal',
    confidence: 88,
    expected: '2 mentors added',
    timeline: 'This term',
    target: 'development_plan',
  },
];

/* --------------------------- 6. Classroom Intelligence --------------------- */

export interface ClassroomTile {
  id: string;
  icon: string;
  title: string;
  body: string;
}

export const classroomTiles: ClassroomTile[] = [
  {
    id: 'teaching-balance',
    icon: 'ti ti-scale-outline',
    title: 'Teaching Balance',
    body: 'Four teachers carry more than a quarter of all contact periods while six carry less than a sixth. The spread is twice what the staffing policy allows and it is widening.',
  },
  {
    id: 'classroom-participation',
    icon: 'ti ti-hand-click',
    title: 'Classroom Participation',
    body: 'Participation is set by seating, not by subject. Small-group rooms beat rows by eighteen points regardless of who teaches or what is taught.',
  },
  {
    id: 'learning-engagement',
    icon: 'ti ti-flame',
    title: 'Learning Engagement',
    body: 'Engagement peaks in weeks with a practical session and dips in the week after every public holiday. The dips recover without intervention; the peaks do not repeat without one.',
  },
  {
    id: 'assessment-consistency',
    icon: 'ti ti-checkbox',
    title: 'Assessment Consistency',
    body: 'Mathematics and biology build papers fresh each term and get a clean spread of results. Two departments reuse last year’s papers and get a compressed one.',
  },
  {
    id: 'homework-review',
    icon: 'ti ti-clock-exclamation',
    title: 'Homework Review Quality',
    body: 'Turnaround has slipped from three days to five, and the whole slip sits in practical write-ups. Theory work is still returned within two days.',
  },
  {
    id: 'student-feedback',
    icon: 'ti ti-message-2',
    title: 'Student Feedback',
    body: 'Students name the same three teachers when asked who explains things clearly. All three use worked examples before exercises rather than after.',
  },
  {
    id: 'teaching-strengths',
    icon: 'ti ti-star',
    title: 'Teaching Strengths',
    body: 'The school’s strongest asset is planning discipline: thirty-eight of forty-two teachers file complete plans ahead of the week they teach.',
  },
  {
    id: 'growth-opportunities',
    icon: 'ti ti-seedling',
    title: 'Growth Opportunities',
    body: 'The largest single gain available is not a teaching change at all: returning three admin hours a week to the median teacher would fund every other recommendation.',
  },
];

/* ------------------------------ 7. Teaching Copilot ------------------------ */

export interface CopilotAction {
  /** The `.tch-do-n` badge — "01" through "07". */
  n: string;
  title: string;
  summary: string;
  target: TeacherModalId;
}

export const copilotActions: CopilotAction[] = [
  {
    n: '01',
    title: 'Generate Teaching Summary',
    summary: 'One page per teacher, written from the observation record',
    target: 'teaching_summary',
  },
  {
    n: '02',
    title: 'Generate Classroom Review',
    summary: 'Observation notes structured against the review framework',
    target: 'observation',
  },
  {
    n: '03',
    title: 'Generate Professional Development Plan',
    summary: 'A term of training matched to the open coaching findings',
    target: 'development_plan',
  },
  {
    n: '04',
    title: 'Generate Student Feedback Summary',
    summary: 'What students said, grouped by theme rather than by teacher',
    target: 'teaching_summary',
  },
  {
    n: '05',
    title: 'Compare Teaching Methods',
    summary: 'Sets worked-example against discussion-led across the same year group',
    target: 'compare_teachers',
  },
  {
    n: '06',
    title: 'Generate Weekly Productivity Review',
    summary: 'The week in one page for the leadership meeting',
    target: 'export_report',
  },
  {
    n: '07',
    title: 'Create Improvement Strategy',
    summary: 'What to change school-wide, ordered by what it returns',
    target: 'coaching_plan',
  },
];

/* ------------------------------- 8. Teaching Journey ----------------------- */

export interface JourneyLeg {
  n: string;
  title: string;
  date: string;
  body: string;
  /** `is-done` / `is-now`, or bare for a pending stage. */
  state: '' | 'is-done' | 'is-now';
}

/** Shared by section 08 and by Stage 05 of the workspace offcanvas. */
export const journeyLegs: JourneyLeg[] = [
  {
    n: '01',
    title: 'Teacher Joined',
    date: '14 Jun 2021',
    body: 'Teena Mathew joined the mathematics department from a sister school, carrying 18 periods in her first term.',
    state: 'is-done',
  },
  {
    n: '02',
    title: 'AI Review Started',
    date: '02 Feb 2026',
    body: 'First full engine review across all 42 teaching timetables and 96 observation records.',
    state: 'is-done',
  },
  {
    n: '03',
    title: 'Teaching Analysis',
    date: '09 Feb 2026',
    body: 'Worked-example structure identified as the driver behind her engagement scores, not class composition.',
    state: 'is-done',
  },
  {
    n: '04',
    title: 'Coaching Suggested',
    date: '16 Feb 2026',
    body: 'Engine proposed she lead a department session rather than receive coaching herself.',
    state: 'is-done',
  },
  {
    n: '05',
    title: 'Improvement Plan',
    date: '02 Mar 2026',
    body: 'Department-wide plan opened: four teachers adopting the structure, six-week review cycle.',
    state: 'is-done',
  },
  {
    n: '06',
    title: 'Classroom Review',
    date: '31 Jul 2026',
    body: 'Second observation cycle under way. Three of four adopters already above their previous best.',
    state: 'is-now',
  },
  {
    n: '07',
    title: 'Performance Improved',
    date: 'Pending',
    body: 'Closes when all four adopters hold the gain across two consecutive review cycles.',
    state: '',
  },
];

/* -------------------------- 9. Professional Growth Center ------------------ */

export interface GrowthBadge {
  id: string;
  icon: string;
  tone: 'is-high' | 'is-mid' | 'is-note';
  figure: string;
  title: string;
  caption: string;
}

export const growthBadges: GrowthBadge[] = [
  {
    id: 'completed-training',
    icon: 'ti ti-certificate',
    tone: 'is-high',
    figure: '28',
    title: 'Completed Training',
    caption: 'of 42 teachers, this academic year',
  },
  {
    id: 'certifications',
    icon: 'ti ti-award',
    tone: 'is-high',
    figure: '17',
    title: 'Teaching Certifications',
    caption: 'active certifications across 6 departments',
  },
  {
    id: 'leadership',
    icon: 'ti ti-crown',
    tone: 'is-note',
    figure: '4',
    title: 'Leadership Programmes',
    caption: 'teachers enrolled, 2 completing this term',
  },
  {
    id: 'innovation-awards',
    icon: 'ti ti-trophy',
    tone: 'is-mid',
    figure: '9',
    title: 'Innovation Awards',
    caption: 'method experiments recognised this year',
  },
  {
    id: 'research',
    icon: 'ti ti-microscope',
    tone: 'is-note',
    figure: '3',
    title: 'Research Activities',
    caption: 'action-research projects under way',
  },
  {
    id: 'mentorship',
    icon: 'ti ti-users',
    tone: 'is-high',
    figure: '11',
    title: 'Mentorship',
    caption: 'mentoring pairs, 2 more recommended',
  },
  {
    id: 'promotion-readiness',
    icon: 'ti ti-stairs-up',
    tone: 'is-mid',
    figure: '5',
    title: 'Promotion Readiness',
    caption: 'teachers meeting every published criterion',
  },
  {
    id: 'career-growth',
    icon: 'ti ti-route',
    tone: 'is-note',
    figure: '19',
    title: 'Career Growth',
    caption: 'teachers with an active growth plan',
  },
];

/* ------------------------------ 10. AI Insight Center ---------------------- */

export interface InsightNote {
  id: string;
  title: string;
  body: string;
}

export const insightNotes: InsightNote[] = [
  {
    id: 'most-engaging',
    title: 'Most Engaging Teachers',
    body: 'Teena Mathew, Meera Joshi and Daniel Josua hold the top three engagement scores. All three moved to a worked-example or practical-first structure within the last year.',
  },
  {
    id: 'excellence',
    title: 'Teaching Excellence',
    body: 'Leela Nambiar files complete plans a week ahead in every cycle and has the lowest outcome variance in the school. Her template is the one worth publishing.',
  },
  {
    id: 'emerging-challenges',
    title: 'Emerging Challenges',
    body: 'Assignment turnaround has slipped from three days to five across the school. The entire slip sits in practical write-ups, not in theory work.',
  },
  {
    id: 'workload-alerts',
    title: 'High Workload Alerts',
    body: 'Four teachers exceed the 26-period ceiling; one by five periods. Their engagement has not fallen, which means quality is currently absorbing the overload.',
  },
  {
    id: 'teaching-trends',
    title: 'Teaching Trends',
    body: 'Nine teachers changed method this year and all nine saw engagement rise. Not one method change reduced it, which makes experimentation unusually low-risk here.',
  },
  {
    id: 'growth-opportunities',
    title: 'Professional Growth Opportunities',
    body: 'Training completion is blocked by workload rather than by willingness. The four teachers furthest behind are the same four above the period ceiling.',
  },
  {
    id: 'department-highlights',
    title: 'Department Highlights',
    body: 'Mathematics leads on engagement and assessment design. Humanities leads on nothing yet, and is the department where a single seating change would move the most.',
  },
];
