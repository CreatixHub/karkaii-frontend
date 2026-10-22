import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { UseWorkspaceResult } from './useWorkspace';
import type { ColumnDef, FilterField, QuickFilter, SavedView, SortOption } from './types';
import WorkspaceHeader from './WorkspaceHeader';
import type { WorkspaceMenu } from './WorkspaceHeader';
import ExpandableTable from './ExpandableTable';
import FilterControl from './FilterControl';
import SummaryStrip from './SummaryStrip';
import type { SummaryStripItem } from './SummaryStrip';

/** One choice in Band 1's scope group. */
export interface ReportScope {
  id: string;
  label: string;
  icon: string;
}

/** One button on the selection toolbar, shown once rows are ticked. */
export interface ReportBulkAction {
  id: string;
  label: string;
  icon: string;
  onClick: (selected: string[]) => void;
}

export interface ReportWorkspaceShellProps<T> {
  workspace: UseWorkspaceResult<T>;
  columns: ColumnDef<T>[];
  getId: (row: T) => string;
  totalCount: number;

  /* ------------------------------- Band 1 -------------------------------- */
  /** "Report on:" on the report pages, "Show:" on Custom Reports. */
  scopeLabel: string;
  scopeAriaLabel: string;
  scopes: ReportScope[];
  scope: string;
  onScope: (id: string) => void;
  /** The `badge-soft-primary` record count, e.g. "1,486 records". */
  scopeCount: ReactNode;
  /** Generate / Save Template / the export icon rail. */
  bandActions: ReactNode;

  /* ------------------------------- Band 2 -------------------------------- */
  searchLabel: string;
  searchPlaceholder: string;
  /** Grid classes for the search cell; the templates vary its width. */
  searchSpan?: string;
  /** The line beside the chevron while the accordion is closed. */
  filterSummary: string;
  filterFields: FilterField[];

  /* ------------------------------- Band 3 -------------------------------- */
  savedViews: SavedView[];
  quickFilters: QuickFilter[];
  sortOptions: SortOption[];
  /** Plural noun for the panel footer, empty state and pager copy. */
  noun: string;
  openMenu: WorkspaceMenu;
  onOpenMenu: (menu: WorkspaceMenu) => void;
  /** Custom Reports is the only one of the seven that ships the chip rail. */
  showChips?: boolean;

  /* ------------------------------- Results ------------------------------- */
  summary: SummaryStripItem[];
  bulkActions?: ReportBulkAction[];
  /** Singular/plural noun on the selection count, e.g. "record". */
  selectionNoun?: string;
  caption: string;
  selectAllLabel?: string;
  renderDetail?: (row: T) => ReactNode;
  renderActions?: (row: T) => ReactNode;
  /** Trailing clause on the pager's info line, e.g. "96 working days". */
  footerInfoSuffix?: string;
  pageSizeOptions?: number[];
  workspaceId?: string;

  emptyIcon: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction?: ReactNode;

  onRefresh: () => void;
  onSaveView: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;
  /** Extra reset work the page owns, e.g. returning the scope to its default. */
  onResetExtra?: () => void;

  /** Rendered between the builder card and the results card. */
  betweenCards?: ReactNode;
}

export interface ReportPageHeaderProps {
  title: string;
  section: string;
  dashboardTo: string;
  actions?: ReactNode;
}

/**
 * The report page header. Same markup as the Finance one, but the Reports
 * templates comment their action rail "Reference actions only. Everything that
 * builds, filters or exports the report lives in the single toolbar below."
 */
export const ReportPageHeader = ({ title, section, dashboardTo, actions }: ReportPageHeaderProps) => (
  <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
    <div className="my-auto mb-2">
      <h3 className="page-title mb-1">{title}</h3>
      <nav>
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item">
            <Link to={dashboardTo}>Dashboard</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="#">{section}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {title}
          </li>
        </ol>
      </nav>
    </div>
    <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">{actions}</div>
  </div>
);

function ReportWorkspaceShell<T>({
  workspace,
  columns,
  getId,
  totalCount,
  scopeLabel,
  scopeAriaLabel,
  scopes,
  scope,
  onScope,
  scopeCount,
  bandActions,
  searchLabel,
  searchPlaceholder,
  searchSpan = 'col-xxl-3 col-lg-4 col-md-6',
  filterSummary,
  filterFields,
  savedViews,
  quickFilters,
  sortOptions,
  noun,
  openMenu,
  onOpenMenu,
  showChips = false,
  summary,
  bulkActions,
  selectionNoun = 'record',
  caption,
  selectAllLabel,
  renderDetail,
  renderActions,
  footerInfoSuffix,
  pageSizeOptions = [8, 25, 50, 100],
  workspaceId = 'report',
  emptyIcon,
  emptyTitle,
  emptyBody,
  emptyAction,
  onRefresh,
  onSaveView,
  onToast,
  onResetExtra,
  betweenCards,
}: ReportWorkspaceShellProps<T>) {
  /* The accordion ships collapsed in all seven templates. */
  const [filtersOpen, setFiltersOpen] = useState(false);

  const bandFields = filterFields.filter((field) => field.surface === 'band');
  const selectedCount = workspace.selected.length;

  const { page, pageCount } = workspace;
  const windowStart = Math.max(1, Math.min(page - 2, pageCount - 4));
  const numbers = Array.from({ length: Math.min(5, pageCount) }, (_, index) => windowStart + index).filter(
    (number) => number <= pageCount,
  );

  const resetAll = () => {
    workspace.resetFilters();
    onResetExtra?.();
    onToast('Filters cleared');
  };

  return (
    <>
      <div className="data-workspace page-toolbar-compact">
        {/* ---------------------------- The builder ---------------------------- */}
        <div className="card">
          <div className="card-body">

            {/* Band 1 — what the report covers */}
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center flex-wrap gap-2">
                <span className="fs-12 text-muted fw-semibold me-1">{scopeLabel}</span>
                <div
                  className="custom-btn-group custom-btn-group-fill custom-btn-group-sm"
                  role="group"
                  aria-label={scopeAriaLabel}
                >
                  {scopes.map((item) => (
                    <span key={item.id}>
                      <input
                        type="radio"
                        className="btn-check"
                        name={`${workspaceId}-scope`}
                        id={`${workspaceId}-${item.id}`}
                        checked={scope === item.id}
                        onChange={() => onScope(item.id)}
                      />
                      <label className="btn" htmlFor={`${workspaceId}-${item.id}`}>
                        <i className={`${item.icon} me-1`} />
                        {item.label}
                      </label>
                    </span>
                  ))}
                </div>
                <span className="badge badge-soft-primary">
                  <i className="ti ti-database me-1" />
                  {scopeCount}
                </span>
              </div>
              <div className="d-flex align-items-center flex-wrap gap-2">{bandActions}</div>
            </div>

            {/*
              Band 2 — narrow the report down.

              Collapsed on load so the grid starts higher up the page. The
              header line keeps the active filters readable while the fields are
              hidden.
            */}
            <div className="border-top mt-3 pt-3">
              <div className="accordion accordion-flush">
                <div className="accordion-item border-0 bg-transparent">
                  <h2 className="accordion-header">
                    <button
                      className={`accordion-button p-0 bg-transparent shadow-none${filtersOpen ? '' : ' collapsed'}`}
                      type="button"
                      aria-expanded={filtersOpen}
                      aria-controls={`${workspaceId}-filters`}
                      onClick={() => setFiltersOpen(!filtersOpen)}
                    >
                      <span className="fs-12 text-muted fw-semibold me-2">
                        <i className="ti ti-filter me-1" />
                        Filters
                      </span>
                      {workspace.chips.length > 0 ? (
                        <span className="badge badge-soft-primary me-2">{workspace.chips.length} active</span>
                      ) : null}
                      <span className="fs-12 text-muted d-none d-lg-inline">{filterSummary}</span>
                    </button>
                  </h2>
                  <div
                    id={`${workspaceId}-filters`}
                    className={`accordion-collapse collapse${filtersOpen ? ' show' : ''}`}
                  >
                    <div className="accordion-body p-0 pt-3">
                      <div className="row g-2 align-items-end">
                        <div className={searchSpan}>
                          <label className="form-label mb-1 fs-12" htmlFor={`${workspaceId}-search`}>
                            Search
                          </label>
                          <div className="input-icon-start position-relative">
                            <span className="icon-addon">
                              <i className="ti ti-search" />
                            </span>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              placeholder={searchPlaceholder}
                              aria-label={searchLabel}
                              id={`${workspaceId}-search`}
                              value={workspace.search}
                              onChange={(event) => workspace.setSearch(event.target.value)}
                            />
                          </div>
                        </div>

                        {bandFields.map((field) => (
                          <div className={field.span ?? 'col-xxl-2 col-lg-4 col-md-6'} key={field.id}>
                            <label className="form-label mb-1 fs-12" htmlFor={field.id}>
                              {field.label}
                            </label>
                            <FilterControl
                              field={field}
                              value={workspace.draft[field.id] ?? ''}
                              onChange={(value) => {
                                workspace.setDraftField(field.id, value);
                                /*
                                 * Band 2 has no Apply button — the template
                                 * gives it only Reset and Refresh — so a field
                                 * here commits as it changes, the way an inline
                                 * filter bar behaves anywhere else.
                                 */
                                workspace.applyDraftField(field.id, value);
                              }}
                              small
                            />
                          </div>
                        ))}

                        <div className="col-xxl-2 col-lg-4 col-md-6">
                          <div className="d-flex align-items-center gap-2">
                            <button type="button" className="btn btn-sm btn-light flex-fill" onClick={resetAll}>
                              <i className="ti ti-restore me-1" />
                              Reset
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white btn-icon"
                              title="Refresh"
                              aria-label="Refresh"
                              onClick={onRefresh}
                            >
                              <i className="ti ti-refresh" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Band 3 — how the grid below is displayed */}
            <div className="border-top mt-3 pt-3">
              <WorkspaceHeader
                bare
                showSearch={false}
                showRefresh={false}
                sortInToolbar
                showChips={showChips}
                filterLabel="More Filters"
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
                onResetFilters={resetAll}
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
            </div>
          </div>
        </div>

        {betweenCards}

        {/* ---------------------------- The results ---------------------------- */}
        <div className="card">
          <SummaryStrip items={summary} />

          {selectedCount > 0 && bulkActions?.length ? (
            <div className="selection-toolbar show">
              <span className="selection-toolbar-count">
                <span className="selection-toolbar-badge">{selectedCount}</span>
                {selectedCount === 1 ? `${selectionNoun} selected` : `${selectionNoun}s selected`}
              </span>
              <div className="selection-toolbar-actions">
                {bulkActions.map((action) => (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    key={action.id}
                    onClick={() => action.onClick(workspace.selected)}
                  >
                    <i className={`${action.icon} me-1`} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <ExpandableTable
            rows={workspace.shown}
            columns={workspace.visibleColumns}
            getId={getId}
            caption={caption}
            selectAllLabel={selectAllLabel}
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
          />

          {workspace.visible.length === 0 ? (
            <div className="workspace-empty-state text-center py-5">
              <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                <i className={`${emptyIcon} fs-36`} />
              </span>
              <h5 className="mb-1">{emptyTitle}</h5>
              <p className="text-muted mb-3">{emptyBody}</p>
              {emptyAction}
            </div>
          ) : null}

          <div className="card-foot">
            <div className="card-foot-info">
              Showing{' '}
              <span>
                {workspace.rangeStart}–{workspace.rangeEnd}
              </span>{' '}
              of <span>{workspace.visible.length}</span> {noun}
              {footerInfoSuffix ? ` · ${footerInfoSuffix}` : null}
            </div>
            <div className="card-foot-size">
              <label className="mb-0" htmlFor={`${workspaceId}-rows`}>
                Rows:
              </label>
              <select
                className="form-select"
                id={`${workspaceId}-rows`}
                aria-label="Rows per page"
                value={workspace.pageSize}
                onChange={(event) => workspace.setPageSize(Number(event.target.value))}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size}>{size}</option>
                ))}
              </select>
            </div>
            <div className="card-pagination">
              <button
                type="button"
                className="card-page-btn"
                aria-label="First page"
                disabled={page === 1}
                onClick={() => workspace.setPage(1)}
              >
                <i className="ti ti-chevrons-left" />
              </button>
              <button
                type="button"
                className="card-page-btn"
                aria-label="Previous page"
                disabled={page === 1}
                onClick={() => workspace.setPage(Math.max(1, page - 1))}
              >
                <i className="ti ti-chevron-left" />
              </button>
              <span className="card-page-numbers">
                {numbers.map((number) => (
                  <button
                    type="button"
                    className={`card-page-btn${page === number ? ' active' : ''}`}
                    key={number}
                    aria-current={page === number ? 'page' : undefined}
                    onClick={() => workspace.setPage(number)}
                  >
                    {number}
                  </button>
                ))}
              </span>
              <button
                type="button"
                className="card-page-btn"
                aria-label="Next page"
                disabled={page === pageCount}
                onClick={() => workspace.setPage(Math.min(pageCount, page + 1))}
              >
                <i className="ti ti-chevron-right" />
              </button>
              <button
                type="button"
                className="card-page-btn"
                aria-label="Last page"
                disabled={page === pageCount}
                onClick={() => workspace.setPage(pageCount)}
              >
                <i className="ti ti-chevrons-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportWorkspaceShell;
