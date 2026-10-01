const UiLists = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="page-header">
        <h3 className="page-title">Lists</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title fs-16 fw-medium">Basic List</h4>
            </div>
            <div className="card-body">
              <p>
                A <code>.data-list</code> wraps rows. Each{" "}
                <code>.data-list-item</code> takes a leading avatar, a{" "}
                <code>.data-list-body</code> and trailing meta.
              </p>
              <div className="data-list">
                <div className="data-list-item">
                  <span className="avatar avatar-icon avatar-md bg-primary-transparent">
                    <i className="ti ti-bus" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Route 01 · North</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-map-pin" /> Downtown Ave · 34 km/h
                    </span>
                  </div>
                  <span className="badge badge-soft-success">On route</span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-icon avatar-md bg-danger-transparent">
                    <i className="ti ti-bus" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Route 07 · South</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-map-pin" /> Harbour Road · 12 km/h
                    </span>
                  </div>
                  <span className="badge badge-soft-danger">Delayed</span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-icon avatar-md bg-warning-transparent">
                    <i className="ti ti-bus" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Route 02 · West</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-map-pin" /> Central Park · 28 km/h
                    </span>
                  </div>
                  <span className="badge badge-soft-success">On route</span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-icon avatar-md bg-purple-transparent">
                    <i className="ti ti-bus" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Route 09 · Express</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-map-pin" /> Highway 101 · 55 km/h
                    </span>
                  </div>
                  <span className="badge badge-soft-warning">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Sizes &amp; Dividers</h5>
            </div>
            <div className="card-body">
              <p className="mb-3">
                Use <code>.data-list-sm</code> for compact items,{" "}
                <code>.data-list-lg</code> for spacious items, or{" "}
                <code>.data-list-dashed</code> to swap solid separators for
                dashed ones.
              </p>
              <h6 className="fs-13 fw-semibold text-muted mb-2">
                Compact List (Dashed Dividers)
              </h6>
              <div className="data-list data-list-sm data-list-dashed mb-0">
                <div className="data-list-item">
                  <span className="status-dot status-dot-lg status-dot-square bg-primary" />
                  <div className="data-list-body">
                    <div className="data-list-title">
                      Science &amp; Technology
                    </div>
                    <span className="data-list-subtitle">
                      Main Library · Shelf A4
                    </span>
                  </div>
                  <span className="chip chip-soft chip-sm chip-success me-2">
                    <i className="ti ti-trending-up me-1" />
                    +6%
                  </span>
                  <span className="stat-label stat-label-sm">1,284 books</span>
                </div>
                <div className="data-list-item">
                  <span className="status-dot status-dot-lg status-dot-square bg-info" />
                  <div className="data-list-body">
                    <div className="data-list-title">
                      Mathematics &amp; Logic
                    </div>
                    <span className="data-list-subtitle">
                      Science Wing · Shelf B2
                    </span>
                  </div>
                  <span className="chip chip-soft chip-sm chip-success me-2">
                    <i className="ti ti-trending-up me-1" />
                    +3%
                  </span>
                  <span className="stat-label stat-label-sm">1,043 books</span>
                </div>
                <div className="data-list-item">
                  <span className="status-dot status-dot-lg status-dot-square bg-success" />
                  <div className="data-list-body">
                    <div className="data-list-title">Computer Science</div>
                    <span className="data-list-subtitle">
                      Tech Hub · Lab 01
                    </span>
                  </div>
                  <span className="chip chip-soft chip-sm chip-success me-2">
                    <i className="ti ti-trending-up me-1" />
                    +11%
                  </span>
                  <span className="stat-label stat-label-sm">802 books</span>
                </div>
                <div className="data-list-item">
                  <span className="status-dot status-dot-lg status-dot-square bg-warning" />
                  <div className="data-list-body">
                    <div className="data-list-title">Classical Literature</div>
                    <span className="data-list-subtitle">
                      Arts Block · Floor 2
                    </span>
                  </div>
                  <span className="chip chip-soft chip-sm chip-success me-2">
                    <i className="ti ti-trending-up me-1" />
                    +2%
                  </span>
                  <span className="stat-label stat-label-sm">560 books</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Header &amp; Footer</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.data-list-header</code> and{" "}
                <code>.data-list-footer</code> bookend a list without needing
                extra card sections.
              </p>
              <div className="data-list">
                <div className="data-list-header">
                  <span className="fs-13 fw-semibold">
                    Inbox Messages{" "}
                    <span className="badge badge-soft-danger ms-1">
                      4 unread
                    </span>
                  </span>
                  <span className="stat-label">
                    <i className="ti ti-mail me-1" />
                    24 today
                  </span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-sm flex-shrink-0">
                    <img
                      src="assets/img/parents/parent-01.jpg"
                      className="rounded-circle flex-shrink-0"
                      alt="img"
                    />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Robert Daniel</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-calendar-event me-1" />
                      Requested a parent-teacher meeting
                    </span>
                  </div>
                  <span className="chip chip-soft chip-muted">
                    <i className="ti ti-clock me-1" />
                    2h ago
                  </span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-sm flex-shrink-0">
                    <img
                      src="assets/img/parents/parent-05.jpg"
                      className="rounded-circle flex-shrink-0"
                      alt="img"
                    />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Steven Vance</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-mail-forward me-1" />
                      Replied to the monthly newsletter
                    </span>
                  </div>
                  <span className="chip chip-soft chip-muted">
                    <i className="ti ti-clock me-1" />
                    5h ago
                  </span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-sm flex-shrink-0">
                    <img
                      src="assets/img/parents/parent-02.jpg"
                      className="rounded-circle flex-shrink-0"
                      alt="img"
                    />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Laura Martinez</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-file-text me-1" />
                      Submitted medical leave form for Grade 8
                    </span>
                  </div>
                  <span className="chip chip-soft chip-muted">
                    <i className="ti ti-clock me-1" />
                    1d ago
                  </span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-sm flex-shrink-0">
                    <img
                      src="assets/img/parents/parent-03.jpg"
                      className="rounded-circle flex-shrink-0"
                      alt="img"
                    />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">David Williams</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-receipt-2 me-1" />
                      Inquired about term fee installment receipt
                    </span>
                  </div>
                  <span className="chip chip-soft chip-muted">
                    <i className="ti ti-clock me-1" />
                    2d ago
                  </span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-sm flex-shrink-0">
                    <img
                      src="assets/img/parents/parent-04.jpg"
                      className="rounded-circle flex-shrink-0"
                      alt="img"
                    />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Sophia Taylor</div>
                    <span className="data-list-subtitle">
                      <i className="ti ti-bus me-1" />
                      Confirmed afternoon transport pickup location
                    </span>
                  </div>
                  <span className="chip chip-soft chip-muted">
                    <i className="ti ti-clock me-1" />
                    3d ago
                  </span>
                </div>
                <div className="data-list-footer d-flex align-items-center justify-content-between">
                  <span className="stat-label">Showing 5 of 24 messages</span>
                  <a
                    role="button"
                  tabIndex={0}
                    className="link-primary fs-13 fw-medium"
                  >
                    View all messages
                    <i className="ti ti-arrow-right ms-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Accents</h5>
            </div>
            <div className="card-body">
              <p>
                Add <code>.accent-success</code>, <code>.accent-danger</code>,{" "}
                <code>.accent-warning</code>, <code>.accent-purple</code> or{" "}
                <code>.accent-pink</code> to give a row a status rail.
              </p>
              <div className="data-list">
                <div className="data-list-item accent-success">
                  <span className="data-list-body data-list-title">
                    Route running on time
                  </span>
                  <span className="chip chip-lg text-success">
                    <span className="status-dot status-dot-sm status-dot-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="data-list-item accent-warning">
                  <span className="data-list-body data-list-title">
                    Minor traffic reported
                  </span>
                  <span className="chip chip-muted text-warning">
                    <i className="ti ti-traffic-cone" />
                    Traffic
                  </span>
                </div>
                <div className="data-list-item accent-danger">
                  <span className="data-list-body data-list-title">
                    Route delayed 12 minutes
                  </span>
                  <span className="chip chip-lg text-danger">
                    <span className="status-dot status-dot-sm status-dot-pulse" />
                    DELAYED
                  </span>
                </div>
                <div className="data-list-item accent-purple">
                  <span className="data-list-body data-list-title">
                    Maintenance scheduled
                  </span>
                  <span className="badge badge-soft-purple">Planned</span>
                </div>
                <div className="data-list-item accent-pink">
                  <span className="data-list-body data-list-title">
                    Awaiting parent confirmation
                  </span>
                  <span className="badge badge-soft-pink">Pending</span>
                </div>
              </div>
              <p className="mt-3 mb-2">
                Add <code>.data-list-item-top</code> when a row's trailing
                content is taller than one line — it aligns everything to the
                top instead of centring.
              </p>
              <div className="data-list">
                <div className="data-list-item data-list-item-top">
                  <span className="avatar avatar-icon avatar-md bg-info-transparent">
                    <i className="ti ti-message-2" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Meeting request</div>
                    <span className="data-list-subtitle">
                      Robert Daniel would like to discuss Term 1 progress and
                      the upcoming parent–teacher evening.
                    </span>
                  </div>
                  <span className="chip chip-soft chip-muted">
                    <i className="ti ti-clock" />
                    2h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Inset &amp; Stacked Rows</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.data-list-inset</code> gives the list a soft panel. A row
                can stack with <code>.flex-column.align-items-stretch</code> and
                hold a <code>.stat-grid</code>.
              </p>
              <div className="data-list data-list-inset">
                <div className="data-list-item flex-column align-items-stretch accent-success">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="data-list-title">
                      <i className="ti ti-bus" />
                      Route 01 — North
                    </span>
                    <span className="chip chip-lg text-success">
                      <span className="status-dot status-dot-sm status-dot-pulse" />
                      LIVE
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="avatar avatar-sm flex-shrink-0">
                      <img
                        src="assets/img/profiles/avatar-14.jpg"
                        alt="driver"
                      />
                    </span>
                    <span className="data-list-title">
                      James Cooper
                      <br />
                      <span className="stat-label">Driver</span>
                    </span>
                    <span className="chip chip-muted">
                      <i className="ti ti-gps" />
                      GPS OK
                    </span>
                  </div>
                  <div className="stat-grid">
                    <div className="stat-tile stat-tile-plain">
                      <b>42</b>
                      <span>Onboard</span>
                    </div>
                    <div className="stat-tile stat-tile-plain">
                      <b>8 min</b>
                      <span>ETA</span>
                    </div>
                    <div className="stat-tile stat-tile-plain">
                      <b>34 km/h</b>
                      <span>Speed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Hover Actions</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.hover-actions</code> keeps row controls hidden until the
                row is hovered or focused, so a dense list stays quiet.
              </p>
              <div className="data-list">
                <div className="data-list-item">
                  <span className="avatar avatar-icon avatar-md bg-primary-transparent">
                    <i className="ti ti-file-text" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Term 1 Report Card</div>
                    <span className="data-list-subtitle">
                      Updated 2 days ago
                    </span>
                  </div>
                  <span className="hover-actions">
                    <a
                      role="button"
                  tabIndex={0}
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label="Edit"
                    >
                      <i className="ti ti-edit" />
                    </a>
                    <a
                      role="button"
                  tabIndex={0}
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label="Download"
                    >
                      <i className="ti ti-download" />
                    </a>
                  </span>
                </div>
                <div className="data-list-item">
                  <span className="avatar avatar-icon avatar-md bg-info-transparent">
                    <i className="ti ti-file-text" />
                  </span>
                  <div className="data-list-body">
                    <div className="data-list-title">Attendance Summary</div>
                    <span className="data-list-subtitle">
                      Updated 5 days ago
                    </span>
                  </div>
                  <span className="hover-actions">
                    <a
                      role="button"
                  tabIndex={0}
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label="Edit"
                    >
                      <i className="ti ti-edit" />
                    </a>
                    <a
                      role="button"
                  tabIndex={0}
                      className="btn btn-icon btn-sm btn-outline-light bg-white"
                      aria-label="Download"
                    >
                      <i className="ti ti-download" />
                    </a>
                  </span>
                </div>
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

export default UiLists