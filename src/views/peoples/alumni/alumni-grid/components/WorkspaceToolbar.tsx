import { useEffect, useRef, useState } from 'react';
import type {
  AlumniFilterState,
} from '../data/alumni.data';
import {
  batchOptions,
  chapterOptions,
  countryOptions,
  departmentOptions,
  industryOptions,
  openToOptions,
  professionOptions,
  sortMenuOptions,
  yearOptions,
} from '../data/alumni.data';

export type ToolbarMenu = 'batch' | 'year' | 'filters' | 'sort' | 'export' | null;

export interface FacetChip {
  key: string;
  label: string;
}

export interface WorkspaceToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  batch: string;
  onBatch: (id: string) => void;
  year: string;
  onYear: (id: string) => void;
  filters: AlumniFilterState;
  onApplyFilters: (filters: AlumniFilterState) => void;
  sort: 'recent' | 'name' | 'year' | 'connections';
  onSort: (id: 'recent' | 'name' | 'year' | 'connections') => void;
  onRefresh: () => void;
  onExport: (kind: 'pdf' | 'excel' | 'csv') => void;
  chips: FacetChip[];
  onClearChip: (key: string) => void;
  onClearAll: () => void;
  matchCount: number;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
}

const WorkspaceToolbar = ({
  search,
  onSearch,
  batch,
  onBatch,
  year,
  onYear,
  filters,
  onApplyFilters,
  sort,
  onSort,
  onRefresh,
  onExport,
  chips,
  onClearChip,
  onClearAll,
  matchCount,
  openMenu,
  onOpenMenu,
}: WorkspaceToolbarProps) => {
  const [draft, setDraft] = useState<AlumniFilterState>(filters);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenu === 'filters') setDraft(filters);
  }, [openMenu, filters]);

  useEffect(() => {
    if (!openMenu) return;
    const close = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) onOpenMenu(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenMenu(null);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [openMenu, onOpenMenu]);

  const toggle = (menu: ToolbarMenu) => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card-header border-bottom" ref={containerRef}>
      <div className="page-toolbar">
        {/* Search Alumni */}
        <div className="search-toolbar">
          <i className="ti ti-search search-toolbar-icon" />
          <input
            type="text"
            id="alxSearch"
            placeholder="Search alumni by name, company, skill or chapter…"
            aria-label="Search alumni"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
          <span className="search-toolbar-kbd">⌘K</span>
        </div>

        {/* Batch */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'batch'}
            onClick={() => toggle('batch')}
          >
            <i className="ti ti-users-group" />
            Batch
          </button>
          <ul className={`dropdown-menu${openMenu === 'batch' ? ' show' : ''}`}>
            <li className="context-menu-head">Alumni batch</li>
            {batchOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={`dropdown-item${batch === option.id ? ' active' : ''}`}
                  onClick={() => {
                    onBatch(option.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className={option.id === 'all' ? 'ti ti-layout-list' : 'ti ti-school'} />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Graduation Year */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'year'}
            onClick={() => toggle('year')}
          >
            <i className="ti ti-certificate" />
            Year
          </button>
          <ul className={`dropdown-menu${openMenu === 'year' ? ' show' : ''}`}>
            <li className="context-menu-head">Graduation year</li>
            {yearOptions.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  className={`dropdown-item${year === option.id ? ' active' : ''}`}
                  onClick={() => {
                    onYear(option.id);
                    onOpenMenu(null);
                  }}
                >
                  <i className="ti ti-calendar" />
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Department / Profession / Country / Chapter / Industry */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button dropdown-toggle"
            aria-expanded={openMenu === 'filters'}
            onClick={() => toggle('filters')}
          >
            <i className="ti ti-adjustments-horizontal" />
            Filters
            <span className="result-count">{chips.length}</span>
          </button>
          <div className={`dropdown-menu p-3 filter-menu${openMenu === 'filters' ? ' show' : ''}`}>
            <div className="row g-3">
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="department">
                  Department
                </label>
                <select
                  className="form-select"
                  id="department"
                  value={draft.department}
                  onChange={(event) => setDraft((current) => ({ ...current, department: event.target.value }))}
                >
                  <option value="">All departments</option>
                  {departmentOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="profession">
                  Profession
                </label>
                <select
                  className="form-select"
                  id="profession"
                  value={draft.profession}
                  onChange={(event) => setDraft((current) => ({ ...current, profession: event.target.value }))}
                >
                  <option value="">All professions</option>
                  {professionOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="country">
                  Country
                </label>
                <select
                  className="form-select"
                  id="country"
                  value={draft.country}
                  onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value }))}
                >
                  <option value="">All countries</option>
                  {countryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="chapter">
                  Chapter
                </label>
                <select
                  className="form-select"
                  id="chapter"
                  value={draft.chapter}
                  onChange={(event) => setDraft((current) => ({ ...current, chapter: event.target.value }))}
                >
                  <option value="">All chapters</option>
                  {chapterOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="industry">
                  Industry
                </label>
                <select
                  className="form-select"
                  id="industry"
                  value={draft.industry}
                  onChange={(event) => setDraft((current) => ({ ...current, industry: event.target.value }))}
                >
                  <option value="">All industries</option>
                  {industryOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label mb-1" htmlFor="open-to">
                  Open to
                </label>
                <select
                  className="form-select"
                  id="open-to"
                  value={draft.openTo}
                  onChange={(event) => setDraft((current) => ({ ...current, openTo: event.target.value }))}
                >
                  <option value="">Any intent</option>
                  {openToOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between gap-2 mt-3 pt-3 border-top">
              <span className="fs-12 text-muted">
                <b>248</b> of 4,120 alumni match
              </span>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-light btn-sm" onClick={() => setDraft(filters)}>
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    onApplyFilters(draft);
                    onOpenMenu(null);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>

        <span className="flex-grow-1" />

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
          <ul className={`dropdown-menu dropdown-menu-end${openMenu === 'sort' ? ' show' : ''}`}>
            <li className="context-menu-head">Sort alumni by</li>
            {sortMenuOptions.map((option) => (
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

        {/* Refresh */}
        <button type="button" className="workspace-button workspace-button-icon" title="Refresh" aria-label="Refresh" onClick={onRefresh}>
          <i className="ti ti-refresh" />
        </button>

        {/* Export */}
        <div className="dropdown">
          <button
            type="button"
            className="workspace-button workspace-button-icon dropdown-toggle"
            aria-expanded={openMenu === 'export'}
            aria-label="Export"
            onClick={() => toggle('export')}
          >
            <i className="ti ti-file-export" />
          </button>
          <ul className={`dropdown-menu dropdown-menu-end${openMenu === 'export' ? ' show' : ''}`}>
            <li className="context-menu-head">Export</li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onExport('pdf');
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-file-type-pdf" />
                Export as PDF
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onExport('excel');
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-file-type-xls" />
                Export as Excel
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  onExport('csv');
                  onOpenMenu(null);
                }}
              >
                <i className="ti ti-file-type-csv" />
                Export as CSV
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Active facets */}
      <div className="quick-filters">
        <span className="text-muted fs-12 fw-semibold me-1">Active:</span>
        {chips.map((chip) => (
          <span className="member-tag is-accent" key={chip.key}>
            <i className="ti ti-building-community" />
            {chip.label}
            <i className="ti ti-x" role="button" onClick={() => onClearChip(chip.key)} />
          </span>
        ))}
        <button type="button" className="btn btn-link btn-sm text-primary" onClick={onClearAll}>
          Clear all
        </button>
        <span className="ms-auto fs-12 text-muted">
          Showing <b className="text-dark">{matchCount}</b> of 248
        </span>
      </div>
    </div>
  );
};

export default WorkspaceToolbar;
