import { Fragment, useEffect, useRef } from 'react';
import type { ChangeEvent } from 'react';
import type {
  ColumnId,
  DensityId,
  QuickFilterId,
  ReportTypeId,
  SortId,
} from '../data/studentPerformance.data';
import {
  columnToggles,
  densityOptions,
  filterFields,
  moreFilterFields,
  quickFilters,
  reportTypes,
  savedViews,
  sortOptions,
} from '../data/studentPerformance.data';

export type ToolbarMenu = 'views' | 'more' | 'columns' | 'sort' | null;

export interface ReportToolbarProps {
  reportType: ReportTypeId;
  onReportType: (id: ReportTypeId) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  search: string;
  onSearch: (value: string) => void;
  assessedBetween: string;
  onAssessedBetween: (value: string) => void;
  filters: Record<string, string>;
  onFilter: (id: string, value: string) => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  savedView: string;
  onSavedView: (id: string) => void;
  onSaveCurrentView: () => void;
  scoreFrom: string;
  scoreTo: string;
  onScore: (key: 'from' | 'to', value: string) => void;
  moreFilters: Record<string, string>;
  onMoreFilter: (id: string, value: string) => void;
  attentionOnly: boolean;
  onAttentionOnly: (value: boolean) => void;
  onResetMore: () => void;
  onApplyMore: () => void;
  columns: Record<ColumnId, boolean>;
  onToggleColumn: (id: ColumnId) => void;
  onShowAllColumns: () => void;
  sort: SortId;
  onSort: (id: SortId) => void;
  density: DensityId;
  onDensity: (id: DensityId) => void;
  fullscreen: boolean;
  onFullscreen: () => void;
  quickFilter: QuickFilterId;
  onQuickFilter: (id: QuickFilterId) => void;
  onOpenModal: (modal: 'reportCard' | 'remarks' | 'share') => void;
}

const ReportToolbar = ({
  reportType,
  onReportType,
  filtersOpen,
  onToggleFilters,
  search,
  onSearch,
  assessedBetween,
  onAssessedBetween,
  filters,
  onFilter,
  onResetFilters,
  onRefresh,
  openMenu,
  onOpenMenu,
  savedView,
  onSavedView,
  onSaveCurrentView,
  scoreFrom,
  scoreTo,
  onScore,
  moreFilters,
  onMoreFilter,
  attentionOnly,
  onAttentionOnly,
  onResetMore,
  onApplyMore,
  columns,
  onToggleColumn,
  onShowAllColumns,
  sort,
  onSort,
  density,
  onDensity,
  fullscreen,
  onFullscreen,
  quickFilter,
  onQuickFilter,
  onOpenModal,
}: ReportToolbarProps) => {
  const barRef = useRef<HTMLDivElement>(null);

  // Outside click and Escape close whichever dropdown is open, as Bootstrap did.
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

  const selectChange =
    (id: string) =>
    (event: ChangeEvent<HTMLSelectElement>) =>
      onFilter(id, event.target.value);

  return (
    <div className="card" ref={barRef}>
      <div className="card-body">
        {/* Band 1 — what the report covers */}
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div className="d-flex align-items-center flex-wrap gap-2">
            <span className="fs-12 text-muted fw-semibold me-1">Report on:</span>
            <div
              className="custom-btn-group custom-btn-group-fill custom-btn-group-sm"
              role="group"
              aria-label="Report type"
            >
              {reportTypes.map((type) => (
                <Fragment key={type.id}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="rep_type"
                    id={type.id}
                    checked={reportType === type.id}
                    onChange={() => onReportType(type.id)}
                  />
                  <label className="btn" htmlFor={type.id}>
                    <i className={`${type.icon} me-1`} />
                    {type.label}
                  </label>
                </Fragment>
              ))}
            </div>
            <span className="badge badge-soft-primary">
              <i className="ti ti-database me-1" />
              1,186 students
            </span>
          </div>
          <div className="d-flex align-items-center flex-wrap gap-2">
            <button
              type="button"
              className="btn btn-sm btn-primary d-inline-flex align-items-center"
              onClick={() => onOpenModal('reportCard')}
            >
              <i className="ti ti-player-play me-1" />
              Generate Report
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
              onClick={() => onOpenModal('remarks')}
            >
              <i className="ti ti-message-2 me-1" />
              Add Remarks
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white btn-icon"
              aria-label="Export PDF"
              title="Export PDF"
            >
              <i className="ti ti-file-type-pdf" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white btn-icon"
              aria-label="Export Excel"
              title="Export Excel"
            >
              <i className="ti ti-file-type-xls" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white btn-icon"
              aria-label="Print"
              title="Print"
              onClick={() => window.print()}
            >
              <i className="ti ti-printer" />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white btn-icon"
              aria-label="Share"
              title="Share"
              onClick={() => onOpenModal('share')}
            >
              <i className="ti ti-share" />
            </button>
          </div>
        </div>

        {/* Band 2 — narrow the report down. Collapsed on load, as the template ships it. */}
        <div className="border-top mt-3 pt-3">
          <div className="accordion accordion-flush">
            <div className="accordion-item border-0 bg-transparent">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${filtersOpen ? '' : 'collapsed'} p-0 bg-transparent shadow-none`}
                  type="button"
                  aria-expanded={filtersOpen}
                  aria-controls="rep_filters"
                  onClick={onToggleFilters}
                >
                  <span className="fs-12 text-muted fw-semibold me-2">
                    <i className="ti ti-filter me-1" />
                    Filters
                  </span>
                  <span className="badge badge-soft-primary me-2">2 active</span>
                  <span className="fs-12 text-muted d-none d-lg-inline">
                    Term 1 Exam · 2026-2027 · all classes · all levels
                  </span>
                </button>
              </h2>
              <div
                id="rep_filters"
                className={`accordion-collapse collapse ${filtersOpen ? 'show' : ''}`}
              >
                <div className="accordion-body p-0 pt-3">
                  <div className="row g-2 align-items-end">
                    <div className="col-xxl-3 col-lg-4 col-md-6">
                      <label className="form-label mb-1 fs-12" htmlFor="search-student">
                        Search Student
                      </label>
                      <div className="input-icon-start position-relative">
                        <span className="icon-addon">
                          <i className="ti ti-search" />
                        </span>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Name, admission no. or class"
                          id="search-student"
                          value={search}
                          onChange={(event) => onSearch(event.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-xxl-3 col-lg-4 col-md-6">
                      <label className="form-label mb-1 fs-12" htmlFor="assessed-between">
                        Assessed Between
                      </label>
                      <div className="input-icon-start position-relative">
                        <span className="icon-addon">
                          <i className="ti ti-calendar" />
                        </span>
                        <input
                          type="text"
                          className="form-control form-control-sm date-range bookingrange"
                          placeholder="Select"
                          id="assessed-between"
                          value={assessedBetween}
                          onChange={(event) => onAssessedBetween(event.target.value)}
                        />
                      </div>
                    </div>
                    {filterFields.map((field) => (
                      <div className={field.col} key={field.id}>
                        <label className="form-label mb-1 fs-12" htmlFor={field.id}>
                          {field.label}
                        </label>
                        <select
                          className="form-select lh-base"
                          id={field.id}
                          value={filters[field.id] ?? field.options[0]}
                          onChange={selectChange(field.id)}
                        >
                          {field.options.map((option) => (
                            <option key={option}>{option}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    <div className="col-xxl-2 col-lg-4 col-md-6">
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-light flex-fill"
                          onClick={onResetFilters}
                        >
                          <i className="ti ti-restore me-1" />
                          Reset
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          title="Refresh"
                          aria-label="Refresh"
                          onClick={onRefresh}
                        >
                          <i className="ti ti-refresh" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Band 3 — how the grid below is displayed */}
        <div className="border-top mt-3 pt-3">
          <div className="page-toolbar">
            {/* Saved Views */}
            <div className={`dropdown ${openMenu === 'views' ? 'show' : ''}`}>
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'views'}
                onClick={() => onOpenMenu(openMenu === 'views' ? null : 'views')}
              >
                <i className="ti ti-bookmark" />
                Saved Views
              </button>
              <ul className={`dropdown-menu ${openMenu === 'views' ? 'show' : ''}`}>
                <li className="context-menu-head">My Views</li>
                {savedViews.map((view) => (
                  <li key={view.id}>
                    <button
                      type="button"
                      className={`dropdown-item ${savedView === view.id ? 'active' : ''}`}
                      onClick={() => onSavedView(view.id)}
                    >
                      <i className={view.icon} />
                      {view.label}
                      <span className="view-count">{view.count}</span>
                    </button>
                  </li>
                ))}
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button type="button" className="dropdown-item text-primary" onClick={onSaveCurrentView}>
                    <i className="ti ti-plus" />
                    Save current view
                  </button>
                </li>
              </ul>
            </div>

            {/* More Filters — only what is not already a field above */}
            <div className={`dropdown ${openMenu === 'more' ? 'show' : ''}`}>
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'more'}
                onClick={() => onOpenMenu(openMenu === 'more' ? null : 'more')}
              >
                <i className="ti ti-adjustments-horizontal" />
                More Filters
                <span className="result-count">2</span>
              </button>
              <div className={`dropdown-menu p-3 filter-menu ${openMenu === 'more' ? 'show' : ''}`}>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label mb-1" htmlFor="score-from">
                      Score From
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min={0}
                      max={100}
                      id="score-from"
                      value={scoreFrom}
                      onChange={(event) => onScore('from', event.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1" htmlFor="score-to">
                      Score To
                    </label>
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      min={0}
                      max={100}
                      id="score-to"
                      value={scoreTo}
                      onChange={(event) => onScore('to', event.target.value)}
                    />
                  </div>
                  {moreFilterFields.map((field) => (
                    <div className="col-6" key={field.id}>
                      <label className="form-label mb-1" htmlFor={field.id}>
                        {field.label}
                      </label>
                      <select
                        className="form-select"
                        id={field.id}
                        value={moreFilters[field.id] ?? field.options[0]}
                        onChange={(event) => onMoreFilter(field.id, event.target.value)}
                      >
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                  <div className="col-12">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="fltAttention"
                        checked={attentionOnly}
                        onChange={(event) => onAttentionOnly(event.target.checked)}
                      />
                      <label className="form-check-label fs-13" htmlFor="fltAttention">
                        Only students needing academic attention
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
                  <span className="fs-12 text-muted">
                    <b>8</b> of 1,186 students match
                  </span>
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light btn-sm" onClick={onResetMore}>
                      Reset
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={onApplyMore}>
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column Visibility */}
            <div className={`dropdown ${openMenu === 'columns' ? 'show' : ''}`}>
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'columns'}
                onClick={() => onOpenMenu(openMenu === 'columns' ? null : 'columns')}
              >
                <i className="ti ti-columns-3" />
                Columns
              </button>
              <ul className={`dropdown-menu p-2 column-menu ${openMenu === 'columns' ? 'show' : ''}`}>
                <li className="context-menu-head">Toggle columns</li>
                {columnToggles.map((column) => (
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

            {/* Sort */}
            <div className={`dropdown ${openMenu === 'sort' ? 'show' : ''}`}>
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'sort'}
                onClick={() => onOpenMenu(openMenu === 'sort' ? null : 'sort')}
              >
                <i className="ti ti-sort-ascending-2" />
                Sort
              </button>
              <ul className={`dropdown-menu ${openMenu === 'sort' ? 'show' : ''}`}>
                <li className="context-menu-head">Sort by</li>
                {sortOptions.map((option) => (
                  <li key={option.id}>
                    <button
                      type="button"
                      className={`dropdown-item ${sort === option.id ? 'active' : ''}`}
                      onClick={() => onSort(option.id)}
                    >
                      <i className={option.icon} />
                      {option.label}
                    </button>
                  </li>
                ))}
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
                  aria-label={option.ariaLabel}
                  onClick={() => onDensity(option.id)}
                >
                  <i className={option.icon} />
                </button>
              ))}
            </div>

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
                className={`quick-filter ${quickFilter === filter.id ? 'active' : ''}`}
                onClick={() => onQuickFilter(filter.id)}
              >
                <i className={filter.icon} />
                {filter.label} <span className="quick-filter-count">{filter.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportToolbar;
