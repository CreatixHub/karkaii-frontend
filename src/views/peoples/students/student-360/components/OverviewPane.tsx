import ReactApexChart from 'react-apexcharts';
import {
  attendanceTrendOptions,
  attendanceTrendSeries,
  radarOptions,
  radarSeries,
} from '../data/student360.charts';

const OverviewPane = () => (
  <div className="tab-pane fade show active" id="s360-overview">
    <div className="row">
      <div className="col-12 col-lg-7">
        <h4 className="mb-2 fs-15 fw-medium">Attendance Trend</h4>
        <div id="s360_attendance_trend">
          <ReactApexChart
            options={attendanceTrendOptions}
            series={attendanceTrendSeries}
            type="area"
            height={260}
          />
        </div>
      </div>
      <div className="col-12 col-lg-5">
        <h5 className="mb-2 fs-15">Subject Performance</h5>
        <div id="s360_radar">
          <ReactApexChart options={radarOptions} series={radarSeries} type="radar" height={260} />
        </div>
      </div>
    </div>
  </div>
);

export default OverviewPane;
