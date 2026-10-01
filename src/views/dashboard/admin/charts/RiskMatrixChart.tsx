import ReactApexChart from 'react-apexcharts';
import { riskMatrixOptions, riskMatrixSeries } from '../data/adminDashboard.charts';

const RiskMatrixChart = () => (
  <ReactApexChart
    options={riskMatrixOptions}
    series={riskMatrixSeries}
    type="scatter"
    height={236}
  />
);

export default RiskMatrixChart;
