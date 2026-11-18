import { useEffect, useState } from 'react';
import type { TeacherModalId } from '../data/teacherDashboard.data';
import { heroStats, quickActions } from '../data/teacherDashboard.data';
import { formatDuration, initials, profileCompletion, todayTotals } from '../data/summaryCalc';
import { useTeacherSummary } from '../hooks/useTeacherSummary';

export interface TeacherHeroProps {
  onOpenModal: (modal: TeacherModalId) => void;
}

function greetingForHour(hour: number): string {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const DASH = '—';

const TeacherHero = ({ onOpenModal }: TeacherHeroProps) => {
  const [now, setNow] = useState(() => new Date());
  const { status, staff, timetable } = useTeacherSummary();

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  const date = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const name = staff?.fullName || staff?.firstName || (status === 'loading' ? '' : 'Teacher');

  // Only real facts about this teacher.
  const chips: { icon: string; label: string }[] = [];
  if (staff?.employeeNo) chips.push({ icon: 'ti ti-id-badge-2', label: staff.employeeNo });
  if (staff?.qualification) chips.push({ icon: 'ti ti-school', label: staff.qualification });

  const totals = timetable ? todayTotals(timetable, now) : null;
  const completion = profileCompletion(staff);

  // Icons and styling come from the template list; every value is computed from the database.
  const liveStats = heroStats
    .filter((stat) => !/\bai\b|score/i.test(stat.label))
    .map((stat) => {
      const label = stat.label.toLowerCase();
      let value: string = DASH;
      if (label.includes('schedule')) value = totals ? String(totals.periods) : DASH;
      else if (label.includes('hour')) value = totals ? formatDuration(totals.minutes) : DASH;
      else if (label.includes('upcoming')) value = totals ? String(totals.upcoming) : DASH;
      else if (label.includes('complet')) value = 'Profile';
      return { ...stat, value, ring: label.includes('complet') ? completion : undefined };
    });

  return (
    <div className="card-profile mb-3 position-relative overflow-hidden">
      <div className="card-profile-grid position-relative align-items-center">
        <div className="card-profile-identity d-flex align-items-center">
          <div
            className="card-profile-photo position-relative flex-shrink-0"
            role="button"
            tabIndex={0}
            aria-label="View teacher profile"
            style={{ cursor: 'pointer' }}
            onClick={() => onOpenModal('profile')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onOpenModal('profile');
            }}
          >
            {/* No photo is stored yet: show the teacher's initials. */}
            <div
              className="rounded d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '100%', height: '100%', minHeight: 120, background: '#e9ecef', fontSize: 36 }}
            >
              {initials(name)}
            </div>
          </div>
          <div>
            <div className="card-profile-greeting">{greetingForHour(now.getHours())} 👋</div>
            <div className="card-profile-name">{name || '\u00A0'}</div>
            <div className="card-profile-meta d-flex align-items-center flex-wrap">
              {chips.map((chip) => (
                <span className="filter-chip" key={chip.label}>
                  <i className={chip.icon} />
                  {chip.label}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div />
        <div className="card-profile-clock text-lg-end">
          <div className="card-profile-time">{time}</div>
          <div className="card-profile-date">{date}</div>
        </div>
      </div>

      <div className="card-profile-stats position-relative">
        {liveStats.map((stat) => (
          <div className="card-profile-stat d-flex align-items-center" key={stat.id}>
            {stat.ring !== undefined ? (
              <span
                className={`card-profile-ring ${stat.ringClass ?? ''} flex-shrink-0`}
                style={{ '--v': stat.ring } as React.CSSProperties}
              >
                <i>{stat.ring}%</i>
              </span>
            ) : (
              <span className={`avatar avatar-md flex-shrink-0 ${stat.iconClass ?? ''}`}>
                <i className={stat.icon} />
              </span>
            )}
            <div className="tx">
              <b>{stat.value}</b>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-profile-actions position-relative d-flex align-items-center flex-wrap">
        <span className="widget-subtitle me-1">
          <i className="ti ti-bolt me-1" />
          Quick actions:
        </span>
        {quickActions.map((action) => (
          <button
            type="button"
            key={action.id}
            className={`action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none${
              action.primary ? ' action-button-primary' : ''
            }`}
            onClick={() => action.modal && onOpenModal(action.modal)}
          >
            <i className={action.icon} />
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TeacherHero;