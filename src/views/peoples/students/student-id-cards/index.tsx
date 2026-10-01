import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import IdCardPanel from './components/IdCardPanel';
import IdCardSummary from './components/IdCardSummary';
import IdCardsTable from './components/IdCardsTable';
import IdCardsToolbar from './components/IdCardsToolbar';
import type { ToolbarMenu } from './components/IdCardsToolbar';
import IdCardModals from './modals/IdCardModals';
import type { IdCard, IdCardAction, IdCardModalId } from './data/idCards.data';
import { idCards } from './data/idCards.data';
import type { Density, SortKey } from './data/idCardsWorkspace.data';
import {
  columnOptions,
  defaultFromDate,
  defaultToDate,
  filterFields,
  pageNumbers,
  pageSizes,
  summaryStats,
} from './data/idCardsWorkspace.data';

const routes = all_routes;

/** The template's export menu. */
const exportItems = [
  { id: 'pdf', icon: 'ti ti-file-type-pdf', label: 'Export as PDF' },
  { id: 'excel', icon: 'ti ti-file-type-xls', label: 'Export as Excel' },
  { id: 'csv', icon: 'ti ti-file-type-csv', label: 'Export as CSV' },
  { id: 'register', icon: 'ti ti-printer', label: 'Print Issue Register' },
];

const allColumnsVisible = columnOptions.reduce<Record<string, boolean>>((acc, column) => {
  acc[column.id] = true;
  return acc;
}, {});

const CLASS_ORDER = ['Class II', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class IX', 'Class X'];

/** "12 Jun 2026" sorts by date; the em dash placeholder sorts last. */
const dateValue = (value: string) => {
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
};

const compareBy = (sort: SortKey) => (a: IdCard, b: IdCard) => {
  switch (sort) {
    case 'name':
      return a.name.localeCompare(b.name) || a.cardNo.localeCompare(b.cardNo);
    case 'class':
      return (
        CLASS_ORDER.indexOf(a.className) - CLASS_ORDER.indexOf(b.className) ||
        a.section.localeCompare(b.section)
      );
    case 'generated':
      return dateValue(a.generated.date) - dateValue(b.generated.date);
    case 'issue':
      return a.issueStatus.label.localeCompare(b.issueStatus.label);
    case 'card':
    default:
      return a.cardNo.localeCompare(b.cardNo);
  }
};

/** Saved views and quick filters, as their labels describe them. */
const matchesShortcut = (card: IdCard, id: string) => {
  switch (id) {
    case 'printed':
      return card.cardStatus.label === 'Printed' || card.cardStatus.label === 'Reprinted';
    case 'issued':
      return (
        card.issueStatus.label === 'Issued' || card.issueStatus.label === 'Replacement Issued'
      );
    case 'pending':
      return card.issueStatus.label === 'Pending Print';
    case 'awaiting':
      return card.cardStatus.label === 'Print Queued';
    case 'replacements':
      return card.issueStatus.label === 'Replacement Issued' || card.cardStatus.label === 'Superseded';
    case 'noPhoto':
      return card.photograph === 'Not on file';
    case 'all':
    default:
      return true;
  }
};

const StudentIdCards = () => {
  const [rows, setRows] = useState<IdCard[]>(idCards);

  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [filters, setFilters] = useState<Record<string, string>>({ 'academic-year': '2026-2027' });
  const [fromDate, setFromDate] = useState(defaultFromDate);
  const [toDate, setToDate] = useState(defaultToDate);
  const [columns, setColumns] = useState<Record<string, boolean>>(allColumnsVisible);
  const [density, setDensity] = useState<Density>('default');
  const [sort, setSort] = useState<SortKey>('card');
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [page, setPage] = useState(pageNumbers[0]);

  const [activeModal, setActiveModal] = useState<IdCardModalId | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows
      .filter((card) => {
        if (term) {
          const haystack = `${card.name} ${card.admissionNo} ${card.cardNo}`.toLowerCase();
          if (!haystack.includes(term)) return false;
        }
        if (!matchesShortcut(card, view)) return false;
        if (!matchesShortcut(card, quickFilter)) return false;

        if (filters.class && card.className !== filters.class) return false;
        if (filters.section && card.section !== filters.section) return false;
        if (filters['academic-year'] && card.academicYear !== filters['academic-year']) return false;
        if (filters['card-status'] && card.cardStatus.label !== filters['card-status']) return false;
        if (filters['issue-status'] && card.issueStatus.label !== filters['issue-status']) {
          return false;
        }
        if (filters.house && card.house !== filters.house) return false;

        return true;
      })
      .sort(compareBy(sort));
  }, [rows, search, view, quickFilter, filters, sort]);

  const shown = filtered.slice(0, Number(pageSize));

  /* ----------------------------- Toolbar plumbing ---------------------------- */

  const chips = useMemo(
    () =>
      filterFields
        .filter((field) => filters[field.id])
        .map((field) => ({
          id: field.id,
          // The template writes this one chip in sentence case.
          label: `${field.id === 'academic-year' ? 'Academic year' : field.label}: ${filters[field.id]}`,
        })),
    [filters],
  );

  const setFilter = useCallback(
    (id: string, value: string) => setFilters((current) => ({ ...current, [id]: value })),
    [],
  );

  const resetFilters = useCallback(() => {
    setFilters({});
    setFromDate(defaultFromDate);
    setToDate(defaultToDate);
  }, []);

  const clearChip = useCallback(
    (id: string) => setFilters((current) => ({ ...current, [id]: '' })),
    [],
  );

  // The template's refresh button had no script; here it re-seeds the table.
  const refresh = useCallback(() => {
    setRows(idCards);
    setExpanded([]);
    push('ID cards refreshed');
  }, [push]);

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

  /* ------------------------------- Row plumbing ------------------------------ */

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => setSelected(checked ? shown.map((card) => card.id) : []),
    [shown],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const handleAction = useCallback((action: IdCardAction) => {
    if (action === 'panel') {
      setActiveModal(null);
      setPanelOpen(true);
      return;
    }
    setActiveModal(action);
  }, []);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Student ID Cards</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.studentGrid}>Students</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student ID Cards
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
                  onClick={() => setActiveModal('print')}
                >
                  <i className="ti ti-printer me-2" />
                  Print Cards
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
                  {exportItems.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          push(`${item.label} started`);
                        }}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => setActiveModal('bulkGenerate')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Generate ID Cards
                </button>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* ID Card Summary */}
          <IdCardSummary stats={summaryStats} />
          {/* /ID Card Summary */}

          {/* Student ID Cards Workspace */}
          <div className="data-workspace page-toolbar-compact" data-density={density}>
            <div className="card">
              {/* Toolbar */}
              <IdCardsToolbar
                search={search}
                onSearch={setSearch}
                view={view}
                onView={setView}
                filters={filters}
                onFilter={setFilter}
                onResetFilters={resetFilters}
                fromDate={fromDate}
                onFromDate={setFromDate}
                toDate={toDate}
                onToDate={setToDate}
                columns={columns}
                onColumn={(id, visible) =>
                  setColumns((current) => ({ ...current, [id]: visible }))
                }
                onShowAllColumns={() => setColumns(allColumnsVisible)}
                density={density}
                onDensity={setDensity}
                onRefresh={refresh}
                fullscreen={fullscreen}
                onFullscreen={toggleFullscreen}
                quickFilter={quickFilter}
                onQuickFilter={setQuickFilter}
                sort={sort}
                onSort={setSort}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
                chips={chips}
                onClearChip={clearChip}
                matchCount={filtered.length}
              />
              {/* /Toolbar */}

              <IdCardsTable
                cards={shown}
                selected={selected}
                onToggleSelect={toggleSelect}
                onToggleAll={toggleAll}
                expanded={expanded}
                onToggleExpand={toggleExpand}
                columns={columns}
                onAction={handleAction}
                sort={sort}
                pageSize={pageSize}
                onPageSize={setPageSize}
                page={page}
                onPage={setPage}
              />
            </div>
          </div>
          {/* /Student ID Cards Workspace */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <IdCardModals
        active={activeModal}
        onClose={() => setActiveModal(null)}
        onOpen={setActiveModal}
        onOpenPanel={() => {
          setActiveModal(null);
          setPanelOpen(true);
        }}
        onToast={push}
      />

      <IdCardPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onPrint={() => {
          setPanelOpen(false);
          setActiveModal('print');
        }}
        onPreview={() => {
          setPanelOpen(false);
          setActiveModal('preview');
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default StudentIdCards;
