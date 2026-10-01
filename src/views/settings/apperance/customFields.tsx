
const CustomFields = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* ===================== 1. CUSTOM FIELDS HERO ===================== */}
      <div className="hero">
        <div className="hero-top">
          <span className="hero-crest">
            <i className="ti ti-forms" />
          </span>
          <div className="flex-fill">
            <h1 className="hero-title">Custom Fields</h1>
            <p className="hero-subtitle">
              Every field the school has added to a form beyond the ones shipped
              with the product — defined once here, then bound to as many
              modules as need it. Change a field once and every form carrying it
              follows.
            </p>
          </div>
          <span className="field-status-badge is-warn">
            <i className="ti ti-alert-circle" />3 drafts awaiting publish
          </span>
        </div>
        <div className="hero-facts">
          <div className="hero-fact">
            <span>Custom fields</span>
            <strong>
              184 <small>across all modules</small>
            </strong>
          </div>
          <div className="hero-fact">
            <span>Active modules</span>
            <strong>
              13 <span className="field-status-badge is-accent">of 14</span>
            </strong>
          </div>
          <div className="hero-fact">
            <span>Published</span>
            <strong>
              168 <span className="field-status-badge is-published">Live</span>
            </strong>
          </div>
          <div className="hero-fact">
            <span>Drafts</span>
            <strong>
              16{" "}
              <span className="field-status-badge is-draft">Unpublished</span>
            </strong>
          </div>
          <div className="hero-fact">
            <span>Last updated</span>
            <strong className="fs-14">
              31 Jul 2026 <small>· Ms. Latha Rao</small>
            </strong>
          </div>
        </div>
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#cfx_create_field"
          >
            <i className="ti ti-plus me-1" />
            Create custom field
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#cfx_create_group"
          >
            <i className="ti ti-layout-grid-add me-1" />
            Create field group
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#cfx_import"
          >
            <i className="ti ti-upload me-1" />
            Import fields
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#cfx_export"
          >
            <i className="ti ti-download me-1" />
            Export configuration
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#cfx_publish"
          >
            <i className="ti ti-rocket me-1" />
            Publish changes
          </button>
        </div>
      </div>
      {/* /Custom Fields Hero */}
      <div className="row g-4">
        {/* ===================== 2. STICKY MODULE NAVIGATION ===================== */}
        <div className="col-xxl-2 col-xl-3">
          <div
            className="field-navigation nav flex-column"
            role="tablist"
            aria-label="Custom field modules"
          >
            <span className="navigation-header">Library</span>
            <button
              className="field-navigation-link active"
              id="cfxtab-all"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-all"
              type="button"
              role="tab"
              aria-controls="cfxpane-all"
              aria-selected="true"
            >
              <i className="ti ti-stack-2" />
              <span className="navigation-text">All Fields</span>
              <span className="navigation-n">184</span>
            </button>
            <span className="navigation-header">Modules</span>
            <button
              className="field-navigation-link"
              id="cfxtab-students"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-students"
              type="button"
              role="tab"
              aria-controls="cfxpane-students"
              aria-selected="false"
            >
              <i className="ti ti-school" />
              <span className="navigation-text">Students</span>
              <span className="navigation-n">32</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-admissions"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-admissions"
              type="button"
              role="tab"
              aria-controls="cfxpane-admissions"
              aria-selected="false"
            >
              <i className="ti ti-user-plus" />
              <span className="navigation-text">Admissions</span>
              <span className="navigation-n">24</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-teachers"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-teachers"
              type="button"
              role="tab"
              aria-controls="cfxpane-teachers"
              aria-selected="false"
            >
              <i className="ti ti-chalkboard" />
              <span className="navigation-text">Teachers</span>
              <span className="navigation-n">18</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-parents"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-parents"
              type="button"
              role="tab"
              aria-controls="cfxpane-parents"
              aria-selected="false"
            >
              <i className="ti ti-users" />
              <span className="navigation-text">Parents</span>
              <span className="navigation-n">14</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-hr"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-hr"
              type="button"
              role="tab"
              aria-controls="cfxpane-hr"
              aria-selected="false"
            >
              <i className="ti ti-id-badge-2" />
              <span className="navigation-text">HR</span>
              <span className="navigation-n">21</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-fees"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-fees"
              type="button"
              role="tab"
              aria-controls="cfxpane-fees"
              aria-selected="false"
            >
              <i className="ti ti-report-money" />
              <span className="navigation-text">Fees</span>
              <span className="navigation-n">12</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-library"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-library"
              type="button"
              role="tab"
              aria-controls="cfxpane-library"
              aria-selected="false"
            >
              <i className="ti ti-books" />
              <span className="navigation-text">Library</span>
              <span className="navigation-n">9</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-transport"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-transport"
              type="button"
              role="tab"
              aria-controls="cfxpane-transport"
              aria-selected="false"
            >
              <i className="ti ti-bus" />
              <span className="navigation-text">Transport</span>
              <span className="navigation-n">11</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-hostel"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-hostel"
              type="button"
              role="tab"
              aria-controls="cfxpane-hostel"
              aria-selected="false"
            >
              <i className="ti ti-building-community" />
              <span className="navigation-text">Hostel</span>
              <span className="navigation-n">10</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-inventory"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-inventory"
              type="button"
              role="tab"
              aria-controls="cfxpane-inventory"
              aria-selected="false"
            >
              <i className="ti ti-package" />
              <span className="navigation-text">Inventory</span>
              <span className="navigation-n">13</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-medical"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-medical"
              type="button"
              role="tab"
              aria-controls="cfxpane-medical"
              aria-selected="false"
            >
              <i className="ti ti-stethoscope" />
              <span className="navigation-text">Medical</span>
              <span className="navigation-n">15</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-ai"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-ai"
              type="button"
              role="tab"
              aria-controls="cfxpane-ai"
              aria-selected="false"
            >
              <i className="ti ti-sparkles" />
              <span className="navigation-text">AI Modules</span>
              <span className="navigation-n">5</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-system"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-system"
              type="button"
              role="tab"
              aria-controls="cfxpane-system"
              aria-selected="false"
            >
              <i className="ti ti-settings-cog" />
              <span className="navigation-text">System</span>
              <span className="navigation-n">0</span>
            </button>
            <span className="navigation-header">History</span>
            <button
              className="field-navigation-link"
              id="cfxtab-archived"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-archived"
              type="button"
              role="tab"
              aria-controls="cfxpane-archived"
              aria-selected="false"
            >
              <i className="ti ti-archive" />
              <span className="navigation-text">Archived</span>
              <span className="navigation-n">27</span>
            </button>
            <button
              className="field-navigation-link"
              id="cfxtab-audit"
              data-bs-toggle="pill"
              data-bs-target="#cfxpane-audit"
              type="button"
              role="tab"
              aria-controls="cfxpane-audit"
              aria-selected="false"
            >
              <i className="ti ti-file-search" />
              <span className="navigation-text">Audit History</span>
              <span className="navigation-n">312</span>
            </button>
            <div className="navigation-footer">
              <span className="field-metric-label">Module coverage</span>
              <div className="cover">
                <span className="width-92" />
              </div>
              <p className="fs-12 text-muted mb-2">
                13 of 14 modules carry at least one custom field. System has
                none yet.
              </p>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                data-bs-toggle="offcanvas"
                data-bs-target="#cfx_workspace"
              >
                <i className="ti ti-adjustments-alt me-1" />
                Open field workspace
              </button>
            </div>
          </div>
        </div>
        {/* /Sticky Module Navigation */}
        <div className="col-xxl-10 col-xl-9">
          <div className="tab-content">
            {/* ===================== ALL FIELDS ===================== */}
            <div
              className="tab-pane fade show active"
              id="cfxpane-all"
              role="tabpanel"
              aria-labelledby="cfxtab-all"
              tabIndex={0}
            >
              {/* ===================== 3. MODULE WORKSPACE ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 01</span>
                  <h2>Module workspace</h2>
                  <p>
                    Where the fields actually live. Each module is a schema of
                    its own — open one to add, reorder or retire the fields on
                    its forms.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#cfx_assign"
                >
                  <i className="ti ti-plug-connected me-1" />
                  Assign field to module
                </button>
              </div>
              <div className="row g-3 mb-5">
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-school" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Students</p>
                        <span className="field-key">student.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>32</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-36" />
                        <span className="width-64" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>11</b> required
                        </span>
                        <span>
                          <b>21</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 31 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Students form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-user-plus" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Admissions</p>
                        <span className="field-key">admission.custom</span>
                      </div>
                      <span className="field-status-badge is-draft">
                        2 drafts
                      </span>
                    </div>
                    <div className="module-count">
                      <b>24</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-56" />
                        <span className="width-44" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>14</b> required
                        </span>
                        <span>
                          <b>10</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 29 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Admissions form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-chalkboard" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Teachers</p>
                        <span className="field-key">teacher.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>18</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-40" />
                        <span className="width-60" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>7</b> required
                        </span>
                        <span>
                          <b>11</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 24 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Teachers form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-users" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Parents</p>
                        <span className="field-key">parent.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>14</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-28" />
                        <span className="width-72" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>4</b> required
                        </span>
                        <span>
                          <b>10</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 22 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Parents form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-id-badge-2" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">HR</p>
                        <span className="field-key">hr.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>21</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-48" />
                        <span className="width-52" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>10</b> required
                        </span>
                        <span>
                          <b>11</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 30 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview HR form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-report-money" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Fees</p>
                        <span className="field-key">fees.custom</span>
                      </div>
                      <span className="field-status-badge is-warn">
                        1 warning
                      </span>
                    </div>
                    <div className="module-count">
                      <b>12</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-32" />
                        <span className="width-68" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>4</b> required
                        </span>
                        <span>
                          <b>8</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 18 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Fees form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-books" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Library</p>
                        <span className="field-key">library.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>9</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-24" />
                        <span className="width-76" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>2</b> required
                        </span>
                        <span>
                          <b>7</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 12 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Library form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-bus" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Transport</p>
                        <span className="field-key">transport.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>11</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-44" />
                        <span className="width-56" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>5</b> required
                        </span>
                        <span>
                          <b>6</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 27 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Transport form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-building-community" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Hostel</p>
                        <span className="field-key">hostel.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>10</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-40" />
                        <span className="width-60" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>4</b> required
                        </span>
                        <span>
                          <b>6</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 09 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Hostel form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-package" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Inventory</p>
                        <span className="field-key">inventory.custom</span>
                      </div>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                    <div className="module-count">
                      <b>13</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-52" />
                        <span className="width-48" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>7</b> required
                        </span>
                        <span>
                          <b>6</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 15 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Inventory form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-stethoscope" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">Medical</p>
                        <span className="field-key">medical.custom</span>
                      </div>
                      <span className="field-status-badge is-required">
                        Restricted
                      </span>
                    </div>
                    <div className="module-count">
                      <b>15</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-60" />
                        <span className="width-40" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>9</b> required
                        </span>
                        <span>
                          <b>6</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 28 Jul</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview Medical form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="module">
                    <div className="module-header">
                      <span className="module-icon">
                        <i className="ti ti-sparkles" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="module-name">AI Modules</p>
                        <span className="field-key">ai.custom</span>
                      </div>
                      <span className="field-status-badge is-draft">Beta</span>
                    </div>
                    <div className="module-count">
                      <b>5</b>
                      <span>fields</span>
                    </div>
                    <div className="module-split">
                      <div className="field-progress-meter">
                        <span className="width-20" />
                        <span className="width-80" />
                      </div>
                      <div className="module-legend">
                        <span className="is-req">
                          <b>1</b> required
                        </span>
                        <span>
                          <b>4</b> optional
                        </span>
                      </div>
                    </div>
                    <div className="module-footer">
                      <span>Modified 01 Aug</span>
                      <span className="d-inline-flex gap-1">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#cfx_workspace"
                        >
                          Manage
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_preview"
                          aria-label="Preview AI form"
                        >
                          <i className="ti ti-eye" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Module Workspace */}
              {/* ===================== 4. CUSTOM FIELD BUILDER ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 02</span>
                  <h2>Field builder</h2>
                  <p>
                    Pick a type, name it, and it becomes reusable everywhere.
                    Twenty-seven input types are supported — the type decides
                    what is stored, not just how it looks.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_duplicate"
                  >
                    <i className="ti ti-copy me-1" />
                    Duplicate field
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    New field
                  </button>
                </div>
              </div>
              <div className="row g-4 mb-5">
                <div className="col-xxl-5 col-lg-6">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-category-2" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">Field type palette</p>
                        <p>Every input type the builder can produce</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <div className="palette">
                        <button type="button" className="field-tile is-active">
                          <i className="ti ti-cursor-text" />
                          <span>Text</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-align-left" />
                          <span>Textarea</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-number-123" />
                          <span>Number</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-mail" />
                          <span>Email</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-phone" />
                          <span>Phone</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-calendar" />
                          <span>Date</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-clock" />
                          <span>Time</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-calendar-time" />
                          <span>Date &amp; Time</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-currency-rupee" />
                          <span>Currency</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-percentage" />
                          <span>Percentage</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-checkbox" />
                          <span>Checkbox</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-circle-dot" />
                          <span>Radio Button</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-toggle-left" />
                          <span>Toggle</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-chevron-down" />
                          <span>Dropdown</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-list-check" />
                          <span>Multi Select</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-search" />
                          <span>Autocomplete</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-paperclip" />
                          <span>File Upload</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-photo" />
                          <span>Image Upload</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-signature" />
                          <span>Signature</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-star" />
                          <span>Rating</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-link" />
                          <span>URL</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-palette" />
                          <span>Color Picker</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-tags" />
                          <span>Tags</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-text-caption" />
                          <span>Rich Text</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-map-pin" />
                          <span>Location</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-braces" />
                          <span>JSON</span>
                        </button>
                        <button type="button" className="field-tile">
                          <i className="ti ti-eye-off" />
                          <span>Hidden Field</span>
                        </button>
                      </div>
                    </div>
                    <div className="field-panel-footer">
                      <span>27 types · Text selected</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_create_field"
                      >
                        Build from type
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-7 col-lg-6">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-device-desktop" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">Live preview</p>
                        <p>
                          Exactly how the field renders on the Students form
                        </p>
                      </div>
                      <span className="field-status-badge is-accent">
                        <i className="ti ti-bolt" />
                        Live
                      </span>
                    </div>
                    <div className="field-panel-body">
                      <div className="canvas">
                        <div className="preview">
                          <div className="preview-label">
                            Blood Group <span className="star">*</span>
                          </div>
                          <select
                            className="form-select"
                            aria-label="Blood group"
                          >
                            <option>Select blood group</option>
                            <option>A+</option>
                            <option>B+</option>
                            <option>O+</option>
                            <option>AB+</option>
                          </select>
                          <p className="preview-help">
                            Collected once at admission and shown on the medical
                            record.
                          </p>
                        </div>
                        <div className="preview">
                          <div className="preview-label">
                            Guardian Occupation
                          </div>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Civil engineer"
                            aria-label="Guardian occupation"
                          />
                          <p className="preview-help">
                            Optional. Used by the scholarship module when
                            means-testing.
                          </p>
                        </div>
                        <div className="preview">
                          <div className="preview-label">
                            Transport Required <span className="star">*</span>
                          </div>
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="cfx_pv_sw"
                              defaultChecked
                            />
                            <label
                              className="form-check-label fs-13"
                              htmlFor="cfx_pv_sw"
                            >
                              Yes, allocate a route
                            </label>
                          </div>
                          <p className="preview-help">
                            Turning this on reveals Pickup Point and Route
                            below.
                          </p>
                        </div>
                        <button
                          type="button"
                          className="slot mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#cfx_create_field"
                        >
                          <i className="ti ti-plus" />
                          Drop a field here
                        </button>
                      </div>
                    </div>
                    <div className="field-panel-footer">
                      <span>3 of 32 fields shown</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Open full form preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-3 mb-5">
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Blood Group</p>
                        <span className="field-key">student.blood_group</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Students, Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Guardian Occupation</p>
                        <span className="field-key">parent.occupation</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents, Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-currency-rupee" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Annual Family Income</p>
                        <span className="field-key">
                          admission.family_income
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-currency-rupee" />
                        Currency
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-warn">
                        Min / Max
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions, Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field is-draft"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-signature" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Parent Signature</p>
                        <span className="field-key">admission.signature</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-signature" />
                        Signature
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-draft">Draft</span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-map-pin" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Pickup Point</p>
                        <span className="field-key">
                          transport.pickup_point
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-map-pin" />
                        Location
                      </span>
                      <span className="field-status-badge is-optional">
                        Conditional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport, Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-tags" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Allergies</p>
                        <span className="field-key">medical.allergies</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-tags" />
                        Tags
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-star" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Interview Rating</p>
                        <span className="field-key">
                          admission.interview_score
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-star" />
                        Rating
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions, Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-braces" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Device Metadata</p>
                        <span className="field-key">ai.device_meta</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-braces" />
                        JSON
                      </span>
                      <span className="field-status-badge">Read only</span>
                      <span className="field-status-badge is-draft">Beta</span>
                    </div>
                    <div className="field-footer">
                      <span>AI Modules</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-eye" />
                        Preview
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Custom Field Builder */}
              {/* ===================== 5. VALIDATION CENTER ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 03</span>
                  <h2>Validation center</h2>
                  <p>
                    What a field will and will not accept. Every rule here is
                    enforced server-side too — the form is the reminder, not the
                    guard.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#cfx_validation"
                >
                  <i className="ti ti-shield-check me-1" />
                  Configure validation
                </button>
              </div>
              <div className="row g-3 mb-5">
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard is-req">
                    <span className="guard-icon">
                      <i className="ti ti-asterisk" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Required</p>
                      <p>The form will not submit without it.</p>
                      <span className="expression">
                        applied to <b>68</b> fields
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard">
                    <span className="guard-icon">
                      <i className="ti ti-arrow-bar-to-right" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Minimum length</p>
                      <p>Rejects values shorter than the floor.</p>
                      <span className="expression">
                        length <b>≥</b> 3
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard">
                    <span className="guard-icon">
                      <i className="ti ti-arrow-bar-to-left" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Maximum length</p>
                      <p>Caps what is stored, silently truncating nothing.</p>
                      <span className="expression">
                        length <b>≤</b> 120
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard is-warn">
                    <span className="guard-icon">
                      <i className="ti ti-regex" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Regex</p>
                      <p>Pattern match for codes and identifiers.</p>
                      <span className="expression">
                        <b>^</b>[A-Z]{"{"}2{"}"}\d{"{"}6{"}"}
                        <b>$</b>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard is-ok">
                    <span className="guard-icon">
                      <i className="ti ti-fingerprint" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Unique</p>
                      <p>No two records may carry the same value.</p>
                      <span className="expression">
                        scope <b>per module</b>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard">
                    <span className="guard-icon">
                      <i className="ti ti-lock" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Read only</p>
                      <p>Shown, never edited from the form.</p>
                      <span className="expression">
                        applied to <b>9</b> fields
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard">
                    <span className="guard-icon">
                      <i className="ti ti-eye-off" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Hidden</p>
                      <p>Stored and posted, but never rendered.</p>
                      <span className="expression">
                        applied to <b>4</b> fields
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard is-warn">
                    <span className="guard-icon">
                      <i className="ti ti-git-branch" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Conditional logic</p>
                      <p>Required only when another answer says so.</p>
                      <span className="expression">
                        if <b>transport</b> = yes
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard is-ok">
                    <span className="guard-icon">
                      <i className="ti ti-player-play" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Default value</p>
                      <p>What the field holds before anyone types.</p>
                      <span className="expression">
                        default <b>"India"</b>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard">
                    <span className="guard-icon">
                      <i className="ti ti-text-caption" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Placeholder</p>
                      <p>An example, never a substitute for the label.</p>
                      <span className="expression">"e.g. Civil engineer"</span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard">
                    <span className="guard-icon">
                      <i className="ti ti-help-circle" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">Help text</p>
                      <p>The sentence below the input that saves a call.</p>
                      <span className="expression">
                        on <b>41</b> fields
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="guard is-req">
                    <span className="guard-icon">
                      <i className="ti ti-alert-triangle" />
                    </span>
                    <div className="flex-fill">
                      <p className="guard-title">3 validation warnings</p>
                      <p>Rules that contradict each other or never fire.</p>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white mt-2"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#cfx_workspace"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Validation Center */}
              {/* ===================== 6. FORM LAYOUT CENTER ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 04</span>
                  <h2>Form layout</h2>
                  <p>
                    Fields exist in a library; forms decide the order they are
                    met in. Grouping, sectioning and column width are set here,
                    once, per module.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#cfx_create_group"
                >
                  <i className="ti ti-layout-grid-add me-1" />
                  New field group
                </button>
              </div>
              <div className="row g-3 mb-5">
                <div className="col-xxl-3 col-lg-6">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-layout-grid" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">Field groups</p>
                        <p>Reusable bundles of related fields</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Identity<small>Name, DOB, gender, blood group</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge">6</span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Guardian<small>Occupation, income, contact</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge">5</span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Logistics<small>Transport, hostel, meal plan</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge">4</span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Consent<small>Signature, declarations</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge is-draft">
                            Draft
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="field-panel-footer">
                      <span>12 groups</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#cfx_workspace"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-separator-horizontal" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">Sections &amp; tabs</p>
                        <p>How a long form is broken up</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Sections per form
                          <small>Headed blocks with their own intro</small>
                        </div>
                        <div className="field-row-value">
                          <b className="fs-15">5</b>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Tabbed layout
                          <small>Used when a form exceeds 20 fields</small>
                        </div>
                        <div className="field-row-value">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="cfx_ly_1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="cfx_ly_1"
                            >
                              Tabbed layout
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Collapse optional
                          <small>Optional sections start folded</small>
                        </div>
                        <div className="field-row-value">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="cfx_ly_2"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="cfx_ly_2"
                            >
                              Collapse optional
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Step wizard<small>Admissions only</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge is-accent">
                            4 steps
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="field-panel-footer">
                      <span>Applies to Students</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-columns-3" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">
                          Columns &amp; ordering
                        </p>
                        <p>Width a field takes, and where it sits</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <span className="field-metric-label">Desktop grid</span>
                      <div className="columns is-active mb-3">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="field-metric-label">Tablet grid</span>
                      <div className="columns mb-3">
                        <span />
                        <span />
                      </div>
                      <span className="field-metric-label">Mobile grid</span>
                      <div className="columns">
                        <span />
                      </div>
                      <div className="field-info-row mt-3">
                        <div className="field-row-key">
                          Drag to reorder
                          <small>
                            Order carries to every form using the field
                          </small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge is-published">
                            On
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="field-panel-footer">
                      <span>3 / 2 / 1 columns</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#cfx_workspace"
                      >
                        Adjust
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-eye-check" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">
                          Visibility &amp; preview
                        </p>
                        <p>Who sees the form, and how it is checked</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Visibility rules
                          <small>Per role, per branch, per class</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge">18 rules</span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Responsive layout
                          <small>Verified at 3 breakpoints</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge is-published">
                            Passing
                          </span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Preview mode<small>Render as a chosen role</small>
                        </div>
                        <div className="field-row-value">
                          <select
                            className="form-select"
                            aria-label="Preview as role"
                          >
                            <option>Administrator</option>
                            <option>Teacher</option>
                            <option>Parent</option>
                            <option>Student</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="field-panel-footer">
                      <span>Last checked 31 Jul</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview form
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Form Layout Center */}
              {/* ===================== 7. DYNAMIC RULES ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 05</span>
                  <h2>Dynamic rules</h2>
                  <p>
                    Fields that react to each other. Each rule is one{" "}
                    <em>when</em> and one <em>then</em> — kept plain on purpose,
                    because a form that behaves unpredictably is worse than a
                    long one.
                  </p>
                </div>
                <span className="field-status-badge is-accent">
                  <i className="ti ti-bolt" />
                  26 rules active
                </span>
              </div>
              <div className="row g-3 mb-5">
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-eye" />
                      <p className="rule-title">Conditional visibility</p>
                      <span className="field-status-badge is-published">9</span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      <code>transport_required</code> is Yes
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      show <code>pickup_point</code>, <code>route</code>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-binary-tree" />
                      <p className="rule-title">Field dependencies</p>
                      <span className="field-status-badge is-published">6</span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      <code>state</code> changes
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      reload options for <code>city</code>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-math-function" />
                      <p className="rule-title">Calculated fields</p>
                      <span className="field-status-badge is-published">4</span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      <code>dob</code> is set
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      <code>age</code> = years since dob
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-wand" />
                      <p className="rule-title">Auto population</p>
                      <span className="field-status-badge is-published">5</span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      <code>sibling_id</code> is matched
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      copy address and guardian
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-route" />
                      <p className="rule-title">Workflow triggers</p>
                      <span className="field-status-badge is-draft">
                        2 draft
                      </span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      <code>family_income</code> &lt; 250000
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      open a scholarship review
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-user-shield" />
                      <p className="rule-title">Role-based visibility</p>
                      <span className="field-status-badge is-published">7</span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      viewer role is Parent
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      hide <code>medical.notes</code>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-player-play" />
                      <p className="rule-title">Default rules</p>
                      <span className="field-status-badge is-published">3</span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      a new admission opens
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      <code>country</code> = "India"
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-rule">
                    <div className="rule-top">
                      <i className="ti ti-gavel" />
                      <p className="rule-title">Business rules</p>
                      <span className="field-status-badge is-warn">
                        1 conflict
                      </span>
                    </div>
                    <div className="field-clause" data-kw="WHEN">
                      <code>hostel_required</code> is Yes
                    </div>
                    <div className="field-clause" data-kw="THEN">
                      require a local guardian
                    </div>
                  </div>
                </div>
              </div>
              {/* /Dynamic Rules */}
              {/* ===================== 8. FIELD ACTIVITY TIMELINE ===================== */}
              <div className="row g-4 mb-5">
                <div className="col-xxl-12 col-lg-12">
                  <div className="field-section-header">
                    <div>
                      <span className="field-metric-label">Section 06</span>
                      <h2>Field lifecycle</h2>
                      <p>
                        What happened to{" "}
                        <span className="field-key">student.blood_group</span>{" "}
                        from first draft to live.
                      </p>
                    </div>
                  </div>
                  <div className="field-panel">
                    <div className="field-panel-body">
                      <ul className="flow">
                        <li className="flow-item is-done">
                          <p className="flow-title">Field created</p>
                          <p>
                            Dropdown with 8 options, drafted by Ms. Latha Rao.
                          </p>
                          <time dateTime="2026-06-14T10:24">
                            14 Jun 2026 · 10:24
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">Validation added</p>
                          <p>
                            Marked required; value restricted to the option
                            list.
                          </p>
                          <time dateTime="2026-06-15T09:02">
                            15 Jun 2026 · 09:02
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">Assigned to module</p>
                          <p>
                            Bound to Students and Medical; placed in the
                            Identity group.
                          </p>
                          <time dateTime="2026-06-18T16:40">
                            18 Jun 2026 · 16:40
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">Published</p>
                          <p>
                            Live on 4 forms. 1,284 records backfilled from
                            admissions.
                          </p>
                          <time dateTime="2026-06-20T08:15">
                            20 Jun 2026 · 08:15
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">Updated</p>
                          <p>
                            Help text rewritten; "Unknown" added as an option.
                          </p>
                          <time dateTime="2026-07-31T12:07">
                            31 Jul 2026 · 12:07
                          </time>
                        </li>
                        <li className="flow-item is-current">
                          <p className="flow-title">Configuration active</p>
                          <p>
                            No pending changes. Next review scheduled for the
                            2027 intake.
                          </p>
                          <time dateTime="2026-08-13">Now</time>
                        </li>
                      </ul>
                    </div>
                    <div className="field-panel-footer">
                      <span>6 events · full history in audit</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#cfx_workspace"
                      >
                        Open field
                      </button>
                    </div>
                  </div>
                </div>
                {/* ===================== 10. FIELD INSIGHTS ===================== */}
                <div className="col-xxl-12 col-lg-12">
                  <div className="field-section-header">
                    <div>
                      <span className="field-metric-label">Section 07</span>
                      <h2>Field insights</h2>
                      <p>
                        What the schema looks like from a distance — what is
                        carrying weight, and what is quietly dead.
                      </p>
                    </div>
                  </div>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="insight">
                        <div className="insight-top">
                          <i className="ti ti-flame" />
                          <p className="insight-title">Most used fields</p>
                        </div>
                        <div className="rank">
                          <span className="rank-n">01</span>
                          <span className="rank-name">Blood Group</span>
                          <span className="rank-bar">
                            <span className="width-96" />
                          </span>
                          <span className="rank-v">4 forms</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">02</span>
                          <span className="rank-name">Guardian Occupation</span>
                          <span className="rank-bar">
                            <span className="width-80" />
                          </span>
                          <span className="rank-v">3 forms</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">03</span>
                          <span className="rank-name">Emergency Contact</span>
                          <span className="rank-bar">
                            <span className="width-72" />
                          </span>
                          <span className="rank-v">3 forms</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">04</span>
                          <span className="rank-name">
                            Annual Family Income
                          </span>
                          <span className="rank-bar">
                            <span className="width-56" />
                          </span>
                          <span className="rank-v">2 forms</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="insight">
                        <div className="insight-top">
                          <i className="ti ti-clock-edit" />
                          <p className="insight-title">Recently modified</p>
                        </div>
                        <div className="rank">
                          <span className="rank-n">—</span>
                          <span className="rank-name">Parent Signature</span>
                          <span className="rank-v">1 Aug</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">—</span>
                          <span className="rank-name">Device Metadata</span>
                          <span className="rank-v">1 Aug</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">—</span>
                          <span className="rank-name">Blood Group</span>
                          <span className="rank-v">31 Jul</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">—</span>
                          <span className="rank-name">Pickup Point</span>
                          <span className="rank-v">27 Jul</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="insight is-warn">
                        <div className="insight-top">
                          <i className="ti ti-ghost" />
                          <p className="insight-title">Unused fields</p>
                        </div>
                        <p className="fs-12 text-muted mb-2">
                          Defined, published, and empty on every record for 12
                          months.
                        </p>
                        <div className="rank">
                          <span className="rank-n">01</span>
                          <span className="rank-name">Former School Code</span>
                          <span className="rank-v">0 values</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">02</span>
                          <span className="rank-name">Library Card Colour</span>
                          <span className="rank-v">0 values</span>
                        </div>
                        <div className="rank">
                          <span className="rank-n">03</span>
                          <span className="rank-name">Locker Preference</span>
                          <span className="rank-v">2 values</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="insight is-stop">
                        <div className="insight-top">
                          <i className="ti ti-copy" />
                          <p className="insight-title">Duplicate fields</p>
                        </div>
                        <p className="fs-12 text-muted mb-2">
                          Same meaning, two definitions. Merging keeps both
                          histories.
                        </p>
                        <div className="rank">
                          <span className="rank-name">
                            Mobile No.{" "}
                            <i className="ti ti-arrows-left-right mx-1" />{" "}
                            Contact Number
                          </span>
                          <span className="rank-v">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#cfx_duplicate"
                            >
                              Merge
                            </button>
                          </span>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Aadhaar{" "}
                            <i className="ti ti-arrows-left-right mx-1" />{" "}
                            National ID
                          </span>
                          <span className="rank-v">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-light bg-white"
                              data-bs-toggle="modal"
                              data-bs-target="#cfx_duplicate"
                            >
                              Merge
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="insight is-warn">
                        <div className="insight-top">
                          <i className="ti ti-alert-triangle" />
                          <p className="insight-title">Validation warnings</p>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Min length 8 &gt; max length 6
                          </span>
                          <span className="rank-v">Roll No.</span>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Regex never matches option list
                          </span>
                          <span className="rank-v">Section</span>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Required but hidden by a rule
                          </span>
                          <span className="rank-v">Route</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="insight">
                        <div className="insight-top">
                          <i className="ti ti-bulb" />
                          <p className="insight-title">Recommendations</p>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Add help text to 11 required fields
                          </span>
                          <span className="rank-v">
                            <i className="ti ti-arrow-right" />
                          </span>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Archive 3 unused fields
                          </span>
                          <span className="rank-v">
                            <i className="ti ti-arrow-right" />
                          </span>
                        </div>
                        <div className="rank">
                          <span className="rank-name">
                            Give System its first field group
                          </span>
                          <span className="rank-v">
                            <i className="ti ti-arrow-right" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Field Insights */}
              {/* ===================== 9. REUSABLE TEMPLATES ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 08</span>
                  <h2>Reusable templates</h2>
                  <p>
                    A whole form, packaged. Duplicate one for a new branch or a
                    new intake year instead of rebuilding thirty fields by hand.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#cfx_import"
                >
                  <i className="ti ti-upload me-1" />
                  Import a template
                </button>
              </div>
              <div className="row g-3 mb-3">
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-72" />
                      <span className="width-96" />
                      <span className="width-48" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">
                        Student Registration
                      </p>
                      <span className="field-key">
                        tpl.student_registration
                      </span>
                      <div className="template-stats">
                        <div>
                          <b>32</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>5</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-88" />
                      <span className="width-56" />
                      <span className="width-80" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">Admission Form</p>
                      <span className="field-key">tpl.admission</span>
                      <div className="template-stats">
                        <div>
                          <b>24</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>4</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>3</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-60" />
                      <span className="width-92" />
                      <span className="width-72" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">Teacher Profile</p>
                      <span className="field-key">tpl.teacher_profile</span>
                      <div className="template-stats">
                        <div>
                          <b>18</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>3</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-80" />
                      <span className="width-44" />
                      <span className="width-88" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">Parent Information</p>
                      <span className="field-key">tpl.parent_info</span>
                      <div className="template-stats">
                        <div>
                          <b>14</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-92" />
                      <span className="width-68" />
                      <span className="width-52" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">Medical Record</p>
                      <span className="field-key">tpl.medical_record</span>
                      <div className="template-stats">
                        <div>
                          <b>15</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>3</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-56" />
                      <span className="width-84" />
                      <span className="width-64" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">
                        Transport Registration
                      </p>
                      <span className="field-key">tpl.transport_reg</span>
                      <div className="template-stats">
                        <div>
                          <b>11</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-76" />
                      <span className="width-60" />
                      <span className="width-88" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">
                        Hostel Registration
                      </p>
                      <span className="field-key">tpl.hostel_reg</span>
                      <div className="template-stats">
                        <div>
                          <b>10</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-6 col-md-6">
                  <div className="field-template">
                    <div className="template-thumb">
                      <span className="width-84" />
                      <span className="width-72" />
                      <span className="width-48" />
                    </div>
                    <div className="field-template-body">
                      <p className="field-template-title">Employee Profile</p>
                      <span className="field-key">tpl.employee_profile</span>
                      <div className="template-stats">
                        <div>
                          <b>21</b>
                          <span>Fields</span>
                        </div>
                        <div>
                          <b>4</b>
                          <span>Sections</span>
                        </div>
                        <div>
                          <b>2</b>
                          <span>Modules</span>
                        </div>
                      </div>
                    </div>
                    <div className="field-template-footer">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_preview"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white flex-fill"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_duplicate"
                      >
                        Duplicate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Reusable Templates */}
              {/* ===================== GOVERNANCE ACCORDION ===================== */}
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Section 09</span>
                  <h2>How custom fields behave</h2>
                  <p>
                    The rules the builder itself follows, worth reading once
                    before adding a field that thousands of records will carry.
                  </p>
                </div>
              </div>
              <div className="accordion field-accordion" id="cfx_governance">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="cfx_gv_h1">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#cfx_gv_1"
                      aria-expanded="true"
                      aria-controls="cfx_gv_1"
                    >
                      <i className="ti ti-database me-2" />
                      What happens to existing records when a field is added
                    </button>
                  </h2>
                  <div
                    id="cfx_gv_1"
                    className="accordion-collapse collapse show"
                    aria-labelledby="cfx_gv_h1"
                    data-bs-parent="#cfx_governance"
                    role="region"
                  >
                    <div className="accordion-body">
                      A new field is empty on every record that already exists.
                      Marking it required does not retroactively invalidate them
                      — it only blocks the next save. If the value matters
                      historically, backfill it from an import before publishing
                      rather than after.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="cfx_gv_h2">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#cfx_gv_2"
                      aria-expanded="false"
                      aria-controls="cfx_gv_2"
                    >
                      <i className="ti ti-arrows-shuffle me-2" />
                      Changing a field type after publish
                    </button>
                  </h2>
                  <div
                    id="cfx_gv_2"
                    className="accordion-collapse collapse"
                    aria-labelledby="cfx_gv_h2"
                    data-bs-parent="#cfx_governance"
                    role="region"
                  >
                    <div className="accordion-body">
                      Only widening conversions are allowed — Text to Rich Text,
                      Number to Currency. Anything narrower would discard stored
                      values, so the builder asks you to create a new field and
                      migrate instead. The old field can then be archived with
                      its history intact.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="cfx_gv_h3">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#cfx_gv_3"
                      aria-expanded="false"
                      aria-controls="cfx_gv_3"
                    >
                      <i className="ti ti-archive me-2" />
                      Archiving versus deleting
                    </button>
                  </h2>
                  <div
                    id="cfx_gv_3"
                    className="accordion-collapse collapse"
                    aria-labelledby="cfx_gv_h3"
                    data-bs-parent="#cfx_governance"
                    role="region"
                  >
                    <div className="accordion-body">
                      Archiving removes a field from every form but keeps the
                      stored values readable in reports and exports. Deleting
                      drops the column. A field that has ever held real data
                      should be archived, not deleted — the delete dialog says
                      so, and asks you to type the field name.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="cfx_gv_h4">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#cfx_gv_4"
                      aria-expanded="false"
                      aria-controls="cfx_gv_4"
                    >
                      <i className="ti ti-shield-lock me-2" />
                      Sensitive fields and who may read them
                    </button>
                  </h2>
                  <div
                    id="cfx_gv_4"
                    className="accordion-collapse collapse"
                    aria-labelledby="cfx_gv_h4"
                    data-bs-parent="#cfx_governance"
                    role="region"
                  >
                    <div className="accordion-body">
                      Fields in the Medical module and any field flagged
                      sensitive are readable only by roles granted that
                      permission explicitly. They are excluded from generic
                      exports, from AI context, and from the parent portal
                      unless the field is marked parent-visible one by one.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /All Fields */}
            {/* ===================== STUDENTS ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-students"
              role="tabpanel"
              aria-labelledby="cfxtab-students"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Students</h2>
                  <p>
                    32 custom fields bound to{" "}
                    <span className="field-key">student.custom</span>, arranged
                    across 5 sections: Identity, Guardian, Logistics, Consent,
                    Notes.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>32</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    11{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>21</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">student.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">31 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Blood Group</p>
                        <span className="field-key">student.blood_group</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-phone" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Emergency Contact</p>
                        <span className="field-key">
                          student.emergency_contact
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-phone" />
                        Phone
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-search" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Sibling Roll No.</p>
                        <span className="field-key">student.sibling_roll</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-search" />
                        Autocomplete
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-circle-dot" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">House / Team</p>
                        <span className="field-key">student.house</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-circle-dot" />
                        Radio Button
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-draft"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Locker Preference</p>
                        <span className="field-key">student.locker_pref</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-draft">Draft</span>
                    </div>
                    <div className="field-footer">
                      <span>Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-toggle-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Photo Consent</p>
                        <span className="field-key">student.photo_consent</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-toggle-left" />
                        Toggle
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Students</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Students
                  </button>
                </div>
              </div>
            </div>
            {/* /Students */}
            {/* ===================== ADMISSIONS ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-admissions"
              role="tabpanel"
              aria-labelledby="cfxtab-admissions"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Admissions</h2>
                  <p>
                    24 custom fields bound to{" "}
                    <span className="field-key">admission.custom</span>,
                    arranged across 4 sections: Applicant, Guardian, Prior
                    schooling, Consent.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>24</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    14{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>10</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">admission.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">29 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-currency-rupee" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Annual Family Income</p>
                        <span className="field-key">
                          admission.family_income
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-currency-rupee" />
                        Currency
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Previous School</p>
                        <span className="field-key">admission.prev_school</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-paperclip" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Transfer Certificate</p>
                        <span className="field-key">admission.tc_document</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-paperclip" />
                        File Upload
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-star" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Interview Rating</p>
                        <span className="field-key">
                          admission.interview_score
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-star" />
                        Rating
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-draft"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-signature" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Parent Signature</p>
                        <span className="field-key">admission.signature</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-signature" />
                        Signature
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-draft">Draft</span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Entrance Test Date</p>
                        <span className="field-key">
                          admission.entrance_date
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar" />
                        Date
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Admissions</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Admissions
                  </button>
                </div>
              </div>
            </div>
            {/* /Admissions */}
            {/* ===================== TEACHERS ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-teachers"
              role="tabpanel"
              aria-labelledby="cfxtab-teachers"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Teachers</h2>
                  <p>
                    18 custom fields bound to{" "}
                    <span className="field-key">teacher.custom</span>, arranged
                    across 3 sections: Identity, Qualification, Employment.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>18</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    7{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>11</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">teacher.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">24 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Highest Qualification</p>
                        <span className="field-key">teacher.qualification</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-tags" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Specialisation</p>
                        <span className="field-key">
                          teacher.specialisation
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-tags" />
                        Tags
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-number-123" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Years of Experience</p>
                        <span className="field-key">
                          teacher.experience_years
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-number-123" />
                        Number
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-text-caption" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Publications</p>
                        <span className="field-key">teacher.publications</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-text-caption" />
                        Rich Text
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-link" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Portfolio URL</p>
                        <span className="field-key">teacher.portfolio_url</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-link" />
                        URL
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-paperclip" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Joining Letter</p>
                        <span className="field-key">
                          teacher.joining_letter
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-paperclip" />
                        File Upload
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Teachers</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Teachers
                  </button>
                </div>
              </div>
            </div>
            {/* /Teachers */}
            {/* ===================== PARENTS ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-parents"
              role="tabpanel"
              aria-labelledby="cfxtab-parents"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Parents</h2>
                  <p>
                    14 custom fields bound to{" "}
                    <span className="field-key">parent.custom</span>, arranged
                    across 3 sections: Contact, Occupation, Portal access.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>14</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    4{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>10</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">parent.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">22 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Guardian Occupation</p>
                        <span className="field-key">parent.occupation</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-align-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Workplace Address</p>
                        <span className="field-key">parent.work_address</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-align-left" />
                        Textarea
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Preferred Language</p>
                        <span className="field-key">parent.pref_language</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-phone" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Alternate Contact</p>
                        <span className="field-key">parent.alt_contact</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-phone" />
                        Phone
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-toggle-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Portal Access</p>
                        <span className="field-key">parent.portal_access</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-toggle-left" />
                        Toggle
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-circle-dot" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Relationship</p>
                        <span className="field-key">parent.relationship</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-circle-dot" />
                        Radio Button
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Parents</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Parents
                  </button>
                </div>
              </div>
            </div>
            {/* /Parents */}
            {/* ===================== HR ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-hr"
              role="tabpanel"
              aria-labelledby="cfxtab-hr"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>HR</h2>
                  <p>
                    21 custom fields bound to{" "}
                    <span className="field-key">hr.custom</span>, arranged
                    across 4 sections: Personal, Payroll, Compliance, Documents.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>21</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    10{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>11</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">hr.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">30 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Employee Grade</p>
                        <span className="field-key">hr.grade</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>HR</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">PAN Number</p>
                        <span className="field-key">hr.pan</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>HR</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Bank IFSC</p>
                        <span className="field-key">hr.ifsc</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>HR</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Probation End</p>
                        <span className="field-key">hr.probation_end</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar" />
                        Date
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>HR</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-list-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Shift Pattern</p>
                        <span className="field-key">hr.shift</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-list-check" />
                        Multi Select
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>HR</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-draft"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-toggle-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Background Check</p>
                        <span className="field-key">hr.bg_check</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-toggle-left" />
                        Toggle
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-draft">Draft</span>
                    </div>
                    <div className="field-footer">
                      <span>HR</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to HR
                  </button>
                </div>
              </div>
            </div>
            {/* /HR */}
            {/* ===================== FEES ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-fees"
              role="tabpanel"
              aria-labelledby="cfxtab-fees"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Fees</h2>
                  <p>
                    12 custom fields bound to{" "}
                    <span className="field-key">fees.custom</span>, arranged
                    across 3 sections: Billing, Concession, Reference.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>12</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    4{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>8</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">fees.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">18 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-align-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Concession Reason</p>
                        <span className="field-key">
                          fees.concession_reason
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-align-left" />
                        Textarea
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-percentage" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Concession Percent</p>
                        <span className="field-key">fees.concession_pct</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-percentage" />
                        Percentage
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Sponsor Name</p>
                        <span className="field-key">fees.sponsor</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Cheque Date</p>
                        <span className="field-key">fees.cheque_date</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar" />
                        Date
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-mail" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Billing Contact</p>
                        <span className="field-key">fees.billing_contact</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-mail" />
                        Email
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Roll No.</p>
                        <span className="field-key">fees.roll_ref</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-warn">
                        Warning
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Fees</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Fees
                  </button>
                </div>
              </div>
            </div>
            {/* /Fees */}
            {/* ===================== LIBRARY ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-library"
              role="tabpanel"
              aria-labelledby="cfxtab-library"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Library</h2>
                  <p>
                    9 custom fields bound to{" "}
                    <span className="field-key">library.custom</span>, arranged
                    across 2 sections: Catalogue, Membership.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>9</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    2{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>7</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">library.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">12 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Shelf Code</p>
                        <span className="field-key">library.shelf_code</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Library</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-number-123" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Edition Year</p>
                        <span className="field-key">library.edition_year</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-number-123" />
                        Number
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Library</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-photo" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Cover Image</p>
                        <span className="field-key">library.cover_image</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-photo" />
                        Image Upload
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Library</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-tags" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Genre Tags</p>
                        <span className="field-key">library.genre_tags</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-tags" />
                        Tags
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Library</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-checkbox" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Reference Only</p>
                        <span className="field-key">
                          library.reference_only
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-checkbox" />
                        Checkbox
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Library</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-palette" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Library Card Colour</p>
                        <span className="field-key">library.card_colour</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-palette" />
                        Color Picker
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-warn">
                        Warning
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Library</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Library
                  </button>
                </div>
              </div>
            </div>
            {/* /Library */}
            {/* ===================== TRANSPORT ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-transport"
              role="tabpanel"
              aria-labelledby="cfxtab-transport"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Transport</h2>
                  <p>
                    11 custom fields bound to{" "}
                    <span className="field-key">transport.custom</span>,
                    arranged across 3 sections: Route, Vehicle, Student
                    assignment.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>11</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    5{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>6</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">transport.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">27 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-map-pin" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Pickup Point</p>
                        <span className="field-key">
                          transport.pickup_point
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-map-pin" />
                        Location
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-clock" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Pickup Time</p>
                        <span className="field-key">transport.pickup_time</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-clock" />
                        Time
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Fitness Expiry</p>
                        <span className="field-key">
                          transport.fitness_expiry
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar" />
                        Date
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">GPS Device ID</p>
                        <span className="field-key">transport.gps_device</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-toggle-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Escort Required</p>
                        <span className="field-key">transport.escort</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-toggle-left" />
                        Toggle
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-number-123" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Seat Capacity</p>
                        <span className="field-key">
                          transport.seat_capacity
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-number-123" />
                        Number
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Transport</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Transport
                  </button>
                </div>
              </div>
            </div>
            {/* /Transport */}
            {/* ===================== HOSTEL ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-hostel"
              role="tabpanel"
              aria-labelledby="cfxtab-hostel"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Hostel</h2>
                  <p>
                    10 custom fields bound to{" "}
                    <span className="field-key">hostel.custom</span>, arranged
                    across 3 sections: Room, Warden, Guardian.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>10</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    4{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>6</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">hostel.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">09 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-chevron-down" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Room Preference</p>
                        <span className="field-key">hostel.room_pref</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-chevron-down" />
                        Dropdown
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Hostel</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Local Guardian</p>
                        <span className="field-key">hostel.local_guardian</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Hostel</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-phone" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Local Guardian Phone</p>
                        <span className="field-key">
                          hostel.local_guardian_phone
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-phone" />
                        Phone
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Hostel</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-list-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Dietary Needs</p>
                        <span className="field-key">hostel.dietary</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-list-check" />
                        Multi Select
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Hostel</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar-time" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Check-in Date</p>
                        <span className="field-key">hostel.checkin</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar-time" />
                        Date &amp; Time
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Hostel</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-checkbox" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Curfew Exemption</p>
                        <span className="field-key">hostel.curfew_exempt</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-checkbox" />
                        Checkbox
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Hostel</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Hostel
                  </button>
                </div>
              </div>
            </div>
            {/* /Hostel */}
            {/* ===================== INVENTORY ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-inventory"
              role="tabpanel"
              aria-labelledby="cfxtab-inventory"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Inventory</h2>
                  <p>
                    13 custom fields bound to{" "}
                    <span className="field-key">inventory.custom</span>,
                    arranged across 3 sections: Item, Supplier, Warranty.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>13</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    7{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>6</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">inventory.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">15 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Asset Tag</p>
                        <span className="field-key">inventory.asset_tag</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Inventory</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-currency-rupee" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Purchase Value</p>
                        <span className="field-key">
                          inventory.purchase_value
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-currency-rupee" />
                        Currency
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Inventory</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Warranty Expiry</p>
                        <span className="field-key">
                          inventory.warranty_expiry
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar" />
                        Date
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Inventory</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-search" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Supplier</p>
                        <span className="field-key">inventory.supplier</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-search" />
                        Autocomplete
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Inventory</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-photo" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Condition Photo</p>
                        <span className="field-key">
                          inventory.condition_photo
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-photo" />
                        Image Upload
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Inventory</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-braces" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Serial Numbers</p>
                        <span className="field-key">inventory.serials</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-braces" />
                        JSON
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Inventory</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Inventory
                  </button>
                </div>
              </div>
            </div>
            {/* /Inventory */}
            {/* ===================== MEDICAL ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-medical"
              role="tabpanel"
              aria-labelledby="cfxtab-medical"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>Medical</h2>
                  <p>
                    15 custom fields bound to{" "}
                    <span className="field-key">medical.custom</span>, arranged
                    across 3 sections: History, Visit, Consent.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>15</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    9{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>6</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">medical.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">28 Jul 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-tags" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Allergies</p>
                        <span className="field-key">medical.allergies</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-tags" />
                        Tags
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-list-check" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Chronic Conditions</p>
                        <span className="field-key">medical.chronic</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-list-check" />
                        Multi Select
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-phone" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Doctor Contact</p>
                        <span className="field-key">
                          medical.doctor_contact
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-phone" />
                        Phone
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Last Vaccination</p>
                        <span className="field-key">
                          medical.last_vaccination
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-calendar" />
                        Date
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-text-caption" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Treatment Notes</p>
                        <span className="field-key">medical.notes</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-text-caption" />
                        Rich Text
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-signature" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Consent Signature</p>
                        <span className="field-key">medical.consent_sign</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-signature" />
                        Signature
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Medical</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to Medical
                  </button>
                </div>
              </div>
            </div>
            {/* /Medical */}
            {/* ===================== AI MODULES ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-ai"
              role="tabpanel"
              aria-labelledby="cfxtab-ai"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>AI Modules</h2>
                  <p>
                    5 custom fields bound to{" "}
                    <span className="field-key">ai.custom</span>, arranged
                    across 2 sections: Context, Telemetry.
                  </p>
                </div>
                <div className="d-inline-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    <i className="ti ti-eye me-1" />
                    Preview form
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Add field
                  </button>
                </div>
              </div>
              <div className="hero-facts mb-4">
                <div className="hero-fact">
                  <span>Total fields</span>
                  <strong>5</strong>
                </div>
                <div className="hero-fact">
                  <span>Required</span>
                  <strong>
                    1{" "}
                    <span className="field-status-badge is-required">
                      Enforced
                    </span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Optional</span>
                  <strong>4</strong>
                </div>
                <div className="hero-fact">
                  <span>Namespace</span>
                  <strong>
                    <span className="field-key">ai.custom</span>
                  </strong>
                </div>
                <div className="hero-fact">
                  <span>Last modified</span>
                  <strong className="fs-14">01 Aug 2026</strong>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-draft"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-braces" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Device Metadata</p>
                        <span className="field-key">ai.device_meta</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-braces" />
                        JSON
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-draft">Draft</span>
                    </div>
                    <div className="field-footer">
                      <span>AI Modules</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-draft"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-align-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Risk Override Reason</p>
                        <span className="field-key">ai.risk_override</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-align-left" />
                        Textarea
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-draft">Draft</span>
                    </div>
                    <div className="field-footer">
                      <span>AI Modules</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-toggle-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Model Consent</p>
                        <span className="field-key">ai.model_consent</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-toggle-left" />
                        Toggle
                      </span>
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>AI Modules</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-star" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Feedback Rating</p>
                        <span className="field-key">ai.feedback_rating</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-star" />
                        Rating
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>AI Modules</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-eye-off" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Correlation ID</p>
                        <span className="field-key">ai.correlation_id</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-eye-off" />
                        Hidden Field
                      </span>
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Published
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>AI Modules</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-settings" />
                        Configure
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <button
                    type="button"
                    className="slot h-100"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus" />
                    Add a field to AI Modules
                  </button>
                </div>
              </div>
            </div>
            {/* /AI Modules */}
            {/* ===================== SYSTEM ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-system"
              role="tabpanel"
              aria-labelledby="cfxtab-system"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">Module</span>
                  <h2>System</h2>
                  <p>
                    Platform-level fields that sit outside any single module —
                    branch metadata, tenant flags, integration keys.
                  </p>
                </div>
              </div>
              <div className="empty-state">
                <i className="ti ti-cube-off" />
                <p className="empty-title">No custom fields yet</p>
                <p>
                  System is the only module without a field of its own. Anything
                  added here is available to every other module automatically,
                  so start narrow.
                </p>
                <div className="d-inline-flex gap-2 flex-wrap justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_create_field"
                  >
                    <i className="ti ti-plus me-1" />
                    Create the first field
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_import"
                  >
                    <i className="ti ti-upload me-1" />
                    Import from another module
                  </button>
                </div>
              </div>
            </div>
            {/* /System */}
            {/* ===================== ARCHIVED ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-archived"
              role="tabpanel"
              aria-labelledby="cfxtab-archived"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">History</span>
                  <h2>Archived fields</h2>
                  <p>
                    Off every form, but the values are still readable in reports
                    and exports. Restoring a field puts it back where it was,
                    with its history unbroken.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#cfx_delete"
                >
                  <i className="ti ti-trash me-1" />
                  Delete permanently
                </button>
              </div>
              <div className="row g-3">
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-archived"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-cursor-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Former School Code</p>
                        <span className="field-key">
                          admission.former_school_code
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-cursor-text" />
                        Text
                      </span>
                      <span className="field-status-badge is-archived">
                        Archived
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Archived 04 Mar 2026</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-rotate" />
                        Restore
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-archived"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-palette" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Library Card Colour</p>
                        <span className="field-key">library.card_colour</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-palette" />
                        Color Picker
                      </span>
                      <span className="field-status-badge is-archived">
                        Archived
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Archived 21 Jan 2026</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-rotate" />
                        Restore
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-archived"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-number-123" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Bus Pass Serial</p>
                        <span className="field-key">
                          transport.bus_pass_serial
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-number-123" />
                        Number
                      </span>
                      <span className="field-status-badge is-archived">
                        Archived
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Archived 09 Dec 2025</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-rotate" />
                        Restore
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-archived"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-checkbox" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Midday Meal Opt-in</p>
                        <span className="field-key">student.midday_meal</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-checkbox" />
                        Checkbox
                      </span>
                      <span className="field-status-badge is-archived">
                        Archived
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Archived 30 Nov 2025</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-rotate" />
                        Restore
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-archived"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-align-left" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Covid Declaration</p>
                        <span className="field-key">
                          medical.covid_declaration
                        </span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-align-left" />
                        Textarea
                      </span>
                      <span className="field-status-badge is-archived">
                        Archived
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Archived 12 Aug 2025</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-rotate" />
                        Restore
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-3 col-lg-4 col-md-6">
                  <div
                    className="field is-archived"
                    tabIndex={0}
                    role="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#cfx_workspace"
                  >
                    <div className="field-header">
                      <span className="field-glyph">
                        <i className="ti ti-photo" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="field-name">Locker Photo</p>
                        <span className="field-key">hostel.locker_photo</span>
                      </div>
                    </div>
                    <div className="field-meta">
                      <span className="type">
                        <i className="ti ti-photo" />
                        Image Upload
                      </span>
                      <span className="field-status-badge is-archived">
                        Archived
                      </span>
                    </div>
                    <div className="field-footer">
                      <span>Archived 02 Jul 2025</span>
                      <span className="d-inline-flex align-items-center gap-1">
                        <i className="ti ti-rotate" />
                        Restore
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Archived */}
            {/* ===================== AUDIT HISTORY ===================== */}
            <div
              className="tab-pane fade"
              id="cfxpane-audit"
              role="tabpanel"
              aria-labelledby="cfxtab-audit"
              tabIndex={0}
            >
              <div className="field-section-header">
                <div>
                  <span className="field-metric-label">History</span>
                  <h2>Audit history</h2>
                  <p>
                    Every change to the schema, who made it and when. Retained
                    for seven years and exportable alongside the configuration.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#cfx_export"
                >
                  <i className="ti ti-download me-1" />
                  Export audit trail
                </button>
              </div>
              <div className="row g-4">
                <div className="col-12 col-xxl-8">
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-history" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">Recent changes</p>
                        <p>Last 30 days · 312 entries in total</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <ul className="flow">
                        <li className="flow-item is-current">
                          <p className="flow-title">Device Metadata drafted</p>
                          <p>
                            New JSON field added to AI Modules by Mr. Arun
                            Prakash. Not yet published.
                          </p>
                          <time dateTime="2026-08-01T09:41">
                            01 Aug 2026 · 09:41
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">Blood Group updated</p>
                          <p>
                            Option "Unknown" added; help text rewritten.
                            Affected 4 forms, 1,284 records.
                          </p>
                          <time dateTime="2026-07-31T12:07">
                            31 Jul 2026 · 12:07
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">
                            Background Check validation changed
                          </p>
                          <p>
                            Marked required on HR. Existing records left
                            untouched, as required rules apply forward only.
                          </p>
                          <time dateTime="2026-07-30T15:22">
                            30 Jul 2026 · 15:22
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">
                            Pickup Point bound to Students
                          </p>
                          <p>
                            Second module assignment. Visibility now conditional
                            on Transport Required.
                          </p>
                          <time dateTime="2026-07-27T11:03">
                            27 Jul 2026 · 11:03
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">Roll No. flagged</p>
                          <p>
                            Validation warning raised: minimum length 8 exceeds
                            maximum length 6.
                          </p>
                          <time dateTime="2026-07-18T08:54">
                            18 Jul 2026 · 08:54
                          </time>
                        </li>
                        <li className="flow-item is-done">
                          <p className="flow-title">
                            Former School Code archived
                          </p>
                          <p>
                            Removed from the admission form after two intakes
                            with no values recorded.
                          </p>
                          <time dateTime="2026-03-04T17:12">
                            04 Mar 2026 · 17:12
                          </time>
                        </li>
                      </ul>
                    </div>
                    <div className="field-panel-footer">
                      <span>Showing 6 of 312</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#cfx_workspace"
                      >
                        Open full trail
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xxl-4">
                  <div className="field-panel mb-3">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-user-check" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">
                          Who changes the schema
                        </p>
                        <p>Last 90 days</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <div className="rank">
                        <span className="rank-n">01</span>
                        <span className="rank-name">Ms. Latha Rao</span>
                        <span className="rank-bar">
                          <span className="width-88" />
                        </span>
                        <span className="rank-v">64</span>
                      </div>
                      <div className="rank">
                        <span className="rank-n">02</span>
                        <span className="rank-name">Mr. Arun Prakash</span>
                        <span className="rank-bar">
                          <span className="width-52" />
                        </span>
                        <span className="rank-v">38</span>
                      </div>
                      <div className="rank">
                        <span className="rank-n">03</span>
                        <span className="rank-name">Ms. Divya Nair</span>
                        <span className="rank-bar">
                          <span className="width-32" />
                        </span>
                        <span className="rank-v">23</span>
                      </div>
                      <div className="rank">
                        <span className="rank-n">04</span>
                        <span className="rank-name">System (import)</span>
                        <span className="rank-bar">
                          <span className="width-16" />
                        </span>
                        <span className="rank-v">11</span>
                      </div>
                    </div>
                  </div>
                  <div className="field-panel">
                    <div className="field-panel-header">
                      <span className="field-panel-icon">
                        <i className="ti ti-shield-lock" />
                      </span>
                      <div className="flex-fill">
                        <p className="field-panel-title">Retention</p>
                        <p>How long the trail is kept</p>
                      </div>
                    </div>
                    <div className="field-panel-body">
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Audit retention
                          <small>Cannot be shortened by an administrator</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge is-accent">
                            7 years
                          </span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Value snapshots
                          <small>Before / after on every edit</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge is-published">
                            On
                          </span>
                        </div>
                      </div>
                      <div className="field-info-row">
                        <div className="field-row-key">
                          Export format<small>CSV and signed JSON</small>
                        </div>
                        <div className="field-row-value">
                          <span className="field-status-badge">Both</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Audit History */}
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default CustomFields