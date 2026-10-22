import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { LessonAction, LessonPlan } from '../data/lessonPlanning.data';
import { cardMenuItems } from '../data/lessonPlanning.data';

export interface LessonPlanCardProps {
  plan: LessonPlan;
  active: boolean;
  revealed: boolean;
  expanded: boolean;
  menuOpen: boolean;
  onSelect: (id: string) => void;
  onToggleDetails: (id: string) => void;
  onOpenMenu: (id: string | null) => void;
  onMenuAction: (item: LessonAction, plan: LessonPlan) => void;
}

const LessonPlanCard = ({
  plan,
  active,
  revealed,
  expanded,
  menuOpen,
  onSelect,
  onToggleDetails,
  onOpenMenu,
  onMenuAction,
}: LessonPlanCardProps) => (
  <div
    className={`card card-hover mb-0 h-100${active ? ' active' : ''}`}
    role="tab"
    tabIndex={0}
    aria-current={active}
    onClick={() => onSelect(plan.id)}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(plan.id);
      }
    }}
  >
    <div className="card-body">
      <div className="d-flex align-items-start mb-3">
        <span
          className={`avatar avatar-lg bg-${plan.tone}-transparent text-${plan.tone} rounded me-2 flex-shrink-0`}
        >
          <i className={`${plan.icon} fs-24`} />
        </span>
        <div className="flex-fill">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mb-0 text-truncate">{plan.title}</h6>
            <div className="dropdown">
              <Link
                to="#"
                className="btn btn-icon btn-sm rounded-circle flex-shrink-0"
                aria-label="Lesson menu"
                aria-expanded={menuOpen}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onOpenMenu(menuOpen ? null : plan.id);
                }}
              >
                <i className="ti ti-dots-vertical" />
              </Link>
              <ul className={`dropdown-menu dropdown-menu-end p-2${menuOpen ? ' show' : ''}`}>
                {cardMenuItems.map((item) => (
                  <Fragment key={item.id}>
                    {item.divider ? (
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    ) : null}
                    <li>
                      <Link
                        className={`dropdown-item rounded-1${item.danger ? ' text-danger' : ''}`}
                        to="#"
                        onClick={(event) => {
                          event.stopPropagation();
                          onOpenMenu(null);
                          onMenuAction(item, plan);
                        }}
                      >
                        <i className={`${item.icon} me-2`} />
                        {item.label}
                      </Link>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>
          <span className="fs-12 text-muted d-block text-truncate">
            {plan.subject} · {plan.grade} · {plan.sectionLabel}
          </span>
          <div className="d-flex align-items-center flex-wrap gap-1 mt-2">
            <span className="badge badge-soft-primary">{plan.week}</span>
            <span className={`badge ${plan.statusBadge} d-inline-flex align-items-center`}>
              <i className="ti ti-circle-filled fs-5 me-1" />
              {plan.status}
            </span>
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3 mb-3 text-muted fs-13">
        <span title="Teacher">
          <i className="ti ti-user me-1" />
          {plan.teacher}
        </span>
        <span title="Duration">
          <i className="ti ti-clock me-1" />
          {plan.duration} min
        </span>
      </div>

      <div className="d-flex align-items-center justify-content-between mb-1">
        <span className="fs-12 text-muted">Completion</span>
        <span className="fs-12 fw-semibold text-dark">{plan.percent}%</span>
      </div>
      <div
        className="progress mb-3"
        role="progressbar"
        aria-label="Completion"
        aria-valuenow={plan.percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress-bar ${plan.barClass}`}
          style={{ width: revealed ? `${plan.percent}%` : 0 }}
        />
      </div>

      <div className="row text-center g-2">
        {[
          { value: plan.objectives, label: 'Objectives' },
          { value: plan.activities, label: 'Activities' },
          { value: plan.resourceCount, label: 'Resources' },
        ].map((stat) => (
          <div className="col-4" key={stat.label}>
            <div className="bg-light rounded p-2">
              <h6 className="mb-0">{stat.value}</h6>
              <span className="fs-11 text-muted">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={`collapse${expanded ? ' show' : ''}`} id={`more_${plan.id}`}>
        <ul className="list-unstyled mb-0 mt-3 pt-3 border-top fs-13">
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Teaching Method</span>
            <span className="text-dark">{plan.teachingMethod}</span>
          </li>
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Homework</span>
            <span className="text-dark">{plan.homeworkStatus}</span>
          </li>
          <li className="d-flex justify-content-between py-1">
            <span className="text-muted">Last Updated</span>
            <span className="text-dark">{plan.updated}</span>
          </li>
        </ul>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
        <Link
          to="#"
          className="btn btn-light btn-sm"
          aria-expanded={expanded}
          aria-controls={`more_${plan.id}`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onToggleDetails(plan.id);
          }}
        >
          <i className={`ti ${expanded ? 'ti-chevron-up' : 'ti-chevron-down'} me-1`} />
          Details
        </Link>
        <Link
          to="#"
          className="btn btn-primary btn-sm"
          aria-controls="lp_details"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(plan.id);
          }}
        >
          Open <i className="ti ti-arrow-right ms-1" />
        </Link>
      </div>
    </div>
  </div>
);

export default LessonPlanCard;
