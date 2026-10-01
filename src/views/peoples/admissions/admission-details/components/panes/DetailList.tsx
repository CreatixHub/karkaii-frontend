import { Fragment } from 'react';
import type { DetailField } from '../../data/admissionDetails.data';

export interface DetailListProps {
  title: string;
  fields: DetailField[];
  /** The template's last `<dd>` sometimes spans the full width (an address). */
  wide?: DetailField;
}

const DetailList = ({ title, fields, wide }: DetailListProps) => (
  <div>
    <h5 className="mb-3">{title}</h5>
    <dl className="row mb-0">
      {fields.map((field, index) => {
        const isLast = !wide && index === fields.length - 1;
        return (
          <Fragment key={field.label}>
            <dt className={`col-sm-3 text-muted${isLast ? ' mb-0' : ' mb-3'}`}>{field.label}</dt>
            <dd className={`col-sm-3${isLast ? ' mb-0' : ' mb-3'}`}>{field.value}</dd>
          </Fragment>
        );
      })}
      {wide ? (
        <>
          <dt className="col-sm-3 text-muted mb-0">{wide.label}</dt>
          <dd className="col-sm-9 mb-0">{wide.value}</dd>
        </>
      ) : null}
    </dl>
  </div>
);

export default DetailList;
