
const Localization = () => {
  return (
   <>
  {/* Page Wrapper */}
  <div className="page-wrapper">
    <div className="content content-two">
      {/* ===================== 1. LOCALIZATION WORKSPACE HERO ===================== */}
      <div className="lng-hero">
        <div className="lng-hero-top">
          <span className="lng-hero-crest">
            <b>Aa</b>
            <span>en-IN</span>
          </span>
          <div className="flex-fill">
            <h1 className="lng-hero-title">Language &amp; Localization</h1>
            <p className="lng-hero-sub">
              Which languages the school speaks in, how complete each one is,
              and the regional conventions — dates, numbers, currency, week
              start — that everything else is rendered against.
            </p>
          </div>
          <span className="lng-badge is-review">
            <i className="ti ti-alert-circle" />2 languages need attention
          </span>
        </div>
        <div className="lng-hero-facts">
          <div className="lng-hero-fact">
            <span>Default language</span>
            <strong>
              English (India) <span className="lng-code is-accent">en-IN</span>
            </strong>
          </div>
          <div className="lng-hero-fact">
            <span>Active languages</span>
            <strong>4 of 6 enabled</strong>
          </div>
          <div className="lng-hero-fact">
            <span>Translation status</span>
            <strong>78% across all modules</strong>
          </div>
          <div className="lng-hero-fact">
            <span>Region</span>
            <strong>India · Asia/Kolkata · ₹ INR</strong>
          </div>
          <div className="lng-hero-fact">
            <span>Last updated</span>
            <strong>31 Jul 2026 · Ms. Latha Rao</strong>
          </div>
        </div>
        <div className="lng-hero-actions">
          <button
            type="button"
            className="btn btn-primary d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#lng_edit"
          >
            <i className="ti ti-device-floppy me-1" />
            Save changes
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#lng_add"
          >
            <i className="ti ti-plus me-1" />
            Add language
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#lng_import"
          >
            <i className="ti ti-upload me-1" />
            Import translations
          </button>
          <button
            type="button"
            className="btn btn-outline-light bg-white d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#lng_export"
          >
            <i className="ti ti-download me-1" />
            Export language pack
          </button>
        </div>
      </div>
      {/* /Localization Workspace Hero */}
      <div className="row g-4">
        {/* ===================== 2. STICKY SETTINGS NAVIGATION ===================== */}
        <div className="col-xxl-3 col-lg-4">
          <div
            className="lng-nav nav flex-column"
            role="tablist"
            aria-label="Language and localization sections"
          >
            <button
              className="lng-nav-link active"
              id="lngtab-general"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-general"
              type="button"
              role="tab"
              aria-controls="lngpane-general"
              aria-selected="true"
            >
              <i className="ti ti-adjustments" />
              <span className="lng-nav-txt">General</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-languages"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-languages"
              type="button"
              role="tab"
              aria-controls="lngpane-languages"
              aria-selected="false"
            >
              <i className="ti ti-language" />
              <span className="lng-nav-txt">Languages</span>
              <span className="lng-nav-hint">6</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-localization"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-localization"
              type="button"
              role="tab"
              aria-controls="lngpane-localization"
              aria-selected="false"
            >
              <i className="ti ti-map-pin" />
              <span className="lng-nav-txt">Localization</span>
              <span className="lng-nav-hint">IN</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-translations"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-translations"
              type="button"
              role="tab"
              aria-controls="lngpane-translations"
              aria-selected="false"
            >
              <i className="ti ti-file-text" />
              <span className="lng-nav-txt">Translations</span>
              <span className="lng-nav-hint">8</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-datetime"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-datetime"
              type="button"
              role="tab"
              aria-controls="lngpane-datetime"
              aria-selected="false"
            >
              <i className="ti ti-calendar-time" />
              <span className="lng-nav-txt">Date &amp; Time</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-currency"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-currency"
              type="button"
              role="tab"
              aria-controls="lngpane-currency"
              aria-selected="false"
            >
              <i className="ti ti-currency-rupee" />
              <span className="lng-nav-txt">Currency</span>
              <span className="lng-nav-hint">INR</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-numbers"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-numbers"
              type="button"
              role="tab"
              aria-controls="lngpane-numbers"
              aria-selected="false"
            >
              <i className="ti ti-decimal" />
              <span className="lng-nav-txt">Number Format</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-timezone"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-timezone"
              type="button"
              role="tab"
              aria-controls="lngpane-timezone"
              aria-selected="false"
            >
              <i className="ti ti-clock-hour-4" />
              <span className="lng-nav-txt">Timezone</span>
              <span className="lng-nav-hint">IST</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-rtl"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-rtl"
              type="button"
              role="tab"
              aria-controls="lngpane-rtl"
              aria-selected="false"
            >
              <i className="ti ti-text-direction-rtl" />
              <span className="lng-nav-txt">RTL Support</span>
              <span className="lng-nav-hint">on</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-fonts"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-fonts"
              type="button"
              role="tab"
              aria-controls="lngpane-fonts"
              aria-selected="false"
            >
              <i className="ti ti-typography" />
              <span className="lng-nav-txt">Fonts</span>
              <span className="lng-nav-hint">5</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-regional"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-regional"
              type="button"
              role="tab"
              aria-controls="lngpane-regional"
              aria-selected="false"
            >
              <i className="ti ti-world" />
              <span className="lng-nav-txt">Regional Preferences</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-io"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-io"
              type="button"
              role="tab"
              aria-controls="lngpane-io"
              aria-selected="false"
            >
              <i className="ti ti-package" />
              <span className="lng-nav-txt">Import / Export</span>
            </button>
            <button
              className="lng-nav-link"
              id="lngtab-audit"
              data-bs-toggle="pill"
              data-bs-target="#lngpane-audit"
              type="button"
              role="tab"
              aria-controls="lngpane-audit"
              aria-selected="false"
            >
              <i className="ti ti-file-search" />
              <span className="lng-nav-txt">Audit History</span>
              <span className="lng-nav-hint">92</span>
            </button>
            <div className="lng-nav-foot">
              <span className="lng-lbl">Overall coverage</span>
              <div className="lng-cover">
                <div className="lng-cover-bar lng-p-78 lng-q-9 lng-r-13">
                  <i />
                  <i />
                  <i />
                </div>
                <div className="lng-cover-meta">
                  <span>
                    <b>78%</b> translated
                  </span>
                  <span>
                    <b>3,760</b> of 4820 strings
                  </span>
                </div>
              </div>
              <p className="fs-12 text-muted mb-2 mt-2">
                Across four enabled languages and eight modules. Tamil and Hindi
                carry most of the shortfall.
              </p>
              <button
                type="button"
                className="btn btn-outline-light bg-white btn-sm w-100 d-inline-flex align-items-center justify-content-center"
                data-bs-toggle="modal"
                data-bs-target="#lng_restore"
              >
                <i className="ti ti-rotate-2 me-1" />
                Restore defaults
              </button>
            </div>
          </div>
        </div>
        {/* /Sticky Settings Navigation */}
        {/* ===================== 3&ndash;7. LOCALIZATION WORKSPACE ===================== */}
        <div className="col-xxl-9 col-lg-8">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="lngpane-general"
              role="tabpanel"
              aria-labelledby="lngtab-general"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 01</span>
                  <h2 className="lng-hero-title fs-20 mb-1">General</h2>
                  <p className="fs-13 text-muted mb-0">
                    Which language the application speaks by default, and to
                    whom.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-language" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Default language</p>
                        <p>What the application falls back to</p>
                      </div>
                      <span className="lng-code is-accent">en-IN</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Default language
                          <small>
                            Used when a user has expressed no preference
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>English (India) · en-IN</option>
                            <option>Tamil · ta-IN</option>
                            <option>Hindi · hi-IN</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Fallback language
                          <small>
                            Shown when a string is missing in the chosen
                            language
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>English (India)</option>
                            <option>English (UK)</option>
                            <option>Show the key</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Detect from browser
                          <small>
                            Use the browser’s language on first visit
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_1"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_1"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Remember the choice
                          <small>
                            A user’s language is stored on their account
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_2"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_2"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Language switcher
                          <small>
                            Shown in the header for every signed-in user
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_3"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_3"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Default language"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-users" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Who sees what</p>
                        <p>Language is per person, not per school</p>
                      </div>
                      <span className="lng-badge is-accent">4 audiences</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Staff interface
                          <small>
                            Administrators and teachers may choose any enabled
                            language
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Any enabled language</option>
                            <option>English only</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Parent portal
                          <small>Guardians choose at first sign-in</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Any enabled language</option>
                            <option>English and Tamil</option>
                            <option>English only</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Student portal
                          <small>
                            Follows the parent’s choice unless changed
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_4"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_4"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Outbound email and SMS
                          <small>
                            Sent in the recipient’s language where a translation
                            exists
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_5"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_5"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Printed documents
                          <small>
                            Report cards and certificates stay in English
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_6"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_6"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Audience languages"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-review">
                        <i className="ti ti-alert-circle" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Fallback behaviour</p>
                        <p>What happens when a string is missing</p>
                      </div>
                      <span className="lng-badge is-review">13% missing</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Missing string
                          <small>
                            Fall back to English rather than show a blank
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Fall back to English</option>
                            <option>Show the key</option>
                            <option>Show blank</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Mark fallbacks visually
                          <small>
                            Off in production — useful only while translating
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_7"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_7"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Log missing keys
                          <small>
                            Every fallback is recorded so gaps surface on their
                            own
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_8"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_8"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Notify on new keys
                          <small>
                            Translators are told when the application adds a
                            string
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_9"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_9"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        4 settings · 627 keys logged this month
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Fallback behaviour"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-user-shield" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Who may change this</p>
                        <p>Localization is not a general permission</p>
                      </div>
                      <span className="lng-badge is-accent">Restricted</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Permitted roles
                          <small>
                            Super Administrator and IT Administrator
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-light bg-white"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#lng_workspace"
                            aria-label="Open language configuration workspace for Permitted roles"
                          >
                            Manage
                          </button>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Translators
                          <small>
                            May edit strings but not enable or disable a
                            language
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_10"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_10"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Approval before publishing
                          <small>
                            A translated string is reviewed before it goes live
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_11"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_11"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Audit retention<small>3 academic years</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>3 academic years</option>
                            <option>1 year</option>
                            <option>Indefinite</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Change control"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-languages"
              role="tabpanel"
              aria-labelledby="lngtab-languages"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 02</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Languages</h2>
                  <p className="fs-13 text-muted mb-0">
                    Six configured, four enabled.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="fs-13 text-muted mb-2">
                    Six languages configured, four enabled. Each shows its own
                    name in its own script, because that is what a speaker of it
                    recognises in a switcher.
                  </p>
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
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#lng_add"
                >
                  <i className="ti ti-plus me-1" />
                  Add language
                </button>
              </div>
              <div className="row g-4">
                <div className="col-xxl-4 col-md-6">
                  <div className="lng-plate is-default">
                    <div className="lng-plate-top">
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-plate-native">English</p>
                        <p className="lng-plate-name">English (India)</p>
                      </div>
                      <span className="lng-badge is-accent">Default</span>
                    </div>
                    <div className="lng-plate-meta">
                      <span className="lng-code is-accent">en-IN</span>
                      <span className="badge-meta">
                        <i className="ti ti-text-direction-ltr" />
                        LTR
                      </span>
                      <span className="badge-meta">
                        <i className="ti ti-star-filled" />
                        Default
                      </span>
                    </div>
                    <div className="lng-cover">
                      <div className="lng-cover-bar lng-p-100 lng-q-0 lng-r-0">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="lng-cover-meta">
                        <span>
                          <b>100%</b> translated
                        </span>
                        <span>
                          <b>4,820</b> of 4820 strings
                        </span>
                      </div>
                    </div>
                    <div className="lng-plate-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="lng_sw_12"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="lng_sw_12"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#lng_edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white disabled"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for English (India)"
                        >
                          Set default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="lng-plate">
                    <div className="lng-plate-top">
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-plate-native">தமிழ்</p>
                        <p className="lng-plate-name">Tamil</p>
                      </div>
                      <span className="lng-badge is-done">Enabled</span>
                    </div>
                    <div className="lng-plate-meta">
                      <span className="lng-code">ta-IN</span>
                      <span className="badge-meta">
                        <i className="ti ti-text-direction-ltr" />
                        LTR
                      </span>
                    </div>
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
                    <div className="lng-plate-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="lng_sw_13"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="lng_sw_13"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#lng_edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for Tamil"
                        >
                          Set default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="lng-plate">
                    <div className="lng-plate-top">
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-plate-native">हिन्दी</p>
                        <p className="lng-plate-name">Hindi</p>
                      </div>
                      <span className="lng-badge is-done">Enabled</span>
                    </div>
                    <div className="lng-plate-meta">
                      <span className="lng-code">hi-IN</span>
                      <span className="badge-meta">
                        <i className="ti ti-text-direction-ltr" />
                        LTR
                      </span>
                    </div>
                    <div className="lng-cover">
                      <div className="lng-cover-bar lng-p-64 lng-q-11 lng-r-25">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="lng-cover-meta">
                        <span>
                          <b>64%</b> translated
                        </span>
                        <span>
                          <b>3,085</b> of 4820 strings
                        </span>
                      </div>
                    </div>
                    <div className="lng-plate-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="lng_sw_14"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="lng_sw_14"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#lng_edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for Hindi"
                        >
                          Set default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="lng-plate">
                    <div className="lng-plate-top">
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-plate-native">മലയാളം</p>
                        <p className="lng-plate-name">Malayalam</p>
                      </div>
                      <span className="lng-badge is-done">Enabled</span>
                    </div>
                    <div className="lng-plate-meta">
                      <span className="lng-code">ml-IN</span>
                      <span className="badge-meta">
                        <i className="ti ti-text-direction-ltr" />
                        LTR
                      </span>
                    </div>
                    <div className="lng-cover">
                      <div className="lng-cover-bar lng-p-58 lng-q-9 lng-r-33">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="lng-cover-meta">
                        <span>
                          <b>58%</b> translated
                        </span>
                        <span>
                          <b>2,796</b> of 4820 strings
                        </span>
                      </div>
                    </div>
                    <div className="lng-plate-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="lng_sw_15"
                          defaultChecked
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="lng_sw_15"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#lng_edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for Malayalam"
                        >
                          Set default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="lng-plate is-off">
                    <div className="lng-plate-top">
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-plate-native is-rtl">العربية</p>
                        <p className="lng-plate-name">Arabic (UAE)</p>
                      </div>
                      <span className="lng-badge">Disabled</span>
                    </div>
                    <div className="lng-plate-meta">
                      <span className="lng-code">ar-AE</span>
                      <span className="badge-meta">
                        <i className="ti ti-text-direction-rtl" />
                        RTL
                      </span>
                    </div>
                    <div className="lng-cover">
                      <div className="lng-cover-bar lng-p-22 lng-q-4 lng-r-74">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="lng-cover-meta">
                        <span>
                          <b>22%</b> translated
                        </span>
                        <span>
                          <b>1,060</b> of 4820 strings
                        </span>
                      </div>
                    </div>
                    <div className="lng-plate-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="lng_sw_16"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="lng_sw_16"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#lng_edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white disabled"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for Arabic (UAE)"
                        >
                          Set default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-4 col-md-6">
                  <div className="lng-plate is-off">
                    <div className="lng-plate-top">
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-plate-native">Français</p>
                        <p className="lng-plate-name">French</p>
                      </div>
                      <span className="lng-badge">Disabled</span>
                    </div>
                    <div className="lng-plate-meta">
                      <span className="lng-code">fr-FR</span>
                      <span className="badge-meta">
                        <i className="ti ti-text-direction-ltr" />
                        LTR
                      </span>
                    </div>
                    <div className="lng-cover">
                      <div className="lng-cover-bar lng-p-6 lng-q-0 lng-r-94">
                        <i />
                        <i />
                        <i />
                      </div>
                      <div className="lng-cover-meta">
                        <span>
                          <b>6%</b> translated
                        </span>
                        <span>
                          <b>289</b> of 4820 strings
                        </span>
                      </div>
                    </div>
                    <div className="lng-plate-foot">
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="lng_sw_17"
                        />
                        <label
                          className="form-check-label visually-hidden"
                          htmlFor="lng_sw_17"
                        >
                          Enable
                        </label>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white"
                          data-bs-toggle="modal"
                          data-bs-target="#lng_edit"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white disabled"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for French"
                        >
                          Set default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-localization"
              role="tabpanel"
              aria-labelledby="lngtab-localization"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 03</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Localization</h2>
                  <p className="fs-13 text-muted mb-0">
                    The region every format rule inherits from.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-map-pin" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Country &amp; region</p>
                        <p>The locale everything else inherits from</p>
                      </div>
                      <span className="lng-code is-accent">IN</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Country<small>India</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>India</option>
                            <option>United Arab Emirates</option>
                            <option>United Kingdom</option>
                            <option>Singapore</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Region<small>Tamil Nadu · Chennai</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Tamil Nadu</option>
                            <option>Kerala</option>
                            <option>Karnataka</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Locale identifier
                          <small>Used by every format rule below</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-code">en-IN</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Statutory calendar
                          <small>
                            Gregorian — the academic year runs April to March
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Gregorian</option>
                            <option>Hijri</option>
                            <option>Saka</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Address format
                          <small>Line, area, city, state, PIN</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>India</option>
                            <option>International</option>
                            <option>Custom</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Country and region"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-calendar-week" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Week &amp; weekend</p>
                        <p>What counts as a working week</p>
                      </div>
                      <span className="lng-badge is-accent">Mon start</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          First day of week
                          <small>
                            Monday — calendars and attendance grids start here
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Monday</option>
                            <option>Sunday</option>
                            <option>Saturday</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Weekend
                          <small>
                            Sunday only — the school runs a six-day week
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Sunday</option>
                            <option>Saturday and Sunday</option>
                            <option>Friday and Saturday</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Second Saturday
                          <small>
                            A holiday, and excluded from working days
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_18"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_18"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Week numbering
                          <small>
                            ISO — the first week is the one holding a Thursday
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>ISO 8601</option>
                            <option>First Monday</option>
                            <option>Simple</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Week and weekend"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-ruler" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Measurement units</p>
                        <p>Used on records and reports</p>
                      </div>
                      <span className="lng-badge is-accent">Metric</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          System<small>Metric</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Metric</option>
                            <option>Imperial</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Height and weight
                          <small>
                            Centimetres and kilograms, on the health record
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">cm · kg</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Distance<small>Kilometres, on transport routes</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">km</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Temperature<small>Celsius</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Celsius</option>
                            <option>Fahrenheit</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Paper size<small>A4 — every printed document</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>A4</option>
                            <option>Letter</option>
                            <option>Legal</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Measurement units"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-flag" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Locale overrides</p>
                        <p>Where a language departs from the region</p>
                      </div>
                      <span className="lng-badge is-review">2 overrides</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Arabic (UAE)
                          <small>
                            Uses the Hijri calendar alongside Gregorian, and a
                            Friday–Saturday weekend
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-badge is-review">Override</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          French
                          <small>
                            Uses a space as the thousands separator, not a comma
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-badge is-review">Override</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Tamil, Hindi, Malayalam
                          <small>Follow the Indian region exactly</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-badge is-done">Inherit</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Allow per-language overrides
                          <small>
                            Off would force every language onto the regional
                            defaults
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_19"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_19"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Locale overrides"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-translations"
              role="tabpanel"
              aria-labelledby="lngtab-translations"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 04</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Translations</h2>
                  <p className="fs-13 text-muted mb-0">
                    Eight modules, 4,820 strings.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <p className="fs-13 text-muted mb-2">
                    Eight modules, 4,820 strings, four enabled languages.
                    Coverage is counted per language and averaged, so a module
                    at 84% is not 84% done in every language.
                  </p>
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
                </div>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#lng_import"
                >
                  <i className="ti ti-upload me-1" />
                  Import a pack
                </button>
              </div>
              <div className="row g-4 mb-4">
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-done">
                        <i className="ti ti-layout-grid" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Core System</p>
                        <p>780 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Navigation, buttons, dates, errors and everything shared
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-96 lng-q-3 lng-r-1">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>96%</b> translated
                          </span>
                          <span>
                            <b>749</b> of 780 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-done">Complete</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />8 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-review">
                        <i className="ti ti-school" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Academic Module</p>
                        <p>940 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Classes, subjects, timetable, examinations and report
                        cards
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-84 lng-q-9 lng-r-7">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>84%</b> translated
                          </span>
                          <span>
                            <b>790</b> of 940 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-review">In progress</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          66 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-done">
                        <i className="ti ti-report-money" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Finance Module</p>
                        <p>620 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Fees, invoices, receipts and payment screens
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-91 lng-q-5 lng-r-4">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>91%</b> translated
                          </span>
                          <span>
                            <b>564</b> of 620 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-done">Complete</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          25 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-review">
                        <i className="ti ti-books" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Library Module</p>
                        <p>310 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Catalogue, issue and return, fines
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-74 lng-q-11 lng-r-15">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>74%</b> translated
                          </span>
                          <span>
                            <b>229</b> of 310 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-review">In progress</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          46 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-review">
                        <i className="ti ti-bus" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Transport Module</p>
                        <p>280 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Routes, stops, vehicles and driver records
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-68 lng-q-12 lng-r-20">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>68%</b> translated
                          </span>
                          <span>
                            <b>190</b> of 280 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-review">In progress</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          56 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-missing">
                        <i className="ti ti-building" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Hostel Module</p>
                        <p>240 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Rooms, allotment, attendance and visitors
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-52 lng-q-8 lng-r-40">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>52%</b> translated
                          </span>
                          <span>
                            <b>125</b> of 240 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-missing">Needs work</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          96 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-missing">
                        <i className="ti ti-sparkles" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">AI Module</p>
                        <p>410 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Insights, forecasts and the assistant
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-41 lng-q-14 lng-r-45">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>41%</b> translated
                          </span>
                          <span>
                            <b>168</b> of 410 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-missing">Needs work</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          184 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-done">
                        <i className="ti ti-bell" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Notification Module</p>
                        <p>240 strings</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <p className="fs-12 text-muted mb-3">
                        Email and SMS templates, alerts and digests
                      </p>
                      <div className="lng-cover">
                        <div className="lng-cover-bar lng-p-88 lng-q-6 lng-r-6">
                          <i />
                          <i />
                          <i />
                        </div>
                        <div className="lng-cover-meta">
                          <span>
                            <b>88%</b> translated
                          </span>
                          <span>
                            <b>211</b> of 240 strings
                          </span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap mt-3">
                        <span className="lng-badge is-done">Complete</span>
                        <span className="badge-meta">
                          <i className="ti ti-alert-circle" />
                          14 missing
                        </span>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        Across 4 languages
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_translate"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <span className="lng-lbl">Recently edited strings</span>
              <p className="fs-13 text-muted mb-3">
                A string key and every translation of it. The key never changes;
                only what sits beside it does.
              </p>
              <div className="lng-string">
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
                  <span className="lng-key">
                    <i className="ti ti-key" />
                    fees.reminder.due
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="modal"
                    data-bs-target="#lng_translate"
                  >
                    Edit translations
                  </button>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">en-IN</span>
                  <span className="lng-pair-val">
                    Fee of {"{"}amount{"}"} for {"{"}student{"}"} is due on{" "}
                    {"{"}date{"}"}.
                  </span>
                  <span className="lng-badge is-done">Approved</span>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">ta-IN</span>
                  <span className="lng-pair-val">
                    {"{"}student{"}"} அவர்கள் {"{"}amount{"}"} கட்டணம் {"{"}date
                    {"}"} அன்று நிலுவையில் ଢ଼ள்ளது.
                  </span>
                  <span className="lng-badge is-done">Approved</span>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">hi-IN</span>
                  <span className="lng-pair-val">
                    {"{"}student{"}"} का {"{"}amount{"}"} शुल्क {"{"}date{"}"}{" "}
                    को देय है।
                  </span>
                  <span className="lng-badge is-done">Approved</span>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">ml-IN</span>
                  <span className="lng-pair-val is-missing">
                    Not translated — falls back to English
                  </span>
                  <span className="lng-badge is-missing">Missing</span>
                </div>
              </div>
              <div className="lng-string">
                <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-2">
                  <span className="lng-key">
                    <i className="ti ti-key" />
                    attendance.alert.absent
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    data-bs-toggle="modal"
                    data-bs-target="#lng_translate"
                  >
                    Edit translations
                  </button>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">en-IN</span>
                  <span className="lng-pair-val">
                    {"{"}student{"}"} was marked absent today.
                  </span>
                  <span className="lng-badge is-done">Approved</span>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">ta-IN</span>
                  <span className="lng-pair-val">
                    {"{"}student{"}"} இன்று வகுப்பिல் வரவिல்லை.
                  </span>
                  <span className="lng-badge is-done">Approved</span>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">hi-IN</span>
                  <span className="lng-pair-val">
                    Awaiting review — submitted 28 Jul by R. Sharma
                  </span>
                  <span className="lng-badge is-review">Review</span>
                </div>
                <div className="lng-pair">
                  <span className="lng-code">ar-AE</span>
                  <span className="lng-pair-val is-rtl">
                    تم تسجيل غياب {"{"}student{"}"} اليوم.
                  </span>
                  <span className="lng-badge is-done">Approved</span>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-datetime"
              role="tabpanel"
              aria-labelledby="lngtab-datetime"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 05</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Date &amp; Time</h2>
                  <p className="fs-13 text-muted mb-0">
                    How a moment is written.
                  </p>
                </div>
              </div>
              <p className="fs-13 text-muted mb-3">
                Each card shows the format rule and, larger, what it actually
                produces. The sample is the part worth reading.
              </p>
              <div className="row g-4 mb-4">
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Long date</p>
                    <span className="lng-sample-out">31 July 2026</span>
                    <span className="lng-sample-rule">d MMMM yyyy</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Short date</p>
                    <span className="lng-sample-out">31 Jul 2026</span>
                    <span className="lng-sample-rule">d MMM yyyy</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Numeric date</p>
                    <span className="lng-sample-out">31/07/2026</span>
                    <span className="lng-sample-rule">dd/MM/yyyy</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Date and time</p>
                    <span className="lng-sample-out">31 Jul 2026, 4:12 PM</span>
                    <span className="lng-sample-rule">d MMM yyyy, h:mm a</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Time</p>
                    <span className="lng-sample-out">4:12 PM</span>
                    <span className="lng-sample-rule">h:mm a</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Time with seconds</p>
                    <span className="lng-sample-out">4:12:08 PM</span>
                    <span className="lng-sample-rule">h:mm:ss a</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Day and date</p>
                    <span className="lng-sample-out">Friday, 31 July</span>
                    <span className="lng-sample-rule">EEEE, d MMMM</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Relative</p>
                    <span className="lng-sample-out">2 hours ago</span>
                    <span className="lng-sample-rule">relative</span>
                  </div>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-calendar" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Date format</p>
                        <p>How a date is written everywhere</p>
                      </div>
                      <span className="lng-badge is-accent">Day first</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Order
                          <small>Day, month, year — as India writes it</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Day / month / year</option>
                            <option>Month / day / year</option>
                            <option>Year-month-day</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Separator<small>A slash in numeric dates</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>/ slash</option>
                            <option>- hyphen</option>
                            <option>. full stop</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Month names
                          <small>
                            Abbreviated in lists, spelled out in documents
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Abbreviated in lists</option>
                            <option>Always abbreviated</option>
                            <option>Always spelled out</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Two-digit day
                          <small>Leading zero on numeric dates only</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_20"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_20"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Calendar<small>Gregorian</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Gregorian</option>
                            <option>Hijri alongside</option>
                            <option>Saka alongside</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Date format"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-clock" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Time format</p>
                        <p>And the timezone it is read in</p>
                      </div>
                      <span className="lng-badge is-accent">12-hour</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Clock<small>12-hour with AM and PM</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>12-hour</option>
                            <option>24-hour</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Show seconds
                          <small>Only in logs and audit trails</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_21"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_21"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Timezone<small>Asia/Kolkata · GMT +5:30</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Asia/Kolkata</option>
                            <option>Asia/Dubai</option>
                            <option>UTC</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Show the timezone
                          <small>Off — every user is in the same one</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_22"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_22"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Daylight saving
                          <small>Not observed in this timezone</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="badge-meta">
                            <i className="ti ti-minus" />
                            N/A
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Time format"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-currency"
              role="tabpanel"
              aria-labelledby="lngtab-currency"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 06</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Currency</h2>
                  <p className="fs-13 text-muted mb-0">How money is written.</p>
                </div>
              </div>
              <div className="row g-4 mb-4">
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Fee amount</p>
                    <span className="lng-sample-out">₹1,28,400.50</span>
                    <span className="lng-sample-rule">₹#,##,##0.00</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Whole amount</p>
                    <span className="lng-sample-out">₹12,400</span>
                    <span className="lng-sample-rule">₹#,##,##0</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">On a receipt</p>
                    <span className="lng-sample-out">₹ 12,400.00</span>
                    <span className="lng-sample-rule">₹&nbsp;#,##,##0.00</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">In words</p>
                    <span className="lng-sample-out">
                      Twelve thousand four hundred only
                    </span>
                    <span className="lng-sample-rule">spellout</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Negative</p>
                    <span className="lng-sample-out">(₹450.00)</span>
                    <span className="lng-sample-rule">
                      brackets, not a minus
                    </span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Zero balance</p>
                    <span className="lng-sample-out">₹0.00</span>
                    <span className="lng-sample-rule">never blank</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Large total</p>
                    <span className="lng-sample-out">₹3,74,60,500</span>
                    <span className="lng-sample-rule">Indian grouping</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Secondary currency</p>
                    <span className="lng-sample-out">$14,982.20</span>
                    <span className="lng-sample-rule">$#,##0.00</span>
                  </div>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-currency-rupee" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Currency</p>
                        <p>What money is expressed in</p>
                      </div>
                      <span className="lng-code is-accent">INR</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Base currency
                          <small>
                            Indian Rupee — every amount is stored in this
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>INR — Indian Rupee</option>
                            <option>USD — US Dollar</option>
                            <option>AED — UAE Dirham</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Symbol
                          <small>₹ before the amount, with no space</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>₹ before</option>
                            <option>₹ before with space</option>
                            <option>INR after</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Decimal places<small>Two, always shown</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>2</option>
                            <option>0</option>
                            <option>Only when not whole</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Grouping
                          <small>Indian — 1,28,400 rather than 128,400</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Indian (2-2-3)</option>
                            <option>International (3-3-3)</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Negative amounts
                          <small>In brackets, as an accountant expects</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>(brackets)</option>
                            <option>Minus sign</option>
                            <option>Red text</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Currency"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-review">
                        <i className="ti ti-arrows-exchange" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Secondary currency</p>
                        <p>For overseas families only</p>
                      </div>
                      <span className="lng-badge is-review">Display only</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Enabled
                          <small>
                            Shown alongside the rupee amount on invoices
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_23"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_23"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Currency<small>US Dollar</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>USD</option>
                            <option>AED</option>
                            <option>GBP</option>
                            <option>EUR</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Exchange rate
                          <small>
                            Entered by hand each month, never fetched live
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue="83.42"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Rate set on
                          <small>
                            Manual rates avoid a payment changing between the
                            screen and the gateway
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <b className="lng-mono">01 Jul 2026</b>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Used for payment
                          <small>No — collection is always in rupees</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_24"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_24"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Secondary currency"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-numbers"
              role="tabpanel"
              aria-labelledby="lngtab-numbers"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 07</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Number Format</h2>
                  <p className="fs-13 text-muted mb-0">
                    Two characters that everything hinges on.
                  </p>
                </div>
              </div>
              <div className="row g-4 mb-4">
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Whole number</p>
                    <span className="lng-sample-out">1,428</span>
                    <span className="lng-sample-rule">#,##,##0</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Decimal</p>
                    <span className="lng-sample-out">79.85</span>
                    <span className="lng-sample-rule">#,##0.00</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Percentage</p>
                    <span className="lng-sample-out">94.2%</span>
                    <span className="lng-sample-rule">#0.0%</span>
                  </div>
                </div>
                <div className="col-xxl-3 col-md-6">
                  <div className="lng-sample">
                    <p className="lng-sample-name">Marks</p>
                    <span className="lng-sample-out">479 / 600</span>
                    <span className="lng-sample-rule">
                      no grouping under 1000
                    </span>
                  </div>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-decimal" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Separators</p>
                        <p>The two characters everything hinges on</p>
                      </div>
                      <span className="lng-badge is-accent">. and ,</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Decimal separator<small>A full stop</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>. full stop</option>
                            <option>, comma</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Thousands separator<small>A comma</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>, comma</option>
                            <option>. full stop</option>
                            <option>space</option>
                            <option>none</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Grouping
                          <small>
                            Indian — the first group is three, then twos
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Indian (2-2-3)</option>
                            <option>International (3-3-3)</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Group under 1,000
                          <small>
                            Off — marks and counts read better unbroken
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_25"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_25"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Separators"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-percentage" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Rounding &amp; display</p>
                        <p>How numbers are presented</p>
                      </div>
                      <span className="lng-badge is-accent">2 places</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Default decimal places
                          <small>Two, for money and averages</small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue={2}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Marks
                          <small>
                            Whole numbers only — set in academic settings
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <span className="badge-meta">
                            <i className="ti ti-link" />
                            Academic
                          </span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Percentages<small>One decimal place</small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue={1}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Trailing zeros
                          <small>Kept on money, dropped on averages</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_26"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_26"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Digit shaping
                          <small>
                            Western digits in every language, including Arabic
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_27"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_27"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Rounding and display"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-timezone"
              role="tabpanel"
              aria-labelledby="lngtab-timezone"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 08</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Timezone</h2>
                  <p className="fs-13 text-muted mb-0">
                    What every timestamp means.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-clock-hour-4" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Timezone</p>
                        <p>What every timestamp is stored and shown in</p>
                      </div>
                      <span className="lng-code is-accent">IST</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Timezone<small>Asia/Kolkata · GMT +5:30</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Asia/Kolkata</option>
                            <option>Asia/Dubai</option>
                            <option>Asia/Singapore</option>
                            <option>UTC</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Storage
                          <small>
                            UTC in the database, rendered on the way out
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">UTC</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Daylight saving<small>Not observed in India</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="badge-meta">
                            <i className="ti ti-minus" />
                            N/A
                          </span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Per-user timezone
                          <small>Off — everyone is in the same zone</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_28"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_28"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Show zone on timestamps
                          <small>Off, for the same reason</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_29"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_29"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Timezone"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-calendar-time" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">
                          What the timezone touches
                        </p>
                        <p>The places a wrong zone shows up first</p>
                      </div>
                      <span className="lng-badge is-done">Consistent</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Attendance registers lock at 11:00 local
                          <span>
                            Not 11:00 UTC, which would be 16:30 here and
                            useless.
                          </span>
                        </div>
                      </div>
                      <div className="lng-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Fee due dates fall at end of day local
                          <span>
                            A payment at 11:50 PM on the due date is on time.
                          </span>
                        </div>
                      </div>
                      <div className="lng-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          SMS quiet hours run 21:00 to 09:00 local
                          <span>
                            Configured in SMS settings and read from here.
                          </span>
                        </div>
                      </div>
                      <div className="lng-check">
                        <i className="ti ti-circle-check" />
                        <div>
                          Audit logs record UTC and display local
                          <span>
                            So an exported log can be compared with another
                            system.
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        4 dependent behaviours
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Timezone dependencies"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <span className="lng-lbl">Additional timezones</span>
                  <div className="lng-empty">
                    <i className="ti ti-world-off" />
                    <h3 className="fs-15 fw-medium">
                      No additional timezone is configured
                    </h3>
                    <p>
                      All three campuses sit in Asia/Kolkata, so every timestamp
                      means the same thing to everyone and no conversion happens
                      anywhere. If the school ever opens a campus in another
                      zone, add it here and every schedule, deadline and log
                      entry will be shown in the reader’s own time.
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                      data-bs-toggle="modal"
                      data-bs-target="#lng_region"
                    >
                      <i className="ti ti-plus me-1" />
                      Add a timezone
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-rtl"
              role="tabpanel"
              aria-labelledby="lngtab-rtl"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 09</span>
                  <h2 className="lng-hero-title fs-20 mb-1">RTL Support</h2>
                  <p className="fs-13 text-muted mb-0">
                    What happens when the interface turns round.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-text-direction-rtl" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Direction preview</p>
                        <p>The same screen, both ways round</p>
                      </div>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-mirror mt-2">
                        <div>
                          <div className="lng-mock">
                            <div className="lng-mock-side">
                              <span className="lng-mock-bar is-accent" />
                              <span className="lng-mock-bar" />
                              <span className="lng-mock-bar" />
                            </div>
                            <div className="lng-mock-main">
                              <span className="lng-mock-bar" />
                              <span className="lng-mock-line lng-p-80" />
                              <span className="lng-mock-line lng-p-60" />
                              <span className="lng-mock-card" />
                            </div>
                          </div>
                          <span className="lng-mock-cap">
                            ltr · en-IN, ta-IN, hi-IN
                          </span>
                        </div>
                        <div>
                          <div className="lng-mock is-rtl">
                            <div className="lng-mock-side">
                              <span className="lng-mock-bar is-accent" />
                              <span className="lng-mock-bar" />
                              <span className="lng-mock-bar" />
                            </div>
                            <div className="lng-mock-main">
                              <span className="lng-mock-bar" />
                              <span className="lng-mock-line lng-p-80" />
                              <span className="lng-mock-line lng-p-60" />
                              <span className="lng-mock-card" />
                            </div>
                          </div>
                          <span className="lng-mock-cap">rtl · ar-AE</span>
                        </div>
                      </div>
                      <p className="fs-12 text-muted mb-0 mt-3">
                        The sidebar, text alignment and progress fill all
                        reverse. Icons that mean direction — back, forward, next
                        — are mirrored too; icons that mean an object are not.
                      </p>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">
                        One language currently uses this
                      </span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Direction preview"
                      >
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-arrows-left-right" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">RTL support</p>
                        <p>How the interface flips</p>
                      </div>
                      <span className="lng-badge is-done">Enabled</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          RTL support
                          <small>The stylesheet carries both directions</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_30"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_30"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Applied to
                          <small>
                            Arabic (UAE) — the only RTL language configured
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-code">ar-AE</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Mirror directional icons
                          <small>
                            Back, forward and next reverse; a book or a person
                            does not
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_31"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_31"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Mirror charts and meters
                          <small>Progress fills from the right</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_32"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_32"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Numbers stay left to right
                          <small>
                            Digits and dates read the same way in any direction
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_33"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_33"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for RTL support"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="lng-card">
                      <div className="lng-card-head">
                        <span className="lng-card-ic is-review">
                          <i className="ti ti-alert-circle" />
                        </span>
                        <div className="flex-fill overflow-hidden">
                          <p className="lng-card-title">Known RTL gaps</p>
                          <p>Where the flip is not complete</p>
                        </div>
                        <span className="lng-badge is-review">3 open</span>
                      </div>
                      <div className="lng-card-body">
                        <div className="lng-check is-review">
                          <i className="ti ti-alert-circle" />
                          <div>
                            Report card layout does not mirror
                            <span>
                              Printed documents stay left to right in every
                              language, by decision rather than omission.
                            </span>
                          </div>
                        </div>
                        <div className="lng-check is-review">
                          <i className="ti ti-alert-circle" />
                          <div>
                            Two timetable grids overflow at narrow widths
                            <span>
                              The period columns reverse but the sticky first
                              column does not follow.
                            </span>
                          </div>
                        </div>
                        <div className="lng-check is-review">
                          <i className="ti ti-alert-circle" />
                          <div>
                            The AI module has not been reviewed in RTL
                            <span>
                              It is 41% translated, so this has not been worth
                              doing yet.
                            </span>
                          </div>
                        </div>
                        <div className="lng-check">
                          <i className="ti ti-circle-check" />
                          <div>
                            Everything else has been checked
                            <span>Reviewed against Arabic on 22 Jun 2026.</span>
                          </div>
                        </div>
                      </div>
                      <div className="lng-card-foot">
                        <span className="fs-12 text-muted">
                          Arabic is disabled while these stand
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for RTL gaps"
                        >
                          <i className="ti ti-arrow-right me-1" />
                          Open
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-fonts"
              role="tabpanel"
              aria-labelledby="lngtab-fonts"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 10</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Fonts</h2>
                  <p className="fs-13 text-muted mb-0">
                    A face for every script.
                  </p>
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap mb-3">
                <p className="fs-13 text-muted mb-0">
                  A specimen line in each face. Indic and Arabic scripts need
                  their own font — the Latin face has no glyphs for them, and
                  without one the browser substitutes something that will not
                  sit on the same baseline.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#lng_workspace"
                  aria-label="Open language configuration workspace for Fonts"
                >
                  <i className="ti ti-plus me-1" />
                  Add a font
                </button>
              </div>
              <div className="lng-font">
                <div className="lng-font-meta">
                  <strong>Inter</strong>
                  <span>Latin · en-IN, fr-FR</span>
                </div>
                <p className="lng-font-spec mb-0">
                  The quick brown fox jumps over the lazy dog
                </p>
                <span className="lng-badge is-accent">Default</span>
              </div>
              <div className="lng-font">
                <div className="lng-font-meta">
                  <strong>Noto Sans Tamil</strong>
                  <span>Tamil · ta-IN</span>
                </div>
                <p className="lng-font-spec mb-0">நந்றாக படிக்க வேண்டும்</p>
                <span className="lng-badge is-done">Loaded</span>
              </div>
              <div className="lng-font">
                <div className="lng-font-meta">
                  <strong>Noto Sans Devanagari</strong>
                  <span>Hindi · hi-IN</span>
                </div>
                <p className="lng-font-spec mb-0">शिक्षा हमें आगे ले जाती है</p>
                <span className="lng-badge is-done">Loaded</span>
              </div>
              <div className="lng-font">
                <div className="lng-font-meta">
                  <strong>Noto Sans Malayalam</strong>
                  <span>Malayalam · ml-IN</span>
                </div>
                <p className="lng-font-spec mb-0">വിാാലൊലാ ക്കുത്തികള്ര്്</p>
                <span className="lng-badge is-done">Loaded</span>
              </div>
              <div className="lng-font">
                <div className="lng-font-meta">
                  <strong>Noto Naskh Arabic</strong>
                  <span>Arabic · ar-AE</span>
                </div>
                <p className="lng-font-spec is-rtl mb-0">
                  التعليم هو أقوى سلاح
                </p>
                <span className="lng-badge is-review">Not loaded</span>
              </div>
              <div className="row g-4 mt-1">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-typography" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Typography</p>
                        <p>Applied across the interface</p>
                      </div>
                      <span className="lng-badge is-accent">Inter</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Default font<small>Inter, for Latin script</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>System stack</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Base size<small>14 pixels</small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue={14}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Line height
                          <small>
                            1.6 — a little generous, for scripts with tall marks
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue="1.6"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Font loading
                          <small>Self-hosted, no external request</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_34"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_34"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Fallback stack
                          <small>System sans-serif, then sans-serif</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">system-ui</span>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Typography"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic is-review">
                        <i className="ti ti-adjustments" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Per-script adjustment</p>
                        <p>Where one size does not fit</p>
                      </div>
                      <span className="lng-badge is-review">2 adjusted</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Tamil size adjustment
                          <small>
                            Rendered 6% larger — the script sits smaller on the
                            same em
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue="+6%"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Malayalam line height
                          <small>1.75 — conjunct forms are tall</small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue="1.75"
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Arabic size adjustment
                          <small>Not set — the language is disabled</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="badge-meta">
                            <i className="ti ti-minus" />
                            Pending
                          </span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Devanagari
                          <small>No adjustment needed at this size</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-badge is-done">Default</span>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">4 adjustments</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Per-script adjustment"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-regional"
              role="tabpanel"
              aria-labelledby="lngtab-regional"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 11</span>
                  <h2 className="lng-hero-title fs-20 mb-1">
                    Regional Preferences
                  </h2>
                  <p className="fs-13 text-muted mb-0">
                    Names, telephone numbers, documents and sorting.
                  </p>
                </div>
              </div>
              <div className="row g-4">
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-user" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Names &amp; addresses</p>
                        <p>Conventions that are easy to get wrong</p>
                      </div>
                      <span className="lng-badge is-accent">India</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Name order
                          <small>Given name first, then family name</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Given then family</option>
                            <option>Family then given</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Initials
                          <small>
                            Expanded on certificates, abbreviated in lists
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_35"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_35"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Honorifics
                          <small>
                            Mr, Mrs, Ms, Dr — and Master for junior students
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_36"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_36"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Address order
                          <small>Line, area, city, state, PIN</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>India</option>
                            <option>International</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Postal code label<small>PIN code, not ZIP</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>PIN code</option>
                            <option>Postcode</option>
                            <option>ZIP code</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Names and addresses"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-phone" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Telephone</p>
                        <p>How a number is stored and shown</p>
                      </div>
                      <span className="lng-badge is-accent">+91</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Country code
                          <small>Prefixed to every stored number</small>
                        </div>
                        <div className="lng-row-val">
                          <input
                            type="text"
                            className="lng-input"
                            defaultValue={+91}
                            aria-label="Setting value"
                          />
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Storage format
                          <small>E.164 — no spaces, no punctuation</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">+919876544710</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Display format<small>Grouped for readability</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">+91 98765 44710</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Accept without a country code
                          <small>A ten-digit number is assumed Indian</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_37"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_37"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">4 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Telephone"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-file-text" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Documents</p>
                        <p>What the school prints</p>
                      </div>
                      <span className="lng-badge is-accent">A4</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Paper size<small>A4</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>A4</option>
                            <option>Letter</option>
                            <option>Legal</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Orientation
                          <small>Portrait, except the timetable</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Portrait</option>
                            <option>Landscape</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Document language
                          <small>English on every printed document</small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>English only</option>
                            <option>Recipient's language</option>
                            <option>Bilingual</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Numbers in documents
                          <small>Western digits and Indian grouping</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_38"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_38"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Date on documents
                          <small>
                            Spelled out — 31 July 2026, never 31/07/26
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_39"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_39"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Documents"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="lng-card">
                    <div className="lng-card-head">
                      <span className="lng-card-ic">
                        <i className="ti ti-abc" />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="lng-card-title">Sorting &amp; search</p>
                        <p>Which order is alphabetical</p>
                      </div>
                      <span className="lng-badge is-accent">Locale-aware</span>
                    </div>
                    <div className="lng-card-body">
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Collation
                          <small>
                            Sort using the rules of the reader’s language
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_40"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_40"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Name lists
                          <small>
                            Sorted by given name, which is how registers are
                            kept
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Given name</option>
                            <option>Family name</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Case sensitivity<small>Ignored when sorting</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_41"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_41"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Accent sensitivity
                          <small>
                            Ignored when searching, so François matches Francois
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_42"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_42"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Search across scripts
                          <small>
                            A Tamil name is found by typing it in Latin
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_43"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_43"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="lng-card-foot">
                      <span className="fs-12 text-muted">5 settings</span>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#lng_workspace"
                        aria-label="Open language configuration workspace for Sorting and search"
                      >
                        <i className="ti ti-arrow-right me-1" />
                        Open
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-io"
              role="tabpanel"
              aria-labelledby="lngtab-io"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 12</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Import / Export</h2>
                  <p className="fs-13 text-muted mb-0">
                    Getting translations in and out.
                  </p>
                </div>
              </div>
              <div className="accordion lng-acc" id="lngIO">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="lngacc-himp">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#lngacc-imp"
                      aria-expanded="true"
                      aria-controls="lngacc-imp"
                    >
                      <i className="ti ti-upload" />
                      Importing a language pack
                      <span className="lng-badge is-accent lng-acc-spacer">
                        JSON or XLIFF
                      </span>
                    </button>
                  </h2>
                  <div
                    id="lngacc-imp"
                    className="accordion-collapse collapse show"
                    aria-labelledby="lngacc-himp"
                    data-bs-parent="#lngIO"
                    role="region"
                  >
                    <div className="accordion-body">
                      <p className="fs-13 text-muted">
                        A pack is a file of keys and their translations.
                        Importing never removes a string; it fills empty ones
                        and, if you allow it, replaces existing ones.
                      </p>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Accepted formats
                          <small>JSON, XLIFF 2.0 and gettext PO</small>
                        </div>
                        <div className="lng-row-val">
                          <span className="lng-mono">.json .xlf .po</span>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          On an existing translation
                          <small>
                            Keep what is there unless the pack is marked
                            authoritative
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>Keep existing</option>
                            <option>Replace</option>
                            <option>Ask per string</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Unknown keys
                          <small>
                            Ignored — a pack from a newer version will contain
                            some
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_44"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_44"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Mark imported strings for review
                          <small>Nothing goes live untouched</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_45"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_45"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="lngacc-hexp">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#lngacc-exp"
                      aria-expanded="false"
                      aria-controls="lngacc-exp"
                    >
                      <i className="ti ti-download" />
                      Exporting a language pack
                    </button>
                  </h2>
                  <div
                    id="lngacc-exp"
                    className="accordion-collapse collapse"
                    aria-labelledby="lngacc-hexp"
                    data-bs-parent="#lngIO"
                    role="region"
                  >
                    <div className="accordion-body">
                      <p className="fs-13 text-muted">
                        Exports carry the key, the source English string and the
                        translation, so a translator working outside the system
                        has the context they need.
                      </p>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Format
                          <small>
                            XLIFF, which every translation tool reads
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <select
                            className="lng-select"
                            aria-label="Setting value"
                          >
                            <option>XLIFF 2.0</option>
                            <option>JSON</option>
                            <option>gettext PO</option>
                            <option>CSV</option>
                          </select>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Include source strings
                          <small>The English alongside each key</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_46"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_46"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Include only missing strings
                          <small>A much smaller file for a translator</small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_47"
                              defaultChecked
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_47"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="lng-row">
                        <div className="lng-row-key">
                          Include screenshots
                          <small>
                            Not available — the system has no screen context
                            stored
                          </small>
                        </div>
                        <div className="lng-row-val">
                          <div className="form-check form-switch mb-0">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              role="switch"
                              id="lng_sw_48"
                            />
                            <label
                              className="form-check-label visually-hidden"
                              htmlFor="lng_sw_48"
                            >
                              Enable
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="lngacc-hsync">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#lngacc-sync"
                      aria-expanded="false"
                      aria-controls="lngacc-sync"
                    >
                      <i className="ti ti-refresh" />
                      External translation services
                      <span className="lng-badge lng-acc-spacer">
                        Not connected
                      </span>
                    </button>
                  </h2>
                  <div
                    id="lngacc-sync"
                    className="accordion-collapse collapse"
                    aria-labelledby="lngacc-hsync"
                    data-bs-parent="#lngIO"
                    role="region"
                  >
                    <div className="accordion-body">
                      <div className="lng-empty">
                        <i className="ti ti-plug-connected-x" />
                        <h3 className="fs-15 fw-medium">
                          No translation service is connected
                        </h3>
                        <p>
                          Translations are managed by hand through import and
                          export. Connecting a service such as Crowdin or
                          Lokalise would keep the two in step automatically, but
                          it also means sending every string to a third party —
                          which is worth a decision rather than a switch.
                        </p>
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#lng_workspace"
                          aria-label="Open language configuration workspace for Translation services"
                        >
                          <i className="ti ti-plug-connected me-1" />
                          Read about connecting one
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="lngacc-hreset">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#lngacc-reset"
                      aria-expanded="false"
                      aria-controls="lngacc-reset"
                    >
                      <i className="ti ti-alert-octagon" />
                      Restore defaults
                    </button>
                  </h2>
                  <div
                    id="lngacc-reset"
                    className="accordion-collapse collapse"
                    aria-labelledby="lngacc-hreset"
                    data-bs-parent="#lngIO"
                    role="region"
                  >
                    <div className="accordion-body">
                      <p className="fs-13 text-muted">
                        Restoring returns every regional format — dates,
                        numbers, currency, week start — to the defaults for the
                        selected country. Languages, translations and the
                        strings you have edited are untouched.
                      </p>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm d-inline-flex align-items-center"
                        data-bs-toggle="modal"
                        data-bs-target="#lng_restore"
                      >
                        <i className="ti ti-rotate-2 me-1" />
                        Restore regional defaults
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="lngpane-audit"
              role="tabpanel"
              aria-labelledby="lngtab-audit"
              tabIndex={0}
            >
              <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-3">
                <div>
                  <span className="lng-lbl">Section 13</span>
                  <h2 className="lng-hero-title fs-20 mb-1">Audit History</h2>
                  <p className="fs-13 text-muted mb-0">
                    Every change, with the name against it.
                  </p>
                </div>
              </div>
              <div className="lng-card">
                <div className="lng-card-head">
                  <span className="lng-card-ic">
                    <i className="ti ti-file-search" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="lng-card-title">Audit history</p>
                    <p>
                      Every change to languages and regional settings, retained
                      for 3 academic years
                    </p>
                  </div>
                  <span className="lng-badge">8 of 92 entries</span>
                </div>
                <div className="lng-card-body">
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>31 Jul 2026</strong>15:40
                    </div>
                    <div className="lng-audit-what">
                      Malayalam enabled for the parent portal
                      <span>Ms. Latha Rao · 58% translated at the time</span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>28 Jul 2026</strong>11:12
                    </div>
                    <div className="lng-audit-what">
                      412 strings imported for Tamil
                      <span>
                        R. Sharma · XLIFF pack · all marked for review
                      </span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>22 Jun 2026</strong>16:05
                    </div>
                    <div className="lng-audit-what">
                      Arabic disabled pending RTL review
                      <span>Ms. Latha Rao · three layout issues open</span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>14 Jun 2026</strong>09:30
                    </div>
                    <div className="lng-audit-what">
                      Secondary currency display enabled
                      <span>Mr. R. Venkatesh · USD, manual rate</span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>02 Jun 2026</strong>14:20
                    </div>
                    <div className="lng-audit-what">
                      Indian digit grouping applied to all amounts
                      <span>Ms. Latha Rao · was international grouping</span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>18 May 2026</strong>10:00
                    </div>
                    <div className="lng-audit-what">
                      Noto Sans Malayalam added
                      <span>IT · self-hosted, 214 KB</span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>04 Apr 2026</strong>08:15
                    </div>
                    <div className="lng-audit-what">
                      Week start moved to Monday
                      <span>
                        Ms. Latha Rao · aligns with the attendance register
                      </span>
                    </div>
                  </div>
                  <div className="lng-audit">
                    <div className="lng-audit-when">
                      <strong>14 Jan 2026</strong>11:00
                    </div>
                    <div className="lng-audit-what">
                      Localization configured for the year
                      <span>Mr. R. Venkatesh · en-IN, Asia/Kolkata, INR</span>
                    </div>
                  </div>
                </div>
                <div className="lng-card-foot">
                  <span className="fs-12 text-muted">
                    Entries cannot be edited or removed
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#lng_export"
                  >
                    <i className="ti ti-download me-1" />
                    Export history
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ===================== 8. LANGUAGE ACTIVITY TIMELINE ===================== */}
      <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mt-5 mb-3">
        <div>
          <h2 className="lng-hero-title fs-20 mb-1">Language activity</h2>
          <p className="fs-13 text-muted mb-0">
            How this configuration reached its present state.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline-light bg-white btn-sm d-inline-flex align-items-center"
          data-bs-toggle="modal"
          data-bs-target="#lng_export"
        >
          <i className="ti ti-download me-1" />
          Export configuration
        </button>
      </div>
      <div className="lng-strip">
        <div className="lng-strip-stage is-done">
          <span className="lng-strip-when">14 Jan 2026</span>
          <p className="lng-strip-title">Language added</p>
          <p className="lng-strip-txt">
            Tamil configured alongside English, with Noto Sans Tamil self-hosted
            for the script.
          </p>
        </div>
        <div className="lng-strip-stage is-done">
          <span className="lng-strip-when">28 Jul 2026</span>
          <p className="lng-strip-title">Translation imported</p>
          <p className="lng-strip-txt">
            412 Tamil strings arrived as an XLIFF pack and were queued for
            review rather than published.
          </p>
        </div>
        <div className="lng-strip-stage is-done">
          <span className="lng-strip-when">04 Apr 2026</span>
          <p className="lng-strip-title">Default language confirmed</p>
          <p className="lng-strip-txt">
            English (India) kept as the default, with browser detection on for
            first-time visitors.
          </p>
        </div>
        <div className="lng-strip-stage is-done">
          <span className="lng-strip-when">02 Jun 2026</span>
          <p className="lng-strip-title">Localization updated</p>
          <p className="lng-strip-txt">
            Indian digit grouping applied to every amount, replacing
            international grouping.
          </p>
        </div>
        <div className="lng-strip-stage is-done">
          <span className="lng-strip-when">04 Apr 2026</span>
          <p className="lng-strip-title">Regional settings published</p>
          <p className="lng-strip-txt">
            Week start moved to Monday to match the attendance register, and A4
            fixed for documents.
          </p>
        </div>
        <div className="lng-strip-stage is-current">
          <span className="lng-strip-when">Active now</span>
          <p className="lng-strip-title">Configuration activated</p>
          <p className="lng-strip-txt">
            Four languages live for 1,428 families and 96 staff. Arabic waits on
            three RTL layout fixes.
          </p>
        </div>
      </div>
      {/* /Language Activity Timeline */}
      {/* ===================== 9. TRANSLATION INSIGHTS ===================== */}
      <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mt-5 mb-3">
        <div>
          <h2 className="lng-hero-title fs-20 mb-1">Translation insights</h2>
          <p className="fs-13 text-muted mb-0">
            What the coverage figures suggest, and what is worth leaving alone.
          </p>
        </div>
      </div>
      <div className="row g-4">
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">ta</span>
            <span className="lng-badge is-review">Needs update</span>
            <p className="lng-insight-title">Tamil needs the most attention</p>
            <p className="lng-insight-txt">
              672 strings are missing and 675 are awaiting review, most of them
              in the academic and AI modules. It is the second language for 41%
              of families, so the gap is felt more here than anywhere else.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Needs update</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#lng_workspace"
                aria-label="Open language configuration workspace for Tamil"
              >
                Open Tamil
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">ar</span>
            <span className="lng-badge is-review">Blocked</span>
            <p className="lng-insight-title">
              Arabic is held back by layout, not translation
            </p>
            <p className="lng-insight-txt">
              At 22% it would be incomplete either way, but the three open RTL
              issues are the actual reason it is disabled. Fixing the timetable
              grid would unblock a review.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Blocked</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#lng_workspace"
                aria-label="Open language configuration workspace for RTL gaps"
              >
                Open RTL gaps
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">AI</span>
            <span className="lng-badge is-missing">Missing</span>
            <p className="lng-insight-title">
              The AI module is the weakest across every language
            </p>
            <p className="lng-insight-txt">
              41% average coverage against 78% overall. It also has the highest
              rate of new keys, so translating it now means translating parts of
              it again.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Missing</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="modal"
                data-bs-target="#lng_translate"
              >
                Open module
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">ml</span>
            <span className="lng-badge is-review">Watch</span>
            <p className="lng-insight-title">Malayalam was enabled at 58%</p>
            <p className="lng-insight-txt">
              It went live on 31 July while still well short. Guardians using it
              will meet English text regularly, which is fine as a decision but
              worth stating rather than discovering.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Watch</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#lng_workspace"
                aria-label="Open language configuration workspace for Malayalam"
              >
                Open Malayalam
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">627</span>
            <span className="lng-badge is-review">Trend</span>
            <p className="lng-insight-title">
              New keys are appearing faster than they are translated
            </p>
            <p className="lng-insight-txt">
              627 keys were logged as missing this month against 412 imported.
              At this rate coverage falls even while translators are working.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Trend</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="modal"
                data-bs-target="#lng_import"
              >
                Open translations
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">IN</span>
            <span className="lng-badge is-done">Good</span>
            <p className="lng-insight-title">
              Indian grouping is applied everywhere
            </p>
            <p className="lng-insight-txt">
              Amounts read as 1,28,400 rather than 128,400 throughout, including
              on receipts and in exports. Worth keeping; mixed grouping in one
              system is a common and confusing fault.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Good</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#lng_workspace"
                aria-label="Open language configuration workspace for Currency"
              >
                Open currency
              </button>
            </div>
          </div>
        </div>
        <div className="col-xl-4 col-md-6">
          <div className="lng-insight">
            <span className="lng-insight-mark">A4</span>
            <span className="lng-badge is-done">Note</span>
            <p className="lng-insight-title">
              Printed documents stay in English
            </p>
            <p className="lng-insight-txt">
              A deliberate choice rather than an omission. Report cards,
              certificates and transcripts are statutory documents and are kept
              in one language for the board and for onward institutions.
            </p>
            <div className="lng-insight-foot">
              <span className="fs-12 text-muted">Note</span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light bg-white"
                data-bs-toggle="offcanvas"
                data-bs-target="#lng_workspace"
                aria-label="Open language configuration workspace for Documents"
              >
                Open documents
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* /Translation Insights */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default Localization