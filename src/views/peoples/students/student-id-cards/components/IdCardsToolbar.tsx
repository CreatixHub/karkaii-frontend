import { useEffect, useRef } from 'react';
import DateField from '@components/ui/DateField';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Density, SortKey } from '../data/idCardsWorkspace.data';
import {
  columnOptions,
  densityOptions,
  filterFields,
  quickFilters,
  savedViews,
  sortOptions,
  totalCards,
} from '../data/idCardsWorkspace.data';

dayjs.extend(customParseFormat);


export type ToolbarMenu = 'views' | 'filters' | 'columns' | 'sort' | null;

export interface ActiveChip {
  id: string;
  label: string;
}

export interface IdCardsToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: string;
  onView: (id: string) => void;
  filters: Record<string, string>;
  onFilter: (id: string, value: string) => void;
  onResetFilters: () => void;
  fromDate: string;
  onFromDate: (value: string) => void;
  toDate: string;
  onToDate: (value: string) => void;
  columns: Record<string, boolean>;
  onColumn: (id: string, visible: boolean) => void;
  onShowAllColumns: () => void;
  density: Density;
  onDensity: (density: Density) => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  quickFilter: string;
  onQuickFilter: (id: string) => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: ActiveChip[];
  onClearChip: (id: string) => void;
  matchCount: number;
}

const IdCardsToolbar = ({
  search,
  onSearch,
  view,
  onView,
  filters,
  onFilter,
  onResetFilters,
  fromDate,
  onFromDate,
  toDate: toDateValue,
  onToDate,
  columns,
  onColumn,
  onShowAllColumns,
  density,
  onDensity,
  onRefresh,
  fullscreen,
  onFullscreen,
  quickFilter,
  onQuickFilter,
  sort,
  onSort,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  matchCount,
}: IdCardsToolbarProps) => {
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

  return (
    <div className="card-header border-bottom" ref={barRef}>
      <div className="page-toolbar">
        {/* Advanced Search */}
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            type="text"
            ref={searchRef}
            placeholder="Search student, admission no or card no…"
            aria-label="Search student ID cards"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          <span className="search-toolbar-kbd">⌘K</span>
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
                  <span className="view-count">{item.count}</span>
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
                onClick={() => onOpenMenu(null)}
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
            <span className="result-count">{chips.length}</span>
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {filterFields.map((field) => (
                <div className="col-6" key={field.id}>
                  <label className="form-label mb-1" htmlFor={field.id}>
                    {field.label}
                  </label>
                  <select
                    className="form-select"
                    id={field.id}
                    value={filters[field.id] ?? ''}
                    onChange={(event) => onFilter(field.id, event.target.value)}
                  >
                    {field.all ? <option value="">All</option> : null}
                    {field.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="from-date">
                  From Date
                </label>
                <DateField
                  id="from-date"
                  value={fromDate}
                  onChange={(dateString) => onFromDate(dateString as string)}
            small
          />
              </div>
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="to-date">
                  To Date
                </label>
                <DateField
                  id="to-date"
                  value={toDateValue}
                  onChange={(dateString) => onToDate(dateString as string)}
            small
          />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b>{matchCount}</b> of {totalCards} cards match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => onOpenMenu(null)}
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
            {columnOptions.map((column) => (
              <li key={column.id}>
                <label className="dropdown-item">
                  <input
                    className="form-check-input me-2 mt-0"
                    type="checkbox"
                    checked={columns[column.id] ?? true}
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

        {/* Density */}
        <div className="density-toggle" role="group" aria-label="Row density">
          {densityOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={density === option.id ? 'active' : undefined}
              title={option.title}
              aria-label={option.label}
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
          title="Fullscreen"
          aria-label="Toggle fullscreen"
          aria-pressed={fullscreen}
          onClick={onFullscreen}
        >
          <i className="ti ti-arrows-maximize" />
        </button>
      </div>

      {/* Quick filters */}
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`quick-filter${quickFilter === filter.id ? ' active' : ''}`}
            aria-pressed={quickFilter === filter.id}
            onClick={() => onQuickFilter(filter.id)}
          >
            <i className={filter.icon} />
            {filter.label} <span className="quick-filter-count">{filter.count}</span>
          </button>
        ))}

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
          <span className="filter-chip-item" key={chip.id}>
            {chip.label}
            <button type="button" aria-label="Remove filter" onClick={() => onClearChip(chip.id)}>
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        {chips.length > 0 ? (
          <button type="button" className="filter-chip-clear fs-12" onClick={onResetFilters}>
            Clear all
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default IdCardsToolbar;
