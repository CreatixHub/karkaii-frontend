import type { CalendarCell, Holiday } from '../data/holidays.data';
import { categoryMeta, dayNames, legendItems, monthTitle } from '../data/holidays.data';

export interface HolidayCalendarProps {
  month: Date;
  cells: CalendarCell[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAdd: (date: Date) => void;
  onOpen: (holiday: Holiday) => void;
}

const HolidayCalendar = ({
  month,
  cells,
  onPrevMonth,
  onNextMonth,
  onToday,
  onAdd,
  onOpen,
}: HolidayCalendarProps) => (
  <div className="card mb-xl-0 hol-calendar-view hol-cal-card">
    <div className="card-header d-flex align-items-center justify-content-between flex-wrap gap-3">
      <div className="d-flex align-items-center gap-2">
        <button type="button" className="hol-nav-btn" aria-label="Previous month" onClick={onPrevMonth}>
          <i className="ti ti-chevron-left" />
        </button>
        <h4 className="hol-month-title mb-0">{monthTitle(month)}</h4>
        <button type="button" className="hol-nav-btn" aria-label="Next month" onClick={onNextMonth}>
          <i className="ti ti-chevron-right" />
        </button>
        <button type="button" className="btn btn-sm btn-outline-light bg-white ms-1" onClick={onToday}>
          <i className="ti ti-calendar-due me-1" />
          Today
        </button>
      </div>
      <div className="hol-legend">
        {legendItems.map((item) => (
          <span className={`hol-legend-item ${item.cls}`} key={item.label}>
            <span className="hol-legend-dot" />
            {item.label}
          </span>
        ))}
      </div>
    </div>
    <div className="card-body">
      <div className="hol-cal" role="grid" aria-label={`${monthTitle(month)} holiday calendar`}>
        {dayNames.map((day) => (
          <div className="hol-dow" key={day}>
            {day}
          </div>
        ))}

        {cells.map((cell) => {
          const classes = ['hol-cell'];
          if (cell.outside) classes.push('is-out');
          if (cell.weekend) classes.push('is-weekend');
          if (cell.events.length === 0 && !cell.outside) classes.push('is-empty');

          return (
            <div className={classes.join(' ')} key={cell.date.toISOString()}>
              <div className="hol-cell-top">
                <span className="hol-daynum">{cell.day}</span>
                {/* The template omits the add affordance on neighbouring-month cells. */}
                {cell.outside ? null : (
                  <button
                    type="button"
                    className="hol-cell-add"
                    aria-label="Add holiday"
                    onClick={() => onAdd(cell.date)}
                  >
                    <i className="ti ti-plus" />
                  </button>
                )}
              </div>
              <div className="hol-events">
                {cell.events.map((holiday) => (
                  <button
                    type="button"
                    className={`hol-event ${categoryMeta[holiday.category].cls}`}
                    key={holiday.id}
                    aria-label={holiday.name}
                    onClick={() => onOpen(holiday)}
                  >
                    <span className="hol-dot" />
                    <span className="hol-ev-label">{holiday.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default HolidayCalendar;
