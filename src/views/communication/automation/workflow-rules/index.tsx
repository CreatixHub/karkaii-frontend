import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink, GridWorkspaceShell, PageHeader, useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef, FilterField, GridStatusCount, QuickFilter, SavedView, SortOption, WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import WorkflowModals from './modals/WorkflowModals';
import type {
  DuplicatePayload, ExportPayload, ImportPayload, WorkflowDraft, WorkflowModalId,
} from './modals/WorkflowModals';
import type { Module, Priority, TriggerType, Workflow } from './data/workflows.data';
import {
  QUICK_TOTALS, REGISTER_DATE, TOTAL_COUNT, actionCountOf, cardToneOf, conditionCountOf, dateKey,
  daysBetween, detailPairsOf, failureRateOf, hasRun, healthOf, isCritical, isDisabled, isDraft,
  isEnabled, isErroring, lastRunOptions, moduleIcon, moduleOptions, needsAttention,
  attentionReasonOf, neverRun, ownerOptions, priorityBadge, priorityOptions, runPairsOf,
  searchIndexOf, sentenceOf, statusBadge, statusIcon, statusOf, statusOptions, triggerOptions,
  workflows as initialRows,
} from './data/workflows.data';
import type { BuilderGroup } from './data/reference.data';
import {
  availableVariables, categories, categoryCountsOf, countConditions, describeGroups, initialGroups,
  matchesOf, operatorsFor, quickActions, valuesFor, workflowTemplates, RECORD_POOL,
} from './data/reference.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'module', label: 'Module', kind: 'select', chipLabel: 'Module', options: moduleOptions },
  {
    id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status',
    options: statusOptions, initialValue: 'Enabled',
  },
  {
    id: 'trigger-type', label: 'Trigger type', kind: 'select',
    chipLabel: 'Trigger', options: triggerOptions,
  },
  {
    id: 'owner', label: 'Owner', kind: 'select', chipLabel: 'Owner',
    allLabel: 'Anyone', options: ownerOptions,
  },
  { id: 'priority', label: 'Priority', kind: 'select', chipLabel: 'Priority', options: priorityOptions },
  {
    id: 'last-run', label: 'Last run', kind: 'select', chipLabel: 'Last run',
    allLabel: 'Any', options: lastRunOptions,
  },
];

const sortOptions: SortOption[] = [
  { id: 'modified', label: 'Recently modified', icon: 'ti ti-clock' },
  { id: 'priority', label: 'Priority', icon: 'ti ti-flame' },
  { id: 'runs', label: 'Runs this month', icon: 'ti ti-bolt' },
  { id: 'failure', label: 'Failure rate', icon: 'ti ti-alert-triangle' },
  { id: 'name', label: 'Workflow name', icon: 'ti ti-abc' },
];

const priorityRank: Record<Priority, number> = { Critical: 0, High: 1, Normal: 2, Low: 3 };

/** The Last run filter, against the register date. */
const matchesLastRun = (row: Workflow, choice: string): boolean => {
  if (choice === 'Never') return !hasRun(row);
  if (!row.lastRun) return false;
  const days = daysBetween(row.lastRun, REGISTER_DATE);
  if (choice === 'Today') return days === 0;
  if (choice === 'This week') return days >= 0 && days <= 7;
  return days > 30;
};

const WorkflowRulesPage = () => {
  const [rows, setRows] = useState<Workflow[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<WorkflowModalId | null>(null);
  const [modalRow, setModalRow] = useState<Workflow | null>(null);
  const [panelRow, setPanelRow] = useState<Workflow | null>(null);
  const [groups, setGroups] = useState<BuilderGroup[]>(initialGroups);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Workflow | null, modal: WorkflowModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /* ------------------------------ Sort targets ------------------------------ */

  const columns = useMemo<ColumnDef<Workflow>[]>(
    () => [
      { id: 'modified', label: 'Modified', render: (row) => row.modified },
      { id: 'priority', label: 'Priority', render: (row) => row.priority },
      { id: 'runs', label: 'Runs', render: (row) => String(row.runs) },
      { id: 'failure', label: 'Failure rate', render: (row) => `${failureRateOf(row)}%` },
      { id: 'name', label: 'Name', render: (row) => row.name },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Workflow>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.module && row.module !== filters.module) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters['trigger-type'] && row.triggerType !== filters['trigger-type']) return false;
      if (filters.owner && row.owner !== filters.owner) return false;
      if (filters.priority && row.priority !== filters.priority) return false;
      if (filters['last-run'] && !matchesLastRun(row, filters['last-run'])) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'enabled') return isEnabled(row);
      if (quick === 'disabled') return isDisabled(row);
      if (quick === 'drafts') return isDraft(row);
      if (quick === 'failing') return isErroring(row);
      if (quick === 'never') return neverRun(row);
      return isCritical(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'enabled': return isEnabled(row);
        case 'disabled': return isDisabled(row);
        case 'failing': return isErroring(row);
        case 'mine': return row.owner === ownerOptions[1];
        case 'never': return neverRun(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'priority':
          return priorityRank[a.priority] - priorityRank[b.priority] || a.name.localeCompare(b.name);
        case 'runs':
          return b.runs - a.runs || a.name.localeCompare(b.name);
        case 'failure':
          return failureRateOf(b) - failureRateOf(a) || b.failures - a.failures;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'modified':
        default:
          return dateKey(b.modified) - dateKey(a.modified) || a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'modified',
    defaultQuick: null,
    pageSize: 12,
  });

  const countBy = useCallback(
    (test: (row: Workflow) => boolean) => rows.filter(test).length,
    [rows],
  );

  const shift = useCallback(
    (base: number, test: (row: Workflow) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Workflows', icon: 'ti ti-layout-list' },
      { id: 'enabled', label: 'Enabled only', icon: 'ti ti-player-play' },
      { id: 'disabled', label: 'Disabled', icon: 'ti ti-player-pause' },
      { id: 'failing', label: 'Failing runs', icon: 'ti ti-alert-triangle' },
      { id: 'mine', label: 'Owned by me', icon: 'ti ti-user' },
      { id: 'never', label: 'Never triggered', icon: 'ti ti-clock-off' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'enabled', label: 'Enabled', icon: 'ti ti-player-play', count: shift(QUICK_TOTALS.enabled, isEnabled) },
      { id: 'disabled', label: 'Disabled', icon: 'ti ti-player-pause', count: shift(QUICK_TOTALS.disabled, isDisabled) },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: shift(QUICK_TOTALS.drafts, isDraft) },
      { id: 'failing', label: 'Failing', icon: 'ti ti-alert-triangle', count: shift(QUICK_TOTALS.failing, isErroring) },
      { id: 'never', label: 'Never run', icon: 'ti ti-clock-off', count: shift(QUICK_TOTALS.neverRun, neverRun) },
      { id: 'critical', label: 'Critical', icon: 'ti ti-flame', count: shift(QUICK_TOTALS.critical, isCritical) },
    ],
    [shift],
  );

  const statusCounts = useMemo<GridStatusCount[]>(
    () => [
      { tone: 'is-live', icon: 'ti ti-player-play', label: `${shift(QUICK_TOTALS.enabled, isEnabled)} enabled` },
      { tone: 'is-draft', icon: 'ti ti-player-pause', label: `${shift(QUICK_TOTALS.disabled, isDisabled)} disabled` },
      { tone: 'is-urgent', icon: 'ti ti-alert-triangle', label: `${shift(QUICK_TOTALS.failing, isErroring)} failing` },
    ],
    [shift],
  );

  const categoryCounts = useMemo(() => categoryCountsOf(rows, initialRows), [rows]);

  const attention = useMemo(() => rows.filter(needsAttention), [rows]);

  /* -------------------------------- Mutations ------------------------------- */

  const toggleEnabled = useCallback(
    (row: Workflow) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id
          ? { ...entry, enabled: !entry.enabled, draft: false, modified: REGISTER_DATE }
          : entry
      )));
      push(row.enabled ? `${row.name} disabled` : `${row.name} enabled`);
    },
    [push],
  );

  const create = useCallback(
    (draft: WorkflowDraft) => {
      if (!draft.name.trim()) {
        push('Give the workflow a name', 'warning');
        return;
      }
      const id = `WFX-00${9 + rows.length}`;
      const template = workflowTemplates.find((entry) => entry.name === draft.template);
      setRows((current) => [
        {
          id, icon: moduleIcon[draft.module as Module],
          name: draft.name.trim(),
          description: draft.description.trim() || 'No description yet.',
          module: draft.module as Module,
          triggerType: draft.triggerType as TriggerType,
          trigger: template?.trigger ?? draft.triggerOn.toLowerCase(),
          triggerValue: template?.triggerValue ?? '', triggerTail: '',
          conditions: [], actions: [],
          actionSummary: template?.actionSummary ?? 'no actions yet',
          priority: draft.priority as Priority,
          owner: draft.owner, modified: REGISTER_DATE,
          runs: 0, failures: 0, lastRun: '',
          // A new rule is always disabled until someone turns it on.
          enabled: false, draft: true, note: '',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} created disabled — add its conditions, then enable it`);
    },
    [push, rows.length],
  );

  const duplicate = useCallback(
    (payload: DuplicatePayload) => {
      if (!modalRow) return;
      const id = `WFX-00${9 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id,
          name: payload.name.trim() || `${modalRow.name} (copy)`,
          module: payload.module,
          conditions: payload.copyConditions ? modalRow.conditions : [],
          actions: payload.copyActions ? modalRow.actions : [],
          // A copy carries no history and arrives disabled.
          runs: 0, failures: 0, lastRun: '',
          enabled: false, draft: true, note: '',
          modified: REGISTER_DATE,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} created disabled`);
    },
    [modalRow, push, rows.length],
  );

  const remove = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.filter((row) => row.id !== modalRow.id));
    setActiveModal(null);
    push(`${modalRow.name} deleted`);
  }, [modalRow, push]);

  /* ---------------------------- The conditions builder ----------------------- */

  const conditionCount = countConditions(groups);
  const matches = matchesOf(groups);

  const setCondition = (groupId: string, conditionId: string, key: string, value: string) => {
    setGroups((current) => current.map((group) => (
      group.id === groupId
        ? {
          ...group,
          conditions: group.conditions.map((condition) => (
            condition.id === conditionId ? { ...condition, [key]: value } : condition
          )),
        }
        : group
    )));
  };

  const removeCondition = (groupId: string, conditionId: string) => {
    setGroups((current) => current
      .map((group) => (group.id === groupId
        ? { ...group, conditions: group.conditions.filter((condition) => condition.id !== conditionId) }
        : group))
      .filter((group) => group.conditions.length > 0));
  };

  const addCondition = (groupId: string) => {
    setGroups((current) => current.map((group) => (
      group.id === groupId
        ? {
          ...group,
          conditions: [
            ...group.conditions,
            {
              id: `C${Date.now()}`, field: availableVariables[0],
              operator: operatorsFor(availableVariables[0])[0], value: '', joiner: 'AND',
            },
          ],
        }
        : group
    )));
  };

  const addGroup = () => {
    setGroups((current) => [
      ...current,
      {
        id: `G${current.length + 1}`,
        label: `Group ${current.length + 1}`,
        conditions: [
          {
            id: `C${Date.now()}`, field: availableVariables[0],
            operator: operatorsFor(availableVariables[0])[0], value: '', joiner: 'AND',
          },
        ],
      },
    ]);
  };

  /* ---------------------------------- Card ---------------------------------- */

  const renderCard = (row: Workflow) => {
    const health = healthOf(row);
    const status = statusOf(row);
    return (
      <div className={`rule${cardToneOf(row)}`}>
        <div className="rule-header">
          <span className="rule-icon"><i className={row.icon} /></span>
          <div className="flex-fill overflow-hidden">
            <h3 className="rule-title">
              <ActionLink onClick={() => setPanelRow(row)}>{row.name}</ActionLink>
            </h3>
            <p className="rule-note mb-0">{row.description}</p>
          </div>
        </div>

        {/* The rule as one sentence: when, if, then. */}
        <div className="rule-sentence">
          <p className="rule-when mb-1">
            <i className="ti ti-bolt me-1" />
            {row.trigger} {row.triggerValue ? <b>{row.triggerValue}</b> : null} {row.triggerTail}
          </p>
          <p className="rule-if mb-1">
            <i className="ti ti-filter me-1" />
            {row.conditions.length === 0 ? 'no conditions yet' : row.conditions.map((condition, index) => (
              <span key={condition.text}>
                {index > 0 ? <b className="mx-1">{condition.joiner.toLowerCase()}</b> : null}
                {condition.text} {condition.value ? <b>{condition.value}</b> : null}
              </span>
            ))}
          </p>
          <p className="rule-then mb-0">
            <i className="ti ti-arrow-right me-1" />{row.actionSummary}
          </p>
        </div>

        <div className="rule-facts">
          <span><i className="ti ti-box" />{row.module}</span>
          {/* Counted from the rule, not written beside it. */}
          <span>
            <i className="ti ti-filter" /><b>{conditionCountOf(row)}</b>{' '}
            condition{conditionCountOf(row) === 1 ? '' : 's'}
          </span>
          <span>
            <i className="ti ti-bolt" /><b>{actionCountOf(row)}</b>{' '}
            action{actionCountOf(row) === 1 ? '' : 's'}
          </span>
          <span>
            <i className={health.icon} />{health.label}
            {health.value ? <b>{health.value}</b> : null}{health.tail}
          </span>
        </div>

        <div className="rule-footer">
          <span className="fs-12 text-muted">
            Owned by {row.owner} · modified {row.modified}
          </span>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className={statusBadge[status]}>
              <i className={statusIcon[status]} />{status}
            </span>
            <span className="pips">
              {row.actions.filter((action) => action.enabled).map((action) => (
                <span className="pip is-on" title={action.text} key={action.text}>
                  <i className={action.icon} />
                </span>
              ))}
            </span>
            {/* The template's overflow dropdown, flattened into the rail. */}
            <span className="d-inline-flex gap-1">
              <button
                type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                aria-label="Edit" onClick={() => setPanelRow(row)}
              >
                <i className="ti ti-edit" />
              </button>
              <button
                type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                aria-label="Duplicate" onClick={() => openModal(row, 'duplicate')}
              >
                <i className="ti ti-copy" />
              </button>
              <button
                type="button" className="btn btn-sm btn-outline-light bg-white"
                onClick={() => {
                  if (status === 'Erroring') { setPanelRow(row); return; }
                  toggleEnabled(row);
                }}
              >
                {status === 'Erroring' ? (
                  <><i className="ti ti-bug me-1" />Diagnose</>
                ) : row.enabled ? (
                  <><i className="ti ti-player-pause me-1" />Disable</>
                ) : (
                  <><i className="ti ti-player-play me-1" />Enable</>
                )}
              </button>
              <button
                type="button" className="btn btn-sm btn-outline-light bg-white btn-icon text-danger"
                aria-label="Delete" onClick={() => openModal(row, 'delete')}
              >
                <i className="ti ti-trash" />
              </button>
            </span>
          </div>
        </div>
      </div>
    );
  };

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

  const sectionHeader = (
    label: string, title: string, note: string,
    action?: { icon: string; text: string; onClick: () => void },
  ) => (
    <div className="message-section-header">
      <div>
        <span className="message-metric-label">{label}</span>
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
      {action ? (
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
          onClick={action.onClick}
        >
          <i className={`${action.icon} me-1`} />{action.text}
        </button>
      ) : null}
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Workflow Rules"
            section="Automation"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'export')}
                  >
                    <i className="ti ti-file-export me-2" />Export
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Workflow
                  </ActionLink>
                </div>
              </>
            }
          />

          <GridWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_COUNT - initialRows.length + rows.length}
            searchPlaceholder="Search workflow, trigger or action…"
            searchLabel="Search workflows"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="workflows"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            workspaceId="wfxWorkspace"
            onRefresh={() => { setRows(initialRows); push('Workflows refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            caption={
              <>
                {TOTAL_COUNT - initialRows.length + rows.length} workflow rules across ten modules.
                Each is read as one sentence — when something happens, if these conditions hold,
                then run these actions in order.
              </>
            }
            statusCounts={statusCounts}
            cardClassName="col-xxl-4 col-lg-6"
            renderCard={renderCard}
            emptyIcon="ti ti-route-off"
            emptyTitle="No workflows match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => openModal(null, 'create')}>
                <i className="ti ti-square-rounded-plus me-2" />New Workflow
              </button>
            }
          />

          {/* Categories */}
          {sectionHeader(
            'Categories', 'Workflow categories',
            'Rules are owned by the module they act on. A rule that spans two modules belongs to the one it writes to, not the one it reads from.',
          )}
          <div className="row g-3 mb-5">
            {categories.map((category) => (
              <div className="col-xxl-3 col-lg-4 col-md-6" key={category.module}>
                <ActionLink
                  className="audience w-100 text-start"
                  onClick={() => {
                    workspace.setDraftField('module', category.module);
                    workspace.applyFilters();
                    push(`Filtered to ${category.module}`);
                  }}
                >
                  <div className="audience-top">
                    <span className="audience-icon"><i className={category.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{category.module}</p>
                      <small>{category.note}</small>
                    </div>
                  </div>
                  {/* Tallied from the roster, so a new rule moves its module. */}
                  <div className="audience-count">
                    <b>{categoryCounts[category.module]}</b>
                    <span>
                      rules
                      {category.drafted > 0 ? ` · ${category.drafted} drafted` : ''}
                    </span>
                  </div>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Templates */}
          {sectionHeader(
            'Templates', 'Workflow templates',
            'Eight rules most schools end up writing anyway. Each arrives disabled, with its conditions left for you to confirm before it runs on real records.',
            { icon: 'ti ti-file-import', text: 'Import a template', onClick: () => openModal(null, 'import') },
          )}
          <div className="row g-3 mb-5">
            {workflowTemplates.map((template) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={template.name}>
                <div className="rule">
                  <div className="rule-header">
                    <span className="rule-icon"><i className={template.icon} /></span>
                    <div className="flex-fill overflow-hidden">
                      <h3 className="rule-title">{template.name}</h3>
                      <p className="rule-note mb-0">{template.note}</p>
                    </div>
                  </div>
                  <div className="rule-sentence">
                    <p className="rule-when mb-1">
                      <i className="ti ti-bolt me-1" />
                      {template.trigger} {template.triggerValue ? <b>{template.triggerValue}</b> : null}
                    </p>
                    <p className="rule-then mb-0">
                      <i className="ti ti-arrow-right me-1" />{template.actionSummary}
                    </p>
                  </div>
                  <div className="rule-footer">
                    <span className="fs-12 text-muted">
                      {template.module} · {template.conditions} condition
                      {template.conditions === 1 ? '' : 's'}
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => openModal(null, 'create')}
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conditions builder */}
          {sectionHeader(
            'Conditions', 'Conditions builder',
            'Gates the rule after the trigger has fired. Groups are bracketed and the operator sits on the line between conditions, because AND and OR are the part people misread.',
          )}
          <div className="card mb-5">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <h5 className="fs-14 mb-0">
                  <i className="ti ti-filter me-1" />IF these conditions hold
                </h5>
                <span className="fs-12 text-muted">
                  Evaluated in order. The rule stops at the first group that fails.
                </span>
              </div>
              {/* Counted from what has actually been built. */}
              <span className="message-status-badge">
                {conditionCount} condition{conditionCount === 1 ? '' : 's'} · {groups.length} group
                {groups.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="card-body">
              {groups.map((group) => (
                <div className="border rounded p-3 mb-3" key={group.id}>
                  <h6 className="fs-13 mb-3">{group.label}</h6>
                  {group.conditions.map((condition, index) => (
                    <div key={condition.id}>
                      {index > 0 ? (
                        <div className="d-flex align-items-center gap-2 my-2">
                          {/* The operator sits between the two lines it joins. */}
                          {(['AND', 'OR'] as const).map((joiner) => (
                            <button
                              type="button" key={joiner}
                              className={`btn btn-sm ${condition.joiner === joiner ? 'btn-primary' : 'btn-outline-light bg-white'}`}
                              onClick={() => setCondition(group.id, condition.id, 'joiner', joiner)}
                            >
                              {joiner}
                            </button>
                          ))}
                        </div>
                      ) : null}
                      <div className="row g-2 align-items-center">
                        <div className="col-md-4">
                          <select
                            className="form-select form-select-sm"
                            aria-label="Field"
                            value={condition.field}
                            onChange={(event) => {
                              setCondition(group.id, condition.id, 'field', event.target.value);
                              setCondition(
                                group.id, condition.id, 'operator',
                                operatorsFor(event.target.value)[0],
                              );
                            }}
                          >
                            {[condition.field, ...availableVariables, 'invoice.status', 'student.status']
                              .filter((option, i, all) => all.indexOf(option) === i)
                              .map((option) => <option key={option}>{option}</option>)}
                          </select>
                        </div>
                        <div className="col-md-3">
                          {/* The operators a field can actually take. */}
                          <select
                            className="form-select form-select-sm"
                            aria-label="Operator"
                            value={condition.operator}
                            onChange={(event) => setCondition(group.id, condition.id, 'operator', event.target.value)}
                          >
                            {operatorsFor(condition.field).map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          {valuesFor(condition.field).length > 0 ? (
                            <select
                              className="form-select form-select-sm"
                              aria-label="Value"
                              disabled={condition.operator.includes('empty')}
                              value={condition.value}
                              onChange={(event) => setCondition(group.id, condition.id, 'value', event.target.value)}
                            >
                              {valuesFor(condition.field).map((option) => (
                                <option key={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text" className="form-control form-control-sm"
                              aria-label="Value"
                              /* An "is empty" test has nothing to compare against. */
                              disabled={condition.operator.includes('empty')}
                              placeholder={condition.operator.includes('empty') ? '—' : 'Value'}
                              value={condition.operator.includes('empty') ? '' : condition.value}
                              onChange={(event) => setCondition(group.id, condition.id, 'value', event.target.value)}
                            />
                          )}
                        </div>
                        <div className="col-md-1 text-end">
                          <button
                            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                            aria-label="Remove condition"
                            onClick={() => removeCondition(group.id, condition.id)}
                          >
                            <i className="ti ti-x" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button" className="btn btn-sm btn-outline-light bg-white mt-3"
                    onClick={() => addCondition(group.id)}
                  >
                    <i className="ti ti-plus me-1" />Add condition
                  </button>
                </div>
              ))}

              <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                <button type="button" className="btn btn-sm btn-outline-light bg-white" onClick={addGroup}>
                  <i className="ti ti-brackets me-1" />Add group
                </button>
                <span className="fs-12 text-muted">
                  Available variables: {availableVariables.join(', ')}
                </span>
              </div>

              {/* What the brackets actually mean, written out. */}
              <div className="border rounded p-3 mb-3">
                <h6 className="fs-13 mb-1">This reads as</h6>
                <p className="fs-13 text-muted mb-0">{describeGroups(groups)}</p>
              </div>

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span className="fs-13">
                  Matches <b>{matches.toLocaleString()}</b> of {RECORD_POOL.toLocaleString()} records
                  right now
                </span>
                <span className="d-inline-flex gap-2">
                  <button
                    type="button" className="btn btn-sm btn-outline-light bg-white"
                    onClick={() => push(`${matches.toLocaleString()} records match these conditions`)}
                  >
                    Test conditions
                  </button>
                  <button
                    type="button" className="btn btn-sm btn-primary"
                    onClick={() => push(`${conditionCount} conditions saved in ${groups.length} groups`)}
                  >
                    Save conditions
                  </button>
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions and attention */}
          <div className="row g-3">
            <div className="col-12 col-xl-8">
              {sectionHeader('Shortcuts', 'Quick actions', 'The four things most often done from this page.')}
              <div className="row g-3">
                {quickActions.map((action) => (
                  <div className="col-md-6" key={action.title}>
                    <ActionLink
                      className="message-action"
                      onClick={() => {
                        if (action.title === 'Create Workflow') { openModal(null, 'create'); return; }
                        if (action.title === 'Import Rules') { openModal(null, 'import'); return; }
                        push(`${action.title} — ${action.note.toLowerCase()}`);
                      }}
                    >
                      <span className={`rule-action-icon ${action.icon}`} />
                      <span className="flex-fill">
                        <span className="d-block fw-medium">{action.title}</span>
                        <span className="fs-12 text-muted">{action.note}</span>
                      </span>
                      <i className="rule-action-go ti ti-chevron-right" />
                    </ActionLink>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="fs-14 mb-0">
                    <i className="ti ti-alert-triangle me-1" />Needs attention
                  </h5>
                  {/* Erroring, or enabled and never run. */}
                  <span className="message-status-badge is-urgent">{attention.length}</span>
                </div>
                <div className="card-body">
                  {attention.length === 0 ? (
                    <p className="fs-13 text-muted mb-0">
                      Every enabled rule has run and none is failing.
                    </p>
                  ) : (
                    attention.map((row) => (
                      <div
                        className="d-flex align-items-center gap-2 border rounded p-2 mb-2"
                        key={row.id}
                      >
                        <div className="flex-fill overflow-hidden">
                          <h6 className="fs-13 mb-0 text-truncate">{row.name}</h6>
                          <span className="fs-12 text-muted text-truncate d-block">
                            {attentionReasonOf(row)}
                          </span>
                        </div>
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => setPanelRow(row)}
                        >
                          Open
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Workflow panel */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title={panelRow ? panelRow.name : 'Workflow'}
            labelledById="wfx_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className="badge badge-soft-secondary">
                    <i className={`${moduleIcon[panelRow.module]} me-1`} />{panelRow.module}
                  </span>
                  <span className={priorityBadge[panelRow.priority]}>{panelRow.priority}</span>
                  <span className={statusBadge[statusOf(panelRow)]}>
                    <i className={statusIcon[statusOf(panelRow)]} />{statusOf(panelRow)}
                  </span>
                </div>
                <p className="fs-13 text-muted mb-3">{panelRow.description}</p>

                {/* The rule as one sentence. */}
                <h6 className="fs-14 mb-2">In one sentence</h6>
                <div className="border rounded p-3 mb-3">
                  <p className="fs-13 mb-0">{sentenceOf(panelRow)}</p>
                </div>

                {panelRow.note ? (
                  <div className="alert alert-light border d-flex align-items-start gap-2 mb-3">
                    <i className="ti ti-alert-circle fs-16 mt-1" />
                    <span className="fs-13">{panelRow.note}</span>
                  </div>
                ) : null}

                <h6 className="fs-14 mb-2">Conditions</h6>
                {panelRow.conditions.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">
                    No conditions — the rule would run on every trigger.
                  </p>
                ) : (
                  <div className="border rounded p-3 mb-3">
                    {panelRow.conditions.map((condition, index) => (
                      <div className="fs-13 mb-1" key={condition.text}>
                        {index > 0 ? (
                          <span className="badge badge-soft-secondary me-2">{condition.joiner}</span>
                        ) : null}
                        {condition.text} {condition.value ? <b>{condition.value}</b> : null}
                      </div>
                    ))}
                  </div>
                )}

                <h6 className="fs-14 mb-2">Actions, in order</h6>
                {panelRow.actions.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No actions yet.</p>
                ) : (
                  panelRow.actions.map((action, index) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={action.text}>
                      <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                        <i className={action.icon} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0">{index + 1}. {action.text}</h6>
                      </div>
                      {!action.enabled ? (
                        <span className="badge badge-soft-secondary">Disabled</span>
                      ) : null}
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Workflow</h6>
                <div className="border rounded p-3 mb-3">{pairList(detailPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Runs</h6>
                <div className="border rounded p-3 mb-3">{pairList(runPairsOf(panelRow))}</div>

                <div className="d-flex align-items-center flex-wrap gap-2">
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => toggleEnabled(panelRow)}
                  >
                    <i className={`${panelRow.enabled ? 'ti ti-player-pause' : 'ti ti-player-play'} me-1`} />
                    {panelRow.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'duplicate'); }}
                  >
                    <i className="ti ti-copy me-1" />Duplicate
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm text-danger"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'delete'); }}
                  >
                    <i className="ti ti-trash me-1" />Delete
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <WorkflowModals
        active={activeModal}
        row={modalRow}
        matchCount={workspace.visible.length}
        totalCount={TOTAL_COUNT - initialRows.length + rows.length}
        onClose={() => setActiveModal(null)}
        onCreate={create}
        onDuplicate={duplicate}
        onImport={(payload: ImportPayload) => {
          setActiveModal(null);
          push(`Rules imported disabled · ${payload.onCollision.toLowerCase()} on a name clash`);
        }}
        onExport={(payload: ExportPayload) => {
          setActiveModal(null);
          push(`${payload.scope} exported as ${payload.format}`);
        }}
        onDelete={remove}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="wfxToasts" />
    </>
  );
};

export default WorkflowRulesPage;
