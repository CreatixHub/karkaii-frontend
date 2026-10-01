import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, GuardianRow, RowMenuItem, SortKey } from '../data/guardiansList.data';
import { rowMenuItems, tableHeaders } from '../data/guardiansList.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes as Record<string, string>;

export interface GuardianTableProps {
  rows: GuardianRow[];
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
  onView: (row: GuardianRow) => void;
  onEdit: (row: GuardianRow) => void;
  onDelete: (row: GuardianRow) => void;
  onMessage: (row: GuardianRow) => void;
  onCall: (row: GuardianRow) => void;
  onMenuAction: (item: RowMenuItem, row: GuardianRow) => void;
}

const GuardianTable = ({
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
  onDelete,
  onMessage,
  onCall,
  onMenuAction,
}: GuardianTableProps) => {
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

  const renderMenuItem = (item: RowMenuItem, row: GuardianRow) => {
    const inner = (
      <>
        <i className={item.icon} />
        {item.label}
      </>
    );

    if (item.route && routes[item.route]) {
      return (
        <Link className="dropdown-item" to={routes[item.route]} onClick={() => onOpenMenu(null)}>
          {inner}
        </Link>
      );
    }

    return (
      <Link
        className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
        to="#"
        onClick={() => {
          onOpenMenu(null);
          // Delete shares the row action bar's handler so both stage the same row.
          if (item.modal === 'delete') onDelete(row);
          else onMenuAction(item, row);
        }}
      >
        {inner}
      </Link>
    );
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">Guardian list with contact, linked students and status</caption>
        <thead>
          <tr>
            <th className="card-expand-toggle" />
            <th className="dt-pin card-select">
              <input
                ref={selectAllRef}
                type="checkbox"
                className="dt-check"
                id="clsAll"
                aria-label="Select all guardians"
                checked={allChecked}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            {visibleHeaders.map((header) =>
              header.sort ? (
                <th
                  key={header.id}
                  className={`dt-sortable${sort === header.sort ? ' is-sorted' : ''}`}
                  aria-sort={sort === header.sort ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                  onClick={() => onSort(header.sort as SortKey)}
                >
                  {header.label} <i className="ti ti-arrows-sort dt-sort-ic" />
                  <span className="dt-resize" />
                </th>
              ) : (
                <th key={header.id}>
                  {header.label}
                  <span className="dt-resize" />
                </th>
              ),
            )}
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

                {columns.guardian ? (
                  <td>
                    <div className="dt-user">
                      <Link to="#" className="dt-avatar" onClick={() => onView(row)}>
                        <ImageWithBasePath src={row.avatar} alt={row.name} />
                      </Link>
                      <div>
                        <Link to="#" className="dt-name" onClick={() => onView(row)}>
                          {row.name}
                        </Link>
                        <div className="dt-sub">
                          <span className="link-primary">{row.id}</span>
                          <span className="dt-dot">·</span>
                          <span className="dt-reln">{row.relationship}</span>
                        </div>
                        <div className="fs-12 text-muted dt-occ">
                          <i className="ti ti-briefcase me-1" />
                          {row.occupation}
                        </div>
                        <div className="d-flex flex-wrap gap-1 mt-1">
                          <span className="badge badge-soft-primary d-inline-flex align-items-center gap-1">
                            <i className="ti ti-users" />
                            <span className="dt-count-val">{row.childrenCount}</span> Students
                          </span>
                          {row.primaryContact ? (
                            <span className="badge badge-soft-success d-inline-flex align-items-center gap-1">
                              <i className="ti ti-star" />
                              Primary
                            </span>
                          ) : null}
                          {row.emergencyContact ? (
                            <span className="badge badge-soft-danger d-inline-flex align-items-center gap-1">
                              <i className="ti ti-urgent" />
                              Emergency
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </td>
                ) : null}

                {columns.contact ? (
                  <td>
                    <p className="mb-1 text-dark dt-phone">
                      <i className="ti ti-phone text-muted me-1" />
                      {row.phone}
                    </p>
                    <p className="mb-1">
                      <i className="ti ti-mail text-muted me-1" />
                      <a href={`mailto:${row.email}`} className="link-primary dt-email">
                        {row.email}
                      </a>
                    </p>
                    <p className="fs-12 text-muted mb-1">
                      <i className="ti ti-map-pin me-1" />
                      {row.address}
                    </p>
                    <div className="d-flex flex-wrap gap-1">
                      <span className="badge badge-soft-info d-inline-flex align-items-center gap-1">
                        <i className={row.channelIcon} />
                        {row.channel}
                      </span>
                      <span className="badge badge-soft-secondary d-inline-flex align-items-center gap-1">
                        <i className="ti ti-clock" />
                        {row.lastContact}
                      </span>
                    </div>
                  </td>
                ) : null}

                {columns.student ? (
                  <td>
                    <div className="dt-user">
                      <Link to={routes.studentDetail} className="dt-avatar dt-avatar-round">
                        <ImageWithBasePath src={row.child.avatar} alt={row.child.name} />
                      </Link>
                      <div>
                        <Link to={routes.studentDetail} className="dt-name">
                          {row.child.name}
                          {row.childrenCount > 1 ? (
                            <span className="badge badge-soft-primary ms-1">+{row.childrenCount - 1}</span>
                          ) : null}
                        </Link>
                        <div className="dt-sub">
                          <span className="link-primary dt-adm">{row.child.admissionNo}</span>
                        </div>
                        <div className="fs-12 text-muted">
                          <span className="dt-cls">{row.child.classLabel}</span>
                          <span className="dt-dot mx-1">·</span>
                          {row.year}
                        </div>
                        <span className="badge badge-soft-success mt-1">
                          <i className="ti ti-circle-filled fs-6 me-1" />
                          {row.child.status}
                        </span>
                      </div>
                    </div>
                  </td>
                ) : null}

                {columns.status ? (
                  <td>
                    <span className={`dt-pill ${row.pillClass}`}>
                      {row.pillIcon ? <i className={row.pillIcon} /> : <span className="dt-pill-dot" />}
                      {row.pillLabel}
                    </span>
                  </td>
                ) : null}

                <td>
                  <div className="dt-actions">
                    <Link to="#" className="dt-ib" title="View Guardian" aria-label="View Guardian" onClick={() => onView(row)}>
                      <i className="ti ti-eye" />
                    </Link>
                    <Link to="#" className="dt-ib" title="Edit" aria-label="Edit" onClick={() => onEdit(row)}>
                      <i className="ti ti-edit" />
                    </Link>
                    <Link to="#" className="dt-ib" title="Message" aria-label="Message" onClick={() => onMessage(row)}>
                      <i className="ti ti-message" />
                    </Link>
                    <Link to="#" className="dt-ib" title="Call" aria-label="Call" onClick={() => onCall(row)}>
                      <i className="ti ti-phone" />
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
                        {rowMenuItems.map((item) => (
                          <div key={item.id}>
                            {item.divider ? <hr className="dropdown-divider" /> : null}
                            {renderMenuItem(item, row)}
                          </div>
                        ))}
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
                        <div className="col-12 col-xl-3 col-md-6">
                          <div className="d-flex align-items-center mb-3">
                            <span className="avatar avatar-lg me-2 flex-shrink-0">
                              <ImageWithBasePath src={row.avatar} className="rounded" alt={row.name} />
                            </span>
                            <div>
                              <h4 className="mb-0 fs-15 fw-medium">{row.name}</h4>
                              <span className="fs-12 text-muted">
                                {row.relationship} · {row.id}
                              </span>
                            </div>
                          </div>
                          <h6 className="details-heading">
                            <i className="ti ti-briefcase" />
                            Occupation
                          </h6>
                          <p className="fs-13 fw-medium mb-1">{row.occupation}</p>
                          {row.organization ? <p className="fs-12 text-muted mb-0">{row.organization}</p> : null}
                          <h6 className="details-heading mt-3">
                            <i className="ti ti-map-pin" />
                            Complete Address
                          </h6>
                          <p className="fs-12 text-muted mb-0">{row.address}</p>
                        </div>

                        <div className="col-12 col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-urgent" />
                            Emergency Contacts
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            {row.emergencyContacts.map((contact) => (
                              <li
                                className="d-flex align-items-center justify-content-between py-1"
                                key={contact.label}
                              >
                                <span className="text-muted">{contact.label}</span>
                                <span className="fw-medium">{contact.phone}</span>
                              </li>
                            ))}
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-users" />
                            Children ({row.childrenCount})
                          </h6>
                          {row.children.map((entry) => (
                            <div
                              className="d-flex align-items-center justify-content-between flex-wrap gap-2 py-2 border-bottom"
                              key={entry.admissionNo}
                            >
                              <div className="d-flex align-items-center">
                                <Link to={routes.studentDetail} className="avatar avatar-sm me-2">
                                  <ImageWithBasePath
                                    src={entry.avatar}
                                    className="img-fluid rounded-circle flex-shrink-0"
                                    alt={entry.name}
                                  />
                                </Link>
                                <div>
                                  <Link to={routes.studentDetail} className="fw-medium text-dark d-block">
                                    {entry.name}
                                  </Link>
                                  <span className="fs-12 text-muted">
                                    {entry.admissionNo} · {entry.classLabel}
                                  </span>
                                </div>
                              </div>
                              <span className="badge badge-soft-success">
                                <i className="ti ti-circle-filled fs-6 me-1" />
                                {entry.status}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="col-12 col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-bus" />
                            Transport Details
                          </h6>
                          <p className="fs-12 text-muted mb-3">{row.transport}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-report-money" />
                            Fee Summary
                          </h6>
                          <div className="d-flex align-items-center justify-content-between fs-12 py-1">
                            <span className="text-muted">Paid</span>
                            <span className="fw-medium text-success">{row.feePaid}</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between fs-12 py-1">
                            <span className="text-muted">Outstanding</span>
                            <span
                              className={`fw-medium ${row.feeOutstanding === '$0' ? 'text-success' : 'text-danger'}`}
                            >
                              {row.feeOutstanding}
                            </span>
                          </div>
                          <span className={`badge ${row.feeBadgeClass} mt-1`}>{row.feeStatus}</span>
                        </div>

                        <div className="col-12 col-xl-3 col-md-6">
                          <h6 className="details-heading">
                            <i className="ti ti-messages" />
                            Recent Communications
                          </h6>
                          <ul className="list-unstyled fs-12 mb-3">
                            {row.communications.map((entry) => (
                              <li className="py-1" key={entry}>
                                <i className="ti ti-point-filled text-primary me-1" />
                                {entry}
                              </li>
                            ))}
                          </ul>
                          <h6 className="details-heading">
                            <i className="ti ti-calendar-event" />
                            Meeting Notes
                          </h6>
                          <p className="fs-12 text-muted mb-2">{row.meetingNote}</p>
                          <h6 className="details-heading">
                            <i className="ti ti-notes" />
                            Quick Notes
                          </h6>
                          <div className="d-flex gap-2">
                            <Link
                              to="#"
                              className="btn btn-outline-light bg-white btn-sm flex-fill"
                              onClick={() => onView(row)}
                            >
                              <i className="ti ti-user me-1" />
                              Profile
                            </Link>
                            <Link to="#" className="btn btn-primary btn-sm flex-fill" onClick={() => onMessage(row)}>
                              <i className="ti ti-message me-1" />
                              Message
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

export default GuardianTable;
