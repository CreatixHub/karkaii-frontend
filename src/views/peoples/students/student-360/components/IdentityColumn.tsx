import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { QuickAction, StudentIdentity } from '../data/student360.data';

export interface IdentityColumnProps {
  identity: StudentIdentity;
  actions: QuickAction[];
}

const IdentityColumn = ({ identity, actions }: IdentityColumnProps) => (
  <div className="col-xxl-3 col-xl-4 theiaStickySidebar">
    <div className="card">
      <div className="card-header text-center">
        <div className="d-flex flex-column align-items-center">
          <span className="avatar avatar-xxl mb-2">
            <ImageWithBasePath src={identity.photo} className="img-fluid rounded" alt="img" />
          </span>
          <span className="badge badge-soft-success d-inline-flex align-items-center mb-1">
            <i className="ti ti-circle-filled fs-5 me-1" />
            {identity.status}
          </span>
          <h4 className="mb-1 fs-16 fw-medium">{identity.name}</h4>
          <p className="text-primary mb-0">{identity.meta}</p>
        </div>
      </div>
      <div className="card-body">
        <dl className="row mb-0">
          {identity.details.map((detail) => (
            <Fragment key={detail.label}>
              <dt className={`col-5 fs-13 text-muted ${detail.last ? 'mb-0' : 'mb-2'}`}>
                {detail.label}
              </dt>
              <dd className={`col-7 fs-13 ${detail.last ? 'mb-0' : 'mb-2'}`}>{detail.value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
    </div>
    <div className="card mb-0">
      <div className="card-header">
        <h5 className="mb-0 fs-15">Quick Actions</h5>
      </div>
      <div className="card-body">
        {actions.map((action) => (
          <Link
            key={action.id}
            to={action.to}
            className={`btn btn-light w-100 d-flex align-items-center justify-content-start ${
              action.last ? 'mb-0' : 'mb-2'
            }`}
          >
            <i className={`${action.icon} me-2`} />
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export default IdentityColumn;
