import { Fragment } from 'react';
import type { SummaryStat } from '../data/idCardsWorkspace.data';

export interface IdCardSummaryProps {
  stats: SummaryStat[];
}

const IdCardSummary = ({ stats }: IdCardSummaryProps) => (
  <div className="card">
    <div className="card-body">
      <div className="d-flex align-items-center flex-wrap gap-3">
        {stats.map((stat, index) => {
          const Value = stat.tag;
          return (
            <Fragment key={stat.id}>
              {index > 0 ? <div className="vr d-none d-xl-block" /> : null}
              <div className="d-flex align-items-center flex-fill overflow-hidden">
                <span className={`avatar avatar-md ${stat.tint} rounded flex-shrink-0`}>
                  <i className={stat.icon} />
                </span>
                <div className="ms-2 overflow-hidden">
                  <span className="fs-12 text-muted d-block text-truncate">{stat.label}</span>
                  <Value className={stat.valueClass}>{stat.value}</Value>
                  <span className="fs-12 text-muted d-block text-truncate">{stat.hint}</span>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  </div>
);

export default IdCardSummary;
