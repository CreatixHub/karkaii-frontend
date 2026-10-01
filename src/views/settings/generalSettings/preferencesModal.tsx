
const PreferencesModal = () => {
  return (
    <>
  {/* ===================== PREFERENCE DETAIL (single, reusable) ===================== */}
  <div
    className="offcanvas offcanvas-end flush-panel"
    tabIndex={-1}
    id="pref_panel"
    aria-labelledby="pref_panel_label"
    role="region"
  >
    <div className="flush-panel-head">
      <span className="option-card-icon">
        <i className="ti ti-sun-moon" />
      </span>
      <div className="flex-fill">
        <h3 className="mb-1 fs-16 fw-medium" id="pref_panel_label">
          Theme mode
        </h3>
        <p className="fs-12 text-muted mb-2">
          Appearance · Follows your account · Last changed today, 11:20
        </p>
        <div className="d-flex flex-wrap gap-2">
          <span className="meta-badge is-active">Light</span>
          <span className="meta-badge is-plain">
            <i className="ti ti-cloud me-1" />
            Synced across devices
          </span>
          <span className="meta-badge is-pending">
            <i className="ti ti-alert-triangle me-1" />1 validation note
          </span>
        </div>
      </div>
      <button
        type="button"
        className="btn-close custom-btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      >
        <i className="ti ti-x" />
      </button>
    </div>
    <div className="offcanvas-body">
      <div className="row g-4">
        <div className="col-xl-8">
          <div className="outline-box mb-4">
            <div className="outline-box-head">
              <h4 className="fs-15 fw-medium">Available options</h4>
              <span className="meta-badge is-plain">3</span>
            </div>
            <div className="outline-box-body p-0">
              <div className="option-item">
                <span className="option-item-icon">
                  <i className="ti ti-sun" />
                </span>
                <div className="option-item-text">
                  <span>Light</span>
                  <p>Default. Best in bright rooms and for printing.</p>
                </div>
                <span className="option-item-control">
                  <span className="meta-badge is-active">Selected</span>
                </span>
              </div>
              <div className="option-item is-off">
                <span className="option-item-icon">
                  <i className="ti ti-moon" />
                </span>
                <div className="option-item-text">
                  <span>Dark</span>
                  <p>Lower brightness. Some charts lose contrast.</p>
                </div>
                <span className="option-item-control">
                  <span className="meta-badge is-plain">Available</span>
                </span>
              </div>
              <div className="option-item is-off">
                <span className="option-item-icon">
                  <i className="ti ti-device-desktop" />
                </span>
                <div className="option-item-text">
                  <span>System</span>
                  <p>Follows the operating system through the day.</p>
                </div>
                <span className="option-item-control">
                  <span className="meta-badge is-plain">Available</span>
                </span>
              </div>
            </div>
          </div>
          <div className="outline-box mb-4">
            <div className="outline-box-head">
              <h5 className="fs-15">Preview</h5>
              <span className="meta-badge is-plain">Live</span>
            </div>
            <div className="outline-box-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="layout-preview">
                    <div className="layout-preview-side">
                      <span className="layout-preview-bar is-accent" />
                      <span className="layout-preview-line inline-meter-p-80" />
                      <span className="layout-preview-line inline-meter-p-60" />
                    </div>
                    <div className="layout-preview-main">
                      <span className="layout-preview-bar" />
                      <span className="layout-preview-card" />
                    </div>
                  </div>
                  <p className="fs-12 text-muted mb-0 mt-2">
                    Light · currently applied
                  </p>
                </div>
                <div className="col-md-6">
                  <div className="layout-preview is-dark">
                    <div className="layout-preview-side">
                      <span className="layout-preview-bar is-accent" />
                      <span className="layout-preview-line inline-meter-p-80" />
                      <span className="layout-preview-line inline-meter-p-60" />
                    </div>
                    <div className="layout-preview-main">
                      <span className="layout-preview-bar" />
                      <span className="layout-preview-card" />
                    </div>
                  </div>
                  <p className="fs-12 text-muted mb-0 mt-2">
                    Dark · preview only
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="outline-box">
            <div className="outline-box-head">
              <h6>Validation</h6>
              <span className="meta-badge is-pending">1 note</span>
            </div>
            <div className="outline-box-body">
              <div className="check-row">
                <i className="ti ti-circle-check" />
                <span>Contrast passes AA in both light and dark</span>
              </div>
              <div className="check-row">
                <i className="ti ti-circle-check" />
                <span>Works with the high contrast accessibility aid</span>
              </div>
              <div className="check-row">
                <i className="ti ti-circle-check" />
                <span>Applies to printed pages and exported PDFs</span>
              </div>
              <div className="check-row is-warn">
                <i className="ti ti-alert-triangle" />
                <span>
                  Dark mode reduces contrast on two legacy report templates
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="mb-4">
            <div className="outline-box">
              <div className="outline-box-head">
                <h6>Current preference</h6>
                <span className="meta-badge is-plain">Changed</span>
              </div>
              <div className="outline-box-body">
                <div className="option-row">
                  <span className="option-row-key">Value</span>
                  <span className="option-row-value">Light</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Default</span>
                  <span className="option-row-value">System</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Scope</span>
                  <span className="option-row-value">Your account</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Applies to</span>
                  <span className="option-row-value">Web and mobile</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Overridable</span>
                  <span className="option-row-value">Yes</span>
                  <span />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="outline-box">
              <div className="outline-box-head">
                <h6>Dependencies</h6>
                <span className="meta-badge is-plain">4</span>
              </div>
              <div className="outline-box-body">
                <div className="option-row">
                  <span className="option-row-key">High contrast</span>
                  <span className="option-row-value">Overrides this</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Reduce motion</span>
                  <span className="option-row-value">Independent</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Print layout</span>
                  <span className="option-row-value">Always light</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Accent colour</span>
                  <span className="option-row-value">Adjusts per mode</span>
                  <span />
                </div>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <div className="outline-box">
              <div className="outline-box-head">
                <h6>Related preferences</h6>
                <span className="meta-badge is-plain">5</span>
              </div>
              <div className="outline-box-body">
                <div className="option-row">
                  <span className="option-row-key">Accent colour</span>
                  <span className="option-row-value">Indigo</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Density</span>
                  <span className="option-row-value">Comfortable</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Rounded corners</span>
                  <span className="option-row-value">Soft</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Animation level</span>
                  <span className="option-row-value">Full</span>
                  <span />
                </div>
                <div className="option-row">
                  <span className="option-row-key">Compact mode</span>
                  <span className="option-row-value">Off</span>
                  <span />
                </div>
              </div>
            </div>
          </div>
          <div className="outline-box">
            <div className="outline-box-head">
              <h6>Audit history</h6>
              <span className="meta-badge is-plain">3 changes</span>
            </div>
            <div className="outline-box-body">
              <div className="audit-trail">
                <div className="audit-event is-done">
                  <div className="flex-fill overflow-hidden">
                    <p className="audit-event-title">Set to Light</p>
                    <p className="fs-12 text-muted mb-0">
                      System · 14 Jun 2024
                    </p>
                  </div>
                  <span className="reference-code flex-shrink-0">Light</span>
                </div>
                <div className="audit-event is-done">
                  <div className="flex-fill overflow-hidden">
                    <p className="audit-event-title">Changed to System</p>
                    <p className="fs-12 text-muted mb-0">You · 02 Feb 2026</p>
                  </div>
                  <span className="reference-code flex-shrink-0">System</span>
                </div>
                <div className="audit-event is-now">
                  <div className="flex-fill overflow-hidden">
                    <p className="audit-event-title">Changed back to Light</p>
                    <p className="fs-12 text-muted mb-0">You · Today, 11:20</p>
                  </div>
                  <span className="reference-code flex-shrink-0">Light</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="offcanvas-footer">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
        <p className="fs-12 text-muted mb-0">
          <i className="ti ti-info-circle me-1" />
          Preferences apply to your account only. They never change what other
          users see.
        </p>
        <div className="d-flex flex-wrap gap-2">
          <a
            href="javascript:void(0);"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#restore_defaults"
          >
            <i className="ti ti-rotate me-1" />
            Restore default
          </a>
          <a
            href="javascript:void(0);"
            className="btn btn-primary d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#edit_preferences"
          >
            <i className="ti ti-device-floppy me-1" />
            Save
          </a>
        </div>
      </div>
    </div>
  </div>
  {/* /Preference Detail */}
  {/* Save Preferences */}
  <div className="modal fade settings-modal" id="edit_preferences">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-device-floppy" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Save Preferences</h5>
              <p className="fs-12 text-muted mb-0">
                Applies to your account on every device
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="apply-to">
                  Apply to
                </label>
                <select className="form-select" id="apply-to">
                  <option>This account, all devices</option>
                  <option>This device only</option>
                  <option>This account and set as my default</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="when-applied">
                  When applied
                </label>
                <select className="form-select" id="when-applied">
                  <option>Immediately</option>
                  <option>On next sign-in</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="spSync"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="spSync">
                    Keep preferences in sync across devices
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="spNotify"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="spNotify">
                    Tell me if an administrator changes a locked setting
                  </label>
                </div>
              </div>
              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="note-for-the-audit-record"
                >
                  Note for the audit record
                </label>
                <textarea
                  rows={2}
                  className="form-control"
                  id="note-for-the-audit-record"
                  defaultValue={
                    "Enabled quiet hours and turned on the command palette."
                  }
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-device-floppy me-1" />
              Save preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Save Preferences */}
  {/* Restore Defaults */}
  <div className="modal fade settings-modal" id="restore_defaults">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-rotate" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Restore Defaults</h5>
              <p className="fs-12 text-muted mb-0">
                Your current values are kept in the audit history
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="restore">
                  Restore
                </label>
                <select className="form-select" id="restore">
                  <option>Everything</option>
                  <option>Appearance only</option>
                  <option>Notifications only</option>
                  <option>Accessibility only</option>
                  <option>Privacy and security only</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="restore-to">
                  Restore to
                </label>
                <select className="form-select" id="restore-to">
                  <option>System defaults</option>
                  <option>My last saved set</option>
                  <option>The organisation baseline</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="rdKeepA11y"
                    defaultChecked
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="rdKeepA11y"
                  >
                    Keep my accessibility aids as they are
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="rdKeepLang"
                    defaultChecked
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="rdKeepLang"
                  >
                    Keep language and region
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="rdConfirm"
                  />
                  <label className="form-check-label fs-13" htmlFor="rdConfirm">
                    I understand this replaces my current settings
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-rotate me-1" />
              Restore defaults
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Restore Defaults */}
  {/* Import Preferences */}
  <div className="modal fade settings-modal" id="import_preferences">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-upload" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Import Preferences</h5>
              <p className="fs-12 text-muted mb-0">
                Bring settings across from another account or device
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label">Preferences file</label>
                <a href="javascript:void(0);" className="inline-drop">
                  <i className="ti ti-cloud-upload" />
                  <span className="fs-13 fw-medium text-dark">
                    Drop a file here or browse
                  </span>
                  <span className="fs-12 text-muted">
                    JSON exported from this platform · up to 1 MB
                  </span>
                </a>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="on-conflict">
                  On conflict
                </label>
                <select className="form-select" id="on-conflict">
                  <option>Keep my current value</option>
                  <option>Use the imported value</option>
                  <option>Ask me for each</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="import">
                  Import
                </label>
                <select className="form-select" id="import">
                  <option>Everything in the file</option>
                  <option>Appearance only</option>
                  <option>Everything except security</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="ipA11y"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="ipA11y">
                    Include accessibility aids
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="ipSecurity"
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="ipSecurity"
                  >
                    Include privacy and security settings
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-upload me-1" />
              Import
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Import Preferences */}
  {/* Export Preferences */}
  <div className="modal fade settings-modal" id="export_preferences">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-download" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Export Preferences</h5>
              <p className="fs-12 text-muted mb-0">
                A portable copy of everything on this page
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="contents">
                  Contents
                </label>
                <select className="form-select" id="contents">
                  <option>All preferences</option>
                  <option>Appearance only</option>
                  <option>Accessibility only</option>
                  <option>Audit history only</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="format">
                  Format
                </label>
                <select className="form-select" id="format">
                  <option>JSON</option>
                  <option>PDF summary</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="deliver-to">
                  Deliver to
                </label>
                <select className="form-select" id="deliver-to">
                  <option>Download</option>
                  <option>Email to me</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="epAudit"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="epAudit">
                    Include the audit history
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="epSecrets"
                  />
                  <label className="form-check-label fs-13" htmlFor="epSecrets">
                    Include privacy and security values
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-download me-1" />
              Export
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Export Preferences */}
  {/* Reset Category */}
  <div className="modal fade settings-modal" id="reset_category">
    <div className="modal-dialog modal-dialog-centered modal-md">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-refresh" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Reset Category</h5>
              <p className="fs-12 text-muted mb-0">
                Only the section you choose is affected
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="section">
                  Section
                </label>
                <select className="form-select" id="section">
                  <option>General</option>
                  <option>Appearance</option>
                  <option>Dashboard</option>
                  <option>Notifications</option>
                  <option>Accessibility</option>
                  <option>Language &amp; Region</option>
                  <option>Productivity</option>
                  <option>Privacy &amp; Security</option>
                  <option>System defaults</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="reset-to">
                  Reset to
                </label>
                <select className="form-select" id="reset-to">
                  <option>System defaults</option>
                  <option>Organisation baseline</option>
                </select>
              </div>
              <div className="col-12">
                <label
                  className="form-label"
                  htmlFor="reason-for-the-audit-record"
                >
                  Reason for the audit record
                </label>
                <textarea
                  rows={2}
                  className="form-control"
                  id="reason-for-the-audit-record"
                  defaultValue={
                    "Reverting appearance changes ahead of the accessibility review."
                  }
                />
              </div>
              <div className="col-12">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="rcConfirm"
                  />
                  <label className="form-check-label fs-13" htmlFor="rcConfirm">
                    I understand this cannot be undone
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-refresh me-1" />
              Reset section
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Reset Category */}
  {/* Configure Notifications */}
  <div className="modal fade settings-modal" id="configure_notifications">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-bell" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Configure Notifications</h5>
              <p className="fs-12 text-muted mb-0">
                Set rules per module rather than globally
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="module">
                  Module
                </label>
                <select className="form-select" id="module">
                  <option>All modules</option>
                  <option>Attendance</option>
                  <option>Fees</option>
                  <option>Examinations</option>
                  <option>Library</option>
                  <option>Transport</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <select className="form-select" id="email">
                  <option>Daily digest</option>
                  <option>Immediately</option>
                  <option>Off</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="sms">
                  SMS
                </label>
                <select className="form-select" id="sms">
                  <option>Critical only</option>
                  <option>Off</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="push">
                  Push
                </label>
                <select className="form-select" id="push">
                  <option>All priorities</option>
                  <option>High and above</option>
                  <option>Off</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="quiet-hours-from">
                  Quiet hours from
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="21:00"
                  id="quiet-hours-from"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="quiet-hours-until">
                  Quiet hours until
                </label>
                <input
                  type="text"
                  className="form-control"
                  defaultValue="07:00"
                  id="quiet-hours-until"
                />
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="cnEmergency"
                    defaultChecked
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="cnEmergency"
                  >
                    Emergency alerts ignore quiet hours
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="cnMention"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="cnMention">
                    Always notify me when I am mentioned
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-bell me-1" />
              Save rules
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Configure Notifications */}
  {/* Appearance Settings */}
  <div className="modal fade settings-modal" id="appearance_settings">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-palette" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Appearance Settings</h5>
              <p className="fs-12 text-muted mb-0">
                Finer control than the main panel offers
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="theme-mode">
                  Theme mode
                </label>
                <select className="form-select" id="theme-mode">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="accent-colour">
                  Accent colour
                </label>
                <select className="form-select" id="accent-colour">
                  <option>Indigo</option>
                  <option>Teal</option>
                  <option>Green</option>
                  <option>Amber</option>
                  <option>Red</option>
                  <option>Purple</option>
                  <option>Pink</option>
                  <option>Ink</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="font-size">
                  Font size
                </label>
                <select className="form-select" id="font-size">
                  <option>Small</option>
                  <option>Default</option>
                  <option>Large</option>
                  <option>Largest</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="density">
                  Density
                </label>
                <select className="form-select" id="density">
                  <option>Comfortable</option>
                  <option>Cosy</option>
                  <option>Compact</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="corner-radius">
                  Corner radius
                </label>
                <select className="form-select" id="corner-radius">
                  <option>Square</option>
                  <option>Soft</option>
                  <option>Round</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="animation">
                  Animation
                </label>
                <select className="form-select" id="animation">
                  <option>Full</option>
                  <option>Reduced</option>
                  <option>None</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="asDarkPrint"
                    defaultChecked
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="asDarkPrint"
                  >
                    Keep printed pages light regardless of theme
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="asAutoDark"
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="asAutoDark"
                  >
                    Switch to dark automatically after sunset
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-palette me-1" />
              Apply appearance
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Appearance Settings */}
  {/* Privacy Settings */}
  <div className="modal fade settings-modal" id="privacy_settings">
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex align-items-center gap-3">
            <span className="option-card-icon">
              <i className="ti ti-shield-lock" />
            </span>
            <div>
              <h5 className="modal-title mb-0">Privacy Settings</h5>
              <p className="fs-12 text-muted mb-0">
                What is recorded, and what is visible on screen
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i className="ti ti-x" />
          </button>
        </div>
        <form action="preferences.html">
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label" htmlFor="auto-logout">
                  Auto logout
                </label>
                <select className="form-select" id="auto-logout">
                  <option>After 30 minutes</option>
                  <option>After 1 hour</option>
                  <option>After 4 hours</option>
                  <option>Never</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="two-factor-prompt">
                  Two-factor prompt
                </label>
                <select className="form-select" id="two-factor-prompt">
                  <option>Every 30 days</option>
                  <option>Every 7 days</option>
                  <option>Every sign-in</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="activity-tracking">
                  Activity tracking
                </label>
                <select className="form-select" id="activity-tracking">
                  <option>Keep my own history</option>
                  <option>Keep for 30 days</option>
                  <option>Do not record</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="privacy-mode">
                  Privacy mode
                </label>
                <select className="form-select" id="privacy-mode">
                  <option>Off</option>
                  <option>Blur names</option>
                  <option>Blur names and photographs</option>
                </select>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="psLogin"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="psLogin">
                    Email me when a new device signs in
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="psAlerts"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="psAlerts">
                    Notify me about unusual account activity
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="psRemember"
                    defaultChecked
                  />
                  <label
                    className="form-check-label fs-13"
                    htmlFor="psRemember"
                  >
                    Remember this device for two-factor
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="psClear"
                  />
                  <label className="form-check-label fs-13" htmlFor="psClear">
                    Clear local cache when I sign out
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <a
              href="javascript:void(0);"
              className="btn btn-light me-2"
              data-bs-dismiss="modal"
            >
              Cancel
            </a>
            <button
              type="submit"
              className="btn btn-primary d-inline-flex align-items-center"
            >
              <i className="ti ti-shield-lock me-1" />
              Save privacy settings
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Privacy Settings */}
</>

  )
}

export default PreferencesModal