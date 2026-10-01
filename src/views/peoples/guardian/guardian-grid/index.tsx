import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import GuardianCardItem from './components/GuardianCardItem';
import GuardianPreviewPanel from './components/GuardianPreviewPanel';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import type { FilterChip } from './components/WorkspaceToolbar';
import GuardianModals from './modals/GuardianModals';
import type { GuardianDraft } from './modals/GuardianModals';
import type { GuardianRecord } from './data/guardians.data';
import { NEWEST_GUARDIAN_ID, guardians as seedGuardians, overviewCards } from './data/guardians.data';
import type { ColumnId, DensityId, FilterKey, GuardianModalId, SortKey, ToolbarMenu } from './data/guardiansWorkspace.data';
import { advancedFilters, allColumns, defaultColumns, exportActions } from './data/guardiansWorkspace.data';

const routes = all_routes;

const matchesView = (guardian: GuardianRecord, view: string) => {
  if (view === 'all') return true;
  if (view === 'new') return guardian.id === NEWEST_GUARDIAN_ID;
  if (view === 'active') return guardian.status === 'Active';
  if (view === 'verified') return guardian.status === 'Verified';
  if (view === 'pending') return guardian.status === 'Pending';
  return true;
};

const matchesQuick = (guardian: GuardianRecord, quickFilter: string | null) => {
  if (!quickFilter) return true;
  if (quickFilter === 'new') return guardian.id === NEWEST_GUARDIAN_ID;
  if (quickFilter === 'active') return guardian.status === 'Active';
  if (quickFilter === 'inactive') return guardian.status === 'Inactive';
  if (quickFilter === 'verified') return guardian.status === 'Verified';
  if (quickFilter === 'pending') return guardian.status === 'Pending';
  return true;
};

const matchesAdvanced = (guardian: GuardianRecord, filters: Partial<Record<FilterKey, string>>) =>
  advancedFilters.every((field) => {
    const wanted = filters[field.id];
    if (!wanted) return true;
    switch (field.id) {
      case 'relationship':
        // "Grandparent" and "Relative" are template groupings, not stored values.
        if (wanted === 'Grandparent') return guardian.relationship.startsWith('Grand');
        if (wanted === 'Relative') return ['Uncle', 'Aunt'].includes(guardian.relationship);
        return guardian.relationship === wanted;
      case 'student':
        return guardian.students.names.includes(wanted);
      case 'class':
        // Class labels read `III A, IV B`, so match on the word boundary.
        return guardian.students.classes.split(', ').some((label) => label.split(' ')[0] === wanted);
      case 'section':
        return guardian.students.classes.split(', ').some((label) => label.split(' ')[1] === wanted);
      case 'status':
        return guardian.status === wanted;
      case 'branch':
        return guardian.branch === wanted;
      case 'dateJoined':
      default:
        // `createdDate` is display text (`25 Mar 2024`); compare it as a date.
        return isWithinRange(guardian.createdDate, wanted);
    }
  });

/** `25 Mar 2024` against a `YYYY/MM/DD - YYYY/MM/DD` range from the date picker. */
const isWithinRange = (createdDate: string, range: string) => {
  const [from, to] = range.split(' - ');
  const created = new Date(createdDate).getTime();
  const start = new Date(from.replace(/\//g, '-')).getTime();
  const end = new Date(to.replace(/\//g, '-')).getTime();
  if (Number.isNaN(created) || Number.isNaN(start) || Number.isNaN(end)) return true;
  return created >= start && created <= end;
};

const sortGuardians = (list: GuardianRecord[], sort: SortKey) => {
  // "Recently added" is the order the records ship in, so it never re-sorts.
  if (sort === 'recent') return list;
  const rows = [...list];
  if (sort === 'name') rows.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'students') rows.sort((a, b) => b.studentsCount - a.studentsCount);
  if (sort === 'branch') rows.sort((a, b) => a.branch.localeCompare(b.branch));
  return rows;
};

const GuardianGrid = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(defaultColumns);
  const [density, setDensity] = useState<DensityId>('default');
  const [sort, setSort] = useState<SortKey>('recent');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [records, setRecords] = useState<GuardianRecord[]>(seedGuardians);
  const [selected, setSelected] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<GuardianModalId | null>(null);
  const [modalGuardianId, setModalGuardianId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const { toasts, push, dismiss } = useToasts();

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = records.filter((guardian) => {
      const haystack = `${guardian.name} ${guardian.id} ${guardian.email} ${guardian.phone}`.toLowerCase();
      return (
        (!term || haystack.includes(term)) &&
        matchesView(guardian, view) &&
        matchesQuick(guardian, quickFilter) &&
        matchesAdvanced(guardian, filters)
      );
    });
    return sortGuardians(rows, sort);
  }, [records, search, view, quickFilter, filters, sort]);

  const countBy = useCallback(
    (predicate: (guardian: GuardianRecord) => boolean) => records.filter(predicate).length,
    [records],
  );

  const viewCounts = useMemo(
    () => ({
      all: records.length,
      active: countBy((g) => g.status === 'Active'),
      new: countBy((g) => g.id === NEWEST_GUARDIAN_ID),
      verified: countBy((g) => g.status === 'Verified'),
      pending: countBy((g) => g.status === 'Pending'),
    }),
    [records, countBy],
  );

  const quickCounts = useMemo(
    () => ({
      active: countBy((g) => g.status === 'Active'),
      new: countBy((g) => g.id === NEWEST_GUARDIAN_ID),
      inactive: countBy((g) => g.status === 'Inactive'),
      verified: countBy((g) => g.status === 'Verified'),
      pending: countBy((g) => g.status === 'Pending'),
    }),
    [countBy],
  );

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = [];
    if (search) list.push({ id: 'search', label: `Search: "${search}"` });
    if (view !== 'all') list.push({ id: 'view', label: `View: ${view}` });
    if (quickFilter) list.push({ id: 'quick', label: `Quick: ${quickFilter}` });
    advancedFilters.forEach((field) => {
      const value = filters[field.id];
      if (value) list.push({ id: field.id, label: `${field.label}: ${value}` });
    });
    return list;
  }, [search, view, quickFilter, filters]);

  /* --------------------------------- Handlers ------------------------------- */

  const clearChip = (id: string) => {
    if (id === 'search') setSearch('');
    else if (id === 'view') setView('all');
    else if (id === 'quick') setQuickFilter(null);
    else setFilters((current) => ({ ...current, [id]: '' }));
  };

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setQuickFilter(null);
    setFilters({});
  };

  const setFilterField = (id: FilterKey, value: string) => setFilters((current) => ({ ...current, [id]: value }));

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push('Guardian directory refreshed');
    }, 500);
  };

  const previewGuardian = records.find((g) => g.id === previewId) ?? null;
  const modalGuardian = records.find((g) => g.id === modalGuardianId) ?? null;

  const openModal = (modal: GuardianModalId, id: string | null = null) => {
    setModalGuardianId(id);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  const handleAdd = (draft: GuardianDraft) => {
    const template = records[0];
    setRecords((current) => [
      {
        ...template,
        id: `G${124557 + current.length - seedGuardians.length}`,
        name: draft.name,
        avatar: 'assets/img/guardians/guardian-01.jpg',
        online: false,
        vip: false,
        status: 'Pending',
        statusBadgeClass: 'badge-soft-warning',
        phone: draft.phone || template.phone,
        email: draft.email || template.email,
        studentsLabel: `${draft.children.length} Assigned`,
        studentsCount: draft.children.length,
        students: { ...template.students, names: draft.children.join(', ') || template.students.names },
      },
      ...current,
    ]);
    push(`${draft.name} added successfully`);
  };

  const handleSave = (id: string, draft: GuardianDraft) => {
    setRecords((current) =>
      current.map((g) =>
        g.id === id
          ? {
              ...g,
              name: draft.name,
              phone: draft.phone || g.phone,
              email: draft.email || g.email,
              studentsLabel: draft.children.length ? `${draft.children.length} Assigned` : g.studentsLabel,
              studentsCount: draft.children.length || g.studentsCount,
              students: { ...g.students, names: draft.children.join(', ') || g.students.names },
            }
          : g,
      ),
    );
    push('Guardian details updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRecords((current) => current.filter((g) => !selected.includes(g.id)));
      push(`${selected.length} guardian(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRecords((current) => current.filter((g) => g.id !== pendingDelete));
      if (previewId === pendingDelete) setPreviewId(null);
      push('Guardian deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  /** Marks every selected card Active or Inactive, as the Bulk Actions menu offers. */
  const markSelected = (status: 'Active' | 'Inactive') => {
    setBulkOpen(false);
    if (selected.length === 0) {
      push('Select at least one guardian first');
      return;
    }
    setRecords((current) =>
      current.map((g) =>
        selected.includes(g.id)
          ? {
              ...g,
              status,
              statusBadgeClass: status === 'Active' ? 'badge-soft-success' : 'badge-soft-danger',
            }
          : g,
      ),
    );
    push(`Marked selected guardians ${status}`);
  };

  return (
    <>
      <div className={`page-wrapper${fullscreen ? ' workspace-fullscreen' : ''}`}>
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Guardian Directory</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.guardiansList}>Guardians</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Guardian Directory
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <div className="btn-group" role="group" aria-label="Directory actions">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={refresh}
                >
                  <i className="ti ti-refresh" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon"
                  title="Import"
                  aria-label="Import"
                  onClick={() => openModal('import')}
                >
                  <i className="ti ti-file-import" />
                </button>
              </div>

              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </button>
                <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                  {exportActions.map((action) => (
                    <li key={action.id}>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          push(`${action.label.replace('Export as', 'Exported as')}`);
                        }}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="dropdown">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                  aria-expanded={bulkOpen}
                  onClick={() => setBulkOpen((open) => !open)}
                >
                  <i className="ti ti-checkbox me-2" />
                  Bulk Actions
                </button>
                <ul className={`dropdown-menu dropdown-menu-end p-3${bulkOpen ? ' show' : ''}`}>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setBulkOpen(false);
                        push(`Message sent to ${selected.length} guardian(s)`);
                      }}
                    >
                      <i className="ti ti-mail-forward me-2" />
                      Send Message
                    </button>
                  </li>
                  <li>
                    <button type="button" className="dropdown-item rounded-1" onClick={() => markSelected('Active')}>
                      <i className="ti ti-user-check me-2" />
                      Mark Active
                    </button>
                  </li>
                  <li>
                    <button type="button" className="dropdown-item rounded-1" onClick={() => markSelected('Inactive')}>
                      <i className="ti ti-user-off me-2" />
                      Mark Inactive
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1 text-danger"
                      onClick={() => {
                        setBulkOpen(false);
                        setPendingDelete('bulk');
                        openModal('delete');
                      }}
                    >
                      <i className="ti ti-trash-x me-2" />
                      Delete Selected
                    </button>
                  </li>
                </ul>
              </div>

              <button
                type="button"
                className="btn btn-primary d-flex align-items-center"
                onClick={() => openModal('add')}
              >
                <i className="ti ti-square-rounded-plus me-2" />
                Add Guardian
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {/* Overview Cards */}
          <div className="row g-3 mb-3">
            {overviewCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-parents ${card.variant}`}>
                  <span className="stats-icon">
                    <i className={card.icon} />
                  </span>
                  <h3 className="stats-value mb-0">{card.value}</h3>
                  <p className="stats-label">{card.label}</p>
                  <span className="stats-link">
                    <i className={`ti ti-trending-${card.trendUp ? 'up' : 'down'}`} />
                    {card.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* /Overview Cards */}

          {/* Guardians Grid */}
          <div className="card mb-0">
            <div className={`data-workspace${fullscreen ? ' is-fullscreen card-fullscreen' : ''}`} data-density={density}>
              <WorkspaceToolbar
                search={search}
                onSearch={setSearch}
                view={view}
                onView={setView}
                viewCounts={viewCounts}
                quickFilter={quickFilter}
                onQuickFilter={setQuickFilter}
                quickCounts={quickCounts}
                filters={filters}
                onFilter={setFilterField}
                onResetFilters={resetFilters}
                columns={columns}
                onColumn={(id, visible) => setColumns((current) => ({ ...current, [id]: visible }))}
                onShowAllColumns={() => setColumns(allColumns)}
                density={density}
                onDensity={(id) => setDensity(id as DensityId)}
                matchCount={filtered.length}
                totalCount={records.length}
                sort={sort}
                onSort={setSort}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={clearChip}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onToggleFullscreen={() => setFullscreen((value) => !value)}
                onSaveView={() => push('Current view saved')}
              />

              <div className="card-body">
                {refreshing ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading…</span>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="card" id="guardian_empty_state">
                    <div className="card-body text-center py-5">
                      <span className="avatar avatar-xxl bg-soft-primary text-primary rounded-circle flex-shrink-0 mb-3">
                        <i className="ti ti-users-group fs-32" />
                      </span>
                      <h4 className="mb-2">No Guardians Found</h4>
                      <p className="text-muted mb-3">Try adjusting your filters or add a new guardian.</p>
                      <button
                        type="button"
                        className="btn btn-primary d-inline-flex align-items-center"
                        onClick={() => openModal('add')}
                      >
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add Guardian
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {filtered.map((guardian) => (
                      <GuardianCardItem
                        key={guardian.id}
                        guardian={guardian}
                        selected={selected.includes(guardian.id)}
                        columns={columns}
                        onSelect={toggleSelect}
                        onView={setPreviewId}
                        onEdit={(id) => openModal('edit', id)}
                        onDelete={(id) => {
                          setPendingDelete(id);
                          openModal('delete');
                        }}
                        onAction={(label, record) => push(`${label} — ${record.name}`)}
                      />
                    ))}
                    <div className="col-12">
                      <div className="load-more text-center">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => push('All guardians are already shown')}
                        >
                          <i className="ti ti-loader-3 me-1" />
                          Load More
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* /Guardians Grid */}
        </div>
      </div>

      <GuardianPreviewPanel
        guardian={previewGuardian}
        onClose={() => setPreviewId(null)}
        onEdit={(id) => openModal('edit', id)}
      />

      <GuardianModals
        active={activeModal}
        guardian={modalGuardian}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="guardianGridToasts" />
    </>
  );
};

export default GuardianGrid;
