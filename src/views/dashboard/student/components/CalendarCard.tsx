import { Link } from 'react-router-dom';
import { all_routes } from '@/routes/all_routes';
import WidgetHeader from '../../shared/WidgetHeader';
import { calendarEvents } from '../data/studentDashboard.data';

const routes = all_routes;

const CalendarCard = () => (
  <div className="card-widget card-widget-body h-100">
    <WidgetHeader icon="ti ti-calendar" title="Calendar">
      <Link to={routes.calendar} className="widget-link d-inline-flex align-items-center">
        Open
        <i className="ti ti-chevron-right" />
      </Link>
    </WidgetHeader>

    {calendarEvents.map((event) => (
      <div className="calendar-event d-flex align-items-center" key={event.id}>
        <span className="calendar-event-date bg-body-secondary text-body-secondary flex-shrink-0 text-center">
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
