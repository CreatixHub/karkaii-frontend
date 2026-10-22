
const CustomFieldsModal = () => {
  return (
    <>
  {/* ===================== REUSABLE FIELD CONFIGURATION WORKSPACE ===================== */}
  <div
    className="offcanvas offcanvas-end field-detail-panel"
    tabIndex={-1}
    id="cfx_workspace"
    aria-labelledby="cfx_workspace_title"
    role="region"
  >
    <div className="offcanvas-header">
      <span className="field-glyph">
        <i className="ti ti-chevron-down" />
      </span>
      <div className="flex-fill">
        <h3
          className="field-detail-title fs-16 fw-medium"
          id="cfx_workspace_title"
        >
          Blood Group
        </h3>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <span className="field-key">student.blood_group</span>
          <span className="type">
            <i className="ti ti-chevron-down" />
            Dropdown
          </span>
          <span className="field-status-badge is-required">Required</span>
          <span className="field-status-badge is-published">Published</span>
        </div>
      </div>
      <div className="d-inline-flex gap-2 align-items-center">
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#cfx_duplicate"
        >
          <i className="ti ti-copy me-1" />
          Duplicate
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm d-inline-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#cfx_publish"
        >
          <i className="ti ti-rocket me-1" />
          Publish
        </button>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        />
      </div>
    </div>
    <div className="offcanvas-body">
      <ul className="nav segment mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="cfxoc-t1"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p1"
            type="button"
            role="tab"
            aria-controls="cfxoc-p1"
            aria-selected="true"
          >
            Details
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cfxoc-t2"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p2"
            type="button"
            role="tab"
            aria-controls="cfxoc-p2"
            aria-selected="false"
          >
            Validation
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cfxoc-t3"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p3"
            type="button"
            role="tab"
            aria-controls="cfxoc-p3"
            aria-selected="false"
          >
            Dependencies
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cfxoc-t4"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p4"
            type="button"
            role="tab"
            aria-controls="cfxoc-p4"
            aria-selected="false"
          >
            Modules
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cfxoc-t5"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p5"
            type="button"
            role="tab"
            aria-controls="cfxoc-p5"
            aria-selected="false"
          >
            Usage
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cfxoc-t6"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p6"
            type="button"
            role="tab"
            aria-controls="cfxoc-p6"
            aria-selected="false"
          >
            History
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="cfxoc-t7"
            data-bs-toggle="tab"
            data-bs-target="#cfxoc-p7"
            type="button"
            role="tab"
            aria-controls="cfxoc-p7"
            aria-selected="false"
          >
            Related
          </button>
        </li>
      </ul>
      <div className="tab-content">
        {/* Details */}
        <div
          className="tab-pane fade show active"
          id="cfxoc-p1"
          role="tabpanel"
          aria-labelledby="cfxoc-t1"
          tabIndex={0}
        >
          <div className="row g-4">
            <div className="col-12 col-xxl-7">
              <div className="field-panel">
                <div className="field-panel-header">
                  <span className="field-panel-icon">
                    <i className="ti ti-info-circle" />
                  </span>
                  <div className="flex-fill">
                    <p className="field-panel-title">Field details</p>
                    <p>What the field is called and what it stores</p>
                  </div>
                </div>
                <div className="field-panel-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="cfx_oc_label">
                        Field label
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cfx_oc_label"
                        defaultValue="Blood Group"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="cfx_oc_key">
                        Machine name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cfx_oc_key"
                        defaultValue="student.blood_group"
                        readOnly
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="cfx_oc_type">
                        Field type
                      </label>
                      <select className="form-select" id="cfx_oc_type">
                        <option>Dropdown</option>
                        <option>Radio Button</option>
                        <option>Text</option>
                        <option>Autocomplete</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="cfx_oc_group">
                        Field group
                      </label>
                      <select className="form-select" id="cfx_oc_group">
                        <option>Identity</option>
                        <option>Guardian</option>
                        <option>Logistics</option>
                        <option>Consent</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label" htmlFor="cfx_oc_help">
                        Help text
                      </label>
                      <textarea
                        className="form-control"
                        id="cfx_oc_help"
                        rows={2}
                        defaultValue={
                          "Collected once at admission and shown on the medical record."
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="cfx_oc_place">
                        Placeholder
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cfx_oc_place"
                        defaultValue="Select blood group"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" htmlFor="cfx_oc_default">
                        Default value
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cfx_oc_default"
                        placeholder="No default"
                      />
                    </div>
                  </div>
                  <div className="field-info-row mt-3">
                    <div className="field-row-key">
                      Options<small>8 values, ordered as they appear</small>
                    </div>
                    <div className="field-row-value">
                      <span className="expression">A+</span>
                      <span className="expression">B+</span>
                      <span className="expression">O+</span>
                      <span className="expression">+5 more</span>
                    </div>
                  </div>
                </div>
                <div className="field-panel-footer">
                  <span>Edited 31 Jul 2026 by Ms. Latha Rao</span>
                  <button type="button" className="btn btn-sm btn-primary">
                    Save details
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 col-xxl-5">
              <div className="field-panel">
                <div className="field-panel-header">
                  <span className="field-panel-icon">
                    <i className="ti ti-device-desktop" />
                  </span>
                  <div className="flex-fill">
                    <p className="field-panel-title">Preview</p>
                    <p>As rendered on the Students form</p>
                  </div>
                </div>
                <div className="field-panel-body">
                  <div className="canvas">
                    <div className="preview">
                      <div className="preview-label">
                        Blood Group <span className="star">*</span>
                      </div>
                      <select
                        className="form-select"
                        aria-label="Blood group preview"
                      >
                        <option>Select blood group</option>
                        <option>A+</option>
                        <option>B+</option>
                        <option>O+</option>
                      </select>
                      <p className="preview-help">
                        Collected once at admission and shown on the medical
                        record.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="field-panel-footer">
                  <span>Desktop · Administrator</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_preview"
                  >
                    Full form
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Validation */}
        <div
          className="tab-pane fade"
          id="cfxoc-p2"
          role="tabpanel"
          aria-labelledby="cfxoc-t2"
          tabIndex={0}
        >
          <div className="row g-3">
            <div className="col-xxl-3 col-md-6">
              <div className="guard is-req">
                <span className="guard-icon">
                  <i className="ti ti-asterisk" />
                </span>
                <div className="flex-fill">
                  <p className="guard-title">Required</p>
                  <p>Enforced on save and on import.</p>
                  <span className="expression">
                    value <b>is not</b> empty
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-md-6">
              <div className="guard is-ok">
                <span className="guard-icon">
                  <i className="ti ti-list-check" />
                </span>
                <div className="flex-fill">
                  <p className="guard-title">Option list</p>
                  <p>Free text is rejected.</p>
                  <span className="expression">
                    value <b>in</b> 8 options
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-md-6">
              <div className="guard">
                <span className="guard-icon">
                  <i className="ti ti-lock-open" />
                </span>
                <div className="flex-fill">
                  <p className="guard-title">Editable after save</p>
                  <p>Medical staff and administrators only.</p>
                  <span className="expression">
                    roles <b>2</b>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-md-6">
              <div className="guard">
                <span className="guard-icon">
                  <i className="ti ti-fingerprint" />
                </span>
                <div className="flex-fill">
                  <p className="guard-title">Unique</p>
                  <p>Not applicable to this field.</p>
                  <span className="expression">
                    <b>off</b>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="field-panel">
                <div className="field-panel-header">
                  <span className="field-panel-icon">
                    <i className="ti ti-shield-check" />
                  </span>
                  <div className="flex-fill">
                    <p className="field-panel-title">Rule editor</p>
                    <p>Toggle what this field enforces</p>
                  </div>
                </div>
                <div className="field-panel-body">
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Required<small>Blocks save when empty</small>
                    </div>
                    <div className="field-row-value">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="cfx_v1"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="cfx_v1"
                        >
                          Required
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Read only
                      <small>Visible but never editable from the form</small>
                    </div>
                    <div className="field-row-value">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="cfx_v2"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="cfx_v2"
                        >
                          Read only
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Hidden<small>Stored and posted, never rendered</small>
                    </div>
                    <div className="field-row-value">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="cfx_v3"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="cfx_v3"
                        >
                          Hidden
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Sensitive
                      <small>Excluded from exports and AI context</small>
                    </div>
                    <div className="field-row-value">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="cfx_v4"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="cfx_v4"
                        >
                          Sensitive
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Regex pattern
                      <small>Leave blank for option-list fields</small>
                    </div>
                    <div className="field-row-value">
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="^[A-Z]{1,2}[+-]$"
                        aria-label="Regex pattern"
                      />
                    </div>
                  </div>
                </div>
                <div className="field-panel-footer">
                  <span>2 of 5 rules active</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_validation"
                  >
                    Open validation modal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Dependencies */}
        <div
          className="tab-pane fade"
          id="cfxoc-p3"
          role="tabpanel"
          aria-labelledby="cfxoc-t3"
          tabIndex={0}
        >
          <div className="row g-3">
            <div className="col-xxl-4 col-md-6">
              <div className="field-rule">
                <div className="rule-top">
                  <i className="ti ti-eye" />
                  <p className="rule-title">Visibility</p>
                  <span className="field-status-badge is-published">
                    Active
                  </span>
                </div>
                <div className="field-clause" data-kw="WHEN">
                  the form is Students or Medical
                </div>
                <div className="field-clause" data-kw="THEN">
                  show <code>blood_group</code>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-md-6">
              <div className="field-rule">
                <div className="rule-top">
                  <i className="ti ti-wand" />
                  <p className="rule-title">Auto population</p>
                  <span className="field-status-badge is-published">
                    Active
                  </span>
                </div>
                <div className="field-clause" data-kw="WHEN">
                  an admission is converted
                </div>
                <div className="field-clause" data-kw="THEN">
                  copy from <code>admission.blood_group</code>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-md-6">
              <div className="field-rule">
                <div className="rule-top">
                  <i className="ti ti-user-shield" />
                  <p className="rule-title">Role visibility</p>
                  <span className="field-status-badge is-warn">Restricted</span>
                </div>
                <div className="field-clause" data-kw="WHEN">
                  viewer role is Teacher
                </div>
                <div className="field-clause" data-kw="THEN">
                  read only, no edit
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="field-panel">
                <div className="field-panel-header">
                  <span className="field-panel-icon">
                    <i className="ti ti-binary-tree" />
                  </span>
                  <div className="flex-fill">
                    <p className="field-panel-title">
                      Fields that depend on this one
                    </p>
                    <p>Changing the type here would break them</p>
                  </div>
                </div>
                <div className="field-panel-body">
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Medical Alert Banner
                      <small>Reads the value to colour the banner</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-key">medical.alert_banner</span>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Donor Eligibility
                      <small>Calculated from group and age</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-key">medical.donor_eligible</span>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      ID Card Print
                      <small>Printed on the reverse of the card</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-key">student.id_card</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Module assignment */}
        <div
          className="tab-pane fade"
          id="cfxoc-p4"
          role="tabpanel"
          aria-labelledby="cfxoc-t4"
          tabIndex={0}
        >
          <div className="row g-3">
            <div className="col-12 col-xxl-8">
              <div className="field-panel">
                <div className="field-panel-header">
                  <span className="field-panel-icon">
                    <i className="ti ti-plug-connected" />
                  </span>
                  <div className="flex-fill">
                    <p className="field-panel-title">Module assignment</p>
                    <p>Where this field appears, and in which section</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="modal"
                    data-bs-target="#cfx_assign"
                  >
                    Assign
                  </button>
                </div>
                <div className="field-panel-body">
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Students<small>Identity section, position 4</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Medical<small>History section, position 1</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-status-badge is-required">
                        Required
                      </span>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Admissions<small>Applicant section, position 9</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-status-badge is-optional">
                        Optional
                      </span>
                      <span className="field-status-badge is-published">
                        Live
                      </span>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Hostel<small>Not assigned</small>
                    </div>
                    <div className="field-row-value">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#cfx_assign"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
                <div className="field-panel-footer">
                  <span>3 of 14 modules</span>
                  <span className="field-status-badge is-accent">
                    Shared field
                  </span>
                </div>
              </div>
            </div>
            <div className="col-12 col-xxl-4">
              <div className="field-panel">
                <div className="field-panel-header">
                  <span className="field-panel-icon">
                    <i className="ti ti-columns-3" />
                  </span>
                  <div className="flex-fill">
                    <p className="field-panel-title">Placement</p>
                    <p>Width and order on the Students form</p>
                  </div>
                </div>
                <div className="field-panel-body">
                  <span className="field-metric-label">Column span</span>
                  <div className="columns is-active mb-3">
                    <span />
                    <span />
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Position<small>Within the Identity section</small>
                    </div>
                    <div className="field-row-value">
                      <b>4 of 6</b>
                    </div>
                  </div>
                  <div className="field-info-row">
                    <div className="field-row-key">
                      Mobile<small>Always full width</small>
                    </div>
                    <div className="field-row-value">
                      <span className="field-status-badge">1 column</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Usage */}
        <div
          className="tab-pane fade"
          id="cfxoc-p5"
          role="tabpanel"
          aria-labelledby="cfxoc-t5"
          tabIndex={0}
        >
          <div className="row g-3">
            <div className="col-xxl-4 col-md-6">
              <div className="insight">
                <div className="insight-top">
                  <i className="ti ti-database" />
                  <p className="insight-title">Records carrying a value</p>
                </div>
                <div className="rank">
                  <span className="rank-name">Students</span>
                  <span className="rank-bar">
                    <span className="width-96" />
                  </span>
                  <span className="rank-v">1,284</span>
                </div>
                <div className="rank">
                  <span className="rank-name">Admissions</span>
                  <span className="rank-bar">
                    <span className="width-60" />
                  </span>
                  <span className="rank-v">412</span>
                </div>
                <div className="rank">
                  <span className="rank-name">Medical</span>
                  <span className="rank-bar">
                    <span className="width-88" />
                  </span>
                  <span className="rank-v">1,109</span>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-md-6">
              <div className="insight">
                <div className="insight-top">
                  <i className="ti ti-chart-dots" />
                  <p className="insight-title">Most common values</p>
                </div>
                <div className="rank">
                  <span className="rank-n">01</span>
                  <span className="rank-name">O+</span>
                  <span className="rank-bar">
                    <span className="width-84" />
                  </span>
                  <span className="rank-v">38%</span>
                </div>
                <div className="rank">
                  <span className="rank-n">02</span>
                  <span className="rank-name">B+</span>
                  <span className="rank-bar">
                    <span className="width-56" />
                  </span>
                  <span className="rank-v">26%</span>
                </div>
                <div className="rank">
                  <span className="rank-n">03</span>
                  <span className="rank-name">A+</span>
                  <span className="rank-bar">
                    <span className="width-44" />
                  </span>
                  <span className="rank-v">21%</span>
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-md-6">
              <div className="insight is-warn">
                <div className="insight-top">
                  <i className="ti ti-alert-circle" />
                  <p className="insight-title">Gaps</p>
                </div>
                <div className="rank">
                  <span className="rank-name">Blank on active students</span>
                  <span className="rank-v">63</span>
                </div>
                <div className="rank">
                  <span className="rank-name">Set to "Unknown"</span>
                  <span className="rank-v">28</span>
                </div>
                <div className="rank">
                  <span className="rank-name">Never edited since import</span>
                  <span className="rank-v">311</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* History */}
        <div
          className="tab-pane fade"
          id="cfxoc-p6"
          role="tabpanel"
          aria-labelledby="cfxoc-t6"
          tabIndex={0}
        >
          <div className="field-panel">
            <div className="field-panel-header">
              <span className="field-panel-icon">
                <i className="ti ti-history" />
              </span>
              <div className="flex-fill">
                <p className="field-panel-title">Audit history</p>
                <p>Every change to this field</p>
              </div>
            </div>
            <div className="field-panel-body">
              <ul className="flow">
                <li className="flow-item is-done">
                  <p className="flow-title">Field created</p>
                  <p>Ms. Latha Rao</p>
                  <time dateTime="2026-06-14T10:24">14 Jun 2026 · 10:24</time>
                </li>
                <li className="flow-item is-done">
                  <p className="flow-title">Validation added</p>
                  <p>Marked required; restricted to the option list.</p>
                  <time dateTime="2026-06-15T09:02">15 Jun 2026 · 09:02</time>
                </li>
                <li className="flow-item is-done">
                  <p className="flow-title">Assigned to Students and Medical</p>
                  <p>Placed in the Identity group.</p>
                  <time dateTime="2026-06-18T16:40">18 Jun 2026 · 16:40</time>
                </li>
                <li className="flow-item is-done">
                  <p className="flow-title">Published</p>
                  <p>1,284 records backfilled from admissions.</p>
                  <time dateTime="2026-06-20T08:15">20 Jun 2026 · 08:15</time>
                </li>
                <li className="flow-item is-current">
                  <p className="flow-title">Updated</p>
                  <p>Option "Unknown" added; help text rewritten.</p>
                  <time dateTime="2026-07-31T12:07">31 Jul 2026 · 12:07</time>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Related */}
        <div
          className="tab-pane fade"
          id="cfxoc-p7"
          role="tabpanel"
          aria-labelledby="cfxoc-t7"
          tabIndex={0}
        >
          <div className="row g-3">
            <div className="col-xxl-3 col-md-6">
              <div className="field">
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
                </div>
                <div className="field-footer">
                  <span>Same group</span>
                  <span>
                    <i className="ti ti-arrow-right" />
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-md-6">
              <div className="field">
                <div className="field-header">
                  <span className="field-glyph">
                    <i className="ti ti-phone" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="field-name">Emergency Contact</p>
                    <span className="field-key">student.emergency_contact</span>
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
                </div>
                <div className="field-footer">
                  <span>Same section</span>
                  <span>
                    <i className="ti ti-arrow-right" />
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-md-6">
              <div className="field">
                <div className="field-header">
                  <span className="field-glyph">
                    <i className="ti ti-calendar" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="field-name">Last Vaccination</p>
                    <span className="field-key">medical.last_vaccination</span>
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
                </div>
                <div className="field-footer">
                  <span>Same module</span>
                  <span>
                    <i className="ti ti-arrow-right" />
                  </span>
                </div>
              </div>
            </div>
            <div className="col-xxl-3 col-md-6">
              <div className="field">
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
                </div>
                <div className="field-footer">
                  <span>Same module</span>
                  <span>
                    <i className="ti ti-arrow-right" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* /Field Configuration Workspace */}
  {/* Create Custom Field */}
  <div
    className="modal fade"
    id="cfx_create_field"
    tabIndex={-1}
    aria-labelledby="cfx_create_field_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-plus" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_create_field_t">
              Create custom field
            </h4>
            <p className="fs-13 text-muted mb-0">
              A field is defined once and reused. Pick the narrowest type that
              fits — widening later is allowed, narrowing is not.
            </p>
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
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="cfx_nf_label">
                Field label
              </label>
              <input
                type="text"
                className="form-control"
                id="cfx_nf_label"
                placeholder="e.g. Guardian Occupation"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="cfx_nf_key">
                Machine name
              </label>
              <input
                type="text"
                className="form-control"
                id="cfx_nf_key"
                placeholder="student.guardian_occupation"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="cfx_nf_type">
                Field type
              </label>
              <select className="form-select" id="cfx_nf_type">
                <option>Text</option>
                <option>Textarea</option>
                <option>Number</option>
                <option>Email</option>
                <option>Phone</option>
                <option>Date</option>
                <option>Currency</option>
                <option>Dropdown</option>
                <option>Multi Select</option>
                <option>File Upload</option>
                <option>Signature</option>
                <option>JSON</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="cfx_nf_module">
                Module
              </label>
              <select className="form-select" id="cfx_nf_module">
                <option>Students</option>
                <option>Admissions</option>
                <option>Teachers</option>
                <option>Parents</option>
                <option>HR</option>
                <option>Fees</option>
                <option>Library</option>
                <option>Transport</option>
                <option>Hostel</option>
                <option>Inventory</option>
                <option>Medical</option>
                <option>AI Modules</option>
                <option>System</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="cfx_nf_group">
                Field group
              </label>
              <select className="form-select" id="cfx_nf_group">
                <option>Identity</option>
                <option>Guardian</option>
                <option>Logistics</option>
                <option>Consent</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="cfx_nf_place">
                Placeholder
              </label>
              <input
                type="text"
                className="form-control"
                id="cfx_nf_place"
                placeholder="e.g. Civil engineer"
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="cfx_nf_help">
                Help text
              </label>
              <textarea
                className="form-control"
                id="cfx_nf_help"
                rows={2}
                placeholder="One sentence that saves a phone call."
                defaultValue={""}
              />
            </div>
            <div className="col-12">
              <div className="field-info-row">
                <div className="field-row-key">
                  Required
                  <small>Blocks save when empty, from publish onward</small>
                </div>
                <div className="field-row-value">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="cfx_nf_req"
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="cfx_nf_req"
                    >
                      Required
                    </label>
                  </div>
                </div>
              </div>
              <div className="field-info-row">
                <div className="field-row-key">
                  Publish immediately
                  <small>Otherwise it is saved as a draft</small>
                </div>
                <div className="field-row-value">
                  <div className="form-check form-switch mb-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="cfx_nf_pub"
                    />
                    <label
                      className="form-check-label visually-hidden"
                      htmlFor="cfx_nf_pub"
                    >
                      Publish immediately
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Create field
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Create Custom Field */}
  {/* Create Field Group */}
  <div
    className="modal fade"
    id="cfx_create_group"
    tabIndex={-1}
    aria-labelledby="cfx_create_group_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-layout-grid-add" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_create_group_t">
              Create field group
            </h4>
            <p className="fs-13 text-muted mb-0">
              A group is a bundle of related fields that can be dropped onto any
              form at once.
            </p>
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
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_ng_name">
              Group name
            </label>
            <input
              type="text"
              className="form-control"
              id="cfx_ng_name"
              placeholder="e.g. Guardian details"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_ng_desc">
              Description
            </label>
            <textarea
              className="form-control"
              id="cfx_ng_desc"
              rows={2}
              placeholder="What belongs in this group, and what does not."
              defaultValue={""}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_ng_fields">
              Fields
            </label>
            <select
              className="form-select select2"
              id="cfx_ng_fields"
              multiple
              defaultValue={["Guardian Occupation", "Annual Family Income"]}
            >
              <option>Guardian Occupation</option>
              <option>Annual Family Income</option>
              <option>Alternate Contact</option>
              <option>Workplace Address</option>
              <option>Relationship</option>
            </select>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              Collapsible<small>Group starts folded on long forms</small>
            </div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_ng_col"
                  defaultChecked
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_ng_col"
                >
                  Collapsible
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Create group
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Create Field Group */}
  {/* Configure Validation */}
  <div
    className="modal fade"
    id="cfx_validation"
    tabIndex={-1}
    aria-labelledby="cfx_validation_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-shield-check" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_validation_t">
              Configure validation
            </h4>
            <p className="fs-13 text-muted mb-0">
              Rules apply to{" "}
              <span className="field-key">student.blood_group</span> on every
              module it is bound to.
            </p>
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
        <div className="modal-body">
          <div className="field-info-row">
            <div className="field-row-key">Required</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_cv1"
                  defaultChecked
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_cv1"
                >
                  Required
                </label>
              </div>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Minimum length</div>
            <div className="field-row-value">
              <input
                type="number"
                className="form-control form-control-sm"
                defaultValue={2}
                aria-label="Minimum length"
              />
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Maximum length</div>
            <div className="field-row-value">
              <input
                type="number"
                className="form-control form-control-sm"
                defaultValue={3}
                aria-label="Maximum length"
              />
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Regex pattern</div>
            <div className="field-row-value">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="^[A-Z]{1,2}[+-]$"
                aria-label="Regex pattern"
              />
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Unique across records</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_cv2"
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_cv2"
                >
                  Unique
                </label>
              </div>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Read only</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_cv3"
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_cv3"
                >
                  Read only
                </label>
              </div>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Conditional logic</div>
            <div className="field-row-value">
              <select className="form-select" aria-label="Conditional logic">
                <option>Always required</option>
                <option>Required when Transport = Yes</option>
                <option>Required for boarders only</option>
              </select>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Default value</div>
            <div className="field-row-value">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="No default"
                aria-label="Default value"
              />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save rules
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Configure Validation */}
  {/* Assign Module */}
  <div
    className="modal fade"
    id="cfx_assign"
    tabIndex={-1}
    aria-labelledby="cfx_assign_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-plug-connected" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_assign_t">
              Assign to module
            </h4>
            <p className="fs-13 text-muted mb-0">
              The same field on two modules stays one definition — edit it once,
              both forms follow.
            </p>
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
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_as_field">
              Field
            </label>
            <select className="form-select" id="cfx_as_field">
              <option>Blood Group</option>
              <option>Guardian Occupation</option>
              <option>Emergency Contact</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_as_module">
              Module
            </label>
            <select className="form-select" id="cfx_as_module">
              <option>Hostel</option>
              <option>Transport</option>
              <option>Library</option>
              <option>Inventory</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_as_section">
              Section
            </label>
            <select className="form-select" id="cfx_as_section">
              <option>Room</option>
              <option>Warden</option>
              <option>Guardian</option>
            </select>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              Required on this module
              <small>Can differ from the other modules</small>
            </div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_as_req"
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_as_req"
                >
                  Required here
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Assign field
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Assign Module */}
  {/* Duplicate Field */}
  <div
    className="modal fade"
    id="cfx_duplicate"
    tabIndex={-1}
    aria-labelledby="cfx_duplicate_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-copy" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_duplicate_t">
              Duplicate field
            </h4>
            <p className="fs-13 text-muted mb-0">
              Copies the type, validation and help text. Stored values are not
              copied.
            </p>
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
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_dp_label">
              New label
            </label>
            <input
              type="text"
              className="form-control"
              id="cfx_dp_label"
              defaultValue="Blood Group (copy)"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="cfx_dp_key">
              New machine name
            </label>
            <input
              type="text"
              className="form-control"
              id="cfx_dp_key"
              defaultValue="student.blood_group_copy"
            />
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Copy validation rules</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_dp_v"
                  defaultChecked
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_dp_v"
                >
                  Copy validation
                </label>
              </div>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Copy module assignments</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_dp_m"
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_dp_m"
                >
                  Copy assignments
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Duplicate
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Duplicate Field */}
  {/* Preview Form */}
  <div
    className="modal fade"
    id="cfx_preview"
    tabIndex={-1}
    aria-labelledby="cfx_preview_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-lg modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-eye" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_preview_t">
              Form preview
            </h4>
            <p className="fs-13 text-muted mb-0">
              Students · Identity section, rendered as an Administrator.
            </p>
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
        <div className="modal-body">
          <div className="canvas">
            <div className="preview">
              <div className="preview-label">
                Blood Group <span className="star">*</span>
              </div>
              <select className="form-select" aria-label="Blood group">
                <option>Select blood group</option>
                <option>A+</option>
                <option>B+</option>
                <option>O+</option>
              </select>
              <p className="preview-help">
                Collected once at admission and shown on the medical record.
              </p>
            </div>
            <div className="preview">
              <div className="preview-label">
                Emergency Contact <span className="star">*</span>
              </div>
              <input
                type="tel"
                className="form-control"
                placeholder="+91 98765 43210"
                aria-label="Emergency contact"
              />
              <p className="preview-help">
                Reached first if the primary guardian does not answer.
              </p>
            </div>
            <div className="preview">
              <div className="preview-label">House / Team</div>
              <div className="d-flex gap-3 flex-wrap">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cfx_pv_house"
                    id="cfx_pv_h1"
                    defaultChecked
                  />
                  <label className="form-check-label fs-13" htmlFor="cfx_pv_h1">
                    Ruby
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cfx_pv_house"
                    id="cfx_pv_h2"
                  />
                  <label className="form-check-label fs-13" htmlFor="cfx_pv_h2">
                    Emerald
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="cfx_pv_house"
                    id="cfx_pv_h3"
                  />
                  <label className="form-check-label fs-13" htmlFor="cfx_pv_h3">
                    Sapphire
                  </label>
                </div>
              </div>
            </div>
            <div className="preview">
              <div className="preview-label">
                Photo Consent <span className="star">*</span>
              </div>
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_pv_pc"
                  defaultChecked
                />
                <label className="form-check-label fs-13" htmlFor="cfx_pv_pc">
                  Photographs may be used in school publications
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <span className="fs-12 text-muted me-auto">
            4 of 32 fields · desktop layout
          </span>
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Preview Form */}
  {/* Import Fields */}
  <div
    className="modal fade"
    id="cfx_import"
    tabIndex={-1}
    aria-labelledby="cfx_import_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-upload" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_import_t">
              Import fields
            </h4>
            <p className="fs-13 text-muted mb-0">
              Definitions only — no record data is read from the file.
            </p>
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
        <div className="modal-body">
          <div className="empty-state mb-3">
            <i className="ti ti-file-upload" />
            <p className="empty-title">Drop a configuration file</p>
            <p>
              JSON or CSV, up to 2 MB. Exported files from another branch work
              as-is.
            </p>
            <input
              type="file"
              className="form-control"
              aria-label="Configuration file"
            />
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              On name collision<small>When a field already exists</small>
            </div>
            <div className="field-row-value">
              <select className="form-select" aria-label="Collision handling">
                <option>Skip</option>
                <option>Overwrite</option>
                <option>Import as copy</option>
              </select>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              Import as drafts<small>Review before anything goes live</small>
            </div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_im_draft"
                  defaultChecked
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_im_draft"
                >
                  Import as drafts
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Import Fields */}
  {/* Export Configuration */}
  <div
    className="modal fade"
    id="cfx_export"
    tabIndex={-1}
    aria-labelledby="cfx_export_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-download" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_export_t">
              Export configuration
            </h4>
            <p className="fs-13 text-muted mb-0">
              A portable copy of the schema, safe to hand to another branch.
            </p>
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
        <div className="modal-body">
          <div className="field-info-row">
            <div className="field-row-key">Scope</div>
            <div className="field-row-value">
              <select className="form-select" aria-label="Export scope">
                <option>All modules</option>
                <option>Students only</option>
                <option>Selected modules</option>
              </select>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Format</div>
            <div className="field-row-value">
              <select className="form-select" aria-label="Export format">
                <option>JSON</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Include validation rules</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_ex_v"
                  defaultChecked
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_ex_v"
                >
                  Include validation
                </label>
              </div>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">Include archived fields</div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_ex_a"
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_ex_a"
                >
                  Include archived
                </label>
              </div>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              Include audit trail<small>Adds roughly 4 MB</small>
            </div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_ex_h"
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_ex_h"
                >
                  Include audit trail
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Export Configuration */}
  {/* Publish Changes */}
  <div
    className="modal fade"
    id="cfx_publish"
    tabIndex={-1}
    aria-labelledby="cfx_publish_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon">
            <i className="ti ti-rocket" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_publish_t">
              Publish changes
            </h4>
            <p className="fs-13 text-muted mb-0">
              16 drafts across 4 modules go live at once. Required rules apply
              to new saves only.
            </p>
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
        <div className="modal-body">
          <div className="field-info-row">
            <div className="field-row-key">
              Admissions<small>Parent Signature, Entrance Test Date</small>
            </div>
            <div className="field-row-value">
              <span className="field-status-badge is-draft">2</span>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              HR<small>Background Check</small>
            </div>
            <div className="field-row-value">
              <span className="field-status-badge is-draft">1</span>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              AI Modules<small>Device Metadata, Risk Override Reason</small>
            </div>
            <div className="field-row-value">
              <span className="field-status-badge is-draft">2</span>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              Students<small>Locker Preference and 10 others</small>
            </div>
            <div className="field-row-value">
              <span className="field-status-badge is-draft">11</span>
            </div>
          </div>
          <div className="field-info-row">
            <div className="field-row-key">
              Notify form owners<small>One email per affected module</small>
            </div>
            <div className="field-row-value">
              <div className="form-check form-switch mb-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="cfx_pb_n"
                  defaultChecked
                />
                <label
                  className="form-check-label visually-hidden"
                  htmlFor="cfx_pb_n"
                >
                  Notify owners
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Publish 16 changes
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Publish Changes */}
  {/* Delete Field */}
  <div
    className="modal fade"
    id="cfx_delete"
    tabIndex={-1}
    aria-labelledby="cfx_delete_t"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header align-items-start gap-3">
          <span className="field-modal-icon is-stop">
            <i className="ti ti-trash" />
          </span>
          <div className="flex-fill">
            <h4 className="modal-title" id="cfx_delete_t">
              Delete field permanently
            </h4>
            <p className="fs-13 text-muted mb-0">
              This drops the stored column. Archiving keeps the values readable
              in reports — prefer it unless the field never held real data.
            </p>
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
        <div className="modal-body">
          <div className="guard is-req mb-3">
            <span className="guard-icon">
              <i className="ti ti-alert-triangle" />
            </span>
            <div className="flex-fill">
              <p className="guard-title">Former School Code</p>
              <p>
                0 stored values · archived 04 Mar 2026 · not referenced by any
                rule.
              </p>
            </div>
          </div>
          <label className="form-label" htmlFor="cfx_del_confirm">
            Type the machine name to confirm
          </label>
          <input
            type="text"
            className="form-control"
            id="cfx_del_confirm"
            placeholder="admission.former_school_code"
          />
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-light"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Delete Field */}
</>

  )
}

export default CustomFieldsModal