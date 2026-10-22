
const ConnectedAppsModal = () => {
  return (
    <>
  {/* Connect App */}
  <div className="modal fade" id="connect_app">
    <div className="modal-dialog modal-dialog-centered  connected-app-modal">
      <div className="modal-content">
        <div className="modal-body">
          <div className="d-flex align-items-center justify-content-center">
            <span className="modal-logo-small me-3">
              <img src="assets/img/icons/modal-small-logo.svg" alt="Img" />
            </span>
            <div className="connected-design">
              <span />
              <span />
            </div>
            <span>
              <img src="assets/img/icons/connected-app-01.svg" alt="Img" />
            </span>
          </div>
          <div className="border-bottom pb-3 mb-3">
            <h5 className="mb-2">Connect with Slack</h5>
            <p>Confirm requirements to connect with Slack</p>
          </div>
          <div>
            <h5 className="mb-2">Slack requires :</h5>
            <ul>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                New Slack Workspace for communication
              </li>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Slack API to interact with Slack
              </li>
              <li className="d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Implement OAuth 2.0 for authorization
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <form action="connected-apps.html" className="w-100">
            <div className="d-flex align-items-center mb-3">
              <input type="text" className="form-control flex-fill" />
              <a className="border rounded d-flex align-items-center justify-content-center p-2 ms-3">
                <i className="ti ti-copy" />
              </a>
            </div>
            <div className="d-flex align-items-center">
              <button type="button" className="btn btn-light me-3 flex-fill">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-fill">
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Connect App */}
  {/* Connect App */}
  <div className="modal fade" id="connect_app_two">
    <div className="modal-dialog modal-dialog-centered  connected-app-modal">
      <div className="modal-content">
        <div className="modal-body">
          <div className="d-flex align-items-center justify-content-center">
            <span className="modal-logo-small me-3">
              <img src="assets/img/icons/modal-small-logo.svg" alt="Img" />
            </span>
            <div className="connected-design">
              <span />
              <span />
            </div>
            <span>
              <img src="assets/img/icons/connected-app-02.svg" alt="Img" />
            </span>
          </div>
          <div className="border-bottom pb-3 mb-3">
            <h5 className="mb-2">Connect with Google Calendar</h5>
            <p>Confirm requirements to connect with Google Calendar</p>
          </div>
          <div>
            <h5 className="mb-2">Slack requires :</h5>
            <ul>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-16" />
                </span>
                New Slack Workspace for communication
              </li>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Slack API to interact with Slack
              </li>
              <li className="d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Implement OAuth 2.0 for authorization
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <form action="connected-apps.html" className="w-100">
            <div className="d-flex align-items-center mb-3">
              <input type="text" className="form-control flex-fill" />
              <a className="border rounded d-flex align-items-center justify-content-center p-2 ms-3">
                <i className="ti ti-copy" />
              </a>
            </div>
            <div className="d-flex align-items-center">
              <button type="button" className="btn btn-light me-3 flex-fill">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-fill">
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Connect App */}
  {/* Connect App */}
  <div className="modal fade" id="connect_app_three">
    <div className="modal-dialog modal-dialog-centered  connected-app-modal">
      <div className="modal-content">
        <div className="modal-body">
          <div className="d-flex align-items-center justify-content-center">
            <span className="modal-logo-small me-3">
              <img src="assets/img/icons/modal-small-logo.svg" alt="Img" />
            </span>
            <div className="connected-design">
              <span />
              <span />
            </div>
            <span>
              <img src="assets/img/icons/connected-app-03.svg" alt="Img" />
            </span>
          </div>
          <div className="border-bottom pb-3 mb-3">
            <h5 className="mb-2">Connect with Email</h5>
            <p>Confirm requirements to connect with email</p>
          </div>
          <div>
            <h5 className="mb-2">Slack requires :</h5>
            <ul>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-16" />
                </span>
                New Slack Workspace for communication
              </li>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Slack API to interact with Slack
              </li>
              <li className="d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Implement OAuth 2.0 for authorization
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <form action="connected-apps.html" className="w-100">
            <div className="d-flex align-items-center mb-3">
              <input type="text" className="form-control flex-fill" />
              <a className="border rounded d-flex align-items-center justify-content-center p-2 ms-3">
                <i className="ti ti-copy" />
              </a>
            </div>
            <div className="d-flex align-items-center">
              <button type="button" className="btn btn-light me-3 flex-fill">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-fill">
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Connect App */}
  {/* Connect App */}
  <div className="modal fade" id="connect_app_four">
    <div className="modal-dialog modal-dialog-centered  connected-app-modal">
      <div className="modal-content">
        <div className="modal-body">
          <div className="d-flex align-items-center justify-content-center">
            <span className="modal-logo-small me-3">
              <img src="assets/img/icons/modal-small-logo.svg" alt="Img" />
            </span>
            <div className="connected-design">
              <span />
              <span />
            </div>
            <span>
              <img src="assets/img/icons/connected-app-04.svg" alt="Img" />
            </span>
          </div>
          <div className="border-bottom pb-3 mb-3">
            <h5 className="mb-2">Connect with Github</h5>
            <p>Confirm requirements to connect with Github</p>
          </div>
          <div>
            <h5 className="mb-2">Slack requires :</h5>
            <ul>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-16" />
                </span>
                New Slack Workspace for communication
              </li>
              <li className="mb-2 d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Slack API to interact with Slack
              </li>
              <li className="d-flex align-items-center">
                <span className="avatar avatar-xs rounded-circle flex-shrink-0 bg-success border-0 me-2">
                  <i className="ti ti-check fs-14" />
                </span>
                Implement OAuth 2.0 for authorization
              </li>
            </ul>
          </div>
        </div>
        <div className="modal-footer">
          <form action="connected-apps.html" className="w-100">
            <div className="d-flex align-items-center mb-3">
              <input type="text" className="form-control flex-fill" />
              <a className="border rounded d-flex align-items-center justify-content-center p-2 ms-3">
                <i className="ti ti-copy" />
              </a>
            </div>
            <div className="d-flex align-items-center">
              <button type="button" className="btn btn-light me-3 flex-fill">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-fill">
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  {/* /Connect App */}
</>

  )
}

export default ConnectedAppsModal