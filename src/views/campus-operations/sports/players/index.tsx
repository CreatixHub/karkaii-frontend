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
import PlayerModals from './modals/PlayerModals';
import type { PlayerDraft, PlayerModalId } from './modals/PlayerModals';
import type { MedicalStatus, Player, PlayerStatus, SkillLevel } from './data/players.data';
import {
  SPORT_ICON, academicYearOptions, achievementsLineOf, attendanceTint, availabilityOptions,
  classOptions, coachOptions, fitnessOf, genderOptions, medicalIcon,
  medicalOptions, medicalTint, players as initialRows, recencyKey, remarksOf, searchIndexOf,
  sectionOptions, skillOptions, skillTint, skillWidth, sportOptions, sportsProfileOf,
  statusIcon, statusPill, studentLineOf, teamOptions, PARENT_NOTE,
} from './data/players.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'sport', label: 'Sport', kind: 'select', chipLabel: 'Sport', options: sportOptions },
  { id: 'team', label: 'Team', kind: 'select', chipLabel: 'Team', options: teamOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'coach', label: 'Coach', kind: 'select', chipLabel: 'Coach', options: coachOptions },
  { id: 'gender', label: 'Gender', kind: 'select', chipLabel: 'Gender', options: genderOptions },
  { id: 'skill-level', label: 'Skill Level', kind: 'select', chipLabel: 'Skill', options: skillOptions },
  { id: 'availability', label: 'Availability', kind: 'select', chipLabel: 'Availability', options: availabilityOptions },
  { id: 'medical-status', label: 'Medical Status', kind: 'select', chipLabel: 'Medical', options: medicalOptions },
  { id: 'academic-year', label: 'Academic Year', kind: 'select', chipLabel: 'Year', options: academicYearOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Player Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'sport', label: 'Sport', icon: 'ti ti-ball-football' },
  { id: 'attendance', label: 'Attendance', icon: 'ti ti-calendar-stats' },
  { id: 'achieve', label: 'Achievements', icon: 'ti ti-trophy' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: PlayerStatus; label: string; icon: string }[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Available', label: 'Available', icon: 'ti ti-user-check' },
  { id: 'In Training', label: 'In Training', icon: 'ti ti-run' },
  { id: 'Injured', label: 'Injured', icon: 'ti ti-first-aid-kit' },
  { id: 'Suspended', label: 'Suspended', icon: 'ti ti-player-pause' },
];

const Players = () => {
  const [rows, setRows] = useState<Player[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<PlayerModalId | null>(null);
  const [modalRow, setModalRow] = useState<Player | null>(null);
  /** Rows a dialog will write to — one row, or a whole bulk selection. */
  const [targetIds, setTargetIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Player | null, modal: PlayerModalId) => {
    setModalRow(row);
    setTargetIds(row ? [row.id] : []);
    setActiveModal(modal);
  }, []);

  /** Bulk dialogs open seeded from the first selected player and write to all. */
  const openBulkModal = useCallback(
    (ids: string[], modal: PlayerModalId) => {
      setModalRow(rows.find((row) => ids.includes(row.id)) ?? null);
      setTargetIds(ids);
      setActiveModal(modal);
    },
    [rows],
  );

  /** Applies a change to every row the open dialog targets. */
  const patchRows = useCallback(
    (change: (row: Player) => Player, message: string, keepOpen = false) => {
      if (targetIds.length === 0) return;
      setRows((current) => current.map((row) => (targetIds.includes(row.id) ? change(row) : row)));
      if (!keepOpen) setActiveModal(null);
      push(message);
    },
    [push, targetIds],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Player>[]>(
    () => [
      {
        id: 'player',
        label: 'Player',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <Link to={routes.studentDetail} className="dt-avatar">
              <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
            </Link>
            <div>
              <Link to={routes.studentDetail} className="dt-name">{row.name}</Link>
              <div className="dt-sub">
                <span className="link-primary dt-adm">{row.admission}</span>
                <span className="dt-dot">·</span>
                <span>Roll <span className="dt-roll-val">{row.roll}</span></span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className="badge badge-soft-primary">
                  <i className="ti ti-school me-1" />Class <span className="dt-acls">{row.classLevel}</span>-{row.section}
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
        id: 'sport',
        label: 'Sport Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1">
              <span className="badge badge-soft-primary dt-sport">
                <i className={`${SPORT_ICON} me-1`} />{row.sport}
              </span>{' '}
              <span className="badge badge-soft-info dt-team">{row.team}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-map-pin me-1" />Position{' '}
              <span className="fw-medium text-dark dt-position">{row.position}</span>{' '}
              <span className="badge badge-soft-dark ms-1">
                <i className="ti ti-shirt-sport me-1" />#<span className="dt-jersey">{row.jersey}</span>
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
          </ul>
        ),
      },
      {
        id: 'profile',
        label: 'Player Profile',
        sortable: true,
        render: (row) => {
          const fitness = fitnessOf(row.medical);
          return (
            <>
              <div className="d-flex align-items-center justify-content-between mb-1">
                <span className="fw-semibold fs-12 dt-skill">{row.skill}</span>
                <span className="fs-12 text-muted">
                  Attendance{' '}
                  <span className={`text-${attendanceTint(row.attendance)} fw-medium`}>
                    <span className="dt-attend-val">{row.attendance}</span>%
                  </span>
                </span>
              </div>
              <div className={`meter meter-${skillTint[row.skill]}`}>
                <span style={{ width: `${skillWidth[row.skill]}%` }} />
              </div>
              <div className="d-flex flex-wrap gap-1 mt-2">
                <span className={`badge badge-soft-${fitness.tint}`}>
                  <i className={`${fitness.icon} me-1`} />{fitness.label}
                </span>
                <span className={`badge badge-soft-${medicalTint[row.medical]}`}>
                  <i className={`${medicalIcon[row.medical]} me-1`} />{row.medical}
                </span>
                <span className="badge badge-soft-warning">
                  <i className="ti ti-trophy me-1" />
                  <span className="dt-achieve-val">{row.achievements}</span>
                </span>
              </div>
            </>
          );
        },
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
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Player>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.sport && row.sport !== filters.sport) return false;
      if (filters.team && row.team !== filters.team) return false;
      if (filters.class && row.classLevel !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters.coach && row.coach !== filters.coach) return false;
      if (filters.gender && row.gender !== filters.gender) return false;
      if (filters['skill-level'] && row.skill !== filters['skill-level']) return false;
      if (filters.availability && row.availability !== filters.availability) return false;
      if (filters['medical-status'] && row.medical !== filters['medical-status']) return false;
      if (filters['academic-year'] && row.academicYear !== filters['academic-year']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'sport':
          return a.sport.localeCompare(b.sport) || a.name.localeCompare(b.name);
        case 'attendance':
          return b.attendance - a.attendance || a.name.localeCompare(b.name);
        case 'achieve':
          return b.achievements - a.achievements || a.name.localeCompare(b.name);
        // Not in the sort menu, but the Profile and Status `<th>`s are sortable.
        case 'profile':
          return b.attendance - a.attendance || a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        case 'recent':
          return recencyKey(a) - recencyKey(b);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so suspending a player moves both rails. */
  const countBy = useCallback(
    (status: PlayerStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Players', icon: 'ti ti-layout-list', count: rows.length },
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

  const createPlayer = useCallback(
    (draft: PlayerDraft) => {
      if (!draft.name.trim()) {
        push('Give the player a name', 'warning');
        return;
      }
      const admission = draft.admission.trim() || `AD2024${String(rows.length + 12).padStart(2, '0')}`;
      setRows((current) => [
        {
          id: admission,
          admission,
          name: draft.name.trim(),
          avatar: 'assets/img/students/student-01.jpg',
          roll: toNumber(draft.roll, 0),
          classLevel: draft.classLevel,
          section: draft.section,
          gender: draft.gender as Player['gender'],
          sport: draft.sport,
          team: draft.team,
          position: draft.position.trim() || 'Squad',
          jersey: draft.jersey.trim() || '00',
          coach: draft.coach,
          coachAvatar: 'assets/img/teachers/teacher-01.jpg',
          skill: draft.skill as SkillLevel,
          attendance: toNumber(draft.attendance, 0),
          medical: draft.medical as MedicalStatus,
          achievements: toNumber(draft.achievements, 0),
          availability: draft.availability as Player['availability'],
          academicYear: draft.academicYear,
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added`);
    },
    [push, rows.length],
  );

  const updatePlayer = useCallback(
    (draft: PlayerDraft) =>
      patchRows(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          admission: draft.admission.trim() || row.admission,
          roll: toNumber(draft.roll, row.roll),
          classLevel: draft.classLevel,
          section: draft.section,
          gender: draft.gender as Player['gender'],
          sport: draft.sport,
          team: draft.team,
          position: draft.position.trim() || row.position,
          jersey: draft.jersey.trim() || row.jersey,
          coach: draft.coach || row.coach,
          skill: draft.skill as SkillLevel,
          attendance: toNumber(draft.attendance, row.attendance),
          medical: draft.medical as MedicalStatus,
          achievements: toNumber(draft.achievements, row.achievements),
          availability: draft.availability as Player['availability'],
          academicYear: draft.academicYear,
          status: draft.status,
        }),
        `${modalRow?.name ?? 'Player'} updated`,
      ),
    [modalRow, patchRows],
  );

  /** "Football — Senior XI" carries both halves of the assignment. */
  const assignTeam = useCallback(
    (teamChoice: string, position: string, jersey: string) => {
      if (!teamChoice) {
        push('Pick a team to assign', 'warning');
        return;
      }
      const [sport, team] = teamChoice.split('—').map((part) => part.trim());
      patchRows(
        (row) => ({
          ...row,
          sport: sport || row.sport,
          team: team || row.team,
          position: position.trim() || row.position,
          jersey: jersey.trim() || row.jersey,
        }),
        `${targetIds.length > 1 ? `${targetIds.length} players` : modalRow?.name ?? 'Player'} assigned to ${team ?? teamChoice}`,
      );
    },
    [modalRow, patchRows, push, targetIds.length],
  );

  const assignCoach = useCallback(
    (coach: string) => {
      if (!coach) {
        push('Pick a coach to assign', 'warning');
        return;
      }
      patchRows(
        (row) => ({ ...row, coach }),
        `${coach} assigned to ${targetIds.length > 1 ? `${targetIds.length} players` : modalRow?.name ?? 'the player'}`,
      );
    },
    [modalRow, patchRows, push, targetIds.length],
  );

  /**
   * Clearance drives the fitness badge, and a player who is no longer cleared
   * cannot stay in training — the roster's own rule, applied here so the status
   * pill and the medical badges never disagree.
   */
  const saveClearance = useCallback(
    (medical: MedicalStatus) =>
      patchRows(
        (row) => ({
          ...row,
          medical,
          status:
            medical === 'Cleared' && row.status === 'Injured'
              ? 'Active'
              : medical === 'Pending' && row.status === 'Active'
                ? 'Injured'
                : row.status,
        }),
        `Medical clearance updated for ${modalRow?.name ?? 'the player'}`,
      ),
    [modalRow, patchRows],
  );

  /** The generated medal table follows the count, so bumping it adds the row. */
  const addAchievement = useCallback(
    () => patchRows(
      (row) => ({ ...row, achievements: row.achievements + 1 }),
      `Achievement recorded for ${modalRow?.name ?? 'the player'}`,
      true,
    ),
    [modalRow, patchRows],
  );

  const setStatus = useCallback(
    (ids: string[], status: PlayerStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'player' : 'players'} ${verb}`);
    },
    [push, workspace],
  );

  const removePlayers = useCallback(() => {
    setRows((current) => current.filter((row) => !targetIds.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${targetIds.length} ${targetIds.length === 1 ? 'player' : 'players'} deleted`);
  }, [push, targetIds, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} players exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'team', label: 'Assign Team', icon: 'ti ti-shirt-sport', onClick: (ids) => openBulkModal(ids, 'team') },
      { id: 'coach', label: 'Assign Coach', icon: 'ti ti-user-star', onClick: (ids) => openBulkModal(ids, 'coach') },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} players exported`) },
      { id: 'print', label: 'Print Profiles', icon: 'ti ti-printer', onClick: () => window.print() },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setModalRow(null); setTargetIds(ids); setActiveModal('delete'); },
      },
    ],
    [openBulkModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Player) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Player" ariaLabel="View Player" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Profile" ariaLabel="Edit Profile" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Team" ariaLabel="Assign Team" onClick={() => openModal(row, 'team')}>
        <i className="ti ti-shirt-sport" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Assign Coach" ariaLabel="Assign Coach" onClick={() => openModal(row, 'coach')}>
        <i className="ti ti-user-star" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Performance Report" ariaLabel="Performance Report"
        onClick={() => openModal(row, 'performance')}
      >
        <i className="ti ti-report-analytics" />
      </ActionLink>
      <Link className="dt-ib" title="Attendance History" aria-label="Attendance History" to={routes.studentAttendance}>
        <i className="ti ti-calendar-stats" />
      </Link>
      <ActionLink
        className="dt-ib" title="Medical Record" ariaLabel="Medical Record"
        onClick={() => openModal(row, 'medical')}
      >
        <i className="ti ti-first-aid-kit" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Achievements" ariaLabel="Achievements"
        onClick={() => openModal(row, 'achievements')}
      >
        <i className="ti ti-trophy" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Training Schedule" ariaLabel="Training Schedule"
        onClick={() => push(`${row.team} trains on the ${row.sport} schedule`, 'info')}
      >
        <i className="ti ti-clock" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Profile" ariaLabel="Print Profile" onClick={() => window.print()}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Export Profile" ariaLabel="Export Profile"
        onClick={() => push(`${row.name}'s profile exported`)}
      >
        <i className="ti ti-file-export" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Suspend Player" ariaLabel="Suspend Player"
        onClick={() => setStatus([row.id], 'Suspended', 'suspended')}
      >
        <i className="ti ti-player-pause" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Archive" ariaLabel="Archive"
        onClick={() => setStatus([row.id], 'Archived', 'archived')}
      >
        <i className="ti ti-archive" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Player) => {
    const fitness = fitnessOf(row.medical);
    return (
      <div className="dt-detail-inner">
        <div className="row g-4">
          <div className="col-xl-3 col-md-6">
            <h4 className="details-heading fs-15 fw-medium">
              <i className="ti ti-user" />Student Information
            </h4>
            <ul className="list-unstyled fs-12 text-muted mb-3">
              <li className="py-1">
                <span className="text-dark fw-medium">{row.name}</span> · {row.admission}
              </li>
              <li className="py-1">{studentLineOf(row)}</li>
            </ul>
            <h5 className="details-heading fs-15"><i className="ti ti-ball-football" />Sports Profile</h5>
            <p className="fs-12 text-muted mb-0">{sportsProfileOf(row)}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-chart-bar" />Performance Statistics</h6>
            <ul className="list-unstyled fs-12 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Skill Level</span>
                <span className="fw-medium">{row.skill}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Achievements</span>
                <span className="fw-medium">{row.achievements}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Fitness</span>
                <span className="fw-medium">{fitness.label}</span>
              </li>
            </ul>
            <h6 className="details-heading"><i className="ti ti-calendar-stats" />Training Attendance</h6>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fs-12 text-muted">{row.attendance}% present</span>
            </div>
            <div className={`meter meter-${attendanceTint(row.attendance)}`}>
              <span style={{ width: `${row.attendance}%` }} />
            </div>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-first-aid-kit" />Medical History</h6>
            <div className="mb-3">
              <span className={`badge badge-soft-${medicalTint[row.medical]}`}>
                <i className={`${medicalIcon[row.medical]} me-1`} />{row.medical}
              </span>{' '}
              <span className={`badge badge-soft-${fitness.tint}`}>
                <i className={`${fitness.icon} me-1`} />{fitness.label}
              </span>
            </div>
            <h6 className="details-heading"><i className="ti ti-trophy" />Achievements</h6>
            <p className="fs-12 text-muted mb-0">
              <span className="fw-semibold text-dark">{row.achievements}</span> {achievementsLineOf(row)}
            </p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-message-dots" />Coach Remarks</h6>
            <p className="fs-12 text-muted mb-2">{remarksOf(row)}</p>
            <h6 className="details-heading"><i className="ti ti-users" />Parent Notes</h6>
            <p className="fs-12 text-muted mb-2">{PARENT_NOTE}</p>
            <div className="d-flex gap-2">
              <button
                type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
                onClick={() => openModal(row, 'view')}
              >
                <i className="ti ti-eye me-1" />View
              </button>
              <button
                type="button" className="btn btn-primary btn-sm flex-fill"
                onClick={() => openModal(row, 'team')}
              >
                <i className="ti ti-shirt-sport me-1" />Team
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Players"
            section="Management"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Players
                  </ActionLink>
                </div>
                <ExportMenu label="Export Players" small onExport={exportAs} />
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
                    <i className="ti ti-square-rounded-plus me-2" />Add Player
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
            searchPlaceholder="Search players, admission no, sport, team or coach…"
            searchLabel="Search players"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="players"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Players refreshed'); }}
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
            emptyIcon="ti ti-users-off"
            emptyTitle="No players match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Player list with sport details and player profile"
            selectAllLabel="Select all players"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <PlayerModals
        active={activeModal}
        row={modalRow}
        deleteCount={targetIds.length}
        onClose={() => setActiveModal(null)}
        onCreate={createPlayer}
        onUpdate={updatePlayer}
        onAssignTeam={assignTeam}
        onAssignCoach={assignCoach}
        onSaveClearance={saveClearance}
        onAddAchievement={addAchievement}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onDelete={removePlayers}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default Players;
