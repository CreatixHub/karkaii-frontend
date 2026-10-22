import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RoleMenuItem, RoleRecord, RolesModalId } from '../data/rolesPermissions.data';
import { roleCategories, roleMenuItems } from '../data/rolesPermissions.data';

export interface RoleDirectoryProps {
  roles: RoleRecord[];
  totalCount: number;
  activeId: string;
  onActivate: (id: string) => void;
  search: string;
  onSearch: (value: string) => void;
  category: string;
  onCategory: (id: string) => void;
  onModal: (modal: RolesModalId, role: RoleRecord) => void;
  onAction: (action: string, role: RoleRecord) => void;
  onCreate: () => void;
}

/** One card, with its own kebab state so only the open menu listens for outside clicks. */
const RoleCard = ({
  role,
  active,
  onActivate,
  onModal,
  onAction,
}: {
  role: RoleRecord;
  active: boolean;
  onActivate: (id: string) => void;
  onModal: (modal: RolesModalId, role: RoleRecord) => void;
  onAction: (action: string, role: RoleRecord) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const runItem = (item: RoleMenuItem) => {
    setMenuOpen(false);
    if (item.modal) onModal(item.modal, role);
    else onAction(item.action ?? item.id, role);
  };

  return (
    <div
      className={`role-card${active ? ' active' : ''}`}
      onClick={() => onActivate(role.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onActivate(role.id);
        }
      }}
      tabIndex={0}
      role="tab"
      aria-selected={active}
    >
      <span className={`role-card-icon ${role.tone}`}>
        <i className={role.icon} />
      </span>
      <div className="role-card-body">
        <p className="role-card-name">{role.name}</p>
        <div className="role-card-meta">
          <span>
            <i className="ti ti-users" />
            {role.users} users
          </span>
          <span>
            <i className="ti ti-key" />
            {role.perms} perms
          </span>
          <span>
            <i className="ti ti-clock" />
            {role.updated}
          </span>
        </div>
      </div>
      <span className="role-card-dot" title={role.status} />
      <div className="dropdown" ref={menuRef} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
          aria-label="Role actions"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i className="ti ti-dots-vertical" />
        </button>
        <ul className={`dropdown-menu dropdown-menu-end${menuOpen ? ' show' : ''}`}>
          {roleMenuItems.map((item) => (
            <li key={item.id}>
              {item.divider ? <hr className="dropdown-divider" /> : null}
              <Link
                className={`dropdown-item${item.danger ? ' text-danger' : ''}`}
                to="#"
                onClick={() => runItem(item)}
              >
                <i className={`${item.icon} me-2`} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RoleDirectory = ({
  roles,
  totalCount,
  activeId,
  onActivate,
  search,
  onSearch,
  category,
  onCategory,
  onModal,
  onAction,
  onCreate,
}: RoleDirectoryProps) => (
  <div className="col-12 col-xl-5 col-lg-12 d-flex">
    <div className="card flex-fill mb-0">
      <div className="card-header">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="mb-0 d-flex align-items-center fs-16 fw-medium">
            <i className="ti ti-list-check text-primary me-2" />
            Role Directory
          </h4>
          <span className="badge badge-soft-primary" id="rpRoleCount">
            {totalCount}
          </span>
        </div>
        <div className="directory-search mb-3">
          <i className="ti ti-search" />
          <input
            type="text"
            className="form-control"
            id="rpDirSearch"
            placeholder="Search roles…"
            aria-label="Search roles"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </div>
        <div className="category-list">
          {roleCategories.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`category-row${category === item.id ? ' active' : ''}`}
              onClick={() => onCategory(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        {roles.length > 0 ? (
          <div className="directory-list" id="rpDirList">
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                active={role.id === activeId}
                onActivate={onActivate}
                onModal={onModal}
                onAction={onAction}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-5" id="rpDirEmpty">
            <span className="avatar avatar-xl rounded-circle flex-shrink-0 bg-primary-transparent text-primary mb-3">
              <i className="ti ti-shield-off fs-30" />
            </span>
            <h5 className="mb-1">No Roles Found</h5>
            <p className="text-muted mb-3">Create your first role to manage user permissions.</p>
            <button type="button" className="btn btn-primary" onClick={onCreate}>
              <i className="ti ti-square-rounded-plus me-1" />
              Create Role
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default RoleDirectory;
