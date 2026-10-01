import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, RowMenuItem, ScheduleRow, SortKey } from '../data/scheduleExam.data';
import { ActionLink } from '@components/workspace';
import {
  PAPER_BADGES,
  attachments,
  examInstructions,
  hallDetails,
  meterTone,
  passPercent,
  rowMenuItems,
  tableHeaders,
} from '../data/scheduleExam.data';

const routes = all_routes as Record<string, string>;

export interface ScheduleTableProps {
  rows: ScheduleRow[];
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
  onView: (row: ScheduleRow) => void;
  onEdit: (row: ScheduleRow) => void;
  onMenuAction: (item: RowMenuItem, row: ScheduleRow) => void;
}

const ScheduleTable = ({
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
}: ScheduleTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey) => {
    if (sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  /** The quick-action icons repeated on every row, in the template's order. */
  const menuItem = (id: string): RowMenuItem =>
    rowMenuItems.find((item) => item.id === id) ?? { id, label: id, icon: '' };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Exam schedule with schedule details, management and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all schedules"
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
            const paper = PAPER_BADGES[row.paperStatus];
            const percent = passPercent(row);

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

                  {columns.schedule ? (
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
                            <span className="dt-subject">{row.subject}</span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className={`badge badge-soft-${row.tone} dt-type`}>
                              <i className="ti ti-file-certificate me-1" />
                              {row.type}
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

                  {columns.details ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1">
                          <span className={`badge badge-soft-${row.tone}`}>
                            <i className="ti ti-school me-1" />
                            Class <span className="dt-acls">{row.className}</span>-{row.section}
                          </span>
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
                          <i className="ti ti-building me-1" />
                          <span className="dt-hall fw-medium text-dark">{row.hall}</span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.mgmt ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="d-flex align-items-center gap-1 py-1">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={row.invigilator.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={row.invigilator.name}
                            />
                          </span>
                          <span>
                            <span className="text-muted">Invigilator</span>{' '}
                            <span className="fw-medium text-dark dt-teacher">{row.invigilator.name}</span>
                          </span>
                        </li>
                        <li className="d-flex align-items-center gap-1 py-1">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={row.coordinator.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={row.coordinator.name}
                            />
                          </span>
                          <span>
                            <span className="text-muted">Coordinator</span>{' '}
                            <Link to={routes.teacherDetails} className="fw-medium text-dark">
                              {row.coordinator.name}
                            </Link>
                          </span>
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
                          Registered <span className="fw-semibold text-dark dt-stu-val">{row.students}</span>{' '}
                          students
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
                        title="View Schedule"
                        aria-label="View Schedule"
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
                        title="Hall Allocation"
                        aria-label="Hall Allocation"
                        onClick={() => onMenuAction(menuItem('hall_allocation'), row)}
                      >
                        <i className="ti ti-building" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Assign Invigilator"
                        aria-label="Assign Invigilator"
                        onClick={() => onMenuAction(menuItem('invigilators'), row)}
                      >
                        <i className="ti ti-shield-check" />
                      </Link>
                      <Link
                        to={routes.examResult}
                        className="dt-ib"
                        title="Results"
                        aria-label="Results"
                        onClick={() => onMenuAction(menuItem('results'), row)}
                      >
                        <i className="ti ti-chart-bar" />
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
                        <div className="col-xl-3 col-md-6">
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
                            <i className="ti ti-building-community" />
                            Hall Details
                          </h5>
                          <p className="fs-12 text-muted mb-0">{hallDetails(row)}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-shield-check" />
                            Invigilator Information
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center gap-2 py-1">
                              <span className="avatar avatar-xs">
                                <ImageWithBasePath
                                  src={row.invigilator.avatar}
                                  className="rounded-circle flex-shrink-0"
                                  alt={row.invigilator.name}
                                />
                              </span>
                              <span>
                                <span className="fw-medium text-dark">{row.invigilator.name}</span>{' '}
                                <span className="text-muted">· Lead invigilator</span>
                              </span>
                            </li>
                            <li className="d-flex align-items-center gap-2 py-1">
                              <span className="avatar avatar-xs">
                                <ImageWithBasePath
                                  src={row.coordinator.avatar}
                                  className="rounded-circle flex-shrink-0"
                                  alt={row.coordinator.name}
                                />
                              </span>
                              <span>
                                <span className="fw-medium text-dark">{row.coordinator.name}</span>{' '}
                                <span className="text-muted">· Coordinator</span>
                              </span>
                            </li>
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-file-text" />
                            Question Paper Status
                          </h6>
                          <div>
                            <span className={`badge ${paper.badge}`}>
                              <i className={`${paper.icon} me-1`} />
                              {row.paperStatus}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-users" />
                            Student Count
                          </h6>
                          <p className="fs-12 text-muted mb-3">
                            <span className="fw-semibold text-dark">{row.students}</span> students registered
                            for this exam.
                          </p>
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
                          <div className={`meter ${meterTone(row)}`}>
                            <span style={{ width: `${percent}%` }} />
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
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
                          <p className="fs-12 text-muted mb-2">{row.remarks}</p>
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
                              onClick={() => onMenuAction(menuItem('print'), row)}
                            >
                              <i className="ti ti-printer me-1" />
                              Print
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

export default ScheduleTable;
