import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { RiskCase } from '../data/risk.data';
import {
  bandOf,
  bandTint,
  CLOSURE_THRESHOLD,
  daysBetween,
  isCloseableOf,
  liveScoreOf,
  recoveryPctOf,
  reviewMovementsOf,
  scoreMovementOf,
  statusTint,
} from '../data/risk.data';

export interface CaseWorkspaceProps {
  open: boolean;
  onClose: () => void;
  row: RiskCase | null;
  onDecide: (caseId: string, recommendationId: string, decision: 'Applied' | 'Dismissed') => void;
  onOpenDialog: (id: string) => void;
}

const STAGES = ['Detect', 'Understand', 'Decide', 'Act', 'Track'] as const;
type Stage = (typeof STAGES)[number];

const Facts = ({ items }: { items: { label: string; value: React.ReactNode }[] }) => (
  <ul className="list-unstyled fs-13 mb-0">
    {items.map((item) => (
      <li className="d-flex align-items-center justify-content-between py-1" key={item.label}>
        <span className="text-muted">{item.label}</span>
        <span className="fw-medium text-end">{item.value}</span>
      </li>
    ))}
  </ul>
);

const SectionHead = ({
  eyebrow,
  title,
  note,
  badge,
}: {
  eyebrow: string;
  title: string;
  note: string;
  badge?: string;
}) => (
  <div className="d-flex align-items-start justify-content-between flex-wrap gap-2 mb-3">
    <div>
      <span className="fs-12 text-muted text-uppercase fw-semibold">{eyebrow}</span>
      <h6 className="fs-15 mb-0">{title}</h6>
      <span className="fs-12 text-muted">{note}</span>
    </div>
    {badge ? <span className="badge badge-soft-primary">{badge}</span> : null}
  </div>
);

const actionTint: Record<string, string> = {
  Assigned: 'success',
  Required: 'danger',
  Pending: 'warning',
  'In progress': 'info',
  'Not needed': 'secondary',
  Review: 'warning',
};

const CaseWorkspace = ({ open, onClose, row, onDecide, onOpenDialog }: CaseWorkspaceProps) => {
  const [stage, setStage] = useState<Stage>('Detect');

  /* Every case opens on Detect, as the template's rail does. */
  useEffect(() => {
    if (open) setStage('Detect');
  }, [open, row?.id]);

  if (!row) return null;

  const live = liveScoreOf(row);
  const moved = scoreMovementOf(row);
  const recovery = recoveryPctOf(row);
  const reviews = reviewMovementsOf(row);
  const openRecommendations = row.recommendations.filter((item) => !item.decision);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={`Case ${row.id}`}
      className="offcanvas-xl"
      titleAccessory={
        <span className="fs-12 text-muted">
          {row.student} · {row.className} · {row.studentId}
        </span>
      }
      footer={
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <span className="fs-12 text-muted">
            <i className="ti ti-info-circle me-1" />
            Advisory only — every action needs a human decision
          </span>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white"
              onClick={() => onOpenDialog('generate_parent_summary')}
            >
              <i className="ti ti-mail me-1" />
              Parent Summary
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              disabled={!isCloseableOf(row)}
              onClick={() => onOpenDialog('close_case')}
            >
              <i className="ti ti-circle-check me-1" />
              Close Case
            </button>
          </div>
        </div>
      }
    >
      {/* ------------------------------- Case header ------------------------- */}
      <div className="d-flex align-items-center gap-3 border rounded p-3 mb-3">
        <span className="avatar avatar-lg rounded flex-shrink-0">
          <ImageWithBasePath src={row.image} alt={row.student} className="rounded" />
        </span>
        <div className="flex-fill">
          <h6 className="fs-15 mb-0">{row.student}</h6>
          <span className="fs-12 text-muted">
            {row.className} · {row.studentId}
          </span>
        </div>
        <div className="text-end">
          <span className={`badge badge-soft-${bandTint[bandOf(row)]}`}>{bandOf(row)}</span>
          <span className="fs-12 text-muted d-block mt-1">{row.confidence}% confident</span>
        </div>
      </div>

      <div className="row g-2 text-center mb-3">
        {[
          {
            label: 'Risk score',
            value: moved > 0 ? `${live} from ${row.score}` : `${live}`,
          },
          { label: 'Status', value: row.status },
          { label: 'Days open', value: `${row.daysOpen}` },
          { label: 'Next review', value: row.nextReview.replace(' 2026', '') },
        ].map((item) => (
          <div className="col-6 col-md-3" key={item.label}>
            <div className="border rounded py-2">
              <h6 className="fs-15 mb-0">{item.value}</h6>
              <span className="fs-12 text-muted">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------------- Rail ------------------------------ */}
      <div className="custom-btn-group custom-btn-group-fill custom-btn-group-sm w-100 mb-3" role="group">
        {STAGES.map((name, index) => (
          <span key={name}>
            <input
              type="radio"
              className="btn-check"
              name="rsk-stage"
              id={`rsk-stage-${name}`}
              checked={stage === name}
              onChange={() => setStage(name)}
            />
            <label className="btn" htmlFor={`rsk-stage-${name}`}>
              <span className="d-none d-lg-inline">Stage 0{index + 1} </span>
              {name}
            </label>
          </span>
        ))}
      </div>

      {/* ------------------------------ Stage 01 ----------------------------- */}
      {stage === 'Detect' ? (
        <>
          <SectionHead
            eyebrow="Stage 01 · Detect"
            title="Case Summary"
            note="What the engine detected, and the evidence behind it"
            badge={`${row.confidence}% confident`}
          />
          <div className="border rounded p-3 mb-3">
            <Facts
              items={[
                { label: 'Case opened', value: `${row.openedOn} · 06:15` },
                { label: 'Detected by', value: 'Nightly analysis run' },
                { label: 'Risk band', value: bandOf(row) },
                { label: 'Primary risk', value: row.primaryRisk },
                { label: 'Days open', value: `${row.daysOpen}` },
                { label: 'Review due', value: row.nextReview },
              ]}
            />
          </div>

          <h6 className="fs-14 mb-2">
            Signal Snapshot
            <span className="fs-12 text-muted ms-2">{row.signals.length} groups</span>
          </h6>
          <ul className="list-unstyled mb-0">
            {row.signals.map((signal) => (
              <li
                className="d-flex align-items-center justify-content-between border rounded px-2 py-2 mb-2"
                key={signal.group}
              >
                <span className="fs-13">
                  <i
                    className={`ti ${signal.clean ? 'ti-circle-check text-success' : 'ti-alert-triangle text-warning'} me-2`}
                  />
                  {signal.group}
                </span>
                <span className="fs-13 fw-medium">{signal.reading}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* ------------------------------ Stage 02 ----------------------------- */}
      {stage === 'Understand' ? (
        <>
          <SectionHead
            eyebrow="Stage 02 · Understand"
            title="Explainable AI"
            note="The reasoning, signals and evidence behind this score"
            badge={`${row.confidence}% confident`}
          />

          <div className="border rounded p-3 mb-3">
            <span className="fs-12 text-muted text-uppercase fw-semibold">AI Observation</span>
            <h6 className="fs-14 mb-1">{row.observation}</h6>
            <span className="fs-12 text-muted">Detected {row.observationDate}</span>
          </div>

          <h6 className="fs-14 mb-2">AI Reasoning</h6>
          <p className="fs-13 text-muted mb-3">{row.reasoning}</p>

          <h6 className="fs-14 mb-2">Supporting Signals</h6>
          <div className="row g-2 mb-3">
            {row.supportingSignals.map((signal) => (
              <div className="col-6" key={signal.label}>
                <div className="border rounded p-2">
                  <span className="fs-12 text-muted d-block">{signal.label}</span>
                  <span className="fs-14 fw-semibold">{signal.value}</span>
                </div>
              </div>
            ))}
          </div>

          <h6 className="fs-14 mb-2">Detection Timeline</h6>
          <ul className="list-unstyled mb-3">
            {row.detection.map((entry) => (
              <li className="d-flex align-items-start gap-2 border rounded p-2 mb-2" key={entry.title}>
                <span className="avatar avatar-sm bg-primary-transparent text-primary rounded flex-shrink-0">
                  <i className="ti ti-point" />
                </span>
                <div>
                  <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                  <span className="fs-12 text-muted d-block">{entry.date}</span>
                  <span className="fs-12 text-muted">{entry.note}</span>
                </div>
              </li>
            ))}
          </ul>

          <h6 className="fs-14 mb-2">
            Evidence Used
            <span className="fs-12 text-muted ms-2">{row.evidence.length} sources</span>
          </h6>
          <Facts items={row.evidence.map((item) => ({ label: item.source, value: item.scope }))} />

          <h6 className="fs-14 mb-2 mt-3">Related Cases</h6>
          <ul className="list-unstyled mb-0">
            {row.related.map((related) => (
              <li
                className="d-flex align-items-center justify-content-between border rounded px-2 py-2 mb-2"
                key={related.name}
              >
                <div>
                  <h6 className="fs-13 mb-0 fw-medium">
                    {related.name} · {related.className}
                  </h6>
                  <span className="fs-12 text-muted">{related.note}</span>
                </div>
                <span className="badge badge-soft-info">{related.match}% match</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* ------------------------------ Stage 03 ----------------------------- */}
      {stage === 'Decide' ? (
        <>
          <SectionHead
            eyebrow="Stage 03 · Decide"
            title="AI Recommendations"
            note="Ranked by expected outcome, with the decisions already taken"
            badge={`${openRecommendations.length} open`}
          />

          {row.recommendations.map((recommendation) => (
            <div className="border rounded p-3 mb-2" key={recommendation.id}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1">
                <h6 className="fs-14 mb-0">
                  {recommendation.title}
                  <span
                    className={`badge badge-soft-${
                      recommendation.urgency === 'Urgent'
                        ? 'danger'
                        : recommendation.urgency === 'High'
                          ? 'warning'
                          : 'info'
                    } ms-2`}
                  >
                    {recommendation.urgency}
                  </span>
                </h6>
                <span className="fs-13 fw-semibold">{recommendation.confidence}</span>
              </div>
              <p className="fs-12 text-muted mb-2">{recommendation.reasoning}</p>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <span className="fs-12 text-muted">
                  {recommendation.outcome} · {recommendation.timeline}
                </span>
                {recommendation.decision ? (
                  <span
                    className={`badge badge-soft-${recommendation.decision === 'Applied' ? 'success' : 'secondary'}`}
                  >
                    {recommendation.decision}
                  </span>
                ) : (
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light bg-white"
                      onClick={() => onDecide(row.id, recommendation.id, 'Dismissed')}
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => onDecide(row.id, recommendation.id, 'Applied')}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <h6 className="fs-14 mb-2 mt-3">
            Decision History
            <span className="fs-12 text-muted ms-2">{row.decisions.length} decisions</span>
          </h6>
          <ul className="list-unstyled mb-0">
            {row.decisions.map((decision) => (
              <li className="border rounded p-2 mb-2" key={decision.title}>
                <h6 className="fs-13 mb-0 fw-medium">{decision.title}</h6>
                <span className="fs-12 text-muted d-block">
                  {decision.date} · {decision.by}
                </span>
                <span className="fs-12 text-muted">{decision.note}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* ------------------------------ Stage 04 ----------------------------- */}
      {stage === 'Act' ? (
        <>
          <SectionHead
            eyebrow="Stage 04 · Act"
            title="Intervention Actions"
            note="Everything available on this case, and where each one stands"
            badge={`${row.actions.filter((a) => a.state === 'In progress').length} in progress`}
          />
          <ul className="list-unstyled mb-0">
            {row.actions.map((action) => (
              <li
                className="d-flex align-items-center justify-content-between border rounded px-2 py-2 mb-2"
                key={action.id}
              >
                <div>
                  <h6 className="fs-13 mb-0 fw-medium">{action.title}</h6>
                  <span className="fs-12 text-muted">{action.note}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className={`badge badge-soft-${actionTint[action.state]}`}>{action.state}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light bg-white"
                    onClick={() => onOpenDialog(dialogFor(action.id))}
                  >
                    Open
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {/* ------------------------------ Stage 05 ----------------------------- */}
      {stage === 'Track' ? (
        <>
          <SectionHead
            eyebrow="Stage 05 · Track"
            title="Progress &amp; Audit"
            note="Recovery, reviews and every write to the record"
            badge={row.status}
          />

          <div className="border rounded p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <span className="fs-12 text-muted">Current status</span>
              <span className={`badge badge-soft-${statusTint[row.status]}`}>{row.status}</span>
            </div>
            {recovery === null ? null : (
              <>
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <span className="fs-13 fw-semibold">{recovery}%</span>
                  <span className="fs-12 text-muted">
                    {moved > 0
                      ? `Score fell from ${row.score} to ${live} across ${row.reviews.length} weekly reviews`
                      : `Held at ${live} across ${row.reviews.length} weekly ${row.reviews.length === 1 ? 'review' : 'reviews'}`}
                  </span>
                </div>
                <div className="meter meter-success">
                  <span style={{ width: `${recovery}%` }} />
                </div>
              </>
            )}
            <div className="mt-3">
              <Facts
                items={[
                  { label: 'Success probability', value: `${row.successProbability ?? '—'}%` },
                  { label: 'Days open', value: `${row.daysOpen}` },
                  { label: 'Next review', value: row.nextReview },
                  { label: 'Projected closure', value: row.projectedClosure ?? '—' },
                  {
                    label: 'Plan length',
                    value: row.projectedClosure
                      ? `${daysBetween(row.openedOn, row.projectedClosure)} days`
                      : '—',
                  },
                ]}
              />
            </div>
          </div>

          <h6 className="fs-14 mb-2">Progress Timeline</h6>
          <ul className="list-unstyled mb-3">
            {row.progress.map((entry) => (
              <li className="d-flex align-items-start gap-2 border rounded p-2 mb-2" key={entry.title}>
                <span className="avatar avatar-sm bg-success-transparent text-success rounded flex-shrink-0">
                  <i className="ti ti-check" />
                </span>
                <div>
                  <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                  <span className="fs-12 text-muted d-block">{entry.date}</span>
                  <span className="fs-12 text-muted">{entry.note}</span>
                </div>
              </li>
            ))}
            <li className="d-flex align-items-start gap-2 border rounded p-2 mb-2">
              <span className="avatar avatar-sm bg-secondary-transparent text-secondary rounded flex-shrink-0">
                <i className="ti ti-flag" />
              </span>
              <div>
                <h6 className="fs-13 mb-0 fw-medium">Case closure</h6>
                <span className="fs-12 text-muted d-block">Expected {row.projectedClosure ?? '—'}</span>
                <span className="fs-12 text-muted">
                  Closes once the score holds below {CLOSURE_THRESHOLD} for two reviews.
                </span>
              </div>
            </li>
          </ul>

          <h6 className="fs-14 mb-2">Weekly Reviews</h6>
          <div className="table-responsive border rounded mb-3">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Review</th>
                  <th>Date</th>
                  <th className="text-center">Score</th>
                  <th>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.week}>
                    <td className="fs-13">Week {review.week}</td>
                    <td className="fs-12 text-muted">{review.date}</td>
                    <td className="text-center fs-13">
                      {review.from === review.to ? review.to : `${review.from} to ${review.to}`}
                    </td>
                    <td>
                      <span
                        className={`badge badge-soft-${
                          review.verdict === 'On track' ? 'success' : review.verdict === 'Slow' ? 'warning' : 'danger'
                        }`}
                      >
                        {review.verdict}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h6 className="fs-14 mb-2">
            Completed Actions
            <span className="fs-12 text-muted ms-2">{row.completed.length} done</span>
          </h6>
          <ul className="list-unstyled fs-13 mb-3">
            {row.completed.map((entry) => (
              <li className="d-flex align-items-center justify-content-between py-1" key={entry.title}>
                <span>
                  <i className="ti ti-circle-check text-success me-2" />
                  {entry.title}
                </span>
                <span className="text-muted">{entry.date}</span>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center justify-content-between mb-2">
            <h6 className="fs-14 mb-0">Audit Trail</h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-light bg-white"
              onClick={() => onOpenDialog('add_case_note')}
            >
              <i className="ti ti-plus me-1" />
              Add note
            </button>
          </div>
          <ul className="list-unstyled mb-0">
            {row.audit.map((entry) => (
              <li className="border rounded p-2 mb-2" key={`${entry.title}-${entry.date}`}>
                <h6 className="fs-13 mb-0 fw-medium">{entry.title}</h6>
                <span className="fs-12 text-muted">
                  {entry.date} · {entry.by}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Offcanvas>
  );
};

/** Which dialog an intervention action opens. */
function dialogFor(actionId: string) {
  switch (actionId) {
    case 'teacher':
      return 'assign_teacher';
    case 'counselor':
      return 'assign_counselor';
    case 'meeting':
      return 'schedule_meeting';
    case 'plan':
      return 'create_intervention';
    default:
      return 'create_intervention';
  }
}

export default CaseWorkspace;
