import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import SummaryStrip from './components/SummaryStrip';
import TeacherCardItem from './components/TeacherCardItem';
import TeacherGridSkeleton from './components/TeacherGridSkeleton';
import TeacherProfilePanel from './components/TeacherProfilePanel';
import WorkspaceFooter from './components/WorkspaceFooter';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import type { ToolbarMenu } from './components/WorkspaceToolbar';
import TeacherModals from './modals/TeacherModals';
import type { TeacherCard } from './data/teachers.data';
import { teachers } from './data/teachers.data';
import type { SortKey, TeacherModalId } from './data/teachersWorkspace.data';
import {
  actionToasts,
  advancedFilters,
  bulkBarActions,
  bulkMenuActions,
  exportActions,
  quickFilters,
  savedViews,
} from './data/teachersWorkspace.data';

const routes = all_routes;

/** How each advanced-filter select narrows a card. */
const matchesFilter = (teacher: TeacherCard, id: string, value: string) => {
  switch (id) {
    case 'class':
      return teacher.classLevels.includes(value);
    case 'subject':
      return teacher.subject === value;
    case 'status':
      return teacher.status === value;
    case 'academic-year':
      return teacher.year === value;
    default:
      return true;
  }
};

const compareBy = (sort: SortKey) => (a: TeacherCard, b: TeacherCard) => {
  switch (sort) {
    case 'subject':
      return a.subject.localeCompare(b.subject) || a.name.localeCompare(b.name);
    case 'name':
      return a.name.localeCompare(b.name);
    // "Recently updated" is the order the cards ship in, so it leaves them be.
    case 'recent':
    default:
      return 0;
  }
};

/** The seven columns `exportCsv()` wrote, in the same order. */
const CSV_COLUMNS: [string, (teacher: TeacherCard) => string][] = [
  ['Teacher', (teacher) => teacher.name],
  ['ID', (teacher) => teacher.id],
  ['Status', (teacher) => teacher.status],
  ['Class', (teacher) => teacher.classes],
  ['Subject', (teacher) => teacher.subject],
  ['Email', (teacher) => teacher.email],
  ['Phone', (teacher) => teacher.phone],
];

const TeacherGrid = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Record<string, string>>({});
  // The template ships the Sort menu with "Recently updated" already active.
  const [sort, setSort] = useState<SortKey>('recent');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [headerMenu, setHeaderMenu] = useState<'export' | 'bulk' | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const [roster, setRoster] = useState<TeacherCard[]>(teachers);
  const [selected, setSelected] = useState<string[]>([]);
  const [cardMenu, setCardMenu] = useState<string | null>(null);
  const [profile, setProfile] = useState<TeacherCard | null>(null);
  const [activeModal, setActiveModal] = useState<TeacherModalId | null>(null);
  const [doomed, setDoomed] = useState<TeacherCard | null>(null);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return roster
      .filter((teacher) => {
        // The template's own `data-search` haystack, used verbatim.
        if (term && !teacher.search.includes(term)) return false;
        if (view !== 'all' && teacher.status !== view) return false;

        return advancedFilters.every((field) => {
          const wanted = filters[field.id];
          return !wanted || matchesFilter(teacher, field.id, wanted);
        });
      })
      .sort(compareBy(sort));
  }, [roster, search, view, filters, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const currentPage = Math.min(page, pageCount);
  const shown = filtered.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const countBy = useCallback(
    (status: string) => roster.filter((teacher) => teacher.status === status).length,
    [roster],
  );

  // The template hardcoded these badges; they are derived from the roster here.
  const viewCounts = useMemo(
    () =>
      savedViews.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = item.id === 'all' ? roster.length : countBy(item.id);
        return acc;
      }, {}),
    [roster, countBy],
  );

  const quickCounts = useMemo(
    () =>
      quickFilters.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = countBy(item.id);
        return acc;
      }, {}),
    [countBy],
  );

  const summaryValues = useMemo(
    () => ({
      selected: String(selected.length),
      active: String(countBy('Active')),
      inactive: String(countBy('Inactive')),
      graduated: String(new Set(roster.map((teacher) => teacher.subject)).size),
      filtered: String(filtered.length),
    }),
    [selected.length, countBy, roster, filtered.length],
  );

  /* ----------------------------- Toolbar plumbing ---------------------------- */

  const chips = useMemo(
    () =>
      advancedFilters
        .filter((field) => filters[field.id])
        .map((field) => ({ id: field.id, label: `${field.key}: ${filters[field.id]}` })),
    [filters],
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setView('all');
    setFilters({});
    setPage(1);
    push('Filters cleared.');
  }, [push]);

  const clearChip = useCallback((id: string) => {
    setFilters((current) => ({ ...current, [id]: '' }));
    setPage(1);
  }, []);

  // The template's refresh button had no script; here it replays the skeleton.
  const runReveal = useCallback((delay: number, message?: string) => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setLoading(false);
      if (message) push(message);
    }, delay);
    return () => window.clearTimeout(timer);
  }, [push]);

  // The template revealed the live content 850ms after load; so does this.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const refresh = useCallback(() => {
    runReveal(700, actionToasts.refresh);
  }, [runReveal]);

  const toggleFullscreen = useCallback(() => {
    const next = !fullscreen;
    // The `.is-fullscreen` class carries the styling and is the fallback when
    // the native API is unavailable, exactly as the template's script had it.
    if (next) workspaceRef.current?.requestFullscreen?.().catch(() => undefined);
    else if (document.fullscreenElement) document.exitFullscreen();
    setFullscreen(next);
    push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.');
  }, [fullscreen, push]);

  // Leaving native fullscreen with Escape has to restore the button too.
  useEffect(() => {
    const sync = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  // Close the header dropdowns on an outside click, as Bootstrap's do.
  useEffect(() => {
    if (!headerMenu) return;
    const close = () => setHeaderMenu(null);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [headerMenu]);

  /* -------------------------------- Selection -------------------------------- */

  const visibleKeys = useMemo(() => filtered.map((teacher) => teacher.key), [filtered]);
  const selectedVisible = selected.filter((key) => visibleKeys.includes(key));
  const allSelected = visibleKeys.length > 0 && selectedVisible.length === visibleKeys.length;

  const selectAllRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate =
        selectedVisible.length > 0 && selectedVisible.length < visibleKeys.length;
    }
  }, [selectedVisible.length, visibleKeys.length]);

  const toggleSelect = useCallback((key: string) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelected(allSelected ? [] : visibleKeys);
  }, [allSelected, visibleKeys]);

  /* --------------------------------- Actions --------------------------------- */

  const exportCsv = useCallback(() => {
    const rows = [
      CSV_COLUMNS.map(([label]) => label),
      ...filtered.map((teacher) => CSV_COLUMNS.map(([, read]) => read(teacher))),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teachers.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, [filtered]);

  /** The `data-cls-action` router the template's script implemented. */
  const runAction = useCallback(
    (action: string) => {
      setHeaderMenu(null);
      if (action === 'print') window.print();
      if (action === 'export_csv') exportCsv();
      const message = actionToasts[action];
      if (message) push(message);
    },
    [exportCsv, push],
  );

  const confirmDelete = useCallback(() => {
    const keys = doomed ? [doomed.key] : selected;
    setRoster((current) => current.filter((teacher) => !keys.includes(teacher.key)));
    setSelected((current) => current.filter((key) => !keys.includes(key)));
    setActiveModal(null);
    setDoomed(null);
    push(keys.length > 1 ? `${keys.length} teachers deleted.` : 'Teacher deleted.');
  }, [doomed, selected, push]);

  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const rangeTo = Math.min(currentPage * rowsPerPage, filtered.length);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher Directory</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.teacherGrid}>Teachers</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher Directory
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid-level actions (search, filters, views,
                refresh) live in the workspace toolbar instead. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => setActiveModal('import')}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  aria-expanded={headerMenu === 'export'}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setHeaderMenu(headerMenu === 'export' ? null : 'export')}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3${headerMenu === 'export' ? ' show' : ''}`}
                >
                  {exportActions.map((action) => (
                    <li key={action.id}>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => runAction(action.id)}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => runAction('print')}
                >
                  <i className="ti ti-printer me-2" />
                  Print
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  aria-expanded={headerMenu === 'bulk'}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setHeaderMenu(headerMenu === 'bulk' ? null : 'bulk')}
                >
                  <i className="ti ti-checkbox me-2" />
                  Bulk Actions
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3${headerMenu === 'bulk' ? ' show' : ''}`}
                >
                  {bulkMenuActions.map((action) => (
                    <li key={action.id}>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => runAction(action.id)}
                      >
                        <i className={`${action.icon} me-2`} />
                        {action.label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <hr className="dropdown-divider my-2" />
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1 text-danger"
                      onClick={() => {
                        setHeaderMenu(null);
                        setDoomed(null);
                        setActiveModal('delete');
                      }}
                    >
                      <i className="ti ti-trash-x me-2" />
                      Delete Selected
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mb-2">
                <Link to={routes.addTeacher} className="btn btn-primary btn-sm d-flex align-items-center">
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Teacher
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Teachers Grid */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density="default"
              ref={workspaceRef}
            >
              {/* ===================== TOOLBAR ===================== */}
              <WorkspaceToolbar
                search={search}
                onSearch={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                view={view}
                onView={(next) => {
                  setView(next);
                  setPage(1);
                }}
                viewCounts={viewCounts}
                quickCounts={quickCounts}
                filters={filters}
                onFilter={(id, value) => {
                  setFilters((current) => ({ ...current, [id]: value }));
                  setPage(1);
                }}
                onResetFilters={resetFilters}
                onApplyFilters={() => push(`${filtered.length} teacher(s) match the current filters.`)}
                onSaveView={() => push(actionToasts.save_view)}
                sort={sort}
                onSort={setSort}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onFullscreen={toggleFullscreen}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={clearChip}
                matchCount={filtered.length}
                totalCount={roster.length}
              />

              {/* ===================== SELECT ALL ===================== */}
              <div className="p-3 border-bottom">
                <div className="form-check d-inline-flex align-items-center gap-2 mb-0">
                  <input
                    type="checkbox"
                    className="dt-check"
                    id="clsAll"
                    aria-label="Select all teachers"
                    ref={selectAllRef}
                    checked={allSelected}
                    onChange={toggleSelectAll}
                  />
                  <label className="form-check-label fs-13 mb-0" htmlFor="clsAll">
                    Select all
                  </label>
                </div>
              </div>

              {/* ===================== SKELETON LOADING ===================== */}
              <TeacherGridSkeleton hidden={!loading} />

              {/* ===================== LIVE CONTENT ===================== */}
              <div className="live-content">
                {/* Summary strip */}
                <SummaryStrip values={summaryValues} />

                <div
                  className="bulk-selection"
                  id="clsBulk"
                  role="region"
                  aria-label="Bulk actions"
                  hidden={selected.length === 0}
                >
                  <div className="bulk-selection-inner">
                    <span className="bulk-selection-count">
                      <b id="clsCount">{selected.length}</b> selected
                    </span>
                    <div className="d-flex flex-wrap gap-2">
                      {bulkBarActions.map((action) => (
                        <button
                          type="button"
                          className="btn btn-sm"
                          key={action.id}
                          onClick={() => runAction(action.id)}
                        >
                          <i className={`${action.icon} me-1`} />
                          {action.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className="btn btn-sm text-danger"
                        onClick={() => {
                          setDoomed(null);
                          setActiveModal('delete');
                        }}
                      >
                        <i className="ti ti-trash me-1" />
                        Delete
                      </button>
                    </div>
                    <button
                      type="button"
                      className="bulk-selection-close"
                      aria-label="Clear selection"
                      onClick={() => setSelected([])}
                    >
                      <i className="ti ti-x" />
                    </button>
                  </div>
                </div>

                {/* Card grid */}
                <div className="row g-3" id="clsBody" hidden={filtered.length === 0}>
                  {shown.map((teacher) => (
                    <TeacherCardItem
                      key={teacher.key}
                      teacher={teacher}
                      selected={selected.includes(teacher.key)}
                      onToggleSelect={toggleSelect}
                      menuOpen={cardMenu === teacher.key}
                      onToggleMenu={setCardMenu}
                      onProfile={setProfile}
                      onDelete={(target) => {
                        setDoomed(target);
                        setActiveModal('delete');
                      }}
                      onDownload={(target) => push(`${target.name}'s profile queued for download.`)}
                    />
                  ))}
                </div>

                {/* Empty state */}
                <div
                  className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`}
                  id="clsEmpty"
                >
                  <div className="workspace-empty-art">
                    <i className="ti ti-mood-empty" />
                  </div>
                  <h5>No teachers match your filters</h5>
                  <p>
                    Try adjusting your search terms or clearing the active filters to see more
                    results.
                  </p>
                  <button type="button" className="btn btn-primary" onClick={resetFilters}>
                    <i className="ti ti-rotate me-1" />
                    Reset filters
                  </button>
                </div>

                {/* Pagination footer */}
                <WorkspaceFooter
                  rangeFrom={rangeFrom}
                  rangeTo={rangeTo}
                  total={filtered.length}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPage={(rows) => {
                    setRowsPerPage(rows);
                    setPage(1);
                  }}
                  page={currentPage}
                  pageCount={pageCount}
                  onPage={setPage}
                />
              </div>

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Teachers Grid */}
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Teacher Profile Details */}
      <TeacherProfilePanel teacher={profile} onClose={() => setProfile(null)} />
      {/* /Teacher Profile Details */}

      {/* Delete + Import dialogs */}
      <TeacherModals
        active={activeModal}
        deleteCount={doomed ? 1 : selected.length}
        rowCount={roster.length}
        onClose={() => {
          setActiveModal(null);
          setDoomed(null);
        }}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};

export default TeacherGrid;
