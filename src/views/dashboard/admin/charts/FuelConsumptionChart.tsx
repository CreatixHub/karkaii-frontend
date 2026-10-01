import ReactApexChart from 'react-apexcharts';
import {
  fuelConsumptionOptions,
  fuelConsumptionSeries,
} from '../data/adminDashboard.charts';

const FuelConsumptionChart = () => (
  <div className="mb-0">
    <ReactApexChart
      options={fuelConsumptionOptions}
      series={fuelConsumptionSeries}
      type="line"
      height={330}
    />
  </div>
);

export default FuelConsumptionChart;
