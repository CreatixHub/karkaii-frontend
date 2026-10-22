import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, ResultRow, RowMenuItem, SortKey } from '../data/examResults.data';
import { ActionLink } from '@components/workspace';
import {
  historyCopy,
  internalCopy,
  practicalCopy,
  rowMenuItems,
  tableHeaders,
  teacherRemarkCopy,
} from '../data/examResults.data';

const routes = all_routes as Record<string, string>;

export interface ResultsTableProps {
  rows: ResultRow[];
  columns: Record<ColumnId, boolean>;
  sort: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
  selected: string[];
  onToggleSelect: (id: string) => void;
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onView: (row: ResultRow) => void;
  onEdit: (row: ResultRow) => void;
  onMenuAction: (item: RowMenuItem, row: ResultRow) => void;
}

const ResultsTable = ({
  rows,
  columns,
  sort,
  sortAsc,
  onSort,
  selected,
  onToggleSelect,
  allChecked,
  someChecked,
  onToggleAll,
  expanded,
  onToggleExpand,
  openMenu,
  onOpenMenu,
  onView,
  onEdit,
  onMenuAction,
}: ResultsTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey) => {
    if (sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  /** The quick action strip repeats three toast-only actions; they share one handler. */
  const quickAction = (id: string, label: string, icon: string, row: ResultRow) =>
    onMenuAction({ id, label, icon }, row);

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Exam results with student, exam details, marks and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all results"
                checked={allChecked}
                ref={(node) => {
                  if (node) node.indeterminate = someChecked && !allChecked;
                }}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            {tableHeaders.map((header) =>
              columns[header.id] ? (
                <th
                  key={header.id}
                  className={`dt-sortable${sortClass(header.sort)}`}
                  onClick={() => onSort(header.sort)}
                >
                  {header.label} <i className="ti ti-arrows-sort dt-sort-ic" />
                  <span className="dt-resize" />
                </th>
              ) : null,
            )}
            <th className="text-end card-actions-row">Actions</th>
          </tr>
        </thead>
        <tbody id="clsBody">
          {rows.map((row) => {
            const isOpen = expanded.includes(row.id);
            return (
              <Fragment key={row.id}>
                <tr
                  className={`dt-row${isOpen ? ' expanded' : ''}${selected.includes(row.id) ? ' dt-selected' : ''}`}
                >
                  <td>
                    <button
                      type="button"
                      className="dt-expand"
                      aria-label={`Expand ${row.name}`}
                      aria-expanded={isOpen}
                      onClick={() => onToggleExpand(row.id)}
                    >
                      <i className="ti ti-chevron-right" />
                    </button>
                  </td>
                  <td className="dt-pin">
                    <input
                      type="checkbox"
                      className="dt-check row-select-cell"
                      aria-label={`Select ${row.name}`}
                      checked={selected.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  {columns.student ? (
                    <td>
                      <div className="dt-user">
                        <Link to={routes.studentDetail} className="dt-avatar">
                          <ImageWithBasePath
                            src={row.avatar}
                            className="rounded-circle flex-shrink-0"
                            alt={row.name}
                          />
                        </Link>
                        <div>
                          <Link to={routes.studentDetail} className="dt-name">
                            {row.name}
                          </Link>
                          <div className="dt-sub">
                            <span className="link-primary dt-adm">{row.admissionNo}</span>
                            <span className="dt-dot">·</span>
                            <span>
                              Roll <span className="dt-roll-val">{row.roll}</span>
                            </span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-primary">
                              <i className="ti ti-school me-1" />
                              Class <span className="dt-acls">{row.className}</span>-{row.section}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : null}

                  {columns.exam ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1">
                          <span className="fw-medium text-dark dt-exam">{row.exam}</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info dt-subject">{row.subject}</span>{' '}
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-calendar me-1" />
                            {row.year}
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          <span className="dt-date">{row.date}</span>
                        </li>
                        <li className="d-flex align-items-center gap-1 py-1">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={row.teacher.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={row.teacher.name}
                            />
                          </span>
                          <span>
                            <span className="text-muted">Teacher</span>{' '}
                            <Link to={routes.teacherDetails} className="fw-medium text-dark">
                              {row.teacher.name}
                            </Link>
                          </span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.result ? (
                    <td>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-semibold fs-13">
                          <span className="dt-obt-val">{row.obtained}</span> /{' '}
                          <span className="dt-max-val">{row.max}</span>
                        </span>
                        <span className={`fs-12 fw-medium text-${row.tone}`}>
                          <span className="dt-pct-val">{row.percentage}</span>%
                        </span>
                      </div>
                      <div className={`meter meter-${row.meterTone}`}>
                        <span style={{ width: `${row.percentage}%` }} />
                      </div>
                      <div className="d-flex flex-wrap align-items-center gap-1 mt-2">
                        <span className={`badge badge-soft-${row.tone}`}>
                          <i className="ti ti-award me-1" />
                          Grade <span className="dt-grade">{row.grade}</span>
                        </span>
                        <span className="badge badge-soft-secondary">
                          <i className="ti ti-star me-1" />
                          GP {row.gradePoint}
                        </span>
                        <span className="badge badge-soft-primary">
                          <i className="ti ti-trophy me-1" />
                          Rank <span className="dt-rank-val">{row.rank}</span>
                        </span>
                      </div>
                    </td>
                  ) : null}

                  {columns.status ? (
                    <td>
                      <span className={`dt-pill ${row.pillClass}`}>
                        {row.pillIcon ? <i className={row.pillIcon} /> : <span className="dt-pill-dot" />}
                        {row.status}
                      </span>
                    </td>
                  ) : null}

                  <td>
                    <div className="dt-actions">
                      <Link
                        to="#"
                        className="dt-ib"
                        title="View Result"
                        aria-label="View Result"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Edit Marks"
                        aria-label="Edit Marks"
                        onClick={() => onEdit(row)}
                      >
                        <i className="ti ti-edit" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Publish Result"
                        aria-label="Publish Result"
                        onClick={() => quickAction('publish', 'Publish Result', 'ti ti-send', row)}
                      >
                        <i className="ti ti-send" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Download Marksheet"
                        aria-label="Download Marksheet"
                        onClick={() =>
                          quickAction('download_marksheet', 'Download Marksheet', 'ti ti-download', row)
                        }
                      >
                        <i className="ti ti-download" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Print Result"
                        aria-label="Print Result"
                        onClick={() => quickAction('print', 'Print Result', 'ti ti-printer', row)}
                      >
                        <i className="ti ti-printer" />
                      </Link>
                      <div className="dropdown">
                        <ActionLink
                          className="dt-ib"
                          title="More"
                          ariaLabel="More actions"
                          ariaExpanded={openMenu === row.id}
                          onClick={() => onOpenMenu(openMenu === row.id ? null : row.id)}
                        >
                          <i className="ti ti-dots-vertical" />
                        </ActionLink>
                        <div className={`dropdown-menu dropdown-menu-end${openMenu === row.id ? ' show' : ''}`}>
                          {rowMenuItems.map((item) => (
                            <Fragment key={item.id}>
                              {item.divider ? <hr className="dropdown-divider" /> : null}
                              {item.route ? (
                                <Link className="dropdown-item" to={routes[item.route]}>
                                  <i className={item.icon} />
                                  {item.label}
                                </Link>
                              ) : (
                                <Link
                                  className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
                                  to="#"
                                  onClick={() => {
                                    onOpenMenu(null);
                                    onMenuAction(item, row);
                                  }}
                                >
                                  <i className={item.icon} />
                                  {item.label}
                                </Link>
                              )}
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr className={`dt-detail${isOpen ? ' open' : ''}`}>
                  <td colSpan={colspan}>
                    <div className="dt-detail-inner">
                      <div className="row g-4">
                        <div className="col-xl-3 col-md-6">
                          <h4 className="details-heading fs-15 fw-medium">
                            <i className="ti ti-list-numbers" />
                            Subject-wise Marks
                          </h4>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">{row.subject}</span>
                              <span className="fw-medium">
                                {row.obtained}/{row.max}
                              </span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Theory</span>
                              <span className="fw-medium">
                                {row.detail.theoryObtained}/{row.detail.theoryMax}
                              </span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Practical</span>
                              <span className="fw-medium">
                                {row.detail.practicalObtained}/{row.detail.practicalMax}
                              </span>
                            </li>
                          </ul>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-clipboard-check" />
                            Internal Assessment
                          </h5>
                          <p className="fs-12 text-muted mb-0">{internalCopy(row)}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-flask" />
                            Practical Marks
                          </h6>
                          <p className="fs-12 text-muted mb-3">{practicalCopy(row)}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-calendar-check" />
                            Attendance Summary
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.detail.attendance}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-message-dots" />
                            Teacher Remarks
                          </h6>
                          <p className="fs-12 text-muted mb-3">{teacherRemarkCopy(row)}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-users" />
                            Parent Remarks
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.detail.parentRemark}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-history" />
                            Result History
                          </h6>
                          <p className="fs-12 text-muted mb-2">{historyCopy(row)}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-paperclip" />
                            Attachments
                          </h6>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            <span className="badge badge-soft-primary">
                              <i className="ti ti-file-type-pdf me-1" />
                              Marksheet.pdf
                            </span>
                            <span className="badge badge-soft-info">
                              <i className="ti ti-file-text me-1" />
                              Answersheet.pdf
                            </span>
                          </div>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onView(row)}
                            >
                              <i className="ti ti-eye me-1" />
                              View
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() => onEdit(row)}
                            >
                              <i className="ti ti-edit me-1" />
                              Edit
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable;
