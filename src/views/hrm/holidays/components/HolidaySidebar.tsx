import type { Holiday, HolidayCategory } from '../data/holidays.data';
import { categoryMeta, categoryOrder, parseDate, quickStats, relativeLabel, weekdayOf } from '../data/holidays.data';

export interface HolidaySidebarProps {
  upcoming: Holiday[];
  recent: Holiday[];
  counts: Record<HolidayCategory, number>;
  activeCategory: HolidayCategory | null;
  onOpen: (holiday: Holiday) => void;
  onCategory: (category: HolidayCategory) => void;
  onViewAll: () => void;
}

interface MiniRowProps {
  holiday: Holiday;
  onOpen: (holiday: Holiday) => void;
}

const MiniRow = ({ holiday, onOpen }: MiniRowProps) => {
  const date = parseDate(holiday.start);
  const relative = relativeLabel(holiday.start);

  return (
    <button
      type="button"
      className={`hol-mini ${categoryMeta[holiday.category].cls}`}
      aria-label={holiday.name}
      onClick={() => onOpen(holiday)}
    >
      <span className="hol-date">
        <span className="hol-date-d">{String(date.getDate()).padStart(2, '0')}</span>
        <span className="hol-date-m">{holiday.start.split(' ')[1]}</span>
      </span>
      <span className="hol-mini-body">
        <span className="hol-mini-title">{holiday.name}</span>
        <span className="hol-mini-meta">
          <span className="hol-cat-rail" />
          {holiday.type} · {weekdayOf(holiday.start)}
        </span>
      </span>
      <span className={`hol-mini-badge${relative.past ? ' is-past' : ''}`}>{relative.text}</span>
      <i className="ti ti-chevron-right hol-mini-go" />
    </button>
  );
};

const HolidaySidebar = ({
  upcoming,
  recent,
  counts,
  activeCategory,
  onOpen,
  onCategory,
  onViewAll,
}: HolidaySidebarProps) => (
  <div className="sticky-top hol-side">
    {/* Quick Statistics */}
    <div className="card hol-widget">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="hol-cardhead">
          <span className="hol-cardhead-ic">
            <i className="ti ti-chart-pie" />
          </span>
          <h5>Quick Statistics</h5>
        </div>
      </div>
      <div className="card-body">
        <div className="row g-2">
          {quickStats.map((stat) => (
            <div className="col-6" key={stat.id}>
              <div className={`hol-stat ${stat.modifier}`}>
                <span className="hol-stat-ic">
                  <i className={stat.icon} />
                </span>
                <div>
                  <h4 className="hol-stat-val">{stat.value}</h4>
                  <span className="hol-stat-label">{stat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Upcoming Holidays */}
    <div className="card hol-widget">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="hol-cardhead">
          <span className="hol-cardhead-ic">
            <i className="ti ti-calendar-up" />
          </span>
          <h5>Upcoming Holidays</h5>
        </div>
        <button type="button" className="hol-head-link btn btn-link p-0 border-0" onClick={onViewAll}>
          View all
          <i className="ti ti-arrow-right ms-1" />
        </button>
      </div>
      <div className="card-body">
        {upcoming.length === 0 ? (
          <p className="fs-13 text-muted mb-0">No upcoming holidays match the current filters.</p>
        ) : (
          upcoming.map((holiday) => <MiniRow holiday={holiday} onOpen={onOpen} key={holiday.id} />)
        )}
      </div>
    </div>

    {/* Recent Holidays */}
    <div className="card hol-widget">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="hol-cardhead">
          <span className="hol-cardhead-ic">
            <i className="ti ti-history" />
          </span>
          <h5>Recent Holidays</h5>
        </div>
      </div>
      <div className="card-body">
        {recent.length === 0 ? (
          <p className="fs-13 text-muted mb-0">No past holidays match the current filters.</p>
        ) : (
          recent.map((holiday) => <MiniRow holiday={holiday} onOpen={onOpen} key={holiday.id} />)
        )}
      </div>
    </div>

    {/* Holiday Categories */}
    <div className="card hol-widget mb-0">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div className="hol-cardhead">
          <span className="hol-cardhead-ic">
            <i className="ti ti-tags" />
          </span>
          <h5>Holiday Categories</h5>
        </div>
      </div>
      <div className="card-body">
        {categoryOrder.map((category) => (
          <button
            type="button"
            className={`hol-cat-item ${categoryMeta[category].cls}${activeCategory === category ? ' active' : ''}`}
            key={category}
            aria-pressed={activeCategory === category}
            onClick={() => onCategory(category)}
          >
            <span className="hol-cat-ic">
              <i className={categoryMeta[category].icon} />
            </span>
            <span className="hol-cat-name">{category}</span>
            <span className="hol-cat-count">{counts[category]}</span>
            <i className="ti ti-chevron-right hol-mini-go" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default HolidaySidebar;
