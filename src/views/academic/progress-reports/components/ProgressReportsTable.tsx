import { tableHeaders } from '../data/progressReports.data';
import type { ProgressReportRow, SortKey } from '../data/progressReports.data';

export interface ProgressReportsTableProps {
  rows: ProgressReportRow[];
  /** Null while the rows are in the order the template ships them. */
  sort: SortKey | null;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
}

const ProgressReportsTable = ({ rows, sort, sortAsc, onSort }: ProgressReportsTableProps) => {
  const sortIcon = (key: SortKey) => {
    if (sort !== key) return 'ti ti-arrows-sort';
    return sortAsc ? 'ti ti-arrow-narrow-up' : 'ti ti-arrow-narrow-down';
  };

  const ariaSort = (key: SortKey) => {
    if (sort !== key) return 'none' as const;
    return sortAsc ? ('ascending' as const) : ('descending' as const);
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover mb-0">
        <caption className="visually-hidden">
          Progress reports by student, with the measured metric, score and grade
        </caption>
        <thead className="table-light">
          <tr>
            {tableHeaders.map((header) => (
              <th
                key={header.key}
                role="button"
                tabIndex={0}
                aria-sort={ariaSort(header.key)}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => onSort(header.key)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  onSort(header.key);
                }}
              >
                {header.label}
                <i className={`${sortIcon(header.key)} ms-1 fs-12 text-muted`} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>{row.student}</td>
              <td>{row.className}</td>
              <td>{row.metric}</td>
              <td>{row.score}%</td>
              <td>
                <span className={row.gradeClass}>{row.grade}</span>
              </td>
            </tr>
          ))}
          {rows.length === 0 ? (
            <tr>
              <td colSpan={tableHeaders.length} className="text-center text-muted py-4">
                <i className="ti ti-mood-empty me-1" />
                No progress reports match the selected filters
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
};

export default ProgressReportsTable;
