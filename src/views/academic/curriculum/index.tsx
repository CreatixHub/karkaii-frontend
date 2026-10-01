import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import CurriculumCardItem from './components/CurriculumCardItem';
import CurriculumDetailPanel from './components/CurriculumDetailPanel';
import CurriculumSidebar from './components/CurriculumSidebar';
import CurriculumModals from './modals/CurriculumModals';
import type {
  CardMenuItem,
  CurriculumCard,
  CurriculumCategory,
  CurriculumModalId,
  FilterChip,
  FilterKey,
  LayoutView,
} from './data/curriculum.data';
import {
  actionToasts,
  advancedFilters,
  curriculumCards,
  initialChips,
} from './data/curriculum.data';

const routes = all_routes;

/** `curriculum.js` L197: 650 ms on load, 900 ms on refresh. */
const REVEAL_MS = 650;
const REFRESH_MS = 900;

const Curriculum = () => {
  /* ---------------------------------- State --------------------------------- */
  const [cards, setCards] = useState<CurriculumCard[]>(curriculumCards);
  const [selectedId, setSelectedId] = useState('cur_0');
  const [category, setCategory] = useState<'all' | CurriculumCategory>('all');
  const [activeNavItem, setActiveNavItem] = useState('2024 / 2025');
  const [layout, setLayout] = useState<LayoutView>('grid');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Partial<Record<FilterKey, string>>>({});
  const [chips, setChips] = useState<FilterChip[]>(initialChips);
  const [filterOpen, setFilterOpen] = useState(false);
  const [cardMenuOpen, setCardMenuOpen] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  const [activeModal, setActiveModal] = useState<CurriculumModalId | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filterRef = useRef<HTMLDivElement>(null);
  const explorerRef = useRef<HTMLDivElement>(null);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting, revealed } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  useEffect(() => {
    if (!filterOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!filterRef.current?.contains(event.target as Node)) setFilterOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [filterOpen]);

  useEffect(() => {
    if (!fullscreen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFullscreen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  useEffect(() => {
    if (!cardMenuOpen) return;
    const handlePointerDown = () => setCardMenuOpen(null);
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [cardMenuOpen]);

  /* -------------------------------- Filtering ------------------------------- */

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return cards.filter((card) => {
      if (category !== 'all' && card.category !== category) return false;
      if (term && !`${card.name} ${card.meta}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [cards, category, search]);

  const selected = cards.find((card) => card.id === selectedId) ?? null;

  /* --------------------------------- Handlers ------------------------------- */

  const runAction = (id: string, fallback?: string) => push(actionToasts[id] ?? fallback ?? 'Action completed');

  const selectCard = (id: string) => {
    setSelectedId(id);
    setPanelOpen(true);
  };

  /** The rail's jump entries select the card *and* scroll it into view (L109–113). */
  const jumpToCard = (id: string) => {
    selectCard(id);
    const node = explorerRef.current?.querySelector(`[data-cur-target="${id}"]`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const toggleFavorite = (id: string) =>
    setCards((current) =>
      current.map((card) => (card.id === id ? { ...card, favorite: !card.favorite } : card)),
    );

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const openModal = (modal: CurriculumModalId) => setActiveModal(modal);
  const closeModal = () => setActiveModal(null);

  const handleCardAction = (item: CardMenuItem, card: CurriculumCard) => {
    setSelectedId(card.id);
    if (item.modal) {
      openModal(item.modal);
      return;
    }
    if (item.id === 'print') {
      window.print();
      return;
    }
    if (item.id === 'archive') {
      setCards((current) =>
        current.map((entry) =>
          entry.id === card.id
            ? { ...entry, status: 'Draft', statusBadge: 'badge-soft-secondary' }
            : entry,
        ),
      );
      runAction('archive');
      return;
    }
    if (item.id === 'publish') {
      setCards((current) =>
        current.map((entry) =>
          entry.id === card.id
            ? { ...entry, status: 'Published', statusBadge: 'badge-soft-success' }
            : entry,
        ),
      );
      runAction('publish');
      return;
    }
    runAction(item.id, `${item.label} — ${card.name}`);
  };

  const handleAdd = (name: string) => {
    const template = cards[0];
    setCards((current) => [
      {
        ...template,
        id: `cur_${current.length}`,
        name,
        status: 'Draft',
        statusBadge: 'badge-soft-secondary',
        percent: 0,
        barClass: 'bg-secondary',
        units: 0,
        lessons: 0,
        topics: 0,
        updated: 'Updated just now',
        favorite: false,
      },
      ...current,
    ]);
    push(`${name} created`);
  };

  const handleSave = (id: string, name: string, status: string) => {
    const badge =
      status === 'Published'
        ? 'badge-soft-success'
        : status === 'In Review'
          ? 'badge-soft-warning'
          : 'badge-soft-secondary';
    setCards((current) =>
      current.map((card) =>
        card.id === id
          ? { ...card, name: name || card.name, status: status as CurriculumCard['status'], statusBadge: badge }
          : card,
      ),
    );
    push('Curriculum updated');
  };

  const confirmDelete = () => {
    setCards((current) => current.filter((card) => card.id !== selectedId));
    push('Curriculum deleted');
    closeModal();
    setPanelOpen(false);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content curriculum-page">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Curriculum Management</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Curriculum
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => openModal('import')}
                >
                  <i className="ti ti-file-import me-2" />
                  Import
                </Link>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-2" />
                  New Curriculum
                </Link>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          <div
            className={`card mb-0 data-workspace classes-workspace is-loaded${
              fullscreen ? ' card-fullscreen' : ''
            }`}
            id="cur_card"
          >
            {/* Sticky Management Toolbar */}
            <div className="card-header border-bottom" ref={filterRef}>
              <div className="page-toolbar">
                <div className="search-toolbar">
                  <i className="ti ti-search search-toolbar-icon" />
                  <input
                    type="text"
                    id="curSearch"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search curriculum, subject or code…"
                    aria-label="Search curriculum"
                  />
                  {search ? (
                    <button
                      type="button"
                      className="search-clear"
                      aria-label="Clear search"
                      onClick={() => setSearch('')}
                    >
                      <i className="ti ti-x" />
                    </button>
                  ) : null}
                </div>

                <div className="dropdown">
                  <button
                    type="button"
                    className="workspace-button dropdown-toggle"
                    aria-expanded={filterOpen}
                    onClick={() => setFilterOpen((open) => !open)}
                  >
                    <i className="ti ti-adjustments-horizontal" />
                    Filters
                  </button>
                  <div className={`dropdown-menu p-3 filter-menu${filterOpen ? ' show' : ''}`}>
                    <div className="row g-3">
                      {advancedFilters.map((field) => (
                        <div className="col-6" key={field.key}>
                          <label className="form-label mb-1" htmlFor={field.domId}>
                            {field.label}
                          </label>
                          <select
                            className="form-select"
                            id={field.domId}
                            value={filters[field.key] ?? field.options[0]}
                            onChange={(event) =>
                              setFilters((current) => ({ ...current, [field.key]: event.target.value }))
                            }
                          >
                            {field.options.map((option) => (
                              <option key={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex align-items-center justify-content-end gap-2 mt-3 pt-3 border-top">
                      <button
                        type="button"
                        className="btn btn-light btn-sm"
                        onClick={() => {
                          setFilters({});
                          setChips([]);
                          push(actionToasts.clear_filters);
                        }}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setFilterOpen(false);
                          runAction('apply_filters');
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>

                <div className="view-switcher ms-2" role="group" aria-label="Layout view">
                  <Link
                    to="#"
                    className={layout === 'grid' ? 'active' : undefined}
                    title="Grid view"
                    aria-label="Grid view"
                    onClick={() => setLayout('grid')}
                  >
                    <i className="ti ti-layout-grid" />
                  </Link>
                  <Link
                    to="#"
                    className={layout === 'list' ? 'active' : undefined}
                    title="List view"
                    aria-label="List view"
                    onClick={() => setLayout('list')}
                  >
                    <i className="ti ti-list" />
                  </Link>
                </div>

                <span className="flex-grow-1" />

                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={refresh}
                >
                  <i className="ti ti-refresh" />
                </button>
                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
                <button
                  type="button"
                  className="workspace-button workspace-button-icon"
                  title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  aria-label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                  aria-pressed={fullscreen}
                  onClick={() => setFullscreen((open) => !open)}
                >
                  <i className={fullscreen ? 'ti ti-arrows-minimize' : 'ti ti-arrows-maximize'} />
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  onClick={() => openModal('add')}
                >
                  <i className="ti ti-square-rounded-plus me-1" />
                  New
                </button>
              </div>

              <div className="quick-filters">
                <span className="text-muted fs-12 fw-semibold me-1">
                  <i className="ti ti-filter me-1" />
                  Filters:
                </span>
                {chips.map((chip) => (
                  <span className={`badge ${chip.badgeClass} d-inline-flex align-items-center`} key={chip.id}>
                    {chip.label}{' '}
                    <Link
                      to="#"
                      className={`ms-1 ${chip.linkClass}`}
                      aria-label="Remove"
                      onClick={() => setChips((current) => current.filter((item) => item.id !== chip.id))}
                    >
                      <i className="ti ti-x" />
                    </Link>
                  </span>
                ))}
                {chips.length ? (
                  <Link to="#" className="btn btn-link btn-sm text-primary" onClick={() => setChips([])}>
                    Clear all
                  </Link>
                ) : null}
              </div>
            </div>
            {/* /Sticky Management Toolbar */}

            <div className="card-body">
              {loading ? (
                <div className="skeleton-loader" aria-hidden="true">
                  <div className="skeleton-body row g-3">
                    {Array.from({ length: 6 }, (_, index) => (
                      <div className="col-xxl-4 col-md-6" key={index}>
                        <div className="skeleton-stack">
                          <div className="skeleton skeleton-line" />
                          <div className="skeleton skeleton-line skeleton-thin" />
                          <div className="skeleton skeleton-pill" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="row g-3">
                  <CurriculumSidebar
                    category={category}
                    onCategory={setCategory}
                    activeNavItem={activeNavItem}
                    onNavItem={setActiveNavItem}
                    onJump={jumpToCard}
                  />

                  {/* CENTER : Curriculum Explorer */}
                  <div className="col-xxl-9 col-lg-9">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <h6 className="mb-0">
                        Curriculum Explorer{' '}
                        <span className="badge badge-soft-primary ms-1" id="cur_count">
                          {visible.length}
                        </span>
                      </h6>
                      <div className="d-flex align-items-center gap-2">
                        <span className="fs-12 text-muted d-none d-sm-inline">Academic Year 2024 / 2025</span>
                      </div>
                    </div>

                    <div
                      className={`row g-3 curriculum-explorer${layout === 'list' ? ' is-list' : ''}`}
                      id="cur_explorer"
                      role="tablist"
                      aria-label="Curriculum modules"
                      ref={explorerRef}
                    >
                      {visible.map((card) => (
                        <div
                          className="col-xxl-4 col-md-6 col-cur"
                          key={card.id}
                          data-cur-target={card.id}
                        >
                          <CurriculumCardItem
                            card={card}
                            active={card.id === selectedId}
                            revealed={revealed}
                            menuOpen={cardMenuOpen === card.id}
                            onOpenMenu={setCardMenuOpen}
                            onSelect={selectCard}
                            onToggleFavorite={toggleFavorite}
                            onMenuAction={handleCardAction}
                          />
                        </div>
                      ))}
                    </div>

                    {visible.length === 0 ? (
                      <div id="cur_empty" className="curriculum-empty text-center">
                        <span className="curriculum-empty-icon bg-primary-transparent text-primary mb-3">
                          <i className="ti ti-books fs-1" />
                        </span>
                        <h5 className="mb-1">No Curriculum Available</h5>
                        <p className="text-muted mb-3">
                          No curriculum matches the selected filters. Try clearing filters or create a new
                          curriculum to get started.
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary d-inline-flex align-items-center"
                          onClick={() => openModal('add')}
                        >
                          <i className="ti ti-square-rounded-plus me-1" />
                          Create Curriculum
                        </button>
                      </div>
                    ) : null}
                  </div>
                  {/* /CENTER */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <CurriculumDetailPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        card={selected}
        revealed={revealed}
        onAction={handleCardAction}
      />

      <CurriculumModals
        active={activeModal}
        card={selected}
        onClose={closeModal}
        onToast={push}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="curToasts" />
    </>
  );
};

export default Curriculum;
