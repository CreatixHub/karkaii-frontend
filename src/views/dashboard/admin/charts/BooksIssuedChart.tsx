import ReactApexChart from 'react-apexcharts';
import { booksIssuedOptions, booksIssuedSeries } from '../data/adminDashboard.charts';

const BooksIssuedChart = () => (
  <div className="w-100">
    <ReactApexChart
      options={booksIssuedOptions}
      series={booksIssuedSeries}
      type="polarArea"
      height={320}
    />
  </div>
);

export default BooksIssuedChart;
