import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PermissionWorkspace from './components/PermissionWorkspace';
import RoleDirectory from './components/RoleDirectory';
import UserAssignmentPanel from './components/UserAssignmentPanel';
import RolesModals from './modals/RolesModals';
import type { RoleRecord, RolesModalId } from './data/rolesPermissions.data';
import {
  actionToasts,
  exportActions,
  permissionLabels,
  permissionModules,
  roles as seedRoles,
  statsCards,
} from './data/rolesPermissions.data';

const routes = all_routes;

/** Every module's flags for one role, seeded from the template's defaults. */
const seedPermissions = () =>
  Object.fromEntries(permissionModules.map((module) => [module.id, [...module.enabled]])) as Record<string, boolean[]>;

/** The four Presets, expressed as which of the ten permissions they turn on. */
const PRESETS: Record<string, number[]> = {
  read_only: [0],
  editor: [0, 1, 2, 5, 7, 8],
  manager: [0, 1, 2, 3, 5, 6, 7, 8],
  full_access: permissionLabels.map((_, index) => index),
};

const RolesPermissions = () => {
  /* ---------------------------------- State --------------------------------- */
  const [roles, setRoles] = useState<RoleRecord[]>(seedRoles);
  const [activeId, setActiveId] = useState(seedRoles[0]?.id ?? '');
  const [dirSearch, setDirSearch] = useState('');
  const [category, setCategory] = useState('all');

  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean[]>>>({
    [seedRoles[0]?.id ?? '']: seedPermissions(),
  });
  const [permSearch, setPermSearch] = useState('');
  const [expanded, setExpanded] = useState<string[]>([]);
  const [presetsOpen, setPresetsOpen] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<RolesModalId | null>(null);
  const [modalRole, setModalRole] = useState<RoleRecord | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const { toasts, push, dismiss } = useToasts();

  /* -------------------------------- Filtering ------------------------------- */

  const filteredRoles = useMemo(() => {
    const term = dirSearch.trim().toLowerCase();
    return roles.filter((role) => {
      if (term && !`${role.name} ${role.description}`.toLowerCase().includes(term)) return false;
      return category === 'all' || role.categories.includes(category);
    });
  }, [roles, dirSearch, category]);

  const activeRole = filteredRoles.find((role) => role.id === activeId) ?? filteredRoles[0] ?? null;
  const activePermissions = activeRole ? permissions[activeRole.id] ?? seedPermissions() : seedPermissions();

  /* --------------------------------- Handlers ------------------------------- */

  const runAction = (id: string) => {
    const message = actionToasts[id];
    if (message) push(message);
  };

  const setActivePermissions = (next: Record<string, boolean[]>) => {
    if (!activeRole) return;
    setPermissions((current) => ({ ...current, [activeRole.id]: next }));
  };

  const togglePermission = (moduleId: string, index: number, enabled: boolean) => {
    const next = { ...activePermissions };
    const flags = [...(next[moduleId] ?? [])];
    flags[index] = enabled;
    next[moduleId] = flags;
    setActivePermissions(next);
  };

  const setAll = (enabled: boolean) =>
    setActivePermissions(
      Object.fromEntries(permissionModules.map((module) => [module.id, permissionLabels.map(() => enabled)])),
    );

  const applyPreset = (presetId: string) => {
    const allowed = PRESETS[presetId] ?? [];
    setActivePermissions(
      Object.fromEntries(
        permissionModules.map((module) => [module.id, permissionLabels.map((_, index) => allowed.includes(index))]),
      ),
    );
    push(`${presetId.replace('_', ' ')} preset applied`);
  };

  const handleWorkspaceAction = (id: string) => {
    if (id === 'expand') {
      setExpanded(permissionModules.map((module) => module.id));
      runAction(id);
      return;
    }
    if (id === 'collapse') {
      setExpanded([]);
      runAction(id);
      return;
    }
    if (id === 'select_all') {
      setAll(true);
      runAction(id);
      return;
    }
    if (id === 'clear_all') {
      setAll(false);
      runAction(id);
      return;
    }
    runAction(id);
  };

  const openModal = (modal: RolesModalId, role: RoleRecord | null = null) => {
    setModalRole(role ?? activeRole);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  const handleAdd = (name: string) => {
    // The slug is the React key and the permissions key, so it has to stay unique.
    const base = name.toLowerCase().replace(/\s+/g, '-');
    let id = base;
    for (let suffix = 2; roles.some((role) => role.id === id); suffix += 1) id = `${base}-${suffix}`;

    setRoles((current) => [
      ...current,
      {
        id,
        name,
        description: 'Custom role — set its permissions on the right.',
        icon: 'ti ti-shield-half',
        tone: 'role-icon-slate',
        users: 0,
        perms: 0,
        type: 'Custom Role',
        status: 'Active',
        categories: ['custom', 'recent'],
        updated: 'Just now',
      },
    ]);
    setPermissions((current) => ({ ...current, [id]: seedPermissions() }));
    setActiveId(id);
    push(`${name} created successfully`);
  };

  const handleSave = (id: string, name: string) => {
    setRoles((current) => current.map((role) => (role.id === id ? { ...role, name } : role)));
    push('Role updated');
  };

  const confirmDelete = () => {
    const target = pendingDelete ?? modalRole?.id;
    if (target) {
      setRoles((current) => current.filter((role) => role.id !== target));
      push('Role deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-4">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Roles &amp; Permissions</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Administration</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Roles &amp; Permissions
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                onClick={() => runAction('clone')}
              >
                <i className="ti ti-copy me-1" />
                Clone Role
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                onClick={() => runAction('import')}
              >
                <i className="ti ti-file-import me-1" />
                Import
              </button>
              <div className="dropdown">
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-1" />
                  Export
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-2${exportOpen ? ' show' : ''}`}>
                  {exportActions.map((action) => (
                    <li key={action.id}>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          runAction(action.id);
                        }}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <Link to="#" className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center">
                <i className="ti ti-history me-1" />
                Audit Logs
              </Link>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => openModal('add_role', null)}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Create Role
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Overview cards */}
          <div className="row g-3 mb-4">
            {statsCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-directory ${card.variant}`}>
                  <span className="stats-avatar stats-icon">
                    <i className={card.icon} />
                  </span>
                  <div>
                    <h3 className="stats-value mb-0">{card.value}</h3>
                    <p className="stats-label">{card.label}</p>
                    <span className="stats-role">{card.note}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Overview cards */}

          {/* Workspace */}
          <div className="roles-page" id="rolePermWorkspace">
            <div className="row g-3">
              <RoleDirectory
                roles={filteredRoles}
                totalCount={roles.length}
                activeId={activeRole?.id ?? ''}
                onActivate={setActiveId}
                search={dirSearch}
                onSearch={setDirSearch}
                category={category}
                onCategory={setCategory}
                onModal={(modal, role) => {
                  if (modal === 'delete') setPendingDelete(role.id);
                  openModal(modal, role);
                }}
                onAction={(action) => runAction(action)}
                onCreate={() => openModal('add_role', null)}
              />

              {activeRole ? (
                <PermissionWorkspace
                  role={activeRole}
                  permissions={activePermissions}
                  onTogglePermission={togglePermission}
                  search={permSearch}
                  onSearch={setPermSearch}
                  expanded={expanded}
                  onToggleExpand={(moduleId) =>
                    setExpanded((current) =>
                      current.includes(moduleId)
                        ? current.filter((item) => item !== moduleId)
                        : [...current, moduleId],
                    )
                  }
                  onAction={handleWorkspaceAction}
                  onPreset={applyPreset}
                  presetsOpen={presetsOpen}
                  onPresetsOpen={setPresetsOpen}
                  onModal={(modal) => {
                    if (modal === 'delete') setPendingDelete(activeRole.id);
                    openModal(modal, activeRole);
                  }}
                />
              ) : null}
            </div>

            <UserAssignmentPanel onAction={runAction} />
          </div>
          {/* /Workspace */}
        </div>
      </div>

      <RolesModals
        active={activeModal}
        role={modalRole}
        onClose={closeModal}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="rpToasts" />
    </>
  );
};

export default RolesPermissions;
