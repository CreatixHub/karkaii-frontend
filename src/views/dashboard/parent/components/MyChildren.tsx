import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { ParentModalId } from '../data/parentDashboard.data';
import { childCards } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

const routes = all_routes;

export interface MyChildrenProps {
  revealed: boolean;
  onOpenModal: (modal: ParentModalId) => void;
}

const MyChildren = ({ revealed, onOpenModal }: MyChildrenProps) => (
  <>
    <PortalSection icon="ti ti-users" eyebrow="Family" title="My Children">
      <Link
        to={routes.studentDetail}
        className="portal-button portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
      >
        <i className="ti ti-arrow-up-right" />
        Open profiles
      </Link>
    </PortalSection>

    <div className="child-cards">
      {childCards.map((card) => (
        <div className={`child-card ${card.accent} position-relative overflow-hidden`} key={card.id}>
          <div className="child-card-top d-flex align-items-center">
            <div
              className={`progress-ring-mini ${card.accent} flex-shrink-0`}
              style={{ '--v': revealed ? card.ringValue : 0 } as React.CSSProperties}
            >
              <ImageWithBasePath src={card.img} alt={card.name} />
              <span className="progress-ring-value">{card.ringLabel}</span>
            </div>

            <div className="child-card-id">
              <b>{card.name}</b>
              <span>{card.detail}</span>
              <div className="child-card-tags">
                {card.tags.map((tag) => (
                  <span className={`badge badge-tag ${tag.className} d-inline-flex align-items-center text-nowrap`} key={tag.label}>
                    {tag.icon ? <i className={tag.icon} /> : null}
                    {tag.label}
                  </span>
                ))}
              </div>
            </div>

            <span className={`badge badge-tag ${card.headBadge.className} ms-auto d-inline-flex align-items-center text-nowrap`}>
              <i className={card.headBadge.icon} />
              {card.headBadge.label}
            </span>
          </div>

          <div className="child-card-metrics">
            {card.metrics.map((metric) => (
              <div className="child-card-metric text-center" key={metric.label}>
                <div className="child-card-metric-label">{metric.label}</div>
                <div className="child-card-metric-value">
                  {metric.value}
                  {metric.suffix ? <small>{metric.suffix}</small> : null}
                </div>
              </div>
            ))}
          </div>

          <div className="child-card-foot d-flex align-items-center">
            <span className="badge badge-tag accent-warning d-inline-flex align-items-center text-nowrap">
              <i className="ti ti-star-filled" />
              {card.teacherRating}
            </span>
            <span className="flex-grow-1" />
            <button
              type="button"
              className="portal-icon text-decoration-none"
              title="Message"
              onClick={() => onOpenModal('message')}
            >
              <i className="ti ti-message" />
            </button>
            <button
              type="button"
              className="portal-icon text-decoration-none"
              title="Timetable"
              onClick={() => onOpenModal('timetable')}
            >
              <i className="ti ti-table" />
            </button>
            <Link
              to={routes.studentDetail}
              className="portal-button portal-button-xs d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              Details
              <i className="ti ti-chevron-right" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default MyChildren;
