import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { buildMiniBarOptions } from '../data/adminDashboard.charts';

export interface MiniBarChartProps {
  color: string;
  data: number[];
  className?: string;
}

const MiniBarChart = ({ color, data, className = 'mx-auto' }: MiniBarChartProps) => {
  const options = useMemo(() => buildMiniBarOptions(color), [color]);
  const series = useMemo(() => [{ name: 'Delivery', data }], [data]);

  return (
    <div className={className}>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={30}
        width={60}
      />
    </div>
  );
};

export default MiniBarChart;
