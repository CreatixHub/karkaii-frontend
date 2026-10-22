import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The bank                                                           *
 * ------------------------------------------------------------------ */

export const TOTAL_QUESTIONS = 4280;
export const SUBJECT_COUNT = 12;
export const REVIEWED = 3120;
export const USED_IN_EXAMS = 1860;
export const TAGS = 340;

/* ------------------------------------------------------------------ *
 * The difficulty mix                                                 *
 * ------------------------------------------------------------------ */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export const DIFFICULTY_MIX = [
  { level: 'Easy' as Difficulty, share: 45, colour: '#0ca678' },
  { level: 'Medium' as Difficulty, share: 27, colour: '#f39c12' },
  { level: 'Hard' as Difficulty, share: 28, colour: '#e7515a' },
];

/** The hard share the tile prints — read off the mix rather than typed twice. */
export const HARD_SHARE = DIFFICULTY_MIX.find((row) => row.level === 'Hard')?.share ?? 0;

export const STATS: Stat[] = [
  {
    id: 'questions',
    label: 'Questions',
    value: TOTAL_QUESTIONS.toLocaleString('en-US'),
    icon: 'ti ti-help-circle',
    tint: 'primary',
  },
  { id: 'subjects', label: 'Subjects', value: String(SUBJECT_COUNT), icon: 'ti ti-book', tint: 'info' },
  {
    id: 'reviewed',
    label: 'Reviewed',
    value: REVIEWED.toLocaleString('en-US'),
    icon: 'ti ti-checkbox',
    tint: 'success',
  },
  {
    id: 'hard',
    label: 'Hard',
    value: `${HARD_SHARE}%`,
    icon: 'ti ti-flame',
    tint: 'danger',
  },
  {
    id: 'used',
    label: 'Used in Exams',
    value: USED_IN_EXAMS.toLocaleString('en-US'),
    icon: 'ti ti-file-certificate',
    tint: 'warning',
  },
  { id: 'tags', label: 'Tags', value: String(TAGS), icon: 'ti ti-tag', tint: 'secondary' },
];

/* ------------------------------------------------------------------ *
 * The questions                                                      *
 * ------------------------------------------------------------------ */

export interface Question {
  id: string;
  text: string;
  subject: string;
  type: string;
  difficulty: Difficulty;
  tag: string;
}

export const QUESTIONS: Question[] = [
  {
    id: 'q-1',
    text: 'What is 3/4 + 1/4 ?',
    subject: 'Maths',
    type: 'MCQ',
    difficulty: 'Easy',
    tag: 'fractions',
  },
  {
    id: 'q-2',
    text: 'Explain photosynthesis.',
    subject: 'Science',
    type: 'Subjective',
    difficulty: 'Medium',
    tag: 'biology',
  },
  {
    id: 'q-3',
    text: 'Derive quadratic formula.',
    subject: 'Maths',
    type: 'Subjective',
    difficulty: 'Hard',
    tag: 'algebra',
  },
];

/** The badge takes its colour from the difficulty itself. */
export const difficultyTint = (level: Difficulty) =>
  ({ Easy: 'success', Medium: 'warning', Hard: 'danger' })[level];

export const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];

export const TYPES = ['MCQ', 'Subjective', 'True/False', 'Fill in the blank'];

export const SUBJECTS = ['Maths', 'Science', 'English', 'Social', 'Computer', 'GK'];

/* ------------------------------------------------------------------ *
 * The charts                                                         *
 * ------------------------------------------------------------------ */

export const difficultySeries = DIFFICULTY_MIX.map((row) => row.share);

export const difficultyOptions: ApexOptions = {
  chart: { type: 'donut', height: 280 },
  labels: DIFFICULTY_MIX.map((row) => row.level),
  colors: DIFFICULTY_MIX.map((row) => row.colour),
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};

export const BY_SUBJECT = [
  { subject: 'Maths', questions: 820 },
  { subject: 'Science', questions: 640 },
  { subject: 'English', questions: 560 },
  { subject: 'Social', questions: 480 },
  { subject: 'Computer', questions: 420 },
  { subject: 'GK', questions: 360 },
];

export const subjectSeries = [{ name: 'Questions', data: BY_SUBJECT.map((row) => row.questions) }];

export const subjectOptions: ApexOptions = {
  chart: { type: 'bar', height: 290, toolbar: { show: false } },
  xaxis: { categories: BY_SUBJECT.map((row) => row.subject) },
  colors: ['#3577f1'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  dataLabels: { enabled: false },
};

/** The mix is a set of percentages, so it adds to a hundred. */
export const MIX_TOTAL = difficultySeries.reduce((total, share) => total + share, 0);
