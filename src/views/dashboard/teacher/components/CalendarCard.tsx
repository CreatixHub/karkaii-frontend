import type { TeacherModalId } from '../data/teacherDashboard.data';
import { calendarEvents } from '../data/teacherDashboard.data';
import WidgetHeader from '../../shared/WidgetHeader';

export interface CalendarCardProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

const CalendarCard = ({ onOpenModal }: CalendarCardProps) => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-calendar" title="Calendar">
      <button
        type="button"
        className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
        onClick={() => onOpenModal('events')}
      >
        <i className="ti ti-eye" />
        View
      </button>
    </WidgetHeader>

    {calendarEvents.map((event, index) => (
      <div
        className={`calendar-event d-flex align-items-center${
          index === calendarEvents.length - 1 ? ' pb-0' : ''
        }`}
        key={event.id}
      >
        <span className={`calendar-event-date ${event.dateClass} flex-shrink-0 text-center`}>
          <b>{event.day}</b>
          <span>{event.month}</span>
        </span>
        <div className="calendar-event-body">
          <b>{event.title}</b>
          <span>{event.detail}</span>
        </div>
        {event.badge ? (
          <span className={`badge ${event.badge.className} ms-auto`}>{event.badge.label}</span>
        ) : null}
      </div>
    ))}
  </div>
);

export default CalendarCard;
