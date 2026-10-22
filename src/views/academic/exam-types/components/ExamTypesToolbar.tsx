import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import type {
  ExportAction,
  FilterKey,
  GroupByKey,
  QuickFilterId,
  SortKey,
} from '../data/examTypes.data';
import {
  exportActions,
  filterFields,
  groupByOptions,
  quickFilters,
  savedViews,
  sortOptions,
  strings,
} from '../data/examTypes.data';

type MenuId = 'views' | 'filters' | 'group' | 'export' | 'sort';

export interface FilterChip {
  key: FilterKey;
  label: string;
}

export interface ExamTypesToolbarProps {
  searchRef: RefObject<HTMLInputElement | null>;
  search: string;
  onSearch: (value: string) => void;

  savedView: QuickFilterId | null;
  onSavedView: (id: QuickFilterId | null, label: string) => void;
  onSaveCurrentView: () => void;

  filterDraft: Partial<Record<FilterKey, string>>;
  onFilterDraft: (key: FilterKey, value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  /** How many rows the draft selection would leave visible, and the full row count. */
  draftMatchCount: number;
  totalCount: number;
  appliedCount: number;

  groupBy: GroupByKey | null;
  onGroupBy: (key: GroupByKey | null) => void;

  quickFilter: QuickFilterId | null;
  onQuickFilter: (id: QuickFilterId) => void;
  quickCounts: Record<QuickFilterId, number>;
  viewCounts: Record<string, number>;

  sort: SortKey;
  onSort: (key: SortKey) => void;

  chips: FilterChip[];
  onRemoveChip: (key: FilterKey) => void;
  onClearChips: () => void;

  onImport: () => void;
  onExport: (action: ExportAction) => void;
  onPrint: () => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

const ExamTypesToolbar = ({
  searchRef,
  search,
  onSearch,
  savedView,
  onSavedView,
  onSaveCurrentView,
  filterDraft,
  onFilterDraft,
  onApplyFilters,
  onResetFilters,
  draftMatchCount,
  totalCount,
  appliedCount,
  groupBy,
  onGroupBy,
  quickFilter,
  onQuickFilter,
  quickCounts,
  viewCounts,
  sort,
  onSort,
  chips,
  onRemoveChip,
  onClearChips,
  onImport,
  onExport,
  onPrint,
  onRefresh,
  fullscreen,
  onToggleFullscreen,
}: ExamTypesToolbarProps) => {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!toolbarRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [openMenu]);

  const toggleMenu = (id: MenuId) => setOpenMenu((current) => (current === id ? null : id));

  return (
    <div className="data-workspace page-toolbar-compact" ref={toolbarRef}>
      <div className="card">
        <div className="card-header border-bottom">
          <div className="page-toolbar">
            {/* Advanced Search */}
            <div className="search-toolbar">
              <i className="ti ti-search search-toolbar-icon" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
                placeholder="Search exam type, code or category…"
                aria-label="Search exam types"
              />
              <span className="search-toolbar-kbd">&#8984;K</span>
            </div>

            {/* Saved Views */}
            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'views'}
                onClick={() => toggleMenu('views')}
              >
                <i className="ti ti-bookmark" />
                Saved Views
              </button>
              <ul className={`dropdown-menu${openMenu === 'views' ? ' show' : ''}`}>
                <li className="context-menu-head">My Views</li>
                {savedViews.map((view) => (
                  <li key={view.label}>
                    <Link
                      className={`dropdown-item${savedView === view.id ? ' active' : ''}`}
                      to="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setOpenMenu(null);
                        onSavedView(view.id, view.label);
                      }}
                    >
                      <i className={view.icon} />
                      {view.label}
                      <span className="view-count">{viewCounts[view.label] ?? 0}</span>
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
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenMenu(null);
                      onSaveCurrentView();
                    }}
                  >
                    <i className="ti ti-plus" />
                    Save current view
                  </Link>
                </li>
              </ul>
            </div>

            {/* Advanced Filter */}
            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'filters'}
                onClick={() => toggleMenu('filters')}
              >
                <i className="ti ti-adjustments-horizontal" />
                Filters
                {appliedCount ? <span className="result-count">{appliedCount}</span> : null}
              </button>
              <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
                <div className="row g-3">
                  {filterFields.map((field) => (
                    <div className="col-6" key={field.key}>
                      <label className="form-label mb-1" htmlFor={field.domId}>
                        {field.label}
                      </label>
                      <select
                        className="form-select"
                        id={field.domId}
                        value={filterDraft[field.key] ?? (field.hasAll ? '' : field.options[0])}
                        onChange={(event) => onFilterDraft(field.key, event.target.value)}
                      >
                        {field.hasAll ? <option value="">All</option> : null}
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                  <span className="fs-12 text-muted">
                    <b>{draftMatchCount}</b> of {totalCount}
                    {strings.filterMatchSuffix}
                  </span>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light btn-sm" onClick={onResetFilters}>
                      Reset
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setOpenMenu(null);
                        onApplyFilters();
                      }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Group By */}
            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'group'}
                onClick={() => toggleMenu('group')}
              >
                <i className="ti ti-layout-columns" />
                Group By
              </button>
              <ul className={`dropdown-menu column-menu${openMenu === 'group' ? ' show' : ''}`}>
                <li className="context-menu-head">Group exam types</li>
                {groupByOptions.map((option) => (
                  <li key={option.key}>
                    <Link
                      className={`dropdown-item${groupBy === option.key ? ' active' : ''}`}
                      to="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setOpenMenu(null);
                        onGroupBy(option.key);
                      }}
                    >
                      <i className={option.icon} />
                      {option.label}
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
                    onClick={(event) => {
                      event.preventDefault();
                      setOpenMenu(null);
                      onGroupBy(null);
                    }}
                  >
                    <i className="ti ti-rotate" />
                    Clear grouping
                  </Link>
                </li>
              </ul>
            </div>

            <span className="flex-grow-1" />

            {/* Import */}
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              aria-label="Import"
              title="Import"
              onClick={onImport}
            >
              <i className="ti ti-file-import" />
            </button>

            {/* Export */}
            <div className="dropdown">
              <button
                type="button"
                className="workspace-button workspace-button-icon"
                aria-expanded={openMenu === 'export'}
                aria-label="Export"
                onClick={() => toggleMenu('export')}
              >
                <i className="ti ti-file-export" />
              </button>
              <ul className={`dropdown-menu dropdown-menu-end${openMenu === 'export' ? ' show' : ''}`}>
                <li className="context-menu-head">Export as</li>
                {exportActions.map((action) => (
                  <li key={action.id}>
                    <Link
                      className="dropdown-item"
                      to="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setOpenMenu(null);
                        onExport(action);
                      }}
                    >
                      <i className={action.icon} />
                      {action.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Print */}
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              aria-label="Print"
              title="Print"
              onClick={onPrint}
            >
              <i className="ti ti-printer" />
            </button>

            {/* Refresh */}
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              aria-label="Refresh"
              title="Refresh"
              onClick={onRefresh}
            >
              <i className="ti ti-refresh" />
            </button>

            {/* Fullscreen */}
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              aria-label="Toggle fullscreen"
              aria-pressed={fullscreen}
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              onClick={onToggleFullscreen}
            >
              <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
            </button>
          </div>

          {/* Quick filters */}
          <div className="quick-filters">
            <span className="text-muted fs-12 fw-semibold me-1">Quick:</span>
            {quickFilters.map((filter) => (
              <button
                type="button"
                className={`quick-filter${quickFilter === filter.id ? ' active' : ''}`}
                key={filter.id}
                aria-pressed={quickFilter === filter.id}
                onClick={() => onQuickFilter(filter.id)}
              >
                <i className={filter.icon} />
                {filter.label} <span className="quick-filter-count">{quickCounts[filter.id]}</span>
              </button>
            ))}

            {/* Sort */}
            <div className="dropdown ms-auto">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'sort'}
                onClick={() => toggleMenu('sort')}
              >
                <i className="ti ti-sort-ascending-2" />
                Sort
              </button>
              <ul className={`dropdown-menu dropdown-menu-end${openMenu === 'sort' ? ' show' : ''}`}>
                <li className="context-menu-head">Sort by</li>
                {sortOptions.map((option) => (
                  <li key={option.key}>
                    <Link
                      className={`dropdown-item${sort === option.key ? ' active' : ''}`}
                      to="#"
                      onClick={(event) => {
                        event.preventDefault();
                        setOpenMenu(null);
                        onSort(option.key);
                      }}
                    >
                      <i className={option.icon} />
                      {option.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Active filter chips */}
          <div className="filter-chips" aria-live="polite">
            {chips.map((chip) => (
              <span className="filter-chip-item" key={chip.key}>
                {chip.label}
                <button type="button" aria-label="Remove filter" onClick={() => onRemoveChip(chip.key)}>
                  <i className="ti ti-x" />
                </button>
              </span>
            ))}
            {chips.length ? (
              <Link
                to="#"
                className="filter-chip-clear fs-12"
                onClick={(event) => {
                  event.preventDefault();
                  onClearChips();
                }}
              >
                Clear all
              </Link>
            ) : null}
          </div>
        </div>
        <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2 border-top-0">
          <p className="mb-0 fs-13 text-muted d-inline-flex align-items-center">
            <i className="ti ti-info-circle me-1" />
            Configuration applies to the active academic session. Changes are versioned and audited.
          </p>
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" />
            Session Locked for Editing
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamTypesToolbar;
