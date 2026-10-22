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
  WorkspaceMenu,
} from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import CategoryModals, { NO_PARENT } from './modals/CategoryModals';
import type { CategoryDraft, CategoryModalId, DeleteResult, MoveResult } from './modals/CategoryModals';
import type { Category } from './data/categories.data';
import {
  ROOT_ONLY, availabilityPct, bookCountBand, bookCountOptions, categories as initialRows,
  count, dateKey, isRoot, issued, lowAvailability, managedByOptions, maxPerMember, parentLabel,
  parentOptions, renewalsAllowed, reservations, searchIndexOf, shelfLocationOptions, statusBadge,
  statusOptions, statusPill, typeOptions,
} from './data/categories.data';

const routes = all_routes;

/**
 * Ids match the template's own. Category Type and Parent Category open already
 * committed, which is what puts the two chips on the rail at load.
 */
const filterFields: FilterField[] = [
  {
    id: 'category-type', label: 'Category Type', kind: 'select', chipLabel: 'Type',
    options: typeOptions, initialValue: 'Physical',
  },
  {
    id: 'parent-category', label: 'Parent Category', kind: 'select', chipLabel: 'Parent',
    options: parentOptions, initialValue: ROOT_ONLY,
  },
  { id: 'status', label: 'Status', kind: 'select', chipLabel: 'Status', options: statusOptions },
  { id: 'book-count', label: 'Book Count', kind: 'select', chipLabel: 'Books', options: bookCountOptions },
  {
    id: 'shelf-location', label: 'Shelf Location', kind: 'select', chipLabel: 'Shelf',
    options: shelfLocationOptions,
  },
  { id: 'managed-by', label: 'Managed By', kind: 'select', chipLabel: 'Managed by', options: managedByOptions },
  { id: 'updated-from', label: 'Updated From', kind: 'date', chipLabel: 'Updated from', placeholder: '01-06-2026' },
  { id: 'updated-to', label: 'Updated To', kind: 'date', chipLabel: 'Updated to', placeholder: '31-07-2026' },
];

const sortOptions: SortOption[] = [
  { id: 'name', label: 'Category name (A–Z)', icon: 'ti ti-abc' },
  { id: 'total', label: 'Total books', icon: 'ti ti-books' },
  { id: 'available', label: 'Available books', icon: 'ti ti-book' },
  { id: 'parent', label: 'Parent category', icon: 'ti ti-sitemap' },
  { id: 'updated', label: 'Recently updated', icon: 'ti ti-clock' },
];

const Categories = () => {
  const [rows, setRows] = useState<Category[]>(initialRows);
  const [openMenu, setOpenMenu] = useState<WorkspaceMenu>(null);
  const [activeModal, setActiveModal] = useState<CategoryModalId | null>(null);
  const [modalRow, setModalRow] = useState<Category | null>(null);
  const [panelRow, setPanelRow] = useState<Category | null>(null);
  const [card, setCard] = useState<string | null>(null);

  const { toasts, push, dismiss } = useToasts();

  const openModal = useCallback((row: Category | null, modal: CategoryModalId) => {
    setModalRow(row);
    setActiveModal(modal);
  }, []);

  /* --------------------------------- Columns -------------------------------- */

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        id: 'name',
        label: 'Category Name',
        sortable: true,
        render: (row) => (
          <div className="dt-user">
            <span className={`avatar avatar-sm bg-${row.tint}-transparent text-${row.tint} rounded me-2 flex-shrink-0`}>
              <i className={row.icon} />
            </span>
            <div>
              <ActionLink className="dt-name" onClick={() => openModal(row, 'view')}>{row.name}</ActionLink>
              <div className="dt-sub">{row.code}</div>
            </div>
          </div>
        ),
      },
      {
        id: 'parent',
        label: 'Parent Category',
        sortable: true,
        render: (row) =>
          row.parent ? (
            <>
              <span className="d-block fs-13">{row.parent}</span>
              <span className="fs-12 text-muted">{row.parentCode}</span>
            </>
          ) : (
            <span className="badge badge-soft-secondary">
              <i className="ti ti-sitemap me-1" />Root category
            </span>
          ),
      },
      {
        id: 'description',
        label: 'Description',
        cellClassName: 'fs-13',
        render: (row) => row.description,
      },
      {
        id: 'total',
        label: 'Total Books',
        sortable: true,
        align: 'end',
        render: (row) => count(row.total),
      },
      {
        id: 'available',
        label: 'Available',
        sortable: true,
        align: 'end',
        cellClassName: 'fw-medium',
        render: (row) => (
          <>
            <span className="d-block">{count(row.available)}</span>
            <span className={`fs-12 text-${lowAvailability(row) ? 'danger' : 'success'}`}>
              {availabilityPct(row)}%
            </span>
          </>
        ),
      },
      {
        id: 'shelf',
        label: 'Shelf Location',
        render: (row) => (
          <span className="badge badge-soft-info">
            <i className="ti ti-map-pin me-1" />{row.shelf}
          </span>
        ),
      },
      {
        id: 'updated',
        label: 'Last Updated',
        sortable: true,
        cellClassName: 'fs-13',
        render: (row) => row.updated,
      },
      {
        id: 'status',
        label: 'Status',
        render: (row) => (
          <span className={`dt-pill ${statusPill[row.status]}`}>
            <span className="dt-pill-dot" />{row.status}
          </span>
        ),
      },
    ],
    [openModal],
  );

  /* -------------------------------- Workspace ------------------------------- */

  const workspace = useWorkspace<Category>({
    rows,
    filterFields,
    columns,
    getId: (row) => row.id,
    search: (row, term) => searchIndexOf(row).includes(term),
    matches: (row, filters) => {
      if (card && row.name !== card) return false;
      if (filters['category-type'] && row.type !== filters['category-type']) return false;
      if (filters['parent-category']) {
        const value = filters['parent-category'];
        if (value === ROOT_ONLY ? !isRoot(row) : row.parent !== value) return false;
      }
      if (filters.status && row.status !== filters.status) return false;
      if (filters['book-count'] && bookCountBand(row) !== filters['book-count']) return false;
      if (filters['shelf-location'] && row.shelfLocation !== filters['shelf-location']) return false;
      if (filters['managed-by'] && row.managedBy !== filters['managed-by']) return false;
      return true;
    },
    quickMatch: (row, quick) => {
      switch (quick) {
        case null: return true;
        case 'root': return isRoot(row);
        case 'sub': return !isRoot(row);
        case 'digital': return row.type === 'Digital';
        case 'low': return lowAvailability(row);
        case 'archived': return row.status === 'Archived';
        default: return true;
      }
    },
    viewMatch: (row, view) => {
      switch (view) {
        case 'root': return isRoot(row);
        case 'sub': return !isRoot(row);
        case 'digital': return row.type === 'Digital';
        case 'archived': return row.status === 'Archived';
        default: return true;
      }
    },
    compare: (a, b, sort) => {
      switch (sort) {
        case 'total': return b.total - a.total || a.name.localeCompare(b.name);
        case 'available': return b.available - a.available || a.name.localeCompare(b.name);
        case 'parent': return parentLabel(a).localeCompare(parentLabel(b)) || a.name.localeCompare(b.name);
        case 'updated': return dateKey(b.updated) - dateKey(a.updated);
        case 'name':
        default: return a.name.localeCompare(b.name);
      }
    },
    defaultSort: 'name',
    // The template renders the Root Categories quick filter already active.
    defaultQuick: 'root',
    pageSize: 8,
  });

  /** Counts follow the roster, so archiving a category moves both rails. */
  const savedViews = useMemo<SavedView[]>(
    () => [
      { id: 'all', label: 'All Categories', icon: 'ti ti-layout-list', count: rows.length },
      { id: 'root', label: 'Root Categories', icon: 'ti ti-sitemap', count: rows.filter(isRoot).length },
      { id: 'sub', label: 'Subcategories', icon: 'ti ti-folder', count: rows.filter((row) => !isRoot(row)).length },
      { id: 'digital', label: 'Digital Only', icon: 'ti ti-world', count: rows.filter((row) => row.type === 'Digital').length },
      { id: 'archived', label: 'Archived', icon: 'ti ti-archive', count: rows.filter((row) => row.status === 'Archived').length },
    ],
    [rows],
  );

  const quickFilters = useMemo<QuickFilter[]>(
    () => [
      { id: 'root', label: 'Root Categories', icon: 'ti ti-sitemap', count: rows.filter(isRoot).length },
      { id: 'sub', label: 'Subcategories', icon: 'ti ti-folder', count: rows.filter((row) => !isRoot(row)).length },
      { id: 'digital', label: 'Digital', icon: 'ti ti-world', count: rows.filter((row) => row.type === 'Digital').length },
      { id: 'low', label: 'Low Availability', icon: 'ti ti-alert-triangle', count: rows.filter(lowAvailability).length },
      { id: 'archived', label: 'Archived', icon: 'ti ti-archive', count: rows.filter((row) => row.status === 'Archived').length },
    ],
    [rows],
  );

  /* -------------------------------- Mutations ------------------------------- */

  const parentCodeOf = useCallback(
    (name: string) => rows.find((row) => row.name === name)?.code ?? null,
    [rows],
  );

  const createCategory = useCallback(
    (draft: CategoryDraft) => {
      if (!draft.name.trim()) {
        push('Give the category a name', 'warning');
        return;
      }
      const code = draft.code.trim() || `CAT-${String(rows.length + 1).padStart(3, '0')}`;
      const parent = draft.parent === NO_PARENT ? null : draft.parent;
      setRows((current) => [
        {
          id: code,
          code,
          name: draft.name.trim(),
          tint: 'primary',
          icon: 'ti ti-folder',
          parent,
          parentCode: parent ? parentCodeOf(parent) : null,
          description: draft.description.trim() || '—',
          total: 0,
          available: 0,
          unit: 'books',
          shelf: draft.shelf.trim() || '—',
          shelfLocation: draft.shelf.trim() || '—',
          updated: '30 Jul 2026',
          status: draft.status,
          type: draft.type,
          createdOn: '30 Jul 2026',
          managedBy: draft.managedBy,
          loanPeriod: draft.loanPeriod,
          shelfDetails: [
            { label: 'Racks', value: draft.shelf.trim() || '—' },
            { label: 'Floor', value: '—' },
            { label: 'Section', value: '—' },
            { label: 'Capacity', value: '—' },
          ],
          stats: [
            { label: 'Issued This Month', value: '0' },
            { label: 'Currently Issued', value: '0' },
            { label: 'Overdue Returns', value: '0' },
            { label: 'Most Borrowed', value: '—' },
          ],
          subcategories: [],
          notes: draft.notes.trim(),
        },
        ...current,
      ]);
      setActiveModal(null);
      push(`${draft.name.trim()} added to the catalogue`);
    },
    [parentCodeOf, push, rows.length],
  );

  const updateCategory = useCallback(
    (draft: CategoryDraft) => {
      if (!modalRow) return;
      const parent = draft.parent === NO_PARENT ? null : draft.parent;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                name: draft.name.trim() || row.name,
                code: draft.code.trim() || row.code,
                parent,
                parentCode: parent ? parentCodeOf(parent) : null,
                type: draft.type,
                shelf: draft.shelf.trim() || row.shelf,
                loanPeriod: draft.loanPeriod,
                managedBy: draft.managedBy,
                status: draft.status,
                description: draft.description.trim() || row.description,
                notes: draft.notes,
                updated: '30 Jul 2026',
              }
            : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.name} updated`);
    },
    [modalRow, parentCodeOf, push],
  );

  const moveCategory = useCallback(
    (result: MoveResult) => {
      if (!modalRow) return;
      const parent = result.parent === NO_PARENT ? null : result.parent;
      setRows((current) =>
        current.map((row) =>
          row.id === modalRow.id
            ? {
                ...row,
                parent,
                parentCode: parent ? parentCodeOf(parent) : null,
                shelf: result.shelf.trim() || row.shelf,
                updated: '30 Jul 2026',
              }
            : row,
        ),
      );
      setActiveModal(null);
      push(`${modalRow.name} moved to ${parent ?? 'the library root'}`);
    },
    [modalRow, parentCodeOf, push],
  );

  const deleteCategory = useCallback(
    (result: DeleteResult) => {
      if (!modalRow) return;
      if (result.archive) {
        setRows((current) =>
          current.map((row) => (row.id === modalRow.id ? { ...row, status: 'Archived' as const } : row)),
        );
        push(`${modalRow.name} archived`);
      } else {
        setRows((current) => current.filter((row) => row.id !== modalRow.id));
        push(`${modalRow.name} deleted`);
      }
      setActiveModal(null);
      if (panelRow?.id === modalRow.id) setPanelRow(null);
    },
    [modalRow, panelRow, push],
  );

  const exportAs = useCallback(
    (format: ExportFormat) => {
      if (format === 'print') {
        window.print();
        return;
      }
      push(`${workspace.visible.length} categories exported as ${format.toUpperCase()}`);
    },
    [push, workspace.visible.length],
  );

  /* ---------------------------------- Rows ---------------------------------- */

  const rowActions = (row: Category) => (
    <div className="dt-actions">
      <ActionLink className="dt-ib" title="View Category" ariaLabel="View Category" onClick={() => openModal(row, 'view')}>
        <i className="ti ti-eye" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Edit Category" ariaLabel="Edit Category" onClick={() => openModal(row, 'edit')}>
        <i className="ti ti-edit" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Move Category" ariaLabel="Move Category" onClick={() => openModal(row, 'move')}>
        <i className="ti ti-arrows-move" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Category Panel" ariaLabel="Category Panel" onClick={() => setPanelRow(row)}>
        <i className="ti ti-books" />
      </ActionLink>
      <ActionLink className="dt-ib" title="Delete Category" ariaLabel="Delete Category" onClick={() => openModal(row, 'delete')}>
        <i className="ti ti-trash-x" />
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

  const renderDetail = (row: Category) => (
    <div className="row g-4">
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className={`${row.icon} text-primary me-1`} />Category Information</h6>
        {pairList([
          { label: 'Category Code', value: row.code },
          { label: 'Type', value: row.type },
          { label: 'Created On', value: row.createdOn },
          { label: 'Managed By', value: row.managedBy },
          { label: 'Loan Period', value: row.loanPeriod },
        ])}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-map-pin text-info me-1" />Shelf Details</h6>
        {pairList(row.shelfDetails)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-history text-warning me-1" />Borrow Statistics</h6>
        {pairList(row.stats)}
      </div>
      <div className="col-12 col-xl-3 col-md-6">
        <h6 className="fs-14 mb-3"><i className="ti ti-sitemap text-purple me-1" />Subcategories</h6>
        {row.subcategories.length === 0 ? (
          <p className="fs-13 text-muted mb-3">No subcategories yet.</p>
        ) : (
          row.subcategories.map((sub) => (
            <div className="d-flex align-items-center gap-2 border rounded p-2 mb-2" key={sub.name}>
              <span className={`avatar avatar-sm bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
                <i className="ti ti-folder" />
              </span>
              <div className="flex-fill overflow-hidden">
                <h6 className="fs-13 mb-0 text-truncate">{sub.name}</h6>
                <span className="fs-12 text-muted">{sub.count}</span>
              </div>
              <ActionLink className="dt-ib" ariaLabel="Open subcategory" onClick={() => setPanelRow(row)}>
                <i className="ti ti-chevron-right" />
              </ActionLink>
            </div>
          ))
        )}
        <p className="fs-13 text-muted mb-3">{row.notes}</p>
        <div className="d-flex align-items-center flex-wrap gap-2">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'view')}>
            <i className="ti ti-eye me-1" />View Category
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal(row, 'edit')}>
            <i className="ti ti-edit me-1" />Edit Category
          </button>
          <button
            type="button" className="btn btn-outline-light bg-white btn-sm"
            onClick={() => setPanelRow(row)}
          >
            <i className="ti ti-books me-1" />Category Panel
          </button>
        </div>
      </div>
    </div>
  );

  /* ------------------------------ Overview cards ----------------------------- */

  const overview = (
    <div className="row g-3 mb-3">
      {rows.map((row) => (
        <div className="col-6 col-md-3" key={row.id}>
          <div className={`card mb-0 h-100${card === row.name ? ' card-selected' : ''}`}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center mb-2">
                <span className={`avatar avatar-sm bg-${row.tint}-transparent text-${row.tint} rounded flex-shrink-0`}>
                  <i className={row.icon} />
                </span>
                <div className="ms-2 overflow-hidden">
                  <h5 className="fs-13 mb-0 text-truncate">{row.name}</h5>
                  <span className="fs-12 text-muted text-truncate d-block">
                    {count(row.total)} {row.unit}
                  </span>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <ActionLink
                  className={statusBadge[row.status]}
                  ariaLabel={`Filter to ${row.name}`}
                  onClick={() => setCard((current) => (current === row.name ? null : row.name))}
                >
                  {row.status}
                </ActionLink>
                <ActionLink
                  className="fs-12 fw-medium d-inline-flex align-items-center"
                  onClick={() => setPanelRow(row)}
                >
                  Manage<i className="ti ti-chevron-right ms-1" />
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          <PageHeader
            title="Library Categories"
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
                    <i className="ti ti-square-rounded-plus me-2" />Add Category
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
            beforeWorkspace={overview}
            footerVariant="card-foot"
            workspaceId="lcWorkspace"
            searchPlaceholder="Search category name or code…"
            searchLabel="Search categories"
            savedViews={savedViews}
            filterFields={filterFields}
            quickFilters={quickFilters}
            sortOptions={sortOptions}
            noun="categories"
            openMenu={openMenu}
            onOpenMenu={setOpenMenu}
            onRefresh={() => { setRows(initialRows); push('Categories refreshed'); }}
            onSaveView={() => push('Current view saved')}
            onToast={push}
            onResetExtra={() => setCard(null)}
            renderDetail={renderDetail}
            renderActions={rowActions}
            emptyIcon="ti ti-books-off"
            emptyTitle="No categories match your filters"
            emptyBody="Try adjusting your search terms or clearing the active filters to see more results."
          />

          {/* Category Details Offcanvas */}
          <Offcanvas
            open={panelRow !== null}
            onClose={() => setPanelRow(null)}
            title="Category Details"
            labelledById="lc_panel_lbl"
          >
            {panelRow ? (
              <>
                <h6 className="fs-14 mb-2">Category Information</h6>
                <div className="d-flex align-items-center mb-3">
                  <span className={`avatar avatar-lg bg-${panelRow.tint}-transparent text-${panelRow.tint} rounded flex-shrink-0`}>
                    <i className={`${panelRow.icon} fs-20`} />
                  </span>
                  <div className="ms-2">
                    <h6 className="mb-0">{panelRow.name}</h6>
                    <span className="fs-12 text-muted">
                      {panelRow.code} · {panelRow.type} · {panelRow.managedBy}
                    </span>
                  </div>
                  <span className={`${statusBadge[panelRow.status]} ms-auto`}>{panelRow.status}</span>
                </div>

                <h6 className="fs-14 mb-2">Parent Hierarchy</h6>
                <div className="d-flex align-items-center flex-wrap gap-2 border rounded p-2 mb-3">
                  <span className="badge badge-soft-secondary">
                    <i className="ti ti-sitemap me-1" />Library Root
                  </span>
                  {panelRow.parent ? (
                    <>
                      <i className="ti ti-chevron-right fs-12 text-muted" />
                      <span className="badge badge-soft-info">{panelRow.parent}</span>
                    </>
                  ) : null}
                  <i className="ti ti-chevron-right fs-12 text-muted" />
                  <span className={`badge badge-soft-${panelRow.tint}`}>{panelRow.name}</span>
                  <i className="ti ti-chevron-right fs-12 text-muted" />
                  <span className="fs-12 text-muted">{panelRow.subcategories.length} subcategories</span>
                </div>

                <h6 className="fs-14 mb-2">Book Distribution</h6>
                <div className="row g-2 mb-2">
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Total Books</span>
                      <h5 className="mb-0">{count(panelRow.total)}</h5>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="border rounded p-3 text-center">
                      <span className="fs-12 text-muted d-block mb-1">Available</span>
                      <h5 className="mb-0 text-success">{count(panelRow.available)}</h5>
                    </div>
                  </div>
                </div>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Issued', value: count(issued(panelRow)) },
                    { label: 'Availability', value: `${availabilityPct(panelRow)}%` },
                    { label: 'Shelf', value: panelRow.shelf },
                    { label: 'Last Updated', value: panelRow.updated },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Category Rules</h6>
                <div className="border rounded p-3 mb-3">
                  {pairList([
                    { label: 'Loan Period', value: panelRow.loanPeriod },
                    { label: 'Max Per Member', value: maxPerMember(panelRow) },
                    { label: 'Renewals Allowed', value: renewalsAllowed(panelRow) },
                    { label: 'Reservations', value: reservations(panelRow) },
                  ])}
                </div>

                <h6 className="fs-14 mb-2">Librarian Notes</h6>
                <p className="fs-13 text-muted">{panelRow.notes}</p>

                <div className="d-flex gap-2">
                  <button
                    type="button" className="btn btn-primary flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'edit'); }}
                  >
                    <i className="ti ti-edit me-1" />Edit Category
                  </button>
                  <button
                    type="button" className="btn btn-outline-light bg-white flex-fill"
                    onClick={() => { const row = panelRow; setPanelRow(null); openModal(row, 'move'); }}
                  >
                    <i className="ti ti-arrows-move me-1" />Move
                  </button>
                </div>
              </>
            ) : null}
          </Offcanvas>
          {/* /Category Details Offcanvas */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <CategoryModals
        active={activeModal}
        row={modalRow}
        onClose={() => setActiveModal(null)}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onMove={moveCategory}
        onDelete={deleteCategory}
        onOpen={(modal) => setActiveModal(modal)}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="lcToasts" />
    </>
  );
};

export default Categories;
