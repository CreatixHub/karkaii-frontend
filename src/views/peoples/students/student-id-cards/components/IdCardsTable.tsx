import type { IdCard, IdCardAction } from '../data/idCards.data';
import type { SortKey } from '../data/idCardsWorkspace.data';
import {
  academicYear,
  lastPage,
  pageNumbers,
  pageSizes,
  totalCards,
} from '../data/idCardsWorkspace.data';
import IdCardRow from './IdCardRow';

/** Header cells, in template order, with the sort key each one reflects. */
const headers: { id: string; label: string; sort?: SortKey }[] = [
  { id: 'student', label: 'Student', sort: 'name' },
  { id: 'admissionNo', label: 'Admission No.' },
  { id: 'class', label: 'Class', sort: 'class' },
  { id: 'section', label: 'Section' },
  { id: 'cardNumber', label: 'Card Number', sort: 'card' },
  { id: 'generatedOn', label: 'Generated On', sort: 'generated' },
  { id: 'issueDate', label: 'Issue Date' },
];

export interface IdCardsTableProps {
  cards: IdCard[];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  columns: Record<string, boolean>;
  onAction: (action: IdCardAction, card: IdCard) => void;
  sort: SortKey;
  pageSize: string;
  onPageSize: (size: string) => void;
  page: string;
  onPage: (page: string) => void;
}

const IdCardsTable = ({
  cards,
  selected,
  onToggleSelect,
  onToggleAll,
  expanded,
  onToggleExpand,
  columns,
  onAction,
  sort,
  pageSize,
  onPageSize,
  page,
  onPage,
}: IdCardsTableProps) => {
  const allSelected = cards.length > 0 && cards.every((card) => selected.includes(card.id));
  const firstPage = page === pageNumbers[0];

  return (
    <>
      <div className="data-table">
        <table className="table align-middle">
          <thead>
            <tr>
              <th className="dt-pin">
                <input
                  type="checkbox"
                  className="dt-check"
                  aria-label="Select all"
                  checked={allSelected}
                  onChange={(event) => onToggleAll(event.target.checked)}
                />
              </th>
              <th />
              {headers
                .filter((header) => columns[header.id])
                .map((header) => (
                  <th
                    key={header.id}
                    className={`dt-sortable${header.sort && header.sort === sort ? ' dt-sort-asc' : ''}`}
                  >
                    {header.label}
                    <i className="ti ti-arrow-narrow-up dt-sort-ic ms-1" />
                  </th>
                ))}
              {columns.cardStatus ? <th>Card Status</th> : null}
              {columns.issueStatus ? <th>Issue Status</th> : null}
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cards.map((card) => (
              <IdCardRow
                key={card.id}
                card={card}
                selected={selected.includes(card.id)}
                onToggleSelect={onToggleSelect}
                expanded={expanded.includes(card.id)}
                onToggleExpand={onToggleExpand}
                columns={columns}
                onAction={onAction}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-foot">
        <div className="card-foot-info">
          Showing <span>1–{cards.length}</span> of <span>{totalCards}</span> cards · academic year{' '}
          {academicYear}
        </div>
        <div className="card-foot-size">
          <label className="mb-0">Rows:</label>
          <select
            className="form-select"
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => onPageSize(event.target.value)}
          >
            {pageSizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="card-pagination">
          <button
            type="button"
            className="card-page-btn"
            disabled={firstPage}
            aria-label="First page"
            onClick={() => onPage(pageNumbers[0])}
          >
            <i className="ti ti-chevrons-left" />
          </button>
          <button
            type="button"
            className="card-page-btn"
            disabled={firstPage}
            aria-label="Previous page"
            onClick={() => onPage(String(Math.max(1, Number(page) - 1)))}
          >
            <i className="ti ti-chevron-left" />
          </button>
          <span className="card-page-numbers">
            {pageNumbers.map((number) => (
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
              className={`card-page-btn${page === lastPage ? ' active' : ''}`}
              onClick={() => onPage(lastPage)}
            >
              {lastPage}
            </button>
          </span>
          <button
            type="button"
            className="card-page-btn"
            aria-label="Next page"
            onClick={() => onPage(String(Number(page) + 1))}
          >
            <i className="ti ti-chevron-right" />
          </button>
          <button
            type="button"
            className="card-page-btn"
            aria-label="Last page"
            onClick={() => onPage(lastPage)}
          >
            <i className="ti ti-chevrons-right" />
          </button>
        </div>
      </div>
    </>
  );
};

export default IdCardsTable;
