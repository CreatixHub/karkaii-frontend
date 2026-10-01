import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink, ExportMenu, PageHeader, WorkspaceShell, useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef, ExportFormat, FilterField, QuickFilter, SavedView, SortOption, SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import TaskModals from './modals/TaskModals';
import type { PausePayload, RunPayload, TaskDraft, TaskModalId } from './modals/TaskModals';
import type { Cadence, Category, Task } from './data/tasks.data';
import {
  REGISTER_TIME, SUMMARY_TOTALS, TOTAL_COUNT, averageDurationOf, cadenceIcon, cadenceOptions,
  categoryBadge, categoryIcon, categoryOptions, driftLabelOf, dueInOf, dueLabelOf, hasRun,
  intervalOf, isDrifting, isFailing, isFrequent, isOverdue, isPaused, isRunning, lastRunLabelOf,
  ownerOptions, runPairsOf, schedulePairsOf, scheduleLabelOf, searchIndexOf, secondsText,
  statusBadge, statusIcon, statusOf, statusOptions, statusPill, successRateOf,
  tasks as initialRows,
} from './data/tasks.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'cadence', label: 'Cadence', kind: 'select', chipLabel: 'Cadence', options: cadenceOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'owner', label: 'Owner', kind: 'select', chipLabel: 'Owner', options: ownerOptions },
];

const sortOptions: SortOption[] = [
  { id: 'due', label: 'Due soonest', icon: 'ti ti-clock' },
  { id: 'recent', label: 'Recently run', icon: 'ti ti-history' },
  { id: 'duration', label: 'Longest running', icon: 'ti ti-hourglass' },
  { id: 'drift', label: 'Biggest drift', icon: 'ti ti-chart-line' },
  { id: 'name', label: 'Task name', icon: 'ti ti-abc' },
];

const ScheduledTasksPage = () => {
  const [rows, setRows] = useState<Task[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TaskModalId | null>(null);
  const [modalRow, setModalRow] = useState<Task | null>(null);
  const [panelRow, setPanelRow] = useState<Task | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Task | null, modal: TaskModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Task) => Task, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        id: 'task',
        label: 'Task',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0 me-2">
              <i className={categoryIcon[row.category]} />
            </span>
            <div className="overflow-hidden">
              <ActionLink className="dt-name" onClick={() => setPanelRow(row)}>{row.name}</ActionLink>
              <div className="dt-sub text-truncate">{row.id} · {row.target}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'category',
        label: 'Category',
        sortable: true,
        render: (row) => <span className={categoryBadge[row.category]}>{row.category}</span>,
      },
      {
        id: 'cadence',
        label: 'Runs',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">
              <i className={`${cadenceIcon[row.cadence]} me-1`} />{scheduleLabelOf(row)}
            </span>
            <span className="fs-12 text-muted text-nowrap">
              {row.catchUp ? 'Catches up if missed' : 'Skips a missed slot'}
            </span>
          </>
        ),
      },
      {
        id: 'recent',
        label: 'Last Run',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{lastRunLabelOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">
              {secondsText(row.lastDurationSec)}
              {/* Against the task's own average, not a fixed expectation. */}
              {isDrifting(row) ? ` · ${driftLabelOf(row)}` : ''}
            </span>
          </>
        ),
      },
      {
        id: 'due',
        label: 'Next Run',
        sortable: true,
        render: (row) => (
          <>
            <span className={`d-block fs-13 text-nowrap ${isOverdue(row) ? 'text-warning fw-medium' : ''}`}>
              {dueLabelOf(row)}
            </span>
            <span className="fs-12 text-muted text-nowrap">
              every {secondsText(intervalOf(row.cadence) * 60).replace('s', '')}
            </span>
          </>
        ),
      },
      {
        id: 'duration',
        label: 'Health',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">
              {hasRun(row) ? `${successRateOf(row)}% clean` : 'Never run'}
            </span>
            <span className="fs-12 text-muted text-nowrap">
              {row.runs.toLocaleString()} runs · avg {secondsText(averageDurationOf(row))}
            </span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <>
            <span className={`dt-pill ${statusPill[statusOf(row)]}`}>
              <span className="dt-pill-dot" />{statusOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{row.owner}</span>
          </>
        ),
      },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Task>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.cadence && row.cadence !== filters.cadence) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters.owner && row.owner !== filters.owner) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'overdue') return isOverdue(row);
      if (quick === 'failing') return isFailing(row);
      if (quick === 'paused') return isPaused(row);
      if (quick === 'drift') return isDrifting(row);
      return isFrequent(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'overdue': return isOverdue(row);
        case 'failing': return isFailing(row);
        case 'paused': return isPaused(row);
        case 'today': return hasRun(row) && row.lastRunAgo <= 1440;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'recent':
          return a.lastRunAgo - b.lastRunAgo;
        case 'duration':
          return averageDurationOf(b) - averageDurationOf(a) || a.name.localeCompare(b.name);
        case 'drift':
          return Math.abs(Number(driftLabelOf(b).replace(/\D/g, '') || 0))
            - Math.abs(Number(driftLabelOf(a).replace(/\D/g, '') || 0));
        case 'name':
        case 'task':
          return a.name.localeCompare(b.name);
        // Whatever is due next, or most overdue, first.
        case 'due':
        default:
          return dueInOf(a) - dueInOf(b) || a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'due',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Task) => boolean) => rows.filter(test).length,
    [rows],
  );

  const shift = useCallback(
    (base: number, test: (row: Task) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Tasks', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy(isOverdue) },
      { id: 'failing', label: 'Failing', icon: 'ti ti-x', count: countBy(isFailing) },
      { id: 'paused', label: 'Paused', icon: 'ti ti-player-pause', count: countBy(isPaused) },
      {
        id: 'today', label: 'Ran Today', icon: 'ti ti-history',
        count: countBy((row) => hasRun(row) && row.lastRunAgo <= 1440),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'overdue', label: 'Overdue', icon: 'ti ti-alert-triangle', count: countBy(isOverdue) },
      { id: 'failing', label: 'Failing', icon: 'ti ti-x', count: countBy(isFailing) },
      { id: 'paused', label: 'Paused', icon: 'ti ti-player-pause', count: countBy(isPaused) },
      { id: 'drift', label: 'Drifting', icon: 'ti ti-chart-line', count: countBy(isDrifting) },
      { id: 'frequent', label: 'High frequency', icon: 'ti ti-rotate', count: countBy(isFrequent) },
    ],
    [countBy, rows.length],
  );

  /**
   * The board holds 28 tasks; this page lists ten. The published totals stand
   * and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const runs = rows.reduce((total, row) => total + row.runs, 0);
    const failures = rows.reduce((total, row) => total + row.failures, 0);
    const overall = runs > 0 ? Math.round(((runs - failures) / runs) * 100) : 0;
    const workSec = rows.reduce(
      (total, row) => total + averageDurationOf(row) * (10_080 / intervalOf(row.cadence)),
      0,
    );
    return [
      {
        id: 'tasks', tint: 'primary', icon: 'ti ti-clock-cog', label: 'Scheduled Tasks',
        value: String(SUMMARY_TOTALS.tasks - initialRows.length + rows.length),
        hint: `board as at ${REGISTER_TIME}`,
      },
      {
        id: 'scheduled', tint: 'success', icon: 'ti ti-clock', label: 'On Schedule',
        value: String(shift(SUMMARY_TOTALS.scheduled, (row) => statusOf(row) === 'Scheduled')),
        hint: 'running to their cadence',
      },
      {
        id: 'overdue', tint: 'warning', icon: 'ti ti-alert-triangle', label: 'Overdue',
        value: String(shift(SUMMARY_TOTALS.overdue, isOverdue)), hint: 'past their slot',
      },
      {
        id: 'failing', tint: 'danger', icon: 'ti ti-x', label: 'Failing',
        value: String(shift(SUMMARY_TOTALS.failing, isFailing)), hint: 'the last run threw',
      },
      {
        id: 'load', tint: 'info', icon: 'ti ti-server-cog', label: 'Weekly Load',
        // Average duration × runs a week, across the board.
        value: secondsText(Math.round(workSec)),
        hint: `${overall}% of runs complete cleanly`,
      },
    ];
  }, [rows, shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const create = useCallback(
    (draft: TaskDraft) => {
      if (!draft.name.trim()) {
        push('Give the task a name', 'warning');
        return;
      }
      const id = `TSK-${11 + rows.length}`;
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          description: draft.description.trim() || 'No description yet.',
          category: draft.category as Category,
          cadence: draft.cadence as Cadence,
          atTime: draft.atTime, onDay: draft.onDay,
          // A new task has never run and starts paused.
          lastRunAgo: -1, lastDurationSec: 0, totalSec: 0, runs: 0, failures: 0,
          running: false, paused: true, lastError: '',
          owner: draft.owner, target: draft.target.trim() || 'Not set',
          catchUp: draft.catchUp,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} created paused — resume it to start the schedule`);
    },
    [push, rows.length],
  );

  const schedule = useCallback(
    (draft: TaskDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          description: draft.description.trim() || row.description,
          category: draft.category as Category,
          cadence: draft.cadence as Cadence,
          atTime: draft.atTime,
          onDay: draft.onDay,
          owner: draft.owner,
          target: draft.target.trim() || row.target,
          catchUp: draft.catchUp,
        }),
        `${modalRow?.name ?? 'Task'} now runs ${draft.cadence.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const run = useCallback(
    (payload: RunPayload) => {
      if (!modalRow) return;
      if (payload.dryRun) {
        setActiveModal(null);
        push(
          `Dry run of ${modalRow.name} completed in ${secondsText(averageDurationOf(modalRow))} — nothing written`,
        );
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          // An out-of-band run counts, but does not move the schedule.
          lastRunAgo: 0,
          lastDurationSec: averageDurationOf(row) || row.lastDurationSec,
          totalSec: row.totalSec + (averageDurationOf(row) || row.lastDurationSec),
          runs: row.runs + 1,
          running: false,
          lastError: '',
        }),
        `${modalRow.name} ran in ${secondsText(averageDurationOf(modalRow) || modalRow.lastDurationSec)}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const pause = useCallback(
    (payload: PausePayload) => {
      const wasPaused = modalRow?.paused ?? false;
      patchRow(
        (row) => ({ ...row, paused: !wasPaused }),
        wasPaused
          ? `${modalRow?.name ?? 'Task'} resumed`
          : `${modalRow?.name ?? 'Task'} paused · ${payload.resumeOn.toLowerCase()}`,
      );
    },
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} tasks exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Task) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View task" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Run history" onClick={() => openModal(row, 'history')}>
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Change the schedule" onClick={() => openModal(row, 'schedule')}>
        <i className="ti ti-clock-cog" />
      </ActionLink>
      {/* A task already in flight cannot be started again. */}
      {!isRunning(row) ? (
        <ActionLink className="dt-ib success" ariaLabel="Run now" onClick={() => openModal(row, 'run')}>
          <i className="ti ti-player-play" />
        </ActionLink>
      ) : null}
      <ActionLink
        className="dt-ib"
        ariaLabel={row.paused ? 'Resume task' : 'Pause task'}
        onClick={() => openModal(row, 'pause')}
      >
        <i className={row.paused ? 'ti ti-player-play' : 'ti ti-player-pause'} />
      </ActionLink>
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) =>
    pairs.map((pair, index) => (
      <div
        className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
        key={pair.label}
      >
        <span className="fs-13 text-muted">{pair.label}</span>
        <span className="fs-13 fw-medium text-end">{pair.value}</span>
      </div>
    ));

  const renderDetail = (row: Task) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock-cog text-primary me-1" />Schedule</h6>
        {pairList(schedulePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-history text-info me-1" />Runs</h6>
        {pairList(runPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-info-circle text-secondary me-1" />What it does</h6>
        <p className="fs-13 text-muted mb-3">{row.description}</p>
        {row.lastError ? (
          <div className="alert alert-light border d-flex align-items-start gap-2 mb-0">
            <i className="ti ti-alert-circle fs-16 mt-1" />
            <span className="fs-13">{row.lastError}</span>
          </div>
        ) : null}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-bolt text-warning me-1" />Now</h6>
        <div className="border rounded p-2 mb-3">
          <p className="fs-13 mb-1">{dueLabelOf(row)}</p>
          <span className="fs-12 text-muted">
            Last run {lastRunLabelOf(row).toLowerCase()} · {secondsText(row.lastDurationSec)}
          </span>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          {!isRunning(row) ? (
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, 'run')}
            >
              <i className="ti ti-player-play me-1" />Run now
            </button>
          ) : null}
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'pause')}
          >
            <i className={`${row.paused ? 'ti ti-player-play' : 'ti ti-player-pause'} me-1`} />
            {row.paused ? 'Resume' : 'Pause'}
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'history')}
          >
            <i className="ti ti-history me-1" />History
          </button>
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
            title="Scheduled Tasks"
            section="Automation"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  {/* The event-driven half of automation lives next door. */}
                  <Link
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    to={routes.triggerActions}
                  >
                    <i className="ti ti-plug-connected me-2" />Trigger Actions
                  </Link>
                </div>
                <ExportMenu printLabel="Print Task Board" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Task
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_COUNT - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`board as at ${REGISTER_TIME}`}
            workspaceId="tskWorkspace"
            searchPlaceholder="Search task, category or target…"
            searchLabel="Search scheduled tasks"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="tasks"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Task board refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-clock-off"
            emptyTitle="No tasks match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Task panel */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title={panelRow ? panelRow.name : 'Task'}
            labelledById="tsk_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className={categoryBadge[panelRow.category]}>{panelRow.category}</span>
                  <span className={statusBadge[statusOf(panelRow)]}>
                    <i className={`${statusIcon[statusOf(panelRow)]} me-1`} />{statusOf(panelRow)}
                  </span>
                  <span className="badge badge-soft-secondary">
                    <i className={`${cadenceIcon[panelRow.cadence]} me-1`} />{panelRow.cadence}
                  </span>
                </div>
                <p className="fs-13 text-muted mb-3">{panelRow.description}</p>

                <div className="row g-3 mb-3">
                  {[
                    { label: 'Next run', value: dueLabelOf(panelRow).replace('Due in ', ''), tint: 'primary' },
                    { label: 'Last run', value: lastRunLabelOf(panelRow), tint: 'info' },
                    { label: 'Took', value: secondsText(panelRow.lastDurationSec), tint: 'secondary' },
                    {
                      label: 'Clean',
                      value: hasRun(panelRow) ? `${successRateOf(panelRow)}%` : '—',
                      tint: 'success',
                    },
                  ].map((tile) => (
                    <div className="col-6" key={tile.label}>
                      <div className="border rounded p-3 text-center">
                        <h6 className={`fs-14 mb-0 text-${tile.tint}`}>{tile.value}</h6>
                        <span className="fs-12 text-muted">{tile.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Schedule</h6>
                <div className="border rounded p-3 mb-3">{pairList(schedulePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Runs</h6>
                <div className="border rounded p-3 mb-3">{pairList(runPairsOf(panelRow))}</div>

                {panelRow.lastError ? (
                  <>
                    <h6 className="fs-14 mb-2">Last error</h6>
                    <div className="alert alert-light border d-flex align-items-start gap-2 mb-3">
                      <i className="ti ti-alert-circle fs-16 mt-1" />
                      <span className="fs-13">{panelRow.lastError}</span>
                    </div>
                  </>
                ) : null}

                <div className="d-flex align-items-center flex-wrap gap-2">
                  {!isRunning(panelRow) ? (
                    <button
                      type="button" className="btn btn-primary btn-sm"
                      onClick={() => { setPanelRow(null); openModal(panelRow, 'run'); }}
                    >
                      <i className="ti ti-player-play me-1" />Run now
                    </button>
                  ) : null}
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'schedule'); }}
                  >
                    <i className="ti ti-clock-cog me-1" />Change the schedule
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'pause'); }}
                  >
                    <i className={`${panelRow.paused ? 'ti ti-player-play' : 'ti ti-player-pause'} me-1`} />
                    {panelRow.paused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <TaskModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={create}
        onSchedule={schedule}
        onRun={run}
        onPause={pause}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="tskToasts" />
    </>
  );
};

export default ScheduledTasksPage;
