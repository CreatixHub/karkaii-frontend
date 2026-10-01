import type { ApexOptions } from 'apexcharts';
import { CHART_COLORS } from './attendanceHistory.data';

const { green, red, yellow, blue } = CHART_COLORS;

export const donutOptions: ApexOptions = {
  chart: { type: 'donut', height: 240 },
  labels: ['Present', 'Absent', 'Late', 'Leave'],
  colors: [green, red, yellow, blue],
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
};

export const donutSeries = [21, 2, 2, 1];

export const trendOptions: ApexOptions = {
  chart: { type: 'area', height: 260, toolbar: { show: false } },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'] },
  colors: [blue],
  stroke: { curve: 'smooth', width: 3 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.4, opacityTo: 0.05 } },
  dataLabels: { enabled: false },
  yaxis: { max: 100 },
};

export const trendSeries = [{ name: 'Present %', data: [88, 92, 85, 94, 90, 96, 91] }];

const week = (name: string, values: number[]) => ({
  name,
  data: values.map((value, index) => ({ x: `W${index + 1}`, y: value })),
});

export const heatmapOptions: ApexOptions = {
  chart: { type: 'heatmap', height: 260, toolbar: { show: false } },
  colors: [green],
  dataLabels: { enabled: false },
  plotOptions: {
    heatmap: {
      colorScale: {
        ranges: [
          { from: 0, to: 2, color: red, name: 'Low' },
          { from: 3, to: 4, color: yellow, name: 'Med' },
          { from: 5, to: 5, color: green, name: 'Full' },
        ],
      },
    },
  },
};

export const heatmapSeries = [
  week('Mon', [5, 5, 4, 5]),
  week('Tue', [5, 4, 5, 5]),
  week('Wed', [4, 5, 5, 5]),
  week('Thu', [5, 5, 5, 4]),
  week('Fri', [5, 5, 4, 5]),
];
