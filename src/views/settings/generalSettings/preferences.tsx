import { Link } from "react-router-dom";
import { all_routes } from "../../../routes/all_routes";
const Preferences = () => {
  return (
 <>
  {/* Page Wrapper */}
  <div className="page-wrapper settings-profile">
    <div className="content content-two">
      {/* Page Header */}
      <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1 d-flex align-items-center">
            <i className="ti ti-adjustments-horizontal text-primary me-2" />
            Application Preferences
          </h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={all_routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item">
                <a href="school-settings.html">Settings</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Preferences
              </li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <span className="meta-badge is-draft me-2 mb-2">
            <i className="ti ti-pencil me-1" />2 unsaved changes
          </span>
          <a
            href="javascript:void(0);"
            className="btn btn-outline-light bg-white me-2 mb-2 d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#restore_defaults"
          >
            <i className="ti ti-rotate me-1" />
            Restore Defaults
          </a>
          <a
            href="javascript:void(0);"
            className="btn btn-primary mb-2 d-inline-flex align-items-center"
            data-bs-toggle="modal"
            data-bs-target="#edit_preferences"
          >
            <i className="ti ti-device-floppy me-1" />
            Save
          </a>
        </div>
      </div>
      {/* /Page Header */}
      {/* ===================== 1. PREFERENCES HERO ===================== */}
      <div className="identity-panel mb-4">
        <div className="identity-panel-inner">
          <div className="identity-panel-main">
            <span className="identity-crest">
              <i className="ti ti-adjustments-horizontal fs-36 text-primary" />
              <span className="identity-crest-pip">
                <i className="ti ti-check" />
              </span>
            </span>
            <div className="flex-fill">
              <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                <span className="meta-badge is-active">Synced</span>
                <span className="meta-badge is-plain">
                  <i className="ti ti-device-laptop me-1" />
                  This device and account
                </span>
              </div>
              <h1 className="identity-panel-name">Application Preferences</h1>
              <p className="fs-14 text-muted lh-base mb-0">
                How the platform looks and behaves for you. Preferences follow
                your account across devices; anything marked{" "}
                <em>this device only</em> stays here.
              </p>
            </div>
          </div>
          <div className="identity-panel-actions">
            <a
              href="javascript:void(0);"
              className="btn btn-primary d-inline-flex align-items-center justify-content-center"
              data-bs-toggle="modal"
              data-bs-target="#edit_preferences"
            >
              <i className="ti ti-device-floppy me-1" />
              Save Preferences
            </a>
            <div className="dropdown">
              <a
                href="javascript:void(0);"
                className="btn btn-outline-light bg-white btn-icon"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                aria-label="More actions"
                title="More actions"
              >
                <i className="ti ti-dots-vertical" />
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="javascript:void(0);"
                  data-bs-toggle="modal"
                  data-bs-target="#restore_defaults"
                >
                  <i className="ti ti-rotate me-2" />
                  Restore Defaults
                </a>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="javascript:void(0);"
                  data-bs-toggle="modal"
                  data-bs-target="#import_preferences"
                >
                  <i className="ti ti-upload me-2" />
                  Import Preferences
                </a>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="javascript:void(0);"
                  data-bs-toggle="modal"
                  data-bs-target="#export_preferences"
                >
                  <i className="ti ti-download me-2" />
                  Export Preferences
                </a>
              </div>
            </div>
          </div>
          <div className="identity-facts">
            <span className="identity-fact">
              <span className="eyebrow-label">Personalization</span>
              <b>86% configured</b>
            </span>
            <span className="identity-fact">
              <span className="eyebrow-label">Current theme</span>
              <b>Light · Indigo</b>
            </span>
            <span className="identity-fact">
              <span className="eyebrow-label">Language</span>
              <b>English (UK)</b>
            </span>
            <span className="identity-fact">
              <span className="eyebrow-label">Accessibility</span>
              <b className="text-success">3 aids on</b>
            </span>
            <span className="identity-fact">
              <span className="eyebrow-label">Last updated</span>
              <b>Today, 11:20</b>
            </span>
          </div>
        </div>
      </div>
      {/* /Preferences Hero */}
      {/* ===================== PREFERENCES WORKSPACE ===================== */}
      <div className="row g-4">
        <div className="col-xl-3 col-lg-4">
          <div
            className="section-nav nav flex-column nav-pills"
            id="prefNav"
            role="tablist"
            aria-orientation="vertical"
          >
            <span className="section-nav-heading">Basics</span>
            <button
              className="section-nav-link active"
              id="pt-general"
              data-bs-toggle="pill"
              data-bs-target="#pp-general"
              type="button"
              role="tab"
              aria-controls="pp-general"
              aria-selected="true"
            >
              <i className="ti ti-settings" />
              General
            </button>
            <button
              className="section-nav-link"
              id="pt-appearance"
              data-bs-toggle="pill"
              data-bs-target="#pp-appearance"
              type="button"
              role="tab"
              aria-controls="pp-appearance"
              aria-selected="false"
            >
              <i className="ti ti-palette" />
              Appearance
            </button>
            <button
              className="section-nav-link"
              id="pt-dashboard"
              data-bs-toggle="pill"
              data-bs-target="#pp-dashboard"
              type="button"
              role="tab"
              aria-controls="pp-dashboard"
              aria-selected="false"
            >
              <i className="ti ti-layout-dashboard" />
              Dashboard
            </button>
            <span className="section-nav-heading">Communication</span>
            <button
              className="section-nav-link"
              id="pt-notifications"
              data-bs-toggle="pill"
              data-bs-target="#pp-notifications"
              type="button"
              role="tab"
              aria-controls="pp-notifications"
              aria-selected="false"
            >
              <i className="ti ti-bell" />
              Notifications
            </button>
            <button
              className="section-nav-link"
              id="pt-region"
              data-bs-toggle="pill"
              data-bs-target="#pp-region"
              type="button"
              role="tab"
              aria-controls="pp-region"
              aria-selected="false"
            >
              <i className="ti ti-language" />
              Language &amp; Region
            </button>
            <span className="section-nav-heading">Experience</span>
            <button
              className="section-nav-link"
              id="pt-accessibility"
              data-bs-toggle="pill"
              data-bs-target="#pp-accessibility"
              type="button"
              role="tab"
              aria-controls="pp-accessibility"
              aria-selected="false"
            >
              <i className="ti ti-accessible" />
              Accessibility
            </button>
            <button
              className="section-nav-link"
              id="pt-productivity"
              data-bs-toggle="pill"
              data-bs-target="#pp-productivity"
              type="button"
              role="tab"
              aria-controls="pp-productivity"
              aria-selected="false"
            >
              <i className="ti ti-bolt" />
              Productivity
            </button>
            <span className="section-nav-heading">Protection</span>
            <button
              className="section-nav-link"
              id="pt-privacy"
              data-bs-toggle="pill"
              data-bs-target="#pp-privacy"
              type="button"
              role="tab"
              aria-controls="pp-privacy"
              aria-selected="false"
            >
              <i className="ti ti-lock" />
              Privacy &amp; Security
            </button>
            <span className="section-nav-heading">System</span>
            <button
              className="section-nav-link"
              id="pt-system"
              data-bs-toggle="pill"
              data-bs-target="#pp-system"
              type="button"
              role="tab"
              aria-controls="pp-system"
              aria-selected="false"
            >
              <i className="ti ti-server-cog" />
              System Defaults
            </button>
            <button
              className="section-nav-link"
              id="pt-audit"
              data-bs-toggle="pill"
              data-bs-target="#pp-audit"
              type="button"
              role="tab"
              aria-controls="pp-audit"
              aria-selected="false"
            >
              <i className="ti ti-history" />
              Audit History
            </button>
            <div className="section-nav-foot">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="eyebrow-label">Personalized</span>
                <span className="fs-12 fw-semibold text-dark">86%</span>
              </div>
              <span className="inline-meter inline-meter-p-86" />
              <p className="fs-12 text-muted mb-0 mt-2">
                Four experimental features are off. Two aids are available but
                unused.
              </p>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-8">
          <div className="tab-content">
            <div
              className="tab-pane fade show active"
              id="pp-general"
              role="tabpanel"
              aria-labelledby="pt-general"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">General</h2>
                  <p className="section-head-sub">
                    The shell: what loads first, how the navigation behaves and
                    what happens between sessions.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#reset_category"
                  >
                    <i className="ti ti-rotate me-1" />
                    Reset this section
                  </a>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-settings" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Application</p>
                    <p className="fs-12 text-muted mb-0">
                      Names, landing pages and how the shell behaves
                    </p>
                  </div>
                  <span className="meta-badge is-active">6 set</span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-app-window" />
                  </span>
                  <div className="option-item-text">
                    <span>Application name</span>
                    <p>Shown in the browser tab and on printed headers.</p>
                  </div>
                  <div className="option-item-control">
                    <span className="fs-13 fw-medium text-dark">Karkaii</span>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf001"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-home" />
                  </span>
                  <div className="option-item-text">
                    <span>Default landing page</span>
                    <p>Where you arrive after signing in.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="Dashboard">
                      <option>Dashboard</option>
                      <option>AI Command Center</option>
                      <option>Notification Center</option>
                      <option>Students</option>
                      <option>Last visited page</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-box" />
                  </span>
                  <div className="option-item-text">
                    <span>Default module</span>
                    <p>The module the global search scopes to first.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="Academics">
                      <option>Academics</option>
                      <option>Students</option>
                      <option>Attendance</option>
                      <option>Fees</option>
                      <option>No default</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-layout-sidebar" />
                  </span>
                  <div className="option-item-text">
                    <span>Sidebar behaviour</span>
                    <p>Whether the navigation stays open or collapses.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn active">
                        <i className="ti ti-layout-sidebar" />
                        Expanded
                      </button>
                      <button type="button" className="segmented-btn">
                        <i className="ti ti-layout-sidebar-left-collapse" />
                        Collapsed
                      </button>
                      <button type="button" className="segmented-btn">
                        <i className="ti ti-arrows-diagonal" />
                        Auto
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-menu-2" />
                  </span>
                  <div className="option-item-text">
                    <span>Menu style</span>
                    <p>How sub-menus open within the sidebar.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Accordion · one open at a time"
                    >
                      <option>Accordion · one open at a time</option>
                      <option>Tree · many open</option>
                      <option>Flyout on hover</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-refresh" />
                  </span>
                  <div className="option-item-text">
                    <span>Auto refresh</span>
                    <p>
                      Refresh open lists in the background every few minutes.
                    </p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Every 5 minutes"
                    >
                      <option>Every 5 minutes</option>
                      <option>Every 15 minutes</option>
                      <option>Every 30 minutes</option>
                      <option>Off</option>
                    </select>
                  </span>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-clock-play" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Session</p>
                    <p className="fs-12 text-muted mb-0">
                      What happens while you are away from the keyboard
                    </p>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-history" />
                  </span>
                  <div className="option-item-text">
                    <span>Resume where I left off</span>
                    <p>Reopen the last page and any unsaved filters.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf002"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-device-desktop" />
                  </span>
                  <div className="option-item-text">
                    <span>Remember open tabs</span>
                    <p>Restore the workspace layout on the next sign-in.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf003"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-hourglass" />
                  </span>
                  <div className="option-item-text">
                    <span>Warn before timeout</span>
                    <p>Show a countdown two minutes before the session ends.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf004"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-appearance"
              role="tabpanel"
              aria-labelledby="pt-appearance"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Appearance</h2>
                  <p className="section-head-sub">
                    Theme, accent, density and the chrome around your content.
                    Changes apply immediately.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#appearance_settings"
                  >
                    <i className="ti ti-palette me-1" />
                    Advanced
                  </a>
                </div>
              </div>
              <div className="summary-line">
                <i className="ti ti-eye" />
                <p>
                  Every change previews below before you save. Nothing is
                  applied to other users.
                </p>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-palette" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Theme</p>
                    <p className="fs-12 text-muted mb-0">
                      Colour, contrast and the overall feel of the interface
                    </p>
                  </div>
                  <span className="meta-badge is-active">Light · Indigo</span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-sun-moon" />
                  </span>
                  <div className="option-item-text">
                    <span>Theme mode</span>
                    <p>
                      Follow the system setting or pick one and stay with it.
                    </p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn active">
                        <i className="ti ti-sun" />
                        Light
                      </button>
                      <button type="button" className="segmented-btn">
                        <i className="ti ti-moon" />
                        Dark
                      </button>
                      <button type="button" className="segmented-btn">
                        <i className="ti ti-device-desktop" />
                        System
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-color-swatch" />
                  </span>
                  <div className="option-item-text">
                    <span>Accent colour</span>
                    <p>Used for buttons, links and active states.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="accent-picker">
                      <button
                        type="button"
                        className="accent-picker-dot c-primary active"
                        aria-label="Accent colour 1"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-teal"
                        aria-label="Accent colour 2"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-success"
                        aria-label="Accent colour 3"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-warning"
                        aria-label="Accent colour 4"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-danger"
                        aria-label="Accent colour 5"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-purple"
                        aria-label="Accent colour 6"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-pink"
                        aria-label="Accent colour 7"
                      />
                      <button
                        type="button"
                        className="accent-picker-dot c-dark"
                        aria-label="Accent colour 8"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-typography" />
                  </span>
                  <div className="option-item-text">
                    <span>Font size</span>
                    <p>Applies to body text; headings scale with it.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn">
                        Small
                      </button>
                      <button type="button" className="segmented-btn active">
                        Default
                      </button>
                      <button type="button" className="segmented-btn">
                        Large
                      </button>
                      <button type="button" className="segmented-btn">
                        Largest
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-arrows-vertical" />
                  </span>
                  <div className="option-item-text">
                    <span>Density</span>
                    <p>How much breathing room rows and cards are given.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn active">
                        Comfortable
                      </button>
                      <button type="button" className="segmented-btn">
                        Cosy
                      </button>
                      <button type="button" className="segmented-btn">
                        Compact
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="option-group">
                    <div className="option-group-head">
                      <span className="option-item-icon">
                        <i className="ti ti-sun" />
                      </span>
                      <div className="flex-fill">
                        <p className="option-group-title">Light · current</p>
                        <p className="fs-12 text-muted mb-0">
                          How the shell looks with your settings
                        </p>
                      </div>
                      <span className="meta-badge is-active">In use</span>
                    </div>
                    <div className="p-3">
                      <div className="layout-preview">
                        <div className="layout-preview-side">
                          <span className="layout-preview-bar is-accent" />
                          <span className="layout-preview-line inline-meter-p-80" />
                          <span className="layout-preview-line inline-meter-p-60" />
                          <span className="layout-preview-line inline-meter-p-70" />
                        </div>
                        <div className="layout-preview-main">
                          <span className="layout-preview-bar" />
                          <span className="layout-preview-card" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="option-group">
                    <div className="option-group-head">
                      <span className="option-item-icon">
                        <i className="ti ti-moon" />
                      </span>
                      <div className="flex-fill">
                        <p className="option-group-title">Dark</p>
                        <p className="fs-12 text-muted mb-0">
                          The same shell after sunset
                        </p>
                      </div>
                      <span className="meta-badge is-plain">Preview</span>
                    </div>
                    <div className="p-3">
                      <div className="layout-preview is-dark">
                        <div className="layout-preview-side">
                          <span className="layout-preview-bar is-accent" />
                          <span className="layout-preview-line inline-meter-p-80" />
                          <span className="layout-preview-line inline-meter-p-60" />
                          <span className="layout-preview-line inline-meter-p-70" />
                        </div>
                        <div className="layout-preview-main">
                          <span className="layout-preview-bar" />
                          <span className="layout-preview-card" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-layout" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Surfaces</p>
                    <p className="fs-12 text-muted mb-0">
                      The chrome around your content
                    </p>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-layout-sidebar" />
                  </span>
                  <div className="option-item-text">
                    <span>Sidebar style</span>
                    <p>Solid, tinted or transparent navigation.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="Solid white">
                      <option>Solid white</option>
                      <option>Tinted</option>
                      <option>Dark</option>
                      <option>Transparent</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-layout-navbar" />
                  </span>
                  <div className="option-item-text">
                    <span>Header style</span>
                    <p>Whether the header stays pinned as you scroll.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="Fixed">
                      <option>Fixed</option>
                      <option>Static</option>
                      <option>Hidden on scroll</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-border-radius" />
                  </span>
                  <div className="option-item-text">
                    <span>Rounded corners</span>
                    <p>The corner radius used across cards and controls.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn">
                        Square
                      </button>
                      <button type="button" className="segmented-btn active">
                        Soft
                      </button>
                      <button type="button" className="segmented-btn">
                        Round
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-wand" />
                  </span>
                  <div className="option-item-text">
                    <span>Animation level</span>
                    <p>How much movement the interface uses.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn active">
                        Full
                      </button>
                      <button type="button" className="segmented-btn">
                        Reduced
                      </button>
                      <button type="button" className="segmented-btn">
                        None
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-arrows-minimize" />
                  </span>
                  <div className="option-item-text">
                    <span>Compact mode</span>
                    <p>Tighter spacing throughout, useful on small screens.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf005"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-dashboard"
              role="tabpanel"
              aria-labelledby="pt-dashboard"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Dashboard</h2>
                  <p className="section-head-sub">
                    What loads when the platform opens, and which modules stay
                    within reach.
                  </p>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-layout-dashboard" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Dashboard</p>
                    <p className="fs-12 text-muted mb-0">
                      What you see when the platform opens
                    </p>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-home" />
                  </span>
                  <div className="option-item-text">
                    <span>Default dashboard</span>
                    <p>The board loaded on sign-in.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Admin dashboard"
                    >
                      <option>Admin dashboard</option>
                      <option>AI Command Center</option>
                      <option>Teacher dashboard</option>
                      <option>Student dashboard</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-layout-cards" />
                  </span>
                  <div className="option-item-text">
                    <span>Startup cards</span>
                    <p>How many cards load before you scroll.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="6 cards">
                      <option>6 cards</option>
                      <option>9 cards</option>
                      <option>12 cards</option>
                      <option>Everything</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-hand-stop" />
                  </span>
                  <div className="option-item-text">
                    <span>Welcome screen</span>
                    <p>A short greeting with the day’s summary.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf006"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-clock" />
                  </span>
                  <div className="option-item-text">
                    <span>Recent modules</span>
                    <p>Keep a trail of the last places you visited.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf007"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row g-3 mt-1">
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-users-group" />
                    </span>
                    <p className="choice-tile-title">Students</p>
                    <p className="fs-12 text-muted mb-0">
                      Pinned to quick access
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf008"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-calendar-stats" />
                    </span>
                    <p className="choice-tile-title">Attendance</p>
                    <p className="fs-12 text-muted mb-0">
                      Pinned to quick access
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf009"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-report-money" />
                    </span>
                    <p className="choice-tile-title">Fees</p>
                    <p className="fs-12 text-muted mb-0">
                      Pinned to quick access
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf010"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-sparkles" />
                    </span>
                    <p className="choice-tile-title">AI Command Center</p>
                    <p className="fs-12 text-muted mb-0">
                      Pinned to quick access
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf011"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-file-certificate" />
                    </span>
                    <p className="choice-tile-title">Examinations</p>
                    <p className="fs-12 text-muted mb-0">Available to pin</p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Not pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf012"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-books" />
                    </span>
                    <p className="choice-tile-title">Library</p>
                    <p className="fs-12 text-muted mb-0">Available to pin</p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Not pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf013"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-bus" />
                    </span>
                    <p className="choice-tile-title">Transport</p>
                    <p className="fs-12 text-muted mb-0">Available to pin</p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Not pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf014"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-bed" />
                    </span>
                    <p className="choice-tile-title">Hostel</p>
                    <p className="fs-12 text-muted mb-0">Available to pin</p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Not pinned</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf015"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-notifications"
              role="tabpanel"
              aria-labelledby="pt-notifications"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Notifications</h2>
                  <p className="section-head-sub">
                    Where each kind of message reaches you, and when it is
                    allowed to.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#configure_notifications"
                  >
                    <i className="ti ti-settings me-1" />
                    Per-module rules
                  </a>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-bell" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Channels</p>
                    <p className="fs-12 text-muted mb-0">
                      Where each kind of message reaches you
                    </p>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-mail" />
                  </span>
                  <div className="option-item-text">
                    <span>Email notifications</span>
                    <p>A digest rather than one message per event.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Daily digest at 07:00"
                    >
                      <option>Daily digest at 07:00</option>
                      <option>Immediately</option>
                      <option>Weekly on Friday</option>
                      <option>Off</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-message" />
                  </span>
                  <div className="option-item-text">
                    <span>SMS notifications</span>
                    <p>Reserved for things that cannot wait.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Critical only"
                    >
                      <option>Critical only</option>
                      <option>Critical and high</option>
                      <option>Off</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-device-mobile" />
                  </span>
                  <div className="option-item-text">
                    <span>Push notifications</span>
                    <p>To the mobile app on your registered devices.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="All priorities"
                    >
                      <option>All priorities</option>
                      <option>High and above</option>
                      <option>Critical only</option>
                      <option>Off</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-app-window" />
                  </span>
                  <div className="option-item-text">
                    <span>In-app notifications</span>
                    <p>The bell in the header. Always on.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf016"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-device-desktop" />
                  </span>
                  <div className="option-item-text">
                    <span>Desktop notifications</span>
                    <p>Browser notifications while the tab is open.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf017"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-volume" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Behaviour</p>
                    <p className="fs-12 text-muted mb-0">
                      How notifications announce themselves
                    </p>
                  </div>
                  <span className="meta-badge is-active">Quiet hours on</span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-music" />
                  </span>
                  <div className="option-item-text">
                    <span>Sound alerts</span>
                    <p>A short tone for critical alerts only.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf018"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-urgent" />
                  </span>
                  <div className="option-item-text">
                    <span>Critical alerts bypass quiet hours</span>
                    <p>Emergencies still reach you between 21:00 and 07:00.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf019"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-news" />
                  </span>
                  <div className="option-item-text">
                    <span>Digest frequency</span>
                    <p>How often the summary is compiled.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="Daily">
                      <option>Daily</option>
                      <option>Twice daily</option>
                      <option>Weekly</option>
                      <option>Off</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-moon" />
                  </span>
                  <div className="option-item-text">
                    <span>Quiet hours</span>
                    <p>Non-urgent notifications are held until morning.</p>
                  </div>
                  <div className="option-item-control">
                    <span className="fs-13 fw-medium text-dark">
                      21:00 – 07:00
                    </span>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf020"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-accessibility"
              role="tabpanel"
              aria-labelledby="pt-accessibility"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Accessibility</h2>
                  <p className="section-head-sub">
                    Aids that change how the interface presents itself. Three
                    are currently on.
                  </p>
                </div>
              </div>
              <div className="summary-line">
                <i className="ti ti-accessible" />
                <p>
                  These settings follow your account, so the platform behaves
                  the same on any device you sign in to.
                </p>
                <div className="ms-auto flex-shrink-0">
                  <span className="meta-badge is-active">3 aids on</span>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-contrast" />
                    </span>
                    <p className="choice-tile-title">High contrast</p>
                    <p className="fs-12 text-muted mb-0">
                      Stronger borders and text contrast throughout.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">On</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf021"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-typography" />
                    </span>
                    <p className="choice-tile-title">Large text</p>
                    <p className="fs-12 text-muted mb-0">
                      Increases body text without changing layout.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">On</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf022"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-keyboard" />
                    </span>
                    <p className="choice-tile-title">Keyboard navigation</p>
                    <p className="fs-12 text-muted mb-0">
                      Full tab order with visible skip links.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">On</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf023"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-wand-off" />
                    </span>
                    <p className="choice-tile-title">Reduce motion</p>
                    <p className="fs-12 text-muted mb-0">
                      Removes transitions and background animation.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Off</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf024"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-color-filter" />
                    </span>
                    <p className="choice-tile-title">Colour blind mode</p>
                    <p className="fs-12 text-muted mb-0">
                      Adds shape and label cues alongside colour.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Off</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf025"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-accessible" />
                    </span>
                    <p className="choice-tile-title">Screen reader support</p>
                    <p className="fs-12 text-muted mb-0">
                      Extra landmarks and live-region announcements.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">On</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf026"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile is-on">
                    <span className="choice-tile-icon">
                      <i className="ti ti-focus-2" />
                    </span>
                    <p className="choice-tile-title">Focus indicators</p>
                    <p className="fs-12 text-muted mb-0">
                      A thicker, higher contrast focus ring.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">On</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf027"
                          defaultChecked
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="choice-tile">
                    <span className="choice-tile-icon">
                      <i className="ti ti-book" />
                    </span>
                    <p className="choice-tile-title">Reading mode</p>
                    <p className="fs-12 text-muted mb-0">
                      Narrower measure and larger line height for long text.
                    </p>
                    <div className="choice-tile-foot">
                      <span className="fs-12 text-muted">Off</span>
                      <div className="form-check form-switch mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="pf028"
                          aria-label="Toggle setting"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-region"
              role="tabpanel"
              aria-labelledby="pt-region"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Language &amp; Region</h2>
                  <p className="section-head-sub">
                    Language, calendar, clock and currency. These also set the
                    defaults for anything you export.
                  </p>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-language" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Language &amp; Region</p>
                    <p className="fs-12 text-muted mb-0">
                      How text, dates and numbers are presented
                    </p>
                  </div>
                  <span className="meta-badge is-active">English (UK)</span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-language" />
                  </span>
                  <div className="option-item-text">
                    <span>Interface language</span>
                    <p>Applies to menus, labels and system messages.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="English (UK)">
                      <option>English (UK)</option>
                      <option>English (US)</option>
                      <option>Hindi</option>
                      <option>Tamil</option>
                      <option>Malayalam</option>
                      <option>Kannada</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-flag" />
                  </span>
                  <div className="option-item-text">
                    <span>Region</span>
                    <p>Sets the default calendar and holiday list.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="India">
                      <option>India</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>Singapore</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-calendar" />
                  </span>
                  <div className="option-item-text">
                    <span>Date format</span>
                    <p>Used everywhere a date is written out.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="DD MMM YYYY · 04 Aug 2026"
                    >
                      <option>DD MMM YYYY · 04 Aug 2026</option>
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-clock" />
                  </span>
                  <div className="option-item-text">
                    <span>Time format</span>
                    <p>Twelve or twenty-four hour clock.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn">
                        12-hour
                      </button>
                      <button type="button" className="segmented-btn active">
                        24-hour
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-world" />
                  </span>
                  <div className="option-item-text">
                    <span>Timezone</span>
                    <p>All timestamps are shown in this zone.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Asia/Kolkata · UTC +05:30"
                    >
                      <option>Asia/Kolkata · UTC +05:30</option>
                      <option>Asia/Dubai</option>
                      <option>Europe/London</option>
                      <option>America/New_York</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-calendar-week" />
                  </span>
                  <div className="option-item-text">
                    <span>Week starts on</span>
                    <p>Affects calendars and weekly reports.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn active">
                        Monday
                      </button>
                      <button type="button" className="segmented-btn">
                        Sunday
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-currency-rupee" />
                  </span>
                  <div className="option-item-text">
                    <span>Currency</span>
                    <p>Used on invoices, fees and financial reports.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="INR · ₹">
                      <option>INR · ₹</option>
                      <option>USD · $</option>
                      <option>GBP · £</option>
                      <option>AED · د.إ</option>
                    </select>
                  </span>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-productivity"
              role="tabpanel"
              aria-labelledby="pt-productivity"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Productivity</h2>
                  <p className="section-head-sub">
                    Search, auto-save and the shortcuts that save the most time.
                  </p>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-bolt" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Working faster</p>
                    <p className="fs-12 text-muted mb-0">
                      Search, saving and the things you reach for often
                    </p>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-device-floppy" />
                  </span>
                  <div className="option-item-text">
                    <span>Auto save</span>
                    <p>Save drafts as you type, without a save button.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf029"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-search" />
                  </span>
                  <div className="option-item-text">
                    <span>Quick search</span>
                    <p>Search within the current module as you type.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf030"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-world-search" />
                  </span>
                  <div className="option-item-text">
                    <span>Global search</span>
                    <p>Search across every module from the header.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf031"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-command" />
                  </span>
                  <div className="option-item-text">
                    <span>Command palette</span>
                    <p>Jump to any page or action from the keyboard.</p>
                  </div>
                  <div className="option-item-control">
                    <span className="key-list">
                      <kbd>Ctrl</kbd>
                      <span>+</span>
                      <kbd>K</kbd>
                    </span>
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf032"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-clock" />
                  </span>
                  <div className="option-item-text">
                    <span>Recent items</span>
                    <p>Keep the last twenty records you opened.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Last 20 items"
                    >
                      <option>Last 20 items</option>
                      <option>Last 50 items</option>
                      <option>Last 100 items</option>
                      <option>Do not keep</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-star" />
                  </span>
                  <div className="option-item-text">
                    <span>Favourites</span>
                    <p>A starred list pinned to the top of the sidebar.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf033"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-clipboard" />
                  </span>
                  <div className="option-item-text">
                    <span>Clipboard history</span>
                    <p>
                      Remember the last ten things you copied. This device only.
                    </p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf034"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Keyboard shortcuts</p>
                    <p className="fs-12 text-muted mb-0">
                      Eight shortcuts are active on this account
                    </p>
                  </div>
                  <span className="meta-badge is-plain">Customisable</span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Open command palette</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>Ctrl</kbd>
                      <span>+</span>
                      <kbd>K</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Global search</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>Ctrl</kbd>
                      <span>+</span>
                      <kbd>/</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>New record</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>Ctrl</kbd>
                      <span>+</span>
                      <kbd>N</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Save</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>Ctrl</kbd>
                      <span>+</span>
                      <kbd>S</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Toggle sidebar</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>Ctrl</kbd>
                      <span>+</span>
                      <kbd>B</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Go to dashboard</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>G</kbd>
                      <span>+</span>
                      <kbd>D</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Go to notifications</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>G</kbd>
                      <span>+</span>
                      <kbd>N</kbd>
                    </span>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-keyboard" />
                  </span>
                  <span className="option-item-text">
                    <span>Close panel</span>
                  </span>
                  <span className="option-item-control">
                    <span className="key-list">
                      <kbd>Esc</kbd>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-privacy"
              role="tabpanel"
              aria-labelledby="pt-privacy"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Privacy &amp; Security</h2>
                  <p className="section-head-sub">
                    How long you stay signed in, what is remembered, and what
                    the platform records about you.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#privacy_settings"
                  >
                    <i className="ti ti-shield-lock me-1" />
                    Privacy details
                  </a>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-lock" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Session &amp; access</p>
                    <p className="fs-12 text-muted mb-0">
                      Who stays signed in, and for how long
                    </p>
                  </div>
                  <span className="meta-badge is-active">2FA on</span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-logout" />
                  </span>
                  <div className="option-item-text">
                    <span>Auto logout</span>
                    <p>Sign out after a period of inactivity.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="After 30 minutes"
                    >
                      <option>After 30 minutes</option>
                      <option>After 1 hour</option>
                      <option>After 4 hours</option>
                      <option>Never</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-device-laptop" />
                  </span>
                  <div className="option-item-text">
                    <span>Remember this device</span>
                    <p>Skip two-factor on devices you have confirmed.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf035"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-hourglass" />
                  </span>
                  <div className="option-item-text">
                    <span>Session timeout warning</span>
                    <p>Warn two minutes before signing out.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf036"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-shield-lock" />
                  </span>
                  <div className="option-item-text">
                    <span>Two-factor prompt</span>
                    <p>How often to re-confirm on a known device.</p>
                  </div>
                  <span className="option-item-control">
                    <select
                      className="inline-select"
                      aria-label="Every 30 days"
                    >
                      <option>Every 30 days</option>
                      <option>Every 7 days</option>
                      <option>Every sign-in</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-bell-ringing" />
                  </span>
                  <div className="option-item-text">
                    <span>Login notifications</span>
                    <p>Email me when a new device signs in.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf037"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-eye-off" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Privacy</p>
                    <p className="fs-12 text-muted mb-0">
                      What the platform records about how you work
                    </p>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-eye-off" />
                  </span>
                  <div className="option-item-text">
                    <span>Privacy mode</span>
                    <p>Blur names and photographs on shared screens.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf038"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-chart-dots" />
                  </span>
                  <div className="option-item-text">
                    <span>Activity tracking</span>
                    <p>
                      Record which pages you open, for your own history only.
                    </p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf039"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-alert-triangle" />
                  </span>
                  <div className="option-item-text">
                    <span>Security alerts</span>
                    <p>Notify me about unusual account activity.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf040"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-trash" />
                  </span>
                  <div className="option-item-text">
                    <span>Clear local data</span>
                    <p>
                      Remove cached records and recent items from this device.
                    </p>
                  </div>
                  <span className="option-item-control">
                    <a
                      href="javascript:void(0);"
                      className="btn btn-sm btn-outline-light bg-white"
                      data-bs-toggle="modal"
                      data-bs-target="#reset_category"
                    >
                      <i className="ti ti-trash me-1" />
                      Clear
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-system"
              role="tabpanel"
              aria-labelledby="pt-system"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">System Defaults</h2>
                  <p className="section-head-sub">
                    Applied to new accounts and to anything exported, printed or
                    listed.
                  </p>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-server-cog" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">System defaults</p>
                    <p className="fs-12 text-muted mb-0">
                      Applied to new users unless they change them
                    </p>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-download" />
                  </span>
                  <div className="option-item-text">
                    <span>Download format</span>
                    <p>The format offered first when exporting.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="PDF">
                      <option>PDF</option>
                      <option>XLSX</option>
                      <option>CSV</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-printer" />
                  </span>
                  <div className="option-item-text">
                    <span>Print layout</span>
                    <p>Paper size and orientation for printed pages.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="A4 portrait">
                      <option>A4 portrait</option>
                      <option>A4 landscape</option>
                      <option>Letter portrait</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-photo" />
                  </span>
                  <div className="option-item-text">
                    <span>Include branding on prints</span>
                    <p>Crest and letterhead on every printed page.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf041"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-table" />
                  </span>
                  <div className="option-item-text">
                    <span>Rows per page</span>
                    <p>The default page size for lists.</p>
                  </div>
                  <span className="option-item-control">
                    <select className="inline-select" aria-label="25 rows">
                      <option>25 rows</option>
                      <option>50 rows</option>
                      <option>100 rows</option>
                    </select>
                  </span>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-list-details" />
                  </span>
                  <div className="option-item-text">
                    <span>List view</span>
                    <p>How records are shown when a module opens.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn active">
                        <i className="ti ti-list" />
                        List
                      </button>
                      <button type="button" className="segmented-btn">
                        <i className="ti ti-layout-grid" />
                        Grid
                      </button>
                      <button type="button" className="segmented-btn">
                        <i className="ti ti-table" />
                        Table
                      </button>
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-calendar" />
                  </span>
                  <div className="option-item-text">
                    <span>Calendar view</span>
                    <p>The default span when a calendar opens.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="segmented">
                      <button type="button" className="segmented-btn">
                        Day
                      </button>
                      <button type="button" className="segmented-btn">
                        Week
                      </button>
                      <button type="button" className="segmented-btn active">
                        Month
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="option-group">
                <div className="option-group-head">
                  <span className="option-item-icon">
                    <i className="ti ti-flask" />
                  </span>
                  <div className="flex-fill overflow-hidden">
                    <p className="option-group-title">Experimental features</p>
                    <p className="fs-12 text-muted mb-0">
                      Early features that may change or be withdrawn
                    </p>
                  </div>
                  <span className="meta-badge is-pending">Opt-in</span>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-sparkles" />
                  </span>
                  <div className="option-item-text">
                    <span>AI draft suggestions inline</span>
                    <p>Show AI drafts directly in forms as you type.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf042"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-message-2" />
                  </span>
                  <div className="option-item-text">
                    <span>Multilingual parent drafts</span>
                    <p>Draft parent messages in the household language.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf043"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item is-off">
                  <span className="option-item-icon">
                    <i className="ti ti-plug-connected" />
                  </span>
                  <div className="option-item-text">
                    <span>Automation chaining</span>
                    <p>Let one routine trigger the next automatically.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf044"
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
                <div className="option-item">
                  <span className="option-item-icon">
                    <i className="ti ti-crystal-ball" />
                  </span>
                  <div className="option-item-text">
                    <span>Three-year outlook</span>
                    <p>Long-range projections on the AI Command Center.</p>
                  </div>
                  <div className="option-item-control">
                    <div className="form-check form-switch mb-0">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="pf045"
                        defaultChecked
                        aria-label="Toggle setting"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pp-audit"
              role="tabpanel"
              aria-labelledby="pt-audit"
              tabIndex={0}
            >
              <div className="section-head">
                <div>
                  <h2 className="section-head-title">Audit History</h2>
                  <p className="section-head-sub">
                    Every change to these preferences, who made it and what the
                    value was before.
                  </p>
                </div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <a
                    href="javascript:void(0);"
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    data-bs-toggle="modal"
                    data-bs-target="#export_preferences"
                  >
                    <i className="ti ti-file-export me-1" />
                    Export log
                  </a>
                </div>
              </div>
              <div className="card">
                <div className="card-body">
                  <div className="audit-trail">
                    <div className="audit-event is-done">
                      <div className="flex-fill overflow-hidden">
                        <p className="audit-event-title">Preferences created</p>
                        <p className="fs-13 text-muted mb-0">
                          Defaults applied when the account was provisioned.
                        </p>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="d-block fs-12 fw-medium text-dark">
                          System
                        </span>
                        <span className="d-block fs-12 text-muted">
                          14 Jun 2024, 09:00
                        </span>
                      </div>
                    </div>
                    <div className="audit-event is-done">
                      <div className="flex-fill overflow-hidden">
                        <p className="audit-event-title">Appearance updated</p>
                        <p className="fs-13 text-muted mb-0">
                          Accent colour changed and density set to comfortable.
                        </p>
                        <div className="delta-value">
                          <s>Teal</s>
                          <i className="ti ti-arrow-right" />
                          <b>Indigo</b>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="d-block fs-12 fw-medium text-dark">
                          You
                        </span>
                        <span className="d-block fs-12 text-muted">
                          02 Feb 2026, 16:12
                        </span>
                      </div>
                    </div>
                    <div className="audit-event is-done">
                      <div className="flex-fill overflow-hidden">
                        <p className="audit-event-title">
                          Notifications changed
                        </p>
                        <p className="fs-13 text-muted mb-0">
                          Email switched from immediate to a daily digest.
                        </p>
                        <div className="delta-value">
                          <s>Immediately</s>
                          <i className="ti ti-arrow-right" />
                          <b>Daily at 07:00</b>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="d-block fs-12 fw-medium text-dark">
                          You
                        </span>
                        <span className="d-block fs-12 text-muted">
                          18 Apr 2026, 08:44
                        </span>
                      </div>
                    </div>
                    <div className="audit-event is-done">
                      <div className="flex-fill overflow-hidden">
                        <p className="audit-event-title">
                          Accessibility updated
                        </p>
                        <p className="fs-13 text-muted mb-0">
                          High contrast, large text and focus indicators
                          enabled.
                        </p>
                        <div className="delta-value">
                          <s>0 aids</s>
                          <i className="ti ti-arrow-right" />
                          <b>3 aids</b>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="d-block fs-12 fw-medium text-dark">
                          You
                        </span>
                        <span className="d-block fs-12 text-muted">
                          09 Jun 2026, 13:30
                        </span>
                      </div>
                    </div>
                    <div className="audit-event is-done">
                      <div className="flex-fill overflow-hidden">
                        <p className="audit-event-title">Security modified</p>
                        <p className="fs-13 text-muted mb-0">
                          Auto logout shortened across all administrator
                          accounts.
                        </p>
                        <div className="delta-value">
                          <s>4 hours</s>
                          <i className="ti ti-arrow-right" />
                          <b>30 minutes</b>
                        </div>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="d-block fs-12 fw-medium text-dark">
                          IT administrator
                        </span>
                        <span className="d-block fs-12 text-muted">
                          21 Jul 2026, 10:05
                        </span>
                      </div>
                    </div>
                    <div className="audit-event is-now">
                      <div className="flex-fill overflow-hidden">
                        <p className="audit-event-title">Preferences saved</p>
                        <p className="fs-13 text-muted mb-0">
                          Quiet hours enabled and the command palette turned on.
                        </p>
                      </div>
                      <div className="text-end flex-shrink-0">
                        <span className="d-block fs-12 fw-medium text-dark">
                          You
                        </span>
                        <span className="d-block fs-12 text-muted">
                          Today, 11:20
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
      {/* /Preferences Workspace */}
    </div>
  </div>
  {/* /Page Wrapper */}
</>

  )
}

export default Preferences