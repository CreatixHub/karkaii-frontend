import { useCallback, useMemo, useState } from 'react';
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
import BookModals from './modals/BookModals';
import type { BookDraft, BookModalId } from './modals/BookModals';
import type { Book, BookStatus } from './data/books.data';
import {
  authorInfoOf, authorOptions, availabilityOptions, availabilityPct, availabilityTint,
  books as initialRows, borrowingHistoryOf, categoryOptions, copyInfoOf, dateAddedOptions,
  dateKey, descriptionOf, fineInfoOf, languageOptions, meterTint, notesOf, publisherOptions,
  reservationQueueOf, searchIndexOf, shelfOptions, statusIcon, statusOptions, statusPill, stockLabel,
} from './data/books.data';

const routes = all_routes;

/** Ids and options are the template's own, verbatim from the filter panel. */
const filterFields: FilterField[] = [
  { id: 'category', label: 'Category', kind: 'select', chipLabel: 'Category', options: categoryOptions },
  { id: 'author', label: 'Author', kind: 'select', chipLabel: 'Author', options: authorOptions },
  { id: 'publisher', label: 'Publisher', kind: 'select', chipLabel: 'Publisher', options: publisherOptions },
  { id: 'language', label: 'Language', kind: 'select', chipLabel: 'Language', options: languageOptions },
  { id: 'shelf-location', label: 'Shelf Location', kind: 'select', chipLabel: 'Shelf', options: shelfOptions },
  { id: 'availability', label: 'Availability', kind: 'select', chipLabel: 'Availability', options: availabilityOptions },
  { id: 'book-status', label: 'Book Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'date-added', label: 'Date Added', kind: 'select', chipLabel: 'Added', allLabel: 'Any date', options: dateAddedOptions },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Title (A–Z)', icon: 'ti ti-abc' },
  { id: 'author', label: 'Author', icon: 'ti ti-user-edit' },
  { id: 'available', label: 'Available Copies', icon: 'ti ti-stack-2' },
  { id: 'added', label: 'Date Added', icon: 'ti ti-calendar' },
  { id: 'recent', label: 'Recently added', icon: 'ti ti-clock' },
];

/** The saved-view and quick-filter rails share these five statuses. */
const rails: { id: BookStatus; label: string; icon: string }[] = [
  { id: 'Available', label: 'Available', icon: 'ti ti-circle-check' },
  { id: 'Issued', label: 'Issued', icon: 'ti ti-book' },
  { id: 'Reserved', label: 'Reserved', icon: 'ti ti-bookmark' },
  { id: 'Maintenance', label: 'Maintenance', icon: 'ti ti-tool' },
  { id: 'Lost', label: 'Lost', icon: 'ti ti-alert-triangle' },
];

const Books = () => {
  const [rows, setRows] = useState<Book[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<BookModalId | null>(null);
  const [modalRow, setModalRow] = useState<Book | null>(null);
  const [bulkIds, setBulkIds] = useState<string[]>([]);

  const { loading } = useReveal();
  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Book | null, modal: BookModalId) => {
    setModalRow(row);
    setBulkIds([]);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      {
        id: 'book',
        label: 'Book',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <ActionLink
              className="dt-avatar d-inline-flex align-items-center justify-content-center bg-primary-transparent text-primary"
              ariaLabel={`View ${row.title}`}
              onClick={() => openModal(row, 'view')}
            >
              <i className="ti ti-book fs-20" />
            </ActionLink>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.title}</ActionLink>
              <div className="dt-sub">
                <span className="dt-isbn">{row.isbn}</span>
                <span className="dt-dot">·</span>
                <span className="link-primary dt-code">{row.code}</span>
              </div>
              <div className="d-flex flex-wrap gap-1 mt-1">
                <span className="badge badge-soft-secondary">
                  <i className="ti ti-versions me-1" />{row.edition}
                </span>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: 'details',
        label: 'Book Details',
        sortable: true,
        render: (row) => (
          <ul className="list-unstyled mb-0 fs-12">
            <li className="py-1 text-muted">
              <i className="ti ti-user-edit me-1" />
              <span className="dt-author fw-medium text-dark">{row.author}</span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-primary dt-category">{row.category}</span>{' '}
              <span className="badge badge-soft-secondary dt-language">
                <i className="ti ti-language me-1" />{row.language}
              </span>
            </li>
            <li className="py-1 text-muted">
              <i className="ti ti-building-store me-1" />
              <span className="dt-publisher">{row.publisher}</span>
            </li>
            <li className="py-1">
              <span className="badge badge-soft-info">
                <i className="ti ti-map-pin me-1" />Shelf <span className="dt-shelf">{row.shelf}</span>
              </span>
            </li>
          </ul>
        ),
      },
      {
        id: 'inventory',
        label: 'Inventory',
        sortable: true,
        render: (row) => (
          <>
            <div className="d-flex align-items-center justify-content-between mb-1">
              <span className="fw-semibold fs-13">
                <span className="dt-avail-val">{row.available}</span> /{' '}
                <span className="dt-total-val">{row.total}</span> available
              </span>
              <span className={`fs-12 fw-medium text-${availabilityTint(row)}`}>{availabilityPct(row)}%</span>
            </div>
            <div className={`meter meter-${meterTint(row)}`}>
              <span style={{ width: `${availabilityPct(row)}%` }} />
            </div>
            <div className="d-flex flex-wrap align-items-center gap-1 mt-2">
              <span className="badge badge-soft-primary">
                <i className="ti ti-book me-1" />Issued <span className="dt-issued-val">{row.issued}</span>
              </span>
              <span className="badge badge-soft-warning">
                <i className="ti ti-bookmark me-1" />Reserved {row.reserved}
              </span>
            </div>
            <div className="mt-2 fs-12 text-muted">
              <i className="ti ti-calendar-plus me-1" />Added <span className="dt-added">{row.added}</span>
            </div>
          </>
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

  const workspace = useWorkspace<Book>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (filters.category && row.category !== filters.category) return false;
      if (filters.author && row.author !== filters.author) return false;
      if (filters.publisher && row.publisher !== filters.publisher) return false;
      if (filters.language && row.language !== filters.language) return false;
      if (filters['shelf-location'] && row.shelf !== filters['shelf-location']) return false;
      if (filters.availability && stockLabel(row) !== filters.availability) return false;
      if (filters['book-status'] && row.status !== filters['book-status']) return false;
      if (filters['date-added'] && row.added !== filters['date-added']) return false;
      return true;
    },
    quickMatch: (row, quick) => (quick ? row.status === quick : true),
    viewMatch: (row, view) => (view === 'all' ? true : row.status === view),
    compare: (a, b, sort) => {
      switch (sort) {
        case 'author':
          return a.author.localeCompare(b.author) || a.title.localeCompare(b.title);
        case 'available':
          return b.available - a.available || a.title.localeCompare(b.title);
        case 'added':
          return dateKey(a.added) - dateKey(b.added);
        case 'recent':
          return dateKey(b.added) - dateKey(a.added);
        // Not in the sort menu, but the Status `<th>` is sortable in the template.
        case 'status':
          return a.status.localeCompare(b.status) || a.title.localeCompare(b.title);
        case 'name':
        default:
          return a.title.localeCompare(b.title);
      }
    },
    // The template's sort menu opens with "Recently added" already active.
    defaultSort: 'recent',
    pageSize: 10,
  });

  /** Counts follow the roster, so issuing a copy moves both rails at once. */
  const countBy = useCallback(
    (status: BookStatus) => rows.filter((row) => row.status === status).length,
    [rows],
  );

  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Books', icon: 'ti ti-layout-list', count: rows.length },
      ...rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    ],
    [countBy, rows.length],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => rails.map((rail) => ({ ...rail, count: countBy(rail.id) })),
    [countBy],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const toNumber = (value: string, fallback: number): number => {
    const parsed = Number(value.replace(/[^0-9]/g, ''));
    return Number.isFinite(parsed) && value.trim() !== '' ? parsed : fallback;
  };

  const createBook = useCallback(
    (draft: BookDraft) => {
      if (!draft.title.trim()) {
        push('Give the book a name', 'warning');
        return;
      }
      const total = toNumber(draft.total, 1);
      const available = Math.min(toNumber(draft.available, total), total);
      const code = draft.code.trim() || `BK-${1000 + rows.length + 1}`;
      setRows((current) => [
        {
          id: code,
          code,
          title: draft.title.trim(),
          isbn: draft.isbn.trim() || '—',
          edition: draft.edition,
          author: draft.author.trim() || '—',
          category: draft.category,
          language: draft.language,
          publisher: draft.publisher.trim() || '—',
          shelf: draft.shelf.trim() || '—',
          total,
          available,
          issued: total - available,
          reserved: 0,
          added: draft.added.trim() || '—',
          status: draft.status,
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.title.trim()} added to the catalogue`);
    },
    [push, rows.length],
  );

  const updateBook = useCallback(
    (draft: BookDraft) => {
      if (!modalRow) return;
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const total = toNumber(draft.total, row.total);
          const available = Math.min(toNumber(draft.available, row.available), total);
          return {
            ...row,
            title: draft.title.trim() || row.title,
            code: draft.code.trim() || row.code,
            shelf: draft.shelf.trim() || row.shelf,
            publisher: draft.publisher.trim() || row.publisher,
            author: draft.author.trim() || row.author,
            category: draft.category,
            isbn: draft.isbn.trim() || row.isbn,
            edition: draft.edition,
            language: draft.language,
            status: draft.status,
            added: draft.added.trim() || row.added,
            total,
            available,
            // Keep the copy ledger balanced when the totals move.
            issued: Math.min(row.issued, total - available),
            reserved: Math.min(row.reserved, Math.max(0, total - available - row.issued)),
          };
        }),
      );
      setActiveModal(null);
      push(`${modalRow.title} updated`);
    },
    [modalRow, push],
  );

  /** Issuing moves one copy from the shelf to a member. */
  const issueBook = useCallback(
    (member: string) => {
      if (!modalRow) return;
      if (!member) {
        push('Select a member to issue to', 'warning');
        return;
      }
      if (modalRow.available === 0) {
        push(`No copy of ${modalRow.title} is on the shelf`, 'warning');
        return;
      }
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const available = row.available - 1;
          return {
            ...row,
            available,
            issued: row.issued + 1,
            status: available === 0 ? 'Issued' : row.status,
          };
        }),
      );
      setActiveModal(null);
      push(`${modalRow.title} issued to ${member.split(' · ')[0]}`);
    },
    [modalRow, push],
  );

  /** Reserving holds a copy back rather than lending it. */
  const reserveBook = useCallback(
    (member: string) => {
      if (!modalRow) return;
      if (!member) {
        push('Select a member to reserve for', 'warning');
        return;
      }
      setRows((current) =>
        current.map((row) => {
          if (row.id !== modalRow.id) return row;
          const canHold = row.available > 0;
          return {
            ...row,
            available: canHold ? row.available - 1 : row.available,
            reserved: row.reserved + 1,
            status: 'Reserved',
          };
        }),
      );
      setActiveModal(null);
      push(`${modalRow.title} reserved for ${member.split(' · ')[0]}`);
    },
    [modalRow, push],
  );

  const setStatus = useCallback(
    (ids: string[], status: BookStatus, verb: string) => {
      setRows((current) => current.map((row) => (ids.includes(row.id) ? { ...row, status } : row)));
      workspace.clearSelection();
      push(`${ids.length} ${ids.length === 1 ? 'book' : 'books'} ${verb}`);
    },
    [push, workspace],
  );

  const removeBooks = useCallback(() => {
    const ids = bulkIds.length > 0 ? bulkIds : modalRow ? [modalRow.id] : [];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    workspace.clearSelection();
    setActiveModal(null);
    push(`${ids.length} ${ids.length === 1 ? 'book' : 'books'} deleted`);
  }, [bulkIds, modalRow, push, workspace]);

  const duplicate = useCallback(
    (row: Book) => {
      const code = `${row.code}-C`;
      setRows((current) => [{ ...row, id: code, code, status: 'Available' }, ...current]);
      push(`${row.title} duplicated as ${code}`);
    },
    [push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} books exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  const bulkActions = useMemo<BulkAction[]>(
    () => [
      { id: 'issue', label: 'Issue Books', icon: 'ti ti-book', onClick: () => openModal(null, 'issue') },
      { id: 'labels', label: 'Print Labels', icon: 'ti ti-tag', onClick: (ids) => push(`${ids.length} labels queued`) },
      { id: 'barcodes', label: 'Print Barcodes', icon: 'ti ti-barcode', onClick: (ids) => push(`${ids.length} barcodes queued`) },
      { id: 'export', label: 'Export Selected', icon: 'ti ti-file-export', onClick: (ids) => push(`${ids.length} books exported`) },
      { id: 'archive', label: 'Archive', icon: 'ti ti-archive', onClick: (ids) => setStatus(ids, 'Archived', 'archived') },
      {
        id: 'delete', label: 'Delete', icon: 'ti ti-trash', danger: true,
        onClick: (ids) => { setBulkIds(ids); setModalRow(null); setActiveModal('delete'); },
      },
    ],
    [openModal, push, setStatus],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Book) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Book" ariaLabel="View Book" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Book" ariaLabel="Edit Book" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Issue Book" ariaLabel="Issue Book" onClick={() => openModal(row, 'issue')}>
        <i className="ti ti-book" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Reserve Book" ariaLabel="Reserve Book" onClick={() => openModal(row, 'reserve')}>
        <i className="ti ti-bookmark" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Availability" ariaLabel="Availability" onClick={() => openModal(row, 'availability')}>
        <i className="ti ti-checkup-list" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print Barcode" ariaLabel="Print Barcode" onClick={() => openModal(row, 'barcode')}>
        <i className="ti ti-barcode" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Print QR Code" ariaLabel="Print QR Code" onClick={() => openModal(row, 'qr')}>
        <i className="ti ti-qrcode" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Duplicate" ariaLabel="Duplicate" onClick={() => duplicate(row)}>
        <i className="ti ti-copy" />
      </ActionLink>
      <ActionLink
        className="dt-ib" title="Mark as Lost" ariaLabel="Mark as Lost"
        onClick={() => setStatus([row.id], 'Lost', 'marked lost')}
      >
        <i className="ti ti-alert-triangle" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete" ariaLabel="Delete" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
      </ActionLink>
    </div>
  );

  const renderDetail = (row: Book) => (
    <div className="dt-detail-inner">
      <div className="row g-4">
        <div className="col-xl-3 col-md-6">
          <h4 className="details-heading fs-15 fw-medium"><i className="ti ti-file-description" />Book Description</h4>
          <p className="fs-12 text-muted mb-3">{descriptionOf(row)}</p>
          <h5 className="details-heading fs-15"><i className="ti ti-user-edit" />Author Information</h5>
          <p className="fs-12 text-muted mb-0">{authorInfoOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-building-store" />Publication Details</h6>
          <ul className="list-unstyled fs-12 mb-3">
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Publisher</span><span className="fw-medium">{row.publisher}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">ISBN</span><span className="fw-medium">{row.isbn}</span>
            </li>
            <li className="d-flex align-items-center justify-content-between py-1">
              <span className="text-muted">Edition</span>
              <span className="fw-medium">{row.edition.replace(/\s*Edition$/, '')}</span>
            </li>
          </ul>
          <h6 className="details-heading"><i className="ti ti-stack-2" />Complete Copy Information</h6>
          <p className="fs-12 text-muted mb-0">{copyInfoOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-history" />Borrowing History</h6>
          <p className="fs-12 text-muted mb-3">{borrowingHistoryOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-bookmark" />Reservation Queue</h6>
          <p className="fs-12 text-muted mb-0">{reservationQueueOf(row)}</p>
        </div>
        <div className="col-xl-3 col-md-6">
          <h6 className="details-heading"><i className="ti ti-cash" />Fine Information</h6>
          <p className="fs-12 text-muted mb-2">{fineInfoOf(row)}</p>
          <h6 className="details-heading"><i className="ti ti-notes" />Notes</h6>
          <p className="fs-12 text-muted mb-2">{notesOf(row)}</p>
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
            title="Books"
            section="Library"
            dashboardTo={routes.adminDashboard}
            actions={
              <>
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => openModal(null, 'import')}
                  >
                    <i className="ti ti-file-import me-2" />Import Books
                  </ActionLink>
                </div>
                <ExportMenu label="Export Books" small onExport={exportAs} />
                <div className="me-2 mb-2">
                  <ActionLink
                    className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center"
                    onClick={() => push(`${workspace.visible.length} shelf labels queued`)}
                  >
                    <i className="ti ti-tag me-2" />Print Labels
                  </ActionLink>
                </div>
                <div className="mb-2">
                  <ActionLink
                    className="btn btn-primary btn-sm d-flex align-items-center"
                    onClick={() => openModal(null, 'add')}
                  >
                    <i className="ti ti-square-rounded-plus me-2" />Add Book
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
            searchPlaceholder="Search books, ISBN, code, author or publisher…"
            searchLabel="Search books"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="books"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Books refreshed'); }}
            toolbarExtra={
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                title="Print Labels"
                aria-label="Print Labels"
                onClick={() => push(`${workspace.visible.length} shelf labels queued`)}
              >
                <i className="ti ti-tag" />
              </button>
            }
            onSaveView={() => push('Current view saved')}
            onToast={push}
            renderDetail={renderDetail}
            renderActions={rowActions}
            bulkActions={bulkActions}
            emptyIcon="ti ti-book-off"
            emptyTitle="No books match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
            caption="Library book catalog with details, inventory and status"
            selectAllLabel="Select all books"
            rowLabel={(row) => `Select ${row.title}`}
          />
        </div>
      </div>
      {/* /Page Wrapper */}

      <BookModals
        active={activeModal}
        row={modalRow}
        deleteCount={bulkIds.length > 0 ? bulkIds.length : 1}
        onClose={() => setActiveModal(null)}
        onCreate={createBook}
        onUpdate={updateBook}
        onIssue={issueBook}
        onReserve={reserveBook}
        onDelete={removeBooks}
        onImport={(mode) => { setActiveModal(null); push(`File queued — ${mode.toLowerCase()}`); }}
        onToast={push}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="clsToasts" />
    </>
  );
};

export default Books;
