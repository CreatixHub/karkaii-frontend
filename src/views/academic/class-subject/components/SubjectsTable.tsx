import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, RowMenuItem, SortKey, SubjectRow } from '../data/classSubject.data';
import { ActionLink } from '@components/workspace';
import {
  learningObjectives,
  rowMenuItems,
  subjectDescription,
  tableHeaders,
} from '../data/classSubject.data';

const routes = all_routes as Record<string, string>;

export interface SubjectsTableProps {
  rows: SubjectRow[];
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
  onView: (row: SubjectRow) => void;
  onEdit: (row: SubjectRow) => void;
  onMenuAction: (item: RowMenuItem, row: SubjectRow) => void;
}

const SubjectsTable = ({
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
}: SubjectsTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Class subject list with academic details, curriculum and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all subjects"
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

                  {columns.subject ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-${row.iconTone}`}
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
                          </div>
                          <span className={`badge ${row.categoryBadge} mt-1 dt-cat`}>
                            <i className="ti ti-category me-1" />
                            {row.category}
                          </span>
                        </div>
                      </div>
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
                          <Link to={routes.teacherDetails} className="dt-teacher fw-medium text-dark">
                            {row.teacher.name}
                          </Link>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-school me-1" />
                          Class <span className="dt-acls">{row.className}</span>, {row.section}
                          <span className="mx-1">·</span>
                          <span className="dt-year">{row.year}</span>
                        </li>
                        <li className="py-1">
                          <span className="badge badge-soft-secondary dt-dept">
                            <i className="ti ti-building me-1" />
                            {row.department}
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock-hour-4 me-1" />
                          <span className="dt-per-val">{row.periods}</span> periods/wk
                          <span className="mx-1">·</span>
                          <span className="dt-cred-val">{row.credits}</span> credits
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.curriculum ? (
                    <td>
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        <span className="badge badge-soft-primary">
                          <i className="ti ti-stack-2 me-1" />
                          <span className="dt-units-val">{row.units}</span> Units
                        </span>
                        <span className="badge badge-soft-info">
                          <i className="ti ti-book me-1" />
                          {row.lessons} Lessons
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        <span className="badge badge-soft-warning">
                          <i className="ti ti-clipboard-list me-1" />
                          {row.assignments} Assignments
                        </span>
                        <span className="badge badge-soft-danger">
                          <i className="ti ti-file-certificate me-1" />
                          {row.exams} Exams
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between fs-12 text-muted">
                        <span>
                          <i className="ti ti-folder me-1" />
                          {row.resources} resources
                        </span>
                        <span>
                          <i className="ti ti-clock me-1" />
                          {row.updated}
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
                        title="View Subject"
                        aria-label="View Subject"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                        <i className="ti ti-edit" />
                      </Link>
                      <Link to={routes.classSyllabus} className="dt-ib" title="Syllabus" aria-label="Syllabus">
                        <i className="ti ti-book-2" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Lesson Plans"
                        aria-label="Lesson Plans"
                        onClick={() =>
                          onMenuAction({ id: 'lesson_plans', label: 'Lesson Plans', icon: '' }, row)
                        }
                      >
                        <i className="ti ti-notebook" />
                      </Link>
                      <Link to={routes.exam} className="dt-ib" title="Exams" aria-label="Exams">
                        <i className="ti ti-file-certificate" />
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
                            <i className="ti ti-file-description" />
                            Subject Description
                          </h4>
                          <p className="fs-12 text-muted mb-3">{subjectDescription(row)}</p>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-target" />
                            Learning Objectives
                          </h5>
                          <ul className="fs-12 text-muted mb-0 ps-3">
                            {learningObjectives(row.name).map((objective) => (
                              <li key={objective}>{objective}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-stack-2" />
                            Curriculum Breakdown
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Units</span>
                              <span className="fw-medium">{row.units}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Lessons</span>
                              <span className="fw-medium">{row.lessons}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Assignments</span>
                              <span className="fw-medium">{row.assignments}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Exams</span>
                              <span className="fw-medium">{row.exams}</span>
                            </li>
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-folder" />
                            Resources
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.resources} files uploaded</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-user" />
                            Teacher
                          </h6>
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <span className="avatar avatar-sm">
                              <ImageWithBasePath
                                src={row.teacher.avatar}
                                className="rounded-circle flex-shrink-0"
                                alt={row.teacher.name}
                              />
                            </span>
                            <div>
                              <span className="fw-medium d-block">{row.teacher.name}</span>
                              <span className="fs-12 text-muted">{row.department}</span>
                            </div>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-clock-hour-4" />
                            Weekly Load
                          </h6>
                          <p className="fs-12 text-muted mb-0">
                            {row.periods} periods/wk · {row.credits} credits
                          </p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-school" />
                            Assignment
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Class</span>
                              <span className="fw-medium">
                                {row.className}, {row.section}
                              </span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Academic Year</span>
                              <span className="fw-medium">{row.year}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Last Updated</span>
                              <span className="fw-medium">{row.updated}</span>
                            </li>
                          </ul>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onView(row)}
                            >
                              <i className="ti ti-eye me-1" />
                              View
                            </Link>
                            <Link to={routes.classSyllabus} className="btn btn-primary btn-sm flex-fill">
                              <i className="ti ti-book-2 me-1" />
                              Syllabus
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

export default SubjectsTable;
