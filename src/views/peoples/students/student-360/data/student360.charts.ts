import type { ApexOptions } from 'apexcharts';

export const attendanceTrendOptions: ApexOptions = {
  chart: { type: 'area', height: 260, toolbar: { show: false } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  colors: ['#0ca678'],
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  dataLabels: { enabled: false },
  yaxis: { max: 100 },
};

export const attendanceTrendSeries = [
  { name: 'Attendance %', data: [92, 95, 90, 96, 93, 97, 94] },
];

export const radarOptions: ApexOptions = {
  chart: { type: 'radar', height: 260, toolbar: { show: false } },
  labels: ['Maths', 'Science', 'English', 'Social', 'Computer', 'Art'],
  colors: ['#3577f1'],
  dataLabels: { enabled: false },
};

export const radarSeries = [{ name: 'Score', data: [92, 88, 79, 85, 90, 83] }];
