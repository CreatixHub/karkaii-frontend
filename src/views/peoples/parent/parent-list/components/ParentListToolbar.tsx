import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, DensityId, FilterKey, SortKey } from '../data/parentsList.data';
import {
  advancedFilters,
  columnDefs,
  densityOptions,
  quickFilters,
  savedViews,
  sortOptions,
} from '../data/parentsList.data';

const routes = all_routes;

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export interface FilterChip {
  key: FilterKey;
  label: string;
}

export interface ParentListToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: string;
  onView: (view: string) => void;
  viewCounts: Record<string, number>;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  columns: Record<ColumnId, boolean>;
  onColumn: (id: ColumnId, visible: boolean) => void;
  onResetColumns: () => void;
  density: DensityId;
  onDensity: (density: DensityId) => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: FilterChip[];
  onClearChip: (key: FilterKey) => void;
  matchCount: number;
  totalCount: number;
  onSaveView: () => void;
}

const ParentListToolbar = ({
  search,
  onSearch,
  view,
  onView,
  viewCounts,
  filters,
  onFilter,
  onApplyFilters,
  onClearFilters,
  columns,
  onColumn,
  onResetColumns,
  density,
  onDensity,
  onRefresh,
  fullscreen,
  onFullscreen,
  sort,
  onSort,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  matchCount,
  totalCount,
  onSaveView,
}: ParentListToolbarProps) => {
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

  const activeQuick = quickFilters.some((filter) => filter.id === view);

  return (
    <div className="card-header border-bottom" ref={barRef}>
      <div className="page-toolbar">
        {/* Advanced Search */}
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            type="text"
            id="clsSearch"
            ref={searchRef}
            placeholder="Search parent, ID, child or email…"
            aria-label="Search parents"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          {search ? null : (
            <span className="search-toolbar-kbd" id="clsSearchKbd">
              ⌘K
            </span>
          )}
          {search ? (
            <button
              type="button"
              className="search-clear"
              id="clsSearchClear"
              aria-label="Clear search"
              onClick={() => {
                onSearch('');
                searchRef.current?.focus();
              }}
            >
              <i className="ti ti-x" />
            </button>
          ) : null}
        </div>

        {/* Saved Views */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'views'}
            onClick={() => onOpenMenu(openMenu === 'views' ? null : 'views')}
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
                  <span className="view-count">{viewCounts[item.id] ?? 0}</span>
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
                  onOpenMenu(null);
                  onSaveView();
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
            aria-expanded={openMenu === 'filters'}
            onClick={() => onOpenMenu(openMenu === 'filters' ? null : 'filters')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
            {chips.length > 0 ? (
              <span className="result-count" id="clsFilterCount">
                {chips.length}
              </span>
            ) : null}
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {advancedFilters.map((field) => (
                <div className="col-6" key={field.inputId}>
                  <label className="form-label mb-1" htmlFor={field.inputId}>
                    {field.fieldLabel}
                  </label>
                  <select
                    className="form-select"
                    id={field.inputId}
                    value={filters[field.key] ?? ''}
                    onChange={(event) => onFilter(field.key, event.target.value)}
                  >
                    <option value="">All</option>
                    {field.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b id="clsFilterHits">{matchCount}</b> of {totalCount} parents match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={onClearFilters}>
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onOpenMenu(null);
                    onApplyFilters();
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column Visibility */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'columns'}
            onClick={() => onOpenMenu(openMenu === 'columns' ? null : 'columns')}
          >
            <i className="ti ti-columns-3" />
            Columns
          </button>
          <ul className={`dropdown-menu p-2 column-menu${openMenu === 'columns' ? ' show' : ''}`}>
            <li className="context-menu-head">Toggle columns</li>
            {columnDefs.map((column) => (
              <li key={column.id}>
                <label className="dropdown-item">
                  <input
                    className="form-check-input me-2 mt-0"
                    type="checkbox"
                    checked={columns[column.id]}
                    onChange={(event) => onColumn(column.id, event.target.checked)}
                  />
                  {column.label}
                </label>
              </li>
            ))}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button type="button" className="dropdown-item text-primary" onClick={onResetColumns}>
                <i className="ti ti-rotate" />
                Show all columns
              </button>
            </li>
          </ul>
        </div>

        <span className="flex-grow-1" />

        {/* Layout: List / Grid */}
        <div className="view-switcher" role="group" aria-label="Layout view">
          <Link
            to={routes.parentList}
            className="active"
            aria-current="page"
            title="List view"
            aria-label="List view"
          >
            <i className="ti ti-list-tree" />
          </Link>
          <Link to={routes.parentGrid} title="Grid view" aria-label="Grid view">
            <i className="ti ti-layout-grid" />
          </Link>
        </div>

        {/* Density */}
        <div className="density-toggle" role="group" aria-label="Row density">
          {densityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={density === option.id ? 'active' : undefined}
              title={option.title}
              aria-label={option.ariaLabel}
              onClick={() => onDensity(option.id)}
            >
              <i className={option.icon} />
            </button>
          ))}
        </div>

        {/* Refresh */}
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Refresh"
          aria-label="Refresh"
          onClick={onRefresh}
        >
          <i className="ti ti-refresh" />
        </button>

        {/* Fullscreen */}
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Toggle fullscreen'}
          aria-pressed={fullscreen}
          onClick={onFullscreen}
        >
          <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
        </button>
      </div>

      {/* Quick filters */}
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`quick-filter${view === filter.id ? ' active' : ''}`}
            aria-pressed={view === filter.id}
            onClick={() => onView(view === filter.id ? 'all' : filter.id)}
          >
            <i className={filter.icon} />
            {filter.label} <span className="quick-filter-count">{viewCounts[filter.id] ?? 0}</span>
          </button>
        ))}
        {activeQuick ? (
          <button
            type="button"
            className="btn btn-link btn-sm text-primary quick-filter-clear"
            id="clsClearQuick"
            onClick={onClearFilters}
          >
            Clear all
          </button>
        ) : null}

        {/* Sort */}
        <div className="dropdown ms-auto">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'sort'}
            onClick={() => onOpenMenu(openMenu === 'sort' ? null : 'sort')}
          >
            <i className="ti ti-sort-ascending-2" />
            Sort
          </button>
          <ul className={`dropdown-menu dropdown-menu-end${openMenu === 'sort' ? ' show' : ''}`}>
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
      </div>

      {/* Active filter chips */}
      <div className="filter-chips" aria-live="polite">
        {chips.map((chip) => (
          <span className="filter-chip-item" key={chip.key}>
            {chip.label}
            <button
              type="button"
              aria-label={`Remove ${chip.label} filter`}
              onClick={() => onClearChip(chip.key)}
            >
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        {chips.length > 0 ? (
          <button type="button" className="filter-chip-clear" onClick={onClearFilters}>
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ParentListToolbar;
