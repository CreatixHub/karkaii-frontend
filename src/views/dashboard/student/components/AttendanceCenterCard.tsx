import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import {
  attendanceHeatCells,
  attendanceSplit,
  attendanceSummaryTiles,
  subjectAttendance,
} from '../data/studentDashboard.data';

const AttendanceCenterCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-calendar-stats" title="Attendance Center">
      <span className="badge badge-soft-success">Goal 95%</span>
    </WidgetHeader>

    <div className="attendance-split mb-3">
      {attendanceSplit.map((period) => (
        <div key={period.id}>
          <div className="v">{period.value}</div>
          <div className="l">{period.label}</div>
          <div className="progress progress-xs mt-1">
            <div className={`progress-bar ${period.barClass}`} style={{ width: `${period.percent}%` }} />
          </div>
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2">
      <i className="ti ti-layout-grid me-1" />
      30-Day Heatmap
    </h6>
    <div className="heatmap">
      {attendanceHeatCells.map((level, index) => (
        <span className={level} key={index} />
      ))}
    </div>
    <div className="heatmap-legend d-flex align-items-center">
      <span>Less</span>
      <i style={{ background: 'rgba(22,163,74,.25)' }} />
      <i style={{ background: 'rgba(22,163,74,.45)' }} />
      <i style={{ background: 'rgba(22,163,74,.68)' }} />
      <i style={{ background: 'rgba(22,163,74,.9)' }} />
      <span>More</span>
      <i style={{ background: 'rgba(220,38,38,.55)' }} className="ms-2" />
      <span>Absent</span>
    </div>

    <div className="row g-2 mt-2">
      {attendanceSummaryTiles.map((tile) => (
        <div className="col-6" key={tile.id}>
          <InfoListRow row={tile} small />
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2 mt-3">
      <i className="ti ti-list-check me-1" />
      Subject-wise Attendance
    </h6>
    <div className="subject-list d-flex flex-column">
      {subjectAttendance.map((subject) => (
        <div className="subject-item subject-item-compact" key={subject.id}>
          <span className="nm">{subject.name}</span>
          <div className="progress progress-sm">
            <div className={`progress-bar ${subject.barClass}`} style={{ width: subject.width }} />
          </div>
          <span className="pc">{subject.percent}</span>
          <span className={`gr ${subject.ratioClass}`}>{subject.ratio}</span>
        </div>
      ))}
    </div>
  </div>
);

export default AttendanceCenterCard;
