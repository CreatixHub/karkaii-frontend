import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import type { PerformanceRow, SortKey } from '../data/subjectPerformance.data';
import { performanceColumns } from '../data/subjectPerformance.data';

/** The header is a `<th>`, so the click affordance has to be spelled out. */
const SORT_HEADER: CSSProperties = { cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' };

const sortIcon = (active: boolean, ascending: boolean): string => {
  if (!active) return 'ti ti-arrows-sort';
  return ascending ? 'ti ti-sort-ascending' : 'ti ti-sort-descending';
};

export interface PerformanceTableProps {
  rows: PerformanceRow[];
  sortKey: SortKey | null;
  ascending: boolean;
  onSort: (key: SortKey) => void;
  onDownload: () => void;
  onReset: () => void;
}

const PerformanceTable = ({ rows, sortKey, ascending, onSort, onDownload, onReset }: PerformanceTableProps) => (
  <div className="card">
    <div className="card-header d-flex align-items-center justify-content-between">
      <h4 className="mb-0">Subject Performance</h4>
      <Link to="#" className="btn btn-outline-light bg-white btn-sm" onClick={onDownload}>
        <i className="ti ti-download me-1" />
        Download
      </Link>
    </div>
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <caption className="visually-hidden">
            Subject performance by student, class, metric, score and grade
          </caption>
          <thead className="table-light">
            <tr>
              {performanceColumns.map((column) => {
                const active = sortKey === column.key;

                return (
                  <th
                    key={column.key}
                    role="button"
                    tabIndex={0}
                    style={SORT_HEADER}
                    aria-sort={active ? (ascending ? 'ascending' : 'descending') : 'none'}
                    onClick={() => onSort(column.key)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onSort(column.key);
                      }
                    }}
                  >
                    {column.label}
                    <i
                      className={`${sortIcon(active, ascending)} ms-1 fs-12 ${active ? 'text-primary' : 'text-muted'}`}
                    />
                  </th>
                );
              })}
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
                  <span className={`badge ${row.gradeBadge}`}>{row.grade}</span>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={performanceColumns.length} className="text-center py-5">
                  <i className="ti ti-search-off fs-24 d-block mb-2 text-muted" />
                  <p className="mb-2">No records match the selected filters.</p>
                  <Link to="#" className="link-primary" onClick={onReset}>
                    Reset filters
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default PerformanceTable;
