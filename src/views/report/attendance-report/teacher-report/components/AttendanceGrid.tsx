import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { DayColumn, ReportRow } from '../data/teacherReport.data';

const routes = all_routes;

export interface AttendanceGridProps {
  rows: ReportRow[];
  dayColumns: DayColumn[];
  /** Replays the table body while a refresh runs. */
  loading: boolean;
}

const AttendanceGrid = ({ rows, dayColumns, loading }: AttendanceGridProps) => {
  const columnCount = 7 + dayColumns.length;

  return (
    <div className="custom-datatable-filter table-responsive">
      <table className="table datatable">
        <thead className="thead-light">
          <tr>
            <th>Student / Date</th>
            <th>%</th>
            <th className="no-sort">P</th>
            <th className="no-sort">L</th>
            <th className="no-sort">A</th>
            <th className="no-sort">H</th>
            <th className="no-sort">F</th>
            {dayColumns.map((column) => (
              <th className="no-sort" key={column.num}>
                <div className="text-center">
                  <span className="day-num d-block">{column.num}</span>
                  <span>{column.day}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }, (_, index) => (
              <tr key={`skeleton-${index}`}>
                <td colSpan={columnCount}>
                  <span className="skeleton skeleton-line" />
                </td>
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columnCount} className="text-center py-4 text-muted">
                <i className="ti ti-calendar-off me-1" />
                No teacher attendance matches the selected filters.
              </td>
            </tr>
          ) : (
            rows.map((teacher) => (
              <tr key={teacher.name}>
                <td>
                  <div className="d-flex align-items-center">
                    <Link to={routes.teacherReport} className="avatar avatar-md">
                      <ImageWithBasePath
                        src={teacher.avatar}
                        className="img-fluid rounded-circle flex-shrink-0"
                        alt="img"
                      />
                    </Link>
                    <div className="ms-2">
                      <p className="text-dark mb-0">
                        <Link to={routes.teacherReport}>{teacher.name}</Link>
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={teacher.percent.className}>{teacher.percent.value}</span>
                </td>
                <td>{teacher.present}</td>
                <td>{teacher.late}</td>
                <td>{teacher.absent}</td>
                <td>{teacher.halfday}</td>
                <td>{teacher.holiday}</td>
                {teacher.days.map((tone, index) => (
                  <td key={dayColumns[index]?.num ?? index}>
                    <span className={`attendance-range ${tone}`} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceGrid;
