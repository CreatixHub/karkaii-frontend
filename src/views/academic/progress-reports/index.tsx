import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import ProgressFilters from './components/ProgressFilters';
import ProgressReportsSkeleton from './components/ProgressReportsSkeleton';
import ProgressReportsTable from './components/ProgressReportsTable';
import ProgressStatCards from './components/ProgressStatCards';
import type { ProgressFilterState, SortKey } from './data/progressReports.data';
import {
  actionToasts,
  compareRows,
  countStats,
  defaultFilters,
  exportActions,
  filterRows,
  parseDateRange,
  progressReportRows,
  statCards,
  tableHeaders,
} from './data/progressReports.data';

const routes = all_routes;

/** The reveal delay this page ships with, and the shorter replay after a refresh. */
const REVEAL_MS = 650;
const REFRESH_MS = 550;

const ProgressReports = () => {
  /* ---------------------------------- State --------------------------------- */

  // The strip edits `draft`; "Apply Filter" promotes it to `applied`, which the
  // table and the summary cards read.
  const [draft, setDraft] = useState<ProgressFilterState>(defaultFilters);
  const [applied, setApplied] = useState<ProgressFilterState>(defaultFilters);

  const [sort, setSort] = useState<SortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [exportOpen, setExportOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const exportRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();
  const { loading: booting } = useReveal(REVEAL_MS);
  const loading = booting || refreshing;

  useEffect(() => {
    if (!exportOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!exportRef.current?.contains(event.target as Node)) setExportOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [exportOpen]);

  /* ------------------------------ Rows and stats ---------------------------- */

  const rows = useMemo(() => {
    const matches = filterRows(progressReportRows, applied);

    // No sort key means the order the template ships the rows in.
    if (!sort) return matches;

    return [...matches].sort((a, b) => (sortAsc ? compareRows(a, b, sort) : compareRows(b, a, sort)));
  }, [applied, sort, sortAsc]);

  const stats = useMemo(() => countStats(rows), [rows]);

  /* --------------------------------- Handlers ------------------------------- */

  const changeDraft = (patch: Partial<ProgressFilterState>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const applyFilters = () => {
    // The template's Date Range box had no picker behind it, so free text can be
    // anything; anything unparseable is refused rather than silently ignored.
    if (draft.dateRange.trim() && !parseDateRange(draft.dateRange)) {
      push(actionToasts.invalid_range, 'warning');
      return;
    }

    setApplied(draft);
    const matches = filterRows(progressReportRows, draft).length;
    push(`Showing ${matches} of ${progressReportRows.length} progress reports.`);
  };

  const handleSort = (key: SortKey) => {
    const label = tableHeaders.find((header) => header.key === key)?.label ?? key;

    if (sort === key) {
      const next = !sortAsc;
      setSortAsc(next);
      push(`Sorted by ${label} · ${next ? 'ascending' : 'descending'}`, 'info');
      return;
    }

    setSort(key);
    setSortAsc(true);
    push(`Sorted by ${label} · ascending`, 'info');
  };

  const refresh = () => {
    setRefreshing(true);
    setDraft(defaultFilters);
    setApplied(defaultFilters);
    setSort(null);
    setSortAsc(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Progress Reports</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Progress Reports
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={refresh}
              >
                <i className="ti ti-refresh me-1" />
                Refresh
              </button>
              <div className="dropdown mb-2 me-2" ref={exportRef}>
                <Link
                  to="#"
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  aria-expanded={exportOpen}
                  onClick={() => setExportOpen((open) => !open)}
                >
                  <i className="ti ti-file-export me-1" />
                  Export
                  <i className="ti ti-chevron-down ms-1" />
                </Link>
                <ul className={`dropdown-menu p-2${exportOpen ? ' show' : ''}`}>
                  {exportActions.map((action) => (
                    <li key={action.id}>
                      <Link
                        to="#"
                        className="dropdown-item rounded-1"
                        onClick={() => {
                          setExportOpen(false);
                          push(actionToasts[action.id]);
                        }}
                      >
                        <i className={`${action.icon} me-1`} />
                        {action.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {loading ? <ProgressReportsSkeleton /> : null}

          {!loading ? (
            <>
              <ProgressStatCards cards={statCards} values={stats} />

              <ProgressFilters draft={draft} onChange={changeDraft} onApply={applyFilters} />

              {/* Progress Reports List */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h4 className="mb-0">Progress Reports</h4>
                  <Link
                    to="#"
                    className="btn btn-outline-light bg-white btn-sm"
                    onClick={() => push(actionToasts.download)}
                  >
                    <i className="ti ti-download me-1" />
                    Download
                  </Link>
                </div>
                <div className="card-body p-0">
                  <ProgressReportsTable rows={rows} sort={sort} sortAsc={sortAsc} onSort={handleSort} />
                </div>
              </div>
              {/* /Progress Reports List */}
            </>
          ) : null}
        </div>
      </div>

      <ToastStack toasts={toasts} onDismiss={dismiss} id="progressReportsToasts" />
    </>
  );
};

export default ProgressReports;
