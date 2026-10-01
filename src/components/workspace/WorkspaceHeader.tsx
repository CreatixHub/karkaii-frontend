import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import FilterControl from './FilterControl';
import type { Density, FilterField, QuickFilter, SavedView, SortOption } from './types';
import type { ActiveChip } from './types';

export type WorkspaceMenu = 'views' | 'filter' | 'columns' | 'sort' | null;

export interface WorkspaceHeaderProps {
  /** Placeholder and aria-label for the search box, per page. */
  searchPlaceholder: string;
  /**
   * Render the search box. The Reports templates move search into Band 2 of
   * the report toolbar, beside the date range it is read with, so their Band 3
   * toolbar opens straight onto Saved Views.
   */
  showSearch?: boolean;
  /**
   * Drop the `.card-header` wrapper. The report toolbar's third band sits
   * inside a `.border-top` div in a shared `.card-body`, not in a header of
   * its own.
   */
  bare?: boolean;
  searchLabel: string;
  search: string;
  onSearch: (value: string) => void;

  savedViews: SavedView[];
  view: string;
  onView: (view: string) => void;
  onSaveView: () => void;

  filterFields: FilterField[];
  draft: Record<string, string>;
  onDraftField: (id: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  /**
   * Copy on the filter button. The report pages say "More Filters", because
   * their panel holds only what Band 2 does not already offer.
   */
  filterLabel?: string;
  /** Fills the panel footer: "<b>match</b> of total noun match". */
  matchCount: number;
  totalCount: number;
  matchNoun: string;

  /** Column ids and labels for the Columns menu; permanent columns are omitted. */
  columnOptions: { id: string; label: string }[];
  columns: Record<string, boolean>;
  onToggleColumn: (id: string) => void;
  onShowAllColumns: () => void;
  /**
   * Render the Columns menu and the density toggle. The Communication
   * templates have no grid to reshape — their body is a card grid — so their
   * toolbar ships neither control.
   */
  showColumns?: boolean;
  showDensity?: boolean;
  /**
   * Replaces the density toggle in its slot. Notice Board puts a grid/list
   * view switch there, in the same `.density-toggle` markup.
   */
  densitySlot?: ReactNode;

  density: Density;
  onDensity: (density: Density) => void;
  onRefresh: () => void;
  /**
   * Render the Refresh button. The report toolbar pairs Refresh with Reset at
   * the end of Band 2's field grid instead, so Band 3 goes density → fullscreen.
   */
  showRefresh?: boolean;
  /**
   * Icon buttons the template slots between Refresh and Fullscreen. The
   * variant-A pages all carry one — "Print Labels" on Books, "Print" on Hostel
   * List and Sports, "Print Sheet" on Transport Routes; the variant-B pages
   * carry none.
   */
  toolbarExtra?: ReactNode;
  fullscreen: boolean;
  onFullscreen: () => void;

  quickFilters: QuickFilter[];
  quick: string | null;
  onQuick: (id: string) => void;

  sortOptions: SortOption[];
  /**
   * Render the `.quick-filters` rail. The three approval-queue pages (Expenses,
   * Expense Category, Income) ship a toolbar with no quick filters and no Sort
   * menu, so the whole rail is omitted there rather than rendered empty.
   */
  showQuickRail?: boolean;
  /**
   * Render the Sort dropdown at the end of the quick rail. Send SMS puts a
   * "Start from" template menu there instead, and has no sort order of its own.
   */
  showSort?: boolean;
  /** Rendered in the Sort dropdown's place when `showSort` is false. */
  quickRailExtra?: ReactNode;
  /**
   * Put Sort in the toolbar row after Columns rather than at the end of the
   * quick rail. The Finance and Campus Operations templates use the rail; the
   * Reports templates use the toolbar.
   */
  sortInToolbar?: boolean;
  sort: string;
  onSort: (sort: string) => void;

  chips: ActiveChip[];
  onClearChip: (id: string) => void;
  /**
   * Render the `.filter-chips` rail. Six of the seven report toolbars end at
   * the quick rail; only Custom Reports ships the chips.
   */
  showChips?: boolean;

  openMenu: WorkspaceMenu;
  onOpenMenu: (menu: WorkspaceMenu) => void;
}

const WorkspaceHeader = ({
  searchPlaceholder,
  searchLabel,
  showSearch = true,
  bare = false,
  search,
  onSearch,
  savedViews,
  view,
  onView,
  onSaveView,
  filterFields,
  draft,
  onDraftField,
  onApplyFilters,
  onResetFilters,
  filterLabel = 'Filters',
  matchCount,
  totalCount,
  matchNoun,
  columnOptions,
  columns,
  onToggleColumn,
  onShowAllColumns,
  showColumns = true,
  showDensity = true,
  densitySlot,
  density,
  onDensity,
  onRefresh,
  showRefresh = true,
  toolbarExtra,
  fullscreen,
  onFullscreen,
  quickFilters,
  quick,
  onQuick,
  sortOptions,
  showQuickRail = true,
  showSort = true,
  quickRailExtra,
  sortInToolbar = false,
  sort,
  onSort,
  chips,
  onClearChip,
  showChips = true,
  openMenu,
  onOpenMenu,
}: WorkspaceHeaderProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Outside click / Escape closes whichever menu is open, as Bootstrap does.
  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!barRef.current?.contains(event.target as Node)) onOpenMenu(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu, onOpenMenu]);

  // The search box advertises ⌘K, so make the shortcut work.
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const toggle = (menu: WorkspaceMenu) => () => onOpenMenu(openMenu === menu ? null : menu);

  /** Band-2 fields render in the report toolbar, not in this panel. */
  const menuFields = filterFields.filter((field) => (field.surface ?? 'menu') === 'menu');

  /**
   * One Sort dropdown, rendered in whichever rail the template puts it in.
   * `ms-auto` pushes it to the end of the quick rail; the toolbar copy sits
   * inline after Columns, so it takes no alignment class.
   */
  const sortMenu = (className?: string) => (
    <div className={className ? `dropdown ${className}` : 'dropdown'}>
      <button
        type="button"
        className="workspace-button dropdown-toggle"
        aria-expanded={openMenu === 'sort'}
        onClick={toggle('sort')}
      >
        <i className="ti ti-sort-ascending-2" />
        Sort
      </button>
      <ul className={`dropdown-menu${className ? ' dropdown-menu-end' : ''}${openMenu === 'sort' ? ' show' : ''}`}>
        <li className="context-menu-head">Sort by</li>
        {sortOptions.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              className={`dropdown-item${sort === option.id ? ' active' : ''}`}
              onClick={() => {
                onSort(option.id);
                onOpenMenu(null);
              }}
            >
              <i className={option.icon} />
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  const densityButtons: { id: Density; title: string; icon: string }[] = [
    { id: 'compact', title: 'Compact', icon: 'ti ti-baseline-density-small' },
    { id: 'default', title: 'Default', icon: 'ti ti-baseline-density-medium' },
    { id: 'comfortable', title: 'Comfortable', icon: 'ti ti-baseline-density-large' },
  ];

  return (
    <div className={bare ? undefined : 'card-header border-bottom'} ref={barRef}>
      <div className="page-toolbar">
        {/* Advanced Search */}
        {showSearch ? (
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            type="text"
            ref={searchRef}
            placeholder={searchPlaceholder}
            aria-label={searchLabel}
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          <span className="search-toolbar-kbd">⌘K</span>
        </div>
        ) : null}

        {/* Saved Views */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'views'}
            onClick={toggle('views')}
          >
            <i className="ti ti-bookmark" />
            Saved Views
          </button>
          <ul className={`dropdown-menu${openMenu === 'views' ? ' show' : ''}`}>
            <li className="context-menu-head">My Views</li>
            {savedViews.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`dropdown-item${view === item.id ? ' active' : ''}`}
                  onClick={() => {
                    onView(item.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={item.icon} />
                  {item.label}
                  {item.count === undefined ? null : <span className="view-count">{item.count}</span>}
                </button>
              </li>
            ))}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item text-primary"
                onClick={() => {
                  onSaveView();
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-plus" />
                Save current view
              </button>
            </li>
          </ul>
        </div>

        {/* Advanced Filter */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'filter'}
            onClick={toggle('filter')}
          >
            <i className="ti ti-adjustments-horizontal" />
            {filterLabel}
            {chips.length > 0 ? <span className="result-count">{chips.length}</span> : null}
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filter' ? ' show' : ''}`}>
            <div className="row g-3">
              {menuFields.map((field) => (
                <div className={field.kind === 'toggle' ? 'col-12' : 'col-6'} key={field.id}>
                  {field.kind === 'toggle' ? null : (
                    <label className="form-label mb-1" htmlFor={field.id}>
                      {field.label}
                    </label>
                  )}
                  <FilterControl
                    field={field}
                    value={draft[field.id] ?? ''}
                    onChange={(value) => onDraftField(field.id, value)}
                  />
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b>{matchCount}</b> of {totalCount} {matchNoun} match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onApplyFilters();
                    onOpenMenu(null);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column Visibility */}
        {showColumns ? (
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'columns'}
            onClick={toggle('columns')}
          >
            <i className="ti ti-columns-3" />
            Columns
          </button>
          <ul className={`dropdown-menu p-2 column-menu${openMenu === 'columns' ? ' show' : ''}`}>
            <li className="context-menu-head">Toggle columns</li>
            {columnOptions.map((column) => (
              <li key={column.id}>
                <label className="dropdown-item">
                  <input
                    className="form-check-input me-2 mt-0"
                    type="checkbox"
                    checked={columns[column.id] !== false}
                    onChange={() => onToggleColumn(column.id)}
                  />
                  {column.label}
                </label>
              </li>
            ))}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button type="button" className="dropdown-item text-primary" onClick={onShowAllColumns}>
                <i className="ti ti-rotate" />
                Show all columns
              </button>
            </li>
          </ul>
        </div>
        ) : null}

        {showSort && sortInToolbar ? sortMenu() : null}

        <span className="flex-grow-1" />

        {/* Density, or whatever the page puts in its place */}
        {densitySlot}
        {showDensity ? (
        <div className="density-toggle" role="group" aria-label="Row density">
          {densityButtons.map((button) => (
            <button
              type="button"
              key={button.id}
              className={density === button.id ? 'active' : undefined}
              title={button.title}
              aria-label={`${button.title} rows`}
              aria-pressed={density === button.id}
              onClick={() => onDensity(button.id)}
            >
              <i className={button.icon} />
            </button>
          ))}
        </div>
        ) : null}

        {showRefresh ? (
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Refresh"
          aria-label="Refresh"
          onClick={onRefresh}
        >
          <i className="ti ti-refresh" />
        </button>
        ) : null}

        {toolbarExtra}

        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Fullscreen"
          aria-label="Toggle fullscreen"
          aria-pressed={fullscreen}
          onClick={onFullscreen}
        >
          <i className="ti ti-arrows-maximize" />
        </button>
      </div>

      {/* Quick filters */}
      {showQuickRail ? (
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
        {quickFilters.map((filter) => (
          <button
            type="button"
            className={`quick-filter${quick === filter.id ? ' active' : ''}`}
            key={filter.id}
            aria-pressed={quick === filter.id}
            onClick={() => onQuick(filter.id)}
          >
            <i className={filter.icon} />
            {filter.label}
            {filter.count === undefined ? null : <span className="quick-filter-count">{filter.count}</span>}
          </button>
        ))}

        {/* Sort — in this rail in the Finance templates, in the toolbar in Reports. */}
        {showSort && !sortInToolbar ? sortMenu('ms-auto') : <span className="ms-auto">{quickRailExtra}</span>}
      </div>
      ) : null}

      {/* Active filter chips */}
      {showChips ? (
      <div className="filter-chips" aria-live="polite">
        {chips.map((chip) => (
          <span className="filter-chip-item" key={chip.id}>
            {chip.label}: {chip.value}
            <button type="button" aria-label={`Remove ${chip.label} filter`} onClick={() => onClearChip(chip.id)}>
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        {chips.length > 0 ? (
          <button type="button" className="filter-chip-clear fs-12 btn btn-link p-0 border-0" onClick={onResetFilters}>
            Clear all
          </button>
        ) : null}
      </div>
      ) : null}
    </div>
  );
};

export default WorkspaceHeader;
