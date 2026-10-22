import ReactApexChart from 'react-apexcharts';
import {
  enrollmentTrendOptions,
  enrollmentTrendSeries,
} from '../data/adminDashboard.charts';

const EnrollmentTrendChart = () => (
  <ReactApexChart
    options={enrollmentTrendOptions}
    series={enrollmentTrendSeries}
    type="line"
    height={300}
  />
);

export default EnrollmentTrendChart;
