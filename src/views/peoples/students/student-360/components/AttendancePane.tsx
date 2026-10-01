import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { AttendanceTile } from '../data/student360.data';

const routes = all_routes;

export interface AttendancePaneProps {
  tiles: AttendanceTile[];
}

const AttendancePane = ({ tiles }: AttendancePaneProps) => (
  <div className="tab-pane fade show active" id="s360-attendance">
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="mb-0">Attendance Summary</h5>
      <Link to={routes.studentAttendanceHistory} className="btn btn-sm btn-light">
        Full History
      </Link>
    </div>
    <div className="row">
      {tiles.map((tile) => (
        <div className="col-md-3" key={tile.id}>
          <div className="border rounded p-3 text-center mb-2">
            <h4 className={`mb-0 ${tile.className}`}>{tile.value}</h4>
            <span className="fs-12 text-muted">{tile.label}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AttendancePane;
