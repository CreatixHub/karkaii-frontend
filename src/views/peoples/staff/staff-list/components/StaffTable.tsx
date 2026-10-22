import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, SortKey, StaffListModalId, StaffRow } from '../data/staffList.data';
import { detailDocumentBadges, tableHeaders } from '../data/staffList.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface StaffTableProps {
  rows: StaffRow[];
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
  /** Opens one of the nine dialogs for a row. */
  onModal: (modal: StaffListModalId, row: StaffRow) => void;
  /** Fires a `data-cls-action` that only raises a toast. */
  onAction: (action: string, row: StaffRow) => void;
}

const StaffTable = ({
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
  onModal,
  onAction,
}: StaffTableProps) => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // The template's select-all shows the indeterminate dash on a partial selection.
  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = someChecked && !allChecked;
  }, [someChecked, allChecked]);

  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) onOpenMenu(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu, onOpenMenu]);

  const visibleHeaders = tableHeaders.filter((header) => columns[header.id]);
  // Expand toggle + checkbox + visible columns + actions.
  const detailColSpan = visibleHeaders.length + 3;

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">Staff list with contact and work details</caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                ref={selectAllRef}
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all staff"
                checked={allChecked}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            {visibleHeaders.map((header) => (
              <th
                key={header.id}
                className={`dt-sortable${sort === header.sort ? ' is-sorted' : ''}`}
                aria-sort={sort === header.sort ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                onClick={() => (header.sort ? onSort(header.sort) : undefined)}
              >
                {header.label} <i className="ti ti-arrows-sort dt-sort-ic" />
                {header.resize ? <span className="dt-resize" /> : null}
              </th>
            ))}
            <th className="text-end card-actions-row">Actions</th>
          </tr>
        </thead>
        <tbody id="clsBody">
          {rows.map((row) => {
            const isExpanded = expanded.includes(row.id);

            return [
              <tr className={`dt-row${isExpanded ? ' expanded' : ''}`} key={row.id}>
                <td>
                  <button
                    type="button"
                    className="dt-expand"
                    aria-label={`Expand ${row.name}`}
                    aria-expanded={isExpanded}
                    onClick={() => onToggleExpand(row.id)}
                  >
                    <i className={`ti ti-chevron-${isExpanded ? 'down' : 'right'}`} />
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

                {columns.staff ? (
                  <td>
                    <div className="dt-user">
                      <Link to="#" className="dt-avatar avatar" onClick={() => onModal('profile', row)}>
                        <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
                      </Link>
                      <div>
                        <Link to="#" className="dt-name" onClick={() => onModal('profile', row)}>
                          {row.name}
                        </Link>
                        <div className="dt-sub">
                          <span className="link-primary dt-code">{row.id}</span>
                        </div>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          <span className={`badge ${row.departmentClass}`}>
                            <i className="ti ti-building me-1" />
                            <span className="dt-dept">{row.department}</span>
                          </span>
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-briefcase me-1" />
                            <span className="dt-desig">{row.designation}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                ) : null}

                {columns.contact ? (
                  <td>
                    <ul className="list-unstyled mb-0 fs-12">
                      <li className="py-1 text-muted">
                        <i className="ti ti-mail me-1" />
                        <span className="dt-email">{row.email}</span>
                      </li>
                      <li className="py-1 text-muted">
                        <i className="ti ti-phone me-1" />
                        <span className="dt-phone">{row.phone}</span>
                      </li>
                      <li className="py-1">
                        <span className="badge badge-soft-info">
                          <i className="ti ti-map-pin me-1" />
                          <span className="dt-branch">{row.branch}</span>
                        </span>{' '}
                        <span className={`badge ${row.employmentClass}`}>
                          <i className="ti ti-id-badge me-1" />
                          <span className="dt-emp">{row.employmentType}</span>
                        </span>
                      </li>
                      <li className="py-1 text-muted">
                        <i className="ti ti-calendar-event me-1" />
                        Joined <span className="fw-medium text-dark dt-joined">{row.joined}</span>
                      </li>
                    </ul>
                  </td>
                ) : null}

                {columns.work ? (
                  <td>
                    <ul className="list-unstyled mb-0 fs-12">
                      <li className="py-1 text-muted">
                        <i className="ti ti-user-cog me-1" />
                        Reports to <span className="fw-medium text-dark">{row.reportsTo}</span>
                      </li>
                      <li className="py-1">
                        <span className="badge badge-soft-secondary">
                          <i className="ti ti-school me-1" />
                          {row.qualification}
                        </span>{' '}
                        <span className="badge badge-soft-info">
                          <i className="ti ti-briefcase me-1" />
                          <span className="dt-exp-val">{row.experience}</span> yrs
                        </span>
                      </li>
                      <li className="py-1">
                        <span className={`badge ${row.attendanceClass}`}>
                          <i className="ti ti-calendar-check me-1" />
                          {row.attendance}
                        </span>
                      </li>
                      <li className="py-1 text-muted">
                        <i className="ti ti-clock me-1" />
                        Last login <span className="fw-medium text-dark">{row.lastLogin}</span>
                      </li>
                    </ul>
                  </td>
                ) : null}

                {columns.status ? (
                  <td>
                    <span className={`dt-pill ${row.statusClass}`}>
                      {row.statusIcon ? <i className={row.statusIcon} /> : <span className="dt-pill-dot" />}
                      {row.status}
                    </span>
                  </td>
                ) : null}

                <td>
                  <div className="dt-actions">
                    <Link
                      to="#"
                      className="dt-ib"
                      title="View Profile"
                      aria-label="View Profile"
                      onClick={() => onModal('profile', row)}
                    >
                      <i className="ti ti-eye" />
                    </Link>
                    <Link
                      to="#"
                      className="dt-ib"
                      title="Edit Staff"
                      aria-label="Edit Staff"
                      onClick={() => onModal('edit', row)}
                    >
                      <i className="ti ti-edit" />
                    </Link>
                    <Link
                      to="#"
                      className="dt-ib"
                      title="Attendance History"
                      aria-label="Attendance History"
                      onClick={() => onModal('attendance', row)}
                    >
                      <i className="ti ti-calendar-stats" />
                    </Link>
                    <Link
                      to="#"
                      className="dt-ib"
                      title="Assign Department"
                      aria-label="Assign Department"
                      onClick={() => onModal('assign', row)}
                    >
                      <i className="ti ti-building-community" />
                    </Link>
                    <Link
                      to="#"
                      className="dt-ib"
                      title="Documents"
                      aria-label="Documents"
                      onClick={() => onModal('documents', row)}
                    >
                      <i className="ti ti-files" />
                    </Link>
                    <Link
                      to="#"
                      className="dt-ib"
                      title="Print Profile"
                      aria-label="Print Profile"
                      onClick={() => onAction('print_profile', row)}
                    >
                      <i className="ti ti-printer" />
                    </Link>

                    <div className="dropdown" ref={openMenu === row.id ? menuRef : undefined}>
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
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onModal('profile', row);
                          }}
                        >
                          <i className="ti ti-eye" />
                          View Profile
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onModal('edit', row);
                          }}
                        >
                          <i className="ti ti-edit" />
                          Edit Staff
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onModal('attendance', row);
                          }}
                        >
                          <i className="ti ti-calendar-stats" />
                          Attendance History
                        </Link>
                        <Link className="dropdown-item" to={routes.staffPayroll} onClick={() => onOpenMenu(null)}>
                          <i className="ti ti-cash" />
                          Payroll Details
                        </Link>
                        <Link className="dropdown-item" to={routes.staffLeave} onClick={() => onOpenMenu(null)}>
                          <i className="ti ti-calendar-off" />
                          Leave History
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onModal('performance', row);
                          }}
                        >
                          <i className="ti ti-award" />
                          Performance Review
                        </Link>
                        <hr className="dropdown-divider" />
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onAction('transfer', row);
                            onModal('assign', row);
                          }}
                        >
                          <i className="ti ti-transfer" />
                          Transfer Department
                        </Link>
                        <Link
                          className="dropdown-item text-warning"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onAction('reset_cred', row);
                          }}
                        >
                          <i className="ti ti-key" />
                          Reset Credentials
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onAction('export_profile', row);
                          }}
                        >
                          <i className="ti ti-file-export" />
                          Export Profile
                        </Link>
                        <Link
                          className="dropdown-item"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onAction('archive', row);
                          }}
                        >
                          <i className="ti ti-archive" />
                          Archive
                        </Link>
                        <Link
                          className="dropdown-item text-danger"
                          to="#"
                          onClick={() => {
                            onOpenMenu(null);
                            onModal('delete', row);
                          }}
                        >
                          <i className="ti ti-trash-x" />
                          Delete
                        </Link>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>,

              // The template ships every detail row and lets `.open` reveal it —
              // `.dt-detail-inner` is `display:none` until then, so the class matters.
              <tr className={`dt-detail${isExpanded ? ' open' : ''}`} key={`${row.id}-detail`}>
                  <td colSpan={detailColSpan}>
                    <div className="dt-detail-inner">
                      <div className="row g-4">
                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-user" />
                            Employee Profile
                          </h6>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="avatar avatar-md">
                              <ImageWithBasePath
                                src={row.avatar}
                                className="rounded-circle flex-shrink-0"
                                alt={row.name}
                              />
                            </span>
                            <div>
                              <span className="fw-medium d-block fs-13">{row.name}</span>
                              <span className="fs-12 text-muted">
                                {row.id} · {row.designation}
                              </span>
                            </div>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-building" />
                            Employment Details
                          </h6>
                          <ul className="list-unstyled fs-12 mb-0">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Department</span>
                              <span className="fw-medium">{row.department}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Type</span>
                              <span className="fw-medium">{row.employmentType}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Reports to</span>
                              <span className="fw-medium">{row.reportsTo}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-urgent" />
                            Emergency Contact
                          </h6>
                          <ul className="list-unstyled fs-12 text-muted mb-3">
                            <li className="py-1">
                              <i className="ti ti-user me-1" />
                              {row.emergencyContact}
                            </li>
                            <li className="py-1">
                              <i className="ti ti-phone me-1" />
                              {row.emergencyPhone}
                            </li>
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-school" />
                            Qualifications
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            <span className="badge badge-soft-secondary">{row.qualification}</span>
                            <span className="badge badge-soft-info">{row.experience} yrs experience</span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-files" />
                            Documents
                          </h6>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {detailDocumentBadges.map((badge) => (
                              <span className={`badge ${badge.accent}`} key={badge.label}>
                                {badge.label}
                              </span>
                            ))}
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-calendar-check" />
                            Attendance Summary
                          </h6>
                          <ul className="list-unstyled fs-12 mb-0">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Today</span>
                              <span className="fw-medium">{row.attendance}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">This Month</span>
                              <span className="fw-medium">{row.attendanceMonth}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-award" />
                            Performance Notes
                          </h6>
                          <p className="fs-12 text-muted mb-3">{row.performanceNote}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-notes" />
                            Remarks
                          </h6>
                          <p className="fs-12 text-muted mb-2">{row.remarks}</p>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onModal('documents', row)}
                            >
                              <i className="ti ti-files me-1" />
                              Docs
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() => onModal('profile', row)}
                            >
                              <i className="ti ti-eye me-1" />
                              Profile
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

export default StaffTable;
