import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import ReportWorkspace from './modals/ReportWorkspace';
import ReportModals from './modals/ReportModals';
import type { ReportModalId } from './modals/ReportModals';
import type { Draft } from './data/reports.data';
import {
  ageOf,
  APPROVAL_RATE,
  AWAITING_APPROVAL,
  backlogLabel,
  COPILOT,
  DRAFTS,
  DRAFTS_OPEN,
  FEATURED,
  FINDINGS,
  HOURS_SAVED,
  INSIGHTS,
  LANGUAGES,
  LAST_RUN,
  lifecycleSteps,
  MOST_USED,
  priorityOf,
  QUEUE_CONFIDENCE,
  REPORTS_APPROVED,
  REPORTS_GENERATED,
  RUN_DURATION,
  stateToneOf,
  SUGGESTIONS,
  templateOf,
  TEMPLATES,
  WAITING,
  WORDS_DRAFTED,
} from './data/reports.data';

/** A numbered section heading, matching the shape the siblings use. */
const Section = ({
  icon,
  n,
  title,
  note,
  action,
}: {
  icon: string;
  n: string;
  title: string;
  note: string;
  action?: React.ReactNode;
}) => (
  <div className="aix-sec">
    <span className="aix-sec-ic">
      <i className={icon} />
    </span>
    <div>
      <span className="aix-eyebrow">Section {n}</span>
      <h2 className="fs-18 fw-medium mb-1">{title}</h2>
      <p className="fs-13 text-muted mb-0">{note}</p>
    </div>
    {action ? <div className="ms-auto d-flex gap-2 flex-wrap">{action}</div> : null}
  </div>
);

const AiReportGenerator = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<ReportModalId | null>(null);
  const [openRow, setOpenRow] = useState<Draft | null>(null);

  const openDialog = useCallback((id: string) => setDialog(id as ReportModalId), []);
  const showRow = useCallback((row: Draft) => {
    setDialog(null);
    setOpenRow(row);
  }, []);

  const lifecycle = lifecycleSteps(FEATURED);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between flex-wrap gap-2 mb-3">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Report Generator
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
                    Report Generator
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap">
              <button
                type="button"
                className="btn btn-outline-light bg-white me-2 mb-2"
                onClick={() => setDialog('generate_report')}
              >
                <i className="ti ti-refresh me-1" />
                Re-run
              </button>
              <ActionLink
                className="btn btn-primary mb-2"
                onClick={() => setDialog('export_reports')}
              >
                <i className="ti ti-file-export me-1" />
                Export
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the drafting desk */}
          <div className="aix-hero mb-5">
            <span className="aix-orb aix-orb-1" />
            <span className="aix-orb aix-orb-2" />
            <span className="aix-orb aix-orb-3" />
            <div className="aix-hero-body">
              <span className="aix-status">
                <span className="aix-dot aix-dot-live" />
                Report Intelligence Engine · idle
              </span>
              <h1 className="aix-hero-title">
                {REPORTS_GENERATED.toLocaleString('en-US')} reports written, and{' '}
                <em>not one of them sent unsigned</em>.
              </h1>
              <p className="fs-14 text-muted lh-base mb-0">
                The engine drafts from the registers that own each figure, then stops. Every
                document waits here until a person puts their name to it — {AWAITING_APPROVAL} are
                waiting now, and {backlogLabel()} of reading sits behind the open queue.
              </p>

              <div className="aix-hero-rail">
                <span className="aix-hero-stat">
                  <span className="aix-label">Reports generated</span>
                  <span className="aix-hero-val">{REPORTS_GENERATED.toLocaleString('en-US')}</span>
                </span>
                <span className="aix-hero-stat">
                  <span className="aix-label">Templates</span>
                  <span className="aix-hero-val">{TEMPLATES.length}</span>
                </span>
                <span className="aix-hero-stat">
                  <span className="aix-label">Time returned</span>
                  <span className="aix-hero-val">{HOURS_SAVED}h</span>
                </span>
                <span className="aix-hero-stat">
                  <span className="aix-label">Drafts open</span>
                  <span className="aix-hero-val">{DRAFTS_OPEN}</span>
                </span>
                <span className="aix-hero-stat">
                  <span className="aix-label">Approved</span>
                  <span className="aix-hero-val">{REPORTS_APPROVED.toLocaleString('en-US')}</span>
                </span>
                <span className="aix-hero-stat">
                  <span className="aix-label">Languages</span>
                  <span className="aix-hero-val">{LANGUAGES.length}</span>
                </span>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4">
                <ActionLink
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={() => setDialog('generate_report')}
                >
                  <i className="ti ti-sparkles me-1" />
                  Generate a Report
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setOpenRow(FEATURED)}
                >
                  <i className="ti ti-bulb me-1" />
                  Explain a Draft
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('approve_report')}
                >
                  <i className="ti ti-signature me-1" />
                  Send for Approval
                </ActionLink>
                <ActionLink
                  className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('export_reports')}
                >
                  <i className="ti ti-file-export me-1" />
                  Export the Library
                </ActionLink>
              </div>

              <p className="fs-12 text-muted mb-0 mt-3">
                Last pass finished at {LAST_RUN} in {RUN_DURATION} · queue confidence{' '}
                {QUEUE_CONFIDENCE}% · {WORDS_DRAFTED.toLocaleString('en-US')} words drafted and
                held
              </p>
            </div>
            <div className="aix-hero-art">
              <span className="aix-hero-art-ring" />
              <span className="aix-hero-art-ring" />
              <span className="aix-hero-art-core">
                <i className="ti ti-file-text" />
              </span>
            </div>
          </div>

          {/* Section 02 — the queue */}
          <Section
            icon="ti ti-stack"
            n="02"
            title="Drafting Queue"
            note={`Every draft the engine is holding, ordered by what each returns for the reading it asks of you.`}
            action={
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('preview_report')}
              >
                <i className="ti ti-list me-1" />
                All drafts
              </ActionLink>
            }
          />

          <div className="row g-4 mb-5">
            {DRAFTS.map((row) => {
              const template = templateOf(row);
              return (
                <div className="col-xl-4 col-md-6" key={row.id}>
                  <div className="aix-profile">
                    <div className="aix-profile-media">
                      <span className="aix-sec-ic">
                        <i className={template?.icon ?? 'ti ti-file-text'} />
                      </span>
                    </div>
                    <div className="aix-profile-main">
                      <p className="aix-profile-name">{row.title}</p>
                      <p className="fs-12 text-muted mb-2">
                        {row.id} · {template?.name ?? '—'} · for {row.audience}
                      </p>
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        <span className={`aix-badge ${stateToneOf(row.state)}`}>{row.state}</span>
                        <span className="aix-badge is-ai">
                          <i className="ti ti-sparkles" />
                          {row.confidence}%
                        </span>
                      </div>
                      <p className="fs-13 text-muted mb-3">{row.note}</p>
                      <div className="aix-caseline">
                        <span className="aix-caseline-item">
                          <i className="ti ti-link" />
                          <span className="aix-caseline-txt">
                            {row.sources.length} registers read
                          </span>
                        </span>
                        <span className="aix-caseline-item">
                          <i className="ti ti-clock" />
                          <span className="aix-caseline-txt">{row.reviewMinutes} min to review</span>
                        </span>
                        <span className="aix-caseline-item">
                          <i className="ti ti-signature" />
                          <span className="aix-caseline-txt">{row.approver} signs</span>
                        </span>
                      </div>
                    </div>
                    <div className="aix-profile-side">
                      <span className="aix-label">Confidence</span>
                      <span className={`aix-conf-track aix-p-${row.confidence}`}>
                        <span className="aix-conf-fill" />
                      </span>
                      <span className="aix-conf-val">{row.confidence}%</span>
                      <span className="aix-label mt-3">Age</span>
                      <span className="fs-13 fw-medium text-dark">{ageOf(row)} days</span>
                      <div className="aix-side-foot">
                        <ActionLink
                          className="btn btn-sm btn-primary w-100 d-inline-flex align-items-center justify-content-center"
                          onClick={() => showRow(row)}
                        >
                          <i className="ti ti-eye me-1" />
                          Open
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 03 — the reasoning */}
          <Section
            icon="ti ti-bulb"
            n="03"
            title="Why the Engine Wrote It This Way"
            note={`${FINDINGS.length} findings about how these documents are put together, each with the evidence behind it.`}
          />

          <div className="row g-4 mb-5">
            {FINDINGS.map((finding) => (
              <div className="col-12 col-xl-6" key={finding.id}>
                <div className={`aix-explain aix-explain-accent accent-${finding.accent}`}>
                  <div className="aix-explain-head">
                    <span className="aix-sec-ic">
                      <i className={finding.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="aix-explain-obs">{finding.observation}</p>
                      <span className="aix-badge is-ai">
                        <i className="ti ti-sparkles" />
                        {finding.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="aix-explain-body">
                    <p className="fs-13 text-muted lh-base mb-3">{finding.why}</p>
                    <div className="aix-sig-grid">
                      {finding.evidence.map((item) => (
                        <span className="aix-sig" key={item.label}>
                          <span className="aix-sig-lbl">{item.label}</span>
                          <span className="aix-sig-val">{item.value}</span>
                        </span>
                      ))}
                    </div>
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white mt-3 d-inline-flex align-items-center"
                      onClick={() => openDialog(finding.modal)}
                    >
                      <i className="ti ti-arrow-right me-1" />
                      {finding.action}
                    </ActionLink>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 04 — the library */}
          <Section
            icon="ti ti-template"
            n="04"
            title="Template Library"
            note={`${TEMPLATES.length} templates account for every report the engine has written. ${MOST_USED.name} accounts for most of them.`}
            action={
              <ActionLink
                className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                onClick={() => setDialog('new_template')}
              >
                <i className="ti ti-plus me-1" />
                New template
              </ActionLink>
            }
          />

          <div className="row g-4 mb-5">
            {TEMPLATES.map((template) => (
              <div className="col-xl-4 col-md-6" key={template.id}>
                <div className="aix-rec">
                  <div className="aix-rec-head">
                    <span className="aix-sec-ic">
                      <i className={template.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <p className="aix-rec-title">{template.name}</p>
                      <p className="fs-12 text-muted mb-0">For {template.audience}</p>
                    </div>
                  </div>
                  <div className="aix-rec-body">
                    <p className="fs-13 text-muted mb-0">{template.note}</p>
                  </div>
                  <div className="aix-rec-stats">
                    <span className="aix-rec-stat">
                      <span className="aix-rec-stat-lbl">Used</span>
                      <span className="aix-rec-stat-val">{template.uses}</span>
                    </span>
                    <span className="aix-rec-stat">
                      <span className="aix-rec-stat-lbl">Sections</span>
                      <span className="aix-rec-stat-val">{template.sections}</span>
                    </span>
                    <span className="aix-rec-stat">
                      <span className="aix-rec-stat-lbl">Languages</span>
                      <span className="aix-rec-stat-val">{template.languages.length}</span>
                    </span>
                  </div>
                  <div className="aix-rec-foot">
                    <ActionLink
                      className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                      onClick={() => setDialog('generate_report')}
                    >
                      <i className="ti ti-sparkles me-1" />
                      Draft from this
                    </ActionLink>
                    {template.languages.length > 1 ? (
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                        onClick={() => setDialog('translate')}
                      >
                        <i className="ti ti-language me-1" />
                        {template.languages.length} languages
                      </ActionLink>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05 — what to draft next */}
          <Section
            icon="ti ti-list-check"
            n="05"
            title="What to Draft Next"
            note="Ranked by the readers each reaches against the minutes drafting costs. Nothing is written until you ask for it."
          />

          <div className="row g-4 mb-5">
            {SUGGESTIONS.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className={`aix-action accent-${priority.accent}`}>
                    <span className="aix-action-ic">
                      <i className={entry.icon} />
                    </span>
                    <div className="flex-fill overflow-hidden">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                        <p className="fs-14 fw-medium text-dark mb-0">{entry.title}</p>
                        <span className="aix-badge">{priority.band}</span>
                        <span className="aix-badge is-ai">
                          <i className="ti ti-sparkles" />
                          {entry.confidence}%
                        </span>
                      </div>
                      <p className="fs-13 text-muted mb-2">{entry.note}</p>
                      <div className="d-flex align-items-center gap-3 flex-wrap">
                        <span className="fs-12 text-muted">
                          Reaches <b className="text-dark">{entry.reach}</b>
                        </span>
                        <span className="fs-12 text-muted">
                          Drafting <b className="text-dark">{entry.minutes} min</b>
                        </span>
                        <span className="fs-12 text-muted">
                          Due <b className="text-dark">{entry.due}</b>
                        </span>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white ms-auto d-inline-flex align-items-center"
                          onClick={() => openDialog(entry.modal)}
                        >
                          <i className="ti ti-sparkles me-1" />
                          Draft it
                        </ActionLink>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 06 — the copilot */}
          <Section
            icon="ti ti-robot"
            n="06"
            title="Report Copilot"
            note={`${COPILOT.length} things the copilot can do with the library. Everything it produces stops at approval.`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.title}>
                <ActionLink className="aix-res" onClick={() => openDialog(entry.modal)}>
                  <span className="aix-sec-ic">
                    <i className={entry.icon} />
                  </span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <i className="ti ti-arrow-right aix-res-go" />
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 07 — the lifecycle */}
          <Section
            icon="ti ti-timeline"
            n="07"
            title="How a Report Reaches a Reader"
            note={`The full arc of ${FEATURED.title}, from the day it was asked for. It cannot skip the signature.`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="aix-tl">
                {lifecycle.map((step) => (
                  <div className={`aix-tl-item ${step.done ? 'is-done' : ''}`.trim()} key={step.id}>
                    <span className="aix-tl-dot" />
                    <div className="flex-fill overflow-hidden">
                      <p className="aix-tl-title">
                        <i className={`${step.icon} me-2 text-muted`} />
                        {step.title}
                      </p>
                      <p className="fs-12 text-muted mb-1">{step.on}</p>
                      <p className="fs-13 text-muted mb-0">{step.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 08 — what the library shows */}
          <Section
            icon="ti ti-chart-bar"
            n="08"
            title="Usage"
            note={`${INSIGHTS.length} readings across everything the engine has written, counted rather than stated.`}
          />

          <div className="row g-4 mb-4">
            {INSIGHTS.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className="aix-insight">
                  <div className="aix-insight-top">
                    <span className="aix-insight-ic">
                      <i className="ti ti-report" />
                    </span>
                    <span className="aix-score">{entry.figure}</span>
                  </div>
                  <p className="fs-14 fw-medium text-dark mb-1">{entry.title}</p>
                  <p className="aix-insight-txt">{entry.text}</p>
                </div>
              </div>
            ))}
            <div className="col-xl-4 col-md-6">
              <div className="aix-insight">
                <div className="aix-insight-top">
                  <span className="aix-insight-ic">
                    <i className="ti ti-signature" />
                  </span>
                  <span className="aix-score">{APPROVAL_RATE}%</span>
                </div>
                <p className="fs-14 fw-medium text-dark mb-1">Signed, not sent</p>
                <p className="aix-insight-txt mb-3">
                  {WAITING.length} drafts on this page are waiting on a person. That is the whole
                  point of the page.
                </p>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('approve_report')}
                >
                  <i className="ti ti-signature me-1" />
                  Send one for approval
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReportWorkspace
        open={openRow !== null}
        onClose={() => setOpenRow(null)}
        row={openRow}
        onOpenDialog={openDialog}
      />

      <ReportModals
        active={dialog}
        onClose={() => setDialog(null)}
        row={openRow ?? FEATURED}
        onToast={pushToast}
        onOpenRow={showRow}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </>
  );
};

export default AiReportGenerator;
