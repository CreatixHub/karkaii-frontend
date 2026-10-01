import { attendanceTiles, leaveHistory } from '../../data/teacherDetailsPanes.data';

export interface LeaveAttendancePaneProps {
  active: boolean;
}

const LeaveAttendancePane = ({ active }: LeaveAttendancePaneProps) => (
  <div className={`tab-pane fade${active ? ' show active' : ''}`} id="leave_attendance">
    <div className="row g-3 mb-3">
      {attendanceTiles.map((tile) => (
        <div className="col-md-3 col-6 d-flex" key={tile.id}>
          <div className="card card-hover w-100 mb-0">
            <div className="card-body p-3">
              <span className={`avatar avatar-md ${tile.tone} rounded-circle flex-shrink-0 mb-2`}>
                <i className={`${tile.icon} fs-20`} />
              </span>
              <p className="mb-1 text-muted fs-12">{tile.label}</p>
              <h6 className="mb-0">{tile.value}</h6>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="card card-hover">
      <div className="card-header">
        <h5 className="d-flex align-items-center gap-2">
          <i className="ti ti-calendar-due text-primary" />
          Leave History
        </h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="thead-light">
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.map((row) => (
                <tr key={row.id}>
                  <td>{row.type}</td>
                  <td>{row.from}</td>
                  <td>{row.to}</td>
                  <td>{row.days}</td>
                  <td>
                    <span className={`badge ${row.statusClass} d-inline-flex align-items-center`}>
                      <i className="ti ti-circle-filled fs-5 me-1" />
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default LeaveAttendancePane;
