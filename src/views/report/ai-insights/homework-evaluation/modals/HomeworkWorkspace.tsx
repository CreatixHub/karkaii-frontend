import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { Submission } from '../data/homework.data';
import {
  bandOf,
  COHORT_WITH_GAP,
  completionLabelOf,
  completionPctOf,
  criteriaOf,
  CRITERION_CONFIDENCE,
  CRITERION_CONFIDENCE_MEAN,
  CRITICAL_GAPS,
  DUE_AT,
  DUE_ON,
  gapToneOf,
  GAPS,
  gradeFor,
  ISSUED_AT,
  ISSUED_ON,
  latenessLabelOf,
  PLAN,
  PLAN_REVIEW,
  punctualityOf,
  RECEIVED_ON,
  scoreOf,
  SIMILAR,
  SUBMISSIONS_MARKED,
  TOPICS,
} from '../data/homework.data';

const STAGES = [
  { n: '01', name: 'Submission' },
  { n: '02', name: 'Evaluation' },
  { n: '03', name: 'Insights' },
  { n: '04', name: 'Feedback' },
  { n: '05', name: 'Learning Plan' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface HomeworkWorkspaceProps {
  open: boolean;
  onClose: () => void;
  row: Submission | null;
  onOpenDialog: (id: string) => void;
}

const Panel = ({
  title,
  badge,
  children,
  className = '',
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`hwk-panel ${className}`.trim()}>
    <div className="hwk-panel-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="hwk-tag is-ai">{badge}</span> : null}
    </div>
    <div className="hwk-panel-body">{children}</div>
  </div>
);

const Line = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="hwk-line">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

const HomeworkWorkspace = ({ open, onClose, row, onOpenDialog }: HomeworkWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Submission');

  useEffect(() => {
    if (open) setStage('Submission');
  }, [open, row?.id]);

  if (!open || !row) return null;

  const grade = gradeFor(row);
  const score = scoreOf(row);
  const criteria = criteriaOf(row);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={`${row.student} · ${row.assignment.split(' · ')[0]}`}
      className="hwk-ws"
      labelledById="homework_workspace_label"
      header={
        <div className="hwk-ws-head">
          <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
            <ImageWithBasePath src={row.studentImage} alt={row.student} />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="homework_workspace_label">
              {row.student} · {row.assignment.split(' · ')[0]}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {row.className} · {row.subject} · {row.teacher} · {row.id}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="hwk-tag is-mid">{punctualityOf(row)}</span>
              {row.confidence !== null ? (
                <span className="hwk-tag is-ai">
                  <i className="ti ti-sparkles" />
                  {row.confidence}% confidence
                </span>
              ) : null}
              <span className="hwk-tag is-note">{completionLabelOf(row)}</span>
            </div>
          </div>
          {grade ? (
            <span className={`hwk-seal ${grade.seal} ms-auto`}>
              <b>{grade.grade}</b>
              <span>AI</span>
            </span>
          ) : null}
          <button
            type="button"
            className="btn-close custom-btn-close"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      }
      beforeBody={
        <ul className="hwk-dots nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`hwk-dot ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="hwk-dot-n">{entry.n}</span>
                <span className="hwk-dot-txt">
                  <span>Stage {entry.n}</span>
                  <span>{entry.name}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      }
      footer={
        <div className="offcanvas-footer">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <p className="fs-12 text-muted mb-0">
              <i className="ti ti-info-circle me-1" />
              AI marking is a first pass against your published rubric. No grade is released to a
              student or parent until you confirm it.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_evaluation')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('learning_plan')}
              >
                <i className="ti ti-route me-1" />
                Create Learning Plan
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('teacher_review')}
              >
                <i className="ti ti-check me-1" />
                Confirm Evaluation
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Submission' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Panel title="Submission detail">
              <Line label="Assignment" value={row.assignment.split(' · ')[0]} />
              <Line label="Subject" value={row.subject} />
              <Line label="Class" value={row.className.replace('Class ', '')} />
              <Line label="Teacher" value={row.teacher} />
              <Line label="Issued" value={`${ISSUED_ON.slice(0, 6)}, ${ISSUED_AT}`} />
              <Line label="Due" value={`${DUE_ON.slice(0, 6)}, ${DUE_AT}`} />
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Status" badge="Needs review">
              <Line
                label="Received"
                value={row.lateMinutes === null ? 'Not received' : `${RECEIVED_ON.slice(0, 6)}, 22:40`}
              />
              <Line label="Punctuality" value={latenessLabelOf(row)} />
              <Line label="Questions attempted" value={`${row.questionsSet} of ${row.questionsSet}`} />
              <Line
                label="Questions completed"
                value={`${row.questionsCompleted} of ${row.questionsSet}`}
              />
              <Line
                label="AI grade"
                value={grade && score !== null ? `${grade.grade} · ${score}` : 'Not evaluated'}
              />
              <Line label="Released to student" value="Not yet" />
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Submitted work" badge={`${row.questionsSet} pages`}>
              <div className="hwk-preview">
                <i className="ti ti-file-text" />
                <span className="fs-13 text-muted">
                  {row.questionsSet} pages read against {criteria.length} rubric criteria
                </span>
              </div>
              <ActionLink
                className="btn btn-sm btn-outline-light bg-white mt-3 d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_evaluation')}
              >
                <i className="ti ti-external-link me-1" />
                Open the submission
              </ActionLink>
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Evaluation' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Quality assessment" badge={grade ? grade.grade : undefined}>
                {criteria.map((entry) => (
                  <Line
                    key={entry.label}
                    label={entry.label.charAt(0).toUpperCase() + entry.label.slice(1)}
                    value={entry.band ? `Band ${entry.band}` : '—'}
                  />
                ))}
              </Panel>
            </div>
            <Panel title="Concept evaluation" badge="Strong">
              <Line
                label="Correct setup"
                value={`${row.questionsSet} of ${row.questionsSet}`}
              />
              <Line label="Errors in method" value="None" />
              <Line label="Errors in arithmetic" value="2" />
              <Line label="Untaught method used" value="Q7" />
              <Line label="Verdict" value="Secure" />
            </Panel>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Originality review" badge={row.originality}>
                <Line label="Originality score" value="96%" />
                <Line label="Matched sources" value="None" />
                <Line
                  label="Method matches class"
                  value={`${row.questionsSet - 1} of ${row.questionsSet}`}
                />
                <Line label="Q7 method" value="Not taught" />
                <Line label="Flag" value="None raised" />
              </Panel>
            </div>
            <div className="mb-4">
              <Panel title="Supporting evidence">
                <Line label="Rubric criteria checked" value={`${criteria.length} of ${criteria.length}`} />
                <Line label="Evidence items recorded" value="18" />
                <Line label="Pages read" value={row.questionsSet} />
                <Line label="Comparable submissions" value={SUBMISSIONS_MARKED} />
                <Line label="Prior sets referenced" value="3" />
              </Panel>
            </div>
            <Panel
              title="AI confidence by criterion"
              badge={`Mean ${CRITERION_CONFIDENCE_MEAN}%`}
            >
              {CRITERION_CONFIDENCE.map((entry) => (
                <Line key={entry.label} label={entry.label} value={`${entry.value}%`} />
              ))}
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Insights' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Learning gaps" badge={`${CRITICAL_GAPS} critical`}>
                {GAPS.slice(0, 6).map((gap) => (
                  <Line
                    key={gap.id}
                    label={gap.title}
                    value={<span className={`hwk-tag ${gapToneOf(gap.severity)}`}>{gap.severity}</span>}
                  />
                ))}
              </Panel>
            </div>
            <Panel title="Subject analysis">
              {TOPICS.map((topic) => (
                <Line key={topic.label} label={topic.label} value={`Band ${bandOf(topic.mark)}`} />
              ))}
            </Panel>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Panel title="Strengths" badge="4 found">
                <Line label="Concept setup" value={`Band ${criteria[0].band ?? '—'}`} />
                <Line label="Retention" value="Ahead of cohort" />
                <Line label="Creative method" value="Q7" />
                <Line label="Accuracy when finished" value="94%" />
              </Panel>
            </div>
            <div className="mb-4">
              <Panel title="Weaknesses" badge="4 found">
                <Line label="Second substitution" value="Critical" />
                <Line label="Written justification" value="High" />
                <Line label="Presentation" value="High" />
                <Line label="Time on long sets" value="High" />
              </Panel>
            </div>
            <Panel title="Similar students">
              {SIMILAR.map((match) => (
                <Line
                  key={match.name}
                  label={`${match.name} · ${match.className}`}
                  value={match.note}
                />
              ))}
              <Line
                label="Cohort with this gap"
                value={`${COHORT_WITH_GAP} of ${SUBMISSIONS_MARKED}`}
              />
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Feedback' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="mb-4">
              <Panel title="Teacher feedback" badge="Draft">
                <p className="fs-13 text-muted mb-3">
                  Concept is secure across the whole set — every question was set up correctly.
                  Marks were lost to three unfinished questions and to presentation, not to
                  understanding. Re-set the second-substitution step in isolation before moving on.
                </p>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => onOpenDialog('generate_feedback')}
                >
                  <i className="ti ti-pencil me-1" />
                  Edit draft
                </ActionLink>
              </Panel>
            </div>
            <div className="mb-4">
              <Panel title="Student feedback" badge="Draft">
                <p className="fs-13 text-muted mb-3">
                  You set up every question correctly, which is the hard part — well done. Three
                  answers stop at the same step, where you substitute a second time. Try the four
                  practice questions attached; they only cover that one step.
                </p>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => onOpenDialog('generate_feedback')}
                >
                  <i className="ti ti-pencil me-1" />
                  Edit draft
                </ActionLink>
              </Panel>
            </div>
            <Panel title="Parent summary" badge="Draft">
              <p className="fs-13 text-muted mb-3">
                {row.student.split(' ')[0]} understands this topic well. The marks lost were to
                three unfinished questions rather than to misunderstanding. We have attached short
                practice on the one step causing difficulty, and we would welcome help with starting
                longer sets earlier.
              </p>
              <ActionLink
                className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('parent_summary')}
              >
                <i className="ti ti-mail-star me-1" />
                Share summary
              </ActionLink>
            </Panel>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Panel title="Suggested improvements">
                <Line label="Re-attempt Q4, Q6, Q9" value="This week" />
                <Line label="One reasoning sentence per answer" value="Next set" />
                <Line label="Working laid out down the page" value="Next set" />
                <Line label="Start long sets two days early" value="Ongoing" />
              </Panel>
            </div>
            <Panel title="Practice activities">
              <Line label="Second-substitution drill" value="4 questions" />
              <Line label="Layout worked example" value="1 sheet" />
              <Line label="Substitution walkthrough" value="8 min video" />
              <Line label="Open-ended extension" value="Optional" />
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Learning Plan' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="mb-4">
              <Panel title="Personalized learning plan" badge="Drafted">
                <Line label="Focus" value={PLAN.focus} />
                <Line label="Duration" value={`${PLAN.weeks} weeks`} />
                <Line label="Owner" value={PLAN.owner} />
                <Line label="Checkpoint" value={PLAN.checkpoint} />
                <Line label="Target" value={PLAN.target} />
                <Line label="Review date" value={PLAN_REVIEW} />
              </Panel>
            </div>
            <Panel title="Weekly goals">
              {PLAN.weekly.map((week) => (
                <Line key={week.week} label={`Week ${week.week}`} value={week.work} />
              ))}
            </Panel>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Panel title="Recommended resources">
                <Line label="Substitution walkthrough" value="Video, 8 min" />
                <Line label="Layout worked example" value="Sheet" />
                <Line label="Practice questions" value="4 targeted" />
                <Line label="Peer partner" value="Kabir Sethi" />
              </Panel>
            </div>
            <div className="mb-4">
              <Panel title="Progress tracking">
                <Line label="Sets since plan opened" value={`0 of ${PLAN.weeks}`} />
                <Line label="Completion now" value={`${completionPctOf(row)}%`} />
                <Line label="Completion target" value={`${PLAN.completionTarget}%`} />
                <Line
                  label="Presentation now"
                  value={`${criteria[4].mark !== null ? 1 : 0} of 4 marks`}
                />
              </Panel>
            </div>
            <Panel title="Success indicators">
              <Line label="All questions finished" value="Two sets running" />
              <Line label="Presentation band B or above" value="Reasoning present" />
              <Line label="Reasoning present" value="Every answer" />
              <Line label="Submitted on time" value="Two sets running" />
            </Panel>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default HomeworkWorkspace;
