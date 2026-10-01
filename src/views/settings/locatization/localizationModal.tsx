
const LocalizationModal = () => {
  return (
    <>
  {/* ===================== REUSABLE LANGUAGE CONFIGURATION WORKSPACE ===================== */}
  <div
    className="offcanvas offcanvas-end lng-canvas"
    tabIndex={-1}
    id="lng_workspace"
    aria-labelledby="lng_workspace_label"
    role="region"
  >
    <div className="lng-canvas-head">
      <span className="lng-card-ic">
        <i className="ti ti-language" />
      </span>
      <div className="flex-fill overflow-hidden">
        <h3
          className="offcanvas-title mb-1 fs-16 fw-medium"
          id="lng_workspace_label"
        >
          Tamil — தமிழ்
        </h3>
        <p className="fs-12 text-muted mb-0">
          ta-IN · enabled · 71% translated · last import 28 Jul 2026 by R.
          Sharma
        </p>
      </div>
      <span className="lng-badge is-review">Needs update</span>
      <button
        type="button"
        className="btn-close ms-2"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
    </div>
    <div className="offcanvas-body lng-canvas-body">
      <div className="row g-4">
        <div className="col-xl-7">
          <div className="lng-sect">
            <h4 className="lng-sect-title fs-15 fw-medium">
              <i className="ti ti-file-description" />
              Language details
            </h4>
            <div className="lng-row">
              <div className="lng-row-key">Native name</div>
              <div className="lng-row-val">தமிழ்</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">English name</div>
              <div className="lng-row-val">Tamil</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">Locale code</div>
              <div className="lng-row-val">
                <span className="lng-code is-accent">ta-IN</span>
              </div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">Direction</div>
              <div className="lng-row-val">Left to right</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">Script</div>
              <div className="lng-row-val">Tamil</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">Added</div>
              <div className="lng-row-val">14 January 2026</div>
            </div>
          </div>
          <div className="lng-sect">
            <h5 className="lng-sect-title fs-15">
              <i className="ti ti-chart-bar" />
              Translation coverage
            </h5>
            <div className="lng-legend">
              <span>
                <i className="is-done" />
                Translated and approved
              </span>
              <span>
                <i className="is-review" />
                Awaiting review
              </span>
              <span>
                <i className="is-missing" />
                Missing
              </span>
            </div>
            <div className="mt-3">
              <div className="lng-cover">
                <div className="lng-cover-bar lng-p-71 lng-q-14 lng-r-15">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="lng-cover-meta">
                  <span>
                    <b>71%</b> translated
                  </span>
                  <span>
                    <b>3,422</b> of 4820 strings
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="lng-row">
                <div className="lng-row-key">Core System</div>
                <div className="lng-row-val">
                  <span className="lng-mono">94%</span>
                  <span className="lng-badge is-done">Complete</span>
                </div>
              </div>
              <div className="lng-row">
                <div className="lng-row-key">Academic Module</div>
                <div className="lng-row-val">
                  <span className="lng-mono">76%</span>
                  <span className="lng-badge is-review">In progress</span>
                </div>
              </div>
              <div className="lng-row">
                <div className="lng-row-key">Finance Module</div>
                <div className="lng-row-val">
                  <span className="lng-mono">88%</span>
                  <span className="lng-badge is-done">Complete</span>
                </div>
              </div>
              <div className="lng-row">
                <div className="lng-row-key">Notification Module</div>
                <div className="lng-row-val">
                  <span className="lng-mono">82%</span>
                  <span className="lng-badge is-review">In progress</span>
                </div>
              </div>
              <div className="lng-row">
                <div className="lng-row-key">AI Module</div>
                <div className="lng-row-val">
                  <span className="lng-mono">34%</span>
                  <span className="lng-badge is-missing">Needs work</span>
                </div>
              </div>
            </div>
          </div>
          <div className="lng-sect">
            <h6 className="lng-sect-title">
              <i className="ti ti-eye" />
              Preview
            </h6>
            <div className="lng-string">
              <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
                <span className="lng-key">
                  <i className="ti ti-key" />
                  fees.reminder.due
                </span>
              </div>
              <div className="lng-pair">
                <span className="lng-code">en-IN</span>
                <span className="lng-pair-val">
                  Fee of {"{"}amount{"}"} for {"{"}student{"}"} is due on {"{"}
                  date{"}"}.
                </span>
                <span className="lng-badge is-done">Source</span>
              </div>
              <div className="lng-pair">
                <span className="lng-code is-accent">ta-IN</span>
                <span className="lng-pair-val">
                  {"{"}student{"}"} அவர்கள் {"{"}amount{"}"} கட்டணம் {"{"}date
                  {"}"} அன்று நிலுவையில் ଢ଼ள்ளது.
                </span>
                <span className="lng-badge is-done">Approved</span>
              </div>
            </div>
            <p className="fs-12 text-muted mb-0 mt-2">
              Placeholders in braces are never translated. A pack that alters
              one is rejected on import.
            </p>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="lng-sect">
            <h6 className="lng-sect-title">
              <i className="ti ti-map-pin" />
              Regional configuration
            </h6>
            <div className="lng-row">
              <div className="lng-row-key">
                Region<small>Inherits from India</small>
              </div>
              <div className="lng-row-val">
                <span className="lng-code">IN</span>
              </div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">
                Date format<small>Same as the regional default</small>
              </div>
              <div className="lng-row-val">31 Jul 2026</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">
                Number grouping<small>Indian</small>
              </div>
              <div className="lng-row-val">1,28,400</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">
                Currency<small>Rupee symbol before the amount</small>
              </div>
              <div className="lng-row-val">₹12,400</div>
            </div>
            <div className="lng-row">
              <div className="lng-row-key">
                Overrides<small>None — follows the region exactly</small>
              </div>
              <div className="lng-row-val">
                <span className="lng-badge is-done">Inherit</span>
              </div>
            </div>
          </div>
          <div className="lng-sect">
            <h6 className="lng-sect-title">
              <i className="ti ti-circle-check" />
              Validation
            </h6>
            <div className="lng-check">
              <i className="ti ti-circle-check" />
              <div>
                Every placeholder matches the source string
                <span>
                  4,148 translated strings checked; none alters a brace.
                </span>
              </div>
            </div>
            <div className="lng-check">
              <i className="ti ti-circle-check" />
              <div>
                The script has a font
                <span>
                  Noto Sans Tamil, self-hosted, with a 6% size adjustment.
                </span>
              </div>
            </div>
            <div className="lng-check is-review">
              <i className="ti ti-alert-circle" />
              <div>
                675 strings await review
                <span>
                  Imported on 28 July. They are live only where approval before
                  publishing is off, which it is not.
                </span>
              </div>
            </div>
            <div className="lng-check is-missing">
              <i className="ti ti-circle-x" />
              <div>
                672 strings are missing
                <span>
                  Mostly the AI module and the newer academic screens. These
                  fall back to English.
                </span>
              </div>
            </div>
          </div>
          <div className="lng-sect">
            <h6 className="lng-sect-title">
              <i className="ti ti-hierarchy-2" />
              Dependencies
            </h6>
            <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
              <span className="badge-meta">
                <i className="ti ti-typography" />
                Noto Sans Tamil
              </span>
              <span className="badge-meta">
                <i className="ti ti-mail" />
                Email templates
              </span>
              <span className="badge-meta">
                <i className="ti ti-message" />
                SMS templates
              </span>
              <span className="badge-meta">
                <i className="ti ti-users" />
                Parent portal
              </span>
            </div>
            <p className="fs-12 text-muted mb-0">
              Disabling Tamil would move 584 families back to English at their
              next sign-in. Nothing is lost, but nobody is told, so it is worth
              a notice first.
            </p>
          </div>
          <div className="lng-sect">
            <h6 className="lng-sect-title">
              <i className="ti ti-file-search" />
              Audit history
            </h6>
            <div className="lng-audit">
              <div className="lng-audit-when">
                <strong>28 Jul 2026</strong>11:12
              </div>
              <div className="lng-audit-what">
                412 strings imported
                <span>R. Sharma · XLIFF · queued for review</span>
              </div>
            </div>
            <div className="lng-audit">
              <div className="lng-audit-when">
                <strong>12 Jun 2026</strong>15:30
              </div>
              <div className="lng-audit-what">
                Size adjustment set to +6%
                <span>IT · the script sat small at 14px</span>
              </div>
            </div>
            <div className="lng-audit">
              <div className="lng-audit-when">
                <strong>02 Apr 2026</strong>09:00
              </div>
              <div className="lng-audit-what">
                Enabled for the parent portal
                <span>Ms. Latha Rao · 64% at the time</span>
              </div>
            </div>
            <div className="lng-audit">
              <div className="lng-audit-when">
                <strong>14 Jan 2026</strong>11:00
              </div>
              <div className="lng-audit-what">
                Language added<span>Mr. R. Venkatesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="lng-card-foot justify-content-end">
      <button
        type="button"
        className="btn btn-outline-light bg-white"
        data-bs-dismiss="offcanvas"
      >
        Close
      </button>
      <button
        type="button"
        className="btn btn-light d-inline-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#lng_export"
      >
        <i className="ti ti-download me-1" />
        Export pack
      </button>
      <button
        type="button"
        className="btn btn-primary d-inline-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#lng_edit"
      >
        <i className="ti ti-device-floppy me-1" />
        Save changes
      </button>
    </div>
  </div>
  {/* /Reusable Language Configuration Workspace */}
  {/* Add language */}
  <div
    className="modal fade"
    id="lng_add"
    tabIndex={-1}
    aria-labelledby="lng_add_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-plus" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_add_l">
              Add language
            </h5>
            <p>Configured first, enabled later</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-7">
              <label className="form-label" htmlFor="a_lang">
                Language
              </label>
              <select className="form-select" id="a_lang">
                <option>Kannada — ಕನ್ನಡ</option>
                <option>Telugu — తెలుగు</option>
                <option>Bengali — বাংলা</option>
                <option>Marathi — मराठी</option>
                <option>Urdu — اردو</option>
              </select>
            </div>
            <div className="col-md-5">
              <label className="form-label" htmlFor="a_code">
                Locale code
              </label>
              <input
                type="text"
                className="form-control"
                id="a_code"
                defaultValue="kn-IN"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="a_dir">
                Direction
              </label>
              <select className="form-select" id="a_dir">
                <option>Left to right</option>
                <option>Right to left</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="a_font">
                Font for the script
              </label>
              <select className="form-select" id="a_font">
                <option>Noto Sans Kannada</option>
                <option>Use the default font</option>
              </select>
            </div>
          </div>
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="a_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="a_1">
              Create empty strings for all 4,820 keys
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="a_2" />
            <label className="form-check-label fs-13" htmlFor="a_2">
              Enable immediately{" "}
              <span className="text-muted">
                — a language at 0% shows English everywhere
              </span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Add language
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Add language */}
  {/* Edit language */}
  <div
    className="modal fade"
    id="lng_edit"
    tabIndex={-1}
    aria-labelledby="lng_edit_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-pencil" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_edit_l">
              Edit language
            </h5>
            <p>Tamil · ta-IN · enabled</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="e_nat">
                Native name
              </label>
              <input
                type="text"
                className="form-control"
                id="e_nat"
                defaultValue="தமிழ்"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="e_en">
                English name
              </label>
              <input
                type="text"
                className="form-control"
                id="e_en"
                defaultValue="Tamil"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="e_code">
                Locale code
              </label>
              <input
                type="text"
                className="form-control"
                id="e_code"
                defaultValue="ta-IN"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="e_font">
                Font
              </label>
              <select className="form-select" id="e_font">
                <option>Noto Sans Tamil</option>
                <option>Inter</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="e_adj">
                Size adjustment
              </label>
              <input
                type="text"
                className="form-control"
                id="e_adj"
                defaultValue="+6%"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="e_stat">
                Status
              </label>
              <select className="form-select" id="e_stat">
                <option>Enabled</option>
                <option>Disabled</option>
              </select>
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="e_1" />
            <label className="form-check-label fs-13" htmlFor="e_1">
              Set as the default language{" "}
              <span className="text-muted">
                — every user without a preference would move to Tamil
              </span>
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save language
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Edit language */}
  {/* Import language pack */}
  <div
    className="modal fade"
    id="lng_import"
    tabIndex={-1}
    aria-labelledby="lng_import_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-upload" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_import_l">
              Import language pack
            </h5>
            <p>Nothing goes live untouched</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="i_lang">
                Language
              </label>
              <select className="form-select" id="i_lang">
                <option>Tamil — ta-IN</option>
                <option>Hindi — hi-IN</option>
                <option>Malayalam — ml-IN</option>
                <option>Arabic — ar-AE</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="i_fmt">
                Format
              </label>
              <select className="form-select" id="i_fmt">
                <option>XLIFF 2.0</option>
                <option>JSON</option>
                <option>gettext PO</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="i_file">
                Pack file
              </label>
              <input type="file" className="form-control" id="i_file" />
            </div>
          </div>
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="i_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="i_1">
              Fill empty strings only — keep existing translations
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="i_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="i_2">
              Mark every imported string for review
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="i_3"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="i_3">
              Reject strings that alter a placeholder
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            A pack that changes{" "}
            <span className="lng-mono">
              {"{"}amount{"}"}
            </span>{" "}
            to something else would break the message at send time, so those
            rows are refused rather than imported.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Import pack
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Import language pack */}
  {/* Export language pack */}
  <div
    className="modal fade"
    id="lng_export"
    tabIndex={-1}
    aria-labelledby="lng_export_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-download" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_export_l">
              Export language pack
            </h5>
            <p>For a translator working outside the system</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="x_lang">
                Language
              </label>
              <select className="form-select" id="x_lang">
                <option>Tamil — ta-IN</option>
                <option>Hindi — hi-IN</option>
                <option>Malayalam — ml-IN</option>
                <option>All enabled languages</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="x_fmt">
                Format
              </label>
              <select className="form-select" id="x_fmt">
                <option>XLIFF 2.0</option>
                <option>JSON</option>
                <option>gettext PO</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <span className="lng-lbl mt-3">Include</span>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="x_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="x_1">
              Source English strings alongside each key
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="x_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="x_2">
              Missing strings only{" "}
              <span className="text-muted">— 672 rows instead of 4,820</span>
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="x_3"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="x_3">
              Module name as context
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="x_4" />
            <label className="form-check-label fs-13" htmlFor="x_4">
              Strings awaiting review
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Export pack
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Export language pack */}
  {/* Configure localization */}
  <div
    className="modal fade"
    id="lng_locale"
    tabIndex={-1}
    aria-labelledby="lng_locale_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-map-pin" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_locale_l">
              Configure localization
            </h5>
            <p>The region every format inherits from</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="l_country">
                Country
              </label>
              <select className="form-select" id="l_country">
                <option>India</option>
                <option>United Arab Emirates</option>
                <option>United Kingdom</option>
                <option>Singapore</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="l_tz">
                Timezone
              </label>
              <select className="form-select" id="l_tz">
                <option>Asia/Kolkata — GMT +5:30</option>
                <option>Asia/Dubai</option>
                <option>UTC</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="l_cur">
                Currency
              </label>
              <select className="form-select" id="l_cur">
                <option>INR — Indian Rupee</option>
                <option>AED — UAE Dirham</option>
                <option>USD — US Dollar</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="l_week">
                First day of week
              </label>
              <select className="form-select" id="l_week">
                <option>Monday</option>
                <option>Sunday</option>
                <option>Saturday</option>
              </select>
            </div>
          </div>
          <div className="lng-check is-review mt-3">
            <i className="ti ti-alert-circle" />
            <div>
              Changing the country resets every format rule
              <span>
                Dates, number grouping, currency symbol, week start and paper
                size all move to that country's defaults. Anything you have set
                by hand is overwritten.
              </span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Apply localization
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Configure localization */}
  {/* Edit regional settings */}
  <div
    className="modal fade"
    id="lng_region"
    tabIndex={-1}
    aria-labelledby="lng_region_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-world" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_region_l">
              Edit regional settings
            </h5>
            <p>Formats only — no language is affected</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label" htmlFor="r_date">
                Date format
              </label>
              <select className="form-select" id="r_date">
                <option>31 Jul 2026</option>
                <option>2026-07-31</option>
                <option>07/31/2026</option>
                <option>31/07/2026</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="r_time">
                Time format
              </label>
              <select className="form-select" id="r_time">
                <option>12-hour — 4:12 PM</option>
                <option>24-hour — 16:12</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="r_dec">
                Decimal separator
              </label>
              <select className="form-select" id="r_dec">
                <option>. full stop</option>
                <option>, comma</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="r_th">
                Thousands separator
              </label>
              <select className="form-select" id="r_th">
                <option>, comma</option>
                <option>. full stop</option>
                <option>space</option>
                <option>none</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="r_grp">
                Grouping
              </label>
              <select className="form-select" id="r_grp">
                <option>Indian — 1,28,400</option>
                <option>International — 128,400</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="r_paper">
                Paper size
              </label>
              <select className="form-select" id="r_paper">
                <option>A4</option>
                <option>Letter</option>
                <option>Legal</option>
              </select>
            </div>
          </div>
          <div className="lng-sample mt-3">
            <p className="lng-sample-name">Preview with these settings</p>
            <span className="lng-sample-out">
              31 Jul 2026, 4:12 PM · ₹1,28,400.50
            </span>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save regional settings
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Edit regional settings */}
  {/* Update translation */}
  <div
    className="modal fade"
    id="lng_translate"
    tabIndex={-1}
    aria-labelledby="lng_translate_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic">
            <i className="ti ti-file-text" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_translate_l">
              Update translation
            </h5>
            <p>fees.reminder.due · Academic module</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <span className="lng-key">
              <i className="ti ti-key" />
              fees.reminder.due
            </span>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="t_src">
              Source — English (India)
            </label>
            <textarea
              className="form-control"
              id="t_src"
              rows={2}
              readOnly
              defaultValue={"Fee of {amount} for {student} is due on {date}."}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="t_lang">
              Translate into
            </label>
            <select className="form-select" id="t_lang">
              <option>Tamil — ta-IN</option>
              <option>Hindi — hi-IN</option>
              <option>Malayalam — ml-IN</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="t_val">
              Translation
            </label>
            <textarea
              className="form-control"
              id="t_val"
              rows={3}
              defaultValue={
                "{student} அவர்கள் {amount} கட்டணம் {date} அன்று நிலுவையில் உள்ளது."
              }
            />
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="lng-badge is-done">
              <i className="ti ti-check" />
              Placeholders match
            </span>
            <span className="badge-meta">
              <i className="ti ti-ruler-measure" />
              142 characters — 1 SMS in Unicode would be 3
            </span>
          </div>
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="t_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="t_1">
              Mark as approved and publish
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-dismiss="modal"
          >
            Save translation
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Update translation */}
  {/* Restore defaults */}
  <div
    className="modal fade"
    id="lng_restore"
    tabIndex={-1}
    aria-labelledby="lng_restore_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="lng-card-head border-bottom">
          <span className="lng-card-ic is-missing">
            <i className="ti ti-rotate-2" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="lng-card-title mb-0" id="lng_restore_l">
              Restore defaults
            </h5>
            <p>Regional formats only</p>
          </div>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          />
        </div>
        <div className="modal-body">
          <p className="fs-13 mb-3">
            Every regional format returns to the default for India: dates,
            times, number grouping, currency, week start, paper size and
            measurement units.
          </p>
          <div className="lng-check">
            <i className="ti ti-circle-check" />
            <div>
              Languages and translations are untouched
              <span>
                All 4,820 strings in every language stay exactly as they are.
              </span>
            </div>
          </div>
          <div className="lng-check">
            <i className="ti ti-circle-check" />
            <div>
              Fonts and RTL settings are untouched
              <span>Script support is separate from regional formatting.</span>
            </div>
          </div>
          <div className="lng-check is-review">
            <i className="ti ti-alert-circle" />
            <div>
              21 format settings would change
              <span>
                Including the two locale overrides for Arabic and French, which
                would be removed.
              </span>
            </div>
          </div>
          <div className="lng-check is-missing">
            <i className="ti ti-alert-triangle" />
            <div>
              Deliberate choices would be reversed
              <span>
                Week start would return to Sunday and the secondary currency
                display would be switched off. Both were set on purpose.
              </span>
            </div>
          </div>
          <div className="form-check mt-3">
            <input className="form-check-input" type="checkbox" id="rs_ok" />
            <label className="form-check-label fs-13" htmlFor="rs_ok">
              I understand the two locale overrides would be removed
            </label>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-outline-light bg-white"
            data-bs-dismiss="modal"
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            data-bs-dismiss="modal"
          >
            Restore defaults
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Restore defaults */}
</>

  )
}

export default LocalizationModal