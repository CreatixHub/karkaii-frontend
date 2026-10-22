import type { CSSProperties } from "react";
const UiDashboardCards = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <h3 className="page-title">Dashboard Cards</h3>
              </div>

              {/* start row */}
              <div className="content-section">
                <div className="row">

                  <div className="col-xl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header"><h4 className="card-title fs-16 fw-medium">Statistic Card</h4></div>
                      <div className="card-body">
                        <p><code>.card-stat</code> with a header, value and label. The delta takes <code>.up</code> or <code>.down</code>.</p>
                        <div className="stats-grid stats-grid-compact">
                          <div className="card-stat position-relative overflow-hidden">
                            <div className="card-stat-header d-flex align-items-center"><span className="avatar avatar-icon bg-primary-transparent"><i className="ti ti-book"></i></span><span className="card-stat-delta up ms-auto d-inline-flex align-items-center"><i className="ti ti-arrow-up"></i>1</span></div>
                            <div className="card-stat-value">6</div>
                            <div className="card-stat-label">Today's Classes</div>
                          </div>
                          <div className="card-stat position-relative overflow-hidden">
                            <div className="card-stat-header d-flex align-items-center"><span className="avatar avatar-icon bg-primary-transparent"><i className="ti ti-users"></i></span><span className="card-stat-delta up ms-auto d-inline-flex align-items-center"><i className="ti ti-arrow-up"></i>4%</span></div>
                            <div className="card-stat-value">248</div>
                            <div className="card-stat-label">Students</div>
                          </div>
                          <div className="card-stat position-relative overflow-hidden">
                            <div className="card-stat-header d-flex align-items-center"><span className="avatar avatar-icon bg-primary-transparent"><i className="ti ti-clipboard"></i></span><span className="card-stat-delta down ms-auto d-inline-flex align-items-center"><i className="ti ti-arrow-down"></i>2</span></div>
                            <div className="card-stat-value">12</div>
                            <div className="card-stat-label">Pending Reviews</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header"><h5 className="card-title">Status Badge</h5></div>
                      <div className="card-body">
                        <p>The template badge: <code>.badge</code> plus <code>.badge-soft-success</code>, <code>-warning</code>, <code>-danger</code>, <code>-info</code> or <code>-secondary</code>. Use the solid <code>.badge-danger</code> for a live state.</p>
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge badge-soft-success"><i className="ti ti-check me-1"></i>Present</span>
                          <span className="badge badge-soft-warning"><i className="ti ti-clock me-1"></i>Late</span>
                          <span className="badge badge-soft-danger"><i className="ti ti-x me-1"></i>Absent</span>
                          <span className="badge badge-soft-info"><i className="ti ti-info-circle me-1"></i>Info</span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          <span className="badge badge-soft-danger">Live now</span>
                          <span className="badge badge-soft-warning"><i className="ti ti-hourglass me-1"></i>Starting soon</span>
                          <span className="badge badge-soft-secondary"><i className="ti ti-check me-1"></i>Done</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header"><h5 className="card-title">Lesson Schedule</h5></div>
                      <div className="card-body">
                        <p><code>.lesson-item</code> rows inside a <code>.lesson-list</code>. The tone class colours the rail.</p>
                        <div className="lesson-list d-flex flex-column">
                          <div className="lesson-item border-success align-items-center">
                            <div className="lesson-time text-center"><b>08:00</b><span>45 min</span></div>
                            <div className="lesson-body">
                              <b>Mathematics</b>
                              <div className="lesson-tags d-flex align-items-center flex-wrap">
                                <span className="lesson-tag d-inline-flex align-items-center"><i className="ti ti-users"></i>Grade III-A</span>
                                <span className="lesson-tag d-inline-flex align-items-center"><i className="ti ti-door"></i>Room 204</span>
                              </div>
                            </div>
                            <div className="lesson-actions d-flex align-items-center"><span className="badge badge-soft-secondary"><i className="ti ti-check me-1"></i>Done</span></div>
                          </div>
                          <div className="lesson-item border-danger align-items-center">
                            <div className="lesson-time text-center"><b>10:30</b><span>45 min</span></div>
                            <div className="lesson-body">
                              <b>Physics</b>
                              <div className="lesson-tags d-flex align-items-center flex-wrap">
                                <span className="lesson-tag d-inline-flex align-items-center"><i className="ti ti-users"></i>Grade XI-B</span>
                                <span className="lesson-tag d-inline-flex align-items-center"><i className="ti ti-door"></i>Lab 2</span>
                              </div>
                            </div>
                            <div className="lesson-actions d-flex align-items-center"><span className="badge badge-soft-danger">Live</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header"><h5 className="card-title">Class Card</h5></div>
                      <div className="card-body">
                        <p><code>.card-class</code> with a tone modifier &#8212; header, stats row and actions.</p>
                        <div className="card-class overflow-hidden">
                          <div className="card-class-header bg-primary-transparent d-flex align-items-center">
                            <span className="avatar avatar-icon bg-primary text-white"><i className="ti ti-math-symbols"></i></span>
                            <div><b>Mathematics</b><div className="widget-subtitle">Grade III-A</div></div>
                            <span className="badge badge-soft-primary card-class-badge ms-auto align-self-start">42</span>
                          </div>
                          <div className="card-class-stats">
                            <div className="card-class-stat"><b>94%</b><span>Attendance</span></div>
                            <div className="card-class-stat"><b>88%</b><span>Average</span></div>
                            <div className="card-class-stat"><b>12</b><span>Pending</span></div>
                          </div>
                          <div className="card-class-actions d-flex">
                            <button type="button" className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"><i className="ti ti-eye"></i>View</button>
                            <button type="button" className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"><i className="ti ti-edit"></i>Edit</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header"><h5 className="card-title">Info List &amp; Timeline</h5></div>
                      <div className="card-body">
                        <p><code>.info-list-item</code> for data rows, <code>.timeline-item</code> for chronological entries.</p>
                        <div className="info-list mb-3 d-flex flex-column">
                          <div className="info-list-item d-flex align-items-center">
                            <span className="avatar avatar-icon bg-primary-transparent flex-shrink-0"><i className="ti ti-file-text"></i></span>
                            <div className="info-list-body"><b>Algebra Worksheet</b><div className="widget-subtitle">Grade III-A &#183; due tomorrow</div></div>
                            <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end"><span className="badge badge-soft-warning">28/42</span></div>
                          </div>
                          <div className="info-list-item d-flex align-items-center">
                            <span className="avatar avatar-icon bg-purple-transparent flex-shrink-0"><i className="ti ti-file-text"></i></span>
                            <div className="info-list-body"><b>Physics Lab Report</b><div className="widget-subtitle">Grade XI-B &#183; due Friday</div></div>
                            <div className="info-list-end flex-shrink-0 text-end d-flex flex-column align-items-end"><span className="badge badge-soft-success">40/40</span></div>
                          </div>
                        </div>
                        <div className="timeline-list position-relative">
                          <div className="timeline-item d-flex position-relative">
                            <span className="timeline-icon bg-success-transparent text-success flex-shrink-0"><i className="ti ti-check"></i></span>
                            <div className="timeline-body"><b>Attendance submitted</b><div className="timeline-time">20 minutes ago</div></div>
                          </div>
                          <div className="timeline-item d-flex position-relative">
                            <span className="timeline-icon bg-warning-transparent text-warning flex-shrink-0"><i className="ti ti-upload"></i></span>
                            <div className="timeline-body"><b>Worksheet published</b><div className="timeline-time">2 hours ago</div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 d-flex">
                    <div className="card flex-fill">
                      <div className="card-header"><h5 className="card-title">Progress &amp; Buttons</h5></div>
                      <div className="card-body">
                        <p>Bootstrap&#8217;s own <code>.progress</code>, sized with <code>--bs-progress-height</code>; <code>.action-button</code> and <code>.icon-action</code> are the widget controls.</p>
                        <div className="card p-3 mb-2">
                          <div className="d-flex align-items-center justify-content-between"><span className="fs-11 text-muted">Syllabus Coverage</span><span className="fs-22 fw-bold text-dark">78%</span></div>
                          <div className="progress" role="progressbar" aria-valuenow={78} aria-valuemin={0} aria-valuemax={100} style={{ "--bs-progress-height": '6px' } as CSSProperties}><div className="progress-bar" style={{ width: '78%' }}></div></div>
                        </div>
                        <div className="card p-3 mb-3">
                          <div className="d-flex align-items-center justify-content-between"><span className="fs-11 text-muted">Assignments Graded</span><span className="fs-22 fw-bold text-dark">92%</span></div>
                          <div className="progress" role="progressbar" aria-valuenow={92} aria-valuemin={0} aria-valuemax={100} style={{ "--bs-progress-height": '6px' } as CSSProperties}><div className="progress-bar" style={{ width: '92%' }}></div></div>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          <button type="button" className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"><i className="ti ti-plus"></i>New Class</button>
                          <button type="button" className="action-button d-inline-flex align-items-center text-nowrap text-decoration-none"><i className="ti ti-download"></i>Export</button>
                          <button type="button" className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"><i className="ti ti-eye"></i>View</button>
                          <button type="button" className="icon-action d-inline-flex align-items-center justify-content-center text-decoration-none"><i className="ti ti-dots-vertical"></i></button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              {/* end row */}
            </div>
          </div>
    </div>
  );
};

export default UiDashboardCards;
