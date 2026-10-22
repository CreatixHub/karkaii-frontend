import { useEffect, useState } from 'react';
import Offcanvas from '@components/ui/Offcanvas';
import { ActionLink } from '@components/workspace';
import type { Draft } from '../data/reports.data';
import {
  ageOf,
  lifecycleSteps,
  MINUTES_BY_HAND,
  MINUTES_TO_REVIEW,
  QUEUE_CONFIDENCE,
  stateToneOf,
  templateOf,
} from '../data/reports.data';

const STAGES = [
  { n: '01', name: 'Brief' },
  { n: '02', name: 'Sources' },
  { n: '03', name: 'Draft' },
  { n: '04', name: 'Review' },
  { n: '05', name: 'Approve' },
] as const;

type StageName = (typeof STAGES)[number]['name'];

export interface ReportWorkspaceProps {
  open: boolean;
  onClose: () => void;
  row: Draft | null;
  onOpenDialog: (id: string) => void;
}

const Block = ({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) => (
  <div className="aix-block">
    <div className="aix-block-head">
      <h6 className="fs-15 mb-0">{title}</h6>
      {badge ? <span className="aix-badge is-ai">{badge}</span> : null}
    </div>
    <div className="aix-block-body">{children}</div>
  </div>
);

const Fact = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="aix-fact">
    <span className="aix-label">{label}</span>
    <span className="fs-13 fw-medium text-dark">{value}</span>
  </div>
);

const ReportWorkspace = ({ open, onClose, row, onOpenDialog }: ReportWorkspaceProps) => {
  const [stage, setStage] = useState<StageName>('Brief');

  useEffect(() => {
    if (open) setStage('Brief');
  }, [open, row?.id]);

  if (!open || !row) return null;

  const template = templateOf(row);
  const steps = lifecycleSteps(row);
  const saved = MINUTES_BY_HAND - MINUTES_TO_REVIEW;

  return (
    <Offcanvas
      open={open}
      onClose={onClose}
      title={row.title}
      className="aix-canvas aix-canvas-xl"
      labelledById="report_workspace_label"
      header={
        <div className="aix-pane-head">
          <span className="aix-sec-ic">
            <i className="ti ti-file-text" />
          </span>
          <div>
            <h3 className="mb-1 fs-16 fw-medium" id="report_workspace_label">
              {row.title}
            </h3>
            <p className="fs-12 text-muted mb-2">
              {row.id} · {template?.name ?? 'No template'} · for {row.audience} · signs:{' '}
              {row.approver}
            </p>
            <div className="d-flex flex-wrap gap-2">
              <span className={`aix-badge ${stateToneOf(row.state)}`}>{row.state}</span>
              <span className="aix-badge is-ai">
                <i className="ti ti-sparkles" />
                {row.confidence}% confidence
              </span>
              <span className="aix-badge">{row.reviewMinutes} min to review</span>
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
        <ul className="aix-stepper nav" role="tablist">
          {STAGES.map((entry) => (
            <li role="presentation" key={entry.n}>
              <button
                type="button"
                role="tab"
                aria-selected={stage === entry.name}
                className={`aix-stepper-btn ${stage === entry.name ? 'active' : ''}`.trim()}
                onClick={() => setStage(entry.name)}
              >
                <span className="aix-stepper-n">{entry.n}</span>
                <span className="aix-stepper-txt">
                  <span className="aix-stepper-lbl">Stage {entry.n}</span>
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
              The engine drafts; a person signs. Nothing here reaches a governor, a parent or a
              noticeboard until someone puts their name to it.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('export_reports')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('preview_report')}
              >
                <i className="ti ti-eye me-1" />
                Preview
              </ActionLink>
              <ActionLink
                className="btn btn-primary d-inline-flex align-items-center"
                onClick={() => onOpenDialog('approve_report')}
              >
                <i className="ti ti-signature me-1" />
                Send for Approval
              </ActionLink>
            </div>
          </div>
        </div>
      }
    >
      {stage === 'Brief' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <Block title="What was asked for">
              <Fact label="Report" value={row.title} />
              <Fact label="Template" value={template?.name ?? '—'} />
              <Fact label="Audience" value={row.audience} />
              <Fact label="Requested" value={row.requestedOn} />
              <Fact label="Days open" value={ageOf(row)} />
              <Fact label="Signs it" value={row.approver} />
            </Block>
          </div>
          <div className="col-12 col-xl-4">
            <Block title="What the template lays out">
              <Fact label="Sections" value={template?.sections ?? row.sections} />
              <Fact label="Languages available" value={template?.languages.length ?? 1} />
              <Fact label="Used before" value={`${template?.uses ?? 0} times`} />
              <Fact label="Written for" value={template?.audience ?? row.audience} />
            </Block>
          </div>
          <div className="col-12 col-xl-4">
            <Block title="Why it is worth drafting" badge={`${row.confidence}%`}>
              <p className="fs-13 text-muted mb-3">{row.note}</p>
              <Fact label="Review time" value={`${row.reviewMinutes} min`} />
              <Fact label="Saved against writing" value={`${saved} min a report`} />
            </Block>
          </div>
        </div>
      ) : null}

      {stage === 'Sources' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <Block title="Registers read" badge={`${row.sources.length} of 9`}>
              {row.sources.map((source) => (
                <Fact key={source} label={`${source} register`} value="Read, not retyped" />
              ))}
            </Block>
          </div>
          <div className="col-12 col-xl-6">
            <Block title="What that means">
              <p className="fs-13 text-muted mb-3">
                Every figure in this draft is read from the register that owns it and cited back to
                it. Correcting a number on its own page corrects it here, which is the only reason a
                document assembled from four sources can be trusted.
              </p>
              <Fact label="Figures retyped by hand" value="None" />
              <Fact label="Citations inline" value="Every figure" />
              <Fact label="Drift possible" value="No" />
            </Block>
          </div>
        </div>
      ) : null}

      {stage === 'Draft' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <Block title="What the engine wrote">
              <Fact label="Words" value={row.words === 0 ? 'Still writing' : row.words.toLocaleString('en-US')} />
              <Fact label="Sections filled" value={`${row.sections} of ${template?.sections ?? row.sections}`} />
              <Fact label="Confidence" value={`${row.confidence}%`} />
              <Fact label="Queue mean" value={`${QUEUE_CONFIDENCE}%`} />
            </Block>
          </div>
          <div className="col-12 col-xl-6">
            <Block title="What it flagged itself">
              <p className="fs-13 text-muted mb-3">
                Two figures had changed in their own registers since the first pass. The engine
                marked both rather than silently using the newer number, so the reviewer decides
                which version the document should carry.
              </p>
              <ActionLink
                className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => onOpenDialog('preview_report')}
              >
                <i className="ti ti-eye me-1" />
                Read the draft
              </ActionLink>
            </Block>
          </div>
        </div>
      ) : null}

      {stage === 'Review' ? (
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <Block title="What review costs">
              <Fact label="Estimated reading" value={`${row.reviewMinutes} min`} />
              <Fact label="Writing it by hand" value={`${MINUTES_BY_HAND} min a report`} />
              <Fact label="Reviewing a draft" value={`${MINUTES_TO_REVIEW} min a report`} />
              <Fact label="Net saving" value={`${saved} min`} />
            </Block>
          </div>
          <div className="col-12 col-xl-6">
            <Block title="Still to check">
              <Fact label="Flagged figures" value="2" />
              <Fact label="Sections needing a human line" value="1" />
              <Fact label="Names to confirm" value="0" />
              <Fact label="Blocking" value={row.state === 'Approved' ? 'Nothing' : 'A signature'} />
            </Block>
          </div>
        </div>
      ) : null}

      {stage === 'Approve' ? (
        <div className="row g-4">
          <div className="col-12">
            <Block title="Where it stands" badge={row.state}>
              <div className="aix-tl">
                {steps.map((step) => (
                  <div className={`aix-tl-item ${step.done ? 'is-done' : ''}`.trim()} key={step.id}>
                    <span className="aix-tl-dot" />
                    <div className="flex-fill overflow-hidden">
                      <p className="aix-tl-title">{step.title}</p>
                      <p className="fs-12 text-muted mb-1">{step.on}</p>
                      <p className="fs-13 text-muted mb-0">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Block>
          </div>
        </div>
      ) : null}
    </Offcanvas>
  );
};

export default ReportWorkspace;
