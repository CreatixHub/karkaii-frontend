import { attendanceByGroup, attendanceTiles } from '../data/adminDashboard.data';

const AttendanceBreakdownCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Today</span>
      <h4 className="card-title mb-0">Attendance Breakdown</h4>
    </div>
    <div className="card-body">
      <div className="d-flex align-items-center gap-3 mb-3 pb-3">
        <div className="gauge gauge-success">
          <span className="gauge-value">94.8%</span>
        </div>
        <div>
          <h3 className="mb-0 fw-bold">
            3,464 <span className="fs-14 text-muted fw-normal">/ 3,654</span>
          </h3>
          <p className="stat-label mb-2">Students present today</p>
          <span className="badge badge-soft-success">
            <i className="ti ti-arrow-up-right" />
            0.8% vs yesterday
          </span>
        </div>
      </div>

      <div className="row g-2 mb-3">
        {attendanceTiles.map((tile) => (
          <div className="col-sm-6" key={tile.id}>
            <div className="d-flex align-items-center gap-2 border rounded-3 p-2">
              <span className={`avatar avatar-icon avatar-md ${tile.iconClass}`}>
                <i className={tile.icon} />
              </span>
              <div>
                <h5 className="mb-0">{tile.value}</h5>
                <span className="stat-label">{tile.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h6 className="stat-caption mb-2">By Group</h6>
      {attendanceByGroup.map((group, index) => (
        <div
          className={index === attendanceByGroup.length - 1 ? 'mb-0' : 'mb-3'}
          key={group.label}
        >
          <div className="d-flex align-items-center justify-content-between fs-13 mb-1">
            <span>
              <i className={`${group.icon} me-1`} />
              {group.label}
            </span>
            <span className="fw-semibold">{group.percent}</span>
          </div>
          <div className={`meter ${group.meterClass}`}>
            <span style={{ width: group.percent }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AttendanceBreakdownCard;
