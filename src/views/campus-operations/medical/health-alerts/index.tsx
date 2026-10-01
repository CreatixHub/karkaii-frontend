import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  PageHeader,
  WorkspaceShell,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  SummaryItem,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AlertModals, { toRowDate } from './modals/AlertModals';
import type {
  AlertDraft, AlertModalId, EscalatePayload, NotifyPayload, ResolvePayload,
} from './modals/AlertModals';
import type { AlertType, HealthAlert, Severity } from './data/alerts.data';
import {
  PERIOD_FROM, PERIOD_TO, QUICK_TOTALS, REGISTER_DATE, REGISTER_TIME, SUMMARY_TOTALS, VIEW_TOTALS,
  acknowledgedOf, ageLabelOf, auditOf, dateKey, detailPairsOf, durationText,
  firstNotificationBadgeOf, firstNotificationLabelOf, groupOptions, healthAlerts as initialRows,
  isResolved, minutesOf, notificationBadge, notificationOptions, notificationStateOf,
  notificationSubLabelOf, openLabelOf, openMinutesOf, openTintOf, overviewPairsOf, raisedAtOf,
  raisedLabelOf, releasedOf, reporterOptions, searchIndexOf, sentOf, severityBadge, severityOptions,
  severityRank, shiftDate, statusBadge, statusOf, statusOptions, statusPill, statusSubLabelOf,
  trailOf, typeBadge, typeIcon, typeOptions, typeTint, windowLabelOf,
} from './data/alerts.data';

const routes = all_routes;

/** Ids and options are the template's own; the raised window opens committed. */
const filterFields: FilterField[] = [
  { id: 'alert-type', label: 'Alert Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'severity', label: 'Severity', kind: 'select', chipLabel: 'Severity', options: severityOptions },
  { id: 'affected-group', label: 'Affected Group', kind: 'select', chipLabel: 'Group', options: groupOptions },
  { id: 'alert-status', label: 'Alert Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'notification', label: 'Notification', kind: 'select', chipLabel: 'Notification',
    allLabel: 'Any', options: notificationOptions,
  },
  { id: 'reported-by', label: 'Reported By', kind: 'select', chipLabel: 'Raised by', options: reporterOptions },
  {
    id: 'from-date', label: 'From Date', kind: 'date', chipLabel: 'Raised',
    dateFormat: 'd-m-Y', initialValue: PERIOD_FROM,
  },
  {
    id: 'to-date', label: 'To Date', kind: 'date', chipLabel: 'To',
    dateFormat: 'd-m-Y', initialValue: PERIOD_TO,
  },
];

const sortOptions: SortOption[] = [
  { id: 'alert', label: 'Alert ID', icon: 'ti ti-hash' },
  { id: 'severity', label: 'Severity', icon: 'ti ti-urgent' },
  { id: 'created', label: 'Created on', icon: 'ti ti-calendar-event' },
  { id: 'open', label: 'Time open', icon: 'ti ti-clock' },
  { id: 'notification', label: 'Notification status', icon: 'ti ti-send' },
];

const inputDateKey = (value: string): number => {
  const [day, month, year] = value.split('-').map(Number);
  return Number.isFinite(year) ? year * 10000 + month * 100 + day : 0;
};

/** The filter's categories against the group each alert actually names. */
const matchesGroup = (row: HealthAlert, choice: string): boolean => {
  const group = row.group.toLowerCase();
  if (choice === 'All students and staff') return group.includes('all students');
  if (choice === 'Single class') return group.includes('class ');
  if (choice === 'Teaching staff') return group.includes('teaching staff');
  if (choice === 'Guardians') return group.includes('guardians');
  if (choice === 'Cafeteria') return group.includes('cafeteria');
  return group.includes('games');
};

/** An alert is open once it is published and before it is closed. */
const isOpenAlert = (row: HealthAlert) => row.published && !isResolved(row);

const isDraft = (row: HealthAlert) => !row.published;

const isCritical = (row: HealthAlert) => row.severity === 'Critical';

const isHigh = (row: HealthAlert) => row.severity === 'High';

const isContagious = (row: HealthAlert) => row.type === 'Contagious Illness';

/** The audiences the template's own notification lines reach. */
const recipientsFor = (row: HealthAlert, audience: string): number => {
  if (audience === 'Guardians of all students') return 214;
  if (audience === 'All teaching staff') return 64;
  if (audience === 'Emergency response team') return 8;
  if (audience === 'Principal and Chief Warden') return 2;
  return Math.max(1, row.individuals.length);
};

const HealthAlertsPage = () => {
  const [rows, setRows] = useState<HealthAlert[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AlertModalId | null>(null);
  const [modalRow, setModalRow] = useState<HealthAlert | null>(null);
  const [panelRow, setPanelRow] = useState<HealthAlert | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: HealthAlert | null, modal: AlertModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: HealthAlert) => HealthAlert, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<HealthAlert>[]>(
    () => [
      {
        id: 'alert',
        label: 'Alert ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => setPanelRow(row)}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'title',
        label: 'Alert Title',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-md bg-${typeTint[row.type]}-transparent text-${typeTint[row.type]} rounded flex-shrink-0 me-2`}>
              <i className={typeIcon[row.type]} />
            </span>
            <div className="overflow-hidden">
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.title}</ActionLink>
              <div className="dt-sub text-truncate">{row.summary}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'type',
        label: 'Alert Type',
        sortable: true,
        render: (row) => <span className={typeBadge[row.type]}>{row.type}</span>,
      },
      {
        id: 'severity',
        label: 'Severity',
        sortable: true,
        render: (row) => (
          <>
            <span className={severityBadge[row.severity]}>{row.severity}</span>
            {/* The window the severity carries. */}
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{windowLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'group',
        label: 'Affected Group',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13">{row.group}</span>
            <span className="fs-12 text-muted d-block">{row.scope}</span>
          </>
        ),
      },
      {
        id: 'reporter',
        label: 'Reported By',
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{row.reporter}</span>
            <span className="fs-12 text-muted text-nowrap">{row.reporterRole}</span>
          </>
        ),
      },
      {
        id: 'created',
        label: 'Created On',
        sortable: true,
        render: (row) => (
          <>
            <span className="d-block fs-13 text-nowrap">{raisedLabelOf(row)}</span>
            <span className="fs-12 text-muted text-nowrap">{ageLabelOf(row)}</span>
            <span className={`d-block fs-12 text-nowrap ${openTintOf(row)}`}>{openLabelOf(row)}</span>
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
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{statusSubLabelOf(row)}</span>
          </>
        ),
      },
      {
        id: 'notification',
        label: 'Notification Status',
        render: (row) => (
          <>
            <span className={notificationBadge[notificationStateOf(row)]}>{notificationStateOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{notificationSubLabelOf(row)}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<HealthAlert>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['alert-type'] && row.type !== filters['alert-type']) return false;
      if (filters.severity && row.severity !== filters.severity) return false;
      if (filters['affected-group'] && !matchesGroup(row, filters['affected-group'])) return false;
      if (filters['alert-status'] && statusOf(row) !== filters['alert-status']) return false;
      if (
        filters.notification
        && notificationStateOf(row).toLowerCase() !== filters.notification.toLowerCase()
      ) return false;
      if (filters['reported-by'] && row.reporter !== filters['reported-by']) return false;
      if (filters['from-date'] && dateKey(row.raisedDate) < inputDateKey(filters['from-date'])) return false;
      if (filters['to-date'] && dateKey(row.raisedDate) > inputDateKey(filters['to-date'])) return false;
      return true;
    },
    /** The rail opens on All, which narrows nothing. */
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'active') return isOpenAlert(row);
      if (quick === 'critical') return isCritical(row);
      if (quick === 'high') return isHigh(row);
      if (quick === 'drafts') return isDraft(row);
      return isResolved(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'active': return isOpenAlert(row);
        case 'critical': return isCritical(row);
        case 'drafts': return isDraft(row);
        case 'contagious': return isContagious(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'severity':
          return severityRank[a.severity] - severityRank[b.severity] || a.id.localeCompare(b.id);
        case 'created':
          return raisedAtOf(a) - raisedAtOf(b) || a.id.localeCompare(b.id);
        // Longest open first — the alert that has run the longest is the one to read.
        case 'open':
          return openMinutesOf(b) - openMinutesOf(a) || a.id.localeCompare(b.id);
        case 'notification':
          return notificationStateOf(a).localeCompare(notificationStateOf(b)) || a.id.localeCompare(b.id);
        // The `<th>`s sort on columns the menu does not offer.
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'group':
          return a.group.localeCompare(b.group);
        case 'alert':
        default:
          return a.id.localeCompare(b.id);
      }
    },
    defaultSort: 'alert',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: HealthAlert) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the register holds now. */
  const shift = useCallback(
    (base: number, test: (row: HealthAlert) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Alerts', icon: 'ti ti-layout-list', count: shift(VIEW_TOTALS.all, () => true) },
      {
        id: 'active', label: 'Active Alerts', icon: 'ti ti-alert-circle',
        count: shift(VIEW_TOTALS.active, isOpenAlert),
      },
      {
        id: 'critical', label: 'Critical Alerts', icon: 'ti ti-urgent',
        count: shift(VIEW_TOTALS.critical, isCritical),
      },
      {
        id: 'drafts', label: 'Drafts Awaiting Approval', icon: 'ti ti-pencil',
        count: shift(VIEW_TOTALS.drafts, isDraft),
      },
      {
        id: 'contagious', label: 'Contagious Illness', icon: 'ti ti-virus',
        count: shift(VIEW_TOTALS.contagious, isContagious),
      },
    ],
    [shift],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: shift(QUICK_TOTALS.all, () => true) },
      { id: 'active', label: 'Active', icon: 'ti ti-alert-circle', count: shift(QUICK_TOTALS.active, isOpenAlert) },
      { id: 'critical', label: 'Critical', icon: 'ti ti-urgent', count: shift(QUICK_TOTALS.critical, isCritical) },
      { id: 'high', label: 'High', icon: 'ti ti-flag', count: shift(QUICK_TOTALS.high, isHigh) },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: shift(QUICK_TOTALS.drafts, isDraft) },
      {
        id: 'resolved', label: 'Resolved', icon: 'ti ti-circle-check',
        count: shift(QUICK_TOTALS.resolved, isResolved),
      },
    ],
    [shift],
  );

  /**
   * The strip counts the whole term — 49 alerts against the eight this page
   * lists — so the template's figures stand and the register moves them. The
   * message count moves the same way, on messages rather than rows.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const total = shift(SUMMARY_TOTALS.total, () => true);
    const messages = (list: HealthAlert[]) =>
      list.reduce((count, row) => count + sentOf(row), 0);
    const sent = SUMMARY_TOTALS.notifications - messages(initialRows) + messages(rows);
    return [
      {
        id: 'active', tint: 'primary', icon: 'ti ti-alert-circle', label: 'Active Alerts',
        value: String(shift(SUMMARY_TOTALS.active, isOpenAlert)), hint: 'open across the campus',
      },
      {
        id: 'high', tint: 'warning', icon: 'ti ti-flag', label: 'High Priority',
        value: String(shift(SUMMARY_TOTALS.high, isHigh)), hint: 'four hour response window',
      },
      {
        id: 'critical', tint: 'danger', icon: 'ti ti-urgent', label: 'Critical Alerts',
        value: String(shift(SUMMARY_TOTALS.critical, isCritical)), hint: 'one hour response window',
      },
      {
        id: 'resolved', tint: 'success', icon: 'ti ti-circle-check', label: 'Resolved Alerts',
        value: String(shift(SUMMARY_TOTALS.resolved, isResolved)), hint: `of ${total} raised this term`,
      },
      {
        id: 'notifications', tint: 'info', icon: 'ti ti-send', label: 'Notifications Sent',
        value: String(sent), hint: 'guardians and staff reached',
      },
    ];
  }, [rows, shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const createAlert = useCallback(
    (draft: AlertDraft) => {
      if (!draft.title.trim()) {
        push('Give the alert a title', 'warning');
        return;
      }
      const id = draft.alertId.trim() || `HA-2026-01${45 + rows.length}`;
      const reporter = draft.reporter.split('·')[0].trim();
      setRows((current) => [
        {
          id,
          title: draft.title.trim(),
          summary: draft.summary.trim() || 'Raised from the alert register.',
          type: draft.type as AlertType,
          severity: draft.severity as Severity,
          group: draft.group,
          scope: draft.individuals.trim() || 'Scope to be confirmed',
          reporter, reporterRole: draft.reporter.split('·')[1]?.trim() ?? 'Health room',
          raisedDate: toRowDate(draft.raisedOn), raisedTime: draft.raisedAt,
          published: draft.publish,
          monitorUntil: toRowDate(draft.monitorUntil),
          escalatedAt: '', escalatedTo: '',
          resolvedDate: '', resolvedAt: '', resolvedBy: '',
          linkedVisit: draft.linkedVisit.trim(), caseCount: 0,
          individuals: draft.individuals
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean)
            .map((name) => ({
              name, detail: 'Named on the alert', seen: toRowDate(draft.raisedOn),
              record: draft.linkedVisit.trim() || 'Alert register',
              state: 'On the alert', stateTint: 'badge badge-soft-info',
            })),
          medical: draft.medical.split('\n').map((line) => line.trim()).filter(Boolean),
          actions: draft.actions
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const [task, owner] = line.split('—');
              return { task: task.trim(), owner: owner?.trim() || 'Health room' };
            }),
          // Publishing with the switch on releases the first message straight away.
          notifications: draft.publish && draft.notify
            ? [{
              channel: 'SMS', audience: 'Guardians of the affected group',
              at: draft.raisedAt, recipients: 24, acknowledged: 0,
            }]
            : [],
          attachments: [],
          contacts: [],
          raisedNote: draft.publish ? 'Alert raised on the register' : 'Alert drafted',
          closingNote: draft.publish ? 'Standing alert kept open on the register' : 'Awaiting approval',
          notes: draft.notes.trim() || 'Raised from the alert register.',
        },
        ...current,
      ]);
      setActiveModal(null);
      push(
        draft.publish
          ? `${id} published at ${draft.raisedAt}`
          : `${id} saved as a draft — nothing has been sent`,
      );
    },
    [push, rows.length],
  );

  const updateAlert = useCallback(
    (draft: AlertDraft) => {
      const reporter = draft.reporter.split('·')[0].trim();
      patchRow(
        (row) => ({
          ...row,
          title: draft.title.trim() || row.title,
          summary: draft.summary.trim() || row.summary,
          type: draft.type as AlertType,
          severity: draft.severity as Severity,
          group: draft.group,
          reporter, reporterRole: draft.reporter.split('·')[1]?.trim() ?? row.reporterRole,
          raisedDate: toRowDate(draft.raisedOn), raisedTime: draft.raisedAt,
          published: draft.publish,
          monitorUntil: toRowDate(draft.monitorUntil),
          linkedVisit: draft.linkedVisit.trim(),
          medical: draft.medical.split('\n').map((line) => line.trim()).filter(Boolean),
          actions: draft.actions
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => {
              const [task, owner] = line.split('—');
              return { task: task.trim(), owner: owner?.trim() || 'Health room' };
            }),
          notes: draft.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Alert'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** Sending is what releases a draft, and what the response time is measured to. */
  const sendNotification = useCallback(
    (payload: NotifyPayload) =>
      patchRow(
        (row) => ({
          ...row,
          published: true,
          notifications: [
            ...row.notifications.filter((entry) => entry.at !== ''),
            {
              channel: payload.channel,
              audience: payload.audience,
              at: payload.sendAt,
              recipients: recipientsFor(row, payload.audience),
              // Nothing is acknowledged the moment it goes out.
              acknowledged: 0,
            },
          ],
        }),
        `${payload.channel} sent to ${payload.audience.toLowerCase()} at ${payload.sendAt}`,
      ),
    [patchRow],
  );

  const escalateAlert = useCallback(
    (payload: EscalatePayload) =>
      patchRow(
        (row) => ({
          ...row,
          published: true,
          severity: payload.severity,
          escalatedAt: payload.escalatedAt,
          escalatedTo: payload.target,
          closingNote: `Escalated to the ${payload.target}`,
          notes: payload.notes.trim() || row.notes,
        }),
        `${modalRow?.id ?? 'Alert'} escalated to the ${payload.target.toLowerCase()} at ${payload.escalatedAt}`,
      ),
    [modalRow, patchRow],
  );

  /** Moving to monitoring is not a resolution — it keeps the alert open. */
  const resolveAlert = useCallback(
    (payload: ResolvePayload) => {
      const monitoring = payload.outcome === 'Move to Monitoring';
      patchRow(
        (row) => (monitoring
          ? {
            ...row,
            monitorUntil: shiftDate(REGISTER_DATE, 7),
            escalatedAt: '', escalatedTo: '',
            closingNote: payload.summary.trim() || 'Moved to monitoring',
          }
          : {
            ...row,
            resolvedDate: REGISTER_DATE,
            resolvedAt: payload.resolvedAt,
            resolvedBy: payload.resolvedBy.split('·')[0].trim(),
            monitorUntil: '',
            closingNote: payload.summary.trim()
              || (payload.outcome === 'Handed to Clinic'
                ? 'Handed to the clinic and closed'
                : 'Risk cleared and alert closed'),
          }),
        monitoring
          ? `${modalRow?.id ?? 'Alert'} moved to monitoring until ${shiftDate(REGISTER_DATE, 7)}`
          : `${modalRow?.id ?? 'Alert'} resolved at ${payload.resolvedAt} — ${payload.outcome.toLowerCase()}`,
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
      push(`${workspace.visible.length} health alerts exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: HealthAlert) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="View alert" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Edit alert" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Send notification" onClick={() => openModal(row, 'send')}>
        <i className="ti ti-send" />
      </ActionLink>
      <ActionLink className="dt-ib danger" ariaLabel="Escalate alert" onClick={() => openModal(row, 'escalate')}>
        <i className="ti ti-arrow-up" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Resolve alert" onClick={() => openModal(row, 'resolve')}>
        <i className="ti ti-circle-check" />
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

  const emptyCard = (icon: string, title: string, sub: string) => (
    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-0">
      <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
        <i className={icon} />
      </span>
      <div className="flex-fill overflow-hidden">
        <h6 className="fs-13 mb-0 text-truncate">{title}</h6>
        <span className="fs-12 text-muted text-truncate d-block">{sub}</span>
      </div>
    </div>
  );

  /** The expander's last card offers whatever the alert's state calls for. */
  const primaryAction = (row: HealthAlert) => {
    if (isResolved(row)) {
      return { modal: 'view' as AlertModalId, icon: 'ti ti-eye', label: 'View Alert' };
    }
    if (releasedOf(row).length === 0) {
      return { modal: 'send' as AlertModalId, icon: 'ti ti-send', label: 'Send Notification' };
    }
    return { modal: 'resolve' as AlertModalId, icon: 'ti ti-circle-check', label: 'Resolve Alert' };
  };

  const renderDetail = (row: HealthAlert) => {
    const primary = primaryAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-alert-circle text-primary me-1" />Alert Details</h6>
          {pairList(detailPairsOf(row))}
          <p className="fs-13 text-muted mb-0 mt-2">{row.summary}</p>
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-info me-1" />Affected Students &amp; Staff</h6>
          {row.individuals.length === 0
            ? emptyCard('ti ti-users', 'Nobody named yet', 'Scope to be confirmed')
            : row.individuals.map((person) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={person.name}>
                <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                  <i className="ti ti-user" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{person.name}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{person.detail}</span>
                </div>
              </div>
            ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-heartbeat text-danger me-1" />Medical Information</h6>
          {row.medical.map((note) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={note}>
              <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                <i className="ti ti-heartbeat" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">{note}</h6>
                <span className="fs-12 text-muted d-block">Clinical observation</span>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-checkbox text-warning me-1" />Recommended Actions</h6>
          {row.actions.map((action) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={action.task}>
              <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                <i className="ti ti-checkbox" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">{action.task}</h6>
                <span className="fs-12 text-muted d-block">Owner: {action.owner}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-send text-success me-1" />Notification History</h6>
          {row.notifications.map((entry) => (
            <div
              className="d-flex align-items-center gap-2 border rounded p-2 mb-2"
              key={`${entry.channel}-${entry.audience}`}
            >
              <span className={`avatar avatar-sm bg-${entry.at ? 'success' : 'warning'}-transparent text-${entry.at ? 'success' : 'warning'} rounded flex-shrink-0`}>
                <i className={entry.at ? 'ti ti-send' : 'ti ti-clock'} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{entry.channel} · {entry.audience}</h6>
                <span className="fs-12 text-muted text-truncate d-block">
                  {entry.at
                    ? `${entry.at} · ${entry.acknowledged} of ${entry.recipients} acknowledged`
                    : 'Queued, not released'}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-timeline text-purple me-1" />Resolution Timeline</h6>
          {trailOf(row).map((entry) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
              <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                <i className={entry.icon} />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0">{entry.title}</h6>
                <span className="fs-12 text-muted d-block">{entry.meta}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-files text-secondary me-1" />Attachments</h6>
          {row.attachments.length === 0
            ? emptyCard('ti ti-file-off', 'No attachment filed', 'Nothing to download')
            : row.attachments.map((file) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={file.name}>
                <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                  <i className="ti ti-file-type-pdf" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{file.name}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{file.meta}</span>
                </div>
                <ActionLink
                  className="dt-ib"
                  ariaLabel={`Download ${file.name}`}
                  onClick={() => push(`${file.name} downloaded`)}
                >
                  <i className="ti ti-download" />
                </ActionLink>
              </div>
            ))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
          <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
            <span className={severityBadge[row.severity]}>{row.severity}</span>
            <span className={notificationBadge[notificationStateOf(row)]}>{notificationStateOf(row)}</span>
          </div>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button
              type="button" className="btn btn-primary btn-sm"
              onClick={() => openModal(row, primary.modal)}
            >
              <i className={`${primary.icon} me-1`} />{primary.label}
            </button>
            {!isResolved(row) ? (
              <button
                type="button" className="btn btn-outline-light bg-white btn-sm"
                onClick={() => openModal(row, 'escalate')}
              >
                <i className="ti ti-arrow-up me-1" />Escalate
              </button>
            ) : null}
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-alert-circle me-1" />Alert Panel
            </button>
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
            title="Health Alerts"
            section="Health"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find(isOpenAlert) ?? rows[0] ?? null, 'send')}
                  >
                    <i className="ti ti-send me-2" />Send Notification
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Print Alert Register" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Create Health Alert
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={VIEW_TOTALS.all - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`register as at ${REGISTER_TIME}`}
            workspaceId="haWorkspace"
            searchPlaceholder="Search alert ID or title…"
            searchLabel="Search health alerts"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="alerts"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Alert register refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-alert-circle-off"
            emptyTitle="No health alerts match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Alert Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Health Alert Details"
            labelledById="ha_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Alert Overview</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className={`avatar avatar-lg bg-${typeTint[panelRow.type]}-transparent text-${typeTint[panelRow.type]} rounded flex-shrink-0`}>
                    <i className={`${typeIcon[panelRow.type]} fs-20`} />
                  </span>
                  <div className="ms-2 overflow-hidden">
                    <h6 className="mb-0 text-truncate">{panelRow.id}</h6>
                    <span className="fs-12 text-muted">{panelRow.title}</span>
                  </div>
                  <span className={`${statusBadge[statusOf(panelRow)]} ms-auto`}>{statusOf(panelRow)}</span>
                </div>
                <div className="border rounded p-3 mb-3">
                  {pairList(overviewPairsOf(panelRow))}
                  <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top">
                    <span className="fs-13 fw-medium">First Notification</span>
                    <span className={firstNotificationBadgeOf(panelRow)}>
                      {firstNotificationLabelOf(panelRow)}
                    </span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Medical Information</h6>
                {panelRow.medical.map((note) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={note}>
                    <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                      <i className="ti ti-heartbeat" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{note}</h6>
                    </div>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Affected Individuals</h6>
                {panelRow.individuals.map((person) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={person.name}>
                    <span className="avatar avatar-sm bg-info-transparent text-info rounded flex-shrink-0">
                      <i className="ti ti-school" />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{person.name}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{person.detail}</span>
                    </div>
                    <span className={person.stateTint}>{person.state}</span>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Emergency Contacts</h6>
                {panelRow.contacts.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No emergency contact recorded on this alert.</p>
                ) : (
                  panelRow.contacts.map((contact) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={contact.name}>
                      <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                        <i className={contact.icon} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{contact.name}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">{contact.detail}</span>
                      </div>
                      <span className="fs-12 text-muted">{contact.state}</span>
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Notification Timeline</h6>
                {releasedOf(panelRow).length === 0 ? (
                  <p className="fs-13 text-muted mb-3">Nothing released — held with the draft.</p>
                ) : (
                  <div className="table-responsive mb-3">
                    <table className="table table-nowrap mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Time</th>
                          <th>Channel</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...releasedOf(panelRow)]
                          .sort((a, b) => minutesOf(a.at) - minutesOf(b.at))
                          .map((entry) => (
                            <tr key={`${entry.channel}-${entry.audience}`}>
                              <td className="fs-13">{entry.at}</td>
                              <td className="fs-13">{entry.channel} · {entry.audience}</td>
                              <td className="fs-13">{entry.acknowledged} of {entry.recipients}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="fs-12 text-muted mb-3">
                  {acknowledgedOf(panelRow)} of {sentOf(panelRow)} acknowledged ·
                  {' '}{panelRow.published ? openLabelOf(panelRow) : 'not published'}
                </p>

                <h6 className="fs-14 mb-2">Resolution History</h6>
                {trailOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0">{entry.title}</h6>
                      <span className="fs-12 text-muted d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Audit Trail</h6>
                {auditOf(panelRow).map((entry) => (
                  <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${entry.title}-${entry.meta}`}>
                    <span className={`avatar avatar-sm bg-${entry.tint}-transparent text-${entry.tint} rounded flex-shrink-0`}>
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                      <span className="fs-12 text-muted text-truncate d-block">{entry.meta}</span>
                    </div>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">Attachments</h6>
                {panelRow.attachments.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No attachment filed on this alert.</p>
                ) : (
                  panelRow.attachments.map((file) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={file.name}>
                      <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                        <i className="ti ti-file-type-pdf" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{file.name}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">{file.meta}</span>
                      </div>
                    </div>
                  ))
                )}

                <div className="d-flex align-items-center flex-wrap gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'send'); }}
                  >
                    <i className="ti ti-send me-1" />Send Notification
                  </button>
                  {!isResolved(panelRow) ? (
                    <button
                      type="button" className="btn btn-outline-light bg-white btn-sm"
                      onClick={() => { setPanelRow(null); openModal(panelRow, 'resolve'); }}
                    >
                      <i className="ti ti-circle-check me-1" />Resolve Alert
                    </button>
                  ) : null}
                  <span className="fs-12 text-muted ms-auto">
                    {isResolved(panelRow)
                      ? `Closed in ${durationText(openMinutesOf(panelRow))}`
                      : `Open ${durationText(openMinutesOf(panelRow))}`}
                  </span>
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AlertModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createAlert}
        onUpdate={updateAlert}
        onNotify={sendNotification}
        onEscalate={escalateAlert}
        onResolve={resolveAlert}
        onOpen={(modal) => setActiveModal(modal)}
        onOpenPanel={() => { setActiveModal(null); setPanelRow(modalRow); }}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="haToasts" />
    </>
  );
};

export default HealthAlertsPage;
