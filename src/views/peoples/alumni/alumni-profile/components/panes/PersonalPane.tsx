import { Fragment } from 'react';
import { personalAddress, personalDetails } from '../../data/alumniProfile.data';

const PersonalPane = () => (
  <div>
    <h5 className="mb-3">Personal Details</h5>
    <dl className="row mb-0">
      {personalDetails.map((field) => (
        <Fragment key={field.label}>
          <dt className="col-sm-3 text-muted mb-3">{field.label}</dt>
          <dd className="col-sm-3 mb-3">{field.value}</dd>
        </Fragment>
      ))}
      <dt className="col-sm-3 text-muted mb-0">Address</dt>
      <dd className="col-sm-9 mb-0">{personalAddress}</dd>
    </dl>
  </div>
);

export default PersonalPane;
