import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';

const Plugins = () => (
  <>
<div className="page-wrapper">
			<div className="content blank-page">
				{/* Page Header */}
				<div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
					<div className="my-auto mb-2">
						<h3 className="page-title mb-1">Blank</h3>
						<nav>
							<ol className="breadcrumb mb-0">
								<li className="breadcrumb-item">
									<Link to={all_routes.adminDashboard}>Dashboard</Link>
								</li>
								<li className="breadcrumb-item">
									<a role="button" tabIndex={0}>Content</a>
								</li>
								<li className="breadcrumb-item active" aria-current="page">Blank</li>
							</ol>
						</nav>
					</div>
					<div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
						<div className="pe-1 mb-2">
							<a role="button" tabIndex={0} className="btn btn-outline-light bg-white btn-icon me-1" aria-label="Refresh">
								<i className="ti ti-refresh"></i>
							</a>
						</div>
						<div className="pe-1 mb-2">
							<button type="button" className="btn btn-outline-light bg-white btn-icon me-1" aria-label="Print">
								<i className="ti ti-printer"></i>
							</button>
						</div>
					</div>
				</div>
				{/* /Page Header */}
			</div>
		</div>
		
  </>
);

export default Plugins;
