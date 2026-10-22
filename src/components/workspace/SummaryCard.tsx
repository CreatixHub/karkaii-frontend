import { Fragment } from 'react';

export interface SummaryItem {
  id: string;
  /** Bootstrap tint stem, e.g. "danger" — expands to bg-*-transparent text-*. */
  tint: string;
  icon: string;
  label: string;
  value: string;
  /** The smaller line under the figure, e.g. "212 invoices". */
  hint?: string;
}

export interface SummaryCardProps {
  items: SummaryItem[];
}

const SummaryCard = ({ items }: SummaryCardProps) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-center flex-wrap gap-3">
        {items.map((item, index) => (
          <Fragment key={item.id}>
            <div className="d-flex align-items-center flex-fill overflow-hidden">
              <span className={`avatar avatar-md bg-${item.tint}-transparent text-${item.tint} rounded flex-shrink-0`}>
                <i className={item.icon} />
              </span>
              <div className="ms-2 overflow-hidden">
                <span className="fs-12 text-muted d-block text-truncate">{item.label}</span>
                <h5 className="fs-16 mb-0">{item.value}</h5>
                {item.hint ? <span className="fs-12 text-muted d-block text-truncate">{item.hint}</span> : null}
              </div>
            </div>
            {index === items.length - 1 ? null : <div className="vr d-none d-xl-block" />}
          </Fragment>
        ))}
      </div>
    </div>
  </div>
);

export default SummaryCard;
