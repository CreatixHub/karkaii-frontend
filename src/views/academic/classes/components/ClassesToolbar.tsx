import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ColumnId, DensityId, FilterKey, SortKey, ToolbarMenu } from '../data/classes.data';
import {
  advancedFilters,
  columnDefs,
  densityOptions,
  filterFieldLabels,
  quickFilters,
  savedViews,
  sortOptions,
} from '../data/classes.data';

export interface FilterChip {
  id: string;
  label: string;
}

export interface ClassesToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: string;
  onView: (id: string) => void;
  viewCounts: Record<string, number>;
  quickCounts: Record<string, number>;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  columns: Record<ColumnId, boolean>;
  onColumn: (id: ColumnId, visible: boolean) => void;
  onResetColumns: () => void;
  density: DensityId;
  onDensity: (id: DensityId) => void;
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

const ClassesToolbar = ({
  search,
  onSearch,
  view,
  onView,
  viewCounts,
  quickCounts,
  filters,
  onFilter,
  onResetFilters,
  onApplyFilters,
  columns,
  onColumn,
  onResetColumns,
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
}: ClassesToolbarProps) => {
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

  // ⌘K / Ctrl-K focuses the search box — `classes.js` L281–285.
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
  const toggle = (menu: ToolbarMenu) => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card-header border-bottom" ref={barRef}>
      <div className="page-toolbar">
        {/* Advanced Search */}
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            ref={searchRef}
            type="text"
            id="clsSearch"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search class, code, teacher or room…"
            aria-label="Search classes"
          />
          <span className="search-toolbar-kbd" id="clsSearchKbd" hidden={search !== ''}>
            ⌘K
          </span>
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
            onClick={() => toggle('views')}
          >
            <i className="ti ti-bookmark" />
            Saved Views
          </button>
          <ul className={`dropdown-menu${openMenu === 'views' ? ' show' : ''}`}>
            <li className="context-menu-head">My Views</li>
            {savedViews.map((item) => (
              <li key={item.id}>
                <Link
                  className={`dropdown-item${view === item.id ? ' active' : ''}`}
                  to="#"
                  onClick={() => {
                    onView(item.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={item.icon} />
                  {item.label}
                  <span className="view-count">{viewCounts[item.id] ?? 0}</span>
                </Link>
              </li>
            ))}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link
                className="dropdown-item text-primary"
                to="#"
                onClick={() => {
                  onOpenMenu(null);
                  onSaveView();
                }}
              >
                <i className="ti ti-plus" />
                Save current view
              </Link>
            </li>
          </ul>
        </div>

        {/* Advanced Filter */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'filters'}
            onClick={() => toggle('filters')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
            <span className="result-count" id="clsFilterCount" hidden={activeFilterCount === 0}>
              {activeFilterCount}
            </span>
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {advancedFilters.map((field) => (
                <div className="col-6" key={field.key}>
                  <label className="form-label mb-1" htmlFor={field.domId}>
                    {filterFieldLabels[field.key]}
                  </label>
                  <select
                    className="form-select"
                    id={field.domId}
                    value={filters[field.key] ?? ''}
                    onChange={(event) => onFilter(field.key, event.target.value)}
                  >
                    <option value="">All</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b id="clsFilterHits">{matchCount}</b> of {totalCount} classes match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
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
            onClick={() => toggle('columns')}
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

        {/* Density */}
        <div className="density-toggle" role="group" aria-label="Row density">
          {densityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={density === option.id ? 'active' : undefined}
              title={option.title}
              aria-label={`${option.title} rows`}
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
          onClick={onToggleFullscreen}
        >
          <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
        </button>
      </div>

      {/* Quick filters */}
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
        {quickFilters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`quick-filter${view === item.id ? ' active' : ''}`}
            // Clicking an active quick filter clears it — `classes.js` L306–307.
            onClick={() => onView(view === item.id ? 'all' : item.id)}
          >
            <i className={item.icon} />
            {item.label} <span className="quick-filter-count">{quickCounts[item.id] ?? 0}</span>
          </button>
        ))}
        {view !== 'all' ? (
          <button
            type="button"
            className="btn btn-link btn-sm text-primary quick-filter-clear"
            id="clsClearQuick"
            onClick={onResetFilters}
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
            onClick={() => toggle('sort')}
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
          <span className="filter-chip-item" key={chip.id}>
            {chip.label}
            <button type="button" aria-label={`Remove ${chip.label} filter`} onClick={() => onClearChip(chip.id)}>
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        {chips.length ? (
          <button type="button" className="filter-chip-clear" onClick={onResetFilters}>
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ClassesToolbar;
