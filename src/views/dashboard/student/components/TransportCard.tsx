import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import {
  recentTrips,
  routeProgress,
  routeStops,
  transportDetails,
} from '../data/studentDashboard.data';

export interface TransportCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const TransportCard = ({ onOpenModal }: TransportCardProps) => (
  <div className="card-widget card-widget-body h-100 flow-list d-flex flex-column">
    <WidgetHeader icon="ti ti-bus" title="Transport">
      <span className="badge badge-soft-success">
        <span className="live-dot d-inline-block me-1 align-middle" />
        Live
      </span>
    </WidgetHeader>

    <div className="mb-3">
      <div className="route-line position-relative">
        <span className="fill" style={{ width: routeProgress.fill }} />
        <span className="bus" style={{ left: routeProgress.busPosition }}>
          <i className="ti ti-bus" />
        </span>
      </div>
      <div className="route-stops d-flex justify-content-between">
        {routeStops.map((stop) => (
          <span className={stop.state || undefined} key={stop.id}>
            {stop.label}
          </span>
        ))}
      </div>
    </div>

    <div className="detail-grid mb-3">
      {transportDetails.map((detail) => (
        <div className="detail-tile d-flex align-items-center" key={detail.id}>
          <span className={`ic ${detail.iconClass}`}>
            <i className={detail.icon} />
          </span>
          <div>
            <b>{detail.value}</b>
            <span>{detail.label}</span>
          </div>
        </div>
      ))}
    </div>

    <h6 className="widget-subtitle mb-2">
      <i className="ti ti-history me-1" />
      Recent Trips
    </h6>
    <div className="info-list mb-3 d-flex flex-column">
      {recentTrips.map((row) => (
        <InfoListRow row={row} key={row.id} small />
      ))}
    </div>

    <button
      type="button"
      className="action-button action-button-primary action-button-sm flow-end d-inline-flex align-items-center text-nowrap text-decoration-none"
      onClick={() => onOpenModal('track')}
    >
      <i className="ti ti-map-2" />
      Track Bus Live
    </button>
  </div>
);

export default TransportCard;
