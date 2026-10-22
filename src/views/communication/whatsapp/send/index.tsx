import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, PageHeader, WorkspaceHeader, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, FilterField, QuickFilter, SavedView, SortOption, WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import WhatsappModals from './modals/WhatsappModals';
import type {
  BroadcastPayload, BulkPayload, GroupPayload, ImportPayload, NewMessagePayload, SchedulePayload,
  TemplatePayload, WhatsappModalId,
} from './modals/WhatsappModals';
import type { Conversation, Message } from './data/conversations.data';
import {
  QUICK_TOTALS, TOTAL_CONVERSATIONS, assigneeOptions, audienceOptions, canSendFreeForm,
  classOptions, contactPairsOf, conversations as initialRows, departmentOptions, groupOrder,
  isArchived, isAssignedToMe, isAwaiting, isSessionOpen, isUnread, labelBadge, labelOptions,
  minutesOf, quickReplies, receiptIcon, searchIndexOf, sectionOptions, sessionHoursLeftOf,
  sessionLabelOf, sessionOptions, stateBadge, stateOptions, unreadOf,
} from './data/conversations.data';
import {
  BULK_FILE, BULK_UPLOADED, BULK_VALIDATION, audienceOf, baseGroups, broadcastActionOf,
  broadcastQueue, broadcastStateBadge, broadcastStateIcon, classNarrowOptions, conditionOptions,
  deliveryEstimateOf, mediaLibrary, quickActions, recipientGroups, templateStateBadge,
  templateStateIcon, variablesOf, whatsappTemplates,
} from './data/reference.data';

const routes = all_routes;

const filterFields: FilterField[] = [
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  {
    id: 'labels', label: 'Labels', kind: 'select', chipLabel: 'Label',
    options: labelOptions, initialValue: 'Fee query',
  },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: stateOptions },
  {
    id: 'session-window', label: 'Session window', kind: 'select',
    chipLabel: 'Session', options: sessionOptions,
  },
  {
    id: 'assigned-to', label: 'Assigned to', kind: 'select', chipLabel: 'Assigned',
    allLabel: 'Anyone', options: assigneeOptions, initialValue: 'Me',
  },
];

const sortOptions: SortOption[] = [
  { id: 'recent', label: 'Most recent', icon: 'ti ti-clock' },
  { id: 'unread', label: 'Unread first', icon: 'ti ti-mail-opened' },
  { id: 'waiting', label: 'Longest waiting', icon: 'ti ti-clock-exclamation' },
  { id: 'name', label: 'Contact name', icon: 'ti ti-abc' },
];

/** The list's own timestamps sort newest-first within their day group. */
const recencyOf = (row: Conversation): number => {
  const rank = groupOrder.indexOf(row.group);
  const clock = row.lastAt.includes(':') ? minutesOf(row.lastAt) : 0;
  return (rank === -1 ? groupOrder.length : rank) * 10000 - clock;
};

const SendWhatsappPage = () => {
  const [rows, setRows] = useState<Conversation[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<WhatsappModalId | null>(null);
  const [selectedId, setSelectedId] = useState(initialRows[0].id);
  const [contactOpen, setContactOpen] = useState(false);
  const [listFilter, setListFilter] = useState('');
  const [reply, setReply] = useState('');

  const [baseGroup, setBaseGroup] = useState(baseGroups[0].label);
  const [narrowClass, setNarrowClass] = useState(classNarrowOptions[0]);
  const [condition, setCondition] = useState(conditionOptions[1]);

  const { toasts, push, dismiss } = useToasts();

  /* -------------------------------- Workspace ------------------------------- */

  const columns = useMemo<ColumnDef<Conversation>[]>(
    () => [{ id: 'recent', label: 'Conversation', render: (row) => row.name }],
    [],
  );

  const workspace = useWorkspace<Conversation>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.audience && row.audience !== filters.audience) return false;
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters.labels && row.label !== filters.labels) return false;
      if (filters.status && row.state !== filters.status) return false;
      if (filters['session-window']) {
        const wantOpen = filters['session-window'].startsWith('Open');
        if (isSessionOpen(row) !== wantOpen) return false;
      }
      if (filters['assigned-to'] && row.assignedTo !== filters['assigned-to']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'unread') return isUnread(row);
      if (quick === 'pinned') return row.pinned;
      if (quick === 'assigned') return isAssignedToMe(row);
      if (quick === 'awaiting') return isAwaiting(row);
      if (quick === 'session') return isSessionOpen(row);
      return isArchived(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'unread': return isUnread(row);
        case 'assigned': return isAssignedToMe(row);
        case 'pinned': return row.pinned;
        case 'awaiting': return isAwaiting(row);
        case 'archived': return isArchived(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'unread':
          return b.unread - a.unread || recencyOf(a) - recencyOf(b);
        case 'waiting':
          return recencyOf(b) - recencyOf(a);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          return recencyOf(a) - recencyOf(b);
      }
    },
    defaultSort: 'recent',
    defaultQuick: null,
    pageSize: 50,
  });

  /** The inbox's own filter box narrows what the toolbar already left. */
  const listed = workspace.visible.filter((row) => (
    !listFilter.trim() || searchIndexOf(row).includes(listFilter.trim().toLowerCase())
  ));

  const selected = rows.find((row) => row.id === selectedId) ?? listed[0] ?? rows[0];
  const sessionOpen = selected ? canSendFreeForm(selected) : false;

  const countBy = useCallback(
    (test: (row: Conversation) => boolean) => rows.filter(test).length,
    [rows],
  );

  const shift = useCallback(
    (base: number, test: (row: Conversation) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Conversations', icon: 'ti ti-inbox' },
      { id: 'unread', label: 'Unread', icon: 'ti ti-mail-opened' },
      { id: 'assigned', label: 'Assigned to me', icon: 'ti ti-user-check' },
      { id: 'pinned', label: 'Pinned', icon: 'ti ti-pin' },
      { id: 'awaiting', label: 'Awaiting reply', icon: 'ti ti-clock-exclamation' },
      { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'unread', label: 'Unread', icon: 'ti ti-mail-opened', count: shift(QUICK_TOTALS.unread, isUnread) },
      { id: 'pinned', label: 'Pinned', icon: 'ti ti-pin', count: shift(QUICK_TOTALS.pinned, (row) => row.pinned) },
      {
        id: 'assigned', label: 'Assigned to me', icon: 'ti ti-user-check',
        count: shift(QUICK_TOTALS.assigned, isAssignedToMe),
      },
      {
        id: 'awaiting', label: 'Awaiting reply', icon: 'ti ti-clock-exclamation',
        count: shift(QUICK_TOTALS.awaiting, isAwaiting),
      },
      {
        id: 'session', label: 'Session open', icon: 'ti ti-lock-open',
        count: shift(QUICK_TOTALS.sessionOpen, isSessionOpen),
      },
      {
        id: 'archived', label: 'Archived', icon: 'ti ti-archive',
        count: shift(QUICK_TOTALS.archived, isArchived),
      },
    ],
    [shift],
  );

  /* -------------------------------- Handlers -------------------------------- */

  const openConversation = useCallback((row: Conversation) => {
    setSelectedId(row.id);
    // Opening a thread clears its unread badge, as an inbox does.
    setRows((current) => current.map((entry) => (
      entry.id === row.id ? { ...entry, unread: 0 } : entry
    )));
  }, []);

  const sendReply = useCallback(() => {
    if (!selected || !reply.trim()) return;
    const message: Message = {
      id: `M${selected.messages.length + 1}`,
      direction: 'out', kind: 'text', text: reply.trim(),
      templateName: '', fileName: '', fileMeta: '',
      at: '12:40', receipt: 'sent', day: 'Today',
    };
    setRows((current) => current.map((row) => (
      row.id === selected.id
        ? { ...row, messages: [...row.messages, message], totalMessages: row.totalMessages + 1 }
        : row
    )));
    setReply('');
    push('Reply sent');
  }, [push, reply, selected]);

  const togglePin = useCallback(
    (row: Conversation) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id
          ? { ...entry, pinned: !entry.pinned, group: !entry.pinned ? 'Pinned' : 'Today' }
          : entry
      )));
      push(row.pinned ? `${row.name} unpinned` : `${row.name} pinned`);
    },
    [push],
  );

  const archive = useCallback(
    (row: Conversation) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id ? { ...entry, state: 'Archived', pinned: false } : entry
      )));
      push(`${row.name} archived`);
    },
    [push],
  );

  const assign = useCallback(
    (row: Conversation) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id
          ? { ...entry, assignedTo: entry.assignedTo === 'Me' ? 'Unassigned' : 'Me', state: 'Assigned' }
          : entry
      )));
      push(row.assignedTo === 'Me' ? `${row.name} unassigned` : `${row.name} assigned to you`);
    },
    [push],
  );

  const audience = audienceOf(baseGroup, narrowClass, condition);

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

  /* --------------------------------- Threads -------------------------------- */

  const renderMessages = (row: Conversation) => {
    const days: string[] = [];
    row.messages.forEach((message) => {
      if (!days.includes(message.day)) days.push(message.day);
    });
    return days.map((day) => (
      <div key={day}>
        <div className="text-center my-3">
          <span className="badge badge-soft-secondary">{day}</span>
        </div>
        {row.messages.filter((message) => message.day === day).map((message) => (
          <div
            className={`d-flex mb-3 ${message.direction === 'out' ? 'justify-content-end' : ''}`}
            key={message.id}
          >
            <div
              className={`border rounded p-2 ${message.direction === 'out' ? 'bg-light' : ''}`}
              style={{ maxWidth: '80%' }}
            >
              {message.kind === 'template' ? (
                <span className="message-status-badge is-accent mb-1">
                  <i className="ti ti-template" />Template · {message.templateName}
                </span>
              ) : null}
              {message.kind === 'file' || message.kind === 'voice' || message.kind === 'image' ? (
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                    <i className={
                      message.kind === 'voice' ? 'ti ti-player-play'
                        : message.kind === 'image' ? 'ti ti-photo' : 'ti ti-file-type-pdf'
                    }
                    />
                  </span>
                  <div className="overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{message.fileName}</h6>
                    <span className="fs-12 text-muted">{message.fileMeta}</span>
                  </div>
                </div>
              ) : null}
              {message.text ? <p className="fs-13 mb-1">{message.text}</p> : null}
              <span className="fs-12 text-muted d-flex align-items-center gap-1 justify-content-end">
                {message.at}
                {message.direction === 'out' ? <i className={receiptIcon[message.receipt]} /> : null}
              </span>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Send WhatsApp"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => setActiveModal('broadcast')}
                  >
                    <i className="ti ti-speakerphone me-2" />New Broadcast
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => setActiveModal('bulk')}
                  >
                    <i className="ti ti-users-plus me-2" />Bulk Messaging
                  </ActionLink>
                </div>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => setActiveModal('schedule')}
                  >
                    <i className="ti ti-clock-play me-2" />Schedule Message
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => setActiveModal('new')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Chat
                  </ActionLink>
                </div>
              </>
            }
          />

          <div className="data-workspace page-toolbar-compact mb-4">
            <div className="card mb-0">
              <WorkspaceHeader
                searchPlaceholder="Search contacts, conversations or numbers…"
                searchLabel="Search conversations"
                search={workspace.search}
                onSearch={workspace.setSearch}
                savedViews={savedViews}
                view={workspace.view}
                onView={workspace.setView}
                onSaveView={() => setActiveModal('group')}
                filterFields={filterFields}
                draft={workspace.draft}
                onDraftField={workspace.setDraftField}
                onApplyFilters={() => { workspace.applyFilters(); push('Filters applied'); }}
                onResetFilters={() => { workspace.resetFilters(); push('Filters cleared'); }}
                matchCount={workspace.visible.length}
                totalCount={TOTAL_CONVERSATIONS}
                matchNoun="conversations"
                columnOptions={[]}
                columns={workspace.columns}
                onToggleColumn={workspace.toggleColumn}
                onShowAllColumns={workspace.showAllColumns}
                showColumns={false}
                showDensity={false}
                density={workspace.density}
                onDensity={workspace.setDensity}
                onRefresh={() => { setRows(initialRows); push('Inbox refreshed'); }}
                fullscreen={workspace.fullscreen}
                onFullscreen={workspace.toggleFullscreen}
                quickFilters={quickFilters}
                quick={workspace.quick}
                onQuick={workspace.toggleQuick}
                sortOptions={sortOptions}
                sort={workspace.sort}
                onSort={workspace.setSort}
                chips={workspace.chips}
                onClearChip={workspace.clearChip}
                openMenu={openMenu}
                onOpenMenu={setOpenMenu}
              />
            </div>
          </div>

          {/* Inbox and conversation */}
          <div className="row g-3 mb-5">
            <div className="col-12 col-xxl-4 col-lg-5">
              <div className="inbox card mb-0 h-100">
                <div className="card-header">
                  <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                    <h5 className="fs-14 mb-0">Inbox</h5>
                    {/* Counted from the badges rather than restated. */}
                    <span className="message-status-badge is-accent">
                      {unreadOf(rows)} unread
                    </span>
                  </div>
                  <div className="position-relative">
                    <i className="ti ti-search position-absolute top-50 translate-middle-y ms-2 text-muted" />
                    <input
                      type="search" className="form-control form-control-sm ps-4"
                      placeholder="Filter this list…" aria-label="Filter the inbox"
                      value={listFilter} onChange={(event) => setListFilter(event.target.value)}
                    />
                  </div>
                </div>
                <div className="card-body p-0">
                  {groupOrder.map((group) => {
                    const inGroup = listed.filter((row) => row.group === group);
                    if (inGroup.length === 0) return null;
                    return (
                      <div key={group}>
                        <div className="px-3 py-2 fs-12 text-muted text-uppercase">{group}</div>
                        {inGroup.map((row) => (
                          <ActionLink
                            className={`d-flex align-items-start gap-2 px-3 py-2 border-bottom w-100${row.id === selected?.id ? ' bg-light' : ''}`}
                            key={row.id}
                            onClick={() => openConversation(row)}
                          >
                            <span className="avatar avatar-md rounded-circle flex-shrink-0">
                              <ImageWithBasePath src={row.avatar} alt={row.name} className="rounded-circle" />
                            </span>
                            <div className="flex-fill overflow-hidden">
                              <div className="d-flex align-items-center justify-content-between gap-2">
                                <h6 className="fs-13 mb-0 text-truncate">{row.name}</h6>
                                <span className="fs-12 text-muted flex-shrink-0">{row.lastAt}</span>
                              </div>
                              <span className="fs-12 text-muted d-block text-truncate">
                                <i className={`${row.previewIcon} me-1`} />{row.preview}
                              </span>
                              <div className="d-flex align-items-center gap-1 mt-1 flex-wrap">
                                <span className={labelBadge[row.label] ?? 'badge badge-soft-secondary'}>
                                  {row.label}
                                </span>
                                <span className="fs-12 text-muted">{row.meta}</span>
                                {row.pinned ? <i className="ti ti-pin thread-pin" /> : null}
                                {row.unread > 0 ? (
                                  <span className="badge bg-primary ms-auto">{row.unread}</span>
                                ) : null}
                                {/* A closed window is worth seeing from the list. */}
                                {!isSessionOpen(row) ? (
                                  <span className="fs-12 text-muted ms-auto">Session closed</span>
                                ) : null}
                              </div>
                            </div>
                          </ActionLink>
                        ))}
                      </div>
                    );
                  })}
                  {listed.length === 0 ? (
                    <p className="fs-13 text-muted text-center py-4 mb-0">
                      No conversations match this filter.
                    </p>
                  ) : null}
                </div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                  <span className="fs-12 text-muted">
                    {listed.length} of {TOTAL_CONVERSATIONS} conversations
                  </span>
                  <button
                    type="button" className="btn btn-sm btn-outline-light bg-white"
                    onClick={() => setActiveModal('new')}
                  >
                    New chat
                  </button>
                </div>
              </div>
            </div>

            <div className="col-12 col-xxl-8 col-lg-7">
              <div className="card mb-0 h-100">
                {selected ? (
                  <>
                    <div className="card-header d-flex align-items-center gap-2 flex-wrap">
                      <span className="avatar avatar-md rounded-circle flex-shrink-0">
                        <ImageWithBasePath
                          src={selected.avatar} alt={selected.name} className="rounded-circle"
                        />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h5 className="fs-14 mb-0">
                          <ActionLink onClick={() => setContactOpen(true)}>{selected.name}</ActionLink>
                        </h5>
                        <span className="fs-12 text-muted">
                          {selected.phone} · {selected.relation}
                          {selected.online ? ' · online' : ''}
                        </span>
                      </div>
                      <span className={labelBadge[selected.label] ?? 'badge badge-soft-secondary'}>
                        {selected.label}
                      </span>
                      {/* The window, counted from the last inbound message. */}
                      <span className={`message-status-badge ${sessionOpen ? 'is-live' : 'is-urgent'}`}>
                        <i className={sessionOpen ? 'ti ti-lock-open' : 'ti ti-lock'} />
                        {sessionLabelOf(selected)}
                      </span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label="Contact details" onClick={() => setContactOpen(true)}
                        >
                          <i className="ti ti-user-circle" />
                        </button>
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label="Schedule a message" onClick={() => setActiveModal('schedule')}
                        >
                          <i className="ti ti-clock-play" />
                        </button>
                        {/* The template's overflow menu, flattened into the rail. */}
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label="Assign conversation" onClick={() => assign(selected)}
                        >
                          <i className="ti ti-user-check" />
                        </button>
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label={selected.pinned ? 'Unpin conversation' : 'Pin conversation'}
                          onClick={() => togglePin(selected)}
                        >
                          <i className={selected.pinned ? 'ti ti-pinned-off' : 'ti ti-pin'} />
                        </button>
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label="Archive conversation" onClick={() => archive(selected)}
                        >
                          <i className="ti ti-archive" />
                        </button>
                      </span>
                    </div>

                    <div className="card-body">
                      {renderMessages(selected)}
                    </div>

                    <div className="card-footer">
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        {quickReplies.map((quick) => (
                          <button
                            type="button" className="btn btn-sm btn-outline-light bg-white"
                            key={quick}
                            disabled={!sessionOpen}
                            onClick={() => setReply(quick)}
                          >
                            <i className="ti ti-bolt me-1" />{quick}
                          </button>
                        ))}
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => setActiveModal('new')}
                        >
                          <i className="ti ti-template me-1" />Use a template
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button" className="btn btn-outline-light bg-white btn-icon"
                          aria-label="Attach media" onClick={() => setActiveModal('media')}
                        >
                          <i className="ti ti-paperclip" />
                        </button>
                        <textarea
                          className="form-control" rows={1} placeholder="Write a reply…"
                          aria-label="Write a reply"
                          /* Free text only inside the 24-hour window. */
                          disabled={!sessionOpen}
                          value={reply} onChange={(event) => setReply(event.target.value)}
                        />
                        <button
                          type="button" className="btn btn-outline-light bg-white btn-icon"
                          aria-label="Schedule this reply" onClick={() => setActiveModal('schedule')}
                        >
                          <i className="ti ti-clock-play" />
                        </button>
                        <button
                          type="button" className="btn btn-primary btn-icon"
                          aria-label="Send reply"
                          disabled={!sessionOpen || !reply.trim()}
                          onClick={sendReply}
                        >
                          <i className="ti ti-send" />
                        </button>
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-2">
                        {sessionOpen
                          ? `Free-form replies allowed for another ${sessionHoursLeftOf(selected)} hours. After that only approved templates can be sent.`
                          : 'The 24-hour window has closed. Only an approved template can be sent to this contact.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="card-body text-center py-5">
                    <span className="avatar avatar-xxl bg-success-transparent text-success rounded-circle mb-3">
                      <i className="ti ti-brand-whatsapp fs-36" />
                    </span>
                    <h5 className="mb-1">No conversation selected</h5>
                    <p className="text-muted mb-0">Pick one from the inbox to read it.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bulk messaging */}
          {sectionHeader(
            'Bulk', 'Bulk messaging',
            'A bulk send outside an open session must use an approved template. Numbers are validated and deduplicated before a single message is billed.',
            { icon: 'ti ti-download', text: 'Download CSV template', onClick: () => push('CSV template downloaded') },
          )}
          <div className="row g-3 mb-5">
            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header">
                  <h6 className="fs-14 mb-0"><i className="ti ti-cloud-upload me-1" />Recipients</h6>
                </div>
                <div className="card-body">
                  <div className="border rounded text-center p-4 mb-3">
                    <span className="avatar avatar-lg bg-success-transparent text-success rounded-circle mb-2">
                      <i className="ti ti-file-upload fs-20" />
                    </span>
                    <h6 className="fs-14 mb-1">Drop a recipient file here</h6>
                    <p className="fs-12 text-muted mb-0">
                      CSV or Excel, up to 5 MB. Column one holds the WhatsApp number with country
                      code; further columns become template variables.
                    </p>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('import')}
                    >
                      <i className="ti ti-file-type-csv me-1" />CSV import
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('import')}
                    >
                      <i className="ti ti-file-type-xls me-1" />Excel import
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('group')}
                    >
                      <i className="ti ti-bookmarks me-1" />Saved groups
                    </button>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fs-12 text-muted">
                      Last upload · {BULK_FILE}, {BULK_UPLOADED}
                    </span>
                    <button
                      type="button" className="btn btn-sm btn-primary"
                      onClick={() => setActiveModal('bulk')}
                    >
                      Upload
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="fs-14 mb-0">
                    <i className="ti ti-filter-cog me-1" />Audience builder
                  </h6>
                  {/* The builder's own result, not a fixed 318. */}
                  <span className="message-status-badge is-live">
                    {audience.result.toLocaleString()} match
                  </span>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <label className="form-label" htmlFor="wa-base">Base group</label>
                    <select
                      className="form-select" id="wa-base"
                      value={baseGroup} onChange={(event) => setBaseGroup(event.target.value)}
                    >
                      {baseGroups.map((entry) => <option key={entry.label}>{entry.label}</option>)}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label" htmlFor="wa-narrow-class">Narrow by class</label>
                    <select
                      className="form-select" id="wa-narrow-class"
                      value={narrowClass} onChange={(event) => setNarrowClass(event.target.value)}
                    >
                      {classNarrowOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="wa-narrow-cond">Narrow by condition</label>
                    <select
                      className="form-select" id="wa-narrow-cond"
                      value={condition} onChange={(event) => setCondition(event.target.value)}
                    >
                      {conditionOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </div>
                  {pairList([
                    { label: 'Exclude · opted out of WhatsApp', value: String(audience.optedOut) },
                    { label: 'Resulting audience', value: audience.result.toLocaleString() },
                  ])}
                  <div className="d-flex align-items-center justify-content-between mt-3">
                    <span className="fs-12 text-muted">Re-read at send time</span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('group')}
                    >
                      Save as group
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card mb-0 h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h6 className="fs-14 mb-0">
                    <i className="ti ti-checkup-list me-1" />Validation &amp; estimate
                  </h6>
                  <span className="message-status-badge is-high">2 issues</span>
                </div>
                <div className="card-body">
                  {pairList([
                    { label: 'Rows read', value: BULK_VALIDATION.rows.toLocaleString() },
                    { label: 'Duplicate numbers', value: String(BULK_VALIDATION.duplicates) },
                    { label: 'Invalid or no WhatsApp', value: String(BULK_VALIDATION.unregistered) },
                    { label: 'Estimated recipients', value: BULK_VALIDATION.deliverable.toLocaleString() },
                    {
                      label: 'Estimated delivery',
                      value: deliveryEstimateOf(BULK_VALIDATION.deliverable),
                    },
                  ])}
                  <div className="d-flex align-items-center gap-2 mt-3">
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('preview')}
                    >
                      Preview
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('schedule')}
                    >
                      Schedule
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-primary"
                      onClick={() => setActiveModal('broadcast')}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp templates */}
          {sectionHeader(
            'Templates', 'WhatsApp templates',
            'Ten templates registered with Meta. Only approved ones can open a conversation; an edit sends the template back for review.',
            { icon: 'ti ti-plus', text: 'Create template', onClick: () => setActiveModal('template') },
          )}
          <div className="row g-3 mb-5">
            {whatsappTemplates.map((entry) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={entry.name}>
                <div className="template">
                  <div className="template-preview">
                    <div className="template-mini"><b>{entry.preview}</b></div>
                  </div>
                  <div className="template-body">
                    <span className="category">{entry.category}</span>
                    <p className="template-title">{entry.name}</p>
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <span className={templateStateBadge[entry.state]}>
                        <i className={templateStateIcon[entry.state]} />{entry.state}
                      </span>
                      <span className="fs-12 text-muted">{entry.languages}</span>
                    </div>
                    <div className="d-flex flex-wrap gap-1 mt-2">
                      {entry.fields.map((field) => (
                        <span className="fs-12 text-muted" key={field}>{field}</span>
                      ))}
                    </div>
                    {entry.rejectedReason ? (
                      <p className="fs-12 text-danger mb-0 mt-1">{entry.rejectedReason}</p>
                    ) : null}
                  </div>
                  <div className="template-footer">
                    {/* Counted from the placeholders the body names. */}
                    <span>
                      {variablesOf(entry)} variable{variablesOf(entry) === 1 ? '' : 's'}
                    </span>
                    <span className="d-inline-flex gap-1">
                      <button
                        type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                        aria-label={`Preview ${entry.name}`}
                        onClick={() => setActiveModal('preview')}
                      >
                        <i className="ti ti-eye" />
                      </button>
                      {entry.state === 'Rejected' ? (
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => setActiveModal('template')}
                        >
                          Revise
                        </button>
                      ) : (
                        <>
                          <button
                            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                            aria-label={`${entry.action === 'edit' ? 'Edit' : 'Copy'} ${entry.name}`}
                            onClick={() => setActiveModal('template')}
                          >
                            <i className={entry.action === 'edit' ? 'ti ti-edit' : 'ti ti-copy'} />
                          </button>
                          <button
                            type="button" className="btn btn-sm btn-outline-light bg-white"
                            /* Only an approved template may be sent. */
                            disabled={entry.state !== 'Approved'}
                            onClick={() => setActiveModal('broadcast')}
                          >
                            Use
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recipient groups */}
          {sectionHeader(
            'Groups', 'Recipient groups',
            'Anyone who has opted out is excluded from every group automatically, whichever list they appear on.',
            { icon: 'ti ti-plus', text: 'Create group', onClick: () => setActiveModal('group') },
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
                  <div className="audience-footer">Last broadcast · {group.last}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Broadcast queue */}
          {sectionHeader(
            'Queue', 'Broadcast queue',
            'Every broadcast from draft to delivered. A failed send lists the reason returned by the WhatsApp Business API rather than a generic status.',
            { icon: 'ti ti-plus', text: 'New broadcast', onClick: () => setActiveModal('broadcast') },
          )}
          <div className="row g-3 mb-5">
            {broadcastQueue.map((item) => (
              <div className="col-12 col-xxl-6" key={item.title}>
                <div className="schedule">
                  <div className="schedule-main">
                    <div className="d-flex align-items-start gap-2 flex-wrap">
                      <div className="flex-fill">
                        <span className={broadcastStateBadge[item.state]}>
                          <i className={broadcastStateIcon[item.state]} />{item.state}
                        </span>
                        <span className="fs-12 text-muted ms-2">{item.template}</span>
                        <p className="schedule-title mt-1">{item.title}</p>
                        <p className="fs-12 text-muted mb-0">{item.note}</p>
                      </div>
                    </div>
                    <div className="schedule-meta mt-2">
                      <span>
                        <i className="ti ti-users" />{item.audience} · <b>{item.audienceCount}</b>
                      </span>
                      <span><i className="ti ti-clock" />{item.metaLabel} <b>{item.metaValue}</b></span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                      <span className="fs-12 text-muted">{item.stamp}</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
                          aria-label={`View ${item.title}`}
                          onClick={() => setActiveModal('preview')}
                        >
                          <i className="ti ti-eye" />
                        </button>
                        {/* Read off the state — and blocked while its template is in review. */}
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => {
                            if (item.blocked) {
                              push(`${item.template} is still in review — this broadcast is held`, 'warning');
                              return;
                            }
                            setActiveModal(item.state === 'Draft' || item.state === 'Scheduled' ? 'schedule' : 'broadcast');
                          }}
                        >
                          {broadcastActionOf(item)}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Media library */}
          {sectionHeader(
            'Media', 'Media library',
            'Files already uploaded to the business account. Attaching from here reuses the stored media ID rather than uploading again.',
            { icon: 'ti ti-upload', text: 'Upload', onClick: () => setActiveModal('media') },
          )}
          <div className="row g-3 mb-5">
            {mediaLibrary.map((item) => (
              <div className="col-xxl-3 col-lg-4 col-md-6" key={item.name}>
                <div className="channel">
                  <div className="channel-top">
                    <span className="channel-icon">
                      {item.image
                        ? <ImageWithBasePath src={item.image} alt={item.name} className="rounded" />
                        : <i className={item.icon} />}
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="channel-name text-truncate">{item.name}</p>
                      <p className="text-truncate">{item.kind}</p>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Details</div>
                    <div className="row-value">{item.meta}</div>
                  </div>
                  <div className="channel-footer">
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => setActiveModal('media')}
                    >
                      Preview
                    </button>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      /* A template's own header is bound to it. */
                      disabled={item.locked}
                      onClick={() => push(`${item.name} attached`)}
                    >
                      Attach
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          {sectionHeader(
            'Shortcuts', 'Quick actions', 'The eight things most often done from this page.',
            { icon: 'ti ti-settings', text: 'WhatsApp settings', onClick: () => push('WhatsApp settings live under Settings · Communication') },
          )}
          <div className="row g-3">
            {quickActions.map((action) => (
              <div className="col-xxl-3 col-lg-4 col-md-6" key={action.title}>
                <ActionLink
                  className="message-action"
                  onClick={() => {
                    if (action.title === 'Send Message') { setActiveModal('new'); return; }
                    if (action.title === 'Bulk Messaging') { setActiveModal('bulk'); return; }
                    if (action.title === 'Create Broadcast') { setActiveModal('broadcast'); return; }
                    if (action.title === 'Import Contacts') { setActiveModal('import'); return; }
                    if (action.title === 'Manage Templates') { setActiveModal('template'); return; }
                    if (action.title === 'Recipient Groups') { setActiveModal('group'); return; }
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

          {/* Contact panel */}
          <Offcanvas
            open={contactOpen && selected !== undefined}
            onClose={() => setContactOpen(false)}
            title={selected ? selected.name : 'Contact'}
            labelledById="wa_contact_lbl"
          >
            {selected ? (
              <>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="avatar avatar-lg rounded-circle flex-shrink-0">
                    <ImageWithBasePath
                      src={selected.avatar} alt={selected.name} className="rounded-circle"
                    />
                  </span>
                  <div>
                    <h6 className="fs-14 mb-0">{selected.name}</h6>
                    <span className="fs-12 text-muted">{selected.relation}</span>
                  </div>
                </div>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className={labelBadge[selected.label] ?? 'badge badge-soft-secondary'}>
                    {selected.label}
                  </span>
                  <span className={stateBadge[selected.state]}>{selected.state}</span>
                  <span className={`message-status-badge ${sessionOpen ? 'is-live' : 'is-urgent'}`}>
                    <i className={sessionOpen ? 'ti ti-lock-open' : 'ti ti-lock'} />
                    {sessionLabelOf(selected)}
                  </span>
                </div>

                <div className="border rounded p-3 mb-3">{pairList(contactPairsOf(selected))}</div>

                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => assign(selected)}
                  >
                    <i className="ti ti-user-check me-1" />Assign
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => { setContactOpen(false); setActiveModal('schedule'); }}
                  >
                    <i className="ti ti-clock-play me-1" />Schedule
                  </button>
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => { setContactOpen(false); setActiveModal('new'); }}
                  >
                    <i className="ti ti-send me-1" />Reply
                  </button>
                </div>

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-message-circle me-1" />Chat history
                  <span className="fs-12 text-muted ms-2">{selected.totalMessages} messages</span>
                </h6>
                {renderMessages(selected)}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="fs-12 text-muted">
                    Showing the last {selected.messages.length} of {selected.totalMessages}
                  </span>
                  <ActionLink onClick={() => push('Transcript exported')}>Export transcript</ActionLink>
                </div>

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-photo me-1" />Shared media
                  <span className="fs-12 text-muted ms-2">{selected.sharedMedia.length} files</span>
                </h6>
                {selected.sharedMedia.length === 0 ? (
                  <p className="fs-13 text-muted mb-0">Nothing has been shared in this conversation.</p>
                ) : (
                  selected.sharedMedia.map((file) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={file.name}>
                      <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                        <i className={file.icon} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{file.name}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">
                          {file.kind} · {file.meta}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <WhatsappModals
        active={activeModal}
        conversation={selected ?? null}
        onClose={() => setActiveModal(null)}
        onSend={(payload: NewMessagePayload) => {
          setActiveModal(null);
          push(
            payload.template === '— None, session reply —'
              ? `Message sent to ${payload.to.split('·')[0].trim()}`
              : `${payload.template} sent to ${payload.to.split('·')[0].trim()}`,
          );
        }}
        onBroadcast={(payload: BroadcastPayload) => {
          setActiveModal(null);
          push(`${payload.template} broadcast to ${audience.result.toLocaleString()} recipients`);
        }}
        onBulk={(payload: BulkPayload) => {
          const deliverable = BULK_VALIDATION.rows
            - (payload.dropDuplicates ? BULK_VALIDATION.duplicates : 0)
            - (payload.skipInvalid ? BULK_VALIDATION.unregistered : 0);
          setActiveModal(null);
          push(`${deliverable.toLocaleString()} numbers validated on the WhatsApp network`);
        }}
        onSchedule={(payload: SchedulePayload) => {
          setActiveModal(null);
          push(`Scheduled for ${payload.sendDate} at ${payload.sendTime}, falling back to ${payload.fallbackTemplate}`);
        }}
        onCreateTemplate={(payload: TemplatePayload) => {
          setActiveModal(null);
          push(
            payload.name.trim()
              ? `${payload.name.trim()} submitted to Meta for review`
              : 'Give the template a name',
            payload.name.trim() ? 'success' : 'warning',
          );
        }}
        onImport={(payload: ImportPayload) => {
          setActiveModal(null);
          push(`Contacts imported from ${payload.column.toLowerCase()} with ${payload.countryCode}`);
        }}
        onCreateGroup={(payload: GroupPayload) => {
          setActiveModal(null);
          push(
            payload.name.trim()
              ? `${payload.name.trim()} saved · ${audience.result.toLocaleString()} members`
              : 'Give the group a name',
            payload.name.trim() ? 'success' : 'warning',
          );
        }}
        onAttach={(name) => {
          setActiveModal(null);
          push(`${name} attached to the reply`);
        }}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="waToasts" />
    </>
  );
};

export default SendWhatsappPage;
