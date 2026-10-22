import { useEffect, useRef } from 'react';
import type { HolidayCategory } from '../data/holidays.data';
import {
  academicYearOptions,
  branchOptions,
  categoryFilterOptions,
  quickFilters,
  savedViews,
  yearOptions,
} from '../data/holidays.data';

export type ToolbarMenu = 'views' | 'filter' | 'export' | null;
export type HolidayView = 'calendar' | 'list';

export interface HolidayFilters {
  year: string;
  academicYear: string;
  category: string;
  branch: string;
}

export interface ActiveChip {
  id: keyof HolidayFilters;
  label: string;
  value: string;
  tone: string;
}

export interface HolidayToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  draft: HolidayFilters;
  onDraft: (key: keyof HolidayFilters, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  quickCategory: HolidayCategory | null;
  onQuickCategory: (category: HolidayCategory | null) => void;
  savedView: string;
  onSavedView: (id: string) => void;
  onSaveView: () => void;
  view: HolidayView;
  onView: (view: HolidayView) => void;
  onRefresh: () => void;
  onPrint: () => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: ActiveChip[];
  onClearChip: (id: keyof HolidayFilters) => void;
  matchCount: number;
}

const HolidayToolbar = ({
  search,
  onSearch,
  draft,
  onDraft,
  onApplyFilters,
  onResetFilters,
  quickCategory,
  onQuickCategory,
  savedView,
  onSavedView,
  onSaveView,
  view,
  onView,
  onRefresh,
  onPrint,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  matchCount,
}: HolidayToolbarProps) => {
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

  const toggle = (menu: ToolbarMenu) => () => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card">
      <div className="card-header border-bottom" ref={barRef}>
        <div className="page-toolbar">
          {/* Advanced Search */}
          <div className="search-toolbar">
            <i className="ti ti-search search-toolbar-icon" />
            <input
              type="text"
              id="holSearch"
              ref={searchRef}
              placeholder="Search holidays, category or branch…"
              aria-label="Search holidays"
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
                    className={`dropdown-item${savedView === item.id ? ' active' : ''}`}
                    onClick={() => {
                      onSavedView(item.id);
                      onOpenMenu(null);
                    }}
                  >
                    <i className={item.icon} />
                    {item.label}
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
              Filters
            </button>
            <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filter' ? ' show' : ''}`}>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label mb-1" htmlFor="year">
                    Year
                  </label>
                  <select
                    className="form-select"
                    id="year"
                    value={draft.year}
                    onChange={(event) => onDraft('year', event.target.value)}
                  >
                    {yearOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label mb-1" htmlFor="academic-year">
                    Academic Year
                  </label>
                  <select
                    className="form-select"
                    id="academic-year"
                    value={draft.academicYear}
                    onChange={(event) => onDraft('academicYear', event.target.value)}
                  >
                    {academicYearOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label mb-1" htmlFor="holiday-category">
                    Holiday Category
                  </label>
                  <select
                    className="form-select"
                    id="holiday-category"
                    aria-label="Holiday Category"
                    value={draft.category}
                    onChange={(event) => onDraft('category', event.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categoryFilterOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label mb-1" htmlFor="branch">
                    Branch
                  </label>
                  <select
                    className="form-select"
                    id="branch"
                    aria-label="Branch"
                    value={draft.branch}
                    onChange={(event) => onDraft('branch', event.target.value)}
                  >
                    <option value="">All Branches</option>
                    {branchOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                <span className="fs-12 text-muted">
                  <b>{matchCount}</b> holidays this year
                </span>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                    Reset
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={onApplyFilters}>
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>

          <span className="flex-grow-1" />

          {/* Calendar / List toggle */}
          <div className="density-toggle" role="group" aria-label="View">
            <button
              type="button"
              className={view === 'calendar' ? 'active' : undefined}
              title="Calendar view"
              aria-label="Calendar view"
              aria-pressed={view === 'calendar'}
              onClick={() => onView('calendar')}
            >
              <i className="ti ti-calendar-month" />
            </button>
            <button
              type="button"
              className={view === 'list' ? 'active' : undefined}
              title="List view"
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => onView('list')}
            >
              <i className="ti ti-list" />
            </button>
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
            title="Print"
            aria-label="Print"
            onClick={onPrint}
          >
            <i className="ti ti-printer" />
          </button>
        </div>

        {/* Quick category filters */}
        <div className="quick-filters">
          <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
          {quickFilters.map((filter) => (
            <button
              type="button"
              className={`quick-filter${quickCategory === filter.id ? ' active' : ''}`}
              key={filter.id}
              aria-pressed={quickCategory === filter.id}
              onClick={() => onQuickCategory(quickCategory === filter.id ? null : filter.id)}
            >
              <i className={filter.icon} />
              {filter.label}
            </button>
          ))}
          {quickCategory ? (
            <button
              type="button"
              className="btn btn-link btn-sm text-primary hol-clear-quick"
              onClick={() => onQuickCategory(null)}
            >
              Clear all
            </button>
          ) : null}
        </div>

        {/* Active filter chips */}
        <div className="filter-chips" aria-live="polite">
          {chips.map((chip) => (
            <span className={`badge badge-soft-${chip.tone} d-inline-flex align-items-center`} key={chip.id}>
              {chip.label} : {chip.value}{' '}
              <button
                type="button"
                className={`ms-1 btn btn-link p-0 border-0 text-${chip.tone}`}
                aria-label={`Remove ${chip.label} filter`}
                onClick={() => onClearChip(chip.id)}
              >
                <i className="ti ti-x" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HolidayToolbar;
