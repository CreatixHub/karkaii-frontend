import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { UseWorkspaceResult } from './useWorkspace';
import type { ColumnDef, QuickFilter, SavedView, SortOption, FilterField } from './types';
import WorkspaceHeader from './WorkspaceHeader';
import type { WorkspaceMenu } from './WorkspaceHeader';
import ExpandableTable from './ExpandableTable';
import SummaryCard from './SummaryCard';
import type { SummaryItem } from './SummaryCard';

export interface PageHeaderProps {
  title: string;
  /** Middle breadcrumb entry; Dashboard and the title are added automatically. */
  section: string;
  dashboardTo: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, section, dashboardTo, actions }: PageHeaderProps) => (
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

export interface WorkspaceShellProps<T> {
  workspace: UseWorkspaceResult<T>;
  /** Full column set, including permanent ones; the Columns menu skips those. */
  columns: ColumnDef<T>[];
  getId: (row: T) => string;
  totalCount: number;

  searchPlaceholder: string;
  searchLabel: string;
  savedViews: SavedView[];
  filterFields: FilterField[];
  quickFilters: QuickFilter[];
  sortOptions: SortOption[];
  /** Plural noun for the filter footer, empty state and pagination copy. */
  noun: string;

  openMenu: WorkspaceMenu;
  onOpenMenu: (menu: WorkspaceMenu) => void;
  /** Icon buttons the variant-A templates slot between Refresh and Fullscreen. */
  toolbarExtra?: ReactNode;
  /**
   * Which footer the template draws.
   *
   * `card-footer` is the Finance rendering — Bootstrap's `.pagination` pills
   * with Previous/Next. `card-foot` is the markup the Campus Operations
   * templates actually ship: `.card-foot-info`, a real rows-per-page select and
   * a `.card-page-btn` rail with first/last chevrons. Both class trees are
   * styled in `_data-table.scss`; they are not interchangeable.
   *
   * Defaults to `card-footer` so the existing Finance pages are untouched.
   */
  footerVariant?: 'card-footer' | 'card-foot';
  /** Rows-per-page choices; the Campus Operations templates offer 8/25/50/100. */
  pageSizeOptions?: number[];
  /** Trailing clause on the footer info line, e.g. "register as at 15:40". */
  footerInfoSuffix?: string;
  /** Used to keep the rows-per-page select's id unique between pages. */
  workspaceId?: string;
  onRefresh: () => void;
  onSaveView: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;

  renderDetail?: (row: T) => ReactNode;
  renderActions?: (row: T) => ReactNode;

  emptyIcon: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction?: ReactNode;

  summary?: SummaryItem[];
  /** Rendered between the summary strip and the workspace card. */
  beforeWorkspace?: ReactNode;
  /** Extra reset work the page owns, e.g. clearing a card selection. */
  onResetExtra?: () => void;
}

function WorkspaceShell<T>({
  workspace,
  columns,
  getId,
  totalCount,
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
  footerVariant = 'card-footer',
  pageSizeOptions = [8, 25, 50, 100],
  footerInfoSuffix,
  workspaceId = 'workspace',
  onRefresh,
  onSaveView,
  onToast,
  renderDetail,
  renderActions,
  emptyIcon,
  emptyTitle,
  emptyBody,
  emptyAction,
  summary,
  beforeWorkspace,
  onResetExtra,
}: WorkspaceShellProps<T>) {
  const pages = Array.from({ length: workspace.pageCount }, (_, index) => index + 1);

  /** A short window around the current page, matching the variant-A rail. */
  const windowStart = Math.max(1, Math.min(workspace.page - 2, workspace.pageCount - 4));
  const numbers = Array.from(
    { length: Math.min(5, workspace.pageCount) },
    (_, index) => windowStart + index,
  ).filter((number) => number <= workspace.pageCount);

  return (
    <>
      {summary ? <SummaryCard items={summary} /> : null}
      {beforeWorkspace}

      <div className="data-workspace page-toolbar-compact">
        <div className="card">
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

          <ExpandableTable
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

          {footerVariant === 'card-foot' ? (
            <div className="card-foot">
              <div className="card-foot-info">
                Showing <span>{workspace.rangeStart}–{workspace.rangeEnd}</span> of{' '}
                <span>{workspace.visible.length}</span> {noun}
                {footerInfoSuffix ? ` · ${footerInfoSuffix}` : null}
              </div>
              <div className="card-foot-size">
                <label className="mb-0" htmlFor={`${workspaceId}-rows`}>Rows:</label>
                <select
                  className="form-select"
                  id={`${workspaceId}-rows`}
                  aria-label="Rows per page"
                  value={workspace.pageSize}
                  onChange={(event) => workspace.setPageSize(Number(event.target.value))}
                >
                  {pageSizeOptions.map((size) => <option key={size}>{size}</option>)}
                </select>
              </div>
              <div className="card-pagination">
                <button
                  type="button" className="card-page-btn" aria-label="First page"
                  disabled={workspace.page === 1} onClick={() => workspace.setPage(1)}
                >
                  <i className="ti ti-chevrons-left" />
                </button>
                <button
                  type="button" className="card-page-btn" aria-label="Previous page"
                  disabled={workspace.page === 1}
                  onClick={() => workspace.setPage(Math.max(1, workspace.page - 1))}
                >
                  <i className="ti ti-chevron-left" />
                </button>
                <span className="card-page-numbers">
                  {numbers.map((number) => (
                    <button
                      type="button"
                      className={`card-page-btn${workspace.page === number ? ' active' : ''}`}
                      key={number}
                      aria-current={workspace.page === number ? 'page' : undefined}
                      onClick={() => workspace.setPage(number)}
                    >
                      {number}
                    </button>
                  ))}
                </span>
                <button
                  type="button" className="card-page-btn" aria-label="Next page"
                  disabled={workspace.page === workspace.pageCount}
                  onClick={() => workspace.setPage(Math.min(workspace.pageCount, workspace.page + 1))}
                >
                  <i className="ti ti-chevron-right" />
                </button>
                <button
                  type="button" className="card-page-btn" aria-label="Last page"
                  disabled={workspace.page === workspace.pageCount}
                  onClick={() => workspace.setPage(workspace.pageCount)}
                >
                  <i className="ti ti-chevrons-right" />
                </button>
              </div>
            </div>
          ) : (
          <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
            <p className="mb-0 text-muted">
              Showing {workspace.rangeStart} to {workspace.rangeEnd} of {workspace.visible.length} {noun}
            </p>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item${workspace.page === 1 ? ' disabled' : ''}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => workspace.setPage(Math.max(1, workspace.page - 1))}
                  >
                    Previous
                  </button>
                </li>
                {pages.map((number) => (
                  <li className={`page-item${workspace.page === number ? ' active' : ''}`} key={number}>
                    <button type="button" className="page-link" onClick={() => workspace.setPage(number)}>
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item${workspace.page === workspace.pageCount ? ' disabled' : ''}`}>
                  <button
                    type="button"
                    className="page-link"
                    onClick={() => workspace.setPage(Math.min(workspace.pageCount, workspace.page + 1))}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

export default WorkspaceShell;
