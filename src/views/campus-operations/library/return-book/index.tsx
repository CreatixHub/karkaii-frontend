import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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
import ReturnModals from './modals/ReturnModals';
import type {
  DamageDraft, InspectDraft, LostDraft, ReturnDraft, ReturnModalId,
} from './modals/ReturnModals';
import type { BookReturn, ReturnStatus, Settlement } from './data/bookReturns.data';
import {
  attachmentsOf, bookInfoOf, bookOptions, bookReturns as initialRows, categoryOptions,
  classBadgeOf, classOptions, conditionBadge, dateKey, dueTint, fineDueOf, fineOf,
  fineSentenceOf, fineStatusOf, fineStatusOptions, fineTint, fromInputDate, historyOf,
  memberBadge, memberNameOptions, memberTypeOptions, memberLineOf, notesOf, overdueFineOf,
  returnDateOptions, returnTint, searchIndexOf, sectionOptions, statusAfterReturn, statusIcon,
  statusOptions, statusPill, TODAY,
} from './data/bookReturns.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'member-type', label: 'Member Type', kind: 'select', chipLabel: 'Type', options: memberTypeOptions },
  { id: 'student-staff', label: 'Student / Staff', kind: 'select', chipLabel: 'Member', options: memberNameOptions },
  { id: 'class', label: 'Class', kind: 'select', chipLabel: 'Class', options: classOptions },
  { id: 'section', label: 'Section', kind: 'select', chipLabel: 'Section', options: sectionOptions },
  { id: 'book-category', label: 'Book Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'book', label: 'Book', kind: 'select', chipLabel: 'Book', options: bookOptions },
  { id: 'return-status', label: 'Return Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'fine-status', label: 'Fine Status', kind: 'select', chipLabel: 'Fine', options: fineStatusOptions },
  { id: 'return-date', label: 'Return Date', kind: 'select', chipLabel: 'Return', allLabel: 'Any date', options: returnDateOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Member Name (A–Z)', icon: 'ti ti-abc' },
  { id: 'book', label: 'Book Title', icon: 'ti ti-book' },
  { id: 'returned', label: 'Return Date', icon: 'ti ti-calendar-check' },
  { id: 'fine', label: 'Fine Amount', icon: 'ti ti-cash' },
  { id: 'recent', label: 'Recently returned', icon: 'ti ti-clock' },
];

/** The saved-view rail; the quick rail is the same set minus "All Records". */
const rails: { id: ReturnStatus; label: string; quickLabel: string; icon: string }[] = [
  { id: 'Returned', label: 'Returned', quickLabel: 'Returned', icon: 'ti ti-circle-check' },
  { id: 'Pending Return', label: 'Pending Return', quickLabel: 'Pending', icon: 'ti ti-clock' },
  { id: 'Overdue', label: 'Overdue', quickLabel: 'Overdue', icon: 'ti ti-alert-triangle' },
  { id: 'Late Return', label: 'Late Return', quickLabel: 'Late', icon: 'ti ti-clock-exclamation' },
  { id: 'Damaged', label: 'Damaged', quickLabel: 'Damaged', icon: 'ti ti-tool' },
];

const toNumber = (value: string, fallback: number): number => {
  const parsed = Number(value.replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
};

const ReturnBook = () => {
  const [rows, setRows] = useState<BookReturn[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<ReturnModalId | null>(null);
  const [modalRow, setModalRow] = useState<BookReturn | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: BookReturn | null, modal: ReturnModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<BookReturn>[]>(
    () => [
      {
        id: 'member',
        label: 'Member',
        sortable: true,
        render: (row) => {
          const badge = memberBadge[row.memberType];
          const classBadge = classBadgeOf(row);
          return (
            <div className="dt-user">
              <Link to={routes.libraryMembers} className="dt-avatar">
                <ImageWithBasePath
                  src={row.avatar}
                  className="rounded-circle flex-shrink-0"
                  alt={row.member}
                />
              </Link>
              <div>
                <Link to={routes.libraryMembers} className="dt-name">{row.member}</Link>
                <div className="dt-sub">
                  <span className="link-primary dt-card">{row.card}</span>
                  <span className="dt-dot">·</span>
                  <span className="dt-mid">{row.memberId}</span>
                </div>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  <span className={badge.className}>
                    <i className={`${badge.icon} me-1`} />{row.memberType}
                  </span>{' '}
                  {classBadge ? <span className="badge badge-soft-secondary">{classBadge}</span> : null}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        id: 'book',
        label: 'Book',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`Book details for ${row.bookTitle}`}
              onClick={() => openModal(row, 'book')}
            >
              <i className="ti ti-book fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name dt-book" onClick={() => openModal(row, 'book')}>
                {row.bookTitle}
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
        id: 'return',
        label: 'Return Details',
        sortable: true,
        render: (row) => {
          const condition = conditionBadge[row.condition];
          return (
            <ul className="list-unstyled mb-0 fs-12">
              <li className="py-1 text-muted">
                <i className="ti ti-calendar-plus me-1" />
                Issued <span className="dt-issued fw-medium text-dark">{row.issuedOn}</span>{' '}
                <span className={`badge badge-soft-${dueTint(row)} ms-1`}>
                  <i className="ti ti-calendar-due me-1" />Due <span className="dt-due">{row.dueOn}</span>
                </span>
              </li>
              <li className="py-1">
                <span className={`badge badge-soft-${returnTint(row)}`}>
                  <i className="ti ti-calendar-check me-1" />
                  Returned <span className="dt-return">{row.returnDate ?? '—'}</span>
                </span>{' '}
                <span className="text-muted ms-1">
                  <i className="ti ti-user-check me-1" />
                  To <span className="fw-medium text-dark dt-to">{row.receivedBy ?? '—'}</span>
                </span>
              </li>
              <li className="d-flex flex-wrap gap-1 py-1">
                <span className={`badge badge-soft-${fineTint(row)}`}>
                  <i className="ti ti-cash me-1" />
                  Fine <span className="dt-fine-val">${fineDueOf(row)}</span>
                </span>{' '}
                <span className={condition.className}>
                  <i className={`${condition.icon} me-1`} />
                  <span className="dt-condition">{condition.label}</span>
                </span>
              </li>
            </ul>
          );
        },
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
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<BookReturn>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters['member-type'] && row.memberType !== filters['member-type']) return false;
      if (filters['student-staff'] && row.member !== filters['student-staff']) return false;
      if (filters.class && row.classLabel !== filters.class) return false;
      if (filters.section && row.section !== filters.section) return false;
      if (filters['book-category'] && row.category !== filters['book-category']) return false;
      if (filters.book && row.bookTitle !== filters.book) return false;
      if (filters['return-status'] && row.status !== filters['return-status']) return false;
      if (filters['fine-status'] && fineStatusOf(row) !== filters['fine-status']) return false;
      if (filters['return-date'] && row.returnDate !== filters['return-date']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'book':
          return a.bookTitle.localeCompare(b.bookTitle) || a.member.localeCompare(b.member);
        // Ascending by return date, with the copies still out at the bottom.
        case 'returned':
        case 'return':
          return (dateKey(a.returnDate) || Infinity) - (dateKey(b.returnDate) || Infinity)
            || a.member.localeCompare(b.member);
        case 'fine':
          return fineOf(b) - fineOf(a) || a.member.localeCompare(b.member);
        case 'recent':
          return dateKey(b.returnDate) - dateKey(a.returnDate) || a.member.localeCompare(b.member);
        // Not in the sort menu, but the Status `<th>` is sortable in the template.
        case 'status':
          return a.status.localeCompare(b.status) || a.member.localeCompare(b.member);
        case 'name':
        case 'member':
        default:
          return a.member.localeCompare(b.member);
      }
    },
    // The template's sort menu opens with "Recently returned" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so processing a return moves both rails at once. */
  const countBy = useCallback(
    (status: ReturnStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Records', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({
        id: rail.id, label: rail.label, icon: rail.icon, count: countBy(rail.id),
      })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => rails.map((rail) => ({
      id: rail.id, label: rail.quickLabel, icon: rail.icon, count: countBy(rail.id),
    })),
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  /** Every dialog writes through here, so one rule keeps the record consistent. */
  const patchRow = useCallback(
    (id: string, patch: (row: BookReturn) => BookReturn) => {
      setRows((current) => current.map((row) => (row.id === id ? patch(row) : row)));
    },
    [],
  );

  const processReturn = useCallback(
    (draft: ReturnDraft) => {
      // Opened from the header the dialog has no row, so the member select is
      // the only thing identifying the record.
      const target = modalRow
        ?? rows.find((row) => `${row.member} — ${row.card}` === draft.member)
        ?? null;
      if (!target) {
        push('Select a member to process a return for', 'warning');
        return;
      }
      const returnDate = fromInputDate(draft.returnDate) ?? TODAY;
      const status = statusAfterReturn(draft.condition, target.dueOn, returnDate);
      patchRow(target.id, (row) => {
        const settled: BookReturn = {
          ...row,
          returnDate,
          receivedBy: draft.receivedBy,
          condition: draft.condition,
          replacementCharge: draft.condition === 'Lost' ? (row.replacementCharge || 45) : 0,
          repairFee: 0,
          settlement: 'Unpaid',
          status,
        };
        // Anything charged above the automatic penalty is a repair fee, so the
        // grid's own arithmetic still adds up to the figure entered here.
        const entered = toNumber(draft.fine, overdueFineOf(settled));
        return { ...settled, repairFee: Math.max(0, entered - overdueFineOf(settled)) };
      });
      setActiveModal(null);
      push(`${target.bookTitle} returned by ${target.member}`);
    },
    [modalRow, patchRow, push, rows],
  );

  const collectFine = useCallback(
    (amount: string, method: string) => {
      if (!modalRow) return;
      if (fineDueOf(modalRow) === 0) {
        push(`${modalRow.member} has no fine outstanding`, 'warning');
        return;
      }
      patchRow(modalRow.id, (row) => ({ ...row, settlement: 'Collected' }));
      setActiveModal(null);
      push(`$${toNumber(amount, fineDueOf(modalRow))} collected from ${modalRow.member} by ${method}`);
    },
    [modalRow, patchRow, push],
  );

  const saveInspection = useCallback(
    (draft: InspectDraft) => {
      if (!modalRow) return;
      patchRow(modalRow.id, (row) => ({
        ...row,
        condition: draft.condition,
        repairFee: toNumber(draft.repairFee, row.repairFee),
        status: draft.condition === 'Damaged'
          ? 'Damaged'
          : row.returnDate
            ? statusAfterReturn(draft.condition, row.dueOn, row.returnDate)
            : row.status,
      }));
      setActiveModal(null);
      push(`${modalRow.bookTitle} inspected — condition ${draft.condition}`);
    },
    [modalRow, patchRow, push],
  );

  const saveAssessment = useCallback(
    (draft: DamageDraft) => {
      if (!modalRow) return;
      patchRow(modalRow.id, (row) => ({
        ...row,
        condition: 'Damaged',
        repairFee: toNumber(draft.charge, 15),
        replacementCharge: 0,
        settlement: 'Unpaid',
        status: 'Damaged',
      }));
      setActiveModal(null);
      push(`${modalRow.bookTitle} marked damaged — ${draft.severity.toLowerCase()} ${draft.damageType.toLowerCase()}`);
    },
    [modalRow, patchRow, push],
  );

  const reportLost = useCallback(
    (draft: LostDraft) => {
      if (!modalRow) return;
      patchRow(modalRow.id, (row) => ({
        ...row,
        replacementCharge: toNumber(draft.charge, 45),
        repairFee: 0,
        settlement: 'Unpaid',
        status: 'Lost',
      }));
      setActiveModal(null);
      push(`${modalRow.bookTitle} reported lost — $${toNumber(draft.charge, 45)} replacement charge`, 'danger');
    },
    [modalRow, patchRow, push],
  );

  const settleFines = useCallback(
    (ids: string[], settlement: Settlement, verb: string) => {
      setRows((current) =>
        current.map((row) => (ids.includes(row.id) ? { ...row, settlement } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'fine' : 'fines'} ${verb}`);
    },
    [push, workspace],
  );

  const removeRecords = useCallback(() => {
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
      {
        id: 'process', label: 'Process Returns', icon: 'ti ti-book-upload',
        onClick: () => openModal(null, 'process'),
      },
      {
        id: 'collect', label: 'Collect Fines', icon: 'ti ti-cash',
        onClick: (ids) => settleFines(ids, 'Collected', 'collected'),
      },
      {
        id: 'waive', label: 'Waive Fines', icon: 'ti ti-shield-check',
        onClick: (ids) => settleFines(ids, 'Waived', 'waived'),
      },
      {
        id: 'receipts', label: 'Print Return Receipts', icon: 'ti ti-printer',
        onClick: (ids) => push(`${ids.length} return receipts queued`),
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
    [openModal, push, settleFines],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: BookReturn) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Return" ariaLabel="View Return" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Process Return" ariaLabel="Process Return" onClick={() => openModal(row, 'process')}>
        <i className="ti ti-book-upload" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Collect Fine" ariaLabel="Collect Fine" onClick={() => openModal(row, 'fine')}>
        <i className="ti ti-cash" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Inspect Book" ariaLabel="Inspect Book" onClick={() => openModal(row, 'inspect')}>
        <i className="ti ti-zoom-check" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Return Receipt" ariaLabel="Print Return Receipt" onClick={() => openModal(row, 'receipt')}>
        <i className="ti ti-printer" />
      </ActionLink>
      <Link className="dt-ib" to={routes.libraryIssueBook} title="Return History" aria-label="Return History">
        <i className="ti ti-history" />
      </Link>
      <Link className="dt-ib" to={routes.libraryMembers} title="Member Profile" aria-label="Member Profile">
        <i className="ti ti-user" />
      </Link>
      <ActionLink className="dt-ib" title="Book Details" ariaLabel="Book Details" onClick={() => openModal(row, 'book')}>
        <i className="ti ti-book" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Waive Fine" ariaLabel="Waive Fine"
        onClick={() => {
          if (fineDueOf(row) === 0) {
            push(`${row.member} has no fine outstanding`, 'warning');
            return;
          }
          settleFines([row.id], 'Waived', 'waived');
        }}
      >
        <i className="ti ti-shield-check" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Mark as Damaged" ariaLabel="Mark as Damaged" onClick={() => openModal(row, 'damage')}>
        <i className="ti ti-tool" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Mark as Lost" ariaLabel="Mark as Lost" onClick={() => openModal(row, 'lost')}>
        <i className="ti ti-alert-octagon" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Export" ariaLabel="Export"
        onClick={() => push(`${row.member}'s return record exported`)}
      >
        <i className="ti ti-file-export" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: BookReturn) => {
    const condition = conditionBadge[row.condition];
    return (
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
            <h6 className="details-heading"><i className="ti ti-timeline-event" />Issue &amp; Return Timeline</h6>
            <ul className="list-unstyled fs-12 mb-3">
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Issued</span><span className="fw-medium">{row.issuedOn}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Due</span><span className="fw-medium">{row.dueOn}</span>
              </li>
              <li className="d-flex align-items-center justify-content-between py-1">
                <span className="text-muted">Returned</span>
                <span className="fw-medium">{row.returnDate ?? '—'}</span>
              </li>
            </ul>
            <h6 className="details-heading"><i className="ti ti-calculator" />Fine Calculation</h6>
            <p className="fs-12 text-muted mb-0">{fineSentenceOf(row)}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-zoom-check" />Book Condition Report</h6>
            <div className="mb-3">
              <span className={condition.className}>
                <i className={`${condition.icon} me-1`} />{condition.panelLabel}
              </span>
            </div>
            <h6 className="details-heading"><i className="ti ti-history" />Borrowing History</h6>
            <p className="fs-12 text-muted mb-0">{historyOf(row)}</p>
          </div>
          <div className="col-xl-3 col-md-6">
            <h6 className="details-heading"><i className="ti ti-notes" />Librarian Notes</h6>
            <p className="fs-12 text-muted mb-2">{notesOf(row)}</p>
            <h6 className="details-heading"><i className="ti ti-paperclip" />Attachments</h6>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {attachmentsOf(row).map((file) => (
                <span className={file.className} key={file.label}>
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
                onClick={() => openModal(row, 'process')}
              >
                <i className="ti ti-book-upload me-1" />Process
              </button>
            </div>
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
            title="Return Book"
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
                    onClick={() => push(`${workspace.visible.length} return receipts queued`)}
                  >
                    <i className="ti ti-printer me-2" />Print Return Receipt
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'process')}
                  >
                    <i className="ti ti-book-upload me-2" />Process Return
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
            searchPlaceholder="Search members, card no, book or ISBN…"
            searchLabel="Search return records"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="records"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Return records refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Return Receipt"
                aria-label="Print Return Receipt"
                onClick={() => push(`${workspace.visible.length} return receipts queued`)}
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
            emptyTitle="No return records match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Book return records with member, book and return details"
            selectAllLabel="Select all records"
            rowLabel={(row) => `Select ${row.member}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <ReturnModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onProcess={processReturn}
        onCollect={collectFine}
        onInspect={saveInspection}
        onAssess={saveAssessment}
        onReportLost={reportLost}
        onDelete={removeRecords}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default ReturnBook;
