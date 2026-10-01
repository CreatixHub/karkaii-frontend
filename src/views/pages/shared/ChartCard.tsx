import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export interface ChartCardProps {
  title: string;
  options: ApexOptions;
  series: ApexOptions['series'];
  type: 'line' | 'area' | 'bar' | 'donut' | 'radar' | 'scatter' | 'heatmap' | 'pie';
  height?: number;
  /** Column span; the templates give the wide chart eight columns of twelve. */
  span?: string;
}

const ChartCard = ({ title, options, series, type, height = 300, span = 'col-12 col-xl-8' }: ChartCardProps) => (
  <div className={`${span} d-flex`}>
    <div className="card flex-fill">
      <div className="card-header">
        <h4 className="mb-0 fs-16 fw-medium">{title}</h4>
      </div>
      <div className="card-body">
        <ReactApexChart options={options} series={series} type={type} height={height} />
      </div>
    </div>
  </div>
);

export default ChartCard;
