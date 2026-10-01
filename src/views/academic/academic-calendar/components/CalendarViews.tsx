import { Link } from 'react-router-dom';
import type { AgendaItem, CalendarEntry, CalendarView, CategoryId } from '../data/academicCalendar.data';
import {
  agendaItems,
  dayNames,
  dayViewBadge,
  dayViewHeading,
  monthCells,
  weekColumns,
  weekRows,
} from '../data/academicCalendar.data';

export interface CalendarViewsProps {
  view: CalendarView;
  categories: Record<CategoryId, boolean>;
  search: string;
  onOpenEvent: (label: string) => void;
  onAddEvent: () => void;
}

const entryClass = (item: CalendarEntry) =>
  [
    'calendar-entry',
    item.solid ? 'is-solid' : '',
    item.span ? `is-span-${item.span}` : '',
    item.toneClass,
  ]
    .filter(Boolean)
    .join(' ');

const CalendarViews = ({ view, categories, search, onOpenEvent, onAddEvent }: CalendarViewsProps) => {
  const term = search.trim().toLowerCase();

  /** Month and week entries filter on their label; agenda items on their title. */
  const showsEntry = (item: CalendarEntry) =>
    categories[item.category] && (!term || item.label.toLowerCase().includes(term));
  const showsAgenda = (item: AgendaItem) =>
    categories[item.category] && (!term || item.title.toLowerCase().includes(term));

  return (
    <div className="card calendar-card">
      <div className="card-body">
        <div className="tab-content" id="calendarViewsContent">
          {/* Month View */}
          {view === 'month' ? (
            <div className="tab-pane fade show active" id="month-view" role="tabpanel" tabIndex={0}>
              <div className="calendar-board">
                {dayNames.map((name) => (
                  <div className="calendar-dow" key={name}>
                    {name}
                  </div>
                ))}
                {monthCells.map((cell, index) => (
                  <div
                    className={`calendar-cell${cell.isOut ? ' is-out' : ''}${cell.isToday ? ' is-today' : ''}`}
                    key={`${cell.day}-${index}`}
                  >
                    <span className="calendar-num">{cell.day}</span>
                    {cell.entries.filter(showsEntry).map((item) => (
                      <Link
                        to="#"
                        className={entryClass(item)}
                        key={item.id}
                        onClick={() => onOpenEvent(item.label)}
                      >
                        {item.icon ? <i className={item.icon} /> : null}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {/* /Month View */}

          {/* Week View */}
          {view === 'week' ? (
            <div className="tab-pane fade show active" id="week-view" role="tabpanel" tabIndex={0}>
              <div className="calendar-week">
                <table className="table table-borderless mb-0">
                  <thead>
                    <tr className="text-center fs-12 border-bottom">
                      <th className="calendar-time text-muted fw-medium">Time</th>
                      {weekColumns.map((column) => (
                        <th className={`fw-medium${column.highlight ? ' text-primary' : ''}`} key={column.label}>
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {weekRows.map((row) => (
                      <tr key={row.time}>
                        <td className="calendar-time">{row.time}</td>
                        {row.slots.map((slot, index) => (
                          <td key={index}>
                            {slot && showsEntry(slot) ? (
                              <Link to="#" className={entryClass(slot)} onClick={() => onOpenEvent(slot.label)}>
                                <span>{slot.label}</span>
                              </Link>
                            ) : null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          {/* /Week View */}

          {/* Day View */}
          {view === 'day' ? (
            <div className="tab-pane fade show active" id="day-view" role="tabpanel" tabIndex={0}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h3 className="mb-0 fs-16 fw-medium">{dayViewHeading}</h3>
                <span className="badge badge-soft-secondary">{dayViewBadge}</span>
              </div>
              <div className="calendar-empty">
                <div className="calendar-empty-art">
                  <i className="ti ti-calendar-off" />
                </div>
                <h4 className="mb-1 fs-16 fw-medium">No Academic Events Scheduled</h4>
                <p className="text-muted mb-3">
                  There are no academic activities planned for this day. Start planning by creating a new event.
                </p>
                <Link to="#" className="btn btn-primary d-inline-flex align-items-center" onClick={onAddEvent}>
                  <i className="ti ti-plus me-1" />
                  Create Academic Event
                </Link>
              </div>
            </div>
          ) : null}
          {/* /Day View */}

          {/* Agenda View */}
          {view === 'agenda' ? (
            <div className="tab-pane fade show active" id="agenda-view" role="tabpanel" tabIndex={0}>
              <div className="row">
                {[0, 1].map((column) => (
                  <div className="col-12 col-lg-6" key={column}>
                    {agendaItems
                      .filter((item) => item.column === column)
                      .filter(showsAgenda)
                      .map((item) => (
                        <div key={item.id}>
                          <div className="calendar-item-day">{item.dayLabel}</div>
                          <Link to="#" className="calendar-item" onClick={() => onOpenEvent(item.title)}>
                            <span className={`calendar-item-icon ${item.iconClass}`}>
                              <i className={item.icon} />
                            </span>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{item.title}</h6>
                              <p className="mb-0 fs-12 text-muted">
                                {item.meta.map((meta, index) => (
                                  <span key={meta.text}>
                                    <i className={`${meta.icon} me-1`} />
                                    {meta.text}
                                    {index < item.meta.length - 1 ? '  ' : null}
                                  </span>
                                ))}
                              </p>
                            </div>
                            <span className={`badge ${item.badgeClass}`}>{item.badge}</span>
                          </Link>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {/* /Agenda View */}
        </div>
      </div>
    </div>
  );
};

export default CalendarViews;
