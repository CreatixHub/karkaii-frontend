import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

export interface ChartPanelProps {
  /** Bootstrap column wrapper, e.g. `col-12 col-xl-8`. */
  columnClassName: string;
  /** The id the template gave the mount point. */
  chartId: string;
  title: string;
  /** True for the wide trend card, which the template heads with an `<h4>`. */
  emphasis?: boolean;
  /** The class the page is filtered to, shown so the reader knows the chart's scope. */
  scope: string;
  options: ApexOptions;
  series: ApexOptions['series'];
  type: 'line' | 'radar' | 'scatter';
  height: number;
  ready: boolean;
}

const ChartPanel = ({
  columnClassName,
  chartId,
  title,
  emphasis = false,
  scope,
  options,
  series,
  type,
  height,
  ready,
}: ChartPanelProps) => (
  <div className={`${columnClassName} d-flex`}>
    <div className="card flex-fill">
      <div className="card-header d-flex align-items-center justify-content-between">
        {emphasis ? (
          <h4 className="mb-0 fs-16 fw-medium">{title}</h4>
        ) : (
          <h5 className="mb-0">{title}</h5>
        )}
        <span className="text-muted fs-12">{scope}</span>
      </div>
      <div className="card-body">
        <div id={chartId} style={{ minHeight: height }}>
          {ready ? (
            <ReactApexChart options={options} series={series} type={type} height={height} />
          ) : null}
        </div>
      </div>
    </div>
  </div>
);

export default ChartPanel;
