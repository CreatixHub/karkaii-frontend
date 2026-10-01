import ReactApexChart from 'react-apexcharts';
import {
  parentEngagementOptions,
  parentEngagementSeries,
} from '../data/adminDashboard.charts';

const ParentEngagementChart = () => (
  <ReactApexChart
    options={parentEngagementOptions}
    series={parentEngagementSeries}
    type="donut"
    height={130}
  />
);

export default ParentEngagementChart;
