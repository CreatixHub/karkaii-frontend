import { Fragment } from 'react';
import { overview, quickActions } from '../data/admissionDetails.data';

export interface OverviewSidebarProps {
  onQuickAction: (id: string) => void;
}

const OverviewSidebar = ({ onQuickAction }: OverviewSidebarProps) => (
  <div className="col-12 col-xxl-3 col-xl-4 theiaStickySidebar">
    <div className="card card-hover">
      <div className="card-header">
        <h6 className="mb-0">
          <i className="ti ti-id-badge-2 me-2 text-primary" />
          Overview
        </h6>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fs-12 text-muted">Admission Completeness</span>
            <span className="fs-12 fw-semibold">{overview.completeness}%</span>
          </div>
          <div className="progress" style={{ height: 6 }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${overview.completeness}%` }}
              aria-valuenow={overview.completeness}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
        <h6 className="mb-2">Basic Information</h6>
        <dl className="row mb-0">
          {overview.basics.map((item, index) => (
            <Fragment key={item.label}>
              <dt className={`col-5 fs-13 text-muted${index < overview.basics.length - 1 ? ' mb-2' : ' mb-0'}`}>
                {item.label}
              </dt>
              <dd className={`col-7 fs-13${index < overview.basics.length - 1 ? ' mb-2' : ' mb-0'}`}>
                {item.value}
              </dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
    <div className="card mb-0">
      <div className="card-header">
        <h6 className="mb-0">Quick Actions</h6>
      </div>
      <div className="card-body">
        {quickActions.map((action, index) => (
          <button
            type="button"
            className={`btn btn-light w-100 d-flex align-items-center justify-content-start${
              index < quickActions.length - 1 ? ' mb-2' : ' mb-0'
            }`}
            key={action.id}
            onClick={() => onQuickAction(action.id)}
          >
            <i className={`${action.icon} me-2`} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default OverviewSidebar;
