import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  CardWorkspaceShell,
  ExportMenu,
  PageHeader,
  useWorkspace,
} from '@components/workspace';
import type {
  BulkAction,
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import SportModals from './modals/SportModals';
import type { SportDraft, SportModalId } from './modals/SportModals';
import type { Sport, SportStatus } from './data/sports.data';
import {
  academicYearOptions, activityKey, categoryOptions, classOptions, coachOptions,
  competitionOptions, competitionsInfoOf, descriptionOf, equipmentOf, genderOptions,
  notesOf, scheduleOf, searchIndexOf, sectionOptions, sports as initialRows, statusIcon,
  statusOptions, statusPill, teamOptions, trainingOf,
} from './data/sports.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'sport-category', label: 'Sport Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'team', label: 'Team', kind: 'select', chipLabel: 'Team', options: teamOptions },
  { id: 'coach', label: 'Coach', kind: 'select', chipLabel: 'Coach', options: coachOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'gender', label: 'Gender', kind: 'select', chipLabel: 'Gender', options: genderOptions },
  { id: 'competition', label: 'Competition', kind: 'select', chipLabel: 'Competition', options: competitionOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Sport Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'category', label: 'Category', icon: 'ti ti-tag' },
  { id: 'coach', label: 'Coach', icon: 'ti ti-user-star' },
  { id: 'students', label: 'Registered Students', icon: 'ti ti-users' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: SportStatus; label: string; icon: string }[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Upcoming', label: 'Upcoming', icon: 'ti ti-calendar-event' },
  { id: 'In Progress', label: 'In Progress', icon: 'ti ti-progress' },
  { id: 'Completed', label: 'Completed', icon: 'ti ti-trophy' },
  { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-off' },
];

const Sports = () => {
  const [rows, setRows] = useState<Sport[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<SportModalId | null>(null);
  const [modalRow, setModalRow] = useState<Sport | null>(null);
  /** Rows a dialog will write to — one row, or a whole bulk selection. */
  const [targetIds, setTargetIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Sport | null, modal: SportModalId) => {
    setModalRow(row);
    setTargetIds(row ? [row.id] : []);
    setActiveModal(modal);
  }, []);

  /**
   * Bulk bar dialogs open seeded from the first selected sport and write to the
   * whole selection, so "Assign Coach" over four rows means four rows.
   */
  const openBulkModal = useCallback(
    (ids: string[], modal: SportModalId) => {
      const first = rows.find((row) => ids.includes(row.id)) ?? null;
      setModalRow(first);
      setTargetIds(ids);
      setActiveModal(modal);
    },
    [rows],
  );

  /** Applies a change to every row the open dialog targets. */
  const patchRows = useCallback(
    (change: (row: Sport) => Sport, message: string, keepOpen = false) => {
      if (targetIds.length === 0) return;
      setRows((current) => current.map((row) => (targetIds.includes(row.id) ? change(row) : row)));
      if (!keepOpen) setActiveModal(null);
      push(message);
    },
    [push, targetIds],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Sport>[]>(
    () => [
      {
        id: 'sport',
        label: 'Sport',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className={`dt-avatar d-inline-flex align-items-center justify-content-center bg-${row.tint}-transparent text-${row.tint}`}
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className={`${row.icon} fs-20`} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-code">{row.code}</span>
                <span className="dt-dot">·</span>
                <span className="dt-category">{row.category}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`badge badge-soft-${row.tint}`}>
                  <i className="ti ti-tag me-1" />{row.category}
                </span>
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-gender-bigender me-1" />{row.gender}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'team',
        label: 'Team & Coach',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-shirt-sport me-1" />
                <span className="dt-team">{row.team}</span>
              </span>
            </li>
            <li className="d-flex align-items-center gap-1 py-1">
              <span className="avatar avatar-xs">
                <ImageWithBasePath
                  src={row.coachAvatar}
                  className="rounded-circle flex-shrink-0"
                  alt={row.coach}
                />
              </span>
              <span>
                <span className="text-muted">Coach</span>{' '}
                <Link to={routes.teacherDetails} className="fw-medium text-dark dt-coach">{row.coach}</Link>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-user-star me-1" />Asst.{' '}
              <span className="fw-medium text-dark">{row.assistant}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-clock me-1" />{row.schedule}
            </li>
            <li className="py-1">
              <span className="badge badge-soft-info">
                <i className="ti ti-map-pin me-1" />
                <span className="dt-venue">{row.venue}</span>
              </span>
            </li>
          </ul>
        ),
      },
      {
        id: 'participation',
        label: 'Participation',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-users me-1" />
                <span className="dt-students-val">{row.students}</span> Students
              </span>{' '}
              <span className="badge badge-soft-warning">
                <i className="ti ti-calendar-event me-1" />
                <span className="dt-events-val">{row.events}</span> Events
              </span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-success">
                <i className="ti ti-trophy me-1" />
                <span className="dt-achieve-val">{row.achievements}</span> Achievements
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar me-1" />Year{' '}
              <span className="fw-medium text-dark">{row.academicYear}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-activity me-1" />Last activity {row.lastActivity}
            </li>
          </ul>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            {statusIcon[row.status]
              ? <i className={statusIcon[row.status] as string} />
              : <span className="dt-pill-dot" />}
            {row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Sport>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['sport-category'] && row.category !== filters['sport-category']) return false;
      if (filters.team && row.team !== filters.team) return false;
      if (filters.coach && row.coach !== filters.coach && row.assistant !== filters.coach) return false;
      if (filters.class && !row.classes.includes(filters.class)) return false;
      if (filters.section && !row.sections.includes(filters.section)) return false;
      if (filters.gender && row.gender !== filters.gender) return false;
      if (filters.competition && row.competition !== filters.competition) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'category':
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
        case 'coach':
          return a.coach.localeCompare(b.coach) || a.name.localeCompare(b.name);
        case 'students':
          return b.students - a.students || a.name.localeCompare(b.name);
        // Not in the sort menu, but the Team and Status `<th>`s are sortable.
        case 'team':
          return a.team.localeCompare(b.team) || a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        case 'recent':
          return activityKey(a.lastActivity) - activityKey(b.lastActivity);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so archiving a sport moves both rails. */
  const countBy = useCallback(
    (status: SportStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Sports', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number(value.replace(/[^0-9.]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const createSport = useCallback(
    (draft: SportDraft) => {
      if (!draft.name.trim()) {
        push('Give the sport a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `SP-${String(rows.length + 1).padStart(2, '0')}`;
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          icon: 'ti ti-ball-football',
          tint: 'primary',
          category: draft.category as Sport['category'],
          gender: draft.gender as Sport['gender'],
          team: draft.team.trim() || draft.name.trim(),
          coach: draft.coach.trim(),
          coachAvatar: 'assets/img/teachers/teacher-01.jpg',
          assistant: draft.assistant,
          schedule: draft.schedule.trim() || 'Unscheduled',
          venue: draft.venue,
          students: toNumber(draft.students, 0),
          events: toNumber(draft.events, 0),
          achievements: toNumber(draft.achievements, 0),
          competition: draft.competition,
          academicYear: draft.academicYear,
          lastActivity: '1h ago',
          status: draft.status,
          classes: [...classOptions],
          sections: [...sectionOptions],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updateSport = useCallback(
    (draft: SportDraft) =>
      patchRows(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          code: draft.code.trim() || row.code,
          category: draft.category as Sport['category'],
          gender: draft.gender as Sport['gender'],
          team: draft.team.trim() || row.team,
          coach: draft.coach.trim() || row.coach,
          assistant: draft.assistant || row.assistant,
          schedule: draft.schedule.trim() || row.schedule,
          venue: draft.venue,
          students: toNumber(draft.students, row.students),
          events: toNumber(draft.events, row.events),
          achievements: toNumber(draft.achievements, row.achievements),
          competition: draft.competition,
          academicYear: draft.academicYear,
          status: draft.status,
          lastActivity: '1h ago',
        }),
        `${modalRow?.name ?? 'Sport'} updated`,
      ),
    [modalRow, patchRows],
  );

  const assignCoach = useCallback(
    (coach: string, assistant: string) => {
      if (!coach) {
        push('Pick a head coach to assign', 'warning');
        return;
      }
      patchRows(
        (row) => ({ ...row, coach, assistant: assistant || row.assistant, lastActivity: '1h ago' }),
        `${coach} assigned to ${targetIds.length > 1 ? `${targetIds.length} sports` : modalRow?.name ?? 'the sport'}`,
      );
    },
    [modalRow, patchRows, push, targetIds.length],
  );

  const assignStudents = useCallback(
    (students: string[]) => {
      if (students.length === 0) {
        push('Pick at least one student', 'warning');
        return;
      }
      patchRows(
        (row) => ({ ...row, students: row.students + students.length, lastActivity: '1h ago' }),
        `${students.length} ${students.length === 1 ? 'student' : 'students'} assigned`,
      );
    },
    [patchRows, push],
  );

  const savePractice = useCallback(
    (days: string[], startTime: string, venue: string) => {
      if (days.length === 0) {
        push('Pick at least one practice day', 'warning');
        return;
      }
      patchRows(
        (row) => ({ ...row, schedule: scheduleOf(days, startTime), venue, lastActivity: '1h ago' }),
        `Practice schedule saved for ${modalRow?.name ?? 'the sport'}`,
      );
    },
    [modalRow, patchRows, push],
  );

  /** The generated calendar follows the count, so bumping it adds the fixture. */
  const addCompetition = useCallback(
    () => patchRows(
      (row) => ({ ...row, events: row.events + 1, lastActivity: '1h ago' }),
      `Competition added to ${modalRow?.name ?? 'the sport'}`,
      true,
    ),
    [modalRow, patchRows],
  );

  const addAchievement = useCallback(
    () => patchRows(
      (row) => ({ ...row, achievements: row.achievements + 1, lastActivity: '1h ago' }),
      `Achievement recorded for ${modalRow?.name ?? 'the sport'}`,
      true,
    ),
    [modalRow, patchRows],
  );

  const setStatus = useCallback(
    (ids: string[], status: SportStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'sport' : 'sports'} ${verb}`);
    },
    [push, workspace],
  );

  const duplicate = useCallback(
    (row: Sport) => {
      const code = `${row.code}-C`;
      setRows((current) => [
        { ...row, id: code, code, name: `${row.name} (Copy)`, status: 'Upcoming', lastActivity: 'just now' },
        ...current,
      ]);
      push(`${row.name} duplicated`);
    },
    [push],
  );

  const removeSports = useCallback(() => {
    setRows((current) => current.filter((row) => !targetIds.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${targetIds.length} ${targetIds.length === 1 ? 'sport' : 'sports'} deleted`);
  }, [push, targetIds, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} sports exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'students', label: 'Assign Students', icon: 'ti ti-users', onClick: (ids) => openBulkModal(ids, 'assign-students') },
      { id: 'coach', label: 'Assign Coach', icon: 'ti ti-user-star', onClick: (ids) => openBulkModal(ids, 'assign-coach') },
      { id: 'practice', label: 'Schedule Practice', icon: 'ti ti-clock', onClick: (ids) => openBulkModal(ids, 'practice') },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} sports exported`) },
      { id: 'print', label: 'Print', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setModalRow(null); setTargetIds(ids); setActiveModal('delete'); },
      },
    ],
    [openBulkModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Sport) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Sport" ariaLabel="View Sport" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Sport" ariaLabel="Edit Sport" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <Link className="dt-ib" title="Manage Team" aria-label="Manage Team" to={routes.playerList}>
        <i className="ti ti-shirt-sport" />
      </Link>
      <ActionLink
        className="dt-ib" title="Assign Students" ariaLabel="Assign Students"
        onClick={() => openModal(row, 'assign-students')}
      >
        <i className="ti ti-users" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Assign Coach" ariaLabel="Assign Coach"
        onClick={() => openModal(row, 'assign-coach')}
      >
        <i className="ti ti-user-star" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Practice Schedule" ariaLabel="Practice Schedule"
        onClick={() => openModal(row, 'practice')}
      >
        <i className="ti ti-clock" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Competition Calendar" ariaLabel="Competition Calendar"
        onClick={() => openModal(row, 'competitions')}
      >
        <i className="ti ti-calendar-star" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Achievements" ariaLabel="Achievements"
        onClick={() => openModal(row, 'achievements')}
      >
        <i className="ti ti-trophy" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Performance Report" ariaLabel="Performance Report"
        onClick={() => push(`Performance report generated for ${row.name}`, 'info')}
      >
        <i className="ti ti-report-analytics" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Duplicate" ariaLabel="Duplicate" onClick={() => duplicate(row)}>
        <i className="ti ti-copy" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print" ariaLabel="Print" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Archive Sport" ariaLabel="Archive Sport"
        onClick={() => setStatus([row.id], 'Archived', 'archived')}
      >
        <i className="ti ti-archive" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete Sport" ariaLabel="Delete Sport" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Sport) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium">
            <i className="ti ti-file-description" />Sport Description
          </h4>
          <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-user-star" />Coach Information</h5>
          <ul className="list-unstyled fs-12 mb-0">
            <li className="d-flex align-items-center gap-2 py-1">
              <span className="avatar avatar-xs">
                <ImageWithBasePath src={row.coachAvatar} className="rounded-circle flex-shrink-0" alt={row.coach} />
              </span>
              <span>
                <span className="fw-medium text-dark">{row.coach}</span>{' '}
                <span className="text-muted">· Head Coach</span>
              </span>
            </li>
            <li className="d-flex align-items-center gap-2 py-1">
              <span className="avatar avatar-xs avatar-icon bg-primary-transparent text-primary">
                <i className="ti ti-user" />
              </span>
              <span>
                <span className="fw-medium text-dark">{row.assistant}</span>{' '}
                <span className="text-muted">· Assistant</span>
              </span>
            </li>
          </ul>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-clock" />Training Schedule</h6>
          <p className="fs-12 text-muted mb-3">{trainingOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-users" />Team Members</h6>
          <p className="fs-12 text-muted mb-0">
            <span className="fw-semibold text-dark">{row.students}</span> students registered in {row.team}.
          </p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-calendar-star" />Upcoming Competitions</h6>
          <p className="fs-12 text-muted mb-3">{competitionsInfoOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-trophy" />Achievements</h6>
          <p className="fs-12 text-muted mb-0">
            <span className="fw-semibold text-dark">{row.achievements}</span> titles &amp; medals won to date.
          </p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-tools" />Equipment Requirements</h6>
          <p className="fs-12 text-muted mb-3">{equipmentOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-notes" />Notes</h6>
          <p className="fs-12 text-muted mb-2">{notesOf(row)}</p>
          <div className="d-flex gap-2">
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />View
            </button>
            <button
              type="button" className="btn btn-primary btn-sm flex-fill"
              onClick={() => openModal(row, 'assign-students')}
            >
              <i className="ti ti-users me-1" />Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Sports"
            section="Management"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import
                  </ActionLink>
                </div>
                <ExportMenu small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => window.print()}
                  >
                    <i className="ti ti-printer me-2" />Print
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Sport
                  </ActionLink>
                </div>
              </>
            }
          />

          <CardWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="classWorkspace"
            searchPlaceholder="Search sports, code, team, coach or venue…"
            searchLabel="Search sports"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="sports"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Sports refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print"
                aria-label="Print"
                onClick={() => window.print()}
              >
                <i className="ti ti-printer" />
              </button>
            }
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-ball-football-off"
            emptyTitle="No sports match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Sports list with team, coach and participation details"
            selectAllLabel="Select all sports"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <SportModals
        active={activeModal}
        row={modalRow}
        deleteCount={targetIds.length}
        onClose={() => setActiveModal(null)}
        onCreate={createSport}
        onUpdate={updateSport}
        onAssignCoach={assignCoach}
        onAssignStudents={assignStudents}
        onSavePractice={savePractice}
        onAddCompetition={addCompetition}
        onAddAchievement={addAchievement}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onDelete={removeSports}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default Sports;
