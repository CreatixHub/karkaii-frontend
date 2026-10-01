import { rowsPerPageOptions } from '../data/teachersWorkspace.data';

export interface WorkspaceFooterProps {
  rangeFrom: number;
  rangeTo: number;
  total: number;
  rowsPerPage: number;
  onRowsPerPage: (rows: number) => void;
  page: number;
  pageCount: number;
  onPage: (page: number) => void;
}

const WorkspaceFooter = ({
  rangeFrom,
  rangeTo,
  total,
  rowsPerPage,
  onRowsPerPage,
  page,
  pageCount,
  onPage,
}: WorkspaceFooterProps) => (
  <div className="workspace-footer">
    <div className="workspace-footer-info">
      Showing <span className="range-from">{rangeFrom}</span>–<span className="range-to">{rangeTo}</span>{' '}
      of <span className="range-total">{total}</span> teachers
    </div>
    <div className="workspace-footer-size">
      {/* The template's label carries no `for`; the select is named by aria-label. */}
      <label className="mb-0">Rows:</label>
      <select
        className="form-select"
        aria-label="Rows per page"
        value={rowsPerPage}
        onChange={(event) => onRowsPerPage(Number(event.target.value))}
      >
        {rowsPerPageOptions.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
    <nav className="workspace-pagination" aria-label="Teachers pagination">
      <button
        type="button"
        className="workspace-page-button"
        aria-label="First page"
        disabled={page === 1}
        onClick={() => onPage(1)}
      >
        <i className="ti ti-chevrons-left" />
      </button>
      <button
        type="button"
        className="workspace-page-button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
      >
        <i className="ti ti-chevron-left" />
      </button>
      <span className="workspace-page-numbers">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <button
            type="button"
            className={`workspace-page-button${number === page ? ' active' : ''}`}
            aria-current={number === page ? 'page' : undefined}
            key={number}
            onClick={() => onPage(number)}
          >
            {number}
          </button>
        ))}
      </span>
      <button
        type="button"
        className="workspace-page-button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onPage(page + 1)}
      >
        <i className="ti ti-chevron-right" />
      </button>
      <button
        type="button"
        className="workspace-page-button"
        aria-label="Last page"
        disabled={page === pageCount}
        onClick={() => onPage(pageCount)}
      >
        <i className="ti ti-chevrons-right" />
      </button>
    </nav>
  </div>
);

export default WorkspaceFooter;
