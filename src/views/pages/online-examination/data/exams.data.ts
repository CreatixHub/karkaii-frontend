import type { ApexOptions } from 'apexcharts';
import type { Stat } from '../../shared/StatStrip';

/* ------------------------------------------------------------------ *
 * The term                                                           *
 * ------------------------------------------------------------------ */

export const LIVE_EXAMS = 3;
export const SCHEDULED = 14;
export const COMPLETED = 128;
export const AVERAGE_SCORE = 76.4;
export const PASS_RATE = 91;
export const FLAGGED = 5;

export const STATS: Stat[] = [
  {
    id: 'live',
    label: 'Live Exams',
    value: String(LIVE_EXAMS),
    icon: 'ti ti-broadcast',
    tint: 'success',
    badge: { label: 'Live', tint: 'success' },
  },
  {
    id: 'scheduled',
    label: 'Scheduled',
    value: String(SCHEDULED),
    icon: 'ti ti-calendar-event',
    tint: 'info',
  },
  {
    id: 'completed',
    label: 'Completed',
    value: String(COMPLETED),
    icon: 'ti ti-checkbox',
    tint: 'primary',
  },
  {
    id: 'average',
    label: 'Avg Score',
    value: String(AVERAGE_SCORE),
    icon: 'ti ti-chart-bar',
    tint: 'warning',
  },
  {
    id: 'pass',
    label: 'Pass %',
    value: `${PASS_RATE}%`,
    icon: 'ti ti-circle-check',
    tint: 'success',
    badge: { label: `${PASS_RATE}%`, tint: 'success' },
  },
  { id: 'flagged', label: 'Flagged', value: String(FLAGGED), icon: 'ti ti-flag', tint: 'danger' },
];

/* ------------------------------------------------------------------ *
 * The exams                                                          *
 * ------------------------------------------------------------------ */

export type ExamState = 'Live' | 'Scheduled' | 'Completed';

export interface Exam {
  id: string;
  title: string;
  className: string;
  subject: string;
  questions: number;
  /** Minutes the paper runs for. The duration label follows from it. */
  minutes: number;
  window: string;
  state: ExamState;
}

export const EXAMS: Exam[] = [
  {
    id: 'unit-3',
    title: 'Unit Test 3',
    className: 'III-A',
    subject: 'Maths',
    questions: 25,
    minutes: 45,
    window: '08 Jul, 10:00',
    state: 'Live',
  },
  {
    id: 'science-quiz',
    title: 'Science Quiz',
    className: 'IV-B',
    subject: 'Science',
    questions: 20,
    minutes: 30,
    window: '10 Jul, 09:00',
    state: 'Scheduled',
  },
  {
    id: 'mid-term',
    title: 'Mid Term',
    className: 'V-A',
    subject: 'English',
    questions: 40,
    minutes: 60,
    window: '02 Jul, 10:00',
    state: 'Completed',
  },
];

export const durationOf = (exam: Exam) => `${exam.minutes} min`;

export const stateTint = (state: ExamState) =>
  ({ Live: 'success', Scheduled: 'info', Completed: 'secondary' })[state];

export const CLASSES = ['III-A', 'IV-B'];
export const SUBJECTS = ['Maths', 'Science'];

/* ------------------------------------------------------------------ *
 * The charts                                                         *
 * ------------------------------------------------------------------ */

export const SCORE_BANDS = [
  { band: '0-40', students: 4 },
  { band: '41-55', students: 9 },
  { band: '56-70', students: 18 },
  { band: '71-85', students: 32 },
  { band: '86-95', students: 41 },
  { band: '96-100', students: 24 },
];

export const scoreSeries = [{ name: 'Students', data: SCORE_BANDS.map((row) => row.students) }];

export const scoreOptions: ApexOptions = {
  chart: { type: 'bar', height: 300, toolbar: { show: false } },
  xaxis: { categories: SCORE_BANDS.map((row) => row.band) },
  colors: ['#3577f1'],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '55%' } },
  dataLabels: { enabled: false },
};

/** The donut is the pass rate and its remainder, so it follows the tile. */
export const passSeries = [PASS_RATE, 100 - PASS_RATE];

export const passOptions: ApexOptions = {
  chart: { type: 'donut', height: 290 },
  labels: ['Pass', 'Fail'],
  colors: ['#0ca678', '#e7515a'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};

/** Students sitting the paper the distribution covers. */
export const STUDENTS_SCORED = SCORE_BANDS.reduce((total, row) => total + row.students, 0);
