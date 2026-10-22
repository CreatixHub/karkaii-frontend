import type { TeacherModalId } from '../data/teacherDashboard.data';
import { notifications } from '../data/teacherDashboard.data';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';

export interface NotificationsCardProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const NotificationsCard = ({ onOpenModal }: NotificationsCardProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-bell" title="Notifications">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('notifications')}
      >
        <i className="ti ti-eye" />
        View All <span className="badge badge-soft-danger ms-1">4</span>
      </button>
    </WidgetHeader>

    <div className="info-list d-flex flex-column">
      {notifications.map((row) => (
        <InfoListRow row={row} key={row.id} />
      ))}
    </div>
  </div>
);

export default NotificationsCard;
