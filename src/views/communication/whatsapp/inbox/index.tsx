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
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ThreadModals from './modals/ThreadModals';
import type {
  AssignPayload, LabelPayload, ReplyPayload, ResolvePayload, SnoozePayload, ThreadModalId,
} from './modals/ThreadModals';
import type { Thread } from './data/threads.data';
import {
  REGISTER_TIME, SUMMARY_TOTALS, TOTAL_THREADS, assigneeOptions, audienceOptions, channelBadge,
  channelIcon, channelOptions, contactPairsOf, durationText, firstResponseLabelOf, firstResponseOf,
  hasReplied, isBreached, isSessionOpen, isUnassigned, isWaiting, labelBadge, labelOptions,
  lastActivityLabelOf, ownerPairsOf, searchIndexOf, servicePairsOf, sessionLabelOf, slaBadge,
  slaOptions, slaStateOf, slaSubLabelOf, statusBadge, statusOf, statusOptions, statusPill,
  teamOptions, threads as initialRows, waitingMinutesOf,
} from './data/threads.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'channel', label: 'Channel', kind: 'select', chipLabel: 'Channel', options: channelOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'sla', label: 'Reply Target', kind: 'select', chipLabel: 'Target', options: slaOptions },
  { id: 'label', label: 'Label', kind: 'select', chipLabel: 'Label', options: labelOptions },
  { id: 'assigned', label: 'Assigned To', kind: 'select', chipLabel: 'Owner', options: assigneeOptions },
  { id: 'team', label: 'Team', kind: 'select', chipLabel: 'Team', options: teamOptions },
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
];

const sortOptions: SortOption[] = [
  { id: 'waiting', label: 'Longest waiting', icon: 'ti ti-clock-exclamation' },
  { id: 'recent', label: 'Most recent', icon: 'ti ti-clock' },
  { id: 'response', label: 'Slowest first response', icon: 'ti ti-hourglass' },
  { id: 'contact', label: 'Contact name', icon: 'ti ti-abc' },
  { id: 'messages', label: 'Most messages', icon: 'ti ti-message-2' },
];

const isFlagged = (row: Thread) => row.flagged;
const isSnoozed = (row: Thread) => statusOf(row) === 'Snoozed';

const ChatInboxPage = () => {
  const [rows, setRows] = useState<Thread[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ThreadModalId | null>(null);
  const [modalRow, setModalRow] = useState<Thread | null>(null);
  const [panelRow, setPanelRow] = useState<Thread | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Thread | null, modal: ThreadModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Thread) => Thread, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Thread>[]>(
    () => [
      {
        id: 'contact',
        label: 'Contact',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="avatar avatar-md rounded-circle flex-shrink-0 me-2">
              <ImageWithBasePath src={row.avatar} alt={row.contact} className="rounded-circle" />
            </span>
            <div className="overflow-hidden">
              <ActionLink className="dt-name" onClick={() => setPanelRow(row)}>{row.contact}</ActionLink>
              <div className="dt-sub text-truncate">{row.relation}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'preview',
        label: 'Last Message',
        render: (row) => (
          <>
            <span className="d-block fs-13">
              <i className={`${row.previewIcon} me-1`} />{row.preview}
            </span>
            <span className="fs-12 text-muted d-block">
              {row.messages} messages · {lastActivityLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'channel',
        label: 'Channel',
        sortable: true,
        render: (row) => (
          <>
            <span className={channelBadge[row.channel]}>
              <i className={`${channelIcon[row.channel]} me-1`} />{row.channel}
            </span>
            {/* The platform window, where the channel has one. */}
            <span className={`d-block fs-12 mt-1 text-nowrap ${isSessionOpen(row) ? 'text-muted' : 'text-danger'}`}>
              {sessionLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'label',
        label: 'Label',
        sortable: true,
        render: (row) => (
          <>
            <span className={labelBadge[row.label] ?? 'badge badge-soft-secondary'}>{row.label}</span>
            {row.flagged ? (
              <span className="d-block fs-12 text-danger mt-1">
                <i className="ti ti-flag me-1" />Flagged
              </span>
            ) : null}
          </>
        ),
      },
      {
        id: 'waiting',
        label: 'Waiting',
        sortable: true,
        render: (row) => (
          <>
            <span className={`d-block fs-13 text-nowrap ${waitingMinutesOf(row) > 0 ? 'fw-medium' : 'text-muted'}`}>
              {waitingMinutesOf(row) > 0 ? durationText(waitingMinutesOf(row)) : 'Not waiting'}
            </span>
            <span className="fs-12 text-muted text-nowrap">
              First reply · {firstResponseLabelOf(row)}
            </span>
          </>
        ),
      },
      {
        id: 'owner',
        label: 'Owner',
        sortable: true,
        render: (row) => (
          <>
            <span className={`d-block fs-13 text-nowrap ${isUnassigned(row) ? 'text-danger' : ''}`}>
              {row.assignedTo}
            </span>
            <span className="fs-12 text-muted text-nowrap">{row.team}</span>
          </>
        ),
      },
      {
        id: 'sla',
        label: 'Reply Target',
        render: (row) => (
          <>
            <span className={slaBadge[slaStateOf(row)]}>{slaStateOf(row)}</span>
            <span className="d-block fs-12 text-muted mt-1 text-nowrap">{slaSubLabelOf(row)}</span>
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
            {row.snoozedUntil ? (
              <span className="d-block fs-12 text-muted mt-1 text-nowrap">
                Back {row.snoozedUntil}
              </span>
            ) : null}
          </>
        ),
      },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Thread>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.channel && row.channel !== filters.channel) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters.sla && slaStateOf(row) !== filters.sla) return false;
      if (filters.label && row.label !== filters.label) return false;
      if (filters.assigned && row.assignedTo !== filters.assigned) return false;
      if (filters.team && row.team !== filters.team) return false;
      if (filters.audience && row.audience !== filters.audience) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick || quick === 'all') return true;
      if (quick === 'waiting') return isWaiting(row);
      if (quick === 'breached') return isBreached(row);
      if (quick === 'unassigned') return isUnassigned(row);
      if (quick === 'flagged') return isFlagged(row);
      return isSnoozed(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'waiting': return isWaiting(row);
        case 'breached': return isBreached(row);
        case 'unassigned': return isUnassigned(row);
        case 'mine': return row.assignedTo === assigneeOptions[0];
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'recent':
          return a.inboundAgo - b.inboundAgo;
        case 'response':
          return firstResponseOf(b) - firstResponseOf(a) || a.contact.localeCompare(b.contact);
        case 'contact':
          return a.contact.localeCompare(b.contact);
        case 'messages':
          return b.messages - a.messages || a.contact.localeCompare(b.contact);
        // Whoever has waited longest comes first, which is what an inbox is for.
        case 'waiting':
        default:
          return waitingMinutesOf(b) - waitingMinutesOf(a) || a.inboundAgo - b.inboundAgo;
      }
    },
    defaultSort: 'waiting',
    defaultQuick: 'all',
    pageSize: 8,
  });

  const countBy = useCallback(
    (test: (row: Thread) => boolean) => rows.filter(test).length,
    [rows],
  );

  const shift = useCallback(
    (base: number, test: (row: Thread) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Threads', icon: 'ti ti-inbox', count: rows.length },
      { id: 'waiting', label: 'Waiting for a Reply', icon: 'ti ti-clock-exclamation', count: countBy(isWaiting) },
      { id: 'breached', label: 'Past Target', icon: 'ti ti-alert-triangle', count: countBy(isBreached) },
      { id: 'unassigned', label: 'Unassigned', icon: 'ti ti-user-question', count: countBy(isUnassigned) },
      {
        id: 'mine', label: 'Assigned to me', icon: 'ti ti-user-check',
        count: countBy((row) => row.assignedTo === assigneeOptions[0]),
      },
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'all', label: 'All', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'waiting', label: 'Waiting', icon: 'ti ti-clock-exclamation', count: countBy(isWaiting) },
      { id: 'breached', label: 'Past target', icon: 'ti ti-alert-triangle', count: countBy(isBreached) },
      { id: 'unassigned', label: 'Unassigned', icon: 'ti ti-user-question', count: countBy(isUnassigned) },
      { id: 'flagged', label: 'Flagged', icon: 'ti ti-flag', count: countBy(isFlagged) },
      { id: 'snoozed', label: 'Snoozed', icon: 'ti ti-alarm', count: countBy(isSnoozed) },
    ],
    [countBy, rows.length],
  );

  /**
   * The strip counts the whole inbox — 214 threads against the ten this page
   * lists — so the figures stand and the register moves them.
   */
  const summary = useMemo<SummaryItem[]>(() => {
    const answered = rows.filter(hasReplied);
    const average = answered.length > 0
      ? Math.round(answered.reduce((total, row) => total + row.replyAfter, 0) / answered.length)
      : 0;
    return [
      {
        id: 'open', tint: 'primary', icon: 'ti ti-inbox', label: 'Open Threads',
        value: String(shift(SUMMARY_TOTALS.open, (row) => statusOf(row) !== 'Archived')),
        hint: `of ${TOTAL_THREADS} in the inbox`,
      },
      {
        id: 'waiting', tint: 'warning', icon: 'ti ti-clock-exclamation', label: 'Waiting',
        value: String(shift(SUMMARY_TOTALS.waiting, isWaiting)), hint: 'nobody has replied yet',
      },
      {
        id: 'breached', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Past Target',
        value: String(shift(SUMMARY_TOTALS.breached, isBreached)), hint: 'over the four-hour target',
      },
      {
        id: 'unassigned', tint: 'info', icon: 'ti ti-user-question', label: 'Unassigned',
        value: String(shift(SUMMARY_TOTALS.unassigned, isUnassigned)), hint: 'no owner on the thread',
      },
      {
        id: 'average', tint: 'success', icon: 'ti ti-hourglass', label: 'Average First Reply',
        // The mean of what has actually been answered.
        value: durationText(average), hint: `across ${answered.length} answered threads`,
      },
    ];
  }, [rows, shift]);

  /* -------------------------------- Mutations ------------------------------- */

  const assign = useCallback(
    (payload: AssignPayload) =>
      patchRow(
        (row) => ({ ...row, assignedTo: payload.assignee, team: payload.team }),
        `${modalRow?.contact ?? 'Thread'} assigned to ${payload.assignee}`,
      ),
    [modalRow, patchRow],
  );

  const reply = useCallback(
    (payload: ReplyPayload) => {
      const contact = modalRow?.contact ?? 'the contact';
      patchRow(
        (row) => ({
          ...row,
          // Replying now stops the wait and stamps the first response.
          replyAfter: hasReplied(row) ? row.replyAfter : row.inboundAgo,
          messages: row.messages + 1,
          resolved: payload.resolveAfter ? true : row.resolved,
          snoozedUntil: '',
        }),
        payload.resolveAfter
          ? `Replied to ${contact} and resolved the thread`
          : `Replied to ${contact}`,
      );
    },
    [modalRow, patchRow],
  );

  const snooze = useCallback(
    (payload: SnoozePayload) =>
      patchRow(
        (row) => ({ ...row, snoozedUntil: payload.until }),
        `${modalRow?.contact ?? 'Thread'} snoozed until ${payload.until.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const resolve = useCallback(
    (payload: ResolvePayload) =>
      patchRow(
        (row) => ({ ...row, resolved: true, snoozedUntil: '', flagged: false }),
        `${modalRow?.contact ?? 'Thread'} resolved · ${payload.outcome.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const label = useCallback(
    (payload: LabelPayload) =>
      patchRow(
        (row) => ({ ...row, label: payload.label, flagged: payload.flagged }),
        `${modalRow?.contact ?? 'Thread'} labelled ${payload.label}`,
      ),
    [modalRow, patchRow],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} threads exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Thread) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" ariaLabel="Open thread" onClick={() => setPanelRow(row)}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib success" ariaLabel="Reply" onClick={() => openModal(row, 'reply')}>
        <i className="ti ti-send" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Assign thread" onClick={() => openModal(row, 'assign')}>
        <i className="ti ti-user-check" />
      </ActionLink>
      <ActionLink className="dt-ib" ariaLabel="Label thread" onClick={() => openModal(row, 'label')}>
        <i className="ti ti-tag" />
      </ActionLink>
      {/* Only an open thread can be snoozed or resolved. */}
      {statusOf(row) !== 'Resolved' && statusOf(row) !== 'Archived' ? (
        <>
          <ActionLink className="dt-ib" ariaLabel="Snooze thread" onClick={() => openModal(row, 'snooze')}>
            <i className="ti ti-alarm" />
          </ActionLink>
          <ActionLink className="dt-ib" ariaLabel="Resolve thread" onClick={() => openModal(row, 'resolve')}>
            <i className="ti ti-circle-check" />
          </ActionLink>
        </>
      ) : null}
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

  const renderDetail = (row: Thread) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user text-primary me-1" />Contact</h6>
        {pairList(contactPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-clock text-warning me-1" />Service</h6>
        {pairList(servicePairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-user-check text-info me-1" />Ownership</h6>
        {pairList(ownerPairsOf(row))}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-message-2 text-secondary me-1" />Last message</h6>
        <div className="border rounded p-2 mb-3">
          <p className="fs-13 mb-1">
            <i className={`${row.previewIcon} me-1`} />{row.preview}
          </p>
          <span className="fs-12 text-muted">{lastActivityLabelOf(row)}</span>
        </div>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button
            type="button" className="btn btn-primary btn-sm"
            onClick={() => openModal(row, 'reply')}
          >
            <i className="ti ti-send me-1" />Reply
          </button>
          {isUnassigned(row) ? (
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => openModal(row, 'assign')}
            >
              <i className="ti ti-user-check me-1" />Assign
            </button>
          ) : null}
          <Link className="btn btn-outline-light bg-white btn-sm" to={routes.sendWhatsapp}>
            <i className="ti ti-brand-whatsapp me-1" />Open in chat
          </Link>
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
            title="Chat Inbox"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print Thread Register" onExport={exportAs} />
                <div className="mb-2">
                  {/* The chat itself lives on Send WhatsApp. */}
                  <Link className="btn btn-primary d-flex align-items-center" to={routes.sendWhatsapp}>
                    <i className="ti ti-brand-whatsapp me-2" />Open the chat
                  </Link>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={TOTAL_THREADS - initialRows.length + rows.length}
            summary={summary}
            footerVariant="card-foot"
            pageSizeOptions={[8, 25, 50, 100]}
            footerInfoSuffix={`inbox as at ${REGISTER_TIME}`}
            workspaceId="thrWorkspace"
            searchPlaceholder="Search contact, number, label or owner…"
            searchLabel="Search threads"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="threads"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Inbox refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-inbox-off"
            emptyTitle="No threads match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Thread panel */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title={panelRow ? panelRow.contact : 'Thread'}
            labelledById="thr_panel_lbl"
          >
            {panelRow ? (
              <>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="avatar avatar-lg rounded-circle flex-shrink-0">
                    <ImageWithBasePath
                      src={panelRow.avatar} alt={panelRow.contact} className="rounded-circle"
                    />
                  </span>
                  <div>
                    <h6 className="fs-14 mb-0">{panelRow.contact}</h6>
                    <span className="fs-12 text-muted">{panelRow.relation}</span>
                  </div>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className={channelBadge[panelRow.channel]}>
                    <i className={`${channelIcon[panelRow.channel]} me-1`} />{panelRow.channel}
                  </span>
                  <span className={labelBadge[panelRow.label] ?? 'badge badge-soft-secondary'}>
                    {panelRow.label}
                  </span>
                  <span className={statusBadge[statusOf(panelRow)]}>{statusOf(panelRow)}</span>
                  <span className={slaBadge[slaStateOf(panelRow)]}>{slaStateOf(panelRow)}</span>
                </div>

                <div className="row g-3 mb-3">
                  {[
                    {
                      label: 'Waiting',
                      value: waitingMinutesOf(panelRow) > 0
                        ? durationText(waitingMinutesOf(panelRow)) : '—',
                      tint: 'warning',
                    },
                    { label: 'First reply', value: firstResponseLabelOf(panelRow), tint: 'success' },
                    { label: 'Messages', value: String(panelRow.messages), tint: 'primary' },
                    { label: 'Window', value: sessionLabelOf(panelRow), tint: 'info' },
                  ].map((tile) => (
                    <div className="col-6" key={tile.label}>
                      <div className="border rounded p-3 text-center">
                        <h6 className={`fs-14 mb-0 text-${tile.tint}`}>{tile.value}</h6>
                        <span className="fs-12 text-muted">{tile.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Contact</h6>
                <div className="border rounded p-3 mb-3">{pairList(contactPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Service</h6>
                <div className="border rounded p-3 mb-3">{pairList(servicePairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Ownership</h6>
                <div className="border rounded p-3 mb-3">{pairList(ownerPairsOf(panelRow))}</div>

                <h6 className="fs-14 mb-2">Last message</h6>
                <div className="border rounded p-2 mb-3">
                  <p className="fs-13 mb-1">
                    <i className={`${panelRow.previewIcon} me-1`} />{panelRow.preview}
                  </p>
                  <span className="fs-12 text-muted">{lastActivityLabelOf(panelRow)}</span>
                </div>

                <div className="d-flex align-items-center flex-wrap gap-2">
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'reply'); }}
                  >
                    <i className="ti ti-send me-1" />Reply
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setPanelRow(null); openModal(panelRow, 'assign'); }}
                  >
                    <i className="ti ti-user-check me-1" />Assign
                  </button>
                  {statusOf(panelRow) !== 'Resolved' && statusOf(panelRow) !== 'Archived' ? (
                    <button
                      type="button" className="btn btn-outline-light bg-white btn-sm"
                      onClick={() => { setPanelRow(null); openModal(panelRow, 'resolve'); }}
                    >
                      <i className="ti ti-circle-check me-1" />Resolve
                    </button>
                  ) : null}
                </div>
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ThreadModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onAssign={assign}
        onReply={reply}
        onSnooze={snooze}
        onResolve={resolve}
        onLabel={label}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="thrToasts" />
    </>
  );
};

export default ChatInboxPage;
