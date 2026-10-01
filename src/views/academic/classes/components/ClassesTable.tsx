import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ClassRow, ColumnId, RowMenuItem, SortKey } from '../data/classes.data';
import { rowMenuItems, tableHeaders } from '../data/classes.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes as Record<string, string>;

export interface ClassesTableProps {
  rows: ClassRow[];
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
  onView: (row: ClassRow) => void;
  onEdit: (row: ClassRow) => void;
  onMenuAction: (item: RowMenuItem, row: ClassRow) => void;
  onContextMenu: (row: ClassRow, x: number, y: number) => void;
}

/** Column count for the detail row's colspan: chevron + checkbox + visible + actions. */
const detailColspan = (columns: Record<ColumnId, boolean>) =>
  3 + tableHeaders.filter((header) => columns[header.id]).length;

const ClassesTable = ({
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
  onContextMenu,
}: ClassesTableProps) => {
  const colspan = detailColspan(columns);

  const sortClass = (key: SortKey) => {
    if (sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">
          Class list with status, category, class teacher, strength and class teacher
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all classes"
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
                  {header.id === 'students' ? null : <span className="dt-resize" />}
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
                  onContextMenu={(event) => {
                    event.preventDefault();
                    onContextMenu(row, event.clientX, event.clientY);
                  }}
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

                  {columns.class ? (
                    <td>
                      <div className="dt-user">
                        <span className={`record-icon-tile ${row.tileAccent}`}>{row.numeral}</span>
                        <div>
                          <Link to="#" className="dt-name" onClick={() => onView(row)}>
                            {row.name}
                          </Link>
                          <div className="dt-sub">
                            <span className="link-primary">{row.id}</span>
                            <span className="dt-dot">•</span>
                            <span>{row.sections}</span>
                            <span className="dt-dot">•</span>
                            <span>{row.room}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                  ) : null}

                  {columns.status ? (
                    <td>
                      <span className={`dt-pill ${row.pillClass}`}>
                        <span className="dt-pill-dot" />
                        {row.statusLabel}
                      </span>
                    </td>
                  ) : null}

                  {columns.category ? <td>{row.category}</td> : null}

                  {columns.teacher ? (
                    <td>
                      {row.teacher ? (
                        <div className="dt-user">
                          <Link to={routes.teacherList} className="dt-avatar">
                            <ImageWithBasePath src={row.teacher.avatar} alt={row.teacher.name} />
                          </Link>
                          <div>
                            <Link to={routes.teacherList} className="dt-name">
                              {row.teacher.name}
                            </Link>
                            <div className="dt-sub">
                              <span>{row.teacher.subject}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted">Not assigned</span>
                      )}
                    </td>
                  ) : null}

                  {columns.students ? <td>{row.students}</td> : null}

                  <td>
                    <div className="dt-actions">
                      <Link
                        to="#"
                        className="dt-ib"
                        title="View Class"
                        aria-label="View"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                        <i className="ti ti-edit" />
                      </Link>
                      <Link to={routes.studentList} className="dt-ib success" title="Students" aria-label="Students">
                        <i className="ti ti-users" />
                      </Link>
                      <Link
                        to={routes.classTimetable}
                        className="dt-ib"
                        title="Time Table"
                        aria-label="Time Table"
                      >
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
                        <div
                          className={`dropdown-menu dropdown-menu-end${openMenu === row.id ? ' show' : ''}`}
                        >
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
                          <h6 className="details-heading">
                            <i className="ti ti-user-star" />
                            Teaching Staff
                          </h6>
                          {row.detail.staff.map((person) => (
                            <div className="details-line" key={person.name}>
                              <ImageWithBasePath src={person.avatar} alt="" />
                              <span>
                                <b>{person.name}</b>
                                <em>{person.role}</em>
                              </span>
                              <Link
                                to={routes.teacherList}
                                className="compact-icon-button"
                                aria-label="Open teacher profile"
                              >
                                <i className="ti ti-arrow-up-right" />
                              </Link>
                            </div>
                          ))}
                          <h6 className="details-heading mt-3">
                            <i className="ti ti-user-check" />
                            Class Representative
                          </h6>
                          <div className="details-line">
                            <ImageWithBasePath src={row.detail.representative.avatar} alt="" />
                            <span>
                              <b>{row.detail.representative.name}</b>
                              <em>{row.detail.representative.role}</em>
                            </span>
                            <Link
                              to={routes.studentDetail}
                              className="compact-icon-button"
                              aria-label="Open student profile"
                            >
                              <i className="ti ti-arrow-up-right" />
                            </Link>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-book" />
                            Subjects
                          </h6>
                          <div className="d-flex flex-wrap gap-1">
                            {row.detail.subjects.map((subject) => (
                              <span className={`badge ${subject.badgeClass}`} key={subject.label}>
                                {subject.label}
                              </span>
                            ))}
                          </div>
                          <h6 className="details-heading mt-3">
                            <i className="ti ti-calendar-week" />
                            Weekly Schedule
                          </h6>
                          <div className="week-label">
                            {row.detail.week.map((day) => (
                              <span key={day.day}>
                                <b>{day.day}</b>
                                {day.periods}
                              </span>
                            ))}
                          </div>
                          <Link
                            to={routes.classTimetable}
                            className="btn btn-outline-light bg-white btn-sm w-100 mt-2"
                          >
                            <i className="ti ti-table me-1" />
                            Open timetable
                          </Link>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-chart-bar" />
                            Class Health
                          </h6>
                          <div className="row g-2">
                            {row.detail.health.map((fact) => (
                              <div className="col-6" key={fact.label}>
                                <div className={`record-fact ${fact.borderClass}`}>
                                  <b>{fact.value}</b>
                                  <span>{fact.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                          <h6 className="details-heading mt-3">
                            <i className="ti ti-users" />
                            Student Strength
                          </h6>
                          <div className="details-line">
                            <span className="details-line-icon accent-primary">
                              <i className="ti ti-gender-male" />
                            </span>
                            <span>
                              <b>Boys · {row.detail.boys.count}</b>
                              <em>{row.detail.boys.share}</em>
                            </span>
                          </div>
                          <div className="details-line">
                            <span className="details-line-icon accent-danger">
                              <i className="ti ti-gender-female" />
                            </span>
                            <span>
                              <b>Girls · {row.detail.girls.count}</b>
                              <em>{row.detail.girls.share}</em>
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-calendar-event" />
                            Upcoming Events
                          </h6>
                          {row.detail.events.map((event) => (
                            <div className="details-line" key={event.title}>
                              <span className={`details-line-icon ${event.accent}`}>
                                <i className={event.icon} />
                              </span>
                              <span>
                                <b>{event.title}</b>
                                <em>{event.meta}</em>
                              </span>
                            </div>
                          ))}
                          <h6 className="details-heading mt-3">
                            <i className="ti ti-notes" />
                            Quick Notes
                          </h6>
                          <p className="fs-12 text-muted mb-2">{row.detail.note}</p>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-light bg-white btn-sm"
                              onClick={() =>
                                onMenuAction(
                                  { id: 'assign_teacher', label: 'Assign Teacher', icon: '', modal: 'assignTeacher' },
                                  row,
                                )
                              }
                            >
                              <i className="ti ti-user-plus me-1" />
                              Assign teacher
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-light bg-white btn-sm"
                              onClick={() =>
                                onMenuAction(
                                  { id: 'announce', label: 'Announce', icon: '', modal: 'announce' },
                                  row,
                                )
                              }
                            >
                              <i className="ti ti-speakerphone me-1" />
                              Announce
                            </button>
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

export default ClassesTable;
