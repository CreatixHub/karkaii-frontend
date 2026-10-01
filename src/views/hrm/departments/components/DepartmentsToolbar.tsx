import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { BulkAction, ColumnId, DensityId, FilterKey, SortKey, ToolbarMenu } from '../data/departments.data';
import {
  advancedFilters,
  bulkActions,
  columnDefs,
  densityOptions,
  exportActions,
  saveViewAction,
  savedViews,
  searchPlaceholder,
  searchShortcut,
  sortOptions,
} from '../data/departments.data';

export interface DepartmentsToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onResetFilters: () => void;
  sort: SortKey;
  onSort: (id: SortKey) => void;
  view: string;
  onView: (id: string) => void;
  columns: Record<ColumnId, boolean>;
  onColumn: (id: ColumnId, visible: boolean) => void;
  density: DensityId;
  onDensity: (id: DensityId) => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  /** Removable summary chips still showing; the page owns which remain. */
  chips: { id: string; label: string; badgeClass: string; removeClass: string }[];
  onClearChip: (id: string) => void;
  onClearChips: () => void;
  onBulkAction: (action: BulkAction) => void;
  onAction: (id: string) => void;
  onAdd: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

const DepartmentsToolbar = ({
  search,
  onSearch,
  filters,
  onFilter,
  onResetFilters,
  sort,
  onSort,
  view,
  onView,
  columns,
  onColumn,
  density,
  onDensity,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  onClearChips,
  onBulkAction,
  onAction,
  onAdd,
  fullscreen,
  onToggleFullscreen,
}: DepartmentsToolbarProps) => {
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

  const toggle = (menu: Exclude<ToolbarMenu, null>) => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card-header border-bottom sticky-top bg-white" ref={barRef}>
      <div className="page-toolbar">
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            ref={searchRef}
            type="text"
            id="deptSearch"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search departments"
          />
          <span className="search-toolbar-kbd" hidden={search !== ''}>
            {searchShortcut}
          </span>
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
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
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
                    <option value="">All</option>
                    {field.options.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
              <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                Reset
              </button>
              <button type="button" className="btn btn-primary btn-sm" onClick={() => onOpenMenu(null)}>
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
                  onAction(saveViewAction.id);
                  onOpenMenu(null);
                }}
              >
                <i className={`${saveViewAction.icon} me-2`} />
                {saveViewAction.label}
              </Link>
            </li>
          </ul>
        </div>

        {/* Bulk Actions */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'bulk'}
            onClick={() => toggle('bulk')}
          >
            <i className="ti ti-checkbox" />
            Bulk Actions
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'bulk' ? ' show' : ''}`}>
            {bulkActions.map((action) => (
              <li key={action.id}>
                <Link
                  className={`dropdown-item rounded-1${action.danger ? ' text-danger' : ''}`}
                  to="#"
                  onClick={() => {
                    onOpenMenu(null);
                    onBulkAction(action);
                  }}
                >
                  <i className={`${action.icon} me-2`} />
                  {action.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Fields */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'fields'}
            onClick={() => toggle('fields')}
          >
            <i className="ti ti-columns-3" />
            Fields
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'fields' ? ' show' : ''}`}>
            <li className="context-menu-head">Card fields</li>
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
          onClick={() => onAction('refresh')}
        >
          <i className="ti ti-refresh" />
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Import"
          aria-label="Import"
          onClick={onAdd}
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
                    onOpenMenu(null);
                    onAction(action.id);
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
          onClick={() => onAction('print')}
        >
          <i className="ti ti-printer" />
        </button>
        <button
          type="button"
          className="workspace-button workspace-button-icon"
          title="Fullscreen"
          aria-label="Fullscreen"
          aria-pressed={fullscreen}
          onClick={onToggleFullscreen}
        >
          <i className="ti ti-arrows-maximize" />
        </button>
        <button type="button" className="btn btn-primary btn-sm d-inline-flex align-items-center" onClick={onAdd}>
          <i className="ti ti-square-rounded-plus me-1" />
          Add
        </button>
      </div>

      {chips.length > 0 ? (
        <div className="quick-filters">
          <span className="text-muted fs-12 fw-semibold me-1">
            <i className="ti ti-filter me-1" />
            Filters:
          </span>
          {chips.map((chip) => (
            <span className={`badge ${chip.badgeClass} d-inline-flex align-items-center`} key={chip.id}>
              {chip.label}
              <Link
                to="#"
                className={`ms-1 ${chip.removeClass}`}
                aria-label={`Remove ${chip.label}`}
                onClick={() => onClearChip(chip.id)}
              >
                <i className="ti ti-x" />
              </Link>
            </span>
          ))}
          <Link to="#" className="btn btn-link btn-sm text-primary" onClick={onClearChips}>
            Clear all
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default DepartmentsToolbar;
