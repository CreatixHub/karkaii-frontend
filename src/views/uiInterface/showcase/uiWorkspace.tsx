const UiWorkspace = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Workspace</h3>
                  <p className="text-muted mb-0">The reusable record-workspace system: toolbar, filters, grid, selection, details and states. Every list screen in the template is assembled from the components on this page — copy the markup as-is, no extra CSS required.</p>
                </div>
              </div>

              {/* Page Toolbar */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h4 className="card-title mb-0 fs-16 fw-medium">Page Toolbar</h4>
                  <span className="badge badge-soft-info">.page-toolbar</span>
                </div>
                <div className="card-body">
                  <p className="text-muted">Top control strip of a workspace: search, actions, density and view controls on one wrapping row. Put it inside a <code>.card-header</code> or directly above the grid. Bootstrap dependencies: none — it is a flex row, so <code>gap-*</code>, <code>ms-auto</code> and <code>order-*</code> utilities work on its children.</p>
                  <div className="page-toolbar mb-3">
                    <div className="search-toolbar">
                      <i className="ti ti-search search-toolbar-icon"></i>
                      <input type="text" className="form-control" placeholder="Search records" aria-label="Search records" />
                      <span className="search-toolbar-kbd">⌘K</span>
                    </div>
                    <button type="button" className="workspace-button"><i className="ti ti-filter"></i>Filter</button>
                    <button type="button" className="workspace-button"><i className="ti ti-download"></i>Export</button>
                    <button type="button" className="workspace-button workspace-button-icon" aria-label="Refresh"><i className="ti ti-refresh"></i></button>
                    <div className="density-toggle ms-auto" role="group" aria-label="Row density">
                      <button type="button" className="active" aria-pressed="true"><i className="ti ti-baseline-density-medium"></i></button>
                      <button type="button" aria-pressed="false"><i className="ti ti-baseline-density-small"></i></button>
                    </div>
                    <div className="view-switcher" role="group" aria-label="View">
                      <a href="javascript:void(0);" className="active" aria-current="true"><i className="ti ti-list"></i></a>
                      <a href="javascript:void(0);"><i className="ti ti-layout-grid"></i></a>
                    </div>
                  </div>
                  <p className="text-muted mb-2"><b>Compact</b> — add <code>.page-toolbar-compact</code> on an ancestor to shrink every control in the strip.</p>
                  <div className="page-toolbar-compact mb-3">
                    <div className="page-toolbar">
                      <div className="search-toolbar">
                        <i className="ti ti-search search-toolbar-icon"></i>
                        <input type="text" className="form-control" placeholder="Search" aria-label="Search" />
                      </div>
                      <button type="button" className="workspace-button"><i className="ti ti-filter"></i>Filter</button>
                      <button type="button" className="workspace-button workspace-button-icon" aria-label="More"><i className="ti ti-dots"></i></button>
                    </div>
                  </div>
                  <p className="text-muted mb-2"><b>Disabled &amp; long content</b> — buttons take the native <code>disabled</code> attribute; long labels wrap to the next row rather than overflowing.</p>
                  <div className="page-toolbar">
                    <button type="button" className="workspace-button" disabled><i className="ti ti-trash"></i>Delete selected</button>
                    <button type="button" className="workspace-button">Generate consolidated term-end performance report</button>
                    <button type="button" className="workspace-button active" aria-pressed="true"><i className="ti ti-star"></i>Saved view</button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="row">
                <div className="col-xl-6">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Quick Filters</h5>
                      <span className="badge badge-soft-info">.quick-filters</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">Inline filter pills with a result count. Use for the four or five filters people reach for most; anything longer belongs in a filter drawer. Set <code>aria-pressed</code> so screen readers announce the active state.</p>
                      <div className="quick-filters">
                        <button type="button" className="quick-filter active" aria-pressed="true">All <span className="quick-filter-count">248</span></button>
                        <button type="button" className="quick-filter" aria-pressed="false">Active <span className="quick-filter-count">212</span></button>
                        <button type="button" className="quick-filter" aria-pressed="false">Inactive <span className="quick-filter-count">36</span></button>
                        <button type="button" className="quick-filter" aria-pressed="false" disabled>Archived <span className="quick-filter-count">0</span></button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Filter Chips</h5>
                      <span className="badge badge-soft-info">.filter-chips</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">The applied-filter summary. Each chip carries its own dismiss button; the container collapses to nothing when empty, so it can stay in the markup permanently.</p>
                      <div className="filter-chips mb-3">
                        <span className="filter-chip-item">Class: III-A <button type="button" aria-label="Remove class filter"><i className="ti ti-x"></i></button></span>
                        <span className="filter-chip-item">Status: Active <button type="button" aria-label="Remove status filter"><i className="ti ti-x"></i></button></span>
                        <span className="filter-chip-item">Admitted after 01 Jan 2024 <button type="button" aria-label="Remove date filter"><i className="ti ti-x"></i></button></span>
                        <button type="button" className="filter-chip-clear">Clear all</button>
                      </div>
                      <p className="text-muted mb-0"><b>Empty</b> — an empty container renders nothing, no conditional markup needed.</p>
                      <div className="filter-chips"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Strip */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Summary Strip &amp; Summary Card</h5>
                  <span className="badge badge-soft-info">.summary-strip · .summary-card</span>
                </div>
                <div className="card-body">
                  <p className="text-muted">Headline figures above a grid. The strip is an eight-column grid that steps down to four, two and one across breakpoints. Tone comes from the global accent modifiers — <code>.accent-primary</code>, <code>.accent-success</code>, <code>.accent-warning</code>, <code>.accent-danger</code>, <code>.accent-info</code>, <code>.accent-purple</code>, <code>.accent-teal</code> — never from a page-level colour.</p>
                  <div className="summary-strip">
                    <div className="summary-card accent-primary"><span className="summary-card-icon"><i className="ti ti-users"></i></span><div><span className="summary-card-value">248</span><span className="summary-card-label">Total students</span></div></div>
                    <div className="summary-card accent-success"><span className="summary-card-icon"><i className="ti ti-user-check"></i></span><div><span className="summary-card-value">212</span><span className="summary-card-label">Active</span></div></div>
                    <div className="summary-card accent-warning"><span className="summary-card-icon"><i className="ti ti-clock"></i></span><div><span className="summary-card-value">14</span><span className="summary-card-label">Pending</span></div></div>
                    <div className="summary-card accent-danger"><span className="summary-card-icon"><i className="ti ti-user-x"></i></span><div><span className="summary-card-value">6</span><span className="summary-card-label">Suspended</span></div></div>
                    <div className="summary-card accent-info"><span className="summary-card-icon"><i className="ti ti-school"></i></span><div><span className="summary-card-value">18</span><span className="summary-card-label">Classes</span></div></div>
                    <div className="summary-card accent-purple"><span className="summary-card-icon"><i className="ti ti-percentage"></i></span><div><span className="summary-card-value">93%</span><span className="summary-card-label">Attendance</span></div></div>
                    <div className="summary-card accent-teal"><span className="summary-card-icon"><i className="ti ti-cash"></i></span><div><span className="summary-card-value">$41k</span><span className="summary-card-label">Collected</span></div></div>
                    <div className="summary-card accent-slate"><span className="summary-card-icon"><i className="ti ti-file-text"></i></span><div><span className="summary-card-value">Consolidated term performance</span><span className="summary-card-label">Long content clamps instead of overflowing</span></div></div>
                  </div>
                </div>
              </div>

              {/* Record grid */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <h5 className="card-title mb-0">Record Grid</h5>
                  <span className="badge badge-soft-info">.record-grid-wrapper · .record-grid-table · .record-grid-row</span>
                </div>
                <div className="card-body">
                  <p className="text-muted">The workspace table. <code>.record-grid-wrapper</code> owns the horizontal scroll, <code>.record-grid-table</code> the layout, and each <code>&lt;tr&gt;</code> takes <code>.record-grid-row</code>. Sorting uses <code>.record-sortable</code> plus <code>.is-sorted-asc</code> / <code>.is-sorted-desc</code>; the first column can stick with <code>.is-pinned</code>; a chosen row takes <code>.is-selected</code>. Identity cells combine <code>.record-identity</code>, <code>.record-avatar</code> and <code>.record-tag</code> / <code>.record-pill</code>.</p>
                  <div className="record-grid-wrapper mb-3">
                    <table className="record-grid-table">
                      <thead>
                        <tr>
                          <th className="is-pinned"><input type="checkbox" className="record-check" aria-label="Select all" /></th>
                          <th className="record-sortable is-sorted-asc">Student <i className="ti ti-arrow-up record-sort-icon"></i></th>
                          <th className="record-sortable">Class <i className="ti ti-arrows-sort record-sort-icon"></i></th>
                          <th>Status</th>
                          <th>Attendance</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="record-grid-row is-selected">
                          <td className="is-pinned"><input type="checkbox" className="record-check" checked aria-label="Select Janet Daniel" /></td>
                          <td>
                            <div className="record-identity">
                              <span className="record-avatar"><img src="assets/img/students/student-01.jpg" alt="" /><span className="record-avatar-presence"></span></span>
                              <div><span className="record-identity-name">Janet Daniel</span><span className="record-identity-sub">AD1256589</span></div>
                            </div>
                          </td>
                          <td>III-A</td>
                          <td><span className="record-pill accent-success"><span className="record-pill-dot"></span>Active</span></td>
                          <td><span className="record-progress"><span style={{ width: '94%' }}></span></span></td>
                          <td className="text-end"><button type="button" className="workspace-icon-button" aria-label="Edit"><i className="ti ti-edit"></i></button></td>
                        </tr>
                        <tr className="record-grid-row">
                          <td className="is-pinned"><input type="checkbox" className="record-check" aria-label="Select Joann Michael" /></td>
                          <td>
                            <div className="record-identity">
                              <span className="record-avatar"><img src="assets/img/students/student-02.jpg" alt="" /></span>
                              <div><span className="record-identity-name">Joann Michael</span><span className="record-identity-sub">AD1256590</span></div>
                            </div>
                          </td>
                          <td>IV-B</td>
                          <td><span className="record-pill accent-warning"><span className="record-pill-dot"></span>Pending</span></td>
                          <td><span className="record-progress"><span style={{ width: '71%' }}></span></span></td>
                          <td className="text-end"><button type="button" className="workspace-icon-button" aria-label="Edit"><i className="ti ti-edit"></i></button></td>
                        </tr>
                        <tr className="record-grid-row">
                          <td className="is-pinned"><input type="checkbox" className="record-check" aria-label="Select Kathleen Moreno" /></td>
                          <td>
                            <div className="record-identity">
                              <span className="record-avatar"><img src="assets/img/students/student-03.jpg" alt="" /></span>
                              <div><span className="record-identity-name">Kathleen Moreno — transferred from St. Andrews Senior Secondary</span><span className="record-identity-sub">Long content truncates rather than widening the column</span></div>
                            </div>
                          </td>
                          <td>V-A</td>
                          <td><span className="record-pill accent-danger"><span className="record-pill-dot"></span>Suspended</span></td>
                          <td><span className="record-progress"><span style={{ width: '38%' }}></span></span></td>
                          <td className="text-end"><button type="button" className="workspace-icon-button" aria-label="Edit" disabled><i className="ti ti-edit"></i></button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted mb-2"><b>Loading</b> — swap the grid for the global skeleton loader. There is one skeleton system template-wide; never write a per-page variant.</p>
                  <div className="skeleton-loader mb-3">
                    <div className="d-flex align-items-center gap-3 mb-2"><div className="skeleton skeleton-circle"></div><div className="skeleton-stack"><div className="skeleton skeleton-line mb-2"></div><div className="skeleton skeleton-line w-50"></div></div><div className="skeleton skeleton-pill"></div></div>
                    <div className="d-flex align-items-center gap-3 mb-2"><div className="skeleton skeleton-circle"></div><div className="skeleton-stack"><div className="skeleton skeleton-line mb-2"></div><div className="skeleton skeleton-line w-50"></div></div><div className="skeleton skeleton-pill"></div></div>
                    <div className="d-flex align-items-center gap-3"><div className="skeleton skeleton-circle"></div><div className="skeleton-stack"><div className="skeleton skeleton-line mb-2"></div><div className="skeleton skeleton-line w-50"></div></div><div className="skeleton skeleton-pill"></div></div>
                  </div>
                  <p className="text-muted mb-2"><b>Empty</b> — <code>.workspace-empty-state</code> is hidden until it gets <code>.show</code>, so it can sit in the markup permanently.</p>
                  <div className="workspace-empty-state show">
                    <span className="workspace-empty-art"><i className="ti ti-search-off"></i></span>
                    <h5>No records match these filters</h5>
                    <p className="text-muted">Try widening the date range or clearing a filter chip.</p>
                    <button type="button" className="workspace-button"><i className="ti ti-rotate"></i>Reset filters</button>
                  </div>
                </div>
              </div>

              {/* Record cards + selection */}
              <div className="row">
                <div className="col-xl-7">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Record Cards</h5>
                      <span className="badge badge-soft-info">.record-cards · .record-card</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">The responsive counterpart of the grid — the same record shown as a card once the table is too wide for the viewport. Pair it with the view switcher, or let it take over below the grid's breakpoint.</p>
                      <div className="record-cards">
                        <div className="record-card">
                          <div className="record-card-head">
                            <div className="record-identity">
                              <span className="record-avatar"><img src="assets/img/students/student-01.jpg" alt="" /></span>
                              <div><span className="record-identity-name">Janet Daniel</span><span className="record-identity-sub">III-A · AD1256589</span></div>
                            </div>
                            <span className="record-pill accent-success"><span className="record-pill-dot"></span>Active</span>
                          </div>
                          <div className="record-card-body">
                            <div><span className="record-meta-key">Attendance</span><span className="record-meta-value">94%</span></div>
                            <div><span className="record-meta-key">Guardian</span><span className="record-meta-value">Thomas Daniel</span></div>
                          </div>
                          <div className="record-card-actions">
                            <button type="button" className="workspace-icon-button" aria-label="Call"><i className="ti ti-phone"></i></button>
                            <button type="button" className="workspace-icon-button" aria-label="Message"><i className="ti ti-message"></i></button>
                            <button type="button" className="workspace-button">View profile</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-5">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Selection Toolbar</h5>
                      <span className="badge badge-soft-info">.selection-toolbar</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">Appears when rows are selected — add <code>.show</code> to reveal it. Keep destructive actions last and announce the count with <code>aria-live="polite"</code>.</p>
                      <div className="selection-toolbar show mb-3">
                        <span className="selection-toolbar-count" aria-live="polite"><span className="selection-toolbar-badge">3</span> selected</span>
                        <div className="selection-toolbar-actions">
                          <button type="button" className="workspace-button"><i className="ti ti-mail"></i>Message</button>
                          <button type="button" className="workspace-button"><i className="ti ti-download"></i>Export</button>
                          <button type="button" className="workspace-button" disabled><i className="ti ti-trash"></i>Delete</button>
                        </div>
                      </div>
                      <h6 className="mb-2">Quick Menu <span className="badge badge-soft-info ms-1">.quick-menu</span></h6>
                      <p className="text-muted">The dropdown panel behind a workspace action button.</p>
                      <div className="quick-menu">
                        <div className="quick-menu-head"><span className="quick-menu-head-title">Bulk actions</span><span className="quick-menu-head-sub">Applies to the 3 selected records</span></div>
                        <ul className="quick-menu-list">
                          <li><a href="javascript:void(0);"><span className="quick-menu-icon accent-primary"><i className="ti ti-user-plus"></i></span>Assign to class</a></li>
                          <li><a href="javascript:void(0);"><span className="quick-menu-icon accent-success"><i className="ti ti-certificate"></i></span>Generate certificates</a></li>
                          <li><a href="javascript:void(0);"><span className="quick-menu-icon accent-warning"><i className="ti ti-archive"></i></span>Archive records</a></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details panel */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Details Panel</h5>
                  <span className="badge badge-soft-info">.details-panel · .details-panel-block · .details-panel-row</span>
                </div>
                <div className="card-body">
                  <p className="text-muted">The expanded view of a record, either inline under its row (toggled by <code>.details-toggle</code>) or in an offcanvas. The panel is a grid of blocks; a page may override the column count, nothing else.</p>
                  <div className="details-panel">
                    <div className="details-panel-block">
                      <h6>Personal</h6>
                      <div className="details-panel-row"><span className="record-info-key">Date of birth</span><span className="record-info-value">14 Mar 2016</span></div>
                      <div className="details-panel-row"><span className="record-info-key">Gender</span><span className="record-info-value">Female</span></div>
                      <div className="details-panel-row"><span className="record-info-key">Blood group</span><span className="record-info-value">O+</span></div>
                    </div>
                    <div className="details-panel-block">
                      <h6>Academic</h6>
                      <div className="details-panel-row"><span className="record-info-key">Class</span><span className="record-info-value">III-A</span></div>
                      <div className="details-panel-row"><span className="record-info-key">Roll number</span><span className="record-info-value">35013</span></div>
                      <div className="details-panel-row"><span className="record-info-key">Admitted</span><span className="record-info-value">18 Mar 2024</span></div>
                    </div>
                    <div className="details-panel-block">
                      <h6>Contact</h6>
                      <div className="details-panel-row"><span className="record-info-key">Guardian</span><span className="record-info-value">Thomas Daniel</span></div>
                      <div className="details-panel-row"><span className="record-info-key">Phone</span><span className="record-info-value">+1 4587 3312</span></div>
                      <div className="details-panel-row"><span className="record-info-key">Address</span><span className="record-info-value">2831 Sherwood Circle, Cheyenne, Wyoming — long values wrap inside the row</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer + pagination */}
              <div className="card">
                <div className="card-header d-flex align-items-center justify-content-between">
                  <h5 className="card-title mb-0">Workspace Footer &amp; Pagination</h5>
                  <span className="badge badge-soft-info">.workspace-footer · .workspace-pagination</span>
                </div>
                <div className="card-body">
                  <p className="text-muted">Closes the workspace: result count and page-size selector on the left, pagination on the right. Wrap the control in <code>&lt;nav aria-label="Pagination"&gt;</code> and mark the current page with <code>aria-current="page"</code>.</p>
                  <div className="workspace-footer">
                    <span className="workspace-footer-info">Showing 1–10 of 248 records</span>
                    <span className="workspace-footer-size">
                      <label htmlFor="wsPageSize" className="me-2">Rows</label>
                      <select className="form-select" id="wsPageSize"><option>10</option><option>25</option><option>50</option></select>
                    </span>
                    <nav className="workspace-pagination" aria-label="Pagination">
                      <button type="button" className="workspace-page-button" disabled aria-label="Previous page"><i className="ti ti-chevron-left"></i></button>
                      <span className="workspace-page-numbers">
                        <button type="button" className="workspace-page-button active" aria-current="page">1</button>
                        <button type="button" className="workspace-page-button">2</button>
                        <button type="button" className="workspace-page-button">3</button>
                        <span className="px-1 text-muted">…</span>
                        <button type="button" className="workspace-page-button">25</button>
                      </span>
                      <button type="button" className="workspace-page-button" aria-label="Next page"><i className="ti ti-chevron-right"></i></button>
                    </nav>
                  </div>
                </div>
              </div>

              {/* Upload + live content + id card */}
              <div className="row">
                <div className="col-xl-4">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Upload Dropzone</h5>
                      <span className="badge badge-soft-info">.upload-dropzone</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">Import panel for bulk record uploads. Add <code>.dragover</code> while a file is over the target. Always pair it with a real <code>&lt;input type="file"&gt;</code> so keyboard users can browse.</p>
                      <label className="upload-dropzone" htmlFor="wsImport">
                        <i className="ti ti-cloud-upload"></i>
                        <span className="upload-dropzone-title">Drop a CSV here</span>
                        <span className="upload-dropzone-hint">or click to browse — max 5 MB</span>
                        <input type="file" id="wsImport" className="d-none" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Live Content</h5>
                      <span className="badge badge-soft-info">.live-content</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">The counterpart to the skeleton loader: content inside <code>.live-content</code> stays hidden until the workspace root gains <code>.is-loaded</code>, so the two never flash at once.</p>
      <pre className="bg-light p-3 rounded"><code>&lt;div class="students-workspace"&gt;
        &lt;div class="skeleton-loader"&gt;…&lt;/div&gt;
        &lt;div class="live-content"&gt;…&lt;/div&gt;
      &lt;/div&gt;

      // when data arrives
      root.classList.add("is-loaded");</code></pre>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Workspace Actions</h5>
                      <span className="badge badge-soft-info">.workspace-actions</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">A trailing group of related buttons — inside a card header, a row, or the details panel.</p>
                      <div className="workspace-actions">
                        <button type="button" className="workspace-button"><i className="ti ti-printer"></i>Print</button>
                        <button type="button" className="workspace-button"><i className="ti ti-share"></i>Share</button>
                        <button type="button" className="workspace-icon-button" aria-label="More"><i className="ti ti-dots-vertical"></i></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reference */}
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Component reference</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                      <thead>
                        <tr><th>Component</th><th>Purpose</th><th>Modifiers &amp; states</th><th>Notes</th></tr>
                      </thead>
                      <tbody>
                        <tr><td><code>.page-toolbar</code></td><td>Workspace control strip</td><td><code>.page-toolbar-compact</code></td><td>Flex row — Bootstrap spacing and order utilities apply</td></tr>
                        <tr><td><code>.search-toolbar</code></td><td>Search field with icon and shortcut hint</td><td><code>.search-toolbar-icon</code>, <code>.search-toolbar-kbd</code></td><td>Wraps a Bootstrap <code>.form-control</code></td></tr>
                        <tr><td><code>.summary-strip</code> / <code>.summary-card</code></td><td>Headline figures above a grid</td><td>Any <code>.accent-*</code></td><td>8 → 4 → 2 → 1 columns by breakpoint</td></tr>
                        <tr><td><code>.selection-toolbar</code></td><td>Bulk actions for selected rows</td><td><code>.show</code></td><td>Count needs <code>aria-live="polite"</code></td></tr>
                        <tr><td><code>.record-grid-wrapper</code></td><td>Horizontal scroll container</td><td>—</td><td>Owns the scroll; never set overflow on the table</td></tr>
                        <tr><td><code>.record-grid-table</code></td><td>Workspace table</td><td><code>.record-sortable</code>, <code>.is-sorted-asc</code>, <code>.is-sorted-desc</code>, <code>.is-pinned</code></td><td>Column widths are page overrides</td></tr>
                        <tr><td><code>.record-grid-row</code></td><td>Record row</td><td><code>.is-selected</code></td><td>Pair with <code>.record-check</code></td></tr>
                        <tr><td><code>.record-cards</code> / <code>.record-card</code></td><td>Card view of the same record</td><td><code>.record-card-head</code>, <code>-body</code>, <code>-actions</code></td><td>Responsive fallback for the grid</td></tr>
                        <tr><td><code>.record-identity</code></td><td>Avatar plus name and sub-label</td><td><code>.record-identity-name</code>, <code>-sub</code></td><td>Truncates instead of widening the column</td></tr>
                        <tr><td><code>.record-avatar</code></td><td>Record thumbnail</td><td><code>.record-avatar-presence</code></td><td>Accepts <code>.accent-*</code> for the presence tone</td></tr>
                        <tr><td><code>.record-tag</code> / <code>.record-pill</code></td><td>Inline status marker</td><td><code>.record-pill-dot</code>, any <code>.accent-*</code></td><td>Use Bootstrap <code>.badge</code> for non-record contexts</td></tr>
                        <tr><td><code>.filter-chips</code> / <code>.filter-chip-item</code></td><td>Applied-filter summary</td><td><code>.filter-chip-clear</code></td><td>Collapses when empty</td></tr>
                        <tr><td><code>.quick-filters</code> / <code>.quick-filter</code></td><td>Inline filter pills</td><td><code>.active</code>, <code>.quick-filter-count</code>, <code>disabled</code></td><td>Set <code>aria-pressed</code></td></tr>
                        <tr><td><code>.quick-menu</code></td><td>Dropdown action panel</td><td><code>-head</code>, <code>-head-title</code>, <code>-head-sub</code>, <code>-icon</code>, <code>-list</code></td><td>Drop inside a Bootstrap <code>.dropdown-menu</code></td></tr>
                        <tr><td><code>.details-panel</code></td><td>Expanded record view</td><td><code>-block</code>, <code>-row</code>, <code>-photo</code>, <code>.details-toggle</code></td><td>Column count may be overridden per page</td></tr>
                        <tr><td><code>.workspace-footer</code></td><td>Result count and page size</td><td><code>-info</code>, <code>-size</code></td><td>Sits directly under the grid</td></tr>
                        <tr><td><code>.workspace-pagination</code></td><td>Page navigation</td><td><code>.workspace-page-button</code>, <code>-numbers</code>, <code>-gap</code>, <code>.active</code></td><td>Wrap in <code>&lt;nav aria-label&gt;</code>, mark <code>aria-current="page"</code></td></tr>
                        <tr><td><code>.workspace-button</code> / <code>.workspace-icon-button</code></td><td>Toolbar controls</td><td><code>.active</code>, <code>disabled</code>, <code>.workspace-button-icon</code></td><td>Icon-only buttons need <code>aria-label</code></td></tr>
                        <tr><td><code>.workspace-actions</code></td><td>Trailing button group</td><td>—</td><td>Use <code>gap-*</code> to adjust rhythm</td></tr>
                        <tr><td><code>.density-toggle</code> / <code>.view-switcher</code></td><td>Row density and list/grid switch</td><td><code>.active</code></td><td>Use <code>role="group"</code> with a label</td></tr>
                        <tr><td><code>.workspace-empty-state</code></td><td>No-results state</td><td><code>.show</code>, <code>.workspace-empty-art</code></td><td>Hidden until <code>.show</code> is added</td></tr>
                        <tr><td><code>.skeleton-loader</code> / <code>.skeleton</code></td><td>Loading placeholder</td><td><code>-line</code>, <code>-thin</code>, <code>-avatar</code>, <code>-circle</code>, <code>-pill</code>, <code>-card</code>, <code>-btn</code>, <code>-stack</code></td><td>The template's only skeleton system</td></tr>
                        <tr><td><code>.live-content</code></td><td>Real content, revealed on load</td><td>Root <code>.is-loaded</code></td><td>Pairs with the skeleton loader</td></tr>
                        <tr><td><code>.upload-dropzone</code></td><td>Bulk import target</td><td><code>.dragover</code>, <code>-title</code>, <code>-hint</code></td><td>Always back it with a real file input</td></tr>
                        <tr><td><code>.id-card-preview</code></td><td>Printable ID card preview</td><td><code>.id-card-head</code>, <code>-identity</code>, <code>-info</code>, <code>-row</code>, <code>-qr</code>, <code>-barcode</code>, <code>-foot</code></td><td>Fixed aspect; scales with its container</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted mt-3 mb-0">Every component above inherits colour, radius, shadow and motion from the global design tokens — <code>--bs-*</code> for the brand palette, <code>--radius*</code>, <code>--shadow*</code>, <code>--transition</code>, <code>--accent*</code> and <code>--tint-*</code>. None of them declares a colour of its own, so they follow the theme and dark mode automatically. Do not add page-level colour, spacing or typography overrides; restrict page SCSS to genuine layout differences.</p>
                </div>
              </div>

            </div>
          </div>
    </div>
  );
};

export default UiWorkspace;
