import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { AttendanceRow, ColumnId, RowMenuItem, SortKey } from '../data/examAttendance.data';
import { ActionLink } from '@components/workspace';
import {
  attendanceHistory,
  checkinBadge,
  hallSummary,
  invigilatorNote,
  rowMenuItems,
  tableHeaders,
  verificationBadges,
} from '../data/examAttendance.data';

const routes = all_routes as Record<string, string>;

export interface AttendanceTableProps {
  rows: AttendanceRow[];
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
  onView: (row: AttendanceRow) => void;
  onEdit: (row: AttendanceRow) => void;
  onMenuAction: (item: RowMenuItem, row: AttendanceRow) => void;
}

const AttendanceTable = ({
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
}: AttendanceTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey) => {
    if (sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Exam attendance with student, exam details and attendance status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all records"
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
                  {header.label}
                  <i className="ti ti-arrows-sort dt-sort-ic" />
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
            const verified = verificationBadges[row.verification];
            const checkin = checkinBadge(row);

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
                          <span className="text-muted">
                            <i className="ti ti-calendar-event me-1" />
                            <span className="dt-date">{row.date}</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-building me-1" />
                          <span className="dt-hall">{row.hall}</span>{' '}
                          <span className="badge badge-soft-secondary ms-1">
                            <i className="ti ti-armchair me-1" />
                            Seat <span className="dt-seat">{row.seat}</span>
                          </span>
                        </li>
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
                            <span className="fw-medium text-dark dt-invig">{row.invigilator.name}</span>
                          </span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.attendance ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1">
                          <i className="ti ti-login-2 me-1 text-muted" />
                          Check-in <span className="fw-semibold text-dark dt-checkin">{row.checkin}</span>
                        </li>
                        <li className="py-1">
                          <span className={`badge ${verified.badge}`}>
                            <i className={`${verified.icon} me-1`} />
                            {verified.label}
                          </span>
                          {row.lateEntry ? (
                            <>
                              {' '}
                              <span className="badge badge-soft-warning">
                                <i className="ti ti-clock-exclamation me-1" />
                                Late Entry
                              </span>
                            </>
                          ) : null}
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-message-2 me-1" />
                          {row.remarks}
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
                        title="View Details"
                        aria-label="View Details"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Edit Attendance"
                        aria-label="Edit Attendance"
                        onClick={() => onEdit(row)}
                      >
                        <i className="ti ti-edit" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Verify Attendance"
                        aria-label="Verify Attendance"
                        onClick={() =>
                          onMenuAction({ id: 'verify', label: 'Verify Attendance', icon: '' }, row)
                        }
                      >
                        <i className="ti ti-discount" />
                      </Link>
                      <Link
                        to={routes.studentDetail}
                        className="dt-ib"
                        title="Student Profile"
                        aria-label="Student Profile"
                      >
                        <i className="ti ti-user" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Print Record"
                        aria-label="Print Record"
                        onClick={() => onMenuAction({ id: 'print', label: 'Print Record', icon: '' }, row)}
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
                            <i className="ti ti-user" />
                            Student Information
                          </h4>
                          <ul className="list-unstyled fs-12 text-muted mb-3">
                            <li className="py-1">
                              <span className="text-dark fw-medium">{row.name}</span> · {row.admissionNo}
                            </li>
                            <li className="py-1">
                              Class {row.className}-{row.section} · Roll {row.roll}
                            </li>
                          </ul>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-user-shield" />
                            Guardian Details
                          </h5>
                          <p className="fs-12 text-muted mb-0">
                            {row.guardian.name} · <i className="ti ti-phone me-1" />
                            {row.guardian.phone}
                          </p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-building" />
                            Exam Hall Details
                          </h6>
                          <p className="fs-12 text-muted mb-3">{hallSummary(row)}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-history" />
                            Attendance History
                          </h6>
                          <p className="fs-12 text-muted mb-0">{attendanceHistory}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-discount" />
                            Verification Details
                          </h6>
                          <div className="mb-3">
                            <span className={`badge ${verified.badge}`}>
                              <i className={`${verified.icon} me-1`} />
                              {verified.label}
                            </span>{' '}
                            <span className={`badge ${checkin.badge}`}>
                              <i className={`${checkin.icon} me-1`} />
                              {checkin.label}
                            </span>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-message-dots" />
                            Invigilator Notes
                          </h6>
                          <p className="fs-12 text-muted mb-0">{invigilatorNote(row)}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-paperclip" />
                            Attachments
                          </h6>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {row.attachments.map((file) => (
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

export default AttendanceTable;
