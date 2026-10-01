import { addDays, daysBetween } from '../../data/dates';
import { RUN_DATE } from '../../data/registers';

export { RUN_DATE };

/* ------------------------------------------------------------------ *
 * The student, and the day                                           *
 * ------------------------------------------------------------------ */

export const STUDENT = {
  name: 'Liam Walker',
  firstName: 'Liam',
  className: 'Class IV-B',
  image: 'assets/img/students/student-04.jpg',
};

/** When the term exams start. */
export const EXAM_ON = addDays(RUN_DATE, 17);

/** Days between now and the first paper. */
export const DAYS_TO_EXAM = daysBetween(RUN_DATE, EXAM_ON);

/** What the page is looking at. */
export const RANGES = ['Today', 'This week', 'This term'];

/** The one thing the assistant built today around. */
export const MISSION = {
  title: 'Finish the substitution set, then twenty minutes of reading',
  focus: 'Algebra notation',
  readiness: 'High',
};

/* ------------------------------------------------------------------ *
 * The day's blocks                                                   *
 * ------------------------------------------------------------------ */

export interface Block {
  id: string;
  at: string;
  icon: string;
  title: string;
  note: string;
  minutes: number;
  difficulty: 'Low' | 'Medium' | 'High';
  done: boolean;
  /** Whether the block counts toward today's mission. */
  mission: boolean;
}

export const BLOCKS: Block[] = [
  { id: 'morning', at: '07:30', icon: 'ti ti-sun', title: 'Morning Study', note: 'Read through yesterday’s science notes', minutes: 15, difficulty: 'Low', done: true, mission: true },
  { id: 'practice', at: '15:45', icon: 'ti ti-math-symbols', title: 'Practice Session', note: 'Four substitution questions — the priority today', minutes: 20, difficulty: 'High', done: true, mission: true },
  { id: 'homework', at: '16:15', icon: 'ti ti-notebook', title: 'Homework Session', note: 'English response, the last one outstanding', minutes: 30, difficulty: 'Medium', done: false, mission: true },
  { id: 'revision', at: '16:50', icon: 'ti ti-rotate', title: 'Revision Session', note: 'Photosynthesis and forces — a light pass only', minutes: 10, difficulty: 'Low', done: false, mission: false },
  { id: 'test', at: '17:05', icon: 'ti ti-clipboard-text', title: 'Practice Test', note: 'Half an algebra paper under timed conditions', minutes: 25, difficulty: 'High', done: false, mission: true },
  { id: 'reading', at: '17:35', icon: 'ti ti-book', title: 'Reading Time', note: 'Extension set, twenty minutes', minutes: 20, difficulty: 'Medium', done: false, mission: true },
  { id: 'project', at: '18:00', icon: 'ti ti-flask', title: 'Project Work', note: 'Science exhibition entry — optional if time allows', minutes: 30, difficulty: 'Low', done: false, mission: false },
  { id: 'exam-prep', at: '18:30', icon: 'ti ti-file-certificate', title: 'Exam Preparation', note: 'Review the eighteen-day plan and tick today off', minutes: 10, difficulty: 'Medium', done: false, mission: false },
];

/** The blocks that make up today's mission. */
export const MISSION_BLOCKS = BLOCKS.filter((block) => block.mission);
export const MISSION_DONE = MISSION_BLOCKS.filter((block) => block.done).length;
export const MISSION_STEPS = MISSION_BLOCKS.length;
export const MISSION_PCT = Math.round((MISSION_DONE / MISSION_STEPS) * 100);

/** Minutes still to do today, across everything not yet ticked off. */
export const MINUTES_LEFT = BLOCKS.filter((block) => !block.done).reduce(
  (total, block) => total + block.minutes,
  0,
);

/** The same, said the way the page says it. */
export const timeLeftLabel = () => {
  const hours = Math.floor(MINUTES_LEFT / 60);
  const minutes = MINUTES_LEFT % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours} hr ${minutes} min`;
};

/** How a difficulty is chipped. */
export const difficultyToneOf = (difficulty: Block['difficulty']) =>
  difficulty === 'High' ? 'is-hot' : difficulty === 'Medium' ? 'is-now' : 'is-go';

/* ------------------------------------------------------------------ *
 * The streak                                                         *
 * ------------------------------------------------------------------ */

/**
 * The study log, oldest first — minutes studied each day across four weeks.
 * A zero is a day not studied, which is where a streak ends.
 */
export const STUDY_LOG = [
  42, 0, 38, 0, 0, 45, 60, 58, 25, 52, 62, 40, 58, 22, 48, 45, 60, 55, 58, 62, 28, 50, 44, 65,
  58, 60, 45, 55,
];

/** Which shade a day gets: none for a rest day, then by how long it ran. */
export const streakCells = () =>
  STUDY_LOG.map((minutes) =>
    minutes === 0 ? '' : minutes >= 55 ? 'd3' : minutes >= 35 ? 'd2' : 'd1',
  );

/** The run of study days ending today. */
export const STREAK = (() => {
  let days = 0;
  for (let index = STUDY_LOG.length - 1; index >= 0; index -= 1) {
    if (STUDY_LOG[index] === 0) break;
    days += 1;
  }
  return days;
})();

/** The longest run anywhere in the log, which is what "best yet" is measured on. */
export const LONGEST_STREAK = (() => {
  let best = 0;
  let run = 0;
  STUDY_LOG.forEach((minutes) => {
    run = minutes === 0 ? 0 : run + 1;
    best = Math.max(best, run);
  });
  return best;
})();

export const STREAK_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

/** Sessions this week, and how long the average one ran. */
export const SESSIONS_THIS_WEEK = STUDY_LOG.slice(-7).filter((minutes) => minutes > 0).length;
export const AVERAGE_SESSION = Math.round(
  STUDY_LOG.filter((minutes) => minutes > 0).reduce((total, minutes) => total + minutes, 0) /
    STUDY_LOG.filter((minutes) => minutes > 0).length,
);
export const LONGEST_SESSION = Math.max(...STUDY_LOG);

/* ------------------------------------------------------------------ *
 * What is on the student's plate                                     *
 * ------------------------------------------------------------------ */

export interface Task {
  id: string;
  icon: string;
  title: string;
  status: string;
  statusTone: string;
  note: string;
  meta: string;
  difficulty: Block['difficulty'];
  cta: string;
  modal: string;
}

export const TASKS: Task[] = [
  { id: 'priorities', icon: 'ti ti-target-arrow', title: 'Today’s Priorities', status: 'In progress', statusTone: 'is-now', note: 'Do the substitution set before anything else. It is the one thing holding your maths grade down.', meta: '45 min', difficulty: 'High', cta: 'Continue', modal: 'study_plan' },
  { id: 'exams', icon: 'ti ti-file-certificate', title: 'Upcoming Exams', status: `In ${DAYS_TO_EXAM} days`, statusTone: 'is-soon', note: `Term exams start ${EXAM_ON.split(' ').slice(0, 2).join(' ')}. Algebra and comprehension carry the most marks for you.`, meta: `${DAYS_TO_EXAM} days`, difficulty: 'High', cta: 'View Details', modal: 'exam_strategy' },
  { id: 'homework', icon: 'ti ti-notebook', title: 'Pending Homework', status: '2 of 3 done', statusTone: 'is-now', note: 'Only the English response is left. You usually finish these in one sitting, so start it tonight.', meta: '30 min', difficulty: 'Medium', cta: 'Continue', modal: 'study_plan' },
  { id: 'practice', icon: 'ti ti-math-symbols', title: 'Recommended Practice', status: 'Just started', statusTone: 'is-ai', note: 'Four questions built around the exact step where your working stops. Nothing else.', meta: '20 min', difficulty: 'High', cta: 'Start', modal: 'practice_questions' },
  { id: 'skill', icon: 'ti ti-book', title: 'Skill Development', status: 'Halfway', statusTone: 'is-go', note: 'Your reading speed has improved twice this month. One more session keeps the run going.', meta: '25 min', difficulty: 'Medium', cta: 'Continue', modal: 'study_plan' },
  { id: 'revision', icon: 'ti ti-rotate', title: 'Revision Tasks', status: 'Nearly done', statusTone: 'is-go', note: 'Photosynthesis and forces are already solid. Give them ten minutes, not an hour.', meta: '10 min', difficulty: 'Low', cta: 'Continue', modal: 'weekly_plan' },
  { id: 'milestones', icon: 'ti ti-flag', title: 'Learning Milestones', status: '3 of 5 reached', statusTone: 'is-now', note: 'Two milestones left this term: the algebra target and the reading badge.', meta: 'This term', difficulty: 'Medium', cta: 'View Details', modal: 'create_goal' },
  { id: 'weekly', icon: 'ti ti-calendar-week', title: 'Weekly Objectives', status: 'On track', statusTone: 'is-now', note: 'You are on pace. Wednesday is your lightest day if something slips.', meta: '4 days left', difficulty: 'Medium', cta: 'View Details', modal: 'weekly_plan' },
];

/* ------------------------------------------------------------------ *
 * Why the assistant says what it says                                *
 * ------------------------------------------------------------------ */

export interface Finding {
  id: string;
  icon: string;
  observation: string;
  why: string;
  evidence: string[];
  confidence: number;
  expected: string;
  action: string;
  modal: string;
}

export const FINDINGS: Finding[] = [
  {
    id: 'maths',
    icon: 'ti ti-math-symbols',
    observation: 'Mathematics needs more revision',
    why: 'You set every question up correctly, then three of them stop at the same step — the second substitution. When the same question is written in words instead of symbols, you get it right. So this is about the notation, not the maths.',
    evidence: [
      'Correct setup on 9 of 9 questions',
      'All three unfinished at the same step',
      'Word versions answered correctly',
      'Same pattern in the last two sets',
    ],
    confidence: 96,
    expected: '+12 marks',
    action: 'Do four substitution questions tonight',
    modal: 'practice_questions',
  },
  {
    id: 'science',
    icon: 'ti ti-flask',
    observation: 'Science performance improving',
    why: 'Your science scores have moved less than four marks across eight papers, which is the steadiest of any subject. Practical work sits above written work every time, and the gap is widening in your favour.',
    evidence: [
      'Under 4 marks variance across 8 papers',
      'Practicals 11 marks above written work',
      'Top quartile three terms of four',
      'No revision needed to hold this',
    ],
    confidence: 93,
    expected: 'Keep the streak',
    action: 'Ask for the extension practical set',
    modal: 'study_plan',
  },
  {
    id: 'attendance',
    icon: 'ti ti-calendar-check',
    observation: 'Attendance affecting learning',
    why: 'You missed six weeks of mornings in June and your scores did not drop, which is unusual. The gap was covered because you kept up the homework. Since the bus changed you have not missed a day.',
    evidence: [
      'Six weeks of mornings missed',
      'No score drop across the dip',
      'Homework kept up throughout',
      'No absence since the route changed',
    ],
    confidence: 91,
    expected: 'Nothing to fix',
    action: 'Keep the current routine',
    modal: 'weekly_plan',
  },
  {
    id: 'homework',
    icon: 'ti ti-checkbox',
    observation: 'Homework consistency improved',
    why: 'You now submit 94% on time, up from 71%. Every one of the four late items was a set longer than eight questions, and every one of those you started on the day it was due.',
    evidence: [
      'On time 71% to 94%',
      'Twelve early submissions this term',
      'All four late items were long sets',
      'Each started on the due day',
    ],
    confidence: 89,
    expected: 'Clears the last one',
    action: 'Start long sets two days early',
    modal: 'weekly_plan',
  },
  {
    id: 'exam',
    icon: 'ti ti-alarm',
    observation: 'Exam approaching',
    why: `Term exams start in ${DAYS_TO_EXAM} days. Algebra and comprehension carry the most marks for you, and algebra is the only one where practice has not converged yet.`,
    evidence: [
      `${DAYS_TO_EXAM} days to the first paper`,
      'Algebra carries the most recoverable marks',
      'Comprehension already secure',
      'Eighteen-day plan fits your other work',
    ],
    confidence: 95,
    expected: 'A plan that fits',
    action: 'Build the exam plan now',
    modal: 'exam_strategy',
  },
  {
    id: 'habits',
    icon: 'ti ti-flame',
    observation: 'Study habits becoming stronger',
    why: `You have studied ${STREAK} days running, and your sessions before 5pm score higher than the late ones. The pattern is consistent enough that the plan now puts the hard work first.`,
    evidence: [
      `${STREAK} day streak, your longest yet`,
      `Average session ${AVERAGE_SESSION} minutes`,
      'Before-5pm sessions score higher',
      'No skipped weekday in four weeks',
    ],
    confidence: 92,
    expected: 'Keeps the run going',
    action: 'Keep today and beat your record',
    modal: 'study_plan',
  },
];

/* ------------------------------------------------------------------ *
 * The coach                                                          *
 * ------------------------------------------------------------------ */

export interface Coaching {
  id: string;
  icon: string;
  title: string;
  note: string;
  when: string;
  whenTone: string;
  expected: string;
  /** Marks it is worth, and the minutes it asks for. */
  marks: number;
  minutes: number;
  confidence: number;
  modal: string;
}

const coaching: Coaching[] = [
  { id: 'algebra', icon: 'ti ti-math-symbols', title: 'Practice Algebra', note: 'Four questions on the one step where your working stops. Nothing else in the set.', when: 'Do first', whenTone: 'is-hot', expected: '+12 marks', marks: 12, minutes: 20, confidence: 96, modal: 'practice_questions' },
  { id: 'english', icon: 'ti ti-notebook', title: 'Complete English Assignment', note: 'The last outstanding homework. You usually finish these in one sitting.', when: 'Tonight', whenTone: 'is-soon', expected: 'Clears the list', marks: 8, minutes: 30, confidence: 94, modal: 'study_plan' },
  { id: 'science', icon: 'ti ti-player-play', title: 'Watch Science Revision', note: 'An eight minute walkthrough on substitution, in the format you learn fastest from.', when: 'This week', whenTone: 'is-now', expected: 'Keeps your lead', marks: 3, minutes: 8, confidence: 91, modal: 'study_plan' },
  { id: 'quiz', icon: 'ti ti-clipboard-check', title: 'Weekly Quiz', note: 'Ten questions across everything you covered this week. Takes twelve minutes.', when: 'Friday', whenTone: 'is-now', expected: 'Shows the gain', marks: 4, minutes: 12, confidence: 90, modal: 'practice_questions' },
  { id: 'reading', icon: 'ti ti-book', title: 'Improve Reading Speed', note: 'Twenty minutes from the extension set. Your speed has risen twice this month already.', when: 'Ongoing', whenTone: 'is-now', expected: '+15% pace', marks: 5, minutes: 20, confidence: 88, modal: 'study_plan' },
  { id: 'peer', icon: 'ti ti-users', title: 'Peer Learning', note: 'Nathan cleared the same algebra gap last term and sits two rows away.', when: 'This week', whenTone: 'is-soon', expected: 'Faster progress', marks: 6, minutes: 30, confidence: 89, modal: 'roadmap' },
  { id: 'group', icon: 'ti ti-users-group', title: 'Join Study Group', note: 'You work noticeably better in a group of four than alone or in a full class.', when: 'Next week', whenTone: 'is-soon', expected: 'Better focus', marks: 5, minutes: 45, confidence: 86, modal: 'roadmap' },
  { id: 'career', icon: 'ti ti-compass', title: 'Career Exploration', note: 'Your science and design strengths point somewhere specific. Worth a look.', when: 'When ready', whenTone: 'is-go', expected: 'Direction', marks: 2, minutes: 30, confidence: 84, modal: 'roadmap' },
];

/** Marks returned per minute asked for. */
export const yieldOf = (row: Coaching) => row.marks / row.minutes;

export const COACHING = [...coaching].sort((a, b) => yieldOf(b) - yieldOf(a));

/* ------------------------------------------------------------------ *
 * The goals                                                          *
 * ------------------------------------------------------------------ */

export interface Goal {
  id: string;
  kind: string;
  title: string;
  /** The stops on the track, in order. */
  milestones: string[];
  /** How far along the goal is, which is what the track is drawn from. */
  progress: number;
}

export const GOALS: Goal[] = [
  { id: 'academic', kind: 'Academic Goals', title: 'Reach Band B in algebra by term end', milestones: ['Set a target', 'Practice weekly', 'First test', 'Full paper', 'Band B'], progress: 60 },
  { id: 'attendance', kind: 'Attendance Goals', title: 'Ninety-five percent for the full term', milestones: ['Bus fixed', 'Four clear weeks', 'Eight weeks', 'Full term', 'Certificate'], progress: 85 },
  { id: 'skill', kind: 'Skill Goals', title: 'Read a full chapter in twenty minutes', milestones: ['Baseline', 'First gain', 'Second gain', 'Twenty minutes', 'Hold it'], progress: 55 },
  { id: 'reading', kind: 'Reading Goals', title: 'Twelve books from the extension set', milestones: ['Book 1', 'Book 3', 'Book 5', 'Book 9', 'Book 12'], progress: 42 },
  { id: 'assignment', kind: 'Assignment Goals', title: 'Every submission on time for a full term', milestones: ['Week 4', 'Week 8', 'Week 12', 'Week 16', 'Full term'], progress: 78 },
  { id: 'competition', kind: 'Competition Goals', title: 'Enter the regional science exhibition', milestones: ['Choose a topic', 'Build the entry', 'Teacher sign-off', 'Submit', 'Compete'], progress: 30 },
  { id: 'growth', kind: 'Personal Growth Goals', title: 'Speak for the group once this term', milestones: ['Join a group', 'Take notes', 'Present once', 'Lead once', 'Volunteer'], progress: 20 },
];

/**
 * Which milestones a goal has passed.
 *
 * The dot you are standing on is the one the progress figure lands you at, so
 * the track is drawn from the percentage rather than beside it.
 */
export const reachedOf = (goal: Goal) =>
  Math.floor((goal.progress / 100) * goal.milestones.length);

/** The state a milestone carries. */
export const milestoneStateOf = (goal: Goal, index: number) => {
  const reached = reachedOf(goal);
  return index < reached ? 'is-done' : index === reached ? 'is-now' : '';
};

/** A goal's progress, said the way the page says it. */
export const progressLabel = (goal: Goal) => `${goal.progress}% there`;

/** Goals finished outright, which the task list quotes. */
export const GOALS_COMPLETE = GOALS.filter((goal) => goal.progress >= 100).length;

/* ------------------------------------------------------------------ *
 * The companion, the story, the opportunities and the tips           *
 * ------------------------------------------------------------------ */

export const COMPANION = [
  { icon: 'ti ti-calendar-plus', title: 'Generate Daily Study Plan', note: 'Built around today, not a generic timetable', modal: 'study_plan' },
  { icon: 'ti ti-calendar-week', title: 'Generate Weekly Revision Plan', note: 'Seven days, weighted to what you actually need', modal: 'weekly_plan' },
  { icon: 'ti ti-file-certificate', title: 'Generate Exam Strategy', note: 'Paper by paper, with the marks worth chasing', modal: 'exam_strategy' },
  { icon: 'ti ti-file-text', title: 'Generate Subject Summary', note: 'One page per subject, in your own reading level', modal: 'export_summary' },
  { icon: 'ti ti-math-symbols', title: 'Generate Practice Questions', note: 'Targeted at the step where you slow down', modal: 'practice_questions' },
  { icon: 'ti ti-route', title: 'Generate Learning Roadmap', note: 'This term, next term and the year after', modal: 'roadmap' },
  { icon: 'ti ti-flame', title: 'Generate Motivation Plan', note: 'Small wins scheduled where you tend to dip', modal: 'create_goal' },
  { icon: 'ti ti-git-compare', title: 'Compare Learning Progress', note: 'This term against last, honestly', modal: 'compare_progress' },
];

export interface Beat {
  id: string;
  icon: string;
  title: string;
  /** Days after the goal was set, or null when it is still ahead. */
  offsetDays: number | null;
  when?: string;
  note: string;
}

/** The day the algebra goal was set. */
export const GOAL_CREATED = '02 Jul 2026';

export const STORY: Beat[] = [
  { id: 'created', icon: 'ti ti-flag', title: 'Goal Created', offsetDays: 0, note: 'You set a target of Band B in algebra by the end of term.' },
  { id: 'started', icon: 'ti ti-player-play', title: 'Study Started', offsetDays: 1, note: 'First substitution session. Twenty minutes, four questions, two correct.' },
  { id: 'practice', icon: 'ti ti-math-symbols', title: 'Practice Completed', offsetDays: 17, note: 'Sixteen practice sets done. The second-substitution step stopped being the sticking point.' },
  { id: 'homework', icon: 'ti ti-checkbox', title: 'Homework Submitted', offsetDays: 26, note: 'Twelfth early submission this term. On-time rate reached 94%.' },
  { id: 'achievement', icon: 'ti ti-flame', title: 'Achievement Unlocked', offsetDays: 27, note: `${STREAK} day study streak — your longest yet, and still running.` },
  { id: 'exam', icon: 'ti ti-file-certificate', title: 'Exam Prepared', offsetDays: null, when: `In ${DAYS_TO_EXAM} days`, note: 'The eighteen-day plan is ready and fits around your other work.' },
  { id: 'completed', icon: 'ti ti-trophy', title: 'Goal Completed', offsetDays: null, when: 'End of term', note: 'Band B in algebra. Two steps left on the track.' },
];

/** The story, dated from the day the goal was set. */
export const storyBeats = () =>
  STORY.map((beat) => ({
    ...beat,
    on:
      beat.offsetDays === null
        ? (beat.when as string)
        : addDays(GOAL_CREATED, beat.offsetDays).split(' ').slice(0, 2).join(' '),
    done: beat.offsetDays !== null,
  }));

export const STORY_DONE = STORY.filter((beat) => beat.offsetDays !== null).length;

export const OPPORTUNITIES = [
  { id: 'competition', icon: 'ti ti-trophy', kind: 'Competitions', title: 'Regional science exhibition', note: 'Entries close 12 Sep' },
  { id: 'scholarship', icon: 'ti ti-coin', kind: 'Scholarships', title: 'STEM merit scholarship', note: 'You meet the criteria' },
  { id: 'reading', icon: 'ti ti-books', kind: 'Learning Resources', title: 'Extension reading set', note: 'Twelve titles waiting' },
  { id: 'robotics', icon: 'ti ti-robot', kind: 'Clubs', title: 'Robotics and design club', note: 'Eight places left' },
  { id: 'athletics', icon: 'ti ti-ball-football', kind: 'Sports', title: 'Inter-house athletics', note: 'Trials next Tuesday' },
  { id: 'rep', icon: 'ti ti-crown', kind: 'Leadership', title: 'Class science representative', note: 'Nominations open now' },
  { id: 'career', icon: 'ti ti-compass', kind: 'Career Guidance', title: 'Laboratory and design pathways', note: 'Matched to your record' },
  { id: 'certificate', icon: 'ti ti-certificate', kind: 'Certification Programs', title: 'Digital skills certificate', note: 'Six weeks, after school' },
];

export const TIPS = [
  { id: 'study', icon: 'ti ti-clock', title: 'Study Tips', text: 'Your sessions before 5pm score higher than late ones. Move the hard subject earlier rather than adding another hour at the end of the day.' },
  { id: 'habits', icon: 'ti ti-brain', title: 'Learning Habits', text: 'You remember things at eight weeks about as well as most people do at two. Long gaps between revision cost you far less than they cost others — use that.' },
  { id: 'motivation', icon: 'ti ti-flame', title: 'Motivational Insights', text: `${STREAK} days is your longest streak. The next four days matter more than any single study session in it.` },
  { id: 'achievements', icon: 'ti ti-award', title: 'Personal Achievements', text: 'Second place at the science exhibition, four terms in the extension reading set, and attendance back to 96% after a difficult June.' },
  { id: 'books', icon: 'ti ti-book', title: 'Recommended Books', text: 'Three titles chosen from what you finished quickly rather than what the year group is given. All three are in the library today.' },
  { id: 'courses', icon: 'ti ti-school', title: 'Recommended Courses', text: 'A short digital skills course that lines up with your design work. Six weeks, after school, no exam at the end.' },
  { id: 'stories', icon: 'ti ti-users', title: 'Success Stories', text: 'Nathan had the same algebra gap last term and closed it in five weeks with the same four questions you have been given.' },
  { id: 'challenge', icon: 'ti ti-target-arrow', title: 'Daily Challenges', text: `Finish today’s substitution set before 5pm and you beat your longest streak. That is the whole challenge.` },
];

/* ------------------------------------------------------------------ *
 * The workspace                                                      *
 * ------------------------------------------------------------------ */

export const CONFIDENCE = [
  { label: 'The notation gap', value: 96 },
  { label: 'Best time of day', value: 92 },
  { label: 'Reading improvement', value: 96 },
  { label: 'Exam plan fit', value: 95 },
  { label: 'Study partner match', value: 89 },
];

export const CONFIDENCE_MEAN = Math.round(
  CONFIDENCE.reduce((total, entry) => total + entry.value, 0) / CONFIDENCE.length,
);

export const SUBJECTS = [
  { label: 'Reading', band: 'A' },
  { label: 'Science', band: 'A' },
  { label: 'Languages', band: 'B' },
  { label: 'Maths · word problems', band: 'B' },
  { label: 'Maths · symbolic', band: 'D' },
];

export const PEERS = [
  { name: 'Nathan Cole', className: 'VII-A', note: 'Cleared this in 5 weeks' },
  { name: 'Zara Ahmed', className: 'V-C', note: 'Working on it now' },
  { name: 'Iris Kapoor', className: 'VIII-C', note: 'Same learning profile' },
];

/** How many share the same gap, of the submissions marked. */
export const COHORT_WITH_GAP = 31;
export const COHORT_SIZE = 84;

/** The dates the dialogs propose. */
export const GOAL_TARGET = addDays(RUN_DATE, 60);
export const WEEK_STARTS = addDays(RUN_DATE, 2);
