import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { LessonAction, LessonPlan } from '../data/lessonPlanning.data';
import { cardMenuItems } from '../data/lessonPlanning.data';

export interface LessonPlanRowProps {
  plan: LessonPlan;
  active: boolean;
  revealed: boolean;
  menuOpen: boolean;
  onSelect: (id: string) => void;
  onOpenMenu: (id: string | null) => void;
  onMenuAction: (item: LessonAction, plan: LessonPlan) => void;
}

const LessonPlanRow = ({
  plan,
  active,
  revealed,
  menuOpen,
  onSelect,
  onOpenMenu,
  onMenuAction,
}: LessonPlanRowProps) => (
  <div
    className={`card card-hover mb-3${active ? ' active' : ''}`}
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
      <div className="row align-items-center g-3">
        <div className="col-12 col-xl-4 col-md-6">
          <div className="d-flex align-items-center">
            <span
              className={`avatar avatar-lg bg-${plan.tone}-transparent text-${plan.tone} rounded flex-shrink-0 me-2`}
            >
              <i className={`${plan.icon} fs-24`} />
            </span>
            <div className="flex-fill">
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <h6 className="mb-0 text-truncate">{plan.title}</h6>
                <span className={`badge ${plan.statusBadge} d-inline-flex align-items-center`}>
                  <i className="ti ti-circle-filled fs-5 me-1" />
                  {plan.status}
                </span>
              </div>
              <span className="fs-12 text-muted d-block text-truncate">
                {plan.subject} · {plan.grade} · {plan.sectionLabel} · {plan.teacher}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-2 text-center d-none d-md-block">
          <span className="badge badge-soft-primary">{plan.week}</span>
          <div className="fs-12 text-muted mt-1">
            <i className="ti ti-clock me-1" />
            {plan.duration} min
          </div>
        </div>

        <div className="col-xl-2 d-none d-xl-block">
          <div className="d-flex align-items-center gap-3 text-muted fs-13">
            <span title="Objectives">
              <i className="ti ti-target me-1" />
              {plan.objectives}
            </span>
            <span title="Activities">
              <i className="ti ti-activity me-1" />
              {plan.activities}
            </span>
            <span title="Resources">
              <i className="ti ti-paperclip me-1" />
              {plan.resourceCount}
            </span>
          </div>
        </div>

        <div className="col-md-2">
          <div
            className="progress"
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
          <span className="fs-11 text-muted">{plan.percent}% complete</span>
        </div>

        <div className="col-md-2 text-md-end">
          <div className="d-inline-flex align-items-center gap-1">
            <Link
              to="#"
              className="btn btn-light btn-sm"
              aria-controls="lp_details"
              onClick={(event) => {
                event.stopPropagation();
                onSelect(plan.id);
              }}
            >
              Open
            </Link>
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
        </div>
      </div>
    </div>
  </div>
);

export default LessonPlanRow;
