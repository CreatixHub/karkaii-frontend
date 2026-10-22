import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
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
import IssueModals from './modals/IssueModals';
import type { IssueDraft, IssueModalId, RenewDraft, ReturnDraft } from './modals/IssueModals';
import { daysOfPeriod } from './modals/IssueModals';
import type { BookIssue, IssueStatus } from './data/bookIssues.data';
import {
  addDays, attachmentsOf, bookByOption, bookInfoOf, bookOptions, bookIssues as initialRows,
  categoryOptions, classLabelOf, classOptions, dateKey, daysBetween, dueBadgeOf, dueDateOptions,
  fineBadgeOf, fineDetailsOf, fineLabelOf, isOpenLoan, issueDateOptions, librarianNoteOf, librarianOptions,
  memberByOption, memberLineOf, memberOptions, memberTypeBadge, memberTypeIcon, memberTypeOptions,
  parseDialogDate, renewalHistoryOf, reservationQueueOf, returnBadgeOf, returnLabelOf, searchIndexOf,
  sectionOptions, statusIcon, statusOptions, statusPill, TODAY,
} from './data/bookIssues.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'member-type', label: 'Member Type', kind: 'select', chipLabel: 'Member Type', options: memberTypeOptions },
  { id: 'student-staff', label: 'Student / Staff', kind: 'select', chipLabel: 'Member', options: memberOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'book-category', label: 'Book Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'book', label: 'Book', kind: 'select', chipLabel: 'Book', options: bookOptions },
  { id: 'issue-status', label: 'Issue Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'due-date', label: 'Due Date', kind: 'select', chipLabel: 'Due', allLabel: 'Any date', options: dueDateOptions },
  { id: 'issue-date', label: 'Issue Date', kind: 'select', chipLabel: 'Issued', allLabel: 'Any date', options: issueDateOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Member Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'book', label: 'Book Title', icon: 'ti ti-book' },
  { id: 'due', label: 'Due Date', icon: 'ti ti-calendar-due' },
  { id: 'fine', label: 'Fine Amount', icon: 'ti ti-cash' },
  { id: 'recent', label: 'Recently issued', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: IssueStatus; label: string; icon: string }[] = [
  { id: 'Issued', label: 'Issued', icon: 'ti ti-book' },
  { id: 'Due Soon', label: 'Due Soon', icon: 'ti ti-clock' },
  { id: 'Overdue', label: 'Overdue', icon: 'ti ti-alert-triangle' },
  { id: 'Returned', label: 'Returned', icon: 'ti ti-circle-check' },
  { id: 'Renewed', label: 'Renewed', icon: 'ti ti-refresh' },
];

const IssueBook = () => {
  const [rows, setRows] = useState<BookIssue[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<IssueModalId | null>(null);
  const [modalRow, setModalRow] = useState<BookIssue | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const navigate = useNavigate();
  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: BookIssue | null, modal: IssueModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  const goToMember = useCallback(() => navigate(routes.libraryMembers), [navigate]);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<BookIssue>[]>(
    () => [
      {
        id: 'member',
        label: 'Member',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink className="dt-avatar" ariaLabel={`Open ${row.member}'s profile`} onClick={goToMember}>
              <img src={row.photo} className="rounded-circle flex-shrink-0" alt={row.member} />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={goToMember}>{row.member}</ActionLink>
              <div className="dt-sub">
                <span className="link-primary dt-card">{row.card}</span>
                <span className="dt-dot">·</span>
                <span className="dt-mid">{row.memberId}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className={`${memberTypeBadge[row.memberType]} dt-mtype`}>
                  <i className={`${memberTypeIcon[row.memberType]} me-1`} />{row.memberType}
                </span>
                {classLabelOf(row) ? (
                  <>
                    {' '}
                    <span className="badge badge-soft-secondary">{classLabelOf(row)}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'book',
        label: 'Book',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`View ${row.title}`}
              onClick={() => openModal(row, 'details')}
            >
              <i className="ti ti-book fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name dt-book" onClick={() => openModal(row, 'details')}>
                {row.title}
              </ActionLink>
              <div className="dt-sub">
                <span className="dt-isbn">{row.isbn}</span>
                <span className="dt-dot">·</span>
                <span className="link-primary dt-bcode">{row.bookCode}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className="badge badge-soft-primary dt-category">{row.category}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'issue',
        label: 'Issue Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              <i className="ti ti-calendar-plus me-1" />Issued{' '}
              <span className="dt-issued fw-medium text-dark">{row.issuedOn}</span>
            </li>
            <li className="py-1">
              <span className={dueBadgeOf(row)}>
                <i className="ti ti-calendar-due me-1" />Due <span className="dt-due">{row.dueOn}</span>
              </span>{' '}
              <span className={returnBadgeOf(row)}>
                <i className="ti ti-calendar-check me-1" />Ret{' '}
                <span className="dt-return">{returnLabelOf(row)}</span>
              </span>
            </li>
            <li className="d-flex align-items-center gap-1 py-1 text-muted">
              <i className="ti ti-user-check me-1" />By{' '}
              <span className="fw-medium text-dark">{row.issuedBy}</span>{' '}
              <span className="badge badge-soft-info ms-1">
                <i className="ti ti-refresh me-1" />Renew <span className="dt-renew-val">{row.renewals}</span>
              </span>
            </li>
            <li className="py-1">
              <span className={fineBadgeOf(row)}>
                <i className="ti ti-cash me-1" />Fine <span className="dt-fine-val">{fineLabelOf(row)}</span>
              </span>
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
            {statusIcon[row.status]
              ? <i className={statusIcon[row.status] as string} />
              : <span className="dt-pill-dot" />}
            {row.status}
          </span>
        ),
      },
    ],
    [goToMember, openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<BookIssue>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['member-type'] && row.memberType !== filters['member-type']) return false;
      if (filters['student-staff'] && row.member !== filters['student-staff']) return false;
      if (filters.class && row.className !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters['book-category'] && row.category !== filters['book-category']) return false;
      if (filters.book && row.title !== filters.book) return false;
      if (filters['issue-status'] && row.status !== filters['issue-status']) return false;
      if (filters['due-date'] && row.dueOn !== filters['due-date']) return false;
      if (filters['issue-date'] && row.issuedOn !== filters['issue-date']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'book':
          return a.title.localeCompare(b.title) || a.member.localeCompare(b.member);
        // The Issue Details `<th>` sorts on the same key as the Due Date menu item.
        case 'due':
        case 'issue':
          return dateKey(a.dueOn) - dateKey(b.dueOn);
        case 'fine':
          return b.fine - a.fine || a.member.localeCompare(b.member);
        case 'recent':
          return dateKey(b.issuedOn) - dateKey(a.issuedOn);
        // Not in the sort menu, but the Status `<th>` is sortable in the template.
        case 'status':
          return a.status.localeCompare(b.status) || a.member.localeCompare(b.member);
        case 'name':
        case 'member':
        default:
          return a.member.localeCompare(b.member);
      }
    },
    // The template's sort menu opens with "Recently issued" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so returning a copy moves both rails at once. */
  const countBy = useCallback(
    (status: IssueStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Records', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** A fresh loan is Overdue, Due Soon or Issued purely by its own due date. */
  const statusForDue = (dueOn: string): IssueStatus => {
    const remaining = daysBetween(TODAY, dueOn);
    if (remaining < 0) return 'Overdue';
    return remaining <= 7 ? 'Due Soon' : 'Issued';
  };

  const createIssue = useCallback(
    (draft: IssueDraft) => {
      const member = memberByOption(draft.member);
      const book = bookByOption(draft.book);
      if (!member) {
        push('Select a member to issue to', 'warning');
        return;
      }
      if (!book) {
        push('Select a book to issue', 'warning');
        return;
      }
      const issuedOn = parseDialogDate(draft.issueDate);
      const dueOn = parseDialogDate(draft.dueDate);
      const baseId = `${member.card}-${book.bookCode}`;
      setRows((current) => {
        const id = current.some((row) => row.id === baseId)
          ? `${baseId}-${current.length + 1}`
          : baseId;
        return [
          {
            id,
            member: member.member,
            card: member.card,
            memberId: member.memberId,
            memberType: member.memberType,
            className: member.className,
            section: member.section,
            photo: member.photo,
            title: book.title,
            isbn: book.isbn,
            bookCode: book.bookCode,
            category: book.category,
            shelf: book.shelf,
            issuedOn,
            dueOn,
            returnedOn: null,
            issuedBy: librarianOptions[0],
            renewals: 0,
            fine: 0,
            status: statusForDue(dueOn),
          },
          ...current,
        ];
      });
      setActiveModal(null);
      push(`${book.title} issued to ${member.member}`);
    },
    [push],
  );

  /** Returning stamps the return date, closes the loan and settles the fine. */
  const returnIssue = useCallback(
    (draft: ReturnDraft) => {
      if (!modalRow) return;
      if (modalRow.status === 'Returned') {
        push(`${modalRow.title} is already back on the shelf`, 'warning');
        return;
      }
      const returnedOn = parseDialogDate(draft.returnDate);
      const lost = draft.condition === 'Lost';
      const waived = draft.fineStatus === 'Waived';
      const collected = draft.fineStatus === 'Collected';
      const entered = Math.max(0, Number(draft.fine) || 0);
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
              ...row,
              status: lost ? 'Lost' : 'Returned',
              // A copy reported lost never comes back, so it keeps no return date.
              returnedOn: lost ? null : returnedOn,
              fine: waived || collected ? 0 : entered,
            }
            : row,
        ),
      );
      setActiveModal(null);
      push(
        lost
          ? `${modalRow.title} marked lost on return`
          : `${modalRow.title} returned by ${modalRow.member}`,
      );
    },
    [modalRow, push],
  );

  /** Renewing pushes the due date out and counts one more extension. */
  const renewIssue = useCallback(
    (draft: RenewDraft) => {
      if (!modalRow) return;
      if (!isOpenLoan(modalRow)) {
        push(`${modalRow.title} is a closed loan and cannot be renewed`, 'warning');
        return;
      }
      const days = daysOfPeriod(draft.period);
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? { ...row, dueOn: addDays(row.dueOn, days), renewals: row.renewals + 1, status: 'Renewed' }
            : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.title} renewed to ${addDays(modalRow.dueOn, days)}`);
    },
    [modalRow, push],
  );

  /** Collecting clears the outstanding balance, which re-tints the Fine badge. */
  const collectFine = useCallback(() => {
    if (!modalRow) return;
    if (modalRow.fine === 0) {
      push('There is no fine to collect on this record', 'warning');
      return;
    }
    setRows((current) =>
      current.map((row) => (row.id === modalRow.id ? { ...row, fine: 0 } : row)),
    );
    setActiveModal(null);
    push(`$${modalRow.fine} collected from ${modalRow.member}`);
  }, [modalRow, push]);

  const setStatus = useCallback(
    (ids: string[], status: IssueStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'record' : 'records'} ${verb}`);
    },
    [push, workspace],
  );

  /** Bulk return closes every open loan in the selection. */
  const returnSelected = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) =>
          ids.includes(row.id) && isOpenLoan(row)
            ? { ...row, status: 'Returned', returnedOn: TODAY, fine: 0 }
            : row,
        ),
      );
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'copy' : 'copies'} returned`);
    },
    [push, workspace],
  );

  /** Bulk renew extends every open loan by the default fortnight. */
  const renewSelected = useCallback(
    (ids: string[]) => {
      setRows((current) =>
        current.map((row) =>
          ids.includes(row.id) && isOpenLoan(row)
            ? { ...row, dueOn: addDays(row.dueOn, 14), renewals: row.renewals + 1, status: 'Renewed' }
            : row,
        ),
      );
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'loan' : 'loans'} renewed by 14 days`);
    },
    [push, workspace],
  );

  const removeIssues = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'record' : 'records'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} records exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'return', label: 'Return Books', icon: 'ti ti-book-upload', onClick: returnSelected },
      { id: 'renew', label: 'Renew Books', icon: 'ti ti-refresh', onClick: renewSelected },
      {
        id: 'reminders', label: 'Send Reminders', icon: 'ti ti-bell',
        onClick: (ids) => push(`${ids.length} due reminders sent`),
      },
      {
        id: 'slips', label: 'Print Issue Slips', icon: 'ti ti-printer',
        onClick: (ids) => push(`${ids.length} issue slips queued`),
      },
      {
        id: 'export', label: 'Export Selected', icon: 'ti ti-file-export',
        onClick: (ids) => push(`${ids.length} records exported`),
      },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [push, renewSelected, returnSelected],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: BookIssue) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Issue" ariaLabel="View Issue" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Return Book" ariaLabel="Return Book" onClick={() => openModal(row, 'return')}>
        <i className="ti ti-book-upload" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Renew Book" ariaLabel="Renew Book" onClick={() => openModal(row, 'renew')}>
        <i className="ti ti-refresh" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Book Details" ariaLabel="Book Details" onClick={() => openModal(row, 'details')}>
        <i className="ti ti-book" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Issue Slip" ariaLabel="Print Issue Slip" onClick={() => openModal(row, 'slip')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Issue Another Book" ariaLabel="Issue Another Book" onClick={() => openModal(row, 'issue')}>
        <i className="ti ti-book-plus" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Book Availability" ariaLabel="Book Availability"
        onClick={() => openModal(row, 'availability')}
      >
        <i className="ti ti-checkup-list" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Borrowing History" ariaLabel="Borrowing History"
        onClick={() => push(`${row.member} has ${rows.filter((entry) => entry.card === row.card).length} record(s) on file`)}
      >
        <i className="ti ti-history" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Member Profile" ariaLabel="Member Profile" onClick={goToMember}>
        <i className="ti ti-user" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Send Due Reminder" ariaLabel="Send Due Reminder"
        onClick={() => push(`Due reminder sent to ${row.member}`)}
      >
        <i className="ti ti-bell" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Calculate Fine" ariaLabel="Calculate Fine" onClick={() => openModal(row, 'fine')}>
        <i className="ti ti-calculator" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Mark Lost" ariaLabel="Mark Lost"
        onClick={() => setStatus([row.id], 'Lost', 'marked lost')}
      >
        <i className="ti ti-alert-octagon" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Export" ariaLabel="Export"
        onClick={() => push(`${row.member}'s record exported`)}
      >
        <i className="ti ti-file-export" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: BookIssue) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-user" />Member Information</h4>
          <ul className="list-unstyled fs-12 text-muted mb-3">
            <li className="py-1">
              <span className="text-dark fw-medium">{row.member}</span> · {row.memberType}
            </li>
            <li className="py-1">{memberLineOf(row)}</li>
          </ul>
          <h5 className="details-heading fs-15"><i className="ti ti-book" />Book Information</h5>
          <p className="fs-12 text-muted mb-0">{bookInfoOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-history" />Issue History</h6>
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Issued</span><span className="fw-medium">{row.issuedOn}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Due</span><span className="fw-medium">{row.dueOn}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Returned</span>
              <span className="fw-medium">{returnLabelOf(row)}</span>
            </li>
          </ul>
          <h6 className="details-heading"><i className="ti ti-refresh" />Renewal History</h6>
          <p className="fs-12 text-muted mb-0">{renewalHistoryOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-cash" />Fine Details</h6>
          <p className="fs-12 text-muted mb-3">{fineDetailsOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-bookmark" />Reservation Queue</h6>
          <p className="fs-12 text-muted mb-0">{reservationQueueOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-notes" />Librarian Notes</h6>
          <p className="fs-12 text-muted mb-2">{librarianNoteOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
          <div className="d-flex flex-wrap gap-1 mb-3">
            {attachmentsOf(row).map((file) => (
              <span className={file.badge} key={file.label}>
                <i className={`${file.icon} me-1`} />{file.label}
              </span>
            ))}
          </div>
          <div className="d-flex gap-2">
            <ActionLink
              className="btn btn-outline-light bg-white btn-sm flex-fill"
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-eye me-1" />View
            </ActionLink>
            <ActionLink
              className="btn btn-primary btn-sm flex-fill"
              onClick={() => openModal(row, 'return')}
            >
              <i className="ti ti-book-upload me-1" />Return
            </ActionLink>
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
            title="Issue Book"
            section="Library"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Records
                  </ActionLink>
                </div>
                <ExportMenu label="Export Records" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => push(`${workspace.visible.length} issue slips queued`)}
                  >
                    <i className="ti ti-printer me-2" />Print Issue Slip
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'issue')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Issue Book
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
            workspaceId="clsWorkspace"
            searchPlaceholder="Search members, card no, book or ISBN…"
            searchLabel="Search issue records"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Issue records refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Issue Slip"
                aria-label="Print Issue Slip"
                onClick={() => push(`${workspace.visible.length} issue slips queued`)}
              >
                <i className="ti ti-printer" />
              </button>
            }
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-book-off"
            emptyTitle="No issue records match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Book issue records with member, book and issue details"
            selectAllLabel="Select all records"
            rowLabel={(row) => `Select ${row.member}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <IssueModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onIssue={createIssue}
        onReturn={returnIssue}
        onRenew={renewIssue}
        onCollectFine={collectFine}
        onDelete={removeIssues}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onPrintSlip={() => {
          setActiveModal(null);
          push(modalRow ? `Issue slip queued for ${modalRow.member}` : 'Issue slip queued');
        }}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default IssueBook;
