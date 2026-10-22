import type { ReactNode } from 'react';
import type { UseWorkspaceResult } from './useWorkspace';
import type { ColumnDef, FilterField, QuickFilter, SavedView, SortOption } from './types';
import WorkspaceHeader from './WorkspaceHeader';
import type { WorkspaceMenu } from './WorkspaceHeader';
import CardTable from './CardTable';

/** One button in the bulk-selection bar. */
export interface BulkAction {
  id: string;
  label: string;
  icon: string;
  /** Renders the button in `text-danger`, as the template's Delete does. */
  danger?: boolean;
  onClick: (selected: string[]) => void;
}

export interface CardWorkspaceShellProps<T> {
  workspace: UseWorkspaceResult<T>;
  columns: ColumnDef<T>[];
  getId: (row: T) => string;
  totalCount: number;

  /** Drives the `is-loaded` gate; pass `useReveal()`'s `loading`. */
  loading: boolean;
  /** The template's `id` on the workspace root, e.g. "classWorkspace". */
  workspaceId?: string;

  searchPlaceholder: string;
  searchLabel: string;
  savedViews: SavedView[];
  filterFields: FilterField[];
  quickFilters: QuickFilter[];
  sortOptions: SortOption[];
  noun: string;

  openMenu: WorkspaceMenu;
  onOpenMenu: (menu: WorkspaceMenu) => void;
  /** Icon buttons the variant-A templates slot between Refresh and Fullscreen. */
  toolbarExtra?: ReactNode;
  onRefresh: () => void;
  onSaveView: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;

  renderDetail?: (row: T) => ReactNode;
  renderActions?: (row: T) => ReactNode;
  bulkActions?: BulkAction[];

  emptyIcon: string;
  emptyTitle: string;
  emptyBody: string;

  caption?: string;
  selectAllLabel?: string;
  rowLabel?: (row: T) => string;
  onResetExtra?: () => void;
}

const pageSizeOptions = [10, 25, 50];

function CardWorkspaceShell<T>({
  workspace,
  columns,
  getId,
  totalCount,
  loading,
  workspaceId = 'classWorkspace',
  searchPlaceholder,
  searchLabel,
  savedViews,
  filterFields,
  quickFilters,
  sortOptions,
  noun,
  openMenu,
  onOpenMenu,
  toolbarExtra,
  onRefresh,
  onSaveView,
  onToast,
  renderDetail,
  renderActions,
  bulkActions,
  emptyIcon,
  emptyTitle,
  emptyBody,
  caption,
  selectAllLabel,
  rowLabel,
  onResetExtra,
}: CardWorkspaceShellProps<T>) {
  const { page, pageCount } = workspace;

  /** A short window around the current page, as the template's numbers rail. */
  const windowStart = Math.max(1, Math.min(page - 2, pageCount - 4));
  const numbers = Array.from({ length: Math.min(5, pageCount) }, (_, index) => windowStart + index).filter(
    (number) => number <= pageCount,
  );

  const skeletonRow = (
    <div className="skeleton-row">
      <div className="skeleton skeleton-chev" />
      <div className="skeleton skeleton-check" />
      <div className="skeleton-cell">
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton-stack">
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line skeleton-thin" />
        </div>
      </div>
      <div className="skeleton-stack">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-thin" />
      </div>
      <div className="skeleton-stack">
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line skeleton-thin" />
      </div>
      <div className="skeleton skeleton-pill" />
      <div className="skeleton-actions">
        <div className="skeleton skeleton-circle" />
        <div className="skeleton skeleton-circle" />
        <div className="skeleton skeleton-circle" />
        <div className="skeleton skeleton-circle" />
      </div>
    </div>
  );

  return (
    <div className="card">
      <div
        className={`data-workspace classes-workspace${loading ? '' : ' is-loaded'}`}
        id={workspaceId}
        data-density={workspace.density}
      >
        <WorkspaceHeader
          searchPlaceholder={searchPlaceholder}
          searchLabel={searchLabel}
          search={workspace.search}
          onSearch={workspace.setSearch}
          savedViews={savedViews}
          view={workspace.view}
          onView={workspace.setView}
          onSaveView={onSaveView}
          filterFields={filterFields}
          draft={workspace.draft}
          onDraftField={workspace.setDraftField}
          onApplyFilters={() => {
            workspace.applyFilters();
            onToast('Filters applied');
          }}
          onResetFilters={() => {
            workspace.resetFilters();
            onResetExtra?.();
            onToast('Filters cleared');
          }}
          matchCount={workspace.visible.length}
          totalCount={totalCount}
          matchNoun={noun}
          columnOptions={columns
            .filter((column) => column.toggleable !== false)
            .map((column) => ({ id: column.id, label: column.label }))}
          columns={workspace.columns}
          onToggleColumn={workspace.toggleColumn}
          onShowAllColumns={workspace.showAllColumns}
          density={workspace.density}
          onDensity={workspace.setDensity}
          onRefresh={onRefresh}
          toolbarExtra={toolbarExtra}
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
          onOpenMenu={onOpenMenu}
        />

        {/*
          `_ui-skeleton.scss` sets `.skeleton-loader { display: block }` and only
          takes it away again through `.skeleton-loader.hidden`. Nothing else
          hides it — the `is-loaded` gate covers `.card-header` and
          `.live-content`, not this — so without the class the placeholder stays
          on screen forever, stacked above the real grid.
        */}
        <div className={`skeleton-loader${loading ? '' : ' hidden'}`} aria-hidden="true">
          <div className="skeleton-head">
            <div className="skeleton-toolbar">
              <div className="skeleton skeleton-search" />
              <div className="skeleton skeleton-btn" />
              <div className="skeleton skeleton-btn" />
              <div className="skeleton skeleton-btn" />
              <div className="skeleton skeleton-density ms-auto" />
              <div className="skeleton skeleton-ico" />
              <div className="skeleton skeleton-ico" />
            </div>
            <div className="skeleton-quick">
              <div className="skeleton skeleton-chip" />
              <div className="skeleton skeleton-chip" />
              <div className="skeleton skeleton-chip" />
              <div className="skeleton skeleton-chip" />
              <div className="skeleton skeleton-chip" />
            </div>
          </div>
          <div className="skeleton-body">
            <div className="skeleton-row skeleton-thead">
              <span />
              <div className="skeleton skeleton-check" />
              <div className="skeleton skeleton-head" />
              <div className="skeleton skeleton-head" />
              <div className="skeleton skeleton-head" />
              <div className="skeleton skeleton-head" />
              <div className="skeleton skeleton-head skeleton-head-end" />
            </div>
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index}>{skeletonRow}</div>
            ))}
          </div>
        </div>

        <div className="live-content">
          <div
            className="bulk-selection"
            role="region"
            aria-label="Bulk actions"
            hidden={workspace.selected.length === 0}
          >
            <div className="bulk-selection-inner">
              <span className="bulk-selection-count">
                <b>{workspace.selected.length}</b> selected
              </span>
              <div className="d-flex flex-wrap gap-2">
                {(bulkActions ?? []).map((action) => (
                  <button
                    type="button"
                    className={`btn btn-sm${action.danger ? ' text-danger' : ''}`}
                    key={action.id}
                    onClick={() => action.onClick(workspace.selected)}
                  >
                    <i className={`${action.icon} me-1`} />
                    {action.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className="bulk-selection-close"
                aria-label="Clear selection"
                onClick={workspace.clearSelection}
              >
                <i className="ti ti-x" />
              </button>
            </div>
          </div>

          <CardTable
            rows={workspace.shown}
            columns={workspace.visibleColumns}
            getId={getId}
            selected={workspace.selected}
            onToggleSelect={workspace.toggleSelect}
            allShownSelected={workspace.allShownSelected}
            onToggleSelectAll={workspace.toggleSelectAll}
            expanded={workspace.expanded}
            onToggleExpand={workspace.toggleExpand}
            renderDetail={renderDetail}
            sort={workspace.sort}
            onSort={workspace.setSort}
            renderActions={renderActions}
            caption={caption}
            selectAllLabel={selectAllLabel}
            rowLabel={rowLabel}
          />

          {workspace.visible.length === 0 ? (
            <div className="workspace-empty-state">
              <div className="workspace-empty-art">
                <i className={emptyIcon} />
              </div>
              <h5>{emptyTitle}</h5>
              <p>{emptyBody}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  workspace.resetFilters();
                  onResetExtra?.();
                  onToast('Filters cleared');
                }}
              >
                <i className="ti ti-rotate me-1" />Reset filters
              </button>
            </div>
          ) : null}

          <div className="workspace-footer">
            <div className="workspace-footer-info">
              Showing <span className="range-from">{workspace.rangeStart}</span>–
              <span className="range-to">{workspace.rangeEnd}</span> of{' '}
              <span className="range-total">{workspace.visible.length}</span> {noun}
            </div>
            <div className="workspace-footer-size">
              <label className="mb-0" htmlFor={`${workspaceId}-rows`}>Rows:</label>
              <select
                className="form-select"
                id={`${workspaceId}-rows`}
                aria-label="Rows per page"
                value={workspace.pageSize}
                onChange={(event) => workspace.setPageSize(Number(event.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option value={size} key={size}>{size}</option>
                ))}
              </select>
            </div>
            <nav className="workspace-pagination" aria-label={`${noun} pagination`}>
              <button
                type="button"
                className="workspace-page-button"
                aria-label="First page"
                disabled={page === 1}
                onClick={() => workspace.setPage(1)}
              >
                <i className="ti ti-chevrons-left" />
              </button>
              <button
                type="button"
                className="workspace-page-button"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => workspace.setPage(Math.max(1, page - 1))}
              >
                <i className="ti ti-chevron-left" />
              </button>
              <span className="workspace-page-numbers">
                {numbers.map((number) => (
                  <button
                    type="button"
                    className={`workspace-page-button${number === page ? ' active' : ''}`}
                    aria-current={number === page ? 'page' : undefined}
                    key={number}
                    onClick={() => workspace.setPage(number)}
                  >
                    {number}
                  </button>
                ))}
              </span>
              <button
                type="button"
                className="workspace-page-button"
                aria-label="Next page"
                disabled={page === pageCount}
                onClick={() => workspace.setPage(Math.min(pageCount, page + 1))}
              >
                <i className="ti ti-chevron-right" />
              </button>
              <button
                type="button"
                className="workspace-page-button"
                aria-label="Last page"
                disabled={page === pageCount}
                onClick={() => workspace.setPage(pageCount)}
              >
                <i className="ti ti-chevrons-right" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardWorkspaceShell;
