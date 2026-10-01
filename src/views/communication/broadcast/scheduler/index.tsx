import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink, ExportMenu, GridWorkspaceShell, PageHeader, useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef, ExportFormat, FilterField, GridStatusCount, QuickFilter, SavedView, SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import BroadcastModals from './modals/BroadcastModals';
import type {
  ApprovePayload, BroadcastModalId, CancelPayload, ComposeDraft, DuplicatePayload, EditPayload,
  RecurrencePayload, SchedulePayload,
} from './modals/BroadcastModals';
import type { Broadcast, Cadence, Channel } from './data/broadcasts.data';
import {
  PERIOD, QUICK_TOTALS, REGISTER_DATE, TOTAL_COUNT, actionsOf, approvalOptions, audienceOptions,
  broadcasts as initialRows, cadenceTone, cadenceIcon, channelIcon, channelOptions, clockOf,
  creditsOf, dateKey, dayText, daysToDepartureOf, deliveryOptions, departureLabelOf,
  departureTimeOf, detailPairsOf, recurrenceLabelOf, recurrenceOptions, schedulePairsOf,
  searchIndexOf, secondFactOf, shortDate, stateChipOf, statusOptions, statusTone, typeOptions,
} from './data/broadcasts.data';
import {
  approvalQueue, audienceCards, broadcastTemplates, channelCards, queueActionsOf, queueBadge,
  queueIcon, quickActions, scheduleStates,
} from './data/reference.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'broadcast-type', label: 'Broadcast Type', kind: 'select', chipLabel: 'Type', options: typeOptions },
  { id: 'channel', label: 'Channel', kind: 'select', chipLabel: 'Channel', options: channelOptions },
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'schedule-date', label: 'Schedule Date', kind: 'daterange', chipLabel: 'Window',
    rangeFormat: 'd M Y', initialValue: PERIOD,
  },
  {
    id: 'delivery-status', label: 'Delivery Status', kind: 'select',
    chipLabel: 'Delivery', options: deliveryOptions,
  },
  { id: 'approval', label: 'Approval', kind: 'select', chipLabel: 'Approval', options: approvalOptions },
  {
    id: 'recurrence', label: 'Recurrence', kind: 'select',
    chipLabel: 'Recurrence', options: recurrenceOptions,
  },
];

const sortOptions: SortOption[] = [
  { id: 'departing', label: 'Departing soonest', icon: 'ti ti-clock' },
  { id: 'created', label: 'Recently created', icon: 'ti ti-calendar-plus' },
  { id: 'audience', label: 'Audience size', icon: 'ti ti-users' },
  { id: 'recurrence', label: 'Recurrence frequency', icon: 'ti ti-repeat' },
  { id: 'approval', label: 'Approval age', icon: 'ti ti-hourglass' },
];

const isScheduled = (row: Broadcast) => row.status === 'Scheduled';
const isRecurring = (row: Broadcast) => row.cadence !== 'One-off' && row.cadence !== 'Immediate';
const isAwaiting = (row: Broadcast) => row.approval === 'Awaiting approval' && row.status !== 'Draft';
const isPaused = (row: Broadcast) => row.status === 'Paused';
const isDraft = (row: Broadcast) => row.status === 'Draft';
const isCancelled = (row: Broadcast) => row.status === 'Cancelled';

const cadenceRank: Record<Cadence, number> = {
  Immediate: 0, Daily: 1, Weekly: 2, Monthly: 3, Yearly: 4, 'One-off': 5,
};

/** The approval filter names the state a shade differently from the record. */
const matchesApproval = (row: Broadcast, choice: string): boolean => {
  if (choice === 'Pending approval') return row.approval === 'Awaiting approval';
  if (choice === 'Approved') return row.approval === 'Approved' || row.approval === 'Auto-approved';
  return row.approval === choice;
};

const matchesRecurrence = (row: Broadcast, choice: string): boolean => {
  if (choice === 'Term-based') return row.cadence === 'Yearly';
  if (choice === 'One-off') return row.cadence === 'One-off' || row.cadence === 'Immediate';
  return row.cadence === choice;
};

const BroadcastSchedulerPage = () => {
  const [rows, setRows] = useState<Broadcast[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<BroadcastModalId | null>(null);
  const [modalRow, setModalRow] = useState<Broadcast | null>(null);
  const [readerRow, setReaderRow] = useState<Broadcast | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Broadcast | null, modal: BroadcastModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Broadcast) => Broadcast, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* ------------------------------ Sort targets ------------------------------ */

  const columns = useMemo<ColumnDef<Broadcast>[]>(
    () => [
      { id: 'departing', label: 'Departure', render: (row) => row.sendDate },
      { id: 'created', label: 'Created', render: (row) => row.createdOn },
      { id: 'audience', label: 'Audience', render: (row) => row.audienceLabel },
      { id: 'recurrence', label: 'Recurrence', render: (row) => recurrenceLabelOf(row) },
      { id: 'approval', label: 'Approval', render: (row) => row.approval },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Broadcast>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['broadcast-type'] && row.category !== filters['broadcast-type']) return false;
      if (filters.channel && !row.channels.includes(filters.channel as Channel)) return false;
      if (filters.audience && !row.audienceLabel.startsWith(filters.audience)) return false;
      if (filters.status && row.status !== filters.status) return false;
      if (filters['schedule-date']) {
        const [from, to] = filters['schedule-date'].split(' - ');
        if (from && dateKey(row.sendDate) < dateKey(from)) return false;
        if (to && dateKey(row.sendDate) > dateKey(to)) return false;
      }
      if (filters['delivery-status'] && row.delivery !== filters['delivery-status']) return false;
      if (filters.approval && !matchesApproval(row, filters.approval)) return false;
      if (filters.recurrence && !matchesRecurrence(row, filters.recurrence)) return false;
      return true;
    },
    /** Each chip narrows; the rail has no All. */
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'scheduled') return isScheduled(row);
      if (quick === 'recurring') return isRecurring(row);
      if (quick === 'awaiting') return isAwaiting(row);
      if (quick === 'paused') return isPaused(row);
      if (quick === 'drafts') return isDraft(row);
      return isCancelled(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'next7': return daysToDepartureOf(row) >= 0 && daysToDepartureOf(row) <= 7;
        case 'recurring': return isRecurring(row);
        case 'awaiting': return isAwaiting(row);
        case 'paused': return isPaused(row);
        case 'drafts': return isDraft(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'created':
          return dateKey(b.createdOn.split(',')[0]) - dateKey(a.createdOn.split(',')[0])
            || a.title.localeCompare(b.title);
        case 'audience':
          return b.audienceCount - a.audienceCount || a.title.localeCompare(b.title);
        case 'recurrence':
          return cadenceRank[a.cadence] - cadenceRank[b.cadence] || a.title.localeCompare(b.title);
        case 'approval':
          return Number(isAwaiting(b)) - Number(isAwaiting(a))
            || dateKey(a.createdOn.split(',')[0]) - dateKey(b.createdOn.split(',')[0]);
        // Soonest departure first, which is what the board is for.
        case 'departing':
        default:
          return dateKey(a.sendDate) - dateKey(b.sendDate) || a.title.localeCompare(b.title);
      }
    },
    defaultSort: 'departing',
    defaultQuick: null,
    pageSize: 12,
  });

  const countBy = useCallback(
    (test: (row: Broadcast) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the schedule holds now. */
  const shift = useCallback(
    (base: number, test: (row: Broadcast) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Broadcasts', icon: 'ti ti-layout-list' },
      { id: 'next7', label: 'Next 7 Days', icon: 'ti ti-clock' },
      { id: 'recurring', label: 'Recurring Only', icon: 'ti ti-repeat' },
      { id: 'awaiting', label: 'Awaiting Approval', icon: 'ti ti-hourglass' },
      { id: 'paused', label: 'Paused', icon: 'ti ti-player-pause' },
      { id: 'drafts', label: 'My Drafts', icon: 'ti ti-pencil' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      {
        id: 'scheduled', label: 'Scheduled', icon: 'ti ti-clock',
        count: shift(QUICK_TOTALS.scheduled, isScheduled),
      },
      {
        id: 'recurring', label: 'Recurring', icon: 'ti ti-repeat',
        count: shift(QUICK_TOTALS.recurring, isRecurring),
      },
      {
        id: 'awaiting', label: 'Awaiting Approval', icon: 'ti ti-hourglass',
        count: shift(QUICK_TOTALS.awaiting, isAwaiting),
      },
      {
        id: 'paused', label: 'Paused', icon: 'ti ti-player-pause',
        count: shift(QUICK_TOTALS.paused, isPaused),
      },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: shift(QUICK_TOTALS.drafts, isDraft) },
      {
        id: 'cancelled', label: 'Cancelled', icon: 'ti ti-ban',
        count: shift(QUICK_TOTALS.cancelled, isCancelled),
      },
    ],
    [shift],
  );

  const statusCounts = useMemo<GridStatusCount[]>(
    () => [
      {
        tone: 'is-scheduled', icon: 'ti ti-clock',
        label: `${shift(QUICK_TOTALS.scheduled, isScheduled)} scheduled`,
      },
      {
        tone: 'is-high', icon: 'ti ti-hourglass',
        label: `${shift(QUICK_TOTALS.awaiting, isAwaiting)} awaiting approval`,
      },
      {
        tone: 'is-draft', icon: 'ti ti-pencil',
        label: `${shift(QUICK_TOTALS.drafts, isDraft)} drafts`,
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const compose = useCallback(
    (draft: ComposeDraft, andSchedule: boolean) => {
      if (!draft.title.trim()) {
        push('Give the broadcast a title', 'warning');
        return;
      }
      const id = `BSC-2026-00${56 + rows.length}`;
      const created: Broadcast = {
        id,
        category: draft.type,
        title: draft.title.trim(),
        description: draft.description.trim() || 'No description given.',
        body: [{ heading: '', paragraphs: draft.body.split('\n\n').filter(Boolean), bullets: [] }],
        readerLead: `${draft.type} · ${draft.audience}`,
        readerTitle: draft.title.trim(),
        status: 'Draft', approval: 'Requires review', delivery: 'Not started',
        sendDate: REGISTER_DATE, sendTime: '09:00 am', timeZone: '',
        expires: '',
        cadence: 'One-off', cadenceLabel: '', sentTimes: 0, delivered: 0,
        audienceLabel: draft.audience,
        // The audience sizes the reference section publishes.
        audienceCount: draft.audience === 'All Students' ? 1286
          : draft.audience === 'Parents' ? 1240
            : draft.audience === 'Teachers' ? 184
              : draft.audience === 'Staff' ? 96
                : draft.audience === 'Transport Users' ? 612
                  : draft.audience === 'Hostel Students' ? 284
                    : draft.audience === 'Library Members' ? 1410 : 268,
        audienceRows: [{ label: draft.audience, note: 'Read at send time', value: '—' }],
        channels: draft.channels,
        channelStates: draft.channels.map((channel) => ({
          channel, note: 'Not scheduled', state: 'Not started',
        })),
        attachments: [],
        createdBy: 'Ms. Latha Rao', createdOn: `${REGISTER_DATE}, 09:00 am`,
        heldSince: '', heldBy: '',
        approvalTrail: [
          { who: 'Ms. Latha Rao', state: 'Drafted', at: `${REGISTER_DATE}, 09:00 am`, note: 'Created from the scheduler.' },
        ],
      };
      setRows((current) => [created, ...current]);
      if (andSchedule) {
        setModalRow(created);
        setActiveModal('schedule');
      } else {
        setActiveModal(null);
      }
      push(andSchedule ? `${id} written — set its departure` : `${id} saved as a draft`);
    },
    [push, rows.length],
  );

  const schedule = useCallback(
    (payload: SchedulePayload) => {
      const [day, month, year] = payload.sendDate.split('/');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const sendDate = payload.departure === 'Immediate'
        ? REGISTER_DATE
        : `${Number(day)} ${monthNames[Number(month) - 1] ?? 'Aug'} ${year ?? '2026'}`;
      patchRow(
        (row) => ({
          ...row,
          status: 'Scheduled',
          approval: payload.requiresApproval ? 'Awaiting approval' : 'Approved',
          delivery: payload.requiresApproval ? 'Not started' : 'Queued',
          sendDate,
          sendTime: payload.sendTime,
          timeZone: payload.timeZone,
          cadence: payload.departure === 'Immediate' ? 'Immediate'
            : payload.departure === 'Recurring' ? 'Weekly' : 'One-off',
          cadenceLabel: payload.departure === 'Recurring' ? 'Every Monday' : '',
        }),
        `${modalRow?.id ?? 'Broadcast'} scheduled for ${sendDate} at ${payload.sendTime}`,
      );
    },
    [modalRow, patchRow],
  );

  const edit = useCallback(
    (payload: EditPayload) =>
      patchRow(
        (row) => ({
          ...row,
          title: payload.title.trim() || row.title,
          category: payload.type || row.category,
          description: payload.description.trim() || row.description,
          body: [{
            heading: '', paragraphs: payload.body.split('\n\n').filter(Boolean), bullets: [],
          }],
          audienceLabel: payload.audience || row.audienceLabel,
          expires: payload.autoExpiry,
          // Editing an approved broadcast sends it back to the queue.
          approval: payload.resubmit ? 'Awaiting approval' : row.approval,
          status: payload.keepSchedule ? row.status : 'Draft',
        }),
        payload.resubmit
          ? `${modalRow?.id ?? 'Broadcast'} updated and returned to the approval queue`
          : `${modalRow?.id ?? 'Broadcast'} updated`,
      ),
    [modalRow, patchRow],
  );

  const duplicate = useCallback(
    (payload: DuplicatePayload) => {
      if (!modalRow) return;
      const id = `BSC-2026-00${56 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id,
          title: payload.title.trim() || `${modalRow.title} (copy)`,
          // A copy is an unscheduled draft with no history.
          status: 'Draft', approval: 'Requires review', delivery: 'Not started',
          timeZone: '', sentTimes: 0, delivered: 0,
          heldSince: '', heldBy: '',
          audienceLabel: payload.copyAudience ? modalRow.audienceLabel : 'Parents',
          audienceCount: payload.copyAudience ? modalRow.audienceCount : 1240,
          channels: payload.copyChannels ? modalRow.channels : [],
          channelStates: payload.copyChannels
            ? modalRow.channelStates.map((state) => ({ ...state, state: 'Not started' }))
            : [],
          cadence: payload.copyRecurrence ? modalRow.cadence : 'One-off',
          cadenceLabel: payload.copyRecurrence ? modalRow.cadenceLabel : '',
          attachments: payload.copyAttachments ? modalRow.attachments : [],
          createdOn: `${REGISTER_DATE}, 09:00 am`,
          approvalTrail: [
            { who: 'Ms. Latha Rao', state: 'Drafted', at: `${REGISTER_DATE}, 09:00 am`, note: `Copied from ${modalRow.id}.` },
          ],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} created as a draft copy`);
    },
    [modalRow, push, rows.length],
  );

  const setRecurrence = useCallback(
    (payload: RecurrencePayload) =>
      patchRow(
        (row) => ({
          ...row,
          cadence: (payload.frequency === 'Term-based' ? 'Yearly' : payload.frequency) as Cadence,
          cadenceLabel: payload.frequency === 'Weekly'
            ? `Every ${payload.days.join(', ')}`
            : payload.frequency,
          sendTime: payload.time,
        }),
        `${modalRow?.id ?? 'Broadcast'} now runs ${payload.frequency.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const approve = useCallback(
    (payload: ApprovePayload) =>
      patchRow(
        (row) => ({
          ...row,
          approval: payload.approved ? 'Approved' : 'Rejected',
          status: payload.approved ? row.status : 'Cancelled',
          delivery: payload.approved ? 'Queued' : 'Never sent',
          approvalTrail: [
            ...row.approvalTrail,
            {
              who: 'Principal',
              state: payload.approved ? 'Approved' : 'Rejected',
              at: `${REGISTER_DATE}, 09:00 am`,
              note: payload.note.trim() || (payload.approved
                ? 'Approved without comment.'
                : 'Rejected without comment.'),
            },
          ],
        }),
        payload.approved
          ? `${modalRow?.id ?? 'Broadcast'} approved — ${modalRow ? creditsOf(modalRow).toLocaleString() : 0} SMS credits reserved`
          : `${modalRow?.id ?? 'Broadcast'} rejected`,
      ),
    [modalRow, patchRow],
  );

  const cancel = useCallback(
    (payload: CancelPayload) =>
      patchRow(
        (row) => ({
          ...row,
          status: 'Cancelled',
          delivery: 'Never sent',
          heldSince: REGISTER_DATE,
          heldBy: 'the principal',
          approvalTrail: [
            ...row.approvalTrail,
            {
              who: 'Principal', state: 'Cancelled', at: `${REGISTER_DATE}, 09:00 am`,
              note: payload.reason.trim() || 'Cancelled without a stated reason.',
            },
          ],
        }),
        `${modalRow?.id ?? 'Broadcast'} cancelled · ${payload.scope.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const pause = useCallback(
    (row: Broadcast) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id
          ? { ...entry, status: 'Paused', delivery: 'Not started', heldSince: REGISTER_DATE, heldBy: 'Ms. Latha Rao' }
          : entry
      )));
      push(`${row.id} paused`);
    },
    [push],
  );

  const resume = useCallback(
    (row: Broadcast) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id
          ? { ...entry, status: 'Scheduled', delivery: 'Queued', heldSince: '', heldBy: '' }
          : entry
      )));
      push(`${row.id} resumed — next run ${shortDate(row.sendDate)}`);
    },
    [push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        push(`Delivery report prepared for ${workspace.visible.length} broadcasts`);
        return;
      }
      push(`${workspace.visible.length} broadcasts exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /** The card's rail, dispatching whatever the status offers. */
  const runAction = useCallback(
    (row: Broadcast, id: string) => {
      if (id === 'view') { setReaderRow(row); return; }
      if (id === 'pause') { pause(row); return; }
      if (id === 'resume') { resume(row); return; }
      openModal(row, id as BroadcastModalId);
    },
    [openModal, pause, resume],
  );

  /* ---------------------------------- Card ---------------------------------- */

  const renderCard = (row: Broadcast) => {
    const clock = clockOf(row);
    const fact = secondFactOf(row);
    const chip = stateChipOf(row);
    return (
      <div className={`broadcast${statusTone[row.status]}`}>
        <div className="broadcast-when">
          <span className="clock"><b>{clock.big}</b><span>{clock.small}</span></span>
          <span className="broadcast-when-text">
            <b>{departureTimeOf(row)}</b>
            <small>{departureLabelOf(row)}</small>
          </span>
        </div>
        <div className="broadcast-body">
          <span className="category">{row.category}</span>
          <h3 className="broadcast-title">
            <ActionLink onClick={() => setReaderRow(row)}>{row.title}</ActionLink>
          </h3>
          <p className="broadcast-description">{row.description}</p>
          <div className="broadcast-facts">
            <span>
              <i className="ti ti-users" />{row.audienceLabel} · <b>{row.audienceCount.toLocaleString()}</b>
            </span>
            <span>
              <i className={fact.icon} />{fact.label}
              {fact.strong ? <b>{fact.strong}</b> : null}{fact.tail}
            </span>
          </div>
          <div className="d-flex gap-2 flex-wrap mt-3">
            <span className={cadenceTone[row.cadence]}>
              <i className={cadenceIcon[row.cadence]} />{recurrenceLabelOf(row)}
            </span>
            <span className={chip.badge}><i className={chip.icon} />{chip.label}</span>
            <span className="message-status-badge">{row.delivery}</span>
          </div>
        </div>
        <div className="broadcast-footer">
          <span className="pips">
            {row.channels.map((channel) => (
              <span className="pip is-on" title={channel} key={channel}>
                <i className={channelIcon[channel]} />
              </span>
            ))}
          </span>
          {/* The template's overflow dropdown, flattened into the rail. */}
          <div className="d-inline-flex gap-1">
            {actionsOf(row).map((action) => (
              <button
                type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                aria-label={action.label} title={action.label} key={action.id}
                onClick={() => runAction(row, action.id)}
              >
                <i className={action.icon} />
              </button>
            ))}
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
    label: string, title: string, note: string, action: { icon: string; text: string; onClick: () => void },
  ) => (
    <div className="message-section-header">
      <div>
        <span className="message-metric-label">{label}</span>
        <h2>{title}</h2>
        <p>{note}</p>
      </div>
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
        onClick={action.onClick}
      >
        <i className={`${action.icon} me-1`} />{action.text}
      </button>
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Broadcast Scheduler"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find(isDraft) ?? rows[0] ?? null, 'schedule')}
                  >
                    <i className="ti ti-clock-play me-2" />Schedule Now
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows[0] ?? null, 'duplicate')}
                  >
                    <i className="ti ti-copy me-2" />Duplicate
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Delivery report" printIcon="ti ti-report" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Broadcast
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
            searchPlaceholder="Search broadcast, audience or requester…"
            searchLabel="Search broadcasts"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="broadcasts"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            workspaceId="bscWorkspace"
            onRefresh={() => { setRows(initialRows); push('Schedule refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            caption={
              <>
                {TOTAL_COUNT - initialRows.length + rows.length} broadcasts are queued between now
                and the end of term. Open one to change its schedule, its audience or the channels
                it leaves on.
              </>
            }
            statusCounts={statusCounts}
            cardClassName="col-xxl-3 col-lg-6 col-md-6"
            renderCard={renderCard}
            emptyIcon="ti ti-clock-off"
            emptyTitle="No broadcasts match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => openModal(null, 'create')}>
                <i className="ti ti-square-rounded-plus me-2" />New Broadcast
              </button>
            }
          />

          {/* Delivery channels */}
          {sectionHeader(
            'Channels', 'Delivery channels',
            'Seven routes a broadcast can leave on, and what each is currently holding. A channel with a stalled queue delays every broadcast that names it.',
            { icon: 'ti ti-settings', text: 'Channel settings', onClick: () => push('Channel settings live under Settings · Communication') },
          )}
          <div className="row g-3 mb-5">
            {channelCards.map((card) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={card.channel}>
                <div className="channel">
                  <div className="channel-top">
                    <span className="channel-icon"><i className={channelIcon[card.channel]} /></span>
                    <div className="flex-fill">
                      <p className="channel-name">{card.channel}</p>
                      <p>{card.note}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Status</div>
                    <div className="row-value">
                      <span className={`message-status-badge ${card.stateTone}`}>{card.state}</span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Scheduled jobs</div>
                    <div className="row-value"><b>{card.jobs}</b></div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Queue</div>
                    <div className="row-value">{card.queue}</div>
                  </div>
                  <div className="channel-footer">
                    <span>
                      <span className={`message-status-badge ${card.healthTone}`}>{card.health}</span>
                      <span className="fs-12 text-muted ms-2">Last run {card.lastRun}</span>
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => push(`${card.channel} settings opened`)}
                    >
                      Configure
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Audience management */}
          {sectionHeader(
            'Audiences', 'Audience management',
            'The groups a broadcast can be addressed to. Counts are read at send time, not at scheduling time — a group that grows before Friday reaches the new members too.',
            { icon: 'ti ti-target-arrow', text: 'Address a new audience', onClick: () => openModal(null, 'create') },
          )}
          <div className="row g-3 mb-5">
            {audienceCards.map((card) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={card.name}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={card.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{card.name}</p>
                      <small>{card.note}</small>
                    </div>
                  </div>
                  <div className="audience-count"><b>{card.count}</b><span>{card.unit}</span></div>
                  <div className="info-row">
                    <div className="row-key">Broadcast status</div>
                    <div className="row-value">
                      <span className={`message-status-badge ${card.statusTone}`}>{card.status}</span>
                    </div>
                  </div>
                  <div className="audience-footer">Last delivery · {card.last}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Schedule management */}
          {sectionHeader(
            'Scheduling', 'Schedule management',
            'Every broadcast sits in exactly one of these states. The rules below govern how it leaves the state it is in.',
            { icon: 'ti ti-repeat', text: 'Configure recurrence', onClick: () => openModal(rows.find(isRecurring) ?? null, 'recurrence') },
          )}
          <div className="row g-3 mb-5">
            {scheduleStates.map((state) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={state.name}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={state.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{state.name}</p>
                      <small>{state.schedule}</small>
                    </div>
                  </div>
                  <div className="audience-count"><b>{state.count}</b><span>{state.tag}</span></div>
                  <div className="info-row">
                    <div className="row-key">Frequency</div>
                    <div className="row-value">{state.frequency}</div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Time zone</div>
                    <div className="row-value">{state.timeZone}</div>
                  </div>
                  <div className="audience-footer">Auto expiry · {state.expiry}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Broadcast templates */}
          {sectionHeader(
            'Templates', 'Broadcast templates',
            'Nine broadcasts the school schedules every year, already written and already routed. Start from one and set the date.',
            { icon: 'ti ti-plus', text: 'Create template', onClick: () => openModal(null, 'create') },
          )}
          <div className="row g-3 mb-5">
            {broadcastTemplates.map((template) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={template.name}>
                <div className="template">
                  <div className="template-preview">
                    <div className="template-mini">
                      <b>{template.preview}</b>
                      {template.lines.map((line) => (
                        <i className={`width-${line}`} key={`${template.name}-${line}`} />
                      ))}
                    </div>
                  </div>
                  <div className="template-body">
                    <span className="category">{template.category}</span>
                    <p className="template-title">{template.name}</p>
                    <p>{template.note}</p>
                    <span className="pips mt-2">
                      {template.channels.map((channel) => (
                        <span className="pip is-on" title={channel} key={channel}>
                          <i className={channelIcon[channel]} />
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="template-footer">
                    <span>{template.audience}</span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => openModal(null, 'create')}
                    >
                      Use template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Approval queue */}
          {sectionHeader(
            'Governance', 'Approval queue',
            'Nothing on a paid channel leaves without a reviewer. A broadcast unapproved at its send time is held, not sent late.',
            { icon: 'ti ti-user-check', text: 'Review all', onClick: () => openModal(rows.find(isAwaiting) ?? null, 'approve') },
          )}
          <div className="row g-3 mb-5">
            {approvalQueue.map((item) => (
              <div className="col-12 col-xxl-6" key={item.title}>
                <div className="schedule">
                  <div className="schedule-main">
                    <div className="d-flex align-items-start gap-2 flex-wrap">
                      <div className="flex-fill">
                        <span className={queueBadge[item.state]}>
                          <i className={queueIcon[item.state]} />{item.state}
                        </span>
                        <p className="schedule-title mt-1">{item.title}</p>
                      </div>
                    </div>
                    <div className="schedule-meta">
                      <span><i className="ti ti-user" />Requested by <b>{item.requestedBy}</b></span>
                      <span><i className="ti ti-clock" />{item.whenLabel} <b>{item.when}</b></span>
                      <span>
                        <i className={item.reviewerIcon} />
                        {item.reviewerLabel ? `${item.reviewerLabel} ` : ''}{item.reviewer}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-3 flex-wrap">
                      {/* Approve, Reject, Reschedule or Revise — from the state. */}
                      {queueActionsOf(item).map((action) => (
                        <button
                          type="button" className={`btn btn-sm ${action.tone}`} key={action.label}
                          onClick={() => {
                            const target = rows.find((row) => row.title === item.title) ?? null;
                            if (action.label === 'View' && target) { setReaderRow(target); return; }
                            if (action.label === 'Approve' && target) { openModal(target, 'approve'); return; }
                            if (action.label === 'Reschedule' && target) { openModal(target, 'schedule'); return; }
                            if (action.label === 'Cancel' && target) { openModal(target, 'cancel'); return; }
                            push(`${item.title} — ${action.label.toLowerCase()}`);
                          }}
                        >
                          {action.icon ? <i className={`${action.icon} me-1`} /> : null}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          {sectionHeader(
            'Shortcuts', 'Quick actions', 'The six things most often done from this page.',
            { icon: 'ti ti-settings', text: 'Broadcast settings', onClick: () => push('Broadcast settings live under Settings · Communication') },
          )}
          <div className="row g-3">
            {quickActions.map((action) => (
              <div className="col-xxl-4 col-lg-4 col-md-6" key={action.title}>
                <ActionLink
                  className="message-action"
                  onClick={() => {
                    if (action.title === 'Create Broadcast') { openModal(null, 'create'); return; }
                    if (action.title === 'Schedule Campaign') { openModal(rows[0] ?? null, 'schedule'); return; }
                    if (action.title === 'Recurring Rules') {
                      openModal(rows.find(isRecurring) ?? null, 'recurrence');
                      return;
                    }
                    push(`${action.title} — ${action.note.toLowerCase()}`);
                  }}
                >
                  <span className={`message-action-icon ${action.icon}`} />
                  <span className="flex-fill">
                    <span className="d-block fw-medium">{action.title}</span>
                    <span className="fs-12 text-muted">{action.note}</span>
                  </span>
                  <i className="message-action-go ti ti-chevron-right" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Broadcast reader */}
          <Offcanvas
            open={readerRow !== null}
            onClose={() => setReaderRow(null)}
            title={readerRow ? `${readerRow.category} · ${readerRow.status}` : 'Broadcast'}
            labelledById="bsc_reader_title"
            className="message-detail-panel"
          >
            {readerRow ? (
              <>
                <h5 className="fs-16 mb-2">{readerRow.title}</h5>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  <span className="message-status-badge">
                    <i className="ti ti-clock" />
                    {readerRow.sendDate}, {readerRow.sendTime} {readerRow.timeZone.split(' ')[0]}
                  </span>
                  <span className={cadenceTone[readerRow.cadence]}>
                    <i className={cadenceIcon[readerRow.cadence]} />{recurrenceLabelOf(readerRow)}
                  </span>
                  <span className={stateChipOf(readerRow).badge}>
                    <i className={stateChipOf(readerRow).icon} />{stateChipOf(readerRow).label}
                  </span>
                </div>
                <p className="fs-12 text-muted mb-3">
                  Created by {readerRow.createdBy} · {readerRow.createdOn}
                </p>

                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setReaderRow(null); openModal(readerRow, 'duplicate'); }}
                  >
                    <i className="ti ti-copy me-1" />Duplicate
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setReaderRow(null); openModal(readerRow, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                  {readerRow.approval === 'Awaiting approval' ? (
                    <button
                      type="button" className="btn btn-primary btn-sm"
                      onClick={() => { setReaderRow(null); openModal(readerRow, 'approve'); }}
                    >
                      <i className="ti ti-check me-1" />Approve
                    </button>
                  ) : null}
                </div>

                <span className="fs-12 text-muted d-block mb-1">{readerRow.readerLead}</span>
                <h6 className="fs-15 mb-2">{readerRow.readerTitle}</h6>
                {readerRow.body.map((block) => (
                  <div key={block.heading || block.paragraphs[0]}>
                    {block.heading ? <h6 className="fs-13 mt-3 mb-1">{block.heading}</h6> : null}
                    {block.paragraphs.map((paragraph) => (
                      <p className="fs-13 text-muted mb-2" key={paragraph}>{paragraph}</p>
                    ))}
                    {block.bullets.length > 0 ? (
                      <ul className="fs-13 text-muted mb-2 ps-3">
                        {block.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    ) : null}
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">
                  <i className="ti ti-user-check me-1" />Approval history
                </h6>
                {readerRow.approvalTrail.map((step) => (
                  <div className="border rounded p-2 mb-2" key={`${step.who}-${step.at}`}>
                    <h6 className="fs-13 mb-0">
                      {step.who}
                      <span className="fs-12 text-muted ms-2">{step.state}</span>
                      <span className="fs-12 text-muted ms-2">{step.at}</span>
                    </h6>
                    <p className="fs-12 text-muted mb-0 mt-1">{step.note}</p>
                  </div>
                ))}

                <h6 className="fs-14 mb-2 mt-3">
                  <i className="ti ti-info-circle me-1" />Broadcast details
                </h6>
                <div className="border rounded p-3 mb-3">{pairList(detailPairsOf(readerRow))}</div>

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-clock-cog me-1" />Schedule configuration
                </h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(schedulePairsOf(readerRow))}
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm mt-2"
                    onClick={() => { setReaderRow(null); openModal(readerRow, 'schedule'); }}
                  >
                    Reschedule
                  </button>
                </div>

                <h6 className="fs-14 mb-2"><i className="ti ti-repeat me-1" />Recurrence rules</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Pattern', value: recurrenceLabelOf(readerRow) },
                    {
                      label: 'Series ends',
                      value: readerRow.cadenceLabel ? 'End of term' : 'Not part of a series',
                    },
                    {
                      label: 'Next run',
                      value: readerRow.cadence === 'Weekly'
                        ? shortDate(readerRow.sendDate)
                        : daysToDepartureOf(readerRow) >= 0
                          ? `in ${dayText(daysToDepartureOf(readerRow))}`
                          : 'Nothing further queued',
                    },
                  ])}
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm mt-2"
                    onClick={() => { setReaderRow(null); openModal(readerRow, 'recurrence'); }}
                  >
                    Make recurring
                  </button>
                </div>

                <h6 className="fs-14 mb-2"><i className="ti ti-router me-1" />Delivery channels</h6>
                <div className="border rounded p-3 mb-3">
                  {readerRow.channelStates.map((state, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={state.channel}
                    >
                      <span className="fs-13 text-muted">
                        <i className={`${channelIcon[state.channel]} me-1`} />{state.channel}
                        <span className="d-block fs-12">{state.note}</span>
                      </span>
                      <span className="fs-13 fw-medium">{state.state}</span>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-target-arrow me-1" />Target audience
                  <span className="fs-13 text-muted ms-2">
                    {readerRow.audienceCount.toLocaleString()}
                  </span>
                </h6>
                <div className="border rounded p-3 mb-3">
                  {readerRow.audienceRows.map((audience, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={audience.label}
                    >
                      <span className="fs-13 text-muted">
                        {audience.label}
                        <span className="d-block fs-12">{audience.note}</span>
                      </span>
                      <span className="fs-13 fw-medium">{audience.value}</span>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2"><i className="ti ti-paperclip me-1" />Attachments</h6>
                {readerRow.attachments.length === 0 ? (
                  <p className="fs-13 text-muted mb-0">Nothing attached to this broadcast.</p>
                ) : (
                  readerRow.attachments.map((file) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={file.name}>
                      <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                        <i className="ti ti-file-type-pdf" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{file.name}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">{file.meta}</span>
                      </div>
                      <ActionLink
                        className="dt-ib" ariaLabel={`Download ${file.name}`}
                        onClick={() => push(`${file.name} downloaded`)}
                      >
                        <i className="ti ti-download" />
                      </ActionLink>
                    </div>
                  ))
                )}
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <BroadcastModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCompose={compose}
        onSchedule={schedule}
        onEdit={edit}
        onDuplicate={duplicate}
        onRecurrence={setRecurrence}
        onApprove={approve}
        onCancel={cancel}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="bscToasts" />
    </>
  );
};

export default BroadcastSchedulerPage;
