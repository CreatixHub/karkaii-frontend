import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, ExamRow, RowMenuItem, SortKey } from '../data/exams.data';
import { ActionLink } from '@components/workspace';
import {
  attachments,
  examInstructions,
  paperBadge,
  passPercent,
  priorityBadge,
  roomAllocation,
  rowMenuItems,
  rowQuickActions,
  syllabusCoverage,
  tableHeaders,
} from '../data/exams.data';

const routes = all_routes as Record<string, string>;

export interface ExamsTableProps {
  rows: ExamRow[];
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
  onView: (row: ExamRow) => void;
  onMenuAction: (item: RowMenuItem, row: ExamRow) => void;
}

const ExamsTable = ({
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
  onMenuAction,
}: ExamsTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey) => {
    if (sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Exam list with schedule, coordinator, marks and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all exams"
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
            const paper = paperBadge[row.paper];
            const percent = passPercent(row);

            return (
              <Fragment key={row.id}>
                <tr
                  className={`dt-row${isOpen ? ' expanded' : ''}${
                    selected.includes(row.id) ? ' dt-selected' : ''
                  }`}
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

                  {columns.exam ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-${row.tone}`}
                          onClick={() => onView(row)}
                        >
                          <i className={`${row.icon} fs-20`} />
                        </Link>
                        <div>
                          <Link to="#" className="dt-name" onClick={() => onView(row)}>
                            {row.name}
                          </Link>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">{row.id}</span>
                            <span className="dt-dot">·</span>
                            <span className="dt-type">{row.type}</span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className={`badge ${priorityBadge[row.priority]}`}>
                              <i className="ti ti-flag-3 me-1" />
                              {row.priority}
                            </span>
                            <span className="badge badge-soft-secondary">
                              <i className="ti ti-calendar me-1" />
                              {row.year}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : null}

                  {columns.schedule ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1">
                          <span className={`badge badge-soft-${row.tone}`}>
                            <i className="ti ti-school me-1" />
                            Class <span className="dt-acls">{row.className}</span>-{row.section}
                          </span>{' '}
                          <span className="fw-medium text-dark dt-subject">{row.subject}</span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          <span className="dt-date fw-medium text-dark">{row.date}</span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock me-1" />
                          {row.startTime} – {row.endTime}{' '}
                          <span className="badge badge-soft-secondary ms-1">
                            <i className="ti ti-hourglass me-1" />
                            {row.duration}
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-door me-1" />
                          <span className="dt-room">{row.room}</span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.details ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="d-flex align-items-center gap-1 py-1">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={row.teacher.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={row.teacher.name}
                            />
                          </span>
                          <span>
                            <span className="text-muted">Coordinator</span>{' '}
                            <Link to={routes.teacherDetails} className="dt-teacher fw-medium text-dark">
                              {row.teacher.name}
                            </Link>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-shield-check me-1" />
                          Invigilator <span className="fw-medium text-dark">{row.invigilator}</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-primary">
                            <i className="ti ti-award me-1" />
                            Total <span className="dt-marks-val">{row.totalMarks}</span>
                          </span>{' '}
                          <span className="badge badge-soft-success">
                            <i className="ti ti-check me-1" />
                            Pass {row.passMarks}
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-users me-1" />
                          Registered{' '}
                          <span className="fw-semibold text-dark dt-stu-val">{row.students}</span> students
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
                      {rowQuickActions.map((item) =>
                        item.route ? (
                          <Link
                            key={item.id}
                            to={routes[item.route]}
                            className="dt-ib"
                            title={item.label}
                            aria-label={item.label}
                            onClick={() => onMenuAction(item, row)}
                          >
                            <i className={item.icon} />
                          </Link>
                        ) : (
                          <Link
                            key={item.id}
                            to="#"
                            className="dt-ib"
                            title={item.label}
                            aria-label={item.label}
                            onClick={() => onMenuAction(item, row)}
                          >
                            <i className={item.icon} />
                          </Link>
                        ),
                      )}
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
                        <div
                          className={`dropdown-menu dropdown-menu-end${openMenu === row.id ? ' show' : ''}`}
                        >
                          {rowMenuItems.map((item) => (
                            <Fragment key={item.id}>
                              {item.divider ? <hr className="dropdown-divider" /> : null}
                              <Link
                                className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
                                to={item.route ? routes[item.route] : '#'}
                                onClick={() => {
                                  onOpenMenu(null);
                                  onMenuAction(item, row);
                                }}
                              >
                                <i className={item.icon} />
                                {item.label}
                              </Link>
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
                        <div className="col-12 col-xl-3 col-md-6">
                          <h4 className="details-heading fs-15 fw-medium">
                            <i className="ti ti-list-check" />
                            Exam Instructions
                          </h4>
                          <ul className="fs-12 text-muted mb-3 ps-3">
                            {examInstructions(row).map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                          </ul>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-book" />
                            Syllabus Coverage
                          </h5>
                          <p className="fs-12 text-muted mb-0">{syllabusCoverage(row)}</p>
                        </div>

                        <div className="col-12 col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-file-text" />
                            Question Paper Status
                          </h6>
                          <div className="mb-3">
                            <span className={`badge ${paper.badge}`}>
                              <i className={`${paper.icon} me-1`} />
                              {row.paper}
                            </span>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-building" />
                            Room Allocation
                          </h6>
                          <p className="fs-12 text-muted mb-3">{roomAllocation(row)}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-users" />
                            Registered Students
                          </h6>
                          <p className="fs-12 text-muted mb-0">
                            <span className="fw-semibold text-dark">{row.students}</span> students registered
                            for this exam.
                          </p>
                        </div>

                        <div className="col-12 col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-shield-check" />
                            Invigilator Details
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center gap-2 py-1">
                              <span className="avatar avatar-xs">
                                <ImageWithBasePath
                                  src={row.teacher.avatar}
                                  className="rounded-circle flex-shrink-0"
                                  alt={row.teacher.name}
                                />
                              </span>
                              <span>
                                <span className="fw-medium text-dark">{row.teacher.name}</span>{' '}
                                <span className="text-muted">· Lead</span>
                              </span>
                            </li>
                            <li className="d-flex align-items-center gap-2 py-1">
                              <span className="avatar avatar-xs avatar-icon bg-primary-transparent text-primary">
                                <i className="ti ti-user" />
                              </span>
                              <span>
                                <span className="fw-medium text-dark">{row.invigilator}</span>{' '}
                                <span className="text-muted">· Support</span>
                              </span>
                            </li>
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-award" />
                            Marks Distribution
                          </h6>
                          <div className="d-flex align-items-center justify-content-between mb-1">
                            <span className="fs-12 text-muted">
                              Passing {row.passMarks} / {row.totalMarks}
                            </span>
                            <span className="fs-12 fw-medium">{percent}%</span>
                          </div>
                          <div className={`meter meter-${row.meterTone}`}>
                            <span style={{ width: `${percent}%` }} />
                          </div>
                        </div>

                        <div className="col-12 col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-paperclip" />
                            Attachments
                          </h6>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {attachments.map((file) => (
                              <span className={`badge ${file.badge}`} key={file.label}>
                                <i className={`${file.icon} me-1`} />
                                {file.label}
                              </span>
                            ))}
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-notes" />
                            Remarks
                          </h6>
                          <p className="fs-12 text-muted mb-2">{row.remark}</p>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onView(row)}
                            >
                              <i className="ti ti-eye me-1" />
                              View
                            </Link>
                            <Link to={routes.examResult} className="btn btn-primary btn-sm flex-fill">
                              <i className="ti ti-chart-bar me-1" />
                              Results
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

export default ExamsTable;
