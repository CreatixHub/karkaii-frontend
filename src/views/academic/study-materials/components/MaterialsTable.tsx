import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, MaterialRow, RowMenuItem, SortKey } from '../data/studyMaterials.data';
import { rowMenuItems, tableHeaders } from '../data/studyMaterials.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes as Record<string, string>;

export interface MaterialsTableProps {
  rows: MaterialRow[];
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
  onView: (row: MaterialRow) => void;
  onEdit: (row: MaterialRow) => void;
  onMenuAction: (item: RowMenuItem, row: MaterialRow) => void;
}

const MaterialsTable = ({
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
}: MaterialsTableProps) => {
  const colspan = 3 + tableHeaders.filter((header) => columns[header.id]).length;

  const sortClass = (key: SortKey | null) => {
    if (!key || sort !== key) return '';
    return sortAsc ? ' dt-sort-asc' : ' dt-sort-desc';
  };

  return (
    <div className="data-table dt-cards">
      <table className="table">
        <caption className="visually-hidden">
          Study material list with details, statistics and status
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all materials"
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
                      aria-label={`Expand ${row.title}`}
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
                      aria-label={`Select ${row.title}`}
                      checked={selected.includes(row.id)}
                      onChange={() => onToggleSelect(row.id)}
                    />
                  </td>

                  {columns.material ? (
                    <td>
                      <div className="dt-user">
                        <Link
                          to="#"
                          className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-light text-${row.tone}`}
                          onClick={() => onView(row)}
                        >
                          <i className={`${row.typeIcon} fs-20`} />
                        </Link>
                        <div>
                          <Link to="#" className="dt-name" onClick={() => onView(row)}>
                            {row.title}
                          </Link>
                          <div className="dt-sub">
                            <span className="link-primary dt-code">{row.id}</span>
                            <span className="dt-dot">·</span>
                            <span className="dt-subject">{row.subject}</span>
                          </div>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            <span className={`badge ${row.typeBadge} dt-type`}>
                              <i className={`${row.typeIcon} me-1`} />
                              {row.type}
                            </span>
                            <span className="badge badge-soft-secondary dt-year">
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
                          <span className="badge badge-soft-primary">
                            <i className="ti ti-school me-1" />
                            Class <span className="dt-acls">{row.className}</span>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-bookmark me-1" />
                          <span className="dt-chapter">{row.chapter}</span>
                        </li>
                        <li className="d-flex align-items-center gap-1 py-1">
                          <span className="avatar avatar-xs">
                            <ImageWithBasePath
                              src={row.teacher.avatar}
                              className="rounded-circle flex-shrink-0"
                              alt={row.teacher.name}
                            />
                          </span>
                          <span>
                            <span className="text-muted">By</span>{' '}
                            <Link to={routes.teacherDetails} className="fw-medium text-dark dt-teacher">
                              {row.teacher.name}
                            </Link>
                          </span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-calendar-event me-1" />
                          <span className="dt-date fw-medium text-dark">{row.date}</span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.stats ? (
                    <td>
                      <ul className="list-unstyled mb-0 fs-12">
                        <li className="py-1">
                          <i className="ti ti-download me-1 text-muted" />
                          <span className="fw-semibold text-dark dt-downloads-val">{row.downloads}</span>{' '}
                          <span className="text-muted">downloads</span>
                        </li>
                        <li className="py-1 text-muted">
                          <i className="ti ti-file-stack me-1" />
                          <span className="dt-size">{row.size}</span>
                        </li>
                      </ul>
                    </td>
                  ) : null}

                  {columns.status ? (
                    <td>
                      <span className={`dt-pill ${row.pillClass}`}>
                        <i className={row.pillIcon} />
                        {row.status}
                      </span>
                    </td>
                  ) : null}

                  <td>
                    <div className="dt-actions">
                      <Link
                        to="#"
                        className="dt-ib"
                        title="View Material"
                        aria-label="View Material"
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
                        title="Download"
                        aria-label="Download"
                        onClick={() => onMenuAction({ id: 'download', label: 'Download', icon: '' }, row)}
                      >
                        <i className="ti ti-download" />
                      </Link>
                      <Link
                        to="#"
                        className="dt-ib"
                        title="Share"
                        aria-label="Share"
                        onClick={() => onMenuAction({ id: 'share', label: 'Share', icon: '' }, row)}
                      >
                        <i className="ti ti-share-2" />
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
                            Material
                          </h4>
                          <p className="fs-12 text-muted mb-3">{row.title}</p>
                          <h5 className="details-heading fs-15">
                            <i className="ti ti-bookmark" />
                            Chapter
                          </h5>
                          <p className="fs-12 text-muted mb-0">{row.chapter}</p>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-info-circle" />
                            File
                          </h6>
                          <ul className="list-unstyled fs-12 mb-0">
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Type</span>
                              <span className="fw-medium">{row.type}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Size</span>
                              <span className="fw-medium">{row.size}</span>
                            </li>
                            <li className="d-flex align-items-center justify-content-between py-1">
                              <span className="text-muted">Downloads</span>
                              <span className="fw-medium">{row.downloads}</span>
                            </li>
                          </ul>
                        </div>

                        <div className="col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-user" />
                            Uploaded By
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
                              <span className="fs-12 text-muted">{row.date}</span>
                            </div>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-school" />
                            Class
                          </h6>
                          <p className="fs-12 text-muted mb-0">
                            Class {row.className} · {row.subject}
                          </p>
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
                            <Link
                              to="#"
                              className="btn btn-primary btn-sm flex-fill"
                              onClick={() => onMenuAction({ id: 'download', label: 'Download', icon: '' }, row)}
                            >
                              <i className="ti ti-download me-1" />
                              Download
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

export default MaterialsTable;
