import { events } from '../data/alumni.data';

export interface EventGridProps {
  onCreateEvent: () => void;
  onDetails: (id: string) => void;
  onRsvp: (id: string) => void;
}

const EventGrid = ({ onCreateEvent, onDetails, onRsvp }: EventGridProps) => (
  <>
    <div className="section-header">
      <div>
        <h5 className="section-title">Alumni Events</h5>
        <p className="section-subtitle">Reunions, meetups and sessions across every chapter</p>
      </div>
      <span className="section-rule" />
      <button
        type="button"
        className="btn btn-outline-light bg-white btn-sm fw-medium d-inline-flex align-items-center flex-shrink-0"
        onClick={onCreateEvent}
      >
        <i className="ti ti-plus me-1" />
        Create Event
      </button>
    </div>

    <div className="row g-3 mb-4">
      {events.map((event) => (
        <div className="col-12 col-xxl-6 d-flex" key={event.id}>
          <div className="event">
            <div className="event-date">
              <span className="event-day">{event.day}</span>
              <span className="event-month">{event.month}</span>
              <span className="event-time">{event.time}</span>
            </div>
            <div className="event-body">
              <h6>{event.title}</h6>
              <div className="event-where">
                <span>
                  <i className="ti ti-map-pin" />
                  {event.location}
                </span>
                <span>
                  <i className="ti ti-user-star" />
                  {event.organizer}
                </span>
              </div>
              <div className="event-seats">
                <div className="seats-row">
                  <span>Registrations</span>
                  <span>
                    <b>{event.registered}</b> / {event.capacity}
                  </span>
                </div>
                <div className={`progress-meter${event.progressModifier ? ` ${event.progressModifier}` : ''}`}>
                  <span className={event.progressWidthClass} />
                </div>
              </div>
              <div className="event-footer">
                <span className={`status-badge ${event.statusClass}`}>
                  <i className={event.statusIcon} />
                  {event.statusLabel}
                </span>
                <div className="d-inline-flex gap-2">
                  <button type="button" className="btn btn-light btn-sm" onClick={() => onDetails(event.id)}>
                    Details
                  </button>
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => onRsvp(event.id)}>
                    RSVP
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default EventGrid;
