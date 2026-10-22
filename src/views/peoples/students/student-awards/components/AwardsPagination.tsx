import { rowsPerPageOptions } from '../data/awardsWorkspace.data';

export interface AwardsPaginationProps {
  from: number;
  to: number;
  total: number;
  academicYear: string;
  rowsPerPage: string;
  onRowsPerPage: (value: string) => void;
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
}

const AwardsPagination = ({
  from,
  to,
  total,
  academicYear,
  rowsPerPage,
  onRowsPerPage,
  page,
  pageCount,
  onPage,
}: AwardsPaginationProps) => (
  <div className="card-foot">
    <div className="card-foot-info">
      Showing{' '}
      <span>
        {from}–{to}
      </span>{' '}
      of <span>{total}</span> achievements · academic year {academicYear}
    </div>
    <div className="card-foot-size">
      <label className="mb-0" htmlFor="rows-per-page">
        Rows:
      </label>
      <select
        className="form-select"
        id="rows-per-page"
        aria-label="Rows per page"
        value={rowsPerPage}
        onChange={(event) => onRowsPerPage(event.target.value)}
      >
        {rowsPerPageOptions.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
    <div className="card-pagination">
      <button
        type="button"
        className="card-page-btn"
        disabled={page === 1}
        aria-label="First page"
        onClick={() => onPage(1)}
      >
        <i className="ti ti-chevrons-left" />
      </button>
      <button
        type="button"
        className="card-page-btn"
        disabled={page === 1}
        aria-label="Previous page"
        onClick={() => onPage(page - 1)}
      >
        <i className="ti ti-chevron-left" />
      </button>
      <span className="card-page-numbers">
        {[1, 2, 3].map((number) => (
          <button
            key={number}
            type="button"
            className={`card-page-btn${page === number ? ' active' : ''}`}
            onClick={() => onPage(number)}
          >
            {number}
          </button>
        ))}
        <span className="px-1 text-muted">…</span>
        <button
          type="button"
          className={`card-page-btn${page === pageCount ? ' active' : ''}`}
          onClick={() => onPage(pageCount)}
        >
          {pageCount}
        </button>
      </span>
      <button
        type="button"
        className="card-page-btn"
        aria-label="Next page"
        onClick={() => onPage(page + 1)}
      >
        <i className="ti ti-chevron-right" />
      </button>
      <button
        type="button"
        className="card-page-btn"
        aria-label="Last page"
        onClick={() => onPage(pageCount)}
      >
        <i className="ti ti-chevrons-right" />
      </button>
    </div>
  </div>
);

export default AwardsPagination;
