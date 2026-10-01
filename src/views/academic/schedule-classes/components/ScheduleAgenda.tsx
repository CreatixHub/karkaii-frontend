import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { ScheduledClass, ViewMode } from '../data/classSchedule.data';
import { scheduleDays, shortTime, timeSlots } from '../data/classSchedule.data';

export interface ScheduleAgendaProps {
  items: ScheduledClass[];
  blank: boolean;
  viewMode: ViewMode;
}

const ScheduleAgenda = ({ items, blank, viewMode }: ScheduleAgendaProps) => (
  <div
    className={`rt-agenda px-3 pt-3${viewMode === 'week' ? ' d-lg-none' : ''}${blank ? ' rt-blank' : ''}`}
  >
    {scheduleDays.map((day) => {
      const dayItems = items.filter((entry) => entry.dayId === day.id);
      if (dayItems.length === 0) return null;

      return (
        <div className="rt-agenda-day" key={day.id}>
          <h4 className="d-flex align-items-center justify-content-between fs-15 fw-medium">
            <span>
              <i className="ti ti-calendar-event me-1" />
              {day.label}
            </span>
            <span className="fs-12 text-muted fw-normal">{day.date}</span>
          </h4>

          {dayItems.map((item) => {
            const slot = timeSlots.find((entry) => entry.time === item.time);
            return (
              <div className="rt-agenda-item" key={item.id}>
                <div className="rt-agenda-time">
                  {shortTime(item.time)}
                  <small>{slot ? shortTime(slot.end) : ''}</small>
                </div>
                <div
                  className={`flex-fill border rounded p-2 border-start border-3 ${item.accent.replace(
                    'bg-',
                    'border-',
                  )}`}
                >
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <span className="fw-semibold fs-13">{item.subject}</span>
                    <span className={`dt-pill ${item.pillClass}`}>
                      {item.pillIcon ? <i className={item.pillIcon} /> : <span className="dt-pill-dot" />}
                      {item.status}
                    </span>
                  </div>
                  {item.teacher ? (
                    <div className="d-flex align-items-center gap-1 my-1">
                      <span className="avatar avatar-xs">
                        <ImageWithBasePath
                          src={item.teacher.avatar}
                          className="rounded-circle flex-shrink-0"
                          alt={item.teacher.name}
                        />
                      </span>
                      <span className="fs-12 text-muted">{item.teacher.name}</span>
                    </div>
                  ) : null}
                  {item.room ? (
                    <span className="fs-12 text-muted">
                      <i className="ti ti-door me-1" />
                      Rm {item.room}
                      <span className="mx-1">·</span>
                      <i className="ti ti-users me-1" />
                      {item.students}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);

export default ScheduleAgenda;
