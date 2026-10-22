import { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import { all_routes } from '@/routes/all_routes';
import CommonSelect from '@core/common/commonSelect';
import {
  donutOptions,
  donutSeries,
  heatmapOptions,
  heatmapSeries,
  trendOptions,
  trendSeries,
} from './data/attendanceHistory.charts';
import {
  academicYears,
  attendanceRows,
  calendarLegend,
  calendarWeeks,
  classes,
  filterStatuses,
  filterSubjects,
  monthTotals,
  months,
  sections,
  statCards,
  students,
  timelineEntries,
} from './data/attendanceHistory.data';

const routes = all_routes;

const toOptions = (values: string[]) => values.map((value) => ({ value, label: value }));

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const SELECTORS = [
  { id: 'student', label: 'Student', options: students, col: 'col-lg-3 col-md-6' },
  { id: 'academic-year', label: 'Academic Year', options: academicYears, col: 'col-lg-3 col-md-6' },
  { id: 'class', label: 'Class', options: classes, col: 'col-lg-2 col-md-6' },
  { id: 'section', label: 'Section', options: sections, col: 'col-lg-2 col-md-6' },
  { id: 'month', label: 'Month', options: months, col: 'col-lg-2 col-md-6' },
];

const StudentAttendanceHistory = () => {
  const [view, setView] = useState<'table' | 'timeline'>('table');
  const [filterOpen, setFilterOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(true);

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Page Header */}
        <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Attendance History</h3>
            <nav>
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to={routes.adminDashboard}>Dashboard</Link>
                </li>
                <li className="breadcrumb-item">Students</li>
                <li className="breadcrumb-item active" aria-current="page">
                  Attendance History
                </li>
              </ol>
            </nav>
          </div>
          <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
            <div className="pe-1 mb-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-icon me-1"
                aria-label="Refresh"
                title="Refresh"
              >
                <i className="ti ti-refresh" />
              </button>
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white me-2 mb-2"
              onClick={() => window.print()}
            >
              <i className="ti ti-printer me-1" />
              Print
            </button>
            <button type="button" className="btn btn-outline-light bg-white me-2 mb-2">
              <i className="ti ti-file-type-pdf me-1" />
              Export PDF
            </button>
            <button type="button" className="btn btn-primary mb-2">
              <i className="ti ti-file-type-xls me-1" />
              Export Excel
            </button>
          </div>
        </div>
        {/* /Page Header */}

        {/* Student Selector Bar */}
        <div className="card">
          <div className="card-body pb-1">
            <div className="row">
              {SELECTORS.map((selector) => (
                <div className={selector.col} key={selector.id}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor={selector.id}>
                      {selector.label}
                    </label>
                    <CommonSelect
                      inputId={selector.id}
                      className="select"
                      options={toOptions(selector.options)}
                      defaultValue={{ value: selector.options[0], label: selector.options[0] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* /Student Selector Bar */}

        {/* Statistics Cards */}
        <div className="row g-3 mb-1">
          {statCards.map((card) => (
            <div className="col-xxl-2 col-lg-4 col-sm-6 d-flex" key={card.id}>
              <div className={`card stat-card ${card.variant} w-100`}>
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <span className={`stat-icon ${card.iconClass}`}>
                      <i className={card.icon} />
                    </span>
                    {card.badge ? (
                      <span
                        className={`badge ${card.badge.className} d-inline-flex align-items-center fs-11`}
                      >
                        <i className={`${card.badge.icon} me-1`} />
                        {card.badge.label}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="stat-value mt-3 mb-0">{card.value}</h3>
                  <p className={`${card.labelClass} text-muted fs-13`}>{card.label}</p>
                  {card.progress ? (
                    <div className="progress" style={{ height: 5 }}>
                      <div
                        className={`progress-bar ${card.progress.className}`}
                        style={{ width: card.progress.width }}
                      />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* /Statistics Cards */}

        {/* Low attendance alert */}
        {alertOpen ? (
          <div
            className="alert alert-success alert-dismissible fade show d-flex align-items-center"
            role="alert"
          >
            <i className="ti ti-circle-check me-2 fs-16" />
            <span>
              Attendance is <b>above</b> the required 75% threshold for this academic year.
            </span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => setAlertOpen(false)}
            />
          </div>
        ) : null}

        {/* Analytics Row */}
        <div className="row">
          {/* Monthly Calendar */}
          <div className="col-12 col-xl-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex align-items-center justify-content-between">
                <h4 className="mb-0 fs-16 fw-medium">Monthly Calendar</h4>
                <div className="d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-outline-light bg-white me-1"
                    aria-label="Previous month"
                  >
                    <i className="ti ti-chevron-left" />
                  </button>
                  <span className="fw-medium">July 2026</span>
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-outline-light bg-white ms-1"
                    aria-label="Next month"
                  >
                    <i className="ti ti-chevron-right" />
                  </button>
                </div>
              </div>
              <div className="card-body">
                <table className="table table-borderless text-center attendance-calendar mb-3">
                  <thead>
                    <tr>
                      {WEEK_DAYS.map((day) => (
                        <th key={day}>{day}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {calendarWeeks.map((week, weekIndex) => (
                      <tr key={weekIndex}>
                        {week.map((cell, cellIndex) => (
                          <td
                            className={cell.status ? undefined : 'text-muted'}
                            key={`${weekIndex}-${cellIndex}`}
                          >
                            {cell.status ? (
                              <span
                                className={`attendance-calendar-day attendance-${cell.status}`}
                              >
                                {cell.day}
                              </span>
                            ) : (
                              cell.day
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="d-flex align-items-center flex-wrap gap-3">
                  {calendarLegend.map((item) => (
                    <span className="fs-12 d-inline-flex align-items-center" key={item.label}>
                      <i className={`ti ti-circle-filled ${item.className} me-1`} />
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Donut */}
          <div className="col-xl-3 col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h5 className="mb-0">Distribution</h5>
              </div>
              <div className="card-body">
                <div id="att_donut">
                  <ReactApexChart options={donutOptions} series={donutSeries} type="donut" height={240} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats stack */}
          <div className="col-xl-3 col-md-6 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h5 className="mb-0">This Month</h5>
              </div>
              <div className="card-body">
                {monthTotals.map((total, index) => (
                  <div
                    className={`d-flex align-items-center justify-content-between${
                      index < monthTotals.length - 1 ? ' border-bottom pb-2 mb-2' : ''
                    }`}
                    key={total.label}
                  >
                    <span className="fs-13">
                      <i className={`ti ti-circle-filled ${total.className} me-1`} />
                      {total.label}
                    </span>
                    <span className="fw-semibold">{total.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Trend */}
          <div className="col-12 col-xl-8 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h5 className="mb-0">Attendance Trend</h5>
              </div>
              <div className="card-body">
                <div id="att_trend">
                  <ReactApexChart options={trendOptions} series={trendSeries} type="area" height={260} />
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="col-12 col-xl-4 d-flex">
            <div className="card flex-fill">
              <div className="card-header">
                <h5 className="mb-0">Heatmap</h5>
              </div>
              <div className="card-body">
                <div id="att_heatmap">
                  <ReactApexChart
                    options={heatmapOptions}
                    series={heatmapSeries}
                    type="heatmap"
                    height={260}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History Table + Timeline */}
        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap pb-0">
            <h4 className="mb-3">Attendance History</h4>
            <div className="d-flex align-items-center flex-wrap">
              <div className="input-icon-start mb-3 me-2 position-relative">
                <span className="icon-addon">
                  <i className="ti ti-calendar" />
                </span>
                <input
                  type="text"
                  className="form-control date-range bookingrange"
                  placeholder="Select"
                  defaultValue="01 Jul 2026 - 31 Jul 2026"
                  aria-label="Select"
                />
              </div>

              <div className="dropdown mb-3 me-2">
                <button
                  type="button"
                  className="btn btn-outline-light bg-white dropdown-toggle"
                  aria-expanded={filterOpen}
                  onClick={() => setFilterOpen((open) => !open)}
                >
                  <i className="ti ti-filter me-2" />
                  Filter
                </button>
                <div className={`dropdown-menu drop-width${filterOpen ? ' show' : ''}`}>
                  <form onSubmit={(event) => { event.preventDefault(); setFilterOpen(false); }}>
                    <div className="d-flex align-items-center border-bottom p-3">
                      <h4>Filter</h4>
                    </div>
                    <div className="p-3 pb-0 border-bottom">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="subject">
                              Subject
                            </label>
                            <CommonSelect
                              inputId="subject"
                              className="select"
                              options={toOptions(filterSubjects)}
                              defaultValue={{ value: 'All', label: 'All' }}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="status">
                              Status
                            </label>
                            <CommonSelect
                              inputId="status"
                              className="select"
                              options={toOptions(filterStatuses)}
                              defaultValue={{ value: 'All', label: 'All' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 d-flex align-items-center justify-content-end">
                      <button type="button" className="btn btn-light me-3" onClick={() => setFilterOpen(false)}>
                        Reset
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="d-flex align-items-center bg-white border rounded-2 p-1 mb-3">
                <button
                  type="button"
                  id="att_view_table"
                  className={`btn btn-icon btn-sm me-1 primary-hover${view === 'table' ? ' active' : ' bg-light'}`}
                  aria-label="Table view"
                  onClick={() => setView('table')}
                >
                  <i className="ti ti-list-tree" />
                </button>
                <button
                  type="button"
                  id="att_view_timeline"
                  className={`btn btn-icon btn-sm primary-hover${view === 'timeline' ? ' active' : ' bg-light'}`}
                  aria-label="Timeline view"
                  onClick={() => setView('timeline')}
                >
                  <i className="ti ti-timeline" />
                </button>
              </div>
            </div>
          </div>

          <div className="card-body p-0 py-3">
            {/* Table View */}
            <div
              id="att_table"
              className={`custom-datatable-filter table-responsive${view === 'table' ? '' : ' d-none'}`}
            >
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>Date</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Time In</th>
                    <th>Time Out</th>
                    <th>Teacher</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.date}</td>
                      <td>{row.className}</td>
                      <td>{row.section}</td>
                      <td>{row.subject}</td>
                      <td>
                        <span
                          className={`badge ${row.status.className} d-inline-flex align-items-center`}
                        >
                          <i className="ti ti-circle-filled fs-5 me-1" />
                          {row.status.label}
                        </span>
                      </td>
                      <td>{row.timeIn}</td>
                      <td>{row.timeOut}</td>
                      <td>{row.teacher}</td>
                      <td>{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* /Table View */}

            {/* Timeline View */}
            <div id="att_timeline" className={`px-3${view === 'timeline' ? '' : ' d-none'}`}>
              <div className="activity-timeline">
                {timelineEntries.map((entry) => (
                  <div className="d-flex align-items-start" key={entry.id}>
                    <span
                      className={`avatar avatar-sm ${entry.tint} flex-shrink-0 rounded-circle me-2 text-white`}
                    >
                      <i className={entry.icon} />
                    </span>
                    <div className={`${entry.last ? '' : 'pb-3 border-start '}ps-3 ms-2`}>
                      {entry.heading === 'h5' ? (
                        <h5 className="mb-1 fs-15">{entry.title}</h5>
                      ) : (
                        <h6 className="mb-1">{entry.title}</h6>
                      )}
                      <p className="text-muted mb-0 fs-12">{entry.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* /Timeline View */}
          </div>
        </div>
        {/* /History */}
      </div>
    </div>
  );
};

export default StudentAttendanceHistory;
