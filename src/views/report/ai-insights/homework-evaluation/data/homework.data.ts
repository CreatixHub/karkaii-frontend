import { addDays, daysBetween } from '../../data/dates';
import { LAST_RUN, RUN_DATE } from '../../data/registers';

export { LAST_RUN, RUN_DATE };

const mean = (values: number[]) =>
  values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;

/* ------------------------------------------------------------------ *
 * The marking run                                                    *
 * ------------------------------------------------------------------ */

/** Submissions this run read. */
export const SUBMISSIONS_MARKED = 84;
/** Those the engine released without asking. */
export const REVIEWS_COMPLETED = 75;
/** Confidence below which a score is held for a teacher rather than released. */
export const RELEASE_FLOOR = 85;
/** The engine's mean confidence across the whole run. */
export const RUN_CONFIDENCE = 92;

/** Submissions still waiting on someone's judgement. */
export const PENDING_REVIEWS = SUBMISSIONS_MARKED - REVIEWS_COMPLETED;

/** The five criteria every submission is read against, in rubric order. */
export const RUBRIC = ['concept', 'method', 'reasoning', 'accuracy', 'presentation'];

/** The assignments the picker offers. */
export const ASSIGNMENTS = [
  'Algebra Set 14',
  'Motion & Force Sheet 7',
  'Photosynthesis Lab Report',
  'All assignments',
];

/* ------------------------------------------------------------------ *
 * The scales                                                         *
 * ------------------------------------------------------------------ */

/** The grade a submission carries, from the mean of its criterion marks. */
export const GRADE_SCALE = [
  { floor: 90, grade: 'A', seal: 'is-strong' },
  { floor: 85, grade: 'A−', seal: 'is-strong' },
  { floor: 78, grade: 'B+', seal: 'is-strong' },
  { floor: 70, grade: 'B', seal: 'is-mid' },
  { floor: 55, grade: 'C+', seal: 'is-mid' },
  { floor: 45, grade: 'C', seal: 'is-mid' },
  { floor: 35, grade: 'D', seal: 'is-weak' },
  { floor: 0, grade: 'E', seal: 'is-weak' },
];

export const gradeOf = (score: number) =>
  GRADE_SCALE.find((entry) => score >= entry.floor) ?? GRADE_SCALE[GRADE_SCALE.length - 1];

/** The band a single criterion mark falls in. */
export const BAND_SCALE = [
  { floor: 80, band: 'A' },
  { floor: 60, band: 'B' },
  { floor: 40, band: 'C' },
  { floor: 0, band: 'D' },
];

export const bandOf = (mark: number) =>
  (BAND_SCALE.find((entry) => mark >= entry.floor) ?? BAND_SCALE[BAND_SCALE.length - 1]).band;

/** The three steps of the rubric strip. */
export const RUBRIC_LEVELS = [
  { floor: 80, level: 'on' },
  { floor: 55, level: 'mid' },
  { floor: 0, level: 'low' },
];

export const rubricLevelOf = (mark: number) =>
  (RUBRIC_LEVELS.find((entry) => mark >= entry.floor) ?? RUBRIC_LEVELS[2]).level;

/* ------------------------------------------------------------------ *
 * A submission                                                       *
 * ------------------------------------------------------------------ */

export interface Submission {
  id: string;
  student: string;
  studentImage: string;
  className: string;
  subject: string;
  teacher: string;
  assignment: string;
  /** Marks for concept, method, reasoning, accuracy and presentation. */
  marks: number[] | null;
  questionsSet: number;
  questionsCompleted: number;
  /** Minutes after the deadline it arrived; negative is early, null is missing. */
  lateMinutes: number | null;
  resubmitted?: boolean;
  originality: string;
  confidence: number | null;
}

const seeded: Submission[] = [
  {
    id: 'SUB-2041',
    student: 'Liam Walker',
    studentImage: 'assets/img/students/student-04.jpg',
    className: 'Class IV-B',
    subject: 'Mathematics',
    teacher: 'Teena Mathew',
    assignment: 'Algebra Set 14 · Linear Equations',
    marks: [84, 62, 44, 62, 38],
    questionsSet: 9,
    questionsCompleted: 6,
    lateMinutes: 40,
    originality: 'Original',
    confidence: 94,
  },
  {
    id: 'SUB-1876',
    student: 'Kabir Sethi',
    studentImage: 'assets/img/students/student-02.jpg',
    className: 'Class VIII-A',
    subject: 'Physics',
    teacher: 'Meera Joshi',
    assignment: 'Motion & Force · Problem Sheet 7',
    marks: [92, 90, 88, 86, 72],
    questionsSet: 9,
    questionsCompleted: 9,
    lateMinutes: 0,
    originality: 'Original',
    confidence: 96,
  },
  {
    id: 'SUB-1655',
    student: 'George Kettut',
    studentImage: 'assets/img/students/student-06.jpg',
    className: 'Class II-A',
    subject: 'English',
    teacher: 'Daniel Josua',
    assignment: 'Descriptive Writing · A Rainy Day',
    marks: [84, 68, 82, 66, 64],
    questionsSet: 4,
    questionsCompleted: 4,
    lateMinutes: 0,
    originality: 'Review needed',
    confidence: 79,
  },
  {
    id: 'SUB-1420',
    student: 'Sophia Reyes',
    studentImage: 'assets/img/students/student-03.jpg',
    className: 'Class VIII-A',
    subject: 'Science',
    teacher: 'Leela Nambiar',
    assignment: 'Photosynthesis · Lab Report',
    marks: [96, 94, 92, 90, 88],
    questionsSet: 7,
    questionsCompleted: 7,
    lateMinutes: 0,
    originality: 'Original',
    confidence: 97,
  },
  {
    id: 'SUB-1198',
    student: 'Aarav Menon',
    studentImage: 'assets/img/students/student-05.jpg',
    className: 'Class VI-B',
    subject: 'Mathematics',
    teacher: 'Priya Sundaram',
    assignment: 'Fractions · Word Problems',
    marks: [88, 84, 74, 82, 70],
    questionsSet: 8,
    questionsCompleted: 8,
    lateMinutes: 0,
    resubmitted: true,
    originality: 'Original',
    confidence: 91,
  },
  {
    id: 'SUB-1042',
    student: 'Maria Fernandes',
    studentImage: 'assets/img/students/student-07.jpg',
    className: 'Class IX-C',
    subject: 'History',
    teacher: 'Rakesh Sharma',
    assignment: 'Industrial Revolution · Source Essay',
    marks: null,
    questionsSet: 5,
    questionsCompleted: 0,
    lateMinutes: null,
    originality: 'Awaiting',
    confidence: null,
  },
];

export const SUBMISSIONS = seeded;

/** The submission the page explains in full. */
export const FEATURED = SUBMISSIONS[0];

/** The mean of a submission's criterion marks, or null when it was never handed in. */
export const scoreOf = (row: Submission) => (row.marks ? Math.round(mean(row.marks)) : null);

/** The grade, or null. */
export const gradeFor = (row: Submission) => {
  const score = scoreOf(row);
  return score === null ? null : gradeOf(score);
};

/** The rubric strip, one step per criterion. */
export const rubricStripOf = (row: Submission) =>
  row.marks ? row.marks.map(rubricLevelOf) : RUBRIC.map(() => 'low');

/** Each criterion with its mark and the band it falls in. */
export const criteriaOf = (row: Submission) =>
  RUBRIC.map((label, index) => ({
    label,
    mark: row.marks ? row.marks[index] : null,
    band: row.marks ? bandOf(row.marks[index]) : null,
  }));

/** How much of the set was finished. */
export const completionPctOf = (row: Submission) =>
  row.questionsSet === 0 ? 0 : Math.round((row.questionsCompleted / row.questionsSet) * 100);

/** What the card says about when it arrived. */
export const punctualityOf = (row: Submission) => {
  if (row.lateMinutes === null) return 'Not submitted';
  if (row.resubmitted) return 'Resubmitted';
  return row.lateMinutes > 0 ? 'Submitted late' : 'On time';
};

/** The tone that goes with it. */
export const punctualityToneOf = (row: Submission) => {
  if (row.lateMinutes === null) return 'is-weak';
  if (row.lateMinutes > 0) return 'is-mid';
  return row.resubmitted ? 'is-note' : 'is-strong';
};

/** How the completion cell reads. */
export const completionLabelOf = (row: Submission) => {
  const state =
    row.questionsCompleted === 0
      ? 'Missing'
      : row.questionsCompleted === row.questionsSet
        ? 'Complete'
        : 'Partial';
  return `${state} · ${row.questionsCompleted} of ${row.questionsSet}`;
};

/** Whether the engine held this one back for a teacher. */
export const isFlaggedOf = (row: Submission) =>
  row.confidence === null || row.confidence < RELEASE_FLOOR;

/** How long past the deadline it arrived, said the way the timeline says it. */
export const latenessLabelOf = (row: Submission) =>
  row.lateMinutes === null
    ? 'Never received'
    : row.lateMinutes === 0
      ? 'On time'
      : `${row.lateMinutes} minutes late`;

/* ------------------------------------------------------------------ *
 * The findings                                                       *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  observation: string;
  tone: 'is-strong' | 'is-mid' | 'is-weak';
  label: string;
  confidence: number;
  why: string;
  evidence: { icon: string; text: string }[];
  suggestion: string;
  impact: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'concept',
    icon: 'ti ti-bulb',
    observation: 'Excellent concept understanding',
    tone: 'is-strong',
    label: 'Strength',
    confidence: 96,
    why: 'Every question was set up correctly before any arithmetic began. Where the method was right and the answer wrong, the error was always in the final step, never in the approach. That separation is the clearest signal that the concept itself is secure.',
    evidence: [
      { icon: 'ti ti-check', text: 'Correct setup in 9 of 9 questions' },
      { icon: 'ti ti-target', text: 'All errors in final arithmetic step' },
      { icon: 'ti ti-repeat', text: 'Consistent across three sets' },
    ],
    suggestion: 'Move to the extension problems for this unit; the standard set is no longer informative.',
    impact: 'Reinforces the topic',
  },
  {
    id: 'incomplete',
    icon: 'ti ti-square-half',
    observation: 'Incomplete solution',
    tone: 'is-weak',
    label: 'Priority',
    confidence: 94,
    why: 'Three of nine questions stop partway through. Each break occurs at the point where the working requires a second substitution, and each abandoned attempt was otherwise correct up to that step.',
    evidence: [
      { icon: 'ti ti-x', text: '3 of 9 left unfinished' },
      { icon: 'ti ti-arrow-down-right', text: 'All stop at the second substitution' },
      { icon: 'ti ti-clock', text: 'Submitted 40 minutes late' },
    ],
    suggestion: 'Set four questions that isolate the second substitution step and nothing else.',
    impact: 'Blocks the next unit',
  },
  {
    id: 'reasoning',
    icon: 'ti ti-message-off',
    observation: 'Weak logical explanation',
    tone: 'is-mid',
    label: 'Improve',
    confidence: 90,
    why: 'Answers are correct but unexplained. Where the rubric asks the student to justify a step, the response gives the result again rather than the reason. The understanding is present; the articulation of it is not.',
    evidence: [
      { icon: 'ti ti-file-text', text: 'Justification missing in 6 of 9' },
      { icon: 'ti ti-check', text: 'Answers correct regardless' },
      { icon: 'ti ti-book', text: 'Same pattern in the last two sets' },
    ],
    suggestion: 'Ask for one sentence of reasoning per answer before the numerical result.',
    impact: 'Affects marks, not understanding',
  },
  {
    id: 'creativity',
    icon: 'ti ti-bulb-filled',
    observation: 'Strong creativity',
    tone: 'is-strong',
    label: 'Strength',
    confidence: 89,
    why: 'Question 7 was solved by a method not taught in class. The approach is valid, shorter than the taught method, and the student showed why it works rather than simply asserting it.',
    evidence: [
      { icon: 'ti ti-star', text: 'Untaught but valid method' },
      { icon: 'ti ti-route', text: 'Fewer steps than the model answer' },
      { icon: 'ti ti-message', text: 'Method justified in writing' },
    ],
    suggestion: 'Ask the student to present this method to the class.',
    impact: 'Worth recognising',
  },
  {
    id: 'grammar',
    icon: 'ti ti-abc',
    observation: 'Grammar improvements needed',
    tone: 'is-mid',
    label: 'Improve',
    confidence: 87,
    why: 'Fourteen sentence-level errors across the written sections, concentrated in tense agreement. None of them obscure the mathematical meaning, so they carry no penalty under this rubric.',
    evidence: [
      { icon: 'ti ti-pencil', text: '14 errors, mostly tense' },
      { icon: 'ti ti-shield-check', text: 'Meaning never obscured' },
      { icon: 'ti ti-percentage', text: 'No rubric penalty applied' },
    ],
    suggestion: 'Attach the tense-agreement practice sheet as optional follow-up.',
    impact: 'Presentation only',
  },
  {
    id: 'presentation',
    icon: 'ti ti-layout-board',
    observation: 'Presentation can improve',
    tone: 'is-mid',
    label: 'Improve',
    confidence: 85,
    why: 'Working is unlabelled and runs across the page rather than down it. Two answers were difficult to locate. The rubric awards four marks for presentation and this submission earned one.',
    evidence: [
      { icon: 'ti ti-ruler', text: 'Working unlabelled throughout' },
      { icon: 'ti ti-search', text: 'Two answers hard to locate' },
      { icon: 'ti ti-award', text: '1 of 4 presentation marks' },
    ],
    suggestion: 'Share the worked-example layout sheet and remark the presentation criterion only.',
    impact: 'Costs marks under the rubric',
  },
];

/** The confidences the workspace lists, and the mean it prints above them. */
export const CRITERION_CONFIDENCE = [
  { label: 'Concept understanding', value: 96 },
  { label: 'Completion', value: 94 },
  { label: 'Reasoning quality', value: 90 },
  { label: 'Creativity', value: 89 },
  { label: 'Grammar', value: 87 },
  { label: 'Presentation', value: 85 },
];

export const CRITERION_CONFIDENCE_MEAN = Math.round(
  mean(CRITERION_CONFIDENCE.map((entry) => entry.value)),
);

/* ------------------------------------------------------------------ *
 * The learning gaps                                                  *
 * ------------------------------------------------------------------ */

export interface Gap {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  finding: string;
  suggestion: string;
  outcome: string;
}

export const GAPS: Gap[] = [
  {
    id: 'concept',
    title: 'Concept Understanding',
    severity: 'Low',
    finding: 'Secure. Every question was set up correctly before calculation, across three consecutive sets.',
    suggestion: 'Move to extension problems; the standard set no longer tells you anything new.',
    outcome: 'Sustains the band and keeps the student stretched.',
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    severity: 'Critical',
    finding: 'Three of nine questions abandoned at the second substitution, each correct up to that point.',
    suggestion: 'Set four questions that isolate the second substitution and nothing else.',
    outcome: 'Completion rises from 67% to an expected 95%.',
  },
  {
    id: 'critical-thinking',
    title: 'Critical Thinking',
    severity: 'Low',
    finding: 'Solved question 7 by an untaught method and justified why it works rather than asserting it.',
    suggestion: 'Ask the student to present the alternative method to the class.',
    outcome: 'Converts a private strength into a shared one.',
  },
  {
    id: 'writing',
    title: 'Writing Quality',
    severity: 'High',
    finding: 'Answers are correct but unexplained; justification is missing in six of nine responses.',
    suggestion: 'Require one sentence of reasoning before each numerical answer.',
    outcome: 'Recovers the six reasoning marks lost on this set.',
  },
  {
    id: 'presentation',
    title: 'Presentation',
    severity: 'High',
    finding: 'Working runs across the page rather than down it and is unlabelled throughout.',
    suggestion: 'Share the worked-example layout sheet and remark presentation only.',
    outcome: 'Recovers three of four presentation marks within one set.',
  },
  {
    id: 'creativity',
    title: 'Creativity',
    severity: 'Low',
    finding: 'Consistently finds shorter routes when the taught method is long. This is a durable trait, not a one-off.',
    suggestion: 'Offer the open-ended problem set as an optional extension.',
    outcome: 'Keeps a capable student from coasting.',
  },
  {
    id: 'time',
    title: 'Time Management',
    severity: 'High',
    finding: 'Submitted forty minutes late with the final three questions unfinished. The pattern repeats on longer sets.',
    suggestion: 'Break the next long set into two shorter submissions with separate deadlines.',
    outcome: 'Removes set length as the cause of lateness.',
  },
  {
    id: 'research',
    title: 'Research Skills',
    severity: 'Medium',
    finding: 'Sources are used but not cited. Two claims in the written section come from outside the taught material.',
    suggestion: 'Attach the citation guide and ask for a source line under each external claim.',
    outcome: 'Practice established before it matters for marks.',
  },
];

/**
 * A gap's tone. A low gap is a strength, a critical one is the finding — so the
 * severity reads backwards from the usual direction.
 */
export const gapToneOf = (severity: Gap['severity']) =>
  severity === 'Low' ? 'is-strong' : severity === 'Critical' ? 'is-weak' : 'is-mid';

/** Gaps the engine calls critical. */
export const CRITICAL_GAPS = GAPS.filter((gap) => gap.severity === 'Critical').length;

/* ------------------------------------------------------------------ *
 * The feedback centre                                                *
 * ------------------------------------------------------------------ */

export interface FeedbackAction {
  id: string;
  icon: string;
  title: string;
  note: string;
  confidence: number;
  /** Marks the engine expects it to return. */
  gain: number;
  /** Hours of teacher or student time it asks for. */
  hours: number;
  expected: string;
  modal: string;
}

const feedback: FeedbackAction[] = [
  {
    id: 'practice',
    icon: 'ti ti-math-symbols',
    title: 'Provide Additional Practice',
    note: 'Four questions isolating the second substitution step, where every abandoned attempt broke down.',
    confidence: 96,
    gain: 18,
    hours: 0.5,
    expected: '+18 completion',
    modal: 'generate_practice',
  },
  {
    id: 'revision',
    icon: 'ti ti-rotate',
    title: 'Assign Revision',
    note: 'Re-attempt the three unfinished questions with the working laid out down the page.',
    confidence: 94,
    gain: 12,
    hours: 0.4,
    expected: '+12 marks',
    modal: 'learning_plan',
  },
  {
    id: 'video',
    icon: 'ti ti-player-play',
    title: 'Recommend Video Lesson',
    note: 'The eight-minute substitution walkthrough, which matches the format this student responds to.',
    confidence: 91,
    gain: 9,
    hours: 0.35,
    expected: '+9 marks',
    modal: 'learning_plan',
  },
  {
    id: 'discussion',
    icon: 'ti ti-message-circle',
    title: 'Schedule Teacher Discussion',
    note: 'Ten minutes on why the reasoning sentence matters, not on the mathematics itself.',
    confidence: 90,
    gain: 6,
    hours: 0.3,
    expected: '+6 reasoning marks',
    modal: 'generate_feedback',
  },
  {
    id: 'parent',
    icon: 'ti ti-mail-star',
    title: 'Parent Follow-up',
    note: 'A short note on the late submission pattern, which has now repeated on three long sets.',
    confidence: 87,
    gain: 4,
    hours: 0.25,
    expected: 'Punctuality',
    modal: 'parent_summary',
  },
  {
    id: 'peer',
    icon: 'ti ti-users',
    title: 'Peer Learning',
    note: 'Pair with Kabir Sethi, whose presentation earned full marks on the same set.',
    confidence: 88,
    gain: 3,
    hours: 0.5,
    expected: '+3 presentation',
    modal: 'compare_submissions',
  },
  {
    id: 'challenge',
    icon: 'ti ti-trophy',
    title: 'Challenge Assignment',
    note: 'The open-ended problem set, given the untaught method used on question 7.',
    confidence: 89,
    gain: 5,
    hours: 1,
    expected: 'Sustains engagement',
    modal: 'learning_plan',
  },
  {
    id: 'reading',
    icon: 'ti ti-book',
    title: 'Extra Reading Material',
    note: 'The tense-agreement sheet, offered as optional follow-up rather than as correction.',
    confidence: 85,
    gain: 2,
    hours: 0.5,
    expected: 'Writing quality',
    modal: 'learning_plan',
  },
];

/** Marks returned against the time asked for — how the centre orders itself. */
export const yieldOf = (row: FeedbackAction) => row.gain / row.hours;

export const FEEDBACK = [...feedback].sort((a, b) => yieldOf(b) - yieldOf(a));

export const PRIORITY_BANDS = [
  { upTo: 2, band: 'Critical', tag: 'is-weak' },
  { upTo: 4, band: 'High', tag: 'is-mid' },
  { upTo: Infinity, band: 'Normal', tag: 'is-note' },
];

export const priorityOf = (rank: number) =>
  PRIORITY_BANDS.find((entry) => rank <= entry.upTo) ?? PRIORITY_BANDS[2];

/* ------------------------------------------------------------------ *
 * The quality studio, the copilot and the insights                   *
 * ------------------------------------------------------------------ */

export const QUALITY = [
  {
    id: 'assignment',
    grade: 'A−',
    title: 'Assignment Quality',
    text: 'Work is set up correctly and finished carefully where it is finished at all. The losses come from abandoned questions, not from poor work.',
  },
  {
    id: 'consistency',
    grade: 'B',
    title: 'Submission Consistency',
    text: 'Twelve of fourteen sets submitted. The two misses and the three late submissions all fall on sets longer than eight questions.',
  },
  {
    id: 'progress',
    grade: 'A',
    title: 'Learning Progress',
    text: 'Moved two rubric bands on concept understanding across the term while the class average moved half a band.',
  },
  {
    id: 'retention',
    grade: 'A',
    title: 'Knowledge Retention',
    text: 'Correctly used a method taught six weeks earlier without prompting. Retention is well ahead of the cohort.',
  },
  {
    id: 'subject',
    grade: 'B+',
    title: 'Subject Understanding',
    text: 'Secure across linear equations and substitution. The one soft area is simultaneous equations, seen only twice so far.',
  },
  {
    id: 'improvement',
    grade: 'C+',
    title: 'Improvement Areas',
    text: 'Presentation and written justification. Neither reflects understanding; both cost marks under the published rubric.',
  },
  {
    id: 'strengths',
    grade: 'A',
    title: 'Strength Indicators',
    text: 'Finds shorter routes than the taught method and can explain why they work. This has now appeared on four separate sets.',
  },
  {
    id: 'habits',
    grade: 'C',
    title: 'Study Habits',
    text: 'Work begins late and finishes in a rush. The last third of every long set is measurably weaker than the first two thirds.',
  },
];

export const COPILOT = [
  {
    icon: 'ti ti-notes',
    title: 'Generate Teacher Feedback',
    note: 'Marking notes for your own record, written against the rubric.',
    modal: 'generate_feedback',
  },
  {
    icon: 'ti ti-message-2',
    title: 'Generate Student Feedback',
    note: 'Addressed to the student, specific and free of grading language.',
    modal: 'generate_feedback',
  },
  {
    icon: 'ti ti-mail-star',
    title: 'Generate Parent Summary',
    note: 'One short paragraph, no scores without the context around them.',
    modal: 'parent_summary',
  },
  {
    icon: 'ti ti-list-check',
    title: 'Generate Rubric',
    note: 'A criteria set for the next assignment, derived from this one.',
    modal: 'run_evaluation',
  },
  {
    icon: 'ti ti-route',
    title: 'Generate Learning Plan',
    note: 'Four weeks with owners, activities and a target figure.',
    modal: 'learning_plan',
  },
  {
    icon: 'ti ti-math-symbols',
    title: 'Generate Practice Questions',
    note: 'Targeted at the exact step where the working broke down.',
    modal: 'generate_practice',
  },
  {
    icon: 'ti ti-bulb',
    title: 'Generate Improvement Strategy',
    note: 'What to change in how the work is set, not only in what is set.',
    modal: 'learning_plan',
  },
];

export const OPPORTUNITIES = [
  { id: 'practice', icon: 'ti ti-math-symbols', title: 'Extra Practice', note: 'Four questions on the second substitution step', cta: 'Add to plan', modal: 'generate_practice' },
  { id: 'revision', icon: 'ti ti-rotate', title: 'Revision Sessions', note: 'Two short sessions before the next set is issued', cta: 'Add to plan', modal: 'learning_plan' },
  { id: 'advanced', icon: 'ti ti-trophy', title: 'Advanced Assignments', note: 'The open-ended problem set for this unit', cta: 'Add to plan', modal: 'learning_plan' },
  { id: 'competitions', icon: 'ti ti-award', title: 'Competitions', note: 'Junior mathematics olympiad, entries close 20 Sep', cta: 'Review fit', modal: 'learning_plan' },
  { id: 'resources', icon: 'ti ti-file-text', title: 'Learning Resources', note: 'Worked-example layout sheet and citation guide', cta: 'Attach', modal: 'generate_feedback' },
  { id: 'courses', icon: 'ti ti-player-play', title: 'AI Suggested Courses', note: 'Substitution walkthrough, eight minutes', cta: 'Attach', modal: 'generate_feedback' },
  { id: 'plan', icon: 'ti ti-route', title: 'Personalized Learning', note: 'A four-week plan built from this evaluation', cta: 'Build plan', modal: 'learning_plan' },
];

export const INSIGHTS = [
  {
    n: '01',
    title: 'Common Mistakes',
    text: 'Thirty-one of {marked} submissions break at the second substitution. This is not {marked} individual difficulties; it is one teaching gap appearing {marked} times.',
  },
  {
    n: '02',
    title: 'Top Performing Students',
    text: '{topThree} scored above 88 on every criterion. All three laid their working down the page rather than across it.',
  },
  {
    n: '03',
    title: 'Frequently Missed Topics',
    text: 'Simultaneous equations were attempted by 62 students and completed correctly by 19. No other topic in this set falls below 70% completion.',
  },
  {
    n: '04',
    title: 'Strong Learning Patterns',
    text: 'Students who wrote a reasoning sentence before each answer scored 11 marks higher on average, whether or not the answer itself was correct.',
  },
  {
    n: '05',
    title: 'Weak Concepts',
    text: 'Substitution into a second expression is the single weakest concept in the year group. It underlies four of the six most-missed questions.',
  },
  {
    n: '06',
    title: 'Recommended Teaching Strategy',
    text: 'Reteach the second substitution as a standalone step before the next set, using the shorter method George Kettut arrived at independently.',
  },
  {
    n: '07',
    title: 'Emerging Learning Trends',
    text: 'Late submissions have risen from 8% to 19% this term and cluster entirely on sets longer than eight questions. Set length, not difficulty, predicts lateness.',
  },
];

/** Students scoring above the bar on every criterion. */
export const topScorers = (bar: number) =>
  SUBMISSIONS.filter((row) => row.marks && row.marks.every((mark) => mark > bar));

/** Prose that names a figure the register holds gets it written in. */
export const fillIn = (text: string) =>
  text
    .replace(/\{marked\}/g, String(SUBMISSIONS_MARKED))
    .replace('{topThree}', [...topScorers(88).map((row) => row.student), 'Nathan Cole'].join(', '))
    .replace('{pending}', String(PENDING_REVIEWS));

/* ------------------------------------------------------------------ *
 * The timeline, and the plan                                         *
 * ------------------------------------------------------------------ */

/** The day the featured assignment was issued, and the day it was due. */
export const ISSUED_ON = '24 Jul 2026';
export const ISSUED_AT = '09:00';
export const DUE_DAYS = 4;
export const DUE_AT = '22:00';

export const DUE_ON = addDays(ISSUED_ON, DUE_DAYS);
export const RECEIVED_ON = DUE_ON;

export interface TimelineStep {
  id: string;
  title: string;
  /** Days after the assignment was issued, or null when it has not happened. */
  offsetDays: number | null;
  at: string;
  note: string;
}

export const TIMELINE: TimelineStep[] = [
  {
    id: 'assigned',
    title: 'Homework Assigned',
    offsetDays: 0,
    at: ISSUED_AT,
    note: 'Algebra Set 14 issued to Class VIII-A with the published rubric attached.',
  },
  {
    id: 'received',
    title: 'Submission Received',
    offsetDays: DUE_DAYS,
    at: '22:40',
    note: 'Received forty minutes after the deadline with three questions unfinished.',
  },
  {
    id: 'evaluated',
    title: 'AI Evaluation Started',
    offsetDays: DUE_DAYS + 1,
    at: LAST_RUN,
    note: 'Engine read the submission against all five rubric criteria and recorded its evidence.',
  },
  {
    id: 'review',
    title: 'Teacher Review',
    offsetDays: null,
    at: 'Pending',
    note: `Flagged for judgement: originality confidence sits below the ${RELEASE_FLOOR}% threshold for auto-release.`,
  },
  {
    id: 'feedback',
    title: 'Feedback Generated',
    offsetDays: null,
    at: 'Pending',
    note: 'Student, teacher and parent versions will be drafted once the review is confirmed.',
  },
  {
    id: 'revision',
    title: 'Student Revision',
    offsetDays: null,
    at: 'Pending',
    note: 'Three unfinished questions to be re-attempted with the working laid out down the page.',
  },
  {
    id: 'completed',
    title: 'Evaluation Completed',
    offsetDays: null,
    at: 'Pending',
    note: 'Final marks recorded and the learning plan updated with the outcome.',
  },
];

/** The timeline, dated from the day the work was set. */
export const timelineSteps = () =>
  TIMELINE.map((step) => {
    const on = step.offsetDays === null ? null : addDays(ISSUED_ON, step.offsetDays);
    const done = on !== null && daysBetween(on, RUN_DATE) >= 0;
    return {
      ...step,
      on,
      done,
      when: on ? `${on.split(' ').slice(0, 2).join(' ')} · ${step.at}` : step.at,
    };
  });

/** Where the plan stands. */
export const PLAN = {
  focus: 'Second substitution',
  weeks: 4,
  owner: 'Teena Mathew',
  checkpoint: 'Weekly, Friday',
  target: 'Band B on all criteria',
  completionTarget: 95,
  weekly: [
    { week: 1, work: 'Substitution drill, 4 questions' },
    { week: 2, work: 'Full set with layout sheet' },
    { week: 3, work: 'Reasoning sentence per answer' },
    { week: 4, work: 'Timed set, no support' },
  ],
};

export const PLAN_REVIEW = addDays(RUN_DATE, 27);

/** Students the engine matched the featured submission against. */
export const SIMILAR = [
  { name: 'Nathan Cole', className: 'VII-A', note: 'Same gap, closed' },
  { name: 'Zara Ahmed', className: 'V-C', note: 'Same gap, open' },
  { name: 'Iris Kapoor', className: 'VIII-C', note: 'Same presentation issue' },
];

/** How many of the run share the featured submission's gap. */
export const COHORT_WITH_GAP = 31;

/** The featured submission's topic breakdown. */
export const TOPICS = [
  { label: 'Linear equations', mark: 86 },
  { label: 'Substitution · first', mark: 84 },
  { label: 'Substitution · second', mark: 34 },
  { label: 'Simultaneous equations', mark: 48 },
  { label: 'Word problems', mark: 66 },
];
