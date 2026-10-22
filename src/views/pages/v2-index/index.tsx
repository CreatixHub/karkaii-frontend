import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import { INTRO, PAGE_COUNT, WAVES } from './data/modules.data';

const routes = all_routes;

const V2Index = () => (
  <div className="page-wrapper">
    <div className="content">
      <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <div className="my-auto mb-2">
          <h3 className="page-title mb-1">v2.0 Modules — Index</h3>
          <nav>
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to={routes.adminDashboard}>Dashboard</Link>
              </li>
              <li className="breadcrumb-item active">v2.0 Index</li>
            </ol>
          </nav>
        </div>
        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
          <span className="badge badge-soft-primary fs-13 mb-2">
            <i className="ti ti-checklist me-1" />
            {PAGE_COUNT} new pages
          </span>
        </div>
      </div>

      <div className="alert alert-info d-flex align-items-center" role="alert">
        <i className="ti ti-info-circle me-2 fs-16" />
        <span>{INTRO}</span>
      </div>

      {WAVES.map((wave) => (
        <div className="card" key={wave.id}>
          <div className="card-header">
            <h4 className="mb-0 fs-16 fw-medium">
              <i className={`${wave.icon} text-${wave.tint} me-2`} />
              {wave.title}
            </h4>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {wave.pages.map((page) => (
                <div className="col-xl-3 col-md-6" key={page.id}>
                  {page.route ? (
                    <Link to={page.route} className="d-block border rounded p-3 text-dark">
                      <i className={`${page.icon} text-${wave.tint} me-1`} />
                      {page.label}
                    </Link>
                  ) : (
                    <div className="d-block border rounded p-3 text-muted">
                      <i className={`${page.icon} text-${wave.tint} me-1`} />
                      {page.label}
                      <span className="badge badge-soft-secondary ms-2 fs-11">Not in build</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default V2Index;
