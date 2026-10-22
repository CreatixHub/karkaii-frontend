import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import RankingCard from './components/RankingCard';
import RankingSkeleton from './components/RankingSkeleton';
import RankingStatCards from './components/RankingStatCards';
import RankingModals from './modals/RankingModals';
import type { RankingDraft } from './modals/RankingModals';
import type {
  RankingModalId,
  RankingRecord,
  RankingSortKey,
  RankingTone,
} from './data/rankingSystem.data';
import {
  actionToasts,
  rankingRecords,
  sortOptions,
  statusFilterOptions,
  summaryCards,
} from './data/rankingSystem.data';

const routes = all_routes;

const REVEAL_MS = 650;

/** The avatar tones the template cycles through, reused when a new card is added. */
const TONE_CYCLE: RankingTone[] = ['primary', 'success', 'info', 'warning', 'danger', 'secondary'];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "12 May 2026" — the format the template prints on every card. */
const formatUpdated = (date: Date) =>
  `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;

const RankingSystem = () => {
  /* ---------------------------------- State --------------------------------- */
  const [records, setRecords] = useState<RankingRecord[]>(rankingRecords);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<(typeof statusFilterOptions)[number]>('All Status');
  const [sort, setSort] = useState<RankingSortKey>('recent');

  const [activeModal, setActiveModal] = useState<RankingModalId | null>(null);
  const [modalRecord, setModalRecord] = useState<RankingRecord | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  /* ------------------------------ Derived views ----------------------------- */

  // The strip summarises the whole dataset, not the current filter — "Total Records"
  // reading the visible count would make it a duplicate of the grid.
  const summary = useMemo(() => summaryCards(records), [records]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = records.filter((record) => {
      if (status !== 'All Status' && record.status !== status) return false;
      if (!term) return true;
      const haystack = `${record.name} ${record.reference} ${record.description} ${record.status}`;
      return haystack.toLowerCase().includes(term);
    });

    const ordered = [...filtered];
    switch (sort) {
      case 'oldest':
        ordered.sort((a, b) => a.updatedAt.localeCompare(b.updatedAt));
        break;
      case 'name':
        ordered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'members-desc':
        ordered.sort((a, b) => b.members - a.members);
        break;
      case 'members-asc':
        ordered.sort((a, b) => a.members - b.members);
        break;
      case 'recent':
        ordered.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
        break;
    }
    return ordered;
  }, [records, search, sort, status]);

  const filtersApplied = search.trim() !== '' || status !== 'All Status';

  /* --------------------------------- Handlers ------------------------------- */

  const openModal = (modal: RankingModalId, record: RankingRecord | null = null) => {
    setModalRecord(record);
    setActiveModal(modal);
  };
  const closeModal = () => setActiveModal(null);

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRecords(rankingRecords);
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REVEAL_MS);
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('All Status');
    setSort('recent');
    push(actionToasts.clear_filters);
  };

  const handleAdd = (draft: RankingDraft) => {
    const now = new Date();
    setRecords((current) => {
      // Counting the cards would reuse a reference after a delete, so take the highest.
      const nextNumber =
        current.reduce(
          (max, record) => Math.max(max, Number(record.reference.replace('PRE', '')) || 0),
          74819,
        ) + 1;
      const reference = `PRE${nextNumber}`;
      return [
        {
          id: `rank_${nextNumber}`,
          name: draft.name,
          reference,
          description: draft.description.trim() || `Reference ${reference}`,
          status: draft.status,
          icon: 'ti ti-award',
          tone: TONE_CYCLE[current.length % TONE_CYCLE.length],
          members: 0,
          updated: formatUpdated(now),
          updatedAt: now.toISOString().slice(0, 10),
        },
        ...current,
      ];
    });
    push(actionToasts.add);
  };

  const handleSave = (id: string, draft: RankingDraft) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              name: draft.name,
              status: draft.status,
              description: draft.description.trim() || record.description,
            }
          : record,
      ),
    );
    push(actionToasts.save);
  };

  const confirmDelete = () => {
    const target = modalRecord;
    if (target) {
      setRecords((current) => current.filter((record) => record.id !== target.id));
      push(actionToasts.delete);
    }
    closeModal();
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Ranking System</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Ranking System
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="me-2 mb-2">
                <div className="input-icon-start position-relative">
                  <span className="icon-addon">
                    <i className="ti ti-search" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="rs-search"
                    placeholder="Search ranking systems"
                    aria-label="Search ranking systems"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>
              <div className="me-2 mb-2">
                <select
                  className="form-select"
                  id="rs-status-filter"
                  aria-label="Filter by status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as (typeof statusFilterOptions)[number])
                  }
                >
                  {statusFilterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="me-2 mb-2">
                <select
                  className="form-select"
                  id="rs-sort"
                  aria-label="Sort ranking systems"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as RankingSortKey)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={refresh}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <button
                type="button"
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => openModal('add')}
              >
                <i className="ti ti-square-rounded-plus me-1" />
                Add Ranking System
              </button>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? (
            <RankingSkeleton />
          ) : (
            <>
              <RankingStatCards cards={summary} />

              <div className="row">
                {visible.map((record) => (
                  <div className="col-xl-4 col-md-6 d-flex" key={record.id}>
                    <RankingCard
                      record={record}
                      onEdit={(target) => openModal('edit', target)}
                      onDelete={(target) => openModal('delete', target)}
                    />
                  </div>
                ))}
              </div>

              {visible.length === 0 ? (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <span className="avatar avatar-xl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3 d-inline-flex align-items-center justify-content-center">
                      <i className="ti ti-award-off fs-24" />
                    </span>
                    <h5 className="mb-1">No Ranking Systems Found</h5>
                    <p className="text-muted mb-3">
                      No ranking system matches the selected filters. Try clearing them or add a new
                      ranking system to get started.
                    </p>
                    <div className="d-inline-flex align-items-center gap-2">
                      {filtersApplied ? (
                        <button type="button" className="btn btn-light" onClick={clearFilters}>
                          <i className="ti ti-filter-off me-1" />
                          Clear Filters
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-primary d-inline-flex align-items-center"
                        onClick={() => openModal('add')}
                      >
                        <i className="ti ti-square-rounded-plus me-1" />
                        Add Ranking System
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      {/* /Page Wrapper */}

      <RankingModals
        active={activeModal}
        record={modalRecord}
        onClose={closeModal}
        onAdd={handleAdd}
        onSave={handleSave}
        onConfirmDelete={confirmDelete}
      />

      <ToastStack toasts={toasts} onDismiss={dismiss} id="rankingToasts" />
    </>
  );
};

export default RankingSystem;
