import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import {
  ActionLink,
  CardWorkspaceShell,
  ExportMenu,
  PageHeader,
  useWorkspace,
} from '@components/workspace';
import type {
  BulkAction,
  ColumnDef,
  ExportFormat,
  FilterField,
  QuickFilter,
  SavedView,
  SortOption,
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import MemberModals from './modals/MemberModals';
import type {
  IssuePayload,
  MemberDraft,
  MemberModalId,
  RenewPayload,
  ReturnPayload,
} from './modals/MemberModals';
import type { Member, MemberStatus } from './data/libraryMembers.data';
import {
  academicIcon, academicLabel, academicSummary, academicTerm, activityOf, attachmentsOf,
  borrowingOptions, borrowingStatusOf, classOptions, currentBorrowedOf, dateKey, expiryAfter,
  expiryTint, fineDetailOf, fineTint, libraryCardOptions, libraryMembers as initialRows,
  memberTypeOptions, notesOf, overdueTint, registrationDateOptions, reservationsOf, searchIndexOf,
  sectionOptions, statusIcon, statusOptions, statusPill, typeBadge, typeIcon,
} from './data/libraryMembers.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'member-type', label: 'Member Type', kind: 'select', chipLabel: 'Type', options: memberTypeOptions },
  { id: 'library-card', label: 'Library Card', kind: 'select', chipLabel: 'Card', options: libraryCardOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'membership-status', label: 'Membership Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'book-borrowing-status', label: 'Book Borrowing Status', kind: 'select', chipLabel: 'Borrowing', options: borrowingOptions },
  { id: 'registration-date', label: 'Registration Date', kind: 'select', chipLabel: 'Reg', allLabel: 'Any date', options: registrationDateOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Member Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'issued', label: 'Books Issued', icon: 'ti ti-book' },
  { id: 'fine', label: 'Outstanding Fine', icon: 'ti ti-cash' },
  { id: 'registered', label: 'Registration Date', icon: 'ti ti-calendar' },
  { id: 'recent', label: 'Recently updated', icon: 'ti ti-clock' },
];

/** The saved-view rail; the quick rail adds Inactive to the same four. */
const rails: { id: MemberStatus; label: string; icon: string }[] = [
  { id: 'Active', label: 'Active', icon: 'ti ti-circle-check' },
  { id: 'Expired', label: 'Expired', icon: 'ti ti-calendar-x' },
  { id: 'Suspended', label: 'Suspended', icon: 'ti ti-player-pause' },
  { id: 'Blocked', label: 'Blocked', icon: 'ti ti-ban' },
];

const LibraryMembers = () => {
  const [rows, setRows] = useState<Member[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<MemberModalId | null>(null);
  const [modalRow, setModalRow] = useState<Member | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const navigate = useNavigate();
  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Member | null, modal: MemberModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        id: 'member',
        label: 'Member',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar"
              ariaLabel={`View ${row.name}`}
              onClick={() => openModal(row, 'view')}
            >
              <ImageWithBasePath src={row.avatar} className="rounded-circle flex-shrink-0" alt={row.name} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-card">{row.card}</span>
                <span className="dt-dot">·</span>
                <span className="dt-mid">{row.memberId}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`${typeBadge[row.type]} dt-mtype`}>
                  <i className={`${typeIcon[row.type]} me-1`} />{row.type}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'academic',
        label: 'Academic Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              <i className={`${academicIcon(row)} me-1`} />{academicTerm(row)}{' '}
              <span className="fw-medium text-dark">{academicLabel(row)}</span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-plus me-1" />Registered{' '}
              <span className="dt-reg fw-medium text-dark">{row.registered}</span>
            </li>
            <li className="py-1">
              <span className={expiryTint(row)}>
                <i className="ti ti-calendar-due me-1" />Expires <span className="dt-expiry">{row.expires}</span>
              </span>
            </li>
          </ul>
        ),
      },
      {
        id: 'library',
        label: 'Library Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className="badge badge-soft-primary">
                <i className="ti ti-book me-1" />Issued <span className="dt-issued-val">{row.issued}</span>
              </span>{' '}
              <span className="badge badge-soft-success">
                <i className="ti ti-book-upload me-1" />Returned {row.returned}
              </span>
            </li>
            <li className="d-flex flex-wrap gap-1 py-1">
              <span className={overdueTint(row)}>
                <i className="ti ti-clock-exclamation me-1" />Overdue{' '}
                <span className="dt-overdue-val">{row.overdue}</span>
              </span>{' '}
              <span className={fineTint(row)}>
                <i className="ti ti-cash me-1" />Fine <span className="dt-fine-val">${row.fine}</span>
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-clock me-1" />Last visit{' '}
              <span className="fw-medium text-dark">{row.lastVisit}</span>
            </li>
          </ul>
        ),
      },
      {
        id: 'status',
        label: 'Status',
        sortable: true,
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            {statusIcon[row.status] ? <i className={statusIcon[row.status] as string} /> : <span className="dt-pill-dot" />}
            {row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Member>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['member-type'] && row.type !== filters['member-type']) return false;
      if (filters['library-card'] && row.card !== filters['library-card']) return false;
      if (filters.class && row.classLevel !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters['membership-status'] && row.status !== filters['membership-status']) return false;
      if (filters['book-borrowing-status'] && borrowingStatusOf(row) !== filters['book-borrowing-status']) return false;
      if (filters['registration-date'] && row.registered !== filters['registration-date']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'issued':
        case 'library':
          return b.issued - a.issued || a.name.localeCompare(b.name);
        case 'fine':
          return b.fine - a.fine || a.name.localeCompare(b.name);
        case 'registered':
          return dateKey(a.registered) - dateKey(b.registered) || a.name.localeCompare(b.name);
        case 'recent':
          return dateKey(b.lastVisit) - dateKey(a.lastVisit) || a.name.localeCompare(b.name);
        // Not in the sort menu, but these `<th>`s are sortable in the template.
        case 'academic':
          return academicLabel(a).localeCompare(academicLabel(b)) || a.name.localeCompare(b.name);
        case 'status':
          return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
        case 'name':
        case 'member':
        default:
          return a.name.localeCompare(b.name);
      }
    },
    // The template's sort menu opens with "Recently updated" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so a renewal moves both rails at once. */
  const countBy = useCallback(
    (status: MemberStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Members', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      ...rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
      { id: 'Inactive', label: 'Inactive', icon: 'ti ti-circle-off', count: countBy('Inactive') },
    ],
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** The Issue / Return selects hand back "Name — LIB-0012". */
  const cardOf = (option: string): string => option.split('—').pop()?.trim() ?? '';

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const createMember = useCallback(
    (draft: MemberDraft) => {
      if (!draft.name.trim()) {
        push('Give the member a name', 'warning');
        return;
      }
      const card = draft.card.trim() || `LIB-${1000 + rows.length + 1}`;
      const isStudent = draft.type === 'Student';
      setRows((current) => [
        {
          id: card,
          card,
          name: draft.name.trim(),
          avatar: 'assets/img/profiles/avatar-27.jpg',
          memberId: draft.memberId.trim() || '—',
          type: draft.type,
          classLevel: isStudent ? draft.classLevel : undefined,
          section: isStudent ? draft.section : undefined,
          department: isStudent ? undefined : draft.department,
          registered: draft.dateOfJoin.trim() || '—',
          expires: draft.expires.trim() || '—',
          issued: 0,
          returned: 0,
          overdue: 0,
          fine: 0,
          lastVisit: draft.dateOfJoin.trim() || '—',
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added to the library roster`);
    },
    [push, rows.length],
  );

  const updateMember = useCallback(
    (draft: MemberDraft) => {
      if (!modalRow) return;
      const isStudent = draft.type === 'Student';
      setRows((current) =>
        current.map((row) =>
          row.id !== modalRow.id
            ? row
            : {
              ...row,
              name: draft.name.trim() || row.name,
              card: draft.card.trim() || row.card,
              memberId: draft.memberId.trim() || row.memberId,
              type: draft.type,
              classLevel: isStudent ? draft.classLevel : undefined,
              section: isStudent ? draft.section : undefined,
              department: isStudent ? undefined : draft.department,
              registered: draft.dateOfJoin.trim() || row.registered,
              expires: draft.expires.trim() || row.expires,
              status: draft.status,
            }),
      );
      setActiveModal(null);
      push(`${modalRow.name} updated`);
    },
    [modalRow, push],
  );

  /** Issuing moves one more title onto the member's card. */
  const issueBook = useCallback(
    ({ member, book }: IssuePayload) => {
      const card = cardOf(member);
      const target = rows.find((row) => row.card === card);
      if (!target) {
        push('Select a member to issue to', 'warning');
        return;
      }
      if (!book) {
        push('Select a book to issue', 'warning');
        return;
      }
      if (target.status !== 'Active') {
        push(`${target.name}'s membership is ${target.status.toLowerCase()} — no books can be issued`, 'warning');
        return;
      }
      setRows((current) =>
        current.map((row) => (row.card === card ? { ...row, issued: row.issued + 1 } : row)),
      );
      setActiveModal(null);
      push(`${book} issued to ${target.name}`);
    },
    [push, rows],
  );

  /**
   * Returning moves the title back: one off the issued count, one onto the
   * returned count, one off the overdue count where there was one, and the fine
   * collected at the desk comes off the outstanding balance.
   */
  const returnBook = useCallback(
    ({ member, book, fine }: ReturnPayload) => {
      const card = cardOf(member);
      const target = rows.find((row) => row.card === card);
      if (!target) {
        push('Select a member to return for', 'warning');
        return;
      }
      if (!book) {
        push('Select the issued book', 'warning');
        return;
      }
      if (target.issued === 0) {
        push(`${target.name} has no books on loan`, 'warning');
        return;
      }
      const collected = toNumber(fine, 0);
      setRows((current) =>
        current.map((row) =>
          row.card !== card
            ? row
            : {
              ...row,
              issued: row.issued - 1,
              returned: row.returned + 1,
              overdue: Math.max(0, row.overdue - 1),
              fine: Math.max(0, row.fine - collected),
            }),
      );
      setActiveModal(null);
      push(
        collected > 0
          ? `${book} returned by ${target.name} · $${collected} fine collected`
          : `${book} returned by ${target.name}`,
      );
    },
    [push, rows],
  );

  /** Renewing pushes the expiry out and puts the membership back in good standing. */
  const renewMembership = useCallback(
    ({ period, expires }: RenewPayload) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id ? { ...row, expires, status: 'Active' } : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.name} renewed for ${period.toLowerCase()} — expires ${expires}`);
    },
    [modalRow, push],
  );

  /**
   * Collecting clears the balance. A blocked member comes back with it, which is
   * exactly what the template's own note promises: "clear fines to reactivate".
   */
  const collectFine = useCallback(() => {
    if (!modalRow) return;
    setRows((current) =>
      current.map((row) =>
        row.id === modalRow.id
          ? { ...row, fine: 0, status: row.status === 'Blocked' ? 'Active' : row.status }
          : row,
      ),
    );
    setActiveModal(null);
    push(`$${modalRow.fine} collected from ${modalRow.name}`);
  }, [modalRow, push]);

  const setStatus = useCallback(
    (ids: string[], status: MemberStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'member' : 'members'} ${verb}`);
    },
    [push, workspace],
  );

  /** The bulk rail renews every selected card by a year in one pass. */
  const renewMany = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) =>
          ids.includes(row.id)
            ? { ...row, expires: expiryAfter(row.expires, '1 Year'), status: 'Active' }
            : row,
        ),
      );
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'membership' : 'memberships'} renewed for one year`);
    },
    [push, workspace],
  );

  const removeMembers = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'member' : 'members'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} members exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'issue', label: 'Issue Books', icon: 'ti ti-book', onClick: () => openModal(null, 'issue') },
      { id: 'renew', label: 'Renew Membership', icon: 'ti ti-refresh', onClick: renewMany },
      { id: 'cards', label: 'Print Library Cards', icon: 'ti ti-id-badge-2', onClick: (ids) => push(`${ids.length} library cards queued`) },
      { id: 'notify', label: 'Send Notifications', icon: 'ti ti-bell', onClick: (ids) => push(`${ids.length} notifications sent`) },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} members exported`) },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, renewMany],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Member) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Member" ariaLabel="View Member" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Member" ariaLabel="Edit Member" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Issue Book" ariaLabel="Issue Book" onClick={() => openModal(row, 'issue')}>
        <i className="ti ti-book" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Return Book" ariaLabel="Return Book" onClick={() => openModal(row, 'return')}>
        <i className="ti ti-book-upload" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Borrowing History" ariaLabel="Borrowing History"
        onClick={() => navigate(routes.libraryIssueBook)}
      >
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Outstanding Fines" ariaLabel="Outstanding Fines" onClick={() => openModal(row, 'fines')}>
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Renew Membership" ariaLabel="Renew Membership" onClick={() => openModal(row, 'renew')}>
        <i className="ti ti-refresh" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Library Card" ariaLabel="Print Library Card" onClick={() => openModal(row, 'card')}>
        <i className="ti ti-id-badge-2" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Send Reminder" ariaLabel="Send Reminder"
        onClick={() => push(`Reminder sent to ${row.name}`)}
      >
        <i className="ti ti-bell" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Export Profile" ariaLabel="Export Profile"
        onClick={() => push(`${row.name}'s profile exported`)}
      >
        <i className="ti ti-file-export" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Suspend Membership" ariaLabel="Suspend Membership"
        onClick={() => setStatus([row.id], 'Suspended', 'suspended')}
      >
        <i className="ti ti-player-pause" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Member) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-user" />Member Profile</h4>
          <ul className="list-unstyled fs-12 text-muted mb-3">
            <li className="py-1"><span className="text-dark fw-medium">{row.name}</span> · {row.type}</li>
            <li className="py-1">Card {row.card} · ID {row.memberId}</li>
            <li className="py-1">{academicSummary(row)} · Registered {row.registered}</li>
          </ul>
          <h5 className="details-heading fs-15"><i className="ti ti-book" />Current Borrowed Books</h5>
          <p className="fs-12 text-muted mb-0">{currentBorrowedOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-history" />Borrowing History</h6>
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Total Returned</span><span className="fw-medium">{row.returned}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Currently Issued</span><span className="fw-medium">{row.issued}</span>
            </li>
          </ul>
          <h6 className="details-heading"><i className="ti ti-bookmark" />Reservation History</h6>
          <p className="fs-12 text-muted mb-0">{reservationsOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-cash" />Fine Details</h6>
          <p className="fs-12 text-muted mb-3">{fineDetailOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-activity" />Recent Library Activity</h6>
          <p className="fs-12 text-muted mb-0">{activityOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-notes" />Notes</h6>
          <p className="fs-12 text-muted mb-2">{notesOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {attachmentsOf(row).map((file) => (
              <span key={file.label} className={file.badge}>
                <i className={`${file.icon} me-1`} />{file.label}
              </span>
            ))}
          </div>
          <div className="d-flex gap-2">
            <button
              type="button" className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />View
            </button>
            <button
              type="button" className="btn btn-primary btn-sm flex-fill"
              onClick={() => openModal(row, 'issue')}
            >
              <i className="ti ti-book me-1" />Issue
            </button>
          </div>
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
            title="Library Members"
            section="Library"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Members
                  </ActionLink>
                </div>
                <ExportMenu label="Export Members" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => push(`${workspace.visible.length} library cards queued`)}
                  >
                    <i className="ti ti-id-badge-2 me-2" />Print Library Cards
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Member
                  </ActionLink>
                </div>
              </>
            }
          />

          <CardWorkspaceShell
            workspace={workspace}
            columns={columns}
            getId={(row) => row.id}
            totalCount={rows.length}
            loading={loading}
            workspaceId="classWorkspace"
            searchPlaceholder="Search members, card no, ID or type…"
            searchLabel="Search members"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="members"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Members refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Library Cards"
                aria-label="Print Library Cards"
                onClick={() => push(`${workspace.visible.length} library cards queued`)}
              >
                <i className="ti ti-id-badge-2" />
              </button>
            }
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-users-group"
            emptyTitle="No members match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Library members with academic and library details and membership status"
            selectAllLabel="Select all members"
            rowLabel={(row) => `Select ${row.name}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <MemberModals
        active={activeModal}
        row={modalRow}
        members={rows}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onCreate={createMember}
        onUpdate={updateMember}
        onIssue={issueBook}
        onReturn={returnBook}
        onRenew={renewMembership}
        onCollectFine={collectFine}
        onDelete={removeMembers}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default LibraryMembers;
