import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import StudentCardItem from './components/StudentCardItem';
import StudentPreviewPanel from './components/StudentPreviewPanel';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import type { ToolbarMenu } from './components/WorkspaceToolbar';
import StudentModals from './modals/StudentModals';
import type { StudentCard } from './data/students.data';
import { statCards, students } from './data/students.data';
import type { SortKey, StudentModalId } from './data/studentsWorkspace.data';
import { academicYears, advancedFilters, quickFilters, savedViews } from './data/studentsWorkspace.data';

const routes = all_routes;

/** "Class III · A · Red House" → { level: "III", section: "A" }. */
const parseMeta = (student: StudentCard) => {
  const [level = '', section = ''] = student.meta.split(' · ');
  return { level: level.replace(/^Class\s+/, ''), section };
};

const hasBadge = (student: StudentCard, label: string) =>
  student.badges.some((badge) => badge.label === label);

const facetValue = (student: StudentCard, facet: string): string => {
  const { level, section } = parseMeta(student);
  switch (facet) {
    case 'class':
      return level;
    case 'section':
      return section;
    case 'gender':
      return student.gender;
    case 'status':
      return student.status.label;
    case 'transport':
      return hasBadge(student, 'Transport') ? 'Yes' : 'No';
    case 'hostel':
      return hasBadge(student, 'Hostel') ? 'Yes' : 'No';
    case 'scholarship':
      return student.chips.some((chip) => chip.label === 'Scholar') ? 'Yes' : 'No';
    case 'year':
      return student.year;
    default:
      return '';
  }
};

const CLASS_ORDER = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

const compareBy = (sort: SortKey) => (a: StudentCard, b: StudentCard) => {
  switch (sort) {
    case 'status':
      return a.status.label.localeCompare(b.status.label) || a.name.localeCompare(b.name);
    case 'class': {
      const left = parseMeta(a);
      const right = parseMeta(b);
      return (
        CLASS_ORDER.indexOf(left.level) - CLASS_ORDER.indexOf(right.level) ||
        left.section.localeCompare(right.section) ||
        a.name.localeCompare(b.name)
      );
    }
    // The roster carries no dates, but admission numbers run in intake order,
    // so they stand in for "date of join" and "recently added".
    case 'join':
      return a.admissionNo.localeCompare(b.admissionNo);
    case 'recent':
      return b.admissionNo.localeCompare(a.admissionNo);
    case 'name':
    default:
      return a.name.localeCompare(b.name);
  }
};

const PAGE_SIZE = students.length;

const StudentGrid = () => {
  const [search, setSearch] = useState('');
  const [view, setView] = useState('all');
  const [quickFilter, setQuickFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<SortKey>('name');
  const [academicYear, setAcademicYear] = useState(academicYears[0]);
  const [openMenu, setOpenMenu] = useState<ToolbarMenu>(null);
  const [fullscreen, setFullscreen] = useState(false);

  const [selected, setSelected] = useState<string[]>([]);
  const [cardMenu, setCardMenu] = useState<string | null>(null);
  const [preview, setPreview] = useState<StudentCard | null>(null);
  const [activeModal, setActiveModal] = useState<StudentModalId | null>(null);
  const [modalStudent, setModalStudent] = useState<StudentCard | null>(null);

  const [roster, setRoster] = useState<StudentCard[]>(students);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [exportOpen, setExportOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  /* --------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return roster
      .filter((student) => {
        if (term) {
          const haystack = [
            student.name,
            student.admissionNo,
            student.meta,
            student.roll,
            student.parent.name,
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(term)) return false;
        }

        if (view !== 'all' && student.status.label !== view) return false;
        if (quickFilter && student.status.label !== quickFilter) return false;

        return advancedFilters.every((field) => {
          const wanted = filters[field.id];
          return !wanted || facetValue(student, field.id) === wanted;
        });
      })
      .sort(compareBy(sort));
  }, [roster, search, view, quickFilter, filters, sort]);

  const shown = filtered.slice(0, visibleCount);

  const countBy = useCallback(
    (status: string) => roster.filter((student) => student.status.label === status).length,
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
    [quickFilters.length, countBy],
  );

  /* ----------------------------- Toolbar plumbing ---------------------------- */

  const chips = useMemo(() => {
    const active: { id: string; label: string }[] = [];
    if (search.trim()) active.push({ id: 'search', label: `Search: ${search.trim()}` });
    if (view !== 'all') {
      active.push({
        id: 'view',
        label: `View: ${savedViews.find((item) => item.id === view)?.label ?? view}`,
      });
    }
    if (quickFilter) active.push({ id: `quick`, label: `Quick: ${quickFilter}` });
    advancedFilters.forEach((field) => {
      const value = filters[field.id];
      if (value) active.push({ id: field.id, label: `${field.label}: ${value}` });
    });
    return active;
  }, [search, view, quickFilter, filters]);

  const resetFilters = useCallback(() => {
    setSearch('');
    setView('all');
    setQuickFilter(null);
    setFilters({});
  }, []);

  const clearChip = useCallback((id: string) => {
    if (id === 'search') setSearch('');
    else if (id === 'view') setView('all');
    else if (id === 'quick') setQuickFilter(null);
    else setFilters((current) => ({ ...current, [id]: '' }));
  }, []);

  // The template's refresh button had no script; here it replays the skeleton.
  const refresh = useCallback(() => {
    setLoading(true);
    const timer = window.setTimeout(() => {
      setRoster(students);
      setLoading(false);
      push('Student list refreshed');
    }, 600);
    return () => window.clearTimeout(timer);
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

  /* ------------------------------ Card plumbing ------------------------------ */

  const toggleSelect = useCallback((id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }, []);

  const openModalFor = useCallback((student: StudentCard, modal: StudentModalId) => {
    setModalStudent(student);
    setActiveModal(modal);
  }, []);

  const confirmDelete = useCallback(() => {
    const doomed = modalStudent ? [modalStudent.id] : selected;
    setRoster((current) => current.filter((student) => !doomed.includes(student.id)));
    setSelected((current) => current.filter((id) => !doomed.includes(id)));
    setActiveModal(null);
    push(doomed.length > 1 ? `${doomed.length} students deleted` : 'Student deleted');
  }, [modalStudent, selected, push]);

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content content-two">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Students</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">Peoples</li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Students Grid
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={refresh}
                >
                  <i className="ti ti-refresh" />
                </button>
              </div>
              <div className="pe-1 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
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
                      Export as Excel{' '}
                    </button>
                  </li>
                </ul>
              </div>
              <div className="mb-2">
                <Link to={routes.addStudent} className="btn btn-primary d-flex align-items-center">
                  <i className="ti ti-square-rounded-plus me-2" />
                  Add Student
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Stats Cards */}
          <div className="row g-3 mb-3">
            {statCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-students ${card.variant}`}>
                  <div className="stats-head">
                    <span className="stats-avatar stats-icon">
                      <i className={card.icon} />
                    </span>
                    <div>
                      <h3 className="stats-value mb-0">{card.value}</h3>
                      <p className="stats-label">{card.label}</p>
                    </div>
                  </div>
                  <div className="stats-footer">
                    <span className="stats-subtitle">
                      <i className="ti ti-point" />
                      {card.subtitle}
                    </span>
                    <span className="stats-badge">{card.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}

          {/* Workspace Toolbar */}
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
            onFilter={(id, value) => setFilters((current) => ({ ...current, [id]: value }))}
            onResetFilters={resetFilters}
            sort={sort}
            onSort={setSort}
            academicYear={academicYear}
            onAcademicYear={setAcademicYear}
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
          {/* /Workspace Toolbar */}

          <div className="row g-4">
            {/* Loading state — global skeleton loader */}
            {loading ? (
              <div className="skeleton-loader col-12" id="students_loading">
                <div className="row g-3">
                  {[0, 1, 2, 3].map((index) => (
                    <div className="col-xxl-3 col-xl-4 col-md-6 d-flex" key={index}>
                      <div className="card flex-fill mb-0">
                        <div className="card-body">
                          <div className="d-flex align-items-center gap-2 mb-3">
                            <div className="skeleton skeleton-circle skeleton-avatar" />
                            <div className="flex-fill">
                              <div className="skeleton skeleton-line w-75 mb-2" />
                              <div className="skeleton skeleton-line w-50" />
                            </div>
                          </div>
                          <div className="skeleton skeleton-line mb-2" />
                          <div className="skeleton skeleton-line mb-2" />
                          <div className="skeleton skeleton-line w-50" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Student Cards */}
            {!loading
              ? shown.map((student) => (
                  <StudentCardItem
                    key={student.id}
                    student={student}
                    selected={selected.includes(student.id)}
                    onToggleSelect={toggleSelect}
                    menuOpen={cardMenu === student.id}
                    onToggleMenu={setCardMenu}
                    onOpenModal={(modal) => openModalFor(student, modal)}
                    onPreview={setPreview}
                  />
                ))
              : null}

            {/* Empty state — global workspace component */}
            {!loading && filtered.length === 0 ? (
              <div className="col-12">
                <div className="workspace-empty-state show" id="students_empty">
                  <span className="workspace-empty-art">
                    <i className="ti ti-users-group" />
                  </span>
                  <h5 className="mb-1">No students match these filters</h5>
                  <p className="text-muted mb-3">
                    Try widening the class, section or status filters, or clear them to see the full
                    directory.
                  </p>
                  <button type="button" className="btn btn-light" onClick={resetFilters}>
                    <i className="ti ti-filter-off me-1" />
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : null}

            <div className="col-md-12 text-center">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              >
                <i className="ti ti-loader-3 me-2" />
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      {/* Student Quick Preview */}
      <StudentPreviewPanel student={preview} onClose={() => setPreview(null)} />

      {/* Student action modals (shared by all cards) */}
      <StudentModals
        active={activeModal}
        student={modalStudent}
        onClose={() => setActiveModal(null)}
        onToast={push}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="sgToast" />
    </>
  );
};

export default StudentGrid;
