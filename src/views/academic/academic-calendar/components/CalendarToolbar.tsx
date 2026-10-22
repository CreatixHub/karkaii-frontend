import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { CalendarView, CategoryId, FilterKey } from '../data/academicCalendar.data';
import {
  advancedFilters,
  currentMonthLabel,
  quickFilters,
  savedViews,
  viewTabs,
} from '../data/academicCalendar.data';

export interface FilterChip {
  id: string;
  label: string;
}

export interface CalendarToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  view: CalendarView;
  onView: (view: CalendarView) => void;
  quick: 'all' | CategoryId;
  onQuick: (id: 'all' | CategoryId) => void;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  matchCount: number;
  openMenu: 'views' | 'filters' | null;
  onOpenMenu: (menu: 'views' | 'filters' | null) => void;
  chips: FilterChip[];
  onClearChip: (id: string) => void;
  onClearChips: () => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onSaveView: () => void;
  onToday: () => void;
  onStep: (direction: -1 | 1) => void;
}

const CalendarToolbar = ({
  search,
  onSearch,
  view,
  onView,
  quick,
  onQuick,
  filters,
  onFilter,
  onResetFilters,
  onApplyFilters,
  matchCount,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  onClearChips,
  onRefresh,
  fullscreen,
  onToggleFullscreen,
  onSaveView,
  onToday,
  onStep,
}: CalendarToolbarProps) => {
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

  const toggle = (menu: 'views' | 'filters') => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card">
      <div className="data-workspace">
        <div className="card-header border-bottom" ref={barRef}>
          <div className="page-toolbar">
            {/* Date navigation */}
            <div className="density-toggle" role="group" aria-label="Date navigation">
              <button type="button" title="Previous" aria-label="Previous period" onClick={() => onStep(-1)}>
                <i className="ti ti-chevron-left" />
              </button>
              <button type="button" title="Next" aria-label="Next period" onClick={() => onStep(1)}>
                <i className="ti ti-chevron-right" />
              </button>
            </div>
            <button type="button" className="workspace-button" onClick={onToday}>
              Today
            </button>
            <h4 className="mb-0 fw-semibold ms-1 fs-16">{currentMonthLabel}</h4>

            {/* Search */}
            <div className="search-toolbar">
              <i className="ti ti-search search-toolbar-icon" />
              <input
                ref={searchRef}
                type="text"
                id="acalSearch"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search events, exams, holidays…"
                aria-label="Search events"
              />
              <span className="search-toolbar-kbd" hidden={search !== ''}>
                ⌘K
              </span>
              {search ? (
                <button
                  type="button"
                  className="search-clear"
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
                      className="dropdown-item"
                      to="#"
                      onClick={() => {
                        onOpenMenu(null);
                        onSaveView();
                      }}
                    >
                      <i className={item.icon} />
                      {item.label}
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

            {/* Filters */}
            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'filters'}
                onClick={() => toggle('filters')}
              >
                <i className="ti ti-adjustments-horizontal" />
                Filters
                {chips.length ? <span className="badge bg-primary rounded-pill ms-1">{chips.length}</span> : null}
              </button>
              <div
                className={`dropdown-menu dropdown-menu-end p-3 calendar-filter-menu${
                  openMenu === 'filters' ? ' show' : ''
                }`}
              >
                <div className="row g-3">
                  {advancedFilters.map((field) => (
                    <div className="col-6" key={field.key}>
                      <label className="form-label mb-1" htmlFor={field.domId}>
                        {field.label}
                      </label>
                      <select
                        className="form-select"
                        id={field.domId}
                        value={filters[field.key] ?? field.options[0]}
                        onChange={(event) => onFilter(field.key, event.target.value)}
                      >
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                  <span className="fs-12 text-muted">
                    <b>{matchCount}</b> events match
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

            <span className="flex-grow-1" />

            {/* View switch */}
            <div className="nav gap-1 flex-nowrap" role="tablist" aria-label="Calendar view">
              {viewTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`workspace-button${view === tab.id ? ' active' : ''}`}
                  role="tab"
                  aria-selected={view === tab.id}
                  onClick={() => onView(tab.id)}
                >
                  {tab.label}
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
                className={`quick-filter${quick === item.id ? ' active' : ''}`}
                onClick={() => onQuick(quick === item.id && item.id !== 'all' ? 'all' : item.id)}
              >
                <i className={item.icon} />
                {item.label} <span className="quick-filter-count">{item.count}</span>
              </button>
            ))}
          </div>

          {/* Active filter chips */}
          <div className="filter-chips" aria-live="polite">
            {chips.map((chip) => (
              <span className="filter-chip-item" key={chip.id}>
                {chip.label}
                <button
                  type="button"
                  aria-label={`Remove ${chip.label} filter`}
                  onClick={() => onClearChip(chip.id)}
                >
                  <i className="ti ti-x" />
                </button>
              </span>
            ))}
            {chips.length ? (
              <button type="button" className="btn btn-link btn-sm text-primary" onClick={onClearChips}>
                Clear all
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarToolbar;
