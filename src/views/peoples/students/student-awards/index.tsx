import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AchievementPanel from './components/AchievementPanel';
import AwardsPagination from './components/AwardsPagination';
import AwardsSummary from './components/AwardsSummary';
import AwardsTable from './components/AwardsTable';
import AwardsToolbar from './components/AwardsToolbar';
import type { ToolbarMenu } from './components/AwardsToolbar';
import AwardModals from './modals/AwardModals';
import { achievementPanel } from './data/achievementPanel.data';
import type { Achievement } from './data/achievements.data';
import { achievements } from './data/achievements.data';
import type { AwardModalId, Density, SortKey } from './data/awardsWorkspace.data';
import {
  ACADEMIC_YEAR,
  CHIP_LABELS,
  TOTAL_ACHIEVEMENTS,
  columns,
  filterFields,
  summaryTiles,
} from './data/awardsWorkspace.data';

const routes = all_routes;

const LEVEL_ORDER = ['Class', 'School', 'District', 'State', 'National', 'International'];

const DEFAULT_FILTERS: Record<string, string> = {
  'achievement-category': '',
  class: '',
  'academic-year': ACADEMIC_YEAR,
  'award-level': '',
  status: '',
  placing: '',
};

const ALL_COLUMNS: Record<string, boolean> = columns.reduce<Record<string, boolean>>(
  (visible, column) => {
    visible[column.id] = true;
    return visible;
  },
  {},
);

/** "Winner · 35 recognition points" → "Winner". */
const placingOf = (row: Achievement) => row.level.meta.split(' · ')[0];

/** "Award 3 · 65 points" → 65. */
const pointsOf = (row: Achievement) => Number(row.studentSub.replace(/^.*·\s*/, '').replace(/\D/g, '')) || 0;

/** "18 Jul 2026" → a sortable timestamp; the em dash rows sort last. */
const dateOf = (row: Achievement) => {
  const parsed = Date.parse(row.awardDate.value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

const matchesView = (row: Achievement, view: string) => {
  switch (view) {
    case 'national':
      return row.level.label === 'National' || row.level.label === 'International';
    case 'certificate-pending':
      return row.status.label !== 'Certificate Issued';
    case 'nominations':
      return row.status.label === 'Nominated';
    case 'verification':
      return row.status.label === 'Pending Verification';
    case 'all':
    default:
      return true;
  }
};

const matchesQuick = (row: Achievement, quick: string) => {
  switch (quick) {
    case 'Academic Excellence':
    case 'Sports':
    case 'Cultural':
      return row.category.label === quick;
    case 'National':
      return row.level.label === 'National';
    case 'Nominated':
      return row.status.label === 'Nominated';
    case 'all':
    default:
      return true;
  }
};

const facetValue = (row: Achievement, facet: string): string => {
  switch (facet) {
    case 'achievement-category':
      return row.category.label;
    case 'class':
      return row.studentClass;
    case 'academic-year':
      return ACADEMIC_YEAR;
    case 'award-level':
      return row.level.label;
    case 'status':
      return row.status.label;
    case 'placing':
      return placingOf(row);
    default:
      return '';
  }
};

const compareBy = (sort: SortKey) => (a: Achievement, b: Achievement) => {
  switch (sort) {
    case 'student':
      return a.student.localeCompare(b.student);
    case 'date':
      return dateOf(a) - dateOf(b);
    case 'level':
      return LEVEL_ORDER.indexOf(a.level.label) - LEVEL_ORDER.indexOf(b.level.label);
    case 'points':
      return pointsOf(b) - pointsOf(a);
    case 'id':
    default:
      return a.id.localeCompare(b.id);
  }
};

const StudentAwards = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Record<string, string>>(DEFAULT_FILTERS);
  const [fromDate, setFromDate] = useState('01-07-2026');
  const [toDate, setToDate] = useState('15-08-2026');
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(ALL_COLUMNS);
  const [density, setDensity] = useState<Density>('default');
  const [fullscreen, setFullscreen] = useState(false);
  const [quickFilter, setQuickFilter] = useState('all');
  const [sort, setSort] = useState<SortKey>('id');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);

  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<AwardModalId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const [rowsPerPage, setRowsPerPage] = useState('8');
  const [page, setPage] = useState(1);

  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------- */

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return achievements
      .filter((row) => {
        if (term) {
          const haystack = [row.student, row.admissionNo, row.id, row.title, row.event]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(term)) return false;
        }

        if (!matchesView(row, view)) return false;
        if (!matchesQuick(row, quickFilter)) return false;

        return filterFields.every((field) => {
          const wanted = filters[field.id];
          return !wanted || facetValue(row, field.id) === wanted;
        });
      })
      .sort(compareBy(sort));
  }, [search, view, quickFilter, filters, sort]);

  const chips = useMemo(
    () =>
      filterFields
        .filter((field) => Boolean(filters[field.id]))
        .map((field) => ({
          id: field.id,
          label: `${CHIP_LABELS[field.id] ?? field.label}: ${filters[field.id]}`,
        })),
    [filters],
  );

  /* --------------------------------- Handlers -------------------------------- */

  const setFilter = useCallback((id: string, value: string) => {
    setFilters((current) => ({ ...current, [id]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS, 'academic-year': '' });
    setSearch('');
    setView('all');
    setQuickFilter('all');
    setPage(1);
  }, []);

  const clearChip = useCallback((id: string) => {
    setFilters((current) => ({ ...current, [id]: '' }));
  }, []);

  const toggleColumn = useCallback((id: string) => {
    setVisibleColumns((current) => ({ ...current, [id]: !(current[id] ?? true) }));
  }, []);

  const showAllColumns = useCallback(() => setVisibleColumns(ALL_COLUMNS), []);

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const toggleExpand = useCallback((id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((current) => (current.length === rows.length ? [] : rows.map((row) => row.id)));
  }, [rows]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  // Close the export menu on an outside click, as Bootstrap's dropdown does.
  useEffect(() => {
    if (!exportOpen) return;
    const close = () => setExportOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [exportOpen]);

  const openModal = useCallback((modal: AwardModalId) => {
    setPanelOpen(false);
    setActiveModal(modal);
  }, []);

  const openPanel = useCallback(() => {
    setActiveModal(null);
    setPanelOpen(true);
  }, []);

  const perPage = Number(rowsPerPage) || 8;
  const pageCount = Math.max(Math.ceil(TOTAL_ACHIEVEMENTS / perPage), 1);
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, TOTAL_ACHIEVEMENTS);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Awards</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.studentGrid}>Students</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Awards
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid-level actions (search, filters, columns,
                density, refresh) live in the workspace toolbar instead. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('nominate')}
                >
                  <i className="ti ti-star me-2" />
                  Nominate Student
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </button>
                <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setExportOpen(false);
                        push('Export as PDF started');
                      }}
                    >
                      <i className="ti ti-file-type-pdf me-2" />
                      Export as PDF
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setExportOpen(false);
                        push('Export as Excel started');
                      }}
                    >
                      <i className="ti ti-file-type-xls me-2" />
                      Export as Excel
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setExportOpen(false);
                        push('Export as CSV started');
                      }}
                    >
                      <i className="ti ti-file-type-csv me-2" />
                      Export as CSV
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setExportOpen(false);
                        window.print();
                      }}
                    >
                      <i className="ti ti-printer me-2" />
                      Print Award Register
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Achievement
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Achievement Summary */}
          <AwardsSummary tiles={summaryTiles} />
          {/* /Achievement Summary */}

          {/* Student Awards Workspace */}
          <div className="data-workspace page-toolbar-compact">
            <div className="card">
              {/* Toolbar */}
              <AwardsToolbar
                search={search}
                onSearch={(value) => {
                  setSearch(value);
                  setPage(1);
                }}
                view={view}
                onView={(id) => {
                  setView(id);
                  setPage(1);
                }}
                filters={filters}
                onFilter={setFilter}
                onResetFilters={resetFilters}
                onApplyFilters={() => setOpenMenu(null)}
                fromDate={fromDate}
                onFromDate={setFromDate}
                toDate_={toDate}
                onToDate={setToDate}
                visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn}
                onShowAllColumns={showAllColumns}
                density={density}
                onDensity={setDensity}
                onRefresh={() => push('Award register refreshed')}
                fullscreen={fullscreen}
                onFullscreen={toggleFullscreen}
                quickFilter={quickFilter}
                onQuickFilter={(id) => {
                  setQuickFilter(id);
                  setPage(1);
                }}
                sort={sort}
                onSort={setSort}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={clearChip}
                matchCount={rows.length}
                totalCount={TOTAL_ACHIEVEMENTS}
              />
              {/* /Toolbar */}

              <AwardsTable
                rows={rows}
                visibleColumns={visibleColumns}
                density={density}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                expanded={expanded}
                onToggleExpand={toggleExpand}
                sort={sort}
                onSort={setSort}
                onOpenModal={openModal}
                onOpenPanel={openPanel}
              />

              <AwardsPagination
                from={from}
                to={to}
                total={TOTAL_ACHIEVEMENTS}
                academicYear={ACADEMIC_YEAR}
                rowsPerPage={rowsPerPage}
                onRowsPerPage={(value) => {
                  setRowsPerPage(value);
                  setPage(1);
                }}
                page={page}
                pageCount={pageCount}
                onPage={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
              />
            </div>
          </div>
          {/* /Student Awards Workspace */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <AwardModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onOpen={openModal}
        onOpenPanel={openPanel}
        onToast={push}
      />

      <AchievementPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        panel={achievementPanel}
        onOpenModal={openModal}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="awToast" />
    </>
  );
};

export default StudentAwards;
