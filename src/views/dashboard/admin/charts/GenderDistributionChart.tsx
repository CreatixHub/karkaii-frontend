import ReactApexChart from 'react-apexcharts';
import {
  genderDistributionOptions,
  genderDistributionSeries,
} from '../data/adminDashboard.charts';

const GenderDistributionChart = () => (
  <ReactApexChart
    options={genderDistributionOptions}
    series={genderDistributionSeries}
    type="bar"
    height={216}
  />
);

export default GenderDistributionChart;
