import { useCallback, useMemo, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink, ExportMenu, PageHeader, WorkspaceHeader, useWorkspace } from '@components/workspace';
import type {
  ColumnDef, ExportFormat, FilterField, QuickFilter, SavedView, SortOption, WorkspaceMenu,
} from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import NoticeModals from './modals/NoticeModals';
import type {
  NoticeDraft, NoticeModalId, PublishPayload, SharePayload,
} from './modals/NoticeModals';
import type {
  Audience, Category, Notice, NoticeFile, NoticeStatus, Priority,
} from './data/notices.data';
import {
  audienceOptions, branchOptions, cardToneOf, categoryBadge, categoryIcon, categoryOptions,
  classOptions, dateKey, dateRangeOptions, departmentOptions, detailPairsOf, fromSlashDate,
  notices as initialRows, pinnedOf, priorityOptions, priorityRank, publisherOptions, readBarOf,
  searchIndexOf, statusBadge, unpinnedOf,
} from './data/notices.data';

const routes = all_routes;

/** Ids and options are the template's own; nothing opens committed here. */
const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'audience', label: 'Audience', kind: 'select', chipLabel: 'Audience', options: audienceOptions },
  { id: 'priority', label: 'Priority', kind: 'select', chipLabel: 'Priority', options: priorityOptions },
  { id: 'department', label: 'Department', kind: 'select', chipLabel: 'Dept', options: departmentOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'branch', label: 'Branch', kind: 'select', chipLabel: 'Branch', options: branchOptions },
  {
    id: 'published-by', label: 'Published By', kind: 'select',
    chipLabel: 'Publisher', options: publisherOptions,
  },
  {
    id: 'date-range', label: 'Date Range', kind: 'select', chipLabel: 'Month',
    allLabel: 'Any', options: dateRangeOptions,
  },
];

/**
 * The toolbar's Sort menu is not in this template — the two orders below are
 * what its own script sorted by, pinned first and then newest.
 */
const sortOptions: SortOption[] = [
  { id: 'recent', label: 'Newest first', icon: 'ti ti-clock' },
  { id: 'priority', label: 'Priority (high first)', icon: 'ti ti-flame' },
  { id: 'reads', label: 'Most read', icon: 'ti ti-eye' },
  { id: 'expiry', label: 'Expiring soonest', icon: 'ti ti-calendar-off' },
];

/** "Jul 2026" against a notice's own publication date. */
const matchesMonth = (row: Notice, choice: string): boolean =>
  row.published.slice(3) === choice;

const NoticeBoardPage = () => {
  const [rows, setRows] = useState<Notice[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<NoticeModalId | null>(null);
  const [modalRow, setModalRow] = useState<Notice | null>(null);
  const [modalFile, setModalFile] = useState<NoticeFile | null>(null);
  const [detailRow, setDetailRow] = useState<Notice | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Notice | null, modal: NoticeModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  const patchRow = useCallback(
    (change: (row: Notice) => Notice, message: string) => {
      if (!modalRow) return;
      setRows((current) => current.map((row) => (row.id === modalRow.id ? change(row) : row)));
      setActiveModal(null);
      push(message);
    },
    [modalRow, push],
  );

  /* ------------------------------ Sort targets ------------------------------ */

  const columns = useMemo<ColumnDef<Notice>[]>(
    () => [
      { id: 'recent', label: 'Published', render: (row) => row.published },
      { id: 'priority', label: 'Priority', render: (row) => row.priority },
      { id: 'reads', label: 'Reads', render: (row) => String(row.reads) },
      { id: 'expiry', label: 'Expiry', render: (row) => row.expiry },
    ],
    [],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Notice>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.audience && row.audience !== filters.audience) return false;
      if (filters.priority && row.priority !== filters.priority) return false;
      if (filters.department && row.department !== filters.department) return false;
      if (filters.class && row.classes !== filters.class) return false;
      if (filters.branch && row.branch !== filters.branch) return false;
      if (filters['published-by'] && row.publisher !== filters['published-by']) return false;
      if (filters['date-range'] && !matchesMonth(row, filters['date-range'])) return false;
      return true;
    },
    /** Each chip is a category; there is no All chip on this rail. */
    quickMatch: (row, quick) => !quick || row.category === quick,
    viewMatch: (row, view) => (view === 'all' ? true : row.category === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'priority':
          return priorityRank[a.priority] - priorityRank[b.priority]
            || dateKey(b.published) - dateKey(a.published);
        case 'reads':
          return b.reads - a.reads || a.title.localeCompare(b.title);
        case 'expiry':
          return dateKey(a.expiry) - dateKey(b.expiry) || a.title.localeCompare(b.title);
        case 'recent':
        default:
          return dateKey(b.published) - dateKey(a.published) || a.title.localeCompare(b.title);
      }
    },
    defaultSort: 'recent',
    defaultQuick: null,
    pageSize: 24,
  });

  const visible = workspace.visible;
  const pinned = pinnedOf(visible);
  const unpinned = unpinnedOf(visible);

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Notices', icon: 'ti ti-layout-grid' },
      { id: 'Emergency', label: 'Emergency', icon: 'ti ti-alert-triangle' },
      { id: 'Examination', label: 'Examinations', icon: 'ti ti-file-certificate' },
      { id: 'Event', label: 'Events', icon: 'ti ti-confetti' },
    ],
    [],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'Important', label: 'Important', icon: 'ti ti-star' },
      { id: 'Emergency', label: 'Emergency', icon: 'ti ti-alert-triangle' },
      { id: 'Holiday', label: 'Holiday', icon: 'ti ti-beach' },
      { id: 'Examination', label: 'Examination', icon: 'ti ti-file-certificate' },
      { id: 'Event', label: 'Event', icon: 'ti ti-confetti' },
      { id: 'Circular', label: 'Circular', icon: 'ti ti-file-text' },
    ],
    [],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const createNotice = useCallback(
    (draft: NoticeDraft) => {
      if (!draft.title.trim() || !draft.description.trim()) {
        push('A notice needs a title and content', 'warning');
        return;
      }
      const id = `NTC-2${10 + rows.length}`;
      setRows((current) => [
        {
          id,
          title: draft.title.trim(),
          // The card's summary is the opening of the notice itself.
          desc: draft.description.trim().slice(0, 160),
          full: draft.description.trim(),
          category: draft.category as Category,
          priority: draft.priority as Priority,
          audience: draft.audience as Audience,
          department: draft.department,
          classes: draft.classes,
          branch: draft.branch,
          status: 'Published',
          publisher: "Principal's Office", publisherRole: 'Administration',
          avatar: 'assets/img/profiles/avatar-27.jpg',
          published: fromSlashDate(draft.publishDate),
          expiry: fromSlashDate(draft.expiryDate),
          attachments: 0, files: [],
          reads: 0, readPct: 0,
          pinned: false, comments: [],
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${id} published to ${draft.audience.toLowerCase()}`);
    },
    [push, rows.length],
  );

  const updateNotice = useCallback(
    (draft: NoticeDraft) => {
      patchRow(
        (row) => ({
          ...row,
          title: draft.title.trim() || row.title,
          full: draft.description.trim() || row.full,
          desc: draft.description.trim().slice(0, 160) || row.desc,
          category: draft.category as Category,
          priority: draft.priority as Priority,
          expiry: fromSlashDate(draft.expiryDate),
          status: draft.status as NoticeStatus,
        }),
        `${modalRow?.id ?? 'Notice'} updated`,
      );
    },
    [modalRow, patchRow],
  );

  /** Publishing can pin, which is what moves the notice into the top section. */
  const publishNotice = useCallback(
    (payload: PublishPayload) =>
      patchRow(
        (row) => ({
          ...row,
          status: 'Published',
          audience: payload.audience as Audience,
          published: fromSlashDate(payload.publishDate),
          pinned: payload.pin,
        }),
        `${modalRow?.id ?? 'Notice'} published to ${payload.audience.toLowerCase()} · ${payload.channels.toLowerCase()}`,
      ),
    [modalRow, patchRow],
  );

  const shareNotice = useCallback(
    (payload: SharePayload) => {
      const channels = [
        payload.email ? 'email' : '',
        payload.sms ? 'SMS' : '',
        payload.app ? 'app push' : '',
      ].filter(Boolean);
      setActiveModal(null);
      push(
        channels.length === 0
          ? 'Pick at least one channel to share on'
          : `Shared with ${payload.shareWith.toLowerCase()} by ${channels.join(', ')}`,
        channels.length === 0 ? 'warning' : 'success',
      );
    },
    [push],
  );

  const deleteNotice = useCallback(() => {
    if (!modalRow) return;
    setRows((current) => current.filter((row) => row.id !== modalRow.id));
    setActiveModal(null);
    push(`${modalRow.id} deleted`);
  }, [modalRow, push]);

  const togglePin = useCallback(
    (row: Notice) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id ? { ...entry, pinned: !entry.pinned } : entry
      )));
      push(row.pinned ? `${row.id} unpinned` : `${row.id} pinned to the top`);
    },
    [push],
  );

  const duplicateNotice = useCallback(
    (row: Notice) => {
      const id = `NTC-2${10 + rows.length}`;
      setRows((current) => [
        {
          ...row, id, title: `${row.title} (copy)`,
          status: 'Draft', pinned: false, reads: 0, readPct: 0, comments: [],
        },
        ...current,
      ]);
      push(`${id} created as a draft copy`);
    },
    [push, rows.length],
  );

  const archiveNotice = useCallback(
    (row: Notice) => {
      setRows((current) => current.map((entry) => (
        entry.id === row.id ? { ...entry, status: 'Archived', pinned: false } : entry
      )));
      push(`${row.id} archived`);
    },
    [push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${visible.length} notices exported as ${format.toUpperCase()}`);
    },
    [push, visible.length],
  );

  /* ---------------------------------- Card ---------------------------------- */

  const renderCard = (row: Notice) => (
    <article className={`nb-card ${cardToneOf(row)}${row.pinned ? ' is-featured' : ''}`} key={row.id}>
      {row.pinned ? (
        <span className="nb-pin" aria-hidden="true"><i className="ti ti-pinned-filled" /></span>
      ) : null}
      <div className="nb-card-main">
        <div className="nb-card-top">
          <span className={`${categoryBadge[row.category]} d-inline-flex align-items-center`}>
            <i className={`${categoryIcon[row.category]} me-1`} />{row.category}
          </span>
          <span className="nb-pri-dot">{row.priority}</span>
        </div>
        <h3 className="nb-title">
          <ActionLink onClick={() => setDetailRow(row)}>{row.title}</ActionLink>
        </h3>
        <p className="nb-desc">{row.desc}</p>
        <div className="nb-meta">
          <span className="nb-meta-i"><i className="ti ti-calendar-up" />{row.published}</span>
          <span className="nb-meta-i"><i className="ti ti-calendar-off" />Exp {row.expiry}</span>
          <span className="nb-meta-i"><i className="ti ti-users" />{row.audience}</span>
        </div>
        <div className="nb-pub">
          <span className="avatar avatar-sm">
            <ImageWithBasePath
              src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.publisher}
            />
          </span>
          <div>
            <span className="nb-pub-name d-block">{row.publisher}</span>
            <span className="nb-pub-role">{row.publisherRole}</span>
          </div>
        </div>
      </div>
      <div className="nb-foot">
        <div className="nb-foot-stats">
          <span className="nb-foot-stat" title="Attachments">
            <i className="ti ti-paperclip" />{row.attachments}
          </span>
          <span className="nb-foot-stat" title="Read count">
            <i className="ti ti-eye" />{row.reads.toLocaleString()}
          </span>
          {row.status !== 'Published' ? (
            <span className={statusBadge[row.status]}>{row.status}</span>
          ) : null}
        </div>
        {/* The template's seven-item overflow menu, flattened into the rail. */}
        <div className="nb-actions">
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title="View Notice" aria-label={`View ${row.id}`}
            onClick={() => setDetailRow(row)}
          >
            <i className="ti ti-eye" />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title="Edit Notice" aria-label={`Edit ${row.id}`}
            onClick={() => openModal(row, 'edit')}
          >
            <i className="ti ti-edit" />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title={row.pinned ? 'Unpin Notice' : 'Pin Notice'}
            aria-label={`${row.pinned ? 'Unpin' : 'Pin'} ${row.id}`}
            onClick={() => togglePin(row)}
          >
            <i className={row.pinned ? 'ti ti-pinned-off' : 'ti ti-pin'} />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title="Duplicate" aria-label={`Duplicate ${row.id}`}
            onClick={() => duplicateNotice(row)}
          >
            <i className="ti ti-copy" />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title="Share" aria-label={`Share ${row.id}`}
            onClick={() => openModal(row, 'share')}
          >
            <i className="ti ti-share" />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title="Send Notification" aria-label={`Notify for ${row.id}`}
            onClick={() => openModal(row, 'publish')}
          >
            <i className="ti ti-send" />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white"
            title="Archive" aria-label={`Archive ${row.id}`}
            disabled={row.status === 'Archived'}
            onClick={() => archiveNotice(row)}
          >
            <i className="ti ti-archive" />
          </button>
          <button
            type="button" className="btn btn-icon btn-sm btn-outline-light bg-white text-danger"
            title="Delete" aria-label={`Delete ${row.id}`}
            onClick={() => openModal(row, 'delete')}
          >
            <i className="ti ti-trash-x" />
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Notice Board"
            section="Announcement"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'create')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Create Notice
                  </ActionLink>
                </div>
              </>
            }
          />

          {/* Notice Board Workspace */}
          <div id="noticeWorkspace" className={loading ? 'is-loading' : ''}>
            <div className="card mb-3">
              <div className="data-workspace classes-workspace is-loaded" data-density="default">
                <WorkspaceHeader
                  searchPlaceholder="Search notices by title, category, publisher or audience…"
                  searchLabel="Search notices"
                  search={workspace.search}
                  onSearch={workspace.setSearch}
                  savedViews={savedViews}
                  view={workspace.view}
                  onView={workspace.setView}
                  onSaveView={() => push('Current view saved')}
                  filterFields={filterFields}
                  draft={workspace.draft}
                  onDraftField={workspace.setDraftField}
                  onApplyFilters={() => { workspace.applyFilters(); push('Filters applied'); }}
                  onResetFilters={() => { workspace.resetFilters(); push('Filters cleared'); }}
                  matchCount={visible.length}
                  totalCount={rows.length}
                  matchNoun="notices"
                  columnOptions={[]}
                  columns={workspace.columns}
                  onToggleColumn={workspace.toggleColumn}
                  onShowAllColumns={workspace.showAllColumns}
                  showColumns={false}
                  showDensity={false}
                  /* The template puts a grid/list switch where density lives. */
                  densitySlot={(
                    <div className="density-toggle" role="group" aria-label="View mode">
                      <button
                        type="button" className={layout === 'grid' ? 'active' : undefined}
                        title="Grid view" aria-label="Grid view"
                        aria-pressed={layout === 'grid'}
                        onClick={() => setLayout('grid')}
                      >
                        <i className="ti ti-layout-grid" />
                      </button>
                      <button
                        type="button" className={layout === 'list' ? 'active' : undefined}
                        title="List view" aria-label="List view"
                        aria-pressed={layout === 'list'}
                        onClick={() => setLayout('list')}
                      >
                        <i className="ti ti-list" />
                      </button>
                    </div>
                  )}
                  density={workspace.density}
                  onDensity={workspace.setDensity}
                  onRefresh={() => { setRows(initialRows); push('Notice board refreshed'); }}
                  toolbarExtra={(
                    <button
                      type="button" className="workspace-button workspace-button-icon"
                      title="Print" aria-label="Print notice board"
                      onClick={() => window.print()}
                    >
                      <i className="ti ti-printer" />
                    </button>
                  )}
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

            {loading ? (
              <div className="skeleton-loader">
                <div className="skeleton-grid">
                  {[0, 1, 2, 3, 4, 5].map((slot) => (
                    <div className="skeleton-card" key={slot}>
                      <div className="skeleton skeleton-line w-40" />
                      <div className="skeleton skeleton-line" />
                      <div className="skeleton skeleton-line w-70" />
                      <div className="skeleton skeleton-block" />
                      <div className="d-flex align-items-center gap-2">
                        <div className="skeleton skeleton-line w-40 mb-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="nb-live">
                <div className="nb-live-body">
                  {pinned.length > 0 ? (
                    <section className="nb-featured-sec" aria-label="Pinned notices">
                      <div className="nb-sec-head">
                        <span className="nb-sec-ic"><i className="ti ti-pinned" /></span>
                        <div>
                          <div className="nb-sec-title">Featured &amp; Pinned</div>
                          <div className="nb-sec-sub">Important announcements kept at the top</div>
                        </div>
                      </div>
                      <div className="nb-featured-grid">{pinned.map(renderCard)}</div>
                    </section>
                  ) : null}

                  {unpinned.length > 0 ? (
                    <section aria-label="All notices">
                      <div className="nb-sec-head">
                        <span className="nb-sec-ic"><i className="ti ti-clipboard-list" /></span>
                        <div>
                          <div className="nb-sec-title">All Notices</div>
                          <div className="nb-sec-sub">
                            <span>{rows.length}</span> announcements published
                          </div>
                        </div>
                      </div>
                      <div className={`nb-grid${layout === 'list' ? ' nb-grid-list' : ''}`}>
                        {unpinned.map(renderCard)}
                      </div>
                    </section>
                  ) : null}
                </div>

                {visible.length === 0 ? (
                  <div className="nb-empty">
                    <span className="nb-empty-ic mb-3"><i className="ti ti-clipboard-off" /></span>
                    <h4 className="mb-1 fs-16 fw-medium">No notices available</h4>
                    <p className="text-muted mb-3">
                      No announcements match your search or filters. Try clearing the filters or
                      publish a new notice.
                    </p>
                    <button
                      type="button" className="btn btn-primary"
                      onClick={() => openModal(null, 'create')}
                    >
                      <i className="ti ti-square-rounded-plus me-1" />Create Notice
                    </button>
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    {/* The template wires Load More to its own refresh action. */}
                    <ActionLink
                      className="btn btn-outline-light bg-white"
                      onClick={() => { setRows(initialRows); push('Notice board refreshed'); }}
                    >
                      <i className="ti ti-loader-3 me-2" />Load More
                    </ActionLink>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* /Notice Board Workspace */}

          {/* Notice detail */}
          <Offcanvas
            open={detailRow !== null}
            onClose={() => setDetailRow(null)}
            title={detailRow ? detailRow.title : 'Notice'}
            labelledById="nbdTitle"
            id="nb_detail"
            footer={detailRow ? (
              <>
                <button
                  type="button" className="btn btn-outline-light bg-white me-2"
                  onClick={() => { setDetailRow(null); openModal(detailRow, 'edit'); }}
                >
                  <i className="ti ti-edit me-1" />Edit
                </button>
                <button
                  type="button" className="btn btn-primary"
                  onClick={() => { setDetailRow(null); openModal(detailRow, 'publish'); }}
                >
                  <i className="ti ti-send me-1" />Send Notification
                </button>
              </>
            ) : undefined}
          >
            {detailRow ? (
              <>
                <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                  <span className={`${categoryBadge[detailRow.category]} d-inline-flex align-items-center`}>
                    <i className={`${categoryIcon[detailRow.category]} me-1`} />{detailRow.category}
                  </span>
                  <span className="nb-pri-dot">{detailRow.priority}</span>
                  <span className={statusBadge[detailRow.status]}>{detailRow.status}</span>
                </div>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="avatar avatar-sm">
                    <ImageWithBasePath
                      src={detailRow.avatar} className="rounded-circle" alt={detailRow.publisher}
                    />
                  </span>
                  <div>
                    <h6 className="fs-13 mb-0">{detailRow.publisher}</h6>
                    <span className="fs-12 text-muted">{detailRow.publisherRole}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Full Notice</h6>
                <p className="fs-13 text-muted mb-3">{detailRow.full}</p>

                <div className="border rounded p-3 mb-3">
                  {detailPairsOf(detailRow).map((pair, index, all) => (
                    <div
                      className={`d-flex align-items-center justify-content-between ${index === all.length - 1 ? 'mb-0' : 'mb-2'}`}
                      key={pair.label}
                    >
                      <span className="fs-13 text-muted">{pair.label}</span>
                      <span className="fs-13 fw-medium text-end">{pair.value}</span>
                    </div>
                  ))}
                </div>

                <h6 className="fs-14 mb-2">Read Statistics</h6>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-13 fw-medium">{detailRow.readPct}% read</span>
                  <span className="fs-12 text-muted">
                    {detailRow.reads.toLocaleString()} readers
                  </span>
                </div>
                <div className="nb-readbar mb-3">
                  <span className="nb-readbar-fill" style={{ width: readBarOf(detailRow) }} />
                </div>

                <h6 className="fs-14 mb-2">Attachments</h6>
                {detailRow.files.length === 0 ? (
                  <p className="fs-13 text-muted mb-3">No files attached to this notice.</p>
                ) : (
                  detailRow.files.map((file) => (
                    <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={file.name}>
                      <span className="avatar avatar-sm bg-danger-transparent text-danger rounded flex-shrink-0">
                        <i className={file.icon} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0 text-truncate">{file.name}</h6>
                        <span className="fs-12 text-muted text-truncate d-block">{file.meta}</span>
                      </div>
                      <ActionLink
                        className="dt-ib" ariaLabel={`Preview ${file.name}`}
                        onClick={() => { setModalFile(file); openModal(detailRow, 'attachment'); }}
                      >
                        <i className="ti ti-eye" />
                      </ActionLink>
                      <ActionLink
                        className="dt-ib" ariaLabel={`Download ${file.name}`}
                        onClick={() => push(`${file.name} downloaded`)}
                      >
                        <i className="ti ti-download" />
                      </ActionLink>
                    </div>
                  ))
                )}

                <h6 className="fs-14 mb-2 mt-3">Comments</h6>
                {detailRow.comments.length === 0 ? (
                  <p className="fs-13 text-muted mb-0">No comments on this notice yet.</p>
                ) : (
                  detailRow.comments.map((comment) => (
                    <div
                      className="d-flex align-items-start gap-2 border rounded p-2 mb-2"
                      key={`${comment.author}-${comment.at}`}
                    >
                      <span className="avatar avatar-sm rounded-circle flex-shrink-0">
                        <ImageWithBasePath
                          src={comment.avatar} className="rounded-circle" alt={comment.author}
                        />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <h6 className="fs-13 mb-0">
                          {comment.author}
                          <span className="fs-12 text-muted ms-2">{comment.at}</span>
                        </h6>
                        <p className="fs-13 text-muted mb-0">{comment.body}</p>
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

      <NoticeModals
        active={activeModal}
        row={modalRow}
        file={modalFile}
        onClose={() => setActiveModal(null)}
        onCreate={createNotice}
        onUpdate={updateNotice}
        onPublish={publishNotice}
        onShare={shareNotice}
        onDelete={deleteNotice}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default NoticeBoardPage;
