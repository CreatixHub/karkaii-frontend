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
import TriggerModals from './modals/TriggerModals';
import type { ArmPayload, TestPayload, TriggerDraft, TriggerModalId } from './modals/TriggerModals';
import type { ActionType, EventType, Module, TriggerAction } from './data/triggers.data';
import {
  REGISTER_DATE, SUMMARY_TOTALS, TOTAL_COUNT, actionIcon, actionOptions, averageLatencyOf,
  bindingOf, bindingPairsOf, dateKey, eventIcon, eventOptions, failedOf, firesPerDayOf, hasFired,
  healthBadge, healthOf, healthOptions, healthPill, healthSubLabelOf, isDraft, isFailing, isIdle,
  isPaused, isSlow, isTestMode, lastFiredLabelOf, latencyLabelOf, lifePairsOf, moduleIcon,
  moduleOptions, ownerOptions, runPairsOf, searchIndexOf, statusBadge, statusOf, statusOptions,
  successRateOf, triggerActions as initialRows,
} from './data/triggers.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'module', label: 'Module', kind: 'select', chipLabel: 'Module', options: moduleOptions },
  { id: 'event', label: 'Event', kind: 'select', chipLabel: 'Event', options: eventOptions },
  { id: 'action', label: 'Action', kind: 'select', chipLabel: 'Action', options: actionOptions },
  { id: 'health', label: 'Health', kind: 'select', chipLabel: 'Health', options: healthOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'owner', label: 'Owner', kind: 'select', chipLabel: 'Owner', options: ownerOptions },
];

const sortOptions: SortOption[] = [
  { id: 'fired', label: 'Most fired', icon: 'ti ti-bolt' },
  { id: 'health', label: 'Worst health', icon: 'ti ti-alert-triangle' },
  { id: 'latency', label: 'Slowest', icon: 'ti ti-hourglass' },
  { id: 'recent', label: 'Recently fired', icon: 'ti ti-clock' },
  { id: 'name', label: 'Binding name', icon: 'ti ti-abc' },
];

const healthRank: Record<string, number> = { Failing: 0, Degraded: 1, Idle: 2, Healthy: 3 };

const TriggerActionsPage = () => {
  const [rows, setRows] = useState<TriggerAction[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<TriggerModalId | null>(null);
  const [modalRow, setModalRow] = useState<TriggerAction | null>(null);
  const [panelRow, setPanelRow] = useState<TriggerAction | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: TriggerAction | null, modal: TriggerModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: TriggerAction) => TriggerAction, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<TriggerAction>[]>(
    () => [
      {
        id: 'binding',
        label: 'Binding',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md bg-primary-transparent text-primary rounded flex-shrink-0 me-2">
              <i className={moduleIcon[row.module]} />
            </span>
            <div className="overflow-hidden">
              <ActionLink className="dt-name" onClick={() => setPanelRow(row)}>{row.name}</ActionLink>
              <div className="dt-sub text-truncate">{row.id} · {row.module}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'event',
        label: 'On this event',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">
              <i className={`${eventIcon[row.event]} me-1`} />{row.event}
            </span>
            <span className="fs-12 text-muted d-block">{row.eventSource}</span>
          </>
        ),
      },
      {
        id: 'action',
        label: 'Run this action',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">
              <i className={`${actionIcon[row.action]} me-1`} />{row.action}
            </span>
            <span className="fs-12 text-muted d-block">{row.actionTarget}</span>
          </>
        ),
      },
      {
        id: 'fired',
        label: 'Fired',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.fired.toLocaleString()}</span>
            {/* Against the days it has been live. */}
            <span className="fs-12 text-muted text-nowrap">
              {hasFired(row) ? `${firesPerDayOf(row)} a day` : 'never'}
            </span>
          </>
        ),
      },
      {
        id: 'latency',
        label: 'Latency',
        sortable: true,
        render: (row) => (
          <>
            <span className={`d-block fs-13 text-nowrap ${isSlow(row) ? 'text-warning' : ''}`}>
              {latencyLabelOf(row)}
            </span>
            <span className="fs-12 text-muted text-nowrap">
              {hasFired(row) ? 'average' : '—'}
            </span>
          </>
        ),
      },
      {
        id: 'recent',
        label: 'Last Fired',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.lastFired || 'Never'}</span>
            <span className="fs-12 text-muted text-nowrap">{lastFiredLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'health',
        label: 'Health',
        render: (row) => (
          <>
            <span className={`dt-pill ${healthPill[healthOf(row)]}`}>
              <span className="dt-pill-dot" />{healthOf(row)}
            </span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{healthSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <>
            <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>
            {row.testMode ? (
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">Test mode</span>
            ) : null}
          </>
        ),
      },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<TriggerAction>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.module && row.module !== filters.module) return false;
      if (filters.event && row.event !== filters.event) return false;
      if (filters.action && row.action !== filters.action) return false;
      if (filters.health && healthOf(row) !== filters.health) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters.owner && row.owner !== filters.owner) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'failing') return isFailing(row);
      if (quick === 'idle') return isIdle(row);
      if (quick === 'slow') return isSlow(row);
      if (quick === 'paused') return isPaused(row);
      return isTestMode(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'failing': return isFailing(row);
        case 'idle': return isIdle(row);
        case 'slow': return isSlow(row);
        case 'paused': return isPaused(row) || isDraft(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'health':
          return healthRank[healthOf(a)] - healthRank[healthOf(b)] || failedOf(b) - failedOf(a);
        case 'latency':
          return averageLatencyOf(b) - averageLatencyOf(a) || a.name.localeCompare(b.name);
        case 'recent':
          return dateKey(b.lastFired) - dateKey(a.lastFired) || a.name.localeCompare(b.name);
        case 'name':
        case 'binding':
          return a.name.localeCompare(b.name);
        case 'fired':
        default:
          return b.fired - a.fired || a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'fired',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: TriggerAction) => boolean) => rows.filter(test).length,
    [rows],
  );

  const shift = useCallback(
    (base: number, test: (row: TriggerAction) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Bindings', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'failing', label: 'Failing', icon: 'ti ti-alert-triangle', count: countBy(isFailing) },
      { id: 'idle', label: 'Never Fired', icon: 'ti ti-clock-off', count: countBy(isIdle) },
      { id: 'slow', label: 'Slow Runs', icon: 'ti ti-hourglass', count: countBy(isSlow) },
      {
        id: 'paused', label: 'Paused & Drafts', icon: 'ti ti-player-pause',
        count: countBy((row) => isPaused(row) || isDraft(row)),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'failing', label: 'Failing', icon: 'ti ti-alert-triangle', count: countBy(isFailing) },
      { id: 'idle', label: 'Never fired', icon: 'ti ti-clock-off', count: countBy(isIdle) },
      { id: 'slow', label: 'Slow', icon: 'ti ti-hourglass', count: countBy(isSlow) },
      { id: 'paused', label: 'Paused', icon: 'ti ti-player-pause', count: countBy(isPaused) },
      { id: 'test', label: 'Test mode', icon: 'ti ti-flask', count: countBy(isTestMode) },
    ],
    [countBy, rows.length],
  );

  /**
   * The catalogue holds 42 bindings; this page lists ten. The template's totals
   * stand and the roster moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const fired = rows.reduce((total, row) => total + row.fired, 0);
    const failed = rows.reduce((total, row) => total + failedOf(row), 0);
    const overall = fired > 0 ? Math.round(((fired - failed) / fired) * 100) : 0;
    return [
      {
        id: 'bindings', tint: 'primary', icon: 'ti ti-plug-connected', label: 'Bindings',
        value: String(SUMMARY_TOTALS.bindings - initialRows.length + rows.length),
        hint: `catalogue as at ${REGISTER_DATE}`,
      },
      {
        id: 'enabled', tint: 'success', icon: 'ti ti-player-play', label: 'Armed',
        value: String(shift(SUMMARY_TOTALS.enabled, (row) => statusOf(row) === 'Enabled')),
        hint: 'reacting to events now',
      },
      {
        id: 'failing', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Failing',
        value: String(shift(SUMMARY_TOTALS.failing, isFailing)), hint: 'under 90% success',
      },
      {
        id: 'idle', tint: 'warning', icon: 'ti ti-clock-off', label: 'Never Fired',
        value: String(shift(SUMMARY_TOTALS.idle, isIdle)), hint: 'armed but silent',
      },
      {
        id: 'rate', tint: 'info', icon: 'ti ti-percentage', label: 'Overall Success',
        // Every run on the board, cleanly completed or not.
        value: `${overall}%`, hint: `${fired.toLocaleString()} runs counted`,
      },
    ];
  }, [rows, shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const create = useCallback(
    (draft: TriggerDraft) => {
      if (!draft.name.trim() || !draft.eventSource.trim()) {
        push('A binding needs a name and an event source', 'warning');
        return;
      }
      const id = `TRG-0${11 + rows.length}`;
      setRows((current) => [
        {
          id,
          name: draft.name.trim(),
          description: draft.description.trim() || 'No description yet.',
          module: draft.module as Module,
          event: draft.event as EventType,
          eventSource: draft.eventSource.trim(),
          action: draft.action as ActionType,
          actionTarget: draft.actionTarget.trim() || 'Not set',
          workflow: '',
          fired: 0, succeeded: 0, totalMs: 0,
          armedOn: REGISTER_DATE, lastFired: '', lastError: '',
          // A new binding arrives disarmed and in test mode.
          enabled: false, draft: true,
          owner: draft.owner, testMode: draft.testMode,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} created disarmed — arm it when you are ready`);
    },
    [push, rows.length],
  );

  const update = useCallback(
    (draft: TriggerDraft) =>
      patchRow(
        (row) => ({
          ...row,
          name: draft.name.trim() || row.name,
          description: draft.description.trim() || row.description,
          module: draft.module as Module,
          event: draft.event as EventType,
          eventSource: draft.eventSource.trim() || row.eventSource,
          action: draft.action as ActionType,
          actionTarget: draft.actionTarget.trim() || row.actionTarget,
          owner: draft.owner,
          testMode: draft.testMode,
        }),
        `${modalRow?.name ?? 'Binding'} updated`,
      ),
    [modalRow, patchRow],
  );

  const arm = useCallback(
    (payload: ArmPayload) => {
      const wasEnabled = modalRow?.enabled ?? false;
      patchRow(
        (row) => ({
          ...row,
          enabled: !wasEnabled,
          draft: false,
          testMode: payload.testMode,
          armedOn: wasEnabled ? row.armedOn : REGISTER_DATE,
        }),
        wasEnabled
          ? `${modalRow?.name ?? 'Binding'} paused`
          : `${modalRow?.name ?? 'Binding'} armed${payload.testMode ? ' in test mode' : ''}`,
      );
    },
    [modalRow, patchRow],
  );

  const test = useCallback(
    (payload: TestPayload) => {
      if (!modalRow) return;
      setActiveModal(null);
      push(
        modalRow.lastError
          ? `Test run against ${payload.sample.toLowerCase()} — still failing: ${modalRow.lastError}`
          : `Test run against ${payload.sample.toLowerCase()} — completed in ${latencyLabelOf(modalRow)}, nothing written`,
        modalRow.lastError ? 'warning' : 'success',
      );
    },
    [modalRow, push],
  );

  const remove = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.filter((row) => row.id !== modalRow.id));
    setActiveModal(null);
    push(`${modalRow.name} deleted`);
  }, [modalRow, push]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} bindings exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: TriggerAction) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View binding" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit binding" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Test binding" onClick={() => openModal(row, 'test')}>
        <i className="ti ti-flask" />
      </ActionLink>
      <ActionLink
        className={`dt-ib ${row.enabled ? '' : 'success'}`}
        ariaLabel={row.enabled ? 'Pause binding' : 'Arm binding'}
        onClick={() => openModal(row, 'arm')}
      >
        <i className={row.enabled ? 'ti ti-player-pause' : 'ti ti-player-play'} />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Delete binding" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash" />
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

  const renderDetail = (row: TriggerAction) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-plug-connected text-primary me-1" />Binding</h6>
        {pairList(bindingPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-bolt text-warning me-1" />Runs</h6>
        {pairList(runPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-history text-info me-1" />Life</h6>
        {pairList(lifePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-arrow-right text-secondary me-1" />Reads as</h6>
        <div className="border rounded p-2 mb-3">
          <p className="fs-13 mb-0">{bindingOf(row)}</p>
        </div>
        {row.lastError ? (
          <div className="alert alert-light border d-flex align-items-start gap-2 mb-3">
            <i className="ti ti-alert-circle fs-16 mt-1" />
            <span className="fs-13">{row.lastError}</span>
          </div>
        ) : null}
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-primary btn-sm"
            onClick={() => openModal(row, 'test')}
          >
            <i className="ti ti-flask me-1" />Test
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => openModal(row, 'arm')}
          >
            <i className={`${row.enabled ? 'ti ti-player-pause' : 'ti ti-player-play'} me-1`} />
            {row.enabled ? 'Pause' : 'Arm'}
          </button>
          {row.workflow ? (
            <Link className="btn btn-outline-light bg-white btn-sm" to={routes.workflowRules}>
              <i className="ti ti-route me-1" />Open the workflow
            </Link>
          ) : null}
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
            title="Trigger Actions"
            section="Automation"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  {/* The rules that use these bindings live next door. */}
                  <Link
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    to={routes.workflowRules}
                  >
                    <i className="ti ti-route me-2" />Workflow Rules
                  </Link>
                </div>
                <ExportMenu printLabel="Print Binding Catalogue" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Binding
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
            footerInfoSuffix={`catalogue as at ${REGISTER_DATE}`}
            workspaceId="trgWorkspace"
            searchPlaceholder="Search binding, event or action…"
            searchLabel="Search trigger actions"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="bindings"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Binding catalogue refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-plug-connected-x"
            emptyTitle="No bindings match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Binding panel */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title={panelRow ? panelRow.name : 'Binding'}
            labelledById="trg_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className="badge badge-soft-secondary">
                    <i className={`${moduleIcon[panelRow.module]} me-1`} />{panelRow.module}
                  </span>
                  <span className={statusBadge[statusOf(panelRow)]}>{statusOf(panelRow)}</span>
                  <span className={healthBadge[healthOf(panelRow)]}>{healthOf(panelRow)}</span>
                  {panelRow.testMode ? (
                    <span className="badge badge-soft-warning">Test mode</span>
                  ) : null}
                </div>
                <p className="fs-13 text-muted mb-3">{panelRow.description}</p>

                <div className="border rounded p-3 mb-3">
                  <h6 className="fs-13 mb-1">Reads as</h6>
                  <p className="fs-13 text-muted mb-0">{bindingOf(panelRow)}</p>
                </div>

                <div className="row g-3 mb-3">
                  {[
                    { label: 'Fired', value: panelRow.fired.toLocaleString(), tint: 'primary' },
                    {
                      label: 'Success',
                      value: hasFired(panelRow) ? `${successRateOf(panelRow)}%` : '—',
                      tint: 'success',
                    },
                    { label: 'Failed', value: String(failedOf(panelRow)), tint: 'danger' },
                    { label: 'Latency', value: latencyLabelOf(panelRow), tint: 'info' },
                  ].map((tile) => (
                    <div className="col-6" key={tile.label}>
                      <div className="border rounded p-3 text-center">
                        <h5 className={`fs-16 mb-0 text-${tile.tint}`}>{tile.value}</h5>
                        <span className="fs-12 text-muted">{tile.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Binding</h6>
                <div className="border rounded p-3 mb-3">{pairList(bindingPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Runs</h6>
                <div className="border rounded p-3 mb-3">{pairList(runPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Life</h6>
                <div className="border rounded p-3 mb-3">{pairList(lifePairsOf(panelRow))}</div>

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
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'test'); }}
                  >
                    <i className="ti ti-flask me-1" />Test
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'arm'); }}
                  >
                    <i className={`${panelRow.enabled ? 'ti ti-player-pause' : 'ti ti-player-play'} me-1`} />
                    {panelRow.enabled ? 'Pause' : 'Arm'}
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <TriggerModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={create}
        onUpdate={update}
        onArm={arm}
        onTest={test}
        onDelete={remove}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="trgToasts" />
    </>
  );
};

export default TriggerActionsPage;
