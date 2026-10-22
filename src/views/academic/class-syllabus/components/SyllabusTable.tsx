import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, RowMenuItem, SortKey, SyllabusRow } from '../data/classSyllabus.data';
import { rowMenuItems, tableHeaders } from '../data/classSyllabus.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes as Record<string, string>;

export interface SyllabusTableProps {
  rows: SyllabusRow[];
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
  onView: (row: SyllabusRow) => void;
  onEdit: (row: SyllabusRow) => void;
  onMenuAction: (item: RowMenuItem, row: SyllabusRow) => void;
}

const SyllabusTable = ({
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
}: SyllabusTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Class syllabus list with academic details, progress and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all syllabi"
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
                      aria-label={`Expand ${row.name} syllabus`}
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
                      aria-label={`Select ${row.name} syllabus`}
                      checked={selected.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  {columns.syllabus ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-${row.tone}`}
                          onClick={() => onView(row)}
                        >
                          <i className="ti ti-book-2 fs-20" />
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
                          <div className="fs-12 text-muted">{row.subtitle}</div>
                          <span className="badge badge-soft-primary mt-1">
                            <i className="ti ti-school me-1" />
                            Class <span className="dt-acls">{row.className}</span>
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
                        <li className="py-1">
                          <span className="badge badge-soft-secondary dt-term">{row.term}</span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-stack-2 me-1" />
                          <span className="dt-units">{row.units}</span> Units
                          <span className="mx-1">·</span>
                          {row.topics} Topics<span className="mx-1">·</span>
                          {row.lessons} Lessons
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-clock-hour-4 me-1" />
                          Est. <span className="dt-hrs-val">{row.hours}</span> hrs
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.progress ? (
                    <td>
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-semibold fs-13">
                          <span className="dt-pct-val">{row.percent}</span>%
                        </span>
                        <span className="fs-12 text-muted">
                          {row.topicsDone}/{row.topics} topics
                        </span>
                      </div>
                      <div className={`meter ${row.meterClass}`}>
                        <span style={{ width: `${row.percent}%` }} />
                      </div>
                      <div className="d-flex align-items-center gap-1 mt-2">
                        <span className="badge badge-soft-success">
                          <i className="ti ti-circle-check me-1" />
                          {row.topicsDone} done
                        </span>
                        <span className="badge badge-soft-warning">
                          <i className="ti ti-hourglass me-1" />
                          {row.pending} pending
                        </span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-2 fs-12 text-muted">
                        <span>
                          <i className="ti ti-clock me-1" />
                          {row.updated}
                        </span>
                        <span>
                          <i className="ti ti-flag me-1" />
                          {row.due}
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
                        title="View Syllabus"
                        aria-label="View Syllabus"
                        onClick={() => onView(row)}
                      >
                        <i className="ti ti-eye" />
                      </Link>
                      <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                        <i className="ti ti-edit" />
                      </Link>
                      <Link to={routes.classHomeWork} className="dt-ib" title="Topics" aria-label="Topics">
                        <i className="ti ti-list-details" />
                      </Link>
                      <Link to={routes.classTimetable} className="dt-ib" title="Lessons" aria-label="Lessons">
                        <i className="ti ti-books" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Download PDF"
                        aria-label="Download PDF"
                        onClick={() =>
                          onMenuAction({ id: 'download_pdf', label: 'Download PDF', icon: '' }, row)
                        }
                      >
                        <i className="ti ti-file-download" />
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
                            Syllabus Overview
                          </h4>
                          <p className="fs-12 text-muted mb-3">
                            {row.subtitle} for Class {row.className}, {row.term} of the {row.year} session.
                          </p>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-stack-2" />
                            Structure
                          </h5>
                          <ul className="list-unstyled fs-12 mb-0">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Units</span>
                              <span className="fw-medium">{row.units}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Topics</span>
                              <span className="fw-medium">{row.topics}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Lessons</span>
                              <span className="fw-medium">{row.lessons}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-progress" />
                            Completion
                          </h6>
                          <div className={`meter ${row.meterClass} mb-1`}>
                            <span style={{ width: `${row.percent}%` }} />
                          </div>
                          <p className="fs-12 text-muted mb-3">
                            {row.topicsDone} of {row.topics} topics covered · {row.pending} pending
                          </p>
                          <h6 className="details-heading">
                            <i className="ti ti-clock-hour-4" />
                            Estimated Effort
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.hours} hours across the term</p>
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
                              <span className="fs-12 text-muted">{row.term}</span>
                            </div>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-flag" />
                            Target Completion
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.due}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-info-circle" />
                            Status
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Current</span>
                              <span className="fw-medium">{row.status}</span>
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
                            <Link to={routes.classHomeWork} className="btn btn-primary btn-sm flex-fill">
                              <i className="ti ti-list-details me-1" />
                              Topics
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

export default SyllabusTable;
