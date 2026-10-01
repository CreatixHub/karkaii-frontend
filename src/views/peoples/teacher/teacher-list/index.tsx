import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TeacherListSkeleton from './components/TeacherListSkeleton';
import TeacherSummaryStrip from './components/TeacherSummaryStrip';
import TeacherTableRow from './components/TeacherTableRow';
import TeacherWorkspaceFooter from './components/TeacherWorkspaceFooter';
import TeacherWorkspaceToolbar from './components/TeacherWorkspaceToolbar';
import type { ToolbarMenu } from './components/TeacherWorkspaceToolbar';
import TeacherListModals from './modals/TeacherListModals';
import type { Teacher } from './data/teachers.data';
import { teachers } from './data/teachers.data';
import type {
  ColumnKey,
  Density,
  SortKey,
  TeacherModalId,
} from './data/teacherWorkspace.data';
import {
  actionToasts,
  advancedFilters,
  allColumnsVisible,
  columnOptions,
  csvColumns,
  quickFilters,
  savedViews,
  sortOptions,
} from './data/teacherWorkspace.data';

const routes = all_routes;

/** `"III A"` / `"IX (C) , X (C)"` → the roman-numeral tokens it names. */
const classTokens = (value: string) =>
  value.split(/[^A-Za-z]+/).filter(Boolean).map((token) => token.toUpperCase());

/** `"25 Mar 2024"` → a sortable timestamp, as the template's script did. */
const joinTime = (value: string) => new Date(value).getTime() || 0;

const matchesFilter = (teacher: Teacher, id: string, value: string) => {
  switch (id) {
    case 'class':
      return classTokens(teacher.classes).includes(value.toUpperCase());
    case 'subject':
      return teacher.subject === value;
    case 'status':
      return teacher.status === value;
    // The rows carry no academic year, only a join date — an option matches
    // when it spans the year the teacher joined.
    case 'academic-year':
      return value.includes(teacher.dateOfJoin.slice(-4));
    default:
      return true;
  }
};

const compareBy = (sort: SortKey) => (a: Teacher, b: Teacher) => {
  switch (sort) {
    case 'status':
      return a.status.localeCompare(b.status);
    case 'class':
      return a.classes.localeCompare(b.classes);
    case 'subject':
      return a.subject.localeCompare(b.subject);
    case 'join':
      return joinTime(a.dateOfJoin) - joinTime(b.dateOfJoin);
    case 'name':
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    // "Recently updated" is the order the rows ship in.
    case 'recent':
    default:
      return 0;
  }
};

const TeacherList = () => {
  const [roster, setRoster] = useState<Teacher[]>(teachers);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortKey>('recent');
  const [sortAsc, setSortAsc] = useState(true);
  const [columns, setColumns] = useState<Record<ColumnKey, boolean>>(allColumnsVisible);
  const [density, setDensity] = useState<Density>('default');

  const [selected, setSelected] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [rowMenu, setRowMenu] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [activeModal, setActiveModal] = useState<TeacherModalId | null>(null);
  const [modalTeacher, setModalTeacher] = useState<Teacher | null>(null);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return roster
      .filter((teacher) => {
        if (term && !teacher.search.includes(term)) return false;
        if (view !== 'all' && teacher.status !== view) return false;
        return advancedFilters.every((field) => {
          const wanted = filters[field.id];
          return !wanted || matchesFilter(teacher, field.id, wanted);
        });
      })
      .sort((a, b) => {
        const result = compareBy(sort)(a, b);
        return sortAsc ? result : -result;
      });
  }, [roster, search, view, filters, sort, sortAsc]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  // Filtering can shrink the result set past the page the user was on.
  useEffect(() => {
    setPage((current) => Math.min(current, Math.max(1, Math.ceil(filtered.length / pageSize))));
  }, [filtered.length, pageSize]);

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
      selected: selected.length,
      active: countBy('Active'),
      inactive: countBy('Inactive'),
      graduated: new Set(roster.map((teacher) => teacher.subject)).size,
      filtered: filtered.length,
    }),
    [selected.length, countBy, roster, filtered.length],
  );

  const chips = useMemo(
    () =>
      advancedFilters
        .filter((field) => filters[field.id])
        .map((field) => ({ id: field.id, label: `${field.facet}: ${filters[field.id]}` })),
    [filters],
  );

  /* -------------------------------- Actions --------------------------------- */

  /** Raises the toast the template's script registered for this action id. */
  const action = useCallback(
    (id: string) => {
      const entry = actionToasts[id];
      if (entry) push(entry[0], entry[1]);
    },
    [push],
  );

  const resetFilters = useCallback(() => {
    setSearch('');
    setView('all');
    setFilters({});
    push('Filters cleared.');
  }, [push]);

  const clearChip = useCallback((id: string) => {
    setFilters((current) => ({ ...current, [id]: '' }));
  }, []);

  const changeFilter = useCallback((id: string, value: string) => {
    setFilters((current) => ({ ...current, [id]: value }));
  }, []);

  const changeView = useCallback(
    (next: string) => {
      setView(next);
      const label = savedViews.find((item) => item.id === next)?.label ?? next;
      const matches =
        next === 'all' ? roster.length : roster.filter((item) => item.status === next).length;
      push(`${matches} teacher(s) in “${label}”.`, 'info');
    },
    [roster, push],
  );

  const changeSort = useCallback(
    (key: SortKey, fromHeader = false) => {
      // A header click flips direction; a menu pick always starts ascending.
      const asc = fromHeader ? !(sort === key && sortAsc) : true;
      setSort(key);
      setSortAsc(asc);
      if (key === 'recent') {
        push('Showing the most recently updated teachers first.', 'info');
        return;
      }
      const label =
        sortOptions.find((option) => option.id === key)?.label ??
        columnOptions.find((option) => option.id === (key as ColumnKey))?.label ??
        key;
      push(`Sorted by ${label} · ${asc ? 'ascending' : 'descending'}`, 'info');
    },
    [sort, sortAsc, push],
  );

  const toggleColumn = useCallback(
    (id: ColumnKey) => {
      setColumns((current) => {
        const next = { ...current, [id]: !current[id] };
        push(`${next[id] ? 'Showing' : 'Hiding'} the ${id} column.`, 'info');
        return next;
      });
    },
    [push],
  );

  const resetColumns = useCallback(() => {
    setColumns(allColumnsVisible);
    push('All columns restored.');
  }, [push]);

  // The template's refresh button had no script; here it replays the skeleton.
  const refresh = useCallback(() => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      action('refresh');
    }, 700);
  }, [action]);

  // First paint: the template never added `is-loaded`, so the skeleton stayed.
  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 850);
    return () => window.clearTimeout(timer);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const node = workspaceRef.current;
    const on = !fullscreen;
    try {
      if (on && node?.requestFullscreen) {
        const request = node.requestFullscreen();
        if (request && request.catch) request.catch(() => undefined);
      } else if (!on && document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch {
      /* the styling fallback below still applies */
    }
    setFullscreen(on);
    push(on ? 'Entered fullscreen — press Esc to exit.' : 'Exited fullscreen.', 'info');
  }, [fullscreen, push]);

  // Leaving native fullscreen with Escape has to restore the button too.
  useEffect(() => {
    const sync = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const exportCsv = useCallback(() => {
    push('Preparing export…', 'info');
    const body = filtered.map((teacher) => [
      teacher.name,
      teacher.id,
      teacher.status,
      teacher.classes,
      teacher.subject,
      teacher.email,
      teacher.phone,
      teacher.dateOfJoin,
    ]);
    const csv = [csvColumns, ...body]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'teacher-list.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
  }, [filtered, push]);

  // Close the header export menu and any row menu on an outside click.
  useEffect(() => {
    if (!exportOpen && !rowMenu) return;
    const close = () => {
      setExportOpen(false);
      setRowMenu(null);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [exportOpen, rowMenu]);

  /* ------------------------------ Row plumbing ------------------------------ */

  const toggleSelect = useCallback((key: string) => {
    setSelected((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }, []);

  const toggleExpand = useCallback((key: string) => {
    setExpanded((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  }, []);

  const pageKeys = pageRows.map((teacher) => teacher.key);
  const selectedOnPage = pageKeys.filter((key) => selected.includes(key));
  const allOnPageSelected = pageKeys.length > 0 && selectedOnPage.length === pageKeys.length;

  useEffect(() => {
    if (!selectAllRef.current) return;
    selectAllRef.current.indeterminate =
      selectedOnPage.length > 0 && selectedOnPage.length < pageKeys.length;
  }, [selectedOnPage.length, pageKeys.length]);

  const toggleSelectAll = useCallback(() => {
    setSelected((current) => {
      if (allOnPageSelected) return current.filter((key) => !pageKeys.includes(key));
      return Array.from(new Set([...current, ...pageKeys]));
    });
  }, [allOnPageSelected, pageKeys]);

  const openModal = useCallback((modal: TeacherModalId, teacher: Teacher | null) => {
    setModalTeacher(teacher);
    setActiveModal(modal);
  }, []);

  const confirmDelete = useCallback(() => {
    const doomed = modalTeacher ? [modalTeacher.key] : selected;
    setRoster((current) => current.filter((teacher) => !doomed.includes(teacher.key)));
    setSelected((current) => current.filter((key) => !doomed.includes(key)));
    setActiveModal(null);
    push(doomed.length > 1 ? `${doomed.length} teachers deleted.` : 'Teacher deleted.');
  }, [modalTeacher, selected, push]);

  const isEmpty = filtered.length === 0;
  const rangeFrom = isEmpty ? 0 : pageStart + 1;
  const rangeTo = pageStart + pageRows.length;

  /** `dt-sort-asc` / `dt-sort-desc` on the header currently driving the sort. */
  const headerSortClass = (key: SortKey) =>
    sort === key ? (sortAsc ? ' dt-sort-asc' : ' dt-sort-desc') : '';

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teachers List</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Teachers</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    All Teachers
                  </li>
                </ol>
              </nav>
            </div>
            {/* Page-level actions. Grid-level actions (search, filters, columns,
                refresh, density) live in the workspace toolbar instead. */}
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import', null)}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
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
                        action('export_pdf');
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
                        action('export_excel');
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
                        exportCsv();
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
                        action('print');
                        window.print();
                      }}
                    >
                      <i className="ti ti-printer me-2" />
                      Print
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mb-2">
                <Link
                  to={routes.addTeacher}
                  className="btn btn-primary btn-sm d-flex align-items-center"
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Teacher
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Teachers List */}
          <div className="card">
            <div
              className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}${
                fullscreen ? ' is-fullscreen' : ''
              }`}
              id="classWorkspace"
              data-density={density}
              ref={workspaceRef}
            >
              {/* ===================== TOOLBAR ===================== */}
              <TeacherWorkspaceToolbar
                search={search}
                onSearch={setSearch}
                view={view}
                onView={changeView}
                viewCounts={viewCounts}
                quickCounts={quickCounts}
                filters={filters}
                onFilter={changeFilter}
                onApplyFilters={() =>
                  push(`${filtered.length} teacher(s) match the current filters.`)
                }
                onResetFilters={resetFilters}
                onSaveView={() => action('save_view')}
                sort={sort}
                onSort={changeSort}
                columns={columns}
                onToggleColumn={toggleColumn}
                onResetColumns={resetColumns}
                density={density}
                onDensity={setDensity}
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

              {/* ===================== SKELETON LOADING ===================== */}
              <TeacherListSkeleton visible={loading} />

              {/* ===================== LIVE CONTENT ===================== */}
              <div className="live-content">
                {/* Summary strip */}
                <TeacherSummaryStrip values={summaryValues} />

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
                      <button type="button" className="btn btn-sm" onClick={() => action('message')}>
                        <i className="ti ti-message me-1" />
                        Message
                      </button>
                      <button type="button" className="btn btn-sm" onClick={() => action('email')}>
                        <i className="ti ti-mail me-1" />
                        Email
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => action('assign_class')}
                      >
                        <i className="ti ti-users-group me-1" />
                        Assign Class
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => action('timetable')}
                      >
                        <i className="ti ti-table me-1" />
                        Timetable
                      </button>
                      <button type="button" className="btn btn-sm" onClick={exportCsv}>
                        <i className="ti ti-download me-1" />
                        Export
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm"
                        onClick={() => {
                          action('print');
                          window.print();
                        }}
                      >
                        <i className="ti ti-printer me-1" />
                        Print
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm text-danger"
                        onClick={() => openModal('delete', null)}
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

                {/* Table */}
                <div className="data-table" hidden={isEmpty}>
                  <table className="table">
                    <caption className="visually-hidden">
                      Teacher list with status, class, subject, email, phone and date of join
                    </caption>
                    <thead>
                      <tr>
                        <th className="card-expand-toggle" />
                        <th className="dt-pin card-select">
                          <input
                            type="checkbox"
                            className="dt-check"
                            id="clsAll"
                            ref={selectAllRef}
                            aria-label="Select all teachers"
                            checked={allOnPageSelected}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th
                          className={`dt-sortable${headerSortClass('name')}`}
                          data-cls-col="teacher"
                          hidden={!columns.teacher}
                          onClick={() => changeSort('name', true)}
                        >
                          Teacher <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th
                          className={`dt-sortable${headerSortClass('status')}`}
                          data-cls-col="status"
                          hidden={!columns.status}
                          onClick={() => changeSort('status', true)}
                        >
                          Status <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th
                          className={`dt-sortable${headerSortClass('class')}`}
                          data-cls-col="class"
                          hidden={!columns.class}
                          onClick={() => changeSort('class', true)}
                        >
                          Class <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th
                          className={`dt-sortable${headerSortClass('subject')}`}
                          data-cls-col="subject"
                          hidden={!columns.subject}
                          onClick={() => changeSort('subject', true)}
                        >
                          Subject <i className="ti ti-arrows-sort dt-sort-ic" />
                          <span className="dt-resize" />
                        </th>
                        <th data-cls-col="email" hidden={!columns.email}>
                          Email
                          <span className="dt-resize" />
                        </th>
                        <th data-cls-col="phone" hidden={!columns.phone}>
                          Phone
                          <span className="dt-resize" />
                        </th>
                        <th
                          className={`dt-sortable${headerSortClass('join')}`}
                          data-cls-col="join"
                          hidden={!columns.join}
                          onClick={() => changeSort('join', true)}
                        >
                          Date of Join <i className="ti ti-arrows-sort dt-sort-ic" />
                        </th>
                        <th className="text-end card-actions-row">Actions</th>
                      </tr>
                    </thead>
                    <tbody id="clsBody">
                      {pageRows.map((teacher) => (
                        <TeacherTableRow
                          key={teacher.key}
                          teacher={teacher}
                          columns={columns}
                          selected={selected.includes(teacher.key)}
                          expanded={expanded.includes(teacher.key)}
                          menuOpen={rowMenu === teacher.key}
                          onToggleSelect={toggleSelect}
                          onToggleExpand={toggleExpand}
                          onToggleMenu={setRowMenu}
                          onAction={action}
                          onOpenModal={openModal}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Empty state */}
                <div
                  className={`workspace-empty-state${isEmpty ? ' show' : ''}`}
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
                <TeacherWorkspaceFooter
                  rangeFrom={rangeFrom}
                  rangeTo={rangeTo}
                  total={filtered.length}
                  page={currentPage}
                  pageCount={pageCount}
                  pageSize={pageSize}
                  onPage={(next) => {
                    setPage(next);
                    action('page');
                  }}
                  onPageSize={(size) => {
                    setPageSize(size);
                    setPage(1);
                  }}
                />
              </div>
            </div>
          </div>
          {/* /Teachers List */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <TeacherListModals
        active={activeModal}
        teacher={modalTeacher}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default TeacherList;
