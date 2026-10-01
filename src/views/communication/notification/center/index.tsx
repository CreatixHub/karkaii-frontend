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
import NotificationModals from './modals/NotificationModals';
import type {
  CreateDraft, DuplicatePayload, EmailPayload, ExportPayload, ImportPayload, NotificationModalId,
  ParentPayload, PushPayload, SchedulePayload, TemplatePayload,
} from './modals/NotificationModals';
import type { Category, Channel, Notification, Priority } from './data/notifications.data';
import {
  PERIOD, QUICK_TOTALS, REGISTER_DATE, TOTAL_COUNT, attachmentLabelOf, audienceOptions,
  authorOptions, cardToneOf, categoryIcon, categoryOptions, channelFilterOptions, channelIcon,
  deliveryLabelOf, detailPairsOf, isLowRead, isWellRead, needsAck,
  notifications as initialRows, outstandingAckOf, priorityBadge, priorityIcon, priorityOptions,
  reachPairsOf, readLabelOf, readRateOf, readStatusOptions, searchIndexOf, stampIconOf,
  stampLabelOf, statusBadge, statusIcon, statusOf, statusOptions,
} from './data/notifications.data';
import {
  activity, activityRateOf, channelCards, deliveryRules, notificationTemplates,
  parentCommunications, parentStateBadge, quickActions, recipientGroups, variablesOf,
} from './data/reference.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  {
    id: 'notification-type', label: 'Notification Type', kind: 'select',
    chipLabel: 'Type', options: categoryOptions,
  },
  {
    id: 'channel', label: 'Channel', kind: 'select', chipLabel: 'Channel',
    options: channelFilterOptions, initialValue: 'Email Notifications',
  },
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  { id: 'priority', label: 'Priority', kind: 'select', chipLabel: 'Priority', options: priorityOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'read-status', label: 'Read status', kind: 'select',
    chipLabel: 'Read', options: readStatusOptions,
  },
  {
    id: 'date-range', label: 'Date Range', kind: 'daterange', chipLabel: 'Period',
    rangeFormat: 'd M Y', initialValue: PERIOD,
  },
  {
    id: 'created-by', label: 'Created by', kind: 'select', chipLabel: 'Author',
    allLabel: 'Anyone', options: authorOptions,
  },
];

const sortOptions: SortOption[] = [
  { id: 'recent', label: 'Most recent', icon: 'ti ti-clock' },
  { id: 'priority', label: 'Priority', icon: 'ti ti-flame' },
  { id: 'read', label: 'Read rate', icon: 'ti ti-eye' },
  { id: 'audience', label: 'Audience size', icon: 'ti ti-users' },
  { id: 'failed', label: 'Failed first', icon: 'ti ti-alert-triangle' },
];

const priorityRank: Record<Priority, number> = { Urgent: 0, High: 1, Normal: 2, Low: 3 };

const usesChannel = (row: Notification, channel: Channel) => row.channels.includes(channel);
const isScheduled = (row: Notification) => statusOf(row) === 'Scheduled';

/** The Channel filter names a product; the record names a route. */
const matchesChannelFilter = (row: Notification, choice: string): boolean => {
  if (choice === 'Email Notifications') return usesChannel(row, 'Email');
  if (choice === 'Push Notifications') return usesChannel(row, 'Push');
  return usesChannel(row, 'Portal');
};

const matchesReadStatus = (row: Notification, choice: string): boolean => {
  if (choice === 'Above 80% read') return isWellRead(row);
  if (choice === 'Below 50% read') return isLowRead(row);
  if (choice === 'Acknowledgement pending') return needsAck(row);
  return row.ackRequired && outstandingAckOf(row) === 0;
};

const NotificationCenterPage = () => {
  const [rows, setRows] = useState<Notification[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<NotificationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Notification | null>(null);
  const [panelRow, setPanelRow] = useState<Notification | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Notification | null, modal: NotificationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /* ------------------------------ Sort targets ------------------------------ */

  const columns = useMemo<ColumnDef<Notification>[]>(
    () => [
      { id: 'recent', label: 'Sent', render: (row) => row.stamp },
      { id: 'priority', label: 'Priority', render: (row) => row.priority },
      { id: 'read', label: 'Read rate', render: (row) => readLabelOf(row) },
      { id: 'audience', label: 'Audience', render: (row) => row.audienceLabel },
      { id: 'failed', label: 'Status', render: (row) => statusOf(row) },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Notification>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['notification-type'] && row.category !== filters['notification-type']) return false;
      if (filters.channel && !matchesChannelFilter(row, filters.channel)) return false;
      if (filters.audience && !row.audienceLabel.startsWith(filters.audience.replace('All ', ''))) {
        // "All Students" and "Parents" both appear as prefixes on the labels.
        if (!row.audienceLabel.includes(filters.audience)) return false;
      }
      if (filters.priority && row.priority !== filters.priority) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters['read-status'] && !matchesReadStatus(row, filters['read-status'])) return false;
      if (filters['created-by'] && row.createdBy !== filters['created-by']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'email') return usesChannel(row, 'Email');
      if (quick === 'push') return usesChannel(row, 'Push');
      if (quick === 'parent') return usesChannel(row, 'Portal');
      if (quick === 'scheduled') return isScheduled(row);
      if (quick === 'low') return isLowRead(row);
      return needsAck(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'email': return usesChannel(row, 'Email');
        case 'push': return usesChannel(row, 'Push');
        case 'parent': return usesChannel(row, 'Portal');
        case 'low': return isLowRead(row);
        case 'archived': return row.archived;
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'priority':
          return priorityRank[a.priority] - priorityRank[b.priority] || a.title.localeCompare(b.title);
        case 'read':
          return readRateOf(b) - readRateOf(a) || a.title.localeCompare(b.title);
        case 'audience':
          return b.audience - a.audience || a.title.localeCompare(b.title);
        case 'failed':
          return Number(Boolean(b.failure)) - Number(Boolean(a.failure))
            || readRateOf(a) - readRateOf(b);
        case 'recent':
        default:
          return a.stamp.localeCompare(b.stamp) === 0
            ? a.title.localeCompare(b.title)
            : b.stamp.localeCompare(a.stamp);
      }
    },
    defaultSort: 'recent',
    defaultQuick: null,
    pageSize: 12,
  });

  const countBy = useCallback(
    (test: (row: Notification) => boolean) => rows.filter(test).length,
    [rows],
  );

  const shift = useCallback(
    (base: number, test: (row: Notification) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Notifications', icon: 'ti ti-layout-list' },
      { id: 'email', label: 'Email only', icon: 'ti ti-mail' },
      { id: 'push', label: 'Push only', icon: 'ti ti-bell' },
      { id: 'parent', label: 'Parent communications', icon: 'ti ti-users' },
      { id: 'low', label: 'Low read rate', icon: 'ti ti-eye-off' },
      { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      {
        id: 'email', label: 'Email', icon: 'ti ti-mail',
        count: shift(QUICK_TOTALS.email, (row) => usesChannel(row, 'Email')),
      },
      {
        id: 'push', label: 'Push', icon: 'ti ti-bell',
        count: shift(QUICK_TOTALS.push, (row) => usesChannel(row, 'Push')),
      },
      {
        id: 'parent', label: 'Parent', icon: 'ti ti-users',
        count: shift(QUICK_TOTALS.parent, (row) => usesChannel(row, 'Portal')),
      },
      {
        id: 'scheduled', label: 'Scheduled', icon: 'ti ti-clock',
        count: shift(QUICK_TOTALS.scheduled, isScheduled),
      },
      {
        id: 'low', label: 'Low read rate', icon: 'ti ti-eye-off',
        count: shift(QUICK_TOTALS.lowRead, isLowRead),
      },
      {
        id: 'ack', label: 'Needs ack', icon: 'ti ti-checkbox',
        count: shift(QUICK_TOTALS.needsAck, needsAck),
      },
    ],
    [shift],
  );

  const statusCounts = useMemo<GridStatusCount[]>(
    () => [
      {
        tone: 'is-live', icon: 'ti ti-checks',
        label: `${shift(54, (row) => statusOf(row) === 'Sent' || row.archived)} sent`,
      },
      {
        tone: 'is-scheduled', icon: 'ti ti-clock',
        label: `${shift(QUICK_TOTALS.scheduled, isScheduled)} scheduled`,
      },
      {
        tone: 'is-draft', icon: 'ti ti-pencil',
        label: `${shift(3, (row) => statusOf(row) === 'Draft')} drafts`,
      },
    ],
    [shift],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const create = useCallback(
    (draft: CreateDraft, intent: 'draft' | 'schedule' | 'send') => {
      if (!draft.title.trim()) {
        push('Give the notification a title', 'warning');
        return;
      }
      const id = `NTF-2026-0${156 + rows.length}`;
      setRows((current) => [
        {
          id,
          category: draft.category as Category,
          title: draft.title.trim(),
          summary: draft.description.trim() || draft.body.trim().slice(0, 140) || 'No summary given.',
          audienceLabel: draft.audience,
          // The roll each group carries, as the recipient section publishes it.
          audience: draft.audience === 'All Students' ? 1286
            : draft.audience === 'Parents' ? 1240
              : draft.audience === 'Teachers' ? 184
                : draft.audience === 'Staff' ? 96
                  : draft.audience === 'Transport Users' ? 612 : 268,
          priority: draft.priority as Priority,
          channels: draft.channels,
          stamp: REGISTER_DATE, recurrence: '',
          delivered: 0, read: 0, acknowledged: 0, ackRequired: draft.ackRequired,
          scheduled: intent === 'schedule', draft: intent === 'draft',
          archived: false, failure: '',
          attachments: [],
          createdBy: authorOptions[1], automated: false,
        },
        ...current,
      ]);
      if (intent === 'schedule') {
        setActiveModal('schedule');
      } else {
        setActiveModal(null);
      }
      push(
        intent === 'send' ? `${id} sent` : intent === 'schedule' ? `${id} ready to schedule` : `${id} saved as a draft`,
      );
    },
    [push, rows.length],
  );

  const archive = useCallback(
    (row: Notification) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id ? { ...entry, archived: true } : entry
      )));
      push(`${row.title} archived`);
    },
    [push],
  );

  const duplicate = useCallback(
    (payload: DuplicatePayload) => {
      if (!modalRow) return;
      const id = `NTF-2026-0${156 + rows.length}`;
      const unread = Math.max(0, modalRow.delivered - modalRow.read);
      setRows((current) => [
        {
          ...modalRow,
          id,
          title: payload.title.trim() || `${modalRow.title} (copy)`,
          // A copy is a draft with no history of its own.
          delivered: 0, read: 0, acknowledged: 0,
          scheduled: false, draft: true, archived: false, failure: '',
          stamp: REGISTER_DATE, recurrence: '',
          audience: payload.unreadOnly ? unread
            : payload.copyAudience ? modalRow.audience : 1240,
          audienceLabel: payload.unreadOnly
            ? `${modalRow.audienceLabel} · unread`
            : payload.copyAudience ? modalRow.audienceLabel : 'Parents',
          channels: payload.copyChannels ? modalRow.channels : ['Portal'],
          attachments: payload.copyAttachments ? modalRow.attachments : [],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(
        payload.unreadOnly
          ? `${id} created for the ${unread.toLocaleString()} who did not read it`
          : `${id} created as a draft`,
      );
    },
    [modalRow, push, rows.length],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        push(`Delivery report prepared for ${workspace.visible.length} notifications`);
        return;
      }
      push(`${workspace.visible.length} notifications exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Card ---------------------------------- */

  const renderCard = (row: Notification) => (
    <div className={`message-note-item${cardToneOf(row)}`}>
      <div className="note-body">
        <span className="category">
          <i className={`${categoryIcon[row.category]} me-1`} />{row.category}
        </span>
        <h3 className="note-title">
          <ActionLink onClick={() => setPanelRow(row)}>{row.title}</ActionLink>
        </h3>
        <p className="note-summary">{row.summary}</p>
        <div className="note-facts">
          <span>
            <i className="ti ti-users" />{row.audienceLabel} · <b>{row.audience.toLocaleString()}</b>
          </span>
          <span>
            <i className={stampIconOf(row)} />{stampLabelOf(row)}
          </span>
          <span><i className="ti ti-paperclip" />{attachmentLabelOf(row)}</span>
        </div>
        <div className="d-flex gap-2 flex-wrap mt-3">
          {row.priority !== 'Normal' ? (
            <span className={priorityBadge[row.priority]}>
              <i className={priorityIcon[row.priority]} />{row.priority}
            </span>
          ) : (
            <span className="message-status-badge">Normal</span>
          )}
          <span className={statusBadge[statusOf(row)]}>
            <i className={statusIcon[statusOf(row)]} />
            {statusOf(row) === 'Sent' ? 'Delivered' : statusOf(row)}
          </span>
          {row.ackRequired ? (
            <span className="message-status-badge is-accent">
              <i className="ti ti-checkbox" />Ack required
            </span>
          ) : null}
          {row.recurrence ? (
            <span className="message-status-badge">
              <i className="ti ti-repeat" />{row.recurrence}
            </span>
          ) : null}
          {isLowRead(row) ? (
            <span className="message-status-badge is-high">
              <i className="ti ti-eye-off" />Low read rate
            </span>
          ) : null}
        </div>
      </div>

      <div className="note-reach">
        <span className="fs-12 text-muted">
          Created by {row.createdBy}{row.automated ? ' · automation' : ''}
        </span>
        <div className="d-flex align-items-center gap-3 mt-2">
          {/* Delivery and read are two different numbers, and stay that way. */}
          <span className="fs-13">
            Delivered <b>{deliveryLabelOf(row)}</b>
          </span>
          <span className="fs-13">
            Read <b>{readLabelOf(row)}</b>
          </span>
        </div>
      </div>

      <div className="note-footer">
        <span className="pips">
          {row.channels.map((channel) => (
            <span className="pip is-on" title={channel} key={channel}>
              <i className={channelIcon[channel]} />
            </span>
          ))}
        </span>
        {/* The template's overflow dropdown, flattened into the rail. */}
        <div className="d-inline-flex gap-1">
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label="View" onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-eye" />
          </button>
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label="Duplicate" onClick={() => openModal(row, 'duplicate')}
          >
            <i className="ti ti-copy" />
          </button>
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label={row.draft || row.scheduled ? 'Schedule' : 'Schedule a repeat'}
            onClick={() => openModal(row, 'schedule')}
          >
            <i className={row.scheduled ? 'ti ti-clock-cog' : 'ti ti-clock-play'} />
          </button>
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label="Archive" disabled={row.archived}
            onClick={() => archive(row)}
          >
            <i className="ti ti-archive" />
          </button>
        </div>
      </div>
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

  const sectionHeader = (
    label: string, title: string, note: string,
    action: { icon: string; text: string; onClick: () => void },
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
            title="Notification Center"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'schedule')}
                  >
                    <i className="ti ti-clock-play me-2" />Schedule
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-send me-2" />Send Now
                  </ActionLink>
                </div>
                <ExportMenu printLabel="Delivery report" printIcon="ti ti-report" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Create Notification
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
            searchPlaceholder="Search notifications by title, category or author…"
            searchLabel="Search notifications"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="notifications"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            workspaceId="ncWorkspace"
            onRefresh={() => { setRows(initialRows); push('Notifications refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            caption={
              <>
                {TOTAL_COUNT - initialRows.length + rows.length} notifications in the selected
                period. Delivery and read are shown separately on every card — a notification that
                arrives is not a notification that was read.
              </>
            }
            statusCounts={statusCounts}
            cardClassName="col-xxl-3 col-lg-4 col-md-6"
            renderCard={renderCard}
            emptyIcon="ti ti-bell-off"
            emptyTitle="No notifications match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => openModal(null, 'create')}>
                <i className="ti ti-square-rounded-plus me-2" />Create Notification
              </button>
            }
          />

          {/* Notification channels */}
          {sectionHeader(
            'Channels', 'Notification channels',
            'Three routes a notification can take. A channel switched off here is skipped silently, whatever an individual notification asks for.',
            { icon: 'ti ti-settings', text: 'Channel settings', onClick: () => push('Channel settings live under Settings · Communication') },
          )}
          <div className="row g-3 mb-5">
            {channelCards.map((card) => (
              <div className="col-12 col-xl-4" key={card.channel}>
                <div className="channel">
                  <div className="channel-top">
                    <span className="channel-icon"><i className={channelIcon[card.channel]} /></span>
                    <div className="flex-fill">
                      <p className="channel-name">{card.title}</p>
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
                    <div className="row-key">Last sent</div>
                    <div className="row-value">{card.lastSent}</div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Queue<small>{card.queue}</small></div>
                    <div className="row-value">
                      <span className={`message-status-badge ${card.queueTone}`}>{card.queueHealth}</span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Delivery method<small>{card.method}</small></div>
                    <div className="row-value">{card.methodTag}</div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Configuration<small>{card.configuration}</small></div>
                    <div className="row-value">
                      <span className={`message-status-badge ${card.configurationTone}`}>
                        {card.configurationState}
                      </span>
                    </div>
                  </div>
                  <div className="channel-footer">
                    <span>{card.monthly}</span>
                    <span className="d-inline-flex gap-1">
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => push(`${card.title} settings opened`)}
                      >
                        Configure
                      </button>
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => {
                          workspace.toggleQuick(
                            card.channel === 'Email' ? 'email' : card.channel === 'Push' ? 'push' : 'parent',
                          );
                        }}
                      >
                        View messages
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Parent communication */}
          {sectionHeader(
            'Parents', 'Parent communication',
            'The eleven things the school routinely tells parents. Each carries the message parents actually receive, not just its configuration.',
            { icon: 'ti ti-plus', text: 'New parent communication', onClick: () => openModal(null, 'parent') },
          )}
          <div className="row g-3 mb-5">
            {parentCommunications.map((entry) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={entry.title}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={entry.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{entry.title}</p>
                      <small>{entry.audience}</small>
                    </div>
                    <span className={parentStateBadge[entry.state]}>{entry.state}</span>
                  </div>
                  {/* The words a parent actually reads. */}
                  <p className="fs-13 text-muted mt-2 mb-2">{entry.message}</p>
                  <div className="info-row">
                    <div className="row-key">Schedule</div>
                    <div className="row-value">{entry.schedule}</div>
                  </div>
                  <div className="audience-footer d-flex align-items-center justify-content-between">
                    <span className="pips">
                      {entry.channels.map((channel) => (
                        <span className="pip is-on" title={channel} key={channel}>
                          <i className={channelIcon[channel]} />
                        </span>
                      ))}
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => openModal(null, entry.state === 'Draft' ? 'schedule' : 'parent')}
                    >
                      {entry.state === 'Draft' ? 'Schedule' : 'Open'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notification templates */}
          {sectionHeader(
            'Templates', 'Notification templates',
            'Twelve reusable notifications. Each carries the channels it is written for — a push template has to survive being read in one line.',
            { icon: 'ti ti-plus', text: 'Create template', onClick: () => openModal(null, 'template') },
          )}
          <div className="row g-3 mb-5">
            {notificationTemplates.map((entry) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={entry.name}>
                <div className="template">
                  <div className="template-preview">
                    <div className="template-mini">
                      <b>{entry.preview}</b>
                      {entry.lines.map((line) => (
                        <i className={`width-${line}`} key={`${entry.name}-${line}`} />
                      ))}
                    </div>
                  </div>
                  <div className="template-body">
                    <span className="category">{entry.category}</span>
                    <p className="template-title">{entry.name}</p>
                    <span className="pips">
                      {entry.channels.map((channel) => (
                        <span className="pip is-on" title={channel} key={channel}>
                          <i className={channelIcon[channel]} />
                        </span>
                      ))}
                    </span>
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {entry.fields.map((token) => (
                        <span className="fs-12 text-muted" key={token}>{token}</span>
                      ))}
                    </div>
                    {entry.restriction ? (
                      <p className="fs-12 text-warning mb-0 mt-1">{entry.restriction}</p>
                    ) : null}
                  </div>
                  <div className="template-footer">
                    {/* Counted from the tokens the template names. */}
                    <span>
                      {variablesOf(entry)} variable{variablesOf(entry) === 1 ? '' : 's'}
                    </span>
                    <span className="d-inline-flex gap-1">
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                        aria-label={`Preview ${entry.name}`}
                        onClick={() => openModal(rows[0] ?? null, 'preview')}
                      >
                        <i className="ti ti-eye" />
                      </button>
                      {entry.restriction ? null : (
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label={`${entry.action === 'edit' ? 'Edit' : 'Copy'} ${entry.name}`}
                          onClick={() => openModal(null, 'template')}
                        >
                          <i className={entry.action === 'edit' ? 'ti ti-edit' : 'ti ti-copy'} />
                        </button>
                      )}
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white"
                        onClick={() => openModal(null, 'create')}
                      >
                        Use
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recipient management */}
          {sectionHeader(
            'Recipients', 'Recipient management',
            'Counts are read at send time, not when a notification is written. Anyone appearing in two groups is notified once.',
            { icon: 'ti ti-file-import', text: 'Import recipients', onClick: () => openModal(null, 'import') },
          )}
          <div className="row g-3 mb-5">
            {recipientGroups.map((group) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={group.name}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={group.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{group.name}</p>
                      <small>{group.note}</small>
                    </div>
                  </div>
                  <div className="audience-count"><b>{group.count}</b><span>{group.unit}</span></div>
                  <div className="info-row">
                    <div className="row-key">Status</div>
                    <div className="row-value">
                      <span className={`message-status-badge ${group.statusTone}`}>{group.status}</span>
                    </div>
                  </div>
                  <div className="audience-footer">Last notification · {group.last}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery management */}
          {sectionHeader(
            'Delivery', 'Delivery management',
            'What happens to a notification after it leaves the composer — when it goes, how hard the system tries, and what counts as done.',
            { icon: 'ti ti-clock-cog', text: 'Delivery defaults', onClick: () => openModal(null, 'schedule') },
          )}
          <div className="row g-3 mb-5">
            {deliveryRules.map((rule) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={rule.name}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={rule.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{rule.name}</p>
                      <small>{rule.topValue}</small>
                    </div>
                  </div>
                  <div className="audience-count"><b>{rule.value}</b><span>{rule.topTag}</span></div>
                  <div className="info-row">
                    <div className="row-key">{rule.topLabel}</div>
                    <div className="row-value">{rule.topValue}</div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">{rule.bottomLabel}</div>
                    <div className="row-value">{rule.bottomValue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Notification activity */}
          {sectionHeader(
            'Activity', 'Notification activity',
            'What has actually gone out in the last week, with delivery and read stated separately.',
            { icon: 'ti ti-file-export', text: 'Export', onClick: () => openModal(null, 'export') },
          )}
          <div className="row g-3 mb-5">
            {activity.map((entry) => {
              const rate = activityRateOf(entry);
              return (
                <div className="col-12 col-xxl-6" key={entry.title}>
                  <div className="schedule">
                    <div className="schedule-main">
                      <div className="d-flex align-items-start gap-2 flex-wrap">
                        <div className="flex-fill">
                          <p className="schedule-title mb-1">{entry.title}</p>
                          <span className="fs-12 text-muted">
                            <i className={`${entry.icon} me-1`} />{entry.audience} ·{' '}
                            {entry.recipients.toLocaleString()} recipients · {entry.channels}
                          </span>
                        </div>
                        <span className="d-inline-flex gap-2">
                          {/* Delivered and read, computed from the counts. */}
                          <span className="message-status-badge is-live">
                            <i className="ti ti-checks" />Delivered {rate.delivered}%
                          </span>
                          <span className={`message-status-badge ${rate.read < 60 ? 'is-high' : ''}`}>
                            <i className={rate.read < 60 ? 'ti ti-eye-off' : 'ti ti-eye'} />
                            Read {rate.read}%
                          </span>
                        </span>
                      </div>
                      {entry.acknowledged > 0 ? (
                        <p className="fs-12 text-muted mb-0 mt-2">
                          {entry.acknowledged.toLocaleString()} acknowledged
                        </p>
                      ) : null}
                      {entry.note ? (
                        <p className="fs-12 text-muted mb-0 mt-2">
                          <i className="ti ti-alert-circle me-1" />{entry.note}
                        </p>
                      ) : null}
                      <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                        <span className="fs-12 text-muted">{entry.stamp} · {entry.by}</span>
                        <span className="d-inline-flex gap-1">
                          <button
                            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                            aria-label={`View ${entry.title}`}
                            onClick={() => openModal(rows[0] ?? null, 'preview')}
                          >
                            <i className="ti ti-eye" />
                          </button>
                          {entry.resendable ? (
                            <button
                              type="button" className="btn btn-sm btn-outline-light bg-white"
                              onClick={() => push(`${entry.title} resent to the bounced addresses`)}
                            >
                              <i className="ti ti-refresh me-1" />Resend
                            </button>
                          ) : (
                            <button
                              type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                              aria-label={`Duplicate ${entry.title}`}
                              onClick={() => openModal(rows[0] ?? null, 'duplicate')}
                            >
                              <i className="ti ti-copy" />
                            </button>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          {sectionHeader(
            'Shortcuts', 'Quick actions', 'The eight things most often done from this page.',
            { icon: 'ti ti-settings', text: 'Notification settings', onClick: () => push('Notification settings live under Settings · Communication') },
          )}
          <div className="row g-3">
            {quickActions.map((action) => (
              <div className="col-xxl-3 col-lg-4 col-md-6" key={action.title}>
                <ActionLink
                  className="message-action"
                  onClick={() => {
                    if (action.title === 'Create Notification') { openModal(null, 'create'); return; }
                    if (action.title === 'Email Notification') { openModal(rows[0] ?? null, 'email'); return; }
                    if (action.title === 'Push Notification') { openModal(null, 'push'); return; }
                    if (action.title === 'Parent Communication') { openModal(null, 'parent'); return; }
                    if (action.title === 'Manage Templates') { openModal(null, 'template'); return; }
                    if (action.title === 'Import Recipients') { openModal(null, 'import'); return; }
                    if (action.title === 'Export Report') { openModal(null, 'export'); return; }
                    push('Notification settings live under Settings · Communication');
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

          {/* Notification panel */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title={panelRow ? panelRow.title : 'Notification'}
            labelledById="nc_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className="message-status-badge">
                    <i className={`${categoryIcon[panelRow.category]} me-1`} />{panelRow.category}
                  </span>
                  <span className={priorityBadge[panelRow.priority]}>{panelRow.priority}</span>
                  <span className={statusBadge[statusOf(panelRow)]}>{statusOf(panelRow)}</span>
                </div>
                <p className="fs-13 text-muted mb-3">{panelRow.summary}</p>

                <div className="row g-3 mb-3">
                  {[
                    { label: 'Delivered', value: deliveryLabelOf(panelRow), tint: 'success' },
                    { label: 'Read', value: readLabelOf(panelRow), tint: isLowRead(panelRow) ? 'danger' : 'primary' },
                    {
                      label: 'Acknowledged',
                      value: panelRow.ackRequired ? panelRow.acknowledged.toLocaleString() : '—',
                      tint: 'info',
                    },
                    { label: 'Audience', value: panelRow.audience.toLocaleString(), tint: 'secondary' },
                  ].map((tile) => (
                    <div className="col-6" key={tile.label}>
                      <div className="border rounded p-3 text-center">
                        <h5 className={`fs-16 mb-0 text-${tile.tint}`}>{tile.value}</h5>
                        <span className="fs-12 text-muted">{tile.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Notification</h6>
                <div className="border rounded p-3 mb-3">{pairList(detailPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Reach</h6>
                <div className="border rounded p-3 mb-3">{pairList(reachPairsOf(panelRow))}</div>

                {panelRow.failure ? (
                  <>
                    <h6 className="fs-14 mb-2">From the gateway</h6>
                    <div className="alert alert-light border d-flex align-items-start gap-2 mb-3">
                      <i className="ti ti-alert-circle fs-16 mt-1" />
                      <span className="fs-13">{panelRow.failure}</span>
                    </div>
                  </>
                ) : null}

                <h6 className="fs-14 mb-2">Attachments</h6>
                {panelRow.attachments.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">Nothing attached.</p>
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
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'duplicate'); }}
                  >
                    <i className="ti ti-copy me-1" />Duplicate
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'preview'); }}
                  >
                    <i className="ti ti-eye me-1" />Preview
                  </button>
                  {!panelRow.archived ? (
                    <button
                      type="button" className="btn btn-outline-light bg-white btn-sm"
                      onClick={() => { archive(panelRow); setPanelRow(null); }}
                    >
                      <i className="ti ti-archive me-1" />Archive
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <NotificationModals
        active={activeModal}
        row={modalRow}
        matchCount={workspace.visible.length}
        onClose={() => setActiveModal(null)}
        onCreate={create}
        onEmail={(payload: EmailPayload) => {
          setActiveModal(null);
          push(`Email sent to ${payload.audience.toLowerCase()}`);
        }}
        onPush={(payload: PushPayload) => {
          setActiveModal(null);
          push(`Push sent to ${payload.audience.toLowerCase()} · 2,104 devices`);
        }}
        onParent={(payload: ParentPayload) => {
          setActiveModal(null);
          push(
            payload.confidential
              ? `${payload.type} written to the portal only — marked confidential`
              : `${payload.type} sent to ${payload.recipients.toLowerCase()}`,
          );
        }}
        onSchedule={(payload: SchedulePayload) => {
          setActiveModal(null);
          push(
            payload.delivery === 'Immediate'
              ? 'Queued to send on publish'
              : `Scheduled for ${payload.sendDate} at ${payload.sendTime}`,
          );
        }}
        onSaveTemplate={(payload: TemplatePayload) => {
          setActiveModal(null);
          push(
            payload.name.trim()
              ? `${payload.name.trim()} saved for ${payload.channels.join(', ')}`
              : 'Give the template a name',
            payload.name.trim() ? 'success' : 'warning',
          );
        }}
        onDuplicate={duplicate}
        onImport={(payload: ImportPayload) => {
          setActiveModal(null);
          push(payload.matchExisting ? 'Recipients imported and matched to existing records' : 'Recipients imported');
        }}
        onExport={(payload: ExportPayload) => {
          setActiveModal(null);
          push(
            `${payload.scope === 'Current filters' ? workspace.visible.length : TOTAL_COUNT} notifications exported as ${payload.format}`,
          );
        }}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="ncToasts" />
    </>
  );
};

export default NotificationCenterPage;
