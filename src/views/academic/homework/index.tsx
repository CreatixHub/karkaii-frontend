import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import BulkActionBar from './components/BulkActionBar';
import HomeworkSkeleton from './components/HomeworkSkeleton';
import HomeworkTable from './components/HomeworkTable';
import HomeworkTabs from './components/HomeworkTabs';
import HomeworkToolbar from './components/HomeworkToolbar';
import type { FilterChip } from './components/HomeworkToolbar';
import WorkspaceFooter from './components/WorkspaceFooter';
import HomeworkModals from './modals/HomeworkModals';
import type {
  FeedbackDraft,
  GradeDraft,
  HomeworkDraft,
} from './modals/HomeworkModals';
import type {
  BulkAction,
  DensityId,
  FilterKey,
  HomeworkModalId,
  RowMenuItem,
  SortKey,
  TabId,
  TabRow,
  ToolbarMenu,
  TrackingRow,
} from './data/homework.data';
import {
  HAYSTACK_FACETS,
  actionToasts,
  exportActions,
  inspectorActivity,
  inspectorNotes,
  inspectorStudents,
  pageSizes,
  strings,
  tabs,
} from './data/homework.data';

const routes = all_routes;

/** `tables.js` reveals its workspace after this long. */
const REVEAL_MS = 850;
const REFRESH_MS = 600;

/** Every row shape carries a lower-cased `search` haystack. */
const haystackOf = (row: TabRow): string => row.search;

/** The value a facet compares against, per row shape. */
const facetValue = (row: TabRow, key: FilterKey): string => {
  switch (key) {
    case 'year':
      return row.kind === 'homework' ? row.year : '';
    case 'subject':
      return 'subject' in row ? row.subject : '';
    case 'teacher':
      return row.kind === 'homework' ? row.teacher : row.kind === 'submission' ? row.teacher : '';
    case 'status':
      return row.kind === 'homework' ? row.status : '';
    case 'priority':
      return row.kind === 'homework' ? row.priority : '';
    case 'type':
      return row.kind === 'submission' ? row.type : row.kind === 'homework' ? row.type : '';
    case 'review':
      return row.kind === 'submission' ? row.review : '';
    case 'approval':
      return row.kind === 'late' ? row.approval : '';
    case 'final':
      return row.kind === 'late' ? row.final : '';
    case 'reason':
      return row.kind === 'late' ? row.reason : '';
    case 'submission':
      return row.kind === 'homework' ? row.status : '';
    default:
      return '';
  }
};

const sortValue = (row: TabRow, key: SortKey): string | number => {
  switch (key) {
    case 'name':
    case 'homework':
      return row.kind === 'submission'
        ? row.homework.toLowerCase()
        : row.kind === 'late'
          ? row.homework.toLowerCase()
          : row.name.toLowerCase();
    case 'student':
      return row.kind === 'submission' || row.kind === 'late' ? row.student.toLowerCase() : '';
    case 'subject':
      return 'subject' in row ? row.subject.toLowerCase() : '';
    case 'teacher':
      return row.kind === 'homework' ? row.teacher.toLowerCase() : '';
    case 'submitted':
      return row.kind === 'homework' || row.kind === 'tracking' ? row.submitted : 0;
    case 'status':
      return row.kind === 'homework' ? row.status.toLowerCase() : '';
    case 'completion':
      return row.kind === 'tracking' ? row.completion : 0;
    case 'pending':
      return row.kind === 'tracking' || row.kind === 'homework' ? row.pending : 0;
    case 'score':
      return row.kind === 'tracking' ? row.score : 0;
    case 'date':
      return row.kind === 'submission' ? new Date(row.date).getTime() || 0 : 0;
    case 'grade':
      return row.kind === 'submission' ? row.grade : '';
    case 'review':
      return row.kind === 'submission' ? row.review : '';
    case 'delay':
      return row.kind === 'late' ? row.delayDays : 0;
    case 'deducted':
      return row.kind === 'late' ? row.deductedValue : 0;
    case 'final':
      return row.kind === 'late' ? row.final : '';
    default:
      return 0;
  }
};

const Homework = () => {
  const navigate = useNavigate();

  /* ---------------------------------- State --------------------------------- */
  const [tabId, setTabId] = useState<TabId>('homework');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [hiddenColumns, setHiddenColumns] = useState<string[]>([]);
  const [density, setDensity] = useState<DensityId>('default');
  const [sort, setSort] = useState<SortKey>('recent');
  const [sortAsc, setSortAsc] = useState(true);

  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [rowMenuOpen, setRowMenuOpen] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [fullscreen, setFullscreen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [activeModal, setActiveModal] = useState<HomeworkModalId | null>(null);
  const [activeRow, setActiveRow] = useState<TabRow | null>(null);
  const [inspected, setInspected] = useState<TrackingRow | null>(null);

  const exportRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  const tab = useMemo(() => tabs.find((entry) => entry.id === tabId) ?? tabs[0], [tabId]);

  /* ------------------------------ Derived rows ------------------------------ */

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();

    const matches = tab.rows.filter((row) => {
      if (needle && !haystackOf(row).includes(needle)) return false;

      // Saved views and quick filters share ids; "all" never narrows.
      if (view !== 'all' && !haystackOf(row).includes(view.toLowerCase())) return false;

      return (Object.entries(filters) as [FilterKey, string][]).every(([key, value]) => {
        if (!value) return true;
        // Some facet values are fragments of the row's own `data-search` haystack.
        if (HAYSTACK_FACETS.includes(key)) return haystackOf(row).includes(value.toLowerCase());
        return facetValue(row, key) === value;
      });
    });

    // "Recently assigned" is the order the rows ship in, so it never re-sorts.
    if (sort === 'recent') return matches;

    return [...matches].sort((a, b) => {
      const left = sortValue(a, sort);
      const right = sortValue(b, sort);
      if (left < right) return sortAsc ? -1 : 1;
      if (left > right) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [tab, search, view, filters, sort, sortAsc]);

  /* --------------------------------- Paging --------------------------------- */

  const size = Number(pageSize) || 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / size));
  const currentPage = Math.min(page, pageCount);
  const pageRows = filtered.slice((currentPage - 1) * size, currentPage * size);
  const rangeFrom = filtered.length === 0 ? 0 : (currentPage - 1) * size + 1;
  const rangeTo = Math.min(currentPage * size, filtered.length);

  /* --------------------------------- Counts --------------------------------- */

  const viewCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tab.savedViews.forEach((entry) => {
      counts[entry.id] =
        entry.id === 'all'
          ? tab.rows.length
          : tab.rows.filter((row) => haystackOf(row).includes(entry.id.toLowerCase())).length;
    });
    return counts;
  }, [tab]);

  const chips = useMemo<FilterChip[]>(
    () =>
      (Object.entries(filters) as [FilterKey, string][])
        .filter(([, value]) => Boolean(value))
        .map(([key, value]) => {
          const field = tab.filters.find((entry) => entry.key === key);
          const option = field?.options.find((entry) => entry.value === value);
          return { id: key, label: `${field?.label ?? key}: ${option?.label ?? value}` };
        }),
    [filters, tab],
  );

  /* -------------------------------- Selection ------------------------------- */

  const rowKey = (row: TabRow) => row.id;
  const allChecked = pageRows.length > 0 && pageRows.every((row) => selected.includes(rowKey(row)));
  const someChecked = pageRows.some((row) => selected.includes(rowKey(row))) && !allChecked;

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }, []);

  const toggleAll = useCallback(
    (checked: boolean) => {
      const ids = pageRows.map(rowKey);
      setSelected((current) =>
        checked
          ? [...new Set([...current, ...ids])]
          : current.filter((entry) => !ids.includes(entry)),
      );
    },
    [pageRows],
  );

  const toggleExpand = useCallback((id: string) => {
    setExpanded((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  }, []);

  /* --------------------------------- Actions -------------------------------- */

  const refresh = useCallback(() => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  }, [push]);

  const printList = useCallback(() => {
    push(actionToasts.print);
    window.setTimeout(() => window.print(), 60);
  }, [push]);

  const handleSort = useCallback(
    (key: SortKey) => {
      setSort((current) => {
        if (current === key) {
          // Clicking the active header flips the direction, as `tables.js` did.
          setSortAsc((asc) => !asc);
          return current;
        }
        setSortAsc(true);
        return key;
      });
      if (key === 'recent') {
        push(strings.recentSort, 'info');
        return;
      }
      const option = tab.sortOptions.find((entry) => entry.id === key);
      push(`Sorted by ${option?.label ?? key}.`);
    },
    [tab, push],
  );

  /** Switching tabs invalidates everything keyed to the old tab's columns. */
  const handleTab = useCallback((id: TabId) => {
    setTabId(id);
    setSelected([]);
    setExpanded([]);
    setFilters({});
    setHiddenColumns([]);
    setSort('recent');
    setSortAsc(true);
    setView('all');
    setPage(1);
    setRowMenuOpen(null);
  }, []);

  const openModal = useCallback((modal: HomeworkModalId, row: TabRow | null) => {
    setActiveRow(row);
    setActiveModal(modal);
    setRowMenuOpen(null);
  }, []);

  const gotoRoute = useCallback(
    (key: string) => {
      const path = (routes as Record<string, string>)[key];
      if (path) navigate(path);
    },
    [navigate],
  );

  /** The row kebab menu — some entries open a dialog, some navigate, the rest toast. */
  const handleMenuAction = useCallback(
    (item: RowMenuItem, row: TabRow) => {
      setRowMenuOpen(null);

      if (item.modal) {
        openModal(item.modal, row);
        return;
      }
      if (item.route) {
        push(actionToasts[item.id] ?? 'Opening…');
        gotoRoute(item.route);
        return;
      }
      if (item.id === 'print') {
        printList();
        return;
      }
      push(actionToasts[item.id] ?? 'Done.');
    },
    [openModal, push, gotoRoute, printList],
  );

  /** The inline icon buttons in each grid's Actions cell. */
  const handleAction = useCallback(
    (id: string, row: TabRow) => {
      switch (id) {
        case 'analytics':
          openModal('analytics', row);
          break;
        case 'submission':
          openModal('submission', row);
          break;
        case 'feedback':
          openModal('feedback', row);
          break;
        case 'grade':
          push(actionToasts.grade);
          gotoRoute('marksEntry');
          break;
        default:
          push(actionToasts[id] ?? 'Done.');
      }
    },
    [openModal, push, gotoRoute],
  );

  const handleBulkAction = useCallback(
    (action: BulkAction) => {
      if (action.modal) {
        setActiveRow(null);
        setActiveModal(action.modal);
        return;
      }
      if (action.id === 'print') {
        printList();
        return;
      }
      push(actionToasts[action.id] ?? 'Done.');
      setSelected([]);
    },
    [push, printList],
  );

  const handleConfirmDelete = useCallback(() => {
    setActiveModal(null);
    setSelected([]);
    push('Selected homework deleted.');
  }, [push]);

  /* -------------------------------- Shortcuts ------------------------------- */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && fullscreen) setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  // Close the page-header export menu on an outside click.
  useEffect(() => {
    if (!exportOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen]);

  // A narrowing filter can strip the page you were on out of existence.
  useEffect(() => setPage(1), [search, view, filters, tabId]);

  /* --------------------------------- Render --------------------------------- */

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Homework</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Homework
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
                  onClick={() => openModal('import', null)}
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
                          push(actionToasts[action.id] ?? 'Preparing export…');
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
                  onClick={printList}
                >
                  <i className="ti ti-printer me-2" />
                  Print
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary btn-sm d-flex align-items-center"
                  onClick={() => openModal('add', null)}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Home Work
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Homework Workspace */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen card-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
            >
              <HomeworkTabs tabs={tabs} active={tabId} onChange={handleTab} />

              {!loading ? (
                <HomeworkToolbar
                  tab={tab}
                  search={search}
                  onSearch={setSearch}
                  view={view}
                  onView={(id) => {
                    setView(id);
                    const label = tab.savedViews.find((entry) => entry.id === id)?.label ?? 'All';
                    push(`${viewCounts[id] ?? 0}${strings.viewMatch}${label}”.`, 'info');
                  }}
                  viewCounts={viewCounts}
                  filters={filters}
                  onFilter={(key, value) =>
                    setFilters((current) => ({ ...current, [key]: value }))
                  }
                  onResetFilters={() => {
                    setFilters({});
                    push(actionToasts.clear_filters);
                  }}
                  onApplyFilters={() => push(`${filtered.length}${strings.filterMatch}`)}
                  hiddenColumns={hiddenColumns}
                  onColumn={(id, visible) => {
                    setHiddenColumns((current) =>
                      visible ? current.filter((entry) => entry !== id) : [...current, id],
                    );
                    push(`${visible ? 'Showing' : 'Hiding'} the ${id} column.`, 'info');
                  }}
                  onResetColumns={() => {
                    setHiddenColumns([]);
                    push(actionToasts.reset_columns);
                  }}
                  density={density}
                  onDensity={setDensity}
                  matchCount={filtered.length}
                  totalCount={tab.rows.length}
                  sort={sort}
                  onSort={handleSort}
                  openMenu={openMenu}
                  onOpenMenu={setOpenMenu}
                  chips={chips}
                  onClearChip={(id) => setFilters((current) => ({ ...current, [id]: '' }))}
                  onRefresh={refresh}
                  onPrint={printList}
                  fullscreen={fullscreen}
                  onToggleFullscreen={() => {
                    const next = !fullscreen;
                    setFullscreen(next);
                    push(
                      next ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.',
                      'info',
                    );
                  }}
                  onSaveView={() => push(actionToasts.save_view)}
                />
              ) : null}

              {loading ? <HomeworkSkeleton /> : null}

              {!loading ? (
                <div className="live-content">
                  {tab.selectable ? (
                    <BulkActionBar
                      count={selected.length}
                      onAction={handleBulkAction}
                      onClear={() => setSelected([])}
                    />
                  ) : null}

                  {pageRows.length > 0 ? (
                    <HomeworkTable
                      tab={tab}
                      rows={pageRows}
                      hiddenColumns={hiddenColumns}
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
                      rowMenuOpen={rowMenuOpen}
                      onRowMenu={setRowMenuOpen}
                      onOpenModal={openModal}
                      onInspect={(row) => setInspected(row)}
                      onAction={handleAction}
                      onMenuAction={handleMenuAction}
                    />
                  ) : (
                    <div className="workspace-empty-state">
                      <span className="workspace-empty-icon">
                        <i className={tab.emptyState.icon} />
                      </span>
                      <h6 className="mb-1">{tab.emptyState.title}</h6>
                      <p className="fs-13 text-muted mb-3">{tab.emptyState.body}</p>
                      {tab.emptyState.action ? (
                        <Link
                          to="#"
                          className="btn btn-light btn-sm"
                          onClick={() => {
                            if (tab.emptyState.action?.kind === 'create') {
                              openModal('add', null);
                              return;
                            }
                            setFilters({});
                            setSearch('');
                            setView('all');
                          }}
                        >
                          <i className={`${tab.emptyState.action.icon} me-1`} />
                          {tab.emptyState.action.label}
                        </Link>
                      ) : null}
                    </div>
                  )}

                  <WorkspaceFooter
                    noun={tab.noun}
                    paginationLabel={tab.paginationLabel}
                    rangeFrom={rangeFrom}
                    rangeTo={rangeTo}
                    total={filtered.length}
                    pageSize={pageSize}
                    onPageSize={(next) => {
                      setPageSize(next);
                      setPage(1);
                    }}
                    page={currentPage}
                    pageCount={pageCount}
                    onPage={(next) => {
                      setPage(next);
                      push(actionToasts.page, 'info');
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Homework inspector — the template's `#homework_inspector` */}
      <Offcanvas
        open={inspected !== null}
        onClose={() => setInspected(null)}
        title={inspected?.name ?? 'Homework'}
        placement="end"
        labelledById="homeworkInspectorLabel"
      >
        {inspected ? (
          <>
            <p className="fs-12 text-muted">
              {inspected.subject} · {inspected.classLabel}
            </p>

            <div className="row g-3 text-center mb-3">
              <div className="col">
                <h5 className="mb-0">{inspected.completion}%</h5>
                <span className="fs-12 text-muted">Completion</span>
              </div>
              <div className="col">
                <h5 className="mb-0">
                  {inspected.submitted}/{inspected.total}
                </h5>
                <span className="fs-12 text-muted">Submitted</span>
              </div>
              <div className="col">
                <h5 className="mb-0">{inspected.pending}</h5>
                <span className="fs-12 text-muted">Pending</span>
              </div>
            </div>

            <div className={`meter ${inspected.meter} mb-3`}>
              <span style={{ width: `${inspected.completion}%` }} />
            </div>

            <h6 className="details-heading">
              <i className="ti ti-users" />
              Students
            </h6>
            <ul className="list-unstyled mb-3">
              {inspectorStudents.map((student) => (
                <li
                  className="d-flex align-items-center justify-content-between py-2 border-bottom"
                  key={student.name}
                >
                  <span className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm">
                      <ImageWithBasePath
                        src={student.avatar}
                        className="rounded-circle"
                        alt={student.name}
                      />
                    </span>
                    <span className="fs-13">{student.name}</span>
                  </span>
                  <span className={`badge ${student.badge}`}>{student.state}</span>
                </li>
              ))}
            </ul>

            <h6 className="details-heading">
              <i className="ti ti-note" />
              Notes
            </h6>
            <p className="fs-13">{inspectorNotes}</p>

            <h6 className="details-heading">
              <i className="ti ti-activity" />
              Activity
            </h6>
            <ul className="list-unstyled mb-0">
              {inspectorActivity.map((entry) => (
                <li className="fs-13 d-flex align-items-center gap-2 mb-2" key={entry.text}>
                  <i className={`${entry.icon} text-muted`} />
                  {entry.text}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </Offcanvas>

      <HomeworkModals
        active={activeModal}
        row={activeRow}
        selectedCount={selected.length}
        onClose={() => setActiveModal(null)}
        onAdd={(draft: HomeworkDraft) => {
          setActiveModal(null);
          push(`Homework created for ${draft.className || 'the selected class'}.`);
        }}
        onSave={(id: string) => {
          setActiveModal(null);
          push(`Homework ${id} updated.`);
        }}
        onSaveGrade={(draft: GradeDraft) => {
          setActiveModal(null);
          push(`Grade ${draft.grade} saved.`);
        }}
        onSendFeedback={(draft: FeedbackDraft) => {
          setActiveModal(null);
          push(
            draft.notifyParent
              ? 'Feedback sent — a copy went to the parent portal.'
              : 'Feedback sent.',
          );
        }}
        onImport={() => {
          setActiveModal(null);
          push('File queued — 10 homework validated.');
        }}
        onConfirmDelete={handleConfirmDelete}
        onGradebook={() => {
          setActiveModal(null);
          push(actionToasts.grade);
          gotoRoute('marksEntry');
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default Homework;
