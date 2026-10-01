const UiCounter = () => (
  <>
<div className="page-wrapper cardhead">
			<div className="content">

				{/* Page Header */}
				<div className="page-header">
					<div className="row">
						<div className="col-sm-12">
							<h3 className="page-title">Counter</h3>
						</div>
					</div>
				</div>
				{/* /Page Header */}

				<div className="row">

					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								<h4 className="fs-16 fw-medium">Clients</h4>
								<h5 className="counter fs-15">3,000</h5>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								<h5>Total Sales</h5>
								<h6 className="counter">10,000</h6>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-body">
								<h5>Total Projects</h5>
								<h6 className="counter">15,000</h6>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Count Down</h5>
							</div>
							<div className="card-body">
								<h6>Time Count from 3</h6>
								<span id="timer-countdown"></span>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Count Up</h5>
							</div>
							<div className="card-body">
								<h6>Time Counting From 0</h6>
								<span id="timer-countup"></span>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Count Inbetween</h5>
							</div>
							<div className="card-body">
								<h6>Time counting from 30 to 20</h6>
								<span id="timer-countinbetween"></span>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Count Callback</h5>
							</div>
							<div className="card-body">
								<h6>Count from 10 to 0 and calls timer end callback</h6>
								<span id="timer-countercallback"></span>
							</div>
						</div>
					</div>
					{/* /Counter */}

					<div className="col-md-4">
						<div className="card">
							<div className="card-header">
								<h5 className="card-title">Custom Output</h5>
							</div>
							<div className="card-body">
								<h6>Changed output pattern</h6>
								<span id="timer-outputpattern"></span>
							</div>
						</div>
					</div>
					{/* /Counter */}

				</div>

			</div>
		</div>
  </>
);

export default UiCounter;
