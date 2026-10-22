import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { ColumnId, DensityId, FilterKey, ToolbarMenu } from '../data/deleteRequest.data';
import { advancedFilters, columnDefs, densityOptions, quickFilters, savedViews } from '../data/deleteRequest.data';

export interface FilterChip {
  id: string;
  label: string;
}

export interface DeleteRequestToolbarProps {
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
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: FilterChip[];
  onClearChip: (id: string) => void;
  onAction: (id: string) => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

const DeleteRequestToolbar = ({
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
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  onAction,
  fullscreen,
  onToggleFullscreen,
}: DeleteRequestToolbarProps) => {
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

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="card-header border-bottom" ref={barRef}>
      <div className="card-toolbar">
        <div className="card-search">
          <i className="ti ti-search card-search-ic" />
          <input
            ref={searchRef}
            type="text"
            id="darSearch"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search ID, user, reason…"
            aria-label="Search requests"
          />
          <span className="card-search-kbd" id="darSearchKbd" hidden={search !== ''}>
            ⌘K
          </span>
          {search ? (
            <button
              type="button"
              className="card-search-x"
              id="darSearchClear"
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
            className="card-btn dropdown-toggle"
            aria-expanded={openMenu === 'views'}
            onClick={() => onOpenMenu(openMenu === 'views' ? null : 'views')}
          >
            <i className="ti ti-bookmark" />
            Saved Views
          </button>
          <ul className={`dropdown-menu${openMenu === 'views' ? ' show' : ''}`}>
            <li className="card-menu-head">My Views</li>
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
                  <span className="card-vcount">{viewCounts[item.id] ?? 0}</span>
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
                  onAction('save_view');
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
            className="card-btn dropdown-toggle"
            aria-expanded={openMenu === 'filters'}
            onClick={() => onOpenMenu(openMenu === 'filters' ? null : 'filters')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
            {activeFilterCount > 0 ? (
              <span className="card-count" id="darFilterCount">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
          <div className={`dropdown-menu p-3 card-filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              {advancedFilters.map((field) => (
                <div className="col-6" key={field.key}>
                  <label className="form-label mb-1" htmlFor={field.inputId}>
                    {field.label}
                  </label>
                  <select
                    className="form-select"
                    id={field.inputId}
                    value={filters[field.key] ?? ''}
                    onChange={(event) => onFilter(field.key, event.target.value)}
                  >
                    <option value="">{field.placeholder}</option>
                    {field.options.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b id="darFilterHits">{matchCount}</b> of {totalCount} requests match
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
            className="card-btn dropdown-toggle"
            aria-expanded={openMenu === 'columns'}
            onClick={() => onOpenMenu(openMenu === 'columns' ? null : 'columns')}
          >
            <i className="ti ti-columns-3" />
            Columns
          </button>
          <ul className={`dropdown-menu p-2 card-col-menu${openMenu === 'columns' ? ' show' : ''}`}>
            <li className="card-menu-head">Toggle columns</li>
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

        <div className="card-density" role="group" aria-label="Row density">
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
          className="card-btn card-btn-icon"
          title="Refresh"
          aria-label="Refresh"
          onClick={() => onAction('refresh')}
        >
          <i className="ti ti-refresh" />
        </button>
        <button
          type="button"
          className="card-btn card-btn-icon"
          title="Export CSV"
          aria-label="Export CSV"
          onClick={() => onAction('export_csv')}
        >
          <i className="ti ti-file-type-csv" />
        </button>
        <button
          type="button"
          className="card-btn card-btn-icon"
          title="Export Excel"
          aria-label="Export Excel"
          onClick={() => onAction('export_excel')}
        >
          <i className="ti ti-file-type-xls" />
        </button>
        <button
          type="button"
          className="card-btn card-btn-icon"
          title="Print"
          aria-label="Print"
          onClick={() => onAction('print')}
        >
          <i className="ti ti-printer" />
        </button>
        <button
          type="button"
          className="card-btn card-btn-icon"
          title="Fullscreen"
          aria-label="Toggle fullscreen"
          aria-pressed={fullscreen}
          onClick={onToggleFullscreen}
        >
          <i className="ti ti-arrows-maximize" />
        </button>
      </div>

      <div className="card-quickbar">
        <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            className={`card-quick${view === filter.id ? ' active' : ''}`}
            aria-pressed={view === filter.id}
            onClick={() => onView(view === filter.id ? 'all' : filter.id)}
          >
            <i className={filter.icon} />
            {filter.label} <span className="card-quick-count">{quickCounts[filter.id] ?? 0}</span>
          </button>
        ))}
        {chips.length > 0 ? (
          <button
            type="button"
            className="btn btn-link btn-sm text-primary card-clear-quick"
            id="darClearQuick"
            onClick={onClearFilters}
          >
            Clear all
          </button>
        ) : null}
      </div>

      <div className="card-chips" aria-live="polite">
        {chips.map((chip) => (
          <span className="filter-chip-item" key={chip.id}>
            {chip.label}
            <button type="button" aria-label={`Remove ${chip.label}`} onClick={() => onClearChip(chip.id)}>
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

export default DeleteRequestToolbar;
