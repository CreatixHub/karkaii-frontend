const UiActivity = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="page-header">
        <h3 className="page-title">Activity</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-xl-7">
          <div className="card flex-fill">
            <div className="card-header">
              <span className="stat-caption">Realtime</span>
              <h4 className="card-title mb-0">Activity Timeline</h4>
            </div>
            <div className="card-body">
              <p>
                Use a <code>&lt;ul class="activity-feed"&gt;</code>. Each{" "}
                <code>&lt;li&gt;</code> takes a leading avatar and a body;{" "}
                <code>.activity-feed-divider</code> marks a date break. Add{" "}
                <code>.activity-feed-roomy</code> for the looser rhythm.
              </p>
              <ul className="activity-feed activity-feed-roomy mb-0">
                <li className="activity-feed-divider">
                  <span>Today</span>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-primary-transparent">
                    <i className="ti ti-send" />
                  </span>
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h5 className="mb-1 fs-15">
                        Fee reminder circular sent to{" "}
                        <span className="fw-semibold">412 parents</span>
                      </h5>
                      <div className="d-flex align-items-center gap-2">
                        <span className="chip chip-soft chip-muted">
                          <i className="ti ti-clock" />
                          20m
                        </span>
                        <span className="chip chip-square chip-soft chip-danger">
                          <i className="ti ti-flag-3-filled" />
                          High
                        </span>
                      </div>
                    </div>
                    <span className="badge badge-soft-primary flex-shrink-0">
                      Circular
                    </span>
                  </div>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-success-transparent">
                    <i className="ti ti-message-2" />
                  </span>
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h6 className="mb-1">
                        SMS batch delivered —{" "}
                        <span className="fw-semibold">98.6%</span> success
                      </h6>
                      <span className="chip chip-soft chip-muted">
                        <i className="ti ti-clock" />
                        1h
                      </span>
                    </div>
                    <span className="badge badge-soft-success flex-shrink-0">
                      Delivered
                    </span>
                  </div>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-info-transparent">
                    <i className="ti ti-calendar-event" />
                  </span>
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="d-flex align-items-center">
                      <a
                        role="button"
                  tabIndex={0}
                        className="avatar avatar-sm me-2 flex-shrink-0"
                      >
                        <img
                          src="assets/img/parents/parent-01.jpg"
                          className="rounded-circle flex-shrink-0"
                          alt="img"
                        />
                      </a>
                      <div>
                        <h6 className="mb-1">
                          <span className="fw-semibold">Robert Daniel</span>{" "}
                          requested a meeting
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <span className="chip chip-soft chip-muted">
                            <i className="ti ti-clock" />
                            2h
                          </span>
                          <span className="chip chip-square chip-soft chip-warning">
                            <i className="ti ti-flag-3-filled" />
                            Med
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="badge badge-soft-info flex-shrink-0">
                      Meeting
                    </span>
                  </div>
                </li>
                <li className="activity-feed-divider">
                  <span>Yesterday</span>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-warning-transparent">
                    <i className="ti ti-speakerphone" />
                  </span>
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h6 className="mb-1">Sports Day circular published</h6>
                      <span className="chip chip-soft chip-muted">
                        <i className="ti ti-clock" />
                        4:12 PM
                      </span>
                    </div>
                    <span className="badge badge-soft-warning flex-shrink-0">
                      Notice
                    </span>
                  </div>
                </li>
                <li className="activity-feed-divider">
                  <span>Earlier</span>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-success-transparent">
                    <i className="ti ti-checks" />
                  </span>
                  <div className="d-flex align-items-start justify-content-between">
                    <div>
                      <h6 className="mb-1">
                        Term 1 report cards approved —{" "}
                        <span className="fw-semibold">18 classes</span>
                      </h6>
                      <span className="chip chip-soft chip-muted">
                        <i className="ti ti-clock" />2 days ago
                      </span>
                    </div>
                    <span className="badge badge-soft-success flex-shrink-0">
                      Approved
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Compact Feed</h5>
            </div>
            <div className="card-body">
              <p>
                Drop <code>.activity-feed-roomy</code> for the dense rhythm —
                better inside a narrow column.
              </p>
              <ul className="activity-feed mb-0">
                <li>
                  <span className="avatar avatar-icon avatar-md bg-primary-transparent">
                    <i className="ti ti-user-plus" />
                  </span>
                  <div>
                    <h6 className="mb-1">New admission approved</h6>
                    <span className="chip chip-soft chip-muted">
                      <i className="ti ti-clock" />
                      8m
                    </span>
                  </div>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-danger-transparent">
                    <i className="ti ti-alert-triangle" />
                  </span>
                  <div>
                    <h6 className="mb-1">Fee payment failed</h6>
                    <span className="chip chip-soft chip-muted">
                      <i className="ti ti-clock" />
                      42m
                    </span>
                  </div>
                </li>
                <li>
                  <span className="avatar avatar-icon avatar-md bg-info-transparent">
                    <i className="ti ti-book" />
                  </span>
                  <div>
                    <h6 className="mb-1">14 library books returned</h6>
                    <span className="chip chip-soft chip-muted">
                      <i className="ti ti-clock" />
                      3h
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Status Dots</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.status-dot</code> marks live state. Sizes:{" "}
                <code>.status-dot-sm</code>, <code>.status-dot-lg</code>. Add{" "}
                <code>.status-dot-pulse</code> to animate,{" "}
                <code>.status-dot-square</code> for a legend swatch.
              </p>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="chip chip-lg text-success">
                  <span className="status-dot status-dot-sm status-dot-pulse" />
                  LIVE
                </span>
                <span className="chip chip-lg text-danger">
                  <span className="status-dot status-dot-sm status-dot-pulse" />
                  DELAYED
                </span>
                <span className="d-inline-flex align-items-center gap-2 fs-13">
                  <span className="status-dot status-dot-lg status-dot-square bg-primary" />
                  Science
                </span>
                <span className="d-inline-flex align-items-center gap-2 fs-13">
                  <span className="status-dot status-dot-lg status-dot-square bg-warning" />
                  Literature
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end row */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default UiActivity