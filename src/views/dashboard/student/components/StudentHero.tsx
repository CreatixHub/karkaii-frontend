import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { getMyStudent } from '@services/students/students.me';
import type { MyStudent } from '@services/students/students.me';
import type { StudentModalId } from '../data/studentDashboard.data';
import { heroStats, quickActions, studentProfile } from '../data/studentDashboard.data';

const routes = all_routes;

export interface StudentHeroProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const prettyDate = (iso: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso ?? '');
  return m ? `${m[3]} ${MONTHS[Number(m[2]) - 1] ?? m[2]} ${m[1]}` : iso;
};

const humanize = (s: string): string => {
  const t = s.replace(/_/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const StudentHero = ({ onOpenModal }: StudentHeroProps) => {
  const [now, setNow] = useState(() => new Date());
  const [me, setMe] = useState<MyStudent | null>(null);
  const [meError, setMeError] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  /* The signed-in student's OWN record - the server only ever returns the caller's own row. */
  useEffect(() => {
    let alive = true;
    getMyStudent()
      .then((student) => {
        if (alive) setMe(student);
      })
      .catch((e: unknown) => {
        if (alive) setMeError(e instanceof Error ? e.message : 'Could not load your profile');
      });
    return () => {
      alive = false;
    };
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

  const name = me ? me.fullName || [me.firstName, me.lastName].filter(Boolean).join(' ') : meError ? 'Profile unavailable' : 'Loading...';

  const chips: { icon: string; label: string }[] = me
    ? [
        { icon: 'ti ti-id-badge-2', label: me.admissionNo },
        ...(me.houseName ? [{ icon: 'ti ti-flag', label: me.houseName }] : []),
        { icon: 'ti ti-calendar', label: `DOB ${prettyDate(me.dob)}` },
        { icon: 'ti ti-circle-check', label: humanize(me.status) },
      ]
    : [];

  /* Marks, GPA, rank etc. have no backend yet, so no one else's sample numbers are shown here. */
  const stats = heroStats.map((stat) => ({
    ...stat,
    ring: undefined,
    value: '-',
    valueSuffix: undefined,
    icon: stat.icon ?? 'ti ti-chart-pie',
    iconClass: stat.iconClass ?? 'bg-teal-transparent text-teal',
  }));

  return (
    <div className="card-profile mb-3 position-relative overflow-hidden">
      <div className="card-profile-grid position-relative align-items-center">
        <div className="card-profile-identity d-flex align-items-center flex-wrap">
          <div
            className="avatar avatar-xxl rounded-lg position-relative flex-shrink-0 overflow-hidden online"
            role="button"
            tabIndex={0}
            aria-label="View student ID card"
            style={{ cursor: 'pointer' }}
            onClick={() => onOpenModal('idcard')}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') onOpenModal('idcard');
            }}
          >
            <ImageWithBasePath src={studentProfile.photo} alt="Student" />
            <span className="on" title="Online" />
          </div>

          <div>
            <div className="card-profile-greeting">Welcome back</div>
            <div className="card-profile-name">{name}</div>
            {meError ? <div className="text-danger fs-13">{meError}</div> : null}
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
        {stats.map((stat) => (
          <div className="card-profile-stat d-flex align-items-center" key={stat.id}>
            <span className={`avatar avatar-md avatar-icon ${stat.iconClass}`}>
              <i className={stat.icon} />
            </span>
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
        {quickActions.map((action) =>
          action.modal ? (
            <button
              type="button"
              key={action.id}
              className={`action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none${
                action.primary ? ' action-button-primary' : ''
              }`}
              onClick={() => onOpenModal(action.modal as StudentModalId)}
            >
              <i className={action.icon} />
              {action.label}
            </button>
          ) : (
            <Link
              key={action.id}
              to={routes.classHomeWork}
              className="action-button action-button-sm d-inline-flex align-items-center text-nowrap text-decoration-none"
            >
              <i className={action.icon} />
              {action.label}
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default StudentHero;