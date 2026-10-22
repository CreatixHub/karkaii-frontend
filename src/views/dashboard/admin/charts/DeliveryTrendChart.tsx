import ReactApexChart from 'react-apexcharts';
import {
  deliveryTrendOptions,
  deliveryTrendSeries,
} from '../data/adminDashboard.charts';

const DeliveryTrendChart = () => (
  <ReactApexChart
    options={deliveryTrendOptions}
    series={deliveryTrendSeries}
    type="bar"
    height={30}
  />
);

export default DeliveryTrendChart;
