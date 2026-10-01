import { mostBorrowedBooks } from '../data/adminDashboard.library';

const MostBorrowedBooksCard = () => (
  <div className="card flex-fill mb-4">
    <div className="card-header">
      <span className="stat-caption">Trending</span>
      <h4 className="card-title mb-0">Most Borrowed Books</h4>
    </div>
    <div className="card-body p-0 data-list data-list-inset data-list-hover">
      {mostBorrowedBooks.map((book) => (
        <div className={`data-list-item${book.isTop ? ' is-top' : ''}`} key={book.id}>
          <span className="data-list-index">{book.rank}</span>
          <span className={`avatar avatar-icon ${book.avatarClass}`}>
            <i className={book.icon} />
          </span>
          <div className="data-list-body">
            <div className="data-list-title text-truncate">{book.title}</div>
            <div className="data-list-meta">
              <span className={`badge ${book.categoryClass}`}>{book.category}</span>
              <span className="chip chip-muted">
                <i className="ti ti-users" />
                {book.grades}
              </span>
              {book.extra ? (
                <span className={book.extra.className}>
                  <i className={book.extra.icon} />
                  {book.extra.label}
                </span>
              ) : null}
            </div>
          </div>
          <div className="data-list-end">
            <div className="stat-value stat-value-xs">
              {book.issues}
              <span> issues</span>
            </div>
            <div className={`meter meter-xs ${book.meterClass}`}>
              <span style={{ width: book.width }} />
            </div>
          </div>
        </div>
      ))}

      <div className="data-list-footer flex-wrap pt-3 pb-0">
        <span className="stat-label">
          <i className="ti ti-books me-1" />
          326 titles borrowed this week
        </span>
        <button type="button" className="btn btn-link link-primary fw-medium fs-13 p-0">
          Full report <i className="ti ti-arrow-right ms-1" />
        </button>
      </div>
    </div>
  </div>
);

export default MostBorrowedBooksCard;
