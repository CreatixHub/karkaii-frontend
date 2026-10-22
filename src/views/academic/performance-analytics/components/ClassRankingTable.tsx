import type { ClassLevel, RankingRowView } from '../data/performanceAnalytics.data';

export interface ClassRankingTableProps {
  rows: RankingRowView[];
  /** The class the page is filtered to, or null while showing all of them. */
  activeClassId: ClassLevel | null;
  onSelectClass: (classId: ClassLevel) => void;
}

const ClassRankingTable = ({ rows, activeClassId, onSelectClass }: ClassRankingTableProps) => (
  <div className="col-12 col-xl-6 d-flex">
    <div className="card flex-fill">
      <div className="card-header">
        <h5 className="mb-0">Class Ranking</h5>
      </div>
      <div className="card-body p-0 py-2">
        <div className="table-responsive">
          <table className="table table-nowrap mb-0">
            <thead className="thead-light">
              <tr>
                <th>Rank</th>
                <th>Class</th>
                <th>Avg %</th>
                <th>Attendance</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.classId === activeClassId ? 'table-active' : undefined}
                  style={{ cursor: 'pointer' }}
                  title={`Scope the analytics to ${row.label}`}
                  onClick={() => onSelectClass(row.classId)}
                >
                  <td>{row.rank}</td>
                  <td>{row.label}</td>
                  <td>{row.avgPercent}%</td>
                  <td>{row.attendance}%</td>
                  <td>
                    {row.trend.direction === 'up' ? (
                      <span className="badge badge-soft-success">
                        <i className="ti ti-arrow-up-right" /> {row.trend.value}
                      </span>
                    ) : (
                      <span className="badge badge-soft-danger">
                        <i className="ti ti-arrow-down-right" /> {row.trend.value}
                      </span>
                    )}
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

export default ClassRankingTable;
