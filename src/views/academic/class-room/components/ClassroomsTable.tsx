import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ClassroomRow, ColumnId, RowMenuItem, SortKey } from '../data/classrooms.data';
import { rowMenuItems, tableHeaders } from '../data/classrooms.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes as Record<string, string>;

export interface ClassroomsTableProps {
  rows: ClassroomRow[];
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
  onView: (row: ClassroomRow) => void;
  onEdit: (row: ClassroomRow) => void;
  onMenuAction: (item: RowMenuItem, row: ClassroomRow) => void;
}

const ClassroomsTable = ({
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
}: ClassroomsTableProps) => {
  // chevron + checkbox + visible columns + actions
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">Classroom list with details, facilities and status</caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all classrooms"
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
                  onClick={header.sort ? () => onSort(header.sort as SortKey) : undefined}
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

                  {columns.room ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className="dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-primary"
                          onClick={() => onView(row)}
                        >
                          <i className="ti ti-door fs-20" />
                        </Link>
                        <div>
                          <Link to="#" className="dt-name" onClick={() => onView(row)}>
                            {row.name}
                          </Link>
                          <div className="dt-sub">
                            <span className="link-primary">{row.id}</span>
                            <span className="dt-dot">·</span>Room <span className="dt-roomno">{row.roomNo}</span>
                          </div>
                          <div className="fs-12 text-muted">
                            <i className="ti ti-building me-1" />
                            Building <span className="dt-building">{row.building}</span>
                            <span className="dt-dot mx-1">·</span>Floor <span className="dt-floor">{row.floor}</span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className="badge badge-soft-primary dt-type">{row.type}</span>
                            <span className="badge badge-soft-info d-inline-flex align-items-center gap-1">
                              <i className="ti ti-users" />
                              <span className="dt-cap-val">{row.capacity}</span> seats
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : null}

                  {columns.details ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="d-flex align-items-center justify-content-between py-1">
                          <span className="text-muted">Assigned Class</span>
                          <span className="fw-medium text-dark dt-acls">{row.assignedClass}</span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between py-1">
                          <span className="text-muted">Class Teacher</span>
                          {row.teacher ? (
                            <Link
                              to={routes.teacherDetails}
                              className="d-inline-flex align-items-center gap-1"
                            >
                              <span className="avatar avatar-xs">
                                <ImageWithBasePath
                                  src={row.teacher.avatar}
                                  className="rounded-circle flex-shrink-0"
                                  alt={row.teacher.name}
                                />
                              </span>
                              <span className="dt-teacher fw-medium text-dark">{row.teacher.name}</span>
                            </Link>
                          ) : (
                            <span className="dt-teacher fw-medium text-dark">—</span>
                          )}
                        </li>
                        <li className="d-flex align-items-center justify-content-between py-1">
                          <span className="text-muted">Students</span>
                          <span className="fw-medium">
                            <span className="dt-stu-val">{row.students}</span> / {row.capacity}
                          </span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between py-1">
                          <span className="text-muted">Available Seats</span>
                          <span className="fw-medium text-success">{row.availableSeats}</span>
                        </li>
                        <li className="d-flex align-items-center justify-content-between py-1">
                          <span className="text-muted">Academic Year</span>
                          <span className="fw-medium">{row.year}</span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.facilities ? (
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: 220 }}>
                        {row.facilities.map((facility) => (
                          <span
                            className="badge badge-soft-secondary d-inline-flex align-items-center gap-1"
                            key={facility.label}
                          >
                            <i className={facility.icon} />
                            {facility.label}
                          </span>
                        ))}
                      </div>
                      <span className="fs-12 text-muted d-inline-flex align-items-center gap-1 mt-1">
                        <i className="ti ti-checklist" />
                        <span className="dt-fac-val">{row.facilities.length}</span> facilities
                      </span>
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
                        title="View Classroom"
                        aria-label="View Classroom"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                        <i className="ti ti-edit" />
                      </Link>
                      <Link to={routes.classTimetable} className="dt-ib" title="Timetable" aria-label="Timetable">
                        <i className="ti ti-table" />
                      </Link>
                      <Link to={routes.studentList} className="dt-ib" title="Students" aria-label="Students">
                        <i className="ti ti-users" />
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
                          <div className="avatar avatar-xxl bg-light text-primary rounded d-flex align-items-center justify-content-center mb-3">
                            <i className="ti ti-building-community fs-24" />
                          </div>
                          <h4 className="details-heading fs-15 fw-medium">
                            <i className="ti ti-building" />
                            Building Details
                          </h4>
                          <ul className="list-unstyled fs-12 mb-0">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Building</span>
                              <span className="fw-medium">Block {row.building}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Floor</span>
                              <span className="fw-medium">Floor {row.floor}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Room Type</span>
                              <span className="fw-medium">{row.type}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Capacity</span>
                              <span className="fw-medium">{row.capacity} seats</span>
                            </li>
                          </ul>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-checklist" />
                            Facilities
                          </h5>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {row.facilities.map((facility) => (
                              <span
                                className="badge badge-soft-secondary d-inline-flex align-items-center gap-1"
                                key={facility.label}
                              >
                                <i className={facility.icon} />
                                {facility.label}
                              </span>
                            ))}
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-device-desktop" />
                            Equipment
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.detail.equipment}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-gauge" />
                            Occupancy Rate
                          </h6>
                          <div className={`meter ${row.detail.meterClass}`}>
                            <span style={{ width: row.detail.meterWidth }} />
                          </div>
                          <p className="fs-12 text-muted mt-1 mb-3">{row.detail.occupancy}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-table" />
                            Weekly Timetable
                          </h6>
                          <p className="fs-12 text-muted mb-1">{row.detail.timetable}</p>
                          <Link to={routes.classTimetable} className="link-primary fs-12">
                            View full timetable <i className="ti ti-arrow-right" />
                          </Link>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-tools" />
                            Maintenance History
                          </h6>
                          <p className="fs-12 text-muted mb-3">{row.detail.maintenance}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-calendar-event" />
                            Upcoming Bookings
                          </h6>
                          <p className="fs-12 text-muted mb-3">{row.detail.bookings}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-notes" />
                            Notes
                          </h6>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onView(row)}
                            >
                              <i className="ti ti-eye me-1" />
                              Details
                            </Link>
                            <Link
                              to="#"
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() =>
                                onMenuAction({ id: 'reserve', label: 'Reserve Room', icon: '' }, row)
                              }
                            >
                              <i className="ti ti-bookmark me-1" />
                              Reserve
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

export default ClassroomsTable;
