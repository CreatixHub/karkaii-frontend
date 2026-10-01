import { useEffect, useRef } from 'react';
import type {
  BulkActionId,
  ColumnId,
  FilterField,
  SavedViewId,
  SortKey,
} from '../data/staffAttendanceWorkspace.data';
import {
  bulkActions,
  filterChipLabels,
  filterFields,
  savedViews,
  sortOptions,
  toggleableColumns,
} from '../data/staffAttendanceWorkspace.data';

export type ToolbarMenu = 'filter' | 'sort' | 'views' | 'bulk' | 'columns' | 'export' | null;

export interface ActiveChip {
  id: string;
  label: string;
  tone: string;
}

export interface StaffAttendanceToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  /** The filter panel's uncommitted values. */
  draft: Record<string, string>;
  onDraft: (id: string, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  view: SavedViewId;
  onView: (view: SavedViewId) => void;
  onSaveView: () => void;
  selectedCount: number;
  onBulkAction: (action: BulkActionId) => void;
  columns: Record<ColumnId, boolean>;
  onToggleColumn: (id: ColumnId) => void;
  density: 'compact' | 'default';
  onDensity: (density: 'compact' | 'default') => void;
  onRefresh: () => void;
  onImport: () => void;
  onExport: (format: 'pdf' | 'excel') => void;
  onPrint: () => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  onMark: () => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  chips: ActiveChip[];
  onClearChip: (id: string) => void;
  matchCount: number;
  totalCount: number;
}

const StaffAttendanceToolbar = ({
  search,
  onSearch,
  draft,
  onDraft,
  onApplyFilters,
  onResetFilters,
  sort,
  onSort,
  view,
  onView,
  onSaveView,
  selectedCount,
  onBulkAction,
  columns,
  onToggleColumn,
  density,
  onDensity,
  onRefresh,
  onImport,
  onExport,
  onPrint,
  fullscreen,
  onFullscreen,
  onMark,
  openMenu,
  onOpenMenu,
  chips,
  onClearChip,
  matchCount,
  totalCount,
}: StaffAttendanceToolbarProps) => {
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

  const renderField = (field: FilterField) => {
    if (field.kind === 'select') {
      return (
        <select
          className="form-select"
          id={field.id}
          value={draft[field.id] ?? ''}
          onChange={(event) => onDraft(field.id, event.target.value)}
        >
          <option value="">All</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      );
    }

    return (
      <input
        type="text"
        className={`form-control form-control-sm ${
          field.kind === 'date' ? 'filter-datepicker' : 'filter-daterange'
        }`}
        placeholder={field.placeholder}
        id={field.id}
        value={draft[field.id] ?? ''}
        onChange={(event) => onDraft(field.id, event.target.value)}
      />
    );
  };

  return (
    <div className="card-header border-bottom sticky-top bg-white" ref={barRef}>
      <div className="page-toolbar">
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            type="text"
            id="attSearch"
            ref={searchRef}
            placeholder="Search staff, ID or designation…"
            aria-label="Search staff attendance"
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
            aria-expanded={openMenu === 'filter'}
            onClick={toggle('filter')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filter' ? ' show' : ''}`}>
            <div className="row g-3">
              {filterFields.map((field) => (
                <div className="col-6" key={field.id}>
                  <label className="form-label mb-1" htmlFor={field.id}>
                    {field.label}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b>{matchCount}</b> of {totalCount} staff match
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

        {/* Sort */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'sort'}
            onClick={toggle('sort')}
          >
            <i className="ti ti-sort-ascending-2" />
            Sort
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'sort' ? ' show' : ''}`}>
            <li className="context-menu-head">Sort by</li>
            {sortOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={`dropdown-item rounded-1${sort === option.id ? ' active' : ''}`}
                  onClick={() => {
                    onSort(option.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={`${option.icon} me-2`} />
                  {option.label}
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
            aria-expanded={openMenu === 'views'}
            onClick={toggle('views')}
          >
            <i className="ti ti-bookmark" />
            Saved Views
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'views' ? ' show' : ''}`}>
            <li className="context-menu-head">My Views</li>
            {savedViews.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`dropdown-item rounded-1${view === item.id ? ' active' : ''}`}
                  onClick={() => {
                    onView(item.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={`${item.icon} me-2`} />
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
                className="dropdown-item rounded-1 text-primary"
                onClick={() => {
                  onSaveView();
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-plus me-2" />
                Save current view
              </button>
            </li>
          </ul>
        </div>

        {/* Bulk Actions */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'bulk'}
            onClick={toggle('bulk')}
          >
            <i className="ti ti-checkbox" />
            Bulk Actions
            {selectedCount > 0 ? <span className="result-count">{selectedCount}</span> : null}
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'bulk' ? ' show' : ''}`}>
            <li className="context-menu-head">Selected staff</li>
            {bulkActions.map((action) => (
              <li key={action.id}>
                <button
                  type="button"
                  className="dropdown-item rounded-1"
                  onClick={() => {
                    onBulkAction(action.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={`${action.icon} me-2`} />
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Columns */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'columns'}
            onClick={toggle('columns')}
          >
            <i className="ti ti-columns-3" />
            Columns
          </button>
          <ul className={`dropdown-menu p-2${openMenu === 'columns' ? ' show' : ''}`}>
            <li className="context-menu-head">Visible columns</li>
            {toggleableColumns.map((column) => (
              <li key={column.id}>
                <label className="dropdown-item">
                  <input
                    className="form-check-input me-2 mt-0"
                    type="checkbox"
                    checked={columns[column.id]}
                    onChange={() => onToggleColumn(column.id)}
                  />
                  {column.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <span className="flex-grow-1" />

        <div className="density-toggle" role="group" aria-label="Row density">
          <button
            type="button"
            className={density === 'compact' ? 'active' : undefined}
            title="Compact"
            aria-label="Compact"
            aria-pressed={density === 'compact'}
            onClick={() => onDensity('compact')}
          >
            <i className="ti ti-baseline-density-small" />
          </button>
          <button
            type="button"
            className={density === 'default' ? 'active' : undefined}
            title="Default"
            aria-label="Default"
            aria-pressed={density === 'default'}
            onClick={() => onDensity('default')}
          >
            <i className="ti ti-baseline-density-medium" />
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
          title="Import Attendance"
          aria-label="Import Attendance"
          onClick={onImport}
        >
          <i className="ti ti-file-import" />
        </button>

        {/* Export */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button workspace-button-icon"
            title="Export"
            aria-label="Export"
            aria-expanded={openMenu === 'export'}
            onClick={toggle('export')}
          >
            <i className="ti ti-file-export" />
          </button>
          <ul className={`dropdown-menu dropdown-menu-end p-2${openMenu === 'export' ? ' show' : ''}`}>
            <li>
              <button
                type="button"
                className="dropdown-item rounded-1"
                onClick={() => {
                  onExport('pdf');
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-file-type-pdf me-2" />
                Export as PDF
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item rounded-1"
                onClick={() => {
                  onExport('excel');
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-file-type-xls me-2" />
                Export as Excel
              </button>
            </li>
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
          title="Fullscreen"
          aria-label="Fullscreen"
          aria-pressed={fullscreen}
          onClick={onFullscreen}
        >
          <i className="ti ti-arrows-maximize" />
        </button>
        <button type="button" className="btn btn-primary btn-sm d-inline-flex align-items-center" onClick={onMark}>
          <i className="ti ti-user-check me-1" />
          Mark
        </button>
      </div>

      {/* Active filters — three hardcoded samples in the template. */}
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">
          <i className="ti ti-filter me-1" />
          Filters:
        </span>
        {chips.map((chip) => (
          <span className={`badge badge-soft-${chip.tone} d-inline-flex align-items-center`} key={chip.id}>
            {filterChipLabels[chip.id] ?? chip.id} : {chip.label}{' '}
            <button
              type="button"
              className={`ms-1 btn btn-link p-0 border-0 text-${chip.tone}`}
              aria-label="Remove filter"
              onClick={() => onClearChip(chip.id)}
            >
              <i className="ti ti-x" />
            </button>
          </span>
        ))}
        {chips.length > 0 ? (
          <button type="button" className="btn btn-link btn-sm text-primary" onClick={onResetFilters}>
            Clear all
          </button>
        ) : (
          <span className="fs-12 text-muted">None applied</span>
        )}
      </div>
    </div>
  );
};

export default StaffAttendanceToolbar;
