import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ColumnId, DensityId, FilterKey, SortKey } from '../data/staffList.data';
import {
  advancedFilters,
  columnDefs,
  densityOptions,
  quickFilters,
  savedViews,
  sortOptions,
} from '../data/staffList.data';

export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export interface FilterChip {
  key: FilterKey;
  label: string;
}

export interface StaffListToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: string;
  onView: (id: string) => void;
  viewCounts: Record<string, number>;
  quickCounts: Record<string, number>;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onClearFilters: () => void;
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
  onClearChip: (key: FilterKey) => void;
  onRefresh: () => void;
  onPrint: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onSaveView: () => void;
}

const StaffListToolbar = ({
  search,
  onSearch,
  view,
  onView,
  viewCounts,
  quickCounts,
  filters,
  onFilter,
  onClearFilters,
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
  onPrint,
  fullscreen,
  onToggleFullscreen,
  onSaveView,
}: StaffListToolbarProps) => {
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
            id="clsSearch"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search staff, employee ID, department, email or branch…"
            aria-label="Search staff"
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
              onClick={() => onSearch('')}
            >
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
                  onSaveView();
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-plus" />
                Save current view
              </Link>
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
            {activeFilterCount > 0 ? (
              <span className="result-count" id="clsFilterCount">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {advancedFilters.map((field) => (
                <div className="col-6" key={field.key}>
                  <label className="form-label mb-1" htmlFor={field.inputId}>
                    {field.fieldLabel}
                  </label>
                  <select
                    className="form-select"
                    id={field.inputId}
                    value={filters[field.key] ?? ''}
                    onChange={(event) => onFilter(field.key, event.target.value)}
                  >
                    <option value="">{field.anyLabel}</option>
                    {field.options.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b id="clsFilterHits">{matchCount}</b> of {totalCount} staff match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={onClearFilters}>
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
              <button type="button" className="dropdown-item text-primary" onClick={onResetColumns}>
                <i className="ti ti-rotate" />
                Show all columns
              </button>
            </li>
          </ul>
        </div>

        <span className="flex-grow-1" />

        <div className="density-toggle" role="group" aria-label="Row density">
          {densityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={density === option.id ? 'active' : undefined}
              title={option.title}
              aria-label={option.ariaLabel}
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
          title="Print Staff List"
          aria-label="Print Staff List"
          onClick={onPrint}
        >
          <i className="ti ti-printer" />
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
            className={`quick-filter${view === filter.id ? ' active' : ''}`}
            aria-pressed={view === filter.id}
            onClick={() => onView(view === filter.id ? 'all' : filter.id)}
          >
            <i className={filter.icon} />
            {filter.label} <span className="quick-filter-count">{quickCounts[filter.id] ?? 0}</span>
          </button>
        ))}
        {chips.length > 0 ? (
          <button
            type="button"
            className="btn btn-link btn-sm text-primary quick-filter-clear"
            id="clsClearQuick"
            onClick={onClearFilters}
          >
            Clear all
          </button>
        ) : null}

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
          <span className="filter-chip-item" key={chip.key}>
            {chip.label}
            <button type="button" aria-label={`Remove ${chip.label}`} onClick={() => onClearChip(chip.key)}>
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

export default StaffListToolbar;
