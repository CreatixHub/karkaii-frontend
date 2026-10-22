import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { AttendanceCase } from '../data/attendance.data';
import {
  bandOf,
  bandPill,
  belowThresholdWeekOf,
  caseAgeOf,
  caseRecommendationsOf,
  completedOf,
  decisionsOf,
  patternsOf,
  planNowOf,
  planRecoveryOf,
  reasoningOf,
  RECOVER_ACTIONS,
  SIGNAL_COUNT,
  STATUTORY_THRESHOLD,
  supportingSignalsOf,
  thresholdStatusOf,
  weekAxisOf,
} from '../data/attendance.data';

const STAGES = [
  { n: '01', name: 'Detect' },
  { n: '02', name: 'Understand' },
  { n: '03', name: 'Recommend' },
  { n: '04', name: 'Recover' },
  { n: '05', name: 'Track' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface AttendanceWorkspaceProps {
  open: boolean;
  onClose: () => void;
  row: AttendanceCase | null;
  onOpenDialog: (id: string) => void;
}

const Panel = ({
  title,
  badge,
  className = '',
  bodyClassName = '',
  children,
}: {
  title: string;
  badge?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) => (
  <div className={`atn-panel ${className}`.trim()}>
    <div className="atn-panel-head">
      <h6>{title}</h6>
      {badge}
    </div>
    <div className={`atn-panel-body ${bodyClassName}`.trim()}>{children}</div>
  </div>
);

const Check = ({
  icon,
  title,
  note,
  done = true,
}: {
  icon?: string;
  title: string;
  note: string;
  done?: boolean;
}) => (
  <div className={`atn-check ${done ? '' : 'is-pending'}`.trim()}>
    <i className={icon ?? (done ? 'ti ti-circle-check' : 'ti ti-circle-dashed')} />
    <span className="flex-fill">
      <span className="d-block fw-medium">{title}</span>
      <span className="d-block fs-12 text-muted">{note}</span>
    </span>
  </div>
);

const Fig = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <span className="atn-fig">
    <span>{label}</span>
    <span>{value}</span>
  </span>
);

const AttendanceWorkspace = ({ open, onClose, row, onOpenDialog }: AttendanceWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Detect');

  useEffect(() => {
    if (open) setStage('Detect');
  }, [open, row?.id]);

  if (!open || !row) return null;

  const band = bandOf(row.predicted);
  const reasoning = reasoningOf(row);
  const patterns = patternsOf(row);
  const signals = supportingSignalsOf(row);
  const recommendations = caseRecommendationsOf(row);
  const decisions = decisionsOf(row);
  const completed = completedOf(row);
  const plan = row.plan;
  const recovery = planRecoveryOf(row);
  const now = planNowOf(row);
  const axis = weekAxisOf(row);
  const belowFrom = belowThresholdWeekOf(row);
  const threshold = thresholdStatusOf(row);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={row.student}
      className="atn-ws"
      labelledById="attendance_workspace_label"
      header={
        <div className="atn-ws-head">
          <div className="d-flex align-items-center gap-3">
            <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
              <ImageWithBasePath src={row.studentImage} alt={row.student} />
            </span>
            <div>
              <h3 className="mb-1 fs-16 fw-medium" id="attendance_workspace_label">
                {row.student}
              </h3>
              <p className="fs-12 text-muted mb-2">
                {row.className} · {row.id} · {row.teacher}
              </p>
              <div className="d-flex flex-wrap gap-2">
                <span className={`atn-pill ${bandPill(band)}`}>
                  <i className="ti ti-alert-triangle" />
                  {band}
                </span>
                <span className="atn-pill is-ai">
                  <i className="ti ti-sparkles" />
                  {row.confidence}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="atn-ws-figs">
            <Fig label="Current" value={`${row.current}%`} />
            <Fig label="Predicted" value={`${row.predicted}%`} />
            <Fig label="Target" value={`${plan?.target ?? STATUTORY_THRESHOLD}%`} />
            <Fig label="Case age" value={`${caseAgeOf(row)} days`} />
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
        <ul className="atn-steps nav" role="tablist">
          {STAGES.map((entry, index) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`atn-step ${stage === entry.name ? 'active' : ''} ${
                  index === STAGES.length - 1 ? 'is-last' : ''
                }`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="atn-step-n">{entry.n}</span>
                <span className="atn-step-txt">
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
              AI predictions support your judgement. No message is sent and no case changes state
              without approval.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('parent_letter')}
              >
                <i className="ti ti-mail-star me-1" />
                Parent Letter
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_summary')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('attendance_reward')}
              >
                <i className="ti ti-award me-1" />
                Close as Recovered
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Detect' ? (
        <>
          <div className="atn-alert mb-4">
            <span className="atn-alert-ic">
              <i className="ti ti-radar" />
            </span>
            <div className="flex-fill">
              <p className="fs-14 fw-medium text-dark mb-1">
                Detected {row.openedOn} at 09:15 by the nightly run
              </p>
              <p className="fs-13 text-muted mb-0">
                Attendance crossed below {STATUTORY_THRESHOLD}% for the first time this term. The
                engine predicted {row.predicted}% at {row.confidence}% confidence and opened this
                case automatically.
              </p>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-12 col-lg-8">
              <Panel
                title={`Attendance history · ${row.weekly.length} weeks`}
                badge={
                  belowFrom ? (
                    <span className={`atn-pill ${bandPill(band)}`}>
                      Below threshold from week {belowFrom}
                    </span>
                  ) : (
                    <span className="atn-pill is-good">Above threshold throughout</span>
                  )
                }
              >
                <div className="atn-cols">
                  {row.weekly.map((reading, index) => (
                    <i
                      key={`${row.id}-wk-${row.weekFrom + index}`}
                      className={`aix-p-${Math.round(reading)} ${
                        reading < STATUTORY_THRESHOLD ? 'is-low' : ''
                      }`.trim()}
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-between fs-11 text-muted mt-2">
                  {axis.map((week) => (
                    <span key={week}>Wk {week}</span>
                  ))}
                </div>
              </Panel>
            </div>
            <div className="col-12 col-lg-4">
              <Panel title="Prediction summary" bodyClassName="d-flex flex-column gap-3">
                <Fig label="Predicted term end" value={`${row.predicted}%`} />
                <Fig label={threshold.label} value={threshold.value} />
                <Fig
                  label="Signals contributing"
                  value={`${reasoning.length} of ${SIGNAL_COUNT}`}
                />
                <div>
                  <span className="atn-lbl mb-1">AI confidence</span>
                  <span className={`atn-conf aix-p-${row.confidence} w-100`}>
                    <b>{row.confidence}%</b>
                  </span>
                </div>
              </Panel>
            </div>
          </div>
        </>
      ) : null}

      {stage === 'Understand' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Panel
              title="Explainable AI · reasoning chain"
              badge={
                <span className="atn-pill is-ai">
                  <i className="ti ti-sparkles" />
                  {reasoning.length} links
                </span>
              }
            >
              <div className="atn-spine">
                {reasoning.map((node) => (
                  <div className={`atn-node ${bandPill(node.band)}`} key={node.id}>
                    <p className="atn-node-obs fs-14">
                      <i className={`${node.icon} me-2 text-muted`} />
                      {node.observation}
                    </p>
                    <p className="atn-node-why mb-0">{node.why}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
          <div className="col-12 col-xl-5">
            <Panel title="Attendance patterns" className="mb-4">
              {patterns.map((pattern) => (
                <Check
                  key={pattern.title}
                  icon={pattern.icon}
                  title={pattern.title}
                  note={pattern.note}
                />
              ))}
            </Panel>
            <Panel title="Supporting signals">
              <div className="atn-sigs">
                {signals.map((signal) => (
                  <span key={signal.text}>
                    <i className={signal.icon} />
                    {signal.text}
                  </span>
                ))}
              </div>
              <div className="mt-3">
                <span className="atn-lbl mb-1">AI confidence</span>
                <span className={`atn-conf aix-p-${row.confidence} w-100`}>
                  <b>{row.confidence}%</b>
                </span>
              </div>
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Recommend' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Panel
              title="AI recommendations"
              badge={
                <span className="atn-pill is-ai">
                  <i className="ti ti-sparkles" />
                  Ranked by expected gain
                </span>
              }
            >
              {recommendations.map((entry, index) => (
                <div className="atn-rec mb-3" key={entry.id}>
                  <span className="atn-rec-rank">{String(index + 1).padStart(2, '0')}</span>
                  <div className="flex-fill overflow-hidden">
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <p className="atn-rec-title">{entry.title}</p>
                      <span className={`atn-pill ${bandPill(entry.band)}`}>{entry.band}</span>
                    </div>
                    <p className="fs-12 text-muted mb-0">{entry.note}</p>
                    <div className="atn-rec-meta">
                      <span>
                        Confidence <b>{entry.confidence}%</b>
                      </span>
                      <span>
                        Expected <b>+{entry.gain} pts</b>
                      </span>
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white mt-3 d-inline-flex align-items-center"
                      onClick={() => onOpenDialog(entry.modal)}
                    >
                      <i className="ti ti-bolt me-1" />
                      Apply
                    </ActionLink>
                  </div>
                </div>
              ))}
            </Panel>
          </div>
          <div className="col-12 col-xl-5">
            <Panel title="Similar cases" className="mb-4">
              {(row.similar ?? []).map((entry) => (
                <Check
                  key={entry.name}
                  title={`${entry.name} · ${entry.className}`}
                  note={entry.note}
                  done={entry.done}
                />
              ))}
            </Panel>
            <Panel title="Decision history">
              {decisions.map((entry) => (
                <Check key={entry.title} title={entry.title} note={entry.note} done={entry.done} />
              ))}
            </Panel>
          </div>
        </div>
      ) : null}

      {stage === 'Recover' ? (
        <>
          <div className="atn-alert mb-4">
            <span className="atn-alert-ic">
              <i className="ti ti-route" />
            </span>
            <div className="flex-fill">
              <p className="fs-14 fw-medium text-dark mb-1">
                {plan
                  ? `Recovery plan is active, week ${plan.weekly.length} of ${plan.weeks}`
                  : 'No recovery plan is open on this case'}
              </p>
              <p className="fs-13 text-muted mb-0">
                Every action below is written to the student record and to the audit timeline.
                Nothing is sent without approval.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {RECOVER_ACTIONS.map((action) => (
              <div className="col-md-4 col-sm-6" key={action.title}>
                <ActionLink className="atn-launch" onClick={() => onOpenDialog(action.modal)}>
                  <span className="atn-launch-ic">
                    <i className={action.icon} />
                  </span>
                  <p className="atn-launch-title">{action.title}</p>
                  <p className="fs-12 text-muted mb-0 position-relative">{action.note}</p>
                </ActionLink>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {stage === 'Track' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <Panel
              title="Weekly progress"
              className="mb-4"
              badge={
                <span className="atn-pill is-good">
                  <i className="ti ti-trending-up" />
                  Recovering
                </span>
              }
            >
              <div className="row g-4">
                <div className="col-sm-4">
                  <Fig label="Recovery" value={`${recovery ?? 0}%`} />
                  <span className={`atn-conf aix-p-${recovery ?? 0} w-100 mt-2`}>
                    <b>
                      Week {plan?.weekly.length ?? 0} of {plan?.weeks ?? 0}
                    </b>
                  </span>
                </div>
                <div className="col-sm-4">
                  <Fig label="Attendance now" value={`${now}%`} />
                  <span className={`atn-conf aix-p-${now} w-100 mt-2`}>
                    <b>Target {plan?.target ?? STATUTORY_THRESHOLD}%</b>
                  </span>
                </div>
                <div className="col-sm-4">
                  <Fig label="Success probability" value={`${row.successProbability ?? 0}%`} />
                  <span className={`atn-conf aix-p-${row.successProbability ?? 0} w-100 mt-2`}>
                    <b>AI estimate</b>
                  </span>
                </div>
              </div>
            </Panel>
            <Panel title="Audit timeline">
              {(plan?.weekly ?? []).map((week) => (
                <Check
                  key={week.week}
                  title={`Week ${week.week} · ${week.reading}%`}
                  note={week.note}
                />
              ))}
            </Panel>
          </div>
          <div className="col-12 col-xl-4">
            <Panel title="Completed actions">
              {completed.map((entry) => (
                <Check key={entry.title} title={entry.title} note={entry.note} done={entry.done} />
              ))}
            </Panel>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default AttendanceWorkspace;
