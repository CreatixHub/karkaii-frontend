import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, GradeRow, RowMenuItem, SortKey } from '../data/gradeSetup.data';
import { ActionLink } from '@components/workspace';
import {
  academicNotes,
  evaluationMethod,
  gradeDescription,
  markSpan,
  meterWidth,
  passingCriteria,
  percentLabel,
  rowMenuItems,
  statusRemarks,
  tableHeaders,
} from '../data/gradeSetup.data';

const routes = all_routes as Record<string, string>;

export interface GradesTableProps {
  rows: GradeRow[];
  columns: Record<ColumnId, boolean>;
  sort: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey, label: string) => void;
  selected: string[];
  onToggleSelect: (id: string) => void;
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  expanded: string[];
  onToggleExpand: (id: string) => void;
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onView: (row: GradeRow) => void;
  onEdit: (row: GradeRow) => void;
  onMenuAction: (item: RowMenuItem, row: GradeRow) => void;
}

const GradesTable = ({
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
}: GradesTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  /** The row menu's Preview / Result Settings entries reuse this shape. */
  const fire = (id: string, label: string, row: GradeRow) =>
    onMenuAction({ id, label, icon: '' }, row);

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Grade list with mark range, academic details and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all grades"
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
                  className={header.sort ? `dt-sortable${sortClass(header.sort)}` : undefined}
                  onClick={header.sort ? () => onSort(header.sort as SortKey, header.label) : undefined}
                >
                  {header.label}
                  {header.sort ? <i className="ti ti-arrows-sort dt-sort-ic" /> : null}
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
            const span = markSpan(row);
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

                  {columns.grade ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-${row.tone}-transparent text-${row.tone} fw-bold`}
                          onClick={() => onView(row)}
                        >
                          <span className="dt-letter">{row.letter}</span>
                        </Link>
                        <div>
                          <Link to="#" className="dt-name" onClick={() => onView(row)}>
                            {row.name}
                          </Link>
                          <div className="dt-sub">
                            <span className="text-muted">Grade Point</span>{' '}
                            <span className="fw-semibold text-dark dt-point">{row.point}</span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className={`badge badge-soft-${row.tone}`}>
                              <i className="ti ti-circle-filled me-1 fs-8" />
                              Grade {row.letter}
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-scale me-1" />
                              {row.scale}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : null}

                  {columns.range ? (
                    <td>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-semibold fs-13">
                          <span className="dt-min-val">{row.min}</span> –{' '}
                          <span className="dt-max-val">{row.max}</span>
                        </span>
                        <span className="fs-12 text-muted">{percentLabel(row)}</span>
                      </div>
                      <div className={`meter meter-${row.meterTone}`}>
                        <span style={{ width: meterWidth(row) }} />
                      </div>
                      <div className="d-flex flex-wrap gap-1 mt-2">
                        <span className="badge badge-soft-primary">
                          <i className="ti ti-arrow-down me-1" />
                          Min {row.min}
                        </span>
                        <span className="badge badge-soft-success">
                          <i className="ti ti-arrow-up me-1" />
                          Max {row.max}
                        </span>
                        <span className="badge badge-soft-secondary">
                          <i className="ti ti-ruler-2 me-1" />
                          {span} pts
                        </span>
                      </div>
                    </td>
                  ) : null}

                  {columns.details ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1">
                          <span className={`badge badge-soft-${row.tone} dt-restype`}>
                            <i className="ti ti-clipboard-check me-1" />
                            {row.resultType}
                          </span>
                        </li>
                        <li className="py-1 text-muted">{row.remark}</li>
                        <li className="d-flex align-items-center gap-1 py-1">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={row.author.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={row.author.name}
                            />
                          </span>
                          <span>
                            <span className="text-muted">By</span>{' '}
                            <span className="fw-medium text-dark dt-createdby">{row.author.name}</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          Updated <span className="dt-updated fw-medium text-dark">{row.updated}</span>
                        </li>
                      </ul>
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
                        title="View Grade"
                        aria-label="View Grade"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                        <i className="ti ti-edit" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Preview Grade Scale"
                        aria-label="Preview Grade Scale"
                        onClick={() => fire('preview', 'Preview Grade Scale', row)}
                      >
                        <i className="ti ti-eye-search" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Result Settings"
                        aria-label="Result Settings"
                        onClick={() => fire('result_settings', 'Result Settings', row)}
                      >
                        <i className="ti ti-settings" />
                      </Link>
                      <Link
                        to={routes.examResult}
                        className="dt-ib"
                        title="Reports"
                        aria-label="Reports"
                        onClick={() => fire('reports', 'Reports', row)}
                      >
                        <i className="ti ti-report-analytics" />
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
                                <Link
                                  className="dropdown-item"
                                  to={routes[item.route]}
                                  onClick={() => {
                                    onOpenMenu(null);
                                    onMenuAction(item, row);
                                  }}
                                >
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
                            <i className="ti ti-file-description" />
                            Grade Description
                          </h4>
                          <p className="fs-12 text-muted mb-3">{gradeDescription(row)}</p>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-clipboard-check" />
                            Evaluation Method
                          </h5>
                          <p className="fs-12 text-muted mb-0">{evaluationMethod(row)}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-target-arrow" />
                            Passing Criteria
                          </h6>
                          <p className="fs-12 text-muted mb-3">{passingCriteria(row)}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-ruler-2" />
                            Mark Range
                          </h6>
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="fs-12 text-muted">
                              {row.min} – {row.max} marks
                            </span>
                            <span className="fs-12 fw-medium">{span} pt span</span>
                          </div>
                          <div className={`meter meter-${row.meterTone}`}>
                            <span style={{ width: meterWidth(row) }} />
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-notes" />
                            Remarks
                          </h6>
                          <p className="fs-12 text-muted mb-3">{statusRemarks[row.status]}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-file-certificate" />
                            Linked Exams
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            {row.linkedExams.map((exam) => (
                              <span className="badge badge-soft-primary" key={exam}>
                                {exam}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-writing" />
                            Academic Notes
                          </h6>
                          <p className="fs-12 text-muted mb-2">{academicNotes(row)}</p>
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

export default GradesTable;
