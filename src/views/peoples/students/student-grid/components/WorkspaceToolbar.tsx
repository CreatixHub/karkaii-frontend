import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { SortKey } from '../data/studentsWorkspace.data';
import {
  academicYears,
  advancedFilters,
  quickFilters,
  savedViews,
  sortOptions,
} from '../data/studentsWorkspace.data';

const routes = all_routes;

export type ToolbarMenu = 'views' | 'filter' | 'year' | 'sort' | null;

export interface ActiveChip {
  id: string;
  label: string;
}

export interface WorkspaceToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: string;
  onView: (view: string) => void;
  viewCounts: Record<string, number>;
  quickFilter: string | null;
  onQuickFilter: (id: string | null) => void;
  quickCounts: Record<string, number>;
  filters: Record<string, string>;
  onFilter: (id: string, value: string) => void;
  onResetFilters: () => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  academicYear: string;
  onAcademicYear: (year: string) => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: ActiveChip[];
  onClearChip: (id: string) => void;
  matchCount: number;
  totalCount: number;
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
  sort,
  onSort,
  academicYear,
  onAcademicYear,
  onRefresh,
  fullscreen,
  onFullscreen,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  matchCount,
  totalCount,
}: WorkspaceToolbarProps) => {
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

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="card mb-4">
      <div className="data-workspace classes-workspace is-loaded" id="studentGridWorkspace" ref={barRef}>
        <div className="card-header border-bottom">
          <div className="page-toolbar">
            {/* Advanced Search */}
            <div className="search-toolbar">
              <i className="ti ti-search search-toolbar-icon" />
              <input
                type="text"
                id="sgSearch"
                ref={searchRef}
                placeholder="Search name, admission no, class…"
                aria-label="Search students"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
              />
              <span className="search-toolbar-kbd">⌘K</span>
              {search ? (
                <button
                  type="button"
                  className="search-clear"
                  aria-label="Clear search"
                  onClick={() => onSearch('')}
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
                aria-expanded={openMenu === 'filter'}
                onClick={() => onOpenMenu(openMenu === 'filter' ? null : 'filter')}
              >
                <i className="ti ti-adjustments-horizontal" />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="result-count">{activeFilterCount}</span>
                ) : null}
              </button>
              <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filter' ? ' show' : ''}`}>
                <div className="row g-3">
                  {advancedFilters.map((field) => (
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
                    <b>{matchCount}</b> of {totalCount} students match
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

            {/* Academic Year */}
            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'year'}
                onClick={() => onOpenMenu(openMenu === 'year' ? null : 'year')}
              >
                <i className="ti ti-calendar" />
                {academicYear}
              </button>
              <ul className={`dropdown-menu${openMenu === 'year' ? ' show' : ''}`}>
                <li className="context-menu-head">Academic year</li>
                {academicYears.map((year) => (
                  <li key={year}>
                    <button
                      type="button"
                      className={`dropdown-item${academicYear === year ? ' active' : ''}`}
                      onClick={() => {
                        onAcademicYear(year);
                        onOpenMenu(null);
                      }}
                    >
                      <i className="ti ti-calendar-event" />
                      {year}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <span className="flex-grow-1" />

            {/* Layout: List / Grid */}
            <div className="view-switcher" role="group" aria-label="Layout view">
              <Link to={routes.studentList} title="List view" aria-label="List view">
                <i className="ti ti-list-tree" />
              </Link>
              <Link
                to={routes.studentGrid}
                className="active"
                aria-current="page"
                title="Grid view"
                aria-label="Grid view"
              >
                <i className="ti ti-layout-grid" />
              </Link>
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

            {/* Print */}
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              title="Print"
              aria-label="Print"
              onClick={() => window.print()}
            >
              <i className="ti ti-printer" />
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
                onClick={() => onQuickFilter(quickFilter === filter.id ? null : filter.id)}
              >
                <i className={filter.icon} />
                {filter.label} <span className="quick-filter-count">{quickCounts[filter.id] ?? 0}</span>
              </button>
            ))}
            {chips.length > 0 ? (
              <button
                type="button"
                className="btn btn-link btn-sm text-primary quick-filter-clear"
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

          {/* Active filter chips — inert and empty in the template. */}
          <div className="filter-chips" aria-live="polite">
            {chips.map((chip) => (
              <span className="filter-chip-item" key={chip.id}>
                {chip.label}
                <button
                  type="button"
                  aria-label={`Remove ${chip.label}`}
                  onClick={() => onClearChip(chip.id)}
                >
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
      </div>
    </div>
  );
};

export default WorkspaceToolbar;
