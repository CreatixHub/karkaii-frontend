import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, DeleteRequestRow, RowMenuItem, SortKey } from '../data/deleteRequest.data';
import { rowMenuItems, rowQuickActions, tableHeaders } from '../data/deleteRequest.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface DeleteRequestTableProps {
  rows: DeleteRequestRow[];
  columns: Record<ColumnId, boolean>;
  sort: SortKey;
  sortAsc: boolean;
  onSort: (key: SortKey) => void;
  selected: string[];
  onToggleSelect: (id: string) => void;
  allChecked: boolean;
  someChecked: boolean;
  onToggleAll: (checked: boolean) => void;
  openMenu: string | null;
  onOpenMenu: (id: string | null) => void;
  onAction: (action: string, row: DeleteRequestRow) => void;
  onDelete: (row: DeleteRequestRow) => void;
}

const DeleteRequestTable = ({
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
  openMenu,
  onOpenMenu,
  onAction,
  onDelete,
}: DeleteRequestTableProps) => {
  const selectAllRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const renderMenuItem = (item: RowMenuItem, row: DeleteRequestRow) => {
    const inner = (
      <>
        <i className={item.icon} />
        {item.label}
      </>
    );

    if (item.profileLink) {
      return (
        <Link className="dropdown-item" to={routes.profile} onClick={() => onOpenMenu(null)}>
          {inner}
        </Link>
      );
    }

    return (
      <Link
        className={`dropdown-item${item.className ? ` ${item.className}` : ''}`}
        to="#"
        onClick={() => {
          onOpenMenu(null);
          if (item.modal === 'delete') onDelete(row);
          else onAction(item.action ?? item.id, row);
        }}
      >
        {inner}
      </Link>
    );
  };

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">
          Delete account requests with user, type, reason, status, reviewer and expected deletion date
        </caption>
        <thead>
          <tr>
            <th className="dt-pin">
              <input
                ref={selectAllRef}
                type="checkbox"
                className="dt-check"
                id="darAll"
                aria-label="Select all requests"
                checked={allChecked}
                onChange={(event) => onToggleAll(event.target.checked)}
              />
            </th>
            {tableHeaders
              .filter((header) => columns[header.id])
              .map((header) =>
                header.sort ? (
                  <th
                    key={header.id}
                    className={`dt-sortable${sort === header.sort ? ' is-sorted' : ''}`}
                    aria-sort={sort === header.sort ? (sortAsc ? 'ascending' : 'descending') : 'none'}
                    onClick={() => onSort(header.sort as SortKey)}
                  >
                    {header.label} <i className="ti ti-arrows-sort dt-sort-ic" />
                    {header.resize ? <span className="dt-resize" /> : null}
                  </th>
                ) : (
                  <th key={header.id}>{header.label}</th>
                ),
              )}
            <th className="text-end">Actions</th>
          </tr>
        </thead>
        <tbody id="darBody">
          {rows.map((row) => (
            <tr className="dt-row" key={row.id}>
              <td className="dt-pin">
                <input
                  type="checkbox"
                  className="dt-check record-row-check-dar"
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  onChange={() => onToggleSelect(row.id)}
                />
              </td>

              {columns.reqid ? (
                <td>
                  <Link to="#" className="link-primary fw-semibold">
                    {row.id}
                  </Link>
                </td>
              ) : null}

              {columns.user ? (
                <td>
                  <div className="dt-user">
                    <Link to={routes.profile} className="dt-avatar">
                      <ImageWithBasePath src={row.avatar} alt={row.name} />
                      <span
                        className={`dt-presence${row.online ? ' on' : ''}`}
                        title={row.online ? 'Online' : 'Offline'}
                      />
                    </Link>
                    <div>
                      <Link to={routes.profile} className="dt-name">
                        {row.name}
                      </Link>
                      <div className="dt-sub">
                        <span>{row.userId}</span>
                        <span className="dt-dot">•</span>
                        <span>{row.email}</span>
                      </div>
                    </div>
                  </div>
                </td>
              ) : null}

              {columns.usertype ? (
                <td>
                  <span className="badge badge-soft-primary">{row.userType}</span>
                </td>
              ) : null}

              {columns.department ? <td>{row.department}</td> : null}

              {columns.reason ? (
                <td>
                  <span className="closure-reason">
                    <span className="closure-reason-text" title={row.reasonNote}>
                      {row.reason}
                    </span>
                  </span>
                </td>
              ) : null}

              {columns.requested ? <td>{row.requested}</td> : null}

              {columns.status ? (
                <td>
                  <span className={`dt-pill ${row.pillClass}`}>
                    <span className="dt-pill-dot" />
                    {row.status}
                  </span>
                </td>
              ) : null}

              {columns.reviewer ? (
                <td>
                  {row.reviewer ? (
                    <div className="d-flex align-items-center">
                      <span className="avatar avatar-sm rounded-circle flex-shrink-0 me-2">
                        <ImageWithBasePath src={row.reviewer.avatar} alt={row.reviewer.name} />
                      </span>
                      <span className="fs-13">{row.reviewer.name}</span>
                    </div>
                  ) : (
                    <span className="badge badge-soft-secondary">Unassigned</span>
                  )}
                </td>
              ) : null}

              {columns.deletion ? <td>{row.deletion || <span className="text-muted">—</span>}</td> : null}

              <td>
                <div className="dt-actions">
                  {rowQuickActions.map((action) => (
                    <Link
                      key={action.id}
                      to="#"
                      className={`dt-ib ${action.variant}`}
                      title={action.title}
                      aria-label={`${action.title} ${row.name}`}
                      onClick={() => onAction(action.id, row)}
                    >
                      <i className={action.icon} />
                    </Link>
                  ))}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeleteRequestTable;
