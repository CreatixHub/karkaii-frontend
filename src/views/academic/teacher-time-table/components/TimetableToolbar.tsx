import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  advancedFilters,
  calendarViews,
  exportOptions,
  savedViews,
} from '../data/teacherTimeTable.data';
import type { CalendarViewId, SavedViewId } from '../data/teacherTimeTable.data';

export type ToolbarMenu = 'filters' | 'view' | 'saved' | 'export' | null;

export interface TimetableToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  filters: Record<string, string>;
  onFilter: (id: string, value: string) => void;
  dateRange: string;
  onDateRange: (value: string) => void;
  onResetFilters: () => void;
  calendarView: CalendarViewId;
  onCalendarView: (view: CalendarViewId) => void;
  savedView: SavedViewId;
  onSavedView: (view: SavedViewId) => void;
  onSaveCurrentView: () => void;
  layout: 'grid' | 'list';
  onLayout: (layout: 'grid' | 'list') => void;
  onExport: (id: string) => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  onAssign: () => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
}

const TimetableToolbar = ({
  search,
  onSearch,
  filters,
  onFilter,
  dateRange,
  onDateRange,
  onResetFilters,
  calendarView,
  onCalendarView,
  savedView,
  onSavedView,
  onSaveCurrentView,
  layout,
  onLayout,
  onExport,
  onRefresh,
  fullscreen,
  onFullscreen,
  onAssign,
  openMenu,
  onOpenMenu,
}: TimetableToolbarProps) => {
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

  const currentView = calendarViews.find((view) => view.id === calendarView) ?? calendarViews[1];

  return (
    <div className="card sticky-top data-workspace classes-workspace is-loaded mb-3" ref={barRef}>
      <div className="card-header border-bottom">
        <div className="page-toolbar">
          <div className="search-toolbar">
            <i className="ti ti-search search-toolbar-icon" />
            <input
              type="text"
              id="tttSearch"
              ref={searchRef}
              placeholder="Search teacher, subject, class or room…"
              aria-label="Search schedule"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
            <span className="search-toolbar-kbd">⌘K</span>
          </div>

          {/* Filters */}
          <div className="dropdown">
            <button
              type="button"
              className="workspace-button dropdown-toggle"
              aria-expanded={openMenu === 'filters'}
              onClick={() => onOpenMenu(openMenu === 'filters' ? null : 'filters')}
            >
              <i className="ti ti-adjustments-horizontal" />
              Filters
            </button>
            <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
              <div className="row g-3">
                {advancedFilters.map((field) => (
                  <div className="col-6" key={field.id}>
                    <label className="form-label mb-1" htmlFor={field.id}>
                      {field.label}
                    </label>
                    <select
                      className="form-select"
                      id={field.id}
                      value={filters[field.id] ?? (field.allOption ? '' : field.options[0])}
                      onChange={(event) => onFilter(field.id, event.target.value)}
                    >
                      {field.allOption ? <option value="">All</option> : null}
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="col-6">
                  <label className="form-label mb-1" htmlFor="date">
                    Date
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm date-range bookingrange"
                    placeholder="Select date"
                    id="date"
                    value={dateRange}
                    onChange={(event) => onDateRange(event.target.value)}
                  />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
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

          {/* Week View */}
          <div className="dropdown">
            <button
              type="button"
              className="workspace-button dropdown-toggle"
              aria-expanded={openMenu === 'view'}
              onClick={() => onOpenMenu(openMenu === 'view' ? null : 'view')}
            >
              <i className="ti ti-calendar-week" />
              {currentView.label} View
            </button>
            <ul className={`dropdown-menu p-2${openMenu === 'view' ? ' show' : ''}`}>
              <li className="context-menu-head">View</li>
              {calendarViews.map((view) => (
                <li key={view.id}>
                  <button
                    type="button"
                    className={`dropdown-item rounded-1${calendarView === view.id ? ' active' : ''}`}
                    onClick={() => {
                      onCalendarView(view.id);
                      onOpenMenu(null);
                    }}
                  >
                    <i className={view.icon} />
                    {view.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Saved Views */}
          <div className="dropdown">
            <button
              type="button"
              className="workspace-button dropdown-toggle"
              aria-expanded={openMenu === 'saved'}
              onClick={() => onOpenMenu(openMenu === 'saved' ? null : 'saved')}
            >
              <i className="ti ti-bookmark" />
              Saved Views
            </button>
            <ul className={`dropdown-menu p-2${openMenu === 'saved' ? ' show' : ''}`}>
              <li className="context-menu-head">My Views</li>
              {savedViews.map((view) => (
                <li key={view.id}>
                  <button
                    type="button"
                    className={`dropdown-item rounded-1${savedView === view.id ? ' active' : ''}`}
                    onClick={() => {
                      onSavedView(view.id);
                      onOpenMenu(null);
                    }}
                  >
                    <i className={view.icon} />
                    {view.label}
                  </button>
                </li>
              ))}
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item rounded-1 text-primary"
                  onClick={() => {
                    onOpenMenu(null);
                    onSaveCurrentView();
                  }}
                >
                  <i className="ti ti-plus me-2" />
                  Save current view
                </button>
              </li>
            </ul>
          </div>

          <span className="flex-grow-1" />

          {/* Layout: grid / list */}
          <div className="view-switcher" role="group" aria-label="Layout view">
            <Link
              to="#"
              className={layout === 'grid' ? 'active' : undefined}
              title="Grid view"
              aria-label="Grid view"
              aria-pressed={layout === 'grid'}
              onClick={() => onLayout('grid')}
            >
              <i className="ti ti-layout-grid" />
            </Link>
            <Link
              to="#"
              className={layout === 'list' ? 'active' : undefined}
              title="List view"
              aria-label="List view"
              aria-pressed={layout === 'list'}
              onClick={() => onLayout('list')}
            >
              <i className="ti ti-list" />
            </Link>
          </div>

          {/* Export */}
          <div className="dropdown">
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              title="Export"
              aria-label="Export"
              aria-expanded={openMenu === 'export'}
              onClick={() => onOpenMenu(openMenu === 'export' ? null : 'export')}
            >
              <i className="ti ti-file-export" />
            </button>
            <ul
              className={`dropdown-menu dropdown-menu-end p-2${openMenu === 'export' ? ' show' : ''}`}
            >
              {exportOptions.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    className="dropdown-item rounded-1"
                    onClick={() => {
                      onOpenMenu(null);
                      onExport(option.id);
                    }}
                  >
                    <i className={option.icon} />
                    {option.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            className="workspace-button workspace-button-icon"
            title="Print Timetable"
            aria-label="Print"
            onClick={() => window.print()}
          >
            <i className="ti ti-printer" />
          </button>
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
            aria-label="Fullscreen"
            aria-pressed={fullscreen}
            onClick={onFullscreen}
          >
            <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center"
            onClick={onAssign}
          >
            <i className="ti ti-square-rounded-plus me-1" />
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableToolbar;
