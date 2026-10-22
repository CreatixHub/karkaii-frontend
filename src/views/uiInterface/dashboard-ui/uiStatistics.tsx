
const UiStatistics = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="page-header">
        <h3 className="page-title">Statistics</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title fs-16 fw-medium">Stat Tile</h4>
            </div>
            <div className="card-body">
              <p>
                Wrap an icon, a value and a label in <code>.stat-tile</code>.
                Add <code>.stat-tile-hover</code> for the lift on hover.
              </p>
              <div className="row g-3">
                <div className="col-6">
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
                    <h4 className="mb-0">94.8%</h4>
                    <span className="stat-label stat-label-sm">
                      Today's Attendance
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-tile stat-tile-hover">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="avatar avatar-icon bg-primary-transparent">
                        <i className="ti ti-user-plus" />
                      </span>
                      <span className="stat-delta stat-delta-sm stat-delta-down">
                        <i className="ti ti-trending-down" />
                        2.4%
                      </span>
                    </div>
                    <h4 className="mb-0">128</h4>
                    <span className="stat-label stat-label-sm">
                      New Admissions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Stat Delta</h5>
            </div>
            <div className="card-body">
              <p>
                Trend pill. Pair <code>.stat-delta</code> with{" "}
                <code>.stat-delta-up</code> or <code>.stat-delta-down</code>,
                and <code>.stat-delta-sm</code> for the compact size.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="stat-delta stat-delta-up">
                  <i className="ti ti-trending-up" />
                  12.4%
                </span>
                <span className="stat-delta stat-delta-down">
                  <i className="ti ti-trending-down" />
                  3.1%
                </span>
                <span className="stat-delta">
                  <i className="ti ti-minus" />
                  No change
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="stat-delta stat-delta-sm stat-delta-up">
                  <i className="ti ti-trending-up" />
                  0.8%
                </span>
                <span className="stat-delta stat-delta-sm stat-delta-down">
                  <i className="ti ti-clock" />
                  2d
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Stat Label</h5>
            </div>
            <div className="card-body">
              <p>
                Muted caption used under every value.{" "}
                <code>.stat-label-sm</code> is the dense variant.
              </p>
              <h4 className="mb-0">3,654</h4>
              <span className="stat-label">Total Students</span>
              <hr />
              <h5 className="mb-0">1,180</h5>
              <span className="stat-label stat-label-sm">Primary (I–V)</span>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Plain Tile &amp; Stat Grid</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.stat-tile-plain</code> drops the card chrome.{" "}
                <code>.stat-grid</code> lays several out in an even row — useful
                inside a list item.
              </p>
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
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Tile on Media</h5>
            </div>
            <div className="card-body">
              <p>
                <code>.stat-tile-on-media</code> is the translucent variant for
                use over a coloured or photographic background.
              </p>
              <div className="card spotlight-card perf-green p-3 mb-0">
                <div className="d-flex gap-2">
                  <div className="stat-tile stat-tile-on-media text-white text-center">
                    <h5 className="mb-0 fw-bold">4.9</h5>
                    <span className="fs-11 opacity-75 text-dark">Rating</span>
                  </div>
                  <div className="stat-tile stat-tile-on-media text-white text-center">
                    <h5 className="mb-0 fw-bold">98%</h5>
                    <span className="fs-11 opacity-75 text-dark">
                      Pass Rate
                    </span>
                  </div>
                  <div className="stat-tile stat-tile-on-media text-white text-center">
                    <h5 className="mb-0 fw-bold">320</h5>
                    <span className="fs-11 opacity-75 text-dark">Students</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">KPI Strip</h5>
            </div>
            <div className="card-body">
              <p>
                Four tiles in a Bootstrap grid — the standard dashboard header
                strip.
              </p>
              <div className="row g-3">
                <div className="col-6">
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
                    <span className="stat-label stat-label-sm">Fees Today</span>
                  </div>
                </div>
                <div className="col-6">
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
                      Upcoming Exams
                    </span>
                  </div>
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

export default UiStatistics