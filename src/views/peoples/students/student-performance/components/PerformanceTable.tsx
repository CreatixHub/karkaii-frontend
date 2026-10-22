import { Fragment } from 'react';
import type {
  ColumnId,
  PerformanceModalId,
  PerformanceRow,
} from '../data/studentPerformance.data';
import {
  lastPage,
  pageNumbers,
  rowActions,
  rowsPerPageOptions,
  tableColumns,
} from '../data/studentPerformance.data';
import PerformanceRowDetail from './PerformanceRowDetail';
import { ActionLink } from '@components/workspace';

export interface PerformanceTableProps {
  rows: PerformanceRow[];
  columns: Record<ColumnId, boolean>;
  selected: string[];
  onToggleSelect: (id: string) => void;
  onToggleAll: (checked: boolean) => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  onOpenModal: (modal: PerformanceModalId) => void;
  onOpenPanel: () => void;
  pageSize: string;
  onPageSize: (size: string) => void;
  page: string;
  onPage: (page: string) => void;
}

const PerformanceTable = ({
  rows,
  columns,
  selected,
  onToggleSelect,
  onToggleAll,
  expanded,
  onToggleExpand,
  onOpenModal,
  onOpenPanel,
  pageSize,
  onPageSize,
  page,
  onPage,
}: PerformanceTableProps) => {
  const visibleColumns = tableColumns.filter((column) => columns[column.id]);
  const detailSpan = visibleColumns.length + 3;
  const allSelected = rows.length > 0 && rows.every((row) => selected.includes(row.id));
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
              {visibleColumns.map((column) =>
                column.sortable ? (
                  <th
                    key={column.id}
                    className={`dt-sortable${column.sorted ? ' dt-sort-asc' : ''}`}
                  >
                    {column.label}
                    <i className="ti ti-arrow-narrow-up dt-sort-ic ms-1" />
                  </th>
                ) : (
                  <th key={column.id}>{column.label}</th>
                ),
              )}
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const isOpen = expanded.includes(row.id);

              return (
                <Fragment key={row.id}>
                  <tr className="dt-row">
                    <td className="dt-pin">
                      <input
                        type="checkbox"
                        className="dt-check"
                        aria-label="Select row"
                        checked={selected.includes(row.id)}
                        onChange={() => onToggleSelect(row.id)}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="dt-expand"
                        aria-expanded={isOpen}
                        aria-controls={row.id}
                        aria-label="Toggle performance details"
                        onClick={() => onToggleExpand(row.id)}
                      >
                        <i className="ti ti-chevron-right" />
                      </button>
                    </td>
                    {columns.student ? (
                      <td>
                        <div className="dt-user">
                          <span
                            className={`avatar avatar-md ${row.avatar} rounded flex-shrink-0 me-2`}
                          >
                            <i className="ti ti-user" />
                          </span>
                          <div>
                            <ActionLink
                              className="dt-name"
                              onClick={() => onOpenModal('view')}
                            >
                              {row.name}
                            </ActionLink>
                            <div className="dt-sub flex-nowrap text-nowrap">{row.sub}</div>
                          </div>
                        </div>
                      </td>
                    ) : null}
                    {columns.admission ? (
                      <td className="text-nowrap">
                        <span className="fs-13 fw-medium d-block">{row.admissionNo}</span>
                        <span className="fs-12 text-muted">{row.roll}</span>
                      </td>
                    ) : null}
                    {columns.class ? (
                      <td className="text-nowrap">
                        <span className="badge badge-soft-secondary">{row.classBadge}</span>
                        <span className="d-block fs-12 text-muted mt-1">{row.classMeta}</span>
                      </td>
                    ) : null}
                    {columns.exam ? (
                      <td className="text-nowrap">
                        <span className="fs-13 fw-medium d-block">{row.exam}</span>
                        <span className="fs-12 text-muted">{row.examMeta}</span>
                      </td>
                    ) : null}
                    {columns.score ? (
                      <td className="text-nowrap">
                        <span className="fs-13 fw-medium d-block">{row.score}</span>
                        <span className="fs-12 text-muted d-block">{row.scoreMarks}</span>
                        <span className="fs-12 text-muted d-block">{row.scoreDelta}</span>
                      </td>
                    ) : null}
                    {columns.grade ? (
                      <td className="text-nowrap">
                        <span className={row.gradeBadge}>{row.grade}</span>
                        <span className="d-block fs-12 text-muted mt-1">{row.gradeRemark}</span>
                      </td>
                    ) : null}
                    {columns.rank ? (
                      <td className="text-nowrap">
                        <span className="fs-13 fw-medium d-block">{row.rank}</span>
                        <span className="fs-12 text-muted d-block">{row.rankMeta}</span>
                        {row.rankMove ? (
                          <span className="d-block mt-1">
                            <span className={row.rankMove.badge}>
                              <i className={`${row.rankMove.icon} me-1`} />
                              {row.rankMove.label}
                            </span>
                          </span>
                        ) : null}
                      </td>
                    ) : null}
                    {columns.attendance ? (
                      <td className="text-nowrap">
                        <span className="fs-13 fw-medium d-block">{row.attendance}</span>
                        <span className="fs-12 text-muted d-block text-nowrap">
                          {row.attendanceDays}
                        </span>
                        <span className={`${row.attendanceBandBadge} mt-1`}>
                          {row.attendanceBand}
                        </span>
                      </td>
                    ) : null}
                    {columns.level ? (
                      <td>
                        <span className={row.levelPill}>
                          <span className="dt-pill-dot" />
                          {row.level}
                        </span>
                        <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                          {row.levelMeta}
                        </span>
                      </td>
                    ) : null}
                    <td>
                      <div className="dt-actions">
                        {rowActions.map((action) => (
                          <button
                            key={action.id}
                            type="button"
                            className={action.className}
                            aria-label={action.label}
                            onClick={() => onOpenModal(action.modal)}
                          >
                            <i className={action.icon} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr className="dt-detail">
                    <td colSpan={detailSpan}>
                      <div className={`collapse${isOpen ? ' show' : ''}`} id={row.id}>
                        <PerformanceRowDetail
                          detail={row.detail}
                          leadingHeadings={index === 0}
                          onOpenModal={onOpenModal}
                          onOpenPanel={onOpenPanel}
                        />
                      </div>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card-foot">
        <div className="card-foot-info">
          Showing <span>1–{rows.length}</span> of <span>1,186</span> students · Term 1 Exam
          2026-2027
        </div>
        <div className="card-foot-size">
          <label className="mb-0">Rows:</label>
          <select
            className="form-select"
            aria-label="Rows per page"
            value={pageSize}
            onChange={(event) => onPageSize(event.target.value)}
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

export default PerformanceTable;
