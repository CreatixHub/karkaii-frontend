const UiWidgets = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content widget-canvas">
      <div className="page-header">
        <h3 className="page-title">Widgets</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title fs-16 fw-medium">Welcome Banner</h4>
            </div>
            <div className="card-body">
              <p>
                Add <code>.welcome-banner</code> to a card for the greeting
                header. <code>.welcome-banner-brand</code> tints the leading
                avatar.
              </p>
              <div className="card welcome-banner mb-0">
                <div className="card-body">
                  <div className="row g-4 align-items-center">
                    <div className="col-xxl-5 col-lg-12">
                      <div className="d-flex align-items-center mb-3">
                        <span className="avatar avatar-icon avatar-xl welcome-banner-brand me-3">
                          <i className="ti ti-school" />
                        </span>
                        <div>
                          <h2 className="mb-1">Good Morning, Administrator</h2>
                          <p className="stat-label mb-0">
                            <b>Oxford International School</b>
                            <span className="opacity-50 mx-1">•</span>Mon, 20
                            Jul 2026
                          </p>
                        </div>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        <a
                          role="button"
                  tabIndex={0}
                          className="btn btn-primary btn-3d fw-medium d-inline-flex align-items-center"
                        >
                          <i className="ti ti-square-rounded-plus me-1" />
                          New Admission
                        </a>
                        <a
                          role="button"
                  tabIndex={0}
                          className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center"
                        >
                          <i className="ti ti-report-money me-1" />
                          Collect Fees
                        </a>
                      </div>
                    </div>
                    <div className="col-xxl-7 col-lg-12">
                      <div className="row g-3">
                        <div className="col-6 col-md-3">
                          <div className="stat-tile stat-tile-hover">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="avatar avatar-icon bg-success-transparent">
                                <i className="ti ti-checkbox" />
                              </span>
                              <span className="stat-delta stat-delta-sm stat-delta-up">
                                <i className="ti ti-trending-up" />
                                0.8%
                              </span>
                            </div>
                            <h3 className="mb-0 fs-18">94.8%</h3>
                            <span className="stat-label stat-label-sm">
                              Attendance
                            </span>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="stat-tile stat-tile-hover">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="avatar avatar-icon bg-primary-transparent">
                                <i className="ti ti-user-plus" />
                              </span>
                              <span className="stat-delta stat-delta-sm stat-delta-up">
                                <i className="ti ti-trending-up" />
                                12
                              </span>
                            </div>
                            <h4 className="mb-0">128</h4>
                            <span className="stat-label stat-label-sm">
                              Admissions
                            </span>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="stat-tile stat-tile-hover">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="avatar avatar-icon bg-warning-transparent">
                                <i className="ti ti-currency-dollar" />
                              </span>
                              <span className="stat-delta stat-delta-sm stat-delta-up">
                                <i className="ti ti-trending-up" />
                                3.2%
                              </span>
                            </div>
                            <h4 className="mb-0">$48.6K</h4>
                            <span className="stat-label stat-label-sm">
                              Fees Today
                            </span>
                          </div>
                        </div>
                        <div className="col-6 col-md-3">
                          <div className="stat-tile stat-tile-hover">
                            <div className="d-flex align-items-center justify-content-between mb-2">
                              <span className="avatar avatar-icon bg-purple-transparent">
                                <i className="ti ti-file-certificate" />
                              </span>
                              <span className="stat-delta stat-delta-sm stat-delta-down">
                                <i className="ti ti-clock" />
                                2d
                              </span>
                            </div>
                            <h4 className="mb-0">09</h4>
                            <span className="stat-label stat-label-sm">
                              Exams
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Spotlight Card</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.spotlight-card</code> plus a tone class —{" "}
                <code>.perf-green</code>, <code>.perf-blue</code> — gives a
                full-bleed feature card. <code>.spotlight-img</code> anchors the
                cut-out portrait.
              </p>
              <div className="card spotlight-card perf-green p-3 mb-0 d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between">
                  <span className="badge bg-white text-success">
                    <i className="ti ti-trophy me-1" />
                    Best Teacher
                  </span>
                  <span className="chip chip-warning">
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-half-filled" />
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className="mb-1 text-white fw-bold">Sarah Mitchell</h4>
                  <p className="text-white mb-2 opacity-75 fs-13">
                    <i className="ti ti-atom me-1" />
                    Physics Department
                  </p>
                  <span className="chip chip-soft chip-on-media chip-lg">
                    <i className="ti ti-medal" />
                    Teacher of the Year 2024
                  </span>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-auto">
                  <div className="d-flex gap-2">
                    <div className="stat-tile stat-tile-on-media text-white text-center">
                      <h5 className="mb-0 fw-bold text-white">4.9</h5>
                      <span className="fs-11 opacity-75">Rating</span>
                    </div>
                    <div className="stat-tile stat-tile-on-media text-white text-center">
                      <h5 className="mb-0 fw-bold text-white">98%</h5>
                      <span className="fs-11 opacity-75">Pass Rate</span>
                    </div>
                  </div>
                  <img
                    src="assets/img/performer/performer-01.png"
                    alt="img"
                    className="spotlight-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Spotlight Tones</h5>
            </div>
            <div className="card-body">
              <p>
                Swap the tone class to re-skin the same structure —{" "}
                <code>.perf-blue</code> alongside <code>.perf-green</code>.
              </p>
              <div className="card spotlight-card perf-blue p-3 mb-0 d-flex flex-column">
                <div className="d-flex align-items-start justify-content-between">
                  <span className="badge bg-white text-primary">
                    <i className="ti ti-star me-1" />
                    Star Student
                  </span>
                  <span className="chip chip-warning">
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                    <i className="ti ti-star-filled" />
                  </span>
                </div>
                <div className="mt-2">
                  <h4 className="mb-1 text-white fw-bold">Janet Daniel</h4>
                  <p className="text-white mb-2 opacity-75 fs-13">
                    <i className="ti ti-school me-1" />
                    Grade XII · Science
                  </p>
                  <span className="chip chip-soft chip-on-media chip-lg">
                    <i className="ti ti-medal-2" />
                    School Topper 2026
                  </span>
                </div>
                <div className="d-flex align-items-end justify-content-between mt-auto">
                  <div className="d-flex gap-2">
                    <div className="stat-tile stat-tile-on-media text-white text-center">
                      <h5 className="mb-0 fw-bold text-white">98.4%</h5>
                      <span className="fs-11 opacity-75">Average</span>
                    </div>
                    <div className="stat-tile stat-tile-on-media text-white text-center">
                      <h5 className="mb-0 fw-bold text-white">1st</h5>
                      <span className="fs-11 opacity-75">Rank</span>
                    </div>
                  </div>
                  <img
                    src="assets/img/performer/student-performer-01.png"
                    alt="img"
                    className="spotlight-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Avatar Group &amp; Presence</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.avatar-group-overlapped</code> tightens a group into a
                stack. A nested status dot takes <code>.is-away</code> or{" "}
                <code>.is-busy</code>; <code>.bg-gray-500</code> is the neutral
                overflow chip.
              </p>
              <div className="avatar-group avatar-group-overlapped mb-3">
                <span className="avatar avatar-rounded">
                  <img src="assets/img/profiles/avatar-01.jpg" alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src="assets/img/profiles/avatar-02.jpg" alt="img" />
                </span>
                <span className="avatar avatar-rounded">
                  <img src="assets/img/profiles/avatar-03.jpg" alt="img" />
                </span>
                <span className="avatar avatar-rounded bg-gray-500 text-white">
                  +9
                </span>
              </div>
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="d-inline-flex align-items-center gap-2 fs-13">
                  <span className="status-dot bg-success" />
                  Online
                </span>
                <span className="d-inline-flex align-items-center gap-2 fs-13">
                  <span className="status-dot is-away" />
                  Away
                </span>
                <span className="d-inline-flex align-items-center gap-2 fs-13">
                  <span className="status-dot is-busy" />
                  Busy
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Bubble Cloud</h5>
            </div>
            <div className="card-body">
              <p>
                Proportional bubbles for share-of-total. Size comes from the{" "}
                <code>--bubble-size</code> custom property; colour from any
                gradient utility.
              </p>
              <div className="bubble-cloud">
                <div className="bubble bg-primary-gradient  bubble-01">
                  <b>32%</b>
                  <span>Science</span>
                </div>
                <div className="bubble bg-info-gradient bubble-02">
                  <b>26%</b>
                  <span>Maths</span>
                </div>
                <div className="bubble bg-success-gradient bubble-03">
                  <b>20%</b>
                  <span>Coding</span>
                </div>
                <div className="bubble bg-warning-gradient bubble-04">
                  <b>14%</b>
                  <span>Lit</span>
                </div>
                <div className="bubble bg-purple-gradient bubble-05">
                  <b>8%</b>
                  <span>Hist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Map Panel</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.map-panel</code> is the placeholder surface for a live
                map; <code>.map-panel-pin</code> centres a marker on it.
              </p>
              <div className="map-panel">
                <span className="avatar avatar-icon avatar-lg avatar-rounded map-panel-pin">
                  <i className="ti ti-map-pin" />
                </span>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-3">
                <span className="badge badge-soft-success">
                  <i className="ti ti-gps me-1" />
                  GPS Online
                </span>
                <span className="chip chip-lg">
                  <i className="ti ti-sun text-warning" />
                  28°C · Clear
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Card Header Caption</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.stat-caption</code> sets a small eyebrow above a card
                title — use it instead of a second heading level.
              </p>
              <div className="card mb-0">
                <div className="card-header">
                  <span className="stat-caption">Realtime</span>
                  <h4 className="card-title mb-0">Activity Timeline</h4>
                </div>
                <div className="card-body">
                  <p className="mb-0 text-muted fs-13">
                    Card content goes here.
                  </p>
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

export default UiWidgets