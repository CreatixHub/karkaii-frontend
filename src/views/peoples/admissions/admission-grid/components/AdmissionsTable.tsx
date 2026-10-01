import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AdmissionRow, ColumnId, RowMenuItem, SortKey } from '../data/admissions.data';
import { rowMenu, tableHeaders } from '../data/admissions.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface AdmissionsTableProps {
  rows: AdmissionRow[];
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
  onRowMenu: (row: AdmissionRow, item: RowMenuItem) => void;
  onScheduleInterview: (row: AdmissionRow) => void;
  onCollectFees: (row: AdmissionRow) => void;
  onVerifyDocuments: (row: AdmissionRow) => void;
  onCommunicationHistory: (row: AdmissionRow) => void;
}

const AdmissionsTable = ({
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
  onScheduleInterview,
  onCollectFees,
  onVerifyDocuments,
  onCommunicationHistory,
}: AdmissionsTableProps) => {
  const visibleColumnCount = tableHeaders.filter((header) => columns[header.id]).length;
  const colSpan = visibleColumnCount + 3;

  const headerClass = (key: SortKey) => {
    if (sort !== key) return 'dt-sortable';
    return `dt-sortable ${sortAsc ? 'dt-sort-asc' : 'dt-sort-desc'}`;
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">
          Admission applications with status, class applied, parent and applied date
        </caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                type="checkbox"
                className="dt-check"
                id="admAll"
                aria-label="Select all applications"
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
                </th>
              ) : null,
            )}
            <th className="text-end card-actions-row">Actions</th>
          </tr>
        </thead>
        <tbody id="admBody">
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
                    className="dt-check adm-rowcheck"
                    aria-label={`Select ${row.name}`}
                    checked={selected.includes(row.id)}
                    onChange={() => onToggleSelect(row.id)}
                  />
                </td>
                {columns.applicant ? (
                  <td>
                    <div className="dt-user">
                      <Link to={routes.admissionDetails} className="dt-avatar">
                        <ImageWithBasePath src={row.avatar} alt={row.name} />
                      </Link>
                      <div>
                        <Link to={routes.admissionDetails} className="dt-name">
                          {row.name}
                        </Link>
                        <div className="dt-sub">
                          <span className="link-primary">{row.admissionNo}</span>
                          <span className="dt-dot">•</span>
                          <span>{row.gender}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                ) : null}
                {columns.status ? (
                  <td>
                    <span className={`dt-pill ${row.status.className}`}>
                      <span className="dt-pill-dot" />
                      {row.status.label}
                    </span>
                  </td>
                ) : null}
                {columns.class ? <td>{row.classApplied}</td> : null}
                {columns.parent ? (
                  <td>
                    <div className="dt-user">
                      <span className="dt-avatar">
                        <ImageWithBasePath src={row.parentAvatar} alt={row.parentName} />
                      </span>
                      <div>
                        <span className="dt-name">{row.parentName}</span>
                        <div className="dt-sub">
                          <span>{row.parentPhone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                ) : null}
                {columns.applied ? <td>{row.appliedDate}</td> : null}
                <td>
                  <div className="dt-actions">
                    <Link to={routes.admissionDetails} className="dt-ib" title="View Application" aria-label="View">
                      <i className="ti ti-eye" />
                    </Link>
                    <Link to={routes.addAdmission} className="dt-ib" title="Edit" aria-label="Edit">
                      <i className="ti ti-edit" />
                    </Link>
                    <ActionLink
                      className="dt-ib"
                      title="Schedule Interview"
                      ariaLabel="Schedule Interview"
                      onClick={() => onScheduleInterview(row)}
                    >
                      <i className="ti ti-calendar-event" />
                    </ActionLink>
                    <ActionLink
                      className="dt-ib success"
                      title="Collect Fees"
                      ariaLabel="Collect Fees"
                      onClick={() => onCollectFees(row)}
                    >
                      <i className="ti ti-cash" />
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
                        className={`dropdown-menu dropdown-menu-end${openMenu === row.id ? ' show' : ''}`}
                      >
                        {rowMenu.map((item) => (
                          <Fragment key={item.label}>
                            {item.dividerBefore ? <hr className="dropdown-divider" /> : null}
                            {item.to ? (
                              <Link
                                className="dropdown-item"
                                to={item.to}
                                onClick={() => onOpenMenu(null)}
                              >
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
                        <h6 className="mb-3 d-flex align-items-center gap-2">
                          <i className="ti ti-user-circle text-primary" />
                          Applicant Summary
                        </h6>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Gender</span>
                          <span className="text-dark text-end">{row.detail.gender}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Date of Birth</span>
                          <span className="text-dark text-end">{row.detail.dob}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Class Applied</span>
                          <span className="text-dark text-end">{row.detail.classApplied}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Academic Year</span>
                          <span className="text-dark text-end">{row.detail.academicYear}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Source</span>
                          <span className="text-dark text-end">{row.detail.source}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="mb-3 d-flex align-items-center gap-2">
                          <i className="ti ti-users text-primary" />
                          Parent &amp; Contact
                        </h6>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Parent Name</span>
                          <span className="text-dark text-end">{row.detail.parentName}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Relationship</span>
                          <span className="text-dark text-end">{row.detail.relationship}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Mobile</span>
                          <span className="text-dark text-end">{row.detail.mobile}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Email</span>
                          <span className="text-dark text-end">{row.detail.email}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Address</span>
                          <span className="text-dark text-end">{row.detail.address}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="mb-3 d-flex align-items-center gap-2">
                          <i className="ti ti-progress-check text-primary" />
                          Admission Progress
                        </h6>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Status</span>
                          <span className={`badge ${row.detail.status.className}`}>{row.detail.status.label}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Interview</span>
                          <span className="text-dark text-end">{row.detail.interview}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Fee Status</span>
                          <span className={`badge ${row.detail.feeStatus.className}`}>{row.detail.feeStatus.label}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Counselor</span>
                          <span className="text-dark text-end">{row.detail.counselor}</span>
                        </div>
                        <div className="d-flex justify-content-between border-bottom py-1 fs-13">
                          <span className="text-muted">Previous School</span>
                          <span className="text-dark text-end">{row.detail.previousSchool}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-6">
                        <h6 className="mb-3 d-flex align-items-center gap-2">
                          <i className="ti ti-files text-primary" />
                          Documents
                        </h6>
                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {row.detail.documents.map((doc) => (
                            <span className={doc.className} key={doc.label}>
                              <i className={`${doc.icon} me-1`} />
                              {doc.label}
                            </span>
                          ))}
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-light bg-white btn-sm"
                            onClick={() => onVerifyDocuments(row)}
                          >
                            <i className="ti ti-file-check me-1" />
                            Verify
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-light bg-white btn-sm"
                            onClick={() => onCommunicationHistory(row)}
                          >
                            <i className="ti ti-history me-1" />
                            History
                          </button>
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

export default AdmissionsTable;
