import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useReveal } from '@hooks/useReveal';
import { useToasts } from '@hooks/useToasts';
import PerformanceFilters from './components/PerformanceFilters';
import PerformanceSkeleton from './components/PerformanceSkeleton';
import PerformanceStats from './components/PerformanceStats';
import PerformanceTable from './components/PerformanceTable';
import type { AcademicYear, DateRange, PerformanceRow, SortKey } from './data/subjectPerformance.data';
import {
  ALL_CLASSES,
  academicYears,
  actionToasts,
  compareRows,
  exportActions,
  parseDateRange,
  performanceColumns,
  performanceRows,
  strings,
  summarise,
  withinRange,
} from './data/subjectPerformance.data';

const routes = all_routes;

/** Brief for this page: 650 ms, shorter than the 850 ms the workspace tables use. */
const REVEAL_MS = 650;
const REFRESH_MS = 700;

/** What the filter card has actually committed, as opposed to what is typed into it. */
interface AppliedFilters {
  year: AcademicYear;
  klass: string;
  range: DateRange | null;
}

const DEFAULT_FILTERS: AppliedFilters = { year: academicYears[0], klass: ALL_CLASSES, range: null };

const matchesFilters = (row: PerformanceRow, applied: AppliedFilters): boolean => {
  if (row.academicYear !== applied.year) return false;
  if (applied.klass !== ALL_CLASSES && row.className !== applied.klass) return false;
  if (applied.range && !withinRange(row, applied.range)) return false;
  return true;
};

const SubjectPerformance = () => {
  /* ---------------------------------- State --------------------------------- */

  // The filter card edits a draft; only "Apply Filter" moves it into `applied`.
  const [draftYear, setDraftYear] = useState<AcademicYear>(DEFAULT_FILTERS.year);
  const [draftClass, setDraftClass] = useState(DEFAULT_FILTERS.klass);
  const [draftRange, setDraftRange] = useState('');
  const [applied, setApplied] = useState<AppliedFilters>(DEFAULT_FILTERS);

  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [ascending, setAscending] = useState(true);

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

  /* ------------------------------ Rows in view ------------------------------ */

  const rows = useMemo(() => {
    const matches = performanceRows.filter((row) => matchesFilters(row, applied));

    // No sort key means the order the template shipped its rows in.
    if (!sortKey) return matches;

    return [...matches].sort((a, b) => {
      const delta = compareRows(a, b, sortKey);
      return ascending ? delta : -delta;
    });
  }, [applied, sortKey, ascending]);

  const counts = useMemo(() => summarise(rows), [rows]);

  /* -------------------------------- Handlers -------------------------------- */

  const applyFilters = () => {
    const typed = draftRange.trim();
    const range = typed ? parseDateRange(typed) : null;

    // An unreadable range would silently widen the result, so it is refused instead.
    if (typed && !range) {
      push(actionToasts.invalid_range, 'warning');
      return;
    }

    const next: AppliedFilters = { year: draftYear, klass: draftClass, range };
    setApplied(next);

    const shown = performanceRows.filter((row) => matchesFilters(row, next)).length;
    push(strings.applied(shown, performanceRows.length, next.year), 'info');
  };

  const resetFilters = () => {
    setDraftYear(DEFAULT_FILTERS.year);
    setDraftClass(DEFAULT_FILTERS.klass);
    setDraftRange('');
    setApplied(DEFAULT_FILTERS);
    setSortKey(null);
    setAscending(true);
    push(actionToasts.reset);
  };

  const refresh = () => {
    setRefreshing(true);
    window.setTimeout(() => {
      setRefreshing(false);
      push(actionToasts.refresh);
    }, REFRESH_MS);
  };

  const handleSort = (key: SortKey) => {
    // A fresh column starts ascending; the same column again reverses.
    const nextAscending = sortKey === key ? !ascending : true;
    setSortKey(key);
    setAscending(nextAscending);

    const column = performanceColumns.find((entry) => entry.key === key);
    push(strings.sorted(column?.label ?? key, nextAscending), 'info');
  };

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Subject Performance</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Academic</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Subject Performance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
                onClick={refresh}
                disabled={loading}
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

          {loading ? (
            <PerformanceSkeleton />
          ) : (
            <>
              <PerformanceStats counts={counts} />

              <PerformanceFilters
                year={draftYear}
                onYearChange={setDraftYear}
                klass={draftClass}
                onClassChange={setDraftClass}
                range={draftRange}
                onRangeChange={setDraftRange}
                onApply={applyFilters}
              />

              <PerformanceTable
                rows={rows}
                sortKey={sortKey}
                ascending={ascending}
                onSort={handleSort}
                onDownload={() => push(actionToasts.download, 'info')}
                onReset={resetFilters}
              />
            </>
          )}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="subjectPerformanceToasts" />
    </>
  );
};

export default SubjectPerformance;
