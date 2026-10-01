import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import { notifications } from '../data/studentDashboard.data';

const NotificationsCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-bell" title="Notifications">
      <span className="badge badge-soft-danger">4 new</span>
    </WidgetHeader>

    <div className="info-list d-flex flex-column">
      {notifications.map((row) => (
        <InfoListRow row={row} key={row.id} />
      ))}
    </div>
  </div>
);

export default NotificationsCard;
