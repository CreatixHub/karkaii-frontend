import AttendanceHeatmapChart from '../charts/AttendanceHeatmapChart';

const AttendanceHeatmapCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Intelligence</span>
      <h4 className="card-title mb-0">Student Attendance Heatmap</h4>
    </div>
    <div className="card-body d-flex flex-column">
      <AttendanceHeatmapChart />
      <div className="d-flex align-items-center justify-content-between border-top pt-3 mt-auto">
        <span className="stat-label">Weekly average attendance across all classes</span>
        <span className="badge badge-soft-success">94.8%</span>
      </div>
    </div>
  </div>
);

export default AttendanceHeatmapCard;
