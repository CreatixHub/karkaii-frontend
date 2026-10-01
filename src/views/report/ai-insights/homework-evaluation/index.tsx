import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import HomeworkWorkspace from './modals/HomeworkWorkspace';
import HomeworkModals from './modals/HomeworkModals';
import type { HomeworkModalId } from './modals/HomeworkModals';
import type { Submission } from './data/homework.data';
import {
  ASSIGNMENTS,
  completionLabelOf,
  COPILOT,
  FEATURED,
  FEEDBACK,
  fillIn,
  FINDINGS,
  gapToneOf,
  GAPS,
  gradeFor,
  INSIGHTS,
  LAST_RUN,
  OPPORTUNITIES,
  PENDING_REVIEWS,
  priorityOf,
  punctualityOf,
  punctualityToneOf,
  QUALITY,
  REVIEWS_COMPLETED,
  RUBRIC,
  rubricStripOf,
  RUN_CONFIDENCE,
  scoreOf,
  SUBMISSIONS,
  SUBMISSIONS_MARKED,
  timelineSteps,
} from './data/homework.data';

/** A numbered section heading, in the template's own wording. */
const Head = ({
  n,
  title,
  note,
  action,
}: {
  n: string;
  title: string;
  note: string;
  action?: React.ReactNode;
}) => (
  <div className="hwk-head d-flex align-items-end justify-content-between flex-wrap gap-3">
    <div>
      <span className="hwk-kicker">Section {n}</span>
      <h2 className="hwk-title">{title}</h2>
      <p className="hwk-sub">{note}</p>
    </div>
    {action}
  </div>
);

const AiHomeworkEvaluation = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<HomeworkModalId | null>(null);
  const [openRow, setOpenRow] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState(ASSIGNMENTS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as HomeworkModalId), []);
  const showRow = useCallback((row: Submission) => {
    setDialog(null);
    setOpenRow(row);
  }, []);

  // The desk shows the strongest sheet in the pile, which is what a marker sees on top.
  const DESK = [...SUBMISSIONS].filter((row) => row.marks).sort((a, b) => (scoreOf(b) ?? 0) - (scoreOf(a) ?? 0))[1] ?? FEATURED;
  const deskGrade = gradeFor(DESK);
  const timeline = timelineSteps();

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Homework Evaluation Center
              </h3>
              <nav>
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to={routes.adminDashboard}>Dashboard</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to={routes.aiCommandCenter}>AI</Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Homework Evaluation
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <div className={`dropdown me-2 mb-2 ${pickerOpen ? 'show' : ''}`.trim()}>
                <ActionLink
                  className="dropdown-toggle btn btn-outline-light bg-white fw-medium d-inline-flex align-items-center"
                  onClick={() => setPickerOpen((current) => !current)}
                >
                  <i className="ti ti-notebook me-2" />
                  {assignment}
                </ActionLink>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3 ${pickerOpen ? 'show' : ''}`.trim()}
                >
                  {ASSIGNMENTS.map((option) => (
                    <li key={option}>
                      <ActionLink
                        className={`dropdown-item rounded-1 ${
                          option === assignment ? 'active' : ''
                        }`.trim()}
                        onClick={() => {
                          setAssignment(option);
                          setPickerOpen(false);
                        }}
                      >
                        {option}
                      </ActionLink>
                    </li>
                  ))}
                </ul>
              </div>
              <ActionLink
                className="btn btn-primary mb-2 d-inline-flex align-items-center"
                onClick={() => setOpenRow(FEATURED)}
              >
                <i className="ti ti-layout-sidebar-right-expand me-1" />
                Open Review Studio
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the review studio */}
          <div className="hwk-studio mb-5">
            <div className="hwk-studio-inner">
              <div>
                <span className="hwk-studio-badge">
                  <i className="ti ti-writing-sign" />
                  Homework Evaluation Engine
                </span>
                <h1 className="hwk-studio-title">
                  {SUBMISSIONS_MARKED} submissions marked overnight.{' '}
                  <em>{PENDING_REVIEWS} need your judgement.</em>
                </h1>
                <p className="fs-14 text-muted lh-base mb-0">
                  The engine read every submission for concept understanding, reasoning, originality
                  and presentation, and wrote its evidence for each score. It has flagged the{' '}
                  {PENDING_REVIEWS} where its own confidence is too low to stand alone.
                </p>
                <div className="hwk-record">
                  <span className="hwk-record-cell">
                    <span className="hwk-lbl">Evaluation status</span>
                    <b>Complete · {LAST_RUN}</b>
                  </span>
                  <span className="hwk-record-cell">
                    <span className="hwk-lbl">Pending reviews</span>
                    <b>
                      {PENDING_REVIEWS}
                      <small> flagged</small>
                    </b>
                  </span>
                  <span className="hwk-record-cell">
                    <span className="hwk-lbl">Completed reviews</span>
                    <b>
                      {REVIEWS_COMPLETED}
                      <small> of {SUBMISSIONS_MARKED}</small>
                    </b>
                  </span>
                  <span className="hwk-record-cell">
                    <span className="hwk-lbl">AI confidence</span>
                    <b>
                      {RUN_CONFIDENCE}
                      <small>% mean</small>
                    </b>
                  </span>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('run_evaluation')}
                  >
                    <i className="ti ti-player-play me-1" />
                    Run AI Evaluation
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('generate_feedback')}
                  >
                    <i className="ti ti-message-2 me-1" />
                    Generate Feedback
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setOpenRow(FEATURED)}
                  >
                    <i className="ti ti-bulb me-1" />
                    Explain AI Review
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('export_evaluation')}
                  >
                    <i className="ti ti-file-export me-1" />
                    Export Evaluation
                  </ActionLink>
                </div>
              </div>

              <div className="hwk-stack">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="hwk-lbl">Marking desk</span>
                  <span className="hwk-tag is-ai">
                    <i className="ti ti-sparkles" />
                    Live
                  </span>
                </div>
                <div className="hwk-sheets">
                  <span className="hwk-sheet s1" />
                  <span className="hwk-sheet s2" />
                  <span className="hwk-sheet s3">
                    {(DESK.marks ?? []).map((mark, index) => (
                      <span
                        className={`hwk-ruled ${index % 2 === 1 ? 'is-mark ' : ''}aix-p-${mark}`}
                        key={`ruled-${RUBRIC[index]}`}
                      />
                    ))}
                    {deskGrade ? (
                      <span className={`hwk-seal ${deskGrade.seal} hwk-sheet-seal`}>
                        <b>{deskGrade.grade}</b>
                        <span>Graded</span>
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="fs-12 text-muted">
                    {DESK.subject} · {DESK.assignment.split(' · ')[0]} · {DESK.className}
                  </span>
                  <span className="hwk-tag is-strong">
                    <i className="ti ti-check" />
                    {REVIEWS_COMPLETED} marked
                  </span>
                </div>
                <p className="fs-12 text-muted mb-0">
                  Marking runs against the rubric you published, never against a hidden scale. Every
                  score carries the evidence that produced it.
                </p>
              </div>
            </div>
          </div>

          {/* Section 02 — the queue */}
          <Head
            n="02"
            title="Submission Review Queue"
            note="Every submission the engine read, with the grade it proposes and the evidence behind it."
            action={
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('all_submissions')}
              >
                <i className="ti ti-list me-1" />
                All submissions
              </ActionLink>
            }
          />

          <div className="row g-4 mb-5">
            {SUBMISSIONS.map((row) => {
              const grade = gradeFor(row);
              return (
                <div className="col-xl-4 col-md-6" key={row.id}>
                  <div className="hwk-sub">
                    <div className="hwk-sub-head">
                      <span className="avatar avatar-lg avatar-rounded flex-shrink-0">
                        <ImageWithBasePath src={row.studentImage} alt={row.student} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="hwk-sub-title text-truncate">{row.student}</p>
                        <p className="fs-12 text-muted mb-0">
                          {row.className} · {row.subject}
                        </p>
                      </div>
                      <span className={`hwk-seal ${grade ? grade.seal : 'is-weak'}`}>
                        <b>{grade ? grade.grade : '—'}</b>
                        <span>AI</span>
                      </span>
                    </div>
                    <div className="hwk-sub-body">
                      <div>
                        <span className="hwk-lbl mb-1">Assignment</span>
                        <p className="fs-13 fw-medium text-dark mb-0">{row.assignment}</p>
                      </div>
                      <div>
                        <span className="hwk-lbl mb-2">Rubric · {RUBRIC.join(', ')}</span>
                        <span className="hwk-rubric">
                          {rubricStripOf(row).map((level, index) => (
                            <i className={level} key={`${row.id}-${RUBRIC[index]}`} />
                          ))}
                        </span>
                      </div>
                      <div className="hwk-sub-meta">
                        <span className="hwk-cell">
                          <span className="hwk-lbl">Submission</span>
                          <span className="text-truncate">{punctualityOf(row)}</span>
                        </span>
                        <span className="hwk-cell">
                          <span className="hwk-lbl">Completion</span>
                          <span className="text-truncate">{completionLabelOf(row)}</span>
                        </span>
                        <span className="hwk-cell">
                          <span className="hwk-lbl">Originality</span>
                          <span className="text-truncate">{row.originality}</span>
                        </span>
                        <span className="hwk-cell">
                          <span className="hwk-lbl">Teacher</span>
                          <span className="text-truncate">{row.teacher}</span>
                        </span>
                      </div>
                      <div className="d-flex align-items-end justify-content-between gap-2">
                        <div>
                          <span className="hwk-lbl mb-1">AI confidence</span>
                          {row.confidence === null ? (
                            <span className="fs-13 text-muted">Not evaluated</span>
                          ) : (
                            <span className={`hwk-conf aix-p-${row.confidence}`}>
                              <b>{row.confidence}%</b>
                            </span>
                          )}
                        </div>
                        <span className={`hwk-tag ${punctualityToneOf(row)}`}>
                          {punctualityOf(row)}
                        </span>
                      </div>
                    </div>
                    <div className="hwk-sub-foot">
                      <ActionLink
                        className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                        onClick={() => showRow(row)}
                      >
                        <i className="ti ti-eye me-1" />
                        Review Submission
                      </ActionLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 03 — the margin notes */}
          <Head
            n="03"
            title="Why the AI Marked It This Way"
            note={`${FINDINGS.length} findings on ${FEATURED.student}’s ${FEATURED.assignment.split(' · ')[0]}, written as margin notes. Reasoning on the left, the evidence that produced it in the middle, what to do about it on the right.`}
          />

          <div className="mb-5">
            {FINDINGS.map((finding) => (
              <div className={`hwk-note ${finding.tone}`} key={finding.id}>
                <div className="hwk-note-head">
                  <p className="hwk-note-obs">
                    <i className={`${finding.icon} me-2 text-muted`} />
                    {finding.observation}
                  </p>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className={`hwk-tag ${finding.tone}`}>{finding.label}</span>
                    <span className="hwk-tag is-ai">
                      <i className="ti ti-sparkles" />
                      {finding.confidence}%
                    </span>
                  </div>
                </div>
                <div className="hwk-cols">
                  <div>
                    <span className="hwk-lbl mb-2">AI reasoning</span>
                    <p className="fs-13 text-muted lh-base mb-0">{finding.why}</p>
                  </div>
                  <div className="hwk-col-rule">
                    <span className="hwk-lbl mb-1">Supporting evidence</span>
                    {finding.evidence.map((item) => (
                      <div className="hwk-ev" key={item.text}>
                        <i className={item.icon} />
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="hwk-col-rule">
                    <span className="hwk-lbl mb-1">Suggested improvement</span>
                    <p className="fs-13 text-muted mb-3">{finding.suggestion}</p>
                    <span className="hwk-lbl mb-1">Learning impact</span>
                    <p className="fs-13 fw-medium text-dark mb-3">{finding.impact}</p>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => setDialog('learning_plan')}
                    >
                      <i className="ti ti-plus me-1" />
                      Add to learning plan
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — the gaps */}
          <Head
            n="04"
            title="Learning Gap Center"
            note={`${GAPS.length} dimensions read off this submission, each with what the engine would do about it.`}
          />

          <div className="row g-4 mb-5">
            {GAPS.map((gap) => (
              <div className="col-xl-3 col-md-6" key={gap.id}>
                <div className="hwk-gap">
                  <div className="d-flex align-items-center justify-content-between gap-2">
                    <p className="hwk-gap-title">{gap.title}</p>
                    <span className={`hwk-tag ${gapToneOf(gap.severity)}`}>{gap.severity}</span>
                  </div>
                  <span className="hwk-lbl mb-1">AI finding</span>
                  <p className="fs-13 text-muted mb-3">{gap.finding}</p>
                  <span className="hwk-lbl mb-1">Improvement suggestion</span>
                  <p className="fs-13 text-muted mb-3">{gap.suggestion}</p>
                  <span className="hwk-lbl mb-1">Expected outcome</span>
                  <p className="fs-13 fw-medium text-dark mb-0">{gap.outcome}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05 — the feedback centre */}
          <Head
            n="05"
            title="Smart Feedback Center"
            note="Ranked by the marks each returns against the time it asks for. Nothing sends until you apply it."
          />

          <div className="row g-4 mb-5">
            {FEEDBACK.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className="hwk-fb">
                    <span className="hwk-fb-ic">
                      <i className={entry.icon} />
                    </span>
                    <div className="hwk-fb-body">
                      <div className="hwk-fb-ribbon">
                        <span className={`hwk-tag ${priority.tag}`}>{priority.band} priority</span>
                        <span className="hwk-tag is-ai">
                          <i className="ti ti-sparkles" />
                          {entry.confidence}%
                        </span>
                      </div>
                      <p className="fs-14 fw-medium text-dark mb-1">{entry.title}</p>
                      <p className="fs-13 text-muted mb-2">{entry.note}</p>
                      <div className="d-flex align-items-center justify-content-between gap-2 flex-wrap">
                        <span className="fs-12 text-muted">
                          Expected <b className="text-dark">{entry.expected}</b>
                        </span>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          onClick={() => openDialog(entry.modal)}
                        >
                          <i className="ti ti-bolt me-1" />
                          Apply
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 06 — the quality studio */}
          <Head
            n="06"
            title="Homework Quality Studio"
            note="Eight readings of this student's work across the term, graded the same way the set is."
          />

          <div className="row g-4 mb-5">
            {QUALITY.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="hwk-q">
                  <span className="hwk-q-grade">{entry.grade}</span>
                  <p className="hwk-q-title">{entry.title}</p>
                  <p className="fs-13 text-muted mb-0">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the copilot */}
          <Head
            n="07"
            title="Teacher Copilot"
            note={`${COPILOT.length} things the copilot can draft from this evaluation. Everything arrives as a draft for you to edit, never sent directly.`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.title}>
                <ActionLink className="hwk-shelf" onClick={() => openDialog(entry.modal)}>
                  <span className="hwk-shelf-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <i className="ti ti-plus hwk-shelf-add" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 08 — the timeline */}
          <Head
            n="08"
            title="Evaluation Timeline"
            note="Where this submission sits between the day it was set and the day it closes."
          />

          <div className="card mb-5">
            <div className="card-body">
              {timeline.map((step) => (
                <div className={`hwk-step ${step.done ? 'is-done' : ''}`.trim()} key={step.id}>
                  <div className="flex-fill overflow-hidden">
                    <p className="hwk-step-title">{step.title}</p>
                    <p className="fs-12 text-muted mb-1">{step.when}</p>
                    <p className="fs-13 text-muted mb-0">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 09 — what could follow */}
          <Head
            n="09"
            title="Learning Opportunity Center"
            note="What could follow this evaluation. Each tile drops straight into the learning plan."
          />

          <div className="row g-4 mb-5">
            {OPPORTUNITIES.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="hwk-ladder">
                  <span className="hwk-ico">
                    <i className={entry.icon} />
                  </span>
                  <p className="fs-14 fw-medium text-dark mb-1">{entry.title}</p>
                  <p className="fs-12 text-muted mb-3">{entry.note}</p>
                  <ActionLink
                    className="btn btn-sm btn-outline-light bg-white mt-auto align-self-start d-inline-flex align-items-center"
                    onClick={() => openDialog(entry.modal)}
                  >
                    <i className="ti ti-arrow-right me-1" />
                    {entry.cta}
                  </ActionLink>
                </div>
              </div>
            ))}
          </div>

          {/* Section 10 — what the run showed */}
          <Head
            n="10"
            title="AI Insight Center"
            note={`${INSIGHTS.length} conclusions drawn across all ${SUBMISSIONS_MARKED} submissions, written as intelligence rather than as figures.`}
          />

          <div className="row g-4 mb-4">
            {INSIGHTS.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.n}>
                <div className="hwk-insight">
                  <span className="hwk-insight-n">{entry.n}</span>
                  <div className="flex-fill overflow-hidden">
                    <p className="hwk-insight-title">{entry.title}</p>
                    <p className="fs-13 text-muted mb-0">{fillIn(entry.text)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <HomeworkWorkspace
        open={openRow !== null}
        onClose={() => setOpenRow(null)}
        row={openRow}
        onOpenDialog={openDialog}
      />

      <HomeworkModals
        active={dialog}
        onClose={() => setDialog(null)}
        row={openRow ?? FEATURED}
        onToast={pushToast}
        onOpenRow={showRow}
        onOpenDialog={setDialog}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiHomeworkEvaluation;
