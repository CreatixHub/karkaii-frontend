import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, RowMenuItem, SectionRow, SortKey } from '../data/classSection.data';
import { ActionLink } from '@components/workspace';
import {
  rowMenuItems,
  subjectBadges,
  subjectOverflow,
  tableHeaders,
  upcomingActivities,
  weeklyTimetable,
} from '../data/classSection.data';

const routes = all_routes as Record<string, string>;

export interface SectionsTableProps {
  rows: SectionRow[];
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
  onView: (row: SectionRow) => void;
  onEdit: (row: SectionRow) => void;
  onMenuAction: (item: RowMenuItem, row: SectionRow) => void;
}

const SectionsTable = ({
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
}: SectionsTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Class section list with class details, student distribution and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all sections"
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
            const label = `${row.name} Class ${row.className}`;
            return (
              <Fragment key={row.id}>
                <tr
                  className={`dt-row${isOpen ? ' expanded' : ''}${selected.includes(row.id) ? ' dt-selected' : ''}`}
                >
                  <td>
                    <button
                      type="button"
                      className="dt-expand"
                      aria-label={`Expand ${label}`}
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
                      aria-label={`Select ${label}`}
                      checked={selected.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  {columns.section ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className="dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-primary"
                          onClick={() => onView(row)}
                        >
                          <i className="ti ti-layout-grid fs-20" />
                        </Link>
                        <div>
                          <Link to="#" className="dt-name" onClick={() => onView(row)}>
                            {row.name}
                          </Link>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">{row.id}</span>
                            <span className="dt-dot">·</span>
                            <span className="dt-year">{row.year}</span>
                          </div>
                          <span className="badge badge-soft-primary mt-1">
                            <i className="ti ti-school me-1" />
                            Class <span className="dt-acls">{row.className}</span>
                          </span>
                        </div>
                      </div>
                    </td>
                  ) : null}

                  {columns.class ? (
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
                          <Link to={routes.teacherDetails} className="dt-teacher fw-medium text-dark">
                            {row.teacher.name}
                          </Link>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-door me-1" />
                          Room <span className="dt-room">{row.roomNo}</span>
                          <span className="mx-1">·</span>Floor <span className="dt-floor">{row.floor}</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-info">
                            <i className="ti ti-clock-hour-8 me-1" />
                            {row.shift}
                          </span>{' '}
                          <span className="badge badge-soft-secondary">
                            <i className="ti ti-language me-1" />
                            {row.medium}
                          </span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.students ? (
                    <td>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-semibold fs-13">
                          <span className="dt-stu-val">{row.students}</span> /{' '}
                          <span className="dt-cap-val">{row.capacity}</span>
                        </span>
                        <span className={`fs-12 ${row.seatsClass}`}>{row.seatsLeft} seats left</span>
                      </div>
                      <div className={`meter ${row.meterClass}`}>
                        <span style={{ width: row.meterWidth }} />
                      </div>
                      <div className="d-flex align-items-center gap-1 mt-2">
                        <span className="badge badge-soft-primary">
                          <i className="ti ti-gender-male me-1" />
                          {row.boys} Boys
                        </span>
                        <span className="badge badge-soft-pink">
                          <i className="ti ti-gender-female me-1" />
                          {row.girls} Girls
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
                        title="View Section"
                        aria-label="View Section"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                        <i className="ti ti-edit" />
                      </Link>
                      <Link to={routes.studentList} className="dt-ib" title="Students" aria-label="Students">
                        <i className="ti ti-users" />
                      </Link>
                      <Link
                        to={routes.studentAttendance}
                        className="dt-ib"
                        title="Attendance"
                        aria-label="Attendance"
                      >
                        <i className="ti ti-calendar-check" />
                      </Link>
                      <Link to={routes.classTimetable} className="dt-ib" title="Timetable" aria-label="Timetable">
                        <i className="ti ti-table" />
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
                            <i className="ti ti-school" />
                            Class Information
                          </h4>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Class</span>
                              <span className="fw-medium">Class {row.className}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Section</span>
                              <span className="fw-medium">{row.name}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Academic Year</span>
                              <span className="fw-medium">{row.year}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Medium</span>
                              <span className="fw-medium">{row.medium}</span>
                            </li>
                          </ul>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-user" />
                            Teacher Information
                          </h5>
                          <div className="d-flex align-items-center gap-2">
                            <span className="avatar avatar-sm">
                              <ImageWithBasePath
                                src={row.teacher.avatar}
                                className="rounded-circle flex-shrink-0"
                                alt={row.teacher.name}
                              />
                            </span>
                            <div>
                              <span className="fw-medium d-block">{row.teacher.name}</span>
                              <span className="fs-12 text-muted">Class Teacher</span>
                            </div>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-door" />
                            Room Details
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Room No</span>
                              <span className="fw-medium">{row.roomNo}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Floor</span>
                              <span className="fw-medium">Floor {row.floor}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Shift</span>
                              <span className="fw-medium">{row.shift}</span>
                            </li>
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-users" />
                            Student Distribution
                          </h6>
                          <div className={`meter ${row.meterClass} mb-1`}>
                            <span style={{ width: row.meterWidth }} />
                          </div>
                          <p className="fs-12 text-muted mb-0">
                            {row.students} of {row.capacity} seats · {row.boys} boys · {row.girls} girls ·{' '}
                            {row.seatsLeft} free
                          </p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-book" />
                            Subject List
                          </h6>
                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {subjectBadges.map((subject) => (
                              <span className={`badge ${subject.badgeClass}`} key={subject.label}>
                                {subject.label}
                              </span>
                            ))}
                            <span className="badge badge-soft-secondary">{subjectOverflow}</span>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-table" />
                            Weekly Timetable
                          </h6>
                          <p className="fs-12 text-muted mb-1">{weeklyTimetable}</p>
                          <Link to={routes.classTimetable} className="link-primary fs-12">
                            View full timetable <i className="ti ti-arrow-right" />
                          </Link>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-calendar-event" />
                            Upcoming Activities
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            {upcomingActivities.map((activity) => (
                              <li className="py-1" key={activity}>
                                <i className="ti ti-point-filled text-primary me-1" />
                                {activity}
                              </li>
                            ))}
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-notes" />
                            Academic Notes
                          </h6>
                          <p className="fs-12 text-muted mb-2">{row.note}</p>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onView(row)}
                            >
                              <i className="ti ti-eye me-1" />
                              View
                            </Link>
                            <Link to={routes.studentList} className="btn btn-primary btn-sm flex-fill">
                              <i className="ti ti-users me-1" />
                              Students
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

export default SectionsTable;
