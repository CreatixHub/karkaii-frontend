import { useState } from 'react';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import {
  announcements,
  communicationStats,
  recentMessages,
} from '../data/teacherDashboard.data';
import InfoListRow from '../../shared/InfoListRow';
import WidgetHeader from '../../shared/WidgetHeader';

export interface ParentCommunicationCardProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const ParentCommunicationCard = ({ onOpenModal }: ParentCommunicationCardProps) => {
  const [reply, setReply] = useState('');

  const handleSend = (event: React.FormEvent) => {
    event.preventDefault();
    if (!reply.trim()) return;
    // Wire to a messaging service when the API is connected.
    setReply('');
  };

  return (
    <div className="card-widget card-widget-body h-100 flow-list d-flex flex-column">
      <WidgetHeader icon="ti ti-messages" title="Parent Communication">
        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
            onClick={() => onOpenModal('events')}
          >
            <i className="ti ti-calendar-plus" />
            Schedule PTA
          </button>
          <button
            type="button"
            className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
            onClick={() => onOpenModal('messages')}
          >
            <i className="ti ti-inbox" />
            Inbox <span className="badge badge-soft-danger ms-1">9</span>
          </button>
        </div>
      </WidgetHeader>

      <div className="communication-stats">
        {communicationStats.map((stat) => (
          <div className={`chart-surface ${stat.borderClass}`} key={stat.id}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>

      <h6 className="widget-subtitle mb-2">
        <i className="ti ti-mail-opened me-1" />
        Recent Messages
      </h6>
      <div className="info-list mb-3 d-flex flex-column">
        {recentMessages.map((row) => (
          <InfoListRow row={row} key={row.id} />
        ))}
      </div>

      <h6 className="widget-subtitle mb-2">
        <i className="ti ti-speakerphone me-1" />
        Announcements
      </h6>
      <div className="info-list mb-3 d-flex flex-column">
        {announcements.map((row) => (
          <InfoListRow row={row} key={row.id} />
        ))}
      </div>

      <form className="d-flex gap-2 flow-end" onSubmit={handleSend}>
        <input
          type="text"
          className="action-button filter-input flex-fill d-inline-flex align-items-center justify-content-center text-nowrap text-decoration-none"
          placeholder="Quick reply to parents…"
          aria-label="Quick reply"
          value={reply}
          onChange={(event) => setReply(event.target.value)}
        />
        <button
          type="submit"
          className="action-button action-button-primary d-inline-flex align-items-center text-nowrap text-decoration-none"
        >
          <i className="ti ti-send" />
          Send
        </button>
      </form>
    </div>
  );
};

export default ParentCommunicationCard;
