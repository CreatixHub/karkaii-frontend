import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import {
  ActionLink,
  ExportMenu,
  GridWorkspaceShell,
  PageHeader,
  useWorkspace,
} from '@components/workspace';
import type {
  ColumnDef,
  ExportFormat,
  FilterField,
  GridStatusCount,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AnnouncementModals, { toRowDate } from './modals/AnnouncementModals';
import type {
  AnnouncementModalId, ComposeDraft, ComposeIntent, DuplicatePayload, PublishPayload,
  SchedulePayload, TemplatePayload,
} from './modals/AnnouncementModals';
import type { Announcement, Category, Priority } from './data/announcements.data';
import type { Queued, Template } from './data/reference.data';
import {
  PERIOD, QUICK_TOTALS, REGISTER_DATE, TOTAL_COUNT, acknowledgementOptions, announcements as initialRows,
  attachmentLabelOf, audienceOptions, authorOptions, barWidthOf, categoryIcon, categoryOptions,
  channelIcon, channelOptions, channelShort, chaseLineOf, dateKey, detailPairsOf, expiryVerbOf,
  isDelivered, isLive, matchesAudience, priorityBadge, priorityIcon, priorityOptions, rateToneOf,
  readPairsOf, readRateOf, reachLabelOf, reachValueOf, releasedOf, searchIndexOf, segmentsOf,
  sentIconOf, sentVerbOf, shortDate, statusBadge, statusOf, statusOptions, postModifierOf,
  usesChannel, barWidth, rateTone,
} from './data/announcements.data';
import {
  approvalBadge, approvalIcon, audiences, channelCards, channelStateBadge, queue, queueActionOf,
  templates,
} from './data/reference.data';

const routes = all_routes;

/** Ids and options are the template's own; the date window opens committed. */
const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  { id: 'priority', label: 'Priority', kind: 'select', chipLabel: 'Priority', options: priorityOptions },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  {
    id: 'delivery-channel', label: 'Delivery Channel', kind: 'select',
    chipLabel: 'Channel', options: channelOptions,
  },
  {
    id: 'acknowledgement', label: 'Acknowledgement', kind: 'select',
    chipLabel: 'Ack', allLabel: 'All', options: acknowledgementOptions,
  },
  {
    id: 'date-range', label: 'Date Range', kind: 'daterange', chipLabel: 'Raised',
    rangeFormat: 'd M Y', initialValue: PERIOD,
  },
  { id: 'author', label: 'Author', kind: 'select', chipLabel: 'Author', options: authorOptions },
];

const sortOptions: SortOption[] = [
  { id: 'recent', label: 'Recently published', icon: 'ti ti-clock' },
  { id: 'priority', label: 'Priority (high first)', icon: 'ti ti-flame' },
  { id: 'read', label: 'Read rate', icon: 'ti ti-eye' },
  { id: 'audience', label: 'Audience size', icon: 'ti ti-users' },
  { id: 'expiring', label: 'Expiring soonest', icon: 'ti ti-calendar-off' },
];

const priorityRank: Record<Priority, number> = { Urgent: 0, High: 1, Normal: 2 };

const isScheduled = (row: Announcement) => statusOf(row) === 'Scheduled';
const isDraft = (row: Announcement) => statusOf(row) === 'Draft';
const isExpired = (row: Announcement) => statusOf(row) === 'Expired';
const isUrgent = (row: Announcement) => row.priority === 'Urgent';
const needsAck = (row: Announcement) => row.ackRequired;

/** A notice with no expiry sorts last when the rail asks what closes soonest. */
const expiryKey = (row: Announcement) =>
  row.expires ? dateKey(row.expires) : Number.MAX_SAFE_INTEGER;

const AnnouncementsPage = () => {
  const [rows, setRows] = useState<Announcement[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<AnnouncementModalId | null>(null);
  const [modalRow, setModalRow] = useState<Announcement | null>(null);
  const [readerRow, setReaderRow] = useState<Announcement | null>(null);
  const [seed, setSeed] = useState<ComposeDraft | null>(null);
  const [reply, setReply] = useState('');

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Announcement | null, modal: AnnouncementModalId) => {
    setModalRow(row);
    setSeed(null);
    setActiveModal(modal);
  }, []);

  /** "Use template" opens the composer already filled in from the template. */
  const useTemplate = useCallback((template: Template) => {
    setModalRow(null);
    setSeed({
      title: '',
      category: template.category,
      summary: template.note,
      body: template.preview,
      audience: audienceOptions.find((option) => template.audience.startsWith(option))
        ?? audienceOptions[0],
      priority: template.category === 'Emergency' ? 'Urgent' : 'Normal',
      expiry: '',
      channels: template.category === 'Emergency'
        ? ['In-App', 'Email', 'SMS', 'Push notification']
        : ['In-App', 'Email'],
      ackRequired: template.category === 'Emergency',
      allowComments: true,
    });
    setActiveModal('new');
  }, []);

  /** A queued announcement is previewed through the record it will become. */
  const queuedRow = useCallback(
    (item: Queued) => rows.find((row) => row.title === item.title) ?? rows[0] ?? null,
    [rows],
  );

  const patchRow = useCallback(
    (change: (row: Announcement) => Announcement, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* ------------------------------ Sort targets ------------------------------ */

  /**
   * The grid draws no columns, but `useWorkspace` sorts through a column set,
   * so these name the sortable facts rather than cells.
   */
  const columns = useMemo<ColumnDef<Announcement>[]>(
    () => [
      { id: 'recent', label: 'Published', render: (row) => row.dated },
      { id: 'priority', label: 'Priority', render: (row) => row.priority },
      { id: 'read', label: 'Read rate', render: (row) => `${readRateOf(row)}%` },
      { id: 'audience', label: 'Audience', render: (row) => row.audienceLabel },
      { id: 'expiring', label: 'Expiry', render: (row) => row.expires },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Announcement>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.audience && !matchesAudience(row, filters.audience)) return false;
      if (filters.priority && row.priority !== filters.priority) return false;
      if (filters.status && statusOf(row) !== filters.status) return false;
      if (filters['delivery-channel'] && !usesChannel(row, filters['delivery-channel'])) return false;
      if (filters.acknowledgement) {
        const required = filters.acknowledgement === 'Required';
        if (row.ackRequired !== required) return false;
      }
      if (filters['date-range']) {
        const [from, to] = filters['date-range'].split(' - ');
        if (from && dateKey(row.dated) < dateKey(from)) return false;
        if (to && dateKey(row.dated) > dateKey(to)) return false;
      }
      if (filters.author && row.author !== filters.author) return false;
      return true;
    },
    /** The rail has no All chip here; each one narrows. */
    quickMatch: (row, quick) => {
      if (!quick) return true;
      if (quick === 'live') return isLive(row);
      if (quick === 'scheduled') return isScheduled(row);
      if (quick === 'drafts') return isDraft(row);
      if (quick === 'urgent') return isUrgent(row);
      if (quick === 'ack') return needsAck(row);
      return isExpired(row);
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'live': return isLive(row);
        case 'queue': return isScheduled(row);
        case 'drafts': return isDraft(row);
        case 'ack': return needsAck(row) && !isDraft(row);
        case 'archived': return row.lifecycle === 'Archived';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'priority':
          return priorityRank[a.priority] - priorityRank[b.priority]
            || dateKey(b.dated) - dateKey(a.dated);
        case 'read':
          return readRateOf(b) - readRateOf(a) || a.title.localeCompare(b.title);
        case 'audience':
          return b.audienceTotal - a.audienceTotal || a.title.localeCompare(b.title);
        case 'expiring':
          return expiryKey(a) - expiryKey(b) || a.title.localeCompare(b.title);
        // Newest first, which is what "Recently published" means on a card wall.
        case 'recent':
        default:
          return dateKey(b.dated) - dateKey(a.dated) || a.title.localeCompare(b.title);
      }
    },
    defaultSort: 'recent',
    defaultQuick: null,
    pageSize: 12,
  });

  const countBy = useCallback(
    (test: (row: Announcement) => boolean) => rows.filter(test).length,
    [rows],
  );

  /** Template total − what it seeded + what the register holds now. */
  const shift = useCallback(
    (base: number, test: (row: Announcement) => boolean) =>
      base - initialRows.filter(test).length + countBy(test),
    [countBy],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Announcements', icon: 'ti ti-layout-list' },
      { id: 'live', label: 'Published & Live', icon: 'ti ti-broadcast' },
      { id: 'queue', label: 'Scheduled Queue', icon: 'ti ti-clock' },
      { id: 'drafts', label: 'My Drafts', icon: 'ti ti-pencil' },
      { id: 'ack', label: 'Awaiting Acknowledgement', icon: 'ti ti-checkbox' },
      { id: 'archived', label: 'Archived', icon: 'ti ti-archive' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'live', label: 'Live', icon: 'ti ti-broadcast', count: shift(QUICK_TOTALS.live, isLive) },
      {
        id: 'scheduled', label: 'Scheduled', icon: 'ti ti-clock',
        count: shift(QUICK_TOTALS.scheduled, isScheduled),
      },
      { id: 'drafts', label: 'Drafts', icon: 'ti ti-pencil', count: shift(QUICK_TOTALS.drafts, isDraft) },
      {
        id: 'urgent', label: 'Urgent', icon: 'ti ti-alert-triangle',
        count: shift(QUICK_TOTALS.urgent, isUrgent),
      },
      {
        id: 'ack', label: 'Needs Ack', icon: 'ti ti-checkbox',
        count: shift(QUICK_TOTALS.needsAck, needsAck),
      },
      {
        id: 'expired', label: 'Expired', icon: 'ti ti-archive',
        count: shift(QUICK_TOTALS.expired, isExpired),
      },
    ],
    [shift],
  );

  const statusCounts = useMemo<GridStatusCount[]>(
    () => [
      {
        tone: 'is-live', icon: 'ti ti-broadcast',
        label: `${shift(QUICK_TOTALS.live, isLive)} live`,
      },
      {
        tone: 'is-scheduled', icon: 'ti ti-clock',
        label: `${shift(QUICK_TOTALS.scheduled, isScheduled)} scheduled`,
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
    (draft: ComposeDraft, intent: ComposeIntent) => {
      if (!draft.title.trim()) {
        push('Give the announcement a title', 'warning');
        return;
      }
      const id = `ANN-2026-0${147 + rows.length}`;
      const lifecycle = intent === 'publish' ? 'Published' : intent === 'schedule' ? 'Scheduled' : 'Draft';
      const published = intent === 'publish';
      setRows((current) => [
        {
          id,
          title: draft.title.trim(),
          summary: draft.summary.trim() || 'No summary given.',
          body: [{ heading: '', paragraphs: draft.body.split('\n\n').filter(Boolean), bullets: [] }],
          category: draft.category as Category,
          priority: draft.priority as Priority,
          lifecycle,
          author: authorOptions[0], authorRole: 'Administrator',
          dated: REGISTER_DATE, datedAt: '09:00 am',
          expires: toRowDate(draft.expiry), expiresAt: draft.expiry ? '11:59 pm' : '',
          audienceLabel: draft.audience,
          // Entire school is the roll the reader panel adds up; the rest are its parts.
          audienceTotal: draft.audience === 'Entire school' ? 2940
            : draft.audience === 'Parents' ? 1240
              : draft.audience === 'Students' ? 1286
                : draft.audience === 'Teachers' ? 184 : 230,
          segments: [],
          deliveries: draft.channels.map((channel) => ({
            channel,
            at: published ? '09:00 am' : '',
            delivered: 0,
          })),
          readers: 0, acknowledged: 0,
          ackRequired: draft.ackRequired, allowComments: draft.allowComments,
          cover: 'assets/img/blogs/blog-01.jpg', coverAlt: draft.title.trim(),
          attachments: [], comments: [],
        },
        ...current,
      ]);
      setActiveModal(intent === 'schedule' ? 'schedule' : null);
      push(
        intent === 'publish' ? `${draft.title.trim()} published`
          : intent === 'schedule' ? `${draft.title.trim()} ready to schedule`
            : `${draft.title.trim()} saved as a draft`,
      );
    },
    [push, rows.length],
  );

  const schedule = useCallback(
    (payload: SchedulePayload) => {
      const sendDate = toRowDate(payload.sendDate);
      if (!modalRow) {
        setActiveModal(null);
        push(`Queued for ${sendDate} at ${payload.sendTime}`);
        return;
      }
      patchRow(
        (row) => ({
          ...row,
          lifecycle: 'Scheduled',
          dated: sendDate,
          datedAt: payload.sendTime,
          expires: toRowDate(payload.autoExpiry),
          expiresAt: payload.autoExpiry ? '11:59 pm' : '',
          // Queuing pulls every channel back to unsent.
          deliveries: row.deliveries.map((delivery) => ({ ...delivery, at: '', delivered: 0 })),
          readers: 0,
        }),
        `${modalRow.title} queued for ${sendDate} at ${payload.sendTime}`,
      );
    },
    [modalRow, patchRow, push],
  );

  const publish = useCallback(
    (payload: PublishPayload) => {
      if (!modalRow) return;
      patchRow(
        (row) => ({
          ...row,
          lifecycle: 'Published',
          dated: REGISTER_DATE,
          datedAt: '09:00 am',
          deliveries: payload.channels.map((channel) => {
            const existing = row.deliveries.find((delivery) => delivery.channel === channel);
            return {
              channel,
              at: '09:00 am',
              delivered: existing?.delivered || row.audienceTotal,
            };
          }),
        }),
        `${modalRow.title} published to ${modalRow.audienceTotal.toLocaleString()} recipients`,
      );
    },
    [modalRow, patchRow],
  );

  const duplicate = useCallback(
    (payload: DuplicatePayload) => {
      if (!modalRow) return;
      const id = `ANN-2026-0${147 + rows.length}`;
      setRows((current) => [
        {
          ...modalRow,
          id,
          title: payload.title.trim() || `${modalRow.title} (copy)`,
          // A copy is a draft: no history, no read status, nothing delivered.
          lifecycle: 'Draft',
          dated: REGISTER_DATE, datedAt: '09:00 am',
          audienceLabel: payload.copyAudience ? modalRow.audienceLabel : 'Entire school',
          audienceTotal: payload.copyAudience ? modalRow.audienceTotal : 2940,
          deliveries: payload.copyChannels
            ? modalRow.deliveries.map((delivery) => ({ ...delivery, at: '', delivered: 0 }))
            : [],
          attachments: payload.copyAttachments ? modalRow.attachments : [],
          readers: 0, acknowledged: 0,
          comments: [],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${payload.title.trim() || modalRow.title} created as a draft`);
    },
    [modalRow, push, rows.length],
  );

  const createTemplate = useCallback(
    (payload: TemplatePayload) => {
      setActiveModal(null);
      push(
        payload.name.trim()
          ? `${payload.name.trim()} saved as a ${payload.category.toLowerCase()} template`
          : 'Template saved',
      );
    },
    [push],
  );

  const archive = useCallback(
    (row: Announcement) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id ? { ...entry, lifecycle: 'Archived' } : entry
      )));
      push(`${row.title} archived`);
    },
    [push],
  );

  const republish = useCallback(
    (row: Announcement) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id
          ? {
            ...entry,
            lifecycle: 'Published',
            dated: REGISTER_DATE,
            datedAt: '09:00 am',
            deliveries: entry.deliveries.map((delivery) => ({
              ...delivery,
              at: '09:00 am',
              delivered: delivery.delivered || entry.audienceTotal,
            })),
          }
          : entry
      )));
      push(`${row.title} republished to ${row.audienceTotal.toLocaleString()} recipients`);
    },
    [push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        push(`Delivery report prepared for ${workspace.visible.length} announcements`);
        return;
      }
      push(`${workspace.visible.length} announcements exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const sendReply = useCallback(() => {
    if (!readerRow || !reply.trim()) return;
    const body = reply.trim();
    setRows((current) => current.map((row) => (
      row.id === readerRow.id
        ? {
          ...row,
          comments: [...row.comments, {
            author: authorOptions[0], role: 'Administrator', at: 'Just now',
            body, avatar: 'assets/img/profiles/avatar-02.jpg',
          }],
        }
        : row
    )));
    setReaderRow((current) => (current
      ? {
        ...current,
        comments: [...current.comments, {
          author: authorOptions[0], role: 'Administrator', at: 'Just now',
          body, avatar: 'assets/img/profiles/avatar-02.jpg',
        }],
      }
      : current));
    setReply('');
    push('Reply added to the thread');
  }, [push, readerRow, reply]);

  /* ---------------------------------- Card ---------------------------------- */

  const renderCard = (row: Announcement) => (
    <div className={`message-post${postModifierOf(row)}`}>
      <ActionLink className="post-cover" ariaLabel="Open announcement" onClick={() => setReaderRow(row)}>
        <ImageWithBasePath src={row.cover} alt={row.coverAlt} />
        <span className="post-status">
          {/* A normal notice carries no priority badge, only its status. */}
          {row.priority !== 'Normal' ? (
            <span className={priorityBadge[row.priority]}>
              <i className={priorityIcon[row.priority]} />{row.priority}
            </span>
          ) : null}
          <span className={statusBadge[statusOf(row)]}>{statusOf(row)}</span>
        </span>
        {row.ackRequired ? (
          <span className="post-acknowledgement"><i className="ti ti-checkbox" />Ack required</span>
        ) : null}
      </ActionLink>

      <div className="post-body">
        <span className="category">
          <i className={`${categoryIcon[row.category]} me-1`} />{row.category}
        </span>
        <h3 className="post-title">
          <ActionLink onClick={() => setReaderRow(row)}>{row.title}</ActionLink>
        </h3>
        <p className="post-summary">{row.summary}</p>
        <div className="post-facts">
          <span><i className="ti ti-users" />{row.audienceLabel}</span>
          <span>
            <i className={sentIconOf(row)} />{sentVerbOf(row)} <b>{shortDate(row.dated)}</b>
          </span>
          <span>
            <i className="ti ti-calendar-off" />
            {row.expires ? <>{expiryVerbOf(row)} <b>{shortDate(row.expires)}</b></> : 'No expiry'}
          </span>
          <span><i className="ti ti-paperclip" />{attachmentLabelOf(row)}</span>
        </div>
      </div>

      <div className="post-reach">
        <div className="post-reach-top">
          <span>{reachLabelOf(row)}</span>
          <b>{reachValueOf(row)}</b>
        </div>
        {/* The bar snaps to the nearest width utility the theme ships. */}
        <div className={`rate${rateToneOf(row)}`}>
          <span className={`width-${barWidthOf(row)}`} />
        </div>
      </div>

      <div className="post-footer">
        <span className="pips">
          {row.deliveries.map((delivery) => (
            <span
              className={`pip is-${isDelivered(row, delivery.channel) ? 'on' : 'off'}`}
              title={channelShort[delivery.channel]}
              key={delivery.channel}
            >
              <i className={channelIcon[delivery.channel]} />
            </span>
          ))}
        </span>
        {/* The template's overflow dropdown, flattened into the rail. */}
        <div className="d-inline-flex gap-1">
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label="View" onClick={() => setReaderRow(row)}
          >
            <i className="ti ti-eye" />
          </button>
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label="Edit" onClick={() => openModal(row, 'new')}
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
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label={isLive(row) ? 'Republish' : 'Publish'} onClick={() => openModal(row, 'publish')}
          >
            <i className="ti ti-broadcast" />
          </button>
          <button
            type="button" className="btn btn-sm btn-outline-light bg-white btn-icon"
            aria-label="Archive"
            disabled={row.lifecycle === 'Archived'}
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

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Announcements"
            section="Communication"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(rows.find(isDraft) ?? rows[0] ?? null, 'schedule')}
                  >
                    <i className="ti ti-calendar-plus me-2" />Schedule
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
                <ExportMenu
                  printLabel="Delivery report"
                  printIcon="ti ti-report"
                  onExport={exportAs}
                />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'new')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />New Announcement
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
            searchPlaceholder="Search announcement, category or author…"
            searchLabel="Search announcements"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="announcements"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            workspaceId="cmxWorkspace"
            onRefresh={() => { setRows(initialRows); push('Announcements refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            caption={
              <>
                {TOTAL_COUNT - initialRows.length + rows.length} announcements match the current
                filters. Open one to read it as a recipient does, see who it reached and what came back.
              </>
            }
            statusCounts={statusCounts}
            cardClassName="col-xxl-3 col-lg-6 col-md-6"
            renderCard={renderCard}
            emptyIcon="ti ti-speakerphone"
            emptyTitle="No announcements match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            emptyAction={
              <button type="button" className="btn btn-primary" onClick={() => openModal(null, 'new')}>
                <i className="ti ti-square-rounded-plus me-2" />New Announcement
              </button>
            }
          />

          {/* Audience Distribution */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Distribution</span>
              <h2>Audiences</h2>
              <p>
                Who an announcement can be addressed to, how many that is today, and how reliably
                each group actually reads what is sent.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => openModal(null, 'new')}
            >
              <i className="ti ti-target-arrow me-1" />Address a new audience
            </button>
          </div>
          <div className="row g-3 mb-5">
            {audiences.map((audience) => (
              <div className="col-xxl-3 col-lg-6 col-md-6" key={audience.name}>
                <div className="audience">
                  <div className="audience-top">
                    <span className="audience-icon"><i className={audience.icon} /></span>
                    <div className="flex-fill">
                      <p className="audience-name">{audience.name}</p>
                      <small>{audience.note}</small>
                    </div>
                  </div>
                  <div className="audience-count">
                    <b>{audience.count}</b><span>{audience.unit}</span>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Delivery status</div>
                    <div className="row-value">
                      <span className={`message-status-badge ${audience.deliveryTone}`}>
                        {audience.delivery}
                      </span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Read rate<small>Last 30 days</small></div>
                    <div className="row-value"><b>{audience.readRate}%</b></div>
                  </div>
                  {/* The same snapping the announcement cards use. */}
                  <div className={`rate${rateTone(audience.readRate)} mt-2`}>
                    <span className={`width-${barWidth(audience.readRate)}`} />
                  </div>
                  <div className="audience-footer">Last announcement · {audience.last}</div>
                </div>
              </div>
            ))}
          </div>
          {/* /Audience Distribution */}

          {/* Announcement Templates */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Templates</span>
              <h2>Announcement templates</h2>
              <p>
                The notices the school sends every year, already written. Start from one and change
                the dates rather than composing from scratch.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => openModal(rows[0] ?? null, 'template')}
            >
              <i className="ti ti-plus me-1" />Create template
            </button>
          </div>
          <div className="row g-3 mb-5">
            {templates.map((template) => (
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
                  </div>
                  <div className="template-footer">
                    <span>{template.audience}</span>
                    <button
                      type="button" className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => useTemplate(template)}
                    >
                      Use template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Announcement Templates */}

          {/* Scheduled Announcements */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Queue</span>
              <h2>Scheduled announcements</h2>
              <p>
                Written, approved or awaiting approval, and waiting for their moment. Anything
                unapproved by its send time stays put and is flagged.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => openModal(rows.find(isScheduled) ?? rows[0] ?? null, 'schedule')}
            >
              <i className="ti ti-calendar-plus me-1" />Schedule announcement
            </button>
          </div>
          <div className="row g-3 mb-5">
            {queue.map((item) => (
              <div className="col-12 col-xxl-6" key={item.title}>
                <div className="schedule">
                  <div className="schedule-when">
                    <span className="schedule-day">{item.day}</span>
                    <span className="schedule-month">{item.month}</span>
                    <span className="schedule-time">{item.time}</span>
                  </div>
                  <div className="schedule-main">
                    <div className="d-flex align-items-start gap-2 flex-wrap">
                      <div className="flex-fill">
                        <span className="category">{item.category}</span>
                        <p className="schedule-title mt-1">{item.title}</p>
                      </div>
                      <span className={approvalBadge[item.approval]}>
                        <i className={approvalIcon[item.approval]} />{item.approval}
                      </span>
                    </div>
                    <div className="schedule-meta">
                      <span><i className="ti ti-users" />{item.audience} · <b>{item.count}</b></span>
                      <span>
                        <i className="ti ti-calendar-off" />
                        {item.expires ? <>Auto-expires <b>{item.expires}</b></> : 'No auto-expiry'}
                      </span>
                    </div>
                    <div className="d-flex align-items-center justify-content-between gap-2 mt-3 flex-wrap">
                      <span className="pips">
                        {item.channels.map((channel) => (
                          <span className="pip is-on" title={channelShort[channel]} key={channel}>
                            <i className={channelIcon[channel]} />
                          </span>
                        ))}
                      </span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => openModal(queuedRow(item), 'preview')}
                        >
                          Preview
                        </button>
                        {/* Reschedule, Approve or Edit, read off the approval state. */}
                        <button
                          type="button" className="btn btn-sm btn-outline-light bg-white"
                          onClick={() => {
                            const action = queueActionOf(item);
                            if (action === 'Approve') {
                              push(`${item.title} approved for ${item.day} ${item.month}`);
                              return;
                            }
                            openModal(queuedRow(item), action === 'Edit' ? 'new' : 'schedule');
                          }}
                        >
                          {queueActionOf(item)}
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Scheduled Announcements */}

          {/* Communication Channels */}
          <div className="message-section-header">
            <div>
              <span className="message-metric-label">Channels</span>
              <h2>Communication channels</h2>
              <p>
                The six routes an announcement can travel. A channel that is off here is skipped
                silently, whatever an announcement asks for.
              </p>
            </div>
            <ActionLink
              className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
              onClick={() => push('Channel settings live under Settings · Communication')}
            >
              <i className="ti ti-settings me-1" />Channel settings
            </ActionLink>
          </div>
          <div className="row g-3">
            {channelCards.map((card) => (
              <div className="col-xxl-4 col-lg-4 col-md-6" key={card.channel}>
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
                      <span className={channelStateBadge[card.state]}>{card.state}</span>
                    </div>
                  </div>
                  <div className="info-row">
                    <div className="row-key">Last delivery</div>
                    <div className="row-value">{card.lastDelivery}</div>
                  </div>
                  <div className="channel-footer">
                    <span>{card.footer}</span>
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
          {/* /Communication Channels */}

          {/* Announcement reader */}
          <Offcanvas
            open={readerRow !== null}
            onClose={() => setReaderRow(null)}
            title={readerRow ? readerRow.category : 'Announcement'}
            labelledById="cmx_reader_title"
            className="offcanvas-xl"
          >
            {readerRow ? (
              <>
                <h5 className="fs-16 mb-2">{readerRow.title}</h5>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                  {readerRow.priority !== 'Normal' ? (
                    <span className={priorityBadge[readerRow.priority]}>
                      <i className={priorityIcon[readerRow.priority]} />{readerRow.priority}
                    </span>
                  ) : null}
                  <span className={statusBadge[statusOf(readerRow)]}>{statusOf(readerRow)}</span>
                  {readerRow.ackRequired ? (
                    <span className="message-status-badge is-accent">
                      <i className="ti ti-checkbox" />Acknowledgement required
                    </span>
                  ) : null}
                </div>
                <p className="fs-12 text-muted mb-3">
                  By {readerRow.author} · {readerRow.dated}, {readerRow.datedAt}
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
                    onClick={() => { setReaderRow(null); openModal(readerRow, 'new'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit
                  </button>
                  <button
                    type="button" className="btn btn-primary btn-sm"
                    onClick={() => republish(readerRow)}
                  >
                    <i className="ti ti-broadcast me-1" />Republish
                  </button>
                </div>

                <ImageWithBasePath
                  src={readerRow.cover}
                  alt={readerRow.coverAlt}
                  className="img-fluid rounded w-100 mb-3"
                />

                <span className="fs-12 text-muted d-block mb-1">
                  {readerRow.category} · {readerRow.audienceLabel}
                </span>
                <h6 className="fs-15 mb-2">{readerRow.title}</h6>
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

                {readerRow.allowComments ? (
                  <>
                    <h6 className="fs-14 mb-2 mt-3">
                      <i className="ti ti-message-circle me-1" />Comments
                      <span className="fs-12 text-muted ms-2">
                        {readerRow.comments.length}{' '}
                        {readerRow.comments.length === 1 ? 'reply' : 'replies'}
                      </span>
                    </h6>
                    {readerRow.comments.map((comment) => (
                      <div
                        className="d-flex align-items-start gap-2 border rounded p-2 mb-2"
                        key={`${comment.author}-${comment.at}`}
                      >
                        <span className="avatar avatar-sm rounded-circle flex-shrink-0">
                          <ImageWithBasePath
                            src={comment.avatar} alt={comment.author} className="rounded-circle"
                          />
                        </span>
                        <div className="flex-fill overflow-hidden">
                          <h6 className="fs-13 mb-0">
                            {comment.author}
                            <span className="fs-12 text-muted ms-2">{comment.role}</span>
                            <span className="fs-12 text-muted ms-2">{comment.at}</span>
                          </h6>
                          <p className="fs-13 text-muted mb-0">{comment.body}</p>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <input
                        type="text" className="form-control" placeholder="Write a reply…"
                        aria-label="Write a reply"
                        value={reply} onChange={(event) => setReply(event.target.value)}
                      />
                      <button
                        type="button" className="btn btn-primary flex-shrink-0"
                        disabled={!reply.trim()}
                        onClick={sendReply}
                      >
                        <i className="ti ti-send me-1" />Reply
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="fs-13 text-muted mb-3 mt-3">Comments are closed on this announcement.</p>
                )}

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-info-circle me-1" />Announcement details
                </h6>
                <div className="border rounded p-3 mb-3">{pairList(detailPairsOf(readerRow))}</div>

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-target-arrow me-1" />Audience
                  <span className="fs-13 text-muted ms-2">
                    {readerRow.audienceTotal.toLocaleString()}
                  </span>
                </h6>
                <div className="border rounded p-3 mb-3">
                  {segmentsOf(readerRow).map((segment, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={segment.label}
                    >
                      <span className="fs-13 text-muted">
                        {segment.label}
                        {segment.note ? <span className="d-block fs-12">{segment.note}</span> : null}
                      </span>
                      <span className="fs-13 fw-medium">{segment.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2"><i className="ti ti-router me-1" />Delivery channels</h6>
                <div className="border rounded p-3 mb-3">
                  {readerRow.deliveries.map((delivery, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={delivery.channel}
                    >
                      <span className="fs-13 text-muted">
                        <i className={`${channelIcon[delivery.channel]} me-1`} />
                        {channelShort[delivery.channel]}
                        <span className="d-block fs-12">
                          {delivery.at ? `Delivered ${delivery.at}` : 'Not sent yet'}
                        </span>
                      </span>
                      <span className="fs-13 fw-medium">
                        {delivery.at ? (delivery.delivered || readerRow.audienceTotal).toLocaleString() : '—'}
                      </span>
                    </div>
                  ))}
                  {releasedOf(readerRow).length === 0 ? (
                    <p className="fs-12 text-muted mb-0 mt-2">Nothing has left the queue yet.</p>
                  ) : null}
                </div>

                <h6 className="fs-14 mb-2">
                  <i className="ti ti-eye-check me-1" />Read status
                  <span className="fs-13 text-muted ms-2">{reachValueOf(readerRow)}</span>
                </h6>
                <div className="border rounded p-3 mb-3">
                  {pairList(readPairsOf(readerRow))}
                  <div className={`rate${rateToneOf(readerRow)} mt-2`}>
                    <span className={`width-${barWidthOf(readerRow)}`} />
                  </div>
                  <p className="fs-12 text-muted mb-0 mt-2">{chaseLineOf(readerRow)}</p>
                </div>

                <h6 className="fs-14 mb-2"><i className="ti ti-paperclip me-1" />Attachments</h6>
                {readerRow.attachments.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">Nothing attached to this announcement.</p>
                ) : (
                  readerRow.attachments.map((file) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={file.name}>
                      <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                        <i className={file.icon} />
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

                <h6 className="fs-14 mb-2 mt-3">
                  <i className="ti ti-link me-1" />Related announcements
                </h6>
                {rows
                  .filter((entry) => entry.id !== readerRow.id)
                  .slice(0, 3)
                  .map((entry) => (
                    <ActionLink
                      className="d-flex align-items-center gap-2 border rounded p-2 mb-2"
                      key={entry.id}
                      onClick={() => setReaderRow(entry)}
                    >
                      <span className="avatar avatar-sm rounded flex-shrink-0">
                        <ImageWithBasePath src={entry.cover} alt={entry.title} className="rounded" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{entry.title}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">
                          {entry.category} · {statusOf(entry) === 'Scheduled' ? 'scheduled ' : ''}
                          {shortDate(entry.dated)}
                        </span>
                      </div>
                      <i className="ti ti-chevron-right text-muted" />
                    </ActionLink>
                  ))}
              </>
            ) : null}
          </Offcanvas>
        </div>
      </div>
      {/* /Page Wrapper */}

      <AnnouncementModals
        active={activeModal}
        row={modalRow}
        seed={seed}
        onClose={() => setActiveModal(null)}
        onCompose={compose}
        onSchedule={schedule}
        onPublish={publish}
        onDuplicate={duplicate}
        onCreateTemplate={createTemplate}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="cmxToasts" />
    </>
  );
};

export default AnnouncementsPage;
