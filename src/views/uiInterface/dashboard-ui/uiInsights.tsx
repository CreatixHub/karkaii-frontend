const UiInsights = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="page-header">
        <h3 className="page-title">Insights</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title fs-16 fw-medium">Insight Card</h4>
            </div>
            <div className="card-body">
              <p>
                A one-line reading of the data above it. Built from{" "}
                <code>.insight-card</code> with any <code>.avatar-icon</code>{" "}
                tone — drop it straight under a chart.
              </p>
              <div className="insight-card mb-3">
                <span className="avatar avatar-icon avatar-md bg-info-transparent flex-shrink-0">
                  <i className="ti ti-bulb" />
                </span>
                <p className="mb-0 fs-13">
                  Enrollments are up{" "}
                  <span className="fw-semibold text-dark">18%</span> vs last
                  term, outpacing graduations by{" "}
                  <span className="fw-semibold text-dark">2.1×</span>.
                </p>
              </div>
              <div className="insight-card insight-card-success mb-3">
                <span className="avatar avatar-icon avatar-md bg-success-transparent flex-shrink-0">
                  <i className="ti ti-circle-check" />
                </span>
                <p className="mb-0 fs-13">
                  Fee collection cleared{" "}
                  <span className="fw-semibold text-dark">92%</span> of the term
                  target with three weeks to spare.
                </p>
              </div>
              <div className="insight-card insight-card-warning mb-0">
                <span className="avatar avatar-icon avatar-md bg-warning-transparent flex-shrink-0">
                  <i className="ti ti-alert-triangle" />
                </span>
                <p className="mb-0 fs-13">
                  Attendance in{" "}
                  <span className="fw-semibold text-dark">Grade VII–B</span> has
                  fallen below 85% for two consecutive weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Metric Card</h5>
            </div>
            <div className="card-body">
              <p>
                A bordered figure with its trend. Uses only{" "}
                <code>.stat-label</code>, <code>.stat-value</code> and a soft
                badge — no dedicated class needed.
              </p>
              <div className="row g-3">
                <div className="col-sm-4">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="stat-label">Total </span>
                      <span className="badge badge-soft-success">
                        <i className="ti ti-arrow-up-right me-1" />
                        4.6%
                      </span>
                    </div>
                    <h4 className="mb-0">3,654</h4>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="stat-label">Growth Rate</span>
                      <span className="badge badge-soft-primary">
                        <i className="ti ti-arrow-up-right me-1" />
                        18%
                      </span>
                    </div>
                    <h4 className="mb-0">+412</h4>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="border rounded-3 p-3 h-100">
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="stat-label">Admissions</span>
                      <span className="badge badge-soft-warning">
                        <i className="ti ti-clock me-1" />
                        2d
                      </span>
                    </div>
                    <h4 className="mb-0">128</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Summary Card</h5>
            </div>
            <div className="card-body">
              <p>
                A headline figure with its supporting breakdown —{" "}
                <code>.stat-value</code> for the number, a{" "}
                <code>.data-list</code> underneath.
              </p>
              <div className="text-center pt-2 mb-3">
                <div className="stat-value">3,654</div>
                <p className="stat-label mb-0">
                  Total Students{" "}
                  <span className="badge badge-soft-success ms-1">
                    <i className="ti ti-arrow-up-right me-1" />
                    4.6% YoY
                  </span>
                </p>
              </div>
              <div className="data-list data-list-sm data-list-dashed">
                <div className="data-list-item">
                  <span className="status-dot status-dot-lg status-dot-square bg-primary" />
                  <span className="data-list-body data-list-title">Boys</span>
                  <span className="stat-label stat-label-sm">1,948 · 53%</span>
                </div>
                <div className="data-list-item">
                  <span className="status-dot status-dot-lg status-dot-square bg-pink" />
                  <span className="data-list-body data-list-title">Girls</span>
                  <span className="stat-label stat-label-sm">1,706 · 47%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Profile Summary Card</h5>
            </div>
            <div className="card-body">
              <p>
                Avatar, identity and inline stats. Composed from{" "}
                <code>.avatar</code>, <code>.chip</code> and{" "}
                <code>.stat-grid</code>.
              </p>
              <div className="border rounded-3 p-3">
                <div className="d-flex align-items-center mb-3">
                  <span className="avatar avatar-lg me-3 flex-shrink-0">
                    <img
                      src="assets/img/profiles/avatar-01.jpg"
                      className="rounded-circle flex-shrink-0"
                      alt="img"
                    />
                  </span>
                  <div>
                    <h6 className="mb-1">Sarah Mitchell</h6>
                    <span className="chip chip-soft chip-sm chip-primary">
                      <i className="ti ti-atom" />
                      Physics Department
                    </span>
                  </div>
                </div>
                <div className="stat-grid">
                  <div className="stat-tile stat-tile-plain">
                    <b>4.9</b>
                    <span>Rating</span>
                  </div>
                  <div className="stat-tile stat-tile-plain">
                    <b>98%</b>
                    <span>Pass Rate</span>
                  </div>
                  <div className="stat-tile stat-tile-plain">
                    <b>320</b>
                    <span>Students</span>
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

export default UiInsights