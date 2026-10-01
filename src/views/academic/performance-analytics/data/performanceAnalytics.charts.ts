import type { ApexOptions } from 'apexcharts';

/** Every value on these charts is a percentage, so a shift can never leave 0–100. */
const clamp = (value: number) => Math.max(0, Math.min(100, value));

/* ------------------------------ Subject trend ------------------------------ */

export const subjectTrendOptions: ApexOptions = {
  chart: { type: 'line', height: 300, toolbar: { show: false } },
  xaxis: { categories: ['T1', 'T2', 'T3', 'T4', 'T5'] },
  colors: ['#3577f1', '#0ca678', '#f39c12'],
  stroke: { curve: 'smooth', width: 3 },
  dataLabels: { enabled: false },
  legend: { position: 'top' },
};

export const subjectTrendSeries = [
  { name: 'Maths', data: [82, 85, 84, 88, 90] },
  { name: 'Science', data: [78, 80, 83, 85, 87] },
  { name: 'English', data: [75, 77, 79, 80, 82] },
];

/** Term scores for one class: the cohort curve lifted or dropped by `offset`. */
export const buildSubjectTrendSeries = (offset: number) =>
  subjectTrendSeries.map((series) => ({
    name: series.name,
    data: series.data.map((value) => clamp(value + offset)),
  }));

/* ------------------------------ Subject radar ------------------------------ */

export const subjectRadarOptions: ApexOptions = {
  chart: { type: 'radar', height: 280, toolbar: { show: false } },
  labels: ['Maths', 'Science', 'English', 'Social', 'Computer', 'Art'],
  colors: ['#3577f1'],
  dataLabels: { enabled: false },
};

export const subjectRadarSeries = [{ name: 'Avg Score', data: [90, 87, 82, 85, 88, 80] }];

/** The same six subject averages, re-centred on the selected class. */
export const buildSubjectRadarSeries = (offset: number) =>
  subjectRadarSeries.map((series) => ({
    name: series.name,
    data: series.data.map((value) => clamp(value + offset)),
  }));

/* --------------------------- Attendance vs marks --------------------------- */

export const attendanceScatterOptions: ApexOptions = {
  chart: { type: 'scatter', height: 280, toolbar: { show: false } },
  xaxis: { title: { text: 'Attendance %' }, tickAmount: 6 },
  yaxis: { title: { text: 'Marks %' } },
  colors: ['#3577f1'],
};

export const attendanceScatterSeries = [
  {
    name: 'Students',
    data: [
      [70, 62],
      [80, 74],
      [85, 80],
      [90, 88],
      [95, 92],
      [75, 68],
      [88, 84],
      [92, 90],
    ],
  },
];

/**
 * The scatter plots attendance on x and marks on y, so it takes two offsets:
 * the class's attendance gap and its marks gap, applied to the matching axis.
 */
export const buildAttendanceScatterSeries = (attendanceOffset: number, marksOffset: number) =>
  attendanceScatterSeries.map((series) => ({
    name: series.name,
    data: series.data.map(([attendance, marks]) => [
      clamp(attendance + attendanceOffset),
      clamp(marks + marksOffset),
    ]),
  }));
