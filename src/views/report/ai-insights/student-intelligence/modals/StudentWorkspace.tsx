import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import {
  ASSIGNMENTS,
  ATTENDANCE,
  COMPLETED_GOALS,
  CONFIDENCE_METERS,
  CURRENT_PERCENTILE,
  DIMENSIONS,
  FINDINGS,
  bandOf,
  healthLabelOf,
  INTELLIGENCE_SCORE,
  LAST_RUN,
  OPEN_CONCERNS,
  PARENT_ACTIONS,
  PERCENTILE_GROWTH,
  PLAN_TARGET_MARKS,
  PLAN_WEEKS,
  PROGRESS_LEGS,
  priorityOf,
  SCHOLARSHIP_WEEKS,
  SIGNALS_STEADY,
  SIMILAR,
  STRENGTHS,
  STUDENT,
  SUBJECTS,
  SUBJECTS_IMPROVING,
  TARGET_PERCENTILE,
  TEACHER_ACTIONS,
  TERMS_ON_RECORD,
  WEAKNESSES,
  TOP_RECOMMENDATIONS,
  ordinal,
} from '../data/student.data';

const STAGES = [
  { n: '01', name: 'Profile' },
  { n: '02', name: 'Learning' },
  { n: '03', name: 'Insights' },
  { n: '04', name: 'Recommendations' },
  { n: '05', name: 'Growth' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface StudentWorkspaceProps {
  open: boolean;
  onClose: () => void;
  onOpenDialog: (id: string) => void;
}

const Box = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="sdt-box">
    <p className="sdt-box-title">{title}</p>
    {children}
  </div>
);

const Line = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="sdt-line">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);

const Meter = ({
  label,
  value,
  caption,
  good,
}: {
  label: string;
  value: number;
  caption: string;
  good: boolean;
}) => (
  <div className="mb-3">
    <div className="d-flex align-items-center justify-content-between mb-2">
      <span className="sdt-lbl">{label}</span>
      <span className="fs-13 fw-semibold text-dark">{caption}</span>
    </div>
    <span className={`sdt-meter ${good ? 'is-good ' : ''}aix-p-${value}`} />
  </div>
);

const StudentWorkspace = ({ open, onClose, onOpenDialog }: StudentWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Profile');

  useEffect(() => {
    if (open) setStage('Profile');
  }, [open]);

  if (!open) return null;

  const health = `${healthLabelOf(INTELLIGENCE_SCORE)} · ${INTELLIGENCE_SCORE}`;

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={STUDENT.name}
      className="sdt-ws"
      labelledById="student_workspace_label"
      header={
        <div className="sdt-ws-head">
          <span className="avatar avatar-xxl avatar-rounded flex-shrink-0">
            <ImageWithBasePath src={STUDENT.image} alt={STUDENT.name} />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="student_workspace_label">
              {STUDENT.name}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {STUDENT.id} · Class {STUDENT.className} · {STUDENT.teacher}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className="sdt-tag is-ai">
                <i className="ti ti-sparkles" />
                Intelligence score {INTELLIGENCE_SCORE}
              </span>
              <span className="sdt-tag is-up">
                <i className="ti ti-trending-up" />+{PERCENTILE_GROWTH} percentile
              </span>
              <span className="sdt-tag is-alert">
                <i className="ti ti-alert-circle" />
                Mathematics gap
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close custom-btn-close ms-auto"
            aria-label="Close"
            onClick={onClose}
          >
            <i className="ti ti-x" />
          </button>
        </div>
      }
      beforeBody={
        <ul className="sdt-ribbon nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`sdt-rib ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span>Stage {entry.n}</span>
                <span>{entry.name}</span>
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
              AI findings support professional judgement. Nothing is recorded against the student
              without a teacher’s approval.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('parent_report')}
              >
                <i className="ti ti-mail-star me-1" />
                Parent Report
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_intelligence')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('learning_plan')}
              >
                <i className="ti ti-route me-1" />
                Create Learning Plan
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Profile' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Box title="Identity">
              <Line label="Student ID" value={STUDENT.id} />
              <Line label="Class & roll" value={`${STUDENT.className} · ${STUDENT.roll}`} />
              <Line label="Admitted" value={STUDENT.admittedOn} />
              <Line label="Class teacher" value={STUDENT.teacher} />
              <Line label="Guardian" value={STUDENT.guardian} />
              <Line label="House" value={STUDENT.house} />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Standing">
              <Line label="Overall percentile" value={ordinal(CURRENT_PERCENTILE)} />
              <Line label="Academic health" value={health} />
              <Line label="Learning status" value="On track" />
              <Line label="Attendance" value={`${ATTENDANCE.now}%`} />
              <Line label="Assignments on time" value={`${ASSIGNMENTS.onTimePct}%`} />
              <Line label="Last AI review" value={`Today, ${LAST_RUN}`} />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Digital twin summary">
              <div className="d-flex flex-wrap gap-2">
                <span className="sdt-tag is-up">
                  <i className="ti ti-book-2" />
                  Reading strength
                </span>
                <span className="sdt-tag is-up">
                  <i className="ti ti-flask" />
                  Science strength
                </span>
                <span className="sdt-tag is-alert">
                  <i className="ti ti-math-symbols" />
                  Algebra gap
                </span>
                <span className="sdt-tag">
                  <i className="ti ti-eye" />
                  Visual learner
                </span>
                <span className="sdt-tag">
                  <i className="ti ti-users" />
                  Small groups
                </span>
                <span className="sdt-tag is-up">
                  <i className="ti ti-checkbox" />
                  Reliable submitter
                </span>
              </div>
              <p className="fs-13 text-muted mb-0 mt-3">
                {SIGNALS_STEADY} of {DIMENSIONS.length} dimensions are stable or improving. The
                exception is symbolic algebra, which has not moved in two terms and now sets the
                ceiling on her overall standing.
              </p>
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Learning' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Subject analysis">
                {SUBJECTS.map((subject) => (
                  <Meter
                    key={subject.id}
                    label={subject.label}
                    value={subject.mark}
                    caption={`Band ${bandOf(subject.mark)}`}
                    good={subject.improving}
                  />
                ))}
              </Box>
            </div>
            <Box title="AI confidence">
              <p className="fs-13 text-muted mb-3">
                Confidence is highest where the signal spans the most terms. The algebra finding
                rests on six assessments and is among the most certain of all.
              </p>
              {CONFIDENCE_METERS.map((finding) => (
                <Meter
                  key={finding.id}
                  label={finding.meterLabel as string}
                  value={finding.confidence}
                  caption={`${finding.confidence}%`}
                  good={finding.tone !== 'is-alert'}
                />
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-7">
            <div className="row g-4">
              <div className="col-md-6">
                <Box title="Learning behaviour">
                  <Line label="First exposure" value="Slower than cohort" />
                  <Line label="Second exposure" value="Faster than cohort" />
                  <Line label="Retention at 8 weeks" value="Exceptional" />
                  <Line label="Preferred format" value="Worked examples" />
                  <Line label="Weakest format" value="Dense text" />
                </Box>
              </div>
              <div className="col-md-6">
                <Box title="Assignment pattern">
                  <Line label="Submitted on time" value={`${ASSIGNMENTS.onTimePct}%`} />
                  <Line
                    label="Submitted early"
                    value={`${ASSIGNMENTS.earlyThisTerm} this term`}
                  />
                  <Line
                    label="Late items"
                    value={`${ASSIGNMENTS.late}, all ${ASSIGNMENTS.lateSubject}`}
                  />
                  <Line label="Average quality" value={ASSIGNMENTS.quality} />
                  <Line label="Missed entirely" value={ASSIGNMENTS.missed === 0 ? 'None' : ASSIGNMENTS.missed} />
                </Box>
              </div>
              <div className="col-md-6">
                <Box title="Attendance pattern">
                  <Line label="This term" value={`${ATTENDANCE.now}%`} />
                  <Line
                    label="June dip"
                    value={`${ATTENDANCE.dipTo}% for ${ATTENDANCE.dipWeeks} weeks`}
                  />
                  <Line label="Cause" value={`${ATTENDANCE.route} schedule`} />
                  <Line label="Since correction" value="No absence" />
                  <Line label="Monitoring" value="Flag until term end" />
                </Box>
              </div>
              <div className="col-md-6">
                <Box title="Participation">
                  <Line label="Volunteered contributions" value="3x since May" />
                  <Line label="Group of four" value="Frequent" />
                  <Line label="Whole class" value="Rare" />
                  <Line label="Written response" value="Strong" />
                  <Line label="Held for" value="Eleven weeks" />
                </Box>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {stage === 'Insights' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            {FINDINGS.slice(0, 4).map((finding) => (
              <div className="sdt-lens mb-3" key={finding.id}>
                <div className="sdt-lens-face">
                  <span className={`sdt-lens-ic ${finding.tone}`}>
                    <i className={finding.icon} />
                  </span>
                  <p className="sdt-lens-obs">{finding.observation}</p>
                  <span className={`sdt-tag ${finding.statusTag}`}>{finding.status}</span>
                </div>
                <div className="sdt-lens-body">
                  <span className="sdt-lbl mb-2">AI reasoning</span>
                  <p className="sdt-lens-why">{finding.why}</p>
                  {finding.evidence.map((item) => (
                    <div className="sdt-ev" key={item.text}>
                      <i className={item.icon} />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Strengths">
                <div className="d-flex flex-wrap gap-2">
                  {STRENGTHS.map((item) => (
                    <span className="sdt-tag is-up" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Weaknesses">
                <div className="d-flex flex-wrap gap-2">
                  {WEAKNESSES.map((item) => (
                    <span className="sdt-tag is-alert" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </Box>
            </div>
            <Box title="Similar students">
              {SIMILAR.map((match) => (
                <div className="sdt-ev" key={match.name}>
                  <i className="ti ti-user-check" />
                  <span>
                    {match.name} · {match.className} — {match.note}
                  </span>
                </div>
              ))}
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Recommendations' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            {TOP_RECOMMENDATIONS.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className={`sdt-rec ${priority.card} mb-3`} key={entry.id}>
                  <div className="d-flex align-items-start justify-content-between flex-wrap gap-2">
                    <p className="sdt-rec-title">{entry.title}</p>
                    <span className={`sdt-tag ${priority.tag}`}>{priority.band}</span>
                  </div>
                  <div className="sdt-rec-grid">
                    <span className="sdt-cell">
                      <span className="sdt-lbl">Confidence</span>
                      <span>{entry.confidence}%</span>
                    </span>
                    <span className="sdt-cell">
                      <span className="sdt-lbl">Expected</span>
                      <span>{entry.expected}</span>
                    </span>
                    <span className="sdt-cell">
                      <span className="sdt-lbl">Timeline</span>
                      <span>{entry.timeline}</span>
                    </span>
                    <span className="sdt-cell">
                      <span className="sdt-lbl">Owner</span>
                      <span>{entry.owner}</span>
                    </span>
                  </div>
                  <ActionLink
                    className="btn btn-sm btn-primary d-inline-flex align-items-center"
                    onClick={() => onOpenDialog(entry.modal)}
                  >
                    <i className="ti ti-bolt me-1" />
                    Apply
                  </ActionLink>
                </div>
              );
            })}
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Learning plan · weekly goals">
                {PLAN_WEEKS.map((week) => (
                  <Line key={week.span} label={week.span} value={week.work} />
                ))}
                <Line label="Target" value={`+${PLAN_TARGET_MARKS} marks by term end`} />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Teacher actions">
                {TEACHER_ACTIONS.map((action) => (
                  <Line key={action.label} label={action.label} value={action.value} />
                ))}
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Parent actions">
                {PARENT_ACTIONS.map((action) => (
                  <Line key={action.label} label={action.label} value={action.value} />
                ))}
              </Box>
            </div>
            <Box title="Mentoring & career guidance">
              <div className="d-flex flex-wrap gap-2">
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => onOpenDialog('assign_mentor')}
                >
                  <i className="ti ti-user-plus me-1" />
                  Assign mentor
                </ActionLink>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => onOpenDialog('student_summary')}
                >
                  <i className="ti ti-compass me-1" />
                  Career guidance
                </ActionLink>
              </div>
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Growth' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Box title="Progress timeline">
              {PROGRESS_LEGS.map((leg) => (
                <Line key={leg.id} label={leg.title} value={leg.on} />
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Completed goals">
                {COMPLETED_GOALS.map((goal) => (
                  <Line key={goal.label} label={goal.label} value={goal.value} />
                ))}
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Success indicators">
                <Line
                  label="Percentile movement"
                  value={`+${PERCENTILE_GROWTH} over ${TERMS_ON_RECORD} terms`}
                />
                <Line
                  label="Subjects improving"
                  value={`${SUBJECTS_IMPROVING} of ${SUBJECTS.length}`}
                />
                <Line
                  label="Signals stable or up"
                  value={`${SIGNALS_STEADY} of ${DIMENSIONS.length}`}
                />
                <Line label="Open concerns" value={OPEN_CONCERNS} />
              </Box>
            </div>
            <Box title="Future targets">
              <Line label="Close algebra gap" value="By term end" />
              <Line
                label="STEM scholarship"
                value={`Nomination in ${SCHOLARSHIP_WEEKS} weeks`}
              />
              <Line label="Leadership role" value="Next term" />
              <Line label="Overall percentile" value={ordinal(TARGET_PERCENTILE)} />
            </Box>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default StudentWorkspace;
