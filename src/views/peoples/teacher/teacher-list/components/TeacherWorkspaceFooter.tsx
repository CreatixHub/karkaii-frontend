import { pageSizes } from '../data/teacherWorkspace.data';

export interface TeacherWorkspaceFooterProps {
  rangeFrom: number;
  rangeTo: number;
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPage: (page: number) => void;
  onPageSize: (size: number) => void;
}

const TeacherWorkspaceFooter = ({
  rangeFrom,
  rangeTo,
  total,
  page,
  pageCount,
  pageSize,
  onPage,
  onPageSize,
}: TeacherWorkspaceFooterProps) => {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="workspace-footer">
      <div className="workspace-footer-info">
        Showing <span className="range-from">{rangeFrom}</span>–
        <span className="range-to">{rangeTo}</span> of{' '}
        <span className="range-total">{total}</span> teachers
      </div>
      <div className="workspace-footer-size">
        <label className="mb-0">Rows:</label>
        <select
          className="form-select"
          aria-label="Rows per page"
          value={pageSize}
          onChange={(event) => onPageSize(Number(event.target.value))}
        >
          {pageSizes.map((size) => (
            <option value={size} key={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <nav className="workspace-pagination" aria-label="Teachers pagination">
        <button
          type="button"
          className="workspace-page-button"
          aria-label="First page"
          disabled={page <= 1}
          onClick={() => onPage(1)}
        >
          <i className="ti ti-chevrons-left" />
        </button>
        <button
          type="button"
          className="workspace-page-button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          <i className="ti ti-chevron-left" />
        </button>
        <span className="workspace-page-numbers">
          {pages.map((number) => (
            <button
              key={number}
              type="button"
              className={`workspace-page-button${number === page ? ' active' : ''}`}
              aria-current={number === page ? 'page' : undefined}
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
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          <i className="ti ti-chevron-right" />
        </button>
        <button
          type="button"
          className="workspace-page-button"
          aria-label="Last page"
          disabled={page >= pageCount}
          onClick={() => onPage(pageCount)}
        >
          <i className="ti ti-chevrons-right" />
        </button>
      </nav>
    </div>
  );
};

export default TeacherWorkspaceFooter;
