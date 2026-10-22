import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';
import type { StudentModalId } from '../data/studentDashboard.data';
import { communicationMessages } from '../data/studentDashboard.data';

export interface CommunicationCardProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const CommunicationCard = ({ onOpenModal }: CommunicationCardProps) => (
  <div className="card-widget card-widget-body h-100 flow-list d-flex flex-column">
    <WidgetHeader icon="ti ti-messages" title="Communication">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('message')}
      >
        <i className="ti ti-inbox" />
        <span className="badge badge-danger ms-1">5</span>
      </button>
    </WidgetHeader>

    <div className="info-list mb-3 d-flex flex-column">
      {communicationMessages.map((row) => (
        <InfoListRow row={row} key={row.id} />
      ))}
    </div>

    <div className="d-flex gap-2 flow-end">
      <button
        type="button"
        className="action-button action-button-sm flex-fill d-inline-flex align-items-center justify-content-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('message')}
      >
        <i className="ti ti-inbox" />
        Open Inbox
      </button>
      <button
        type="button"
        className="action-button action-button-sm action-button-primary flex-fill d-inline-flex align-items-center justify-content-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('message')}
      >
        <i className="ti ti-send" />
        New Message
      </button>
    </div>
  </div>
);

export default CommunicationCard;
