import { Link } from 'react-router-dom';
import type { CategoryId, CheckFilter } from '../data/academicCalendar.data';
import {
  currentMonthLabel,
  eventCategories,
  miniDayNames,
  miniDays,
  sessionOptions,
  sessionProgress,
} from '../data/academicCalendar.data';

export interface CalendarSidebarProps {
  categories: Record<CategoryId, boolean>;
  onCategory: (id: CategoryId, on: boolean) => void;
  session: string;
  onSession: (session: string) => void;
  statusFilters: CheckFilter[];
  onStatusFilter: (id: string, on: boolean) => void;
  priorityFilters: CheckFilter[];
  onPriorityFilter: (id: string, on: boolean) => void;
  onApplyFilters: () => void;
  onManageCategories: () => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
}

const CalendarSidebar = ({
  categories,
  onCategory,
  session,
  onSession,
  statusFilters,
  onStatusFilter,
  priorityFilters,
  onPriorityFilter,
  onApplyFilters,
  onManageCategories,
  filtersOpen,
  onToggleFilters,
}: CalendarSidebarProps) => (
  <div className="col-12 col-xl-3 col-lg-4 calendar-rail">
    {/* Mini Calendar */}
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="mb-0">{currentMonthLabel}</h5>
        <div className="btn-group" role="group" aria-label="Mini calendar navigation">
          <button type="button" className="btn btn-sm btn-outline-light bg-white btn-icon" aria-label="Previous month">
            <i className="ti ti-chevron-left" />
          </button>
          <button type="button" className="btn btn-sm btn-outline-light bg-white btn-icon" aria-label="Next month">
            <i className="ti ti-chevron-right" />
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="calendar-mini">
          {miniDayNames.map((name) => (
            <span className="calendar-mini-dow" key={name}>
              {name}
            </span>
          ))}
          {miniDays.map((day, index) => {
            // A dot only shows while its category is on.
            const visible = !day.category || categories[day.category];
            const classes = [
              'calendar-mini-day',
              day.isOut ? 'is-out' : '',
              day.isToday ? 'is-today' : '',
              day.dot && visible ? `has-dot ${day.dot}` : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <span className={classes} key={`${day.day}-${index}`}>
                {day.day}
              </span>
            );
          })}
        </div>
      </div>
    </div>
    {/* /Mini Calendar */}

    {/* Academic Year Selector */}
    <div className="card">
      <div className="card-body">
        <label className="form-label fw-medium" htmlFor="acal-session">
          Academic Session
        </label>
        <select
          className="form-select mb-3"
          id="acal-session"
          aria-label="Academic session"
          value={session}
          onChange={(event) => onSession(event.target.value)}
        >
          {sessionOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fs-12 text-muted">Session Progress</span>
          <span className="fs-12 fw-medium">{sessionProgress.label}</span>
        </div>
        <div
          className="progress progress-sm"
          role="progressbar"
          aria-label="Session progress"
          aria-valuenow={sessionProgress.value}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={`progress-bar bg-primary ${sessionProgress.barClass}`} />
        </div>
      </div>
    </div>
    {/* /Academic Year Selector */}

    {/* Event Categories */}
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <h5 className="mb-0">Event Categories</h5>
        <Link to="#" className="link-primary fs-12" onClick={onManageCategories}>
          Manage
        </Link>
      </div>
      <div className="card-body p-2">
        {eventCategories.map((category) => (
          <div className="calendar-category" key={category.id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={category.domId}
              checked={categories[category.id]}
              onChange={(event) => onCategory(category.id, event.target.checked)}
            />
            <span className={`calendar-category-dot ${category.dotClass}`} />
            <label className="form-check-label flex-grow-1" htmlFor={category.domId}>
              {category.label}
            </label>
            <span className={`badge ${category.badgeClass}`}>{category.count}</span>
          </div>
        ))}
      </div>
    </div>
    {/* /Event Categories */}

    {/* Calendar Filters */}
    <div className="accordion" id="calendarFilters">
      <div className="accordion-item card">
        <h2 className="accordion-header" id="filterHeading">
          <button
            className={`accordion-button${filtersOpen ? '' : ' collapsed'}`}
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="filterCollapse"
            onClick={onToggleFilters}
          >
            <i className="ti ti-filter me-2" />
            Calendar Filters
          </button>
        </h2>
        <div
          id="filterCollapse"
          className={`accordion-collapse collapse${filtersOpen ? ' show' : ''}`}
          aria-labelledby="filterHeading"
          role="region"
        >
          <div className="accordion-body">
            <label className="form-label fw-medium mb-1">Status</label>
            {statusFilters.map((filter, index) => (
              <div className={`form-check${index === statusFilters.length - 1 ? ' mb-3' : ''}`} key={filter.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={filter.id}
                  checked={filter.checked}
                  onChange={(event) => onStatusFilter(filter.id, event.target.checked)}
                />
                <label className="form-check-label" htmlFor={filter.id}>
                  {filter.label}
                </label>
              </div>
            ))}
            <label className="form-label fw-medium mb-1">Priority</label>
            {priorityFilters.map((filter) => (
              <div className="form-check" key={filter.id}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={filter.id}
                  checked={filter.checked}
                  onChange={(event) => onPriorityFilter(filter.id, event.target.checked)}
                />
                <label className="form-check-label" htmlFor={filter.id}>
                  {filter.label}
                </label>
              </div>
            ))}
            <div className="mt-3 d-grid">
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={onApplyFilters}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* /Calendar Filters */}
  </div>
);

export default CalendarSidebar;
