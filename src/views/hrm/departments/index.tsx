import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import DepartmentCard from './components/DepartmentCard';
import DepartmentDetail from './components/DepartmentDetail';
import DepartmentsEmptyState from './components/DepartmentsEmptyState';
import DepartmentsSkeleton from './components/DepartmentsSkeleton';
import DepartmentsToolbar from './components/DepartmentsToolbar';
import DirectoryHeader from './components/DirectoryHeader';
import DepartmentModals from './modals/DepartmentModals';
import type { DepartmentDraft } from './modals/DepartmentModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  DepartmentModalId,
  DepartmentRow,
  FilterKey,
  SortKey,
  ToolbarMenu,
} from './data/departments.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  departmentRows,
  quickFilters,
  staffCountBand,
} from './data/departments.data';

const routes = all_routes;

const facetValue = (row: DepartmentRow, key: FilterKey): string => {
  switch (key) {
    case 'type':
      return row.type;
    case 'head':
      return row.hod;
    case 'status':
      return row.status;
    case 'staffCount':
    default:
      return staffCountBand(row.staff);
  }
};

/** Saved views narrow by type or status; `all` is the template's default. */
const matchesView = (row: DepartmentRow, view: string) => {
  if (view === 'academic') return row.type === 'Academic';
  if (view === 'inactive') return row.status === 'Inactive';
  return true;
};

const Departments = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(allColumns);
  const [density, setDensity] = useState<DensityId>('default');
  const [sort, setSort] = useState<SortKey>('name');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [chipIds, setChipIds] = useState<string[]>(quickFilters.map((chip) => chip.id));

  const [rows, setRows] = useState<DepartmentRow[]>(departmentRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string>(departmentRows[0]?.id ?? '');

  const [activeModal, setActiveModal] = useState<DepartmentModalId | null>(null);
  const [modalDepartment, setModalDepartment] = useState<DepartmentRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(850);
  const loading = booting || refreshing;

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = rows.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (!matchesView(row, view)) return false;
      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        return !wanted || facetValue(row, field.key) === wanted;
      });
    });

    // "Recently added" is the order the rows ship in, so it never re-sorts.
    if (sort === 'recent') return matches;

    return [...matches].sort((a, b) =>
      sort === 'staff' ? b.staff - a.staff : a.name.localeCompare(b.name),
    );
  }, [rows, search, view, filters, sort]);

  // Keep the pane on a department that is still visible.
  useEffect(() => {
    if (filtered.length === 0) return;
    if (!filtered.some((row) => row.id === activeId)) setActiveId(filtered[0].id);
  }, [filtered, activeId]);

  const activeDepartment = filtered.find((row) => row.id === activeId) ?? filtered[0] ?? null;

  const chips = useMemo(() => quickFilters.filter((chip) => chipIds.includes(chip.id)), [chipIds]);

  /* --------------------------------- Handlers ------------------------------- */

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const allSelected = filtered.length > 0 && filtered.every((row) => selected.includes(row.id));

  const selectAll = (checked: boolean) =>
    setSelected(checked ? filtered.map((row) => row.id) : []);

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setFilters({});
  };

  /** Raises the template's toast for an action that has no dialog of its own. */
  const runAction = (id: string) => {
    const message = actionToasts[id];
    if (message) push(message);
  };

  const handleToolbarAction = (id: string) => {
    if (id === 'refresh') {
      setRefreshing(true);
      window.setTimeout(() => {
        setRefreshing(false);
        runAction('refresh');
      }, 500);
      return;
    }
    if (id === 'print') window.print();
    runAction(id);
  };

  const openModal = (modal: DepartmentModalId, department: DepartmentRow | null = null) => {
    setModalDepartment(department);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  const archive = (ids: string[]) =>
    setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status: 'Inactive' } : row)));

  const handleBulkAction = (action: BulkAction) => {
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      openModal('delete');
      return;
    }
    if (action.modal) {
      openModal(action.modal, activeDepartment);
      return;
    }
    if (action.id === 'print') {
      window.print();
    }
    if (action.id === 'archive') {
      archive(selected);
      setSelected([]);
    }
    if (action.id === 'change_status') {
      setRows((current) =>
        current.map((row) =>
          selected.includes(row.id) ? { ...row, status: row.status === 'Active' ? 'Inactive' : 'Active' } : row,
        ),
      );
    }
    runAction(action.id);
  };

  const handleRowAction = (action: string, department: DepartmentRow) => {
    if (action === 'archive') {
      archive([department.id]);
      push(`${department.name} archived`);
      return;
    }
    if (action === 'print') {
      window.print();
      return;
    }
    runAction(action);
  };

  const handleAdd = (draft: DepartmentDraft) => {
    const template = rows[0];
    // Counting rows would reuse an id after a delete, so take the highest in use.
    const highest = rows.reduce((max, row) => Math.max(max, Number(row.id.replace('dept_', '')) || 0), -1);
    const nextId = `dept_${highest + 1}`;
    setRows((current) => [
      ...current,
      {
        ...template,
        id: nextId,
        name: draft.name,
        code: `D7572${49 + highest - departmentRows.length + 1}`,
        status: draft.status,
        staff: 0,
        teachers: 0,
        totalEmployees: 0,
        totalSubjects: 0,
        assignedClasses: 0,
        activeTeachers: 0,
        search: draft.name.toLowerCase(),
      },
    ]);
    setActiveId(nextId);
    push(`${draft.name} added successfully`);
  };

  const handleSave = (id: string, draft: DepartmentDraft) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, name: draft.name, status: draft.status } : row)),
    );
    push('Department updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRows((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} department(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRows((current) => current.filter((row) => row.id !== pendingDelete));
      push('Department deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  return (
    <>
      <div className={`page-wrapper${fullscreen ? ' workspace-fullscreen' : ''}`}>
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Department Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">HRM</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Department
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={() => handleToolbarAction('refresh')}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('add_department')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Department
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? <DepartmentsSkeleton /> : null}

          {!loading ? (
            <div id="dept_workspace">
              <div
                className={`card mb-0 data-workspace classes-workspace is-loaded${
                  fullscreen ? ' is-fullscreen card-fullscreen' : ''
                }`}
                id="dept_card"
                data-density={density}
              >
                <DepartmentsToolbar
                  search={search}
                  onSearch={setSearch}
                  filters={filters}
                  onFilter={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
                  onResetFilters={resetFilters}
                  sort={sort}
                  onSort={setSort}
                  view={view}
                  onView={setView}
                  columns={columns}
                  onColumn={(id, visible) => setColumns((current) => ({ ...current, [id]: visible }))}
                  density={density}
                  onDensity={setDensity}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={(id) => setChipIds((current) => current.filter((item) => item !== id))}
                  onClearChips={() => setChipIds([])}
                  onBulkAction={handleBulkAction}
                  onAction={handleToolbarAction}
                  onAdd={() => openModal('add_department')}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => setFullscreen((value) => !value)}
                />

                <div className="card-body">
                  <BulkActionBar count={selected.length} onAction={handleBulkAction} />

                  {filtered.length === 0 ? (
                    <DepartmentsEmptyState onCreate={() => openModal('add_department')} />
                  ) : (
                    <div className="row g-3">
                      {/* Master: Department Directory */}
                      <div className="col-xxl-4 col-lg-5">
                        <DirectoryHeader allSelected={allSelected} onSelectAll={selectAll} count={filtered.length} />
                        <div className="d-flex flex-column gap-3" id="dept_list" role="tablist" aria-label="Departments">
                          {filtered.map((row) => (
                            <DepartmentCard
                              key={row.id}
                              department={row}
                              active={row.id === activeDepartment?.id}
                              selected={selected.includes(row.id)}
                              columns={columns}
                              onSelect={toggleSelect}
                              onActivate={setActiveId}
                              onModal={(modal, dept) => {
                                if (modal === 'delete') setPendingDelete(dept.id);
                                openModal(modal, dept);
                              }}
                              onAction={handleRowAction}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Detail: selected department */}
                      <div className="col-xxl-8 col-lg-7">
                        {activeDepartment ? (
                          <DepartmentDetail
                            department={activeDepartment}
                            onModal={(modal, dept) => {
                              if (modal === 'delete') setPendingDelete(dept.id);
                              openModal(modal, dept);
                            }}
                            onAction={handleRowAction}
                          />
                        ) : null}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <DepartmentModals
        active={activeModal}
        department={modalDepartment}
        onClose={closeModal}
        onSwitch={(modal) => setActiveModal(modal)}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="deptToasts" />
    </>
  );
};

export default Departments;
