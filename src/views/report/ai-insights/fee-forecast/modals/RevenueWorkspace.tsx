import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import type { RevenueCase } from '../data/revenue.data';
import {
  bandOf,
  CASE_CONFIDENCE,
  CASE_CONFIDENCE_MEAN,
  countByPattern,
  daysOverdueOf,
  elapsedOf,
  journeyStops,
  money,
  OPEN_CASES,
  outstandingOf,
  probBarOf,
  RUN_DATE,
  windowOf,
} from '../data/revenue.data';

const STAGES = [
  { n: '01', name: 'Forecast' },
  { n: '02', name: 'Analysis' },
  { n: '03', name: 'Recommendations' },
  { n: '04', name: 'Collection Plan' },
  { n: '05', name: 'Recovery' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface RevenueWorkspaceProps {
  open: boolean;
  onClose: () => void;
  row: RevenueCase | null;
  onOpenDialog: (id: string) => void;
}

const Box = ({
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
  <div className={`rev-box ${className}`.trim()}>
    <div className="rev-box-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="rev-tag is-likely">{badge}</span> : null}
    </div>
    <div className="rev-box-body">{children}</div>
  </div>
);

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="rev-row">
    <span>{label}</span>
    <span className="rev-leader" />
    <b>{value}</b>
  </div>
);

const RevenueWorkspace = ({ open, onClose, row, onOpenDialog }: RevenueWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Forecast');

  useEffect(() => {
    if (open) setStage('Forecast');
  }, [open, row?.id]);

  if (!open || !row) return null;

  const band = bandOf(row.probability);
  const outstanding = outstandingOf(row);
  const overdue = daysOverdueOf(row);
  const elapsed = elapsedOf(row);
  const window = windowOf(row);

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={`${row.parent} · ${row.id}`}
      className="rev-ws"
      labelledById="revenue_workspace_label"
      header={
        <div className="rev-ws-head">
          <span className="avatar avatar-xl avatar-rounded flex-shrink-0">
            <ImageWithBasePath src={row.parentImage} alt={row.parent} />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="revenue_workspace_label">
              {row.parent} · {row.id}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {row.student} · {row.className} · Term 2 tuition · Raised {row.raisedOn}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className={`rev-tag ${band.tone}`}>{row.probability}% probability</span>
              <span className="rev-tag is-likely">
                <i className="ti ti-sparkles" />
                {row.confidence}% confidence
              </span>
              <span className="rev-tag is-watch">{row.pattern}</span>
            </div>
          </div>
          <div className="ms-auto text-end">
            <span className="rev-lbl">Outstanding</span>
            <span className="rev-amt is-lg">{money(outstanding)}</span>
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
      }
      beforeBody={
        <ul className="rev-steps nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`rev-step ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="rev-step-n">{entry.n}</span>
                <span className="rev-step-txt">
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
              Forecasts are estimates, not decisions. No reminder is sent, no fee waived and no
              balance adjusted without the bursar’s approval.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_revenue')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('instalment_plan')}
              >
                <i className="ti ti-layout-rows me-1" />
                Offer Instalment Plan
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('generate_reminder')}
              >
                <i className="ti ti-bell me-1" />
                Generate Reminder
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Forecast' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Box title="Invoice">
              <Row label="Case" value={row.id} />
              <Row label="Raised" value={row.raisedOn} />
              <Row label="Due" value={row.dueOn} />
              <Row label="Amount" value={money(row.billed)} />
              <Row label="Paid to date" value={money(row.paid)} />
              <Row label="Outstanding" value={money(outstanding)} />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Forecast" badge={row.probability >= 70 ? 'On track' : 'At risk'}>
              <Row label="Predicted payment" value={row.predictedOn ?? 'Uncertain'} />
              <Row label="Probability" value={`${row.probability}%`} />
              <Row label="Band" value={band.band} />
              <Row label="Days overdue today" value={overdue > 0 ? overdue : 'Not yet due'} />
              <Row label="Pattern" value={row.pattern} />
              <Row
                label="Escalation advised"
                value={row.probability < 50 && overdue > 30 ? 'Review first' : 'No'}
              />
            </Box>
          </div>
          <div className="col-12 col-xl-4">
            <Box title="Probability range" badge={`${row.probability}%`}>
              <span className={`rev-prob ${band.tone}`}>
                {probBarOf(row.probability).map((state, index) => (
                  <i className={state} key={`prob-${index}`} />
                ))}
              </span>
              <div className="d-flex justify-content-between fs-11 text-muted mt-2">
                <span>Today</span>
                <span>{row.predictedOn?.split(' ').slice(0, 2).join(' ') ?? '—'}</span>
              </div>
              <p className="fs-12 text-muted mb-0 mt-3">
                {row.predictedOn
                  ? `Expected ${row.predictedOn}. This account has never fallen outside its window in ${row.termsOnRecord} terms.`
                  : 'No settlement date can be forecast from this account’s history.'}
              </p>
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Analysis' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Payment behaviour">
                <Row label="Pattern" value={row.pattern} />
                <Row label="Behaviour on record" value={row.behaviour} />
                <Row label="Median days after reminder" value="6" />
                <Row label="Second reminders needed" value="0" />
                <Row label="Preferred channel" value="WhatsApp" />
              </Box>
            </div>
            <Box title="Collection history">
              <Row label="Terms on record" value={row.termsOnRecord} />
              <Row
                label="Paid in full"
                value={`${row.termsPaidInFull} of ${row.termsOnRecord}`}
              />
              <Row label="Paid on time" value={`1 of ${row.termsOnRecord}`} />
              <Row label="Average days late" value="14" />
              <Row label="Written off" value={money(0)} />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Due analysis" badge="Timing">
                <Row label="Term-start dip window" value="Yes · weeks 1–3" />
                <Row label="Falls inside seasonal pattern" value="Yes" />
                <Row label="Comparable accounts overdue" value={`61 of ${OPEN_CASES}`} />
                <Row
                  label="True risk contribution"
                  value={money(row.termsPaidInFull === row.termsOnRecord ? 0 : outstanding)}
                />
                <Row label="Recommended threshold" value="Day 30, not day 14" />
              </Box>
            </div>
            <Box title="AI confidence" badge={`Mean ${CASE_CONFIDENCE_MEAN}%`}>
              {CASE_CONFIDENCE.map((entry) => (
                <Row key={entry.label} label={entry.label} value={`${entry.value}%`} />
              ))}
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Recommendations' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Revenue opportunities" badge="Act">
                <Row label="Reminder now" value={money(outstanding)} />
                <Row
                  label="Earlier by"
                  value={window !== null ? `${window - elapsed} days` : '—'}
                />
                <Row label="Cost to send" value={money(0)} />
                <Row label="Goodwill cost" value="None" />
              </Box>
            </div>
            <Box title="Collection risks" badge={band.band}>
              <Row
                label="Default risk"
                value={row.termsPaidInFull === row.termsOnRecord ? 'Negligible' : 'Material'}
              />
              <Row label="Escalation risk" value="Goodwill only" />
              <Row label="Late fee risk" value="Would be first" />
              <Row label="Dispute history" value="None" />
            </Box>
          </div>
          <div className="col-12 col-xl-6">
            <div className="mb-4">
              <Box title="Similar payment profiles">
                <Row
                  label={`${row.pattern} accounts`}
                  value={`31 of ${OPEN_CASES}`}
                />
                <Row label="Median settlement" value="6 days" />
                <Row label="Success rate" value="97%" />
                <Row label="Ever escalated" value="2, both in error" />
                <Row
                  label="On this roster"
                  value={`${countByPattern(row.pattern)} sharing the pattern`}
                />
              </Box>
            </div>
            <Box title="Supporting evidence">
              <Row label="Terms analysed" value={row.termsOnRecord} />
              <Row label="Payments on record" value="11" />
              <Row label="Reminders sent" value={row.termsOnRecord} />
              <Row label="Responses within 6 days" value={row.termsPaidInFull} />
              <Row label="Comparison cohort" value={`${OPEN_CASES} cases`} />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Collection Plan' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <div className="mb-4">
              <Box title="Reminder strategy" badge="Drafted">
                <p className="fs-13 text-muted mb-3">{row.strategy}</p>
                <Row label="Channel" value="WhatsApp" />
                <Row label="Send on" value={RUN_DATE} />
                <Row label="Second reminder" value="Not scheduled" />
                <Row label="Late fee" value="Waived" />
                <Row label="Approver" value="Bursar" />
              </Box>
            </div>
            <Box title="Recovery timeline">
              {journeyStops(row)
                .filter((stop) => stop.state !== 'is-done')
                .map((stop) => (
                  <Row key={stop.id} label={stop.title} value={stop.on} />
                ))}
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Instalment plan" badge="Not advised">
                <Row label="Recommended" value={row.probability >= 70 ? 'No' : 'Yes'} />
                <Row label="Reason" value="Settles in full" />
                <Row label="Would delay by" value="18 days" />
                <Row label="Available if requested" value="Yes" />
                <Row label="Typical split" value="3 parts" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Parent communication">
                <Row label="Last contact" value={row.dueOn} />
                <Row label="Opened" value="No" />
                <Row label="Preferred channel" value="WhatsApp" />
                <Row label="Best time" value="Evenings" />
                <Row label="Tone" value="Friendly, brief" />
              </Box>
            </div>
            <Box title="Finance notes">
              <Row label="Bursar" value="“Do not escalate this one”" />
              <Row label="Prior errors" value="0" />
              <Row label="Hardship indicators" value="None" />
              <Row label="Next review" value={row.predictedOn ?? 'Pending'} />
            </Box>
          </div>
        </div>
      ) : null}

      {stage === 'Recovery' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-7">
            <Box title="Revenue timeline">
              {journeyStops(row).map((stop) => (
                <div className={`rev-stop ${stop.state}`.trim()} key={stop.id}>
                  <div className="flex-fill overflow-hidden">
                    <p className="rev-stop-title">{stop.title}</p>
                    <p className="fs-13 text-muted mb-0">{stop.note}</p>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <span className="d-block fs-12 text-muted">{stop.on}</span>
                    <span className="rev-amt">
                      {stop.amount === null ? '—' : money(stop.amount)}
                    </span>
                  </div>
                </div>
              ))}
            </Box>
          </div>
          <div className="col-12 col-xl-5">
            <div className="mb-4">
              <Box title="Collection progress" badge={row.probability >= 70 ? 'On track' : 'Slow'}>
                <Row label="Stage" value="Parent contact" />
                <Row
                  label="Days elapsed"
                  value={window !== null ? `${elapsed} of ${window}` : String(elapsed)}
                />
                <Row label="Reminder approved" value="Yes" />
                <Row label="On forecast" value="Yes" />
              </Box>
            </div>
            <div className="mb-4">
              <Box title="Outstanding balance">
                <Row label="Tuition" value={money(row.billed)} />
                <Row label="Transport" value={money(0)} />
                <Row label="Cafeteria" value={money(0)} />
                <Row label="Late fees" value={`${money(0)} · waived`} />
                <Row label="Total" value={money(outstanding)} />
              </Box>
            </div>
            <Box title="Success indicators" badge="Strong">
              <Row
                label="Settled within window"
                value={`${row.termsPaidInFull} of ${row.termsOnRecord} terms`}
              />
              <Row label="Escalations needed" value="None" />
              <Row label="Forecast accuracy here" value="100%" />
              <Row label="Relationship intact" value="Yes" />
            </Box>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default RevenueWorkspace;
