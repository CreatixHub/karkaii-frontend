import { Link } from 'react-router-dom';
import type {
  DetailTabId,
  LessonAction,
  LessonPlan,
  LessonResource,
  StructureKey,
} from '../data/lessonPlanning.data';
import {
  detailActions,
  detailTabs,
  goalCards,
  structureSections,
  timelineStages,
} from '../data/lessonPlanning.data';

export interface LessonDetailPanelProps {
  plan: LessonPlan | null;
  revealed: boolean;
  tab: DetailTabId;
  onTab: (tab: DetailTabId) => void;
  openSection: StructureKey | null;
  onToggleSection: (key: StructureKey) => void;
  onAction: (item: LessonAction, plan: LessonPlan) => void;
  onResourceAction: (resource: LessonResource, action: 'open' | 'download') => void;
  onAddResource: () => void;
  onAddActivity: () => void;
}

const LessonDetailPanel = ({
  plan,
  revealed,
  tab,
  onTab,
  openSection,
  onToggleSection,
  onAction,
  onResourceAction,
  onAddResource,
  onAddActivity,
}: LessonDetailPanelProps) => {
  if (!plan) {
    return (
      <div className="text-center py-5">
        <span className="avatar avatar-xxl bg-primary-transparent text-primary rounded-circle flex-shrink-0 mb-3">
          <i className="ti ti-notebook fs-36" />
        </span>
        <h5 className="mb-1">No Lesson Plan Selected</h5>
        <p className="text-muted mb-0">Open a lesson plan to see its structure, goals and flow.</p>
      </div>
    );
  }

  const percentTone = plan.barClass.replace('bg-', 'text-');

  return (
    <div id="lp_detail">
      {/* Header */}
      <div className="d-flex align-items-start mb-3">
        <span
          className={`avatar avatar-lg bg-${plan.tone}-transparent text-${plan.tone} rounded me-2 flex-shrink-0`}
        >
          <i className={`${plan.icon} fs-24`} />
        </span>
        <div className="flex-fill">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h5 className="mb-0">{plan.title}</h5>
            <span className={`badge ${plan.statusBadge}`}>{plan.status}</span>
          </div>
          <span className="fs-12 text-muted">
            {plan.code} · {plan.grade} · {plan.sectionLabel}
          </span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="d-flex align-items-center flex-wrap gap-1 mb-3 pb-3 border-bottom">
        {detailActions.map((item) => (
          <Link
            key={item.id}
            to="#"
            className="btn btn-icon btn-sm rounded-circle flex-shrink-0 btn-outline-light bg-white"
            title={item.label}
            aria-label={item.label}
            onClick={() => onAction(item, plan)}
          >
            <i className={item.icon} />
          </Link>
        ))}
      </div>

      {/* Teaching progress */}
      <div className="mb-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <span className="fs-13 fw-semibold">Teaching Progress</span>
          <span className={`fs-13 fw-semibold ${percentTone}`}>{plan.percent}%</span>
        </div>
        <div
          className="progress"
          role="progressbar"
          aria-label="Teaching progress"
          aria-valuenow={plan.percent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`progress-bar ${plan.barClass}`}
            style={{ width: revealed ? `${plan.percent}%` : 0 }}
          />
        </div>
        <div className="row text-center g-2 mt-2">
          {[
            { value: plan.objectives, label: 'Objectives' },
            { value: plan.activities, label: 'Activities' },
            { value: plan.resourceCount, label: 'Resources' },
          ].map((stat) => (
            <div className="col-4" key={stat.label}>
              <div className="border rounded p-2">
                <h6 className="mb-0">{stat.value}</h6>
                <span className="fs-11 text-muted">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills nav-justified bg-light rounded p-1 mb-3 fs-12" role="tablist">
        {detailTabs.map((item) => (
          <li className="nav-item" role="presentation" key={item.id}>
            <button
              className={`nav-link py-1 px-2${tab === item.id ? ' active' : ''}`}
              type="button"
              role="tab"
              aria-controls={item.paneId}
              aria-selected={tab === item.id}
              onClick={() => onTab(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="tab-content">
        {/* Overview */}
        {tab === 'overview' ? (
          <div className="tab-pane fade show active" id="lp_ov" role="tabpanel">
            <p className="fs-13 text-muted mb-3">{plan.summary}</p>
            <ul className="list-unstyled mb-3">
              {[
                { label: 'Subject', value: plan.subject },
                { label: 'Grade / Class', value: `${plan.grade} · ${plan.classLetter}` },
                { label: 'Teacher', value: plan.teacher },
                { label: 'Academic Year', value: plan.year },
                { label: 'Week', value: plan.week },
                { label: 'Duration', value: `${plan.duration} Minutes` },
              ].map((row, index, rows) => (
                <li
                  key={row.label}
                  className={`d-flex justify-content-between py-1 fs-13${
                    index === rows.length - 1 ? '' : ' border-bottom'
                  }`}
                >
                  <span className="text-muted">{row.label}</span>
                  <span className="text-dark">{row.value}</span>
                </li>
              ))}
            </ul>
            <h6 className="fs-13 mb-2">Teaching Method</h6>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {plan.methods.map((method) => (
                <span className={`badge ${method.badgeClass}`} key={method.label}>
                  {method.label}
                </span>
              ))}
            </div>
            <h6 className="fs-13 mb-2">Homework</h6>
            <p className="fs-13 text-muted mb-3">{plan.homeworkNote}</p>
            <h6 className="fs-13 mb-2">Notes</h6>
            <p className="fs-13 text-muted mb-0">{plan.notes}</p>
          </div>
        ) : null}

        {/* Structure — the eight accordions */}
        {tab === 'structure' ? (
          <div className="tab-pane fade show active" id="lp_str" role="tabpanel">
            <div className="accordion" id="lp_struct">
              {structureSections.map((section) => {
                const open = openSection === section.key;

                return (
                  <div className="accordion-item border rounded mb-2" key={section.key}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button rounded${open ? '' : ' collapsed'}`}
                        type="button"
                        aria-expanded={open}
                        aria-controls={`st_${section.key}`}
                        onClick={() => onToggleSection(section.key)}
                      >
                        <i className={`${section.icon} me-2`} />
                        {section.title}
                      </button>
                    </h2>
                    <div
                      id={`st_${section.key}`}
                      className={`accordion-collapse collapse${open ? ' show' : ''}`}
                    >
                      <div className="accordion-body pt-2 fs-13 text-muted">
                        {plan.structure[section.key]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Goals */}
        {tab === 'goals' ? (
          <div className="tab-pane fade show active" id="lp_obj" role="tabpanel">
            <div className="row g-2">
              {goalCards.map((goal, index) => (
                <div className="col-6" key={goal.title}>
                  <div className="card card-hover mb-0">
                    <div className="card-body p-3">
                      <span
                        className={`avatar avatar-sm bg-${goal.tone}-transparent text-${goal.tone} rounded mb-2`}
                      >
                        <i className={goal.icon} />
                      </span>
                      <h6 className={goal.headingClass}>{goal.title}</h6>
                      <span className="fs-11 text-muted">{plan.goals[index]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Files */}
        {tab === 'files' ? (
          <div className="tab-pane fade show active" id="lp_res" role="tabpanel">
            <div className="d-flex flex-column gap-2">
              {plan.resources.map((resource) => (
                <div className="d-flex align-items-center border rounded p-2" key={resource.name}>
                  <span
                    className={`avatar avatar-sm bg-${resource.tone}-transparent text-${resource.tone} rounded me-2`}
                  >
                    <i className={resource.icon} />
                  </span>
                  <div className="flex-fill">
                    <h6 className="fs-13 mb-0 text-truncate">{resource.name}</h6>
                    <span className="fs-11 text-muted">{resource.meta}</span>
                  </div>
                  <div className="d-flex gap-1">
                    <Link
                      to="#"
                      className="btn btn-icon btn-sm rounded-circle flex-shrink-0 btn-outline-light bg-white"
                      title={resource.openLabel}
                      aria-label={resource.openLabel}
                      onClick={() => onResourceAction(resource, 'open')}
                    >
                      <i className={resource.openIcon} />
                    </Link>
                    {resource.downloadable ? (
                      <Link
                        to="#"
                        className="btn btn-icon btn-sm rounded-circle flex-shrink-0 btn-outline-light bg-white"
                        title="Download"
                        aria-label="Download"
                        onClick={() => onResourceAction(resource, 'download')}
                      >
                        <i className="ti ti-download" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm w-100 mt-3"
              onClick={onAddResource}
            >
              <i className="ti ti-upload me-1" />
              Add Resource
            </button>
          </div>
        ) : null}

        {/* Flow */}
        {tab === 'flow' ? (
          <div className="tab-pane fade show active" id="lp_tl" role="tabpanel">
            <div className="pt-1">
              {plan.timeline.map((entry, index) => {
                const stage = timelineStages[index] ?? timelineStages[timelineStages.length - 1];
                const last = index === plan.timeline.length - 1;

                return (
                  <div className="d-flex" key={`${stage.title}-${entry.note}`}>
                    <div className="d-flex flex-column align-items-center me-3">
                      <span
                        className={`avatar avatar-sm bg-${stage.tone}-transparent text-${stage.tone} rounded-circle flex-shrink-0`}
                      >
                        <i className={stage.icon} />
                      </span>
                      {last ? null : <span className="flex-fill border-start border-2 my-1" />}
                    </div>
                    <div className={last ? '' : 'pb-3'}>
                      <h6 className="fs-14 mb-0">{stage.title}</h6>
                      <span className="fs-12 text-muted">
                        {entry.minutes} min · {entry.note}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              className="btn btn-outline-light bg-white btn-sm w-100 mt-3"
              onClick={onAddActivity}
            >
              <i className="ti ti-plus me-1" />
              Add Activity
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default LessonDetailPanel;
