import type { ReactNode } from 'react';
import type { UseWorkspaceResult } from './useWorkspace';
import type { ColumnDef, FilterField, QuickFilter, SavedView, SortOption } from './types';
import WorkspaceHeader from './WorkspaceHeader';
import type { WorkspaceMenu } from './WorkspaceHeader';
import SummaryCard from './SummaryCard';
import type { SummaryItem } from './SummaryCard';

export interface GridStatusCount {
  /** `message-status-badge` modifier — `is-live`, `is-scheduled`, `is-draft`… */
  tone: string;
  icon: string;
  label: string;
}

export interface GridWorkspaceShellProps<T> {
  workspace: UseWorkspaceResult<T>;
  /** Sort targets only; this shell draws no columns. */
  columns: ColumnDef<T>[];
  getId: (row: T) => string;
  totalCount: number;

  searchPlaceholder: string;
  searchLabel: string;
  savedViews: SavedView[];
  filterFields: FilterField[];
  quickFilters: QuickFilter[];
  sortOptions: SortOption[];
  noun: string;

  openMenu: WorkspaceMenu;
  onOpenMenu: (menu: WorkspaceMenu) => void;
  workspaceId?: string;
  onRefresh: () => void;
  onSaveView: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;

  /** The sentence above the grid, left of the status rail. */
  caption: ReactNode;
  /** The badges at its right — live / scheduled / draft counts. */
  statusCounts?: GridStatusCount[];
  /** Bootstrap column classes for one card, e.g. "col-xxl-3 col-lg-6 col-md-6". */
  cardClassName: string;
  renderCard: (row: T) => ReactNode;

  emptyIcon: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction?: ReactNode;

  summary?: SummaryItem[];
  /** Rendered between the summary strip and the workspace card. */
  beforeWorkspace?: ReactNode;
  /** Drawn after the grid, inside the same card body. */
  afterGrid?: ReactNode;
  onResetExtra?: () => void;
}

function GridWorkspaceShell<T>({
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
  onRefresh,
  onSaveView,
  onToast,
  caption,
  statusCounts,
  cardClassName,
  renderCard,
  emptyIcon,
  emptyTitle,
  emptyBody,
  emptyAction,
  summary,
  beforeWorkspace,
  afterGrid,
  onResetExtra,
}: GridWorkspaceShellProps<T>) {
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
            columnOptions={columns.map((column) => ({ id: column.id, label: column.label }))}
            columns={workspace.columns}
            onToggleColumn={workspace.toggleColumn}
            onShowAllColumns={workspace.showAllColumns}
            showColumns={false}
            showDensity={false}
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

          <div className="card-body">
            <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
              <p className="fs-13 text-muted mb-0">{caption}</p>
              {statusCounts && statusCounts.length > 0 ? (
                <div className="d-inline-flex align-items-center gap-2">
                  {statusCounts.map((count) => (
                    <span className={`message-status-badge ${count.tone}`} key={count.label}>
                      <i className={count.icon} />{count.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {workspace.visible.length === 0 ? (
              <div className="workspace-empty-state text-center py-5">
                <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
                  <i className={`${emptyIcon} fs-36`} />
                </span>
                <h5 className="mb-1">{emptyTitle}</h5>
                <p className="text-muted mb-3">{emptyBody}</p>
                {emptyAction}
              </div>
            ) : (
              <div className="row g-3">
                {/* The template draws every match; there is no pager under the grid. */}
                {workspace.visible.map((row) => (
                  <div className={cardClassName} key={getId(row)}>
                    {renderCard(row)}
                  </div>
                ))}
              </div>
            )}

            {afterGrid}
          </div>
        </div>
      </div>
    </>
  );
}

export default GridWorkspaceShell;
