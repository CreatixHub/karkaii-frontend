const UiBorders = () => (
  <>
<div className="page-wrapper">
			<div className="content">
				<div className="page-header">
					<div className="page-title">
						<h3>Borders</h3>
					</div>
				</div>
				<div className="row">

					{/* Borders */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header">
								<h4 className="card-title fs-16 fw-medium">Borders</h4>
							</div>
							<div className="card-body">
								<span className="border border-container"></span>
								<span className="border-top border-container"></span>
								<span className="border-end border-container"></span>
								<span className="border-bottom border-container"></span>
								<span className="border-start border-container"></span>
							</div>
						</div>
					</div>
					{/* /Borders */}

					{/* Remove Borders */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Remove Borders</h5>
							</div>
							<div className="card-body">
								<span className="border-0 border-container"></span>
								<span className="border border-top-0 border-container"></span>
								<span className="border border-end-0 border-container"></span>
								<span className="border border-bottom-0 border-container"></span>
								<span className="border border-start-0 border-container"></span>
							</div>
						</div>
					</div>
					{/* /Remove Borders */}

					{/* Borders Widths */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title"> Border Widths </h5>
							</div>
							<div className="card-body">
								<span className="border border-container border-1"></span>
								<span className="border border-container border-2"></span>
								<span className="border border-container border-3"></span>
								<span className="border border-container border-4"></span>
								<span className="border border-container border-5"></span>
							</div>
						</div>
					</div>
					{/* /Borders Widths */}

					{/* Borders Colors */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Border Colors</h5>
							</div>
							<div className="card-body">
								<span className="border border-container border-primary"></span>
								<span className="border border-container border-secondary"></span>
								<span className="border border-container border-success"></span>
								<span className="border border-container border-danger"></span>
								<span className="border border-container border-warning"></span>
								<span className="border border-container border-info"></span>
								<span className="border border-container border-light"></span>
								<span className="border border-container border-dark"></span>
								<span className="border border-container border-white"></span>
							</div>
						</div>
					</div>
					{/* /Borders Colors */}

					{/* Borders */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header justify-content-between">
								<div className="card-title">
									Border color Styling
								</div>
							</div>
							<div className="card-body">
								<div className="mb-4">
									<label htmlFor="exampleFormControlInput1" className="form-label">Email
										address</label>
									<input type="email" className="form-control border-success" id="exampleFormControlInput1" placeholder="name@example.com" />
								</div>
								<div className="h4 pb-3 mb-4 text-danger border-bottom border-danger">
									Below Shows Danger Border
								</div>
								<div className="p-3 bg-info bg-opacity-10 border border-info border-start-0 rounded-end mb-1 text-muted">
									Customizing borders with backgrounud colors
								</div>
							</div>
						</div>
					</div>
					{/* /Borders */}

					{/* Borders with opacity */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header justify-content-between">
								<div className="card-title">
									Border with opacity
								</div>
							</div>
							<div className="card-body">
								<div className="border border-success p-2 mb-2">This is default success border</div>
								<div className="border border-success p-2 mb-2 border-opacity-75">This is 75%
									opacity
									success border
								</div>
								<div className="border border-success p-2 mb-2 border-opacity-50">This is 50%
									opacity
									success border
								</div>
								<div className="border border-success p-2 mb-2 border-opacity-25">This is 25%
									opacity
									success border
								</div>
								<div className="border border-success p-2 border-opacity-10">This is 10% opacity
									success
									border
								</div>
							</div>
						</div>
					</div>
					{/* /Borders with opacity */}

					{/* Borders Radius */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Border Radius</h5>
							</div>
							<div className="card-body">
								<img src="assets/img/profiles/avatar-01.jpg" className="avatar-xxl avatar bd-placeholder-img rounded" alt="img" />
								<img src="assets/img/profiles/avatar-02.jpg" className="avatar-xxl avatar  d-placeholder-img rounded-top" alt="img" />
								<img src="assets/img/profiles/avatar-03.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-end" alt="img" />
								<img src="assets/img/profiles/avatar-07.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-bottom" alt="img" />
								<img src="assets/img/profiles/avatar-04.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-start" alt="img" />
								<img src="assets/img/profiles/avatar-05.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-circle flex-shrink-0" alt="img" />
								<img src="assets/img/profiles/avatar-06.jpg" className="avatar-xxl avatar bd-placeholder-img  rounded-pill" alt="img" />
							</div>
						</div>
					</div>
					{/* /Borders Radius */}

					{/* Sizes */}
					<div className="col-xl-6">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Sizes</h5>
							</div>
							<div className="card-body">
								<img src="assets/img/profiles/avatar-01.jpg" className="avatar-xxl avatar bd-placeholder-img rounded" alt="img" />
								<img src="assets/img/profiles/avatar-02.jpg" className="avatar-xxl avatar  d-placeholder-img rounded-top" alt="img" />
								<img src="assets/img/profiles/avatar-03.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-end" alt="img" />
								<img src="assets/img/profiles/avatar-04.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-start" alt="img" />
								<img src="assets/img/profiles/avatar-05.jpg" className="avatar-xxl avatar bd-placeholder-img rounded-circle flex-shrink-0" alt="img" />
								<img src="assets/img/profiles/avatar-06.jpg" className="avatar-xxl avatar bd-placeholder-img  rounded-pill" alt="img" />
							</div>
						</div>
					</div>
					{/* /Sizes */}

				</div>
			</div>
		</div>
		
  </>
);

export default UiBorders;
