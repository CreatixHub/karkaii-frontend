import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import type { TimelineCategory, TimelineEntry } from '../data/studentPromotion.data';
import { reportSummary, timelineFilters } from '../data/studentPromotion.data';

const routes = all_routes;

export interface RecentPromotionsProps {
  entries: TimelineEntry[];
  filter: 'all' | TimelineCategory;
  onFilter: (filter: 'all' | TimelineCategory) => void;
  revealed: boolean;
}

const RecentPromotions = ({ entries, filter, onFilter, revealed }: RecentPromotionsProps) => {
  const shown = entries.filter((entry) => filter === 'all' || entry.cat === filter);

  return (
    <div className="panel-block panel-block-body mt-3">
      <div className="tile-head mb-3">
        <div>
          <h6 className="heading-row mb-1">
            <i className="ti ti-history" />
            Recent Promotions
          </h6>
          <span className="sub-label">Latest promotion batches processed this academic session</span>
        </div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
          <div className="chip-set" id="pwRpFilter">
            {timelineFilters.map((chip) => (
              <span
                className={`chip-item${chip.id === filter ? ' active' : ''}`}
                key={chip.id}
                role="button"
                tabIndex={0}
                onClick={() => onFilter(chip.id)}
              >
                {chip.label}
              </span>
            ))}
          </div>
          <Link to={routes.studentPromotion} className="promotion-button promotion-button-sm">
            View Full History
            <i className="ti ti-arrow-right" />
          </Link>
        </div>
      </div>

      <div className="report-summary mb-4">
        {reportSummary.map((item) => (
          <div className={`report-sum ${item.tone}`} key={item.id}>
            <span className="ic">
              <i className={item.icon} />
            </span>
            <div className="tx">
              <b>{revealed ? item.count : 0}</b>
              <span>{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="promotion-timeline report-list">
        {shown.map((entry) => (
          <div className="promotion-timeline-list" data-cat={entry.cat} key={entry.id}>
            <span className={`promotion-timeline-icon ${entry.tone}`}>
              <i className={entry.icon} />
            </span>
            <div className="promotion-timeline-body">
              <div className="promotion-timeline-top">
                <b>{entry.title}</b>
                <span className="promotion-timeline-route">{entry.route}</span>
                <span className={`pill-tag ${entry.badge.tone}`}>
                  <i className={entry.badge.icon} />
                  {entry.badge.label}
                </span>
              </div>
              <div className="promotion-timeline-meta">
                <span className="avatar-row-stack">
                  {entry.avatars.map((avatar) => (
                    <img src={avatar} alt="" key={avatar} />
                  ))}
                  <em>{entry.extra}</em>
                </span>
                <i className="ti ti-point-filled" />
                <span>
                  {entry.approvedLabel} <b>{entry.approvedBy}</b>
                </span>
              </div>
            </div>
            <div className="promotion-timeline-right">
              <span className="promotion-timeline-num">{entry.num}</span>
              <span className="promotion-timeline-date">{entry.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPromotions;
