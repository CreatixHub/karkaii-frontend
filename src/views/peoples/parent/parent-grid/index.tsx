import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { useToasts } from '@hooks/useToasts';
import { all_routes } from '@/routes/all_routes';
import ParentCardItem from './components/ParentCardItem';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import type { FilterChip } from './components/WorkspaceToolbar';
import ParentPreviewPanel from './components/ParentPreviewPanel';
import ParentModals from './modals/ParentModals';
import { overviewCards, parents as seedParents } from './data/parents.data';
import type { ParentRecord } from './data/parents.data';
import type { ParentModalId, SortKey, ToolbarMenu } from './data/parentsWorkspace.data';
import { advancedFilters } from './data/parentsWorkspace.data';

const routes = all_routes;

const matchesQuick = (parent: ParentRecord, quickFilter: string | null) => {
  if (!quickFilter) return true;
  if (quickFilter === 'active') return parent.status === 'Active';
  if (quickFilter === 'inactive') return parent.status === 'Inactive';
  if (quickFilter === 'verified') return parent.status === 'Verified';
  if (quickFilter === 'pending') return parent.status === 'Pending';
  if (quickFilter === 'new') return parent.id === 'P124556';
  return true;
};

const matchesView = (parent: ParentRecord, view: string) => {
  if (view === 'all') return true;
  if (view === 'active') return parent.status === 'Active';
  if (view === 'new') return parent.id === 'P124556';
  if (view === 'verified') return parent.status === 'Verified';
  if (view === 'pending') return parent.status === 'Pending';
  return true;
};

const matchesAdvanced = (parent: ParentRecord, filters: Record<string, string>) =>
  Object.entries(filters).every(([key, value]) => {
    if (!value) return true;
    switch (key) {
      case 'parentType':
        return parent.relation === value;
      case 'student':
        return parent.children.some((child) => child.name.includes(value));
      case 'class':
        return parent.children.some((child) => child.classLabel.startsWith(value));
      case 'section':
        return parent.children.some((child) => child.classLabel.includes(value));
      case 'status':
        return parent.status === value;
      case 'branch':
        return parent.branch === value;
      default:
        return true;
    }
  });

const sortParents = (list: ParentRecord[], sort: SortKey) => {
  const rows = [...list];
  if (sort === 'name') rows.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === 'students') rows.sort((a, b) => b.children.length - a.children.length);
  if (sort === 'branch') rows.sort((a, b) => a.branch.localeCompare(b.branch));
  return rows;
};

const ParentGrid = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortKey>('recent');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [previewId, setPreviewId] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<ParentModalId | null>(null);
  const [modalParentId, setModalParentId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);
  const [records, setRecords] = useState<ParentRecord[]>(seedParents);

  const { toasts, push, dismiss } = useToasts();

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = records.filter((parent) => {
      const haystack = `${parent.name} ${parent.id} ${parent.email} ${parent.phone}`.toLowerCase();
      return (
        (!term || haystack.includes(term)) &&
        matchesView(parent, view) &&
        matchesQuick(parent, quickFilter) &&
        matchesAdvanced(parent, filters)
      );
    });
    return sortParents(rows, sort);
  }, [records, search, view, quickFilter, filters, sort]);

  const viewCounts = useMemo(
    () => ({
      all: records.length,
      active: records.filter((p) => p.status === 'Active').length,
      new: records.filter((p) => p.id === 'P124556').length,
      verified: records.filter((p) => p.status === 'Verified').length,
      pending: records.filter((p) => p.status === 'Pending').length,
    }),
    [records],
  );

  const quickCounts = useMemo(
    () => ({
      active: records.filter((p) => p.status === 'Active').length,
      new: records.filter((p) => p.id === 'P124556').length,
      inactive: records.filter((p) => p.status === 'Inactive').length,
      verified: records.filter((p) => p.status === 'Verified').length,
      pending: records.filter((p) => p.status === 'Pending').length,
    }),
    [records],
  );

  const chips: FilterChip[] = useMemo(() => {
    const list: FilterChip[] = [];
    if (search) list.push({ id: 'search', label: `Search: "${search}"` });
    if (quickFilter) list.push({ id: 'quick', label: quickFilter });
    Object.entries(filters).forEach(([id, value]) => {
      if (!value) return;
      const field = advancedFilters.find((item) => item.id === id);
      list.push({ id, label: `${field?.label ?? id}: ${value}` });
    });
    return list;
  }, [search, quickFilter, filters]);

  const onClearChip = (id: string) => {
    if (id === 'search') setSearch('');
    else if (id === 'quick') setQuickFilter(null);
    else setFilters((current) => ({ ...current, [id]: '' }));
  };

  const onResetFilters = () => {
    setFilters({});
    setQuickFilter(null);
    setSearch('');
  };

  const onFilterField = (id: string, value: string) => setFilters((current) => ({ ...current, [id]: value }));

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const refresh = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      push('Parent directory refreshed');
    }, 500);
  };

  const previewParent = records.find((p) => p.id === previewId) ?? null;
  const modalParent = records.find((p) => p.id === modalParentId) ?? null;

  const openModal = (modal: ParentModalId, id: string | null = null) => {
    setModalParentId(id);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  const handleAdd = (name: string) => {
    const nextId = `P${124557 - records.length}`;
    setRecords((current) => [
      {
        ...current[0],
        id: nextId,
        name,
        avatar: 'assets/img/parents/parent-01.jpg',
        vip: false,
        status: 'Pending',
        statusBadgeClass: 'badge-soft-warning',
      },
      ...current,
    ]);
    push(`${name} added successfully`);
  };

  const handleSave = (id: string, name: string) => {
    setRecords((current) => current.map((p) => (p.id === id ? { ...p, name } : p)));
    push('Parent details updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRecords((current) => current.filter((p) => !selected.includes(p.id)));
      setSelected([]);
      push('Selected parents deleted');
    } else if (pendingDelete) {
      setRecords((current) => current.filter((p) => p.id !== pendingDelete));
      push('Parent deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  return (
    <>
      <div className={`page-wrapper${fullscreen ? ' workspace-fullscreen' : ''}`}>
        <div className="content content-two">
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Parent Directory</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.parentList}>Parents</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Parent Directory
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap gap-2">
              <div className="btn-group" role="group" aria-label="Directory actions">
                <button type="button" className="btn btn-outline-light bg-white btn-icon" title="Refresh" aria-label="Refresh" onClick={refresh}>
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
                <button type="button" className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  <i className="ti ti-file-export me-2" />
                  Export
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <button type="button" className="dropdown-item rounded-1" onClick={() => push('Exported as PDF')}>
                      <i className="ti ti-file-type-pdf me-2" />
                      Export as PDF
                    </button>
                  </li>
                  <li>
                    <button type="button" className="dropdown-item rounded-1" onClick={() => push('Exported as Excel')}>
                      <i className="ti ti-file-type-xls me-2" />
                      Export as Excel
                    </button>
                  </li>
                </ul>
              </div>
              <div className="dropdown">
                <button type="button" className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center" data-bs-toggle="dropdown">
                  <i className="ti ti-checkbox me-2" />
                  Bulk Actions
                </button>
                <ul className="dropdown-menu dropdown-menu-end p-3">
                  <li>
                    <button type="button" className="dropdown-item rounded-1" onClick={() => push(`Message sent to ${selected.length} parent(s)`)}>
                      <i className="ti ti-mail-forward me-2" />
                      Send Message
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setRecords((current) =>
                          current.map((p) => (selected.includes(p.id) ? { ...p, status: 'Active', statusBadgeClass: 'badge-soft-success' } : p)),
                        );
                        push('Marked selected parents Active');
                      }}
                    >
                      <i className="ti ti-user-check me-2" />
                      Mark Active
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setRecords((current) =>
                          current.map((p) => (selected.includes(p.id) ? { ...p, status: 'Inactive', statusBadgeClass: 'badge-soft-danger' } : p)),
                        );
                        push('Marked selected parents Inactive');
                      }}
                    >
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
              <button type="button" className="btn btn-primary d-flex align-items-center" onClick={() => openModal('add')}>
                <i className="ti ti-square-rounded-plus me-2" />
                Add Parent
              </button>
            </div>
          </div>

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

          <div className="card mb-0">
            <div className="data-workspace" data-density="default">
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
                onFilter={onFilterField}
                onResetFilters={onResetFilters}
                matchCount={filtered.length}
                totalCount={records.length}
                sort={sort}
                onSort={setSort}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={onClearChip}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onToggleFullscreen={() => setFullscreen((value) => !value)}
              />

              <div className="card-body">
                {loading ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading…</span>
                    </div>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="card" id="parent_empty_state">
                    <div className="card-body text-center py-5">
                      <span className="avatar avatar-xxl bg-soft-primary text-primary rounded-circle flex-shrink-0 mb-3">
                        <i className="ti ti-users-group fs-32" />
                      </span>
                      <h4 className="mb-2">No Parents Found</h4>
                      <p className="text-muted mb-3">Try adjusting your filters or add a new parent.</p>
                      <button type="button" className="btn btn-primary d-inline-flex align-items-center" onClick={() => openModal('add')}>
                        <i className="ti ti-square-rounded-plus me-2" />
                        Add Parent
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {filtered.map((parent) => (
                      <ParentCardItem
                        key={parent.id}
                        parent={parent}
                        selected={selected.includes(parent.id)}
                        onSelect={toggleSelect}
                        onView={(id) => setPreviewId(id)}
                        onEdit={(id) => openModal('edit', id)}
                        onDelete={(id) => {
                          setPendingDelete(id);
                          openModal('delete');
                        }}
                      />
                    ))}
                    <div className="col-12">
                      <div className="load-more text-center">
                        <button type="button" className="btn btn-primary" onClick={() => push('All parents are already shown')}>
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
        </div>
      </div>

      <ParentPreviewPanel parent={previewParent} onClose={() => setPreviewId(null)} onEdit={(id) => openModal('edit', id)} />

      <ParentModals
        active={activeModal}
        parent={modalParent}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="parentGridToasts" />
    </>
  );
};

export default ParentGrid;
