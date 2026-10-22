import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import ScheduleSkeleton from './components/ScheduleSkeleton';
import ScheduleToolbar from './components/ScheduleToolbar';
import type { FilterChip } from './components/ScheduleToolbar';
import ScheduleTable from './components/ScheduleTable';
import WorkspaceFooter from './components/WorkspaceFooter';
import ScheduleModals from './modals/ScheduleModals';
import type { ScheduleDraft } from './modals/ScheduleModals';
import type {
  BulkAction,
  ColumnId,
  DensityId,
  FilterKey,
  RowMenuItem,
  ScheduleModalId,
  ScheduleRow,
  ScheduleStatus,
  SortKey,
  ToolbarMenu,
} from './data/scheduleExam.data';
import {
  actionToasts,
  advancedFilters,
  allColumns,
  exportActions,
  quickFilters,
  savedViews,
  scheduleRows,
  strings,
  withStatus,
} from './data/scheduleExam.data';

const routes = all_routes;

const REVEAL_MS = 850;
const REFRESH_MS = 700;

/** Facets whose option values are fragments of the `data-search` haystack. */
const HAYSTACK_FACETS: FilterKey[] = ['class', 'section', 'date'];

const facetValue = (row: ScheduleRow, key: FilterKey): string => {
  switch (key) {
    case 'year':
      return row.year;
    case 'exam':
      return row.name;
    case 'subject':
      return row.subject;
    case 'room':
      return row.hall;
    case 'invigilator':
      return row.invigilator.name;
    case 'status':
      return row.status;
    case 'class':
      return row.className;
    case 'section':
      return row.section;
    case 'date':
    default:
      return row.date;
  }
};

const sortValue = (row: ScheduleRow, key: SortKey): string | number => {
  switch (key) {
    case 'subject':
      return row.subject.toLowerCase();
    case 'teacher':
      return row.invigilator.name.toLowerCase();
    // The engine parsed the printed date cell, so "13 May 2024" sorts chronologically.
    case 'date':
      return new Date(row.date).getTime() || 0;
    case 'students':
      return row.students;
    case 'status':
      return row.status.toLowerCase();
    case 'name':
    default:
      return row.name.toLowerCase();
  }
};

const ExamSchedule = () => {
  /* ---------------------------------- State --------------------------------- */
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [columns, setColumns] = useState<Record<ColumnId, boolean>>(allColumns);
  const [density, setDensity] = useState<DensityId>('default');
  const [sort, setSort] = useState<SortKey>('recent');
  const [sortAsc, setSortAsc] = useState(true);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const [roster, setRoster] = useState<ScheduleRow[]>(scheduleRows);
  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState('10');

  const [activeModal, setActiveModal] = useState<ScheduleModalId | null>(null);
  const [modalSchedule, setModalSchedule] = useState<ScheduleRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | 'bulk' | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  useEffect(() => {
    if (!exportOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  useEffect(() => {
    if (!rowMenuOpen) return;
    const handlePointerDown = () => setRowMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [rowMenuOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    const matches = roster.filter((row) => {
      if (term && !row.search.includes(term)) return false;
      if (view !== 'all' && row.status !== view) return false;

      return advancedFilters.every((field) => {
        const wanted = filters[field.key];
        if (!wanted) return true;
        if (HAYSTACK_FACETS.includes(field.key)) return row.search.includes(wanted.toLowerCase());
        return facetValue(row, field.key) === wanted;
      });
    });

    // "Recently updated" is the order the rows ship in, so it never re-sorts.
    if (sort === 'recent') return matches;

    return [...matches].sort((a, b) => {
      const left = sortValue(a, sort);
      const right = sortValue(b, sort);
      if (left < right) return sortAsc ? -1 : 1;
      if (left > right) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [roster, search, view, filters, sort, sortAsc]);

  /* --------------------------------- Paging --------------------------------- */

  const size = Number(pageSize);
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * size + 1;
  const rangeTo = Math.min(currentPage * size, filtered.length);

  useEffect(() => setPage(1), [search, view, filters, pageSize]);

  /* --------------------------------- Counts --------------------------------- */

  const tally = useCallback(
    (id: string) => (id === 'all' ? roster.length : roster.filter((row) => row.status === id).length),
    [roster],
  );

  const viewCounts = useMemo(
    () =>
      savedViews.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = tally(item.id);
        return acc;
      }, {}),
    [tally],
  );

  const quickCounts = useMemo(
    () =>
      quickFilters.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = tally(item.id);
        return acc;
      }, {}),
    [tally],
  );

  const chips: FilterChip[] = useMemo(
    () =>
      advancedFilters.reduce<FilterChip[]>((list, field) => {
        const value = filters[field.key];
        if (!value) return list;
        const option = field.options.find((item) => item.value === value);
        list.push({ id: field.key, label: `${field.label}: ${option?.label ?? value}` });
        return list;
      }, []),
    [filters],
  );

  /* --------------------------------- Handlers ------------------------------- */

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  /** Print is offered in four places; all of them toast first, then hand off to the browser. */
  const handlePrint = () => {
    runAction('print');
    window.print();
  };

  const resetFilters = () => {
    setSearch('');
    setView('all');
    setFilters({});
    push(actionToasts.clear_filters);
  };

  const handleSort = (key: SortKey) => {
    if (sort === key) {
      setSortAsc((value) => !value);
      push(`Sorted by ${key} · ${sortAsc ? 'descending' : 'ascending'}`, 'info');
      return;
    }
    setSort(key);
    setSortAsc(true);
    push(key === 'recent' ? strings.recentSort : `Sorted by ${key} · ascending`, 'info');
  };

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const toggleExpand = (id: string) =>
    setExpanded((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const pageIds = pageRows.map((row) => row.id);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.includes(id));
  const someChecked = pageIds.some((id) => selected.includes(id));

  const toggleAll = (checked: boolean) =>
    setSelected((current) =>
      checked ? Array.from(new Set([...current, ...pageIds])) : current.filter((id) => !pageIds.includes(id)),
    );

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const openModal = useCallback((modal: ScheduleModalId, row: ScheduleRow | null = null) => {
    setModalSchedule(row);
    setActiveModal(modal);
  }, []);
  const closeModal = () => setActiveModal(null);

  const setStatus = (ids: string[], status: ScheduleStatus) =>
    setRoster((current) => current.map((row) => (ids.includes(row.id) ? withStatus(row, status) : row)));

  /** The engine numbered new schedules from the end of the list. */
  const nextCode = (count: number) => `ES2405${String(count + 1).padStart(2, '0')}`;

  const haystack = (row: ScheduleRow) =>
    `${row.name} ${row.id} ${row.type} ${row.year} class ${row.className} sec ${row.section} ${row.subject} ${row.coordinator.name} ${row.invigilator.name} ${row.status} ${row.date} ${row.hall}`.toLowerCase();

  const handleBulkAction = (action: BulkAction) => {
    if (action.modal === 'delete') {
      setPendingDelete('bulk');
      openModal('delete');
      return;
    }
    if (action.id === 'print') {
      handlePrint();
      return;
    }
    if (action.id === 'archive') {
      setStatus(selected, 'Archived');
      setSelected([]);
    }
    if (action.id === 'publish_schedule') setStatus(selected, 'Scheduled');
    runAction(action.id);
  };

  const handleRowMenuAction = (item: RowMenuItem, row: ScheduleRow) => {
    if (item.modal === 'delete') {
      setPendingDelete(row.id);
      openModal('delete');
      return;
    }
    if (item.modal) {
      openModal(item.modal, row);
      return;
    }
    if (item.id === 'print') {
      handlePrint();
      return;
    }
    if (item.id === 'archive') {
      setStatus([row.id], 'Archived');
      runAction('archive');
      return;
    }
    if (item.id === 'publish') {
      setStatus([row.id], 'Scheduled');
      runAction('publish');
      return;
    }
    if (item.id === 'duplicate') {
      setRoster((current) => {
        const copy = withStatus({ ...row, id: nextCode(current.length) }, 'Draft');
        return [...current, { ...copy, search: haystack(copy) }];
      });
      runAction('duplicate');
      return;
    }
    runAction(item.id, `${item.label} — ${row.name}`);
  };

  const handleAdd = (draft: ScheduleDraft) => {
    const template = roster[0];
    const line = draft.lines[0];
    const name = draft.examName === 'Select' ? 'New Exam Schedule' : draft.examName;
    const id = nextCode(roster.length);

    const seeded: ScheduleRow = {
      ...template,
      id,
      name,
      type: name,
      className: draft.className.trim() || template.className,
      section: draft.section === 'Select' ? template.section : draft.section,
      subject: line.subject === 'Select' ? template.subject : line.subject,
      date: line.date === 'Select' ? template.date : line.date,
      startTime: draft.startTime === 'Select' ? template.startTime : draft.startTime,
      endTime: draft.endTime === 'Select' ? template.endTime : draft.endTime,
      hall: line.room === 'Select' ? template.hall : `Room ${line.room}`,
      totalMarks: line.maxMarks === 'Select' ? template.totalMarks : Number(line.maxMarks),
      passMarks: line.minMarks === 'Select' ? template.passMarks : Number(line.minMarks),
      paperStatus: 'Not Ready',
      remarks: 'Draft — hall allocation and question paper not finalised.',
    };

    const row = withStatus(seeded, 'Draft');
    setRoster((current) => [{ ...row, search: haystack(row) }, ...current]);
    push(`${name} added successfully`);
  };

  const handleSave = (id: string, draft: ScheduleDraft) => {
    const line = draft.lines[0];
    setRoster((current) =>
      current.map((row) => {
        if (row.id !== id) return row;
        const next: ScheduleRow = {
          ...row,
          className: draft.className.trim() || row.className,
          section: draft.section === 'Select' ? row.section : draft.section,
          startTime: draft.startTime === 'Select' ? row.startTime : draft.startTime,
          endTime: draft.endTime === 'Select' ? row.endTime : draft.endTime,
          subject: line.subject === 'Select' ? row.subject : line.subject,
          date: line.date === 'Select' ? row.date : line.date,
          totalMarks: line.maxMarks === 'Select' ? row.totalMarks : Number(line.maxMarks),
          passMarks: line.minMarks === 'Select' ? row.passMarks : Number(line.minMarks),
        };
        return { ...next, search: haystack(next) };
      }),
    );
    push('Exam schedule updated');
  };

  const confirmDelete = () => {
    if (pendingDelete === 'bulk') {
      setRoster((current) => current.filter((row) => !selected.includes(row.id)));
      push(`${selected.length} schedule(s) deleted`);
      setSelected([]);
    } else if (pendingDelete) {
      setRoster((current) => current.filter((row) => row.id !== pendingDelete));
      setSelected((current) => current.filter((item) => item !== pendingDelete));
      push('Exam schedule deleted');
    }
    setPendingDelete(null);
    closeModal();
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Exam Schedule</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Exam Schedule
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid tools (search, filters, columns,
                density, refresh) live in the workspace toolbar instead. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import')}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </Link>
              </div>
              <div className="dropdown me-2 mb-2" ref={exportRef}>
                <Link
                  to="#"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </Link>
                <ul className={`dropdown-menu dropdown-menu-end p-3${exportOpen ? ' show' : ''}`}>
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
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={handlePrint}
                >
                  <i className="ti ti-printer me-2" />
                  Print Schedule
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Exam Schedule
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Exam Schedule Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              {!loading ? (
                <ScheduleToolbar
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(next) => {
                    setView(next);
                    const label = savedViews.find((item) => item.id === next)?.label ?? 'All Schedules';
                    push(`${tally(next)}${strings.viewMatch}${label}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  quickCounts={quickCounts}
                  filters={filters}
                  onFilter={(key, value) => {
                    setFilters((current) => ({ ...current, [key]: value }));
                    push(`${filtered.length}${strings.filterMatch}`, 'info');
                  }}
                  onResetFilters={resetFilters}
                  onApplyFilters={() => push(`${filtered.length}${strings.applyMatch}`)}
                  columns={columns}
                  onColumn={(id, visible) => {
                    setColumns((current) => ({ ...current, [id]: visible }));
                    push(`${visible ? 'Showing' : 'Hiding'} the ${id} column.`, 'info');
                  }}
                  onResetColumns={() => {
                    setColumns(allColumns);
                    push(actionToasts.reset_columns);
                  }}
                  density={density}
                  onDensity={setDensity}
                  matchCount={filtered.length}
                  totalCount={roster.length}
                  sort={sort}
                  onSort={handleSort}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={(id) => setFilters((current) => ({ ...current, [id]: '' }))}
                  onRefresh={refresh}
                  onPrint={handlePrint}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => {
                    const next = !fullscreen;
                    setFullscreen(next);
                    push(next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
                  }}
                  onSaveView={() => runAction('save_view')}
                />
              ) : null}

              {loading ? <ScheduleSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  <BulkActionBar
                    count={selected.length}
                    onAction={handleBulkAction}
                    onClear={() => setSelected([])}
                  />

                  {pageRows.length > 0 ? (
                    <ScheduleTable
                      rows={pageRows}
                      columns={columns}
                      sort={sort}
                      sortAsc={sortAsc}
                      onSort={handleSort}
                      selected={selected}
                      onToggleSelect={toggleSelect}
                      allChecked={allChecked}
                      someChecked={someChecked}
                      onToggleAll={toggleAll}
                      expanded={expanded}
                      onToggleExpand={toggleExpand}
                      openMenu={rowMenuOpen}
                      onOpenMenu={setRowMenuOpen}
                      onView={(row) => {
                        runAction('view');
                        openModal('view', row);
                      }}
                      onEdit={(row) => openModal('edit', row)}
                      onMenuAction={handleRowMenuAction}
                    />
                  ) : null}

                  <div className={`workspace-empty-state${filtered.length === 0 ? ' show' : ''}`} id="clsEmpty">
                    <div className="workspace-empty-art">
                      <i className="ti ti-calendar-off" />
                    </div>
                    <h5>No exam schedules match your filters</h5>
                    <p>Try adjusting your search terms or clearing the active filters to see more results.</p>
                    <button type="button" className="btn btn-primary" onClick={resetFilters}>
                      <i className="ti ti-rotate me-1" />
                      Reset filters
                    </button>
                  </div>

                  <WorkspaceFooter
                    rangeFrom={rangeFrom}
                    rangeTo={rangeTo}
                    total={filtered.length}
                    pageSize={pageSize}
                    onPageSize={setPageSize}
                    page={currentPage}
                    pageCount={pageCount}
                    onPage={(next) => {
                      setPage(next);
                      push(actionToasts.page, 'info');
                    }}
                  />
                </div>
              ) : null}

              <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
            </div>
          </div>
          {/* /Exam Schedule Workspace */}
        </div>
      </div>

      <ScheduleModals
        active={activeModal}
        schedule={modalSchedule}
        selectedCount={pendingDelete === 'bulk' ? selected.length : 1}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
        onPrint={handlePrint}
      />
    </>
  );
};

export default ExamSchedule;
