import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DateRangeFilter from '@components/ui/DateRangeFilter';
import type {
  ExportAction,
  FilterKey,
  LayoutView,
  SavedViewId,
  SortKey,
  ToolbarMenu,
} from '../data/lessonPlanning.data';
import { advancedFilters, exportActions, savedViews, sortOptions } from '../data/lessonPlanning.data';

export interface ToolbarChip {
  id: string;
  label: string;
  tone: string;
}

export interface LessonToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  sort: SortKey;
  onSort: (id: SortKey) => void;
  view: SavedViewId;
  onView: (id: SavedViewId) => void;
  viewCounts: Record<SavedViewId, number>;
  onSaveView: () => void;
  layout: LayoutView;
  onLayout: (view: LayoutView) => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: ToolbarChip[];
  onClearChip: (id: string) => void;
  onClearChips: () => void;
  onOpenFilterRail: () => void;
  onOpenDetails: () => void;
  onRefresh: () => void;
  onImport: () => void;
  onExport: (action: ExportAction) => void;
  onPrint: () => void;
  onNew: () => void;
}

const LessonToolbar = ({
  search,
  onSearch,
  filters,
  onFilter,
  onResetFilters,
  onApplyFilters,
  sort,
  onSort,
  view,
  onView,
  viewCounts,
  onSaveView,
  layout,
  onLayout,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  onClearChips,
  onOpenFilterRail,
  onOpenDetails,
  onRefresh,
  onImport,
  onExport,
  onPrint,
  onNew,
}: LessonToolbarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Bootstrap closes a dropdown on an outside click or Escape; so does this.
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

  // The `⌘K` hint printed inside the search box, made real.
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

  const toggle = (menu: ToolbarMenu) => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card-header border-bottom sticky-top bg-white" ref={barRef}>
      <div className="page-toolbar">
        <button
          type="button"
          className="workspace-button workspace-button-icon d-xl-none"
          aria-controls="lp_left"
          title="Filters"
          aria-label="Filters"
          onClick={onOpenFilterRail}
        >
          <i className="ti ti-filter" />
        </button>

        {/* Advanced Search */}
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            ref={searchRef}
            type="text"
            id="lpSearch"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search lesson plans, subjects, teachers…"
            aria-label="Search lesson plans"
          />
          <span className="search-toolbar-kbd" id="lpSearchKbd" hidden={search !== ''}>
            ⌘K
          </span>
          {search ? (
            <button
              type="button"
              className="search-clear"
              id="lpSearchClear"
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

        {/* Facet filters */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'filters'}
            onClick={() => toggle('filters')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {advancedFilters.map((field) => (
                <div className="col-6" key={field.key}>
                  <label className="form-label mb-1" htmlFor={field.domId}>
                    {field.label}
                  </label>
                  <select
                    className="form-select"
                    id={field.domId}
                    value={filters[field.key] ?? (field.includeAll ? '' : field.options[0])}
                    onChange={(event) => onFilter(field.key, event.target.value)}
                  >
                    {field.includeAll ? <option value="">All</option> : null}
                    {field.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="lp-date-range">
                  Date Range
                </label>
                <DateRangeFilter
                  id="lp-date-range"
                  className="form-control form-control-sm filter-daterange"
                  placeholder="01 Jul - 26 Jul"
                  value={filters.dateRange ?? ''}
                  onChange={(value) => onFilter('dateRange', value)}
                />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
              <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                Reset
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={onApplyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Sort */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'sort'}
            onClick={() => toggle('sort')}
          >
            <i className="ti ti-sort-ascending-2" />
            Sort
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'sort' ? ' show' : ''}`}>
            <li className="context-menu-head">Sort by</li>
            {sortOptions.map((option) => (
              <li key={option.id}>
                <Link
                  className={`dropdown-item rounded-1${sort === option.id ? ' active' : ''}`}
                  to="#"
                  onClick={() => {
                    onSort(option.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={`${option.icon} me-2`} />
                  {option.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Saved views */}
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
          <ul className={`dropdown-menu p-2${openMenu === 'views' ? ' show' : ''}`}>
            <li className="context-menu-head">My Views</li>
            {savedViews.map((item) => (
              <li key={item.id}>
                <Link
                  className={`dropdown-item rounded-1${view === item.id ? ' active' : ''}`}
                  to="#"
                  onClick={() => {
                    onView(item.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={`${item.icon} me-2`} />
                  {item.label}
                  <span className="badge badge-soft-secondary ms-2">{viewCounts[item.id]}</span>
                </Link>
              </li>
            ))}
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <Link
                className="dropdown-item rounded-1 text-primary"
                to="#"
                onClick={() => {
                  onSaveView();
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-plus me-2" />
                Save current view
              </Link>
            </li>
          </ul>
        </div>

        <span className="flex-grow-1" />

        {/* Grid / list */}
        <div className="view-switcher" role="tablist" aria-label="View mode">
          <Link
            to="#"
            className={layout === 'grid' ? 'active' : undefined}
            role="tab"
            aria-controls="lp_grid"
            aria-selected={layout === 'grid'}
            title="Grid view"
            aria-label="Grid view"
            onClick={() => onLayout('grid')}
          >
            <i className="ti ti-layout-grid" />
          </Link>
          <Link
            to="#"
            className={layout === 'list' ? 'active' : undefined}
            role="tab"
            aria-controls="lp_list"
            aria-selected={layout === 'list'}
            title="List view"
            aria-label="List view"
            onClick={() => onLayout('list')}
          >
            <i className="ti ti-list" />
          </Link>
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
          title="Import"
          aria-label="Import"
          onClick={onImport}
        >
          <i className="ti ti-file-import" />
        </button>

        <div className="dropdown">
          <button
            type="button"
            className="workspace-button workspace-button-icon"
            title="Export"
            aria-label="Export"
            aria-expanded={openMenu === 'export'}
            onClick={() => toggle('export')}
          >
            <i className="ti ti-file-export" />
          </button>
          <ul className={`dropdown-menu dropdown-menu-end p-2${openMenu === 'export' ? ' show' : ''}`}>
            {exportActions.map((action) => (
              <li key={action.id}>
                <Link
                  className="dropdown-item rounded-1"
                  to="#"
                  onClick={() => {
                    onExport(action);
                    onOpenMenu(null);
                  }}
                >
                  <i className={`${action.icon} me-2`} />
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Print"
          aria-label="Print"
          onClick={onPrint}
        >
          <i className="ti ti-printer" />
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          aria-controls="lp_details"
          title="Details"
          aria-label="Details"
          onClick={onOpenDetails}
        >
          <i className="ti ti-layout-sidebar-right-expand" />
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
          onClick={onNew}
        >
          <i className="ti ti-square-rounded-plus me-1" />
          New
        </button>
      </div>

      {/* Applied filter chips */}
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">
          <i className="ti ti-filter me-1" />
          Filters:
        </span>
        {chips.map((chip) => (
          <span
            className={`badge badge-soft-${chip.tone} d-inline-flex align-items-center`}
            key={chip.id}
          >
            {chip.label}{' '}
            <Link
              to="#"
              className={`ms-1 text-${chip.tone}`}
              aria-label="Remove filter"
              onClick={() => onClearChip(chip.id)}
            >
              <i className="ti ti-x" />
            </Link>
          </span>
        ))}
        {chips.length ? (
          <Link to="#" className="btn btn-link btn-sm text-primary" onClick={onClearChips}>
            Clear all
          </Link>
        ) : (
          <span className="fs-12 text-muted">None applied</span>
        )}
      </div>
    </div>
  );
};

export default LessonToolbar;
