const UiActions = () => {
  return (
    <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content">
      <div className="page-header">
        <h3 className="page-title">Actions</h3>
      </div>
      {/* start row */}
      <div className="row">
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h4 className="card-title fs-16 fw-medium">3D Buttons</h4>
            </div>
            <div className="card-body">
              <p>
                Add <code>.btn-3d</code> to any Bootstrap button for the raised
                dashboard CTA treatment.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
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
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-white btn-3d fw-medium d-inline-flex align-items-center"
                >
                  <i className="ti ti-file-analytics me-1" />
                  Report
                </a>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-success btn-3d fw-medium"
                >
                  Approve
                </a>
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-danger btn-3d fw-medium"
                >
                  Reject
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Icon Actions</h5>
            </div>
            <div className="card-body">
              <p>
                Compact controls for card headers and list rows —{" "}
                <code>.btn-icon</code> with the outline-light treatment.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-icon btn-outline-light bg-white"
                  aria-label="Refresh"
                >
                  <i className="ti ti-refresh" />
                </a>
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-icon btn-outline-light bg-white"
                  aria-label="Print"
                >
                  <i className="ti ti-printer" />
                </a>
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-icon btn-outline-light bg-white"
                  aria-label="Export"
                >
                  <i className="ti ti-file-export" />
                </a>
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-icon btn-outline-light bg-white"
                  aria-label="More"
                >
                  <i className="ti ti-dots-vertical" />
                </a>
              </div>
              <div className="d-flex flex-wrap gap-2">
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
                <a
                  role="button"
                  tabIndex={0}
                  className="btn btn-icon btn-sm btn-outline-light bg-white"
                  aria-label="Delete"
                >
                  <i className="ti ti-trash" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Quick Action Card</h5>
            </div>
            <div className="card-body">
              <p>
                A launcher tile. <code>.action-card</code> on an{" "}
                <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code>, with an{" "}
                <code>.avatar-icon</code> for the glyph — the arrow animates on
                hover.
              </p>
              <div className="row g-3">
                <div className="col-xl-3 col-md-6 d-flex">
                  <a role="button" tabIndex={0} className="action-card">
                    <span className="avatar avatar-icon avatar-md bg-primary-transparent">
                      <i className="ti ti-user-plus" />
                    </span>
                    <span className="action-card-body">
                      <span className="action-card-title">New Admission</span>
                      <span className="action-card-text">
                        Enrol a student and assign a class.
                      </span>
                    </span>
                    <i className="ti ti-arrow-right action-card-go" />
                  </a>
                </div>
                <div className="col-xl-3 col-md-6 d-flex">
                  <a role="button" tabIndex={0} className="action-card">
                    <span className="avatar avatar-icon avatar-md bg-success-transparent">
                      <i className="ti ti-report-money" />
                    </span>
                    <span className="action-card-body">
                      <span className="action-card-title">Collect Fees</span>
                      <span className="action-card-text">
                        Record a payment against an invoice.
                      </span>
                    </span>
                    <i className="ti ti-arrow-right action-card-go" />
                  </a>
                </div>
                <div className="col-xl-3 col-md-6 d-flex">
                  <a role="button" tabIndex={0} className="action-card">
                    <span className="avatar avatar-icon avatar-md bg-warning-transparent">
                      <i className="ti ti-speakerphone" />
                    </span>
                    <span className="action-card-body">
                      <span className="action-card-title">Post Notice</span>
                      <span className="action-card-text">
                        Publish a circular to parents.
                      </span>
                    </span>
                    <i className="ti ti-arrow-right action-card-go" />
                  </a>
                </div>
                <div className="col-xl-3 col-md-6 d-flex">
                  <a role="button" tabIndex={0} className="action-card">
                    <span className="avatar avatar-icon avatar-md bg-purple-transparent">
                      <i className="ti ti-file-analytics" />
                    </span>
                    <span className="action-card-body">
                      <span className="action-card-title">Run Report</span>
                      <span className="action-card-text">
                        Generate a term summary.
                      </span>
                    </span>
                    <i className="ti ti-arrow-right action-card-go" />
                  </a>
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
                <code>.hover-actions</code> reveals row controls only on hover
                or keyboard focus, keeping a dense list calm.
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
        <div className="col-xl-6 d-flex">
          <div className="card flex-fill">
            <div className="card-header">
              <h5 className="card-title">Chips as Actions</h5>
            </div>
            <div className="card-body">
              <p>
                Chips carry inline metadata and filters. Sizes{" "}
                <code>.chip-sm</code> / <code>.chip-lg</code>, tones{" "}
                <code>.chip-primary</code>, <code>.chip-success</code>,{" "}
                <code>.chip-warning</code>, <code>.chip-danger</code>,{" "}
                <code>.chip-muted</code>; add <code>.chip-soft</code> or{" "}
                <code>.chip-square</code>.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="chip chip-soft chip-primary">
                  <i className="ti ti-filter" />
                  Grade XII
                </span>
                <span className="chip chip-soft chip-success">
                  <i className="ti ti-trending-up" />
                  +6%
                </span>
                <span className="chip chip-soft chip-muted">
                  <i className="ti ti-clock" />
                  20m
                </span>
                <span className="chip chip-square chip-soft chip-danger">
                  <i className="ti ti-flag-3-filled" />
                  High
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <span className="chip chip-sm chip-soft chip-primary">
                  Small
                </span>
                <span className="chip chip-soft chip-primary">Default</span>
                <span className="chip chip-lg chip-soft chip-primary">
                  Large
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

export default UiActions