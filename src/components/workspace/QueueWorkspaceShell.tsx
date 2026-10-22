import type { ReactNode } from 'react';
import type { UseWorkspaceResult } from './useWorkspace';
import type { ColumnDef, FilterField, SavedView } from './types';
import WorkspaceHeader from './WorkspaceHeader';
import type { WorkspaceMenu } from './WorkspaceHeader';

export interface QueueWorkspaceShellProps<T> {
  workspace: UseWorkspaceResult<T>;
  /** Only used to drive the Columns menu; these pages have no grid columns. */
  columns: ColumnDef<T>[];
  getId: (row: T) => string;
  totalCount: number;

  loading: boolean;
  /**
   * The wrapper's `id`. Several of these pages have a stylesheet scoped to that
   * id — `#expenseWorkspace`, `#categoryWorkspace` — so it has to be the id the
   * template carries, not a shortened one, or none of the rules match.
   */
  workspaceId?: string;

  searchPlaceholder: string;
  searchLabel: string;
  savedViews: SavedView[];
  filterFields: FilterField[];
  noun: string;

  openMenu: WorkspaceMenu;
  onOpenMenu: (menu: WorkspaceMenu) => void;
  onRefresh: () => void;
  onSaveView: () => void;
  onToast: (message: string, variant?: 'success' | 'danger' | 'info' | 'warning') => void;

  /** Left column heading, e.g. "Approval Queue". */
  queueTitle: string;
  queueIcon: string;
  /** Accessible name for the listbox. */
  queueLabel: string;
  /** One card in the queue. */
  renderCard: (row: T, selected: boolean) => ReactNode;
  /** Extra class on the queue container, e.g. "exp-queue". */
  queueClassName: string;

  selectedId: string | null;

  /** Right pane for the selected record. */
  renderDetail: (row: T) => ReactNode;

  emptyIcon: string;
  emptyTitle: string;
  emptyBody: string;
  emptyAction?: ReactNode;

  /** Shown when the filters exclude everything, above the queue. */
  noResultsText?: string;
  onResetExtra?: () => void;
}

function QueueWorkspaceShell<T>({
  workspace,
  columns,
  getId,
  totalCount,
  loading,
  workspaceId = 'expWorkspace',
  searchPlaceholder,
  searchLabel,
  savedViews,
  filterFields,
  noun,
  openMenu,
  onOpenMenu,
  onRefresh,
  onSaveView,
  onToast,
  queueTitle,
  queueIcon,
  queueLabel,
  renderCard,
  queueClassName,
  selectedId,
  renderDetail,
  emptyIcon,
  emptyTitle,
  emptyBody,
  emptyAction,
  noResultsText,
  onResetExtra,
}: QueueWorkspaceShellProps<T>) {
  const selected = workspace.visible.find((row) => getId(row) === selectedId) ?? null;

  return (
    <div className="card">
      <div
        className={`data-workspace${loading ? '' : ' is-loaded'}`}
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
          fullscreen={workspace.fullscreen}
          onFullscreen={workspace.toggleFullscreen}
          quickFilters={[]}
          quick={workspace.quick}
          onQuick={workspace.toggleQuick}
          sortOptions={[]}
          sort={workspace.sort}
          onSort={workspace.setSort}
          showQuickRail={false}
          chips={workspace.chips}
          onClearChip={workspace.clearChip}
          openMenu={openMenu}
          onOpenMenu={onOpenMenu}
        />

        {/* Same rule as CardWorkspaceShell: only `.hidden` takes the
            placeholder away, so it must be applied once loaded. */}
        <div className={`skeleton-loader${loading ? '' : ' hidden'}`} aria-hidden="true">
          <div className="row g-3">
            <div className="col-12 col-xl-4 col-lg-5">
              <div className="card mb-lg-0">
                <div className="card-body">
                  {Array.from({ length: 5 }, (_, index) => (
                    <div className="d-flex gap-3 mb-3" key={index}>
                      <div className="skeleton skeleton-avatar" />
                      <div className="skeleton-stack flex-fill">
                        <div className="skeleton skeleton-line" />
                        <div className="skeleton skeleton-line skeleton-thin" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-8 col-lg-7">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex gap-3 mb-3">
                    <div className="skeleton skeleton-avatar" />
                    <div className="skeleton-stack flex-fill">
                      <div className="skeleton skeleton-line" />
                      <div className="skeleton skeleton-line skeleton-thin" />
                    </div>
                  </div>
                  <div className="skeleton skeleton-line" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                  <div className="skeleton skeleton-line skeleton-thin" />
                  <div className="d-flex gap-2 mt-3">
                    <div className="skeleton skeleton-btn" />
                    <div className="skeleton skeleton-btn" />
                    <div className="skeleton skeleton-btn" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="live-content">
          <div className="row g-3">
            <div className="col-12 col-xl-4 col-lg-5">
              <div className="card mb-lg-0">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="mb-0 fs-16 fw-medium">
                    <i className={`${queueIcon} me-2 text-primary`} />{queueTitle}
                  </h4>
                  <span className="badge badge-soft-primary">
                    <span>{workspace.visible.length}</span> {noun}
                  </span>
                </div>
                <div className="card-body">
                  <div className={queueClassName} role="listbox" aria-label={queueLabel}>
                    {workspace.visible.length === 0 ? (
                      <p className="fs-13 text-muted mb-0 text-center py-4">
                        {noResultsText ?? `No ${noun} match the current filters.`}
                      </p>
                    ) : (
                      workspace.visible.map((row) => {
                        const id = getId(row);
                        return (
                          <div key={id} role="option" aria-selected={id === selectedId}>
                            {renderCard(row, id === selectedId)}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-8 col-lg-7">
              <div className="exp-detail-wrap">
                {selected ? (
                  <div className="exp-detail-live">{renderDetail(selected)}</div>
                ) : (
                  <div className="card exp-empty">
                    <div className="card-body text-center py-5">
                      <span className="avatar avatar-xl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3 d-inline-flex align-items-center justify-content-center">
                        <i className={`${emptyIcon} fs-24`} />
                      </span>
                      <h5>{emptyTitle}</h5>
                      <p className="text-muted">{emptyBody}</p>
                      {emptyAction}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QueueWorkspaceShell;
