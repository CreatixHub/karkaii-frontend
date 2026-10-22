import ReactApexChart from 'react-apexcharts';
import {
  communicationTrendOptions,
  communicationTrendSeries,
} from '../data/adminDashboard.charts';

const CommunicationTrendChart = () => (
  <ReactApexChart
    options={communicationTrendOptions}
    series={communicationTrendSeries}
    type="area"
    height={355}
  />
);

export default CommunicationTrendChart;
