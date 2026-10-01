import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import PerformancePanel from './components/PerformancePanel';
import PerformanceTable from './components/PerformanceTable';
import ReportToolbar from './components/ReportToolbar';
import type { ToolbarMenu } from './components/ReportToolbar';
import SelectionToolbar from './components/SelectionToolbar';
import SummaryStrip from './components/SummaryStrip';
import PerformanceModals from './modals/PerformanceModals';
import type {
  ColumnId,
  DensityId,
  PerformanceModalId,
  PerformanceRow,
  QuickFilterId,
  ReportTypeId,
  SortId,
} from './data/studentPerformance.data';
import {
  columnToggles,
  filterFields,
  moreFilterFields,
  performanceRows,
  quickFilters,
} from './data/studentPerformance.data';

const routes = all_routes;

const defaultFilters = () =>
  filterFields.reduce<Record<string, string>>((all, field) => {
    all[field.id] = field.selected ?? field.options[0];
    return all;
  }, {});

const defaultMoreFilters = () =>
  moreFilterFields.reduce<Record<string, string>>((all, field) => {
    all[field.id] = field.options[0];
    return all;
  }, {});

const allColumns = (visible: boolean) =>
  columnToggles.reduce<Record<ColumnId, boolean>>(
    (all, column) => {
      all[column.id] = visible;
      return all;
    },
    {} as Record<ColumnId, boolean>,
  );

/** Leading number of "1 of 46"; the withheld row sorts last. */
const rankValue = (row: PerformanceRow) => {
  const value = Number.parseInt(row.rank, 10);
  return Number.isNaN(value) ? Number.POSITIVE_INFINITY : value;
};

const numberValue = (value: string) => {
  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

/** "+3.3 vs Unit Test 1" / "−1.2 vs Unit Test 1" — the minus is U+2212. */
const growthValue = (row: PerformanceRow) => {
  const value = numberValue(row.scoreDelta.replace('−', '-'));
  return row.scoreDelta.startsWith('−') ? -Math.abs(value) : value;
};

const planStatus = (row: PerformanceRow) => {
  const status = row.detail.focusStats.find((stat) => stat.label === 'Plan Status');
  return status ? status.value : 'Not required';
};

const StudentPerformance = () => {
  /* ------------------------------- Band 1 & 2 ------------------------------- */
  const [reportType, setReportType] = useState<ReportTypeId>('repOverall');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [assessedBetween, setAssessedBetween] = useState('01/07/2026 - 31/07/2026');
  const [filters, setFilters] = useState<Record<string, string>>(defaultFilters);

  /* --------------------------------- Band 3 -------------------------------- */
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [savedView, setSavedView] = useState('all');
  const [scoreFrom, setScoreFrom] = useState('0');
  const [scoreTo, setScoreTo] = useState('100');
  const [moreFilters, setMoreFilters] = useState<Record<string, string>>(defaultMoreFilters);
  const [attentionOnly, setAttentionOnly] = useState(true);
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(() => allColumns(true));
  const [sort, setSort] = useState<SortId>('score');
  // The template's row order is the source of truth, so sorting only takes
  // over once the user picks an option from the Sort menu.
  const [sortApplied, setSortApplied] = useState(false);
  const [density, setDensity] = useState<DensityId>('default');
  const [fullscreen, setFullscreen] = useState(false);
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>('all');

  /* ---------------------------------- Grid --------------------------------- */
  // The template renders the bulk bar with three students already selected.
  const [selected, setSelected] = useState<string[]>(() =>
    performanceRows.slice(0, 3).map((row) => row.id),
  );
  const [expanded, setExpanded] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState('8');
  const [page, setPage] = useState('1');

  /* ------------------------------ Dialogs & UI ----------------------------- */
  const [activeModal, setActiveModal] = useState<PerformanceModalId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  }, []);

  useEffect(() => {
    const sync = () => setFullscreen(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const level = quickFilters.find((filter) => filter.id === quickFilter)?.level;
    const from = Number(scoreFrom);
    const to = Number(scoreTo);

    const list = performanceRows.filter((row) => {
      if (term && !`${row.name} ${row.admissionNo} ${row.classBadge}`.toLowerCase().includes(term)) {
        return false;
      }
      if (level && row.level !== level) return false;

      const className = filters.class;
      if (className && className !== 'All Classes' && !row.classBadge.startsWith(`${className} `)) {
        return false;
      }
      const section = filters.section;
      if (section && section !== 'All Sections' && !row.classBadge.endsWith(` ${section}`)) {
        return false;
      }
      const performanceLevel = filters['performance-level'];
      if (performanceLevel && performanceLevel !== 'All Levels' && row.level !== performanceLevel) {
        return false;
      }
      const grade = filters.grade;
      if (grade && grade !== 'All Grades' && row.grade !== grade) return false;

      const band = filters['attendance-band'];
      if (band && band !== 'All Bands' && row.attendanceBand !== band) return false;

      const plan = filters['improvement-plan'];
      if (plan && plan !== 'All' && planStatus(row) !== plan) return false;

      const score = numberValue(row.score);
      if (!Number.isNaN(from) && score < from) return false;
      if (!Number.isNaN(to) && score > to) return false;

      return true;
    });

    if (!sortApplied) return list;

    return [...list].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name);
      if (sort === 'rank') return rankValue(a) - rankValue(b);
      if (sort === 'attendance') return numberValue(b.attendance) - numberValue(a.attendance);
      if (sort === 'growth') return growthValue(b) - growthValue(a);
      return numberValue(b.score) - numberValue(a.score);
    });
  }, [search, quickFilter, filters, scoreFrom, scoreTo, sort, sortApplied]);

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => setSelected(checked ? rows.map((row) => row.id) : []),
    [rows],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const openPanel = useCallback(() => setPanelOpen(true), []);

  const openModal = useCallback((modal: PerformanceModalId) => {
    setPanelOpen(false);
    setActiveModal(modal);
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student Performance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Reports</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Performance
                  </li>
                </ol>
              </nav>
            </div>
            {/* Reference actions only. Everything that builds, filters or
                exports the report lives in the single toolbar below. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('compare')}
                >
                  <i className="ti ti-git-compare me-2" />
                  Compare
                </button>
              </div>
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('plan')}
                >
                  <i className="ti ti-progress-check me-2" />
                  Improvement Plans
                </button>
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={openPanel}
                >
                  <i className="ti ti-chart-histogram me-2" />
                  Performance Analysis
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Student Performance Workspace */}
          <div className="data-workspace page-toolbar-compact" data-density={density}>
            <ReportToolbar
              reportType={reportType}
              onReportType={setReportType}
              filtersOpen={filtersOpen}
              onToggleFilters={() => setFiltersOpen((open) => !open)}
              search={search}
              onSearch={setSearch}
              assessedBetween={assessedBetween}
              onAssessedBetween={setAssessedBetween}
              filters={filters}
              onFilter={(id, value) => setFilters((current) => ({ ...current, [id]: value }))}
              onResetFilters={() => {
                setFilters(defaultFilters());
                setSearch('');
                setAssessedBetween('01/07/2026 - 31/07/2026');
              }}
              onRefresh={() => {
                setExpanded([]);
                push('Report refreshed');
              }}
              openMenu={openMenu}
              onOpenMenu={setOpenMenu}
              savedView={savedView}
              onSavedView={(id) => {
                setSavedView(id);
                setOpenMenu(null);
              }}
              onSaveCurrentView={() => {
                setOpenMenu(null);
                push('View saved');
              }}
              scoreFrom={scoreFrom}
              scoreTo={scoreTo}
              onScore={(key, value) => (key === 'from' ? setScoreFrom(value) : setScoreTo(value))}
              moreFilters={moreFilters}
              onMoreFilter={(id, value) =>
                setMoreFilters((current) => ({ ...current, [id]: value }))
              }
              attentionOnly={attentionOnly}
              onAttentionOnly={setAttentionOnly}
              onResetMore={() => {
                setMoreFilters(defaultMoreFilters());
                setScoreFrom('0');
                setScoreTo('100');
                setAttentionOnly(true);
              }}
              onApplyMore={() => setOpenMenu(null)}
              columns={columns}
              onToggleColumn={(id) =>
                setColumns((current) => ({ ...current, [id]: !current[id] }))
              }
              onShowAllColumns={() => setColumns(allColumns(true))}
              sort={sort}
              onSort={(id) => {
                setSort(id);
                setSortApplied(true);
                setOpenMenu(null);
              }}
              density={density}
              onDensity={setDensity}
              fullscreen={fullscreen}
              onFullscreen={toggleFullscreen}
              quickFilter={quickFilter}
              onQuickFilter={setQuickFilter}
              onOpenModal={openModal}
            />
            {/* /Report Toolbar */}

            {/* Report Results */}
            <div className="card">
              <SummaryStrip />
              <SelectionToolbar
                count={selected.length}
                onOpenModal={openModal}
                onAction={(label) => push(`${label} started`)}
              />
              <PerformanceTable
                rows={rows}
                columns={columns}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                expanded={expanded}
                onToggleExpand={toggleExpand}
                onOpenModal={openModal}
                onOpenPanel={openPanel}
                pageSize={pageSize}
                onPageSize={setPageSize}
                page={page}
                onPage={setPage}
              />
            </div>
          </div>
          {/* /Student Performance Workspace */}
        </div>
      </div>

      <PerformanceModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onOpen={openModal}
        onOpenPanel={openPanel}
        onToast={push}
      />

      <Offcanvas
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title="Performance Details"
        labelledById="sp_panel_lbl"
      >
        <PerformancePanel onOpenModal={openModal} />
      </Offcanvas>

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default StudentPerformance;
