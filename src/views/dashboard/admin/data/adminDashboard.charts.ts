import type { ApexOptions } from 'apexcharts';

/** Brand palette used across the dashboard charts. */
export const CHART_COLORS = {
  primary: '#3D5EE1',
  info: '#0F65CD',
  success: '#1ABE17',
  successAlt: '#16a34a',
  warning: '#f39c12',
  danger: '#dc2626',
  amber: '#d97706',
  pink: '#e83e8c',
  slate: '#94a3b8',
  teal: '#0ca678',
} as const;

const AXIS_LABEL_STYLE = {
  colors: CHART_COLORS.slate,
  fontSize: '12px',
} as const;

/* ------------------------------------------------------------------ *
 * Student Attendance Heatmap
 * ------------------------------------------------------------------ */

const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Apex draws series bottom-up, so grades are listed highest-first. */
const HEATMAP_ROWS: [string, number[]][] = [
  ['Grade XII', [96, 91, 96, 88, 96, 91]],
  ['Grade XI', [88, 91, 88, 96, 91, 96]],
  ['Grade X', [91, 96, 96, 88, 91, 82]],
  ['Grade IX', [96, 88, 91, 96, 96, 88]],
  ['Grade VIII', [88, 91, 96, 96, 88, 91]],
  ['Grade VII', [91, 96, 88, 96, 91, 82]],
  ['Grade VI', [96, 91, 96, 88, 91, 96]],
];

export const attendanceHeatmapSeries = HEATMAP_ROWS.map(([grade, values]) => ({
  name: grade,
  data: values.map((value, index) => ({ x: HEATMAP_DAYS[index], y: value })),
}));

/**
 * @param surfaceColor The card's background colour. Heatmap cells are drawn
 * edge to edge, so the "gap" between them is really the cell's own stroke —
 * a transparent stroke would show the neighbouring cell through it. Painting
 * the stroke in the surface colour is what makes the gaps read correctly, and
 * reading it from the card keeps it right in both light and dark themes.
 */
export const buildAttendanceHeatmapOptions = (
  surfaceColor: string,
): ApexOptions => ({
  chart: {
    type: 'heatmap',
    height: 380,
    toolbar: { show: false },
    fontFamily: 'inherit',
    parentHeightOffset: 0,
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 6, colors: [surfaceColor] },
  plotOptions: {
    heatmap: {
      radius: 6,
      enableShades: false,
      useFillColorAsStroke: false,
      colorScale: {
        ranges: [
          { from: 0, to: 84, color: '#E2E7FA', name: 'Below 85%' },
          { from: 85, to: 89, color: '#B1BEF3', name: '85 - 89%' },
          { from: 90, to: 94, color: '#8196EC', name: '90 - 94%' },
          { from: 95, to: 100, color: CHART_COLORS.primary, name: '95% and above' },
        ],
      },
    },
  },
  xaxis: {
    type: 'category',
    position: 'top',
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false },
    labels: { style: { colors: '#6A7287', fontSize: '12px', fontWeight: 600 } },
  },
  // Grade names are the widest labels, so the axis gets a fixed gutter rather
  // than letting Apex guess and clip them.
  yaxis: {
    labels: { minWidth: 74, align: 'left', style: { colors: '#6A7287', fontSize: '12px' } },
  },
  grid: { padding: { left: 8, right: 8, top: 0, bottom: 0 } },
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    fontSize: '12px',
    offsetY: 4,
    labels: { colors: '#6A7287' },
    markers: { size: 3 },
    itemMargin: { horizontal: 10, vertical: 4 },
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (value: number) => `${value}% attendance` },
  },
});

/* ------------------------------------------------------------------ *
 * Performance Risk Matrix (scatter quadrant)
 * ------------------------------------------------------------------ */

export const riskMatrixSeries: ApexAxisChartSeries = [
  {
    name: 'Low Risk',
    data: [[96, 92], [93, 88], [90, 85], [88, 90], [85, 82], [92, 79], [98, 95], [83, 86], [95, 84]],
  },
  {
    name: 'Medium Risk',
    data: [[78, 66], [74, 71], [80, 62], [70, 68], [76, 58], [72, 74], [68, 64]],
  },
  {
    name: 'High Risk',
    data: [[58, 48], [52, 42], [61, 55], [47, 50], [55, 38], [44, 46]],
  },
];

export const riskMatrixOptions: ApexOptions = {
  chart: {
    height: 236,
    type: 'scatter',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: { speed: 500 },
  },
  colors: [CHART_COLORS.successAlt, CHART_COLORS.amber, CHART_COLORS.danger],
  markers: { size: 6, strokeWidth: 0, fillOpacity: 0.8, hover: { size: 8 } },
  xaxis: {
    title: { text: 'Attendance %', style: { color: CHART_COLORS.slate, fontSize: '11px' } },
    min: 40,
    max: 100,
    tickAmount: 6,
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: CHART_COLORS.slate, fontSize: '11px' } },
  },
  yaxis: {
    title: { text: 'Avg Score', style: { color: CHART_COLORS.slate, fontSize: '11px' } },
    min: 30,
    max: 100,
    tickAmount: 5,
    labels: { style: { colors: CHART_COLORS.slate, fontSize: '11px' } },
  },
  grid: {
    borderColor: 'rgba(148,163,184,.18)',
    strokeDashArray: 4,
    padding: { left: 6, right: 6 },
  },
  annotations: {
    xaxis: [{ x: 72, borderColor: 'rgba(148,163,184,.5)', strokeDashArray: 5 }],
    yaxis: [{ y: 65, borderColor: 'rgba(148,163,184,.5)', strokeDashArray: 5 }],
    points: [
      {
        x: 96,
        y: 95,
        marker: { size: 0 },
        label: {
          text: 'Star Zone',
          borderColor: CHART_COLORS.successAlt,
          style: { background: CHART_COLORS.successAlt, color: '#fff', fontSize: '9px' },
        },
      },
    ],
  },
  legend: { show: false },
  tooltip: {
    theme: 'light',
    custom: ({ seriesIndex, dataPointIndex, w }) => {
      const seriesName = ['Low Risk', 'Medium Risk', 'High Risk'][seriesIndex];
      const point = w.config.series[seriesIndex].data[dataPointIndex] as number[];
      return `<div style="padding:6px 10px;font-size:12px"><b>${seriesName}</b><br>Attendance ${point[0]}% · Score ${point[1]}</div>`;
    },
  },
};

/* ------------------------------------------------------------------ *
 * Weekly Communication Trend (area)
 * ------------------------------------------------------------------ */

export const communicationTrendSeries: ApexAxisChartSeries = [
  { name: 'SMS', data: [648, 712, 596, 703, 781, 432, 355] },
  { name: 'Email', data: [425, 478, 398, 452, 517, 268, 157] },
  { name: 'App', data: [312, 358, 294, 341, 388, 201, 126] },
];

export const communicationTrendOptions: ApexOptions = {
  chart: { type: 'area', height: 355, toolbar: { show: false } },
  colors: [CHART_COLORS.primary, CHART_COLORS.info, CHART_COLORS.success],
  xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  yaxis: { labels: { offsetX: -15 } },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' },
  grid: {
    yaxis: {
      lines: { show: true },
    },
  },
  markers: {
    size: 5,
    colors: [CHART_COLORS.primary, CHART_COLORS.info, CHART_COLORS.success],
    strokeColors: '#fff',
    strokeWidth: 2,
    hover: { size: 7 },
  },
  fill: {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] },
  },
  legend: { position: 'bottom', horizontalAlign: 'center' },
  tooltip: {
    shared: true,
    intersect: false,
    y: { formatter: (value: number) => `${value.toLocaleString()} sent` },
  },
};

/* ------------------------------------------------------------------ *
 * Parent Engagement (donut sparkline)
 * ------------------------------------------------------------------ */

export const parentEngagementSeries = [45, 11, 2];

export const parentEngagementOptions: ApexOptions = {
  chart: { height: 130, type: 'donut', toolbar: { show: false }, sparkline: { enabled: true } },
  colors: ['#3577f1', CHART_COLORS.warning, '#e7515a'],
  labels: ['Good', 'Average', 'Below Average'],
  legend: { show: false },
  dataLabels: { enabled: false },
  grid: { padding: { left: -8 } },
  responsive: [
    { breakpoint: 480, options: { chart: { width: 200 }, legend: { position: 'bottom' } } },
  ],
};

/* ------------------------------------------------------------------ *
 * Enrollment & Growth Trend (multi-line with forecast)
 * ------------------------------------------------------------------ */

export const enrollmentTrendSeries: ApexAxisChartSeries = [
  { name: 'This Year', data: [210, 265, 240, 300, 285, 330, 360, 345, 390, null, null, null] },
  { name: 'Last Year', data: [180, 205, 220, 250, 240, 275, 300, 295, 320, 335, 350, 365] },
  { name: 'Forecast', data: [null, null, null, null, null, null, null, null, 390, 405, 418, 436] },
];

export const enrollmentTrendOptions: ApexOptions = {
  chart: { height: 300, type: 'line', toolbar: { show: false } },
  colors: [CHART_COLORS.primary, CHART_COLORS.slate, CHART_COLORS.teal],
  dataLabels: { enabled: false },
  // Solid for actuals, dashed for last year and the forecast tail.
  stroke: { curve: 'smooth', width: [3, 2, 2], dashArray: [0, 5, 6] },
  grid: {
    borderColor: 'rgba(148,163,184,.18)',
    strokeDashArray: 4,
    padding: { left: 4, right: 4 },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
    markers: { size: 6 },
    itemMargin: { horizontal: 12 },
  },
  markers: { size: 0, hover: { size: 5 } },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: AXIS_LABEL_STYLE },
  },
  yaxis: { labels: { style: AXIS_LABEL_STYLE } },
  annotations: {
    yaxis: [
      {
        y: 420,
        borderColor: CHART_COLORS.pink,
        strokeDashArray: 4,
        label: {
          text: 'Admission Target 420',
          style: { color: '#fff', background: CHART_COLORS.pink, fontSize: '11px' },
          position: 'left',
          textAnchor: 'start',
        },
      },
    ],
  },
  tooltip: {
    theme: 'light',
    shared: true,
    y: { formatter: (value: number) => (value == null ? '' : `${value} students`) },
  },
};

/* ------------------------------------------------------------------ *
 * Gender Distribution (100% stacked bar)
 * ------------------------------------------------------------------ */

export const genderDistributionSeries: ApexAxisChartSeries = [
  { name: 'Male', data: [540, 512, 498, 415] },
  { name: 'Female', data: [470, 452, 430, 337] },
];

export const genderDistributionOptions: ApexOptions = {
  chart: {
    height: 216,
    type: 'bar',
    stacked: true,
    stackType: '100%',
    toolbar: { show: false },
  },
  colors: [CHART_COLORS.primary, CHART_COLORS.pink],
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '60%',
      borderRadius: 5,
      borderRadiusApplication: 'end',
    },
  },
  dataLabels: { enabled: false },
  stroke: { show: true, width: 3, colors: ['transparent'] },
  xaxis: {
    categories: ['Primary', 'Middle', 'High', 'Sr. Sec'],
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: { labels: { style: AXIS_LABEL_STYLE } },
  grid: { show: false, padding: { left: 0, right: 0, top: -8, bottom: -8 } },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '12px',
    markers: { size: 6 },
  },
  tooltip: { y: { formatter: (value: number) => `${value} students` } },
};

/* ------------------------------------------------------------------ *
 * Delivery sparklines
 * ------------------------------------------------------------------ */

/** Small inline bar chart used per delivery channel. */
export const buildMiniBarOptions = (color: string): ApexOptions => ({
  chart: {
    height: 30,
    width: 60,
    type: 'bar',
    toolbar: { show: false },
    sparkline: { enabled: true },
    offsetX: 0,
  },
  colors: [color],
  dataLabels: { enabled: false },
  plotOptions: { bar: { horizontal: false, columnWidth: '80%', borderRadius: 2 } },
  grid: { padding: { left: -5, right: -5, top: 0, bottom: 0 } },
  tooltip: {
    fixed: { enabled: false },
    y: { title: { formatter: () => '' } },
    marker: { show: false },
  },
});

export const deliveryTrendSeries: ApexAxisChartSeries = [
  {
    name: 'Delivery',
    data: [
      [1, 52], [2, 64], [3, 58], [4, 72],
      [5, 66], [6, 80], [7, 74], [8, 88],
      [9, 82], [10, 94], [11, 90], [12, 100],
    ],
  },
];

export const deliveryTrendOptions: ApexOptions = {
  chart: {
    height: 30,
    width: '100%',
    type: 'bar',
    toolbar: { show: false },
    sparkline: { enabled: true },
    offsetX: 0,
  },
  colors: [CHART_COLORS.primary],
  dataLabels: { enabled: false },
  plotOptions: { bar: { horizontal: false, columnWidth: '90%', borderRadius: 2 } },
  xaxis: {
    type: 'numeric',
    min: 0.5,
    max: 12.5,
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  tooltip: {
    fixed: { enabled: false },
    x: { show: false },
    y: { title: { formatter: () => '' } },
    marker: { show: false },
  },
};

/* ------------------------------------------------------------------ *
 * Library — Books Issued Trend (polar area)
 * ------------------------------------------------------------------ */

export const booksIssuedSeries = [
  520, 610, 575, 660, 705, 690, 742, 720, 780, 815, 848, 902,
];

export const booksIssuedOptions: ApexOptions = {
  chart: { height: 320, type: 'polarArea', toolbar: { show: false }, animations: { speed: 600 } },
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  // A single-hue ramp, so the reader sees month-over-month growth as depth.
  colors: [
    '#dbe4fb', '#bcd0f8', '#9dbcf4', '#7ea8f0', '#5f94ec', '#4a82e6',
    '#3D5EE1', '#3654cc', '#2f4ab7', '#2840a2', '#21368d', '#1a2c78',
  ],
  fill: { opacity: 0.92 },
  stroke: { width: 1, colors: ['#ffffff'] },
  dataLabels: { enabled: false },
  plotOptions: {
    polarArea: {
      rings: { strokeWidth: 1, strokeColor: 'rgba(148,163,184,.18)' },
      spokes: { strokeWidth: 1, connectorColors: 'rgba(148,163,184,.18)' },
    },
  },
  yaxis: { show: false },
  legend: {
    show: true,
    position: 'right',
    fontSize: '12px',
    markers: { size: 6 },
    itemMargin: { vertical: 2 },
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (value: number) => `${value.toLocaleString()} books issued` },
  },
  responsive: [{ breakpoint: 991, options: { legend: { position: 'bottom' } } }],
};

/* ------------------------------------------------------------------ *
 * Transport — Fuel Consumption Trend (combo column + line)
 * ------------------------------------------------------------------ */

export const fuelConsumptionSeries: ApexAxisChartSeries = [
  { name: 'Consumption (gal)', type: 'column', data: [2980, 3120, 3050, 3240, 3180, 3284] },
  { name: 'Efficiency (mpg)', type: 'line', data: [7.8, 8.1, 8.0, 8.3, 8.4, 8.6] },
];

export const fuelConsumptionOptions: ApexOptions = {
  chart: { height: 330, type: 'line', stacked: false, toolbar: { show: false } },
  colors: [CHART_COLORS.primary, CHART_COLORS.teal],
  dataLabels: { enabled: false },
  // Column series takes no stroke; the efficiency line does.
  stroke: { width: [0, 3], curve: 'smooth' },
  plotOptions: {
    bar: { columnWidth: '46%', borderRadius: 5, borderRadiusApplication: 'end' },
  },
  fill: { opacity: [1, 1] },
  grid: {
    borderColor: 'rgba(148,163,184,.18)',
    strokeDashArray: 4,
    padding: { left: 4, right: 4 },
  },
  legend: {
    show: true,
    position: 'top',
    horizontalAlign: 'left',
    fontSize: '13px',
    markers: { size: 6 },
    itemMargin: { horizontal: 12 },
  },
  xaxis: {
    categories: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: AXIS_LABEL_STYLE },
  },
  yaxis: [
    {
      title: { text: 'Gallons', style: { color: CHART_COLORS.slate } },
      labels: { style: AXIS_LABEL_STYLE },
    },
    {
      opposite: true,
      min: 6,
      max: 10,
      title: { text: 'mpg', style: { color: CHART_COLORS.teal } },
      labels: { style: AXIS_LABEL_STYLE },
    },
  ],
  tooltip: { theme: 'light', shared: true, intersect: false },
};

/* ------------------------------------------------------------------ *
 * Transport — 7-day fleet utilisation sparkline
 * ------------------------------------------------------------------ */

export const fleetUtilizationSeries: ApexAxisChartSeries = [
  {
    name: 'Utilization',
    data: [
      [1, 58], [2, 66], [3, 60], [4, 74],
      [5, 70], [6, 82], [7, 78], [8, 88],
      [9, 84], [10, 94], [11, 90], [12, 100],
    ],
  },
];

export const fleetUtilizationOptions: ApexOptions = {
  chart: {
    height: 40,
    width: '100%',
    type: 'bar',
    toolbar: { show: false },
    sparkline: { enabled: true },
  },
  colors: [CHART_COLORS.primary],
  dataLabels: { enabled: false },
  plotOptions: { bar: { horizontal: false, columnWidth: '90%', borderRadius: 2 } },
  xaxis: {
    type: 'numeric',
    min: 0.5,
    max: 12.5,
    labels: { show: false },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  grid: { padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  tooltip: {
    fixed: { enabled: false },
    x: { show: false },
    y: { title: { formatter: () => '' } },
    marker: { show: false },
  },
};
