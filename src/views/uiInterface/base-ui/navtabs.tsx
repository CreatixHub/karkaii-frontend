const NavTabs = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Nav &amp; Tabs</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Custom Tab</h4>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav custom-tab mb-3" role="tablist">
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct_settings" data-bs-toggle="tab" role="tab" aria-selected="true" className="nav-link active">Settings</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct_history" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link">History</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct_voice" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link">Voice</a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="ct_settings" role="tabpanel">
                                              <p className="mb-0">Adjust the panel preferences, default language and playback quality. Changes apply the next time the panel is opened.</p>
                                          </div>
                                          <div className="tab-pane" id="ct_history" role="tabpanel">
                                              <p className="mb-0">Review everything generated in this workspace, replay any entry and restore an earlier configuration in one click.</p>
                                          </div>
                                          <div className="tab-pane" id="ct_voice" role="tabpanel">
                                              <p className="mb-0">Pick a voice profile, then fine tune pitch, speed and emphasis until the preview sounds the way you want.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Custom Tab Variants</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-2 fs-13 text-muted">With icons</p>
                                      <ul className="nav custom-tab mb-3" role="tablist">
                                          <li className="nav-item" role="presentation">
                                              <a href="#cti_overview" data-bs-toggle="tab" role="tab" aria-selected="true" className="nav-link active"><i className="ti ti-layout-grid"></i>Overview</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#cti_activity" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link"><i className="ti ti-activity"></i>Activity</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#cti_locked" data-bs-toggle="tab" role="tab" tabIndex={-1} className="nav-link disabled"><i className="ti ti-lock"></i>Locked</a>
                                          </li>
                                      </ul>

                                      <div className="tab-content mb-3">
                                          <div className="tab-pane show active" id="cti_overview" role="tabpanel">
                                              <p className="mb-0">A compact summary of the workspace, sized to sit above a dense panel without competing with it.</p>
                                          </div>
                                          <div className="tab-pane" id="cti_activity" role="tabpanel">
                                              <p className="mb-0">Every recent action in order, newest first, so you can trace what changed and who changed it.</p>
                                          </div>
                                          <div className="tab-pane" id="cti_locked" role="tabpanel">
                                              <p className="mb-0">This section is locked for the current role.</p>
                                          </div>
                                      </div>

                                      <p className="mb-2 fs-13 text-muted">Inline &amp; sizes</p>
                                      <div className="d-flex align-items-start flex-wrap gap-2">
                                          <ul className="nav custom-tab custom-tab-inline custom-tab-sm" role="tablist">
                                              <li className="nav-item" role="presentation"><a href="#cts_day" data-bs-toggle="tab" role="tab" className="nav-link active">Day</a></li>
                                              <li className="nav-item" role="presentation"><a href="#cts_week" data-bs-toggle="tab" role="tab" className="nav-link">Week</a></li>
                                              <li className="nav-item" role="presentation"><a href="#cts_month" data-bs-toggle="tab" role="tab" className="nav-link">Month</a></li>
                                          </ul>
                                          <div className="custom-tab custom-tab-inline" role="tablist" aria-label="View mode">
                                              <button type="button" className="nav-link active" role="tab" aria-selected="true">Grid</button>
                                              <button type="button" className="nav-link" role="tab" aria-selected="false">List</button>
                                          </div>
                                      </div>

                                      <div className="tab-content mt-3">
                                          <div className="tab-pane show active" id="cts_day" role="tabpanel"><p className="mb-0 fs-13 text-muted">Showing today only.</p></div>
                                          <div className="tab-pane" id="cts_week" role="tabpanel"><p className="mb-0 fs-13 text-muted">Showing the current week.</p></div>
                                          <div className="tab-pane" id="cts_month" role="tabpanel"><p className="mb-0 fs-13 text-muted">Showing the current month.</p></div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Custom Tab 2</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav custom-tab-2 mb-3" role="tablist">
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct2_overview" data-bs-toggle="tab" role="tab" aria-selected="true" className="nav-link active"><i className="ti ti-layout-grid"></i>Overview</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct2_members" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link"><i className="ti ti-users"></i>Members</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct2_billing" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link"><i className="ti ti-receipt"></i>Billing</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct2_archive" data-bs-toggle="tab" role="tab" tabIndex={-1} className="nav-link disabled">Archive</a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="ct2_overview" role="tabpanel">
                                              <p className="mb-0">The selected tab lifts onto the surface and masks the rule beneath it, so it reads as joined to the panel below.</p>
                                          </div>
                                          <div className="tab-pane" id="ct2_members" role="tabpanel">
                                              <p className="mb-0">Everyone with access to this workspace, along with the role and the date they were invited.</p>
                                          </div>
                                          <div className="tab-pane" id="ct2_billing" role="tabpanel">
                                              <p className="mb-0">Plan, payment method and the invoices raised against this account so far.</p>
                                          </div>
                                          <div className="tab-pane" id="ct2_archive" role="tabpanel">
                                              <p className="mb-0">Archived records are read only.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Custom Tab 3</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav custom-tab-3 mb-3" role="tablist">
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct3_all" data-bs-toggle="tab" role="tab" aria-selected="true" className="nav-link active">All <span className="custom-tab-count">24</span></a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct3_active" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link">Active <span className="custom-tab-count">18</span></a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct3_pending" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link">Pending <span className="custom-tab-count">4</span></a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct3_archived" data-bs-toggle="tab" role="tab" aria-selected="false" className="nav-link"><i className="ti ti-archive"></i>Archived <span className="custom-tab-count">2</span></a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="ct3_all" role="tabpanel">
                                              <p className="mb-0">Outlined chips for filter style switching. The count pill recolours with the chip when it is selected.</p>
                                          </div>
                                          <div className="tab-pane" id="ct3_active" role="tabpanel">
                                              <p className="mb-0">Only records that are currently live and being worked on.</p>
                                          </div>
                                          <div className="tab-pane" id="ct3_pending" role="tabpanel">
                                              <p className="mb-0">Waiting on an approval before they can move forward.</p>
                                          </div>
                                          <div className="tab-pane" id="ct3_archived" role="tabpanel">
                                              <p className="mb-0">Closed out and kept for reference only.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Custom Tab 4</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav custom-tab-4 mb-3" role="tablist">
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct4_grid" data-bs-toggle="tab" role="tab" aria-controls="ct4_grid" aria-selected="true" className="nav-link active"><i className="ti ti-layout-grid"></i>Grid</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct4_list" data-bs-toggle="tab" role="tab" aria-controls="ct4_list" aria-selected="false" className="nav-link"><i className="ti ti-list-details"></i>List</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct4_board" data-bs-toggle="tab" role="tab" aria-controls="ct4_board" aria-selected="false" className="nav-link"><i className="ti ti-columns-3"></i>Board</a>
                                          </li>
                                          <li className="nav-item" role="presentation">
                                              <a href="#ct4_calendar" data-bs-toggle="tab" role="tab" aria-controls="ct4_calendar" aria-selected="false" className="nav-link"><i className="ti ti-calendar-event"></i>Calendar</a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="ct4_grid" role="tabpanel">
                                              <p className="mb-0">Equal width tiles with the icon stacked over the label, for a small set of top level view modes.</p>
                                          </div>
                                          <div className="tab-pane" id="ct4_list" role="tabpanel">
                                              <p className="mb-0">A dense row per record, best when you need to compare many fields at once.</p>
                                          </div>
                                          <div className="tab-pane" id="ct4_board" role="tabpanel">
                                              <p className="mb-0">Cards grouped into columns by status, dragged across as work progresses.</p>
                                          </div>
                                          <div className="tab-pane" id="ct4_calendar" role="tabpanel">
                                              <p className="mb-0">Everything plotted against the academic calendar, month by month.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Default Tabs</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-tabs default-tabs mb-3">
                                          <li className="nav-item">
                                              <a href="#home" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                                  Home
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#profile" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
                                                  Profile
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#message" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                                  Settings
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#" data-bs-toggle="tab" aria-expanded="false" className="nav-link disabled">
                                                  Disabled
                                              </a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane" id="home">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane show active" id="profile">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="message">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Tabs Justified</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-pills bg-nav-pills nav-justified mb-3">
                                          <li className="nav-item">
                                              <a href="#home2" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
                                                  Home
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#profile2" data-bs-toggle="tab" aria-expanded="true" className="nav-link rounded-0 active">
                                                  Profile
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#messages2" data-bs-toggle="tab" aria-expanded="false" className="nav-link rounded-0">
                                                  Settings
                                              </a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane" id="home2">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane show active" id="profile2">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="messages2">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates. </p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Solid Tabs</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-tabs nav-solid-primary mb-3">
                                          <li className="nav-item"><a className="nav-link active" href="#solid-tab1" data-bs-toggle="tab">Home</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-tab2" data-bs-toggle="tab">Profile</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-tab3" data-bs-toggle="tab">Messages</a></li>
                                      </ul>
                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="solid-tab1">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-tab2">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-tab3">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-md-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Solid Justified</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-tabs nav-solid-primary nav-justified mb-3">
                                          <li className="nav-item"><a className="nav-link active" href="#solid-justified-tab1" data-bs-toggle="tab">Home</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-justified-tab2" data-bs-toggle="tab">Profile</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-justified-tab3" data-bs-toggle="tab">Messages</a></li>
                                      </ul>
                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="solid-justified-tab1">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-justified-tab2">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-justified-tab3">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">
                          <div className="col-md-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Solid Rounded</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-tabs nav-solid-success nav-tabs-rounded mb-3">
                                          <li className="nav-item"><a className="nav-link active" href="#solid-rounded-tab1" data-bs-toggle="tab">Home</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-rounded-tab2" data-bs-toggle="tab">Profile</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-rounded-tab3" data-bs-toggle="tab">Messages</a></li>
                                      </ul>
                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="solid-rounded-tab1">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-rounded-tab2">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-rounded-tab3">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-md-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Rounded Justified</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-tabs nav-solid-success nav-tabs-rounded nav-justified mb-3">
                                          <li className="nav-item"><a className="nav-link active" href="#solid-rounded-justified-tab1" data-bs-toggle="tab">Home</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-rounded-justified-tab2" data-bs-toggle="tab">Profile</a></li>
                                          <li className="nav-item"><a className="nav-link" href="#solid-rounded-justified-tab3" data-bs-toggle="tab">Messages</a></li>
                                      </ul>
                                      <div className="tab-content">
                                          <div className="tab-pane show active" id="solid-rounded-justified-tab1">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-rounded-justified-tab2">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="solid-rounded-justified-tab3">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Tabs Bordered</h5>
                                  </div>
                                  <div className="card-body">
                                      <ul className="nav nav-tabs nav-bordered mb-3">
                                          <li className="nav-item">
                                              <a href="#home-b1" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                                  <span className="d-md-inline-block">Home</span>
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#profile-b1" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
                                                  <span className="d-md-inline-block">Profile</span>
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#messages-b1" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                                  <span className="d-md-inline-block">Messages</span>
                                              </a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane" id="home-b1">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane show active" id="profile-b1">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="messages-b1">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Tabs Bordered Justified</h5>
                                  </div>

                                  <div className="card-body">
                                      <ul className="nav nav-tabs nav-justified nav-bordered nav-bordered-success mb-3">
                                          <li className="nav-item">
                                              <a href="#home-b2" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                                  <span className="d-md-inline-block">Home</span>
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#profile-b2" data-bs-toggle="tab" aria-expanded="true" className="nav-link active">
                                                  <span className="d-md-inline-block">Profile</span>
                                              </a>
                                          </li>
                                          <li className="nav-item">
                                              <a href="#messages-b2" data-bs-toggle="tab" aria-expanded="false" className="nav-link">
                                                  <span className="d-md-inline-block">Messages</span>
                                              </a>
                                          </li>
                                      </ul>

                                      <div className="tab-content">
                                          <div className="tab-pane" id="home-b2">
                                              <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                          </div>
                                          <div className="tab-pane show active" id="profile-b2">
                                              <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                          </div>
                                          <div className="tab-pane" id="messages-b2">
                                              <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                          </div>
                                      </div>

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

                      {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Tabs Vertical Left</h5>
                                  </div>
                                  <div className="card-body">

                                      {/* start row */}
                                      <div className="row">
                                          <div className="col-sm-4 mb-2 mb-sm-0">
                                              <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                  <a className="nav-link active show w-100" id="v-pills-home-tab" data-bs-toggle="pill" href="#v-pills-home" role="tab" aria-controls="v-pills-home" aria-selected="true">
                                                      Home
                                                  </a>
                                                  <a className="nav-link w-100" id="v-pills-profile-tab" data-bs-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">
                                                      Profile
                                                  </a>
                                                  <a className="nav-link w-100" id="v-pills-messages-tab" data-bs-toggle="pill" href="#v-pills-messages" role="tab" aria-controls="v-pills-messages" aria-selected="false">
                                                      Messages
                                                  </a>
                                              </div>
                                          </div> {/* end col */}

                                          <div className="col-sm-8">
                                              <div className="tab-content" id="v-pills-tabContent">
                                                  <div className="tab-pane fade active show" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                      <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                                  </div>
                                                  <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                                      <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                                  </div>
                                                  <div className="tab-pane fade" id="v-pills-messages" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                                                      <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                                  </div>
                                              </div> {/* end tab-content */}
                                          </div> {/* end col */}

                                      </div>
                                      {/* end row */}

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Tabs Vertical Right</h5>
                                  </div>
                                  <div className="card-body">
                                      <div className="row">
                                          <div className="col-sm-8">
                                              <div className="tab-content" id="v-pills-tabContent-right">
                                                  <div className="tab-pane fade active show" id="v-pills-home2" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                      <p className="mb-0">Welcome to the dashboard! Access key metrics, recent updates, and quick links to manage your activity. Use this panel to stay on top of your workflow and performance goals.</p>
                                                  </div>
                                                  <div className="tab-pane fade" id="v-pills-profile2" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                                      <p className="mb-0">Manage your profile details, update your contact info, and review your login activity. Keeping your account information accurate ensures a smooth and secure experience.</p>
                                                  </div>
                                                  <div className="tab-pane fade" id="v-pills-messages2" role="tabpanel" aria-labelledby="v-pills-messages-tab">
                                                      <p className="mb-0">View recent messages, send new replies, and stay connected with your team. The messaging center helps you manage conversations efficiently and never miss important updates.</p>
                                                  </div>
                                              </div> {/* end tabcontent */}
                                          </div> {/* end col */}

                                          <div className="col-sm-4 mt-2 mt-sm-0">
                                              <div className="nav flex-column nav-pills nav-pills-secondary" id="v-pills-tab2" role="tablist" aria-orientation="vertical">
                                                  <a className="nav-link active show w-100" id="v-pills-home-tab2" data-bs-toggle="pill" href="#v-pills-home2" role="tab" aria-controls="v-pills-home2" aria-selected="true">
                                                      <span className="d-md-inline-block">Home</span>
                                                  </a>
                                                  <a className="nav-link w-100" id="v-pills-profile-tab2" data-bs-toggle="pill" href="#v-pills-profile2" role="tab" aria-controls="v-pills-profile2" aria-selected="false">
                                                      <span className="d-md-inline-block">Profile</span>
                                                  </a>
                                                  <a className="nav-link w-100" id="v-pills-messages-tab2" data-bs-toggle="pill" href="#v-pills-messages2" role="tab" aria-controls="v-pills-messages2" aria-selected="false">
                                                      <span className="d-md-inline-block">Messages</span>
                                                  </a>
                                              </div>
                                          </div> {/* end col */}

                                      </div> 
                                      {/* end row */}

                                  </div> {/* end card-body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

            </div>
          </div>
    </div>
  );
};

export default NavTabs;
