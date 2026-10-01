import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import AttendanceGrid from './teacher-report/components/AttendanceGrid';
import ReportTabs from './teacher-report/components/ReportTabs';
import type { ReportSortKey } from './teacher-report/data/teacherReport.data';
import {
  academicYears,
  attendanceLegend,
  dateOptions,
  dayColumns,
  monthOptions,
  nameOptions,
  reportTabs,
  sortOptions,
  statCards,
  teachers,
} from './teacher-report/data/teacherReport.data';

const routes = all_routes;

type OpenMenu = 'export' | 'year' | 'filter' | 'sort' | null;

interface ReportFilters {
  name: string;
  month: string;
  date: string;
}

const EMPTY_FILTERS: ReportFilters = {
  name: nameOptions[0],
  month: monthOptions[0],
  date: dateOptions[0],
};

const PAGE_SIZE = 10;

const TeacherReport = () => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [academicYear, setAcademicYear] = useState(academicYears[0]);
  const [sort, setSort] = useState<ReportSortKey>('asc');
  /** The Filter panel's draft values, committed on Apply. */
  const [draft, setDraft] = useState<ReportFilters>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<ReportFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const pageRef = useRef<HTMLDivElement>(null);
  const { toasts, push, dismiss } = useToasts();

  // Outside click / Escape closes whichever menu is open, as Bootstrap does.
  useEffect(() => {
    if (!openMenu) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!pageRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const filtered = useMemo(() => {
    const list = teachers.filter(
      (teacher) => filters.name === nameOptions[0] || teacher.name === filters.name,
    );

    return [...list].sort((a, b) => {
      switch (sort) {
        case 'desc':
          return b.name.localeCompare(a.name);
        // The roster carries no timestamps, so the attendance percentage stands
        // in for "recently viewed" and "recently added".
        case 'viewed':
          return b.percent.value - a.percent.value;
        case 'added':
          return a.percent.value - b.percent.value;
        case 'asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filters.name, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const refresh = useCallback(() => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      push("Teacher's report refreshed");
    }, 600);
  }, [push]);

  const applyFilter = useCallback(() => {
    setFilters(draft);
    setPage(1);
    setOpenMenu(null);
    push('Filter applied');
  }, [draft, push]);

  const resetFilter = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    setPage(1);
    push('Filter reset');
  }, [push]);

  /** The template labelled the report but never showed the chosen period. */
  const periodLabel = [
    filters.month === monthOptions[0] ? null : filters.month,
    filters.date === dateOptions[0] ? null : filters.date,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper" ref={pageRef}>
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1">Teacher&apos;s Report</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Teacher&apos;s Report
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className="pe-1 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  title="Refresh"
                  aria-label="Refresh"
                  onClick={refresh}
                >
                  <i className="ti ti-refresh" />
                </button>
              </div>
              <div className="pe-1 mb-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-icon me-1"
                  title="Print"
                  aria-label="Print"
                  onClick={() => window.print()}
                >
                  <i className="ti ti-printer" />
                </button>
              </div>
              <div className="dropdown me-2 mb-2">
                <button
                  type="button"
                  className="dropdown-toggle btn btn-light fw-medium d-inline-flex align-items-center"
                  aria-expanded={openMenu === 'export'}
                  onClick={() => setOpenMenu(openMenu === 'export' ? null : 'export')}
                >
                  <i className="ti ti-file-export me-2" />
                  Export
                </button>
                <ul className={`dropdown-menu  dropdown-menu-end p-3${openMenu === 'export' ? ' show' : ''}`}>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setOpenMenu(null);
                        push('Export as PDF started');
                      }}
                    >
                      <i className="ti ti-file-type-pdf me-1" />
                      Export as PDF
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="dropdown-item rounded-1"
                      onClick={() => {
                        setOpenMenu(null);
                        push('Export as Excel started');
                      }}
                    >
                      <i className="ti ti-file-type-xls me-1" />
                      Export as Excel{' '}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* /Page Header */}

          {/* Stats Cards */}
          <div className="row g-3 mb-3">
            {statCards.map((card) => (
              <div className="col-xl-3 col-sm-6 d-flex" key={card.id}>
                <div className={`stats-card stats-card-teachers ${card.variant}`}>
                  <div className="stats-avatars">
                    {card.avatars.map((initial) => (
                      <span key={initial}>{initial}</span>
                    ))}
                    <span className="stats-icon">
                      <i className={card.icon} />
                    </span>
                  </div>
                  <h3 className="stats-value mb-0">{card.value}</h3>
                  <p className="stats-label">{card.label}</p>
                  <div className="stats-bar">
                    <i style={{ width: card.barWidth }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}

          {/* Filter Section */}
          <ReportTabs tabs={reportTabs} current={routes.teacherReport} />
          {/* /Filter Section */}

          <div className="attendance-types page-header justify-content-end">
            <ul className="attendance-type-list">
              {attendanceLegend.map((item) => (
                <li key={item.label}>
                  <span className={`attendance-icon ${item.tone}`}>
                    <i className={item.icon} />
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Attendance List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Teacher Day Wise Report</h4>
              <div className="d-flex align-items-center flex-wrap">
                {/* The template's `bookingrange` plugin input, now a real picker. */}
                <div className="input-icon-start mb-3 me-2 position-relative dropdown">
                  <span className="icon-addon">
                    <i className="ti ti-calendar" />
                  </span>
                  <input
                    type="text"
                    className="form-control date-range bookingrange"
                    placeholder="Select"
                    value={academicYear}
                    aria-label="Select"
                    readOnly
                    onClick={() => setOpenMenu(openMenu === 'year' ? null : 'year')}
                  />
                  <ul className={`dropdown-menu p-2${openMenu === 'year' ? ' show' : ''}`}>
                    {academicYears.map((year) => (
                      <li key={year}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${academicYear === year ? ' active' : ''}`}
                          onClick={() => {
                            setAcademicYear(year);
                            setOpenMenu(null);
                          }}
                        >
                          {year}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dropdown mb-3 me-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    aria-expanded={openMenu === 'filter'}
                    onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
                  >
                    <i className="ti ti-filter me-2" />
                    Filter
                  </button>
                  <div className={`dropdown-menu drop-width${openMenu === 'filter' ? ' show' : ''}`}>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        applyFilter();
                      }}
                    >
                      <div className="d-flex align-items-center border-bottom p-3">
                        <h4>Filter</h4>
                      </div>
                      <div className="p-3 border-bottom">
                        <div className="row">
                          <div className="col-md-12">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="name">
                                Name
                              </label>
                              <select
                                className="select"
                                id="name"
                                value={draft.name}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, name: event.target.value }))
                                }
                              >
                                {nameOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="month">
                                Month
                              </label>
                              <select
                                className="select"
                                id="month"
                                value={draft.month}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, month: event.target.value }))
                                }
                              >
                                {monthOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-0">
                              <label className="form-label" htmlFor="date">
                                Date
                              </label>
                              <select
                                className="select"
                                id="date"
                                value={draft.date}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, date: event.target.value }))
                                }
                              >
                                {dateOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 d-flex align-items-center justify-content-end">
                        <button type="button" className="btn btn-light me-3" onClick={resetFilter}>
                          Reset
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Apply
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="dropdown mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white dropdown-toggle"
                    aria-expanded={openMenu === 'sort'}
                    onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
                  >
                    <i className="ti ti-sort-ascending-2 me-2" />
                    Sort by A-Z{' '}
                  </button>
                  <ul className={`dropdown-menu p-3${openMenu === 'sort' ? ' show' : ''}`}>
                    {sortOptions.map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          className={`dropdown-item rounded-1${sort === option.id ? ' active' : ''}`}
                          onClick={() => {
                            setSort(option.id);
                            setOpenMenu(null);
                          }}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0 py-3">
              {/* Student List */}
              <AttendanceGrid rows={rows} dayColumns={dayColumns} loading={loading} />
              {/* /Student List */}

              {periodLabel ? (
                <p className="text-muted fs-12 mb-0 px-3 pt-3">
                  <i className="ti ti-calendar-event me-1" />
                  Reporting period: {periodLabel}.
                </p>
              ) : null}
            </div>
          </div>
          {/* /Attendance List */}

          <div className="row align-items-center">
            <div className="col-md-12">
              {/* The template left this slot empty for DataTables to fill. */}
              <div className="datatable-paginate mt-4">
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <p className="mb-0 text-muted">
                    Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to{' '}
                    {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} teachers
                  </p>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => setPage((value) => Math.max(1, value - 1))}
                        >
                          Previous
                        </button>
                      </li>
                      {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
                        <li className={`page-item${currentPage === number ? ' active' : ''}`} key={number}>
                          <button type="button" className="page-link" onClick={() => setPage(number)}>
                            {number}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item${currentPage === pageCount ? ' disabled' : ''}`}>
                        <button
                          type="button"
                          className="page-link"
                          onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="trpToast" />
    </>
  );
};

export default TeacherReport;
