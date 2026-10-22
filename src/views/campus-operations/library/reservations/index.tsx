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
import ReservationModals from './modals/ReservationModals';
import type {
  ApproveResult,
  CancelResult,
  PickupResult,
  ReadyResult,
  ReservationDraft,
  ReservationModalId,
} from './modals/ReservationModals';
import type { FeedItem, Reservation } from './data/reservations.data';
import {
  SELECT_BOOK, SELECT_MEMBER, TODAY, UNASSIGNED, addDaysInput, bookChoices, booksHeldLabel, categoryOptions,
  currentlyIssued, dateKey, daysLeft, deadlineNote, deadlineOptions, expanderAction, expiringToday,
  fromInputDate, isOpen, librarianLabel, librarianOptions, matchesDeadline, memberChoices,
  memberTypeBadge, memberTypeOptions, onHold, photoOf, pickupInfo, queueBand, queueEntryMeta,
  queueEntryPanelMeta, queueNote, queueOptions, remainingLabel, reservations as initialRows,
  searchIndexOf, spanDays, splitLibrarian, statusBadge, statusIcon, statusOptions, statusPill,
  statusShort,
} from './data/reservations.data';

const routes = all_routes;

/**
 * Ids match the template's own. Member Type and the reserved-on range open
 * already committed, which is what puts the two chips on the rail at load.
 */
const filterFields: FilterField[] = [
  {
    id: 'reservation-status', label: 'Reservation Status', kind: 'select', chipLabel: 'Status',
    options: statusOptions,
  },
  {
    id: 'book-category', label: 'Book Category', kind: 'select', chipLabel: 'Category',
    options: categoryOptions,
  },
  {
    id: 'member-type', label: 'Member Type', kind: 'select', chipLabel: 'Member Type',
    options: memberTypeOptions, initialValue: 'Student',
  },
  {
    id: 'assigned-librarian', label: 'Assigned Librarian', kind: 'select', chipLabel: 'Librarian',
    options: librarianOptions,
  },
  {
    id: 'queue-position', label: 'Queue Position', kind: 'select', chipLabel: 'Queue',
    options: queueOptions,
  },
  {
    id: 'pickup-deadline', label: 'Pickup Deadline', kind: 'select', chipLabel: 'Deadline',
    options: deadlineOptions,
  },
  {
    id: 'reserved-from', label: 'Reserved From', kind: 'date', chipLabel: 'Reserved from',
    placeholder: '01-07-2026', initialValue: '01-07-2026',
  },
  {
    id: 'reserved-to', label: 'Reserved To', kind: 'date', chipLabel: 'Reserved to',
    placeholder: '31-07-2026', initialValue: '31-07-2026',
  },
];

const sortOptions: SortOption[] = [
  { id: 'deadline', label: 'Pickup deadline (soonest)', icon: 'ti ti-calendar-due' },
  { id: 'reserved', label: 'Reserved on (newest)', icon: 'ti ti-clock' },
  { id: 'queue', label: 'Queue position', icon: 'ti ti-users' },
  { id: 'title', label: 'Book title (A–Z)', icon: 'ti ti-abc' },
  { id: 'status', label: 'Reservation status', icon: 'ti ti-checks' },
];

/** Sort order for the "Reservation status" comparator. */
const statusRank = new Map<string, number>(
  statusOptions.map((status, index) => [status, index] as [string, number]),
);

/** Appends one card to a timeline or notification rail, when there is one. */
const withFeed = (feed: FeedItem[], item: FeedItem | null): FeedItem[] =>
  (item ? [...feed, item] : feed);

const Reservations = () => {
  const [rows, setRows] = useState<Reservation[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ReservationModalId | null>(null);
  const [modalRow, setModalRow] = useState<Reservation | null>(null);
  const [panelRow, setPanelRow] = useState<Reservation | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Reservation | null, modal: ReservationModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Reservation>[]>(
    () => [
      {
        id: 'id',
        label: 'Reservation ID',
        sortable: true,
        render: (row) => (
          <ActionLink className="fw-medium" onClick={() => openModal(row, 'view')}>{row.id}</ActionLink>
        ),
      },
      {
        id: 'book',
        label: 'Book Title',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span
              className={`avatar avatar-sm bg-${row.bookTint}-transparent text-${row.bookTint} rounded me-2 flex-shrink-0`}
            >
              <i className="ti ti-book" />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.book}</ActionLink>
              <div className="dt-sub">
                {row.author}<span className="dt-dot">•</span>{row.category}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'member',
        label: 'Member',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className="dt-avatar">
              <img src={photoOf(row.member)} alt={row.member} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => setPanelRow(row)}>{row.member}</ActionLink>
              <div className="dt-sub">{row.memberMeta}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'memberType',
        label: 'Member Type',
        render: (row) => <span className={memberTypeBadge[row.memberType]}>{row.memberType}</span>,
      },
      {
        id: 'reservedOn',
        label: 'Reserved On',
        sortable: true,
        cellClassName: 'fs-13',
        render: (row) => row.reservedOn,
      },
      {
        id: 'deadline',
        label: 'Pickup Deadline',
        sortable: true,
        render: (row) => {
          const note = deadlineNote(row);
          return (
            <>
              <span className={`d-block fs-13${row.pickupDeadline ? '' : ' text-muted'}`}>
                {row.pickupDeadline ?? '—'}
              </span>
              <span className={`fs-12 text-${note.tone}`}>{note.text}</span>
            </>
          );
        },
      },
      {
        id: 'queue',
        label: 'Queue Position',
        sortable: true,
        render: (row) => (
          <>
            {row.queuePosition === null ? (
              <span className="d-block fs-13 text-muted">—</span>
            ) : (
              <span className="badge badge-soft-warning">#{row.queuePosition}</span>
            )}
            <span className="d-block fs-12 text-muted">{queueNote(row)}</span>
          </>
        ),
      },
      {
        id: 'status',
        label: 'Reservation Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            {statusIcon[row.status]
              ? <i className={statusIcon[row.status] as string} />
              : <span className="dt-pill-dot" />}
            {row.status}
          </span>
        ),
      },
      {
        id: 'librarian',
        label: 'Assigned Librarian',
        render: (row) => (
          <>
            <span className={`d-block fs-13${row.librarian ? ' fw-medium' : ' text-muted'}`}>
              {row.librarian ?? '—'}
            </span>
            <span className="fs-12 text-muted">{row.librarianRole}</span>
          </>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Reservation>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['reservation-status'] && row.status !== filters['reservation-status']) return false;
      if (filters['book-category'] && row.category !== filters['book-category']) return false;
      if (filters['member-type'] && row.memberType !== filters['member-type']) return false;
      if (filters['assigned-librarian'] && librarianLabel(row) !== filters['assigned-librarian']) return false;
      if (filters['queue-position'] && queueBand(row) !== filters['queue-position']) return false;
      if (filters['pickup-deadline'] && !matchesDeadline(row, filters['pickup-deadline'])) return false;
      if (filters['reserved-from'] && dateKey(row.reservedOn) < dateKey(fromInputDate(filters['reserved-from']))) {
        return false;
      }
      if (filters['reserved-to'] && dateKey(row.reservedOn) > dateKey(fromInputDate(filters['reserved-to']))) {
        return false;
      }
      return true;
    },
    quickMatch: (row, quick) => {
      switch (quick) {
        case null: return true;
        case 'ready': return row.status === 'Ready for Pickup';
        case 'approval': return row.status === 'Pending Approval';
        case 'waiting': return row.status === 'Waiting';
        case 'expiring': return expiringToday(row);
        case 'cancelled': return row.status === 'Cancelled';
        default: return true;
      }
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'ready': return row.status === 'Ready for Pickup';
        case 'approval': return row.status === 'Pending Approval';
        case 'waiting': return row.status === 'Waiting';
        case 'expiring': return expiringToday(row);
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'reserved':
          return dateKey(b.reservedOn) - dateKey(a.reservedOn) || a.book.localeCompare(b.book);
        case 'queue': {
          const left = a.queuePosition ?? Number.MAX_SAFE_INTEGER;
          const right = b.queuePosition ?? Number.MAX_SAFE_INTEGER;
          return left - right || a.book.localeCompare(b.book);
        }
        case 'title':
          return a.book.localeCompare(b.book);
        case 'status':
          return (statusRank.get(a.status) ?? 0) - (statusRank.get(b.status) ?? 0)
            || a.book.localeCompare(b.book);
        case 'deadline':
        default: {
          // A reservation with no deadline yet has nothing to fall due, so it
          // sorts behind everything that does.
          const left = a.pickupDeadline ? dateKey(a.pickupDeadline) : Number.MAX_SAFE_INTEGER;
          const right = b.pickupDeadline ? dateKey(b.pickupDeadline) : Number.MAX_SAFE_INTEGER;
          return left - right || a.book.localeCompare(b.book);
        }
      }
    },
    defaultSort: 'deadline',
    // The template renders the Ready for Pickup quick filter already active.
    defaultQuick: 'ready',
    pageSize: 8,
  });

  /* ---------------------------------- Rails --------------------------------- */

  const counts = useMemo(
    () => ({
      open: rows.filter(isOpen).length,
      titles: new Set(rows.filter(isOpen).map((row) => row.accession)).size,
      ready: rows.filter((row) => row.status === 'Ready for Pickup').length,
      approval: rows.filter((row) => row.status === 'Pending Approval').length,
      waiting: rows.filter((row) => row.status === 'Waiting').length,
      expiring: rows.filter(expiringToday).length,
      expired: rows.filter((row) => row.status === 'Expired').length,
      cancelled: rows.filter((row) => row.status === 'Cancelled').length,
    }),
    [rows],
  );

  /** The five tiles the template prints above the grid, counted off the roster. */
  const summary = useMemo<SummaryItem[]>(
    () => [
      {
        id: 'active', tint: 'primary', icon: 'ti ti-bookmark', label: 'Active Reservations',
        value: String(counts.open), hint: `across ${counts.titles} titles`,
      },
      {
        id: 'ready', tint: 'success', icon: 'ti ti-checks', label: 'Ready for Pickup',
        value: String(counts.ready), hint: 'collect within 48h',
      },
      {
        id: 'approval', tint: 'warning', icon: 'ti ti-clock', label: 'Pending Approval',
        value: String(counts.approval), hint: 'staff review needed',
      },
      {
        id: 'expired', tint: 'danger', icon: 'ti ti-alert-triangle', label: 'Expired',
        value: String(counts.expired), hint: 'not collected in time',
      },
      {
        id: 'cancelled', tint: 'secondary', icon: 'ti ti-circle-x', label: 'Cancelled',
        value: String(counts.cancelled), hint: 'this month',
      },
    ],
    [counts],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Reservations', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'ready', label: 'Ready for Pickup', icon: 'ti ti-checks', count: counts.ready },
      { id: 'approval', label: 'Awaiting Approval', icon: 'ti ti-clock', count: counts.approval },
      { id: 'waiting', label: 'On Waiting List', icon: 'ti ti-users', count: counts.waiting },
      { id: 'expiring', label: 'Expiring Today', icon: 'ti ti-alert-triangle', count: counts.expiring },
    ],
    [counts, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'ready', label: 'Ready for Pickup', icon: 'ti ti-checks', count: counts.ready },
      { id: 'approval', label: 'Pending Approval', icon: 'ti ti-clock', count: counts.approval },
      { id: 'waiting', label: 'Waiting List', icon: 'ti ti-users', count: counts.waiting },
      { id: 'expiring', label: 'Expiring Today', icon: 'ti ti-alert-triangle', count: counts.expiring },
      { id: 'cancelled', label: 'Cancelled', icon: 'ti ti-circle-x', count: counts.cancelled },
    ],
    [counts],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** Applies a change to the row a dialog opened on, and to the open panel. */
  const patchRow = useCallback(
    (id: string, patch: (row: Reservation) => Reservation) => {
      setRows((current) => current.map((row) => (row.id === id ? patch(row) : row)));
      setPanelRow((current) => (current && current.id === id ? patch(current) : current));
    },
    [],
  );

  /** Drops whoever is first in line and moves everyone behind them up one. */
  const advanceQueue = useCallback(
    (row: Reservation): Reservation['waitingList'] =>
      row.waitingList
        .filter((entry) => entry.position !== 1)
        .map((entry) => ({
          ...entry,
          position: entry.position === null ? null : entry.position - 1,
        })),
    [],
  );

  const createReservation = useCallback(
    (draft: ReservationDraft) => {
      const book = bookChoices.find((choice) => choice.label === draft.book);
      const member = memberChoices.find((choice) => choice.label === draft.member);
      if (!book || draft.book === SELECT_BOOK) {
        push('Choose a book to reserve', 'warning');
        return;
      }
      if (!member || draft.member === SELECT_MEMBER) {
        push('Choose the member the hold is for', 'warning');
        return;
      }

      const reservedOn = fromInputDate(draft.reservedOn);
      const librarian = splitLibrarian(draft.librarian);
      // A title with copies on the shelf goes for staff approval; one with none
      // joins the queue behind everyone already waiting for it.
      const waitingHere = rows.filter(
        (row) => row.accession === book.accession && row.status === 'Waiting',
      ).length;
      const queued = book.availableNow === 0;
      const number = rows.reduce(
        (highest, row) => Math.max(highest, Number(row.id.split('-')[2] ?? 0)),
        0,
      ) + 1;

      const created: Reservation = {
        id: `RSV-2026-${String(number).padStart(4, '0')}`,
        book: book.title, author: book.author, category: book.category,
        categoryCode: book.categoryCode, accession: book.accession, bookTint: book.tint,
        shelf: book.shelf, totalCopies: book.totalCopies, availableNow: book.availableNow,
        nextReturnDue: '—',
        member: member.name, memberMeta: member.meta, memberId: member.memberId,
        memberType: draft.memberType, booksHeld: member.booksHeld,
        booksAllowed: member.booksAllowed, overdueItems: member.overdueItems,
        contact: member.contact,
        reservedOn, pickupDeadline: null,
        status: queued ? 'Waiting' : 'Pending Approval',
        queuePosition: queued ? waitingHere + 1 : null,
        librarian: librarian.name, librarianRole: librarian.role,
        approvedBy: null, allocatedOn: null,
        pickupPoint: draft.pickupPoint,
        availableFrom: queued ? 'Awaiting return' : 'On approval',
        deadlineTime: queued ? 'Set on allocation' : 'Set on approval',
        holdDuration: draft.holdDuration,
        collectedOn: null, issuedUntil: null, holdShelf: '—',
        waitingList: [],
        waitingNote: queued ? 'No waiting list — copies are available.' : 'No waiting list for this title.',
        timeline: [{ title: 'Reservation placed', meta: `${reservedOn} · Library desk` }],
        notifications: draft.notifyOnAvailable
          ? [{ title: 'Reservation confirmed email', meta: reservedOn }]
          : [],
        notes: draft.notes.trim() || 'Placed at the library desk. No staff notes recorded.',
      };

      setRows((current) => [created, ...current]);
      setActiveModal(null);
      push(`${book.title} reserved for ${member.name}`);
    },
    [push, rows],
  );

  const approveReservation = useCallback(
    (result: ApproveResult) => {
      if (!modalRow) return;
      const approver = splitLibrarian(result.approvedBy);
      const approvedOn = fromInputDate(result.approvalDate);
      const queued = result.placement === 'Add to waiting list';
      const waitingHere = rows.filter(
        (row) => row.accession === modalRow.accession && row.status === 'Waiting' && row.id !== modalRow.id,
      ).length;
      // The hold clock starts on the approval date and runs for the chosen span.
      const deadline = fromInputDate(
        addDaysInput(result.approvalDate, spanDays(result.holdDuration)),
      );

      patchRow(modalRow.id, (row) => ({
        ...row,
        status: queued ? 'Waiting' : 'Ready for Pickup',
        queuePosition: queued ? waitingHere + 1 : null,
        approvedBy: approver.name,
        librarian: approver.name,
        librarianRole: approver.role,
        allocatedOn: queued ? null : approvedOn,
        pickupDeadline: queued ? null : deadline,
        availableFrom: queued ? 'Awaiting return' : approvedOn,
        deadlineTime: queued ? 'Set on allocation' : `${deadline} · 04:00 PM`,
        holdDuration: result.holdDuration,
        timeline: withFeed(row.timeline, {
          title: 'Approved by librarian',
          meta: `${approvedOn} · ${approver.name ?? UNASSIGNED}${result.override ? ' · limit overridden' : ''}`,
        }),
        notifications: withFeed(
          row.notifications,
          result.notify ? { title: 'Reservation approved email', meta: approvedOn } : null,
        ),
      }));
      setActiveModal(null);
      push(`${modalRow.id} approved${queued ? ' and queued' : ' and allocated'}`);
    },
    [modalRow, patchRow, push, rows],
  );

  const markReady = useCallback(
    (result: ReadyResult) => {
      if (!modalRow) return;
      const availableFrom = fromInputDate(result.availableFrom);
      const deadline = fromInputDate(result.deadline);
      const shelf = result.shelfNote.trim() || '—';

      patchRow(modalRow.id, (row) => ({
        ...row,
        status: 'Ready for Pickup',
        queuePosition: null,
        accession: result.copy,
        pickupPoint: result.pickupPoint,
        availableFrom,
        allocatedOn: availableFrom,
        pickupDeadline: deadline,
        deadlineTime: `${deadline} · 04:00 PM`,
        holdShelf: shelf,
        timeline: withFeed(row.timeline, {
          title: 'Copy allocated and held',
          meta: `${availableFrom} · ${result.copy}${shelf === '—' ? '' : ` · ${shelf}`}`,
        }),
        notifications: [
          ...row.notifications,
          ...(result.email
            ? [{ title: 'Ready-for-pickup email sent', meta: availableFrom }]
            : []),
          ...(result.sms
            ? [{ title: 'SMS reminder scheduled', meta: `24 hours before ${deadline}` }]
            : []),
        ],
      }));
      setActiveModal(null);
      push(`${modalRow.book} held for ${modalRow.member} until ${deadline}`);
    },
    [modalRow, patchRow, push],
  );

  const completePickup = useCallback(
    (result: PickupResult) => {
      if (!modalRow) return;
      const collected = fromInputDate(result.collectedOn);
      const due = fromInputDate(result.dueDate);
      const issuer = splitLibrarian(result.issuedBy);

      patchRow(modalRow.id, (row) => ({
        ...row,
        status: 'Completed',
        queuePosition: null,
        librarian: issuer.name,
        librarianRole: issuer.role,
        booksHeld: Math.min(row.booksAllowed, row.booksHeld + 1),
        collectedOn: collected,
        issuedUntil: due,
        holdShelf: '—',
        waitingList: result.advanceQueue ? advanceQueue(row) : row.waitingList,
        timeline: withFeed(row.timeline, {
          title: 'Collected and issued',
          meta: `${collected} · due ${due} · ${result.condition}`,
        }),
        notifications: withFeed(
          row.notifications,
          result.createIssue ? { title: 'Issue confirmation sent', meta: collected } : null,
        ),
      }));
      setActiveModal(null);
      push(`${modalRow.book} issued to ${modalRow.member}, due ${due}`);
    },
    [advanceQueue, modalRow, patchRow, push],
  );

  const cancelReservation = useCallback(
    (result: CancelResult) => {
      if (!modalRow) return;
      const canceller = splitLibrarian(result.cancelledBy);

      patchRow(modalRow.id, (row) => ({
        ...row,
        status: 'Cancelled',
        queuePosition: null,
        pickupDeadline: null,
        pickupPoint: '—',
        availableFrom: '—',
        deadlineTime: '—',
        holdDuration: '—',
        holdShelf: '—',
        waitingList: result.release ? advanceQueue(row) : row.waitingList,
        timeline: withFeed(row.timeline, {
          title: `Cancelled — ${result.reason.toLowerCase()}`,
          meta: `${TODAY} · ${canceller.name ?? result.cancelledBy}`,
        }),
        notifications: withFeed(
          row.notifications,
          result.notify ? { title: 'Cancellation confirmation sent', meta: TODAY } : null,
        ),
      }));
      setActiveModal(null);
      push(`${modalRow.id} cancelled`, 'danger');
    },
    [advanceQueue, modalRow, patchRow, push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} reservations exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Reservation) => (
    <div className="dt-actions">
      <ActionLink
        className="dt-ib" title="View reservation" ariaLabel="View reservation"
        onClick={() => openModal(row, 'view')}
      >
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink
        className="dt-ib success" title="Mark ready for pickup" ariaLabel="Mark ready for pickup"
        onClick={() => openModal(row, 'ready')}
      >
        <i className="ti ti-checks" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Complete pickup" ariaLabel="Complete pickup"
        onClick={() => openModal(row, 'complete')}
      >
        <i className="ti ti-circle-check" />
      </ActionLink>
      <ActionLink
        className="dt-ib danger" title="Cancel reservation" ariaLabel="Cancel reservation"
        onClick={() => openModal(row, 'cancel')}
      >
        <i className="ti ti-circle-x" />
      </ActionLink>
    </div>
  );

  const pairList = (pairs: { label: string; value: string }[]) => (
    <>
      {pairs.map((pair, index) => (
        <div
          className={`d-flex align-items-center justify-content-between ${index === pairs.length - 1 ? 'mb-0' : 'mb-2'}`}
          key={pair.label}
        >
          <span className="fs-13 text-muted">{pair.label}</span>
          <span className="fs-13 fw-medium text-end">{pair.value}</span>
        </div>
      ))}
    </>
  );

  const feedList = (items: FeedItem[], tint: string, icon: string) => (
    <>
      {items.map((item) => (
        <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={`${item.title}-${item.meta}`}>
          <span className={`avatar avatar-sm bg-${tint}-transparent text-${tint} rounded flex-shrink-0`}>
            <i className={icon} />
          </span>
          <div className="flex-fill overflow-hidden">
            <h6 className="fs-13 mb-0 text-truncate">{item.title}</h6>
            <span className="fs-12 text-muted text-truncate d-block">{item.meta}</span>
          </div>
        </div>
      ))}
    </>
  );

  const renderDetail = (row: Reservation) => {
    const action = expanderAction(row);
    return (
      <div className="row g-4">
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-book text-primary me-1" />Book Information</h6>
          {pairList([
            { label: 'Accession No', value: row.accession },
            { label: 'Category', value: `${row.category} · ${row.categoryCode}` },
            { label: 'Shelf', value: row.shelf },
            { label: 'Total Copies', value: String(row.totalCopies) },
            { label: 'Available Now', value: String(row.availableNow) },
          ])}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-user text-success me-1" />Member Details</h6>
          {pairList([
            { label: 'Member ID', value: row.memberId },
            { label: 'Member Type', value: row.memberType },
            { label: 'Books Held', value: booksHeldLabel(row) },
            { label: 'Overdue Items', value: String(row.overdueItems) },
            { label: 'Contact', value: row.contact },
          ])}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-map-pin text-warning me-1" />Pickup Information</h6>
          {pairList(pickupInfo(row))}
        </div>
        <div className="col-12 col-xl-3 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-users text-purple me-1" />Waiting List</h6>
          {row.waitingList.length === 0 ? (
            <p className="fs-13 text-muted mb-0">{row.waitingNote}</p>
          ) : (
            row.waitingList.map((entry) => (
              <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={entry.name}>
                <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                  <i className="ti ti-users" />
                </span>
                <div className="flex-fill overflow-hidden">
                  <h6 className="fs-13 mb-0 text-truncate">{entry.name}</h6>
                  <span className="fs-12 text-muted text-truncate d-block">{queueEntryMeta(entry)}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="col-12 col-xl-4 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-history text-info me-1" />Reservation Timeline</h6>
          {feedList(row.timeline, 'info', 'ti ti-history')}
        </div>
        <div className="col-12 col-xl-4 col-md-6">
          <h6 className="fs-14 mb-3"><i className="ti ti-mail text-success me-1" />Notification History</h6>
          {row.notifications.length === 0 ? (
            <p className="fs-13 text-muted mb-0">No notifications sent yet.</p>
          ) : (
            feedList(row.notifications, 'success', 'ti ti-mail')
          )}
        </div>
        <div className="col-12 col-xl-4">
          <h6 className="fs-14 mb-3"><i className="ti ti-note text-secondary me-1" />Internal Notes</h6>
          <p className="fs-13 text-muted mb-3">{row.notes}</p>
          <div className="d-flex align-items-center flex-wrap gap-2">
            {action === 'complete' ? (
              <>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'complete')}>
                  <i className="ti ti-circle-check me-1" />Complete Pickup
                </button>
                <button
                  type="button" className="btn btn-outline-light bg-white btn-sm text-danger"
                  onClick={() => openModal(row, 'cancel')}
                >
                  <i className="ti ti-circle-x me-1" />Cancel
                </button>
              </>
            ) : null}
            {action === 'approve' ? (
              <>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'approve')}>
                  <i className="ti ti-thumb-up me-1" />Approve
                </button>
                <button
                  type="button" className="btn btn-outline-light bg-white btn-sm text-danger"
                  onClick={() => openModal(row, 'cancel')}
                >
                  <i className="ti ti-circle-x me-1" />Cancel
                </button>
              </>
            ) : null}
            {action === 'view' ? (
              <button
                type="button" className="btn btn-outline-light bg-white btn-sm"
                onClick={() => openModal(row, 'view')}
              >
                <i className="ti ti-eye me-1" />View Reservation
              </button>
            ) : null}
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm"
              onClick={() => setPanelRow(row)}
            >
              <i className="ti ti-bookmark me-1" />Reservation Panel
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* -------------------------------- Offcanvas ------------------------------- */

  /** The panel's queue: this reservation first, then everyone behind it. */
  const panelQueue = (row: Reservation) => [
    {
      name: row.member,
      meta: row.allocatedOn ? `Allocated · ${row.allocatedOn}` : `Reserved ${row.reservedOn}`,
      badge: row.queuePosition === null ? statusShort[row.status] : `Position ${row.queuePosition}`,
      tint: row.status === 'Ready for Pickup' ? 'success' : 'warning',
    },
    ...row.waitingList
      .filter((entry) => entry.name !== row.member)
      .map((entry) => ({
        name: entry.name,
        meta: queueEntryPanelMeta(entry),
        badge: entry.position === null ? 'Waiting' : `Position ${entry.position}`,
        tint: 'warning',
      })),
  ];

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Library Reservations"
            section="Library"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <ExportMenu printLabel="Print" onExport={exportAs} />
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Reservation
                  </ActionLink>
                </div>
              </>
            }
          />

          <WorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            summary={summary}
            footerVariant="card-foot"
            workspaceId="lrsWorkspace"
            searchPlaceholder="Search book title or member…"
            searchLabel="Search reservations"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="reservations"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Reservations refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-bookmark-off"
            emptyTitle="No reservations match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Reservation Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Reservation Details"
            labelledById="rv_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Reservation Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg rounded flex-shrink-0">
                    <img src={photoOf(panelRow.member)} className="rounded" alt={panelRow.member} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.member}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.id} · {panelRow.memberId} · {panelRow.memberMeta.split(' · ')[0]}
                    </span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>
                    {statusShort[panelRow.status]}
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span
                    className={`avatar avatar-sm bg-${panelRow.bookTint}-transparent text-${panelRow.bookTint} rounded flex-shrink-0`}
                  >
                    <i className="ti ti-book" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0 text-truncate">{panelRow.book}</h6>
                    <span className="fs-12 text-muted text-truncate d-block">
                      {panelRow.author} · {panelRow.category} · {panelRow.accession}
                    </span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Book Availability</h6>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Total Copies</span>
                      <h5 className="mb-0">{panelRow.totalCopies}</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Available</span>
                      <h5 className="mb-0 text-success">{panelRow.availableNow}</h5>
                    </div>
                  </div>
                </div>
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Currently Issued</span>
                    <span className="fs-13 fw-medium">{currentlyIssued(panelRow)}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">On Hold</span>
                    <span className="fs-13 fw-medium">{onHold(panelRow)}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fs-13 text-muted">Shelf</span>
                    <span className="badge badge-soft-secondary">
                      <i className="ti ti-map-pin me-1" />{panelRow.shelf}
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-0">
                    <span className="fs-13 text-muted">Next Return Due</span>
                    <span className="fs-13 fw-medium">{panelRow.nextReturnDue}</span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Reservation Queue</h6>
                {panelQueue(panelRow).map((entry, index, list) => (
                  <div
                    className={`d-flex align-items-center gap-2 border rounded p-2 ${index === list.length - 1 ? 'mb-3' : 'mb-2'}`}
                    key={entry.name}
                  >
                    <span className="avatar avatar-sm rounded flex-shrink-0">
                      <img src={photoOf(entry.name)} className="rounded" alt={entry.name} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <h6 className="fs-13 mb-0 text-truncate">{entry.name}</h6>
                      <span className="fs-12 text-muted">{entry.meta}</span>
                    </div>
                    <span className={`badge badge-soft-${entry.tint}`}>{entry.badge}</span>
                  </div>
                ))}

                <h6 className="fs-14 mb-2">Pickup Details</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Pickup Point', value: panelRow.pickupPoint },
                    { label: 'Hold Shelf', value: panelRow.holdShelf },
                    { label: 'Available From', value: panelRow.availableFrom },
                    { label: 'Assigned Librarian', value: librarianLabel(panelRow) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Expiry Information</h6>
                <div className="d-flex align-items-center gap-2 border rounded p-2 mb-3">
                  <span className="avatar avatar-sm bg-warning-transparent text-warning rounded flex-shrink-0">
                    <i className="ti ti-clock" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <h6 className="fs-13 mb-0">
                      {daysLeft(panelRow) === null
                        ? 'No pickup deadline set'
                        : `Expires ${panelRow.deadlineTime}`}
                    </h6>
                    <span className="fs-12 text-muted">
                      {remainingLabel(panelRow)} · {panelRow.holdDuration} hold
                    </span>
                  </div>
                </div>

                <h6 className="fs-14 mb-2">Audit Information</h6>
                {feedList(panelRow.timeline, 'info', 'ti ti-history')}

                <div className="d-flex gap-2 mt-3">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'complete'); }}
                  >
                    <i className="ti ti-circle-check me-1" />Complete Pickup
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white text-danger"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'cancel'); }}
                  >
                    <i className="ti ti-circle-x me-1" />Cancel
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Reservation Details Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ReservationModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createReservation}
        onApprove={approveReservation}
        onMarkReady={markReady}
        onCompletePickup={completePickup}
        onCancel={cancelReservation}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="lrsToasts" />
    </>
  );
};

export default Reservations;
