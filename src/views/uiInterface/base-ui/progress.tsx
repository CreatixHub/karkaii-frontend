import type { CSSProperties } from "react";
const Progress = () => {
  return (
    <div>
      <div className="page-wrapper">
            <div className="content">
              <div className="page-header">
                <div className="page-title">
                  <h3>Progress Bar</h3>
                </div>
              </div>

              {/* start row */}
                      <div className="row">

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h4 className="card-title fs-16 fw-medium">Basic Progress</h4>
                                  </div>
                                  <div className="card-body">
                                      <p>Use the <code>.progress</code> as a wrapper to indicate the max value of the progress bar.</p>

                                      <div className="progress mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar" style={{ width: '0%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar" style={{ width: '25%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar" style={{ width: '50%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-label="Basic example" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar" style={{ width: '75%' }}></div>
                                      </div>
                                      <div className="progress" role="progressbar" aria-label="Basic example" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar" style={{ width: '100%' }}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Backgrounds</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>Use background utility classes to change the appearance of individual progress bars.</p>

                                      <div className="progress mb-3" role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-secondary" style={{ width: '20%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-warning" style={{ width: '40%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-info" style={{ width: '60%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
                                      </div>
                                      <div className="progress" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-danger" style={{ width: '100%' }}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Striped Progress</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="text-muted">Add <code>.progress-bar-striped</code> to any <code>.progress-bar</code> to apply a stripe via CSS gradient over the progress bar’s background color.</p>

                                      <div className="progress mb-3" role="progressbar" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar progress-bar-striped" style={{ width: '10%' }}>
                                          </div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar progress-bar-striped bg-secondary" style={{ width: '25%' }}>
                                          </div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar progress-bar-striped bg-success" style={{ width: '50%' }}>
                                          </div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar progress-bar-striped bg-info" style={{ width: '75%' }}>
                                          </div>
                                      </div>
                                      <div className="progress" role="progressbar" aria-valuenow={100} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar progress-bar-striped bg-warning" style={{ width: '100%' }}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Progress Height</h5>
                                  </div>

                                  <div className="card-body">
                                      <p className="text-muted">We only set a <code>height</code> value on the <code>.progress</code>, so if you change that value the inner <code>.progress-bar</code> will automatically resize accordingly. Use <code>.progress-sm</code>,<code>.progress-md</code>,<code>.progress-lg</code>,<code>.progress-xl</code> classes.</p>

                                      <div className="progress mb-3" style={{ height: '1px' }}>
                                          <div className="progress-bar bg-danger" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress mb-3" style={{ height: '3px' }}>
                                          <div className="progress-bar" role="progressbar" style={{ width: '25%', height: '20px' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress mb-3 progress-sm">
                                          <div className="progress-bar bg-success" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress mb-3 progress-md">
                                          <div className="progress-bar bg-info" role="progressbar" style={{ width: '50%' }} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress progress-lg mb-3">
                                          <div className="progress-bar bg-warning" role="progressbar" style={{ width: '75%' }} aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress progress-xl">
                                          <div className="progress-bar bg-success" role="progressbar" style={{ width: '85%' }} aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Progress with Labels</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>Add labels to your progress bars by placing text within the <code>.progress-bar</code>.</p>

                                      <div className="progress mb-3" role="progressbar" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar" style={{ width: '10%' }}>10%</div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-secondary" style={{ width: '20%' }}>20%</div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-success" style={{ width: '40%' }}>40%</div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-info" style={{ width: '60%' }}>60%</div>
                                      </div>
                                      <div className="progress mb-0" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-warning" style={{ width: '80%' }}>80%</div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Multiple Bars with Sizes</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>You can include multiple progress components inside a container with <code>.progress-stacked</code> to create a single stacked progress bar.</p>

                                      <div className="progress-stacked progress-xs mb-3">
                                          <div className="progress-bar" role="progressbar" style={{ width: '5%' }} aria-valuenow={5} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '10%' }} aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-success" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress-stacked progress-sm mb-3">
                                          <div className="progress-bar bg-warning" role="progressbar" style={{ width: '10%' }} aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-info" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-danger" role="progressbar" style={{ width: '20%' }} aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress-stacked mb-3">
                                          <div className="progress-bar bg-info" role="progressbar" style={{ width: '15%' }} aria-valuenow={15} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-success" role="progressbar" style={{ width: '20%' }} aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress-stacked progress-lg mb-3">
                                          <div className="progress-bar bg-secondary" role="progressbar" style={{ width: '20%' }} aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-danger" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-info" role="progressbar" style={{ width: '30%' }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                      <div className="progress-stacked progress-xl mb-0">
                                          <div className="progress-bar bg-success" role="progressbar" style={{ width: '25%' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-danger" role="progressbar" style={{ width: '30%' }} aria-valuenow={30} aria-valuemin={0} aria-valuemax={100}></div>
                                          <div className="progress-bar bg-warning" role="progressbar" style={{ width: '35%' }} aria-valuenow={35} aria-valuemin={0} aria-valuemax={100}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Animated Stripped Progress</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>The striped gradient can also be animated. Add <code>.progress-bar-animated</code> to <code>.progress-bar</code> to animate the stripes right to left via CSS3 animations.</p>

                                      <div className="progress mb-3" role="progressbar" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: '10%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-secondary progress-bar-striped progress-bar-animated" style={{ width: '20%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-success progress-bar-striped progress-bar-animated" style={{ width: '40%' }}></div>
                                      </div>
                                      <div className="progress mb-3" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-info progress-bar-striped progress-bar-animated" style={{ width: '60%' }}></div>
                                      </div>
                                      <div className="progress" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" style={{ width: '80%' }}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Gradient Progress</h5>
                                  </div>
                                  <div className="card-body">
                                      <p>Add <code>.bg-primary-gradient</code> to any <code>.progress-bar</code> to apply a CSS gradient over the progress bar’s background color.</p>

                                      <div className="progress mb-3 progress-animate" role="progressbar" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-primary-gradient" style={{ width: '10%' }}></div>
                                      </div>
                                      <div className="progress mb-3 progress-animate" role="progressbar" aria-valuenow={20} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-secondary-gradient" style={{ width: '20%' }}></div>
                                      </div>
                                      <div className="progress mb-3 progress-animate" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-success-gradient" style={{ width: '40%' }}></div>
                                      </div>
                                      <div className="progress mb-3 progress-animate" role="progressbar" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-info-gradient" style={{ width: '60%' }}></div>
                                      </div>
                                      <div className="progress progress-animate" role="progressbar" aria-valuenow={80} aria-valuemin={0} aria-valuemax={100}>
                                          <div className="progress-bar bg-warning-gradient" style={{ width: '80%' }}></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Meter</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3"><code>.progress</code> carries chart-sized defaults and expects a <code>.progress-bar</code> child. <code>.meter</code> is the hairline version for list rows and ranking tables — one fill or several segments, no inner class needed.</p>
                                      <div className="meter mb-3"><span className="bg-primary" style={{ width: '72%' }}></span></div>
                                      <div className="meter meter-xs mb-3"><span className="bg-success" style={{ width: '54%' }}></span></div>
                                      <div className="meter meter-lg mb-3"><span className="bg-info" style={{ width: '88%' }}></span></div>

                                      <p className="mb-3">Add <code>.meter-segmented</code> to butt several proportions together.</p>
                                      <div className="meter meter-lg meter-segmented">
                                          <span className="bg-success" style={{ width: '56%' }}></span>
                                          <span className="bg-warning" style={{ width: '24%' }}></span>
                                          <span className="bg-danger" style={{ width: '12%' }}></span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Gauge</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">A circular reading drawn with a conic gradient — no chart library. <code>--gauge-value</code> is a plain number, <code>--gauge-color</code> tints the arc, and <code>--gauge-size</code> overrides the preset.</p>
                                      <div className="d-flex align-items-center flex-wrap gap-4">
                                          <div className="gauge gauge-sm"><span className="gauge-value">62%</span></div>
                                          <div className="gauge"><span className="gauge-value">81%</span></div>
                                          <div className="gauge" style={{ "--gauge-value": '95', "--gauge-color": '#1ABE17' } as CSSProperties}><span className="gauge-value">95%</span></div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Sparkline</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">A trend small enough to sit inside a table cell or list row. Bars are <code>&lt;i&gt;</code> elements with a percentage height; colour comes from <code>--sparkline-fill</code> or a background utility per bar.</p>
                                      <div className="d-flex align-items-center gap-3 mb-3">
                                          <span className="sparkline" style={{ "--sparkline-fill": '#3D5EE1' } as CSSProperties}>
                                              <i style={{ height: '50%' }}></i><i style={{ height: '66%' }}></i><i style={{ height: '58%' }}></i><i style={{ height: '70%' }}></i><i style={{ height: '62%' }}></i><i style={{ height: '80%' }}></i><i style={{ height: '100%' }}></i>
                                          </span>
                                          <span className="stat-delta stat-delta-up"><i className="ti ti-arrow-up"></i>8.2%</span>
                                      </div>
                                      <div className="d-flex align-items-center gap-3">
                                          <span className="sparkline sparkline-lg" style={{ "--sparkline-fill": '#1ABE17' } as CSSProperties}>
                                              <i style={{ height: '60%' }}></i><i style={{ height: '72%' }}></i><i style={{ height: '55%' }}></i><i style={{ height: '84%' }}></i><i style={{ height: '78%' }}></i><i style={{ height: '92%' }}></i><i style={{ height: '100%' }}></i>
                                          </span>
                                          <span className="stat-label">Last 7 days</span>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                          <div className="col-xl-6">
                              <div className="card">
                                  <div className="card-header">
                                      <h5 className="card-title">Stat</h5>
                                  </div>
                                  <div className="card-body">
                                      <p className="mb-3">The figure-and-caption pairing every dashboard repeats. The parts are independent — <code>.stat-caption</code> also works on its own as a section eyebrow.</p>
                                      <div className="row g-3">
                                          <div className="col-6">
                                              <div className="stat-tile stat-tile-hover">
                                                  <span className="stat-caption">Enrolment</span>
                                                  <div className="stat-value stat-value-sm">1,248</div>
                                                  <span className="stat-label stat-label-sm">Active students</span>
                                                  <span className="stat-delta stat-delta-sm stat-delta-up"><i className="ti ti-arrow-up"></i>3%</span>
                                              </div>
                                          </div>
                                          <div className="col-6">
                                              <div className="stat-tile stat-tile-accent stat-tile-hover accent-success">
                                                  <span className="stat-caption">Attendance</span>
                                                  <div className="stat-value stat-value-sm">96%</div>
                                                  <span className="stat-label stat-label-sm">This month</span>
                                                  <span className="stat-delta stat-delta-sm stat-delta-down"><i className="ti ti-arrow-down"></i>1%</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div> {/* end card body */}
                              </div> {/* end card */}
                          </div> {/* end col */}

                      </div>
                      {/* end row */}

            </div>
          </div>
    </div>
  );
};

export default Progress;
