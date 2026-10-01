import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DateRangeFilter from '@components/ui/DateRangeFilter';
import { all_routes } from '@/routes/all_routes';
import type { ColumnId, FilterKey, SortKey, ToolbarMenu } from '../data/guardiansWorkspace.data';
import {
  advancedFilters,
  columnDefs,
  densityOptions,
  quickFilters,
  savedViews,
  sortOptions,
} from '../data/guardiansWorkspace.data';

const routes = all_routes;

export interface FilterChip {
  id: string;
  label: string;
}

export interface WorkspaceToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: string;
  onView: (id: string) => void;
  viewCounts: Record<string, number>;
  quickFilter: string | null;
  onQuickFilter: (id: string | null) => void;
  quickCounts: Record<string, number>;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (id: FilterKey, value: string) => void;
  onResetFilters: () => void;
  columns: Record<ColumnId, boolean>;
  onColumn: (id: ColumnId, visible: boolean) => void;
  onShowAllColumns: () => void;
  density: string;
  onDensity: (id: string) => void;
  matchCount: number;
  totalCount: number;
  sort: SortKey;
  onSort: (id: SortKey) => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: FilterChip[];
  onClearChip: (id: string) => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onSaveView: () => void;
}

const WorkspaceToolbar = ({
  search,
  onSearch,
  view,
  onView,
  viewCounts,
  quickFilter,
  onQuickFilter,
  quickCounts,
  filters,
  onFilter,
  onResetFilters,
  columns,
  onColumn,
  onShowAllColumns,
  density,
  onDensity,
  matchCount,
  totalCount,
  sort,
  onSort,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  onRefresh,
  fullscreen,
  onToggleFullscreen,
  onSaveView,
}: WorkspaceToolbarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  // The template advertises ⌘K next to the search box but never wires it up.
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="card-header border-bottom" ref={barRef}>
      <div className="page-toolbar">
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            ref={searchRef}
            type="text"
            id="parSearch"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search guardian, ID, email or phone…"
            aria-label="Search guardians"
          />
          <span className="search-toolbar-kbd" hidden={search !== ''}>
            ⌘K
          </span>
          {search ? (
            <button type="button" className="search-clear" onClick={() => onSearch('')} aria-label="Clear search">
              <i className="ti ti-x" />
            </button>
          ) : null}
        </div>

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

        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'filters'}
            onClick={() => onOpenMenu(openMenu === 'filters' ? null : 'filters')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
            {activeFilterCount > 0 ? <span className="result-count">{activeFilterCount}</span> : null}
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {advancedFilters.map((field) => (
                <div className={field.type === 'dateRange' ? 'col-12' : 'col-6'} key={field.id}>
                  <label className="form-label mb-1" htmlFor={field.inputId}>
                    {field.label}
                  </label>
                  {field.type === 'dateRange' ? (
                    <DateRangeFilter
                      id={field.inputId}
                      value={filters[field.id] ?? ''}
                      onChange={(value) => onFilter(field.id, value)}
                    />
                  ) : (
                    <select
                      className="form-select"
                      id={field.inputId}
                      value={filters[field.id] ?? ''}
                      onChange={(event) => onFilter(field.id, event.target.value)}
                    >
                      <option value="">All</option>
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b>{matchCount}</b> of {totalCount} guardians match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenMenu(null)}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

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
              <button type="button" className="dropdown-item text-primary" onClick={onShowAllColumns}>
                <i className="ti ti-rotate" />
                Show all columns
              </button>
            </li>
          </ul>
        </div>

        <span className="flex-grow-1" />

        <div className="view-switcher" role="group" aria-label="Layout view">
          <Link to={routes.guardiansList} title="List view" aria-label="List view">
            <i className="ti ti-list-tree" />
          </Link>
          <Link
            to={routes.guardiansGrid}
            className="active"
            aria-current="page"
            title="Grid view"
            aria-label="Grid view"
          >
            <i className="ti ti-layout-grid" />
          </Link>
        </div>

        <div className="density-toggle" role="group" aria-label="Card density">
          {densityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={density === option.id ? 'active' : undefined}
              title={option.title}
              aria-label={option.title}
              aria-pressed={density === option.id}
              onClick={() => onDensity(option.id)}
            >
              <i className={option.icon} />
            </button>
          ))}
        </div>

        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Refresh"
          aria-label="Refresh"
          onClick={onRefresh}
        >
          <i className="ti ti-refresh" />
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Fullscreen"
          aria-label="Toggle fullscreen"
          aria-pressed={fullscreen}
          onClick={onToggleFullscreen}
        >
          <i className="ti ti-arrows-maximize" />
        </button>
      </div>

      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`quick-filter${quickFilter === filter.id ? ' active' : ''}`}
            aria-pressed={quickFilter === filter.id}
            onClick={() => onQuickFilter(quickFilter === filter.id ? null : filter.id)}
          >
            <i className={filter.icon} />
            {filter.label} <span className="quick-filter-count">{quickCounts[filter.id] ?? 0}</span>
          </button>
        ))}

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

      <div className="filter-chips" aria-live="polite">
        {chips.map((chip) => (
          <span className="filter-chip-item" key={chip.id}>
            {chip.label}
            <button type="button" aria-label={`Remove ${chip.label}`} onClick={() => onClearChip(chip.id)}>
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        {chips.length > 0 ? (
          <button type="button" className="filter-chip-clear" onClick={onResetFilters}>
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default WorkspaceToolbar;
