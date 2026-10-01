import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type {
  ColumnId,
  RowMenuItem,
  SortKey,
  StudentRow,
} from '../data/studentsList.data';
import { rowMenu, tableHeaders } from '../data/studentsList.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface StudentTableProps {
  rows: StudentRow[];
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
  onRowMenu: (row: StudentRow, item: RowMenuItem) => void;
  onMessage: (row: StudentRow) => void;
}

const StudentTable = ({
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
  onRowMenu,
  onMessage,
}: StudentTableProps) => {
  const visibleColumnCount = tableHeaders.filter((header) => columns[header.id]).length;
  // Expand toggle + select box + the visible data columns + the actions cell.
  const colSpan = visibleColumnCount + 3;

  const headerClass = (key: SortKey) => {
    if (sort !== key) return 'dt-sortable';
    return `dt-sortable ${sortAsc ? 'dt-sort-asc' : 'dt-sort-desc'}`;
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">
          Student list with status, class, section, gender and date of join
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all students"
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
                  className={headerClass(header.sort)}
                  onClick={() => onSort(header.sort)}
                >
                  {header.label} <i className="ti ti-arrows-sort dt-sort-ic" />
                  {header.resize ? <span className="dt-resize" /> : null}
                </th>
              ) : null,
            )}
            <th className="text-end card-actions-row">Actions</th>
          </tr>
        </thead>
        <tbody id="clsBody">
          {rows.map((row) => {
            const isOpen = expanded.includes(row.id);

            return [
              <tr className={`dt-row${isOpen ? ' expanded' : ''}`} key={row.id}>
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
                        <ImageWithBasePath src={row.avatar} alt={row.name} />
                      </Link>
                      <div>
                        <Link to={routes.studentDetail} className="dt-name">
                          {row.name}
                        </Link>
                        <div className="dt-sub">
                          <span className="link-primary">{row.admissionNo}</span>
                          <span className="dt-dot">•</span>
                          <span>{row.classText}</span>
                          <span className="dt-dot">•</span>
                          <span>{row.sectionText}</span>
                        </div>
                        {row.badges.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {row.badges.map((badge) => (
                              <span className={badge.className} key={badge.label}>
                                {badge.icon ? <i className={`${badge.icon} me-1`} /> : null}
                                {badge.label}
                              </span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                ) : null}
                {columns.status ? (
                  <td>
                    <span className={`dt-pill ${row.statusClass}`}>
                      <span className="dt-pill-dot" />
                      {row.status}
                    </span>
                  </td>
                ) : null}
                {columns.class ? <td>{row.level}</td> : null}
                {columns.section ? <td>{row.section}</td> : null}
                {columns.gender ? <td>{row.gender}</td> : null}
                {columns.join ? <td>{row.join}</td> : null}
                <td>
                  <div className="dt-actions">
                    <Link
                      to={routes.studentDetail}
                      className="dt-ib"
                      title="View Profile"
                      aria-label="View"
                    >
                      <i className="ti ti-eye" />
                    </Link>
                    <Link to={routes.editStudent} className="dt-ib" title="Edit" aria-label="Edit">
                      <i className="ti ti-edit" />
                    </Link>
                    <Link
                      to={routes.studentFees}
                      className="dt-ib success"
                      title="Collect Fees"
                      aria-label="Fees"
                    >
                      <i className="ti ti-cash" />
                    </Link>
                    <ActionLink
                      className="dt-ib"
                      title="Message Parent"
                      ariaLabel="Message"
                      onClick={() => onMessage(row)}
                    >
                      <i className="ti ti-message" />
                    </ActionLink>
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
                        className={`dropdown-menu dropdown-menu-end${
                          openMenu === row.id ? ' show' : ''
                        }`}
                      >
                        {rowMenu.map((item) => (
                          <Fragment key={item.label}>
                            {item.dividerBefore ? <hr className="dropdown-divider" /> : null}
                            {item.to ? (
                              <Link className="dropdown-item" to={item.to}>
                                <i className={item.icon} />
                                {item.label}
                              </Link>
                            ) : (
                              <button
                                type="button"
                                className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
                                onClick={() => onRowMenu(row, item)}
                              >
                                <i className={item.icon} />
                                {item.label}
                              </button>
                            )}
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>,
              <tr className={`dt-detail${isOpen ? ' open' : ''}`} key={`${row.id}-detail`}>
                <td colSpan={colSpan}>
                  <div className="dt-detail-inner">
                    <div className="row g-4">
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-users" />
                          Parent / Guardian
                        </h6>
                        <div className="details-line">
                          <span className="details-line-icon accent-primary">
                            <i className="ti ti-user" />
                          </span>
                          <span>
                            <b>{row.detail.guardian}</b>
                            <em>{row.detail.guardianRole}</em>
                          </span>
                          <button
                            type="button"
                            className="compact-icon-button"
                            aria-label="Message parent"
                            onClick={() => onMessage(row)}
                          >
                            <i className="ti ti-message" />
                          </button>
                        </div>
                        <p className="fs-12 text-muted mb-1">
                          <i className="ti ti-phone me-1" />
                          {row.detail.phone}
                        </p>
                        <p className="fs-12 text-muted mb-0">
                          <i className="ti ti-mail me-1" />
                          {row.detail.email}
                        </p>
                        <h6 className="details-heading mt-3">
                          <i className="ti ti-map-pin" />
                          Address
                        </h6>
                        <p className="fs-12 text-muted mb-0">{row.detail.address}</p>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-id" />
                          Personal Details
                        </h6>
                        <ul className="list-unstyled fs-12 mb-0">
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Roll No</span>
                            <span className="fw-medium">{row.detail.rollNo}</span>
                          </li>
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Date of Birth</span>
                            <span className="fw-medium">{row.detail.dateOfBirth}</span>
                          </li>
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Gender</span>
                            <span className="fw-medium">{row.detail.gender}</span>
                          </li>
                          <li className="d-flex align-items-center justify-content-between py-1">
                            <span className="text-muted">Blood Group</span>
                            <span className="badge badge-soft-danger">{row.detail.bloodGroup}</span>
                          </li>
                        </ul>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-award" />
                          Recent Exam
                        </h6>
                        <p className="fs-13 fw-medium mb-2">{row.detail.exam}</p>
                        <h6 className="details-heading">
                          <i className="ti ti-calendar-check" />
                          Attendance
                        </h6>
                        <div className={`meter ${row.detail.meterClass}`}>
                          <span style={{ width: `${row.detail.attendance}%` }} />
                        </div>
                        <p className="fs-12 text-muted mt-1 mb-2">{row.detail.attendanceText}</p>
                        <h6 className="details-heading">
                          <i className="ti ti-checkup-list" />
                          Facilities
                        </h6>
                        <div className="d-flex flex-wrap gap-1">
                          {row.detail.facilities.map((badge) => (
                            <span className={badge.className} key={badge.label}>
                              {badge.icon ? <i className={`${badge.icon} me-1`} /> : null}
                              {badge.label}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="details-heading">
                          <i className="ti ti-report-money" />
                          Fee Status
                        </h6>
                        <div className="d-flex flex-wrap gap-1 mb-1">
                          <span className={row.detail.fee.className}>{row.detail.fee.label}</span>
                        </div>
                        <p className="fs-12 text-muted mb-2">{row.detail.transportNote}</p>
                        <h6 className="details-heading">
                          <i className="ti ti-notes" />
                          Quick Notes
                        </h6>
                        <p className="fs-12 text-muted mb-2">{row.detail.notes}</p>
                        <div className="d-flex gap-2">
                          <Link
                            to={routes.studentDetail}
                            className="btn btn-outline-light bg-white btn-sm flex-fill"
                          >
                            <i className="ti ti-user me-1" />
                            Profile
                          </Link>
                          <Link to={routes.studentFees} className="btn btn-primary btn-sm flex-fill">
                            <i className="ti ti-cash me-1" />
                            Fees
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
