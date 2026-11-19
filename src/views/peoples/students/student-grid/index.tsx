import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import { apiClient } from '@services/api/client';
import { endpoints } from '@services/api/endpoints';
import { toApiError } from '@services/api/errors';
import StudentCardItem from './components/StudentCardItem';
import StudentPreviewPanel from './components/StudentPreviewPanel';
import WorkspaceToolbar from './components/WorkspaceToolbar';
import type { ToolbarMenu } from './components/WorkspaceToolbar';
import StudentModals from './modals/StudentModals';
import type { StatCard, StudentCard } from './data/students.data';
import { VIEW_TO_STATUS } from './data/studentMapper';
import { useStudentRoster } from './hooks/useStudentRoster';
import { useStudentCounts } from './hooks/useStudentCounts';
import type { SortKey, StudentModalId } from './data/studentsWorkspace.data';
import { academicYears, advancedFilters, quickFilters, savedViews } from './data/studentsWorkspace.data';

const routes = all_routes;

const fmt = (n: number) => n.toLocaleString('en-IN');

const hasBadge = (student: StudentCard, label: string) =>
  student.badges.some((badge) => badge.label === label);

const facetValue = (student: StudentCard, facet: string): string => {
  switch (facet) {
    case 'class':
      return student.className ?? '';
    case 'section':
      return student.section ?? '';
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

const compareBy = (sort: SortKey) => (a: StudentCard, b: StudentCard) => {
  switch (sort) {
    case 'status':
      return a.status.label.localeCompare(b.status.label) || a.name.localeCompare(b.name);
    case 'class':
      return (
        (a.gradeLevel ?? 999) - (b.gradeLevel ?? 999) ||
        (a.className ?? '').localeCompare(b.className ?? '') ||
        a.name.localeCompare(b.name)
      );
    // Admission numbers run in intake order, so they stand in for "date of join" and "recently added".
    case 'join':
      return a.admissionNo.localeCompare(b.admissionNo);
    case 'recent':
      return b.admissionNo.localeCompare(a.admissionNo);
    case 'name':
    default:
      return a.name.localeCompare(b.name);
  }
};

/** "Class III", "Class 5", "V" ... -> 3, 5, 5 so classes sort in school order. */
const ROMAN: Record<string, number> = {
  I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12,
};
const classRank = (student: StudentCard): number => {
  if (typeof student.gradeLevel === 'number') return student.gradeLevel;
  const token = (student.className ?? '').trim().split(/\s+/).pop()?.toUpperCase() ?? '';
  if (!token) return 9999;
  if (/^\d+$/.test(token)) return Number(token);
  return ROMAN[token] ?? 5000;
};

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

  const [exportOpen, setExportOpen] = useState(false);

  const { toasts, push, dismiss } = useToasts();

  /* ------------------------------- Live data -------------------------------- */

  // The toolbar's saved view / quick filter is applied by the server.
  const statusLabel = quickFilter ?? (view !== 'all' ? view : null);
  const serverStatus = statusLabel ? VIEW_TO_STATUS[statusLabel] : undefined;

  const {
    students: roster,
    total,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refetch,
    removeLocal,
  } = useStudentRoster({ search, status: serverStatus });

  // Whole-school counts (all statuses) for the stat cards and the toolbar badges.
  const { counts: byStatus, refetch: refetchStrength } = useStudentCounts();
  const totalAll = Object.values(byStatus).reduce((sum, n) => sum + n, 0);

  const statCards: StatCard[] = useMemo(
    () => [
      { id: 'total', variant: 'stats-primary', icon: 'ti ti-users', value: fmt(totalAll), label: 'Total Students', subtitle: 'All records', badge: '' },
      { id: 'active', variant: 'stats-success', icon: 'ti ti-user-check', value: fmt(byStatus.active ?? 0), label: 'Active', subtitle: 'Currently enrolled', badge: '' },
      { id: 'inactive', variant: 'stats-danger', icon: 'ti ti-user-off', value: fmt(byStatus.inactive ?? 0), label: 'Inactive', subtitle: 'Not attending', badge: '' },
      {
        id: 'left',
        variant: 'stats-info',
        icon: 'ti ti-transfer',
        value: fmt((byStatus.alumni ?? 0) + (byStatus.transferred_out ?? 0)),
        label: 'Alumni / Transferred',
        subtitle: 'Left the school',
        badge: '',
      },
    ],
    [byStatus, totalAll],
  );

  const countFor = useCallback(
    (id: string) => (id === 'all' ? totalAll : byStatus[VIEW_TO_STATUS[id] ?? ''] ?? 0),
    [byStatus, totalAll],
  );

  const viewCounts = useMemo(
    () =>
      savedViews.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = countFor(item.id);
        return acc;
      }, {}),
    [countFor],
  );

  const quickCounts = useMemo(
    () =>
      quickFilters.reduce<Record<string, number>>((acc, item) => {
        acc[item.id] = countFor(item.id);
        return acc;
      }, {}),
    [countFor],
  );

  const classOptions = useMemo(
    () => Array.from(new Set(roster.map((item) => item.className).filter(Boolean))) as string[],
    [roster],
  );

  /* --------------------------------- Filtering ------------------------------- */

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return roster
      .filter((student) => {
        if (term) {
          const haystack = [student.name, student.admissionNo, student.meta, student.parent.name]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(term)) return false;
        }

        return advancedFilters.every((field) => {
          const wanted = filters[field.id];
          return !wanted || facetValue(student, field.id) === wanted;
        });
      })
      .sort(compareBy(sort));
  }, [roster, search, filters, sort]);

  /* ----------------------------- Group by class ------------------------------ */

  const classGroups = useMemo(() => {
    const map = new Map<string, { label: string; rank: number; items: StudentCard[] }>();
    for (const student of filtered) {
      const label = student.className?.trim() || 'No class assigned';
      const group = map.get(label);
      if (group) group.items.push(student);
      else map.set(label, { label, rank: student.className ? classRank(student) : 99999, items: [student] });
    }
    return Array.from(map.values()).sort(
      (a, b) => a.rank - b.rank || a.label.localeCompare(b.label),
    );
  }, [filtered]);

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

  const refresh = useCallback(() => {
    refetch();
    refetchStrength();
    push('Student list refreshed');
  }, [refetch, refetchStrength, push]);

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

  // Deletes on the server first, so a student never "disappears" here and comes back on refresh.
  const confirmDelete = useCallback(async () => {
    const doomed = modalStudent ? [modalStudent.id] : selected;
    setActiveModal(null);
    try {
      await Promise.all(doomed.map((id) => apiClient.delete<void>(endpoints.students.remove(id))));
      removeLocal(doomed);
      setSelected((current) => current.filter((id) => !doomed.includes(id)));
      refetchStrength();
      push(doomed.length > 1 ? `${doomed.length} students deleted` : 'Student deleted');
    } catch (raw) {
      push(toApiError(raw).message || 'Could not delete the student');
    }
  }, [modalStudent, selected, removeLocal, refetchStrength, push]);

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
                    {card.badge ? <span className="stats-badge">{card.badge}</span> : null}
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
            totalCount={total}
            classOptions={classOptions}
          />
          {/* /Workspace Toolbar */}

          <div className="row g-4">
            {/* Error state */}
            {error ? (
              <div className="col-12">
                <div
                  className="alert alert-danger d-flex align-items-center justify-content-between mb-0"
                  role="alert"
                >
                  <span>Could not load students: {error}</span>
                  <button type="button" className="btn btn-sm btn-light" onClick={refetch}>
                    Retry
                  </button>
                </div>
              </div>
            ) : null}

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
              ? classGroups.map((group) => (
                  <Fragment key={group.label}>
                    <div className="col-12">
                      <div className="d-flex align-items-center gap-2 pb-2 border-bottom">
                        <span className="avatar avatar-sm bg-primary-transparent text-primary flex-shrink-0">
                          <i className="ti ti-school" />
                        </span>
                        <h5 className="mb-0 fs-16 fw-semibold">{group.label}</h5>
                        <span className="badge badge-soft-primary">
                          {group.items.length} {group.items.length === 1 ? 'student' : 'students'}
                        </span>
                      </div>
                    </div>
                    {group.items.map((student) => (
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
                    ))}
                  </Fragment>
                ))
              : null}

            {/* Empty state — global workspace component */}
            {!loading && !error && filtered.length === 0 ? (
              <div className="col-12">
                <div className="workspace-empty-state show" id="students_empty">
                  <span className="workspace-empty-art">
                    <i className="ti ti-users-group" />
                  </span>
                  <h5 className="mb-1">No students found</h5>
                  <p className="text-muted mb-3">
                    No students match these filters yet. Try widening the filters, or clear them to
                    see the full directory.
                  </p>
                  <button type="button" className="btn btn-light" onClick={resetFilters}>
                    <i className="ti ti-filter-off me-1" />
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : null}

            {hasMore && !loading ? (
              <div className="col-md-12 text-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  <i className="ti ti-loader-3 me-2" />
                  {loadingMore ? 'Loading…' : `Load More (${roster.length} of ${total})`}
                </button>
              </div>
            ) : null}
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