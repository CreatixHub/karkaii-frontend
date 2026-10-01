import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { RoleRecord, RolesModalId } from '../data/rolesPermissions.data';
import {
  permissionActions,
  permissionLabels,
  permissionModules,
  permissionPresets,
  roleAvatars,
} from '../data/rolesPermissions.data';

export interface PermissionWorkspaceProps {
  role: RoleRecord;
  /** One flag array per module id. */
  permissions: Record<string, boolean[]>;
  onTogglePermission: (moduleId: string, index: number, enabled: boolean) => void;
  search: string;
  onSearch: (value: string) => void;
  /** Module ids currently expanded. */
  expanded: string[];
  onToggleExpand: (moduleId: string) => void;
  onAction: (action: string) => void;
  onPreset: (presetId: string) => void;
  presetsOpen: boolean;
  onPresetsOpen: (open: boolean) => void;
  onModal: (modal: RolesModalId) => void;
}

const PermissionWorkspace = ({
  role,
  permissions,
  onTogglePermission,
  search,
  onSearch,
  expanded,
  onToggleExpand,
  onAction,
  onPreset,
  presetsOpen,
  onPresetsOpen,
  onModal,
}: PermissionWorkspaceProps) => {
  const term = search.trim().toLowerCase();

  const modules = useMemo(
    () => permissionModules.filter((module) => !term || module.label.toLowerCase().includes(term)),
    [term],
  );

  const totalEnabled = useMemo(
    () => Object.values(permissions).reduce((sum, flags) => sum + flags.filter(Boolean).length, 0),
    [permissions],
  );
  const totalPermissions = permissionModules.length * permissionLabels.length;

  return (
    <div className="col-12 col-xl-7 col-lg-12 d-flex">
      <div className="card flex-fill mb-0">
        <div className="card-header">
          <div className="workspace-head">
            <span className="workspace-head-icon">
              <i className="ti ti-shield-check" />
            </span>
            <div className="flex-fill">
              <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
                <h4 className="mb-0" id="rpWsName">
                  {role.name}
                </h4>
                <span
                  className={`badge ${role.status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger'}`}
                  id="rpWsStatus"
                >
                  <i className="ti ti-circle-filled fs-8 me-1" />
                  {role.status}
                </span>
                <span className="badge badge-soft-primary" id="rpWsType">
                  {role.type}
                </span>
              </div>
              <p className="text-muted mb-2" id="rpWsDesc">
                {role.description}
              </p>
              <div className="avatar-list-stacked avatar-group-sm">
                {roleAvatars.map((avatar) => (
                  <span className="avatar avatar-rounded" key={avatar}>
                    <ImageWithBasePath src={avatar} alt="user" />
                  </span>
                ))}
                <Link className="avatar avatar-rounded bg-primary text-white fs-12" to="#">
                  +{Math.max(role.users - roleAvatars.length, 0)}
                </Link>
              </div>
            </div>
            <div className="d-flex align-items-start gap-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon"
                title="Clone Role"
                onClick={() => onAction('clone')}
              >
                <i className="ti ti-copy" />
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon"
                title="Edit Role"
                onClick={() => onModal('edit_role')}
              >
                <i className="ti ti-edit" />
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon text-danger"
                title="Delete Role"
                onClick={() => onModal('delete')}
              >
                <i className="ti ti-trash" />
              </button>
            </div>
          </div>
        </div>

        <div className="card-body">
          {/* Role information tiles */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <p className="fs-12 text-muted mb-1">Access Level</p>
              <h5 className="mb-0 fs-15">
                <span className="badge badge-soft-danger">{role.type === 'System Role' ? 'Super Admin' : 'Custom'}</span>
              </h5>
            </div>
            <div className="col-6 col-md-3">
              <p className="fs-12 text-muted mb-1">Created By</p>
              <h6 className="mb-0">{role.type === 'System Role' ? 'System' : 'Administrator'}</h6>
            </div>
            <div className="col-6 col-md-3">
              <p className="fs-12 text-muted mb-1">Total Permissions</p>
              <h6 className="mb-0">
                {totalEnabled} <span className="text-muted fw-normal fs-12">/ {totalPermissions}</span>
              </h6>
            </div>
            <div className="col-6 col-md-3">
              <p className="fs-12 text-muted mb-1">Assigned Users</p>
              <h6 className="mb-0">{role.users}</h6>
            </div>
          </div>

          {/* Permission toolbar */}
          <div className="roles-toolbar mb-3">
            <div className="search-field-roles">
              <i className="ti ti-search" />
              <input
                type="text"
                className="form-control"
                id="rpPermSearch"
                placeholder="Search permissions…"
                aria-label="Search permissions"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
              />
            </div>
            {permissionActions.map((action) => (
              <button
                key={action.id}
                type="button"
                className="btn btn-outline-light bg-white btn-sm"
                onClick={() => onAction(action.id)}
              >
                <i className={`${action.icon} me-1`} />
                {action.label}
              </button>
            ))}
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm dropdown-toggle"
                aria-expanded={presetsOpen}
                onClick={() => onPresetsOpen(!presetsOpen)}
              >
                <i className="ti ti-bookmarks me-1" />
                Presets
              </button>
              <ul className={`dropdown-menu dropdown-menu-end p-2${presetsOpen ? ' show' : ''}`}>
                {permissionPresets.map((preset) => (
                  <li key={preset.id}>
                    <Link
                      to="#"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        onPresetsOpen(false);
                        onPreset(preset.id);
                      }}
                    >
                      <i className={`${preset.icon} me-2`} />
                      {preset.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Permission modules accordion */}
          <div className="accordion permission-module-list" id="rpModules">
            {modules.map((module) => {
              const flags = permissions[module.id] ?? module.enabled;
              const isOpen = expanded.includes(module.id);

              return (
                <div className="accordion-item" key={module.id}>
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button${isOpen ? '' : ' collapsed'}`}
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => onToggleExpand(module.id)}
                    >
                      <span className="permission-module-icon">
                        <i className={module.icon} />
                      </span>
                      {module.label}
                      <span className="permission-module-count">
                        {flags.filter(Boolean).length} / {permissionLabels.length} enabled
                      </span>
                    </button>
                  </h2>
                  <div className={`accordion-collapse collapse${isOpen ? ' show' : ''}`}>
                    <div className="accordion-body">
                      <div className="permission-grid">
                        {permissionLabels.map((label, index) => (
                          <div className="permission-row" key={label}>
                            <label htmlFor={`rp-p-${module.id}-${index}`}>{label}</label>
                            <div className="form-check form-switch m-0">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                role="switch"
                                id={`rp-p-${module.id}-${index}`}
                                checked={flags[index]}
                                onChange={(event) => onTogglePermission(module.id, index, event.target.checked)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionWorkspace;
