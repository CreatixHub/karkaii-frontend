import type { ParentActionId } from '../data/parentDashboard.data';
import { busCells, busRoute } from '../data/parentDashboard.data';
import PortalSection from './PortalSection';

export interface LiveBusProps {
  onAction: (action: ParentActionId) => void;
}

const LiveBus = ({ onAction }: LiveBusProps) => (
  <>
    <PortalSection icon="ti ti-map-2" eyebrow="Transport" title="School Bus · Live">
      <span className="parent-live-flag">TRACKING</span>
    </PortalSection>

    <div className="card card-flush">
      <div className="card-body">
        <div className="bus-route-map position-relative">
          <div className="bus-route-line position-absolute">
            <div className="bus-route-fill position-absolute" style={{ width: busRoute.fill }} />
          </div>
          {busRoute.stops.map((stop) => (
            <div
              key={stop.id}
              className={`bus-route-stop${stop.completed ? ' completed' : ''}`}
              style={{ left: stop.left }}
            >
              <em>{stop.label}</em>
            </div>
          ))}
          <span className="bus-route-icon position-absolute">
            <i className="ti ti-bus" />
          </span>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <b className="fs-13 text-body-emphasis">
            ETA to Maple St · <span className="text-primary">{busRoute.eta}</span>
          </b>
          <span className="badge badge-tag accent-success d-inline-flex align-items-center text-nowrap">
            <i className="ti ti-gauge" />
            {busRoute.speed}
          </span>
        </div>

        <div className="bus-route-grid">
          {busCells.map((cell) => (
            <div className={`bus-route-cell ${cell.accent} align-items-center`} key={cell.id}>
              <span className="avatar avatar-icon avatar-28 avatar-r-8 avatar-glyph-14 avatar-accent-soft">
                <i className={cell.icon} />
              </span>
              <div>
                <b>{cell.value}</b>
                <span>{cell.label}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="portal-button portal-button-dark w-100 mt-3 d-inline-flex align-items-center justify-content-center text-nowrap text-decoration-none"
          onClick={() => onAction('call_driver')}
        >
          <i className="ti ti-phone" />
          Emergency Contact
        </button>
      </div>
    </div>
  </>
);

export default LiveBus;
