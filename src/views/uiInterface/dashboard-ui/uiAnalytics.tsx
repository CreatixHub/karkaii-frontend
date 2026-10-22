const UiAnalytics = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="page-header">
        <h3 className="page-title">Analytics</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title fs-16 fw-medium">Gauge</h4>
            </div>
            <div className="card-body">
              <p>
                A radial dial. The reading is passed as the{" "}
                <code>--gauge-value</code> custom property (0–100); tone comes
                from <code>.gauge-primary</code>, <code>.gauge-success</code> or{" "}
                <code>.gauge-info</code>.
              </p>
              <div className="d-flex flex-wrap align-items-center justify-content-around gap-3">
                <div className="text-center">
                  <div className="gauge gauge-success mx-auto mb-2">
                    <span className="gauge-value">94.8%</span>
                  </div>
                  <span className="stat-label">Attendance</span>
                </div>
                <div className="text-center">
                  <div className="gauge gauge-primary mx-auto mb-2">
                    <span className="gauge-value">81%</span>
                  </div>
                  <span className="stat-label">Pass Rate</span>
                </div>
                <div className="text-center">
                  <div className="gauge gauge-info mx-auto mb-2">
                    <span className="gauge-value">62%</span>
                  </div>
                  <span className="stat-label">Utilisation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Gauge Sizes</h5>
            </div>
            <div className="card-body">
              <p>
                Add <code>.gauge-lg</code> for the feature size. The value label
                sits in <code>.gauge-value</code>.
              </p>
              <div className="d-flex flex-wrap align-items-center justify-content-around gap-3">
                <div className="text-center">
                  <div className="gauge gauge-primary mx-auto mb-2">
                    <span className="gauge-value">74%</span>
                  </div>
                  <span className="stat-label stat-label-sm">Default</span>
                </div>
                <div className="text-center">
                  <div className="gauge gauge-lg gauge-primary mx-auto mb-2">
                    <span className="gauge-value">74%</span>
                  </div>
                  <span className="stat-label stat-label-sm">Large</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Analytics Card</h5>
            </div>
            <div className="card-body">
              <p>
                Gauge, meters and a stat grid combined — the standard
                performance panel. Everything here is a shared class.
              </p>
              <div className="row g-4 align-items-center">
                <div className="col-md-4 text-center">
                  <div className="gauge gauge-lg gauge-primary mx-auto mb-2">
                    <span className="gauge-value">81%</span>
                  </div>
                  <h6 className="mb-0">Overall Performance</h6>
                  <span className="stat-label stat-label-sm">
                    Across 18 classes
                  </span>
                </div>
                <div className="col-md-8">
                  <div className="d-flex flex-column gap-3 mb-3">
                    <div>
                      <div className="d-flex justify-content-between fs-13 mb-1">
                        <span>Mathematics</span>
                        <span className="fw-semibold">88%</span>
                      </div>
                      <div className="meter meter-primary">
                        <span style={{ width: "88%" }} />
                      </div>
                    </div>
                    <div>
                      <div className="d-flex justify-content-between fs-13 mb-1">
                        <span>Science</span>
                        <span className="fw-semibold">76%</span>
                      </div>
                      <div className="meter meter-info">
                        <span style={{ width: "76%" }} />
                      </div>
                    </div>
                  </div>
                  <div className="stat-grid">
                    <div className="stat-tile stat-tile-plain">
                      <b>3,654</b>
                      <span>Students</span>
                    </div>
                    <div className="stat-tile stat-tile-plain">
                      <b>284</b>
                      <span>Teachers</span>
                    </div>
                    <div className="stat-tile stat-tile-plain">
                      <b>18</b>
                      <span>Classes</span>
                    </div>
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

export default UiAnalytics