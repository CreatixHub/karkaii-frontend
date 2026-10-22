import ReactApexChart from 'react-apexcharts';
import {
  fleetUtilizationOptions,
  fleetUtilizationSeries,
} from '../data/adminDashboard.charts';

const FleetUtilizationChart = () => (
  <div className="mb-3">
    <ReactApexChart
      options={fleetUtilizationOptions}
      series={fleetUtilizationSeries}
      type="bar"
      height={40}
    />
  </div>
);

export default FleetUtilizationChart;
