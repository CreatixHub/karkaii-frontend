import { pageSizes } from '../data/deleteRequest.data';

export interface DeleteRequestFooterProps {
  rangeFrom: number;
  rangeTo: number;
  total: number;
  pageSize: string;
  onPageSize: (value: string) => void;
  currentPage: number;
  pageCount: number;
  onPage: (page: number) => void;
}

const DeleteRequestFooter = ({
  rangeFrom,
  rangeTo,
  total,
  pageSize,
  onPageSize,
  currentPage,
  pageCount,
  onPage,
}: DeleteRequestFooterProps) => {
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="card-foot">
      <div className="card-foot-info">
        Showing <span className="range-from">{rangeFrom}</span>–<span className="range-to">{rangeTo}</span> of{' '}
        <span className="range-total">{total}</span> requests
      </div>
      <div className="card-foot-size">
        <label className="mb-0">Rows:</label>
        <select
          className="form-select"
          aria-label="Rows per page"
          value={pageSize}
          onChange={(event) => onPageSize(event.target.value)}
        >
          {pageSizes.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <nav className="card-pagination" aria-label="Requests pagination">
        <button
          type="button"
          className="card-page-btn"
          aria-label="First page"
          disabled={currentPage === 1}
          onClick={() => onPage(1)}
        >
          <i className="ti ti-chevrons-left" />
        </button>
        <button
          type="button"
          className="card-page-btn"
          aria-label="Previous page"
          disabled={currentPage === 1}
          onClick={() => onPage(currentPage - 1)}
        >
          <i className="ti ti-chevron-left" />
        </button>
        <span className="card-page-numbers">
          {pages.map((number) => (
            <button
              key={number}
              type="button"
              className={`card-page-btn${number === currentPage ? ' active' : ''}`}
              aria-current={number === currentPage ? 'page' : undefined}
              onClick={() => onPage(number)}
            >
              {number}
            </button>
          ))}
        </span>
        <button
          type="button"
          className="card-page-btn"
          aria-label="Next page"
          disabled={currentPage === pageCount}
          onClick={() => onPage(currentPage + 1)}
        >
          <i className="ti ti-chevron-right" />
        </button>
        <button
          type="button"
          className="card-page-btn"
          aria-label="Last page"
          disabled={currentPage === pageCount}
          onClick={() => onPage(pageCount)}
        >
          <i className="ti ti-chevrons-right" />
        </button>
      </nav>
    </div>
  );
};

export default DeleteRequestFooter;
