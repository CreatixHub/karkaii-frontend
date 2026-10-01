import { useEffect, useState } from 'react';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import JourneyPath from '../components/JourneyPath';
import type { TeacherModalId } from '../data/modals.data';
import type { ProductivityTeacher } from '../data/teachers.data';
import { engagementOf } from '../data/teachers.data';
import type { WorkspaceBox, WorkspaceStageId } from '../data/workspace.data';
import {
  analysisBoxes,
  coachingBoxes,
  coachingPlanBox,
  growthBoxes,
  insightBoxes,
  insightRecords,
  profileBoxes,
  workspaceStages,
} from '../data/workspace.data';

/** The template mixes an `h4`, an `h5` and `h6`s across the panel heads. */
const BoxHeading = ({ box }: { box: WorkspaceBox }) => {
  if (box.headingTag === 'h4') return <h4 className={box.headingClass}>{box.heading}</h4>;
  if (box.headingTag === 'h5') return <h5 className={box.headingClass}>{box.heading}</h5>;
  return <h6>{box.heading}</h6>;
};

/** One `.tch-box` — head, optional pill, then lines or profile bars. */
const Box = ({ box }: { box: WorkspaceBox }) => (
  <div className="tch-box">
    <div className="tch-box-head">
      <BoxHeading box={box} />
      {box.pill ? (
        <span className={`tch-pill ${box.pill.tone}`.trim()}>
          {box.pill.icon ? <i className={box.pill.icon} /> : null}
          {box.pill.label}
        </span>
      ) : null}
    </div>
    <div className="tch-box-body">
      {box.quote ? <p className="tch-quote mb-3">{box.quote}</p> : null}
      {box.lines?.map((line) => (
        <div className="tch-line" key={line.label}>
          <span>{line.label}</span>
          <b>{line.value}</b>
        </div>
      ))}
      {box.facets?.map((facet) => (
        <span className="tch-facet" key={facet.label}>
          <span>{facet.label}</span>
          <span
            className={`tch-facet-bar ${facet.tone ? `${facet.tone} ` : ''}aix-p-${facet.value}`}
          />
          <b>{facet.value}</b>
        </span>
      ))}
      {box.note ? <p className="fs-12 text-muted mb-0 mt-3">{box.note}</p> : null}
    </div>
  </div>
);

export interface TeacherWorkspaceProps {
  open: boolean;
  teacher: ProductivityTeacher;
  onClose: () => void;
  onOpenModal: (modal: TeacherModalId) => void;
}

const TeacherWorkspace = ({ open, teacher, onClose, onOpenModal }: TeacherWorkspaceProps) => {
  const [stage, setStage] = useState<WorkspaceStageId>('tw_profile');

  useEffect(() => {
    if (!open) return;

    // Every open starts on Stage 01, as a freshly built offcanvas would.
    setStage('tw_profile');

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('offcanvas-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('offcanvas-open');
    };
  }, [open, onClose]);

  if (!open) return null;

  const paneClass = (id: WorkspaceStageId) =>
    `tab-pane fade${stage === id ? ' show active' : ''}`;

  return (
    <>
      <div
        className="offcanvas offcanvas-end tch-ws show"
        tabIndex={-1}
        id="teacher_workspace"
        aria-labelledby="teacher_workspace_label"
        role="region"
        style={{ visibility: 'visible' }}
      >
        <div className="tch-ws-head">
          <span className="avatar avatar-xxl avatar-rounded flex-shrink-0">
            <ImageWithBasePath src={teacher.avatar} alt={teacher.name} />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="teacher_workspace_label">
              {teacher.name}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {teacher.department} · {teacher.subjects} · TCH-0141 · Joined Jun 2021
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="tch-pill is-high">
                <i className="ti ti-flame" />
                Engagement {engagementOf(teacher)}
              </span>
              <span className="tch-pill is-ai">
                <i className="ti ti-sparkles" />
                {teacher.confidence}% confidence
              </span>
              <span className="tch-pill">
                <i className="ti ti-bulb" />
                {teacher.style}
              </span>
            </div>
          </div>
          <div className="ms-auto text-end">
            <span className="tch-lbl mb-1">Productivity score</span>
            <span className="tch-card-score">
              <b>
                {teacher.score}
                <small>/100</small>
              </b>
            </span>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>

        <ul className="tch-crumbs nav" role="tablist">
          {workspaceStages.map((item) => (
            <li role="presentation" key={item.id}>
              <button
                className={`tch-crumb${stage === item.id ? ' active' : ''}`}
                id={`${item.id}_tab`}
                type="button"
                role="tab"
                aria-controls={item.id}
                aria-selected={stage === item.id}
                onClick={() => setStage(item.id)}
              >
                <span className="tch-crumb-n">{item.n}</span>
                <span className="tch-crumb-txt">
                  <span>{item.stage}</span>
                  <span>{item.label}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="offcanvas-body">
          <div className="tab-content">
            {/* Stage 01 */}
            <div
              className={paneClass('tw_profile')}
              id="tw_profile"
              role="tabpanel"
              aria-labelledby="tw_profile_tab"
              tabIndex={0}
            >
              <div className="row g-4">
                {profileBoxes.map((box) => (
                  <div className={box.col} key={box.id}>
                    <Box box={box} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 02 */}
            <div
              className={paneClass('tw_analysis')}
              id="tw_analysis"
              role="tabpanel"
              aria-labelledby="tw_analysis_tab"
              tabIndex={0}
            >
              <div className="row g-4">
                {analysisBoxes.map((box) => (
                  <div className={box.col} key={box.id}>
                    <Box box={box} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 03 */}
            <div
              className={paneClass('tw_insights')}
              id="tw_insights"
              role="tabpanel"
              aria-labelledby="tw_insights_tab"
              tabIndex={0}
            >
              <div className="row g-4">
                <div className="col-12 col-xl-7">
                  <span className="tch-lbl mb-2">Explainable AI</span>
                  {insightRecords.map((record) => (
                    <div className={`tch-record ${record.tone} mb-3`} key={record.id}>
                      <div className="tch-record-head mb-0 pb-0 border-0">
                        <p className="tch-record-obs fs-14">{record.observation}</p>
                        <span className="tch-pill is-ai">{record.confidence}%</span>
                      </div>
                      <p className="fs-13 text-muted mb-0 mt-2">{record.body}</p>
                    </div>
                  ))}
                </div>
                <div className="col-12 col-xl-5">
                  <div className="row g-4">
                    {insightBoxes.map((box) => (
                      <div className={box.col} key={box.id}>
                        <Box box={box} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 04 */}
            <div
              className={paneClass('tw_coaching')}
              id="tw_coaching"
              role="tabpanel"
              aria-labelledby="tw_coaching_tab"
              tabIndex={0}
            >
              <div className="row g-4">
                <div className={coachingPlanBox.col}>
                  <Box box={coachingPlanBox} />
                </div>
                <div className="col-12 col-xl-7">
                  <div className="row g-4">
                    {coachingBoxes.map((box) => (
                      <div className={box.col} key={box.id}>
                        <Box box={box} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 05 */}
            <div
              className={paneClass('tw_growth')}
              id="tw_growth"
              role="tabpanel"
              aria-labelledby="tw_growth_tab"
              tabIndex={0}
            >
              <div className="row g-4">
                <div className="col-12 col-xl-7">
                  <div className="tch-box">
                    <div className="tch-box-head">
                      <h6>Growth timeline</h6>
                    </div>
                    <div className="tch-box-body">
                      <JourneyPath bodyClass="fs-12" />
                    </div>
                  </div>
                </div>
                <div className="col-12 col-xl-5">
                  <div className="row g-4">
                    {growthBoxes.map((box) => (
                      <div className={box.col} key={box.id}>
                        <Box box={box} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="offcanvas-footer">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <p className="fs-12 text-muted mb-0">
              <i className="ti ti-info-circle me-1" />
              These findings support coaching conversations. They are not an appraisal and are not
              written to a personnel record.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenModal('export_report')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </button>
              <button
                type="button"
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenModal('observation')}
              >
                <i className="ti ti-eye me-1" />
                Schedule Observation
              </button>
              <button
                type="button"
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenModal('coaching_plan')}
              >
                <i className="ti ti-route me-1" />
                Create Coaching Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="offcanvas-backdrop fade show" onMouseDown={onClose} aria-hidden="true" />
    </>
  );
};

export default TeacherWorkspace;
