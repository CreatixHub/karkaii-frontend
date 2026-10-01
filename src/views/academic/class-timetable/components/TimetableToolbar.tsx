import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { FilterKey, LayoutView } from '../data/classTimeTable.data';
import { advancedFilters, exportOptions, savedViews } from '../data/classTimeTable.data';

export type ToolbarMenu = 'filters' | 'views' | 'export' | null;

export interface TimetableToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  filters: Partial<Record<FilterKey, string>>;
  onFilter: (key: FilterKey, value: string) => void;
  onResetFilters: () => void;
  onApplyFilters: () => void;
  savedView: string;
  onSavedView: (id: string) => void;
  layout: LayoutView;
  onLayout: (view: LayoutView) => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
  onImport: () => void;
  onExport: (id: string) => void;
  onPrint: () => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onGenerate: () => void;
  onSaveView: () => void;
}

const TimetableToolbar = ({
  search,
  onSearch,
  filters,
  onFilter,
  onResetFilters,
  onApplyFilters,
  savedView,
  onSavedView,
  layout,
  onLayout,
  openMenu,
  onOpenMenu,
  onImport,
  onExport,
  onPrint,
  onRefresh,
  fullscreen,
  onToggleFullscreen,
  onGenerate,
  onSaveView,
}: TimetableToolbarProps) => {
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

  const toggle = (menu: ToolbarMenu) => onOpenMenu(openMenu === menu ? null : menu);

  return (
    <div className="card sticky-top data-workspace classes-workspace is-loaded mb-3">
      <div className="card-header border-bottom" ref={barRef}>
        <div className="page-toolbar">
          <div className="search-toolbar">
            <i className="ti ti-search search-toolbar-icon" />
            <input
              ref={searchRef}
              type="text"
              id="cttSearch"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search class, subject, teacher or room…"
              aria-label="Search timetable"
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
                    <label className="form-label mb-1" htmlFor={field.domId}>
                      {field.label}
                    </label>
                    <select
                      className="form-select"
                      id={field.domId}
                      value={filters[field.key] ?? (field.noAll ? field.options[0] : '')}
                      onChange={(event) => onFilter(field.key, event.target.value)}
                    >
                      {field.noAll ? null : <option value="">All</option>}
                      {field.options.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
                <div className="col-6">
                  <label className="form-label mb-1" htmlFor="ctt-week">
                    Week
                  </label>
                  <input type="text" className="form-control form-control-sm" placeholder="This week" id="ctt-week" />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
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
                    className={`dropdown-item rounded-1${savedView === item.id ? ' active' : ''}`}
                    to="#"
                    onClick={() => {
                      onOpenMenu(null);
                      onSavedView(item.id);
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
                    onOpenMenu(null);
                    onSaveView();
                  }}
                >
                  <i className="ti ti-plus me-2" />
                  Save current view
                </Link>
              </li>
            </ul>
          </div>

          <span className="flex-grow-1" />

          {/* Layout switch */}
          <div className="view-switcher" role="group" aria-label="Layout view">
            <Link
              to="#"
              className={layout === 'grid' ? 'active' : undefined}
              title="Grid view"
              aria-label="Grid view"
              onClick={() => onLayout('grid')}
            >
              <i className="ti ti-layout-grid" />
            </Link>
            <Link
              to="#"
              className={layout === 'list' ? 'active' : undefined}
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
              {exportOptions.map((option) => (
                <li key={option.id}>
                  <Link
                    className="dropdown-item rounded-1"
                    to="#"
                    onClick={() => {
                      onOpenMenu(null);
                      onExport(option.id);
                    }}
                  >
                    <i className={`${option.icon} me-2`} />
                    {option.label}
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
            title="Refresh"
            aria-label="Refresh"
            onClick={onRefresh}
          >
            <i className="ti ti-refresh" />
          </button>
          <button
            type="button"
            className="workspace-button workspace-button-icon"
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-pressed={fullscreen}
            onClick={onToggleFullscreen}
          >
            <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm d-inline-flex align-items-center"
            onClick={onGenerate}
          >
            <i className="ti ti-square-rounded-plus me-1" />
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimetableToolbar;
