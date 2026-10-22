import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, SortKey, UserRow } from '../data/users.data';
import { tableHeaders } from '../data/users.data';
import { ActionLink } from '@components/workspace';

const routes = all_routes;

export interface UsersTableProps {
  rows: UserRow[];
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
  onEmail: (row: UserRow) => void;
  onDelete: (row: UserRow) => void;
  onAction: (action: string, row: UserRow) => void;
}

const UsersTable = ({
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
  onEmail,
  onDelete,
  onAction,
}: UsersTableProps) => {
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

  return (
    <div className="data-table">
      <table className="table">
        <caption className="visually-hidden">
          User list with role, department, contact, branch, status, last login and created date
        </caption>
        <thead>
          <tr>
            <th className="dt-pin usr-c-check">
              <input
                ref={selectAllRef}
                type="checkbox"
                className="dt-check"
                id="usrAll"
                aria-label="Select all users"
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
            <th className="text-end usr-c-act">Actions</th>
          </tr>
        </thead>
        <tbody id="usrBody">
          {rows.map((row) => (
            <tr className="dt-row" key={row.id}>
              <td className="dt-pin">
                <input
                  type="checkbox"
                  className="dt-check usr-rowcheck"
                  aria-label={`Select ${row.name}`}
                  checked={selected.includes(row.id)}
                  onChange={() => onToggleSelect(row.id)}
                />
              </td>

              {columns.user ? (
                <td>
                  <div className="dt-user">
                    <Link to={routes.profile} className="dt-avatar">
                      <ImageWithBasePath src={row.avatar} alt={row.name} />
                      <span className={`dt-presence${row.online ? ' on' : ''}`} title={row.online ? 'Online' : 'Offline'} />
                    </Link>
                    <div>
                      <Link to={routes.profile} className="dt-name">
                        {row.name}
                      </Link>
                      <div className="dt-sub">
                        <span>ID {row.id}</span>
                        <span className="dt-dot">•</span>
                        <span>{row.presence}</span>
                      </div>
                    </div>
                  </div>
                </td>
              ) : null}

              {columns.userid ? (
                <td>
                  <Link to={routes.profile} className="link-primary">
                    {row.id}
                  </Link>
                </td>
              ) : null}

              {columns.role ? (
                <td>
                  <span className={`badge ${row.roleBadgeClass} d-inline-flex align-items-center`}>
                    <i className={`${row.roleIcon} me-1`} />
                    {row.role}
                  </span>
                </td>
              ) : null}

              {columns.department ? <td>{row.department}</td> : null}

              {columns.email ? (
                <td>
                  <Link to="#" className="text-truncate d-inline-block" style={{ maxWidth: '180px' }}>
                    {row.email}
                  </Link>
                </td>
              ) : null}

              {columns.phone ? <td>{row.phone}</td> : null}

              {columns.branch ? <td>{row.branch}</td> : null}

              {columns.status ? (
                <td>
                  <span className={`dt-pill ${row.pillClass}`}>
                    <span className="dt-pill-dot" />
                    {row.status}
                  </span>
                </td>
              ) : null}

              {columns.login ? (
                <td>
                  <div className="dt-login">
                    <span className="dt-login-date">{row.lastLoginDate}</span>{' '}
                    {row.lastLoginTime ? <span className="dt-login-time">{row.lastLoginTime}</span> : null}
                    {row.lastLoginRelative ? (
                      <span className="dt-login-rel">
                        <i className="ti ti-clock" />
                        {row.lastLoginRelative}
                      </span>
                    ) : null}
                  </div>
                </td>
              ) : null}

              {columns.created ? <td>{row.created}</td> : null}

              <td>
                <div className="dt-actions">
                  <Link to={routes.profile} className="dt-ib" title="View Profile" aria-label={`View ${row.name}`}>
                    <i className="ti ti-eye" />
                  </Link>
                  <Link to={routes.profilesettings} className="dt-ib" title="Edit" aria-label={`Edit ${row.name}`}>
                    <i className="ti ti-edit" />
                  </Link>
                  <Link
                    to="#"
                    className="dt-ib"
                    title="Send Email"
                    aria-label={`Email ${row.name}`}
                    onClick={() => onEmail(row)}
                  >
                    <i className="ti ti-mail" />
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
                      <Link className="dropdown-item" to={routes.profile} onClick={() => onOpenMenu(null)}>
                        <i className="ti ti-user-circle" />
                        View Profile
                      </Link>
                      <Link className="dropdown-item" to={routes.profilesettings} onClick={() => onOpenMenu(null)}>
                        <i className="ti ti-edit" />
                        Edit
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => {
                          onOpenMenu(null);
                          onAction('reset_password', row);
                        }}
                      >
                        <i className="ti ti-key" />
                        Reset Password
                      </Link>
                      <Link className="dropdown-item" to={routes.rolesPermissions} onClick={() => onOpenMenu(null)}>
                        <i className="ti ti-shield-half" />
                        Assign Role
                      </Link>
                      <Link className="dropdown-item" to={routes.rolesPermissions} onClick={() => onOpenMenu(null)}>
                        <i className="ti ti-lock-cog" />
                        Permissions
                      </Link>
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => {
                          onOpenMenu(null);
                          onEmail(row);
                        }}
                      >
                        <i className="ti ti-mail" />
                        Send Email
                      </Link>
                      <hr className="dropdown-divider" />
                      <Link
                        className="dropdown-item"
                        to="#"
                        onClick={() => {
                          onOpenMenu(null);
                          onAction('deactivate', row);
                        }}
                      >
                        <i className="ti ti-user-off" />
                        Deactivate
                      </Link>
                      <Link
                        className="dropdown-item text-danger"
                        to="#"
                        onClick={() => {
                          onOpenMenu(null);
                          onDelete(row);
                        }}
                      >
                        <i className="ti ti-trash-x" />
                        Delete
                      </Link>
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

export default UsersTable;
