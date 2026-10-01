const UiTimeline = () => (
  <>
<div className="page-wrapper cardhead">

			<div className="content">

				{/* Page Header */}
				<div className="page-header">
					<div className="row">
						<div className="col-sm-12">
							<h3 className="page-title">Timeline</h3>
						</div>
					</div>
				</div>
				{/* /Page Header */}

				<div className="row">

					{/* Ribbon */}
					<div className="col-md-12">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title fs-16 fw-medium">Time-Gutter Timeline</h4>
							</div>
							<div className="card-body">
								<p>A fixed time column beside the entry body, with the connector drawn between dots &mdash; for day schedules and agendas. Distinct from the icon-rail <code>activity-feed</code>. Add <code>live</code> to the row for a pulsing marker.</p>
								<div className="portal-timeline-track position-relative">
									<div className="portal-timeline position-relative live">
										<div className="portal-timeline-time text-end">09:15<small>AM</small></div>
										<div className="portal-timeline-body position-relative">
											<span className="portal-timeline-dot position-absolute"></span>
											<b>Mathematics</b>
											<p>Room 12 &middot; Ms. Teresa Susan</p>
										</div>
									</div>
									<div className="portal-timeline position-relative">
										<div className="portal-timeline-time text-end">10:30<small>AM</small></div>
										<div className="portal-timeline-body position-relative">
											<span className="portal-timeline-dot position-absolute"></span>
											<b>Science Lab</b>
											<p>Lab 01 &middot; Mr. John Doe</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="card">
							<div className="card-body">
								<ul className="timeline">
									<li>
										<div className="timeline-badge success">
											<i className="fas fa-user"></i>
										</div>
										<div className="timeline-panel">
											<div className="timeline-heading">
												<h4 className="timeline-title">Title</h4>
											</div>
											<div className="timeline-body">
												<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero
													laboriosam
													dolor perspiciatis omnis exercitationem. Beatae, officia pariatur?
													Est
													cum veniam excepturi. Maiores praesentium, porro voluptas suscipit
													facere
													rem dicta, debitis.</p>
											</div>
										</div>
									</li>
									<li className="timeline-inverted">
										<div className="timeline-badge warning">
											<i className="fas fa-users"></i>
										</div>
										<div className="timeline-panel">
											<div className="timeline-heading">
												<h4 className="timeline-title">Title </h4>
											</div>
											<div className="timeline-body">
												<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium
													maiores
													odit qui est tempora eos, nostrum provident explicabo dignissimos
													debitis
													vel! Adipisci eius voluptates, ad aut recusandae minus eaque facere.
												</p>
											</div>
										</div>
									</li>
									<li>
										<div className="timeline-badge danger">
											<i className="fas fa-gift"></i>
										</div>
										<div className="timeline-panel">
											<div className="timeline-heading">
												<h4 className="timeline-title">Lorem ipsum dolor</h4>
											</div>
											<div className="timeline-body">
												<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus
													numquam
													facilis enim eaque, tenetur nam id qui vel velit similique nihil
													iure
													molestias aliquam, voluptatem totam quaerat, magni commodi quisquam.
												</p>
											</div>
										</div>
									</li>
									<li className="timeline-inverted">
										<div className="timeline-panel">
											<div className="timeline-heading">
												<h4 className="timeline-title">Lorem ipsum dolor</h4>
											</div>
											<div className="timeline-body">
												<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates
													est
													quaerat asperiores sapiente, eligendi, nihil. Itaque quos, alias
													sapiente
													rerum quas odit! Aperiam officiis quidem delectus libero, omnis ut
													debitis!</p>
											</div>
										</div>
									</li>
									<li>
										<div className="timeline-badge info">
											<i className="fa fa-save"></i>
										</div>
										<div className="timeline-panel">
											<div className="timeline-heading">
												<h4 className="timeline-title">Lorem ipsum dolor</h4>
											</div>
											<div className="timeline-body">
												<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nobis minus
													modi
													quam ipsum alias at est molestiae excepturi delectus nesciunt,
													quibusdam</p>
											</div>
										</div>
									</li>
									<li className="timeline-inverted">
										<div className="timeline-badge success">
											<i className="fa fa-graduation-cap"></i>
										</div>
										<div className="timeline-panel">
											<div className="timeline-heading">
												<h4 className="timeline-title">Lorem ipsum dolor</h4>
											</div>
											<div className="timeline-body">
												<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt
													obcaecati,
													quaerat tempore officia voluptas debitis consectetur culpa amet,
													accusamus
													dolorum fugiat, animi dicta aperiam, enim incidunt quisquam maxime
													neque
													eaque.
												</p>
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</div>
					{/* /Ribbon */}

					<div className="col-md-12">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Activity Feed</h5>
							</div>
							<div className="card-body">
								<p className="mb-3">The timeline above alternates panels left and right. <code>.activity-feed</code> is the compact single-column form dashboards use for recent activity: each event is marked by an icon tile that drops onto the rail automatically, so it can sit anywhere among the item's children.</p>
								<ul className="activity-feed activity-feed-roomy mb-0">
									<li className="activity-feed-divider"><span>Today</span></li>
									<li>
										<span className="avatar avatar-icon avatar-md bg-primary-transparent"><i className="ti ti-send"></i></span>
										<div className="d-flex align-items-start justify-content-between">
											<div>
												<h6 className="mb-1">Fee reminder circular sent to <span className="fw-semibold">412 parents</span></h6>
												<div className="d-flex align-items-center gap-2">
													<span className="chip chip-soft chip-muted"><i className="ti ti-clock"></i>20m</span>
													<span className="chip chip-square chip-soft chip-danger"><i className="ti ti-flag-3-filled"></i>High</span>
												</div>
											</div>
											<span className="badge badge-soft-primary flex-shrink-0">Circular</span>
										</div>
									</li>
									<li>
										<span className="avatar avatar-icon avatar-md bg-success-transparent"><i className="ti ti-message-2"></i></span>
										<div className="d-flex align-items-start justify-content-between">
											<div>
												<h6 className="mb-1">SMS batch delivered &mdash; <span className="fw-semibold">98.6%</span> success</h6>
												<span className="chip chip-soft chip-muted"><i className="ti ti-clock"></i>1h</span>
											</div>
											<span className="badge badge-soft-success flex-shrink-0">Delivered</span>
										</div>
									</li>
									<li className="activity-feed-divider"><span>Yesterday</span></li>
									<li>
										<span className="avatar avatar-icon avatar-md bg-warning-transparent"><i className="ti ti-speakerphone"></i></span>
										<div className="d-flex align-items-start justify-content-between">
											<div>
												<h6 className="mb-1">Sports Day circular published</h6>
												<span className="chip chip-soft chip-muted"><i className="ti ti-clock"></i>4:12 PM</span>
											</div>
											<span className="badge badge-soft-warning flex-shrink-0">Notice</span>
										</div>
									</li>
								</ul>
							</div> {/* end card body */}
						</div> {/* end card */}
					</div> {/* end col */}

				</div>
			</div>

		</div>
  </>
);

export default UiTimeline;
