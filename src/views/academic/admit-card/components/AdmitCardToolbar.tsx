import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { CardStateId, CardTemplateId } from '../data/admitCard.data';
import { batchFilters, cardTemplates, savedBatches, strings } from '../data/admitCard.data';

export type ToolbarMenu = 'batches' | 'template' | null;

export interface FilterChip {
  id: string;
  label: string;
}

export interface AdmitCardToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  savedBatch: string | null;
  onSavedBatch: (id: string) => void;
  onSaveBatch: () => void;
  template: CardTemplateId;
  onTemplate: (id: CardTemplateId) => void;
  batchFilter: CardStateId | null;
  onBatchFilter: (id: CardStateId) => void;
  chips: FilterChip[];
  onClearChip: (id: string) => void;
  onClearChips: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onRefresh: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  openMenu: ToolbarMenu;
  onOpenMenu: (menu: ToolbarMenu) => void;
}

const AdmitCardToolbar = ({
  search,
  onSearch,
  savedBatch,
  onSavedBatch,
  onSaveBatch,
  template,
  onTemplate,
  batchFilter,
  onBatchFilter,
  chips,
  onClearChip,
  onClearChips,
  onPrint,
  onDownload,
  onRefresh,
  fullscreen,
  onToggleFullscreen,
  openMenu,
  onOpenMenu,
}: AdmitCardToolbarProps) => {
  const barRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Outside click and Escape close whichever menu is open, as Bootstrap's dropdown does.
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

  return (
    <div className="data-workspace page-toolbar-compact">
      <div className="card">
        <div className="card-header border-bottom" ref={barRef}>
          <div className="page-toolbar">
            <div className="search-toolbar">
              <i className="ti ti-search search-toolbar-icon" />
              <input
                type="text"
                ref={searchRef}
                placeholder={strings.searchPlaceholder}
                aria-label="Search student"
                value={search}
                onChange={(event) => onSearch(event.target.value)}
              />
              <span className="search-toolbar-kbd">⌘K</span>
            </div>

            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'batches'}
                onClick={() => onOpenMenu(openMenu === 'batches' ? null : 'batches')}
              >
                <i className="ti ti-bookmark" />
                Saved Batches
              </button>
              <ul className={`dropdown-menu${openMenu === 'batches' ? ' show' : ''}`}>
                <li className="context-menu-head">Recent batches</li>
                {savedBatches.map((batch) => (
                  <li key={batch.id}>
                    <Link
                      className={`dropdown-item${savedBatch === batch.id ? ' active' : ''}`}
                      to="#"
                      onClick={() => {
                        onSavedBatch(batch.id);
                        onOpenMenu(null);
                      }}
                    >
                      <i className="ti ti-users" />
                      {batch.label}
                      <span className="view-count">{batch.count}</span>
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
                      onSaveBatch();
                      onOpenMenu(null);
                    }}
                  >
                    <i className="ti ti-plus" />
                    Save current batch
                  </Link>
                </li>
              </ul>
            </div>

            <div className="dropdown">
              <button
                type="button"
                className="workspace-button dropdown-toggle"
                aria-expanded={openMenu === 'template'}
                onClick={() => onOpenMenu(openMenu === 'template' ? null : 'template')}
              >
                <i className="ti ti-layout-columns" />
                Template
              </button>
              <ul className={`dropdown-menu column-menu${openMenu === 'template' ? ' show' : ''}`}>
                <li className="context-menu-head">Card template</li>
                {cardTemplates.map((item) => (
                  <li key={item.id}>
                    <Link
                      className={`dropdown-item${template === item.id ? ' active' : ''}`}
                      to="#"
                      onClick={() => {
                        onTemplate(item.id);
                        onOpenMenu(null);
                      }}
                    >
                      <i className={item.icon} />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <span className="flex-grow-1" />

            <button type="button" className="workspace-button" onClick={onPrint}>
              <i className="ti ti-printer" />
              Print
            </button>
            <button type="button" className="workspace-button" onClick={onDownload}>
              <i className="ti ti-file-type-pdf" />
              Download PDF
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              aria-label="Refresh"
              title="Refresh"
              onClick={onRefresh}
            >
              <i className="ti ti-refresh" />
            </button>
            <button
              type="button"
              className="workspace-button workspace-button-icon"
              aria-label="Toggle fullscreen"
              title="Fullscreen"
              aria-pressed={fullscreen}
              onClick={onToggleFullscreen}
            >
              <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
            </button>
          </div>

          <div className="quick-filters">
            <span className="text-muted fs-12 fw-semibold me-1">Batch:</span>
            {batchFilters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`quick-filter${batchFilter === filter.id ? ' active' : ''}`}
                aria-pressed={batchFilter === filter.id}
                onClick={() => onBatchFilter(filter.id)}
              >
                <i className={filter.icon} />
                {filter.label} <span className="quick-filter-count">{filter.count}</span>
              </button>
            ))}
          </div>

          <div className="filter-chips" aria-live="polite">
            {chips.map((chip) => (
              <span className="filter-chip-item" key={chip.id}>
                {chip.label}
                <button type="button" aria-label="Remove filter" onClick={() => onClearChip(chip.id)}>
                  <i className="ti ti-x" />
                </button>
              </span>
            ))}
            {chips.length > 0 ? (
              <Link to="#" className="filter-chip-clear fs-12" onClick={onClearChips}>
                Clear all
              </Link>
            ) : null}
          </div>
        </div>
        <div className="card-footer d-flex align-items-center justify-content-between flex-wrap gap-2">
          <p className="mb-0 fs-13 text-muted d-inline-flex align-items-center">
            <i className="ti ti-info-circle me-1" />
            {strings.lockNote}
          </p>
          <span className="badge badge-soft-success d-inline-flex align-items-center">
            <i className="ti ti-circle-filled fs-5 me-1" />
            {strings.issueWindow}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdmitCardToolbar;
