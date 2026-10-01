const UiAttendance = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Attendance</h3>
                  <p className="text-muted mb-0">Reusable attendance components — heatmap, legend, sessions, marking rows, rails and comparison bars. They carry no colour or spacing of their own, so the same markup works on student, teacher, staff and report screens.</p>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-6">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h4 className="card-title mb-0 fs-16 fw-medium">Attendance Heatmap</h4>
                      <span className="badge badge-soft-info">.attendance-heatmap</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">A day-per-cell density grid. Each cell is a <code>&lt;span&gt;</code> carrying an intensity class — <code>.l1</code> to <code>.l4</code> for present days, <code>.is-absent</code> for an absence, or nothing for a non-school day. Pair it with the legend so the scale is readable. Give the container an <code>aria-label</code> describing the range.</p>
                      <div className="attendance-heatmap mb-2" aria-label="Attendance heatmap for the last 30 days" role="img">
                        <span className="l4"></span><span className="l3"></span><span className="l4"></span><span className="l2"></span><span className="is-absent"></span><span className="l3"></span><span className="l4"></span><span className="l4"></span><span className="l2"></span><span className="l3"></span><span className="l4"></span><span className="l1"></span><span className="l3"></span><span className="l4"></span><span className="l4"></span>
                        <span className="is-absent"></span><span className="l2"></span><span className="l4"></span><span className="l3"></span><span className="l4"></span><span className="l3"></span><span className="l4"></span><span className="l4"></span><span className="l2"></span><span className="l3"></span><span className="l4"></span><span className="l1"></span><span className="l4"></span><span className="l3"></span><span className="l4"></span>
                      </div>
                      <div className="attendance-heatmap-legend">
                        <span>Less</span><i className="l1"></i><i className="l2"></i><i className="l3"></i><i className="l4"></i><span>More</span>
                        <i className="is-absent ms-2"></i><span>Absent</span>
                      </div>
                      <p className="text-muted mt-3 mb-2"><b>Empty</b> — a period with no records still renders the grid, so the layout never jumps.</p>
                      <div className="attendance-heatmap" aria-label="No attendance recorded" role="img">
                        <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Attendance Sessions</h5>
                      <span className="badge badge-soft-info">.attendance-sessions · .attendance-session</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">A day's registers in order. <code>.attendance-session</code> takes <code>.is-done</code> when the register is closed and <code>.is-now</code> for the one in progress. The period number sits in <code>&lt;span class="p"&gt;</code>; the trailing status uses the shared <code>.status-chip</code>.</p>
                      <div className="attendance-sessions">
                        <div className="attendance-session is-done"><span className="p">1</span><div><b>Assembly · 08:00</b><span>1,329 marked · 100%</span></div><span className="status-chip is-present">Closed</span></div>
                        <div className="attendance-session is-done"><span className="p">2</span><div><b>Mathematics · 09:00</b><span>1,312 marked · 98%</span></div><span className="status-chip is-present">Closed</span></div>
                        <div className="attendance-session is-now"><span className="p">3</span><div><b>Science — Physics · 10:15</b><span>846 marked · in progress</span></div><span className="status-chip is-late">Open</span></div>
                        <div className="attendance-session"><span className="p">4</span><div><b>English · 11:15</b><span>Not started</span></div><span className="status-chip">Pending</span></div>
                        <div className="attendance-session"><span className="p">5</span><div><b>Inter-house debate preparation and rehearsal in the auditorium · 13:00</b><span>Long titles clamp to one line</span></div><span className="status-chip">Pending</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-xl-7">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Marking Row</h5>
                      <span className="badge badge-soft-info">.attendance-mark-row</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">One student per row with a present / late / absent toggle. The toggle is a <code>role="group"</code> of buttons using <code>data-mark-set</code>; the active one takes <code>.is-on</code>. Label the group with the student's name so screen readers announce what is being changed.</p>
                      <div className="attendance-mark-row">
                        <img src="assets/img/students/student-01.jpg" alt="" />
                        <span><b>Janet Daniel</b><em>Roll 35013</em></span>
                        <div className="toggle-switch" role="group" aria-label="Status for Janet Daniel">
                          <button type="button" className="is-on" data-mark-set="present">P</button>
                          <button type="button" data-mark-set="late">L</button>
                          <button type="button" data-mark-set="absent">A</button>
                        </div>
                      </div>
                      <div className="attendance-mark-row">
                        <img src="assets/img/students/student-02.jpg" alt="" />
                        <span><b>Joann Michael</b><em>Roll 35014</em></span>
                        <div className="toggle-switch" role="group" aria-label="Status for Joann Michael">
                          <button type="button" data-mark-set="present">P</button>
                          <button type="button" className="is-on" data-mark-set="late">L</button>
                          <button type="button" data-mark-set="absent">A</button>
                        </div>
                      </div>
                      <div className="attendance-mark-row">
                        <img src="assets/img/students/student-03.jpg" alt="" />
                        <span><b>Kathleen Moreno</b><em>Roll 35015</em></span>
                        <div className="toggle-switch" role="group" aria-label="Status for Kathleen Moreno">
                          <button type="button" data-mark-set="present">P</button>
                          <button type="button" data-mark-set="late">L</button>
                          <button type="button" className="is-on" data-mark-set="absent">A</button>
                        </div>
                      </div>
                      <p className="text-muted mt-3 mb-2"><b>Disabled</b> — a locked register keeps the row readable but blocks changes.</p>
                      <div className="attendance-mark-row">
                        <img src="assets/img/students/student-04.jpg" alt="" />
                        <span><b>Lisa Ray</b><em>Roll 35016 · register closed</em></span>
                        <div className="toggle-switch" role="group" aria-label="Status for Lisa Ray">
                          <button type="button" className="is-on" data-mark-set="present" disabled>P</button>
                          <button type="button" data-mark-set="late" disabled>L</button>
                          <button type="button" data-mark-set="absent" disabled>A</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-5">
                  <div className="card h-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                      <h5 className="card-title mb-0">Comparison Bars &amp; Percent</h5>
                      <span className="badge badge-soft-info">.attendance-compare-row · .attendance-percent</span>
                    </div>
                    <div className="card-body">
                      <p className="text-muted">Rate per group, ranked. The row takes a status class — <code>.is-present</code>, <code>.is-late</code>, <code>.is-absent</code> — which tones the fill; the track width is set inline.</p>
                      <div className="attendance-compare mb-3">
                        <div className="attendance-compare-row is-present"><span className="n">Grade III</span><span className="tr"><span style={{ width: '98%' }}></span></span><b>98%</b></div>
                        <div className="attendance-compare-row is-present"><span className="n">Grade IV</span><span className="tr"><span style={{ width: '94%' }}></span></span><b>94%</b></div>
                        <div className="attendance-compare-row is-late"><span className="n">Grade V</span><span className="tr"><span style={{ width: '88%' }}></span></span><b>88%</b></div>
                        <div className="attendance-compare-row is-absent"><span className="n">Grade VI</span><span className="tr"><span style={{ width: '71%' }}></span></span><b>71%</b></div>
                      </div>
                      <p className="text-muted mb-2"><code>.attendance-percent</code> is the inline rate used inside tables and cards. It takes <code>.is-good</code>, <code>.is-warn</code> or <code>.is-bad</code>.</p>
                      <div className="d-flex gap-2 flex-wrap">
                        <span className="attendance-percent is-good">96%</span>
                        <span className="attendance-percent is-warn">84%</span>
                        <span className="attendance-percent is-bad">62%</span>
                      </div>
                      <h6 className="mt-4 mb-2">Attendance Rail <span className="badge badge-soft-info ms-1">.attendance-rail</span></h6>
                      <p className="text-muted">Progress of the marking round itself — how much of the register is complete.</p>
                      <div className="attendance-rail">
                        <span className="attendance-rail-done">1,312 of 1,340 marked</span>
                        <div className="attendance-rail-bar"><span style={{ width: '98%' }}></span></div>
                        <div className="attendance-rail-keys"><span>Present 1,240</span><span>Late 42</span><span>Absent 30</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h5 className="card-title mb-0">Component reference</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered mb-0">
                      <thead><tr><th>Component</th><th>Purpose</th><th>Modifiers &amp; states</th><th>Notes</th></tr></thead>
                      <tbody>
                        <tr><td><code>.attendance-heatmap</code></td><td>Day-per-cell density grid</td><td>Cells: <code>.l1</code>–<code>.l4</code>, <code>.is-absent</code></td><td>15-column grid; give the container an <code>aria-label</code></td></tr>
                        <tr><td><code>.attendance-heatmap-legend</code></td><td>Intensity scale</td><td>Same cell classes</td><td>Place directly under the heatmap</td></tr>
                        <tr><td><code>.attendance-sessions</code> / <code>.attendance-session</code></td><td>A day's registers</td><td><code>.is-done</code>, <code>.is-now</code></td><td>Period number in <code>.p</code>; status uses <code>.status-chip</code></td></tr>
                        <tr><td><code>.attendance-mark-row</code></td><td>Per-student marking row</td><td>Toggle: <code>.is-on</code>, <code>disabled</code></td><td>Toggle needs <code>role="group"</code> and a per-student label</td></tr>
                        <tr><td><code>.attendance-compare</code> / <code>-row</code></td><td>Rate comparison bars</td><td><code>.is-present</code>, <code>.is-late</code>, <code>.is-absent</code></td><td>Track width set inline</td></tr>
                        <tr><td><code>.attendance-percent</code></td><td>Inline rate value</td><td><code>.is-good</code>, <code>.is-warn</code>, <code>.is-bad</code></td><td>Use inside tables and cards</td></tr>
                        <tr><td><code>.attendance-rail</code></td><td>Marking-round progress</td><td><code>-done</code>, <code>-bar</code>, <code>-keys</code></td><td>Sits at the foot of a register panel</td></tr>
                        <tr><td><code>.attendance-hero-main</code> / <code>-rate</code> / <code>-title</code></td><td>Headline rate block</td><td>—</td><td>One per screen, above the register</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-muted mt-3 mb-0">Status tone comes from the global semantic colours — present maps to <code>--bs-success</code>, late to <code>--bs-warning</code>, absent to <code>--bs-danger</code>, leave to <code>--bs-info</code>. Combine these components with the workspace system on <a href="ui-workspace.html">UI Workspace</a> for the surrounding toolbar, grid and footer.</p>
                </div>
              </div>

            </div>
          </div>
    </div>
  );
};

export default UiAttendance;
