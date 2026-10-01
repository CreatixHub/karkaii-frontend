import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import type { StudentModalId } from '../data/studentDashboard.data';
import { heroStats, quickActions, studentProfile } from '../data/studentDashboard.data';

const routes = all_routes;

export interface StudentHeroProps {
  onOpenModal: (modal: StudentModalId) => void;
}

const StudentHero = ({ onOpenModal }: StudentHeroProps) => {
  const [now, setNow] = useState(() => new Date());

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
            <div className="card-profile-greeting">{studentProfile.greeting}</div>
            <div className="card-profile-name">{studentProfile.name}</div>
            <div className="card-profile-meta d-flex align-items-center flex-wrap">
              {studentProfile.chips.map((chip) => (
                <span className="filter-chip" key={chip.label}>
                  <i className={chip.icon} />
                  {chip.label}
                </span>
              ))}
            </div>
            <div className="card-profile-badges d-flex align-items-center flex-wrap">
              {studentProfile.badges.map((badge) => (
                <span
                  key={badge.label}
                  className={`badge badge-sm rounded-pill ${badge.className} d-inline-flex align-items-center gap-1`}
                >
                  <i className={`${badge.icon} fs-14`} />
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div />

        <div className="card-profile-clock text-lg-end">
          <div className="card-profile-time">{time}</div>
          <div className="card-profile-date">{date}</div>
          <span className="badge badge-soft-success mt-2">
            <i className="ti ti-circle-check me-1" />
            Present today
          </span>
        </div>
      </div>

      <div className="card-profile-stats position-relative">
        {heroStats.map((stat) => (
          <div className="card-profile-stat d-flex align-items-center" key={stat.id}>
            {stat.ring !== undefined ? (
              <span
                className={`card-profile-ring ${stat.ringClass ?? ''} flex-shrink-0`}
                style={{ '--v': stat.ring } as React.CSSProperties}
              >
                <i>{stat.ring}%</i>
              </span>
            ) : (
              <span className={`avatar avatar-md avatar-icon ${stat.iconClass ?? ''}`}>
                <i className={stat.icon} />
              </span>
            )}
            <div className="tx">
              <b>
                {stat.value}
                {stat.valueSuffix ? <small>{stat.valueSuffix}</small> : null}
              </b>
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
