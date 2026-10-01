
const SecuritySettingsModal = () => {
  return (
    <>
  {/* ===================== REUSABLE SECURITY WORKSPACE ===================== */}
  <div
    className="offcanvas offcanvas-end acs-canvas"
    tabIndex={-1}
    id="acs_workspace"
    aria-labelledby="acs_workspace_label"
    role="region"
  >
    <div className="acs-canvas-head">
      <span className="acs-card-ic">
        <i className="ti ti-device-mobile-check" />
      </span>
      <div className="flex-fill overflow-hidden">
        <h5 className="offcanvas-title mb-1" id="acs_workspace_label">
          Two-factor authentication
        </h5>
        <p className="fs-12 mb-0">
          Armed 22 Feb 2026 · authenticator app · last used today at 08:42 AM
        </p>
      </div>
      <span className="acs-badge is-safe">
        <i className="ti ti-shield-check" />
        Armed
      </span>
      <button
        type="button"
        className="btn-close ms-2"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      />
    </div>
    <div className="offcanvas-body acs-canvas-body">
      <div className="row g-4">
        <div className="col-xl-7">
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-file-description" />
              Configuration details
            </h6>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Method</span>
                <strong>Time-based one-time password (TOTP)</strong>
              </div>
              <div className="acs-fact-ctl" />
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Application</span>
                <strong>Google Authenticator</strong>
              </div>
              <div className="acs-fact-ctl" />
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Enrolled device</span>
                <strong>Pixel 9 · primary phone</strong>
              </div>
              <div className="acs-fact-ctl" />
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Enrolled on</span>
                <strong>22 February 2026 by the account holder</strong>
              </div>
              <div className="acs-fact-ctl" />
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Last accepted</span>
                <strong>Today at 08:42:11 AM</strong>
              </div>
              <div className="acs-fact-ctl" />
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Failures in 90 days</span>
                <strong>None</strong>
              </div>
              <div className="acs-fact-ctl" />
            </div>
          </div>
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-adjustments" />
              Current configuration
            </h6>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Required at sign-in</span>
                <strong>Every time, including trusted devices</strong>
              </div>
              <div className="acs-fact-ctl">
                <div className="form-check form-switch mb-0">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="acs_sw_37"
                    defaultChecked
                  />
                  <label
                    className="form-check-label visually-hidden"
                    htmlFor="acs_sw_37"
                  >
                    Enable
                  </label>
                </div>
              </div>
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Code length</span>
                <strong>Six digits</strong>
              </div>
              <div className="acs-fact-ctl">
                <select className="acs-select" aria-label="Setting value">
                  <option>6 digits</option>
                  <option>8 digits</option>
                </select>
              </div>
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Rotation</span>
                <strong>Every 30 seconds</strong>
              </div>
              <div className="acs-fact-ctl">
                <select className="acs-select" aria-label="Setting value">
                  <option>30 seconds</option>
                  <option>60 seconds</option>
                </select>
              </div>
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Clock drift allowance</span>
                <strong>One window either side</strong>
              </div>
              <div className="acs-fact-ctl">
                <select className="acs-select" aria-label="Setting value">
                  <option>1 window</option>
                  <option>2 windows</option>
                  <option>None</option>
                </select>
              </div>
            </div>
            <div className="acs-fact">
              <div className="acs-fact-txt">
                <span>Recovery codes</span>
                <strong>8 of 10 unused</strong>
              </div>
              <div className="acs-fact-ctl">
                <span className="acs-badge is-safe">Healthy</span>
              </div>
            </div>
          </div>
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-history" />
              Recent changes
            </h6>
            <div className="acs-check">
              <i className="ti ti-point-filled" />
              <div>
                Recovery code 6 spent
                <span>
                  02 Jun 2026 · authenticator unavailable while travelling
                </span>
              </div>
            </div>
            <div className="acs-check">
              <i className="ti ti-point-filled" />
              <div>
                Authenticator re-enrolled on a new phone
                <span>14 Mar 2026 · old enrolment revoked the same day</span>
              </div>
            </div>
            <div className="acs-check">
              <i className="ti ti-point-filled" />
              <div>
                Trusted-device skip switched off
                <span>01 Mar 2026 · two-factor now asked for every time</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-5">
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-shield-half" />
              Security status
            </h6>
            <div className="acs-check">
              <i className="ti ti-circle-check" />
              <div>
                A second factor is required at every sign-in
                <span>
                  Including on trusted devices, which is stricter than most
                  schools run.
                </span>
              </div>
            </div>
            <div className="acs-check">
              <i className="ti ti-circle-check" />
              <div>
                Codes rotate every 30 seconds
                <span>
                  A code seen over someone’s shoulder is useless within half a
                  minute.
                </span>
              </div>
            </div>
            <div className="acs-check">
              <i className="ti ti-circle-check" />
              <div>
                Eight recovery codes unused
                <span>
                  Enough to get back in if the phone is lost or replaced.
                </span>
              </div>
            </div>
            <div className="acs-check is-watch">
              <i className="ti ti-alert-circle" />
              <div>
                Only one enrolled device
                <span>
                  If the phone is lost you would depend entirely on the printed
                  codes. A second device or a hardware key would remove that
                  dependency.
                </span>
              </div>
            </div>
          </div>
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-bulb" />
              Recommendations
            </h6>
            <div className="acs-check">
              <i className="ti ti-arrow-right" />
              <div>
                Register a hardware security key
                <span>
                  It cannot be phished, and it removes the single-device
                  dependency above.
                </span>
              </div>
            </div>
            <div className="acs-check">
              <i className="ti ti-arrow-right" />
              <div>
                Keep the printed codes somewhere you can reach without the phone
                <span>
                  A code in a note on the same phone protects nothing.
                </span>
              </div>
            </div>
            <div className="acs-check">
              <i className="ti ti-arrow-right" />
              <div>
                Leave SMS switched off
                <span>
                  A text can be redirected by swapping the SIM, which is a real
                  and common attack.
                </span>
              </div>
            </div>
          </div>
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-link" />
              Related settings
            </h6>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-lifebuoy" />
              Recovery codes
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-devices" />
              Trusted devices
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-key" />
              Password policy
            </span>
            <span className="badge-meta me-1 mb-1">
              <i className="ti ti-bell" />
              Security notifications
            </span>
          </div>
          <div className="acs-sect">
            <h6 className="acs-sect-title">
              <i className="ti ti-file-search" />
              Audit history
            </h6>
            <div className="acs-audit">
              <div className="acs-audit-when">
                <strong>02 Jun 2026</strong>11:26
              </div>
              <div className="acs-audit-what">
                Recovery code spent<span>Code 6 of 10</span>
              </div>
            </div>
            <div className="acs-audit">
              <div className="acs-audit-when">
                <strong>14 Mar 2026</strong>09:48
              </div>
              <div className="acs-audit-what">
                Authenticator re-enrolled<span>Phone replacement</span>
              </div>
            </div>
            <div className="acs-audit">
              <div className="acs-audit-when">
                <strong>01 Mar 2026</strong>08:20
              </div>
              <div className="acs-audit-what">
                Trusted-device skip disabled<span>Ms. Latha Rao</span>
              </div>
            </div>
            <div className="acs-audit">
              <div className="acs-audit-when">
                <strong>22 Feb 2026</strong>09:15
              </div>
              <div className="acs-audit-what">
                Two-factor enabled<span>Ms. Latha Rao · 10 codes issued</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="acs-card-foot justify-content-end">
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
        data-bs-target="#acs_verify"
      >
        <i className="ti ti-scan me-1" />
        Verify identity
      </button>
      <button
        type="button"
        className="btn btn-primary d-inline-flex align-items-center"
        data-bs-toggle="modal"
        data-bs-target="#acs_2fa"
      >
        <i className="ti ti-device-floppy me-1" />
        Save changes
      </button>
    </div>
  </div>
  {/* /Reusable Security Workspace */}
  {/* Change password */}
  <div
    className="modal fade"
    id="acs_password"
    tabIndex={-1}
    aria-labelledby="acs_password_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic">
            <i className="ti ti-key" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_password_l">
              Change password
            </h5>
            <p>Every other session will be signed out</p>
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
            <label className="form-label" htmlFor="pw_old">
              Current password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="form-control"
              id="pw_old"
              placeholder="Enter your current password"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="pw_new">
              New password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="form-control"
              id="pw_new"
              placeholder="At least 12 characters"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="pw_rep">
              Confirm new password
            </label>
            <input
              type="password"
              autoComplete="new-password"
              className="form-control"
              id="pw_rep"
              placeholder="Type it again"
            />
          </div>
          <span className="acs-lbl">Must satisfy</span>
          <div className="row">
            <div className="col-md-6">
              <div className="acs-rule is-off">
                <i className="ti ti-circle" />
                At least 12 characters
              </div>
              <div className="acs-rule is-off">
                <i className="ti ti-circle" />
                Upper and lower case
              </div>
              <div className="acs-rule is-off">
                <i className="ti ti-circle" />A number and a symbol
              </div>
            </div>
            <div className="col-md-6">
              <div className="acs-rule is-off">
                <i className="ti ti-circle" />
                Not in a public breach list
              </div>
              <div className="acs-rule is-off">
                <i className="ti ti-circle" />
                Not one of your last 5
              </div>
              <div className="acs-rule is-off">
                <i className="ti ti-circle" />
                Does not contain your name
              </div>
            </div>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            A notice is sent to the account address and, once one is set, to the
            recovery address as well.
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
            Change password
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Change password */}
  {/* Two-factor authentication */}
  <div
    className="modal fade"
    id="acs_2fa"
    tabIndex={-1}
    aria-labelledby="acs_2fa_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic is-safe">
            <i className="ti ti-device-mobile-check" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_2fa_l">
              Two-factor authentication
            </h5>
            <p>Manage the second factor</p>
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
            <label className="form-label" htmlFor="fa_m">
              Method
            </label>
            <select className="form-select" id="fa_m">
              <option>Authenticator app (TOTP)</option>
              <option>Hardware security key</option>
              <option>Passkey</option>
              <option>SMS code — not recommended</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="fa_c">
              Confirm with a current code
            </label>
            <input
              type="text"
              className="form-control acs-mono"
              id="fa_c"
              placeholder="6-digit code"
              maxLength={6}
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="fa_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="fa_1">
              Require a second factor on trusted devices too
            </label>
          </div>
          <div className="form-check">
            <input className="form-check-input" type="checkbox" id="fa_2" />
            <label className="form-check-label fs-13" htmlFor="fa_2">
              Generate a fresh set of recovery codes{" "}
              <span className="text-muted">
                — this invalidates the 8 unused codes you hold
              </span>
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            Changing the second factor sends a notice to the account address and
            the recovery address.
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
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Two-factor authentication */}
  {/* Verify identity */}
  <div
    className="modal fade"
    id="acs_verify"
    tabIndex={-1}
    aria-labelledby="acs_verify_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic">
            <i className="ti ti-scan" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_verify_l">
              Verify identity
            </h5>
            <p>Asked before any sensitive change</p>
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
            Confirm it is you before this account’s protection is altered. This
            step exists so that someone who finds your screen unlocked still
            cannot change how you sign in.
          </p>
          <div className="mb-3">
            <label className="form-label" htmlFor="v_code">
              Code from your authenticator app
            </label>
            <input
              type="text"
              className="form-control acs-mono"
              id="v_code"
              placeholder="6-digit code"
              maxLength={6}
            />
          </div>
          <div className="acs-check">
            <i className="ti ti-circle-check" />
            <div>
              Signed in from a trusted device
              <span>Office desktop · Chennai · 08:42 AM today.</span>
            </div>
          </div>
          <div className="acs-check">
            <i className="ti ti-circle-check" />
            <div>
              Session is 12 minutes old
              <span>Well inside the 30-minute idle window.</span>
            </div>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            Lost your phone? Use one of your eight remaining recovery codes
            instead.
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
            Verify
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Verify identity */}
  {/* Add trusted device */}
  <div
    className="modal fade"
    id="acs_device"
    tabIndex={-1}
    aria-labelledby="acs_device_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic">
            <i className="ti ti-device-desktop-plus" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_device_l">
              Add trusted device
            </h5>
            <p>This device will be remembered</p>
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
            <label className="form-label" htmlFor="d_name">
              Device name
            </label>
            <input
              type="text"
              className="form-control"
              id="d_name"
              defaultValue="Office desktop — Dell OptiPlex"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="d_type">
              Device type
            </label>
            <select className="form-select" id="d_type">
              <option>Desktop</option>
              <option>Laptop</option>
              <option>Phone</option>
              <option>Tablet</option>
              <option>Hardware security key</option>
            </select>
          </div>
          <span className="acs-lbl">Detected</span>
          <div className="acs-fact">
            <div className="acs-fact-txt">
              <span>Browser</span>
              <strong>Chrome 127</strong>
            </div>
          </div>
          <div className="acs-fact">
            <div className="acs-fact-txt">
              <span>Operating system</span>
              <strong>Windows 11</strong>
            </div>
          </div>
          <div className="acs-fact">
            <div className="acs-fact-txt">
              <span>Address</span>
              <strong className="acs-mono">
                103.21.58.14 · Chennai, India
              </strong>
            </div>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            Trusting a device does not skip two-factor on this account. It only
            stops the new-device notice each time you sign in.
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
            Add device
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Add trusted device */}
  {/* Remove device */}
  <div
    className="modal fade"
    id="acs_removedevice"
    tabIndex={-1}
    aria-labelledby="acs_removedevice_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic is-risk">
            <i className="ti ti-device-mobile-off" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_removedevice_l">
              Remove device
            </h5>
            <p>Samsung Galaxy Tab S9</p>
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
            Removing a device withdraws its trust. Anyone signing in from it
            will be treated as new: a verification email first, then two-factor.
          </p>
          <div className="acs-check is-watch">
            <i className="ti ti-alert-circle" />
            <div>
              Not seen in 94 days
              <span>Last active 29 April 2026 from Chennai.</span>
            </div>
          </div>
          <div className="acs-check">
            <i className="ti ti-circle-check" />
            <div>
              No active session on this device
              <span>Nobody will be signed out by this.</span>
            </div>
          </div>
          <div className="acs-check">
            <i className="ti ti-circle-check" />
            <div>
              Not holding your authenticator
              <span>
                Your second factor is on the Pixel 9 and is unaffected.
              </span>
            </div>
          </div>
          <div className="mb-0 mt-3">
            <label className="form-label" htmlFor="rd_why">
              Reason for the audit record
            </label>
            <input
              type="text"
              className="form-control"
              id="rd_why"
              placeholder="For example: tablet retired"
            />
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
            Remove device
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Remove device */}
  {/* End sessions */}
  <div
    className="modal fade"
    id="acs_terminate"
    tabIndex={-1}
    aria-labelledby="acs_terminate_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic is-risk">
            <i className="ti ti-logout" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_terminate_l">
              End sessions
            </h5>
            <p>Signs the chosen devices out immediately</p>
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
            <label className="form-label" htmlFor="t_scope">
              End
            </label>
            <select className="form-select" id="t_scope">
              <option>All sessions except this one</option>
              <option>The idle Safari session only</option>
              <option>Every session, including this one</option>
              <option>The reporting integration key</option>
            </select>
          </div>
          <div className="acs-check is-watch">
            <i className="ti ti-alert-circle" />
            <div>
              3 sessions would end
              <span>
                Android phone, Safari on macOS, and the reporting integration.
              </span>
            </div>
          </div>
          <div className="acs-check">
            <i className="ti ti-circle-check" />
            <div>
              Trust is not withdrawn
              <span>
                Those devices stay on the trusted list; they simply have to sign
                in again.
              </span>
            </div>
          </div>
          <div className="acs-check is-watch">
            <i className="ti ti-alert-circle" />
            <div>
              The reporting integration will stop
              <span>
                Scheduled reports fail until the key is used again or reissued.
              </span>
            </div>
          </div>
          <div className="form-check mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="t_notify"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="t_notify">
              Send a notice to the account address
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
            End sessions
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /End sessions */}
  {/* Update recovery options */}
  <div
    className="modal fade"
    id="acs_recovery"
    tabIndex={-1}
    aria-labelledby="acs_recovery_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic is-watch">
            <i className="ti ti-lifebuoy" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_recovery_l">
              Update recovery options
            </h5>
            <p>How you get back in</p>
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
            <label className="form-label" htmlFor="r_mail">
              Recovery email
            </label>
            <input
              type="email"
              className="form-control"
              id="r_mail"
              placeholder="A personal address, outside preskool.edu"
            />
            <p className="fs-12 text-muted mb-0 mt-1">
              An address on the school domain cannot recover an account that is
              locked out of the school domain. That is why this one is worth
              setting.
            </p>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="r_phone">
              Recovery phone
            </label>
            <input
              type="tel"
              className="form-control"
              id="r_phone"
              defaultValue="+91 98765 44710"
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="r_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="r_1">
              Notify both the old and the new address when this changes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="r_2"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="r_2">
              Require a code from the authenticator before saving
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            A verification link is sent to the new address. It is not used for
            recovery until you follow it.
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
            Send verification
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Update recovery options */}
  {/* Export security log */}
  <div
    className="modal fade"
    id="acs_export"
    tabIndex={-1}
    aria-labelledby="acs_export_l"
    aria-hidden="true"
    role="region"
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="acs-card-head border-bottom">
          <span className="acs-card-ic">
            <i className="ti ti-download" />
          </span>
          <div className="flex-fill overflow-hidden">
            <h5 className="acs-card-title mb-0" id="acs_export_l">
              Export security log
            </h5>
            <p>A record you can keep</p>
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
            <label className="form-label" htmlFor="x_range">
              Period
            </label>
            <select className="form-select" id="x_range">
              <option>Last 90 days</option>
              <option>This academic year</option>
              <option>Everything — since 14 Jan 2019</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="x_fmt">
              Format
            </label>
            <select className="form-select" id="x_fmt">
              <option>PDF — signed and timestamped</option>
              <option>CSV</option>
              <option>JSON</option>
            </select>
          </div>
          <span className="acs-lbl">Include</span>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="x_1"
              defaultChecked
            />
            <label className="form-check-label fs-13" htmlFor="x_1">
              Sign-in history, successful and refused
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
              Device and session changes
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
              Authentication and permission changes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="x_4"
              disabled
            />
            <label className="form-check-label fs-13 text-muted" htmlFor="x_4">
              Passwords and recovery codes — never exported
            </label>
          </div>
          <p className="fs-12 text-muted mb-0 mt-3">
            The export itself is recorded in the audit history, including who
            requested it.
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
            Export
          </button>
        </div>
      </div>
    </div>
  </div>
  {/* /Export security log */}
</>

  )
}

export default SecuritySettingsModal