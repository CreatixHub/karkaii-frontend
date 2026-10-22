import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ReportTabs from './student-day-wise/components/ReportTabs';
import type { DayWiseFilters, DayWiseSortKey } from './student-day-wise/data/studentDayWise.data';
import {
  academicYears,
  attendanceDates,
  classOptions,
  EMPTY_FILTERS,
  reportTabs,
  sectionOptions,
  sortOptions,
  statCards,
  students,
} from './student-day-wise/data/studentDayWise.data';

const routes = all_routes;

type OpenMenu = 'export' | 'year' | 'filter' | 'sort' | null;

const StudentDayWise = () => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [academicYear, setAcademicYear] = useState(academicYears[0]);
  const [sort, setSort] = useState<DayWiseSortKey>('asc');
  /** The Filter panel's draft values, committed on Apply. */
  const [draft, setDraft] = useState<DayWiseFilters>(EMPTY_FILTERS);
  const [filters, setFilters] = useState<DayWiseFilters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(false);

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

  /** The template's Sort menu listed four orders but reordered nothing. */
  const rows = useMemo(() => {
    const list = [...students];
    switch (sort) {
      case 'desc':
        return list.sort((a, b) => b.name.localeCompare(a.name));
      // The roster carries no timestamps, but its admission numbers run in
      // intake order, so they stand in for "recently viewed" and "recently added".
      case 'viewed':
        return list.sort((a, b) => a.admissionNo.localeCompare(b.admissionNo));
      case 'added':
        return list.sort((a, b) => b.admissionNo.localeCompare(a.admissionNo));
      case 'asc':
      default:
        return list.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [sort]);

  const refresh = useCallback(() => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      push('Student day wise report refreshed');
    }, 600);
  }, [push]);

  const applyFilter = useCallback(() => {
    setFilters(draft);
    setOpenMenu(null);
    push('Filter applied');
  }, [draft, push]);

  const resetFilter = useCallback(() => {
    setDraft(EMPTY_FILTERS);
    setFilters(EMPTY_FILTERS);
    push('Filter reset');
  }, [push]);

  /** The template labelled the report but never showed the chosen filters. */
  const filterLabel = [
    filters.className === EMPTY_FILTERS.className ? null : `Class ${filters.className}`,
    filters.section === EMPTY_FILTERS.section ? null : `Section ${filters.section}`,
    filters.date === EMPTY_FILTERS.date ? null : filters.date,
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
              <h3 className="page-title mb-1">Student Day Wise Report</h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="#">Report</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Student Day Wise Report
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
                <div className={`stats-card stats-card-students ${card.variant}`}>
                  <div className="stats-head">
                    <span className="stats-avatar stats-icon">
                      <i className={card.icon} />
                    </span>
                    <div>
                      <h3 className="stats-value mb-0">{card.value}</h3>
                      <p className="stats-label">{card.label}</p>
                    </div>
                  </div>
                  <div className="stats-footer">
                    <span className="stats-subtitle">
                      <i className="ti ti-point" />
                      {card.subtitle}
                    </span>
                    <span className="stats-badge">{card.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* /Stats Cards */}

          {/* Filter Section */}
          <ReportTabs tabs={reportTabs} current={routes.studentDayWise} />
          {/* /Filter Section */}

          {/* Attendance List */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
              <h4 className="mb-3">Student Day Wise Report</h4>
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
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="class">
                                Class
                              </label>
                              <select
                                className="select"
                                id="class"
                                value={draft.className}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, className: event.target.value }))
                                }
                              >
                                {classOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label className="form-label" htmlFor="section">
                                Section
                              </label>
                              <select
                                className="select"
                                id="section"
                                value={draft.section}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, section: event.target.value }))
                                }
                              >
                                {sectionOptions.map((option) => (
                                  <option key={option}>{option}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <div className="mb-0">
                              <label className="form-label" htmlFor="attendance-date">
                                Attendance Date
                              </label>
                              <select
                                className="select"
                                id="attendance-date"
                                value={draft.date}
                                onChange={(event) =>
                                  setDraft((current) => ({ ...current, date: event.target.value }))
                                }
                              >
                                {attendanceDates.map((option) => (
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
              <div className="custom-datatable-filter table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th>S.No</th>
                      <th>Admission No</th>
                      <th>Roll No</th>
                      <th>Name</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading
                      ? Array.from({ length: 5 }, (_, index) => (
                          <tr key={`skeleton-${index}`}>
                            <td colSpan={5}>
                              <span className="skeleton skeleton-line" />
                            </td>
                          </tr>
                        ))
                      : rows.map((student, index) => (
                          <tr key={student.id}>
                            <td>{index + 1}</td>
                            <td>
                              <Link to="#" className="link-primary">
                                {student.admissionNo}
                              </Link>
                            </td>
                            <td>{student.rollNo}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Link to="#" className="avatar avatar-md">
                                  <ImageWithBasePath
                                    src={student.avatar}
                                    className="img-fluid rounded-circle flex-shrink-0"
                                    alt="img"
                                  />
                                </Link>
                                <div className="ms-2">
                                  <p className="text-dark mb-0">
                                    <Link to="#">{student.name}</Link>
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`${student.attendance.className} d-inline-flex align-items-center`}>
                                <i className="ti ti-circle-filled fs-5 me-1" />
                                {student.attendance.label}
                              </span>
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
              {/* /Student List */}

              {/* The filter selection the Filter panel commits — inert in the template. */}
              {!loading && filterLabel ? (
                <p className="text-muted fs-12 mb-0 px-3 pt-3">
                  <i className="ti ti-calendar-event me-1" />
                  Showing attendance for {filterLabel}.
                </p>
              ) : null}
            </div>
          </div>
          {/* /Attendance List */}
        </div>
      </div>
      {/* /Page Wrapper */}

      <ToastStack toasts={toasts} onDismiss={dismiss} id="sdwToast" />
    </>
  );
};

export default StudentDayWise;
