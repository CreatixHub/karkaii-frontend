import ImageWithBasePath from '@core/common/imageWithBasePath';
import { guardians } from '../../data/admissionDetails.data';

const GuardianPane = () => (
  <div>
    <h5 className="mb-3">Guardian Details</h5>
    <div className="row">
      {guardians.map((guardian) => (
        <div className="col-md-6" key={guardian.name}>
          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center mb-2">
              <span className="avatar avatar-md me-2">
                <ImageWithBasePath src={guardian.avatar} className="rounded-circle flex-shrink-0" alt="img" />
              </span>
              <div>
                <h6 className="mb-0">{guardian.name}</h6>
                <span className="fs-12 text-muted">{guardian.role}</span>
              </div>
            </div>
            <p className="mb-1 fs-13">
              <i className="ti ti-phone me-2" />
              {guardian.phone}
            </p>
            <p className="mb-1 fs-13">
              <i className="ti ti-mail me-2" />
              {guardian.email}
            </p>
            <p className="mb-0 fs-13">
              <i className="ti ti-briefcase me-2" />
              {guardian.occupation}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default GuardianPane;
