import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import ToastStack from '@components/ui/ToastStack';
import { ActionLink } from '@components/workspace';
import ImageWithBasePath from '@core/common/imageWithBasePath';
import { all_routes } from '@/routes/all_routes';
import { useToasts } from '@hooks/useToasts';
import RevenueWorkspace from './modals/RevenueWorkspace';
import RevenueModals from './modals/RevenueModals';
import type { RevenueModalId } from './modals/RevenueModals';
import type { RevenueCase } from './data/revenue.data';
import {
  bandOf,
  CASES,
  CASHFLOW_CONFIDENCE,
  COPILOT,
  FEATURED,
  FINDINGS,
  FORECAST,
  FORECAST_ACCURACY,
  FORECAST_TO,
  INSIGHTS,
  INTELLIGENCE,
  journeyStops,
  LAST_RUN,
  money,
  OPEN_CASES,
  OPPORTUNITIES,
  outstandingOf,
  PROGRAMMES,
  priorityOf,
  probBarOf,
  RECOMMENDATIONS,
  REMINDER_WINS,
  REVENUE_HEALTH,
  shortMoney,
  TERMS_ON_RECORD,
  timingLabelOf,
} from './data/revenue.data';

/** A section heading with the template's own leader rule and figure. */
const Head = ({ title, note, figure }: { title: string; note: string; figure: string }) => (
  <div className="rev-hd">
    <div className="rev-hd-line">
      <h2 className="rev-hd-title">{title}</h2>
      <span className="rev-leader" />
      <span className="rev-hd-fig">{figure}</span>
    </div>
    <p className="rev-hd-sub">{note}</p>
  </div>
);

const TERMS = ['Term 2 · 2026', 'Term 3 · 2026', 'Full academic year'];

const AiFeeForecast = () => {
  const routes = all_routes;
  const { toasts, push: pushToast, dismiss: dismissToast } = useToasts();

  const [dialog, setDialog] = useState<RevenueModalId | null>(null);
  const [openRow, setOpenRow] = useState<RevenueCase | null>(null);
  const [term, setTerm] = useState(TERMS[0]);
  const [pickerOpen, setPickerOpen] = useState(false);

  const openDialog = useCallback((id: string) => setDialog(id as RevenueModalId), []);
  const showRow = useCallback((row: RevenueCase) => {
    setDialog(null);
    setOpenRow(row);
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          {/* Page Header */}
          <div className="d-md-flex d-block align-items-center justify-content-between mb-4 flex-wrap gap-2">
            <div className="my-auto mb-2">
              <h3 className="page-title mb-1 d-flex align-items-center">
                <i className="ti ti-sparkles text-primary me-2" />
                AI Fee Forecast Center
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
                    Fee Forecast
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
                  <i className="ti ti-calendar me-2" />
                  {term}
                </ActionLink>
                <ul
                  className={`dropdown-menu dropdown-menu-end p-3 ${pickerOpen ? 'show' : ''}`.trim()}
                >
                  {TERMS.map((option) => (
                    <li key={option}>
                      <ActionLink
                        className={`dropdown-item rounded-1 ${option === term ? 'active' : ''}`.trim()}
                        onClick={() => {
                          setTerm(option);
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
                Open Workspace
              </ActionLink>
            </div>
          </div>
          {/* /Page Header */}

          {/* Section 01 — the command centre */}
          <div className="rev-hero mb-5">
            <div className="rev-hero-inner">
              <div>
                <span className="rev-hero-badge">
                  <i className="ti ti-sparkles" />
                  Revenue Intelligence Engine
                </span>
                <h1 className="rev-hero-title">
                  Term-end collection lands at <em>{shortMoney(FORECAST.expected)}</em>, and{' '}
                  {shortMoney(REMINDER_WINS)} of it depends on how nine reminders are worded.
                </h1>
                <p className="rev-hero-stmt">
                  The engine read {TERMS_ON_RECORD} terms of payment behaviour across {OPEN_CASES}{' '}
                  open cases — timing, channel, reminder response and sibling patterns — and wrote
                  the reasoning behind every figure. It forecasts; it never charges, chases or
                  contacts anyone on its own.
                </p>
                <div className="rev-acc">
                  <div className="rev-row">
                    <span>Collection forecast status</span>
                    <span className="rev-leader" />
                    <b>On track</b>
                  </div>
                  <div className="rev-row">
                    <span>Revenue health</span>
                    <span className="rev-leader" />
                    <b>{REVENUE_HEALTH} / 100</b>
                  </div>
                  <div className="rev-row">
                    <span>Cash flow confidence</span>
                    <span className="rev-leader" />
                    <b>{CASHFLOW_CONFIDENCE}%</b>
                  </div>
                  <div className="rev-row">
                    <span>Prediction accuracy · last {TERMS_ON_RECORD} terms</span>
                    <span className="rev-leader" />
                    <b>{FORECAST_ACCURACY}%</b>
                  </div>
                  <div className="rev-row">
                    <span>Last forecast</span>
                    <span className="rev-leader" />
                    <b>Today, {LAST_RUN}</b>
                  </div>
                </div>
                <div className="d-flex flex-wrap gap-2 mt-4">
                  <ActionLink
                    className="btn btn-primary d-inline-flex align-items-center"
                    onClick={() => setDialog('generate_forecast')}
                  >
                    <i className="ti ti-chart-arrows-vertical me-1" />
                    Generate Revenue Forecast
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setOpenRow(FEATURED)}
                  >
                    <i className="ti ti-bulb me-1" />
                    Explain AI Forecast
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('collection_plan')}
                  >
                    <i className="ti ti-route me-1" />
                    Generate Collection Strategy
                  </ActionLink>
                  <ActionLink
                    className="btn btn-outline-light bg-white d-inline-flex align-items-center"
                    onClick={() => setDialog('export_revenue')}
                  >
                    <i className="ti ti-file-export me-1" />
                    Export Revenue Summary
                  </ActionLink>
                </div>
              </div>

              <div className="rev-cone-panel">
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <span className="rev-lbl">Collection forecast · to {FORECAST_TO.slice(0, 6)}</span>
                  <span className="rev-tag is-likely">{FORECAST_ACCURACY}% accuracy</span>
                </div>
                <div className="rev-cone">
                  <span className="rev-cone-band" />
                  <span className="rev-cone-pin" />
                </div>
                <div className="rev-cone-axis">
                  <span>Today</span>
                  <span>31 Aug</span>
                  <span>30 Sep</span>
                </div>
                <div className="rev-row">
                  <span>Best case</span>
                  <span className="rev-leader" />
                  <b>{shortMoney(FORECAST.best)}</b>
                </div>
                <div className="rev-row">
                  <span>Expected</span>
                  <span className="rev-leader" />
                  <b>{shortMoney(FORECAST.expected)}</b>
                </div>
                <div className="rev-row">
                  <span>Low case</span>
                  <span className="rev-leader" />
                  <b>{shortMoney(FORECAST.low)}</b>
                </div>
                <p className="fs-12 text-muted mb-0">
                  The spread narrows to under $40K once the nine largest cases resolve. Everything
                  else is already predictable.
                </p>
              </div>
            </div>
          </div>

          {/* Section 02 — the case queue */}
          <Head
            title="Collection Intelligence Workspace"
            note="Every open case the engine forecast, ordered by how likely the money is to arrive rather than by how late it is."
            figure={`${CASES.length} of ${OPEN_CASES}`}
          />

          <div className="row g-4 mb-5">
            {CASES.map((row) => {
              const band = bandOf(row.probability);
              return (
                <div className="col-xl-4 col-md-6" key={row.id}>
                  <div className="rev-case">
                    <div className="rev-case-head">
                      <span className="avatar avatar-lg avatar-rounded flex-shrink-0">
                        <ImageWithBasePath src={row.parentImage} alt={row.parent} />
                      </span>
                      <div className="flex-fill overflow-hidden">
                        <p className="rev-case-name text-truncate">{row.parent}</p>
                        <p className="fs-12 text-muted mb-0 text-truncate">
                          {row.student} · {row.className} · {row.id}
                        </p>
                      </div>
                    </div>

                    <div className="rev-shelf">
                      <div>
                        <span className="rev-lbl mb-1">Outstanding</span>
                        <span className="rev-amt is-lg">{money(outstandingOf(row))}</span>
                      </div>
                      <span className={`rev-tag ${band.tone}`}>{timingLabelOf(row)}</span>
                    </div>

                    <div className="rev-case-body">
                      <div>
                        <div className="d-flex align-items-center justify-content-between gap-2 mb-2">
                          <span className="rev-lbl">Collection probability</span>
                          <span className="fs-13 fw-semibold text-dark">{row.probability}%</span>
                        </div>
                        <span className={`rev-prob ${band.tone}`}>
                          {probBarOf(row.probability).map((state, index) => (
                            <i className={state} key={`${row.id}-p${index}`} />
                          ))}
                        </span>
                      </div>

                      <div>
                        <div className="rev-row">
                          <span>Predicted payment</span>
                          <span className="rev-leader" />
                          <b>{row.predictedOn ?? 'Uncertain'}</b>
                        </div>
                        <div className="rev-row">
                          <span>Payment behaviour</span>
                          <span className="rev-leader" />
                          <b>{row.behaviour}</b>
                        </div>
                        <div className="rev-row">
                          <span>AI confidence</span>
                          <span className="rev-leader" />
                          <b>{row.confidence}%</b>
                        </div>
                      </div>

                      <div>
                        <span className="rev-lbl mb-1">Suggested strategy</span>
                        <p className="fs-12 text-muted mb-0">{row.strategy}</p>
                      </div>
                    </div>

                    <div className="rev-case-foot">
                      <ActionLink
                        className="btn btn-sm btn-primary flex-fill d-inline-flex align-items-center justify-content-center"
                        onClick={() => showRow(row)}
                      >
                        <i className="ti ti-layout-sidebar-right-expand me-1" />
                        Open Revenue Case
                      </ActionLink>
                      <span title="Generate reminder">
                        <ActionLink
                          className="rev-ico"
                          ariaLabel="Generate reminder"
                          onClick={() => {
                            setOpenRow(null);
                            setDialog('generate_reminder');
                          }}
                        >
                          <i className="ti ti-bell" />
                        </ActionLink>
                      </span>
                      <span title="Compare cases">
                        <ActionLink
                          className="rev-ico"
                          ariaLabel="Compare cases"
                          onClick={() => setDialog('compare_cases')}
                        >
                          <i className="ti ti-git-compare" />
                        </ActionLink>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 03 — the findings */}
          <Head
            title="Why the AI Forecast Says What It Says"
            note="Reasoning and evidence on the left, what it means in money on the right."
            figure={`${FINDINGS.length} findings`}
          />

          <div className="row g-4 mb-5">
            {FINDINGS.map((finding) => {
              const band = bandOf(finding.probability);
              return (
                <div className="col-12 col-xl-6" key={finding.id}>
                  <div className="rev-note">
                    <div className="rev-note-body">
                      <div className="d-flex align-items-center gap-2 flex-wrap mb-2">
                        <span className={`rev-tag ${band.tone}`}>
                          <i className={finding.icon} />
                          {band.band}
                        </span>
                      </div>
                      <p className="rev-note-obs">{finding.observation}</p>

                      <span className="rev-lbl mb-2">AI reasoning</span>
                      <p className="fs-13 text-muted lh-base mb-3">{finding.why}</p>

                      <span className="rev-lbl mb-1">Supporting evidence</span>
                      {finding.evidence.map((item) => (
                        <div className="rev-ev" key={item.label}>
                          <span>{item.label}</span>
                          <span className="rev-leader" />
                          <b>{item.value}</b>
                        </div>
                      ))}
                    </div>

                    <div className={`rev-rail ${band.tone}`}>
                      <div>
                        <span className="rev-lbl mb-1">Financial impact</span>
                        <span className="rev-amt is-md">
                          {finding.amount >= 10_000
                            ? shortMoney(finding.amount)
                            : money(finding.amount)}
                        </span>
                        <span className="d-block fs-12 text-muted mt-1">{finding.amountNote}</span>
                      </div>

                      <div>
                        <span className="rev-lbl mb-2">Confidence</span>
                        <span className={`rev-prob ${band.tone} is-sm`}>
                          {probBarOf(finding.confidence).map((state, index) => (
                            <i className={state} key={`${finding.id}-c${index}`} />
                          ))}
                        </span>
                        <span className="d-block fs-13 fw-semibold text-dark mt-2">
                          {finding.confidence}%
                        </span>
                      </div>

                      <div className="mt-auto">
                        <span className="rev-lbl mb-1">Suggested action</span>
                        <p className="fs-12 text-muted mb-3">{finding.action}</p>
                        <ActionLink
                          className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                          onClick={() => setDialog('collection_plan')}
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

          {/* Section 04 — the intelligence centre */}
          <Head
            title="Revenue Intelligence Center"
            note="Eight readings across the whole ledger, each with what the engine would do about it."
            figure={`${INTELLIGENCE.length} readings`}
          />

          <div className="row g-4 mb-5">
            {INTELLIGENCE.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="rev-int">
                  <span className="rev-int-fig">{entry.figure}</span>
                  <p className="rev-int-title">{entry.title}</p>
                  <div className="rev-int-body">
                    <span className="rev-lbl mb-1">AI finding</span>
                    <p className="fs-13 text-muted mb-3">{entry.finding}</p>
                    <span className="rev-lbl mb-1">Recommendation</span>
                    <p className="fs-13 text-muted mb-3">{entry.recommendation}</p>
                    <span className="rev-lbl mb-1">Expected outcome</span>
                    <p className="fs-13 fw-medium text-dark mb-0">{entry.outcome}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 05 — the collection centre */}
          <Head
            title="Smart Collection Center"
            note="Ranked by money moved against the finance hours it asks for. Nothing is sent until the bursar approves it."
            figure={`${RECOMMENDATIONS.length} actions`}
          />

          <div className="row g-4 mb-5">
            {RECOMMENDATIONS.map((entry, index) => {
              const priority = priorityOf(index + 1);
              return (
                <div className="col-12 col-xl-6" key={entry.id}>
                  <div className="rev-rec">
                    <div className="rev-rec-top">
                      <span className="rev-lbl">AI confidence {entry.confidence}%</span>
                      <span className={`rev-tag ${priority.tone}`}>{priority.band}</span>
                    </div>
                    <div className="rev-rec-body">
                      <p className="rev-rec-title">{entry.title}</p>
                      <p className="fs-13 text-muted mb-0">{entry.note}</p>
                    </div>
                    <div className="rev-rec-foot">
                      <div className="rev-row">
                        <span>Expected</span>
                        <span className="rev-leader" />
                        <b>{entry.expected}</b>
                      </div>
                      <div className="rev-row">
                        <span>Timeline</span>
                        <span className="rev-leader" />
                        <b>{entry.timeline}</b>
                      </div>
                      <ActionLink
                        className="btn btn-sm btn-outline-light bg-white mt-3 d-inline-flex align-items-center"
                        onClick={() => openDialog(entry.modal)}
                      >
                        <i className="ti ti-bolt me-1" />
                        Apply recommendation
                      </ActionLink>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Section 06 — the opportunity studio */}
          <Head
            title="Revenue Opportunity Studio"
            note="Where the money actually sits once timing is separated from risk."
            figure={`${OPPORTUNITIES.length} pools`}
          />

          <div className="row g-4 mb-5">
            {OPPORTUNITIES.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="rev-opp">
                  <span className="rev-opp-badge">{entry.badge}</span>
                  <p className="rev-opp-title">{entry.title}</p>
                  <p className="fs-13 text-muted mb-0">{entry.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Section 07 — the copilot */}
          <Head
            title="Finance Copilot"
            note="Everything arrives as a draft for the bursar to approve. Nothing is sent to a parent and no balance is changed automatically."
            figure={`${COPILOT.length} routines`}
          />

          <div className="row g-3 mb-5">
            {COPILOT.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.n}>
                <ActionLink className="rev-do" onClick={() => openDialog(entry.modal)}>
                  <span className="rev-do-ix">{entry.n}</span>
                  <span className="flex-fill overflow-hidden">
                    <span className="d-block fs-14 fw-medium text-dark">{entry.title}</span>
                    <span className="d-block fs-12 text-muted">{entry.note}</span>
                  </span>
                  <span className="rev-do-run">Run</span>
                </ActionLink>
              </div>
            ))}
          </div>

          {/* Section 08 — the journey */}
          <Head
            title="Revenue Journey"
            note={`The full arc of case ${FEATURED.id}, from the invoice to the point it closes.`}
            figure={`${journeyStops(FEATURED).length} stops`}
          />

          <div className="card mb-5">
            <div className="card-body">
              <div className="rev-journey">
                {journeyStops(FEATURED).map((stop) => (
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
              </div>
            </div>
          </div>

          {/* Section 09 — the programmes */}
          <Head
            title="Financial Opportunity Center"
            note="Where the finance team can act beyond individual reminders."
            figure={`${PROGRAMMES.length} programmes`}
          />

          <div className="row g-4 mb-5">
            {PROGRAMMES.map((entry) => (
              <div className="col-xl-3 col-md-6" key={entry.id}>
                <div className="rev-fin">
                  <span className="rev-fin-ic">
                    <i className="ti ti-coin" />
                  </span>
                  <p className="rev-fin-title">{entry.title}</p>
                  <div className="rev-fin-foot">
                    <span className="fs-12 text-muted">{entry.note}</span>
                    <span className="rev-amt">{entry.figure}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 10 — the conclusions */}
          <Head
            title="AI Insight Center"
            note={`Drawn across all ${OPEN_CASES} cases and ${TERMS_ON_RECORD} terms of history, written as intelligence rather than as a report.`}
            figure={`${INSIGHTS.length} conclusions`}
          />

          <div className="row g-4 mb-4">
            {INSIGHTS.map((entry) => (
              <div className="col-xl-4 col-md-6" key={entry.id}>
                <div className="rev-ins">
                  <span className="rev-ins-fig">{entry.figure}</span>
                  <p className="rev-ins-title">{entry.title}</p>
                  <p className="fs-13 text-muted mb-0">{entry.text}</p>
                </div>
              </div>
            ))}
            <div className="col-xl-4 col-md-6">
              <div className="rev-ins">
                <span className="rev-ins-fig">{CASES.length}</span>
                <p className="rev-ins-title">The whole queue</p>
                <p className="fs-13 text-muted mb-3">
                  {CASES.length} cases are shown here. The forecast covers {OPEN_CASES}.
                </p>
                <ActionLink
                  className="btn btn-sm btn-outline-light bg-white d-inline-flex align-items-center"
                  onClick={() => setDialog('all_cases')}
                >
                  <i className="ti ti-list me-1" />
                  All revenue cases
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RevenueWorkspace
        open={openRow !== null}
        onClose={() => setOpenRow(null)}
        row={openRow}
        onOpenDialog={openDialog}
      />

      <RevenueModals
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

export default AiFeeForecast;
